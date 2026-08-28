// ── Science Bowl Online Arena — Leaderboard (Cloudflare Durable Object) ───────
//
// Singleton DO at /parties/leaderboard/global.
//
// Identity model: a callsign is claimed once, first-come-first-served. Claiming
// mints a secret token that the browser keeps in localStorage; every later
// action must present it. There are no passwords and no recovery — whoever
// holds the token owns the name.
//
// Score authority: clients never report their own scores. GameRoom verifies a
// player's token when they connect, and submits results itself when the game
// ends. The /verify and /submit actions are unreachable from the public router
// (see worker.js) — only direct DO-to-DO calls can use them.

const NAME_RE    = /^[A-Z0-9_][A-Z0-9_ -]{1,14}[A-Z0-9_]$/; // 3–16 chars
const MIN_ROUNDS = 5;   // shorter games don't count, to stop score farming
const MIN_PLAYERS = 2;  // solo games don't count either
const WEEK_MS    = 7 * 24 * 60 * 60 * 1000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function normalize(name) {
  return (name || '').trim().toUpperCase().replace(/\s+/g, ' ').slice(0, 16);
}

export class Leaderboard {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sql = state.storage.sql;

    state.blockConcurrencyWhile(async () => {
      this.sql.exec(`CREATE TABLE IF NOT EXISTS users (
        name_lc    TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        token      TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`);
      this.sql.exec(`CREATE TABLE IF NOT EXISTS results (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name_lc   TEXT NOT NULL,
        score     INTEGER NOT NULL,
        won       INTEGER NOT NULL,
        rounds    INTEGER NOT NULL,
        level     TEXT,
        played_at INTEGER NOT NULL
      )`);
      this.sql.exec(`CREATE INDEX IF NOT EXISTS idx_results_name ON results(name_lc)`);
      this.sql.exec(`CREATE INDEX IF NOT EXISTS idx_results_time ON results(played_at)`);
    });
  }

  row(query, ...bind) {
    const out = this.sql.exec(query, ...bind).toArray();
    return out.length ? out[0] : null;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || '';

    if (request.method === 'GET') {
      if (action === 'check') return this.check(url.searchParams.get('name'));
      if (action === 'top')   return this.top(url.searchParams.get('range'));
      return json({ error: 'Unknown action' }, 404);
    }

    if (request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'Bad JSON' }, 400); }
      if (action === 'claim')  return this.claim(body);
      if (action === 'verify') return this.verify(body);
      if (action === 'submit') return this.submit(body);
      return json({ error: 'Unknown action' }, 404);
    }

    return json({ error: 'Not found' }, 404);
  }

  // ── identity ───────────────────────────────────────────────────────────────

  // Is this callsign free? Used for live feedback while typing.
  check(rawName) {
    const name = normalize(rawName);
    if (!NAME_RE.test(name)) {
      return json({ available: false, reason: 'invalid' });
    }
    const taken = this.row(`SELECT 1 FROM users WHERE name_lc = ?`, name.toLowerCase());
    return json({ available: !taken, reason: taken ? 'taken' : null });
  }

  // Claim a new callsign, or re-authenticate an existing one with its token.
  claim({ name: rawName, token }) {
    const name = normalize(rawName);
    if (!NAME_RE.test(name)) {
      return json({ ok: false, reason: 'invalid',
        error: 'Use 3–16 characters: letters, numbers, spaces, _ or -.' }, 400);
    }

    const nameLc = name.toLowerCase();
    const existing = this.row(`SELECT name, token FROM users WHERE name_lc = ?`, nameLc);

    if (existing) {
      // Already claimed. Only the token holder gets back in.
      if (token && token === existing.token) {
        return json({ ok: true, name: existing.name, token: existing.token, returning: true });
      }
      return json({ ok: false, reason: 'taken',
        error: 'That callsign is already taken. Pick another.' }, 409);
    }

    const fresh = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    this.sql.exec(
      `INSERT INTO users (name_lc, name, token, created_at) VALUES (?, ?, ?, ?)`,
      nameLc, name, fresh, Date.now()
    );
    return json({ ok: true, name, token: fresh, returning: false });
  }

  // Internal: does this (name, token) pair own the callsign?
  verify({ name: rawName, token }) {
    const name = normalize(rawName);
    if (!name || !token) return json({ ok: false });
    const user = this.row(`SELECT name, token FROM users WHERE name_lc = ?`, name.toLowerCase());
    return json({ ok: !!user && user.token === token, name: user ? user.name : null });
  }

  // ── results ────────────────────────────────────────────────────────────────

  // Internal: GameRoom reports a finished game. Never called by a browser.
  submit({ entries, rounds, level, players }) {
    if (!Array.isArray(entries) || !entries.length) return json({ ok: false });
    if ((rounds || 0) < MIN_ROUNDS)   return json({ ok: false, reason: 'too-short' });
    if ((players || 0) < MIN_PLAYERS) return json({ ok: false, reason: 'too-few-players' });

    const now = Date.now();
    let written = 0;

    for (const e of entries) {
      const name = normalize(e.name);
      if (!name) continue;
      const nameLc = name.toLowerCase();
      // Trust nothing that isn't a claimed callsign.
      const user = this.row(`SELECT token FROM users WHERE name_lc = ?`, nameLc);
      if (!user || user.token !== e.token) continue;

      this.sql.exec(
        `INSERT INTO results (name_lc, score, won, rounds, level, played_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        nameLc, Math.trunc(e.score) || 0, e.won ? 1 : 0,
        Math.trunc(rounds) || 0, level || null, now
      );
      written++;
    }

    return json({ ok: true, written });
  }

  // Public standings.
  top(range) {
    const weekly = range === 'week';
    const since = weekly ? Date.now() - WEEK_MS : 0;

    const rows = this.sql.exec(
      `SELECT u.name        AS name,
              COUNT(r.id)   AS games,
              SUM(r.won)    AS wins,
              SUM(r.score)  AS points,
              MAX(r.score)  AS best,
              MAX(r.played_at) AS last_at
         FROM results r
         JOIN users u ON u.name_lc = r.name_lc
        WHERE r.played_at >= ?
        GROUP BY r.name_lc
        ORDER BY wins DESC, points DESC, games ASC
        LIMIT 50`,
      since
    ).toArray();

    return json({
      range: weekly ? 'week' : 'all',
      updated: Date.now(),
      standings: rows.map((r, i) => ({
        rank:   i + 1,
        name:   r.name,
        games:  Number(r.games)  || 0,
        wins:   Number(r.wins)   || 0,
        points: Number(r.points) || 0,
        best:   Number(r.best)   || 0,
      })),
    });
  }
}

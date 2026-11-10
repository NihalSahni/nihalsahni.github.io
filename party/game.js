// ── Science Bowl Online Arena — Game Room (Cloudflare Durable Object) ─────────

import { hasBlockedWord } from './blocklist.js';

function fuzzyMatch(a, b) {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  if (nb.length <= 3) return false;
  const thr = Math.max(2, Math.floor(Math.max(na.length, nb.length) * 0.25));
  return lev(na, nb) <= thr;
}

function lev(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => i || j));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
}

// Must match readingTimeFor() and the 2.2s result pause in Online/index.html,
// so the server agrees with the players' screens about when reading is over.
function readingMsFor(text, readAloud) {
  const words = (text || '').trim().split(/\s+/).length;
  if (readAloud) return Math.min(30, Math.max(3, Math.ceil(words * 0.31))) * 1000;
  return Math.min(15, Math.max(3, Math.ceil(words * 0.25))) * 1000;
}
const REOPEN_DELAY_MS = 2200;

// A player's token is a secret. Strip it (and the verified flag) from anything
// that leaves the room, so it never reaches the other clients.
// Room names show up in everyone's Open Rooms list, so keep them short and to
// plain characters.
function cleanRoomName(s) {
  return String(s || '').replace(/[^A-Za-z0-9 '!?&.,:-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);
}

function publicPlayer(p) {
  return { id: p.id, name: p.name, team: p.team, isHost: p.isHost, ready: p.ready };
}

export class GameRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    // Map<WebSocket, { id, name, team, isHost, ready }>
    this.sessions = new Map();
    this.hostWs = null;
    this.phase = 'LOBBY';
    this.settings = { level: 'HS', subjects: [], rounds: 20 };
    this.isPublic = false;
    this.roomName = '';
    this.round = 0;
    this.scores = { my: 0, en: 0 };
    this.teamLock = { my: false, en: false };
    this.currentQuestion = null;
    this.buzzedWs = null;
    this.buzzedTeam = null;
    this.readEndsAt = 0;     // when the reading period ends (ms timestamp)
    this.readMsLeft = 0;     // reading time left at the moment of the buzz
    this.kicked = new Set(); // names the host removed; they can't rejoin this room
    this.stats = new Map();  // player id -> how they did this match (for the host's report)
    this.questionShownAt = 0;
    this.roomId = '';
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (!this.roomId) this.roomId = url.pathname.split('/').pop();

    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      server.accept();
      this.handleConnect(server, url);
      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('Expected WebSocket', { status: 426 });
  }

  // ── connection ─────────────────────────────────────────────────────────────
  handleConnect(ws, url) {
    let name = (url.searchParams.get('name') || 'PLAYER').toUpperCase().slice(0, 16);
    if (hasBlockedWord(name)) name = 'PLAYER';
    const token = url.searchParams.get('token') || '';
    if (this.kicked.has(name)) {
      this.send(ws, { type: 'kicked' });
      try { ws.close(4001, 'kicked'); } catch (_) {}
      return;
    }
    const isFirst = this.sessions.size === 0;
    if (isFirst) this.hostWs = ws;

    const team = this.assignTeam();
    const player = { id: crypto.randomUUID(), name, team, isHost: isFirst, ready: false,
                     token, verified: false };
    this.sessions.set(ws, player);

    // Confirm the callsign really belongs to this player. Until this resolves
    // (and if it fails) the player simply doesn't count toward the leaderboard.
    if (token) this.verifyPlayer(player);

    this.send(ws, {
      type: 'welcome',
      you: publicPlayer(player),
      players: this.playerList(),
      isHost: isFirst,
      roomCode: this.roomId,
      settings: this.settings,
      isPublic: this.isPublic,
      roomName: this.roomName,
      phase: this.phase,
      scores: { ...this.scores },
      round: this.round,
    });
    this.broadcast({ type: 'playerJoined', player: publicPlayer(player) }, ws);

    ws.addEventListener('message', e => this.handleMessage(e.data, ws));
    ws.addEventListener('close',   () => this.handleClose(ws));
    ws.addEventListener('error',   () => this.handleClose(ws));

    this.notifyLobby();
  }

  assignTeam() {
    let my = 0, en = 0;
    for (const p of this.sessions.values()) { if (p.team === 'my') my++; else if (p.team === 'en') en++; }
    return my <= en ? 'my' : 'en';
  }

  // ── messages ───────────────────────────────────────────────────────────────
  handleMessage(raw, ws) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    const player = this.sessions.get(ws);
    if (!player) return;

    switch (msg.type) {

      case 'updateSettings':
        if (!player.isHost) return;
        this.settings = { ...this.settings, ...msg.settings };
        this.broadcast({ type: 'settingsUpdated', settings: this.settings });
        break;

      case 'setPublic':
        if (!player.isHost) return;
        this.isPublic = !!msg.public;
        this.broadcast({ type: 'publicUpdated', isPublic: this.isPublic });
        this.notifyLobby();
        break;

      case 'setRoomName': {
        if (!player.isHost) return;
        const name = cleanRoomName(msg.name);
        if (hasBlockedWord(name)) { this.send(ws, { type: 'roomNameRejected' }); return; }
        this.roomName = name;
        this.broadcast({ type: 'roomNameUpdated', roomName: this.roomName });
        this.notifyLobby();
        break;
      }

      case 'ready':
        player.ready = !player.ready;
        this.broadcast({ type: 'playerReadyChanged', playerId: player.id, ready: player.ready });
        break;

      // Only the host picks teams. The host may also sit out as a spectator
      // ('spec'); other players are always on a team.
      case 'changeTeam': {
        if (!player.isHost || this.phase !== 'LOBBY') return;
        const target = this.findPlayer(msg.playerId);
        if (!target) return;
        const team = msg.team === 'spec' && target.isHost ? 'spec' : msg.team === 'en' ? 'en' : 'my';
        target.team = team;
        this.broadcast({ type: 'playerTeamChanged', playerId: target.id, team });
        break;
      }

      case 'kick': {
        if (!player.isHost) return;
        const targetWs = this.findSocket(msg.playerId);
        if (!targetWs || targetWs === ws) return;
        this.kicked.add(this.sessions.get(targetWs).name);
        this.send(targetWs, { type: 'kicked' });
        this.handleClose(targetWs);
        try { targetWs.close(4001, 'kicked'); } catch (_) {}
        break;
      }

      case 'start':
        if (!player.isHost || this.phase !== 'LOBBY') return;
        if (!this.settings.level || !this.settings.subjects?.length) return;
        this.phase = 'READING';
        this.round = 0;
        this.scores = { my: 0, en: 0 };
        this.stats = new Map();
        this.broadcast({ type: 'gameStarted', settings: this.settings });
        break;

      // The host ran out of questions before the match length was reached.
      case 'gameOver':
        if (!player.isHost) return;
        if (this.phase !== 'READING' && this.phase !== 'RESULT') return;
        this.endGame(this.round);
        break;

      case 'loadQuestion': {
        if (!player.isHost) return;
        if (this.phase !== 'READING' && this.phase !== 'RESULT') return;
        this.round++;
        if (this.round > this.settings.rounds) {
          this.endGame(this.round - 1);
          return;
        }
        this.questionShownAt = Date.now();
        this.buzzedWs = null;
        this.buzzedTeam = null;
        this.teamLock = { my: false, en: false };
        this.currentQuestion = { id: msg.questionId, text: msg.questionText, answer: msg.answer, type: msg.qType, subject: msg.subject };
        this.phase = 'BUZZ_OPEN';
        this.readEndsAt = Date.now() + readingMsFor(msg.questionText, this.settings.readAloud === true);
        this.broadcast({
          type: 'questionLoaded',
          round: this.round,
          totalRounds: this.settings.rounds,
          questionId: msg.questionId,
          questionText: msg.questionText,
          qType: msg.qType,
          subject: msg.subject,
        });
        break;
      }

      case 'buzz': {
        if (this.phase !== 'BUZZ_OPEN') return;
        if (msg.questionId !== this.currentQuestion?.id) return;
        if (player.team === 'spec') return;
        if (player.team === 'my' && this.teamLock.my) return;
        if (player.team === 'en' && this.teamLock.en) return;
        if (this.buzzedWs) return;
        const s = this.statFor(player);
        s.buzzes++;
        // Buzz speed only means something on a question's first buzz; after a
        // miss the clock also includes the other player's answering time.
        if (!this.teamLock.my && !this.teamLock.en) s.buzzMs.push(Date.now() - this.questionShownAt);
        this.buzzedWs = ws;
        this.buzzedTeam = player.team;
        this.readMsLeft = Math.max(0, this.readEndsAt - Date.now());
        this.phase = 'PLAYER_ANSWERING';
        this.broadcast({
          type: 'buzzed',
          playerId: player.id,
          playerName: player.name,
          team: player.team,
          questionId: this.currentQuestion.id,
        });
        break;
      }

      case 'answer': {
        if (this.phase !== 'PLAYER_ANSWERING') return;
        if (ws !== this.buzzedWs) return;
        if (msg.questionId !== this.currentQuestion?.id) return;
        const correct = fuzzyMatch(String(msg.answer || ''), this.currentQuestion.answer);
        if (correct) {
          if (this.buzzedTeam === 'my') this.scores.my += 4; else this.scores.en += 4;
          const s = this.statFor(player);
          s.correct++;
          s.points += 4;
          this.tallySubject(s, 'right');
          this.phase = 'RESULT';
          this.broadcast({ type: 'answerResult', playerId: player.id, correct: true, answer: msg.answer, correctAnswer: this.currentQuestion.answer, scores: { ...this.scores } });
        } else {
          const interrupt = this.missed();
          this.recordMiss(player, 'wrong', interrupt);
          const dead = this.bothTeamsLocked();
          this.phase = dead ? 'RESULT' : 'BUZZ_OPEN';
          this.broadcast({ type: 'answerResult', playerId: player.id, correct: false, answer: msg.answer, scores: { ...this.scores }, teamLock: { ...this.teamLock }, dead, interrupt, correctAnswer: this.revealAnswer(dead) });
        }
        break;
      }

      case 'noAnswer': {
        if (this.phase !== 'PLAYER_ANSWERING') return;
        if (ws !== this.buzzedWs) return;
        this.answerTimedOut(player);
        break;
      }

      case 'questionExpired':
        if (this.phase !== 'BUZZ_OPEN' || !player.isHost) return;
        this.phase = 'RESULT';
        this.broadcast({ type: 'questionExpired', scores: { ...this.scores }, correctAnswer: this.revealAnswer(true) });
        break;
    }
  }

  handleClose(ws) {
    const player = this.sessions.get(ws);
    if (!player) return;
    // Leaving (or being kicked) mid-answer counts as running out of time, so
    // the toss-up doesn't freeze waiting for an answer that will never come.
    if (ws === this.buzzedWs && this.phase === 'PLAYER_ANSWERING') this.answerTimedOut(player);
    this.sessions.delete(ws);
    this.broadcast({ type: 'playerLeft', playerId: player.id, playerName: player.name });

    if (ws === this.hostWs && this.sessions.size > 0) {
      const [newWs, newPlayer] = this.sessions.entries().next().value;
      newPlayer.isHost = true;
      this.hostWs = newWs;
      this.broadcast({ type: 'hostChanged', playerId: newPlayer.id });
    }

    this.notifyLobby();
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  findSocket(playerId) {
    for (const [ws, p] of this.sessions) if (p.id === playerId) return ws;
    return null;
  }

  findPlayer(playerId) {
    const ws = this.findSocket(playerId);
    return ws ? this.sessions.get(ws) : null;
  }

  answerTimedOut(player) {
    const interrupt = this.missed();
    this.recordMiss(player, 'timeouts', interrupt);
    const dead = this.bothTeamsLocked();
    this.phase = dead ? 'RESULT' : 'BUZZ_OPEN';
    this.broadcast({ type: 'answerTimeout', playerId: player.id, scores: { ...this.scores }, teamLock: { ...this.teamLock }, dead, interrupt, correctAnswer: this.revealAnswer(dead) });
  }

  // The buzzing team missed (wrong answer or ran out of time). Nobody ever
  // loses points. Missing on an interrupt — buzzing while the question was
  // still being read — gives the other team 4 points, but only if that team
  // hasn't already had its go. Returns whether the 4 points were awarded.
  missed() {
    const team = this.buzzedTeam, other = team === 'my' ? 'en' : 'my';
    const interrupt = this.readMsLeft > 0 && !this.teamLock[other];
    if (interrupt) this.scores[other] += 4;
    this.teamLock[team] = true;
    this.buzzedWs = null; this.buzzedTeam = null;
    // Players' screens pause, then resume whatever reading time was left.
    this.readEndsAt = Date.now() + REOPEN_DELAY_MS + this.readMsLeft;
    return interrupt;
  }

  // Once both teams have been penalised on a toss-up, neither gets another
  // attempt — the question is dead and play moves on. Without this the buzz
  // window would reopen with both teams locked out, which reads to players as
  // the team that buzzed first getting a second go.
  bothTeamsLocked() {
    return this.teamLock.my && this.teamLock.en;
  }

  // The answer is only ever sent to clients once the toss-up is over. While a
  // team still has a chance at it, nobody gets told the answer — otherwise the
  // team that buzzed second could just read it off their own screen.
  revealAnswer(finished) {
    return finished ? this.currentQuestion?.answer ?? null : null;
  }

  send(ws, data) {
    try { ws.send(JSON.stringify(data)); } catch (_) {}
  }

  broadcast(data, excludeWs = null) {
    const msg = JSON.stringify(data);
    for (const ws of this.sessions.keys()) {
      if (ws !== excludeWs) try { ws.send(msg); } catch (_) {}
    }
  }

  playerList() {
    return [...this.sessions.values()].map(publicPlayer);
  }

  // ── match report ───────────────────────────────────────────────────────────

  statFor(player) {
    let s = this.stats.get(player.id);
    if (!s) {
      s = { name: player.name, team: player.team, buzzes: 0, correct: 0, wrong: 0, timeouts: 0,
            earlyMisses: 0, points: 0, gaveAway: 0, buzzMs: [], subjects: {} };
      this.stats.set(player.id, s);
    }
    return s;
  }

  tallySubject(s, key) {
    const subj = this.currentQuestion?.subject || 'Other';
    const t = s.subjects[subj] || (s.subjects[subj] = { right: 0, missed: 0 });
    t[key]++;
  }

  // kind is 'wrong' (answered wrong) or 'timeouts' (ran out of time).
  recordMiss(player, kind, interrupt) {
    const s = this.statFor(player);
    s[kind]++;
    if (interrupt) { s.earlyMisses++; s.gaveAway += 4; }
    this.tallySubject(s, 'missed');
  }

  endGame(roundsPlayed) {
    this.phase = 'DONE';
    this.broadcast({ type: 'gameOver', scores: { ...this.scores }, round: roundsPlayed });
    this.sendReport(roundsPlayed);
    this.recordResults();
    this.notifyLobby();
  }

  // The per-player breakdown goes to the host, or to everyone if the host
  // chose to share it. Everyone who played is in it, including players who
  // never buzzed and players who left partway.
  sendReport(roundsPlayed) {
    const shared = this.settings.shareReport === true;
    if (!shared && !this.hostWs) return;
    const here = new Set();
    for (const p of this.sessions.values()) {
      if (p.team === 'spec') continue;
      here.add(p.id);
      const s = this.statFor(p);
      s.name = p.name; s.team = p.team;
    }
    const players = [...this.stats.entries()].map(([id, s]) => ({
      name: s.name, team: s.team, left: !here.has(id),
      buzzes: s.buzzes, correct: s.correct, wrong: s.wrong, timeouts: s.timeouts,
      earlyMisses: s.earlyMisses, points: s.points, gaveAway: s.gaveAway,
      avgBuzzSec: s.buzzMs.length ? Math.round(s.buzzMs.reduce((a, b) => a + b, 0) / s.buzzMs.length / 100) / 10 : null,
      subjects: s.subjects,
    }));
    const report = { type: 'matchReport', shared, rounds: roundsPlayed, scores: { ...this.scores }, players };
    if (shared) this.broadcast(report); else this.send(this.hostWs, report);
  }

  // ── leaderboard ────────────────────────────────────────────────────────────

  leaderboardStub() {
    return this.env.LEADERBOARD.get(this.env.LEADERBOARD.idFromName('global'));
  }

  // Ask the leaderboard whether this player owns the callsign they claimed.
  async verifyPlayer(player) {
    try {
      const res = await this.leaderboardStub().fetch(
        new Request('https://leaderboard/?action=verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: player.name, token: player.token }),
        })
      );
      const data = await res.json();
      player.verified = !!data.ok;
    } catch (_) {
      player.verified = false;
    }
  }

  // Report the finished game. Scores come from this room's own tally, never
  // from the clients, so a player cannot inflate their own result.
  async recordResults() {
    const players = [...this.sessions.values()];
    const entries = players
      .filter(p => p.verified && p.token && p.team !== 'spec')
      .map(p => ({
        name:  p.name,
        token: p.token,
        score: this.scores[p.team] ?? 0,
        won:   this.scores[p.team] > this.scores[p.team === 'my' ? 'en' : 'my'],
      }));
    if (!entries.length) return;

    try {
      await this.leaderboardStub().fetch(
        new Request('https://leaderboard/?action=submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entries,
            rounds:  this.round - 1,
            level:   this.settings.level,
            players: players.length,
          }),
        })
      );
    } catch (_) {}
  }

  async notifyLobby() {
    try {
      const id = this.env.LOBBY_ROOM.idFromName('main');
      const stub = this.env.LOBBY_ROOM.get(id);
      await stub.fetch(new Request('https://lobby/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: this.roomId,
          isPublic: this.isPublic,
          roomName: this.roomName,
          playerCount: this.sessions.size,
          phase: this.phase,
          settings: this.settings,
        }),
      }));
    } catch (_) {}
  }
}

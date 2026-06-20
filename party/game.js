// ── Science Bowl Online Arena — Game Room (Cloudflare Durable Object) ─────────

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
    this.round = 0;
    this.scores = { my: 0, en: 0 };
    this.teamLock = { my: false, en: false };
    this.currentQuestion = null;
    this.buzzedWs = null;
    this.buzzedTeam = null;
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
    const name = (url.searchParams.get('name') || 'PLAYER').toUpperCase().slice(0, 16);
    const isFirst = this.sessions.size === 0;
    if (isFirst) this.hostWs = ws;

    const team = this.assignTeam();
    const player = { id: crypto.randomUUID(), name, team, isHost: isFirst, ready: false };
    this.sessions.set(ws, player);

    this.send(ws, {
      type: 'welcome',
      you: player,
      players: this.playerList(),
      isHost: isFirst,
      roomCode: this.roomId,
      settings: this.settings,
      isPublic: this.isPublic,
      phase: this.phase,
      scores: { ...this.scores },
      round: this.round,
    });
    this.broadcast({ type: 'playerJoined', player }, ws);

    ws.addEventListener('message', e => this.handleMessage(e.data, ws));
    ws.addEventListener('close',   () => this.handleClose(ws));
    ws.addEventListener('error',   () => this.handleClose(ws));

    this.notifyLobby();
  }

  assignTeam() {
    let my = 0, en = 0;
    for (const p of this.sessions.values()) { if (p.team === 'my') my++; else en++; }
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

      case 'ready':
        player.ready = !player.ready;
        this.broadcast({ type: 'playerReadyChanged', playerId: player.id, ready: player.ready });
        break;

      case 'changeTeam':
        if (this.phase !== 'LOBBY') return;
        player.team = msg.team === 'en' ? 'en' : 'my';
        this.broadcast({ type: 'playerTeamChanged', playerId: player.id, team: player.team });
        break;

      case 'start':
        if (!player.isHost || this.phase !== 'LOBBY') return;
        if (!this.settings.level || !this.settings.subjects?.length) return;
        this.phase = 'READING';
        this.round = 0;
        this.scores = { my: 0, en: 0 };
        this.broadcast({ type: 'gameStarted', settings: this.settings });
        break;

      case 'loadQuestion': {
        if (!player.isHost) return;
        if (this.phase !== 'READING' && this.phase !== 'RESULT') return;
        this.round++;
        if (this.round > this.settings.rounds) {
          this.phase = 'DONE';
          this.broadcast({ type: 'gameOver', scores: { ...this.scores }, round: this.round - 1 });
          this.notifyLobby();
          return;
        }
        this.buzzedWs = null;
        this.buzzedTeam = null;
        this.teamLock = { my: false, en: false };
        this.currentQuestion = { id: msg.questionId, text: msg.questionText, answer: msg.answer, type: msg.qType, subject: msg.subject };
        this.phase = 'BUZZ_OPEN';
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
        if (player.team === 'my' && this.teamLock.my) return;
        if (player.team === 'en' && this.teamLock.en) return;
        if (this.buzzedWs) return;
        this.buzzedWs = ws;
        this.buzzedTeam = player.team;
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
          this.phase = 'RESULT';
          this.broadcast({ type: 'answerResult', playerId: player.id, correct: true, answer: msg.answer, correctAnswer: this.currentQuestion.answer, scores: { ...this.scores } });
        } else {
          if (this.buzzedTeam === 'my') { this.scores.my -= 4; this.teamLock.my = true; }
          else { this.scores.en -= 4; this.teamLock.en = true; }
          this.buzzedWs = null; this.buzzedTeam = null;
          this.phase = 'BUZZ_OPEN';
          this.broadcast({ type: 'answerResult', playerId: player.id, correct: false, answer: msg.answer, correctAnswer: this.currentQuestion.answer, scores: { ...this.scores }, teamLock: { ...this.teamLock } });
        }
        break;
      }

      case 'noAnswer': {
        if (this.phase !== 'PLAYER_ANSWERING') return;
        if (ws !== this.buzzedWs) return;
        if (this.buzzedTeam === 'my') { this.scores.my -= 4; this.teamLock.my = true; }
        else { this.scores.en -= 4; this.teamLock.en = true; }
        this.buzzedWs = null; this.buzzedTeam = null;
        this.phase = 'BUZZ_OPEN';
        this.broadcast({ type: 'answerTimeout', playerId: player.id, scores: { ...this.scores }, teamLock: { ...this.teamLock } });
        break;
      }

      case 'questionExpired':
        if (this.phase !== 'BUZZ_OPEN' || !player.isHost) return;
        this.phase = 'RESULT';
        this.broadcast({ type: 'questionExpired', scores: { ...this.scores } });
        break;
    }
  }

  handleClose(ws) {
    const player = this.sessions.get(ws);
    if (!player) return;
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
    return [...this.sessions.values()];
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
          playerCount: this.sessions.size,
          phase: this.phase,
          settings: this.settings,
        }),
      }));
    } catch (_) {}
  }
}

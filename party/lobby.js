// ── Science Bowl Online Arena — Lobby Room (Cloudflare Durable Object) ────────

export class LobbyRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    // Map<WebSocket, true>  — browser clients watching the lobby
    this.watchers = new Set();
    // Map<roomCode, roomInfo>
    this.publicRooms = new Map();
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      server.accept();
      this.watchers.add(server);
      // Send current room list immediately
      server.send(JSON.stringify({ type: 'lobbyUpdate', rooms: [...this.publicRooms.values()] }));
      server.addEventListener('close', () => this.watchers.delete(server));
      server.addEventListener('error', () => this.watchers.delete(server));
      return new Response(null, { status: 101, webSocket: client });
    }

    if (request.method === 'POST') {
      let data;
      try { data = await request.json(); } catch { return new Response('Bad JSON', { status: 400 }); }
      const { roomCode, isPublic, playerCount, phase } = data;
      if (isPublic && phase !== 'DONE' && playerCount > 0 && playerCount < 8) {
        this.publicRooms.set(roomCode, data);
      } else {
        this.publicRooms.delete(roomCode);
      }
      this.broadcastRooms();
      return new Response('OK');
    }

    if (request.method === 'GET') {
      return new Response(JSON.stringify([...this.publicRooms.values()]), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response('Not Found', { status: 404 });
  }

  broadcastRooms() {
    const msg = JSON.stringify({ type: 'lobbyUpdate', rooms: [...this.publicRooms.values()] });
    for (const ws of this.watchers) {
      try { ws.send(msg); } catch (_) { this.watchers.delete(ws); }
    }
  }
}

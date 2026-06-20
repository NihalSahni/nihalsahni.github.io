import { GameRoom }  from './game.js';
import { LobbyRoom } from './lobby.js';
export { GameRoom, LobbyRoom };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // CORS pre-flight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Routes: /parties/game/<roomId>  or  /parties/lobby/main
    const m = url.pathname.match(/^\/parties\/(game|lobby)\/([^/?]+)/);
    if (!m) return new Response('Not found', { status: 404 });

    const [, party, roomId] = m;
    let stub;
    if (party === 'game') {
      stub = env.GAME_ROOM.get(env.GAME_ROOM.idFromName(roomId));
    } else if (party === 'lobby') {
      stub = env.LOBBY_ROOM.get(env.LOBBY_ROOM.idFromName(roomId));
    } else {
      return new Response('Unknown party', { status: 404 });
    }

    return stub.fetch(request);
  },
};

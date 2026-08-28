import { GameRoom }    from './game.js';
import { LobbyRoom }   from './lobby.js';
import { Leaderboard } from './leaderboard.js';
export { GameRoom, LobbyRoom, Leaderboard };

// Actions a browser is allowed to invoke on the leaderboard. "verify" and
// "submit" are deliberately absent: only GameRoom may call those, and it does
// so through a direct DO stub, which never passes through this router.
const PUBLIC_LEADERBOARD_ACTIONS = new Set(['check', 'top', 'claim']);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // CORS pre-flight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // Routes: /parties/game/<roomId> | /parties/lobby/main | /parties/leaderboard/global
    const m = url.pathname.match(/^\/parties\/(game|lobby|leaderboard)\/([^/?]+)/);
    if (!m) return new Response('Not found', { status: 404 });

    const [, party, roomId] = m;
    let stub;
    if (party === 'game') {
      stub = env.GAME_ROOM.get(env.GAME_ROOM.idFromName(roomId));
    } else if (party === 'lobby') {
      stub = env.LOBBY_ROOM.get(env.LOBBY_ROOM.idFromName(roomId));
    } else if (party === 'leaderboard') {
      const action = url.searchParams.get('action') || '';
      if (!PUBLIC_LEADERBOARD_ACTIONS.has(action)) {
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 404, headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      stub = env.LEADERBOARD.get(env.LEADERBOARD.idFromName('global'));
    } else {
      return new Response('Unknown party', { status: 404 });
    }

    return stub.fetch(request);
  },
};

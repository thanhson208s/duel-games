import { S2C, C2S, RoomMode } from "@game/protocol";
import { DurableObject } from "cloudflare:workers";

export const TEST_ACCOUNTS = [
    {
        id: 2008,
        username: "Gootube"
    },
    {
        id: 1810,
        username: "Brandy"
    },
    {
        id: 0,
        username: "Anon"
    },
    {
        id: 4444,
        username: "Jhin"
    }
];

export const TEST_MODES = [
    "kingdomino",
    "hanamikoji"
];

type Env = { LOBBY: DurableObjectNamespace };
type Player = {
  id: number,
  username: string,
  socket: WebSocket
};
type Room = {
  id: number,
  mode: RoomMode,
  secret: string                                                                                                                                                                             
};

function getIdFromName(_username: string): number | null {
  for (const {id, username} of TEST_ACCOUNTS) {
    if (username.toLowerCase() === _username.toLowerCase())
      return id;
  }

  return null;
}

function getNameFromId(id: number): string | null {
  for (const {id, username} of TEST_ACCOUNTS) {
    if (id === id)
      return username;
  }

  return null;
}

export class Lobby extends DurableObject<Env> {
  players = new Map<number, Player>();
  rooms = new Map<number, Room>();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  broadcastListPlayer() {
    const players = [...this.players.values()].map((p) => ({
      id: p.id,
      username: p.username
    }));

    const data = JSON.stringify({
      type: "list_player",
      players
    } satisfies S2C);
    
    console.log("Players:", JSON.stringify(players));
    for (const p of this.players.values())
      p.socket.send(data);
  }

  broadcastListRoom() {
    const rooms = [...this.rooms.values()].map((r) => ({
      id: r.id,
      mode: r.mode
    }));

    const data = JSON.stringify({
      type: "list_room",
      rooms
    } satisfies S2C);

    for (const p of this.players.values())
      p.socket.send(data);
  }

  addPlayer(id: number, username: string, socket: WebSocket) {
    this.players.set(id, { id, username, socket });
    socket.send(JSON.stringify({
      type: "lobby",
      players: [...this.players.values()].map((p) => ({ id: p.id, username: p.username })),
      rooms: [...this.rooms.values()].map((r) => ({ id: r.id, mode: r.mode })),
      modes: TEST_MODES as RoomMode[]
    } satisfies S2C));
    this.broadcastListPlayer();
  }

  removePlayer(id: number) {
    this.players.delete(id);
    this.broadcastListPlayer();
  }

  async fetch(request: Request) : Promise<Response> {
    const url = new URL(request.url);

    // Validate id (TODO: use signed token)
    const id = parseInt(url.searchParams.get("id") ?? "");
    const username = getNameFromId(id);
    if (!username)
      return new Response("Invalid id", { status: 401 });

    // Init session
    const [client, socket] = Object.values(new WebSocketPair());
    socket.accept();

    // Add player to list
    this.addPlayer(id, username, socket);

    socket.onmessage = (event) => {
      let msg: C2S;
      try {
        msg = C2S.parse(JSON.parse(String(event.data)));
      } catch {
        return;
      }

      switch(msg.type) {
        case "create_room":
          break;
        case "join_room":
          break;
      }
    };

    socket.onclose = () => {
      this.removePlayer(id);
    };

    this.addPlayer(id, username, socket);

    return new Response(null, { status: 101, webSocket: client });
  }
}

// Worker entry: route to a DO room
export default {
  async fetch(request: Request, env: Env) : Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/login") {
      const body = await request.json().catch(() => null) as null | {username?: string};
      const username = (body?.username ?? "").trim();

      // Validate username
      const id = getIdFromName(username);
      if (!id) {
        return new Response(JSON.stringify({
          ok: false, error: "Unknown name"
        }), {
          status: 401,
          headers: { "content-type": "application/json" }
        });
      }

      const lobbyUrl = `${url.protocol === "https" ? "wss": "ws"}://${url.host}/lobby?id=${encodeURIComponent(id)}`;
      return new Response(JSON.stringify({
        ok: true, id, username, lobbyUrl
      }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    if (url.pathname === "/lobby") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }

      const id = env.LOBBY.idFromName("singleton");
      const stub = env.LOBBY.get(id);
      return stub.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;

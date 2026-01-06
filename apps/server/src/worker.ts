import { S2C, C2S } from "@game/protocol";

type PlayerConnection = {
  id: string,
  name: string,
  socket: WebSocket
}

export class Room {
  state: DurableObjectState;
  players = new Map<string, PlayerConnection>();

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  broadcast(msg: S2C) {
    const data = JSON.stringify(msg);
    for (const player of this.players.values())
      player.socket.send(data);
  }

  onPlayerJoin(sessionId: string, socket: WebSocket, name: string) {
    this.players.set(sessionId, { id: sessionId, name, socket});
    this.broadcast({
      type: "players",
      players: [...this.players.values()].map((p) => ({ id: p.id, name: p.name }))
    });
  }

  async fetch(request: Request) {
    // Only accept web socket connections
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    // Init session
    const [client, socket] = Object.values(new WebSocketPair());
    const sessionId = crypto.randomUUID();
    socket.accept();
    socket.send(JSON.stringify({ type: "hello", sessionId } satisfies S2C));

    socket.addEventListener("message", (evt) => {
      let msg: C2S;
      try {
        msg = C2S.parse(JSON.parse(String(evt.data)));
      } catch {
        return;
      }

      switch(msg.type) {
        case "login":
          this.onPlayerJoin(sessionId, socket, msg.name);
          break;
      }
    });

    socket.addEventListener("close", () => {
      console.log("close");
      this.players.delete(sessionId);

      this.broadcast({
        type: "players",
        players: [...this.players.values()].map((p) => ({ id: p.id, name: p.name }))
      });
    });

    return new Response(null, { status: 101, webSocket: client });
  }
}

// Worker entry: route to a DO room
export default {
  async fetch(request: Request, env: { ROOM: DurableObjectNamespace }) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("room") ?? "lobby";
    const id = env.ROOM.idFromName(roomId);
    const stub = env.ROOM.get(id);
    return stub.fetch(request);
  }
};

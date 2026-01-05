import { S2C, C2S } from "@game/protocol";

export class Room {
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    // Upgrade to websocket
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.accept();

    const sessionId = crypto.randomUUID();
    const hello: S2C = { type: "hello", sessionId };
    server.send(JSON.stringify(hello));

    server.addEventListener("message", (evt) => {
      try {
        const parsed = C2S.parse(JSON.parse(String(evt.data)));

        if (parsed.type === "ping") {
          const pong: S2C = { type: "pong", t: parsed.t };
          server.send(JSON.stringify(pong));
        }
      } catch (e) {
        server.send(JSON.stringify({ type: "hello", sessionId })); // cheap fallback
      }
    });

    server.addEventListener("close", () => {
      // cleanup later
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

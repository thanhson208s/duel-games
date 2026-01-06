import WebSocket from "ws";
import { C2S, S2C } from "@game/protocol";

const room = process.argv[2] ?? "lobby";
const name = process.argv[3] ?? `Bot-${Math.floor(Math.random() * 1000)}`;

const url = `ws://127.0.0.1:8787/?room=${room}`;
console.log(`[${name}] connecting to ${url}`);

const ws = new WebSocket(url);

ws.on("open", () => {
  console.log(`[${name}] socket open`);
});

ws.on("message", (data) => {
  const msg = S2C.parse(JSON.parse(data.toString()));
  console.log(`[${name}] recv`, msg);

  if (msg.type === "hello") {
    const join: C2S = {
      type: "join",
      name
    };
    ws.send(JSON.stringify(join));
    console.log(`[${name}] sent join`);
  }
});

ws.on("close", () => {
  console.log(`[${name}] disconnected`);
});

ws.on("error", (err) => {
  console.error(`[${name}] error`, err);
});

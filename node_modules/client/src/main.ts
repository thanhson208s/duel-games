import Phaser from "phaser";
import { S2C, C2S } from "@game/protocol";

class MainScene extends Phaser.Scene {
  ws?: WebSocket;
  text!: Phaser.GameObjects.Text;

  create() {
    this.text = this.add.text(20, 20, "Connecting...", { fontSize: "18px" });

    // Local server. We'll change to production URL later.
    const url = "ws://127.0.0.1:8787/?room=lobby";
    this.ws = new WebSocket(url);

    this.ws.onmessage = (ev) => {
      const msg = S2C.parse(JSON.parse(ev.data));
      if (msg.type === "hello") {
        this.text.setText(`Connected. session=${msg.sessionId}\nClick to ping`);
      } else if (msg.type === "pong") {
        this.text.setText(`PONG t=${msg.t}\nClick to ping again`);
      }
    };

    this.input.on("pointerdown", () => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const ping: C2S = { type: "ping", t: Date.now() };
        this.ws.send(JSON.stringify(ping));
      }
    });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: "app",
  scene: [MainScene]
});

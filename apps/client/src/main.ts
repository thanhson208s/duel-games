import Phaser from "phaser";
import { S2C, C2S } from "@game/protocol";
import { Config } from "@game/config";

class MainScene extends Phaser.Scene {
  ws?: WebSocket;
  text!: Phaser.GameObjects.Text;
  sessionId = "";

  create() {
    this.text = this.add.text(20, 20, "Connecting...", { fontSize: "18px" });
    this.ws = new WebSocket("ws://127.0.0.1:8787/?room=lobby");

    this.ws.onmessage = (ev) => {
      const msg = S2C.parse(JSON.parse(ev.data));
      
      if (msg.type === "hello") {
        this.sessionId = msg.sessionId;
        this.ws?.send(JSON.stringify({
          type: "login",
          name: "Player-" + this.sessionId.slice(0, 4)
        } satisfies C2S));
      }

      if (msg.type === "players") {
        const names = msg.players.map((p) => p.name).join("\n");
        this.text.setText(`Players:\n${names}`);
      }
    };
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  parent: "app",
  scene: [MainScene]
});

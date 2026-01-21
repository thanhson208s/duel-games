import Phaser from "phaser";
import { LobbyScene } from "./scenes/LobbyScene";
import { LoginScene } from "./scenes/LoginScene";
import { UIPlugin } from "./plugins/UIPlugins";

new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280
  },
  parent: "app",
  dom: {
    createContainer: true,
    behindCanvas: false
  },
  scene: [LoginScene, LobbyScene],
  plugins: {
    scene: [
      {
        key: "ui",
        plugin: UIPlugin,
        mapping: "ui"
      }
    ]
  }
});

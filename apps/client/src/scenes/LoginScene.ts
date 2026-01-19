import Phaser from "phaser";
import resMgr from "../core/ResMgr.ts";
import { Img, Font, Audio } from "../assets/keys.ts";

export class LoginScene extends Phaser.Scene {
  private usernameStr = "";
  private usernameTxt!: Phaser.GameObjects.Text;
  private usernameBox!: HTMLInputElement;
  
  constructor() {
    super("LoginScene");
  }

  preload() {
    resMgr.loadBundle(this, "Login");
  }

  create() {
    const {width, height} = this.scale;

    this.add.image(width / 2, 260, Img.Logo).setScale(0.7);
    this.add.image(width / 2, height / 2, Img.LoginBox);

    this.add.text(width / 2, height / 2 - 75, "Enter your name:", {
      fontFamily: Font.UI,
      fontStyle: "bold",
      fontSize: "48px",
      color: "#FFFFFF",
    }).setOrigin(0.5, 0.5);
  }
} 
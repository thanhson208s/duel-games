import Phaser from "phaser"

export class LoginScene extends Phaser.Scene {
  private usernameStr = "";
  private usernameTxt!: Phaser.GameObjects.Text;
  private usernameInput!: HTMLInputElement;
  
  constructor() {
    super("LoginScene");
  }

  create() {
    const {width, height} = this.scale;

    this.add.text(width / 2, height / 2 - 50, "Enter your name:")
      .setOrigin(0.5, 0.5).setFill("#FFFFFF").setFontSize(20);
  }
} 
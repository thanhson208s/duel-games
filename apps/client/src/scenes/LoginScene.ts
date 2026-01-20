import Phaser from "phaser";
import resMgr from "../core/ResMgr.ts";
import { Img, Font, Audio } from "../assets/keys.ts";

export class LoginScene extends Phaser.Scene {
  private usernameStr = "";
  private usernameTxt!: Phaser.GameObjects.Text;
  private usernameBox!: HTMLInputElement;
  private playButton!: Phaser.GameObjects.Image;
  
  constructor() {
    super("LoginScene");
  }

  preload() {
    resMgr.loadBundle(this, "Login");
  }

  create() {
    const {width, height} = this.scale;

    // Game tile
    this.add.image(width / 2, 260, Img.Logo).setScale(0.7);
    // TODO: Add white particles dissolve effect using shader
    this.add.image(width / 2, height / 2, Img.LoginBox);

    this.add.text(width / 2, height / 2 - 100, "Who's there?", {
      fontFamily: Font.UI,
      fontStyle: "normal",
      fontSize: "48px",
      color: "#FFFFFF",
    }).setOrigin(0.5, 0.5);

    // Display for username
    this.usernameTxt = this.add.text(width / 2, height / 2, "Enter your name", {
      fontFamily: Font.UI,
      fontStyle: "bold",
      fontSize: "48px",
      color: "#696969"
    })
    .setFixedSize(500, 0)
    .setAlign('center')
    .setOrigin(0.5, 0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => { this.focusInput(); });

    // DOM input for username
    this.usernameBox = document.createElement("input");
    this.usernameBox.type = "text";
    this.usernameBox.autocomplete = "off";
    this.usernameBox.style.opacity = "0";
    this.usernameBox.style.position = "absolute";
    this.usernameBox.style.pointerEvents = "none";
    this.usernameBox.addEventListener("input", () => {
      this.usernameStr = this.validateInput();
      this.usernameTxt.setText(this.usernameStr || "Enter your name");
      this.usernameTxt.setTintFill(this.usernameStr ? 0x000000 : 0x696969);
    });
    this.add.dom(-1000, -1000, this.usernameBox);

    this.input.on("pointerdown", (_: any, objs: any[]) => {
      if (!objs.includes(this.usernameTxt))
        this.blurInput();
    });

    // Play button
    this.playButton = this.add.image(width / 2, height - 300, Img.LoginPlayNormal)
    .setScale(0.6)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      this.playButton.setTexture(Img.LoginPlayPressed);
      this.playButton.setData("touchable", true);
    })
    .on("pointerup", () => {
      this.playButton.setTexture(Img.LoginPlayNormal);
      if (this.playButton.getData("touchable"))
        this.login();
    })
    .on("pointerout", () => {
      this.playButton.setTexture(Img.LoginPlayNormal);
      this.playButton.setData("touchable", false);
    })
  }

  focusInput() {
    this.usernameBox.style.pointerEvents = "auto";
    this.usernameBox.focus();
  }

  blurInput() {
    this.usernameBox.blur();
    this.usernameBox.style.pointerEvents = "none";
  }

  validateInput() {
    let raw = this.usernameBox.value.trim();
    let ret = raw.split("").map((c) => {
      let code = c.charCodeAt(0);
      if (!(code > 47 && code < 58) &&  // numeric (0-9)
        !(code > 64 && code < 91) &&    // upper alpha (A-Z)
        !(code > 96 && code < 123))     // lower alpha (a-z)
        return "";
      return c;
    }).join("").slice(0, 12);           // max 16 characters

    if (ret !== this.usernameStr) this.sound.play(Audio.OneKey, { volume: 0.25 });
    return (this.usernameBox.value = ret);
  }

  login() {
    // Check username
    if (this.usernameStr === "") {
      this.tweens.killTweensOf(this.usernameTxt);
      this.sound.play(Audio.InvalidInput);
      const DURATION = 250;
      // Tint tween task
      const srcColor = Phaser.Display.Color.HexStringToColor("#696969");
      const dstColor = Phaser.Display.Color.HexStringToColor("#d64747");
      this.tweens.addCounter({
        from: 0,
        to: 100,
        ease: 'Sine.Out',
        duration: DURATION / 2,
        repeat: 0,
        yoyo: true,
        onUpdate: (tween) => {
          const value = tween.getValue();
          const color = Phaser.Display.Color.Interpolate.ColorWithColor(srcColor, dstColor, 100, value || 0);
          this.usernameTxt.setTintFill(color.color);
        },
      });

      // Shake tween task
      this.tweens.chain({
        targets: this.usernameTxt,
        tweens: [
          {
            duration: DURATION * 1/8,
            x: this.scale.width / 2 + 12,
            ease: "Sine.Out"
          },
          {
            duration: DURATION * 1/4,
            x: "-=21",
            ease: "Sine.InOut"
          },
          {
            duration: DURATION * 1/4,
            x: "+=15",
            ease: "Sine.InOut"
          },
          {
            duration: DURATION * 1/4,
            x: "-=9",
            ease: "Sine.InOut"
          },
          {
            duration: DURATION * 1/8,
            x: "+=3",
            ease: "Sine.In"
          }
        ],
        delay: 0,
        loop: 0,
      });

      // Call login api


      return;
    }
    // this.usernameTxt.setTintFill(0xd64747);
  }
} 
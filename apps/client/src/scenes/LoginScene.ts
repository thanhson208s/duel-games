import Phaser from "phaser";
import resMgr from "../core/ResMgr.ts";
import { Img, Font, Audio } from "../assets/keys.ts";
import { Input } from "../components/Input.ts";

export class LoginScene extends Phaser.Scene {
  private usernameInput!: Input;
  
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
    this.usernameInput = this.add.input(width / 2, height / 2, "Enter your name", {
      fontFamily: Font.UI,
      fontStyle: "bold",
      fontSize: "48px",
      color: "black"
    })
    .setFixedSize(500, 0)
    .setAlign('center')
    .setOrigin(0.5, 0.5)
    .setValidator((str: string) => {
      return str.split("").map((c) => {
        let code = c.charCodeAt(0);
        if (!(code > 47 && code < 58) &&  // numeric (0-9)
          !(code > 64 && code < 91) &&    // upper alpha (A-Z)
          !(code > 96 && code < 123))     // lower alpha (a-z)
          return "";
        return c;
      }).join("").slice(0, 12);           // max 12 characters
    })
    .setTypingSound(Audio.OneKey, 0.25);

    // Play button
    this.add.button(width / 2, height - 360, Img.LoginPlayNormal, Img.LoginPlayActive)
    .setScale(0.5)
    .setCallback(() => { this.login(); });

    // Music button
    this.add.button

    // SFX button
    this.add.button

    // Lang button
    this.add.button
  }

  login() {
    // Check username
    const username = this.usernameInput.getValue();
    console.log(`login:${username}`);
    if (username === "") {
      this.tweens.killTweensOf(this.usernameInput);
      this.sound.play(Audio.InvalidInput);
      const DURATION = 250;
      // Tint tween task
      const srcColor = Phaser.Display.Color.HexStringToColor(this.usernameInput.getPlaceholderColor());
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
          this.usernameInput.setTintFill(color.color);
        },
      });

      // Shake tween task
      this.tweens.chain({
        targets: this.usernameInput,
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
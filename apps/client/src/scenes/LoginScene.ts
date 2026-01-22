import Phaser from "phaser";
import { Img, Font, Audio } from "../constants/keys.ts";
import { Input } from "../components/Input.ts";
import { CoreEvents, GameEvents, UIEvents } from "../constants/events.ts";
import type { Button } from "../components/Button.ts";

export class LoginScene extends Phaser.Scene {
  private usernameInput!: Input;
  private musicBtn!: Button;
  private sfxBtn!: Button;
  private langBtn!: Button;
  private langTxt!: Phaser.GameObjects.Text;
  
  constructor() {
    super("LoginScene");
  }

  preload() {
    this.game.resource.loadBundle(this, "Login");
  }

  create() {
    const {width, height} = this.scale;

    // Game tile
    this.add.image(width / 2, 260, Img.Logo).setScale(0.7);
    // TODO: Add white particles dissolve effect using shader
    this.add.image(width / 2, height / 2 - 20, Img.LoginBox);

    this.add.text(width / 2, height / 2 - 120, "Who's there?", {
      fontFamily: Font.UINormal,
      fontSize: "48px",
      color: "white",
    }).setOrigin(0.5, 0.5);

    // Display for username
    this.usernameInput = this.add.input(width / 2, height / 2 - 20, "Enter your name", {
      fontFamily: Font.UIBold,
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
    this.add.button(width / 2, height - 400, Img.LoginPlayNormal, Img.LoginPlayActive)
    .setScale(0.5)
    .setCallback(() => { this.login(); });

    // Music button
    this.musicBtn = this.add.button(width * 1/4, height - 120, this.game.setting.isMusic() ? Img.LoginMusicOn : Img.LoginMusicOff)
    .setCallback(() => { this.game.setting.toggleMusic(); })
    .setClickedSound(Audio.BtnClicked);;
    this.game.events.on(CoreEvents.MUSIC_TOGGLE, () => {
      this.musicBtn.setTextures(this.game.setting.isMusic() ? Img.LoginMusicOn : Img.LoginMusicOff);
    }, this);

    // SFX button
    this.sfxBtn = this.add.button(width * 1/2, height - 120, this.game.setting.isSfx() ? Img.LoginSfxOn : Img.LoginSfxOff)
    .setCallback(() => { this.game.setting.toggleSfx(); })
    .setClickedSound(Audio.BtnClicked);
    this.game.events.on(CoreEvents.SFX_TOGGLE, () => {
      this.sfxBtn.setTextures(this.game.setting.isSfx() ? Img.LoginSfxOn : Img.LoginSfxOff);
    }, this);

    // Lang button
    this.langBtn = this.add.button(0, 0, Img.LoginLangBtn)
    .setCallback(() => { this.game.setting.toggleLang(); })
    .setClickedSound(Audio.BtnClicked);
    this.langTxt = this.add.text(0, 0, this.game.setting.getLang().toUpperCase(), {
      fontFamily: Font.UINormal,
      fontSize: "60px",
      color: "#3D4144"
    }).setOrigin(0.5, 0.5);
    this.add.container(width * 3/4, height - 120, [this.langBtn, this.langTxt]);
    this.game.events.on(CoreEvents.LANG_TOGGLE, () => {
      this.langTxt.setText(this.game.setting.getLang().toUpperCase());
    });

    this.game.events.once(GameEvents.OPEN_LOBBY, () => {
      //TODO: Open lobby
    });

    this.events.on("shutdown", () => {
      this.game.events.off(CoreEvents.MUSIC_TOGGLE, undefined, this);
      this.game.events.off(CoreEvents.SFX_TOGGLE, undefined, this);
      this.game.events.off(CoreEvents.LANG_TOGGLE, undefined, this);
    });
  }

  login() {
    // Check username
    const username = this.usernameInput.getValue();
    if (username === "") {
      this.tweens.killTweensOf(this.usernameInput);
      this.game.audio.playSfx(Audio.InvalidInput);
      const DURATION = 250;
      // Tint tween task
      const srcColor = Phaser.Display.Color.HexStringToColor("#ffffff");
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
          this.usernameInput.setTint(color.color);
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

      return;
    }
    
    // Call login api
    this.game.network.login(username)
    .then((data) => {
      this.game.plugins.start("player");
      this.game.plugins.start("lobby");

      this.game.player.setInfo(data.id, data.username);
      this.game.network.connectLobby();
    })
    .catch((err) => {
      console.log(err.message);
    });
  }
} 
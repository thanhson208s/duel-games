import { Img, Font, Audio } from "./keys"

export type Bundle = {
  images?: { key: string, url: string }[],
  bmFonts?: { key: string, texture: string, data: string }[],
  ttFonts?: { key: string, url: string, style: string, weight: string }[],
  audios?: { key: string, url: string }[],
};

export const bundles = {
  Login: {
    images: [
      { key: Img.Logo, url: "assets/img/logo.png" },
      { key: Img.LoginBox, url: "assets/img/login_box.png" },
      { key: Img.LoginPlayNormal, url: "assets/img/login_play_normal.png" },
      { key: Img.LoginPlayActive, url: "assets/img/login_play_active.png" },
      { key: Img.LoginMusicOn, url: "assets/img/login_music_on.png" },
      { key: Img.LoginMusicOff, url: "assets/img/login_music_off.png" },
      { key: Img.LoginSfxOn, url: "assets/img/login_sfx_on.png" },
      { key: Img.LoginSfxOff, url: "assets/img/login_sfx_off.png" },
      { key: Img.LoginLangBtn, url: "assets/img/login_lang_btn.png" },
    ],
    ttFonts: [
      { key: Font.UINormal, url: "assets/font/PixelifySans-Regular.ttf", style: "normal", weight: "400" },
      { key: Font.UIMedium, url: "assets/font/PixelifySans-Medium.ttf", style: "normal", weight: "500" },
      { key: Font.UIBold, url: "assets/font/PixelifySans-Bold.ttf", style: "normal", weight: "700" },
    ],
    audios: [
      { key: Audio.OneKey, url: "assets/audio/one_key.wav" },
      { key: Audio.InvalidInput, url: "assets/audio/invalid_input.mp3" },
      { key: Audio.BtnClicked, url: "assets/audio/btn_clicked.wav" },
    ]
  } as Bundle,
  Lobby: {

  } as Bundle,
} as const;

export type BundleName = keyof typeof bundles;
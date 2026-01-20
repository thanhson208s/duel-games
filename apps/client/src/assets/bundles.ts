import { Img, Font, Audio } from "./keys"

export type Bundle = {
  images?: { key: string, url: string }[],
  bmFonts?: { key: string, texture: string, data: string }[],
  ttFonts?: { key: string, variants: { url: string, style: string, weight: string }[] }[],
  audios?: { key: string, url: string }[],
};

export const bundles = {
  Login: {
    images: [
      { key: Img.Logo, url: "assets/img/logo.png" },
      { key: Img.LoginBox, url: "assets/img/login_box.png" },
      { key: Img.LoginPlayNormal, url: "assets/img/login_play_normal.png" },
      { key: Img.LoginPlayPressed, url: "assets/img/login_play_pressed.png" },
    ],
    ttFonts: [
      { key: Font.UI, variants: [ 
        { url: "assets/font/PixelifySans-Regular.ttf", style: "normal", weight: "normal" },
        { url: "assets/font/PixelifySans-SemiBold.ttf", style: "normal", weight: "bold" },
        { url: "assets/font/PixelifySans-Bold.ttf", style: "normal", weight: "bolder" },
        { url: "assets/font/PixelifySans-Medium.ttf", style: "normal", weight: "lighter" },
      ]}
    ]
  } as Bundle,
  Lobby: {

  } as Bundle,
} as const;

export type BundleName = keyof typeof bundles;
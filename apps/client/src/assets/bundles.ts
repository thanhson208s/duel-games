import { Img, Font, Audio } from "./keys"

export type Bundle = {
    images?: [{ key: string, url: string }],
    fonts?: [{ key: string, texture: string, data: string }],
    audios?: [{ key: string, url: string }]
};

export const bundles = {
    Login: {
        images: [
            { key: Img.Logo, url: "assets/img/logo.png "}
        ]
    } as Bundle
} as const;

export type BundleName = keyof typeof bundles;
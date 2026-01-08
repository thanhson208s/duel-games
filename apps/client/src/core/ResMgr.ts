import type Phaser from "phaser";
import { bundles, type Bundle, type BundleName } from "../assets/bundles";

export class ResMgr {
  private refCount = new Map<string, number>();

  loadBundle(scene: Phaser.Scene, bundleName: BundleName) {
    const bundle = bundles[bundleName];
    const load = scene.load;

    if (bundle.images) {
      for (const image of bundle.images) {
        this.refCount.set(image.key, (this.refCount.get(image.key) ?? 0) + 1);
        if (!this.isImgLoaded(scene, image.key))
          load.image(image.key, image.url);
      }
    }
    if (bundle.fonts) {
      for (const font of bundle.fonts) {
        this.refCount.set(font.key, (this.refCount.get(font.key) ?? 0) + 1);
        if (!this.isFontLoaded(scene, font.key))
          load.bitmapFont(font.key, font.texture, font.data);
      }
    }
    if (bundle.audios) {
      for (const audio of bundle.audios) {
        this.refCount.set(audio.key, (this.refCount.get(audio.key) ?? 0) + 1);
        if (!this.isAudioLoaded(scene, audio.key))
          load.audio(audio.key, audio.url);
      }
    }
  }

  unloadBundle(scene: Phaser.Scene, bundleName: BundleName, clearCache: boolean = false) {
    const bundle = bundles[bundleName];

    if (bundle.images) {
      for (const image of bundle.images) {
        const next = (this.refCount.get(image.key) ?? 1) - 1;
        if (next <= 0) this.refCount.delete(image.key);
        else this.refCount.set(image.key, next);

        if (clearCache)
          scene.textures.remove(image.key);
      }
    }
    if (bundle.fonts) {
      for (const font of bundle.fonts) {
        const next = (this.refCount.get(font.key) ?? 1) - 1;
        if (next <= 0) this.refCount.delete(font.key);
        else this.refCount.set(font.key, next);

        if (clearCache)
          scene.cache.bitmapFont.remove(font.key);
      }
    }
    if (bundle.audios) {
      for (const audio of bundle.audios) {
        const next = (this.refCount.get(audio.key) ?? 1) - 1;
        if (next <= 0) this.refCount.delete(audio.key);
        else this.refCount.set(audio.key, next);

        if (clearCache)
          scene.cache.audio.remove(audio.key);
      }
    }
  }

  private isImgLoaded(scene: Phaser.Scene, key: string) {
    return scene.textures.exists(key);
  }

  private isFontLoaded(scene: Phaser.Scene, key: string) {
    return scene.cache.bitmapFont.exists(key);
  }

  private isAudioLoaded(scene: Phaser.Scene, key: string) {
    return scene.cache.audio.exists(key);
  }
}
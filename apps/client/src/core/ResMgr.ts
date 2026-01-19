import type Phaser from "phaser";
import { bundles, type BundleName } from "../assets/bundles";

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
    if (bundle.bmFonts) {
      for (const font of bundle.bmFonts) {
        this.refCount.set(font.key, (this.refCount.get(font.key) ?? 0) + 1);
        if (!this.isBMFontLoaded(scene, font.key))
          load.bitmapFont(font.key, font.texture, font.data);
      }
    }
    if (bundle.ttFonts) {
      for (const font of bundle.ttFonts) {
        this.refCount.set(font.key, (this.refCount.get(font.key) ?? 0) + 1);
        if (!this.isTTFontLoaded(scene, font.key)) {
          for (const v of font.variants)
            load.font(font.key, v.url, "truetype", { style: v.style, weight: v.weight });
        }
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
    if (bundle.bmFonts) {
      for (const font of bundle.bmFonts) {
        const next = (this.refCount.get(font.key) ?? 1) - 1;
        if (next <= 0) this.refCount.delete(font.key);
        else this.refCount.set(font.key, next);

        if (clearCache)
          scene.cache.bitmapFont.remove(font.key);
      }
    }
    if (bundle.ttFonts) {
      for (const font of bundle.ttFonts) {
        console.log(font.key)
        const next = (this.refCount.get(font.key) ?? 1) - 1;
        if (next <= 0) this.refCount.delete(font.key);
        else this.refCount.set(font.key, next);

        // if (clearCache)
          // document.fonts.clear()
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

  private isBMFontLoaded(scene: Phaser.Scene, key: string) {
    return scene.cache.bitmapFont.exists(key);
  }

  private isTTFontLoaded(scene: Phaser.Scene, key: string) {
    return false;
  }

  private isAudioLoaded(scene: Phaser.Scene, key: string) {
    return scene.cache.audio.exists(key);
  }
}

const resMgr = new ResMgr();

export default resMgr;
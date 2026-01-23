import { CoreEvents } from "../constants/events";
import { StorageUtils } from "../utils/StorageUtils";

export class SettingMgr extends Phaser.Plugins.BasePlugin {
  private music = true;
  private sfx = true;
  private lang = 0;

  static readonly LANGUAGES = ["en", "vi"];
  static readonly KEY_MUSIC = "setting:music";
  static readonly KEY_SFX = "setting:sfx";
  static readonly KEY_LANG = "setting:lang";

  init() {
    this.game.setting = this;
  }

  start() {
    this.music = StorageUtils.getBool(SettingMgr.KEY_MUSIC, true);
    this.sfx = StorageUtils.getBool(SettingMgr.KEY_SFX, true);
    this.lang = Math.max(SettingMgr.LANGUAGES.indexOf(StorageUtils.getString(SettingMgr.KEY_LANG, "en")), 0);
  }

  toggleMusic() {
    this.music = !this.music;
    StorageUtils.setBool(SettingMgr.KEY_MUSIC, this.music);
    this.game.events.emit(CoreEvents.MUSIC_TOGGLE);
  }

  isMusic() {
    return this.music;
  }

  toggleSfx() {
    this.sfx = !this.sfx;
    StorageUtils.setBool(SettingMgr.KEY_SFX, this.sfx);
    this.game.events.emit(CoreEvents.SFX_TOGGLE);
  }

  isSfx() {
    return this.sfx;
  }

  toggleLang() {
    this.lang = (this.lang + 1) % SettingMgr.LANGUAGES.length;
    StorageUtils.setString(SettingMgr.KEY_LANG, SettingMgr.LANGUAGES[this.lang]);
    this.game.events.emit(CoreEvents.LANG_TOGGLE);
  }

  getLang() {
    return SettingMgr.LANGUAGES[this.lang];
  }
}
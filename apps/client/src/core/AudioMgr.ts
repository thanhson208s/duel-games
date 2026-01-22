export class AudioMgr extends Phaser.Plugins.BasePlugin {
  init() {
    this.game.audio = this;
  }

  playSfx(key: string, config?: Phaser.Types.Sound.SoundConfig) {
    if (this.game.setting.isSfx())
      this.game.sound.play(key, config);
  }
}
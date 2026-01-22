export class PlayerMgr extends Phaser.Plugins.BasePlugin {
  private id!: number;
  private username!: string;
  
  init() {
    this.game.player = this;
  }

  setInfo(id: number, username: string) {
    this.id = id;
    this.username = username;
  }
}
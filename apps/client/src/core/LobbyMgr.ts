import { PlayerInfo, RoomInfo } from "@game/protocol";
import { GameEvents } from "../constants/events";

export class LobbyMgr extends Phaser.Plugins.BasePlugin {
  private players: PlayerInfo[] = [];
  private rooms: RoomInfo[] = [];
  
  init() {
    this.game.lobby = this;
  }

  updateListPlayer(players: PlayerInfo[], emit = true) {
    this.players = players;
    if (emit)
      this.game.events.emit(GameEvents.UPDATE_LIST_PLAYER);
  }

  updateListRoom(rooms: RoomInfo[], emit = true) {
    this.rooms = rooms;
    if (emit)
      this.game.events.emit(GameEvents.UPDATE_LIST_ROOM);
  }
}
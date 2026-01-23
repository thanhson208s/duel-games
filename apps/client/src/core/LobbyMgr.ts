import { PlayerInfo, RoomInfo, RoomMode } from "@game/protocol";
import { DataEvents } from "../constants/events";

export class LobbyMgr extends Phaser.Plugins.BasePlugin {
  private players: PlayerInfo[] = [];
  private rooms: RoomInfo[] = [];
  private modes: RoomMode[] = [];
  
  init() {
    this.game.lobby = this;
  }

  updateListPlayer(players: PlayerInfo[], emit = true) {
    this.players = players;
    if (emit)
      this.game.events.emit(DataEvents.UPDATE_LIST_PLAYER);
  }

  updateListRoom(rooms: RoomInfo[], emit = true) {
    this.rooms = rooms;
    if (emit)
      this.game.events.emit(DataEvents.UPDATE_LIST_ROOM);
  }
}
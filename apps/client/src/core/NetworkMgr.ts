import { GameEvents } from "../constants/events";
import { S2C, C2S } from "@game/protocol";

export const NetworkState = {
  LOBBY: "lobby",
  ROOM: "room",
  CONNECTING: "connecting",
  DISCONNECT: "disconnect"
} as const;

export type NetworkState = typeof NetworkState[keyof typeof NetworkState];

export class NetworkMgr extends Phaser.Plugins.BasePlugin {
  private lobbyUrl?: string;
  private state: NetworkState = NetworkState.DISCONNECT;
  private lobbySocket?: WebSocket;
  private roomSocket?: WebSocket;
  
  init() {
    this.game.network = this;
  }

  async login(_username: string) {
    const res = await fetch('/login', {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: _username })
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error ?? "Unknown error");
    
    const {id, username, lobbyUrl} = data as {id: number, username: string, lobbyUrl: string};
    this.lobbyUrl = lobbyUrl;
    
    return {id, username};
  }

  connectLobby() {
    if (!this.lobbyUrl) return;

    this.lobbySocket = new WebSocket(this.lobbyUrl);
    this.state = NetworkState.CONNECTING;

    this.lobbySocket.onopen = () => {
      this.state = NetworkState.LOBBY;
    }

    this.lobbySocket.onmessage = (event) => {
      let msg: S2C;
      try {
        msg = S2C.parse(JSON.parse(String(event.data)));
      } catch { return; }

      switch(msg.type) {
        case "lobby":
          this.game.lobby.updateListPlayer(msg.players);
          this.game.lobby.updateListRoom(msg.rooms);
          this.game.events.emit(GameEvents.OPEN_LOBBY);
          break;
        case "list_room":
          break;
        case "list_player":
          break;
      }
    }

    this.lobbySocket.onerror = (event) => {
      // nothing yet
    }

    this.lobbySocket.onclose = (event) => {
      // nothing yet
    }
  }

  async connectRoom() {

  }
}
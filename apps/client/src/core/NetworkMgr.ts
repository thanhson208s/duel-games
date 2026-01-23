import { NetEvents } from "../constants/events";
import { S2C, C2S } from "@game/protocol";

export type NetworkState = "lobby" | "room" | "connecting" | "disconnect";
 
export class NetworkMgr extends Phaser.Plugins.BasePlugin {
  private lobbyUrl?: string;
  private state: NetworkState = "disconnect";
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
    this.state = "connecting";

    this.lobbySocket.onopen = () => {
      this.state = "lobby";
    }

    this.lobbySocket.onmessage = (event) => {
      let msg: S2C;
      try {
        msg = S2C.parse(JSON.parse(String(event.data)));
      } catch { return; }

      switch(msg.type) {
        case "lobby":
          this.game.lobby.updateListPlayer(msg.players, false);
          this.game.lobby.updateListRoom(msg.rooms, false);
          this.game.events.emit(NetEvents.OPEN_LOBBY);
          break;
        case "list_room":
          this.game.lobby.updateListRoom(msg.rooms, true);
          break;
        case "list_player":
          this.game.lobby.updateListPlayer(msg.players, true);
          break;
      }
    }

    this.lobbySocket.onerror = (event) => {
      if (this.state === "disconnect") return;
      if (this.state === "connecting") {

      } else {

      }
    }

    this.lobbySocket.onclose = (event) => {
      if (this.state === "disconnect") return;
      if (this.state === "connecting") {

      } else {

      }
    }
  }

  async connectRoom() {

  }
}
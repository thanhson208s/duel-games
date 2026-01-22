import type { NetworkMgr } from "../core/NetworkMgr";
import type { ResourceMgr } from "../core/ResourceMgr";
import type { SettingMgr } from "../core/SettingMgr";
import type { PlayerMgr } from "../core/PlayerMgr";

declare module 'phaser' {
	interface Game {
		resource: ResourceMgr;
		setting: SettingMgr;
		audio: AudioMgr;
		network: NetworkMgr;
		player: PlayerMgr;
		lobby: LobbyMgr;
	}
}
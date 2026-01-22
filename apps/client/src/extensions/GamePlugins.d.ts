import type { ResourceMgr } from "../core/ResourceMgr";
import type { SettingMgr } from "../core/SettingMgr";

declare module 'phaser' {
	interface Game {
		resource: ResourceMgr;
		setting: SettingMgr;
	}
}
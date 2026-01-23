export const CoreEvents = {
    MUSIC_TOGGLE: "core:music_toggle",
    SFX_TOGGLE: "core:sfx_toggle",
    LANG_TOGGLE: "core:lang_toggle"
} as const;

export const DataEvents = {
    UPDATE_LIST_PLAYER: "data:update_list_player",
    UPDATE_LIST_ROOM: "data:update_list_room",
    UPDATE_LIST_MODE: "data:update_list_mode"
} as const;

export const NetEvents = {
    OPEN_LOBBY: "net:open_lobby"
}
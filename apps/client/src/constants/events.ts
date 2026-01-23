export const CoreEvents = {
    MUSIC_TOGGLE: "core:music_toggle",
    SFX_TOGGLE: "core:sfx_toggle",
    LANG_TOGGLE: "core:lang_toggle"
} as const;

export const DataEvents = {
    UPDATE_LIST_PLAYER: "game:update_list_player",
    UPDATE_LIST_ROOM: "game:update_list_room"
} as const;

export const NetEvents = {
    OPEN_LOBBY: "net:open_lobby"
}
export const UIEvents = {
} as const;

export const CoreEvents = {
    MUSIC_TOGGLE: "core:music_toggle",
    SFX_TOGGLE: "core:sfx_toggle",
    LANG_TOGGLE: "core:lang_toggle"
} as const;

export const GameEvents = {
    OPEN_LOBBY: "game:open_lobby",
    UPDATE_LIST_PLAYER: "game:update_list_player",
    UPDATE_LIST_ROOM: "game:update_list_room"
} as const;

export const NetworkEvents = {
}
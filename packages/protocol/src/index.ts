import { z } from "zod";

// common
export const RoomMode = z.enum([
  "kingdomino",
  "hanamikoji"
]);
export type RoomMode = z.infer<typeof RoomMode>;

export const PlayerInfo = z.object({
  id: z.number(),
  username: z.string()
});
export type PlayerInfo = z.infer<typeof PlayerInfo>;

export const RoomInfo = z.object({
  id: z.number(),
  mode: RoomMode
});
export type RoomInfo = z.infer<typeof RoomInfo>;

// Client -> Server
export const C2S = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("create_room"),
    mode: z.string()
  }),
  z.object({
    type: z.literal("join_room"),
    id: z.string()
  })
]);
export type C2S = z.infer<typeof C2S>;

// Server -> Client
export const S2C = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("lobby"),
    players: z.array(PlayerInfo),
    rooms: z.array(RoomInfo),
    modes: z.array(RoomMode)
  }),
  z.object({
    type: z.literal("list_player"),
    players: z.array(PlayerInfo)
  }),
  z.object({
    type: z.literal("list_room"),
    rooms: z.array(RoomInfo)
  }),
  z.object({
    type: z.literal("room"),
    mode: z.string(),
    id: z.string()
  })
]);
export type S2C = z.infer<typeof S2C>;

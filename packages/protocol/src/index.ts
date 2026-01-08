import { z } from "zod";

// common
export const PlayerInfo = z.object({
  id: z.number(),
  username: z.string()
});
export type PlayerInfo = z.infer<typeof PlayerInfo>;

export const RoomInfo = z.object({
  id: z.number()
});
export type RoomInfo = z.infer<typeof RoomInfo>;

// Client -> Server
export const C2S = z.discriminatedUnion("type", [
  z.object({ type: z.literal("login"), name: z.string().min(1).max(20) }),
]);
export type C2S = z.infer<typeof C2S>;

// Server -> Client
export const S2C = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("lobby"),
    players: z.array(PlayerInfo),
    rooms: z.array(RoomInfo)
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
    type: z.literal("create_room")
  }),
  z.object({
    type: z.literal("join_room")
  })
]);
export type S2C = z.infer<typeof S2C>;

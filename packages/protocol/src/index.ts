import { z } from "zod";

// common
export const Player = z.object({
  id: z.string(),
  name: z.string()
});
export type Player = z.infer<typeof Player>;

// Client -> Server
export const C2S = z.discriminatedUnion("type", [
  z.object({ type: z.literal("login"), name: z.string().min(1).max(20) }),
]);
export type C2S = z.infer<typeof C2S>;

// Server -> Client
export const S2C = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hello"),
    sessionId: z.string()
  }),
  z.object({
    type: z.literal("login"),
    error: z.number(),
  }),
  z.object({
    type: z.literal("players"),
    players: z.array(Player)
  }),
]);
export type S2C = z.infer<typeof S2C>;

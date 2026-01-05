import { z } from "zod";

// Client -> Server
export const C2S = z.discriminatedUnion("type", [
  z.object({ type: z.literal("join"), name: z.string().min(1).max(20) }),
  z.object({ type: z.literal("ping"), t: z.number() })
]);
export type C2S = z.infer<typeof C2S>;

// Server -> Client
export const S2C = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hello"), sessionId: z.string() }),
  z.object({ type: z.literal("pong"), t: z.number() })
]);
export type S2C = z.infer<typeof S2C>;

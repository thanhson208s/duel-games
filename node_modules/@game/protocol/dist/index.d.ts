import { z } from "zod";
export declare const C2S: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"join">;
    name: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"ping">;
    t: z.ZodNumber;
}, z.core.$strip>], "type">;
export type C2S = z.infer<typeof C2S>;
export declare const S2C: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"hello">;
    sessionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"pong">;
    t: z.ZodNumber;
}, z.core.$strip>], "type">;
export type S2C = z.infer<typeof S2C>;

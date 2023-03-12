import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const usersRouter = router({
  session: publicProcedure
    .meta({ openapi: { method: "POST", path: "/session" } })
    .input(
      z.object({
        user: z.object({
          email: z.string(),
          id: z.string(),
          name: z.string(),
          photoUrl: z.string(),
        }),
      })
    )
    .output(z.void())
    .query(async ({ input, ctx }) => {
      const {
        user: { photoUrl, ...user },
      } = input;

      const { error: userError } = await ctx.supabase
        .from("figma_users")
        .upsert({ ...user, avatar_url: photoUrl })
        .eq("id", user.id);

      if (userError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User could not be upserted",
          cause: userError,
        });
      }

      return;
    }),
});

import { TRPCError } from "@trpc/server";
import { generateToken } from "../../../utils/generateToken";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("users")
      .select("*, stats (*)")
      .like("email", ctx.session?.user?.email ?? "");

    if (error || data.length == 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Profile could not be retrieved",
        cause: error,
      });
    }

    const user = data[0];

    if (!user.token) {
      user.token = generateToken(40);

      const { error } = await ctx.supabase
        .from("users")
        .update({ token: user.token })
        .eq("id", user.id);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token could not be generated",
          cause: error,
        });
      }
    }

    if (!user.stats) {
      const { error } = await ctx.supabase
        .from("stats")
        .insert([{ user_id: user.id }]);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Default stats could not be generated",
          cause: error,
        });
      }
    }

    return user;
  }),
});

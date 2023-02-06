import { getServiceSupabaseClient } from "./../../utils/supabase";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { OpenApiMeta } from "trpc-openapi";
import * as argon2d from "argon2";

import { type Context } from "./context";
import { Database } from "../../types/supabase";

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isValidToken = t.middleware(async ({ ctx, next }) => {
  const [token, b64UserId = ""] = (ctx.req.headers.authorization ?? "").split(
    "-"
  );

  if (!token || token == "" || b64UserId == "") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "SummonAI Token is missing. Check the settings tabs for more info.",
    });
  }

  const userId = Buffer.from(b64UserId, "base64").toString("ascii");

  const { data: user } = await getServiceSupabaseClient()
    .from("users")
    .select("*, stats (*), tokens (*), subscriptions (*)")
    .eq("id", userId)
    .single();

  let isTokenValid;
  let tkn;

  if (user) {
    tkn = (
      user.tokens as Array<Database["public"]["Tables"]["tokens"]["Row"]>
    )[0];
    isTokenValid = await argon2d.verify(tkn?.hash as string, token);
  }

  if (!isTokenValid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Token is invalid.",
    });
  }

  const stats = user?.stats as Database["public"]["Tables"]["stats"]["Row"];
  const maxGenerations = (
    user?.subscriptions as Database["public"]["Tables"]["subscriptions"]["Row"]
  ).is_subscribed
    ? 200
    : 10;
  const totalGenerations = stats?.openjourney + stats?.restore + stats?.upscale;

  if (totalGenerations >= maxGenerations) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You've reached your monthly limit.",
    });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session?.user,
          id: userId,
        },
      },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

export const tokenProcedure = t.procedure.use(isValidToken);

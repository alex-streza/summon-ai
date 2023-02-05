import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { generateToken } from "../../../utils/generateToken";
import { stripe } from "../../../utils/stripe";
import { formatAmountForDisplay } from "../../../utils/stripe-utils";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("users")
      .select("*, stats (*), tokens (*), profile (*)")
      .like("email", ctx.session?.user?.email ?? "");

    if (error || !data || data?.length == 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Profile could not be retrieved",
        cause: error,
      });
    }

    const user = data[0];

    let token;

    if (!user.tokens[0]) {
      const tokens = await generateToken(16);
      token = tokens.token + "-" + Buffer.from(user.id).toString("base64");

      const { error } = await ctx.supabase.from("tokens").insert({
        hash: tokens.hashedToken,
        user_id: user.id,
      });

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

    return {
      ...user,
      token,
      stats:
        user.stats && Array.isArray(user.stats) ? user.stats[0] : user.stats,
    };
  }),
  resetToken: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.user?.id as string;

    const tokens = await generateToken(16);
    const token = tokens.token + "-" + Buffer.from(userId).toString("base64");

    const { error } = await ctx.supabase
      .from("tokens")
      .update({
        hash: tokens.hashedToken,
      })
      .eq("user_id", userId);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Token could not be generated",
        cause: error,
      });
    }

    return {
      token,
    };
  }),
  getSubscriptionPlans: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await stripe.products.list({
      active: true,
    });

    const pricePromises = data.map((subscription) =>
      stripe.prices.list({
        product: subscription.id,
        active: true,
      })
    );

    const prices = (await Promise.all(pricePromises))
      .map((price) => price.data.flat())
      .flat();

    const subscriptions = data.map((subscription, index) => {
      const price = prices.find(
        (price) => price.product == subscription.id
      ) as Stripe.Price;

      return {
        id: subscription.id,
        name: subscription.name,
        priceId: price.id,
        price: formatAmountForDisplay(
          (price.unit_amount as number) / 100,
          price.currency
        ),
        unitAmount: (price.unit_amount as number) / 100,
      };
    });

    return subscriptions[0];
  }),
  cancelPlan: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input: { subscriptionId } }) => {
      const subscription = await stripe.subscriptions.del(subscriptionId);

      return subscription;
    }),
});

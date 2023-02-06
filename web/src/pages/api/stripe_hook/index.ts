import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "../../../utils/stripe";
import { getServiceSupabaseClient } from "../../../utils/supabase";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const addTransaction = async (paymentIntent: Stripe.PaymentIntent) => {
  const transactionInfo = {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    type: paymentIntent.metadata.type as any,
    details: paymentIntent.metadata.details,
  };

  // const user = await prisma?.user.update({
  //   where: {
  //     email: paymentIntent.metadata.email,
  //   },
  //   include: {
  //     transactions: true,
  //   },
  //   data: {
  //     transactions: {
  //       upsert: {
  //         where: {
  //           id: transactionInfo.id,
  //         },
  //         create: transactionInfo,
  //         update: transactionInfo,
  //       },
  //     },
  //   },
  // });
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    const supabase = await getServiceSupabaseClient();

    const subscription = event.data.object as Stripe.Subscription;

    // Cast event data to Stripe object.
    if (event.type === "customer.subscription.created") {
      await supabase
        .from("subscriptions")
        .update({
          is_subscribed: true,
          subscription_id: subscription.id,
          interval: subscription.items.data[0]?.plan.interval,
        })
        .eq("stripe_customer", subscription.customer);
    } else if (event.type === "customer.subscription.deleted") {
      await supabase
        .from("subscriptions")
        .update({
          is_subscribed: false,
          subscription_id: null,
          interval: null,
        })
        .eq("stripe_customer", subscription.customer);
    } else if (event.type === "customer.subscription.updated") {
      const cancelAt = subscription.cancel_at;

      await supabase
        .from("subscriptions")
        .update({
          cancel_at: cancelAt ? new Date(cancelAt * 1000).toISOString() : null,
        })
        .eq("stripe_customer", subscription.customer);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
  res.status(200).json({ received: true });
};

export default cors(webhookHandler as any);

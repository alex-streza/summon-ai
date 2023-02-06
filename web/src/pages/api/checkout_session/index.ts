import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../types/supabase";
import { stripe } from "../../../utils/stripe";
import { getServiceSupabaseClient } from "../../../utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const supabase = await getServiceSupabaseClient();

      const priceId = req.body.priceId;
      const origin = req.headers.origin as string;

      const { data: user } = await supabase
        .from("users")
        .select("*, subscriptions (*)")
        .like("email", req.body.email)
        .single();

      let customerId = (
        user?.subscriptions as Database["public"]["Tables"]["subscriptions"]["Row"]
      )?.stripe_customer;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: req.body.email,
        });

        await supabase
          .from("subscriptions")
          .insert({
            stripe_customer: customer.id,
            user_id: user?.id,
          })
          .eq("user_id", user?.id);

        customerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/account`,
        cancel_url: `${origin}/account`,
      });

      res.status(200).json(session);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

import { Stripe } from "stripe";

export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
});

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  // https://github.com/stripe/stripe-node#configuration
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  apiVersion: "2026-04-22.dahlia",
  appInfo: {
    name: "Next.js Subscription Starter",
    version: "0.1.0",
  },
});

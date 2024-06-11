import { UserType } from "@/db/types/user.type";
import { stripe } from "@/lib/utils/stripe";
import { SubscriptionData } from "@/types";
import SubscriptionCard from "./subscriptionCard";

const SubscriptionPlans = async ({ user }: { user: Partial<UserType> }) => {
  const stripeResponse = await stripe.prices.list();
  const products = (await stripe.products.list({ active: true })).data;
  const plans = stripeResponse.data;
  const productsData = products.map((product) => {
    const plan = plans.filter((plan) => plan.product === product.id);
    return {
      name: product.name,
      id: product.id,
      prices: plan.map((item) => {
        return {
          product: item.product,
          id: item.id,
          interval: item.recurring?.interval,
          amount: item.unit_amount,
          currency: item.currency,
        };
      }),
    };
  });
  const subscription = await stripe.subscriptions.retrieve(
    user.stripe_subscription_id!,
  );
  const subsCriptionData: SubscriptionData = {
    subscription_id: subscription.id,
    product_id: subscription.items.data[0].plan.product!,
    pricing_id: subscription.items.data[0].plan.id,
    customer_id: subscription.customer!,
    subscription_interval: subscription.items.data[0].plan?.interval!,
    subscription_item_id: subscription.items.data[0].id,
  };
  return (
    <SubscriptionCard
      productsData={productsData}
      subsCriptionData={subsCriptionData}
    />
  );
};

export default SubscriptionPlans;

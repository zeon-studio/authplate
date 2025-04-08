import { PricingTier } from "@/actions/paddle/pricing-tier";
import { getActiveSubscriptions } from "@/actions/subscriptions";
import PricingCard from "@/layouts/components/PricingCard";
import { auth } from "@/lib/auth";

export default async function Page() {
  const { user } = (await auth()) || {};
  const currentActiveSubscriptions = await getActiveSubscriptions(user?.id!);

  if (!currentActiveSubscriptions?.success) {
    return <div>Something went wrong</div>;
  }

  return (
    <section className="section bg-light/30" id="pricing">
      <div className="container">
        <div className="grid grid-cols-4 gap-4">
          {PricingTier.map((tier) => {
            const priceIds = Object.values(tier.priceId);

            const isActive = currentActiveSubscriptions.data.some(
              (subscription) => priceIds.includes(subscription.planId),
            );

            return (
              <PricingCard isActive={isActive} key={tier.id} tier={tier} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

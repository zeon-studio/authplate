import { PricingTier } from "@/actions/paddle/pricing-tier";
import { BillingPeriod, Tier } from "@/actions/paddle/type";

export function getPriceIdFromParams(params: {
  planName: string;
  billingPeriod: BillingPeriod;
}): string {
  const pricingTier = PricingTier.find((tier) => tier.id === params.planName);

  if (!pricingTier) {
    throw new Error("Pricing tier not found");
  }

  if (
    "month" in pricingTier.priceId &&
    params.billingPeriod === BillingPeriod.MONTHLY
  ) {
    return pricingTier.priceId.month;
  }

  if (
    "year" in pricingTier.priceId &&
    params.billingPeriod === BillingPeriod.ANNUALLY
  ) {
    return pricingTier.priceId.year;
  }

  if (
    "lifetime" in pricingTier.priceId &&
    params.billingPeriod === BillingPeriod.LIFETIME
  ) {
    return pricingTier.priceId.lifetime;
  }

  throw new Error("Price not found for billing period");
}

// current plan details

export function getCurrentPlanDetails(params: {
  planName: string;
  billingPeriod: BillingPeriod;
}): Tier {
  const pricingTier = PricingTier.find((tier) => tier.id === params.planName);

  if (!pricingTier) {
    throw new Error("Pricing tier not found");
  }

  return pricingTier;
}

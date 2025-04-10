import { BillingCycle } from "@/app/actions/paddle/pricing-tier";
import { PackageType } from "@/app/actions/paddle/type";

export const PricingTier: {
  name: string;
  id: PackageType; // Ensure id matches PackageType
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: { [BillingCycle.LIFETIME]: string };
}[] = [
  {
    name: "Basic",
    id: "BASIC",
    icon: "basic-icon",
    description: "Basic plan description",
    features: ["Feature 1", "Feature 2"],
    featured: false,
    priceId: { [BillingCycle.LIFETIME]: "price_basic_lifetime" },
  },
  {
    name: "Premium",
    id: "PREMIUM",
    icon: "premium-icon",
    description: "Premium plan description",
    features: ["Feature 1", "Feature 2"],
    featured: true,
    priceId: { [BillingCycle.LIFETIME]: "" },
  },
  {
    name: "Premium Lifetime",
    id: "PREMIUM_LIFETIME",
    icon: "premium-lifetime-icon",
    description: "Premium lifetime plan description",
    features: ["Feature 1", "Feature 2"],
    featured: false,
    priceId: { [BillingCycle.LIFETIME]: "price_premium_lifetime" },
  },
  {
    name: "Enterprise",
    id: "ENTERPRISE",
    icon: "enterprise-icon",
    description: "Enterprise plan description",
    features: ["Feature 1", "Feature 2"],
    featured: false,
    priceId: { [BillingCycle.LIFETIME]: "price_enterprise_lifetime" },
  },
];

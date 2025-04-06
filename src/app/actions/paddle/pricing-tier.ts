import { BillingCycle } from "@prisma/client";
import { PackageType } from "./type";

export interface Tier {
  name: string;
  id: PackageType;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Partial<Record<BillingCycle, string>>; // TODO: Add lifetime ke
}

export const PricingTier: Tier[] = [
  {
    name: PackageType.HOBBY,
    id: PackageType.HOBBY,
    icon: "/assets/icons/price-tiers/free-icon.svg",
    description: "Free forever. Enjoy our services for free.",
    features: [
      "1 Organization",
      "1 User",
      "Up to 5 sites (1 private repo)",
      "Only Github Repositories",
      "Deployment Status",
      "1 Role",
      "Community Support",
    ],
    featured: false,
    priceId: {
      [BillingCycle.LIFETIME]: "pri_01jksvc2keca5wq10q4r8w7y11",
    },
  },
  {
    name: PackageType.TEAM,
    id: PackageType.TEAM,
    icon: "/assets/icons/price-tiers/basic-icon.svg",
    description: "$27/month (Billed annually).",
    features: [
      "3 Organization",
      "5 Users per organization",
      "Up to 15 sites (Public + Private Repo)",
      "Github, GitLab, BitBucket Repositories",
      "AI Assistant",
      "SEO Suggestions",
      "Deployment Status",
      "2 Roles",
      "Content Scheduling",
      "Analytics",
      "Premium support",
    ],
    featured: true,
    priceId: {
      [BillingCycle.MONTHLY]: "pri_01jksv6m11bswv4fc1t8ymqk2g",
      [BillingCycle.ANNUAL]: "pri_01jksv7n6c4m2rwwvpkbnqpkrw",
    },
  },
  {
    name: PackageType.ENTERPRISE,
    id: PackageType.ENTERPRISE,
    icon: "/assets/icons/price-tiers/pro-icon.svg",
    description: "Get in touch with us to get this plan.",
    features: [
      "Unlimited Organizations",
      "Unlimited Users",
      "Unlimited sites",
      "Github, GitLab, BitBucket Repositories",
      "AI Assistant",
      "SEO Suggestions",
      "Deployment Status",
      "Custom",
      "Content Scheduling",
      "Analytics",
      "White Label?",
      "Custom Branding",
      "Premium Support",
    ],
    featured: false,
    priceId: {
      [BillingCycle.MONTHLY]: "pri_01jksvevphtkncjce1yvbep923",
      [BillingCycle.ANNUAL]: "pri_01jksvh7ad31wyceybcxpww8ca",
    },
  },
  {
    name: PackageType.TEAM_LIFETIME,
    id: PackageType.TEAM_LIFETIME,
    icon: "/assets/icons/price-tiers/pro-icon.svg",
    description: "100 slots remaining",
    features: [
      "3 Organization",
      "5 Users per organization",
      "Up to 15 sites (Public + Private Repo)",
      "Github, GitLab, BitBucket Repositories",
      "AI Assistant",
      "SEO Suggestions",
      "Deployment Status",
      "2 Roles",
      "Content Scheduling",
      "Analytics",
      "Premium support",
    ],
    featured: false,
    priceId: {
      [BillingCycle.LIFETIME]: "pri_01jksxd2n500m05cxxd61k41my",
    },
  },
];

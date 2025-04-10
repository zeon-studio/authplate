import { BillingCycle } from "@/models/Subscription/type";

export type PackageType =
  | "BASIC"
  | "PREMIUM"
  | "PREMIUM_LIFETIME"
  | "ENTERPRISE";

type OneKeyOnly<T> = {
  [K in keyof T]: {
    [P in K]: T[P];
  } & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

export interface Tier {
  name: string;
  id: PackageType;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: OneKeyOnly<Record<keyof typeof BillingCycle, string>>;
}

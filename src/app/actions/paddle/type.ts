import { BillingCycle } from "@prisma/client";

export enum PackageType {
  HOBBY = "hobby",
  TEAM = "team",
  ENTERPRISE = "enterprise",
  TEAM_LIFETIME = "team_lifetime",
}

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
  priceId: OneKeyOnly<Record<BillingCycle, string>>;
}

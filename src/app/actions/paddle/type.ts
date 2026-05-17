export enum EBillingCycle {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  ANNUAL = "ANNUAL",
  LIFETIME = "LIFETIME",
}

export enum EPackageType {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  PREMIUM_LIFETIME = "PREMIUM_LIFETIME",
  ENTERPRISE = "ENTERPRISE",
}

type TOneKeyOnly<T> = {
  [K in keyof T]: {
    [P in K]: T[P];
  } & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

export interface Tier {
  name: string;
  id: EPackageType;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: TOneKeyOnly<Record<keyof typeof EBillingCycle, string>>;
}

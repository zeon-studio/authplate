export enum PackageType {
  HOBBY = "hobby",
  TEAM = "team",
  ENTERPRISE = "enterprise",
  TEAM_LIFETIME = "team_lifetime",
}

export enum BillingPeriod {
  MONTHLY = "monthly",
  ANNUALLY = "annually",
  LIFETIME = "lifetime",
}

export type Tier = {
  name: string;
  id: PackageType;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId:
    | {
        month: string;
        year: string;
      }
    | {
        lifetime: string;
      };
};

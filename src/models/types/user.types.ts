export enum Provider {
  CREDENTIALS = "CREDENTIALS",
  GITHUB = "Github",
  GOOGLE = "Google",
}

export interface UserType {
  firstName: string;
  lastName: string;
  email?: string;
  emailVerified: boolean;
  image?: string;
  password?: string;
  isTermsAccepted: boolean;
  provider: Provider;
  verifications?: OtpVerificationType[];
  subscriptions?: SubscriptionType[];
  payments?: PaymentType[];
  createdAt: Date;
  updatedAt: Date;
}

export type OtpVerificationType = {
  _id: string;
  userId: string;
};

export type SubscriptionType = {
  _id: string;
  userId: string;
};

export type PaymentType = {
  _id: string;
  userId: string;
};

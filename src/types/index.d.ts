import Stripe from "stripe";

export type RegularPage = {
  frontmatter: {
    title: string;
    image?: string;
    description?: string;
    meta_title?: string;
    layout?: string;
    draft?: boolean;
  };
  content: string;
  slug?: string;
};
// export type Prices = {
//   product: string | Stripe.Product | Stripe.DeletedProduct;
//   id: string;
//   interval: Stripe.Price.Recurring.Interval | undefined;
//   amount: number;
//   currency: string;
// };
export type Product = {
  name: string;
  id: string;
  prices: {
    product: string | Stripe.Product | Stripe.DeletedProduct;
    id: string;
    interval: Stripe.Price.Recurring.Interval | undefined;
    amount: number | null;
    currency: string;
  }[];
};

export type Post = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    categories: string[];
    author: string;
    tags: string[];
    date?: string;
    draft?: boolean;
  };
  slug?: string;
  content?: string;
};

export type Author = {
  frontmatter: {
    title: string;
    image?: string;
    description?: string;
    meta_title?: string;
    social: [
      {
        name: string;
        icon: string;
        link: string;
      },
    ];
  };
  content?: string;
  slug?: string;
};
export type Client = string;
export type Benefits = {
  title: string;
  content: string;
  image: string;
};
export type Experience = {
  title: string;
  benefits: Benefits[];
};
export type Feature_Details = {
  button: button;
  image: string;
  bulletpoints: string[];
  content: string;
  title: string;
};
export type Feature = {
  title: string;
  content: string;
  icon: string;
};
export type Features = {
  title: string;
  features: Feature[];
};
export type Testimonial = {
  name: string;
  designation: string;
  avatar: string;
  content: string;
};

export type Call_to_action = {
  enable?: boolean;
  title: string;
  description: string;
  image: string;
  button: Button;
};

export type Button = {
  enable: boolean;
  label: string;
  link: string;
};

interface PricingCard {
  name: string;
  content: string;
  currency: string;
  monthly_price: string;
  yearly_price: string;
  featured: boolean;
  button_label: string;
  button_link: string;
  services: string[];
}

type Package = "monthly" | "yearly";

interface Pricing {
  title: string;
  description: string;
  offer: string;
  monthly_yearly_toggle: Package;
  billing: {
    monthly: string;
    annually: string;
  };
  pricing_card: PricingCard[];
  draft: boolean;
}

export type SubscriptionData = {
  subscription_id: string;
  product_id: string | Stripe.Product | Stripe.DeletedProduct;
  pricing_id: string;
  customer_id: string | Customer | DeletedCustomer;
  subscription_item_id: string;
  subscription_interval: string;
};

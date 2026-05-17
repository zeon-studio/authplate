import Stripe from "stripe";

export type TRegularPage = {
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

export type TProduct = {
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

export type TPost = {
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

export type TAuthor = {
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
export type TClient = string;
export type TBenefits = {
  title: string;
  content: string;
  image: string;
};
export type TExperience = {
  title: string;
  benefits: TBenefits[];
};
export type TFeature_Details = {
  button: button;
  image: string;
  bulletpoints: string[];
  content: string;
  title: string;
};
export type TFeature = {
  title: string;
  content: string;
  icon: string;
};
export type TFeatures = {
  title: string;
  features: TFeature[];
};
export type TTestimonial = {
  name: string;
  designation: string;
  avatar: string;
  content: string;
};

export type TCall_to_action = {
  enable?: boolean;
  title: string;
  description: string;
  image: string;
  button: TButton;
};

export type TButton = {
  enable: boolean;
  label: string;
  link: string;
};

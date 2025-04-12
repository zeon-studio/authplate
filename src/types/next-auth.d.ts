import { Provider } from "@prisma/client";
import type { DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      image?: string;
      emailVerified: boolean;
      provider: Provider;
    };
  }

  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    provider: Provider;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    provider: Provider;
  }
}

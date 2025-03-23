// types/next-auth.d.ts
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
      accessToken: string | null;
      provider: "Google" | "Github" | "Credentials";
    };
  }

  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    accessToken: string | null;
    provider: "Google" | "Github" | "Credentials";
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
    accessToken: string | null;
    provider: "Google" | "Github" | "Credentials";
  }
}

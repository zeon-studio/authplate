import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      firstName: string;
      lastName: string;
      emailVerified: boolean;
      accessToken: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  adapter: {
  }
  interface JWT {
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    email: string;
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

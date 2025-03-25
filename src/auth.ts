import { verifyUserWithPassword } from "@/actions/user";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { authOptions } from "./auth-option";
import { InvalidCredentials } from "./lib/utils/error";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authOptions,
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },

      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await verifyUserWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (result?.success === false) {
          // set verification for otp

          throw new InvalidCredentials({
            message: result.error?.message || "Invalid credentials!",
            // @ts-ignore
            errorMessage: result.error?.errorMessage || [],
          });
        }
        const user = result?.data!;
        return user as any;
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          image: profile.picture,
          email: profile.email,
          first_name: profile.given_name,
          last_name: profile.family_name,
        };
      },
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile({ name, avatar_url }) {
        const [firstName, lastName] = name?.split(" ");
        return {
          firstName,
          lastName,
          emailVerified: true,
          provider: "Github",
          image: avatar_url,
        };
      },
    }),
  ],
});

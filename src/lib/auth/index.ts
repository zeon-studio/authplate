import { verifyUserWithPassword } from "@/actions/user";
import { authOptions } from "@/lib/auth/auth-option";
import { InvalidCredentials } from "@/lib/utils/error";
import { Provider } from "@prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

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
          firstName: profile.given_name,
          lastName: profile.family_name,
          provider: Provider.GOOGLE,
          emailVerified: true,
        };
      },
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile({ name, avatar_url }) {
        const nameParts = name?.split(" ") || [];
        const firstName = nameParts[0];
        const lastName = nameParts[1];

        return {
          firstName,
          lastName,
          emailVerified: true,
          provider: Provider.GITHUB,
          image: avatar_url,
        };
      },
    }),
  ],
});

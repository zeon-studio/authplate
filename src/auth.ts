import { verifyUserWithPassword } from "@/actions/user";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { InvalidCredentials } from "./lib/utils/error";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/signup",
    error: "/signin",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image = token.image;
        // @ts-ignore
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.firstName = user.firstName!;
        token.lastName = user.lastName!;
        token.image = user.image!;
        // @ts-ignore
        token.emailVerified = user.emailVerified!;
      }
      return token;
    },
  },
});

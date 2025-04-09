import db from "@/lib/prisma";
import { NextAuthConfig } from "next-auth";

export const authOptions = {
  providers: [],
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
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        return !!user.emailVerified;
      }

      const dbUser = await db.user.upsert({
        where: {
          email: user.email!,
        },
        create: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          emailVerified: true,
          isTermsAccepted: true,
          provider: account?.provider === "google" ? "GOOGLE" : "GITHUB",
        },
        update: {
          emailVerified: true,
        },
      });

      user.firstName = dbUser.firstName || "";
      user.lastName = dbUser.lastName || "";
      user.image = dbUser.image;
      user.emailVerified = dbUser.emailVerified;
      user.id = dbUser.id;

      return true;
    },
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
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.firstName = session?.firstName!;
        token.lastName = session?.lastName!;
        token.image = session?.image!;
        token.emailVerified = session?.emailVerified!;
      }

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
} satisfies NextAuthConfig;

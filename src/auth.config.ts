import { createToken } from "@/actions/jwt";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import prisma from "./lib/prismaClient";

export default {
  providers: [
    Credentials({}),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  callbacks: {
    async signIn({ user, credentials, account, profile }) {
      //@ts-ignore
      if (account?.type === "credentials" && !user.emailVerified) {
        return false;
      }

      //@ts-ignore
      if (account?.type === "credentials" && user.emailVerified) {
        return true;
      }

      const email = user.email;
      let dbUser = await prisma.user.findUnique({
        where: { email: email as string },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: email,
            image: user.image,
            firstName: user.name,
            lastName: user.name,
            accessToken: await createToken({ email }),
            provider: "Github",
            emailVerified: true,
            isTermsAccepted: true,
          },
        });
        console.log({ dbUser });
        return dbUser;
      }
      return true;
    },
    jwt({ token, user, profile, account }) {
      console.log({ user, profile, account });
      return token;
    },

    session({ session }) {
      return session;
    },
  },
} satisfies NextAuthConfig;

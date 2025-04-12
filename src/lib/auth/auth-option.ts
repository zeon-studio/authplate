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
      const origin = process.env.NEXTAUTH_URL ?? process.env.NEXTAUTH_URL;
      const response = await fetch(`${origin}/api/auth/oauth-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          emailVerified: user.emailVerified,
          provider: user.provider,
        }),
      });

      const { data: dbUser } = await response.json();
      user.firstName = dbUser.firstName || "";
      user.lastName = dbUser.lastName || "";
      user.image = dbUser.image;
      user.emailVerified = dbUser.emailVerified;
      user.id = dbUser._id;

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

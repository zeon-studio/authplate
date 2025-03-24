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

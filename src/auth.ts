import { verifyUserWithPassword } from "@actions/user";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
          throw new CredentialsSignin(result.error?.message!);
        }
        const user = result?.data!;
        return user as any;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.firstName = user.firstName!;
        token.lastName = user.lastName!;
      }
      return token;
    },
  },
});

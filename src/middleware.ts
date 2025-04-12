import { authOptions } from "@/lib/auth/auth-option";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authOptions);
const publicUrl = ["/signin", "/signup", "/forgot-password", "/otp"];
export default auth((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth && req.auth.user.emailVerified;
  const pathname = nextUrl.pathname;
  const origin = nextUrl.origin;

  if (publicUrl.some((u) => pathname.startsWith(u))) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", origin));
    } else {
      return NextResponse.next();
    }
  }

  if (!isAuth) {
    return NextResponse.redirect(new URL(`/signin?from=${pathname}`, origin));
  }
});

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/",
    "/otp",
    "/forgot-password",
    "/checkout",
    "/dashboard/:path*",
  ],
};

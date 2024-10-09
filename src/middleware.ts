import { NextResponse } from "next/server";
import { auth } from "./auth";

const publicUrl = ["/signin", "/signup", "/forgot-password"];

export default auth((req) => {
  const { nextUrl } = req;
  const { emailVerified } = req.auth?.user || {};
  const isAuth = !!req.auth;
  const pathname = nextUrl.pathname;
  const origin = nextUrl.origin;

  if (!emailVerified && isAuth && pathname !== "/otp") {
    return NextResponse.redirect(new URL(`/otp`, origin));
  }

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
  matcher: ["/signin", "/signup/", "/otp"],
};

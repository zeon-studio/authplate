import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const publicUrl = ["/signin", "/signup", "/forgot-password", "/otp"];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;
  const sessionCookie = getSessionCookie(req);

  if (publicUrl.some((u) => pathname.startsWith(u))) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/", origin));
    } else {
      return NextResponse.next();
    }
  }

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL(`/signin?from=${pathname}`, origin));
  }
  return NextResponse.next();
}

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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/change-password"];

const publicRoutes = [
  "/",
  "/login",
  "/reset-password",
  "/check-email",
  "/forgot-password",
  "/verify-account",
];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token_admin")?.value;
  const { pathname } = request.nextUrl;

  const assetUrl = process.env.NEXT_PUBLIC_ASSET_URL;
  const rootPaths = ["/login", assetUrl];

  if (rootPaths.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(
        new URL(`${assetUrl}/dashboard`, request.url)
      );
    } else {
      return NextResponse.redirect(new URL(`${assetUrl}/`, request.url));
    }
  }

  if (publicRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL(`${assetUrl}/dashboard`, request.url));
  }

  if (protectedRoutes.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL(`${assetUrl}/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)", "/"],
};

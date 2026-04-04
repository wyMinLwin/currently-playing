import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "session_token";

const PUBLIC_PATHS = [
  "/connect",
  "/api/spotify/auth",
  "/api/spotify/callback",
  "/api/spotify/currently-playing",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/connect", request.url));
  }

  // Session cookie exists — let the request through.
  // Full validation happens server-side in the page/route.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, robots.txt, sitemap.xml (static files)
     * - files with extensions (e.g. .css, .js, .png)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)",
  ],
};

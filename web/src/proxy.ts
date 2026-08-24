import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function resolveLocale(request: NextRequest): "de" | "en" {
  const fromQuery = request.nextUrl.searchParams.get("lang");
  if (fromQuery === "en" || fromQuery === "de") {
    return fromQuery;
  }
  const fromCookie = request.cookies.get("nahrung-locale")?.value;
  return fromCookie === "en" ? "en" : "de";
}

export function proxy(request: NextRequest) {
  const locale = resolveLocale(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nahrung-locale", locale);
  requestHeaders.set("x-nahrung-path", request.nextUrl.pathname);
  requestHeaders.set("x-nahrung-search", request.nextUrl.search);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const fromQuery = request.nextUrl.searchParams.get("lang");
  if (fromQuery === "de" || fromQuery === "en") {
    response.cookies.set("nahrung-locale", fromQuery, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

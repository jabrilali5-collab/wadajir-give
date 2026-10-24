import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "./lib/i18n/config";
import { refreshSession } from "./lib/supabase/proxy-session";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("wg_locale")?.value;
  if (cookie && isLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  // Pick Somali if it appears before English in the browser's language list.
  const so = header.indexOf("so");
  const en = header.indexOf("en");
  if (so !== -1 && (en === -1 || so < en)) return "so";
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.cookies.set("wg_locale", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return refreshSession(request, response);
}

export const config = {
  matcher: [`/((?!api|auth|_next|favicon.ico|.*\\..*).*)`],
};


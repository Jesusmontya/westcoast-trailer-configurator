import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cambia esto por el nombre real de tu carpeta del panel (el que elegiste al hacer mv)
const ADMIN_ROUTE = "/panel-act-9k2m";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  const isAdminSubdomain = hostname.startsWith("admin.");

  if (isAdminSubdomain && !pathname.startsWith(ADMIN_ROUTE)) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_ROUTE + pathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
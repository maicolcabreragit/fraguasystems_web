import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

/* ═══════════════════════════════════════════════════════════════════
   Route Protection Middleware
   
   /dashboard/* → requires admin role
   /area-clientes/portal/* → requires authenticated user
   ═══════════════════════════════════════════════════════════════════ */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Dashboard Routes (Admin Only) ──────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("fragua-session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/area-clientes?redirect=dashboard", request.url));
    }

    const session = await verifyToken(token);
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/area-clientes?redirect=dashboard", request.url));
    }
  }

  // ─── Client Portal Routes ──────────────────────────────────────
  if (pathname.startsWith("/area-clientes/portal")) {
    const token = request.cookies.get("fragua-session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/area-clientes", request.url));
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.redirect(new URL("/area-clientes", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/area-clientes/portal/:path*"],
};

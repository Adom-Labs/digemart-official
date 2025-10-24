import { NextRequest, NextResponse } from "next/server";

// Reserved subdomains that should not be treated as store subdomains
const RESERVED_SUBDOMAINS = [
  "www",
  "api",
  "admin",
  "app",
  "mail",
  "ftp",
  "blog",
  "shop",
  "store",
  "support",
  "help",
  "docs",
  "dev",
  "staging",
  "test",
  "demo",
  "cdn",
  "assets",
  "static",
  "media",
  "images",
  "files",
  "download",
  "upload",
];

function extractSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(":")[0];
  console.log(host);

  // Split by dots and check if we have a subdomain
  const parts = host.split(".");

  // For localhost development, check for subdomain pattern
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    // Handle localhost:3000 or subdomain.localhost:3000
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "127") {
      return parts[0];
    }
    return null;
  }

  // For production domains (e.g., subdomain.digemart.com)
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Don't treat reserved subdomains as store subdomains
    if (!RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
      return subdomain;
    }
  }

  return null;
}

function isStoreSubdomain(subdomain: string | null): boolean {
  return (
    subdomain !== null &&
    subdomain.length >= 3 &&
    subdomain.length <= 63 &&
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(subdomain)
  );
}

export default async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const subdomain = extractSubdomain(hostname);

  console.log("Middleware");
  console.log("Hostname:", hostname);
  console.log("Subdomain:", subdomain);
  console.log(
    "isStoreSubdomain:",
    subdomain && !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())
  );
  console.log(isStoreSubdomain(subdomain));

  // Handle store subdomain routing
  if (isStoreSubdomain(subdomain)) {
    const url = request.nextUrl.clone();

    // Skip API routes and static files
    if (
      url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/favicon.ico") ||
      url.pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Rewrite to store page with subdomain parameter
    url.pathname = `/store/${subdomain}${url.pathname}`;

    // Add subdomain to headers for server components
    const response = NextResponse.rewrite(url);
    response.headers.set("x-store-subdomain", subdomain!);

    return response;
  }

  // For non-subdomain requests, just continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

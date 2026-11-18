import type { NextConfig } from "next";

// Security headers (findings M1, 2026-11-18). The enforced CSP only covers
// framing, plugins and <base>, which cannot break third-party scripts. The full
// policy ships as Report-Only: browsers log violations and block nothing.
// Promote it once the console is quiet.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  "media-src 'self' blob: data: https:",
  "frame-src 'self' https:",
  "worker-src 'self' blob:",
  "form-action 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");
const BASE_HEADERS = [
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];
const SECURITY_HEADERS = [
  ...BASE_HEADERS,
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  /**
   * The blog exports link the byline to /authors/apoorv-tamrakar, with the
   * spelling the founder does not use. The import unwrapped those anchors
   * rather than shipping 404s, but the URL is out in the world, so it points
   * at the real author page instead of dying.
   */
  async redirects() {
    return [
      { source: "/authors/apoorv-tamrakar", destination: "/authors/apoorv-tamrkar", permanent: true },
      { source: "/author", destination: "/authors/apoorv-tamrkar", permanent: true },
      { source: "/authors", destination: "/authors/apoorv-tamrkar", permanent: true },
    ];
  },

  /* config options here */
};

export default nextConfig;

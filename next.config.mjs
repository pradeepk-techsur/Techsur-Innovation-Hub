/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // SEC-10: Required HTTP security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // NOTE: X-Frame-Options is intentionally NOT set as DENY —
          // the Pivota preview embeds the app in an iframe.
          // frame-ancestors is configured at the load balancer level for production.
          // Strict-Transport-Security is added by the load balancer/reverse proxy for HTTPS deployments.
          // Content-Security-Policy is intentionally minimal at app level; full CSP at load balancer.
        ],
      },
    ];
  },
  // Ensure server binds to 0.0.0.0 for containerized deployments
  // (already configured via npm run dev -H 0.0.0.0 in package.json)
};
export default nextConfig;

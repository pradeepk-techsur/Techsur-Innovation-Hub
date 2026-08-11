/** @type {import('next').NextConfig} */
const nextConfig = {
  // No X-Frame-Options DENY — Hub must be embeddable in Pivota preview (iframe)
  // CSP frame-ancestors is omitted at app level; set at load balancer if needed
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};
export default nextConfig;

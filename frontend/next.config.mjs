/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Support multi-tenant custom domains
  async rewrites() {
    return [
      // Public website pages for tenant custom domains
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?!app\\.)(?!admin\\.).*" }],
        destination: "/public/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Tenant-ID" },
        ],
      },
    ];
  },

  images: {
    domains: ["localhost", "minio", "s3.amazonaws.com", "cdn.clinicplatform.com"],
    remotePatterns: [{ protocol: "https", hostname: "**.clinicplatform.com" }],
  },

  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
  },
};

export default nextConfig;

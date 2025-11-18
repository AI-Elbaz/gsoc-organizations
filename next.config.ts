import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  headers: () => [
    {
      source: "/organizations/:path*",
      headers: [
        {
          key: "Cache-Control",
          value:
            "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
        },
      ],
    },
  ],
};

export default nextConfig;

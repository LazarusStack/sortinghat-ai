import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

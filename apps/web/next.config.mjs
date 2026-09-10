const nextConfig = {
  output: "standalone",
  transpilePackages: ["@visibility/core", "@visibility/db"],
  experimental: { optimizePackageImports: ["@visibility/core"] }
};
export default nextConfig;

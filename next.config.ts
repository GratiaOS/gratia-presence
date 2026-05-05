// Telemetry disabled via NEXT_TELEMETRY_DISABLED=1 in CI env
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;

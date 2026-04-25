/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  output: "export",
  basePath: "/your-repo-name",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

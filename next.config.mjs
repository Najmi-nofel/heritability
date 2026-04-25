/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  output: "export",
  basePath: "/heritability",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

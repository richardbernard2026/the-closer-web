/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['pdf-parse', 'mammoth'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
};

export default nextConfig;

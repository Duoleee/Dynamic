/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/Dynamic',
  assetPrefix: '/Dynamic/',
  images: {
    unoptimized: true,
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      }
    });

    // Optimize for 3D
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic'
    }

    return config;
  },
  // Improve asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  compress: true,
}

module.exports = nextConfig

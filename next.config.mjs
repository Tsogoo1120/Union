import { codeInspectorPlugin } from 'code-inspector-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
      {
        protocol: "https",
        hostname: "juqfqrszvyxozmgumrfx.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "www.dirteaworld.com",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
    ],
  },
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      config.plugins.push(
        codeInspectorPlugin({
          bundler: 'webpack',
          editor: process.env.CODE_EDITOR || 'cursor',
          showSwitch: true,
          hotKeys: ['altKey'],
        })
      );
    }
    return config;
  },
};

export default nextConfig;

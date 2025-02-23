import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['s1.locimg.com','127.0.0.1'],  // 允许加载的外部图片域名
  },
};

export default nextConfig;
import type { NextConfig } from 'next';
import { IMAGE_DOMAINS } from './CONFIG';

const nextConfig: NextConfig = {
  images: {
    domains: IMAGE_DOMAINS, 
  },
};

export default nextConfig;
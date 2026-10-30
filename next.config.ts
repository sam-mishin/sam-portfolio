/**
 * next.config.ts — Next.js settings.
 *
 * Cache Components and Partial Prefetching are the defaults for new Next.js
 * 16 apps. Every page on this site is static, so they mostly mean fast,
 * prefetched navigation between the home page and the case studies.
 * Milestone 5 adds MDX support here.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;

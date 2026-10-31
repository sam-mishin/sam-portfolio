/**
 * next.config.ts — Next.js settings.
 *
 * - MDX: case studies are written as .mdx files in content/case-studies/
 *   and imported by app/work/[slug]/page.tsx. @next/mdx compiles them;
 *   the components they can use are listed in mdx-components.tsx.
 * - Cache Components and Partial Prefetching are the defaults for new
 *   Next.js 16 apps. Every page here is static, so in practice they mean
 *   fast, prefetched navigation between the home page and case studies.
 */
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

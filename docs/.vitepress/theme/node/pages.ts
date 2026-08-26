import { SiteConfig } from "vitepress";

import { ThemeConfig } from "../types";

/**
 * Paths of the dynamic `[file]` routes, which render individual files of the
 * example packs. They are marked `noindex` in `page/transformHead.ts`.
 */
export function getDynamicPagePaths(config: SiteConfig<ThemeConfig>) {
  return new Set(config.dynamicRoutes.routes.map((route) => route.path));
}

/** @returns Every documentation page, as a `srcDir` relative markdown path. */
export function getStaticPages(config: SiteConfig<ThemeConfig>) {
  const dynamic = getDynamicPagePaths(config);

  return config.pages.filter((page) => !dynamic.has(page) && !page.includes("["));
}

/** @returns The markdown path a sitemap entry was generated from. */
export function sitemapUrlToPagePath(url: string) {
  if (url === "" || url.endsWith("/")) return `${url}index.md`;

  return `${url.replace(/\.html$/, "")}.md`;
}

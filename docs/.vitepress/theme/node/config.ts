import { defineConfigWithTheme, SiteConfig } from "vitepress";

import { ThemeConfig, WikiConfig } from "../types";

import { head, transformHead, transformPageData } from "./page";
import { markdownConfig as markdown } from "./markdown";
import { copyExampleArchives } from "./examples";
import { getDynamicPagePaths, sitemapUrlToPagePath } from "./pages";
import { generatePlaintextPages } from "./plaintext";
import { generateDiscoveryFiles } from "./discovery";

const isFastBuild = process.env.FAST_BUILD === "true";

export function defineWikiConfig(config: WikiConfig) {
  const { title, description, fastBuild, ...themeConfig } = config;

  const srcExclude = ["public/*"];

  if (fastBuild && isFastBuild) {
    console.log(
      "[FAST_BUILD] Excluding the following large pages from this build:",
      fastBuild.excludedPages,
      "\n"
    );

    srcExclude.push(...fastBuild.excludedPages.map((path) => path.substring(1) + ".md"));
  }

  themeConfig.algolia.placeholder ??= `Search ${title}…`;

  return defineConfigWithTheme<ThemeConfig>({
    title,
    description,
    themeConfig,
    markdown,

    head,
    transformHead,
    transformPageData,

    srcExclude,
    ignoreDeadLinks: isFastBuild ? fastBuild.excludedPages : undefined,

    cleanUrls: true,
    sitemap: {
      hostname: config.url,
      transformItems(items) {
        // `globalThis.VITEPRESS_CONFIG` is only populated once the config has been
        // resolved, which is after this file is evaluated, so it is read lazily.
        const siteConfig: SiteConfig<ThemeConfig> = globalThis.VITEPRESS_CONFIG;
        const dynamic = getDynamicPagePaths(siteConfig);

        return items.filter((item) => !dynamic.has(sitemapUrlToPagePath(item.url)));
      },
    },

    async buildEnd(siteConfig) {
      await copyExampleArchives(siteConfig.outDir);

      generatePlaintextPages(siteConfig);
      generateDiscoveryFiles(siteConfig);
    },

    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            api: "modern",
          },
        },
      },
    },
  });
}

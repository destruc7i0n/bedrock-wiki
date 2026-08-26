import { HeadConfig, TransformContext } from "vitepress";

export function transformHead({ pageData, siteConfig }: TransformContext) {
  const config = siteConfig.site;
  const site = config.title;

  const { frontmatter, params, relativePath } = pageData;

  const title = frontmatter.title ?? config.themeConfig.longTitle ?? config.title;
  const description = frontmatter.description ?? config.description;

  const image = `${config.themeConfig.url}/assets/images/icons/logo.png`;

  const path = relativePath.replace(".md", "");

  let url = config.themeConfig.url;
  if (path !== "index") url += `/${path}`;

  // Open Graph (used by Discord) is keyed by `property`, not `name`.
  const properties: Record<string, string> = {
    "og:type": "website",
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "og:url": url,
    "og:site_name": site,
  };

  const names: Record<string, string> = {
    "twitter:card": "summary",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:site": site,
  };

  if (params?.file) names.robots = "noindex";

  const out: HeadConfig[] = [];

  Object.entries(properties).forEach(([property, content]) => {
    out.push(["meta", { property, content }]);
  });

  Object.entries(names).forEach(([name, content]) => {
    out.push(["meta", { name, content }]);
  });

  // Example file pages are `noindex`, so they get no canonical URL of their own.
  if (!params?.file) out.push(["link", { rel: "canonical", href: url }]);

  return out;
}

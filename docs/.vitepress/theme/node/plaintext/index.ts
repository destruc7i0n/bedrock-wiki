import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { SiteConfig } from "vitepress";
import { dirname, join } from "path";
import { dump } from "js-yaml";
import matter from "gray-matter";

import {
  examplesCacheDirectory,
  getExampleFromRoot,
  getExampleRootForPage,
  renderExampleFile,
} from "../examples";
import assetPath from "../../shared/assetPath";
import filePageLink from "../../shared/filePageLink";
import { ThemeConfig } from "../../types";
import { getStaticPages } from "../pages";

// Frontmatter that only affects the layout, plus the contributor list.
const layoutFields = [
  "mentions",
  "nav_order",
  "hidden",
  "show_outline",
  "show_contributors",
  "outline_depth",
  "show_edit_link",
  "example",
  "__tables",
];

// `<WikiImage :src="{ dark, light }">` is left alone; only plain sources resolve.
const imagePattern = /(!\[[^\]]*\]\(|<WikiImage\b[^>]*?\ssrc=")([^)"\s]+)/g;

const tagPattern = (name: string) => new RegExp(`<${name}\\s[^>]*?/>`, "g");
const propPattern = (name: string) => new RegExp(`\\b${name}="([^"]*)"`);

/**
 * Writes each page as Markdown beside its HTML, so that `/blocks/blocks-intro` is
 * also served at `/blocks/blocks-intro.md`.
 *
 * The pages are already Markdown, so this is close to a copy. Only `<Table>` and
 * `<ExampleFile>` need handling, as their contents are the one thing that does not
 * live in the page itself.
 */
export function generatePlaintextPages(config: SiteConfig<ThemeConfig>) {
  const pages = getStaticPages(config);

  for (const relativePath of pages) {
    const path = join(config.outDir, relativePath);

    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, renderPage(config.srcDir, relativePath));
  }

  config.logger.info(`generated ${pages.length} markdown pages`);
}

function renderPage(srcDir: string, relativePath: string) {
  // Normalised because `\r` terminates a line in a JavaScript regular expression.
  const source = readFileSync(join(srcDir, relativePath), "utf-8").replace(/\r\n/g, "\n");

  const { data, content } = matter(source);

  for (const field of layoutFields) delete data[field];

  const body = content
    .replace(tagPattern("Table"), (tag) => linkTable(relativePath, tag))
    .replace(tagPattern("ExampleFile"), (tag) => renderExample(relativePath, tag))
    // Relative paths would resolve against the site root once the page is served.
    .replace(
      imagePattern,
      (_match, prefix, src) => prefix + assetPath("images", relativePath, src)
    );

  return `---\n${dump(data)}---\n\n${body.trim()}\n`;
}

/** Links the JSON behind a `<Table data="…" />`, which agents can read directly. */
function linkTable(relativePath: string, tag: string) {
  const data = tag.match(propPattern("data"))?.[1];
  if (!data) return tag;

  return `[Table data (JSON)](${assetPath("tables", relativePath, data)})`;
}

/** Inlines an `<ExampleFile path="…" />`, which is stored in the examples submodule. */
function renderExample(relativePath: string, tag: string) {
  const path = tag.match(propPattern("path"))?.[1];
  if (!path) return tag;

  const rootPath = getExampleRootForPage(relativePath);
  const example = getExampleFromRoot(rootPath);

  if (!example.files.includes(path)) {
    throw new Error(`Example file "${path}" does not exist.`);
  }

  const buffer = readFileSync(join(examplesCacheDirectory, example.id, path));
  const link = filePageLink(rootPath, path);

  const markdown = renderExampleFile(path, buffer, link, tag.match(propPattern("snippet"))?.[1]);

  // Images are inlined as base64 for the browser, which is far too large here.
  return markdown.replace(/src="data:[^"]*"/, `src="${link}"`);
}

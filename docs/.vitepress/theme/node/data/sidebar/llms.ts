import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import matter from "gray-matter";

import { Sidebar, SidebarLink } from "../../../types";
import config from "../config";

const templatePath = resolve(config.srcDir, "llms.txt");
const templateContentMarker = "<!-- @content -->";

const outputPath = resolve(config.srcDir, "public/llms.txt");

export default function generateLlmsFile(sidebar: Sidebar) {
  if (!existsSync(templatePath)) return; // llms.txt file will not be created if not template is provided

  const lines: string[] = [];

  // Top-level pages
  if (sidebar.links.length > 0) {
    lines.push("## General");
    lines.push("");

    for (const page of sidebar.links) lines.push(formatLink(page));

    lines.push("");
  }

  // Sections
  for (const section of sidebar.sections) {
    lines.push(`## ${section.title}`);
    lines.push("");

    // Pages without a category
    for (const page of section.links) lines.push(formatLink(page));

    lines.push("");

    // Categorized pages
    for (const category of section.categories) {
      if (category.links.length === 0) continue;

      lines.push(`### ${category.title}`);
      lines.push("");

      for (const page of category.links) lines.push(formatLink(page));

      lines.push("");
    }

    lines.push("");
  }

  const template = readFileSync(templatePath, { encoding: "utf-8" });
  const content = template
    .replace(templateContentMarker, lines.join("\n").replace(/\n{3,}/g, "\n\n"))
    .trimEnd();

  writeFileSync(outputPath, content);
}

// Read from the page rather than the sidebar, which is sent to the browser and
// does not need to carry a description for every page.
function formatLink({ title, link }: SidebarLink) {
  const path = join(config.srcDir, `${link.slice(1)}.md`);
  if (!existsSync(path)) return `- [${title}](${link})`;

  const { description } = matter(readFileSync(path, "utf-8")).data;
  if (!description) return `- [${title}](${link})`;

  return `- [${title}](${link}): ${description.replace(/\s+/g, " ").trim()}`;
}

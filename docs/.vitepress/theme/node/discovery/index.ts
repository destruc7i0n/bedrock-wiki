import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { SiteConfig } from "vitepress";
import { createHash } from "crypto";
import { dirname, join } from "path";
import matter from "gray-matter";

import { ThemeConfig } from "../../types";

const skillPath = ".well-known/agent-skills/bedrock-wiki/SKILL.md";

/**
 * Publishes the well-known documents agents use to discover what the site offers.
 * The wiki is documentation, so the only thing to describe is the documentation
 * itself, which `docs/.vitepress/skill.md` does and is served verbatim.
 */
export function generateDiscoveryFiles(config: SiteConfig<ThemeConfig>) {
  const sourcePath = join(dirname(config.configPath!), "skill.md");
  if (!existsSync(sourcePath)) return;

  const skill = readFileSync(sourcePath, "utf-8");

  const { name, description } = matter(skill).data;
  const { title, themeConfig } = config.site;

  const host = new URL(themeConfig.url).host;
  const skillUrl = `${themeConfig.url}/${skillPath}`;

  write(config.outDir, skillPath, skill);

  write(config.outDir, ".well-known/agent-skills/index.json", {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name,
        type: "skill-md",
        description,
        url: skillUrl,
        digest: `sha256:${createHash("sha256").update(skill).digest("hex")}`,
      },
    ],
  });

  write(config.outDir, ".well-known/ai-catalog.json", {
    specVersion: "1.0",
    host: { displayName: title, identifier: `did:web:${host}` },
    entries: [
      {
        identifier: `urn:air:${host}:skill:${name}`,
        displayName: title,
        type: "text/markdown",
        url: skillUrl,
        description,
        representativeQueries: [
          "how do I make a custom block in Minecraft Bedrock",
          "what Molang queries are available",
          "how do I use the Minecraft Bedrock Script API",
        ],
      },
    ],
  });

  config.logger.info("generated agent discovery documents");
}

function write(outDir: string, path: string, content: string | object) {
  const target = join(outDir, path);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof content === "string" ? content : JSON.stringify(content, null, 2));
}

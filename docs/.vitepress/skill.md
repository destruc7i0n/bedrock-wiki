---
name: bedrock-wiki
description: Look up Minecraft Bedrock add-on documentation — blocks, entities, items, Molang, JSON UI, the Script API, commands and more — on the Bedrock Wiki, and fetch any page as plain Markdown.
---

# Bedrock Wiki

The [Bedrock Wiki](https://wiki.bedrock.dev) documents the technical features of
Minecraft Bedrock: add-on structure, blocks, entities, items, Molang, JSON UI, the
Script API, commands, loot tables, particles, world generation and more.

## Finding a page

`https://wiki.bedrock.dev/llms.txt` lists every page on the wiki, grouped by
section. Fetch it first to find the page you need.

## Reading a page

Every page is served as plain Markdown as well as HTML. Either append `.md` to the
page URL, or send `Accept: text/markdown`:

```
https://wiki.bedrock.dev/blocks/blocks-intro.md
```

Prefer the Markdown version. It resolves everything the rendered page shows,
including table data, file trees and example pack files, so it is more complete
than the source in the repository.

## Notes

- Content is community-written and covers a wide range of Minecraft versions.
  Pages state the `format_version` they apply to; check it against the version you
  are targeting.
- Code samples are labelled with the file they belong to, in bold immediately
  above the sample, e.g. **`BP/blocks/custom_slab.json`**.
- The wiki is documentation only. It has no API, no accounts and nothing to buy.

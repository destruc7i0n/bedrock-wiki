---
name: bedrock-wiki
description: Look up Minecraft Bedrock add-on documentation on the Bedrock Wiki, covering blocks, entities, items, Molang, JSON UI, the Script API and commands, and fetch any page as Markdown.
---

# Bedrock Wiki

The [Bedrock Wiki](https://wiki.bedrock.dev) documents the technical features of
Minecraft Bedrock: add-on structure, blocks, entities, items, Molang, JSON UI, the
Script API, commands, loot tables, particles, world generation and more.

## Finding a page

`https://wiki.bedrock.dev/llms.txt` lists every page on the wiki, grouped by
section. Fetch it first to find the page you need.

## Reading a page

Every page is served as Markdown as well as HTML. Either append `.md` to the page
URL, or send `Accept: text/markdown`:

```
https://wiki.bedrock.dev/blocks/blocks-intro.md
```

The Markdown is the page as written, so a few things in it come from the wiki's
own theme rather than from standard Markdown:

-   `<CodeHeader path="BP/blocks/custom_slab.json" />` names the file that the
    code sample below it belongs to. A `breadcrumbs` prop, when present, gives the
    path within that file.
-   `<Table data="…" />` is replaced by a link to the JSON holding that table's
    rows. Fetch it if you need the data.
-   `<FolderView :paths="[…]" />` lists the files of an example pack.
-   `:::tip`, `:::warning` and `:::danger` mark asides, ending at a matching `:::`.

## Notes

Content is community-written and covers a wide range of Minecraft versions. Pages
state the `format_version` they apply to, so check it against the version you are
targeting.

The wiki is documentation only. It has no API, no accounts and nothing to buy.

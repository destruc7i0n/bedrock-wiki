import { HeadConfig } from "vitepress";

export const head: HeadConfig[] = [
  [
    "link",
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      href: "/assets/images/favicons/apple-touch-icon.png",
      sizes: "180x180",
    },
  ],
  [
    "link",
    {
      rel: "mask-icon",
      href: "/assets/images/favicons/safari-pinned-tab.svg",
      color: "#60c3fa",
    },
  ],
  [
    "meta",
    {
      name: "theme-color",
      content: "#60c3fa",
    },
  ],
  // Secondary discovery mechanism for the capability manifest; robots.txt
  // advertises the same document with an `Agentmap` directive.
  [
    "link",
    {
      rel: "ai-catalog",
      href: "/.well-known/ai-catalog.json",
    },
  ],
];

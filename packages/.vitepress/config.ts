import { defineConfig } from "vitepress";
import { categoryNames, metadata } from "../../packages/metadata/metadata";

const Guide = [
  {
    text: "Get Started",
    link: "/guide/",
  },
  {
    text: "Best Practice",
    link: "/guide/best-practice",
  },
];
const DefaultSideBar = [{ text: "Guide", items: Guide }];

function getFunctionsSidebar() {
  const links = [];

  for (const name of categoryNames) {
    if (name.startsWith("_")) continue;

    const functions = metadata.functions.filter(
      (i) => i.category === name && !i.internal
    );

    links.push({
      text: name,
      items: functions.map((i) => ({
        text: i.name,
        link: i.external || `/${i.package}/src/${i.name}/`,
      })),
      links: name.startsWith("@")
        ? functions[0].external || `${functions[0].package}/README`
        : undefined,
    });
  }

  return links;
}

const FunctionsSidebar = getFunctionsSidebar();

export default defineConfig({
  title: "WUse",
  head: [["meta", { name: "theme-color", content: "#ffffff" }]],
  markdown: {
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  },
  themeConfig: {
    logo: "/icon.svg",
    nav: [
      {
        text: "Guide",
        items: Guide,
      },
      {
        text: "Functions",
        items: [{ text: "All Functions", link: "/functions#" }],
      },
    ],
    sidebar: {
      "/guide/": DefaultSideBar,
      "/functions/": FunctionsSidebar,
    },
  },
});

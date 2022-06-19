import { defineConfig } from "vitepress";

const Guide = [
  {
    text: 'Get Started',
    link: '/guide/'
  }
]

export default defineConfig({
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        items: Guide
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: Guide
        }
      ]
    }
  }
})

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TRender",
  description: "TRender's docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '源码解析', link: '/source-code/scale' }
    ],

    sidebar: [
      {
        text: '源码解析',
        items: [
          { text: 'Scale 比例尺', link: '/source-code/scale' },
          { text: 'Geometry 几何图形', link: '/source-code/geometry' },
          { text: 'Guide 辅助组件', link: '/source-code/guide' },
          { text: 'Statistic 统计函数', link: '/source-code/statistic' },
          { text: 'Plot 渲染流程', link: '/source-code/plot' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taiiiyang/TRender' }
    ]
  }
})

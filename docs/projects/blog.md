# 个人博客项目

这是一个基于 VuePress 搭建的个人技术博客。

## 技术栈

- VuePress v1.x
- Vue.js 2.x
- Stylus (CSS 预处理器)
- GitHub Pages (部署)

## 项目结构

```
my-vuepress-blog/
├── docs/
│   ├── .vuepress/
│   │   ├── config.js
│   │   ├── components/
│   │   └── styles/
│   ├── notes/
│   ├── projects/
│   └── about/
└── package.json
```

## 功能特性

- ✅ 响应式导航栏
- ✅ 多级侧边栏
- ✅ 自定义主题颜色
- ✅ 交互式 Vue 组件
- ✅ 代码高亮

## 部署方式

```bash
npm run build
# 将 dist 目录部署到 GitHub Pages
```
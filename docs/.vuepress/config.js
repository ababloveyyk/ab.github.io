module.exports = {
  title: '安柏安柏',
  description: '苦厄难磨凌云志，不死终有出头日',
  base: '/ab.github.io/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.png' }]
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '技术笔记', link: '/notes/' },
      { text: '项目实践', link: '/projects/' },
      { text: '关于我', link: '/about/' },
      { text: 'Admin', link: '/admin/' },
      { text: 'GitHub', link: 'https://github.com', target: '_blank' }
    ],
    sidebar: {
      '/notes/': [
        {
          title: '前端技术',
          collapsable: true,
          children: [
            ['/notes/vue.md', 'Vue.js 入门'],
            ['/notes/react.md', 'React 基础'],
            ['/notes/typescript.md', 'TypeScript 学习']
          ]
        },
        {
          title: '后端技术',
          collapsable: true,
          children: [
            ['/notes/nodejs.md', 'Node.js 实战'],
            ['/notes/mysql.md', 'MySQL 数据库']
          ]
        }
      ],
      '/projects/': [
        {
          title: '项目列表',
          children: [
            ['/projects/blog.md', '个人博客'],
            ['/projects/todo.md', '待办事项应用']
          ]
        }
      ],
      '/about/': [
        {
          title: '关于',
          children: [
            ['/about/', '个人简介']
          ]
        }
      ]
    },
    logo: '/favicon.png',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: '更新时间',
    authorAvatar: '/images/avatar.png'
  }
}
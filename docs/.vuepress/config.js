const fs = require('fs')
const path = require('path')

// 解析 Markdown 文件的 frontmatter
function parseFrontmatter(content) {
  const result = {}
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fmMatch) return result

  const lines = fmMatch[1].split('\n')
  let currentKey = null

  lines.forEach(line => {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      if (kvMatch[2]) {
        result[currentKey] = kvMatch[2].trim()
      } else {
        result[currentKey] = []
      }
    } else if (currentKey && line.match(/^\s+-\s+(.+)/)) {
      const itemMatch = line.match(/^\s+-\s+(.+)/)
      if (Array.isArray(result[currentKey])) {
        result[currentKey].push(itemMatch[1].trim())
      }
    }
  })

  return result
}

// 自动扫描目录，按 categories 分组生成侧边栏
function generateSidebar(dirName, basePath) {
  const dir = path.resolve(__dirname, '..', dirName)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter(f =>
    f.endsWith('.md') && f.toLowerCase() !== 'readme.md'
  )

  const categoryMap = {}

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const fm = parseFrontmatter(content)

    const title = fm.title || file.replace('.md', '')
    const categories = Array.isArray(fm.categories) && fm.categories.length > 0
      ? fm.categories
      : ['未分类']

    categories.forEach(cat => {
      if (!categoryMap[cat]) categoryMap[cat] = []
      categoryMap[cat].push([`${basePath}${file}`, title])
    })
  })

  return Object.keys(categoryMap).map(cat => ({
    title: cat,
    collapsable: true,
    children: categoryMap[cat]
  }))
}

module.exports = {
  title: '安柏',
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
      { text: '归档', link: '/archive/' },
      { text: '关于我', link: '/about/' },
      { text: 'Admin', link: '/admin/' },
      { text: 'GitHub', link: 'https://github.com', target: '_blank' }
    ],
    sidebar: {
      '/notes/': generateSidebar('notes', '/notes/'),
      '/projects/': generateSidebar('projects', '/projects/'),
      '/archive/': [
        {
          title: '归档',
          children: [
            ['/archive/', '文章归档']
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

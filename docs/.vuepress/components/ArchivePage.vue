<template>
  <div class="archive-container">
    <h1>文章归档</h1>

    <div class="archive-section">
      <h2>{{ currentYear }}年</h2>
      <div v-for="(monthData, month) in sortedMonths" :key="month" class="month-group">
        <div class="month-header" @click="toggleMonth(month)">
          <span class="toggle-icon" :class="{ collapsed: !expandedMonths[month] }">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="month-title">{{ month }}月</span>
          <span class="month-count">{{ monthData.length }} 篇</span>
        </div>
        <transition name="expand">
          <ul v-show="expandedMonths[month]" class="article-list">
            <li v-for="article in monthData" :key="article.path">
              <a :href="article.path">{{ article.title }}</a>
              <span class="article-date">{{ formatDate(article.date) }}</span>
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <div class="archive-section">
      <h2>按分类浏览</h2>
      <div v-for="(articles, category) in categoryGroups" :key="category" class="category-group">
        <div class="month-header" @click="toggleCategory(category)">
          <span class="toggle-icon" :class="{ collapsed: !expandedCategories[category] }">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="month-title">{{ category }}</span>
          <span class="month-count">{{ articles.length }} 篇</span>
        </div>
        <transition name="expand">
          <ul v-show="expandedCategories[category]" class="article-list">
            <li v-for="article in articles" :key="article.path">
              <a :href="article.path">{{ article.title }}</a>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArchivePage',
  data() {
    return {
      articles: [],
      currentYear: new Date().getFullYear(),
      expandedMonths: {},
      expandedCategories: {}
    }
  },
  computed: {
    sortedMonths() {
      const monthMap = {}
      this.articles.forEach(article => {
        const date = new Date(article.date)
        const year = date.getFullYear()
        if (year !== this.currentYear) return
        const month = date.getMonth() + 1
        if (!monthMap[month]) monthMap[month] = []
        monthMap[month].push(article)
      })
      const sorted = {}
      Object.keys(monthMap).sort((a, b) => b - a).forEach(key => {
        sorted[key] = monthMap[key]
      })
      return sorted
    },
    categoryGroups() {
      const groups = {}
      this.articles.forEach(article => {
        const cats = article.categories || ['未分类']
        cats.forEach(cat => {
          if (!groups[cat]) groups[cat] = []
          groups[cat].push(article)
        })
      })
      return groups
    }
  },
  mounted() {
    this.loadArticles()
  },
  methods: {
    loadArticles() {
      const pages = this.$site.pages || []
      this.articles = pages.filter(p => {
        return p.path &&
               p.frontmatter &&
               p.frontmatter.title &&
               p.frontmatter.date &&
               !p.path.endsWith('/') &&
               p.path.match(/\.(html)$/)
      }).map(p => ({
        title: p.frontmatter.title,
        date: p.frontmatter.date,
        path: p.path,
        categories: p.frontmatter.categories || []
      })).sort((a, b) => new Date(b.date) - new Date(a.date))

      // 默认展开所有月份和分类
      const months = {}
      Object.keys(this.sortedMonths).forEach(m => { months[m] = true })
      this.expandedMonths = months

      const cats = {}
      Object.keys(this.categoryGroups).forEach(c => { cats[c] = true })
      this.expandedCategories = cats
    },
    toggleMonth(month) {
      this.$set(this.expandedMonths, month, !this.expandedMonths[month])
    },
    toggleCategory(category) {
      this.$set(this.expandedCategories, category, !this.expandedCategories[category])
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  }
}
</script>

<style scoped>
.archive-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.archive-container h1 {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.archive-section {
  margin-bottom: 40px;
}

.archive-section h2 {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.month-group,
.category-group {
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.month-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.month-header:hover {
  background: #f3f4f6;
}

.toggle-icon {
  display: flex;
  align-items: center;
  color: #6366f1;
  transition: transform 0.3s ease;
  margin-right: 10px;
}

.toggle-icon.collapsed {
  transform: rotate(-90deg);
}

.month-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  flex: 1;
}

.month-count {
  font-size: 13px;
  color: #9ca3af;
  background: #e5e7eb;
  padding: 2px 10px;
  border-radius: 12px;
}

.article-list {
  list-style: none;
  padding: 8px 16px;
  margin: 0;
}

.article-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.article-list li:hover {
  background: #f3f4f6;
}

.article-list a {
  color: #374151;
  text-decoration: none;
  font-size: 15px;
}

.article-list a:hover {
  color: #6366f1;
}

.article-date {
  font-size: 13px;
  color: #9ca3af;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>

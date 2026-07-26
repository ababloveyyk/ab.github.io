<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="welcome-card">
        <h1>欢迎回来</h1>
        <p class="motto-text">
          <span v-for="(char, index) in motto" :key="index" class="motto-char" :style="{ animationDelay: index * 0.1 + 's' }">
            {{ char }}
          </span>
        </p>
      </div>
    </div>

    <div class="dashboard-section">
      <h2 class="section-title">数据概览</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-number">{{ stats.articles }}</span>
            <span class="stat-label">文章总数</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-number">{{ stats.categories }}</span>
            <span class="stat-label">文章分类</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-number">{{ stats.tags }}</span>
            <span class="stat-label">标签数量</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-number">{{ stats.views }}</span>
            <span class="stat-label">总访问量</span>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>文章趋势</h3>
          <div class="chart-wrapper">
            <svg class="line-chart" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3"/>
                  <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0"/>
                </linearGradient>
              </defs>
              <path :d="areaPath" fill="url(#lineGradient)"/>
              <path :d="linePath" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <circle v-for="(point, index) in chartPoints" :key="index" :cx="point.x" :cy="point.y" r="5" fill="#6366f1"/>
            </svg>
            <div class="chart-labels">
              <span v-for="(month, index) in months" :key="index">{{ month }}</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>分类分布</h3>
          <div class="chart-wrapper donut-wrapper">
            <svg class="donut-chart" viewBox="0 0 200 200">
              <circle v-for="(segment, index) in donutSegments" :key="index"
                cx="100" cy="100" r="70" fill="none"
                :stroke="segment.color" stroke-width="30"
                :stroke-dasharray="segment.dashArray"
                :stroke-dashoffset="segment.offset"
                :style="{ transform: 'rotate(-90deg)', transformOrigin: 'center' }"/>
              <text x="100" y="95" text-anchor="middle" class="donut-total">{{ stats.articles }}</text>
              <text x="100" y="115" text-anchor="middle" class="donut-label">文章</text>
            </svg>
            <div class="donut-legend">
              <div class="legend-item" v-for="(item, index) in categoryData" :key="index">
                <span class="legend-color" :style="{ background: item.color }"></span>
                <span class="legend-text">{{ item.name }} ({{ item.value }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="progress-section">
        <h3>年度目标进度</h3>
        <div class="progress-grid">
          <div class="progress-item">
            <div class="progress-header">
              <span>文章产出</span>
              <span>{{ progress.articles.current }} / {{ progress.articles.target }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress.articles.percent + '%' }"></div>
            </div>
          </div>
          <div class="progress-item">
            <div class="progress-header">
              <span>技术笔记</span>
              <span>{{ progress.notes.current }} / {{ progress.notes.target }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress.notes.percent + '%' }"></div>
            </div>
          </div>
          <div class="progress-item">
            <div class="progress-header">
              <span>项目实践</span>
              <span>{{ progress.projects.current }} / {{ progress.projects.target }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress.projects.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-links">
      <h2 class="section-title">快速导航</h2>
      <div class="links-grid">
        <a href="/notes/" class="link-card">
          <span class="link-text">技术笔记</span>
        </a>
        <a href="/projects/" class="link-card">
          <span class="link-text">项目实践</span>
        </a>
        <a href="/about/" class="link-card">
          <span class="link-text">关于我</span>
        </a>
        <a href="https://github.com" target="_blank" class="link-card">
          <span class="link-text">GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      motto: '苦厄难磨凌云志，不死终有出头日',
      stats: {
        articles: 0,
        categories: 0,
        tags: 0,
        views: 0
      },
      chartData: [0, 0, 0, 0, 0, 0, 0],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      categoryData: [],
      progress: {
        articles: { current: 0, target: 50, percent: 0 },
        notes: { current: 0, target: 30, percent: 0 },
        projects: { current: 0, target: 10, percent: 0 }
      },
      categoryColors: {
        '前端技术': '#6366f1',
        '后端技术': '#8b5cf6',
        'Web安全': '#a78bfa',
        'PWN': '#c4b5fd',
        '密码学': '#ddd6fe',
        'AWD': '#818cf8',
        '网络安全': '#6366f1',
        '漏洞挖掘': '#4f46e5',
        '项目实践': '#3b82f6'
      }
    }
  },
  mounted() {
    this.computeStats()
  },
  methods: {
    computeStats() {
      const pages = this.$site.pages || []
      // 过滤出有 frontmatter 的文章页（排除首页、README 索引页等）
      const articles = pages.filter(p => {
        return p.path &&
               p.frontmatter &&
               p.frontmatter.title &&
               p.frontmatter.date &&
               !p.path.endsWith('/') &&
               p.path.match(/\.(html)$/)
      })

      // 文章总数
      this.stats.articles = articles.length

      // 分类统计
      const categoryMap = {}
      const tagSet = new Set()
      let notesCount = 0
      let projectsCount = 0

      articles.forEach(article => {
        // 分类
        const cats = article.frontmatter.categories || []
        cats.forEach(cat => {
          if (!categoryMap[cat]) categoryMap[cat] = 0
          categoryMap[cat]++
        })

        // 标签
        const tags = article.frontmatter.tags || []
        tags.forEach(tag => tagSet.add(tag))

        // 路径分类
        if (article.path.includes('/notes/')) notesCount++
        if (article.path.includes('/projects/')) projectsCount++
      })

      this.stats.categories = Object.keys(categoryMap).length
      this.stats.tags = tagSet.size

      // 分类分布数据
      this.categoryData = Object.keys(categoryMap).map(name => ({
        name,
        value: categoryMap[name],
        color: this.categoryColors[name] || '#9ca3af'
      }))

      // 年度目标进度
      this.progress.articles.current = articles.length
      this.progress.articles.percent = Math.min(100, Math.round(articles.length / 50 * 100))
      this.progress.notes.current = notesCount
      this.progress.notes.percent = Math.min(100, Math.round(notesCount / 30 * 100))
      this.progress.projects.current = projectsCount
      this.progress.projects.percent = Math.min(100, Math.round(projectsCount / 10 * 100))

      // 文章趋势（按月统计，1-7月）
      const monthlyCount = [0, 0, 0, 0, 0, 0, 0]
      articles.forEach(article => {
        const dateStr = article.frontmatter.date
        if (dateStr) {
          const date = new Date(dateStr)
          const month = date.getMonth() // 0-11
          if (month >= 0 && month <= 6) {
            monthlyCount[month]++
          }
        }
      })
      this.chartData = monthlyCount
    }
  },
  computed: {
    chartPoints() {
      const points = []
      const data = this.chartData
      const maxValue = Math.max(...data, 1)
      const minValue = Math.min(...data)
      const range = maxValue - minValue || 1

      for (let i = 0; i < data.length; i++) {
        const x = 50 + (i * 50)
        const y = 170 - ((data[i] - minValue) / range * 120)
        points.push({ x, y })
      }
      return points
    },
    linePath() {
      const points = this.chartPoints
      return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    },
    areaPath() {
      const pts = this.chartPoints
      return this.linePath + ` L ${pts[pts.length - 1]?.x || 400} 180 L 50 180 Z`
    },
    donutSegments() {
      const total = this.categoryData.reduce((sum, item) => sum + item.value, 0)
      const circumference = 2 * Math.PI * 70
      let offset = 0
      
      return this.categoryData.map(item => {
        const percent = item.value / total
        const dashArray = `${percent * circumference} ${circumference}`
        const segment = {
          color: item.color,
          dashArray,
          offset: -offset
        }
        offset += percent * circumference
        return segment
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.welcome-section {
  margin-bottom: 48px;
}

.welcome-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
}

.welcome-card h1 {
  font-size: 32px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.welcome-card p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.motto-text {
  font-size: 36px;
  font-weight: 600;
  color: #6366f1;
  letter-spacing: 6px;
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
  text-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

.motto-char {
  opacity: 0;
  animation: mottoFadeIn 0.6s ease-out forwards;
}

@keyframes mottoFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.dashboard-section,
.quick-links {
  margin-bottom: 48px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.chart-wrapper {
  position: relative;
}

.line-chart {
  width: 100%;
  height: auto;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 8px;
}

.chart-labels span {
  font-size: 12px;
  color: #9ca3af;
}

.donut-wrapper {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-chart {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.donut-total {
  font-size: 28px;
  font-weight: 700;
  fill: #111827;
}

.donut-label {
  font-size: 14px;
  fill: #6b7280;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-text {
  font-size: 14px;
  color: #374151;
}

.progress-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.progress-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.progress-grid {
  display: grid;
  gap: 16px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #374151;
}

.progress-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.link-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.link-card:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.link-icon {
  font-size: 28px;
}

.link-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

@media (max-width: 768px) {
  .home-container {
    padding: 24px 16px;
  }
  
  .welcome-card {
    padding: 32px 20px;
  }
  
  .welcome-card h1 {
    font-size: 24px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .donut-wrapper {
    flex-direction: column;
  }
}
</style>
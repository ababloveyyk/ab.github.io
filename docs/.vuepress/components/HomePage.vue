<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="welcome-card">
        <h1>欢迎回来</h1>
        <p>苦厄难磨凌云志，不死终有出头日</p>
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
      stats: {
        articles: 12,
        categories: 5,
        tags: 28,
        views: 1542
      },
      chartData: [8, 12, 6, 15, 10, 18],
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
      categoryData: [
        { name: '前端', value: 5, color: '#6366f1' },
        { name: '后端', value: 4, color: '#8b5cf6' },
        { name: '数据库', value: 3, color: '#a78bfa' }
      ],
      progress: {
        articles: { current: 12, target: 24, percent: 50 },
        notes: { current: 8, target: 12, percent: 67 },
        projects: { current: 3, target: 6, percent: 50 }
      }
    }
  },
  computed: {
    chartPoints() {
      const points = []
      const data = this.chartData
      const maxValue = Math.max(...data)
      const minValue = Math.min(...data)
      const range = maxValue - minValue || 1
      
      for (let i = 0; i < data.length; i++) {
        const x = 50 + (i * 60)
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
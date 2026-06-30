<template>
  <div class="info-card">
    <div class="avatar" v-if="avatarUrl && name">
      <img :src="avatarUrl" alt="头像" />
    </div>
    <h3 v-if="name">{{ name }}</h3>
    <p class="title">{{ title }}</p>
    <p class="description">{{ description }}</p>
    <div class="social-links">
      <a v-for="link in socialLinks" :key="link.name" :href="link.url" :target="link.target || '_blank'" class="social-link">
        <span>{{ link.icon }}</span>
        <span>{{ link.name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    name: {
      type: String,
      default: '开发者'
    },
    title: {
      type: String,
      default: '全栈工程师'
    },
    description: {
      type: String,
      default: '热爱技术，乐于分享'
    },
    avatarUrl: {
      type: String,
      default: '/images/avatar.png'
    },
    socialLinks: {
      type: Array,
      default: () => [
        { name: 'GitHub', icon: 'GitHub', url: 'https://github.com' },
        { name: '博客', icon: 'Blog', url: '#' }
      ]
    }
  }
}
</script>

<style scoped>
.info-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
  text-align: center;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #6366f1;
  margin-bottom: 16px;
}

h3 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.title {
  font-size: 14px;
  color: #6366f1;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f3f4f6;
  color: #4b5563;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #6366f1;
  color: #ffffff;
  transform: translateY(-2px);
}
</style>
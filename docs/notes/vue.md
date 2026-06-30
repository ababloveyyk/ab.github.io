# Vue.js 入门

Vue.js 是一套构建用户界面的渐进式框架。与其他重量级框架不同的是，Vue 采用自底向上增量开发的设计。

## 核心特性

- **响应式数据绑定**：数据和视图保持同步
- **组件化开发**：将页面拆分为独立的组件
- **虚拟 DOM**：高效的 DOM 更新
- **指令系统**：简洁的模板语法

## 基础示例

```javascript
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

```html
<div id="app">
  {{ message }}
</div>
```

## 图片演示

在 VuePress 中使用图片非常简单，只需将图片放在 `docs/.vuepress/public/images/` 目录下，然后在 Markdown 中引用：

![Vue.js Logo](/images/vue-logo.svg)

### 图片语法

```markdown
![图片描述](/images/filename.jpg)
```

支持的格式：jpg、png、gif、svg 等。

## 自定义组件演示

<Counter />
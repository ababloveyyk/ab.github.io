# 技术文档写作指南

欢迎来到博客后台管理指南！这里将教你如何撰写技术文章、插入图片、添加代码块等操作。

---

## 一、文章写在哪里

### 文章目录结构

```
docs/
├── notes/          # 技术笔记
│   ├── README.md   # 笔记首页
│   ├── vue.md      # Vue 文章
│   ├── nodejs.md   # Node.js 文章
│   └── ...
├── projects/       # 项目展示
│   ├── README.md   # 项目首页
│   ├── blog.md     # 博客项目
│   └── ...
└── about/          # 关于我
    └── README.md
```

### 创建新文章

在对应的目录下新建 `.md` 文件即可，例如：
- 在 `docs/notes/` 下创建 `python.md`
- 在 `docs/projects/` 下创建 `game.md`

---

## 二、基本 Markdown 语法

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

### 列表

**无序列表：**
```markdown
- 第一项
- 第二项
- 第三项
```

**有序列表：**
```markdown
1. 第一步
2. 第二步
3. 第三步
```

### 粗体和斜体

```markdown
**粗体文本**
*斜体文本*
```

### 引用

```markdown
> 这是一段引用文字
> 
> 引用的第二行
```

### 分割线

```markdown
---
```

---

## 三、插入代码

### 行内代码

```markdown
使用 `console.log()` 打印日志
```

### 代码块

**基本代码块：**
```markdown
```
function hello() {
  console.log('Hello World');
}
```
```

**带语法高亮：**
```markdown
```javascript
function hello() {
  console.log('Hello World');
}
```
```

**支持的语言：**
- `javascript` / `js`
- `python` / `py`
- `java`
- `cpp` / `c++`
- `html`
- `css`
- `vue`
- `sql`
- `bash`
- `json`
- `yaml`

**示例：**

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

```sql
SELECT * FROM users 
WHERE status = 'active' 
ORDER BY created_at DESC
LIMIT 10;
```

---

## 四、插入图片

### 上传图片

将图片复制到以下目录：
```
docs/.vuepress/public/images/
```

### 引用图片

```markdown
![图片描述](/images/文件名.png)
```

**示例：**
```markdown
![Vue Logo](/images/vue-logo.svg)
```

### 图片尺寸控制

```markdown
<img src="/images/avatar.png" width="200" height="200" alt="头像">
```

### 图片居中

```markdown
<div align="center">
  <img src="/images/logo.svg" width="300" alt="Logo">
</div>
```

---

## 五、添加标签和分类

### 文章头部配置

在文章开头添加 YAML 配置块：

```markdown
---
title: Vue3 入门教程
date: 2024-01-15
tags:
  - Vue
  - 前端
  - JavaScript
categories:
  - 技术笔记
---

# Vue3 入门教程

文章内容...
```

### 标签和分类说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | Vue3 入门教程 |
| `date` | 创建日期 | 2024-01-15 |
| `tags` | 标签列表 | [Vue, 前端] |
| `categories` | 分类列表 | [技术笔记] |

---

## 六、添加链接

### 外部链接

```markdown
[GitHub](https://github.com)
[Google](https://google.com){target="_blank"}
```

### 内部链接

```markdown
[关于我](/about/)
[Vue 笔记](/notes/vue/)
```

### 锚点链接

```markdown
[跳转到代码部分](#三插入代码)
```

---

## 七、表格

```markdown
| 功能 | 说明 | 示例 |
|------|------|------|
| 标题 | 文章标题 | # 标题 |
| 代码 | 代码块 | ```js |
| 图片 | 图片引用 | ![描述](/images/) |
```

---

## 八、文章发布流程

1. **创建文件**：在 `docs/notes/` 或 `docs/projects/` 下新建 `.md` 文件
2. **编写内容**：使用 Markdown 语法编写文章
3. **添加图片**：将图片放入 `docs/.vuepress/public/images/` 目录
4. **配置头部**：添加 title、date、tags、categories
5. **本地预览**：运行 `npm run dev` 查看效果
6. **构建部署**：运行 `npm run build` 和 `npm run deploy`

---

## 九、侧边栏配置

如果需要在侧边栏显示新文章，需要修改配置文件：

```
docs/.vuepress/config.js
```

在 `themeConfig.sidebar` 中添加新的文章路径。

---

## 十、示例文章

```markdown
---
title: Python 爬虫入门
date: 2024-06-30
tags:
  - Python
  - 爬虫
categories:
  - 技术笔记
---

# Python 爬虫入门

## 环境准备

首先安装必要的依赖：

```bash
pip install requests beautifulsoup4
```

## 基本示例

```python
import requests
from bs4 import BeautifulSoup

url = 'https://example.com'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

print(soup.title.string)
```

## 运行结果

```
Example Domain
```

## 注意事项

- 遵守网站 `robots.txt` 规则
- 设置合理的请求间隔
- 不要爬取敏感信息

---

> **提示**：写作完成后，记得保存并刷新浏览器查看效果！

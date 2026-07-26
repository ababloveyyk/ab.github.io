---
title: Python核心生态与落地Ⅳ——爬虫实战
date: 2026-07-26
tags:
  - Python
  - 爬虫
  - Requests
  - BeautifulSoup
  - 数据采集
categories:
  - Python
---

## 一、HTTP协议基础

### 1.1 HTTP协议概述

HTTP（HyperText Transfer Protocol，超文本传输协议）是互联网上应用最广泛的一种网络协议，用于从Web服务器传输超文本到本地浏览器。理解HTTP协议是进行网络爬虫开发的基础。

HTTP协议的核心概念包括：

**请求（Request）**：客户端向服务器发送的请求，包含请求方法、URL、请求头和请求体。

**响应（Response）**：服务器返回给客户端的数据，包含状态码、响应头和响应体。

**无状态协议**：HTTP是无状态的，每个请求都是独立的，服务器不会记住之前的请求。Cookie和Session机制用于解决这个问题。

```python
# 示例：HTTP协议基础
import json

print("=" * 60)
print("HTTP协议基础")
print("=" * 60)

# HTTP请求方法
http_methods = {
    "GET": "获取资源，数据在URL中",
    "POST": "创建资源，数据在请求体中",
    "PUT": "更新资源（完整替换）",
    "PATCH": "更新资源（部分修改）",
    "DELETE": "删除资源",
    "HEAD": "获取响应头（不返回响应体）",
    "OPTIONS": "查询服务器支持的请求方法"
}

print("HTTP请求方法:")
for method, desc in http_methods.items():
    print(f"  {method:8s}: {desc}")

# HTTP状态码
http_status = {
    "1xx": "信息响应",
    "2xx": "成功 (200 OK, 201 Created)",
    "3xx": "重定向 (301, 302, 304)",
    "4xx": "客户端错误 (400, 401, 403, 404)",
    "5xx": "服务器错误 (500, 502, 503)"
}

print("\nHTTP状态码分类:")
for code, desc in http_status.items():
    print(f"  {code}: {desc}")

# 常见请求头
common_headers = {
    "User-Agent": "浏览器标识",
    "Accept": "可接受的响应内容类型",
    "Content-Type": "请求体的内容类型",
    "Cookie": "发送给服务器的Cookie",
    "Authorization": "认证信息",
    "Referer": "来源页面URL",
    "Accept-Encoding": "可接受的编码方式",
    "Accept-Language": "可接受的语言"
}

print("\n常见HTTP请求头:")
for header, desc in common_headers.items():
    print(f"  {header:20s}: {desc}")

# URL结构
print("\nURL结构:")
print("""
  https://www.example.com:8080/path/to/page?key=value&name=test#section
  └─┬──┘ └──────┬──────┘ └─┬─┘└─────┬──────┘└────────┬────────┘└──┬──┘
  协议      主机名/域名    端口    路径          查询参数        锚点
""")
```

### 1.2 Python中的HTTP请求

Python标准库中的`urllib`模块提供了基本的HTTP功能，但`requests`库提供了更简洁的API。

```python
# 示例：使用urllib和requests发送HTTP请求
import urllib.request
import urllib.parse
import json

print("=" * 60)
print("Python中的HTTP请求")
print("=" * 60)

# 使用urllib发送GET请求
print("1. urllib GET请求:")
try:
    url = "https://httpbin.org/get?name=python&version=3"
    with urllib.request.urlopen(url, timeout=10) as response:
        print(f"  状态码: {response.status}")
        print(f"  响应头: {dict(response.headers)}")
        data = json.loads(response.read().decode())
        print(f"  参数: {data.get('args', {})}")
except Exception as e:
    print(f"  请求失败: {e}")

# 使用urllib发送POST请求
print("\n2. urllib POST请求:")
try:
    url = "https://httpbin.org/post"
    post_data = urllib.parse.urlencode({'name': '张三', 'age': '25'}).encode()
    req = urllib.request.Request(url, data=post_data, method='POST')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    with urllib.request.urlopen(req, timeout=10) as response:
        print(f"  状态码: {response.status}")
        data = json.loads(response.read().decode())
        print(f"  表单数据: {data.get('form', {})}")
except Exception as e:
    print(f"  请求失败: {e}")
```

## 二、Requests库详解

### 2.1 Requests库的基本使用

`requests`库是Python中最流行的HTTP客户端库，它提供了简洁优雅的API，使得发送HTTP请求变得非常简单。

```python
# 示例：Requests库的基本使用
import requests
import json

print("=" * 60)
print("Requests库的基本使用")
print("=" * 60)

# 创建Session对象
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
})

# 1. GET请求
print("1. GET请求:")
try:
    response = session.get(
        'https://httpbin.org/get',
        params={'name': 'python', 'version': '3.11'},
        timeout=10
    )
    print(f"  状态码: {response.status_code}")
    print(f"  编码: {response.encoding}")
    print(f"  URL: {response.url}")
    print(f"  响应内容类型: {response.headers.get('Content-Type')}")
    data = response.json()
    print(f"  参数: {data.get('args', {})}")
except requests.RequestException as e:
    print(f"  请求失败: {e}")

# 2. POST请求
print("\n2. POST请求:")
try:
    # 发送JSON数据
    response = session.post(
        'https://httpbin.org/post',
        json={'name': '张三', 'age': 25, 'city': '北京'},
        timeout=10
    )
    print(f"  状态码: {response.status_code}")
    data = response.json()
    print(f"  发送的JSON: {data.get('json', {})}")
except requests.RequestException as e:
    print(f"  请求失败: {e}")

# 3. 发送表单数据
print("\n3. 发送表单数据:")
try:
    response = session.post(
        'https://httpbin.org/post',
        data={'username': 'admin', 'password': '123456'},
        timeout=10
    )
    data = response.json()
    print(f"  发送的表单: {data.get('form', {})}")
except requests.RequestException as e:
    print(f"  请求失败: {e}")

# 4. 自定义请求头
print("\n4. 自定义请求头:")
try:
    custom_headers = {
        'User-Agent': 'MyPythonCrawler/1.0',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value'
    }
    response = session.get(
        'https://httpbin.org/headers',
        headers=custom_headers,
        timeout=10
    )
    data = response.json()
    print(f"  服务器收到的请求头:")
    for k, v in data.get('headers', {}).items():
        print(f"    {k}: {v}")
except requests.RequestException as e:
    print(f"  请求失败: {e}")
```

### 2.2 响应处理

```python
# 示例：响应处理
import requests
import json

print("=" * 60)
print("响应处理")
print("=" * 60)

# 发送请求
try:
    response = requests.get('https://httpbin.org/json', timeout=10)
    
    # 状态码检查
    print(f"状态码: {response.status_code}")
    print(f"是否成功: {response.ok}")
    
    # 响应内容的不同获取方式
    print(f"\n响应内容获取方式:")
    print(f"  text (字符串): {response.text[:100]}...")
    print(f"  content (字节): {response.content[:50]}...")
    
    if response.headers.get('Content-Type', '').startswith('application/json'):
        data = response.json()
        print(f"  json (字典): {json.dumps(data, ensure_ascii=False)[:100]}...")
    
    # 响应头
    print(f"\n响应头:")
    for key, value in list(response.headers.items())[:5]:
        print(f"  {key}: {value}")
    
    # 编码
    print(f"\n编码信息:")
    print(f"  表面编码: {response.encoding}")
    print(f"  实际编码: {response.apparent_encoding}")
    
    # Cookie
    print(f"\nCookie:")
    for key, value in response.cookies.items():
        print(f"  {key}: {value}")
    
    # 请求历史（重定向）
    print(f"\n请求历史:")
    for i, hist in enumerate(response.history):
        print(f"  重定向{i+1}: {hist.status_code} -> {hist.url}")
    
    # 耗时
    print(f"\n响应时间: {response.elapsed.total_seconds():.3f}秒")

except requests.RequestException as e:
    print(f"请求失败: {e}")
```

### 2.3 会话与Cookie管理

```python
# 示例：会话与Cookie管理
import requests
import time

print("=" * 60)
print("会话与Cookie管理")
print("=" * 60)

# 创建Session
session = requests.Session()

# 设置默认请求头
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
})

# 模拟登录（使用httpbin的cookies接口）
print("1. 模拟Cookie设置和保持:")
try:
    # 第一次请求：设置Cookie
    response = session.get(
        'https://httpbin.org/cookies/set',
        params={'session_id': 'abc123', 'user_token': 'token_xyz'},
        timeout=10
    )
    print(f"  设置Cookie响应: {response.status_code}")
    
    # 第二次请求：验证Cookie被保持
    response = session.get('https://httpbin.org/cookies', timeout=10)
    data = response.json()
    print(f"  Session中的Cookie: {data.get('cookies', {})}")
    
except requests.RequestException as e:
    print(f"  请求失败: {e}")

# 手动设置Cookie
print("\n2. 手动设置Cookie:")
try:
    session2 = requests.Session()
    session2.cookies.set('custom_cookie', 'my_value', domain='httpbin.org')
    session2.cookies.set('user_id', '12345', domain='httpbin.org')
    
    response = session2.get('https://httpbin.org/cookies', timeout=10)
    data = response.json()
    print(f"  自定义Cookie: {data.get('cookies', {})}")
    
except requests.RequestException as e:
    print(f"  请求失败: {e}")
```

## 三、BeautifulSoup解析HTML

### 3.1 BeautifulSoup基本使用

BeautifulSoup是Python中最流行的HTML/XML解析库，它可以方便地从网页中提取数据。

```python
# 示例：BeautifulSoup基本使用
from bs4 import BeautifulSoup

print("=" * 60)
print("BeautifulSoup基本使用")
print("=" * 60)

# 模拟HTML内容
html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>示例网页</title>
    <meta charset="utf-8">
</head>
<body>
    <div id="header">
        <h1 class="title">欢迎来到示例网站</h1>
        <nav>
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/about">关于</a></li>
                <li><a href="/contact">联系我们</a></li>
            </ul>
        </nav>
    </div>
    
    <div id="content">
        <div class="article">
            <h2 class="title">Python爬虫入门</h2>
            <p class="author">作者: 张三</p>
            <p class="date">2026-07-26</p>
            <p class="summary">这是一篇关于Python爬虫入门的文章...</p>
            <div class="tags">
                <span class="tag">Python</span>
                <span class="tag">爬虫</span>
                <span class="tag">BeautifulSoup</span>
            </div>
        </div>
        
        <div class="article">
            <h2 class="title">数据分析实战</h2>
            <p class="author">作者: 李四</p>
            <p class="date">2026-07-25</p>
            <p class="summary">使用Pandas进行数据分析的实战教程...</p>
            <div class="tags">
                <span class="tag">数据分析</span>
                <span class="tag">Pandas</span>
            </div>
        </div>
    </div>
    
    <div id="footer">
        <p>&copy; 2026 示例网站</p>
    </div>
</body>
</html>
"""

# 创建BeautifulSoup对象
soup = BeautifulSoup(html_content, 'html.parser')

# 基本查找方法
print("1. 基本查找:")
print(f"  标题标签: {soup.title}")
print(f"  标题文本: {soup.title.string}")
print(f"  第一个h1标签: {soup.h1}")
print(f"  第一个p标签: {soup.p}")

# find方法 - 查找单个元素
print(f"\n2. find方法:")
first_article = soup.find('div', class_='article')
print(f"  第一个文章标题: {first_article.find('h2').text}")
print(f"  第一个文章作者: {first_article.find('p', class_='author').text}")

# find_all方法 - 查找所有匹配元素
print(f"\n3. find_all方法:")
all_articles = soup.find_all('div', class_='article')
print(f"  文章数量: {len(all_articles)}")
for i, article in enumerate(all_articles, 1):
    title = article.find('h2', class_='title').text
    author = article.find('p', class_='author').text
    print(f"  文章{i}: {title} - {author}")

# 获取所有链接
print(f"\n4. 获取所有链接:")
links = soup.find_all('a')
for link in links:
    print(f"  {link.text}: {link.get('href')}")

# 获取所有标签
print(f"\n5. 获取所有标签:")
tags = soup.find_all('span', class_='tag')
print(f"  标签: {[tag.text for tag in tags]}")

# CSS选择器
print(f"\n6. CSS选择器:")
print(f"  标题: {soup.select_one('h1.title').text}")
print(f"  所有文章标题: {[h2.text for h2 in soup.select('h2.title')]}")
print(f"  所有标签: {[span.text for span in soup.select('span.tag')]}")
```

### 3.2 HTML解析实战

```python
# 示例：HTML解析实战
from bs4 import BeautifulSoup
import json

print("=" * 60)
print("HTML解析实战")
print("=" * 60)

# 模拟产品列表页面
product_html = """
<html>
<body>
    <div class="product-list">
        <div class="product-item" data-id="1001">
            <img src="/images/phone.jpg" alt="智能手机">
            <h3 class="product-name">智能手机 Pro Max</h3>
            <div class="price">
                <span class="original-price">¥5999</span>
                <span class="current-price">¥4999</span>
            </div>
            <div class="rating">
                <span class="stars">★★★★☆</span>
                <span class="review-count">(128条评价)</span>
            </div>
            <div class="specs">
                <span>内存: 8GB</span>
                <span>存储: 256GB</span>
                <span>颜色: 黑色</span>
            </div>
        </div>
        
        <div class="product-item" data-id="1002">
            <img src="/images/laptop.jpg" alt="笔记本电脑">
            <h3 class="product-name">轻薄笔记本电脑</h3>
            <div class="price">
                <span class="original-price">¥8999</span>
                <span class="current-price">¥7999</span>
            </div>
            <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="review-count">(256条评价)</span>
            </div>
            <div class="specs">
                <span>CPU: i7-13700H</span>
                <span>内存: 16GB</span>
                <span>存储: 512GB SSD</span>
            </div>
        </div>
        
        <div class="product-item" data-id="1003">
            <img src="/images/headphone.jpg" alt="无线耳机">
            <h3 class="product-name">降噪无线耳机</h3>
            <div class="price">
                <span class="original-price">¥1299</span>
                <span class="current-price">¥999</span>
            </div>
            <div class="rating">
                <span class="stars">★★★★☆</span>
                <span class="review-count">(89条评价)</span>
            </div>
            <div class="specs">
                <span>续航: 30小时</span>
                <span>降噪: 主动降噪</span>
                <span>颜色: 白色</span>
            </div>
        </div>
    </div>
</body>
</html>
"""

# 解析HTML
soup = BeautifulSoup(product_html, 'html.parser')

# 提取产品信息
products = []

for item in soup.find_all('div', class_='product-item'):
    product = {
        'id': item.get('data-id'),
        'name': item.find('h3', class_='product-name').text.strip(),
        'image': item.find('img')['src'] if item.find('img') else '',
        'original_price': item.find('span', class_='original-price').text.strip(),
        'current_price': item.find('span', class_='current-price').text.strip(),
        'rating': item.find('span', class_='stars').text.strip(),
        'review_count': item.find('span', class_='review-count').text.strip(),
        'specs': [span.text.strip() for span in item.find('div', class_='specs').find_all('span')]
    }
    products.append(product)

print("提取的产品信息:")
for p in products:
    print(f"\n  [{p['id']}] {p['name']}")
    print(f"    价格: {p['original_price']} -> {p['current_price']}")
    print(f"    评价: {p['rating']} {p['review_count']}")
    print(f"    规格: {', '.join(p['specs'])}")

# 导出为JSON
print(f"\nJSON格式:")
print(json.dumps(products, ensure_ascii=False, indent=2))
```

## 四、爬取公开API数据

### 4.1 爬取JSON API

公开API是获取结构化数据的最佳方式，因为数据格式清晰，不需要解析HTML。

```python
# 示例：爬取公开API数据
import requests
import json
import time

print("=" * 60)
print("爬取公开API数据")
print("=" * 60)

# 使用JSONPlaceholder（免费的假数据API）
BASE_URL = "https://jsonplaceholder.typicode.com"

# 1. 获取帖子列表
print("1. 获取帖子列表:")
try:
    response = requests.get(f"{BASE_URL}/posts", timeout=10)
    response.raise_for_status()
    posts = response.json()
    print(f"  获取到 {len(posts)} 条帖子")
    print(f"  前3条帖子:")
    for post in posts[:3]:
        print(f"    [{post['id']}] {post['title'][:50]}...")
except requests.RequestException as e:
    print(f"  请求失败: {e}")

# 2. 获取单个帖子及其评论
print("\n2. 获取帖子详情和评论:")
try:
    post_id = 1
    # 获取帖子
    post_response = requests.get(f"{BASE_URL}/posts/{post_id}", timeout=10)
    post = post_response.json()
    print(f"  帖子: {post['title']}")
    print(f"  内容: {post['body'][:100]}...")
    
    # 获取评论
    comments_response = requests.get(
        f"{BASE_URL}/posts/{post_id}/comments",
        timeout=10
    )
    comments = comments_response.json()
    print(f"  评论数: {len(comments)}")
    for comment in comments[:2]:
        print(f"    [{comment['email']}]: {comment['body'][:50]}...")
except requests.RequestException as e:
    print(f"  请求失败: {e}")

# 3. 获取用户数据
print("\n3. 获取用户数据:")
try:
    response = requests.get(f"{BASE_URL}/users", timeout=10)
    users = response.json()
    print(f"  用户数: {len(users)}")
    for user in users[:3]:
        print(f"    {user['name']} ({user['email']}) - {user['company']['name']}")
except requests.RequestException as e:
    print(f"  请求失败: {e}")
```

### 4.2 数据采集器实现

```python
# 示例：数据采集器实现
import requests
import json
import time
from datetime import datetime

print("=" * 60)
print("数据采集器实现")
print("=" * 60)

class DataCollector:
    """数据采集器类"""
    
    def __init__(self, base_url, retry_times=3, delay=1):
        self.base_url = base_url
        self.retry_times = retry_times
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'DataCollector/1.0 (Educational Purpose)'
        })
        self.collected_data = []
    
    def fetch_with_retry(self, url, **kwargs):
        """带重试的请求"""
        for attempt in range(self.retry_times):
            try:
                response = self.session.get(url, timeout=10, **kwargs)
                response.raise_for_status()
                return response
            except requests.Timeout:
                if attempt < self.retry_times - 1:
                    print(f"    请求超时，第{attempt+1}次重试...")
                    time.sleep(self.delay * (attempt + 1))
            except requests.RequestException as e:
                if attempt < self.retry_times - 1:
                    print(f"    请求失败: {e}，第{attempt+1}次重试...")
                    time.sleep(self.delay * (attempt + 1))
                else:
                    raise
        return None
    
    def collect_posts(self, limit=10):
        """采集帖子数据"""
        print(f"开始采集帖子数据...")
        try:
            response = self.fetch_with_retry(f"{self.base_url}/posts")
            if response:
                posts = response.json()[:limit]
                print(f"  成功采集 {len(posts)} 条帖子")
                return posts
        except Exception as e:
            print(f"  采集帖子失败: {e}")
        return []
    
    def collect_comments_for_post(self, post_id):
        """采集指定帖子的评论"""
        try:
            response = self.fetch_with_retry(
                f"{self.base_url}/posts/{post_id}/comments"
            )
            if response:
                return response.json()
        except Exception as e:
            print(f"  采集评论失败 (post_id={post_id}): {e}")
        return []
    
    def collect_all(self, post_limit=5):
        """采集所有数据"""
        print("=" * 40)
        print("开始全面数据采集")
        print("=" * 40)
        
        # 采集帖子
        posts = self.collect_posts(post_limit)
        
        # 为每个帖子采集评论
        all_data = []
        for i, post in enumerate(posts):
            print(f"  处理帖子 {i+1}/{len(posts)}: {post['title'][:30]}...")
            comments = self.collect_comments_for_post(post['id'])
            
            all_data.append({
                'post': post,
                'comments': comments,
                'collected_at': datetime.now().isoformat()
            })
            
            # 请求间隔，避免过于频繁
            if i < len(posts) - 1:
                time.sleep(self.delay)
        
        self.collected_data = all_data
        print(f"\n采集完成! 共 {len(all_data)} 条帖子，{sum(len(d['comments']) for d in all_data)} 条评论")
        return all_data
    
    def save_to_json(self, filepath):
        """保存数据到JSON文件"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.collected_data, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到: {filepath}")
    
    def get_statistics(self):
        """获取采集统计"""
        if not self.collected_data:
            return {}
        
        total_posts = len(self.collected_data)
        total_comments = sum(len(d['comments']) for d in self.collected_data)
        
        return {
            'total_posts': total_posts,
            'total_comments': total_comments,
            'avg_comments_per_post': total_comments / total_posts if total_posts > 0 else 0,
            'collection_time': datetime.now().isoformat()
        }


# 使用采集器
collector = DataCollector(
    base_url="https://jsonplaceholder.typicode.com",
    retry_times=3,
    delay=1
)

data = collector.collect_all(post_limit=3)

# 显示统计
stats = collector.get_statistics()
print(f"\n采集统计:")
for key, value in stats.items():
    print(f"  {key}: {value}")
```

## 五、反爬虫策略应对

### 5.1 常见反爬虫策略与应对

```python
# 示例：反爬虫策略应对
import requests
import time
import random
from urllib.parse import urlparse

print("=" * 60)
print("反爬虫策略应对")
print("=" * 60)

class AntiCrawlerHandler:
    """反爬虫策略处理类"""
    
    def __init__(self):
        self.session = requests.Session()
        self._setup_session()
    
    def _setup_session(self):
        """设置会话"""
        self.session.headers.update({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
        })
    
    def set_random_user_agent(self):
        """设置随机User-Agent"""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        ]
        ua = random.choice(user_agents)
        self.session.headers['User-Agent'] = ua
        return ua
    
    def random_delay(self, min_seconds=1, max_seconds=3):
        """随机延迟"""
        delay = random.uniform(min_seconds, max_seconds)
        time.sleep(delay)
        return delay
    
    def add_referer(self, url):
        """添加Referer头"""
        parsed = urlparse(url)
        self.session.headers['Referer'] = f"{parsed.scheme}://{parsed.netloc}/"
    
    def handle_rate_limit(self, response):
        """处理限流"""
        if response.status_code == 429:
            retry_after = response.headers.get('Retry-After', '5')
            wait_time = int(retry_after) if retry_after.isdigit() else 5
            print(f"  遇到限流(429)，等待 {wait_time} 秒...")
            time.sleep(wait_time)
            return True
        return False
    
    def safe_request(self, url, **kwargs):
        """安全的请求方法"""
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                # 设置随机UA
                ua = self.set_random_user_agent()
                
                # 设置Referer
                self.add_referer(url)
                
                # 发送请求
                response = self.session.get(url, timeout=15, **kwargs)
                
                # 处理限流
                if self.handle_rate_limit(response):
                    continue
                
                # 检查状态码
                if response.status_code == 200:
                    return response
                elif response.status_code == 403:
                    print(f"  访问被拒绝(403): {url}")
                    return None
                elif response.status_code == 404:
                    return None
                else:
                    print(f"  状态码 {response.status_code}")
                    
            except requests.RequestException as e:
                print(f"  请求失败 (尝试{attempt+1}): {e}")
            
            # 重试前延迟
            if attempt < max_retries - 1:
                delay = self.random_delay(2, 5)
                print(f"  等待 {delay:.1f} 秒后重试...")
        
        return None


# 演示反爬虫处理
handler = AntiCrawlerHandler()

print("反爬虫策略总结:")
strategies = {
    "User-Agent轮换": "使用多个User-Agent，随机切换",
    "请求延迟": "在请求之间添加随机延迟，模拟人类行为",
    "Referer设置": "设置合理的Referer头",
    "Cookie管理": "使用Session保持Cookie",
    "IP代理": "使用代理IP池轮换IP地址",
    "请求头伪装": "完整模拟浏览器的请求头",
    "验证码处理": "使用OCR或打码平台识别验证码",
    "动态渲染": "使用Selenium/Playwright处理JS渲染",
    "频率控制": "控制请求频率，避免触发限流",
}

for strategy, desc in strategies.items():
    print(f"  {strategy:20s}: {desc}")
```

## 六、模拟登录与Cookie

### 6.1 模拟登录

```python
# 示例：模拟登录与Cookie
import requests
import json

print("=" * 60)
print("模拟登录与Cookie")
print("=" * 60)

class LoginSimulator:
    """模拟登录类"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.logged_in = False
    
    def login(self, login_url, username, password):
        """执行登录"""
        print(f"尝试登录: {login_url}")
        print(f"  用户名: {username}")
        
        # 登录数据
        login_data = {
            'username': username,
            'password': password,
            'remember': 'true'
        }
        
        try:
            # 发送登录请求
            response = self.session.post(login_url, data=login_data, timeout=10)
            
            if response.status_code == 200:
                # 在实际应用中，需要根据响应内容判断登录是否成功
                # 这里使用httpbin的post接口模拟
                data = response.json()
                print(f"  登录响应: {data.get('form', {})}")
                self.logged_in = True
                return True
            else:
                print(f"  登录失败，状态码: {response.status_code}")
                return False
                
        except requests.RequestException as e:
            print(f"  登录请求失败: {e}")
            return False
    
    def get_protected_page(self, url):
        """访问需要登录的页面"""
        if not self.logged_in:
            print("尚未登录，请先登录")
            return None
        
        try:
            response = self.session.get(url, timeout=10)
            return response
        except requests.RequestException as e:
            print(f"访问失败: {e}")
            return None
    
    def save_cookies(self, filepath):
        """保存Cookie到文件"""
        cookies = self.session.cookies.get_dict()
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(cookies, f, ensure_ascii=False, indent=2)
        print(f"Cookie已保存到: {filepath}")
    
    def load_cookies(self, filepath):
        """从文件加载Cookie"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                cookies = json.load(f)
            for key, value in cookies.items():
                self.session.cookies.set(key, value)
            self.logged_in = True
            print(f"Cookie已加载，共 {len(cookies)} 个")
            return True
        except FileNotFoundError:
            print(f"Cookie文件不存在: {filepath}")
            return False

# 演示模拟登录
simulator = LoginSimulator()

# 使用httpbin测试登录
login_url = "https://httpbin.org/post"
success = simulator.login(login_url, "testuser", "password123")

if success:
    print("\n登录成功!")
    print(f"Session Cookie: {simulator.session.cookies.get_dict()}")
```

## 七、爬虫项目实战：新闻采集器

```python
# 示例：新闻采集器实战
import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

print("=" * 60)
print("爬虫综合实战：新闻采集器")
print("=" * 60)

class NewsCollector:
    """新闻采集器"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.articles = []
    
    def parse_article(self, html):
        """解析文章内容"""
        soup = BeautifulSoup(html, 'html.parser')
        
        articles = []
        for article_elem in soup.select('.article-item'):
            article = {
                'title': self._safe_extract(article_elem, '.title'),
                'author': self._safe_extract(article_elem, '.author'),
                'date': self._safe_extract(article_elem, '.date'),
                'summary': self._safe_extract(article_elem, '.summary'),
                'url': self._safe_extract_attr(article_elem, 'a', 'href'),
                'tags': [t.text for t in article_elem.select('.tag')],
                'collected_at': datetime.now().isoformat()
            }
            articles.append(article)
        
        return articles
    
    def _safe_extract(self, element, selector):
        """安全提取文本"""
        found = element.select_one(selector)
        return found.text.strip() if found else ''
    
    def _safe_extract_attr(self, element, selector, attr):
        """安全提取属性"""
        found = element.select_one(selector)
        return found.get(attr, '') if found else ''
    
    def collect(self, urls, delay=2):
        """采集多个URL"""
        print(f"开始采集 {len(urls)} 个URL...")
        
        for i, url in enumerate(urls):
            print(f"\n[{i+1}/{len(urls)}] 采集: {url}")
            
            try:
                response = self.session.get(url, timeout=15)
                if response.status_code == 200:
                    articles = self.parse_article(response.text)
                    self.articles.extend(articles)
                    print(f"  成功采集 {len(articles)} 篇文章")
                else:
                    print(f"  状态码: {response.status_code}")
            except Exception as e:
                print(f"  采集失败: {e}")
            
            if i < len(urls) - 1:
                time.sleep(delay)
        
        print(f"\n采集完成! 共 {len(self.articles)} 篇文章")
        return self.articles
    
    def get_statistics(self):
        """获取统计信息"""
        if not self.articles:
            return {}
        
        tags_count = {}
        for article in self.articles:
            for tag in article.get('tags', []):
                tags_count[tag] = tags_count.get(tag, 0) + 1
        
        return {
            'total_articles': len(self.articles),
            'unique_authors': len(set(a['author'] for a in self.articles if a['author'])),
            'top_tags': sorted(tags_count.items(), key=lambda x: x[1], reverse=True)[:5],
            'collection_time': datetime.now().isoformat()
        }
    
    def save_data(self, filepath):
        """保存数据"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': self.get_statistics(),
                'articles': self.articles
            }, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到: {filepath}")
    
    def export_csv(self, filepath):
        """导出为CSV"""
        import csv
        if not self.articles:
            return
        
        with open(filepath, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['title', 'author', 'date', 'summary', 'url', 'tags', 'collected_at'])
            writer.writeheader()
            writer.writerows(self.articles)
        print(f"CSV已导出到: {filepath}")


# 演示新闻采集器（使用模拟数据）
print("新闻采集器已就绪")
print("""
使用说明:
  collector = NewsCollector()
  collector.collect(['https://example.com/news/page1', ...])
  collector.save_data('news_data.json')
  collector.export_csv('news_data.csv')
""")

# 模拟演示
sample_html = """
<html><body>
<div class="article-item">
    <h2 class="title">Python 3.13发布新特性</h2>
    <span class="author">技术新闻</span>
    <span class="date">2026-07-26</span>
    <p class="summary">Python 3.13带来了多项性能改进和新特性...</p>
    <a href="/news/python-313">阅读更多</a>
    <div><span class="tag">Python</span><span class="tag">编程</span></div>
</div>
<div class="article-item">
    <h2 class="title">AI技术在医疗领域的应用</h2>
    <span class="author">科技日报</span>
    <span class="date">2026-07-25</span>
    <p class="summary">人工智能正在改变医疗行业的各个方面...</p>
    <a href="/news/ai-medical">阅读更多</a>
    <div><span class="tag">AI</span><span class="tag">医疗</span></div>
</div>
</body></html>
"""

collector = NewsCollector()
articles = collector.parse_article(sample_html)

print(f"\n模拟采集结果:")
for article in articles:
    print(f"\n  标题: {article['title']}")
    print(f"  作者: {article['author']}")
    print(f"  日期: {article['date']}")
    print(f"  摘要: {article['summary']}")
    print(f"  标签: {', '.join(article['tags'])}")
```

## 总结

本章我们深入学习了Python爬虫的核心知识，涵盖了以下主要内容：

**HTTP协议基础**：理解HTTP协议是爬虫开发的基础，包括请求方法、状态码、请求头和URL结构等。Python的`urllib`和`requests`库提供了发送HTTP请求的功能。

**Requests库详解**：`requests`库是Python中最流行的HTTP客户端库，提供了简洁的API来发送GET、POST等请求。Session对象可以保持Cookie和连接池，提高请求效率。

**BeautifulSoup解析HTML**：BeautifulSoup是强大的HTML解析库，提供了`find`、`find_all`、`select`等方法来提取数据。CSS选择器使得数据提取更加灵活和直观。

**爬取公开API数据**：公开API是获取结构化数据的最佳方式。通过`requests`库配合JSON解析，可以高效地采集API数据。

**反爬虫策略应对**：包括User-Agent轮换、请求延迟、Referer设置、Cookie管理、IP代理等策略。合理的反爬虫应对是爬虫开发的必备技能。

**模拟登录与Cookie**：通过Session对象可以保持登录状态，Cookie的保存和加载功能使得登录状态可以跨会话保持。

**新闻采集器实战**：综合运用所学知识，构建了一个完整的新闻采集器，展示了爬虫开发的完整流程。

通过本章的学习，你应该已经掌握了Python爬虫的核心技术，能够进行基本的网络数据采集。在下一章中，我们将综合运用NumPy、Pandas、Matplotlib和爬虫技术，完成一个完整的数据分析项目。
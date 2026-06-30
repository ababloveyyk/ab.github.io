# Node.js 实战

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。

## 核心模块

```javascript
const fs = require('fs')
const path = require('path')
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello Node.js')
})

server.listen(3000)
```

## Express 框架

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello Express')
})

app.listen(3000)
```

## 异步编程

Node.js 使用异步非阻塞 I/O 模型，常见的异步方式：

- 回调函数
- Promise
- async/await
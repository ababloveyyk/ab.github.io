---
title: React 基础
date: 2026-06-30
tags:
  - React
  - 前端框架
  - JSX
  - 组件
categories:
  - 前端技术
---

# React 基础

React 是由 Facebook 开发和维护的用于构建用户界面的 JavaScript 库。

## 核心概念

- **组件**：可复用的 UI 单元
- **JSX**：JavaScript 的语法扩展
- **状态管理**：组件内部的状态
- **生命周期**：组件从创建到销毁的过程

## Hello World

```jsx
function App() {
  return <h1>Hello, React!</h1>
}

ReactDOM.render(<App />, document.getElementById('root'))
```

## Hooks

React Hooks 让你在函数组件中使用 state 和其他 React 特性。

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```
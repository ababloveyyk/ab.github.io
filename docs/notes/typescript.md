---
title: TypeScript 学习
date: 2026-06-30
tags:
  - TypeScript
  - 类型系统
  - 静态类型
  - JavaScript
categories:
  - 前端技术
---

# TypeScript 学习

TypeScript 是 JavaScript 的超集，添加了可选的静态类型检查和基于类的面向对象编程。

## 类型系统

```typescript
interface User {
  name: string
  age: number
  isActive?: boolean
}

const user: User = {
  name: '张三',
  age: 25
}
```

## 泛型

```typescript
function identity<T>(arg: T): T {
  return arg
}

const num = identity<number>(42)
const str = identity<string>('hello')
```

## 实用类型

TypeScript 提供了许多实用类型来帮助你处理类型转换：

- `Partial<T>` - 将所有属性变为可选
- `Readonly<T>` - 将所有属性变为只读
- `Pick<T, K>` - 从 T 中选取 K 属性
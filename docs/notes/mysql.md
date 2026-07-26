---
title: MySQL 数据库
date: 2026-06-30
tags:
  - MySQL
  - 数据库
  - SQL
  - 后端
categories:
  - 后端技术
---

# MySQL 数据库

MySQL 是世界上最流行的开源关系型数据库之一。

## 基础查询

```sql
SELECT * FROM users 
WHERE age > 18 
ORDER BY created_at DESC 
LIMIT 10;
```

## 连接查询

```sql
SELECT u.name, p.title 
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.id = 1;
```

## 索引优化

合理使用索引可以大幅提升查询性能：

- 主键索引
- 唯一索引
- 普通索引
- 复合索引
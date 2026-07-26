---
title: Python函数与高级特性Ⅲ——lambda与推导式
date: 2026-07-26
tags:
  - Python
  - lambda
  - 推导式
  - map
  - filter
  - reduce
categories:
  - Python
---

## 前言

在 Python 的函数式编程工具箱中，lambda 表达式和推导式是两个最常用的工具。lambda 表达式允许你快速定义匿名函数，而推导式提供了一种简洁高效的创建容器的方式。两者结合使用，能让你的代码既简洁又富有表现力。

lambda 表达式源自 lambda 演算（一种数学计算模型），在 Python 中用于创建小型匿名函数。它通常与 `map()`、`filter()`、`reduce()` 等高阶函数配合使用，但也可以独立使用。虽然 lambda 功能有限（只能包含一个表达式），但它在需要简单函数对象的场景中非常方便。

推导式（Comprehension）是 Python 最具特色的语法之一。列表推导式、字典推导式、集合推导式和生成器推导式分别提供了创建对应容器类型的简洁方式。推导式不仅代码更短，而且通常比等效的 for 循环更快，因为它们在 C 层面执行。

本文将详细介绍 lambda 表达式和各种推导式的语法、用法和最佳实践，并通过性能对比展示它们相对于传统方法的优势。

## lambda 表达式

### lambda 基础语法

lambda 表达式的语法是：`lambda 参数: 表达式`。它创建一个匿名函数对象，可以赋值给变量或直接使用。

```python
# lambda 基础语法
print("=" * 60)
print("lambda 基础语法")
print("=" * 60)

# lambda 与 def 的对比
# 使用 def
def add_def(x, y):
    return x + y

# 使用 lambda
add_lambda = lambda x, y: x + y

print(f"add_def(3, 5) = {add_def(3, 5)}")
print(f"add_lambda(3, 5) = {add_lambda(3, 5)}")
print(f"add_lambda 的类型：{type(add_lambda)}")

# lambda 可以有多个参数
multiply = lambda x, y, z: x * y * z
print(f"multiply(2, 3, 4) = {multiply(2, 3, 4)}")

# lambda 可以有默认参数
greet = lambda name, greeting="Hello": f"{greeting}, {name}!"
print(greet("Alice"))
print(greet("Bob", "Hi"))

# lambda 可以有可变参数
sum_all = lambda *args: sum(args)
print(f"sum_all(1, 2, 3, 4, 5) = {sum_all(1, 2, 3, 4, 5)}")

# lambda 只是表达式，不能包含语句
# 以下都是错误的：
# lambda x: print(x)  # 虽然能运行，但 print 返回 None
# lambda x: if x > 0: return x  # 语法错误

# lambda 实现条件表达式
is_even = lambda x: "偶数" if x % 2 == 0 else "奇数"
print(f"is_even(4) = {is_even(4)}")
print(f"is_even(7) = {is_even(7)}")
```

lambda 表达式的主体只能是一个表达式，不能包含语句。这意味着你不能在 lambda 中使用赋值语句、if 语句（但可以使用条件表达式）、for 循环等。如果逻辑比较复杂，应该使用 `def` 定义普通函数。

### lambda 与 sorted()

```python
# lambda 与 sorted()
print("=" * 60)
print("lambda 与 sorted()")
print("=" * 60)

# 按绝对值排序
numbers = [5, -3, 2, -8, 1, -4]
sorted_by_abs = sorted(numbers, key=lambda x: abs(x))
print(f"按绝对值排序：{sorted_by_abs}")

# 按字符串长度排序
words = ["apple", "banana", "kiwi", "cherry", "date"]
sorted_by_len = sorted(words, key=lambda x: len(x))
print(f"按长度排序：{sorted_by_len}")

# 按元组的第二个元素排序
pairs = [(1, 3), (2, 1), (3, 2), (4, 0)]
sorted_pairs = sorted(pairs, key=lambda x: x[1])
print(f"按第二个元素排序：{sorted_pairs}")

# 按字典的值排序
scores = {"Alice": 95, "Bob": 87, "Charlie": 92, "David": 78}
sorted_by_score = sorted(scores.items(), key=lambda x: x[1], reverse=True)
print(f"\n按成绩降序：")
for name, score in sorted_by_score:
    print(f"  {name}: {score}")

# 多级排序
students = [
    ("Alice", 90, 18),
    ("Bob", 85, 19),
    ("Charlie", 90, 17),
    ("David", 85, 18),
]
sorted_students = sorted(students, key=lambda x: (-x[1], x[2]))
print(f"\n多级排序（成绩降序，年龄升序）：")
for name, score, age in sorted_students:
    print(f"  {name}: 成绩={score}, 年龄={age}")
```

### lambda 与 map()

`map()` 将一个函数应用到可迭代对象的每个元素，返回一个迭代器。

```python
# lambda 与 map()
print("=" * 60)
print("lambda 与 map()")
print("=" * 60)

# 基本用法：将每个元素平方
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(f"平方：{squared}")

# 转换数据类型
strings = ["1", "2", "3", "4", "5"]
integers = list(map(int, strings))
print(f"字符串转整数：{integers}")

# 格式化
names = ["alice", "bob", "charlie"]
capitalized = list(map(lambda x: x.capitalize(), names))
print(f"首字母大写：{capitalized}")

# 多个可迭代对象
list1 = [1, 2, 3, 4, 5]
list2 = [10, 20, 30, 40, 50]
sums = list(map(lambda x, y: x + y, list1, list2))
print(f"两个列表相加：{sums}")

# 实际应用：温度转换
celsius = [0, 10, 20, 30, 40, 100]
fahrenheit = list(map(lambda c: c * 9/5 + 32, celsius))
print(f"\n摄氏转华氏：{list(zip(celsius, fahrenheit))}")

# map 与列表推导式的对比
# 使用 map
result1 = list(map(lambda x: x * 2, range(10)))
# 使用列表推导式（通常更 Pythonic）
result2 = [x * 2 for x in range(10)]
print(f"\nmap: {result1}")
print(f"列表推导式: {result2}")
```

`map()` 在 Python 3 中返回一个迭代器（而不是列表），这是为了节省内存。如果需要列表，需要使用 `list()` 转换。在大多数情况下，列表推导式比 `map()` + lambda 更可读、更 Pythonic。

### lambda 与 filter()

`filter()` 使用一个返回布尔值的函数过滤可迭代对象。

```python
# lambda 与 filter()
print("=" * 60)
print("lambda 与 filter()")
print("=" * 60)

# 过滤偶数
numbers = range(1, 21)
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"偶数：{evens}")

# 过滤空字符串
data = ["Alice", "", "Bob", "", "  ", "Charlie"]
non_empty = list(filter(lambda x: x.strip(), data))
print(f"非空：{non_empty}")

# 过滤满足条件的字典
users = [
    {"name": "Alice", "age": 25, "active": True},
    {"name": "Bob", "age": 17, "active": True},
    {"name": "Charlie", "age": 30, "active": False},
    {"name": "David", "age": 20, "active": True},
]
active_adults = list(filter(lambda u: u["active"] and u["age"] >= 18, users))
print(f"\n活跃的成年用户：{[u['name'] for u in active_adults]}")

# filter 返回迭代器
even_iter = filter(lambda x: x % 2 == 0, range(10))
print(f"\nfilter 迭代器：{even_iter}")
print(f"第一次遍历：{list(even_iter)}")
print(f"第二次遍历：{list(even_iter)}")  # 空！迭代器只能遍历一次

# filter 与列表推导式对比
# filter
result1 = list(filter(lambda x: x % 2 == 0, range(10)))
# 列表推导式（更可读）
result2 = [x for x in range(10) if x % 2 == 0]
print(f"\nfilter: {result1}")
print(f"列表推导式: {result2}")
```

### lambda 与 reduce()

`reduce()` 在 Python 3 中被移到了 `functools` 模块。它累积地将函数应用到序列的元素上。

```python
# lambda 与 reduce()
print("=" * 60)
print("lambda 与 reduce()")
print("=" * 60)

from functools import reduce

# 累加
numbers = [1, 2, 3, 4, 5]
total = reduce(lambda x, y: x + y, numbers)
print(f"累加 1+2+3+4+5 = {total}")

# 累乘（阶乘）
factorial = reduce(lambda x, y: x * y, range(1, 6))
print(f"5! = {factorial}")

# 带初始值的 reduce
numbers = [1, 2, 3, 4, 5]
total_with_initial = reduce(lambda x, y: x + y, numbers, 10)
print(f"带初始值 10 的累加：{total_with_initial}")

# 查找最大值
max_val = reduce(lambda x, y: x if x > y else y, [3, 7, 1, 9, 4, 6])
print(f"最大值：{max_val}")

# 连接字符串
words = ["Python", "is", "awesome"]
sentence = reduce(lambda x, y: f"{x} {y}", words)
print(f"连接字符串：{sentence}")

# 实际应用：展平嵌套列表
nested = [[1, 2], [3, 4], [5, 6]]
flattened = reduce(lambda x, y: x + y, nested)
print(f"\n展平列表：{flattened}")

# 实际应用：管道处理
def pipe(value, *functions):
    """管道处理：依次应用函数"""
    return reduce(lambda v, f: f(v), functions, value)

result = pipe(
    5,
    lambda x: x * 2,      # 10
    lambda x: x + 3,      # 13
    lambda x: x ** 2,     # 169
    lambda x: x // 10,    # 16
)
print(f"\n管道处理结果：{result}")
```

## 列表推导式详解

列表推导式是 Python 中最常用、最强大的推导式。它提供了创建列表的简洁语法。

```python
# 列表推导式详解
print("=" * 60)
print("列表推导式详解")
print("=" * 60)

# 基本语法
squares = [x ** 2 for x in range(1, 11)]
print(f"平方数：{squares}")

# 带条件的列表推导式
even_squares = [x ** 2 for x in range(1, 11) if x % 2 == 0]
print(f"偶数的平方：{even_squares}")

# 带 if-else 的列表推导式
labels = ["偶数" if x % 2 == 0 else "奇数" for x in range(1, 11)]
print(f"奇偶标签：{labels}")

# 嵌套循环
pairs = [(x, y) for x in range(3) for y in range(3)]
print(f"坐标对：{pairs}")

# 嵌套循环带条件
pairs_no_diag = [(x, y) for x in range(3) for y in range(3) if x != y]
print(f"非对角线：{pairs_no_diag}")

# 多层嵌套
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(f"展平矩阵：{flattened}")

# 转置矩阵
transposed = [[row[i] for row in matrix] for i in range(3)]
print(f"转置矩阵：{transposed}")

# 实际应用：数据清洗
raw_data = ["  Alice  ", "BOB", "", "  charlie  ", None, "  ", "DAVID"]
cleaned = [
    name.strip().title() 
    for name in raw_data 
    if name is not None and name.strip()
]
print(f"\n数据清洗：{cleaned}")

# 实际应用：字符串处理
text = "the quick brown fox jumps over the lazy dog"
word_lengths = [(word, len(word)) for word in text.split()]
print(f"单词长度：{word_lengths}")
```

## 字典推导式

```python
# 字典推导式
print("=" * 60)
print("字典推导式")
print("=" * 60)

# 基本语法
squares = {x: x ** 2 for x in range(1, 6)}
print(f"数字平方：{squares}")

# 带条件
even_squares = {x: x ** 2 for x in range(1, 11) if x % 2 == 0}
print(f"偶数平方：{even_squares}")

# 从两个列表创建字典
keys = ["name", "age", "city"]
values = ["Alice", 25, "New York"]
person = {k: v for k, v in zip(keys, values)}
print(f"从列表创建：{person}")

# 反转键值对
original = {"a": 1, "b": 2, "c": 3}
reversed_dict = {v: k for k, v in original.items()}
print(f"反转：{reversed_dict}")

# 过滤字典
scores = {"Alice": 95, "Bob": 87, "Charlie": 92, "David": 78}
high_scores = {name: score for name, score in scores.items() if score >= 90}
print(f"高分：{high_scores}")

# 转换键或值
upper_keys = {k.upper(): v for k, v in scores.items()}
print(f"键大写：{upper_keys}")
```

## 集合推导式

```python
# 集合推导式
print("=" * 60)
print("集合推导式")
print("=" * 60)

# 基本语法
squares = {x ** 2 for x in range(1, 11)}
print(f"平方数集合：{squares}")

# 去重
data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique = {x for x in data}
print(f"去重：{unique}")

# 带条件
even_set = {x for x in range(20) if x % 2 == 0}
print(f"偶数集合：{even_set}")

# 字符串去重
text = "hello world"
unique_chars = {c for c in text if c != ' '}
print(f"不重复字符：{unique_chars}")
```

## 生成器推导式

```python
# 生成器推导式
print("=" * 60)
print("生成器推导式")
print("=" * 60)

# 生成器表达式使用圆括号
gen = (x ** 2 for x in range(1, 11))
print(f"生成器：{gen}")
print(f"类型：{type(gen)}")

# 逐个获取值
print(f"next(gen) = {next(gen)}")
print(f"next(gen) = {next(gen)}")

# 生成器只能遍历一次
print(f"剩余：{list(gen)}")

# 生成器推导式 vs 列表推导式
import sys

list_comp = [x ** 2 for x in range(1000000)]
gen_expr = (x ** 2 for x in range(1000000))

print(f"\n内存对比：")
print(f"  列表推导式：{sys.getsizeof(list_comp)} bytes")
print(f"  生成器表达式：{sys.getsizeof(gen_expr)} bytes")
```

## 性能对比

```python
# 推导式性能对比
print("=" * 60)
print("推导式性能对比")
print("=" * 60)

import time

n = 1_000_000

# 测试1：创建平方数列表
start = time.perf_counter()
result1 = []
for i in range(n):
    result1.append(i ** 2)
time_for = time.perf_counter() - start

start = time.perf_counter()
result2 = [i ** 2 for i in range(n)]
time_comp = time.perf_counter() - start

start = time.perf_counter()
result3 = list(map(lambda x: x ** 2, range(n)))
time_map = time.perf_counter() - start

print(f"for 循环:     {time_for:.4f} 秒")
print(f"列表推导式:   {time_comp:.4f} 秒")
print(f"map + lambda: {time_map:.4f} 秒")

# 测试2：过滤偶数
start = time.perf_counter()
result1 = []
for i in range(n):
    if i % 2 == 0:
        result1.append(i)
time_for = time.perf_counter() - start

start = time.perf_counter()
result2 = [i for i in range(n) if i % 2 == 0]
time_comp = time.perf_counter() - start

start = time.perf_counter()
result3 = list(filter(lambda x: x % 2 == 0, range(n)))
time_filter = time.perf_counter() - start

print(f"\nfor 循环:       {time_for:.4f} 秒")
print(f"列表推导式:     {time_comp:.4f} 秒")
print(f"filter + lambda: {time_filter:.4f} 秒")
```

## 综合实战：数据处理管道

```python
# 综合实战：数据处理管道
print("=" * 60)
print("综合实战：数据处理管道")
print("=" * 60)

# 原始数据
raw_orders = [
    {"id": 1, "customer": "Alice", "items": ["apple", "banana"], "total": 15.50, "status": "completed"},
    {"id": 2, "customer": "Bob", "items": ["cherry", "date"], "total": 22.00, "status": "pending"},
    {"id": 3, "customer": "Charlie", "items": ["apple", "cherry", "elderberry"], "total": 35.75, "status": "completed"},
    {"id": 4, "customer": "Alice", "items": ["banana"], "total": 5.00, "status": "completed"},
    {"id": 5, "customer": "David", "items": ["fig", "grape"], "total": 18.25, "status": "cancelled"},
    {"id": 6, "customer": "Bob", "items": ["apple", "fig", "grape"], "total": 28.50, "status": "completed"},
    {"id": 7, "customer": "Eve", "items": ["cherry", "date"], "total": 22.00, "status": "pending"},
    {"id": 8, "customer": "Alice", "items": ["elderberry"], "total": 12.00, "status": "completed"},
]

# 1. 过滤已完成的订单
completed = [o for o in raw_orders if o["status"] == "completed"]
print(f"已完成订单数：{len(completed)}")

# 2. 计算每个客户的总消费
customer_totals = {}
for order in completed:
    customer = order["customer"]
    customer_totals[customer] = customer_totals.get(customer, 0) + order["total"]
# 使用字典推导式转换
customer_summary = {
    name: {"total_spent": round(total, 2), "order_count": sum(1 for o in completed if o["customer"] == name)}
    for name, total in customer_totals.items()
}
print(f"\n客户消费汇总：")
for name, info in sorted(customer_summary.items(), key=lambda x: x[1]["total_spent"], reverse=True):
    print(f"  {name}: ${info['total_spent']:.2f} ({info['order_count']} 单)")

# 3. 统计最受欢迎的商品
from collections import Counter
all_items = [item for order in completed for item in order["items"]]
item_counts = Counter(all_items)
print(f"\n最受欢迎商品：")
for item, count in item_counts.most_common(5):
    print(f"  {item}: {count} 次")

# 4. 使用 map 和 filter 计算平均订单金额
completed_totals = list(map(lambda o: o["total"], completed))
avg_order = sum(completed_totals) / len(completed_totals) if completed_totals else 0
print(f"\n平均订单金额：${avg_order:.2f}")

# 5. 使用 reduce 计算总营收
total_revenue = reduce(lambda x, y: x + y["total"], completed, 0)
print(f"总营收：${total_revenue:.2f}")

# 6. 生成报告
report = "\n".join([
    f"订单分析报告",
    f"{'='*40}",
    f"总订单数：{len(raw_orders)}",
    f"已完成：{len(completed)}",
    f"总营收：${total_revenue:.2f}",
    f"平均订单：${avg_order:.2f}",
    f"活跃客户：{len(customer_summary)}",
])
print(f"\n{report}")
```

## 总结

本文详细介绍了 lambda 表达式和各种推导式：

**lambda 表达式**：简洁的匿名函数，适合简单操作。常用于 `sorted()`、`map()`、`filter()`、`reduce()`。注意 lambda 只能包含一个表达式。

**列表推导式**：`[expr for item in iterable if cond]`，创建列表的最 Pythonic 方式。比 `map()` + `filter()` 更可读，比 for 循环更高效。

**字典推导式**：`{key: value for item in iterable}`，适用于数据转换和过滤。

**集合推导式**：`{expr for item in iterable}`，自动去重。

**生成器推导式**：`(expr for item in iterable)`，内存高效，适合大数据集。

**性能建议**：列表推导式比等效的 for 循环快 20-50%，因为它避免了属性查找和函数调用开销。但对于大数据集，考虑使用生成器表达式以节省内存。
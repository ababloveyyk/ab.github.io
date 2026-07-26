---
title: Python函数与高级特性Ⅳ——生成器与迭代器
date: 2026-07-26
tags:
  - Python
  - 迭代器
  - 生成器
  - yield
  - 惰性求值
categories:
  - Python
---

## 前言

在 Python 中，迭代是一个核心概念。几乎所有容器类型都是可迭代的——你可以用 `for` 循环遍历它们。但 Python 的迭代机制远不止于此。迭代器和生成器是 Python 中两个强大但常被忽视的特性，它们不仅让你能够自定义迭代行为，还能在处理大数据集时显著节省内存。

迭代器是实现了 `__iter__` 和 `__next__` 方法的对象。所有可迭代对象都可以通过 `iter()` 函数获得一个迭代器。迭代器每次调用 `__next__` 返回下一个元素，当没有更多元素时抛出 `StopIteration` 异常。

生成器是创建迭代器的最简单方式。使用 `yield` 关键字的函数就是生成器函数。与普通函数不同，生成器函数在 `yield` 处暂停执行，保存当前状态，下次调用时从暂停处继续。这种"惰性求值"的特性使得生成器在处理大数据流时非常高效——它不需要一次性将所有数据加载到内存中。

## 可迭代对象与迭代器

### 可迭代对象（Iterable）

可迭代对象是可以被 `for` 循环遍历的对象。所有序列类型（列表、元组、字符串）和容器类型（字典、集合）都是可迭代的。

```python
# 可迭代对象
print("=" * 60)
print("可迭代对象（Iterable）")
print("=" * 60)

from collections.abc import Iterable, Iterator

# 这些对象都是可迭代的
print("检查可迭代性：")
print(f"  list: {isinstance([1, 2, 3], Iterable)}")      # True
print(f"  tuple: {isinstance((1, 2), Iterable)}")        # True
print(f"  str: {isinstance('hello', Iterable)}")         # True
print(f"  dict: {isinstance({'a': 1}, Iterable)}")       # True
print(f"  set: {isinstance({1, 2}, Iterable)}")          # True
print(f"  range: {isinstance(range(5), Iterable)}")      # True
print(f"  int: {isinstance(42, Iterable)}")              # False
print(f"  float: {isinstance(3.14, Iterable)}")          # False

# 但它们不一定是迭代器
print(f"\n检查是否是迭代器：")
print(f"  list: {isinstance([1, 2, 3], Iterator)}")      # False
print(f"  tuple: {isinstance((1, 2), Iterator)}")        # False
print(f"  str: {isinstance('hello', Iterator)}")         # False
```

### 迭代器（Iterator）

迭代器是实现了 `__iter__` 和 `__next__` 方法的对象。`__iter__` 返回迭代器本身，`__next__` 返回下一个元素。

```python
# 迭代器
print("=" * 60)
print("迭代器（Iterator）")
print("=" * 60)

# 使用 iter() 获取迭代器
numbers = [1, 2, 3, 4, 5]
it = iter(numbers)

print(f"迭代器类型：{type(it)}")
print(f"是迭代器：{isinstance(it, Iterator)}")

# 使用 next() 获取下一个元素
print(f"next(it) = {next(it)}")  # 1
print(f"next(it) = {next(it)}")  # 2
print(f"next(it) = {next(it)}")  # 3
print(f"next(it) = {next(it)}")  # 4
print(f"next(it) = {next(it)}")  # 5

# 没有更多元素时抛出 StopIteration
try:
    next(it)
except StopIteration:
    print("StopIteration：迭代结束")

# for 循环的内部机制
print("\nfor 循环的等效实现：")
my_list = [10, 20, 30]
it = iter(my_list)
while True:
    try:
        item = next(it)
        print(f"  {item}")
    except StopIteration:
        break
```

### 迭代器的特性

```python
# 迭代器的特性
print("=" * 60)
print("迭代器的特性")
print("=" * 60)

# 1. 迭代器只能遍历一次
numbers = [1, 2, 3]
it = iter(numbers)

print("第一次遍历：")
for x in it:
    print(f"  {x}")

print("第二次遍历：")
for x in it:  # 不会输出任何东西！
    print(f"  {x}")

# 2. 迭代器是惰性的（lazy）
# 它不会一次性生成所有元素
import sys

numbers = range(1000000)  # range 是惰性的
it = iter(numbers)
print(f"\nrange 迭代器内存占用：{sys.getsizeof(it)} bytes")
print(f"列表内存占用：{sys.getsizeof(list(numbers))} bytes")

# 3. 迭代器可以表示无限序列
# （通过生成器实现，后面会讲）

# 4. 迭代器是有状态的
it = iter([1, 2, 3, 4, 5])
next(it)  # 消耗 1
next(it)  # 消耗 2
remaining = list(it)  # 剩余元素
print(f"\n剩余元素：{remaining}")  # [3, 4, 5]
```

## 自定义迭代器类

```python
# 自定义迭代器类
print("=" * 60)
print("自定义迭代器类")
print("=" * 60)

class CountDown:
    """倒计时迭代器"""
    
    def __init__(self, start):
        self.start = start
        self.current = start
    
    def __iter__(self):
        """返回迭代器本身"""
        return self
    
    def __next__(self):
        """返回下一个值"""
        if self.current < 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

# 使用自定义迭代器
countdown = CountDown(5)
for num in countdown:
    print(f"  {num}")

# 可重复使用的迭代器（每次 iter() 调用返回新迭代器）
class ReusableRange:
    """可重复使用的范围迭代器"""
    
    def __init__(self, start, end):
        self.start = start
        self.end = end
    
    def __iter__(self):
        """返回一个新的迭代器"""
        return RangeIterator(self.start, self.end)

class RangeIterator:
    def __init__(self, start, end):
        self.current = start
        self.end = end
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

# 可重复使用
reusable = ReusableRange(0, 3)
print(f"\n第一次遍历：{list(reusable)}")
print(f"第二次遍历：{list(reusable)}")

# 实际应用：分页迭代器
class Paginator:
    """分页迭代器"""
    
    def __init__(self, items, page_size):
        self.items = items
        self.page_size = page_size
    
    def __iter__(self):
        return PageIterator(self.items, self.page_size)

class PageIterator:
    def __init__(self, items, page_size):
        self.items = items
        self.page_size = page_size
        self.current_page = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        start = self.current_page * self.page_size
        if start >= len(self.items):
            raise StopIteration
        end = start + self.page_size
        page = self.items[start:end]
        self.current_page += 1
        return page

# 分页演示
data = list(range(1, 26))
paginator = Paginator(data, 10)
print(f"\n分页结果：")
for i, page in enumerate(paginator, 1):
    print(f"  第 {i} 页：{page}")
```

## 生成器函数（yield）

生成器是创建迭代器的最简单方式。任何包含 `yield` 关键字的函数都是生成器函数。

```python
# 生成器函数
print("=" * 60)
print("生成器函数（yield）")
print("=" * 60)

# 最简单的生成器
def simple_generator():
    yield 1
    yield 2
    yield 3

gen = simple_generator()
print(f"类型：{type(gen)}")
print(f"是迭代器：{isinstance(gen, Iterator)}")

print(f"next(gen) = {next(gen)}")  # 1
print(f"next(gen) = {next(gen)}")  # 2
print(f"next(gen) = {next(gen)}")  # 3

# 生成器函数在 yield 处暂停，下次调用从暂停处继续
def count_up_to(n):
    """生成从 0 到 n-1 的数字"""
    print("生成器开始执行")
    for i in range(n):
        print(f"  yield {i}")
        yield i
        print(f"  yield 之后，i = {i}")
    print("生成器结束")

print("\n生成器执行过程：")
gen = count_up_to(3)
print("调用 next(gen)...")
val = next(gen)
print(f"收到：{val}")
print("调用 next(gen)...")
val = next(gen)
print(f"收到：{val}")
```

### 生成器的状态

```python
# 生成器的状态
print("=" * 60)
print("生成器的状态")
print("=" * 60)

def my_gen():
    print("开始")
    x = yield 1
    print(f"收到 x = {x}")
    y = yield 2
    print(f"收到 y = {y}")
    yield 3

gen = my_gen()

# 使用 send() 向生成器发送值
print("启动生成器...")
first = next(gen)  # 或 gen.send(None)
print(f"first = {first}")

print("\n发送 'hello'...")
second = gen.send("hello")
print(f"second = {second}")

print("\n发送 'world'...")
third = gen.send("world")
print(f"third = {third}")

# 生成器也可以抛出异常
def gen_with_exception():
    try:
        yield 1
        yield 2
    except ValueError:
        print("捕获到 ValueError")
    yield 3

gen = gen_with_exception()
print(f"\nnext(gen) = {next(gen)}")
print(f"gen.throw(ValueError) = {gen.throw(ValueError)}")
# gen.close()  # 关闭生成器
```

### yield from 语法

`yield from` 用于委托给另一个生成器，简化嵌套生成器的代码。

```python
# yield from 语法
print("=" * 60)
print("yield from 语法")
print("=" * 60)

# 没有 yield from 的写法
def flatten_old(nested):
    for sublist in nested:
        for item in sublist:
            yield item

# 使用 yield from 的写法
def flatten_new(nested):
    for sublist in nested:
        yield from sublist

nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
print(f"flatten_old: {list(flatten_old(nested))}")
print(f"flatten_new: {list(flatten_new(nested))}")

# yield from 的递归应用
def flatten_deep(nested):
    """递归展平任意深度的嵌套列表"""
    for item in nested:
        if isinstance(item, (list, tuple)):
            yield from flatten_deep(item)
        else:
            yield item

deep = [1, [2, [3, 4], 5], 6, [7, [8, [9]]]]
print(f"展平深层嵌套：{list(flatten_deep(deep))}")

# yield from 还建立了双向通道
def writer():
    while True:
        w = yield
        print(f">> {w}")

def writer_wrapper():
    yield from writer()

w = writer_wrapper()
next(w)  # 启动生成器
w.send("Hello")
w.send("World")
```

## 生成器表达式

```python
# 生成器表达式
print("=" * 60)
print("生成器表达式")
print("=" * 60)

# 语法：(expression for item in iterable)
# 类似于列表推导式，但使用圆括号

# 基本用法
gen = (x ** 2 for x in range(5))
print(f"生成器表达式：{list(gen)}")

# 内存对比
import sys

n = 1000000
list_comp = [x ** 2 for x in range(n)]
gen_expr = (x ** 2 for x in range(n))

print(f"\n内存对比（{n} 个元素）：")
print(f"  列表推导式：{sys.getsizeof(list_comp):,} bytes")
print(f"  生成器表达式：{sys.getsizeof(gen_expr):,} bytes")

# 生成器表达式可以传递给函数
total = sum(x ** 2 for x in range(1, 1000001))
print(f"\n1到1000000的平方和：{total}")

# 注意：传递给函数时，可以省略一层括号
# sum((x**2 for x in range(5)))  可写为
# sum(x**2 for x in range(5))
```

## 惰性求值的内存优势

```python
# 惰性求值的内存优势
print("=" * 60)
print("惰性求值的内存优势")
print("=" * 60)

import sys
import time

# 场景：处理大文件
def read_file_lines(file_path):
    """生成器方式读取文件（惰性）"""
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            yield line.strip()

# 模拟大文件处理
print("生成器处理大文件（模拟）：")
def process_large_data_generator(n):
    """使用生成器处理大数据"""
    for i in range(n):
        # 模拟处理
        yield i * 2

# 处理大数据
gen = process_large_data_generator(10_000_000)
print(f"生成器内存占用：{sys.getsizeof(gen)} bytes")

# 只取前10个结果
first_10 = []
for i, val in enumerate(gen):
    if i >= 10:
        break
    first_10.append(val)
print(f"前10个结果：{first_10}")

# 对比：列表方式
# list_data = [i * 2 for i in range(10_000_000)]  # 这会占用大量内存！
```

## 无限斐波那契序列

```python
# 无限斐波那契序列
print("=" * 60)
print("无限斐波那契序列")
print("=" * 60)

def fibonacci():
    """生成无限斐波那契序列"""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# 使用生成器
fib = fibonacci()

# 获取前10个
print("前10个斐波那契数：")
first_10 = []
for i in range(10):
    first_10.append(next(fib))
print(f"  {first_10}")

# 获取第20到第30个
print("第20-30个斐波那契数：")
fib = fibonacci()
for _ in range(20):
    next(fib)  # 跳过前20个
for i in range(10):
    print(f"  fib({20+i}) = {next(fib)}")

# 使用 islice 获取指定范围
from itertools import islice

print("\n使用 islice 获取第100-105个：")
for num in islice(fibonacci(), 100, 105):
    print(f"  {num}")

# 无限序列的实用函数
def take(n, iterable):
    """获取可迭代对象的前 n 个元素"""
    return list(islice(iterable, n))

print(f"\n前15个斐波那契数：{take(15, fibonacci())}")
```

## 综合实战：日志分析器

```python
# 综合实战：日志分析器
print("=" * 60)
print("综合实战：日志分析器")
print("=" * 60)

import re
from collections import Counter
from datetime import datetime


def parse_logs(log_lines):
    """
    生成器：解析日志行
    输入：日志行迭代器
    输出：解析后的日志字典
    """
    # 日志格式：2024-01-15 10:30:00 [LEVEL] message
    pattern = r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] (.+)'
    
    for line in log_lines:
        match = re.match(pattern, line.strip())
        if match:
            yield {
                "timestamp": match.group(1),
                "level": match.group(2),
                "message": match.group(3),
            }


def filter_by_level(logs, level):
    """生成器：按日志级别过滤"""
    for log in logs:
        if log["level"] == level:
            yield log


def filter_by_keyword(logs, keyword):
    """生成器：按关键词过滤"""
    for log in logs:
        if keyword.lower() in log["message"].lower():
            yield log


def count_by_level(logs):
    """统计各日志级别的数量"""
    return Counter(log["level"] for log in logs)


# 模拟日志数据
sample_logs = [
    "2024-01-15 10:00:01 [INFO] Server started on port 8080",
    "2024-01-15 10:00:05 [DEBUG] Loading configuration from config.json",
    "2024-01-15 10:00:10 [INFO] Database connection established",
    "2024-01-15 10:00:15 [WARN] Memory usage above 80%",
    "2024-01-15 10:00:20 [ERROR] Connection timeout for user alice",
    "2024-01-15 10:00:25 [INFO] User bob logged in",
    "2024-01-15 10:00:30 [DEBUG] Processing request #12345",
    "2024-01-15 10:00:35 [ERROR] Database query failed: timeout",
    "2024-01-15 10:00:40 [WARN] Disk space below 10%",
    "2024-01-15 10:00:45 [INFO] Scheduled backup completed",
    "2024-01-15 10:00:50 [ERROR] Authentication failed for user charlie",
    "2024-01-15 10:00:55 [INFO] User alice logged out",
    "2024-01-15 10:01:00 [DEBUG] Cache cleared successfully",
    "2024-01-15 10:01:05 [WARN] Response time above threshold: 2500ms",
    "2024-01-15 10:01:10 [INFO] Health check passed",
]

# 使用生成器管道处理日志
print("解析所有日志：")
parsed = parse_logs(sample_logs)
for log in parsed:
    print(f"  [{log['level']}] {log['timestamp']}: {log['message']}")

# 统计级别
parsed = parse_logs(sample_logs)
level_counts = count_by_level(parsed)
print(f"\n日志级别统计：")
for level, count in level_counts.most_common():
    print(f"  {level}: {count}")

# 过滤错误日志
parsed = parse_logs(sample_logs)
errors = filter_by_level(parsed, "ERROR")
print(f"\n错误日志：")
for log in errors:
    print(f"  {log['timestamp']}: {log['message']}")

# 搜索包含 "user" 的日志
parsed = parse_logs(sample_logs)
user_logs = filter_by_keyword(parsed, "user")
print(f"\n包含 'user' 的日志：")
for log in user_logs:
    print(f"  [{log['level']}] {log['message']}")

# 组合管道：错误日志 + 关键词
parsed = parse_logs(sample_logs)
errors = filter_by_level(parsed, "ERROR")
timeout_errors = filter_by_keyword(errors, "timeout")
print(f"\n超时错误：")
for log in timeout_errors:
    print(f"  {log['timestamp']}: {log['message']}")

# 内存效率：处理大型日志文件
print(f"\n生成器内存效率：")
import sys
parsed = parse_logs(sample_logs)
print(f"  解析器内存占用：{sys.getsizeof(parsed)} bytes")
print(f"  等效列表内存占用：{sys.getsizeof(list(parse_logs(sample_logs)))} bytes")
```

这个日志分析器完美展示了生成器的优势。每个处理步骤都是独立的生成器，它们可以像管道一样组合使用。最重要的是，整个处理过程是惰性的——数据只在需要时才被处理，不会一次性将所有中间结果加载到内存中。

## 总结

本文深入探讨了 Python 的迭代器和生成器机制：

**可迭代对象 vs 迭代器**：可迭代对象可以被 `for` 循环遍历，迭代器是实现了 `__iter__` 和 `__next__` 的对象。使用 `iter()` 获取迭代器，使用 `next()` 获取下一个元素。

**自定义迭代器**：实现 `__iter__` 和 `__next__` 方法。注意区分"一次性迭代器"和"可重用迭代器"。

**生成器函数**：使用 `yield` 关键字的函数。生成器在 `yield` 处暂停，保存状态，下次调用时继续。`yield from` 简化了嵌套生成器。

**生成器表达式**：`(expr for item in iterable)`，类似于列表推导式但返回生成器，节省内存。

**核心优势**：
- 惰性求值：只在需要时生成数据
- 内存效率：不需要一次性加载所有数据
- 无限序列：可以表示无限的数据流
- 管道组合：生成器可以像管道一样连接
- 代码简洁：`yield` 比手动实现迭代器简单得多

在下一篇文章中，我们将学习装饰器和上下文管理器——Python 中另外两个强大的高级特性。
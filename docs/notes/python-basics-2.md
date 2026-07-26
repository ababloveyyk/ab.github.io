---
title: Python基础速通Ⅱ——列表与元组
date: 2026-07-26
tags:
  - Python
  - 列表
  - 元组
  - 序列
  - 容器类型
categories:
  - Python
---

## 前言

在上一篇文章中，我们学习了 Python 的基本数据类型——整数、浮点数、布尔值、字符串和 NoneType。这些类型各自只能存储一个值，但在实际编程中，我们经常需要处理一组数据。例如，一个班级的所有学生姓名、一个购物车中的所有商品、一个月的所有温度记录。Python 提供了丰富的容器类型来应对这些需求，其中列表（list）和元组（tuple）是最基础也是最常用的两种序列类型。

列表和元组都属于序列类型，这意味着它们都支持索引、切片、迭代等操作。但它们有一个关键的区别：列表是可变的（mutable），你可以修改列表中的元素、添加新元素或删除元素；元组是不可变的（immutable），一旦创建就不能修改。这个区别看似简单，却在程序设计中有深远的影响——它决定了你何时使用列表，何时使用元组。

在实际开发中，列表的使用频率远高于元组，这是因为大多数情况下我们需要一个可以动态修改的容器。但元组的不可变性在某些场景下是一个优势：它可以作为字典的键（因为不可变对象是可哈希的），它可以确保数据不会被意外修改，它在内存使用和性能上通常比列表更优。

本文将深入探讨列表和元组的所有重要特性，包括创建、访问、切片、常用方法、高级技巧（如列表推导式、元组解包）以及性能考虑。我们还将介绍命名元组（namedtuple），它结合了元组的不可变性和类似于字典的可读性。

## 列表（list）的创建与基本操作

### 列表的创建

列表是 Python 中最常用的容器类型。它用方括号 `[]` 表示，可以包含任意类型的元素，甚至可以包含不同类型的元素混合。

```python
# 创建列表的多种方式

# 方式1：使用方括号直接创建
fruits = ["apple", "banana", "cherry"]
print(f"方式1：{fruits}")  # ['apple', 'banana', 'cherry']

# 方式2：使用 list() 构造函数
numbers = list(range(1, 6))  # 将 range 对象转换为列表
print(f"方式2：{numbers}")  # [1, 2, 3, 4, 5]

# 方式3：从字符串创建
chars = list("hello")
print(f"方式3：{chars}")  # ['h', 'e', 'l', 'l', 'o']

# 方式4：使用列表推导式（后面会详细介绍）
squares = [x ** 2 for x in range(1, 6)]
print(f"方式4：{squares}")  # [1, 4, 9, 16, 25]

# 方式5：创建空列表
empty_list1 = []
empty_list2 = list()
print(f"方式5：{empty_list1}, {empty_list2}")  # [], []

# 方式6：重复创建
zeros = [0] * 5
print(f"方式6：{zeros}")  # [0, 0, 0, 0, 0]

# 方式7：混合类型列表
mixed = [42, "hello", 3.14, True, None, [1, 2, 3]]
print(f"方式7：{mixed}")
# [42, 'hello', 3.14, True, None, [1, 2, 3]]
```

Python 列表的一个重要特性是它们可以包含任意类型的元素。上面的 `mixed` 列表包含了整数、字符串、浮点数、布尔值、None 甚至嵌套列表。这种灵活性是 Python 动态类型特性的体现。

但需要注意的是，在实际开发中，通常建议列表中的所有元素保持相同的类型。这样代码更容易理解和维护。混合类型列表虽然合法，但会使代码逻辑变得复杂。

### 列表的访问与索引

列表支持通过索引来访问单个元素。Python 使用从零开始的索引，并支持负索引（从末尾开始计数）。

```python
# 列表索引操作
colors = ["red", "green", "blue", "yellow", "purple", "orange"]

print("=" * 50)
print("列表索引演示")
print("=" * 50)
print(f"完整列表：{colors}")
print(f"列表长度：{len(colors)}")

# 正索引（从左到右，从0开始）
print(f"\n正索引：")
print(f"  colors[0] = {colors[0]}")   # red
print(f"  colors[1] = {colors[1]}")   # green
print(f"  colors[2] = {colors[2]}")   # blue
print(f"  colors[3] = {colors[3]}")   # yellow
print(f"  colors[4] = {colors[4]}")   # purple
print(f"  colors[5] = {colors[5]}")   # orange

# 负索引（从右到左，从-1开始）
print(f"\n负索引：")
print(f"  colors[-1] = {colors[-1]}")  # orange
print(f"  colors[-2] = {colors[-2]}")  # purple
print(f"  colors[-3] = {colors[-3]}")  # yellow
print(f"  colors[-6] = {colors[-6]}")  # red

# 索引越界会导致 IndexError
try:
    print(colors[100])
except IndexError as e:
    print(f"\n索引越界错误：{e}")

# 修改元素（列表是可变的）
colors[0] = "dark red"
print(f"\n修改后：{colors}")
# ['dark red', 'green', 'blue', 'yellow', 'purple', 'orange']
```

负索引是 Python 中非常便利的特性。`colors[-1]` 总是返回列表的最后一个元素，无论列表有多长。这在处理"获取最后几个元素"的场景中特别有用。

### 列表切片（Slicing）

切片是 Python 序列类型最强大的特性之一。它允许你通过 `[start:end:step]` 语法获取列表的一个子集。

```python
# 列表切片详解
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print("=" * 60)
print("列表切片详解")
print("=" * 60)
print(f"原始列表：{numbers}\n")

# 基本切片
print("基本切片：")
print(f"  numbers[2:5]   = {numbers[2:5]}")     # [2, 3, 4]    索引2到4
print(f"  numbers[:5]    = {numbers[:5]}")      # [0, 1, 2, 3, 4] 从开始到索引4
print(f"  numbers[5:]    = {numbers[5:]}")      # [5, 6, 7, 8, 9] 从索引5到结束
print(f"  numbers[:]     = {numbers[:]}")       # [0, 1, ..., 9]  完整拷贝
print(f"  numbers[-5:]   = {numbers[-5:]}")     # [5, 6, 7, 8, 9] 最后5个元素
print(f"  numbers[:-5]   = {numbers[:-5]}")     # [0, 1, 2, 3, 4] 除了最后5个

# 带步长的切片
print(f"\n带步长的切片：")
print(f"  numbers[::2]   = {numbers[::2]}")     # [0, 2, 4, 6, 8] 每隔一个
print(f"  numbers[::3]   = {numbers[::3]}")     # [0, 3, 6, 9]    每隔两个
print(f"  numbers[1::2]  = {numbers[1::2]}")    # [1, 3, 5, 7, 9] 从索引1开始，每隔一个

# 负步长（反向）
print(f"\n负步长切片（反向）：")
print(f"  numbers[::-1]  = {numbers[::-1]}")    # [9, 8, ..., 0]  反转列表
print(f"  numbers[::-2]  = {numbers[::-2]}")    # [9, 7, 5, 3, 1] 反向每隔一个
print(f"  numbers[5:2:-1]= {numbers[5:2:-1]}")  # [5, 4, 3]      从索引5到3（反向）

# 切片的高级用法
print(f"\n切片高级用法：")
# 替换子列表
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
nums[2:5] = [20, 30, 40]
print(f"  替换子列表 [2:5]：{nums}")  # [0, 1, 20, 30, 40, 5, 6, 7, 8, 9]

# 删除子列表
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
nums[2:5] = []
print(f"  删除子列表 [2:5]：{nums}")  # [0, 1, 5, 6, 7, 8, 9]

# 插入元素（步长不为1时，替换长度必须匹配）
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
nums[2:2] = [10, 11, 12]
print(f"  在索引2处插入：{nums}")  # [0, 1, 10, 11, 12, 2, 3, 4, 5, 6, 7, 8, 9]

# 切片创建浅拷贝
original = [1, [2, 3], 4]
copied = original[:]
print(f"\n  浅拷贝：original={original}, copied={copied}")
copied[1][0] = 99
print(f"  修改嵌套列表后：original={original}, copied={copied}")
# 注意：嵌套列表的修改影响了两个列表（浅拷贝特性）
```

切片操作返回一个新的列表，但需要注意的是，切片创建的是浅拷贝（shallow copy）。如果列表中包含嵌套的可变对象（如嵌套列表），修改嵌套对象会影响原始列表和拷贝列表。如果需要完全独立的拷贝，应该使用 `copy.deepcopy()`。

```python
import copy

# 深拷贝演示
original = [1, [2, 3], 4]
deep_copied = copy.deepcopy(original)
deep_copied[1][0] = 99
print(f"深拷贝：original={original}, deep_copied={deep_copied}")
# [1, [2, 3], 4] 和 [1, [99, 3], 4] —— 互不影响
```

## 列表常用方法

列表提供了丰富的内置方法，用于添加、删除、查找和排序元素。掌握这些方法是高效使用列表的关键。

### 添加元素的方法

```python
# 列表添加元素的方法
print("=" * 60)
print("列表添加元素")
print("=" * 60)

# append()：在末尾添加一个元素
fruits = ["apple", "banana"]
fruits.append("cherry")
print(f"append('cherry') 后：{fruits}")
# ['apple', 'banana', 'cherry']

# append 添加列表（作为单个元素）
fruits.append(["date", "elderberry"])
print(f"append 列表后：{fruits}")
# ['apple', 'banana', 'cherry', ['date', 'elderberry']]
# 注意：整个列表被作为一个元素添加

# extend()：将可迭代对象的所有元素添加到末尾
fruits = ["apple", "banana", "cherry"]
fruits.extend(["date", "elderberry"])
print(f"extend 后：{fruits}")
# ['apple', 'banana', 'cherry', 'date', 'elderberry']

# extend 可以接受任何可迭代对象
fruits = ["apple", "banana"]
fruits.extend(("cherry", "date"))      # 元组
fruits.extend("XY")                     # 字符串（可迭代，每个字符作为元素）
print(f"extend 多种可迭代对象后：{fruits}")
# ['apple', 'banana', 'cherry', 'date', 'X', 'Y']

# insert()：在指定位置插入元素
fruits = ["apple", "banana", "cherry"]
fruits.insert(1, "orange")  # 在索引1处插入
print(f"insert(1, 'orange') 后：{fruits}")
# ['apple', 'orange', 'banana', 'cherry']

fruits.insert(0, "first")   # 在开头插入
print(f"insert(0, 'first') 后：{fruits}")

fruits.insert(len(fruits), "last")  # 在末尾插入（等同于 append）
print(f"insert(len, 'last') 后：{fruits}")

# + 运算符：拼接列表（创建新列表）
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2
print(f"list1 + list2 = {combined}")  # [1, 2, 3, 4, 5, 6]
print(f"list1 不变：{list1}")          # [1, 2, 3]

# += 运算符：原地扩展（修改原列表）
list1 += [7, 8]
print(f"list1 += [7, 8] = {list1}")  # [1, 2, 3, 7, 8]

# 性能对比：构建大列表
import time

def build_with_append(n):
    result = []
    for i in range(n):
        result.append(i)
    return result

def build_with_plus(n):
    result = []
    for i in range(n):
        result = result + [i]  # 每次都创建新列表！
    return result

# 测试（较小规模）
n = 10000
start = time.time()
build_with_append(n)
print(f"append 方式耗时：{time.time() - start:.4f} 秒")

start = time.time()
build_with_plus(n)
print(f"+ 运算符方式耗时：{time.time() - start:.4f} 秒")
```

`append()` 和 `extend()` 的区别是初学者最容易混淆的地方。`append()` 将参数作为一个整体添加到列表末尾，而 `extend()` 将参数中的每个元素逐个添加。这个区别在添加列表时尤其明显。

性能方面，`append()` 的时间复杂度是 O(1)（均摊），而使用 `+` 运算符每次都会创建新列表，时间复杂度是 O(n)，在大量数据下性能差距显著。

### 删除元素的方法

```python
# 列表删除元素的方法
print("=" * 60)
print("列表删除元素")
print("=" * 60)

numbers = [1, 2, 3, 4, 5, 3, 6, 7]

# remove()：删除第一个匹配的值
numbers.remove(3)  # 删除第一个值为3的元素
print(f"remove(3) 后：{numbers}")
# [1, 2, 4, 5, 3, 6, 7]

# 删除不存在的值会引发 ValueError
try:
    numbers.remove(99)
except ValueError as e:
    print(f"remove(99) 错误：{e}")

# pop()：删除并返回指定索引的元素（默认删除最后一个）
numbers = [1, 2, 3, 4, 5]
popped = numbers.pop()
print(f"pop() 返回 {popped}，列表变为：{numbers}")
# pop() 返回 5，列表变为：[1, 2, 3, 4]

popped = numbers.pop(1)  # 删除索引1的元素
print(f"pop(1) 返回 {popped}，列表变为：{numbers}")
# pop(1) 返回 2，列表变为：[1, 3, 4]

# pop() 在空列表上会引发 IndexError
empty = []
try:
    empty.pop()
except IndexError as e:
    print(f"空列表 pop() 错误：{e}")

# del 语句：删除指定索引的元素或切片
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
del numbers[0]         # 删除索引0的元素
print(f"del numbers[0] 后：{numbers}")

del numbers[1:3]       # 删除索引1到2的元素
print(f"del numbers[1:3] 后：{numbers}")

del numbers[::2]       # 删除所有偶数索引位置
print(f"del numbers[::2] 后：{numbers}")

# del 甚至可以删除整个变量
temp = [1, 2, 3]
del temp
# print(temp)  # NameError: name 'temp' is not defined

# clear()：清空列表
numbers = [1, 2, 3, 4, 5]
numbers.clear()
print(f"clear() 后：{numbers}")  # []

# 在循环中删除元素的正确方式
print("\n循环中删除元素的正确方式：")
items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 错误方式（会导致跳过元素）
def wrong_remove():
    nums = items.copy()
    for i in range(len(nums)):
        if nums[i] % 2 == 0:
            del nums[i]
    return nums

# 正确方式1：使用列表推导式
correct1 = [x for x in items if x % 2 != 0]
print(f"  列表推导式：{correct1}")

# 正确方式2：从后往前遍历
correct2 = items.copy()
for i in range(len(correct2) - 1, -1, -1):
    if correct2[i] % 2 == 0:
        del correct2[i]
print(f"  从后往前：{correct2}")

# 正确方式3：使用 filter
correct3 = list(filter(lambda x: x % 2 != 0, items))
print(f"  filter：{correct3}")

# 技巧：使用 pop() 实现栈（后进先出）
stack = []
stack.append(1)  # 压栈
stack.append(2)
stack.append(3)
print(f"\n栈：{stack}")
print(f"弹出：{stack.pop()}")  # 3
print(f"弹出：{stack.pop()}")  # 2
print(f"弹出：{stack.pop()}")  # 1

# 技巧：使用 pop(0) 或 collections.deque 实现队列（先进先出）
from collections import deque

queue = deque()
queue.append(1)
queue.append(2)
queue.append(3)
print(f"\n队列：{list(queue)}")
print(f"出队：{queue.popleft()}")  # 1
print(f"出队：{queue.popleft()}")  # 2
print(f"出队：{queue.popleft()}")  # 3
```

在循环中删除列表元素是一个常见的陷阱。当你在正向遍历时删除元素，后续元素的索引会改变，导致某些元素被跳过。正确的做法是使用列表推导式、从后往前遍历，或者使用 `filter()` 函数。

### 查找与排序方法

```python
# 查找与排序方法
print("=" * 60)
print("列表查找与排序")
print("=" * 60)

numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

# index()：查找元素的索引（第一个匹配）
print(f"原列表：{numbers}")
print(f"index(5) = {numbers.index(5)}")       # 4（第一个5的位置）
print(f"index(5, 5) = {numbers.index(5, 5)}")  # 8（从索引5开始搜索）
print(f"index(5, 5, 10) = {numbers.index(5, 5, 10)}")  # 8（在[5:10]范围内搜索）

# 查找不存在的元素会引发 ValueError
try:
    numbers.index(99)
except ValueError as e:
    print(f"index(99) 错误：{e}")

# count()：统计元素出现次数
print(f"count(5) = {numbers.count(5)}")  # 3
print(f"count(1) = {numbers.count(1)}")  # 2
print(f"count(99) = {numbers.count(99)}")  # 0

# sort()：原地排序（修改原列表）
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
numbers.sort()
print(f"sort() 后：{numbers}")  # [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]

# sort(reverse=True)：降序排序
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
numbers.sort(reverse=True)
print(f"sort(reverse=True) 后：{numbers}")  # [9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1]

# sort(key=...)：自定义排序规则
fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"]
fruits.sort(key=len)  # 按长度排序
print(f"按长度排序：{fruits}")
# ['fig', 'date', 'apple', 'banana', 'cherry', 'elderberry']

fruits.sort(key=lambda x: x[-1])  # 按最后一个字母排序
print(f"按最后一个字母排序：{fruits}")

# sort() 只能用于同类型元素的列表
# 混合类型列表排序会引发 TypeError
try:
    [1, "two", 3].sort()
except TypeError as e:
    print(f"混合类型排序错误：{e}")

# sorted()：返回新排序列表（不修改原列表）
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
sorted_numbers = sorted(numbers)
print(f"sorted() 返回：{sorted_numbers}")
print(f"原列表不变：{numbers}")

# reverse()：原地反转
numbers = [1, 2, 3, 4, 5]
numbers.reverse()
print(f"reverse() 后：{numbers}")  # [5, 4, 3, 2, 1]

# reversed()：返回反转迭代器（不修改原列表）
numbers = [1, 2, 3, 4, 5]
rev = reversed(numbers)
print(f"reversed() 返回：{list(rev)}")  # [5, 4, 3, 2, 1]
print(f"原列表不变：{numbers}")          # [1, 2, 3, 4, 5]

# 高级排序：多级排序
students = [
    ("Alice", 90, 18),
    ("Bob", 85, 19),
    ("Charlie", 90, 17),
    ("David", 85, 18),
    ("Eve", 95, 19),
]

# 先按成绩降序，成绩相同按年龄升序
students.sort(key=lambda x: (-x[1], x[2]))
print(f"\n多级排序结果：")
for name, score, age in students:
    print(f"  {name}: 成绩={score}, 年龄={age}")
```

`sort()` 和 `sorted()` 都支持 `key` 参数，这是一个非常强大的特性。`key` 参数接受一个函数，该函数接受一个元素并返回一个用于排序比较的值。`lambda` 表达式在这里非常有用。

需要注意的是，`sort()` 是列表方法，原地修改列表并返回 `None`；`sorted()` 是内置函数，接受任何可迭代对象，返回一个新的排序列表。

## 列表推导式初步

列表推导式（List Comprehension）是 Python 中最具特色的语法之一。它提供了一种简洁的方式来创建列表，通常比传统的 for 循环更优雅、更高效。

```python
# 列表推导式基础
print("=" * 60)
print("列表推导式")
print("=" * 60)

# 基本语法：[expression for item in iterable]

# 创建平方数列表
squares = [x ** 2 for x in range(1, 11)]
print(f"平方数：{squares}")
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# 带条件的列表推导式：[expression for item in iterable if condition]
even_squares = [x ** 2 for x in range(1, 11) if x % 2 == 0]
print(f"偶数的平方：{even_squares}")
# [4, 16, 36, 64, 100]

# 带 if-else 的列表推导式
labels = ["偶数" if x % 2 == 0 else "奇数" for x in range(1, 11)]
print(f"奇偶标签：{labels}")
# ['奇数', '偶数', '奇数', '偶数', '奇数', '偶数', '奇数', '偶数', '奇数', '偶数']

# 嵌套列表推导式
# 展平二维列表
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(f"展平矩阵：{flattened}")
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 创建乘法表
multiplication_table = [[i * j for j in range(1, 10)] for i in range(1, 10)]
print(f"乘法表（前3行）：")
for row in multiplication_table[:3]:
    print(f"  {row}")

# 列表推导式 vs 传统 for 循环
# 传统方式
result1 = []
for x in range(10):
    if x % 2 == 0:
        result1.append(x ** 2)

# 列表推导式
result2 = [x ** 2 for x in range(10) if x % 2 == 0]

print(f"\n传统方式：{result1}")
print(f"列表推导式：{result2}")
print(f"结果相同：{result1 == result2}")

# 列表推导式的性能
import time

def traditional():
    result = []
    for i in range(100000):
        if i % 2 == 0:
            result.append(i ** 2)
    return result

def comprehension():
    return [i ** 2 for i in range(100000) if i % 2 == 0]

start = time.time()
traditional()
print(f"传统方式耗时：{time.time() - start:.4f} 秒")

start = time.time()
comprehension()
print(f"列表推导式耗时：{time.time() - start:.4f} 秒")

# 实际应用：数据清洗
raw_data = ["  Alice  ", "BOB", "  charlie  ", "  ", "DAVID", None]
cleaned = [name.strip().title() for name in raw_data 
           if name is not None and name.strip()]
print(f"\n数据清洗前：{raw_data}")
print(f"数据清洗后：{cleaned}")
# ['Alice', 'Bob', 'Charlie', 'David']
```

列表推导式不仅代码更简洁，而且通常性能更好。这是因为列表推导式在 C 层面执行，避免了 Python 层面的循环开销和 `append()` 方法调用。在处理大量数据时，性能差异可能非常明显。

但也要注意，列表推导式不应该过于复杂。如果逻辑变得难以理解（比如三层嵌套），就应该考虑使用传统的 for 循环来保持代码可读性。

## 元组（tuple）的定义与特性

### 元组的创建

元组用圆括号 `()` 表示，内部元素用逗号分隔。与列表不同，元组是不可变的——一旦创建，就不能修改其内容。

```python
# 元组的创建
print("=" * 60)
print("元组的创建与基本操作")
print("=" * 60)

# 方式1：使用圆括号
point = (3, 4)
print(f"坐标点：{point}")

# 方式2：不使用圆括号（逗号是关键）
coordinates = 10, 20, 30
print(f"坐标：{coordinates}")  # (10, 20, 30)

# 方式3：使用 tuple() 构造函数
from_list = tuple([1, 2, 3])
print(f"从列表创建：{from_list}")  # (1, 2, 3)

from_string = tuple("hello")
print(f"从字符串创建：{from_string}")  # ('h', 'e', 'l', 'l', 'o')

# 特别注意：创建单元素元组
# 错误方式：这不是元组，而是带括号的整数
not_a_tuple = (42)
print(f"not_a_tuple = {not_a_tuple}, type = {type(not_a_tuple)}")
# 42, <class 'int'>

# 正确方式：需要加逗号
single_element_tuple = (42,)
print(f"single_element_tuple = {single_element_tuple}, type = {type(single_element_tuple)}")
# (42,), <class 'tuple'>

# 也可以不加括号
also_tuple = 42,
print(f"also_tuple = {also_tuple}, type = {type(also_tuple)}")
# (42,), <class 'tuple'>

# 空元组
empty_tuple = ()
print(f"empty_tuple = {empty_tuple}, type = {type(empty_tuple)}")
# (), <class 'tuple'>
```

创建单元素元组时，逗号是必需的。`(42)` 只是一个带括号的整数表达式，而 `(42,)` 才是一个包含一个元素的元组。这是 Python 初学者常犯的错误。

### 元组的不可变性

元组的不可变性是其最重要的特性。让我们通过代码来理解这意味着什么。

```python
# 元组的不可变性
print("=" * 60)
print("元组的不可变性")
print("=" * 60)

t = (1, 2, 3, 4, 5)

# 可以访问
print(f"t[0] = {t[0]}")  # 1
print(f"t[-1] = {t[-1]}")  # 5
print(f"t[1:4] = {t[1:4]}")  # (2, 3, 4)

# 但不可修改
try:
    t[0] = 10
except TypeError as e:
    print(f"修改元组元素：{e}")
    # 'tuple' object does not support item assignment

# 不可删除元素
try:
    del t[0]
except TypeError as e:
    print(f"删除元组元素：{e}")

# 不可添加元素
try:
    t.append(6)
except AttributeError as e:
    print(f"append 元组：{e}")

# 但是，元组中的可变元素可以被修改
nested = (1, [2, 3], 4)
print(f"\n修改前：{nested}")
nested[1][0] = 99  # 修改元组中的列表
print(f"修改后：{nested}")  # (1, [99, 3], 4)
# 元组本身没变，但元组中的列表变了

# 元组的"不可变性"只适用于元组本身的引用
# 如果元组包含可变对象，这些对象的内容可以修改
```

元组的不可变性带来了一些重要的优势：

1. **安全性**：数据不会被意外修改
2. **可哈希**：元组可以作为字典的键（如果所有元素都是可哈希的）
3. **性能**：Python 可以对元组进行优化，因为它的结构不会改变
4. **语义清晰**：使用元组表示一组固定的值

```python
# 元组作为字典键
locations = {
    (40.7128, -74.0060): "New York",
    (34.0522, -118.2437): "Los Angeles",
    (51.5074, -0.1278): "London",
}

print(f"New York 的坐标：{(40.7128, -74.0060)}")
print(f"该坐标对应的城市：{locations[(40.7128, -74.0060)]}")

# 列表不能作为字典键（因为列表是可变的、不可哈希的）
try:
    d = {[1, 2]: "value"}
except TypeError as e:
    print(f"列表作为字典键：{e}")
```

### 元组的方法

元组只有两个内置方法，这是因为元组不可变，不需要添加、删除等方法。

```python
# 元组的方法
t = (1, 2, 3, 2, 4, 2, 5)

# count()：统计元素出现次数
print(f"t.count(2) = {t.count(2)}")  # 3

# index()：查找元素的索引（第一个匹配）
print(f"t.index(3) = {t.index(3)}")  # 2
print(f"t.index(2, 2) = {t.index(2, 2)}")  # 3（从索引2开始搜索）

# 元组也支持 len()、in、迭代等操作
print(f"len(t) = {len(t)}")  # 7
print(f"2 in t = {2 in t}")  # True
print(f"max(t) = {max(t)}")  # 5
print(f"min(t) = {min(t)}")  # 1
print(f"sum(t) = {sum(t)}")  # 19
```

## 元组解包（Unpacking）

元组解包是 Python 中最优雅的特性之一。它允许你将元组（或任何可迭代对象）中的值一次性赋值给多个变量。

```python
# 元组解包（Tuple Unpacking）
print("=" * 60)
print("元组解包")
print("=" * 60)

# 基本解包
point = (3, 4)
x, y = point
print(f"解包后：x = {x}, y = {y}")

# 交换变量（无需临时变量）
a, b = 10, 20
print(f"交换前：a = {a}, b = {b}")
a, b = b, a
print(f"交换后：a = {a}, b = {b}")
# 这个操作实际上是：创建元组(b, a)，然后解包

# 多变量解包
name, age, city = ("Alice", 25, "New York")
print(f"name = {name}, age = {age}, city = {city}")

# 使用 * 捕获剩余元素
first, second, *rest = (1, 2, 3, 4, 5)
print(f"first = {first}, second = {second}, rest = {rest}")
# first = 1, second = 2, rest = [3, 4, 5]

first, *middle, last = (1, 2, 3, 4, 5)
print(f"first = {first}, middle = {middle}, last = {last}")
# first = 1, middle = [2, 3, 4], last = 5

*head, last = (1, 2, 3, 4, 5)
print(f"head = {head}, last = {last}")
# head = [1, 2, 3, 4], last = 5

# 使用下划线丢弃不需要的值
data = ("Alice", 25, "Engineer", "New York", "12345")
name, age, *_ = data
print(f"name = {name}, age = {age}")

# 解包嵌套结构
nested = (1, (2, 3), 4)
a, (b, c), d = nested
print(f"a = {a}, b = {b}, c = {c}, d = {d}")

# 在函数中使用解包
def get_user_info():
    return ("Bob", 30, "Developer")

name, age, job = get_user_info()
print(f"函数返回解包：{name}, {age}, {job}")

# 枚举解包
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits):
    print(f"  [{i}] {fruit}")

# zip 解包
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"  {name} is {age} years old")

# 解包的应用：并行赋值
# 这是一个在 Python 中非常常见的模式
x, y, z = 1, 2, 3
print(f"x = {x}, y = {y}, z = {z}")

# 解包的应用：同时遍历多个列表
questions = ["name", "quest", "favorite color"]
answers = ["Lancelot", "the holy grail", "blue"]
for q, a in zip(questions, answers):
    print(f"What is your {q}? It is {a}.")
```

星号解包（`*rest`）是 Python 3 中引入的特性，非常强大。它允许你捕获任意数量的元素到一个列表中。这在处理不确定长度的序列时特别有用。

## 命名元组（namedtuple）

标准元组通过索引访问元素，这在元素较多时不够直观。`collections.namedtuple` 提供了解决方案：它创建具有命名字段的元组子类。

```python
# namedtuple（命名元组）
print("=" * 60)
print("命名元组（namedtuple）")
print("=" * 60)

from collections import namedtuple

# 创建命名元组类型
# 方式1：使用字符串列表
Point = namedtuple("Point", ["x", "y"])

# 方式2：使用空格分隔的字符串
# Point = namedtuple("Point", "x y")

# 方式3：使用逗号分隔的字符串
# Point = namedtuple("Point", "x, y")

# 创建命名元组实例
p1 = Point(3, 4)
p2 = Point(x=5, y=6)

print(f"p1 = {p1}")
print(f"p2 = {p2}")

# 通过名称访问字段
print(f"p1.x = {p1.x}, p1.y = {p1.y}")

# 通过索引访问（与普通元组兼容）
print(f"p1[0] = {p1[0]}, p1[1] = {p1[1]}")

# 解包
x, y = p1
print(f"解包：x = {x}, y = {y}")

# 命名元组是不可变的
try:
    p1.x = 10
except AttributeError as e:
    print(f"修改命名元组字段：{e}")

# 实际应用：表示学生信息
Student = namedtuple("Student", ["name", "age", "grade", "major"])

students = [
    Student("Alice", 20, "A", "Computer Science"),
    Student("Bob", 21, "B+", "Mathematics"),
    Student("Charlie", 19, "A-", "Physics"),
    Student("David", 22, "B", "Engineering"),
]

# 按成绩排序
students_sorted = sorted(students, key=lambda s: s.grade)
print(f"\n按成绩排序的学生：")
for s in students_sorted:
    print(f"  {s.name}: {s.grade} ({s.major})")

# 命名元组的方法
print(f"\nStudent 的字段：{Student._fields}")
# ('name', 'age', 'grade', 'major')

# _make()：从可迭代对象创建实例
data = ["Eve", 20, "A+", "Biology"]
eve = Student._make(data)
print(f"_make() 创建：{eve}")

# _asdict()：转换为 OrderedDict
print(f"_asdict()：{eve._asdict()}")

# _replace()：创建替换了某些字段的新实例
eve_updated = eve._replace(grade="A++")
print(f"_replace()：{eve_updated}")
print(f"原实例不变：{eve}")

# 带默认值的命名元组（Python 3.7+）
# defaults 参数从右向左应用
Person = namedtuple("Person", ["name", "age", "city"], defaults=["Unknown", 0])
p = Person("Alice")
print(f"\n带默认值：{p}")  # Person(name='Alice', age=0, city='Unknown')

# 实际应用：配置选项
Config = namedtuple("Config", [
    "host", "port", "debug", "timeout", "max_connections"
], defaults=["localhost", 8080, False, 30, 100])

default_config = Config()
print(f"\n默认配置：{default_config}")

custom_config = Config(host="0.0.0.0", port=9000, debug=True)
print(f"自定义配置：{custom_config}")

# namedtuple 的内存效率
print(f"\n内存对比：")
import sys

# 普通类
class RegularPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

regular = RegularPoint(3, 4)
named = Point(3, 4)
plain_tuple = (3, 4)

print(f"  普通类: {sys.getsizeof(regular)} bytes")
print(f"  namedtuple: {sys.getsizeof(named)} bytes")
print(f"  普通元组: {sys.getsizeof(plain_tuple)} bytes")
```

命名元组结合了元组的不可变性和类似于对象的属性访问。它在以下场景中特别有用：

- 从数据库查询返回记录
- 表示坐标、颜色、配置等小型数据结构
- 替代简单的类，避免定义 `__init__` 方法
- 提高代码可读性（用 `.name` 而不是 `[0]`）

## 列表与元组的性能对比

```python
# 列表与元组性能对比
print("=" * 60)
print("列表与元组性能对比")
print("=" * 60)

import time
import sys

# 内存占用对比
list_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
tuple_data = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

print(f"列表内存占用：{sys.getsizeof(list_data)} bytes")
print(f"元组内存占用：{sys.getsizeof(tuple_data)} bytes")
print(f"元组节省：{sys.getsizeof(list_data) - sys.getsizeof(tuple_data)} bytes")

# 创建速度对比
n = 10_000_000

def create_list():
    return [i for i in range(n)]

def create_tuple():
    return tuple(i for i in range(n))

start = time.time()
create_list()
print(f"\n创建列表耗时：{time.time() - start:.4f} 秒")

start = time.time()
create_tuple()
print(f"创建元组耗时：{time.time() - start:.4f} 秒")

# 访问速度对比
lst = list(range(n))
tup = tuple(range(n))

start = time.time()
for i in range(n):
    _ = lst[i]
print(f"列表访问耗时：{time.time() - start:.4f} 秒")

start = time.time()
for i in range(n):
    _ = tup[i]
print(f"元组访问耗时：{time.time() - start:.4f} 秒")

# 复制速度对比
start = time.time()
lst_copy = lst[:]
print(f"列表复制耗时：{time.time() - start:.4f} 秒")

start = time.time()
tup_copy = tup[:]
print(f"元组复制耗时：{time.time() - start:.4f} 秒")
# 元组复制实际上返回同一个对象（因为不可变）
print(f"元组复制后是同一个对象吗？{tup is tup_copy}")  # True
```

从性能对比可以看出，元组在内存占用、创建速度和复制速度方面都优于列表。这是因为元组的不可变性允许 Python 对其进行优化。例如，当"复制"一个元组时，Python 实际上返回同一个对象，因为不可变对象不需要复制。

## 综合实战：学生成绩管理系统

让我们将本章学到的列表和元组知识应用到实际项目中——构建一个学生成绩管理系统。

```python
"""
学生成绩管理系统
使用列表和元组管理学生成绩数据
"""

from collections import namedtuple
import statistics

# 定义命名元组
Student = namedtuple("Student", ["id", "name", "age", "major"])
Grade = namedtuple("Grade", ["student_id", "course", "score", "semester"])

class GradeManager:
    """学生成绩管理系统"""
    
    def __init__(self):
        self.students = []  # 存储 Student 命名元组
        self.grades = []    # 存储 Grade 命名元组
    
    def add_student(self, student_id, name, age, major):
        """添加学生"""
        student = Student(student_id, name, age, major)
        self.students.append(student)
        print(f"添加学生：{student.name} (ID: {student.student_id})")
        return student
    
    def add_grade(self, student_id, course, score, semester):
        """添加成绩"""
        # 检查学生是否存在
        if not any(s.id == student_id for s in self.students):
            print(f"错误：学生 ID {student_id} 不存在")
            return None
        
        if not (0 <= score <= 100):
            print(f"错误：成绩 {score} 不在有效范围（0-100）")
            return None
        
        grade = Grade(student_id, course, score, semester)
        self.grades.append(grade)
        print(f"添加成绩：{course} - {score} 分")
        return grade
    
    def get_student_grades(self, student_id):
        """获取某个学生的所有成绩"""
        return [g for g in self.grades if g.student_id == student_id]
    
    def get_student_average(self, student_id):
        """获取某个学生的平均成绩"""
        student_grades = self.get_student_grades(student_id)
        if not student_grades:
            return 0.0
        return statistics.mean(g.score for g in student_grades)
    
    def get_course_statistics(self, course):
        """获取某门课程的成绩统计"""
        course_grades = [g for g in self.grades if g.course == course]
        if not course_grades:
            return None
        
        scores = [g.score for g in course_grades]
        return {
            "course": course,
            "count": len(scores),
            "average": statistics.mean(scores),
            "median": statistics.median(scores),
            "max": max(scores),
            "min": min(scores),
            "stdev": statistics.stdev(scores) if len(scores) > 1 else 0,
        }
    
    def get_top_students(self, n=3):
        """获取平均成绩最高的 n 个学生"""
        student_averages = []
        for student in self.students:
            avg = self.get_student_average(student.id)
            student_averages.append((student, avg))
        
        # 按平均成绩降序排序
        student_averages.sort(key=lambda x: x[1], reverse=True)
        return student_averages[:n]
    
    def get_grade_distribution(self):
        """获取成绩分布"""
        distribution = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
        for grade in self.grades:
            score = grade.score
            if score >= 90:
                distribution["A"] += 1
            elif score >= 80:
                distribution["B"] += 1
            elif score >= 70:
                distribution["C"] += 1
            elif score >= 60:
                distribution["D"] += 1
            else:
                distribution["F"] += 1
        return distribution
    
    def print_report(self):
        """打印完整报告"""
        print("\n" + "=" * 60)
        print("              学生成绩管理系统报告")
        print("=" * 60)
        
        # 基本信息
        print(f"\n基本信息：")
        print(f"  学生总数：{len(self.students)}")
        print(f"  成绩记录总数：{len(self.grades)}")
        
        # 学生列表
        print(f"\n学生列表：")
        for s in self.students:
            avg = self.get_student_average(s.id)
            print(f"  [{s.id}] {s.name} - {s.major} (平均分: {avg:.1f})")
        
        # 成绩分布
        print(f"\n成绩分布：")
        dist = self.get_grade_distribution()
        total = sum(dist.values())
        for grade, count in dist.items():
            percentage = (count / total * 100) if total > 0 else 0
            bar = "█" * int(percentage / 2)
            print(f"  {grade}: {count:3d} ({percentage:5.1f}%) {bar}")
        
        # 优等生
        print(f"\n成绩排名 TOP 3：")
        top = self.get_top_students(3)
        for i, (student, avg) in enumerate(top, 1):
            print(f"  {i}. {student.name} - 平均分: {avg:.1f}")
        
        # 课程统计
        courses = set(g.course for g in self.grades)
        print(f"\n各课程统计：")
        for course in sorted(courses):
            stats = self.get_course_statistics(course)
            print(f"  {course}:")
            print(f"    平均分: {stats['average']:.1f}, "
                  f"最高分: {stats['max']}, "
                  f"最低分: {stats['min']}, "
                  f"标准差: {stats['stdev']:.2f}")
        
        print("=" * 60)


# 运行演示
if __name__ == "__main__":
    manager = GradeManager()
    
    # 添加学生
    manager.add_student("S001", "Alice", 20, "Computer Science")
    manager.add_student("S002", "Bob", 21, "Mathematics")
    manager.add_student("S003", "Charlie", 19, "Physics")
    manager.add_student("S004", "David", 22, "Engineering")
    manager.add_student("S005", "Eve", 20, "Biology")
    
    # 添加成绩
    courses = ["Python", "Math", "Physics", "English"]
    import random
    random.seed(42)  # 固定随机种子，确保结果可复现
    
    for student_id in ["S001", "S002", "S003", "S004", "S005"]:
        for course in courses:
            score = random.randint(55, 100)
            manager.add_grade(student_id, course, score, "2024-Spring")
    
    # 打印报告
    manager.print_report()
    
    # 演示元组高级操作
    print("\n" + "=" * 60)
    print("元组高级操作演示")
    print("=" * 60)
    
    # 查看 Alice 的成绩
    alice_grades = manager.get_student_grades("S001")
    print(f"\nAlice 的成绩记录：")
    for g in alice_grades:
        print(f"  {g.course}: {g.score} 分 ({g.semester})")
    
    # 使用列表推导式查找所有 Python 课程的成绩
    python_grades = [g for g in manager.grades if g.course == "Python"]
    print(f"\nPython 课程成绩：")
    for g in python_grades:
        student = next(s for s in manager.students if s.id == g.student_id)
        print(f"  {student.name}: {g.score} 分")
    
    # 使用解包
    for student, avg in manager.get_top_students():
        print(f"  {student.name}: {avg:.1f} (Major: {student.major})")
```

这个综合练习涵盖了本章的核心知识点：

1. **列表**：用于存储学生和成绩数据，支持增删改查操作
2. **元组**：作为函数返回多个值（如 `get_top_students` 返回 `(student, avg)` 元组列表）
3. **命名元组**：`Student` 和 `Grade` 使用 namedtuple，提供清晰的字段访问
4. **列表推导式**：用于过滤和转换数据（如 `[g for g in self.grades if g.student_id == student_id]`）
5. **解包**：`for student, avg in ...` 直接解包遍历
6. **排序**：`sort(key=lambda x: x[1], reverse=True)` 自定义排序
7. **切片**：`[:3]` 获取前三个元素

## 总结

本文深入探讨了 Python 中两个最基础的序列类型——列表和元组。让我们回顾一下核心要点：

**列表（list）**是 Python 中最常用的容器类型，具有以下特点：
- 可变：可以添加、删除、修改元素
- 支持丰富的内置方法：`append()`、`extend()`、`insert()`、`remove()`、`pop()`、`sort()`、`reverse()` 等
- 支持索引和切片操作
- 列表推导式提供了一种简洁高效的创建方式
- 适用于需要动态操作数据的场景

**元组（tuple）**是不可变的序列类型，具有以下特点：
- 不可变：创建后内容不能修改
- 内存占用更小，访问速度更快
- 可哈希：可以作为字典的键
- 支持解包（unpacking），代码更优雅
- 命名元组（namedtuple）结合了元组的性能和对象的可读性

**选择列表还是元组？**
- 如果数据需要修改，使用列表
- 如果数据是固定的（如坐标、配置），使用元组
- 如果需要作为字典的键，必须使用元组
- 如果需要高性能和低内存占用，优先考虑元组
- 如果希望代码更清晰地表达"这些数据在一起很紧密"，使用元组解包

**关键技巧总结：**
- 列表推导式：`[x for x in data if condition]` 比传统循环更简洁高效
- 元组解包：`a, b, *rest = data` 优雅处理多值
- 命名元组：`namedtuple("Name", ["field1", "field2"])` 提高可读性
- 切片：`data[start:end:step]` 灵活获取子序列
- 排序：`data.sort(key=func)` 实现自定义排序逻辑

在下一篇文章中，我们将学习 Python 中另外两个重要的容器类型——字典和集合，它们分别提供了键值对映射和独特元素集合的功能。这些容器类型与列表和元组一起，构成了 Python 数据处理的核心工具集。掌握它们，你将能够高效地处理各种数据结构和算法问题。
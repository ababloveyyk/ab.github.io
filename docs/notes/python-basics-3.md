---
title: Python基础速通Ⅲ——字典与集合
date: 2026-07-26
tags:
  - Python
  - 字典
  - 集合
  - 哈希表
  - 容器类型
categories:
  - Python
---

## 前言

在上一篇文章中，我们学习了列表和元组——两种按顺序存储数据的序列类型。但现实世界中的数据并不总是有序的。想象一下：你要存储每个学生的考试成绩，如果用列表，你需要记住索引0对应Alice、索引1对应Bob……这既不直观又容易出错。更好的方式是直接用名字来查找成绩，就像查字典一样：翻开"Alice"这一页，就能看到她的成绩。

Python 的字典（dict）正是为这种"键值对"映射而设计的。它是 Python 中最重要、最常用的数据结构之一，底层基于哈希表实现，提供了接近 O(1) 的查找性能。无论是配置管理、数据缓存、JSON 解析，还是对象属性存储，字典都扮演着核心角色。

集合（set）则是字典的近亲——它只存储键，不存储值。集合用于存储不重复的元素，支持高效的成员检测和数学集合运算（交集、并集、差集等）。当你需要去重、检查成员是否存在或进行集合运算时，集合是最佳选择。

本文将深入探讨字典和集合的所有重要特性，包括创建与访问、常用方法、底层原理、高级变体（defaultdict、OrderedDict、frozenset）以及性能优化技巧。

## 字典（dict）的创建与访问

### 字典的创建

字典用花括号 `{}` 表示，内部是 `key: value` 的键值对。键必须是不可变（可哈希）的类型，如字符串、数字、元组；值可以是任意类型。

```python
# 字典的创建方式
print("=" * 60)
print("字典的创建")
print("=" * 60)

# 方式1：花括号直接创建
student = {"name": "Alice", "age": 20, "grade": "A"}
print(f"方式1：{student}")

# 方式2：dict() 构造函数（关键字参数）
person = dict(name="Bob", age=25, city="New York")
print(f"方式2：{person}")

# 方式3：dict() 构造函数（可迭代对象）
items = [("name", "Charlie"), ("age", 30), ("job", "Engineer")]
employee = dict(items)
print(f"方式3：{employee}")

# 方式4：dict() 构造函数（zip）
keys = ["a", "b", "c"]
values = [1, 2, 3]
d = dict(zip(keys, values))
print(f"方式4：{d}")

# 方式5：字典推导式
squares = {x: x ** 2 for x in range(1, 6)}
print(f"方式5：{squares}")

# 方式6：fromkeys() 类方法
keys = ["name", "age", "city"]
d = dict.fromkeys(keys, "unknown")
print(f"方式6：{d}")

# 注意：fromkeys 的值是共享的同一个对象
d = dict.fromkeys(["a", "b", "c"], [])
print(f"fromkeys 共享引用：{d}")
d["a"].append(1)
print(f"修改 'a' 后：{d}")  # 所有键的值都变了！
# {'a': [1], 'b': [1], 'c': [1]}

# 空字典
empty = {}
print(f"空字典：{empty}, type = {type(empty)}")
```

`dict.fromkeys()` 有一个重要的陷阱：如果值参数是可变对象（如列表），所有键会共享同一个对象的引用。修改一个键的值会影响到所有键。如果需要独立的值，应该使用字典推导式。

### 字典的访问

```python
# 字典的访问方式
print("=" * 60)
print("字典的访问")
print("=" * 60)

student = {
    "name": "Alice",
    "age": 20,
    "grade": "A",
    "courses": ["Python", "Math", "Physics"],
    "address": {
        "city": "New York",
        "zip": "10001"
    }
}

# 方式1：方括号访问（键不存在会报错）
print(f"student['name'] = {student['name']}")  # Alice
print(f"student['courses'] = {student['courses']}")  # ['Python', 'Math', 'Physics']

# 访问不存在的键会引发 KeyError
try:
    print(student["phone"])
except KeyError as e:
    print(f"访问不存在的键：{e}")

# 方式2：get() 方法（键不存在返回 None 或默认值）
print(f"student.get('name') = {student.get('name')}")          # Alice
print(f"student.get('phone') = {student.get('phone')}")        # None
print(f"student.get('phone', 'N/A') = {student.get('phone', 'N/A')}")  # N/A

# 方式3：setdefault() 方法（键不存在时设置默认值并返回）
# 如果键存在，返回对应的值
phone = student.setdefault("phone", "555-1234")
print(f"setdefault('phone', '555-1234') = {phone}")
print(f"student 现在包含 phone：{student['phone']}")

# setdefault 在键已存在时不会修改值
phone = student.setdefault("phone", "999-9999")
print(f"再次 setdefault('phone', '999-9999') = {phone}")  # 仍然是 555-1234

# 访问嵌套字典
print(f"student['address']['city'] = {student['address']['city']}")  # New York

# 安全访问嵌套字典
city = student.get("address", {}).get("city", "Unknown")
print(f"安全访问嵌套 city：{city}")

# 检查键是否存在
print(f"'name' in student = {'name' in student}")        # True
print(f"'phone' in student = {'phone' in student}")      # True（刚才添加了）
print(f"'email' not in student = {'email' not in student}")  # True

# 获取所有键、值、键值对
print(f"\nkeys() = {student.keys()}")
print(f"values() = {student.values()}")
print(f"items() = {student.items()}")

# 转换为列表
print(f"keys 列表 = {list(student.keys())}")
print(f"values 列表 = {list(student.values())}")
```

`get()` 方法是访问字典的安全方式，强烈推荐。与方括号访问不同，`get()` 在键不存在时返回 `None`（或指定的默认值），而不会抛出异常。这在处理来自外部源（如 JSON API、用户输入）的数据时特别重要。

`setdefault()` 是一个不太为人所知但非常实用的方法。它兼具"获取"和"设置默认值"的功能，常用于统计计数和分组操作。

## 字典常用方法

### 修改与更新

```python
# 字典的修改与更新
print("=" * 60)
print("字典的修改与更新")
print("=" * 60)

# 添加/修改单个键值对
user = {"name": "Alice"}
user["age"] = 25          # 添加新键
user["name"] = "Alice2"   # 修改已有键
print(f"添加/修改后：{user}")

# update() 方法：批量更新
user.update({"city": "New York", "job": "Developer"})
print(f"update() 后：{user}")

# update() 也接受关键字参数
user.update(country="USA", phone="555-1234")
print(f"update 关键字参数后：{user}")

# update() 也接受可迭代对象
user.update([("email", "alice@example.com"), ("age", 26)])
print(f"update 可迭代对象后：{user}")

# 使用 | 运算符合并字典（Python 3.9+）
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
merged = dict1 | dict2
print(f"dict1 | dict2 = {merged}")  # {'a': 1, 'b': 3, 'c': 4}
# 注意：键冲突时，右边的值覆盖左边的

# |= 运算符：原地更新（Python 3.9+）
dict1 |= dict2
print(f"dict1 |= dict2 后：{dict1}")  # {'a': 1, 'b': 3, 'c': 4}

# 传统合并方式（Python 3.5+）
merged_old = {**dict1, **dict2}
print(f"{{**dict1, **dict2}} = {merged_old}")
```

字典合并运算符 `|` 和 `|=` 是 Python 3.9 引入的新特性，使得字典合并变得更加简洁。在此之前，常用的合并方式是 `{**dict1, **dict2}` 解包语法。

### 删除元素

```python
# 字典的删除操作
print("=" * 60)
print("字典的删除操作")
print("=" * 60)

inventory = {
    "apple": 10,
    "banana": 5,
    "cherry": 20,
    "date": 15,
    "elderberry": 8,
}

print(f"原始字典：{inventory}")

# pop()：删除指定键并返回其值
count = inventory.pop("banana")
print(f"pop('banana') = {count}, 字典变为：{inventory}")

# pop() 可以指定默认值（键不存在时返回）
count = inventory.pop("fig", "not found")
print(f"pop('fig', 'not found') = {count}")

# pop() 不指定默认值，键不存在时引发 KeyError
try:
    inventory.pop("fig")
except KeyError as e:
    print(f"pop('fig') 错误：{e}")

# popitem()：删除并返回最后一个键值对（Python 3.7+）
# 在 Python 3.7 之前，删除的是任意一个键值对
item = inventory.popitem()
print(f"popitem() 返回：{item}, 字典变为：{inventory}")

# del 语句：删除指定键
del inventory["cherry"]
print(f"del inventory['cherry'] 后：{inventory}")

# clear()：清空字典
inventory.clear()
print(f"clear() 后：{inventory}")
```

`popitem()` 在 Python 3.7+ 中删除的是最后一个插入的键值对（LIFO 顺序），这使得字典可以用作简易的栈。在较早的 Python 版本中，`popitem()` 删除的是任意键值对，顺序不确定。

### 遍历字典

```python
# 字典的遍历
print("=" * 60)
print("字典的遍历")
print("=" * 60)

scores = {
    "Alice": 95,
    "Bob": 87,
    "Charlie": 92,
    "David": 78,
    "Eve": 88,
}

# 遍历键
print("遍历键：")
for name in scores:
    print(f"  {name}")

# 遍历键（明确使用 keys()）
print("\n遍历键（keys()）：")
for name in scores.keys():
    print(f"  {name}")

# 遍历值
print("\n遍历值：")
for score in scores.values():
    print(f"  {score}")

# 遍历键值对
print("\n遍历键值对：")
for name, score in scores.items():
    print(f"  {name}: {score}")

# 在遍历时修改字典
# 错误方式：在遍历时修改字典大小会导致 RuntimeError
try:
    for name in scores:
        if scores[name] < 80:
            del scores[name]
except RuntimeError as e:
    print(f"\n遍历时修改字典错误：{e}")

# 正确方式：先收集要删除的键
scores = {"Alice": 95, "Bob": 87, "Charlie": 92, "David": 78, "Eve": 88}
to_delete = [name for name, score in scores.items() if score < 80]
for name in to_delete:
    del scores[name]
print(f"删除低分后：{scores}")

# 正确方式：使用字典推导式
scores = {"Alice": 95, "Bob": 87, "Charlie": 92, "David": 78, "Eve": 88}
scores = {name: score for name, score in scores.items() if score >= 80}
print(f"推导式过滤后：{scores}")

# 使用 enumerate 获取索引
print("\n带索引的遍历：")
for i, (name, score) in enumerate(scores.items(), 1):
    print(f"  [{i}] {name}: {score}")
```

### 字典视图对象

`keys()`、`values()` 和 `items()` 返回的是字典视图对象，而不是列表。视图对象是动态的——当字典发生变化时，视图会自动反映这些变化。

```python
# 字典视图对象
print("=" * 60)
print("字典视图对象")
print("=" * 60)

d = {"a": 1, "b": 2, "c": 3}

keys_view = d.keys()
values_view = d.values()
items_view = d.items()

print(f"keys_view = {keys_view}")
print(f"values_view = {values_view}")
print(f"items_view = {items_view}")

# 视图是动态的
d["d"] = 4
print(f"\n添加 'd': 4 后：")
print(f"keys_view = {keys_view}")     # 包含 'd'
print(f"values_view = {values_view}")  # 包含 4

# 视图支持集合操作
d1 = {"a": 1, "b": 2, "c": 3}
d2 = {"b": 20, "c": 30, "d": 40}

# 键的交集
common_keys = d1.keys() & d2.keys()
print(f"\n共同键：{common_keys}")  # {'b', 'c'}

# 键的差集
unique_keys = d1.keys() - d2.keys()
print(f"d1 独有键：{unique_keys}")  # {'a'}

# 键的对称差集
symmetric = d1.keys() ^ d2.keys()
print(f"对称差集：{symmetric}")  # {'a', 'd'}

# items() 视图也支持集合操作
# 但要求值也是可哈希的
d1 = {"a": 1, "b": 2, "c": 3}
d2 = {"b": 2, "c": 30, "d": 40}
common_items = d1.items() & d2.items()
print(f"共同键值对：{common_items}")  # {('b', 2)}
```

字典视图的集合操作非常强大，可以方便地找出两个字典的共有键、独有键等。这在比较配置、合并数据等场景中非常实用。

## 字典推导式

字典推导式与列表推导式类似，但生成的是字典。它使用 `{key_expr: value_expr for item in iterable}` 语法。

```python
# 字典推导式
print("=" * 60)
print("字典推导式")
print("=" * 60)

# 基本语法：{key: value for item in iterable}

# 创建平方数字典
squares = {x: x ** 2 for x in range(1, 11)}
print(f"平方数：{squares}")

# 带条件的字典推导式
even_squares = {x: x ** 2 for x in range(1, 11) if x % 2 == 0}
print(f"偶数平方：{even_squares}")

# 反转键值对
original = {"a": 1, "b": 2, "c": 3}
reversed_dict = {v: k for k, v in original.items()}
print(f"反转键值对：{reversed_dict}")

# 过滤字典
scores = {"Alice": 95, "Bob": 87, "Charlie": 92, "David": 78, "Eve": 88}
high_scores = {name: score for name, score in scores.items() if score >= 90}
print(f"高分学生：{high_scores}")

# 转换键或值
upper_keys = {k.upper(): v for k, v in scores.items()}
print(f"键转大写：{upper_keys}")

# 嵌套字典推导式
matrix = {
    "row1": {"col1": 1, "col2": 2, "col3": 3},
    "row2": {"col1": 4, "col2": 5, "col3": 6},
    "row3": {"col1": 7, "col2": 8, "col3": 9},
}

# 转置（行列互换）
transposed = {
    col: {row: matrix[row][col] for row in matrix}
    for col in matrix["row1"]
}
print(f"\n转置矩阵：")
for key, value in transposed.items():
    print(f"  {key}: {value}")

# 实际应用：单词频率统计
text = "the quick brown fox jumps over the lazy dog the fox is quick"
words = text.split()
word_freq = {word: words.count(word) for word in set(words)}
print(f"\n单词频率：{word_freq}")

# 更好的方式：使用循环（避免重复调用 count）
word_freq = {}
for word in words:
    word_freq[word] = word_freq.get(word, 0) + 1
print(f"单词频率（循环方式）：{word_freq}")

# 条件表达式在字典推导式中
grades = {name: "Pass" if score >= 60 else "Fail" for name, score in scores.items()}
print(f"\n及格情况：{grades}")
```

字典推导式是 Python 中最优雅的特性之一，但使用时也要注意可读性。如果推导式变得过于复杂（例如嵌套推导式），应该考虑使用传统的 for 循环。

## defaultdict 与 OrderedDict

### defaultdict

`defaultdict` 是 `collections` 模块中的一个字典子类，它在访问不存在的键时自动创建默认值，而不是抛出 `KeyError`。

```python
# defaultdict
print("=" * 60)
print("defaultdict")
print("=" * 60)

from collections import defaultdict

# 普通字典的困扰
# 统计单词频率时，需要检查键是否存在
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
word_count = {}
for word in words:
    if word in word_count:
        word_count[word] += 1
    else:
        word_count[word] = 1
print(f"普通字典统计：{word_count}")

# 使用 defaultdict 简化
word_count = defaultdict(int)
for word in words:
    word_count[word] += 1  # 不需要检查键是否存在！
print(f"defaultdict 统计：{dict(word_count)}")

# defaultdict 的工厂函数
# int：默认值为 0
dd_int = defaultdict(int)
print(f"dd_int['x'] = {dd_int['x']}")  # 0

# list：默认值为空列表
dd_list = defaultdict(list)
dd_list["fruits"].append("apple")
dd_list["fruits"].append("banana")
dd_list["vegetables"].append("carrot")
print(f"dd_list = {dict(dd_list)}")

# set：默认值为空集合
dd_set = defaultdict(set)
dd_set["team_a"].add("Alice")
dd_set["team_a"].add("Bob")
dd_set["team_b"].add("Charlie")
print(f"dd_set = {dict(dd_set)}")

# str：默认值为空字符串
dd_str = defaultdict(str)
print(f"dd_str['x'] = '{dd_str['x']}'")

# 自定义工厂函数
dd_custom = defaultdict(lambda: "unknown")
print(f"dd_custom['x'] = {dd_custom['x']}")

# 实际应用：分组
students = [
    ("CS", "Alice"),
    ("Math", "Bob"),
    ("CS", "Charlie"),
    ("Physics", "David"),
    ("Math", "Eve"),
    ("CS", "Frank"),
]

by_major = defaultdict(list)
for major, name in students:
    by_major[major].append(name)

print(f"\n按专业分组：")
for major, names in by_major.items():
    print(f"  {major}: {names}")

# 实际应用：嵌套字典
# 创建城市 -> 年份 -> 温度 的嵌套结构
temperatures = [
    ("New York", 2022, 15.2),
    ("New York", 2023, 16.1),
    ("London", 2022, 11.5),
    ("London", 2023, 12.3),
    ("Tokyo", 2022, 16.8),
    ("Tokyo", 2023, 17.2),
]

city_year_temp = defaultdict(lambda: defaultdict(float))
for city, year, temp in temperatures:
    city_year_temp[city][year] = temp

print(f"\n嵌套 defaultdict：")
for city, year_data in city_year_temp.items():
    print(f"  {city}: {dict(year_data)}")

# 实际应用：计数器
items = ["apple", "banana", "apple", "cherry", "banana", "apple", "cherry", "cherry", "cherry"]
counter = defaultdict(int)
for item in items:
    counter[item] += 1
print(f"\n计数器：{dict(counter)}")

# 使用 Counter 更好（collections.Counter）
from collections import Counter
counter = Counter(items)
print(f"Counter：{counter}")
print(f"最常见：{counter.most_common(2)}")
```

`defaultdict` 是处理"分组"和"计数"场景的利器。它消除了手动检查键是否存在的样板代码，使代码更加简洁和 Pythonic。不过对于简单的计数需求，`collections.Counter` 是更好的选择。

### OrderedDict

在 Python 3.7 之前，普通字典不保证键的顺序。`OrderedDict` 专门用于需要保持插入顺序的场景。从 Python 3.7 开始，普通字典已经保证保持插入顺序，但 `OrderedDict` 仍然有一些独特的功能。

```python
# OrderedDict
print("=" * 60)
print("OrderedDict")
print("=" * 60)

from collections import OrderedDict

# 创建 OrderedDict
od = OrderedDict()
od["a"] = 1
od["b"] = 2
od["c"] = 3
print(f"OrderedDict：{od}")

# Python 3.7+ 的普通字典也保持顺序
d = {"a": 1, "b": 2, "c": 3}
print(f"普通字典：{d}")

# OrderedDict 的独特功能

# 1. move_to_end()：将键移到末尾或开头
od = OrderedDict([("a", 1), ("b", 2), ("c", 3)])
print(f"\n原始顺序：{od}")
od.move_to_end("b")
print(f"move_to_end('b')：{od}")
od.move_to_end("b", last=False)  # 移到开头
print(f"move_to_end('b', last=False)：{od}")

# 2. popitem(last=True)：弹出最后一个或第一个
od = OrderedDict([("a", 1), ("b", 2), ("c", 3)])
print(f"\npopitem() 弹出：{od.popitem()}")      # ('c', 3)
print(f"popitem(last=False) 弹出：{od.popitem(last=False)}")  # ('a', 1)

# 3. 相等比较考虑顺序
od1 = OrderedDict([("a", 1), ("b", 2)])
od2 = OrderedDict([("b", 2), ("a", 1)])
print(f"\nOrderedDict 相等：{od1 == od2}")  # False（顺序不同）

d1 = {"a": 1, "b": 2}
d2 = {"b": 2, "a": 1}
print(f"普通字典相等：{d1 == d2}")  # True（不考虑顺序）

# 实际应用：LRU 缓存（最近最少使用）
class LRUCache:
    """使用 OrderedDict 实现 LRU 缓存"""
    
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key):
        if key not in self.cache:
            return -1
        # 将访问的键移到末尾（最近使用）
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            # 更新现有键
            self.cache[key] = value
            self.cache.move_to_end(key)
        else:
            if len(self.cache) >= self.capacity:
                # 删除最久未使用的（第一个）
                self.cache.popitem(last=False)
            self.cache[key] = value
    
    def __repr__(self):
        return f"LRUCache({dict(self.cache)})"


# 测试 LRU 缓存
cache = LRUCache(3)
print(f"\nLRU 缓存演示：")
cache.put("a", 1)
print(f"put('a', 1): {cache}")
cache.put("b", 2)
print(f"put('b', 2): {cache}")
cache.put("c", 3)
print(f"put('c', 3): {cache}")
cache.get("a")  # 访问 a，使其成为最近使用
print(f"get('a'): {cache}")
cache.put("d", 4)  # 容量满，删除最久未使用的 b
print(f"put('d', 4): {cache}")
```

`OrderedDict` 在 Python 3.7+ 中仍然有用，特别是 `move_to_end()` 方法和实现 LRU 缓存的场景。如果你需要比较字典的键顺序，也应该使用 `OrderedDict` 而不是普通字典。

## 集合（set）的创建与操作

### 集合的创建

集合是用于存储不重复元素的无序容器。它用花括号 `{}` 表示（但空花括号创建的是字典，空集合需要用 `set()` 创建）。

```python
# 集合的创建
print("=" * 60)
print("集合的创建")
print("=" * 60)

# 方式1：花括号创建
fruits = {"apple", "banana", "cherry"}
print(f"方式1：{fruits}")

# 方式2：set() 构造函数
numbers = set([1, 2, 3, 2, 1, 4, 5])
print(f"方式2：{numbers}")  # {1, 2, 3, 4, 5}（自动去重）

# 从字符串创建
chars = set("hello world")
print(f"从字符串创建：{chars}")  # 去重后的字符

# 空集合（注意：{} 创建的是空字典）
empty_set = set()
print(f"空集合：{empty_set}, type = {type(empty_set)}")
empty_dict = {}
print(f"空字典：{empty_dict}, type = {type(empty_dict)}")

# 集合推导式
squares = {x ** 2 for x in range(1, 11)}
print(f"平方数集合：{squares}")

# 集合中的元素必须是可哈希的
# 列表不能放入集合
try:
    s = {[1, 2], [3, 4]}
except TypeError as e:
    print(f"列表放入集合错误：{e}")

# 元组可以放入集合
s = {(1, 2), (3, 4), (1, 2)}  # 重复的元组被去重
print(f"元组集合：{s}")
```

### 集合的基本操作

```python
# 集合的基本操作
print("=" * 60)
print("集合的基本操作")
print("=" * 60)

s = {1, 2, 3, 4, 5}

# 添加元素
s.add(6)
print(f"add(6) 后：{s}")

# 添加重复元素（无效果）
s.add(6)
print(f"再次 add(6)：{s}")

# update()：批量添加（可迭代对象）
s.update([7, 8, 9])
print(f"update([7, 8, 9])：{s}")

s.update({10, 11}, (12, 13))
print(f"update 多个可迭代对象：{s}")

# 删除元素
# remove()：元素不存在时引发 KeyError
s = {1, 2, 3, 4, 5}
s.remove(3)
print(f"remove(3) 后：{s}")
try:
    s.remove(99)
except KeyError as e:
    print(f"remove(99) 错误：{e}")

# discard()：元素不存在时不报错
s = {1, 2, 3, 4, 5}
s.discard(3)
s.discard(99)  # 不报错
print(f"discard(3) 和 discard(99) 后：{s}")

# pop()：随机删除并返回一个元素
s = {1, 2, 3, 4, 5}
popped = s.pop()
print(f"pop() 返回 {popped}，集合变为：{s}")

# clear()：清空集合
s.clear()
print(f"clear() 后：{s}")

# 成员检测（O(1) 时间复杂度）
fruits = {"apple", "banana", "cherry"}
print(f"\n'apple' in fruits = {'apple' in fruits}")    # True
print(f"'grape' in fruits = {'grape' in fruits}")      # False

# 集合大小
print(f"len(fruits) = {len(fruits)}")  # 3

# 遍历集合（顺序不确定）
print("\n遍历集合：")
for fruit in fruits:
    print(f"  {fruit}")

# 集合与列表的性能对比
import time

n = 100000
test_list = list(range(n))
test_set = set(range(n))
target = n - 1  # 最坏情况

start = time.time()
print(f"\n性能对比（查找 {n} 个元素中的最后一个）：")
found = target in test_list
print(f"列表查找耗时：{time.time() - start:.6f} 秒")

start = time.time()
found = target in test_set
print(f"集合查找耗时：{time.time() - start:.6f} 秒")
```

集合的成员检测操作是 O(1) 时间复杂度，而列表是 O(n)。当需要频繁检查元素是否存在时，使用集合可以大幅提升性能。

## 集合运算

集合支持数学中的集合运算——交集、并集、差集、对称差集等。这些运算在数据处理中非常有用。

```python
# 集合运算
print("=" * 60)
print("集合运算")
print("=" * 60)

A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

print(f"A = {A}")
print(f"B = {B}")

# 并集（Union）
print(f"\n并集：")
print(f"  A | B = {A | B}")           # {1, 2, 3, 4, 5, 6, 7, 8}
print(f"  A.union(B) = {A.union(B)}")  # 同上

# 交集（Intersection）
print(f"\n交集：")
print(f"  A & B = {A & B}")                  # {4, 5}
print(f"  A.intersection(B) = {A.intersection(B)}")  # 同上

# 差集（Difference）
print(f"\n差集：")
print(f"  A - B = {A - B}")              # {1, 2, 3}
print(f"  A.difference(B) = {A.difference(B)}")  # 同上
print(f"  B - A = {B - A}")              # {6, 7, 8}

# 对称差集（Symmetric Difference）
print(f"\n对称差集：")
print(f"  A ^ B = {A ^ B}")                        # {1, 2, 3, 6, 7, 8}
print(f"  A.symmetric_difference(B) = {A.symmetric_difference(B)}")  # 同上

# 子集与超集
C = {1, 2, 3}
D = {1, 2, 3, 4, 5}

print(f"\n子集与超集：")
print(f"  C.issubset(D) = {C.issubset(D)}")       # True
print(f"  C <= D = {C <= D}")                      # True
print(f"  C < D = {C < D}")                        # True（真子集）
print(f"  D.issuperset(C) = {D.issuperset(C)}")   # True
print(f"  D >= C = {D >= C}")                      # True

# 不相交（Disjoint）
E = {1, 2, 3}
F = {4, 5, 6}
print(f"\n不相交：")
print(f"  E.isdisjoint(F) = {E.isdisjoint(F)}")   # True
print(f"  A.isdisjoint(B) = {A.isdisjoint(B)}")   # False

# 原地修改版本
print(f"\n原地修改：")
s = {1, 2, 3}
s &= {2, 3, 4}      # intersection_update
print(f"  s &= {2, 3, 4} = {s}")

s = {1, 2, 3}
s |= {4, 5}         # update
print(f"  s |= {4, 5} = {s}")

s = {1, 2, 3, 4, 5}
s -= {3, 4}         # difference_update
print(f"  s -= {3, 4} = {s}")

s = {1, 2, 3, 4}
s ^= {3, 4, 5, 6}   # symmetric_difference_update
print(f"  s ^= {3, 4, 5, 6} = {s}")

# 实际应用：共同好友
alice_friends = {"Bob", "Charlie", "David", "Eve"}
bob_friends = {"Alice", "Charlie", "Eve", "Frank"}

print(f"\n共同好友分析：")
print(f"  Alice 的好友：{alice_friends}")
print(f"  Bob 的好友：{bob_friends}")
print(f"  共同好友：{alice_friends & bob_friends}")
print(f"  Alice 独有的好友：{alice_friends - bob_friends}")
print(f"  Bob 独有的好友：{bob_friends - alice_friends}")
print(f"  所有好友：{alice_friends | bob_friends}")
print(f"  非共同好友：{alice_friends ^ bob_friends}")

# 实际应用：数据去重
data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
unique = list(set(data))
print(f"\n数据去重：{unique}")

# 但注意：set 不保持顺序
# 如果需要保持顺序，使用 dict.fromkeys()（Python 3.7+）
ordered_unique = list(dict.fromkeys(data))
print(f"保持顺序的去重：{ordered_unique}")
```

集合运算在数据处理中非常实用。例如，分析两个用户的共同好友、找出两个日期之间的差异数据、验证数据集的完整性等。集合运算的底层实现经过高度优化，即使处理大量数据也能保持高效。

## frozenset 不可变集合

`frozenset` 是集合的不可变版本。与元组和列表的关系类似，`frozenset` 一旦创建就不能修改，因此它是可哈希的，可以作为字典的键或另一个集合的元素。

```python
# frozenset
print("=" * 60)
print("frozenset 不可变集合")
print("=" * 60)

# 创建 frozenset
fs = frozenset([1, 2, 3, 4, 5])
print(f"frozenset：{fs}")
print(f"type = {type(fs)}")

# 不可修改
try:
    fs.add(6)
except AttributeError as e:
    print(f"add 错误：{e}")

# 支持所有集合的只读操作
A = frozenset([1, 2, 3, 4, 5])
B = frozenset([4, 5, 6, 7, 8])

print(f"\nA = {A}, B = {B}")
print(f"A | B = {A | B}")     # 并集
print(f"A & B = {A & B}")     # 交集
print(f"A - B = {A - B}")     # 差集
print(f"A ^ B = {A ^ B}")     # 对称差集
print(f"3 in A = {3 in A}")   # 成员检测
print(f"len(A) = {len(A)}")   # 大小

# frozenset 作为字典键
# 这在需要基于集合进行查找时非常有用
graph_weights = {
    frozenset(["A", "B"]): 10,
    frozenset(["B", "C"]): 20,
    frozenset(["A", "C"]): 15,
}
print(f"\nfrozenset 作为字典键：")
for edge, weight in graph_weights.items():
    print(f"  {set(edge)}: {weight}")

# frozenset 作为集合元素
set_of_sets = {frozenset([1, 2]), frozenset([2, 3]), frozenset([1, 2])}
print(f"\n集合的集合（自动去重）：{set_of_sets}")
# 注意：重复的 frozenset([1, 2]) 被去重了

# 实际应用：图的邻接表
# 使用 frozenset 表示无向边
edges = [
    frozenset(["A", "B"]),
    frozenset(["B", "C"]),
    frozenset(["C", "D"]),
    frozenset(["D", "A"]),
    frozenset(["A", "C"]),  # 对角线
]

# 检查某条边是否存在
print(f"\n边 A-B 是否存在：{frozenset(['A', 'B']) in edges}")
print(f"边 A-D 是否存在：{frozenset(['A', 'D']) in edges}")
# frozenset 的无序性确保 frozenset(['A', 'B']) == frozenset(['B', 'A'])
```

`frozenset` 在需要不可变集合的场景中非常有用，特别是在图算法中表示无向边，或者作为缓存键使用。

## 字典与集合的底层原理

理解字典和集合的底层实现有助于写出更高效的代码。

```python
# 字典与集合的底层原理演示
print("=" * 60)
print("字典与集合的底层原理")
print("=" * 60)

# 字典是基于哈希表实现的
# 键必须是可哈希的（hashable）

# 检查对象的哈希值
print("可哈希对象的哈希值：")
print(f"  hash('hello') = {hash('hello')}")
print(f"  hash(42) = {hash(42)}")
print(f"  hash((1, 2, 3)) = {hash((1, 2, 3))}")

# 不可哈希的对象
try:
    hash([1, 2, 3])
except TypeError as e:
    print(f"  hash([1, 2, 3]) 错误：{e}")

try:
    hash({"a": 1})
except TypeError as e:
    print(f"  hash({{'a': 1}}) 错误：{e}")

# 自定义对象的哈希
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __hash__(self):
        return hash((self.name, self.age))
    
    def __eq__(self, other):
        if isinstance(other, Person):
            return self.name == other.name and self.age == other.age
        return False
    
    def __repr__(self):
        return f"Person('{self.name}', {self.age})"

p1 = Person("Alice", 25)
p2 = Person("Alice", 25)
p3 = Person("Bob", 30)

print(f"\n自定义对象哈希：")
print(f"  hash(p1) = {hash(p1)}")
print(f"  hash(p2) = {hash(p2)}")
print(f"  p1 == p2 = {p1 == p2}")

# Person 对象可以作为字典键
people_dict = {p1: "Engineer", p3: "Designer"}
print(f"  字典：{people_dict}")
print(f"  people_dict[p2] = {people_dict[p2]}")  # p2 等于 p1，所以返回相同值

# 哈希冲突与性能
# Python 的字典使用开放寻址法处理哈希冲突
# 实际使用中，字典的性能非常稳定

# 字典的内存占用
import sys
d = {i: i for i in range(1000)}
print(f"\n1000 个元素的字典内存占用：{sys.getsizeof(d)} bytes")
print(f"  实际远大于此，因为键值对存储在其他地方")

# 字典的初始容量和扩容
# 字典在创建时会预分配一定空间
# 当负载因子超过阈值时（约 2/3），会进行扩容
# 扩容时哈希表大小翻倍，所有键需要重新哈希
```

理解哈希表的工作原理有助于避免一些常见错误。例如，使用可变对象作为字典键会导致不可预测的行为，因为对象的哈希值可能在其生命周期中改变。

## 综合实战：电商商品管理系统

让我们将本章学到的字典和集合知识应用到实际项目中——构建一个电商商品管理系统。

```python
"""
电商商品管理系统
使用字典管理商品数据，使用集合进行标签和分类操作
"""

from collections import defaultdict, Counter
from datetime import datetime


class ProductManager:
    """电商商品管理系统"""
    
    def __init__(self):
        # 商品数据库：{product_id: product_dict}
        self.products = {}
        
        # 分类索引：{category: set of product_ids}
        self.category_index = defaultdict(set)
        
        # 标签索引：{tag: set of product_ids}
        self.tag_index = defaultdict(set)
        
        # 销售记录：[(product_id, quantity, timestamp), ...]
        self.sales = []
        
        # 下一个商品 ID
        self._next_id = 1
    
    def add_product(self, name, category, price, tags, stock):
        """添加商品"""
        product_id = f"P{self._next_id:04d}"
        self._next_id += 1
        
        product = {
            "id": product_id,
            "name": name,
            "category": category,
            "price": price,
            "tags": set(tags),
            "stock": stock,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "sales_count": 0,
        }
        
        self.products[product_id] = product
        self.category_index[category].add(product_id)
        for tag in tags:
            self.tag_index[tag].add(product_id)
        
        print(f"添加商品：{product_id} - {name}")
        return product_id
    
    def get_product(self, product_id):
        """获取商品信息"""
        return self.products.get(product_id)
    
    def update_stock(self, product_id, quantity):
        """更新库存"""
        product = self.get_product(product_id)
        if product is None:
            print(f"商品 {product_id} 不存在")
            return False
        
        product["stock"] = quantity
        print(f"更新库存：{product_id} - {product['name']} = {quantity}")
        return True
    
    def record_sale(self, product_id, quantity):
        """记录销售"""
        product = self.get_product(product_id)
        if product is None:
            print(f"商品 {product_id} 不存在")
            return False
        
        if product["stock"] < quantity:
            print(f"库存不足：{product['name']} 库存 {product['stock']}，需要 {quantity}")
            return False
        
        product["stock"] -= quantity
        product["sales_count"] += quantity
        self.sales.append((product_id, quantity, datetime.now()))
        print(f"销售记录：{product['name']} x {quantity}")
        return True
    
    def get_products_by_category(self, category):
        """按分类获取商品"""
        product_ids = self.category_index.get(category, set())
        return [self.products[pid] for pid in product_ids]
    
    def get_products_by_tags(self, tags, match_all=True):
        """按标签获取商品
        match_all=True: 商品必须包含所有标签（交集）
        match_all=False: 商品包含任一标签即可（并集）
        """
        if not tags:
            return []
        
        if match_all:
            # 交集：商品必须包含所有标签
            result_ids = self.tag_index.get(tags[0], set()).copy()
            for tag in tags[1:]:
                result_ids &= self.tag_index.get(tag, set())
        else:
            # 并集：商品包含任一标签
            result_ids = set()
            for tag in tags:
                result_ids |= self.tag_index.get(tag, set())
        
        return [self.products[pid] for pid in result_ids]
    
    def get_sales_statistics(self):
        """获取销售统计"""
        if not self.sales:
            return {}
        
        # 总销售额
        total_revenue = sum(
            self.products[pid]["price"] * qty 
            for pid, qty, _ in self.sales
        )
        
        # 总销售数量
        total_quantity = sum(qty for _, qty, _ in self.sales)
        
        # 按分类统计
        category_sales = defaultdict(float)
        for pid, qty, _ in self.sales:
            category = self.products[pid]["category"]
            price = self.products[pid]["price"]
            category_sales[category] += price * qty
        
        # 热销商品 TOP 5
        product_sales = Counter()
        for pid, qty, _ in self.sales:
            product_sales[pid] += qty
        top_products = product_sales.most_common(5)
        
        return {
            "total_revenue": total_revenue,
            "total_quantity": total_quantity,
            "total_orders": len(self.sales),
            "category_sales": dict(category_sales),
            "top_products": [
                {
                    "id": pid,
                    "name": self.products[pid]["name"],
                    "quantity": qty,
                    "revenue": qty * self.products[pid]["price"],
                }
                for pid, qty in top_products
            ],
        }
    
    def find_related_products(self, product_id):
        """查找相关商品（有相同标签的其他商品）"""
        product = self.get_product(product_id)
        if product is None:
            return []
        
        related_ids = set()
        for tag in product["tags"]:
            related_ids |= self.tag_index.get(tag, set())
        related_ids.discard(product_id)  # 排除自身
        
        return [self.products[pid] for pid in related_ids]
    
    def print_report(self):
        """打印完整报告"""
        print("\n" + "=" * 60)
        print("              电商商品管理系统报告")
        print("=" * 60)
        
        # 基本信息
        print(f"\n基本信息：")
        print(f"  商品总数：{len(self.products)}")
        print(f"  分类数量：{len(self.category_index)}")
        print(f"  标签数量：{len(self.tag_index)}")
        
        # 分类统计
        print(f"\n分类统计：")
        for category, pids in self.category_index.items():
            total_stock = sum(self.products[pid]["stock"] for pid in pids)
            print(f"  {category}: {len(pids)} 个商品, 总库存 {total_stock}")
        
        # 销售统计
        stats = self.get_sales_statistics()
        if stats:
            print(f"\n销售统计：")
            print(f"  总销售额：${stats['total_revenue']:.2f}")
            print(f"  总销售数量：{stats['total_quantity']}")
            print(f"  总订单数：{stats['total_orders']}")
            
            print(f"\n  分类销售：")
            for cat, revenue in sorted(stats['category_sales'].items(), 
                                       key=lambda x: x[1], reverse=True):
                print(f"    {cat}: ${revenue:.2f}")
            
            print(f"\n  TOP 5 热销商品：")
            for i, item in enumerate(stats['top_products'], 1):
                print(f"    {i}. {item['name']} - "
                      f"销量 {item['quantity']}, "
                      f"销售额 ${item['revenue']:.2f}")
        
        # 标签使用统计
        tag_counts = Counter()
        for product in self.products.values():
            tag_counts.update(product["tags"])
        print(f"\n最常用标签：")
        for tag, count in tag_counts.most_common(5):
            print(f"  {tag}: {count} 个商品")
        
        print("=" * 60)


# 运行演示
if __name__ == "__main__":
    pm = ProductManager()
    
    # 添加商品
    pm.add_product(
        "Python编程入门", "图书", 59.99,
        ["Python", "编程", "入门", "畅销"],
        100
    )
    pm.add_product(
        "Python高级编程", "图书", 79.99,
        ["Python", "编程", "高级", "畅销"],
        80
    )
    pm.add_product(
        "机械键盘 Pro", "电子产品", 299.99,
        ["键盘", "机械", "办公", "热销"],
        50
    )
    pm.add_product(
        "无线鼠标", "电子产品", 129.99,
        ["鼠标", "无线", "办公"],
        120
    )
    pm.add_product(
        "Python数据分析", "图书", 69.99,
        ["Python", "数据分析", "入门"],
        90
    )
    pm.add_product(
        "显示器 27寸", "电子产品", 1599.99,
        ["显示器", "办公", "高清"],
        30
    )
    pm.add_product(
        "编程笔记本", "办公用品", 29.99,
        ["笔记本", "编程", "办公"],
        200
    )
    
    # 记录销售
    import random
    random.seed(42)
    
    for _ in range(50):
        pid = f"P{random.randint(1, 7):04d}"
        qty = random.randint(1, 3)
        pm.record_sale(pid, qty)
    
    # 打印报告
    pm.print_report()
    
    # 演示标签搜索
    print("\n" + "=" * 60)
    print("标签搜索演示")
    print("=" * 60)
    
    # 查找包含 "Python" 和 "编程" 标签的商品
    results = pm.get_products_by_tags(["Python", "编程"], match_all=True)
    print(f"\n同时包含 Python 和 编程 标签的商品：")
    for p in results:
        print(f"  {p['id']}: {p['name']} - ${p['price']} (标签: {p['tags']})")
    
    # 查找相关商品
    print(f"\nP0001 的相关商品：")
    related = pm.find_related_products("P0001")
    for p in related:
        common_tags = pm.products["P0001"]["tags"] & p["tags"]
        print(f"  {p['id']}: {p['name']} (共同标签: {common_tags})")
    
    # 分类统计
    print(f"\n电子产品分类：")
    electronics = pm.get_products_by_category("电子产品")
    for p in electronics:
        print(f"  {p['id']}: {p['name']} - ${p['price']} - 库存: {p['stock']}")
```

这个电商管理系统综合运用了本章的核心知识点：

1. **字典**：作为商品数据的核心存储结构，支持 O(1) 查找
2. **defaultdict**：用于分类索引和标签索引，简化分组操作
3. **集合**：用于标签存储和分类索引，支持高效的成员检测和集合运算
4. **Counter**：用于销售统计和标签频率统计
5. **集合运算**：交集和并集用于标签搜索（`match_all` 参数控制）
6. **字典推导式**：用于数据转换和过滤

## 总结

本文深入探讨了 Python 中两个基于哈希表的容器类型——字典和集合。让我们回顾一下核心要点：

**字典（dict）**是 Python 中最重要的数据结构之一：
- 基于键值对存储，提供 O(1) 的查找性能
- Python 3.7+ 保证插入顺序
- 丰富的方法：`get()`、`setdefault()`、`update()`、`pop()`、`popitem()` 等
- 字典推导式提供简洁的创建和转换方式
- `defaultdict` 简化了分组和计数操作
- `OrderedDict` 提供额外的顺序控制方法（如 `move_to_end()`）

**集合（set）**是存储不重复元素的无序容器：
- 自动去重，O(1) 成员检测
- 支持数学集合运算：交集（`&`）、并集（`|`）、差集（`-`）、对称差集（`^`）
- `frozenset` 是不可变版本，可作为字典键和集合元素
- 集合推导式类似字典推导式

**选择字典还是集合？**
- 需要键值对映射时使用字典
- 只需要检查元素是否存在或去重时使用集合
- 需要不可变集合时使用 `frozenset`

**性能提示：**
- 字典和集合的查找都是 O(1)，远优于列表的 O(n)
- 当需要频繁检查成员时，优先使用集合而非列表
- 字典键必须是可哈希的（不可变类型）
- 避免在遍历字典时修改其大小

在下一篇文章中，我们将学习字符串的深入操作和条件循环语句，这些是 Python 编程中最基础的流程控制工具。掌握字符串处理和控制流，你就能够编写更复杂的逻辑了。
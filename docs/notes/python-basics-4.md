---
title: Python基础速通Ⅳ——字符串与条件循环
date: 2026-07-26
tags:
  - Python
  - 字符串
  - 条件语句
  - 循环
  - 流程控制
categories:
  - Python
---

## 前言

在前面的文章中，我们已经学习了 Python 的基本数据类型和容器类型。现在，让我们转向两个使程序真正"活"起来的关键主题：字符串处理和流程控制。

字符串是编程中最常处理的数据类型。无论是读取用户输入、解析配置文件、处理文本数据，还是生成报告，字符串操作无处不在。Python 的字符串处理能力非常强大，提供了数十个内置方法和多种格式化方式。掌握这些工具，你将能够优雅地处理各种文本处理任务。

条件语句和循环是程序流程控制的核心。条件语句（if/elif/else）让程序能够根据不同的条件做出不同的决策；循环语句（for/while）让程序能够重复执行任务，直到满足特定条件。这些控制结构是所有编程语言的基础，Python 的语法尤其简洁和直观。

本文将深入探讨字符串的创建、方法、格式化和编码，以及条件语句和循环语句的所有重要特性。我们将通过大量实际示例来展示这些概念的实际应用。

## 字符串创建与基本操作

### 字符串的创建方式

在 Python 中，字符串有多种创建方式，每种方式都有特定的用途。

```python
# 字符串的创建方式
print("=" * 60)
print("字符串的创建方式")
print("=" * 60)

# 方式1：单引号
s1 = 'Hello, World!'
print(f"单引号：{s1}")

# 方式2：双引号
s2 = "Hello, World!"
print(f"双引号：{s2}")

# 方式3：三引号（多行字符串）
s3 = '''第一行
第二行
第三行'''
print(f"三引号（单）：\n{s3}")

s4 = """也可以使用双引号的三引号
这是第二行
这是第三行"""
print(f"三引号（双）：\n{s4}")

# 方式4：str() 构造函数
num = 42
s5 = str(num)
print(f"str() 转换：{s5} (type: {type(s5)})")

# 方式5：原始字符串（不转义）
s6 = r"C:\Users\name\Documents\note.txt"
print(f"原始字符串：{s6}")

# 方式6：字节字符串
s7 = b"Hello, World!"
print(f"字节字符串：{s7} (type: {type(s7)})")

# 方式7：f-string 格式化
name = "Alice"
age = 25
s8 = f"My name is {name} and I am {age} years old."
print(f"f-string：{s8}")
```

### 字符串的不可变性

字符串是不可变对象。一旦创建，就不能修改其中的字符。任何"修改"操作实际上都是创建了一个新的字符串。

```python
# 字符串的不可变性
print("=" * 60)
print("字符串的不可变性")
print("=" * 60)

s = "Hello"
print(f"原始字符串：{s}")
print(f"内存地址：{id(s)}")

# 尝试修改（会报错）
try:
    s[0] = 'h'
except TypeError as e:
    print(f"修改字符串错误：{e}")

# "修改"实际上是创建新字符串
s = 'h' + s[1:]
print(f"新字符串：{s}")
print(f"新内存地址：{id(s)}")  # 不同的地址

# 字符串拼接的性能影响
import time

# 不好的方式：使用 + 在循环中拼接
def bad_concat(n):
    result = ""
    for i in range(n):
        result += str(i)
    return result

# 好的方式：使用 join
def good_concat(n):
    return "".join(str(i) for i in range(n))

n = 50000
start = time.time()
bad_concat(n)
print(f"\n+ 拼接耗时：{time.time() - start:.4f} 秒")

start = time.time()
good_concat(n)
print(f"join 拼接耗时：{time.time() - start:.4f} 秒")

# 原因：每次 + 操作都创建新字符串，O(n^2) 复杂度
# join 预分配了所需空间，O(n) 复杂度
```

在循环中使用 `+` 拼接字符串是一个常见的性能陷阱。每次拼接都会创建新的字符串对象，导致 O(n^2) 的时间复杂度。使用 `join()` 方法可以避免这个问题。

### 字符串索引与切片

字符串作为序列类型，支持索引和切片操作，与列表的操作完全一致。

```python
# 字符串索引与切片
print("=" * 60)
print("字符串索引与切片")
print("=" * 60)

text = "Python Programming"

# 索引
print(f"字符串：'{text}'")
print(f"长度：{len(text)}")
print(f"text[0] = '{text[0]}'")      # P
print(f"text[7] = '{text[7]}'")      # P
print(f"text[-1] = '{text[-1]}'")    # g
print(f"text[-8] = '{text[-8]}'")    # r

# 切片
print(f"\ntext[0:6] = '{text[0:6]}'")     # Python
print(f"text[7:] = '{text[7:]}'")         # Programming
print(f"text[:6] = '{text[:6]}'")         # Python
print(f"text[::2] = '{text[::2]}'")       # Pto rgamn
print(f"text[::-1] = '{text[::-1]}'")     # gnimmargorP nohtyP

# 实用切片技巧
# 获取文件扩展名
filename = "document.pdf"
dot_index = filename.rfind(".")
if dot_index != -1:
    extension = filename[dot_index + 1:]
    name = filename[:dot_index]
    print(f"\n文件名：'{name}'，扩展名：'{extension}'")

# 提取每行
multiline = "Line1\nLine2\nLine3"
lines = multiline.split("\n")
print(f"\n多行文本分割：{lines}")

# 删除前后缀
url = "https://www.example.com"
if url.startswith("https://"):
    url = url[8:]  # 删除 "https://"
print(f"删除前缀：{url}")
```

## 字符串常用方法

Python 字符串有超过 40 个内置方法。下面我们将它们分类介绍。

### 大小写转换与空白处理

```python
# 大小写转换
print("=" * 60)
print("大小写转换与空白处理")
print("=" * 60)

text = "  Hello, Python World!  "

# 空白处理
print(f"原始：'{text}'")
print(f"strip()：'{text.strip()}'")         # 去除两端空白
print(f"lstrip()：'{text.lstrip()}'")       # 去除左侧空白
print(f"rstrip()：'{text.rstrip()}'")       # 去除右侧空白

# 大小写转换
text = "Hello, Python World!"
print(f"\n原始：'{text}'")
print(f"upper()：'{text.upper()}'")          # 全大写
print(f"lower()：'{text.lower()}'")          # 全小写
print(f"capitalize()：'{text.capitalize()}'") # 首字母大写
print(f"title()：'{text.title()}'")          # 每个单词首字母大写
print(f"swapcase()：'{text.swapcase()}'")    # 大小写反转

# 实际应用：用户输入规范化
def normalize_name(name):
    """规范化用户输入的名称"""
    return name.strip().title()

names = ["  alice  ", "BOB", "  charlie  ", "  david SMITH  "]
normalized = [normalize_name(n) for n in names]
print(f"\n规范化名称：{normalized}")
# ['Alice', 'Bob', 'Charlie', 'David Smith']

# casefold()：更激进的转换（用于不区分大小写的比较）
text1 = "straße"
text2 = "STRASSE"
print(f"\ncasefold() 比较：{text1.casefold() == text2.casefold()}")
# True（lower() 比较会返回 False）
```

### 查找与替换

```python
# 查找与替换
print("=" * 60)
print("查找与替换")
print("=" * 60)

text = "The quick brown fox jumps over the lazy dog"

# find()：查找子串位置（找不到返回 -1）
print(f"find('fox') = {text.find('fox')}")          # 16
print(f"find('cat') = {text.find('cat')}")          # -1
print(f"find('the') = {text.find('the')}")          # 31（区分大小写）
print(f"find('the', 0, 20) = {text.find('the', 0, 20)}")  # -1（在[0:20]范围内查找）

# rfind()：从右边查找
print(f"rfind('the') = {text.rfind('the')}")        # 31

# index()：类似于 find()，但找不到时引发 ValueError
print(f"index('fox') = {text.index('fox')}")        # 16
try:
    text.index('cat')
except ValueError as e:
    print(f"index('cat') 错误：{e}")

# count()：统计子串出现次数
print(f"count('the') = {text.count('the')}")        # 2
print(f"count('o') = {text.count('o')}")            # 4

# replace()：替换子串
print(f"replace('fox', 'cat') = {text.replace('fox', 'cat')}")
print(f"replace('o', 'X', 2) = {text.replace('o', 'X', 2)}")  # 只替换前2个

# startswith() 和 endswith()
print(f"startswith('The') = {text.startswith('The')}")  # True
print(f"endswith('dog') = {text.endswith('dog')}")      # True

# 检查多个前缀
filename = "image.jpg"
print(f"\n是否为图片：{filename.endswith(('.jpg', '.png', '.gif'))}")  # True

# in 运算符
print(f"'fox' in text = {'fox' in text}")              # True
print(f"'cat' in text = {'cat' in text}")              # False
```

### 分割与连接

```python
# 分割与连接
print("=" * 60)
print("分割与连接")
print("=" * 60)

# split()：按分隔符分割
text = "apple,banana,cherry,date"
fruits = text.split(",")
print(f"split(',')：{fruits}")

# 默认按空白字符分割
text = "one   two\tthree\nfour"
print(f"split()：{text.split()}")  # 不指定分隔符时，会合并连续空白

# 指定最大分割次数
text = "a,b,c,d,e"
print(f"split(',', 2)：{text.split(',', 2)}")  # ['a', 'b', 'c,d,e']

# rsplit()：从右边分割
print(f"rsplit(',', 2)：{text.rsplit(',', 2)}")  # ['a,b,c', 'd', 'e']

# splitlines()：按行分割
text = "Line 1\nLine 2\r\nLine 3"
print(f"splitlines()：{text.splitlines()}")
print(f"splitlines(keepends=True)：{text.splitlines(keepends=True)}")

# partition()：分割为三部分（分隔符前、分隔符、分隔符后）
text = "hello@example.com"
before, sep, after = text.partition("@")
print(f"\npartition('@')：before='{before}', sep='{sep}', after='{after}'")

# rpartition()：从右边查找分隔符
path = "/home/user/document.txt"
print(f"rpartition('/')：{path.rpartition('/')}")

# join()：连接可迭代对象
fruits = ["apple", "banana", "cherry"]
print(f"\njoin(',')：{','.join(fruits)}")
print(f"join(' - ')：{' - '.join(fruits)}")

# join 的常见用法
# 连接路径
path_parts = ["home", "user", "documents"]
path = "/".join(path_parts)
print(f"连接路径：/{path}")

# 连接字符串中每个字符
print(f"连接字符：{'-'.join('Hello')}")  # H-e-l-l-o

# 实际应用：CSV 解析
csv_line = "Alice,25,Engineer,New York"
fields = csv_line.split(",")
name, age, job, city = fields
print(f"\nCSV 解析：{name} ({age}) - {job} at {city}")
```

### 判断方法

```python
# 判断方法
print("=" * 60)
print("判断方法")
print("=" * 60)

# 字符类型判断
print("字母数字判断：")
print(f"  'abc123'.isalnum() = {'abc123'.isalnum()}")  # True
print(f"  'abc-123'.isalnum() = {'abc-123'.isalnum()}")  # False（含连字符）

print(f"  'abc'.isalpha() = {'abc'.isalpha()}")          # True
print(f"  'abc123'.isalpha() = {'abc123'.isalpha()}")    # False（含数字）

print(f"  '123'.isdigit() = {'123'.isdigit()}")          # True
print(f"  '123.45'.isdigit() = {'123.45'.isdigit()}")    # False（含小数点）

print(f"  '123'.isnumeric() = {'123'.isnumeric()}")      # True
print(f"  '一二三'.isnumeric() = {'一二三'.isnumeric()}")  # True

print(f"  'abc'.islower() = {'abc'.islower()}")          # True
print(f"  'ABC'.isupper() = {'ABC'.isupper()}")          # True
print(f"  'Abc'.istitle() = {'Abc'.istitle()}")          # True

print(f"  ' '.isspace() = {' '.isspace()}")              # True
print(f"  '\\t\\n'.isspace() = {'\t\n'.isspace()}")      # True

# 实际应用：输入验证
def validate_password(password):
    """验证密码强度"""
    if len(password) < 8:
        return False, "密码至少需要8个字符"
    if not any(c.isupper() for c in password):
        return False, "密码需要至少一个大写字母"
    if not any(c.islower() for c in password):
        return False, "密码需要至少一个小写字母"
    if not any(c.isdigit() for c in password):
        return False, "密码需要至少一个数字"
    if not any(not c.isalnum() for c in password):
        return False, "密码需要至少一个特殊字符"
    return True, "密码强度合格"

passwords = ["abc", "abcdefgh", "Abcdefgh", "Abcdefg1", "Abcdefg1!"]
for pwd in passwords:
    valid, msg = validate_password(pwd)
    print(f"\n密码 '{pwd}': {msg}")
```

## 字符串格式化

字符串格式化是将变量嵌入到字符串中的技术。Python 提供了三种主要的格式化方式：% 格式化、str.format() 和 f-string。

### % 格式化（旧式）

```python
# % 格式化
print("=" * 60)
print("% 格式化（旧式）")
print("=" * 60)

name = "Alice"
age = 25
score = 95.6789

# 基本使用
print("Name: %s, Age: %d" % (name, age))

# 格式化符号
print("整数: %d" % 42)           # 十进制整数
print("浮点数: %f" % 3.14)       # 浮点数
print("科学计数: %e" % 3.14)     # 科学计数法
print("百分比: %.1f%%" % 85.5)   # 百分号
print("十六进制: %x" % 255)      # 十六进制
print("字符串: %s" % "hello")    # 字符串

# 宽度与对齐
print("'%10s'" % "hello")        # 右对齐，宽度10
print("'%-10s'" % "hello")       # 左对齐，宽度10
print("'%010d'" % 42)            # 0填充

# 精度
print("Pi = %.2f" % 3.14159)     # 保留2位小数
print("Score = %.1f" % score)    # 保留1位小数

# 字典格式化
data = {"name": "Bob", "age": 30}
print("Name: %(name)s, Age: %(age)d" % data)
```

虽然 % 格式化仍然可用，但在新代码中建议使用 f-string 或 str.format()，因为它们更直观、更强大。

### str.format() 方法

```python
# str.format() 方法
print("=" * 60)
print("str.format() 方法")
print("=" * 60)

# 位置参数
print("{} {} {}".format("a", "b", "c"))         # a b c
print("{2} {0} {1}".format("a", "b", "c"))      # c a b
print("{0} {0} {1}".format("a", "b"))           # a a b

# 关键字参数
print("{name} is {age} years old".format(name="Alice", age=25))

# 混合使用
print("{0} is {age} years old".format("Alice", age=25))

# 访问属性和索引
data = ["Alice", 25]
print("{0[0]} is {0[1]} years old".format(data))

# 格式化数字
print("整数: {:d}".format(42))
print("浮点数: {:.2f}".format(3.14159))
print("百分比: {:.1%}".format(0.855))
print("科学计数: {:.2e}".format(3.14159))

# 宽度与对齐
print("'{:>10}'".format("hello"))    # 右对齐
print("'{:<10}'".format("hello"))    # 左对齐
print("'{:^10}'".format("hello"))    # 居中
print("'{:*^10}'".format("hello"))   # 使用 * 填充

# 千位分隔符
print("金额: ${:,}".format(1234567890))

# 进制转换
print("二进制: {:b}".format(255))
print("八进制: {:o}".format(255))
print("十六进制: {:x}".format(255))

# 复杂示例：表格输出
print("\n表格输出：")
print("{:<15} {:<10} {:<10}".format("Name", "Age", "Score"))
print("-" * 35)
print("{:<15} {:<10} {:<10.1f}".format("Alice", 25, 95.5))
print("{:<15} {:<10} {:<10.1f}".format("Bob", 30, 88.6))
print("{:<15} {:<10} {:<10.1f}".format("Charlie", 22, 92.3))
```

### f-string（格式化字符串字面量）

f-string 是 Python 3.6 引入的格式化方式，是最简洁、最高效的字符串格式化方法。

```python
# f-string 格式化
print("=" * 60)
print("f-string 格式化（推荐）")
print("=" * 60)

name = "Alice"
age = 25
score = 95.6789

# 基本使用
print(f"Name: {name}, Age: {age}")

# 表达式
print(f"5 + 3 = {5 + 3}")
print(f"Uppercase: {name.upper()}")

# 格式化说明符
print(f"Pi: {3.14159:.2f}")
print(f"Score: {score:.1f}")
print(f"Percentage: {0.855:.1%}")
print(f"Hex: {255:#x}")

# 宽度与对齐
print(f"'{"hello":>10}'")    # 右对齐
print(f"'{"hello":<10}'")    # 左对齐
print(f"'{"hello":^10}'")    # 居中
print(f"'{"hello":*^10}'")   # * 填充

# 千位分隔符
print(f"金额: ${1234567890:,}")

# 日期时间格式化
from datetime import datetime
now = datetime.now()
print(f"当前时间: {now:%Y-%m-%d %H:%M:%S}")

# 调试模式（Python 3.8+）
x = 10
y = 20
print(f"{x = }, {y = }, {x + y = }")
# 输出：x = 10, y = 20, x + y = 30

# 多行 f-string
print(f"""多行输出：
Name: {name}
Age: {age}
Score: {score:.1f}
""")

# 实际应用：生成报告
items = [
    ("Apple", 3, 1.50),
    ("Banana", 5, 0.80),
    ("Cherry", 2, 5.00),
]

print("\n购物清单：")
print(f"{'Item':<15} {'Qty':<5} {'Price':<8} {'Total':<8}")
print("-" * 36)
total = 0
for item, qty, price in items:
    subtotal = qty * price
    total += subtotal
    print(f"{item:<15} {qty:<5} ${price:<7.2f} ${subtotal:<7.2f}")
print("-" * 36)
print(f"{'Total':<28} ${total:<7.2f}")
```

f-string 是目前最推荐的格式化方式。它不仅语法简洁，而且性能最好（因为 f-string 在编译时就被解析，而不是运行时）。在 Python 3.6+ 的环境中，应该优先使用 f-string。

## 字符串编码

### 字符编码基础

理解字符编码对于处理多语言文本至关重要。Python 3 中的字符串默认使用 Unicode。

```python
# 字符串编码
print("=" * 60)
print("字符串编码")
print("=" * 60)

# 字符与 Unicode 码点
print("字符的 Unicode 码点：")
print(f"  ord('A') = {ord('A')}")         # 65
print(f"  ord('中') = {ord('中')}")       # 20013
print(f"  ord('😀') = {ord('😀')}")       # 128512

# 码点转字符
print(f"  chr(65) = {chr(65)}")           # A
print(f"  chr(20013) = {chr(20013)}")     # 中
print(f"  chr(128512) = {chr(128512)}")   # 😀

# Unicode 转义
print(f"  \\u4e2d = {'\\u4e2d'}")         # 中
print(f"  \\U0001F600 = {'\\U0001F600'}") # 😀

# 编码与解码
text = "Hello, 世界！"

# 编码为字节
utf8_bytes = text.encode("utf-8")
print(f"\nUTF-8 编码：{utf8_bytes}")
print(f"  字节长度：{len(utf8_bytes)}")

gbk_bytes = text.encode("gbk")
print(f"GBK 编码：{gbk_bytes}")
print(f"  字节长度：{len(gbk_bytes)}")

# 解码回字符串
print(f"UTF-8 解码：{utf8_bytes.decode('utf-8')}")
print(f"GBK 解码：{gbk_bytes.decode('gbk')}")

# 编码错误处理
text = "Hello, 世界！"

# strict：遇到无法编码的字符时抛出异常
try:
    text.encode("ascii")
except UnicodeEncodeError as e:
    print(f"\nASCII 编码错误：{e}")

# ignore：忽略无法编码的字符
ascii_bytes = text.encode("ascii", errors="ignore")
print(f"ignore 错误：{ascii_bytes}")  # b'Hello, '

# replace：用 ? 替换无法编码的字符
ascii_bytes = text.encode("ascii", errors="replace")
print(f"replace 错误：{ascii_bytes}")  # b'Hello, ???'

# xmlcharrefreplace：用 XML 字符引用替换
ascii_bytes = text.encode("ascii", errors="xmlcharrefreplace")
print(f"xmlcharrefreplace：{ascii_bytes}")

# 实际应用：文件读写编码
# 写入文件时指定编码
with open("test_utf8.txt", "w", encoding="utf-8") as f:
    f.write("Hello, 世界！")

# 读取文件时指定编码
with open("test_utf8.txt", "r", encoding="utf-8") as f:
    content = f.read()
print(f"\n读取文件内容：{content}")

# 检测文件编码（使用 chardet 库）
# pip install chardet
# import chardet
# with open("test_utf8.txt", "rb") as f:
#     raw = f.read()
#     result = chardet.detect(raw)
#     print(f"检测到的编码：{result['encoding']}")

# 清理文件
import os
os.remove("test_utf8.txt")
```

在处理中文或其他非 ASCII 字符时，编码问题是最常见的错误来源之一。记住一条黄金法则：**在 Python 内部统一使用 Unicode 字符串，只在输入/输出边界进行编码和解码**。

## if/elif/else 条件语句

条件语句让程序能够根据不同的条件执行不同的代码路径。

```python
# if/elif/else 条件语句
print("=" * 60)
print("if/elif/else 条件语句")
print("=" * 60)

# 基本 if 语句
age = 18
if age >= 18:
    print("你是成年人")

# if-else 语句
age = 16
if age >= 18:
    print("你是成年人")
else:
    print("你是未成年人")

# if-elif-else 语句
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"分数 {score} 对应等级：{grade}")

# 嵌套 if 语句
age = 25
has_ticket = True

if age >= 18:
    if has_ticket:
        print("欢迎入场！")
    else:
        print("请先购票")
else:
    print("未成年人需要监护人陪同")

# 条件表达式（三元运算符）
x = 10
y = 20
max_value = x if x > y else y
print(f"max({x}, {y}) = {max_value}")

# 链式比较
a, b, c = 10, 20, 30
print(f"a < b < c: {a < b < c}")  # True
print(f"a < b > c: {a < b > c}")  # False

# 这也等价于
print(f"a < b and b < c: {a < b and b < c}")  # True

# 真值测试
# 以下值在布尔上下文中被视为 False
false_values = [False, None, 0, 0.0, "", [], (), {}, set()]
for v in false_values:
    print(f"  bool({v!r}) = {bool(v)}")

# 利用真值测试简化代码
# 不好的写法
name = "Alice"
if len(name) > 0:
    print(f"你好，{name}")

# 好的写法
if name:
    print(f"你好，{name}")

# 实际应用：BMI 计算器
def calculate_bmi(weight, height):
    bmi = weight / (height ** 2)
    
    if bmi < 18.5:
        category = "偏瘦"
        advice = "建议增加营养摄入"
    elif bmi < 24:
        category = "正常"
        advice = "保持良好习惯"
    elif bmi < 28:
        category = "偏胖"
        advice = "建议适当运动"
    else:
        category = "肥胖"
        advice = "建议咨询医生"
    
    return bmi, category, advice

bmi, category, advice = calculate_bmi(70, 1.75)
print(f"\nBMI: {bmi:.1f}, 类别: {category}, 建议: {advice}")
```

## for 循环

for 循环是 Python 中最常用的循环结构，用于遍历可迭代对象。

```python
# for 循环
print("=" * 60)
print("for 循环")
print("=" * 60)

# 遍历列表
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"  {fruit}")

# 遍历字符串
for char in "Python":
    print(f"  {char}")

# 遍历字典
student = {"name": "Alice", "age": 20, "grade": "A"}
for key in student:
    print(f"  {key}: {student[key]}")

# 更好的方式
for key, value in student.items():
    print(f"  {key}: {value}")

# range() 函数
print("\nrange() 用法：")
# range(stop)
print(f"  range(5) = {list(range(5))}")        # [0, 1, 2, 3, 4]

# range(start, stop)
print(f"  range(2, 6) = {list(range(2, 6))}")  # [2, 3, 4, 5]

# range(start, stop, step)
print(f"  range(0, 10, 2) = {list(range(0, 10, 2))}")  # [0, 2, 4, 6, 8]
print(f"  range(10, 0, -1) = {list(range(10, 0, -1))}")  # [10, 9, ..., 1]

# range 实战：打印乘法表
print("\n九九乘法表：")
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j:2d}", end="  ")
    print()

# enumerate() 获取索引
print("\nenumerate() 用法：")
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits):
    print(f"  [{i}] {fruit}")

for i, fruit in enumerate(fruits, start=1):
    print(f"  [{i}] {fruit}")

# zip() 并行遍历
print("\nzip() 并行遍历：")
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
cities = ["New York", "London", "Tokyo"]

for name, age, city in zip(names, ages, cities):
    print(f"  {name} is {age} years old and lives in {city}")

# 循环中的 else 子句
print("\nfor-else 子句：")
# 当循环正常结束（没有被 break 中断）时执行 else
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            print(f"  {n} = {x} * {n//x}")
            break
    else:
        print(f"  {n} 是质数")
```

### break、continue 和 pass

```python
# break、continue 和 pass
print("=" * 60)
print("break、continue 和 pass")
print("=" * 60)

# break：立即退出循环
print("break 示例：")
for i in range(10):
    if i == 5:
        break
    print(f"  {i}", end=" ")
print()  # 输出：0 1 2 3 4

# continue：跳过当前迭代，继续下一次
print("continue 示例：")
for i in range(10):
    if i % 2 == 0:
        continue
    print(f"  {i}", end=" ")
print()  # 输出：1 3 5 7 9

# pass：什么都不做（占位符）
print("pass 示例：")
for i in range(5):
    if i == 3:
        pass  # 将来会在这里添加代码
    print(f"  {i}", end=" ")
print()

# 实际应用：查找第一个符合条件的元素
def find_first(items, condition):
    """查找第一个满足条件的元素"""
    for item in items:
        if condition(item):
            return item
    return None

numbers = [3, 7, 2, 9, 4, 6, 8]
result = find_first(numbers, lambda x: x > 5)
print(f"第一个大于5的数：{result}")  # 7

# 实际应用：跳过无效数据
data = ["Alice", "", "Bob", "", "Charlie", "   ", "David"]
valid_names = []
for name in data:
    if not name.strip():  # 跳过空字符串
        continue
    valid_names.append(name.strip())
print(f"有效名称：{valid_names}")

# break 在嵌套循环中只跳出最内层循环
print("\n嵌套循环中的 break：")
for i in range(3):
    for j in range(3):
        if j == 1:
            break
        print(f"  ({i}, {j})", end=" ")
    print()
# 输出：(0, 0) (1, 0) (2, 0)
```

## while 循环

while 循环在条件为真时重复执行，适用于不确定循环次数的场景。

```python
# while 循环
print("=" * 60)
print("while 循环")
print("=" * 60)

# 基本 while 循环
count = 0
while count < 5:
    print(f"  count = {count}")
    count += 1

# while-else 子句
print("\nwhile-else 子句：")
count = 0
while count < 5:
    print(f"  count = {count}")
    count += 1
else:
    print("  循环正常结束")

# break 跳出 while 循环（else 不会执行）
print("\nbreak 跳出 while：")
count = 0
while count < 5:
    if count == 3:
        break
    print(f"  count = {count}")
    count += 1
else:
    print("  这不会执行")

# 无限循环（需要谨慎使用）
# while True:
#     user_input = input("输入 'quit' 退出：")
#     if user_input == "quit":
#         break
#     print(f"你输入了：{user_input}")

# 实际应用：数字猜谜游戏
import random

def guess_number():
    """猜数字游戏"""
    secret = random.randint(1, 100)
    attempts = 0
    
    print("猜数字游戏开始！范围：1-100")
    
    while True:
        try:
            guess = int(input("请输入你的猜测："))
            attempts += 1
            
            if guess < 1 or guess > 100:
                print("请输入 1-100 之间的数字")
                continue
            
            if guess < secret:
                print("太小了！再试试")
            elif guess > secret:
                print("太大了！再试试")
            else:
                print(f"恭喜！你猜对了！答案是 {secret}")
                print(f"你用了 {attempts} 次猜测")
                break
        except ValueError:
            print("请输入有效的数字")
        except KeyboardInterrupt:
            print("\n游戏结束")
            break

# 取消注释来玩这个游戏
# guess_number()

# 实际应用：斐波那契数列
def fibonacci(n):
    """生成前 n 个斐波那契数"""
    a, b = 0, 1
    count = 0
    result = []
    while count < n:
        result.append(a)
        a, b = b, a + b
        count += 1
    return result

print(f"\n前10个斐波那契数：{fibonacci(10)}")

# 实际应用：二分查找
def binary_search(arr, target):
    """二分查找（假设 arr 已排序）"""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

sorted_arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
target = 13
index = binary_search(sorted_arr, target)
print(f"二分查找 {target} 在索引 {index}")  # 6
```

## 循环的高级技巧

```python
# 循环的高级技巧
print("=" * 60)
print("循环的高级技巧")
print("=" * 60)

# 列表推导式中的条件
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even = [x for x in numbers if x % 2 == 0]
print(f"偶数：{even}")

# 多重循环的列表推导式
pairs = [(x, y) for x in range(3) for y in range(3)]
print(f"坐标对：{pairs}")

# 带条件的多重循环
pairs = [(x, y) for x in range(3) for y in range(3) if x != y]
print(f"非对角线坐标：{pairs}")

# 使用 any() 和 all() 简化条件
# any()：任一为真
# all()：全部为真
scores = [85, 92, 78, 95, 88]
print(f"所有成绩及格：{all(s >= 60 for s in scores)}")
print(f"有满分：{any(s == 100 for s in scores)}")
print(f"有不及格：{any(s < 60 for s in scores)}")

# 使用 itertools 进行高级迭代
import itertools

# 累积求和
print(f"\n累积求和：{list(itertools.accumulate([1, 2, 3, 4, 5]))}")

# 无限计数
# counter = itertools.count(start=1, step=2)
# print(f"计数：{[next(counter) for _ in range(5)]}")

# 循环迭代
colors = ["red", "green", "blue"]
cycler = itertools.cycle(colors)
print(f"循环：{[next(cycler) for _ in range(7)]}")

# 排列组合
items = [1, 2, 3]
print(f"排列：{list(itertools.permutations(items, 2))}")
print(f"组合：{list(itertools.combinations(items, 2))}")

# 使用 reversed() 反向迭代
for i in reversed(range(5)):
    print(f"  {i}", end=" ")
print()

# 使用 sorted() 排序迭代
numbers = [3, 1, 4, 1, 5, 9, 2]
for n in sorted(numbers, reverse=True):
    print(f"  {n}", end=" ")
print()

# 循环中的解包
points = [(1, 2), (3, 4), (5, 6)]
for x, y in points:
    print(f"  ({x}, {y})", end=" ")
print()

# 使用字典的 items() 解包
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}
for name, score in scores.items():
    print(f"  {name}: {score}")
```

## 综合实战：文本分析工具

让我们将本章学到的知识和前面章节的内容结合起来，创建一个文本分析工具。

```python
"""
文本分析工具
综合运用字符串处理、条件语句和循环
"""

import re
from collections import Counter
from typing import Dict, List, Tuple


class TextAnalyzer:
    """文本分析工具"""
    
    def __init__(self, text: str):
        self.text = text
        self.words = self._tokenize()
        self.sentences = self._split_sentences()
    
    def _tokenize(self) -> List[str]:
        """分词：将文本分割为单词列表"""
        # 使用正则表达式提取单词（只保留字母数字）
        words = re.findall(r'\b\w+\b', self.text.lower())
        return words
    
    def _split_sentences(self) -> List[str]:
        """分句：将文本分割为句子列表"""
        # 简单的句子分割（按 .!? 分割）
        sentences = re.split(r'[.!?]+', self.text)
        return [s.strip() for s in sentences if s.strip()]
    
    def word_count(self) -> int:
        """总单词数"""
        return len(self.words)
    
    def unique_word_count(self) -> int:
        """不重复单词数"""
        return len(set(self.words))
    
    def sentence_count(self) -> int:
        """句子数"""
        return len(self.sentences)
    
    def char_count(self, include_spaces: bool = True) -> int:
        """字符数"""
        if include_spaces:
            return len(self.text)
        else:
            return len(self.text.replace(" ", "").replace("\n", ""))
    
    def avg_word_length(self) -> float:
        """平均单词长度"""
        if not self.words:
            return 0.0
        return sum(len(w) for w in self.words) / len(self.words)
    
    def avg_sentence_length(self) -> float:
        """平均句子长度（单词数）"""
        if not self.sentences:
            return 0.0
        total_words = sum(len(re.findall(r'\b\w+\b', s)) for s in self.sentences)
        return total_words / len(self.sentences)
    
    def word_frequency(self, top_n: int = 10) -> List[Tuple[str, int]]:
        """单词频率统计"""
        return Counter(self.words).most_common(top_n)
    
    def lexical_diversity(self) -> float:
        """词汇多样性（不重复词数 / 总词数）"""
        if not self.words:
            return 0.0
        return self.unique_word_count() / self.word_count()
    
    def reading_level(self) -> Dict[str, any]:
        """估算阅读难度"""
        if not self.sentences or not self.words:
            return {"level": "N/A", "score": 0}
        
        total_words = len(self.words)
        total_sentences = len(self.sentences)
        
        # 复杂词（3个音节以上，这里简化为长度>6的单词）
        complex_words = [w for w in self.words if len(w) > 6]
        complex_count = len(complex_words)
        
        # Flesch-Kincaid 简化版
        if total_sentences > 0:
            score = 206.835 - 1.015 * (total_words / total_sentences) \
                    - 84.6 * (complex_count / total_words) if total_words > 0 else 0
        else:
            score = 0
        
        # 判断难度
        if score >= 90:
            level = "非常容易"
        elif score >= 80:
            level = "容易"
        elif score >= 70:
            level = "较容易"
        elif score >= 60:
            level = "标准"
        elif score >= 50:
            level = "较难"
        elif score >= 30:
            level = "困难"
        else:
            level = "非常困难"
        
        return {
            "level": level,
            "score": round(score, 1),
            "complex_word_ratio": round(complex_count / total_words * 100, 1) if total_words > 0 else 0,
        }
    
    def find_keyword_context(self, keyword: str, context_size: int = 3) -> List[str]:
        """查找关键词的上下文"""
        keyword = keyword.lower()
        contexts = []
        
        for i, word in enumerate(self.words):
            if word == keyword:
                start = max(0, i - context_size)
                end = min(len(self.words), i + context_size + 1)
                context = " ".join(self.words[start:end])
                contexts.append(context)
        
        return contexts
    
    def generate_report(self) -> str:
        """生成完整分析报告"""
        report_lines = []
        report_lines.append("=" * 60)
        report_lines.append("              文本分析报告")
        report_lines.append("=" * 60)
        
        # 基本统计
        report_lines.append("\n【基本统计】")
        report_lines.append(f"  总字符数（含空格）：{self.char_count(True)}")
        report_lines.append(f"  总字符数（不含空格）：{self.char_count(False)}")
        report_lines.append(f"  总单词数：{self.word_count()}")
        report_lines.append(f"  不重复单词数：{self.unique_word_count()}")
        report_lines.append(f"  句子数：{self.sentence_count()}")
        report_lines.append(f"  平均单词长度：{self.avg_word_length():.2f}")
        report_lines.append(f"  平均句子长度：{self.avg_sentence_length():.1f} 词")
        report_lines.append(f"  词汇多样性：{self.lexical_diversity():.2%}")
        
        # 阅读难度
        reading = self.reading_level()
        report_lines.append(f"\n【阅读难度】")
        report_lines.append(f"  难度等级：{reading['level']}")
        report_lines.append(f"  可读性分数：{reading['score']}")
        report_lines.append(f"  复杂词比例：{reading['complex_word_ratio']}%")
        
        # 高频词
        report_lines.append(f"\n【高频词 TOP 10】")
        for i, (word, freq) in enumerate(self.word_frequency(10), 1):
            bar = "█" * freq
            report_lines.append(f"  {i:2}. {word:<15} {freq:3} 次 {bar}")
        
        # 文本预览
        report_lines.append(f"\n【文本预览】")
        preview = self.text[:200] + "..." if len(self.text) > 200 else self.text
        report_lines.append(f"  {preview}")
        
        report_lines.append("\n" + "=" * 60)
        
        return "\n".join(report_lines)


# 运行演示
if __name__ == "__main__":
    sample_text = """
    Python is a high-level, interpreted programming language known for its 
    readability and simplicity. Python supports multiple programming paradigms, 
    including procedural, object-oriented, and functional programming. 
    
    Python was created by Guido van Rossum and first released in 1991. 
    Python's design philosophy emphasizes code readability with its notable 
    use of significant indentation. Python is dynamically typed and 
    garbage-collected. Python supports modules and packages, which encourages 
    program modularity and code reuse.
    
    Python is widely used in web development, data science, artificial 
    intelligence, scientific computing, and automation. Python has a large 
    standard library and a vibrant ecosystem of third-party packages. 
    Python's popularity has grown significantly over the years, making it 
    one of the most widely used programming languages in the world.
    """
    
    analyzer = TextAnalyzer(sample_text)
    
    # 打印报告
    print(analyzer.generate_report())
    
    # 查找关键词上下文
    print("\n" + "=" * 60)
    print("关键词 'Python' 的上下文：")
    print("=" * 60)
    contexts = analyzer.find_keyword_context("python", context_size=4)
    for i, ctx in enumerate(contexts[:5], 1):
        print(f"  [{i}] ...{ctx}...")
    
    # 使用条件语句进行文本分类
    print("\n" + "=" * 60)
    print("文本分类")
    print("=" * 60)
    
    word_count = analyzer.word_count()
    lexical_diversity = analyzer.lexical_diversity()
    reading = analyzer.reading_level()
    
    if word_count < 100:
        size_category = "短文"
    elif word_count < 500:
        size_category = "中等长度"
    elif word_count < 1000:
        size_category = "长文"
    else:
        size_category = "超长文"
    
    if lexical_diversity > 0.7:
        diversity_category = "词汇丰富"
    elif lexical_diversity > 0.5:
        diversity_category = "词汇适中"
    else:
        diversity_category = "词汇重复较多"
    
    print(f"  文本长度类别：{size_category}")
    print(f"  词汇多样性类别：{diversity_category}")
    print(f"  阅读难度：{reading['level']}")
    
    # 使用循环进行字符频率分析
    print("\n字符频率分析：")
    char_freq = Counter(c.lower() for c in sample_text if c.isalpha())
    for char, freq in char_freq.most_common(10):
        bar = "█" * (freq // 2)
        print(f"  '{char}': {freq:3} {bar}")
```

这个文本分析工具综合运用了本章的核心知识点：

1. **字符串方法**：`lower()`、`split()`、`strip()`、`replace()`、`join()` 等
2. **字符串格式化**：f-string 用于报告生成
3. **正则表达式**：`re.findall()` 和 `re.split()` 用于分词和分句
4. **条件语句**：文本分类和阅读难度判断
5. **for 循环**：遍历单词、统计频率
6. **列表推导式**：`[w for w in self.words if len(w) > 6]`
7. **Counter**：单词频率统计
8. **字典**：存储分析结果

## 总结

本文深入探讨了 Python 中字符串处理和流程控制的核心知识。让我们回顾一下重点：

**字符串（str）**是 Python 中最常用的数据类型：
- 不可变：任何修改操作都创建新字符串
- 丰富的内置方法：大小写转换、查找替换、分割连接、判断验证
- 三种格式化方式：% 格式化、str.format()、f-string（推荐）
- Unicode 支持：Python 3 默认使用 Unicode，正确处理多语言文本
- 编码处理：在 I/O 边界进行编码/解码

**条件语句（if/elif/else）**：
- 使用缩进定义代码块
- 链式比较：`a < b < c`
- 真值测试：`None`、`0`、空容器等被视为 False
- 三元表达式：`x if condition else y`

**for 循环**：
- 遍历任何可迭代对象
- `range()` 生成数字序列
- `enumerate()` 获取索引
- `zip()` 并行遍历
- 列表推导式：简洁高效
- for-else 子句：循环正常结束时执行

**while 循环**：
- 条件为真时重复执行
- 适用于不确定循环次数的场景
- while-else 子句
- 注意避免无限循环

**break/continue/pass**：
- `break`：立即退出循环
- `continue`：跳过当前迭代
- `pass`：占位符

在下一篇文章中，我们将把所有已学知识整合起来，构建一个完整的综合实战项目——名片管理系统。这将是我们 Python 基础速通系列的收官之作，也是对你学习成果的一次全面检验。
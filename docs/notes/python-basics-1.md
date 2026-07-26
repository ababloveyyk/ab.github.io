---
title: Python基础速通Ⅰ——环境搭建与第一个程序
date: 2026-07-26
tags:
  - Python
  - 基础语法
  - 变量
  - 环境搭建
  - 数据类型
categories:
  - Python
---

## 前言

Python 是当今世界上最受欢迎的编程语言之一。从 Web 开发到数据科学，从人工智能到自动化运维，Python 几乎无处不在。它的简洁语法和强大的标准库让初学者能够快速上手，同时也让资深开发者能够高效地构建复杂系统。

本系列教程的目标是带领读者从零开始，系统性地掌握 Python 编程。作为系列的第一篇文章，我们将从最基础的环境搭建开始，逐步深入到变量、数据类型等核心概念。无论你是完全的编程新手，还是从其他语言转过来的开发者，本文都将为你打下坚实的基础。

在开始之前，我想先回答一个许多人都会问的问题：为什么选择 Python？

Python 的设计哲学强调代码的可读性和简洁性。Guido van Rossum 在设计这门语言时，有一个非常重要的理念——"用一种方法，最好是只有一种方法来做一件事"。这种哲学使得 Python 代码看起来像伪代码一样直观。举个例子，如果你想让程序打印"Hello, World!"，在 Python 中只需要一行代码。而在 Java 中，你需要定义类、main 方法、使用 System.out.println。这种简洁性在大型项目中会带来巨大的生产力提升。

Python 的另一个优势是其庞大的生态系统。无论你想做什么，几乎都能在 Python 生态中找到对应的库。做 Web 开发有 Django、Flask、FastAPI；做数据分析有 Pandas、NumPy、Matplotlib；做机器学习有 Scikit-learn、TensorFlow、PyTorch；做爬虫有 Scrapy、BeautifulSoup、Requests。这些库背后都有活跃的社区维护，文档齐全，学习资源丰富。

Python 在行业中的应用也非常广泛。Google 从早期就开始使用 Python，YouTube 最初就是用 Python 开发的。Instagram 的整个后端架构都建立在 Python 之上。NASA 使用 Python 进行科学计算。Netflix 使用 Python 进行数据分析。Spotify 使用 Python 进行后端服务和数据分析。就连金融行业，像高盛、摩根大通这样的公司也在大量使用 Python 进行量化分析和风险管理。

现在，让我们正式开始学习之旅。

## Python 发展历史与版本选择

### Python 的诞生

Python 的历史可以追溯到 1989 年的圣诞节。当时，荷兰程序员 Guido van Rossum 在阿姆斯特丹的 CWI（数学与计算机科学中心）工作，他参与了一个名为 ABC 的语言项目。ABC 是一种教学语言，设计得非常优雅，但最终没有流行起来。

圣诞节期间，Guido 有了一个想法：他想要创造一种语言，这种语言应该继承 ABC 的优点（易读、易学），同时克服 ABC 的缺点（功能有限、扩展性差）。更重要的是，这种语言应该能够与 C 语言无缝集成，以便在需要时调用系统级功能。

Guido 是 Monty Python 的 Flying Circus（一个英国喜剧团体）的粉丝，所以他给这门语言取名为 Python。这也是为什么 Python 社区中经常出现 Monty Python 的梗——比如文档中常见 spam 和 eggs 作为变量名，这源自 Monty Python 的一个经典小品。

### 版本演进

Python 的发展历程中有几个重要的里程碑：

**Python 0.9.0（1991年）**：第一个公开发布版本。已经有了类、异常处理、函数和核心数据类型（list、dict、str）。

**Python 1.0（1994年）**：引入了 lambda、map、filter 和 reduce 等函数式编程工具。

**Python 2.0（2000年）**：引入了列表推导式、垃圾回收系统（基于引用计数+循环检测）和 Unicode 支持。这个版本标志着 Python 开始走向成熟。

**Python 2.7（2010年）**：Python 2 系列的最后一个主要版本，也是使用最广泛的 Python 2 版本。由于大量项目基于 Python 2，这个版本被维护了很长时间，直到 2020 年 1 月 1 日才正式停止支持。

**Python 3.0（2008年）**：这是一个重大变革。Python 3 不向后兼容 Python 2，这导致了社区长达十年的分裂。主要变化包括：print 从语句变为函数，整数除法默认返回浮点数，字符串默认使用 Unicode，range 返回迭代器而不是列表等。

**Python 3.6（2016年）**：引入了 f-string（格式化字符串字面量），这是 Python 3 系列中最受欢迎的特性之一。还引入了变量类型注解、异步生成器、字典保持插入顺序等特性。

**Python 3.8（2019年）**：引入了海象操作符（:=），使得赋值表达式成为可能。还引入了仅位置参数、f-string 支持等号调试等特性。

**Python 3.10（2021年）**：引入了结构模式匹配（match-case），这是 Python 3.x 系列中最重大的语法变化之一。

**Python 3.11（2022年）**：性能大幅提升（比 3.10 快 10-60%），引入了任务组（TaskGroup）和异常组（ExceptionGroup）。

**Python 3.12（2023年）**：进一步优化性能，引入了更好的错误消息、类型参数语法等。

**Python 3.13（2024年）**：引入了实验性的 JIT 编译器、无 GIL 的实验性构建等。

### 版本选择建议

对于初学者来说，应该选择哪个版本呢？答案是：**永远选择最新的 Python 3.x 稳定版本**。

Python 2 已经于 2020 年 1 月 1 日停止支持，不会再收到安全更新。即使你所在的公司有遗留的 Python 2 项目，作为学习者也应该从 Python 3 开始。Python 2 和 Python 3 的核心概念是相同的，学会 Python 3 后，如果有需要，理解 Python 2 代码并不困难。

截至本文写作时（2026 年），推荐的版本是 Python 3.12 或 Python 3.13。如果你使用的操作系统自带了 Python（如 macOS 自带的 Python 2.7 或某些 Linux 发行版自带的 Python 3.8），建议不要直接使用系统 Python，而是另外安装一个最新版本。系统 Python 通常被操作系统内部工具依赖，贸然修改可能导致系统问题。

让我们来验证一下这个建议。下面是一个简单的代码示例，展示如何检查 Python 版本：

```python
import sys

print("Python 版本信息：")
print(f"版本号：{sys.version}")
print(f"版本信息元组：{sys.version_info}")
print(f"主版本：{sys.version_info.major}")
print(f"次版本：{sys.version_info.minor}")
print(f"微版本：{sys.version_info.micro}")

# 检查是否满足最低版本要求
MIN_VERSION = (3, 8)

if sys.version_info >= MIN_VERSION:
    print(f"当前 Python 版本满足最低要求（{MIN_VERSION[0]}.{MIN_VERSION[1]}）")
else:
    print(f"警告：当前 Python 版本过低，请升级到 {MIN_VERSION[0]}.{MIN_VERSION[1]} 或更高版本")
```

运行这段代码，你会看到类似以下的输出：

```
Python 版本信息：
版本号：3.12.0 (main, Oct  2 2023, 10:00:00) [GCC 13.2.0]
版本信息元组：sys.version_info(major=3, minor=12, micro=0, releaselevel='final', serial=0)
主版本：3
次版本：12
微版本：0
当前 Python 版本满足最低要求（3.8）
```

这段代码展示了如何使用 `sys` 模块来获取详细的版本信息。`sys.version_info` 返回一个命名元组，你可以通过属性名（如 `major`、`minor`）或索引来访问各个版本组件。这在编写需要兼容不同 Python 版本的代码时非常有用。

## Python 解释器安装

### Windows 平台安装

Windows 是 Python 学习中最常用的操作系统之一。在 Windows 上安装 Python 有几种方式，下面我们详细介绍推荐的方法。

**方法一：从官网下载安装包（推荐）**

这是最直接、最可靠的方法。步骤如下：

1. 打开浏览器，访问 Python 官方网站：https://www.python.org/downloads/
2. 网站会自动检测你的操作系统，并推荐最新版本。点击黄色的 "Download Python x.x.x" 按钮。
3. 下载完成后，双击运行安装程序。
4. **重要**：在安装界面底部，勾选 "Add Python x.x to PATH" 选项。这个选项会将 Python 添加到系统环境变量中，让你能够在命令行中直接使用 `python` 命令。如果不勾选这个选项，你后续就需要手动配置，对初学者来说容易出错。
5. 点击 "Install Now" 进行默认安装。默认安装会包含 IDLE（Python 自带的简易 IDE）、pip（包管理器）和文档。
6. 等待安装完成，点击 "Close" 关闭安装程序。

安装完成后，验证安装是否成功。打开命令提示符（按 Win+R，输入 cmd，回车），输入以下命令：

```bash
python --version
```

如果显示类似 `Python 3.12.0` 的信息，说明安装成功。

**方法二：使用包管理器（可选）**

如果你熟悉命令行，也可以使用 Windows 的包管理器：

```bash
# 使用 winget（Windows 11 自带）
winget install Python.Python.3.12

# 使用 Chocolatey（需先安装 Chocolatey）
choco install python
```

**方法三：使用 Anaconda（适合数据科学用户）**

如果你主要使用 Python 进行数据科学和机器学习，Anaconda 是一个很好的选择。Anaconda 是一个 Python 发行版，预装了数百个科学计算相关的包，还包括 conda 包管理器和 Jupyter Notebook。

下载地址：https://www.anaconda.com/download

安装过程与标准 Python 类似，但 Anaconda 会额外安装很多包，占用空间较大（约 3GB）。

### Linux 平台安装

大多数 Linux 发行版都预装了 Python 3，但通常不是最新版本。以下是在不同 Linux 发行版上安装最新 Python 的方法。

**Ubuntu/Debian 系统：**

```bash
# 更新包列表
sudo apt update

# 安装 Python 3.12
sudo apt install python3.12 python3.12-venv python3.12-dev

# 安装 pip（Python 包管理器）
sudo apt install python3-pip

# 验证安装
python3.12 --version
```

**Fedora 系统：**

```bash
# 安装 Python 3.12
sudo dnf install python3.12

# 验证安装
python3.12 --version
```

**Arch Linux 系统：**

```bash
# 安装 Python（Arch 通常提供最新版本）
sudo pacman -S python

# 验证安装
python --version
```

**从源码编译安装（高级选项）：**

如果你需要特定版本的 Python 或者想要自定义编译选项，可以从源码编译安装：

```bash
# 安装编译依赖
sudo apt install build-essential zlib1g-dev libncurses5-dev \
  libgdbm-dev libnss3-dev libssl-dev libreadline-dev \
  libffi-dev libsqlite3-dev wget libbz2-dev

# 下载 Python 源码
wget https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz
tar -xf Python-3.12.0.tgz
cd Python-3.12.0

# 配置编译选项
./configure --enable-optimizations --prefix=/usr/local/python3.12

# 编译并安装（-j 参数指定并行编译的线程数）
make -j$(nproc)
sudo make altinstall

# 验证安装
/usr/local/python3.12/bin/python3.12 --version
```

使用 `make altinstall` 而不是 `make install` 是为了避免覆盖系统默认的 Python。

### 虚拟环境

在安装了 Python 之后，强烈建议你了解虚拟环境的概念。虚拟环境是 Python 开发中的一个重要实践，它允许你为每个项目创建独立的 Python 运行环境，避免不同项目之间的包依赖冲突。

创建和使用虚拟环境的基本命令：

```python
# 创建虚拟环境（在项目目录下）
python -m venv myenv

# 激活虚拟环境
# Windows:
myenv\Scripts\activate
# Linux/macOS:
source myenv/bin/activate

# 在虚拟环境中安装包
pip install requests

# 退出虚拟环境
deactivate
```

下面是一个完整的 Python 脚本，演示如何检查当前是否在虚拟环境中运行：

```python
import sys
import os

def check_venv():
    """
    检查当前 Python 是否运行在虚拟环境中
    """
    # 方法1：检查 sys.prefix 是否与 sys.base_prefix 不同
    in_venv = sys.prefix != sys.base_prefix
    
    # 方法2：检查 VIRTUAL_ENV 环境变量
    venv_path = os.environ.get('VIRTUAL_ENV', None)
    
    print("=" * 50)
    print("Python 环境信息")
    print("=" * 50)
    print(f"sys.prefix:      {sys.prefix}")
    print(f"sys.base_prefix: {sys.base_prefix}")
    print(f"VIRTUAL_ENV:     {venv_path}")
    print(f"是否在虚拟环境中: {in_venv}")
    print(f"Python 可执行文件: {sys.executable}")
    print(f"sys.path:")
    for i, p in enumerate(sys.path, 1):
        print(f"  [{i}] {p}")
    print("=" * 50)

if __name__ == "__main__":
    check_venv()
```

运行这段代码，你会看到详细的 Python 环境信息。如果是在虚拟环境中，`sys.prefix` 会指向虚拟环境目录，而 `sys.base_prefix` 会指向基础 Python 安装目录。这个差异是判断是否在虚拟环境中的最可靠方法。

## 第一个 Python 程序

### Hello, World!

按照编程界的传统，学习任何语言的第一步都是写一个 "Hello, World!" 程序。在 Python 中，这非常简单。

```python
# 这是我的第一个 Python 程序
print("Hello, World!")
```

将上述代码保存为 `hello.py`，然后在命令行中运行：

```bash
python hello.py
```

你会看到输出：

```
Hello, World!
```

虽然只有一行代码，但其中包含了很多信息。让我们来详细分析：

`print()` 是 Python 的内置函数，用于将内容输出到控制台。括号中的 `"Hello, World!"` 是一个字符串（string），用双引号括起来。在 Python 中，字符串可以用单引号（`'...'`）、双引号（`"..."`）或三引号（`'''...'''` 或 `"""..."""`）来表示。

### 交互式模式

除了将代码写入文件再运行，Python 还提供了交互式模式（REPL：Read-Eval-Print Loop，读取-求值-输出-循环）。在命令行中输入 `python`（不跟文件名），即可进入交互式模式：

```bash
$ python
Python 3.12.0 (main, Oct  2 2023, 10:00:00) [GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> print("Hello from REPL!")
Hello from REPL!
>>> 1 + 2
3
>>> "Python" * 3
'PythonPythonPython'
```

在交互式模式中，每输入一行代码，Python 就会立即执行并显示结果。`>>>` 是提示符，表示 Python 正在等待输入。这种即时反馈的机制对于学习和实验非常有用。

### 更多 print 用法

`print()` 函数的功能远不止输出一段文本。让我们通过一系列示例来探索它的各种用法。

```python
# 示例1：输出多个值
print("Python", "is", "awesome")
# 输出：Python is awesome
# 默认用空格分隔多个参数

# 示例2：自定义分隔符
print("Python", "is", "awesome", sep="|")
# 输出：Python|is|awesome
# sep 参数指定分隔符，默认为空格

# 示例3：自定义结束符
print("Hello", end="...")
print("World")
# 输出：Hello...World
# end 参数指定结尾字符，默认为换行符 \n

# 示例4：输出到文件
with open("output.txt", "w") as f:
    print("This goes to a file!", file=f)
# 打开 output.txt 文件，你会看到写入的内容

# 示例5：使用 f-string 格式化输出
name = "Alice"
age = 25
print(f"My name is {name} and I am {age} years old.")
# 输出：My name is Alice and I am 25 years old.

# 示例6：格式化数字
pi = 3.14159265
print(f"Pi is approximately {pi:.2f}")
# 输出：Pi is approximately 3.14
# :.2f 表示保留两位小数

# 示例7：对齐输出
print(f"{'Name':<10} {'Age':>5}")
print(f"{'Alice':<10} {25:>5}")
print(f"{'Bob':<10} {30:>5}")
print(f"{'Charlie':<10} {35:>5}")
# 输出：
# Name       Age
# Alice       25
# Bob         30
# Charlie     35
# < 表示左对齐，> 表示右对齐，数字表示宽度
```

这段代码展示了 `print()` 函数的多种用法。`sep` 参数用于指定多个参数之间的分隔符，默认是空格。`end` 参数指定输出结束时的字符，默认是换行符。`file` 参数允许将输出重定向到文件。f-string（格式化字符串字面量）是 Python 3.6 引入的特性，它让你可以在字符串中直接嵌入表达式，非常方便。

### 注释

注释是代码中不会被执行的文字，用于解释代码的功能和逻辑。良好的注释习惯是编程的基本素养。

```python
# 这是一个单行注释
# Python 使用 # 号来标记注释

print("Hello")  # 注释也可以放在代码后面

"""
这是一个多行注释（实际上是多行字符串）
Python 没有专门的多行注释语法，
但可以使用三引号字符串作为注释。
"""

'''
也可以用单引号的三引号形式
'''

# 注释的最佳实践：
# 1. 注释应该解释"为什么"而不是"什么"
# 2. 代码本身应该清晰地表达"什么"
# 3. 不要注释显而易见的代码

# 不好的注释示例：
x = 5  # 将 5 赋值给 x（这太明显了，没必要注释）

# 好的注释示例：
MAX_RETRY_COUNT = 5  # 经过测试，5次重试平衡了成功率和等待时间
```

注释是写给未来的自己或其他开发者看的。好的注释能够解释设计决策、标记注意事项、说明复杂算法的逻辑。但也要注意，过多或不必要的注释反而会降低代码的可读性。

## 变量与动态类型

### 变量的概念

变量是程序中最基本的概念之一。你可以把变量想象成一个带有标签的盒子：标签是变量名，盒子里装的是数据。在 Python 中，变量不需要声明类型，直接赋值即可使用。

```python
# 变量赋值
name = "Alice"          # 字符串
age = 25                # 整数
height = 1.68           # 浮点数
is_student = True       # 布尔值

# 打印变量
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Is student: {is_student}")
```

这段代码展示了 Python 中最基本的变量赋值。注意，我们不需要像 C 或 Java 那样指定变量类型（如 `int age = 25;`）。Python 会根据赋值自动推断类型。

### 动态类型

Python 是动态类型语言，这意味着变量的类型在运行时确定，并且可以在程序运行过程中改变。

```python
# 动态类型演示
x = 10
print(f"x = {x}, type = {type(x)}")  # x = 10, type = <class 'int'>

x = "Hello"
print(f"x = {x}, type = {type(x)}")  # x = Hello, type = <class 'str'>

x = [1, 2, 3]
print(f"x = {x}, type = {type(x)}")  # x = [1, 2, 3], type = <class 'list'>

x = 3.14
print(f"x = {x}, type = {type(x)}")  # x = 3.14, type = <class 'float'>

# 同一个变量 x 先后被赋值为整数、字符串、列表和浮点数
# 这在静态类型语言（如 Java、C++）中是不允许的
```

动态类型带来了极大的灵活性，但也有一些注意事项。由于类型检查发生在运行时，如果你在代码中错误地假设了变量的类型，可能会导致运行时错误。

```python
# 动态类型的潜在问题
a = 10
b = "20"

# 这行代码会报错：TypeError
# result = a + b
# 因为 Python 不知道如何将整数和字符串相加

# 正确的做法是显式转换类型
result = a + int(b)
print(f"Result: {result}")  # Result: 30

# 或者将整数转换为字符串后拼接
result_str = str(a) + b
print(f"Result string: {result_str}")  # Result string: 1020
```

### 变量命名规则

Python 的变量命名遵循以下规则：

1. 变量名只能包含字母、数字和下划线（`_`）
2. 变量名不能以数字开头
3. 变量名区分大小写（`name` 和 `Name` 是不同的变量）
4. 不能使用 Python 关键字（如 `if`、`for`、`class` 等）
5. 按照惯例，使用小写字母和下划线命名（snake_case）

```python
# 合法的变量名
my_variable = 1
_variable = 2
variable_1 = 3
userName = 4      # 合法但不推荐（驼峰命名在 Python 中不常见）
MY_CONSTANT = 5   # 全大写通常用于常量

# 不合法的变量名（取消注释会导致语法错误）
# 1variable = 1     # 不能以数字开头
# my-variable = 2   # 不能包含连字符
# my variable = 3   # 不能包含空格
# class = 4         # 不能使用关键字
# if = 5            # 不能使用关键字

# 查看 Python 的所有关键字
import keyword
print("Python 关键字列表：")
print(keyword.kwlist)
```

运行上述代码，你会看到 Python 的所有关键字。这些关键字在语言中有特殊含义，不能被用作变量名。

### 多重赋值与交换

Python 支持一种优雅的多重赋值语法，可以同时给多个变量赋值，也可以不使用临时变量交换两个变量的值。

```python
# 多重赋值
a, b, c = 1, 2, 3
print(f"a = {a}, b = {b}, c = {c}")

# 交换变量（无需临时变量）
x, y = 10, 20
print(f"交换前：x = {x}, y = {y}")
x, y = y, x
print(f"交换后：x = {x}, y = {y}")

# 解包赋值
numbers = [1, 2, 3, 4, 5]
first, second, *rest = numbers
print(f"first = {first}, second = {second}, rest = {rest}")
# first = 1, second = 2, rest = [3, 4, 5]

# 丢弃不需要的值（使用下划线）
data = ("Alice", 25, "Engineer", "New York", "12345")
name, age, *_ = data
print(f"name = {name}, age = {age}")
# _ 作为占位符，表示我们不关心这些值

# 链式赋值
a = b = c = 100
print(f"a = {a}, b = {b}, c = {c}")
```

多重赋值是 Python 中非常实用的特性。`x, y = y, x` 这种交换变量的写法在底层实际上是先创建一个元组 `(y, x)`，然后将其解包赋值给 `x` 和 `y`。这比使用临时变量更加简洁和 Pythonic。

## 基本数据类型

Python 提供了丰富的内置数据类型。在本节中，我们将详细介绍五种最常用的基本类型：整数（int）、浮点数（float）、布尔值（bool）、字符串（str）和 NoneType。

### 整数（int）

整数是最基本的数值类型。在 Python 3 中，整数类型没有大小限制（只受内存限制），这意味着你可以处理任意大的整数，而不需要像其他语言那样担心溢出问题。

```python
# 整数基本操作
a = 10
b = 3

print(f"a + b = {a + b}")   # 加法：13
print(f"a - b = {a - b}")   # 减法：7
print(f"a * b = {a * b}")   # 乘法：30
print(f"a / b = {a / b}")   # 除法（返回浮点数）：3.333...
print(f"a // b = {a // b}")  # 整除（地板除）：3
print(f"a % b = {a % b}")   # 取余（模运算）：1
print(f"a ** b = {a ** b}")  # 幂运算：1000

# 大整数运算
big_number = 2 ** 100
print(f"2的100次方 = {big_number}")
# 2的100次方 = 1267650600228229401496703205376
# Python 可以轻松处理这么大的数字

# 整数进制表示
binary = 0b1010     # 二进制（以 0b 开头）
octal = 0o12        # 八进制（以 0o 开头）
hexadecimal = 0xA   # 十六进制（以 0x 开头）

print(f"二进制 0b1010 = {binary}")           # 10
print(f"八进制 0o12 = {octal}")              # 10
print(f"十六进制 0xA = {hexadecimal}")       # 10

# 进制转换函数
num = 255
print(f"十进制 {num} 的二进制表示：{bin(num)}")    # 0b11111111
print(f"十进制 {num} 的八进制表示：{oct(num)}")    # 0o377
print(f"十进制 {num} 的十六进制表示：{hex(num)}")  # 0xff

# 使用 int() 进行进制转换
print(f"二进制字符串 '11111111' = {int('11111111', 2)}")   # 255
print(f"十六进制字符串 'FF' = {int('FF', 16)}")             # 255
```

整数除法（`/`）和整除（`//`）的区别是 Python 3 中的一个重要变化。在 Python 2 中，整数除法默认返回整数（截断），这导致了很多隐蔽的错误。Python 3 将其改为返回浮点数，使得除法行为更加直观。

### 浮点数（float）

浮点数用于表示带小数点的数字。Python 中的浮点数遵循 IEEE 754 双精度标准（64位），精度约为 15-17 位有效数字。

```python
# 浮点数基本操作
pi = 3.14159
radius = 2.5
area = pi * radius ** 2
print(f"圆的面积：{area}")

# 科学计数法
speed_of_light = 3e8          # 3 × 10^8
electron_mass = 9.10938356e-31  # 9.10938356 × 10^(-31)
print(f"光速：{speed_of_light}")
print(f"电子质量：{electron_mass}")

# 浮点数精度问题
print(f"0.1 + 0.2 = {0.1 + 0.2}")
# 输出：0.1 + 0.2 = 0.30000000000000004
# 这不是 Python 的 bug，而是 IEEE 754 浮点数的固有限制

# 处理浮点数精度问题
from decimal import Decimal
print(f"使用 Decimal：{Decimal('0.1') + Decimal('0.2')}")
# 使用 Decimal：0.3

# 浮点数比较
# 不要直接比较浮点数是否相等
a = 0.1 + 0.2
b = 0.3
# 错误方式：
print(f"a == b: {a == b}")  # False!

# 正确方式：使用一个很小的容差
epsilon = 1e-10
print(f"abs(a - b) < epsilon: {abs(a - b) < epsilon}")  # True

import math
print(f"math.isclose(a, b): {math.isclose(a, b)}")  # True

# 浮点数特殊值
print(f"无穷大：{float('inf')}")
print(f"负无穷大：{float('-inf')}")
print(f"NaN（非数字）：{float('nan')}")

# 检查特殊值
inf = float('inf')
print(f"isinf: {math.isinf(inf)}")    # True
print(f"isfinite: {math.isfinite(inf)}")  # False
nan = float('nan')
print(f"isnan: {math.isnan(nan)}")    # True
# 注意：NaN 不等于任何值，包括它自己
print(f"nan == nan: {nan == nan}")    # False
```

浮点数精度问题是一个非常重要的知识点。由于计算机使用二进制表示浮点数，某些十进制小数无法精确表示（就像十进制无法精确表示 1/3 一样）。在进行金融计算等需要精确结果的场景中，应该使用 `Decimal` 类型或将数值转换为整数（如以"分"为单位）。

### 布尔值（bool）

布尔值只有两个可能的值：`True` 和 `False`。在 Python 中，`bool` 是 `int` 的子类，`True` 等于 `1`，`False` 等于 `0`。

```python
# 布尔值基本操作
t = True
f = False

print(f"True and False = {t and f}")    # False
print(f"True or False = {t or f}")      # True
print(f"not True = {not t}")            # False

# 布尔值作为整数
print(f"True + True = {True + True}")   # 2
print(f"True + False = {True + False}") # 1
print(f"True * 5 = {True * 5}")         # 5

# 比较运算符
x, y = 10, 20
print(f"x == y: {x == y}")      # False (等于)
print(f"x != y: {x != y}")      # True  (不等于)
print(f"x < y: {x < y}")        # True  (小于)
print(f"x > y: {x > y}")        # False (大于)
print(f"x <= y: {x <= y}")      # True  (小于等于)
print(f"x >= y: {x >= y}")      # False (大于等于)

# 身份运算符
a = [1, 2, 3]
b = [1, 2, 3]
c = a
print(f"a == b: {a == b}")      # True  (值相等)
print(f"a is b: {a is b}")      # False (不是同一个对象)
print(f"a is c: {a is c}")      # True  (同一个对象)

# 成员运算符
numbers = [1, 2, 3, 4, 5]
print(f"3 in numbers: {3 in numbers}")        # True
print(f"6 in numbers: {6 in numbers}")        # False
print(f"6 not in numbers: {6 not in numbers}") # True

# 真值测试
# 以下值被认为是 False：
# False, None, 0, 0.0, '', "", [], (), {}, set(), range(0)
print(f"bool(0) = {bool(0)}")           # False
print(f"bool(1) = {bool(1)}")           # True
print(f"bool('') = {bool('')}")         # False
print(f"bool('hello') = {bool('hello')}") # True
print(f"bool([]) = {bool([])}")         # False
print(f"bool([1, 2]) = {bool([1, 2])}")  # True
print(f"bool(None) = {bool(None)}")     # False

# 短路求值
# and: 如果第一个为 False，不会计算第二个
# or: 如果第一个为 True，不会计算第二个
def true_func():
    print("true_func called")
    return True

def false_func():
    print("false_func called")
    return False

print("短路求值演示：")
print(f"True or ...: {True or true_func()}")   # true_func 不会被调用
print(f"False and ...: {False and true_func()}") # true_func 不会被调用
```

理解 `is` 和 `==` 的区别很重要。`==` 比较的是值是否相等，而 `is` 比较的是两个变量是否指向同一个对象（即内存地址是否相同）。在大多数情况下，你应该使用 `==` 来比较值。

### 字符串（str）

字符串是 Python 中最常用的数据类型之一。Python 中的字符串是不可变的（immutable）Unicode 序列。

```python
# 字符串创建方式
s1 = 'Hello'              # 单引号
s2 = "World"              # 双引号
s3 = '''Multi-line
string'''                 # 三引号（可跨行）
s4 = """Also multi-line
string"""                 # 双引号三引号
s5 = str(123)             # 使用 str() 转换

print(f"s1: {s1}")
print(f"s2: {s2}")
print(f"s3: {s3}")
print(f"s5: {s5}")

# 字符串基本操作
# 拼接
greeting = s1 + " " + s2
print(f"拼接：{greeting}")  # Hello World

# 重复
print(f"重复：{'Ha' * 3}")  # HaHaHa

# 长度
print(f"长度：{len(greeting)}")  # 11

# 索引（从0开始）
print(f"第一个字符：{greeting[0]}")    # H
print(f"最后一个字符：{greeting[-1]}")  # d
print(f"倒数第二个字符：{greeting[-2]}") # l

# 切片 [start:end:step]
print(f"前5个字符：{greeting[:5]}")     # Hello
print(f"后5个字符：{greeting[-5:]}")    # World
print(f"每隔一个字符：{greeting[::2]}")  # HloWrd
print(f"反转：{greeting[::-1]}")        # dlroW olleH

# 字符串不可变性
# greeting[0] = 'h'  # 这会报错！TypeError
# 必须创建新字符串
new_greeting = 'h' + greeting[1:]
print(f"修改后的字符串：{new_greeting}")  # hello World

# 转义字符
print("换行符：\\n -> 第一行\n第二行")
print("制表符：\\t -> 列1\t列2\t列3")
print("反斜杠本身：\\\\")
print("引号：\\\"Hello\\\" 或 'Hello'")

# 原始字符串（不转义）
path = r"C:\Users\name\Documents"
print(f"原始字符串：{path}")
# 输出：C:\Users\name\Documents
# 如果没有 r 前缀，\n 会被解释为换行符

# 字符串常用方法
text = "  Hello, Python World!  "
print(f"原始文本：'{text}'")
print(f"strip()：'{text.strip()}'")           # 去除两端空白
print(f"lower()：'{text.lower()}'")           # 转小写
print(f"upper()：'{text.upper()}'")           # 转大写
print(f"replace()：'{text.replace('Python', 'Java')}'")  # 替换
print(f"split()：{text.split(',')}")           # 分割
print(f"find('Python')：{text.find('Python')}")  # 查找位置
print(f"count('l')：{text.count('l')}")        # 计数
print(f"startswith('  He')：{text.startswith('  He')}")  # 是否以...开头
print(f"endswith('!'): {text.endswith('!')}")  # 是否以...结尾
```

字符串是 Python 中功能最丰富的类型之一，它有数十个内置方法。上面只展示了最常用的一些。在实际开发中，字符串处理是非常常见的任务，掌握这些方法将大大提高你的开发效率。

### NoneType

`None` 是 Python 中表示"无"或"空"的特殊值。它是 `NoneType` 类型的唯一实例。

```python
# None 的基本用法
result = None
print(f"result = {result}")
print(f"type of None: {type(None)}")

# None 的常见用途
# 1. 函数默认参数
def greet(name=None):
    if name is None:
        print("Hello, stranger!")
    else:
        print(f"Hello, {name}!")

greet()           # Hello, stranger!
greet("Alice")    # Hello, Alice!

# 2. 表示"没有找到"的结果
def find_user(user_id):
    # 模拟数据库查询
    users = {1: "Alice", 2: "Bob", 3: "Charlie"}
    return users.get(user_id)  # 如果找不到，返回 None

user = find_user(4)
if user is None:
    print("用户不存在")
else:
    print(f"找到用户：{user}")

# 3. None 的比较
# 应该使用 "is" 而不是 "==" 来比较 None
x = None
print(f"x is None: {x is None}")      # True（推荐方式）
print(f"x == None: {x == None}")      # True（不推荐，可能被重载）

# 4. None 在布尔上下文中被视为 False
if None:
    print("这不会被执行")
else:
    print("None 被视为 False")

# 5. None 和空列表/空字符串/0 的区别
# None 表示"不存在"，空列表表示"存在但为空"
data_none = None
data_empty = []

if data_none is None:
    print("data_none 是 None，表示没有数据")

if data_empty is not None and len(data_empty) == 0:
    print("data_empty 是空列表，表示有数据容器但内容为空")
```

理解 `None` 和空值（如空字符串 `""`、空列表 `[]`、数字 `0`）的区别很重要。`None` 表示"不存在"，而空值表示"存在但为空"。在 API 设计中，这个区别至关重要。

## type() 与 isinstance() 类型检查

### type() 函数

`type()` 是 Python 中用于获取对象类型的内置函数。它返回对象的类型对象。

```python
# type() 基本用法
print(f"type(42) = {type(42)}")                    # <class 'int'>
print(f"type(3.14) = {type(3.14)}")                # <class 'float'>
print(f"type('hello') = {type('hello')}")          # <class 'str'>
print(f"type(True) = {type(True)}")                # <class 'bool'>
print(f"type(None) = {type(None)}")                # <class 'NoneType'>
print(f"type([1, 2, 3]) = {type([1, 2, 3])}")     # <class 'list'>
print(f"type((1, 2)) = {type((1, 2))}")            # <class 'tuple'>
print(f"type({'a': 1}) = {type({'a': 1})}")        # <class 'dict'>
print(f"type({1, 2}) = {type({1, 2})}")            # <class 'set'>
print(f"type(print) = {type(print)}")              # <class 'builtin_function_or_method'>

# type() 比较
x = 42
print(f"type(x) == int: {type(x) == int}")         # True
print(f"type(x) == float: {type(x) == float}")     # False
print(f"type(x) == str: {type(x) == str}")         # False

# 获取类型名称
print(f"type(x).__name__: {type(x).__name__}")     # 'int'
```

`type()` 虽然简单直接，但在类型检查时有一个局限性：它不检查继承关系。如果你有一个自定义类继承自 `int`，`type()` 会返回该自定义类的类型，而不是 `int`。

### isinstance() 函数

`isinstance()` 是更推荐的类型检查函数，因为它会考虑继承关系。它接受两个参数：要检查的对象和类型（或类型元组）。

```python
# isinstance() 基本用法
x = 42
print(f"isinstance(x, int): {isinstance(x, int)}")       # True
print(f"isinstance(x, float): {isinstance(x, float)}")   # False
print(f"isinstance(x, str): {isinstance(x, str)}")       # False

# isinstance 与 type 的区别
# isinstance 考虑继承关系
class MyInt(int):
    """自定义整数类，继承自 int"""
    pass

y = MyInt(42)
print(f"\ntype(y) == int: {type(y) == int}")             # False
print(f"isinstance(y, int): {isinstance(y, int)}")       # True
# 这是因为 isinstance 会检查继承链

# 检查多个类型
def process_value(value):
    if isinstance(value, (int, float)):
        print(f"数值类型：{value * 2}")
    elif isinstance(value, str):
        print(f"字符串类型：{value.upper()}")
    elif isinstance(value, (list, tuple)):
        print(f"序列类型：长度为 {len(value)}")
    else:
        print(f"未知类型：{type(value).__name__}")

process_value(42)          # 数值类型：84
process_value(3.14)        # 数值类型：6.28
process_value("hello")     # 字符串类型：HELLO
process_value([1, 2, 3])   # 序列类型：长度为 3
process_value(None)        # 未知类型：NoneType

# isinstance 与鸭子类型
# Python 通常更推荐鸭子类型（duck typing）：
# "如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子"
# 但在某些情况下，类型检查是必要的
```

### 何时使用类型检查

虽然 Python 是动态类型语言，但类型检查在某些场景下是必要的：

```python
# 场景1：处理多种输入类型
def add(a, b):
    """安全地相加两个值，支持字符串拼接"""
    if isinstance(a, str) or isinstance(b, str):
        return str(a) + str(b)
    return a + b

print(add(1, 2))          # 3
print(add("Hello", "World"))  # HelloWorld
print(add(1, "abc"))      # 1abc

# 场景2：递归函数中的类型检查
def flatten(nested_list):
    """展平嵌套列表"""
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

nested = [1, [2, [3, 4], 5], 6, [7, 8]]
print(f"展平结果：{flatten(nested)}")  # [1, 2, 3, 4, 5, 6, 7, 8]

# 场景3：检查可迭代对象
from collections.abc import Iterable

def show_items(items):
    if not isinstance(items, Iterable):
        print("参数必须是可迭代对象")
        return
    for i, item in enumerate(items, 1):
        print(f"  [{i}] {item}")

show_items(["apple", "banana", "cherry"])
# show_items(42)  # 这会输出"参数必须是可迭代对象"

# 场景4：函数参数验证
def safe_divide(a, b):
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("参数必须是数字类型")
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b

print(f"safe_divide(10, 3) = {safe_divide(10, 3)}")
```

在实际开发中，`isinstance()` 比 `type()` 更常用，因为它更灵活，支持继承和多态。但也要记住 Python 的哲学——"请求原谅比请求许可更容易"（EAFP：Easier to Ask for Forgiveness than Permission）。在可能的情况下，使用 `try/except` 捕获异常比事先进行类型检查更加 Pythonic。

## 综合实战：个人信息卡片

在学习了以上所有基础知识后，让我们来做一个综合练习，将所有知识点串联起来。我们将编写一个程序，读取用户输入，创建一个格式化的个人信息卡片。

```python
"""
个人信息卡片生成器
这是一个综合练习，涵盖了变量、数据类型、字符串操作、输入输出等知识点
"""

def create_personal_card():
    """创建并显示个人信息卡片"""
    
    print("=" * 50)
    print("个人信息卡片生成器")
    print("=" * 50)
    
    # 获取用户输入
    name = input("请输入姓名：")
    age_str = input("请输入年龄：")
    height_str = input("请输入身高（米）：")
    weight_str = input("请输入体重（公斤）：")
    city = input("请输入所在城市：")
    occupation = input("请输入职业：")
    hobby = input("请输入爱好（多个用逗号分隔）：")
    
    # 数据类型转换和验证
    try:
        age = int(age_str)
        height = float(height_str)
        weight = float(weight_str)
    except ValueError as e:
        print(f"输入错误：{e}，请确保年龄和身高体重为有效数字")
        return
    
    # 计算 BMI
    bmi = weight / (height ** 2)
    
    # 判断 BMI 类别
    if bmi < 18.5:
        bmi_category = "偏瘦"
    elif bmi < 24:
        bmi_category = "正常"
    elif bmi < 28:
        bmi_category = "偏胖"
    else:
        bmi_category = "肥胖"
    
    # 处理爱好
    hobbies = [h.strip() for h in hobby.split(",")]
    
    # 判断年龄段
    if age < 18:
        age_group = "青少年"
    elif age < 35:
        age_group = "青年"
    elif age < 55:
        age_group = "中年"
    else:
        age_group = "老年"
    
    # 生成唯一的 ID（模拟）
    import hashlib
    unique_string = f"{name}{age}{city}"
    card_id = hashlib.md5(unique_string.encode()).hexdigest()[:8].upper()
    
    # 打印美化后的卡片
    print("\n" + "=" * 50)
    print("        个人信息卡片")
    print("=" * 50)
    print(f"  卡片 ID:    {card_id}")
    print(f"  姓名:       {name}")
    print(f"  年龄:       {age} 岁 ({age_group})")
    print(f"  身高:       {height} 米")
    print(f"  体重:       {weight} 公斤")
    print(f"  BMI:        {bmi:.1f} ({bmi_category})")
    print(f"  城市:       {city}")
    print(f"  职业:       {occupation}")
    print(f"  爱好:       {', '.join(hobbies)}")
    print("-" * 50)
    print(f"  爱好数量:   {len(hobbies)} 个")
    print(f"  姓名长度:   {len(name)} 个字符")
    print(f"  姓名首字母: {name[0].upper() if name else '?'}")
    print(f"  数据类型检查:")
    print(f"    name 是 str:     {isinstance(name, str)}")
    print(f"    age 是 int:      {isinstance(age, int)}")
    print(f"    height 是 float: {isinstance(height, float)}")
    print(f"    hobbies 是 list: {isinstance(hobbies, list)}")
    print("=" * 50)
    
    # 返回数据字典，方便后续使用
    return {
        "id": card_id,
        "name": name,
        "age": age,
        "height": height,
        "weight": weight,
        "bmi": round(bmi, 1),
        "bmi_category": bmi_category,
        "age_group": age_group,
        "city": city,
        "occupation": occupation,
        "hobbies": hobbies
    }


# 运行程序
if __name__ == "__main__":
    card_data = create_personal_card()
    
    # 演示如何使用返回的数据
    if card_data:
        print("\n返回的数据字典：")
        for key, value in card_data.items():
            print(f"  {key}: {value}")
```

这个综合练习涵盖了本文中几乎所有知识点：

1. **变量**：用于存储姓名、年龄、身高等信息
2. **数据类型**：int（年龄）、float（身高、体重、BMI）、str（姓名、城市）、bool（类型检查）、list（爱好列表）
3. **type() 和 isinstance()**：用于类型检查
4. **字符串操作**：split()、strip()、join()、upper()、f-string 格式化
5. **输入输出**：input() 获取用户输入，print() 格式化输出
6. **异常处理**：try/except 捕获类型转换错误
7. **条件判断**：if/elif/else 判断 BMI 类别和年龄段
8. **列表推导式**：`[h.strip() for h in hobby.split(",")]`

## 总结

本文作为 Python 基础速通系列的第一篇文章，从零开始介绍了 Python 编程的核心基础知识。让我们回顾一下本文涵盖的主要内容：

**Python 发展历史与版本选择**：我们了解了 Python 从 1989 年诞生至今的发展历程，以及 Python 2 和 Python 3 的关键区别。对于新学习者，建议始终选择最新的 Python 3.x 稳定版本。

**环境搭建**：我们详细介绍了在 Windows 和 Linux 平台上安装 Python 的多种方法，包括官网下载安装、包管理器安装和源码编译安装。同时介绍了虚拟环境的概念和基本使用，这是 Python 项目开发的最佳实践。

**第一个 Python 程序**：从经典的 "Hello, World!" 开始，我们学习了 `print()` 函数的多种用法，包括分隔符、结束符、文件输出、f-string 格式化等。还介绍了交互式模式（REPL）和注释的使用。

**变量与动态类型**：变量是程序的基础，Python 的动态类型系统让变量使用更加灵活。我们学习了变量命名规则、多重赋值、动态类型的优势和注意事项。

**基本数据类型**：深入介绍了 Python 的五大基本类型——整数（int）的任意精度和大数运算、浮点数（float）的精度问题和处理方法、布尔值（bool）的真值测试和短路求值、字符串（str）的索引切片和丰富方法、NoneType 的含义和用法。

**类型检查**：学习了 `type()` 和 `isinstance()` 两个类型检查函数，理解了它们的区别和适用场景，以及在 Python 中何时应该进行类型检查。

**综合实战**：通过一个个人信息卡片生成器的完整项目，将所学知识串联起来，展示了如何在实际项目中综合运用这些基础概念。

掌握这些基础知识后，你已经具备了编写简单 Python 程序的能力。在下一篇文章中，我们将深入学习 Python 中最常用的容器类型——列表和元组，它们是构建复杂数据结构的基础。

Python 的学习曲线相对平缓，但要想真正掌握它，需要大量的实践。建议你：
- 将本文中的每个代码示例都亲手运行一遍
- 尝试修改代码，观察结果的变化
- 用所学知识解决自己遇到的实际问题
- 遇到错误时，仔细阅读错误信息，这是最好的学习机会

记住，编程是一门实践性很强的技能。就像学游泳一样，阅读再多的教程也不如亲自下水练习。祝你学习愉快！
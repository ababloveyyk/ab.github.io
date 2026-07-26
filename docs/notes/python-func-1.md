---
title: Python函数与高级特性Ⅰ——函数基础
date: 2026-07-26
tags:
  - Python
  - 函数
  - 参数
  - 返回值
  - 文档字符串
categories:
  - Python
---

## 前言

在 Python 基础速通系列中，我们学习了变量、数据类型、容器、字符串和流程控制。这些知识让我们能够编写简单的程序。但在实际开发中，我们通常需要将代码组织成可复用的单元——这就是函数。

函数是编程中最基本也是最重要的抽象机制。它允许我们给一段代码命名，通过参数接收输入，通过返回值输出结果。好的函数就像一个"黑盒"——使用者只需要知道它做什么，而不需要关心它怎么做。这种抽象极大地降低了程序的复杂度。

Python 的函数机制非常灵活。它支持多种参数类型（位置参数、默认参数、关键字参数、可变参数），支持返回多个值，支持文档字符串，甚至支持函数作为一等公民（可以赋值给变量、作为参数传递、作为返回值）。这些特性使得 Python 在函数式编程方面同样表现出色。

本文将系统地介绍 Python 函数的所有基础知识，包括函数定义与调用、各种参数类型、返回值、文档字符串等。我们将通过大量实际示例来展示每个概念的正确用法。

## 函数定义与调用

### 基本语法

在 Python 中，使用 `def` 关键字定义函数，后跟函数名、括号内的参数列表和冒号。函数体使用缩进。

```python
# 函数定义的基本语法
print("=" * 60)
print("函数定义与调用")
print("=" * 60)

# 最简单的函数（无参数，无返回值）
def say_hello():
    """打印问候语"""
    print("Hello, World!")

# 调用函数
say_hello()
say_hello()

# 带参数的函数
def greet(name):
    """向指定的人打招呼"""
    print(f"Hello, {name}!")

greet("Alice")
greet("Bob")

# 带返回值的函数
def add(a, b):
    """返回两个数的和"""
    return a + b

result = add(3, 5)
print(f"3 + 5 = {result}")

# 函数名本身是一个对象
print(f"add 函数的类型：{type(add)}")
print(f"add 函数的名字：{add.__name__}")
print(f"add 函数的文档：{add.__doc__}")
```

函数定义后，函数名成为一个函数对象。你可以像使用其他对象一样使用它——赋值给变量、作为参数传递、甚至作为返回值。

### 函数调用的过程

当你调用一个函数时，Python 会执行以下步骤：

1. 将实参（调用时传入的值）绑定到形参（函数定义时的参数名）
2. 执行函数体中的代码
3. 执行到 `return` 语句时，返回指定的值
4. 如果没有 `return` 语句，函数返回 `None`

```python
# 函数调用过程详解
print("=" * 60)
print("函数调用过程")
print("=" * 60)

def demonstrate_call(x, y):
    """演示函数调用过程"""
    print(f"  函数内部：x = {x}, y = {y}")
    result = x * y
    print(f"  函数内部：result = {result}")
    return result

print("调用前")
a = 5
b = 3
print(f"调用前：a = {a}, b = {b}")

product = demonstrate_call(a, b)
print(f"调用后：product = {product}")
print(f"调用后：a = {a}, b = {b}")  # 参数不变
```

函数调用时，参数是按值传递的（更准确地说，是按对象引用传递）。对于不可变对象（如数字、字符串），函数内部无法修改外部变量；对于可变对象（如列表、字典），函数内部可以修改对象的内容。

```python
# 参数传递机制
def modify_immutable(x):
    """尝试修改不可变参数"""
    print(f"  修改前：x = {x}, id = {id(x)}")
    x = x + 1
    print(f"  修改后：x = {x}, id = {id(x)}")

def modify_mutable(lst):
    """修改可变参数"""
    print(f"  修改前：lst = {lst}, id = {id(lst)}")
    lst.append(4)
    print(f"  修改后：lst = {lst}, id = {id(lst)}")

# 不可变参数
num = 10
print(f"\n不可变参数测试：")
print(f"调用前：num = {num}")
modify_immutable(num)
print(f"调用后：num = {num}")  # 仍然是 10

# 可变参数
my_list = [1, 2, 3]
print(f"\n可变参数测试：")
print(f"调用前：my_list = {my_list}")
modify_mutable(my_list)
print(f"调用后：my_list = {my_list}")  # 变成了 [1, 2, 3, 4]
```

这个行为差异非常重要。对于不可变参数，函数内部重新赋值只是创建了一个新的局部变量；对于可变参数，函数内部可以通过方法修改对象内容。理解这一点有助于避免很多隐蔽的 Bug。

## 参数类型

Python 函数支持多种参数类型，这为函数设计提供了极大的灵活性。

### 位置参数

位置参数是最基本的参数类型，调用时按位置顺序传递。

```python
# 位置参数
print("=" * 60)
print("位置参数")
print("=" * 60)

def rectangle_area(width, height):
    """计算矩形面积"""
    return width * height

# 按位置传参
area = rectangle_area(10, 5)
print(f"10 x 5 = {area}")

# 位置错误会导致语义错误
area = rectangle_area(5, 10)
print(f"5 x 10 = {area}")  # 结果相同，但这是巧合

def describe_person(name, age, city):
    """描述一个人的信息"""
    return f"{name} is {age} years old and lives in {city}"

# 位置必须一一对应
print(describe_person("Alice", 25, "New York"))
# 如果位置错误：
# print(describe_person("New York", 25, "Alice"))  # 语义错误
```

### 默认参数

默认参数允许函数在调用时省略某些参数，使用预定义的默认值。

```python
# 默认参数
print("=" * 60)
print("默认参数")
print("=" * 60)

def greet(name, greeting="Hello", punctuation="!"):
    """带默认值的问候函数"""
    return f"{greeting}, {name}{punctuation}"

print(greet("Alice"))                          # Hello, Alice!
print(greet("Bob", "Hi"))                      # Hi, Bob!
print(greet("Charlie", "Hey", "?"))            # Hey, Charlie?
print(greet("David", punctuation="."))         # Hello, David.

# 默认参数的陷阱：可变默认值
print("\n默认参数陷阱：")

def add_item_bad(item, items=[]):
    """错误的做法：使用可变默认值"""
    items.append(item)
    return items

print(f"第一次调用：{add_item_bad('a')}")  # ['a']
print(f"第二次调用：{add_item_bad('b')}")  # ['a', 'b']（不是 ['b']！）
print(f"第三次调用：{add_item_bad('c')}")  # ['a', 'b', 'c']

# 默认值在函数定义时计算，只计算一次
# 所以每次调用共享同一个列表对象

# 正确的做法
def add_item_good(item, items=None):
    """正确的做法：使用 None 作为默认值"""
    if items is None:
        items = []
    items.append(item)
    return items

print(f"\n正确做法：")
print(f"第一次调用：{add_item_good('a')}")  # ['a']
print(f"第二次调用：{add_item_good('b')}")  # ['b']
print(f"第三次调用：{add_item_good('c')}")  # ['c']
```

默认参数的可变默认值陷阱是 Python 中一个经典问题。解决方案是使用 `None` 作为默认值，然后在函数内部创建新的可变对象。这个模式在 Python 标准库和第三方库中广泛使用。

### 关键字参数

关键字参数允许在调用时通过参数名指定值，不依赖于位置。

```python
# 关键字参数
print("=" * 60)
print("关键字参数")
print("=" * 60)

def create_user(name, age, email, role="user", active=True):
    """创建用户"""
    return {
        "name": name,
        "age": age,
        "email": email,
        "role": role,
        "active": active,
    }

# 使用关键字参数（顺序可以任意）
user = create_user(
    name="Alice",
    email="alice@example.com",
    age=25,
    active=False,
)
print(f"用户信息：{user}")

# 混合使用位置参数和关键字参数
user = create_user("Bob", 30, email="bob@example.com", role="admin")
print(f"用户信息：{user}")

# 关键字参数必须在位置参数之后
# create_user(name="Charlie", 35, "charlie@example.com")  # 语法错误！

# 强制使用关键字参数（Python 3.8+）
def connect(host, port, *, timeout=30, ssl=True):
    """
    连接函数
    * 后面的参数必须使用关键字传递
    """
    return f"Connecting to {host}:{port} (timeout={timeout}, ssl={ssl})"

print(connect("localhost", 8080))
print(connect("localhost", 8080, timeout=60, ssl=False))
# connect("localhost", 8080, 60, False)  # 语法错误！
```

使用 `*` 强制关键字参数是一种很好的设计实践。`host` 和 `port` 是显而易见的，而 `timeout` 和 `ssl` 的含义在调用时通过关键字参数更加清晰。这避免了"魔法数字"问题。

### 可变参数（*args）

`*args` 允许函数接受任意数量的位置参数，它们在函数内部以元组的形式存在。

```python
# 可变参数 *args
print("=" * 60)
print("可变参数 *args")
print("=" * 60)

def sum_all(*args):
    """计算所有参数的和"""
    print(f"接收到的参数：{args}")
    return sum(args)

print(f"sum_all(1, 2, 3) = {sum_all(1, 2, 3)}")
print(f"sum_all(10, 20, 30, 40, 50) = {sum_all(10, 20, 30, 40, 50)}")
print(f"sum_all() = {sum_all()}")  # 空元组，和为 0

# *args 与其他参数混合
def log_message(level, *messages):
    """记录多条消息"""
    for msg in messages:
        print(f"[{level}] {msg}")

log_message("INFO", "Server started", "Port: 8080", "Ready for connections")

# 实际应用：通用打印函数
def my_print(*args, sep=" ", end="\n"):
    """自定义打印函数（模拟 print）"""
    output = sep.join(str(arg) for arg in args)
    print(output, end=end)

my_print("Hello", "World", sep=", ", end="!\n")

# 实际应用：最大值函数
def my_max(first, *rest):
    """查找最大值"""
    max_val = first
    for val in rest:
        if val > max_val:
            max_val = val
    return max_val

print(f"my_max(1, 5, 3, 9, 2) = {my_max(1, 5, 3, 9, 2)}")
```

`*args` 的命名只是一个约定，关键是 `*` 符号。你可以使用任何名称（如 `*numbers`、`*items`），但 `*args` 是 Python 社区中最广泛使用的约定。

### 关键字可变参数（**kwargs）

`**kwargs` 允许函数接受任意数量的关键字参数，它们在函数内部以字典的形式存在。

```python
# 关键字可变参数 **kwargs
print("=" * 60)
print("关键字可变参数 **kwargs")
print("=" * 60)

def print_info(**kwargs):
    """打印所有关键字参数"""
    print(f"接收到的参数：{kwargs}")
    for key, value in kwargs.items():
        print(f"  {key}: {value}")

print_info(name="Alice", age=25, city="New York")
print_info(title="Python", author="Guido", year=1991)

# **kwargs 与其他参数混合
def create_config(app_name, **options):
    """创建配置字典"""
    config = {"app": app_name}
    config.update(options)
    return config

config = create_config(
    "MyApp",
    debug=True,
    port=8080,
    host="localhost",
    max_connections=100,
)
print(f"\n配置：{config}")

# 实际应用：HTTP 请求函数
def http_request(url, method="GET", **kwargs):
    """模拟 HTTP 请求"""
    print(f"\n{method} {url}")
    if "headers" in kwargs:
        print(f"  Headers: {kwargs['headers']}")
    if "data" in kwargs:
        print(f"  Data: {kwargs['data']}")
    if "timeout" in kwargs:
        print(f"  Timeout: {kwargs['timeout']}s")

http_request(
    "https://api.example.com/users",
    method="POST",
    headers={"Content-Type": "application/json"},
    data={"name": "Alice"},
    timeout=30,
)
```

`**kwargs` 在需要传递配置选项或额外参数时非常有用。许多 Python 库和框架都使用这种模式（如 `matplotlib` 的绘图函数、`requests` 库的请求函数）。

### 参数解包

参数解包是 `*args` 和 `**kwargs` 的"反向"操作——将序列或字典解包为函数参数。

```python
# 参数解包
print("=" * 60)
print("参数解包")
print("=" * 60)

def add_three(a, b, c):
    return a + b + c

# 列表/元组解包
numbers = [1, 2, 3]
result = add_three(*numbers)  # 等同于 add_three(1, 2, 3)
print(f"add_three(*{numbers}) = {result}")

# 字典解包
def describe(name, age, city):
    return f"{name} ({age}) from {city}"

person = {"name": "Alice", "age": 25, "city": "New York"}
result = describe(**person)  # 等同于 describe(name="Alice", age=25, city="New York")
print(f"describe(**{person}) = {result}")

# 实际应用：合并参数
def make_request(url, **kwargs):
    """发起请求，支持额外参数"""
    default_params = {"method": "GET", "timeout": 30, "retry": 3}
    default_params.update(kwargs)
    print(f"Request: {url} with {default_params}")

make_request("/api/users")
make_request("/api/users", method="POST", timeout=60)

# 组合使用
def combined(a, b, *args, **kwargs):
    print(f"a = {a}, b = {b}")
    print(f"args = {args}")
    print(f"kwargs = {kwargs}")

combined(1, 2, 3, 4, 5, x=10, y=20)
```

## 函数返回值

### 单一返回值

```python
# 函数返回值
print("=" * 60)
print("函数返回值")
print("=" * 60)

# 返回单个值
def square(x):
    return x ** 2

print(f"square(5) = {square(5)}")

# 没有 return 语句的函数返回 None
def do_nothing():
    pass

result = do_nothing()
print(f"do_nothing() = {result}")

# 提前返回
def divide(a, b):
    if b == 0:
        return None  # 提前返回，避免除零错误
    return a / b

print(f"divide(10, 2) = {divide(10, 2)}")
print(f"divide(10, 0) = {divide(10, 0)}")
```

### 多返回值

Python 函数可以返回多个值，实际上是通过返回一个元组实现的。

```python
# 多返回值
print("=" * 60)
print("多返回值")
print("=" * 60)

def min_max_avg(numbers):
    """返回最小值、最大值和平均值"""
    if not numbers:
        return None, None, None
    
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

scores = [85, 92, 78, 95, 88]
minimum, maximum, average = min_max_avg(scores)
print(f"最小值：{minimum}, 最大值：{maximum}, 平均值：{average:.1f}")

# 多返回值实际上是返回元组
result = min_max_avg(scores)
print(f"返回类型：{type(result)}")
print(f"返回值：{result}")

# 可以只接收部分返回值
minimum, *_ = min_max_avg(scores)
print(f"只取最小值：{minimum}")

# 实际应用：除法函数
def safe_divide(a, b):
    """安全除法，返回结果和状态"""
    if b == 0:
        return None, False, "除数不能为零"
    return a / b, True, ""

result, success, message = safe_divide(10, 2)
print(f"\nsafe_divide(10, 2): result={result}, success={success}, message='{message}'")

result, success, message = safe_divide(10, 0)
print(f"safe_divide(10, 0): result={result}, success={success}, message='{message}'")
```

### 返回函数的函数

```python
# 返回函数的函数
def make_multiplier(factor):
    """返回一个乘法函数"""
    def multiplier(x):
        return x * factor
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(f"double(5) = {double(5)}")   # 10
print(f"triple(5) = {triple(5)}")   # 15
```

## 文档字符串（docstring）

文档字符串是函数、类和模块的文档。它使用三引号定义，放在定义体的第一行。

```python
# 文档字符串
print("=" * 60)
print("文档字符串（docstring）")
print("=" * 60)

def calculate_bmi(weight, height):
    """
    计算身体质量指数（BMI）。
    
    BMI = 体重(kg) / 身高(m)^2
    
    Parameters
    ----------
    weight : float
        体重，单位公斤（kg）
    height : float
        身高，单位米（m）
    
    Returns
    -------
    float
        BMI 值
    str
        BMI 分类（偏瘦、正常、偏胖、肥胖）
    
    Examples
    --------
    >>> bmi, category = calculate_bmi(70, 1.75)
    >>> print(f"{bmi:.1f}")
    22.9
    >>> print(category)
    正常
    """
    bmi = weight / (height ** 2)
    
    if bmi < 18.5:
        category = "偏瘦"
    elif bmi < 24:
        category = "正常"
    elif bmi < 28:
        category = "偏胖"
    else:
        category = "肥胖"
    
    return bmi, category

# 访问文档字符串
print("函数文档：")
print(calculate_bmi.__doc__)

# 使用 help() 查看
# help(calculate_bmi)

# 测试函数
bmi, category = calculate_bmi(70, 1.75)
print(f"\nBMI: {bmi:.1f}, 分类: {category}")
```

好的文档字符串应该包含以下信息：
- 函数的简要描述
- 参数的详细说明（类型和含义）
- 返回值的详细说明
- 使用示例（可选但推荐）
- 异常情况（如果可能抛出异常）

## 类型提示（Type Hints）

Python 3.5+ 支持类型提示，虽然不是强制性的，但能显著提高代码可读性和 IDE 支持。

```python
# 类型提示
print("=" * 60)
print("类型提示（Type Hints）")
print("=" * 60)

from typing import List, Dict, Tuple, Optional, Union, Callable

# 基本类型提示
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Alice"))

# 复杂类型提示
def process_scores(scores: List[int]) -> Dict[str, float]:
    """处理成绩列表"""
    return {
        "count": len(scores),
        "average": sum(scores) / len(scores) if scores else 0,
        "max": max(scores) if scores else 0,
        "min": min(scores) if scores else 0,
    }

scores = [85, 92, 78, 95, 88]
result = process_scores(scores)
print(f"处理结果：{result}")

# 可选类型
def find_user(user_id: int) -> Optional[Dict[str, str]]:
    """查找用户，可能返回 None"""
    users = {1: {"name": "Alice"}, 2: {"name": "Bob"}}
    return users.get(user_id)

user = find_user(1)
print(f"找到用户：{user}")
user = find_user(99)
print(f"未找到用户：{user}")

# 联合类型
def process_value(value: Union[int, str, float]) -> str:
    """处理多种类型的值"""
    if isinstance(value, int):
        return f"整数：{value}"
    elif isinstance(value, float):
        return f"浮点数：{value:.2f}"
    else:
        return f"字符串：{value}"

print(process_value(42))
print(process_value(3.14159))
print(process_value("hello"))

# 函数类型
def apply_function(func: Callable[[int], int], value: int) -> int:
    """应用函数到值"""
    return func(value)

def square(x: int) -> int:
    return x * x

print(apply_function(square, 5))  # 25

# 使用 mypy 进行静态类型检查
# pip install mypy
# mypy script.py
```

类型提示不会在运行时检查，但可以使用 `mypy` 等工具进行静态类型检查。在大型项目中，类型提示能显著减少类型相关的 Bug。

## 实际应用：工具函数库

```python
# 实际应用：工具函数库
print("=" * 60)
print("工具函数库")
print("=" * 60)

import time
from functools import wraps
from typing import Any, Callable


def timing_decorator(func: Callable) -> Callable:
    """计算函数执行时间的装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"  {func.__name__} 执行耗时：{elapsed:.6f} 秒")
        return result
    return wrapper


def chunk_list(items: list, chunk_size: int) -> list:
    """
    将列表分割为指定大小的块
    
    Parameters
    ----------
    items : list
        要分割的列表
    chunk_size : int
        每块的大小
    
    Returns
    -------
    list
        包含子列表的列表
    
    Examples
    --------
    >>> chunk_list([1, 2, 3, 4, 5, 6, 7], 3)
    [[1, 2, 3], [4, 5, 6], [7]]
    """
    return [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]


def flatten(nested_list: list) -> list:
    """
    递归展平嵌套列表
    
    Parameters
    ----------
    nested_list : list
        嵌套列表
    
    Returns
    -------
    list
        展平后的列表
    
    Examples
    --------
    >>> flatten([1, [2, [3, 4], 5], 6])
    [1, 2, 3, 4, 5, 6]
    """
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


def safe_get(data: dict, *keys, default: Any = None) -> Any:
    """
    安全地从嵌套字典中获取值
    
    Parameters
    ----------
    data : dict
        字典数据
    *keys : str
        键的路径
    default : Any
        默认值
    
    Returns
    -------
    Any
        获取到的值或默认值
    
    Examples
    --------
    >>> data = {"a": {"b": {"c": 42}}}
    >>> safe_get(data, "a", "b", "c")
    42
    >>> safe_get(data, "a", "x", default=0)
    0
    """
    for key in keys:
        if isinstance(data, dict):
            data = data.get(key, default)
        else:
            return default
    return data


def retry(max_attempts: int = 3, delay: float = 1.0):
    """
    重试装饰器
    
    Parameters
    ----------
    max_attempts : int
        最大尝试次数
    delay : float
        重试间隔（秒）
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise
                    print(f"  第 {attempt} 次尝试失败：{e}，{delay}秒后重试...")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator


# 测试
print("chunk_list 测试：")
print(f"  chunk_list([1,2,3,4,5,6,7], 3) = {chunk_list([1, 2, 3, 4, 5, 6, 7], 3)}")

print("\nflatten 测试：")
print(f"  flatten([1, [2, [3, 4], 5], 6]) = {flatten([1, [2, [3, 4], 5], 6])}")

print("\nsafe_get 测试：")
data = {"user": {"profile": {"name": "Alice", "email": "alice@example.com"}}}
print(f"  safe_get(data, 'user', 'profile', 'name') = {safe_get(data, 'user', 'profile', 'name')}")
print(f"  safe_get(data, 'user', 'settings', 'theme', default='light') = {safe_get(data, 'user', 'settings', 'theme', default='light')}")

print("\nretry 装饰器测试：")
attempt_counter = [0]

@retry(max_attempts=3, delay=0.1)
def unreliable_function():
    attempt_counter[0] += 1
    if attempt_counter[0] < 3:
        raise ValueError("模拟失败")
    return "Success!"

try:
    result = unreliable_function()
    print(f"  结果：{result}")
except ValueError:
    print("  所有重试均失败")
```

## 总结

本文系统地介绍了 Python 函数的基础知识，包括：

**函数定义与调用**：使用 `def` 关键字定义函数，函数名是函数对象的引用。函数调用时，参数按对象引用传递——不可变对象在函数内部无法修改，可变对象可以修改其内容。

**位置参数**：最基本的方式，按位置一一对应。调用时参数数量必须匹配。

**默认参数**：允许函数调用时省略参数。注意可变默认值的陷阱——始终使用 `None` 作为可变对象的默认值。

**关键字参数**：通过参数名传值，顺序可任意。使用 `*` 强制某些参数必须用关键字传递。

**可变参数（*args）**：接受任意数量的位置参数，内部以元组形式存在。常用于求和、最大最小值等需要处理不定数量参数的函数。

**关键字可变参数（**kwargs）**：接受任意数量的关键字参数，内部以字典形式存在。常用于传递配置选项。

**参数解包**：使用 `*` 将序列解包为位置参数，使用 `**` 将字典解包为关键字参数。

**返回值**：可以返回单个值、多个值（实际上是元组），甚至返回函数。没有 `return` 语句时返回 `None`。

**文档字符串**：使用三引号定义，描述函数的功能、参数、返回值和示例。通过 `__doc__` 属性或 `help()` 函数访问。

**类型提示**：提供类型信息，提高代码可读性和 IDE 支持。不会在运行时检查，但可以使用 `mypy` 等工具进行静态检查。

在下一篇文章中，我们将深入学习 Python 函数的高级特性——作用域与闭包。理解这些概念将帮助你写出更加优雅和强大的 Python 代码。
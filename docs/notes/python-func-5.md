---
title: Python函数与高级特性Ⅴ——装饰器与上下文管理器
date: 2026-07-26
tags:
  - Python
  - 装饰器
  - 上下文管理器
  - with语句
  - "@语法"
categories:
  - Python
---

## 前言

装饰器和上下文管理器是 Python 中最具魅力的两个高级特性。它们不仅能让代码更加优雅，还能显著提高代码的可维护性和复用性。装饰器允许你在不修改函数源代码的情况下，给函数添加额外的功能；上下文管理器则确保资源（如文件、数据库连接、锁）在使用后被正确释放。

装饰器的本质是闭包——一个接受函数并返回新函数的函数。Python 的 `@` 语法糖让装饰器的使用变得非常简洁。从简单的日志记录、性能计时，到复杂的权限验证、缓存机制，装饰器在 Python 生态系统中无处不在。

上下文管理器通过 `with` 语句使用，确保资源在使用后自动清理。即使发生异常，上下文管理器也能保证清理代码被执行。自定义上下文管理器可以通过实现 `__enter__` 和 `__exit__` 方法，或者使用 `contextlib.contextmanager` 装饰器来实现。

## 装饰器概念与原理

### 函数是一等公民

理解装饰器首先需要理解 Python 中函数是一等公民的概念。

```python
# 函数是一等公民
print("=" * 60)
print("函数是一等公民")
print("=" * 60)

def greet(name):
    return f"Hello, {name}!"

# 1. 函数可以赋值给变量
say_hello = greet
print(f"say_hello('Alice') = {say_hello('Alice')}")

# 2. 函数可以作为参数传递
def call_func(func, arg):
    return func(arg)

print(f"call_func(greet, 'Bob') = {call_func(greet, 'Bob')}")

# 3. 函数可以作为返回值
def make_greeting(greeting):
    def greet_with_greeting(name):
        return f"{greeting}, {name}!"
    return greet_with_greeting

hi = make_greeting("Hi")
print(f"hi('Charlie') = {hi('Charlie')}")

# 4. 函数可以存储在数据结构中
funcs = [greet, hi, lambda x: f"Hey, {x}!"]
for f in funcs:
    print(f"  {f('David')}")
```

### 装饰器的本质

装饰器本质上是一个接受函数并返回新函数的函数。它允许你在不修改原始函数的情况下添加功能。

```python
# 装饰器的本质
print("=" * 60)
print("装饰器的本质")
print("=" * 60)

# 一个简单的装饰器
def my_decorator(func):
    def wrapper():
        print("函数执行前...")
        result = func()
        print("函数执行后...")
        return result
    return wrapper

def say_hello():
    print("Hello!")
    return "Done"

# 手动应用装饰器
decorated = my_decorator(say_hello)
print(f"手动装饰后调用：")
result = decorated()
print(f"返回值：{result}")

# 使用 @ 语法糖
@my_decorator
def say_goodbye():
    print("Goodbye!")
    return "Finished"

print(f"\n@语法糖装饰后调用：")
result = say_goodbye()
print(f"返回值：{result}")
```

`@my_decorator` 等价于 `say_goodbye = my_decorator(say_goodbye)`。装饰器在函数定义时立即执行，而不是在调用时。

## 函数装饰器

### 装饰带参数的函数

```python
# 装饰带参数的函数
print("=" * 60)
print("装饰带参数的函数")
print("=" * 60)

def log_call(func):
    """记录函数调用的装饰器"""
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}(args={args}, kwargs={kwargs})")
        result = func(*args, **kwargs)
        print(f"{func.__name__} 返回 {result}")
        return result
    return wrapper

@log_call
def add(a, b):
    return a + b

@log_call
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(f"add(3, 5) = {add(3, 5)}")
print(f"\ngreet('Alice', greeting='Hi') = {greet('Alice', greeting='Hi')}")

# 使用 functools.wraps 保留元数据
from functools import wraps

def log_call_v2(func):
    @wraps(func)  # 保留原函数的 __name__ 和 __doc__
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_call_v2
def example():
    """这是一个示例函数"""
    pass

print(f"\nexample.__name__ = {example.__name__}")  # example（不是 wrapper）
print(f"example.__doc__ = {example.__doc__}")
```

### 装饰器应用：@timer

```python
# @timer 装饰器
print("=" * 60)
print("@timer 装饰器")
print("=" * 60)

import time
from functools import wraps

def timer(func):
    """计算函数执行时间的装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"  {func.__name__} 执行耗时：{elapsed:.6f} 秒")
        return result
    return wrapper

@timer
def slow_function():
    """模拟耗时操作"""
    time.sleep(0.5)
    return sum(range(1000000))

@timer
def fast_function(n):
    """快速计算"""
    return n * n

result = slow_function()
print(f"slow_function 结果：{result}")
result = fast_function(100)
print(f"fast_function 结果：{result}")
```

### 带参数的装饰器

```python
# 带参数的装饰器
print("=" * 60)
print("带参数的装饰器")
print("=" * 60)

def retry(max_attempts=3, delay=1.0):
    """重试装饰器（带参数）"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        print(f"  第 {attempt} 次尝试失败，不再重试")
                        raise
                    print(f"  第 {attempt} 次尝试失败：{e}，{delay}秒后重试...")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

# 使用带参数的装饰器
@retry(max_attempts=3, delay=0.1)
def unreliable_function():
    """模拟不稳定的函数"""
    # 使用随机模拟失败
    import random
    if random.random() < 0.7:  # 70% 概率失败
        raise ValueError("模拟失败")
    return "Success!"

print("测试重试装饰器：")
for i in range(3):
    try:
        result = unreliable_function()
        print(f"  结果：{result}")
    except ValueError:
        print(f"  所有重试均失败")
```

### 类装饰器

```python
# 类装饰器
print("=" * 60)
print("类装饰器")
print("=" * 60)

class CountCalls:
    """统计函数调用次数的类装饰器"""
    
    def __init__(self, func):
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} 已被调用 {self.count} 次")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()
say_hello()
say_hello()

# 带参数的类装饰器
class Repeat:
    """重复执行函数的类装饰器"""
    
    def __init__(self, times):
        self.times = times
    
    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for i in range(self.times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper

@Repeat(times=3)
def roll_dice():
    import random
    return random.randint(1, 6)

print(f"\n掷骰子3次：{roll_dice()}")
```

### 多个装饰器叠加

```python
# 多个装饰器叠加
print("=" * 60)
print("多个装饰器叠加")
print("=" * 60)

def decorator_a(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("  [A] 开始")
        result = func(*args, **kwargs)
        print("  [A] 结束")
        return result
    return wrapper

def decorator_b(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("  [B] 开始")
        result = func(*args, **kwargs)
        print("  [B] 结束")
        return result
    return wrapper

@decorator_a
@decorator_b
def say_hello():
    print("    Hello!")
    return "Done"

# 等价于: say_hello = decorator_a(decorator_b(say_hello))
# 执行顺序：A开始 -> B开始 -> 原函数 -> B结束 -> A结束
print("装饰器叠加执行：")
result = say_hello()
```

## 常用装饰器模式

```python
# 常用装饰器模式
print("=" * 60)
print("常用装饰器模式")
print("=" * 60)

# 1. 缓存装饰器
def cache(func):
    """缓存函数结果"""
    cached_results = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cached_results:
            cached_results[args] = func(*args)
        return cached_results[args]
    return wrapper

@cache
@timer
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("带缓存的斐波那契：")
print(f"  fib(30) = {fibonacci(30)}")

# 2. 权限验证装饰器
def require_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if permission in user.get("permissions", []):
                return func(user, *args, **kwargs)
            else:
                print(f"  权限不足：需要 {permission}")
                return None
        return wrapper
    return decorator

@require_permission("admin")
def delete_user(user, target):
    print(f"  {user['name']} 删除了用户 {target}")
    return True

admin = {"name": "Admin", "permissions": ["admin", "read"]}
user = {"name": "Alice", "permissions": ["read"]}

print(f"\n管理员删除用户：")
delete_user(admin, "Bob")
print(f"普通用户删除用户：")
delete_user(user, "Charlie")

# 3. 单例装饰器
def singleton(cls):
    instances = {}
    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    def __init__(self):
        print("  初始化数据库连接...")
        self.connected = True
    
    def query(self, sql):
        return f"执行：{sql}"

print(f"\n单例模式：")
db1 = Database()
db2 = Database()
print(f"  db1 is db2: {db1 is db2}")
```

## with 语句与上下文管理器

### 基本用法

```python
# with 语句
print("=" * 60)
print("with 语句")
print("=" * 60)

# 文件操作的传统方式
f = open("test.txt", "w")
try:
    f.write("Hello, World!")
finally:
    f.close()

# 使用 with 语句（推荐）
with open("test.txt", "w") as f:
    f.write("Hello, World!")
# 文件自动关闭，即使发生异常

# with 语句可以管理多个资源
with open("test.txt", "r") as src, open("test_copy.txt", "w") as dst:
    dst.write(src.read())

# 清理
import os
os.remove("test.txt")
os.remove("test_copy.txt")
```

### 自定义上下文管理器

```python
# 自定义上下文管理器
print("=" * 60)
print("自定义上下文管理器")
print("=" * 60)

class Timer:
    """计时器上下文管理器"""
    
    def __enter__(self):
        self.start = time.perf_counter()
        return self  # 返回给 as 后面的变量
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end = time.perf_counter()
        self.elapsed = self.end - self.start
        print(f"  耗时：{self.elapsed:.6f} 秒")
        # 返回 False 表示不抑制异常
        return False

with Timer():
    time.sleep(0.5)
    print("  执行任务...")

# 数据库连接管理器
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
    
    def __enter__(self):
        print(f"  连接数据库 {self.db_name}...")
        self.connected = True
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"  关闭数据库连接 {self.db_name}")
        self.connected = False
        if exc_type:
            print(f"  发生异常：{exc_val}")
        return False  # 不抑制异常
    
    def query(self, sql):
        if self.connected:
            return f"执行查询：{sql}"
        return "未连接"

print(f"\n数据库连接测试：")
with DatabaseConnection("mydb") as db:
    print(f"  {db.query('SELECT * FROM users')}")

# 异常处理
print(f"\n异常处理测试：")
try:
    with DatabaseConnection("mydb") as db:
        raise ValueError("模拟错误")
except ValueError:
    print("  异常被传播到外部")
```

### contextlib.contextmanager

```python
# contextlib.contextmanager 装饰器
print("=" * 60)
print("contextlib.contextmanager")
print("=" * 60)

from contextlib import contextmanager

@contextmanager
def timer_context(name=""):
    """使用 contextmanager 装饰器创建上下文管理器"""
    start = time.perf_counter()
    try:
        yield  # 暂停，将控制权交给 with 块
    finally:
        elapsed = time.perf_counter() - start
        print(f"  [{name}] 耗时：{elapsed:.6f} 秒")

with timer_context("任务A"):
    time.sleep(0.3)
    print("  执行任务A")

# 临时改变目录
import os

@contextmanager
def change_dir(path):
    """临时切换工作目录"""
    old_dir = os.getcwd()
    try:
        os.chdir(path)
        yield
    finally:
        os.chdir(old_dir)

# 临时修改环境变量
@contextmanager
def temp_env_var(key, value):
    import os
    old_value = os.environ.get(key)
    os.environ[key] = value
    try:
        yield
    finally:
        if old_value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = old_value

# 实际应用：事务管理
@contextmanager
def transaction(connection):
    """数据库事务管理器"""
    print("  开始事务")
    try:
        yield connection
        print("  提交事务")
    except Exception as e:
        print(f"  回滚事务：{e}")
        raise

print(f"\n模拟事务：")
try:
    with transaction("db_conn") as conn:
        print(f"    执行操作（使用 {conn}）")
        # raise ValueError("模拟错误")  # 取消注释测试回滚
except ValueError:
    print("  事务已回滚")
```

## 综合实战：Web API 客户端

```python
# 综合实战：Web API 客户端
print("=" * 60)
print("综合实战：Web API 客户端")
print("=" * 60)

import time
import json
from functools import wraps
from contextlib import contextmanager


# 装饰器：API 调用日志
def api_log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        method = func.__name__.replace("_", " ").title()
        endpoint = kwargs.get("endpoint", args[1] if len(args) > 1 else "unknown")
        print(f"  [API] {method} {endpoint}")
        result = func(*args, **kwargs)
        print(f"  [API] 响应：{result}")
        return result
    return wrapper


# 装饰器：速率限制
def rate_limit(max_calls=5, per_seconds=60):
    def decorator(func):
        calls = []
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            calls[:] = [t for t in calls if now - t < per_seconds]
            if len(calls) >= max_calls:
                wait = per_seconds - (now - calls[0])
                print(f"  [限流] 达到限制，等待 {wait:.1f} 秒")
                time.sleep(wait)
            calls.append(time.time())
            return func(*args, **kwargs)
        return wrapper
    return decorator


# 上下文管理器：API 会话
@contextmanager
def api_session(api_key, base_url="https://api.example.com"):
    print(f"  [会话] 开始 API 会话 (base: {base_url})")
    session = {
        "api_key": api_key,
        "base_url": base_url,
        "start_time": time.time(),
        "request_count": 0,
    }
    try:
        yield session
    finally:
        elapsed = time.time() - session["start_time"]
        print(f"  [会话] 结束 (耗时 {elapsed:.1f}s, 请求 {session['request_count']} 次)")


# 模拟 API 客户端
class APIClient:
    def __init__(self, session):
        self.session = session
    
    @api_log
    @rate_limit(max_calls=3, per_seconds=2)
    def get(self, endpoint):
        self.session["request_count"] += 1
        time.sleep(0.1)  # 模拟网络延迟
        return {"status": "ok", "data": f"Data from {endpoint}"}
    
    @api_log
    @rate_limit(max_calls=3, per_seconds=2)
    def post(self, endpoint, data):
        self.session["request_count"] += 1
        time.sleep(0.1)
        return {"status": "created", "data": data}


# 测试
print("API 客户端测试：")
with api_session("secret_key_123") as session:
    client = APIClient(session)
    
    # 正常请求
    client.get("/users")
    client.get("/posts")
    client.post("/users", {"name": "Alice"})
    
    # 触发速率限制
    client.get("/comments")
    client.get("/settings")
```

## 总结

**装饰器**：
- 本质是接受函数并返回新函数的函数
- `@decorator` 语法糖使应用装饰器变得简洁
- 使用 `*args` 和 `**kwargs` 处理任意参数
- 使用 `@wraps` 保留原函数的元数据
- 带参数的装饰器需要额外一层函数嵌套
- 类装饰器使用 `__call__` 方法
- 多个装饰器从下往上应用

**上下文管理器**：
- 使用 `with` 语句自动管理资源
- 实现 `__enter__` 和 `__exit__` 方法
- `@contextmanager` 简化创建过程
- `__exit__` 返回 True 可抑制异常

**典型应用**：计时、日志、重试、缓存、权限验证、限流、文件操作、数据库连接、事务管理等。
---
title: Python函数与高级特性Ⅱ——作用域与闭包
date: 2026-07-26
tags:
  - Python
  - 作用域
  - 闭包
  - global
  - nonlocal
  - LEGB
categories:
  - Python
---

## 前言

在上一篇文章中，我们学习了 Python 函数的基础知识：定义、参数、返回值和文档字符串。现在，让我们深入探讨函数内部的工作原理——变量作用域和闭包。这些概念是理解 Python 函数式编程特性的关键。

作用域决定了变量在程序中的可见性和生命周期。Python 使用 LEGB 规则（Local、Enclosing、Global、Built-in）来查找变量，理解这个规则对于正确使用变量至关重要。`global` 和 `nonlocal` 关键字提供了在嵌套作用域中修改变量的能力，但需要谨慎使用。

闭包是 Python 中最强大的函数式编程特性之一。它允许函数"记住"其创建时的环境，即使那个环境已经不存在了。闭包在装饰器、回调函数、工厂函数等场景中有着广泛的应用。理解闭包不仅需要理解作用域，还需要理解函数是一等公民的概念。

## 局部变量与全局变量

### 局部变量

局部变量是在函数内部定义的变量，只能在函数内部访问。

```python
# 局部变量
print("=" * 60)
print("局部变量")
print("=" * 60)

def my_function():
    # 局部变量：只在函数内部可见
    local_var = "我是局部变量"
    print(f"函数内部：{local_var}")

my_function()
# print(local_var)  # NameError: name 'local_var' is not defined

# 不同函数可以有同名局部变量（互不影响）
def func_a():
    x = 10
    print(f"func_a 中的 x = {x}")

def func_b():
    x = 20
    print(f"func_b 中的 x = {x}")

func_a()  # 10
func_b()  # 20

# 函数参数也是局部变量
def greet(name):
    print(f"Hello, {name}!")
    # name 是局部变量，只在 greet 内部可见

greet("Alice")
```

### 全局变量

全局变量是在模块级别定义的变量，可以在整个模块中访问。

```python
# 全局变量
print("=" * 60)
print("全局变量")
print("=" * 60)

# 全局变量
global_var = "我是全局变量"
PI = 3.14159
MAX_USERS = 100

def read_global():
    """读取全局变量（不需要 global 关键字）"""
    print(f"读取全局变量：{global_var}")
    print(f"PI = {PI}")

read_global()

# 在函数内部修改全局变量需要 global 关键字
counter = 0

def increment_bad():
    """错误的做法：这会导致 UnboundLocalError"""
    # counter += 1  # 这会报错！因为 Python 认为 counter 是局部变量
    pass

def increment_good():
    """正确的做法：使用 global 关键字"""
    global counter
    counter += 1
    print(f"counter = {counter}")

increment_good()  # 1
increment_good()  # 2
increment_good()  # 3

# 读取不需要 global，修改需要 global
def read_and_display():
    global_var_value = global_var  # 读取不需要 global
    print(f"显示：{global_var_value}")

read_and_display()
```

### global 关键字的陷阱

```python
# global 关键字的使用规则
print("=" * 60)
print("global 关键字的使用规则")
print("=" * 60)

x = 100

def test1():
    # 只读取全局变量，不需要 global
    print(f"test1: x = {x}")

def test2():
    # 如果尝试修改，Python 会认为 x 是局部变量
    # x = 200  # 如果取消注释，下面的 print(x) 会报错
    print(f"test2: x = {x}")

def test3():
    global x
    x = 300  # 修改全局变量
    print(f"test3: x = {x}")

test1()
test2()
test3()
print(f"全局 x = {x}")  # 300

# 在函数中定义全局变量
def create_global():
    global new_global
    new_global = "我在函数中创建的全局变量"

create_global()
print(f"new_global = {new_global}")

# 全局变量的最佳实践
# 1. 尽量减少全局变量的使用
# 2. 使用大写命名常量
# 3. 考虑使用类或配置对象替代全局变量
```

## LEGB 规则

LEGB 是 Python 查找变量名的顺序规则：Local -> Enclosing -> Global -> Built-in。

```python
# LEGB 规则详解
print("=" * 60)
print("LEGB 规则")
print("=" * 60)

# Built-in（内置作用域）
# Python 内置的函数和变量，如 print, len, True, False

# Global（全局作用域）
# 模块级别定义的变量
module_var = "Global"

def outer():
    # Enclosing（封闭作用域）
    # 外部函数的局部变量
    enclosing_var = "Enclosing"
    
    def inner():
        # Local（局部作用域）
        # 内部函数的局部变量
        local_var = "Local"
        
        print(f"Local: {local_var}")
        print(f"Enclosing: {enclosing_var}")
        print(f"Global: {module_var}")
        print(f"Built-in: {len}")  # len 是内置函数
    
    inner()

outer()

# LEGB 查找顺序演示
x = "Global x"

def outer_func():
    x = "Enclosing x"
    
    def inner_func():
        x = "Local x"
        print(f"inner_func 中的 x = {x}")  # Local x
    
    inner_func()
    print(f"outer_func 中的 x = {x}")  # Enclosing x

outer_func()
print(f"模块中的 x = {x}")  # Global x

# 如果注释掉局部定义，会向上查找
def outer_func2():
    x = "Enclosing x"
    
    def inner_func2():
        # 没有局部 x，查找 Enclosing
        print(f"inner_func2 中的 x = {x}")  # Enclosing x
    
    inner_func2()

outer_func2()

# 如果所有层级都没有，查找 Built-in
def use_builtin():
    # print 是内置函数，在 LEGB 的 B 层
    print("使用内置函数 print")

use_builtin()
```

### LEGB 规则的深入理解

```python
# LEGB 深入理解
print("=" * 60)
print("LEGB 深入理解")
print("=" * 60)

# 当你在函数中赋值一个变量时，Python 默认在局部作用域创建它
# 除非你使用 global 或 nonlocal 声明

y = 10

def modify_local():
    y = 20  # 创建局部变量 y，不影响全局 y
    print(f"modify_local: y = {y}")

modify_local()
print(f"全局: y = {y}")  # 仍然是 10

# 有趣的情况：引用和赋值的区别
my_list = [1, 2, 3]

def modify_list():
    # 这是修改对象的内容，不是重新赋值
    my_list.append(4)
    print(f"modify_list: my_list = {my_list}")

modify_list()
print(f"全局: my_list = {my_list}")  # [1, 2, 3, 4]

def reassign_list():
    # 这是重新赋值，创建局部变量
    my_list = [10, 20, 30]
    print(f"reassign_list: my_list = {my_list}")

reassign_list()
print(f"全局: my_list = {my_list}")  # [1, 2, 3, 4]（没变）

# 查看当前作用域中的变量
print("\n当前作用域中的变量：")
print(f"locals(): {[k for k in locals().keys() if not k.startswith('_')]}")
print(f"globals() 中的自定义变量：{[k for k in globals().keys() if not k.startswith('_') and k.islower()]}")
```

## nonlocal 关键字

`nonlocal` 用于在嵌套函数中修改封闭作用域（Enclosing）的变量。

```python
# nonlocal 关键字
print("=" * 60)
print("nonlocal 关键字")
print("=" * 60)

def outer():
    count = 0  # 封闭作用域的变量
    
    def inner():
        # 使用 nonlocal 修改封闭作用域的变量
        nonlocal count
        count += 1
        return count
    
    return inner

counter = outer()
print(f"counter() = {counter()}")  # 1
print(f"counter() = {counter()}")  # 2
print(f"counter() = {counter()}")  # 3

# 没有 nonlocal 的情况
def outer_no_nonlocal():
    count = 0
    
    def inner():
        # count += 1  # UnboundLocalError!
        # 因为 Python 认为 count 是局部变量
        return count
    
    return inner

# nonlocal 与 global 的区别
global_var = 0

def outer_with_global():
    local_var = 0
    
    def inner():
        global global_var      # 修改全局变量
        nonlocal local_var     # 修改封闭作用域变量
        # global_var += 1 和 local_var += 1 都需要声明
        
        # 注意：nonlocal 和 global 不能同时用于同一个变量
    
    inner()

# 多层嵌套中的 nonlocal
def level1():
    x = "level1"
    
    def level2():
        x = "level2"
        
        def level3():
            nonlocal x  # 修改 level2 的 x，不是 level1 的
            x = "level3_modified"
            print(f"level3: x = {x}")
        
        level3()
        print(f"level2: x = {x}")  # level3_modified
    
    level2()
    print(f"level1: x = {x}")  # level1（没变）

level1()

# 实际应用：计数器工厂
def make_counter(start=0, step=1):
    """创建计数器函数"""
    count = start
    
    def counter():
        nonlocal count
        current = count
        count += step
        return current
    
    return counter

counter1 = make_counter(0, 1)
counter2 = make_counter(100, 10)

print(f"\n计数器测试：")
print(f"counter1: {[counter1() for _ in range(5)]}")
print(f"counter2: {[counter2() for _ in range(5)]}")
```

`nonlocal` 关键字在 Python 3 中引入，解决了 Python 2 中无法在嵌套函数中修改外部变量的问题。它只影响最近的封闭作用域，不会跨越到全局作用域。

## 闭包（Closure）

### 闭包的概念

闭包是指一个函数"记住"了其创建时的环境，即使该环境已经不存在了。闭包由函数和其引用的自由变量组成。

```python
# 闭包的概念
print("=" * 60)
print("闭包（Closure）")
print("=" * 60)

def make_multiplier(factor):
    """创建一个乘法器函数"""
    # factor 是自由变量（在闭包中）
    def multiplier(x):
        return x * factor
    return multiplier

# 创建不同的乘法器
double = make_multiplier(2)
triple = make_multiplier(3)
times_10 = make_multiplier(10)

print(f"double(5) = {double(5)}")     # 10
print(f"triple(5) = {triple(5)}")     # 15
print(f"times_10(5) = {times_10(5)}")  # 50

# 每个闭包有自己独立的 factor 值
print(f"\ndouble 的 factor: {double.__closure__[0].cell_contents}")
print(f"triple 的 factor: {triple.__closure__[0].cell_contents}")
print(f"times_10 的 factor: {times_10.__closure__[0].cell_contents}")
```

每个闭包函数对象都有一个 `__closure__` 属性，它是一个元组，包含闭包引用的自由变量的 `cell` 对象。通过 `cell_contents` 属性可以访问这些值。

### 闭包的条件

要形成闭包，需要满足三个条件：

1. 有嵌套函数（内部函数定义在外部函数中）
2. 内部函数引用了外部函数的变量
3. 外部函数返回了内部函数

```python
# 闭包的三个条件
print("=" * 60)
print("闭包的形成条件")
print("=" * 60)

# 条件1：嵌套函数
def outer():
    def inner():
        pass
    return inner
# 这还不是闭包，因为 inner 没有引用 outer 的变量

# 条件2：内部函数引用外部变量
def outer2():
    msg = "Hello"
    def inner2():
        print(msg)  # 引用了外部变量 msg
    return inner2
# 这是闭包！

func = outer2()
func()  # Hello

# 闭包中的变量是"活的"
def outer_with_list():
    items = []
    
    def add_item(item):
        items.append(item)
        return items
    
    return add_item

add = outer_with_list()
print(f"add('a') = {add('a')}")  # ['a']
print(f"add('b') = {add('b')}")  # ['a', 'b']
print(f"add('c') = {add('c')}")  # ['a', 'b', 'c']

# 闭包内容检查
print(f"\nadd 的闭包内容：{add.__closure__[0].cell_contents}")
```

### 闭包的常见陷阱

```python
# 闭包的常见陷阱
print("=" * 60)
print("闭包的常见陷阱")
print("=" * 60)

# 陷阱1：循环中的闭包
print("陷阱1：循环中的闭包")

# 错误的方式
def create_multipliers_wrong():
    multipliers = []
    for i in range(1, 4):
        def multiplier(x):
            return x * i
        multipliers.append(multiplier)
    return multipliers

# 所有 multiplier 都使用最后一个 i 值（3）
funcs = create_multipliers_wrong()
print(f"  funcs[0](5) = {funcs[0](5)}")  # 15（期望 5）
print(f"  funcs[1](5) = {funcs[1](5)}")  # 15（期望 10）
print(f"  funcs[2](5) = {funcs[2](5)}")  # 15（期望 15）

# 正确的方式：使用默认参数"冻结"值
def create_multipliers_right():
    multipliers = []
    for i in range(1, 4):
        def multiplier(x, factor=i):  # 默认参数在定义时计算
            return x * factor
        multipliers.append(multiplier)
    return multipliers

funcs = create_multipliers_right()
print(f"  正确方式：")
print(f"  funcs[0](5) = {funcs[0](5)}")  # 5
print(f"  funcs[1](5) = {funcs[1](5)}")  # 10
print(f"  funcs[2](5) = {funcs[2](5)}")  # 15

# 另一种正确方式：使用工厂函数
def make_multiplier(factor):
    return lambda x: x * factor

funcs = [make_multiplier(i) for i in range(1, 4)]
print(f"  工厂函数方式：")
print(f"  funcs[0](5) = {funcs[0](5)}")  # 5
print(f"  funcs[1](5) = {funcs[1](5)}")  # 10
print(f"  funcs[2](5) = {funcs[2](5)}")  # 15
```

循环中的闭包陷阱是 Python 中最常见的问题之一。问题在于闭包捕获的是变量本身，而不是变量的值。当循环结束后，变量 `i` 的值是最后一次迭代的值。使用默认参数或工厂函数可以解决这个问题。

### 闭包的应用场景

```python
# 闭包的应用场景
print("=" * 60)
print("闭包的应用场景")
print("=" * 60)

# 场景1：数据隐藏（私有变量）
def create_bank_account(initial_balance):
    """创建银行账户（闭包实现私有变量）"""
    balance = initial_balance
    
    def deposit(amount):
        nonlocal balance
        if amount > 0:
            balance += amount
            return f"存入 {amount}，余额：{balance}"
        return "存款金额必须为正数"
    
    def withdraw(amount):
        nonlocal balance
        if 0 < amount <= balance:
            balance -= amount
            return f"取出 {amount}，余额：{balance}"
        return "余额不足或金额无效"
    
    def get_balance():
        return balance
    
    return {
        "deposit": deposit,
        "withdraw": withdraw,
        "get_balance": get_balance,
    }

account = create_bank_account(1000)
print(f"初始余额：{account['get_balance']()}")
print(account['deposit'](500))
print(account['withdraw'](200))
print(f"当前余额：{account['get_balance']()}")
# balance 变量无法从外部直接访问

# 场景2：缓存/记忆化
def memoize(func):
    """缓存函数结果的装饰器"""
    cache = {}
    
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    
    return wrapper

# 使用闭包实现斐波那契数列的缓存
@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"\n斐波那契（带缓存）：")
for i in range(10):
    print(f"  fib({i}) = {fibonacci(i)}")

# 场景3：回调函数
def create_callback(message, count=1):
    """创建带有预设参数的回调函数"""
    calls = 0
    
    def callback():
        nonlocal calls
        calls += 1
        if calls <= count:
            print(f"{message} (第 {calls} 次)")
        else:
            print(f"回调已失效（最多 {count} 次）")
    
    return callback

cb = create_callback("Hello, World!", count=3)
print(f"\n回调测试：")
cb()
cb()
cb()
cb()  # 超过次数，失效

# 场景4：配置工厂
def create_config(env):
    """创建不同环境的配置"""
    defaults = {
        "dev": {"debug": True, "port": 8080, "host": "localhost"},
        "prod": {"debug": False, "port": 80, "host": "0.0.0.0"},
    }
    config = defaults.get(env, defaults["dev"])
    
    def get_config(key, default=None):
        return config.get(key, default)
    
    def set_config(key, value):
        config[key] = value
    
    def all_config():
        return dict(config)
    
    return get_config, set_config, all_config

dev_get, dev_set, dev_all = create_config("dev")
prod_get, prod_set, prod_all = create_config("prod")

print(f"\n开发环境配置：{dev_all()}")
print(f"生产环境配置：{prod_all()}")
```

## 综合实战：权限验证系统

```python
# 综合实战：基于闭包的权限验证系统
print("=" * 60)
print("综合实战：权限验证系统")
print("=" * 60)

def create_auth_system():
    """创建权限验证系统"""
    # 用户数据库（闭包中的私有数据）
    users = {
        "admin": {"password": "admin123", "roles": ["admin", "user"]},
        "alice": {"password": "alice123", "roles": ["user"]},
        "bob": {"password": "bob123", "roles": ["user", "editor"]},
    }
    
    # 当前登录用户
    current_user = None
    
    def login(username, password):
        """登录"""
        nonlocal current_user
        if username in users and users[username]["password"] == password:
            current_user = username
            return True, f"欢迎，{username}！"
        return False, "用户名或密码错误"
    
    def logout():
        """登出"""
        nonlocal current_user
        if current_user:
            username = current_user
            current_user = None
            return True, f"{username} 已登出"
        return False, "当前没有用户登录"
    
    def get_current_user():
        """获取当前用户"""
        return current_user
    
    def has_role(role):
        """检查当前用户是否有指定角色"""
        if current_user is None:
            return False
        return role in users[current_user]["roles"]
    
    def require_role(role):
        """闭包：创建需要特定角色的装饰器"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                if not has_role(role):
                    print(f"权限不足：需要 {role} 角色")
                    return None
                return func(*args, **kwargs)
            return wrapper
        return decorator
    
    def add_user(username, password, roles):
        """添加用户（需要 admin 角色）"""
        if not has_role("admin"):
            return False, "权限不足：需要 admin 角色"
        if username in users:
            return False, f"用户 {username} 已存在"
        users[username] = {"password": password, "roles": roles}
        return True, f"用户 {username} 已添加"
    
    def list_users():
        """列出所有用户（需要 admin 角色）"""
        if not has_role("admin"):
            return False, "权限不足"
        return True, [
            {"username": u, "roles": info["roles"]}
            for u, info in users.items()
        ]
    
    return {
        "login": login,
        "logout": logout,
        "get_current_user": get_current_user,
        "has_role": has_role,
        "require_role": require_role,
        "add_user": add_user,
        "list_users": list_users,
    }


# 测试权限系统
auth = create_auth_system()

# 尝试无权限操作
print("未登录状态：")
success, result = auth["list_users"]()
print(f"  list_users: success={success}, result={result}")

# 普通用户登录
print("\n普通用户登录：")
success, msg = auth["login"]("alice", "alice123")
print(f"  {msg}")
print(f"  当前用户：{auth['get_current_user']()}")
print(f"  是否有 admin 角色：{auth['has_role']('admin')}")
print(f"  是否有 user 角色：{auth['has_role']('user')}")

# 登出
print("\n登出：")
success, msg = auth["logout"]()
print(f"  {msg}")

# 管理员登录
print("\n管理员登录：")
success, msg = auth["login"]("admin", "admin123")
print(f"  {msg}")

# 管理员操作
print("\n管理员操作：")
success, result = auth["add_user"]("charlie", "charlie123", ["user"])
print(f"  add_user: {result}")

success, users = auth["list_users"]()
if success:
    print("  用户列表：")
    for u in users:
        print(f"    {u['username']}: {u['roles']}")

# 使用 require_role 装饰器
require_admin = auth["require_role"]("admin")

@require_admin
def delete_all_data():
    print("  所有数据已删除！")
    return True

print("\n管理员执行删除操作：")
delete_all_data()

auth["logout"]()
auth["login"]("alice", "alice123")

print("\n普通用户执行删除操作：")
delete_all_data()  # 权限不足
```

这个权限验证系统展示了闭包的强大应用。`users` 字典和 `current_user` 变量是私有的，外部代码无法直接访问或修改它们，只能通过提供的接口进行操作。`require_role` 函数返回一个装饰器，该装饰器本身是一个闭包，捕获了 `role` 参数。

## 总结

本文深入探讨了 Python 中的作用域和闭包机制：

**局部变量与全局变量**：局部变量在函数内部定义，只在函数内部可见。全局变量在模块级别定义，可以在整个模块中访问。修改全局变量需要使用 `global` 关键字。

**LEGB 规则**：Python 按照 Local -> Enclosing -> Global -> Built-in 的顺序查找变量名。理解这个规则对于正确使用变量至关重要。

**global 关键字**：用于在函数内部声明要修改全局变量。读取全局变量不需要 `global`，但修改需要。

**nonlocal 关键字**：用于在嵌套函数中修改封闭作用域（Enclosing）的变量。它只影响最近的封闭作用域。

**闭包**：由函数和其引用的自由变量组成。闭包需要三个条件：嵌套函数、内部函数引用外部变量、外部函数返回内部函数。闭包中的变量是"活的"，在闭包的生命周期中持续存在。

**闭包的应用**：
- 数据隐藏（私有变量）
- 缓存/记忆化
- 回调函数
- 配置工厂
- 装饰器（下一篇文章会详细介绍）

在下一篇文章中，我们将学习 lambda 表达式和推导式——Python 中函数式编程的另外两个核心工具。
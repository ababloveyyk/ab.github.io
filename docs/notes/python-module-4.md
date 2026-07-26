---
title: Python模块包与异常Ⅳ——异常处理进阶
date: 2026-07-26
tags:
  - Python
  - 异常处理
  - 自定义异常
  - 日志
  - 重试机制
categories:
  - Python
---

## 一、自定义异常类

### 1.1 为什么需要自定义异常

在实际项目开发中，Python内置的异常类型往往不足以表达业务逻辑中的各种错误情况。自定义异常类可以让你创建具有明确语义的异常类型，使得代码更加清晰、易于理解和维护。

自定义异常的优势包括：

**语义明确**：使用`InvalidUserInputError`比使用通用的`ValueError`更能表达错误的含义，让代码阅读者一眼就能理解发生了什么问题。

**分类处理**：不同的自定义异常可以被不同的`except`块捕获，实现精细化的错误处理。

**携带额外信息**：自定义异常可以添加额外的属性，携带更多上下文信息（如错误码、相关数据等）。

**业务逻辑分离**：将业务错误与技术错误分离，使得代码的层次结构更加清晰。

```python
# 示例：自定义异常类的基本使用
print("=" * 60)
print("自定义异常类的基本使用")
print("=" * 60)

# 1. 最简单的自定义异常
class MyCustomError(Exception):
    """我的自定义异常"""
    pass

# 使用自定义异常
try:
    raise MyCustomError("这是一个自定义异常")
except MyCustomError as e:
    print(f"捕获到自定义异常: {e}")

# 2. 带自定义属性的异常
class ValidationError(Exception):
    """数据验证异常"""
    def __init__(self, message, field=None, value=None):
        super().__init__(message)
        self.field = field
        self.value = value
        self.message = message
    
    def __str__(self):
        if self.field and self.value:
            return f"验证失败 - 字段'{self.field}'的值'{self.value}'无效: {self.message}"
        return self.message

# 使用带属性的异常
def validate_age(age):
    if not isinstance(age, int):
        raise ValidationError("年龄必须是整数", field="age", value=age)
    if age < 0 or age > 150:
        raise ValidationError("年龄必须在0-150之间", field="age", value=age)
    return age

try:
    validate_age("abc")
except ValidationError as e:
    print(f"验证错误: {e}")
    print(f"  错误字段: {e.field}")
    print(f"  错误值: {e.value}")

try:
    validate_age(200)
except ValidationError as e:
    print(f"验证错误: {e}")
    print(f"  错误字段: {e.field}")
    print(f"  错误值: {e.value}")
```

### 1.2 设计异常层次结构

在大型项目中，创建一个有层次结构的异常体系是一种最佳实践。通过继承关系，你可以在不同的粒度上捕获和处理异常。

```python
# 示例：异常层次结构设计
print("=" * 60)
print("异常层次结构设计")
print("=" * 60)

# 基础异常类
class AppError(Exception):
    """应用程序基础异常"""
    def __init__(self, message, error_code=None):
        super().__init__(message)
        self.error_code = error_code
        self.message = message
    
    def to_dict(self):
        return {
            'error': self.__class__.__name__,
            'message': self.message,
            'error_code': self.error_code
        }

# 业务逻辑异常
class BusinessError(AppError):
    """业务逻辑异常"""
    pass

# 数据验证异常
class ValidationError(BusinessError):
    """数据验证异常"""
    def __init__(self, message, field=None, value=None, error_code=None):
        super().__init__(message, error_code)
        self.field = field
        self.value = value

# 资源相关异常
class ResourceError(AppError):
    """资源异常"""
    def __init__(self, message, resource_type=None, resource_id=None, error_code=None):
        super().__init__(message, error_code)
        self.resource_type = resource_type
        self.resource_id = resource_id

class ResourceNotFoundError(ResourceError):
    """资源未找到异常"""
    pass

class ResourceConflictError(ResourceError):
    """资源冲突异常"""
    pass

# 权限相关异常
class AuthError(AppError):
    """认证异常"""
    pass

class PermissionDeniedError(AuthError):
    """权限拒绝异常"""
    pass

# 外部服务异常
class ExternalServiceError(AppError):
    """外部服务异常"""
    def __init__(self, message, service_name=None, error_code=None):
        super().__init__(message, error_code)
        self.service_name = service_name

# 演示异常层次结构的使用
def process_request(user, action, resource):
    """模拟处理请求"""
    # 验证用户
    if not user:
        raise AuthError("用户未登录", error_code="AUTH_REQUIRED")
    
    # 检查权限
    if user.get('role') != 'admin' and action == 'delete':
        raise PermissionDeniedError(
            f"用户{user['name']}没有删除权限",
            error_code="PERMISSION_DENIED"
        )
    
    # 查找资源
    if resource is None:
        raise ResourceNotFoundError(
            f"资源不存在",
            resource_type="document",
            resource_id="123",
            error_code="RESOURCE_NOT_FOUND"
        )
    
    return {"status": "success", "action": action}

# 统一异常处理
def handle_request(user, action, resource):
    try:
        result = process_request(user, action, resource)
        print(f"请求成功: {result}")
    except PermissionDeniedError as e:
        print(f"权限错误: {e.to_dict()}")
    except ResourceNotFoundError as e:
        print(f"资源错误: {e.to_dict()}")
    except AuthError as e:
        print(f"认证错误: {e.to_dict()}")
    except BusinessError as e:
        print(f"业务错误: {e.to_dict()}")
    except AppError as e:
        print(f"应用错误: {e.to_dict()}")
    except Exception as e:
        print(f"未知错误: {e}")

# 测试各种情况
print("\n测试场景:")
print("\n场景1: 未登录用户")
handle_request(None, 'read', {'id': 1})

print("\n场景2: 权限不足")
handle_request({'name': '张三', 'role': 'user'}, 'delete', {'id': 1})

print("\n场景3: 资源不存在")
handle_request({'name': '李四', 'role': 'admin'}, 'delete', None)

print("\n场景4: 正常请求")
handle_request({'name': '李四', 'role': 'admin'}, 'read', {'id': 1})
```

### 1.3 异常类的丰富信息携带

```python
# 示例：携带丰富信息的异常类
print("=" * 60)
print("携带丰富信息的异常类")
print("=" * 60)

import json
from datetime import datetime

class RichException(Exception):
    """富信息异常类"""
    def __init__(self, message, **kwargs):
        super().__init__(message)
        self.message = message
        self.timestamp = datetime.now()
        self.extra = kwargs
    
    def __str__(self):
        parts = [f"[{self.timestamp.isoformat()}] {self.__class__.__name__}: {self.message}"]
        for key, value in self.extra.items():
            parts.append(f"  {key}: {value}")
        return "\n".join(parts)
    
    def to_dict(self):
        return {
            'type': self.__class__.__name__,
            'message': self.message,
            'timestamp': self.timestamp.isoformat(),
            'extra': self.extra
        }
    
    def to_json(self):
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)

# 使用富信息异常
class APIError(RichException):
    """API调用异常"""
    pass

class DatabaseError(RichException):
    """数据库异常"""
    pass

# 模拟API调用
def call_external_api(endpoint, params):
    if endpoint == "/users":
        if params.get("id") == 999:
            raise APIError(
                "API调用失败",
                endpoint=endpoint,
                params=params,
                status_code=500,
                response_body='{"error": "Internal Server Error"}',
                retry_count=3
            )
    return {"data": "success"}

# 模拟数据库操作
def query_database(query, params):
    if "DROP" in query.upper():
        raise DatabaseError(
            "数据库查询失败",
            query=query,
            params=params,
            db_host="localhost:5432",
            db_name="my_database",
            error_detail="syntax error at or near 'DROP'"
        )
    return [{"id": 1, "name": "test"}]

# 测试
print("API错误测试:")
try:
    call_external_api("/users", {"id": 999})
except APIError as e:
    print(e)
    print(f"\nJSON格式:")
    print(e.to_json())

print("\n" + "=" * 60)
print("数据库错误测试:")
try:
    query_database("DROP TABLE users", {"table": "users"})
except DatabaseError as e:
    print(e)
    print(f"\n异常字典:")
    for k, v in e.to_dict().items():
        print(f"  {k}: {v}")
```

## 二、raise抛出异常

### 2.1 raise语句的基本用法

`raise`语句用于主动抛出异常。在Python中，你可以使用`raise`来抛出内置异常或自定义异常。`raise`语句有三种基本形式：

- `raise ExceptionClass("message")` - 创建并抛出一个异常实例
- `raise ExceptionClass` - 抛出异常类（将被自动实例化）
- `raise` - 在`except`块中重新抛出当前异常

```python
# 示例：raise语句的基本用法
print("=" * 60)
print("raise语句的基本用法")
print("=" * 60)

# 1. 抛出带消息的异常
print("1. 抛出带消息的异常:")
try:
    raise ValueError("这是一个值错误")
except ValueError as e:
    print(f"  捕获到: {e}")

# 2. 抛出异常类（自动实例化）
print("\n2. 抛出异常类:")
try:
    raise TypeError
except TypeError as e:
    print(f"  捕获到: {e}（使用默认消息）")

# 3. 重新抛出当前异常
print("\n3. 重新抛出异常:")
def process_with_re_raise():
    try:
        1 / 0
    except ZeroDivisionError:
        print("  第一次捕获，记录日志后重新抛出")
        raise  # 重新抛出当前异常

try:
    process_with_re_raise()
except ZeroDivisionError:
    print("  第二次捕获（重新抛出的异常）")

# 4. 重新抛出不同的异常
print("\n4. 重新抛出不同异常:")
def convert_exception():
    try:
        int("abc")
    except ValueError as e:
        raise RuntimeError(f"转换失败: {e}")

try:
    convert_exception()
except RuntimeError as e:
    print(f"  捕获到转换后的异常: {e}")
```

### 2.2 raise的应用场景

```python
# 示例：raise的应用场景
print("=" * 60)
print("raise的应用场景")
print("=" * 60)

# 场景1：参数验证
def divide(a, b):
    """除法运算，提前验证参数"""
    if not isinstance(a, (int, float)):
        raise TypeError(f"参数a必须是数字，收到: {type(a).__name__}")
    if not isinstance(b, (int, float)):
        raise TypeError(f"参数b必须是数字，收到: {type(b).__name__}")
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b

print("场景1: 参数验证")
try:
    print(f"  divide(10, 'abc') = ", end="")
    divide(10, "abc")
except TypeError as e:
    print(f"错误: {e}")

# 场景2：状态检查
class Connection:
    def __init__(self):
        self.connected = False
    
    def connect(self):
        self.connected = True
        print("  连接成功")
    
    def disconnect(self):
        self.connected = False
        print("  断开连接")
    
    def execute(self, query):
        if not self.connected:
            raise RuntimeError("未连接到数据库，请先调用connect()")
        print(f"  执行查询: {query}")
        return "查询结果"

print("\n场景2: 状态检查")
conn = Connection()
try:
    conn.execute("SELECT * FROM users")
except RuntimeError as e:
    print(f"  错误: {e}")

conn.connect()
conn.execute("SELECT * FROM users")
conn.disconnect()

# 场景3：不支持的操做
class ImmutableList:
    """不可变列表"""
    def __init__(self, items):
        self._items = list(items)
    
    def __getitem__(self, index):
        return self._items[index]
    
    def __setitem__(self, index, value):
        raise NotImplementedError("ImmutableList不支持修改操作")
    
    def append(self, item):
        raise NotImplementedError("ImmutableList不支持添加操作")
    
    def __len__(self):
        return len(self._items)

print("\n场景3: 不支持的操做")
immutable = ImmutableList([1, 2, 3])
print(f"  读取: {immutable[0]}")
try:
    immutable.append(4)
except NotImplementedError as e:
    print(f"  错误: {e}")

# 场景4：抽象方法
from abc import ABC, abstractmethod

class DataProcessor(ABC):
    @abstractmethod
    def process(self, data):
        pass
    
    def run(self, data):
        # 验证数据
        if data is None:
            raise ValueError("数据不能为空")
        # 处理数据
        return self.process(data)

class TextProcessor(DataProcessor):
    def process(self, data):
        return data.upper()

print("\n场景4: 抽象方法")
processor = TextProcessor()
print(f"  处理结果: {processor.run('hello')}")
```

### 2.3 raise的各种形式

```python
# 示例：raise的各种形式
print("=" * 60)
print("raise的各种形式")
print("=" * 60)

# 1. raise 异常实例
print("1. raise 异常实例:")
try:
    raise ValueError("直接抛出异常实例")
except ValueError as e:
    print(f"  捕获: {e}")

# 2. raise 异常类
print("\n2. raise 异常类:")
try:
    raise ValueError
except ValueError as e:
    print(f"  捕获: {e}（自动实例化）")

# 3. raise（在except块中重新抛出）
print("\n3. raise 重新抛出:")
def outer_function():
    try:
        inner_function()
    except ValueError:
        print("  outer_function: 捕获并记录")
        raise  # 重新抛出

def inner_function():
    raise ValueError("inner_function中的错误")

try:
    outer_function()
except ValueError as e:
    print(f"  最终捕获: {e}")

# 4. raise None（抑制异常链）
print("\n4. raise from None（抑制异常链）:")
try:
    try:
        int("abc")
    except ValueError:
        raise RuntimeError("转换失败") from None  # 不显示原始异常
except RuntimeError as e:
    print(f"  捕获: {e}")
    print(f"  原始异常(__cause__): {e.__cause__}")

# 5. raise ... from exc（显式异常链）
print("\n5. raise from exc（显式异常链）:")
try:
    try:
        int("abc")
    except ValueError as e:
        raise RuntimeError("转换失败") from e
except RuntimeError as e:
    print(f"  捕获: {e}")
    print(f"  原始异常: {e.__cause__}")
```

## 三、异常链（raise...from）

### 3.1 异常链的概念

异常链（Exception Chaining）是Python 3引入的重要特性。当一个异常在处理另一个异常时被抛出，Python会自动将原始异常保存为新异常的`__context__`属性，形成异常链。你还可以通过`raise...from`显式地设置异常链。

异常链的重要性在于：

- 保留完整的错误上下文，便于调试
- 清楚地展示错误是如何从一个异常演变为另一个异常的
- 在转换异常类型时不丢失原始错误信息

```python
# 示例：异常链详解
print("=" * 60)
print("异常链详解")
print("=" * 60)

# 1. 隐式异常链
print("1. 隐式异常链:")
def implicit_chain():
    try:
        # 原始异常
        data = open("nonexistent.txt").read()
    except FileNotFoundError as e:
        # 在处理异常时抛出新的异常
        raise RuntimeError("无法读取配置文件")

try:
    implicit_chain()
except RuntimeError as e:
    print(f"  当前异常: {type(e).__name__}: {e}")
    print(f"  原始异常(__context__): {type(e.__context__).__name__}: {e.__context__}")

# 2. 显式异常链（raise ... from）
print("\n2. 显式异常链（raise ... from）:")
def explicit_chain():
    try:
        data = int("abc")
    except ValueError as e:
        # 显式设置异常链
        raise RuntimeError("数据转换失败") from e

try:
    explicit_chain()
except RuntimeError as e:
    print(f"  当前异常: {type(e).__name__}: {e}")
    print(f"  原始异常(__cause__): {type(e.__cause__).__name__}: {e.__cause__}")

# 3. 抑制异常链（raise ... from None）
print("\n3. 抑制异常链（raise ... from None）:")
def suppressed_chain():
    try:
        data = int("abc")
    except ValueError:
        # 抑制异常链
        raise RuntimeError("处理失败，请检查输入") from None

try:
    suppressed_chain()
except RuntimeError as e:
    print(f"  当前异常: {type(e).__name__}: {e}")
    print(f"  __cause__: {e.__cause__}")
    print(f"  __context__: {e.__context__}")

# 4. __context__ vs __cause__
print("\n4. __context__ vs __cause__:")
print("  __context__: 隐式异常链，自动设置")
print("  __cause__: 显式异常链，通过 raise ... from 设置")
print("  __suppress_context__: 当 __cause__ 被设置时，__context__ 被抑制")
```

### 3.2 异常链的实际应用

```python
# 示例：异常链的实际应用
print("=" * 60)
print("异常链的实际应用")
print("=" * 60)

# 场景：数据管道中的异常转换
class DataSourceError(Exception):
    """数据源异常"""
    pass

class DataProcessingError(Exception):
    """数据处理异常"""
    pass

class DataOutputError(Exception):
    """数据输出异常"""
    pass

def read_data(source):
    """从数据源读取数据"""
    if source == "file":
        raise FileNotFoundError("数据文件不存在")
    elif source == "database":
        raise ConnectionError("数据库连接失败")
    elif source == "api":
        raise TimeoutError("API请求超时")
    return "raw_data"

def process_data(data):
    """处理数据"""
    if data == "raw_data":
        # 模拟处理错误
        raise ValueError("数据格式不正确")
    return "processed_data"

def write_data(data, destination):
    """输出数据"""
    if destination == "disk_full":
        raise IOError("磁盘空间不足")
    return True

def data_pipeline(source, destination):
    """完整的数据管道"""
    try:
        # 读取数据
        try:
            raw_data = read_data(source)
        except (FileNotFoundError, ConnectionError, TimeoutError) as e:
            raise DataSourceError(f"数据读取失败: {e}") from e
        
        # 处理数据
        try:
            processed_data = process_data(raw_data)
        except ValueError as e:
            raise DataProcessingError(f"数据处理失败: {e}") from e
        
        # 输出数据
        try:
            write_data(processed_data, destination)
        except IOError as e:
            raise DataOutputError(f"数据输出失败: {e}") from e
        
        print("数据管道执行成功!")
        return True
        
    except (DataSourceError, DataProcessingError, DataOutputError) as e:
        print(f"管道执行失败:")
        print(f"  当前异常: {type(e).__name__}: {e}")
        if e.__cause__:
            print(f"  原始异常: {type(e.__cause__).__name__}: {e.__cause__}")
        return False

print("测试数据管道:")
print("\n测试1: 文件不存在")
data_pipeline("file", "output")

print("\n测试2: 数据库连接失败")
data_pipeline("database", "output")

print("\n测试3: API超时")
data_pipeline("api", "output")

# 完整异常链信息
import traceback

print("\n" + "=" * 60)
print("完整异常链信息:")
print("=" * 60)

try:
    try:
        open("nonexistent.txt")
    except FileNotFoundError as e:
        raise RuntimeError("配置加载失败") from e
except RuntimeError:
    traceback.print_exc()
```

## 四、断言（assert）

### 4.1 assert语句的基本用法

`assert`语句用于在代码中插入调试断言。它的基本语法是：

```python
assert condition, message
```

如果`condition`为`False`，则抛出`AssertionError`异常。可选的`message`参数用于指定错误消息。

`assert`主要用于开发和调试阶段，用于检查程序中的不变量和假设条件。在生产环境中，可以通过`-O`（优化）标志来禁用断言。

```python
# 示例：assert语句的基本用法
print("=" * 60)
print("assert语句的基本用法")
print("=" * 60)

# 基本用法
print("1. 基本断言:")
x = 5
assert x > 0, "x必须大于0"
print(f"  x = {x}, 断言通过")

# 断言失败
print("\n2. 断言失败:")
try:
    y = -1
    assert y > 0, f"y的值应该大于0，但实际是{y}"
except AssertionError as e:
    print(f"  断言失败: {e}")

# 各种断言场景
print("\n3. 各种断言场景:")

# 类型检查
def process_number(n):
    assert isinstance(n, (int, float)), "参数必须是数字类型"
    assert n >= 0, "参数必须是非负数"
    return n ** 0.5

try:
    print(f"  process_number(25) = {process_number(25)}")
except AssertionError as e:
    print(f"  错误: {e}")

try:
    print(f"  process_number(-1) = {process_number(-1)}")
except AssertionError as e:
    print(f"  错误: {e}")

# 列表非空检查
def get_first(items):
    assert len(items) > 0, "列表不能为空"
    return items[0]

try:
    print(f"  get_first([1, 2, 3]) = {get_first([1, 2, 3])}")
    print(f"  get_first([]) = {get_first([])}")
except AssertionError as e:
    print(f"  错误: {e}")

# 前置条件和后置条件
def divide_safe(a, b):
    # 前置条件
    assert isinstance(a, (int, float)), "a必须是数字"
    assert isinstance(b, (int, float)), "b必须是数字"
    assert b != 0, "除数不能为零"
    
    result = a / b
    
    # 后置条件
    assert isinstance(result, float), "结果必须是浮点数"
    
    return result

print(f"  divide_safe(10, 3) = {divide_safe(10, 3)}")
```

### 4.2 assert vs raise

```python
# 示例：assert vs raise 的选择
print("=" * 60)
print("assert vs raise 的选择")
print("=" * 60)

print("""
assert 和 raise 的区别:

assert:
  - 用于调试和开发阶段
  - 检查"不应该发生"的情况（程序员的错误）
  - 可以通过 -O 标志禁用
  - 不应该用于正常的错误处理
  - 用于检查程序内部的不变量

raise:
  - 用于正常的错误处理
  - 处理预期的错误情况（用户的错误、外部错误）
  - 不能被禁用
  - 应该用于对外部输入和不可控条件的验证
  - 用于处理运行时错误
""")

# 正确使用assert
print("正确使用assert的场景:")
def calculate_average(numbers):
    """计算平均值 - assert用于检查内部不变量"""
    assert len(numbers) > 0, "列表不应为空（这是调用者应该保证的）"
    total = sum(numbers)
    avg = total / len(numbers)
    assert avg >= min(numbers) and avg <= max(numbers), \
        "平均值应该在最小值和最大值之间"
    return avg

print(f"  calculate_average([1, 2, 3, 4, 5]) = {calculate_average([1, 2, 3, 4, 5])}")

# 正确使用raise
print("\n正确使用raise的场景:")
def calculate_average_safe(numbers):
    """计算平均值 - raise用于处理用户输入错误"""
    if not numbers:
        raise ValueError("列表不能为空")
    if not all(isinstance(n, (int, float)) for n in numbers):
        raise TypeError("列表中的所有元素必须是数字")
    return sum(numbers) / len(numbers)

try:
    print(f"  calculate_average_safe([]) = ", end="")
    calculate_average_safe([])
except ValueError as e:
    print(f"错误: {e}")

# 设计原则：使用assert进行"契约式"检查
print("\n设计原则示例:")
class Temperature:
    """温度类 - 使用assert确保内部不变量"""
    
    def __init__(self, celsius):
        # 对外部输入使用raise
        if not isinstance(celsius, (int, float)):
            raise TypeError("温度必须是数字")
        
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError("温度必须是数字")
        self._celsius = value
    
    @property
    def kelvin(self):
        result = self._celsius + 273.15
        # 使用assert检查内部不变量
        assert result >= 0, "开尔文温度不应为负"
        return result
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

temp = Temperature(25)
print(f"  摄氏: {temp.celsius}°C")
print(f"  开尔文: {temp.kelvin}K")
print(f"  华氏: {temp.fahrenheit}°F")
```

## 五、日志记录（logging模块）

### 5.1 logging模块概述

`logging`模块是Python标准库中用于记录日志的模块。相比于`print()`语句，`logging`模块提供了更灵活、更强大的日志记录功能，包括日志级别、日志格式化、日志输出目标（控制台、文件、网络等）以及日志轮转等。

日志级别从低到高：

- `DEBUG`（10）：详细的调试信息
- `INFO`（20）：确认程序按预期运行的信息
- `WARNING`（30）：警告信息，表示可能的问题
- `ERROR`（40）：错误信息，表示严重的问题
- `CRITICAL`（50）：严重错误，表示程序可能无法继续运行

```python
# 示例：logging模块基本使用
import logging

print("=" * 60)
print("logging模块基本使用")
print("=" * 60)

# 1. 基本配置
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# 获取logger
logger = logging.getLogger(__name__)

# 记录不同级别的日志
print("日志输出示例:")
logger.debug("这是DEBUG级别的日志 - 详细的调试信息")
logger.info("这是INFO级别的日志 - 程序正常运行")
logger.warning("这是WARNING级别的日志 - 可能有问题")
logger.error("这是ERROR级别的日志 - 发生了错误")
logger.critical("这是CRITICAL级别的日志 - 严重错误")

# 2. 创建自定义logger
print("\n" + "=" * 60)
print("自定义logger配置")
print("=" * 60)

# 创建专门的logger
app_logger = logging.getLogger('my_app')
app_logger.setLevel(logging.DEBUG)

# 创建控制台处理器
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_format = logging.Formatter('%(name)s - %(levelname)s: %(message)s')
console_handler.setFormatter(console_format)

# 添加处理器
app_logger.addHandler(console_handler)

app_logger.info("应用启动")
app_logger.debug("这条debug信息不会在控制台显示（因为控制台处理器级别是INFO）")
app_logger.warning("警告信息")
```

### 5.2 日志文件输出与轮转

```python
# 示例：日志文件输出与轮转
import logging
import logging.handlers
import os
import tempfile

print("=" * 60)
print("日志文件输出与轮转")
print("=" * 60)

# 创建临时目录
tmp_dir = tempfile.mkdtemp()
log_file = os.path.join(tmp_dir, "app.log")

# 配置文件日志
file_logger = logging.getLogger('file_logger')
file_logger.setLevel(logging.DEBUG)

# 创建文件处理器
file_handler = logging.FileHandler(log_file, encoding='utf-8')
file_handler.setLevel(logging.DEBUG)
file_format = logging.Formatter(
    '%(asctime)s [%(levelname)-8s] %(name)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
file_handler.setFormatter(file_format)
file_logger.addHandler(file_handler)

# 记录日志到文件
file_logger.info("应用启动")
file_logger.debug("加载配置文件")
file_logger.warning("配置文件中的某些设置已过期")
file_logger.error("数据库连接失败，将使用缓存数据")
file_logger.info("应用关闭")

# 读取日志文件内容
print(f"日志文件: {log_file}")
print("日志内容:")
with open(log_file, 'r', encoding='utf-8') as f:
    print(f.read())

# 演示RotatingFileHandler（文件大小轮转）
print("\nRotatingFileHandler演示:")
rotate_log = os.path.join(tmp_dir, "rotate.log")

rotate_logger = logging.getLogger('rotate_logger')
rotate_logger.setLevel(logging.DEBUG)

# 创建轮转文件处理器
rotate_handler = logging.handlers.RotatingFileHandler(
    rotate_log,
    maxBytes=500,  # 每个文件最大500字节
    backupCount=3,  # 保留3个备份
    encoding='utf-8'
)
rotate_handler.setLevel(logging.DEBUG)
rotate_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
rotate_logger.addHandler(rotate_handler)

# 写入足够多的日志以触发轮转
print("正在写入日志以触发轮转...")
for i in range(50):
    rotate_logger.info(f"第{i+1}条日志消息 - 这是为了触发日志轮转而生成的测试数据")

# 查看生成的日志文件
print(f"\n日志文件列表:")
for f in sorted(os.listdir(tmp_dir)):
    if f.startswith('rotate'):
        fpath = os.path.join(tmp_dir, f)
        size = os.path.getsize(fpath)
        print(f"  {f}: {size} 字节")

# 清理
import shutil
shutil.rmtree(tmp_dir)
```

### 5.3 日志在异常处理中的应用

```python
# 示例：日志在异常处理中的应用
import logging
import traceback
import sys

print("=" * 60)
print("日志在异常处理中的应用")
print("=" * 60)

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger('exception_demo')

# 1. 记录异常
print("1. 记录异常信息:")
def risky_operation(value):
    try:
        result = 100 / value
        logger.info(f"计算成功: 100 / {value} = {result}")
        return result
    except ZeroDivisionError:
        logger.error("除零错误", exc_info=True)  # exc_info=True 记录堆栈信息
    except TypeError as e:
        logger.error(f"类型错误: {e}")
    except Exception as e:
        logger.critical(f"未知错误: {e}", exc_info=True)
    return None

print("  测试除零错误:")
risky_operation(0)
print("\n  测试类型错误:")
risky_operation("abc")

# 2. 使用logger.exception()
print("\n2. 使用logger.exception()（自动包含堆栈信息）:")
def process_file(filename):
    try:
        with open(filename, 'r') as f:
            return f.read()
    except Exception:
        logger.exception(f"读取文件失败: {filename}")
        return None

process_file("nonexistent.txt")

# 3. 装饰器记录异常
print("\n3. 装饰器自动记录异常:")
def log_exceptions(func):
    """装饰器：自动记录函数异常"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(
                f"函数 {func.__name__} 执行失败: {e}",
                exc_info=True
            )
            raise
    return wrapper

@log_exceptions
def divide(a, b):
    return a / b

@log_exceptions
def process_data(data):
    if not data:
        raise ValueError("数据不能为空")
    return data.upper()

try:
    print(f"  divide(10, 2) = {divide(10, 2)}")
    divide(10, 0)
except:
    pass

try:
    process_data("")
except:
    pass

# 4. 结构化日志
print("\n4. 结构化日志:")
def log_structured(action, status, **kwargs):
    """记录结构化日志"""
    extra_info = ' '.join(f"{k}={v}" for k, v in kwargs.items())
    if status == 'success':
        logger.info(f"[{action}] {status} {extra_info}")
    elif status == 'error':
        logger.error(f"[{action}] {status} {extra_info}")
    elif status == 'warning':
        logger.warning(f"[{action}] {status} {extra_info}")

log_structured("USER_LOGIN", "success", user="zhangsan", ip="192.168.1.1")
log_structured("API_CALL", "error", endpoint="/api/users", error_code=500)
log_structured("DB_QUERY", "warning", query="SELECT *", duration_ms=1500)
```

## 六、网络请求异常捕获重试机制

### 6.1 模拟网络请求的重试机制

在实际开发中，网络请求可能会因为各种原因失败（网络波动、服务器繁忙、超时等）。实现一个健壮的重试机制是保证程序可靠性的重要手段。下面我们模拟一个完整的网络请求重试系统。

```python
# 示例：网络请求异常捕获重试机制
print("=" * 60)
print("网络请求异常捕获重试机制")
print("=" * 60)

import time
import random
import logging
from functools import wraps

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger('retry')

# 模拟可能失败的网络请求
class NetworkError(Exception):
    """网络异常"""
    pass

class TimeoutError(Exception):
    """超时异常"""
    pass

class ServerError(Exception):
    """服务器错误"""
    pass

class RateLimitError(Exception):
    """限流错误"""
    pass

def simulate_request(url, fail_probability=0.5):
    """模拟网络请求，有一定概率失败"""
    # 模拟网络延迟
    time.sleep(0.1)
    
    rand = random.random()
    
    if rand < fail_probability * 0.3:
        raise TimeoutError(f"请求超时: {url}")
    elif rand < fail_probability * 0.6:
        raise ConnectionError(f"连接失败: {url}")
    elif rand < fail_probability * 0.8:
        raise ServerError(f"服务器错误 (500): {url}")
    elif rand < fail_probability * 0.95:
        raise RateLimitError(f"请求过于频繁 (429): {url}")
    elif rand < fail_probability:
        raise NetworkError(f"网络错误: {url}")
    
    return {"status": 200, "data": f"来自 {url} 的响应数据"}


# 重试装饰器
def retry_on_failure(
    max_retries=3,
    delay=1,
    backoff=2,
    exceptions=(Exception,),
    on_retry=None
):
    """
    重试装饰器
    
    参数:
        max_retries: 最大重试次数
        delay: 初始延迟时间（秒）
        backoff: 退避因子（每次重试延迟乘以该因子）
        exceptions: 需要重试的异常类型元组
        on_retry: 重试时的回调函数
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    if attempt > 0:
                        logger.info(
                            f"第 {attempt} 次重试 "
                            f"(延迟 {current_delay:.1f}秒)..."
                        )
                    
                    result = func(*args, **kwargs)
                    
                    if attempt > 0:
                        logger.info(f"重试成功! (共尝试 {attempt + 1} 次)")
                    
                    return result
                    
                except exceptions as e:
                    last_exception = e
                    
                    if attempt < max_retries:
                        logger.warning(
                            f"请求失败 (尝试 {attempt + 1}/{max_retries + 1}): "
                            f"{type(e).__name__}: {e}"
                        )
                        
                        if on_retry:
                            on_retry(attempt + 1, e, current_delay)
                        
                        time.sleep(current_delay)
                        current_delay *= backoff
                    else:
                        logger.error(
                            f"所有重试均失败 (共 {max_retries + 1} 次尝试): "
                            f"{type(e).__name__}: {e}"
                        )
            
            raise last_exception
        
        return wrapper
    return decorator


# 使用重试装饰器
@retry_on_failure(
    max_retries=3,
    delay=1,
    backoff=2,
    exceptions=(TimeoutError, ConnectionError, ServerError, RateLimitError),
    on_retry=lambda attempt, exc, delay: logger.debug(
        f"将在 {delay:.1f}秒后重试..."
    )
)
def fetch_data(url):
    """获取数据（带自动重试）"""
    response = simulate_request(url, fail_probability=0.5)
    return response


# 测试重试机制
print("测试自动重试机制:")
print("-" * 40)

random.seed(42)  # 固定随机种子

for i in range(3):
    print(f"\n调用 {i+1}:")
    try:
        result = fetch_data(f"https://api.example.com/data/{i}")
        print(f"  成功: {result}")
    except Exception as e:
        print(f"  最终失败: {type(e).__name__}: {e}")
```

### 6.2 高级重试策略

```python
# 示例：高级重试策略
print("=" * 60)
print("高级重试策略")
print("=" * 60)

import time
import random
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger('advanced_retry')

# 1. 带抖动的退避策略
class RetryWithJitter:
    """带抖动的重试策略"""
    
    def __init__(self, max_retries=3, base_delay=1, max_delay=60):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay
    
    def calculate_delay(self, attempt):
        """计算带抖动的延迟时间"""
        # 指数退避
        exponential_delay = min(
            self.base_delay * (2 ** attempt),
            self.max_delay
        )
        # 添加随机抖动（0到退避时间之间）
        jitter = random.uniform(0, exponential_delay)
        return exponential_delay + jitter
    
    def execute(self, func, *args, **kwargs):
        """执行函数，必要时重试"""
        last_exception = None
        
        for attempt in range(self.max_retries + 1):
            try:
                if attempt > 0:
                    delay = self.calculate_delay(attempt - 1)
                    logger.info(f"重试 {attempt}/{self.max_retries}，等待 {delay:.2f}秒...")
                    time.sleep(delay)
                
                return func(*args, **kwargs)
                
            except (TimeoutError, ConnectionError, ServerError) as e:
                last_exception = e
                logger.warning(f"尝试 {attempt + 1} 失败: {type(e).__name__}: {e}")
                
                if attempt >= self.max_retries:
                    logger.error(f"达到最大重试次数 ({self.max_retries})")
        
        raise last_exception


# 2. 条件重试策略
class ConditionalRetry:
    """根据条件决定是否重试"""
    
    def __init__(self, max_retries=3):
        self.max_retries = max_retries
        self.retryable_status_codes = {429, 500, 502, 503, 504}
    
    def is_retryable(self, exception):
        """判断异常是否应该重试"""
        if isinstance(exception, TimeoutError):
            return True
        if isinstance(exception, ConnectionError):
            return True
        if isinstance(exception, ServerError):
            return True
        if isinstance(exception, RateLimitError):
            return True
        return False
    
    def execute(self, func, *args, **kwargs):
        """执行函数"""
        for attempt in range(self.max_retries + 1):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt < self.max_retries and self.is_retryable(e):
                    delay = 2 ** attempt
                    logger.warning(
                        f"可重试异常 (尝试 {attempt + 1}): "
                        f"{type(e).__name__}，{delay}秒后重试"
                    )
                    time.sleep(delay)
                else:
                    raise


# 3. 断路器模式
class CircuitBreaker:
    """断路器模式"""
    
    STATE_CLOSED = 'closed'       # 正常
    STATE_OPEN = 'open'           # 断路
    STATE_HALF_OPEN = 'half_open' # 半开
    
    def __init__(self, failure_threshold=3, recovery_timeout=10):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = self.STATE_CLOSED
        self.failure_count = 0
        self.last_failure_time = 0
    
    def call(self, func, *args, **kwargs):
        """通过断路器调用函数"""
        if self.state == self.STATE_OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                logger.info("断路器进入半开状态，尝试恢复...")
                self.state = self.STATE_HALF_OPEN
            else:
                raise CircuitBreakerOpenError("断路器已打开，拒绝请求")
        
        try:
            result = func(*args, **kwargs)
            # 成功
            if self.state == self.STATE_HALF_OPEN:
                logger.info("断路器恢复，关闭")
                self.state = self.STATE_CLOSED
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                logger.error(f"失败次数达到阈值({self.failure_threshold})，断路器打开")
                self.state = self.STATE_OPEN
            
            raise


class CircuitBreakerOpenError(Exception):
    """断路器打开异常"""
    pass


# 测试高级重试策略
print("测试带抖动的重试策略:")
retry = RetryWithJitter(max_retries=3, base_delay=0.5)

random.seed(123)
for i in range(3):
    try:
        result = retry.execute(
            simulate_request,
            f"https://api.example.com/data/{i}",
            fail_probability=0.6
        )
        print(f"  成功: {result}")
    except Exception as e:
        print(f"  失败: {type(e).__name__}: {e}")

print("\n测试断路器模式:")
circuit_breaker = CircuitBreaker(failure_threshold=3, recovery_timeout=5)

random.seed(456)
for i in range(6):
    try:
        result = circuit_breaker.call(
            simulate_request,
            f"https://api.example.com/data/{i}",
            fail_probability=0.8
        )
        print(f"  调用 {i+1}: 成功")
    except CircuitBreakerOpenError as e:
        print(f"  调用 {i+1}: {e}")
    except Exception as e:
        print(f"  调用 {i+1}: 失败 - {type(e).__name__}")
```

### 6.3 完整的HTTP客户端重试示例

```python
# 示例：完整的HTTP客户端重试示例
print("=" * 60)
print("完整的HTTP客户端重试示例")
print("=" * 60)

import time
import random
import json
import logging
from functools import wraps
from enum import Enum

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger('http_client')

# 模拟HTTP响应
class Response:
    def __init__(self, status_code, data=None, headers=None):
        self.status_code = status_code
        self._data = data
        self.headers = headers or {}
    
    def json(self):
        return self._data
    
    def text(self):
        return json.dumps(self._data, ensure_ascii=False)
    
    def __repr__(self):
        return f"Response({self.status_code})"

# 模拟HTTP会话
class Session:
    """模拟HTTP会话"""
    
    def __init__(self):
        self.headers = {}
        self.cookies = {}
        self.timeout = 30
        self.call_count = 0
    
    def get(self, url, **kwargs):
        return self._request('GET', url, **kwargs)
    
    def post(self, url, data=None, **kwargs):
        return self._request('POST', url, data=data, **kwargs)
    
    def _request(self, method, url, data=None, **kwargs):
        self.call_count += 1
        # 模拟网络请求
        time.sleep(random.uniform(0.05, 0.2))
        
        rand = random.random()
        
        if rand < 0.15:
            raise TimeoutError(f"请求超时: {method} {url}")
        elif rand < 0.25:
            raise ConnectionError(f"连接被拒绝: {url}")
        elif rand < 0.35:
            return Response(500, {"error": "Internal Server Error"})
        elif rand < 0.45:
            return Response(502, {"error": "Bad Gateway"})
        elif rand < 0.50:
            return Response(503, {"error": "Service Unavailable"})
        elif rand < 0.55:
            return Response(429, {"error": "Too Many Requests"}, {"Retry-After": "5"})
        elif rand < 0.60:
            return Response(404, {"error": "Not Found"})
        elif rand < 0.65:
            return Response(401, {"error": "Unauthorized"})
        
        return Response(200, {
            "method": method,
            "url": url,
            "data": data,
            "message": "成功"
        })

# 完整重试配置
class RetryConfig:
    """重试配置"""
    def __init__(self, total=3, backoff_factor=1, status_forcelist=None):
        self.total = total
        self.backoff_factor = backoff_factor
        self.status_forcelist = status_forcelist or [429, 500, 502, 503, 504]

# 完整HTTP客户端
class HTTPClient:
    """HTTP客户端，支持自动重试"""
    
    def __init__(self, retry_config=None):
        self.session = Session()
        self.retry_config = retry_config or RetryConfig()
    
    def request(self, method, url, **kwargs):
        """发送请求，自动重试"""
        last_exception = None
        
        for attempt in range(self.retry_config.total + 1):
            try:
                if attempt > 0:
                    delay = self.retry_config.backoff_factor * (2 ** (attempt - 1))
                    logger.info(f"重试 {attempt}/{self.retry_config.total} (等待 {delay:.1f}秒)...")
                    time.sleep(delay)
                
                # 发送请求
                response = self.session._request(method, url, **kwargs)
                
                # 检查是否需要重试（基于状态码）
                if response.status_code in self.retry_config.status_forcelist:
                    if attempt < self.retry_config.total:
                        logger.warning(
                            f"收到可重试状态码 {response.status_code} "
                            f"(尝试 {attempt + 1}/{self.retry_config.total + 1})"
                        )
                        continue
                
                # 记录请求统计
                logger.info(
                    f"请求完成: {method} {url} -> {response.status_code} "
                    f"(尝试 {attempt + 1}次)"
                )
                
                return response
                
            except (TimeoutError, ConnectionError) as e:
                last_exception = e
                if attempt < self.retry_config.total:
                    logger.warning(
                        f"网络错误 (尝试 {attempt + 1}/{self.retry_config.total + 1}): "
                        f"{type(e).__name__}: {e}"
                    )
                else:
                    logger.error(f"所有重试均失败: {type(e).__name__}: {e}")
        
        if last_exception:
            raise last_exception
        return response
    
    def get(self, url, **kwargs):
        return self.request('GET', url, **kwargs)
    
    def post(self, url, data=None, **kwargs):
        return self.request('POST', url, data=data, **kwargs)

# 测试完整HTTP客户端
print("测试完整HTTP客户端:")
print("-" * 40)

client = HTTPClient(RetryConfig(total=3, backoff_factor=1))

random.seed(789)
success_count = 0
failure_count = 0

endpoints = [
    "/api/users",
    "/api/products",
    "/api/orders",
    "/api/auth/login",
    "/api/data/export",
    "/api/settings",
    "/api/notifications",
    "/api/reports",
]

for endpoint in endpoints:
    try:
        response = client.get(f"https://api.example.com{endpoint}")
        if response.status_code == 200:
            success_count += 1
            print(f"  {endpoint}: 成功 ({response.status_code})")
        else:
            failure_count += 1
            print(f"  {endpoint}: 失败 ({response.status_code}) - {response.json()}")
    except Exception as e:
        failure_count += 1
        print(f"  {endpoint}: 异常 - {type(e).__name__}: {e}")

print(f"\n统计: 成功 {success_count}, 失败 {failure_count}")
print(f"总请求次数: {client.session.call_count}")
```

## 总结

本章我们深入学习了Python异常处理的进阶内容，涵盖了以下核心主题：

**自定义异常类**：通过创建自定义异常类，可以构建语义明确的异常体系，携带丰富的上下文信息，实现精细化的错误处理。在大型项目中，设计一个有层次结构的异常体系是重要的最佳实践。

**raise抛出异常**：`raise`语句用于主动抛出异常，支持多种形式。在参数验证、状态检查、不支持的操做等场景中，适时地抛出异常可以使代码更加健壮和可维护。

**异常链**：Python 3的异常链机制允许在转换异常类型时保留原始异常信息。通过`raise...from`显式设置异常链，或使用`raise...from None`抑制异常链，可以根据需要灵活控制异常的传播和展示。

**断言**：`assert`语句用于调试和开发阶段的内部不变量检查。与`raise`不同，`assert`主要用于检查"不应该发生"的情况，可以通过`-O`标志在生产环境中禁用。

**日志记录**：`logging`模块提供了强大而灵活的日志记录功能，支持多级别日志、多输出目标、日志轮转等。在异常处理中，合理使用日志可以记录详细的错误信息，便于问题排查和系统监控。

**网络请求重试机制**：在实际项目中，网络请求的异常处理尤为重要。通过实现指数退避、抖动、条件重试和断路器模式等策略，可以构建健壮的HTTP客户端，有效应对网络波动和服务器故障。

这些进阶技术是构建高质量Python应用的基础。在下一章中，我们将通过一个综合实战项目，将这些知识应用到实际开发中，构建一个工程化的命令行工具项目。
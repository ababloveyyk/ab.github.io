---
title: Python模块包与异常Ⅲ——异常处理基础
date: 2026-07-26
tags:
  - Python
  - 异常处理
  - try-except
  - 错误处理
categories:
  - Python
---

## 一、异常的概念与常见异常类型

### 1.1 什么是异常

在编程中，异常（Exception）是指程序在执行过程中发生的错误事件。当Python解释器遇到无法处理的错误时，它会"抛出"（raise）一个异常，程序的控制流会从正常执行路径转移到异常处理代码。

理解异常的概念对于编写健壮的Python程序至关重要。没有异常处理的程序遇到错误就会崩溃，而有了适当的异常处理，程序可以优雅地处理错误情况，继续运行或给出有意义的错误信息。

异常与语法错误（Syntax Error）不同。语法错误是在代码解析阶段发现的，程序根本无法运行；而异常是在程序运行时发生的，通过适当的处理可以避免程序崩溃。

```python
# 示例：理解异常的概念
print("=" * 60)
print("理解异常的概念")
print("=" * 60)

# 示例1：没有异常处理的代码会崩溃
print("示例1: 除零错误")
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"  捕获到异常: {type(e).__name__}: {e}")
    print("  程序没有崩溃，继续执行")

# 示例2：不同的错误类型
print("\n示例2: 各种错误类型")

# 类型错误
try:
    result = "hello" + 42
except TypeError as e:
    print(f"  TypeError: {e}")

# 索引错误
try:
    my_list = [1, 2, 3]
    print(my_list[10])
except IndexError as e:
    print(f"  IndexError: {e}")

# 键错误
try:
    my_dict = {"name": "张三"}
    print(my_dict["age"])
except KeyError as e:
    print(f"  KeyError: {e}")

# 值错误
try:
    num = int("abc")
except ValueError as e:
    print(f"  ValueError: {e}")

# 文件未找到错误
try:
    with open("nonexistent_file.txt", "r") as f:
        content = f.read()
except FileNotFoundError as e:
    print(f"  FileNotFoundError: {e}")
```

### 1.2 Python异常层次结构

Python的异常体系是一个层次化的类结构。所有内置异常都继承自`BaseException`类，而常见的异常通常继承自`Exception`类。理解这个层次结构有助于你编写更精确的异常处理代码。

```python
# 示例：异常层次结构
print("=" * 60)
print("Python异常层次结构")
print("=" * 60)

# 查看异常类的继承关系
def show_exception_hierarchy():
    """展示常见异常的继承关系"""
    exceptions = [
        BaseException,
        Exception,
        ArithmeticError,
        ZeroDivisionError,
        LookupError,
        IndexError,
        KeyError,
        TypeError,
        ValueError,
        FileNotFoundError,
        IOError,
        OSError,
        RuntimeError,
        AttributeError,
        ImportError,
        ModuleNotFoundError,
        NameError,
        SyntaxError,
        IndentationError,
    ]
    
    for exc in exceptions:
        bases = [b.__name__ for b in exc.__mro__]
        print(f"{exc.__name__:25s} -> {' -> '.join(bases)}")

show_exception_hierarchy()

print("\n关键要点:")
print("  BaseException: 所有异常的基类")
print("  Exception: 所有非系统退出异常的基类")
print("  - 捕获Exception可以捕获大多数常见异常")
print("  - 不应该捕获BaseException（会捕获SystemExit等）")
print("  - 应该捕获最具体的异常类型")
```

### 1.3 常见异常类型详解

```python
# 示例：常见异常类型详解
print("=" * 60)
print("常见异常类型详解")
print("=" * 60)

# 1. ZeroDivisionError - 除零错误
print("1. ZeroDivisionError - 除零错误:")
try:
    x = 1 / 0
except ZeroDivisionError:
    print("  不能除以零！")

# 2. TypeError - 类型错误
print("\n2. TypeError - 类型错误:")
try:
    result = "string" + 42
except TypeError as e:
    print(f"  类型错误: {e}")

# 3. ValueError - 值错误
print("\n3. ValueError - 值错误:")
try:
    int("abc")
except ValueError as e:
    print(f"  值错误: {e}")

# 4. IndexError - 索引错误
print("\n4. IndexError - 索引错误:")
try:
    lst = [1, 2, 3]
    print(lst[100])
except IndexError as e:
    print(f"  索引错误: {e}")

# 5. KeyError - 键错误
print("\n5. KeyError - 键错误:")
try:
    d = {"a": 1}
    print(d["b"])
except KeyError as e:
    print(f"  键错误: {e}")

# 6. AttributeError - 属性错误
print("\n6. AttributeError - 属性错误:")
try:
    x = 42
    x.append(10)
except AttributeError as e:
    print(f"  属性错误: {e}")

# 7. NameError - 名称错误
print("\n7. NameError - 名称错误:")
try:
    print(undefined_variable)
except NameError as e:
    print(f"  名称错误: {e}")

# 8. FileNotFoundError - 文件未找到
print("\n8. FileNotFoundError - 文件未找到:")
try:
    open("nonexistent.txt")
except FileNotFoundError as e:
    print(f"  文件未找到: {e}")

# 9. ImportError / ModuleNotFoundError
print("\n9. ModuleNotFoundError - 模块未找到:")
try:
    import nonexistent_module
except ModuleNotFoundError as e:
    print(f"  模块未找到: {e}")

# 10. PermissionError - 权限错误
print("\n10. PermissionError - 权限错误:")
try:
    open("/root/secret.txt")  # 在Windows上可能不会触发
except PermissionError as e:
    print(f"  权限错误: {e}")
except FileNotFoundError:
    print("  文件不存在（非权限问题）")
```

### 1.4 异常的触发场景分析

理解异常在什么场景下会被触发，对于编写健壮的代码至关重要。下面我们分析一些常见的异常触发场景。

```python
# 示例：异常触发场景分析
print("=" * 60)
print("异常触发场景分析")
print("=" * 60)

# 场景1：用户输入处理
def process_user_input():
    """处理用户输入可能引发的异常"""
    user_input = "abc"  # 模拟用户输入
    
    try:
        age = int(user_input)
        print(f"年龄: {age}")
    except ValueError:
        print("请输入有效的数字！")

print("场景1: 用户输入处理")
process_user_input()

# 场景2：文件操作
def read_file_safe(filename):
    """安全地读取文件"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"文件 '{filename}' 不存在")
    except PermissionError:
        print(f"没有权限读取文件 '{filename}'")
    except UnicodeDecodeError:
        print(f"文件编码错误，尝试使用其他编码")
    except IOError as e:
        print(f"读取文件时发生IO错误: {e}")
    return None

print("\n场景2: 文件操作")
result = read_file_safe("nonexistent.txt")

# 场景3：网络请求
def simulate_network_request(url):
    """模拟网络请求可能引发的异常"""
    import time
    
    try:
        # 模拟网络请求
        if "timeout" in url:
            raise TimeoutError("请求超时")
        elif "error" in url:
            raise ConnectionError("连接失败")
        else:
            return {"status": 200, "data": "success"}
    except TimeoutError as e:
        print(f"请求超时: {e}")
    except ConnectionError as e:
        print(f"连接失败: {e}")
    return None

print("\n场景3: 网络请求")
simulate_network_request("http://timeout.example.com")
simulate_network_request("http://error.example.com")

# 场景4：数据结构操作
def process_list(items):
    """处理列表可能引发的异常"""
    try:
        if not items:
            raise ValueError("列表不能为空")
        first = items[0]
        last = items[-1]
        return first, last
    except IndexError:
        print("列表为空，无法访问元素")
    except TypeError:
        print("参数类型错误，需要列表")
    except ValueError as e:
        print(f"参数错误: {e}")

print("\n场景4: 数据结构操作")
process_list([])
process_list([1, 2, 3])
```

## 二、try/except基本语法

### 2.1 try/except的基本结构

`try/except`语句是Python异常处理的核心机制。它的基本语法如下：

```python
try:
    # 可能引发异常的代码
    risky_operation()
except SomeException:
    # 处理特定类型的异常
    handle_error()
```

当`try`块中的代码引发异常时，Python会立即停止执行`try`块中剩余的代码，跳转到匹配的`except`块。如果`try`块中的代码正常执行完毕（没有异常），则跳过所有的`except`块。

```python
# 示例：try/except的基本结构
print("=" * 60)
print("try/except基本结构")
print("=" * 60)

# 基本用法
print("示例1: 基本try/except")
try:
    result = 10 / 0
    print("这行不会执行")
except ZeroDivisionError:
    print("捕获到除零错误")

print("程序继续执行...")

# 使用as关键字获取异常对象
print("\n示例2: 使用as获取异常信息")
try:
    x = int("abc")
except ValueError as e:
    print(f"捕获到ValueError: {e}")
    print(f"异常类型: {type(e).__name__}")
    print(f"异常参数: {e.args}")

# 多个except块
print("\n示例3: 多个except块")
def divide_numbers(a, b):
    try:
        result = a / b
        print(f"{a} / {b} = {result}")
    except ZeroDivisionError:
        print("错误: 除数不能为零")
    except TypeError:
        print("错误: 操作数类型不正确")
    except Exception as e:
        print(f"未知错误: {e}")

divide_numbers(10, 2)
divide_numbers(10, 0)
divide_numbers("10", 2)

# 没有异常时执行
print("\n示例4: 没有异常时")
try:
    result = 10 / 2
    print(f"计算结果: {result}")
except ZeroDivisionError:
    print("这行不会执行")
print("正常执行完毕")
```

### 2.2 捕获多个异常

在某些情况下，你可能需要对多种异常类型执行相同的处理逻辑。Python提供了两种方式来捕获多个异常：

1. 在一个`except`块中列出多个异常类型（使用元组）
2. 使用多个`except`块，每个处理一种异常

```python
# 示例：捕获多个异常
print("=" * 60)
print("捕获多个异常")
print("=" * 60)

# 方式一：在一个except块中捕获多个异常
print("方式一: 一个except块捕获多个异常")
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except (ZeroDivisionError, TypeError) as e:
        print(f"计算错误: {type(e).__name__}: {e}")
        return None

print(f"safe_divide(10, 2) = {safe_divide(10, 2)}")
print(f"safe_divide(10, 0) = {safe_divide(10, 0)}")
print(f"safe_divide('10', 2) = {safe_divide('10', 2)}")

# 方式二：多个except块，每个处理不同异常
print("\n方式二: 多个except块处理不同异常")
def process_data(data):
    try:
        # 尝试将数据转换为整数
        num = int(data)
        # 尝试计算倒数
        result = 100 / num
        return result
    except ValueError:
        print(f"'{data}' 不是有效的数字")
        return None
    except ZeroDivisionError:
        print("不能计算零的倒数")
        return None
    except TypeError:
        print(f"数据类型不正确: {type(data)}")
        return None

print(f"process_data('50') = {process_data('50')}")
print(f"process_data('abc') = {process_data('abc')}")
print(f"process_data('0') = {process_data('0')}")

# 异常捕获的顺序很重要
print("\n注意: 异常捕获顺序很重要")
print("应该先捕获具体的异常，再捕获通用的异常")

def demonstrate_order():
    try:
        x = 1 / 0
    except ZeroDivisionError:
        print("捕获到ZeroDivisionError（具体异常）")
    except ArithmeticError:
        print("捕获到ArithmeticError（父类异常）")
    except Exception:
        print("捕获到Exception（更通用的异常）")

demonstrate_order()

# 错误的顺序（父类在前）
print("\n错误示例: 父类异常在前会捕获所有子类异常")
def demonstrate_wrong_order():
    try:
        x = 1 / 0
    except Exception:
        print("Exception捕获了所有异常，后面的ZeroDivisionError永远不会执行")
    except ZeroDivisionError:
        print("这行永远不会执行")
    # 这种写法在逻辑上是错误的，但Python不会报错

demonstrate_wrong_order()
```

### 2.3 获取异常详细信息

当异常发生时，获取异常的详细信息对于调试和错误处理非常重要。Python提供了多种方式来获取异常信息。

```python
# 示例：获取异常详细信息
import sys
import traceback

print("=" * 60)
print("获取异常详细信息")
print("=" * 60)

# 1. 使用as关键字获取异常对象
print("1. 使用as获取异常对象:")
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print(f"  异常类型: {type(e).__name__}")
    print(f"  异常消息: {str(e)}")
    print(f"  异常参数: {e.args}")

# 2. 使用sys.exc_info()获取异常信息
print("\n2. 使用sys.exc_info():")
try:
    int("abc")
except:
    exc_type, exc_value, exc_traceback = sys.exc_info()
    print(f"  异常类型: {exc_type.__name__}")
    print(f"  异常值: {exc_value}")
    print(f"  追踪对象: {exc_traceback}")

# 3. 使用traceback模块获取详细堆栈
print("\n3. 使用traceback.format_exc()获取堆栈信息:")
def func_a():
    return 1 / 0

def func_b():
    return func_a()

def func_c():
    try:
        return func_b()
    except Exception as e:
        print("发生异常，堆栈跟踪:")
        print(traceback.format_exc())

func_c()

# 4. 打印异常信息到不同输出
print("\n4. 打印异常信息:")
try:
    open("nonexistent.txt")
except FileNotFoundError as e:
    # 使用traceback.print_exc()打印到stderr
    print("  使用traceback.print_exc()输出:")
    traceback.print_exc()

# 5. 获取异常发生的行号和文件名
print("\n5. 获取异常位置信息:")
try:
    x = [1, 2, 3]
    y = x[10]
except IndexError as e:
    exc_type, exc_value, exc_tb = sys.exc_info()
    # 获取最后一个调用帧
    filename = exc_tb.tb_frame.f_code.co_filename
    lineno = exc_tb.tb_lineno
    func_name = exc_tb.tb_frame.f_code.co_name
    print(f"  文件: {filename}")
    print(f"  行号: {lineno}")
    print(f"  函数: {func_name}")
```

## 三、else子句

### 3.1 else子句的作用

`try/except`语句还可以包含一个可选的`else`子句。`else`子句中的代码只有在`try`块中没有发生任何异常时才会执行。这比将代码放在`try`块中更好，因为它明确地表示了哪些代码可能引发异常，哪些代码只在没有异常时执行。

使用`else`子句有以下好处：

- 代码意图更清晰：`else`块中的代码明确表示"只有在没有异常时才执行"
- 避免意外捕获异常：如果将有风险的代码放在`try`块中，`except`可能会意外捕获到不属于真正风险操作的异常
- 减少`try`块的范围：`try`块应该只包含可能引发异常的代码，`else`块包含依赖`try`块成功执行的代码

```python
# 示例：else子句的使用
print("=" * 60)
print("else子句的使用")
print("=" * 60)

# 基本用法
print("示例1: 基本else用法")
try:
    result = 10 / 2
except ZeroDivisionError:
    print("除数不能为零")
else:
    print(f"计算成功，结果是: {result}")
    # 这里可以放心使用result，因为try块成功执行了

# 对比：没有else时
print("\n示例2: 没有else的对比")
try:
    result = 10 / 0
    print(f"计算成功，结果是: {result}")  # 这行不会执行
except ZeroDivisionError:
    print("除数不能为零")

# 文件读取示例
print("\n示例3: 文件读取")
import os
import tempfile

# 创建一个测试文件
tmp_dir = tempfile.mkdtemp()
test_file = os.path.join(tmp_dir, "test.txt")
with open(test_file, 'w', encoding='utf-8') as f:
    f.write("Hello, Python!")

# 使用else的文件读取
try:
    f = open(test_file, 'r', encoding='utf-8')
except FileNotFoundError:
    print("文件不存在")
except PermissionError:
    print("没有权限读取文件")
else:
    # 只有在文件成功打开时才执行
    content = f.read()
    print(f"文件内容: {content}")
    f.close()  # 注意：这里应该使用with语句，这里仅作演示

# 清理
os.remove(test_file)
os.rmdir(tmp_dir)

# 数据库操作模拟
print("\n示例4: 数据库操作模拟")
class DatabaseConnection:
    def __init__(self):
        self.connected = False
    
    def connect(self):
        # 模拟连接
        self.connected = True
        print("数据库连接成功")
    
    def execute(self, query):
        if not self.connected:
            raise ConnectionError("未连接到数据库")
        print(f"执行查询: {query}")
        return [{"id": 1, "name": "张三"}]
    
    def close(self):
        self.connected = False
        print("数据库连接已关闭")

def query_database():
    db = DatabaseConnection()
    try:
        db.connect()
    except ConnectionError:
        print("无法连接到数据库")
    else:
        # 连接成功后才执行查询
        try:
            results = db.execute("SELECT * FROM users")
            print(f"查询结果: {results}")
        except Exception as e:
            print(f"查询失败: {e}")
        finally:
            db.close()

query_database()
```

### 3.2 else子句的典型应用场景

```python
# 示例：else子句的典型应用场景
print("=" * 60)
print("else子句的典型应用场景")
print("=" * 60)

# 场景1：数据验证
print("场景1: 数据验证")
def validate_and_process(data):
    try:
        # 验证数据
        if not isinstance(data, dict):
            raise TypeError("数据必须是字典类型")
        if 'name' not in data:
            raise ValueError("缺少'name'字段")
        if 'age' not in data:
            raise ValueError("缺少'age'字段")
        age = int(data['age'])
        if age < 0 or age > 150:
            raise ValueError("年龄必须在0-150之间")
    except (TypeError, ValueError) as e:
        print(f"数据验证失败: {e}")
        return None
    else:
        # 验证通过，处理数据
        print(f"数据验证通过: {data}")
        return {
            'name': data['name'].strip().title(),
            'age': age,
            'is_adult': age >= 18
        }

print(validate_and_process({'name': '张三', 'age': '25'}))
print(validate_and_process({'name': '李四', 'age': '-5'}))
print(validate_and_process({'name': '王五'}))

# 场景2：数值计算
print("\n场景2: 数值计算")
def safe_calculate(expression):
    """安全地计算表达式"""
    try:
        # 使用eval有风险，这里仅作演示
        result = eval(expression)
    except (SyntaxError, NameError) as e:
        print(f"表达式语法错误: {e}")
    except ZeroDivisionError:
        print("表达式包含除零操作")
    except Exception as e:
        print(f"计算错误: {e}")
    else:
        print(f"表达式 '{expression}' = {result}")
        return result

safe_calculate("10 + 20 * 3")
safe_calculate("10 / 0")
safe_calculate("10 + ")

# 场景3：API调用
print("\n场景3: API调用模拟")
import random

def call_api(endpoint):
    """模拟API调用"""
    # 模拟不同的响应
    status = random.choice([200, 404, 500])
    if status == 500:
        raise ConnectionError("服务器内部错误")
    return {'status': status, 'data': {'message': 'success'}}

def fetch_data(endpoint):
    try:
        response = call_api(endpoint)
    except ConnectionError as e:
        print(f"API调用失败: {e}")
        return None
    else:
        if response['status'] == 200:
            print(f"API调用成功: {response['data']}")
            return response['data']
        elif response['status'] == 404:
            print(f"资源未找到 (404)")
            return None
        else:
            print(f"未知状态码: {response['status']}")
            return None

# 多次调用以触发不同情况
random.seed(42)
for i in range(3):
    print(f"\n第{i+1}次调用:")
    fetch_data("/api/users")
```

## 四、finally子句

### 4.1 finally子句的作用

`finally`子句是`try`语句的最后一个可选部分。无论`try`块中是否发生异常，`finally`块中的代码都会被执行。即使`try`块中有`return`、`break`或`continue`语句，`finally`块也会被执行。

`finally`子句通常用于执行清理操作，如关闭文件、释放数据库连接、释放锁等资源。这是确保资源被正确释放的最可靠方式。

```python
# 示例：finally子句的基本使用
print("=" * 60)
print("finally子句的基本使用")
print("=" * 60)

# 基本用法
print("示例1: 基本finally")
try:
    print("  try块执行")
    x = 1 / 0
except ZeroDivisionError:
    print("  except块执行")
finally:
    print("  finally块执行（无论是否有异常）")

# 没有异常时
print("\n示例2: 没有异常时的finally")
try:
    print("  try块执行成功")
    x = 1 / 1
except ZeroDivisionError:
    print("  except块不执行")
finally:
    print("  finally块仍然执行")

# 即使有return，finally也会执行
print("\n示例3: 有return时的finally")
def test_finally():
    try:
        print("  try块执行")
        return "try的返回值"
    except:
        print("  except块")
    finally:
        print("  finally块执行（在return之前）")

result = test_finally()
print(f"  函数返回值: {result}")

# finally执行顺序
print("\n示例4: finally执行顺序")
def test_order():
    try:
        print("  1. try开始")
        return "try_return"
    except:
        print("  except")
    finally:
        print("  2. finally执行")
    print("  3. 这行不会执行（因为try中有return）")

test_order()
```

### 4.2 finally子句的资源清理

```python
# 示例：finally子句的资源清理
print("=" * 60)
print("finally子句的资源清理")
print("=" * 60)

# 1. 文件操作清理
print("1. 文件操作清理:")
import os
import tempfile

def safe_file_read(filename):
    """安全地读取文件，使用finally确保文件关闭"""
    f = None
    try:
        f = open(filename, 'r', encoding='utf-8')
        content = f.read()
        return content
    except FileNotFoundError:
        print(f"文件不存在: {filename}")
        return None
    except Exception as e:
        print(f"读取文件时出错: {e}")
        return None
    finally:
        if f:
            f.close()
            print("  文件已关闭")

# 创建测试文件
tmp_dir = tempfile.mkdtemp()
test_file = os.path.join(tmp_dir, "test.txt")
with open(test_file, 'w', encoding='utf-8') as f:
    f.write("测试内容")

content = safe_file_read(test_file)
print(f"  读取内容: {content}")

# 读取不存在的文件
safe_file_read("nonexistent.txt")

# 清理
os.remove(test_file)
os.rmdir(tmp_dir)

# 2. 数据库连接清理
print("\n2. 数据库连接清理:")
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connected = False
        self.transaction_active = False
    
    def connect(self):
        print(f"  连接到数据库: {self.db_name}")
        self.connected = True
    
    def begin_transaction(self):
        if not self.connected:
            raise ConnectionError("未连接")
        print("  开始事务")
        self.transaction_active = True
    
    def execute(self, query):
        if not self.connected:
            raise ConnectionError("未连接")
        print(f"  执行: {query}")
        if "ERROR" in query:
            raise RuntimeError("查询执行失败")
    
    def commit(self):
        print("  提交事务")
        self.transaction_active = False
    
    def rollback(self):
        print("  回滚事务")
        self.transaction_active = False
    
    def close(self):
        print("  关闭连接")
        self.connected = False

def update_database(should_fail=False):
    db = DatabaseConnection("my_database")
    try:
        db.connect()
        db.begin_transaction()
        
        db.execute("INSERT INTO users VALUES (1, '张三')")
        if should_fail:
            db.execute("ERROR: 故意失败")
        db.execute("INSERT INTO users VALUES (2, '李四')")
        
        db.commit()
        print("  数据库更新成功")
    except Exception as e:
        print(f"  数据库操作失败: {e}")
        if db.transaction_active:
            db.rollback()
    finally:
        db.close()

print("  正常情况:")
update_database(should_fail=False)
print("\n  异常情况:")
update_database(should_fail=True)

# 3. 锁的释放
print("\n3. 模拟锁的释放:")
import threading

class MockLock:
    def __init__(self):
        self.locked = False
    
    def acquire(self):
        if self.locked:
            raise RuntimeError("锁已被占用")
        self.locked = True
        print("  锁已获取")
    
    def release(self):
        if self.locked:
            self.locked = False
            print("  锁已释放")

def critical_section(lock, should_fail=False):
    try:
        lock.acquire()
        print("  执行关键操作...")
        if should_fail:
            raise RuntimeError("关键操作失败")
        print("  关键操作成功")
    except Exception as e:
        print(f"  操作失败: {e}")
    finally:
        lock.release()

lock = MockLock()
print("  正常情况:")
critical_section(lock, should_fail=False)
print("\n  异常情况:")
critical_section(lock, should_fail=True)
```

### 4.3 try/except/else/finally组合

```python
# 示例：try/except/else/finally完整组合
print("=" * 60)
print("try/except/else/finally完整组合")
print("=" * 60)

def process_file(filename):
    """完整的文件处理流程，演示所有子句的组合"""
    f = None
    try:
        # 可能引发异常的代码
        print(f"正在打开文件: {filename}")
        f = open(filename, 'r', encoding='utf-8')
        content = f.read()
        # 处理内容
        if not content:
            raise ValueError("文件内容为空")
        
    except FileNotFoundError:
        print(f"错误: 文件 '{filename}' 不存在")
        return None
    
    except PermissionError:
        print(f"错误: 没有权限读取文件 '{filename}'")
        return None
    
    except ValueError as e:
        print(f"错误: {e}")
        return None
    
    except Exception as e:
        print(f"未知错误: {e}")
        return None
    
    else:
        # 只有在没有异常时执行
        print(f"文件读取成功，共 {len(content)} 个字符")
        word_count = len(content.split())
        print(f"单词数量: {word_count}")
        return content
    
    finally:
        # 无论如何都会执行
        if f:
            f.close()
            print("文件已关闭")
        print("处理完成")

# 创建测试文件
import tempfile
import os

tmp_dir = tempfile.mkdtemp()

# 测试正常文件
test_file = os.path.join(tmp_dir, "test.txt")
with open(test_file, 'w', encoding='utf-8') as f:
    f.write("Hello World! This is a test file.\n" * 10)

print("测试1: 正常文件")
process_file(test_file)

print("\n" + "-" * 40)
print("测试2: 不存在的文件")
process_file("nonexistent.txt")

# 清理
os.remove(test_file)
os.rmdir(tmp_dir)

# 完整流程图
print("\n" + "=" * 60)
print("try/except/else/finally执行流程")
print("=" * 60)
print("""
执行顺序:
  1. 执行 try 块中的代码
  2. 如果 try 块中发生异常:
     a. 跳转到匹配的 except 块
     b. 执行 except 块中的代码
     c. 跳过 else 块
  3. 如果 try 块中没有异常:
     a. 执行 else 块中的代码
     b. 跳过所有 except 块
  4. 无论如何，执行 finally 块中的代码
  5. 如果异常没有被捕获，在finally执行后继续传播
""")
```

## 五、异常的传播机制

### 5.1 异常传播的基本原理

当异常在一个函数内部发生时，如果该函数没有捕获这个异常，异常会沿着调用栈向上传播，直到被某个调用者捕获，或者到达程序的最顶层导致程序终止。

理解异常的传播机制非常重要，因为它决定了你应该在哪个层级处理异常，以及如何处理。

```python
# 示例：异常传播机制
print("=" * 60)
print("异常传播机制")
print("=" * 60)

def level3():
    """最底层函数，可能引发异常"""
    print("  level3: 开始执行")
    result = 1 / 0  # 引发ZeroDivisionError
    print("  level3: 这行不会执行")
    return result

def level2():
    """中间层函数"""
    print("  level2: 开始执行")
    try:
        result = level3()
        print("  level2: 这行不会执行")
        return result
    except ValueError:
        # 只捕获ValueError，不捕获ZeroDivisionError
        print("  level2: 捕获到ValueError")
    print("  level2: 这行也不会执行（异常继续传播）")
    return None

def level1():
    """顶层函数"""
    print("level1: 开始执行")
    try:
        result = level2()
        print("level1: 这行不会执行")
        return result
    except ZeroDivisionError as e:
        print(f"level1: 捕获到异常: {e}")
        print("level1: 异常传播路径: level3 -> level2 -> level1")
    print("level1: 继续执行")
    return None

print("演示异常传播:")
level1()

# 异常传播的详细追踪
print("\n" + "=" * 60)
print("异常传播详细追踪")
print("=" * 60)

import traceback

def function_d():
    raise ValueError("从function_d抛出的异常")

def function_c():
    function_d()

def function_b():
    try:
        function_c()
    except ValueError:
        # 捕获后重新抛出
        print("function_b: 捕获到异常，添加信息后重新抛出")
        raise RuntimeError("function_b添加的上下文") from ValueError("原始异常")

def function_a():
    try:
        function_b()
    except RuntimeError as e:
        print(f"function_a: 最终捕获异常")
        print(f"  异常类型: {type(e).__name__}")
        print(f"  异常消息: {e}")
        print(f"  原始异常: {e.__cause__}")
        print("\n完整堆栈跟踪:")
        traceback.print_exc()

function_a()
```

### 5.2 异常传播的实际应用

```python
# 示例：异常传播的实际应用
print("=" * 60)
print("异常传播的实际应用")
print("=" * 60)

# 场景1：分层架构中的异常传播
print("场景1: 分层架构中的异常传播")

class DataAccessError(Exception):
    """数据访问层异常"""
    pass

class BusinessLogicError(Exception):
    """业务逻辑层异常"""
    pass

class PresentationError(Exception):
    """表示层异常"""
    pass

# 数据访问层
def fetch_user_from_db(user_id):
    """从数据库获取用户"""
    if user_id <= 0:
        raise DataAccessError(f"无效的用户ID: {user_id}")
    # 模拟数据库查询
    if user_id == 999:
        raise DataAccessError("数据库连接超时")
    return {"id": user_id, "name": f"用户{user_id}"}

# 业务逻辑层
def get_user_info(user_id):
    """获取用户信息（业务逻辑）"""
    try:
        user = fetch_user_from_db(user_id)
    except DataAccessError as e:
        # 将数据访问异常转换为业务异常
        raise BusinessLogicError(f"获取用户信息失败: {e}") from e
    
    # 业务逻辑处理
    if user['name'] == '用户13':
        raise BusinessLogicError("该用户已被禁用")
    
    return user

# 表示层
def display_user(user_id):
    """显示用户信息"""
    try:
        user = get_user_info(user_id)
        print(f"  用户信息: {user}")
    except BusinessLogicError as e:
        print(f"  业务错误: {e}")
    except Exception as e:
        print(f"  系统错误: {e}")

print("  正常查询:")
display_user(1)

print("\n  无效ID:")
display_user(-1)

print("\n  数据库错误:")
display_user(999)

# 场景2：异常传播与资源清理
print("\n" + "=" * 60)
print("场景2: 异常传播与资源清理")
print("=" * 60)

class Resource:
    def __init__(self, name):
        self.name = name
        self.acquired = False
    
    def acquire(self):
        print(f"  获取资源: {self.name}")
        self.acquired = True
    
    def release(self):
        if self.acquired:
            print(f"  释放资源: {self.name}")
            self.acquired = False
    
    def use(self, fail=False):
        if not self.acquired:
            raise RuntimeError(f"资源 {self.name} 未获取")
        print(f"  使用资源: {self.name}")
        if fail:
            raise RuntimeError(f"使用资源 {self.name} 时出错")

def process_with_resources(fail_resource=None):
    """处理多个资源，确保正确清理"""
    resources = []
    try:
        # 获取资源
        for name in ['资源A', '资源B', '资源C']:
            r = Resource(name)
            r.acquire()
            resources.append(r)
        
        # 使用资源
        for r in resources:
            should_fail = (r.name == fail_resource)
            r.use(fail=should_fail)
        
        print("  所有资源处理成功")
    except Exception as e:
        print(f"  处理失败: {e}")
        # 异常会继续传播，但finally会执行清理
        raise
    finally:
        # 确保所有资源被释放
        for r in reversed(resources):
            r.release()

print("  正常处理:")
try:
    process_with_resources()
except:
    pass

print("\n  处理失败（资源B出错）:")
try:
    process_with_resources(fail_resource='资源B')
except:
    pass
```

## 六、异常处理最佳实践与综合示例

### 6.1 异常处理最佳实践

```python
# 示例：异常处理最佳实践
print("=" * 60)
print("异常处理最佳实践")
print("=" * 60)

print("""
1. 只捕获你能处理的异常
   - 不要使用空的except（会捕获所有异常，包括KeyboardInterrupt）
   - 捕获最具体的异常类型

2. 保持try块尽可能小
   - try块应该只包含可能引发异常的代码
   - 不要将无关代码放在try块中

3. 使用else子句
   - 将只在try块成功时才执行的代码放在else中
   - 减少try块的范围

4. 使用finally进行清理
   - 确保资源（文件、连接、锁等）被正确释放
   - 优先使用with语句（上下文管理器）

5. 不要忽略异常
   - 至少记录日志
   - 不要使用 except: pass

6. 异常链
   - 使用 raise ... from 来保留原始异常信息
   - 在转换异常类型时保留原始异常

7. 自定义异常
   - 创建有意义的异常类
   - 为不同的错误场景创建不同的异常类型
""")

# 不良实践示例
print("不良实践示例:")
print("-" * 40)

# 错误1：空的except
print("错误1: 空的except")
try:
    x = 1 / 0
except:
    print("  (不良) 捕获了所有异常，不知道具体是什么问题")

# 正确做法
try:
    x = 1 / 0
except ZeroDivisionError:
    print("  (正确) 明确捕获ZeroDivisionError")

# 错误2：try块太大
print("\n错误2: try块太大")
# 不良做法
def bad_example():
    try:
        # 太多代码在try块中
        data = input("请输入: ")
        num = int(data)
        result = 100 / num
        print(f"结果: {result}")
        with open("output.txt", "w") as f:
            f.write(str(result))
        print("处理完成")
    except:
        print("发生错误")

# 正确做法
def good_example():
    try:
        data = input("请输入: ")
        num = int(data)
    except ValueError:
        print("请输入有效的数字")
        return
    
    try:
        result = 100 / num
    except ZeroDivisionError:
        print("不能输入0")
        return
    
    print(f"结果: {result}")
    # 文件操作使用with，不需要try/except
    # 但如果需要，可以单独处理
```

### 6.2 综合示例：构建安全的计算器

```python
# 示例：综合示例 - 构建安全的计算器
print("=" * 60)
print("综合示例: 安全计算器")
print("=" * 60)

class CalculatorError(Exception):
    """计算器基础异常"""
    pass

class DivisionByZeroError(CalculatorError):
    """除零错误"""
    pass

class InvalidInputError(CalculatorError):
    """无效输入错误"""
    pass

class InvalidOperationError(CalculatorError):
    """无效操作错误"""
    pass

class SafeCalculator:
    """安全计算器类"""
    
    def __init__(self):
        self.history = []
        self.result = 0
    
    def calculate(self, a, operator, b):
        """执行计算"""
        try:
            # 验证输入
            a = self._validate_number(a, "第一个操作数")
            b = self._validate_number(b, "第二个操作数")
            
            # 验证操作符
            if operator not in ('+', '-', '*', '/', '**', '%'):
                raise InvalidOperationError(f"不支持的操作: {operator}")
            
            # 执行计算
            if operator == '+':
                result = a + b
            elif operator == '-':
                result = a - b
            elif operator == '*':
                result = a * b
            elif operator == '/':
                if b == 0:
                    raise DivisionByZeroError("除数不能为零")
                result = a / b
            elif operator == '**':
                result = a ** b
            elif operator == '%':
                if b == 0:
                    raise DivisionByZeroError("取模运算的除数不能为零")
                result = a % b
            
            # 更新结果
            self.result = result
            
            # 记录历史
            self.history.append({
                'a': a,
                'operator': operator,
                'b': b,
                'result': result
            })
            
            return result
            
        except CalculatorError:
            # 计算器相关的异常，直接传播
            raise
        except Exception as e:
            # 其他意外异常
            raise CalculatorError(f"计算过程中发生意外错误: {e}") from e
    
    def _validate_number(self, value, name):
        """验证并转换数字"""
        if isinstance(value, (int, float)):
            return value
        
        if isinstance(value, str):
            try:
                if '.' in value:
                    return float(value)
                else:
                    return int(value)
            except ValueError:
                raise InvalidInputError(f"{name} '{value}' 不是有效的数字")
        
        raise InvalidInputError(f"{name} 类型错误: {type(value).__name__}")
    
    def get_history(self):
        """获取计算历史"""
        if not self.history:
            return "暂无计算历史"
        
        lines = []
        for i, record in enumerate(self.history, 1):
            lines.append(
                f"{i}. {record['a']} {record['operator']} "
                f"{record['b']} = {record['result']}"
            )
        return "\n".join(lines)
    
    def clear_history(self):
        """清除历史"""
        self.history.clear()
        self.result = 0
    
    def evaluate_expression(self, expression):
        """计算简单表达式（如 '10 + 20'）"""
        try:
            if not expression or not expression.strip():
                raise InvalidInputError("表达式不能为空")
            
            # 解析表达式
            parts = expression.strip().split()
            if len(parts) != 3:
                raise InvalidInputError(
                    f"表达式格式错误，应为 'a 运算符 b'，收到: '{expression}'"
                )
            
            a, operator, b = parts
            return self.calculate(a, operator, b)
            
        except CalculatorError:
            raise
        except Exception as e:
            raise CalculatorError(f"表达式解析失败: {e}") from e


# 测试安全计算器
calc = SafeCalculator()

print("测试安全计算器:")
print("-" * 40)

# 正常计算
test_cases = [
    (10, '+', 20),
    (50, '-', 30),
    (7, '*', 8),
    (100, '/', 4),
    (2, '**', 10),
    (17, '%', 5),
]

for a, op, b in test_cases:
    try:
        result = calc.calculate(a, op, b)
        print(f"  {a} {op} {b} = {result}")
    except CalculatorError as e:
        print(f"  {a} {op} {b} -> 错误: {e}")

# 错误情况
print("\n错误情况测试:")
error_cases = [
    (10, '/', 0),
    ('abc', '+', 10),
    (10, '&', 20),
    (10, '%', 0),
]

for a, op, b in error_cases:
    try:
        result = calc.calculate(a, op, b)
        print(f"  {a} {op} {b} = {result}")
    except CalculatorError as e:
        print(f"  {a} {op} {b} -> {type(e).__name__}: {e}")

# 测试表达式计算
print("\n表达式计算测试:")
expressions = [
    "10 + 20",
    "100 / 0",
    "abc + 10",
    "10 *",
    "  50  -  30  ",
]

for expr in expressions:
    try:
        result = calc.evaluate_expression(expr)
        print(f"  '{expr}' = {result}")
    except CalculatorError as e:
        print(f"  '{expr}' -> {type(e).__name__}: {e}")

# 显示计算历史
print("\n计算历史:")
print(calc.get_history())
```

## 总结

本章我们深入学习了Python异常处理的基础知识，涵盖了以下核心内容：

**异常的概念与类型**：异常是程序运行时的错误事件，Python提供了丰富的内置异常类型，形成了一个层次化的异常体系。理解`BaseException`、`Exception`以及各种具体异常（如`ValueError`、`TypeError`、`ZeroDivisionError`等）的继承关系，有助于编写精确的异常处理代码。

**try/except基本语法**：`try/except`是Python异常处理的核心机制。`try`块包含可能引发异常的代码，`except`块处理特定类型的异常。可以使用`as`关键字获取异常对象，也可以在一个`except`块中捕获多个异常类型。异常捕获的顺序很重要，应该先捕获具体的异常，再捕获通用的异常。

**else子句**：`else`子句中的代码只有在`try`块没有发生异常时才会执行。这使得代码意图更加清晰，避免了`except`块意外捕获异常的问题。`else`子句常用于数据验证通过后的处理、成功API调用后的数据解析等场景。

**finally子句**：`finally`子句中的代码无论如何都会执行，即使`try`块中有`return`语句。这使得`finally`成为资源清理的理想位置，用于关闭文件、释放数据库连接、释放锁等操作。需要注意的是，应该优先使用`with`语句（上下文管理器），它比手动使用`finally`更加简洁和安全。

**异常的传播机制**：当异常在函数内部没有被捕获时，它会沿着调用栈向上传播。这种机制允许我们在适当的层级处理异常，底层函数可以专注于业务逻辑，将异常处理留给上层调用者。通过`raise...from`可以保留原始异常信息，形成异常链。

**异常处理最佳实践**：只捕获能处理的异常、保持`try`块尽可能小、使用`else`和`finally`子句、不要忽略异常、使用自定义异常类等。

通过本章的学习，你应该已经掌握了Python异常处理的核心技术。在下一章中，我们将深入学习异常处理的进阶内容，包括自定义异常类、断言、日志记录以及异常处理在实际项目中的应用。
---
title: Python模块包与异常Ⅱ——常用标准库
date: 2026-07-26
tags:
  - Python
  - 标准库
  - os
  - sys
  - datetime
  - random
  - math
  - json
  - re
categories:
  - Python
---

## 一、os模块：文件与目录操作

### 1.1 os模块概述

`os`模块是Python标准库中最重要的模块之一，它提供了与操作系统交互的功能。通过`os`模块，你可以执行文件和目录操作、获取系统信息、管理进程环境等。`os`模块的设计目标是提供跨平台的操作系统接口，使得同一段Python代码可以在Windows、Linux、macOS等不同操作系统上运行，而无需针对不同平台编写不同的代码。

`os`模块包含了数百个函数和常量，涵盖了文件操作、目录操作、路径操作、进程管理、环境变量等多个方面。在实际开发中，我们最常用的是文件目录操作和路径处理功能。

```python
# 示例：os模块的基本使用
import os

# 获取基本系统信息
print("=" * 50)
print("系统基本信息")
print("=" * 50)
print(f"操作系统名称: {os.name}")          # 'nt'表示Windows，'posix'表示Linux/macOS
print(f"当前工作目录: {os.getcwd()}")       # 获取当前工作目录
print(f"操作系统环境变量:")
for key, value in list(os.environ.items())[:5]:
    print(f"  {key} = {value}")

# 获取文件分隔符
print(f"\n路径分隔符: {os.sep}")            # Windows是'\'，Linux是'/'
print(f"路径分隔符(alt): {os.altsep}")      # Windows是'/'，Linux是None
print(f"路径分隔符(extsep): {os.extsep}")   # 扩展名分隔符，通常是'.'
print(f"行分隔符: {repr(os.linesep)}")      # Windows是'\r\n'，Linux是'\n'
```

### 1.2 目录操作

目录操作是`os`模块最常用的功能之一。通过`os`模块，你可以创建、删除、遍历目录，以及获取目录中的文件列表。

```python
# 示例：目录操作详解
import os
import tempfile

# 获取当前工作目录
current_dir = os.getcwd()
print(f"当前工作目录: {current_dir}")

# 创建临时目录用于演示
demo_dir = os.path.join(tempfile.gettempdir(), "python_os_demo")
print(f"\n演示目录: {demo_dir}")

# 创建目录
if not os.path.exists(demo_dir):
    os.mkdir(demo_dir)  # 创建单层目录
    print(f"已创建目录: {demo_dir}")

# 创建多层目录
nested_dir = os.path.join(demo_dir, "level1", "level2", "level3")
os.makedirs(nested_dir, exist_ok=True)  # exist_ok=True表示目录存在时不报错
print(f"已创建多层目录: {nested_dir}")

# 切换工作目录
original_dir = os.getcwd()
os.chdir(demo_dir)
print(f"\n切换工作目录到: {os.getcwd()}")

# 恢复工作目录
os.chdir(original_dir)
print(f"恢复工作目录到: {os.getcwd()}")

# 列出目录内容
# 在演示目录中创建一些文件
for i in range(5):
    file_path = os.path.join(demo_dir, f"test_file_{i}.txt")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(f"这是测试文件 {i}")

print(f"\n{demo_dir} 目录内容:")
contents = os.listdir(demo_dir)
for item in contents:
    full_path = os.path.join(demo_dir, item)
    is_dir = os.path.isdir(full_path)
    item_type = "[目录]" if is_dir else "[文件]"
    print(f"  {item_type} {item}")

# 删除目录
# 先删除文件
for item in os.listdir(demo_dir):
    item_path = os.path.join(demo_dir, item)
    if os.path.isfile(item_path):
        os.remove(item_path)
        print(f"已删除文件: {item_path}")

# 删除空目录
os.rmdir(nested_dir)
os.rmdir(os.path.join(demo_dir, "level1", "level2"))
os.rmdir(os.path.join(demo_dir, "level1"))
print(f"已删除目录: {nested_dir}")

# 清理演示目录
os.rmdir(demo_dir)
print(f"已清理演示目录")
```

### 1.3 文件操作

`os`模块提供了基本的文件操作功能，如重命名、删除、检查文件属性等。对于文件内容的读写，通常使用内置的`open()`函数，但`os`模块提供了文件元数据操作的功能。

```python
# 示例：文件操作详解
import os
import tempfile
import time

# 创建临时文件用于演示
tmp_dir = tempfile.mkdtemp()
demo_file = os.path.join(tmp_dir, "demo.txt")

# 创建文件并写入内容
with open(demo_file, 'w', encoding='utf-8') as f:
    f.write("Hello, Python OS Module!\n" * 100)

print(f"演示文件: {demo_file}")

# 检查文件是否存在
print(f"\n文件是否存在: {os.path.exists(demo_file)}")
print(f"是否为文件: {os.path.isfile(demo_file)}")
print(f"是否为目录: {os.path.isdir(demo_file)}")

# 获取文件信息
file_stat = os.stat(demo_file)
print(f"\n文件信息:")
print(f"  文件大小: {file_stat.st_size} 字节")
print(f"  创建时间: {time.ctime(file_stat.st_ctime)}")
print(f"  修改时间: {time.ctime(file_stat.st_mtime)}")
print(f"  访问时间: {time.ctime(file_stat.st_atime)}")

# 使用os.path获取文件信息
print(f"\n使用os.path获取信息:")
print(f"  文件名: {os.path.basename(demo_file)}")
print(f"  目录名: {os.path.dirname(demo_file)}")
print(f"  文件大小: {os.path.getsize(demo_file)} 字节")

# 文件重命名
new_file = os.path.join(tmp_dir, "renamed_demo.txt")
os.rename(demo_file, new_file)
print(f"\n文件已重命名: {os.path.basename(new_file)}")
print(f"新文件名是否存在: {os.path.exists(new_file)}")
print(f"旧文件名是否存在: {os.path.exists(demo_file)}")

# 文件复制（os模块没有直接复制功能，需要手动实现）
def copy_file(src, dst):
    """简单的文件复制函数"""
    with open(src, 'rb') as f_src:
        with open(dst, 'wb') as f_dst:
            f_dst.write(f_src.read())

copy_file(new_file, os.path.join(tmp_dir, "copy_demo.txt"))
print(f"文件已复制: copy_demo.txt")

# 删除文件
os.remove(new_file)
os.remove(os.path.join(tmp_dir, "copy_demo.txt"))
print(f"文件已删除")

# 清理
os.rmdir(tmp_dir)
```

### 1.4 os.path模块详解

`os.path`是`os`模块中的一个子模块，专门用于路径操作。它提供了跨平台的路径处理函数，可以帮助你拼接、拆分、规范化路径。

```python
# 示例：os.path模块详解
import os

print("=" * 60)
print("os.path模块函数详解")
print("=" * 60)

# 示例路径
example_path = r"C:\Users\Admin\Documents\project\main.py"
# 在Linux上可能是: /home/user/documents/project/main.py

# 路径拼接
print("\n1. 路径拼接:")
print(f"  os.path.join('a', 'b', 'c'): {os.path.join('a', 'b', 'c')}")
print(f"  os.path.join('C:\\\\', 'Users', 'file.txt'): {os.path.join('C:\\\\', 'Users', 'file.txt')}")

# 路径拆分
print("\n2. 路径拆分:")
print(f"  os.path.split('{example_path}'):")
dir_part, file_part = os.path.split(example_path)
print(f"    目录部分: {dir_part}")
print(f"    文件部分: {file_part}")

print(f"  os.path.splitext('main.py'): {os.path.splitext('main.py')}")
print(f"  os.path.splitext('archive.tar.gz'): {os.path.splitext('archive.tar.gz')}")

# 路径信息
print("\n3. 路径信息:")
print(f"  os.path.basename: {os.path.basename(example_path)}")
print(f"  os.path.dirname: {os.path.dirname(example_path)}")
print(f"  os.path.abspath('.'): {os.path.abspath('.')}")

# 路径判断
print("\n4. 路径判断:")
print(f"  os.path.isabs('C:\\\\'): {os.path.isabs('C:\\\\')}")
print(f"  os.path.isabs('relative/path'): {os.path.isabs('relative/path')}")
print(f"  os.path.exists('.'): {os.path.exists('.')}")
print(f"  os.path.isdir('.'): {os.path.isdir('.')}")

# 规范化路径
print("\n5. 路径规范化:")
messy_path = r"C:\Users\Admin\..\Admin\\.\\Documents"
print(f"  原始路径: {messy_path}")
print(f"  规范化后: {os.path.normpath(messy_path)}")

# 相对路径
print("\n6. 相对路径:")
base = r"C:\Users\Admin\Documents"
target = r"C:\Users\Admin\Documents\project\main.py"
print(f"  os.path.relpath('{target}', '{base}'): {os.path.relpath(target, base)}")

# 获取绝对路径的组件
print("\n7. 获取所有组件:")
print(f"  os.path.splitdrive('{example_path}'): {os.path.splitdrive(example_path)}")
```

### 1.5 文件遍历实战

在实际开发中，经常需要遍历目录树来查找或处理文件。`os.walk()`函数是实现这一功能的利器。

```python
# 示例：文件遍历实战
import os
import tempfile
import json

# 创建模拟的项目目录结构
tmp_dir = tempfile.mkdtemp()
project_dir = os.path.join(tmp_dir, "my_project")

# 创建目录结构
dirs_to_create = [
    "src",
    "src/utils",
    "src/models",
    "tests",
    "docs",
    "data",
    "data/raw",
    "data/processed",
]

for d in dirs_to_create:
    os.makedirs(os.path.join(project_dir, d), exist_ok=True)

# 创建一些文件
files_to_create = {
    "README.md": "# My Project",
    "src/main.py": "print('Hello')",
    "src/utils/helpers.py": "def helper(): pass",
    "src/models/user.py": "class User: pass",
    "tests/test_main.py": "def test(): pass",
    "docs/index.md": "# Documentation",
    "data/raw/data.csv": "id,name\n1,Alice",
    "data/processed/clean_data.csv": "id,name\n1,Alice",
    ".gitignore": "*.pyc\n__pycache__",
}

for filepath, content in files_to_create.items():
    full_path = os.path.join(project_dir, filepath)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

# 使用os.walk遍历目录树
print("=" * 60)
print("使用os.walk遍历项目目录")
print("=" * 60)

total_files = 0
total_dirs = 0

for root, dirs, files in os.walk(project_dir):
    # 计算当前目录层级
    level = root.replace(project_dir, '').count(os.sep)
    indent = '  ' * level
    
    # 显示当前目录
    dir_name = os.path.basename(root) if root != project_dir else os.path.basename(project_dir)
    print(f"{indent}[目录] {dir_name}/")
    
    # 显示子目录
    sub_indent = '  ' * (level + 1)
    for d in dirs:
        print(f"{sub_indent}[子目录] {d}/")
    total_dirs += len(dirs)
    
    # 显示文件
    for f in files:
        file_path = os.path.join(root, f)
        size = os.path.getsize(file_path)
        print(f"{sub_indent}[文件] {f} ({size} bytes)")
    total_files += len(files)

print(f"\n统计: 共 {total_dirs} 个目录, {total_files} 个文件")

# 使用os.walk查找特定文件
print("\n" + "=" * 60)
print("查找所有Python文件 (.py)")
print("=" * 60)

python_files = []
for root, dirs, files in os.walk(project_dir):
    for f in files:
        if f.endswith('.py'):
            python_files.append(os.path.join(root, f))

for pf in python_files:
    rel_path = os.path.relpath(pf, project_dir)
    print(f"  {rel_path}")

# 使用os.scandir高效遍历（Python 3.5+）
print("\n" + "=" * 60)
print("使用os.scandir高效遍历（推荐）")
print("=" * 60)

def scan_directory(path, indent=0):
    """递归扫描目录，使用os.scandir"""
    with os.scandir(path) as entries:
        for entry in entries:
            prefix = '  ' * indent
            if entry.is_dir():
                print(f"{prefix}[目录] {entry.name}/")
                scan_directory(entry.path, indent + 1)
            else:
                size = entry.stat().st_size
                print(f"{prefix}[文件] {entry.name} ({size} bytes)")

scan_directory(project_dir)

# 清理
import shutil
shutil.rmtree(tmp_dir)
```

## 二、sys模块：系统参数与运行时环境

### 2.1 sys模块概述

`sys`模块提供了与Python解释器交互的功能。通过`sys`模块，你可以访问命令行参数、控制Python运行时行为、获取系统信息等。`sys`模块是Python程序与操作系统之间的桥梁，在许多场景下都非常有用。

```python
# 示例：sys模块的基本使用
import sys

print("=" * 60)
print("sys模块基本功能")
print("=" * 60)

# Python版本信息
print(f"Python版本: {sys.version}")
print(f"版本信息元组: {sys.version_info}")
print(f"平台标识: {sys.platform}")

# 模块搜索路径
print(f"\n模块搜索路径 (sys.path):")
for i, p in enumerate(sys.path[:5], 1):
    print(f"  {i}. {p}")
print(f"  ... （共 {len(sys.path)} 个路径）")

# 已加载的模块
print(f"\n已加载的模块数量: {len(sys.modules)}")
print(f"部分已加载模块: {list(sys.modules.keys())[:10]}")

# 递归限制
print(f"\n递归深度限制: {sys.getrecursionlimit()}")
```

### 2.2 命令行参数处理

`sys.argv`是一个列表，包含了传递给Python脚本的命令行参数。`sys.argv[0]`是脚本名称，`sys.argv[1:]`是传递给脚本的参数。

```python
# 示例：命令行参数处理
import sys

print("命令行参数处理")
print("=" * 60)

# 显示所有命令行参数
print(f"sys.argv内容: {sys.argv}")
print(f"脚本名称: {sys.argv[0]}")
print(f"参数个数: {len(sys.argv) - 1}")

if len(sys.argv) > 1:
    print(f"参数列表: {sys.argv[1:]}")
    for i, arg in enumerate(sys.argv[1:], 1):
        print(f"  参数{i}: {arg}")
else:
    print("没有提供额外的命令行参数")

# 构建一个简单的命令行工具
def parse_args():
    """解析命令行参数"""
    args = {
        'verbose': False,
        'output': None,
        'input_files': [],
        'help': False
    }
    
    i = 1
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg == '-v' or arg == '--verbose':
            args['verbose'] = True
        elif arg == '-o' or arg == '--output':
            if i + 1 < len(sys.argv):
                args['output'] = sys.argv[i + 1]
                i += 1
            else:
                print("错误: -o/--output 需要指定输出文件")
                sys.exit(1)
        elif arg == '-h' or arg == '--help':
            args['help'] = True
        elif arg.startswith('-'):
            print(f"警告: 未知选项 {arg}")
        else:
            args['input_files'].append(arg)
        i += 1
    
    return args

# 使用解析函数
options = parse_args()
print(f"\n解析结果:")
print(f"  verbose: {options['verbose']}")
print(f"  output: {options['output']}")
print(f"  input_files: {options['input_files']}")
print(f"  help: {options['help']}")

# 显示帮助信息示例
if options['help']:
    print("""
使用方法: python script.py [选项] [文件...]

选项:
  -v, --verbose     详细输出
  -o, --output FILE 指定输出文件
  -h, --help        显示帮助信息

示例:
  python script.py -v -o output.txt input1.txt input2.txt
    """)
```

### 2.3 标准输入输出

`sys.stdin`、`sys.stdout`和`sys.stderr`分别代表标准输入、标准输出和标准错误流。这些对象可以用于与用户交互或重定向输入输出。

```python
# 示例：标准输入输出操作
import sys

print("=" * 60)
print("标准输入输出操作")
print("=" * 60)

# 标准输出
print("这是通过sys.stdout的普通输出")
sys.stdout.write("这是通过sys.stdout.write()的输出\n")
sys.stdout.write("不会自动添加换行符，需要手动添加\\n")

# 标准错误输出
sys.stderr.write("这是通过sys.stderr输出的错误信息\n")

# 读取输入（在非交互式环境中可能无法正常工作）
# 下面演示如何读取管道输入
print("\n检查是否有管道输入:")

# 在Windows上，检查stdin是否有数据
# 注意：在非交互式环境（如IDE）中，stdin可能不可用
try:
    if not sys.stdin.isatty():
        # 如果有管道输入
        data = sys.stdin.read()
        if data:
            print(f"从管道读取到数据 ({len(data)} 字符):")
            print(data[:200])
        else:
            print("没有管道输入数据")
    else:
        print("stdin是一个交互式终端")
except Exception as e:
    print(f"无法读取stdin: {e}")

# 重定向输出
import io

# 捕获输出到字符串
old_stdout = sys.stdout
captured_output = io.StringIO()
sys.stdout = captured_output

print("这段输出被捕获了")
print("这段输出也被捕获了")

# 恢复stdout
sys.stdout = old_stdout

# 查看捕获的内容
captured_content = captured_output.getvalue()
print(f"\n捕获到的输出内容:")
print(captured_content)
```

### 2.4 程序退出与异常处理

`sys.exit()`函数用于退出Python程序。你可以传递一个整数退出码（0表示成功，非0表示错误）或一个字符串消息。

```python
# 示例：程序退出与异常处理
import sys

print("=" * 60)
print("程序退出与异常处理")
print("=" * 60)

def process_data(filename):
    """模拟数据处理函数"""
    if not filename:
        print("错误: 必须指定文件名")
        sys.exit(1)  # 非零退出码表示错误
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = f.read()
        print(f"成功读取文件: {filename}")
        return data
    except FileNotFoundError:
        print(f"错误: 文件 '{filename}' 不存在")
        sys.exit(1)
    except PermissionError:
        print(f"错误: 没有权限读取文件 '{filename}'")
        sys.exit(1)
    except Exception as e:
        print(f"错误: {e}")
        sys.exit(1)

# 在正常流程中，我们不会实际调用process_data
print("sys.exit()示例:")
print("  退出码0: 正常退出")
print("  退出码1: 一般错误")
print("  退出码2: 命令行参数错误")
print("  sys.exit('错误消息'): 打印消息并以退出码1退出")

# 获取系统信息
print(f"\n系统信息:")
print(f"  字节序: {sys.byteorder}")
print(f"  最大整数: {sys.maxsize}")
print(f"  整数最大位数: {sys.int_info}")
print(f"  Unicode编码: {sys.getdefaultencoding()}")
print(f"  文件系统编码: {sys.getfilesystemencoding()}")
```

## 三、datetime模块：日期时间处理

### 3.1 datetime模块概述

`datetime`模块是Python中处理日期和时间的标准库。它提供了多个类来表示日期、时间、时间间隔等概念，并支持日期时间的计算、格式化和解析。`datetime`模块是处理时间相关任务的必备工具。

`datetime`模块中的主要类包括：

- `datetime.date`：表示日期（年、月、日）
- `datetime.time`：表示时间（时、分、秒、微秒）
- `datetime.datetime`：表示日期和时间的组合
- `datetime.timedelta`：表示两个日期或时间之间的差值
- `datetime.timezone`：表示时区信息

```python
# 示例：datetime模块的基本使用
from datetime import date, time, datetime, timedelta
import datetime as dt

print("=" * 60)
print("datetime模块基本使用")
print("=" * 60)

# date类 - 日期
today = date.today()
print(f"今天日期: {today}")
print(f"  年: {today.year}")
print(f"  月: {today.month}")
print(f"  日: {today.day}")
print(f"  星期几(0=周一): {today.weekday()}")
print(f"  星期几(1=周日): {today.isoweekday()}")

# 创建特定日期
specific_date = date(2026, 1, 1)
print(f"\n特定日期: {specific_date}")
print(f"  是星期几: {specific_date.strftime('%A')}")

# time类 - 时间
current_time = time(14, 30, 45, 500000)
print(f"\n时间: {current_time}")
print(f"  时: {current_time.hour}")
print(f"  分: {current_time.minute}")
print(f"  秒: {current_time.second}")
print(f"  微秒: {current_time.microsecond}")

# datetime类 - 日期时间
now = datetime.now()
print(f"\n当前日期时间: {now}")
print(f"  日期部分: {now.date()}")
print(f"  时间部分: {now.time()}")
print(f"  时间戳: {now.timestamp()}")
```

### 3.2 timedelta时间计算

`timedelta`对象表示两个日期或时间之间的差值，可以用于日期时间的加减运算。这是`datetime`模块中最强大的功能之一。

```python
# 示例：timedelta时间计算
from datetime import datetime, timedelta, date

print("=" * 60)
print("timedelta时间计算")
print("=" * 60)

# 创建timedelta对象
one_day = timedelta(days=1)
one_week = timedelta(weeks=1)
three_hours = timedelta(hours=3)
thirty_minutes = timedelta(minutes=30)
combined = timedelta(days=2, hours=5, minutes=30, seconds=15)

print(f"一天: {one_day}")
print(f"一周: {one_week}")
print(f"三小时: {three_hours}")
print(f"三十分钟: {thirty_minutes}")
print(f"组合: {combined}")

# 日期计算
today = date.today()
print(f"\n今天: {today}")
print(f"明天: {today + one_day}")
print(f"昨天: {today - one_day}")
print(f"一周后: {today + one_week}")
print(f"一周前: {today - one_week}")

# 日期时间计算
now = datetime.now()
print(f"\n当前时间: {now}")
print(f"3小时后: {now + three_hours}")
print(f"30分钟后: {now + thirty_minutes}")
print(f"2天5小时30分钟后: {now + combined}")

# 计算两个日期之间的差值
birthday = date(2000, 1, 1)
today = date.today()
age_delta = today - birthday
print(f"\n从 {birthday} 到 {today}:")
print(f"  总共 {age_delta.days} 天")
print(f"  约 {age_delta.days / 365.25:.1f} 年")

# 计算项目截止日期
start_date = date.today()
duration = timedelta(days=30)
deadline = start_date + duration
print(f"\n项目开始日期: {start_date}")
print(f"项目周期: {duration.days} 天")
print(f"截止日期: {deadline}")

# 计算剩余时间
remaining = deadline - start_date
print(f"剩余天数: {remaining.days} 天")

# timedelta的属性
delta = timedelta(days=5, hours=12, minutes=30, seconds=45)
print(f"\ntimedelta属性:")
print(f"  days: {delta.days}")
print(f"  seconds: {delta.seconds}")
print(f"  microseconds: {delta.microseconds}")
print(f"  total_seconds: {delta.total_seconds()}")
```

### 3.3 日期时间格式化

`strftime()`和`strptime()`是`datetime`模块中两个非常重要的方法，分别用于将日期时间对象格式化为字符串，以及将字符串解析为日期时间对象。

```python
# 示例：日期时间格式化
from datetime import datetime

print("=" * 60)
print("日期时间格式化")
print("=" * 60)

now = datetime.now()

# strftime - 格式化日期时间为字符串
print("strftime格式化示例:")
formats = {
    '%Y-%m-%d': f"标准日期格式",
    '%Y年%m月%d日': f"中文日期格式",
    '%H:%M:%S': f"24小时时间格式",
    '%I:%M:%S %p': f"12小时时间格式",
    '%A, %B %d, %Y': f"完整英文日期",
    '%Y-%m-%d %H:%M:%S': f"完整日期时间",
    '%Y%m%d_%H%M%S': f"文件名友好格式",
    '%c': f"本地日期时间表示",
    '%x': f"本地日期表示",
    '%X': f"本地时间表示",
}

for fmt, desc in formats.items():
    try:
        result = now.strftime(fmt)
        print(f"  {fmt:20s} -> {result:30s} ({desc})")
    except Exception as e:
        print(f"  {fmt:20s} -> 错误: {e}")

# strptime - 解析字符串为日期时间
print("\nstrptime解析示例:")
date_strings = [
    ("2026-07-26", "%Y-%m-%d"),
    ("2026年07月26日", "%Y年%m月%d日"),
    ("07/26/2026", "%m/%d/%Y"),
    ("2026-07-26 14:30:00", "%Y-%m-%d %H:%M:%S"),
    ("26-Jul-2026", "%d-%b-%Y"),
]

for date_str, fmt in date_strings:
    try:
        parsed = datetime.strptime(date_str, fmt)
        print(f"  '{date_str}' ({fmt}) -> {parsed}")
    except ValueError as e:
        print(f"  '{date_str}' ({fmt}) -> 解析失败: {e}")

# 格式化指令参考
print("\n常用格式化指令:")
directives = [
    ("%Y", "四位年份", "2026"),
    ("%y", "两位年份", "26"),
    ("%m", "两位月份", "07"),
    ("%d", "两位日期", "26"),
    ("%H", "24小时制小时", "14"),
    ("%I", "12小时制小时", "02"),
    ("%M", "分钟", "30"),
    ("%S", "秒", "00"),
    ("%p", "AM/PM", "PM"),
    ("%A", "星期全名", "Sunday"),
    ("%a", "星期缩写", "Sun"),
    ("%B", "月份全名", "July"),
    ("%b", "月份缩写", "Jul"),
    ("%w", "星期数字(0=周日)", "0"),
    ("%j", "一年中的第几天", "207"),
]

for directive, desc, example in directives:
    print(f"  {directive:5s}  {desc:20s}  示例: {example}")
```

### 3.4 实用日期时间工具函数

```python
# 示例：实用日期时间工具函数
from datetime import datetime, date, timedelta
import calendar

print("=" * 60)
print("实用日期时间工具函数")
print("=" * 60)

def get_week_range(date_obj=None):
    """获取指定日期所在周的起止日期（周一到周日）"""
    if date_obj is None:
        date_obj = date.today()
    monday = date_obj - timedelta(days=date_obj.weekday())
    sunday = monday + timedelta(days=6)
    return monday, sunday

def get_month_range(year, month):
    """获取指定月份的第一天和最后一天"""
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])
    return first_day, last_day

def is_weekend(date_obj=None):
    """判断是否是周末"""
    if date_obj is None:
        date_obj = date.today()
    return date_obj.weekday() >= 5

def get_age(birth_date):
    """计算年龄"""
    today = date.today()
    age = today.year - birth_date.year
    if today.month < birth_date.month or \
       (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    return age

def get_days_until(target_date):
    """计算距离目标日期还有多少天"""
    today = date.today()
    delta = target_date - today
    return delta.days

def is_leap_year(year):
    """判断是否是闰年"""
    return calendar.isleap(year)

# 测试工具函数
today = date.today()
print(f"今天: {today}")

# 获取本周范围
monday, sunday = get_week_range()
print(f"\n本周: {monday} (周一) 到 {sunday} (周日)")

# 获取本月范围
month_start, month_end = get_month_range(today.year, today.month)
print(f"本月: {month_start} 到 {month_end}")

# 判断周末
print(f"今天是周末吗? {is_weekend()}")

# 计算年龄
birth = date(1995, 6, 15)
print(f"出生日期 {birth}，年龄: {get_age(birth)} 岁")

# 距离目标日期天数
target = date(2026, 12, 31)
print(f"距离 {target} 还有 {get_days_until(target)} 天")

# 判断闰年
for year in [2024, 2025, 2026, 2028]:
    print(f"{year}年是闰年吗? {is_leap_year(year)}")

# 生成日历
print(f"\n{today.year}年{today.month}月日历:")
print(calendar.month(today.year, today.month))
```

## 四、random模块：随机数生成

### 4.1 random模块概述

`random`模块是Python中用于生成随机数的标准库。它提供了多种随机数生成函数，可以生成随机整数、随机浮点数、随机选择等。`random`模块在游戏开发、数据模拟、统计分析、密码学等领域都有广泛应用。

需要注意的是，`random`模块生成的随机数是"伪随机数"，它们由确定性的算法生成，但序列看起来是随机的。如果你需要真正的随机数（用于密码学等安全场景），应该使用`secrets`模块。

```python
# 示例：random模块的基本使用
import random

print("=" * 60)
print("random模块基本使用")
print("=" * 60)

# 设置随机种子，使结果可复现
random.seed(42)
print("已设置随机种子为42（结果可复现）")

# 随机浮点数
print(f"\n随机浮点数:")
print(f"  random.random(): {random.random()}")  # [0.0, 1.0)
print(f"  random.uniform(1, 10): {random.uniform(1, 10)}")  # [1.0, 10.0]
print(f"  random.uniform(10, 20): {random.uniform(10, 20)}")

# 随机整数
print(f"\n随机整数:")
print(f"  random.randint(1, 100): {random.randint(1, 100)}")  # [1, 100]
print(f"  random.randrange(0, 100, 5): {random.randrange(0, 100, 5)}")  # 步长为5
print(f"  random.randrange(10): {random.randrange(10)}")  # [0, 10)

# 随机选择
fruits = ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓']
print(f"\n随机选择:")
print(f"  水果列表: {fruits}")
print(f"  random.choice(fruits): {random.choice(fruits)}")
print(f"  random.choice(fruits): {random.choice(fruits)}")

# 随机抽样
print(f"\n随机抽样:")
print(f"  random.sample(fruits, 3): {random.sample(fruits, 3)}")
print(f"  random.sample(fruits, 2): {random.sample(fruits, 2)}")

# 随机打乱
cards = list(range(1, 14))
print(f"\n随机打乱:")
print(f"  原始列表: {cards}")
random.shuffle(cards)
print(f"  打乱后: {cards}")
```

### 4.2 随机数的各种分布

`random`模块还提供了多种概率分布的随机数生成函数，这在统计模拟和科学计算中非常有用。

```python
# 示例：随机数分布
import random
import math

random.seed(12345)

print("=" * 60)
print("随机数分布")
print("=" * 60)

# 正态分布（高斯分布）
print("正态分布 (mu=0, sigma=1):")
samples = [random.gauss(0, 1) for _ in range(10)]
for i, s in enumerate(samples, 1):
    print(f"  样本{i}: {s:.4f}")

# 指定均值和标准差的正态分布
print("\n正态分布 (mu=100, sigma=15) - 模拟IQ分数:")
iq_samples = [random.gauss(100, 15) for _ in range(10)]
for i, s in enumerate(iq_samples, 1):
    print(f"  IQ样本{i}: {s:.1f}")

# 三角分布
print("\n三角分布 (low=0, high=10, mode=5):")
for _ in range(5):
    print(f"  {random.triangular(0, 10, 5):.4f}")

# Beta分布
print("\nBeta分布 (alpha=2, beta=5):")
for _ in range(5):
    print(f"  {random.betavariate(2, 5):.4f}")

# 指数分布
print("\n指数分布 (lambda=1.0):")
for _ in range(5):
    print(f"  {random.expovariate(1.0):.4f}")

# Gamma分布
print("\nGamma分布 (alpha=3, beta=2):")
for _ in range(5):
    print(f"  {random.gammavariate(3, 2):.4f}")
```

### 4.3 随机数应用实战

```python
# 示例：随机数应用实战
import random
import string

random.seed(2026)

print("=" * 60)
print("随机数应用实战")
print("=" * 60)

# 1. 生成随机密码
def generate_password(length=12, include_special=True):
    """生成随机密码"""
    chars = string.ascii_letters + string.digits
    if include_special:
        chars += string.punctuation
    
    # 确保密码包含至少一个大写字母、一个小写字母、一个数字
    password = [
        random.choice(string.ascii_uppercase),
        random.choice(string.ascii_lowercase),
        random.choice(string.digits),
    ]
    
    if include_special:
        password.append(random.choice(string.punctuation))
    
    # 填充剩余长度
    remaining = length - len(password)
    password.extend(random.choice(chars) for _ in range(remaining))
    
    # 打乱密码字符顺序
    random.shuffle(password)
    
    return ''.join(password)

print("随机密码生成器:")
for i in range(5):
    print(f"  密码{i+1}: {generate_password(16)}")

# 2. 模拟掷骰子
def roll_dice(n=1, sides=6):
    """模拟掷骰子"""
    results = [random.randint(1, sides) for _ in range(n)]
    return results, sum(results)

print("\n掷骰子模拟:")
results, total = roll_dice(3, 6)
print(f"  掷3个6面骰子: {results}, 总和 = {total}")

results, total = roll_dice(2, 20)
print(f"  掷2个20面骰子: {results}, 总和 = {total}")

# 3. 随机抽奖系统
print("\n随机抽奖系统:")
participants = [
    "张三", "李四", "王五", "赵六", "孙七",
    "周八", "吴九", "郑十", "钱十一", "陈十二"
]

# 抽取一等奖（1名）
first_prize = random.sample(participants, 1)
remaining = [p for p in participants if p not in first_prize]

# 抽取二等奖（2名）
second_prize = random.sample(remaining, 2)
remaining = [p for p in remaining if p not in second_prize]

# 抽取三等奖（3名）
third_prize = random.sample(remaining, 3)

print(f"  参与人数: {len(participants)}")
print(f"  一等奖: {first_prize[0]}")
print(f"  二等奖: {', '.join(second_prize)}")
print(f"  三等奖: {', '.join(third_prize)}")

# 4. 蒙特卡洛模拟 - 估算圆周率
def estimate_pi(num_points=1000000):
    """使用蒙特卡洛方法估算圆周率"""
    inside_circle = 0
    
    for _ in range(num_points):
        x = random.random()
        y = random.random()
        if x**2 + y**2 <= 1:
            inside_circle += 1
    
    return 4 * inside_circle / num_points

print("\n蒙特卡洛方法估算圆周率:")
print(f"  使用1000000个点估算...")
pi_estimate = estimate_pi(100000)
print(f"  估算值: {pi_estimate:.6f}")
print(f"  实际值: {math.pi:.6f}")
print(f"  误差: {abs(pi_estimate - math.pi):.6f}")

# 5. 随机数据生成器
def generate_random_data(num_records=5):
    """生成随机数据记录"""
    names = ["张三", "李四", "王五", "赵六", "孙七", "周八", "吴九", "郑十"]
    cities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京"]
    departments = ["技术部", "市场部", "销售部", "人事部", "财务部"]
    
    records = []
    for _ in range(num_records):
        record = {
            '姓名': random.choice(names),
            '年龄': random.randint(22, 55),
            '城市': random.choice(cities),
            '部门': random.choice(departments),
            '薪资': random.randint(8000, 50000),
            '入职年限': round(random.uniform(0.5, 15), 1)
        }
        records.append(record)
    
    return records

print("\n随机员工数据:")
for i, record in enumerate(generate_random_data(5), 1):
    print(f"  员工{i}: {record}")
```

## 五、math模块：数学函数

### 5.1 math模块概述

`math`模块提供了标准的数学函数和常量。它包含了三角函数、对数函数、指数函数、幂函数等基本的数学运算。对于更高级的数学运算（如线性代数、傅里叶变换等），可以使用`numpy`等第三方库。

```python
# 示例：math模块的基本使用
import math

print("=" * 60)
print("math模块基本使用")
print("=" * 60)

# 数学常量
print("数学常量:")
print(f"  π (pi): {math.pi}")
print(f"  e: {math.e}")
print(f"  τ (tau): {math.tau}")  # 2π
print(f"  无穷大: {math.inf}")
print(f"  非数字: {math.nan}")

# 基本运算
print(f"\n基本运算:")
print(f"  math.ceil(4.2): {math.ceil(4.2)}")      # 向上取整
print(f"  math.floor(4.8): {math.floor(4.8)}")    # 向下取整
print(f"  math.trunc(4.8): {math.trunc(4.8)}")    # 截断小数部分
print(f"  math.fabs(-3.14): {math.fabs(-3.14)}")  # 绝对值
print(f"  math.fmod(10, 3): {math.fmod(10, 3)}")  # 取模（浮点数）
print(f"  math.factorial(5): {math.factorial(5)}") # 阶乘
print(f"  math.gcd(48, 18): {math.gcd(48, 18)}")  # 最大公约数
print(f"  math.lcm(12, 18): {math.lcm(12, 18)}")  # 最小公倍数

# 幂和对数
print(f"\n幂和对数函数:")
print(f"  math.sqrt(16): {math.sqrt(16)}")          # 平方根
print(f"  math.pow(2, 10): {math.pow(2, 10)}")      # 幂运算
print(f"  math.exp(1): {math.exp(1)}")              # e的x次方
print(f"  math.log(math.e): {math.log(math.e)}")    # 自然对数
print(f"  math.log2(8): {math.log2(8)}")            # 以2为底的对数
print(f"  math.log10(1000): {math.log10(1000)}")    # 以10为底的对数
```

### 5.2 三角函数

```python
# 示例：三角函数
import math

print("=" * 60)
print("三角函数")
print("=" * 60)

# 角度转换
angle_deg = 45
angle_rad = math.radians(angle_deg)
print(f"角度转弧度: {angle_deg}° = {angle_rad:.4f} 弧度")
print(f"弧度转角度: {angle_rad:.4f} 弧度 = {math.degrees(angle_rad)}°")

# 基本三角函数
print(f"\n基本三角函数 (角度={angle_deg}°):")
print(f"  sin(45°) = {math.sin(angle_rad):.4f}")
print(f"  cos(45°) = {math.cos(angle_rad):.4f}")
print(f"  tan(45°) = {math.tan(angle_rad):.4f}")

# 反三角函数
print(f"\n反三角函数:")
print(f"  arcsin(0.5) = {math.degrees(math.asin(0.5)):.2f}°")
print(f"  arccos(0.5) = {math.degrees(math.acos(0.5)):.2f}°")
print(f"  arctan(1) = {math.degrees(math.atan(1)):.2f}°")

# 双曲函数
print(f"\n双曲函数:")
print(f"  sinh(1) = {math.sinh(1):.4f}")
print(f"  cosh(1) = {math.cosh(1):.4f}")
print(f"  tanh(1) = {math.tanh(1):.4f}")

# 计算三角形面积
def triangle_area_heron(a, b, c):
    """使用海伦公式计算三角形面积"""
    s = (a + b + c) / 2
    area = math.sqrt(s * (s - a) * (s - b) * (s - c))
    return area

def triangle_area_sas(a, b, angle_deg):
    """使用两边和夹角计算三角形面积"""
    angle_rad = math.radians(angle_deg)
    return 0.5 * a * b * math.sin(angle_rad)

print(f"\n三角形面积计算:")
print(f"  海伦公式 (3, 4, 5): {triangle_area_heron(3, 4, 5):.2f}")
print(f"  两边夹角 (5, 6, 60°): {triangle_area_sas(5, 6, 60):.2f}")
```

### 5.3 数学函数应用

```python
# 示例：数学函数应用
import math

print("=" * 60)
print("数学函数应用")
print("=" * 60)

# 1. 计算圆的面积和周长
def circle_calculations(radius):
    """计算圆的面积和周长"""
    area = math.pi * radius ** 2
    circumference = 2 * math.pi * radius
    return area, circumference

r = 5
area, circum = circle_calculations(r)
print(f"圆 (半径={r}):")
print(f"  面积 = {area:.2f}")
print(f"  周长 = {circum:.2f}")

# 2. 计算球的体积和表面积
def sphere_calculations(radius):
    """计算球的体积和表面积"""
    volume = (4/3) * math.pi * radius ** 3
    surface_area = 4 * math.pi * radius ** 2
    return volume, surface_area

vol, sa = sphere_calculations(r)
print(f"球 (半径={r}):")
print(f"  体积 = {vol:.2f}")
print(f"  表面积 = {sa:.2f}")

# 3. 计算复利
def compound_interest(principal, rate, years, compounds_per_year=12):
    """计算复利"""
    amount = principal * (1 + rate / compounds_per_year) ** (compounds_per_year * years)
    return amount

principal = 10000
rate = 0.05
years = 10
amount = compound_interest(principal, rate, years)
print(f"\n复利计算:")
print(f"  本金: {principal} 元")
print(f"  年利率: {rate*100}%")
print(f"  投资年限: {years} 年")
print(f"  最终金额: {amount:.2f} 元")
print(f"  利息收益: {amount - principal:.2f} 元")

# 4. 计算两点之间的距离
def distance_2d(x1, y1, x2, y2):
    """计算二维平面上两点之间的距离"""
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

def distance_3d(x1, y1, z1, x2, y2, z2):
    """计算三维空间中两点之间的距离"""
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)

print(f"\n距离计算:")
print(f"  二维距离 (0,0)到(3,4): {distance_2d(0, 0, 3, 4):.2f}")
print(f"  三维距离 (0,0,0)到(1,2,2): {distance_3d(0, 0, 0, 1, 2, 2):.2f}")

# 5. 判断素数
def is_prime(n):
    """判断一个数是否为素数"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # 只需要检查到sqrt(n)
    sqrt_n = int(math.isqrt(n))
    for i in range(3, sqrt_n + 1, 2):
        if n % i == 0:
            return False
    return True

print(f"\n素数判断:")
for num in [2, 3, 4, 17, 25, 97, 100]:
    print(f"  {num} 是素数? {is_prime(num)}")

# 6. 数值计算
print(f"\n数值计算:")
print(f"  math.comb(5, 2): {math.comb(5, 2)}")   # 组合数 C(5,2)
print(f"  math.perm(5, 2): {math.perm(5, 2)}")   # 排列数 P(5,2)
print(f"  math.prod([1,2,3,4,5]): {math.prod([1,2,3,4,5])}")  # 乘积
print(f"  math.fsum([0.1]*10): {math.fsum([0.1]*10)}")  # 精确浮点求和
```

## 六、json模块：JSON序列化

### 6.1 json模块概述

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，广泛用于Web API、配置文件、数据存储等场景。`json`模块是Python中处理JSON数据的标准库，提供了将Python对象序列化为JSON字符串，以及将JSON字符串反序列化为Python对象的功能。

JSON与Python数据类型的对应关系：

| JSON类型 | Python类型 |
|----------|------------|
| object | dict |
| array | list |
| string | str |
| number (int) | int |
| number (real) | float |
| true | True |
| false | False |
| null | None |

```python
# 示例：json模块的基本使用
import json

print("=" * 60)
print("json模块基本使用")
print("=" * 60)

# Python对象转JSON字符串（序列化）
data = {
    "name": "张三",
    "age": 25,
    "city": "北京",
    "hobbies": ["编程", "读书", "游泳"],
    "married": False,
    "children": None,
    "scores": {
        "语文": 90,
        "数学": 95,
        "英语": 88
    }
}

# 基本序列化
json_str = json.dumps(data, ensure_ascii=False)
print("json.dumps（序列化）:")
print(json_str)

# 美化输出
json_pretty = json.dumps(data, ensure_ascii=False, indent=2)
print("\njson.dumps（美化输出）:")
print(json_pretty)

# JSON字符串转Python对象（反序列化）
json_string = '{"name": "李四", "age": 30, "city": "上海"}'
parsed = json.loads(json_string)
print(f"\njson.loads（反序列化）:")
print(f"  类型: {type(parsed)}")
print(f"  内容: {parsed}")
print(f"  name: {parsed['name']}")
print(f"  age: {parsed['age']}")
```

### 6.2 JSON文件读写

```python
# 示例：JSON文件读写
import json
import os
import tempfile

print("=" * 60)
print("JSON文件读写")
print("=" * 60)

# 准备数据
students = [
    {
        "id": "001",
        "name": "张三",
        "age": 18,
        "courses": [
            {"name": "Python编程", "score": 95},
            {"name": "数据结构", "score": 88},
            {"name": "算法设计", "score": 92}
        ]
    },
    {
        "id": "002",
        "name": "李四",
        "age": 19,
        "courses": [
            {"name": "Python编程", "score": 85},
            {"name": "数据结构", "score": 90},
            {"name": "算法设计", "score": 87}
        ]
    },
    {
        "id": "003",
        "name": "王五",
        "age": 18,
        "courses": [
            {"name": "Python编程", "score": 78},
            {"name": "数据结构", "score": 82},
            {"name": "算法设计", "score": 80}
        ]
    }
]

# 创建临时文件
tmp_dir = tempfile.mkdtemp()
json_file = os.path.join(tmp_dir, "students.json")

# 写入JSON文件
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(students, f, ensure_ascii=False, indent=2)
print(f"数据已写入文件: {json_file}")

# 读取JSON文件
with open(json_file, 'r', encoding='utf-8') as f:
    loaded_data = json.load(f)
print(f"\n从文件读取的数据:")
print(f"  学生数量: {len(loaded_data)}")
for student in loaded_data:
    print(f"  {student['name']} (ID: {student['id']})")
    total = sum(c['score'] for c in student['courses'])
    avg = total / len(student['courses'])
    print(f"    平均分: {avg:.1f}")

# 清理
os.remove(json_file)
os.rmdir(tmp_dir)
```

### 6.3 自定义JSON序列化

```python
# 示例：自定义JSON序列化
import json
from datetime import datetime, date
from decimal import Decimal

print("=" * 60)
print("自定义JSON序列化")
print("=" * 60)

# 问题：有些Python对象不能直接序列化为JSON
class Person:
    def __init__(self, name, age, birthday):
        self.name = name
        self.age = age
        self.birthday = birthday
    
    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age})"

# 创建自定义编码器
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, Person):
            return {
                'name': obj.name,
                'age': obj.age,
                'birthday': obj.birthday
            }
        elif isinstance(obj, set):
            return list(obj)
        return super().default(obj)

# 测试自定义编码器
data = {
    'name': '测试',
    'timestamp': datetime.now(),
    'today': date.today(),
    'price': Decimal('19.99'),
    'person': Person('张三', 25, date(1999, 5, 15)),
    'tags': {'python', 'json', 'programming'}
}

# 使用自定义编码器
json_str = json.dumps(data, cls=CustomJSONEncoder, ensure_ascii=False, indent=2)
print("自定义序列化结果:")
print(json_str)

# 使用default参数
def custom_default(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, date):
        return obj.isoformat()
    if isinstance(obj, set):
        return list(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

json_str2 = json.dumps(data, default=custom_default, ensure_ascii=False, indent=2)
print("\n使用default参数:")
print(json_str2)

# 处理复杂嵌套结构
complex_data = {
    'users': [
        {'name': '张三', 'roles': {'admin', 'user'}},
        {'name': '李四', 'roles': {'user'}},
    ],
    'metadata': {
        'created': datetime.now(),
        'version': Decimal('2.1')
    }
}

json_str3 = json.dumps(complex_data, cls=CustomJSONEncoder, ensure_ascii=False, indent=2)
print("\n复杂嵌套结构:")
print(json_str3)
```

## 七、re模块：正则表达式

### 7.1 re模块概述

正则表达式（Regular Expression）是一种强大的字符串匹配工具，用于模式匹配、搜索、替换等操作。`re`模块是Python中处理正则表达式的标准库。

正则表达式使用特殊的语法来描述字符串的模式。虽然正则表达式的语法初看起来有些复杂，但一旦掌握，它将极大地提高你处理文本的效率。

```python
# 示例：re模块的基本使用
import re

print("=" * 60)
print("re模块基本使用")
print("=" * 60)

text = "我的电话号码是138-1234-5678，备用号码是139-8765-4321。邮箱是zhangsan@example.com。"

# re.search - 搜索第一个匹配
print("1. re.search - 搜索第一个匹配:")
match = re.search(r'\d{3}-\d{4}-\d{4}', text)
if match:
    print(f"  找到的电话号码: {match.group()}")
    print(f"  匹配位置: {match.start()} - {match.end()}")

# re.findall - 查找所有匹配
print("\n2. re.findall - 查找所有匹配:")
phones = re.findall(r'\d{3}-\d{4}-\d{4}', text)
print(f"  找到的所有号码: {phones}")

# re.match - 从字符串开头匹配
print("\n3. re.match - 从开头匹配:")
result = re.match(r'我的', text)
if result:
    print(f"  开头匹配成功: {result.group()}")

# re.sub - 替换
print("\n4. re.sub - 替换:")
masked = re.sub(r'\d{3}-\d{4}-\d{4}', '***-****-****', text)
print(f"  脱敏后: {masked}")

# re.split - 分割
print("\n5. re.split - 分割:")
parts = re.split(r'[，。]', text)
print(f"  分割结果: {parts}")
```

### 7.2 正则表达式语法详解

```python
# 示例：正则表达式语法详解
import re

print("=" * 60)
print("正则表达式语法详解")
print("=" * 60)

# 1. 字符类
print("1. 字符类:")
test_str = "Hello 123 World! 456 Python"

# \d - 数字
print(f"  \\d (数字): {re.findall(r'\\d+', test_str)}")

# \w - 单词字符（字母、数字、下划线）
print(f"  \\w (单词字符): {re.findall(r'\\w+', test_str)}")

# \s - 空白字符
print(f"  \\s (空白字符): {re.findall(r'\\s', test_str)}")

# 自定义字符类
print(f"  [aeiou] (元音字母): {re.findall(r'[aeiou]+', test_str.lower())}")

# 2. 量词
print("\n2. 量词:")
test_str2 = "ab abc abbc abbbc abbbbc"

# * - 零次或多次
print(f"  ab*c: {re.findall(r'ab*c', test_str2)}")

# + - 一次或多次
print(f"  ab+c: {re.findall(r'ab+c', test_str2)}")

# ? - 零次或一次
print(f"  ab?c: {re.findall(r'ab?c', test_str2)}")

# {n} - 恰好n次
print(f"  ab{{2}}c: {re.findall(r'ab{2}c', test_str2)}")

# {n,} - 至少n次
print(f"  ab{{2,}}c: {re.findall(r'ab{2,}c', test_str2)}")

# {n,m} - n到m次
print(f"  ab{{1,3}}c: {re.findall(r'ab{1,3}c', test_str2)}")

# 3. 边界
print("\n3. 边界匹配:")
lines = ["Python is great", "I love Python", "Python is the best"]

# ^ - 开头
print(f"  以Python开头的行: {[l for l in lines if re.match(r'^Python', l)]}")

# $ - 结尾
print(f"  以Python结尾的行: {[l for l in lines if re.search(r'Python$', l)]}")

# \b - 单词边界
text = "cat category catalog scatter"
print(f"  单词'cat': {re.findall(r'\\bcat\\b', text)}")

# 4. 分组
print("\n4. 分组:")
phone = "电话: 138-1234-5678"
match = re.search(r'(\d{3})-(\d{4})-(\d{4})', phone)
if match:
    print(f"  完整匹配: {match.group(0)}")
    print(f"  区号: {match.group(1)}")
    print(f"  中间四位: {match.group(2)}")
    print(f"  末尾四位: {match.group(3)}")
    print(f"  所有分组: {match.groups()}")

# 命名分组
match = re.search(r'(?P<area>\d{3})-(?P<mid>\d{4})-(?P<last>\d{4})', phone)
if match:
    print(f"  命名分组 - 区号: {match.group('area')}")
    print(f"  命名分组字典: {match.groupdict()}")
```

### 7.3 正则表达式实战

```python
# 示例：正则表达式实战
import re

print("=" * 60)
print("正则表达式实战")
print("=" * 60)

# 1. 邮箱验证
def validate_email(email):
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

print("1. 邮箱验证:")
emails = [
    "user@example.com",
    "test.user@company.co.uk",
    "invalid-email",
    "no@domain",
    "user@.com",
    "@domain.com",
    "user name@domain.com"
]
for email in emails:
    print(f"  {email:30s} -> {'有效' if validate_email(email) else '无效'}")

# 2. URL提取
def extract_urls(text):
    """从文本中提取URL"""
    pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
    return re.findall(pattern, text)

print("\n2. URL提取:")
sample_text = """
访问我们的网站: https://www.example.com
参考文档: http://docs.python.org/3/library/re.html
GitHub: https://github.com/user/repo
"""
urls = extract_urls(sample_text)
for url in urls:
    print(f"  {url}")

# 3. 中文提取
def extract_chinese(text):
    """提取中文文本"""
    pattern = r'[\u4e00-\u9fff]+'
    return re.findall(pattern, text)

print("\n3. 中文提取:")
mixed_text = "Hello 世界! Python 编程 is 有趣. 你好 123 World!"
chinese = extract_chinese(mixed_text)
print(f"  原文: {mixed_text}")
print(f"  中文部分: {chinese}")

# 4. 数据清洗
def clean_text(text):
    """清洗文本数据"""
    # 移除HTML标签
    text = re.sub(r'<[^>]+>', '', text)
    # 移除多余空白
    text = re.sub(r'\s+', ' ', text)
    # 移除特殊字符（保留中文、英文、数字、空格和基本标点）
    text = re.sub(r'[^\u4e00-\u9fff\w\s，。！？、；：""''（）]', '', text)
    return text.strip()

print("\n4. 数据清洗:")
dirty_text = "<p>这是一段 <b>测试</b> 文本!!!</p>   包含多余   空白  和特殊字符@#$%"
cleaned = clean_text(dirty_text)
print(f"  原始文本: {dirty_text}")
print(f"  清洗后: {cleaned}")

# 5. 日志解析
def parse_log_line(line):
    """解析日志行"""
    pattern = r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+\[(\w+)\]\s+(.*)'
    match = re.match(pattern, line)
    if match:
        return {
            'timestamp': match.group(1),
            'level': match.group(2),
            'message': match.group(3)
        }
    return None

print("\n5. 日志解析:")
log_lines = [
    "2026-07-26 10:00:00 [INFO] 系统启动成功",
    "2026-07-26 10:01:00 [WARNING] 磁盘空间不足",
    "2026-07-26 10:02:00 [ERROR] 数据库连接失败",
    "2026-07-26 10:03:00 [INFO] 用户登录: zhangsan",
]

for line in log_lines:
    parsed = parse_log_line(line)
    if parsed:
        print(f"  时间: {parsed['timestamp']}, 级别: {parsed['level']}, 消息: {parsed['message']}")

# 6. 密码强度检查
def check_password_strength(password):
    """检查密码强度"""
    checks = {
        '长度 >= 8': len(password) >= 8,
        '包含大写字母': bool(re.search(r'[A-Z]', password)),
        '包含小写字母': bool(re.search(r'[a-z]', password)),
        '包含数字': bool(re.search(r'\d', password)),
        '包含特殊字符': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password)),
    }
    score = sum(checks.values())
    return score, checks

print("\n6. 密码强度检查:")
passwords = ["123456", "password", "Password123", "P@ssw0rd!", "MyP@ssw0rd!2026"]
for pwd in passwords:
    score, checks = check_password_strength(pwd)
    strength = "弱" if score < 3 else ("中" if score < 5 else "强")
    print(f"  密码: {pwd:20s} -> 强度: {strength} (分数: {score}/5)")

# 7. 编译正则表达式提高性能
print("\n7. 编译正则表达式:")
# 如果同一个正则表达式要多次使用，应该先编译
compiled_pattern = re.compile(r'\d{3}-\d{4}-\d{4}')

texts = [
    "电话: 138-1234-5678",
    "联系方式: 139-8765-4321",
    "没有电话号码的文本",
    "客服: 400-800-1234"
]

for t in texts:
    result = compiled_pattern.findall(t)
    print(f"  '{t}' -> {result}")
```

## 总结

本章我们深入学习了Python中最常用的七个标准库模块，涵盖了文件操作、系统交互、日期时间处理、随机数生成、数学运算、JSON序列化和正则表达式等核心功能。

**os模块**：提供了与操作系统交互的完整接口，包括文件和目录的创建、删除、遍历，以及路径操作等功能。`os.path`子模块专注于跨平台的路径处理，`os.walk()`是遍历目录树的利器。

**sys模块**：提供了与Python解释器交互的功能，包括命令行参数处理（`sys.argv`）、标准输入输出流（`sys.stdin/stdout/stderr`）、模块搜索路径管理等。`sys.exit()`用于控制程序退出。

**datetime模块**：提供了完整的日期时间处理功能。`date`、`time`、`datetime`类分别处理日期、时间和日期时间组合，`timedelta`用于时间计算，`strftime`和`strptime`用于格式化和解析。

**random模块**：提供了多种随机数生成函数，包括基本随机数、概率分布随机数、随机选择、随机打乱等。通过设置随机种子（`random.seed()`）可以确保结果可复现。

**math模块**：提供了标准的数学函数和常量，包括三角函数、对数函数、幂函数、数值计算函数等。`math.pi`、`math.e`等常量在科学计算中经常使用。

**json模块**：提供了JSON数据格式的序列化和反序列化功能。`json.dumps()`和`json.loads()`用于字符串与对象的转换，`json.dump()`和`json.load()`用于文件读写。通过自定义编码器可以处理特殊类型的序列化。

**re模块**：提供了强大的正则表达式功能，支持模式匹配、搜索、替换、分割等操作。掌握正则表达式语法（字符类、量词、边界、分组等）可以极大地提高文本处理效率。

这些标准库模块是Python编程的基础，掌握了它们，你就能够处理绝大多数日常编程任务。在实际开发中，你可能会同时使用多个模块来解决复杂问题，这也是模块化编程的核心优势所在。接下来的章节中，我们将学习Python的异常处理机制，这是编写健壮代码的关键技术。
---
title: Python核心生态与落地Ⅰ——NumPy基础
date: 2026-07-26
tags:
  - Python
  - NumPy
  - 科学计算
  - 数据分析
categories:
  - Python
---

## 一、NumPy简介与安装

### 1.1 什么是NumPy

NumPy（Numerical Python）是Python科学计算的核心库，提供了高性能的多维数组对象（ndarray）以及用于操作这些数组的工具。NumPy是Python数据科学生态系统的基础，几乎所有其他数据科学库（如Pandas、Matplotlib、Scikit-learn等）都构建在NumPy之上。

NumPy的核心优势包括：

**高性能计算**：NumPy的底层使用C语言和Fortran编写，数组操作比纯Python快几个数量级。对于大规模数值计算，NumPy是必不可少的工具。

**多维数组对象**：`ndarray`（N-dimensional array）是NumPy的核心数据结构，它是一个快速、灵活的大型数据容器，所有元素必须是相同类型。

**广播机制**：NumPy的广播（Broadcasting）功能允许对不同形状的数组进行算术运算，无需显式地复制数据，大大简化了代码并提高了效率。

**丰富的数学函数**：NumPy提供了大量的数学函数，包括线性代数、傅里叶变换、随机数生成等。

**内存效率**：NumPy数组在内存中连续存储，相比于Python列表，内存占用更少，访问速度更快。

```python
# 示例：NumPy与Python列表的性能对比
import numpy as np
import time

print("=" * 60)
print("NumPy vs Python列表性能对比")
print("=" * 60)

# 创建大数据集
size = 1000000

# Python列表计算
python_list = list(range(size))
start = time.time()
python_result = [x * 2 + 1 for x in python_list]
python_time = time.time() - start
print(f"Python列表计算时间: {python_time:.4f} 秒")

# NumPy数组计算
numpy_array = np.arange(size)
start = time.time()
numpy_result = numpy_array * 2 + 1
numpy_time = time.time() - start
print(f"NumPy数组计算时间: {numpy_time:.4f} 秒")

print(f"NumPy比Python快 {python_time / numpy_time:.1f} 倍")

# 内存对比
import sys
print(f"\n内存占用对比:")
print(f"Python列表: {sys.getsizeof(python_list) + sys.getsizeof(python_list[0]) * size / 10:.0f} 字节 (估算)")
print(f"NumPy数组: {numpy_array.nbytes} 字节")
```

### 1.2 安装NumPy

安装NumPy最简单的方式是使用pip：

```bash
pip install numpy
```

如果你使用Anaconda发行版，NumPy已经预装。你也可以使用conda安装：

```bash
conda install numpy
```

安装完成后，可以通过以下代码验证安装是否成功：

```python
# 验证NumPy安装
import numpy as np

print("NumPy安装验证:")
print(f"NumPy版本: {np.__version__}")
print(f"NumPy配置信息:")
print(f"  BLAS库: {np.show_config()}")

# 验证基本功能
arr = np.array([1, 2, 3, 4, 5])
print(f"测试数组: {arr}")
print(f"数组求和: {arr.sum()}")
print("NumPy安装成功，可以正常使用!")
```

## 二、ndarray创建与属性

### 2.1 创建ndarray的基本方法

`ndarray`是NumPy的核心数据结构，它是一个同构的多维数组。创建`ndarray`有多种方式，最常用的是`np.array()`函数。

```python
# 示例：创建ndarray的基本方法
import numpy as np

print("=" * 60)
print("创建ndarray的基本方法")
print("=" * 60)

# 1. 从Python列表创建
print("1. 从列表创建:")
arr1 = np.array([1, 2, 3, 4, 5])
print(f"  np.array([1, 2, 3, 4, 5]): {arr1}")
print(f"  数据类型: {arr1.dtype}")

# 2. 从嵌套列表创建二维数组
print("\n2. 从嵌套列表创建二维数组:")
arr2 = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(f"  np.array([[1,2,3],[4,5,6],[7,8,9]]):")
print(arr2)
print(f"  形状: {arr2.shape}")

# 3. 指定数据类型
print("\n3. 指定数据类型:")
arr3 = np.array([1, 2, 3], dtype=np.float64)
print(f"  dtype=np.float64: {arr3}")
print(f"  数据类型: {arr3.dtype}")

arr4 = np.array([1.5, 2.7, 3.1], dtype=np.int32)
print(f"  dtype=np.int32: {arr4} (小数被截断)")

# 4. 从元组创建
print("\n4. 从元组创建:")
arr5 = np.array((10, 20, 30))
print(f"  np.array((10, 20, 30)): {arr5}")

# 5. 创建复数数组
print("\n5. 创建复数数组:")
arr6 = np.array([1+2j, 3+4j, 5+6j])
print(f"  np.array([1+2j, 3+4j, 5+6j]): {arr6}")
print(f"  数据类型: {arr6.dtype}")
```

### 2.2 使用内置函数创建数组

NumPy提供了多种内置函数来创建特定类型的数组，这些函数在数据分析和科学计算中非常常用。

```python
# 示例：使用内置函数创建数组
import numpy as np

print("=" * 60)
print("使用内置函数创建数组")
print("=" * 60)

# 1. zeros - 创建全零数组
print("1. np.zeros:")
print(f"  np.zeros(5): {np.zeros(5)}")
print(f"  np.zeros((2, 3)):")
print(np.zeros((2, 3)))

# 2. ones - 创建全一数组
print("\n2. np.ones:")
print(f"  np.ones(5): {np.ones(5)}")
print(f"  np.ones((2, 3), dtype=int):")
print(np.ones((2, 3), dtype=int))

# 3. full - 创建指定值的数组
print("\n3. np.full:")
print(f"  np.full(5, 3.14): {np.full(5, 3.14)}")
print(f"  np.full((2, 3), 7):")
print(np.full((2, 3), 7))

# 4. arange - 创建等差数组
print("\n4. np.arange:")
print(f"  np.arange(10): {np.arange(10)}")
print(f"  np.arange(1, 10, 2): {np.arange(1, 10, 2)}")
print(f"  np.arange(0, 1, 0.2): {np.arange(0, 1, 0.2)}")

# 5. linspace - 创建等间距数组
print("\n5. np.linspace:")
print(f"  np.linspace(0, 1, 5): {np.linspace(0, 1, 5)}")
print(f"  np.linspace(0, 10, 6): {np.linspace(0, 10, 6)}")

# 6. eye - 创建单位矩阵
print("\n6. np.eye:")
print("  np.eye(3):")
print(np.eye(3))

# 7. diag - 创建对角矩阵
print("\n7. np.diag:")
print(f"  np.diag([1, 2, 3]):")
print(np.diag([1, 2, 3]))

# 8. random - 创建随机数组
print("\n8. np.random:")
np.random.seed(42)
print(f"  np.random.rand(5): {np.random.rand(5)}")
print(f"  np.random.randn(5): {np.random.randn(5)}")
print(f"  np.random.randint(0, 100, 10): {np.random.randint(0, 100, 10)}")
print(f"  np.random.random((2, 3)):")
print(np.random.random((2, 3)))
```

### 2.3 ndarray的属性

理解`ndarray`的属性对于正确使用NumPy至关重要。以下是`ndarray`最重要的属性。

```python
# 示例：ndarray的属性
import numpy as np

print("=" * 60)
print("ndarray的属性")
print("=" * 60)

# 创建示例数组
arr = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
])

print(f"数组:")
print(arr)
print()

# 基本属性
print("基本属性:")
print(f"  shape (形状): {arr.shape}")           # 每个维度的大小
print(f"  ndim (维度数): {arr.ndim}")            # 数组的维度数
print(f"  size (元素总数): {arr.size}")          # 所有元素的总数
print(f"  dtype (数据类型): {arr.dtype}")        # 元素的数据类型
print(f"  itemsize (元素字节数): {arr.itemsize}") # 每个元素的字节数
print(f"  nbytes (总字节数): {arr.nbytes}")      # 数组占用的总字节数

# 数据缓冲区
print(f"\n  data (数据缓冲区): {arr.data}")

# 不同类型数组的属性
print("\n不同类型数组属性对比:")
arrays = {
    'int8': np.ones((100, 100), dtype=np.int8),
    'int32': np.ones((100, 100), dtype=np.int32),
    'int64': np.ones((100, 100), dtype=np.int64),
    'float32': np.ones((100, 100), dtype=np.float32),
    'float64': np.ones((100, 100), dtype=np.float64),
}

for name, a in arrays.items():
    print(f"  {name:8s}: shape={a.shape}, itemsize={a.itemsize}, nbytes={a.nbytes}")
```

## 三、数组索引与切片

### 3.1 基本索引与切片

NumPy数组的索引和切片与Python列表类似，但功能更加强大。对于多维数组，可以使用逗号分隔的索引来访问各个维度。

```python
# 示例：基本索引与切片
import numpy as np

print("=" * 60)
print("基本索引与切片")
print("=" * 60)

# 一维数组
arr1 = np.arange(10)
print(f"一维数组: {arr1}")
print(f"  arr1[0]: {arr1[0]}")
print(f"  arr1[-1]: {arr1[-1]}")
print(f"  arr1[2:7]: {arr1[2:7]}")
print(f"  arr1[::2]: {arr1[::2]}")     # 每隔一个元素
print(f"  arr1[::-1]: {arr1[::-1]}")   # 反转

# 二维数组
arr2 = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
])
print(f"\n二维数组:")
print(arr2)
print(f"  arr2[0, 0]: {arr2[0, 0]}")       # 第一行第一列
print(f"  arr2[2, 3]: {arr2[2, 3]}")       # 第三行第四列
print(f"  arr2[-1, -1]: {arr2[-1, -1]}")   # 最后一行最后一列

# 行切片
print(f"\n行切片:")
print(f"  arr2[0]: {arr2[0]}")              # 第一行
print(f"  arr2[1:]:")                        # 从第二行开始
print(arr2[1:])

# 列切片
print(f"\n列切片:")
print(f"  arr2[:, 0]: {arr2[:, 0]}")        # 第一列
print(f"  arr2[:, 1:3]:")                    # 第二列到第三列
print(arr2[:, 1:3])

# 行列同时切片
print(f"\n行列同时切片:")
print(f"  arr2[0:2, 1:3]:")                 # 前两行，第二到三列
print(arr2[0:2, 1:3])

# 三维数组
arr3 = np.arange(24).reshape(2, 3, 4)
print(f"\n三维数组 shape={arr3.shape}:")
print(arr3)
print(f"  arr3[0, 1, 2]: {arr3[0, 1, 2]}")   # 第一个矩阵，第二行，第三列
print(f"  arr3[1, :, :]:")                    # 第二个矩阵的所有行和列
print(arr3[1, :, :])
```

### 3.2 高级索引

NumPy提供了多种高级索引方式，包括整数数组索引、布尔索引和花式索引，这些是数据分析中非常强大的工具。

```python
# 示例：高级索引
import numpy as np

print("=" * 60)
print("高级索引")
print("=" * 60)

# 1. 整数数组索引
print("1. 整数数组索引:")
arr = np.arange(10) * 10
print(f"  原始数组: {arr}")
indices = np.array([1, 3, 5, 7])
print(f"  索引: {indices}")
print(f"  arr[indices]: {arr[indices]}")

# 二维数组的整数数组索引
arr2 = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
print(f"\n  二维数组:")
print(arr2)
row_indices = np.array([0, 1, 2])
col_indices = np.array([0, 2, 1])
print(f"  arr2[row_indices, col_indices]: {arr2[row_indices, col_indices]}")

# 2. 布尔索引
print("\n2. 布尔索引:")
data = np.random.randint(0, 100, 20)
print(f"  原始数据: {data}")

# 创建布尔掩码
mask = data > 50
print(f"  大于50的掩码: {mask}")
print(f"  大于50的元素: {data[mask]}")

# 多条件布尔索引
print(f"  大于30且小于70的元素: {data[(data > 30) & (data < 70)]}")
print(f"  小于30或大于70的元素: {data[(data < 30) | (data > 70)]}")

# 布尔索引的应用
print(f"\n  奇数元素: {data[data % 2 == 1]}")
print(f"  偶数元素: {data[data % 2 == 0]}")

# 3. 花式索引
print("\n3. 花式索引:")
arr2d = np.arange(1, 13).reshape(3, 4)
print(f"  二维数组:")
print(arr2d)

# 使用数组作为索引
print(f"  arr2d[[0, 2]]:")  # 选择第0行和第2行
print(arr2d[[0, 2]])
print(f"  arr2d[:, [0, 2, 3]]:")  # 选择第0, 2, 3列
print(arr2d[:, [0, 2, 3]])

# 4. np.where条件索引
print("\n4. np.where条件索引:")
scores = np.array([85, 45, 92, 78, 60, 55, 88, 95, 72, 33])
print(f"  成绩: {scores}")

# 找出及格和不及格的索引
pass_indices = np.where(scores >= 60)
print(f"  及格索引: {pass_indices}")
print(f"  及格成绩: {scores[pass_indices]}")

# np.where的三元功能
grades = np.where(scores >= 90, 'A',
                  np.where(scores >= 80, 'B',
                           np.where(scores >= 70, 'C',
                                    np.where(scores >= 60, 'D', 'F'))))
print(f"  成绩等级: {grades}")
```

## 四、数组运算与广播机制

### 4.1 基本算术运算

NumPy支持对数组进行元素级别的算术运算，包括加法、减法、乘法、除法、幂运算等。这些运算都是向量化的，比Python循环快得多。

```python
# 示例：基本算术运算
import numpy as np

print("=" * 60)
print("数组基本算术运算")
print("=" * 60)

# 创建数组
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

print(f"数组a: {a}")
print(f"数组b: {b}")

# 基本运算
print(f"\n基本运算:")
print(f"  a + b = {a + b}")          # 加法
print(f"  a - b = {a - b}")          # 减法
print(f"  a * b = {a * b}")          # 逐元素乘法（不是矩阵乘法）
print(f"  a / b = {a / b}")          # 除法
print(f"  a ** 2 = {a ** 2}")        # 幂运算
print(f"  a % 3 = {a % 3}")          # 取模
print(f"  a // 2 = {a // 2}")        # 整除

# 标量运算
print(f"\n标量运算:")
print(f"  a + 10 = {a + 10}")
print(f"  a * 2 = {a * 2}")
print(f"  a / 2 = {a / 2}")
print(f"  2 ** a = {2 ** a}")

# 比较运算
print(f"\n比较运算:")
print(f"  a > 3: {a > 3}")
print(f"  a == 3: {a == 3}")
print(f"  a != b: {a != b}")
print(f"  a中大于2的元素: {a[a > 2]}")

# 矩阵运算
print(f"\n矩阵运算:")
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(f"A:")
print(A)
print(f"B:")
print(B)

# 逐元素乘法
print(f"  A * B (逐元素):")
print(A * B)

# 矩阵乘法
print(f"  A @ B (矩阵乘法):")
print(A @ B)
print(f"  np.dot(A, B):")
print(np.dot(A, B))
print(f"  np.matmul(A, B):")
print(np.matmul(A, B))
```

### 4.2 广播机制

广播（Broadcasting）是NumPy中处理不同形状数组的算术运算的强大机制。当两个数组形状不同时，NumPy会尝试将它们广播到相同的形状，然后进行运算。广播遵循以下规则：

1. 如果两个数组的维度数不同，在较小维度数组的形状前面补1
2. 如果两个数组在某个维度上的大小不一致，且其中一个大小为1，则将该维度扩展为较大者的大小
3. 如果两个数组在某个维度上的大小不一致且都不为1，则报错

```python
# 示例：广播机制详解
import numpy as np

print("=" * 60)
print("广播机制详解")
print("=" * 60)

# 示例1：标量与数组
print("示例1: 标量与数组")
arr = np.array([1, 2, 3, 4, 5])
print(f"  arr: {arr}")
print(f"  arr + 10: {arr + 10}")  # 标量10被广播到与arr相同形状

# 示例2：一维数组与二维数组
print("\n示例2: 一维数组与二维数组")
matrix = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
row_vector = np.array([10, 20, 30])
print(f"  matrix:")
print(matrix)
print(f"  row_vector: {row_vector}")
print(f"  matrix + row_vector:")
print(matrix + row_vector)

# 示例3：列向量与矩阵
print("\n示例3: 列向量与矩阵")
col_vector = np.array([[10], [20], [30]])
print(f"  col_vector:")
print(col_vector)
print(f"  matrix + col_vector:")
print(matrix + col_vector)

# 示例4：广播的详细过程
print("\n示例4: 广播过程演示")
a = np.ones((3, 1))
b = np.arange(1, 5)
print(f"  a.shape: {a.shape}")
print(f"  a:")
print(a)
print(f"  b.shape: {b.shape}")
print(f"  b: {b}")
print(f"  a + b:")
print(a + b)
print(f"  结果形状: {(a + b).shape}")

# 示例5：不兼容的广播
print("\n示例5: 不兼容的广播")
try:
    a = np.ones((3, 2))
    b = np.ones((4, 3))
    print(f"  a.shape: {a.shape}, b.shape: {b.shape}")
    result = a + b
except ValueError as e:
    print(f"  广播失败: {e}")

# 示例6：广播的实际应用
print("\n示例6: 广播的实际应用")
# 数据标准化（减去均值，除以标准差）
data = np.random.randn(5, 4)  # 5个样本，4个特征
print(f"  原始数据:")
print(data)

# 每个特征的均值
mean = data.mean(axis=0)
print(f"  均值: {mean}")

# 每个特征的标准差
std = data.std(axis=0)
print(f"  标准差: {std}")

# 标准化
normalized = (data - mean) / std
print(f"  标准化后:")
print(normalized)
print(f"  标准化后均值: {normalized.mean(axis=0)}")
print(f"  标准化后标准差: {normalized.std(axis=0)}")
```

### 4.3 通用函数（ufunc）

通用函数（Universal Functions，简称ufunc）是NumPy中对数组进行逐元素运算的函数。它们都是用C语言实现的，因此执行速度非常快。

```python
# 示例：通用函数（ufunc）
import numpy as np

print("=" * 60)
print("通用函数（ufunc）")
print("=" * 60)

# 创建测试数组
arr = np.arange(1, 11)
print(f"测试数组: {arr}")

# 数学函数
print("\n1. 数学函数:")
print(f"  np.sqrt(arr): {np.sqrt(arr)}")          # 平方根
print(f"  np.exp(arr): {np.exp(arr[:5])}")        # e的幂
print(f"  np.log(arr): {np.log(arr)}")            # 自然对数
print(f"  np.log10(arr): {np.log10(arr)}")        # 以10为底的对数
print(f"  np.log2(arr): {np.log2(arr)}")          # 以2为底的对数
print(f"  np.abs([-5, -3, 0, 2, 7]): {np.abs([-5, -3, 0, 2, 7])}")  # 绝对值

# 三角函数
print("\n2. 三角函数:")
angles = np.array([0, 30, 45, 60, 90])
radians = np.radians(angles)
print(f"  角度: {angles}")
print(f"  弧度: {radians}")
print(f"  sin: {np.sin(radians)}")
print(f"  cos: {np.cos(radians)}")
print(f"  tan: {np.tan(radians[:4])}")  # 90度的tan是无穷大

# 统计函数
print("\n3. 统计函数:")
data = np.array([15, 23, 8, 42, 19, 31, 7, 28])
print(f"  数据: {data}")
print(f"  np.sum(data): {np.sum(data)}")        # 求和
print(f"  np.mean(data): {np.mean(data)}")      # 均值
print(f"  np.median(data): {np.median(data)}")  # 中位数
print(f"  np.std(data): {np.std(data):.2f}")    # 标准差
print(f"  np.var(data): {np.var(data):.2f}")    # 方差
print(f"  np.min(data): {np.min(data)}")        # 最小值
print(f"  np.max(data): {np.max(data)}")        # 最大值
print(f"  np.argmin(data): {np.argmin(data)}")  # 最小值的索引
print(f"  np.argmax(data): {np.argmax(data)}")  # 最大值的索引
print(f"  np.percentile(data, 50): {np.percentile(data, 50)}")  # 百分位数

# 累积函数
print("\n4. 累积函数:")
print(f"  np.cumsum(data): {np.cumsum(data)}")  # 累积和
print(f"  np.cumprod(np.arange(1, 6)): {np.cumprod(np.arange(1, 6))}")  # 累积积

# 排序函数
print("\n5. 排序函数:")
unsorted = np.array([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])
print(f"  未排序: {unsorted}")
print(f"  np.sort(unsorted): {np.sort(unsorted)}")
print(f"  np.unique(unsorted): {np.unique(unsorted)}")
print(f"  np.argsort(unsorted): {np.argsort(unsorted)}")

# 沿轴计算
print("\n6. 沿轴计算:")
matrix = np.arange(1, 13).reshape(3, 4)
print(f"矩阵:")
print(matrix)
print(f"  axis=0 (列) 求和: {matrix.sum(axis=0)}")
print(f"  axis=1 (行) 求和: {matrix.sum(axis=1)}")
print(f"  axis=0 均值: {matrix.mean(axis=0)}")
print(f"  axis=1 最大值: {matrix.max(axis=1)}")
```

## 五、数组形状操作

### 5.1 改变数组形状

NumPy提供了多种改变数组形状的方法，这些操作在数据预处理中非常常用。

```python
# 示例：改变数组形状
import numpy as np

print("=" * 60)
print("改变数组形状")
print("=" * 60)

# 创建原始数组
arr = np.arange(12)
print(f"原始数组: {arr}")
print(f"原始形状: {arr.shape}")

# 1. reshape - 改变形状
print("\n1. reshape:")
print(f"  reshape(3, 4):")
print(arr.reshape(3, 4))
print(f"  reshape(4, 3):")
print(arr.reshape(4, 3))
print(f"  reshape(2, 6):")
print(arr.reshape(2, 6))
print(f"  reshape(2, 2, 3):")
print(arr.reshape(2, 2, 3))

# 使用-1自动计算维度
print(f"  reshape(-1, 4):")  # 自动计算行数
print(arr.reshape(-1, 4))
print(f"  reshape(3, -1):")  # 自动计算列数
print(arr.reshape(3, -1))

# 2. ravel和flatten - 展平数组
print("\n2. ravel和flatten:")
arr2d = np.array([[1, 2, 3], [4, 5, 6]])
print(f"  二维数组:")
print(arr2d)
print(f"  arr2d.ravel(): {arr2d.ravel()}")    # 返回视图（如果可能）
print(f"  arr2d.flatten(): {arr2d.flatten()}")  # 返回副本

# ravel和flatten的区别
print(f"\n  ravel vs flatten:")
arr3d = np.arange(24).reshape(2, 3, 4)
print(f"  三维数组 shape={arr3d.shape}")
flattened = arr3d.flatten()
raveled = arr3d.ravel()
print(f"  flatten() shape: {flattened.shape}")
print(f"  ravel() shape: {raveled.shape}")

# 3. 转置
print("\n3. 转置:")
print(f"  原始:")
print(arr2d)
print(f"  arr2d.T:")
print(arr2d.T)
print(f"  np.transpose(arr2d):")
print(np.transpose(arr2d))

# 高维数组的转置
arr3d = np.arange(24).reshape(2, 3, 4)
print(f"\n  三维数组转置:")
print(f"  原始 shape={arr3d.shape}")
print(f"  np.transpose(arr3d, (2, 0, 1)) shape={np.transpose(arr3d, (2, 0, 1)).shape}")

# 4. newaxis - 增加维度
print("\n4. newaxis增加维度:")
arr1d = np.array([1, 2, 3])
print(f"  一维数组: {arr1d}, shape={arr1d.shape}")
print(f"  变为行向量: shape={arr1d[np.newaxis, :].shape}")
print(f"  变为列向量: shape={arr1d[:, np.newaxis].shape}")
```

### 5.2 数组的合并与分割

```python
# 示例：数组的合并与分割
import numpy as np

print("=" * 60)
print("数组的合并与分割")
print("=" * 60)

# 创建测试数组
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
c = np.array([[9, 10], [11, 12]])

print(f"数组a:")
print(a)
print(f"数组b:")
print(b)
print(f"数组c:")
print(c)

# 合并
print("\n1. 数组合并:")
print("  np.concatenate([a, b], axis=0):")  # 垂直堆叠
print(np.concatenate([a, b], axis=0))
print("  np.concatenate([a, b], axis=1):")  # 水平堆叠
print(np.concatenate([a, b], axis=1))

print("\n  np.vstack([a, b]):")  # 垂直堆叠
print(np.vstack([a, b]))
print("  np.hstack([a, b]):")  # 水平堆叠
print(np.hstack([a, b]))

print("  np.dstack([a, b]):")  # 深度堆叠
print(np.dstack([a, b]))
print(f"  dstack shape: {np.dstack([a, b]).shape}")

# 分割
print("\n2. 数组分割:")
arr = np.arange(1, 13).reshape(3, 4)
print(f"原始数组:")
print(arr)

# 垂直分割
print("  np.vsplit(arr, 3):")
for i, part in enumerate(np.vsplit(arr, 3)):
    print(f"    部分{i+1}:")
    print(part)

# 水平分割
print("  np.hsplit(arr, 2):")
for i, part in enumerate(np.hsplit(arr, 2)):
    print(f"    部分{i+1}:")
    print(part)

# np.split
print("  np.split(arr, 3, axis=0):")
for i, part in enumerate(np.split(arr, 3, axis=0)):
    print(f"    部分{i+1}: {part}")
```

## 六、线性代数基础

### 6.1 矩阵运算

NumPy的`linalg`子模块提供了丰富的线性代数函数，包括矩阵乘法、行列式、特征值、奇异值分解等。

```python
# 示例：线性代数基础
import numpy as np
from numpy import linalg

print("=" * 60)
print("线性代数基础")
print("=" * 60)

# 创建矩阵
A = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 10]
])
B = np.array([
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 3]
])

print(f"矩阵A:")
print(A)
print(f"矩阵B:")
print(B)

# 1. 矩阵乘法
print("\n1. 矩阵乘法:")
print("  A @ B:")
print(A @ B)

# 2. 矩阵的逆
print("\n2. 矩阵的逆:")
A_inv = linalg.inv(A)
print("  A的逆矩阵:")
print(A_inv)
print("  验证 A @ A_inv = I:")
print(np.round(A @ A_inv, decimals=10))

# 3. 行列式
print("\n3. 行列式:")
det_A = linalg.det(A)
print(f"  det(A) = {det_A:.4f}")

# 4. 特征值和特征向量
print("\n4. 特征值和特征向量:")
eigenvalues, eigenvectors = linalg.eig(A)
print(f"  特征值: {eigenvalues}")
print(f"  特征向量:")
print(eigenvectors)

# 验证: A @ v = lambda * v
print("  验证 A @ v[:,0] = lambda[0] * v[:,0]:")
print(f"  A @ v[:,0] = {A @ eigenvectors[:, 0]}")
print(f"  lambda * v[:,0] = {eigenvalues[0] * eigenvectors[:, 0]}")

# 5. 奇异值分解（SVD）
print("\n5. 奇异值分解:")
U, s, Vt = linalg.svd(A)
print(f"  U:")
print(U)
print(f"  奇异值: {s}")
print(f"  Vt:")
print(Vt)

# 6. 解线性方程组
print("\n6. 解线性方程组: Ax = b")
b = np.array([1, 2, 3])
x = linalg.solve(A, b)
print(f"  b = {b}")
print(f"  x = {x}")
print(f"  验证 A @ x = {A @ x}")

# 7. 矩阵的秩
print("\n7. 矩阵的秩:")
print(f"  rank(A) = {linalg.matrix_rank(A)}")

# 8. 范数
print("\n8. 矩阵范数:")
print(f"  Frobenius范数: {linalg.norm(A, 'fro'):.4f}")
print(f"  L2范数: {linalg.norm(A, 2):.4f}")

# 9. 实际应用：最小二乘法
print("\n9. 最小二乘法拟合:")
# 生成带噪声的数据
np.random.seed(42)
x_data = np.linspace(0, 10, 50)
y_true = 2 * x_data + 1
y_data = y_true + np.random.normal(0, 1, 50)

# 使用最小二乘法拟合 y = ax + b
X = np.column_stack([x_data, np.ones_like(x_data)])
coeff, residuals, rank, s = linalg.lstsq(X, y_data, rcond=None)
print(f"  拟合结果: y = {coeff[0]:.4f}x + {coeff[1]:.4f}")
print(f"  真实参数: y = 2x + 1")
print(f"  残差平方和: {residuals[0]:.4f}")
```

## 七、NumPy实战应用

### 7.1 数据统计分析

```python
# 示例：数据统计分析
import numpy as np

print("=" * 60)
print("数据统计分析实战")
print("=" * 60)

# 生成模拟数据：100名学生的考试成绩
np.random.seed(42)

# 各科成绩
math_scores = np.random.normal(75, 12, 100).clip(0, 100)
english_scores = np.random.normal(70, 15, 100).clip(0, 100)
chinese_scores = np.random.normal(80, 10, 100).clip(0, 100)
physics_scores = np.random.normal(65, 18, 100).clip(0, 100)

# 组合成矩阵
scores = np.column_stack([math_scores, english_scores, chinese_scores, physics_scores])
subjects = ['数学', '英语', '语文', '物理']

print("学生成绩分析:")
print(f"学生数量: {scores.shape[0]}")
print(f"科目数量: {scores.shape[1]}")

# 基本统计
print("\n各科统计:")
for i, subject in enumerate(subjects):
    subject_scores = scores[:, i]
    print(f"\n{subject}:")
    print(f"  平均分: {subject_scores.mean():.2f}")
    print(f"  中位数: {np.median(subject_scores):.2f}")
    print(f"  标准差: {subject_scores.std():.2f}")
    print(f"  最高分: {subject_scores.max():.0f}")
    print(f"  最低分: {subject_scores.min():.0f}")
    print(f"  及格率: {(subject_scores >= 60).mean() * 100:.1f}%")

# 总分和排名
total_scores = scores.sum(axis=1)
avg_scores = scores.mean(axis=1)

print(f"\n总分统计:")
print(f"  平均总分: {total_scores.mean():.2f}")
print(f"  最高总分: {total_scores.max():.0f}")
print(f"  最低总分: {total_scores.min():.0f}")

# 排名
rankings = np.argsort(-total_scores)  # 降序排列的索引
print(f"\n前5名学生:")
for i, idx in enumerate(rankings[:5]):
    print(f"  第{i+1}名: 总分={total_scores[idx]:.0f}, "
          f"数学={math_scores[idx]:.0f}, 英语={english_scores[idx]:.0f}, "
          f"语文={chinese_scores[idx]:.0f}, 物理={physics_scores[idx]:.0f}")

# 分数段分布
print(f"\n分数段分布(总分):")
bins = [0, 200, 240, 280, 320, 400]
labels = ['0-200', '200-240', '240-280', '280-320', '320-400']
hist, _ = np.histogram(total_scores, bins=bins)
for label, count in zip(labels, hist):
    print(f"  {label}: {count}人 ({count/len(total_scores)*100:.1f}%)")

# 相关性分析
print(f"\n各科成绩相关系数矩阵:")
corr_matrix = np.corrcoef(scores.T)
print(f"        {'  '.join(subjects)}")
for i, subject in enumerate(subjects):
    print(f"{subject:4s} {corr_matrix[i]}")

# 查找异常值（使用Z-score方法）
print(f"\n异常值检测 (Z-score > 2):")
for i, subject in enumerate(subjects):
    z_scores = np.abs((scores[:, i] - scores[:, i].mean()) / scores[:, i].std())
    outliers = np.where(z_scores > 2)[0]
    if len(outliers) > 0:
        print(f"  {subject}: {len(outliers)}个异常值")
```

### 7.2 图像处理基础

NumPy可以用于基本的图像处理，因为图像本质上就是多维数组。

```python
# 示例：图像处理基础（使用NumPy模拟）
import numpy as np

print("=" * 60)
print("图像处理基础（NumPy模拟）")
print("=" * 60)

# 创建模拟图像（灰度图）
def create_mock_image(width=10, height=10):
    """创建模拟灰度图像"""
    # 创建一个渐变图像
    x = np.linspace(0, 1, width)
    y = np.linspace(0, 1, height)
    xx, yy = np.meshgrid(x, y)
    image = (xx + yy) / 2 * 255
    return image.astype(np.uint8)

# 创建测试图像
image = create_mock_image(10, 10)
print("原始图像 (10x10 灰度):")
print(image)

# 基本图像操作
print(f"\n图像属性:")
print(f"  形状: {image.shape}")
print(f"  数据类型: {image.dtype}")
print(f"  最小值: {image.min()}")
print(f"  最大值: {image.max()}")
print(f"  平均值: {image.mean():.2f}")

# 图像增强
print(f"\n图像增强:")
# 亮度调整
brightened = np.clip(image.astype(float) + 50, 0, 255).astype(np.uint8)
print("  亮度+50:")
print(brightened)

# 对比度增强
contrasted = np.clip((image.astype(float) - 128) * 1.5 + 128, 0, 255).astype(np.uint8)
print("  对比度增强:")
print(contrasted)

# 图像翻转
print(f"\n图像翻转:")
flipped_h = np.fliplr(image)
print("  水平翻转:")
print(flipped_h)

flipped_v = np.flipud(image)
print("  垂直翻转:")
print(flipped_v)

# 图像裁剪
cropped = image[2:8, 2:8]
print(f"\n裁剪 (2:8, 2:8):")
print(cropped)

# 图像滤波（简单平滑）
print(f"\n简单平滑滤波 (3x3均值):")
# 创建一个3x3均值滤波器
smoothed = np.zeros_like(image, dtype=float)
for i in range(1, image.shape[0] - 1):
    for j in range(1, image.shape[1] - 1):
        smoothed[i, j] = image[i-1:i+2, j-1:j+2].mean()
print(smoothed.astype(np.uint8))

# 直方图
print(f"\n灰度直方图:")
hist, bins = np.histogram(image.flatten(), bins=10, range=(0, 255))
for i, count in enumerate(hist):
    bar = '#' * count
    print(f"  {bins[i]:3.0f}-{bins[i+1]:3.0f}: {count:2d} {bar}")
```

## 总结

本章我们深入学习了NumPy的核心知识，涵盖了以下主要内容：

**NumPy简介**：NumPy是Python科学计算的核心库，提供了高性能的多维数组对象和丰富的数学函数。它是Pandas、Matplotlib等数据科学库的基础。

**ndarray创建与属性**：`ndarray`是NumPy的核心数据结构，可以通过多种方式创建（从列表、使用内置函数等）。理解`shape`、`ndim`、`dtype`等属性对于正确使用NumPy至关重要。

**数组索引与切片**：NumPy支持丰富的索引和切片操作，包括基本切片、整数数组索引、布尔索引和花式索引等。这些高级索引技术是数据分析中的强大工具。

**数组运算与广播机制**：NumPy支持向量化的算术运算，比Python循环快得多。广播机制允许对不同形状的数组进行运算，是NumPy最强大的特性之一。

**通用函数（ufunc）**：NumPy提供了大量的通用函数，包括数学函数、三角函数、统计函数等，都是高效的C语言实现。

**数组形状操作**：`reshape`、`ravel`、`flatten`、`transpose`等函数可以灵活地改变数组的形状，`concatenate`、`vstack`、`hstack`等函数用于合并数组。

**线性代数基础**：`numpy.linalg`模块提供了矩阵运算、特征值分解、奇异值分解、解线性方程组等功能，是科学计算的重要工具。

通过本章的学习，你应该已经掌握了NumPy的核心功能，能够使用NumPy进行高效的数据处理和科学计算。在下一章中，我们将学习Pandas，这是基于NumPy构建的更高级的数据分析库。
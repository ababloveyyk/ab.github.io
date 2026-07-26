---
title: Python核心生态与落地Ⅱ——Pandas基础
date: 2026-07-26
tags:
  - Python
  - Pandas
  - 数据分析
  - 数据处理
categories:
  - Python
---

## 一、Pandas简介与安装

### 1.1 什么是Pandas

Pandas是Python中最流行的数据分析库，它构建在NumPy之上，提供了高性能、易于使用的数据结构和数据分析工具。Pandas的名字来源于"Panel Data"（面板数据）和"Python Data Analysis"（Python数据分析）。

Pandas的核心优势包括：

**强大的数据结构**：Pandas提供了两种核心数据结构——`Series`（一维）和`DataFrame`（二维），它们可以处理各种类型的数据（数值、字符串、时间序列等）。

**灵活的数据操作**：Pandas提供了丰富的数据操作功能，包括数据筛选、分组聚合、合并连接、重塑透视等。

**缺失数据处理**：Pandas内置了完善的缺失值处理机制，可以方便地检测、填充或删除缺失数据。

**时间序列支持**：Pandas对时间序列数据有出色的支持，包括日期范围生成、频率转换、移动窗口统计等。

**高效的数据IO**：Pandas支持从CSV、Excel、JSON、SQL数据库等多种格式读取和写入数据。

```python
# 示例：Pandas简介
import pandas as pd
import numpy as np

print("=" * 60)
print("Pandas简介")
print("=" * 60)

print(f"Pandas版本: {pd.__version__}")
print(f"NumPy版本: {np.__version__}")

# 创建简单的DataFrame
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 22, 28],
    '城市': ['北京', '上海', '广州', '深圳'],
    '薪资': [15000, 20000, 12000, 18000]
})

print(f"\nDataFrame示例:")
print(df)
print(f"\n数据类型:")
print(df.dtypes)
print(f"\n基本统计:")
print(df.describe())
```

### 1.2 安装Pandas

```bash
pip install pandas
```

## 二、Series创建与操作

### 2.1 创建Series

`Series`是Pandas中的一维标记数组，可以存储任意类型的数据。每个`Series`都有一个索引（index），用于标记每个元素。

```python
# 示例：创建Series
import pandas as pd
import numpy as np

print("=" * 60)
print("创建Series")
print("=" * 60)

# 1. 从列表创建
print("1. 从列表创建:")
s1 = pd.Series([10, 20, 30, 40, 50])
print(s1)
print(f"  索引: {s1.index.tolist()}")
print(f"  值: {s1.values}")

# 2. 指定索引
print("\n2. 指定索引:")
s2 = pd.Series([10, 20, 30, 40, 50], index=['a', 'b', 'c', 'd', 'e'])
print(s2)

# 3. 从字典创建
print("\n3. 从字典创建:")
s3 = pd.Series({'数学': 95, '英语': 88, '语文': 92, '物理': 85})
print(s3)

# 4. 从NumPy数组创建
print("\n4. 从NumPy数组创建:")
arr = np.random.randn(5)
s4 = pd.Series(arr, index=[f'样本{i}' for i in range(1, 6)])
print(s4)

# 5. 创建带名称的Series
print("\n5. 带名称的Series:")
s5 = pd.Series([1, 2, 3, 4, 5], name='数值')
print(s5)
print(f"  Series名称: {s5.name}")
```

### 2.2 Series的基本操作

```python
# 示例：Series的基本操作
import pandas as pd
import numpy as np

print("=" * 60)
print("Series的基本操作")
print("=" * 60)

# 创建Series
s = pd.Series([85, 92, 78, 95, 88, 72, 90], 
              index=['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九'],
              name='成绩')

print(f"成绩Series:")
print(s)

# 索引访问
print(f"\n1. 索引访问:")
print(f"  s['张三']: {s['张三']}")
print(f"  s[0]: {s[0]}")  # 位置索引
print(f"  s[['张三', '李四', '赵六']]:")
print(s[['张三', '李四', '赵六']])

# 切片
print(f"\n2. 切片:")
print(f"  s[0:3]:")
print(s[0:3])
print(f"  s['张三':'赵六']:")  # 标签切片包含两端
print(s['张三':'赵六'])

# 布尔索引
print(f"\n3. 布尔索引:")
print(f"  成绩 >= 90:")
print(s[s >= 90])
print(f"  成绩在80-90之间:")
print(s[(s >= 80) & (s <= 90)])

# 数学运算
print(f"\n4. 数学运算:")
print(f"  s + 5:")
print(s + 5)
print(f"  s * 2:")
print(s * 2)

# 统计方法
print(f"\n5. 统计方法:")
print(f"  mean: {s.mean():.2f}")
print(f"  median: {s.median()}")
print(f"  std: {s.std():.2f}")
print(f"  min: {s.min()}")
print(f"  max: {s.max()}")
print(f"  sum: {s.sum()}")
print(f"  count: {s.count()}")

# 排序
print(f"\n6. 排序:")
print(f"  按值排序:")
print(s.sort_values(ascending=False))
print(f"  按索引排序:")
print(s.sort_index())

# 值计数
print(f"\n7. 值统计:")
grades = pd.Series(['A', 'B', 'A', 'C', 'B', 'A', 'D', 'B', 'A', 'C'])
print(grades.value_counts())
```

## 三、DataFrame创建与操作

### 3.1 创建DataFrame

`DataFrame`是Pandas中最核心的数据结构，它类似于电子表格或SQL表，是一个二维的、大小可变的、异构的数据表格。`DataFrame`既有行索引也有列索引。

```python
# 示例：创建DataFrame
import pandas as pd
import numpy as np

print("=" * 60)
print("创建DataFrame")
print("=" * 60)

# 1. 从字典创建
print("1. 从字典创建:")
df1 = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 22, 28],
    '城市': ['北京', '上海', '广州', '深圳'],
    '薪资': [15000, 20000, 12000, 18000]
})
print(df1)

# 2. 从列表的字典创建
print("\n2. 从列表的字典创建:")
data = [
    {'name': 'Apple', 'price': 5.5, 'stock': 100},
    {'name': 'Banana', 'price': 3.2, 'stock': 150},
    {'name': 'Orange', 'price': 4.8, 'stock': 80},
]
df2 = pd.DataFrame(data)
print(df2)

# 3. 从NumPy数组创建
print("\n3. 从NumPy数组创建:")
arr = np.random.randn(5, 3)
df3 = pd.DataFrame(arr, 
                   columns=['特征A', '特征B', '特征C'],
                   index=[f'样本{i}' for i in range(1, 6)])
print(df3)

# 4. 指定索引的DataFrame
print("\n4. 指定索引:")
df4 = pd.DataFrame({
    '数学': [95, 88, 92, 78],
    '英语': [85, 90, 88, 82],
    '语文': [90, 85, 93, 80]
}, index=['张三', '李四', '王五', '赵六'])
print(df4)

# 5. 创建空DataFrame并添加列
print("\n5. 动态添加列:")
df5 = pd.DataFrame()
df5['姓名'] = ['张三', '李四', '王五']
df5['年龄'] = [25, 30, 22]
df5['入职日期'] = pd.to_datetime(['2023-01-15', '2022-06-01', '2024-03-10'])
print(df5)
```

### 3.2 DataFrame的基本属性和操作

```python
# 示例：DataFrame的基本属性和操作
import pandas as pd
import numpy as np

print("=" * 60)
print("DataFrame的基本属性和操作")
print("=" * 60)

# 创建DataFrame
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六', '孙七'],
    '年龄': [25, 30, 22, 28, 35],
    '城市': ['北京', '上海', '广州', '深圳', '杭州'],
    '薪资': [15000, 20000, 12000, 18000, 25000],
    '部门': ['技术', '市场', '技术', '销售', '管理']
})

print("DataFrame:")
print(df)

# 基本属性
print(f"\n1. 基本属性:")
print(f"  shape: {df.shape}")
print(f"  columns: {df.columns.tolist()}")
print(f"  index: {df.index.tolist()}")
print(f"  dtypes:")
print(df.dtypes)
print(f"  size: {df.size}")
print(f"  ndim: {df.ndim}")

# 查看数据
print(f"\n2. 查看数据:")
print(f"  head(3):")
print(df.head(3))
print(f"  tail(2):")
print(df.tail(2))

# 列操作
print(f"\n3. 列操作:")
print(f"  选择单列 (df['姓名']):")
print(df['姓名'])
print(f"  选择多列:")
print(df[['姓名', '薪资', '部门']])

# 使用loc和iloc
print(f"\n4. loc和iloc:")
print(f"  df.loc[0] (按标签):")
print(df.loc[0])
print(f"  df.iloc[0] (按位置):")
print(df.iloc[0])
print(f"  df.loc[0:2, ['姓名', '薪资']]:")
print(df.loc[0:2, ['姓名', '薪资']])
print(f"  df.iloc[0:2, 0:3]:")
print(df.iloc[0:2, 0:3])

# 添加和删除列
print(f"\n5. 添加和删除列:")
df['奖金'] = df['薪资'] * 0.1
print(f"  添加'奖金'列:")
print(df[['姓名', '薪资', '奖金']])

df['总收入'] = df['薪资'] + df['奖金']
print(f"  添加'总收入'列:")
print(df[['姓名', '薪资', '奖金', '总收入']])

df_dropped = df.drop('奖金', axis=1)
print(f"  删除'奖金'列:")
print(df_dropped.columns.tolist())
```

### 3.3 DataFrame的统计和排序

```python
# 示例：DataFrame的统计和排序
import pandas as pd
import numpy as np

print("=" * 60)
print("DataFrame的统计和排序")
print("=" * 60)

# 创建DataFrame
np.random.seed(42)
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'],
    '年龄': [25, 30, 22, 28, 35, 27, 32, 24],
    '部门': ['技术', '市场', '技术', '销售', '管理', '技术', '市场', '销售'],
    '薪资': np.random.randint(8000, 30000, 8),
    '绩效': np.random.uniform(60, 100, 8).round(1)
})

print("DataFrame:")
print(df)

# 描述性统计
print(f"\n1. 描述性统计:")
print(df.describe())

# 按列统计
print(f"\n2. 按列统计:")
print(f"  薪资总和: {df['薪资'].sum()}")
print(f"  薪资均值: {df['薪资'].mean():.2f}")
print(f"  薪资中位数: {df['薪资'].median()}")
print(f"  薪资标准差: {df['薪资'].std():.2f}")
print(f"  绩效最高: {df['绩效'].max()}")
print(f"  绩效最低: {df['绩效'].min()}")

# 排序
print(f"\n3. 排序:")
print(f"  按薪资升序:")
print(df.sort_values('薪资'))
print(f"  按薪资降序:")
print(df.sort_values('薪资', ascending=False))
print(f"  按部门和薪资排序:")
print(df.sort_values(['部门', '薪资'], ascending=[True, False]))

# 排名
print(f"\n4. 排名:")
df['薪资排名'] = df['薪资'].rank(ascending=False)
print(df[['姓名', '薪资', '薪资排名']])

# 唯一值和计数
print(f"\n5. 唯一值和计数:")
print(f"  部门类别: {df['部门'].unique()}")
print(f"  部门数量: {df['部门'].nunique()}")
print(f"  部门分布:")
print(df['部门'].value_counts())

# 相关性
print(f"\n6. 相关性分析:")
corr = df[['年龄', '薪资', '绩效']].corr()
print(corr)
```

## 四、数据读取

### 4.1 读取CSV文件

CSV（Comma-Separated Values）是最常见的数据交换格式之一。Pandas提供了`read_csv()`函数来读取CSV文件。

```python
# 示例：读取CSV文件
import pandas as pd
import numpy as np
import os
import tempfile

print("=" * 60)
print("读取CSV文件")
print("=" * 60)

# 创建临时CSV文件用于演示
tmp_dir = tempfile.mkdtemp()
csv_file = os.path.join(tmp_dir, "employees.csv")

# 创建示例数据并保存
df_sample = pd.DataFrame({
    'ID': range(1, 11),
    '姓名': ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二'],
    '年龄': [25, 30, 22, 28, 35, 27, 32, 24, 29, 31],
    '部门': ['技术', '市场', '技术', '销售', '管理', '技术', '市场', '销售', '技术', '管理'],
    '薪资': [15000, 20000, 12000, 18000, 25000, 16000, 19000, 14000, 17000, 22000],
    '入职日期': ['2023-01-15', '2022-06-01', '2024-03-10', '2023-08-20', '2021-12-01',
                '2023-04-05', '2022-09-15', '2024-01-10', '2023-07-01', '2022-03-20']
})

df_sample.to_csv(csv_file, index=False, encoding='utf-8-sig')
print(f"CSV文件已创建: {csv_file}")

# 读取CSV文件
df = pd.read_csv(csv_file, encoding='utf-8-sig')
print(f"\n读取的DataFrame:")
print(df)

# 读取时指定参数
print(f"\n读取时指定参数:")
df_subset = pd.read_csv(
    csv_file,
    encoding='utf-8-sig',
    usecols=['姓名', '部门', '薪资'],  # 只读取指定列
    nrows=5,                            # 只读取前5行
    dtype={'薪资': float}               # 指定数据类型
)
print(df_subset)

# 读取大文件时分块读取
print(f"\n分块读取:")
chunk_size = 3
for i, chunk in enumerate(pd.read_csv(csv_file, encoding='utf-8-sig', chunksize=chunk_size)):
    print(f"  块 {i+1}: {len(chunk)} 行")
    print(chunk[['姓名', '薪资']])

# 清理
os.remove(csv_file)
os.rmdir(tmp_dir)
```

### 4.2 读取Excel和JSON

```python
# 示例：读取Excel和JSON
import pandas as pd
import numpy as np
import os
import tempfile
import json

print("=" * 60)
print("读取Excel和JSON")
print("=" * 60)

# 创建临时文件
tmp_dir = tempfile.mkdtemp()

# 创建示例数据
df_sample = pd.DataFrame({
    '产品': ['手机', '电脑', '平板', '耳机', '手表'],
    '销量': [1200, 800, 600, 1500, 400],
    '单价': [3999, 6999, 2999, 499, 1999],
    '地区': ['华北', '华东', '华南', '华北', '华东']
})

# 保存为JSON
json_file = os.path.join(tmp_dir, "products.json")
df_sample.to_json(json_file, orient='records', force_ascii=False, indent=2)
print(f"JSON文件已创建: {json_file}")

# 读取JSON
df_json = pd.read_json(json_file, orient='records')
print(f"\n从JSON读取:")
print(df_json)

# 读取JSON字符串
json_str = '[{"name":"张三","age":25},{"name":"李四","age":30}]'
df_json_str = pd.read_json(json_str)
print(f"\n从JSON字符串读取:")
print(df_json_str)

# 保存为Excel（需要openpyxl）
try:
    excel_file = os.path.join(tmp_dir, "products.xlsx")
    df_sample.to_excel(excel_file, index=False, sheet_name='产品数据')
    print(f"\nExcel文件已创建: {excel_file}")
    
    # 读取Excel
    df_excel = pd.read_excel(excel_file, sheet_name='产品数据')
    print(f"\n从Excel读取:")
    print(df_excel)
except ImportError:
    print("\n需要安装openpyxl: pip install openpyxl")

# 清理
import shutil
shutil.rmtree(tmp_dir)
```

## 五、数据清洗

### 5.1 缺失值处理

缺失值是数据分析中常见的问题。Pandas提供了丰富的缺失值处理功能。

```python
# 示例：缺失值处理
import pandas as pd
import numpy as np

print("=" * 60)
print("缺失值处理")
print("=" * 60)

# 创建包含缺失值的DataFrame
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六', '孙七'],
    '年龄': [25, np.nan, 22, 28, np.nan],
    '城市': ['北京', '上海', np.nan, '深圳', '杭州'],
    '薪资': [15000, 20000, np.nan, 18000, 25000],
    '部门': ['技术', '市场', '技术', np.nan, '管理']
})

print("原始DataFrame:")
print(df)

# 检测缺失值
print(f"\n1. 检测缺失值:")
print(f"  每列缺失值数量:")
print(df.isnull().sum())
print(f"  缺失值总数: {df.isnull().sum().sum()}")
print(f"  缺失值比例:")
print(df.isnull().mean() * 100)

# 删除缺失值
print(f"\n2. 删除缺失值:")
print(f"  删除任何包含缺失值的行:")
print(df.dropna())
print(f"  删除所有列都为缺失值的行:")
print(df.dropna(how='all'))
print(f"  删除指定列包含缺失值的行:")
print(df.dropna(subset=['年龄', '薪资']))

# 填充缺失值
print(f"\n3. 填充缺失值:")
print(f"  用固定值填充:")
print(df.fillna('未知'))
print(f"  用均值填充数值列:")
df_filled = df.copy()
df_filled['年龄'] = df_filled['年龄'].fillna(df_filled['年龄'].mean())
df_filled['薪资'] = df_filled['薪资'].fillna(df_filled['薪资'].mean())
print(df_filled)
print(f"  向前填充 (ffill):")
print(df.fillna(method='ffill'))
print(f"  向后填充 (bfill):")
print(df.fillna(method='bfill'))

# 插值填充
print(f"\n4. 插值填充:")
df_interpolated = df.copy()
df_interpolated['年龄'] = df_interpolated['年龄'].interpolate()
print(df_interpolated)
```

### 5.2 重复值处理和数据转换

```python
# 示例：重复值处理和数据转换
import pandas as pd
import numpy as np

print("=" * 60)
print("重复值处理和数据转换")
print("=" * 60)

# 创建包含重复值的DataFrame
df = pd.DataFrame({
    '姓名': ['张三', '李四', '张三', '王五', '李四', '赵六'],
    '年龄': [25, 30, 25, 22, 30, 28],
    '城市': ['北京', '上海', '北京', '广州', '上海', '深圳'],
    '薪资': [15000, 20000, 15000, 12000, 20000, 18000]
})

print("原始DataFrame:")
print(df)

# 检测重复值
print(f"\n1. 检测重复值:")
print(f"  重复行:")
print(df[df.duplicated()])
print(f"  重复行数量: {df.duplicated().sum()}")

# 删除重复值
print(f"\n2. 删除重复值:")
print(f"  删除所有重复行:")
print(df.drop_duplicates())
print(f"  删除指定列的重复行 (保留第一个):")
print(df.drop_duplicates(subset=['姓名'], keep='first'))

# 数据类型转换
print(f"\n3. 数据类型转换:")
df['年龄_str'] = df['年龄'].astype(str)
print(f"  年龄转为字符串: {df['年龄_str'].dtype}")
print(df.dtypes)

# 应用函数
print(f"\n4. 应用函数:")
df['薪资等级'] = df['薪资'].apply(lambda x: '高' if x > 15000 else ('中' if x > 12000 else '低'))
print(df[['姓名', '薪资', '薪资等级']])

# 使用applymap对所有元素应用函数
print(f"\n5. applymap:")
df_numeric = df[['年龄', '薪资']]
print(df_numeric.applymap(lambda x: f"¥{x:,}"))

# 字符串操作
print(f"\n6. 字符串操作:")
df['城市'] = df['城市'].str.upper()
print(df[['姓名', '城市']])

# 重命名列
print(f"\n7. 重命名列:")
df_renamed = df.rename(columns={'姓名': 'name', '年龄': 'age', '薪资': 'salary'})
print(df_renamed.columns.tolist())
```

## 六、数据筛选与过滤

### 6.1 条件筛选

Pandas提供了多种灵活的数据筛选方式，包括布尔索引、query方法、isin等。

```python
# 示例：数据筛选与过滤
import pandas as pd
import numpy as np

print("=" * 60)
print("数据筛选与过滤")
print("=" * 60)

# 创建DataFrame
np.random.seed(42)
df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二'],
    '年龄': [25, 30, 22, 28, 35, 27, 32, 24, 29, 31],
    '部门': ['技术', '市场', '技术', '销售', '管理', '技术', '市场', '销售', '技术', '管理'],
    '薪资': np.random.randint(8000, 30000, 10),
    '绩效': np.random.uniform(60, 100, 10).round(1)
})

print("DataFrame:")
print(df)

# 1. 布尔索引
print(f"\n1. 布尔索引:")
print(f"  薪资 > 15000:")
print(df[df['薪资'] > 15000])
print(f"  部门为'技术':")
print(df[df['部门'] == '技术'])

# 2. 多条件筛选
print(f"\n2. 多条件筛选:")
print(f"  薪资 > 15000 且 绩效 > 80:")
print(df[(df['薪资'] > 15000) & (df['绩效'] > 80)])
print(f"  薪资 > 20000 或 年龄 < 25:")
print(df[(df['薪资'] > 20000) | (df['年龄'] < 25)])

# 3. query方法
print(f"\n3. query方法:")
print(f"  df.query('薪资 > 15000 and 绩效 > 80'):")
print(df.query('薪资 > 15000 and 绩效 > 80'))

# 4. isin筛选
print(f"\n4. isin筛选:")
print(f"  部门为'技术'或'管理':")
print(df[df['部门'].isin(['技术', '管理'])])

# 5. between筛选
print(f"\n5. between筛选:")
print(f"  年龄在25-30之间:")
print(df[df['年龄'].between(25, 30)])

# 6. 字符串筛选
print(f"\n6. 字符串筛选:")
print(f"  姓名包含'三'或'四':")
print(df[df['姓名'].str.contains('三|四')])

# 7. 使用loc进行条件筛选和列选择
print(f"\n7. loc条件筛选:")
print(df.loc[df['薪资'] > 15000, ['姓名', '部门', '薪资']])
```

### 6.2 数据采样

```python
# 示例：数据采样
import pandas as pd
import numpy as np

print("=" * 60)
print("数据采样")
print("=" * 60)

# 创建大数据集
np.random.seed(42)
df = pd.DataFrame({
    'ID': range(1, 1001),
    '类别': np.random.choice(['A', 'B', 'C', 'D'], 1000),
    '值': np.random.randn(1000) * 100 + 500
})

print(f"原始数据集: {len(df)} 行")

# 随机采样
print(f"\n1. 随机采样:")
sample = df.sample(n=10, random_state=42)
print(sample)

# 分层采样
print(f"\n2. 分层采样:")
stratified = df.groupby('类别', group_keys=False).apply(
    lambda x: x.sample(min(len(x), 3), random_state=42)
)
print(stratified)
print(f"  各类别采样数:")
print(stratified['类别'].value_counts())

# 按比例采样
print(f"\n3. 按比例采样:")
sample_frac = df.sample(frac=0.01, random_state=42)
print(f"  采样比例: 1%, 采样行数: {len(sample_frac)}")

# 前N行和后N行
print(f"\n4. 前N行和后N行:")
print(f"  前3行:")
print(df.head(3))
print(f"  后2行:")
print(df.tail(2))

# 获取第n行
print(f"\n5. 获取第n行:")
print(f"  第5行:")
print(df.iloc[4])
print(f"  第100行:")
print(df.iloc[99])
```

## 七、groupby分组聚合

### 7.1 基本分组聚合

`groupby`是Pandas中最强大的功能之一，它允许你按照一个或多个键对数据进行分组，然后对每个组应用聚合函数。

```python
# 示例：groupby分组聚合
import pandas as pd
import numpy as np

print("=" * 60)
print("groupby分组聚合")
print("=" * 60)

# 创建DataFrame
np.random.seed(42)
df = pd.DataFrame({
    '部门': np.random.choice(['技术', '市场', '销售', '管理'], 20),
    '城市': np.random.choice(['北京', '上海', '广州', '深圳'], 20),
    '员工': [f'员工{i}' for i in range(1, 21)],
    '薪资': np.random.randint(8000, 30000, 20),
    '绩效': np.random.uniform(60, 100, 20).round(1),
    '年龄': np.random.randint(22, 40, 20)
})

print("DataFrame:")
print(df)

# 基本分组聚合
print(f"\n1. 按部门分组:")
grouped = df.groupby('部门')
print(f"  平均薪资:")
print(grouped['薪资'].mean().round(2))
print(f"  最高绩效:")
print(grouped['绩效'].max())
print(f"  员工数量:")
print(grouped.size())

# 多个聚合函数
print(f"\n2. 多个聚合函数:")
print(grouped['薪资'].agg(['mean', 'median', 'min', 'max', 'std']).round(2))

# 对不同列应用不同聚合
print(f"\n3. 对不同列应用不同聚合:")
result = grouped.agg({
    '薪资': ['mean', 'max'],
    '绩效': ['mean', 'min'],
    '员工': 'count'
})
print(result)

# 多列分组
print(f"\n4. 多列分组:")
multi_grouped = df.groupby(['部门', '城市'])
print(f"  部门-城市 的平均薪资:")
print(multi_grouped['薪资'].mean().round(2))

# 自定义聚合函数
print(f"\n5. 自定义聚合函数:")
def salary_range(x):
    return x.max() - x.min()

print(grouped['薪资'].agg(['mean', salary_range]))
```

### 7.2 分组变换和过滤

```python
# 示例：分组变换和过滤
import pandas as pd
import numpy as np

print("=" * 60)
print("分组变换和过滤")
print("=" * 60)

# 创建DataFrame
np.random.seed(42)
df = pd.DataFrame({
    '部门': np.random.choice(['技术', '市场', '销售'], 15),
    '员工': [f'员工{i}' for i in range(1, 16)],
    '薪资': np.random.randint(8000, 30000, 15),
})

print("DataFrame:")
print(df)

# transform - 保持原始形状
print(f"\n1. transform:")
df['部门平均薪资'] = df.groupby('部门')['薪资'].transform('mean')
df['薪资与部门均值的差'] = df['薪资'] - df['部门平均薪资']
print(df)

# 标准化（Z-score）
df['薪资Z值'] = df.groupby('部门')['薪资'].transform(
    lambda x: (x - x.mean()) / x.std()
)
print(f"\n  标准化后:")
print(df[['员工', '部门', '薪资', '薪资Z值']])

# filter - 过滤分组
print(f"\n2. filter:")
# 只保留平均薪资大于15000的部门
filtered = df.groupby('部门').filter(lambda x: x['薪资'].mean() > 15000)
print(f"  原始部门: {df['部门'].unique()}")
print(f"  过滤后部门: {filtered['部门'].unique()}")

# apply - 对每个组应用函数
print(f"\n3. apply:")
def top_n_by_group(group, n=2):
    return group.nlargest(n, '薪资')

print(f"  每个部门薪资最高的2人:")
print(df.groupby('部门').apply(top_n_by_group, n=2))

# 累计统计
print(f"\n4. 累计统计:")
df_sorted = df.sort_values(['部门', '薪资'])
df_sorted['累计薪资'] = df_sorted.groupby('部门')['薪资'].cumsum()
print(df_sorted[['员工', '部门', '薪资', '累计薪资']])
```

## 总结

本章我们深入学习了Pandas的核心知识，涵盖了以下主要内容：

**Pandas简介**：Pandas是Python中最流行的数据分析库，提供了Series和DataFrame两种核心数据结构，支持高效的数据操作和分析。

**Series创建与操作**：Series是一维标记数组，可以从列表、字典、NumPy数组等创建。支持索引访问、切片、布尔索引、统计计算等操作。

**DataFrame创建与操作**：DataFrame是二维表格数据结构，是Pandas最核心的数据结构。支持多种创建方式，提供了loc/iloc索引、列操作、统计分析和排序等功能。

**数据读取**：Pandas支持从CSV、Excel、JSON等多种格式读取数据。`read_csv()`是最常用的函数，支持丰富的参数配置。

**数据清洗**：Pandas提供了完善的缺失值处理（`isnull`、`dropna`、`fillna`）、重复值处理（`duplicated`、`drop_duplicates`）和数据转换功能。

**数据筛选与过滤**：通过布尔索引、`query`方法、`isin`、`between`等多种方式灵活筛选数据，支持多条件组合。

**groupby分组聚合**：`groupby`是Pandas最强大的功能之一，支持分组聚合、变换（transform）、过滤（filter）和应用（apply）等操作，是数据分析的核心技能。

通过本章的学习，你应该已经掌握了Pandas的核心功能，能够使用Pandas进行高效的数据处理和分析。在下一章中，我们将学习Matplotlib，这是Python中最流行的数据可视化库。
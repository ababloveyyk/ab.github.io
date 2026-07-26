---
title: Python核心生态与落地Ⅲ——Matplotlib数据可视化
date: 2026-07-26
tags:
  - Python
  - Matplotlib
  - 数据可视化
  - 图表
categories:
  - Python
---

## 一、Matplotlib简介

### 1.1 什么是Matplotlib

Matplotlib是Python中最流行的数据可视化库，它提供了丰富的绘图功能，可以创建出版质量级别的图表。Matplotlib的设计灵感来自MATLAB的绘图系统，但它完全使用Python实现，并且是免费开源的。

Matplotlib的核心优势包括：

**丰富的图表类型**：支持折线图、柱状图、散点图、饼图、直方图、箱线图、热力图、等高线图等几乎所有常见的图表类型。

**高度可定制**：图表的每个元素（标题、坐标轴、图例、颜色、字体等）都可以精细控制，满足各种定制需求。

**多种输出格式**：支持PNG、PDF、SVG、EPS等多种输出格式，适合不同场景使用。

**与NumPy和Pandas集成**：Matplotlib与NumPy和Pandas无缝集成，可以直接从这些数据结构中绘制图表。

**交互式支持**：支持交互式绘图，可以缩放、平移和保存图表。

```python
# 示例：Matplotlib简介
import matplotlib
print("=" * 60)
print("Matplotlib简介")
print("=" * 60)

print(f"Matplotlib版本: {matplotlib.__version__}")
print(f"Matplotlib后端: {matplotlib.get_backend()}")

# 基本绘图示例
import matplotlib.pyplot as plt
import numpy as np

# 创建简单的折线图
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 4))
plt.plot(x, y, label='sin(x)', color='blue', linewidth=2)
plt.title('简单折线图示例')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('d:/my-vuepress-blog/docs/notes/sample_plot.png', dpi=100, bbox_inches='tight')
plt.close()
print("示例图表已保存")

# 显示Matplotlib的架构
print("\nMatplotlib架构:")
print("  pyplot: 提供类似MATLAB的绘图接口")
print("  Figure: 顶层容器，包含所有绘图元素")
print("  Axes: 实际的绘图区域")
print("  Axis: 坐标轴对象")
print("  Artist: 所有可见元素的基类")
```

### 1.2 Matplotlib的两种绘图方式

Matplotlib提供了两种主要的绘图方式：pyplot函数式接口和面向对象接口。

```python
# 示例：两种绘图方式
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("两种绘图方式")
print("=" * 60)

# 准备数据
x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# 方式一：pyplot函数式接口（类似MATLAB）
print("1. pyplot函数式接口:")
plt.figure(figsize=(10, 4))
plt.plot(x, y1, 'b-', label='sin(x)')
plt.plot(x, y2, 'r--', label='cos(x)')
plt.title('三角函数 - pyplot接口')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig('d:/my-vuepress-blog/docs/notes/plot_pyplot.png', dpi=100)
plt.close()

# 方式二：面向对象接口（推荐）
print("2. 面向对象接口:")
fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(x, y1, 'b-', label='sin(x)')
ax.plot(x, y2, 'r--', label='cos(x)')
ax.set_title('三角函数 - 面向对象接口')
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.legend()
ax.grid(True)
fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/plot_oo.png', dpi=100)
plt.close()

print("两种方式都创建了相同的图表。")
print("面向对象接口更灵活，推荐在复杂图表中使用。")
```

## 二、基本图表类型

### 2.1 折线图

折线图是最基本的图表类型，用于展示数据随时间或其他连续变量的变化趋势。

```python
# 示例：折线图
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("折线图")
print("=" * 60)

# 准备数据
months = ['1月', '2月', '3月', '4月', '5月', '6月', 
          '7月', '8月', '9月', '10月', '11月', '12月']

np.random.seed(42)
sales_product_a = np.random.randint(100, 300, 12)
sales_product_b = np.random.randint(80, 250, 12)
sales_product_c = np.random.randint(50, 200, 12)

# 创建折线图
fig, ax = plt.subplots(figsize=(12, 6))

ax.plot(months, sales_product_a, 'o-', color='#2196F3', linewidth=2, 
        markersize=6, label='产品A')
ax.plot(months, sales_product_b, 's--', color='#4CAF50', linewidth=2, 
        markersize=6, label='产品B')
ax.plot(months, sales_product_c, '^-.', color='#FF9800', linewidth=2, 
        markersize=6, label='产品C')

# 添加数据标签
for i, (a, b, c) in enumerate(zip(sales_product_a, sales_product_b, sales_product_c)):
    ax.annotate(str(a), (months[i], a), textcoords="offset points", 
                xytext=(0, 10), ha='center', fontsize=8, color='#2196F3')
    ax.annotate(str(b), (months[i], b), textcoords="offset points", 
                xytext=(0, -15), ha='center', fontsize=8, color='#4CAF50')

ax.set_title('2026年各产品月度销售趋势', fontsize=16, fontweight='bold', pad=15)
ax.set_xlabel('月份', fontsize=12)
ax.set_ylabel('销售额 (万元)', fontsize=12)
ax.legend(loc='upper left', fontsize=10)
ax.grid(True, alpha=0.3, linestyle='--')
ax.set_ylim(0, 350)

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/line_chart.png', dpi=150, bbox_inches='tight')
plt.close()
print("折线图已保存")
```

### 2.2 柱状图

柱状图用于比较不同类别之间的数值大小，是数据可视化中最常用的图表类型之一。

```python
# 示例：柱状图
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("柱状图")
print("=" * 60)

# 准备数据
categories = ['技术部', '市场部', '销售部', '人事部', '财务部', '运营部']
employees = [45, 30, 50, 12, 8, 20]
budget = [120, 80, 95, 40, 35, 55]

# 创建分组柱状图
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# 垂直柱状图
x_pos = np.arange(len(categories))
bars = ax1.bar(x_pos, employees, color=['#2196F3', '#4CAF50', '#FF9800', 
                                         '#9C27B0', '#F44336', '#00BCD4'],
               edgecolor='white', linewidth=1.5)

ax1.set_title('各部门员工数量', fontsize=14, fontweight='bold')
ax1.set_xlabel('部门', fontsize=12)
ax1.set_ylabel('员工数量', fontsize=12)
ax1.set_xticks(x_pos)
ax1.set_xticklabels(categories, rotation=45, ha='right')

# 添加数值标签
for bar in bars:
    height = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2., height + 0.5,
             f'{int(height)}', ha='center', va='bottom', fontsize=10)

# 水平柱状图
ax2.barh(categories, budget, color=['#2196F3', '#4CAF50', '#FF9800',
                                     '#9C27B0', '#F44336', '#00BCD4'],
         edgecolor='white', linewidth=1.5)

ax2.set_title('各部门预算 (万元)', fontsize=14, fontweight='bold')
ax2.set_xlabel('预算 (万元)', fontsize=12)

# 添加数值标签
for i, v in enumerate(budget):
    ax2.text(v + 1, i, str(v), va='center', fontsize=10)

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/bar_chart.png', dpi=150, bbox_inches='tight')
plt.close()
print("柱状图已保存")
```

### 2.3 散点图

散点图用于展示两个变量之间的关系，可以揭示数据中的相关性、聚类和异常值。

```python
# 示例：散点图
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("散点图")
print("=" * 60)

# 生成数据
np.random.seed(42)
n = 100

# 三组数据
x1 = np.random.normal(5, 1.5, n)
y1 = np.random.normal(5, 1.5, n)

x2 = np.random.normal(8, 1, n)
y2 = np.random.normal(3, 1, n)

x3 = np.random.normal(3, 1, n)
y3 = np.random.normal(8, 1, n)

# 创建散点图
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# 基本散点图
ax1.scatter(x1, y1, c='#2196F3', s=50, alpha=0.6, label='类别A', edgecolors='white', linewidth=0.5)
ax1.scatter(x2, y2, c='#4CAF50', s=50, alpha=0.6, label='类别B', edgecolors='white', linewidth=0.5)
ax1.scatter(x3, y3, c='#FF9800', s=50, alpha=0.6, label='类别C', edgecolors='white', linewidth=0.5)

ax1.set_title('基本散点图', fontsize=14, fontweight='bold')
ax1.set_xlabel('变量 X')
ax1.set_ylabel('变量 Y')
ax1.legend()
ax1.grid(True, alpha=0.3)

# 气泡图（点的大小表示第三个维度）
sizes = np.random.randint(20, 200, n)
colors = np.random.rand(n)
ax2.scatter(x1, y1, s=sizes, c=colors, alpha=0.6, cmap='viridis', 
            edgecolors='white', linewidth=0.5)

ax2.set_title('气泡图 (大小代表第三维度)', fontsize=14, fontweight='bold')
ax2.set_xlabel('变量 X')
ax2.set_ylabel('变量 Y')

# 添加颜色条
cbar = plt.colorbar(ax2.collections[0], ax=ax2)
cbar.set_label('颜色维度')

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/scatter_chart.png', dpi=150, bbox_inches='tight')
plt.close()
print("散点图已保存")
```

### 2.4 饼图、直方图和箱线图

```python
# 示例：饼图、直方图和箱线图
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("饼图、直方图和箱线图")
print("=" * 60)

# 创建1行3列的子图
fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(18, 5))

# 1. 饼图
labels = ['技术', '市场', '销售', '管理', '其他']
sizes = [35, 25, 20, 12, 8]
colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336']
explode = (0.05, 0, 0, 0, 0)  # 突出显示第一个扇区

wedges, texts, autotexts = ax1.pie(
    sizes, explode=explode, labels=labels, colors=colors,
    autopct='%1.1f%%', shadow=True, startangle=90,
    textprops={'fontsize': 10}
)

# 设置百分比文字样式
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('bold')

ax1.set_title('部门人员分布', fontsize=14, fontweight='bold')

# 2. 直方图
np.random.seed(42)
data = np.random.normal(70, 15, 500)  # 模拟考试成绩
data = np.clip(data, 0, 100)

ax2.hist(data, bins=20, color='#2196F3', edgecolor='white', alpha=0.8,
         density=True, label='成绩分布')

# 添加正态分布曲线
from scipy import stats
x = np.linspace(0, 100, 100)
pdf = stats.norm.pdf(x, 70, 15)
ax2.plot(x, pdf, 'r-', linewidth=2, label='正态分布拟合')

ax2.set_title('成绩分布直方图', fontsize=14, fontweight='bold')
ax2.set_xlabel('成绩')
ax2.set_ylabel('频率密度')
ax2.legend()
ax2.grid(True, alpha=0.3)

# 3. 箱线图
np.random.seed(42)
data_box = [
    np.random.normal(75, 10, 100),   # 数学
    np.random.normal(70, 15, 100),   # 英语
    np.random.normal(80, 8, 100),    # 语文
    np.random.normal(65, 18, 100),   # 物理
    np.random.normal(72, 12, 100),   # 化学
]

bp = ax3.boxplot(data_box, labels=['数学', '英语', '语文', '物理', '化学'],
                 patch_artist=True, showmeans=True)

# 设置箱线图颜色
colors_box = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336']
for patch, color in zip(bp['boxes'], colors_box):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

ax3.set_title('各科成绩箱线图', fontsize=14, fontweight='bold')
ax3.set_ylabel('成绩')
ax3.grid(True, alpha=0.3, axis='y')

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/pie_hist_box.png', dpi=150, bbox_inches='tight')
plt.close()
print("饼图、直方图和箱线图已保存")
```

## 三、子图布局

### 3.1 使用subplots创建子图

`plt.subplots()`是创建子图的最常用方法，它返回一个Figure对象和一个Axes对象数组。

```python
# 示例：子图布局
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("子图布局")
print("=" * 60)

# 准备数据
x = np.linspace(0, 2*np.pi, 100)

# 创建2x2子图布局
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 子图1: sin(x)
axes[0, 0].plot(x, np.sin(x), 'b-', linewidth=2)
axes[0, 0].set_title('sin(x)', fontsize=12, fontweight='bold')
axes[0, 0].set_xlabel('x')
axes[0, 0].set_ylabel('sin(x)')
axes[0, 0].grid(True, alpha=0.3)
axes[0, 0].axhline(y=0, color='k', linewidth=0.5)
axes[0, 0].axvline(x=0, color='k', linewidth=0.5)

# 子图2: cos(x)
axes[0, 1].plot(x, np.cos(x), 'r-', linewidth=2)
axes[0, 1].set_title('cos(x)', fontsize=12, fontweight='bold')
axes[0, 1].set_xlabel('x')
axes[0, 1].set_ylabel('cos(x)')
axes[0, 1].grid(True, alpha=0.3)
axes[0, 1].axhline(y=0, color='k', linewidth=0.5)
axes[0, 1].axvline(x=0, color='k', linewidth=0.5)

# 子图3: tan(x)
axes[1, 0].plot(x, np.tan(x), 'g-', linewidth=2)
axes[1, 0].set_title('tan(x)', fontsize=12, fontweight='bold')
axes[1, 0].set_xlabel('x')
axes[1, 0].set_ylabel('tan(x)')
axes[1, 0].grid(True, alpha=0.3)
axes[1, 0].set_ylim(-5, 5)

# 子图4: 所有三角函数叠加
axes[1, 1].plot(x, np.sin(x), 'b-', linewidth=1.5, label='sin(x)')
axes[1, 1].plot(x, np.cos(x), 'r-', linewidth=1.5, label='cos(x)')
axes[1, 1].plot(x, np.tan(x), 'g-', linewidth=1.5, label='tan(x)')
axes[1, 1].set_title('所有三角函数', fontsize=12, fontweight='bold')
axes[1, 1].set_xlabel('x')
axes[1, 1].set_ylabel('y')
axes[1, 1].legend(fontsize=8)
axes[1, 1].grid(True, alpha=0.3)
axes[1, 1].set_ylim(-3, 3)

# 添加总标题
fig.suptitle('三角函数可视化', fontsize=16, fontweight='bold', y=1.02)

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/subplots.png', dpi=150, bbox_inches='tight')
plt.close()
print("子图布局已保存")
```

### 3.2 复杂布局和GridSpec

```python
# 示例：复杂布局
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np

print("=" * 60)
print("复杂布局 - GridSpec")
print("=" * 60)

# 使用GridSpec创建复杂布局
fig = plt.figure(figsize=(14, 8))
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.3, wspace=0.3)

# 大图占据第一行
ax1 = fig.add_subplot(gs[0, :])
x = np.linspace(0, 10, 200)
for i, freq in enumerate([1, 2, 3]):
    ax1.plot(x, np.sin(freq * x), label=f'频率={freq}', linewidth=1.5)
ax1.set_title('多频率正弦波叠加', fontsize=12, fontweight='bold')
ax1.legend(loc='upper right')
ax1.grid(True, alpha=0.3)

# 中间三个小图
ax2 = fig.add_subplot(gs[1, 0])
ax2.scatter(np.random.randn(50), np.random.randn(50), c='#2196F3', alpha=0.6)
ax2.set_title('散点图A', fontsize=10)
ax2.grid(True, alpha=0.3)

ax3 = fig.add_subplot(gs[1, 1])
ax3.scatter(np.random.randn(50), np.random.randn(50), c='#4CAF50', alpha=0.6)
ax3.set_title('散点图B', fontsize=10)
ax3.grid(True, alpha=0.3)

ax4 = fig.add_subplot(gs[1, 2])
ax4.scatter(np.random.randn(50), np.random.randn(50), c='#FF9800', alpha=0.6)
ax4.set_title('散点图C', fontsize=10)
ax4.grid(True, alpha=0.3)

# 底部两个中等图
ax5 = fig.add_subplot(gs[2, :2])
data = np.random.normal(0, 1, 1000)
ax5.hist(data, bins=30, color='#9C27B0', edgecolor='white', alpha=0.8)
ax5.set_title('正态分布直方图', fontsize=12, fontweight='bold')
ax5.grid(True, alpha=0.3, axis='y')

ax6 = fig.add_subplot(gs[2, 2])
categories = ['A', 'B', 'C', 'D']
values = [30, 25, 20, 25]
ax6.pie(values, labels=categories, autopct='%1.1f%%', 
        colors=['#2196F3', '#4CAF50', '#FF9800', '#9C27B0'])
ax6.set_title('饼图', fontsize=10)

fig.suptitle('复杂布局示例', fontsize=16, fontweight='bold')
fig.savefig('d:/my-vuepress-blog/docs/notes/complex_layout.png', dpi=150, bbox_inches='tight')
plt.close()
print("复杂布局图表已保存")
```

## 四、图表样式与颜色

### 4.1 颜色和样式设置

```python
# 示例：图表样式与颜色
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("图表样式与颜色")
print("=" * 60)

# 查看可用样式
print("可用样式:")
styles = plt.style.available
for i, style in enumerate(styles[:10], 1):
    print(f"  {i}. {style}")
print(f"  ... 共 {len(styles)} 种样式")

# 使用不同样式
x = np.linspace(0, 10, 100)
styles_to_show = ['default', 'ggplot', 'seaborn-v0_8-darkgrid', 'fivethirtyeight']

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

for ax, style in zip(axes.flatten(), styles_to_show):
    with plt.style.context(style):
        ax.plot(x, np.sin(x), 'b-', linewidth=2, label='sin(x)')
        ax.plot(x, np.cos(x), 'r--', linewidth=2, label='cos(x)')
        ax.set_title(f'样式: {style}', fontsize=12)
        ax.legend(fontsize=8)
        ax.grid(True, alpha=0.3)

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/styles.png', dpi=150, bbox_inches='tight')
plt.close()

# 自定义颜色
print("\n自定义颜色方案:")
print("""
颜色格式:
  - 颜色名称: 'red', 'blue', 'green'
  - 十六进制: '#FF5733'
  - RGB元组: (0.2, 0.4, 0.6)
  - 灰度: '0.5' (0=黑, 1=白)
  - 颜色映射: 'viridis', 'plasma', 'inferno', 'magma'
""")

# 颜色映射示例
fig, axes = plt.subplots(1, 4, figsize=(16, 4))

cmaps = ['viridis', 'plasma', 'inferno', 'magma']
for ax, cmap in zip(axes, cmaps):
    data = np.random.rand(10, 10)
    im = ax.imshow(data, cmap=cmap)
    ax.set_title(f'cmap: {cmap}')
    plt.colorbar(im, ax=ax)

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/colormaps.png', dpi=150, bbox_inches='tight')
plt.close()
print("颜色样式图表已保存")
```

### 4.2 中文显示问题解决

```python
# 示例：中文显示问题解决
import matplotlib.pyplot as plt
import numpy as np

print("=" * 60)
print("中文显示问题解决")
print("=" * 60)

# 检查系统中文字体
import matplotlib.font_manager as fm
chinese_fonts = [f for f in fm.fontManager.ttflist 
                 if any(kw in f.name.lower() for kw in ['simhei', 'simsun', 'microsoft yahei', 'noto', 'wenquan', 'songti', 'heiti'])]

print("系统中文字体:")
for font in chinese_fonts:
    print(f"  {font.name} - {font.fname}")

# 方法一：设置全局字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'SimSun', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False  # 解决负号显示问题

# 方法二：使用fontproperties参数
# from matplotlib.font_manager import FontProperties
# font = FontProperties(fname='path/to/font.ttf')

# 创建中文图表
fig, ax = plt.subplots(figsize=(10, 6))

months = ['一月', '二月', '三月', '四月', '五月', '六月']
revenue = [120, 150, 135, 180, 200, 165]
expenses = [80, 90, 85, 100, 110, 95]

ax.plot(months, revenue, 'o-', color='#2196F3', linewidth=2, markersize=8, label='收入')
ax.plot(months, expenses, 's-', color='#F44336', linewidth=2, markersize=8, label='支出')

# 填充区域
ax.fill_between(range(len(months)), revenue, expenses, 
                where=(np.array(revenue) > np.array(expenses)),
                color='green', alpha=0.2, label='盈利')
ax.fill_between(range(len(months)), revenue, expenses,
                where=(np.array(revenue) <= np.array(expenses)),
                color='red', alpha=0.2, label='亏损')

ax.set_title('2026年上半年收入支出趋势', fontsize=16, fontweight='bold', pad=15)
ax.set_xlabel('月份', fontsize=12)
ax.set_ylabel('金额 (万元)', fontsize=12)
ax.legend(fontsize=10, loc='upper left')
ax.grid(True, alpha=0.3, linestyle='--')

# 添加注释
for i, (r, e) in enumerate(zip(revenue, expenses)):
    profit = r - e
    ax.annotate(f'净利:{profit}万', (months[i], max(r, e)),
                textcoords="offset points", xytext=(0, 10),
                ha='center', fontsize=9)

fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/chinese_chart.png', dpi=150, bbox_inches='tight')
plt.close()
print("中文图表已保存")
```

## 五、从Pandas DataFrame直接绘图

### 5.1 DataFrame的plot方法

Pandas的DataFrame和Series对象内置了`plot()`方法，可以直接调用Matplotlib来创建图表，极大地简化了绘图流程。

```python
# 示例：从Pandas DataFrame直接绘图
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

print("=" * 60)
print("从Pandas DataFrame直接绘图")
print("=" * 60)

# 设置中文显示
plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# 创建DataFrame
np.random.seed(42)
dates = pd.date_range('2026-01-01', periods=12, freq='ME')
df = pd.DataFrame({
    '产品A': np.random.randint(100, 300, 12),
    '产品B': np.random.randint(80, 250, 12),
    '产品C': np.random.randint(50, 200, 12),
    '产品D': np.random.randint(30, 150, 12)
}, index=dates)

print("DataFrame:")
print(df.head())

# 1. 折线图
print("\n1. 折线图:")
fig, ax = plt.subplots(figsize=(12, 5))
df.plot(ax=ax, linewidth=2, marker='o', markersize=4)
ax.set_title('产品月度销售趋势', fontsize=14, fontweight='bold')
ax.set_xlabel('日期')
ax.set_ylabel('销售额')
ax.legend(loc='upper left')
ax.grid(True, alpha=0.3)
fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/df_line.png', dpi=150)
plt.close()

# 2. 柱状图
print("2. 柱状图:")
fig, ax = plt.subplots(figsize=(12, 5))
df.plot.bar(ax=ax, rot=45)
ax.set_title('产品月度销售对比', fontsize=14, fontweight='bold')
ax.set_xlabel('月份')
ax.set_ylabel('销售额')
ax.legend(loc='upper right')
fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/df_bar.png', dpi=150)
plt.close()

# 3. 堆叠面积图
print("3. 堆叠面积图:")
fig, ax = plt.subplots(figsize=(12, 5))
df.plot.area(ax=ax, alpha=0.7, stacked=True)
ax.set_title('产品销售额堆叠面积图', fontsize=14, fontweight='bold')
ax.set_xlabel('日期')
ax.set_ylabel('累计销售额')
ax.legend(loc='upper left')
fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/df_area.png', dpi=150)
plt.close()

# 4. 箱线图
print("4. 箱线图:")
fig, ax = plt.subplots(figsize=(10, 5))
df.plot.box(ax=ax)
ax.set_title('产品销售额分布', fontsize=14, fontweight='bold')
ax.set_ylabel('销售额')
ax.grid(True, alpha=0.3, axis='y')
fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/df_box.png', dpi=150)
plt.close()

# 5. 直方图
print("5. 直方图:")
fig, ax = plt.subplots(figsize=(10, 5))
df.plot.hist(ax=ax, alpha=0.7, bins=10)
ax.set_title('产品销售额分布直方图', fontsize=14, fontweight='bold')
ax.set_xlabel('销售额')
ax.legend()
fig.tight_layout()
fig.savefig('d:/my-vuepress-blog/docs/notes/df_hist.png', dpi=150)
plt.close()

print("Pandas DataFrame绘图系列已保存")
```

### 5.2 综合数据可视化仪表板

```python
# 示例：综合数据可视化仪表板
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

print("=" * 60)
print("综合数据可视化仪表板")
print("=" * 60)

# 设置中文
plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# 创建综合数据集
np.random.seed(42)
dates = pd.date_range('2026-01-01', periods=30, freq='D')
df = pd.DataFrame({
    '日期': dates,
    '销售额': np.random.normal(5000, 1000, 30).cumsum() / 5 + 5000,
    '访问量': np.random.randint(800, 2000, 30),
    '转化率': np.random.uniform(2, 8, 30),
    '客单价': np.random.uniform(200, 500, 30),
    '新用户': np.random.randint(50, 200, 30),
    '老用户': np.random.randint(100, 400, 30),
    '投诉数': np.random.poisson(5, 30),
})

df['总收入'] = df['销售额']
df['总用户'] = df['新用户'] + df['老用户']
df['7日平均销售额'] = df['销售额'].rolling(7).mean()

print("数据集:")
print(df.head())

# 创建仪表板
fig = plt.figure(figsize=(18, 12))
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.35, wspace=0.3)

# 图表1: 销售额趋势
ax1 = fig.add_subplot(gs[0, :])
ax1.plot(df['日期'], df['销售额'], 'b-', linewidth=2, label='日销售额', alpha=0.7)
ax1.plot(df['日期'], df['7日平均销售额'], 'r-', linewidth=2.5, label='7日移动平均')
ax1.fill_between(df['日期'], df['销售额'], df['7日平均销售额'],
                 alpha=0.2, color='blue')
ax1.set_title('销售额趋势 (30天)', fontsize=14, fontweight='bold')
ax1.legend(loc='upper left')
ax1.grid(True, alpha=0.3)
ax1.tick_params(axis='x', rotation=45)

# 图表2: 用户构成
ax2 = fig.add_subplot(gs[1, 0])
ax2.stackplot(df['日期'], df['新用户'], df['老用户'],
              labels=['新用户', '老用户'], colors=['#2196F3', '#4CAF50'], alpha=0.7)
ax2.set_title('用户构成', fontsize=12, fontweight='bold')
ax2.legend(loc='upper left', fontsize=8)
ax2.tick_params(axis='x', rotation=45)

# 图表3: 转化率分布
ax3 = fig.add_subplot(gs[1, 1])
ax3.hist(df['转化率'], bins=15, color='#FF9800', edgecolor='white', alpha=0.8)
ax3.axvline(df['转化率'].mean(), color='red', linestyle='--', linewidth=2, 
            label=f'均值: {df["转化率"].mean():.1f}%')
ax3.set_title('转化率分布', fontsize=12, fontweight='bold')
ax3.legend(fontsize=8)
ax3.grid(True, alpha=0.3, axis='y')

# 图表4: 投诉数
ax4 = fig.add_subplot(gs[1, 2])
ax4.bar(df['日期'], df['投诉数'], color='#F44336', alpha=0.7, width=0.8)
ax4.axhline(df['投诉数'].mean(), color='blue', linestyle='--', linewidth=1.5,
            label=f'均值: {df["投诉数"].mean():.1f}')
ax4.set_title('每日投诉数', fontsize=12, fontweight='bold')
ax4.legend(fontsize=8)
ax4.tick_params(axis='x', rotation=45)

# 图表5: 销售额与访问量关系
ax5 = fig.add_subplot(gs[2, 0])
scatter = ax5.scatter(df['访问量'], df['销售额'], c=df['转化率'], 
                      s=df['客单价']/5, cmap='viridis', alpha=0.6, 
                      edgecolors='white', linewidth=0.5)
ax5.set_title('销售额 vs 访问量', fontsize=12, fontweight='bold')
ax5.set_xlabel('访问量')
ax5.set_ylabel('销售额')
cbar = plt.colorbar(scatter, ax=ax5)
cbar.set_label('转化率(%)')

# 图表6: 关键指标汇总
ax6 = fig.add_subplot(gs[2, 1])
metrics = {
    '日均销售额': f"¥{df['销售额'].mean():.0f}",
    '日均访问量': f"{df['访问量'].mean():.0f}",
    '平均转化率': f"{df['转化率'].mean():.1f}%",
    '平均客单价': f"¥{df['客单价'].mean():.0f}",
    '总用户数': f"{df['总用户'].sum()}",
    '总投诉数': f"{df['投诉数'].sum()}",
}

ax6.axis('off')
y_pos = 0.9
for key, value in metrics.items():
    ax6.text(0.1, y_pos, f"{key}:", fontsize=11, fontweight='bold', 
             transform=ax6.transAxes)
    ax6.text(0.55, y_pos, value, fontsize=11, color='#2196F3', 
             fontweight='bold', transform=ax6.transAxes)
    y_pos -= 0.14

ax6.set_title('关键指标汇总', fontsize=12, fontweight='bold', y=1.02)

# 图表7: 星期分布
ax7 = fig.add_subplot(gs[2, 2])
df['星期'] = df['日期'].dt.day_name()
weekday_map = {'Monday': '周一', 'Tuesday': '周二', 'Wednesday': '周三',
               'Thursday': '周四', 'Friday': '周五', 'Saturday': '周六', 'Sunday': '周日'}
df['星期_中文'] = df['星期'].map(weekday_map)
weekly_sales = df.groupby('星期_中文')['销售额'].mean()
weekly_sales = weekly_sales.reindex(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
ax7.bar(range(7), weekly_sales.values, color='#9C27B0', alpha=0.7)
ax7.set_xticks(range(7))
ax7.set_xticklabels(weekly_sales.index, rotation=45)
ax7.set_title('各星期平均销售额', fontsize=12, fontweight='bold')
ax7.grid(True, alpha=0.3, axis='y')

# 总标题
fig.suptitle('电商运营数据仪表板', fontsize=18, fontweight='bold', y=1.01)

fig.savefig('d:/my-vuepress-blog/docs/notes/dashboard.png', dpi=150, bbox_inches='tight')
plt.close()
print("综合仪表板已保存")
```

## 总结

本章我们深入学习了Matplotlib数据可视化的核心知识，涵盖了以下主要内容：

**Matplotlib简介**：Matplotlib是Python最流行的数据可视化库，提供了丰富的图表类型和高度可定制的绘图功能。支持pyplot函数式接口和面向对象接口两种绘图方式。

**基本图表类型**：折线图用于展示趋势变化，柱状图用于类别比较，散点图用于展示变量关系，饼图用于显示比例，直方图用于分布展示，箱线图用于统计摘要。

**子图布局**：`plt.subplots()`是创建子图的标准方法，`GridSpec`可以创建更复杂的布局。通过合理使用子图，可以在一张图中展示多个相关的图表。

**图表样式与颜色**：Matplotlib支持多种内置样式和颜色方案，可以通过`plt.style.use()`切换样式。中文显示需要设置合适的字体和负号显示参数。

**从Pandas DataFrame直接绘图**：Pandas的`plot()`方法极大地简化了从数据到图表的流程，支持折线图、柱状图、面积图、箱线图、直方图等多种图表类型。

通过本章的学习，你应该已经掌握了Matplotlib的核心功能，能够创建各种类型的可视化图表。在下一章中，我们将学习Python爬虫技术，从互联网上获取数据进行分析。
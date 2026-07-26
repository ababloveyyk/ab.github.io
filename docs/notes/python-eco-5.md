---
title: Python核心生态与落地Ⅴ——数据分析综合实战
date: 2026-07-26
tags:
  - Python
  - 数据分析
  - Flask
  - 综合实战
  - 数据可视化
categories:
  - Python
---

## 一、项目概述

### 1.1 项目背景

本章我们将综合运用前面学到的所有知识——数据采集、NumPy数值计算、Pandas数据处理、Matplotlib数据可视化，以及异常处理、日志记录等技术——构建一个完整的电商数据分析项目。

项目目标：
- 从公开API爬取电商销售数据
- 使用Pandas进行数据清洗和处理
- 使用Matplotlib创建可视化分析报告
- 将分析结果导出为Excel和CSV
- 使用Flask搭建简单的Web API返回分析结果

### 1.2 项目架构

```
电商数据分析项目
├── data_collector.py       # 数据采集模块
├── data_processor.py       # 数据处理模块
├── data_visualizer.py      # 数据可视化模块
├── report_generator.py     # 报告生成模块
├── web_api.py              # Flask Web API
├── config.py               # 配置文件
└── outputs/                # 输出目录
    ├── data/               # 数据文件
    ├── charts/             # 图表文件
    └── reports/            # 报告文件
```

## 二、数据采集模块

### 2.1 模拟数据生成

由于实际API可能不可用，我们先创建一个模拟数据生成器来生成电商销售数据。

```python
# 文件：data_collector.py
"""
电商数据采集模块

此模块负责采集和生成电商销售数据。
支持从API获取数据和生成模拟数据两种模式。
"""

import json
import time
import random
import requests
from datetime import datetime, timedelta
import pandas as pd
import numpy as np


class EcommerceDataCollector:
    """电商数据采集器"""
    
    def __init__(self, use_mock=True):
        self.use_mock = use_mock
        self.collected_data = []
        self.logger = self._setup_logger()
    
    def _setup_logger(self):
        """设置日志"""
        import logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            datefmt='%H:%M:%S'
        )
        return logging.getLogger('DataCollector')
    
    def generate_mock_data(self, num_records=500):
        """生成模拟电商数据
        
        参数:
            num_records: 生成的记录数量
            
        返回:
            DataFrame: 包含模拟数据的DataFrame
        """
        self.logger.info(f"生成 {num_records} 条模拟数据...")
        
        np.random.seed(42)
        random.seed(42)
        
        # 生成日期范围
        start_date = datetime(2026, 1, 1)
        end_date = datetime(2026, 7, 26)
        date_range = pd.date_range(start_date, end_date, freq='D')
        
        # 产品类别
        categories = ['电子产品', '服装', '食品', '家居用品', '图书', '运动户外', '美妆护肤']
        
        # 产品列表
        products = {
            '电子产品': ['智能手机', '笔记本电脑', '平板电脑', '无线耳机', '智能手表'],
            '服装': ['T恤', '牛仔裤', '连衣裙', '运动鞋', '羽绒服'],
            '食品': ['坚果礼盒', '有机大米', '进口牛奶', '巧克力', '茶叶'],
            '家居用品': ['床品四件套', '收纳盒', '台灯', '地毯', '窗帘'],
            '图书': ['Python编程', '数据科学', '机器学习', '小说', '经管书籍'],
            '运动户外': ['瑜伽垫', '跑步鞋', '帐篷', '登山包', '运动水壶'],
            '美妆护肤': ['面霜', '口红', '防晒霜', '洗面奶', '精华液'],
        }
        
        # 城市
        cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '重庆']
        
        # 生成数据
        records = []
        for i in range(num_records):
            # 随机选择属性
            category = random.choice(categories)
            product = random.choice(products[category])
            city = random.choice(cities)
            order_date = random.choice(date_range)
            
            # 生成销售数据
            quantity = np.random.poisson(3) + 1  # 购买数量
            unit_price = self._generate_price(category)  # 单价
            discount = random.choice([0, 0.05, 0.1, 0.15, 0.2, 0.3])  # 折扣
            total_amount = quantity * unit_price * (1 - discount)
            
            # 客户信息
            is_member = random.random() < 0.6  # 60%是会员
            age_group = random.choice(['18-25', '26-35', '36-45', '46-55', '55+'])
            gender = random.choice(['男', '女'])
            payment_method = random.choice(['微信支付', '支付宝', '银行卡', '货到付款'])
            
            record = {
                '订单ID': f'ORD{i+1:06d}',
                '订单日期': order_date,
                '产品类别': category,
                '产品名称': product,
                '城市': city,
                '购买数量': quantity,
                '单价': round(unit_price, 2),
                '折扣': discount,
                '实付金额': round(total_amount, 2),
                '是否会员': is_member,
                '年龄段': age_group,
                '性别': gender,
                '支付方式': payment_method,
            }
            records.append(record)
        
        df = pd.DataFrame(records)
        self.collected_data = df
        self.logger.info(f"数据生成完成，共 {len(df)} 条记录")
        return df
    
    def _generate_price(self, category):
        """根据类别生成合理的价格"""
        price_ranges = {
            '电子产品': (99, 9999),
            '服装': (29, 999),
            '食品': (9, 299),
            '家居用品': (19, 1999),
            '图书': (19, 199),
            '运动户外': (39, 1999),
            '美妆护肤': (29, 899),
        }
        low, high = price_ranges.get(category, (10, 1000))
        return np.random.uniform(low, high)
    
    def fetch_from_api(self, api_url, params=None):
        """从API获取数据"""
        self.logger.info(f"从API获取数据: {api_url}")
        
        try:
            response = requests.get(api_url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                # 如果数据在某个键下
                for key in ['data', 'results', 'records', 'items']:
                    if key in data and isinstance(data[key], list):
                        df = pd.DataFrame(data[key])
                        break
                else:
                    df = pd.DataFrame([data])
            
            self.collected_data = df
            self.logger.info(f"API数据获取成功，共 {len(df)} 条记录")
            return df
            
        except requests.RequestException as e:
            self.logger.error(f"API请求失败: {e}")
            raise
    
    def save_raw_data(self, filepath):
        """保存原始数据"""
        if self.collected_data is not None and len(self.collected_data) > 0:
            self.collected_data.to_csv(filepath, index=False, encoding='utf-8-sig')
            self.logger.info(f"原始数据已保存到: {filepath}")
        else:
            self.logger.warning("没有数据可保存")


# 测试数据采集
if __name__ == "__main__":
    collector = EcommerceDataCollector(use_mock=True)
    df = collector.generate_mock_data(500)
    
    print("数据采集结果:")
    print(f"  记录数: {len(df)}")
    print(f"  列名: {df.columns.tolist()}")
    print(f"\n前5条数据:")
    print(df.head())
    print(f"\n数据类型:")
    print(df.dtypes)
    print(f"\n基本统计:")
    print(df.describe())
```

## 三、数据处理模块

### 3.1 数据清洗与转换

```python
# 文件：data_processor.py
"""
数据处理模块

此模块负责数据清洗、转换和特征工程。
包括缺失值处理、异常值检测、数据转换和聚合分析。
"""

import pandas as pd
import numpy as np
from datetime import datetime


class DataProcessor:
    """数据处理器"""
    
    def __init__(self):
        self.raw_data = None
        self.cleaned_data = None
        self.logger = self._setup_logger()
    
    def _setup_logger(self):
        import logging
        logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s', datefmt='%H:%M:%S')
        return logging.getLogger('DataProcessor')
    
    def load_data(self, df):
        """加载数据"""
        self.raw_data = df.copy()
        self.logger.info(f"加载数据: {len(df)} 条记录")
        return self
    
    def clean_data(self):
        """数据清洗"""
        self.logger.info("开始数据清洗...")
        df = self.raw_data.copy()
        
        initial_count = len(df)
        
        # 1. 删除重复行
        df = df.drop_duplicates()
        self.logger.info(f"  删除重复行: {initial_count - len(df)} 条")
        
        # 2. 处理缺失值
        missing_before = df.isnull().sum().sum()
        if missing_before > 0:
            # 数值列用均值填充
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                if df[col].isnull().any():
                    df[col] = df[col].fillna(df[col].mean())
            
            # 分类列用众数填充
            categorical_cols = df.select_dtypes(include=['object']).columns
            for col in categorical_cols:
                if df[col].isnull().any():
                    df[col] = df[col].fillna(df[col].mode()[0] if len(df[col].mode()) > 0 else '未知')
            
            self.logger.info(f"  处理缺失值: {missing_before} 个")
        
        # 3. 处理异常值
        if '单价' in df.columns and '实付金额' in df.columns:
            # 使用IQR方法检测异常值
            for col in ['单价', '实付金额']:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
                df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
                self.logger.info(f"  删除 {col} 异常值: {len(outliers)} 条")
        
        # 4. 确保日期格式正确
        if '订单日期' in df.columns:
            df['订单日期'] = pd.to_datetime(df['订单日期'])
        
        # 5. 数据类型转换
        if '是否会员' in df.columns:
            df['是否会员'] = df['是否会员'].astype(bool)
        
        self.cleaned_data = df
        self.logger.info(f"数据清洗完成: {initial_count} -> {len(df)} 条记录")
        return df
    
    def add_features(self):
        """添加特征列"""
        self.logger.info("添加特征列...")
        df = self.cleaned_data.copy()
        
        # 提取时间特征
        if '订单日期' in df.columns:
            df['年份'] = df['订单日期'].dt.year
            df['月份'] = df['订单日期'].dt.month
            df['季度'] = df['订单日期'].dt.quarter
            df['星期'] = df['订单日期'].dt.dayofweek
            df['是否周末'] = df['星期'].isin([5, 6])
        
        # 计算利润（假设利润率30%）
        if '实付金额' in df.columns:
            df['成本'] = df['实付金额'] * 0.7
            df['利润'] = df['实付金额'] - df['成本']
        
        # 会员与非会员标记
        if '是否会员' in df.columns:
            df['会员类型'] = df['是否会员'].map({True: '会员', False: '非会员'})
        
        self.cleaned_data = df
        self.logger.info(f"特征添加完成，当前列数: {len(df.columns)}")
        return df
    
    def aggregate_analysis(self):
        """聚合分析"""
        df = self.cleaned_data
        results = {}
        
        # 1. 按产品类别统计
        category_stats = df.groupby('产品类别').agg({
            '订单ID': 'count',
            '实付金额': ['sum', 'mean', 'std'],
            '购买数量': 'sum',
        }).round(2)
        category_stats.columns = ['订单数', '总销售额', '平均客单价', '销售额标准差', '总销量']
        category_stats = category_stats.sort_values('总销售额', ascending=False)
        results['category_stats'] = category_stats
        
        # 2. 按城市统计
        city_stats = df.groupby('城市').agg({
            '订单ID': 'count',
            '实付金额': ['sum', 'mean'],
        }).round(2)
        city_stats.columns = ['订单数', '总销售额', '平均客单价']
        city_stats = city_stats.sort_values('总销售额', ascending=False)
        results['city_stats'] = city_stats
        
        # 3. 按月份统计
        monthly_stats = df.groupby('月份').agg({
            '订单ID': 'count',
            '实付金额': ['sum', 'mean'],
        }).round(2)
        monthly_stats.columns = ['订单数', '总销售额', '平均客单价']
        results['monthly_stats'] = monthly_stats
        
        # 4. 会员分析
        member_stats = df.groupby('会员类型').agg({
            '订单ID': 'count',
            '实付金额': ['sum', 'mean'],
        }).round(2)
        member_stats.columns = ['订单数', '总销售额', '平均客单价']
        results['member_stats'] = member_stats
        
        # 5. 支付方式统计
        payment_stats = df.groupby('支付方式').agg({
            '订单ID': 'count',
            '实付金额': 'sum',
        }).round(2)
        payment_stats.columns = ['订单数', '总销售额']
        payment_stats = payment_stats.sort_values('订单数', ascending=False)
        results['payment_stats'] = payment_stats
        
        self.logger.info("聚合分析完成")
        return results
    
    def get_summary_statistics(self):
        """获取描述性统计"""
        df = self.cleaned_data
        summary = {
            '总订单数': len(df),
            '总销售额': df['实付金额'].sum().round(2),
            '平均客单价': df['实付金额'].mean().round(2),
            '总销量': df['购买数量'].sum() if '购买数量' in df.columns else 0,
            '总利润': df['利润'].sum().round(2) if '利润' in df.columns else 0,
            '会员订单占比': (df['是否会员'].mean() * 100).round(1) if '是否会员' in df.columns else 0,
            '周末订单占比': (df['是否周末'].mean() * 100).round(1) if '是否周末' in df.columns else 0,
            '数据时间范围': f"{df['订单日期'].min().date()} 至 {df['订单日期'].max().date()}" if '订单日期' in df.columns else '',
        }
        return summary


# 测试数据处理
if __name__ == "__main__":
    from data_collector import EcommerceDataCollector
    
    # 采集数据
    collector = EcommerceDataCollector()
    raw_df = collector.generate_mock_data(500)
    
    # 处理数据
    processor = DataProcessor()
    processor.load_data(raw_df)
    df_clean = processor.clean_data()
    df_featured = processor.add_features()
    
    print("数据清洗结果:")
    print(f"  原始记录数: {len(raw_df)}")
    print(f"  清洗后记录数: {len(df_clean)}")
    print(f"  添加特征后列数: {len(df_featured.columns)}")
    
    # 聚合分析
    results = processor.aggregate_analysis()
    print("\n聚合分析结果:")
    print("\n按产品类别统计:")
    print(results['category_stats'])
    print(f"\n总览统计:")
    summary = processor.get_summary_statistics()
    for key, value in summary.items():
        print(f"  {key}: {value}")
```

## 四、数据可视化模块

### 4.1 可视化图表生成

```python
# 文件：data_visualizer.py
"""
数据可视化模块

此模块负责创建各种数据可视化图表。
使用Matplotlib创建出版质量级别的图表，支持中文显示。
"""

import matplotlib.pyplot as plt
import matplotlib
import numpy as np
import pandas as pd
import os

# 设置中文字体
matplotlib.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS']
matplotlib.rcParams['axes.unicode_minus'] = False


class DataVisualizer:
    """数据可视化器"""
    
    def __init__(self, output_dir='outputs/charts'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#FFEB3B']
    
    def plot_sales_by_category(self, category_stats, save=True):
        """产品类别销售额柱状图"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        # 销售额柱状图
        categories = category_stats.index.tolist()
        sales = category_stats['总销售额'].values
        bars = ax1.bar(range(len(categories)), sales, color=self.colors[:len(categories)], edgecolor='white')
        ax1.set_title('各产品类别销售额', fontsize=14, fontweight='bold')
        ax1.set_xticks(range(len(categories)))
        ax1.set_xticklabels(categories, rotation=45, ha='right')
        ax1.set_ylabel('销售额 (元)')
        ax1.grid(True, alpha=0.3, axis='y')
        
        for bar, val in zip(bars, sales):
            ax1.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 100,
                    f'{val:,.0f}', ha='center', va='bottom', fontsize=9)
        
        # 订单数饼图
        orders = category_stats['订单数'].values
        wedges, texts, autotexts = ax2.pie(
            orders, labels=categories, colors=self.colors[:len(categories)],
            autopct='%1.1f%%', startangle=90
        )
        for t in autotexts:
            t.set_color('white')
            t.set_fontweight('bold')
        ax2.set_title('各产品类别订单占比', fontsize=14, fontweight='bold')
        
        fig.tight_layout()
        if save:
            filepath = os.path.join(self.output_dir, 'sales_by_category.png')
            fig.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()
            return filepath
        return fig
    
    def plot_monthly_trend(self, monthly_stats, save=True):
        """月度销售趋势图"""
        fig, ax1 = plt.subplots(figsize=(12, 6))
        
        months = monthly_stats.index.tolist()
        sales = monthly_stats['总销售额'].values
        orders = monthly_stats['订单数'].values
        
        # 柱状图 - 销售额
        bars = ax1.bar(months, sales, color='#2196F3', alpha=0.7, label='销售额', edgecolor='white')
        ax1.set_xlabel('月份', fontsize=12)
        ax1.set_ylabel('销售额 (元)', fontsize=12, color='#2196F3')
        ax1.tick_params(axis='y', labelcolor='#2196F3')
        
        for bar, val in zip(bars, sales):
            ax1.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 200,
                    f'{val:,.0f}', ha='center', fontsize=8)
        
        # 折线图 - 订单数
        ax2 = ax1.twinx()
        ax2.plot(months, orders, 'o-', color='#FF9800', linewidth=2, markersize=8, label='订单数')
        ax2.set_ylabel('订单数', fontsize=12, color='#FF9800')
        ax2.tick_params(axis='y', labelcolor='#FF9800')
        
        for i, (m, o) in enumerate(zip(months, orders)):
            ax2.annotate(str(o), (m, o), textcoords="offset points", xytext=(0, 10),
                        ha='center', fontsize=9, color='#FF9800')
        
        # 添加趋势线
        z = np.polyfit(months, sales, 1)
        p = np.poly1d(z)
        ax1.plot(months, p(months), '--', color='red', linewidth=1.5, alpha=0.7, label='趋势线')
        
        ax1.set_title('月度销售趋势', fontsize=16, fontweight='bold', pad=15)
        ax1.set_xticks(months)
        ax1.set_xticklabels([f'{m}月' for m in months])
        ax1.grid(True, alpha=0.3)
        
        lines1, labels1 = ax1.get_legend_handles_labels()
        lines2, labels2 = ax2.get_legend_handles_labels()
        ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
        
        fig.tight_layout()
        if save:
            filepath = os.path.join(self.output_dir, 'monthly_trend.png')
            fig.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()
            return filepath
        return fig
    
    def plot_city_analysis(self, city_stats, save=True):
        """城市销售分析"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        top_n = min(10, len(city_stats))
        top_cities = city_stats.head(top_n)
        
        # 水平柱状图
        cities = top_cities.index.tolist()
        sales = top_cities['总销售额'].values
        colors = plt.cm.Blues(np.linspace(0.4, 0.9, len(cities)))
        
        ax1.barh(range(len(cities)), sales, color=colors, edgecolor='white')
        ax1.set_yticks(range(len(cities)))
        ax1.set_yticklabels(cities)
        ax1.set_xlabel('销售额 (元)')
        ax1.set_title('城市销售额排名', fontsize=14, fontweight='bold')
        ax1.grid(True, alpha=0.3, axis='x')
        
        for i, val in enumerate(sales):
            ax1.text(val + 500, i, f'{val:,.0f}', va='center', fontsize=9)
        
        # 平均客单价
        avg_prices = top_cities['平均客单价'].values
        ax2.bar(range(len(cities)), avg_prices, color=plt.cm.Oranges(np.linspace(0.4, 0.9, len(cities))), edgecolor='white')
        ax2.set_xticks(range(len(cities)))
        ax2.set_xticklabels(cities, rotation=45, ha='right')
        ax2.set_ylabel('平均客单价 (元)')
        ax2.set_title('城市平均客单价', fontsize=14, fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='y')
        
        for i, val in enumerate(avg_prices):
            ax2.text(i, val + 10, f'{val:,.0f}', ha='center', fontsize=9)
        
        fig.tight_layout()
        if save:
            filepath = os.path.join(self.output_dir, 'city_analysis.png')
            fig.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()
            return filepath
        return fig
    
    def create_dashboard(self, df, analysis_results, save=True):
        """创建综合仪表板"""
        fig = plt.figure(figsize=(20, 14))
        
        # 标题
        fig.suptitle('电商数据分析仪表板', fontsize=20, fontweight='bold', y=0.98)
        
        # 布局
        gs = fig.add_gridspec(3, 3, hspace=0.4, wspace=0.3)
        
        # 1. 月度销售趋势
        ax1 = fig.add_subplot(gs[0, :])
        monthly = analysis_results['monthly_stats']
        ax1.fill_between(monthly.index, monthly['总销售额'], alpha=0.3, color='#2196F3')
        ax1.plot(monthly.index, monthly['总销售额'], 'o-', color='#2196F3', linewidth=2, markersize=8)
        ax1.set_title('月度销售趋势', fontsize=14, fontweight='bold')
        ax1.set_ylabel('销售额 (元)')
        ax1.grid(True, alpha=0.3)
        
        # 2. 产品类别销售
        ax2 = fig.add_subplot(gs[1, 0])
        category = analysis_results['category_stats']
        ax2.bar(range(len(category)), category['总销售额'], color=self.colors[:len(category)], edgecolor='white')
        ax2.set_xticks(range(len(category)))
        ax2.set_xticklabels(category.index, rotation=45, ha='right', fontsize=8)
        ax2.set_title('产品类别销售额', fontsize=12, fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='y')
        
        # 3. 支付方式
        ax3 = fig.add_subplot(gs[1, 1])
        payment = analysis_results['payment_stats']
        ax3.pie(payment['订单数'], labels=payment.index, autopct='%1.1f%%',
                colors=self.colors[:len(payment)], startangle=90)
        ax3.set_title('支付方式分布', fontsize=12, fontweight='bold')
        
        # 4. 会员分析
        ax4 = fig.add_subplot(gs[1, 2])
        member = analysis_results['member_stats']
        ax4.bar(member.index, member['平均客单价'], color=['#2196F3', '#FF9800'], edgecolor='white')
        ax4.set_title('会员vs非会员客单价', fontsize=12, fontweight='bold')
        ax4.grid(True, alpha=0.3, axis='y')
        for i, (idx, row) in enumerate(member.iterrows()):
            ax4.text(i, row['平均客单价'] + 10, f'{row["平均客单价"]:,.0f}', ha='center', fontsize=10)
        
        # 5. 城市排名
        ax5 = fig.add_subplot(gs[2, :2])
        city = analysis_results['city_stats'].head(10)
        ax5.barh(range(len(city)), city['总销售额'], color=plt.cm.Blues(np.linspace(0.4, 0.9, len(city))), edgecolor='white')
        ax5.set_yticks(range(len(city)))
        ax5.set_yticklabels(city.index)
        ax5.set_title('城市销售额排名 (Top 10)', fontsize=12, fontweight='bold')
        ax5.grid(True, alpha=0.3, axis='x')
        
        # 6. 关键指标
        ax6 = fig.add_subplot(gs[2, 2])
        ax6.axis('off')
        summary = self._get_summary_text(df)
        y_pos = 0.95
        for key, value in summary.items():
            ax6.text(0.05, y_pos, f"{key}:", fontsize=11, fontweight='bold', transform=ax6.transAxes)
            ax6.text(0.5, y_pos, str(value), fontsize=11, color='#2196F3', fontweight='bold', transform=ax6.transAxes)
            y_pos -= 0.08
        ax6.set_title('关键指标', fontsize=12, fontweight='bold', y=1.02)
        
        if save:
            filepath = os.path.join(self.output_dir, 'dashboard.png')
            fig.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()
            return filepath
        return fig
    
    def _get_summary_text(self, df):
        """获取摘要文本"""
        return {
            '总订单数': f"{len(df):,}",
            '总销售额': f"¥{df['实付金额'].sum():,.0f}",
            '平均客单价': f"¥{df['实付金额'].mean():,.0f}",
            '总利润': f"¥{df.get('利润', pd.Series([0]*len(df))).sum():,.0f}",
            '会员占比': f"{df['是否会员'].mean()*100:.1f}%",
            '周末订单': f"{df['是否周末'].mean()*100:.1f}%",
            '产品类别': f"{df['产品类别'].nunique()}",
            '覆盖城市': f"{df['城市'].nunique()}",
        }


if __name__ == "__main__":
    from data_collector import EcommerceDataCollector
    from data_processor import DataProcessor
    
    collector = EcommerceDataCollector()
    df = collector.generate_mock_data(500)
    
    processor = DataProcessor()
    processor.load_data(df)
    df_clean = processor.clean_data()
    df_featured = processor.add_features()
    results = processor.aggregate_analysis()
    
    visualizer = DataVisualizer()
    visualizer.plot_sales_by_category(results['category_stats'])
    visualizer.plot_monthly_trend(results['monthly_stats'])
    visualizer.plot_city_analysis(results['city_stats'])
    visualizer.create_dashboard(df_featured, results)
    
    print("可视化图表已生成!")
```

## 五、报告生成与数据导出

### 5.1 报告生成器

```python
# 文件：report_generator.py
"""
报告生成模块

此模块负责生成数据分析报告和导出数据。
支持Excel导出、CSV导出和HTML报告生成。
"""

import pandas as pd
import os
from datetime import datetime


class ReportGenerator:
    """报告生成器"""
    
    def __init__(self, output_dir='outputs/reports'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
    
    def export_to_excel(self, df, analysis_results, filepath=None):
        """导出数据到Excel（多Sheet）"""
        if filepath is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filepath = os.path.join(self.output_dir, f'analysis_report_{timestamp}.xlsx')
        
        with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
            # 原始数据
            df.to_excel(writer, sheet_name='原始数据', index=False)
            
            # 各类分析结果
            for sheet_name, data in analysis_results.items():
                if isinstance(data, pd.DataFrame):
                    data.to_excel(writer, sheet_name=sheet_name[:31])
            
            # 汇总统计
            summary = self._create_summary_df(df)
            summary.to_excel(writer, sheet_name='汇总统计', index=False)
        
        print(f"Excel报告已导出到: {filepath}")
        return filepath
    
    def export_to_csv(self, df, analysis_results, output_dir=None):
        """导出数据到CSV"""
        if output_dir is None:
            output_dir = os.path.join(self.output_dir, 'csv')
        os.makedirs(output_dir, exist_ok=True)
        
        files = {}
        
        # 原始数据
        raw_file = os.path.join(output_dir, 'raw_data.csv')
        df.to_csv(raw_file, index=False, encoding='utf-8-sig')
        files['raw_data'] = raw_file
        
        # 分析结果
        for name, data in analysis_results.items():
            if isinstance(data, pd.DataFrame):
                csv_file = os.path.join(output_dir, f'{name}.csv')
                data.to_csv(csv_file, encoding='utf-8-sig')
                files[name] = csv_file
        
        print(f"CSV文件已导出到: {output_dir}")
        return files
    
    def export_to_json(self, df, analysis_results, filepath=None):
        """导出数据到JSON"""
        import json
        
        if filepath is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filepath = os.path.join(self.output_dir, f'analysis_data_{timestamp}.json')
        
        data = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'total_records': len(df),
                'total_columns': len(df.columns),
            },
            'summary': self._get_numeric_summary(df),
            'analysis_results': {}
        }
        
        for name, result in analysis_results.items():
            if isinstance(result, pd.DataFrame):
                data['analysis_results'][name] = result.to_dict(orient='records')
            elif isinstance(result, dict):
                data['analysis_results'][name] = result
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"JSON数据已导出到: {filepath}")
        return filepath
    
    def _create_summary_df(self, df):
        """创建汇总统计DataFrame"""
        summary = []
        
        # 数值列统计
        for col in df.select_dtypes(include=['number']).columns:
            summary.append({
                '指标': col,
                '计数': df[col].count(),
                '均值': round(df[col].mean(), 2),
                '标准差': round(df[col].std(), 2),
                '最小值': round(df[col].min(), 2),
                '25%分位': round(df[col].quantile(0.25), 2),
                '中位数': round(df[col].median(), 2),
                '75%分位': round(df[col].quantile(0.75), 2),
                '最大值': round(df[col].max(), 2),
            })
        
        return pd.DataFrame(summary)
    
    def _get_numeric_summary(self, df):
        """获取数值摘要"""
        summary = {}
        numeric_cols = df.select_dtypes(include=['number']).columns
        for col in numeric_cols:
            summary[col] = {
                'mean': round(df[col].mean(), 2),
                'median': round(df[col].median(), 2),
                'std': round(df[col].std(), 2),
                'min': round(df[col].min(), 2),
                'max': round(df[col].max(), 2),
            }
        return summary


if __name__ == "__main__":
    from data_collector import EcommerceDataCollector
    from data_processor import DataProcessor
    
    collector = EcommerceDataCollector()
    df = collector.generate_mock_data(500)
    
    processor = DataProcessor()
    processor.load_data(df)
    df_clean = processor.clean_data()
    df_featured = processor.add_features()
    results = processor.aggregate_analysis()
    
    reporter = ReportGenerator()
    reporter.export_to_excel(df_featured, results)
    reporter.export_to_csv(df_featured, results)
    reporter.export_to_json(df_featured, results)
    
    print("报告生成完成!")
```

## 六、Flask Web API

### 6.1 Flask Web API实现

```python
# 文件：web_api.py
"""
Flask Web API模块

此模块使用Flask框架搭建简单的Web API，
提供数据分析结果的JSON接口。
"""

from flask import Flask, jsonify, request, render_template_string
import pandas as pd
import json
from datetime import datetime

app = Flask(__name__)

# 全局数据存储
ANALYSIS_DATA = {}


def init_data(df, analysis_results, summary):
    """初始化全局数据"""
    global ANALYSIS_DATA
    ANALYSIS_DATA = {
        'df': df,
        'analysis_results': analysis_results,
        'summary': summary,
        'initialized_at': datetime.now().isoformat()
    }


@app.route('/')
def index():
    """首页 - API文档"""
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>电商数据分析API</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #2196F3; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #4CAF50; font-weight: bold; }
            .path { color: #FF9800; font-family: monospace; }
            code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>电商数据分析API</h1>
        <p>数据初始化时间: {{ init_time }}</p>
        
        <h2>可用接口</h2>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/summary</span>
            <p>获取分析摘要统计</p>
            <code>curl http://localhost:5000/api/summary</code>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/category-stats</span>
            <p>获取产品类别统计</p>
            <code>curl http://localhost:5000/api/category-stats</code>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/city-stats</span>
            <p>获取城市销售统计</p>
            <code>curl http://localhost:5000/api/city-stats</code>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/monthly-stats</span>
            <p>获取月度销售统计</p>
            <code>curl http://localhost:5000/api/monthly-stats</code>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/payment-stats</span>
            <p>获取支付方式统计</p>
            <code>curl http://localhost:5000/api/payment-stats</code>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/data?limit=10&category=电子产品</span>
            <p>获取原始数据（支持筛选）</p>
            <code>curl "http://localhost:5000/api/data?limit=10&category=电子产品"</code>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span>
            <span class="path">/api/health</span>
            <p>健康检查</p>
            <code>curl http://localhost:5000/api/health</code>
        </div>
    </body>
    </html>
    """, init_time=ANALYSIS_DATA.get('initialized_at', '未初始化'))


@app.route('/api/summary')
def api_summary():
    """获取摘要统计"""
    if not ANALYSIS_DATA:
        return jsonify({'error': '数据未初始化'}), 500
    
    return jsonify({
        'status': 'success',
        'data': ANALYSIS_DATA['summary']
    })


@app.route('/api/category-stats')
def api_category_stats():
    """获取产品类别统计"""
    if not ANALYSIS_DATA:
        return jsonify({'error': '数据未初始化'}), 500
    
    category_stats = ANALYSIS_DATA['analysis_results'].get('category_stats')
    if category_stats is not None:
        return jsonify({
            'status': 'success',
            'data': category_stats.to_dict(orient='index')
        })
    return jsonify({'error': '数据不可用'}), 404


@app.route('/api/city-stats')
def api_city_stats():
    """获取城市统计"""
    if not ANALYSIS_DATA:
        return jsonify({'error': '数据未初始化'}), 500
    
    city_stats = ANALYSIS_DATA['analysis_results'].get('city_stats')
    if city_stats is not None:
        return jsonify({
            'status': 'success',
            'data': city_stats.to_dict(orient='index')
        })
    return jsonify({'error': '数据不可用'}), 404


@app.route('/api/monthly-stats')
def api_monthly_stats():
    """获取月度统计"""
    if not ANALYSIS_DATA:
        return jsonify({'error': '数据未初始化'}), 500
    
    monthly_stats = ANALYSIS_DATA['analysis_results'].get('monthly_stats')
    if monthly_stats is not None:
        return jsonify({
            'status': 'success',
            'data': monthly_stats.to_dict(orient='index')
        })
    return jsonify({'error': '数据不可用'}), 404


@app.route('/api/payment-stats')
def api_payment_stats():
    """获取支付方式统计"""
    if not ANALYSIS_DATA:
        return jsonify({'error': '数据未初始化'}), 500
    
    payment_stats = ANALYSIS_DATA['analysis_results'].get('payment_stats')
    if payment_stats is not None:
        return jsonify({
            'status': 'success',
            'data': payment_stats.to_dict(orient='index')
        })
    return jsonify({'error': '数据不可用'}), 404


@app.route('/api/data')
def api_data():
    """获取原始数据（支持筛选和分页）"""
    if not ANALYSIS_DATA:
        return jsonify({'error': '数据未初始化'}), 500
    
    df = ANALYSIS_DATA['df']
    
    # 筛选参数
    category = request.args.get('category')
    city = request.args.get('city')
    limit = request.args.get('limit', 100, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    # 应用筛选
    filtered_df = df.copy()
    if category:
        filtered_df = filtered_df[filtered_df['产品类别'] == category]
    if city:
        filtered_df = filtered_df[filtered_df['城市'] == city]
    
    # 分页
    total = len(filtered_df)
    filtered_df = filtered_df.iloc[offset:offset+limit]
    
    return jsonify({
        'status': 'success',
        'total': total,
        'limit': limit,
        'offset': offset,
        'count': len(filtered_df),
        'data': filtered_df.to_dict(orient='records')
    })


@app.route('/api/health')
def api_health():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'data_initialized': bool(ANALYSIS_DATA)
    })


def run_server(host='0.0.0.0', port=5000, debug=False):
    """启动Flask服务器"""
    print(f"\n{'='*50}")
    print(f"Flask API服务器启动")
    print(f"地址: http://{host}:{port}")
    print(f"API文档: http://{host}:{port}/")
    print(f"{'='*50}\n")
    app.run(host=host, port=port, debug=debug)


if __name__ == "__main__":
    # 示例：初始化数据并启动服务器
    from data_collector import EcommerceDataCollector
    from data_processor import DataProcessor
    
    collector = EcommerceDataCollector()
    df = collector.generate_mock_data(500)
    
    processor = DataProcessor()
    processor.load_data(df)
    df_clean = processor.clean_data()
    df_featured = processor.add_features()
    results = processor.aggregate_analysis()
    summary = processor.get_summary_statistics()
    
    init_data(df_featured, results, summary)
    run_server(debug=True)
```

## 七、完整项目主程序

### 7.1 主程序入口

```python
# 文件：main.py
"""
电商数据分析项目 - 主程序入口

综合运用数据采集、处理、可视化和报告生成，
完成完整的电商数据分析流程。
"""

import os
import sys
from datetime import datetime
import json

# 导入项目模块
from data_collector import EcommerceDataCollector
from data_processor import DataProcessor
from data_visualizer import DataVisualizer
from report_generator import ReportGenerator


def main():
    """主函数"""
    print("=" * 60)
    print("电商数据分析项目")
    print("=" * 60)
    print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 创建输出目录
    os.makedirs('outputs/data', exist_ok=True)
    os.makedirs('outputs/charts', exist_ok=True)
    os.makedirs('outputs/reports', exist_ok=True)
    
    # ==========================================
    # 步骤1: 数据采集
    # ==========================================
    print("\n[步骤1] 数据采集")
    print("-" * 40)
    
    collector = EcommerceDataCollector(use_mock=True)
    raw_df = collector.generate_mock_data(num_records=500)
    collector.save_raw_data('outputs/data/raw_data.csv')
    
    print(f"  采集记录数: {len(raw_df)}")
    print(f"  数据列: {raw_df.columns.tolist()}")
    
    # ==========================================
    # 步骤2: 数据处理
    # ==========================================
    print("\n[步骤2] 数据处理")
    print("-" * 40)
    
    processor = DataProcessor()
    processor.load_data(raw_df)
    cleaned_df = processor.clean_data()
    featured_df = processor.add_features()
    
    # 聚合分析
    analysis_results = processor.aggregate_analysis()
    summary = processor.get_summary_statistics()
    
    print(f"  清洗后记录数: {len(cleaned_df)}")
    print(f"  特征列数: {len(featured_df.columns)}")
    print(f"\n  关键指标:")
    for key, value in summary.items():
        print(f"    {key}: {value}")
    
    # ==========================================
    # 步骤3: 数据可视化
    # ==========================================
    print("\n[步骤3] 数据可视化")
    print("-" * 40)
    
    visualizer = DataVisualizer(output_dir='outputs/charts')
    
    chart_files = []
    
    # 产品类别图表
    chart = visualizer.plot_sales_by_category(analysis_results['category_stats'])
    chart_files.append(('产品类别分析', chart))
    
    # 月度趋势图表
    chart = visualizer.plot_monthly_trend(analysis_results['monthly_stats'])
    chart_files.append(('月度趋势', chart))
    
    # 城市分析图表
    chart = visualizer.plot_city_analysis(analysis_results['city_stats'])
    chart_files.append(('城市分析', chart))
    
    # 综合仪表板
    chart = visualizer.create_dashboard(featured_df, analysis_results)
    chart_files.append(('综合仪表板', chart))
    
    for name, path in chart_files:
        print(f"  {name}: {path}")
    
    # ==========================================
    # 步骤4: 报告生成
    # ==========================================
    print("\n[步骤4] 报告生成")
    print("-" * 40)
    
    reporter = ReportGenerator(output_dir='outputs/reports')
    
    # 导出Excel
    excel_path = reporter.export_to_excel(featured_df, analysis_results)
    print(f"  Excel报告: {excel_path}")
    
    # 导出CSV
    csv_files = reporter.export_to_csv(featured_df, analysis_results)
    print(f"  CSV文件数: {len(csv_files)}")
    
    # 导出JSON
    json_path = reporter.export_to_json(featured_df, analysis_results)
    print(f"  JSON数据: {json_path}")
    
    # ==========================================
    # 完成
    # ==========================================
    print("\n" + "=" * 60)
    print("项目执行完成!")
    print(f"结束时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    print("\n生成的文件:")
    print("  outputs/data/    - 原始数据文件")
    print("  outputs/charts/  - 可视化图表")
    print("  outputs/reports/ - 分析报告")
    
    return {
        'raw_data': raw_df,
        'cleaned_data': cleaned_df,
        'featured_data': featured_df,
        'analysis_results': analysis_results,
        'summary': summary,
        'chart_files': chart_files
    }


def start_api_server():
    """启动API服务器"""
    from web_api import init_data, run_server
    
    # 执行分析流程
    result = main()
    
    # 初始化API数据
    init_data(
        result['featured_data'],
        result['analysis_results'],
        result['summary']
    )
    
    # 启动服务器
    run_server(host='0.0.0.0', port=5000, debug=True)


if __name__ == "__main__":
    # 如果传入 --api 参数，启动API服务器
    if len(sys.argv) > 1 and sys.argv[1] == '--api':
        start_api_server()
    else:
        main()
```

## 八、项目运行演示

```python
# 综合演示：完整项目流程
print("=" * 60)
print("电商数据分析项目 - 完整流程演示")
print("=" * 60)

import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime
import json

# 由于模块分散在多个文件中，这里整合演示
print("\n[项目架构]")
print("""
项目组成:
  1. data_collector.py  - 数据采集（API或模拟数据）
  2. data_processor.py  - 数据清洗与特征工程
  3. data_visualizer.py - 数据可视化图表
  4. report_generator.py - 报告生成与导出
  5. web_api.py         - Flask Web API
  6. main.py            - 主程序入口
""")

# 整合演示
np.random.seed(42)

# 1. 数据采集
print("[1/4] 数据采集...")
n_records = 200
categories = ['电子产品', '服装', '食品', '家居用品', '图书']
cities = ['北京', '上海', '广州', '深圳', '杭州']

records = []
for i in range(n_records):
    records.append({
        '订单ID': f'ORD{i+1:06d}',
        '订单日期': pd.Timestamp('2026-01-01') + pd.Timedelta(days=np.random.randint(0, 207)),
        '产品类别': np.random.choice(categories),
        '城市': np.random.choice(cities),
        '购买数量': np.random.randint(1, 6),
        '单价': np.random.uniform(10, 5000),
        '折扣': np.random.choice([0, 0.05, 0.1, 0.15, 0.2]),
        '是否会员': np.random.choice([True, False], p=[0.6, 0.4]),
        '支付方式': np.random.choice(['微信支付', '支付宝', '银行卡'])
    })

df = pd.DataFrame(records)
df['实付金额'] = df['购买数量'] * df['单价'] * (1 - df['折扣'])
print(f"  采集记录: {len(df)} 条")

# 2. 数据处理
print("[2/4] 数据处理...")
# 添加时间特征
df['月份'] = df['订单日期'].dt.month
df['季度'] = df['订单日期'].dt.quarter
df['利润'] = df['实付金额'] * 0.3

# 统计分析
stats = {
    '总订单数': len(df),
    '总销售额': df['实付金额'].sum(),
    '平均客单价': df['实付金额'].mean(),
    '总利润': df['利润'].sum(),
    '会员占比': df['是否会员'].mean() * 100,
}

print(f"  总销售额: ¥{stats['总销售额']:,.0f}")
print(f"  平均客单价: ¥{stats['平均客单价']:,.0f}")
print(f"  总利润: ¥{stats['总利润']:,.0f}")

# 按类别统计
category_stats = df.groupby('产品类别').agg(
    订单数=('订单ID', 'count'),
    总销售额=('实付金额', 'sum'),
    平均客单价=('实付金额', 'mean')
).round(2).sort_values('总销售额', ascending=False)

print(f"\n  按产品类别统计:")
for idx, row in category_stats.iterrows():
    print(f"    {idx}: 订单{row['订单数']}笔, 销售额¥{row['总销售额']:,.0f}, 均价¥{row['平均客单价']:,.0f}")

# 按城市统计
city_stats = df.groupby('城市').agg(
    订单数=('订单ID', 'count'),
    总销售额=('实付金额', 'sum')
).round(2).sort_values('总销售额', ascending=False)

print(f"\n  按城市统计:")
for idx, row in city_stats.iterrows():
    print(f"    {idx}: 订单{row['订单数']}笔, 销售额¥{row['总销售额']:,.0f}")

# 3. 可视化
print("[3/4] 数据可视化...")
import matplotlib.pyplot as plt
import matplotlib
matplotlib.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei']
matplotlib.rcParams['axes.unicode_minus'] = False

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 类别柱状图
axes[0, 0].bar(category_stats.index, category_stats['总销售额'], 
               color=['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'])
axes[0, 0].set_title('产品类别销售额', fontsize=14, fontweight='bold')
axes[0, 0].set_xticklabels(category_stats.index, rotation=45, ha='right')
axes[0, 0].grid(True, alpha=0.3, axis='y')

# 城市饼图
axes[0, 1].pie(city_stats['订单数'], labels=city_stats.index, autopct='%1.1f%%',
               colors=['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'])
axes[0, 1].set_title('城市订单分布', fontsize=14, fontweight='bold')

# 月度趋势
monthly = df.groupby('月份')['实付金额'].sum()
axes[1, 0].plot(monthly.index, monthly.values, 'o-', color='#2196F3', linewidth=2)
axes[1, 0].fill_between(monthly.index, monthly.values, alpha=0.2, color='#2196F3')
axes[1, 0].set_title('月度销售趋势', fontsize=14, fontweight='bold')
axes[1, 0].set_xlabel('月份')
axes[1, 0].set_ylabel('销售额')
axes[1, 0].grid(True, alpha=0.3)

# 支付方式
payment = df['支付方式'].value_counts()
axes[1, 1].bar(payment.index, payment.values, color=['#2196F3', '#4CAF50', '#FF9800'])
axes[1, 1].set_title('支付方式分布', fontsize=14, fontweight='bold')
axes[1, 1].grid(True, alpha=0.3, axis='y')

fig.suptitle('电商数据分析报告', fontsize=18, fontweight='bold')
fig.tight_layout()

output_dir = 'd:/my-vuepress-blog/docs/notes/outputs'
os.makedirs(output_dir, exist_ok=True)
fig.savefig(os.path.join(output_dir, 'final_dashboard.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  仪表板已保存")

# 4. 数据导出
print("[4/4] 数据导出...")
# 导出CSV
csv_path = os.path.join(output_dir, 'final_data.csv')
df.to_csv(csv_path, index=False, encoding='utf-8-sig')
print(f"  CSV: {csv_path}")

# 导出JSON
json_path = os.path.join(output_dir, 'final_summary.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump({
        'summary': {k: round(v, 2) if isinstance(v, float) else v for k, v in stats.items()},
        'category_stats': category_stats.to_dict(orient='index'),
        'city_stats': city_stats.to_dict(orient='index'),
        'generated_at': datetime.now().isoformat()
    }, f, ensure_ascii=False, indent=2)
print(f"  JSON: {json_path}")

print("\n" + "=" * 60)
print("项目演示完成!")
print("=" * 60)
print(f"""
项目产出:
  - 数据采集: {n_records} 条记录
  - 数据清洗: 完成
  - 可视化: 仪表板已生成
  - 数据导出: CSV和JSON已保存
  - 总销售额: ¥{stats['总销售额']:,.0f}
  - 总利润: ¥{stats['总利润']:,.0f}
""")
```

## 总结

本章我们通过一个完整的电商数据分析项目，综合运用了Python数据科学生态系统的核心工具：

**数据采集**：使用`requests`库和模拟数据生成器，创建了包含订单信息、产品类别、城市、支付方式等多维度的电商数据集。

**数据处理**：使用Pandas进行数据清洗（缺失值处理、异常值检测）、特征工程（时间特征提取、利润计算）和聚合分析（按类别、城市、月份、支付方式等维度统计）。

**数据可视化**：使用Matplotlib创建了多种图表，包括柱状图、饼图、折线图、仪表板等，全面展示了数据的分布和趋势。

**报告生成**：将分析结果导出为Excel（多Sheet）、CSV和JSON格式，方便后续使用和分享。

**Flask Web API**：搭建了简单的Web API服务，提供了RESTful接口来访问分析结果，使得数据可以被其他系统消费。

**项目工程化**：采用模块化设计，将数据采集、处理、可视化和报告生成分别封装为独立的模块，提高了代码的可维护性和可复用性。

通过这个综合项目，你将Python数据科学生态系统（NumPy、Pandas、Matplotlib、Requests、Flask）的核心技术串联起来，完成了一个从数据采集到数据分析再到结果展示的完整流程。这些技能在实际的数据分析和数据科学工作中具有广泛的应用价值。
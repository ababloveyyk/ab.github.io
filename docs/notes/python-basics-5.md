---
title: Python基础速通Ⅴ——综合实战：名片管理系统
date: 2026-07-26
tags:
  - Python
  - 综合实战
  - 名片管理
  - 项目实战
  - JSON
categories:
  - Python
---

## 前言

经过前面四篇文章的学习，我们已经掌握了 Python 编程的核心基础知识：变量与数据类型、列表与元组、字典与集合、字符串处理、条件判断和循环控制。现在是时候将这些知识融会贯通，通过一个完整的实战项目来巩固和提升。

本文将带领你从零开始构建一个功能完整的名片管理系统。这个项目虽然规模不大，但涵盖了软件开发的核心流程：需求分析、数据结构设计、功能实现、数据持久化、错误处理和用户交互。完成这个项目后，你将具备独立开发小型 Python 应用的能力，并深刻理解"如何将所学的语法知识组织成一个可用的程序"。

为什么选择名片管理系统？因为它的需求清晰、功能明确，而且涉及 CRUD（增删改查）——这是绝大多数应用程序的核心操作模式。无论你将来是做 Web 开发、数据分析还是自动化脚本，CRUD 操作都是最基本的需求。通过这个项目，你将学会如何设计合理的数据结构、如何实现用户友好的交互界面、以及如何将数据持久化到文件中。

让我们开始这段令人兴奋的实战之旅。

## 项目需求分析

### 功能需求

在开始编写代码之前，我们需要明确系统应该具备哪些功能。一个好的需求分析能够避免后期返工，让开发过程更加顺畅。

名片管理系统需要实现以下功能：

1. **新增名片**：用户可以输入姓名、电话、邮箱、公司、职位等信息，系统将其保存
2. **显示所有名片**：以表格形式展示所有已保存的名片
3. **搜索名片**：根据姓名、电话或公司等关键词搜索名片
4. **修改名片**：找到指定名片后修改其信息
5. **删除名片**：删除指定名片（需要确认）
6. **数据持久化**：所有数据保存到 JSON 文件中，程序重启后数据不丢失
7. **输入验证**：对用户输入的数据进行合法性校验（如手机号格式、邮箱格式）
8. **菜单界面**：提供友好的命令行菜单交互界面

### 数据结构设计

在开始编码之前，我们需要仔细设计数据结构。一个好的数据结构设计能够让后续的功能实现事半功倍。

对于名片管理系统，每张名片包含以下字段：

- 姓名（name）：字符串，必填
- 电话（phone）：字符串，11位数字，必填
- 邮箱（email）：字符串，需包含 @，可选
- 公司（company）：字符串，可选
- 职位（position）：字符串，可选
- 地址（address）：字符串，可选
- 备注（notes）：字符串，可选
- 创建时间（created_at）：字符串，自动生成

所有名片存储在一个列表中，每张名片是一个字典。这种结构简单直观，适合我们当前的需求规模。

```python
# 数据结构示例
cards = [
    {
        "name": "张三",
        "phone": "13800138000",
        "email": "zhangsan@example.com",
        "company": "科技有限公司",
        "position": "软件工程师",
        "address": "北京市海淀区",
        "notes": "技术交流",
        "created_at": "2024-01-15 10:30:00"
    },
    # ... 更多名片
]
```

### 模块划分

我们将系统划分为以下几个模块：

1. **数据验证模块**（`validators.py`）：负责验证用户输入的数据格式
2. **数据存储模块**（`storage.py`）：负责数据的读写（JSON 文件）
3. **业务逻辑模块**（`card_manager.py`）：负责名片管理的核心逻辑
4. **用户界面模块**（`main.py`）：负责菜单交互和用户输入

这种模块化的设计让代码结构清晰，易于维护和扩展。每个模块职责单一，修改某个模块不会影响其他模块。

## 项目完整代码

### 数据验证模块（validators.py）

```python
"""
数据验证模块
负责验证名片信息的合法性
"""

import re


def validate_name(name: str) -> tuple:
    """
    验证姓名
    规则：非空，长度2-20个字符
    返回：(是否有效, 错误信息)
    """
    if not name or not name.strip():
        return False, "姓名不能为空"
    
    name = name.strip()
    if len(name) < 2:
        return False, "姓名至少需要2个字符"
    if len(name) > 20:
        return False, "姓名不能超过20个字符"
    
    return True, ""


def validate_phone(phone: str) -> tuple:
    """
    验证手机号
    规则：11位数字，以1开头
    返回：(是否有效, 错误信息)
    """
    if not phone or not phone.strip():
        return False, "手机号不能为空"
    
    phone = phone.strip()
    
    # 手机号格式：1开头的11位数字
    pattern = r'^1[3-9]\d{9}$'
    if not re.match(pattern, phone):
        return False, "手机号格式不正确，请输入11位有效手机号"
    
    return True, ""


def validate_email(email: str) -> tuple:
    """
    验证邮箱
    规则：可以为空，如果非空则需符合邮箱格式
    返回：(是否有效, 错误信息)
    """
    if not email or not email.strip():
        return True, ""  # 邮箱是可选的
    
    email = email.strip()
    
    # 基本邮箱格式验证
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "邮箱格式不正确"
    
    return True, ""


def validate_company(company: str) -> tuple:
    """
    验证公司名称
    规则：可以为空，如果非空则长度1-50
    返回：(是否有效, 错误信息)
    """
    if not company or not company.strip():
        return True, ""  # 公司是可选的
    
    company = company.strip()
    if len(company) > 50:
        return False, "公司名称不能超过50个字符"
    
    return True, ""


def validate_card(card: dict) -> list:
    """
    验证整张名片的所有字段
    返回：错误信息列表，如果为空则表示全部验证通过
    """
    errors = []
    
    # 逐一验证每个字段
    valid, msg = validate_name(card.get("name", ""))
    if not valid:
        errors.append(f"姓名：{msg}")
    
    valid, msg = validate_phone(card.get("phone", ""))
    if not valid:
        errors.append(f"手机号：{msg}")
    
    valid, msg = validate_email(card.get("email", ""))
    if not valid:
        errors.append(f"邮箱：{msg}")
    
    valid, msg = validate_company(card.get("company", ""))
    if not valid:
        errors.append(f"公司：{msg}")
    
    return errors


# 测试验证模块
if __name__ == "__main__":
    print("=" * 50)
    print("数据验证模块测试")
    print("=" * 50)
    
    # 测试姓名验证
    test_cases = [
        ("", "空姓名"),
        ("张", "太短"),
        ("张三", "正常"),
        ("张" * 21, "太长"),
    ]
    print("\n姓名验证测试：")
    for name, desc in test_cases:
        valid, msg = validate_name(name)
        status = "通过" if valid else f"失败: {msg}"
        print(f"  {desc}: {status}")
    
    # 测试手机号验证
    phone_cases = [
        ("", "空手机号"),
        ("12345678901", "非1开头"),
        ("1380013800", "10位"),
        ("138001380001", "12位"),
        ("13800138000", "正常"),
        ("15912345678", "正常"),
        ("18888888888", "正常"),
    ]
    print("\n手机号验证测试：")
    for phone, desc in phone_cases:
        valid, msg = validate_phone(phone)
        status = "通过" if valid else f"失败: {msg}"
        print(f"  {desc}: {status}")
    
    # 测试邮箱验证
    email_cases = [
        ("", "空邮箱（可选）"),
        ("invalid", "无@"),
        ("invalid@", "无域名"),
        ("@example.com", "无用户名"),
        ("test@example.com", "正常"),
        ("user.name@company.co.uk", "正常"),
    ]
    print("\n邮箱验证测试：")
    for email, desc in email_cases:
        valid, msg = validate_email(email)
        status = "通过" if valid else f"失败: {msg}"
        print(f"  {desc}: {status}")
```

这个验证模块是系统的第一道防线。它确保用户输入的数据符合预期格式，避免脏数据进入系统。我们使用正则表达式进行格式验证，这是一种标准做法。`re.match()` 尝试从字符串开头匹配模式，适合做完整格式验证。

验证函数返回 `(bool, str)` 元组，这是一种常见的模式。调用方可以同时知道验证是否通过以及具体的错误信息，方便向用户反馈。

### 数据存储模块（storage.py）

```python
"""
数据存储模块
负责名片的 JSON 文件读写
"""

import json
import os
from datetime import datetime


class CardStorage:
    """名片数据存储类"""
    
    def __init__(self, file_path: str = "cards.json"):
        """
        初始化存储
        :param file_path: JSON 文件路径
        """
        self.file_path = file_path
    
    def load(self) -> list:
        """
        从 JSON 文件加载名片数据
        :return: 名片列表
        """
        if not os.path.exists(self.file_path):
            # 文件不存在，返回空列表
            return []
        
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                # 确保加载的是列表
                if isinstance(data, list):
                    return data
                else:
                    print(f"警告：数据文件格式异常，使用空列表")
                    return []
        except json.JSONDecodeError as e:
            print(f"警告：JSON 解析失败 ({e})，使用空列表")
            return []
        except Exception as e:
            print(f"警告：文件读取失败 ({e})，使用空列表")
            return []
    
    def save(self, cards: list) -> bool:
        """
        将名片数据保存到 JSON 文件
        :param cards: 名片列表
        :return: 是否保存成功
        """
        try:
            # 确保目录存在
            directory = os.path.dirname(self.file_path)
            if directory and not os.path.exists(directory):
                os.makedirs(directory)
            
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(cards, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"错误：保存失败 ({e})")
            return False
    
    def backup(self) -> bool:
        """
        创建数据备份
        :return: 是否备份成功
        """
        if not os.path.exists(self.file_path):
            print("没有数据需要备份")
            return False
        
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = f"{self.file_path}.backup_{timestamp}"
            
            with open(self.file_path, "r", encoding="utf-8") as src:
                with open(backup_path, "w", encoding="utf-8") as dst:
                    dst.write(src.read())
            
            print(f"备份已创建：{backup_path}")
            return True
        except Exception as e:
            print(f"备份失败：{e}")
            return False
    
    def get_statistics(self) -> dict:
        """
        获取数据统计信息
        :return: 统计信息字典
        """
        cards = self.load()
        
        stats = {
            "total": len(cards),
            "file_path": self.file_path,
            "file_exists": os.path.exists(self.file_path),
        }
        
        if os.path.exists(self.file_path):
            stats["file_size"] = os.path.getsize(self.file_path)
            stats["file_size_human"] = self._format_size(stats["file_size"])
            stats["last_modified"] = datetime.fromtimestamp(
                os.path.getmtime(self.file_path)
            ).strftime("%Y-%m-%d %H:%M:%S")
        
        # 统计公司分布
        companies = {}
        for card in cards:
            company = card.get("company", "未填写")
            if company:
                companies[company] = companies.get(company, 0) + 1
        
        stats["companies"] = companies
        stats["company_count"] = len(companies)
        
        return stats
    
    @staticmethod
    def _format_size(size_bytes: int) -> str:
        """格式化文件大小"""
        for unit in ["B", "KB", "MB", "GB"]:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"


# 测试存储模块
if __name__ == "__main__":
    print("=" * 50)
    print("数据存储模块测试")
    print("=" * 50)
    
    storage = CardStorage("test_cards.json")
    
    # 测试保存
    test_cards = [
        {
            "name": "张三",
            "phone": "13800138000",
            "email": "zhangsan@example.com",
            "company": "科技有限公司",
            "position": "工程师",
            "address": "北京",
            "notes": "测试",
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
    ]
    
    print(f"\n保存测试数据...")
    success = storage.save(test_cards)
    print(f"保存结果：{'成功' if success else '失败'}")
    
    # 测试加载
    print(f"\n加载数据...")
    loaded_cards = storage.load()
    print(f"加载了 {len(loaded_cards)} 张名片")
    for card in loaded_cards:
        print(f"  - {card['name']} ({card['phone']})")
    
    # 测试统计
    print(f"\n数据统计：")
    stats = storage.get_statistics()
    for key, value in stats.items():
        if key != "companies":
            print(f"  {key}: {value}")
    
    # 清理测试文件
    os.remove("test_cards.json")
    print(f"\n测试文件已清理")
```

存储模块封装了 JSON 文件的读写操作。`json.dump()` 的 `ensure_ascii=False` 参数确保中文字符正常显示，`indent=2` 参数让 JSON 文件格式化输出，便于人工查看和编辑。

这个模块还提供了备份功能和统计功能，体现了"好的设计"——不仅满足基本需求，还考虑到了数据安全（备份）和运维需求（统计）。

### 业务逻辑模块（card_manager.py）

```python
"""
名片管理模块
负责名片管理的核心业务逻辑
"""

from datetime import datetime
from typing import List, Optional, Tuple


class CardManager:
    """名片管理器"""
    
    def __init__(self, storage):
        """
        初始化管理器
        :param storage: 数据存储对象
        """
        self.storage = storage
        self.cards: List[dict] = []
        self.load_cards()
    
    def load_cards(self) -> None:
        """从存储中加载名片数据"""
        self.cards = self.storage.load()
        print(f"已加载 {len(self.cards)} 张名片")
    
    def save_cards(self) -> bool:
        """保存名片数据到存储"""
        return self.storage.save(self.cards)
    
    def add_card(self, name: str, phone: str, email: str = "",
                 company: str = "", position: str = "",
                 address: str = "", notes: str = "") -> dict:
        """
        添加新名片
        :return: 新添加的名片字典
        """
        card = {
            "name": name.strip(),
            "phone": phone.strip(),
            "email": email.strip(),
            "company": company.strip(),
            "position": position.strip(),
            "address": address.strip(),
            "notes": notes.strip(),
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        
        self.cards.append(card)
        self.save_cards()
        return card
    
    def get_all_cards(self) -> List[dict]:
        """获取所有名片"""
        return self.cards
    
    def search_cards(self, keyword: str) -> List[tuple]:
        """
        搜索名片
        :param keyword: 搜索关键词
        :return: [(索引, 名片字典), ...] 的列表
        """
        if not keyword or not keyword.strip():
            return [(i, card) for i, card in enumerate(self.cards)]
        
        keyword = keyword.strip().lower()
        results = []
        
        for i, card in enumerate(self.cards):
            # 在姓名、电话、公司、邮箱、职位中搜索
            searchable = " ".join([
                card.get("name", ""),
                card.get("phone", ""),
                card.get("company", ""),
                card.get("email", ""),
                card.get("position", ""),
            ]).lower()
            
            if keyword in searchable:
                results.append((i, card))
        
        return results
    
    def find_card_by_name(self, name: str) -> List[tuple]:
        """
        根据姓名精确查找名片
        :param name: 姓名
        :return: [(索引, 名片字典), ...]
        """
        name = name.strip().lower()
        results = []
        
        for i, card in enumerate(self.cards):
            if card.get("name", "").lower() == name:
                results.append((i, card))
        
        return results
    
    def update_card(self, index: int, **kwargs) -> Optional[dict]:
        """
        更新名片信息
        :param index: 名片在列表中的索引
        :param kwargs: 要更新的字段和值
        :return: 更新后的名片字典，失败返回 None
        """
        if index < 0 or index >= len(self.cards):
            return None
        
        card = self.cards[index]
        
        # 更新提供的字段
        for key, value in kwargs.items():
            if key in card:
                card[key] = value.strip() if isinstance(value, str) else value
        
        self.save_cards()
        return card
    
    def delete_card(self, index: int) -> Optional[dict]:
        """
        删除名片
        :param index: 名片在列表中的索引
        :return: 被删除的名片字典，失败返回 None
        """
        if index < 0 or index >= len(self.cards):
            return None
        
        deleted_card = self.cards.pop(index)
        self.save_cards()
        return deleted_card
    
    def get_statistics(self) -> dict:
        """
        获取名片统计信息
        :return: 统计信息字典
        """
        if not self.cards:
            return {"total": 0}
        
        stats = {
            "total": len(self.cards),
            "companies": {},
            "with_email": sum(1 for c in self.cards if c.get("email")),
            "with_company": sum(1 for c in self.cards if c.get("company")),
            "with_position": sum(1 for c in self.cards if c.get("position")),
            "with_address": sum(1 for c in self.cards if c.get("address")),
        }
        
        # 公司分布统计
        for card in self.cards:
            company = card.get("company", "未填写") or "未填写"
            stats["companies"][company] = stats["companies"].get(company, 0) + 1
        
        return stats
    
    def export_to_csv(self, file_path: str) -> bool:
        """
        导出名片到 CSV 文件
        :param file_path: CSV 文件路径
        :return: 是否导出成功
        """
        import csv
        
        if not self.cards:
            print("没有名片可以导出")
            return False
        
        try:
            fields = ["name", "phone", "email", "company", 
                      "position", "address", "notes", "created_at"]
            
            with open(file_path, "w", newline="", encoding="utf-8-sig") as f:
                writer = csv.DictWriter(f, fieldnames=fields)
                writer.writeheader()
                writer.writerows(self.cards)
            
            print(f"成功导出 {len(self.cards)} 张名片到 {file_path}")
            return True
        except Exception as e:
            print(f"导出失败：{e}")
            return False


# 测试业务逻辑模块
if __name__ == "__main__":
    from storage import CardStorage
    
    print("=" * 50)
    print("名片管理模块测试")
    print("=" * 50)
    
    # 创建测试存储
    storage = CardStorage("test_cards.json")
    manager = CardManager(storage)
    
    # 清空测试数据
    manager.cards = []
    
    # 测试添加名片
    print("\n添加名片：")
    card1 = manager.add_card(
        name="张三",
        phone="13800138000",
        email="zhangsan@example.com",
        company="科技有限公司",
        position="工程师",
        address="北京",
        notes="技术交流"
    )
    print(f"  添加：{card1['name']} - {card1['phone']}")
    
    card2 = manager.add_card(
        name="李四",
        phone="15900159000",
        email="lisi@example.com",
        company="互联网公司",
        position="产品经理",
        address="上海",
    )
    print(f"  添加：{card2['name']} - {card2['phone']}")
    
    card3 = manager.add_card(
        name="王五",
        phone="18800188000",
        company="科技有限公司",
        position="设计师",
        address="深圳",
        notes="设计交流"
    )
    print(f"  添加：{card3['name']} - {card3['phone']}")
    
    # 测试搜索
    print(f"\n搜索 '科技'：")
    results = manager.search_cards("科技")
    for i, card in results:
        print(f"  [{i}] {card['name']} - {card['company']}")
    
    # 测试更新
    print(f"\n更新张三的手机号：")
    updated = manager.update_card(0, phone="13900139000", notes="技术交流（已更新）")
    if updated:
        print(f"  更新后：{updated['name']} - {updated['phone']}")
    
    # 测试统计
    print(f"\n统计信息：")
    stats = manager.get_statistics()
    for key, value in stats.items():
        if key != "companies":
            print(f"  {key}: {value}")
        else:
            print(f"  公司分布：")
            for company, count in value.items():
                print(f"    {company}: {count}")
    
    # 测试删除
    print(f"\n删除王五的名片：")
    deleted = manager.delete_card(2)
    if deleted:
        print(f"  已删除：{deleted['name']}")
    
    print(f"  剩余名片：{len(manager.cards)} 张")
    
    # 清理
    import os
    if os.path.exists("test_cards.json"):
        os.remove("test_cards.json")
```

名片管理器是系统的核心。它封装了所有业务逻辑，包括添加、搜索、更新、删除、统计和导出。每个方法都返回有意义的结果，便于调用方（用户界面）做出相应的处理。

注意 `search_cards()` 方法的设计——它返回 `[(索引, 名片), ...]` 的列表，而不是直接返回名片字典。这是因为索引信息在后续的更新和删除操作中非常重要，调用方需要知道名片在列表中的位置。

### 用户界面模块（main.py）

```python
"""
名片管理系统 - 主程序
提供命令行菜单交互界面
"""

import os
import sys
from datetime import datetime

# 导入自定义模块
from storage import CardStorage
from card_manager import CardManager
from validators import validate_card, validate_name, validate_phone, validate_email


class CardSystemUI:
    """名片管理系统用户界面"""
    
    def __init__(self):
        """初始化系统"""
        self.storage = CardStorage("cards.json")
        self.manager = CardManager(self.storage)
    
    def clear_screen(self):
        """清屏"""
        os.system("cls" if sys.platform == "win32" else "clear")
    
    def print_header(self, title: str):
        """打印标题栏"""
        print("\n" + "=" * 60)
        print(f"  {title}")
        print("=" * 60)
    
    def print_card_table(self, cards: list, show_index: bool = True):
        """
        以表格形式打印名片列表
        :param cards: 名片列表或 [(索引, 名片), ...] 格式
        :param show_index: 是否显示索引
        """
        if not cards:
            print("\n  暂无名片数据")
            return
        
        # 判断输入格式
        if isinstance(cards[0], tuple):
            card_list = cards
        else:
            card_list = [(i, card) for i, card in enumerate(cards)]
        
        # 打印表头
        header = f"{'序号':<5} {'姓名':<8} {'电话':<14} {'公司':<12} {'职位':<10} {'邮箱':<20}"
        print(f"\n  {header}")
        print("  " + "-" * 70)
        
        # 打印每一行
        for idx, card in card_list:
            row = (
                f"{idx:<5} "
                f"{card.get('name', '')[:8]:<8} "
                f"{card.get('phone', '')[:14]:<14} "
                f"{card.get('company', '')[:12]:<12} "
                f"{card.get('position', '')[:10]:<10} "
                f"{card.get('email', '')[:20]:<20}"
            )
            print(f"  {row}")
        
        print(f"\n  共 {len(card_list)} 张名片")
    
    def print_card_detail(self, card: dict):
        """打印名片详细信息"""
        print("\n  " + "-" * 40)
        print(f"  姓名：{card.get('name', '')}")
        print(f"  电话：{card.get('phone', '')}")
        print(f"  邮箱：{card.get('email', '') or '(未填写)'}")
        print(f"  公司：{card.get('company', '') or '(未填写)'}")
        print(f"  职位：{card.get('position', '') or '(未填写)'}")
        print(f"  地址：{card.get('address', '') or '(未填写)'}")
        print(f"  备注：{card.get('notes', '') or '(无)'}")
        print(f"  创建时间：{card.get('created_at', '')}")
        print("  " + "-" * 40)
    
    def input_with_default(self, prompt: str, default: str = "") -> str:
        """
        获取用户输入，支持默认值
        :param prompt: 提示信息
        :param default: 默认值
        :return: 用户输入
        """
        if default:
            result = input(f"  {prompt} [{default}]: ").strip()
            return result if result else default
        else:
            return input(f"  {prompt}: ").strip()
    
    def add_card_menu(self):
        """添加名片菜单"""
        self.print_header("添加新名片")
        
        print("\n  请输入名片信息（带 * 的为必填项）：\n")
        
        # 获取姓名（必填）
        while True:
            name = input("  * 姓名：").strip()
            valid, msg = validate_name(name)
            if valid:
                break
            print(f"  [错误] {msg}，请重新输入")
        
        # 获取电话（必填）
        while True:
            phone = input("  * 电话：").strip()
            valid, msg = validate_phone(phone)
            if valid:
                break
            print(f"  [错误] {msg}，请重新输入")
        
        # 获取邮箱（可选）
        while True:
            email = input("    邮箱（可选）：").strip()
            valid, msg = validate_email(email)
            if valid:
                break
            print(f"  [错误] {msg}，请重新输入")
        
        # 获取可选字段
        company = input("    公司（可选）：").strip()
        position = input("    职位（可选）：").strip()
        address = input("    地址（可选）：").strip()
        notes = input("    备注（可选）：").strip()
        
        # 添加名片
        card = self.manager.add_card(
            name=name, phone=phone, email=email,
            company=company, position=position,
            address=address, notes=notes
        )
        
        print(f"\n  [成功] 名片 '{card['name']}' 已添加！")
        input("\n  按 Enter 返回主菜单...")
    
    def show_all_menu(self):
        """显示所有名片菜单"""
        self.print_header("所有名片")
        
        cards = self.manager.get_all_cards()
        self.print_card_table(cards)
        
        if cards:
            # 提供查看详情选项
            try:
                choice = input("\n  输入序号查看详情（或按 Enter 返回）：").strip()
                if choice.isdigit():
                    idx = int(choice)
                    if 0 <= idx < len(cards):
                        self.print_card_detail(cards[idx])
            except (ValueError, IndexError):
                pass
        
        input("\n  按 Enter 返回主菜单...")
    
    def search_card_menu(self):
        """搜索名片菜单"""
        self.print_header("搜索名片")
        
        keyword = input("\n  请输入搜索关键词（姓名/电话/公司）：").strip()
        if not keyword:
            print("  搜索关键词不能为空")
            input("\n  按 Enter 返回主菜单...")
            return
        
        results = self.manager.search_cards(keyword)
        
        if not results:
            print(f"\n  未找到与 '{keyword}' 相关的名片")
            input("\n  按 Enter 返回主菜单...")
            return
        
        print(f"\n  找到 {len(results)} 张相关名片：")
        self.print_card_table(results)
        
        # 操作选项
        print("\n  操作选项：")
        print("  [V] 查看详情  [E] 编辑  [D] 删除  [Enter] 返回")
        
        while True:
            choice = input("\n  请选择：").strip().upper()
            
            if choice == "":
                break
            
            try:
                idx_str = input("  请输入名片序号：").strip()
                if not idx_str.isdigit():
                    print("  请输入有效的数字序号")
                    continue
                idx = int(idx_str)
                
                # 验证序号
                valid_indices = [i for i, _ in results]
                if idx not in valid_indices:
                    print(f"  无效的序号，请输入 {valid_indices}")
                    continue
                
                if choice == "V":
                    # 查看详情
                    card = self.manager.cards[idx]
                    self.print_card_detail(card)
                
                elif choice == "E":
                    # 编辑名片
                    self.edit_card(idx)
                    break  # 编辑后可能改变了索引，退出
                
                elif choice == "D":
                    # 删除名片
                    self.delete_card_by_index(idx)
                    break  # 删除后索引变了，退出
                
                else:
                    print("  无效的操作选项")
            
            except ValueError:
                print("  请输入有效的数字")
        
        input("\n  按 Enter 返回主菜单...")
    
    def edit_card(self, index: int):
        """编辑名片"""
        card = self.manager.cards[index]
        
        self.print_header("编辑名片")
        self.print_card_detail(card)
        
        print("\n  请输入新信息（直接回车保留原值）：\n")
        
        # 获取新值
        name = self.input_with_default("姓名", card.get("name", ""))
        phone = self.input_with_default("电话", card.get("phone", ""))
        email = self.input_with_default("邮箱", card.get("email", ""))
        company = self.input_with_default("公司", card.get("company", ""))
        position = self.input_with_default("职位", card.get("position", ""))
        address = self.input_with_default("地址", card.get("address", ""))
        notes = self.input_with_default("备注", card.get("notes", ""))
        
        # 验证
        valid, msg = validate_name(name)
        if not valid:
            print(f"\n  [错误] {msg}")
            return
        
        valid, msg = validate_phone(phone)
        if not valid:
            print(f"\n  [错误] {msg}")
            return
        
        valid, msg = validate_email(email)
        if not valid:
            print(f"\n  [错误] {msg}")
            return
        
        # 更新
        updated = self.manager.update_card(
            index, name=name, phone=phone, email=email,
            company=company, position=position,
            address=address, notes=notes
        )
        
        if updated:
            print(f"\n  [成功] 名片 '{updated['name']}' 已更新！")
    
    def delete_card_by_index(self, index: int):
        """通过索引删除名片"""
        card = self.manager.cards[index]
        
        self.print_card_detail(card)
        confirm = input(f"\n  确认删除 '{card['name']}' 的名片吗？(y/n)：").strip().lower()
        
        if confirm in ("y", "yes", "是"):
            deleted = self.manager.delete_card(index)
            if deleted:
                print(f"\n  [成功] 名片 '{deleted['name']}' 已删除！")
        else:
            print("  已取消删除")
    
    def statistics_menu(self):
        """统计菜单"""
        self.print_header("数据统计")
        
        stats = self.manager.get_statistics()
        
        print(f"\n  名片总数：{stats.get('total', 0)}")
        print(f"  有邮箱：{stats.get('with_email', 0)} 张")
        print(f"  有公司：{stats.get('with_company', 0)} 张")
        print(f"  有职位：{stats.get('with_position', 0)} 张")
        print(f"  有地址：{stats.get('with_address', 0)} 张")
        
        # 公司分布
        companies = stats.get("companies", {})
        if companies:
            print(f"\n  公司分布：")
            for company, count in sorted(companies.items(), 
                                         key=lambda x: x[1], reverse=True):
                print(f"    {company}: {count} 张")
        
        input("\n  按 Enter 返回主菜单...")
    
    def export_menu(self):
        """导出菜单"""
        self.print_header("导出名片")
        
        print("\n  导出格式：")
        print("  [1] CSV 格式（可用 Excel 打开）")
        print("  [Enter] 返回")
        
        choice = input("\n  请选择：").strip()
        
        if choice == "1":
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"cards_export_{timestamp}.csv"
            self.manager.export_to_csv(filename)
        
        input("\n  按 Enter 返回主菜单...")
    
    def backup_menu(self):
        """备份菜单"""
        self.print_header("数据备份")
        
        print("\n  创建数据备份...")
        self.storage.backup()
        
        input("\n  按 Enter 返回主菜单...")
    
    def show_main_menu(self):
        """显示主菜单"""
        self.clear_screen()
        
        print("\n" + "=" * 60)
        print("           名 片 管 理 系 统")
        print("=" * 60)
        print(f"  当前名片数量：{len(self.manager.cards)} 张")
        print("-" * 60)
        print("  [1] 添加名片")
        print("  [2] 显示所有名片")
        print("  [3] 搜索名片")
        print("  [4] 数据统计")
        print("  [5] 导出名片")
        print("  [6] 数据备份")
        print("  [0] 退出系统")
        print("-" * 60)
    
    def run(self):
        """运行系统主循环"""
        while True:
            self.show_main_menu()
            
            choice = input("\n  请选择操作：").strip()
            
            if choice == "1":
                self.add_card_menu()
            elif choice == "2":
                self.show_all_menu()
            elif choice == "3":
                self.search_card_menu()
            elif choice == "4":
                self.statistics_menu()
            elif choice == "5":
                self.export_menu()
            elif choice == "6":
                self.backup_menu()
            elif choice == "0":
                print("\n  感谢使用名片管理系统，再见！")
                break
            else:
                print("\n  无效的选择，请重新输入")
                input("  按 Enter 继续...")


# 程序入口
if __name__ == "__main__":
    try:
        app = CardSystemUI()
        app.run()
    except KeyboardInterrupt:
        print("\n\n  系统已中断")
    except Exception as e:
        print(f"\n  系统错误：{e}")
```

用户界面模块是整个系统的"门面"。它负责与用户交互，调用业务逻辑模块完成操作，并向用户展示结果。这个模块的设计体现了几个重要原则：

**用户友好**：提供清晰的菜单、友好的提示信息和错误消息。使用表格展示名片列表，使用详细信息展示单张名片。

**输入验证**：在用户输入层面进行验证，及时反馈错误信息，引导用户输入正确的数据。

**防御性编程**：使用 `try/except` 捕获异常，防止程序崩溃。使用 `KeyboardInterrupt` 处理 Ctrl+C 中断。

**确认操作**：删除操作需要用户确认，防止误操作。

## 系统运行演示

以下是系统运行时的典型交互流程：

### 添加名片

```
============================================================
  添加新名片
============================================================

  请输入名片信息（带 * 的为必填项）：

  * 姓名：张三
  * 电话：13800138000
    邮箱（可选）：zhangsan@example.com
    公司（可选）：科技有限公司
    职位（可选）：软件工程师
    地址（可选）：北京市海淀区
    备注（可选）：技术交流

  [成功] 名片 '张三' 已添加！

  按 Enter 返回主菜单...
```

### 搜索名片

```
============================================================
  搜索名片
============================================================

  请输入搜索关键词（姓名/电话/公司）：科技

  找到 2 张相关名片：

  序号    姓名       电话            公司          职位        邮箱
  ----------------------------------------------------------------------
  0      张三       13800138000    科技有限公司    软件工程师    zhangsan@example.com
  1      李四       15900159000    科技有限公司    产品经理      lisi@example.com

  共 2 张名片

  操作选项：
  [V] 查看详情  [E] 编辑  [D] 删除  [Enter] 返回
```

## 项目总结

### 项目结构回顾

我们的名片管理系统包含以下文件：

```
card_system/
  ├── main.py           # 主程序（用户界面）
  ├── card_manager.py   # 名片管理业务逻辑
  ├── storage.py        # JSON 数据存储
  ├── validators.py     # 数据验证
  └── cards.json        # 数据文件（运行后自动生成）
```

### 技术要点回顾

这个项目综合运用了 Python 基础速通系列的所有知识点：

**变量与数据类型**：使用字符串存储姓名、电话等，使用字典存储名片信息，使用列表存储所有名片。

**列表与元组**：`self.cards` 是一个列表，存储所有名片字典。搜索功能返回 `[(索引, 名片), ...]` 的列表。

**字典与集合**：每张名片是一个字典，提供了灵活的字段访问。统计功能使用字典进行分组计数。

**字符串处理**：`strip()` 去除空白，`lower()` 实现不区分大小写的搜索，`startswith()` 和 `endswith()` 检查文件路径。

**条件语句**：菜单选择使用 `if/elif/else`，验证函数使用条件判断，删除操作使用确认逻辑。

**循环语句**：主程序使用 `while` 循环，名片展示使用 `for` 循环，输入验证使用 `while True` 循环。

**函数定义**：每个功能都封装为独立的函数，职责清晰，易于维护。

**模块化设计**：将系统分为验证、存储、管理和界面四个模块，符合单一职责原则。

**文件操作**：使用 `json` 模块进行数据持久化，使用 `with` 语句确保文件正确关闭。

**异常处理**：使用 `try/except` 处理文件读写错误、JSON 解析错误和用户输入错误。

### 扩展思考

这个名片管理系统还可以进一步扩展：

1. **GUI 界面**：使用 Tkinter 或 PyQt 创建图形界面
2. **数据库存储**：将 JSON 文件替换为 SQLite 数据库
3. **网络功能**：添加名片导入导出、云端同步
4. **高级搜索**：支持正则表达式搜索、多条件组合搜索
5. **标签系统**：为名片添加标签，支持按标签分类
6. **版本控制**：记录名片修改历史，支持回滚
7. **批量操作**：支持批量导入和批量删除
8. **打印功能**：生成可打印的名片格式

这些扩展功能可以作为你后续的学习项目。每个扩展都会涉及新的知识点，是提升编程能力的好方法。

## 总结

本文通过一个完整的名片管理系统项目，将 Python 基础速通系列的所有知识点进行了综合运用。从需求分析到数据结构设计，从模块划分到代码实现，我们完整地走了一遍小型项目的开发流程。

这个项目展示了如何将零散的语法知识组织成一个有实际价值的程序。你会看到，编程不仅仅是写代码，更是设计、组织和管理复杂性的过程。好的代码结构、清晰的命名、合理的注释、完善的错误处理——这些看似"额外"的工作，正是专业程序员和业余爱好者的区别所在。

完成这个项目后，你应当能够：
- 独立设计小型 Python 应用的数据结构
- 将系统合理划分为多个模块
- 实现完整的 CRUD 操作
- 使用 JSON 进行数据持久化
- 编写用户友好的命令行交互界面
- 处理各种异常和错误情况

在接下来的系列文章中，我们将进入 Python 函数与高级特性的学习。函数是代码复用的基本单位，装饰器、生成器、闭包等高级特性则是 Python 的精髓所在。掌握这些内容，你将能够编写更加优雅、高效的 Python 代码。

恭喜你完成了 Python 基础速通系列的学习！这是你编程之旅的一个重要里程碑。记住，编程是一门实践的技能——多写代码、多思考、多总结，你一定会越走越远。
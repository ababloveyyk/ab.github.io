---
title: Python面向对象与魔法方法Ⅴ——综合实战：名片系统类版本
date: 2026-07-26
tags:
  - Python
  - 面向对象
  - 综合实战
  - 名片管理
  - 魔法方法
categories:
  - Python
---

## 前言

在 Python 基础速通系列的第五篇文章中，我们使用面向过程的方式构建了一个名片管理系统。现在，让我们用面向对象的方式重构它，充分利用 Python 的 OOP 特性——类、继承、封装、属性装饰器、魔法方法等。

这个重构版本将展示面向对象编程的核心优势：更好的代码组织、更清晰的职责划分、更易于扩展和维护。我们将使用 `Person` 类来封装名片的属性和验证逻辑，使用 `ContactManager` 类来管理名片集合，使用魔法方法来提供更自然的接口。

## 项目结构

```
card_system_oop/
  ├── models.py          # 数据模型（Person类）
  ├── storage.py         # 数据持久化
  ├── contact_manager.py # 名片管理器
  └── main.py            # 主程序
```

## 完整代码

### 数据模型（models.py）

```python
"""
数据模型模块
定义 Person 类（名片）
"""

import re
from datetime import datetime


class Person:
    """名片类"""
    
    # 类属性：验证规则
    PHONE_PATTERN = re.compile(r'^1[3-9]\d{9}$')
    EMAIL_PATTERN = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    
    def __init__(self, name, phone, email="", company="",
                 position="", address="", notes=""):
        self._name = None
        self._phone = None
        self._email = ""
        self._company = ""
        self._position = ""
        self._address = ""
        self._notes = ""
        self._created_at = datetime.now()
        self._updated_at = None
        
        # 使用 setter 进行验证
        self.name = name
        self.phone = phone
        self.email = email
        self.company = company
        self.position = position
        self.address = address
        self.notes = notes
    
    # ========== 属性（带验证） ==========
    
    @property
    def name(self):
        return self._name
    
    @name.setter
    def name(self, value):
        value = value.strip() if value else ""
        if not value:
            raise ValueError("姓名不能为空")
        if len(value) < 2:
            raise ValueError("姓名至少需要2个字符")
        if len(value) > 20:
            raise ValueError("姓名不能超过20个字符")
        self._name = value
        self._touch()
    
    @property
    def phone(self):
        return self._phone
    
    @phone.setter
    def phone(self, value):
        value = value.strip() if value else ""
        if not self.PHONE_PATTERN.match(value):
            raise ValueError("手机号格式不正确")
        self._phone = value
        self._touch()
    
    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, value):
        value = value.strip() if value else ""
        if value and not self.EMAIL_PATTERN.match(value):
            raise ValueError("邮箱格式不正确")
        self._email = value
        self._touch()
    
    @property
    def company(self):
        return self._company
    
    @company.setter
    def company(self, value):
        self._company = value.strip() if value else ""
        self._touch()
    
    @property
    def position(self):
        return self._position
    
    @position.setter
    def position(self, value):
        self._position = value.strip() if value else ""
        self._touch()
    
    @property
    def address(self):
        return self._address
    
    @address.setter
    def address(self, value):
        self._address = value.strip() if value else ""
        self._touch()
    
    @property
    def notes(self):
        return self._notes
    
    @notes.setter
    def notes(self, value):
        self._notes = value.strip() if value else ""
        self._touch()
    
    @property
    def created_at(self):
        return self._created_at.strftime("%Y-%m-%d %H:%M:%S")
    
    @property
    def updated_at(self):
        if self._updated_at:
            return self._updated_at.strftime("%Y-%m-%d %H:%M:%S")
        return "未修改"
    
    @property
    def masked_phone(self):
        """脱敏手机号"""
        if self._phone:
            return f"{self._phone[:3]}****{self._phone[-4:]}"
        return ""
    
    # ========== 私有方法 ==========
    
    def _touch(self):
        """更新修改时间"""
        self._updated_at = datetime.now()
    
    # ========== 魔法方法 ==========
    
    def __str__(self):
        return f"《{self._name}》- {self._phone}"
    
    def __repr__(self):
        return (f"Person(name='{self._name}', phone='{self._phone}', "
                f"company='{self._company}')")
    
    def __eq__(self, other):
        """同名同电话视为同一人"""
        if isinstance(other, Person):
            return self._name == other._name and self._phone == other._phone
        return NotImplemented
    
    def __hash__(self):
        return hash((self._name, self._phone))
    
    def __contains__(self, keyword):
        """支持 'keyword' in person 语法"""
        keyword = keyword.lower()
        searchable = f"{self._name} {self._phone} {self._company} {self._email} {self._position}"
        return keyword in searchable.lower()
    
    # ========== 序列化方法 ==========
    
    def to_dict(self):
        """转换为字典（用于 JSON 序列化）"""
        return {
            "name": self._name,
            "phone": self._phone,
            "email": self._email,
            "company": self._company,
            "position": self._position,
            "address": self._address,
            "notes": self._notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
    
    @classmethod
    def from_dict(cls, data):
        """从字典创建 Person 实例"""
        return cls(
            name=data.get("name", ""),
            phone=data.get("phone", ""),
            email=data.get("email", ""),
            company=data.get("company", ""),
            position=data.get("position", ""),
            address=data.get("address", ""),
            notes=data.get("notes", ""),
        )
    
    # ========== 类方法 ==========
    
    @classmethod
    def validate_phone(cls, phone):
        """验证手机号格式"""
        return bool(cls.PHONE_PATTERN.match(phone.strip() if phone else ""))
    
    @classmethod
    def validate_email(cls, email):
        """验证邮箱格式"""
        if not email or not email.strip():
            return True
        return bool(cls.EMAIL_PATTERN.match(email.strip()))
```

### 数据持久化（storage.py）

```python
"""
数据存储模块
"""

import json
import os
from datetime import datetime


class JsonStorage:
    """JSON 文件存储"""
    
    def __init__(self, file_path="cards.json"):
        self._file_path = file_path
    
    @property
    def file_path(self):
        return self._file_path
    
    def load(self):
        """加载数据"""
        if not os.path.exists(self._file_path):
            return []
        try:
            with open(self._file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"警告：加载失败 ({e})")
            return []
    
    def save(self, data):
        """保存数据"""
        try:
            directory = os.path.dirname(self._file_path)
            if directory and not os.path.exists(directory):
                os.makedirs(directory)
            with open(self._file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except IOError as e:
            print(f"错误：保存失败 ({e})")
            return False
    
    def backup(self):
        """创建备份"""
        if not os.path.exists(self._file_path):
            return False
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"{self._file_path}.backup_{timestamp}"
        with open(self._file_path, "r", encoding="utf-8") as src:
            with open(backup_path, "w", encoding="utf-8") as dst:
                dst.write(src.read())
        print(f"备份已创建：{backup_path}")
        return True
```

### 名片管理器（contact_manager.py）

```python
"""
名片管理器模块
"""

from collections import Counter
from models import Person
from storage import JsonStorage


class ContactManager:
    """名片管理器"""
    
    def __init__(self, storage=None):
        self._storage = storage or JsonStorage()
        self._contacts = []
        self.load()
    
    def load(self):
        """从存储加载数据"""
        raw_data = self._storage.load()
        self._contacts = [Person.from_dict(d) for d in raw_data]
        print(f"已加载 {len(self._contacts)} 张名片")
    
    def save(self):
        """保存数据到存储"""
        data = [c.to_dict() for c in self._contacts]
        return self._storage.save(data)
    
    # ========== CRUD 操作 ==========
    
    def add(self, **kwargs):
        """添加名片"""
        try:
            person = Person(**kwargs)
            self._contacts.append(person)
            self.save()
            return True, person
        except ValueError as e:
            return False, str(e)
    
    def get_all(self):
        """获取所有名片"""
        return self._contacts.copy()
    
    def search(self, keyword):
        """搜索名片"""
        if not keyword or not keyword.strip():
            return [(i, c) for i, c in enumerate(self._contacts)]
        results = [(i, c) for i, c in enumerate(self._contacts) 
                   if keyword in c]
        return results
    
    def update(self, index, **kwargs):
        """更新名片"""
        if index < 0 or index >= len(self._contacts):
            return False, "索引无效"
        
        person = self._contacts[index]
        try:
            for key, value in kwargs.items():
                if hasattr(person, key):
                    setattr(person, key, value)
            person._touch()
            self.save()
            return True, person
        except ValueError as e:
            return False, str(e)
    
    def delete(self, index):
        """删除名片"""
        if index < 0 or index >= len(self._contacts):
            return False, None
        deleted = self._contacts.pop(index)
        self.save()
        return True, deleted
    
    # ========== 统计方法 ==========
    
    def get_statistics(self):
        """获取统计信息"""
        if not self._contacts:
            return {"total": 0}
        
        stats = {
            "total": len(self._contacts),
            "with_email": sum(1 for c in self._contacts if c.email),
            "with_company": sum(1 for c in self._contacts if c.company),
            "with_position": sum(1 for c in self._contacts if c.position),
        }
        
        companies = Counter(c.company for c in self._contacts if c.company)
        stats["companies"] = companies.most_common()
        
        return stats
    
    def export_csv(self, file_path):
        """导出为 CSV"""
        import csv
        if not self._contacts:
            return False
        
        fields = ["name", "phone", "email", "company", 
                  "position", "address", "notes"]
        with open(file_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            for c in self._contacts:
                writer.writerow({k: getattr(c, k) for k in fields})
        return True
    
    # ========== 魔法方法 ==========
    
    def __len__(self):
        return len(self._contacts)
    
    def __getitem__(self, index):
        return self._contacts[index]
    
    def __iter__(self):
        return iter(self._contacts)
    
    def __contains__(self, person):
        return person in self._contacts
    
    def __str__(self):
        return f"ContactManager({len(self._contacts)} contacts)"
```

### 主程序（main.py）

```python
"""
名片管理系统 - 主程序（OOP 版本）
"""

import os
import sys
from contact_manager import ContactManager
from models import Person


class ContactApp:
    """名片管理系统应用"""
    
    def __init__(self):
        self.manager = ContactManager()
    
    def clear_screen(self):
        os.system("cls" if sys.platform == "win32" else "clear")
    
    def print_header(self, title):
        print("\n" + "=" * 60)
        print(f"  {title}")
        print("=" * 60)
    
    def print_table(self, contacts, show_index=True):
        """打印名片表格"""
        if not contacts:
            print("\n  暂无名片数据")
            return
        
        if isinstance(contacts[0], tuple):
            card_list = contacts
        else:
            card_list = [(i, c) for i, c in enumerate(contacts)]
        
        print(f"\n  {'序号':<5} {'姓名':<8} {'电话':<14} {'公司':<12} {'职位':<10}")
        print("  " + "-" * 55)
        for idx, card in card_list:
            print(f"  {idx:<5} {card.name[:8]:<8} "
                  f"{card.masked_phone:<14} "
                  f"{card.company[:12]:<12} {card.position[:10]:<10}")
        print(f"\n  共 {len(card_list)} 张名片")
    
    def print_detail(self, person):
        """打印名片详情"""
        print("\n  " + "-" * 40)
        print(f"  姓名：{person.name}")
        print(f"  电话：{person.phone}")
        print(f"  邮箱：{person.email or '(未填写)'}")
        print(f"  公司：{person.company or '(未填写)'}")
        print(f"  职位：{person.position or '(未填写)'}")
        print(f"  地址：{person.address or '(未填写)'}")
        print(f"  备注：{person.notes or '(无)'}")
        print(f"  创建时间：{person.created_at}")
        print(f"  修改时间：{person.updated_at}")
        print("  " + "-" * 40)
    
    def add_menu(self):
        self.print_header("添加新名片")
        print("\n  请输入名片信息（带 * 的为必填项）：\n")
        
        name = input("  * 姓名：").strip()
        phone = input("  * 电话：").strip()
        email = input("    邮箱（可选）：").strip()
        company = input("    公司（可选）：").strip()
        position = input("    职位（可选）：").strip()
        address = input("    地址（可选）：").strip()
        notes = input("    备注（可选）：").strip()
        
        success, result = self.manager.add(
            name=name, phone=phone, email=email,
            company=company, position=position,
            address=address, notes=notes
        )
        
        if success:
            print(f"\n  [成功] 名片 '{result.name}' 已添加！")
        else:
            print(f"\n  [错误] {result}")
        
        input("\n  按 Enter 返回...")
    
    def show_all_menu(self):
        self.print_header("所有名片")
        self.print_table(self.manager.get_all())
        input("\n  按 Enter 返回...")
    
    def search_menu(self):
        self.print_header("搜索名片")
        keyword = input("\n  请输入搜索关键词：").strip()
        
        if not keyword:
            print("  关键词不能为空")
            input("\n  按 Enter 返回...")
            return
        
        results = self.manager.search(keyword)
        if not results:
            print(f"\n  未找到与 '{keyword}' 相关的名片")
            input("\n  按 Enter 返回...")
            return
        
        self.print_table(results)
        self._handle_search_actions(results)
        input("\n  按 Enter 返回...")
    
    def _handle_search_actions(self, results):
        print("\n  [V] 查看  [E] 编辑  [D] 删除  [Enter] 返回")
        choice = input("\n  请选择：").strip().upper()
        
        if choice in ("V", "E", "D"):
            try:
                idx = int(input("  请输入名片序号：").strip())
                valid = [i for i, _ in results]
                if idx not in valid:
                    print(f"  无效序号，请输入 {valid}")
                    return
                
                if choice == "V":
                    self.print_detail(self.manager[idx])
                elif choice == "E":
                    self._edit_card(idx)
                elif choice == "D":
                    self._delete_card(idx)
            except ValueError:
                print("  请输入有效数字")
    
    def _edit_card(self, index):
        person = self.manager[index]
        self.print_detail(person)
        
        print("\n  请输入新信息（回车保留原值）：")
        kwargs = {}
        for field in ["name", "phone", "email", "company", "position", "address", "notes"]:
            old = getattr(person, field)
            new = input(f"  {field} [{old}]: ").strip()
            if new:
                kwargs[field] = new
        
        if kwargs:
            success, result = self.manager.update(index, **kwargs)
            if success:
                print(f"\n  [成功] 名片已更新！")
            else:
                print(f"\n  [错误] {result}")
    
    def _delete_card(self, index):
        person = self.manager[index]
        self.print_detail(person)
        confirm = input(f"\n  确认删除 '{person.name}' 吗？(y/n)：").strip().lower()
        if confirm in ("y", "yes", "是"):
            success, deleted = self.manager.delete(index)
            if success:
                print(f"\n  [成功] 名片 '{deleted.name}' 已删除！")
    
    def stats_menu(self):
        self.print_header("数据统计")
        stats = self.manager.get_statistics()
        
        print(f"\n  名片总数：{stats.get('total', 0)}")
        print(f"  有邮箱：{stats.get('with_email', 0)}")
        print(f"  有公司：{stats.get('with_company', 0)}")
        print(f"  有职位：{stats.get('with_position', 0)}")
        
        companies = stats.get("companies", [])
        if companies:
            print(f"\n  公司分布：")
            for company, count in companies:
                print(f"    {company}: {count}")
        
        input("\n  按 Enter 返回...")
    
    def show_menu(self):
        self.clear_screen()
        print("\n" + "=" * 60)
        print("        名 片 管 理 系 统（OOP 版本）")
        print("=" * 60)
        print(f"  当前名片数量：{len(self.manager)} 张")
        print("-" * 60)
        print("  [1] 添加名片")
        print("  [2] 显示所有名片")
        print("  [3] 搜索名片")
        print("  [4] 数据统计")
        print("  [5] 导出 CSV")
        print("  [6] 数据备份")
        print("  [0] 退出系统")
        print("-" * 60)
    
    def run(self):
        while True:
            self.show_menu()
            choice = input("\n  请选择操作：").strip()
            
            if choice == "1":
                self.add_menu()
            elif choice == "2":
                self.show_all_menu()
            elif choice == "3":
                self.search_menu()
            elif choice == "4":
                self.stats_menu()
            elif choice == "5":
                from datetime import datetime
                self.manager.export_csv(f"cards_{datetime.now():%Y%m%d}.csv")
                print("\n  导出完成！")
                input("\n  按 Enter 返回...")
            elif choice == "6":
                self.manager._storage.backup()
                input("\n  按 Enter 返回...")
            elif choice == "0":
                print("\n  感谢使用，再见！")
                break
            else:
                print("\n  无效选择")
                input("  按 Enter 继续...")


if __name__ == "__main__":
    try:
        app = ContactApp()
        app.run()
    except KeyboardInterrupt:
        print("\n\n  系统已中断")
    except Exception as e:
        print(f"\n  系统错误：{e}")
```

## 面向对象 vs 面向过程对比

```python
# 对比：OOP 版本的优势
print("=" * 60)
print("OOP 版本的优势")
print("=" * 60)

# 1. 封装性：Person 类封装了验证逻辑
try:
    p = Person("A", "123")  # 姓名太短，手机号无效
except ValueError as e:
    print(f"1. 自动验证：{e}")

# 2. 属性访问：使用 @property 提供统一接口
p = Person("Alice", "13800138000", email="alice@example.com")
print(f"2. 属性访问：{p.name} - {p.masked_phone}")

# 3. 魔法方法：更自然的交互
p2 = Person("Alice", "13800138000")
print(f"3. 相等比较：{p == p2}")
print(f"4. 包含检查：{'alice' in p}")
print(f"5. 字符串表示：{p}")

# 4. 序列化：内置的 to_dict/from_dict
data = p.to_dict()
print(f"6. 序列化：{data}")
p3 = Person.from_dict(data)
print(f"7. 反序列化：{p3}")

# 5. 管理器 __len__ 和 __iter__
mgr = ContactManager()
mgr.add(name="Bob", phone="15900159000", company="Tech Co")
mgr.add(name="Charlie", phone="18800188000", company="Design Inc")
print(f"\n8. len(mgr): {len(mgr)}")
print(f"9. 迭代：")
for contact in mgr:
    print(f"   {contact}")
```

## 总结

本文通过面向对象方式重构了名片管理系统，展示了 OOP 的核心优势：

- **Person 类**：封装名片的属性和验证逻辑，使用 `@property` 实现属性访问和验证，使用魔法方法（`__str__`、`__eq__`、`__contains__`）提供自然接口
- **ContactManager 类**：管理名片集合，使用魔法方法（`__len__`、`__getitem__`、`__iter__`）提供容器接口
- **JsonStorage 类**：封装 JSON 持久化逻辑
- **ContactApp 类**：管理用户界面

OOP 版本的优势：代码组织更清晰、职责划分更明确、数据和操作封装在一起、更易于扩展和维护。至此，Python 面向对象与魔法方法系列全部完成。
---
title: Python面向对象与魔法方法Ⅰ——类与对象基础
date: 2026-07-26
tags:
  - Python
  - 面向对象
  - 类
  - 对象
  - OOP
categories:
  - Python
---

## 前言

面向对象编程（OOP）是现代软件开发中最主流的编程范式之一。Python 从诞生之初就支持面向对象编程，其 OOP 实现既简洁又强大。在 Python 中，一切都是对象——整数、字符串、列表、函数，甚至模块和类本身都是对象。

面向对象编程的核心思想是将数据（属性）和操作数据的方法（行为）封装在一起，形成一个"类"。类是一个模板或蓝图，定义了对象的属性和行为；对象是类的实例，是具体存在的实体。这种封装机制带来了代码重用、模块化和可维护性等诸多好处。

Python 的面向对象特性与 C++ 或 Java 有所不同。Python 的 OOP 更加灵活——它没有严格的访问控制（private/public），而是依赖约定（下划线前缀）来表达意图。Python 支持多重继承、鸭子类型、属性装饰器等独特特性，这些特性使得 Python 的面向对象编程既有静态语言的结构化，又有动态语言的灵活性。

## class 定义与实例化

### 基本类定义

```python
# 类定义基本语法
print("=" * 60)
print("类定义与实例化")
print("=" * 60)

class Dog:
    """一个简单的狗类"""
    
    # 类属性（所有实例共享）
    species = "Canis familiaris"
    
    # 实例方法
    def bark(self):
        return "Woof!"
    
    def describe(self):
        return f"This is a {self.species}"

# 创建实例
dog1 = Dog()
dog2 = Dog()

print(f"dog1.species: {dog1.species}")
print(f"dog2.species: {dog2.species}")
print(f"dog1.bark(): {dog1.bark()}")
print(f"dog1.describe(): {dog1.describe()}")

# 每个实例都是独立的对象
print(f"dog1 is dog2: {dog1 is dog2}")  # False
print(f"dog1 的类型: {type(dog1)}")       # <class '__main__.Dog'>
print(f"Dog 的类型: {type(Dog)}")        # <class 'type'>
```

### __init__ 构造方法

```python
# __init__ 构造方法
print("=" * 60)
print("__init__ 构造方法")
print("=" * 60)

class Dog:
    species = "Canis familiaris"
    
    def __init__(self, name, age):
        """构造方法，创建实例时自动调用"""
        self.name = name    # 实例属性
        self.age = age      # 实例属性
        print(f"创建了一只狗：{self.name} ({self.age} 岁)")
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def info(self):
        return f"{self.name} is {self.age} years old"

# 创建实例时自动调用 __init__
dog1 = Dog("Buddy", 3)
dog2 = Dog("Max", 5)

print(f"\ndog1.name: {dog1.name}")
print(f"dog2.name: {dog2.name}")
print(f"dog1.bark(): {dog1.bark()}")
print(f"dog2.info(): {dog2.info()}")
```

## 实例属性与类属性

```python
# 实例属性与类属性
print("=" * 60)
print("实例属性与类属性")
print("=" * 60)

class Student:
    # 类属性：所有实例共享
    school = "Python University"
    total_students = 0
    
    def __init__(self, name, grade):
        # 实例属性：每个实例独有
        self.name = name
        self.grade = grade
        Student.total_students += 1
    
    def info(self):
        return f"{self.name} ({self.grade} 年级) - {self.school}"

# 类属性在所有实例间共享
s1 = Student("Alice", 1)
s2 = Student("Bob", 2)
s3 = Student("Charlie", 3)

print(f"s1.info(): {s1.info()}")
print(f"s2.info(): {s2.info()}")
print(f"Student.total_students: {Student.total_students}")
print(f"s1.total_students: {s1.total_students}")

# 修改类属性
Student.school = "Python Global Academy"
print(f"\n修改类属性后：")
print(f"s1.school: {s1.school}")
print(f"s2.school: {s2.school}")

# 注意：通过实例修改类属性会创建实例属性
s1.school = "Custom School"  # 这创建了实例属性，不是修改类属性
print(f"\ns1.school: {s1.school}")       # Custom School
print(f"s2.school: {s2.school}")         # Python Global Academy
print(f"Student.school: {Student.school}") # Python Global Academy
```

## 实例方法与 self

```python
# 实例方法与 self
print("=" * 60)
print("实例方法与 self")
print("=" * 60)

class Calculator:
    def __init__(self, value=0):
        self.value = value
    
    def add(self, x):
        """self 指向调用该方法的实例"""
        self.value += x
        return self  # 返回 self 支持链式调用
    
    def subtract(self, x):
        self.value -= x
        return self
    
    def multiply(self, x):
        self.value *= x
        return self
    
    def get_value(self):
        return self.value

# 链式调用
calc = Calculator(10)
result = calc.add(5).multiply(2).subtract(3).get_value()
print(f"链式调用结果：{result}")  # (10+5)*2-3 = 27

# self 不是关键字，只是约定
class Example:
    def method(this, name):  # 可以使用其他名称，但强烈不推荐
        return f"Hello, {name}"

e = Example()
print(f"e.method('Alice'): {e.method('Alice')}")

# 方法也可以通过类调用（需要显式传递实例）
calc = Calculator(10)
Calculator.add(calc, 5)  # 等同于 calc.add(5)
print(f"通过类调用：{calc.get_value()}")
```

## 类方法与静态方法

```python
# 类方法与静态方法
print("=" * 60)
print("类方法 @classmethod 与静态方法 @staticmethod")
print("=" * 60)

class Date:
    """日期类"""
    
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
    
    # 实例方法：第一个参数是 self
    def display(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"
    
    # 类方法：第一个参数是 cls（类本身）
    @classmethod
    def from_string(cls, date_string):
        """从字符串创建 Date 实例（替代构造器）"""
        year, month, day = map(int, date_string.split("-"))
        return cls(year, month, day)
    
    @classmethod
    def from_dict(cls, data):
        """从字典创建 Date 实例"""
        return cls(data["year"], data["month"], data["day"])
    
    # 静态方法：不需要 self 或 cls
    @staticmethod
    def is_valid_date(year, month, day):
        """验证日期是否有效"""
        if month < 1 or month > 12:
            return False
        if day < 1 or day > 31:
            return False
        return True
    
    @staticmethod
    def month_name(month):
        """获取月份名称"""
        names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return names[month] if 1 <= month <= 12 else "Unknown"

# 使用不同的构造方式
d1 = Date(2024, 1, 15)
d2 = Date.from_string("2024-06-30")
d3 = Date.from_dict({"year": 2024, "month": 12, "day": 25})

print(f"d1: {d1.display()}")
print(f"d2: {d2.display()}")
print(f"d3: {d3.display()}")

# 使用静态方法
print(f"\nDate.is_valid_date(2024, 2, 30): {Date.is_valid_date(2024, 2, 30)}")
print(f"Date.month_name(6): {Date.month_name(6)}")

# 实战：类方法作为工厂方法
class Pizza:
    def __init__(self, ingredients):
        self.ingredients = ingredients
    
    def __repr__(self):
        return f"Pizza({self.ingredients})"
    
    @classmethod
    def margherita(cls):
        return cls(["mozzarella", "tomatoes", "basil"])
    
    @classmethod
    def pepperoni(cls):
        return cls(["mozzarella", "pepperoni", "tomato sauce"])
    
    @classmethod
    def hawaiian(cls):
        return cls(["mozzarella", "ham", "pineapple"])

print(f"\nPizza 工厂方法：")
print(f"  {Pizza.margherita()}")
print(f"  {Pizza.pepperoni()}")
print(f"  {Pizza.hawaiian()}")
```

## 访问控制

```python
# 访问控制（下划线约定）
print("=" * 60)
print("访问控制（下划线约定）")
print("=" * 60)

class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner            # 公开属性
        self._bank = "Python Bank"    # 受保护属性（约定）
        self.__balance = balance      # 私有属性（名称改编）
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"存入 {amount}，余额：{self.__balance}"
        return "存款金额无效"
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return f"取出 {amount}，余额：{self.__balance}"
        return "余额不足"
    
    def get_balance(self):
        return self.__balance
    
    # 私有方法
    def __validate(self, amount):
        return amount > 0

# 测试
account = BankAccount("Alice", 1000)

# 公开属性可以直接访问
print(f"owner: {account.owner}")

# 受保护属性可以访问（但不应这样做）
print(f"_bank: {account._bank}")

# 私有属性不能直接访问
try:
    print(account.__balance)
except AttributeError as e:
    print(f"访问 __balance: {e}")

# 但可以通过名称改编访问（不推荐）
print(f"_BankAccount__balance: {account._BankAccount__balance}")

# 正确的方式：使用公开方法
print(f"\n{account.deposit(500)}")
print(f"{account.withdraw(200)}")
print(f"余额：{account.get_balance()}")
```

## 综合实战：银行账户系统

```python
# 综合实战：银行账户系统
print("=" * 60)
print("综合实战：银行账户系统")
print("=" * 60)

from datetime import datetime

class Transaction:
    """交易记录"""
    def __init__(self, type_, amount, balance_after):
        self.type = type_
        self.amount = amount
        self.balance_after = balance_after
        self.timestamp = datetime.now()
    
    def __str__(self):
        return f"[{self.timestamp:%Y-%m-%d %H:%M}] {self.type}: ${self.amount:.2f} (余额: ${self.balance_after:.2f})"

class BankAccount:
    """银行账户"""
    interest_rate = 0.02  # 类属性：利率
    
    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self.__balance = initial_balance
        self.__transactions = []
        self.__account_number = self.__generate_account_number()
        
        if initial_balance > 0:
            self.__add_transaction("初始存款", initial_balance)
    
    def __generate_account_number(self):
        import random
        return f"ACC-{random.randint(100000, 999999)}"
    
    def __add_transaction(self, type_, amount):
        self.__transactions.append(Transaction(type_, amount, self.__balance))
    
    def deposit(self, amount):
        if amount <= 0:
            return False, "存款金额必须为正数"
        self.__balance += amount
        self.__add_transaction("存款", amount)
        return True, f"存款成功，余额：${self.__balance:.2f}"
    
    def withdraw(self, amount):
        if amount <= 0:
            return False, "取款金额必须为正数"
        if amount > self.__balance:
            return False, f"余额不足（当前余额：${self.__balance:.2f}）"
        self.__balance -= amount
        self.__add_transaction("取款", amount)
        return True, f"取款成功，余额：${self.__balance:.2f}"
    
    def transfer(self, target_account, amount):
        success, msg = self.withdraw(amount)
        if not success:
            return False, msg
        target_account.deposit(amount)
        return True, f"转账成功：${amount:.2f} -> {target_account.owner}"
    
    def get_balance(self):
        return self.__balance
    
    def get_transactions(self):
        return self.__transactions.copy()
    
    @classmethod
    def set_interest_rate(cls, rate):
        cls.interest_rate = rate
    
    @staticmethod
    def validate_amount(amount):
        return isinstance(amount, (int, float)) and amount > 0
    
    def __str__(self):
        return f"Account({self.__account_number}) - {self.owner}: ${self.__balance:.2f}"

# 测试
alice = BankAccount("Alice", 1000)
bob = BankAccount("Bob", 500)

print(f"初始状态：")
print(f"  {alice}")
print(f"  {bob}")

print(f"\n操作：")
print(f"  {alice.deposit(500)[1]}")
print(f"  {alice.withdraw(200)[1]}")
print(f"  {alice.transfer(bob, 300)[1]}")

print(f"\n最终状态：")
print(f"  {alice}")
print(f"  {bob}")

print(f"\nAlice 的交易记录：")
for t in alice.get_transactions():
    print(f"  {t}")

print(f"\n利率：{BankAccount.interest_rate}")
BankAccount.set_interest_rate(0.03)
print(f"调整后利率：{BankAccount.interest_rate}")
```

## 总结

本文介绍了 Python 面向对象编程的基础知识：

- **类定义与实例化**：使用 `class` 关键字，`__init__` 构造方法
- **实例属性与类属性**：实例属性每个对象独有，类属性所有实例共享
- **实例方法**：`self` 指向实例本身，支持链式调用
- **类方法**：`@classmethod`，`cls` 指向类本身，用作工厂方法
- **静态方法**：`@staticmethod`，不需要 `self` 或 `cls`，用于工具函数
- **访问控制**：`_protected`（约定），`__private`（名称改编），Python 依赖约定而非强制
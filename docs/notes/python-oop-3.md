---
title: Python面向对象与魔法方法Ⅲ——属性管理
date: 2026-07-26
tags:
  - Python
  - property
  - slots
  - 描述符
  - 属性管理
categories:
  - Python
---

## 前言

属性管理是面向对象编程中的一个重要话题。在 Python 中，属性管理不仅仅是简单的赋值和取值，还包括属性验证、计算属性、延迟加载、内存优化等高级功能。Python 提供了多种工具来管理属性访问：`@property` 装饰器、`__slots__` 机制和描述符协议。

`@property` 是 Python 中最常用的属性管理工具。它允许你将方法调用伪装成属性访问，实现"统一访问原则"——调用者不需要知道一个属性是直接存储的还是计算得出的。结合 `@setter` 和 `@deleter`，你可以完全控制属性的读取、设置和删除行为。

`__slots__` 是一个内存优化工具。它限制实例可以拥有的属性，避免为每个实例创建 `__dict__` 字典，从而显著减少内存占用。在需要创建大量实例的场景中（如游戏中的粒子、数据分析中的记录），`__slots__` 可以带来数倍的内存节省。

描述符是 `@property` 的底层实现机制。通过实现 `__get__`、`__set__` 和 `__delete__` 方法，你可以创建可复用的属性管理逻辑，将其应用于多个类。

## @property 装饰器

### 基本用法

```python
# @property 基本用法
print("=" * 60)
print("@property 基本用法")
print("=" * 60)

class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """获取半径"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置半径（带验证）"""
        if value <= 0:
            raise ValueError("半径必须为正数")
        self._radius = value
    
    @radius.deleter
    def radius(self):
        """删除半径"""
        print("删除半径")
        del self._radius
    
    @property
    def diameter(self):
        """计算属性：直径"""
        return self._radius * 2
    
    @property
    def area(self):
        """计算属性：面积"""
        import math
        return math.pi * self._radius ** 2

c = Circle(5)
print(f"radius: {c.radius}")
print(f"diameter: {c.diameter}")
print(f"area: {c.area:.2f}")

c.radius = 10
print(f"\n修改后 radius: {c.radius}")
print(f"修改后 diameter: {c.diameter}")

try:
    c.radius = -1
except ValueError as e:
    print(f"错误：{e}")
```

### 手机号合法性校验

```python
# @property 实战：手机号合法性校验
print("=" * 60)
print("@property 实战：手机号校验")
print("=" * 60)

import re

class Contact:
    def __init__(self, name, phone, email=""):
        self.name = name
        self.phone = phone      # 使用 setter 验证
        self.email = email      # 使用 setter 验证
    
    @property
    def phone(self):
        return self._phone
    
    @phone.setter
    def phone(self, value):
        if not re.match(r'^1[3-9]\d{9}$', value):
            raise ValueError(f"无效的手机号：{value}")
        self._phone = value
    
    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, value):
        if value and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise ValueError(f"无效的邮箱：{value}")
        self._email = value
    
    @property
    def masked_phone(self):
        """脱敏手机号"""
        return f"{self._phone[:3]}****{self._phone[-4:]}"
    
    def __repr__(self):
        return f"Contact(name='{self.name}', phone='{self.masked_phone}', email='{self._email}')"

# 测试
try:
    contact1 = Contact("Alice", "13800138000", "alice@example.com")
    print(f"contact1: {contact1}")
    print(f"  完整手机号：{contact1.phone}")
    print(f"  脱敏手机号：{contact1.masked_phone}")
    
    contact2 = Contact("Bob", "12345678901")  # 无效手机号
except ValueError as e:
    print(f"创建失败：{e}")

try:
    contact3 = Contact("Charlie", "15900159000", "invalid-email")
except ValueError as e:
    print(f"创建失败：{e}")
```

### 属性封装实战

```python
# 属性封装实战：温度转换器
print("=" * 60)
print("属性封装实战：温度转换器")
print("=" * 60)

class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("温度不能低于绝对零度 (-273.15°C)")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5/9
    
    @property
    def kelvin(self):
        return self._celsius + 273.15
    
    @kelvin.setter
    def kelvin(self, value):
        self.celsius = value - 273.15
    
    def __repr__(self):
        return (f"Temperature({self._celsius}°C, "
                f"{self.fahrenheit:.1f}°F, {self.kelvin:.1f}K)")

temp = Temperature(25)
print(f"初始：{temp}")

temp.fahrenheit = 98.6
print(f"设置华氏度后：{temp}")

temp.kelvin = 300
print(f"设置开尔文后：{temp}")
```

## __slots__ 优化内存

```python
# __slots__ 优化内存
print("=" * 60)
print("__slots__ 优化内存")
print("=" * 60)

import sys

class RegularClass:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

class SlottedClass:
    __slots__ = ['x', 'y', 'z']
    
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

# 内存对比
regular = RegularClass(1, 2, 3)
slotted = SlottedClass(1, 2, 3)

print(f"RegularClass 实例：{sys.getsizeof(regular)} bytes")
print(f"SlottedClass 实例：{sys.getsizeof(slotted)} bytes")

# 大量实例的内存对比
n = 100000
regular_list = [RegularClass(i, i+1, i+2) for i in range(n)]
slotted_list = [SlottedClass(i, i+1, i+2) for i in range(n)]

# 估算内存
regular_mem = sys.getsizeof(regular) * n
slotted_mem = sys.getsizeof(slotted) * n
print(f"\n{n} 个实例估算：")
print(f"  RegularClass: {regular_mem:,} bytes")
print(f"  SlottedClass: {slotted_mem:,} bytes")
print(f"  节省：{regular_mem - slotted_mem:,} bytes")

# __slots__ 的限制
# 不能添加新属性
try:
    slotted.new_attr = 100
except AttributeError as e:
    print(f"\n添加新属性：{e}")

# __slots__ 与继承
class Parent:
    __slots__ = ['x']

class Child(Parent):
    __slots__ = ['y']  # 子类需要定义自己的 __slots__

child = Child()
child.x = 1
child.y = 2
print(f"\nchild.x = {child.x}, child.y = {child.y}")
```

## 描述符初步

```python
# 描述符（Descriptor）
print("=" * 60)
print("描述符（Descriptor）")
print("=" * 60)

class ValidatedAttribute:
    """带验证的描述符"""
    
    def __init__(self, validator, error_msg="Invalid value"):
        self.validator = validator
        self.error_msg = error_msg
        self.data = {}  # 使用字典存储每个实例的值
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return self.data.get(instance, None)
    
    def __set__(self, instance, value):
        if not self.validator(value):
            raise ValueError(self.error_msg)
        self.data[instance] = value
    
    def __delete__(self, instance):
        self.data.pop(instance, None)

# 使用描述符
class Person:
    name = ValidatedAttribute(
        lambda v: isinstance(v, str) and len(v) >= 2,
        "姓名必须是至少2个字符的字符串"
    )
    age = ValidatedAttribute(
        lambda v: isinstance(v, int) and 0 <= v <= 150,
        "年龄必须是0-150之间的整数"
    )
    email = ValidatedAttribute(
        lambda v: isinstance(v, str) and '@' in v,
        "邮箱格式不正确"
    )
    
    def __init__(self, name, age, email=""):
        self.name = name
        self.age = age
        self.email = email
    
    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age}, email='{self.email}')"

# 测试
p1 = Person("Alice", 25, "alice@example.com")
p2 = Person("Bob", 30)
print(f"p1: {p1}")
print(f"p2: {p2}")

try:
    p3 = Person("A", 25)  # 姓名太短
except ValueError as e:
    print(f"错误：{e}")

try:
    p4 = Person("Charlie", 200)  # 年龄超出范围
except ValueError as e:
    print(f"错误：{e}")
```

## 综合实战：用户模型

```python
# 综合实战：用户模型
print("=" * 60)
print("综合实战：用户模型")
print("=" * 60)

import re
from datetime import datetime

class User:
    def __init__(self, username, password, email, phone=""):
        self._username = None
        self._password = None
        self._email = None
        self._phone = None
        self._created_at = datetime.now()
        self._last_login = None
        self._login_count = 0
        
        # 使用 setter 进行验证
        self.username = username
        self.password = password
        self.email = email
        self.phone = phone
    
    @property
    def username(self):
        return self._username
    
    @username.setter
    def username(self, value):
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', value):
            raise ValueError("用户名必须为3-20位字母数字下划线")
        self._username = value
    
    @property
    def password(self):
        return "******"  # 不暴露密码
    
    @password.setter
    def password(self, value):
        if len(value) < 6:
            raise ValueError("密码至少6位")
        if not any(c.isupper() for c in value):
            raise ValueError("密码需要至少一个大写字母")
        if not any(c.isdigit() for c in value):
            raise ValueError("密码需要至少一个数字")
        self._password = value  # 实际应存储哈希值
    
    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, value):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise ValueError("邮箱格式不正确")
        self._email = value
    
    @property
    def phone(self):
        return self._phone
    
    @phone.setter
    def phone(self, value):
        if value and not re.match(r'^1[3-9]\d{9}$', value):
            raise ValueError("手机号格式不正确")
        self._phone = value
    
    @property
    def age_days(self):
        """计算属性：账号存在天数"""
        return (datetime.now() - self._created_at).days
    
    def login(self):
        self._last_login = datetime.now()
        self._login_count += 1
    
    def __repr__(self):
        return (f"User(username='{self._username}', "
                f"email='{self._email}', "
                f"phone='{self._phone or 'N/A'}')")

# 测试
try:
    user = User("alice_wang", "Pass123", "alice@example.com", "13800138000")
    print(f"user: {user}")
    print(f"username: {user.username}")
    print(f"password: {user.password}")
    print(f"age_days: {user.age_days}")
    user.login()
    print(f"login_count: {user._login_count}")
except ValueError as e:
    print(f"创建失败：{e}")
```

## 总结

- **@property**：将方法伪装成属性，支持 getter/setter/deleter，实现统一访问原则
- **__slots__**：限制实例属性，节省内存，适合大量实例的场景
- **描述符**：`__get__`/`__set__`/`__delete__`，可复用的属性管理逻辑，是 @property 的底层实现
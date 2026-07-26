---
title: Python面向对象与魔法方法Ⅱ——继承与多态
date: 2026-07-26
tags:
  - Python
  - 继承
  - 多态
  - MRO
  - super
  - ABC
categories:
  - Python
---

## 前言

继承和多态是面向对象编程的两大支柱。继承允许新类从现有类中获取属性和方法，实现代码重用；多态允许不同类的对象对同一消息做出不同的响应，提高代码的灵活性。

Python 的继承机制非常灵活——它支持单继承、多继承和混合（Mixin）模式。每个类都有一个方法解析顺序（MRO），决定在多重继承情况下方法查找的顺序。`super()` 函数提供了一种标准化的方式来调用父类方法，特别是在多重继承中，它遵循 MRO 确保每个父类方法只被调用一次。

Python 的"鸭子类型"哲学意味着多态在 Python 中比静态类型语言更加自然——只要对象实现了所需的方法，它就可以被当作该类型使用，而不需要显式的继承关系。但抽象基类（ABC）提供了一种折中方案，允许你定义接口并强制子类实现特定方法。

## 单继承

```python
# 单继承
print("=" * 60)
print("单继承")
print("=" * 60)

class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return f"{self.name} makes a sound"
    
    def move(self):
        return f"{self.name} moves"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"
    
    def fetch(self):
        return f"{self.name} fetches the ball"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"
    
    def climb(self):
        return f"{self.name} climbs the tree"

dog = Dog("Buddy")
cat = Cat("Whiskers")

print(f"dog.speak(): {dog.speak()}")
print(f"dog.move(): {dog.move()}")
print(f"dog.fetch(): {dog.fetch()}")
print(f"cat.speak(): {cat.speak()}")
print(f"cat.climb(): {cat.climb()}")

# 检查继承关系
print(f"\nisinstance(dog, Dog): {isinstance(dog, Dog)}")
print(f"isinstance(dog, Animal): {isinstance(dog, Animal)}")
print(f"issubclass(Dog, Animal): {issubclass(Dog, Animal)}")
```

## 多继承与 MRO

```python
# 多继承与 MRO
print("=" * 60)
print("多继承与 MRO")
print("=" * 60)

class A:
    def method(self):
        return "A.method"

class B(A):
    def method(self):
        return "B.method"

class C(A):
    def method(self):
        return "C.method"

class D(B, C):
    pass

d = D()
print(f"d.method(): {d.method()}")  # B.method（MRO顺序）

# 查看 MRO
print(f"\nD.__mro__:")
for cls in D.__mro__:
    print(f"  {cls.__name__}")

# 菱形继承问题
class Base:
    def __init__(self):
        print("Base.__init__")

class Left(Base):
    def __init__(self):
        print("Left.__init__")
        super().__init__()

class Right(Base):
    def __init__(self):
        print("Right.__init__")
        super().__init__()

class Bottom(Left, Right):
    def __init__(self):
        print("Bottom.__init__")
        super().__init__()

print(f"\n菱形继承调用顺序：")
b = Bottom()
# super() 遵循 MRO，避免重复调用 Base.__init__
```

## super() 调用父类方法

```python
# super() 详解
print("=" * 60)
print("super() 详解")
print("=" * 60)

class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
    
    def __repr__(self):
        return f"Rectangle({self.width}, {self.height})"

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
        self.side = side
    
    def __repr__(self):
        return f"Square({self.side})"

class Cube(Square):
    def __init__(self, side):
        super().__init__(side)
    
    def volume(self):
        return self.side ** 3
    
    def surface_area(self):
        return 6 * super().area()
    
    def __repr__(self):
        return f"Cube({self.side})"

rect = Rectangle(3, 4)
square = Square(5)
cube = Cube(3)

print(f"rect.area(): {rect.area()}")
print(f"square.area(): {square.area()}")
print(f"cube.volume(): {cube.volume()}")
print(f"cube.surface_area(): {cube.surface_area()}")

# super() 的其他用法
class Parent:
    def greet(self):
        print("Parent says hello")

class Child(Parent):
    def greet(self):
        super().greet()  # 调用父类方法
        print("Child says hello")

child = Child()
print(f"\nchild.greet():")
child.greet()
```

## 鸭子类型与多态

```python
# 鸭子类型与多态
print("=" * 60)
print("鸭子类型与多态")
print("=" * 60)

# 鸭子类型：如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子
# 不需要显式继承，只需要实现所需的方法

class Duck:
    def quack(self):
        return "Quack!"
    def fly(self):
        return "Flap flap!"

class Person:
    def quack(self):
        return "I'm pretending to be a duck!"
    def fly(self):
        return "I can't really fly..."

class Dog:
    def bark(self):
        return "Woof!"

def make_it_quack(thing):
    """任何有 quack 方法的对象都可以传入"""
    return thing.quack()

print(f"make_it_quack(Duck()): {make_it_quack(Duck())}")
print(f"make_it_quack(Person()): {make_it_quack(Person())}")
# make_it_quack(Dog())  # AttributeError: 'Dog' object has no attribute 'quack'

# 多态示例
class PaymentProcessor:
    def process_payment(self, amount):
        raise NotImplementedError

class CreditCardPayment(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing credit card payment of ${amount:.2f}"

class PayPalPayment(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing PayPal payment of ${amount:.2f}"

class CryptoPayment(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing crypto payment of ${amount:.2f}"

def checkout(payment_method, amount):
    print(f"  {payment_method.process_payment(amount)}")

print("\n多态支付：")
checkout(CreditCardPayment(), 99.99)
checkout(PayPalPayment(), 49.50)
checkout(CryptoPayment(), 199.00)
```

## 抽象基类（ABC）

```python
# 抽象基类
print("=" * 60)
print("抽象基类（ABC）")
print("=" * 60)

from abc import ABC, abstractmethod, abstractproperty

class Shape(ABC):
    """抽象基类：所有形状的基类"""
    
    @abstractmethod
    def area(self):
        """计算面积"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """计算周长"""
        pass
    
    def describe(self):
        """非抽象方法（提供默认实现）"""
        return f"Area: {self.area():.2f}, Perimeter: {self.perimeter():.2f}"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

class Triangle(Shape):
    def __init__(self, a, b, c):
        self.a = a
        self.b = b
        self.c = c
    
    def area(self):
        import math
        s = (self.a + self.b + self.c) / 2
        return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))
    
    def perimeter(self):
        return self.a + self.b + self.c

# 不能实例化抽象类
# shape = Shape()  # TypeError

circle = Circle(5)
triangle = Triangle(3, 4, 5)

print(f"Circle: {circle.describe()}")
print(f"Triangle: {triangle.describe()}")

# 注册虚拟子类
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

Shape.register(Rectangle)  # 注册为虚拟子类
print(f"\nisinstance(Rectangle(3,4), Shape): {isinstance(Rectangle(3, 4), Shape)}")

# 抽象类方法
class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass
    
    @classmethod
    @abstractmethod
    def habitat(cls):
        pass

class Lion(Animal):
    def speak(self):
        return "Roar!"
    
    @classmethod
    def habitat(cls):
        return "Savanna"

lion = Lion()
print(f"\nlion.speak(): {lion.speak()}")
print(f"Lion.habitat(): {Lion.habitat()}")
```

## 综合实战：员工管理系统

```python
# 综合实战：员工管理系统
print("=" * 60)
print("综合实战：员工管理系统")
print("=" * 60)

from abc import ABC, abstractmethod

class Employee(ABC):
    """员工抽象基类"""
    employee_count = 0
    
    def __init__(self, name, employee_id, base_salary):
        self.name = name
        self.employee_id = employee_id
        self._base_salary = base_salary
        Employee.employee_count += 1
    
    @abstractmethod
    def calculate_salary(self):
        pass
    
    @abstractmethod
    def get_role(self):
        pass
    
    def get_info(self):
        return (f"[{self.get_role()}] {self.name} "
                f"(ID: {self.employee_id}) "
                f"Salary: ${self.calculate_salary():.2f}")
    
    @classmethod
    def get_count(cls):
        return cls.employee_count

class FullTimeEmployee(Employee):
    def __init__(self, name, employee_id, base_salary, bonus=0):
        super().__init__(name, employee_id, base_salary)
        self.bonus = bonus
    
    def calculate_salary(self):
        return self._base_salary + self.bonus
    
    def get_role(self):
        return "Full-Time"

class PartTimeEmployee(Employee):
    def __init__(self, name, employee_id, hourly_rate, hours_worked):
        super().__init__(name, employee_id, 0)
        self.hourly_rate = hourly_rate
        self.hours_worked = hours_worked
    
    def calculate_salary(self):
        return self.hourly_rate * self.hours_worked
    
    def get_role(self):
        return "Part-Time"

class Contractor(Employee):
    def __init__(self, name, employee_id, project_fee, project_name):
        super().__init__(name, employee_id, 0)
        self.project_fee = project_fee
        self.project_name = project_name
    
    def calculate_salary(self):
        return self.project_fee
    
    def get_role(self):
        return "Contractor"

class EmployeeManager:
    def __init__(self):
        self.employees = []
    
    def add_employee(self, employee):
        self.employees.append(employee)
    
    def get_total_payroll(self):
        return sum(emp.calculate_salary() for emp in self.employees)
    
    def list_employees(self):
        for emp in self.employees:
            print(f"  {emp.get_info()}")
    
    def get_by_role(self, role_class):
        return [emp for emp in self.employees if isinstance(emp, role_class)]

# 测试
manager = EmployeeManager()
manager.add_employee(FullTimeEmployee("Alice", "FT001", 5000, 1000))
manager.add_employee(FullTimeEmployee("Bob", "FT002", 5500, 800))
manager.add_employee(PartTimeEmployee("Charlie", "PT001", 25, 80))
manager.add_employee(PartTimeEmployee("David", "PT002", 30, 60))
manager.add_employee(Contractor("Eve", "CT001", 15000, "Website Redesign"))

print("所有员工：")
manager.list_employees()

print(f"\n总工资支出：${manager.get_total_payroll():.2f}")
print(f"员工总数：{Employee.get_count()}")

print(f"\n全职员工：")
for emp in manager.get_by_role(FullTimeEmployee):
    print(f"  {emp.get_info()}")
```

## 总结

本文介绍了继承与多态的核心概念：

- **单继承**：子类继承父类属性和方法，可重写父类方法
- **多继承**：Python 支持多继承，使用 MRO 确定方法查找顺序
- **super()**：遵循 MRO 调用父类方法，避免菱形继承中的重复调用
- **鸭子类型**：只要对象实现了所需方法即可使用，不依赖继承关系
- **抽象基类**：使用 `@abstractmethod` 强制子类实现方法，使用 `register()` 注册虚拟子类
---
title: Python面向对象与魔法方法Ⅳ——魔法方法详解
date: 2026-07-26
tags:
  - Python
  - 魔法方法
  - 运算符重载
  - __str__
  - __call__
categories:
  - Python
---

## 前言

魔法方法（Magic Methods），也称为特殊方法（Special Methods）或双下方法（Dunder Methods），是 Python 面向对象编程中最强大的特性之一。它们是 Python 内部使用的特殊方法，以双下划线开头和结尾（如 `__init__`、`__str__`、`__len__`）。通过实现这些方法，你可以让自定义对象支持 Python 的内置操作——让对象可以像列表一样用 `[]` 索引，像函数一样用 `()` 调用，像数字一样参与运算。

魔法方法的核心价值在于"Pythonic"——让自定义对象表现得像内置类型一样自然。当你实现 `__len__` 方法后，就可以在自定义对象上使用 `len()` 函数；当你实现 `__getitem__` 后，就可以使用 `obj[key]` 语法。这种一致性让代码更加直观和易于维护。

本文将详细介绍 Python 中最常用的魔法方法，包括字符串表示、容器模拟、可调用对象、迭代器和上下文管理器。我们还将通过一个完整的 BookShelf 类示例来展示如何综合运用这些魔法方法。

## __str__ 与 __repr__

```python
# __str__ 与 __repr__
print("=" * 60)
print("__str__ 与 __repr__")
print("=" * 60)

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __repr__(self):
        """开发者表示：应该返回一个有效的 Python 表达式"""
        return f"Person('{self.name}', {self.age})"
    
    def __str__(self):
        """用户表示：应该返回可读的字符串"""
        return f"{self.name} ({self.age} years old)"

p = Person("Alice", 25)

# str() 调用 __str__
print(f"str(p): {str(p)}")
print(f"print(p): {p}")

# repr() 调用 __repr__
print(f"repr(p): {repr(p)}")

# 在交互式环境中，直接输入对象会调用 __repr__
# 在列表、字典中也会调用 __repr__
people = [Person("Alice", 25), Person("Bob", 30)]
print(f"列表中的表示：{people}")

# 如果只定义了 __repr__，__str__ 会回退到 __repr__
class Simple:
    def __repr__(self):
        return "Simple()"

s = Simple()
print(f"只有 __repr__：{s}")  # 使用 __repr__
```

## __len__ 与 __bool__

```python
# __len__ 与 __bool__
print("=" * 60)
print("__len__ 与 __bool__")
print("=" * 60)

class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []
    
    def add_song(self, song):
        self.songs.append(song)
    
    def __len__(self):
        """支持 len() 函数"""
        return len(self.songs)
    
    def __bool__(self):
        """支持布尔上下文"""
        return len(self.songs) > 0
    
    def __repr__(self):
        return f"Playlist('{self.name}', {len(self)} songs)"

# 测试
empty_playlist = Playlist("Empty")
full_playlist = Playlist("Favorites")
full_playlist.add_song("Song 1")
full_playlist.add_song("Song 2")

print(f"len(empty_playlist): {len(empty_playlist)}")
print(f"len(full_playlist): {len(full_playlist)}")
print(f"bool(empty_playlist): {bool(empty_playlist)}")
print(f"bool(full_playlist): {bool(full_playlist)}")

# 在条件语句中自动调用 __bool__
if full_playlist:
    print(f"  {full_playlist.name} 有歌曲")
if not empty_playlist:
    print(f"  {empty_playlist.name} 没有歌曲")
```

## __getitem__ 与 __setitem__

```python
# __getitem__ 与 __setitem__
print("=" * 60)
print("__getitem__ 与 __setitem__")
print("=" * 60)

class Matrix:
    def __init__(self, rows, cols, default=0):
        self.rows = rows
        self.cols = cols
        self.data = [[default] * cols for _ in range(rows)]
    
    def __getitem__(self, index):
        """支持 matrix[row][col] 和 matrix[row, col]"""
        if isinstance(index, tuple):
            row, col = index
            self._validate(row, col)
            return self.data[row][col]
        return self.data[index]
    
    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            row, col = index
            self._validate(row, col)
            self.data[row][col] = value
        else:
            self.data[index] = value
    
    def _validate(self, row, col):
        if not (0 <= row < self.rows and 0 <= col < self.cols):
            raise IndexError(f"Index ({row}, {col}) out of range")
    
    def __len__(self):
        return self.rows
    
    def __repr__(self):
        lines = []
        for row in self.data:
            lines.append("  " + " ".join(f"{x:3}" for x in row))
        return "Matrix:\n" + "\n".join(lines)

m = Matrix(3, 4)
m[0, 0] = 1
m[1, 2] = 5
m[2, 3] = 9
print(f"m[0, 0] = {m[0, 0]}")
print(f"m[1, 2] = {m[1, 2]}")
print(m)
```

## __call__ 使实例可调用

```python
# __call__ 使实例可调用
print("=" * 60)
print("__call__ 使实例可调用")
print("=" * 60)

class Multiplier:
    def __init__(self, factor):
        self.factor = factor
    
    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
triple = Multiplier(3)
print(f"double(5) = {double(5)}")
print(f"triple(5) = {triple(5)}")

# 实际应用：带状态的函数
class Counter:
    def __init__(self, start=0):
        self.count = start
    
    def __call__(self):
        self.count += 1
        return self.count

counter = Counter()
print(f"\ncounter(): {[counter() for _ in range(5)]}")

# 实际应用：参数验证器
class Validator:
    def __init__(self, min_value, max_value):
        self.min_value = min_value
        self.max_value = max_value
    
    def __call__(self, value):
        if not (self.min_value <= value <= self.max_value):
            raise ValueError(f"Value must be between {self.min_value} and {self.max_value}")
        return value

age_validator = Validator(0, 150)
print(f"\nage_validator(25): {age_validator(25)}")
try:
    age_validator(200)
except ValueError as e:
    print(f"错误：{e}")
```

## __iter__ 与 __next__

```python
# __iter__ 与 __next__
print("=" * 60)
print("__iter__ 与 __next__")
print("=" * 60)

class Range:
    def __init__(self, start, end, step=1):
        self.start = start
        self.end = end
        self.step = step
    
    def __iter__(self):
        self.current = self.start
        return self
    
    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        value = self.current
        self.current += self.step
        return value
    
    def __len__(self):
        return max(0, (self.end - self.start + self.step - 1) // self.step)

r = Range(0, 10, 2)
print(f"len(r): {len(r)}")
print(f"list(r): {list(r)}")

# 支持 __contains__ 实现 in 运算符
class Range:
    def __init__(self, start, end, step=1):
        self.start = start
        self.end = end
        self.step = step
    
    def __iter__(self):
        self.current = self.start
        return self
    
    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        value = self.current
        self.current += self.step
        return value
    
    def __contains__(self, value):
        if self.step > 0:
            return self.start <= value < self.end and (value - self.start) % self.step == 0
        return False

r = Range(0, 20, 3)
print(f"\n6 in r: {6 in r}")
print(f"7 in r: {7 in r}")
```

## 运算符重载

```python
# 运算符重载
print("=" * 60)
print("运算符重载")
print("=" * 60)

class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        """+ 运算符"""
        if isinstance(other, Vector):
            return Vector(self.x + other.x, self.y + other.y)
        return NotImplemented
    
    def __sub__(self, other):
        """- 运算符"""
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        """* 运算符（标量乘法）"""
        if isinstance(scalar, (int, float)):
            return Vector(self.x * scalar, self.y * scalar)
        return NotImplemented
    
    def __rmul__(self, scalar):
        """右乘（当左侧不支持时）"""
        return self.__mul__(scalar)
    
    def __neg__(self):
        """负号"""
        return Vector(-self.x, -self.y)
    
    def __abs__(self):
        """绝对值 / 模长"""
        import math
        return math.sqrt(self.x ** 2 + self.y ** 2)
    
    def __eq__(self, other):
        """== 运算符"""
        if isinstance(other, Vector):
            return self.x == other.x and self.y == other.y
        return NotImplemented
    
    def __lt__(self, other):
        """< 运算符（按模长比较）"""
        return abs(self) < abs(other)
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(f"v1 + v2 = {v1 + v2}")
print(f"v1 - v2 = {v1 - v2}")
print(f"v1 * 3 = {v1 * 3}")
print(f"3 * v1 = {3 * v1}")
print(f"-v1 = {-v1}")
print(f"abs(v1) = {abs(v1)}")
print(f"v1 == v2: {v1 == v2}")
print(f"v1 < v2: {v1 < v2}")
```

## 综合实战：BookShelf 类

```python
# 综合实战：BookShelf 类
print("=" * 60)
print("综合实战：BookShelf 类")
print("=" * 60)

class Book:
    def __init__(self, title, author, isbn, pages, year):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.pages = pages
        self.year = year
    
    def __repr__(self):
        return f"Book('{self.title}', '{self.author}')"
    
    def __str__(self):
        return f"《{self.title}》- {self.author} ({self.year})"
    
    def __eq__(self, other):
        if isinstance(other, Book):
            return self.isbn == other.isbn
        return NotImplemented
    
    def __hash__(self):
        return hash(self.isbn)

class BookShelf:
    def __init__(self, name="My Bookshelf"):
        self.name = name
        self._books = []
    
    def add_book(self, book):
        self._books.append(book)
    
    def remove_book(self, isbn):
        for i, book in enumerate(self._books):
            if book.isbn == isbn:
                return self._books.pop(i)
        return None
    
    def __len__(self):
        """支持 len() 函数"""
        return len(self._books)
    
    def __bool__(self):
        """支持布尔上下文"""
        return len(self._books) > 0
    
    def __getitem__(self, index):
        """支持下标访问 shelf[0]"""
        return self._books[index]
    
    def __setitem__(self, index, book):
        """支持下标赋值 shelf[0] = book"""
        if not isinstance(book, Book):
            raise TypeError("Only Book objects can be added")
        self._books[index] = book
    
    def __contains__(self, book):
        """支持 in 运算符"""
        return book in self._books
    
    def __iter__(self):
        """支持迭代"""
        return iter(self._books)
    
    def __reversed__(self):
        """支持 reversed()"""
        return reversed(self._books)
    
    def __add__(self, other):
        """支持 + 运算符合并书架"""
        if isinstance(other, BookShelf):
            new_shelf = BookShelf(f"{self.name} + {other.name}")
            new_shelf._books = self._books + other._books
            return new_shelf
        return NotImplemented
    
    def __call__(self, author=None):
        """支持 shelf() 搜索"""
        if author is None:
            return self._books
        return [b for b in self._books if b.author == author]
    
    def __str__(self):
        return f"BookShelf('{self.name}', {len(self)} books)"
    
    def __repr__(self):
        return f"BookShelf('{self.name}', {self._books})"

# 测试
shelf1 = BookShelf("Classics")
shelf1.add_book(Book("1984", "George Orwell", "978-0451524935", 328, 1949))
shelf1.add_book(Book("To Kill a Mockingbird", "Harper Lee", "978-0446310789", 281, 1960))
shelf1.add_book(Book("Pride and Prejudice", "Jane Austen", "978-0141439518", 432, 1813))

shelf2 = BookShelf("Sci-Fi")
shelf2.add_book(Book("Dune", "Frank Herbert", "978-0441172719", 412, 1965))
shelf2.add_book(Book("Foundation", "Isaac Asimov", "978-0553293357", 244, 1951))

print(f"书架信息：")
print(f"  {shelf1}")
print(f"  {shelf2}")

print(f"\nlen(shelf1): {len(shelf1)}")
print(f"bool(shelf1): {bool(shelf1)}")

print(f"\n下标访问：")
print(f"  shelf1[0]: {shelf1[0]}")
print(f"  shelf1[-1]: {shelf1[-1]}")

print(f"\n切片访问：")
for book in shelf1[0:2]:
    print(f"  {book}")

print(f"\n迭代：")
for book in shelf1:
    print(f"  {book}")

print(f"\n反向迭代：")
for book in reversed(shelf1):
    print(f"  {book}")

print(f"\n合并书架：")
merged = shelf1 + shelf2
print(f"  {merged}")

print(f"\n可调用（搜索 Orwell 的书）：")
orwell_books = shelf1("George Orwell")
for book in orwell_books:
    print(f"  {book}")
```

## 总结

- **__str__/__repr__**：控制对象字符串表示
- **__len__/__bool__**：支持 len() 和布尔上下文
- **__getitem__/__setitem__**：支持下标访问和赋值
- **__call__**：使实例可调用
- **__iter__/__next__**：使对象可迭代
- **__enter__/__exit__**：支持 with 语句
- **运算符重载**：__add__/__sub__/__mul__/__eq__/__lt__ 等
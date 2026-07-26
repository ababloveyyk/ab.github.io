---
title: C++类与对象Ⅲ——运算符重载
date: 2026-07-26
tags:
  - C++
  - 运算符重载
  - 友元函数
  - 流运算符
categories:
  - C++
---

## 前言

运算符重载（Operator Overloading）是C++中一个强大而优雅的特性，它允许程序员为自定义类型定义运算符的行为，使得自定义类型的操作可以像内置类型一样自然。例如，你可以定义两个复数对象的加法运算、两个字符串对象的比较运算、一个向量对象的乘法运算等。

运算符重载的本质是函数重载的扩展——每个运算符对应一个名为`operator@`的函数（其中`@`代表运算符符号）。通过重载这些函数，我们可以赋予运算符新的语义。合理的运算符重载可以显著提升代码的可读性和表达力，但滥用也会导致代码难以理解。

## 运算符重载的基本规则

### 可重载的运算符

C++允许重载大多数运算符，但以下运算符不能被重载：

- `::` 作用域限定符
- `.` 成员访问运算符
- `.*` 成员指针访问运算符
- `?:` 三目条件运算符
- `sizeof` 大小运算符
- `typeid` 类型信息运算符
- `const_cast`、`dynamic_cast`、`static_cast`、`reinterpret_cast` 类型转换运算符

### 运算符重载的规则

1. **不能创建新的运算符**：只能重载已有的运算符。
2. **不能改变运算符的优先级和结合性**：重载不能改变运算符的优先级和结合性。
3. **不能改变运算符的操作数个数**：一元运算符保持一元，二元运算符保持二元。
4. **至少有一个操作数是用户自定义类型**：不能重载纯内置类型之间的运算符。
5. **保持运算符的自然语义**：重载后的运算符应该符合其常规含义。例如，`+`应该表示加法，`==`应该表示相等比较。

### 两种实现方式

运算符重载可以通过两种方式实现：

1. **成员函数重载**：运算符作为类的成员函数，左侧操作数是调用对象（`this`）。
2. **友元函数重载**：运算符作为类的友元函数，可以访问类的私有成员。

```cpp
#include <iostream>

class Number {
private:
    int value;

public:
    Number(int v = 0) : value(v) {}

    // 成员函数重载：+运算符
    // 左侧操作数是*this，右侧操作数是参数
    Number operator+(const Number& other) const {
        return Number(this->value + other.value);
    }

    // 成员函数重载：-运算符
    Number operator-(const Number& other) const {
        return Number(this->value - other.value);
    }

    int getValue() const { return value; }
};

int main() {
    Number a(10), b(20);
    Number c = a + b;  // 等价于 a.operator+(b)
    Number d = a - b;  // 等价于 a.operator-(b)

    std::cout << "a + b = " << c.getValue() << std::endl;
    std::cout << "a - b = " << d.getValue() << std::endl;

    return 0;
}
```

## 算术运算符重载

算术运算符包括`+`、`-`、`*`、`/`、`%`等。重载算术运算符时，通常应该返回一个新的对象（值语义），而不是修改操作数。

```cpp
#include <iostream>
#include <cmath>

class Vector2D {
private:
    double x, y;

public:
    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}

    // 加法运算符
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }

    // 减法运算符
    Vector2D operator-(const Vector2D& other) const {
        return Vector2D(x - other.x, y - other.y);
    }

    // 乘法运算符：标量乘法
    Vector2D operator*(double scalar) const {
        return Vector2D(x * scalar, y * scalar);
    }

    // 除法运算符：标量除法
    Vector2D operator/(double scalar) const {
        if (scalar != 0) {
            return Vector2D(x / scalar, y / scalar);
        }
        return *this;
    }

    // 点积（内积）
    double dot(const Vector2D& other) const {
        return x * other.x + y * other.y;
    }

    // 叉积（外积，二维向量的标量值）
    double cross(const Vector2D& other) const {
        return x * other.y - y * other.x;
    }

    // 向量模长
    double magnitude() const {
        return std::sqrt(x * x + y * y);
    }

    // 单位向量
    Vector2D normalized() const {
        double mag = magnitude();
        if (mag != 0) {
            return Vector2D(x / mag, y / mag);
        }
        return *this;
    }

    // 友元函数：标量左乘（scalar * vector）
    friend Vector2D operator*(double scalar, const Vector2D& vec) {
        return Vector2D(vec.x * scalar, vec.y * scalar);
    }

    // 负号运算符
    Vector2D operator-() const {
        return Vector2D(-x, -y);
    }

    void display() const {
        std::cout << "Vector2D(" << x << ", " << y << ")" << std::endl;
    }
};

int main() {
    std::cout << "====== 算术运算符重载 ======" << std::endl;

    Vector2D v1(3, 4);
    Vector2D v2(1, 2);

    std::cout << "v1 = "; v1.display();
    std::cout << "v2 = "; v2.display();

    Vector2D sum = v1 + v2;
    std::cout << "v1 + v2 = "; sum.display();

    Vector2D diff = v1 - v2;
    std::cout << "v1 - v2 = "; diff.display();

    Vector2D scaled = v1 * 2.5;
    std::cout << "v1 * 2.5 = "; scaled.display();

    Vector2D leftScaled = 3.0 * v1;  // 调用友元函数
    std::cout << "3.0 * v1 = "; leftScaled.display();

    Vector2D neg = -v1;
    std::cout << "-v1 = "; neg.display();

    std::cout << "v1 · v2 = " << v1.dot(v2) << std::endl;
    std::cout << "v1 × v2 = " << v1.cross(v2) << std::endl;
    std::cout << "|v1| = " << v1.magnitude() << std::endl;
    std::cout << "v1 normalized = "; v1.normalized().display();

    return 0;
}
```

### 复合赋值运算符

复合赋值运算符（`+=`、`-=`、`*=`、`/=`）通常返回`*this`的引用以支持链式操作：

```cpp
#include <iostream>

class Counter {
private:
    int value;

public:
    Counter(int v = 0) : value(v) {}

    // 复合赋值运算符：返回*this引用，支持链式调用
    Counter& operator+=(const Counter& other) {
        value += other.value;
        return *this;
    }

    Counter& operator-=(const Counter& other) {
        value -= other.value;
        return *this;
    }

    Counter& operator*=(int factor) {
        value *= factor;
        return *this;
    }

    Counter& operator/=(int divisor) {
        if (divisor != 0) value /= divisor;
        return *this;
    }

    // 通常，+运算符可以使用+=来实现
    Counter operator+(const Counter& other) const {
        Counter result = *this;
        result += other;
        return result;
    }

    int getValue() const { return value; }
    void display() const { std::cout << "Counter(" << value << ")" << std::endl; }
};

int main() {
    Counter c1(10), c2(5);

    c1 += c2;  // c1 = 15
    c1.display();

    c1 -= Counter(3);  // c1 = 12
    c1.display();

    c1 *= 2;  // c1 = 24
    c1.display();

    // 链式调用
    c1 += Counter(1) += Counter(1);
    c1.display();

    // 使用+运算符（基于+=实现）
    Counter c3 = c1 + c2;
    c3.display();

    return 0;
}
```

## 关系运算符重载

关系运算符包括`==`、`!=`、`<`、`>`、`<=`、`>=`。通常建议重载`==`和`<`，然后使用它们来实现其他关系运算符。

```cpp
#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int age;
    double score;

public:
    Student(const std::string& n = "", int a = 0, double s = 0.0)
        : name(n), age(a), score(s) {}

    // 相等比较
    bool operator==(const Student& other) const {
        return name == other.name && age == other.age;
    }

    // 不等比较（基于==实现）
    bool operator!=(const Student& other) const {
        return !(*this == other);
    }

    // 小于比较（按成绩排序）
    bool operator<(const Student& other) const {
        return score < other.score;
    }

    // 大于比较（基于<实现）
    bool operator>(const Student& other) const {
        return other < *this;
    }

    // 小于等于（基于<实现）
    bool operator<=(const Student& other) const {
        return !(other < *this);
    }

    // 大于等于（基于<实现）
    bool operator>=(const Student& other) const {
        return !(*this < other);
    }

    void display() const {
        std::cout << name << " | " << age << "岁 | 成绩: " << score << std::endl;
    }
};

int main() {
    std::cout << "====== 关系运算符重载 ======" << std::endl;

    Student s1("张三", 20, 92.5);
    Student s2("张三", 20, 85.0);
    Student s3("李四", 22, 96.0);

    s1.display();
    s2.display();
    s3.display();

    std::cout << "\ns1 == s2? " << (s1 == s2 ? "true" : "false") << std::endl;
    std::cout << "s1 != s3? " << (s1 != s3 ? "true" : "false") << std::endl;
    std::cout << "s1 < s3? " << (s1 < s3 ? "true" : "false") << " (按成绩)" << std::endl;
    std::cout << "s1 > s2? " << (s1 > s2 ? "true" : "false") << " (按成绩)" << std::endl;
    std::cout << "s1 <= s3? " << (s1 <= s3 ? "true" : "false") << std::endl;
    std::cout << "s1 >= s2? " << (s1 >= s2 ? "true" : "false") << std::endl;

    return 0;
}
```

## 赋值运算符重载

赋值运算符`=`的重载在之前的文章中已经涉及，这里重点讨论其规范写法：

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

class Buffer {
private:
    char* data;
    size_t size;

public:
    Buffer(size_t s = 0) : size(s), data(s > 0 ? new char[s] : nullptr) {
        std::cout << "Buffer(" << size << ") 构造" << std::endl;
    }

    // 拷贝构造函数
    Buffer(const Buffer& other) : size(other.size), data(nullptr) {
        if (size > 0) {
            data = new char[size];
            std::copy(other.data, other.data + size, data);
        }
        std::cout << "Buffer(" << size << ") 拷贝构造" << std::endl;
    }

    // 移动构造函数
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
        std::cout << "Buffer(" << size << ") 移动构造" << std::endl;
    }

    // 拷贝赋值运算符（标准写法）
    Buffer& operator=(const Buffer& other) {
        std::cout << "Buffer 拷贝赋值" << std::endl;
        if (this != &other) {
            // 使用copy-and-swap或直接实现
            char* newData = nullptr;
            if (other.size > 0) {
                newData = new char[other.size];
                std::copy(other.data, other.data + other.size, newData);
            }
            delete[] data;
            data = newData;
            size = other.size;
        }
        return *this;
    }

    // 移动赋值运算符
    Buffer& operator=(Buffer&& other) noexcept {
        std::cout << "Buffer 移动赋值" << std::endl;
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }

    ~Buffer() {
        delete[] data;
        std::cout << "Buffer(" << size << ") 析构" << std::endl;
    }

    size_t getSize() const { return size; }
};

int main() {
    std::cout << "====== 赋值运算符重载 ======" << std::endl;

    Buffer b1(10);
    Buffer b2(20);
    Buffer b3(30);

    std::cout << "\n拷贝赋值:" << std::endl;
    b2 = b1;
    std::cout << "b2.size = " << b2.getSize() << std::endl;

    std::cout << "\n移动赋值:" << std::endl;
    b3 = std::move(b1);
    std::cout << "b3.size = " << b3.getSize() << std::endl;
    std::cout << "b1.size = " << b1.getSize() << " (已被移动)" << std::endl;

    std::cout << "\n====== 程序结束 ======" << std::endl;
    return 0;
}
```

## 自增自减运算符重载

自增（`++`）和自减（`--`）运算符有前置和后置两种形式。C++使用占位参数来区分：前置版本无参数，后置版本有一个`int`占位参数。

```cpp
#include <iostream>

class SmartPointer {
private:
    int* ptr;

public:
    SmartPointer(int* p = nullptr) : ptr(p) {}

    // 前置++：先自增，再返回
    SmartPointer& operator++() {
        ++ptr;  // 指针向前移动
        return *this;
    }

    // 后置++：先返回旧值，再自增
    SmartPointer operator++(int) {
        SmartPointer temp = *this;
        ++ptr;
        return temp;
    }

    // 前置--：先自减，再返回
    SmartPointer& operator--() {
        --ptr;
        return *this;
    }

    // 后置--：先返回旧值，再自减
    SmartPointer operator--(int) {
        SmartPointer temp = *this;
        --ptr;
        return temp;
    }

    int& operator*() { return *ptr; }
    const int& operator*() const { return *ptr; }

    int* get() const { return ptr; }
};

class Time {
private:
    int hours;
    int minutes;
    int seconds;

    void normalize() {
        if (seconds >= 60) { minutes += seconds / 60; seconds %= 60; }
        if (seconds < 0) { minutes -= 1 + (-seconds) / 60; seconds = 60 - (-seconds) % 60; }
        if (minutes >= 60) { hours += minutes / 60; minutes %= 60; }
        if (minutes < 0) { hours -= 1 + (-minutes) / 60; minutes = 60 - (-minutes) % 60; }
        if (hours >= 24) hours %= 24;
        if (hours < 0) hours = 24 - (-hours) % 24;
    }

public:
    Time(int h = 0, int m = 0, int s = 0) : hours(h), minutes(m), seconds(s) {
        normalize();
    }

    // 前置++：增加1秒
    Time& operator++() {
        ++seconds;
        normalize();
        return *this;
    }

    // 后置++：增加1秒，返回旧值
    Time operator++(int) {
        Time temp = *this;
        ++(*this);  // 调用前置++
        return temp;
    }

    // 前置--：减少1秒
    Time& operator--() {
        --seconds;
        normalize();
        return *this;
    }

    // 后置--：减少1秒，返回旧值
    Time operator--(int) {
        Time temp = *this;
        --(*this);
        return temp;
    }

    void display() const {
        std::cout << (hours < 10 ? "0" : "") << hours << ":"
                  << (minutes < 10 ? "0" : "") << minutes << ":"
                  << (seconds < 10 ? "0" : "") << seconds << std::endl;
    }
};

int main() {
    std::cout << "====== 自增自减运算符重载 ======" << std::endl;

    // SmartPointer演示
    int arr[] = {10, 20, 30, 40, 50};
    SmartPointer sp(arr);

    std::cout << "初始值: " << *sp << std::endl;

    ++sp;
    std::cout << "前置++后: " << *sp << std::endl;

    SmartPointer sp2 = sp++;  // 后置++
    std::cout << "后置++后: sp=" << *sp << ", sp2=" << *sp2 << std::endl;

    --sp;
    std::cout << "前置--后: " << *sp << std::endl;

    std::cout << "\n====== Time演示 ======" << std::endl;
    Time t(23, 59, 58);
    std::cout << "初始时间: "; t.display();

    std::cout << "前置++: "; (++t).display();
    std::cout << "前置++: "; (++t).display();
    std::cout << "后置++: "; (t++).display();
    std::cout << "当前时间: "; t.display();

    std::cout << "前置--: "; (--t).display();
    std::cout << "后置--: "; (t--).display();
    std::cout << "当前时间: "; t.display();

    return 0;
}
```

## 流运算符重载

流运算符`<<`和`>>`是最常用的运算符重载场景之一。由于左侧操作数是`std::ostream`或`std::istream`对象，流运算符通常作为友元函数重载。

```cpp
#include <iostream>
#include <string>
#include <iomanip>

class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 友元函数：输出运算符
    friend std::ostream& operator<<(std::ostream& os, const Complex& c) {
        os << c.real;
        if (c.imag >= 0) {
            os << " + " << c.imag << "i";
        } else {
            os << " - " << -c.imag << "i";
        }
        return os;
    }

    // 友元函数：输入运算符
    friend std::istream& operator>>(std::istream& is, Complex& c) {
        std::cout << "输入实部: ";
        is >> c.real;
        std::cout << "输入虚部: ";
        is >> c.imag;
        return is;
    }

    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }
};

class Matrix2x2 {
private:
    double data[2][2];

public:
    Matrix2x2(double a11 = 1, double a12 = 0,
              double a21 = 0, double a22 = 1) {
        data[0][0] = a11; data[0][1] = a12;
        data[1][0] = a21; data[1][1] = a22;
    }

    friend std::ostream& operator<<(std::ostream& os, const Matrix2x2& m) {
        os << "┌" << std::setw(8) << m.data[0][0]
           << std::setw(8) << m.data[0][1] << " ┐" << std::endl;
        os << "└" << std::setw(8) << m.data[1][0]
           << std::setw(8) << m.data[1][1] << " ┘";
        return os;
    }

    Matrix2x2 operator*(const Matrix2x2& other) const {
        Matrix2x2 result;
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                result.data[i][j] = 0;
                for (int k = 0; k < 2; k++) {
                    result.data[i][j] += data[i][k] * other.data[k][j];
                }
            }
        }
        return result;
    }
};

class Person {
private:
    std::string name;
    int age;
    std::string city;

public:
    Person(const std::string& n = "", int a = 0, const std::string& c = "")
        : name(n), age(a), city(c) {}

    friend std::ostream& operator<<(std::ostream& os, const Person& p) {
        os << "姓名: " << p.name << std::endl;
        os << "年龄: " << p.age << " 岁" << std::endl;
        os << "城市: " << p.city;
        return os;
    }

    friend std::istream& operator>>(std::istream& is, Person& p) {
        std::cout << "请输入姓名: ";
        std::getline(is, p.name);
        std::cout << "请输入年龄: ";
        is >> p.age;
        is.ignore();  // 忽略换行符
        std::cout << "请输入城市: ";
        std::getline(is, p.city);
        return is;
    }
};

int main() {
    std::cout << "====== 流运算符重载 ======" << std::endl;

    // Complex示例
    std::cout << "\n--- 复数示例 ---" << std::endl;
    Complex c1(3, 4);
    Complex c2(1, -2);
    std::cout << "c1 = " << c1 << std::endl;
    std::cout << "c2 = " << c2 << std::endl;
    std::cout << "c1 + c2 = " << (c1 + c2) << std::endl;

    // Matrix示例
    std::cout << "\n--- 矩阵示例 ---" << std::endl;
    Matrix2x2 m1(1, 2, 3, 4);
    Matrix2x2 m2(2, 0, 1, 2);
    std::cout << "M1 = " << std::endl << m1 << std::endl;
    std::cout << "\nM2 = " << std::endl << m2 << std::endl;
    std::cout << "\nM1 * M2 = " << std::endl << (m1 * m2) << std::endl;

    // Person示例
    std::cout << "\n--- Person示例 ---" << std::endl;
    Person p1("张三", 25, "北京");
    std::cout << p1 << std::endl;

    return 0;
}
```

## 下标运算符重载

下标运算符`[]`通常用于容器类，提供类似数组的访问方式：

```cpp
#include <iostream>
#include <stdexcept>
#include <initializer_list>
#include <algorithm>

class IntArray {
private:
    int* data;
    size_t size;

public:
    IntArray() : data(nullptr), size(0) {}

    IntArray(std::initializer_list<int> init) : size(init.size()) {
        data = new int[size];
        std::copy(init.begin(), init.end(), data);
    }

    ~IntArray() { delete[] data; }

    // 非const版本：返回引用，可以修改
    int& operator[](size_t index) {
        if (index >= size) {
            throw std::out_of_range("下标越界！");
        }
        return data[index];
    }

    // const版本：返回const引用，只能读取
    const int& operator[](size_t index) const {
        if (index >= size) {
            throw std::out_of_range("下标越界！");
        }
        return data[index];
    }

    size_t getSize() const { return size; }

    friend std::ostream& operator<<(std::ostream& os, const IntArray& arr) {
        os << "[";
        for (size_t i = 0; i < arr.size; i++) {
            if (i > 0) os << ", ";
            os << arr.data[i];
        }
        os << "]";
        return os;
    }
};

int main() {
    std::cout << "====== 下标运算符重载 ======" << std::endl;

    IntArray arr = {10, 20, 30, 40, 50};
    std::cout << "Array: " << arr << std::endl;

    std::cout << "arr[0] = " << arr[0] << std::endl;
    std::cout << "arr[2] = " << arr[2] << std::endl;
    std::cout << "arr[4] = " << arr[4] << std::endl;

    // 修改元素
    arr[2] = 999;
    std::cout << "修改后: " << arr << std::endl;

    // 遍历
    std::cout << "遍历: ";
    for (size_t i = 0; i < arr.getSize(); i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    // 越界测试
    try {
        std::cout << arr[10] << std::endl;
    } catch (const std::exception& e) {
        std::cout << "异常: " << e.what() << std::endl;
    }

    return 0;
}
```

## 函数调用运算符重载

函数调用运算符`()`使得对象可以像函数一样被调用，这种对象称为"函数对象"或"仿函数"（Functor）：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

// 函数对象：加法器
class Adder {
private:
    int base;

public:
    Adder(int b = 0) : base(b) {}

    int operator()(int x) const {
        return base + x;
    }

    int operator()(int x, int y) const {
        return base + x + y;
    }
};

// 函数对象：范围检查器
class InRange {
private:
    int low, high;

public:
    InRange(int l, int h) : low(l), high(h) {}

    bool operator()(int value) const {
        return value >= low && value <= high;
    }
};

// 函数对象：累加器
class Accumulator {
private:
    int sum;
    int count;

public:
    Accumulator() : sum(0), count(0) {}

    void operator()(int value) {
        sum += value;
        count++;
    }

    int getSum() const { return sum; }
    int getCount() const { return count; }
    double getAverage() const {
        return count > 0 ? static_cast<double>(sum) / count : 0.0;
    }
};

// 函数对象：乘法器
class Multiplier {
private:
    double factor;

public:
    Multiplier(double f) : factor(f) {}

    double operator()(double x) const {
        return x * factor;
    }
};

int main() {
    std::cout << "====== 函数调用运算符重载 ======" << std::endl;

    // Adder
    Adder add5(5);
    std::cout << "add5(10) = " << add5(10) << std::endl;
    std::cout << "add5(10, 20) = " << add5(10, 20) << std::endl;

    // InRange
    InRange inRange(10, 50);
    std::cout << "inRange(25) = " << (inRange(25) ? "true" : "false") << std::endl;
    std::cout << "inRange(5) = " << (inRange(5) ? "true" : "false") << std::endl;

    // Accumulator
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    Accumulator acc = std::for_each(numbers.begin(), numbers.end(), Accumulator());
    std::cout << "Sum: " << acc.getSum() << std::endl;
    std::cout << "Count: " << acc.getCount() << std::endl;
    std::cout << "Average: " << acc.getAverage() << std::endl;

    // Multiplier
    std::vector<double> values = {1.0, 2.0, 3.0, 4.0, 5.0};
    std::transform(values.begin(), values.end(), values.begin(), Multiplier(2.5));
    std::cout << "After transform (x2.5): ";
    for (double v : values) {
        std::cout << v << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

## 总结

本文详细介绍了C++中运算符重载的各个方面，包括重载规则、两种实现方式以及各种常用运算符的重载方法。

### 核心要点回顾

1. **运算符重载规则**：不能创建新运算符，不能改变优先级和结合性，至少有一个操作数是用户自定义类型，保持运算符的自然语义。

2. **两种实现方式**：成员函数重载（左侧操作数是`this`）和友元函数重载（可以访问私有成员，左右操作数都是参数）。流运算符通常使用友元函数重载。

3. **算术运算符**：`+`、`-`、`*`、`/`等通常返回新对象（值语义）。复合赋值运算符（`+=`、`-=`等）返回`*this`引用以支持链式调用。

4. **关系运算符**：`==`、`<`是基础，其他运算符（`!=`、`>`、`<=`、`>=`）可以基于它们实现，减少代码重复。

5. **赋值运算符**：拷贝赋值和移动赋值都需要检查自赋值/自移动。移动赋值应该标记为`noexcept`。

6. **自增自减运算符**：前置版本返回引用，后置版本使用占位参数`int`并返回值。

7. **流运算符**：`<<`和`>>`通常作为友元函数重载，接受`std::ostream&`/`std::istream&`作为第一个参数。

8. **下标运算符**：`[]`提供数组式访问，需要同时提供const和非const版本。

9. **函数调用运算符**：`()`使对象可以像函数一样调用，用于创建函数对象（仿函数）。

在下一篇文章中，我们将学习C++类与对象的静态成员与友元，包括静态成员变量/函数、友元函数/类、const成员函数和mutable关键字。
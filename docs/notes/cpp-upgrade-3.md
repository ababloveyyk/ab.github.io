---
title: C++对C的升级Ⅲ——函数增强
date: 2026-07-26
tags:
  - C++
  - 函数重载
  - 默认参数
  - 内联函数
categories:
  - C++
---

## 前言

函数是程序的基本构建块。C++在C语言函数的基础上进行了多方面的增强，引入了函数重载（Overload）、默认参数（Default Arguments）、内联函数（Inline Function）等特性。这些特性不仅提升了代码的可读性和可维护性，也为面向对象编程和泛型编程奠定了基础。

本文将从函数重载的原理出发，深入探讨重载决议规则、默认参数的使用和陷阱、内联函数的机制和应用，以及这些特性之间的相互影响。通过大量可运行的代码示例，帮助读者全面掌握C++函数的增强特性。

## 函数重载

### 什么是函数重载

函数重载（Function Overloading）是C++中最重要的特性之一，它允许在同一作用域内定义多个同名函数，只要这些函数的参数列表不同（参数个数不同、参数类型不同、或参数顺序不同）。函数重载使得程序员可以使用同一个函数名来处理不同类型或不同数量的参数，大大提高了代码的可读性和一致性。

在C语言中，如果需要处理不同类型的数据，必须使用不同的函数名，例如`abs`、`labs`、`fabs`分别用于int、long、double的绝对值。而在C++中，可以使用重载实现统一的接口：

```cpp
#include <iostream>
#include <cmath>

// C++函数重载：同一个函数名，不同的参数类型
int absolute(int x) {
    std::cout << "absolute(int) called" << std::endl;
    return x < 0 ? -x : x;
}

long absolute(long x) {
    std::cout << "absolute(long) called" << std::endl;
    return x < 0 ? -x : x;
}

double absolute(double x) {
    std::cout << "absolute(double) called" << std::endl;
    return x < 0 ? -x : x;
}

float absolute(float x) {
    std::cout << "absolute(float) called" << std::endl;
    return x < 0 ? -x : x;
}

int main() {
    std::cout << absolute(-10) << std::endl;       // 调用absolute(int)
    std::cout << absolute(-100L) << std::endl;      // 调用absolute(long)
    std::cout << absolute(-3.14) << std::endl;      // 调用absolute(double)
    std::cout << absolute(-2.5f) << std::endl;      // 调用absolute(float)

    return 0;
}
```

### 函数重载的规则

函数重载需要满足以下条件：

1. **函数名相同**：这是重载的基本前提。
2. **参数列表不同**：参数个数不同，或者参数类型不同，或者参数顺序不同。
3. **在同一作用域内**：不同作用域的函数不构成重载（可能构成隐藏）。
4. **返回值类型不同不构成重载**：仅返回值类型不同不能作为重载的依据。

```cpp
#include <iostream>

// 重载1：参数个数不同
void print() {
    std::cout << "print(): no arguments" << std::endl;
}

void print(int x) {
    std::cout << "print(int): " << x << std::endl;
}

void print(int x, int y) {
    std::cout << "print(int, int): " << x << ", " << y << std::endl;
}

void print(int x, double y) {
    std::cout << "print(int, double): " << x << ", " << y << std::endl;
}

// 重载2：参数类型不同
void print(double x) {
    std::cout << "print(double): " << x << std::endl;
}

void print(const char* str) {
    std::cout << "print(const char*): " << str << std::endl;
}

// 重载3：参数顺序不同
void print(double x, int y) {
    std::cout << "print(double, int): " << x << ", " << y << std::endl;
}

// 错误示例：仅返回值类型不同，不构成重载
// int print(int x) { return x; }  // 编译错误！与void print(int x)冲突

int main() {
    print();                    // 调用print()
    print(42);                  // 调用print(int)
    print(3.14);                // 调用print(double)
    print("Hello");             // 调用print(const char*)
    print(10, 20);              // 调用print(int, int)
    print(10, 3.14);            // 调用print(int, double)
    print(3.14, 10);            // 调用print(double, int)

    return 0;
}
```

### 函数重载的底层原理：Name Mangling

函数重载是如何实现的呢？C语言不支持函数重载，因为C编译器生成的符号名就是函数名本身（可能会加下划线前缀）。如果两个函数同名，链接器就会产生冲突。

C++通过**名字修饰（Name Mangling）**技术来实现函数重载。编译器根据函数名和参数类型生成一个唯一的内部符号名，这样即使函数名相同，只要参数列表不同，生成的符号名也不同，链接器就不会产生冲突。

不同的编译器有不同的名字修饰规则，但基本原理相同。以GCC为例：

```cpp
// 以下函数在GCC编译后生成的符号名大致如下：
// void print(int)          -> _Z5printi
// void print(double)       -> _Z5printd
// void print(int, double)  -> _Z5printid
// void print(double, int)  -> _Z5printdi
```

为了在C++中调用C语言编写的函数（C语言不支持名字修饰），C++提供了`extern "C"`声明：

```cpp
#include <iostream>

// 告诉C++编译器：这些函数使用C语言的链接方式，不要进行名字修饰
extern "C" {
    int c_function(int x) {
        return x * 2;
    }

    double c_function2(double x, double y) {
        return x + y;
    }
}

// extern "C"也可以用于单个函数声明
extern "C" void c_style_print(const char* msg);

// 实现
extern "C" void c_style_print(const char* msg) {
    // 注意：这里可以使用C++特性，但链接方式仍是C的
    std::cout << msg << std::endl;
}

int main() {
    std::cout << "c_function(21) = " << c_function(21) << std::endl;
    std::cout << "c_function2(3.0, 4.0) = " << c_function2(3.0, 4.0) << std::endl;
    c_style_print("Hello from C-style function!");
    return 0;
}
```

`extern "C"`在实际开发中非常有用，特别是在C++项目中使用C语言库时。通常会在头文件中使用条件编译，使得头文件既可以被C编译器编译，也可以被C++编译器编译：

```cpp
#ifdef __cplusplus
extern "C" {
#endif

// C语言函数声明
void c_library_init();
int c_library_process(int data);
void c_library_cleanup();

#ifdef __cplusplus
}
#endif
```

## 重载决议规则

当调用一个重载函数时，编译器需要根据实参选择合适的重载版本。这个过程称为**重载决议（Overload Resolution）**。重载决议是一个复杂的过程，涉及多个规则和优先级。

### 精确匹配优先

如果存在一个重载版本的参数类型与实参类型完全匹配，则选择该版本：

```cpp
#include <iostream>

void func(int x) {
    std::cout << "func(int): " << x << std::endl;
}

void func(double x) {
    std::cout << "func(double): " << x << std::endl;
}

void func(const char* x) {
    std::cout << "func(const char*): " << x << std::endl;
}

int main() {
    func(10);        // 精确匹配func(int)
    func(3.14);      // 精确匹配func(double)
    func("hello");   // 精确匹配func(const char*)

    return 0;
}
```

### 类型提升

如果没有精确匹配的版本，编译器会尝试通过类型提升（Promotion）来匹配。类型提升包括：char/short -> int, float -> double等：

```cpp
#include <iostream>

void func(int x) {
    std::cout << "func(int): " << x << std::endl;
}

void func(double x) {
    std::cout << "func(double): " << x << std::endl;
}

int main() {
    char c = 'A';
    func(c);         // 类型提升：char -> int，调用func(int)

    short s = 100;
    func(s);         // 类型提升：short -> int，调用func(int)

    float f = 3.14f;
    func(f);         // 类型提升：float -> double，调用func(double)

    bool b = true;
    func(b);         // 类型提升：bool -> int，调用func(int)

    return 0;
}
```

### 标准类型转换

如果没有可用的类型提升，编译器会尝试标准类型转换（Standard Conversion），包括数值类型之间的转换：

```cpp
#include <iostream>

void func(int x) {
    std::cout << "func(int): " << x << std::endl;
}

void func(double x) {
    std::cout << "func(double): " << x << std::endl;
}

int main() {
    long l = 100L;
    func(l);         // 标准转换：long -> int（可能截断）或 long -> double
                     // 这里编译器会报歧义错误，因为两个转换都不优于另一个

    return 0;
}
```

### 重载决议的歧义

当编译器无法确定哪个重载版本更优时，会产生歧义错误（Ambiguity Error）：

```cpp
#include <iostream>

void func(int x, double y) {
    std::cout << "func(int, double)" << std::endl;
}

void func(double x, int y) {
    std::cout << "func(double, int)" << std::endl;
}

int main() {
    // func(1, 2);  // 歧义错误！两个版本都需要一次转换
                     // 对于func(int, double)：第一个参数精确匹配，第二个需要转换
                     // 对于func(double, int)：第一个参数需要转换，第二个精确匹配
                     // 两者都不优于对方

    func(1, 2.0);    // OK：精确匹配func(int, double)
    func(1.0, 2);    // OK：精确匹配func(double, int)

    return 0;
}
```

### 重载与const

const修饰符也会影响重载决议。对于引用参数，const和非const版本可以构成重载：

```cpp
#include <iostream>

// 非const版本
void process(int& x) {
    std::cout << "process(int&): " << x << std::endl;
    x = 100;  // 可以修改
}

// const版本
void process(const int& x) {
    std::cout << "process(const int&): " << x << std::endl;
    // x = 100;  // 编译错误！不能修改const引用
}

int main() {
    int a = 10;
    const int b = 20;

    process(a);      // 调用非const版本（a是非const）
    process(b);      // 调用const版本（b是const）
    process(30);     // 调用const版本（30是右值，只能绑定到const引用）

    std::cout << "a after process: " << a << std::endl;

    return 0;
}
```

### 重载与默认参数的冲突

当函数重载与默认参数结合使用时，需要特别注意避免歧义：

```cpp
#include <iostream>

// 版本1：无参数
void display() {
    std::cout << "display()" << std::endl;
}

// 版本2：一个参数，有默认值
void display(int x = 0) {
    std::cout << "display(int): " << x << std::endl;
}

int main() {
    display(42);  // OK：明确调用display(int)

    // display(); // 歧义错误！可以匹配display()，也可以匹配display(int)（使用默认值0）

    return 0;
}
```

## 默认参数（缺省参数）

### 默认参数的基本用法

默认参数（Default Arguments）允许在函数声明中为参数指定默认值。调用函数时，如果省略了对应的参数，则使用默认值：

```cpp
#include <iostream>
#include <string>

// 函数声明中指定默认参数
void greet(const std::string& name = "World", const std::string& greeting = "Hello") {
    std::cout << greeting << ", " << name << "!" << std::endl;
}

// 带默认参数的构造函数风格函数
void configure(int width = 800, int height = 600, bool fullscreen = false) {
    std::cout << "Configuration: " << width << "x" << height
              << (fullscreen ? " (fullscreen)" : " (windowed)") << std::endl;
}

int main() {
    greet();                          // 使用所有默认值
    greet("张三");                     // 覆盖第一个默认值
    greet("李四", "你好");              // 覆盖所有默认值
    greet("王五", "Hi");               // 覆盖所有默认值

    std::cout << std::endl;

    configure();                      // 800x600 windowed
    configure(1024);                  // 1024x600 windowed
    configure(1024, 768);             // 1024x768 windowed
    configure(1920, 1080, true);      // 1920x1080 fullscreen

    return 0;
}
```

### 默认参数的规则

C++对默认参数有严格的规则：

1. **默认参数必须从右向左连续指定**：不能跳过前面的参数而为后面的参数指定默认值。
2. **默认参数只能指定一次**：通常在函数声明中指定，不能在声明和定义中同时指定（即使值相同也不允许）。
3. **默认参数必须是常量或编译期可确定的表达式**：不能使用局部变量或函数调用。

```cpp
#include <iostream>

// 正确：默认参数从右向左连续指定
void func1(int a, int b = 0, int c = 0) {
    std::cout << "func1: " << a << ", " << b << ", " << c << std::endl;
}

// 错误：默认参数不连续
// void func2(int a = 0, int b, int c = 0) { }  // 编译错误！

// 正确：在声明中指定默认参数
void func3(int a, int b = 10);

// 定义中不能再指定默认参数
void func3(int a, int b) {
    std::cout << "func3: " << a << ", " << b << std::endl;
}

// 错误：默认参数必须在声明或定义中二选一
// void func4(int a = 0);
// void func4(int a = 0) { }  // 重复指定默认参数

int main() {
    func1(1);           // a=1, b=0, c=0
    func1(1, 2);        // a=1, b=2, c=0
    func1(1, 2, 3);     // a=1, b=2, c=3

    func3(5);           // a=5, b=10（使用默认值）
    func3(5, 20);       // a=5, b=20

    return 0;
}
```

### 默认参数的实际应用

默认参数在实际开发中非常实用，可以简化接口，减少代码冗余：

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

// 排序函数：默认升序排序
void sortAndPrint(std::vector<int>& data,
                  bool ascending = true,
                  const std::string& label = "Sorted Data") {
    if (ascending) {
        std::sort(data.begin(), data.end());
    } else {
        std::sort(data.begin(), data.end(), std::greater<int>());
    }

    std::cout << label << ": ";
    for (int n : data) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
}

// 日志函数：默认级别为INFO
enum LogLevel { DEBUG, INFO, WARNING, ERROR };

void log(const std::string& message,
         LogLevel level = INFO,
         const std::string& timestamp = "2024-01-01") {
    const char* levelStr[] = {"DEBUG", "INFO", "WARNING", "ERROR"};

    std::cout << "[" << timestamp << "] [" << levelStr[level] << "] " << message << std::endl;
}

// 创建窗口函数：提供合理的默认值
class Window {
public:
    void create(const std::string& title = "Untitled",
                int width = 800,
                int height = 600,
                bool resizable = true,
                bool visible = true) {
        std::cout << "Creating window: \"" << title << "\" "
                  << width << "x" << height
                  << (resizable ? " resizable" : " fixed")
                  << (visible ? " visible" : " hidden")
                  << std::endl;
    }
};

int main() {
    std::vector<int> data = {5, 2, 8, 1, 9, 3};

    sortAndPrint(data);                          // 默认升序
    sortAndPrint(data, false);                   // 降序
    sortAndPrint(data, true, "Ascending Order"); // 自定义标签

    std::cout << std::endl;

    log("Application started");                  // 默认INFO级别
    log("Connection timeout", WARNING);
    log("Critical failure!", ERROR, "2024-06-15 14:30:00");

    std::cout << std::endl;

    Window win;
    win.create();                                // 使用全部默认值
    win.create("My App");                        // 覆盖标题
    win.create("Editor", 1024, 768);             // 覆盖标题和尺寸
    win.create("Game", 1920, 1080, false, true); // 覆盖所有参数

    return 0;
}
```

### 默认参数与函数重载的配合

默认参数和函数重载可以配合使用，但需要注意避免冲突：

```cpp
#include <iostream>
#include <string>

// 使用默认参数减少重载版本
// 没有默认参数时可能需要多个重载版本：
// void drawRect(int x, int y, int w, int h);
// void drawRect(int x, int y, int w, int h, int color);
// void drawRect(int x, int y, int w, int h, int color, int borderWidth);

// 使用默认参数，一个函数就够了
void drawRect(int x, int y, int w, int h,
              int color = 0x000000,
              int borderWidth = 1,
              bool filled = true) {
    std::cout << "Drawing rect at (" << x << ", " << y
              << ") size " << w << "x" << h
              << " color=0x" << std::hex << color << std::dec
              << " border=" << borderWidth
              << (filled ? " filled" : " outline")
              << std::endl;
}

int main() {
    drawRect(10, 20, 100, 200);                    // 最简单用法
    drawRect(10, 20, 100, 200, 0xFF0000);          // 指定颜色
    drawRect(10, 20, 100, 200, 0x00FF00, 2);       // 指定颜色和边框
    drawRect(10, 20, 100, 200, 0x0000FF, 3, false);// 全部指定

    // 注意：不能跳过前面的参数
    // drawRect(10, 20, 100, 200, , , false);  // 错误！

    return 0;
}
```

## 占位参数

占位参数（Placeholder Arguments）是C++中一个不太常见但值得了解的特性。占位参数只有类型没有名称，在函数体内不能使用。它主要用于以下场景：

### 占位参数的基本用法

```cpp
#include <iostream>

// 占位参数：只有类型，没有名称
void func(int a, int) {
    std::cout << "func called with a = " << a << std::endl;
    // 第二个参数没有名称，无法在函数体内使用
}

// 占位参数与默认参数结合
void process(int a, int = 0) {
    std::cout << "process called with a = " << a << std::endl;
}

int main() {
    func(10, 20);   // 必须提供第二个参数
    process(10);    // 第二个参数有默认值，可以省略
    process(10, 30);

    return 0;
}
```

### 占位参数的应用场景

占位参数最常见的使用场景是区分前置和后置自增/自减运算符：

```cpp
#include <iostream>

class Counter {
private:
    int value;

public:
    Counter(int v = 0) : value(v) {}

    // 前置++：没有占位参数
    Counter& operator++() {
        ++value;
        return *this;
    }

    // 后置++：有int占位参数（固定语法）
    Counter operator++(int) {
        Counter temp = *this;
        ++value;
        return temp;
    }

    // 前置--：没有占位参数
    Counter& operator--() {
        --value;
        return *this;
    }

    // 后置--：有int占位参数
    Counter operator--(int) {
        Counter temp = *this;
        --value;
        return temp;
    }

    int getValue() const { return value; }
};

int main() {
    Counter c(5);

    std::cout << "初始值: " << c.getValue() << std::endl;

    ++c;
    std::cout << "++c后: " << c.getValue() << std::endl;

    Counter d = c++;
    std::cout << "c++后: c = " << c.getValue() << ", d = " << d.getValue() << std::endl;

    --c;
    std::cout << "--c后: " << c.getValue() << std::endl;

    Counter e = c--;
    std::cout << "c--后: c = " << c.getValue() << ", e = " << e.getValue() << std::endl;

    return 0;
}
```

## 内联函数

### 什么是内联函数

内联函数（Inline Function）是C++提供的一种优化机制。当函数被声明为`inline`时，编译器会尝试在调用点直接展开函数体，而不是进行常规的函数调用（压栈、跳转、返回）。这可以消除函数调用的开销，但可能增加代码体积。

```cpp
#include <iostream>
#include <chrono>

// 普通函数
int add(int a, int b) {
    return a + b;
}

// 内联函数
inline int addInline(int a, int b) {
    return a + b;
}

int main() {
    int x = 10, y = 20;

    // 普通函数调用：需要压栈、跳转、返回
    int result1 = add(x, y);

    // 内联函数调用：可能被展开为 int result2 = x + y;
    int result2 = addInline(x, y);

    std::cout << "result1 = " << result1 << std::endl;
    std::cout << "result2 = " << result2 << std::endl;

    return 0;
}
```

### 内联函数的规则

内联函数的使用需要遵循以下规则：

1. `inline`关键字只是一个**建议**，编译器可以选择忽略它。现代编译器会自动判断哪些函数适合内联，通常比程序员更准确。
2. 内联函数通常应该定义在头文件中，因为编译器需要在调用点看到函数体才能展开。
3. 递归函数、包含循环的大型函数通常不会被内联。
4. 虚函数在某些情况下可以被内联（如通过对象直接调用而非通过指针/引用）。

```cpp
#include <iostream>

// 内联函数通常定义在头文件中
// 这里为了演示放在同一文件中

// 简单函数适合内联
inline int max(int a, int b) {
    return a > b ? a : b;
}

inline int min(int a, int b) {
    return a < b ? a : b;
}

inline double square(double x) {
    return x * x;
}

// 访问器（getter/setter）适合内联
class Point {
private:
    double x, y;
public:
    Point(double x = 0, double y = 0) : x(x), y(y) {}

    // 类内定义的成员函数默认是内联的
    double getX() const { return x; }
    double getY() const { return y; }
    void setX(double val) { x = val; }
    void setY(double val) { y = val; }

    double distanceToOrigin() const {
        return std::sqrt(x * x + y * y);
    }
};

int main() {
    std::cout << "max(3, 7) = " << max(3, 7) << std::endl;
    std::cout << "min(3, 7) = " << min(3, 7) << std::endl;
    std::cout << "square(5.0) = " << square(5.0) << std::endl;

    Point p(3.0, 4.0);
    std::cout << "Point: (" << p.getX() << ", " << p.getY() << ")" << std::endl;
    std::cout << "Distance to origin: " << p.distanceToOrigin() << std::endl;

    return 0;
}
```

### 内联函数与宏的对比

在C语言中，程序员通常使用宏来实现类似内联函数的效果。但宏存在许多问题，C++的内联函数是更好的替代方案：

```cpp
#include <iostream>

// C语言风格的宏
#define SQUARE_MACRO(x) ((x) * (x))
#define MAX_MACRO(a, b) ((a) > (b) ? (a) : (b))

// C++内联函数
inline double squareInline(double x) {
    return x * x;
}

inline int maxInline(int a, int b) {
    return a > b ? a : b;
}

int main() {
    int i = 5;

    // 宏的问题1：多次求值
    std::cout << "SQUARE_MACRO(i++): " << SQUARE_MACRO(i++) << std::endl;
    std::cout << "i after macro: " << i << std::endl;  // i变成了7！

    i = 5;
    std::cout << "squareInline(i++): " << squareInline(i++) << std::endl;
    std::cout << "i after inline: " << i << std::endl; // i变成了6

    // 宏的问题2：类型不安全
    std::cout << "MAX_MACRO(3.5, 2.1): " << MAX_MACRO(3.5, 2.1) << std::endl;
    // 没有问题，但宏不检查类型

    // 内联函数类型安全
    std::cout << "maxInline(3, 7): " << maxInline(3, 7) << std::endl;
    // maxInline(3.5, 2.1)  // 如果参数类型严格匹配，可能有警告

    // 宏的问题3：运算符优先级
    int x = 2, y = 3;
    std::cout << "SQUARE_MACRO(x + y): " << SQUARE_MACRO(x + y) << std::endl;
    // 展开为 ((x + y) * (x + y)) = 25，正确（因为有括号）

    std::cout << "squareInline(x + y): " << squareInline(x + y) << std::endl;
    // 直接计算，更安全

    return 0;
}
```

宏存在三大问题：
1. **多次求值**：宏参数如果有副作用（如`i++`），会被多次求值。
2. **类型不安全**：宏不检查参数类型，可能导致意外的类型转换。
3. **运算符优先级**：宏展开可能因为运算符优先级导致意外结果（虽然可以通过加括号避免，但容易遗漏）。

内联函数完美解决了这些问题，同时还支持调试（宏在调试时无法设置断点）、支持作用域规则、支持类型检查。

### 内联函数的实际应用

内联函数在实际开发中用于优化性能敏感的代码：

```cpp
#include <iostream>
#include <vector>
#include <chrono>

// 内联的工具函数
inline bool isEven(int n) { return n % 2 == 0; }
inline bool isOdd(int n) { return n % 2 != 0; }
inline bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

// 内联的数学函数
inline double degreesToRadians(double degrees) {
    return degrees * 3.14159265358979 / 180.0;
}

inline double radiansToDegrees(double radians) {
    return radians * 180.0 / 3.14159265358979;
}

// 内联的容器操作
template<typename T>
inline T sum(const std::vector<T>& vec) {
    T total = T();
    for (const auto& val : vec) {
        total += val;
    }
    return total;
}

template<typename T>
inline double average(const std::vector<T>& vec) {
    if (vec.empty()) return 0.0;
    return static_cast<double>(sum(vec)) / vec.size();
}

int main() {
    // 测试isEven/isOdd
    for (int i = 1; i <= 10; i++) {
        std::cout << i << (isEven(i) ? " 是偶数, " : " 是奇数, ");
        if (isPrime(i)) std::cout << "是素数";
        std::cout << std::endl;
    }

    // 测试角度转换
    double angle = 45.0;
    std::cout << "\n" << angle << "度 = " << degreesToRadians(angle) << " 弧度" << std::endl;
    double rad = 1.5708;
    std::cout << rad << " 弧度 = " << radiansToDegrees(rad) << " 度" << std::endl;

    // 测试容器操作
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    std::cout << "\nSum: " << sum(numbers) << std::endl;
    std::cout << "Average: " << average(numbers) << std::endl;

    std::vector<double> values = {1.5, 2.5, 3.5, 4.5};
    std::cout << "Sum: " << sum(values) << std::endl;
    std::cout << "Average: " << average(values) << std::endl;

    return 0;
}
```

## 函数重载与默认参数的综合应用

下面是一个综合示例，展示了函数重载、默认参数和内联函数在实际开发中的协同使用：

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cmath>

// 命名空间组织
namespace MathUtils {

    // 内联函数
    inline double square(double x) { return x * x; }
    inline double cube(double x) { return x * x * x; }

    // 函数重载：绝对值
    inline int abs(int x) { return x < 0 ? -x : x; }
    inline long abs(long x) { return x < 0 ? -x : x; }
    inline double abs(double x) { return x < 0 ? -x : x; }

    // 函数重载：幂运算
    inline double power(double base, int exponent = 2) {
        double result = 1.0;
        bool negativeExp = exponent < 0;
        int exp = abs(exponent);
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        return negativeExp ? 1.0 / result : result;
    }

    inline int power(int base, int exponent = 2) {
        int result = 1;
        int exp = abs(exponent);
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        return exponent < 0 ? 0 : result;
    }
}

namespace Stats {
    // 默认参数
    double calculateAverage(const std::vector<double>& data,
                            bool ignoreZero = false,
                            double minValue = -INFINITY) {
        double total = 0.0;
        int count = 0;

        for (double val : data) {
            if (ignoreZero && val == 0.0) continue;
            if (val < minValue) continue;
            total += val;
            count++;
        }

        return count > 0 ? total / count : 0.0;
    }

    // 函数重载：处理int数组
    double calculateAverage(const std::vector<int>& data,
                            bool ignoreZero = false,
                            int minValue = INT_MIN) {
        std::vector<double> converted(data.begin(), data.end());
        return calculateAverage(converted, ignoreZero,
                                static_cast<double>(minValue));
    }

    double calculateStdDev(const std::vector<double>& data) {
        double avg = calculateAverage(data);
        double variance = 0.0;
        for (double val : data) {
            variance += MathUtils::square(val - avg);
        }
        variance /= data.size();
        return std::sqrt(variance);
    }
}

// 格式化输出——默认参数
void printLine(char ch = '-', int width = 40) {
    for (int i = 0; i < width; i++) {
        std::cout << ch;
    }
    std::cout << std::endl;
}

void printHeader(const std::string& title, char ch = '=', int width = 40) {
    printLine(ch, width);
    std::cout << title << std::endl;
    printLine(ch, width);
}

int main() {
    // 测试MathUtils
    printHeader("MathUtils 测试");

    std::cout << "square(5) = " << MathUtils::square(5) << std::endl;
    std::cout << "cube(5) = " << MathUtils::cube(5) << std::endl;

    std::cout << "abs(-10) = " << MathUtils::abs(-10) << std::endl;
    std::cout << "abs(-100L) = " << MathUtils::abs(-100L) << std::endl;
    std::cout << "abs(-3.14) = " << MathUtils::abs(-3.14) << std::endl;

    std::cout << "power(2.0, 10) = " << MathUtils::power(2.0, 10) << std::endl;
    std::cout << "power(3.0) = " << MathUtils::power(3.0) << " (默认指数2)" << std::endl;
    std::cout << "power(3, 4) = " << MathUtils::power(3, 4) << std::endl;

    // 测试Stats
    printHeader("Stats 测试");

    std::vector<double> scores = {85.0, 92.0, 0.0, 78.0, 95.0, 0.0, 88.0};
    std::cout << "原始数据: ";
    for (double s : scores) std::cout << s << " ";
    std::cout << std::endl;

    std::cout << "平均值（含0）: " << Stats::calculateAverage(scores) << std::endl;
    std::cout << "平均值（忽略0）: " << Stats::calculateAverage(scores, true) << std::endl;
    std::cout << "标准差: " << Stats::calculateStdDev(scores) << std::endl;

    std::vector<int> intScores = {85, 92, 0, 78, 95, 0, 88};
    std::cout << "整数平均（忽略0）: " << Stats::calculateAverage(intScores, true) << std::endl;

    return 0;
}
```

## 总结

本文系统地介绍了C++对C语言函数的多方面增强，包括函数重载、默认参数、占位参数和内联函数。

### 核心要点回顾

1. **函数重载**：允许在同一作用域内定义多个同名函数，只要参数列表不同。编译器通过名字修饰（Name Mangling）技术实现重载。重载使得API设计更加统一和直观，是C++面向对象编程的基础。

2. **重载决议**：当调用重载函数时，编译器按照精确匹配 -> 类型提升 -> 标准转换的优先级选择最合适的版本。如果无法确定哪个版本更优，会产生歧义错误。

3. **默认参数**：允许为函数参数指定默认值，简化函数调用。默认参数必须从右向左连续指定，且只能在声明和定义中二选一指定。默认参数可以显著减少函数重载的数量。

4. **占位参数**：只有类型没有名称的参数，主要用于区分前置和后置运算符重载。

5. **内联函数**：建议编译器在调用点展开函数体，消除函数调用开销。内联函数是C语言宏的完美替代方案，具有类型安全、支持调试、支持作用域等优势。`inline`关键字只是建议，编译器可能忽略。

在下一篇文章中，我们将学习C++的动态内存管理，包括`new`/`delete`运算符的使用、与`malloc`/`free`的对比、定位new、RAII思想等。这些特性使得C++的内存管理比C语言更加安全和高效。
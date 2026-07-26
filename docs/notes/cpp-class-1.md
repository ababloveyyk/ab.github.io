---
title: C++类与对象Ⅰ——封装基础
date: 2026-07-26
tags:
  - C++
  - 类与对象
  - 封装
  - this指针
categories:
  - C++
---

## 前言

面向对象编程（OOP）是C++语言的核心特性，也是C++区别于C语言的最重要标志。面向对象编程的三大基石是封装（Encapsulation）、继承（Inheritance）和多态（Polymorphism）。本文将从封装开始，详细介绍C++中类与对象的基本概念。

封装是面向对象编程的基础，它将数据和操作数据的方法捆绑在一起，形成一个独立的单元——类。通过访问控制符（public、private、protected），封装隐藏了内部实现细节，只暴露必要的接口，从而提高了代码的安全性和可维护性。

## class与struct的区别

### C语言中的struct

在C语言中，`struct`仅仅是数据的集合，不能包含函数，也没有访问控制的概念：

```cpp
// C语言风格的struct（在C++中仍然可用）
#include <iostream>
#include <cstring>

// C风格的struct：仅包含数据
struct CStudent {
    int id;
    char name[50];
    double score;
};

// 需要独立的函数来操作struct
void initStudent(CStudent* s, int id, const char* name, double score) {
    s->id = id;
    strncpy(s->name, name, 49);
    s->name[49] = '\0';
    s->score = score;
}

void printStudent(const CStudent* s) {
    std::cout << "ID: " << s->id << ", Name: " << s->name
              << ", Score: " << s->score << std::endl;
}

int main() {
    CStudent s1;
    initStudent(&s1, 1001, "张三", 92.5);
    printStudent(&s1);
    return 0;
}
```

### C++中的struct和class

在C++中，`struct`和`class`都可以定义类，它们的功能几乎完全相同：都可以包含数据成员和成员函数，都可以使用访问控制符，都可以有构造函数和析构函数。唯一的区别是**默认访问权限**：

- `struct`的默认访问权限是**public**（公有）。
- `class`的默认访问权限是**private**（私有）。

```cpp
#include <iostream>
#include <string>

// C++中的struct：可以包含成员函数
struct StructExample {
    // struct默认是public
    int publicData;
    std::string publicName;

    void display() const {
        std::cout << "StructExample: data=" << publicData
                  << ", name=" << publicName << std::endl;
    }

private:  // 可以显式声明private
    int privateData;
};

// C++中的class：默认是private
class ClassExample {
    // class默认是private
    int privateData;
    std::string privateName;

public:  // 需要显式声明public
    void setData(int data, const std::string& name) {
        privateData = data;
        privateName = name;
    }

    void display() const {
        std::cout << "ClassExample: data=" << privateData
                  << ", name=" << privateName << std::endl;
    }

    int getData() const { return privateData; }
    const std::string& getName() const { return privateName; }
};

int main() {
    // struct的使用
    StructExample se;
    se.publicData = 42;           // OK：public成员可以直接访问
    se.publicName = "Struct";     // OK：public成员可以直接访问
    // se.privateData = 10;       // 错误：private成员不能直接访问
    se.display();

    // class的使用
    ClassExample ce;
    // ce.privateData = 42;       // 错误：private成员不能直接访问
    ce.setData(100, "Class");     // OK：通过public方法访问
    ce.display();

    std::cout << "Data: " << ce.getData() << std::endl;
    std::cout << "Name: " << ce.getName() << std::endl;

    return 0;
}
```

### 何时使用struct，何时使用class？

在C++社区中，有一个广泛接受的惯例：

- **struct**：用于简单的数据聚合，主要是公开的数据成员，没有或只有很少的成员函数。例如，用于表示一个点的坐标、一个RGB颜色值等。
- **class**：用于需要封装和数据隐藏的复杂类型，包含私有数据成员和公有接口函数。例如，用于表示一个学生、一个账户、一个窗口等。

```cpp
#include <iostream>
#include <string>

// struct用于简单的数据聚合
struct Point {
    double x;
    double y;

    // 简单的辅助函数
    double distanceTo(const Point& other) const {
        double dx = x - other.x;
        double dy = y - other.y;
        return std::sqrt(dx * dx + dy * dy);
    }
};

struct RGB {
    int r, g, b;

    // 转换为十六进制字符串
    std::string toHex() const {
        char buffer[8];
        snprintf(buffer, sizeof(buffer), "#%02X%02X%02X", r, g, b);
        return std::string(buffer);
    }
};

// class用于需要封装的复杂类型
class BankAccount {
private:
    std::string accountNumber;
    std::string ownerName;
    double balance;
    static constexpr double MIN_BALANCE = 0.0;

public:
    BankAccount(const std::string& number, const std::string& owner)
        : accountNumber(number), ownerName(owner), balance(0.0) {}

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            std::cout << "存款 ¥" << amount << " 成功" << std::endl;
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && balance - amount >= MIN_BALANCE) {
            balance -= amount;
            std::cout << "取款 ¥" << amount << " 成功" << std::endl;
            return true;
        }
        std::cout << "取款失败：余额不足" << std::endl;
        return false;
    }

    double getBalance() const { return balance; }
    const std::string& getOwner() const { return ownerName; }
};

int main() {
    // struct使用
    Point p1 = {0, 0};
    Point p2 = {3, 4};
    std::cout << "Distance: " << p1.distanceTo(p2) << std::endl;

    RGB red = {255, 0, 0};
    std::cout << "Red in hex: " << red.toHex() << std::endl;

    // class使用
    BankAccount account("1234567890", "张三");
    account.deposit(1000);
    account.withdraw(300);
    std::cout << "账户余额: ¥" << account.getBalance() << std::endl;
    // account.balance = 1000000;  // 错误！balance是private的

    return 0;
}
```

## 访问控制符

C++提供了三种访问控制符，用于控制类成员的访问权限：

### public（公有）

`public`成员可以在任何地方访问，包括类的外部。通常将类的接口（用户需要调用的函数）声明为public。

### private（私有）

`private`成员只能在类的内部访问（包括成员函数和友元函数/类），类的外部不能直接访问。通常将数据成员声明为private，通过公有的getter/setter方法访问，这称为"数据隐藏"。

### protected（受保护）

`protected`成员与`private`类似，但可以在派生类中访问。这一特性在继承中非常重要，我们将在后续文章中详细讨论。

```cpp
#include <iostream>
#include <string>

class AccessControlDemo {
private:
    // 私有成员：只能在类内部访问
    int privateVar;
    std::string privateMethod() {
        return "private method called";
    }

protected:
    // 受保护成员：可以在派生类中访问
    int protectedVar;

public:
    // 公有成员：可以在任何地方访问
    int publicVar;

    AccessControlDemo() : privateVar(0), protectedVar(0), publicVar(0) {}

    // 公有方法可以访问私有成员
    void setPrivateVar(int val) {
        privateVar = val;
        std::cout << "privateVar set to " << val << std::endl;
    }

    int getPrivateVar() const {
        return privateVar;
    }

    void callPrivateMethod() {
        std::cout << privateMethod() << std::endl;
    }

    void display() const {
        std::cout << "privateVar=" << privateVar
                  << ", protectedVar=" << protectedVar
                  << ", publicVar=" << publicVar << std::endl;
    }
};

// 派生类
class Derived : public AccessControlDemo {
public:
    void accessProtected() {
        // 可以访问protected成员
        protectedVar = 100;
        std::cout << "Derived accessed protectedVar: " << protectedVar << std::endl;

        // 不能访问private成员
        // privateVar = 200;  // 错误！private成员在派生类中不可访问
    }
};

int main() {
    AccessControlDemo obj;

    // 公有成员可以访问
    obj.publicVar = 42;
    std::cout << "publicVar: " << obj.publicVar << std::endl;

    // 私有成员不能直接访问
    // obj.privateVar = 10;  // 错误！
    // obj.privateMethod();  // 错误！

    // 通过公有方法访问私有成员
    obj.setPrivateVar(10);
    std::cout << "getPrivateVar: " << obj.getPrivateVar() << std::endl;
    obj.callPrivateMethod();

    // 受保护成员不能直接访问（在非派生类中）
    // obj.protectedVar = 50;  // 错误！

    // 派生类访问
    Derived derived;
    derived.accessProtected();

    return 0;
}
```

### 封装的优点

封装带来的好处是多方面的：

1. **数据保护**：私有数据成员不能被外部代码随意修改，只能通过公有接口访问，可以在setter中加入验证逻辑。
2. **接口稳定性**：只要保持公有接口不变，内部实现可以自由修改，不影响外部代码。
3. **降低耦合**：外部代码只依赖于类的公有接口，而不是内部实现细节。
4. **提高可维护性**：当需要修改内部实现时，只需修改类的内部代码，而不需要修改所有使用该类的代码。

```cpp
#include <iostream>
#include <string>
#include <stdexcept>

class Temperature {
private:
    double celsius;

public:
    // Setter：包含验证逻辑
    void setCelsius(double temp) {
        if (temp < -273.15) {
            throw std::invalid_argument("温度不能低于绝对零度(-273.15°C)");
        }
        celsius = temp;
    }

    double getCelsius() const { return celsius; }

    // 提供多种温度单位的访问接口
    double getFahrenheit() const {
        return celsius * 9.0 / 5.0 + 32.0;
    }

    double getKelvin() const {
        return celsius + 273.15;
    }

    void setFahrenheit(double f) {
        setCelsius((f - 32.0) * 5.0 / 9.0);
    }

    void setKelvin(double k) {
        setCelsius(k - 273.15);
    }

    void display() const {
        std::cout << celsius << "°C = "
                  << getFahrenheit() << "°F = "
                  << getKelvin() << "K" << std::endl;
    }
};

int main() {
    Temperature temp;

    // 通过setter设置温度，自动验证
    temp.setCelsius(25.0);
    temp.display();

    // 使用不同的单位
    temp.setFahrenheit(98.6);
    temp.display();

    temp.setKelvin(300.0);
    temp.display();

    // 无效温度会被拒绝
    try {
        temp.setCelsius(-300.0);
    } catch (const std::exception& e) {
        std::cout << "错误: " << e.what() << std::endl;
    }

    return 0;
}
```

## 成员变量与成员函数

### 成员变量的定义

成员变量（也称为数据成员或属性）是类中定义的变量，用于存储对象的状态。每个对象都有自己独立的成员变量副本。

### 成员函数的定义

成员函数（也称为方法）是类中定义的函数，用于操作成员变量和实现对象的行为。成员函数可以定义在类内部（隐式内联），也可以定义在类外部。

```cpp
#include <iostream>
#include <string>

class Rectangle {
private:
    // 成员变量
    double width;
    double height;
    std::string name;
    static int objectCount;  // 静态成员变量

public:
    // 构造函数
    Rectangle(double w = 1.0, double h = 1.0, const std::string& n = "Rectangle")
        : width(w), height(h), name(n) {
        objectCount++;
    }

    // 成员函数：类内定义（隐式内联）
    double area() const {
        return width * height;
    }

    double perimeter() const {
        return 2 * (width + height);
    }

    // 成员函数：类内声明
    void setWidth(double w);
    void setHeight(double h);
    double getWidth() const;
    double getHeight() const;
    const std::string& getName() const;

    void display() const;

    static int getObjectCount() { return objectCount; }
};

// 成员函数：类外定义（使用作用域限定符::）
void Rectangle::setWidth(double w) {
    if (w > 0) {
        width = w;
    }
}

void Rectangle::setHeight(double h) {
    if (h > 0) {
        height = h;
    }
}

double Rectangle::getWidth() const {
    return width;
}

double Rectangle::getHeight() const {
    return height;
}

const std::string& Rectangle::getName() const {
    return name;
}

void Rectangle::display() const {
    std::cout << name << ": " << width << " x " << height
              << " (面积=" << area() << ", 周长=" << perimeter() << ")"
              << std::endl;
}

// 静态成员变量的定义和初始化
int Rectangle::objectCount = 0;

int main() {
    Rectangle r1(5.0, 3.0, "矩形A");
    Rectangle r2(4.0, 4.0, "正方形");
    Rectangle r3;  // 使用默认参数

    r1.display();
    r2.display();
    r3.display();

    // 使用getter/setter
    r3.setWidth(7.0);
    r3.setHeight(2.0);
    std::cout << "修改后: width=" << r3.getWidth()
              << ", height=" << r3.getHeight() << std::endl;

    // 静态成员函数
    std::cout << "共创建了 " << Rectangle::getObjectCount() << " 个矩形对象" << std::endl;

    return 0;
}
```

### 类内定义与类外定义

类内定义的成员函数默认是内联的，适合简单、短小的函数（如getter/setter）。类外定义的成员函数通常用于较长的函数实现，有助于保持类定义的简洁和可读性。

```cpp
#include <iostream>
#include <string>
#include <cmath>

class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 类内定义（简单函数，隐式内联）
    double getReal() const { return real; }
    double getImag() const { return imag; }
    double magnitude() const { return std::sqrt(real * real + imag * imag); }

    // 类内声明，类外定义
    void setReal(double r);
    void setImag(double i);
    Complex add(const Complex& other) const;
    Complex multiply(const Complex& other) const;
    void display() const;
};

// 类外定义
void Complex::setReal(double r) {
    real = r;
}

void Complex::setImag(double i) {
    imag = i;
}

Complex Complex::add(const Complex& other) const {
    return Complex(real + other.real, imag + other.imag);
}

Complex Complex::multiply(const Complex& other) const {
    // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
    return Complex(
        real * other.real - imag * other.imag,
        real * other.imag + imag * other.real
    );
}

void Complex::display() const {
    std::cout << real;
    if (imag >= 0) {
        std::cout << " + " << imag << "i";
    } else {
        std::cout << " - " << -imag << "i";
    }
    std::cout << " (|z| = " << magnitude() << ")" << std::endl;
}

int main() {
    Complex c1(3, 4);
    Complex c2(1, -2);

    std::cout << "c1 = "; c1.display();
    std::cout << "c2 = "; c2.display();

    Complex sum = c1.add(c2);
    std::cout << "c1 + c2 = "; sum.display();

    Complex product = c1.multiply(c2);
    std::cout << "c1 * c2 = "; product.display();

    return 0;
}
```

## this指针详解

### this指针的概念

`this`指针是C++中一个特殊的关键字，它指向调用成员函数的那个对象。在成员函数内部，可以使用`this`指针来访问调用该函数的对象。

`this`指针具有以下特性：
- `this`是一个隐式参数，编译器自动将其传递给每个非静态成员函数。
- `this`的类型是`ClassName* const`（对于非const成员函数）或`const ClassName* const`（对于const成员函数）。
- `this`指针不能被修改（不能改变指向）。
- `this`指针在静态成员函数中不可用。

```cpp
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& name, int age) {
        // 使用this指针区分成员变量和参数
        this->name = name;
        this->age = age;
    }

    // 返回*this的引用，支持链式调用
    Person& setName(const std::string& name) {
        this->name = name;
        return *this;  // 返回当前对象的引用
    }

    Person& setAge(int age) {
        this->age = age;
        return *this;
    }

    // 比较两个Person是否相同
    bool isSameAs(const Person& other) const {
        // 使用this访问当前对象
        return this->name == other.name && this->age == other.age;
    }

    // 返回this指针（不常用，仅用于演示）
    const Person* getThis() const {
        return this;
    }

    void display() const {
        std::cout << "Person: " << name << ", " << age << " years old" << std::endl;
        std::cout << "  this address: " << this << std::endl;
    }
};

int main() {
    Person p1("张三", 25);
    Person p2("张三", 25);
    Person p3("李四", 30);

    p1.display();
    p2.display();
    p3.display();

    std::cout << "p1 and p2 are same? " << (p1.isSameAs(p2) ? "Yes" : "No") << std::endl;
    std::cout << "p1 and p3 are same? " << (p1.isSameAs(p3) ? "Yes" : "No") << std::endl;

    // 链式调用
    p1.setName("张三丰").setAge(26);
    p1.display();

    // 验证this指针
    std::cout << "p1.getThis() = " << p1.getThis() << std::endl;
    std::cout << "&p1 = " << &p1 << std::endl;
    std::cout << "They are the same!" << std::endl;

    return 0;
}
```

### this指针的常见用途

**1. 区分成员变量和参数**

当成员变量名和参数名相同时，使用`this->`来区分：

```cpp
class MyClass {
    int value;
public:
    void setValue(int value) {
        this->value = value;  // this->value是成员变量，value是参数
    }
};
```

**2. 返回对象自身**

实现链式调用（Fluent Interface）：

```cpp
class StringBuilder {
    std::string content;
public:
    StringBuilder& append(const std::string& str) {
        content += str;
        return *this;  // 返回自身引用
    }
    StringBuilder& appendLine(const std::string& str) {
        content += str + "\n";
        return *this;
    }
    const std::string& str() const { return content; }
};

// 使用：
StringBuilder sb;
sb.append("Hello").append(" ").append("World").appendLine("!");
```

**3. 防止自赋值**

在赋值运算符重载中防止自赋值：

```cpp
class SafeString {
    char* data;
public:
    SafeString& operator=(const SafeString& other) {
        if (this != &other) {  // 防止自赋值
            delete[] data;
            data = new char[strlen(other.data) + 1];
            strcpy(data, other.data);
        }
        return *this;
    }
};
```

### this指针的完整示例

```cpp
#include <iostream>
#include <string>

class Counter {
private:
    int value;
    std::string name;

public:
    Counter(const std::string& n = "Counter", int v = 0)
        : name(n), value(v) {}

    // 使用this实现链式调用
    Counter& increment() {
        ++value;
        return *this;
    }

    Counter& decrement() {
        --value;
        return *this;
    }

    Counter& reset() {
        value = 0;
        return *this;
    }

    Counter& add(int n) {
        value += n;
        return *this;
    }

    // 比较操作
    bool isGreaterThan(const Counter& other) const {
        return this->value > other.value;
    }

    bool isEqual(const Counter& other) const {
        return this->value == other.value;
    }

    // 显示信息
    void display() const {
        std::cout << name << " = " << value
                  << " (this=" << this << ")" << std::endl;
    }

    // 返回当前对象的一个副本
    Counter snapshot() const {
        return *this;  // 返回当前对象的拷贝
    }
};

int main() {
    std::cout << "====== this指针演示 ======" << std::endl;

    Counter c1("Counter1", 10);
    Counter c2("Counter2", 20);

    c1.display();
    c2.display();

    // 链式调用
    c1.increment().increment().add(5);
    std::cout << "After chain: ";
    c1.display();

    // 比较
    std::cout << "c1 > c2? " << (c1.isGreaterThan(c2) ? "Yes" : "No") << std::endl;

    // 快照
    Counter snapshot = c1.snapshot();
    std::cout << "Snapshot: ";
    snapshot.display();
    std::cout << "Original: ";
    c1.display();  // 原对象不受影响

    return 0;
}
```

## 完整示例：银行账户类

下面是一个综合示例，展示了封装、访问控制、成员函数、this指针等概念的实际应用：

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include <ctime>
#include <sstream>

class Transaction {
private:
    std::string type;    // 交易类型：存款、取款、转账
    double amount;       // 交易金额
    std::string timestamp; // 交易时间
    double balanceAfter; // 交易后余额

public:
    Transaction(const std::string& t, double a, double b)
        : type(t), amount(a), balanceAfter(b) {
        // 生成时间戳
        time_t now = time(nullptr);
        char buffer[20];
        strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", localtime(&now));
        timestamp = buffer;
    }

    void display() const {
        std::cout << std::left
                  << std::setw(20) << timestamp
                  << std::setw(10) << type
                  << std::setw(12) << std::fixed << std::setprecision(2) << amount
                  << std::setw(12) << balanceAfter
                  << std::endl;
    }
};

class BankAccount {
private:
    std::string accountNumber;
    std::string ownerName;
    double balance;
    std::vector<Transaction> transactions;
    static int totalAccounts;
    static double totalDeposits;

public:
    // 构造函数
    BankAccount(const std::string& number, const std::string& owner,
                double initialBalance = 0.0)
        : accountNumber(number), ownerName(owner), balance(initialBalance) {
        totalAccounts++;
        if (initialBalance > 0) {
            totalDeposits += initialBalance;
            transactions.emplace_back("初始存款", initialBalance, balance);
        }
    }

    // 析构函数
    ~BankAccount() {
        totalAccounts--;
        totalDeposits -= balance;
    }

    // 存款
    bool deposit(double amount) {
        if (amount <= 0) {
            std::cout << "错误：存款金额必须大于0" << std::endl;
            return false;
        }
        balance += amount;
        totalDeposits += amount;
        transactions.emplace_back("存款", amount, balance);
        std::cout << "存款成功：¥" << std::fixed << std::setprecision(2) << amount << std::endl;
        return true;
    }

    // 取款
    bool withdraw(double amount) {
        if (amount <= 0) {
            std::cout << "错误：取款金额必须大于0" << std::endl;
            return false;
        }
        if (amount > balance) {
            std::cout << "错误：余额不足（当前余额：¥" << balance << "）" << std::endl;
            return false;
        }
        balance -= amount;
        totalDeposits -= amount;
        transactions.emplace_back("取款", amount, balance);
        std::cout << "取款成功：¥" << amount << std::endl;
        return true;
    }

    // 转账
    bool transfer(BankAccount& to, double amount) {
        if (this == &to) {
            std::cout << "错误：不能转账给自己" << std::endl;
            return false;
        }
        if (withdraw(amount)) {
            to.balance += amount;
            to.transactions.emplace_back("转账收入(from " + ownerName + ")", amount, to.balance);
            transactions.back() = Transaction("转账支出(to " + to.ownerName + ")", amount, balance);
            totalDeposits += amount;  // 从一个账户到另一个，总额不变
            std::cout << "转账成功：¥" << amount << " 到 " << to.ownerName << std::endl;
            return true;
        }
        return false;
    }

    // 显示账户信息
    void displayInfo() const {
        std::cout << "========== 账户信息 ==========" << std::endl;
        std::cout << "账号: " << accountNumber << std::endl;
        std::cout << "户名: " << ownerName << std::endl;
        std::cout << "余额: ¥" << std::fixed << std::setprecision(2) << balance << std::endl;
        std::cout << "==============================" << std::endl;
    }

    // 显示交易记录
    void displayTransactions() const {
        std::cout << "========== 交易记录 (" << ownerName << ") ==========" << std::endl;
        if (transactions.empty()) {
            std::cout << "无交易记录" << std::endl;
            return;
        }
        std::cout << std::left
                  << std::setw(20) << "时间"
                  << std::setw(10) << "类型"
                  << std::setw(12) << "金额"
                  << std::setw(12) << "余额"
                  << std::endl;
        std::cout << std::string(54, '-') << std::endl;
        for (const auto& t : transactions) {
            t.display();
        }
        std::cout << std::string(54, '-') << std::endl;
    }

    // Getter
    double getBalance() const { return balance; }
    const std::string& getOwner() const { return ownerName; }
    const std::string& getAccountNumber() const { return accountNumber; }

    // 静态成员函数
    static int getTotalAccounts() { return totalAccounts; }
    static double getTotalDeposits() { return totalDeposits; }
};

// 静态成员变量初始化
int BankAccount::totalAccounts = 0;
double BankAccount::totalDeposits = 0.0;

int main() {
    std::cout << "====== 银行账户系统 ======" << std::endl;

    // 创建账户
    BankAccount account1("622202001", "张三", 5000.0);
    BankAccount account2("622202002", "李四", 3000.0);
    BankAccount account3("622202003", "王五", 10000.0);

    std::cout << "\n当前总账户数: " << BankAccount::getTotalAccounts() << std::endl;
    std::cout << "银行总存款: ¥" << BankAccount::getTotalDeposits() << std::endl;

    // 显示账户信息
    account1.displayInfo();
    account2.displayInfo();
    account3.displayInfo();

    // 执行交易
    std::cout << "\n====== 执行交易 ======" << std::endl;
    account1.deposit(2000.0);
    account1.withdraw(1000.0);
    account1.transfer(account2, 1500.0);
    account3.withdraw(500.0);

    // 显示交易记录
    std::cout << std::endl;
    account1.displayTransactions();
    std::cout << std::endl;
    account2.displayTransactions();

    // 显示最终状态
    std::cout << "\n====== 最终状态 ======" << std::endl;
    std::cout << "总账户数: " << BankAccount::getTotalAccounts() << std::endl;
    std::cout << "银行总存款: ¥" << BankAccount::getTotalDeposits() << std::endl;

    return 0;
}
```

## 总结

本文详细介绍了C++中类与对象的基础知识，重点讲解了封装的概念和实现方式。

### 核心要点回顾

1. **class与struct的区别**：在C++中，`class`和`struct`都可以定义类，唯一的区别是默认访问权限——`class`默认是`private`，`struct`默认是`public`。通常使用`struct`表示简单的数据聚合，使用`class`表示需要封装的复杂类型。

2. **访问控制符**：C++提供了`public`、`private`、`protected`三种访问控制符。`public`成员可以在任何地方访问，`private`成员只能在类内部访问，`protected`成员可以在派生类中访问。封装的核心思想是将数据声明为`private`，通过`public`方法提供访问接口。

3. **成员变量与成员函数**：成员变量存储对象的状态，成员函数定义对象的行为。成员函数可以在类内定义（隐式内联），也可以在类外定义（使用`ClassName::`作用域限定符）。

4. **this指针**：`this`是指向当前对象的指针，在非静态成员函数中可用。`this`的常见用途包括：区分成员变量和参数、实现链式调用（返回`*this`）、防止自赋值。

5. **封装的好处**：数据保护、接口稳定性、降低耦合、提高可维护性。通过封装，类的内部实现可以自由修改，只要保持公有接口不变。

在下一篇文章中，我们将深入探讨C++类与对象的构造函数和析构函数，包括默认构造函数、拷贝构造函数、移动构造函数、初始化列表等高级特性。
---
title: C++类与对象Ⅳ——静态成员与友元
date: 2026-07-26
tags:
  - C++
  - 静态成员
  - 友元
  - const成员
  - mutable
categories:
  - C++
---

## 前言

在前面的文章中，我们学习了类的基本封装、构造函数和析构函数、运算符重载等核心特性。本文将继续深入探讨C++类与对象的两个重要机制：静态成员（Static Members）和友元（Friend）。

静态成员属于类本身而非某个特定对象，它们被所有对象共享。友元则打破了类的封装边界，允许特定的外部函数或类访问私有成员。此外，我们还将学习const成员函数和mutable关键字，它们为类提供了更精细的访问控制。

## 静态成员变量

### 静态成员变量的概念

静态成员变量（Static Member Variable）是属于类本身的变量，而不是属于某个特定对象。所有对象共享同一个静态成员变量，它存储在全局数据区，在程序开始运行时分配，在程序结束时释放。

静态成员变量的关键特性：
- 属于类，不属于任何对象。
- 所有对象共享同一个副本。
- 在类内声明，在类外定义和初始化。
- 可以通过类名直接访问（`ClassName::staticVar`），也可以通过对象访问。
- 在程序启动时初始化，在程序结束时销毁。

```cpp
#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int id;
    static int totalStudents;  // 静态成员变量声明

public:
    Student(const std::string& n) : name(n) {
        totalStudents++;    // 每创建一个对象，计数器加1
        id = totalStudents; // 自动分配学号
        std::cout << "Student \"" << name << "\" 创建, 学号: " << id << std::endl;
    }

    ~Student() {
        totalStudents--;
        std::cout << "Student \"" << name << "\" 销毁, 剩余学生: " << totalStudents << std::endl;
    }

    void display() const {
        std::cout << "学号: " << id << ", 姓名: " << name << std::endl;
    }

    // 静态成员函数：返回学生总数
    static int getTotalStudents() {
        return totalStudents;
    }
};

// 静态成员变量的定义和初始化（必须在类外）
int Student::totalStudents = 0;

int main() {
    std::cout << "====== 静态成员变量 ======" << std::endl;
    std::cout << "初始学生总数: " << Student::getTotalStudents() << std::endl;

    Student s1("张三");
    Student s2("李四");
    Student s3("王五");

    std::cout << "\n当前学生总数: " << Student::getTotalStudents() << std::endl;

    s1.display();
    s2.display();
    s3.display();

    {
        Student s4("赵六");
        std::cout << "作用域内学生总数: " << Student::getTotalStudents() << std::endl;
    }  // s4离开作用域，被销毁

    std::cout << "s4销毁后学生总数: " << Student::getTotalStudents() << std::endl;

    return 0;
}
```

### 静态成员变量的实际应用

```cpp
#include <iostream>
#include <string>
#include <vector>

// 使用静态成员实现ID自动生成
class Product {
private:
    int productId;
    std::string name;
    double price;
    static int nextId;  // 下一个可用的ID

public:
    Product(const std::string& n, double p)
        : name(n), price(p), productId(nextId++) {
        std::cout << "Product #" << productId << " created: " << name << std::endl;
    }

    int getId() const { return productId; }
    const std::string& getName() const { return name; }
    double getPrice() const { return price; }

    void display() const {
        std::cout << "Product #" << productId << ": " << name
                  << " - ¥" << price << std::endl;
    }

    static int getNextId() { return nextId; }
};

int Product::nextId = 1000;  // 从1000开始编号

// 使用静态成员记录配置信息
class AppConfig {
private:
    static std::string appName;
    static std::string version;
    static int maxConnections;
    static bool debugMode;

public:
    static void setAppName(const std::string& name) { appName = name; }
    static const std::string& getAppName() { return appName; }

    static void setVersion(const std::string& v) { version = v; }
    static const std::string& getVersion() { return version; }

    static void setMaxConnections(int max) { maxConnections = max; }
    static int getMaxConnections() { return maxConnections; }

    static void setDebugMode(bool debug) { debugMode = debug; }
    static bool isDebugMode() { return debugMode; }

    static void display() {
        std::cout << "====== 应用配置 ======" << std::endl;
        std::cout << "应用名称: " << appName << std::endl;
        std::cout << "版本号: " << version << std::endl;
        std::cout << "最大连接数: " << maxConnections << std::endl;
        std::cout << "调试模式: " << (debugMode ? "开启" : "关闭") << std::endl;
    }
};

std::string AppConfig::appName = "MyApp";
std::string AppConfig::version = "1.0.0";
int AppConfig::maxConnections = 100;
bool AppConfig::debugMode = false;

int main() {
    std::cout << "====== 静态成员应用 ======" << std::endl;

    // Product自动ID
    std::cout << "\n--- 产品管理 ---" << std::endl;
    Product p1("笔记本电脑", 5999.0);
    Product p2("机械键盘", 899.0);
    Product p3("显示器", 2499.0);
    Product p4("鼠标", 299.0);

    p1.display();
    p2.display();
    p3.display();
    p4.display();

    std::cout << "下一个产品ID: " << Product::getNextId() << std::endl;

    // AppConfig
    std::cout << "\n--- 应用配置 ---" << std::endl;
    AppConfig::display();

    AppConfig::setDebugMode(true);
    AppConfig::setVersion("2.0.0");
    std::cout << "\n修改配置后:" << std::endl;
    AppConfig::display();

    return 0;
}
```

## 静态成员函数

静态成员函数是属于类本身的函数，它不能访问非静态成员变量，也不能使用`this`指针。静态成员函数只能访问静态成员变量和其他静态成员函数。

```cpp
#include <iostream>
#include <string>
#include <algorithm>

class MathUtility {
public:
    // 静态成员函数：不需要对象即可调用
    static int max(int a, int b) {
        return a > b ? a : b;
    }

    static int min(int a, int b) {
        return a < b ? a : b;
    }

    static double average(double a, double b) {
        return (a + b) / 2.0;
    }

    static bool isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) return false;
        }
        return true;
    }

    static int factorial(int n) {
        int result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    static long long fibonacci(int n) {
        if (n <= 1) return n;
        long long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long long temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
};

// 工厂模式中使用静态成员函数
class Shape {
public:
    virtual ~Shape() = default;
    virtual void draw() const = 0;
    virtual double area() const = 0;
    virtual const char* type() const = 0;
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    void draw() const override {
        std::cout << "绘制圆形，半径: " << radius << std::endl;
    }
    double area() const override {
        return 3.14159 * radius * radius;
    }
    const char* type() const override { return "Circle"; }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    void draw() const override {
        std::cout << "绘制矩形: " << width << " x " << height << std::endl;
    }
    double area() const override {
        return width * height;
    }
    const char* type() const override { return "Rectangle"; }
};

class Triangle : public Shape {
private:
    double base, height;
public:
    Triangle(double b, double h) : base(b), height(h) {}
    void draw() const override {
        std::cout << "绘制三角形，底: " << base << "，高: " << height << std::endl;
    }
    double area() const override {
        return 0.5 * base * height;
    }
    const char* type() const override { return "Triangle"; }
};

// 工厂类：使用静态成员函数创建对象
class ShapeFactory {
public:
    static Shape* createCircle(double radius) {
        return new Circle(radius);
    }

    static Shape* createRectangle(double width, double height) {
        return new Rectangle(width, height);
    }

    static Shape* createTriangle(double base, double height) {
        return new Triangle(base, height);
    }
};

int main() {
    std::cout << "====== 静态成员函数 ======" << std::endl;

    // 使用MathUtility（无需创建对象）
    std::cout << "max(10, 20) = " << MathUtility::max(10, 20) << std::endl;
    std::cout << "min(10, 20) = " << MathUtility::min(10, 20) << std::endl;
    std::cout << "average(10, 20) = " << MathUtility::average(10, 20) << std::endl;
    std::cout << "isPrime(17) = " << (MathUtility::isPrime(17) ? "true" : "false") << std::endl;
    std::cout << "factorial(5) = " << MathUtility::factorial(5) << std::endl;
    std::cout << "fibonacci(10) = " << MathUtility::fibonacci(10) << std::endl;

    // 使用工厂模式创建对象
    std::cout << "\n====== 工厂模式 ======" << std::endl;
    Shape* circle = ShapeFactory::createCircle(5.0);
    Shape* rect = ShapeFactory::createRectangle(4.0, 6.0);
    Shape* triangle = ShapeFactory::createTriangle(3.0, 4.0);

    circle->draw();
    std::cout << "面积: " << circle->area() << std::endl;

    rect->draw();
    std::cout << "面积: " << rect->area() << std::endl;

    triangle->draw();
    std::cout << "面积: " << triangle->area() << std::endl;

    delete circle;
    delete rect;
    delete triangle;

    return 0;
}
```

## 友元函数

友元函数（Friend Function）是声明在类内部但定义在类外部的非成员函数，它被授权访问类的私有成员和保护成员。友元函数打破了类的封装边界，应该谨慎使用，主要用于运算符重载和需要访问多个类私有成员的场景。

```cpp
#include <iostream>
#include <string>
#include <cmath>

class Point {
private:
    double x, y;

public:
    Point(double x = 0, double y = 0) : x(x), y(y) {}

    // 声明友元函数
    friend double distance(const Point& p1, const Point& p2);
    friend std::ostream& operator<<(std::ostream& os, const Point& p);
    friend Point midpoint(const Point& p1, const Point& p2);

    void display() const {
        std::cout << "Point(" << x << ", " << y << ")" << std::endl;
    }

    double getX() const { return x; }
    double getY() const { return y; }
};

// 友元函数定义：计算两点距离
double distance(const Point& p1, const Point& p2) {
    double dx = p1.x - p2.x;  // 直接访问私有成员
    double dy = p1.y - p2.y;
    return std::sqrt(dx * dx + dy * dy);
}

// 友元函数定义：流输出运算符
std::ostream& operator<<(std::ostream& os, const Point& p) {
    os << "(" << p.x << ", " << p.y << ")";
    return os;
}

// 友元函数定义：计算中点
Point midpoint(const Point& p1, const Point& p2) {
    return Point((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0);
}

int main() {
    std::cout << "====== 友元函数 ======" << std::endl;

    Point p1(0, 0);
    Point p2(3, 4);
    Point p3(6, 8);

    std::cout << "p1 = " << p1 << std::endl;
    std::cout << "p2 = " << p2 << std::endl;
    std::cout << "p3 = " << p3 << std::endl;

    std::cout << "distance(p1, p2) = " << distance(p1, p2) << std::endl;
    std::cout << "distance(p1, p3) = " << distance(p1, p3) << std::endl;
    std::cout << "midpoint(p1, p3) = " << midpoint(p1, p3) << std::endl;

    return 0;
}
```

## 友元类

友元类（Friend Class）是指一个类被声明为另一个类的友元，这样友元类的所有成员函数都可以访问授权类的私有成员和保护成员。

```cpp
#include <iostream>
#include <string>
#include <vector>

// 前向声明
class Account;

// 友元类：银行
class Bank {
public:
    void transfer(Account& from, Account& to, double amount);
    void printBalance(const Account& account);
};

// 账户类
class Account {
private:
    std::string owner;
    std::string accountNumber;
    double balance;

    // 声明Bank为友元类
    friend class Bank;

    // 也可以声明单个成员函数为友元
    friend void auditAccount(const Account& account);

public:
    Account(const std::string& owner, const std::string& number, double initial = 0)
        : owner(owner), accountNumber(number), balance(initial) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) balance -= amount;
    }

    void display() const {
        std::cout << owner << " [" << accountNumber << "]: ¥" << balance << std::endl;
    }
};

// Bank的成员函数实现
void Bank::transfer(Account& from, Account& to, double amount) {
    if (from.balance >= amount && amount > 0) {
        from.balance -= amount;
        to.balance += amount;
        std::cout << "转账 ¥" << amount << " 从 " << from.owner
                  << " 到 " << to.owner << std::endl;
    }
}

void Bank::printBalance(const Account& account) {
    std::cout << "账户余额 [" << account.accountNumber
              << "]: ¥" << account.balance << std::endl;
}

// 友元函数：审计账户
void auditAccount(const Account& account) {
    std::cout << "审计: " << account.owner
              << " (账号: " << account.accountNumber
              << ") 余额: ¥" << account.balance << std::endl;
}

int main() {
    std::cout << "====== 友元类 ======" << std::endl;

    Account a1("张三", "622202001", 5000);
    Account a2("李四", "622202002", 3000);
    Account a3("王五", "622202003", 10000);

    a1.display();
    a2.display();
    a3.display();

    Bank bank;
    bank.transfer(a1, a2, 1000);
    bank.transfer(a3, a1, 2000);

    std::cout << "\n转账后:" << std::endl;
    a1.display();
    a2.display();
    a3.display();

    std::cout << "\n银行查询:" << std::endl;
    bank.printBalance(a1);
    bank.printBalance(a2);
    bank.printBalance(a3);

    std::cout << "\n审计:" << std::endl;
    auditAccount(a1);
    auditAccount(a3);

    return 0;
}
```

## const成员函数

const成员函数承诺不修改对象的任何成员变量（除非成员变量被声明为`mutable`）。const成员函数可以作用于const对象，而非const成员函数不能作用于const对象。

```cpp
#include <iostream>
#include <string>

class TextBuffer {
private:
    std::string content;
    mutable int accessCount;  // mutable：即使在const函数中也可以修改

public:
    TextBuffer(const std::string& text = "") : content(text), accessCount(0) {}

    // const成员函数：承诺不修改对象状态
    const std::string& getContent() const {
        accessCount++;  // OK：accessCount是mutable的
        return content;
    }

    size_t getLength() const {
        accessCount++;
        return content.length();
    }

    bool isEmpty() const {
        return content.empty();
    }

    char getCharAt(size_t index) const {
        if (index < content.length()) {
            return content[index];
        }
        return '\0';
    }

    int getAccessCount() const {
        return accessCount;
    }

    // 非const成员函数：可以修改对象
    void setContent(const std::string& text) {
        content = text;
    }

    void append(const std::string& text) {
        content += text;
    }

    void clear() {
        content.clear();
    }

    // const重载：根据对象的const性选择不同的版本
    void display() const {
        std::cout << "const display: " << content << std::endl;
    }

    void display() {
        std::cout << "non-const display: " << content << std::endl;
    }
};

// 接受const引用的函数
void printBuffer(const TextBuffer& buffer) {
    std::cout << "Buffer: \"" << buffer.getContent() << "\""
              << " (长度: " << buffer.getLength() << ")"
              << " (访问次数: " << buffer.getAccessCount() << ")"
              << std::endl;
    // buffer.setContent("new");  // 错误！不能修改const对象
    // buffer.append("text");     // 错误！不能修改const对象
}

int main() {
    std::cout << "====== const成员函数 ======" << std::endl;

    TextBuffer buffer("Hello, World!");

    // 非const对象可以调用const和非const成员函数
    buffer.display();  // 调用非const版本
    buffer.setContent("New Content");
    buffer.append(" More text");

    // 多次调用const函数
    printBuffer(buffer);
    printBuffer(buffer);
    printBuffer(buffer);

    std::cout << "总访问次数: " << buffer.getAccessCount() << std::endl;

    // const对象只能调用const成员函数
    const TextBuffer constBuffer("Immutable Text");
    constBuffer.display();  // 调用const版本
    std::cout << "constBuffer length: " << constBuffer.getLength() << std::endl;
    // constBuffer.setContent("new");  // 错误！const对象不能调用非const函数

    return 0;
}
```

## mutable关键字

`mutable`关键字用于声明即使在const成员函数中也可以被修改的成员变量。它通常用于缓存、互斥锁、访问计数器等不影响对象逻辑状态的场景。

```cpp
#include <iostream>
#include <string>
#include <cmath>
#include <chrono>
#include <thread>

// 使用mutable实现缓存
class Circle {
private:
    double radius;
    mutable double cachedArea;      // 缓存面积
    mutable bool areaValid;         // 缓存是否有效
    mutable int areaComputationCount; // 计算次数统计

public:
    Circle(double r) : radius(r), cachedArea(0), areaValid(false), areaComputationCount(0) {}

    double getArea() const {
        if (!areaValid) {
            cachedArea = 3.14159265359 * radius * radius;
            areaValid = true;
            areaComputationCount++;
        }
        return cachedArea;
    }

    void setRadius(double r) {
        radius = r;
        areaValid = false;  // 缓存失效
    }

    double getRadius() const { return radius; }
    int getComputationCount() const { return areaComputationCount; }
};

// 使用mutable实现线程安全的计数器
class ThreadSafeCounter {
private:
    mutable int counter;
    mutable std::mutex mtx;

public:
    ThreadSafeCounter() : counter(0) {}

    void increment() {
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
    }

    int getValue() const {
        std::lock_guard<std::mutex> lock(mtx);  // mtx是mutable的
        return counter;
    }
};

// 使用mutable实现延迟计算
class ExpensiveData {
private:
    std::string source;
    mutable std::string processedData;
    mutable bool processed;

    std::string processData() const {
        // 模拟耗时处理
        std::string result = "Processed: " + source;
        for (char& c : result) {
            c = toupper(c);
        }
        return result;
    }

public:
    ExpensiveData(const std::string& s) : source(s), processed(false) {}

    const std::string& getData() const {
        if (!processed) {
            processedData = processData();  // 延迟计算
            processed = true;
        }
        return processedData;
    }

    void setSource(const std::string& s) {
        source = s;
        processed = false;  // 缓存失效
    }
};

int main() {
    std::cout << "====== mutable关键字 ======" << std::endl;

    // 缓存示例
    std::cout << "\n--- 缓存示例 ---" << std::endl;
    Circle circle(5.0);
    std::cout << "第一次获取面积: " << circle.getArea() << std::endl;
    std::cout << "第二次获取面积: " << circle.getArea() << " (从缓存)" << std::endl;
    std::cout << "计算次数: " << circle.getComputationCount() << std::endl;

    circle.setRadius(10.0);
    std::cout << "修改半径后获取面积: " << circle.getArea() << std::endl;
    std::cout << "计算次数: " << circle.getComputationCount() << std::endl;

    // 延迟计算示例
    std::cout << "\n--- 延迟计算示例 ---" << std::endl;
    ExpensiveData data("hello world");
    std::cout << "获取数据: " << data.getData() << std::endl;
    std::cout << "再次获取: " << data.getData() << " (从缓存)" << std::endl;

    return 0;
}
```

## 综合示例：学生管理系统

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <iomanip>

class Student {
private:
    int id;
    std::string name;
    double mathScore;
    double englishScore;
    double programmingScore;

    // 静态成员：统计信息
    static int totalStudents;
    static int nextId;
    static double highestAverage;
    static std::string topStudentName;

    // 友元函数
    friend class StudentManager;
    friend std::ostream& operator<<(std::ostream& os, const Student& s);
    friend bool compareByAverage(const Student& a, const Student& b);

public:
    Student(const std::string& n, double math, double english, double prog)
        : name(n), mathScore(math), englishScore(english), programmingScore(prog) {
        id = nextId++;
        totalStudents++;

        double avg = getAverage();
        if (avg > highestAverage) {
            highestAverage = avg;
            topStudentName = name;
        }
    }

    ~Student() {
        totalStudents--;
    }

    // const成员函数
    double getAverage() const {
        return (mathScore + englishScore + programmingScore) / 3.0;
    }

    double getTotal() const {
        return mathScore + englishScore + programmingScore;
    }

    int getId() const { return id; }
    const std::string& getName() const { return name; }
    double getMath() const { return mathScore; }
    double getEnglish() const { return englishScore; }
    double getProgramming() const { return programmingScore; }

    // 非const成员函数
    void setMath(double score) { mathScore = score; }
    void setEnglish(double score) { englishScore = score; }
    void setProgramming(double score) { programmingScore = score; }

    // 静态成员函数
    static int getTotalStudents() { return totalStudents; }
    static double getHighestAverage() { return highestAverage; }
    static const std::string& getTopStudent() { return topStudentName; }
};

// 静态成员初始化
int Student::totalStudents = 0;
int Student::nextId = 1001;
double Student::highestAverage = 0.0;
std::string Student::topStudentName = "";

// 友元函数
bool compareByAverage(const Student& a, const Student& b) {
    return a.getAverage() > b.getAverage();
}

std::ostream& operator<<(std::ostream& os, const Student& s) {
    os << std::left
       << std::setw(6) << s.id
       << std::setw(12) << s.name
       << std::setw(10) << std::fixed << std::setprecision(1) << s.mathScore
       << std::setw(10) << s.englishScore
       << std::setw(12) << s.programmingScore
       << std::setw(10) << std::setprecision(2) << s.getAverage();
    return os;
}

// 友元类：学生管理器
class StudentManager {
private:
    std::vector<Student*> students;

public:
    ~StudentManager() {
        for (auto s : students) {
            delete s;
        }
    }

    void addStudent(const std::string& name, double math, double english, double prog) {
        students.push_back(new Student(name, math, english, prog));
        std::cout << "添加学生: " << name << std::endl;
    }

    bool removeStudent(int id) {
        auto it = std::find_if(students.begin(), students.end(),
                               [id](Student* s) { return s->getId() == id; });
        if (it != students.end()) {
            std::cout << "删除学生: " << (*it)->getName() << std::endl;
            delete *it;
            students.erase(it);
            return true;
        }
        return false;
    }

    Student* findStudent(int id) const {
        auto it = std::find_if(students.begin(), students.end(),
                               [id](Student* s) { return s->getId() == id; });
        return it != students.end() ? *it : nullptr;
    }

    void displayAll() const {
        std::cout << "\n====== 学生列表 (共 " << Student::getTotalStudents() << " 人) ======" << std::endl;
        std::cout << std::left
                  << std::setw(6) << "学号"
                  << std::setw(12) << "姓名"
                  << std::setw(10) << "数学"
                  << std::setw(10) << "英语"
                  << std::setw(12) << "编程"
                  << std::setw(10) << "平均分"
                  << std::endl;
        std::cout << std::string(60, '-') << std::endl;

        for (const auto& s : students) {
            std::cout << *s << std::endl;
        }
    }

    void displayRanking() const {
        std::cout << "\n====== 成绩排名 ======" << std::endl;
        std::vector<Student*> sorted = students;
        std::sort(sorted.begin(), sorted.end(),
                  [](Student* a, Student* b) { return compareByAverage(*a, *b); });

        std::cout << std::left
                  << std::setw(6) << "排名"
                  << std::setw(12) << "姓名"
                  << std::setw(10) << "平均分"
                  << std::endl;
        std::cout << std::string(28, '-') << std::endl;

        int rank = 1;
        for (const auto& s : sorted) {
            std::cout << std::setw(6) << rank++
                      << std::setw(12) << s->getName()
                      << std::setw(10) << std::fixed << std::setprecision(2) << s->getAverage()
                      << std::endl;
        }
    }

    void displayStatistics() const {
        std::cout << "\n====== 统计信息 ======" << std::endl;
        std::cout << "学生总数: " << Student::getTotalStudents() << std::endl;
        std::cout << "最高平均分: " << Student::getHighestAverage() << std::endl;
        std::cout << "最高分学生: " << Student::getTopStudent() << std::endl;
    }
};

int main() {
    std::cout << "====== 学生管理系统（静态成员+友元） ======" << std::endl;

    StudentManager manager;

    manager.addStudent("张三", 92.5, 88.0, 95.0);
    manager.addStudent("李四", 78.0, 85.5, 82.0);
    manager.addStudent("王五", 96.0, 91.0, 98.5);
    manager.addStudent("赵六", 65.0, 72.5, 70.0);
    manager.addStudent("孙七", 88.0, 90.5, 86.0);
    manager.addStudent("周八", 99.0, 97.0, 95.5);

    manager.displayAll();
    manager.displayRanking();
    manager.displayStatistics();

    return 0;
}
```

## 总结

本文详细介绍了C++类与对象的静态成员和友元机制，以及const成员函数和mutable关键字。

### 核心要点回顾

1. **静态成员变量**：属于类本身，被所有对象共享。必须在类内声明、类外定义和初始化。常用于计数器、共享配置、ID生成器等场景。

2. **静态成员函数**：属于类本身，可以通过类名直接调用，不能访问非静态成员，没有`this`指针。常用于工具函数、工厂方法等场景。

3. **友元函数**：被授权访问类私有成员的非成员函数。常用于流运算符重载、需要访问多个类私有成员的函数。

4. **友元类**：一个类被声明为另一个类的友元后，其所有成员函数都可以访问授权类的私有成员。友元关系是单向的、不可传递的、不可继承的。

5. **const成员函数**：承诺不修改对象状态，可以被const对象调用。const成员函数可以与非const成员函数构成重载。

6. **mutable关键字**：允许在const成员函数中修改被标记为mutable的成员变量。常用于缓存、互斥锁、访问计数器等不影响对象逻辑状态的场景。

在下一篇文章中，我们将综合运用所有学到的类与对象知识，构建一个完整的Student管理系统，作为C++类与对象系列的收官之作。
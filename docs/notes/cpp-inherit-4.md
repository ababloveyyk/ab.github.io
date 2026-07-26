---
title: C++继承与多态Ⅳ——多态进阶
date: 2026-07-26
tags:
  - C++
  - 继承
  - 多态
  - 抽象类
  - 虚析构函数
categories:
  - C++
---

## 一、纯虚函数与抽象类

### 1.1 纯虚函数的概念

纯虚函数是在基类中声明但不实现的虚函数。它的声明形式为在函数声明的末尾加上`= 0`：

```cpp
virtual 返回类型 函数名(参数列表) = 0;
```

纯虚函数强制要求所有派生类必须提供该函数的实现，否则派生类也将成为抽象类。

### 1.2 抽象类的定义

包含至少一个纯虚函数的类称为抽象类。抽象类不能被实例化，只能作为基类使用。抽象类的核心作用是定义接口规范。

```cpp
#include <iostream>
#include <cmath>
using namespace std;

// 抽象基类：图形
class Shape {
public:
    // 纯虚函数：计算面积
    virtual double area() const = 0;
    
    // 纯虚函数：计算周长
    virtual double perimeter() const = 0;
    
    // 普通虚函数：可以有实现
    virtual void describe() const {
        cout << "这是一个图形" << endl;
    }
    
    // 虚析构函数
    virtual ~Shape() = default;
};

// 派生类Circle必须实现所有纯虚函数
class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double area() const override {
        return M_PI * radius * radius;
    }
    
    double perimeter() const override {
        return 2 * M_PI * radius;
    }
    
    void describe() const override {
        cout << "这是一个圆形，半径 = " << radius << endl;
    }
};

// 派生类Rectangle
class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double area() const override {
        return width * height;
    }
    
    double perimeter() const override {
        return 2 * (width + height);
    }
    
    void describe() const override {
        cout << "这是一个矩形，宽 = " << width << "，高 = " << height << endl;
    }
};

int main() {
    // Shape s;  // 错误！不能实例化抽象类
    
    // 但可以使用抽象类的指针和引用
    Shape* shapes[2];
    shapes[0] = new Circle(5.0);
    shapes[1] = new Rectangle(4.0, 6.0);
    
    for (int i = 0; i < 2; i++) {
        shapes[i]->describe();
        cout << "  面积 = " << shapes[i]->area() << endl;
        cout << "  周长 = " << shapes[i]->perimeter() << endl;
        cout << endl;
        delete shapes[i];
    }
    
    return 0;
}
```

### 1.3 抽象类的深入理解

抽象类可以有构造函数、成员变量和非纯虚函数。它只是不能被直接实例化：

```cpp
#include <iostream>
#include <string>
using namespace std;

// 抽象类：数据库连接
class DatabaseConnection {
protected:
    string connectionString;
    bool isConnected;
    
public:
    // 抽象类可以有构造函数
    DatabaseConnection(const string& connStr) 
        : connectionString(connStr), isConnected(false) {
        cout << "DatabaseConnection构造：连接字符串 = " << connectionString << endl;
    }
    
    // 纯虚函数
    virtual bool connect() = 0;
    virtual bool disconnect() = 0;
    virtual string executeQuery(const string& query) = 0;
    
    // 非纯虚函数
    bool isConnectedStatus() const {
        return isConnected;
    }
    
    string getConnectionString() const {
        return connectionString;
    }
    
    virtual ~DatabaseConnection() {
        cout << "DatabaseConnection析构" << endl;
    }
};

// MySQL连接实现
class MySQLConnection : public DatabaseConnection {
public:
    MySQLConnection(const string& connStr) 
        : DatabaseConnection(connStr) {
        cout << "MySQLConnection构造" << endl;
    }
    
    bool connect() override {
        cout << "正在连接MySQL数据库..." << endl;
        // 模拟连接过程
        isConnected = true;
        cout << "MySQL连接成功" << endl;
        return true;
    }
    
    bool disconnect() override {
        cout << "正在断开MySQL连接..." << endl;
        isConnected = false;
        return true;
    }
    
    string executeQuery(const string& query) override {
        if (!isConnected) {
            return "错误：未连接到数据库";
        }
        cout << "MySQL执行查询：" << query << endl;
        return "查询结果：[MySQL数据]";
    }
};

// PostgreSQL连接实现
class PostgreSQLConnection : public DatabaseConnection {
public:
    PostgreSQLConnection(const string& connStr) 
        : DatabaseConnection(connStr) {
        cout << "PostgreSQLConnection构造" << endl;
    }
    
    bool connect() override {
        cout << "正在连接PostgreSQL数据库..." << endl;
        isConnected = true;
        cout << "PostgreSQL连接成功" << endl;
        return true;
    }
    
    bool disconnect() override {
        cout << "正在断开PostgreSQL连接..." << endl;
        isConnected = false;
        return true;
    }
    
    string executeQuery(const string& query) override {
        if (!isConnected) {
            return "错误：未连接到数据库";
        }
        cout << "PostgreSQL执行查询：" << query << endl;
        return "查询结果：[PostgreSQL数据]";
    }
};

int main() {
    // 使用抽象类指针管理不同的数据库连接
    DatabaseConnection* db = nullptr;
    
    cout << "===== MySQL操作 =====" << endl;
    db = new MySQLConnection("mysql://localhost:3306/mydb");
    db->connect();
    cout << db->executeQuery("SELECT * FROM users") << endl;
    db->disconnect();
    delete db;
    
    cout << "\n===== PostgreSQL操作 =====" << endl;
    db = new PostgreSQLConnection("postgresql://localhost:5432/mydb");
    db->connect();
    cout << db->executeQuery("SELECT * FROM products") << endl;
    db->disconnect();
    delete db;
    
    return 0;
}
```

### 1.4 纯虚函数可以有实现

尽管纯虚函数在声明时使用`= 0`，但它仍然可以有实现。派生类可以通过显式调用基类版本：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    // 纯虚函数有实现
    virtual void interface() = 0;
    
    virtual ~Base() = default;
};

// 纯虚函数的实现（在类外定义）
void Base::interface() {
    cout << "Base::interface() - 纯虚函数的默认实现" << endl;
}

class Derived : public Base {
public:
    void interface() override {
        cout << "Derived::interface() - 调用基类实现前" << endl;
        Base::interface();  // 显式调用基类的纯虚函数实现
        cout << "Derived::interface() - 调用基类实现后" << endl;
    }
};

int main() {
    Derived d;
    d.interface();
    
    return 0;
}
```

## 二、接口继承与实现继承

### 2.1 接口继承

接口继承是指派生类只继承基类的函数声明（接口），而不继承实现。这是通过纯虚函数实现的：

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
using namespace std;

// 纯接口类：所有函数都是纯虚函数
class IShape {
public:
    virtual double area() const = 0;
    virtual double perimeter() const = 0;
    virtual string name() const = 0;
    virtual void draw() const = 0;
    virtual ~IShape() = default;
};

// 实现接口
class Triangle : public IShape {
private:
    double a, b, c;  // 三边长度
    
public:
    Triangle(double side1, double side2, double side3)
        : a(side1), b(side2), c(side3) {}
    
    double area() const override {
        double s = (a + b + c) / 2.0;
        return sqrt(s * (s - a) * (s - b) * (s - c));  // 海伦公式
    }
    
    double perimeter() const override {
        return a + b + c;
    }
    
    string name() const override {
        return "三角形";
    }
    
    void draw() const override {
        cout << "绘制三角形：边长(" << a << ", " << b << ", " << c << ")" << endl;
    }
};

// 实现接口
class Square : public IShape {
private:
    double side;
    
public:
    Square(double s) : side(s) {}
    
    double area() const override {
        return side * side;
    }
    
    double perimeter() const override {
        return 4 * side;
    }
    
    string name() const override {
        return "正方形";
    }
    
    void draw() const override {
        cout << "绘制正方形：边长 = " << side << endl;
    }
};

int main() {
    vector<unique_ptr<IShape>> shapes;
    shapes.push_back(make_unique<Triangle>(3, 4, 5));
    shapes.push_back(make_unique<Square>(6));
    
    for (const auto& shape : shapes) {
        shape->draw();
        cout << "  名称：" << shape->name() << endl;
        cout << "  面积：" << shape->area() << endl;
        cout << "  周长：" << shape->perimeter() << endl;
        cout << endl;
    }
    
    return 0;
}
```

### 2.2 实现继承

实现继承是指派生类继承基类的具体实现，可以直接使用或重写：

```cpp
#include <iostream>
#include <string>
using namespace std;

// 基类提供了默认实现
class Logger {
protected:
    string logLevel;
    
    string getTimestamp() const {
        // 简化的时间戳获取
        return "[2026-07-26 10:00:00]";
    }
    
public:
    Logger(const string& level = "INFO") : logLevel(level) {}
    
    // 虚函数，提供默认实现
    virtual void log(const string& message) {
        cout << getTimestamp() << " [" << logLevel << "] " << message << endl;
    }
    
    virtual void error(const string& message) {
        cout << getTimestamp() << " [ERROR] " << message << endl;
    }
    
    virtual void warn(const string& message) {
        cout << getTimestamp() << " [WARN] " << message << endl;
    }
    
    virtual ~Logger() = default;
};

// 文件日志器：继承实现并扩展
class FileLogger : public Logger {
private:
    string filePath;
    
public:
    FileLogger(const string& path, const string& level = "INFO")
        : Logger(level), filePath(path) {
        cout << "FileLogger：日志将写入 " << filePath << endl;
    }
    
    void log(const string& message) override {
        // 扩展基类实现
        cout << "[写入文件: " << filePath << "] ";
        Logger::log(message);  // 调用基类实现
    }
    
    void error(const string& message) override {
        cout << "[写入文件: " << filePath << "] ";
        Logger::error(message);
    }
    
    // warn使用基类默认实现，不重写
};

// 网络日志器
class NetworkLogger : public Logger {
private:
    string serverUrl;
    
public:
    NetworkLogger(const string& url, const string& level = "INFO")
        : Logger(level), serverUrl(url) {
        cout << "NetworkLogger：日志将发送到 " << serverUrl << endl;
    }
    
    void log(const string& message) override {
        cout << "[发送到: " << serverUrl << "] ";
        Logger::log(message);
    }
    
    void error(const string& message) override {
        cout << "[发送到: " << serverUrl << "] ";
        Logger::error(message);
    }
};

int main() {
    cout << "===== 使用文件日志器 =====" << endl;
    FileLogger fileLogger("app.log", "DEBUG");
    fileLogger.log("应用启动");
    fileLogger.warn("磁盘空间不足");
    fileLogger.error("连接数据库失败");
    
    cout << "\n===== 使用网络日志器 =====" << endl;
    NetworkLogger netLogger("https://log.example.com/api");
    netLogger.log("用户登录");
    netLogger.warn("密码即将过期");
    netLogger.error("服务器无响应");
    
    return 0;
}
```

### 2.3 接口继承与实现继承的对比

```cpp
#include <iostream>
#include <string>
using namespace std;

// 接口继承：定义契约
class IFlyable {
public:
    virtual void fly() = 0;
    virtual string getFlightMode() const = 0;
    virtual ~IFlyable() = default;
};

class ISwimmable {
public:
    virtual void swim() = 0;
    virtual double getMaxDepth() const = 0;
    virtual ~ISwimmable() = default;
};

// 实现继承：提供共享代码
class Bird {
protected:
    string name;
    double weight;
    
public:
    Bird(const string& n, double w) : name(n), weight(w) {}
    
    void eat() {
        cout << name << "正在吃东西" << endl;
    }
    
    void sleep() {
        cout << name << "正在睡觉" << endl;
    }
    
    virtual void displayInfo() const {
        cout << "鸟类：" << name << "，体重：" << weight << "kg" << endl;
    }
    
    virtual ~Bird() = default;
};

// 组合：接口继承 + 实现继承
class Duck : public Bird, public IFlyable, public ISwimmable {
public:
    Duck(const string& n, double w) : Bird(n, w) {}
    
    // 实现IFlyable接口
    void fly() override {
        cout << name << "（鸭子）展开翅膀飞行" << endl;
    }
    
    string getFlightMode() const override {
        return "扑翼飞行";
    }
    
    // 实现ISwimmable接口
    void swim() override {
        cout << name << "（鸭子）在水面上游泳" << endl;
    }
    
    double getMaxDepth() const override {
        return 2.0;  // 鸭子可以潜水2米
    }
    
    void displayInfo() const override {
        Bird::displayInfo();
        cout << "飞行方式：" << getFlightMode() << endl;
        cout << "最大潜水深度：" << getMaxDepth() << "米" << endl;
    }
};

int main() {
    Duck duck("唐老鸭", 2.5);
    
    // 实现继承的方法
    duck.eat();
    duck.sleep();
    duck.displayInfo();
    
    // 接口方法
    duck.fly();
    duck.swim();
    
    // 通过接口指针使用
    IFlyable* flyable = &duck;
    flyable->fly();
    
    ISwimmable* swimmable = &duck;
    swimmable->swim();
    
    return 0;
}
```

## 三、虚析构函数的重要性

### 3.1 虚析构函数的必要性

当基类指针指向派生类对象，并且通过基类指针delete该对象时，如果基类的析构函数不是虚函数，则只会调用基类的析构函数，派生类的析构函数不会被调用，导致资源泄漏：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

// 危险示例：非虚析构函数
class ResourceHolder {
public:
    ResourceHolder() {
        cout << "ResourceHolder构造" << endl;
    }
    
    // 非虚析构函数——危险！
    ~ResourceHolder() {
        cout << "ResourceHolder析构" << endl;
    }
};

class FileResource : public ResourceHolder {
private:
    char* buffer;
    size_t bufferSize;
    
public:
    FileResource(size_t size) : bufferSize(size) {
        buffer = new char[size];
        memset(buffer, 0, size);
        cout << "FileResource构造：分配了" << size << "字节" << endl;
    }
    
    ~FileResource() {
        delete[] buffer;
        cout << "FileResource析构：释放了" << bufferSize << "字节" << endl;
    }
    
    void writeData(const char* data) {
        strncpy(buffer, data, bufferSize - 1);
    }
    
    void readData() const {
        cout << "数据：" << buffer << endl;
    }
};

// 安全示例：虚析构函数
class SafeResourceHolder {
public:
    SafeResourceHolder() {
        cout << "SafeResourceHolder构造" << endl;
    }
    
    virtual ~SafeResourceHolder() {
        cout << "SafeResourceHolder析构" << endl;
    }
};

class SafeFileResource : public SafeResourceHolder {
private:
    char* buffer;
    size_t bufferSize;
    
public:
    SafeFileResource(size_t size) : bufferSize(size) {
        buffer = new char[size];
        memset(buffer, 0, size);
        cout << "SafeFileResource构造：分配了" << size << "字节" << endl;
    }
    
    ~SafeFileResource() {
        delete[] buffer;
        cout << "SafeFileResource析构：释放了" << bufferSize << "字节" << endl;
    }
};

int main() {
    cout << "===== 危险示例：内存泄漏 =====" << endl;
    ResourceHolder* rh = new FileResource(1024);
    rh->writeData("Hello, World!");
    delete rh;  // 只调用了ResourceHolder的析构，FileResource的析构未被调用
    // 1024字节的内存泄漏了！
    
    cout << "\n===== 安全示例：正确释放 =====" << endl;
    SafeResourceHolder* srh = new SafeFileResource(1024);
    delete srh;  // 先调用SafeFileResource析构，再调用SafeResourceHolder析构
    // 1024字节的内存被正确释放
    
    return 0;
}
```

### 3.2 虚析构函数的工作原理

当基类的析构函数被声明为虚函数时，派生类的析构函数自动成为虚函数。在delete时，编译器会通过vtable查找正确的析构函数：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    int baseData;
    
    Base() : baseData(100) {
        cout << "Base构造" << endl;
    }
    
    virtual ~Base() {
        cout << "Base析构" << endl;
    }
    
    virtual void identify() const {
        cout << "我是Base" << endl;
    }
};

class Derived : public Base {
public:
    int derivedData;
    int* dynamicData;
    
    Derived() : derivedData(200) {
        dynamicData = new int[100];
        cout << "Derived构造：分配了动态内存" << endl;
    }
    
    // 即使不加virtual，这也是虚函数（因为基类析构是virtual）
    ~Derived() {
        delete[] dynamicData;
        cout << "Derived析构：释放了动态内存" << endl;
    }
    
    void identify() const override {
        cout << "我是Derived" << endl;
    }
};

int main() {
    cout << "创建Derived对象：" << endl;
    Base* ptr = new Derived();
    
    cout << "\n对象信息：" << endl;
    ptr->identify();  // 多态调用
    
    cout << "\n销毁对象：" << endl;
    delete ptr;
    // 正确调用顺序：
    // 1. Derived::~Derived() - 释放动态内存
    // 2. Base::~Base() - 清理基类部分
    
    return 0;
}
```

### 3.3 虚析构函数的最佳实践

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
using namespace std;

// 最佳实践：只要一个类被设计为基类，就应该声明虚析构函数
class Component {
protected:
    string componentId;
    
public:
    Component(const string& id) : componentId(id) {
        cout << "Component[" << componentId << "]构造" << endl;
    }
    
    // 虚析构函数
    virtual ~Component() {
        cout << "Component[" << componentId << "]析构" << endl;
    }
    
    virtual void initialize() = 0;
    virtual void update() = 0;
    virtual void render() = 0;
    
    string getId() const { return componentId; }
};

class Button : public Component {
private:
    string label;
    
public:
    Button(const string& id, const string& lbl)
        : Component(id), label(lbl) {
        cout << "Button[" << componentId << "]构造，标签=" << label << endl;
    }
    
    ~Button() {
        cout << "Button[" << componentId << "]析构" << endl;
    }
    
    void initialize() override {
        cout << "Button[" << componentId << "]初始化" << endl;
    }
    
    void update() override {
        cout << "Button[" << componentId << "]更新" << endl;
    }
    
    void render() override {
        cout << "渲染按钮：" << label << endl;
    }
};

class TextField : public Component {
private:
    string placeholder;
    string content;
    
public:
    TextField(const string& id, const string& ph)
        : Component(id), placeholder(ph), content("") {
        cout << "TextField[" << componentId << "]构造" << endl;
    }
    
    ~TextField() {
        cout << "TextField[" << componentId << "]析构" << endl;
    }
    
    void initialize() override {
        cout << "TextField[" << componentId << "]初始化" << endl;
    }
    
    void update() override {
        cout << "TextField[" << componentId << "]更新" << endl;
    }
    
    void render() override {
        cout << "渲染文本框：" << placeholder << " -> " << content << endl;
    }
};

int main() {
    // 使用unique_ptr管理，自动调用正确的析构函数
    vector<unique_ptr<Component>> components;
    components.push_back(make_unique<Button>("btn1", "确定"));
    components.push_back(make_unique<TextField>("tf1", "请输入姓名"));
    components.push_back(make_unique<Button>("btn2", "取消"));
    
    cout << "\n初始化所有组件：" << endl;
    for (auto& comp : components) {
        comp->initialize();
    }
    
    cout << "\n渲染所有组件：" << endl;
    for (auto& comp : components) {
        comp->render();
    }
    
    cout << "\n程序结束（自动调用析构函数）：" << endl;
    // unique_ptr自动调用delete，由于虚析构函数，正确的析构顺序被保证
    
    return 0;
}
```

## 四、final与override关键字

### 4.1 override关键字

`override`关键字用于显式声明派生类中的函数是对基类虚函数的重写。如果函数签名不匹配基类的任何虚函数，编译器会报错：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void func1() {
        cout << "Base::func1()" << endl;
    }
    
    virtual void func2(int x) {
        cout << "Base::func2(int) x = " << x << endl;
    }
    
    virtual void func3() const {
        cout << "Base::func3() const" << endl;
    }
    
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    // 正确：重写func1
    void func1() override {
        cout << "Derived::func1()" << endl;
    }
    
    // 正确：重写func2(int)
    void func2(int x) override {
        cout << "Derived::func2(int) x = " << x << endl;
    }
    
    // 错误示例（如果取消注释）：
    // void func2(double x) override { }  // 错误！基类没有func2(double)
    // void func3() override { }          // 错误！基类的func3是const的
    
    // 正确：重写func3() const
    void func3() const override {
        cout << "Derived::func3() const" << endl;
    }
    
    // 没有override关键字：容易被忽视的错误
    void func3() {  // 这不是重写！这是一个新函数（隐藏了基类的func3）
        cout << "Derived::func3() 非const（隐藏了基类版本）" << endl;
    }
};

int main() {
    Derived d;
    Base* ptr = &d;
    
    cout << "===== 通过基类指针调用 =====" << endl;
    ptr->func1();     // Derived::func1()
    ptr->func2(42);   // Derived::func2(int)
    ptr->func3();     // Derived::func3() const（多态生效）
    
    cout << "\n===== 通过派生类对象调用 =====" << endl;
    d.func3();  // 调用非const版本（隐藏了const版本）
    
    // 要调用const版本，需要显式指定
    const Derived& cd = d;
    cd.func3();  // 调用const版本
    
    return 0;
}
```

### 4.2 final关键字

`final`关键字有两个用途：

1. **修饰类**：禁止该类被继承
2. **修饰虚函数**：禁止派生类重写该虚函数

```cpp
#include <iostream>
using namespace std;

// 使用final修饰类：该类不能被继承
class NoInherit final {
public:
    void doSomething() {
        cout << "NoInherit::doSomething()" << endl;
    }
};

// class TryInherit : public NoInherit { };  // 错误！不能继承final类

// 使用final修饰虚函数
class Animal {
public:
    virtual void makeSound() const {
        cout << "动物发出声音" << endl;
    }
    
    // 这个虚函数不能被进一步重写
    virtual void breathe() const final {
        cout << "动物在呼吸" << endl;
    }
    
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void makeSound() const override {
        cout << "汪汪！" << endl;
    }
    
    // void breathe() const override { }  // 错误！breathe是final的，不能重写
};

class Cat : public Animal {
public:
    void makeSound() const override {
        cout << "喵喵！" << endl;
    }
};

// 使用final的继承层次
class Base {
public:
    virtual void func1() {
        cout << "Base::func1()" << endl;
    }
    
    virtual void func2() {
        cout << "Base::func2()" << endl;
    }
    
    virtual ~Base() = default;
};

class Middle : public Base {
public:
    void func1() override final {  // 这不能进一步重写
        cout << "Middle::func1() - final" << endl;
    }
    
    void func2() override {
        cout << "Middle::func2()" << endl;
    }
};

class Derived : public Middle {
public:
    // void func1() override { }  // 错误！func1在Middle中是final的
    
    void func2() override {
        cout << "Derived::func2()" << endl;
    }
};

int main() {
    cout << "===== final类 =====" << endl;
    NoInherit ni;
    ni.doSomething();
    
    cout << "\n===== final虚函数 =====" << endl;
    Dog dog;
    dog.makeSound();
    dog.breathe();  // 继承自Animal，不能重写
    
    cout << "\n===== final在继承层次中 =====" << endl;
    Derived d;
    Base* ptr = &d;
    ptr->func1();  // Middle::func1() - final
    ptr->func2();  // Derived::func2()
    
    return 0;
}
```

### 4.3 override和final的联合使用

```cpp
#include <iostream>
#include <string>
using namespace std;

// 一个使用override和final的完整示例
class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual void scale(double factor) = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double area() const override {
        return 3.14159 * radius * radius;
    }
    
    string name() const override {
        return "Circle";
    }
    
    void scale(double factor) override final {
        // final：Circle的派生类不能改变scale的行为
        radius *= factor;
        cout << "Circle缩放到半径=" << radius << endl;
    }
};

// 如果Circle有派生类，它可以重写area和name，但不能重写scale
class ColoredCircle : public Circle {
private:
    string color;
    
public:
    ColoredCircle(double r, const string& c) : Circle(r), color(c) {}
    
    double area() const override {
        // 可以重写area
        cout << "ColoredCircle::area()" << endl;
        return Circle::area();
    }
    
    string name() const override {
        return "ColoredCircle(" + color + ")";
    }
    
    // void scale(double factor) override { }  // 错误！scale是final的
};

int main() {
    ColoredCircle cc(5.0, "Red");
    cout << "名称：" << cc.name() << endl;
    cout << "面积：" << cc.area() << endl;
    cc.scale(2.0);  // 调用Circle::scale()
    
    Shape* shape = &cc;
    cout << "通过Shape指针：" << endl;
    cout << "名称：" << shape->name() << endl;
    cout << "面积：" << shape->area() << endl;
    
    return 0;
}
```

## 五、多态案例：计算器类层次结构

### 5.1 表达式计算器设计

下面通过一个完整的表达式计算器案例来综合运用多态的各种概念：

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <cmath>
#include <sstream>
using namespace std;

// 抽象基类：表达式节点
class ExpressionNode {
public:
    virtual double evaluate() const = 0;
    virtual string toString() const = 0;
    virtual unique_ptr<ExpressionNode> clone() const = 0;
    virtual ~ExpressionNode() = default;
};

// 操作数节点：存储数字
class NumberNode : public ExpressionNode {
private:
    double value;
    
public:
    NumberNode(double v) : value(v) {}
    
    double evaluate() const override {
        return value;
    }
    
    string toString() const override {
        ostringstream oss;
        oss << value;
        return oss.str();
    }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<NumberNode>(value);
    }
};

// 二元运算符基类
class BinaryOperatorNode : public ExpressionNode {
protected:
    unique_ptr<ExpressionNode> left;
    unique_ptr<ExpressionNode> right;
    
public:
    BinaryOperatorNode(unique_ptr<ExpressionNode> l, unique_ptr<ExpressionNode> r)
        : left(move(l)), right(move(r)) {}
    
    string toString() const override {
        return "(" + left->toString() + " " + getOperatorSymbol() + " " 
               + right->toString() + ")";
    }
    
    virtual string getOperatorSymbol() const = 0;
};

// 加法节点
class AddNode : public BinaryOperatorNode {
public:
    AddNode(unique_ptr<ExpressionNode> l, unique_ptr<ExpressionNode> r)
        : BinaryOperatorNode(move(l), move(r)) {}
    
    double evaluate() const override {
        return left->evaluate() + right->evaluate();
    }
    
    string getOperatorSymbol() const override { return "+"; }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<AddNode>(left->clone(), right->clone());
    }
};

// 减法节点
class SubtractNode : public BinaryOperatorNode {
public:
    SubtractNode(unique_ptr<ExpressionNode> l, unique_ptr<ExpressionNode> r)
        : BinaryOperatorNode(move(l), move(r)) {}
    
    double evaluate() const override {
        return left->evaluate() - right->evaluate();
    }
    
    string getOperatorSymbol() const override { return "-"; }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<SubtractNode>(left->clone(), right->clone());
    }
};

// 乘法节点
class MultiplyNode : public BinaryOperatorNode {
public:
    MultiplyNode(unique_ptr<ExpressionNode> l, unique_ptr<ExpressionNode> r)
        : BinaryOperatorNode(move(l), move(r)) {}
    
    double evaluate() const override {
        return left->evaluate() * right->evaluate();
    }
    
    string getOperatorSymbol() const override { return "*"; }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<MultiplyNode>(left->clone(), right->clone());
    }
};

// 除法节点
class DivideNode : public BinaryOperatorNode {
public:
    DivideNode(unique_ptr<ExpressionNode> l, unique_ptr<ExpressionNode> r)
        : BinaryOperatorNode(move(l), move(r)) {}
    
    double evaluate() const override {
        double divisor = right->evaluate();
        if (divisor == 0) {
            throw runtime_error("除数为零");
        }
        return left->evaluate() / divisor;
    }
    
    string getOperatorSymbol() const override { return "/"; }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<DivideNode>(left->clone(), right->clone());
    }
};

// 幂运算节点
class PowerNode : public BinaryOperatorNode {
public:
    PowerNode(unique_ptr<ExpressionNode> l, unique_ptr<ExpressionNode> r)
        : BinaryOperatorNode(move(l), move(r)) {}
    
    double evaluate() const override {
        return pow(left->evaluate(), right->evaluate());
    }
    
    string getOperatorSymbol() const override { return "^"; }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<PowerNode>(left->clone(), right->clone());
    }
};

// 一元运算符节点：负数
class NegateNode : public ExpressionNode {
private:
    unique_ptr<ExpressionNode> operand;
    
public:
    NegateNode(unique_ptr<ExpressionNode> op) : operand(move(op)) {}
    
    double evaluate() const override {
        return -operand->evaluate();
    }
    
    string toString() const override {
        return "(-" + operand->toString() + ")";
    }
    
    unique_ptr<ExpressionNode> clone() const override {
        return make_unique<NegateNode>(operand->clone());
    }
};

// 计算器类
class Calculator {
private:
    unique_ptr<ExpressionNode> root;
    
public:
    void setExpression(unique_ptr<ExpressionNode> node) {
        root = move(node);
    }
    
    double calculate() const {
        if (!root) {
            throw runtime_error("没有设置表达式");
        }
        return root->evaluate();
    }
    
    string getExpression() const {
        if (!root) {
            return "";
        }
        return root->toString();
    }
};

int main() {
    Calculator calc;
    
    cout << "========== 计算器演示 ==========\n" << endl;
    
    // 表达式1: 3 + 4 * 5
    cout << "表达式1: 3 + 4 * 5" << endl;
    auto expr1 = make_unique<AddNode>(
        make_unique<NumberNode>(3),
        make_unique<MultiplyNode>(
            make_unique<NumberNode>(4),
            make_unique<NumberNode>(5)
        )
    );
    calc.setExpression(move(expr1));
    cout << "  公式：" << calc.getExpression() << endl;
    cout << "  结果：" << calc.calculate() << endl;
    
    // 表达式2: (10 - 3) * (8 + 2) / 5
    cout << "\n表达式2: (10 - 3) * (8 + 2) / 5" << endl;
    auto expr2 = make_unique<DivideNode>(
        make_unique<MultiplyNode>(
            make_unique<SubtractNode>(
                make_unique<NumberNode>(10),
                make_unique<NumberNode>(3)
            ),
            make_unique<AddNode>(
                make_unique<NumberNode>(8),
                make_unique<NumberNode>(2)
            )
        ),
        make_unique<NumberNode>(5)
    );
    calc.setExpression(move(expr2));
    cout << "  公式：" << calc.getExpression() << endl;
    cout << "  结果：" << calc.calculate() << endl;
    
    // 表达式3: 2^3 + 4
    cout << "\n表达式3: 2^3 + 4" << endl;
    auto expr3 = make_unique<AddNode>(
        make_unique<PowerNode>(
            make_unique<NumberNode>(2),
            make_unique<NumberNode>(3)
        ),
        make_unique<NumberNode>(4)
    );
    calc.setExpression(move(expr3));
    cout << "  公式：" << calc.getExpression() << endl;
    cout << "  结果：" << calc.calculate() << endl;
    
    // 表达式4: -5 + 3 * 2
    cout << "\n表达式4: -5 + 3 * 2" << endl;
    auto expr4 = make_unique<AddNode>(
        make_unique<NegateNode>(make_unique<NumberNode>(5)),
        make_unique<MultiplyNode>(
            make_unique<NumberNode>(3),
            make_unique<NumberNode>(2)
        )
    );
    calc.setExpression(move(expr4));
    cout << "  公式：" << calc.getExpression() << endl;
    cout << "  结果：" << calc.calculate() << endl;
    
    return 0;
}
```

### 5.2 带变量支持的计算器扩展

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>
#include <cmath>
#include <sstream>
#include <stdexcept>
using namespace std;

// 抽象基类：表达式节点
class Expression {
public:
    virtual double evaluate(const unordered_map<string, double>& variables) const = 0;
    virtual string toString() const = 0;
    virtual ~Expression() = default;
};

// 数值节点
class Number : public Expression {
private:
    double value;
    
public:
    Number(double v) : value(v) {}
    
    double evaluate(const unordered_map<string, double>&) const override {
        return value;
    }
    
    string toString() const override {
        return to_string(value);
    }
};

// 变量节点
class Variable : public Expression {
private:
    string name;
    
public:
    Variable(const string& n) : name(n) {}
    
    double evaluate(const unordered_map<string, double>& variables) const override {
        auto it = variables.find(name);
        if (it != variables.end()) {
            return it->second;
        }
        throw runtime_error("未定义的变量：" + name);
    }
    
    string toString() const override {
        return name;
    }
};

// 二元运算符基类
class BinaryOp : public Expression {
protected:
    unique_ptr<Expression> left;
    unique_ptr<Expression> right;
    string opSymbol;
    
public:
    BinaryOp(unique_ptr<Expression> l, unique_ptr<Expression> r, const string& sym)
        : left(move(l)), right(move(r)), opSymbol(sym) {}
    
    string toString() const override {
        return "(" + left->toString() + " " + opSymbol + " " + right->toString() + ")";
    }
};

// 加法
class Add : public BinaryOp {
public:
    Add(unique_ptr<Expression> l, unique_ptr<Expression> r)
        : BinaryOp(move(l), move(r), "+") {}
    
    double evaluate(const unordered_map<string, double>& vars) const override {
        return left->evaluate(vars) + right->evaluate(vars);
    }
};

// 减法
class Subtract : public BinaryOp {
public:
    Subtract(unique_ptr<Expression> l, unique_ptr<Expression> r)
        : BinaryOp(move(l), move(r), "-") {}
    
    double evaluate(const unordered_map<string, double>& vars) const override {
        return left->evaluate(vars) - right->evaluate(vars);
    }
};

// 乘法
class Multiply : public BinaryOp {
public:
    Multiply(unique_ptr<Expression> l, unique_ptr<Expression> r)
        : BinaryOp(move(l), move(r), "*") {}
    
    double evaluate(const unordered_map<string, double>& vars) const override {
        return left->evaluate(vars) * right->evaluate(vars);
    }
};

// 除法
class Divide : public BinaryOp {
public:
    Divide(unique_ptr<Expression> l, unique_ptr<Expression> r)
        : BinaryOp(move(l), move(r), "/") {}
    
    double evaluate(const unordered_map<string, double>& vars) const override {
        double divisor = right->evaluate(vars);
        if (divisor == 0) throw runtime_error("除数为零");
        return left->evaluate(vars) / divisor;
    }
};

int main() {
    cout << "========== 带变量支持的计算器 ==========\n" << endl;
    
    // 构建表达式：x * 2 + y / 3
    auto expr = make_unique<Add>(
        make_unique<Multiply>(
            make_unique<Variable>("x"),
            make_unique<Number>(2)
        ),
        make_unique<Divide>(
            make_unique<Variable>("y"),
            make_unique<Number>(3)
        )
    );
    
    cout << "表达式：" << expr->toString() << endl;
    
    // 使用不同的变量值计算
    unordered_map<string, double> vars1 = {{"x", 10}, {"y", 9}};
    cout << "当 x=10, y=9 时：" << expr->evaluate(vars1) << endl;
    
    unordered_map<string, double> vars2 = {{"x", 3.5}, {"y", 6.0}};
    cout << "当 x=3.5, y=6 时：" << expr->evaluate(vars2) << endl;
    
    unordered_map<string, double> vars3 = {{"x", 0}, {"y", 100}};
    cout << "当 x=0, y=100 时：" << expr->evaluate(vars3) << endl;
    
    return 0;
}
```

## 六、总结

纯虚函数、抽象类、虚析构函数以及final和override关键字是C++多态机制的进阶内容，它们共同构成了C++面向对象编程的完整工具集。

### 核心知识点回顾

1. **纯虚函数与抽象类**：纯虚函数使用`= 0`声明，包含纯虚函数的类是抽象类，不能实例化。抽象类用于定义接口规范。

2. **接口继承与实现继承**：接口继承通过纯虚函数定义契约，实现继承通过普通虚函数提供默认实现。两者可以结合使用。

3. **虚析构函数**：基类的析构函数应该声明为虚函数，确保通过基类指针delete派生类对象时能正确调用派生类析构函数。

4. **final关键字**：修饰类时禁止继承，修饰虚函数时禁止重写。用于锁定类层次结构。

5. **override关键字**：显式声明函数是对基类虚函数的重写，编译器会检查签名是否正确匹配。

### 设计原则

- 如果一个类被设计为基类，就应该声明虚析构函数
- 使用`override`关键字避免因函数签名不匹配导致的无意隐藏
- 使用`final`关键字在适当的层次锁定虚函数或类
- 将接口与实现分离，使用纯虚函数定义接口，使用普通虚函数提供默认行为
- 抽象类可以有构造函数、成员变量和非纯虚函数，不能直接实例化但不影响其作为基类的价值

通过合理运用这些进阶特性，我们可以构建出更加健壮、可维护的面向对象系统。接口的清晰定义、正确的资源管理、以及编译期的错误检查，都是高质量C++代码的重要保障。
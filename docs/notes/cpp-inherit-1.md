---
title: C++继承与多态Ⅰ——继承基础
date: 2026-07-26
tags:
  - C++
  - 继承
  - 多态
categories:
  - C++
---

## 一、继承概述

继承是面向对象编程三大特性（封装、继承、多态）中承上启下的关键一环。它允许我们以一种层次化的方式组织类，使得子类可以复用父类的代码，同时又能扩展自己的功能。在C++中，继承不仅仅是语法层面的便利，更深刻地影响了对象的内存布局、构造析构顺序以及类型系统的设计。

### 1.1 为什么需要继承

在实际开发中，我们经常会遇到这样的情况：多个类之间存在"is-a"的关系。例如，狗是一种动物，猫也是一种动物。动物具有共同的属性（如年龄、体重）和行为（如吃、睡），而狗和猫又各自有自己独特的行为（如狗会看门，猫会抓老鼠）。

如果不使用继承，我们可能需要为每个类分别定义这些共同的属性和行为，导致大量重复代码。继承的核心价值在于：

- **代码复用**：子类自动拥有父类的成员，无需重复编写。
- **层次化组织**：通过继承关系构建清晰的类层次结构，使得代码更易于理解和维护。
- **多态基础**：继承是实现运行时多态的前提条件，为面向对象设计模式提供了基础。
- **扩展性**：可以在不修改原有代码的情况下，通过派生新类来扩展系统功能。

### 1.2 继承的基本概念

在C++中，继承关系涉及两个角色：

- **基类（Base Class）**：也称为父类或超类，是被继承的类。它定义了通用的接口和实现。
- **派生类（Derived Class）**：也称为子类，是从基类派生出来的类。它继承了基类的成员，并可以添加新的成员或重写基类的行为。

C++支持多种继承方式，包括单继承、多继承和虚继承，这为开发者提供了极大的灵活性，但也带来了复杂性。

## 二、继承的基本语法

### 2.1 单继承语法

C++中单继承的基本语法格式如下：

```cpp
class 派生类名 : 继承方式 基类名 {
    // 派生类的新成员
};
```

下面是一个最简单的继承示例：

```cpp
#include <iostream>
#include <string>
using namespace std;

// 基类：动物
class Animal {
public:
    string name;
    int age;
    
    void eat() {
        cout << name << "正在吃东西" << endl;
    }
    
    void sleep() {
        cout << name << "正在睡觉" << endl;
    }
};

// 派生类：狗，以public方式继承Animal
class Dog : public Animal {
public:
    void bark() {
        cout << name << "正在汪汪叫！" << endl;
    }
};

int main() {
    Dog myDog;
    myDog.name = "旺财";
    myDog.age = 3;
    
    // 调用从基类继承的方法
    myDog.eat();    // 输出：旺财正在吃东西
    myDog.sleep();  // 输出：旺财正在睡觉
    
    // 调用派生类自己的方法
    myDog.bark();   // 输出：旺财正在汪汪叫！
    
    cout << "年龄：" << myDog.age << "岁" << endl;
    
    return 0;
}
```

在这个示例中，`Dog`类通过`public`继承方式继承了`Animal`类。这意味着`Dog`对象可以直接访问`Animal`中定义的`public`成员（`name`、`age`、`eat()`、`sleep()`），同时还可以使用自己定义的`bark()`方法。

### 2.2 继承的深层含义

继承不仅仅是代码的简单复制。当我们说"Dog类继承了Animal类"时，实际上发生了以下事情：

1. 编译器在`Dog`类的对象内存布局中包含了`Animal`类的所有非静态成员。
2. Dog类获得了对`Animal`类中所有public和protected成员的访问权限（具体取决于继承方式）。
3. 类型系统允许在需要`Animal`引用的地方使用`Dog`对象（向上转型）。

重要的是理解：继承创建了一个"is-a"关系。Dog是一个Animal，因此Dog对象可以被当作Animal对象来使用。

## 三、继承方式详解

C++提供了三种继承方式：`public`继承、`protected`继承和`private`继承。这三种方式决定了基类成员在派生类中的访问权限。

### 3.1 public继承

public继承是最常用的继承方式，它保持了基类成员的访问权限不变：

- 基类的public成员在派生类中仍然是public的
- 基类的protected成员在派生类中仍然是protected的
- 基类的private成员在派生类中不可直接访问

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    int publicVar;
    
protected:
    int protectedVar;
    
private:
    int privateVar;
    
public:
    Base() : publicVar(1), protectedVar(2), privateVar(3) {}
    
    void showBase() {
        cout << "Base类内部：" << endl;
        cout << "  publicVar = " << publicVar << endl;
        cout << "  protectedVar = " << protectedVar << endl;
        cout << "  privateVar = " << privateVar << endl;
    }
};

class DerivedPublic : public Base {
public:
    void showDerived() {
        cout << "DerivedPublic类内部：" << endl;
        cout << "  publicVar = " << publicVar << endl;       // 可以访问，仍是public
        cout << "  protectedVar = " << protectedVar << endl; // 可以访问，仍是protected
        // cout << "  privateVar = " << privateVar << endl;  // 错误！private成员不可访问
    }
};

int main() {
    DerivedPublic obj;
    
    // 外部可以访问public成员
    cout << "外部访问 publicVar = " << obj.publicVar << endl;
    
    // 外部不能访问protected成员
    // cout << obj.protectedVar << endl;  // 错误！
    
    // 外部不能访问private成员
    // cout << obj.privateVar << endl;    // 错误！
    
    obj.showBase();
    obj.showDerived();
    
    return 0;
}
```

### 3.2 protected继承

protected继承会使基类中的public成员在派生类中变为protected：

- 基类的public成员在派生类中变为protected
- 基类的protected成员在派生类中仍然是protected
- 基类的private成员在派生类中不可直接访问

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    int publicVar;
protected:
    int protectedVar;
private:
    int privateVar;
    
public:
    Base() : publicVar(1), protectedVar(2), privateVar(3) {}
};

class DerivedProtected : protected Base {
public:
    void showDerived() {
        cout << "DerivedProtected类内部：" << endl;
        cout << "  publicVar = " << publicVar << endl;       // 可以访问，但现在是protected
        cout << "  protectedVar = " << protectedVar << endl; // 可以访问，仍是protected
        // cout << "  privateVar = " << privateVar << endl;  // 错误！private成员不可访问
    }
};

// 进一步派生，验证protected继承的影响
class GrandChild : public DerivedProtected {
public:
    void showGrandChild() {
        cout << "GrandChild类内部：" << endl;
        cout << "  publicVar = " << publicVar << endl;       // 可以访问（在DerivedProtected中是protected）
        cout << "  protectedVar = " << protectedVar << endl; // 可以访问
    }
};

int main() {
    DerivedProtected obj;
    
    // 外部不能访问publicVar，因为它在DerivedProtected中变成了protected
    // cout << obj.publicVar << endl;  // 错误！
    
    obj.showDerived();
    
    GrandChild gc;
    gc.showGrandChild();
    
    return 0;
}
```

### 3.3 private继承

private继承会使基类中的所有public和protected成员在派生类中变为private：

- 基类的public成员在派生类中变为private
- 基类的protected成员在派生类中变为private
- 基类的private成员在派生类中不可直接访问

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    int publicVar;
protected:
    int protectedVar;
    
public:
    Base() : publicVar(1), protectedVar(2) {}
};

class DerivedPrivate : private Base {
public:
    void showDerived() {
        cout << "DerivedPrivate类内部：" << endl;
        cout << "  publicVar = " << publicVar << endl;       // 可以访问，但现在是private
        cout << "  protectedVar = " << protectedVar << endl; // 可以访问，但现在是private
    }
};

// 进一步派生，验证private继承的影响
class GrandChild2 : public DerivedPrivate {
public:
    void showGrandChild() {
        // 以下两行都会报错，因为在DerivedPrivate中所有Base成员都是private的
        // cout << "  publicVar = " << publicVar << endl;       // 错误！
        // cout << "  protectedVar = " << protectedVar << endl; // 错误！
        cout << "GrandChild2无法访问Base的任何成员" << endl;
    }
};

int main() {
    DerivedPrivate obj;
    
    // 外部不能访问任何Base成员
    // cout << obj.publicVar << endl;  // 错误！
    
    obj.showDerived();
    
    GrandChild2 gc;
    gc.showGrandChild();
    
    return 0;
}
```

### 3.4 三种继承方式对比总结

| 继承方式 | 基类public成员 | 基类protected成员 | 基类private成员 |
|---------|---------------|------------------|----------------|
| public继承 | 在派生类中为public | 在派生类中为protected | 在派生类中不可见 |
| protected继承 | 在派生类中为protected | 在派生类中为protected | 在派生类中不可见 |
| private继承 | 在派生类中为private | 在派生类中为private | 在派生类中不可见 |

需要特别注意的是，无论采用哪种继承方式，基类的private成员在派生类中都是不可直接访问的。这是C++封装性的体现——基类的实现细节不应该被子类直接访问。

## 四、继承中的构造与析构顺序

### 4.1 构造函数的调用顺序

当创建一个派生类对象时，构造函数的调用顺序遵循"先基类，后派生类"的原则：

1. 首先调用基类的构造函数
2. 然后按照成员变量在类中声明的顺序，依次调用成员对象的构造函数
3. 最后调用派生类自己的构造函数

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() {
        cout << "Base类构造函数被调用" << endl;
    }
    
    Base(int x) {
        cout << "Base类有参构造函数被调用，参数x = " << x << endl;
    }
    
    ~Base() {
        cout << "Base类析构函数被调用" << endl;
    }
};

class Member {
public:
    Member(const string& name) : name_(name) {
        cout << "Member类构造函数被调用，成员名 = " << name_ << endl;
    }
    
    ~Member() {
        cout << "Member类析构函数被调用，成员名 = " << name_ << endl;
    }
    
private:
    string name_;
};

class Derived : public Base {
public:
    // 无参构造：会先调用Base的无参构造，再初始化成员对象m1和m2，最后执行派生类构造函数体
    Derived() : m1("成员A"), m2("成员B") {
        cout << "Derived类无参构造函数被调用" << endl;
    }
    
    // 有参构造：显式指定基类构造函数和成员初始化
    Derived(int baseVal, const string& s1, const string& s2) 
        : Base(baseVal), m1(s1), m2(s2) {
        cout << "Derived类有参构造函数被调用" << endl;
    }
    
    ~Derived() {
        cout << "Derived类析构函数被调用" << endl;
    }
    
private:
    Member m1;  // 注意：成员声明顺序决定了初始化顺序
    Member m2;
};

int main() {
    cout << "===== 创建Derived无参对象 =====" << endl;
    Derived d1;
    cout << endl;
    
    cout << "===== 创建Derived有参对象 =====" << endl;
    Derived d2(100, "对象X", "对象Y");
    cout << endl;
    
    cout << "===== 程序结束，开始析构 =====" << endl;
    
    return 0;
}
```

**输出结果分析**：

```
===== 创建Derived无参对象 =====
Base类构造函数被调用
Member类构造函数被调用，成员名 = 成员A
Member类构造函数被调用，成员名 = 成员B
Derived类无参构造函数被调用
```

从这个输出可以清楚地看到构造顺序：先基类，再成员对象（按声明顺序），最后派生类本身。

### 4.2 析构函数的调用顺序

析构函数的调用顺序与构造函数完全相反，遵循"先派生类，后基类"的原则：

1. 首先调用派生类的析构函数
2. 然后按照成员变量声明顺序的逆序，依次调用成员对象的析构函数
3. 最后调用基类的析构函数

这种"后进先出"的设计确保了资源的正确释放。例如，派生类的析构函数可以安全地使用基类成员，因为此时基类还没有被析构。

### 4.3 派生类向基类传参

当基类没有默认构造函数时，派生类必须在初始化列表中显式调用基类的有参构造函数：

```cpp
#include <iostream>
#include <string>
using namespace std;

class Person {
protected:
    string name;
    int age;
    
public:
    // 没有默认构造函数
    Person(const string& n, int a) : name(n), age(a) {
        cout << "Person构造函数：姓名=" << name << ", 年龄=" << age << endl;
    }
    
    void showInfo() const {
        cout << "姓名：" << name << ", 年龄：" << age << endl;
    }
};

class Student : public Person {
private:
    string studentId;
    double score;
    
public:
    // 必须在初始化列表中显式调用Person的构造函数
    Student(const string& n, int a, const string& id, double s) 
        : Person(n, a), studentId(id), score(s) {
        cout << "Student构造函数：学号=" << studentId << ", 成绩=" << score << endl;
    }
    
    void showStudentInfo() const {
        showInfo();  // 调用基类方法
        cout << "学号：" << studentId << ", 成绩：" << score << endl;
    }
};

int main() {
    Student stu("张三", 20, "2024001", 92.5);
    cout << "\n学生信息：" << endl;
    stu.showStudentInfo();
    
    return 0;
}
```

### 4.4 多重层次的构造析构顺序

当继承层次更深时，构造析构顺序仍然遵循先基类后派生类的原则：

```cpp
#include <iostream>
using namespace std;

class GrandParent {
public:
    GrandParent() { cout << "GrandParent构造" << endl; }
    ~GrandParent() { cout << "GrandParent析构" << endl; }
};

class Parent : public GrandParent {
public:
    Parent() { cout << "  Parent构造" << endl; }
    ~Parent() { cout << "  Parent析构" << endl; }
};

class Child : public Parent {
public:
    Child() { cout << "    Child构造" << endl; }
    ~Child() { cout << "    Child析构" << endl; }
};

int main() {
    cout << "创建Child对象：" << endl;
    Child c;
    cout << "\nChild对象即将销毁：" << endl;
    
    return 0;
}
```

**输出结果**：

```
创建Child对象：
GrandParent构造
  Parent构造
    Child构造

Child对象即将销毁：
    Child析构
  Parent析构
GrandParent析构
```

## 五、子类访问父类成员

### 5.1 直接访问public和protected成员

派生类中可以直接访问基类的public和protected成员（无论哪种继承方式，只是访问权限会相应变化）：

```cpp
#include <iostream>
#include <string>
using namespace std;

class Vehicle {
public:
    string brand;
    
    void start() {
        cout << brand << "启动了" << endl;
    }
    
protected:
    double speed;  // 速度，protected成员
    
    void accelerate(double delta) {
        speed += delta;
        cout << "加速，当前速度：" << speed << " km/h" << endl;
    }
    
private:
    string engineCode;  // 发动机编号，private成员
    
public:
    Vehicle(const string& b, const string& code) 
        : brand(b), speed(0), engineCode(code) {}
    
    void showEngine() const {
        cout << "发动机编号：" << engineCode << endl;
    }
};

class Car : public Vehicle {
private:
    int doorCount;  // 车门数量
    
public:
    Car(const string& b, const string& code, int doors)
        : Vehicle(b, code), doorCount(doors) {}
    
    void drive() {
        // 直接访问基类的public成员
        cout << brand << "汽车正在行驶，车门数：" << doorCount << endl;
        
        // 直接访问基类的protected成员
        accelerate(30);  // 可以访问protected方法
        cout << "当前速度：" << speed << " km/h" << endl;  // 可以访问protected成员
        
        // 不能直接访问基类的private成员
        // cout << engineCode << endl;  // 错误！private成员不可访问
        
        // 但可以通过基类的public方法间接访问
        showEngine();  // 这个是可以的
    }
};

int main() {
    Car myCar("丰田", "ENG-2024-001", 4);
    myCar.drive();
    
    return 0;
}
```

### 5.2 使用using声明改变访问权限

在某些情况下，我们可能希望调整基类成员在派生类中的访问权限。C++提供了`using`声明来实现这一点：

```cpp
#include <iostream>
using namespace std;

class Base {
protected:
    void protectedMethod() {
        cout << "这是Base的protected方法" << endl;
    }
    
    int protectedValue = 42;
    
public:
    void publicMethod() {
        cout << "这是Base的public方法" << endl;
    }
};

class Derived : private Base {
public:
    // 使用using声明将基类的protected方法提升为public
    using Base::protectedMethod;
    
    // 使用using声明将基类的protected成员变量提升为public
    using Base::protectedValue;
    
    // 使用using声明将基类的public方法保持为public
    using Base::publicMethod;
    
    void derivedMethod() {
        cout << "这是Derived自己的方法" << endl;
        protectedMethod();  // 内部可以访问
    }
};

int main() {
    Derived d;
    
    // 现在外部可以访问这些被提升为public的成员
    d.protectedMethod();  // 可以！原本是protected，现在被提升为public
    d.publicMethod();     // 可以！原本是public，被using声明保持为public
    cout << "protectedValue = " << d.protectedValue << endl;  // 可以！
    
    d.derivedMethod();
    
    return 0;
}
```

### 5.3 通过基类指针或引用访问

当使用基类指针或引用指向派生类对象时，默认只能访问基类中定义的成员：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    void baseMethod() {
        cout << "Base::baseMethod()" << endl;
    }
    
    virtual void virtualMethod() {
        cout << "Base::virtualMethod()" << endl;
    }
};

class Derived : public Base {
public:
    void derivedMethod() {
        cout << "Derived::derivedMethod()" << endl;
    }
    
    void virtualMethod() override {
        cout << "Derived::virtualMethod()" << endl;
    }
};

int main() {
    Derived derivedObj;
    Base* basePtr = &derivedObj;  // 基类指针指向派生类对象
    Base& baseRef = derivedObj;    // 基类引用绑定派生类对象
    
    // 通过基类指针只能访问基类中定义的成员
    basePtr->baseMethod();        // 可以
    basePtr->virtualMethod();     // 可以，并且由于虚函数机制，会调用派生类的版本
    
    // basePtr->derivedMethod();  // 错误！基类指针不能访问派生类特有成员
    
    // 同样，基类引用也只能访问基类中定义的成员
    baseRef.baseMethod();
    baseRef.virtualMethod();
    
    // 如果需要访问派生类特有成员，需要向下转型
    Derived* derivedPtr = static_cast<Derived*>(basePtr);
    derivedPtr->derivedMethod();  // 现在可以了
    
    return 0;
}
```

## 六、同名成员处理

### 6.1 同名成员变量

当派生类和基类中有同名的成员变量时，派生类的成员变量会"隐藏"基类的同名成员变量。访问基类的同名成员需要使用作用域解析运算符`::`：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    int value;
    
    Base() : value(100) {
        cout << "Base构造，value = " << value << endl;
    }
};

class Derived : public Base {
public:
    int value;  // 与基类的value同名
    
    Derived() : value(200) {
        cout << "Derived构造，value = " << value << endl;
    }
    
    void showValues() {
        cout << "派生类的value = " << value << endl;            // 200
        cout << "基类的value = " << Base::value << endl;        // 100，使用作用域解析
        cout << "直接访问基类value = " << Base::value << endl;  // 同样使用作用域解析
    }
};

int main() {
    Derived d;
    d.showValues();
    
    // 外部访问
    cout << "\n外部访问：" << endl;
    cout << "d.value = " << d.value << endl;            // 200，默认访问派生类的
    cout << "d.Base::value = " << d.Base::value << endl; // 100，显式指定基类
    
    return 0;
}
```

### 6.2 同名成员函数

当派生类和基类中有同名的成员函数时，即使参数列表不同，派生类的函数也会隐藏基类中所有同名的函数（包括重载版本）。这被称为"名称隐藏"：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    void func() {
        cout << "Base::func() 无参数" << endl;
    }
    
    void func(int x) {
        cout << "Base::func(int) 参数 = " << x << endl;
    }
    
    void func(double x, double y) {
        cout << "Base::func(double, double) 参数 = " << x << ", " << y << endl;
    }
};

class Derived : public Base {
public:
    // 只要派生类中定义了同名函数，就会隐藏基类中所有同名函数
    void func() {
        cout << "Derived::func() 无参数" << endl;
    }
    
    void test() {
        func();              // 调用派生类的func()
        // func(10);         // 错误！基类的func(int)被隐藏了
        Base::func(10);      // 正确，通过作用域解析调用基类版本
        Base::func(3.14, 2.71); // 正确，调用基类的重载版本
    }
};

int main() {
    Derived d;
    d.func();           // 调用派生类的func()
    // d.func(10);      // 错误！基类的func(int)被隐藏
    d.Base::func(10);   // 正确，显式调用基类版本
    
    d.test();
    
    return 0;
}
```

### 6.3 使用using声明解除名称隐藏

如果希望基类的所有重载版本在派生类中都可见，可以使用`using`声明：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    void func() {
        cout << "Base::func() 无参数" << endl;
    }
    
    void func(int x) {
        cout << "Base::func(int) 参数 = " << x << endl;
    }
    
    void func(double x, double y) {
        cout << "Base::func(double, double) 参数 = " << x << ", " << y << endl;
    }
};

class Derived : public Base {
public:
    // 使用using声明，使基类的所有func重载版本在派生类中可见
    using Base::func;
    
    // 派生类自己的func版本
    void func(const string& s) {
        cout << "Derived::func(string) 参数 = " << s << endl;
    }
};

int main() {
    Derived d;
    
    // 现在所有版本都可以正常调用了
    d.func();                    // 调用Base::func()
    d.func(42);                  // 调用Base::func(int)
    d.func(3.14, 2.71);         // 调用Base::func(double, double)
    d.func("Hello, C++!");      // 调用Derived::func(string)
    
    return 0;
}
```

### 6.4 静态成员的同名处理

静态成员的同名处理规则与非静态成员类似，派生类的静态成员会隐藏基类的同名静态成员：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    static int count;
    static void show() {
        cout << "Base::show() count = " << count << endl;
    }
};

int Base::count = 10;

class Derived : public Base {
public:
    static int count;  // 隐藏Base::count
    static void show() {
        cout << "Derived::show() count = " << count << endl;
        cout << "Base::count = " << Base::count << endl;
    }
};

int Derived::count = 20;

int main() {
    cout << "通过类名访问：" << endl;
    cout << "Base::count = " << Base::count << endl;
    cout << "Derived::count = " << Derived::count << endl;
    cout << "Derived::Base::count = " << Derived::Base::count << endl;
    
    cout << "\n通过对象访问：" << endl;
    Derived d;
    cout << "d.count = " << d.count << endl;
    cout << "d.Base::count = " << d.Base::count << endl;
    
    cout << "\n静态方法调用：" << endl;
    Derived::show();
    Derived::Base::show();
    
    return 0;
}
```

## 七、菱形继承问题

### 7.1 什么是菱形继承

菱形继承（Diamond Inheritance）是指一个派生类同时继承自两个基类，而这两个基类又继承自同一个共同的祖先类。其继承关系图呈菱形，因此得名。

```
      A
     / \
    B   C
     \ /
      D
```

```cpp
#include <iostream>
using namespace std;

// 共同祖先
class Animal {
public:
    int age;
    
    Animal() : age(0) {
        cout << "Animal构造" << endl;
    }
    
    void breathe() {
        cout << "动物在呼吸" << endl;
    }
};

// 中间基类1
class Mammal : public Animal {
public:
    Mammal() {
        cout << "Mammal构造" << endl;
    }
    
    void lactate() {
        cout << "哺乳动物在哺乳" << endl;
    }
};

// 中间基类2
class Bird : public Animal {
public:
    Bird() {
        cout << "Bird构造" << endl;
    }
    
    void layEggs() {
        cout << "鸟类在下蛋" << endl;
    }
};

// 最终派生类：同时继承Mammal和Bird
class Platypus : public Mammal, public Bird {
public:
    Platypus() {
        cout << "Platypus（鸭嘴兽）构造" << endl;
    }
};

int main() {
    Platypus p;
    
    // 问题1：age成员有二义性
    // p.age = 5;  // 错误！不知道是Mammal::age还是Bird::age
    
    // 必须显式指定路径
    p.Mammal::age = 5;
    p.Bird::age = 3;
    
    cout << "Mammal::age = " << p.Mammal::age << endl;
    cout << "Bird::age = " << p.Bird::age << endl;
    
    // 问题2：Animal的构造函数被调用了两次
    // 输出会显示：
    // Animal构造
    // Mammal构造
    // Animal构造
    // Bird构造
    // Platypus（鸭嘴兽）构造
    
    // 问题3：breathe()方法有二义性
    // p.breathe();  // 错误！
    p.Mammal::breathe();  // 必须指定路径
    
    return 0;
}
```

### 7.2 菱形继承带来的问题

菱形继承主要带来两个严重问题：

**问题一：数据冗余**

在菱形继承中，最终派生类`Platypus`会包含两份`Animal`基类的数据成员副本。`Platypus`对象中同时存在`Mammal::Animal::age`和`Bird::Animal::age`两个`age`成员变量。这不仅浪费内存，而且两个副本可能具有不同的值，导致数据不一致。

我们可以通过以下代码验证这个问题：

```cpp
#include <iostream>
using namespace std;

class A {
public:
    int data;
    A() : data(0) {}
};

class B : public A {};
class C : public A {};
class D : public B, public C {};

int main() {
    D d;
    
    // 验证D对象的大小
    cout << "sizeof(D) = " << sizeof(D) << " 字节" << endl;
    // 输出：sizeof(D) = 8 字节（两个int，每个4字节）
    // 而如果只有一份A，应该是4字节
    
    // 验证两个副本的地址不同
    cout << "B::A::data 地址: " << &d.B::data << endl;
    cout << "C::A::data 地址: " << &d.C::data << endl;
    
    // 两个地址不同，说明确实存在两个独立的副本
    d.B::data = 10;
    d.C::data = 20;
    cout << "B::data = " << d.B::data << endl;  // 10
    cout << "C::data = " << d.C::data << endl;  // 20
    
    return 0;
}
```

**问题二：二义性**

访问共同祖先的成员时会产生二义性，编译器不知道应该使用哪条继承路径上的成员。必须显式使用作用域解析运算符来指定路径。

### 7.3 菱形继承的内存布局分析

为了更好地理解菱形继承的问题，我们可以通过分析内存布局来直观地看到数据的冗余：

```cpp
#include <iostream>
#include <cstdint>
using namespace std;

class A {
public:
    int a_data;
    A() : a_data(0xAAAAAAAA) {}
};

class B : public A {
public:
    int b_data;
    B() : b_data(0xBBBBBBBB) {}
};

class C : public A {
public:
    int c_data;
    C() : c_data(0xCCCCCCCC) {}
};

class D : public B, public C {
public:
    int d_data;
    D() : d_data(0xDDDDDDDD) {}
};

int main() {
    D d;
    
    cout << "D对象的大小: " << sizeof(D) << " 字节" << endl;
    cout << "内存布局：" << endl;
    
    unsigned char* bytes = reinterpret_cast<unsigned char*>(&d);
    cout << "D对象起始地址: " << static_cast<void*>(&d) << endl;
    
    cout << "\nB子对象地址: " << static_cast<B*>(&d) << endl;
    cout << "  B::A::a_data 地址: " << &d.B::a_data << endl;
    cout << "  B::b_data 地址: " << &d.B::b_data << endl;
    
    cout << "\nC子对象地址: " << static_cast<C*>(&d) << endl;
    cout << "  C::A::a_data 地址: " << &d.C::a_data << endl;
    cout << "  C::c_data 地址: " << &d.C::c_data << endl;
    
    cout << "\nD::d_data 地址: " << &d.d_data << endl;
    
    // 验证两个A子对象确实是独立的
    d.B::a_data = 111;
    d.C::a_data = 222;
    cout << "\nB::a_data = " << d.B::a_data << endl;
    cout << "C::a_data = " << d.C::a_data << endl;
    
    return 0;
}
```

这个程序清楚地展示了菱形继承的内存布局问题：`D`对象中包含两个`A`子对象，分别位于`B`子对象和`C`子对象中。这就是"C++虚继承"要解决的核心问题。

## 八、继承中的类型转换

### 8.1 向上转型（Upcasting）

向上转型是指将派生类指针或引用转换为基类指针或引用。这种转换是安全的、隐式的，因为派生类对象"is-a"基类对象：

```cpp
#include <iostream>
using namespace std;

class Shape {
public:
    string color;
    
    Shape(const string& c) : color(c) {}
    
    void setColor(const string& c) {
        color = c;
    }
    
    virtual void draw() const {
        cout << "绘制一个" << color << "的图形" << endl;
    }
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(const string& c, double r) : Shape(c), radius(r) {}
    
    void draw() const override {
        cout << "绘制一个" << color << "的圆形，半径=" << radius << endl;
    }
    
    double getArea() const {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(const string& c, double w, double h) 
        : Shape(c), width(w), height(h) {}
    
    void draw() const override {
        cout << "绘制一个" << color << "的矩形，宽=" << width 
             << "，高=" << height << endl;
    }
};

// 接受基类引用的函数
void renderShape(const Shape& shape) {
    shape.draw();
}

// 接受基类指针的函数
void processShape(Shape* shape) {
    shape->setColor("蓝色");
    shape->draw();
}

int main() {
    Circle circle("红色", 5.0);
    Rectangle rect("绿色", 10.0, 6.0);
    
    // 隐式向上转型：派生类引用转为基类引用
    renderShape(circle);  // Circle& 自动转为 Shape&
    renderShape(rect);    // Rectangle& 自动转为 Shape&
    
    cout << endl;
    
    // 隐式向上转型：派生类指针转为基类指针
    processShape(&circle);  // Circle* 自动转为 Shape*
    processShape(&rect);    // Rectangle* 自动转为 Shape*
    
    return 0;
}
```

### 8.2 向下转型（Downcasting）

向下转型是指将基类指针或引用转换为派生类指针或引用。这种转换不是安全的，因为基类指针可能并不实际指向派生类对象。C++提供了`static_cast`和`dynamic_cast`两种方式：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual ~Base() {}  // 必须有虚函数才能使用dynamic_cast
    
    virtual void identify() const {
        cout << "我是Base" << endl;
    }
};

class Derived1 : public Base {
public:
    void identify() const override {
        cout << "我是Derived1" << endl;
    }
    
    void derived1Method() {
        cout << "Derived1特有的方法" << endl;
    }
};

class Derived2 : public Base {
public:
    void identify() const override {
        cout << "我是Derived2" << endl;
    }
    
    void derived2Method() {
        cout << "Derived2特有的方法" << endl;
    }
};

int main() {
    Derived1 d1;
    Derived2 d2;
    
    Base* basePtr = &d1;  // 基类指针指向Derived1对象
    
    // 使用dynamic_cast进行安全的向下转型
    Derived1* d1Ptr = dynamic_cast<Derived1*>(basePtr);
    if (d1Ptr != nullptr) {
        cout << "dynamic_cast成功：指向Derived1" << endl;
        d1Ptr->derived1Method();
    }
    
    Derived2* d2Ptr = dynamic_cast<Derived2*>(basePtr);
    if (d2Ptr == nullptr) {
        cout << "dynamic_cast失败：不指向Derived2" << endl;
    }
    
    // 使用static_cast（不安全，需要程序员自己保证正确性）
    Derived1* staticPtr = static_cast<Derived1*>(basePtr);
    staticPtr->derived1Method();  // 安全，因为basePtr确实指向Derived1
    
    // 危险示例：static_cast不会检查类型
    Base* basePtr2 = &d2;
    Derived1* wrongPtr = static_cast<Derived1*>(basePtr2);  // 编译器不报错
    // wrongPtr->derived1Method();  // 未定义行为！
    
    return 0;
}
```

## 九、继承中的赋值兼容规则

### 9.1 派生类对象赋值给基类对象

可以将派生类对象赋值给基类对象，但会发生"对象切片"（Object Slicing），即只有基类部分被复制，派生类特有的成员被丢弃：

```cpp
#include <iostream>
#include <string>
using namespace std;

class Person {
protected:
    string name;
    int age;
    
public:
    Person(const string& n = "", int a = 0) : name(n), age(a) {}
    
    virtual void display() const {
        cout << "Person: 姓名=" << name << ", 年龄=" << age;
    }
    
    // 虚函数用于展示切片效果
    virtual string getType() const {
        return "Person";
    }
};

class Student : public Person {
private:
    string studentId;
    double gpa;
    
public:
    Student(const string& n, int a, const string& id, double g) 
        : Person(n, a), studentId(id), gpa(g) {}
    
    void display() const override {
        Person::display();
        cout << ", 学号=" << studentId << ", GPA=" << gpa;
    }
    
    string getType() const override {
        return "Student";
    }
};

int main() {
    Student stu("李四", 21, "S2024001", 3.8);
    cout << "原始Student对象：" << endl;
    stu.display();
    cout << endl;
    cout << "类型：" << stu.getType() << endl;
    cout << "sizeof(Student) = " << sizeof(Student) << endl;
    
    // 对象切片：将Student对象赋值给Person对象
    Person person = stu;  // 发生切片！
    
    cout << "\n切片后的Person对象：" << endl;
    person.display();
    cout << endl;
    cout << "类型：" << person.getType() << endl;  // 仍然是Person！
    cout << "sizeof(Person) = " << sizeof(Person) << endl;
    
    // 这证明了切片确实发生了：person对象只包含Person部分的数据
    
    return 0;
}
```

### 9.2 避免对象切片

为了避免对象切片，应该使用指针或引用来操作派生类对象：

```cpp
#include <iostream>
#include <vector>
#include <memory>
using namespace std;

class Animal {
public:
    virtual void makeSound() const {
        cout << "动物发出声音" << endl;
    }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void makeSound() const override {
        cout << "汪汪！" << endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() const override {
        cout << "喵喵！" << endl;
    }
};

int main() {
    // 错误方式：使用vector<Animal>会导致切片
    cout << "=== 错误方式：vector<Animal> ===" << endl;
    vector<Animal> wrongAnimals;
    wrongAnimals.push_back(Dog());  // 切片！
    wrongAnimals.push_back(Cat());  // 切片！
    for (const auto& a : wrongAnimals) {
        a.makeSound();  // 都输出"动物发出声音"
    }
    
    // 正确方式1：使用指针
    cout << "\n=== 正确方式：指针 ===" << endl;
    vector<Animal*> ptrAnimals;
    Dog dog;
    Cat cat;
    ptrAnimals.push_back(&dog);
    ptrAnimals.push_back(&cat);
    for (const auto& a : ptrAnimals) {
        a->makeSound();  // 正确输出各自的声音
    }
    
    // 正确方式2：使用智能指针
    cout << "\n=== 正确方式：智能指针 ===" << endl;
    vector<unique_ptr<Animal>> smartAnimals;
    smartAnimals.push_back(make_unique<Dog>());
    smartAnimals.push_back(make_unique<Cat>());
    for (const auto& a : smartAnimals) {
        a->makeSound();  // 正确输出各自的声音
    }
    
    return 0;
}
```

## 十、继承与访问控制的综合案例

### 10.1 一个完整的银行账户系统

下面通过一个完整的银行账户系统来综合演示继承的各个方面：

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
using namespace std;

// 基类：银行账户
class BankAccount {
protected:
    string accountNumber;  // 账号
    string ownerName;      // 户主姓名
    double balance;        // 余额
    
    // 受保护的辅助方法：记录交易
    void recordTransaction(const string& type, double amount) const {
        cout << "【交易记录】账号：" << accountNumber 
             << " 类型：" << type 
             << " 金额：" << fixed << setprecision(2) << amount
             << " 余额：" << balance << endl;
    }
    
public:
    BankAccount(const string& number, const string& name, double initialBalance)
        : accountNumber(number), ownerName(name), balance(initialBalance) {
        cout << "创建账户：" << accountNumber << " 户主：" << ownerName << endl;
    }
    
    virtual ~BankAccount() {
        cout << "注销账户：" << accountNumber << endl;
    }
    
    // 存款
    virtual void deposit(double amount) {
        if (amount <= 0) {
            cout << "存款金额必须大于0！" << endl;
            return;
        }
        balance += amount;
        recordTransaction("存款", amount);
    }
    
    // 取款
    virtual bool withdraw(double amount) {
        if (amount <= 0) {
            cout << "取款金额必须大于0！" << endl;
            return false;
        }
        if (amount > balance) {
            cout << "余额不足！当前余额：" << balance << endl;
            return false;
        }
        balance -= amount;
        recordTransaction("取款", amount);
        return true;
    }
    
    // 显示账户信息
    virtual void displayInfo() const {
        cout << "\n========== 账户信息 ==========" << endl;
        cout << "账号：" << accountNumber << endl;
        cout << "户主：" << ownerName << endl;
        cout << "余额：" << fixed << setprecision(2) << balance << " 元" << endl;
        cout << "================================" << endl;
    }
    
    double getBalance() const { return balance; }
    string getAccountNumber() const { return accountNumber; }
};

// 派生类：储蓄账户
class SavingsAccount : public BankAccount {
private:
    double interestRate;  // 年利率（百分比）
    int monthsSinceLastInterest;  // 距离上次计息的月数
    
public:
    SavingsAccount(const string& number, const string& name, 
                   double initialBalance, double rate)
        : BankAccount(number, name, initialBalance), 
          interestRate(rate), monthsSinceLastInterest(0) {
        cout << "创建储蓄账户，年利率：" << interestRate << "%" << endl;
    }
    
    // 计算利息
    void calculateInterest() {
        double interest = balance * interestRate / 100.0 * monthsSinceLastInterest / 12.0;
        balance += interest;
        cout << "计息" << monthsSinceLastInterest << "个月，利息：" 
             << fixed << setprecision(2) << interest << " 元，新余额：" << balance << endl;
        monthsSinceLastInterest = 0;
    }
    
    // 重写取款方法：储蓄账户可能有取款限制
    bool withdraw(double amount) override {
        cout << "【储蓄账户取款】" << endl;
        return BankAccount::withdraw(amount);  // 调用基类方法
    }
    
    void displayInfo() const override {
        BankAccount::displayInfo();
        cout << "账户类型：储蓄账户" << endl;
        cout << "年利率：" << interestRate << "%" << endl;
        cout << "================================" << endl;
    }
    
    // 模拟每月操作
    void advanceMonth() {
        monthsSinceLastInterest++;
        cout << "储蓄账户" << accountNumber << "：已过" 
             << monthsSinceLastInterest << "个月" << endl;
    }
};

// 派生类：信用账户
class CreditAccount : public BankAccount {
private:
    double creditLimit;   // 信用额度
    double usedCredit;    // 已使用额度
    
public:
    CreditAccount(const string& number, const string& name,
                  double initialBalance, double limit)
        : BankAccount(number, name, initialBalance),
          creditLimit(limit), usedCredit(0) {
        cout << "创建信用账户，信用额度：" << limit << " 元" << endl;
    }
    
    // 重写取款：信用账户可以透支
    bool withdraw(double amount) override {
        cout << "【信用账户取款】" << endl;
        if (amount <= 0) {
            cout << "取款金额必须大于0！" << endl;
            return false;
        }
        
        double availableFunds = balance + (creditLimit - usedCredit);
        if (amount > availableFunds) {
            cout << "可用额度不足！当前余额：" << balance 
                 << "，可用信用额度：" << (creditLimit - usedCredit) << endl;
            return false;
        }
        
        if (amount <= balance) {
            balance -= amount;
        } else {
            // 需要透支
            double overdraft = amount - balance;
            balance = 0;
            usedCredit += overdraft;
        }
        
        recordTransaction("取款", amount);
        return true;
    }
    
    // 还款
    void repay(double amount) {
        if (amount <= 0) {
            cout << "还款金额必须大于0！" << endl;
            return;
        }
        
        if (amount <= usedCredit) {
            usedCredit -= amount;
        } else {
            double excess = amount - usedCredit;
            usedCredit = 0;
            balance += excess;
        }
        
        recordTransaction("还款", amount);
    }
    
    void displayInfo() const override {
        BankAccount::displayInfo();
        cout << "账户类型：信用账户" << endl;
        cout << "信用额度：" << creditLimit << " 元" << endl;
        cout << "已用额度：" << usedCredit << " 元" << endl;
        cout << "可用额度：" << (creditLimit - usedCredit) << " 元" << endl;
        cout << "================================" << endl;
    }
    
    double getAvailableCredit() const {
        return creditLimit - usedCredit;
    }
};

int main() {
    cout << "========== 银行账户系统演示 ==========\n" << endl;
    
    // 创建不同账户
    SavingsAccount sa("SA-001", "张三", 10000.0, 3.5);
    CreditAccount ca("CA-001", "李四", 5000.0, 20000.0);
    
    cout << endl;
    
    // 操作储蓄账户
    cout << "--- 储蓄账户操作 ---" << endl;
    sa.deposit(5000.0);
    sa.withdraw(2000.0);
    sa.advanceMonth();
    sa.advanceMonth();
    sa.advanceMonth();
    sa.calculateInterest();
    sa.displayInfo();
    
    cout << "\n--- 信用账户操作 ---" << endl;
    ca.deposit(3000.0);
    ca.withdraw(25000.0);  // 透支
    ca.displayInfo();
    ca.repay(10000.0);
    ca.displayInfo();
    
    // 使用基类指针管理不同账户
    cout << "\n--- 使用基类指针统管账户 ---" << endl;
    vector<BankAccount*> accounts;
    accounts.push_back(&sa);
    accounts.push_back(&ca);
    
    for (auto* acc : accounts) {
        acc->displayInfo();
    }
    
    return 0;
}
```

## 十一、继承的最佳实践与常见陷阱

### 11.1 继承的设计原则

**Liskov替换原则（LSP）**：子类对象应该能够替换基类对象而不影响程序的正确性。换句话说，派生类应该扩展基类的功能，而不是改变基类原有的行为。

```cpp
#include <iostream>
using namespace std;

// 违反LSP的示例
class Rectangle {
protected:
    int width;
    int height;
    
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    
    virtual void setWidth(int w) {
        width = w;
    }
    
    virtual void setHeight(int h) {
        height = h;
    }
    
    int getWidth() const { return width; }
    int getHeight() const { return height; }
    int getArea() const { return width * height; }
};

// 正方形类：违反LSP
class Square : public Rectangle {
public:
    Square(int side) : Rectangle(side, side) {}
    
    void setWidth(int w) override {
        width = height = w;  // 同时设置宽和高
    }
    
    void setHeight(int h) override {
        width = height = h;  // 同时设置宽和高
    }
};

// 测试函数：对Rectangle有效，但对Square会产生意外行为
void testRectangle(Rectangle& r) {
    r.setWidth(5);
    r.setHeight(10);
    cout << "期望面积: 50, 实际面积: " << r.getArea() << endl;
    // 对于Square，面积会是100而不是50！
}

int main() {
    Rectangle rect(3, 4);
    Square square(5);
    
    cout << "测试Rectangle：" << endl;
    testRectangle(rect);  // 输出50，正确
    
    cout << "测试Square：" << endl;
    testRectangle(square);  // 输出100，但期望是50，违反了LSP
    
    return 0;
}
```

### 11.2 组合优于继承

在很多情况下，组合（Composition）比继承更合适。如果一个类需要使用另一个类的功能，但不满足"is-a"关系，应该使用组合而不是继承：

```cpp
#include <iostream>
#include <string>
using namespace std;

// 引擎类
class Engine {
private:
    int horsepower;
    string type;
    
public:
    Engine(int hp, const string& t) : horsepower(hp), type(t) {}
    
    void start() {
        cout << type << "引擎启动，马力：" << horsepower << endl;
    }
    
    void stop() {
        cout << type << "引擎停止" << endl;
    }
};

// 轮胎类
class Tire {
private:
    int size;
    string brand;
    
public:
    Tire(int s, const string& b) : size(s), brand(b) {}
    
    void rotate() {
        cout << brand << "轮胎（尺寸：" << size << "寸）转动" << endl;
    }
};

// 汽车类：使用组合而非继承
// 汽车不是引擎，也不是轮胎，而是"拥有"引擎和轮胎
class Car {
private:
    string model;
    Engine engine;    // 组合：Car拥有Engine
    Tire tires[4];    // 组合：Car拥有4个Tire
    
public:
    Car(const string& m, int hp, const string& engineType, int tireSize, const string& tireBrand)
        : model(m), engine(hp, engineType),
          tires{{tireSize, tireBrand}, {tireSize, tireBrand}, 
                {tireSize, tireBrand}, {tireSize, tireBrand}} {}
    
    void startCar() {
        cout << "启动" << model << "：" << endl;
        engine.start();
        for (auto& tire : tires) {
            tire.rotate();
        }
    }
    
    void stopCar() {
        engine.stop();
    }
};

int main() {
    Car myCar("特斯拉Model 3", 450, "电动", 18, "米其林");
    myCar.startCar();
    myCar.stopCar();
    
    return 0;
}
```

### 11.3 继承中的常见陷阱

**陷阱1：忘记虚析构函数**

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    // 非虚析构函数——危险！
    ~Base() {
        cout << "Base析构" << endl;
    }
};

class Derived : public Base {
private:
    int* data;
    
public:
    Derived() {
        data = new int[100];
        cout << "Derived构造，分配了100个int" << endl;
    }
    
    // 这个析构函数永远不会被调用！
    ~Derived() {
        delete[] data;
        cout << "Derived析构，释放了内存" << endl;
    }
};

int main() {
    Base* ptr = new Derived();
    delete ptr;  // 只调用了Base的析构，Derived的析构未被调用
    // 导致内存泄漏！Derived中分配的100个int永远不会被释放
    
    return 0;
}
```

**陷阱2：在构造函数或析构函数中调用虚函数**

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() {
        // 危险！构造函数中调用虚函数
        virtualMethod();
    }
    
    virtual void virtualMethod() {
        cout << "Base::virtualMethod()" << endl;
    }
    
    virtual ~Base() {
        // 危险！析构函数中调用虚函数
        virtualMethod();
    }
};

class Derived : public Base {
public:
    Derived() {
        virtualMethod();
    }
    
    void virtualMethod() override {
        cout << "Derived::virtualMethod()" << endl;
    }
};

int main() {
    Derived d;
    // 输出：
    // Base::virtualMethod()  <- 构造Base时，调用了Base的版本，不是Derived的！
    // Derived::virtualMethod() <- 构造Derived时，调用了Derived的版本
    
    return 0;
    // 析构时：
    // Derived::virtualMethod() <- 析构Derived时，调用了Derived的版本
    // Base::virtualMethod()    <- 析构Base时，调用了Base的版本，不是Derived的！
}
```

## 十二、总结

继承是C++面向对象编程的核心机制之一，它提供了代码复用和层次化组织的能力。本文详细介绍了C++继承的各个方面：

### 核心知识点回顾

1. **继承语法**：`class Derived : public/protected/private Base { ... }`，这是C++继承的基本语法形式。

2. **三种继承方式**：
   - `public`继承：保持基类成员的访问权限不变，是最常用的继承方式
   - `protected`继承：使基类的public成员变为protected
   - `private`继承：使基类的所有public和protected成员变为private

3. **构造与析构顺序**：构造时先基类后派生类，析构时先派生类后基类。这一顺序保证了对象的正确初始化与清理。

4. **同名成员处理**：派生类的同名成员会隐藏基类的同名成员，可以使用作用域解析运算符`::`或`using`声明来解决。

5. **菱形继承问题**：多重继承路径导致数据冗余和二义性，这是C++继承模型中最复杂的问题之一。

6. **类型转换**：向上转型是安全的隐式转换，向下转型需要使用`dynamic_cast`进行安全检查。

7. **对象切片**：将派生类对象赋值给基类对象时，派生类特有的成员会被丢弃。

### 最佳实践建议

- 优先使用`public`继承，它表示明确的"is-a"关系
- 当"is-a"关系不成立时，优先考虑组合而非继承
- 基类应该声明虚析构函数
- 派生类应该尊重基类的接口约定，遵循Liskov替换原则
- 合理使用`using`声明来调整访问权限
- 避免过深的继承层次，通常不超过3-4层
- 在构造函数和析构函数中不要调用虚函数

继承是通向多态的桥梁。在掌握了继承的基础知识之后，下一篇文章将深入探讨多继承与虚继承，以及如何利用虚继承解决菱形继承问题。理解继承是成为C++高手的关键一步，它不仅是语法层面的知识，更是一种设计思想——通过层次化地组织类，我们能够构建出更加模块化、可扩展和可维护的软件系统。
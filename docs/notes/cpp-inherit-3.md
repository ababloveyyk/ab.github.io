---
title: C++继承与多态Ⅲ——多态基础
date: 2026-07-26
tags:
  - C++
  - 继承
  - 多态
  - 虚函数
categories:
  - C++
---

## 一、多态概述

多态（Polymorphism）是面向对象编程的三大特性之一，也是继封装和继承之后最核心的概念。在C++中，多态允许我们通过基类的指针或引用来调用派生类中重写的方法，从而实现"一个接口，多种实现"的编程理念。

### 1.1 多态的概念与分类

多态从字面意思理解就是"多种形态"。在C++中，多态可以分为两大类：

**静态多态（编译时多态）**：
- 函数重载：同一个函数名，不同参数列表
- 运算符重载：自定义运算符的行为
- 模板：通过模板参数在编译时生成不同的代码

**动态多态（运行时多态）**：
- 虚函数机制：通过虚函数表（vtable）在运行时确定调用哪个函数
- 这是本文的重点

### 1.2 为什么需要多态

考虑一个没有多态的场景：

```cpp
#include <iostream>
using namespace std;

class Dog {
public:
    void makeSound() const {
        cout << "汪汪！" << endl;
    }
};

class Cat {
public:
    void makeSound() const {
        cout << "喵喵！" << endl;
    }
};

class Duck {
public:
    void makeSound() const {
        cout << "嘎嘎！" << endl;
    }
};

// 没有多态，需要为每种动物分别编写处理函数
void makeDogSound(const Dog& dog) {
    dog.makeSound();
}

void makeCatSound(const Cat& cat) {
    cat.makeSound();
}

void makeDuckSound(const Duck& duck) {
    duck.makeSound();
}

int main() {
    Dog dog;
    Cat cat;
    Duck duck;
    
    makeDogSound(dog);
    makeCatSound(cat);
    makeDuckSound(duck);
    
    return 0;
}
```

这个例子展示了没有多态时的困境：每增加一种动物，就需要添加一个新的处理函数。如果有一百种动物，就需要一百个函数。多态正是为了解决这个问题：

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 基类
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

class Duck : public Animal {
public:
    void makeSound() const override {
        cout << "嘎嘎！" << endl;
    }
};

// 一个函数处理所有动物
void makeAnimalSound(const Animal& animal) {
    animal.makeSound();  // 运行时决定调用哪个类的makeSound
}

int main() {
    Dog dog;
    Cat cat;
    Duck duck;
    
    makeAnimalSound(dog);   // 汪汪！
    makeAnimalSound(cat);   // 喵喵！
    makeAnimalSound(duck);  // 嘎嘎！
    
    // 甚至可以统一管理
    vector<Animal*> animals;
    animals.push_back(&dog);
    animals.push_back(&cat);
    animals.push_back(&duck);
    
    cout << "\n所有动物一起叫：" << endl;
    for (const auto* animal : animals) {
        animal->makeSound();
    }
    
    return 0;
}
```

## 二、虚函数（Virtual Function）

### 2.1 虚函数的基本语法

虚函数是使用`virtual`关键字声明的成员函数。当通过基类指针或引用调用虚函数时，实际调用的是指针或引用所指向对象的真实类型中定义的版本：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    // 普通函数
    void nonVirtualFunc() {
        cout << "Base::nonVirtualFunc()" << endl;
    }
    
    // 虚函数
    virtual void virtualFunc() {
        cout << "Base::virtualFunc()" << endl;
    }
    
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    // 隐藏基类的nonVirtualFunc（不是重写）
    void nonVirtualFunc() {
        cout << "Derived::nonVirtualFunc()" << endl;
    }
    
    // 重写基类的virtualFunc
    void virtualFunc() override {
        cout << "Derived::virtualFunc()" << endl;
    }
};

int main() {
    Derived derived;
    Base* basePtr = &derived;
    Base& baseRef = derived;
    
    cout << "===== 通过指针调用 =====" << endl;
    
    // 非虚函数：根据指针的静态类型决定调用
    basePtr->nonVirtualFunc();  // 输出：Base::nonVirtualFunc()
    
    // 虚函数：根据指针指向的实际对象类型决定调用
    basePtr->virtualFunc();     // 输出：Derived::virtualFunc()
    
    cout << "\n===== 通过引用调用 =====" << endl;
    
    baseRef.nonVirtualFunc();   // 输出：Base::nonVirtualFunc()
    baseRef.virtualFunc();      // 输出：Derived::virtualFunc()
    
    cout << "\n===== 通过对象调用（不表现为多态） =====" << endl;
    
    Base baseObj = derived;  // 对象切片
    baseObj.virtualFunc();   // 输出：Base::virtualFunc()（切片后只是Base对象）
    
    return 0;
}
```

### 2.2 虚函数的工作条件

虚函数的动态绑定（运行时多态）只在以下条件下生效：

1. 通过基类指针或基类引用调用虚函数
2. 被调用的函数必须是虚函数（在基类中声明为virtual）
3. 派生类必须重写（override）该虚函数

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void func1() { cout << "Base::func1" << endl; }
    virtual void func2() { cout << "Base::func2" << endl; }
    void func3() { cout << "Base::func3" << endl; }
};

class Derived : public Base {
public:
    void func1() override { cout << "Derived::func1" << endl; }
    // func2没有重写，继承Base的版本
    void func3() { cout << "Derived::func3" << endl; }
};

// 按值传递：没有多态
void byValue(Base b) {
    b.func1();  // 总是Base::func1
    b.func2();  // 总是Base::func2
    b.func3();  // 总是Base::func3
}

// 按引用传递：有多态
void byReference(const Base& b) {
    b.func1();  // 多态：根据实际类型决定
    b.func2();  // 多态：Derived没有重写，所以调用Base::func2
    b.func3();  // 非虚函数：总是Base::func3
}

// 按指针传递：有多态
void byPointer(Base* b) {
    b->func1();  // 多态
    b->func2();  // 多态（但Derived没重写）
    b->func3();  // 非虚函数：静态绑定
}

int main() {
    Derived d;
    
    cout << "===== 按值传递 =====" << endl;
    byValue(d);
    
    cout << "\n===== 按引用传递 =====" << endl;
    byReference(d);
    
    cout << "\n===== 按指针传递 =====" << endl;
    byPointer(&d);
    
    return 0;
}
```

## 三、虚函数表（vtable）与虚函数表指针（vptr）

### 3.1 虚函数表的概念

虚函数的实现依赖于编译器生成的虚函数表（vtable, Virtual Table）。每个包含虚函数的类（或从包含虚函数的类派生的类）都有一个虚函数表。虚函数表中存储了该类所有虚函数的地址。

每个包含虚函数的类的对象中，都包含一个隐藏的指针——虚函数表指针（vptr, Virtual Pointer），指向该类的虚函数表。

### 3.2 vtable的内存布局分析

```cpp
#include <iostream>
#include <cstdint>
using namespace std;

class Base {
public:
    int baseData;
    
    Base() : baseData(0xBBBBBBBB) {}
    
    virtual void func1() {
        cout << "Base::func1()" << endl;
    }
    
    virtual void func2() {
        cout << "Base::func2()" << endl;
    }
    
    virtual void func3() {
        cout << "Base::func3()" << endl;
    }
};

class Derived : public Base {
public:
    int derivedData;
    
    Derived() : derivedData(0xDDDDDDDD) {}
    
    void func1() override {
        cout << "Derived::func1()" << endl;
    }
    
    void func2() override {
        cout << "Derived::func2()" << endl;
    }
    
    // func3没有重写，继承Base的版本
};

int main() {
    Base base;
    Derived derived;
    
    cout << "===== 对象大小分析 =====" << endl;
    cout << "sizeof(Base) = " << sizeof(Base) << " 字节" << endl;
    // 预期：vptr(8字节, 64位) + int(4字节) + 对齐(4字节) = 16字节
    
    cout << "sizeof(Derived) = " << sizeof(Derived) << " 字节" << endl;
    // 预期：vptr(8字节) + int(4字节) + 对齐(4字节) + int(4字节) + 对齐(4字节) = 24字节
    
    cout << "\n===== 地址分析 =====" << endl;
    cout << "Base对象地址：" << &base << endl;
    cout << "base.baseData地址：" << &base.baseData << endl;
    cout << "Derived对象地址：" << &derived << endl;
    cout << "derived.baseData地址：" << &derived.baseData << endl;
    cout << "derived.derivedData地址：" << &derived.derivedData << endl;
    
    // 通过函数指针调用虚函数来验证vtable
    cout << "\n===== 通过函数指针验证vtable =====" << endl;
    
    // 获取vptr（对象的前8个字节，64位系统）
    using FuncPtr = void(*)();
    
    // 对于Base对象
    void** baseVptr = *(void***)&base;  // 获取vptr指向的vtable
    cout << "Base的vtable地址：" << baseVptr << endl;
    
    Base* basePtr = &base;
    basePtr->func1();  // 正常调用
    
    // 对于Derived对象
    Derived* derivedPtr = &derived;
    derivedPtr->func1();  // 正常调用
    
    cout << "\n注意：Derived的vtable中：\n";
    cout << "  func1 -> Derived::func1()\n";
    cout << "  func2 -> Derived::func2()\n";
    cout << "  func3 -> Base::func3()（未重写，保持基类版本）\n";
    
    return 0;
}
```

### 3.3 深入理解vtable的构建过程

```cpp
#include <iostream>
#include <string>
using namespace std;

class A {
public:
    int a_val;
    A() : a_val(0xAAAAAAAA) {}
    
    virtual void fa1() { cout << "A::fa1()" << endl; }
    virtual void fa2() { cout << "A::fa2()" << endl; }
};

class B : public A {
public:
    int b_val;
    B() : b_val(0xBBBBBBBB) {}
    
    void fa1() override { cout << "B::fa1()" << endl; }
    virtual void fb1() { cout << "B::fb1()" << endl; }
};

class C : public B {
public:
    int c_val;
    C() : c_val(0xCCCCCCCC) {}
    
    void fa2() override { cout << "C::fa2()" << endl; }
    void fb1() override { cout << "C::fb1()" << endl; }
    virtual void fc1() { cout << "C::fc1()" << endl; }
};

int main() {
    A a;
    B b;
    C c;
    
    cout << "===== 对象大小 =====" << endl;
    cout << "sizeof(A) = " << sizeof(A) << " 字节" << endl;
    cout << "sizeof(B) = " << sizeof(B) << " 字节" << endl;
    cout << "sizeof(C) = " << sizeof(C) << " 字节" << endl;
    
    cout << "\n===== 虚函数调用测试 =====" << endl;
    
    // 通过A*调用
    A* aPtr = &a;
    aPtr->fa1();  // A::fa1()
    aPtr->fa2();  // A::fa2()
    
    aPtr = &b;
    aPtr->fa1();  // B::fa1()  <- 多态
    aPtr->fa2();  // A::fa2()  <- B没有重写fa2
    
    aPtr = &c;
    aPtr->fa1();  // B::fa1()  <- C没有重写fa1
    aPtr->fa2();  // C::fa2()  <- C重写了fa2
    
    // 通过B*调用
    B* bPtr = &b;
    bPtr->fa1();  // B::fa1()
    bPtr->fa2();  // A::fa2()
    bPtr->fb1();  // B::fb1()
    
    bPtr = &c;
    bPtr->fa1();  // B::fa1()
    bPtr->fa2();  // C::fa2()
    bPtr->fb1();  // C::fb1()  <- 多态
    
    cout << "\n===== vtable内容分析 =====" << endl;
    cout << "A的vtable: [&A::fa1, &A::fa2]" << endl;
    cout << "B的vtable: [&B::fa1, &A::fa2, &B::fb1]" << endl;
    cout << "C的vtable: [&B::fa1, &C::fa2, &C::fb1, &C::fc1]" << endl;
    
    return 0;
}
```

### 3.4 手工模拟vtable调用

为了更深入地理解vtable机制，我们可以手工模拟虚函数调用：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

// 手工模拟虚函数机制
class ManualVirtual {
public:
    // 模拟vtable：函数指针数组
    static void (*vtable[2])();
    
    // 模拟vptr
    void (**vptr)();
    
    ManualVirtual() {
        vptr = vtable;  // 设置vptr指向vtable
    }
    
    // 模拟虚函数调用
    void callFunc0() {
        (*vptr[0])();  // 通过vtable调用
    }
    
    void callFunc1() {
        (*vptr[1])();  // 通过vtable调用
    }
};

// 基类的vtable
void BaseFunc0() { cout << "Base::func0()" << endl; }
void BaseFunc1() { cout << "Base::func1()" << endl; }
void (*ManualVirtual::vtable[2])() = {BaseFunc0, BaseFunc1};

// 真实C++的等价代码
class RealBase {
public:
    virtual void func0() { cout << "RealBase::func0()" << endl; }
    virtual void func1() { cout << "RealBase::func1()" << endl; }
};

class RealDerived : public RealBase {
public:
    void func0() override { cout << "RealDerived::func0()" << endl; }
    void func1() override { cout << "RealDerived::func1()" << endl; }
};

int main() {
    cout << "===== 手工模拟虚函数调用 =====" << endl;
    ManualVirtual mv;
    mv.callFunc0();  // BaseFunc0
    mv.callFunc1();  // BaseFunc1
    
    cout << "\n===== 真实C++虚函数调用 =====" << endl;
    RealBase* ptr = new RealDerived();
    ptr->func0();  // RealDerived::func0()
    ptr->func1();  // RealDerived::func1()
    delete ptr;
    
    cout << "\n两者的原理是一样的：通过函数指针表间接调用，\n";
    cout << "在运行时根据实际对象的类型找到正确的函数地址。\n";
    
    return 0;
}
```

## 四、多态的实现原理

### 4.1 多态的底层调用过程

当通过基类指针调用虚函数时，底层发生了以下步骤：

1. 从对象中获取vptr（虚函数表指针）
2. 通过vptr找到vtable（虚函数表）
3. 在vtable中查找对应虚函数的地址
4. 调用该地址处的函数

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

class Base {
public:
    int base_data;
    Base() : base_data(100) {}
    
    virtual void func1() {
        cout << "Base::func1() this=" << this << endl;
    }
    
    virtual void func2() {
        cout << "Base::func2() this=" << this << endl;
    }
};

class Derived : public Base {
public:
    int derived_data;
    Derived() : derived_data(200) {}
    
    void func1() override {
        cout << "Derived::func1() this=" << this << endl;
        cout << "  base_data = " << base_data << endl;
        cout << "  derived_data = " << derived_data << endl;
    }
    
    void func2() override {
        cout << "Derived::func2() this=" << this << endl;
    }
};

int main() {
    Derived d;
    Base* ptr = &d;
    
    cout << "对象地址：" << &d << endl;
    cout << "基类指针值：" << ptr << endl;
    cout << "它们是同一个地址（编译器自动调整）" << endl;
    
    cout << "\n调用虚函数：" << endl;
    ptr->func1();
    ptr->func2();
    
    cout << "\n多态的本质：\n";
    cout << "1. 每个对象有一个vptr，指向所属类的vtable\n";
    cout << "2. 调用虚函数时，通过vptr->vtable->函数地址的方式间接调用\n";
    cout << "3. 不同类的对象有不同的vtable，所以同一调用表达式可以调用不同函数\n";
    
    return 0;
}
```

### 4.2 多继承下的vtable

多继承会使vtable变得更加复杂：

```cpp
#include <iostream>
using namespace std;

class Base1 {
public:
    int b1_data;
    Base1() : b1_data(0x1111) {}
    
    virtual void f1() { cout << "Base1::f1()" << endl; }
    virtual void f2() { cout << "Base1::f2()" << endl; }
};

class Base2 {
public:
    int b2_data;
    Base2() : b2_data(0x2222) {}
    
    virtual void g1() { cout << "Base2::g1()" << endl; }
    virtual void g2() { cout << "Base2::g2()" << endl; }
};

class Derived : public Base1, public Base2 {
public:
    int d_data;
    Derived() : d_data(0x3333) {}
    
    void f1() override { cout << "Derived::f1()" << endl; }
    void g1() override { cout << "Derived::g1()" << endl; }
    
    virtual void h1() { cout << "Derived::h1()" << endl; }
};

int main() {
    Derived d;
    
    cout << "===== 对象大小 =====" << endl;
    cout << "sizeof(Derived) = " << sizeof(Derived) << " 字节" << endl;
    // 预期：两个vptr + 三个int + 对齐
    
    cout << "\n===== 地址分析 =====" << endl;
    cout << "Derived对象地址：" << &d << endl;
    
    Base1* b1Ptr = &d;
    Base2* b2Ptr = &d;
    
    cout << "Base1*指针值：" << static_cast<void*>(b1Ptr) << endl;
    cout << "Base2*指针值：" << static_cast<void*>(b2Ptr) << endl;
    cout << "注意：Base1*和Derived*指向同一地址，但Base2*偏移了" << endl;
    
    cout << "\n===== 虚函数调用 =====" << endl;
    b1Ptr->f1();  // Derived::f1()
    b1Ptr->f2();  // Base1::f2()（Derived没有重写）
    
    b2Ptr->g1();  // Derived::g1()
    b2Ptr->g2();  // Base2::g2()（Derived没有重写）
    
    cout << "\n多继承中，Derived对象包含两个vptr：\n";
    cout << "  - 一个用于Base1子对象（包含f1, f2, h1）\n";
    cout << "  - 一个用于Base2子对象（包含g1, g2）\n";
    cout << "当Derived*转换为Base2*时，指针值会调整到Base2子对象的位置\n";
    
    return 0;
}
```

## 五、重写（Override）与重载（Overload）的区别

### 5.1 概念对比

这是C++中容易混淆的三个概念：

| 概念 | 英文 | 发生范围 | 条件 |
|------|------|---------|------|
| 重载 | Overload | 同一作用域 | 函数名相同，参数不同 |
| 重写 | Override | 基类与派生类之间 | 函数签名相同，基类函数为virtual |
| 隐藏 | Hide | 基类与派生类之间 | 函数名相同，但不满足重写条件 |

### 5.2 重载（Overload）

```cpp
#include <iostream>
using namespace std;

class Calculator {
public:
    // 重载：同一类中，函数名相同，参数不同
    int add(int a, int b) {
        cout << "add(int, int)" << endl;
        return a + b;
    }
    
    double add(double a, double b) {
        cout << "add(double, double)" << endl;
        return a + b;
    }
    
    int add(int a, int b, int c) {
        cout << "add(int, int, int)" << endl;
        return a + b + c;
    }
    
    string add(const string& a, const string& b) {
        cout << "add(string, string)" << endl;
        return a + b;
    }
};

int main() {
    Calculator calc;
    
    cout << calc.add(10, 20) << endl;           // 调用add(int, int)
    cout << calc.add(3.14, 2.71) << endl;       // 调用add(double, double)
    cout << calc.add(1, 2, 3) << endl;          // 调用add(int, int, int)
    cout << calc.add("Hello, ", "World!") << endl;  // 调用add(string, string)
    
    return 0;
}
```

### 5.3 重写（Override）

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    // 基类中声明为virtual
    virtual void makeSound() const {
        cout << "动物发出声音" << endl;
    }
    
    virtual void move() const {
        cout << "动物在移动" << endl;
    }
    
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    // 重写：函数签名与基类虚函数完全相同
    void makeSound() const override {
        cout << "汪汪！" << endl;
    }
    
    void move() const override {
        cout << "狗在跑" << endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() const override {
        cout << "喵喵！" << endl;
    }
    
    void move() const override {
        cout << "猫在跳" << endl;
    }
};

// 多态函数
void interactWith(const Animal& animal) {
    animal.makeSound();
    animal.move();
}

int main() {
    Dog dog;
    Cat cat;
    
    cout << "===== 与狗互动 =====" << endl;
    interactWith(dog);
    
    cout << "\n===== 与猫互动 =====" << endl;
    interactWith(cat);
    
    return 0;
}
```

### 5.4 重载、重写、隐藏的综合对比

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    // 重载：同一作用域内的同名函数
    void display() {
        cout << "Base::display()" << endl;
    }
    
    void display(int x) {
        cout << "Base::display(int) x = " << x << endl;
    }
    
    // 虚函数
    virtual void show() {
        cout << "Base::show()" << endl;
    }
    
    virtual void print() {
        cout << "Base::print()" << endl;
    }
};

class Derived : public Base {
public:
    // 隐藏：隐藏了Base中所有名为display的函数
    void display(const string& s) {
        cout << "Derived::display(string) s = " << s << endl;
    }
    
    // 重写：override了Base的虚函数show
    void show() override {
        cout << "Derived::show()" << endl;
    }
    
    // 没有重写print，这是一个新的非虚函数
    void print(int x) {
        cout << "Derived::print(int) x = " << x << endl;
    }
};

int main() {
    Derived d;
    Base* ptr = &d;
    
    cout << "===== 通过派生类对象调用 =====" << endl;
    d.display("hello");  // 调用Derived::display(string)
    // d.display();       // 错误！Base::display()被隐藏了
    // d.display(10);     // 错误！Base::display(int)也被隐藏了
    d.Base::display();   // 需要通过作用域解析调用
    
    d.show();            // 调用Derived::show()
    d.print(42);         // 调用Derived::print(int)
    // d.print();         // 错误！Base::print()被隐藏了
    
    cout << "\n===== 通过基类指针调用 =====" << endl;
    ptr->display();      // 调用Base::display()（非虚函数，静态绑定）
    ptr->display(10);    // 调用Base::display(int)（非虚函数，静态绑定）
    
    ptr->show();         // 调用Derived::show()（虚函数，动态绑定）
    ptr->print();        // 调用Base::print()（虚函数，但Derived的print(int)不是重写）
    
    return 0;
}
```

## 六、虚函数的高级话题

### 6.1 构造函数不能是虚函数

构造函数不能声明为虚函数，因为在构造对象时，对象的vptr还没有被正确设置：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    // virtual Base() {}  // 错误！构造函数不能是虚函数
    
    Base() {
        cout << "Base构造" << endl;
        // 在构造函数中调用虚函数
        virtualMethod();  // 危险！调用的是Base的版本
    }
    
    virtual void virtualMethod() {
        cout << "Base::virtualMethod()" << endl;
    }
    
    virtual ~Base() {
        cout << "Base析构" << endl;
    }
};

class Derived : public Base {
public:
    Derived() {
        cout << "Derived构造" << endl;
    }
    
    void virtualMethod() override {
        cout << "Derived::virtualMethod()" << endl;
    }
    
    ~Derived() {
        cout << "Derived析构" << endl;
    }
};

int main() {
    Derived d;
    // 输出：
    // Base构造
    // Base::virtualMethod()  <- 注意！在Base构造期间，vptr指向Base的vtable
    // Derived构造
    
    return 0;
}
```

### 6.2 析构函数应该是虚函数

当基类指针指向派生类对象并被delete时，如果基类的析构函数不是虚函数，则只会调用基类的析构函数，导致派生类部分无法正确清理：

```cpp
#include <iostream>
using namespace std;

// 危险的基类：非虚析构函数
class DangerousBase {
public:
    DangerousBase() {
        cout << "DangerousBase构造" << endl;
    }
    
    // 非虚析构函数——危险！
    ~DangerousBase() {
        cout << "DangerousBase析构" << endl;
    }
};

class DangerousDerived : public DangerousBase {
private:
    int* resource;
    
public:
    DangerousDerived() {
        resource = new int[1000];
        cout << "DangerousDerived构造，分配了资源" << endl;
    }
    
    ~DangerousDerived() {
        delete[] resource;
        cout << "DangerousDerived析构，释放了资源" << endl;
    }
};

// 安全的基类：虚析构函数
class SafeBase {
public:
    SafeBase() {
        cout << "SafeBase构造" << endl;
    }
    
    virtual ~SafeBase() {
        cout << "SafeBase析构" << endl;
    }
};

class SafeDerived : public SafeBase {
private:
    int* resource;
    
public:
    SafeDerived() {
        resource = new int[1000];
        cout << "SafeDerived构造，分配了资源" << endl;
    }
    
    ~SafeDerived() {
        delete[] resource;
        cout << "SafeDerived析构，释放了资源" << endl;
    }
};

int main() {
    cout << "===== 危险示例：非虚析构函数 =====" << endl;
    cout << "（将导致内存泄漏）" << endl;
    DangerousBase* db = new DangerousDerived();
    delete db;  // 只调用了DangerousBase::~DangerousBase()
    // DangerousDerived::~DangerousDerived()没有被调用！
    // resource的内存泄漏了！
    
    cout << "\n===== 安全示例：虚析构函数 =====" << endl;
    SafeBase* sb = new SafeDerived();
    delete sb;  // 先调用SafeDerived::~SafeDerived()，再调用SafeBase::~SafeBase()
    // 资源被正确释放
    
    return 0;
}
```

### 6.3 虚函数与默认参数

虚函数的默认参数是静态绑定的，即默认参数值取决于指针或引用的静态类型，而不是动态类型：

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void func(int x = 10) {
        cout << "Base::func(int) x = " << x << endl;
    }
};

class Derived : public Base {
public:
    // 注意：这里指定了不同的默认参数值
    void func(int x = 20) override {
        cout << "Derived::func(int) x = " << x << endl;
    }
};

int main() {
    Derived d;
    Base* ptr = &d;
    Base& ref = d;
    
    cout << "===== 通过派生类对象调用 =====" << endl;
    d.func();     // 调用Derived::func(20)，使用Derived的默认参数
    d.func(30);   // 调用Derived::func(30)
    
    cout << "\n===== 通过基类指针调用 =====" << endl;
    ptr->func();  // 调用Derived::func(10)！！！
    // 函数体是Derived的，但默认参数是Base的！
    ptr->func(30); // 调用Derived::func(30)
    
    cout << "\n===== 通过基类引用调用 =====" << endl;
    ref.func();   // 同样的问题：调用Derived::func(10)
    ref.func(30); // 调用Derived::func(30)
    
    cout << "\n结论：虚函数的默认参数是静态绑定的，\n";
    cout << "建议不要在虚函数中使用默认参数，或者确保基类和派生类的默认参数一致。\n";
    
    return 0;
}
```

### 6.4 协变返回类型（Covariant Return Type）

C++允许派生类重写虚函数时返回类型是基类返回类型的派生类指针或引用：

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    virtual ~Animal() = default;
    virtual void identify() const = 0;
};

class Dog : public Animal {
public:
    void identify() const override {
        cout << "我是一只狗" << endl;
    }
};

class Cat : public Animal {
public:
    void identify() const override {
        cout << "我是一只猫" << endl;
    }
};

// 基类：动物工厂
class AnimalFactory {
public:
    // 返回Animal*
    virtual Animal* createAnimal() {
        cout << "AnimalFactory::createAnimal()" << endl;
        return new Animal();
    }
    
    virtual ~AnimalFactory() = default;
};

// 狗工厂
class DogFactory : public AnimalFactory {
public:
    // 协变返回类型：返回Dog*（派生类指针）
    Dog* createAnimal() override {
        cout << "DogFactory::createAnimal()" << endl;
        return new Dog();
    }
};

// 猫工厂
class CatFactory : public AnimalFactory {
public:
    Cat* createAnimal() override {
        cout << "CatFactory::createAnimal()" << endl;
        return new Cat();
    }
};

int main() {
    DogFactory dogFactory;
    CatFactory catFactory;
    
    AnimalFactory* factory;
    
    // 使用DogFactory
    factory = &dogFactory;
    Animal* pet1 = factory->createAnimal();
    pet1->identify();  // 我是一只狗
    delete pet1;
    
    // 使用CatFactory
    factory = &catFactory;
    Animal* pet2 = factory->createAnimal();
    pet2->identify();  // 我是一只猫
    delete pet2;
    
    // 直接使用DogFactory，可以利用协变返回类型
    DogFactory* dogFact = &dogFactory;
    Dog* dog = dogFact->createAnimal();  // 返回Dog*，不需要向下转型
    dog->identify();
    delete dog;
    
    return 0;
}
```

## 七、多态的应用场景

### 7.1 策略模式（Strategy Pattern）

策略模式使用多态来封装可互换的算法：

```cpp
#include <iostream>
#include <vector>
#include <memory>
using namespace std;

// 排序策略接口
class SortStrategy {
public:
    virtual void sort(vector<int>& data) const = 0;
    virtual string getName() const = 0;
    virtual ~SortStrategy() = default;
};

// 冒泡排序策略
class BubbleSort : public SortStrategy {
public:
    void sort(vector<int>& data) const override {
        int n = data.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (data[j] > data[j + 1]) {
                    swap(data[j], data[j + 1]);
                }
            }
        }
    }
    
    string getName() const override { return "冒泡排序"; }
};

// 快速排序策略
class QuickSort : public SortStrategy {
private:
    void quickSort(vector<int>& data, int low, int high) const {
        if (low < high) {
            int pivot = partition(data, low, high);
            quickSort(data, low, pivot - 1);
            quickSort(data, pivot + 1, high);
        }
    }
    
    int partition(vector<int>& data, int low, int high) const {
        int pivot = data[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (data[j] < pivot) {
                i++;
                swap(data[i], data[j]);
            }
        }
        swap(data[i + 1], data[high]);
        return i + 1;
    }
    
public:
    void sort(vector<int>& data) const override {
        quickSort(data, 0, data.size() - 1);
    }
    
    string getName() const override { return "快速排序"; }
};

// 上下文类：使用排序策略
class Sorter {
private:
    unique_ptr<SortStrategy> strategy;
    
public:
    void setStrategy(unique_ptr<SortStrategy> s) {
        strategy = move(s);
    }
    
    void sort(vector<int>& data) {
        if (strategy) {
            cout << "使用" << strategy->getName() << "：" << endl;
            strategy->sort(data);
        }
    }
};

int main() {
    vector<int> data1 = {64, 34, 25, 12, 22, 11, 90};
    vector<int> data2 = data1;  // 副本
    
    Sorter sorter;
    
    // 使用冒泡排序
    sorter.setStrategy(make_unique<BubbleSort>());
    sorter.sort(data1);
    for (int x : data1) cout << x << " ";
    cout << endl;
    
    // 使用快速排序
    sorter.setStrategy(make_unique<QuickSort>());
    sorter.sort(data2);
    for (int x : data2) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 7.2 模板方法模式（Template Method Pattern）

模板方法模式在基类中定义算法的骨架，将某些步骤延迟到派生类中实现：

```cpp
#include <iostream>
#include <string>
using namespace std;

// 数据处理器基类
class DataProcessor {
public:
    virtual ~DataProcessor() = default;
    
    // 模板方法：定义处理流程的骨架
    void process() {
        loadData();
        validateData();
        transformData();
        saveData();
        reportResult();
    }
    
protected:
    virtual void loadData() = 0;
    virtual void validateData() = 0;
    virtual void transformData() = 0;
    virtual void saveData() = 0;
    
    // 钩子方法：提供默认实现，派生类可选重写
    virtual void reportResult() {
        cout << "数据处理完成（默认报告）" << endl;
    }
};

// CSV数据处理器
class CsvProcessor : public DataProcessor {
private:
    string csvData;
    string processedData;
    
protected:
    void loadData() override {
        csvData = "name,age,city\nAlice,30,NYC\nBob,25,LA";
        cout << "加载CSV数据：" << csvData << endl;
    }
    
    void validateData() override {
        cout << "验证CSV格式..." << endl;
        // 简化的验证逻辑
        if (csvData.find(',') != string::npos) {
            cout << "CSV格式验证通过" << endl;
        }
    }
    
    void transformData() override {
        cout << "转换CSV数据..." << endl;
        // 简化的转换：将CSV转为JSON格式
        processedData = "{\"records\": [{\"name\":\"Alice\",\"age\":30,\"city\":\"NYC\"}]}";
    }
    
    void saveData() override {
        cout << "保存处理后数据：" << processedData << endl;
    }
    
    void reportResult() override {
        cout << "CSV处理完成，共处理1条记录" << endl;
    }
};

// XML数据处理器
class XmlProcessor : public DataProcessor {
private:
    string xmlData;
    string processedData;
    
protected:
    void loadData() override {
        xmlData = "<users><user><name>Tom</name><age>28</age></user></users>";
        cout << "加载XML数据：" << xmlData << endl;
    }
    
    void validateData() override {
        cout << "验证XML格式..." << endl;
        if (xmlData.find('<') != string::npos && xmlData.find('>') != string::npos) {
            cout << "XML格式验证通过" << endl;
        }
    }
    
    void transformData() override {
        cout << "转换XML数据..." << endl;
        processedData = "{\"users\": [{\"name\":\"Tom\",\"age\":28}]}";
    }
    
    void saveData() override {
        cout << "保存处理后数据：" << processedData << endl;
    }
};

int main() {
    cout << "===== CSV数据处理 =====" << endl;
    CsvProcessor csvProc;
    csvProc.process();
    
    cout << "\n===== XML数据处理 =====" << endl;
    XmlProcessor xmlProc;
    xmlProc.process();
    
    return 0;
}
```

## 八、总结

多态是C++面向对象编程中最重要的特性，它使得代码具有更好的扩展性和可维护性。

### 核心知识点回顾

1. **多态的分类**：静态多态（编译时）和动态多态（运行时）。

2. **虚函数**：使用`virtual`关键字声明，通过基类指针或引用调用时实现动态绑定。

3. **vtable与vptr**：虚函数表的底层实现机制。每个包含虚函数的类有一个vtable，每个对象有一个vptr指向vtable。

4. **多态的条件**：必须通过基类指针或引用调用虚函数，且派生类必须重写该虚函数。

5. **重写vs重载vs隐藏**：
   - 重载：同一作用域，同名不同参
   - 重写：基类与派生类之间，虚函数签名相同
   - 隐藏：派生类同名函数隐藏基类所有同名函数

6. **虚函数的注意事项**：
   - 构造函数不能是虚函数
   - 析构函数应该是虚函数
   - 默认参数是静态绑定的
   - 支持协变返回类型

### 设计启示

多态的核心价值在于"面向接口编程，而非面向实现编程"。通过定义清晰的虚函数接口，我们可以编写出更加灵活、可扩展的代码。策略模式、模板方法模式、观察者模式等经典设计模式，都依赖于多态机制。

理解vtable和vptr的工作原理，不仅有助于编写正确的代码，也有助于理解C++程序的性能特征——虚函数调用比普通函数调用多了一次间接寻址，但这个开销通常是值得的，因为它换来了代码的灵活性和可维护性。
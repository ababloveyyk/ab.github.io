---
title: C++对C的升级Ⅳ——动态内存管理
date: 2026-07-26
tags:
  - C++
  - new-delete
  - 内存管理
  - RAII
categories:
  - C++
---

## 前言

动态内存管理是C/C++编程中最为核心也最为棘手的话题之一。C语言通过`malloc`/`calloc`/`realloc`/`free`函数族进行动态内存管理，而C++引入了`new`/`delete`运算符，不仅提供了更安全、更便捷的内存分配方式，还支持对象的自动构造和析构。

本文将从`new`/`delete`的基本使用出发，深入探讨C++动态内存管理的方方面面，包括与C语言内存管理的对比、定位new、nothrow new、内存泄漏检测方法，以及RAII（Resource Acquisition Is Initialization）这一C++核心设计思想的初步介绍。

## new/delete运算符

### 基本使用

`new`运算符用于在堆上动态分配内存，并自动调用对象的构造函数；`delete`运算符用于释放`new`分配的内存，并自动调用对象的析构函数。

```cpp
#include <iostream>

int main() {
    // new分配单个int
    int* p1 = new int;
    *p1 = 42;
    std::cout << "*p1 = " << *p1 << std::endl;
    delete p1;  // 释放内存

    // new分配单个int并初始化
    int* p2 = new int(100);
    std::cout << "*p2 = " << *p2 << std::endl;
    delete p2;

    // new分配单个double
    double* p3 = new double(3.14159);
    std::cout << "*p3 = " << *p3 << std::endl;
    delete p3;

    // new分配数组
    int* arr = new int[5];
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }
    std::cout << "Array: ";
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    delete[] arr;  // 释放数组内存，注意使用delete[]

    // new分配数组并初始化（C++11统一初始化语法）
    int* arr2 = new int[5]{1, 2, 3, 4, 5};
    std::cout << "Array2: ";
    for (int i = 0; i < 5; i++) {
        std::cout << arr2[i] << " ";
    }
    std::cout << std::endl;
    delete[] arr2;

    return 0;
}
```

关键规则：
- 用`new`分配的内存，必须用`delete`释放。
- 用`new[]`分配的数组，必须用`delete[]`释放。
- 混用`delete`和`delete[]`会导致未定义行为。
- `new`可以同时分配并初始化，`new int(100)`分配一个int并初始化为100。
- C++11支持使用花括号初始化列表：`new int[5]{1, 2, 3, 4, 5}`。

### 为自定义类型分配内存

`new`和`delete`的核心优势在于它们会自动调用构造函数和析构函数：

```cpp
#include <iostream>
#include <string>
#include <cstring>

class Person {
private:
    char* name;
    int age;

public:
    // 默认构造函数
    Person() : name(nullptr), age(0) {
        std::cout << "Person() 默认构造" << std::endl;
    }

    // 带参构造函数
    Person(const char* n, int a) : age(a) {
        name = new char[strlen(n) + 1];
        strcpy(name, n);
        std::cout << "Person(\"" << name << "\", " << age << ") 构造" << std::endl;
    }

    // 拷贝构造函数
    Person(const Person& other) : age(other.age) {
        if (other.name) {
            name = new char[strlen(other.name) + 1];
            strcpy(name, other.name);
        } else {
            name = nullptr;
        }
        std::cout << "Person(\"" << (name ? name : "null") << "\", " << age << ") 拷贝构造" << std::endl;
    }

    // 析构函数
    ~Person() {
        std::cout << "~Person(\"" << (name ? name : "null") << "\", " << age << ") 析构" << std::endl;
        delete[] name;
    }

    void introduce() const {
        std::cout << "我叫" << (name ? name : "未知") << ", 今年" << age << "岁。" << std::endl;
    }

    void setName(const char* n) {
        delete[] name;
        name = new char[strlen(n) + 1];
        strcpy(name, n);
    }

    void setAge(int a) { age = a; }
};

int main() {
    std::cout << "====== 分配单个对象 ======" << std::endl;
    Person* p1 = new Person("张三", 25);  // 调用构造函数
    p1->introduce();
    delete p1;  // 调用析构函数

    std::cout << "\n====== 分配对象数组 ======" << std::endl;
    Person* people = new Person[3];  // 调用默认构造函数3次
    people[0].setName("李四");
    people[0].setAge(30);
    people[1].setName("王五");
    people[1].setAge(28);
    people[2].setName("赵六");
    people[2].setAge(35);

    for (int i = 0; i < 3; i++) {
        people[i].introduce();
    }
    delete[] people;  // 调用析构函数3次

    std::cout << "\n====== 程序结束 ======" << std::endl;
    return 0;
}
```

从输出可以清楚地看到，`new`和`delete`自动调用了构造函数和析构函数。这是`new`/`delete`相比`malloc`/`free`最核心的优势：`malloc`只是分配一块原始内存，不会调用构造函数；`free`只是释放内存，不会调用析构函数。对于包含资源（如动态分配的字符串）的类，这个区别至关重要。

### new/delete与malloc/free的详细对比

`new`/`delete`是C++的运算符，`malloc`/`free`是C语言的库函数。它们在多个维度上存在显著差异：

```cpp
#include <iostream>
#include <cstdlib>  // malloc, free
#include <cstring>
#include <new>      // nothrow

class TestClass {
public:
    int value;
    TestClass() : value(0) {
        std::cout << "TestClass 构造" << std::endl;
    }
    TestClass(int v) : value(v) {
        std::cout << "TestClass(" << v << ") 构造" << std::endl;
    }
    ~TestClass() {
        std::cout << "TestClass(" << value << ") 析构" << std::endl;
    }
};

int main() {
    std::cout << "====== new/delete ======" << std::endl;
    TestClass* p1 = new TestClass(100);  // 分配内存 + 调用构造函数
    std::cout << "p1->value = " << p1->value << std::endl;
    delete p1;  // 调用析构函数 + 释放内存

    std::cout << "\n====== malloc/free ======" << std::endl;
    // malloc只分配原始内存，不调用构造函数
    TestClass* p2 = (TestClass*)malloc(sizeof(TestClass));
    std::cout << "p2->value = " << p2->value << " (未初始化，不确定值)" << std::endl;
    // 手动调用构造函数（placement new）
    new(p2) TestClass(200);
    std::cout << "p2->value after placement new = " << p2->value << std::endl;
    // 手动调用析构函数
    p2->~TestClass();
    free(p2);  // 仅释放内存

    std::cout << "\n====== 对比总结 ======" << std::endl;
    std::cout << "1. new是运算符，malloc是函数" << std::endl;
    std::cout << "2. new自动调用构造函数，malloc不调用" << std::endl;
    std::cout << "3. delete自动调用析构函数，free不调用" << std::endl;
    std::cout << "4. new不需要sizeof，malloc需要" << std::endl;
    std::cout << "5. new不需要类型转换，malloc返回void*需要转换" << std::endl;
    std::cout << "6. new失败抛出异常，malloc失败返回NULL" << std::endl;
    std::cout << "7. new可以重载，malloc不能" << std::endl;

    return 0;
}
```

下面是一个更全面的对比示例，展示了两种内存管理方式在实际使用中的差异：

```cpp
#include <iostream>
#include <cstdlib>
#include <cstring>
#include <new>

// 对比维度1：类型安全
void demonstrateTypeSafety() {
    std::cout << "====== 类型安全对比 ======" << std::endl;

    // new：自动计算大小，返回正确类型
    int* p1 = new int(42);
    std::cout << "new int: " << *p1 << std::endl;
    delete p1;

    // malloc：需要手动计算大小，需要强制类型转换
    int* p2 = (int*)malloc(sizeof(int));
    *p2 = 42;
    std::cout << "malloc int: " << *p2 << std::endl;
    free(p2);

    // new：编译器知道类型
    double* p3 = new double(3.14);
    // p3 = new int(42);  // 编译错误！类型不匹配
    delete p3;

    // malloc：编译器不知道类型，void*可以隐式转换为任何指针（在C中）
    // 这可能引入隐藏的类型错误
}

// 对比维度2：错误处理
void demonstrateErrorHandling() {
    std::cout << "\n====== 错误处理对比 ======" << std::endl;

    // new失败默认抛出std::bad_alloc异常
    try {
        // 尝试分配一个巨大的内存块
        // int* huge = new int[100000000000];  // 可能抛出异常
        std::cout << "new throws std::bad_alloc on failure" << std::endl;
    } catch (const std::bad_alloc& e) {
        std::cout << "Caught exception: " << e.what() << std::endl;
    }

    // nothrow new：失败返回nullptr
    int* p = new (std::nothrow) int[100000000000];
    if (p == nullptr) {
        std::cout << "nothrow new returned nullptr" << std::endl;
    } else {
        delete[] p;
    }

    // malloc失败返回NULL
    int* q = (int*)malloc(sizeof(int) * 100000000000);
    if (q == NULL) {
        std::cout << "malloc returned NULL" << std::endl;
    } else {
        free(q);
    }
}

// 对比维度3：数组分配
void demonstrateArrayAllocation() {
    std::cout << "\n====== 数组分配对比 ======" << std::endl;

    // new[] / delete[]：自动调用构造函数和析构函数
    struct Test {
        int id;
        Test() { std::cout << "Test() id=" << id << std::endl; }
        ~Test() { std::cout << "~Test() id=" << id << std::endl; }
    };

    std::cout << "new[] Test[3]:" << std::endl;
    Test* arr1 = new Test[3];
    arr1[0].id = 1;
    arr1[1].id = 2;
    arr1[2].id = 3;
    std::cout << "delete[] arr1:" << std::endl;
    delete[] arr1;

    std::cout << "\nmalloc Test[3]:" << std::endl;
    Test* arr2 = (Test*)malloc(sizeof(Test) * 3);
    // 构造函数未被调用！arr2中的对象处于未初始化状态
    std::cout << "free arr2:" << std::endl;
    free(arr2);
    // 析构函数未被调用！
}

int main() {
    demonstrateTypeSafety();
    demonstrateErrorHandling();
    demonstrateArrayAllocation();
    return 0;
}
```

## 定位new（Placement New）

定位new（Placement New）是C++中一种特殊的new表达式，它允许在已经分配的内存上构造对象，而不是分配新的内存。定位new主要用于以下场景：

1. 在预先分配的内存池中构造对象。
2. 实现自定义的内存分配器。
3. 在共享内存中构造对象。
4. 分离内存分配和对象构造。

### 定位new的基本语法

```cpp
#include <iostream>
#include <cstdlib>
#include <new>

class MyClass {
public:
    int value;
    MyClass() : value(0) {
        std::cout << "MyClass() 默认构造" << std::endl;
    }
    MyClass(int v) : value(v) {
        std::cout << "MyClass(" << v << ") 构造" << std::endl;
    }
    ~MyClass() {
        std::cout << "MyClass(" << value << ") 析构" << std::endl;
    }
    void display() const {
        std::cout << "MyClass value = " << value << std::endl;
    }
};

int main() {
    std::cout << "====== 定位new基本用法 ======" << std::endl;

    // 1. 分配原始内存（不调用构造函数）
    void* rawMemory = malloc(sizeof(MyClass));
    std::cout << "原始内存已分配" << std::endl;

    // 2. 在原始内存上使用定位new构造对象
    MyClass* obj = new(rawMemory) MyClass(42);
    std::cout << "对象已构造" << std::endl;
    obj->display();

    // 3. 手动调用析构函数
    obj->~MyClass();
    std::cout << "析构函数已调用" << std::endl;

    // 4. 释放原始内存
    free(rawMemory);
    std::cout << "内存已释放" << std::endl;

    std::cout << "\n====== 定位new数组 ======" << std::endl;

    // 分配原始内存用于3个对象
    void* rawArray = malloc(sizeof(MyClass) * 3);

    // 在连续内存上构造3个对象
    MyClass* arr = static_cast<MyClass*>(rawArray);
    new(&arr[0]) MyClass(10);
    new(&arr[1]) MyClass(20);
    new(&arr[2]) MyClass(30);

    for (int i = 0; i < 3; i++) {
        arr[i].display();
    }

    // 按相反顺序析构
    for (int i = 2; i >= 0; i--) {
        arr[i].~MyClass();
    }

    free(rawArray);
    std::cout << "数组内存已释放" << std::endl;

    return 0;
}
```

### 实现简单内存池

定位new的一个重要应用是实现内存池，以减少频繁的堆分配开销：

```cpp
#include <iostream>
#include <new>
#include <cstdlib>
#include <cstring>

// 简单的内存池实现
template<typename T, size_t PoolSize = 1024>
class MemoryPool {
private:
    // 预先分配一大块内存
    char buffer[PoolSize * sizeof(T)];
    bool used[PoolSize];
    size_t capacity;

public:
    MemoryPool() : capacity(PoolSize) {
        memset(used, 0, sizeof(used));
        std::cout << "MemoryPool 创建: 容量=" << capacity
                  << " 对象, 缓冲区大小=" << sizeof(buffer) << " 字节" << std::endl;
    }

    T* allocate() {
        for (size_t i = 0; i < capacity; i++) {
            if (!used[i]) {
                used[i] = true;
                // 在预分配的内存上使用定位new构造对象
                T* obj = new(&buffer[i * sizeof(T)]) T();
                std::cout << "MemoryPool::allocate() -> 槽位 " << i << std::endl;
                return obj;
            }
        }
        std::cerr << "MemoryPool: 内存池已满！" << std::endl;
        return nullptr;
    }

    void deallocate(T* obj) {
        // 计算对象在缓冲区中的位置
        char* objPtr = reinterpret_cast<char*>(obj);
        char* bufferPtr = reinterpret_cast<char*>(buffer);
        ptrdiff_t offset = objPtr - bufferPtr;
        size_t index = offset / sizeof(T);

        if (index < capacity) {
            obj->~T();  // 调用析构函数
            used[index] = false;
            std::cout << "MemoryPool::deallocate() -> 释放槽位 " << index << std::endl;
        }
    }

    ~MemoryPool() {
        // 析构所有正在使用的对象
        for (size_t i = 0; i < capacity; i++) {
            if (used[i]) {
                T* obj = reinterpret_cast<T*>(&buffer[i * sizeof(T)]);
                obj->~T();
                used[i] = false;
            }
        }
        std::cout << "MemoryPool 销毁" << std::endl;
    }
};

// 测试类
struct Particle {
    double x, y, z;
    double vx, vy, vz;
    int id;
    static int count;

    Particle() {
        id = ++count;
        x = y = z = 0.0;
        vx = vy = vz = 0.0;
        std::cout << "Particle(" << id << ") 构造" << std::endl;
    }

    ~Particle() {
        std::cout << "Particle(" << id << ") 析构" << std::endl;
    }

    void init(double px, double py, double pz) {
        x = px; y = py; z = pz;
    }

    void display() const {
        std::cout << "Particle " << id << ": position=("
                  << x << ", " << y << ", " << z << ")" << std::endl;
    }
};

int Particle::count = 0;

int main() {
    std::cout << "====== 内存池演示 ======" << std::endl;

    MemoryPool<Particle, 5> pool;

    // 从内存池分配对象
    Particle* p1 = pool.allocate();
    Particle* p2 = pool.allocate();
    Particle* p3 = pool.allocate();

    p1->init(1.0, 2.0, 3.0);
    p2->init(4.0, 5.0, 6.0);
    p3->init(7.0, 8.0, 9.0);

    p1->display();
    p2->display();
    p3->display();

    // 释放p2
    pool.deallocate(p2);

    // 重新分配，应该使用之前p2的槽位
    Particle* p4 = pool.allocate();
    p4->init(10.0, 11.0, 12.0);
    p4->display();

    // 释放所有对象
    pool.deallocate(p1);
    pool.deallocate(p3);
    pool.deallocate(p4);

    std::cout << "\n====== 程序结束 ======" << std::endl;
    return 0;
}
```

## nothrow new

默认情况下，`new`在分配失败时会抛出`std::bad_alloc`异常。但在某些场景中（如嵌入式系统、实时系统），异常处理可能不可用或不希望使用。C++提供了`nothrow new`，分配失败时返回`nullptr`而不是抛出异常。

```cpp
#include <iostream>
#include <new>

int main() {
    std::cout << "====== nothrow new 演示 ======" << std::endl;

    // 普通new：失败时抛出std::bad_alloc异常
    std::cout << "1. 普通new（异常版本）:" << std::endl;
    try {
        int* big = new int[100000000000ULL];
        std::cout << "分配成功" << std::endl;
        delete[] big;
    } catch (const std::bad_alloc& e) {
        std::cout << "分配失败，异常: " << e.what() << std::endl;
    }

    // nothrow new：失败时返回nullptr
    std::cout << "\n2. nothrow new（空指针版本）:" << std::endl;
    int* big2 = new (std::nothrow) int[100000000000ULL];
    if (big2 == nullptr) {
        std::cout << "分配失败，返回nullptr" << std::endl;
    } else {
        std::cout << "分配成功" << std::endl;
        delete[] big2;
    }

    // 正常大小的nothrow new
    std::cout << "\n3. 正常大小的nothrow new:" << std::endl;
    int* normal = new (std::nothrow) int[100];
    if (normal == nullptr) {
        std::cout << "分配失败" << std::endl;
    } else {
        std::cout << "分配成功，100个int" << std::endl;
        for (int i = 0; i < 10; i++) {
            normal[i] = i * 10;
        }
        for (int i = 0; i < 10; i++) {
            std::cout << normal[i] << " ";
        }
        std::cout << std::endl;
        delete[] normal;
    }

    return 0;
}
```

### 自定义new-handler

除了`nothrow new`，C++还提供了`new-handler`机制，允许在`new`分配失败时调用用户自定义的处理函数：

```cpp
#include <iostream>
#include <new>
#include <cstdlib>

// 自定义new-handler
void myNewHandler() {
    std::cerr << "自定义new-handler: 内存分配失败！" << std::endl;
    std::cerr << "尝试释放一些内存..." << std::endl;

    // 在实际应用中，这里可以：
    // 1. 释放一些缓存
    // 2. 通知用户关闭一些功能
    // 3. 记录日志
    // 4. 如果无法恢复，调用abort()或exit()

    // 这里我们简单退出
    std::cerr << "无法恢复，程序即将终止。" << std::endl;
    std::abort();
}

int main() {
    std::cout << "====== new-handler 演示 ======" << std::endl;

    // 设置自定义new-handler
    std::set_new_handler(myNewHandler);

    std::cout << "尝试分配大量内存..." << std::endl;

    try {
        // 这个分配会失败，触发new-handler
        int* huge = new int[100000000000ULL];
        std::cout << "分配成功（这行不应该被打印）" << std::endl;
        delete[] huge;
    } catch (const std::bad_alloc& e) {
        std::cout << "捕获到异常: " << e.what() << std::endl;
    }

    return 0;
}
```

## 内存泄漏检测

内存泄漏是C++程序中最常见的Bug之一。当使用`new`分配的内存没有被`delete`释放时，就会发生内存泄漏。长时间运行的程序如果存在内存泄漏，会逐渐耗尽系统内存，最终导致程序崩溃。

### 常见的内存泄漏场景

```cpp
#include <iostream>
#include <cstring>

// 场景1：忘记delete
void leakScenario1() {
    int* p = new int(42);
    // 忘记delete p;
    std::cout << "leakScenario1: 内存泄漏1个int" << std::endl;
}

// 场景2：异常导致泄漏
void leakScenario2() {
    int* p = new int[100];
    // 如果这里抛出异常，p永远不会被delete
    // throw std::runtime_error("Something went wrong");
    delete[] p;  // 这行不会被执行
    std::cout << "leakScenario2: 异常路径可能导致泄漏" << std::endl;
}

// 场景3：delete之前return
int* leakScenario3(bool flag) {
    int* p = new int(100);
    if (flag) {
        return p;  // 由调用者负责释放
    } else {
        // 忘记delete p;
        return nullptr;
    }
}

// 场景4：循环中分配
void leakScenario4() {
    for (int i = 0; i < 1000; i++) {
        int* p = new int(i);  // 每次循环都分配新内存
        // 忘记delete p; 每次循环泄漏1个int
    }
    std::cout << "leakScenario4: 循环中泄漏1000个int" << std::endl;
}

// 场景5：delete[]误用为delete
void leakScenario5() {
    struct Data {
        char* buffer;
        Data() { buffer = new char[1024]; }
        ~Data() { delete[] buffer; }
    };

    Data* arr = new Data[10];
    // delete arr;  // 错误！应该使用delete[] arr
    // 这会导致：只调用arr[0]的析构函数，其他9个对象的buffer未释放
    delete[] arr;  // 正确
    std::cout << "leakScenario5: 正确使用delete[]" << std::endl;
}

int main() {
    std::cout << "====== 内存泄漏场景 ======" << std::endl;
    leakScenario1();
    leakScenario2();
    leakScenario4();
    leakScenario5();
    std::cout << "注意：以上场景展示了常见的内存泄漏模式" << std::endl;
    return 0;
}
```

### 实现简单的内存泄漏检测器

可以通过重载`new`和`delete`运算符来实现基本的内存泄漏检测：

```cpp
#include <iostream>
#include <cstdlib>
#include <cstring>
#include <map>
#include <mutex>

// 简单的内存泄漏检测器
class MemoryTracker {
private:
    struct AllocationInfo {
        size_t size;
        const char* file;
        int line;
    };

    std::map<void*, AllocationInfo> allocations;
    size_t totalAllocated;
    std::mutex mtx;

    // 单例模式
    MemoryTracker() : totalAllocated(0) {}

public:
    static MemoryTracker& getInstance() {
        static MemoryTracker instance;
        return instance;
    }

    void recordAllocation(void* ptr, size_t size, const char* file, int line) {
        std::lock_guard<std::mutex> lock(mtx);
        allocations[ptr] = {size, file, line};
        totalAllocated += size;
    }

    void recordDeallocation(void* ptr) {
        std::lock_guard<std::mutex> lock(mtx);
        auto it = allocations.find(ptr);
        if (it != allocations.end()) {
            totalAllocated -= it->second.size;
            allocations.erase(it);
        } else {
            std::cerr << "警告: 尝试释放未跟踪的指针 " << ptr << std::endl;
        }
    }

    void reportLeaks() {
        std::lock_guard<std::mutex> lock(mtx);
        if (allocations.empty()) {
            std::cout << "没有检测到内存泄漏。" << std::endl;
            return;
        }

        std::cerr << "\n====== 内存泄漏报告 ======" << std::endl;
        std::cerr << "发现 " << allocations.size() << " 处内存泄漏, "
                  << "总计 " << totalAllocated << " 字节:" << std::endl;

        for (const auto& [ptr, info] : allocations) {
            std::cerr << "  地址: " << ptr
                      << ", 大小: " << info.size << " 字节"
                      << ", 位置: " << info.file << ":" << info.line
                      << std::endl;
        }
    }

    ~MemoryTracker() {
        reportLeaks();
    }
};

// 重载全局new
void* operator new(size_t size) {
    void* ptr = malloc(size);
    if (!ptr) throw std::bad_alloc();
    MemoryTracker::getInstance().recordAllocation(ptr, size, "unknown", 0);
    return ptr;
}

// 重载全局new[] (带调试信息)
void* operator new[](size_t size, const char* file, int line) {
    void* ptr = malloc(size);
    if (!ptr) throw std::bad_alloc();
    MemoryTracker::getInstance().recordAllocation(ptr, size, file, line);
    return ptr;
}

// 重载全局delete
void operator delete(void* ptr) noexcept {
    if (ptr) {
        MemoryTracker::getInstance().recordDeallocation(ptr);
        free(ptr);
    }
}

// 重载全局delete[]
void operator delete[](void* ptr) noexcept {
    if (ptr) {
        MemoryTracker::getInstance().recordDeallocation(ptr);
        free(ptr);
    }
}

// 调试宏
#define DEBUG_NEW new(__FILE__, __LINE__)

// 测试代码
class TestLeak {
public:
    int* data;
    TestLeak() {
        data = DEBUG_NEW int[100];
    }
    ~TestLeak() {
        // 故意"忘记"释放data，制造内存泄漏
        // delete[] data;
    }
};

int main() {
    std::cout << "====== 内存泄漏检测器演示 ======" << std::endl;

    // 正常分配和释放
    int* p1 = DEBUG_NEW int[10];
    delete[] p1;

    // 故意制造泄漏
    int* p2 = DEBUG_NEW int[50];
    // 忘记delete p2;

    double* p3 = DEBUG_NEW double[25];
    // 忘记delete p3;

    // 使用TestLeak
    TestLeak* leak = new TestLeak();
    delete leak;

    std::cout << "\n程序结束前检查泄漏..." << std::endl;
    // MemoryTracker的析构函数会自动报告泄漏

    return 0;
}
```

## RAII思想初步

RAII（Resource Acquisition Is Initialization，资源获取即初始化）是C++中最重要的编程范式之一。其核心思想是：将资源的生命周期与对象的生命周期绑定，在构造函数中获取资源，在析构函数中释放资源。这样，当对象离开作用域时，资源会自动被释放，无需手动管理。

### RAII的基本示例

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <mutex>
#include <cstring>

// RAII文件管理类
class FileGuard {
private:
    FILE* file;

public:
    // 构造函数：获取资源
    FileGuard(const char* filename, const char* mode) {
        file = fopen(filename, mode);
        if (file) {
            std::cout << "文件已打开: " << filename << std::endl;
        } else {
            std::cerr << "无法打开文件: " << filename << std::endl;
        }
    }

    // 析构函数：释放资源
    ~FileGuard() {
        if (file) {
            fclose(file);
            std::cout << "文件已关闭" << std::endl;
        }
    }

    // 禁止拷贝
    FileGuard(const FileGuard&) = delete;
    FileGuard& operator=(const FileGuard&) = delete;

    // 允许移动
    FileGuard(FileGuard&& other) noexcept : file(other.file) {
        other.file = nullptr;
    }

    FileGuard& operator=(FileGuard&& other) noexcept {
        if (this != &other) {
            if (file) fclose(file);
            file = other.file;
            other.file = nullptr;
        }
        return *this;
    }

    // 写入数据
    void write(const std::string& data) {
        if (file) {
            fputs(data.c_str(), file);
        }
    }

    bool isOpen() const { return file != nullptr; }
};

// RAII动态数组管理类
template<typename T>
class SmartArray {
private:
    T* data;
    size_t size;

public:
    // 构造函数：分配资源
    SmartArray(size_t n) : size(n) {
        data = new T[n];
        std::cout << "SmartArray: 分配了 " << n << " 个元素" << std::endl;
    }

    // 析构函数：释放资源
    ~SmartArray() {
        delete[] data;
        std::cout << "SmartArray: 释放了 " << size << " 个元素" << std::endl;
    }

    // 禁止拷贝（简化版）
    SmartArray(const SmartArray&) = delete;
    SmartArray& operator=(const SmartArray&) = delete;

    T& operator[](size_t index) { return data[index]; }
    const T& operator[](size_t index) const { return data[index]; }
    size_t getSize() const { return size; }
};

// RAII锁管理
class LockGuard {
private:
    std::mutex& mtx;

public:
    LockGuard(std::mutex& m) : mtx(m) {
        mtx.lock();
        std::cout << "锁已获取" << std::endl;
    }

    ~LockGuard() {
        mtx.unlock();
        std::cout << "锁已释放" << std::endl;
    }

    LockGuard(const LockGuard&) = delete;
    LockGuard& operator=(const LockGuard&) = delete;
};

int main() {
    std::cout << "====== RAII演示 ======" << std::endl;

    // 文件管理
    {
        std::cout << "\n--- 文件管理 ---" << std::endl;
        FileGuard file("test_raii.txt", "w");
        if (file.isOpen()) {
            file.write("Hello, RAII!\n");
            file.write("This file will be automatically closed.\n");
        }
    }  // file离开作用域，自动关闭文件

    // 动态数组管理
    {
        std::cout << "\n--- 动态数组管理 ---" << std::endl;
        SmartArray<int> arr(10);
        for (size_t i = 0; i < arr.getSize(); i++) {
            arr[i] = static_cast<int>(i * i);
        }
        for (size_t i = 0; i < arr.getSize(); i++) {
            std::cout << arr[i] << " ";
        }
        std::cout << std::endl;
    }  // arr离开作用域，自动释放内存

    // 锁管理
    {
        std::cout << "\n--- 锁管理 ---" << std::endl;
        std::mutex mtx;
        {
            LockGuard lock(mtx);
            std::cout << "在锁保护下执行临界区代码..." << std::endl;
        }  // lock离开作用域，自动释放锁
        std::cout << "锁已自动释放，其他线程可以获取锁" << std::endl;
    }

    std::cout << "\n====== RAII演示结束 ======" << std::endl;
    return 0;
}
```

### RAII与智能指针

C++11引入的智能指针（`std::unique_ptr`、`std::shared_ptr`、`std::weak_ptr`）是RAII思想在内存管理中的最佳实践：

```cpp
#include <iostream>
#include <memory>
#include <vector>
#include <string>

class Resource {
public:
    std::string name;

    Resource(const std::string& n) : name(n) {
        std::cout << "Resource(\"" << name << "\") 构造" << std::endl;
    }

    ~Resource() {
        std::cout << "Resource(\"" << name << "\") 析构" << std::endl;
    }

    void doWork() const {
        std::cout << "Resource(\"" << name << "\") 正在工作..." << std::endl;
    }
};

// 使用unique_ptr：独占所有权
void demonstrateUniquePtr() {
    std::cout << "\n====== unique_ptr ======" << std::endl;

    // 创建unique_ptr
    std::unique_ptr<Resource> p1 = std::make_unique<Resource>("Resource1");
    p1->doWork();

    // 转移所有权
    std::unique_ptr<Resource> p2 = std::move(p1);
    if (!p1) {
        std::cout << "p1已为空" << std::endl;
    }
    p2->doWork();

    // unique_ptr在容器中
    std::vector<std::unique_ptr<Resource>> resources;
    resources.push_back(std::make_unique<Resource>("ContainerResource1"));
    resources.push_back(std::make_unique<Resource>("ContainerResource2"));
    resources.push_back(std::make_unique<Resource>("ContainerResource3"));

    for (const auto& r : resources) {
        r->doWork();
    }
}  // 所有unique_ptr离开作用域，自动释放资源

// 使用shared_ptr：共享所有权
void demonstrateSharedPtr() {
    std::cout << "\n====== shared_ptr ======" << std::endl;

    // 创建shared_ptr
    std::shared_ptr<Resource> p1 = std::make_shared<Resource>("SharedResource");
    std::cout << "引用计数: " << p1.use_count() << std::endl;

    {
        std::shared_ptr<Resource> p2 = p1;  // 共享所有权
        std::cout << "引用计数: " << p1.use_count() << std::endl;

        std::shared_ptr<Resource> p3 = p1;
        std::cout << "引用计数: " << p1.use_count() << std::endl;
    }  // p2和p3离开作用域，引用计数减少

    std::cout << "引用计数: " << p1.use_count() << std::endl;
    p1->doWork();
}  // p1离开作用域，引用计数归零，释放资源

int main() {
    std::cout << "====== 智能指针与RAII ======" << std::endl;
    demonstrateUniquePtr();
    demonstrateSharedPtr();
    std::cout << "\n====== 程序结束 ======" << std::endl;
    return 0;
}
```

## 总结

本文系统地介绍了C++的动态内存管理机制，包括`new`/`delete`运算符、定位new、nothrow new、内存泄漏检测和RAII编程思想。

### 核心要点回顾

1. **new/delete运算符**：`new`在堆上分配内存并自动调用构造函数，`delete`释放内存并自动调用析构函数。`new[]`和`delete[]`用于数组分配和释放。`new`/`delete`是运算符而非函数，可以重载，支持类型安全。

2. **new/delete与malloc/free的对比**：`new`/`delete`自动调用构造/析构函数，`malloc`/`free`仅分配/释放原始内存。`new`返回正确类型而无需强制转换，`malloc`返回`void*`。`new`失败抛出异常，`malloc`失败返回NULL。`new`不需要`sizeof`，`malloc`需要。

3. **定位new（Placement New）**：允许在已分配的内存上构造对象，不分配新内存。主要用于内存池、自定义分配器和共享内存场景。

4. **nothrow new**：`new (std::nothrow)`在分配失败时返回`nullptr`而非抛出异常，适用于不使用异常的嵌入式或实时系统。

5. **内存泄漏检测**：通过重载`new`/`delete`运算符可以实现基本的内存泄漏检测。现代C++开发中建议使用valgrind、AddressSanitizer等专业工具。

6. **RAII（资源获取即初始化）**：将资源的生命周期与对象的生命周期绑定，构造函数获取资源，析构函数释放资源。RAII是C++编程的核心范式，智能指针（`unique_ptr`、`shared_ptr`）是RAII在内存管理中的最佳实践。

在下一篇文章中，我们将综合运用前面学到的所有C++特性，使用C++重写一个C语言链表成绩管理系统，展示C++相比C语言的生产力提升。
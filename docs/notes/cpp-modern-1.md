---
title: C++现代特性Ⅰ——智能指针
date: 2026-07-26
tags:
  - C++
  - 智能指针
  - unique_ptr
  - shared_ptr
  - weak_ptr
categories:
  - C++
---

## 一、智能指针概述

智能指针是C++11引入的最重要的特性之一，它们解决了C++中长期存在的内存管理问题。智能指针本质上是封装了裸指针的类模板，通过RAII（Resource Acquisition Is Initialization）机制自动管理资源的生命周期。

### 1.1 为什么需要智能指针

传统C++中，使用new/delete手动管理内存存在以下问题：

- **忘记释放内存**：导致内存泄漏
- **重复释放**：导致未定义行为
- **使用已释放的内存**：悬垂指针问题
- **异常安全问题**：抛出异常时资源可能未被释放

智能指针通过自动调用析构函数来释放资源，从根本上解决了这些问题。

### 1.2 三种智能指针

C++11提供了三种智能指针：

| 智能指针 | 所有权模型 | 典型用途 |
|---------|-----------|---------|
| unique_ptr | 独占所有权 | 替代裸指针，默认选择 |
| shared_ptr | 共享所有权 | 多个所有者共享资源 |
| weak_ptr | 弱引用 | 打破循环引用 |

## 二、unique_ptr

### 2.1 unique_ptr的基本使用

unique_ptr独占所指向的对象，不能被拷贝，只能被移动：

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Resource {
private:
    string name;
    
public:
    Resource(const string& n) : name(n) {
        cout << "Resource构造：" << name << endl;
    }
    
    ~Resource() {
        cout << "Resource析构：" << name << endl;
    }
    
    void doSomething() const {
        cout << "Resource[" << name << "]正在工作..." << endl;
    }
    
    string getName() const { return name; }
};

int main() {
    cout << "========== unique_ptr基本使用 ==========\n" << endl;
    
    // 创建unique_ptr（推荐使用make_unique，C++14）
    unique_ptr<Resource> ptr1 = make_unique<Resource>("R1");
    ptr1->doSomething();
    
    // C++11方式
    unique_ptr<Resource> ptr2(new Resource("R2"));
    
    // unique_ptr不能被拷贝
    // unique_ptr<Resource> ptr3 = ptr1;  // 错误！
    
    // 但可以被移动
    unique_ptr<Resource> ptr3 = move(ptr1);
    if (ptr1 == nullptr) {
        cout << "ptr1已被移动，现在是nullptr" << endl;
    }
    ptr3->doSomething();
    
    // 作用域结束时自动释放
    cout << "\n离开作用域，自动释放资源：" << endl;
    
    return 0;
}
```

### 2.2 unique_ptr作为函数参数和返回值

```cpp
#include <iostream>
#include <memory>
#include <string>
using namespace std;

class Widget {
private:
    string id;
    
public:
    Widget(const string& i) : id(i) {
        cout << "Widget[" << id << "]构造" << endl;
    }
    
    ~Widget() {
        cout << "Widget[" << id << "]析构" << endl;
    }
    
    void display() const {
        cout << "Widget[" << id << "]" << endl;
    }
};

// 函数返回unique_ptr（自动使用移动语义）
unique_ptr<Widget> createWidget(const string& id) {
    return make_unique<Widget>(id);
}

// 接收unique_ptr（转移所有权）
void consumeWidget(unique_ptr<Widget> w) {
    cout << "消费：";
    w->display();
    // w在这里自动销毁
}

// 只使用但不获取所有权
void useWidget(const Widget& w) {
    cout << "使用：";
    w.display();
}

int main() {
    cout << "========== unique_ptr作为函数参数和返回值 ==========\n" << endl;
    
    // 从函数获取unique_ptr
    auto w1 = createWidget("W1");
    w1->display();
    
    // 转移所有权到函数
    cout << "\n转移所有权：" << endl;
    consumeWidget(move(w1));
    cout << "w1现在是：" << (w1 ? "非空" : "nullptr") << endl;
    
    // 使用但不转移所有权
    auto w2 = createWidget("W2");
    useWidget(*w2);  // 解引用传递引用
    
    // 获取裸指针（不转移所有权）
    Widget* rawPtr = w2.get();
    rawPtr->display();
    
    // 释放所有权但不删除对象
    Widget* released = w2.release();
    cout << "w2现在是：" << (w2 ? "非空" : "nullptr") << endl;
    delete released;  // 需要手动删除
    
    return 0;
}
```

### 2.3 unique_ptr与数组

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    cout << "========== unique_ptr与数组 ==========\n" << endl;
    
    // unique_ptr管理数组
    unique_ptr<int[]> arr = make_unique<int[]>(10);
    
    // 初始化数组
    for (int i = 0; i < 10; i++) {
        arr[i] = i * 10;
    }
    
    // 访问数组
    cout << "数组内容：";
    for (int i = 0; i < 10; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    // 自动调用delete[]释放数组
    // 不需要手动delete[]
    
    return 0;
}
```

### 2.4 自定义删除器

unique_ptr允许指定自定义删除器，用于释放非new分配的资源：

```cpp
#include <iostream>
#include <memory>
#include <cstdio>
using namespace std;

// 自定义删除器：关闭文件
struct FileDeleter {
    void operator()(FILE* file) const {
        if (file) {
            cout << "关闭文件" << endl;
            fclose(file);
        }
    }
};

// 自定义删除器：释放C风格内存
void customDeleter(int* p) {
    cout << "自定义删除器被调用，释放：" << *p << endl;
    delete p;
}

int main() {
    cout << "========== 自定义删除器 ==========\n" << endl;
    
    // 使用函数指针作为删除器
    {
        unique_ptr<int, void(*)(int*)> ptr(new int(42), customDeleter);
        cout << "值：" << *ptr << endl;
    }
    cout << "ptr已销毁" << endl;
    
    // 使用lambda作为删除器
    {
        auto deleter = [](int* p) {
            cout << "Lambda删除器：释放" << *p << endl;
            delete p;
        };
        unique_ptr<int, decltype(deleter)> ptr(new int(100), deleter);
        cout << "值：" << *ptr << endl;
    }
    
    // 使用函数对象作为删除器
    {
        unique_ptr<FILE, FileDeleter> filePtr(fopen("test.txt", "w"));
        if (filePtr) {
            cout << "文件已打开" << endl;
            fprintf(filePtr.get(), "Hello, C++!\n");
        }
    }
    
    return 0;
}
```

## 三、shared_ptr

### 3.1 shared_ptr的基本使用

shared_ptr使用引用计数实现共享所有权，多个shared_ptr可以指向同一个对象。当最后一个shared_ptr被销毁时，对象被释放：

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class SharedResource {
private:
    string name;
    
public:
    SharedResource(const string& n) : name(n) {
        cout << "SharedResource构造：" << name << endl;
    }
    
    ~SharedResource() {
        cout << "SharedResource析构：" << name << endl;
    }
    
    void use() const {
        cout << "使用SharedResource[" << name << "]" << endl;
    }
    
    string getName() const { return name; }
};

int main() {
    cout << "========== shared_ptr基本使用 ==========\n" << endl;
    
    // 创建shared_ptr（推荐使用make_shared）
    shared_ptr<SharedResource> sp1 = make_shared<SharedResource>("SR1");
    cout << "sp1引用计数：" << sp1.use_count() << endl;
    
    // 拷贝：引用计数增加
    shared_ptr<SharedResource> sp2 = sp1;
    cout << "拷贝后 sp1引用计数：" << sp1.use_count() << endl;
    cout << "sp2引用计数：" << sp2.use_count() << endl;
    
    // 另一个拷贝
    {
        shared_ptr<SharedResource> sp3 = sp1;
        cout << "作用域内引用计数：" << sp1.use_count() << endl;
    }
    cout << "离开作用域后引用计数：" << sp1.use_count() << endl;
    
    // 检查是否独占
    cout << "sp1是否独占：" << (sp1.unique() ? "是" : "否") << endl;
    
    // 重置
    sp2.reset();
    cout << "sp2重置后 sp1引用计数：" << sp1.use_count() << endl;
    cout << "sp1是否独占：" << (sp1.unique() ? "是" : "否") << endl;
    
    // 使用
    sp1->use();
    
    cout << "\n离开作用域，最后一个shared_ptr销毁：" << endl;
    
    return 0;
}
```

### 3.2 shared_ptr的引用计数机制

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Data {
public:
    int value;
    Data(int v) : value(v) {
        cout << "Data构造：" << value << endl;
    }
    ~Data() {
        cout << "Data析构：" << value << endl;
    }
};

int main() {
    cout << "========== 引用计数机制 ==========\n" << endl;
    
    shared_ptr<Data> sp1(new Data(10));
    cout << "sp1引用计数：" << sp1.use_count() << endl;  // 1
    
    shared_ptr<Data> sp2(sp1);
    cout << "拷贝后引用计数：" << sp1.use_count() << endl;  // 2
    
    shared_ptr<Data> sp3 = sp2;
    cout << "再次拷贝后引用计数：" << sp1.use_count() << endl;  // 3
    
    // 移动：不增加引用计数
    shared_ptr<Data> sp4 = move(sp3);
    cout << "移动后 sp3：" << (sp3 ? "非空" : "nullptr") << endl;
    cout << "移动后引用计数：" << sp1.use_count() << endl;  // 仍然是3
    
    // reset：减少引用计数
    sp2.reset();
    cout << "sp2重置后引用计数：" << sp1.use_count() << endl;  // 2
    
    sp4.reset();
    cout << "sp4重置后引用计数：" << sp1.use_count() << endl;  // 1
    
    return 0;
}
```

### 3.3 shared_ptr与容器

```cpp
#include <iostream>
#include <memory>
#include <vector>
#include <algorithm>
using namespace std;

class Task {
private:
    int id;
    string description;
    
public:
    Task(int i, const string& desc) : id(i), description(desc) {
        cout << "Task[" << id << "]构造" << endl;
    }
    
    ~Task() {
        cout << "Task[" << id << "]析构" << endl;
    }
    
    void execute() const {
        cout << "执行Task[" << id << "]：" << description << endl;
    }
    
    int getId() const { return id; }
};

int main() {
    cout << "========== shared_ptr与容器 ==========\n" << endl;
    
    vector<shared_ptr<Task>> taskList;
    
    // 添加任务
    taskList.push_back(make_shared<Task>(1, "下载文件"));
    taskList.push_back(make_shared<Task>(2, "处理数据"));
    taskList.push_back(make_shared<Task>(3, "生成报告"));
    taskList.push_back(make_shared<Task>(4, "发送邮件"));
    
    cout << "\n所有任务：" << endl;
    for (const auto& task : taskList) {
        task->execute();
    }
    
    // 共享某个任务
    shared_ptr<Task> sharedTask = taskList[1];
    cout << "\nTask[2]引用计数：" << taskList[1].use_count() << endl;
    
    // 删除满足条件的任务
    cout << "\n删除Task[3]：" << endl;
    taskList.erase(
        remove_if(taskList.begin(), taskList.end(),
                  [](const shared_ptr<Task>& t) { return t->getId() == 3; }),
        taskList.end()
    );
    
    cout << "剩余任务：" << endl;
    for (const auto& task : taskList) {
        task->execute();
    }
    
    cout << "\n清理容器：" << endl;
    taskList.clear();
    // 注意：sharedTask仍然持有Task[2]，所以它不会被销毁
    cout << "sharedTask引用计数：" << sharedTask.use_count() << endl;
    
    return 0;
}
```

### 3.4 shared_ptr的注意事项

```cpp
#include <iostream>
#include <memory>
using namespace std;

class MyClass {
public:
    int data;
    MyClass(int d) : data(d) {
        cout << "MyClass构造：" << data << endl;
    }
    ~MyClass() {
        cout << "MyClass析构：" << data << endl;
    }
};

// 不要这样做：从同一个裸指针创建多个shared_ptr
void badPractice() {
    cout << "=== 错误做法 ===" << endl;
    MyClass* raw = new MyClass(42);
    shared_ptr<MyClass> sp1(raw);
    // shared_ptr<MyClass> sp2(raw);  // 危险！会导致双重释放
    cout << "（如果取消注释上面的代码，会导致未定义行为）" << endl;
}

// 正确做法：使用make_shared
void goodPractice() {
    cout << "=== 正确做法 ===" << endl;
    auto sp1 = make_shared<MyClass>(42);
    auto sp2 = sp1;  // 安全，共享同一个控制块
    cout << "引用计数：" << sp1.use_count() << endl;
}

int main() {
    cout << "========== shared_ptr注意事项 ==========\n" << endl;
    
    goodPractice();
    cout << endl;
    badPractice();
    
    // make_shared vs new
    cout << "\n=== make_shared vs new ===" << endl;
    
    // 推荐：make_shared（一次内存分配，更高效）
    auto sp1 = make_shared<MyClass>(100);
    
    // 不推荐：new（两次内存分配）
    shared_ptr<MyClass> sp2(new MyClass(200));
    
    cout << "\nmake_shared的优势：" << endl;
    cout << "  1. 一次内存分配（对象和控制块在一起）" << endl;
    cout << "  2. 更好的缓存局部性" << endl;
    cout << "  3. 异常安全" << endl;
    cout << "  4. 代码更简洁" << endl;
    
    return 0;
}
```

## 四、weak_ptr

### 4.1 weak_ptr解决循环引用

weak_ptr是一种不控制对象生命周期的智能指针，它指向shared_ptr管理的对象，但不增加引用计数：

```cpp
#include <iostream>
#include <memory>
#include <string>
using namespace std;

// 使用shared_ptr导致循环引用的例子
class NodeB;  // 前向声明

class NodeA {
public:
    string name;
    shared_ptr<NodeB> ptrToB;  // A指向B
    
    NodeA(const string& n) : name(n) {
        cout << "NodeA构造：" << name << endl;
    }
    
    ~NodeA() {
        cout << "NodeA析构：" << name << endl;
    }
};

class NodeB {
public:
    string name;
    shared_ptr<NodeA> ptrToA;  // B指向A（循环引用！）
    
    NodeB(const string& n) : name(n) {
        cout << "NodeB构造：" << name << endl;
    }
    
    ~NodeB() {
        cout << "NodeB析构：" << name << endl;
    }
};

// 使用weak_ptr打破循环引用
class SafeNodeB;

class SafeNodeA {
public:
    string name;
    shared_ptr<SafeNodeB> ptrToB;
    
    SafeNodeA(const string& n) : name(n) {
        cout << "SafeNodeA构造：" << name << endl;
    }
    
    ~SafeNodeA() {
        cout << "SafeNodeA析构：" << name << endl;
    }
};

class SafeNodeB {
public:
    string name;
    weak_ptr<SafeNodeA> ptrToA;  // 使用weak_ptr，不增加引用计数
    
    SafeNodeB(const string& n) : name(n) {
        cout << "SafeNodeB构造：" << name << endl;
    }
    
    ~SafeNodeB() {
        cout << "SafeNodeB析构：" << name << endl;
    }
    
    // 使用weak_ptr时需要先lock
    void accessA() {
        if (auto sp = ptrToA.lock()) {
            cout << "SafeNodeB[" << name << "]可以访问SafeNodeA[" 
                 << sp->name << "]" << endl;
        } else {
            cout << "SafeNodeB[" << name << "]指向的对象已被销毁" << endl;
        }
    }
};

int main() {
    cout << "========== 循环引用问题 ==========\n" << endl;
    
    // 循环引用导致内存泄漏
    cout << "--- 循环引用（内存泄漏） ---" << endl;
    {
        auto a = make_shared<NodeA>("A");
        auto b = make_shared<NodeB>("B");
        a->ptrToB = b;
        b->ptrToA = a;
        cout << "a引用计数：" << a.use_count() << endl;  // 2
        cout << "b引用计数：" << b.use_count() << endl;  // 2
    }
    cout << "离开作用域，但NodeA和NodeB都没有被析构！（内存泄漏）" << endl;
    
    // 使用weak_ptr打破循环引用
    cout << "\n--- 使用weak_ptr（正确释放） ---" << endl;
    {
        auto sa = make_shared<SafeNodeA>("SA");
        auto sb = make_shared<SafeNodeB>("SB");
        sa->ptrToB = sb;
        sb->ptrToA = sa;  // weak_ptr不增加引用计数
        cout << "sa引用计数：" << sa.use_count() << endl;  // 1
        cout << "sb引用计数：" << sb.use_count() << endl;  // 2
        
        sb->accessA();
    }
    cout << "离开作用域，资源被正确释放！" << endl;
    
    return 0;
}
```

### 4.2 weak_ptr的其他用法

```cpp
#include <iostream>
#include <memory>
#include <vector>
using namespace std;

class Observer {
public:
    int id;
    Observer(int i) : id(i) {
        cout << "Observer[" << id << "]构造" << endl;
    }
    ~Observer() {
        cout << "Observer[" << id << "]析构" << endl;
    }
    void notify() const {
        cout << "Observer[" << id << "]收到通知" << endl;
    }
};

int main() {
    cout << "========== weak_ptr的其他用法 ==========\n" << endl;
    
    // 缓存模式：使用weak_ptr缓存
    vector<weak_ptr<Observer>> observerCache;
    
    // 添加观察者
    auto obs1 = make_shared<Observer>(1);
    auto obs2 = make_shared<Observer>(2);
    
    observerCache.push_back(obs1);
    observerCache.push_back(obs2);
    
    cout << "\n通知所有观察者：" << endl;
    for (auto& weakObs : observerCache) {
        if (auto obs = weakObs.lock()) {
            obs->notify();
        } else {
            cout << "观察者已销毁" << endl;
        }
    }
    
    // 销毁obs1
    cout << "\n销毁obs1后：" << endl;
    obs1.reset();
    for (auto& weakObs : observerCache) {
        if (auto obs = weakObs.lock()) {
            obs->notify();
        } else {
            cout << "观察者已销毁" << endl;
        }
    }
    
    // expired()：检查对象是否已被销毁
    cout << "\n检查weak_ptr是否过期：" << endl;
    cout << "observerCache[0]过期：" << (observerCache[0].expired() ? "是" : "否") << endl;
    cout << "observerCache[1]过期：" << (observerCache[1].expired() ? "是" : "否") << endl;
    
    return 0;
}
```

## 五、智能指针与RAII

### 5.1 RAII的综合应用

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include <fstream>
using namespace std;

// 使用智能指针管理文件资源
class FileManager {
private:
    unique_ptr<FILE, decltype(&fclose)> file;
    
public:
    FileManager(const string& filename, const string& mode)
        : file(fopen(filename.c_str(), mode.c_str()), &fclose) {
        if (!file) {
            throw runtime_error("无法打开文件：" + filename);
        }
        cout << "文件已打开：" << filename << endl;
    }
    
    void write(const string& content) {
        fprintf(file.get(), "%s\n", content.c_str());
    }
    
    string read() {
        char buffer[256] = {};
        fseek(file.get(), 0, SEEK_SET);
        fgets(buffer, sizeof(buffer), file.get());
        return string(buffer);
    }
};

// 使用智能指针管理数据库连接
class DatabaseConnection {
private:
    struct Connection {
        string dbName;
        bool isOpen;
        Connection(const string& name) : dbName(name), isOpen(true) {
            cout << "连接数据库：" << dbName << endl;
        }
        ~Connection() {
            cout << "断开数据库连接：" << dbName << endl;
        }
    };
    
    shared_ptr<Connection> conn;
    
public:
    DatabaseConnection(const string& dbName)
        : conn(make_shared<Connection>(dbName)) {}
    
    void executeQuery(const string& query) {
        if (conn && conn->isOpen) {
            cout << "执行查询[" << conn->dbName << "]：" << query << endl;
        }
    }
    
    shared_ptr<Connection> getConnection() const {
        return conn;
    }
};

int main() {
    cout << "========== 智能指针与RAII ==========\n" << endl;
    
    // 文件管理
    try {
        FileManager fm("test_output.txt", "w+");
        fm.write("Hello, C++ Smart Pointers!");
        cout << "读取内容：" << fm.read() << endl;
    } catch (const exception& e) {
        cout << "错误：" << e.what() << endl;
    }
    // 文件自动关闭
    
    // 数据库连接
    cout << endl;
    DatabaseConnection db("my_database");
    db.executeQuery("SELECT * FROM users");
    
    // 连接可以被多个地方共享
    auto sharedConn = db.getConnection();
    cout << "连接引用计数：" << sharedConn.use_count() << endl;
    
    return 0;
}
```

### 5.2 将裸指针替换为智能指针的实战

```cpp
#include <iostream>
#include <memory>
#include <vector>
#include <algorithm>
using namespace std;

// 旧代码：使用裸指针
class OldStyleManager {
private:
    vector<int*> data;
    
public:
    void add(int value) {
        data.push_back(new int(value));
    }
    
    void display() const {
        for (const auto* p : data) {
            cout << *p << " ";
        }
        cout << endl;
    }
    
    ~OldStyleManager() {
        for (auto* p : data) {
            delete p;
        }
    }
};

// 新代码：使用智能指针
class ModernStyleManager {
private:
    vector<unique_ptr<int>> data;
    
public:
    void add(int value) {
        data.push_back(make_unique<int>(value));
    }
    
    void display() const {
        for (const auto& p : data) {
            cout << *p << " ";
        }
        cout << endl;
    }
    
    // 不需要析构函数！unique_ptr自动管理内存
};

int main() {
    cout << "========== 裸指针 -> 智能指针 ==========\n" << endl;
    
    cout << "旧风格（裸指针）：" << endl;
    OldStyleManager oldMgr;
    oldMgr.add(1);
    oldMgr.add(2);
    oldMgr.add(3);
    oldMgr.display();
    // 需要手动遍历delete
    
    cout << "\n现代风格（智能指针）：" << endl;
    ModernStyleManager modernMgr;
    modernMgr.add(10);
    modernMgr.add(20);
    modernMgr.add(30);
    modernMgr.display();
    // 自动释放，无需手动管理
    
    cout << "\n优势总结：" << endl;
    cout << "  1. 不需要手动delete" << endl;
    cout << "  2. 异常安全" << endl;
    cout << "  3. 明确所有权语义" << endl;
    cout << "  4. 减少内存泄漏风险" << endl;
    
    return 0;
}
```

## 六、总结

智能指针是C++11中最重要的现代特性之一，它们从根本上改变了C++的资源管理方式。

### 核心知识点

1. **unique_ptr**：独占所有权，轻量级，零开销。默认使用场景的首选。
2. **shared_ptr**：共享所有权，使用引用计数。适合需要多个所有者的场景。
3. **weak_ptr**：弱引用，不增加引用计数。用于打破循环引用和实现缓存。
4. **make_unique/make_shared**：推荐的创建方式，异常安全且高效。
5. **自定义删除器**：用于管理非new分配的资源（如文件句柄、socket等）。

### 使用原则

- 优先使用unique_ptr，除非确实需要共享所有权
- 使用make_unique和make_shared创建智能指针
- 避免从裸指针直接创建shared_ptr
- 使用weak_ptr打破循环引用
- 智能指针的大小开销：unique_ptr与裸指针相同，shared_ptr是裸指针的两倍
- 除非必要，不要在函数参数中使用智能指针（使用引用或裸指针）

智能指针结合RAII（Resource Acquisition Is Initialization）机制，使得C++程序能够自动管理资源，大大减少了内存泄漏和资源泄漏的风险。在现代C++中，几乎没有理由再使用裸指针来管理动态分配的内存。
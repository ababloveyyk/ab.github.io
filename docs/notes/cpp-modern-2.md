---
title: C++现代特性Ⅱ——移动语义与右值引用
date: 2026-07-26
tags:
  - C++
  - 移动语义
  - 右值引用
  - std.move
categories:
  - C++
---

## 一、左值与右值

### 1.1 左值与右值的基本概念

在C++中，每个表达式有两个属性：类型和值类别。值类别分为左值（lvalue）和右值（rvalue）：

- **左值**：可以取地址的表达式，有名字的变量通常是左值
- **右值**：不能取地址的表达式，临时对象和字面量是右值

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "========== 左值与右值 ==========\n" << endl;
    
    int a = 10;           // a是左值，10是右值
    int b = a;            // b是左值，a是左值（可以出现在赋值号左边）
    int c = a + b;        // a + b是右值（临时结果）
    
    // 左值可以取地址
    int* ptr = &a;        // 正确
    // int* ptr2 = &(a + b);  // 错误！右值不能取地址
    
    // 左值引用
    int& ref = a;         // 左值引用绑定到左值
    // int& ref2 = 10;    // 错误！左值引用不能绑定到右值
    
    // const左值引用可以绑定到右值
    const int& cref = 10;  // 正确
    
    cout << "a = " << a << endl;
    cout << "ref = " << ref << endl;
    cout << "cref = " << cref << endl;
    
    return 0;
}
```

### 1.2 判断左值和右值

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// 判断左值/右值的辅助函数
template<typename T>
void checkValueCategory(const string& name) {
    if (is_lvalue_reference<T>::value) {
        cout << name << " 是左值引用" << endl;
    } else if (is_rvalue_reference<T>::value) {
        cout << name << " 是右值引用" << endl;
    } else {
        cout << name << " 是值类型" << endl;
    }
}

int globalVar = 100;  // 全局变量是左值

int getValue() {
    return 42;  // 返回的是右值
}

int& getRef() {
    return globalVar;  // 返回左值引用
}

int main() {
    cout << "========== 判断左值/右值 ==========\n" << endl;
    
    int x = 10;
    int* ptr = &x;
    
    cout << "x（变量）: 左值" << endl;
    cout << "10（字面量）: 右值" << endl;
    cout << "x + 5（表达式）: 右值" << endl;
    cout << "getValue()（返回值）: 右值" << endl;
    cout << "getRef()（返回引用）: 左值" << endl;
    cout << "*ptr（解引用）: 左值" << endl;
    cout << "&x（取地址）: 右值" << endl;
    cout << "string(\"hello\")（临时对象）: 右值" << endl;
    
    cout << "\n特殊情况：" << endl;
    cout << " - 字符串字面量\"hello\"是左值（可以取地址）" << endl;
    cout << " - 命名右值引用变量本身是左值" << endl;
    
    return 0;
}
```

## 二、右值引用

### 2.1 右值引用的基本语法

右值引用使用`&&`声明，用于绑定到右值：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "========== 右值引用 ==========\n" << endl;
    
    // 右值引用绑定到右值
    int&& rref1 = 10;
    cout << "rref1 = " << rref1 << endl;
    
    int&& rref2 = 5 + 3;
    cout << "rref2 = " << rref2 << endl;
    
    string&& rref3 = string("hello") + " world";
    cout << "rref3 = " << rref3 << endl;
    
    // 右值引用不能绑定到左值
    int x = 42;
    // int&& rref4 = x;  // 错误！不能将右值引用绑定到左值
    
    // 但可以使用std::move将左值转为右值
    int&& rref4 = move(x);
    cout << "rref4 = " << rref4 << endl;
    cout << "x = " << x << endl;  // x仍然有效，但值可能被移动
    
    // 右值引用本身是左值
    // int&& rref5 = rref1;  // 错误！rref1是左值
    int&& rref5 = move(rref1);  // 需要move
    
    return 0;
}
```

### 2.2 右值引用的重载

```cpp
#include <iostream>
#include <string>
using namespace std;

// 左值引用版本
void process(string& s) {
    cout << "process(string&) - 左值版本：" << s << endl;
    s += " (modified)";
}

// 右值引用版本
void process(string&& s) {
    cout << "process(string&&) - 右值版本：" << s << endl;
    s += " (moved)";  // 可以直接修改，因为右值即将被销毁
}

// const左值引用版本
void process(const string& s) {
    cout << "process(const string&) - const版本：" << s << endl;
}

int main() {
    cout << "========== 右值引用重载 ==========\n" << endl;
    
    string str = "hello";
    
    // 调用左值引用版本
    process(str);
    cout << "调用后str = " << str << endl;
    
    // 调用右值引用版本
    process(string("world"));
    
    // 调用右值引用版本（move后）
    process(move(str));
    cout << "move后str = " << str << endl;
    
    // 如果只有const&版本，右值也可以绑定
    const string cstr = "constant";
    process(cstr);
    
    return 0;
}
```

## 三、移动构造函数与移动赋值运算符

### 3.1 移动构造函数的实现

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <chrono>
using namespace std;
using namespace std::chrono;

class MyString {
private:
    char* data;
    size_t length;
    
public:
    // 默认构造函数
    MyString() : data(nullptr), length(0) {
        cout << "默认构造" << endl;
    }
    
    // 普通构造函数
    MyString(const char* str) {
        length = strlen(str);
        data = new char[length + 1];
        strcpy(data, str);
        cout << "普通构造：" << data << endl;
    }
    
    // 拷贝构造函数
    MyString(const MyString& other) {
        length = other.length;
        data = new char[length + 1];
        strcpy(data, other.data);
        cout << "拷贝构造：" << data << endl;
    }
    
    // 移动构造函数
    MyString(MyString&& other) noexcept {
        // 直接"窃取"other的资源
        data = other.data;
        length = other.length;
        
        // 将other置于有效但未指定的状态
        other.data = nullptr;
        other.length = 0;
        
        cout << "移动构造：" << data << endl;
    }
    
    // 拷贝赋值运算符
    MyString& operator=(const MyString& other) {
        if (this != &other) {
            delete[] data;
            length = other.length;
            data = new char[length + 1];
            strcpy(data, other.data);
            cout << "拷贝赋值：" << data << endl;
        }
        return *this;
    }
    
    // 移动赋值运算符
    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data;  // 释放自己的资源
            
            // 窃取other的资源
            data = other.data;
            length = other.length;
            
            other.data = nullptr;
            other.length = 0;
            
            cout << "移动赋值：" << data << endl;
        }
        return *this;
    }
    
    // 析构函数
    ~MyString() {
        if (data) {
            cout << "析构：" << data << endl;
            delete[] data;
        } else {
            cout << "析构：空" << endl;
        }
    }
    
    const char* c_str() const { return data ? data : ""; }
    size_t size() const { return length; }
};

int main() {
    cout << "========== 移动构造与移动赋值 ==========\n" << endl;
    
    cout << "--- 拷贝构造 ---" << endl;
    MyString s1("Hello");
    MyString s2 = s1;  // 拷贝构造
    cout << "s1 = " << s1.c_str() << endl;
    cout << "s2 = " << s2.c_str() << endl;
    
    cout << "\n--- 移动构造 ---" << endl;
    MyString s3 = MyString("World");  // 移动构造（临时对象）
    cout << "s3 = " << s3.c_str() << endl;
    
    cout << "\n--- move强制移动 ---" << endl;
    MyString s4 = move(s2);  // 强制移动s2
    cout << "s2 = " << s2.c_str() << "（已被移动）" << endl;
    cout << "s4 = " << s4.c_str() << endl;
    
    cout << "\n--- 移动赋值 ---" << endl;
    MyString s5("C++");
    s5 = MyString("Modern");  // 移动赋值
    cout << "s5 = " << s5.c_str() << endl;
    
    return 0;
}
```

### 3.2 移动语义的性能优势

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <chrono>
using namespace std;
using namespace std::chrono;

// 没有移动语义的类
class NoMove {
private:
    vector<int> data;
    
public:
    NoMove(size_t size) : data(size) {
        for (size_t i = 0; i < size; i++) {
            data[i] = i;
        }
    }
    
    // 只有拷贝构造
    NoMove(const NoMove& other) : data(other.data) {
        // 深拷贝，开销大
    }
    
    // 没有移动构造函数
};

// 有移动语义的类
class WithMove {
private:
    vector<int> data;
    
public:
    WithMove(size_t size) : data(size) {
        for (size_t i = 0; i < size; i++) {
            data[i] = i;
        }
    }
    
    WithMove(const WithMove& other) : data(other.data) {}
    
    // 移动构造函数
    WithMove(WithMove&& other) noexcept : data(move(other.data)) {}
};

int main() {
    cout << "========== 移动语义性能对比 ==========\n" << endl;
    
    const size_t SIZE = 10000000;
    const int ITERATIONS = 100;
    
    // 测试无移动语义
    {
        auto start = high_resolution_clock::now();
        vector<NoMove> vec;
        vec.reserve(ITERATIONS);
        for (int i = 0; i < ITERATIONS; i++) {
            NoMove obj(SIZE);
            vec.push_back(obj);  // 拷贝，开销大
        }
        auto end = high_resolution_clock::now();
        cout << "无移动语义：" << duration_cast<milliseconds>(end - start).count() 
             << " ms" << endl;
    }
    
    // 测试有移动语义
    {
        auto start = high_resolution_clock::now();
        vector<WithMove> vec;
        vec.reserve(ITERATIONS);
        for (int i = 0; i < ITERATIONS; i++) {
            WithMove obj(SIZE);
            vec.push_back(move(obj));  // 移动，开销小
        }
        auto end = high_resolution_clock::now();
        cout << "有移动语义：" << duration_cast<milliseconds>(end - start).count() 
             << " ms" << endl;
    }
    
    return 0;
}
```

## 四、std::move详解

### 4.1 std::move的原理

std::move本质上是一个类型转换，它将左值无条件地转换为右值引用：

```cpp
#include <iostream>
#include <string>
#include <utility>
using namespace std;

// 简化的std::move实现
template<typename T>
typename remove_reference<T>::type&& my_move(T&& t) noexcept {
    return static_cast<typename remove_reference<T>::type&&>(t);
}

int main() {
    cout << "========== std::move原理 ==========\n" << endl;
    
    cout << "std::move做了什么：" << endl;
    cout << "  1. 接收任意类型的参数" << endl;
    cout << "  2. 移除引用" << endl;
    cout << "  3. 转换为右值引用" << endl;
    cout << "  4. 返回右值引用" << endl;
    
    cout << "\nstd::move不做什么：" << endl;
    cout << "  1. 不移动任何东西" << endl;
    cout << "  2. 不生成任何代码" << endl;
    cout << "  3. 不改变对象本身" << endl;
    cout << "  4. 只是类型转换" << endl;
    
    // 演示
    string s1 = "Hello";
    string s2 = move(s1);  // move只是类型转换，真正的移动发生在string的移动构造函数中
    
    cout << "\ns1 = \"" << s1 << "\"（已被移动）" << endl;
    cout << "s2 = \"" << s2 << "\"" << endl;
    
    return 0;
}
```

### 4.2 std::move的使用场景

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <memory>
using namespace std;

int main() {
    cout << "========== std::move使用场景 ==========\n" << endl;
    
    // 场景1：将对象放入容器时避免拷贝
    cout << "场景1：放入容器" << endl;
    vector<string> vec;
    string str = "Hello, World!";
    vec.push_back(move(str));  // 移动而非拷贝
    cout << "str = \"" << str << "\"（已空）" << endl;
    cout << "vec[0] = \"" << vec[0] << "\"" << endl;
    
    // 场景2：交换两个对象
    cout << "\n场景2：交换对象" << endl;
    string a = "first";
    string b = "second";
    cout << "交换前：a=\"" << a << "\", b=\"" << b << "\"" << endl;
    // 高效的交换（使用移动语义）
    string tmp = move(a);
    a = move(b);
    b = move(tmp);
    cout << "交换后：a=\"" << a << "\", b=\"" << b << "\"" << endl;
    
    // 场景3：unique_ptr的所有权转移
    cout << "\n场景3：unique_ptr所有权转移" << endl;
    unique_ptr<int> ptr1 = make_unique<int>(42);
    cout << "ptr1 = " << *ptr1 << endl;
    unique_ptr<int> ptr2 = move(ptr1);
    cout << "ptr1 = " << (ptr1 ? "非空" : "nullptr") << endl;
    cout << "ptr2 = " << *ptr2 << endl;
    
    return 0;
}
```

## 五、std::forward与完美转发

### 5.1 完美转发的概念

完美转发是指在模板函数中，将参数的值类别（左值/右值）原封不动地转发给另一个函数：

```cpp
#include <iostream>
#include <string>
#include <utility>
using namespace std;

// 目标函数
void target(string& s) {
    cout << "target(string&) - 左值：" << s << endl;
}

void target(string&& s) {
    cout << "target(string&&) - 右值：" << s << endl;
}

// 不使用forward：右值引用参数在函数内部变为左值
template<typename T>
void badForward(T&& param) {
    target(param);  // param是左值（有名字），所以总是调用左值版本
}

// 使用forward：完美转发值类别
template<typename T>
void goodForward(T&& param) {
    target(forward<T>(param));  // 转发时保持原始值类别
}

int main() {
    cout << "========== 完美转发 ==========\n" << endl;
    
    string str = "hello";
    
    cout << "--- 不使用forward ---" << endl;
    badForward(str);              // 期望左值版本
    badForward(string("world"));  // 期望右值版本，但实际调用左值版本
    
    cout << "\n--- 使用forward ---" << endl;
    goodForward(str);              // 正确转发为左值
    goodForward(string("world"));  // 正确转发为右值
    
    return 0;
}
```

### 5.2 forward的实现原理

```cpp
#include <iostream>
#include <string>
using namespace std;

// 简化的std::forward实现
template<typename T>
T&& simple_forward(typename remove_reference<T>::type& t) noexcept {
    return static_cast<T&&>(t);
}

template<typename T>
T&& simple_forward(typename remove_reference<T>::type&& t) noexcept {
    return static_cast<T&&>(t);
}

// 完美转发与可变参数模板
template<typename... Args>
void logAndCall(Args&&... args) {
    // 使用forward完美转发每个参数
    auto print = [](auto&&... params) {
        ((cout << params << " "), ...);
        cout << endl;
    };
    print(forward<Args>(args)...);
}

int main() {
    cout << "========== forward实现原理 ==========\n" << endl;
    
    cout << "forward的工作原理：\n";
    cout << "  1. 通过模板参数T推导值类别\n";
    cout << "  2. 如果T是string&，forward返回string&\n";
    cout << "  3. 如果T是string&&，forward返回string&&\n";
    cout << "  4. 引用折叠规则确保正确性\n";
    
    cout << "\n引用折叠规则：" << endl;
    cout << "  T& &   -> T&" << endl;
    cout << "  T& &&  -> T&" << endl;
    cout << "  T&& &  -> T&" << endl;
    cout << "  T&& && -> T&&" << endl;
    
    cout << "\n完美转发示例：" << endl;
    logAndCall("C++", "现代", "特性");
    
    return 0;
}
```

### 5.3 完美转发的实际应用

```cpp
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include <utility>
using namespace std;

// 使用完美转发实现工厂函数
template<typename T, typename... Args>
unique_ptr<T> makeUnique(Args&&... args) {
    return unique_ptr<T>(new T(forward<Args>(args)...));
}

// 使用完美转发的包装器
class Widget {
private:
    string name;
    vector<int> data;
    
public:
    Widget(const string& n, const vector<int>& d) : name(n), data(d) {
        cout << "Widget拷贝构造：" << name << endl;
    }
    
    Widget(string&& n, vector<int>&& d) : name(move(n)), data(move(d)) {
        cout << "Widget移动构造：" << name << endl;
    }
    
    void display() const {
        cout << "Widget[" << name << "] data size=" << data.size() << endl;
    }
};

// 使用完美转发创建Widget
template<typename Str, typename Vec>
Widget createWidget(Str&& name, Vec&& data) {
    return Widget(forward<Str>(name), forward<Vec>(data));
}

int main() {
    cout << "========== 完美转发实际应用 ==========\n" << endl;
    
    // 使用工厂函数
    auto ptr = makeUnique<int>(42);
    cout << "makeUnique<int>(42) = " << *ptr << endl;
    
    // 使用完美转发的包装器
    cout << "\n使用左值参数：" << endl;
    string name = "MyWidget";
    vector<int> data = {1, 2, 3, 4, 5};
    Widget w1 = createWidget(name, data);  // 拷贝
    
    cout << "\n使用右值参数：" << endl;
    Widget w2 = createWidget(string("TempWidget"), vector<int>{10, 20, 30});  // 移动
    
    w1.display();
    w2.display();
    
    return 0;
}
```

## 六、总结

移动语义和右值引用是C++11中最重要的特性之一，它们从根本上改变了C++处理资源的方式。

### 核心知识点

1. **左值与右值**：左值可以取地址，右值不能。这是理解移动语义的基础。
2. **右值引用**：使用`&&`声明，绑定到右值。允许安全地"窃取"临时对象的资源。
3. **移动构造函数**：通过"窃取"资源避免深拷贝，大幅提升性能。
4. **移动赋值运算符**：释放自身资源后窃取源对象的资源。
5. **std::move**：将左值转换为右值引用，本质上是类型转换。
6. **std::forward**：实现完美转发，保持参数的值类别。

### 性能优势

移动语义的核心价值在于性能优化。对于管理堆内存的类（如vector、string），移动操作比拷贝操作快得多，因为移动只需要复制指针，不需要复制底层数据。

### 最佳实践

- 为管理资源的类实现移动构造函数和移动赋值运算符
- 移动操作应标记为`noexcept`
- 移动后的对象应处于有效但未指定的状态
- 使用`std::move`明确表达所有权转移的意图
- 使用`std::forward`实现完美转发
- 理解"右值引用本身是左值"这一关键概念

移动语义不仅提升了性能，更重要的是使C++的资源管理更加安全和清晰。结合智能指针，现代C++已经能够实现完全自动化的资源管理。
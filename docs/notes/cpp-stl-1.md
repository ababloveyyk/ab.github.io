---
title: C++STL标准模板库Ⅰ——容器概览与vector
date: 2026-07-26
tags:
  - C++
  - STL
  - vector
  - 容器
categories:
  - C++
---

## 一、STL概述

STL（Standard Template Library，标准模板库）是C++标准库的核心组成部分，它提供了一套通用的数据结构和算法。STL的设计理念是"泛型编程"（Generic Programming），通过模板将数据结构和算法分离，使它们可以独立地应用于不同的数据类型。

### 1.1 STL六大组件

STL由六大组件构成，它们相互配合，构成了一个完整的泛型编程框架：

1. **容器（Containers）**：存储数据的类模板，如vector、list、map等
2. **算法（Algorithms）**：操作容器中数据的函数模板，如sort、find、for_each等
3. **迭代器（Iterators）**：连接容器和算法的桥梁，提供统一的遍历接口
4. **函数对象（Function Objects）**：重载了operator()的类，可以像函数一样调用
5. **适配器（Adapters）**：修改容器、迭代器或函数对象接口的组件
6. **分配器（Allocators）**：管理内存分配和释放的组件

### 1.2 容器分类

STL容器主要分为三大类：

**顺序容器（Sequence Containers）**：
- `vector`：动态数组，支持快速随机访问
- `deque`：双端队列，支持快速头尾插入删除
- `list`：双向链表，支持快速任意位置插入删除
- `forward_list`：单向链表（C++11）
- `array`：固定大小数组（C++11）

**关联容器（Associative Containers）**：
- `set`：有序集合，元素唯一
- `multiset`：有序集合，元素可重复
- `map`：有序键值对，键唯一
- `multimap`：有序键值对，键可重复

**无序关联容器（Unordered Associative Containers）**（C++11）：
- `unordered_set`：哈希集合
- `unordered_multiset`：哈希多集合
- `unordered_map`：哈希映射
- `unordered_multimap`：哈希多映射

**容器适配器（Container Adapters）**：
- `stack`：栈
- `queue`：队列
- `priority_queue`：优先队列

### 1.3 容器选择指南

```
需要快速随机访问？ → vector/deque
需要频繁在中间插入删除？ → list
需要按键快速查找？ → map/unordered_map
需要快速头尾操作？ → deque
需要固定大小？ → array
需要LIFO？ → stack
需要FIFO？ → queue
需要按优先级？ → priority_queue
```

## 二、vector详解

### 2.1 vector的基本概念

vector是C++中最常用的容器，它封装了动态数组。vector的数据在内存中是连续存储的，这使得它支持高效的随机访问（O(1)时间复杂度），但在中间插入或删除元素的效率较低（O(n)时间复杂度）。

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // 创建vector的多种方式
    vector<int> v1;                          // 空vector
    vector<int> v2(5);                       // 5个元素，默认值为0
    vector<int> v3(5, 10);                   // 5个元素，每个值为10
    vector<int> v4 = {1, 2, 3, 4, 5};       // 初始化列表（C++11）
    vector<int> v5(v4);                      // 拷贝构造
    vector<int> v6(v4.begin(), v4.end());    // 迭代器范围构造
    
    cout << "v2: ";
    for (int x : v2) cout << x << " ";
    cout << endl;
    
    cout << "v3: ";
    for (int x : v3) cout << x << " ";
    cout << endl;
    
    cout << "v4: ";
    for (int x : v4) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 2.2 vector的赋值操作

```cpp
#include <iostream>
#include <vector>
using namespace std;

template<typename T>
void printVector(const vector<T>& v, const string& name) {
    cout << name << " = {";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << ", ";
        cout << v[i];
    }
    cout << "}" << endl;
}

int main() {
    vector<int> v1;
    
    // assign：分配并赋值
    v1.assign(5, 100);  // 5个100
    printVector(v1, "v1");
    
    // assign：从迭代器范围赋值
    vector<int> v2;
    v2.assign(v1.begin(), v1.end());
    printVector(v2, "v2");
    
    // 使用=运算符
    vector<int> v3;
    v3 = v1;
    printVector(v3, "v3");
    
    // 使用初始化列表赋值
    vector<int> v4;
    v4 = {10, 20, 30, 40, 50};
    printVector(v4, "v4");
    
    // swap交换
    cout << "\n交换前：" << endl;
    printVector(v1, "v1");
    printVector(v4, "v4");
    v1.swap(v4);
    cout << "交换后：" << endl;
    printVector(v1, "v1");
    printVector(v4, "v4");
    
    return 0;
}
```

### 2.3 vector的容量操作

vector的容量管理是其核心特性之一，理解容量与大小的区别至关重要：

```cpp
#include <iostream>
#include <vector>
using namespace std;

void printCapacityInfo(const vector<int>& v) {
    cout << "size = " << v.size()           // 当前元素个数
         << ", capacity = " << v.capacity()  // 当前分配的内存能容纳的元素个数
         << ", max_size = " << v.max_size()  // 理论上能容纳的最大元素个数
         << endl;
}

int main() {
    vector<int> v;
    cout << "初始状态：" << endl;
    printCapacityInfo(v);
    cout << "是否为空：" << (v.empty() ? "是" : "否") << endl;
    
    // 预留空间
    cout << "\nreserve(10)：" << endl;
    v.reserve(10);
    printCapacityInfo(v);
    // size仍然是0，但capacity至少是10
    
    // 添加元素观察容量增长
    cout << "\n逐步添加元素，观察容量变化：" << endl;
    int prevCapacity = v.capacity();
    for (int i = 1; i <= 20; i++) {
        v.push_back(i);
        if (v.capacity() != prevCapacity) {
            cout << "添加第" << i << "个元素时，容量从" 
                 << prevCapacity << " -> " << v.capacity() << endl;
            prevCapacity = v.capacity();
        }
    }
    printCapacityInfo(v);
    
    // resize：改变大小
    cout << "\nresize(5)：" << endl;
    v.resize(5);
    printCapacityInfo(v);
    cout << "元素：";
    for (int x : v) cout << x << " ";
    cout << endl;
    
    // resize扩大（用指定值填充）
    cout << "\nresize(8, 42)：" << endl;
    v.resize(8, 42);
    printCapacityInfo(v);
    cout << "元素：";
    for (int x : v) cout << x << " ";
    cout << endl;
    
    // shrink_to_fit：收缩容量到实际大小
    cout << "\nshrink_to_fit：" << endl;
    v.shrink_to_fit();
    printCapacityInfo(v);
    
    // clear：清空元素
    cout << "\nclear：" << endl;
    v.clear();
    printCapacityInfo(v);
    // 注意：clear不释放内存，capacity保持不变
    
    return 0;
}
```

### 2.4 vector的内存增长机制

vector的内存增长机制在不同的编译器中有所不同。通常采用倍增策略：

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    
    cout << "========== vector内存增长机制分析 ==========\n" << endl;
    cout << "初始容量：" << v.capacity() << endl;
    
    int prevCapacity = v.capacity();
    for (int i = 1; i <= 50; i++) {
        v.push_back(i);
        if (v.capacity() != prevCapacity) {
            cout << "push_back第" << i << "个元素，容量：" 
                 << prevCapacity << " -> " << v.capacity();
            cout << " （增长因子：" << (double)v.capacity() / prevCapacity << "）" << endl;
            prevCapacity = v.capacity();
        }
    }
    
    cout << "\n最终 size = " << v.size() << ", capacity = " << v.capacity() << endl;
    cout << "浪费的空间 = " << (v.capacity() - v.size()) * sizeof(int) << " 字节" << endl;
    
    return 0;
}
```

### 2.5 vector的访问操作

```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30, 40, 50};
    
    // 使用[]运算符（不检查边界）
    cout << "v[0] = " << v[0] << endl;
    cout << "v[2] = " << v[2] << endl;
    // v[100] = 999;  // 未定义行为！不会抛出异常
    
    // 使用at()方法（检查边界，越界抛出out_of_range异常）
    cout << "v.at(0) = " << v.at(0) << endl;
    cout << "v.at(4) = " << v.at(4) << endl;
    try {
        cout << "v.at(100) = " << v.at(100) << endl;
    } catch (const out_of_range& e) {
        cout << "捕获异常：" << e.what() << endl;
    }
    
    // front()和back()：访问首尾元素
    cout << "\nfront() = " << v.front() << endl;
    cout << "back() = " << v.back() << endl;
    
    // 修改元素
    v.front() = 100;
    v.back() = 500;
    cout << "修改后 front() = " << v.front() << endl;
    cout << "修改后 back() = " << v.back() << endl;
    
    // data()：获取底层数组指针
    int* rawPtr = v.data();
    cout << "\n通过data()指针访问：" << endl;
    for (size_t i = 0; i < v.size(); i++) {
        cout << "v[" << i << "] = " << rawPtr[i] << endl;
    }
    
    // 修改原始指针的值
    rawPtr[1] = 200;
    cout << "修改后 v[1] = " << v[1] << endl;
    
    return 0;
}
```

### 2.6 vector的插入与删除

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

template<typename T>
void print(const vector<T>& v, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << ", ";
        cout << v[i];
    }
    cout << "} (size=" << v.size() << ", capacity=" << v.capacity() << ")" << endl;
}

int main() {
    vector<int> v = {1, 2, 3, 4, 5};
    print(v, "初始");
    
    // push_back：尾部插入
    v.push_back(6);
    v.push_back(7);
    print(v, "push_back 6,7");
    
    // pop_back：尾部删除
    v.pop_back();
    print(v, "pop_back");
    
    // insert：在指定位置插入
    v.insert(v.begin() + 2, 99);  // 在索引2处插入99
    print(v, "insert(索引2, 99)");
    
    // insert：插入多个相同元素
    v.insert(v.begin(), 3, 0);  // 在开头插入3个0
    print(v, "insert(开头, 3个0)");
    
    // insert：插入另一个容器的范围
    vector<int> extra = {100, 200, 300};
    v.insert(v.end(), extra.begin(), extra.end());
    print(v, "insert(末尾, extra)");
    
    // erase：删除指定位置元素
    v.erase(v.begin() + 3);  // 删除索引3
    print(v, "erase(索引3)");
    
    // erase：删除一个范围
    v.erase(v.begin() + 1, v.begin() + 4);  // 删除[1, 4)
    print(v, "erase(范围[1,4))");
    
    // emplace：原地构造（C++11）
    v.emplace(v.begin(), 500);  // 在开头构造500
    print(v, "emplace(开头, 500)");
    
    // emplace_back：尾部原地构造
    v.emplace_back(600);
    print(v, "emplace_back(600)");
    
    return 0;
}
```

### 2.7 vector与数组对比

```cpp
#include <iostream>
#include <vector>
#include <chrono>
#include <algorithm>
using namespace std;
using namespace std::chrono;

// 使用原生数组
void testRawArray(int size) {
    int* arr = new int[size];
    for (int i = 0; i < size; i++) {
        arr[i] = i;
    }
    // 排序
    sort(arr, arr + size);
    delete[] arr;
}

// 使用vector
void testVector(int size) {
    vector<int> v(size);
    for (int i = 0; i < size; i++) {
        v[i] = i;
    }
    sort(v.begin(), v.end());
}

int main() {
    const int SIZE = 1000000;
    
    cout << "========== 原生数组 vs vector 性能对比 ==========\n" << endl;
    cout << "测试数据量：" << SIZE << " 个int" << endl;
    cout << "内存占用：" << SIZE * sizeof(int) / 1024.0 / 1024.0 << " MB" << endl;
    
    // 测试原生数组
    auto start = high_resolution_clock::now();
    testRawArray(SIZE);
    auto end = high_resolution_clock::now();
    auto rawDuration = duration_cast<milliseconds>(end - start).count();
    cout << "\n原生数组耗时：" << rawDuration << " ms" << endl;
    
    // 测试vector
    start = high_resolution_clock::now();
    testVector(SIZE);
    end = high_resolution_clock::now();
    auto vecDuration = duration_cast<milliseconds>(end - start).count();
    cout << "vector耗时：" << vecDuration << " ms" << endl;
    
    cout << "\n========== 功能对比 ==========\n" << endl;
    cout << "原生数组：" << endl;
    cout << "  - 大小固定（编译时确定或动态分配）" << endl;
    cout << "  - 需要手动管理内存" << endl;
    cout << "  - 不提供边界检查" << endl;
    cout << "  - 不提供size()方法" << endl;
    cout << "  - 性能最优（无额外开销）" << endl;
    
    cout << "\nvector：" << endl;
    cout << "  - 大小可动态调整" << endl;
    cout << "  - 自动管理内存（RAII）" << endl;
    cout << "  - at()提供边界检查" << endl;
    cout << "  - 提供丰富的成员函数" << endl;
    cout << "  - 与STL算法无缝集成" << endl;
    cout << "  - 性能接近原生数组（随机访问）" << endl;
    
    return 0;
}
```

### 2.8 vector作为函数参数和返回值

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 按值传递：会拷贝整个vector（低效！）
void processByValue(vector<int> v) {
    v.push_back(999);
    cout << "processByValue内部：size=" << v.size() << endl;
}

// 按引用传递：不会拷贝（高效）
void processByReference(vector<int>& v) {
    v.push_back(888);
    cout << "processByReference内部：size=" << v.size() << endl;
}

// 按const引用传递：不会拷贝，且不能修改
void processByConstRef(const vector<int>& v) {
    cout << "processByConstRef：size=" << v.size() << endl;
    // v.push_back(777);  // 错误！const引用不能修改
}

// 返回vector（C++11后高效，使用移动语义）
vector<int> createVector() {
    vector<int> v = {1, 2, 3, 4, 5};
    cout << "createVector内部：v.data()=" << v.data() << endl;
    return v;  // 移动语义，不会拷贝
}

// 使用输出参数
void fillVector(vector<int>& out, int n) {
    out.clear();
    out.reserve(n);
    for (int i = 0; i < n; i++) {
        out.push_back(i * 10);
    }
}

int main() {
    vector<int> original = {10, 20, 30};
    
    cout << "========== 参数传递方式对比 ==========\n" << endl;
    
    cout << "原始vector：size=" << original.size() << endl;
    
    processByValue(original);
    cout << "按值传递后（原始未变）：size=" << original.size() << endl;
    
    processByReference(original);
    cout << "按引用传递后（原始已变）：size=" << original.size() << endl;
    
    processByConstRef(original);
    
    cout << "\n========== 返回vector ==========\n" << endl;
    vector<int> result = createVector();
    cout << "返回的vector：result.data()=" << result.data() << endl;
    // 在现代C++中，result.data()和createVector中v.data()通常是相同的地址
    
    cout << "\n========== 输出参数 ==========\n" << endl;
    vector<int> filled;
    fillVector(filled, 5);
    cout << "填充后的vector：";
    for (int x : filled) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 2.9 vector的二维使用

```cpp
#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

int main() {
    cout << "========== 二维vector ==========\n" << endl;
    
    // 创建3x4的二维vector
    int rows = 3, cols = 4;
    vector<vector<int>> matrix(rows, vector<int>(cols, 0));
    
    // 填充数据
    int value = 1;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            matrix[i][j] = value++;
        }
    }
    
    // 打印矩阵
    cout << "矩阵（3x4）：" << endl;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            cout << setw(4) << matrix[i][j];
        }
        cout << endl;
    }
    
    // 动态添加行
    cout << "\n添加一行：" << endl;
    matrix.push_back({13, 14, 15, 16});
    for (const auto& row : matrix) {
        for (int x : row) {
            cout << setw(4) << x;
        }
        cout << endl;
    }
    
    // 锯齿状数组（每行长度不同）
    cout << "\n锯齿状数组：" << endl;
    vector<vector<int>> jagged = {
        {1, 2, 3},
        {4, 5},
        {6, 7, 8, 9},
        {10}
    };
    for (size_t i = 0; i < jagged.size(); i++) {
        cout << "行" << i << " (size=" << jagged[i].size() << "): ";
        for (int x : jagged[i]) {
            cout << x << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

### 2.10 vector的常见陷阱与最佳实践

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "========== vector常见陷阱与最佳实践 ==========\n" << endl;
    
    // 陷阱1：迭代器失效
    cout << "陷阱1：迭代器失效" << endl;
    vector<int> v = {1, 2, 3, 4, 5};
    auto it = v.begin() + 2;  // 指向3
    cout << "迭代器指向：" << *it << endl;
    
    v.push_back(6);  // 可能导致重新分配，迭代器失效
    // cout << *it << endl;  // 危险！迭代器可能失效
    
    // 正确做法：push_back后重新获取迭代器
    it = v.begin() + 2;
    cout << "重新获取后指向：" << *it << endl;
    
    // 陷阱2：reserve后不能直接使用[]
    cout << "\n陷阱2：reserve后不能直接使用[]" << endl;
    vector<int> v2;
    v2.reserve(10);
    // v2[0] = 42;  // 错误！size仍然是0，没有合法的元素
    // 正确做法：使用resize或push_back
    v2.resize(10);  // 现在size=10，可以安全使用[]
    v2[0] = 42;
    cout << "v2[0] = " << v2[0] << endl;
    
    // 陷阱3：在循环中删除元素
    cout << "\n陷阱3：在循环中删除元素" << endl;
    vector<int> v3 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    cout << "原始：";
    for (int x : v3) cout << x << " ";
    cout << endl;
    
    // 错误方式
    // for (auto it = v3.begin(); it != v3.end(); ++it) {
    //     if (*it % 2 == 0) {
    //         v3.erase(it);  // it失效！
    //     }
    // }
    
    // 正确方式：使用erase的返回值
    for (auto it2 = v3.begin(); it2 != v3.end(); ) {
        if (*it2 % 2 == 0) {
            it2 = v3.erase(it2);  // erase返回下一个有效迭代器
        } else {
            ++it2;
        }
    }
    cout << "删除偶数后：";
    for (int x : v3) cout << x << " ";
    cout << endl;
    
    // 最佳实践1：使用emplace_back代替push_back
    cout << "\n最佳实践：使用emplace_back" << endl;
    vector<pair<int, string>> pairs;
    pairs.emplace_back(1, "one");  // 直接构造，高效
    pairs.emplace_back(2, "two");
    for (const auto& p : pairs) {
        cout << "(" << p.first << ", " << p.second << ") ";
    }
    cout << endl;
    
    // 最佳实践2：预分配空间
    cout << "\n最佳实践：预分配空间" << endl;
    vector<int> v4;
    v4.reserve(1000);  // 预分配，避免多次重新分配
    for (int i = 0; i < 1000; i++) {
        v4.push_back(i);
    }
    cout << "添加1000个元素后：size=" << v4.size() 
         << ", capacity=" << v4.capacity() << endl;
    
    return 0;
}
```

## 三、总结

vector是C++ STL中最基础、最常用的容器，它封装了动态数组，提供了安全、便捷的接口。

### 核心知识点

1. **底层实现**：连续内存空间，支持O(1)随机访问
2. **内存增长**：通常采用倍增策略（如1.5倍或2倍），通过reserve预分配
3. **容量管理**：size()返回元素个数，capacity()返回分配的内存大小
4. **插入删除**：尾部操作O(1)，中间操作O(n)
5. **访问方式**：[]不检查边界，at()检查边界，front()/back()访问首尾
6. **与数组对比**：vector更安全，功能更丰富，性能接近

### 最佳实践

- 使用reserve预分配空间，避免频繁重新分配
- 优先使用emplace_back代替push_back
- 使用at()进行安全访问，[]用于性能敏感场景
- 注意操作可能导致的迭代器失效
- 使用const引用传递vector，避免不必要的拷贝
- 在循环中删除元素时，使用erase返回的迭代器

vector是学习STL的起点，掌握了vector之后，其他容器的学习会变得更加容易，因为它们在接口设计上具有高度的一致性。
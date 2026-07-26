---
title: C++STL标准模板库Ⅱ——list与deque
date: 2026-07-26
tags:
  - C++
  - STL
  - list
  - deque
  - 容器
categories:
  - C++
---

## 一、list概述

list是STL中的双向链表容器。与vector不同，list的元素在内存中不是连续存储的，而是通过指针相互链接。这使得list在任意位置进行插入和删除操作都非常高效（O(1)时间复杂度），但不支持随机访问。

### 1.1 list的基本概念

list的底层实现是一个双向链表，每个节点包含数据、指向前一个节点的指针和指向后一个节点的指针。list的迭代器是双向迭代器，支持++和--操作，但不支持+和-操作。

```cpp
#include <iostream>
#include <list>
#include <algorithm>
using namespace std;

template<typename T>
void printList(const list<T>& lst, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        if (it != lst.begin()) cout << ", ";
        cout << *it;
    }
    cout << "} (size=" << lst.size() << ")" << endl;
}

int main() {
    // 创建list的多种方式
    list<int> l1;                              // 空list
    list<int> l2(5, 10);                       // 5个10
    list<int> l3 = {1, 2, 3, 4, 5};            // 初始化列表
    list<int> l4(l3);                           // 拷贝构造
    list<int> l5(l3.begin(), l3.end());         // 迭代器范围
    
    printList(l2, "l2");
    printList(l3, "l3");
    printList(l4, "l4");
    printList(l5, "l5");
    
    return 0;
}
```

### 1.2 list的插入与删除操作

list的插入和删除操作是它最大的优势，所有位置的操作都是O(1)：

```cpp
#include <iostream>
#include <list>
#include <string>
using namespace std;

template<typename T>
void print(const list<T>& lst, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        if (it != lst.begin()) cout << ", ";
        cout << *it;
    }
    cout << "}" << endl;
}

int main() {
    list<int> lst = {1, 2, 3, 4, 5};
    print(lst, "初始");
    
    // push_front/push_back
    lst.push_front(0);
    lst.push_back(6);
    print(lst, "push_front(0), push_back(6)");
    
    // pop_front/pop_back
    lst.pop_front();
    lst.pop_back();
    print(lst, "pop_front(), pop_back()");
    
    // insert：在指定位置插入
    auto it = lst.begin();
    advance(it, 2);  // 移动到第3个位置（注意：不能使用it+2）
    lst.insert(it, 99);
    print(lst, "insert(位置3, 99)");
    
    // insert：插入多个相同元素
    lst.insert(lst.begin(), 3, 0);
    print(lst, "insert(开头, 3个0)");
    
    // insert：插入另一个list的范围
    list<int> extra = {100, 200};
    lst.insert(lst.end(), extra.begin(), extra.end());
    print(lst, "insert(末尾, extra)");
    
    // erase：删除指定位置
    it = lst.begin();
    advance(it, 3);
    it = lst.erase(it);  // erase返回下一个有效迭代器
    print(lst, "erase(位置3)");
    
    // erase：删除范围
    auto it2 = lst.begin();
    advance(it2, 2);
    lst.erase(lst.begin(), it2);  // 删除[begin, it2)
    print(lst, "erase(范围)");
    
    // remove：删除所有等于指定值的元素
    lst.push_back(99);
    lst.push_back(99);
    lst.remove(99);  // 删除所有99
    print(lst, "remove(99)");
    
    // remove_if：按条件删除
    lst.remove_if([](int x) { return x % 2 == 0; });  // 删除所有偶数
    print(lst, "remove_if(偶数)");
    
    return 0;
}
```

### 1.3 list的排序与合并

list提供了自己的sort()和merge()成员函数，因为通用算法的sort需要随机访问迭代器，而list只有双向迭代器：

```cpp
#include <iostream>
#include <list>
#include <string>
using namespace std;

template<typename T>
void print(const list<T>& lst, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        if (it != lst.begin()) cout << ", ";
        cout << *it;
    }
    cout << "}" << endl;
}

int main() {
    cout << "========== list排序 ==========\n" << endl;
    
    list<int> lst = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    print(lst, "原始");
    
    // sort()：默认升序
    lst.sort();
    print(lst, "sort()升序");
    
    // sort()：自定义排序规则（降序）
    lst.sort(greater<int>());
    print(lst, "sort(降序)");
    
    // sort()：使用lambda
    lst.sort([](int a, int b) { return a > b; });
    print(lst, "sort(lambda降序)");
    
    cout << "\n========== list合并 ==========\n" << endl;
    
    list<int> list1 = {1, 3, 5, 7, 9};
    list<int> list2 = {2, 4, 6, 8, 10};
    
    print(list1, "list1");
    print(list2, "list2");
    
    // merge：合并两个有序list（合并后list2为空）
    list1.merge(list2);
    print(list1, "merge后list1");
    print(list2, "merge后list2（空）");
    
    cout << "\n========== list反转 ==========\n" << endl;
    
    list<int> lst2 = {1, 2, 3, 4, 5};
    print(lst2, "原始");
    lst2.reverse();
    print(lst2, "reverse()");
    
    cout << "\n========== list去重 ==========\n" << endl;
    
    list<int> lst3 = {1, 2, 2, 3, 3, 3, 4, 4, 5};
    print(lst3, "原始");
    lst3.unique();  // 删除连续重复的元素
    print(lst3, "unique()");
    
    // 注意：unique只删除连续重复的，如果要删除所有重复，需要先排序
    list<int> lst4 = {3, 1, 2, 1, 3, 2, 1};
    print(lst4, "原始（乱序）");
    lst4.sort();
    lst4.unique();
    print(lst4, "排序+unique()");
    
    return 0;
}
```

### 1.4 list的splice操作

splice是list特有的操作，可以将一个list中的元素转移到另一个list的指定位置，时间复杂度O(1)：

```cpp
#include <iostream>
#include <list>
using namespace std;

template<typename T>
void print(const list<T>& lst, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        if (it != lst.begin()) cout << ", ";
        cout << *it;
    }
    cout << "}" << endl;
}

int main() {
    cout << "========== splice操作演示 ==========\n" << endl;
    
    list<int> list1 = {1, 2, 3};
    list<int> list2 = {10, 20, 30};
    
    print(list1, "list1");
    print(list2, "list2");
    
    // splice：将list2的全部元素移到list1的末尾
    cout << "\n--- splice(末尾, list2全部) ---" << endl;
    list1.splice(list1.end(), list2);
    print(list1, "list1");
    print(list2, "list2（空）");
    
    // 重新填充
    list2 = {100, 200, 300, 400, 500};
    print(list1, "list1");
    print(list2, "list2");
    
    // splice：将list2的单个元素移到list1的开头
    auto it2 = list2.begin();
    advance(it2, 2);  // 指向300
    cout << "\n--- splice(开头, list2的单个元素) ---" << endl;
    list1.splice(list1.begin(), list2, it2);  // 移动list2的第3个元素
    print(list1, "list1");
    print(list2, "list2");
    
    // splice：将list2的一个范围移到list1
    auto it2_start = list2.begin();
    auto it2_end = list2.begin();
    advance(it2_end, 2);  // 前两个元素
    cout << "\n--- splice(末尾, list2范围) ---" << endl;
    list1.splice(list1.end(), list2, it2_start, it2_end);
    print(list1, "list1");
    print(list2, "list2");
    
    return 0;
}
```

### 1.5 list与自定义类型

```cpp
#include <iostream>
#include <list>
#include <string>
#include <algorithm>
using namespace std;

class Student {
private:
    string name;
    int age;
    double score;
    
public:
    Student(const string& n, int a, double s)
        : name(n), age(a), score(s) {}
    
    string getName() const { return name; }
    int getAge() const { return age; }
    double getScore() const { return score; }
    
    // 用于排序
    bool operator<(const Student& other) const {
        return score < other.score;
    }
    
    void display() const {
        cout << name << " (年龄:" << age << ", 成绩:" << score << ")";
    }
};

int main() {
    cout << "========== list存储自定义类型 ==========\n" << endl;
    
    list<Student> students;
    students.emplace_back("张三", 20, 85.5);
    students.emplace_back("李四", 21, 92.0);
    students.emplace_back("王五", 19, 78.5);
    students.emplace_back("赵六", 22, 88.0);
    students.emplace_back("孙七", 20, 95.5);
    
    cout << "所有学生：" << endl;
    for (const auto& s : students) {
        cout << "  ";
        s.display();
        cout << endl;
    }
    
    // 按成绩排序（使用operator<）
    students.sort();
    cout << "\n按成绩排序后：" << endl;
    for (const auto& s : students) {
        cout << "  ";
        s.display();
        cout << endl;
    }
    
    // 按年龄排序（使用lambda）
    students.sort([](const Student& a, const Student& b) {
        return a.getAge() < b.getAge();
    });
    cout << "\n按年龄排序后：" << endl;
    for (const auto& s : students) {
        cout << "  ";
        s.display();
        cout << endl;
    }
    
    // 删除成绩低于80的学生
    students.remove_if([](const Student& s) {
        return s.getScore() < 80;
    });
    cout << "\n删除成绩<80的学生后：" << endl;
    for (const auto& s : students) {
        cout << "  ";
        s.display();
        cout << endl;
    }
    
    return 0;
}
```

## 二、deque详解

### 2.1 deque的基本概念

deque（Double-Ended Queue，双端队列）是STL中一种特殊的顺序容器。它结合了vector和list的部分优点：支持O(1)的随机访问，同时支持O(1)的头尾插入删除。deque的底层实现是分段连续内存（由多个固定大小的缓冲区组成），通过一个中控器（map）来管理这些缓冲区。

```cpp
#include <iostream>
#include <deque>
#include <algorithm>
using namespace std;

template<typename T>
void printDeque(const deque<T>& dq, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (size_t i = 0; i < dq.size(); i++) {
        if (i > 0) cout << ", ";
        cout << dq[i];
    }
    cout << "} (size=" << dq.size() << ")" << endl;
}

int main() {
    // 创建deque
    deque<int> d1;                              // 空deque
    deque<int> d2(5, 10);                       // 5个10
    deque<int> d3 = {1, 2, 3, 4, 5};            // 初始化列表
    deque<int> d4(d3);                           // 拷贝构造
    
    printDeque(d2, "d2");
    printDeque(d3, "d3");
    
    // deque支持[]和at()随机访问
    cout << "d3[2] = " << d3[2] << endl;
    cout << "d3.at(2) = " << d3.at(2) << endl;
    
    return 0;
}
```

### 2.2 deque的头尾操作

deque最大的特点是支持高效的头尾插入和删除：

```cpp
#include <iostream>
#include <deque>
using namespace std;

template<typename T>
void print(const deque<T>& dq, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (size_t i = 0; i < dq.size(); i++) {
        if (i > 0) cout << ", ";
        cout << dq[i];
    }
    cout << "}" << endl;
}

int main() {
    deque<int> dq;
    
    cout << "========== deque头尾操作 ==========\n" << endl;
    
    // push_back：尾部插入
    dq.push_back(10);
    dq.push_back(20);
    dq.push_back(30);
    print(dq, "push_back 10,20,30");
    
    // push_front：头部插入
    dq.push_front(5);
    dq.push_front(1);
    print(dq, "push_front 5,1");
    
    // pop_back：尾部删除
    dq.pop_back();
    print(dq, "pop_back");
    
    // pop_front：头部删除
    dq.pop_front();
    print(dq, "pop_front");
    
    // front()和back()
    cout << "\nfront() = " << dq.front() << endl;
    cout << "back() = " << dq.back() << endl;
    
    // 修改首尾元素
    dq.front() = 100;
    dq.back() = 200;
    print(dq, "修改首尾后");
    
    // insert：在任意位置插入
    dq.insert(dq.begin() + 1, 50);
    print(dq, "insert(位置1, 50)");
    
    // erase：删除任意位置
    dq.erase(dq.begin() + 2);
    print(dq, "erase(位置2)");
    
    return 0;
}
```

### 2.3 deque的底层实现原理

```cpp
#include <iostream>
#include <deque>
#include <vector>
using namespace std;

// 模拟deque的底层实现
template<typename T>
class SimpleDeque {
private:
    static const size_t CHUNK_SIZE = 4;  // 每个缓冲区大小
    vector<T*> chunks;  // 中控器：存储指向各缓冲区的指针
    size_t startChunk;  // 起始缓冲区索引
    size_t startOffset; // 起始缓冲区内的偏移
    size_t elementCount; // 元素总数
    
    T** getChunkPointer(size_t& index) {
        // 计算元素所在的缓冲区
        size_t totalOffset = startOffset + index;
        size_t chunkIndex = startChunk + totalOffset / CHUNK_SIZE;
        if (chunkIndex >= chunks.size()) {
            chunkIndex -= chunks.size();
        }
        index = totalOffset % CHUNK_SIZE;
        return &chunks[chunkIndex];
    }
    
public:
    SimpleDeque() : startChunk(0), startOffset(0), elementCount(0) {
        // 初始分配一个缓冲区
        chunks.push_back(new T[CHUNK_SIZE]);
    }
    
    ~SimpleDeque() {
        for (auto* chunk : chunks) {
            delete[] chunk;
        }
    }
    
    void push_back(const T& value) {
        if (elementCount == 0) {
            chunks[startChunk][startOffset] = value;
            elementCount = 1;
            return;
        }
        // 简化的push_back实现
        size_t endOffset = (startOffset + elementCount) % CHUNK_SIZE;
        size_t endChunk = startChunk + (startOffset + elementCount) / CHUNK_SIZE;
        if (endChunk >= chunks.size()) {
            chunks.push_back(new T[CHUNK_SIZE]);
        }
        chunks[endChunk][endOffset] = value;
        elementCount++;
    }
    
    T& operator[](size_t index) {
        size_t idx = index;
        size_t chunkIdx = startChunk + (startOffset + idx) / CHUNK_SIZE;
        size_t offset = (startOffset + idx) % CHUNK_SIZE;
        return chunks[chunkIdx][offset];
    }
    
    size_t size() const { return elementCount; }
    
    void display() const {
        cout << "SimpleDeque: {";
        for (size_t i = 0; i < elementCount; i++) {
            if (i > 0) cout << ", ";
            size_t idx = i;
            size_t chunkIdx = startChunk + (startOffset + idx) / CHUNK_SIZE;
            size_t offset = (startOffset + idx) % CHUNK_SIZE;
            cout << chunks[chunkIdx][offset];
        }
        cout << "} (size=" << elementCount << ")" << endl;
    }
};

int main() {
    cout << "========== deque底层实现原理 ==========\n" << endl;
    cout << "deque使用分段连续内存：" << endl;
    cout << "  - 多个固定大小的缓冲区" << endl;
    cout << "  - 中控器（map）管理这些缓冲区" << endl;
    cout << "  - 支持O(1)头尾插入删除" << endl;
    cout << "  - 支持O(1)随机访问" << endl;
    
    cout << "\n========== SimpleDeque演示 ==========\n" << endl;
    SimpleDeque<int> sd;
    sd.push_back(10);
    sd.push_back(20);
    sd.push_back(30);
    sd.push_back(40);
    sd.push_back(50);
    sd.display();
    
    cout << "sd[0] = " << sd[0] << endl;
    cout << "sd[2] = " << sd[2] << endl;
    cout << "sd[4] = " << sd[4] << endl;
    
    return 0;
}
```

### 2.4 deque的排序

deque支持随机访问，因此可以使用STL的通用sort算法：

```cpp
#include <iostream>
#include <deque>
#include <algorithm>
using namespace std;

template<typename T>
void print(const deque<T>& dq, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (size_t i = 0; i < dq.size(); i++) {
        if (i > 0) cout << ", ";
        cout << dq[i];
    }
    cout << "}" << endl;
}

int main() {
    deque<int> dq = {5, 2, 8, 1, 9, 3, 7, 4, 6, 0};
    print(dq, "原始");
    
    // 使用STL通用sort
    sort(dq.begin(), dq.end());
    print(dq, "sort()升序");
    
    sort(dq.begin(), dq.end(), greater<int>());
    print(dq, "sort(降序)");
    
    // 使用lambda自定义排序
    sort(dq.begin(), dq.end(), [](int a, int b) {
        return abs(a - 5) < abs(b - 5);  // 按离5的距离排序
    });
    print(dq, "sort(按离5的距离)");
    
    // stable_sort：稳定排序
    deque<int> dq2 = {3, 1, 4, 1, 5, 9, 2, 6};
    print(dq2, "dq2原始");
    stable_sort(dq2.begin(), dq2.end());
    print(dq2, "stable_sort");
    
    // partial_sort：部分排序
    deque<int> dq3 = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    print(dq3, "dq3原始");
    partial_sort(dq3.begin(), dq3.begin() + 3, dq3.end());
    print(dq3, "partial_sort(前3个最小)");
    
    return 0;
}
```

## 三、vector、list、deque性能对比

### 3.1 综合性能测试

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <chrono>
#include <algorithm>
#include <random>
using namespace std;
using namespace std::chrono;

template<typename Container>
void testRandomAccess(const string& name) {
    Container c;
    const int N = 1000000;
    for (int i = 0; i < N; i++) {
        c.push_back(i);
    }
    
    auto start = high_resolution_clock::now();
    long long sum = 0;
    for (int i = 0; i < N; i++) {
        // 对于list，使用迭代器模拟随机访问
        auto it = c.begin();
        advance(it, i % N);
        sum += *it;
    }
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();
    cout << "  " << name << " 随机访问: " << duration << " ms (sum=" << sum << ")" << endl;
}

template<typename Container>
void testInsertFront(const string& name) {
    Container c;
    const int N = 100000;
    
    auto start = high_resolution_clock::now();
    for (int i = 0; i < N; i++) {
        c.insert(c.begin(), i);
    }
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();
    cout << "  " << name << " 头部插入" << N << "次: " << duration << " ms" << endl;
}

template<typename Container>
void testInsertBack(const string& name) {
    Container c;
    const int N = 10000000;
    
    auto start = high_resolution_clock::now();
    for (int i = 0; i < N; i++) {
        c.push_back(i);
    }
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();
    cout << "  " << name << " 尾部插入" << N << "次: " << duration << " ms" << endl;
}

template<typename Container>
void testInsertMiddle(const string& name) {
    Container c;
    const int N = 10000;
    for (int i = 0; i < N; i++) {
        c.push_back(i);
    }
    
    auto start = high_resolution_clock::now();
    for (int i = 0; i < N; i++) {
        auto it = c.begin();
        advance(it, c.size() / 2);
        c.insert(it, i);
    }
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();
    cout << "  " << name << " 中间插入" << N << "次: " << duration << " ms" << endl;
}

int main() {
    cout << "========== 容器性能对比 ==========\n" << endl;
    
    cout << "--- 尾部插入性能 ---" << endl;
    testInsertBack<vector<int>>("vector");
    testInsertBack<deque<int>>("deque");
    testInsertBack<list<int>>("list");
    
    cout << "\n--- 头部插入性能 ---" << endl;
    testInsertFront<deque<int>>("deque");
    testInsertFront<list<int>>("list");
    // vector头部插入太慢，跳过
    
    cout << "\n--- 中间插入性能 ---" << endl;
    testInsertMiddle<vector<int>>("vector");
    testInsertMiddle<deque<int>>("deque");
    testInsertMiddle<list<int>>("list");
    
    return 0;
}
```

### 3.2 容器选择指南

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
using namespace std;

int main() {
    cout << "========== 容器选择指南 ==========\n" << endl;
    
    cout << "vector适用场景：" << endl;
    cout << "  - 需要快速随机访问（O(1)）" << endl;
    cout << "  - 主要在尾部添加/删除元素" << endl;
    cout << "  - 需要连续内存（如与C API交互）" << endl;
    cout << "  - 内存占用最小（无额外指针开销）" << endl;
    cout << "  - 适合：数组、矩阵、缓存" << endl;
    
    cout << "\nlist适用场景：" << endl;
    cout << "  - 需要在任意位置频繁插入/删除（O(1)）" << endl;
    cout << "  - 不需要随机访问" << endl;
    cout << "  - 插入/删除操作不会使迭代器失效" << endl;
    cout << "  - 适合：LRU缓存、任务队列、事件列表" << endl;
    
    cout << "\ndeque适用场景：" << endl;
    cout << "  - 需要在头尾频繁插入/删除（O(1)）" << endl;
    cout << "  - 需要随机访问（O(1)）" << endl;
    cout << "  - 不适合在中间频繁插入/删除" << endl;
    cout << "  - 适合：双端队列、滑动窗口、历史记录" << endl;
    
    cout << "\n三者对比表：" << endl;
    cout << "┌──────────┬────────┬──────┬───────┐" << endl;
    cout << "│ 操作     │ vector │ list │ deque │" << endl;
    cout << "├──────────┼────────┼──────┼───────┤" << endl;
    cout << "│ 随机访问 │ O(1)   │ O(n) │ O(1)  │" << endl;
    cout << "│ 尾部插入 │ O(1)   │ O(1) │ O(1)  │" << endl;
    cout << "│ 头部插入 │ O(n)   │ O(1) │ O(1)  │" << endl;
    cout << "│ 中间插入 │ O(n)   │ O(1) │ O(n)  │" << endl;
    cout << "│ 内存连续 │ 是     │ 否   │ 分段  │" << endl;
    cout << "│ 迭代器   │ 随机   │ 双向 │ 随机  │" << endl;
    cout << "└──────────┴────────┴──────┴───────┘" << endl;
    cout << endl;
    cout << "经验法则：默认使用vector，除非有明确理由选择其他容器。" << endl;
    
    return 0;
}
```

## 四、总结

list和deque是STL中两个重要的顺序容器，它们各自有不同的适用场景。

### 核心知识点

**list**：
- 双向链表实现，非连续内存
- 任意位置插入删除O(1)
- 不支持随机访问，迭代器是双向的
- 提供sort()、merge()、splice()等特有操作
- 插入删除不会使迭代器失效（指向被删除元素的迭代器除外）

**deque**：
- 分段连续内存实现
- 支持O(1)随机访问
- 头尾插入删除O(1)
- 中间插入删除O(n)
- 是vector和list的折中方案

### 容器选择原则

1. 默认使用vector
2. 需要频繁头部操作时考虑deque
3. 需要频繁任意位置插入删除时考虑list
4. 需要连续内存接口时只能用vector
5. 需要同时支持随机访问和头尾操作时用deque

理解每个容器的底层实现和性能特征，是高效使用STL的关键。在实际项目中，应该根据具体的使用场景选择最合适的容器，而不是盲目使用某一种。
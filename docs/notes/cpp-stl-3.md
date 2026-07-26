---
title: C++STL标准模板库Ⅲ——关联容器
date: 2026-07-26
tags:
  - C++
  - STL
  - set
  - map
  - 关联容器
categories:
  - C++
---

## 一、关联容器概述

关联容器是STL中基于键值来组织数据的容器。与顺序容器不同，关联容器中的元素是按照特定的排序规则自动排序的（对于有序关联容器），或者基于哈希表组织（对于无序关联容器）。这使得关联容器在查找、插入和删除操作上具有优异的性能。

### 1.1 关联容器分类

**有序关联容器（基于红黑树）**：
- `set`：元素集合，元素唯一且自动排序
- `multiset`：元素集合，元素可重复且自动排序
- `map`：键值对集合，键唯一且自动排序
- `multimap`：键值对集合，键可重复且自动排序

**无序关联容器（基于哈希表，C++11）**：
- `unordered_set`：哈希集合
- `unordered_multiset`：哈希多集合
- `unordered_map`：哈希映射
- `unordered_multimap`：哈希多映射

### 1.2 性能对比

```
操作         有序容器    无序容器
查找         O(log n)    O(1) 平均
插入         O(log n)    O(1) 平均
删除         O(log n)    O(1) 平均
遍历（有序）  O(n) 有序   O(n) 无序
```

## 二、set详解

### 2.1 set的基本操作

set是一个有序的、元素唯一的集合。它基于红黑树实现，插入、删除和查找操作的时间复杂度都是O(log n)：

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

template<typename T>
void printSet(const set<T>& s, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (auto it = s.begin(); it != s.end(); ++it) {
        if (it != s.begin()) cout << ", ";
        cout << *it;
    }
    cout << "} (size=" << s.size() << ")" << endl;
}

int main() {
    // 创建set
    set<int> s1;
    set<int> s2 = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    
    printSet(s2, "s2（自动排序+去重）");
    // 输出：{1, 2, 3, 4, 5, 6, 9}
    
    // insert：插入元素
    auto result = s1.insert(10);
    cout << "插入10：" << (result.second ? "成功" : "失败（已存在）") << endl;
    
    result = s1.insert(10);
    cout << "再次插入10：" << (result.second ? "成功" : "失败（已存在）") << endl;
    
    s1.insert(20);
    s1.insert(30);
    s1.insert(15);
    printSet(s1, "s1");
    
    // find：查找元素
    auto it = s1.find(20);
    if (it != s1.end()) {
        cout << "找到元素：" << *it << endl;
    }
    
    it = s1.find(100);
    if (it == s1.end()) {
        cout << "未找到元素100" << endl;
    }
    
    // count：统计元素个数（对于set，只能是0或1）
    cout << "count(10) = " << s1.count(10) << endl;
    cout << "count(100) = " << s1.count(100) << endl;
    
    // erase：删除元素
    s1.erase(15);
    printSet(s1, "删除15后");
    
    s1.erase(s1.begin());  // 删除第一个元素（最小的）
    printSet(s1, "删除第一个元素后");
    
    // lower_bound/upper_bound
    set<int> s3 = {10, 20, 30, 40, 50};
    auto low = s3.lower_bound(25);   // 第一个>=25的元素
    auto up = s3.upper_bound(25);    // 第一个>25的元素
    cout << "lower_bound(25) = " << *low << endl;  // 30
    cout << "upper_bound(25) = " << *up << endl;   // 30
    
    // equal_range
    auto range = s3.equal_range(30);
    cout << "equal_range(30): [" << *range.first << ", " << *range.second << ")" << endl;
    
    return 0;
}
```

### 2.2 set的自定义排序

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

// 自定义比较函数对象：降序排列
struct DescendingOrder {
    bool operator()(int a, int b) const {
        return a > b;
    }
};

// set存储自定义类型
class Person {
private:
    string name;
    int age;
    
public:
    Person(const string& n, int a) : name(n), age(a) {}
    
    string getName() const { return name; }
    int getAge() const { return age; }
    
    // 用于默认排序
    bool operator<(const Person& other) const {
        return age < other.age;  // 按年龄排序
    }
    
    void display() const {
        cout << name << "(" << age << "岁)";
    }
};

int main() {
    cout << "========== set自定义排序 ==========\n" << endl;
    
    // 使用自定义比较器
    set<int, DescendingOrder> descSet = {1, 5, 3, 2, 4};
    cout << "降序set：{";
    for (int x : descSet) cout << x << " ";
    cout << "}" << endl;
    
    // 使用greater<int>
    set<int, greater<int>> descSet2 = {1, 5, 3, 2, 4};
    cout << "greater<int> set：{";
    for (int x : descSet2) cout << x << " ";
    cout << "}" << endl;
    
    cout << "\n========== set存储自定义类型 ==========\n" << endl;
    
    set<Person> people;
    people.emplace("张三", 25);
    people.emplace("李四", 20);
    people.emplace("王五", 30);
    people.emplace("赵六", 22);
    people.emplace("孙七", 28);
    
    cout << "按年龄排序：" << endl;
    for (const auto& p : people) {
        cout << "  ";
        p.display();
        cout << endl;
    }
    
    // 使用lambda自定义比较器
    auto cmp = [](const Person& a, const Person& b) {
        return a.getName() < b.getName();  // 按姓名排序
    };
    set<Person, decltype(cmp)> peopleByName(cmp);
    peopleByName.emplace("张三", 25);
    peopleByName.emplace("李四", 20);
    peopleByName.emplace("王五", 30);
    
    cout << "\n按姓名排序：" << endl;
    for (const auto& p : peopleByName) {
        cout << "  ";
        p.display();
        cout << endl;
    }
    
    return 0;
}
```

### 2.3 multiset的使用

multiset与set类似，但允许重复元素：

```cpp
#include <iostream>
#include <set>
using namespace std;

template<typename T>
void print(const multiset<T>& ms, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    cout << "{";
    for (auto it = ms.begin(); it != ms.end(); ++it) {
        if (it != ms.begin()) cout << ", ";
        cout << *it;
    }
    cout << "} (size=" << ms.size() << ")" << endl;
}

int main() {
    cout << "========== multiset ==========\n" << endl;
    
    multiset<int> ms = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    print(ms, "multiset（允许重复）");
    
    // count可以大于1
    cout << "count(1) = " << ms.count(1) << endl;
    cout << "count(5) = " << ms.count(5) << endl;
    
    // find返回第一个匹配的元素
    auto it = ms.find(5);
    cout << "第一个5的位置：";
    while (it != ms.end() && *it == 5) {
        cout << *it << " ";
        ++it;
    }
    cout << endl;
    
    // equal_range
    auto range = ms.equal_range(5);
    cout << "equal_range(5): ";
    for (auto it2 = range.first; it2 != range.second; ++it2) {
        cout << *it2 << " ";
    }
    cout << endl;
    
    // erase删除所有匹配的元素
    ms.erase(5);  // 删除所有5
    print(ms, "删除所有5后");
    
    // 删除单个元素（使用迭代器）
    ms = {1, 1, 2, 2, 3, 3};
    it = ms.find(2);
    if (it != ms.end()) {
        ms.erase(it);  // 只删除一个2
    }
    print(ms, "删除一个2后");
    
    return 0;
}
```

## 三、map详解

### 3.1 map的基本操作

map是键值对（key-value）的有序集合，键唯一。它基于红黑树实现，查找、插入、删除操作的时间复杂度都是O(log n)：

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

template<typename K, typename V>
void printMap(const map<K, V>& m, const string& msg = "") {
    if (!msg.empty()) cout << msg << ":" << endl;
    for (const auto& pair : m) {
        cout << "  " << pair.first << " -> " << pair.second << endl;
    }
    cout << "(size=" << m.size() << ")" << endl;
}

int main() {
    // 创建map
    map<string, int> scores;
    
    // 方式1：使用insert
    scores.insert(pair<string, int>("张三", 85));
    scores.insert(make_pair("李四", 92));
    scores.insert({"王五", 78});  // C++11
    
    // 方式2：使用[]运算符
    scores["赵六"] = 88;
    scores["孙七"] = 95;
    
    printMap(scores, "学生成绩");
    
    // 访问元素
    cout << "张三的成绩：" << scores["张三"] << endl;
    cout << "李四的成绩：" << scores.at("李四") << endl;
    
    // []运算符的副作用：如果键不存在，会自动插入
    cout << "周八的成绩：" << scores["周八"] << endl;  // 插入0
    printMap(scores, "访问周八后（自动插入）");
    
    // find：查找元素
    auto it = scores.find("王五");
    if (it != scores.end()) {
        cout << "找到王五，成绩：" << it->second << endl;
    }
    
    // 修改元素
    scores["张三"] = 90;  // 修改
    it = scores.find("李四");
    if (it != scores.end()) {
        it->second = 95;  // 修改
    }
    printMap(scores, "修改后");
    
    // erase：删除元素
    scores.erase("周八");  // 按键删除
    printMap(scores, "删除周八后");
    
    // 遍历方式
    cout << "\n使用结构化绑定遍历（C++17）：" << endl;
    for (const auto& [name, score] : scores) {
        cout << "  " << name << " -> " << score << endl;
    }
    
    return 0;
}
```

### 3.2 map实现电话簿查询

```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class PhoneBook {
private:
    map<string, string> contacts;  // 姓名 -> 电话号码
    
public:
    // 添加联系人
    void addContact(const string& name, const string& phone) {
        auto result = contacts.insert({name, phone});
        if (!result.second) {
            cout << "联系人\"" << name << "\"已存在，更新号码" << endl;
            result.first->second = phone;
        } else {
            cout << "添加联系人成功：" << name << endl;
        }
    }
    
    // 查找联系人
    string findPhone(const string& name) const {
        auto it = contacts.find(name);
        if (it != contacts.end()) {
            return it->second;
        }
        return "未找到";
    }
    
    // 删除联系人
    bool removeContact(const string& name) {
        return contacts.erase(name) > 0;
    }
    
    // 按姓名前缀搜索
    vector<pair<string, string>> searchByPrefix(const string& prefix) const {
        vector<pair<string, string>> result;
        auto it = contacts.lower_bound(prefix);
        while (it != contacts.end() && it->first.substr(0, prefix.size()) == prefix) {
            result.push_back(*it);
            ++it;
        }
        return result;
    }
    
    // 显示所有联系人
    void displayAll() const {
        cout << "========== 电话簿（共" << contacts.size() << "人） ==========" << endl;
        for (const auto& [name, phone] : contacts) {
            cout << "  " << name << " : " << phone << endl;
        }
        cout << "======================================" << endl;
    }
    
    // 获取联系人数量
    size_t size() const { return contacts.size(); }
};

int main() {
    cout << "========== 电话簿系统 ==========\n" << endl;
    
    PhoneBook pb;
    
    // 添加联系人
    pb.addContact("张三", "13800001111");
    pb.addContact("李四", "13900002222");
    pb.addContact("王五", "13700003333");
    pb.addContact("张伟", "13600004444");
    pb.addContact("张明", "13500005555");
    pb.addContact("赵六", "13400006666");
    
    pb.displayAll();
    
    // 查找
    cout << "\n查找\"李四\"：" << pb.findPhone("李四") << endl;
    cout << "查找\"孙七\"：" << pb.findPhone("孙七") << endl;
    
    // 按前缀搜索
    cout << "\n搜索姓\"张\"的联系人：" << endl;
    auto results = pb.searchByPrefix("张");
    for (const auto& [name, phone] : results) {
        cout << "  " << name << " : " << phone << endl;
    }
    
    // 删除
    cout << "\n删除\"王五\"：" << (pb.removeContact("王五") ? "成功" : "失败") << endl;
    pb.displayAll();
    
    return 0;
}
```

### 3.3 map实现词典查询

```cpp
#include <iostream>
#include <map>
#include <string>
#include <sstream>
using namespace std;

class Dictionary {
private:
    map<string, string> dict;  // 单词 -> 释义
    
public:
    void addWord(const string& word, const string& definition) {
        dict[word] = definition;
    }
    
    string lookup(const string& word) const {
        auto it = dict.find(word);
        if (it != dict.end()) {
            return it->second;
        }
        return "未找到该单词";
    }
    
    // 模糊搜索：查找包含关键词的单词
    vector<pair<string, string>> search(const string& keyword) const {
        vector<pair<string, string>> results;
        for (const auto& [word, def] : dict) {
            if (word.find(keyword) != string::npos || 
                def.find(keyword) != string::npos) {
                results.push_back({word, def});
            }
        }
        return results;
    }
    
    // 获取所有单词
    vector<string> getAllWords() const {
        vector<string> words;
        for (const auto& [word, _] : dict) {
            words.push_back(word);
        }
        return words;
    }
    
    void displayAll() const {
        cout << "========== 词典（共" << dict.size() << "词） ==========" << endl;
        for (const auto& [word, def] : dict) {
            cout << word << " : " << def << endl;
        }
        cout << "======================================" << endl;
    }
};

int main() {
    cout << "========== 英汉词典 ==========\n" << endl;
    
    Dictionary dict;
    dict.addWord("algorithm", "算法");
    dict.addWord("array", "数组");
    dict.addWord("binary", "二进制的");
    dict.addWord("class", "类");
    dict.addWord("data", "数据");
    dict.addWord("encapsulation", "封装");
    dict.addWord("function", "函数");
    dict.addWord("inheritance", "继承");
    dict.addWord("library", "库");
    dict.addWord("polymorphism", "多态");
    dict.addWord("template", "模板");
    dict.addWord("vector", "向量；动态数组");
    
    dict.displayAll();
    
    cout << "\n查找\"class\"：" << dict.lookup("class") << endl;
    cout << "查找\"python\"：" << dict.lookup("python") << endl;
    
    cout << "\n搜索包含\"数据\"的单词：" << endl;
    auto results = dict.search("数据");
    for (const auto& [word, def] : results) {
        cout << "  " << word << " -> " << def << endl;
    }
    
    return 0;
}
```

### 3.4 multimap的使用

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    cout << "========== multimap ==========\n" << endl;
    
    multimap<string, string> departments;
    
    // 一个部门可以有多个员工
    departments.insert({"研发部", "张三"});
    departments.insert({"研发部", "李四"});
    departments.insert({"研发部", "王五"});
    departments.insert({"市场部", "赵六"});
    departments.insert({"市场部", "孙七"});
    departments.insert({"人事部", "周八"});
    
    cout << "所有部门员工：" << endl;
    for (const auto& [dept, employee] : departments) {
        cout << "  " << dept << " : " << employee << endl;
    }
    
    // 查找某个部门的所有员工
    cout << "\n研发部员工：" << endl;
    auto range = departments.equal_range("研发部");
    for (auto it = range.first; it != range.second; ++it) {
        cout << "  " << it->second << endl;
    }
    
    // 统计每个部门的员工数
    cout << "\n各部门员工数：" << endl;
    for (const auto& dept : {"研发部", "市场部", "人事部"}) {
        cout << "  " << dept << " : " << departments.count(dept) << "人" << endl;
    }
    
    return 0;
}
```

## 四、unordered_map与unordered_set

### 4.1 unordered_map的基本使用

unordered_map基于哈希表实现，平均情况下查找、插入、删除操作的时间复杂度都是O(1)：

```cpp
#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

int main() {
    cout << "========== unordered_map ==========\n" << endl;
    
    unordered_map<string, int> umap;
    
    // 插入元素
    umap["apple"] = 5;
    umap["banana"] = 3;
    umap["orange"] = 8;
    umap["grape"] = 12;
    umap.insert({"mango", 7});
    
    cout << "unordered_map内容：" << endl;
    for (const auto& [key, value] : umap) {
        cout << "  " << key << " -> " << value << endl;
    }
    cout << "（注意：输出顺序与插入顺序无关）" << endl;
    
    // 查找
    auto it = umap.find("banana");
    if (it != umap.end()) {
        cout << "\nbanana数量：" << it->second << endl;
    }
    
    // 桶信息
    cout << "\n哈希表信息：" << endl;
    cout << "bucket_count = " << umap.bucket_count() << endl;
    cout << "load_factor = " << umap.load_factor() << endl;
    cout << "max_load_factor = " << umap.max_load_factor() << endl;
    
    // rehash
    umap.rehash(20);
    cout << "\nrehash(20)后 bucket_count = " << umap.bucket_count() << endl;
    
    return 0;
}
```

### 4.2 unordered_set的使用

```cpp
#include <iostream>
#include <unordered_set>
#include <string>
using namespace std;

int main() {
    cout << "========== unordered_set ==========\n" << endl;
    
    unordered_set<string> words = {"hello", "world", "cpp", "stl", "hello"};
    
    cout << "无序集合（自动去重）：" << endl;
    for (const auto& w : words) {
        cout << "  " << w << endl;
    }
    
    // 插入
    words.insert("programming");
    words.insert("hello");  // 重复，不会插入
    
    cout << "\n插入后大小：" << words.size() << endl;
    
    // 查找
    if (words.find("cpp") != words.end()) {
        cout << "找到了cpp" << endl;
    }
    
    // 删除
    words.erase("stl");
    cout << "删除stl后大小：" << words.size() << endl;
    
    return 0;
}
```

### 4.3 有序容器与无序容器对比

```cpp
#include <iostream>
#include <set>
#include <unordered_set>
#include <map>
#include <unordered_map>
#include <chrono>
#include <random>
using namespace std;
using namespace std::chrono;

int main() {
    cout << "========== 有序 vs 无序容器性能对比 ==========\n" << endl;
    
    const int N = 1000000;
    
    // 生成随机数据
    vector<int> data(N);
    mt19937 rng(42);
    uniform_int_distribution<int> dist(1, N * 10);
    for (int i = 0; i < N; i++) {
        data[i] = dist(rng);
    }
    
    // 测试set
    {
        set<int> s;
        auto start = high_resolution_clock::now();
        for (int x : data) s.insert(x);
        auto end = high_resolution_clock::now();
        cout << "set插入" << N << "个元素：" 
             << duration_cast<milliseconds>(end - start).count() << " ms" << endl;
        
        start = high_resolution_clock::now();
        for (int x : data) s.find(x);
        end = high_resolution_clock::now();
        cout << "set查找" << N << "次：" 
             << duration_cast<milliseconds>(end - start).count() << " ms" << endl;
    }
    
    // 测试unordered_set
    {
        unordered_set<int> us;
        auto start = high_resolution_clock::now();
        for (int x : data) us.insert(x);
        auto end = high_resolution_clock::now();
        cout << "\nunordered_set插入" << N << "个元素：" 
             << duration_cast<milliseconds>(end - start).count() << " ms" << endl;
        
        start = high_resolution_clock::now();
        for (int x : data) us.find(x);
        end = high_resolution_clock::now();
        cout << "unordered_set查找" << N << "次：" 
             << duration_cast<milliseconds>(end - start).count() << " ms" << endl;
    }
    
    cout << "\n结论：" << endl;
    cout << "  - unordered_set通常更快（O(1) vs O(log n)）" << endl;
    cout << "  - 但set保持元素有序，适合需要顺序遍历的场景" << endl;
    
    return 0;
}
```

## 五、pair对组

### 5.1 pair的基本使用

pair是STL中的一个简单模板类，用于将两个值组合成一个单元。map中的元素就是pair：

```cpp
#include <iostream>
#include <utility>
#include <string>
using namespace std;

int main() {
    cout << "========== pair对组 ==========\n" << endl;
    
    // 创建pair的方式
    pair<string, int> p1("张三", 25);
    pair<string, int> p2 = make_pair("李四", 30);
    pair<string, int> p3 = {"王五", 28};  // C++11
    auto p4 = make_pair("赵六", 22);      // 自动推导类型
    
    // 访问pair元素
    cout << p1.first << " : " << p1.second << endl;
    cout << p2.first << " : " << p2.second << endl;
    cout << p3.first << " : " << p3.second << endl;
    cout << p4.first << " : " << p4.second << endl;
    
    // pair的比较
    pair<int, int> a = {1, 5};
    pair<int, int> b = {1, 3};
    pair<int, int> c = {2, 1};
    
    cout << "\n比较：" << endl;
    cout << "(1,5) < (1,3) = " << (a < b ? "true" : "false") << endl;  // false
    cout << "(1,5) < (2,1) = " << (a < c ? "true" : "false") << endl;  // true
    cout << "（比较规则：先比较first，如果相等再比较second）" << endl;
    
    // pair的交换
    cout << "\n交换前：p1=(" << p1.first << "," << p1.second 
         << "), p2=(" << p2.first << "," << p2.second << ")" << endl;
    p1.swap(p2);
    cout << "交换后：p1=(" << p1.first << "," << p1.second 
         << "), p2=(" << p2.first << "," << p2.second << ")" << endl;
    
    // 使用tie解包
    string name;
    int age;
    tie(name, age) = p3;
    cout << "\ntie解包：name=" << name << ", age=" << age << endl;
    
    // 使用结构化绑定（C++17）
    auto [n, a] = p4;
    cout << "结构化绑定：name=" << n << ", age=" << a << endl;
    
    return 0;
}
```

## 六、总结

关联容器是STL中功能强大的数据组织工具，它们通过键值来高效地存储和检索数据。

### 核心知识点

1. **set**：有序、元素唯一的集合，基于红黑树，O(log n)操作
2. **multiset**：有序、元素可重复的集合
3. **map**：有序、键唯一的键值对集合，支持[]运算符
4. **multimap**：有序、键可重复的键值对集合
5. **unordered_set/map**：基于哈希表，O(1)平均操作
6. **pair**：将两个值组合成一个单元的简单模板

### 选择指南

- 需要有序遍历？使用set/map
- 需要O(1)查找？使用unordered_set/unordered_map
- 需要重复元素？使用multiset/multimap
- 需要键值对？使用map
- 只需要集合？使用set
- 不需要排序？使用无序容器

### 使用建议

- 使用emplace代替insert，减少临时对象
- 使用find() + end()检查元素是否存在（而不是count()）
- 对于map，使用at()安全访问，[]只在需要自动插入时使用
- 对于unordered容器，合理设置桶的数量以避免频繁rehash
- 利用lower_bound/upper_bound进行范围查询

关联容器是日常C++开发中不可或缺的工具，掌握它们的使用方法和性能特征，能够显著提高代码的效率和质量。
---
title: C++STL标准模板库Ⅳ——迭代器与函数对象
date: 2026-07-26
tags:
  - C++
  - STL
  - 迭代器
  - 函数对象
  - 仿函数
categories:
  - C++
---

## 一、迭代器概述

迭代器是STL的核心概念之一，它充当容器和算法之间的桥梁。迭代器提供了一种统一的方式来遍历容器中的元素，使得算法可以独立于具体的容器类型工作。

### 1.1 迭代器的概念

迭代器可以理解为一种智能指针，它封装了对容器元素的访问方式。迭代器的设计灵感来自于指针，重载了`*`（解引用）、`->`（成员访问）、`++`（前进）、`--`（后退）等运算符。

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <set>
using namespace std;

int main() {
    cout << "========== 迭代器的统一接口 ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5};
    list<int> lst = {10, 20, 30, 40, 50};
    set<int> s = {100, 200, 300, 400, 500};
    
    // 不同容器使用相同的迭代器遍历方式
    cout << "vector: ";
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    cout << "list: ";
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    cout << "set: ";
    for (auto it = s.begin(); it != s.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    cout << "\n这就是迭代器的魅力：统一的访问方式，不同的底层实现。" << endl;
    
    return 0;
}
```

### 1.2 迭代器的分类

C++标准定义了五种迭代器类别，它们按照功能强弱形成层次结构：

```
输入迭代器 (InputIterator)
    ↓
前向迭代器 (ForwardIterator)
    ↓
双向迭代器 (BidirectionalIterator)
    ↓
随机访问迭代器 (RandomAccessIterator)

输出迭代器 (OutputIterator) 独立存在
```

## 二、各类迭代器详解

### 2.1 输入迭代器与输出迭代器

输入迭代器只能读取元素，输出迭代器只能写入元素：

```cpp
#include <iostream>
#include <iterator>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

int main() {
    cout << "========== 输入/输出迭代器 ==========\n" << endl;
    
    // 输入流迭代器：从cin读取
    cout << "输入一些数字（以非数字结束）：" << endl;
    vector<int> numbers;
    
    // 使用istream_iterator从cin读取
    // 实际使用中取消注释：
    // copy(istream_iterator<int>(cin), istream_iterator<int>(), back_inserter(numbers));
    
    // 使用字符串流模拟
    istringstream iss("10 20 30 40 50");
    copy(istream_iterator<int>(iss), istream_iterator<int>(), back_inserter(numbers));
    
    cout << "读取的数字：";
    for (int x : numbers) cout << x << " ";
    cout << endl;
    
    // 输出流迭代器：写入cout
    cout << "使用ostream_iterator输出：";
    copy(numbers.begin(), numbers.end(), ostream_iterator<int>(cout, " "));
    cout << endl;
    
    return 0;
}
```

### 2.2 前向迭代器

前向迭代器支持++操作，可以多次遍历同一个序列。forward_list使用前向迭代器：

```cpp
#include <iostream>
#include <forward_list>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 前向迭代器 ==========\n" << endl;
    
    forward_list<int> fl = {1, 2, 3, 4, 5};
    
    cout << "forward_list遍历：";
    for (auto it = fl.begin(); it != fl.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // 前向迭代器不支持--操作
    // auto it = fl.end(); --it;  // 错误！
    
    // 支持多次遍历
    cout << "第一次遍历：";
    for (int x : fl) cout << x << " ";
    cout << endl;
    
    cout << "第二次遍历：";
    for (int x : fl) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 2.3 双向迭代器

双向迭代器支持++和--操作，可以双向移动。list、set、map使用双向迭代器：

```cpp
#include <iostream>
#include <list>
#include <set>
using namespace std;

int main() {
    cout << "========== 双向迭代器 ==========\n" << endl;
    
    list<int> lst = {1, 2, 3, 4, 5};
    
    // 正向遍历
    cout << "正向：";
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // 反向遍历
    cout << "反向：";
    for (auto it = lst.end(); it != lst.begin(); ) {
        --it;
        cout << *it << " ";
    }
    cout << endl;
    
    // 使用reverse_iterator
    cout << "使用reverse_iterator：";
    for (auto it = lst.rbegin(); it != lst.rend(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // set的双向遍历
    set<int> s = {5, 3, 1, 4, 2};
    cout << "set正向：";
    for (auto it = s.begin(); it != s.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    cout << "set反向：";
    for (auto it = s.rbegin(); it != s.rend(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    return 0;
}
```

### 2.4 随机访问迭代器

随机访问迭代器支持所有指针运算，包括+、-、[]、<、>等。vector、deque、array、string使用随机访问迭代器：

```cpp
#include <iostream>
#include <vector>
#include <deque>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 随机访问迭代器 ==========\n" << endl;
    
    vector<int> vec = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    
    auto it = vec.begin();
    
    // 随机访问操作
    cout << "*it = " << *it << endl;           // 10
    cout << "it[3] = " << it[3] << endl;       // 40
    cout << "*(it + 5) = " << *(it + 5) << endl; // 60
    
    it += 3;
    cout << "it += 3 后 *it = " << *it << endl;  // 40
    
    // 迭代器之间的距离
    auto it2 = vec.end() - 1;
    cout << "end-1 到 begin 的距离：" << (it2 - vec.begin()) << endl;  // 9
    
    // 比较迭代器
    cout << "begin < end: " << (vec.begin() < vec.end() ? "true" : "false") << endl;
    
    // 二分查找需要随机访问迭代器
    sort(vec.begin(), vec.end());
    bool found = binary_search(vec.begin(), vec.end(), 60);
    cout << "二分查找60：" << (found ? "找到了" : "未找到") << endl;
    
    // 随机打乱
    random_shuffle(vec.begin(), vec.end());
    cout << "随机打乱后：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 2.5 反向迭代器与常量迭代器

```cpp
#include <iostream>
#include <vector>
#include <list>
using namespace std;

int main() {
    cout << "========== 反向迭代器与常量迭代器 ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5};
    
    // 正向迭代器
    cout << "正向：";
    for (vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // 反向迭代器
    cout << "反向：";
    for (vector<int>::reverse_iterator it = vec.rbegin(); it != vec.rend(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // 常量迭代器（不能修改元素）
    cout << "常量迭代器：";
    for (vector<int>::const_iterator it = vec.cbegin(); it != vec.cend(); ++it) {
        cout << *it << " ";
        // *it = 100;  // 错误！不能修改
    }
    cout << endl;
    
    // 常量反向迭代器
    cout << "常量反向迭代器：";
    for (auto it = vec.crbegin(); it != vec.crend(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // 使用auto简化
    cout << "使用auto：";
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    
    // 范围for循环（底层使用迭代器）
    cout << "范围for：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

## 三、迭代器失效问题

### 3.1 迭代器失效的场景

迭代器失效是指当容器发生结构性变化（如重新分配内存、插入或删除元素）后，之前获取的迭代器可能不再指向有效的元素：

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
using namespace std;

int main() {
    cout << "========== 迭代器失效 ==========\n" << endl;
    
    // vector的迭代器失效
    cout << "=== vector迭代器失效 ===" << endl;
    vector<int> vec = {1, 2, 3, 4, 5};
    auto it = vec.begin() + 2;
    cout << "迭代器指向：" << *it << endl;  // 3
    
    // 可能导致重新分配
    vec.push_back(6);
    vec.push_back(7);
    // 由于vector可能重新分配，it可能已经失效
    // cout << *it << endl;  // 危险！可能访问无效内存
    
    // 正确做法：重新获取迭代器
    it = vec.begin() + 2;
    cout << "重新获取后指向：" << *it << endl;
    
    // 删除导致的失效
    cout << "\n删除元素导致的失效：" << endl;
    it = vec.begin() + 2;
    vec.erase(it);  // 删除第3个元素
    // it现在指向被删除的元素，已失效
    // 正确做法：使用erase返回的迭代器
    it = vec.begin() + 2;
    it = vec.erase(it);  // it现在指向被删除元素的下一个元素
    cout << "erase后指向：" << *it << endl;
    
    // list的迭代器稳定性
    cout << "\n=== list迭代器稳定性 ===" << endl;
    list<int> lst = {1, 2, 3, 4, 5};
    auto lit = lst.begin();
    advance(lit, 2);
    cout << "list迭代器指向：" << *lit << endl;  // 3
    
    lst.push_front(0);
    lst.push_back(6);
    // list的迭代器不会因为插入而失效（除了被删除的元素）
    cout << "插入后list迭代器仍指向：" << *lit << endl;  // 仍然是3
    
    // 但如果删除lit指向的元素，lit就会失效
    lit = lst.erase(lit);
    cout << "erase后指向：" << *lit << endl;  // 4
    
    return 0;
}
```

### 3.2 各容器迭代器失效规则

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include <set>
#include <map>
using namespace std;

int main() {
    cout << "========== 迭代器失效规则总结 ==========\n" << endl;
    
    cout << "vector：" << endl;
    cout << "  - 重新分配内存：所有迭代器失效" << endl;
    cout << "  - 插入元素（不重新分配）：插入点之后的迭代器失效" << endl;
    cout << "  - 删除元素：删除点及之后的迭代器失效" << endl;
    cout << "  - 建议：避免保存可能失效的迭代器" << endl;
    
    cout << "\ndeque：" << endl;
    cout << "  - 头尾插入：所有迭代器可能失效（但引用有效）" << endl;
    cout << "  - 中间插入删除：所有迭代器失效" << endl;
    
    cout << "\nlist：" << endl;
    cout << "  - 插入元素：所有迭代器保持有效" << endl;
    cout << "  - 删除元素：仅被删除元素的迭代器失效" << endl;
    cout << "  - 是最稳定的容器" << endl;
    
    cout << "\nset/map：" << endl;
    cout << "  - 插入元素：所有迭代器保持有效" << endl;
    cout << "  - 删除元素：仅被删除元素的迭代器失效" << endl;
    cout << "  - 与list类似，非常稳定" << endl;
    
    return 0;
}
```

## 四、函数对象（仿函数）

### 4.1 函数对象的概念

函数对象（Function Object），也称为仿函数（Functor），是指重载了`operator()`的类。函数对象可以像普通函数一样被调用，但由于它是类，可以保存状态：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 普通函数
bool isEven(int x) {
    return x % 2 == 0;
}

// 函数对象
class IsEven {
public:
    bool operator()(int x) const {
        return x % 2 == 0;
    }
};

// 带状态的函数对象
class Counter {
private:
    int count;
    
public:
    Counter() : count(0) {}
    
    void operator()(int x) {
        count++;
        cout << "第" << count << "次调用，参数=" << x << endl;
    }
    
    int getCount() const { return count; }
};

// 带参数的函数对象
class GreaterThan {
private:
    int threshold;
    
public:
    GreaterThan(int t) : threshold(t) {}
    
    bool operator()(int x) const {
        return x > threshold;
    }
};

int main() {
    cout << "========== 函数对象 ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 使用普通函数
    cout << "使用普通函数：" << endl;
    cout << "偶数个数：" << count_if(vec.begin(), vec.end(), isEven) << endl;
    
    // 使用函数对象
    cout << "\n使用函数对象：" << endl;
    cout << "偶数个数：" << count_if(vec.begin(), vec.end(), IsEven()) << endl;
    // IsEven()创建了一个临时对象
    
    // 使用带状态的函数对象
    cout << "\n使用带状态的函数对象：" << endl;
    Counter counter = for_each(vec.begin(), vec.begin() + 5, Counter());
    cout << "总共调用了" << counter.getCount() << "次" << endl;
    
    // 使用带参数的函数对象
    cout << "\n使用带参数的函数对象：" << endl;
    int count = count_if(vec.begin(), vec.end(), GreaterThan(5));
    cout << "大于5的元素个数：" << count << endl;
    
    return 0;
}
```

### 4.2 谓词（Predicate）

谓词是返回bool值的函数对象或函数。一元谓词接受一个参数，二元谓词接受两个参数：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

// 一元谓词
class IsPositive {
public:
    bool operator()(int x) const {
        return x > 0;
    }
};

// 二元谓词
class CompareByLength {
public:
    bool operator()(const string& a, const string& b) const {
        return a.length() < b.length();
    }
};

// 二元谓词用于排序
class DescendingOrder {
public:
    bool operator()(int a, int b) const {
        return a > b;
    }
};

int main() {
    cout << "========== 谓词 ==========\n" << endl;
    
    // 一元谓词
    vector<int> vec = {-3, -1, 0, 2, 5, -4, 8};
    cout << "原始：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    int positiveCount = count_if(vec.begin(), vec.end(), IsPositive());
    cout << "正数个数：" << positiveCount << endl;
    
    // 二元谓词：排序
    cout << "\n使用二元谓词排序：" << endl;
    sort(vec.begin(), vec.end(), DescendingOrder());
    cout << "降序：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // 二元谓词：字符串排序
    vector<string> words = {"apple", "banana", "kiwi", "pear", "grape", "watermelon"};
    cout << "\n原始单词：";
    for (const auto& w : words) cout << w << " ";
    cout << endl;
    
    sort(words.begin(), words.end(), CompareByLength());
    cout << "按长度排序：";
    for (const auto& w : words) cout << w << " ";
    cout << endl;
    
    return 0;
}
```

### 4.3 内建函数对象

STL提供了一系列预定义的函数对象，位于`<functional>`头文件中：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

template<typename T>
void print(const vector<T>& v, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    for (const auto& x : v) cout << x << " ";
    cout << endl;
}

int main() {
    cout << "========== 内建函数对象 ==========\n" << endl;
    
    vector<int> vec = {3, 1, 4, 1, 5, 9, 2, 6};
    print(vec, "原始");
    
    // 算术函数对象
    cout << "\n=== 算术函数对象 ===" << endl;
    plus<int> add;
    cout << "plus(3, 4) = " << add(3, 4) << endl;
    
    minus<int> sub;
    cout << "minus(10, 3) = " << sub(10, 3) << endl;
    
    multiplies<int> mul;
    cout << "multiplies(6, 7) = " << mul(6, 7) << endl;
    
    divides<int> div;
    cout << "divides(20, 4) = " << div(20, 4) << endl;
    
    modulus<int> mod;
    cout << "modulus(10, 3) = " << mod(10, 3) << endl;
    
    negate<int> neg;
    cout << "negate(5) = " << neg(5) << endl;
    
    // 关系函数对象
    cout << "\n=== 关系函数对象 ===" << endl;
    sort(vec.begin(), vec.end(), greater<int>());
    print(vec, "greater排序（降序）");
    
    sort(vec.begin(), vec.end(), less<int>());
    print(vec, "less排序（升序，默认）");
    
    // 逻辑函数对象
    cout << "\n=== 逻辑函数对象 ===" << endl;
    logical_and<bool> land;
    cout << "true && true = " << land(true, true) << endl;
    cout << "true && false = " << land(true, false) << endl;
    
    logical_or<bool> lor;
    cout << "false || false = " << lor(false, false) << endl;
    cout << "true || false = " << lor(true, false) << endl;
    
    logical_not<bool> lnot;
    cout << "!true = " << lnot(true) << endl;
    
    // 使用transform配合内建函数对象
    cout << "\n=== transform配合内建函数对象 ===" << endl;
    vector<int> vec2 = {1, 2, 3, 4, 5};
    vector<int> result(vec2.size());
    
    transform(vec2.begin(), vec2.end(), result.begin(), negate<int>());
    print(vec2, "原始");
    print(result, "negate后");
    
    // 二元transform
    vector<int> vec3 = {10, 20, 30, 40, 50};
    vector<int> result2(vec3.size());
    transform(vec2.begin(), vec2.end(), vec3.begin(), result2.begin(), multiplies<int>());
    print(result2, "vec2 * vec3");
    
    return 0;
}
```

### 4.4 函数对象与lambda表达式

函数对象和lambda表达式在功能上是等价的，lambda表达式本质上是编译器自动生成的函数对象：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

// 函数对象版本
class MultiplyBy {
private:
    int factor;
    
public:
    MultiplyBy(int f) : factor(f) {}
    
    int operator()(int x) const {
        return x * factor;
    }
};

int main() {
    cout << "========== 函数对象 vs Lambda ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5};
    vector<int> result1(vec.size());
    vector<int> result2(vec.size());
    
    // 使用函数对象
    transform(vec.begin(), vec.end(), result1.begin(), MultiplyBy(3));
    
    // 使用lambda（等价）
    transform(vec.begin(), vec.end(), result2.begin(), 
              [](int x) { return x * 3; });
    
    cout << "原始：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    cout << "函数对象(*3)：";
    for (int x : result1) cout << x << " ";
    cout << endl;
    
    cout << "Lambda(*3)：";
    for (int x : result2) cout << x << " ";
    cout << endl;
    
    // 复杂谓词：使用函数对象
    struct ComplexPredicate {
        int minVal, maxVal;
        ComplexPredicate(int min, int max) : minVal(min), maxVal(max) {}
        bool operator()(int x) const {
            return x >= minVal && x <= maxVal;
        }
    };
    
    int count1 = count_if(vec.begin(), vec.end(), ComplexPredicate(2, 4));
    cout << "\n值在[2,4]范围内（函数对象）：" << count1 << endl;
    
    // 同样的逻辑使用lambda
    int count2 = count_if(vec.begin(), vec.end(), 
                          [](int x) { return x >= 2 && x <= 4; });
    cout << "值在[2,4]范围内（lambda）：" << count2 << endl;
    
    // 函数对象可以绑定到std::function
    function<bool(int)> predicate = ComplexPredicate(2, 4);
    int count3 = count_if(vec.begin(), vec.end(), predicate);
    cout << "值在[2,4]范围内（std::function）：" << count3 << endl;
    
    return 0;
}
```

## 五、迭代器适配器

### 5.1 插入迭代器

插入迭代器将赋值操作转换为插入操作：

```cpp
#include <iostream>
#include <vector>
#include <list>
#include <iterator>
#include <algorithm>
using namespace std;

template<typename T>
void print(const vector<T>& v, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    for (const auto& x : v) cout << x << " ";
    cout << endl;
}

int main() {
    cout << "========== 插入迭代器 ==========\n" << endl;
    
    vector<int> src = {1, 2, 3, 4, 5};
    vector<int> dest;
    
    // back_inserter：尾部插入
    copy(src.begin(), src.end(), back_inserter(dest));
    print(dest, "back_inserter");
    
    // front_inserter：头部插入（需要容器支持push_front）
    list<int> lst;
    copy(src.begin(), src.end(), front_inserter(lst));
    cout << "front_inserter: ";
    for (int x : lst) cout << x << " ";
    cout << endl;
    
    // inserter：指定位置插入
    vector<int> dest2 = {10, 20, 30};
    copy(src.begin(), src.end(), inserter(dest2, dest2.begin() + 1));
    print(dest2, "inserter(位置1)");
    
    return 0;
}
```

### 5.2 流迭代器

```cpp
#include <iostream>
#include <vector>
#include <iterator>
#include <algorithm>
#include <sstream>
#include <fstream>
using namespace std;

int main() {
    cout << "========== 流迭代器 ==========\n" << endl;
    
    // 输入流迭代器
    string input = "10 20 30 40 50";
    istringstream iss(input);
    
    vector<int> numbers;
    copy(istream_iterator<int>(iss), istream_iterator<int>(), 
         back_inserter(numbers));
    
    cout << "从字符串流读取：";
    for (int x : numbers) cout << x << " ";
    cout << endl;
    
    // 输出流迭代器
    cout << "使用ostream_iterator输出：";
    copy(numbers.begin(), numbers.end(), ostream_iterator<int>(cout, " "));
    cout << endl;
    
    // 组合使用：读取、转换、输出
    cout << "\n读取、乘以2、输出：" << endl;
    istringstream iss2("1 2 3 4 5");
    transform(
        istream_iterator<int>(iss2), istream_iterator<int>(),
        ostream_iterator<int>(cout, " "),
        [](int x) { return x * 2; }
    );
    cout << endl;
    
    return 0;
}
```

## 六、总结

迭代器和函数对象是STL的两大核心概念，它们共同构成了STL泛型编程的基础。

### 核心知识点

**迭代器**：
- 五种迭代器类别：输入、输出、前向、双向、随机访问
- 每个容器提供适合自身数据结构的迭代器类型
- 迭代器失效是常见的陷阱，需要了解各容器的失效规则
- 迭代器适配器（插入迭代器、流迭代器）扩展了迭代器的功能

**函数对象**：
- 重载operator()的类，可以像函数一样调用
- 可以保存状态，比普通函数更灵活
- 谓词是返回bool值的函数对象
- 内建函数对象提供常用操作
- lambda表达式本质上是语法糖，编译器会生成函数对象

### 最佳实践

- 优先使用范围for循环简化遍历
- 使用auto简化迭代器类型声明
- 注意容器操作可能导致的迭代器失效
- 使用const_iterator确保不修改元素
- 对于复杂逻辑，使用lambda表达式代替函数对象（更简洁）
- 对于可复用的逻辑，使用函数对象（可命名，可测试）
- 利用插入迭代器简化容器填充操作
- 利用流迭代器实现流式数据处理

迭代器和函数对象的设计体现了STL的核心理念：将数据（容器）、操作（算法）和访问方式（迭代器）分离，使得每个组件可以独立地变化和组合。
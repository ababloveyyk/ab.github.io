---
title: C++现代特性Ⅲ——lambda表达式
date: 2026-07-26
tags:
  - C++
  - lambda
  - 函数对象
  - 闭包
categories:
  - C++
---

## 一、lambda表达式概述

lambda表达式是C++11引入的一项强大特性，它允许我们在代码中内联地定义匿名函数对象。lambda表达式大大简化了STL算法的使用，使得代码更加简洁和可读。

### 1.1 lambda表达式的基本语法

lambda表达式的基本语法如下：

```cpp
[capture](parameters) mutable -> return_type {
    // 函数体
}
```

- **capture**：捕获列表，指定lambda可以访问的外部变量
- **parameters**：参数列表（可选，没有参数时可以省略括号）
- **mutable**：可选，允许修改按值捕获的变量
- **return_type**：返回类型（可选，通常可以自动推导）
- **body**：函数体

### 1.2 最简单的lambda

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 最简单的lambda ==========\n" << endl;
    
    // 最简单的lambda：无参数，无返回值
    auto hello = []() {
        cout << "Hello, Lambda!" << endl;
    };
    hello();  // 调用lambda
    
    // 有参数的lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    cout << "add(3, 4) = " << add(3, 4) << endl;
    
    // 直接调用lambda（立即执行）
    int result = [](int x) { return x * x; }(5);
    cout << "5的平方 = " << result << endl;
    
    // 在STL算法中使用lambda
    vector<int> vec = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    cout << "原始：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // 使用lambda进行条件查找
    auto it = find_if(vec.begin(), vec.end(), [](int x) {
        return x > 5;
    });
    if (it != vec.end()) {
        cout << "第一个大于5的数：" << *it << endl;
    }
    
    return 0;
}
```

## 二、捕获列表详解

### 2.1 值捕获

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 值捕获 ==========\n" << endl;
    
    int threshold = 5;
    int multiplier = 10;
    
    // 值捕获：lambda内部获得变量的副本
    auto check = [threshold, multiplier](int x) {
        // threshold = 10;  // 错误！值捕获的变量默认是const的
        return x > threshold && x < multiplier;
    };
    
    // 修改外部变量不影响lambda内部的副本
    threshold = 20;
    multiplier = 100;
    
    cout << "threshold = " << threshold << "（外部）" << endl;
    cout << "check(10) = " << (check(10) ? "true" : "false") << endl;
    // check(10)仍然使用捕获时的threshold=5
    
    return 0;
}
```

### 2.2 引用捕获

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 引用捕获 ==========\n" << endl;
    
    int counter = 0;
    int sum = 0;
    
    // 引用捕获：lambda内部引用外部变量
    auto process = [&counter, &sum](int x) {
        counter++;        // 可以修改引用捕获的变量
        sum += x;         // 修改会影响外部变量
    };
    
    vector<int> vec = {1, 2, 3, 4, 5};
    for_each(vec.begin(), vec.end(), process);
    
    cout << "处理了" << counter << "个元素" << endl;
    cout << "总和 = " << sum << endl;
    
    // 引用捕获的变量在lambda调用时反映最新值
    int factor = 2;
    auto multiply = [&factor](int x) {
        return x * factor;
    };
    
    cout << "multiply(5) = " << multiply(5) << endl;  // 10
    
    factor = 3;
    cout << "修改因子后 multiply(5) = " << multiply(5) << endl;  // 15
    
    return 0;
}
```

### 2.3 隐式捕获

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "========== 隐式捕获 ==========\n" << endl;
    
    int a = 10, b = 20, c = 30;
    string prefix = "结果：";
    
    // [=]：隐式值捕获所有变量
    auto captureByValue = [=]() {
        cout << prefix << "a=" << a << ", b=" << b << ", c=" << c << endl;
        // 不能修改a, b, c
    };
    captureByValue();
    
    // [&]：隐式引用捕获所有变量
    auto captureByRef = [&]() {
        a += 1;
        b += 2;
        c += 3;
        cout << prefix << "a=" << a << ", b=" << b << ", c=" << c << endl;
    };
    captureByRef();
    cout << "外部：a=" << a << ", b=" << b << ", c=" << c << endl;
    
    // 混合捕获
    // [=, &b]：默认值捕获，但b是引用捕获
    auto mixed1 = [=, &b]() {
        // a = 100;  // 错误！a是值捕获，不可修改
        b = 200;     // 正确！b是引用捕获
        cout << "a=" << a << ", b=" << b << endl;
    };
    mixed1();
    cout << "外部b = " << b << endl;
    
    // [&, a]：默认引用捕获，但a是值捕获
    auto mixed2 = [&, a]() {
        b = 300;     // 正确！b是引用捕获
        c = 400;     // 正确！c是引用捕获
        // a = 500;  // 错误！a是值捕获
        cout << "a=" << a << ", b=" << b << ", c=" << c << endl;
    };
    mixed2();
    
    return 0;
}
```

### 2.4 mutable关键字

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "========== mutable关键字 ==========\n" << endl;
    
    int value = 10;
    
    // 不使用mutable：值捕获的变量不可修改
    auto immutable = [value]() {
        // value++;  // 错误！值捕获的变量是const的
        return value;
    };
    
    // 使用mutable：值捕获的变量可以修改（但不影响外部变量）
    auto mutable_lambda = [value]() mutable {
        value++;  // 可以修改lambda内部的副本
        return value;
    };
    
    cout << "外部value = " << value << endl;
    cout << "immutable() = " << immutable() << endl;
    cout << "mutable_lambda() = " << mutable_lambda() << endl;
    cout << "mutable_lambda() = " << mutable_lambda() << endl;  // 再次调用，继续增加
    cout << "外部value = " << value << "（未变）" << endl;
    
    // mutable的实际应用：带状态的lambda
    auto counter = [count = 0]() mutable {
        return ++count;
    };
    
    cout << "\n计数器：" << endl;
    cout << "counter() = " << counter() << endl;
    cout << "counter() = " << counter() << endl;
    cout << "counter() = " << counter() << endl;
    
    return 0;
}
```

## 三、lambda与函数指针

### 3.1 lambda转换为函数指针

没有捕获的lambda可以隐式转换为函数指针：

```cpp
#include <iostream>
#include <functional>
using namespace std;

// 接受函数指针的函数
void callFunction(void (*func)(int)) {
    func(42);
}

int callAndReturn(int (*func)(int, int), int a, int b) {
    return func(a, b);
}

int main() {
    cout << "========== lambda与函数指针 ==========\n" << endl;
    
    // 无捕获的lambda可以转换为函数指针
    auto lambda1 = [](int x) {
        cout << "Lambda被调用，参数 = " << x << endl;
    };
    
    callFunction(lambda1);  // 隐式转换
    
    // 另一个例子
    int result = callAndReturn([](int a, int b) { return a + b; }, 10, 20);
    cout << "结果 = " << result << endl;
    
    // 有捕获的lambda不能转换为函数指针
    int factor = 5;
    auto lambda2 = [factor](int x) { return x * factor; };
    // callFunction(lambda2);  // 错误！有捕获的lambda不能转换为函数指针
    
    // 但可以使用std::function
    function<void(int)> func = lambda2;
    // 或者直接使用lambda
    
    cout << "lambda2(10) = " << lambda2(10) << endl;
    
    return 0;
}
```

### 3.2 lambda与std::function

```cpp
#include <iostream>
#include <functional>
#include <vector>
#include <map>
using namespace std;

int main() {
    cout << "========== lambda与std::function ==========\n" << endl;
    
    // std::function可以存储任何可调用对象
    function<int(int, int)> operations;
    
    // 存储lambda
    operations = [](int a, int b) { return a + b; };
    cout << "加法：10 + 5 = " << operations(10, 5) << endl;
    
    operations = [](int a, int b) { return a * b; };
    cout << "乘法：10 * 5 = " << operations(10, 5) << endl;
    
    // 存储有捕获的lambda
    int base = 100;
    function<int(int)> addBase = [base](int x) { return base + x; };
    cout << "addBase(50) = " << addBase(50) << endl;
    
    // 使用std::function构建回调系统
    vector<function<void()>> callbacks;
    
    callbacks.push_back([]() { cout << "回调1：系统启动" << endl; });
    callbacks.push_back([]() { cout << "回调2：初始化完成" << endl; });
    callbacks.push_back([]() { cout << "回调3：准备就绪" << endl; });
    
    cout << "\n执行所有回调：" << endl;
    for (const auto& cb : callbacks) {
        cb();
    }
    
    // 使用map存储操作
    map<string, function<int(int, int)>> ops;
    ops["+"] = [](int a, int b) { return a + b; };
    ops["-"] = [](int a, int b) { return a - b; };
    ops["*"] = [](int a, int b) { return a * b; };
    ops["/"] = [](int a, int b) { return b != 0 ? a / b : 0; };
    
    cout << "\n计算器：" << endl;
    cout << "10 + 5 = " << ops["+"](10, 5) << endl;
    cout << "10 - 5 = " << ops["-"](10, 5) << endl;
    cout << "10 * 5 = " << ops["*"](10, 5) << endl;
    cout << "10 / 5 = " << ops["/"](10, 5) << endl;
    
    return 0;
}
```

## 四、lambda与STL算法配合

### 4.1 排序算法

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

struct Person {
    string name;
    int age;
    double salary;
    
    void display() const {
        cout << name << " (年龄:" << age << ", 薪资:" << salary << ")";
    }
};

int main() {
    cout << "========== lambda与排序 ==========\n" << endl;
    
    vector<int> vec = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    
    // 降序排序
    sort(vec.begin(), vec.end(), [](int a, int b) { return a > b; });
    cout << "降序：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // 按绝对值排序
    sort(vec.begin(), vec.end(), [](int a, int b) {
        return abs(a) < abs(b);
    });
    cout << "按绝对值：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // 复杂对象排序
    vector<Person> people = {
        {"张三", 25, 8000},
        {"李四", 30, 12000},
        {"王五", 22, 9000},
        {"赵六", 28, 15000},
        {"孙七", 35, 11000}
    };
    
    cout << "\n按年龄排序：" << endl;
    sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        return a.age < b.age;
    });
    for (const auto& p : people) {
        p.display();
        cout << endl;
    }
    
    cout << "\n按薪资降序排序：" << endl;
    sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        return a.salary > b.salary;
    });
    for (const auto& p : people) {
        p.display();
        cout << endl;
    }
    
    // 多重排序：先按年龄，再按薪资
    cout << "\n多重排序（年龄升序，薪资降序）：" << endl;
    sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        if (a.age != b.age) return a.age < b.age;
        return a.salary > b.salary;
    });
    for (const auto& p : people) {
        p.display();
        cout << endl;
    }
    
    return 0;
}
```

### 4.2 查找与过滤

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <numeric>
using namespace std;

int main() {
    cout << "========== lambda与查找过滤 ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // find_if：查找第一个满足条件的元素
    auto it = find_if(vec.begin(), vec.end(), [](int x) {
        return x > 5 && x % 2 == 0;
    });
    if (it != vec.end()) {
        cout << "第一个大于5的偶数：" << *it << endl;
    }
    
    // count_if：统计满足条件的元素个数
    int count = count_if(vec.begin(), vec.end(), [](int x) {
        return x % 3 == 0;
    });
    cout << "能被3整除的个数：" << count << endl;
    
    // copy_if：拷贝满足条件的元素
    vector<int> evens;
    copy_if(vec.begin(), vec.end(), back_inserter(evens), [](int x) {
        return x % 2 == 0;
    });
    cout << "偶数：";
    for (int x : evens) cout << x << " ";
    cout << endl;
    
    // remove_if：删除满足条件的元素
    vec.erase(
        remove_if(vec.begin(), vec.end(), [](int x) { return x < 5; }),
        vec.end()
    );
    cout << "删除小于5的元素后：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // all_of：检查是否所有元素都满足条件
    bool all_even = all_of(evens.begin(), evens.end(), [](int x) {
        return x % 2 == 0;
    });
    cout << "\n所有偶数都是偶数：" << (all_even ? "是" : "否") << endl;
    
    // any_of：检查是否有元素满足条件
    bool has_large = any_of(vec.begin(), vec.end(), [](int x) {
        return x > 8;
    });
    cout << "存在大于8的数：" << (has_large ? "是" : "否") << endl;
    
    return 0;
}
```

### 4.3 变换与累积

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
using namespace std;

int main() {
    cout << "========== lambda与变换累积 ==========\n" << endl;
    
    vector<int> src = {1, 2, 3, 4, 5};
    vector<int> result(src.size());
    
    // transform：每个元素乘以2再加1
    transform(src.begin(), src.end(), result.begin(), [](int x) {
        return x * 2 + 1;
    });
    cout << "2x+1：";
    for (int x : result) cout << x << " ";
    cout << endl;
    
    // accumulate：带lambda的累加
    int sum = accumulate(src.begin(), src.end(), 0, [](int acc, int x) {
        return acc + x * x;  // 平方和
    });
    cout << "平方和：" << sum << endl;
    
    // transform + accumulate：字符串拼接
    string names[] = {"Alice", "Bob", "Charlie", "David"};
    string allNames = accumulate(begin(names), end(names), string(""),
                                  [](const string& acc, const string& name) {
                                      return acc + (acc.empty() ? "" : ", ") + name;
                                  });
    cout << "所有名字：" << allNames << endl;
    
    // generate：使用lambda生成序列
    vector<int> fib(10);
    int a = 0, b = 1;
    generate(fib.begin(), fib.end(), [&a, &b]() {
        int next = a;
        a = b;
        b = next + b;
        return next;
    });
    cout << "斐波那契数列：";
    for (int x : fib) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

## 五、泛型lambda（C++14）

### 5.1 泛型lambda的基本使用

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    cout << "========== 泛型lambda（C++14） ==========\n" << endl;
    
    // 使用auto参数实现泛型lambda
    auto genericAdd = [](auto a, auto b) {
        return a + b;
    };
    
    cout << "genericAdd(3, 4) = " << genericAdd(3, 4) << endl;
    cout << "genericAdd(3.14, 2.71) = " << genericAdd(3.14, 2.71) << endl;
    cout << "genericAdd(string(\"Hello\"), string(\" World\")) = " 
         << genericAdd(string("Hello"), string(" World")) << endl;
    
    // 泛型lambda用于STL
    vector<int> intVec = {1, 2, 3, 4, 5};
    vector<double> doubleVec = {1.1, 2.2, 3.3, 4.4, 5.5};
    
    // 泛型打印
    auto print = [](const auto& container) {
        cout << "{";
        for (const auto& item : container) {
            cout << item << " ";
        }
        cout << "}" << endl;
    };
    
    print(intVec);
    print(doubleVec);
    
    // 泛型lambda与transform
    auto doubleIt = [](auto x) { return x * 2; };
    
    vector<int> intResult(intVec.size());
    transform(intVec.begin(), intVec.end(), intResult.begin(), doubleIt);
    print(intResult);
    
    vector<double> doubleResult(doubleVec.size());
    transform(doubleVec.begin(), doubleVec.end(), doubleResult.begin(), doubleIt);
    print(doubleResult);
    
    return 0;
}
```

### 5.2 初始化捕获（C++14）

```cpp
#include <iostream>
#include <memory>
#include <string>
using namespace std;

int main() {
    cout << "========== 初始化捕获（C++14） ==========\n" << endl;
    
    // 移动捕获：将unique_ptr移入lambda
    auto ptr = make_unique<int>(42);
    cout << "原始值：" << *ptr << endl;
    
    auto lambda = [p = move(ptr)]() {
        cout << "lambda中的值：" << *p << endl;
    };
    
    lambda();
    cout << "原始指针：" << (ptr ? "非空" : "nullptr") << endl;
    
    // 初始化捕获：创建新变量
    auto counter = [count = 0]() mutable {
        return ++count;
    };
    cout << "\n计数器：" << counter() << ", " << counter() << ", " << counter() << endl;
    
    // 初始化捕获：计算表达式
    int x = 10, y = 20;
    auto sum = [total = x + y]() {
        return total;
    };
    cout << "x + y = " << sum() << endl;
    
    // 初始化捕获：重命名捕获的变量
    string name = "Alice";
    auto greet = [n = name + " (modified)"]() {
        return "Hello, " + n;
    };
    cout << greet() << endl;
    
    return 0;
}
```

## 六、总结

lambda表达式是C++11中功能最强大、使用最广泛的特性之一，它极大地简化了C++代码的编写。

### 核心知识点

1. **基本语法**：`[capture](params) -> ret { body }`
2. **捕获方式**：
   - 值捕获`[x]`：获得副本，默认不可修改
   - 引用捕获`[&x]`：引用外部变量，可以修改
   - 隐式捕获`[=]`或`[&]`：捕获所有变量
   - 混合捕获`[=, &x]`或`[&, x]`
3. **mutable**：允许修改值捕获的变量副本
4. **函数指针**：无捕获的lambda可以转换为函数指针
5. **std::function**：可以存储任何lambda
6. **泛型lambda**（C++14）：使用auto参数
7. **初始化捕获**（C++14）：`[p = move(ptr)]`

### 最佳实践

- 优先使用lambda而不是手写函数对象
- 避免过长的lambda（超过5-10行考虑提取为命名函数）
- 注意捕获的变量的生命周期（特别是引用捕获）
- 使用`[=]`或`[&]`时注意不要意外捕获不需要的变量
- 移动捕获时，lambda变为不可复制的（只能移动）
- 对于需要复用的逻辑，考虑使用命名函数或函数对象

lambda表达式本质上是编译器自动生成的函数对象，因此它与STL算法完美配合。在现代C++中，lambda已经成为日常编程中不可或缺的工具。
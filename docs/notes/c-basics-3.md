---
title: C语言基础语法Ⅲ
date: 2026-07-26
tags:
  - C语言
  - 变量
  - 常量
  - 作用域
  - 存储类
categories:
  - C语言
---

# C语言基础语法Ⅲ——变量、常量与存储类

## 一、引言

变量是程序的记忆单元，常量是程序的不变法则。理解变量的声明、初始化、作用域和生命周期，是编写可靠程序的基础。C语言提供了多种存储类（auto、static、extern、register），它们决定了变量在内存中的位置和存活时间。本章将深入探讨这些概念，并用大量可运行代码验证每个知识点。

---

## 二、变量声明与定义

### 2.1 声明与定义的区别

在C语言中，"声明"和"定义"是两个不同的概念：
- **声明**：告诉编译器变量的类型和名字，不分配内存
- **定义**：不仅声明，还分配内存空间

```c
#include <stdio.h>

// 这是定义（分配内存）
int global_var = 10;

// 这是声明（引用外部变量，不分配内存）
extern int external_var;

// 函数声明（不实现）
void future_function(void);

int main() {
    printf("========== 声明与定义的区别 ==========\n\n");

    printf("全局变量 global_var = %d (定义，占%d字节)\n",
           global_var, (int)sizeof(global_var));

    // 局部变量定义
    int local_var = 20;
    printf("局部变量 local_var = %d (定义，占%d字节)\n",
           local_var, (int)sizeof(local_var));

    // 变量的地址
    printf("\n【变量内存地址】\n");
    printf("global_var 地址: %p\n", (void*)&global_var);
    printf("local_var 地址:  %p\n", (void*)&local_var);

    return 0;
}
```

### 2.2 变量初始化的多种方式

```c
#include <stdio.h>

int main() {
    printf("========== 变量初始化方式 ==========\n\n");

    // 方式1：声明后赋值
    int a;
    a = 100;
    printf("方式1 (声明后赋值): a = %d\n", a);

    // 方式2：声明时初始化
    int b = 200;
    printf("方式2 (声明时初始化): b = %d\n", b);

    // 方式3：函数式初始化
    int c(300);  // C++风格，部分编译器支持
    printf("方式3 (函数式): c = %d\n", c);

    // 方式4：多个变量同时初始化
    int d = 1, e = 2, f = 3;
    printf("方式4 (多个同时): d=%d, e=%d, f=%d\n", d, e, f);

    // 方式5：零初始化
    int g = 0;
    int h = {0};  // C99
    printf("方式5 (零初始化): g=%d, h=%d\n", g, h);

    // 方式6：表达式初始化
    int i = a + b + d;
    printf("方式6 (表达式): i = %d + %d + %d = %d\n", a, b, d, i);

    // 未初始化变量的值
    printf("\n【未初始化变量】\n");
    int uninitialized;
    printf("uninitialized = %d (垃圾值，编译器可能警告)\n", uninitialized);

    return 0;
}
```

### 2.3 变量命名规则

```c
#include <stdio.h>

int main() {
    printf("========== 变量命名规则 ==========\n\n");

    printf("【合法命名】\n");
    int myVar = 1;       // 驼峰命名
    int my_var = 2;      // 下划线命名
    int _var = 3;        // 以下划线开头（合法但不推荐）
    int var123 = 4;      // 字母+数字
    int Var = 5;         // 大小写敏感，Var和var不同

    printf("myVar=%d, my_var=%d, _var=%d, var123=%d, Var=%d\n",
           myVar, my_var, _var, var123, Var);

    printf("\n【非法命名（编译错误）】\n");
    printf("1int, my-var, my var, int, float, for\n");

    printf("\n【C语言关键字（32个）】\n");
    printf("auto break case char const continue\n");
    printf("default do double else enum extern\n");
    printf("float for goto if int long\n");
    printf("register return short signed sizeof static\n");
    printf("struct switch typedef union unsigned void\n");
    printf("volatile while\n");

    return 0;
}
```

---

## 三、常量

### 3.1 宏定义常量

```c
#include <stdio.h>

// 宏定义常量（预处理阶段文本替换）
#define PI 3.14159265358979323846
#define MAX_SIZE 256
#define GREETING "Hello, World!"
#define SQUARE(x) ((x) * (x))  // 宏函数，注意括号

int main() {
    printf("========== 宏定义常量 ==========\n\n");

    printf("PI = %.15f\n", PI);
    printf("MAX_SIZE = %d\n", MAX_SIZE);
    printf("GREETING = %s\n", GREETING);

    // 宏的陷阱
    printf("\n【宏的陷阱】\n");
    int a = 5;
    printf("SQUARE(5) = %d\n", SQUARE(5));
    printf("SQUARE(5+1) = %d (预期36，实际?)\n", SQUARE(5 + 1));
    printf("展开后: ((5+1) * (5+1)) = %d\n", ((5+1) * (5+1)));
    printf("如果没加括号: (5+1*5+1) = %d\n", (5+1*5+1));
    printf("结论：宏参数和宏体都必须加括号！\n");

    // 预定义宏
    printf("\n【预定义宏】\n");
    printf("__FILE__ = %s\n", __FILE__);
    printf("__LINE__ = %d\n", __LINE__);
    printf("__DATE__ = %s\n", __DATE__);
    printf("__TIME__ = %s\n", __TIME__);
    printf("__STDC__ = %d\n", __STDC__);
    printf("__STDC_VERSION__ = %ld\n", __STDC_VERSION__);

    return 0;
}
```

### 3.2 const 常量

```c
#include <stdio.h>

int main() {
    printf("========== const 常量 ==========\n\n");

    // const 修饰的变量
    const int MAX = 100;
    const double RATE = 0.05;
    const char NEWLINE = '\n';

    printf("MAX = %d\n", MAX);
    printf("RATE = %.2f\n", RATE);
    printf("sizeof(const int) = %zu\n", sizeof(MAX));

    // const 与指针的组合
    printf("\n【const 与指针】\n");

    int val = 10;
    int another = 20;

    // 1. 指向常量的指针：不能通过指针修改值
    const int* p1 = &val;
    printf("const int* p1 = &val: *p1 = %d\n", *p1);
    // *p1 = 30;  // 编译错误：不能修改
    p1 = &another;  // 可以改变指针本身
    printf("p1 = &another: *p1 = %d\n", *p1);

    // 2. 常量指针：指针本身不能改变
    int* const p2 = &val;
    printf("int* const p2 = &val: *p2 = %d\n", *p2);
    *p2 = 30;  // 可以修改值
    printf("*p2 = 30: val = %d\n", val);
    // p2 = &another;  // 编译错误：不能改变指针

    // 3. 指向常量的常量指针：都不能改
    const int* const p3 = &val;
    // *p3 = 40;   // 编译错误
    // p3 = &another;  // 编译错误

    printf("\n【const 内存位置】\n");
    const int global_const = 500;
    int normal_var = 600;
    printf("const变量地址: %p (通常在.rodata段)\n", (void*)&global_const);
    printf("普通变量地址:  %p (通常在栈上)\n", (void*)&normal_var);

    return 0;
}
```

### 3.3 枚举常量

```c
#include <stdio.h>

// 基本枚举
enum Color {
    RED,      // 0
    GREEN,    // 1
    BLUE      // 2
};

// 自定义值的枚举
enum Weekday {
    MONDAY = 1,
    TUESDAY,    // 2
    WEDNESDAY,  // 3
    THURSDAY,   // 4
    FRIDAY,     // 5
    SATURDAY,   // 6
    SUNDAY      // 7
};

// 位掩码枚举（2的幂）
enum Permission {
    READ    = 1 << 0,  // 1
    WRITE   = 1 << 1,  // 2
    EXECUTE = 1 << 2,  // 4
    DELETE  = 1 << 3   // 8
};

int main() {
    printf("========== 枚举常量 ==========\n\n");

    printf("【基本枚举】\n");
    printf("RED = %d, GREEN = %d, BLUE = %d\n", RED, GREEN, BLUE);
    printf("sizeof(enum Color) = %zu\n", sizeof(enum Color));

    printf("\n【自定义值枚举】\n");
    printf("MONDAY = %d, SUNDAY = %d\n", MONDAY, SUNDAY);

    // 枚举变量
    enum Color myColor = RED;
    printf("\nmyColor = %d\n", myColor);
    if (myColor == RED) {
        printf("颜色是红色\n");
    }
    myColor = BLUE;
    if (myColor == BLUE) {
        printf("颜色是蓝色\n");
    }

    // 位掩码枚举的应用
    printf("\n【位掩码枚举】\n");
    int my_permission = READ | WRITE;
    printf("权限值: READ|WRITE = %d\n", my_permission);
    printf("有读权限? %s\n", (my_permission & READ) ? "是" : "否");
    printf("有写权限? %s\n", (my_permission & WRITE) ? "是" : "否");
    printf("有执行权限? %s\n", (my_permission & EXECUTE) ? "是" : "否");
    printf("有删除权限? %s\n", (my_permission & DELETE) ? "是" : "否");

    return 0;
}
```

---

## 四、作用域

### 4.1 块作用域

```c
#include <stdio.h>

int main() {
    printf("========== 块作用域 ==========\n\n");

    int x = 10;  // 在整个main函数中可见

    printf("main块: x = %d\n", x);

    {
        // 内层块
        int y = 20;
        printf("内层块: x = %d, y = %d\n", x, y);

        // 可以遮蔽外层变量
        int x = 99;  // 遮蔽外层的x
        printf("内层块遮蔽: x = %d (外层x被遮蔽)\n", x);
    }
    // y 在这里不可见

    printf("回到main块: x = %d (内层x已销毁)\n", x);

    // 在for循环中定义变量（C99）
    for (int i = 0; i < 3; i++) {
        printf("循环内: i = %d\n", i);
    }
    // i 在这里不可见（C99）

    // if语句块中的变量
    if (1) {
        int z = 30;
        printf("if块内: z = %d\n", z);
    }
    // z 在这里不可见

    return 0;
}
```

### 4.2 文件作用域与全局变量

```c
#include <stdio.h>

// 文件作用域变量（全局变量）
int global_count = 0;           // 外部链接（其他文件可访问）
static int file_static = 100;   // 内部链接（仅本文件可访问）

void increment_count() {
    global_count++;
    file_static++;
}

void print_globals() {
    printf("global_count = %d, file_static = %d\n",
           global_count, file_static);
}

int main() {
    printf("========== 文件作用域 ==========\n\n");

    printf("初始值: ");
    print_globals();

    increment_count();
    printf("调用1次: ");
    print_globals();

    increment_count();
    increment_count();
    printf("调用3次: ");
    print_globals();

    // 块内可以访问全局变量
    {
        printf("块内访问: global_count = %d\n", global_count);
        global_count = 50;  // 修改全局变量
    }
    printf("块修改后: ");
    print_globals();

    return 0;
}
```

### 4.3 作用域完整示例

```c
#include <stdio.h>

int g = 100;  // 全局变量

void func() {
    int g = 200;  // 局部变量，遮蔽全局变量
    printf("func内: g = %d (局部)\n", g);
    printf("func内: 全局g = ??? (无法直接访问被遮蔽的全局变量)\n");
}

int main() {
    printf("========== 作用域完整示例 ==========\n\n");

    printf("main: g = %d (全局)\n", g);

    int g = 50;  // 局部变量，遮蔽全局
    printf("main局部: g = %d (局部)\n", g);

    func();

    // 在main中访问全局g
    {
        extern int g;  // 引用全局变量
        printf("main通过extern: g = %d (全局)\n", g);
    }

    printf("main局部: g = %d (局部)\n", g);

    return 0;
}
```

---

## 五、生命周期与存储类

### 5.1 auto（默认存储类）

```c
#include <stdio.h>

void test_auto() {
    auto int x = 0;  // auto是默认的，通常省略
    x++;
    printf("auto x = %d\n", x);
}

int main() {
    printf("========== auto 存储类 ==========\n\n");

    printf("auto变量在每个函数调用时重新创建：\n");
    test_auto();  // x = 1
    test_auto();  // x = 1 (重新创建)
    test_auto();  // x = 1 (重新创建)

    // auto变量的地址
    int a = 10, b = 20;
    printf("\nauto变量地址: a=%p, b=%p\n", (void*)&a, (void*)&b);
    printf("地址差: %td 字节 (栈增长方向)\n", (char*)&a - (char*)&b);

    return 0;
}
```

### 5.2 static 存储类

```c
#include <stdio.h>

// 静态全局变量
static int module_counter = 0;

void count_calls() {
    static int call_count = 0;  // 静态局部变量
    call_count++;
    printf("第 %d 次调用\n", call_count);
}

int* get_counter_ptr() {
    static int counter = 0;
    counter++;
    return &counter;
}

int main() {
    printf("========== static 存储类 ==========\n\n");

    // 静态局部变量：生命周期为整个程序
    printf("【静态局部变量】\n");
    count_calls();  // 第1次
    count_calls();  // 第2次
    count_calls();  // 第3次

    // 通过指针访问静态变量（函数返回后仍有效）
    printf("\n【通过指针访问静态变量】\n");
    int* p1 = get_counter_ptr();  // counter = 1
    int* p2 = get_counter_ptr();  // counter = 2
    int* p3 = get_counter_ptr();  // counter = 3
    printf("p1指向: %d, p2指向: %d, p3指向: %d\n", *p1, *p2, *p3);
    printf("p1和p2指向同一地址: %s\n", (p1 == p2) ? "是" : "否");

    // 静态局部变量的初始化只执行一次
    printf("\n【静态变量初始化只执行一次】\n");
    for (int i = 0; i < 3; i++) {
        static int once = 0;
        once++;
        printf("i=%d, once=%d\n", i, once);
    }

    return 0;
}
```

### 5.3 extern 存储类

假设有两个文件：main.c 和 helper.c

```c
// ===== helper.c =====
#include <stdio.h>

int shared_var = 42;        // 定义全局变量
static int hidden_var = 99; // 静态全局变量，仅本文件可见

void print_shared() {
    printf("shared_var = %d\n", shared_var);
}

static void internal_func() {  // 静态函数，仅本文件可见
    printf("这是内部函数\n");
}

// ===== main.c =====
#include <stdio.h>

// 声明外部变量（不分配内存，只告知编译器）
extern int shared_var;

// 声明外部函数
extern void print_shared();

int main() {
    printf("========== extern 存储类 ==========\n\n");

    printf("外部变量 shared_var = %d\n", shared_var);

    // 修改外部变量
    shared_var = 100;
    printf("修改后: ");
    print_shared();

    // 恢复
    shared_var = 42;
    printf("恢复后: ");
    print_shared();

    return 0;
}
```

### 5.4 register 存储类

```c
#include <stdio.h>
#include <time.h>

int main() {
    printf("========== register 存储类 ==========\n\n");

    printf("register 建议编译器将变量存储在寄存器中：\n");
    register int counter = 0;

    // 测试性能差异
    clock_t start, end;

    // 使用 register
    start = clock();
    for (register int i = 0; i < 100000000; i++) {
        counter += i;
    }
    end = clock();
    printf("register循环耗时: %.3f 秒\n",
           (double)(end - start) / CLOCKS_PER_SEC);

    // 不使用 register
    int counter2 = 0;
    start = clock();
    for (int i = 0; i < 100000000; i++) {
        counter2 += i;
    }
    end = clock();
    printf("普通循环耗时:   %.3f 秒\n",
           (double)(end - start) / CLOCKS_PER_SEC);

    printf("\n注意：\n");
    printf("1. register 只是建议，编译器可能忽略\n");
    printf("2. 不能对 register 变量取地址\n");
    printf("3. 现代编译器优化已足够好，register 实际意义有限\n");

    return 0;
}
```

---

## 六、内存四区模型

### 6.1 内存区域划分

```c
#include <stdio.h>
#include <stdlib.h>

// 全局/静态区
int global_init = 10;       // .data 段
int global_uninit;          // .bss 段
static int static_init = 20; // .data 段
static int static_uninit;    // .bss 段

// 常量区
const int const_global = 30; // .rodata 段

int main() {
    printf("========== 内存四区模型 ==========\n\n");

    // 栈区变量
    int stack_var = 40;
    int stack_arr[100];

    // 堆区变量
    int* heap_var = (int*)malloc(sizeof(int));
    *heap_var = 50;

    printf("【各区域变量地址】\n");
    printf("代码段(函数指针): %p\n", (void*)main);
    printf("常量区(const):     %p\n", (void*)&const_global);
    printf("全局区(.data):     %p\n", (void*)&global_init);
    printf("全局区(.bss):      %p\n", (void*)&global_uninit);
    printf("静态区(.data):     %p\n", (void*)&static_init);
    printf("静态区(.bss):      %p\n", (void*)&static_uninit);
    printf("栈区:              %p\n", (void*)&stack_var);
    printf("堆区:              %p\n", (void*)heap_var);

    printf("\n【内存布局(地址从低到高)】\n");
    printf("代码段 → 常量区 → 全局/静态区 → 堆区 → ... → 栈区\n");

    free(heap_var);
    return 0;
}
```

### 6.2 栈区详解

```c
#include <stdio.h>

void func_b(int n) {
    int b = n * 2;
    printf("func_b: b的地址 = %p, b = %d\n", (void*)&b, b);
}

void func_a(int n) {
    int a = n + 1;
    printf("func_a: a的地址 = %p, a = %d\n", (void*)&a, a);
    func_b(a);
    printf("func_a返回: a的地址 = %p\n", (void*)&a);
}

int main() {
    printf("========== 栈区详解 ==========\n\n");

    int x = 10;
    printf("main: x的地址 = %p, x = %d\n", (void*)&x, x);

    func_a(x);

    printf("main: x的地址 = %p (不变)\n", (void*)&x);

    printf("\n【栈帧结构】\n");
    printf("每个函数调用创建一个栈帧：\n");
    printf("┌─────────────────┐ ← 高地址(栈底)\n");
    printf("│  main 栈帧      │\n");
    printf("├─────────────────┤\n");
    printf("│  func_a 栈帧    │\n");
    printf("├─────────────────┤\n");
    printf("│  func_b 栈帧    │\n");
    printf("└─────────────────┘ ← 低地址(栈顶)\n");

    return 0;
}
```

---

## 七、综合实战：变量生命周期追踪器

```c
#include <stdio.h>
#include <stdlib.h>

// 全局计数器
static int global_counter = 0;

// 每次调用该函数，返回一个自增的追踪ID
int get_trace_id() {
    static int id = 0;
    return ++id;
}

// 模拟创建对象，返回追踪ID
int* create_object(const char* name) {
    int* obj = (int*)malloc(sizeof(int));
    *obj = get_trace_id();
    printf("[创建] %s: ID=%d, 堆地址=%p\n", name, *obj, (void*)obj);
    global_counter++;
    return obj;
}

// 销毁对象
void destroy_object(const char* name, int* obj) {
    printf("[销毁] %s: ID=%d, 堆地址=%p\n", name, *obj, (void*)obj);
    free(obj);
    global_counter--;
}

// 测试函数
void test_function() {
    int local_var = get_trace_id();  // 栈变量
    static int static_var = 0;       // 静态变量
    static_var = get_trace_id();

    printf("  [test_function] local_var(ID=%d, 栈地址=%p)\n",
           local_var, (void*)&local_var);
    printf("  [test_function] static_var(ID=%d, 静态地址=%p, 值保持=%d)\n",
           static_var, (void*)&static_var, static_var);

    int* heap_obj = create_object("test_function堆对象");
    // 注意：这里没有释放堆对象，造成内存泄漏（故意演示）
}

int main() {
    printf("========== 变量生命周期追踪器 ==========\n\n");

    printf("程序启动，全局对象数: %d\n\n", global_counter);

    // 栈变量
    int main_local = get_trace_id();
    printf("[main] main_local: ID=%d, 栈地址=%p\n\n",
           main_local, (void*)&main_local);

    // 堆变量
    int* main_heap = create_object("main堆对象");
    printf("\n");

    // 调用函数
    test_function();
    printf("\n");

    // 再次调用函数
    test_function();
    printf("\n");

    // 正确释放堆对象
    destroy_object("main堆对象", main_heap);

    printf("\n程序结束，全局对象数: %d\n", global_counter);
    printf("(如果大于0，说明有内存泄漏)\n");

    return 0;
}
```

---

## 本章小结

本章深入探讨了C语言的变量、常量与存储类：

1. **变量声明与初始化**：声明vs定义、多种初始化方式、命名规范
2. **常量**：宏定义（#define）、const常量、枚举常量，以及各自的陷阱
3. **作用域**：块作用域、文件作用域、函数作用域，变量遮蔽
4. **生命周期**：auto（栈，随函数调用）、static（全局生命周期，局部作用域）、extern（跨文件访问）、register（寄存器建议）
5. **内存四区**：代码段、全局/静态区、堆区、栈区的地址分布

理解变量在内存中的位置和生命周期，是后续学习指针、动态内存管理的重要基础。
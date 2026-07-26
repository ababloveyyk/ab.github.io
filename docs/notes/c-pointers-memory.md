---
title: C语言指针与内存Ⅳ
date: 2026-07-26
tags:
  - C语言
  - 指针
  - 内存管理
  - malloc
  - 动态内存
categories:
  - C语言
---

# C语言指针与内存Ⅳ

## 前言

指针是C语言的灵魂，也是最令初学者望而生畏的特性。本文将从底层原理出发，系统性地覆盖C语言指针与内存管理的方方面面，从一级指针到多级指针，从栈内存到堆内存，从内存四区模型到动态内存管理实践，力求让读者建立完整的指针知识体系。

本文所有代码示例均完整可运行，你可以在本地编译执行以加深理解。建议使用 `gcc -Wall -Wextra -o program source.c` 编译，并亲自运行观察结果。

---

## 一、一级指针：声明、解引用与取地址

### 1.1 什么是指针

指针本质上是一个**变量**，它存储的是另一个变量的**内存地址**。在32位系统中，指针占用4字节；在64位系统中，指针占用8字节。指针的类型决定了它指向的内存区域应该被解释为什么类型的数据。

```c
#include <stdio.h>

int main(void) {
    int a = 100;           // 普通整型变量
    int *p = &a;           // 声明一个指向int的指针，初始化为a的地址

    printf("变量 a 的值: %d\n", a);          // 输出: 100
    printf("变量 a 的地址: %p\n", &a);       // 输出: a的内存地址
    printf("指针 p 的值(即a的地址): %p\n", p); // 输出: 与&a相同
    printf("指针 p 自身的地址: %p\n", &p);    // 输出: p自己的地址
    printf("通过*p访问a的值: %d\n", *p);      // 输出: 100 (解引用)

    return 0;
}
```

### 1.2 & 取地址运算符 与 * 解引用运算符

`&` 和 `*` 是一对互逆的运算符：

- `&变量名`：获取该变量的内存地址。
- `*指针变量`：通过指针访问它所指向的内存空间中的值。

```c
#include <stdio.h>

int main(void) {
    int x = 42;
    int *ptr = &x;       // ptr指向x

    printf("x = %d\n", x);           // 42
    printf("*ptr = %d\n", *ptr);     // 42 (通过指针读取)

    *ptr = 99;                       // 通过指针修改x的值
    printf("修改后 x = %d\n", x);    // 99
    printf("修改后 *ptr = %d\n", *ptr); // 99

    /* 验证 & 和 * 互为逆运算 */
    printf("&(*ptr) == ptr ? %d\n", (&(*ptr) == ptr) ? 1 : 0); // 应为1
    printf("*(&x) == x ? %d\n", (*(&x) == x) ? 1 : 0);         // 应为1

    return 0;
}
```

### 1.3 指针的算术运算

指针算术运算不是简单的加减整数，而是按照指针所指向类型的大小进行伸缩。对于一个 `T *p`，`p + n` 的实际地址偏移量为 `n * sizeof(T)` 字节。

```c
#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;          // 指向数组首元素
    int *q = arr + 3;      // 指向第4个元素 (下标3)
    int *r = &arr[2];      // 指向第3个元素 (下标2)

    printf("sizeof(int) = %zu 字节\n", sizeof(int));

    printf("p    = %p, *p    = %d\n", (void*)p, *p);
    printf("p+1  = %p, *(p+1)= %d\n", (void*)(p+1), *(p+1));
    printf("p+2  = %p, *(p+2)= %d\n", (void*)(p+2), *(p+2));

    printf("q    = %p, *q    = %d\n", (void*)q, *q);
    printf("r    = %p, *r    = %d\n", (void*)r, *r);

    /* 指针相减：得到元素个数 */
    printf("q - p = %td (元素个数)\n", q - p);   // 3
    printf("r - p = %td (元素个数)\n", r - p);   // 2

    /* 指针比较 */
    if (p < q) {
        printf("p 指向的元素在 q 指向的元素之前\n");
    }

    return 0;
}
```

**指针算术运算规则总结：**

| 运算 | 含义 | 示例 |
|------|------|------|
| `p + n` | 向后移动 n 个元素 | `p + 3` 偏移 `3 * sizeof(T)` 字节 |
| `p - n` | 向前移动 n 个元素 | `p - 1` 偏移 `-sizeof(T)` 字节 |
| `p++` | 后移一个元素，指向下一个 | 常用于遍历 |
| `p - q` | 两个指针之间的元素个数 | 要求指向同一数组 |
| `p < q` | 比较地址高低 | 常用于循环边界 |

---

## 二、指针与数组：arr 与 &arr 的区别

### 2.1 数组名在大多数场景下退化为指针

这是C语言中一个经典的知识点，也是面试高频考点。数组名 `arr` 在表达式中通常会被隐式转换为指向首元素的指针，但有两个例外：
1. 作为 `sizeof` 的操作数时，`sizeof(arr)` 返回整个数组的大小。
2. 作为 `&` 的操作数时，`&arr` 返回指向整个数组的指针。

```c
#include <stdio.h>

int main(void) {
    int arr[5] = {1, 2, 3, 4, 5};

    /* arr 退化为指向首元素的指针 */
    printf("arr     = %p\n", (void*)arr);
    printf("&arr[0] = %p\n", (void*)&arr[0]);

    /* sizeof 的区别 */
    printf("sizeof(arr)     = %zu (整个数组的大小)\n", sizeof(arr));       // 5 * 4 = 20
    printf("sizeof(&arr[0]) = %zu (指针大小)\n", sizeof(&arr[0]));         // 8 (64位) 或 4 (32位)

    /* 地址值相同，但类型不同！ */
    printf("arr     = %p\n", (void*)arr);
    printf("&arr    = %p\n", (void*)&arr);
    printf("&arr[0] = %p\n", (void*)&arr[0]);

    /* 指针算术的差异：类型决定了步长 */
    printf("arr + 1     = %p (偏移 %zu 字节)\n",
           (void*)(arr + 1),
           (size_t)((char*)(arr + 1) - (char*)arr));       // 4 字节 (sizeof(int))
    printf("&arr + 1    = %p (偏移 %zu 字节)\n",
           (void*)(&arr + 1),
           (size_t)((char*)(&arr + 1) - (char*)&arr));     // 20 字节 (sizeof(arr) = 5*4)

    /* 验证：arr+1 是下一个元素，&arr+1 是跳过整个数组 */
    int *p_elem = arr + 1;        /* 指向 arr[1] */
    int (*p_arr)[5] = &arr + 1;   /* 指向整个数组之后的地址 */

    printf("*(arr+1) = %d\n", *p_elem);            // 2
    printf("(&arr+1) 比 arr 高 %td 个元素\n", p_arr - (&arr)); // 1 (跨越一个数组)

    return 0;
}
```

### 2.2 指针遍历数组

使用指针遍历数组是C语言中非常高效的方式，编译器通常能生成更优的代码。

```c
#include <stdio.h>

int main(void) {
    int arr[] = {10, 25, 38, 47, 56, 69, 72, 84, 91, 100};
    size_t n = sizeof(arr) / sizeof(arr[0]);

    /* 方式一：下标遍历 */
    printf("下标遍历: ");
    for (size_t i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    /* 方式二：指针遍历（递增指针） */
    printf("指针遍历: ");
    for (int *p = arr; p < arr + n; p++) {
        printf("%d ", *p);
    }
    printf("\n");

    /* 方式三：指针+偏移 */
    printf("偏移遍历: ");
    for (size_t i = 0; i < n; i++) {
        printf("%d ", *(arr + i));
    }
    printf("\n");

    /* 方式四：反向遍历 */
    printf("反向遍历: ");
    for (int *p = arr + n - 1; p >= arr; p--) {
        printf("%d ", *p);
    }
    printf("\n");

    return 0;
}
```

### 2.3 指针数组 vs 数组指针

这两个概念经常被混淆，但它们的含义完全不同：

- **指针数组**：`int *arr[5]` —— 一个数组，每个元素都是指针。
- **数组指针**：`int (*p)[5]` —— 一个指针，指向一个包含5个int的数组。

```c
#include <stdio.h>

int main(void) {
    /* 指针数组：每个元素是一个指针 */
    int a = 1, b = 2, c = 3;
    int *ptr_arr[3] = {&a, &b, &c};  // 数组，元素类型为 int*

    printf("指针数组:\n");
    for (int i = 0; i < 3; i++) {
        printf("  ptr_arr[%d] -> %d\n", i, *ptr_arr[i]);
    }

    /* 数组指针：指向一个数组 */
    int matrix[3][4] = {
        { 1,  2,  3,  4},
        { 5,  6,  7,  8},
        { 9, 10, 11, 12}
    };
    int (*p_arr)[4] = matrix;   // 指向包含4个int的数组的指针

    printf("数组指针遍历二维数组:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", p_arr[i][j]);  // 等价于 *(*(p_arr+i)+j)
        }
        printf("\n");
    }

    return 0;
}
```

---

## 三、二级指针：指向指针的指针

### 3.1 概念与声明

二级指针存储的是一个一级指针的地址。它的声明形式为 `类型 **变量名`。每一级指针都需要用 `*` 来解引用。

```c
#include <stdio.h>

int main(void) {
    int value = 42;
    int *p1 = &value;     // 一级指针，指向value
    int **p2 = &p1;       // 二级指针，指向p1

    printf("value = %d\n", value);
    printf("*p1   = %d\n", *p1);      // 通过一级指针访问
    printf("**p2  = %d\n", **p2);     // 通过二级指针访问

    printf("\n地址关系:\n");
    printf("&value = %p  (value的地址)\n", (void*)&value);
    printf("p1     = %p  (p1的值 = value的地址)\n", (void*)p1);
    printf("&p1    = %p  (p1自身的地址)\n", (void*)&p1);
    printf("p2     = %p  (p2的值 = p1的地址)\n", (void*)p2);
    printf("&p2    = %p  (p2自身的地址)\n", (void*)&p2);

    /* 通过二级指针修改原始值 */
    **p2 = 100;
    printf("\n通过 **p2 = 100 修改后: value = %d\n", value);

    /* 通过二级指针修改一级指针的指向 */
    int another = 999;
    *p2 = &another;       // 让p1指向another
    printf("通过 *p2 = &another 修改后: *p1 = %d\n", *p1);

    return 0;
}
```

### 3.2 二级指针在函数参数中的应用

当你需要在函数内部修改一个指针的指向时，必须传递该指针的地址（即二级指针）。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 错误示范：试图在函数内分配内存（会失败） */
void allocate_wrong(char *ptr, size_t size) {
    ptr = (char*)malloc(size);  // 只修改了局部副本！
    if (ptr) {
        strcpy(ptr, "Hello (wrong)");
    }
}

/* 正确做法：传递二级指针 */
void allocate_correct(char **ptr, size_t size) {
    *ptr = (char*)malloc(size);  // 修改的是调用者传入的指针
    if (*ptr) {
        strcpy(*ptr, "Hello (correct)");
    }
}

int main(void) {
    char *str1 = NULL;
    char *str2 = NULL;

    /* 错误方式 */
    allocate_wrong(str1, 50);
    printf("str1 = %s\n", str1 ? str1 : "(null) - 内存分配失败!");

    /* 正确方式 */
    allocate_correct(&str2, 50);
    printf("str2 = %s\n", str2 ? str2 : "(null)");

    /* 清理 */
    free(str1);  // free(NULL) 是安全的
    free(str2);

    return 0;
}
```

**输出的内存布局图：**

```
调用 allocate_wrong(str1, 50) 时:
  main中的str1: [NULL]                  (地址: 0x1000)
  函数参数ptr:  [NULL]  →  [NULL]       (地址: 0x2000, 是str1的副本)
  ptr = malloc(...) 只修改了0x2000处的值，main中的str1仍是NULL

调用 allocate_correct(&str2, 50) 时:
  main中的str2: [NULL]                   (地址: 0x1008)
  函数参数ptr:  [0x1008]  →  str2       (地址: 0x2008, 存储的是str2的地址)
  *ptr = malloc(...) 修改了0x1008处的值，main中的str2被正确更新
```

---

## 四、函数指针

### 4.1 概念与声明

函数指针存储的是函数的入口地址。函数名本身就是一个指向该函数的指针（与数组名类似，但函数名不会隐式转换为指针变量，它本身就是函数指针常量）。

声明语法：`返回类型 (*指针变量名)(参数类型列表)`

```c
#include <stdio.h>

/* 几个简单的数学函数 */
int add(int a, int b)    { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }
int divide(int a, int b)   { return b != 0 ? a / b : 0; }

int main(void) {
    /* 声明函数指针并初始化 */
    int (*operation)(int, int);  // 函数指针，指向 int(int, int) 类型的函数

    operation = add;
    printf("add(10, 5)      = %d\n", operation(10, 5));

    operation = subtract;
    printf("subtract(10, 5) = %d\n", operation(10, 5));

    operation = multiply;
    printf("multiply(10, 5) = %d\n", operation(10, 5));

    operation = divide;
    printf("divide(10, 5)   = %d\n", operation(10, 5));

    /* 验证函数名就是函数指针 */
    printf("\nadd 的地址    = %p\n", (void*)add);
    printf("&add 的地址   = %p\n", (void*)&add);
    printf("二者相同: %s\n", (add == &add) ? "是" : "否");

    return 0;
}
```

### 4.2 函数指针数组：实现计算器

```c
#include <stdio.h>

int add(int a, int b)    { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }
int divide(int a, int b)   { return b != 0 ? a / b : 0; }

int main(void) {
    /* 函数指针数组 */
    int (*ops[4])(int, int) = {add, subtract, multiply, divide};
    const char *names[] = {"加法", "减法", "乘法", "除法"};

    int x = 20, y = 4;

    for (int i = 0; i < 4; i++) {
        printf("%s: %d %s %d = %d\n",
               names[i], x,
               (i == 0) ? "+" : (i == 1) ? "-" : (i == 2) ? "*" : "/",
               y,
               ops[i](x, y));
    }

    return 0;
}
```

### 4.3 函数指针作为回调

```c
#include <stdio.h>

/* 通用迭代器：对数组每个元素应用回调函数 */
void for_each(int *arr, size_t len, void (*callback)(int*, size_t)) {
    for (size_t i = 0; i < len; i++) {
        callback(&arr[i], i);
    }
}

void print_double(int *val, size_t idx) {
    printf("arr[%zu] = %d, 翻倍 = %d\n", idx, *val, *val * 2);
}

void square(int *val, size_t idx) {
    (void)idx;  // 未使用
    *val = (*val) * (*val);
}

int main(void) {
    int arr[] = {1, 2, 3, 4, 5};
    size_t n = sizeof(arr) / sizeof(arr[0]);

    printf("原始数组:\n");
    for (size_t i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n\n");

    printf("打印翻倍:\n");
    for_each(arr, n, print_double);

    printf("\n平方变换:\n");
    for_each(arr, n, square);
    for (size_t i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");

    return 0;
}
```

### 4.4 使用 typedef 简化函数指针

```c
#include <stdio.h>

/* 定义函数指针类型别名 */
typedef int (*binary_op_t)(int, int);

int max(int a, int b) { return a > b ? a : b; }
int min(int a, int b) { return a < b ? a : b; }

/* 高阶函数：接受函数指针作为参数 */
int apply(binary_op_t op, int x, int y) {
    return op(x, y);
}

int main(void) {
    binary_op_t my_op = max;
    printf("max(10, 20) = %d\n", apply(my_op, 10, 20));

    my_op = min;
    printf("min(10, 20) = %d\n", apply(my_op, 10, 20));

    return 0;
}
```

---

## 五、void* 指针与类型转换

### 5.1 什么是 void*

`void*` 是C语言中的"泛型指针"，它可以指向任何类型的数据，但不能直接解引用，必须经过类型转换。

```c
#include <stdio.h>

int main(void) {
    int    i_val = 42;
    double d_val = 3.14159;
    char   c_val = 'Z';

    void *vp;

    /* void* 可以指向任何类型 */
    vp = &i_val;
    printf("通过 void* 访问 int:    %d\n", *(int*)vp);

    vp = &d_val;
    printf("通过 void* 访问 double: %f\n", *(double*)vp);

    vp = &c_val;
    printf("通过 void* 访问 char:   %c\n", *(char*)vp);

    /* void* 指针算术：C标准不允许对void*做算术运算（GCC扩展允许） */
    /* 标准做法是先转换为char*再做算术 */
    int arr[] = {10, 20, 30};
    vp = arr;

    printf("\n通过 void* 遍历数组:\n");
    for (int i = 0; i < 3; i++) {
        printf("  arr[%d] = %d\n", i, *((int*)vp + i));
    }

    return 0;
}
```

### 5.2 void* 在通用库函数中的应用

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 通用交换函数：可以交换任意类型的数据 */
void generic_swap(void *a, void *b, size_t size) {
    /* 分配临时缓冲区，逐字节交换 */
    void *temp = malloc(size);
    if (!temp) return;

    memcpy(temp, a, size);
    memcpy(a, b, size);
    memcpy(b, temp, size);

    free(temp);
}

/* 通用查找函数：在数组中查找元素 */
int generic_find(void *arr, size_t count, size_t elem_size,
                 void *target, int (*cmp)(const void*, const void*)) {
    char *base = (char*)arr;
    for (size_t i = 0; i < count; i++) {
        if (cmp(base + i * elem_size, target) == 0) {
            return (int)i;
        }
    }
    return -1;
}

int cmp_int(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

int cmp_double(const void *a, const void *b) {
    double diff = (*(double*)a - *(double*)b);
    if (diff > 0) return 1;
    if (diff < 0) return -1;
    return 0;
}

int main(void) {
    /* 测试通用交换 */
    int x = 10, y = 20;
    printf("交换前: x=%d, y=%d\n", x, y);
    generic_swap(&x, &y, sizeof(int));
    printf("交换后: x=%d, y=%d\n", x, y);

    double d1 = 1.5, d2 = 3.7;
    printf("交换前: d1=%.1f, d2=%.1f\n", d1, d2);
    generic_swap(&d1, &d2, sizeof(double));
    printf("交换后: d1=%.1f, d2=%.1f\n", d1, d2);

    /* 测试通用查找 */
    int iarr[] = {5, 12, 8, 3, 9};
    int target = 8;
    int pos = generic_find(iarr, 5, sizeof(int), &target, cmp_int);
    printf("\n查找 %d: 位置 = %d\n", target, pos);

    double darr[] = {1.1, 2.2, 3.3, 4.4};
    double dtarget = 3.3;
    pos = generic_find(darr, 4, sizeof(double), &dtarget, cmp_double);
    printf("查找 %.1f: 位置 = %d\n", dtarget, pos);

    return 0;
}
```

---

## 六、内存四区模型详解

C语言程序运行时的内存布局可以划分为四个主要区域，理解这个模型对于编写健壮的C程序至关重要。

### 6.1 内存布局总览

```
高地址
+---------------------------+
|    命令行参数与环境变量      |
+---------------------------+
|        栈 (Stack)          |
|    ┌─────────────────┐     |
|    │ 局部变量、函数参数  │     |
|    │ 返回地址、帧指针    │     |
|    │ 向下增长 ↓        │     |
|    └─────────────────┘     |
+---------------------------+
|          ↓                 |
|     (可用空间)              |
|          ↑                 |
+---------------------------+
|        堆 (Heap)           |
|    ┌─────────────────┐     |
|    │ 动态分配的内存      │     |
|    │ (malloc/calloc)    │     |
|    │ 向上增长 ↑        │     |
|    └─────────────────┘     |
+---------------------------+
|    全局/静态数据区          |
|  ┌────────┬────────────┐   |
|  │ .bss   │ .data      │   |
|  │未初始化  │ 已初始化    │   |
|  │全局变量  │ 全局变量    │   |
|  └────────┴────────────┘   |
+---------------------------+
|      代码段 (.text)         |
|  ┌─────────────────────┐   |
|  │ 程序机器指令           │   |
|  │ 只读数据 (.rodata)    │   |
|  └─────────────────────┘   |
+---------------------------+
低地址
```

### 6.2 代码段详解

```c
#include <stdio.h>

/* 代码段中的常量字符串 */
const char *msg = "Hello, World!";  // msg本身在数据段，"Hello, World!"在.rodata

int main(void) {
    /* 字符串字面量实际存储在.rodata只读数据段 */
    char *s1 = "Immutable";  // s1指向.rodata中的字符串
    char s2[] = "Mutable";   // s2在栈上，从.rodata复制了一份

    printf("代码段地址范围 (main函数地址):  %p\n", (void*)main);
    printf(".rodata段地址 (常量字符串):     %p\n", (void*)msg);
    printf("常量字符串指针:                   %p\n", (void*)s1);
    printf("栈上字符串数组:                   %p\n", (void*)s2);

    /* 尝试修改只读数据会导致段错误(segfault) */
    /* s1[0] = 'X';  // 危险！不要这样做！ */

    /* 栈上的数组可以修改 */
    s2[0] = 'X';
    printf("修改后的数组: %s\n", s2);

    return 0;
}
```

### 6.3 全局/静态数据区详解

全局/静态数据区又分为两个子区域：
- **.data 段**：存放已初始化的全局变量和静态变量。
- **.bss 段**：存放未初始化的全局变量和静态变量（程序启动时自动清零）。

```c
#include <stdio.h>

/* 已初始化的全局变量 → .data 段 */
int global_initialized = 100;
static int static_initialized = 200;

/* 未初始化的全局变量 → .bss 段（自动初始化为0） */
int global_uninitialized;
static int static_uninitialized;

void test_static(void) {
    /* 局部静态变量 → .data 或 .bss，生命周期贯穿整个程序 */
    static int call_count = 0;  // .data段（已初始化）
    static int other_static;    // .bss段（未初始化）

    call_count++;
    other_static += 10;

    printf("  test_static 被调用 %d 次, other_static = %d\n",
           call_count, other_static);
}

int main(void) {
    printf("全局/静态变量:\n");
    printf("  global_initialized   = %d (地址: %p)\n", global_initialized, (void*)&global_initialized);
    printf("  global_uninitialized = %d (地址: %p)\n", global_uninitialized, (void*)&global_uninitialized);
    printf("  static_initialized   = %d (地址: %p)\n", static_initialized, (void*)&static_initialized);
    printf("  static_uninitialized = %d (地址: %p)\n", static_uninitialized, (void*)&static_uninitialized);

    printf("\n");
    for (int i = 0; i < 3; i++) {
        test_static();
    }

    return 0;
}
```

### 6.4 栈区详解

栈区由编译器自动管理，用于存储函数的局部变量、函数参数、返回地址等。遵循**后进先出（LIFO）**原则。

```c
#include <stdio.h>

void func_c(int depth) {
    int local_c = 30;
    printf("  func_c[深度%d]: local_c 地址 = %p, 值 = %d\n", depth, (void*)&local_c, local_c);
}

void func_b(int depth) {
    int local_b = 20;
    printf("  func_b[深度%d]: local_b 地址 = %p, 值 = %d\n", depth, (void*)&local_b, local_b);
    func_c(depth + 1);
}

void func_a(int depth) {
    int local_a = 10;
    printf("  func_a[深度%d]: local_a 地址 = %p, 值 = %d\n", depth, (void*)&local_a, local_a);
    func_b(depth + 1);
}

int main(void) {
    int main_local = 0;
    printf("栈区演示:\n");
    printf("  main: main_local 地址 = %p\n", (void*)&main_local);
    func_a(1);
    printf("  main: main_local 地址 = %p (不变)\n", (void*)&main_local);

    return 0;
}
```

**栈的特点：**

| 特性 | 说明 |
|------|------|
| 分配方式 | 编译器自动分配和释放 |
| 大小限制 | 通常较小（Linux默认8MB，Windows默认1MB） |
| 生命周期 | 随函数调用创建，函数返回时销毁 |
| 访问速度 | 快，因为地址连续，CPU缓存友好 |
| 典型问题 | 返回局部变量地址（悬垂指针） |

### 6.5 堆区详解

堆区是程序员手动管理的内存区域，通过 `malloc`、`calloc`、`realloc`、`free` 等函数进行操作。

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int stack_var = 42;
    int *heap_var = (int*)malloc(sizeof(int));

    if (!heap_var) {
        printf("内存分配失败!\n");
        return 1;
    }

    *heap_var = 99;

    printf("栈变量: 地址 = %p, 值 = %d\n", (void*)&stack_var, stack_var);
    printf("堆变量: 指针地址 = %p, 指向的堆地址 = %p, 值 = %d\n",
           (void*)&heap_var, (void*)heap_var, *heap_var);

    /* 注意：栈地址和堆地址通常差距很大 */
    printf("栈地址 vs 堆地址的差距: %td 字节\n",
           (char*)&stack_var - (char*)heap_var);

    free(heap_var);
    heap_var = NULL;  // 良好的习惯：free后置NULL

    return 0;
}
```

---

## 七、动态内存分配：malloc、calloc、realloc、free

### 7.1 malloc

`malloc(size_t size)` 分配 `size` 字节的未初始化内存，返回 `void*`。分配的内存内容**未初始化**，可能包含任意值。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    int n = 5;

    /* 分配5个int的内存 */
    int *arr = (int*)malloc(n * sizeof(int));
    if (!arr) {
        fprintf(stderr, "malloc 失败!\n");
        return 1;
    }

    /* malloc分配的内存未初始化，可能包含垃圾值 */
    printf("malloc 分配后的初始值(垃圾值):\n");
    for (int i = 0; i < n; i++) {
        printf("  arr[%d] = %d\n", i, arr[i]);
    }

    /* 初始化 */
    for (int i = 0; i < n; i++) {
        arr[i] = i * 10;
    }

    printf("\n初始化后:\n");
    for (int i = 0; i < n; i++) {
        printf("  arr[%d] = %d\n", i, arr[i]);
    }

    free(arr);
    return 0;
}
```

### 7.2 calloc

`calloc(size_t count, size_t size)` 分配 `count * size` 字节的内存，并将所有位**初始化为零**。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    int n = 5;

    /* calloc: 分配并清零 */
    int *arr = (int*)calloc(n, sizeof(int));
    if (!arr) {
        fprintf(stderr, "calloc 失败!\n");
        return 1;
    }

    printf("calloc 分配后的初始值(全为零):\n");
    for (int i = 0; i < n; i++) {
        printf("  arr[%d] = %d\n", i, arr[i]);
    }

    free(arr);

    /* calloc 也常用于结构体数组 */
    typedef struct {
        int id;
        char name[32];
        double score;
    } Student;

    Student *students = (Student*)calloc(3, sizeof(Student));
    if (students) {
        printf("\ncalloc 结构体数组(全为零):\n");
        for (int i = 0; i < 3; i++) {
            printf("  Student[%d]: id=%d, name=\"%s\", score=%.1f\n",
                   i, students[i].id, students[i].name, students[i].score);
        }
        free(students);
    }

    return 0;
}
```

### 7.3 realloc

`realloc(void *ptr, size_t new_size)` 调整已分配内存块的大小。这是实现动态数组的核心函数。

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *arr = (int*)malloc(3 * sizeof(int));
    if (!arr) return 1;

    arr[0] = 10; arr[1] = 20; arr[2] = 30;

    printf("原始数组 (容量=3):\n");
    for (int i = 0; i < 3; i++) printf("  arr[%d] = %d\n", i, arr[i]);

    /* 扩容到5个元素 */
    int *tmp = (int*)realloc(arr, 5 * sizeof(int));
    if (!tmp) {
        /* realloc失败时，原内存块仍然有效！ */
        printf("realloc 失败，原数据保留\n");
        free(arr);
        return 1;
    }
    arr = tmp;

    printf("\n扩容后 (容量=5):\n");
    for (int i = 0; i < 5; i++) {
        printf("  arr[%d] = %d\n", i, arr[i]);
    }

    /* 缩容到2个元素 */
    arr = (int*)realloc(arr, 2 * sizeof(int));
    printf("\n缩容后 (容量=2):\n");
    for (int i = 0; i < 2; i++) {
        printf("  arr[%d] = %d\n", i, arr[i]);
    }

    free(arr);
    return 0;
}
```

**realloc 行为总结：**

```
realloc(ptr, new_size) 的行为:
┌─────────────────────────────────────────────────────────┐
│ 1. ptr == NULL:          等同于 malloc(new_size)         │
│ 2. new_size == 0:       等同于 free(ptr)，返回NULL       │
│ 3. 新大小 == 旧大小:     直接返回原指针                   │
│ 4. 新大小 > 旧大小:      尝试原地扩展，否则分配新内存     │
│ 5. 新大小 < 旧大小:      截断，原数据前new_size字节保留    │
│ 6. 失败:                 返回NULL，原内存块仍有效         │
└─────────────────────────────────────────────────────────┘
```

### 7.4 free

`free(void *ptr)` 释放之前通过 `malloc/calloc/realloc` 分配的内存。

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    /* 正确的分配和释放流程 */
    int *p = (int*)malloc(sizeof(int) * 10);
    if (!p) {
        fprintf(stderr, "分配失败\n");
        return 1;
    }

    /* 使用内存... */
    for (int i = 0; i < 10; i++) p[i] = i;

    /* 释放 */
    free(p);
    p = NULL;  // 防止悬垂指针

    /* free(NULL) 是安全的，什么都不做 */
    free(NULL);

    printf("内存管理演示完成\n");
    return 0;
}
```

---

## 八、常见内存Bug详解

### 8.1 内存泄漏

内存泄漏是指程序分配了堆内存但从未释放，导致内存被逐渐耗尽。

```c
#include <stdio.h>
#include <stdlib.h>

/* 内存泄漏示例1：忘记free */
void leak_example1(void) {
    int *p = (int*)malloc(1024 * 1024);  // 分配1MB
    /* 函数返回前没有free(p)，这1MB永远泄漏了 */
    printf("leak_example1: 分配了1MB但没有释放\n");
}

/* 内存泄漏示例2：丢失指针引用 */
void leak_example2(void) {
    int *p = (int*)malloc(100 * sizeof(int));
    p = (int*)malloc(200 * sizeof(int));  // 重新赋值，原来100个int的内存泄漏了
    free(p);  // 只释放了200个int的那块内存
}

/* 内存泄漏示例3：循环中分配 */
void leak_example3(void) {
    for (int i = 0; i < 5; i++) {
        int *p = (int*)malloc(sizeof(int));
        *p = i;
        printf("  leak_example3: 分配了 *p=%d\n", *p);
        /* 每次都泄漏，因为p离开作用域后没有free */
    }
}

int main(void) {
    printf("内存泄漏演示（这些泄漏是故意的，用于演示）:\n\n");
    leak_example1();
    leak_example2();
    leak_example3();

    printf("\n使用 valgrind 检测: valgrind --leak-check=full ./program\n");
    return 0;
}
```

### 8.2 悬垂指针

悬垂指针（Dangling Pointer）是指指向已释放内存的指针，使用它会导致未定义行为。

```c
#include <stdio.h>
#include <stdlib.h>

/* 返回局部变量的地址（悬垂指针） */
int* return_local_address(void) {
    int local = 42;
    return &local;  // 危险！返回栈变量的地址
}

/* 修改已释放的内存 */
void use_after_free(void) {
    int *p = (int*)malloc(sizeof(int));
    *p = 100;
    free(p);
    /* p现在是悬垂指针 */
    /* *p = 200;  // 未定义行为！不要这样做 */
    printf("use_after_free: p已被释放，不应再使用\n");
}

int main(void) {
    /* 悬垂指针示例1：返回局部变量地址 */
    int *dangling = return_local_address();
    printf("悬垂指针指向的值（可能已损坏）: %d\n", *dangling);

    /* 悬垂指针示例2：使用已释放的内存 */
    use_after_free();

    /* 悬垂指针示例3：多次指向同一内存 */
    int *a = (int*)malloc(sizeof(int));
    int *b = a;   // b和a指向同一块内存
    *a = 50;
    free(a);      // 释放内存
    a = NULL;
    /* 此时b是悬垂指针！*/
    /* *b = 60;  // 未定义行为！ */
    printf("指针b现在指向已释放的内存\n");

    return 0;
}
```

### 8.3 双重释放

对同一块内存调用 `free()` 两次会导致未定义行为，通常会导致程序崩溃。

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("双重释放演示:\n");

    int *p = (int*)malloc(sizeof(int) * 10);
    if (!p) return 1;

    free(p);
    printf("第一次 free(p) 完成\n");

    /* free(p);  // 双重释放！不要这样做！ */

    /* 正确的做法：free后置NULL */
    p = NULL;
    free(p);  // free(NULL)是安全的
    printf("free(NULL) 是安全的\n");

    return 0;
}
```

### 8.4 缓冲区溢出

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    /* 堆缓冲区溢出 */
    char *buf = (char*)malloc(5);
    if (!buf) return 1;

    printf("分配了5字节的缓冲区\n");

    /* 安全的写入 */
    strcpy(buf, "ABCD");  // 4个字符 + '\0' = 5字节，刚好
    printf("安全写入: \"%s\"\n", buf);

    /* 危险的写入 */
    /* strcpy(buf, "ABCDEFGHIJ");  // 覆盖了堆管理结构！ */

    /* 栈缓冲区溢出 */
    char stack_buf[8];
    printf("\n栈缓冲区大小: 8字节\n");

    /* strcpy(stack_buf, "This is a very long string");  // 溢出！ */

    /* 使用安全函数 */
    strncpy(stack_buf, "Hello", sizeof(stack_buf) - 1);
    stack_buf[sizeof(stack_buf) - 1] = '\0';  // 确保以'\0'结尾
    printf("安全写入栈缓冲区: \"%s\"\n", stack_buf);

    free(buf);
    return 0;
}
```

---

## 九、动态数组实现：模拟 vector 的 realloc 逻辑

下面实现一个类似C++ `std::vector` 的动态整型数组，包含自动扩容和缩容逻辑。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 动态数组结构体 */
typedef struct {
    int *data;         // 指向数据存储区的指针
    size_t size;       // 当前元素个数
    size_t capacity;   // 当前分配的容量
} DynamicArray;

/* 初始化动态数组 */
DynamicArray* da_create(void) {
    DynamicArray *da = (DynamicArray*)malloc(sizeof(DynamicArray));
    if (!da) return NULL;

    da->capacity = 4;                        // 初始容量为4
    da->size = 0;
    da->data = (int*)malloc(da->capacity * sizeof(int));
    if (!da->data) {
        free(da);
        return NULL;
    }
    return da;
}

/* 销毁动态数组 */
void da_destroy(DynamicArray *da) {
    if (da) {
        free(da->data);
        free(da);
    }
}

/* 确保容量充足，不足则扩容（类似 vector 的 realloc 逻辑） */
static int da_ensure_capacity(DynamicArray *da, size_t needed) {
    if (da->size + needed <= da->capacity) {
        return 0;  // 容量充足
    }

    /* 扩容策略：至少翻倍，确保能容纳所需 */
    size_t new_capacity = da->capacity * 2;
    while (new_capacity < da->size + needed) {
        new_capacity *= 2;
    }

    int *new_data = (int*)realloc(da->data, new_capacity * sizeof(int));
    if (!new_data) {
        return -1;  // 扩容失败
    }

    da->data = new_data;
    da->capacity = new_capacity;

    printf("  [扩容] 新容量: %zu\n", da->capacity);
    return 0;
}

/* 在末尾添加元素 */
int da_push_back(DynamicArray *da, int value) {
    if (da_ensure_capacity(da, 1) != 0) {
        return -1;
    }
    da->data[da->size++] = value;
    return 0;
}

/* 在指定位置插入元素 */
int da_insert(DynamicArray *da, size_t index, int value) {
    if (index > da->size) return -1;
    if (da_ensure_capacity(da, 1) != 0) return -1;

    /* 将 index 及之后的元素后移 */
    memmove(&da->data[index + 1], &da->data[index],
            (da->size - index) * sizeof(int));
    da->data[index] = value;
    da->size++;
    return 0;
}

/* 删除指定位置的元素 */
int da_remove(DynamicArray *da, size_t index) {
    if (index >= da->size) return -1;

    /* 将 index 之后的元素前移 */
    if (index < da->size - 1) {
        memmove(&da->data[index], &da->data[index + 1],
                (da->size - index - 1) * sizeof(int));
    }
    da->size--;

    /* 缩容策略：当使用率低于25%时，容量减半（最低保持4） */
    if (da->capacity > 4 && da->size < da->capacity / 4) {
        size_t new_capacity = da->capacity / 2;
        int *new_data = (int*)realloc(da->data, new_capacity * sizeof(int));
        if (new_data) {
            da->data = new_data;
            da->capacity = new_capacity;
            printf("  [缩容] 新容量: %zu\n", da->capacity);
        }
    }
    return 0;
}

/* 获取元素 */
int da_get(const DynamicArray *da, size_t index) {
    if (index >= da->size) {
        fprintf(stderr, "索引越界: %zu >= %zu\n", index, da->size);
        return 0;
    }
    return da->data[index];
}

/* 打印数组 */
void da_print(const DynamicArray *da) {
    printf("DynamicArray [size=%zu, capacity=%zu]: ", da->size, da->capacity);
    if (da->size == 0) {
        printf("(空)");
    } else {
        for (size_t i = 0; i < da->size; i++) {
            printf("%d ", da->data[i]);
        }
    }
    printf("\n");
}

/* 查找元素（返回索引，未找到返回-1） */
int da_find(const DynamicArray *da, int value) {
    for (size_t i = 0; i < da->size; i++) {
        if (da->data[i] == value) return (int)i;
    }
    return -1;
}

int main(void) {
    DynamicArray *da = da_create();
    if (!da) {
        fprintf(stderr, "创建动态数组失败\n");
        return 1;
    }

    printf("=== 动态数组演示 ===\n\n");

    /* 添加元素，触发扩容 */
    printf("添加元素:\n");
    for (int i = 1; i <= 20; i++) {
        da_push_back(da, i * 10);
    }
    da_print(da);

    /* 插入 */
    printf("\n在索引5处插入999:\n");
    da_insert(da, 5, 999);
    da_print(da);

    /* 删除元素，触发缩容 */
    printf("\n删除元素:\n");
    while (da->size > 3) {
        da_remove(da, da->size - 1);
    }
    da_print(da);

    /* 访问 */
    printf("\n访问元素:\n");
    for (size_t i = 0; i < da->size; i++) {
        printf("  da[%zu] = %d\n", i, da_get(da, i));
    }

    /* 查找 */
    printf("\n查找 999: 位置 = %d\n", da_find(da, 999));
    printf("查找 777: 位置 = %d (未找到)\n", da_find(da, 777));

    da_destroy(da);
    return 0;
}
```

**动态数组扩容策略图示：**

```
初始: capacity=4, size=0
  data: [ _  _  _  _ ]

添加4个元素后: size=4, capacity=4
  data: [10 20 30 40]

添加第5个元素时触发扩容: capacity 4→8
  data: [10 20 30 40 50 _ _ _]

添加第9个元素时触发扩容: capacity 8→16
  data: [10 20 30 40 50 60 70 80 90 _ _ _ _ _ _ _]

删除到只剩3个元素时触发缩容: capacity 16→8→4
  data: [10 20 30 _]
```

---

## 十、指针遍历字符串统计单词数

使用指针遍历字符串，统计单词数量，同时计算平均单词长度。

```c
#include <stdio.h>
#include <ctype.h>
#include <string.h>

/* 使用指针统计单词数 */
int count_words(const char *str) {
    int count = 0;
    int in_word = 0;  // 标志：是否正在单词内部

    for (const char *p = str; *p != '\0'; p++) {
        if (isspace((unsigned char)*p)) {
            in_word = 0;  // 遇到空白，退出单词
        } else if (!in_word) {
            in_word = 1;  // 遇到非空白，进入单词
            count++;
        }
    }
    return count;
}

/* 使用指针统计单词数和平均长度 */
void analyze_text(const char *str) {
    int word_count = 0;
    int total_chars = 0;
    int current_word_len = 0;
    int in_word = 0;

    for (const char *p = str; *p != '\0'; p++) {
        if (isspace((unsigned char)*p)) {
            if (in_word) {
                word_count++;
                total_chars += current_word_len;
                current_word_len = 0;
                in_word = 0;
            }
        } else {
            in_word = 1;
            current_word_len++;
        }
    }

    /* 处理最后一个单词 */
    if (in_word) {
        word_count++;
        total_chars += current_word_len;
    }

    printf("单词总数: %d\n", word_count);
    if (word_count > 0) {
        printf("总字符数: %d\n", total_chars);
        printf("平均单词长度: %.2f\n", (double)total_chars / word_count);
    }
}

/* 使用指针提取每个单词 */
void extract_words(const char *str) {
    printf("提取单词:\n");
    int word_idx = 0;

    const char *p = str;
    while (*p != '\0') {
        /* 跳过空白 */
        while (*p != '\0' && isspace((unsigned char)*p)) {
            p++;
        }

        if (*p == '\0') break;

        /* 记录单词起始位置 */
        const char *start = p;
        while (*p != '\0' && !isspace((unsigned char)*p)) {
            p++;
        }
        const char *end = p;

        /* 打印单词 */
        int len = (int)(end - start);
        printf("  单词 %d: \"", ++word_idx);
        for (const char *q = start; q < end; q++) {
            putchar(*q);
        }
        printf("\" (长度=%d)\n", len);
    }
}

/* 使用指针反转字符串中的单词顺序 */
void reverse_words(char *str) {
    /* 第一步：反转整个字符串 */
    char *left = str;
    char *right = str + strlen(str) - 1;
    while (left < right) {
        char tmp = *left;
        *left = *right;
        *right = tmp;
        left++;
        right--;
    }

    /* 第二步：反转每个单词 */
    char *p = str;
    while (*p != '\0') {
        /* 跳过空白 */
        while (*p != '\0' && isspace((unsigned char)*p)) p++;
        if (*p == '\0') break;

        char *word_start = p;
        while (*p != '\0' && !isspace((unsigned char)*p)) p++;
        char *word_end = p - 1;

        /* 反转这个单词 */
        while (word_start < word_end) {
            char tmp = *word_start;
            *word_start = *word_end;
            *word_end = tmp;
            word_start++;
            word_end--;
        }
    }
}

int main(void) {
    const char *text = "  The quick brown   fox jumps  over the lazy dog  ";

    printf("原始文本: \"%s\"\n", text);
    printf("文本长度: %zu\n\n", strlen(text));

    printf("=== 单词统计 ===\n");
    printf("单词数: %d\n\n", count_words(text));

    printf("=== 文本分析 ===\n");
    analyze_text(text);
    printf("\n");

    printf("=== 逐个提取单词 ===\n");
    extract_words(text);
    printf("\n");

    printf("=== 反转单词顺序 ===\n");
    char buffer[256];
    strcpy(buffer, text);
    reverse_words(buffer);
    printf("反转后: \"%s\"\n", buffer);

    return 0;
}
```

---

## 十一、内存布局图调试：跟踪指针变化

下面通过一个实际的调试场景，使用文本图示展示指针在内存中的变化过程。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 内存布局调试示例
 * 逐步展示指针操作时内存的变化
 */

int main(void) {
    printf("=== 内存布局调试演示 ===\n\n");

    /*
     * 步骤1: 分配和初始化
     *
     * 初始内存布局:
     *
     * 栈:                         堆:
     * +--------+                 +----+----+----+----+----+
     * | arr    | ----+---------> | ?  | ?  | ?  | ?  | ?  |
     * +--------+     |           +----+----+----+----+----+
     *                |           0x1000 (示例地址)
     *                |
     * +--------+     |
     * | p      | ----+
     * +--------+
     */
    int *arr = (int*)malloc(5 * sizeof(int));
    if (!arr) return 1;

    for (int i = 0; i < 5; i++) {
        arr[i] = (i + 1) * 10;
    }
    int *p = arr;

    printf("步骤1 - 初始状态:\n");
    printf("  arr = %p, *arr = %d\n", (void*)arr, *arr);
    printf("  p   = %p, *p   = %d\n", (void*)p, *p);
    printf("  p == arr ? %s\n", (p == arr) ? "是" : "否");

    /*
     * 内存布局:
     * 堆: [10][20][30][40][50]
     *      ^
     *      |--- arr, p
     */

    /*
     * 步骤2: 指针算术
     *
     * p = p + 2;
     *
     * 内存布局:
     * 堆: [10][20][30][40][50]
     *               ^
     *               |--- p (arr不变)
     */
    printf("\n步骤2 - p = p + 2:\n");
    p = p + 2;
    printf("  arr = %p, *arr = %d\n", (void*)arr, *arr);
    printf("  p   = %p, *p   = %d\n", (void*)p, *p);
    printf("  p - arr = %td (元素个数)\n", p - arr);

    /*
     * 内存布局:
     * 堆: [10][20][30][40][50]
     *               ^
     *               |--- p
     */

    /*
     * 步骤3: realloc 扩容
     *
     * arr = realloc(arr, 8 * sizeof(int));
     *
     * 内存布局 (如果原地扩展):
     * 堆: [10][20][30][40][50][ ][ ][ ]
     *               ^
     *               |--- p (可能仍指向旧地址，如果realloc移动了数据则变悬垂指针!)
     *      ^
     *      |--- arr
     *
     * 内存布局 (如果分配了新内存):
     * 旧堆: [10][20][30][40][50]  (已释放)
     *               ^
     *               |--- p (悬垂指针!)
     * 新堆: [10][20][30][40][50][ ][ ][ ]
     *      ^
     *      |--- arr
     */
    printf("\n步骤3 - realloc 扩容:\n");
    int *tmp = (int*)realloc(arr, 8 * sizeof(int));
    if (!tmp) {
        free(arr);
        return 1;
    }
    arr = tmp;

    /* 注意：如果realloc移动了数据，p现在已经是悬垂指针！ */
    if (arr != p - 2) {
        printf("  realloc 移动了数据到新地址!\n");
        printf("  旧 arr 地址: %p (数据已移动)\n", (void*)(p - 2));
        printf("  新 arr 地址: %p\n", (void*)arr);
        printf("  p 现在是悬垂指针! 需要重新设置\n");
        p = arr + 2;  // 重新设置p
        printf("  p 已重新设置为 arr + 2 = %p\n", (void*)p);
    } else {
        printf("  realloc 原地扩展，p仍然有效\n");
    }

    /* 初始化新元素 */
    for (int i = 5; i < 8; i++) {
        arr[i] = (i + 1) * 10;
    }

    printf("\n  扩容后的数组: ");
    for (int i = 0; i < 8; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    /*
     * 最终内存布局:
     * 堆: [10][20][30][40][50][60][70][80]
     *               ^
     *               |--- p
     *      ^
     *      |--- arr
     */

    printf("\n步骤4 - 最终状态:\n");
    printf("  arr = %p, *arr = %d\n", (void*)arr, *arr);
    printf("  p   = %p, *p   = %d\n", (void*)p, *p);
    printf("  arr[7] = %d\n", arr[7]);

    free(arr);
    arr = NULL;
    p = NULL;

    return 0;
}
```

---

## 十二、综合实战：动态学生管理系统

下面实现一个完整的动态学生管理系统，全面运用指针、动态内存、函数指针等知识，手动管理所有内存。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/* ============ 数据结构定义 ============ */

typedef struct {
    int    id;           // 学号
    char   name[64];     // 姓名
    int    age;          // 年龄
    double score;        // 成绩
} Student;

typedef struct {
    Student *students;   // 动态数组，存储学生数据
    size_t   count;      // 当前学生数量
    size_t   capacity;   // 当前数组容量
} StudentManager;

/* ============ 内存管理函数 ============ */

/* 创建学生管理器 */
StudentManager* sm_create(void) {
    StudentManager *sm = (StudentManager*)malloc(sizeof(StudentManager));
    if (!sm) return NULL;

    sm->capacity = 4;
    sm->count = 0;
    sm->students = (Student*)calloc(sm->capacity, sizeof(Student));
    if (!sm->students) {
        free(sm);
        return NULL;
    }
    return sm;
}

/* 销毁学生管理器 */
void sm_destroy(StudentManager *sm) {
    if (sm) {
        free(sm->students);
        sm->students = NULL;
        free(sm);
    }
}

/* 确保容量 */
static int sm_ensure_capacity(StudentManager *sm) {
    if (sm->count < sm->capacity) return 0;

    size_t new_cap = sm->capacity * 2;
    Student *new_mem = (Student*)realloc(sm->students, new_cap * sizeof(Student));
    if (!new_mem) return -1;

    /* 将新增区域清零 */
    memset(new_mem + sm->capacity, 0,
           (new_cap - sm->capacity) * sizeof(Student));

    sm->students = new_mem;
    sm->capacity = new_cap;
    printf("  [系统] 自动扩容至 %zu\n", sm->capacity);
    return 0;
}

/* ============ 增删改查操作 ============ */

/* 添加学生 */
int sm_add(StudentManager *sm, int id, const char *name, int age, double score) {
    if (!sm) return -1;

    /* 检查学号是否重复 */
    for (size_t i = 0; i < sm->count; i++) {
        if (sm->students[i].id == id) {
            printf("  [错误] 学号 %d 已存在!\n", id);
            return -1;
        }
    }

    if (sm_ensure_capacity(sm) != 0) {
        printf("  [错误] 内存不足!\n");
        return -1;
    }

    Student *s = &sm->students[sm->count];
    s->id = id;
    strncpy(s->name, name, sizeof(s->name) - 1);
    s->name[sizeof(s->name) - 1] = '\0';
    s->age = age;
    s->score = score;
    sm->count++;

    return 0;
}

/* 按学号查找学生（返回指针，未找到返回NULL） */
Student* sm_find_by_id(const StudentManager *sm, int id) {
    if (!sm) return NULL;
    for (size_t i = 0; i < sm->count; i++) {
        if (sm->students[i].id == id) {
            return &sm->students[i];
        }
    }
    return NULL;
}

/* 按学号删除学生 */
int sm_delete(StudentManager *sm, int id) {
    if (!sm) return -1;

    size_t target = sm->count;  // 初始化为无效值
    for (size_t i = 0; i < sm->count; i++) {
        if (sm->students[i].id == id) {
            target = i;
            break;
        }
    }

    if (target == sm->count) {
        printf("  [错误] 未找到学号 %d\n", id);
        return -1;
    }

    /* 将后面的元素前移 */
    if (target < sm->count - 1) {
        memmove(&sm->students[target],
                &sm->students[target + 1],
                (sm->count - target - 1) * sizeof(Student));
    }
    sm->count--;

    /* 缩容 */
    if (sm->capacity > 4 && sm->count < sm->capacity / 4) {
        size_t new_cap = sm->capacity / 2;
        Student *new_mem = (Student*)realloc(sm->students, new_cap * sizeof(Student));
        if (new_mem) {
            sm->students = new_mem;
            sm->capacity = new_cap;
            printf("  [系统] 自动缩容至 %zu\n", sm->capacity);
        }
    }

    return 0;
}

/* 更新学生信息 */
int sm_update(StudentManager *sm, int id, const char *name, int age, double score) {
    Student *s = sm_find_by_id(sm, id);
    if (!s) {
        printf("  [错误] 未找到学号 %d\n", id);
        return -1;
    }
    if (name) {
        strncpy(s->name, name, sizeof(s->name) - 1);
        s->name[sizeof(s->name) - 1] = '\0';
    }
    s->age = age;
    s->score = score;
    return 0;
}

/* 打印单个学生 */
void sm_print_student(const Student *s) {
    if (!s) return;
    printf("  %-6d %-20s %-4d %-8.2f\n", s->id, s->name, s->age, s->score);
}

/* 列出所有学生 */
void sm_list_all(const StudentManager *sm) {
    if (!sm || sm->count == 0) {
        printf("  (暂无学生记录)\n");
        return;
    }
    printf("  %-6s %-20s %-4s %-8s\n", "学号", "姓名", "年龄", "成绩");
    printf("  %-6s %-20s %-4s %-8s\n", "----", "----", "----", "----");
    for (size_t i = 0; i < sm->count; i++) {
        sm_print_student(&sm->students[i]);
    }
    printf("  共 %zu 名学生 (容量: %zu)\n", sm->count, sm->capacity);
}

/* ============ 排序功能（使用函数指针） ============ */

typedef int (*cmp_func_t)(const Student*, const Student*);

int cmp_by_id(const Student *a, const Student *b) {
    return a->id - b->id;
}

int cmp_by_score_desc(const Student *a, const Student *b) {
    if (a->score > b->score) return -1;
    if (a->score < b->score) return 1;
    return 0;
}

int cmp_by_name(const Student *a, const Student *b) {
    return strcmp(a->name, b->name);
}

int cmp_by_age(const Student *a, const Student *b) {
    return a->age - b->age;
}

/* 冒泡排序（使用函数指针） */
void sm_sort(StudentManager *sm, cmp_func_t cmp) {
    if (!sm || sm->count < 2) return;

    for (size_t i = 0; i < sm->count - 1; i++) {
        for (size_t j = 0; j < sm->count - 1 - i; j++) {
            if (cmp(&sm->students[j], &sm->students[j + 1]) > 0) {
                Student tmp = sm->students[j];
                sm->students[j] = sm->students[j + 1];
                sm->students[j + 1] = tmp;
            }
        }
    }
}

/* ============ 统计功能 ============ */

/* 按姓名查找（使用指针遍历） */
void sm_search_by_name(const StudentManager *sm, const char *keyword) {
    if (!sm || !keyword) return;

    printf("  姓名包含 \"%s\" 的学生:\n", keyword);
    int found = 0;
    for (size_t i = 0; i < sm->count; i++) {
        if (strstr(sm->students[i].name, keyword)) {
            sm_print_student(&sm->students[i]);
            found++;
        }
    }
    if (!found) {
        printf("  (未找到)\n");
    }
}

/* 统计信息 */
void sm_statistics(const StudentManager *sm) {
    if (!sm || sm->count == 0) {
        printf("  (暂无数据)\n");
        return;
    }

    double sum = 0.0, max_score = sm->students[0].score, min_score = sm->students[0].score;
    int max_age = sm->students[0].age, min_age = sm->students[0].age;

    for (size_t i = 0; i < sm->count; i++) {
        double sc = sm->students[i].score;
        int ag = sm->students[i].age;
        sum += sc;
        if (sc > max_score) max_score = sc;
        if (sc < min_score) min_score = sc;
        if (ag > max_age) max_age = ag;
        if (ag < min_age) min_age = ag;
    }

    printf("  学生总数:    %zu\n", sm->count);
    printf("  平均成绩:    %.2f\n", sum / sm->count);
    printf("  最高成绩:    %.2f\n", max_score);
    printf("  最低成绩:    %.2f\n", min_score);
    printf("  最大年龄:    %d\n", max_age);
    printf("  最小年龄:    %d\n", min_age);
}

/* ============ 主程序 ============ */

int main(void) {
    printf("========================================\n");
    printf("   动态学生管理系统 (C语言指针版)\n");
    printf("========================================\n\n");

    StudentManager *sm = sm_create();
    if (!sm) {
        fprintf(stderr, "系统初始化失败!\n");
        return 1;
    }

    /* 添加学生 */
    printf("--- 添加学生 ---\n");
    sm_add(sm, 1001, "张三", 20, 88.5);
    sm_add(sm, 1002, "李四", 21, 92.0);
    sm_add(sm, 1003, "王五", 19, 76.5);
    sm_add(sm, 1004, "赵六", 22, 85.0);
    sm_add(sm, 1005, "孙七", 20, 95.5);
    sm_add(sm, 1006, "周八", 21, 67.0);
    sm_add(sm, 1007, "吴九", 23, 88.0);
    sm_list_all(sm);

    /* 查找学生 */
    printf("\n--- 查找学生 ---\n");
    Student *found = sm_find_by_id(sm, 1003);
    if (found) {
        printf("  找到学号 1003: ");
        sm_print_student(found);
    }

    /* 按姓名搜索 */
    printf("\n--- 按姓名搜索 ---\n");
    sm_search_by_name(sm, "张");

    /* 更新学生 */
    printf("\n--- 更新学生 ---\n");
    sm_update(sm, 1003, "王五(更新)", 20, 82.0);
    printf("  更新后: ");
    sm_print_student(sm_find_by_id(sm, 1003));

    /* 排序：按成绩降序 */
    printf("\n--- 按成绩降序排序 ---\n");
    sm_sort(sm, cmp_by_score_desc);
    sm_list_all(sm);

    /* 排序：按学号 */
    printf("\n--- 按学号排序 ---\n");
    sm_sort(sm, cmp_by_id);
    sm_list_all(sm);

    /* 删除学生 */
    printf("\n--- 删除学生 ---\n");
    sm_delete(sm, 1004);
    sm_delete(sm, 1006);
    sm_list_all(sm);

    /* 统计 */
    printf("\n--- 统计信息 ---\n");
    sm_statistics(sm);

    /* 内存布局总结 */
    printf("\n--- 内存布局总结 ---\n");
    printf("  StudentManager (栈/堆):\n");
    printf("  ┌──────────────┐\n");
    printf("  │ students *───┼──→ 堆: [S1][S2][S3][S4][S5][...][capacity]\n");
    printf("  │ count = %zu    │              ↑\n", sm->count);
    printf("  │ capacity = %zu │              每个Student是结构体\n", sm->capacity);
    printf("  └──────────────┘\n");

    sm_destroy(sm);
    printf("\n系统已正常退出，所有内存已释放。\n");
    return 0;
}
```

---

## 十三、指针安全编程最佳实践

### 13.1 防御性编程检查清单

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 安全的malloc封装 */
void* safe_malloc(size_t size) {
    void *ptr = malloc(size);
    if (!ptr) {
        fprintf(stderr, "FATAL: malloc(%zu) 失败!\n", size);
        exit(EXIT_FAILURE);
    }
    return ptr;
}

/* 安全的free封装 */
void safe_free(void **pptr) {
    if (pptr && *pptr) {
        free(*pptr);
        *pptr = NULL;
    }
}

/* 使用宏简化调用 */
#define SAFE_FREE(p) safe_free((void**)&(p))

int main(void) {
    /* 规则1: 总是检查malloc/calloc/realloc的返回值 */
    int *arr = (int*)safe_malloc(10 * sizeof(int));

    /* 规则2: 初始化分配的内存 */
    memset(arr, 0, 10 * sizeof(int));

    /* 规则3: 释放后置NULL */
    SAFE_FREE(arr);
    /* 现在 arr == NULL */

    /* 规则4: 使用 sizeof(变量) 而非 sizeof(类型) */
    int *p = (int*)safe_malloc(10 * sizeof(*p));  // 好：sizeof(*p)
    /* int *p = (int*)malloc(10 * sizeof(int));   // 也可以，但不够DRY */

    SAFE_FREE(p);

    /* 规则5: 指针运算时注意边界 */
    int buf[10];
    int *start = buf;
    int *end = buf + 10;  // 指向数组末尾的下一个位置
    for (int *it = start; it < end; it++) {
        *it = 0;
    }

    printf("所有安全检查通过!\n");
    return 0;
}
```

### 13.2 常见错误的总结

| 错误类型 | 成因 | 后果 | 预防措施 |
|----------|------|------|----------|
| 内存泄漏 | 忘记free，或丢失指针引用 | 内存耗尽 | 使用valgrind检测，free后置NULL |
| 悬垂指针 | 使用已释放的内存 | 未定义行为 | free后立即置NULL |
| 双重释放 | 对同一指针free两次 | 堆损坏/崩溃 | free后置NULL |
| 缓冲区溢出 | 写入超过分配大小的数据 | 堆损坏/安全漏洞 | 使用strncpy等安全函数 |
| 空指针解引用 | 对NULL指针使用*操作 | 段错误崩溃 | 使用前检查指针非NULL |
| 野指针 | 使用未初始化的指针 | 随机崩溃 | 声明时初始化为NULL |
| 类型转换错误 | 错误的指针类型转换 | 数据损坏 | 避免不必要的强制转换 |
| 越界访问 | 数组下标超出范围 | 未定义行为 | 始终检查边界 |

---

## 十四、总结

本文从一级指针的基础语法出发，逐步深入到二级指针、函数指针、void*泛型指针，再到内存四区模型和动态内存分配，最后通过动态数组和完整的学生管理系统实战项目，系统性地覆盖了C语言指针与内存管理的核心知识。

**关键要点回顾：**

1. **指针的本质**：存储地址的变量，类型决定了解引用时的行为。
2. **数组与指针的关系**：`arr` 退化为指向首元素的指针，`&arr` 是指向整个数组的指针，两者地址值相同但类型不同。
3. **多级指针**：每一级指针需要对应一级解引用，`T **p` 指向 `T *` 类型的变量。
4. **函数指针**：是实现回调、策略模式等高级编程范式的基础。
5. **void***：C语言的泛型机制，不能直接解引用，必须先转换类型。
6. **内存四区**：栈（自动管理）、堆（手动管理）、全局/静态区（程序生命周期）、代码段（只读）。
7. **动态内存**：`malloc`（未初始化）、`calloc`（清零）、`realloc`（调整大小）、`free`（释放）。
8. **安全编程**：检查返回值、初始化、释放后置NULL、注意边界。

掌握指针和内存管理是成为优秀C程序员的关键。建议读者将本文中的所有代码亲自编译运行，并使用 `valgrind` 等工具检查内存泄漏，在实践中加深理解。

---

*本文所有代码均使用 `gcc -Wall -Wextra -std=c11 -o program source.c` 编译通过。建议读者在Linux环境下运行，并使用 `valgrind --leak-check=full ./program` 检查内存管理是否正确。*
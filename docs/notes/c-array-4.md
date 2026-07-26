---
title: C语言数组与函数Ⅳ
date: 2026-07-26
tags:
  - C语言
  - 函数
  - 参数传递
  - 栈帧
  - 递归
categories:
  - C语言
---

# C语言数组与函数Ⅳ——函数定义与调用机制

## 一、引言

函数是C语言程序的基本构建块。理解函数的定义、声明、调用机制和参数传递方式，是写出模块化、可维护代码的基础。本章将深入剖析函数的各个层面，包括栈帧结构、调用约定、以及数组作为函数参数的特殊处理。

---

## 二、函数定义与声明

### 2.1 函数的基本结构

```c
#include <stdio.h>

// 函数声明（原型）：告诉编译器函数的存在
int add(int a, int b);
void print_greeting(const char* name);
double calculate_area(double radius);

int main() {
    printf("========== 函数基本结构 ==========\n\n");

    int result = add(10, 20);
    printf("add(10, 20) = %d\n", result);

    print_greeting("安柏");

    double area = calculate_area(5.0);
    printf("半径为5.0的圆面积 = %.2f\n", area);

    return 0;
}

// 函数定义
int add(int a, int b) {
    return a + b;
}

void print_greeting(const char* name) {
    printf("你好，%s！欢迎学习C语言。\n", name);
}

double calculate_area(double radius) {
    return 3.141592653589793 * radius * radius;
}
```

### 2.2 函数返回值

```c
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

// 返回基本类型
int max_int(int a, int b) {
    return (a > b) ? a : b;
}

// 返回指针（注意：不能返回局部变量的地址！）
int* create_array(int size) {
    int* arr = (int*)malloc(size * sizeof(int));
    for (int i = 0; i < size; i++) arr[i] = i * 10;
    return arr;  // 返回堆上的指针，安全
}

// 返回结构体
typedef struct {
    int x, y;
} Point;

Point make_point(int x, int y) {
    Point p = {x, y};
    return p;
}

int main() {
    printf("========== 函数返回值 ==========\n\n");

    printf("max(10, 20) = %d\n", max_int(10, 20));

    int* arr = create_array(5);
    printf("create_array(5): ");
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\n");
    free(arr);

    Point p = make_point(3, 4);
    printf("make_point(3, 4): (%d, %d)\n", p.x, p.y);

    return 0;
}
```

### 2.3 函数参数传递

```c
#include <stdio.h>

// 值传递：函数内修改不影响外部
void modify_value(int x) {
    x = 100;
    printf("modify_value内部: x = %d\n", x);
}

// 指针传递：函数内修改影响外部
void modify_pointer(int* x) {
    *x = 100;
    printf("modify_pointer内部: *x = %d\n", *x);
}

// 传递数组（实际传递的是指针）
void modify_array(int arr[], int len) {
    for (int i = 0; i < len; i++) arr[i] *= 2;
}

int main() {
    printf("========== 参数传递方式 ==========\n\n");

    int a = 10;
    printf("值传递前: a = %d\n", a);
    modify_value(a);
    printf("值传递后: a = %d (未改变)\n\n", a);

    int b = 10;
    printf("指针传递前: b = %d\n", b);
    modify_pointer(&b);
    printf("指针传递后: b = %d (已改变)\n\n", b);

    int arr[] = {1, 2, 3, 4, 5};
    printf("数组传递前: ");
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\n");
    modify_array(arr, 5);
    printf("数组传递后: ");
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\n");

    return 0;
}
```

---

## 三、函数调用栈帧

### 3.1 栈帧结构

```c
#include <stdio.h>

void func_c(int n) {
    int c = n * 3;
    printf("func_c: c=%d, &c=%p\n", c, (void*)&c);
}

void func_b(int n) {
    int b = n * 2;
    printf("func_b: b=%d, &b=%p\n", b, (void*)&b);
    func_c(b);
    printf("func_b返回: &b=%p\n", (void*)&b);
}

void func_a(int n) {
    int a = n + 1;
    printf("func_a: a=%d, &a=%p\n", a, (void*)&a);
    func_b(a);
    printf("func_a返回: &a=%p\n", (void*)&a);
}

int main() {
    printf("========== 函数调用栈帧 ==========\n\n");

    int x = 10;
    printf("main: x=%d, &x=%p\n\n", x, (void*)&x);

    func_a(x);

    printf("\nmain: x=%d, &x=%p (不变)\n", x, (void*)&x);

    printf("\n栈帧结构(地址从高到低):\n");
    printf("┌─────────────┐ ← 高地址(栈底)\n");
    printf("│ main 栈帧   │ 返回地址、局部变量x\n");
    printf("├─────────────┤\n");
    printf("│ func_a 栈帧 │ 返回地址、参数n、局部变量a\n");
    printf("├─────────────┤\n");
    printf("│ func_b 栈帧 │ 返回地址、参数n、局部变量b\n");
    printf("├─────────────┤\n");
    printf("│ func_c 栈帧 │ 返回地址、参数n、局部变量c\n");
    printf("└─────────────┘ ← 低地址(栈顶, ESP/RSP)\n");

    return 0;
}
```

### 3.2 递归调用栈帧

```c
#include <stdio.h>

int factorial(int n) {
    printf("进入 factorial(%d), 栈帧地址: %p\n", n, (void*)&n);
    if (n <= 1) {
        printf("基准条件: factorial(%d) = 1\n", n);
        return 1;
    }
    int result = n * factorial(n - 1);
    printf("返回 factorial(%d) = %d\n", n, result);
    return result;
}

int main() {
    printf("========== 递归调用栈帧 ==========\n\n");

    int result = factorial(5);
    printf("\n5! = %d\n", result);

    printf("\n每层递归都有自己的栈帧，参数n的值各不相同\n");
    return 0;
}
```

---

## 四、数组作为函数参数

### 4.1 数组参数的传递

```c
#include <stdio.h>

// 方式1：数组形式（本质是指针）
void print_array1(int arr[], int len) {
    printf("方式1: ");
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n");
}

// 方式2：指针形式
void print_array2(int* arr, int len) {
    printf("方式2: ");
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n");
}

// 方式3：指定大小的数组（大小被忽略）
void print_array3(int arr[10], int len) {
    printf("方式3: sizeof(arr)=%zu (是指针大小，不是数组大小!)\n", sizeof(arr));
    printf("方式3: ");
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n");
}

// 二维数组参数（必须指定列数）
void print_matrix(int mat[][4], int rows) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 4; j++) printf("%3d ", mat[i][j]);
        printf("\n");
    }
}

int main() {
    printf("========== 数组作为函数参数 ==========\n\n");

    int arr[] = {10, 20, 30, 40, 50};
    int len = sizeof(arr) / sizeof(arr[0]);

    printf("main中: sizeof(arr) = %zu\n", sizeof(arr));
    printf("main中: 元素个数 = %d\n\n", len);

    print_array1(arr, len);
    print_array2(arr, len);
    print_array3(arr, len);

    printf("\n【二维数组参数】\n");
    int mat[3][4] = {{1,2,3,4},{5,6,7,8},{9,10,11,12}};
    print_matrix(mat, 3);

    printf("\n关键结论：\n");
    printf("1. 数组作为函数参数时会退化为指针\n");
    printf("2. 函数内sizeof(arr)是指针大小，不是数组大小\n");
    printf("3. 必须额外传递数组长度\n");
    printf("4. 二维数组参数必须指定列数\n");

    return 0;
}
```

### 4.2 函数返回数组

```c
#include <stdio.h>
#include <stdlib.h>

// 返回动态分配的数组
int* generate_sequence(int n) {
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) arr[i] = i * i;
    return arr;
}

// 通过参数返回数组（填充已有数组）
void fill_sequence(int arr[], int n) {
    for (int i = 0; i < n; i++) arr[i] = i * i;
}

int main() {
    printf("========== 函数返回数组 ==========\n\n");

    int n = 8;

    // 方法1：返回动态分配的数组
    int* seq1 = generate_sequence(n);
    printf("动态分配: ");
    for (int i = 0; i < n; i++) printf("%d ", seq1[i]);
    printf("\n");
    free(seq1);

    // 方法2：通过参数填充
    int seq2[8];
    fill_sequence(seq2, n);
    printf("参数填充: ");
    for (int i = 0; i < n; i++) printf("%d ", seq2[i]);
    printf("\n");

    return 0;
}
```

---

## 五、函数指针与回调

### 5.1 函数指针基础

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }
int divide(int a, int b) { return (b != 0) ? a / b : 0; }

// 使用函数指针的计算函数
int calculate(int a, int b, int (*operation)(int, int)) {
    return operation(a, b);
}

int main() {
    printf("========== 函数指针 ==========\n\n");

    // 声明函数指针
    int (*fp)(int, int);

    fp = add;
    printf("add: %d + %d = %d\n", 10, 5, fp(10, 5));

    fp = multiply;
    printf("multiply: %d * %d = %d\n", 10, 5, fp(10, 5));

    // 通过函数指针调用
    printf("\n通过calculate函数调用:\n");
    printf("10 + 5 = %d\n", calculate(10, 5, add));
    printf("10 - 5 = %d\n", calculate(10, 5, subtract));
    printf("10 * 5 = %d\n", calculate(10, 5, multiply));
    printf("10 / 5 = %d\n", calculate(10, 5, divide));

    return 0;
}
```

### 5.2 函数指针数组

```c
#include <stdio.h>

void option1() { printf("执行选项1\n"); }
void option2() { printf("执行选项2\n"); }
void option3() { printf("执行选项3\n"); }
void option4() { printf("执行选项4\n"); }

int main() {
    printf("========== 函数指针数组 ==========\n\n");

    // 函数指针数组
    void (*menu[])(void) = {option1, option2, option3, option4};
    int num_options = sizeof(menu) / sizeof(menu[0]);

    int choice;
    while (1) {
        printf("\n菜单: 1-选项1 2-选项2 3-选项3 4-选项4 0-退出\n");
        printf("选择: ");
        scanf("%d", &choice);

        if (choice == 0) break;
        if (choice >= 1 && choice <= num_options) {
            menu[choice - 1]();  // 通过函数指针数组调用
        } else {
            printf("无效选择\n");
        }
    }

    return 0;
}
```

---

## 六、综合实战：通用排序函数

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 通用比较函数类型
typedef int (*CompareFunc)(const void*, const void*);

// 整数比较
int compare_int(const void* a, const void* b) {
    return *(int*)a - *(int*)b;
}

int compare_int_desc(const void* a, const void* b) {
    return *(int*)b - *(int*)a;
}

// 字符串比较
int compare_string(const void* a, const void* b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

// 通用冒泡排序
void generic_sort(void* arr, int n, size_t elem_size, CompareFunc cmp) {
    void* temp = malloc(elem_size);
    char* base = (char*)arr;

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            void* elem1 = base + j * elem_size;
            void* elem2 = base + (j + 1) * elem_size;
            if (cmp(elem1, elem2) > 0) {
                memcpy(temp, elem1, elem_size);
                memcpy(elem1, elem2, elem_size);
                memcpy(elem2, temp, elem_size);
            }
        }
    }
    free(temp);
}

int main() {
    printf("========== 通用排序函数 ==========\n\n");

    // 整数排序
    int nums[] = {64, 34, 25, 12, 22, 11, 90, 45};
    int n = sizeof(nums) / sizeof(nums[0]);

    printf("整数升序: ");
    generic_sort(nums, n, sizeof(int), compare_int);
    for (int i = 0; i < n; i++) printf("%d ", nums[i]);
    printf("\n");

    printf("整数降序: ");
    generic_sort(nums, n, sizeof(int), compare_int_desc);
    for (int i = 0; i < n; i++) printf("%d ", nums[i]);
    printf("\n");

    // 字符串排序
    char* words[] = {"banana", "apple", "grape", "orange", "mango"};
    int w = sizeof(words) / sizeof(words[0]);

    printf("\n字符串排序: ");
    generic_sort(words, w, sizeof(char*), compare_string);
    for (int i = 0; i < w; i++) printf("%s ", words[i]);
    printf("\n");

    return 0;
}
```

---

## 本章小结

本章深入剖析了C语言函数机制：

1. **函数定义与声明**：原型、返回值、参数传递方式
2. **栈帧结构**：调用时的栈帧创建与销毁、递归栈帧
3. **数组参数**：退化指针、二维数组参数、返回数组的两种方式
4. **函数指针**：声明、使用、回调函数、函数指针数组
5. **综合实战**：通用排序函数（类似qsort的实现）

理解函数调用机制是成为C语言高手的必经之路。
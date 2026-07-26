---
title: C语言指针与内存Ⅱ
date: 2026-07-26
tags:
  - C语言
  - 指针
  - 多级指针
  - 指针数组
  - 数组指针
categories:
  - C语言
---

# C语言指针与内存Ⅱ——多级指针与复杂声明

## 一、引言

指针是C语言的灵魂，但多级指针（指针的指针）和复杂的指针声明常常让人困惑。本章将深入剖析二级指针、指针数组、数组指针、函数指针等复杂概念，通过大量代码和内存布局图帮助理解。

---

## 二、二级指针

### 2.1 基本概念

```c
#include <stdio.h>

int main() {
    printf("========== 二级指针基本概念 ==========\n\n");

    int value = 42;
    int* p1 = &value;    // 一级指针，指向int
    int** p2 = &p1;      // 二级指针，指向int*

    printf("value = %d\n", value);
    printf("&value = %p\n\n", (void*)&value);

    printf("p1 = &value = %p\n", (void*)p1);
    printf("&p1 = %p\n", (void*)&p1);
    printf("*p1 = %d\n\n", *p1);

    printf("p2 = &p1 = %p\n", (void*)p2);
    printf("*p2 = p1 = %p\n", (void*)*p2);
    printf("**p2 = %d\n\n", **p2);

    // 通过二级指针修改原值
    **p2 = 100;
    printf("**p2 = 100后, value = %d\n", value);

    return 0;
}
```

### 2.2 二级指针的实际应用

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 通过二级指针修改一级指针
void allocate_and_fill(char** str_ptr, const char* content) {
    *str_ptr = (char*)malloc(strlen(content) + 1);
    strcpy(*str_ptr, content);
}

// 动态二维数组
int** create_matrix(int rows, int cols) {
    int** mat = (int**)malloc(rows * sizeof(int*));
    for (int i = 0; i < rows; i++) {
        mat[i] = (int*)malloc(cols * sizeof(int));
        for (int j = 0; j < cols; j++) {
            mat[i][j] = i * cols + j + 1;
        }
    }
    return mat;
}

void free_matrix(int** mat, int rows) {
    for (int i = 0; i < rows; i++) free(mat[i]);
    free(mat);
}

void print_matrix(int** mat, int rows, int cols) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) printf("%3d ", mat[i][j]);
        printf("\n");
    }
}

int main() {
    printf("========== 二级指针实际应用 ==========\n\n");

    // 应用1：修改指针变量
    char* my_str = NULL;
    allocate_and_fill(&my_str, "Hello from heap!");
    printf("通过二级指针分配: %s\n", my_str);
    free(my_str);

    // 应用2：动态二维数组
    printf("\n动态二维数组(3x4):\n");
    int** mat = create_matrix(3, 4);
    print_matrix(mat, 3, 4);
    free_matrix(mat, 3);

    printf("\n二级指针常见用途:\n");
    printf("1. 函数内修改指针变量本身\n");
    printf("2. 动态创建二维数组\n");
    printf("3. 链表操作中修改头指针\n");
    printf("4. main函数的argv参数\n");

    return 0;
}
```

### 2.3 argv 参数解析

```c
#include <stdio.h>

int main(int argc, char** argv) {
    printf("========== argv 参数解析 ==========\n\n");

    printf("argc = %d\n", argc);
    printf("argv 是一个二级指针 char**\n\n");

    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %p -> \"%s\"\n", i, (void*)argv[i], argv[i]);
    }

    printf("\n等价写法:\n");
    printf("int main(int argc, char* argv[])\n");
    printf("int main(int argc, char** argv)\n");
    printf("两者完全等价，数组参数退化为指针\n");

    return 0;
}
```

---

## 三、指针数组与数组指针

### 3.1 指针数组

```c
#include <stdio.h>

int main() {
    printf("========== 指针数组 ==========\n\n");

    // 指针数组：数组的每个元素是指针
    int a = 10, b = 20, c = 30, d = 40, e = 50;
    int* ptr_arr[] = {&a, &b, &c, &d, &e};
    int n = sizeof(ptr_arr) / sizeof(ptr_arr[0]);

    printf("指针数组 ptr_arr[5]:\n");
    for (int i = 0; i < n; i++) {
        printf("ptr_arr[%d] = %p -> %d\n",
               i, (void*)ptr_arr[i], *ptr_arr[i]);
    }

    // 字符串指针数组
    printf("\n字符串指针数组:\n");
    const char* words[] = {"apple", "banana", "cherry", "date"};
    for (int i = 0; i < 4; i++) {
        printf("words[%d] = %s\n", i, words[i]);
    }

    printf("\n内存占用:\n");
    printf("指针数组: 4个指针 × %zu = %zu字节\n",
           sizeof(char*), sizeof(words));
    printf("每个字符串指向只读数据段\n");

    return 0;
}
```

### 3.2 数组指针

```c
#include <stdio.h>

int main() {
    printf("========== 数组指针 ==========\n\n");

    int arr[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    // 数组指针：指向整个数组的指针
    int (*p)[4] = arr;  // p指向包含4个int的数组

    printf("p = %p, arr = %p\n", (void*)p, (void*)arr);
    printf("sizeof(*p) = %zu (一行的大小)\n", sizeof(*p));

    printf("\n通过数组指针访问:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", p[i][j]);
        }
        printf("\n");
    }

    // 指针数组 vs 数组指针
    printf("\n【区别】\n");
    printf("指针数组: int* ptr_arr[5];  // 数组，元素是int*\n");
    printf("数组指针: int (*arr_ptr)[5]; // 指针，指向int[5]\n");
    printf("记忆: 括号优先级 > []，先结合*的就是指针\n");

    return 0;
}
```

### 3.3 复杂声明解析

```c
#include <stdio.h>

int main() {
    printf("========== 复杂声明解析 ==========\n\n");

    printf("右左法则: 从变量名开始，先向右看，再向左看\n\n");

    printf("int *p[10];\n");
    printf("  1. p是标识符\n");
    printf("  2. 向右看 [10] → p是数组\n");
    printf("  3. 向左看 int* → 数组元素是int指针\n");
    printf("  → p是包含10个int指针的数组\n\n");

    printf("int (*p)[10];\n");
    printf("  1. p是标识符\n");
    printf("  2. 括号内 (*p) → p是指针\n");
    printf("  3. 向右看 [10] → 指向长度为10的数组\n");
    printf("  4. 向左看 int → 数组元素是int\n");
    printf("  → p是指向int[10]的指针\n\n");

    printf("int *(*p[5])(int, int);\n");
    printf("  → p是包含5个函数指针的数组\n");
    printf("  → 每个函数指针指向 参数为(int,int) 返回int* 的函数\n\n");

    printf("void (*signal(int, void(*)(int)))(int);\n");
    printf("  → signal是函数，返回函数指针\n");

    return 0;
}
```

---

## 四、指针与 const

### 4.1 const 指针的四种组合

```c
#include <stdio.h>

int main() {
    printf("========== const 指针 ==========\n\n");

    int val1 = 10, val2 = 20;

    // 1. 指向常量的指针
    const int* p1 = &val1;
    printf("1. const int* p = &val\n");
    printf("   *p1 = %d, 可以: p1 = &val2\n", *p1);
    // *p1 = 30;  // 错误：不能通过p1修改值
    p1 = &val2;   // 可以：改变指针本身
    printf("   p1 = &val2 后: *p1 = %d\n\n", *p1);

    // 2. 常量指针
    int* const p2 = &val1;
    printf("2. int* const p = &val\n");
    *p2 = 30;      // 可以：通过指针修改值
    printf("   *p2 = 30 后: val1 = %d\n", val1);
    // p2 = &val2;  // 错误：不能改变指针本身
    printf("   不能: p2 = &val2\n\n");

    // 3. 指向常量的常量指针
    const int* const p3 = &val1;
    printf("3. const int* const p = &val\n");
    // *p3 = 40;   // 错误
    // p3 = &val2;  // 错误
    printf("   既不能修改值，也不能改变指针\n\n");

    // 4. 普通指针（无const）
    int* p4 = &val1;
    printf("4. int* p = &val\n");
    *p4 = 50;      // 都可以
    p4 = &val2;
    printf("   都可以修改\n");

    return 0;
}
```

---

## 五、综合实战：简单命令行解释器

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void cmd_help() {
    printf("可用命令:\n");
    printf("  help       - 显示帮助\n");
    printf("  echo <msg> - 回显消息\n");
    printf("  add <a> <b> - 计算a+b\n");
    printf("  exit       - 退出\n");
}

void cmd_echo(char** args, int arg_count) {
    for (int i = 1; i < arg_count; i++) {
        printf("%s ", args[i]);
    }
    printf("\n");
}

void cmd_add(char** args) {
    int a = atoi(args[1]);
    int b = atoi(args[2]);
    printf("%d + %d = %d\n", a, b, a + b);
}

int main() {
    printf("========== 简单命令行解释器 ==========\n\n");
    printf("输入 help 查看可用命令\n\n");

    char input[256];
    char* args[20];
    int arg_count;

    while (1) {
        printf("> ");
        fgets(input, sizeof(input), stdin);
        input[strcspn(input, "\n")] = 0;

        if (strlen(input) == 0) continue;

        // 分割参数
        arg_count = 0;
        char* token = strtok(input, " ");
        while (token != NULL && arg_count < 20) {
            args[arg_count++] = token;
            token = strtok(NULL, " ");
        }

        if (strcmp(args[0], "exit") == 0) {
            printf("再见!\n");
            break;
        } else if (strcmp(args[0], "help") == 0) {
            cmd_help();
        } else if (strcmp(args[0], "echo") == 0) {
            cmd_echo(args, arg_count);
        } else if (strcmp(args[0], "add") == 0 && arg_count >= 3) {
            cmd_add(args);
        } else {
            printf("未知命令: %s\n", args[0]);
        }
    }

    return 0;
}
```

---

## 本章小结

本章深入解析了指针的高级概念：

1. **二级指针**：概念、修改指针变量、动态二维数组、argv
2. **指针数组vs数组指针**：本质区别、右左法则解析复杂声明
3. **const与指针**：四种组合方式及使用场景
4. **综合实战**：命令行解释器（二级指针解析参数）

理解这些概念是驾驭C语言指针的关键。建议多画内存布局图辅助理解。
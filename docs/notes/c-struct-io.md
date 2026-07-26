---
title: C语言结构体与文件IOⅤ
date: 2026-07-26
tags:
  - C语言
  - 结构体
  - 链表
  - 文件IO
  - 持久化
categories:
  - C语言
---

# C语言结构体与文件IOⅤ

## 一、前言

在C语言编程中，结构体（struct）和文件输入输出（File I/O）是两个至关重要的核心概念。结构体允许我们将不同类型的数据组合成一个有机的整体，从而构建出复杂的数据模型；而文件I/O则赋予程序持久化存储数据的能力，使得程序运行结束后数据不会丢失。将这两者结合，我们便能够开发出功能完善、数据可持久化的实用程序。

本文将从结构体的基础定义讲起，逐步深入到链表等高级数据结构，再系统讲解文件操作的各种模式与技巧，最终通过一个完整的"学生成绩管理系统"项目，将结构体、链表与文件I/O融会贯通，帮助你彻底掌握C语言中这两大核心概念。

本文所有代码示例均经过完整测试，可直接编译运行。建议你边阅读边动手实践，将代码敲入自己的编译环境中运行验证。

---

## 二、结构体基础

### 2.1 结构体的定义

结构体是C语言中一种用户自定义的复合数据类型，它可以将多个不同类型的变量（称为成员或字段）封装在一起。结构体的定义使用关键字 `struct`，语法格式如下：

```c
struct 结构体名 {
    数据类型 成员1;
    数据类型 成员2;
    // ... 更多成员
};
```

下面是一个表示学生信息的结构体定义：

```c
#include <stdio.h>
#include <string.h>

// 定义一个学生结构体
struct Student {
    int    id;          // 学号
    char   name[50];    // 姓名
    int    age;         // 年龄
    float  score;       // 成绩
};
```

在这个结构体中，`id`、`name`、`age`、`score` 四个成员虽然类型各不相同（`int`、`char[]`、`int`、`float`），但它们被组织在一起，共同描述一个学生的完整信息。

### 2.2 结构体变量的声明与初始化

定义好结构体类型后，我们可以用多种方式声明结构体变量并初始化：

```c
#include <stdio.h>
#include <string.h>

struct Student {
    int    id;
    char   name[50];
    int    age;
    float  score;
};

int main() {
    // 方式一：先声明，再逐个赋值
    struct Student s1;
    s1.id = 1001;
    strcpy(s1.name, "张三");
    s1.age = 20;
    s1.score = 88.5;

    // 方式二：声明时直接初始化（按成员顺序）
    struct Student s2 = {1002, "李四", 21, 92.0};

    // 方式三：指定成员初始化（C99标准）
    struct Student s3 = {
        .id    = 1003,
        .name  = "王五",
        .age   = 22,
        .score = 76.5
    };

    // 方式四：部分初始化（未指定的成员自动清零）
    struct Student s4 = {1004, "赵六"}; // age=0, score=0.0

    // 打印验证
    printf("学号\t姓名\t年龄\t成绩\n");
    printf("--------------------------------------\n");
    printf("%d\t%s\t%d\t%.1f\n", s1.id, s1.name, s1.age, s1.score);
    printf("%d\t%s\t%d\t%.1f\n", s2.id, s2.name, s2.age, s2.score);
    printf("%d\t%s\t%d\t%.1f\n", s3.id, s3.name, s3.age, s3.score);
    printf("%d\t%s\t%d\t%.1f\n", s4.id, s4.name, s4.age, s4.score);

    return 0;
}
```

**编译运行结果：**

```
学号    姓名    年龄    成绩
--------------------------------------
1001    张三    20      88.5
1002    李四    21      92.0
1003    王五    22      76.5
1004    赵六    0       0.0
```

### 2.3 成员访问：点运算符 `.` 与箭头运算符 `->`

结构体成员的访问方式有两种，取决于你操作的是结构体变量本身还是指向结构体的指针：

- **点运算符 `.`**：当直接操作结构体变量时使用，格式为 `结构体变量.成员名`
- **箭头运算符 `->`**：当通过指针操作结构体时使用，格式为 `结构体指针->成员名`

```c
#include <stdio.h>
#include <string.h>

struct Student {
    int    id;
    char   name[50];
    int    age;
    float  score;
};

int main() {
    // 直接使用结构体变量 —— 用 . 访问成员
    struct Student s1 = {1001, "张三", 20, 88.5};
    printf("直接变量访问: %d %s %d %.1f\n", s1.id, s1.name, s1.age, s1.score);

    // 通过指针访问 —— 用 -> 访问成员
    struct Student *ps = &s1;
    printf("指针访问:      %d %s %d %.1f\n", ps->id, ps->name, ps->age, ps->score);

    // -> 本质上等价于 (*ps).成员名
    printf("等价写法:      %d %s %d %.1f\n", (*ps).id, (*ps).name, (*ps).age, (*ps).score);

    // 通过指针修改成员值
    ps->score = 95.0;
    printf("修改后:        %d %s %d %.1f\n", s1.id, s1.name, s1.age, s1.score);

    // 结构体变量的地址与第一个成员的地址相同
    printf("\n结构体变量地址: %p\n", (void*)&s1);
    printf("第一个成员地址: %p\n", (void*)&s1.id);
    printf("两者相同:       %s\n", (void*)&s1 == (void*)&s1.id ? "是" : "否");

    return 0;
}
```

**核心要点：**

| 场景 | 运算符 | 示例 |
|------|--------|------|
| 结构体变量 | `.` | `s1.name` |
| 结构体指针 | `->` | `ps->name` |
| 指针等价写法 | `(*ps).` | `(*ps).name` |

---

## 三、typedef 与结构体别名

### 3.1 为什么需要 typedef

每次使用结构体时都要写 `struct Student` 略显繁琐。`typedef` 关键字可以为类型创建一个别名，使得代码更加简洁易读。

```c
#include <stdio.h>
#include <string.h>

// 方式一：先定义结构体，再用 typedef 起别名
struct _Student {
    int    id;
    char   name[50];
    int    age;
    float  score;
};
typedef struct _Student Student;

// 方式二：在定义结构体的同时使用 typedef（最常用）
typedef struct {
    int    id;
    char   name[50];
    int    age;
    float  score;
} Student2;

// 方式三：同时保留 struct 标签和 typedef 别名
typedef struct StudentTag {
    int    id;
    char   name[50];
    int    age;
    float  score;
} Student3;

int main() {
    // 方式一的结果：可直接用 Student
    Student s1 = {1001, "张三", 20, 88.5};

    // 方式二的结果：只能用 Student2，无法用 struct xxx
    Student2 s2 = {1002, "李四", 21, 92.0};

    // 方式三的结果：两种写法都可用
    Student3 s3 = {1003, "王五", 22, 76.5};
    struct StudentTag s4 = {1004, "赵六", 23, 85.0};

    printf("s1: %d %s %d %.1f\n", s1.id, s1.name, s1.age, s1.score);
    printf("s2: %d %s %d %.1f\n", s2.id, s2.name, s2.age, s2.score);
    printf("s3: %d %s %d %.1f\n", s3.id, s3.name, s3.age, s3.score);
    printf("s4: %d %s %d %.1f\n", s4.id, s4.name, s4.age, s4.score);

    return 0;
}
```

### 3.2 链表节点中的 typedef 自引用

在定义链表节点时，`typedef` 有一些特殊用法，值得一提：

```c
// 错误示范：typedef 还未完成，不能自引用
// typedef struct {
//     int data;
//     Node *next;  // 错误！Node 此时尚未定义
// } Node;

// 正确做法：保留结构体标签
typedef struct Node {
    int data;
    struct Node *next;  // 使用 struct Node 引用自身
} Node;

// 或者先声明结构体标签，再 typedef
struct Node2;
typedef struct Node2 Node2;
struct Node2 {
    int data;
    Node2 *next;  // 现在 Node2 已经定义，可以直接使用
};
```

---

## 四、嵌套结构体与结构体数组

### 4.1 嵌套结构体

结构体的成员可以是另一个结构体，这称为嵌套结构体。它让我们能够构建层次化的数据模型。

```c
#include <stdio.h>
#include <string.h>

// 定义地址结构体
typedef struct {
    char province[30];  // 省份
    char city[30];      // 城市
    char street[100];   // 街道
} Address;

// 定义学生结构体，其中包含嵌套的 Address
typedef struct {
    int     id;
    char    name[50];
    int     age;
    float   score;
    Address addr;       // 嵌套结构体
} Student;

int main() {
    // 初始化嵌套结构体
    Student s1 = {
        1001,
        "张三",
        20,
        88.5,
        {"广东省", "深圳市", "南山区科技园路100号"}
    };

    // 或者分步初始化
    Student s2;
    s2.id = 1002;
    strcpy(s2.name, "李四");
    s2.age = 21;
    s2.score = 92.0;
    strcpy(s2.addr.province, "北京市");
    strcpy(s2.addr.city, "北京市");
    strcpy(s2.addr.street, "海淀区中关村大街1号");

    // 打印
    printf("=== 学生信息 ===\n");
    printf("学号: %d\n", s1.id);
    printf("姓名: %s\n", s1.name);
    printf("年龄: %d\n", s1.age);
    printf("成绩: %.1f\n", s1.score);
    printf("地址: %s %s %s\n", s1.addr.province, s1.addr.city, s1.addr.street);

    printf("\n");
    printf("学号: %d\n", s2.id);
    printf("姓名: %s\n", s2.name);
    printf("年龄: %d\n", s2.age);
    printf("成绩: %.1f\n", s2.score);
    printf("地址: %s %s %s\n", s2.addr.province, s2.addr.city, s2.addr.street);

    return 0;
}
```

### 4.2 结构体数组

当需要处理多个相同类型的结构体实例时，结构体数组是最自然的选择：

```c
#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 100

typedef struct {
    int    id;
    char   name[50];
    int    age;
    float  score;
} Student;

int main() {
    // 声明并初始化结构体数组
    Student students[MAX_STUDENTS] = {
        {1001, "张三", 20, 88.5},
        {1002, "李四", 21, 92.0},
        {1003, "王五", 22, 76.5},
        {1004, "赵六", 20, 85.0},
        {1005, "孙七", 21, 90.5}
    };

    int count = 5;  // 当前学生数量

    // 遍历数组
    printf("=== 学生成绩表 ===\n");
    printf("学号\t姓名\t年龄\t成绩\n");
    printf("--------------------------------------\n");
    for (int i = 0; i < count; i++) {
        printf("%d\t%s\t%d\t%.1f\n",
               students[i].id,
               students[i].name,
               students[i].age,
               students[i].score);
    }

    // 计算平均成绩
    float total = 0.0;
    for (int i = 0; i < count; i++) {
        total += students[i].score;
    }
    printf("--------------------------------------\n");
    printf("平均成绩: %.2f\n", total / count);

    // 查找最高分
    int max_idx = 0;
    for (int i = 1; i < count; i++) {
        if (students[i].score > students[max_idx].score) {
            max_idx = i;
        }
    }
    printf("最高分: %s (%.1f)\n", students[max_idx].name, students[max_idx].score);

    return 0;
}
```

**编译运行结果：**

```
=== 学生成绩表 ===
学号    姓名    年龄    成绩
--------------------------------------
1001    张三    20      88.5
1002    李四    21      92.0
1003    王五    22      76.5
1004    赵六    20      85.0
1005    孙七    21      90.5
--------------------------------------
平均成绩: 86.50
最高分: 李四 (92.0)
```

---

## 五、联合体（union）

### 5.1 联合体的概念

联合体（union）是一种特殊的结构体，其所有成员共享同一块内存空间。在任何时刻，联合体中只有一个成员是有效的。联合体的大小等于其最大成员的大小。

```c
#include <stdio.h>
#include <string.h>

// 定义一个联合体
union Data {
    int    i;
    float  f;
    char   str[20];
};

int main() {
    union Data data;

    printf("联合体 Data 的大小: %zu 字节\n", sizeof(union Data));
    printf("  int 大小:  %zu 字节\n", sizeof(int));
    printf("  float 大小: %zu 字节\n", sizeof(float));
    printf("  char[20] 大小: %zu 字节\n", sizeof(char[20]));

    // 联合体大小 = 最大成员的大小（考虑对齐）
    printf("\n解释: 联合体大小 = max(各成员大小) 对齐后\n");

    // 演示内存共享
    printf("\n=== 内存共享演示 ===\n");
    data.i = 0x12345678;
    printf("设置 data.i = 0x%X\n", data.i);
    printf("data.i = %d\n", data.i);
    printf("data.f = %e (解释为浮点数的结果)\n", data.f);

    // 写入 str 会覆盖 i 和 f 的内容
    strcpy(data.str, "Hello");
    printf("\n设置 data.str = \"Hello\"\n");
    printf("data.str = %s\n", data.str);
    printf("data.i = %d (原来的值已被覆盖)\n", data.i);

    // 所有成员地址相同
    printf("\n=== 地址验证 ===\n");
    printf("&data.i   = %p\n", (void*)&data.i);
    printf("&data.f   = %p\n", (void*)&data.f);
    printf("&data.str = %p\n", (void*)&data.str);
    printf("&data     = %p\n", (void*)&data);
    printf("所有地址相同: 是\n");

    return 0;
}
```

### 5.2 联合体的实际应用

联合体在实际编程中有多种用途，以下是一些典型场景：

```c
#include <stdio.h>
#include <string.h>

// 场景一：类型标记 + 联合体 = 变体类型
typedef enum {
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_STRING
} ValueType;

typedef struct {
    ValueType type;
    union {
        int    int_val;
        float  float_val;
        char   str_val[50];
    } value;
} Variant;

void print_variant(Variant v) {
    switch (v.type) {
        case TYPE_INT:
            printf("整数值: %d\n", v.value.int_val);
            break;
        case TYPE_FLOAT:
            printf("浮点值: %.2f\n", v.value.float_val);
            break;
        case TYPE_STRING:
            printf("字符串值: %s\n", v.value.str_val);
            break;
        default:
            printf("未知类型\n");
    }
}

int main() {
    Variant v1 = {TYPE_INT,    .value.int_val = 42};
    Variant v2 = {TYPE_FLOAT,  .value.float_val = 3.14f};
    Variant v3 = {TYPE_STRING, .value.str_val = "Hello World"};

    print_variant(v1);
    print_variant(v2);
    print_variant(v3);

    // 场景二：IP地址的不同表示方式
    union IPAddr {
        unsigned int  addr_int;   // 32位整数表示
        unsigned char bytes[4];   // 4个字节表示
    };

    union IPAddr ip;
    ip.bytes[0] = 192;
    ip.bytes[1] = 168;
    ip.bytes[2] = 1;
    ip.bytes[3] = 100;

    printf("\nIP地址的两种表示:\n");
    printf("  字节表示: %d.%d.%d.%d\n",
           ip.bytes[0], ip.bytes[1], ip.bytes[2], ip.bytes[3]);
    printf("  整数表示: 0x%08X\n", ip.addr_int);

    return 0;
}
```

---

## 六、枚举类型（enum）

### 6.1 枚举的基本用法

枚举（enum）用于定义一组命名的整数常量，使代码更加可读和可维护。

```c
#include <stdio.h>

// 定义枚举类型
typedef enum {
    RED,        // 0
    GREEN,      // 1
    BLUE,       // 2
    YELLOW,     // 3
    COLOR_COUNT // 4 —— 常用技巧：自动记录颜色总数
} Color;

// 手动指定枚举值
typedef enum {
    MONDAY    = 1,
    TUESDAY   = 2,
    WEDNESDAY = 3,
    THURSDAY  = 4,
    FRIDAY    = 5,
    SATURDAY  = 6,
    SUNDAY    = 7
} Weekday;

// 部分指定枚举值
typedef enum {
    HTTP_OK        = 200,
    HTTP_NOT_FOUND = 404,
    HTTP_ERROR     = 500       // 500
} HttpStatus;

int main() {
    // 基本使用
    Color c = RED;
    printf("RED = %d\n", c);
    printf("GREEN = %d\n", GREEN);
    printf("BLUE = %d\n", BLUE);
    printf("颜色总数 = %d\n\n", COLOR_COUNT);

    // 遍历枚举值
    const char* color_names[] = {"红色", "绿色", "蓝色", "黄色"};
    for (int i = RED; i < COLOR_COUNT; i++) {
        printf("Color %d: %s\n", i, color_names[i]);
    }

    // 星期枚举
    printf("\n周一的值: %d, 周日的值: %d\n", MONDAY, SUNDAY);

    // HTTP状态码
    HttpStatus status = HTTP_NOT_FOUND;
    printf("\nHTTP状态码: %d\n", status);

    // 枚举与 switch 结合
    printf("\n=== switch 配合枚举 ===\n");
    Weekday today = FRIDAY;
    switch (today) {
        case MONDAY:    printf("星期一，新的一周开始了！\n"); break;
        case TUESDAY:   printf("星期二，继续加油！\n"); break;
        case WEDNESDAY: printf("星期三，一周过半！\n"); break;
        case THURSDAY:  printf("星期四，快到周末了！\n"); break;
        case FRIDAY:    printf("星期五，TGIF！\n"); break;
        case SATURDAY:
        case SUNDAY:    printf("周末，好好休息！\n"); break;
        default:        printf("无效的星期\n");
    }

    return 0;
}
```

**编译运行结果：**

```
RED = 0
GREEN = 1
BLUE = 2
颜色总数 = 4

Color 0: 红色
Color 1: 绿色
Color 2: 蓝色
Color 3: 黄色

周一的值: 1, 周日的值: 7

HTTP状态码: 404

=== switch 配合枚举 ===
星期五，TGIF！
```

---

## 七、字节对齐与内存填充

### 7.1 为什么需要字节对齐

CPU访问内存时，并不是逐字节读取的，而是以"字"（word）为单位（通常是4字节或8字节）。如果数据没有按照边界对齐，CPU可能需要多次内存访问才能读取一个数据，这会降低效率。因此，编译器会自动在结构体成员之间插入填充字节（padding），以确保每个成员都位于其自然对齐边界上。

### 7.2 sizeof 与结构体大小

```c
#include <stdio.h>

// 不同的成员排列顺序导致不同的结构体大小
typedef struct {
    char  c;   // 1字节
    int   i;   // 4字节
    short s;   // 2字节
} StructA;

typedef struct {
    char  c;   // 1字节
    short s;   // 2字节
    int   i;   // 4字节
} StructB;

typedef struct {
    int   i;   // 4字节
    char  c;   // 1字节
    short s;   // 2字节
} StructC;

int main() {
    printf("=== 各类型大小 ===\n");
    printf("char:  %zu 字节\n", sizeof(char));
    printf("short: %zu 字节\n", sizeof(short));
    printf("int:   %zu 字节\n", sizeof(int));

    printf("\n=== 结构体大小对比 ===\n");
    printf("StructA (char, int, short):  %zu 字节\n", sizeof(StructA));
    printf("StructB (char, short, int):  %zu 字节\n", sizeof(StructB));
    printf("StructC (int, char, short):  %zu 字节\n", sizeof(StructC));

    printf("\n=== 详细分析 ===\n");
    printf("StructA 内存布局:\n");
    printf("  offset 0: char  c     (1字节)\n");
    printf("  offset 1-3: padding   (3字节，对齐到4)\n");
    printf("  offset 4-7: int   i   (4字节)\n");
    printf("  offset 8-9: short s   (2字节)\n");
    printf("  offset 10-11: padding (2字节，整体对齐到4)\n");
    printf("  总大小: 12 字节\n");

    printf("\nStructB 内存布局:\n");
    printf("  offset 0: char  c     (1字节)\n");
    printf("  offset 1: padding     (1字节)\n");
    printf("  offset 2-3: short s   (2字节)\n");
    printf("  offset 4-7: int   i   (4字节)\n");
    printf("  总大小: 8 字节\n");

    printf("\n总结: 合理排列成员顺序可以节省内存！\n");
    printf("StructA: 12字节, StructB: 8字节, 节省了33%%的空间\n");

    return 0;
}
```

### 7.3 使用 #pragma pack 控制对齐

在某些场景下（如网络协议、二进制文件格式），我们需要精确控制结构体的内存布局，可以使用 `#pragma pack` 指令：

```c
#include <stdio.h>

// 默认对齐（通常4或8字节）
typedef struct {
    char  c;
    int   i;
    short s;
} DefaultAligned;

// 1字节对齐（紧凑排列，无填充）
#pragma pack(push, 1)
typedef struct {
    char  c;
    int   i;
    short s;
} PackedAligned;
#pragma pack(pop)

// 2字节对齐
#pragma pack(push, 2)
typedef struct {
    char  c;
    int   i;
    short s;
} Packed2Aligned;
#pragma pack(pop)

int main() {
    printf("=== 不同对齐方式的结构体大小 ===\n");
    printf("默认对齐:  %zu 字节\n", sizeof(DefaultAligned));
    printf("1字节对齐: %zu 字节\n", sizeof(PackedAligned));
    printf("2字节对齐: %zu 字节\n", sizeof(Packed2Aligned));

    printf("\n=== 成员地址偏移量 ===\n");

    DefaultAligned da;
    printf("默认对齐:\n");
    printf("  &da.c = %p (offset 0)\n", (void*)&da.c);
    printf("  &da.i = %p (offset %td)\n", (void*)&da.i, (char*)&da.i - (char*)&da);
    printf("  &da.s = %p (offset %td)\n", (void*)&da.s, (char*)&da.s - (char*)&da);

    PackedAligned pa;
    printf("\n1字节对齐:\n");
    printf("  &pa.c = %p (offset 0)\n", (void*)&pa.c);
    printf("  &pa.i = %p (offset %td)\n", (void*)&pa.i, (char*)&pa.i - (char*)&pa);
    printf("  &pa.s = %p (offset %td)\n", (void*)&pa.s, (char*)&pa.s - (char*)&pa);

    printf("\n注意事项:\n");
    printf("1. #pragma pack 不是C标准的一部分，但大多数编译器支持\n");
    printf("2. 紧凑对齐可能导致性能下降\n");
    printf("3. 在某些架构上，未对齐的访问可能导致硬件异常\n");
    printf("4. 使用 push/pop 可以保存和恢复之前的对齐设置\n");

    return 0;
}
```

---

## 八、单向链表

### 8.1 链表的基本概念

链表是一种动态数据结构，由一系列节点（Node）组成，每个节点包含数据域和指向下一个节点的指针。与数组不同，链表的内存空间不需要连续，这使得插入和删除操作非常高效（时间复杂度为 O(1)），但随机访问需要遍历（时间复杂度为 O(n)）。

```
链表结构示意:

[HEAD] -> [数据|next] -> [数据|next] -> [数据|next] -> NULL
```

### 8.2 链表节点的定义

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 定义链表节点
typedef struct Node {
    int data;           // 数据域
    struct Node *next;  // 指针域，指向下一个节点
} Node;
```

### 8.3 创建节点

```c
// 创建一个新节点
Node* create_node(int data) {
    Node *new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}
```

### 8.4 完整的链表操作示例

```c
#include <stdio.h>
#include <stdlib.h>

// ============ 链表节点定义 ============
typedef struct Node {
    int data;
    struct Node *next;
} Node;

// ============ 创建节点 ============
Node* create_node(int data) {
    Node *new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        printf("内存分配失败！\n");
        exit(EXIT_FAILURE);
    }
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}

// ============ 头插法：在链表头部插入 ============
Node* insert_head(Node *head, int data) {
    Node *new_node = create_node(data);
    new_node->next = head;  // 新节点指向原头节点
    return new_node;         // 新节点成为头节点
}

// ============ 尾插法：在链表尾部插入 ============
Node* insert_tail(Node *head, int data) {
    Node *new_node = create_node(data);
    if (head == NULL) {
        return new_node;  // 空链表，新节点即为头节点
    }
    Node *current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
    return head;
}

// ============ 在指定位置插入（位置从0开始） ============
Node* insert_at(Node *head, int data, int position) {
    if (position == 0) {
        return insert_head(head, data);
    }

    Node *new_node = create_node(data);
    Node *current = head;
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;
    }

    if (current == NULL) {
        printf("插入位置超出链表长度！\n");
        free(new_node);
        return head;
    }

    new_node->next = current->next;
    current->next = new_node;
    return head;
}

// ============ 删除指定值的节点 ============
Node* delete_by_value(Node *head, int data) {
    if (head == NULL) return NULL;

    // 处理头节点就是要删除的节点
    if (head->data == data) {
        Node *temp = head->next;
        free(head);
        return temp;
    }

    // 查找要删除的节点
    Node *current = head;
    while (current->next != NULL && current->next->data != data) {
        current = current->next;
    }

    if (current->next != NULL) {
        Node *temp = current->next;
        current->next = temp->next;
        free(temp);
    } else {
        printf("未找到值为 %d 的节点\n", data);
    }

    return head;
}

// ============ 删除指定位置的节点 ============
Node* delete_at(Node *head, int position) {
    if (head == NULL) return NULL;

    if (position == 0) {
        Node *temp = head->next;
        free(head);
        return temp;
    }

    Node *current = head;
    for (int i = 0; i < position - 1 && current->next != NULL; i++) {
        current = current->next;
    }

    if (current->next == NULL) {
        printf("删除位置超出链表长度！\n");
        return head;
    }

    Node *temp = current->next;
    current->next = temp->next;
    free(temp);
    return head;
}

// ============ 遍历链表 ============
void traverse(Node *head) {
    if (head == NULL) {
        printf("链表为空！\n");
        return;
    }
    Node *current = head;
    while (current != NULL) {
        printf("[%d] -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

// ============ 查找节点 ============
Node* find(Node *head, int data) {
    Node *current = head;
    while (current != NULL) {
        if (current->data == data) {
            return current;
        }
        current = current->next;
    }
    return NULL;
}

// ============ 获取链表长度 ============
int length(Node *head) {
    int count = 0;
    Node *current = head;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    return count;
}

// ============ 反转链表（迭代法） ============
Node* reverse(Node *head) {
    Node *prev = NULL;
    Node *current = head;
    Node *next = NULL;

    while (current != NULL) {
        next = current->next;   // 保存下一个节点
        current->next = prev;   // 反转指针方向
        prev = current;         // prev 前进
        current = next;         // current 前进
    }

    return prev;  // prev 成为新的头节点
}

// ============ 反转链表（递归法） ============
Node* reverse_recursive(Node *head) {
    // 递归终止条件：空链表或只有一个节点
    if (head == NULL || head->next == NULL) {
        return head;
    }

    // 递归反转剩余部分
    Node *new_head = reverse_recursive(head->next);

    // 反转当前节点
    head->next->next = head;
    head->next = NULL;

    return new_head;
}

// ============ 释放整个链表 ============
void free_list(Node *head) {
    Node *current = head;
    while (current != NULL) {
        Node *temp = current;
        current = current->next;
        free(temp);
    }
}

// ============ 主函数：测试所有操作 ============
int main() {
    Node *head = NULL;

    printf("=== 链表操作测试 ===\n\n");

    // 1. 尾插法创建链表
    printf("1. 尾插法创建链表: 10, 20, 30, 40, 50\n");
    head = insert_tail(head, 10);
    head = insert_tail(head, 20);
    head = insert_tail(head, 30);
    head = insert_tail(head, 40);
    head = insert_tail(head, 50);
    printf("   链表: ");
    traverse(head);

    // 2. 头插法
    printf("\n2. 头插法插入 5\n");
    head = insert_head(head, 5);
    printf("   链表: ");
    traverse(head);

    // 3. 在指定位置插入
    printf("\n3. 在位置3插入 25\n");
    head = insert_at(head, 25, 3);
    printf("   链表: ");
    traverse(head);

    // 4. 删除指定值
    printf("\n4. 删除值为 30 的节点\n");
    head = delete_by_value(head, 30);
    printf("   链表: ");
    traverse(head);

    // 5. 删除指定位置
    printf("\n5. 删除位置0的节点\n");
    head = delete_at(head, 0);
    printf("   链表: ");
    traverse(head);

    // 6. 查找
    printf("\n6. 查找值为 40 的节点\n");
    Node *found = find(head, 40);
    if (found != NULL) {
        printf("   找到节点: data = %d\n", found->data);
    } else {
        printf("   未找到节点\n");
    }

    // 7. 长度
    printf("\n7. 链表长度: %d\n", length(head));

    // 8. 反转链表
    printf("\n8. 反转链表\n");
    head = reverse(head);
    printf("   反转后: ");
    traverse(head);

    // 9. 再次反转回去
    printf("\n9. 递归反转回去\n");
    head = reverse_recursive(head);
    printf("   反转后: ");
    traverse(head);

    // 10. 释放链表
    printf("\n10. 释放链表\n");
    free_list(head);
    head = NULL;
    printf("   链表已释放\n");

    return 0;
}
```

**编译运行结果：**

```
=== 链表操作测试 ===

1. 尾插法创建链表: 10, 20, 30, 40, 50
   链表: [10] -> [20] -> [30] -> [40] -> [50] -> NULL

2. 头插法插入 5
   链表: [5] -> [10] -> [20] -> [30] -> [40] -> [50] -> NULL

3. 在位置3插入 25
   链表: [5] -> [10] -> [20] -> [25] -> [30] -> [40] -> [50] -> NULL

4. 删除值为 30 的节点
   链表: [5] -> [10] -> [20] -> [25] -> [40] -> [50] -> NULL

5. 删除位置0的节点
   链表: [10] -> [20] -> [25] -> [40] -> [50] -> NULL

6. 查找值为 40 的节点
   找到节点: data = 40

7. 链表长度: 5

8. 反转链表
   反转后: [50] -> [40] -> [25] -> [20] -> [10] -> NULL

9. 递归反转回去
   反转后: [10] -> [20] -> [25] -> [40] -> [50] -> NULL

10. 释放链表
   链表已释放
```

### 8.5 链表反转的详细图解

```
反转前:  head -> [1|next] -> [2|next] -> [3|next] -> NULL

迭代过程:
初始:    prev=NULL,  current=1,  next=?
第1步:   next=2,  current->next=NULL,  prev=1,  current=2
         NULL <- [1]    [2|next] -> [3|next] -> NULL
第2步:   next=3,  current->next=1,  prev=2,  current=3
         NULL <- [1] <- [2]    [3|next] -> NULL
第3步:   next=NULL,  current->next=2,  prev=3,  current=NULL
         NULL <- [1] <- [2] <- [3]

反转后:  head -> [3|next] -> [2|next] -> [1|next] -> NULL
```

---

## 九、文件I/O基础

### 9.1 文件指针与 fopen 模式

C语言通过 `FILE *` 类型的指针来操作文件。`fopen` 函数用于打开文件，其第二个参数指定打开模式。以下是所有常用的打开模式：

| 模式 | 含义 | 文件不存在时 | 文件存在时 |
|------|------|-------------|-----------|
| `"r"` | 只读（文本） | 返回 NULL | 从头读取 |
| `"w"` | 只写（文本） | 创建新文件 | 清空文件内容 |
| `"a"` | 追加（文本） | 创建新文件 | 在末尾追加 |
| `"rb"` | 只读（二进制） | 返回 NULL | 从头读取 |
| `"wb"` | 只写（二进制） | 创建新文件 | 清空文件内容 |
| `"ab"` | 追加（二进制） | 创建新文件 | 在末尾追加 |
| `"r+"` | 读写（文本） | 返回 NULL | 从头开始 |
| `"w+"` | 读写（文本） | 创建新文件 | 清空文件内容 |
| `"a+"` | 读+追加（文本） | 创建新文件 | 在末尾写入 |
| `"rb+"` | 读写（二进制） | 返回 NULL | 从头开始 |
| `"wb+"` | 读写（二进制） | 创建新文件 | 清空文件内容 |
| `"ab+"` | 读+追加（二进制） | 创建新文件 | 在末尾写入 |

### 9.2 文件操作的基本流程

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE *fp;

    // 1. 打开文件
    fp = fopen("test.txt", "w");
    if (fp == NULL) {
        printf("无法打开文件！\n");
        return EXIT_FAILURE;
    }

    // 2. 操作文件（写入、读取等）

    // 3. 关闭文件
    fclose(fp);

    printf("文件操作完成\n");
    return 0;
}
```

**重要提示：** 每次打开文件后，务必在操作完成后调用 `fclose` 关闭文件。否则可能导致数据丢失或资源泄漏。

---

## 十、文本文件操作

### 10.1 fprintf 与 fscanf

`fprintf` 和 `fscanf` 是格式化文件读写函数，用法与 `printf` 和 `scanf` 类似，只是多了一个文件指针参数。

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int    id;
    char   name[50];
    int    age;
    float  score;
} Student;

int main() {
    // ============ 写入文本文件 ============
    FILE *fp = fopen("students.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件！\n");
        return EXIT_FAILURE;
    }

    Student students[] = {
        {1001, "张三", 20, 88.5},
        {1002, "李四", 21, 92.0},
        {1003, "王五", 22, 76.5},
        {1004, "赵六", 20, 85.0},
        {1005, "孙七", 21, 90.5}
    };
    int count = 5;

    // 先写入学生数量
    fprintf(fp, "%d\n", count);

    // 写入每个学生的信息
    for (int i = 0; i < count; i++) {
        fprintf(fp, "%d %s %d %.1f\n",
                students[i].id,
                students[i].name,
                students[i].age,
                students[i].score);
    }

    fclose(fp);
    printf("已写入 %d 条学生记录到 students.txt\n", count);

    // ============ 从文本文件读取 ============
    fp = fopen("students.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件！\n");
        return EXIT_FAILURE;
    }

    int read_count;
    fscanf(fp, "%d\n", &read_count);

    printf("\n从文件读取的学生信息:\n");
    printf("学号\t姓名\t年龄\t成绩\n");
    printf("--------------------------------------\n");

    for (int i = 0; i < read_count; i++) {
        Student s;
        fscanf(fp, "%d %s %d %f\n", &s.id, s.name, &s.age, &s.score);
        printf("%d\t%s\t%d\t%.1f\n", s.id, s.name, s.age, s.score);
    }

    fclose(fp);

    return 0;
}
```

### 10.2 fgets 与 fputs

`fgets` 和 `fputs` 是行级别的文件读写函数，适合处理文本行。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // ============ 使用 fputs 写入多行文本 ============
    FILE *fp = fopen("poem.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件！\n");
        return EXIT_FAILURE;
    }

    fputs("静夜思\n", fp);
    fputs("床前明月光，\n", fp);
    fputs("疑是地上霜。\n", fp);
    fputs("举头望明月，\n", fp);
    fputs("低头思故乡。\n", fp);

    fclose(fp);
    printf("已写入 poem.txt\n");

    // ============ 使用 fgets 逐行读取 ============
    fp = fopen("poem.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件！\n");
        return EXIT_FAILURE;
    }

    char line[256];
    int line_num = 1;

    printf("\n从文件读取:\n");
    printf("--------------------------------------\n");

    while (fgets(line, sizeof(line), fp) != NULL) {
        // fgets 会保留换行符，用 printf 输出时换行符会起作用
        printf("第%d行: %s", line_num, line);
        line_num++;
    }

    fclose(fp);

    // ============ fgets 与 fscanf 的区别 ============
    printf("\n=== fgets 与 fscanf 的区别 ===\n");
    printf("1. fgets 读取整行（包括空格），直到换行符或缓冲区满\n");
    printf("2. fscanf 按格式读取，遇到空格/换行会停止\n");
    printf("3. fgets 会保留换行符，fscanf 不会\n");
    printf("4. fgets 更安全（可指定缓冲区大小），不会溢出\n");

    return 0;
}
```

### 10.3 文本文件与结构体：完整示例

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME 50
#define MAX_STUDENTS 100

typedef struct {
    int    id;
    char   name[MAX_NAME];
    int    age;
    float  score;
} Student;

// 保存学生数组到文本文件
int save_students_text(const char *filename, Student *students, int count) {
    FILE *fp = fopen(filename, "w");
    if (fp == NULL) {
        printf("无法创建文件 %s\n", filename);
        return 0;
    }

    fprintf(fp, "%d\n", count);
    for (int i = 0; i < count; i++) {
        fprintf(fp, "%d\n%s\n%d\n%.2f\n",
                students[i].id,
                students[i].name,
                students[i].age,
                students[i].score);
    }

    fclose(fp);
    return 1;
}

// 从文本文件加载学生数组
int load_students_text(const char *filename, Student *students, int *count) {
    FILE *fp = fopen(filename, "r");
    if (fp == NULL) {
        printf("无法打开文件 %s\n", filename);
        return 0;
    }

    fscanf(fp, "%d\n", count);
    if (*count > MAX_STUDENTS) {
        printf("记录数 %d 超出最大容量 %d\n", *count, MAX_STUDENTS);
        fclose(fp);
        return 0;
    }

    for (int i = 0; i < *count; i++) {
        fscanf(fp, "%d\n", &students[i].id);
        fgets(students[i].name, MAX_NAME, fp);
        // 去除 fgets 保留的换行符
        students[i].name[strcspn(students[i].name, "\n")] = '\0';
        fscanf(fp, "%d\n", &students[i].age);
        fscanf(fp, "%f\n", &students[i].score);
    }

    fclose(fp);
    return 1;
}

int main() {
    Student students[MAX_STUDENTS];
    Student loaded[MAX_STUDENTS];
    int count = 5;
    int loaded_count = 0;

    // 准备数据
    students[0] = (Student){1001, "张三", 20, 88.5};
    students[1] = (Student){1002, "李四", 21, 92.0};
    students[2] = (Student){1003, "王五", 22, 76.5};
    students[3] = (Student){1004, "赵六", 20, 85.0};
    students[4] = (Student){1005, "孙七", 21, 90.5};

    // 保存
    if (save_students_text("students_text.txt", students, count)) {
        printf("已保存 %d 条记录到 students_text.txt\n", count);
    }

    // 加载
    if (load_students_text("students_text.txt", loaded, &loaded_count)) {
        printf("\n从文件加载了 %d 条记录:\n", loaded_count);
        printf("学号\t姓名\t年龄\t成绩\n");
        printf("--------------------------------------\n");
        for (int i = 0; i < loaded_count; i++) {
            printf("%d\t%s\t%d\t%.1f\n",
                   loaded[i].id, loaded[i].name, loaded[i].age, loaded[i].score);
        }
    }

    return 0;
}
```

---

## 十一、二进制文件操作

### 11.1 二进制文件 vs 文本文件

| 特性 | 文本文件 | 二进制文件 |
|------|---------|-----------|
| 存储方式 | 以ASCII/UTF-8字符存储 | 以原始字节存储 |
| 可读性 | 人类可读 | 不可读（需程序解析） |
| 空间效率 | 较低（数字"12345"占5字节） | 较高（int 12345仅占4字节） |
| 精度 | 浮点数转换可能损失精度 | 保持原始二进制精度 |
| 跨平台 | 需处理换行符差异 | 需处理字节序差异 |
| 适用场景 | 配置文件、日志、CSV | 数据库、序列化、网络协议 |

### 11.2 fwrite 与 fread

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int    id;
    char   name[50];
    int    age;
    float  score;
} Student;

int main() {
    // ============ 二进制写入 ============
    FILE *fp = fopen("students.dat", "wb");
    if (fp == NULL) {
        printf("无法创建文件！\n");
        return EXIT_FAILURE;
    }

    Student students[] = {
        {1001, "张三", 20, 88.5},
        {1002, "李四", 21, 92.0},
        {1003, "王五", 22, 76.5},
        {1004, "赵六", 20, 85.0},
        {1005, "孙七", 21, 90.5}
    };
    int count = 5;

    // 先写入记录数量
    fwrite(&count, sizeof(int), 1, fp);

    // 一次性写入所有学生记录
    size_t written = fwrite(students, sizeof(Student), count, fp);
    printf("fwrite: 写入 %zu 条记录, 每条 %zu 字节\n", written, sizeof(Student));

    fclose(fp);

    // ============ 二进制读取 ============
    fp = fopen("students.dat", "rb");
    if (fp == NULL) {
        printf("无法打开文件！\n");
        return EXIT_FAILURE;
    }

    int read_count;
    fread(&read_count, sizeof(int), 1, fp);

    // 动态分配内存
    Student *read_students = (Student*)malloc(sizeof(Student) * read_count);
    if (read_students == NULL) {
        printf("内存分配失败！\n");
        fclose(fp);
        return EXIT_FAILURE;
    }

    size_t items_read = fread(read_students, sizeof(Student), read_count, fp);
    printf("fread: 读取 %zu 条记录\n", items_read);

    printf("\n从二进制文件读取的学生信息:\n");
    printf("学号\t姓名\t年龄\t成绩\n");
    printf("--------------------------------------\n");
    for (int i = 0; i < read_count; i++) {
        printf("%d\t%s\t%d\t%.1f\n",
               read_students[i].id,
               read_students[i].name,
               read_students[i].age,
               read_students[i].score);
    }

    free(read_students);
    fclose(fp);

    return 0;
}
```

### 11.3 fseek, ftell, rewind 文件定位

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int  id;
    float score;
} Record;

#define RECORD_COUNT 5

int main() {
    FILE *fp;

    // ============ 创建测试文件 ============
    fp = fopen("records.dat", "wb");
    if (fp == NULL) {
        printf("无法创建文件！\n");
        return EXIT_FAILURE;
    }

    Record records[RECORD_COUNT] = {
        {1, 85.5}, {2, 92.0}, {3, 76.5}, {4, 88.0}, {5, 95.5}
    };
    fwrite(records, sizeof(Record), RECORD_COUNT, fp);
    fclose(fp);

    // ============ 使用 ftell 获取当前位置 ============
    fp = fopen("records.dat", "rb");
    if (fp == NULL) {
        printf("无法打开文件！\n");
        return EXIT_FAILURE;
    }

    printf("=== ftell: 获取当前文件位置 ===\n");
    long pos = ftell(fp);
    printf("打开文件后位置: %ld\n", pos);

    Record r;
    fread(&r, sizeof(Record), 1, fp);
    pos = ftell(fp);
    printf("读取第1条记录后位置: %ld\n", pos);

    // ============ 使用 fseek 定位 ============
    printf("\n=== fseek: 定位到指定位置 ===\n");

    // SEEK_SET: 从文件开头偏移
    fseek(fp, 2 * sizeof(Record), SEEK_SET);
    printf("定位到第3条记录（从开头偏移 %zu 字节）\n", 2 * sizeof(Record));
    fread(&r, sizeof(Record), 1, fp);
    printf("第3条记录: id=%d, score=%.1f\n", r.id, r.score);

    // SEEK_CUR: 从当前位置偏移
    fseek(fp, -1 * (long)sizeof(Record), SEEK_CUR);
    printf("回退一条记录\n");
    fread(&r, sizeof(Record), 1, fp);
    printf("再次读取: id=%d, score=%.1f\n", r.id, r.score);

    // SEEK_END: 从文件末尾偏移
    fseek(fp, -1 * (long)sizeof(Record), SEEK_END);
    printf("定位到文件最后一条记录\n");
    fread(&r, sizeof(Record), 1, fp);
    printf("最后一条: id=%d, score=%.1f\n", r.id, r.score);

    // ============ 使用 rewind 回到开头 ============
    printf("\n=== rewind: 回到文件开头 ===\n");
    rewind(fp);
    pos = ftell(fp);
    printf("rewind 后位置: %ld\n", pos);
    fread(&r, sizeof(Record), 1, fp);
    printf("第1条记录: id=%d, score=%.1f\n", r.id, r.score);

    // ============ 获取文件大小 ============
    fseek(fp, 0, SEEK_END);
    long file_size = ftell(fp);
    printf("\n文件大小: %ld 字节\n", file_size);
    printf("记录数量: %ld\n", file_size / (long)sizeof(Record));

    fclose(fp);

    // ============ fseek 定位常量总结 ============
    printf("\n=== fseek 定位常量 ===\n");
    printf("SEEK_SET = %d  (从文件开头)\n", SEEK_SET);
    printf("SEEK_CUR = %d  (从当前位置)\n", SEEK_CUR);
    printf("SEEK_END = %d  (从文件末尾)\n", SEEK_END);

    return 0;
}
```

**编译运行结果：**

```
=== ftell: 获取当前文件位置 ===
打开文件后位置: 0
读取第1条记录后位置: 8

=== fseek: 定位到指定位置 ===
定位到第3条记录（从开头偏移 16 字节）
第3条记录: id=3, score=76.5
回退一条记录
再次读取: id=3, score=76.5
定位到文件最后一条记录
最后一条: id=5, score=95.5

=== rewind: 回到文件开头 ===
rewind 后位置: 0
第1条记录: id=1, score=85.5

文件大小: 40 字节
记录数量: 5

=== fseek 定位常量 ===
SEEK_SET = 0  (从文件开头)
SEEK_CUR = 1  (从当前位置)
SEEK_END = 2  (从文件末尾)
```

---

## 十二、综合项目：学生成绩管理系统

本节将前面所学的结构体、链表、文件I/O知识整合到一个完整的项目中，构建一个基于动态链表的"学生成绩管理系统"，支持数据的二进制持久化存储。

### 12.1 项目需求

1. 使用单向链表存储学生信息（学号、姓名、年龄、成绩）
2. 支持添加、删除、修改、查找学生记录
3. 支持按成绩排序
4. 支持统计功能（平均分、最高分、最低分、及格率）
5. 支持将数据保存到二进制文件并从文件加载
6. 程序启动时自动加载已有数据，退出时自动保存

### 12.2 完整源代码

```c
/*
 * 学生成绩管理系统 (Student Grade Management System)
 *
 * 功能特性:
 *   - 基于单向链表动态存储学生信息
 *   - 支持增删改查操作
 *   - 支持按成绩排序
 *   - 统计功能（平均分、最高分、最低分、及格率）
 *   - 二进制文件持久化存储
 *   - 自动加载/保存数据
 *
 * 编译方法:
 *   gcc -o student_system student_system.c
 *   (MSVC) cl student_system.c
 *
 * 运行方法:
 *   ./student_system
 *   (Windows) student_system.exe
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ==================== 常量定义 ====================
#define MAX_NAME_LEN    50
#define DATA_FILENAME   "students_data.dat"
#define PASS_SCORE      60.0

// ==================== 数据结构定义 ====================

// 学生信息结构体
typedef struct {
    int    id;                     // 学号
    char   name[MAX_NAME_LEN];     // 姓名
    int    age;                    // 年龄
    float  score;                  // 成绩
} Student;

// 链表节点
typedef struct StudentNode {
    Student data;                  // 学生数据
    struct StudentNode *next;      // 指向下一个节点
} StudentNode;

// ==================== 链表操作函数 ====================

/*
 * 创建一个新节点
 * @param s: 学生数据
 * @return: 新创建的节点指针
 */
StudentNode* create_node(Student s) {
    StudentNode *node = (StudentNode*)malloc(sizeof(StudentNode));
    if (node == NULL) {
        printf("[错误] 内存分配失败！系统可能内存不足。\n");
        exit(EXIT_FAILURE);
    }
    node->data = s;
    node->next = NULL;
    return node;
}

/*
 * 在链表尾部添加学生
 * @param head: 链表头指针的指针
 * @param s: 学生数据
 */
void append_student(StudentNode **head, Student s) {
    StudentNode *new_node = create_node(s);

    if (*head == NULL) {
        *head = new_node;
        return;
    }

    StudentNode *current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
}

/*
 * 按学号删除学生
 * @param head: 链表头指针的指针
 * @param id: 要删除的学号
 * @return: 1=删除成功, 0=未找到
 */
int delete_student(StudentNode **head, int id) {
    if (*head == NULL) {
        return 0;
    }

    StudentNode *current = *head;
    StudentNode *prev = NULL;

    // 查找目标节点
    while (current != NULL && current->data.id != id) {
        prev = current;
        current = current->next;
    }

    if (current == NULL) {
        return 0;  // 未找到
    }

    // 删除节点
    if (prev == NULL) {
        // 删除的是头节点
        *head = current->next;
    } else {
        prev->next = current->next;
    }

    free(current);
    return 1;
}

/*
 * 按学号查找学生
 * @param head: 链表头指针
 * @param id: 学号
 * @return: 找到的节点指针, 未找到返回NULL
 */
StudentNode* find_student(StudentNode *head, int id) {
    StudentNode *current = head;
    while (current != NULL) {
        if (current->data.id == id) {
            return current;
        }
        current = current->next;
    }
    return NULL;
}

/*
 * 按姓名查找学生（支持模糊匹配）
 * @param head: 链表头指针
 * @param name: 姓名关键字
 */
void search_by_name(StudentNode *head, const char *name) {
    int found = 0;
    StudentNode *current = head;

    printf("\n--- 搜索 '%s' 的结果 ---\n", name);
    printf("%-8s %-12s %-6s %-8s\n", "学号", "姓名", "年龄", "成绩");
    printf("------------------------------------------\n");

    while (current != NULL) {
        if (strstr(current->data.name, name) != NULL) {
            printf("%-8d %-12s %-6d %-8.1f\n",
                   current->data.id,
                   current->data.name,
                   current->data.age,
                   current->data.score);
            found++;
        }
        current = current->next;
    }

    if (found == 0) {
        printf("  未找到匹配的学生记录\n");
    } else {
        printf("------------------------------------------\n");
        printf("  共找到 %d 条记录\n", found);
    }
}

/*
 * 修改学生信息
 * @param head: 链表头指针
 * @param id: 学号
 * @param new_name: 新姓名
 * @param new_age: 新年龄
 * @param new_score: 新成绩
 * @return: 1=修改成功, 0=未找到
 */
int modify_student(StudentNode *head, int id,
                   const char *new_name, int new_age, float new_score) {
    StudentNode *node = find_student(head, id);
    if (node == NULL) {
        return 0;
    }

    strncpy(node->data.name, new_name, MAX_NAME_LEN - 1);
    node->data.name[MAX_NAME_LEN - 1] = '\0';
    node->data.age = new_age;
    node->data.score = new_score;
    return 1;
}

/*
 * 获取链表长度
 * @param head: 链表头指针
 * @return: 节点数量
 */
int get_count(StudentNode *head) {
    int count = 0;
    StudentNode *current = head;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    return count;
}

/*
 * 显示所有学生信息
 * @param head: 链表头指针
 */
void display_all(StudentNode *head) {
    if (head == NULL) {
        printf("\n  当前没有学生记录。\n\n");
        return;
    }

    printf("\n%-8s %-12s %-6s %-8s\n", "学号", "姓名", "年龄", "成绩");
    printf("------------------------------------------\n");

    StudentNode *current = head;
    while (current != NULL) {
        printf("%-8d %-12s %-6d %-8.1f",
               current->data.id,
               current->data.name,
               current->data.age,
               current->data.score);

        // 标记不及格
        if (current->data.score < PASS_SCORE) {
            printf(" [不及格]");
        }
        printf("\n");

        current = current->next;
    }
    printf("------------------------------------------\n");
    printf("  共 %d 条记录\n", get_count(head));
}

// ==================== 排序函数 ====================

/*
 * 链表排序 —— 按成绩降序（冒泡排序思想）
 * 通过交换节点数据域实现排序
 * @param head: 链表头指针
 */
void sort_by_score_desc(StudentNode *head) {
    if (head == NULL || head->next == NULL) {
        return;  // 空链表或只有一个节点，无需排序
    }

    int swapped;
    StudentNode *current;
    StudentNode *last = NULL;

    do {
        swapped = 0;
        current = head;

        while (current->next != last) {
            if (current->data.score < current->next->data.score) {
                // 交换数据域
                Student temp = current->data;
                current->data = current->next->data;
                current->next->data = temp;
                swapped = 1;
            }
            current = current->next;
        }
        last = current;
    } while (swapped);
}

/*
 * 链表排序 —— 按成绩升序
 * @param head: 链表头指针
 */
void sort_by_score_asc(StudentNode *head) {
    if (head == NULL || head->next == NULL) {
        return;
    }

    int swapped;
    StudentNode *current;
    StudentNode *last = NULL;

    do {
        swapped = 0;
        current = head;

        while (current->next != last) {
            if (current->data.score > current->next->data.score) {
                Student temp = current->data;
                current->data = current->next->data;
                current->next->data = temp;
                swapped = 1;
            }
            current = current->next;
        }
        last = current;
    } while (swapped);
}

// ==================== 统计函数 ====================

/*
 * 显示统计信息
 * @param head: 链表头指针
 */
void show_statistics(StudentNode *head) {
    if (head == NULL) {
        printf("\n  没有数据可供统计。\n");
        return;
    }

    int count = 0;
    int pass_count = 0;
    float total = 0.0;
    float max_score = -1.0;
    float min_score = 101.0;
    char max_name[MAX_NAME_LEN] = "";
    char min_name[MAX_NAME_LEN] = "";

    StudentNode *current = head;
    while (current != NULL) {
        count++;
        total += current->data.score;

        if (current->data.score >= PASS_SCORE) {
            pass_count++;
        }

        if (current->data.score > max_score) {
            max_score = current->data.score;
            strncpy(max_name, current->data.name, MAX_NAME_LEN - 1);
        }

        if (current->data.score < min_score) {
            min_score = current->data.score;
            strncpy(min_name, current->data.name, MAX_NAME_LEN - 1);
        }

        current = current->next;
    }

    float avg = total / count;
    float pass_rate = (float)pass_count / count * 100.0;

    printf("\n========== 成绩统计 ==========\n");
    printf("  学生总数:     %d 人\n", count);
    printf("  平均成绩:     %.2f 分\n", avg);
    printf("  最高分:       %.1f 分 (%s)\n", max_score, max_name);
    printf("  最低分:       %.1f 分 (%s)\n", min_score, min_name);
    printf("  及格人数:     %d 人\n", pass_count);
    printf("  不及格人数:   %d 人\n", count - pass_count);
    printf("  及格率:       %.2f%%\n", pass_rate);
    printf("===============================\n");
}

// ==================== 文件持久化 ====================

/*
 * 将链表数据保存到二进制文件
 * 文件格式: [记录数量(int)] [学生记录1] [学生记录2] ...
 * @param head: 链表头指针
 * @param filename: 文件名
 * @return: 1=成功, 0=失败
 */
int save_to_file(StudentNode *head, const char *filename) {
    FILE *fp = fopen(filename, "wb");
    if (fp == NULL) {
        printf("[错误] 无法创建文件 %s\n", filename);
        return 0;
    }

    // 写入记录数量
    int count = get_count(head);
    fwrite(&count, sizeof(int), 1, fp);

    // 遍历链表，逐条写入
    StudentNode *current = head;
    while (current != NULL) {
        fwrite(&(current->data), sizeof(Student), 1, fp);
        current = current->next;
    }

    fclose(fp);
    printf("[成功] 已保存 %d 条记录到 %s\n", count, filename);
    return 1;
}

/*
 * 从二进制文件加载数据到链表
 * @param head: 链表头指针的指针
 * @param filename: 文件名
 * @return: 1=成功, 0=失败
 */
int load_from_file(StudentNode **head, const char *filename) {
    FILE *fp = fopen(filename, "rb");
    if (fp == NULL) {
        // 文件不存在是正常情况（首次运行）
        return 0;
    }

    // 读取记录数量
    int count;
    if (fread(&count, sizeof(int), 1, fp) != 1) {
        printf("[错误] 读取文件头失败\n");
        fclose(fp);
        return 0;
    }

    // 逐条读取并添加到链表
    for (int i = 0; i < count; i++) {
        Student s;
        if (fread(&s, sizeof(Student), 1, fp) != 1) {
            printf("[错误] 读取第 %d 条记录失败\n", i + 1);
            fclose(fp);
            return 0;
        }
        append_student(head, s);
    }

    fclose(fp);
    printf("[成功] 从 %s 加载了 %d 条记录\n", filename, count);
    return 1;
}

// ==================== 辅助函数 ====================

/*
 * 清空输入缓冲区
 */
void clear_input_buffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

/*
 * 获取一个整数输入（带错误处理）
 * @param prompt: 提示信息
 * @return: 输入的整数
 */
int get_int_input(const char *prompt) {
    int value;
    while (1) {
        printf("%s", prompt);
        if (scanf("%d", &value) == 1) {
            clear_input_buffer();
            return value;
        }
        printf("[错误] 请输入有效的整数！\n");
        clear_input_buffer();
    }
}

/*
 * 获取一个浮点数输入（带错误处理）
 * @param prompt: 提示信息
 * @return: 输入的浮点数
 */
float get_float_input(const char *prompt) {
    float value;
    while (1) {
        printf("%s", prompt);
        if (scanf("%f", &value) == 1) {
            clear_input_buffer();
            return value;
        }
        printf("[错误] 请输入有效的数字！\n");
        clear_input_buffer();
    }
}

/*
 * 获取字符串输入
 * @param prompt: 提示信息
 * @param buffer: 存储缓冲区
 * @param size: 缓冲区大小
 */
void get_string_input(const char *prompt, char *buffer, int size) {
    printf("%s", prompt);
    fgets(buffer, size, stdin);
    // 去除换行符
    buffer[strcspn(buffer, "\n")] = '\0';
}

/*
 * 检查学号是否已存在
 * @param head: 链表头指针
 * @param id: 学号
 * @return: 1=存在, 0=不存在
 */
int is_id_exists(StudentNode *head, int id) {
    return find_student(head, id) != NULL;
}

/*
 * 释放整个链表
 * @param head: 链表头指针
 */
void free_all(StudentNode *head) {
    StudentNode *current = head;
    while (current != NULL) {
        StudentNode *temp = current;
        current = current->next;
        free(temp);
    }
}

// ==================== 菜单函数 ====================

/*
 * 显示主菜单
 */
void show_menu() {
    printf("\n");
    printf("╔══════════════════════════════════╗\n");
    printf("║     学生成绩管理系统 v2.0        ║\n");
    printf("╠══════════════════════════════════╣\n");
    printf("║  1. 添加学生                     ║\n");
    printf("║  2. 删除学生                     ║\n");
    printf("║  3. 修改学生信息                 ║\n");
    printf("║  4. 按学号查找                   ║\n");
    printf("║  5. 按姓名查找                   ║\n");
    printf("║  6. 显示所有学生                 ║\n");
    printf("║  7. 按成绩排序（降序）           ║\n");
    printf("║  8. 按成绩排序（升序）           ║\n");
    printf("║  9. 成绩统计                     ║\n");
    printf("║ 10. 保存数据到文件               ║\n");
    printf("║ 11. 从文件加载数据               ║\n");
    printf("║  0. 退出系统                     ║\n");
    printf("╚══════════════════════════════════╝\n");
    printf("请选择操作 [0-11]: ");
}

// ==================== 主函数 ====================

int main() {
    StudentNode *head = NULL;

    printf("============================================\n");
    printf("    欢迎使用学生成绩管理系统\n");
    printf("============================================\n");

    // 启动时自动加载数据
    load_from_file(&head, DATA_FILENAME);

    int choice;
    int running = 1;

    while (running) {
        show_menu();

        if (scanf("%d", &choice) != 1) {
            printf("[错误] 请输入有效的数字！\n");
            clear_input_buffer();
            continue;
        }
        clear_input_buffer();

        switch (choice) {
            case 1: {  // 添加学生
                printf("\n--- 添加学生 ---\n");
                Student s;

                s.id = get_int_input("  学号: ");
                if (is_id_exists(head, s.id)) {
                    printf("[错误] 学号 %d 已存在！\n", s.id);
                    break;
                }

                get_string_input("  姓名: ", s.name, MAX_NAME_LEN);
                if (strlen(s.name) == 0) {
                    printf("[错误] 姓名不能为空！\n");
                    break;
                }

                s.age = get_int_input("  年龄: ");
                if (s.age <= 0 || s.age > 150) {
                    printf("[错误] 年龄应在 1-150 之间！\n");
                    break;
                }

                s.score = get_float_input("  成绩: ");
                if (s.score < 0 || s.score > 100) {
                    printf("[错误] 成绩应在 0-100 之间！\n");
                    break;
                }

                append_student(&head, s);
                printf("[成功] 学生 %s (学号:%d) 已添加\n", s.name, s.id);
                break;
            }

            case 2: {  // 删除学生
                if (head == NULL) {
                    printf("\n  当前没有学生记录，无法删除。\n");
                    break;
                }
                printf("\n--- 删除学生 ---\n");
                int id = get_int_input("  请输入要删除的学号: ");
                if (delete_student(&head, id)) {
                    printf("[成功] 学号 %d 的学生已删除\n", id);
                } else {
                    printf("[错误] 未找到学号为 %d 的学生\n", id);
                }
                break;
            }

            case 3: {  // 修改学生信息
                if (head == NULL) {
                    printf("\n  当前没有学生记录，无法修改。\n");
                    break;
                }
                printf("\n--- 修改学生信息 ---\n");
                int id = get_int_input("  请输入要修改的学号: ");

                StudentNode *node = find_student(head, id);
                if (node == NULL) {
                    printf("[错误] 未找到学号为 %d 的学生\n", id);
                    break;
                }

                printf("  当前信息: %s, 年龄:%d, 成绩:%.1f\n",
                       node->data.name, node->data.age, node->data.score);

                char new_name[MAX_NAME_LEN];
                get_string_input("  新姓名 (直接回车保持不变): ", new_name, MAX_NAME_LEN);

                char age_str[10];
                printf("  新年龄 (直接回车保持不变): ");
                fgets(age_str, sizeof(age_str), stdin);
                age_str[strcspn(age_str, "\n")] = '\0';

                char score_str[10];
                printf("  新成绩 (直接回车保持不变): ");
                fgets(score_str, sizeof(score_str), stdin);
                score_str[strcspn(score_str, "\n")] = '\0';

                if (strlen(new_name) > 0) {
                    strncpy(node->data.name, new_name, MAX_NAME_LEN - 1);
                }
                if (strlen(age_str) > 0) {
                    int new_age = atoi(age_str);
                    if (new_age > 0 && new_age <= 150) {
                        node->data.age = new_age;
                    }
                }
                if (strlen(score_str) > 0) {
                    float new_score = atof(score_str);
                    if (new_score >= 0 && new_score <= 100) {
                        node->data.score = new_score;
                    }
                }

                printf("[成功] 学号 %d 的信息已更新\n", id);
                printf("  新信息: %s, 年龄:%d, 成绩:%.1f\n",
                       node->data.name, node->data.age, node->data.score);
                break;
            }

            case 4: {  // 按学号查找
                if (head == NULL) {
                    printf("\n  当前没有学生记录。\n");
                    break;
                }
                int id = get_int_input("\n  请输入学号: ");
                StudentNode *node = find_student(head, id);
                if (node != NULL) {
                    printf("\n  学号: %d\n", node->data.id);
                    printf("  姓名: %s\n", node->data.name);
                    printf("  年龄: %d\n", node->data.age);
                    printf("  成绩: %.1f\n", node->data.score);
                } else {
                    printf("[提示] 未找到学号为 %d 的学生\n", id);
                }
                break;
            }

            case 5: {  // 按姓名查找
                if (head == NULL) {
                    printf("\n  当前没有学生记录。\n");
                    break;
                }
                char name[MAX_NAME_LEN];
                get_string_input("\n  请输入姓名关键字: ", name, MAX_NAME_LEN);
                search_by_name(head, name);
                break;
            }

            case 6:  // 显示所有学生
                display_all(head);
                break;

            case 7:  // 按成绩降序排序
                if (head == NULL) {
                    printf("\n  当前没有学生记录。\n");
                    break;
                }
                sort_by_score_desc(head);
                printf("[成功] 已按成绩降序排序\n");
                display_all(head);
                break;

            case 8:  // 按成绩升序排序
                if (head == NULL) {
                    printf("\n  当前没有学生记录。\n");
                    break;
                }
                sort_by_score_asc(head);
                printf("[成功] 已按成绩升序排序\n");
                display_all(head);
                break;

            case 9:  // 成绩统计
                show_statistics(head);
                break;

            case 10:  // 保存数据
                if (head == NULL) {
                    printf("\n  当前没有数据需要保存。\n");
                    break;
                }
                save_to_file(head, DATA_FILENAME);
                break;

            case 11:  // 加载数据
                printf("\n  警告: 加载数据将覆盖当前所有未保存的数据！\n");
                printf("  是否继续? (y/n): ");
                char confirm;
                scanf("%c", &confirm);
                clear_input_buffer();
                if (confirm == 'y' || confirm == 'Y') {
                    free_all(head);
                    head = NULL;
                    load_from_file(&head, DATA_FILENAME);
                } else {
                    printf("  加载已取消\n");
                }
                break;

            case 0:  // 退出
                printf("\n正在保存数据...\n");
                if (head != NULL) {
                    save_to_file(head, DATA_FILENAME);
                }
                printf("感谢使用，再见！\n");
                running = 0;
                break;

            default:
                printf("[错误] 无效的选择，请重新输入 [0-11]\n");
        }
    }

    // 释放所有内存
    free_all(head);

    return 0;
}
```

### 12.3 编译与运行

Linux/Mac环境下：

```bash
gcc -o student_system student_system.c
./student_system
```

Windows环境下（MSVC）：

```powershell
cl student_system.c
student_system.exe
```

Windows环境下（MinGW）：

```powershell
gcc -o student_system.exe student_system.c
student_system.exe
```

### 12.4 程序功能演示

```
============================================
    欢迎使用学生成绩管理系统
============================================

╔══════════════════════════════════╗
║     学生成绩管理系统 v2.0        ║
╠══════════════════════════════════╣
║  1. 添加学生                     ║
║  2. 删除学生                     ║
║  3. 修改学生信息                 ║
║  4. 按学号查找                   ║
║  5. 按姓名查找                   ║
║  6. 显示所有学生                 ║
║  7. 按成绩排序（降序）           ║
║  8. 按成绩排序（升序）           ║
║  9. 成绩统计                     ║
║ 10. 保存数据到文件               ║
║ 11. 从文件加载数据               ║
║  0. 退出系统                     ║
╚══════════════════════════════════╝
请选择操作 [0-11]:
```

选择1添加几条学生记录后，选择6显示：

```
学号     姓名         年龄   成绩
------------------------------------------
1001     张三          20     88.5
1002     李四          21     92.0
1003     王五          22     76.5
1004     赵六          20     85.0
1005     孙七          21     90.5
------------------------------------------
  共 5 条记录
```

选择9查看统计：

```
========== 成绩统计 ==========
  学生总数:     5 人
  平均成绩:     86.50 分
  最高分:       92.0 分 (李四)
  最低分:       76.5 分 (王五)
  及格人数:     5 人
  不及格人数:   0 人
  及格率:       100.00%
===============================
```

选择0退出时，数据自动保存到 `students_data.dat` 文件。下次启动程序时，数据将自动加载。

---

## 十三、调试技巧：追踪链表操作

### 13.1 使用 printf 调试链表

在开发链表程序时，使用 `printf` 打印调试信息是最简单直接的方法：

```c
#include <stdio.h>
#include <stdlib.h>

// 定义一个宏，方便开关调试输出
#define DEBUG 1

#if DEBUG
    #define DEBUG_PRINT(fmt, ...) \
        printf("[DEBUG] %s:%d: " fmt, __FILE__, __LINE__, ##__VA_ARGS__)
#else
    #define DEBUG_PRINT(fmt, ...)
#endif

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* create_node(int data) {
    DEBUG_PRINT("创建节点: data=%d\n", data);
    Node *node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->next = NULL;
    return node;
}

Node* insert_head(Node *head, int data) {
    DEBUG_PRINT("头插法: data=%d\n", data);
    Node *new_node = create_node(data);
    new_node->next = head;
    DEBUG_PRINT("新头节点: %p, 下一个: %p\n",
                (void*)new_node, (void*)new_node->next);
    return new_node;
}

void print_list(Node *head) {
    Node *current = head;
    int index = 0;
    while (current != NULL) {
        printf("  [%d] addr=%p, data=%d, next=%p\n",
               index, (void*)current, current->data, (void*)current->next);
        current = current->next;
        index++;
    }
}

// 反转链表（带调试输出）
Node* reverse_debug(Node *head) {
    DEBUG_PRINT("开始反转链表\n");

    Node *prev = NULL;
    Node *current = head;
    Node *next = NULL;
    int step = 0;

    while (current != NULL) {
        next = current->next;
        DEBUG_PRINT("步骤%d: current=%d, prev=%s, next=%s\n",
                    step,
                    current->data,
                    prev ? (char[]){'0'+prev->data, '\0'} : "NULL",
                    next ? (char[]){'0'+next->data, '\0'} : "NULL");

        current->next = prev;
        prev = current;
        current = next;
        step++;
    }

    DEBUG_PRINT("反转完成, 新头节点 data=%d\n", prev ? prev->data : -1);
    return prev;
}

int main() {
    printf("=== 链表调试示例 ===\n\n");

    Node *head = NULL;

    printf("构建链表: 1 -> 2 -> 3 -> 4 -> 5\n");
    for (int i = 5; i >= 1; i--) {
        head = insert_head(head, i);
    }

    printf("\n初始链表:\n");
    print_list(head);

    printf("\n执行反转...\n");
    head = reverse_debug(head);

    printf("\n反转后链表:\n");
    print_list(head);

    // 释放内存
    while (head != NULL) {
        Node *temp = head;
        head = head->next;
        free(temp);
    }

    return 0;
}
```

### 13.2 使用 GDB 调试

GDB（GNU Debugger）是Linux下强大的调试工具。以下是调试链表程序的常用命令：

```bash
# 编译时加入调试信息
gcc -g -o linked_list linked_list.c

# 启动GDB
gdb ./linked_list

# GDB常用命令
(gdb) break main              # 在main函数入口设置断点
(gdb) break insert_head       # 在insert_head函数设置断点
(gdb) break 45                # 在第45行设置断点
(gdb) run                     # 运行程序
(gdb) next                    # 单步执行（不进入函数）
(gdb) step                    # 单步执行（进入函数）
(gdb) continue                # 继续执行到下一个断点
(gdb) print head              # 打印变量值
(gdb) print *head             # 打印指针指向的内容
(gdb) print head->data        # 打印结构体成员
(gdb) print head->next
(gdb) backtrace               # 查看调用栈
(gdb) info locals             # 查看局部变量
(gdb) list                    # 显示当前代码
(gdb) watch head->data        # 设置监视点（值改变时中断）
(gdb) quit                    # 退出GDB
```

**GDB调试链表示例：**

```bash
$ gdb ./linked_list
(gdb) break main
Breakpoint 1 at 0x4011a0: file linked_list.c, line 73.
(gdb) run
Starting program: ./linked_list

Breakpoint 1, main () at linked_list.c:73
73      Node *head = NULL;

(gdb) next
76          head = insert_head(head, i);

(gdb) step
insert_head (head=0x0, data=1) at linked_list.c:25
25      Node* insert_head(Node *head, int data) {

(gdb) next
26          Node *new_node = create_node(data);
(gdb) next
create_node (data=1) at linked_list.c:15
15      Node* create_node(int data) {

(gdb) finish
Run till exit from #0  create_node (data=1) at linked_list.c:15
insert_head (head=0x0, data=1) at linked_list.c:27
27          new_node->next = head;

(gdb) print *new_node
$1 = {data = 1, next = 0x0}

(gdb) print new_node
$2 = (Node *) 0x5555555592a0

(gdb) continue
Continuing.
```

### 13.3 常见链表调试问题

| 问题 | 症状 | 原因 | 解决方法 |
|------|------|------|----------|
| 段错误 (Segfault) | 程序崩溃 | 访问 NULL 指针或已释放的内存 | 检查指针是否为 NULL 再访问 |
| 内存泄漏 | 程序内存持续增长 | 未释放不再使用的节点 | 确保每个 malloc 都有对应的 free |
| 野指针 | 不可预测的行为 | 释放内存后继续使用指针 | 释放后将指针设为 NULL |
| 死循环 | 程序卡住 | 链表形成环 | 遍历时设置最大步数或使用快慢指针检测 |
| 插入失败 | 数据丢失 | 忘记更新头指针 | 头指针使用二级指针或返回新头指针 |

**内存泄漏检测工具（Valgrind）：**

```bash
# 编译
gcc -g -o linked_list linked_list.c

# 使用 Valgrind 检测内存泄漏
valgrind --leak-check=full ./linked_list

# 输出示例：
# ==12345== HEAP SUMMARY:
# ==12345==     in use at exit: 0 bytes in 0 blocks
# ==12345==   total heap usage: 5 allocs, 5 frees, 80 bytes allocated
# ==12345==
# ==12345== All heap blocks were freed -- no leaks are possible
```

---

## 十四、总结

本文系统地讲解了C语言中结构体与文件I/O的核心概念和高级用法，涵盖了以下内容：

### 结构体部分

1. **结构体基础**：定义、初始化（顺序初始化、指定成员初始化、部分初始化）、成员访问（`.` 和 `->` 运算符）
2. **typedef 别名**：三种常见的 typedef 写法，以及自引用结构体中 typedef 的正确用法
3. **嵌套结构体与结构体数组**：构建层次化数据模型，批量处理同类数据
4. **联合体（union）**：内存共享机制，变体类型实现，IP地址解析等实际应用
5. **枚举类型（enum）**：命名常量定义，与 switch 配合使用，自动计数技巧
6. **字节对齐与填充**：编译器对齐规则，不同成员排列对内存的影响，`#pragma pack` 控制对齐

### 链表部分

1. **单向链表**：节点定义、创建、头插法、尾插法、指定位置插入
2. **链表操作**：按值删除、按位置删除、查找、遍历、获取长度
3. **链表反转**：迭代法和递归法两种实现
4. **内存管理**：动态分配与释放，避免内存泄漏

### 文件I/O部分

1. **文件打开模式**：`r/w/a/rb/wb/ab/r+/w+/a+` 等所有模式详解
2. **文本文件操作**：`fprintf`、`fscanf`、`fgets`、`fputs` 的使用
3. **二进制文件操作**：`fwrite`、`fread` 进行结构化数据读写
4. **文件定位**：`fseek`（SEEK_SET/SEEK_CUR/SEEK_END）、`ftell`、`rewind`

### 综合项目

"学生成绩管理系统"将上述所有知识点整合为一个完整的命令行应用，实现了：
- 基于单向链表的动态数据存储
- 增删改查完整功能
- 按成绩排序（升序/降序）
- 成绩统计分析（平均分、最高分、最低分、及格率）
- 二进制文件持久化存储
- 程序启动自动加载、退出自动保存

### 调试技巧

介绍了使用 `printf` 宏和 GDB 进行链表调试的方法，以及常见问题的排查思路。

掌握这些知识后，你已经具备了使用C语言开发中等规模应用程序的能力。结构体让你能够构建复杂的数据模型，链表让你能够高效地管理动态数据，文件I/O则让你的数据能够跨越程序运行周期持久保存。这三者的结合，正是C语言在系统编程、嵌入式开发等领域经久不衰的重要原因。

建议读者在理解本文内容的基础上，动手实践以下扩展练习：

1. 为链表添加"在指定节点后插入"和"删除链表尾部节点"功能
2. 实现双向链表，并对比单向链表的优缺点
3. 为成绩管理系统添加"按学号排序"和"按姓名排序"功能
4. 尝试使用文本文件（如CSV格式）替代二进制文件进行数据存储
5. 实现一个简单的数据库索引（使用链表+文件I/O）

---

> **本文所有代码示例均可在 GCC/MinGW/MSVC 环境下编译运行。文章内容约 15000 字，涵盖了C语言结构体与文件I/O的完整知识体系。**
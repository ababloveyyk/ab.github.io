---
title: C语言结构体与文件IOⅠ
date: 2026-07-26
tags:
  - C语言
  - 结构体
  - 内存布局
categories:
  - C语言
---

# C语言结构体与文件IOⅠ——结构体基础

## 一、引言

在C语言的基本数据类型中，int、char、float、double等都只能表示单一的数据值。但在实际编程中，我们经常需要将多个不同类型的数据组合在一起，形成一个有机的整体。例如，描述一个学生需要学号（整数）、姓名（字符串）、年龄（整数）、成绩（浮点数）等多个属性。结构体（struct）正是C语言为解决这一问题而提供的复合数据类型。

结构体是C语言中最重要的自定义数据类型，它允许我们将不同类型的数据成员封装成一个逻辑整体。本章将从结构体的最基础概念讲起，逐步深入到结构体数组、嵌套结构体、typedef类型别名、结构体作为函数参数、内存布局等核心主题。每个知识点都配有完整可运行的代码示例，帮助你透彻理解结构体的方方面面。

---

## 二、结构体的定义与声明

### 2.1 结构体的基本定义

结构体的定义使用关键字 `struct`，后跟结构体名称和一对花括号，花括号内是成员列表。每个成员由类型和名称组成，以分号结尾。结构体定义本身不分配内存，它只是定义了一个新的数据类型模板。

```c
#include <stdio.h>
#include <string.h>

/*
 * 结构体的基本定义
 * 结构体是用户自定义的复合数据类型
 * 定义结构体时不分配内存，只是创建了一个类型模板
 */

// 定义一个学生结构体
struct Student {
    int    id;          // 学号，占4字节
    char   name[50];    // 姓名，占50字节
    int    age;         // 年龄，占4字节
    float  score;       // 成绩，占4字节
};

// 定义一个点结构体（二维坐标）
struct Point {
    int x;  // x坐标
    int y;  // y坐标
};

// 定义一个矩形结构体
struct Rectangle {
    struct Point top_left;      // 左上角坐标
    struct Point bottom_right;  // 右下角坐标
};

int main() {
    printf("========== 结构体基本定义 ==========\n\n");

    // 声明结构体变量（分配内存）
    struct Student stu1;

    // 为结构体成员赋值
    stu1.id = 1001;
    strcpy(stu1.name, "张三");
    stu1.age = 20;
    stu1.score = 92.5;

    // 访问结构体成员
    printf("学生信息:\n");
    printf("  学号: %d\n", stu1.id);
    printf("  姓名: %s\n", stu1.name);
    printf("  年龄: %d\n", stu1.age);
    printf("  成绩: %.1f\n", stu1.score);

    // 结构体占用的内存大小
    printf("\n结构体大小:\n");
    printf("  sizeof(struct Student) = %zu 字节\n", sizeof(struct Student));
    printf("  理论大小: 4 + 50 + 4 + 4 = 62 字节\n");
    printf("  实际大小: %zu 字节 (由于内存对齐)\n", sizeof(struct Student));

    return 0;
}
```

### 2.2 结构体的多种声明方式

C语言提供了多种声明结构体变量的方式，每种方式都有其适用场景。理解这些声明方式对于阅读和维护代码非常重要。

```c
#include <stdio.h>
#include <string.h>

/*
 * 结构体的多种声明方式
 * C语言提供了灵活的声明语法，适用于不同场景
 */

// 方式1：先定义结构体类型，再声明变量（最常用）
struct Book {
    char  title[100];
    char  author[50];
    int   pages;
    float price;
};

// 方式2：定义结构体类型的同时声明变量
struct Car {
    char  brand[30];
    char  model[30];
    int   year;
} car1, car2;  // 全局变量

// 方式3：匿名结构体（只能在此处声明变量）
struct {
    char  country[50];
    char  capital[50];
    long  population;
} china, japan;  // 只能在此处声明，之后无法再声明此类型的变量

// 方式4：使用typedef创建类型别名（推荐方式）
typedef struct {
    char  name[50];
    int   quantity;
    float unit_price;
} Product;

int main() {
    printf("========== 结构体声明方式 ==========\n\n");

    // 方式1：使用struct关键字声明
    struct Book book1;
    strcpy(book1.title, "C程序设计语言");
    strcpy(book1.author, "Kernighan & Ritchie");
    book1.pages = 272;
    book1.price = 39.00;

    printf("方式1 - struct Book变量:\n");
    printf("  书名: %s\n", book1.title);
    printf("  作者: %s\n", book1.author);
    printf("  页数: %d\n", book1.pages);
    printf("  价格: %.2f\n\n", book1.price);

    // 方式2：定义时已声明的全局变量
    strcpy(car1.brand, "Toyota");
    strcpy(car1.model, "Corolla");
    car1.year = 2024;

    printf("方式2 - 定义时声明的变量:\n");
    printf("  品牌: %s\n", car1.brand);
    printf("  型号: %s\n", car1.model);
    printf("  年份: %d\n\n", car1.year);

    // 方式3：匿名结构体变量
    strcpy(china.country, "中国");
    strcpy(china.capital, "北京");
    china.population = 1400000000;

    printf("方式3 - 匿名结构体变量:\n");
    printf("  国家: %s\n", china.country);
    printf("  首都: %s\n", china.capital);
    printf("  人口: %ld\n\n", china.population);

    // 方式4：使用typedef后的类型别名（无需struct关键字）
    Product prod;
    strcpy(prod.name, "机械键盘");
    prod.quantity = 100;
    prod.unit_price = 299.00;

    printf("方式4 - typedef类型别名:\n");
    printf("  产品: %s\n", prod.name);
    printf("  数量: %d\n", prod.quantity);
    printf("  单价: %.2f\n", prod.unit_price);
    printf("  总价: %.2f\n", prod.quantity * prod.unit_price);

    return 0;
}
```

### 2.3 结构体的初始化

结构体变量可以在声明时进行初始化，C语言提供了多种初始化语法。C99标准引入了指定初始化器，使得初始化更加灵活和可读。

```c
#include <stdio.h>
#include <string.h>

/*
 * 结构体的初始化方式
 * 展示了C89传统的顺序初始化和C99的指定初始化器
 */

struct Address {
    char  street[100];
    char  city[50];
    char  province[50];
    char  country[50];
    int   zip_code;
};

struct Employee {
    int    id;
    char   name[50];
    int    age;
    double salary;
    struct Address addr;  // 嵌套结构体
};

int main() {
    printf("========== 结构体初始化方式 ==========\n\n");

    // 方式1：顺序初始化（C89/C90）
    // 必须按照成员定义的顺序依次给出值
    struct Employee emp1 = {
        1001,                    // id
        "李四",                  // name
        28,                      // age
        15000.00,                // salary
        {"科技路100号",          // addr.street
         "深圳",                 // addr.city
         "广东",                 // addr.province
         "中国",                 // addr.country
         518000}                 // addr.zip_code
    };

    printf("方式1：顺序初始化\n");
    printf("  员工: %s (ID:%d)\n", emp1.name, emp1.id);
    printf("  年龄: %d, 薪资: %.2f\n", emp1.age, emp1.salary);
    printf("  地址: %s, %s, %s, %s %d\n\n",
           emp1.addr.street, emp1.addr.city,
           emp1.addr.province, emp1.addr.country, emp1.addr.zip_code);

    // 方式2：指定初始化器（C99，推荐）
    // 可以按任意顺序指定成员，未指定的成员自动初始化为0
    struct Employee emp2 = {
        .name = "王五",
        .salary = 22000.00,
        .id = 1002,
        .addr = {
            .city = "北京",
            .street = "长安街1号",
            .zip_code = 100000
        }
        // age未指定，自动初始化为0
        // addr.country和addr.province未指定，自动初始化为空字符串
    };

    printf("方式2：指定初始化器 (C99)\n");
    printf("  员工: %s (ID:%d)\n", emp2.name, emp2.id);
    printf("  年龄: %d (未指定，默认0)\n", emp2.age);
    printf("  薪资: %.2f\n", emp2.salary);
    printf("  地址: %s, %s\n\n", emp2.addr.street, emp2.addr.city);

    // 方式3：部分初始化
    // 只初始化前几个成员，其余自动初始化为0
    struct Employee emp3 = {1003, "赵六"};
    printf("方式3：部分初始化\n");
    printf("  员工: %s (ID:%d)\n", emp3.name, emp3.id);
    printf("  年龄: %d (默认0)\n", emp3.age);
    printf("  薪资: %.2f (默认0)\n\n", emp3.salary);

    // 方式4：先声明再逐个赋值
    struct Employee emp4;
    emp4.id = 1004;
    strcpy(emp4.name, "孙七");
    emp4.age = 25;
    emp4.salary = 18000.00;
    strcpy(emp4.addr.street, "中山路200号");
    strcpy(emp4.addr.city, "上海");
    strcpy(emp4.addr.province, "上海");
    strcpy(emp4.addr.country, "中国");
    emp4.addr.zip_code = 200000;

    printf("方式4：声明后逐个赋值\n");
    printf("  员工: %s (ID:%d)\n", emp4.name, emp4.id);
    printf("  地址: %s, %s\n", emp4.addr.street, emp4.addr.city);

    return 0;
}
```

---

## 三、结构体成员访问

### 3.1 点运算符（.）与箭头运算符（->）

结构体成员访问有两种方式：使用点运算符 `.` 访问结构体变量本身的成员，使用箭头运算符 `->` 通过指针访问结构体成员。理解这两种运算符的使用场景和区别是掌握结构体编程的关键。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 结构体成员访问：. 运算符 vs -> 运算符
 *
 * . 运算符：用于结构体变量访问成员
 * -> 运算符：用于结构体指针访问成员（等价于 (*ptr).member）
 */

typedef struct {
    int    id;
    char   name[50];
    double price;
    int    stock;
} Item;

// 函数：通过值传递修改成员（不会影响原变量）
void modify_by_value(Item item) {
    item.price = 999.99;     // 只修改副本
    item.stock = 0;
    printf("  在函数内部(值传递): price=%.2f, stock=%d\n",
           item.price, item.stock);
}

// 函数：通过指针修改成员（会影响原变量）
void modify_by_pointer(Item* item) {
    item->price = 999.99;    // 通过->修改原变量
    item->stock = 0;
    printf("  在函数内部(指针传递): price=%.2f, stock=%d\n",
           item->price, item->stock);
}

// 函数：混合使用.和->
void print_item(const Item* item) {
    printf("  商品ID: %d\n", item->id);
    printf("  商品名: %s\n", item->name);
    printf("  价格: %.2f\n", item->price);
    printf("  库存: %d\n", item->stock);
}

int main() {
    printf("========== 结构体成员访问 . 与 -> ==========\n\n");

    // 栈上分配的结构体变量
    Item item1;
    item1.id = 1;
    strcpy(item1.name, "笔记本电脑");
    item1.price = 5999.00;
    item1.stock = 50;

    printf("栈上变量 - 使用.访问:\n");
    printf("  item1.id = %d\n", item1.id);
    printf("  item1.name = %s\n", item1.name);
    printf("  item1.price = %.2f\n", item1.price);
    printf("  item1.stock = %d\n\n", item1.stock);

    // 堆上分配的结构体变量（返回指针）
    Item* item2 = (Item*)malloc(sizeof(Item));
    if (!item2) return 1;

    item2->id = 2;       // 等价于 (*item2).id = 2;
    strcpy(item2->name, "机械键盘");
    item2->price = 299.00;
    item2->stock = 200;

    printf("堆上变量 - 使用->访问:\n");
    printf("  item2->id = %d\n", item2->id);
    printf("  item2->name = %s\n", item2->name);
    printf("  item2->price = %.2f\n", item2->price);
    printf("  item2->stock = %d\n\n", item2->stock);

    // 演示 . 和 -> 的等价性
    printf(". 和 -> 的等价性:\n");
    printf("  item2->id   = %d\n", item2->id);
    printf("  (*item2).id = %d\n", (*item2).id);
    printf("  (两者完全等价)\n\n");

    // 演示值传递 vs 指针传递
    printf("值传递 vs 指针传递:\n");
    printf("修改前: item1.price=%.2f, item1.stock=%d\n",
           item1.price, item1.stock);

    modify_by_value(item1);
    printf("值传递后: item1.price=%.2f, item1.stock=%d (未改变!)\n\n",
           item1.price, item1.stock);

    modify_by_pointer(&item1);
    printf("指针传递后: item1.price=%.2f, item1.stock=%d (已改变!)\n\n",
           item1.price, item1.stock);

    // 打印函数使用const指针
    printf("使用const指针打印（只读访问）:\n");
    print_item(item2);

    free(item2);
    return 0;
}
```

### 3.2 结构体指针的进阶用法

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 结构体指针进阶用法
 * 包括指针运算、动态数组、自引用结构体等
 */

typedef struct {
    int x;
    int y;
} Point;

typedef struct {
    Point start;
    Point end;
    char  color[20];
} Line;

// 自引用结构体（链表节点）
typedef struct Node {
    int data;
    struct Node* next;  // 指向同类型结构体的指针
} Node;

int main() {
    printf("========== 结构体指针进阶 ==========\n\n");

    // 1. 结构体指针数组
    Point points[3] = {
        {10, 20},
        {30, 40},
        {50, 60}
    };

    Point* p_ptr = points;  // 指向数组第一个元素

    printf("1. 结构体指针与数组:\n");
    for (int i = 0; i < 3; i++) {
        printf("  points[%d] = (%d, %d)\n", i, p_ptr[i].x, p_ptr[i].y);
        // 也可以写成: (p_ptr + i)->x, (p_ptr + i)->y
    }

    // 2. 指针运算
    printf("\n2. 指针运算:\n");
    printf("  p_ptr     = %p\n", (void*)p_ptr);
    printf("  p_ptr + 1 = %p\n", (void*)(p_ptr + 1));
    printf("  sizeof(Point) = %zu\n", sizeof(Point));
    printf("  注意：p_ptr+1 跳过了sizeof(Point)个字节\n");

    // 3. 动态分配结构体数组
    printf("\n3. 动态分配结构体数组:\n");
    Line* lines = (Line*)malloc(3 * sizeof(Line));
    if (lines) {
        for (int i = 0; i < 3; i++) {
            lines[i].start.x = i * 10;
            lines[i].start.y = i * 10;
            lines[i].end.x = (i + 1) * 10;
            lines[i].end.y = (i + 1) * 10;
            snprintf(lines[i].color, sizeof(lines[i].color), "Color%d", i);
        }

        for (int i = 0; i < 3; i++) {
            printf("  Line %d: (%d,%d)->(%d,%d) color=%s\n",
                   i, lines[i].start.x, lines[i].start.y,
                   lines[i].end.x, lines[i].end.y, lines[i].color);
        }
        free(lines);
    }

    // 4. 自引用结构体（构建简单链表）
    printf("\n4. 自引用结构体（链表）:\n");
    Node* head = NULL;

    // 创建链表: 1 -> 2 -> 3
    for (int i = 3; i >= 1; i--) {
        Node* node = (Node*)malloc(sizeof(Node));
        node->data = i * 10;
        node->next = head;
        head = node;
    }

    // 遍历链表
    printf("  链表内容: ");
    Node* current = head;
    while (current) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");

    // 释放链表
    while (head) {
        Node* temp = head;
        head = head->next;
        free(temp);
    }

    return 0;
}
```

---

## 四、结构体数组

### 4.1 结构体数组的定义与操作

结构体数组是C语言中非常实用的数据结构。它将多个同类型的结构体组织在一起，方便批量处理。例如，一个班级有50个学生，我们可以用一个包含50个Student结构体的数组来表示。

```c
#include <stdio.h>
#include <string.h>

/*
 * 结构体数组
 * 将多个同类型结构体组织在一起，方便批量处理
 */

#define MAX_STUDENTS 100

typedef struct {
    int    id;
    char   name[50];
    int    age;
    float  scores[3];  // 三门课的成绩
    float  average;
} Student;

// 计算每个学生的平均分
void calculate_averages(Student students[], int count) {
    for (int i = 0; i < count; i++) {
        float sum = 0;
        for (int j = 0; j < 3; j++) {
            sum += students[i].scores[j];
        }
        students[i].average = sum / 3.0;
    }
}

// 按平均分排序（冒泡排序）
void sort_by_average(Student students[], int count) {
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - 1 - i; j++) {
            if (students[j].average < students[j + 1].average) {
                // 交换整个结构体
                Student temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
            }
        }
    }
}

// 打印所有学生信息
void print_students(const Student students[], int count) {
    printf("%-6s %-12s %-6s %-8s %-8s %-8s %-8s\n",
           "学号", "姓名", "年龄", "语文", "数学", "英语", "平均分");
    printf("------------------------------------------------------------\n");

    for (int i = 0; i < count; i++) {
        printf("%-6d %-12s %-6d %-8.1f %-8.1f %-8.1f %-8.2f\n",
               students[i].id,
               students[i].name,
               students[i].age,
               students[i].scores[0],
               students[i].scores[1],
               students[i].scores[2],
               students[i].average);
    }
}

// 查找学生
int find_student_by_id(const Student students[], int count, int id) {
    for (int i = 0; i < count; i++) {
        if (students[i].id == id) {
            return i;  // 返回索引
        }
    }
    return -1;  // 未找到
}

int main() {
    printf("========== 结构体数组 ==========\n\n");

    // 初始化结构体数组
    Student class1[MAX_STUDENTS] = {
        {1001, "张三", 20, {85.0, 92.0, 78.0}, 0},
        {1002, "李四", 19, {90.0, 88.0, 95.0}, 0},
        {1003, "王五", 20, {76.0, 82.0, 80.0}, 0},
        {1004, "赵六", 21, {95.0, 91.0, 89.0}, 0},
        {1005, "孙七", 19, {70.0, 75.0, 72.0}, 0},
        {1006, "周八", 20, {88.0, 85.0, 92.0}, 0},
        {1007, "吴九", 21, {82.0, 79.0, 86.0}, 0},
        {1008, "郑十", 19, {93.0, 96.0, 90.0}, 0},
    };
    int student_count = 8;

    printf("原始数据:\n");
    print_students(class1, student_count);

    // 计算平均分
    calculate_averages(class1, student_count);
    printf("\n计算平均分后:\n");
    print_students(class1, student_count);

    // 排序
    sort_by_average(class1, student_count);
    printf("\n按平均分降序排序后:\n");
    print_students(class1, student_count);

    // 查找学生
    printf("\n查找学生:\n");
    int search_id = 1005;
    int index = find_student_by_id(class1, student_count, search_id);
    if (index >= 0) {
        printf("  找到学号%d: %s, 平均分%.2f\n",
               search_id, class1[index].name, class1[index].average);
    } else {
        printf("  未找到学号%d\n", search_id);
    }

    // 统计信息
    printf("\n统计信息:\n");
    float total_avg = 0;
    float max_avg = class1[0].average;
    float min_avg = class1[0].average;
    for (int i = 0; i < student_count; i++) {
        total_avg += class1[i].average;
        if (class1[i].average > max_avg) max_avg = class1[i].average;
        if (class1[i].average < min_avg) min_avg = class1[i].average;
    }
    printf("  班级平均分: %.2f\n", total_avg / student_count);
    printf("  最高分: %.2f\n", max_avg);
    printf("  最低分: %.2f\n", min_avg);

    return 0;
}
```

### 4.2 动态结构体数组

当数据量不确定时，使用动态分配的结构体数组更加灵活。我们可以通过malloc/calloc动态分配数组，并通过realloc扩展数组大小。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 动态结构体数组
 * 适用于数据量不确定的场景
 */

typedef struct {
    char  name[50];
    char  phone[20];
    char  email[50];
    int   age;
} Contact;

// 动态联系人管理
typedef struct {
    Contact* contacts;   // 动态数组指针
    int      count;      // 当前联系人数量
    int      capacity;   // 数组容量
} ContactList;

// 初始化联系人列表
ContactList* contact_list_create(int initial_capacity) {
    ContactList* list = (ContactList*)malloc(sizeof(ContactList));
    if (!list) return NULL;

    list->contacts = (Contact*)malloc(initial_capacity * sizeof(Contact));
    if (!list->contacts) {
        free(list);
        return NULL;
    }

    list->count = 0;
    list->capacity = initial_capacity;
    return list;
}

// 扩展容量
int contact_list_expand(ContactList* list) {
    int new_capacity = list->capacity * 2;
    Contact* temp = (Contact*)realloc(list->contacts,
                                       new_capacity * sizeof(Contact));
    if (!temp) return 0;

    list->contacts = temp;
    list->capacity = new_capacity;
    return 1;
}

// 添加联系人
int contact_list_add(ContactList* list, const char* name,
                     const char* phone, const char* email, int age) {
    if (list->count >= list->capacity) {
        if (!contact_list_expand(list)) {
            return 0;  // 扩容失败
        }
    }

    Contact* c = &list->contacts[list->count];
    strncpy(c->name, name, sizeof(c->name) - 1);
    strncpy(c->phone, phone, sizeof(c->phone) - 1);
    strncpy(c->email, email, sizeof(c->email) - 1);
    c->age = age;

    list->count++;
    return 1;
}

// 删除联系人（按索引）
void contact_list_remove(ContactList* list, int index) {
    if (index < 0 || index >= list->count) return;

    // 将后面的元素向前移动
    for (int i = index; i < list->count - 1; i++) {
        list->contacts[i] = list->contacts[i + 1];
    }
    list->count--;
}

// 按姓名查找联系人
int contact_list_find(const ContactList* list, const char* name) {
    for (int i = 0; i < list->count; i++) {
        if (strcmp(list->contacts[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

// 打印所有联系人
void contact_list_print(const ContactList* list) {
    printf("%-4s %-15s %-15s %-25s %-5s\n",
           "序号", "姓名", "电话", "邮箱", "年龄");
    printf("--------------------------------------------------------------\n");

    for (int i = 0; i < list->count; i++) {
        printf("%-4d %-15s %-15s %-25s %-5d\n",
               i + 1,
               list->contacts[i].name,
               list->contacts[i].phone,
               list->contacts[i].email,
               list->contacts[i].age);
    }
    printf("共 %d 个联系人\n", list->count);
}

// 销毁联系人列表
void contact_list_destroy(ContactList* list) {
    if (list) {
        free(list->contacts);
        free(list);
    }
}

int main() {
    printf("========== 动态结构体数组 ==========\n\n");

    // 创建联系人列表（初始容量为4）
    ContactList* list = contact_list_create(4);
    if (!list) {
        printf("创建失败\n");
        return 1;
    }

    printf("初始容量: %d\n\n", list->capacity);

    // 添加联系人
    contact_list_add(list, "张三", "13800138001", "zhangsan@email.com", 25);
    contact_list_add(list, "李四", "13800138002", "lisi@email.com", 30);
    contact_list_add(list, "王五", "13800138003", "wangwu@email.com", 28);
    contact_list_add(list, "赵六", "13800138004", "zhaoliu@email.com", 35);

    printf("添加4个联系人后:\n");
    contact_list_print(list);

    // 添加第5个联系人（触发扩容）
    contact_list_add(list, "孙七", "13800138005", "sunqi@email.com", 22);
    printf("\n添加第5个联系人后（自动扩容）:\n");
    printf("当前容量: %d\n", list->capacity);
    contact_list_print(list);

    // 查找联系人
    printf("\n查找联系人:\n");
    int idx = contact_list_find(list, "王五");
    if (idx >= 0) {
        printf("  找到王五: 电话=%s, 邮箱=%s\n",
               list->contacts[idx].phone, list->contacts[idx].email);
    }

    // 删除联系人
    printf("\n删除第2个联系人（李四）:\n");
    contact_list_remove(list, 1);
    contact_list_print(list);

    // 添加更多联系人
    printf("\n批量添加联系人:\n");
    for (int i = 0; i < 10; i++) {
        char name[50], phone[20], email[50];
        snprintf(name, sizeof(name), "用户%d", i + 1);
        snprintf(phone, sizeof(phone), "139%08d", i + 1);
        snprintf(email, sizeof(email), "user%d@email.com", i + 1);
        contact_list_add(list, name, phone, email, 20 + i);
    }
    contact_list_print(list);

    // 清理
    contact_list_destroy(list);
    printf("\n联系人列表已销毁\n");

    return 0;
}
```

---

## 五、结构体嵌套

### 5.1 结构体的多层嵌套

结构体可以嵌套使用，即一个结构体的成员可以是另一个结构体类型。这种嵌套可以构建出复杂的数据模型，更好地反映现实世界中的层次关系。

```c
#include <stdio.h>
#include <string.h>

/*
 * 结构体嵌套
 * 构建层次化的复杂数据模型
 */

// 日期结构体
typedef struct {
    int year;
    int month;
    int day;
} Date;

// 时间结构体
typedef struct {
    int hour;
    int minute;
    int second;
} Time;

// 地址结构体
typedef struct {
    char  country[50];
    char  province[50];
    char  city[50];
    char  district[50];
    char  street[100];
    char  zip_code[10];
} Address;

// 个人信息结构体
typedef struct {
    char   name[50];
    char   gender;       // 'M' 或 'F'
    Date   birth_date;   // 嵌套Date
    char   id_card[20];
    char   phone[20];
    char   email[50];
} Person;

// 部门结构体
typedef struct {
    char   dept_name[50];
    char   dept_code[10];
    Person manager;      // 嵌套Person
    int    employee_count;
} Department;

// 员工结构体（最外层）
typedef struct {
    Person     person;        // 嵌套Person
    Date       hire_date;     // 嵌套Date
    Department department;    // 嵌套Department
    double     salary;
    char       position[50];
} Employee;

// 打印日期
void print_date(const Date* d) {
    printf("%d-%02d-%02d", d->year, d->month, d->day);
}

// 打印地址
void print_address(const Address* addr) {
    printf("%s %s %s %s %s (邮编:%s)",
           addr->country, addr->province, addr->city,
           addr->district, addr->street, addr->zip_code);
}

// 打印员工完整信息
void print_employee(const Employee* emp) {
    printf("========== 员工信息 ==========\n");
    printf("基本信息:\n");
    printf("  姓名: %s\n", emp->person.name);
    printf("  性别: %c\n", emp->person.gender);
    printf("  出生日期: ");
    print_date(&emp->person.birth_date);
    printf("\n");
    printf("  身份证号: %s\n", emp->person.id_card);
    printf("  电话: %s\n", emp->person.phone);
    printf("  邮箱: %s\n", emp->person.email);

    printf("\n工作信息:\n");
    printf("  职位: %s\n", emp->position);
    printf("  薪资: %.2f\n", emp->salary);
    printf("  入职日期: ");
    print_date(&emp->hire_date);
    printf("\n");

    printf("\n部门信息:\n");
    printf("  部门名称: %s\n", emp->department.dept_name);
    printf("  部门编号: %s\n", emp->department.dept_code);
    printf("  部门经理: %s\n", emp->department.manager.name);
    printf("  部门人数: %d\n", emp->department.employee_count);
    printf("==============================\n");
}

// 计算工龄（年）
int calculate_work_years(const Date* hire_date, const Date* current) {
    int years = current->year - hire_date->year;
    if (current->month < hire_date->month ||
        (current->month == hire_date->month && current->day < hire_date->day)) {
        years--;
    }
    return years;
}

// 计算年龄
int calculate_age(const Date* birth_date, const Date* current) {
    int age = current->year - birth_date->year;
    if (current->month < birth_date->month ||
        (current->month == birth_date->month && current->day < birth_date->day)) {
        age--;
    }
    return age;
}

int main() {
    printf("========== 结构体嵌套 ==========\n\n");

    // 创建嵌套结构体
    Employee emp = {
        .person = {
            .name = "张伟",
            .gender = 'M',
            .birth_date = {1990, 5, 15},
            .id_card = "310101199005150011",
            .phone = "13800138000",
            .email = "zhangwei@company.com"
        },
        .hire_date = {2015, 7, 1},
        .department = {
            .dept_name = "技术研发部",
            .dept_code = "RD-001",
            .manager = {
                .name = "李明",
                .gender = 'M',
                .birth_date = {1985, 3, 20},
                .id_card = "",
                .phone = "",
                .email = "liming@company.com"
            },
            .employee_count = 35
        },
        .salary = 25000.00,
        .position = "高级工程师"
    };

    // 打印完整信息
    print_employee(&emp);

    // 计算工龄和年龄
    Date today = {2026, 7, 26};
    printf("\n计算信息:\n");
    printf("  年龄: %d 岁\n", calculate_age(&emp.person.birth_date, &today));
    printf("  工龄: %d 年\n", calculate_work_years(&emp.hire_date, &today));

    // 演示深层嵌套访问
    printf("\n深层嵌套访问示例:\n");
    printf("  emp.person.name = %s\n", emp.person.name);
    printf("  emp.person.birth_date.year = %d\n", emp.person.birth_date.year);
    printf("  emp.department.manager.name = %s\n", emp.department.manager.name);
    printf("  emp.hire_date.month = %d\n", emp.hire_date.month);

    return 0;
}
```

### 5.2 包含指针的嵌套结构体

结构体嵌套时，如果使用指针成员而非直接嵌入，可以构建更灵活的数据结构，如链表、树等。但这也带来了内存管理的复杂性。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 包含指针的嵌套结构体
 * 使用指针实现灵活的数据关联
 */

// 科目结构体
typedef struct {
    char  name[30];
    float score;
} Subject;

// 学生结构体（包含动态分配的数组成员）
typedef struct {
    int       id;
    char      name[50];
    Subject*  subjects;     // 动态分配的科目数组
    int       subject_count; // 科目数量
    float     average;       // 平均分
} StudentV2;

// 班级结构体（包含动态分配的学生数组）
typedef struct {
    char       class_name[50];
    StudentV2* students;     // 动态分配的学生数组
    int        student_count; // 学生数量
    float      class_average; // 班级平均分
} Class;

// 创建学生
StudentV2* student_create(int id, const char* name, int subject_count) {
    StudentV2* s = (StudentV2*)malloc(sizeof(StudentV2));
    if (!s) return NULL;

    s->id = id;
    strncpy(s->name, name, sizeof(s->name) - 1);
    s->subject_count = subject_count;
    s->subjects = (Subject*)malloc(subject_count * sizeof(Subject));
    s->average = 0;

    if (!s->subjects) {
        free(s);
        return NULL;
    }

    return s;
}

// 设置学生某科成绩
void student_set_score(StudentV2* s, int index,
                       const char* subject_name, float score) {
    if (index < 0 || index >= s->subject_count) return;
    strncpy(s->subjects[index].name, subject_name,
            sizeof(s->subjects[index].name) - 1);
    s->subjects[index].score = score;
}

// 计算学生平均分
void student_calc_average(StudentV2* s) {
    if (s->subject_count == 0) {
        s->average = 0;
        return;
    }
    float sum = 0;
    for (int i = 0; i < s->subject_count; i++) {
        sum += s->subjects[i].score;
    }
    s->average = sum / s->subject_count;
}

// 打印学生信息
void student_print(const StudentV2* s) {
    printf("  学号: %d, 姓名: %s\n", s->id, s->name);
    for (int i = 0; i < s->subject_count; i++) {
        printf("    %s: %.1f\n", s->subjects[i].name, s->subjects[i].score);
    }
    printf("    平均分: %.2f\n", s->average);
}

// 释放学生
void student_destroy(StudentV2* s) {
    if (s) {
        free(s->subjects);
        free(s);
    }
}

// 创建班级
Class* class_create(const char* name, int student_count) {
    Class* c = (Class*)malloc(sizeof(Class));
    if (!c) return NULL;

    strncpy(c->class_name, name, sizeof(c->class_name) - 1);
    c->student_count = student_count;
    c->students = (StudentV2*)malloc(student_count * sizeof(StudentV2));
    c->class_average = 0;

    if (!c->students) {
        free(c);
        return NULL;
    }

    // 初始化所有学生为空
    memset(c->students, 0, student_count * sizeof(StudentV2));

    return c;
}

// 计算班级平均分
void class_calc_average(Class* c) {
    if (c->student_count == 0) {
        c->class_average = 0;
        return;
    }
    float sum = 0;
    int valid_count = 0;
    for (int i = 0; i < c->student_count; i++) {
        if (c->students[i].id > 0) {  // 有效的学生
            sum += c->students[i].average;
            valid_count++;
        }
    }
    c->class_average = valid_count > 0 ? sum / valid_count : 0;
}

// 打印班级信息
void class_print(const Class* c) {
    printf("========== 班级: %s ==========\n", c->class_name);
    printf("学生人数: %d\n", c->student_count);
    for (int i = 0; i < c->student_count; i++) {
        if (c->students[i].id > 0) {
            student_print(&c->students[i]);
        }
    }
    printf("班级平均分: %.2f\n", c->class_average);
    printf("==============================\n\n");
}

// 释放班级
void class_destroy(Class* c) {
    if (c) {
        for (int i = 0; i < c->student_count; i++) {
            if (c->students[i].subjects) {
                free(c->students[i].subjects);
            }
        }
        free(c->students);
        free(c);
    }
}

int main() {
    printf("========== 包含指针的嵌套结构体 ==========\n\n");

    // 创建班级
    Class* class1 = class_create("计算机科学一班", 3);
    if (!class1) return 1;

    // 创建学生1
    StudentV2* s1 = student_create(1001, "张三", 3);
    student_set_score(s1, 0, "C语言", 92);
    student_set_score(s1, 1, "数据结构", 88);
    student_set_score(s1, 2, "操作系统", 85);
    student_calc_average(s1);
    class1->students[0] = *s1;  // 复制整个结构体到班级数组
    free(s1);  // 注意：释放临时分配的结构体，但subjects已被复制

    // 创建学生2
    StudentV2* s2 = student_create(1002, "李四", 3);
    student_set_score(s2, 0, "C语言", 78);
    student_set_score(s2, 1, "数据结构", 95);
    student_set_score(s2, 2, "操作系统", 82);
    student_calc_average(s2);
    class1->students[1] = *s2;
    free(s2);

    // 创建学生3
    StudentV2* s3 = student_create(1003, "王五", 3);
    student_set_score(s3, 0, "C语言", 90);
    student_set_score(s3, 1, "数据结构", 87);
    student_set_score(s3, 2, "操作系统", 93);
    student_calc_average(s3);
    class1->students[2] = *s3;
    free(s3);

    // 计算班级平均分
    class_calc_average(class1);

    // 打印班级信息
    class_print(class1);

    // 清理
    class_destroy(class1);

    printf("重要提示：\n");
    printf("  当结构体包含指针成员时，浅拷贝（直接赋值）会共享指针\n");
    printf("  如果需要深拷贝，必须手动复制指针指向的内容\n");
    printf("  释放时也要注意释放所有嵌套的指针成员\n");

    return 0;
}
```

---

## 六、typedef与结构体

### 6.1 typedef的类型别名

typedef是C语言中创建类型别名的关键字。与结构体结合使用，可以简化代码，提高可读性。typedef本身不创建新类型，只是为已有类型创建一个别名。

```c
#include <stdio.h>
#include <string.h>

/*
 * typedef与结构体
 * typedef为已有类型创建别名，简化代码
 */

// 方式1：先定义结构体，再创建别名
struct Point3D {
    double x;
    double y;
    double z;
};
typedef struct Point3D Point3D;  // 现在Point3D就是struct Point3D的别名

// 方式2：定义结构体的同时创建别名
typedef struct Vector3D {
    double x;
    double y;
    double z;
} Vector3D;  // Vector3D = struct Vector3D

// 方式3：匿名结构体+typedef（最简洁）
typedef struct {
    double r;  // 半径
    double g;  // 绿色
    double b;  // 蓝色
    double a;  // 透明度
} Color;

// 方式4：为结构体指针创建别名
typedef struct Node {
    int data;
    struct Node* next;
} Node, *NodePtr;  // NodePtr = struct Node*

// 方式5：为函数指针类型创建别名
typedef struct {
    char name[50];
    int  age;
} Person;

typedef void (*PersonCallback)(const Person*);

int main() {
    printf("========== typedef与结构体 ==========\n\n");

    // 使用方式1的别名
    Point3D p1 = {1.0, 2.0, 3.0};
    printf("方式1: Point3D p1 = (%.1f, %.1f, %.1f)\n", p1.x, p1.y, p1.z);

    // 也可以使用完整名称
    struct Point3D p2 = {4.0, 5.0, 6.0};
    printf("完整名称: struct Point3D p2 = (%.1f, %.1f, %.1f)\n\n",
           p2.x, p2.y, p2.z);

    // 使用方式2的别名
    Vector3D v1 = {1.0, 0.0, 0.0};
    printf("方式2: Vector3D v1 = (%.1f, %.1f, %.1f)\n", v1.x, v1.y, v1.z);

    // 使用方式3的别名
    Color red = {1.0, 0.0, 0.0, 1.0};
    Color blue = {0.0, 0.0, 1.0, 0.8};
    printf("\n方式3: Color (匿名结构体)\n");
    printf("  red:  rgba(%.1f, %.1f, %.1f, %.1f)\n",
           red.r, red.g, red.b, red.a);
    printf("  blue: rgba(%.1f, %.1f, %.1f, %.1f)\n",
           blue.r, blue.g, blue.b, blue.a);

    // 使用方式4的别名（指针）
    NodePtr head = NULL;  // 等价于 struct Node* head = NULL;
    printf("\n方式4: NodePtr = struct Node*\n");
    printf("  NodePtr head = NULL; 等价于 Node* head = NULL;\n");

    // 比较各种类型名的大小
    printf("\n各类型别名的大小:\n");
    printf("  sizeof(Point3D)         = %zu\n", sizeof(Point3D));
    printf("  sizeof(struct Point3D)  = %zu (相同)\n", sizeof(struct Point3D));
    printf("  sizeof(Vector3D)        = %zu\n", sizeof(Vector3D));
    printf("  sizeof(Color)           = %zu\n", sizeof(Color));
    printf("  sizeof(NodePtr)         = %zu (指针大小)\n", sizeof(NodePtr));

    return 0;
}
```

### 6.2 typedef的高级用法

typedef不仅可以为结构体创建别名，还可以为数组类型、函数指针类型、甚至复杂声明创建简洁的别名，大大提升代码可读性。

```c
#include <stdio.h>
#include <string.h>
#include <math.h>

/*
 * typedef高级用法
 * 为数组、函数指针、复杂类型创建别名
 */

// 1. 为数组类型创建别名
typedef int IntArray10[10];       // IntArray10 = int[10]
typedef char NameBuffer[50];      // NameBuffer = char[50]
typedef double Matrix3x3[3][3];   // Matrix3x3 = double[3][3]

// 2. 为结构体创建别名
typedef struct {
    char name[50];
    int  scores[5];
    double average;
} StudentRecord;

// 3. 为函数指针创建别名
typedef int (*CompareFunc)(const void*, const void*);
typedef double (*MathFunc)(double);
typedef void (*Callback)(void* data, int size);

// 4. 复杂类型简化
typedef StudentRecord* StudentPtr;
typedef StudentRecord ClassRoom[30];  // 30个学生的教室

// 5. 回调函数示例
void process_students(StudentRecord* students, int count, Callback cb) {
    for (int i = 0; i < count; i++) {
        cb(&students[i], sizeof(StudentRecord));
    }
}

void print_student_callback(void* data, int size) {
    (void)size;  // 抑制未使用警告
    StudentRecord* s = (StudentRecord*)data;
    printf("  %s: 平均分=%.2f\n", s->name, s->average);
}

int main() {
    printf("========== typedef高级用法 ==========\n\n");

    // 1. 使用数组类型别名
    IntArray10 numbers;
    for (int i = 0; i < 10; i++) numbers[i] = i * 10;
    printf("1. IntArray10 (int[10]):\n  ");
    for (int i = 0; i < 10; i++) printf("%d ", numbers[i]);
    printf("\n\n");

    // 2. 使用NameBuffer
    NameBuffer full_name;
    snprintf(full_name, sizeof(NameBuffer), "张三丰");
    printf("2. NameBuffer (char[50]): \"%s\"\n\n", full_name);

    // 3. 使用矩阵类型别名
    Matrix3x3 identity = {
        {1, 0, 0},
        {0, 1, 0},
        {0, 0, 1}
    };
    printf("3. Matrix3x3 (double[3][3]):\n");
    for (int i = 0; i < 3; i++) {
        printf("  ");
        for (int j = 0; j < 3; j++) {
            printf("%.0f ", identity[i][j]);
        }
        printf("\n");
    }
    printf("\n");

    // 4. 使用函数指针别名
    MathFunc square = NULL;  // 声明一个函数指针变量
    // square = sqrt;  // 可以赋值标准库函数
    printf("4. MathFunc = double (*)(double)\n");
    printf("   可以指向任何参数为double、返回double的函数\n\n");

    // 5. 使用回调函数
    StudentRecord students[3] = {
        {"张三", {85, 90, 78, 92, 88}, 0},
        {"李四", {92, 88, 95, 87, 90}, 0},
        {"王五", {78, 85, 82, 80, 88}, 0}
    };

    // 计算平均分
    for (int i = 0; i < 3; i++) {
        double sum = 0;
        for (int j = 0; j < 5; j++) sum += students[i].scores[j];
        students[i].average = sum / 5.0;
    }

    printf("5. 使用回调函数处理学生:\n");
    process_students(students, 3, print_student_callback);

    // 6. 使用ClassRoom别名
    printf("\n6. ClassRoom = StudentRecord[30]\n");
    printf("   这是一个包含30个学生的数组类型\n");
    printf("   声明: ClassRoom room;\n");
    printf("   等价于: StudentRecord room[30];\n");

    return 0;
}
```

---

## 七、结构体作为函数参数

### 7.1 值传递与指针传递详解

结构体作为函数参数时，有两种传递方式：值传递和指针传递。值传递会复制整个结构体，产生时间和空间开销。指针传递只传递地址，效率高，但需要注意是否要修改原结构体。

```c
#include <stdio.h>
#include <string.h>
#include <time.h>

/*
 * 结构体作为函数参数：值传递 vs 指针传递
 *
 * 值传递优点：函数内修改不影响原变量，数据安全
 * 值传递缺点：复制整个结构体，开销大
 *
 * 指针传递优点：只传递地址，效率高
 * 指针传递缺点：可能意外修改原数据
 */

typedef struct {
    int    id;
    char   name[50];
    double balance;
    char   account_type[20];
} BankAccount;

// 值传递：函数内修改不影响原变量
BankAccount deposit_by_value(BankAccount acc, double amount) {
    acc.balance += amount;
    printf("  [值传递内部] 余额: %.2f\n", acc.balance);
    return acc;  // 必须返回修改后的副本
}

// 指针传递：直接修改原变量
void deposit_by_pointer(BankAccount* acc, double amount) {
    acc->balance += amount;
    printf("  [指针传递内部] 余额: %.2f\n", acc->balance);
}

// const指针传递：只读访问，不能修改
void print_account(const BankAccount* acc) {
    printf("  账户信息:\n");
    printf("    ID: %d\n", acc->id);
    printf("    姓名: %s\n", acc->name);
    printf("    余额: %.2f\n", acc->balance);
    printf("    类型: %s\n", acc->account_type);
}

// 性能对比：大型结构体的值传递 vs 指针传递
typedef struct {
    double data[1000];  // 8000字节的大结构体
} LargeStruct;

void process_by_value(LargeStruct ls) {
    ls.data[0] = 999.0;  // 只在副本中修改
}

void process_by_pointer(LargeStruct* ls) {
    ls->data[0] = 999.0;  // 直接修改原数据
}

int main() {
    printf("========== 结构体参数传递 ==========\n\n");

    // 创建账户
    BankAccount my_account = {
        .id = 1001,
        .name = "张三",
        .balance = 10000.00,
        .account_type = "储蓄账户"
    };

    printf("初始状态:\n");
    print_account(&my_account);

    // 值传递存款
    printf("\n1. 值传递存款1000元:\n");
    printf("  存款前余额: %.2f\n", my_account.balance);
    BankAccount result = deposit_by_value(my_account, 1000.00);
    printf("  存款后(原变量)余额: %.2f (未改变!)\n", my_account.balance);
    printf("  存款后(返回值)余额: %.2f\n", result.balance);
    printf("  注意：值传递需要接收返回值才能获取修改\n");

    // 指针传递存款
    printf("\n2. 指针传递存款1000元:\n");
    printf("  存款前余额: %.2f\n", my_account.balance);
    deposit_by_pointer(&my_account, 1000.00);
    printf("  存款后余额: %.2f (已改变!)\n", my_account.balance);

    // 性能对比
    printf("\n3. 性能对比（大结构体）:\n");
    printf("  LargeStruct 大小: %zu 字节\n", sizeof(LargeStruct));

    // 注意：此处的性能测试结果依赖于具体平台
    // 在大多数平台上，指针传递明显快于值传递（尤其是大结构体）
    printf("  值传递：复制%zu字节到栈上\n", sizeof(LargeStruct));
    printf("  指针传递：只传递8字节（64位指针）\n");
    printf("  结论：大结构体始终使用指针传递\n\n");

    // const指针的使用场景
    printf("4. const指针的使用场景:\n");
    printf("  场景1: 只读访问（如打印函数）\n");
    printf("    void print(const Account* acc);\n");
    printf("  场景2: 函数承诺不修改数据\n");
    printf("    double get_balance(const Account* acc);\n");
    printf("  场景3: 接口设计，明确表达意图\n");

    return 0;
}
```

### 7.2 结构体数组作为参数

当结构体数组作为函数参数时，数组名会退化为指针，因此传递的是数组的起始地址。我们需要同时传递数组长度，以便函数知道数组的大小。

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

/*
 * 结构体数组作为函数参数
 * 数组名退化为指针，需同时传递数组长度
 */

typedef struct {
    char  name[50];
    int   score;
    char  grade;
} Grade;

// 计算等级
void calculate_grades(Grade* grades, int count) {
    for (int i = 0; i < count; i++) {
        if (grades[i].score >= 90) {
            grades[i].grade = 'A';
        } else if (grades[i].score >= 80) {
            grades[i].grade = 'B';
        } else if (grades[i].score >= 70) {
            grades[i].grade = 'C';
        } else if (grades[i].score >= 60) {
            grades[i].grade = 'D';
        } else {
            grades[i].grade = 'F';
        }
    }
}

// 统计各等级人数
void count_grades(const Grade* grades, int count,
                  int* a_count, int* b_count, int* c_count,
                  int* d_count, int* f_count) {
    *a_count = *b_count = *c_count = *d_count = *f_count = 0;

    for (int i = 0; i < count; i++) {
        switch (grades[i].grade) {
            case 'A': (*a_count)++; break;
            case 'B': (*b_count)++; break;
            case 'C': (*c_count)++; break;
            case 'D': (*d_count)++; break;
            case 'F': (*f_count)++; break;
        }
    }
}

// 查找最高分和最低分
void find_extremes(const Grade* grades, int count,
                   Grade** highest, Grade** lowest) {
    if (count == 0) {
        *highest = *lowest = NULL;
        return;
    }

    *highest = (Grade*)&grades[0];
    *lowest = (Grade*)&grades[0];

    for (int i = 1; i < count; i++) {
        if (grades[i].score > (*highest)->score) {
            *highest = (Grade*)&grades[i];
        }
        if (grades[i].score < (*lowest)->score) {
            *lowest = (Grade*)&grades[i];
        }
    }
}

// 按分数排序
int compare_grades(const void* a, const void* b) {
    const Grade* ga = (const Grade*)a;
    const Grade* gb = (const Grade*)b;
    return gb->score - ga->score;  // 降序
}

// 打印成绩表
void print_grades(const Grade* grades, int count) {
    printf("%-4s %-15s %-8s %-6s\n", "序号", "姓名", "分数", "等级");
    printf("------------------------------------\n");
    for (int i = 0; i < count; i++) {
        printf("%-4d %-15s %-8d %-6c\n",
               i + 1, grades[i].name, grades[i].score, grades[i].grade);
    }
}

int main() {
    printf("========== 结构体数组作为参数 ==========\n\n");

    // 初始化成绩数组
    Grade class_grades[] = {
        {"张三", 92, '?'},
        {"李四", 78, '?'},
        {"王五", 85, '?'},
        {"赵六", 95, '?'},
        {"孙七", 63, '?'},
        {"周八", 88, '?'},
        {"吴九", 72, '?'},
        {"郑十", 55, '?'},
        {"钱十一", 81, '?'},
        {"陈十二", 90, '?'},
    };
    int count = sizeof(class_grades) / sizeof(class_grades[0]);

    printf("原始数据:\n");
    print_grades(class_grades, count);

    // 计算等级
    calculate_grades(class_grades, count);
    printf("\n计算等级后:\n");
    print_grades(class_grades, count);

    // 统计各等级人数
    int a, b, c, d, f;
    count_grades(class_grades, count, &a, &b, &c, &d, &f);
    printf("\n等级分布:\n");
    printf("  A: %d人\n", a);
    printf("  B: %d人\n", b);
    printf("  C: %d人\n", c);
    printf("  D: %d人\n", d);
    printf("  F: %d人\n", f);

    // 查找最高分和最低分
    Grade* highest;
    Grade* lowest;
    find_extremes(class_grades, count, &highest, &lowest);
    if (highest && lowest) {
        printf("\n最高分: %s (%d分)\n", highest->name, highest->score);
        printf("最低分: %s (%d分)\n", lowest->name, lowest->score);
    }

    // 按分数排序
    qsort(class_grades, count, sizeof(Grade), compare_grades);
    printf("\n按分数降序排序后:\n");
    print_grades(class_grades, count);

    // 计算平均分
    double total = 0;
    for (int i = 0; i < count; i++) total += class_grades[i].score;
    printf("\n平均分: %.1f\n", total / count);

    return 0;
}
```

---

## 八、结构体内存布局与sizeof

### 8.1 sizeof与结构体大小

sizeof运算符是理解结构体内存布局的关键工具。结构体的sizeof并不简单地等于其成员大小的总和，还受到内存对齐规则的影响。理解这些规则对于编写高效、可移植的代码至关重要。

```c
#include <stdio.h>
#include <stddef.h>

/*
 * 结构体的sizeof与内存布局
 * 结构体大小 = 成员大小之和 + 填充字节
 * 填充字节的作用：满足对齐要求
 */

// 不同成员排列的结构体
struct S1 {
    char  c;   // 1字节
    int   i;   // 4字节
    char  d;   // 1字节
};

struct S2 {
    int   i;   // 4字节
    char  c;   // 1字节
    char  d;   // 1字节
};

struct S3 {
    char  c;   // 1字节
    short s;   // 2字节
    int   i;   // 4字节
    double d;  // 8字节
};

struct S4 {
    double d;  // 8字节
    int   i;   // 4字节
    short s;   // 2字节
    char  c;   // 1字节
};

// 空结构体（GCC扩展）
struct Empty {};

// 包含数组的结构体
struct WithArray {
    int  x;
    char arr[10];
    double y;
};

void print_layout(const char* name, size_t size,
                  size_t offsets[], const char* members[]) {
    printf("%s (sizeof=%zu):\n", name, size);

    // 打印每个成员的偏移量
    int i = 0;
    while (members[i] != NULL) {
        printf("  %s: offset=%zu\n", members[i], offsets[i]);
        i++;
    }

    // 计算填充
    size_t total_member_size = 0;
    int j = 0;
    // 计算最后一个成员的结束位置
    // 这里做简化处理
    printf("  总成员大小: %zu (理论值)\n", total_member_size);
    if (size > 0) {
        printf("  填充字节: %zu\n", size - total_member_size);
    }
    printf("\n");
}

int main() {
    printf("========== 结构体内存布局与sizeof ==========\n\n");

    // 演示不同排列对大小的影响
    printf("1. 成员排列对sizeof的影响:\n\n");

    printf("struct S1 { char c; int i; char d; }:\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct S1));
    printf("  布局: [c][pad:3][iiii][d][pad:3] = 12字节\n");
    printf("  offsetof(c) = %zu\n", offsetof(struct S1, c));
    printf("  offsetof(i) = %zu\n", offsetof(struct S1, i));
    printf("  offsetof(d) = %zu\n\n", offsetof(struct S1, d));

    printf("struct S2 { int i; char c; char d; }:\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct S2));
    printf("  布局: [iiii][c][d][pad:2] = 8字节\n");
    printf("  offsetof(i) = %zu\n", offsetof(struct S2, i));
    printf("  offsetof(c) = %zu\n", offsetof(struct S2, c));
    printf("  offsetof(d) = %zu\n\n", offsetof(struct S2, d));

    printf("结论：S1和S2成员相同，但排列不同导致sizeof不同\n");
    printf("  S1: 12字节 (两个char被int分隔，需要更多填充)\n");
    printf("  S2: 8字节 (两个char相邻，共享填充空间)\n\n");

    // 演示更复杂的排列
    printf("2. 复杂排列:\n\n");

    printf("struct S3 { char c; short s; int i; double d; }:\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct S3));
    printf("  offsetof(c) = %zu\n", offsetof(struct S3, c));
    printf("  offsetof(s) = %zu\n", offsetof(struct S3, s));
    printf("  offsetof(i) = %zu\n", offsetof(struct S3, i));
    printf("  offsetof(d) = %zu\n\n", offsetof(struct S3, d));

    printf("struct S4 { double d; int i; short s; char c; }:\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct S4));
    printf("  offsetof(d) = %zu\n", offsetof(struct S4, d));
    printf("  offsetof(i) = %zu\n", offsetof(struct S4, i));
    printf("  offsetof(s) = %zu\n", offsetof(struct S4, s));
    printf("  offsetof(c) = %zu\n\n", offsetof(struct S4, c));

    // 空结构体
    printf("3. 空结构体:\n");
    printf("  sizeof(struct Empty) = %zu (GCC: 0, C标准: 未定义)\n",
           sizeof(struct Empty));

    // 包含数组的结构体
    printf("\n4. 包含数组的结构体:\n");
    printf("  struct WithArray { int x; char arr[10]; double y; }:\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct WithArray));
    printf("  offsetof(x)   = %zu\n", offsetof(struct WithArray, x));
    printf("  offsetof(arr) = %zu\n", offsetof(struct WithArray, arr));
    printf("  offsetof(y)   = %zu\n", offsetof(struct WithArray, y));

    printf("\n重要规则总结:\n");
    printf("  1. 结构体大小 = 最大对齐值的整数倍\n");
    printf("  2. 每个成员在其对齐值倍数的偏移处开始\n");
    printf("  3. 合理排列成员可减少填充，节省内存\n");
    printf("  4. offsetof宏可查看成员偏移量\n");
    printf("  5. 使用sizeof而非手动计算结构体大小\n");

    return 0;
}
```

### 8.2 结构体大小优化实战

了解内存布局规则后，我们可以通过调整成员排列顺序来优化结构体大小，减少内存浪费。这在嵌入式系统和大规模数据处理中尤为重要。

```c
#include <stdio.h>
#include <stddef.h>

/*
 * 结构体大小优化
 * 通过调整成员排列顺序减少填充字节
 */

// 优化前：未优化的结构体
typedef struct {
    char   flag;      // 1字节
    double value;     // 8字节
    int    count;     // 4字节
    char   type;      // 1字节
    short  priority;  // 2字节
    void*  ptr;       // 8字节
} Unoptimized;

// 优化后：按对齐要求降序排列
typedef struct {
    double value;     // 8字节 (对齐8)
    void*  ptr;       // 8字节 (对齐8)
    int    count;     // 4字节 (对齐4)
    short  priority;  // 2字节 (对齐2)
    char   flag;      // 1字节
    char   type;      // 1字节
} Optimized;

// 使用位域进一步优化
typedef struct {
    unsigned int flag : 1;      // 1位
    unsigned int type : 3;      // 3位
    unsigned int priority : 4;  // 4位
    // 以上三个位域共享一个int
    double value;               // 8字节
    int    count;               // 4字节
    void*  ptr;                 // 8字节
} WithBitfield;

int main() {
    printf("========== 结构体大小优化实战 ==========\n\n");

    printf("1. 优化前 vs 优化后:\n\n");

    printf("Unoptimized (未优化):\n");
    printf("  sizeof = %zu 字节\n", sizeof(Unoptimized));
    printf("  offsetof(flag)     = %zu\n", offsetof(Unoptimized, flag));
    printf("  offsetof(value)    = %zu\n", offsetof(Unoptimized, value));
    printf("  offsetof(count)    = %zu\n", offsetof(Unoptimized, count));
    printf("  offsetof(type)     = %zu\n", offsetof(Unoptimized, type));
    printf("  offsetof(priority) = %zu\n", offsetof(Unoptimized, priority));
    printf("  offsetof(ptr)      = %zu\n\n", offsetof(Unoptimized, ptr));

    printf("Optimized (优化后):\n");
    printf("  sizeof = %zu 字节\n", sizeof(Optimized));
    printf("  offsetof(value)    = %zu\n", offsetof(Optimized, value));
    printf("  offsetof(ptr)      = %zu\n", offsetof(Optimized, ptr));
    printf("  offsetof(count)    = %zu\n", offsetof(Optimized, count));
    printf("  offsetof(priority) = %zu\n", offsetof(Optimized, priority));
    printf("  offsetof(flag)     = %zu\n", offsetof(Optimized, flag));
    printf("  offsetof(type)     = %zu\n\n", offsetof(Optimized, type));

    printf("节省内存: %zu 字节\n\n",
           sizeof(Unoptimized) - sizeof(Optimized));

    printf("2. 使用位域进一步优化:\n");
    printf("  sizeof(WithBitfield) = %zu 字节\n", sizeof(WithBitfield));
    printf("  位域将flag、type、priority压缩到一个int中\n\n");

    printf("优化技巧总结:\n");
    printf("  1. 按对齐要求从大到小排列成员\n");
    printf("  2. 将相同对齐要求的成员放在一起\n");
    printf("  3. 对于小值字段，使用位域节省空间\n");
    printf("  4. 考虑使用#pragma pack取消对齐（但有性能代价）\n");
    printf("  5. 使用offsetof验证成员偏移量\n");

    return 0;
}
```

---

## 九、本章小结

本章系统地讲解了C语言结构体的基础知识，从定义声明到内存布局，覆盖了结构体编程的核心概念。

**核心知识点回顾：**

1. **结构体定义与声明**：结构体是用户自定义的复合数据类型，包含三种声明方式（先定义后声明、定义时声明、匿名结构体）。C99的指定初始化器提供了灵活安全的初始化方式。

2. **成员访问运算符**：`.`用于结构体变量访问成员，`->`用于结构体指针访问成员。`ptr->member`等价于`(*ptr).member`。理解这两种运算符是结构体编程的基础。

3. **结构体数组**：结构体数组将多个同类型结构体组织在一起，支持排序、查找、统计等批量操作。动态结构体数组通过malloc/realloc实现灵活的内存管理。

4. **结构体嵌套**：结构体可以多层嵌套，构建层次化的数据模型。包含指针的嵌套结构体提供了更灵活的数据关联，但需要仔细管理内存。

5. **typedef与结构体**：typedef为结构体类型创建别名，简化代码。还可以为数组、函数指针、复杂声明创建别名，提升代码可读性。

6. **结构体参数传递**：值传递会复制整个结构体，适合小结构体和需要保护原数据的场景。指针传递效率高，适合大结构体和需要修改原数据的场景。const指针提供了只读访问的安全保证。

7. **内存布局与sizeof**：结构体大小受内存对齐规则影响，合理的成员排列可以减少填充字节。使用offsetof宏查看成员偏移量，使用sizeof获取实际大小。

掌握结构体是C语言编程的重要里程碑。结构体是构建复杂数据结构的基石，也是后续学习链表、树、图等高级数据结构的基础。建议通过大量练习，将结构体的各种用法内化为编程直觉。
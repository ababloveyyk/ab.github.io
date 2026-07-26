---
title: C语言数组与函数Ⅴ
date: 2026-07-26
tags:
  - C语言
  - 递归
  - 回溯
  - 分治
  - 动态学生系统
categories:
  - C语言
---

# C语言数组与函数Ⅴ——递归与综合实战

## 一、引言

递归是编程中最强大的思想之一。一个函数直接或间接调用自身，将复杂问题分解为相同形式的子问题，直到达到基准条件。本章将深入探讨递归的原理、经典算法，以及通过一个完整的动态学生管理系统综合运用数组与函数的所有知识。

---

## 二、递归基础

### 2.1 递归的三个要素

```c
#include <stdio.h>

// 递归三要素：基准条件、递归调用、问题规模缩减
int factorial(int n) {
    // 1. 基准条件：终止递归
    if (n <= 1) return 1;
    // 2. 递归调用：问题规模缩减
    // 3. n -> n-1，逼近基准条件
    return n * factorial(n - 1);
}

// 递归过程可视化
int factorial_trace(int n, int depth) {
    for (int i = 0; i < depth; i++) printf("  ");
    printf("进入 factorial(%d)\n", n);

    if (n <= 1) {
        for (int i = 0; i < depth; i++) printf("  ");
        printf("返回 1\n");
        return 1;
    }

    int result = n * factorial_trace(n - 1, depth + 1);

    for (int i = 0; i < depth; i++) printf("  ");
    printf("返回 %d * factorial(%d) = %d\n", n, n - 1, result);
    return result;
}

int main() {
    printf("========== 递归基础 ==========\n\n");

    printf("5! = %d\n\n", factorial(5));

    printf("递归过程追踪:\n");
    factorial_trace(5, 0);

    printf("\n递归三要素:\n");
    printf("1. 基准条件: 终止递归，防止无限递归\n");
    printf("2. 递归调用: 调用自身解决子问题\n");
    printf("3. 问题规模缩减: 每次递归问题规模减小\n");

    return 0;
}
```

### 2.2 斐波那契数列

```c
#include <stdio.h>
#include <time.h>

// 递归版本（低效，O(2^n)）
long long fib_recursive(int n) {
    if (n <= 1) return n;
    return fib_recursive(n - 1) + fib_recursive(n - 2);
}

// 迭代版本（高效，O(n)）
long long fib_iterative(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}

// 记忆化递归
long long memo[100] = {0};

long long fib_memo(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fib_memo(n - 1) + fib_memo(n - 2);
    return memo[n];
}

int main() {
    printf("========== 斐波那契数列 ==========\n\n");

    printf("迭代版本: ");
    for (int i = 0; i <= 20; i++) printf("%lld ", fib_iterative(i));
    printf("\n");

    printf("记忆化递归: ");
    for (int i = 0; i <= 20; i++) printf("%lld ", fib_memo(i));
    printf("\n");

    // 性能对比
    printf("\n【性能对比 fib(40)】\n");
    clock_t start, end;

    start = clock();
    printf("迭代: %lld, ", fib_iterative(40));
    end = clock();
    printf("耗时: %.6f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    start = clock();
    printf("记忆化: %lld, ", fib_memo(40));
    end = clock();
    printf("耗时: %.6f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    printf("递归版本计算fib(40)太慢，不演示\n");
    printf("结论: 迭代和记忆化递归都是O(n)，纯递归是O(2^n)\n");

    return 0;
}
```

### 2.3 汉诺塔

```c
#include <stdio.h>

int move_count = 0;

void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        printf("第%d步: 将盘子1从 %c 移到 %c\n", ++move_count, from, to);
        return;
    }
    hanoi(n - 1, from, aux, to);
    printf("第%d步: 将盘子%d从 %c 移到 %c\n", ++move_count, n, from, to);
    hanoi(n - 1, aux, to, from);
}

int main() {
    printf("========== 汉诺塔 ==========\n\n");

    int n = 4;
    printf("%d层汉诺塔的移动步骤:\n\n", n);
    hanoi(n, 'A', 'C', 'B');

    printf("\n总步数: %d\n", move_count);
    printf("理论最少步数: 2^%d - 1 = %d\n", n, (1 << n) - 1);

    return 0;
}
```

---

## 三、回溯算法

### 3.1 全排列

```c
#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void permute(int arr[], int start, int end) {
    if (start == end) {
        for (int i = 0; i <= end; i++) printf("%d ", arr[i]);
        printf("\n");
        return;
    }

    for (int i = start; i <= end; i++) {
        swap(&arr[start], &arr[i]);
        permute(arr, start + 1, end);
        swap(&arr[start], &arr[i]);  // 回溯
    }
}

int main() {
    printf("========== 全排列 ==========\n\n");

    int arr[] = {1, 2, 3, 4};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("{1, 2, 3, 4}的全排列:\n");
    permute(arr, 0, n - 1);

    // 计算数量
    int total = 1;
    for (int i = 2; i <= n; i++) total *= i;
    printf("\n共 %d 种排列 (4! = 24)\n", total);

    return 0;
}
```

### 3.2 八皇后问题

```c
#include <stdio.h>
#include <stdbool.h>
#include <math.h>

#define N 8
int board[N];
int solutions = 0;

bool is_safe(int row, int col) {
    for (int i = 0; i < row; i++) {
        if (board[i] == col ||
            abs(board[i] - col) == abs(i - row)) {
            return false;
        }
    }
    return true;
}

void print_solution() {
    printf("解法%d:\n", ++solutions);
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%c ", (board[i] == j) ? 'Q' : '.');
        }
        printf("\n");
    }
    printf("\n");
}

void solve_nqueens(int row) {
    if (row == N) {
        print_solution();
        return;
    }
    for (int col = 0; col < N; col++) {
        if (is_safe(row, col)) {
            board[row] = col;
            solve_nqueens(row + 1);
        }
    }
}

int main() {
    printf("========== 八皇后问题 ==========\n\n");

    solve_nqueens(0);
    printf("共找到 %d 种解法\n", solutions);

    return 0;
}
```

### 3.3 子集生成

```c
#include <stdio.h>

void generate_subsets(int arr[], int n, int subset[], int subset_size, int index) {
    if (index == n) {
        printf("{");
        for (int i = 0; i < subset_size; i++) {
            printf("%d", subset[i]);
            if (i < subset_size - 1) printf(", ");
        }
        printf("}\n");
        return;
    }

    // 不选当前元素
    generate_subsets(arr, n, subset, subset_size, index + 1);

    // 选当前元素
    subset[subset_size] = arr[index];
    generate_subsets(arr, n, subset, subset_size + 1, index + 1);
}

int main() {
    printf("========== 子集生成 ==========\n\n");

    int arr[] = {1, 2, 3, 4};
    int n = sizeof(arr) / sizeof(arr[0]);
    int subset[n];

    printf("{1, 2, 3, 4}的所有子集:\n");
    generate_subsets(arr, n, subset, 0, 0);

    printf("\n共 2^4 = 16 个子集\n");
    return 0;
}
```

---

## 四、综合实战：动态学生管理系统

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 100

typedef struct {
    int id;
    char name[50];
    float math, english, programming;
    float total, average;
    char grade;
} Student;

Student students[MAX_STUDENTS];
int count = 0;

char calc_grade(float avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

void add_student() {
    if (count >= MAX_STUDENTS) { printf("已满\n"); return; }
    Student* s = &students[count];
    printf("学号 姓名 数学 英语 编程: ");
    scanf("%d %s %f %f %f", &s->id, s->name,
          &s->math, &s->english, &s->programming);
    s->total = s->math + s->english + s->programming;
    s->average = s->total / 3.0f;
    s->grade = calc_grade(s->average);
    count++;
    printf("添加成功!\n");
}

void display_all() {
    if (count == 0) { printf("无数据\n"); return; }
    printf("\n%-6s %-8s %-6s %-6s %-6s %-6s %-6s %s\n",
           "学号","姓名","数学","英语","编程","总分","平均","等级");
    for (int i = 0; i < count; i++) {
        Student* s = &students[i];
        printf("%-6d %-8s %-6.1f %-6.1f %-6.1f %-6.1f %-6.1f %c\n",
               s->id, s->name, s->math, s->english,
               s->programming, s->total, s->average, s->grade);
    }
}

void search_by_id() {
    int id; printf("学号: "); scanf("%d", &id);
    for (int i = 0; i < count; i++) {
        if (students[i].id == id) {
            printf("找到: %s 总分:%.1f 等级:%c\n",
                   students[i].name, students[i].total, students[i].grade);
            return;
        }
    }
    printf("未找到\n");
}

void search_by_name() {
    char name[50]; printf("姓名: "); scanf("%s", name);
    int found = 0;
    for (int i = 0; i < count; i++) {
        if (strcmp(students[i].name, name) == 0) {
            printf("找到: ID=%d 总分:%.1f 等级:%c\n",
                   students[i].id, students[i].total, students[i].grade);
            found = 1;
        }
    }
    if (!found) printf("未找到\n");
}

void delete_student() {
    int id; printf("要删除的学号: "); scanf("%d", &id);
    for (int i = 0; i < count; i++) {
        if (students[i].id == id) {
            for (int j = i; j < count - 1; j++)
                students[j] = students[j + 1];
            count--;
            printf("已删除\n");
            return;
        }
    }
    printf("未找到\n");
}

void modify_student() {
    int id; printf("要修改的学号: "); scanf("%d", &id);
    for (int i = 0; i < count; i++) {
        if (students[i].id == id) {
            printf("新成绩(数学 英语 编程): ");
            scanf("%f %f %f", &students[i].math,
                  &students[i].english, &students[i].programming);
            students[i].total = students[i].math + students[i].english +
                students[i].programming;
            students[i].average = students[i].total / 3.0f;
            students[i].grade = calc_grade(students[i].average);
            printf("已修改\n");
            return;
        }
    }
    printf("未找到\n");
}

void sort_by_total() {
    for (int i = 0; i < count - 1; i++)
        for (int j = 0; j < count - 1 - i; j++)
            if (students[j].total < students[j + 1].total) {
                Student temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
            }
    printf("排序完成\n");
    display_all();
}

void statistics() {
    if (count == 0) { printf("无数据\n"); return; }
    float sum = 0, max = students[0].total, min = students[0].total;
    int grades[5] = {0};
    for (int i = 0; i < count; i++) {
        sum += students[i].total;
        if (students[i].total > max) max = students[i].total;
        if (students[i].total < min) min = students[i].total;
        switch (students[i].grade) {
            case 'A': grades[0]++; break;
            case 'B': grades[1]++; break;
            case 'C': grades[2]++; break;
            case 'D': grades[3]++; break;
            case 'F': grades[4]++; break;
        }
    }
    printf("\n总数:%d 平均:%.1f 最高:%.1f 最低:%.1f\n",
           count, sum/count, max, min);
    printf("A:%d B:%d C:%d D:%d F:%d\n",
           grades[0],grades[1],grades[2],grades[3],grades[4]);
}

void save_file() {
    FILE* fp = fopen("students.txt", "w");
    for (int i = 0; i < count; i++)
        fprintf(fp, "%d %s %.1f %.1f %.1f\n",
                students[i].id, students[i].name,
                students[i].math, students[i].english,
                students[i].programming);
    fclose(fp);
    printf("已保存%d条\n", count);
}

void load_file() {
    FILE* fp = fopen("students.txt", "r");
    if (!fp) { printf("文件不存在\n"); return; }
    count = 0;
    while (fscanf(fp, "%d %s %f %f %f",
                  &students[count].id, students[count].name,
                  &students[count].math, &students[count].english,
                  &students[count].programming) == 5) {
        Student* s = &students[count];
        s->total = s->math + s->english + s->programming;
        s->average = s->total / 3.0f;
        s->grade = calc_grade(s->average);
        count++;
    }
    fclose(fp);
    printf("已读取%d条\n", count);
}

int main() {
    int choice;
    while (1) {
        printf("\n========== 学生管理系统 ==========\n");
        printf("1.添加 2.显示 3.ID查找 4.姓名查找\n");
        printf("5.删除 6.修改 7.排序 8.统计\n");
        printf("9.保存 10.读取 0.退出\n");
        printf("选择: ");
        scanf("%d", &choice);
        while (getchar() != '\n');

        switch (choice) {
            case 1: add_student(); break;
            case 2: display_all(); break;
            case 3: search_by_id(); break;
            case 4: search_by_name(); break;
            case 5: delete_student(); break;
            case 6: modify_student(); break;
            case 7: sort_by_total(); break;
            case 8: statistics(); break;
            case 9: save_file(); break;
            case 10: load_file(); break;
            case 0: printf("再见!\n"); return 0;
            default: printf("无效\n");
        }
    }
    return 0;
}
```

---

## 本章小结

本章完成数组与函数章节的收官：

1. **递归基础**：三要素、斐波那契的三种实现、汉诺塔
2. **回溯算法**：全排列、八皇后、子集生成
3. **综合实战**：完整动态学生管理系统（增删改查+排序+统计+文件持久化）

数组与函数章节全部完成，建议将学生管理系统作为练习项目，尝试添加更多功能。
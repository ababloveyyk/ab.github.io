---
title: C语言流程控制Ⅴ
date: 2026-07-26
tags:
  - C语言
  - 综合项目
  - 加密
  - 进制转换
  - 万年历
categories:
  - C语言
---

# C语言流程控制Ⅴ——综合实战项目

## 一、引言

本章将流程控制的所有知识应用于四个完整的实战项目：凯撒密码加密解密、进制转换工具、万年历程序、以及完整的学生成绩管理系统。每个项目都基于前四章的基础知识，通过实际编码巩固流程控制的理解。

---

## 二、项目一：凯撒密码加密解密

### 2.1 基本凯撒密码

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

// 加密函数
void caesar_encrypt(char* text, int shift) {
    int i = 0;
    while (text[i] != '\0') {
        if (isalpha(text[i])) {
            char base = isupper(text[i]) ? 'A' : 'a';
            text[i] = (text[i] - base + shift) % 26 + base;
        }
        i++;
    }
}

// 解密函数
void caesar_decrypt(char* text, int shift) {
    caesar_encrypt(text, 26 - (shift % 26));
}

int main() {
    printf("========== 凯撒密码加密解密 ==========\n\n");

    char text[256];
    int shift;

    while (1) {
        printf("请输入明文(输入q退出): ");
        fgets(text, sizeof(text), stdin);
        text[strcspn(text, "\n")] = 0;

        if (strcmp(text, "q") == 0 || strcmp(text, "Q") == 0) {
            break;
        }

        printf("请输入偏移量(1-25): ");
        scanf("%d", &shift);
        while (getchar() != '\n');

        if (shift < 1 || shift > 25) {
            printf("偏移量无效，必须在1-25之间\n");
            continue;
        }

        char encrypted[256];
        strcpy(encrypted, text);
        caesar_encrypt(encrypted, shift);
        printf("加密结果: %s\n", encrypted);

        char decrypted[256];
        strcpy(decrypted, encrypted);
        caesar_decrypt(decrypted, shift);
        printf("解密验证: %s\n\n", decrypted);
    }

    printf("再见！\n");
    return 0;
}
```

### 2.2 暴力破解凯撒密码

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

void caesar_decrypt_print(const char* cipher, int shift) {
    char text[256];
    strcpy(text, cipher);
    int i = 0;
    while (text[i] != '\0') {
        if (isalpha(text[i])) {
            char base = isupper(text[i]) ? 'A' : 'a';
            text[i] = (text[i] - base + 26 - shift) % 26 + base;
        }
        i++;
    }
    printf("偏移%-2d: %s\n", shift, text);
}

int main() {
    printf("========== 凯撒密码暴力破解 ==========\n\n");

    char cipher[256];
    printf("请输入密文: ");
    fgets(cipher, sizeof(cipher), stdin);
    cipher[strcspn(cipher, "\n")] = 0;

    printf("\n尝试所有可能的偏移量(1-25):\n");
    printf("--------------------------------\n");
    for (int shift = 1; shift <= 25; shift++) {
        caesar_decrypt_print(cipher, shift);
    }

    printf("\n请从以上结果中选择有意义的明文\n");
    return 0;
}
```

---

## 三、项目二：进制转换工具

### 3.1 十进制转任意进制

```c
#include <stdio.h>
#include <string.h>

// 反转字符串
void reverse_str(char* str) {
    int len = strlen(str);
    int left = 0, right = len - 1;
    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}

// 十进制转任意进制(2-36)
void dec_to_base(int n, int base, char* result) {
    if (n == 0) {
        strcpy(result, "0");
        return;
    }

    char digits[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    int i = 0;
    int is_negative = (n < 0 && base == 10) ? 1 : 0;
    unsigned int num = (n < 0) ? -n : n;

    while (num > 0) {
        result[i++] = digits[num % base];
        num /= base;
    }

    if (is_negative) {
        result[i++] = '-';
    }
    result[i] = '\0';
    reverse_str(result);
}

int main() {
    printf("========== 进制转换工具 ==========\n\n");

    int num, base;
    char result[64];

    while (1) {
        printf("请输入十进制数(输入特殊值退出): ");
        scanf("%d", &num);

        printf("请输入目标进制(2-36): ");
        scanf("%d", &base);

        if (base < 2 || base > 36) {
            printf("进制范围: 2-36\n");
            continue;
        }

        dec_to_base(num, base, result);
        printf("十进制 %d = %s (进制%d)\n\n", num, result, base);
    }

    return 0;
}
```

### 3.2 任意进制转十进制

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

// 任意进制转十进制
int base_to_dec(const char* num_str, int base) {
    int result = 0;
    int i = 0;
    int is_negative = 0;

    if (num_str[0] == '-') {
        is_negative = 1;
        i = 1;
    }

    while (num_str[i] != '\0') {
        int digit;
        char c = toupper(num_str[i]);

        if (c >= '0' && c <= '9') {
            digit = c - '0';
        } else if (c >= 'A' && c <= 'Z') {
            digit = c - 'A' + 10;
        } else {
            printf("无效字符: %c\n", c);
            return 0;
        }

        if (digit >= base) {
            printf("数字 %c 超出进制 %d 的范围\n", num_str[i], base);
            return 0;
        }

        result = result * base + digit;
        i++;
    }

    return is_negative ? -result : result;
}

int main() {
    printf("========== 任意进制转十进制 ==========\n\n");

    char num_str[64];
    int base;

    while (1) {
        printf("请输入数字(输入q退出): ");
        scanf("%s", num_str);
        if (strcmp(num_str, "q") == 0) break;

        printf("请输入该数字的进制(2-36): ");
        scanf("%d", &base);

        int dec = base_to_dec(num_str, base);
        printf("%s (进制%d) = %d (十进制)\n\n", num_str, base, dec);
    }

    return 0;
}
```

---

## 四、项目三：万年历程序

```c
#include <stdio.h>
#include <stdbool.h>

// 判断闰年
bool is_leap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

// 获取某年某月的天数
int get_days_in_month(int year, int month) {
    int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (month == 2 && is_leap(year)) return 29;
    return days[month - 1];
}

// 计算某年某月1日是星期几(蔡勒公式变体)
int get_weekday(int year, int month) {
    if (month == 1 || month == 2) {
        month += 12;
        year--;
    }
    int y = year;
    int m = month;
    int d = 1;
    int w = (d + 2 * m + 3 * (m + 1) / 5 + y + y / 4 - y / 100 + y / 400 + 1) % 7;
    return w;
}

// 打印月历
void print_month_calendar(int year, int month) {
    const char* month_names[] = {
        "", "一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"
    };
    const char* weekdays[] = {"日", "一", "二", "三", "四", "五", "六"};

    int days = get_days_in_month(year, month);
    int weekday = get_weekday(year, month);

    printf("\n╔══════════════════════════════╗\n");
    printf("║     %d年 %s              ║\n", year, month_names[month]);
    printf("╠══════════════════════════════╣\n");

    for (int i = 0; i < 7; i++) {
        printf("║ %s ", weekdays[i]);
    }
    printf("║\n");

    printf("╠══════════════════════════════╣\n");

    // 打印日期
    int day = 1;
    printf("║");
    for (int i = 0; i < 42; i++) {
        if (i < weekday || day > days) {
            printf("    ");
        } else {
            printf(" %2d ", day);
            day++;
        }
        if ((i + 1) % 7 == 0) {
            printf("║\n");
            if (day <= days) printf("║");
        }
    }
    printf("╚══════════════════════════════╝\n");
}

int main() {
    printf("========== 万年历程序 ==========\n\n");

    int year, month;
    while (1) {
        printf("请输入年份和月份(格式: YYYY MM，输入0 0退出): ");
        scanf("%d %d", &year, &month);

        if (year == 0 && month == 0) break;

        if (year < 1 || month < 1 || month > 12) {
            printf("无效的年份或月份\n");
            continue;
        }

        print_month_calendar(year, month);
    }

    printf("再见！\n");
    return 0;
}
```

---

## 五、项目四：完整学生成绩管理系统

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 100
#define NAME_LEN 50

typedef struct {
    char name[NAME_LEN];
    int id;
    float math;
    float english;
    float programming;
    float total;
    float average;
    char grade;
} Student;

Student students[MAX_STUDENTS];
int student_count = 0;

char calc_grade(float avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

void add_student() {
    if (student_count >= MAX_STUDENTS) {
        printf("学生数量已满！\n");
        return;
    }
    Student* s = &students[student_count];

    printf("学号: ");
    scanf("%d", &s->id);
    printf("姓名: ");
    scanf("%s", s->name);
    printf("数学: ");
    scanf("%f", &s->math);
    printf("英语: ");
    scanf("%f", &s->english);
    printf("编程: ");
    scanf("%f", &s->programming);

    s->total = s->math + s->english + s->programming;
    s->average = s->total / 3.0f;
    s->grade = calc_grade(s->average);

    student_count++;
    printf("添加成功！%s - 总分:%.1f 等级:%c\n",
           s->name, s->total, s->grade);
}

void display_all() {
    if (student_count == 0) {
        printf("暂无学生数据\n");
        return;
    }
    printf("\n%-8s %-8s %-6s %-6s %-6s %-6s %-6s %-4s\n",
           "学号", "姓名", "数学", "英语", "编程", "总分", "平均", "等级");
    printf("--------------------------------------------------------\n");
    for (int i = 0; i < student_count; i++) {
        Student* s = &students[i];
        printf("%-8d %-8s %-6.1f %-6.1f %-6.1f %-6.1f %-6.1f %-4c\n",
               s->id, s->name, s->math, s->english, s->programming,
               s->total, s->average, s->grade);
    }
}

void search_student() {
    int id;
    printf("输入学号: ");
    scanf("%d", &id);
    for (int i = 0; i < student_count; i++) {
        if (students[i].id == id) {
            printf("找到: %s 总分:%.1f 等级:%c\n",
                   students[i].name, students[i].total, students[i].grade);
            return;
        }
    }
    printf("未找到学号%d\n", id);
}

void statistics() {
    if (student_count == 0) {
        printf("暂无数据\n");
        return;
    }
    float sum = 0, max = students[0].total, min = students[0].total;
    int grade_counts[5] = {0};
    char* best = students[0].name;

    for (int i = 0; i < student_count; i++) {
        float t = students[i].total;
        sum += t;
        if (t > max) { max = t; best = students[i].name; }
        if (t < min) min = t;

        switch (students[i].grade) {
            case 'A': grade_counts[0]++; break;
            case 'B': grade_counts[1]++; break;
            case 'C': grade_counts[2]++; break;
            case 'D': grade_counts[3]++; break;
            case 'F': grade_counts[4]++; break;
        }
    }

    printf("\n学生总数: %d\n", student_count);
    printf("平均分: %.1f\n", sum / student_count);
    printf("最高分: %.1f (%s)\n", max, best);
    printf("最低分: %.1f\n", min);
    printf("等级: A=%d B=%d C=%d D=%d F=%d\n",
           grade_counts[0], grade_counts[1], grade_counts[2],
           grade_counts[3], grade_counts[4]);
}

void sort_by_total() {
    for (int i = 0; i < student_count - 1; i++) {
        for (int j = 0; j < student_count - 1 - i; j++) {
            if (students[j].total < students[j + 1].total) {
                Student temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
            }
        }
    }
    printf("按总分降序排列完成\n");
    display_all();
}

void save_to_file() {
    FILE* fp = fopen("students.txt", "w");
    for (int i = 0; i < student_count; i++) {
        fprintf(fp, "%d %s %.1f %.1f %.1f\n",
                students[i].id, students[i].name,
                students[i].math, students[i].english,
                students[i].programming);
    }
    fclose(fp);
    printf("已保存%d条记录\n", student_count);
}

void load_from_file() {
    FILE* fp = fopen("students.txt", "r");
    if (fp == NULL) {
        printf("文件不存在\n");
        return;
    }
    student_count = 0;
    while (fscanf(fp, "%d %s %f %f %f",
                  &students[student_count].id,
                  students[student_count].name,
                  &students[student_count].math,
                  &students[student_count].english,
                  &students[student_count].programming) == 5) {
        Student* s = &students[student_count];
        s->total = s->math + s->english + s->programming;
        s->average = s->total / 3.0f;
        s->grade = calc_grade(s->average);
        student_count++;
    }
    fclose(fp);
    printf("已读取%d条记录\n", student_count);
}

int main() {
    int choice;
    while (1) {
        printf("\n========== 学生成绩管理系统 ==========\n");
        printf("1.添加 2.显示 3.查找 4.统计\n");
        printf("5.排序 6.保存 7.读取 0.退出\n");
        printf("选择: ");
        scanf("%d", &choice);
        while (getchar() != '\n');

        switch (choice) {
            case 1: add_student(); break;
            case 2: display_all(); break;
            case 3: search_student(); break;
            case 4: statistics(); break;
            case 5: sort_by_total(); break;
            case 6: save_to_file(); break;
            case 7: load_from_file(); break;
            case 0: printf("再见！\n"); return 0;
            default: printf("无效选择\n");
        }
    }
    return 0;
}
```

---

## 本章小结

本章通过四个完整的实战项目，将流程控制的知识融会贯通：

1. **凯撒密码**：加密/解密/暴力破解，综合运用字符处理与循环
2. **进制转换**：十进制转任意进制、任意进制转十进制
3. **万年历**：蔡勒公式计算星期几、闰年判断、月历打印
4. **学生成绩管理系统**：CRUD操作、排序、统计、文件持久化

每个项目都是独立可运行的完整程序，建议在理解的基础上尝试扩展功能。
---
title: C语言基础语法Ⅴ
date: 2026-07-26
tags:
  - C语言
  - printf
  - scanf
  - 格式化
  - 输入输出
categories:
  - C语言
---

# C语言基础语法Ⅴ——格式化输入输出与综合实战

## 一、引言

printf和scanf是C语言中使用最频繁的两个函数，但它们的细节远比表面看起来复杂。格式化字符串、转义字符、缓冲区行为、输入验证——这些细节决定了你的程序是健壮还是脆弱。本章将深入剖析格式化输入输出的每个细节，并通过多个综合实战项目巩固前四章的所有知识。

---

## 二、printf 格式化输出深度解析

### 2.1 格式说明符大全

```c
#include <stdio.h>

int main() {
    printf("========== printf 格式说明符大全 ==========\n\n");

    int i = 255;
    unsigned int u = 4294967295U;
    long l = 123456789L;
    long long ll = 123456789012345LL;
    float f = 3.14159f;
    double d = 3.141592653589793;
    char c = 'A';
    char* s = "Hello";
    void* ptr = &i;

    printf("【整数】\n");
    printf("十进制: %%d = %d, %%i = %i\n", i, i);
    printf("无符号: %%u = %u\n", u);
    printf("八进制: %%o = %o\n", i);
    printf("十六进制: %%x = %x, %%X = %X\n", i, i);
    printf("带前缀: %#x = %#x, %#X = %#X\n", i, i);
    printf("长整型: %%ld = %ld\n", l);
    printf("长长整型: %%lld = %lld\n", ll);

    printf("\n【浮点数】\n");
    printf("默认: %%f = %f\n", f);
    printf("科学计数: %%e = %e, %%E = %E\n", d, d);
    printf("自动选择: %%g = %g, %%G = %G\n", d, d);
    printf("十六进制浮点: %%a = %a\n", d);

    printf("\n【字符与字符串】\n");
    printf("字符: %%c = %c\n", c);
    printf("字符串: %%s = %s\n", s);

    printf("\n【指针】\n");
    printf("地址: %%p = %p\n", ptr);

    printf("\n【特殊】\n");
    printf("百分号: %%%%\n");
    printf("已输出字符数: %%n (不常用，有安全风险)\n");

    return 0;
}
```

### 2.2 宽度、精度与对齐

```c
#include <stdio.h>

int main() {
    printf("========== 宽度、精度与对齐 ==========\n\n");

    int num = 42;
    double pi = 3.141592653589793;
    char* str = "Hello";

    printf("【宽度控制】\n");
    printf("|%d| (默认)\n", num);
    printf("|%6d| (右对齐，宽度6)\n", num);
    printf("|%-6d| (左对齐，宽度6)\n", num);
    printf("|%06d| (补零，宽度6)\n", num);
    printf("|%+d| (显示正号)\n", num);
    printf("|% d| (正数前留空格)\n", num);

    printf("\n【精度控制(浮点数)】\n");
    printf("|%f| (默认6位小数)\n", pi);
    printf("|%.2f| (保留2位小数)\n", pi);
    printf("|%.10f| (保留10位小数)\n", pi);
    printf("|%10.2f| (宽度10，2位小数)\n", pi);
    printf("|%-10.2f| (左对齐，宽度10，2位小数)\n", pi);

    printf("\n【精度控制(字符串)】\n");
    printf("|%s| (完整)\n", str);
    printf("|%.3s| (截断3字符)\n", str);
    printf("|%10s| (宽度10，右对齐)\n", str);
    printf("|%-10s| (宽度10，左对齐)\n", str);
    printf("|%10.3s| (宽度10，截断3字符，右对齐)\n", str);
    printf("|%-10.3s| (宽度10，截断3字符，左对齐)\n", str);

    printf("\n【动态宽度与精度】\n");
    int width = 10;
    int precision = 3;
    printf("|%*.*f| (宽度=%d，精度=%d)\n", width, precision, pi, width, precision);
    printf("|%*s| (动态宽度)\n", width, str);

    return 0;
}
```

### 2.3 转义字符完整表

```c
#include <stdio.h>

int main() {
    printf("========== 转义字符完整表 ==========\n\n");

    printf("【常用转义字符】\n");
    printf("\\n  → 换行 (LF, ASCII 10)\n");
    printf("\\r  → 回车 (CR, ASCII 13)\n");
    printf("\\t  → 水平制表 (ASCII 9)\n");
    printf("\\v  → 垂直制表 (ASCII 11)\n");
    printf("\\b  → 退格 (ASCII 8)\n");
    printf("\\a  → 响铃 (ASCII 7)\n");
    printf("\\f  → 换页 (ASCII 12)\n");
    printf("\\\\ → 反斜杠\n");
    printf("\\'  → 单引号\n");
    printf("\\\" → 双引号\n");
    printf("\\?  → 问号 (避免三字符组)\n");
    printf("\\0  → 空字符 (字符串结束标志)\n");
    printf("\\xhh → 十六进制 (如 \\x41 = 'A')\n");
    printf("\\ooo → 八进制 (如 \\101 = 'A')\n");

    printf("\n【\\n 与 \\r\\n 的区别】\n");
    printf("Windows: 行尾为 \\r\\n (CR+LF)\n");
    printf("Linux/Mac: 行尾为 \\n (LF)\n");
    printf("C语言中 \\n 会自动转换为平台对应的行尾\n");

    printf("\n【\\t 制表对齐】\n");
    printf("姓名\\t年龄\\t成绩\\t等级\n");
    printf("张三\\t20\\t85.5\\tB\n");
    printf("李四\\t21\\t92.0\\tA\n");
    printf("王五\\t19\\t78.5\\tC\n");

    printf("\n【\\b 退格演示】\n");
    printf("ABC\\b\\b\\b → ");
    printf("ABC\b\b\bXYZ (实际效果)\n");

    printf("\n【\\r 回车演示】\n");
    printf("进度: 100%%");
    printf("\r进度: 50%% (被覆盖)");
    printf("\n");

    return 0;
}
```

### 2.4 printf 返回值与错误处理

```c
#include <stdio.h>
#include <errno.h>

int main() {
    printf("========== printf 返回值 ==========\n\n");

    // printf 返回成功输出的字符数
    int n1 = printf("Hello");
    printf("\nprintf(\"Hello\") 返回: %d\n", n1);

    int n2 = printf("Hello, World!\n");
    printf("printf(\"Hello, World!\\n\") 返回: %d (含换行符)\n", n2);

    int n3 = printf("数字: %d, 浮点: %.2f\n", 42, 3.14);
    printf("printf 返回: %d\n", n3);

    // 输出到字符串（sprintf）
    printf("\n【sprintf】\n");
    char buffer[100];
    int n4 = sprintf(buffer, "Name: %s, Age: %d", "张三", 25);
    printf("sprintf 返回: %d\n", n4);
    printf("buffer 内容: %s\n", buffer);

    // snprintf 安全版本
    printf("\n【snprintf 安全版本】\n");
    char small_buf[10];
    int n5 = snprintf(small_buf, sizeof(small_buf),
                      "Hello, World!");
    printf("snprintf 返回: %d (需要%zu字节，但只写入%zu-1字节)\n",
           n5, strlen("Hello, World!") + 1, sizeof(small_buf));
    printf("实际写入: \"%s\"\n", small_buf);

    return 0;
}
```

---

## 三、scanf 格式化输入深度解析

### 3.1 scanf 基本用法

```c
#include <stdio.h>

int main() {
    printf("========== scanf 基本用法 ==========\n\n");

    int age;
    float height;
    double weight;
    char name[50];
    char initial;

    printf("请输入年龄: ");
    scanf("%d", &age);

    printf("请输入身高(米): ");
    scanf("%f", &height);

    printf("请输入体重(公斤): ");
    scanf("%lf", &weight);

    // 清除缓冲区中的换行符
    while (getchar() != '\n');

    printf("请输入姓名首字母: ");
    scanf("%c", &initial);

    while (getchar() != '\n');

    printf("请输入姓名: ");
    scanf("%s", name);  // 注意：name是数组名，不需要&

    printf("\n【录入结果】\n");
    printf("姓名: %s\n", name);
    printf("首字母: %c\n", initial);
    printf("年龄: %d\n", age);
    printf("身高: %.2f米\n", height);
    printf("体重: %.1f公斤\n", weight);
    printf("BMI: %.1f\n", weight / (height * height));

    return 0;
}
```

### 3.2 scanf 返回值与输入验证

```c
#include <stdio.h>
#include <stdbool.h>

int main() {
    printf("========== scanf 返回值与输入验证 ==========\n\n");

    int num;
    int result;

    printf("【scanf 返回值】\n");
    printf("scanf 返回成功匹配并赋值的输入项数量\n\n");

    // 正确的输入验证
    printf("请输入一个整数: ");
    result = scanf("%d", &num);

    if (result == 1) {
        printf("成功读取: %d\n", num);
    } else if (result == 0) {
        printf("输入格式错误！\n");
        // 清除错误输入
        while (getchar() != '\n');
    } else if (result == EOF) {
        printf("到达输入末尾\n");
    }

    // 健壮的输入循环
    printf("\n【健壮的整数输入循环】\n");
    int value;
    while (true) {
        printf("请输入一个正整数: ");
        if (scanf("%d", &value) == 1 && value > 0) {
            printf("输入正确: %d\n", value);
            break;
        }
        printf("输入无效，请重新输入！\n");
        while (getchar() != '\n');  // 清空缓冲区
    }

    return 0;
}
```

### 3.3 scanf 格式控制

```c
#include <stdio.h>

int main() {
    printf("========== scanf 格式控制 ==========\n\n");

    int day, month, year;

    // 使用格式字符串中的分隔符
    printf("【使用分隔符】\n");
    printf("请输入日期(格式: YYYY-MM-DD): ");
    scanf("%d-%d-%d", &year, &month, &day);
    printf("日期: %d年%d月%d日\n\n", year, month, day);

    // 使用抑制赋值符 *
    printf("【抑制赋值】\n");
    int hour, minute, second;
    printf("请输入时间(格式: HH:MM:SS): ");
    scanf("%d:%d:%d", &hour, &minute, &second);
    printf("时间: %02d:%02d:%02d\n\n", hour, minute, second);

    // 指定最大宽度
    printf("【指定最大宽度】\n");
    char first_name[10], last_name[10];
    printf("请输入姓和名(空格分隔): ");
    scanf("%9s %9s", first_name, last_name);  // 最多读9个字符
    printf("姓: %s, 名: %s\n\n", last_name, first_name);

    // 扫描集 (scanset)
    printf("【扫描集】\n");
    char letters[100];
    printf("请输入只含字母的字符串: ");
    scanf("%[a-zA-Z]", letters);
    printf("字母部分: %s\n\n", letters);

    while (getchar() != '\n');

    // 反向扫描集
    printf("【反向扫描集】\n");
    char until_comma[100];
    printf("请输入(遇到逗号停止): ");
    scanf("%[^,]", until_comma);
    printf("逗号前的内容: %s\n", until_comma);

    return 0;
}
```

### 3.4 缓冲区问题与解决方案

```c
#include <stdio.h>
#include <string.h>

// 安全的整数输入函数
int safe_input_int(const char* prompt) {
    int value;
    char buffer[100];

    while (1) {
        printf("%s", prompt);
        if (fgets(buffer, sizeof(buffer), stdin) == NULL) {
            printf("输入错误\n");
            continue;
        }

        // 使用 sscanf 从缓冲区解析
        if (sscanf(buffer, "%d", &value) == 1) {
            return value;
        }
        printf("无效输入，请输入整数！\n");
    }
}

int main() {
    printf("========== 缓冲区问题与解决方案 ==========\n\n");

    printf("【问题：scanf留下的换行符】\n");
    int num;
    char ch;

    printf("输入一个整数: ");
    scanf("%d", &num);

    // 缓冲区中还有换行符
    printf("输入一个字符: ");
    scanf("%c", &ch);  // 会立即读取到换行符!
    printf("读取到字符: '%c' (ASCII %d) - 这是换行符！\n", ch, ch);

    // 解决方案1：使用 getchar() 清除
    while (getchar() != '\n');
    printf("输入一个字符: ");
    scanf("%c", &ch);
    printf("读取到字符: '%c'\n\n", ch);

    // 解决方案2：使用 fgets + sscanf
    printf("【推荐：fgets + sscanf】\n");
    char buffer[100];
    int value;

    printf("请输入一个整数: ");
    fgets(buffer, sizeof(buffer), stdin);
    buffer[strcspn(buffer, "\n")] = 0;  // 移除换行符

    if (sscanf(buffer, "%d", &value) == 1) {
        printf("成功读取: %d\n", value);
    }

    printf("请输入一个字符串: ");
    fgets(buffer, sizeof(buffer), stdin);
    buffer[strcspn(buffer, "\n")] = 0;
    printf("成功读取: %s\n", buffer);

    // 解决方案3：使用安全输入函数
    printf("\n【使用安全输入函数】\n");
    int age = safe_input_int("请输入年龄: ");
    printf("年龄: %d\n", age);

    return 0;
}
```

---

## 四、文件输入输出入门

### 4.1 文件读写基础

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("========== 文件读写基础 ==========\n\n");

    // 写文件
    printf("【写入文件】\n");
    FILE* fp = fopen("test_output.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return 1;
    }

    fprintf(fp, "这是通过C语言写入的文件\n");
    fprintf(fp, "整数: %d\n", 42);
    fprintf(fp, "浮点: %.2f\n", 3.14159);
    fprintf(fp, "字符: %c\n", 'A');
    fprintf(fp, "字符串: %s\n", "Hello World");

    // 写入格式化表格
    fprintf(fp, "\n%-15s %-5s %-8s\n", "姓名", "年龄", "成绩");
    fprintf(fp, "%-15s %-5d %-8.1f\n", "张三", 20, 85.5);
    fprintf(fp, "%-15s %-5d %-8.1f\n", "李四", 21, 92.0);
    fprintf(fp, "%-15s %-5d %-8.1f\n", "王五", 19, 78.5);

    fclose(fp);
    printf("文件已写入 test_output.txt\n\n");

    // 读文件
    printf("【读取文件】\n");
    fp = fopen("test_output.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }

    char line[256];
    printf("--- 文件内容 ---\n");
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);
    }
    printf("--- 文件结束 ---\n");

    fclose(fp);
    return 0;
}
```

### 4.2 格式化数据解析

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    printf("========== 格式化数据解析 ==========\n\n");

    // 创建测试数据文件
    FILE* fp = fopen("students.txt", "w");
    fprintf(fp, "张三 20 85.5 A\n");
    fprintf(fp, "李四 21 92.0 A\n");
    fprintf(fp, "王五 19 78.5 B\n");
    fprintf(fp, "赵六 22 65.0 C\n");
    fprintf(fp, "钱七 20 58.0 D\n");
    fclose(fp);

    // 解析数据
    printf("【解析学生数据】\n");
    fp = fopen("students.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }

    char name[50];
    int age;
    float score;
    char grade;

    printf("%-10s %-5s %-8s %-5s\n", "姓名", "年龄", "成绩", "等级");
    printf("--------------------------------\n");

    while (fscanf(fp, "%s %d %f %c", name, &age, &score, &grade) == 4) {
        printf("%-10s %-5d %-8.1f %-5c\n", name, age, score, grade);
    }

    fclose(fp);

    // 统计信息
    printf("\n【重新读取并统计】\n");
    fp = fopen("students.txt", "r");
    int count = 0;
    float total = 0.0;
    float max_score = 0.0;
    char best_student[50] = "";

    while (fscanf(fp, "%s %d %f %c", name, &age, &score, &grade) == 4) {
        count++;
        total += score;
        if (score > max_score) {
            max_score = score;
            strcpy(best_student, name);
        }
    }

    printf("学生总数: %d\n", count);
    printf("平均成绩: %.1f\n", total / count);
    printf("最高分: %.1f (%s)\n", max_score, best_student);

    fclose(fp);
    return 0;
}
```

---

## 五、综合实战项目

### 5.1 学生成绩管理系统（控制台版）

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 100
#define NAME_LEN 50

typedef struct {
    char name[NAME_LEN];
    int age;
    float math;
    float english;
    float programming;
    float total;
    float average;
    char grade;
} Student;

// 计算等级
char calc_grade(float avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

// 显示菜单
void show_menu() {
    printf("\n╔══════════════════════════════════╗\n");
    printf("║     学生成绩管理系统 v1.0       ║\n");
    printf("╠══════════════════════════════════╣\n");
    printf("║  1. 添加学生                    ║\n");
    printf("║  2. 显示所有学生                ║\n");
    printf("║  3. 查找学生                    ║\n");
    printf("║  4. 统计信息                    ║\n");
    printf("║  5. 保存到文件                  ║\n");
    printf("║  6. 从文件读取                  ║\n");
    printf("║  0. 退出                        ║\n");
    printf("╚══════════════════════════════════╝\n");
    printf("请选择: ");
}

int main() {
    Student students[MAX_STUDENTS];
    int count = 0;
    int choice;

    while (1) {
        show_menu();
        scanf("%d", &choice);
        while (getchar() != '\n');

        switch (choice) {
            case 1:  // 添加学生
                if (count >= MAX_STUDENTS) {
                    printf("学生已满！\n");
                    break;
                }
                printf("姓名: ");
                scanf("%s", students[count].name);
                printf("年龄: ");
                scanf("%d", &students[count].age);
                printf("数学成绩: ");
                scanf("%f", &students[count].math);
                printf("英语成绩: ");
                scanf("%f", &students[count].english);
                printf("编程成绩: ");
                scanf("%f", &students[count].programming);

                students[count].total = students[count].math +
                    students[count].english + students[count].programming;
                students[count].average = students[count].total / 3.0f;
                students[count].grade = calc_grade(students[count].average);

                printf("添加成功！%s 总分: %.1f, 平均: %.1f, 等级: %c\n",
                       students[count].name, students[count].total,
                       students[count].average, students[count].grade);
                count++;
                break;

            case 2:  // 显示所有学生
                if (count == 0) {
                    printf("暂无学生数据\n");
                    break;
                }
                printf("\n%-8s %-4s %-6s %-6s %-6s %-6s %-6s %-4s\n",
                       "姓名", "年龄", "数学", "英语", "编程", "总分", "平均", "等级");
                printf("--------------------------------------------------------\n");
                for (int i = 0; i < count; i++) {
                    printf("%-8s %-4d %-6.1f %-6.1f %-6.1f %-6.1f %-6.1f %-4c\n",
                           students[i].name, students[i].age,
                           students[i].math, students[i].english,
                           students[i].programming, students[i].total,
                           students[i].average, students[i].grade);
                }
                break;

            case 3:  // 查找学生
                {
                    char search_name[NAME_LEN];
                    printf("输入要查找的姓名: ");
                    scanf("%s", search_name);
                    int found = 0;
                    for (int i = 0; i < count; i++) {
                        if (strcmp(students[i].name, search_name) == 0) {
                            printf("找到: %s, 总分: %.1f, 等级: %c\n",
                                   students[i].name, students[i].total,
                                   students[i].grade);
                            found = 1;
                        }
                    }
                    if (!found) printf("未找到学生: %s\n", search_name);
                }
                break;

            case 4:  // 统计信息
                if (count == 0) {
                    printf("暂无学生数据\n");
                    break;
                }
                float max_total = students[0].total;
                float min_total = students[0].total;
                float sum_total = 0;
                int grade_counts[5] = {0};
                char* best_name = students[0].name;

                for (int i = 0; i < count; i++) {
                    sum_total += students[i].total;
                    if (students[i].total > max_total) {
                        max_total = students[i].total;
                        best_name = students[i].name;
                    }
                    if (students[i].total < min_total)
                        min_total = students[i].total;

                    switch (students[i].grade) {
                        case 'A': grade_counts[0]++; break;
                        case 'B': grade_counts[1]++; break;
                        case 'C': grade_counts[2]++; break;
                        case 'D': grade_counts[3]++; break;
                        case 'F': grade_counts[4]++; break;
                    }
                }

                printf("\n【统计信息】\n");
                printf("学生总数: %d\n", count);
                printf("平均总分: %.1f\n", sum_total / count);
                printf("最高分: %.1f (%s)\n", max_total, best_name);
                printf("最低分: %.1f\n", min_total);
                printf("等级分布: A=%d, B=%d, C=%d, D=%d, F=%d\n",
                       grade_counts[0], grade_counts[1], grade_counts[2],
                       grade_counts[3], grade_counts[4]);
                break;

            case 5:  // 保存到文件
                {
                    FILE* fp = fopen("students.txt", "w");
                    for (int i = 0; i < count; i++) {
                        fprintf(fp, "%s %d %.1f %.1f %.1f\n",
                                students[i].name, students[i].age,
                                students[i].math, students[i].english,
                                students[i].programming);
                    }
                    fclose(fp);
                    printf("已保存 %d 条记录到 students.txt\n", count);
                }
                break;

            case 6:  // 从文件读取
                {
                    FILE* fp = fopen("students.txt", "r");
                    if (fp == NULL) {
                        printf("文件不存在或无法打开\n");
                        break;
                    }
                    count = 0;
                    while (fscanf(fp, "%s %d %f %f %f",
                                  students[count].name,
                                  &students[count].age,
                                  &students[count].math,
                                  &students[count].english,
                                  &students[count].programming) == 5) {
                        students[count].total = students[count].math +
                            students[count].english + students[count].programming;
                        students[count].average = students[count].total / 3.0f;
                        students[count].grade = calc_grade(students[count].average);
                        count++;
                    }
                    fclose(fp);
                    printf("已从文件读取 %d 条记录\n", count);
                }
                break;

            case 0:
                printf("感谢使用，再见！\n");
                return 0;

            default:
                printf("无效选择\n");
        }
    }

    return 0;
}
```

### 5.2 打印图形

```c
#include <stdio.h>

int main() {
    printf("========== 打印各种图形 ==========\n\n");

    int n = 5;

    // 1. 正方形
    printf("【正方形】\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("* ");
        }
        printf("\n");
    }

    // 2. 左直角三角形
    printf("\n【左直角三角形】\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\n");
    }

    // 3. 等腰三角形（金字塔）
    printf("\n【金字塔】\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("* ");
        printf("\n");
    }

    // 4. 菱形
    printf("\n【菱形】\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("* ");
        printf("\n");
    }
    for (int i = n - 1; i >= 1; i--) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("* ");
        printf("\n");
    }

    // 5. 空心正方形
    printf("\n【空心正方形】\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 || i == n - 1 || j == 0 || j == n - 1)
                printf("* ");
            else
                printf("  ");
        }
        printf("\n");
    }

    return 0;
}
```

---

## 本章小结

本章深入讲解了格式化输入输出的每个细节，并通过综合实战项目将前四章的知识融会贯通：

1. **printf**：格式说明符、宽度精度对齐、转义字符、返回值
2. **scanf**：基本用法、返回值验证、格式控制、扫描集
3. **缓冲区问题**：scanf残留换行符的解决方案，推荐fgets+sscanf
4. **文件IO**：fprintf/fscanf的基本读写模式
5. **综合实战**：学生成绩管理系统（完整CRUD+统计+文件持久化）、图形打印

至此，C语言基础语法篇全部完成。建议将本章的学生管理系统作为练习，尝试添加更多功能（如排序、删除、修改等）。
---
title: C语言结构体与文件IOⅢ
date: 2026-07-26
tags:
  - C语言
  - 文件IO
  - 二进制文件
categories:
  - C语言
---

# C语言结构体与文件IOⅢ——文件操作基础

## 一、引言

在前两篇文章中，我们深入学习了C语言的结构体、联合体、枚举和位域。这些知识让我们能够构建复杂的数据模型。然而，程序运行期间创建的数据在程序结束后就会消失。为了让数据持久化，我们需要将数据存储到文件中。文件输入输出（File I/O）正是解决这一问题的关键。

C语言通过标准库提供了一套完整的文件操作函数，包括文件的打开与关闭、文本和二进制数据的读写、文件定位以及错误处理。本章将从最基础的文件操作概念讲起，逐步深入到文本文件读写、二进制文件读写、文件定位和错误处理等核心主题。每个知识点都配有完整可运行的代码示例，帮助你彻底掌握C语言的文件操作。

---

## 二、FILE指针与文件打开模式

### 2.1 FILE指针的概念

FILE是C标准库中定义的一个结构体类型（在stdio.h中），它封装了文件操作所需的所有信息，包括文件描述符、缓冲区、文件位置指示器、错误标志等。我们通过FILE指针来操作文件，而不需要直接操作FILE结构体的内部成员。

```c
#include <stdio.h>
#include <stdlib.h>

/*
 * FILE指针与文件打开模式
 * FILE是C标准库中的文件流类型
 * 通过FILE*指针操作文件
 */

int main() {
    printf("========== FILE指针与文件打开模式 ==========\n\n");

    // 1. 标准文件流
    printf("1. 标准文件流（程序启动时自动打开）:\n");
    printf("  stdin  = %p (标准输入)\n", (void*)stdin);
    printf("  stdout = %p (标准输出)\n", (void*)stdout);
    printf("  stderr = %p (标准错误)\n", (void*)stderr);
    printf("  这三个FILE*全局变量在程序启动时自动创建\n\n");

    // 2. 文件打开模式详解
    printf("2. 文件打开模式:\n\n");
    printf("  文本模式:\n");
    printf("    \"r\"  - 只读（文件必须存在）\n");
    printf("    \"w\"  - 只写（创建新文件或清空已有文件）\n");
    printf("    \"a\"  - 追加（在文件末尾添加，文件不存在则创建）\n");
    printf("    \"r+\" - 读写（文件必须存在）\n");
    printf("    \"w+\" - 读写（创建新文件或清空已有文件）\n");
    printf("    \"a+\" - 读写追加（文件不存在则创建）\n\n");

    printf("  二进制模式（在模式后添加b）:\n");
    printf("    \"rb\"  - 二进制只读\n");
    printf("    \"wb\"  - 二进制只写\n");
    printf("    \"ab\"  - 二进制追加\n");
    printf("    \"rb+\" - 二进制读写（文件必须存在）\n");
    printf("    \"wb+\" - 二进制读写（创建或清空）\n");
    printf("    \"ab+\" - 二进制读写追加\n\n");

    // 3. 文件打开示例
    printf("3. 文件打开示例:\n");

    // 打开文件进行写入
    FILE* fp = fopen("test_modes.txt", "w");
    if (fp == NULL) {
        printf("  错误：无法创建文件\n");
        return 1;
    }
    printf("  成功打开文件 \"test_modes.txt\" (模式: w)\n");

    // 写入内容
    fprintf(fp, "这是通过fopen(\"w\")模式创建的文件\n");
    fprintf(fp, "文件操作是C语言的重要基础\n");

    // 关闭文件
    fclose(fp);
    printf("  文件已关闭\n\n");

    // 4. 各种模式的对比
    printf("4. 各种模式对比:\n");

    // 模式"r"：文件必须存在
    fp = fopen("test_modes.txt", "r");
    if (fp) {
        printf("  模式\"r\"成功打开（文件存在）\n");
        fclose(fp);
    }

    // 模式"w"：创建新文件（会清空已存在的文件）
    fp = fopen("test_modes.txt", "w");
    if (fp) {
        printf("  模式\"w\"成功打开（原有内容已清空）\n");
        fclose(fp);
    }

    // 模式"a"：追加模式
    fp = fopen("test_modes.txt", "a");
    if (fp) {
        fprintf(fp, "这是追加的内容\n");
        printf("  模式\"a\"追加内容成功\n");
        fclose(fp);
    }

    // 模式"r+"：读写，文件必须存在
    fp = fopen("test_modes.txt", "r+");
    if (fp) {
        printf("  模式\"r+\"成功打开（可读写）\n");
        fclose(fp);
    }

    // 5. 文件不存在的错误处理
    printf("\n5. 错误处理:\n");
    fp = fopen("nonexistent_file.txt", "r");
    if (fp == NULL) {
        printf("  打开不存在的文件失败（预期行为）\n");
        perror("  错误信息");  // perror打印系统错误信息
    }

    printf("\n文件操作基本流程:\n");
    printf("  1. fopen() 打开文件\n");
    printf("  2. 检查返回值是否为NULL\n");
    printf("  3. 进行读写操作\n");
    printf("  4. fclose() 关闭文件\n");

    return 0;
}
```

### 2.2 fopen/fclose详解

fopen用于打开文件并返回FILE指针，fclose用于关闭文件并释放资源。理解这两个函数的使用细节对于安全可靠的文件操作至关重要。

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

/*
 * fopen/fclose详解
 * 文件打开与关闭的各种细节
 */

// 演示文件打开的各种情况
void demonstrate_fopen() {
    printf("========== fopen详解 ==========\n\n");

    FILE* fp = NULL;

    // 1. 正常打开文件
    printf("1. 正常打开文件:\n");
    fp = fopen("fopen_demo.txt", "w");
    if (fp) {
        printf("  文件成功打开\n");
        fprintf(fp, "Hello from fopen demo!\n");
        fclose(fp);
        printf("  文件已关闭\n");
    }
    printf("\n");

    // 2. 打开不存在的文件（只读模式）
    printf("2. 打开不存在的文件（只读模式）:\n");
    fp = fopen("no_such_file.txt", "r");
    if (fp == NULL) {
        printf("  打开失败（预期行为）\n");
        printf("  errno = %d\n", errno);
        printf("  strerror(errno) = %s\n", strerror(errno));
        perror("  perror输出");
    }
    printf("\n");

    // 3. 打开只读文件并尝试写入
    printf("3. 只读模式打开的文件不能写入:\n");
    fp = fopen("fopen_demo.txt", "r");
    if (fp) {
        printf("  以只读模式打开成功\n");
        // 尝试写入会导致未定义行为
        // fprintf(fp, "尝试写入\n");  // 不要这样做！
        printf("  注意：不要对只读文件进行写入操作\n");
        fclose(fp);
    }
    printf("\n");

    // 4. 多次打开同一文件
    printf("4. 多次打开同一文件:\n");
    FILE* fp1 = fopen("fopen_demo.txt", "r");
    FILE* fp2 = fopen("fopen_demo.txt", "r");
    if (fp1 && fp2) {
        printf("  同一文件可以多次打开\n");
        printf("  fp1 = %p, fp2 = %p\n", (void*)fp1, (void*)fp2);
        printf("  每个FILE指针有独立的文件位置指示器\n");
        fclose(fp1);
        fclose(fp2);
    }
    printf("\n");

    // 5. fclose的重要性
    printf("5. fclose的重要性:\n");
    printf("  - 将缓冲区数据刷新到磁盘\n");
    printf("  - 释放FILE结构体和缓冲区占用的内存\n");
    printf("  - 释放文件描述符（操作系统资源有限）\n");
    printf("  - 忘记fclose可能导致数据丢失\n");
    printf("  - 长时间运行的程序可能耗尽文件描述符\n");
}

// 演示安全的文件打开模式
void demonstrate_safe_open() {
    printf("========== 安全文件打开模式 ==========\n\n");

    // 安全模式1：检查fopen返回值
    printf("1. 始终检查fopen返回值:\n");
    FILE* fp = fopen("safe_test.txt", "w");
    if (fp == NULL) {
        printf("  错误：无法创建文件\n");
        return;
    }
    fprintf(fp, "安全写入\n");
    fclose(fp);
    printf("  安全写入完成\n\n");

    // 安全模式2：使用临时文件
    printf("2. 使用临时文件:\n");
    fp = tmpfile();  // 创建临时文件，关闭时自动删除
    if (fp) {
        fprintf(fp, "临时数据\n");
        rewind(fp);

        char buffer[100];
        fgets(buffer, sizeof(buffer), fp);
        printf("  从临时文件读取: %s", buffer);
        fclose(fp);  // 关闭时自动删除
        printf("  临时文件已自动删除\n");
    }
    printf("\n");

    // 安全模式3：使用freopen重定向
    printf("3. freopen重定向:\n");
    fp = freopen("redirected.txt", "w", stdout);
    if (fp) {
        printf("这行文字被重定向到文件而不是控制台\n");
        fclose(fp);
        // 恢复stdout（在Windows上可能需要特殊处理）
        freopen("CON", "w", stdout);  // Windows
        // freopen("/dev/tty", "w", stdout);  // Linux/Mac
        printf("  stdout已恢复\n");
    }
}

int main() {
    printf("========== fopen/fclose详解 ==========\n\n");

    demonstrate_fopen();
    printf("\n");
    demonstrate_safe_open();

    printf("\n文件操作最佳实践:\n");
    printf("  1. 始终检查fopen的返回值\n");
    printf("  2. 使用完文件后立即fclose\n");
    printf("  3. 使用perror或strerror获取详细错误信息\n");
    printf("  4. 考虑使用tmpfile创建临时文件\n");
    printf("  5. 注意文件打开模式的区别\n");
    printf("  6. 避免对只读文件进行写入\n");

    return 0;
}
```

---

## 三、文本文件读写

### 3.1 fprintf/fscanf格式化读写

fprintf和fscanf是格式化文件读写的核心函数，它们与printf和scanf用法类似，但操作对象是文件而不是标准输入输出。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * fprintf/fscanf格式化读写
 * fprintf: 格式化写入文件
 * fscanf: 格式化从文件读取
 */

typedef struct {
    int    id;
    char   name[50];
    int    age;
    double score;
} Student;

// 写入学生数据到文件
void write_students(const char* filename, Student* students, int count) {
    FILE* fp = fopen(filename, "w");
    if (!fp) {
        printf("无法打开文件 %s 进行写入\n", filename);
        return;
    }

    fprintf(fp, "# 学生数据文件\n");
    fprintf(fp, "# 格式: 学号,姓名,年龄,成绩\n");
    fprintf(fp, "# 学生总数: %d\n\n", count);

    for (int i = 0; i < count; i++) {
        fprintf(fp, "%d,%s,%d,%.2f\n",
                students[i].id,
                students[i].name,
                students[i].age,
                students[i].score);
    }

    fclose(fp);
    printf("成功写入 %d 条学生记录到 %s\n", count, filename);
}

// 从文件读取学生数据
int read_students(const char* filename, Student* students, int max_count) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开文件 %s 进行读取\n", filename);
        return 0;
    }

    char line[256];
    int count = 0;

    while (fgets(line, sizeof(line), fp) && count < max_count) {
        // 跳过注释行和空行
        if (line[0] == '#' || line[0] == '\n' || line[0] == '\r') {
            continue;
        }

        // 解析CSV格式
        Student s;
        int parsed = sscanf(line, "%d,%49[^,],%d,%lf",
                            &s.id, s.name, &s.age, &s.score);
        if (parsed == 4) {
            students[count++] = s;
        }
    }

    fclose(fp);
    printf("成功读取 %d 条学生记录\n", count);
    return count;
}

// 打印学生数据
void print_students(Student* students, int count) {
    printf("%-6s %-15s %-6s %-8s\n", "学号", "姓名", "年龄", "成绩");
    printf("----------------------------------------\n");
    for (int i = 0; i < count; i++) {
        printf("%-6d %-15s %-6d %-8.2f\n",
               students[i].id, students[i].name,
               students[i].age, students[i].score);
    }
}

int main() {
    printf("========== fprintf/fscanf格式化读写 ==========\n\n");

    // 准备数据
    Student students[] = {
        {1001, "张三", 20, 92.5},
        {1002, "李四", 21, 88.0},
        {1003, "王五", 19, 95.5},
        {1004, "赵六", 22, 76.5},
        {1005, "孙七", 20, 85.0},
        {1006, "周八", 21, 91.0},
    };
    int count = sizeof(students) / sizeof(students[0]);

    printf("原始数据:\n");
    print_students(students, count);
    printf("\n");

    // 写入文件
    write_students("students.csv", students, count);
    printf("\n");

    // 读取文件
    Student read_students[100];
    int read_count = read_students("students.csv", read_students, 100);

    printf("\n读取的数据:\n");
    print_students(read_students, read_count);

    // 验证数据一致性
    printf("\n数据验证:\n");
    if (read_count == count) {
        int match = 1;
        for (int i = 0; i < count; i++) {
            if (students[i].id != read_students[i].id ||
                students[i].age != read_students[i].age ||
                students[i].score != read_students[i].score) {
                match = 0;
                break;
            }
        }
        printf("  数据一致性: %s\n", match ? "通过" : "失败");
    } else {
        printf("  记录数不匹配: 写入%d, 读取%d\n", count, read_count);
    }

    return 0;
}
```

### 3.2 fgets/fputs行读写

fgets和fputs是行级别的读写函数，适用于文本文件的逐行处理。fgets安全地读取一行（包括换行符），fputs写入字符串到文件。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/*
 * fgets/fputs行读写
 * fgets: 安全地从文件读取一行
 * fputs: 将字符串写入文件
 */

// 统计文件信息
typedef struct {
    int total_lines;
    int empty_lines;
    int comment_lines;
    int code_lines;
    int total_chars;
    int total_words;
} FileStats;

// 在文件中搜索关键词
void search_in_file(const char* filename, const char* keyword) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开文件 %s\n", filename);
        return;
    }

    printf("搜索 \"%s\" 在 %s 中:\n", keyword, filename);
    char line[1024];
    int line_num = 0;
    int found = 0;

    while (fgets(line, sizeof(line), fp)) {
        line_num++;
        if (strstr(line, keyword)) {
            // 去除行尾换行符
            line[strcspn(line, "\n")] = '\0';
            printf("  第%d行: %s\n", line_num, line);
            found++;
        }
    }

    printf("  共找到 %d 处匹配\n\n", found);
    fclose(fp);
}

// 统计文件信息
FileStats analyze_file(const char* filename) {
    FileStats stats = {0};
    FILE* fp = fopen(filename, "r");
    if (!fp) return stats;

    char line[4096];

    while (fgets(line, sizeof(line), fp)) {
        stats.total_lines++;

        // 统计字符数
        stats.total_chars += strlen(line);

        // 统计单词数
        int in_word = 0;
        for (int i = 0; line[i]; i++) {
            if (isspace((unsigned char)line[i])) {
                in_word = 0;
            } else if (!in_word) {
                in_word = 1;
                stats.total_words++;
            }
        }

        // 判断行类型
        // 去除前导空白
        char* p = line;
        while (isspace((unsigned char)*p)) p++;

        if (*p == '\0') {
            stats.empty_lines++;
        } else if (*p == '#' || (*p == '/' && *(p + 1) == '/')) {
            stats.comment_lines++;
        } else {
            stats.code_lines++;
        }
    }

    fclose(fp);
    return stats;
}

// 文件复制（使用fgets/fputs）
int copy_file_line_by_line(const char* src, const char* dst) {
    FILE* fp_src = fopen(src, "r");
    if (!fp_src) {
        printf("无法打开源文件 %s\n", src);
        return 0;
    }

    FILE* fp_dst = fopen(dst, "w");
    if (!fp_dst) {
        printf("无法创建目标文件 %s\n", dst);
        fclose(fp_src);
        return 0;
    }

    char line[4096];
    int line_count = 0;

    while (fgets(line, sizeof(line), fp_src)) {
        fputs(line, fp_dst);
        line_count++;
    }

    fclose(fp_src);
    fclose(fp_dst);

    printf("复制完成: %d 行从 %s 复制到 %s\n", line_count, src, dst);
    return line_count;
}

// 读取并显示文件内容（带行号）
void display_file_with_line_numbers(const char* filename) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开文件 %s\n", filename);
        return;
    }

    printf("===== %s =====\n", filename);
    char line[1024];
    int line_num = 0;

    while (fgets(line, sizeof(line), fp)) {
        line_num++;
        printf("%4d | %s", line_num, line);
    }

    printf("===== 共 %d 行 =====\n", line_num);
    fclose(fp);
}

int main() {
    printf("========== fgets/fputs行读写 ==========\n\n");

    // 1. 创建测试文件
    printf("1. 创建测试文件:\n");
    FILE* fp = fopen("demo_lines.txt", "w");
    if (fp) {
        fputs("# 这是一个测试文件\n", fp);
        fputs("# 用于演示fgets和fputs\n", fp);
        fputs("\n", fp);
        fputs("这是第一行代码\n", fp);
        fputs("这是第二行代码\n", fp);
        fputs("\n", fp);
        fputs("// 这是注释行\n", fp);
        fputs("最后一行\n", fp);
        fclose(fp);
        printf("  文件创建成功\n\n");
    }

    // 2. 显示文件内容
    printf("2. 显示文件内容:\n");
    display_file_with_line_numbers("demo_lines.txt");
    printf("\n");

    // 3. 搜索关键词
    printf("3. 搜索关键词:\n");
    search_in_file("demo_lines.txt", "代码");
    search_in_file("demo_lines.txt", "注释");

    // 4. 文件统计
    printf("4. 文件统计:\n");
    FileStats stats = analyze_file("demo_lines.txt");
    printf("  总行数: %d\n", stats.total_lines);
    printf("  空行数: %d\n", stats.empty_lines);
    printf("  注释行: %d\n", stats.comment_lines);
    printf("  代码行: %d\n", stats.code_lines);
    printf("  总字符: %d\n", stats.total_chars);
    printf("  总单词: %d\n\n", stats.total_words);

    // 5. 文件复制
    printf("5. 文件复制:\n");
    copy_file_line_by_line("demo_lines.txt", "demo_lines_copy.txt");
    printf("\n");

    // 6. fgets的特性
    printf("6. fgets特性:\n");
    printf("  - fgets保留换行符（如果缓冲区足够大）\n");
    printf("  - fgets读取最多n-1个字符，自动添加'\\0'\n");
    printf("  - 到达文件末尾返回NULL\n");
    printf("  - 读取错误也返回NULL\n");
    printf("  - 比gets安全（gets已从C11标准中移除）\n");

    return 0;
}
```

### 3.3 文本文件读写综合示例

将格式化读写和行读写结合起来，我们可以实现更复杂的文本处理功能，如配置文件解析、日志文件分析、CSV数据处理等。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/*
 * 文本文件读写综合示例
 * 配置文件解析、日志分析、数据转换
 */

// 配置项结构
typedef struct {
    char key[50];
    char value[200];
} ConfigItem;

#define MAX_CONFIG_ITEMS 100

// 解析配置文件
int parse_config_file(const char* filename, ConfigItem* items, int max_items) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开配置文件 %s\n", filename);
        return 0;
    }

    char line[512];
    int count = 0;

    while (fgets(line, sizeof(line), fp) && count < max_items) {
        // 去除首尾空白
        char* start = line;
        while (isspace((unsigned char)*start)) start++;

        // 跳过空行和注释行
        if (*start == '\0' || *start == '#' || *start == ';') {
            continue;
        }

        // 查找等号
        char* eq = strchr(start, '=');
        if (!eq) continue;

        // 提取键（去除尾部空白）
        char* key_end = eq - 1;
        while (key_end > start && isspace((unsigned char)*key_end)) {
            key_end--;
        }
        size_t key_len = key_end - start + 1;
        if (key_len >= sizeof(items[count].key)) {
            key_len = sizeof(items[count].key) - 1;
        }
        strncpy(items[count].key, start, key_len);
        items[count].key[key_len] = '\0';

        // 提取值（去除首尾空白和引号）
        char* val_start = eq + 1;
        while (isspace((unsigned char)*val_start)) val_start++;

        // 去除尾部换行和空白
        char* val_end = val_start + strlen(val_start) - 1;
        while (val_end > val_start &&
               (isspace((unsigned char)*val_end) || *val_end == '\n')) {
            val_end--;
        }

        // 去除引号
        if (*val_start == '"' && *val_end == '"') {
            val_start++;
            val_end--;
        }

        size_t val_len = val_end - val_start + 1;
        if (val_len >= sizeof(items[count].value)) {
            val_len = sizeof(items[count].value) - 1;
        }
        strncpy(items[count].value, val_start, val_len);
        items[count].value[val_len] = '\0';

        count++;
    }

    fclose(fp);
    return count;
}

// 查找配置值
const char* config_get(const ConfigItem* items, int count, const char* key) {
    for (int i = 0; i < count; i++) {
        if (strcmp(items[i].key, key) == 0) {
            return items[i].value;
        }
    }
    return NULL;
}

// 日志分析器
typedef struct {
    char   timestamp[30];
    char   level[10];
    char   module[50];
    char   message[500];
} LogEntry;

int analyze_log_file(const char* filename) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开日志文件 %s\n", filename);
        return 0;
    }

    char line[1024];
    int total_lines = 0;
    int error_count = 0;
    int warning_count = 0;
    int info_count = 0;

    while (fgets(line, sizeof(line), fp)) {
        total_lines++;

        if (strstr(line, "ERROR")) error_count++;
        else if (strstr(line, "WARNING")) warning_count++;
        else if (strstr(line, "INFO")) info_count++;

        // 显示错误和警告
        if (strstr(line, "ERROR") || strstr(line, "WARNING")) {
            line[strcspn(line, "\n")] = '\0';
            printf("  %s\n", line);
        }
    }

    fclose(fp);

    printf("\n日志统计:\n");
    printf("  总行数: %d\n", total_lines);
    printf("  错误: %d\n", error_count);
    printf("  警告: %d\n", warning_count);
    printf("  信息: %d\n", info_count);

    return total_lines;
}

int main() {
    printf("========== 文本文件读写综合示例 ==========\n\n");

    // 1. 创建配置文件
    printf("1. 创建配置文件:\n");
    FILE* fp = fopen("app.conf", "w");
    if (fp) {
        fputs("# 应用程序配置文件\n", fp);
        fputs("app_name = \"My Application\"\n", fp);
        fputs("version = 1.0.0\n", fp);
        fputs("port = 8080\n", fp);
        fputs("host = localhost\n", fp);
        fputs("debug = true\n", fp);
        fputs("max_connections = 100\n", fp);
        fputs("timeout = 30\n", fp);
        fputs("# 数据库配置\n", fp);
        fputs("db_host = \"192.168.1.100\"\n", fp);
        fputs("db_port = 3306\n", fp);
        fputs("db_name = \"mydb\"\n", fp);
        fclose(fp);
        printf("  配置文件创建成功\n\n");
    }

    // 2. 解析配置文件
    printf("2. 解析配置文件:\n");
    ConfigItem configs[MAX_CONFIG_ITEMS];
    int config_count = parse_config_file("app.conf", configs, MAX_CONFIG_ITEMS);

    printf("  解析到 %d 个配置项:\n", config_count);
    for (int i = 0; i < config_count; i++) {
        printf("    %s = %s\n", configs[i].key, configs[i].value);
    }

    // 查找特定配置
    printf("\n  查找配置:\n");
    const char* port = config_get(configs, config_count, "port");
    const char* db_host = config_get(configs, config_count, "db_host");
    printf("    port = %s\n", port ? port : "未找到");
    printf("    db_host = %s\n", db_host ? db_host : "未找到");
    printf("\n");

    // 3. 创建日志文件并分析
    printf("3. 日志文件分析:\n");
    fp = fopen("app.log", "w");
    if (fp) {
        fputs("[2026-07-26 10:00:00] INFO  System: 系统启动\n", fp);
        fputs("[2026-07-26 10:00:01] INFO  Network: 网络初始化完成\n", fp);
        fputs("[2026-07-26 10:00:05] WARNING  Disk: 磁盘空间不足(80%)\n", fp);
        fputs("[2026-07-26 10:01:00] INFO  Database: 数据库连接成功\n", fp);
        fputs("[2026-07-26 10:02:00] ERROR  Database: 查询超时\n", fp);
        fputs("[2026-07-26 10:02:01] WARNING  Database: 重试连接\n", fp);
        fputs("[2026-07-26 10:02:05] INFO  Database: 重连成功\n", fp);
        fputs("[2026-07-26 10:05:00] ERROR  Network: 连接丢失\n", fp);
        fputs("[2026-07-26 10:05:01] INFO  Network: 重新连接中\n", fp);
        fputs("[2026-07-26 10:05:10] INFO  System: 系统运行正常\n", fp);
        fclose(fp);
        printf("  日志文件创建成功\n\n");
    }

    analyze_log_file("app.log");

    return 0;
}
```

---

## 四、二进制文件读写

### 4.1 fread/fwrite基础

二进制文件读写使用fread和fwrite函数。与文本读写不同，二进制读写直接操作内存中的字节表示，没有格式转换，因此效率更高，数据也更精确。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * fread/fwrite二进制读写
 * 直接读写内存中的字节表示
 * 无格式转换，效率高，数据精确
 */

typedef struct {
    int    id;
    char   name[50];
    double salary;
    int    department;
    char   hire_date[11];  // YYYY-MM-DD
} Employee;

// 写入二进制文件
void write_employees_binary(const char* filename,
                            Employee* employees, int count) {
    FILE* fp = fopen(filename, "wb");  // 二进制写模式
    if (!fp) {
        printf("无法创建二进制文件 %s\n", filename);
        return;
    }

    // 先写入记录数量
    fwrite(&count, sizeof(int), 1, fp);

    // 批量写入所有员工记录
    size_t written = fwrite(employees, sizeof(Employee), count, fp);

    fclose(fp);

    printf("二进制写入: %zu 条记录 -> %s\n", written, filename);
    printf("  文件大小约: %zu 字节\n",
           sizeof(int) + count * sizeof(Employee));
}

// 读取二进制文件
int read_employees_binary(const char* filename,
                          Employee* employees, int max_count) {
    FILE* fp = fopen(filename, "rb");  // 二进制读模式
    if (!fp) {
        printf("无法打开二进制文件 %s\n", filename);
        return 0;
    }

    // 先读取记录数量
    int count = 0;
    fread(&count, sizeof(int), 1, fp);

    if (count > max_count) {
        printf("警告：文件包含%d条记录，缓冲区只有%d\n", count, max_count);
        count = max_count;
    }

    // 读取员工记录
    size_t read = fread(employees, sizeof(Employee), count, fp);

    fclose(fp);

    printf("二进制读取: %zu 条记录从 %s\n", read, filename);
    return (int)read;
}

// 打印员工信息
void print_employees(Employee* employees, int count) {
    printf("%-4s %-6s %-15s %-12s %-6s %-12s\n",
           "序号", "ID", "姓名", "薪资", "部门", "入职日期");
    printf("--------------------------------------------------------------\n");
    for (int i = 0; i < count; i++) {
        printf("%-4d %-6d %-15s %-12.2f %-6d %-12s\n",
               i + 1, employees[i].id, employees[i].name,
               employees[i].salary, employees[i].department,
               employees[i].hire_date);
    }
}

// 追加记录到二进制文件
void append_employee_binary(const char* filename, Employee* emp) {
    FILE* fp = fopen(filename, "rb+");  // 二进制读写模式
    if (!fp) {
        // 文件不存在，创建新文件
        fp = fopen(filename, "wb");
        if (!fp) return;

        int count = 1;
        fwrite(&count, sizeof(int), 1, fp);
        fwrite(emp, sizeof(Employee), 1, fp);
        fclose(fp);
        printf("创建新文件并添加记录: %s\n", emp->name);
        return;
    }

    // 读取当前记录数
    int count;
    fread(&count, sizeof(int), 1, fp);
    count++;

    // 移动文件指针到文件末尾
    fseek(fp, 0, SEEK_END);
    fwrite(emp, sizeof(Employee), 1, fp);

    // 更新记录数
    rewind(fp);
    fwrite(&count, sizeof(int), 1, fp);

    fclose(fp);
    printf("追加记录: %s (总记录数: %d)\n", emp->name, count);
}

int main() {
    printf("========== fread/fwrite二进制读写 ==========\n\n");

    // 准备数据
    Employee employees[] = {
        {1001, "张三", 15000.00, 1, "2020-03-15"},
        {1002, "李四", 18000.00, 2, "2019-07-01"},
        {1003, "王五", 22000.00, 1, "2018-01-10"},
        {1004, "赵六", 12000.00, 3, "2021-06-20"},
        {1005, "孙七", 25000.00, 2, "2017-09-05"},
    };
    int count = sizeof(employees) / sizeof(employees[0]);

    printf("原始数据:\n");
    print_employees(employees, count);
    printf("\n");

    // 1. 写入二进制文件
    printf("1. 写入二进制文件:\n");
    write_employees_binary("employees.dat", employees, count);
    printf("\n");

    // 2. 读取二进制文件
    printf("2. 读取二进制文件:\n");
    Employee read_employees[100];
    int read_count = read_employees_binary("employees.dat",
                                           read_employees, 100);
    printf("\n读取的数据:\n");
    print_employees(read_employees, read_count);
    printf("\n");

    // 3. 追加记录
    printf("3. 追加记录:\n");
    Employee new_emp = {1006, "周八", 19000.00, 1, "2022-11-01"};
    append_employee_binary("employees.dat", &new_emp);

    Employee new_emp2 = {1007, "吴九", 21000.00, 3, "2023-04-15"};
    append_employee_binary("employees.dat", &new_emp2);

    // 重新读取验证
    printf("\n4. 重新读取验证:\n");
    read_count = read_employees_binary("employees.dat",
                                       read_employees, 100);
    print_employees(read_employees, read_count);

    // 5. 二进制vs文本对比
    printf("\n5. 二进制vs文本对比:\n");
    printf("  二进制文件:\n");
    printf("    - 直接存储内存中的字节表示\n");
    printf("    - 无格式转换，读写速度快\n");
    printf("    - 浮点数精确存储，无精度损失\n");
    printf("    - 文件大小通常更小\n");
    printf("    - 不可直接阅读\n");
    printf("    - 跨平台时需注意字节序\n\n");
    printf("  文本文件:\n");
    printf("    - 存储为可读的字符形式\n");
    printf("    - 有格式转换开销\n");
    printf("    - 浮点数可能有精度损失\n");
    printf("    - 文件大小通常更大\n");
    printf("    - 可直接阅读和编辑\n");

    return 0;
}
```

### 4.2 二进制文件高级操作

二进制文件支持随机访问，这是文本文件难以实现的。我们可以直接跳到文件的任意位置读取或修改数据，这在数据库系统、游戏存档等场景中非常有用。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 二进制文件高级操作
 * 随机读写、部分更新、索引访问
 */

typedef struct {
    int    id;
    char   name[50];
    double balance;
    int    status;  // 0=正常, 1=冻结, 2=注销
} BankAccount;

// 创建账户数据库
void create_account_database(const char* filename, int record_count) {
    FILE* fp = fopen(filename, "wb");
    if (!fp) return;

    // 写入文件头：记录总数
    fwrite(&record_count, sizeof(int), 1, fp);

    // 预分配空间：写入空记录
    BankAccount empty = {0};
    for (int i = 0; i < record_count; i++) {
        fwrite(&empty, sizeof(BankAccount), 1, fp);
    }

    fclose(fp);
    printf("创建数据库: %s (%d条空记录)\n", filename, record_count);
}

// 按索引写入记录（随机写入）
void write_account_at(const char* filename, int index, BankAccount* account) {
    FILE* fp = fopen(filename, "rb+");
    if (!fp) return;

    // 计算偏移：文件头(4字节) + 索引 * 记录大小
    long offset = sizeof(int) + (long)index * sizeof(BankAccount);
    fseek(fp, offset, SEEK_SET);
    fwrite(account, sizeof(BankAccount), 1, fp);

    fclose(fp);
    printf("写入记录: 索引%d, 账户%d, %s\n",
           index, account->id, account->name);
}

// 按索引读取记录
BankAccount read_account_at(const char* filename, int index) {
    BankAccount account = {0};
    FILE* fp = fopen(filename, "rb");
    if (!fp) return account;

    // 先验证记录数
    int total;
    fread(&total, sizeof(int), 1, fp);
    if (index < 0 || index >= total) {
        printf("索引%d超出范围(0-%d)\n", index, total - 1);
        fclose(fp);
        return account;
    }

    long offset = sizeof(int) + (long)index * sizeof(BankAccount);
    fseek(fp, offset, SEEK_SET);
    fread(&account, sizeof(BankAccount), 1, fp);

    fclose(fp);
    return account;
}

// 遍历所有记录
void list_all_accounts(const char* filename) {
    FILE* fp = fopen(filename, "rb");
    if (!fp) {
        printf("无法打开文件 %s\n", filename);
        return;
    }

    int total;
    fread(&total, sizeof(int), 1, fp);

    printf("所有账户 (共%d条):\n", total);
    printf("%-4s %-6s %-15s %-12s %-6s\n",
           "索引", "ID", "姓名", "余额", "状态");
    printf("------------------------------------------------\n");

    BankAccount account;
    for (int i = 0; i < total; i++) {
        fread(&account, sizeof(BankAccount), 1, fp);
        if (account.id != 0) {  // 非空记录
            const char* status_str[] = {"正常", "冻结", "注销"};
            printf("%-4d %-6d %-15s %-12.2f %-6s\n",
                   i, account.id, account.name,
                   account.balance,
                   status_str[account.status]);
        }
    }

    fclose(fp);
}

// 更新账户余额
void update_balance(const char* filename, int index, double amount) {
    BankAccount account = read_account_at(filename, index);
    if (account.id == 0) {
        printf("索引%d没有有效记录\n", index);
        return;
    }

    account.balance += amount;
    write_account_at(filename, index, &account);
    printf("更新余额: %s 余额 %+.2f -> %.2f\n",
           account.name, amount, account.balance);
}

int main() {
    printf("========== 二进制文件高级操作 ==========\n\n");

    const char* db_file = "accounts.db";
    int record_count = 10;

    // 1. 创建数据库
    printf("1. 创建数据库:\n");
    create_account_database(db_file, record_count);
    printf("\n");

    // 2. 写入记录
    printf("2. 写入记录:\n");
    BankAccount acc1 = {1001, "张三", 50000.00, 0};
    BankAccount acc2 = {1002, "李四", 100000.00, 0};
    BankAccount acc3 = {1003, "王五", 75000.00, 0};
    BankAccount acc4 = {1004, "赵六", 200000.00, 0};
    BankAccount acc5 = {1005, "孙七", 30000.00, 0};

    write_account_at(db_file, 0, &acc1);
    write_account_at(db_file, 2, &acc2);
    write_account_at(db_file, 5, &acc3);
    write_account_at(db_file, 7, &acc4);
    write_account_at(db_file, 9, &acc5);
    printf("\n");

    // 3. 列出所有账户
    printf("3. 列出所有账户:\n");
    list_all_accounts(db_file);
    printf("\n");

    // 4. 按索引读取
    printf("4. 按索引读取:\n");
    BankAccount read = read_account_at(db_file, 2);
    printf("  索引2: %s, 余额=%.2f\n", read.name, read.balance);

    read = read_account_at(db_file, 5);
    printf("  索引5: %s, 余额=%.2f\n\n", read.name, read.balance);

    // 5. 更新余额
    printf("5. 更新余额:\n");
    update_balance(db_file, 0, 5000.00);   // 张三 +5000
    update_balance(db_file, 2, -10000.00); // 李四 -10000
    update_balance(db_file, 7, 25000.00);  // 赵六 +25000
    printf("\n");

    // 6. 再次列出验证
    printf("6. 更新后验证:\n");
    list_all_accounts(db_file);

    printf("\n随机访问文件 = 文件头大小 + 索引 * 记录大小\n");
    printf("  offset = sizeof(int) + index * sizeof(BankAccount)\n");
    printf("  = 4 + index * %zu\n", sizeof(BankAccount));

    return 0;
}
```

---

## 五、文件定位

### 5.1 fseek/ftell/rewind详解

文件定位函数允许我们在文件中任意移动读写位置。fseek用于移动文件位置指针，ftell返回当前位置，rewind回到文件开头。这些函数在随机访问文件时至关重要。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * fseek/ftell/rewind详解
 * 文件定位函数，实现随机访问
 */

// 创建测试文件
void create_test_file(const char* filename) {
    FILE* fp = fopen(filename, "w");
    if (!fp) return;

    for (int i = 1; i <= 20; i++) {
        fprintf(fp, "这是第%2d行数据\n", i);
    }
    fclose(fp);
    printf("测试文件创建完成: %s (20行)\n", filename);
}

// 演示fseek的各种用法
void demonstrate_fseek() {
    printf("========== fseek用法 ==========\n\n");
    create_test_file("seek_test.txt");

    FILE* fp = fopen("seek_test.txt", "r");
    if (!fp) return;

    char line[100];

    // 1. SEEK_SET：从文件开头定位
    printf("1. SEEK_SET (从文件开头):\n");
    fseek(fp, 0, SEEK_SET);
    printf("   fseek(fp, 0, SEEK_SET) -> 文件开头\n");
    fgets(line, sizeof(line), fp);
    printf("   读取: %s", line);

    // 跳转到第50个字节
    fseek(fp, 50, SEEK_SET);
    printf("   fseek(fp, 50, SEEK_SET) -> 偏移50字节\n");
    fgets(line, sizeof(line), fp);
    printf("   读取: %s", line);
    printf("\n");

    // 2. SEEK_CUR：从当前位置偏移
    printf("2. SEEK_CUR (从当前位置):\n");
    long pos = ftell(fp);
    printf("   当前位置: %ld\n", pos);

    fseek(fp, 33, SEEK_CUR);  // 从当前位置向后移动33字节
    printf("   fseek(fp, 33, SEEK_CUR) -> 向后移动33字节\n");
    fgets(line, sizeof(line), fp);
    printf("   读取: %s", line);

    // 可以向后移动（负值）
    fseek(fp, -33, SEEK_CUR);
    printf("   fseek(fp, -33, SEEK_CUR) -> 向前移动33字节\n");
    fgets(line, sizeof(line), fp);
    printf("   读取: %s", line);
    printf("\n");

    // 3. SEEK_END：从文件末尾定位
    printf("3. SEEK_END (从文件末尾):\n");
    fseek(fp, 0, SEEK_END);
    long file_size = ftell(fp);
    printf("   文件大小: %ld 字节\n", file_size);

    // 从末尾向前移动
    fseek(fp, -33, SEEK_END);
    printf("   fseek(fp, -33, SEEK_END) -> 倒数第33字节\n");
    fgets(line, sizeof(line), fp);
    printf("   读取: %s", line);
    printf("\n");

    fclose(fp);
}

// 演示ftell和rewind
void demonstrate_ftell_rewind() {
    printf("========== ftell和rewind ==========\n\n");

    FILE* fp = fopen("seek_test.txt", "r");
    if (!fp) return;

    char line[100];

    // 1. ftell返回当前位置
    printf("1. ftell获取当前位置:\n");
    long start = ftell(fp);
    printf("   文件开头位置: %ld\n", start);

    fgets(line, sizeof(line), fp);
    long after_first = ftell(fp);
    printf("   读取第一行后: %ld\n", after_first);
    printf("   第一行长度: %ld 字节\n", after_first - start);

    fgets(line, sizeof(line), fp);
    long after_second = ftell(fp);
    printf("   读取第二行后: %ld\n", after_second);
    printf("\n");

    // 2. rewind回到文件开头
    printf("2. rewind回到文件开头:\n");
    rewind(fp);
    long after_rewind = ftell(fp);
    printf("   rewind()后位置: %ld\n", after_rewind);

    fgets(line, sizeof(line), fp);
    printf("   重新读取第一行: %s", line);
    printf("\n");

    fclose(fp);
}

// 使用二分查找在排序文件中查找
typedef struct {
    int  key;
    char data[50];
} Record;

void create_sorted_file(const char* filename, int count) {
    FILE* fp = fopen(filename, "wb");
    if (!fp) return;

    for (int i = 0; i < count; i++) {
        Record r;
        r.key = i * 10 + 100;  // 100, 110, 120, ...
        snprintf(r.data, sizeof(r.data), "Record #%d", r.key);
        fwrite(&r, sizeof(Record), 1, fp);
    }

    fclose(fp);
    printf("创建排序文件: %s (%d条记录)\n", filename, count);
}

// 二分查找（在排序的二进制文件中）
int binary_search_file(const char* filename, int target_key) {
    FILE* fp = fopen(filename, "rb");
    if (!fp) return -1;

    // 获取文件大小和记录数
    fseek(fp, 0, SEEK_END);
    long file_size = ftell(fp);
    int record_count = (int)(file_size / sizeof(Record));

    int left = 0, right = record_count - 1;
    Record r;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        // 跳转到中间记录
        fseek(fp, (long)mid * sizeof(Record), SEEK_SET);
        fread(&r, sizeof(Record), 1, fp);

        if (r.key == target_key) {
            fclose(fp);
            printf("  找到: key=%d, data=\"%s\" (位置%d)\n",
                   r.key, r.data, mid);
            return mid;
        } else if (r.key < target_key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    fclose(fp);
    printf("  未找到: key=%d\n", target_key);
    return -1;
}

int main() {
    printf("========== fseek/ftell/rewind详解 ==========\n\n");

    demonstrate_fseek();
    printf("\n");
    demonstrate_ftell_rewind();
    printf("\n");

    // 二分查找演示
    printf("========== 二分查找在文件中的应用 ==========\n\n");
    create_sorted_file("sorted_records.dat", 100);

    printf("查找测试:\n");
    binary_search_file("sorted_records.dat", 500);   // 存在
    binary_search_file("sorted_records.dat", 100);   // 存在（第一个）
    binary_search_file("sorted_records.dat", 1090);  // 存在（最后一个）
    binary_search_file("sorted_records.dat", 555);   // 不存在

    printf("\n文件定位函数总结:\n");
    printf("  fseek(fp, offset, whence): 移动文件位置指针\n");
    printf("    whence = SEEK_SET (开头), SEEK_CUR (当前), SEEK_END (末尾)\n");
    printf("  ftell(fp): 返回当前位置（从文件开头算起的字节偏移量）\n");
    printf("  rewind(fp): 等价于 fseek(fp, 0, SEEK_SET)\n");

    return 0;
}
```

---

## 六、错误处理

### 6.1 ferror/feof/clearerr

文件操作中的错误处理是确保程序健壮性的关键。C标准库提供了ferror、feof和clearerr三个函数来检测和处理文件流错误。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

/*
 * ferror/feof/clearerr错误处理
 * 检测和处理文件操作错误
 */

// 演示ferror检测写入错误
void demonstrate_ferror() {
    printf("========== ferror演示 ==========\n\n");

    // 1. 正常写入（无错误）
    printf("1. 正常写入:\n");
    FILE* fp = fopen("error_test.txt", "w");
    if (!fp) return;

    fprintf(fp, "正常写入数据\n");
    if (ferror(fp)) {
        printf("  写入错误!\n");
    } else {
        printf("  写入成功，无错误\n");
    }
    fclose(fp);
    printf("\n");

    // 2. 模拟只读文件写入错误
    printf("2. 只读文件写入（模拟错误）:\n");
    fp = fopen("error_test.txt", "r");
    if (fp) {
        // 尝试写入只读文件
        // 注意：这里实际上不会直接报错，但ferror可能检测到
        // 在大多数实现中，对只读文件写入是未定义行为
        printf("  文件以只读模式打开\n");
        printf("  注意：对只读文件写入是未定义行为\n");
        printf("  当前错误状态: %s\n", ferror(fp) ? "有错误" : "无错误");
        fclose(fp);
    }
    printf("\n");

    // 3. 磁盘空间不足模拟
    printf("3. ferror的使用场景:\n");
    printf("  - 磁盘空间不足导致写入失败\n");
    printf("  - 文件系统权限问题\n");
    printf("  - 网络文件系统连接中断\n");
    printf("  - 设备硬件故障\n");
}

// 演示feof检测文件末尾
void demonstrate_feof() {
    printf("========== feof演示 ==========\n\n");

    // 创建测试文件
    FILE* fp = fopen("feof_test.txt", "w");
    if (fp) {
        for (int i = 1; i <= 5; i++) {
            fprintf(fp, "Line %d\n", i);
        }
        fclose(fp);
    }

    // 读取文件直到末尾
    printf("1. 逐行读取直到文件末尾:\n");
    fp = fopen("feof_test.txt", "r");
    if (!fp) return;

    char line[100];
    int line_num = 1;

    while (1) {
        if (fgets(line, sizeof(line), fp) == NULL) {
            if (feof(fp)) {
                printf("  到达文件末尾 (EOF)\n");
            } else if (ferror(fp)) {
                printf("  读取错误\n");
            }
            break;
        }
        printf("  %d: %s", line_num++, line);
    }
    fclose(fp);
    printf("\n");

    // 2. feof的使用陷阱
    printf("2. feof的常见陷阱:\n");
    printf("  错误用法:\n");
    printf("    while (!feof(fp)) {\n");
    printf("      fgets(buf, size, fp);  // 可能读取失败\n");
    printf("      process(buf);           // 处理无效数据\n");
    printf("    }\n\n");
    printf("  正确用法:\n");
    printf("    while (fgets(buf, size, fp)) {\n");
    printf("      process(buf);  // 只有当fgets成功时才处理\n");
    printf("    }\n");
    printf("    if (feof(fp)) // 检查是否到文件末尾\n");
    printf("    else if (ferror(fp)) // 检查是否有错误\n");
}

// 演示clearerr清除错误标志
void demonstrate_clearerr() {
    printf("========== clearerr演示 ==========\n\n");

    printf("1. clearerr的作用:\n");
    printf("  - 清除文件流的错误标志（ferror返回0）\n");
    printf("  - 清除文件流的EOF标志（feof返回0）\n");
    printf("  - 允许重新尝试之前失败的操作\n\n");

    printf("2. 使用场景:\n");
    FILE* fp = fopen("clearerr_test.txt", "w+");
    if (fp) {
        fprintf(fp, "测试数据\n");
        rewind(fp);

        // 读取所有数据
        char buffer[100];
        while (fgets(buffer, sizeof(buffer), fp)) {
            printf("  读取: %s", buffer);
        }

        // 此时feof(fp)为真
        printf("  feof: %s\n", feof(fp) ? "true" : "false");

        // 清除EOF标志
        clearerr(fp);
        printf("  clearerr()后 feof: %s\n", feof(fp) ? "true" : "false");

        // 现在可以重新定位并读取
        rewind(fp);
        printf("  rewind后可以重新读取\n");

        fclose(fp);
    }

    printf("\n3. clearerr典型应用:\n");
    printf("  - 从交互式设备读取时，遇到EOF后清除标志继续\n");
    printf("  - 网络文件系统出错后重试\n");
    printf("  - 磁带设备读取错误后重试\n");
}

// 综合错误处理示例
void comprehensive_error_handling(const char* filename) {
    printf("========== 综合错误处理 ==========\n\n");

    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("打开文件失败: %s\n", filename);
        printf("  errno = %d\n", errno);
        printf("  strerror: %s\n", strerror(errno));
        perror("  perror");
        return;
    }

    printf("文件打开成功: %s\n\n", filename);

    char buffer[1024];
    int line_count = 0;
    int error_count = 0;

    while (1) {
        char* result = fgets(buffer, sizeof(buffer), fp);

        if (result == NULL) {
            if (feof(fp)) {
                printf("正常到达文件末尾\n");
                break;
            }
            if (ferror(fp)) {
                error_count++;
                printf("读取第%d行时出错\n", line_count + 1);

                if (error_count < 3) {
                    // 尝试清除错误继续
                    printf("  尝试清除错误标志...\n");
                    clearerr(fp);
                    continue;
                } else {
                    printf("  错误次数过多，停止读取\n");
                    break;
                }
            }
            break;
        }

        line_count++;
        printf("  第%d行: %s", line_count, buffer);
    }

    printf("\n读取完成: %d行, %d个错误\n", line_count, error_count);

    if (fclose(fp) == EOF) {
        printf("关闭文件时出错!\n");
    } else {
        printf("文件关闭成功\n");
    }
}

int main() {
    printf("========== 文件错误处理 ==========\n\n");

    demonstrate_ferror();
    printf("\n");
    demonstrate_feof();
    printf("\n");
    demonstrate_clearerr();
    printf("\n");

    // 创建测试文件并运行综合示例
    FILE* fp = fopen("error_handling_test.txt", "w");
    if (fp) {
        for (int i = 1; i <= 10; i++) {
            fprintf(fp, "测试数据行 #%d\n", i);
        }
        fclose(fp);
    }

    comprehensive_error_handling("error_handling_test.txt");

    printf("\n错误处理最佳实践:\n");
    printf("  1. 始终检查fopen的返回值\n");
    printf("  2. 每次读写后检查ferror/feof\n");
    printf("  3. 使用while(fgets/read)而非while(!feof)\n");
    printf("  4. 检查fclose的返回值（缓冲数据可能写入失败）\n");
    printf("  5. 使用perror或strerror获取详细错误信息\n");
    printf("  6. 合理使用clearerr进行错误恢复\n");

    return 0;
}
```

---

## 七、本章小结

本章系统地讲解了C语言文件操作的基础知识，从文件打开到错误处理，涵盖了文件IO编程的核心概念。

**核心知识点回顾：**

1. **FILE指针与打开模式**：FILE是C标准库中的文件流类型，stdin/stdout/stderr是自动打开的标准流。文件打开模式包括文本模式（r/w/a/r+/w+/a+）和二进制模式（rb/wb/ab等），每种模式有不同的行为特点。

2. **fopen/fclose**：fopen用于打开文件，返回FILE指针，失败返回NULL。fclose关闭文件并刷新缓冲区，释放资源。重要的是始终检查返回值，并用完后立即关闭。

3. **文本文件读写**：fprintf/fscanf用于格式化读写，fgets/fputs用于行读写。fgets安全地读取一行（保留换行符），fputs写入字符串。文本文件可读性好，但有格式转换开销。

4. **二进制文件读写**：fread/fwrite直接操作内存字节，无格式转换，效率高，数据精确。二进制文件支持随机访问，可以通过计算偏移量直接定位到任意记录。

5. **文件定位**：fseek用于移动文件位置指针，支持SEEK_SET（开头）、SEEK_CUR（当前）、SEEK_END（末尾）三种定位方式。ftell返回当前位置，rewind回到文件开头。随机访问使得二分查找等高级操作成为可能。

6. **错误处理**：ferror检测文件流错误，feof检测文件末尾，clearerr清除错误和EOF标志。正确的错误处理是编写健壮文件操作代码的基础，应在每次文件操作后检查状态。

掌握这些基础知识后，你已经具备了进行文件IO编程的核心能力。在下一章中，我们将进一步学习文件操作的高级技巧，包括格式化文件读写实战、学生成绩管理系统、大文件处理、文件加密解密和配置文件解析等。
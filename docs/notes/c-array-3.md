---
title: C语言数组与函数Ⅲ
date: 2026-07-26
tags:
  - C语言
  - 字符串
  - char数组
  - string.h
categories:
  - C语言
---

# C语言数组与函数Ⅲ——字符串与字符数组

## 一、引言

C语言没有专门的字符串类型，字符串以'\0'结尾的字符数组形式存在。这种设计虽然底层，但给了程序员完全的控制权。本章将深入剖析C语言字符串的本质、string.h标准库函数、以及手动实现字符串函数来理解底层原理。

---

## 二、字符串的本质

### 2.1 字符数组与字符串

```c
#include <stdio.h>

int main() {
    printf("========== 字符数组与字符串 ==========\n\n");

    // 字符数组 vs 字符串
    char arr1[] = {'H', 'e', 'l', 'l', 'o'};  // 不是字符串，无'\0'
    char arr2[] = {'H', 'e', 'l', 'l', 'o', '\0'};  // 是字符串
    char arr3[] = "Hello";  // 字符串字面量，自动添加'\0'

    printf("sizeof(arr1) = %zu (无\\0)\n", sizeof(arr1));
    printf("sizeof(arr2) = %zu (手动加\\0)\n", sizeof(arr2));
    printf("sizeof(arr3) = %zu (自动加\\0)\n", sizeof(arr3));

    printf("\narr1作为字符串: %s (可能乱码)\n", arr1);
    printf("arr2作为字符串: %s\n", arr2);
    printf("arr3作为字符串: %s\n", arr3);

    // 字符串字面量存储在只读数据段
    printf("\n【字符串字面量的存储位置】\n");
    char* str_ptr = "Hello World";  // 指向只读数据段
    char str_arr[] = "Hello World"; // 在栈上复制一份

    printf("str_ptr 地址: %p (只读数据段)\n", (void*)str_ptr);
    printf("str_arr 地址: %p (栈)\n", (void*)str_arr);

    // str_ptr[0] = 'h';  // 运行时错误！试图修改只读数据
    str_arr[0] = 'h';      // 正确，修改栈上的副本
    printf("修改后 str_arr: %s\n", str_arr);

    return 0;
}
```

### 2.2 字符串的输入

```c
#include <stdio.h>
#include <string.h>

int main() {
    printf("========== 字符串输入 ==========\n\n");

    char name[50];

    // scanf: 遇到空格停止
    printf("【scanf】输入姓名: ");
    scanf("%s", name);
    printf("scanf读取: '%s'\n", name);
    while (getchar() != '\n');

    // gets: 读取整行（不安全，已废弃）
    // 改用 fgets
    printf("\n【fgets】输入姓名: ");
    fgets(name, sizeof(name), stdin);
    name[strcspn(name, "\n")] = 0;  // 移除换行符
    printf("fgets读取: '%s'\n", name);

    printf("\n【scanf + 扫描集】输入(含空格): ");
    scanf("%[^\n]", name);  // 读取到换行符为止
    printf("扫描集读取: '%s'\n", name);

    return 0;
}
```

### 2.3 字符串遍历

```c
#include <stdio.h>

int main() {
    printf("========== 字符串遍历 ==========\n\n");

    char str[] = "Hello, C Language!";

    // 方式1：下标遍历
    printf("1. 下标遍历: ");
    for (int i = 0; str[i] != '\0'; i++) {
        printf("%c", str[i]);
    }
    printf("\n");

    // 方式2：指针遍历
    printf("2. 指针遍历: ");
    for (char* p = str; *p != '\0'; p++) {
        printf("%c", *p);
    }
    printf("\n");

    // 方式3：while遍历
    printf("3. while遍历: ");
    int i = 0;
    while (str[i] != '\0') {
        printf("%c", str[i]);
        i++;
    }
    printf("\n");

    // 统计信息
    printf("\n【统计信息】\n");
    int letters = 0, digits = 0, spaces = 0, others = 0;
    for (char* p = str; *p != '\0'; p++) {
        if ((*p >= 'A' && *p <= 'Z') || (*p >= 'a' && *p <= 'z'))
            letters++;
        else if (*p >= '0' && *p <= '9')
            digits++;
        else if (*p == ' ')
            spaces++;
        else
            others++;
    }
    printf("字母: %d, 数字: %d, 空格: %d, 其他: %d\n",
           letters, digits, spaces, others);

    return 0;
}
```

---

## 三、string.h 标准库函数

### 3.1 常用函数

```c
#include <stdio.h>
#include <string.h>

int main() {
    printf("========== string.h 常用函数 ==========\n\n");

    char str1[50] = "Hello";
    char str2[] = "World";
    char str3[50];

    // strlen: 计算长度（不含'\0'）
    printf("strlen(\"%s\") = %zu\n", str1, strlen(str1));

    // strcpy: 复制字符串
    strcpy(str3, str1);
    printf("strcpy: str3 = \"%s\"\n", str3);

    // strncpy: 安全复制（指定最大长度）
    strncpy(str3, "Hello World", 5);
    str3[5] = '\0';
    printf("strncpy(5): str3 = \"%s\"\n", str3);

    // strcat: 连接字符串
    strcpy(str3, "Hello ");
    strcat(str3, "World");
    printf("strcat: str3 = \"%s\"\n", str3);

    // strncat: 安全连接
    strcpy(str3, "Hello ");
    strncat(str3, "World!!!", 5);
    printf("strncat(5): str3 = \"%s\"\n", str3);

    // strcmp: 比较字符串
    printf("\nstrcmp(\"abc\", \"abc\") = %d\n", strcmp("abc", "abc"));
    printf("strcmp(\"abc\", \"abd\") = %d (负，abc<abd)\n", strcmp("abc", "abd"));
    printf("strcmp(\"abc\", \"abb\") = %d (正，abc>abb)\n", strcmp("abc", "abb"));

    // strchr: 查找字符
    char* pos = strchr("Hello World", 'W');
    printf("\nstrchr('W'): 位置 = %td\n", pos - "Hello World");

    // strstr: 查找子串
    char* sub = strstr("Hello World", "World");
    printf("strstr(\"World\"): 找到 \"%s\"\n", sub);

    return 0;
}
```

### 3.2 手动实现 string.h 函数

```c
#include <stdio.h>

// 手动实现 strlen
size_t my_strlen(const char* str) {
    const char* p = str;
    while (*p != '\0') p++;
    return p - str;
}

// 手动实现 strcpy
char* my_strcpy(char* dest, const char* src) {
    char* original = dest;
    while (*src != '\0') {
        *dest = *src;
        dest++;
        src++;
    }
    *dest = '\0';
    return original;
}

// 手动实现 strcat
char* my_strcat(char* dest, const char* src) {
    char* original = dest;
    while (*dest != '\0') dest++;
    while (*src != '\0') {
        *dest = *src;
        dest++;
        src++;
    }
    *dest = '\0';
    return original;
}

// 手动实现 strcmp
int my_strcmp(const char* s1, const char* s2) {
    while (*s1 != '\0' && *s2 != '\0') {
        if (*s1 != *s2) return *s1 - *s2;
        s1++;
        s2++;
    }
    return *s1 - *s2;
}

// 手动实现 strchr
char* my_strchr(const char* str, int ch) {
    while (*str != '\0') {
        if (*str == ch) return (char*)str;
        str++;
    }
    return NULL;
}

int main() {
    printf("========== 手动实现 string.h ==========\n\n");

    char str1[] = "Hello";
    char str2[] = "World";
    char buffer[50];

    printf("my_strlen(\"%s\") = %zu\n", str1, my_strlen(str1));

    my_strcpy(buffer, str1);
    printf("my_strcpy: buffer = \"%s\"\n", buffer);

    my_strcat(buffer, " ");
    my_strcat(buffer, str2);
    printf("my_strcat: buffer = \"%s\"\n", buffer);

    printf("my_strcmp(\"abc\", \"abd\") = %d\n", my_strcmp("abc", "abd"));

    char* found = my_strchr("Hello World", 'W');
    printf("my_strchr('W'): 找到 '%c'\n", *found);

    return 0;
}
```

---

## 四、字符串处理技巧

### 4.1 字符串分割

```c
#include <stdio.h>
#include <string.h>

int main() {
    printf("========== 字符串分割 ==========\n\n");

    char str[] = "apple,banana,orange,grape,mango";
    char* token;

    printf("原始字符串: %s\n\n", str);
    printf("使用 strtok 分割:\n");

    token = strtok(str, ",");
    int count = 0;
    while (token != NULL) {
        printf("  %d: %s\n", ++count, token);
        token = strtok(NULL, ",");
    }

    printf("\n共 %d 个部分\n", count);

    return 0;
}
```

### 4.2 字符串与数字转换

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("========== 字符串与数字转换 ==========\n\n");

    // atoi: 字符串转整数
    printf("atoi(\"12345\") = %d\n", atoi("12345"));
    printf("atoi(\"-42\") = %d\n", atoi("-42"));
    printf("atoi(\"100abc\") = %d (遇到非数字停止)\n", atoi("100abc"));

    // atof: 字符串转浮点数
    printf("\natof(\"3.14159\") = %f\n", atof("3.14159"));
    printf("atof(\"-2.5e3\") = %f\n", atof("-2.5e3"));

    // strtol: 带进制和错误检测
    printf("\nstrtol(\"FF\", NULL, 16) = %ld\n", strtol("FF", NULL, 16));
    printf("strtol(\"1010\", NULL, 2) = %ld\n", strtol("1010", NULL, 2));

    // 反向：数字转字符串
    char buffer[50];
    sprintf(buffer, "%d", 12345);
    printf("\nsprintf: 12345 -> \"%s\"\n", buffer);
    sprintf(buffer, "%.2f", 3.14159);
    printf("sprintf: 3.14159 -> \"%s\"\n", buffer);

    return 0;
}
```

### 4.3 字符串处理综合

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

// 反转字符串
void reverse_string(char* str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = temp;
    }
}

// 大小写转换
void to_upper_string(char* str) {
    for (int i = 0; str[i] != '\0'; i++)
        str[i] = toupper(str[i]);
}

void to_lower_string(char* str) {
    for (int i = 0; str[i] != '\0'; i++)
        str[i] = tolower(str[i]);
}

// 统计单词数
int count_words(const char* str) {
    int count = 0;
    int in_word = 0;
    for (int i = 0; str[i] != '\0'; i++) {
        if (isspace(str[i])) {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;
            count++;
        }
    }
    return count;
}

// 判断回文
int is_palindrome(const char* str) {
    int left = 0, right = strlen(str) - 1;
    while (left < right) {
        if (tolower(str[left]) != tolower(str[right]))
            return 0;
        left++;
        right--;
    }
    return 1;
}

int main() {
    printf("========== 字符串处理综合 ==========\n\n");

    char str[] = "Hello World";
    printf("原始: \"%s\"\n", str);

    reverse_string(str);
    printf("反转: \"%s\"\n", str);
    reverse_string(str);

    char upper[50]; strcpy(upper, str);
    to_upper_string(upper);
    printf("大写: \"%s\"\n", upper);

    char sentence[] = "The quick brown fox jumps over the lazy dog";
    printf("\n\"%s\"\n", sentence);
    printf("单词数: %d\n", count_words(sentence));

    printf("\n回文判断:\n");
    const char* tests[] = {"racecar", "hello", "level", "A man a plan a canal Panama"};
    for (int i = 0; i < 4; i++) {
        printf("\"%s\" -> %s\n", tests[i],
               is_palindrome(tests[i]) ? "是回文" : "不是回文");
    }

    return 0;
}
```

---

## 五、综合实战：命令行参数解析

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    printf("========== 命令行参数解析 ==========\n\n");

    printf("参数个数: %d\n", argc);
    printf("程序名: %s\n\n", argv[0]);

    for (int i = 1; i < argc; i++) {
        printf("参数%d: \"%s\"\n", i, argv[i]);

        if (strcmp(argv[i], "--help") == 0 || strcmp(argv[i], "-h") == 0) {
            printf("  用法: program [选项]\n");
            printf("  选项:\n");
            printf("    --help, -h     显示帮助\n");
            printf("    --version, -v  显示版本\n");
            printf("    --name <name>  设置名称\n");
            printf("    --count <n>    设置计数\n");
        } else if (strcmp(argv[i], "--version") == 0 || strcmp(argv[i], "-v") == 0) {
            printf("  版本: 1.0.0\n");
        } else if (strcmp(argv[i], "--name") == 0 && i + 1 < argc) {
            printf("  名称: %s\n", argv[++i]);
        } else if (strcmp(argv[i], "--count") == 0 && i + 1 < argc) {
            int count = atoi(argv[++i]);
            printf("  计数: %d\n", count);
        }
    }

    if (argc == 1) {
        printf("没有提供参数，使用 --help 查看帮助\n");
    }

    return 0;
}
```

---

## 本章小结

本章深入讲解了C语言字符串：

1. **字符串本质**：'\0'结尾的字符数组、字面量位置、输入方式
2. **string.h函数**：strlen/strcpy/strcat/strcmp/strchr/strstr
3. **手动实现**：理解底层原理，每个函数从头实现
4. **处理技巧**：分割、转换、反转、大小写、回文
5. **综合实战**：命令行参数解析

掌握字符串处理是C语言编程的必备技能，建议手动实现每个string.h函数以加深理解。
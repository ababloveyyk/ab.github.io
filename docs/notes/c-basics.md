---
title: C语言基础语法Ⅰ
date: 2026-07-26
tags:
  - C语言
  - 数据类型
  - 变量
  - 运算符
  - printf
  - scanf
categories:
  - C语言
---

# C语言基础语法Ⅰ

## 一、C语言概述与开发环境搭建

### 1.1 C语言的历史地位

C语言诞生于1972年，由贝尔实验室的Dennis Ritchie开发。它被称为"高级汇编语言"，因为它在提供高级语言便利性的同时，保留了接近硬件的底层操作能力。几乎所有现代操作系统（Windows、Linux、macOS）的核心都是用C语言编写的。学习C语言，就是学习计算机的底层思维方式。

C语言的特点可以总结为以下几点：

- **简洁高效**：C语言的关键字仅32个，语法精炼，生成的机器码执行效率极高。
- **可移植性**：遵循ANSI C标准的代码可以在几乎任何平台上编译运行。
- **底层操作能力**：通过指针可以直接操作内存地址，这是理解计算机体系结构的关键。
- **结构化编程**：支持函数封装、模块化开发，为后续学习面向对象编程打下基础。

### 1.2 开发环境搭建

在正式开始学习之前，我们需要搭建一个可用的C语言开发环境。以下是详细步骤：

#### Windows平台环境搭建

**第一步：安装MinGW-w64编译器**

MinGW（Minimalist GNU for Windows）提供了在Windows上编译C/C++程序的完整工具链。推荐使用MinGW-w64，它支持64位程序编译。

1. 访问MinGW-w64官网下载安装程序
2. 安装时选择x86_64架构，posix线程模型，seh异常处理
3. 将安装目录（如 `C:\mingw-w64\bin`）添加到系统环境变量PATH中

**第二步：验证安装**

打开命令行（PowerShell或CMD），输入以下命令验证：

```bash
gcc --version
g++ --version
```

如果显示版本信息，说明安装成功。

**第三步：安装VS Code（推荐编辑器）**

1. 下载并安装Visual Studio Code
2. 安装C/C++扩展插件（由Microsoft提供）
3. 配置tasks.json用于编译，launch.json用于调试

以下是推荐的VS Code编译配置（tasks.json）：

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: gcc 编译活动文件",
            "command": "gcc",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": ["$gcc"],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "编译器: gcc"
        }
    ]
}
```

#### Linux平台环境搭建

Linux通常自带GCC编译器，如果没有，通过包管理器安装：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install build-essential gdb

# CentOS/RHEL/Fedora
sudo yum groupinstall "Development Tools"

# 验证安装
gcc --version
```

---

## 二、C语言程序结构

### 2.1 第一个C程序：Hello World

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

这段代码虽然简单，但包含了C语言程序的基本骨架。让我们逐行分析：

**`#include <stdio.h>`**：预处理器指令，将标准输入输出头文件包含进来。`stdio.h` 包含了 `printf`、`scanf` 等函数的声明。预处理器在编译前处理这些指令，相当于把 `stdio.h` 的内容复制到当前文件中。

**`int main()`**：程序入口函数。每个C程序必须有且仅有一个 `main` 函数。`int` 表示返回值类型为整数，操作系统通过返回值判断程序是否正常结束（0表示成功，非0表示异常）。

**`printf("Hello, World!\n")`**：格式化输出函数。`\n` 是换行转义字符。

**`return 0`**：返回0给操作系统，表示程序正常结束。

### 2.2 编译与运行

C语言是编译型语言，源代码需要经过编译、链接才能生成可执行文件。完整的编译流程如下：

```
源文件(.c) → 预处理(.i) → 编译(.s) → 汇编(.o) → 链接(.exe)
```

实际编译命令：

```bash
# 一步编译
gcc -o hello hello.c

# 分步编译（了解底层原理）
gcc -E hello.c -o hello.i    # 预处理：展开宏和头文件
gcc -S hello.i -o hello.s    # 编译：生成汇编代码
gcc -c hello.s -o hello.o    # 汇编：生成目标文件
gcc hello.o -o hello         # 链接：生成可执行文件

# 运行
./hello     # Linux/Mac
hello.exe   # Windows
```

**常用编译选项详解**：

```bash
gcc -Wall -Wextra -g -O0 -o output source.c
```

| 选项 | 含义 |
|------|------|
| `-Wall` | 启用所有常见警告 |
| `-Wextra` | 启用额外警告 |
| `-g` | 包含调试信息（用于GDB调试） |
| `-O0` | 不优化（便于调试，O1/O2/O3分别表示不同优化级别） |
| `-std=c11` | 指定C语言标准（c89/c99/c11/c17） |
| `-o` | 指定输出文件名 |

完整编译示例：

```c
#include <stdio.h>

int main() {
    printf("编译选项演示\n");
    printf("__STDC_VERSION__ = %ld\n", __STDC_VERSION__);
    printf("__FILE__ = %s\n", __FILE__);
    printf("__LINE__ = %d\n", __LINE__);
    printf("__DATE__ = %s\n", __DATE__);
    printf("__TIME__ = %s\n", __TIME__);
    return 0;
}
```

编译运行：

```bash
gcc -Wall -Wextra -std=c11 -o demo demo.c
./demo
```

输出示例：

```
编译选项演示
__STDC_VERSION__ = 201112
__FILE__ = demo.c
__LINE__ = 6
__DATE__ = Jul 26 2026
__TIME__ = 10:30:00
```

---

## 三、数据类型详解

C语言的数据类型决定了变量在内存中占用的空间大小和能表示的数据范围。理解数据类型是避免溢出、数据截断等Bug的基础。

### 3.1 基本数据类型表

| 类型 | 关键字 | 占用字节 | 取值范围 | 格式说明符 |
|------|--------|---------|---------|-----------|
| 字符型 | `char` | 1 | -128 ~ 127（或 0~255） | `%c` |
| 短整型 | `short` | 2 | -32768 ~ 32767 | `%hd` |
| 整型 | `int` | 4 | -2147483648 ~ 2147483647 | `%d` |
| 长整型 | `long` | 4/8 | 平台相关 | `%ld` |
| 长长整型 | `long long` | 8 | -2^63 ~ 2^63-1 | `%lld` |
| 单精度浮点 | `float` | 4 | ±3.4E±38（6位精度） | `%f` |
| 双精度浮点 | `double` | 8 | ±1.7E±308（15位精度） | `%lf` |
| 长双精度 | `long double` | 12/16 | 更大范围 | `%Lf` |

### 3.2 使用sizeof验证数据类型大小

```c
#include <stdio.h>

int main() {
    printf("=== C语言数据类型大小验证 ===\n\n");
    printf("char:       %zu 字节\n", sizeof(char));
    printf("short:      %zu 字节\n", sizeof(short));
    printf("int:        %zu 字节\n", sizeof(int));
    printf("long:       %zu 字节\n", sizeof(long));
    printf("long long:  %zu 字节\n", sizeof(long long));
    printf("float:      %zu 字节\n", sizeof(float));
    printf("double:     %zu 字节\n", sizeof(double));
    printf("long double: %zu 字节\n", sizeof(long double));
    printf("\n=== 指针类型大小 ===\n");
    printf("char*:      %zu 字节\n", sizeof(char*));
    printf("int*:       %zu 字节\n", sizeof(int*));
    printf("void*:      %zu 字节\n", sizeof(void*));

    return 0;
}
```

运行结果示例（64位系统）：

```
=== C语言数据类型大小验证 ===

char:       1 字节
short:      2 字节
int:        4 字节
long:       4 字节
long long:  8 字节
float:      4 字节
double:     8 字节
long double: 16 字节

=== 指针类型大小 ===
char*:      8 字节
int*:       8 字节
void*:      8 字节
```

### 3.3 有符号与无符号类型

C语言中，整数类型可以用 `signed`（有符号）和 `unsigned`（无符号）修饰：

```c
#include <stdio.h>
#include <limits.h>

int main() {
    // 有符号与无符号的最大值
    printf("signed int    max: %d\n", INT_MAX);
    printf("signed int    min: %d\n", INT_MIN);
    printf("unsigned int  max: %u\n", UINT_MAX);
    printf("\n");

    // 溢出演示
    unsigned int u = 0;
    u = u - 1;  // 无符号下溢，会回绕到最大值
    printf("unsigned 0 - 1 = %u\n", u);

    int s = INT_MAX;
    s = s + 1;  // 有符号溢出，这是未定义行为
    printf("INT_MAX + 1 = %d (溢出，结果不可预测)\n", s);

    return 0;
}
```

输出：

```
signed int    max: 2147483647
signed int    min: -2147483648
unsigned int  max: 4294967295

unsigned 0 - 1 = 4294967295
INT_MAX + 1 = -2147483648 (溢出，结果不可预测)
```

### 3.4 浮点数的精度问题

浮点数在计算机中以二进制科学计数法存储，因此无法精确表示所有十进制小数。这是计算机科学中的重要概念。

```c
#include <stdio.h>

int main() {
    float f = 0.1f;
    double d = 0.1;

    printf("float 0.1:  %.20f\n", f);
    printf("double 0.1: %.20f\n", d);

    // 浮点比较陷阱
    float a = 0.1f + 0.2f;
    float b = 0.3f;

    printf("\n0.1 + 0.2 = %.20f\n", a);
    printf("0.3       = %.20f\n", b);
    printf("相等吗？%s\n", (a == b) ? "相等" : "不相等！");

    // 正确的浮点比较方法
    float epsilon = 1e-6f;
    printf("使用容差比较(epsilon=%.6f): %s\n",
           epsilon,
           (fabsf(a - b) < epsilon) ? "相等" : "不相等");

    return 0;
}
```

输出：

```
float 0.1:  0.10000000149011611938
double 0.1: 0.10000000000000000555

0.1 + 0.2 = 0.30000001192092895508
0.3       = 0.30000001192092895508
相等吗？不相等！
使用容差比较(epsilon=0.000001): 相等
```

---

## 四、变量与常量

### 4.1 变量声明与初始化

C语言中变量必须先声明后使用。声明变量时，编译器会为其分配内存空间：

```c
#include <stdio.h>

int main() {
    // 方式1：声明后赋值
    int a;
    a = 10;

    // 方式2：声明时初始化
    int b = 20;

    // 方式3：多个变量同时声明
    int c = 30, d = 40, e;

    // 方式4：C99标准允许在任何位置声明变量
    int result = a + b + c + d;

    printf("a=%d, b=%d, c=%d, d=%d\n", a, b, c, d);
    printf("result = %d\n", result);

    // 未初始化的变量包含垃圾值
    int garbage;
    printf("未初始化变量garbage = %d (垃圾值，每次运行不同)\n", garbage);

    return 0;
}
```

### 4.2 变量的作用域与生命周期

```c
#include <stdio.h>

int global_var = 100;  // 全局变量：整个程序可访问

void test_function() {
    int local_var = 200;  // 局部变量：仅函数内可访问
    static int static_var = 0;  // 静态局部变量：生命周期为整个程序，但作用域在函数内

    static_var++;
    printf("test_function: local_var=%d, static_var=%d, global_var=%d\n",
           local_var, static_var, global_var);
}

int main() {
    int local_var = 50;  // 与test_function中的local_var不冲突

    printf("main: local_var=%d, global_var=%d\n", local_var, global_var);

    test_function();  // static_var = 1
    test_function();  // static_var = 2
    test_function();  // static_var = 3

    // 全局变量可以在任何地方修改
    global_var = 999;
    test_function();

    return 0;
}
```

输出：

```
main: local_var=50, global_var=100
test_function: local_var=200, static_var=1, global_var=100
test_function: local_var=200, static_var=2, global_var=100
test_function: local_var=200, static_var=3, global_var=100
test_function: local_var=200, static_var=4, global_var=999
```

### 4.3 常量定义

C语言中定义常量有三种方式：

```c
#include <stdio.h>

// 方式1：宏定义常量（预处理阶段替换）
#define PI 3.14159265358979323846
#define MAX_STUDENTS 100
#define SCHOOL_NAME "安柏学院"

// 方式2：const常量（编译期检查类型）
const double E = 2.718281828459045;
const int MIN_AGE = 0;

// 方式3：枚举常量（适合一组相关常量）
enum Weekday {
    MONDAY = 1,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
};

int main() {
    printf("宏定义常量 PI = %.16f\n", PI);
    printf("宏定义常量 SCHOOL_NAME = %s\n", SCHOOL_NAME);
    printf("宏定义常量 MAX_STUDENTS = %d\n", MAX_STUDENTS);

    printf("\nconst常量 E = %.15f\n", E);
    printf("const常量 MIN_AGE = %d\n", MIN_AGE);

    printf("\n枚举常量:\n");
    printf("MONDAY = %d\n", MONDAY);
    printf("TUESDAY = %d\n", TUESDAY);
    printf("SUNDAY = %d\n", SUNDAY);

    // const常量不能被修改
    // PI = 3.0;  // 编译错误

    return 0;
}
```

---

## 五、运算符详解

C语言提供了丰富的运算符，分为以下几类：

### 5.1 算术运算符

```c
#include <stdio.h>

int main() {
    int a = 17, b = 5;

    printf("=== 算术运算符 ===\n");
    printf("a = %d, b = %d\n\n", a, b);

    printf("加法: a + b = %d\n", a + b);
    printf("减法: a - b = %d\n", a - b);
    printf("乘法: a * b = %d\n", a * b);
    printf("除法: a / b = %d  (整数除法，截断小数部分)\n", a / b);
    printf("取模: a %% b = %d  (取余数，两个操作数必须为整数)\n", a % b);

    // 浮点除法
    printf("\n浮点除法: (float)a / b = %.2f\n", (float)a / b);
    printf("浮点除法: 17.0 / 5.0 = %.2f\n", 17.0 / 5.0);

    // 自增自减运算符
    int x = 10;
    printf("\n=== 自增自减运算符 ===\n");
    printf("x = %d\n", x);
    printf("x++   = %d (先用后加，此时x=%d)\n", x++, x);
    printf("++x   = %d (先加后用，此时x=%d)\n", ++x, x);
    printf("x--   = %d (先用后减，此时x=%d)\n", x--, x);
    printf("--x   = %d (先减后用，此时x=%d)\n", --x, x);

    return 0;
}
```

输出：

```
=== 算术运算符 ===
a = 17, b = 5

加法: a + b = 22
减法: a - b = 12
乘法: a * b = 85
除法: a / b = 3  (整数除法，截断小数部分)
取模: a % b = 2  (取余数，两个操作数必须为整数)

浮点除法: (float)a / b = 3.40
浮点除法: 17.0 / 5.0 = 3.40

=== 自增自减运算符 ===
x = 10
x++   = 10 (先用后加，此时x=11)
++x   = 12 (先加后用，此时x=12)
x--   = 12 (先用后减，此时x=11)
--x   = 10 (先减后用，此时x=10)
```

### 5.2 关系运算符与逻辑运算符

```c
#include <stdio.h>
#include <stdbool.h>  // C99引入的布尔类型

int main() {
    int a = 10, b = 20, c = 10;

    printf("=== 关系运算符 ===\n");
    printf("a=%d, b=%d, c=%d\n\n", a, b, c);

    printf("a == b : %d (相等)\n", a == b);
    printf("a != b : %d (不等)\n", a != b);
    printf("a > b  : %d (大于)\n", a > b);
    printf("a < b  : %d (小于)\n", a < b);
    printf("a >= c : %d (大于等于)\n", a >= c);
    printf("a <= b : %d (小于等于)\n", a <= b);

    printf("\n=== 逻辑运算符 ===\n");
    printf("(a < b) && (a == c) : %d (逻辑与)\n", (a < b) && (a == c));
    printf("(a > b) || (a == c) : %d (逻辑或)\n", (a > b) || (a == c));
    printf("!(a == b)            : %d (逻辑非)\n", !(a == b));

    // 短路求值演示
    printf("\n=== 短路求值 ===\n");
    int x = 0;
    if (x != 0 && 10 / x > 5) {  // 短路：x=0，第二个条件不会执行，避免除零错误
        printf("不会执行到这里\n");
    } else {
        printf("短路求值避免了除零错误\n");
    }

    return 0;
}
```

### 5.3 位运算符

位运算符是C语言的重要特性，直接操作二进制位，在嵌入式开发和性能优化中极为重要：

```c
#include <stdio.h>

// 打印二进制表示
void print_binary(unsigned int n) {
    for (int i = 31; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
        if (i % 4 == 0) printf(" ");
    }
    printf("\n");
}

int main() {
    unsigned int a = 0b1100;  // 12
    unsigned int b = 0b1010;  // 10

    printf("a = %u (二进制: ", a); print_binary(a);
    printf("b = %u (二进制: ", b); print_binary(b);

    printf("\n=== 位运算符 ===\n");
    printf("a & b  = %u (按位与: 同为1才为1)\n", a & b);
    printf("a | b  = %u (按位或: 有1则为1)\n", a | b);
    printf("a ^ b  = %u (按位异或: 不同为1)\n", a ^ b);
    printf("~a     = %u (按位取反)\n", ~a);
    printf("a << 2 = %u (左移2位，相当于乘以4)\n", a << 2);
    printf("a >> 1 = %u (右移1位，相当于除以2)\n", a >> 1);

    // 实用技巧
    printf("\n=== 位运算实用技巧 ===\n");
    int n = 42;
    printf("判断奇偶: %d是%s\n", n, (n & 1) ? "奇数" : "偶数");
    printf("乘以2的幂: %d * 8 = %d\n", n, n << 3);
    printf("交换两数(不用临时变量):\n");
    int x = 5, y = 9;
    printf("  交换前: x=%d, y=%d\n", x, y);
    x = x ^ y;
    y = x ^ y;
    x = x ^ y;
    printf("  交换后: x=%d, y=%d\n", x, y);

    return 0;
}
```

### 5.4 运算符优先级

C语言运算符有严格的优先级，这是笔试和实际编程中常见的陷阱：

```c
#include <stdio.h>

int main() {
    printf("=== 运算符优先级验证 ===\n\n");

    // 优先级演示
    int a = 10, b = 5, c = 2;

    printf("a=%d, b=%d, c=%d\n\n", a, b, c);

    // 算术 > 关系 > 逻辑
    printf("a + b * c = %d (先乘后加)\n", a + b * c);
    printf("(a + b) * c = %d (括号改变优先级)\n", (a + b) * c);

    printf("\na + b > c * 5 && b < a\n");
    printf("= (%d) > (%d) && (%d)\n", a + b, c * 5, b < a);
    printf("= %d\n", a + b > c * 5 && b < a);

    // 赋值运算符优先级最低
    int result;
    result = a + b * c;  // 等价于 result = (a + (b * c))
    printf("\nresult = a + b * c = %d\n", result);

    // 常见陷阱
    int flag = 0;
    printf("\n=== 常见陷阱 ===\n");
    printf("if (flag & 1 == 0) → 实际是 if (flag & (1 == 0))\n");
    printf("正确写法: if ((flag & 1) == 0)\n");

    return 0;
}
```

输出：

```
=== 运算符优先级验证 ===

a=10, b=5, c=2

a + b * c = 20 (先乘后加)
(a + b) * c = 30 (括号改变优先级)

a + b > c * 5 && b < a
= (15) > (10) && (1)
= 1

result = a + b * c = 20

=== 常见陷阱 ===
if (flag & 1 == 0) → 实际是 if (flag & (1 == 0))
正确写法: if ((flag & 1) == 0)
```

---

## 六、格式化输入输出

### 6.1 printf 格式化输出详解

`printf` 是C语言中最常用的输出函数，其格式化字符串支持丰富的格式说明符：

```c
#include <stdio.h>

int main() {
    printf("=== printf 格式化输出大全 ===\n\n");

    // 整数
    int num = 255;
    printf("十进制:     %d\n", num);
    printf("八进制:     %o\n", num);
    printf("十六进制:   %x (小写)\n", num);
    printf("十六进制:   %X (大写)\n", num);
    printf("带前缀:     0x%X\n", num);

    // 宽度与对齐
    printf("\n=== 宽度与对齐 ===\n");
    printf("右对齐(宽度6): |%6d|\n", 42);
    printf("左对齐(宽度6): |%-6d|\n", 42);
    printf("补零(宽度6):   |%06d|\n", 42);
    printf("正数显示+号:   |%+d|\n", 42);

    // 浮点数
    double pi = 3.141592653589793;
    printf("\n=== 浮点数格式 ===\n");
    printf("默认:     %f\n", pi);
    printf("保留2位:  %.2f\n", pi);
    printf("宽度10:   |%10.2f|\n", pi);
    printf("科学计数: %e\n", pi);
    printf("自动选择: %g\n", pi);

    // 字符串
    printf("\n=== 字符串格式 ===\n");
    printf("完整:     |%s|\n", "Hello");
    printf("宽度10:   |%10s|\n", "Hello");
    printf("截断3字符:|%.3s|\n", "Hello");

    // 字符
    printf("\n=== 字符格式 ===\n");
    printf("字符: %c (ASCII码: %d)\n", 'A', 'A');

    // 指针
    int var = 100;
    printf("\n=== 指针地址 ===\n");
    printf("变量var的地址: %p\n", (void*)&var);

    return 0;
}
```

### 6.2 scanf 格式化输入

`scanf` 用于从标准输入读取数据，需要注意缓冲区问题：

```c
#include <stdio.h>

int main() {
    int age;
    float height;
    char name[50];
    char gender;

    printf("=== 学生信息录入系统 ===\n\n");

    // 读取整数
    printf("请输入年龄: ");
    scanf("%d", &age);

    // 读取浮点数
    printf("请输入身高(米): ");
    scanf("%f", &height);

    // 注意：scanf读取后会在缓冲区留下换行符
    // 使用getchar()清除缓冲区
    while (getchar() != '\n');

    // 读取字符
    printf("请输入性别(M/F): ");
    scanf("%c", &gender);

    // 再次清除缓冲区
    while (getchar() != '\n');

    // 读取字符串（不含空格）
    printf("请输入姓名: ");
    scanf("%s", name);  // 注意：name是数组名，本身是地址，不需要&

    printf("\n=== 录入结果 ===\n");
    printf("姓名: %s\n", name);
    printf("年龄: %d 岁\n", age);
    printf("身高: %.2f 米\n", height);
    printf("性别: %c\n", gender);

    return 0;
}
```

### 6.3 转义字符

```c
#include <stdio.h>

int main() {
    printf("=== C语言转义字符 ===\n\n");

    printf("换行:    第一行\\n第二行\n");
    printf("制表符:  列1\\t列2\\t列3\n");
    printf("退格:    ABC\\b\\b\\bXYZ   (退格实际效果: ");
    printf("ABC\b\b\bXYZ)\n");
    printf("回车:    演示\\r覆盖\n");
    printf("反斜杠:  \\\\\n");
    printf("单引号:  \\'\\n");
    printf("双引号:  \\\"\\n");
    printf("空字符:  \\0 (字符串结束标志)\n");
    printf("响铃:    \\a");  // 系统可能发出提示音

    printf("\n\n=== 制表符对齐示例 ===\n");
    printf("姓名\\t年龄\\t成绩\\n");
    printf("-----\\t-----\\t-----\\n");
    printf("张三\\t20\\t85.5\\n");
    printf("李四\\t21\\t92.0\\n");
    printf("王五\\t19\\t78.5\\n");

    return 0;
}
```

---

## 七、实战案例：温度转换与闰年判断

### 7.1 华氏温度转摄氏温度

```c
#include <stdio.h>

int main() {
    double fahrenheit, celsius;

    printf("====== 温度转换器 ======\n\n");

    printf("请输入华氏温度: ");
    scanf("%lf", &fahrenheit);

    // 转换公式: C = (F - 32) * 5 / 9
    celsius = (fahrenheit - 32.0) * 5.0 / 9.0;

    printf("\n%.2f°F = %.2f°C\n", fahrenheit, celsius);

    // 显示温度描述
    printf("\n温度描述: ");
    if (celsius >= 35.0) {
        printf("高温天气，注意防暑！\n");
    } else if (celsius >= 25.0) {
        printf("温暖舒适\n");
    } else if (celsius >= 10.0) {
        printf("凉爽宜人\n");
    } else if (celsius >= 0.0) {
        printf("天气寒冷，注意保暖\n");
    } else {
        printf("冰点以下，注意防冻\n");
    }

    return 0;
}
```

### 7.2 闰年判断程序

```c
#include <stdio.h>
#include <stdbool.h>

bool is_leap_year(int year) {
    // 闰年规则：
    // 1. 能被4整除但不能被100整除，或者
    // 2. 能被400整除
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

int main() {
    int year;

    printf("====== 闰年判断器 ======\n\n");
    printf("请输入年份: ");
    scanf("%d", &year);

    if (is_leap_year(year)) {
        printf("%d年是闰年，2月有29天，全年366天。\n", year);
    } else {
        printf("%d年是平年，2月有28天，全年365天。\n", year);
    }

    // 显示历史闰年
    printf("\n2000年至2040年间的闰年:\n");
    for (int y = 2000; y <= 2040; y++) {
        if (is_leap_year(y)) {
            printf("%d ", y);
        }
    }
    printf("\n");

    return 0;
}
```

### 7.3 交换两个变量（不使用第三个变量）

```c
#include <stdio.h>

int main() {
    printf("====== 变量交换（不借助第三个变量）======\n\n");

    // 方法1：使用加减法
    int a = 10, b = 20;
    printf("方法1 - 加减法:\n");
    printf("  交换前: a=%d, b=%d\n", a, b);
    a = a + b;  // a = 30
    b = a - b;  // b = 10
    a = a - b;  // a = 20
    printf("  交换后: a=%d, b=%d\n", a, b);

    // 方法2：使用异或运算（最优雅）
    int x = 100, y = 200;
    printf("\n方法2 - 异或法:\n");
    printf("  交换前: x=%d, y=%d\n", x, y);
    x = x ^ y;
    y = x ^ y;
    x = x ^ y;
    printf("  交换后: x=%d, y=%d\n", x, y);

    // 验证异或法的正确性
    printf("\n异或法推导(二进制):\n");
    int p = 5, q = 9;
    printf("  初始: p=%d (0101), q=%d (1001)\n", p, q);
    printf("  p = p ^ q = 0101 ^ 1001 = 1100 (%d)\n", p ^ q);
    printf("  q = p ^ q = 1100 ^ 1001 = 0101 (%d)\n", (p ^ q) ^ q);
    printf("  p = p ^ q = 1100 ^ 0101 = 1001 (%d)\n", (p ^ q) ^ ((p ^ q) ^ q));

    return 0;
}
```

---

## 八、综合练习：简易计算器

将本章所学知识整合，实现一个命令行简易计算器：

```c
#include <stdio.h>
#include <math.h>
#include <stdbool.h>

int main() {
    double num1, num2, result;
    char operator;
    bool running = true;

    printf("====== 简易计算器 ======\n");
    printf("支持运算: + - * / %% (取模) ^ (幂) s (开方)\n");
    printf("输入 q 退出程序\n\n");

    while (running) {
        printf("请输入表达式 (如 2+3): ");

        // 尝试读取数字-运算符-数字格式
        if (scanf("%lf", &num1) != 1) {
            char quit;
            scanf("%c", &quit);
            if (quit == 'q' || quit == 'Q') {
                printf("感谢使用，再见！\n");
                break;
            }
            printf("输入格式错误，请重新输入\n");
            while (getchar() != '\n');
            continue;
        }

        scanf(" %c", &operator);

        if (operator == 's' || operator == 'S') {
            // 开方运算（单操作数）
            printf("sqrt(%.2f) = %.2f\n", num1, sqrt(num1));
            continue;
        }

        if (scanf("%lf", &num2) != 1) {
            printf("第二个操作数无效\n");
            while (getchar() != '\n');
            continue;
        }

        switch (operator) {
            case '+':
                result = num1 + num2;
                printf("%.2f + %.2f = %.2f\n", num1, num2, result);
                break;
            case '-':
                result = num1 - num2;
                printf("%.2f - %.2f = %.2f\n", num1, num2, result);
                break;
            case '*':
                result = num1 * num2;
                printf("%.2f * %.2f = %.2f\n", num1, num2, result);
                break;
            case '/':
                if (num2 == 0) {
                    printf("错误: 除数不能为零！\n");
                } else {
                    result = num1 / num2;
                    printf("%.2f / %.2f = %.2f\n", num1, num2, result);
                }
                break;
            case '%':
                if (num2 == 0) {
                    printf("错误: 模运算的除数不能为零！\n");
                } else {
                    printf("%.0f %% %.0f = %.0f\n",
                           num1, num2, fmod(num1, num2));
                }
                break;
            case '^':
                result = pow(num1, num2);
                printf("%.2f ^ %.2f = %.2f\n", num1, num2, result);
                break;
            default:
                printf("不支持的运算符: %c\n", operator);
                break;
        }
    }

    return 0;
}
```

输出示例：

```
====== 简易计算器 ======
支持运算: + - * / % (取模) ^ (幂) s (开方)
输入 q 退出程序

请输入表达式 (如 2+3): 10+25
10.00 + 25.00 = 35.00
请输入表达式 (如 2+3): 100/3
100.00 / 3.00 = 33.33
请输入表达式 (如 2+3): 2^10
2.00 ^ 10.00 = 1024.00
请输入表达式 (如 2+3): s 144
sqrt(144.00) = 12.00
请输入表达式 (如 2+3): q
感谢使用，再见！
```

---

## 本章小结

本章从零开始介绍了C语言的基础语法，包括：

1. **开发环境搭建**：MinGW-w64编译器安装、VS Code配置
2. **程序结构**：`#include`、`main`函数、编译流程
3. **数据类型**：基本类型、sizeof验证、有符号/无符号、浮点精度
4. **变量与常量**：声明初始化、作用域、const/macro/enum
5. **运算符**：算术、关系、逻辑、位运算、优先级
6. **格式化输入输出**：printf/scanf、转义字符
7. **实战案例**：温度转换、闰年判断、变量交换、简易计算器

这些基础知识是后续学习流程控制、数组、函数、指针等高级主题的基石。建议每段代码都亲手敲一遍，在编译和运行中加深理解。
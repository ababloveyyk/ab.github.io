---
title: C语言基础语法Ⅳ
date: 2026-07-26
tags:
  - C语言
  - 运算符
  - 位运算
  - 优先级
  - 表达式
categories:
  - C语言
---

# C语言基础语法Ⅳ——运算符完全指南

## 一、引言

运算符是C语言的灵魂。C语言提供了异常丰富的运算符集合，从基本的算术运算到精妙的位操作，再到灵活的条件表达式。本章将逐一解析C语言的所有运算符，包括其语法、语义、优先级和结合性，并通过大量可运行代码验证每个细节。

---

## 二、算术运算符

### 2.1 基本算术运算

```c
#include <stdio.h>
#include <math.h>

int main() {
    printf("========== 基本算术运算 ==========\n\n");

    int a = 17, b = 5;

    printf("a = %d, b = %d\n\n", a, b);

    // 五种基本运算
    printf("加法: a + b = %d\n", a + b);
    printf("减法: a - b = %d\n", a - b);
    printf("乘法: a * b = %d\n", a * b);
    printf("除法: a / b = %d (整数除法)\n", a / b);
    printf("取模: a %% b = %d (取余数，仅用于整数)\n\n", a % b);

    // 浮点除法
    printf("浮点除法: (float)a / b = %.2f\n", (float)a / b);
    printf("浮点除法: a / (float)b = %.2f\n", (float)a / b);
    printf("浮点除法: 17.0 / 5.0 = %.2f\n\n", 17.0 / 5.0);

    // 取模的特殊情况
    printf("【取模特殊情况】\n");
    printf("10 %% 3 = %d\n", 10 % 3);
    printf("-10 %% 3 = %d (C99: 结果符号与被除数相同)\n", -10 % 3);
    printf("10 %% -3 = %d\n", 10 % -3);
    printf("-10 %% -3 = %d\n\n", -10 % -3);

    // 取模的实际应用
    printf("【取模应用】\n");
    printf("判断奇偶: 7%%2 = %d → %s\n", 7 % 2, (7 % 2 == 0) ? "偶数" : "奇数");
    printf("循环索引: 从0到9循环\n");
    for (int i = 0; i < 20; i++) {
        printf("%d ", i % 10);
    }
    printf("\n");

    return 0;
}
```

### 2.2 自增自减运算符

```c
#include <stdio.h>

int main() {
    printf("========== 自增自减运算符 ==========\n\n");

    int x = 10;
    printf("初始 x = %d\n\n", x);

    // 前缀++
    printf("【前缀 ++x】\n");
    int y = ++x;  // x先加1，再赋值给y
    printf("y = ++x → y = %d, x = %d\n\n", y, x);

    // 后缀++
    x = 10;
    printf("【后缀 x++】\n");
    y = x++;  // 先将x的值赋给y，x再加1
    printf("y = x++ → y = %d, x = %d\n\n", y, x);

    // 复杂表达式中的自增
    printf("【复杂表达式中的自增】\n");
    int a = 5;
    printf("a = 5\n");
    printf("a++ + a++ = %d + %d → 结果 = %d\n",
           5, 6, 5 + 6);  // 实际结果取决于编译器
    printf("警告：同一表达式多次修改同一变量是未定义行为！\n\n");

    // 自增在数组中的使用
    printf("【自增在数组遍历中】\n");
    int arr[] = {10, 20, 30, 40, 50};
    int i = 0;
    while (i < 5) {
        printf("arr[%d] = %d\n", i, arr[i]);
        i++;
    }
    printf("\n");

    // 指针自增（预览）
    printf("【指针自增】\n");
    int* p = arr;
    for (int j = 0; j < 5; j++) {
        printf("*p = %d, p地址 = %p\n", *p, (void*)p);
        p++;  // 指针向后移动sizeof(int)字节
    }

    return 0;
}
```

### 2.3 复合赋值运算符

```c
#include <stdio.h>

int main() {
    printf("========== 复合赋值运算符 ==========\n\n");

    int x = 10;

    printf("初始 x = %d\n\n", x);

    x += 5;  // x = x + 5
    printf("x += 5  → x = %d\n", x);

    x -= 3;  // x = x - 3
    printf("x -= 3  → x = %d\n", x);

    x *= 2;  // x = x * 2
    printf("x *= 2  → x = %d\n", x);

    x /= 4;  // x = x / 4
    printf("x /= 4  → x = %d\n", x);

    x %= 5;  // x = x % 5
    printf("x %%= 5  → x = %d\n\n", x);

    // 位运算复合赋值
    unsigned int y = 0xFF;
    printf("y = 0x%X\n", y);

    y &= 0x0F;  // y = y & 0x0F
    printf("y &= 0x0F → y = 0x%X\n", y);

    y |= 0xF0;  // y = y | 0xF0
    printf("y |= 0xF0 → y = 0x%X\n", y);

    y ^= 0xFF;  // y = y ^ 0xFF
    printf("y ^= 0xFF → y = 0x%X\n", y);

    y <<= 4;    // y = y << 4
    printf("y <<= 4  → y = 0x%X\n", y);

    y >>= 2;    // y = y >> 2
    printf("y >>= 2  → y = 0x%X\n", y);

    return 0;
}
```

---

## 三、关系运算符与逻辑运算符

### 3.1 关系运算符

```c
#include <stdio.h>

int main() {
    printf("========== 关系运算符 ==========\n\n");

    int a = 10, b = 20, c = 10;

    printf("a = %d, b = %d, c = %d\n\n", a, b, c);

    printf("a == b: %d (相等)\n", a == b);
    printf("a != b: %d (不等)\n", a != b);
    printf("a > b : %d (大于)\n", a > b);
    printf("a < b : %d (小于)\n", a < b);
    printf("a >= c: %d (大于等于)\n", a >= c);
    printf("a <= b: %d (小于等于)\n\n", a <= b);

    // 关系运算符返回int值（0或1）
    printf("【关系表达式返回值】\n");
    int result = (a > b);
    printf("(a > b) 返回: %d\n", result);
    printf("sizeof(a > b) = %zu\n\n", sizeof(a > b));

    // 链式比较的陷阱
    printf("【链式比较陷阱】\n");
    int x = 5;
    printf("if (0 < x < 10) → 数学上正确，C语言中错误！\n");
    printf("0 < x < 10 等价于 (0 < x) < 10\n");
    printf("(0 < x) = %d, %d < 10 = %d (永远为真)\n",
           (0 < x), (0 < x), (0 < x) < 10);
    printf("正确写法: if (0 < x && x < 10)\n");

    return 0;
}
```

### 3.2 逻辑运算符

```c
#include <stdio.h>
#include <stdbool.h>

int main() {
    printf("========== 逻辑运算符 ==========\n\n");

    int a = 10, b = 20, c = 0;

    printf("a = %d, b = %d, c = %d\n\n", a, b, c);

    // 逻辑与 &&
    printf("&& (逻辑与): 两边都为真才为真\n");
    printf("(a > 0) && (b > 0) = %d\n", (a > 0) && (b > 0));
    printf("(a > 0) && (c > 0) = %d\n\n", (a > 0) && (c > 0));

    // 逻辑或 ||
    printf("|| (逻辑或): 两边有一个为真就为真\n");
    printf("(a > 0) || (c > 0) = %d\n", (a > 0) || (c > 0));
    printf("(a < 0) || (c > 0) = %d\n\n", (a < 0) || (c > 0));

    // 逻辑非 !
    printf("! (逻辑非): 取反\n");
    printf("!a = %d (a非0，所以!a为0)\n", !a);
    printf("!c = %d (c为0，所以!c为1)\n\n", !c);

    // 短路求值（重要！）
    printf("【短路求值】\n");
    int x = 0;
    if (x != 0 && 10 / x > 5) {
        printf("不会执行到这里\n");
    } else {
        printf("短路求值：x=0，第二个条件不执行，避免除零\n");
    }

    int y = 5;
    if (y > 0 || 10 / 0 > 5) {
        printf("短路求值：y>0为真，第二个条件不执行，避免除零\n");
    }

    // 短路求值的副作用
    printf("\n【短路求值的副作用】\n");
    int count = 0;
    int flag = 0;
    if (flag && ++count) {
        printf("不会执行\n");
    }
    printf("count = %d (没有递增，因为flag为假，短路了)\n", count);

    return 0;
}
```

### 3.3 条件运算符（三元运算符）

```c
#include <stdio.h>

int main() {
    printf("========== 条件运算符 ==========\n\n");

    int score = 85;
    printf("分数: %d\n", score);

    // 基本用法
    char* grade = (score >= 90) ? "优秀" :
                  (score >= 80) ? "良好" :
                  (score >= 60) ? "及格" : "不及格";
    printf("等级: %s\n\n", grade);

    // 求最大值
    int a = 100, b = 200;
    int max = (a > b) ? a : b;
    printf("max(%d, %d) = %d\n\n", a, b, max);

    // 求三个数的最大值
    int c = 150;
    int max3 = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
    printf("max(%d, %d, %d) = %d\n\n", a, b, c, max3);

    // 条件运算符的返回值类型
    printf("【条件运算符的类型转换】\n");
    double d = 3.14;
    int i = 10;
    printf("sizeof(条件?int:double) = %zu (提升为double)\n",
           sizeof(1 ? i : d));

    return 0;
}
```

---

## 四、位运算符

### 4.1 位运算基础

```c
#include <stdio.h>

// 打印二进制表示
void print_binary(unsigned int n, int bits) {
    for (int i = bits - 1; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
        if (i % 4 == 0 && i != 0) printf(" ");
    }
}

int main() {
    printf("========== 位运算基础 ==========\n\n");

    unsigned int a = 0b1100;  // 12
    unsigned int b = 0b1010;  // 10

    printf("a = %2u (二进制: ", a); print_binary(a, 8); printf(")\n");
    printf("b = %2u (二进制: ", b); print_binary(b, 8); printf(")\n\n");

    // 按位与 &
    printf("a & b  = %2u (二进制: ", a & b);
    print_binary(a & b, 8); printf(") [同为1才为1]\n");

    // 按位或 |
    printf("a | b  = %2u (二进制: ", a | b);
    print_binary(a | b, 8); printf(") [有1则为1]\n");

    // 按位异或 ^
    printf("a ^ b  = %2u (二进制: ", a ^ b);
    print_binary(a ^ b, 8); printf(") [不同为1]\n");

    // 按位取反 ~
    printf("~a     = %u (二进制: ", ~a);
    print_binary(~a, 32); printf(") [0变1，1变0]\n");

    // 左移 <<
    printf("a << 2 = %2u (二进制: ", a << 2);
    print_binary(a << 2, 8); printf(") [左移2位，低位补0]\n");

    // 右移 >>
    printf("a >> 1 = %2u (二进制: ", a >> 1);
    print_binary(a >> 1, 8); printf(") [右移1位]\n");

    return 0;
}
```

### 4.2 位运算实用技巧

```c
#include <stdio.h>

int main() {
    printf("========== 位运算实用技巧 ==========\n\n");

    int n = 42;

    // 1. 判断奇偶
    printf("1. 判断奇偶\n");
    printf("   %d & 1 = %d → %s\n\n", n, n & 1, (n & 1) ? "奇数" : "偶数");

    // 2. 乘除2的幂
    printf("2. 乘除2的幂\n");
    printf("   %d * 8 = %d (等价于 %d << 3)\n", n, n * 8, n << 3);
    printf("   %d / 4 = %d (等价于 %d >> 2)\n", n, n / 4, n >> 2);

    // 3. 交换两个变量
    printf("\n3. 交换两个变量（异或法）\n");
    int x = 5, y = 9;
    printf("   交换前: x=%d, y=%d\n", x, y);
    x = x ^ y;
    y = x ^ y;
    x = x ^ y;
    printf("   交换后: x=%d, y=%d\n", x, y);

    // 4. 设置/清除/切换特定位
    printf("\n4. 位操作\n");
    unsigned int flags = 0b0000;
    printf("   初始: flags = %d\n", flags);

    flags |= (1 << 2);  // 设置第2位
    printf("   设置第2位: flags = %d (二进制: %04d)\n", flags,
           (flags & 8) ? 1 : 0, (flags & 4) ? 1 : 0,
           (flags & 2) ? 1 : 0, (flags & 1) ? 1 : 0);

    flags &= ~(1 << 2);  // 清除第2位
    printf("   清除第2位: flags = %d\n", flags);

    flags ^= (1 << 1);  // 切换第1位
    printf("   切换第1位: flags = %d\n", flags);

    // 5. 检查特定位
    printf("\n5. 检查特定位\n");
    int num = 0b1010;  // 10
    printf("   num = %d (二进制: 1010)\n", num);
    printf("   第1位是否为1: %s\n", (num & (1 << 1)) ? "是" : "否");
    printf("   第2位是否为1: %s\n", (num & (1 << 2)) ? "是" : "否");

    // 6. 获取最低位的1
    printf("\n6. 获取最低位的1\n");
    int val = 0b101100;  // 44
    printf("   val = %d (二进制: 101100)\n", val);
    printf("   val & -val = %d (最低位的1: 二进制100)\n", val & -val);

    // 7. 清除最低位的1
    printf("\n7. 清除最低位的1\n");
    printf("   val & (val - 1) = %d (二进制: 101000)\n", val & (val - 1));

    // 8. 统计二进制中1的个数
    printf("\n8. 统计二进制中1的个数\n");
    int count = 0;
    int temp = val;
    while (temp) {
        temp = temp & (temp - 1);
        count++;
    }
    printf("   %d的二进制中有%d个1\n", val, count);

    return 0;
}
```

### 4.3 位域（Bit Fields）

```c
#include <stdio.h>

// 使用位域定义紧凑的数据结构
struct Date {
    unsigned int day   : 5;  // 1-31，需要5位
    unsigned int month : 4;  // 1-12，需要4位
    unsigned int year  : 12; // 0-4095
};

struct Flags {
    unsigned int is_read    : 1;
    unsigned int is_write   : 1;
    unsigned int is_execute : 1;
    unsigned int is_hidden  : 1;
    unsigned int is_system  : 1;
    unsigned int reserved   : 3;
};

int main() {
    printf("========== 位域 ==========\n\n");

    printf("sizeof(struct Date) = %zu 字节\n", sizeof(struct Date));
    printf("sizeof(struct Flags) = %zu 字节\n\n", sizeof(struct Flags));

    struct Date today = {26, 7, 2026};
    printf("日期: %d-%02d-%02d\n", today.year, today.month, today.day);

    struct Flags file_attr = {1, 1, 0, 0, 0, 0};
    printf("\n文件属性:\n");
    printf("  可读: %s\n", file_attr.is_read ? "是" : "否");
    printf("  可写: %s\n", file_attr.is_write ? "是" : "否");
    printf("  可执行: %s\n", file_attr.is_execute ? "是" : "否");
    printf("  隐藏: %s\n", file_attr.is_hidden ? "是" : "否");

    // 位域与普通结构体内存对比
    printf("\n【内存对比】\n");
    struct NormalFlags {
        unsigned int is_read;
        unsigned int is_write;
        unsigned int is_execute;
        unsigned int is_hidden;
    };
    printf("位域版本: %zu字节\n", sizeof(struct Flags));
    printf("普通版本: %zu字节\n", sizeof(struct NormalFlags));

    return 0;
}
```

---

## 五、运算符优先级与结合性

### 5.1 完整优先级表验证

```c
#include <stdio.h>

int main() {
    printf("========== 运算符优先级验证 ==========\n\n");
    printf("优先级从高到低：\n\n");

    int a = 10, b = 5, c = 2, d = 3;

    // 1. 后缀 > 前缀 > 乘除 > 加减 > 移位 > 关系 > 位运算 > 逻辑 > 赋值
    printf("a = %d, b = %d, c = %d, d = %d\n\n", a, b, c, d);

    printf("1. a + b * c  = %d (先乘后加)\n", a + b * c);
    printf("2. (a + b) * c = %d\n", (a + b) * c);
    printf("3. a + b > c && d < a = %d\n", a + b > c && d < a);
    printf("4. a & b | c  = %d (先&后|)\n", a & b | c);
    printf("5. a ^ b << 2 = %d (先移位后异或)\n", a ^ b << 2);

    // 常见陷阱
    printf("\n【常见优先级陷阱】\n");
    int flag = 0;
    printf("if (flag & 1 == 0) → 实际 if (flag & (1 == 0))\n");
    printf("结果: %d (错误！)\n", flag & 1 == 0);
    printf("正确: if ((flag & 1) == 0) → %d\n", (flag & 1) == 0);

    printf("\n*p++ 是先取*p还是先p++？\n");
    int arr[] = {10, 20, 30};
    int *p = arr;
    printf("*p++ = %d (后缀++优先级高于*，但语义是先*p再p++)\n", *p++);
    printf("再次*p = %d\n", *p);

    return 0;
}
```

### 5.2 sizeof运算符

```c
#include <stdio.h>

int main() {
    printf("========== sizeof 运算符 ==========\n\n");

    // sizeof是运算符，不是函数
    int x = 10;
    printf("sizeof x = %zu (不带括号也可以)\n", sizeof x);
    printf("sizeof(x) = %zu\n\n", sizeof(x));

    // sizeof 数组
    int arr[10];
    printf("sizeof(arr) = %zu (整个数组大小)\n", sizeof(arr));
    printf("sizeof(arr[0]) = %zu (单个元素大小)\n", sizeof(arr[0]));
    printf("数组元素个数 = %zu\n", sizeof(arr) / sizeof(arr[0]));

    // sizeof 指针
    int* ptr = arr;
    printf("\nsizeof(ptr) = %zu (指针大小，不是数组大小)\n", sizeof(ptr));

    // sizeof 字符串字面量
    printf("\nsizeof(\"Hello\") = %zu (包含结尾的\\0，共6字节)\n", sizeof("Hello"));
    printf("strlen(\"Hello\") = ??? (不包含\\0，共5字节)\n");

    // sizeof 结构体（可能有填充）
    struct Test {
        char c;
        int i;
        short s;
    };
    printf("\nsizeof(struct Test) = %zu\n", sizeof(struct Test));
    printf("(char+int+short = 1+4+2 = 7，但实际更大，因为对齐)\n");

    return 0;
}
```

---

## 六、综合实战：多功能计算器

```c
#include <stdio.h>
#include <math.h>
#include <stdbool.h>

// 位运算演示
void bitwise_demo() {
    unsigned int a, b;
    printf("输入两个整数: ");
    scanf("%u %u", &a, &b);

    printf("\n【位运算结果】\n");
    printf("a & b  = %u\n", a & b);
    printf("a | b  = %u\n", a | b);
    printf("a ^ b  = %u\n", a ^ b);
    printf("~a     = %u\n", ~a);
    printf("a << 1 = %u (乘以2)\n", a << 1);
    printf("a >> 1 = %u (除以2)\n", a >> 1);
}

// 逻辑运算演示
void logic_demo() {
    int a, b;
    printf("输入两个整数: ");
    scanf("%d %d", &a, &b);

    printf("\n【逻辑运算】\n");
    printf("a && b = %d\n", a && b);
    printf("a || b = %d\n", a || b);
    printf("!a     = %d\n", !a);
    printf("!b     = %d\n", !b);

    printf("\n【关系运算】\n");
    printf("a == b: %d\n", a == b);
    printf("a != b: %d\n", a != b);
    printf("a > b : %d\n", a > b);
    printf("a >= b: %d\n", a >= b);
    printf("a < b : %d\n", a < b);
    printf("a <= b: %d\n", a <= b);
}

int main() {
    int choice;
    bool running = true;

    while (running) {
        printf("\n========== 多功能计算器 ==========\n");
        printf("1. 算术运算\n");
        printf("2. 位运算演示\n");
        printf("3. 逻辑与关系运算\n");
        printf("4. 复合赋值演示\n");
        printf("5. 条件运算符演示\n");
        printf("0. 退出\n");
        printf("请选择: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: {
                double a, b;
                char op;
                printf("输入表达式(如 2+3): ");
                scanf("%lf %c %lf", &a, &op, &b);
                switch (op) {
                    case '+': printf("%.2f + %.2f = %.2f\n", a, b, a + b); break;
                    case '-': printf("%.2f - %.2f = %.2f\n", a, b, a - b); break;
                    case '*': printf("%.2f * %.2f = %.2f\n", a, b, a * b); break;
                    case '/':
                        if (b == 0) printf("除零错误\n");
                        else printf("%.2f / %.2f = %.2f\n", a, b, a / b);
                        break;
                    case '%':
                        printf("%.0f %% %.0f = %.0f\n", a, b, fmod(a, b));
                        break;
                    case '^':
                        printf("%.2f ^ %.2f = %.2f\n", a, b, pow(a, b));
                        break;
                }
                break;
            }
            case 2: bitwise_demo(); break;
            case 3: logic_demo(); break;
            case 4: {
                int x;
                printf("输入初始值: ");
                scanf("%d", &x);
                printf("x += 5 → %d\n", x += 5);
                printf("x -= 3 → %d\n", x -= 3);
                printf("x *= 2 → %d\n", x *= 2);
                printf("x /= 4 → %d\n", x /= 4);
                printf("x %%= 3 → %d\n", x %= 3);
                break;
            }
            case 5: {
                int score;
                printf("输入分数: ");
                scanf("%d", &score);
                printf("等级: %s\n",
                       (score >= 90) ? "A" :
                       (score >= 80) ? "B" :
                       (score >= 70) ? "C" :
                       (score >= 60) ? "D" : "F");
                break;
            }
            case 0: running = false; break;
            default: printf("无效选择\n");
        }
    }

    printf("感谢使用！\n");
    return 0;
}
```

---

## 本章小结

本章全面解析了C语言的运算符体系：

1. **算术运算符**：加减乘除取模，整数除法与浮点除法的区别，取模的符号规则
2. **自增自减**：前缀与后缀的语义差异，未定义行为警告
3. **复合赋值**：+=、-=、*=、/=、%= 及位运算版本
4. **关系运算符**：==、!=、>、<、>=、<=，链式比较陷阱
5. **逻辑运算符**：&&、||、!，短路求值机制
6. **条件运算符**：?: 三元运算符，嵌套使用
7. **位运算符**：&、|、^、~、<<、>>，实用技巧
8. **sizeof**：编译时运算符，数组与指针的区别
9. **优先级**：完整优先级表，常见陷阱

建议在理解每个运算符的基础上，多编写代码验证实际行为。
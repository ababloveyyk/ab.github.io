---
title: C语言流程控制Ⅳ
date: 2026-07-26
tags:
  - C语言
  - while
  - do-while
  - 循环
  - 输入验证
categories:
  - C语言
---

# C语言流程控制Ⅳ——while与do-while循环

## 一、引言

while和do-while是C语言中最基础的循环结构。while循环在每次迭代前检查条件（先判断后执行），而do-while至少执行一次循环体（先执行后判断）。本章将深入剖析这两种循环的语法、语义、适用场景，并通过大量实际案例展示其强大之处。

---

## 二、while循环基础

### 2.1 基本语法

```c
#include <stdio.h>

int main() {
    printf("========== while 基本语法 ==========\n\n");

    // 基本计数循环
    int i = 0;
    printf("【基本计数】\n");
    while (i < 5) {
        printf("i = %d\n", i);
        i++;
    }

    // while 与 for 的等价关系
    printf("\n【while 与 for 的等价关系】\n");
    printf("for(init; cond; iter) { body }\n");
    printf("等价于:\n");
    printf("init;\n");
    printf("while(cond) { body; iter; }\n\n");

    // 演示等价性
    printf("for版本: ");
    for (int j = 0; j < 5; j++) printf("%d ", j);
    printf("\n");

    printf("while版本: ");
    int j = 0;
    while (j < 5) {
        printf("%d ", j);
        j++;
    }
    printf("\n");

    return 0;
}
```

### 2.2 无限循环

```c
#include <stdio.h>

int main() {
    printf("========== 无限循环 ==========\n\n");

    // while无限循环
    printf("【while(1) 无限循环】\n");
    int count = 0;
    while (1) {
        printf("%d ", count);
        count++;
        if (count >= 10) {
            printf("\n达到10次，退出\n");
            break;
        }
    }

    // 用while(1)实现菜单循环
    printf("\n【菜单循环模式】\n");
    int choice;
    while (1) {
        printf("\n1. 选项A  2. 选项B  0. 退出\n");
        printf("请选择: ");
        scanf("%d", &choice);
        if (choice == 0) {
            printf("退出程序\n");
            break;
        }
        switch (choice) {
            case 1: printf("执行A\n"); break;
            case 2: printf("执行B\n"); break;
            default: printf("无效选择\n"); break;
        }
    }

    return 0;
}
```

### 2.3 while 读取文件

```c
#include <stdio.h>

int main() {
    printf("========== while 读取文件 ==========\n\n");

    // 创建测试文件
    FILE* fp = fopen("while_test.txt", "w");
    for (int i = 1; i <= 10; i++) {
        fprintf(fp, "第%d行数据\n", i);
    }
    fclose(fp);

    // 逐行读取
    printf("【逐行读取文件】\n");
    fp = fopen("while_test.txt", "r");
    char line[256];
    int line_num = 0;

    while (fgets(line, sizeof(line), fp) != NULL) {
        line_num++;
        printf("第%d行: %s", line_num, line);
    }
    fclose(fp);
    printf("共读取 %d 行\n", line_num);

    // 逐个字符读取
    printf("\n【逐个字符读取】\n");
    fp = fopen("while_test.txt", "r");
    int ch;
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }
    fclose(fp);

    return 0;
}
```

---

## 三、do-while 循环

### 3.1 基本语法

```c
#include <stdio.h>

int main() {
    printf("========== do-while 基本语法 ==========\n\n");

    // do-while：至少执行一次
    printf("【do-while 至少执行一次】\n");
    int i = 10;
    do {
        printf("i = %d (即使条件为假，也会执行一次)\n", i);
        i++;
    } while (i < 5);

    // 对比while
    printf("\n【while 一次都不执行】\n");
    i = 10;
    while (i < 5) {
        printf("这行不会输出\n");
    }
    printf("while循环体没有执行\n");

    return 0;
}
```

### 3.2 do-while 典型应用

```c
#include <stdio.h>
#include <ctype.h>

int main() {
    printf("========== do-while 典型应用 ==========\n\n");

    // 1. 输入验证（至少要求输入一次）
    int age;
    printf("【输入验证】\n");
    do {
        printf("请输入年龄(1-150): ");
        scanf("%d", &age);
        while (getchar() != '\n');
        if (age < 1 || age > 150) {
            printf("年龄无效，请重新输入\n");
        }
    } while (age < 1 || age > 150);
    printf("年龄有效: %d\n\n", age);

    // 2. 确认操作
    printf("【确认操作】\n");
    char confirm;
    do {
        printf("确认删除? (y/n): ");
        scanf("%c", &confirm);
        while (getchar() != '\n');
        confirm = tolower(confirm);
    } while (confirm != 'y' && confirm != 'n');

    if (confirm == 'y') {
        printf("已删除\n");
    } else {
        printf("已取消\n");
    }

    // 3. 游戏重新开始
    printf("\n【游戏循环】\n");
    char play_again;
    do {
        int secret = 7;  // 简化
        int guess;
        printf("猜数字(1-10): ");
        scanf("%d", &guess);
        if (guess == secret) {
            printf("猜对了！\n");
        } else {
            printf("猜错了，答案是%d\n", secret);
        }

        printf("再玩一次? (y/n): ");
        scanf(" %c", &play_again);
        play_again = tolower(play_again);
    } while (play_again == 'y');
    printf("游戏结束\n");

    return 0;
}
```

### 3.3 do-while 宏技巧

```c
#include <stdio.h>

// 使用do-while(0)包裹多语句宏
#define SWAP(a, b) do { \
    typeof(a) _temp = (a); \
    (a) = (b); \
    (b) = _temp; \
} while(0)

#define SAFE_FREE(ptr) do { \
    if (ptr) { \
        free(ptr); \
        (ptr) = NULL; \
    } \
} while(0)

int main() {
    printf("========== do-while(0) 宏技巧 ==========\n\n");

    printf("do-while(0)宏的优点：\n");
    printf("1. 宏展开后是一个完整的语句（需要分号）\n");
    printf("2. 在if-else中使用不会出错\n");
    printf("3. 可以有自己的局部变量\n\n");

    int x = 5, y = 10;
    printf("交换前: x = %d, y = %d\n", x, y);
    SWAP(x, y);
    printf("交换后: x = %d, y = %d\n", x, y);

    // 演示在if-else中使用
    if (x > 0)
        SWAP(x, y);  // 注意这里有分号
    else
        printf("x <= 0\n");

    printf("再次交换后: x = %d, y = %d\n", x, y);

    return 0;
}
```

---

## 四、循环中的算法应用

### 4.1 辗转相除法求最大公约数

```c
#include <stdio.h>

// 辗转相除法（欧几里得算法）
int gcd_while(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 递归版本
int gcd_recursive(int a, int b) {
    return (b == 0) ? a : gcd_recursive(b, a % b);
}

// 更相减损术（原始版本）
int gcd_subtract(int a, int b) {
    while (a != b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    return a;
}

int main() {
    printf("========== 最大公约数算法 ==========\n\n");

    int test_pairs[][2] = {
        {12, 18}, {48, 36}, {100, 75}, {17, 23}, {270, 192}
    };

    printf("%-12s %-12s %-12s %-12s\n",
           "a", "b", "辗转相除", "更相减损");
    printf("--------------------------------------------\n");

    for (int i = 0; i < 5; i++) {
        int a = test_pairs[i][0];
        int b = test_pairs[i][1];
        printf("%-12d %-12d %-12d %-12d\n",
               a, b, gcd_while(a, b), gcd_subtract(a, b));
    }

    // 最小公倍数
    printf("\n【最小公倍数 LCM = a * b / GCD】\n");
    int a = 12, b = 18;
    int lcm = a * b / gcd_while(a, b);
    printf("LCM(%d, %d) = %d\n", a, b, lcm);

    return 0;
}
```

### 4.2 素数判断与筛法

```c
#include <stdio.h>
#include <stdbool.h>
#include <math.h>

// 判断是否为素数
bool is_prime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    int sqrt_n = (int)sqrt(n);
    int i = 5;
    while (i <= sqrt_n) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
        i += 6;
    }
    return true;
}

// 埃拉托斯特尼筛法
void sieve_of_eratosthenes(int n) {
    bool* is_prime_arr = (bool*)malloc((n + 1) * sizeof(bool));
    for (int i = 0; i <= n; i++) is_prime_arr[i] = true;

    is_prime_arr[0] = is_prime_arr[1] = false;

    int sqrt_n = (int)sqrt(n);
    int p = 2;
    while (p <= sqrt_n) {
        if (is_prime_arr[p]) {
            int multiple = p * p;
            while (multiple <= n) {
                is_prime_arr[multiple] = false;
                multiple += p;
            }
        }
        p++;
    }

    printf("1到%d的素数: ", n);
    int count = 0;
    int i = 2;
    while (i <= n) {
        if (is_prime_arr[i]) {
            printf("%d ", i);
            count++;
        }
        i++;
    }
    printf("\n共%d个素数\n", count);

    free(is_prime_arr);
}

int main() {
    printf("========== 素数相关算法 ==========\n\n");

    // 判断单个素数
    printf("【判断素数】\n");
    int test_nums[] = {2, 3, 4, 17, 25, 97, 100};
    for (int i = 0; i < 7; i++) {
        printf("%d %s素数\n", test_nums[i],
               is_prime(test_nums[i]) ? "是" : "不是");
    }

    printf("\n");
    sieve_of_eratosthenes(100);

    return 0;
}
```

### 4.3 数字反转与回文判断

```c
#include <stdio.h>
#include <stdbool.h>

// 反转数字
int reverse_number(int n) {
    int reversed = 0;
    int temp = n;
    while (temp > 0) {
        reversed = reversed * 10 + temp % 10;
        temp /= 10;
    }
    return reversed;
}

// 判断回文数
bool is_palindrome(int n) {
    return n == reverse_number(n);
}

// 判断回文字符串
bool is_palindrome_str(const char* str) {
    int left = 0;
    int right = strlen(str) - 1;
    while (left < right) {
        if (str[left] != str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

int main() {
    printf("========== 数字反转与回文判断 ==========\n\n");

    // 数字反转
    printf("【数字反转】\n");
    int nums[] = {123, 4567, 100, 987654321};
    for (int i = 0; i < 4; i++) {
        printf("reverse(%d) = %d\n", nums[i], reverse_number(nums[i]));
    }

    // 回文数
    printf("\n【回文数】\n");
    int pals[] = {121, 12321, 123, 123454321};
    for (int i = 0; i < 4; i++) {
        printf("%d %s回文数\n", pals[i],
               is_palindrome(pals[i]) ? "是" : "不是");
    }

    // 回文字符串
    printf("\n【回文字符串】\n");
    const char* strings[] = {"racecar", "hello", "level", "world"};
    for (int i = 0; i < 4; i++) {
        printf("\"%s\" %s回文\n", strings[i],
               is_palindrome_str(strings[i]) ? "是" : "不是");
    }

    return 0;
}
```

---

## 五、循环优化与陷阱

### 5.1 循环条件中的函数调用

```c
#include <stdio.h>
#include <string.h>
#include <time.h>

int main() {
    printf("========== 循环优化陷阱 ==========\n\n");

    char str[] = "Hello, World! This is a test string.";
    int len = strlen(str);

    // 低效：每次循环都调用strlen
    printf("【低效：每次循环调用strlen】\n");
    clock_t start = clock();
    for (int i = 0; i < 10000000; i++) {
        for (int j = 0; j < strlen(str); j++) {
            // 空操作
            volatile char c = str[j];
        }
    }
    clock_t end = clock();
    printf("耗时: %.3f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    // 高效：提前计算长度
    printf("【高效：提前计算长度】\n");
    start = clock();
    for (int i = 0; i < 10000000; i++) {
        for (int j = 0; j < len; j++) {
            volatile char c = str[j];
        }
    }
    end = clock();
    printf("耗时: %.3f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    return 0;
}
```

### 5.2 空循环体陷阱

```c
#include <stdio.h>

int main() {
    printf("========== 循环陷阱 ==========\n\n");

    // 陷阱1：while后多余的分号
    printf("【陷阱1: while后多余的分号】\n");
    int i = 0;
    while (i < 5);  // 分号创建了空循环体！
    {
        printf("这行只执行一次，不是循环体\n");
        i++;
    }

    // 陷阱2：用逗号代替分号
    printf("\n【陷阱2: 意外的逗号】\n");
    int j = 0, k = 0;
    while (j < 5)
        printf("%d ", j),
        j++, k++;  // 逗号让j++和k++成为循环体
    printf("\nk = %d\n", k);

    // 陷阱3：浮点数循环条件
    printf("\n【陷阱3: 浮点数循环条件】\n");
    float f = 0.0f;
    int count = 0;
    while (f != 1.0f && count < 20) {
        printf("f = %.10f\n", f);
        f += 0.1f;
        count++;
    }
    printf("f != 1.0 永远为真（浮点精度问题）\n");
    printf("正确做法: 使用整数计数器或容差比较\n");

    return 0;
}
```

---

## 六、综合实战：猜数字游戏

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    printf("========== 猜数字游戏 ==========\n\n");

    srand(time(NULL));
    int play_again;

    do {
        int secret = rand() % 100 + 1;
        int guess;
        int attempts = 0;
        int low = 1, high = 100;

        printf("我想了一个1-100之间的数字，你猜猜看！\n\n");

        while (1) {
            printf("范围[%d, %d]，请输入你的猜测: ", low, high);
            scanf("%d", &guess);
            attempts++;

            if (guess == secret) {
                printf("恭喜！你猜对了！答案是 %d\n", secret);
                printf("你用了 %d 次猜测\n", attempts);

                if (attempts <= 5) {
                    printf("评价: 天才！\n");
                } else if (attempts <= 10) {
                    printf("评价: 不错！\n");
                } else {
                    printf("评价: 下次加油！\n");
                }
                break;
            } else if (guess < secret) {
                printf("太小了！\n");
                if (guess > low) low = guess + 1;
            } else {
                printf("太大了！\n");
                if (guess < high) high = guess - 1;
            }
        }

        printf("\n再玩一次? (1=是, 0=否): ");
        scanf("%d", &play_again);
    } while (play_again == 1);

    printf("感谢游玩，再见！\n");
    return 0;
}
```

---

## 本章小结

本章深入剖析了while和do-while循环：

1. **while基础**：语法、for等价关系、无限循环、文件读取
2. **do-while**：至少执行一次的特性、输入验证、确认操作、游戏循环、do-while(0)宏技巧
3. **算法应用**：辗转相除法、素数判断与筛法、数字反转与回文判断
4. **优化陷阱**：循环条件中的函数调用、空循环体、浮点条件
5. **综合实战**：猜数字游戏

while循环适用于"先判断后执行"的场景，do-while适用于"至少执行一次"的场景。选择正确的循环结构能让代码更清晰、更健壮。
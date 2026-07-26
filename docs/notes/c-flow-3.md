---
title: C语言流程控制Ⅲ
date: 2026-07-26
tags:
  - C语言
  - for循环
  - 嵌套循环
  - 循环优化
categories:
  - C语言
---

# C语言流程控制Ⅲ——for循环完全指南

## 一、引言

for循环是C语言中最强大、最灵活的循环结构。它的三个表达式（初始化、条件、迭代表达式）可以任意组合，甚至全部省略，使得for循环能表达从简单计数到复杂迭代的所有循环模式。本章将深入剖析for循环的每个细节，包括嵌套循环、循环优化、以及各种实际应用场景。

---

## 二、for循环基本结构

### 2.1 标准for循环

```c
#include <stdio.h>

int main() {
    printf("========== 标准for循环 ==========\n\n");

    // 基本结构：for(初始化; 条件; 迭代) { 循环体 }
    printf("【基本计数循环】\n");
    for (int i = 0; i < 5; i++) {
        printf("i = %d\n", i);
    }

    // 循环变量的作用域
    printf("\n【循环变量作用域】\n");
    for (int i = 0; i < 3; i++) {
        printf("内层 i = %d\n", i);
    }
    // printf("%d", i);  // C99: i不可见，C89: i可见

    // 多个循环变量
    printf("\n【多个循环变量】\n");
    for (int i = 0, j = 10; i < j; i++, j--) {
        printf("i = %d, j = %d\n", i, j);
    }

    return 0;
}
```

### 2.2 for循环的九种变体

```c
#include <stdio.h>

int main() {
    printf("========== for循环的九种变体 ==========\n\n");

    // 1. 标准递增
    printf("1. 标准递增: ");
    for (int i = 0; i < 5; i++) printf("%d ", i);
    printf("\n");

    // 2. 递减
    printf("2. 递减:     ");
    for (int i = 5; i > 0; i--) printf("%d ", i);
    printf("\n");

    // 3. 步长不为1
    printf("3. 步长2:    ");
    for (int i = 0; i < 10; i += 2) printf("%d ", i);
    printf("\n");

    // 4. 省略初始化
    printf("4. 省略初始化: ");
    int i = 3;
    for (; i < 8; i++) printf("%d ", i);
    printf("\n");

    // 5. 省略条件（无限循环）
    printf("5. 省略条件(无限循环): ");
    int count = 0;
    for (;;) {
        printf("%d ", count++);
        if (count >= 5) break;
    }
    printf("\n");

    // 6. 省略迭代表达式
    printf("6. 省略迭代: ");
    for (int j = 0; j < 5;) {
        printf("%d ", j);
        j += 2;
    }
    printf("\n");

    // 7. 全部省略（无限循环）
    printf("7. 全部省略: 等同于 while(1)\n");

    // 8. 逗号表达式
    printf("8. 逗号表达式: ");
    for (int a = 0, b = 10; a < 5; a++, b -= 2) {
        printf("(%d,%d) ", a, b);
    }
    printf("\n");

    // 9. 浮点循环变量
    printf("9. 浮点循环: ");
    for (double d = 0.0; d <= 1.0; d += 0.25) {
        printf("%.2f ", d);
    }
    printf("\n(注意：浮点循环有精度问题)\n");

    return 0;
}
```

### 2.3 for循环执行流程

```c
#include <stdio.h>

int main() {
    printf("========== for循环执行流程 ==========\n\n");

    printf("执行顺序：\n");
    printf("1. 初始化表达式 (只执行一次)\n");
    printf("2. 条件表达式   (每次循环前检查)\n");
    printf("3. 循环体       (条件为真时执行)\n");
    printf("4. 迭代表达式   (每次循环体执行后)\n");
    printf("5. 回到步骤2\n\n");

    printf("【流程追踪】\n");
    for (int i = 0; i < 3; i++) {
        printf("  循环体执行: i = %d\n", i);
    }

    printf("\n【最后一次条件检查】\n");
    int count = 0;
    for (int i = 0; i < 3; i++) {
        count++;
        printf("  迭代%d: i = %d\n", count, i);
    }
    printf("退出循环后，count = %d\n", count);

    return 0;
}
```

---

## 三、嵌套循环

### 3.1 基本嵌套

```c
#include <stdio.h>

int main() {
    printf("========== 嵌套循环 ==========\n\n");

    // 基本嵌套
    printf("【2层嵌套】\n");
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("(%d,%d) ", i, j);
        }
        printf("\n");
    }

    // 打印乘法表
    printf("\n【九九乘法表】\n");
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d×%d=%-2d ", j, i, i * j);
        }
        printf("\n");
    }

    // 打印坐标系
    printf("\n【坐标系(10x10)】\n");
    printf("   ");
    for (int x = 0; x < 10; x++) printf("%2d ", x);
    printf("\n");
    for (int y = 9; y >= 0; y--) {
        printf("%2d ", y);
        for (int x = 0; x < 10; x++) {
            if (x == y) printf(" ● ");
            else printf(" · ");
        }
        printf("\n");
    }

    return 0;
}
```

### 3.2 嵌套循环的复杂度分析

```c
#include <stdio.h>
#include <time.h>

int main() {
    printf("========== 嵌套循环复杂度分析 ==========\n\n");

    const int N = 1000;
    clock_t start, end;

    // O(n²) - 2层嵌套
    printf("【O(n²) 双层循环】\n");
    start = clock();
    long long count2 = 0;
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            count2++;
        }
    }
    end = clock();
    printf("迭代次数: %lld, 耗时: %.3f秒\n",
           count2, (double)(end - start) / CLOCKS_PER_SEC);

    // O(n³) - 3层嵌套
    printf("\n【O(n³) 三层循环】\n");
    const int M = 100;  // 减小规模
    start = clock();
    long long count3 = 0;
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < M; j++) {
            for (int k = 0; k < M; k++) {
                count3++;
            }
        }
    }
    end = clock();
    printf("迭代次数: %lld, 耗时: %.3f秒\n",
           count3, (double)(end - start) / CLOCKS_PER_SEC);

    printf("\n【结论】\n");
    printf("嵌套层数每增加1层，时间复杂度乘以N\n");
    printf("应尽量避免超过3层的嵌套循环\n");

    return 0;
}
```

### 3.3 嵌套循环优化

```c
#include <stdio.h>
#include <time.h>

#define N 2000

int main() {
    printf("========== 嵌套循环优化 ==========\n\n");
    clock_t start, end;

    int arr[N][N];

    // 缓存友好的访问（按行遍历）
    printf("【按行遍历 (缓存友好)】\n");
    start = clock();
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            arr[i][j] = i + j;
        }
    }
    end = clock();
    printf("耗时: %.3f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    // 缓存不友好的访问（按列遍历）
    printf("【按列遍历 (缓存不友好)】\n");
    start = clock();
    for (int j = 0; j < N; j++) {
        for (int i = 0; i < N; i++) {
            arr[i][j] = i + j;
        }
    }
    end = clock();
    printf("耗时: %.3f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    printf("\n解释: C语言中二维数组是行优先存储的\n");
    printf("按行遍历利用CPU缓存，按列遍历导致缓存频繁失效\n");

    return 0;
}
```

---

## 四、循环控制语句

### 4.1 break 语句

```c
#include <stdio.h>

int main() {
    printf("========== break 语句 ==========\n\n");

    // 在for循环中使用break
    printf("【在for中使用break】\n");
    for (int i = 0; i < 10; i++) {
        if (i == 5) {
            printf("遇到break，i = %d\n", i);
            break;  // 立即退出循环
        }
        printf("i = %d\n", i);
    }

    // 在嵌套循环中使用break
    printf("\n【嵌套循环中的break】\n");
    printf("break只退出最内层循环：\n");
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            if (i == 2 && j == 2) {
                printf("在(%d,%d)处break\n", i, j);
                break;
            }
            printf("(%d,%d) ", i, j);
        }
        printf("\n");
    }

    // 查找第一个满足条件的元素
    printf("\n【查找第一个负数】\n");
    int arr[] = {1, 3, 5, -2, 7, 9, -4, 6};
    int len = sizeof(arr) / sizeof(arr[0]);
    int found_index = -1;

    for (int i = 0; i < len; i++) {
        if (arr[i] < 0) {
            found_index = i;
            break;
        }
    }

    if (found_index != -1) {
        printf("第一个负数在索引%d: arr[%d] = %d\n",
               found_index, found_index, arr[found_index]);
    }

    return 0;
}
```

### 4.2 continue 语句

```c
#include <stdio.h>

int main() {
    printf("========== continue 语句 ==========\n\n");

    // 跳过偶数
    printf("【跳过偶数】\n");
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            continue;  // 跳过本次循环的剩余部分
        }
        printf("%d ", i);
    }
    printf("\n");

    // 跳过负数
    printf("\n【处理正数，跳过负数】\n");
    int data[] = {5, -3, 8, -1, 0, 7, -6, 4};
    int len = sizeof(data) / sizeof(data[0]);
    int sum = 0, count = 0;

    for (int i = 0; i < len; i++) {
        if (data[i] <= 0) {
            continue;  // 跳过非正数
        }
        sum += data[i];
        count++;
    }

    printf("正数个数: %d, 正数和: %d\n", count, sum);

    // continue 在嵌套循环中
    printf("\n【嵌套循环中的continue】\n");
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            if (i == j) {
                continue;  // 跳过对角线
            }
            printf("(%d,%d) ", i, j);
        }
        printf("\n");
    }

    return 0;
}
```

### 4.3 goto 语句

```c
#include <stdio.h>

int main() {
    printf("========== goto 语句 ==========\n\n");

    printf("goto 可以跳转到同一函数内的标签处\n\n");

    // goto 的基本用法
    int i = 0;
    printf("【基本goto】\n");

    start:
    printf("i = %d\n", i);
    i++;
    if (i < 3) {
        goto start;
    }

    // goto 跳出多层循环
    printf("\n【goto跳出多层循环】\n");
    for (int x = 0; x < 3; x++) {
        for (int y = 0; y < 3; y++) {
            for (int z = 0; z < 3; z++) {
                if (x == 1 && y == 1 && z == 1) {
                    printf("在(%d,%d,%d)处跳出所有循环\n", x, y, z);
                    goto exit_all;
                }
                printf("(%d,%d,%d) ", x, y, z);
            }
        }
    }
    exit_all:
    printf("\n已跳出所有循环\n");

    // goto 的错误处理模式
    printf("\n【goto错误处理模式】\n");
    FILE* fp = NULL;
    int* buffer = NULL;

    fp = fopen("test.txt", "r");
    if (fp == NULL) {
        printf("文件打开失败\n");
        goto cleanup;
    }

    buffer = (int*)malloc(100 * sizeof(int));
    if (buffer == NULL) {
        printf("内存分配失败\n");
        goto cleanup;
    }

    printf("资源分配成功，开始处理...\n");

    cleanup:
    if (buffer != NULL) free(buffer);
    if (fp != NULL) fclose(fp);
    printf("资源已清理\n");

    printf("\n【goto使用建议】\n");
    printf("1. 避免使用goto，除非有充分理由\n");
    printf("2. 跳出多层嵌套时goto比标志变量更清晰\n");
    printf("3. 错误处理中使用goto做统一清理\n");
    printf("4. 永远不要向后跳转（会产生意大利面条代码）\n");

    return 0;
}
```

---

## 五、循环优化技巧

### 5.1 循环展开

```c
#include <stdio.h>
#include <time.h>

#define N 100000000

int main() {
    printf("========== 循环优化技巧 ==========\n\n");
    clock_t start, end;
    volatile long long sum;

    // 普通循环
    printf("【普通循环】\n");
    start = clock();
    sum = 0;
    for (int i = 0; i < N; i++) {
        sum += i;
    }
    end = clock();
    printf("耗时: %.3f秒, sum = %lld\n",
           (double)(end - start) / CLOCKS_PER_SEC, sum);

    // 循环展开（手动）
    printf("\n【循环展开4倍】\n");
    start = clock();
    sum = 0;
    int i;
    for (i = 0; i <= N - 4; i += 4) {
        sum += i;
        sum += i + 1;
        sum += i + 2;
        sum += i + 3;
    }
    for (; i < N; i++) {
        sum += i;
    }
    end = clock();
    printf("耗时: %.3f秒, sum = %lld\n",
           (double)(end - start) / CLOCKS_PER_SEC, sum);

    // 减少循环体内的计算
    printf("\n【减少循环体内计算】\n");
    int arr[N];

    // 低效：每次循环都计算sizeof
    start = clock();
    for (int i = 0; i < sizeof(arr) / sizeof(arr[0]); i++) {
        arr[i] = i;
    }
    end = clock();
    printf("每次计算长度: %.3f秒\n",
           (double)(end - start) / CLOCKS_PER_SEC);

    // 高效：提前计算长度
    int len = sizeof(arr) / sizeof(arr[0]);
    start = clock();
    for (int i = 0; i < len; i++) {
        arr[i] = i;
    }
    end = clock();
    printf("提前计算长度: %.3f秒\n",
           (double)(end - start) / CLOCKS_PER_SEC);

    return 0;
}
```

### 5.2 循环不变量外提

```c
#include <stdio.h>
#include <time.h>
#include <math.h>

#define SIZE 10000

int main() {
    printf("========== 循环不变量外提 ==========\n\n");
    clock_t start, end;
    volatile double result;
    double arr[SIZE];

    for (int i = 0; i < SIZE; i++) arr[i] = i + 1;

    // 未优化：循环内重复计算
    printf("【循环内重复计算】\n");
    start = clock();
    result = 0;
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            result += arr[i] * sqrt(arr[j]) * 2.0;
        }
    }
    end = clock();
    printf("耗时: %.3f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    // 优化后：外提不变量
    printf("【外提不变量】\n");
    start = clock();
    result = 0;
    for (int i = 0; i < SIZE; i++) {
        double ai2 = arr[i] * 2.0;  // 外提
        for (int j = 0; j < SIZE; j++) {
            result += ai2 * sqrt(arr[j]);
        }
    }
    end = clock();
    printf("耗时: %.3f秒\n", (double)(end - start) / CLOCKS_PER_SEC);

    return 0;
}
```

---

## 六、循环综合实战

### 6.1 水仙花数

```c
#include <stdio.h>
#include <math.h>

int main() {
    printf("========== 水仙花数 ==========\n\n");

    printf("水仙花数：一个n位数，各位数字的n次方之和等于该数本身\n\n");

    // 三位水仙花数
    printf("【三位水仙花数】\n");
    int count = 0;
    for (int num = 100; num <= 999; num++) {
        int a = num / 100;       // 百位
        int b = (num / 10) % 10; // 十位
        int c = num % 10;        // 个位

        if (a * a * a + b * b * b + c * c * c == num) {
            printf("%d = %d³ + %d³ + %d³\n", num, a, b, c);
            count++;
        }
    }
    printf("共找到 %d 个三位水仙花数\n\n", count);

    // 通用水仙花数（3-7位）
    printf("【3-7位水仙花数】\n");
    for (int num = 100; num <= 9999999; num++) {
        int temp = num;
        int digits = 0;

        // 计算位数
        int t = num;
        while (t > 0) {
            digits++;
            t /= 10;
        }

        // 计算各位数字的digits次方之和
        int sum = 0;
        t = num;
        while (t > 0) {
            int digit = t % 10;
            sum += (int)pow(digit, digits);
            t /= 10;
        }

        if (sum == num) {
            printf("%d\n", num);
        }
    }

    return 0;
}
```

### 6.2 打印各种图形

```c
#include <stdio.h>

int main() {
    printf("========== 打印各种图形 ==========\n\n");
    int n = 7;

    // 1. 金字塔
    printf("【金字塔】\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("* ");
        printf("\n");
    }

    // 2. 倒金字塔
    printf("\n【倒金字塔】\n");
    for (int i = n; i >= 1; i--) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("* ");
        printf("\n");
    }

    // 3. 菱形
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

    // 4. 数字金字塔
    printf("\n【数字金字塔】\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= i; j++) printf("%d ", j);
        for (int j = i - 1; j >= 1; j--) printf("%d ", j);
        printf("\n");
    }

    // 5. 空心菱形
    printf("\n【空心菱形】\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) {
            if (j == 1 || j == 2 * i - 1) printf("* ");
            else printf("  ");
        }
        printf("\n");
    }
    for (int i = n - 1; i >= 1; i--) {
        for (int j = 1; j <= n - i; j++) printf("  ");
        for (int j = 1; j <= 2 * i - 1; j++) {
            if (j == 1 || j == 2 * i - 1) printf("* ");
            else printf("  ");
        }
        printf("\n");
    }

    return 0;
}
```

---

## 本章小结

本章深入剖析了for循环的各种用法：

1. **基本结构**：初始化、条件、迭代表达式，执行顺序
2. **九种变体**：递减、跳步、省略表达式、逗号表达式、浮点循环
3. **嵌套循环**：基本嵌套、复杂度分析、缓存优化
4. **循环控制**：break、continue、goto的适用场景
5. **优化技巧**：循环展开、不变量外提、缓存友好访问
6. **综合实战**：水仙花数、打印各种图形

for循环是C语言中最灵活的循环结构，掌握其各种变体和优化技巧，对于写出高效的C程序至关重要。
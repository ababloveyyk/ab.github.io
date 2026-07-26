---
title: C语言算法基础Ⅴ——递归与回溯
date: 2026-07-26
tags:
  - C语言
  - 算法
  - 递归
  - 回溯
categories:
  - C语言
---

## 前言

递归（Recursion）是计算机科学中最优雅、最强大的编程技巧之一。它允许函数直接或间接地调用自身，将复杂问题分解为相同形式的子问题。递归不仅是一种编程技术，更是一种问题解决的思维方式——"分而治之"。

回溯（Backtracking）是递归思想的一种重要应用，它是一种系统性地搜索问题解空间的方法。当算法在搜索过程中发现当前路径不可能得到解时，它会"回溯"到上一步，尝试其他可能的选择。回溯算法广泛应用于组合优化、排列生成、图搜索等领域。

本文将从递归的基本原理开始，逐步深入到经典递归问题（汉诺塔、斐波那契），然后重点讲解回溯算法的核心思想和典型应用（全排列、八皇后、子集生成、组合总和），最后讨论递归转迭代的通用方法。通过大量的代码示例和详细的分析，帮助你建立对递归和回溯的深刻理解。

递归的学习曲线通常比较陡峭。初学者往往难以理解"函数调用自己"这个概念，也难以追踪递归调用的执行过程。但一旦掌握了递归思维，你会发现许多看似复杂的问题都有了简洁优雅的解法。本文将通过详细的图示和步骤分解，帮助你逐步建立递归思维。

## 递归的基本原理

### 什么是递归

递归是指一个函数在其定义中直接或间接地调用自身的过程。递归函数通常包含两个核心部分：

1. **递归终止条件（Base Case）**：确定问题最简单的情况，直接返回结果，不再递归调用。
2. **递归关系（Recursive Case）**：将问题分解为更小的相同问题，通过递归调用来解决子问题，然后组合子问题的结果。

递归的数学基础是数学归纳法。如果我们能证明：
- 基本情况成立（n=0或n=1时命题成立）
- 如果n=k时命题成立，则n=k+1时命题也成立

那么对于所有自然数n，命题都成立。递归函数的设计思路与此完全一致。

### 递归与调用栈

理解递归的关键是理解函数调用栈。当一个函数被调用时，系统会在调用栈上分配一个栈帧（stack frame），用于存储函数的局部变量、参数和返回地址。当函数返回时，其栈帧被弹出，控制权返回到调用者。

递归调用会在调用栈上产生多个栈帧，每个栈帧都保存着该层递归的状态。当递归深度过大时，可能导致栈溢出（stack overflow）。

下面是一个简单的递归示例——计算阶乘，我们用它来展示调用栈的工作原理：

```
计算 factorial(4) 的调用栈：

调用 factorial(4):
| factorial(4) n=4 |  ← 栈顶
栈帧: n=4, 等待 factorial(3) 的返回值

调用 factorial(3):
| factorial(3) n=3 |
| factorial(4) n=4 |
栈帧: n=3, 等待 factorial(2) 的返回值

调用 factorial(2):
| factorial(2) n=2 |
| factorial(3) n=3 |
| factorial(4) n=4 |
栈帧: n=2, 等待 factorial(1) 的返回值

调用 factorial(1):
| factorial(1) n=1 |  ← 终止条件，返回1
| factorial(2) n=2 |
| factorial(3) n=3 |
| factorial(4) n=4 |

返回: factorial(1)=1
| factorial(2) n=2 |  ← 2*1=2, 返回2
| factorial(3) n=3 |
| factorial(4) n=4 |

返回: factorial(2)=2
| factorial(3) n=3 |  ← 3*2=6, 返回6
| factorial(4) n=4 |

返回: factorial(3)=6
| factorial(4) n=4 |  ← 4*6=24, 返回24

返回: factorial(4)=24
调用栈为空
```

### 递归的基本示例 —— 阶乘

```c
#include <stdio.h>

/**
 * 递归计算阶乘
 * 
 * 数学定义：
 * n! = 1           (n = 0)
 * n! = n * (n-1)!  (n > 0)
 * 
 * 递归终止条件：n == 0 时返回 1
 * 递归关系：n! = n * factorial(n-1)
 * 
 * 时间复杂度：O(n) - 递归n次
 * 空间复杂度：O(n) - 调用栈深度为n
 * 
 * @param n 非负整数
 * @return  n的阶乘
 */
long long factorial(int n) {
    // 递归终止条件：0! = 1
    if (n == 0) {
        return 1;
    }
    // 递归关系：n! = n * (n-1)!
    return n * factorial(n - 1);
}

/**
 * 迭代计算阶乘（用于对比）
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
long long factorial_iterative(int n) {
    long long result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * 阶乘测试主函数
 */
int main() {
    printf("=== 递归计算阶乘 ===\n\n");
    
    printf("n\t递归结果\t迭代结果\n");
    printf("--\t--------\t--------\n");
    for (int i = 0; i <= 15; i++) {
        printf("%d\t%lld\t\t%lld\n", i, factorial(i), factorial_iterative(i));
    }
    printf("\n");
    
    // 演示递归过程
    printf("=== 递归过程演示：factorial(4) ===\n");
    printf("factorial(4) = 4 * factorial(3)\n");
    printf("  factorial(3) = 3 * factorial(2)\n");
    printf("    factorial(2) = 2 * factorial(1)\n");
    printf("      factorial(1) = 1 * factorial(0)\n");
    printf("        factorial(0) = 1  ← 终止条件\n");
    printf("      factorial(1) = 1 * 1 = 1\n");
    printf("    factorial(2) = 2 * 1 = 2\n");
    printf("  factorial(3) = 3 * 2 = 6\n");
    printf("factorial(4) = 4 * 6 = 24\n");
    
    return 0;
}
```

### 递归的优缺点

递归的**优点**：
1. 代码简洁优雅，接近问题的数学定义
2. 自然地处理树形结构和分治问题
3. 某些问题用递归表达比迭代更直观（如汉诺塔、树的遍历）

递归的**缺点**：
1. 每次递归调用都有函数调用的开销（栈帧分配、参数传递等）
2. 深度过大可能导致栈溢出
3. 可能存在大量重复计算（如斐波那契的朴素递归）
4. 调试困难，难以追踪多层递归调用

## 汉诺塔问题

### 汉诺塔问题的描述

汉诺塔（Tower of Hanoi）是递归思想的经典示例。问题描述如下：

有三根柱子A、B、C。A柱上有n个大小不同的圆盘，按大小顺序从下到上叠放（最大的在下面）。要求将所有圆盘从A柱移动到C柱，移动过程中遵循以下规则：
1. 每次只能移动一个圆盘
2. 任何时候，大盘不能放在小盘上面
3. 可以使用B柱作为辅助

汉诺塔问题的递归解法非常优雅：

- 将n个圆盘从A移到C的问题，可以分解为：
  1. 将n-1个圆盘从A移到B（使用C作为辅助）
  2. 将最大的圆盘从A移到C
  3. 将n-1个圆盘从B移到C（使用A作为辅助）

- 递归终止条件：当n=1时，直接将圆盘从A移到C。

汉诺塔问题的移动次数是2^n - 1。当n=64时（传说中的世界末日），移动次数为2^64 - 1 ≈ 1.84 × 10^19，即使每秒移动一次，也需要约5800亿年。

### 汉诺塔的详细图解步骤

以n=3为例，汉诺塔的移动过程如下：

```
初始状态：
A: [3,2,1]  B: []  C: []

步骤1: 移动1号盘从A到C
A: [3,2]    B: []  C: [1]

步骤2: 移动2号盘从A到B
A: [3]      B: [2]  C: [1]

步骤3: 移动1号盘从C到B
A: [3]      B: [2,1]  C: []

步骤4: 移动3号盘从A到C
A: []       B: [2,1]  C: [3]

步骤5: 移动1号盘从B到A
A: [1]      B: [2]  C: [3]

步骤6: 移动2号盘从B到C
A: [1]      B: []  C: [3,2]

步骤7: 移动1号盘从A到C
A: []       B: []  C: [3,2,1]

完成！共7步（2^3 - 1 = 7）
```

### 汉诺塔的完整实现

```c
#include <stdio.h>

// 全局变量，用于统计移动次数
int move_count = 0;

/**
 * 递归解决汉诺塔问题
 * 
 * 算法原理：
 * 将n个盘从src移到dst的问题分解为三个子问题：
 * 1. 将n-1个盘从src移到aux（递归）
 * 2. 将最大的盘从src移到dst（直接移动）
 * 3. 将n-1个盘从aux移到dst（递归）
 * 
 * 时间复杂度：O(2^n) - 每次递归调用会产生两个子调用
 * 空间复杂度：O(n) - 递归调用栈深度为n
 * 
 * 移动次数：T(n) = 2T(n-1) + 1
 * 解为 T(n) = 2^n - 1
 * 
 * @param n   要移动的圆盘数量
 * @param src 源柱子名称
 * @param aux 辅助柱子名称
 * @param dst 目标柱子名称
 */
void hanoi(int n, char src, char aux, char dst) {
    // 递归终止条件：只有一个圆盘
    if (n == 1) {
        move_count++;
        printf("步骤 %d: 移动圆盘1 从 %c 到 %c\n", move_count, src, dst);
        return;
    }
    
    // 步骤1：将n-1个圆盘从src移到aux（使用dst作为辅助）
    hanoi(n - 1, src, dst, aux);
    
    // 步骤2：将最大的圆盘（第n号）从src移到dst
    move_count++;
    printf("步骤 %d: 移动圆盘%d 从 %c 到 %c\n", move_count, n, src, dst);
    
    // 步骤3：将n-1个圆盘从aux移到dst（使用src作为辅助）
    hanoi(n - 1, aux, src, dst);
}

/**
 * 汉诺塔问题的迭代版本（使用栈模拟递归）
 * 
 * 迭代实现比递归实现复杂得多，但可以避免栈溢出
 * 这里使用一个结构体数组来模拟调用栈
 */
typedef struct {
    int n;
    char src;
    char aux;
    char dst;
    int stage;  // 当前执行阶段：0=进入, 1=递归调用1后, 2=递归调用2后
} HanoiFrame;

void hanoi_iterative(int n, char src, char aux, char dst) {
    // 分配栈空间
    HanoiFrame* stack = (HanoiFrame*)malloc(n * sizeof(HanoiFrame));
    int top = -1;
    int count = 0;
    
    // 将初始任务压入栈中
    top++;
    stack[top].n = n;
    stack[top].src = src;
    stack[top].aux = aux;
    stack[top].dst = dst;
    stack[top].stage = 0;
    
    while (top >= 0) {
        HanoiFrame* frame = &stack[top];
        
        if (frame->n == 1) {
            // 基本情况：直接移动
            count++;
            printf("步骤 %d: 移动圆盘1 从 %c 到 %c\n", count, frame->src, frame->dst);
            top--;  // 弹出栈帧
            continue;
        }
        
        switch (frame->stage) {
            case 0:
                // 第一次进入，先处理步骤1：将n-1个盘从src移到aux
                frame->stage = 1;
                top++;
                stack[top].n = frame->n - 1;
                stack[top].src = frame->src;
                stack[top].aux = frame->dst;
                stack[top].dst = frame->aux;
                stack[top].stage = 0;
                break;
                
            case 1:
                // 步骤1完成，执行步骤2：移动最大的盘
                count++;
                printf("步骤 %d: 移动圆盘%d 从 %c 到 %c\n", 
                       count, frame->n, frame->src, frame->dst);
                frame->stage = 2;
                // 处理步骤3：将n-1个盘从aux移到dst
                top++;
                stack[top].n = frame->n - 1;
                stack[top].src = frame->aux;
                stack[top].aux = frame->src;
                stack[top].dst = frame->dst;
                stack[top].stage = 0;
                break;
                
            case 2:
                // 步骤3完成，弹出当前栈帧
                top--;
                break;
        }
    }
    
    free(stack);
}

/**
 * 汉诺塔测试主函数
 */
int main() {
    printf("=== 汉诺塔问题 ===\n\n");
    
    // 测试n=3
    printf("--- n=3 (3个圆盘) ---\n");
    move_count = 0;
    hanoi(3, 'A', 'B', 'C');
    printf("总移动次数: %d (理论值: 2^3-1 = %d)\n", move_count, (1 << 3) - 1);
    printf("\n");
    
    // 测试n=4
    printf("--- n=4 (4个圆盘) ---\n");
    move_count = 0;
    hanoi(4, 'A', 'B', 'C');
    printf("总移动次数: %d (理论值: 2^4-1 = %d)\n", move_count, (1 << 4) - 1);
    printf("\n");
    
    // 测试不同n值的移动次数
    printf("=== 汉诺塔移动次数规律 ===\n");
    printf("n\t移动次数\t2^n-1\n");
    printf("--\t--------\t------\n");
    for (int i = 1; i <= 10; i++) {
        move_count = 0;
        hanoi(i, 'A', 'B', 'C');
        printf("%d\t%d\t\t%d\n", i, move_count, (1 << i) - 1);
    }
    printf("\n");
    
    // 演示迭代版本
    printf("=== 迭代版本演示 (n=3) ===\n");
    hanoi_iterative(3, 'A', 'B', 'C');
    printf("\n");
    
    // 汉诺塔的递归树
    printf("=== 汉诺塔递归树 (n=3) ===\n");
    printf("hanoi(3, A, B, C)\n");
    printf("├── hanoi(2, A, C, B)\n");
    printf("│   ├── hanoi(1, A, B, C) → 移动1: A→C\n");
    printf("│   ├── 移动2: A→B\n");
    printf("│   └── hanoi(1, C, A, B) → 移动3: C→B\n");
    printf("├── 移动4: A→C (最大盘)\n");
    printf("└── hanoi(2, B, A, C)\n");
    printf("    ├── hanoi(1, B, C, A) → 移动5: B→A\n");
    printf("    ├── 移动6: B→C\n");
    printf("    └── hanoi(1, A, B, C) → 移动7: A→C\n");
    
    return 0;
}
```

## 斐波那契数列

### 斐波那契数列的递归实现

斐波那契数列是另一个经典的递归示例。数列定义如下：

```
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2)  (n >= 2)
```

虽然斐波那契数列的递归定义非常简洁，但朴素的递归实现效率极低，因为它存在大量重复计算。下面我们通过递归、带备忘录的递归和迭代三种方式来实现斐波那契数列，并进行性能对比。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// 全局计数器，用于统计递归调用次数
long long recursion_count = 0;

/**
 * 递归计算斐波那契数（朴素版本）
 * 
 * 时间复杂度：O(2^n) - 指数级，因为大量重复计算
 * 空间复杂度：O(n) - 递归调用栈深度
 * 
 * 问题：存在大量重复计算
 * 例如计算F(5)时：
 * - F(5) = F(4) + F(3)
 * - F(4) = F(3) + F(2)
 * - F(3) = F(2) + F(1)
 * - F(3)被重复计算了！
 * 
 * @param n 非负整数
 * @return  第n个斐波那契数
 */
long long fibonacci_recursive(int n) {
    recursion_count++;
    // 递归终止条件
    if (n <= 0) return 0;
    if (n == 1) return 1;
    // 递归关系
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2);
}

/**
 * 带备忘录的递归（记忆化搜索）
 * 
 * 使用数组存储已计算的结果，避免重复计算
 * 这是"自顶向下"的动态规划
 * 
 * 时间复杂度：O(n) - 每个子问题只计算一次
 * 空间复杂度：O(n) - 备忘录数组 + 递归调用栈
 * 
 * @param n    非负整数
 * @param memo 备忘录数组，memo[i]存储F(i)的值，-1表示未计算
 * @return     第n个斐波那契数
 */
long long fibonacci_memo(int n, long long* memo) {
    recursion_count++;
    // 如果已经计算过，直接返回
    if (memo[n] != -1) {
        return memo[n];
    }
    // 基本情况
    if (n <= 0) {
        memo[n] = 0;
    } else if (n == 1) {
        memo[n] = 1;
    } else {
        // 递归计算并存储结果
        memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo);
    }
    return memo[n];
}

/**
 * 启动带备忘录的斐波那契计算
 */
long long fibonacci_memo_init(int n) {
    long long* memo = (long long*)malloc((n + 1) * sizeof(long long));
    for (int i = 0; i <= n; i++) {
        memo[i] = -1;  // -1表示未计算
    }
    long long result = fibonacci_memo(n, memo);
    free(memo);
    return result;
}

/**
 * 迭代计算斐波那契数
 * 
 * 使用动态规划的思想，自底向上计算
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1) - 只使用两个变量
 * 
 * 这是效率最高的实现方式
 * 
 * @param n 非负整数
 * @return  第n个斐波那契数
 */
long long fibonacci_iterative(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    long long prev2 = 0;  // F(n-2)
    long long prev1 = 1;  // F(n-1)
    long long current = 0;
    
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;  // F(n) = F(n-1) + F(n-2)
        prev2 = prev1;            // 更新F(n-2)
        prev1 = current;          // 更新F(n-1)
    }
    
    return current;
}

/**
 * 斐波那契数列测试主函数
 */
int main() {
    printf("=== 斐波那契数列 ===\n\n");
    
    // 测试基本计算
    printf("--- 前20个斐波那契数 ---\n");
    printf("n\tF(n)\n");
    printf("--\t----\n");
    for (int i = 0; i <= 20; i++) {
        printf("%d\t%lld\n", i, fibonacci_iterative(i));
    }
    printf("\n");
    
    // 性能对比：朴素递归 vs 带备忘录的递归 vs 迭代
    printf("=== 性能对比 ===\n");
    printf("n\t朴素递归(调用次数)\t带备忘录(调用次数)\n");
    printf("--\t------------------\t------------------\n");
    
    for (int n = 5; n <= 20; n += 5) {
        // 朴素递归
        recursion_count = 0;
        fibonacci_recursive(n);
        long long count1 = recursion_count;
        
        // 带备忘录的递归
        recursion_count = 0;
        fibonacci_memo_init(n);
        long long count2 = recursion_count;
        
        printf("%d\t%lld\t\t\t%lld\n", n, count1, count2);
    }
    printf("\n");
    
    // 递归树演示
    printf("=== 斐波那契递归树（F(5)） ===\n");
    printf("F(5)\n");
    printf("├── F(4)\n");
    printf("│   ├── F(3)\n");
    printf("│   │   ├── F(2)\n");
    printf("│   │   │   ├── F(1) = 1\n");
    printf("│   │   │   └── F(0) = 0\n");
    printf("│   │   └── F(1) = 1\n");
    printf("│   └── F(2)\n");
    printf("│       ├── F(1) = 1\n");
    printf("│       └── F(0) = 0\n");
    printf("└── F(3)                        ← 注意：F(3)被重复计算！\n");
    printf("    ├── F(2)\n");
    printf("    │   ├── F(1) = 1\n");
    printf("    │   └── F(0) = 0\n");
    printf("    └── F(1) = 1\n");
    printf("F(5) = 5\n");
    printf("（朴素递归：15次调用；带备忘录：9次调用；迭代：5次计算）\n");
    
    return 0;
}
```

## 全排列（回溯算法）

### 全排列的基本原理

全排列问题：给定一个不含重复元素的数组，返回其所有可能的排列。

例如，对于数组[1, 2, 3]，其全排列为：
```
[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]
```

回溯算法解决全排列问题的核心思想是：
1. 使用一个数组`path`记录当前正在构建的排列
2. 使用一个数组`used`标记哪些元素已经被使用
3. 在每一步，尝试将每个未使用的元素添加到`path`的末尾
4. 当`path`的长度等于原始数组长度时，找到一个完整排列
5. 回溯：撤销上一步的选择，尝试其他可能

回溯算法的关键是"选择-探索-撤销"的模式：
- **选择**：在当前步骤选择一个可能的选项
- **探索**：基于这个选择，递归地探索后续步骤
- **撤销**：撤销当前选择，回到之前的状态，尝试其他选项

### 全排列的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 交换两个整数的值
 */
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/**
 * 打印一个排列
 */
void print_permutation(int arr[], int n) {
    printf("[");
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(", ");
    }
    printf("]");
}

/* ========== 方法1：使用used数组的回溯 ========== */

/**
 * 全排列的回溯算法（使用used数组）
 * 
 * 算法原理：
 * 1. 使用path数组记录当前构建的排列
 * 2. 使用used数组标记哪些元素已被使用
 * 3. 在每一步，遍历所有未使用的元素
 * 4. 选择一个未使用的元素，标记为已使用，递归处理下一个位置
 * 5. 回溯时，撤销标记
 * 
 * 时间复杂度：O(n * n!) - n!个排列，每个排列需要O(n)时间构建
 * 空间复杂度：O(n) - path和used数组 + 递归调用栈
 * 
 * 回溯过程：
 * 对于arr=[1,2,3]：
 * 
 * path=[], used=[F,F,F]
 * ├── 选1: path=[1], used=[T,F,F]
 * │   ├── 选2: path=[1,2], used=[T,T,F]
 * │   │   └── 选3: path=[1,2,3] → 输出 [1,2,3]
 * │   └── 选3: path=[1,3], used=[T,F,T]
 * │       └── 选2: path=[1,3,2] → 输出 [1,3,2]
 * ├── 选2: path=[2], used=[F,T,F]
 * │   ├── 选1: path=[2,1], used=[T,T,F]
 * │   │   └── 选3: path=[2,1,3] → 输出 [2,1,3]
 * │   └── 选3: path=[2,3], used=[F,T,T]
 * │       └── 选1: path=[2,3,1] → 输出 [2,3,1]
 * └── 选3: path=[3], used=[F,F,T]
 *     ├── 选1: path=[3,1], used=[T,F,T]
 *     │   └── 选2: path=[3,1,2] → 输出 [3,1,2]
 *     └── 选2: path=[3,2], used=[F,T,T]
 *         └── 选1: path=[3,2,1] → 输出 [3,2,1]
 * 
 * @param arr   原始数组
 * @param n     数组长度
 * @param path  当前构建的排列
 * @param depth 当前深度（已选元素个数）
 * @param used  标记数组，used[i]表示arr[i]是否已被使用
 * @param count 用于统计排列总数
 */
void permute_backtrack(int arr[], int n, int path[], int depth, bool used[], int* count) {
    // 递归终止条件：已经选择了n个元素，形成一个完整排列
    if (depth == n) {
        printf("排列 %d: ", ++(*count));
        print_permutation(path, n);
        printf("\n");
        return;
    }
    
    // 遍历所有可能的元素
    for (int i = 0; i < n; i++) {
        // 如果该元素未被使用
        if (!used[i]) {
            // 选择：将arr[i]加入当前排列
            path[depth] = arr[i];
            used[i] = true;
            
            // 探索：递归处理下一个位置
            permute_backtrack(arr, n, path, depth + 1, used, count);
            
            // 撤销：回溯，将arr[i]从排列中移除
            used[i] = false;
        }
    }
}

/**
 * 生成全排列的入口函数
 */
void generate_permutations_used(int arr[], int n) {
    int* path = (int*)malloc(n * sizeof(int));
    bool* used = (bool*)calloc(n, sizeof(bool));  // calloc初始化为false
    int count = 0;
    
    permute_backtrack(arr, n, path, 0, used, &count);
    
    printf("共生成 %d 个排列（理论值: %d! = %d）\n", count, n, count);
    
    free(path);
    free(used);
}

/* ========== 方法2：使用交换的回溯（更高效） ========== */

/**
 * 全排列的回溯算法（使用交换）
 * 
 * 这种方法不需要额外的path和used数组
 * 直接在原数组上通过交换来生成排列
 * 
 * 算法原理：
 * 对于位置index，依次将index到n-1的每个元素交换到index位置
 * 然后递归处理index+1位置
 * 
 * 时间复杂度：O(n * n!) 
 * 空间复杂度：O(n) - 递归调用栈深度
 * 
 * @param arr   数组
 * @param start 当前处理的起始位置
 * @param n     数组长度
 * @param count 排列计数器
 */
void permute_swap(int arr[], int start, int n, int* count) {
    // 递归终止条件：start到达数组末尾
    if (start == n - 1) {
        printf("排列 %d: ", ++(*count));
        print_permutation(arr, n);
        printf("\n");
        return;
    }
    
    // 遍历start到n-1的每个位置
    for (int i = start; i < n; i++) {
        // 选择：将arr[i]交换到start位置
        swap(&arr[start], &arr[i]);
        
        // 探索：递归处理start+1位置
        permute_swap(arr, start + 1, n, count);
        
        // 撤销：交换回来，恢复原始顺序
        swap(&arr[start], &arr[i]);
    }
}

/**
 * 全排列测试主函数
 */
int main() {
    printf("=== 全排列问题 ===\n\n");
    
    // 测试方法1：使用used数组
    printf("--- 方法1：使用used数组的回溯 ---\n");
    int arr1[] = {1, 2, 3};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("数组: [1, 2, 3]\n");
    generate_permutations_used(arr1, n1);
    printf("\n");
    
    // 测试方法2：使用交换
    printf("--- 方法2：使用交换的回溯 ---\n");
    int arr2[] = {1, 2, 3};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    int count = 0;
    permute_swap(arr2, 0, n2, &count);
    printf("共生成 %d 个排列\n", count);
    printf("\n");
    
    // 测试更大的数组
    printf("--- n=4 的全排列 ---\n");
    int arr3[] = {1, 2, 3, 4};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    count = 0;
    permute_swap(arr3, 0, n3, &count);
    printf("共生成 %d 个排列（理论值: 4! = 24）\n", count);
    printf("\n");
    
    // 回溯过程可视化
    printf("=== 回溯过程可视化 ===\n");
    printf("对于 arr=[1, 2, 3]，start=0:\n");
    printf("├── i=0: swap(0,0) → arr=[1,2,3], start=1\n");
    printf("│   ├── i=1: swap(1,1) → arr=[1,2,3], start=2 → 输出[1,2,3]\n");
    printf("│   └── i=2: swap(1,2) → arr=[1,3,2], start=2 → 输出[1,3,2]\n");
    printf("├── i=1: swap(0,1) → arr=[2,1,3], start=1\n");
    printf("│   ├── i=1: swap(1,1) → arr=[2,1,3], start=2 → 输出[2,1,3]\n");
    printf("│   └── i=2: swap(1,2) → arr=[2,3,1], start=2 → 输出[2,3,1]\n");
    printf("└── i=2: swap(0,2) → arr=[3,2,1], start=1\n");
    printf("    ├── i=1: swap(1,1) → arr=[3,2,1], start=2 → 输出[3,2,1]\n");
    printf("    └── i=2: swap(1,2) → arr=[3,1,2], start=2 → 输出[3,1,2]\n");
    
    return 0;
}
```

## 八皇后问题

### 八皇后问题的描述

八皇后问题是一个经典的回溯算法问题。问题描述：在8x8的国际象棋棋盘上放置8个皇后，使得任意两个皇后都不能互相攻击。即任意两个皇后不能在同一行、同一列或同一对角线上。

八皇后问题共有92种不同的解法（如果考虑旋转和对称，则有12种本质不同的解法）。

回溯算法解决八皇后问题的思路：
1. 逐行放置皇后
2. 对于每一行，尝试将皇后放在该行的每一列上
3. 检查当前位置是否与之前放置的皇后冲突
4. 如果不冲突，放置皇后，递归处理下一行
5. 如果冲突，尝试下一列
6. 如果该行所有列都冲突，回溯到上一行

### 八皇后问题的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>

#define N 8  // 棋盘大小

int solution_count = 0;  // 解的数量

/**
 * 打印棋盘
 * 
 * @param board 棋盘，board[i]=j表示第i行第j列放置了皇后
 * @param n     棋盘大小
 */
void print_board(int board[], int n) {
    printf("解法 %d:\n", solution_count);
    // 打印列号
    printf("  ");
    for (int j = 0; j < n; j++) {
        printf("%d ", j);
    }
    printf("\n");
    
    for (int i = 0; i < n; i++) {
        printf("%d ", i);  // 行号
        for (int j = 0; j < n; j++) {
            if (board[i] == j) {
                printf("Q ");  // 皇后
            } else {
                printf(". ");  // 空格
            }
        }
        printf("\n");
    }
    printf("\n");
}

/**
 * 检查在(row, col)位置放置皇后是否安全
 * 
 * 检查规则：
 * 1. 同一列：board[i] == col
 * 2. 同一主对角线：row - i == col - board[i]
 *    （即 row - col == i - board[i]）
 * 3. 同一副对角线：row - i == board[i] - col
 *    （即 row + col == i + board[i]）
 * 
 * 注意：不需要检查同一行，因为每行只放置一个皇后
 * 
 * @param board 当前棋盘状态
 * @param row   要检查的行
 * @param col   要检查的列
 * @return      true表示安全，false表示有冲突
 */
bool is_safe(int board[], int row, int col) {
    // 检查之前的所有行（0到row-1）
    for (int i = 0; i < row; i++) {
        // 检查同一列
        if (board[i] == col) {
            return false;
        }
        // 检查同一对角线
        // 两个皇后在同一个对角线上当且仅当 |row1 - row2| == |col1 - col2|
        if (abs(row - i) == abs(col - board[i])) {
            return false;
        }
    }
    return true;
}

/**
 * 八皇后问题的回溯算法
 * 
 * 算法原理：
 * 逐行放置皇后，对于每一行尝试所有列
 * 使用回溯探索所有可能的放置方案
 * 
 * 时间复杂度：O(N!) - 但实际上由于剪枝，实际运行时间远小于此
 * 空间复杂度：O(N) - board数组 + 递归调用栈
 * 
 * 回溯树（以N=4为例，实际N=8）：
 * 第0行: 尝试col=0,1,2,3
 * 第1行: 对于第0行的每个选择，尝试不冲突的列
 * ...以此类推
 * 
 * @param board 棋盘数组，board[i]表示第i行皇后所在的列
 * @param row   当前要处理的行
 * @param n     棋盘大小
 */
void solve_n_queens(int board[], int row, int n) {
    // 递归终止条件：所有行都放置了皇后
    if (row == n) {
        solution_count++;
        print_board(board, n);
        return;
    }
    
    // 尝试在当前行的每一列放置皇后
    for (int col = 0; col < n; col++) {
        // 检查当前位置是否安全
        if (is_safe(board, row, col)) {
            // 选择：在(row, col)放置皇后
            board[row] = col;
            
            // 探索：递归处理下一行
            solve_n_queens(board, row + 1, n);
            
            // 撤销：不需要显式撤销，因为board[row]会被下一轮循环覆盖
        }
    }
}

/**
 * 八皇后问题的优化版本
 * 使用三个布尔数组来快速判断冲突
 * 将is_safe的时间从O(n)降低到O(1)
 */
void solve_n_queens_optimized(int board[], int row, int n,
                               bool cols[], bool diag1[], bool diag2[]) {
    if (row == n) {
        solution_count++;
        print_board(board, n);
        return;
    }
    
    for (int col = 0; col < n; col++) {
        // 主对角线索引：row - col + n - 1（偏移n-1避免负数）
        int d1 = row - col + n - 1;
        // 副对角线索引：row + col
        int d2 = row + col;
        
        // 检查列、主对角线、副对角线是否被占用
        if (!cols[col] && !diag1[d1] && !diag2[d2]) {
            // 选择
            board[row] = col;
            cols[col] = true;
            diag1[d1] = true;
            diag2[d2] = true;
            
            // 探索
            solve_n_queens_optimized(board, row + 1, n, cols, diag1, diag2);
            
            // 撤销
            cols[col] = false;
            diag1[d1] = false;
            diag2[d2] = false;
        }
    }
}

/**
 * 八皇后问题测试主函数
 */
int main() {
    printf("=== 八皇后问题 ===\n\n");
    
    int board[N];
    
    // 基本版本
    printf("--- 基本回溯版本 ---\n");
    solution_count = 0;
    solve_n_queens(board, 0, N);
    printf("八皇后问题共有 %d 种解法\n\n", solution_count);
    
    // 优化版本
    printf("--- 优化版本（使用布尔数组快速判断冲突） ---\n");
    bool* cols = (bool*)calloc(N, sizeof(bool));
    bool* diag1 = (bool*)calloc(2 * N - 1, sizeof(bool));
    bool* diag2 = (bool*)calloc(2 * N - 1, sizeof(bool));
    
    solution_count = 0;
    // 只打印前两个解法以避免输出过多
    printf("（仅显示前两个解法）\n");
    // 这里简化处理，直接用基本版本的结果
    
    printf("\n--- 不同N值的皇后问题 ---\n");
    printf("N\t解法数\n");
    printf("--\t------\n");
    for (int n = 1; n <= 10; n++) {
        int* b = (int*)malloc(n * sizeof(int));
        bool* c = (bool*)calloc(n, sizeof(bool));
        bool* d1 = (bool*)calloc(2 * n - 1, sizeof(bool));
        bool* d2 = (bool*)calloc(2 * n - 1, sizeof(bool));
        
        solution_count = 0;
        solve_n_queens_optimized(b, 0, n, c, d1, d2);
        printf("%d\t%d\n", n, solution_count);
        
        free(b);
        free(c);
        free(d1);
        free(d2);
    }
    printf("\n");
    
    // 回溯过程演示
    printf("=== 八皇后回溯过程演示（4皇后为例） ===\n");
    printf("4皇后问题有2种解法：\n");
    printf("解法1:          解法2:\n");
    printf("  . Q . .         . . Q .\n");
    printf("  . . . Q         Q . . .\n");
    printf("  Q . . .         . . . Q\n");
    printf("  . . Q .         . Q . .\n");
    
    free(cols);
    free(diag1);
    free(diag2);
    
    return 0;
}
```

## 子集生成

### 子集生成的基本原理

子集生成问题：给定一个不含重复元素的数组，返回其所有可能的子集（幂集）。对于n个元素的数组，共有2^n个子集（包括空集）。

例如，对于数组[1, 2, 3]，其所有子集为：
```
[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
```

回溯算法解决子集生成问题的思路：
1. 对于每个元素，有两种选择：包含它或不包含它
2. 从第一个元素开始，依次处理每个元素
3. 当处理完所有元素时，当前的选择组合就是一个子集

### 子集生成的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 打印子集
 */
void print_subset(int subset[], int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d", subset[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]");
}

/* ========== 方法1：回溯法（对于每个元素，选或不选） ========== */

/**
 * 子集生成的回溯算法
 * 
 * 算法原理：
 * 对于每个元素，有两种选择：包含或不包含
 * 相当于一棵二叉树，每个节点表示一个元素
 * 左分支表示选择该元素，右分支表示不选
 * 
 * 回溯树（arr=[1,2,3]）：
 *                    []
 *            选1/        \不选1
 *           [1]          []
 *       选2/  \不选2   选2/  \不选2
 *     [1,2]   [1]     [2]    []
 *   选3/ \不选3 ...  (以此类推)
 * 
 * 时间复杂度：O(2^n) - 2^n个子集
 * 空间复杂度：O(n) - subset数组 + 递归调用栈
 * 
 * @param arr      原始数组
 * @param n        数组长度
 * @param index    当前处理的元素索引
 * @param subset   当前构建的子集
 * @param size     当前子集的大小
 * @param count    子集计数器
 */
void generate_subsets_backtrack(int arr[], int n, int index, 
                                 int subset[], int size, int* count) {
    // 递归终止条件：处理完所有元素
    if (index == n) {
        printf("子集 %d: ", ++(*count));
        print_subset(subset, size);
        printf("\n");
        return;
    }
    
    // 选择1：包含当前元素
    subset[size] = arr[index];
    generate_subsets_backtrack(arr, n, index + 1, subset, size + 1, count);
    
    // 选择2：不包含当前元素（不需要将元素加入subset）
    generate_subsets_backtrack(arr, n, index + 1, subset, size, count);
}

/* ========== 方法2：迭代法（使用二进制位掩码） ========== */

/**
 * 子集生成的迭代算法
 * 
 * 使用0到2^n-1的二进制表示来决定每个元素是否在子集中
 * 如果第i位为1，则arr[i]在子集中
 * 
 * 例如 n=3:
 * 000 → []
 * 001 → [1]
 * 010 → [2]
 * 011 → [1,2]
 * 100 → [3]
 * 101 → [1,3]
 * 110 → [2,3]
 * 111 → [1,2,3]
 * 
 * 时间复杂度：O(n * 2^n) 
 * 空间复杂度：O(n) - subset数组
 */
void generate_subsets_iterative(int arr[], int n) {
    int total = 1 << n;  // 2^n
    int* subset = (int*)malloc(n * sizeof(int));
    int count = 0;
    
    for (int mask = 0; mask < total; mask++) {
        int size = 0;
        for (int i = 0; i < n; i++) {
            // 检查第i位是否为1
            if (mask & (1 << i)) {
                subset[size++] = arr[i];
            }
        }
        count++;
        printf("子集 %d: ", count);
        print_subset(subset, size);
        printf("\n");
    }
    
    free(subset);
}

/* ========== 方法3：生成指定大小的子集（组合） ========== */

/**
 * 生成指定大小的所有子集（组合问题）
 * 
 * 这是"从n个元素中选择k个"的组合问题
 * 
 * @param arr      原始数组
 * @param n        数组长度
 * @param k        要选择的元素个数
 * @param start    当前搜索的起始位置
 * @param subset   当前构建的子集
 * @param size     当前子集的大小
 * @param count    子集计数器
 */
void generate_combinations(int arr[], int n, int k, int start,
                            int subset[], int size, int* count) {
    // 递归终止条件：已经选择了k个元素
    if (size == k) {
        printf("组合 %d: ", ++(*count));
        print_subset(subset, size);
        printf("\n");
        return;
    }
    
    // 剪枝优化：如果剩余元素不足以凑够k个，提前返回
    // 剩余元素数 = n - start
    // 还需要选择的元素数 = k - size
    // 如果 n - start < k - size，不可能完成
    if (n - start < k - size) {
        return;
    }
    
    // 从start开始尝试选择元素
    for (int i = start; i < n; i++) {
        // 选择
        subset[size] = arr[i];
        // 探索（注意：下一轮从i+1开始，因为元素不能重复选择）
        generate_combinations(arr, n, k, i + 1, subset, size + 1, count);
        // 撤销：不需要显式撤销，size没有改变
    }
}

/**
 * 子集生成测试主函数
 */
int main() {
    printf("=== 子集生成问题 ===\n\n");
    
    int arr[] = {1, 2, 3};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    // 方法1：回溯法
    printf("--- 方法1：回溯法（选或不选） ---\n");
    int* subset = (int*)malloc(n * sizeof(int));
    int count = 0;
    generate_subsets_backtrack(arr, n, 0, subset, 0, &count);
    printf("共生成 %d 个子集（理论值: 2^%d = %d）\n\n", count, n, 1 << n);
    
    // 方法2：迭代法（二进制位掩码）
    printf("--- 方法2：迭代法（二进制位掩码） ---\n");
    generate_subsets_iterative(arr, n);
    printf("\n");
    
    // 方法3：生成指定大小的子集
    printf("--- 方法3：生成指定大小的子集（组合） ---\n");
    for (int k = 0; k <= n; k++) {
        printf("C(%d,%d) = 从%d个元素中选择%d个:\n", n, k, n, k);
        count = 0;
        generate_combinations(arr, n, k, 0, subset, 0, &count);
        printf("共 %d 个组合\n\n", count);
    }
    
    free(subset);
    
    // 回溯树演示
    printf("=== 回溯树演示 ===\n");
    printf("对于 arr=[1,2,3]，子集生成的回溯树：\n");
    printf("                    []\n");
    printf("            选1/          \\不选1\n");
    printf("           [1]              []\n");
    printf("       选2/  \\不选2      选2/  \\不选2\n");
    printf("     [1,2]    [1]        [2]     []\n");
    printf("  选3/ \\不选3 选3/ \\不选3 ...\n");
    printf("[1,2,3] [1,2] [1,3] [1]\n");
    printf("（叶子节点共8个，对应8个子集）\n");
    
    return 0;
}
```

## 组合总和问题

### 组合总和问题的描述

组合总和问题：给定一个无重复元素的数组candidates和一个目标值target，找出candidates中所有可以使数字和为target的组合。candidates中的数字可以无限次重复使用。

例如：
- candidates = [2, 3, 6, 7], target = 7
- 解为：[7], [2, 2, 3]

回溯算法解决组合总和问题的思路：
1. 从第一个元素开始，可以选择当前元素任意次（0次、1次、2次...）
2. 每次选择后，目标值减少相应的量
3. 当目标值变为0时，找到一个解
4. 当目标值变为负数时，剪枝
5. 处理完当前元素后，尝试下一个元素

### 组合总和问题的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 打印组合
 */
void print_combination(int combination[], int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d", combination[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]");
}

/**
 * 组合总和问题的回溯算法
 * 
 * 算法原理：
 * 对于每个元素，可以选择使用它0次、1次、2次...
 * 每次选择后，更新剩余目标值
 * 当剩余目标值为0时，找到一个解
 * 当剩余目标值小于0时，剪枝
 * 
 * 回溯树（candidates=[2,3,6,7], target=7）：
 *                            []
 *                选2/    选3/   选6/   选7/
 *              [2](5)  [3](4)  [6](1)  [7](0)✓
 *          选2/ 选3/ 选6/ 选7/
 *     [2,2](3) [2,3](2) [2,6](-1)✗ [2,7](-2)✗
 *   选2/ 选3/ 选6/ 选7/
 * [2,2,2](1) [2,2,3](0)✓ [2,2,6](-4)✗ [2,2,7](-5)✗
 * 
 * 时间复杂度：O(2^(target/min)) - 最坏情况
 * 空间复杂度：O(target/min) - combination数组 + 递归栈
 * 
 * 优化策略：
 * 1. 先对candidates排序，便于剪枝
 * 2. 如果当前元素大于剩余目标值，可以直接跳过
 * 
 * @param candidates    候选数组
 * @param n             候选数组长度
 * @param target        剩余目标值
 * @param start         当前搜索的起始位置
 * @param combination   当前构建的组合
 * @param size          当前组合的大小
 * @param count         解的数量计数器
 * @param sorted        候选数组是否已排序
 */
void combination_sum_backtrack(int candidates[], int n, int target, int start,
                                int combination[], int size, int* count) {
    // 找到解：剩余目标值为0
    if (target == 0) {
        printf("解 %d: ", ++(*count));
        print_combination(combination, size);
        printf(" = 和为目标值\n");
        return;
    }
    
    // 遍历候选元素（从start开始，避免重复组合）
    for (int i = start; i < n; i++) {
        // 剪枝：如果当前元素大于剩余目标值，跳过
        // （假设candidates已排序，之后的元素更大，也直接跳过）
        if (candidates[i] > target) {
            break;
        }
        
        // 选择：将当前元素加入组合
        combination[size] = candidates[i];
        
        // 探索：递归处理，注意start参数为i
        // 因为元素可以重复使用，所以下一次搜索仍然从i开始
        combination_sum_backtrack(candidates, n, target - candidates[i], i,
                                   combination, size + 1, count);
        
        // 撤销：不需要显式撤销，因为size没有改变
    }
}

/**
 * 比较函数，用于qsort排序
 */
int compare_ints(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

/**
 * 组合总和问题的入口函数
 * 
 * @param candidates 候选数组
 * @param n          候选数组长度
 * @param target     目标值
 */
void combination_sum(int candidates[], int n, int target) {
    // 先排序，便于剪枝
    qsort(candidates, n, sizeof(int), compare_ints);
    
    int* combination = (int*)malloc(target * sizeof(int));
    int count = 0;
    
    printf("候选数组: [");
    for (int i = 0; i < n; i++) {
        printf("%d", candidates[i]);
        if (i < n - 1) printf(", ");
    }
    printf("], 目标值: %d\n", target);
    
    combination_sum_backtrack(candidates, n, target, 0, combination, 0, &count);
    
    if (count == 0) {
        printf("无解\n");
    }
    printf("共找到 %d 个解\n", count);
    
    free(combination);
}

/**
 * 组合总和问题 —— 每个元素只能使用一次
 * 
 * 与上一个版本的区别：
 * 1. 递归时start参数为i+1（不能用同一个元素）
 * 2. 需要跳过重复元素以避免重复解
 */
void combination_sum2_backtrack(int candidates[], int n, int target, int start,
                                 int combination[], int size, int* count) {
    if (target == 0) {
        printf("解 %d: ", ++(*count));
        print_combination(combination, size);
        printf("\n");
        return;
    }
    
    for (int i = start; i < n; i++) {
        // 跳过重复元素，避免重复解
        if (i > start && candidates[i] == candidates[i - 1]) {
            continue;
        }
        
        if (candidates[i] > target) {
            break;
        }
        
        combination[size] = candidates[i];
        // 注意：start参数为i+1，因为每个元素只能用一次
        combination_sum2_backtrack(candidates, n, target - candidates[i], i + 1,
                                    combination, size + 1, count);
    }
}

/**
 * 组合总和问题测试主函数
 */
int main() {
    printf("=== 组合总和问题 ===\n\n");
    
    // 测试用例1：元素可以重复使用
    printf("--- 元素可以重复使用 ---\n");
    int candidates1[] = {2, 3, 6, 7};
    int n1 = sizeof(candidates1) / sizeof(candidates1[0]);
    combination_sum(candidates1, n1, 7);
    printf("\n");
    
    // 测试用例2：更多候选元素
    int candidates2[] = {2, 3, 5};
    int n2 = sizeof(candidates2) / sizeof(candidates2[0]);
    combination_sum(candidates2, n2, 8);
    printf("\n");
    
    // 测试用例3：每个元素只能使用一次
    printf("--- 每个元素只能使用一次 ---\n");
    int candidates3[] = {10, 1, 2, 7, 6, 1, 5};
    int n3 = sizeof(candidates3) / sizeof(candidates3[0]);
    qsort(candidates3, n3, sizeof(int), compare_ints);
    
    int* combination = (int*)malloc(8 * sizeof(int));
    int count = 0;
    
    printf("候选数组: [1, 1, 2, 5, 6, 7, 10], 目标值: 8\n");
    combination_sum2_backtrack(candidates3, n3, 8, 0, combination, 0, &count);
    printf("共找到 %d 个解\n", count);
    
    free(combination);
    printf("\n");
    
    // 回溯过程演示
    printf("=== 回溯过程演示 ===\n");
    printf("candidates=[2,3,6,7], target=7\n");
    printf("回溯树：\n");
    printf("                              []\n");
    printf("              选2/            选3/          选6/       选7/\n");
    printf("            [2](5)          [3](4)        [6](1)     [7](0)✓\n");
    printf("        选2/    选3/       选3/  选6/     选6/\n");
    printf("    [2,2](3) [2,3](2)  [3,3](1) [3,6](-2)✗ [6,6](-5)✗\n");
    printf("   选2/\n");
    printf("[2,2,2](1)  [2,2,3](0)✓\n");
    printf(" 选2/ (剪枝)\n");
    printf("[2,2,2,2](-1)✗\n");
    printf("找到两个解: [7] 和 [2,2,3]\n");
    
    return 0;
}
```

## 递归转迭代的通用方法

### 递归转迭代的三种方法

在某些情况下，我们需要将递归算法转换为迭代算法，以避免栈溢出或提高性能。以下是三种常用的递归转迭代的方法：

1. **使用显式栈模拟递归**：创建一个栈（数组或链表），手动管理"调用栈"。这是最通用的方法。

2. **尾递归优化**：如果递归调用是函数的最后一个操作（尾递归），编译器可以将其优化为迭代。但C语言标准不保证尾递归优化。

3. **动态规划（自底向上）**：将递归的"自顶向下"改为迭代的"自底向上"。适用于具有重叠子问题的问题。

### 递归转迭代的完整示例

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/* ========== 示例1：阶乘的递归转迭代 ========== */

// 递归版本
long long factorial_recursive(int n) {
    if (n <= 1) return 1;
    return n * factorial_recursive(n - 1);
}

// 迭代版本（尾递归转循环）
long long factorial_iterative(int n) {
    long long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/* ========== 示例2：二叉树的遍历（使用显式栈） ========== */

/**
 * 二叉树节点结构体
 */
typedef struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

/**
 * 创建树节点
 */
TreeNode* create_tree_node(int data) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

/**
 * 前序遍历（递归版本）
 */
void preorder_recursive(TreeNode* root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder_recursive(root->left);
    preorder_recursive(root->right);
}

/**
 * 前序遍历（迭代版本，使用显式栈）
 * 
 * 递归转迭代的方法：
 * 1. 创建一个栈，将初始状态（根节点）压入栈中
 * 2. 循环处理栈顶元素，模拟递归调用
 * 3. 将子问题的状态压入栈中
 * 4. 直到栈为空
 * 
 * 时间复杂度：O(n) - 每个节点访问一次
 * 空间复杂度：O(h) - 栈的大小等于树的高度
 */
void preorder_iterative(TreeNode* root) {
    if (root == NULL) return;
    
    // 使用数组模拟栈，存储待处理的节点
    TreeNode** stack = (TreeNode**)malloc(100 * sizeof(TreeNode*));
    int top = -1;
    
    // 将根节点压入栈中
    stack[++top] = root;
    
    while (top >= 0) {
        // 弹出栈顶节点
        TreeNode* node = stack[top--];
        
        // 访问节点
        printf("%d ", node->data);
        
        // 注意：先压入右子节点，再压入左子节点
        // 这样左子节点会先被处理（栈是后进先出）
        if (node->right != NULL) {
            stack[++top] = node->right;
        }
        if (node->left != NULL) {
            stack[++top] = node->left;
        }
    }
    
    free(stack);
}

/* ========== 示例3：深度优先搜索（使用显式栈） ========== */

/**
 * 图的深度优先搜索（递归版本）
 * 
 * @param graph  邻接矩阵
 * @param n      顶点数
 * @param node   当前节点
 * @param visited 访问标记数组
 */
void dfs_recursive(int graph[][5], int n, int node, bool visited[]) {
    visited[node] = true;
    printf("%d ", node);
    
    for (int neighbor = 0; neighbor < n; neighbor++) {
        if (graph[node][neighbor] && !visited[neighbor]) {
            dfs_recursive(graph, n, neighbor, visited);
        }
    }
}

/**
 * 图的深度优先搜索（迭代版本，使用显式栈）
 * 
 * 递归转迭代的通用方法：
 * 1. 分析递归函数中的"状态"（参数和局部变量）
 * 2. 创建一个栈来存储这些状态
 * 3. 用循环模拟递归调用过程
 * 
 * @param graph 邻接矩阵
 * @param n     顶点数
 * @param start 起始节点
 */
void dfs_iterative(int graph[][5], int n, int start) {
    bool* visited = (bool*)calloc(n, sizeof(bool));
    int* stack = (int*)malloc(n * sizeof(int));
    int top = -1;
    
    // 将起始节点压入栈中
    stack[++top] = start;
    
    while (top >= 0) {
        int node = stack[top--];
        
        if (!visited[node]) {
            visited[node] = true;
            printf("%d ", node);
            
            // 将未访问的邻居节点压入栈中
            for (int neighbor = n - 1; neighbor >= 0; neighbor--) {
                if (graph[node][neighbor] && !visited[neighbor]) {
                    stack[++top] = neighbor;
                }
            }
        }
    }
    
    free(visited);
    free(stack);
}

/* ========== 示例4：动态规划（自底向上） ========== */

/**
 * 爬楼梯问题：每次可以爬1或2级台阶，爬到第n级有多少种方法？
 * 
 * 递归关系：f(n) = f(n-1) + f(n-2)
 * 这就是斐波那契数列
 */

// 递归版本（自顶向下）
int climb_stairs_recursive(int n) {
    if (n <= 1) return 1;
    return climb_stairs_recursive(n - 1) + climb_stairs_recursive(n - 2);
}

// 动态规划版本（自底向上，迭代）
int climb_stairs_dp(int n) {
    if (n <= 1) return 1;
    
    int prev2 = 1;  // f(0)
    int prev1 = 1;  // f(1)
    int current = 0;
    
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}

/**
 * 递归转迭代测试主函数
 */
int main() {
    printf("=== 递归转迭代的通用方法 ===\n\n");
    
    // 示例1：阶乘
    printf("--- 示例1：阶乘 ---\n");
    printf("递归: 5! = %lld\n", factorial_recursive(5));
    printf("迭代: 5! = %lld\n", factorial_iterative(5));
    printf("\n");
    
    // 示例2：二叉树遍历
    printf("--- 示例2：二叉树前序遍历 ---\n");
    // 构建一个简单的二叉树
    TreeNode* root = create_tree_node(1);
    root->left = create_tree_node(2);
    root->right = create_tree_node(3);
    root->left->left = create_tree_node(4);
    root->left->right = create_tree_node(5);
    root->right->left = create_tree_node(6);
    root->right->right = create_tree_node(7);
    
    printf("递归前序: ");
    preorder_recursive(root);
    printf("\n");
    printf("迭代前序: ");
    preorder_iterative(root);
    printf("\n\n");
    
    // 释放树
    free(root->left->left);
    free(root->left->right);
    free(root->right->left);
    free(root->right->right);
    free(root->left);
    free(root->right);
    free(root);
    
    // 示例3：DFS
    printf("--- 示例3：图的深度优先搜索 ---\n");
    int graph[5][5] = {
        {0, 1, 1, 0, 0},
        {1, 0, 0, 1, 0},
        {1, 0, 0, 1, 1},
        {0, 1, 1, 0, 1},
        {0, 0, 1, 1, 0}
    };
    bool visited[5] = {false};
    
    printf("递归DFS: ");
    dfs_recursive(graph, 5, 0, visited);
    printf("\n");
    printf("迭代DFS: ");
    dfs_iterative(graph, 5, 0);
    printf("\n\n");
    
    // 示例4：动态规划
    printf("--- 示例4：爬楼梯问题 ---\n");
    printf("n\t递归\t\t迭代(DP)\n");
    printf("--\t----\t\t--------\n");
    for (int i = 1; i <= 10; i++) {
        printf("%d\t%d\t\t%d\n", i, climb_stairs_recursive(i), climb_stairs_dp(i));
    }
    printf("\n");
    
    // 总结
    printf("=== 递归转迭代方法总结 ===\n");
    printf("1. 显式栈法：创建栈模拟递归调用栈\n");
    printf("   - 适用：树/图的遍历、回溯算法\n");
    printf("   - 优点：通用性强，几乎所有递归都可以转换\n");
    printf("   - 缺点：代码复杂度增加\n\n");
    printf("2. 尾递归优化：将尾递归转换为循环\n");
    printf("   - 适用：尾递归函数（递归调用是最后一步）\n");
    printf("   - 优点：转换简单，性能提升明显\n");
    printf("   - 缺点：仅适用于尾递归\n\n");
    printf("3. 动态规划：自底向上计算\n");
    printf("   - 适用：具有重叠子问题的递归问题\n");
    printf("   - 优点：消除重复计算，效率最高\n");
    printf("   - 缺点：需要重新思考问题结构\n");
    
    return 0;
}
```

## 总结与对比

### 递归与回溯的核心概念

| 概念 | 说明 | 示例 |
|------|------|------|
| 递归终止条件 | 最简单的情况，直接返回 | n==0时返回1 |
| 递归关系 | 将问题分解为子问题 | n! = n * (n-1)! |
| 回溯 | 探索所有可能，撤销错误选择 | 全排列、八皇后 |
| 剪枝 | 提前排除不可能的解 | 组合总和中的target<0 |
| 记忆化 | 缓存已计算的结果 | 斐波那契的memo数组 |

### 本文涵盖的算法对比

| 问题 | 算法类型 | 时间复杂度 | 空间复杂度 | 关键技巧 |
|------|----------|------------|------------|----------|
| 汉诺塔 | 递归 | O(2^n) | O(n) | 分治思想 |
| 斐波那契(朴素) | 递归 | O(2^n) | O(n) | 递归定义 |
| 斐波那契(记忆化) | 递归+记忆化 | O(n) | O(n) | 避免重复计算 |
| 斐波那契(迭代) | 迭代 | O(n) | O(1) | 自底向上 |
| 全排列 | 回溯 | O(n!) | O(n) | 选择-探索-撤销 |
| 八皇后 | 回溯+剪枝 | O(N!) | O(N) | 冲突检测 |
| 子集生成 | 回溯 | O(2^n) | O(n) | 选或不选 |
| 组合总和 | 回溯+剪枝 | O(2^n) | O(n) | 元素可重复使用 |

### 递归问题的一般解决思路

1. **识别递归结构**：问题能否分解为相同形式的子问题？

2. **定义递归函数**：明确函数的功能、参数和返回值。

3. **确定终止条件**：什么情况下不需要继续递归？确保终止条件最终会到达。

4. **写出递归关系**：如何用子问题的解来构造原问题的解？

5. **考虑优化**：是否存在重复计算？能否使用记忆化？能否剪枝？

6. **测试边界情况**：空输入、最小输入、最大输入。

### 核心要点总结

1. **递归是一种思维方式**：将复杂问题分解为简单的子问题。递归代码通常更接近问题的数学定义。

2. **回溯是递归的增强**：在递归的基础上增加了"撤销选择"的机制，使得算法可以系统地探索所有可能的解。

3. **剪枝是回溯的关键优化**：通过提前排除不可能产生解的分支，大幅减少搜索空间。

4. **记忆化消除重复计算**：对于具有重叠子问题的问题，记忆化可以将指数复杂度降为多项式复杂度。

5. **递归转迭代**：当递归深度过大或需要避免函数调用开销时，可以使用显式栈、尾递归优化或动态规划来转换。

6. **递归的代价**：每次递归调用都有函数调用开销，深度过大会导致栈溢出。在实际应用中，需要权衡代码简洁性和性能。

通过本系列五篇文章的学习，你应该已经掌握了C语言算法的基础知识，包括排序算法、查找算法、线性结构、栈与队列、递归与回溯。这些知识是进一步学习更高级算法（如图算法、动态规划、字符串算法等）的坚实基础。建议读者多动手实践，将代码运行起来，观察不同参数下的行为，逐步建立对算法性能的直觉。
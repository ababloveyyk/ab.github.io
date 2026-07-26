---
title: C语言算法基础Ⅰ——排序算法（上）
date: 2026-07-26
tags:
  - C语言
  - 算法
  - 排序
categories:
  - C语言
---

## 前言

排序算法是计算机科学中最基础也是最重要的算法之一。在数据处理、搜索优化、数据库管理等众多领域，排序都扮演着核心角色。学习排序算法不仅是掌握算法思想的起点，更是理解时间复杂度、空间复杂度等核心概念的最佳途径。本系列文章将以C语言为实现工具，从最基础的排序算法开始，逐步深入到更复杂的算法。本文作为系列的第一篇，将聚焦于几种基础排序算法：冒泡排序、选择排序、插入排序和希尔排序。每种算法都会给出完整的C语言实现，并附带详细的注释和性能分析。

排序算法之所以重要，是因为它们体现了许多核心的算法思想。冒泡排序体现了"比较-交换"的朴素思想，选择排序展示了"贪心"策略的雏形，插入排序则揭示了"增量构建"的思维方式，而希尔排序则引入了"分治"思想的萌芽。理解这些基础算法，是通往更高级算法世界的必经之路。

在学习排序算法之前，我们需要先建立算法分析的框架。算法分析的核心是复杂度分析，它帮助我们量化算法的性能，预测算法在不同规模数据下的表现。复杂度分析分为时间复杂度分析和空间复杂度分析，我们通常使用大O表示法来描述算法的复杂度上界。下面，我们将从复杂度分析的基础知识开始，逐步深入到具体的排序算法实现中。

## 算法复杂度分析基础

### 什么是时间复杂度

时间复杂度是衡量算法执行时间随输入规模增长而变化的趋势。它不关心具体的执行秒数，而是关注算法执行的基本操作次数与输入规模n之间的函数关系。时间复杂度让我们能够在不实际运行代码的情况下，就能对算法的效率做出预判。

在C语言中，基本操作通常包括比较操作、赋值操作、算术运算等。对于一个排序算法，我们通常统计比较次数和交换（或移动）次数作为基本操作。例如，一个简单的for循环：

```c
#include <stdio.h>

int main() {
    int n = 100;
    int sum = 0;
    // 这个循环执行n次基本操作
    for (int i = 0; i < n; i++) {
        sum += i;  // 每次循环执行一次加法、一次赋值
    }
    printf("Sum: %d\n", sum);
    return 0;
}
```

上述代码的时间复杂度是O(n)，因为循环体内的操作执行了n次，与输入规模n呈线性关系。

### 大O表示法详解

大O表示法（Big O Notation）是描述算法复杂度的数学符号。它表示算法在最坏情况下的增长率上界。大O表示法忽略常数因子和低阶项，只关注影响算法复杂度的最高阶项。这是因为当n足够大时，最高阶项将主导算法的运行时间。

常见的时间复杂度从低到高排列如下：

| 复杂度 | 名称 | 典型算法 | n=100时的操作次数（近似） |
|--------|------|----------|---------------------------|
| O(1) | 常数阶 | 数组索引访问 | 1 |
| O(log n) | 对数阶 | 二分查找 | 约7 |
| O(n) | 线性阶 | 线性查找 | 100 |
| O(n log n) | 线性对数阶 | 快速排序、归并排序 | 约664 |
| O(n²) | 平方阶 | 冒泡排序、选择排序、插入排序 | 10000 |
| O(n³) | 立方阶 | 朴素矩阵乘法 | 1000000 |
| O(2ⁿ) | 指数阶 | 穷举搜索 | 约1.27×10³⁰ |
| O(n!) | 阶乘阶 | 旅行商问题暴力解 | 约9.33×10¹⁵⁷ |

我们可以通过一个简单的C程序来直观感受不同复杂度下操作次数的增长：

```c
#include <stdio.h>
#include <math.h>

// 演示不同复杂度的操作次数随n的增长
void demonstrate_complexity() {
    int test_n[] = {10, 100, 1000, 10000};
    int num_tests = sizeof(test_n) / sizeof(test_n[0]);
    
    printf("%-10s %-15s %-15s %-15s %-15s %-15s\n", 
           "n", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(2^n)");
    printf("----------------------------------------------------------------------------\n");
    
    for (int i = 0; i < num_tests; i++) {
        int n = test_n[i];
        // 注意：对于2^n，当n=10000时结果会溢出，这里只展示趋势
        double log_n = log2(n);
        double n_log_n = n * log2(n);
        double n_square = (double)n * n;
        // 对于2^n，当n太大时我们只展示较小的n值
        double two_power_n = (n <= 30) ? pow(2, n) : -1;
        
        printf("%-10d %-15.1f %-15d %-15.1f %-15.1f ", 
               n, log_n, n, n_log_n, n_square);
        if (n <= 30) {
            printf("%-15.1e\n", two_power_n);
        } else {
            printf("溢出\n");
        }
    }
}

int main() {
    printf("=== 时间复杂度直观对比 ===\n\n");
    demonstrate_complexity();
    return 0;
}
```

### 空间复杂度

空间复杂度衡量算法在执行过程中所需额外内存空间随输入规模增长的趋势。对于排序算法，我们特别关注"原地排序"（in-place sorting）的概念——如果算法只需要常数级别的额外空间（O(1)），则称为原地排序算法。

在排序算法中，空间复杂度主要关注以下几个方面：
- 递归调用栈占用的空间（如快速排序的递归深度）
- 辅助数组占用的空间（如归并排序的临时数组）
- 其他临时变量占用的空间

### 排序算法的稳定性

稳定性是排序算法的一个重要性质。如果一个排序算法是稳定的，那么在排序过程中，相等元素的相对顺序保持不变。例如，如果原始数据中有两个值相等的元素A和B，且A在B之前，那么在稳定排序后，A仍然在B之前。

稳定性在某些场景下非常重要。例如，当我们先按某个次要关键字排序，再按主要关键字排序时，只有使用稳定排序，才能保证次要关键字的有序性得以保留。具体来说，假设我们有一组学生数据，先按姓名排序，再按成绩排序。如果排序算法是稳定的，那么成绩相同的学生会保持按姓名排序的顺序。

在本文介绍的四种排序算法中：
- 冒泡排序：稳定（相等时不交换）
- 选择排序：不稳定（交换可能破坏相对顺序）
- 插入排序：稳定（相等时不移动）
- 希尔排序：不稳定（跨步长交换可能破坏相对顺序）

## 冒泡排序

### 冒泡排序的基本原理

冒泡排序（Bubble Sort）是一种最直观、最简单的排序算法。它的名字来源于排序过程中，较小的元素会像水中的气泡一样逐渐"浮"到数组的顶端（前端），而较大的元素则"沉"到底部（后端）。

冒泡排序的基本思想是：重复地遍历要排序的数组，依次比较相邻的两个元素，如果它们的顺序错误（即前一个元素大于后一个元素），就交换它们的位置。每一轮遍历都会将当前未排序部分中的最大元素放到正确的位置上（即数组的末尾）。经过n-1轮遍历后，整个数组就变得有序了。

下面我们用一个具体的例子来说明冒泡排序的过程。假设我们有以下数组：

```
初始数组：[5, 3, 8, 1, 6]
```

第一轮遍历（i=0）：
- 比较索引0和1：5 > 3，交换 → [3, 5, 8, 1, 6]
- 比较索引1和2：5 < 8，不交换 → [3, 5, 8, 1, 6]
- 比较索引2和3：8 > 1，交换 → [3, 5, 1, 8, 6]
- 比较索引3和4：8 > 6，交换 → [3, 5, 1, 6, 8]
- 第一轮结束，最大值8已就位（在索引4的位置）

第二轮遍历（i=1）：
- 比较索引0和1：3 < 5，不交换 → [3, 5, 1, 6, 8]
- 比较索引1和2：5 > 1，交换 → [3, 1, 5, 6, 8]
- 比较索引2和3：5 < 6，不交换 → [3, 1, 5, 6, 8]
- 第二轮结束，第二大的值6已就位（在索引3的位置）

第三轮遍历（i=2）：
- 比较索引0和1：3 > 1，交换 → [1, 3, 5, 6, 8]
- 比较索引1和2：3 < 5，不交换 → [1, 3, 5, 6, 8]
- 第三轮结束，第三大的值5已就位

第四轮遍历（i=3）：
- 比较索引0和1：1 < 3，不交换 → [1, 3, 5, 6, 8]
- 第四轮结束，数组完全有序

从上面的过程可以看出，冒泡排序的核心操作是"比较相邻元素并交换"，每一轮遍历都将当前未排序部分的最大值"冒泡"到最后。

### 冒泡排序的基本实现

下面给出冒泡排序的基本C语言实现：

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 冒泡排序 - 基本版本
 * 
 * 参数说明：
 * @param arr 待排序的整型数组
 * @param n   数组的长度
 * 
 * 算法原理：
 * 外层循环控制排序的轮数，共需要n-1轮
 * 内层循环执行相邻元素的比较和交换
 * 每轮结束后，最大的元素会"冒泡"到数组末尾
 * 
 * 时间复杂度：O(n²) - 无论数据如何，都要执行(n-1) + (n-2) + ... + 1 = n(n-1)/2次比较
 * 空间复杂度：O(1) - 只使用了常数个临时变量
 * 稳定性：稳定 - 当两个元素相等时，我们不会交换它们
 */
void bubble_sort(int arr[], int n) {
    // 外层循环：需要进行n-1轮遍历
    // i表示已经排好序的元素个数（从数组末尾算起）
    for (int i = 0; i < n - 1; i++) {
        // 内层循环：遍历未排序的部分
        // 每轮比较的范围是[0, n-1-i)，因为末尾i个元素已经有序
        for (int j = 0; j < n - 1 - i; j++) {
            // 如果前面的元素大于后面的元素，则交换
            if (arr[j] > arr[j + 1]) {
                // 使用临时变量进行交换
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 冒泡排序测试主函数
 */
int main() {
    // 测试用例1：普通数组
    int arr1[] = {5, 3, 8, 1, 6, 2, 7, 4};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    
    printf("=== 冒泡排序基本版本测试 ===\n\n");
    printf("原始数组: ");
    print_array(arr1, n1);
    
    bubble_sort(arr1, n1);
    
    printf("排序结果: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：已排序数组（最优情况）
    int arr2[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("已排序数组测试: ");
    print_array(arr2, n2);
    bubble_sort(arr2, n2);
    printf("排序结果: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：逆序数组（最坏情况）
    int arr3[] = {8, 7, 6, 5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("逆序数组测试: ");
    print_array(arr3, n3);
    bubble_sort(arr3, n3);
    printf("排序结果: ");
    print_array(arr3, n3);
    printf("\n");
    
    // 测试用例4：包含重复元素的数组
    int arr4[] = {4, 2, 4, 1, 2, 3, 4, 1};
    int n4 = sizeof(arr4) / sizeof(arr4[0]);
    printf("含重复元素测试: ");
    print_array(arr4, n4);
    bubble_sort(arr4, n4);
    printf("排序结果: ");
    print_array(arr4, n4);
    
    return 0;
}
```

### 冒泡排序的优化 —— 带标志位

基本冒泡排序有一个明显的缺陷：即使数组在某一轮遍历后已经完全有序，它仍然会继续执行后续的遍历。例如，对于数组[1, 2, 3, 4, 5]，基本冒泡排序仍然会执行4轮遍历，每轮遍历都会进行多次比较，尽管数组已经是有序的。

我们可以通过引入一个标志位（flag）来优化冒泡排序。如果在某一轮遍历中没有发生任何交换操作，说明数组已经完全有序，可以提前结束排序。这个优化可以将最优情况的时间复杂度从O(n²)降低到O(n)。

标志位优化的核心思想是：在每轮遍历开始前将标志位设为0（表示没有交换），如果在内层循环中发生了交换，就将标志位设为1。一轮遍历结束后，如果标志位仍然是0，说明没有发生任何交换，数组已经有序，可以提前结束。

下面给出带标志位优化的冒泡排序实现：

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 冒泡排序 - 带标志位优化版本
 * 
 * 优化原理：
 * 如果在一轮遍历中没有发生任何交换，说明数组已经有序
 * 此时可以提前结束排序，避免不必要的比较
 * 
 * 最优时间复杂度：O(n) - 当数组已经有序时，只需一轮遍历
 * 最坏时间复杂度：O(n²) - 当数组完全逆序时
 * 平均时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 */
void bubble_sort_optimized(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        // flag变量用于记录本轮是否发生了交换
        // 0表示没有交换，1表示发生了交换
        int flag = 0;
        
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换两个元素
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                // 发生了交换，标记flag为1
                flag = 1;
            }
        }
        
        // 如果本轮没有发生任何交换，说明数组已经有序
        // 可以提前结束排序
        if (flag == 0) {
            break;
        }
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 测试带标志位优化的冒泡排序
 */
int main() {
    printf("=== 冒泡排序优化版本测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {5, 3, 8, 1, 6, 2, 7, 4};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    bubble_sort_optimized(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：几乎有序的数组
    // 优化版本在此情况下表现显著优于基本版本
    int arr2[] = {1, 2, 3, 5, 4, 6, 7, 8};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("几乎有序数组排序前: ");
    print_array(arr2, n2);
    bubble_sort_optimized(arr2, n2);
    printf("几乎有序数组排序后: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：完全有序的数组
    // 优化版本只需一轮遍历即可确认有序
    int arr3[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("完全有序数组排序前: ");
    print_array(arr3, n3);
    bubble_sort_optimized(arr3, n3);
    printf("完全有序数组排序后: ");
    print_array(arr3, n3);
    printf("\n");
    
    // 测试用例4：随机较大数组，对比优化效果
    int arr4[20];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 20; i++) {
        arr4[i] = rand() % 100;
        printf("%d ", arr4[i]);
    }
    printf("\n");
    bubble_sort_optimized(arr4, 20);
    printf("随机数组排序后: ");
    print_array(arr4, 20);
    
    return 0;
}
```

### 冒泡排序的进一步优化 —— 鸡尾酒排序

鸡尾酒排序（Cocktail Sort），也称为双向冒泡排序（Bidirectional Bubble Sort）或搅拌排序（Shaker Sort），是冒泡排序的另一种改进版本。它的核心思想是：在每一轮遍历中，先从左到右进行一次冒泡，将最大值"推"到右端，然后从右到左进行一次冒泡，将最小值"拉"到左端。这样，每一轮双向遍历可以同时确定最大值和最小值的位置。

鸡尾酒排序的图形化描述如下：

```
原始数组：[2, 3, 4, 5, 1]

第一轮（从左到右）：
比较2和3 → 不交换
比较3和4 → 不交换
比较4和5 → 不交换
比较5和1 → 交换 → [2, 3, 4, 1, 5]
最大值5已到达右端

第一轮（从右到左）：
比较1和4 → 交换 → [2, 3, 1, 4, 5]
比较1和3 → 交换 → [2, 1, 3, 4, 5]
比较1和2 → 交换 → [1, 2, 3, 4, 5]
最小值1已到达左端，数组完全有序
```

鸡尾酒排序特别适合处理"前半部分有序，后半部分也有序，但整体无序"的数组。例如，对于数组[2, 3, 4, 5, 1]，基本冒泡排序需要4轮遍历，而鸡尾酒排序只需要1轮双向遍历。

下面给出鸡尾酒排序的完整实现：

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 鸡尾酒排序（双向冒泡排序）
 * 
 * 算法原理：
 * 每一轮包含两个方向的遍历：
 * 1. 从左到右：将最大值"冒泡"到右端
 * 2. 从右到左：将最小值"冒泡"到左端
 * 每完成一轮双向遍历，左右边界各收缩一个位置
 * 
 * 时间复杂度：O(n²) - 最坏和平均情况
 * 最优时间复杂度：O(n) - 当数组已经有序时
 * 空间复杂度：O(1)
 * 稳定性：稳定
 * 
 * 适用场景：适用于大部分元素已经有序，但极少数元素错位的情况
 * 例如 [2, 3, 4, 5, 1] 这种数组，鸡尾酒排序比普通冒泡排序快得多
 */
void cocktail_sort(int arr[], int n) {
    // left和right定义了未排序区域的左右边界
    int left = 0;
    int right = n - 1;
    // swapped标志记录是否发生了交换
    int swapped = 1;
    
    // 当交换发生且左右边界未相遇时，继续排序
    while (left < right && swapped) {
        swapped = 0; // 重置交换标志
        
        // 第一阶段：从左到右遍历
        // 将最大值"冒泡"到右端
        for (int i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                // 交换相邻元素
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = 1; // 标记发生了交换
            }
        }
        // 最大值已经被放置在right位置，右边界左移
        right--;
        
        // 如果没有交换，说明数组已经有序
        if (!swapped) {
            break;
        }
        
        swapped = 0; // 重置交换标志
        
        // 第二阶段：从右到左遍历
        // 将最小值"冒泡"到左端
        for (int i = right; i > left; i--) {
            if (arr[i] < arr[i - 1]) {
                // 交换相邻元素
                int temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;
                swapped = 1; // 标记发生了交换
            }
        }
        // 最小值已经被放置在left位置，左边界右移
        left++;
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 鸡尾酒排序测试主函数
 */
int main() {
    printf("=== 鸡尾酒排序测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {5, 3, 8, 1, 6, 2, 7, 4};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    cocktail_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：鸡尾酒排序的优势场景
    // 大部分元素有序，极少数元素错位
    int arr2[] = {2, 3, 4, 5, 6, 7, 8, 1};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("优势场景排序前: ");
    print_array(arr2, n2);
    cocktail_sort(arr2, n2);
    printf("优势场景排序后: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：完全逆序数组
    int arr3[] = {8, 7, 6, 5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("逆序数组排序前: ");
    print_array(arr3, n3);
    cocktail_sort(arr3, n3);
    printf("逆序数组排序后: ");
    print_array(arr3, n3);
    printf("\n");
    
    // 测试用例4：随机数组
    int arr4[15];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 15; i++) {
        arr4[i] = rand() % 100;
        printf("%d ", arr4[i]);
    }
    printf("\n");
    cocktail_sort(arr4, 15);
    printf("随机数组排序后: ");
    print_array(arr4, 15);
    
    return 0;
}
```

### 冒泡排序的深入分析

冒泡排序虽然简单，但它的分析能帮助我们深入理解算法效率的本质。让我们从多个维度来分析冒泡排序。

**比较次数分析**：基本冒泡排序的比较次数是固定的——无论输入数据如何，都需要进行(n-1) + (n-2) + ... + 1 = n(n-1)/2次比较。带标志位优化后，最优情况下只需要n-1次比较。

**交换次数分析**：交换次数取决于输入数据的逆序度。在最坏情况下（完全逆序），每次比较都需要交换，交换次数为n(n-1)/2。在最优情况下（已经有序），交换次数为0。

**为什么冒泡排序效率低**：冒泡排序每次只能将元素移动一个位置，这是它效率低下的根本原因。以将最小元素从数组末尾移动到开头为例，冒泡排序需要n-1次交换操作，而选择排序只需要1次交换操作。

**冒泡排序的实际应用**：尽管冒泡排序在大数据量下表现不佳，但在某些特定场景下它仍然有价值。例如，当数据量很小（n < 10）时，冒泡排序的常数因子较小，实际运行速度可能优于分治算法。此外，鸡尾酒排序在数据几乎有序时表现优异，可以用于某些实时系统的数据校准。

## 选择排序

### 选择排序的基本原理

选择排序（Selection Sort）是一种简单直观的排序算法。它的基本思想是：将数组分为已排序区域和未排序区域，每次从未排序区域中选择最小的元素，将其放到已排序区域的末尾。通过n-1次选择，即可完成整个数组的排序。

选择排序的核心操作是"选择"——每次在未排序区域中找到最小元素的位置。与冒泡排序不同，选择排序每轮只进行一次交换操作（将最小元素与未排序区域的第一个元素交换），这大大减少了数据移动的次数。

选择排序的具体步骤如下：

```
初始数组：[5, 3, 8, 1, 6]

第1轮（i=0）：在索引[0,4]中找最小值
- 最小值为1，位于索引3
- 交换arr[0]和arr[3] → [1, 3, 8, 5, 6]
- 已排序区域：[1]，未排序区域：[3, 8, 5, 6]

第2轮（i=1）：在索引[1,4]中找最小值
- 最小值为3，位于索引1
- 交换arr[1]和arr[1]（自己和自己交换）→ [1, 3, 8, 5, 6]
- 已排序区域：[1, 3]，未排序区域：[8, 5, 6]

第3轮（i=2）：在索引[2,4]中找最小值
- 最小值为5，位于索引3
- 交换arr[2]和arr[3] → [1, 3, 5, 8, 6]
- 已排序区域：[1, 3, 5]，未排序区域：[8, 6]

第4轮（i=3）：在索引[3,4]中找最小值
- 最小值为6，位于索引4
- 交换arr[3]和arr[4] → [1, 3, 5, 6, 8]
- 已排序区域：[1, 3, 5, 6]，未排序区域：[8]
- 排序完成
```

选择排序的一个重要特性是：无论输入数据如何，它的比较次数是固定的，始终为n(n-1)/2，但交换次数最多只有n-1次。这使得选择排序在数据移动成本较高的场景下（例如对大型记录按关键字排序，而记录本身很大）具有一定优势。

### 选择排序的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 选择排序
 * 
 * 算法原理：
 * 将数组分为已排序区域和未排序区域
 * 每次从未排序区域中选择最小元素，放到已排序区域末尾
 * 经过n-1轮选择后，数组完全有序
 * 
 * 时间复杂度：O(n²) - 无论数据如何，都需要n(n-1)/2次比较
 * 空间复杂度：O(1) - 原地排序，只使用常数个临时变量
 * 稳定性：不稳定 - 交换操作可能破坏相等元素的相对顺序
 * 
 * 例如：对数组 [5a, 3, 5b, 1] 排序
 * 第一轮：找到最小值1，交换5a和1 → [1, 3, 5b, 5a]
 * 注意5a和5b的相对顺序被改变了！
 * 
 * @param arr 待排序的整型数组
 * @param n   数组的长度
 */
void selection_sort(int arr[], int n) {
    // 外层循环：i表示已排序区域的末尾位置
    // 需要执行n-1轮选择
    for (int i = 0; i < n - 1; i++) {
        // 假设当前位置i的元素就是最小值
        int min_index = i;
        
        // 内层循环：在未排序区域[i+1, n-1]中寻找真正的最小值
        for (int j = i + 1; j < n; j++) {
            // 如果找到更小的元素，更新最小值索引
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }
        }
        
        // 如果最小值不在当前位置，则进行交换
        // 这个判断避免了不必要的自交换
        if (min_index != i) {
            int temp = arr[i];
            arr[i] = arr[min_index];
            arr[min_index] = temp;
        }
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 选择排序测试主函数
 */
int main() {
    printf("=== 选择排序测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {64, 25, 12, 22, 11, 36, 48, 19};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    selection_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：已排序数组
    int arr2[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("已排序数组排序前: ");
    print_array(arr2, n2);
    selection_sort(arr2, n2);
    printf("已排序数组排序后: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：逆序数组（最坏情况）
    int arr3[] = {8, 7, 6, 5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("逆序数组排序前: ");
    print_array(arr3, n3);
    selection_sort(arr3, n3);
    printf("逆序数组排序后: ");
    print_array(arr3, n3);
    printf("\n");
    
    // 测试用例4：选择排序与冒泡排序的交换次数对比
    printf("=== 交换次数对比 ===\n");
    int arr_bubble[] = {5, 4, 3, 2, 1};
    int arr_select[] = {5, 4, 3, 2, 1};
    int n = 5;
    
    printf("原始数组: ");
    print_array(arr_bubble, n);
    printf("选择排序只需要2次交换，而冒泡排序需要10次交换\n");
    selection_sort(arr_select, n);
    printf("选择排序结果: ");
    print_array(arr_select, n);
    printf("\n");
    
    // 测试用例5：随机数组
    int arr5[15];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 15; i++) {
        arr5[i] = rand() % 100;
        printf("%d ", arr5[i]);
    }
    printf("\n");
    selection_sort(arr5, 15);
    printf("随机数组排序后: ");
    print_array(arr5, 15);
    
    return 0;
}
```

### 选择排序的深入分析

选择排序的优缺点非常明显。它的主要优点是简单易懂，实现容易，且交换次数少（最多n-1次）。它的主要缺点是时间复杂度固定为O(n²)，且不是稳定排序。

选择排序与冒泡排序的对比：
- 比较次数：两者相同，都是n(n-1)/2次
- 交换次数：冒泡排序最多n(n-1)/2次，选择排序最多n-1次
- 稳定性：冒泡排序稳定，选择排序不稳定
- 适用场景：当数据移动（写操作）成本远高于比较成本时，选择排序优于冒泡排序

选择排序的一个有趣特性是：它在任何情况下都执行相同数量的比较，这使得它的性能非常可预测。对于需要严格保证执行时间的实时系统，选择排序的这种可预测性可能是一个优势。

## 插入排序

### 插入排序的基本原理

插入排序（Insertion Sort）是另一种简单直观的排序算法。它的基本思想类似于整理扑克牌：将数组分为已排序区域和未排序区域，每次从未排序区域取出第一个元素，在已排序区域中找到合适的位置并插入。插入排序的核心是"插入"操作——将元素插入到已排序序列的正确位置。

插入排序的工作方式与我们整理扑克牌的方式非常相似。假设你手里有一叠牌，你从左到右逐一拿起每张牌，并将它插入到左手已经排好序的牌中的正确位置。当你拿起一张新牌时，你会从右到左扫描左手已排序的牌，找到合适的位置后插入。

插入排序的具体步骤如下：

```
初始数组：[5, 3, 8, 1, 6]

第1轮（i=1）：取出arr[1]=3
- 已排序区域：[5]，未排序区域：[3, 8, 1, 6]
- 将3与5比较：3 < 5，5后移一位 → [5, 5, 8, 1, 6]
- 将3插入到arr[0]的位置 → [3, 5, 8, 1, 6]
- 已排序区域：[3, 5]

第2轮（i=2）：取出arr[2]=8
- 已排序区域：[3, 5]，未排序区域：[8, 1, 6]
- 将8与5比较：8 > 5，不需要移动
- 将8保持在arr[2]的位置 → [3, 5, 8, 1, 6]
- 已排序区域：[3, 5, 8]

第3轮（i=3）：取出arr[3]=1
- 已排序区域：[3, 5, 8]，未排序区域：[1, 6]
- 将1与8比较：1 < 8，8后移一位 → [3, 5, 8, 8, 6]
- 将1与5比较：1 < 5，5后移一位 → [3, 5, 5, 8, 6]
- 将1与3比较：1 < 3，3后移一位 → [3, 3, 5, 8, 6]
- 将1插入到arr[0]的位置 → [1, 3, 5, 8, 6]
- 已排序区域：[1, 3, 5, 8]

第4轮（i=4）：取出arr[4]=6
- 已排序区域：[1, 3, 5, 8]，未排序区域：[6]
- 将6与8比较：6 < 8，8后移一位 → [1, 3, 5, 8, 8]
- 将6与5比较：6 > 5，停止扫描
- 将6插入到arr[3]的位置 → [1, 3, 5, 6, 8]
- 排序完成
```

插入排序的关键在于"找到正确的插入位置并将元素后移"。这个过程的效率取决于已排序区域中元素的顺序。当数组已经有序时，每轮只需要一次比较，时间复杂度为O(n)；当数组完全逆序时，每轮需要将所有已排序元素后移，时间复杂度为O(n²)。

### 插入排序的基本实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 插入排序
 * 
 * 算法原理：
 * 将数组视为两部分：已排序部分（左侧）和未排序部分（右侧）
 * 每次取未排序部分的第一个元素，在已排序部分中找到合适位置插入
 * 插入过程中需要将比它大的元素依次后移
 * 
 * 时间复杂度：
 * - 最优情况 O(n)：数组已经有序，每次只需比较一次
 * - 最坏情况 O(n²)：数组完全逆序，每次需要移动所有已排序元素
 * - 平均情况 O(n²)
 * 
 * 空间复杂度：O(1) - 原地排序
 * 稳定性：稳定 - 相等元素不会交换位置
 * 
 * 适用场景：
 * 1. 数据量较小（n < 50）
 * 2. 数据基本有序
 * 3. 在线排序（数据逐个到达）
 * 
 * @param arr 待排序的整型数组
 * @param n   数组的长度
 */
void insertion_sort(int arr[], int n) {
    // 外层循环：i表示当前要插入的元素的位置
    // 从索引1开始，因为索引0的元素默认在已排序区域中
    for (int i = 1; i < n; i++) {
        // key保存当前要插入的元素值
        int key = arr[i];
        // j用于在已排序区域中扫描，找到插入位置
        int j = i - 1;
        
        // 将已排序区域中大于key的元素依次后移一位
        // 条件：j >= 0（未越界）且 arr[j] > key（需要后移）
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];  // 将元素后移一位
            j--;                   // 继续向前扫描
        }
        
        // 循环结束时，j+1就是key的正确插入位置
        // 因为arr[j] <= key（或j=-1），所以key应该放在arr[j+1]
        arr[j + 1] = key;
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 插入排序测试主函数
 */
int main() {
    printf("=== 插入排序测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {12, 11, 13, 5, 6, 7, 2, 9};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    insertion_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：已排序数组（最优情况）
    int arr2[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("已排序数组排序前: ");
    print_array(arr2, n2);
    insertion_sort(arr2, n2);
    printf("已排序数组排序后: ");
    print_array(arr2, n2);
    printf("（最优情况：每次只比较一次，无需移动）\n\n");
    
    // 测试用例3：逆序数组（最坏情况）
    int arr3[] = {8, 7, 6, 5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("逆序数组排序前: ");
    print_array(arr3, n3);
    insertion_sort(arr3, n3);
    printf("逆序数组排序后: ");
    print_array(arr3, n3);
    printf("（最坏情况：每次需要移动所有已排序元素）\n\n");
    
    // 测试用例4：演示插入排序的稳定性
    // 使用结构体来演示稳定性
    printf("=== 稳定性演示 ===\n");
    printf("原始顺序: A1(5), B(3), A2(5), C(1)\n");
    printf("稳定排序后: C(1), B(3), A1(5), A2(5)  <- A1仍在A2之前\n");
    int arr4[] = {5, 3, 5, 1};
    int n4 = sizeof(arr4) / sizeof(arr4[0]);
    insertion_sort(arr4, n4);
    printf("排序结果: ");
    print_array(arr4, n4);
    printf("\n");
    
    // 测试用例5：随机数组性能测试
    int arr5[20];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 20; i++) {
        arr5[i] = rand() % 100;
        printf("%d ", arr5[i]);
    }
    printf("\n");
    insertion_sort(arr5, 20);
    printf("随机数组排序后: ");
    print_array(arr5, 20);
    
    return 0;
}
```

### 插入排序的优化 —— 二分插入排序

基本的插入排序在查找插入位置时使用线性扫描，时间复杂度为O(n)。我们可以使用二分查找来优化查找过程，将查找时间从O(n)降低到O(log n)。这种优化版本称为二分插入排序（Binary Insertion Sort）。

需要注意的是，二分插入排序虽然减少了比较次数，但元素移动的次数并没有减少，因此整体时间复杂度仍然是O(n²)。不过，当比较操作的成本远高于移动操作时（例如对字符串排序），二分插入排序的优势就会显现出来。

二分插入排序的核心思想是：对于每个待插入的元素，使用二分查找在已排序区域中找到正确的插入位置，然后一次性将插入位置之后的所有元素后移，最后将元素放入正确位置。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 二分查找插入位置
 * 
 * 在已排序的数组arr[0..right]中，使用二分查找
 * 找到key应该插入的位置
 * 
 * @param arr   已排序的数组
 * @param key   待插入的元素值
 * @param right 已排序区域的右边界
 * @return      插入位置索引
 */
int binary_search_position(int arr[], int key, int left, int right) {
    // 使用二分查找定位插入位置
    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出
        
        if (arr[mid] == key) {
            // 如果找到相等的元素，为了保持稳定性
            // 应该插入到该元素之后
            return mid + 1;
        } else if (arr[mid] < key) {
            left = mid + 1;  // key更大，在右半部分查找
        } else {
            right = mid - 1; // key更小，在左半部分查找
        }
    }
    // 循环结束时，left就是正确的插入位置
    return left;
}

/**
 * 二分插入排序
 * 
 * 优化原理：
 * 使用二分查找替代线性查找来寻找插入位置
 * 将比较次数从O(n)降低到O(log n)，但移动次数不变
 * 
 * 时间复杂度：O(n²) - 移动次数仍然是O(n²)
 * 比较次数：O(n log n) - 二分查找将比较次数降低
 * 空间复杂度：O(1)
 * 稳定性：稳定
 * 
 * 适用场景：
 * 当比较操作成本远高于移动操作时
 * 例如对字符串、大结构体等的排序
 */
void binary_insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];  // 保存当前要插入的元素
        int j = i - 1;     // 已排序区域的右边界
        
        // 使用二分查找找到插入位置
        int insert_pos = binary_search_position(arr, key, 0, j);
        
        // 将[insert_pos, i-1]范围内的所有元素后移一位
        // 注意：必须从后往前移动，避免覆盖
        for (int k = j; k >= insert_pos; k--) {
            arr[k + 1] = arr[k];
        }
        
        // 将key放入正确的插入位置
        arr[insert_pos] = key;
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 统计比较操作次数
 * 用于对比基本插入排序和二分插入排序的比较次数
 */
int comparison_count = 0;

// 带统计的二分插入排序
void binary_insertion_sort_count(int arr[], int n) {
    comparison_count = 0;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // 二分查找，统计比较次数
        int left = 0, right = j;
        int insert_pos = 0;
        while (left <= right) {
            comparison_count++;
            int mid = left + (right - left) / 2;
            comparison_count++;
            if (arr[mid] <= key) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        insert_pos = left;
        
        for (int k = j; k >= insert_pos; k--) {
            arr[k + 1] = arr[k];
        }
        arr[insert_pos] = key;
    }
}

// 带统计的基本插入排序
void insertion_sort_count(int arr[], int n) {
    comparison_count = 0;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0) {
            comparison_count++;
            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
    }
}

/**
 * 二分插入排序测试主函数
 */
int main() {
    printf("=== 二分插入排序测试 ===\n\n");
    
    // 测试用例1：基本功能测试
    int arr1[] = {37, 23, 0, 17, 12, 72, 31, 46, 100, 88, 54};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("原始数组: ");
    print_array(arr1, n1);
    binary_insertion_sort(arr1, n1);
    printf("排序结果: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：比较次数对比
    printf("=== 比较次数对比（n=10，随机数组） ===\n");
    int test_arr1[10], test_arr2[10];
    srand((unsigned int)time(NULL));
    for (int i = 0; i < 10; i++) {
        test_arr1[i] = rand() % 100;
        test_arr2[i] = test_arr1[i];  // 使用相同的数据
    }
    printf("原始数组: ");
    print_array(test_arr1, 10);
    
    insertion_sort_count(test_arr1, 10);
    printf("基本插入排序比较次数: %d\n", comparison_count);
    
    binary_insertion_sort_count(test_arr2, 10);
    printf("二分插入排序比较次数: %d\n", comparison_count);
    
    printf("排序结果: ");
    print_array(test_arr2, 10);
    printf("\n");
    
    // 测试用例3：已排序数组测试
    int arr3[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    printf("已排序数组: ");
    print_array(arr3, 10);
    binary_insertion_sort(arr3, 10);
    printf("排序结果: ");
    print_array(arr3, 10);
    printf("\n");
    
    // 测试用例4：逆序数组测试
    int arr4[] = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1};
    printf("逆序数组: ");
    print_array(arr4, 10);
    binary_insertion_sort(arr4, 10);
    printf("排序结果: ");
    print_array(arr4, 10);
    
    return 0;
}
```

### 插入排序的深入分析

插入排序在实际应用中非常常见，许多编程语言的标准库在排序小数组时都会使用插入排序。例如，Java的Arrays.sort()和Python的Timsort都使用了插入排序来处理小规模数据。

插入排序的优势主要体现在以下几个方面：
1. **在线排序能力**：插入排序可以处理动态到达的数据，每次新数据到达时，只需要将其插入到已排序序列中。
2. **对小数组的高效性**：当n很小时，插入排序的常数因子非常小，实际运行速度可能超过O(n log n)的算法。
3. **对近乎有序数组的高效性**：当数组基本有序时，插入排序接近O(n)时间。

插入排序的局限性：
1. **大规模数据效率低**：当n很大时，O(n²)的时间复杂度使得插入排序不再适用。
2. **数据移动成本**：虽然比较次数可以通过二分查找优化，但数据移动的成本无法降低。

## 希尔排序

### 希尔排序的基本原理

希尔排序（Shell Sort）是插入排序的一种改进版本，由Donald Shell于1959年提出。希尔排序的核心思想是：通过比较相距一定间隔（称为"步长"或"增量"）的元素，使得数组快速变得"部分有序"，然后逐渐减小步长，最终步长为1时退化为普通的插入排序。由于此时数组已经部分有序，插入排序的效率会非常高。

希尔排序之所以高效，是因为它解决了插入排序的两个核心问题：
1. 插入排序每次只能将元素移动一个位置，如果最小元素在数组末尾，需要很多次移动。
2. 插入排序在数组逆序时效率极低。

希尔排序通过引入步长概念，允许元素进行"跳跃式"移动，从而快速将元素移动到接近正确位置的地方。

希尔排序的过程可以描述如下（以步长序列 [5, 3, 1] 为例）：

```
初始数组：[8, 9, 1, 7, 2, 3, 5, 4, 6, 0]

步长=5（间隔为5的元素分组）：
第0组：arr[0]=8, arr[5]=3  → 排序后：[3, 9, 1, 7, 2, 8, 5, 4, 6, 0]
第1组：arr[1]=9, arr[6]=5  → 排序后：[3, 5, 1, 7, 2, 8, 9, 4, 6, 0]
第2组：arr[2]=1, arr[7]=4  → 排序后：[3, 5, 1, 7, 2, 8, 9, 4, 6, 0]
第3组：arr[3]=7, arr[8]=6  → 排序后：[3, 5, 1, 6, 2, 8, 9, 4, 7, 0]
第4组：arr[4]=2, arr[9]=0  → 排序后：[3, 5, 1, 6, 0, 8, 9, 4, 7, 2]

步长=5后的数组：[3, 5, 1, 6, 0, 8, 9, 4, 7, 2]

步长=3（间隔为3的元素分组）：
第0组：arr[0]=3, arr[3]=6, arr[6]=9, arr[9]=2 → 排序：2,3,6,9
第1组：arr[1]=5, arr[4]=0, arr[7]=4 → 排序：0,4,5
第2组：arr[2]=1, arr[5]=8, arr[8]=7 → 排序：1,7,8

步长=3后的数组：[2, 0, 1, 3, 4, 7, 6, 5, 8, 9]

步长=1（普通的插入排序）：
此时数组已经部分有序，插入排序会非常高效
最终结果：[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 希尔排序的步长序列选择

希尔排序的性能很大程度上取决于步长序列的选择。常见的步长序列有：

1. **Shell原始序列**：n/2, n/4, n/8, ..., 1。最简单但效率不是最优。
2. **Hibbard序列**：1, 3, 7, 15, ..., 2^k - 1。最坏时间复杂度O(n^(3/2))。
3. **Sedgewick序列**：1, 5, 19, 41, 109, ...。已知较好的序列之一。
4. **Knuth序列**：1, 4, 13, 40, 121, ..., (3^k - 1)/2。实践中常用。

步长序列的选择对希尔排序的性能有显著影响。一个好的步长序列应该满足：相邻的步长互质，这样可以避免某些元素始终在相同的子序列中，确保所有元素都能被充分比较。

### 希尔排序的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 希尔排序（使用Shell原始步长序列）
 * 
 * 算法原理：
 * 1. 按步长将数组分组成多个子序列
 * 2. 对每个子序列进行插入排序
 * 3. 逐步减小步长，重复上述过程
 * 4. 当步长为1时，退化为普通插入排序，但此时数组已基本有序
 * 
 * 时间复杂度：
 * - 取决于步长序列，使用Shell原始序列时为O(n²)
 * - 使用Hibbard序列时为O(n^(3/2))
 * - 使用最优序列时可达到O(n log² n)
 * 
 * 空间复杂度：O(1) - 原地排序
 * 稳定性：不稳定 - 跳跃式移动可能破坏相等元素的相对顺序
 * 
 * @param arr 待排序的整型数组
 * @param n   数组的长度
 */
void shell_sort(int arr[], int n) {
    // gap为步长，初始值为n/2，每次减半
    // 例如n=10时，gap序列为：5, 2, 1
    for (int gap = n / 2; gap > 0; gap /= 2) {
        // 对每个步长执行插入排序
        // 从gap位置开始，逐步将元素插入到其所在子序列的正确位置
        for (int i = gap; i < n; i++) {
            // 保存当前元素
            int temp = arr[i];
            int j;
            
            // 在步长为gap的子序列中进行插入排序
            // 将arr[i]插入到子序列arr[i-gap], arr[i-2*gap], ...中的正确位置
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];  // 元素后移gap个位置
            }
            
            // 将temp放入正确位置
            arr[j] = temp;
        }
    }
}

/**
 * 打印数组
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/**
 * 希尔排序测试主函数
 */
int main() {
    printf("=== 希尔排序测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {12, 34, 54, 2, 3, 7, 8, 23, 45, 11, 25, 31};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    shell_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：包含大量元素的数组
    int arr2[] = {
        84, 23, 65, 12, 76, 34, 90, 45, 32, 67,
        19, 54, 88, 41, 73, 29, 56, 91, 38, 15,
        70, 43, 62, 27, 81, 36, 59, 94, 48, 21
    };
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("较大数组排序前: ");
    print_array(arr2, n2);
    shell_sort(arr2, n2);
    printf("较大数组排序后: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：逆序数组
    printf("=== 逆序数组测试 ===\n");
    int arr3[] = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("逆序数组排序前: ");
    print_array(arr3, n3);
    shell_sort(arr3, n3);
    printf("逆序数组排序后: ");
    print_array(arr3, n3);
    printf("\n");
    
    // 测试用例4：随机数组
    int arr4[20];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 20; i++) {
        arr4[i] = rand() % 100;
        printf("%d ", arr4[i]);
    }
    printf("\n");
    shell_sort(arr4, 20);
    printf("随机数组排序后: ");
    print_array(arr4, 20);
    printf("\n");
    
    // 测试用例5：演示希尔排序的"跳跃"能力
    printf("=== 希尔排序的跳跃能力演示 ===\n");
    printf("数组：[1, 2, 3, 4, 5, 6, 7, 0]\n");
    printf("插入排序需要7次移动才能把0移到最前面\n");
    printf("希尔排序（gap=4）只需要2次移动！\n\n");
    int arr5[] = {1, 2, 3, 4, 5, 6, 7, 0};
    printf("排序前: ");
    print_array(arr5, 8);
    shell_sort(arr5, 8);
    printf("排序后: ");
    print_array(arr5, 8);
    
    return 0;
}
```

### 希尔排序的深入分析

希尔排序是第一个突破O(n²)时间复杂度的排序算法，它的出现标志着排序算法研究的一个重要里程碑。虽然现在有更高效的排序算法，但希尔排序仍然有其独特的价值。

希尔排序相比简单插入排序的优势：
- 当数组规模较大时，希尔排序明显快于插入排序
- 希尔排序的代码实现相对简单，只需在插入排序外层添加步长循环
- 希尔排序不需要额外的内存空间，是原地排序算法

希尔排序的局限性：
- 不是稳定排序
- 性能高度依赖于步长序列的选择
- 时间复杂度分析困难，不同步长序列的分析结果差异很大

希尔排序适用于中等规模的排序任务（n在1000到10000之间），在这个范围内，希尔排序的实际性能可以与快速排序相媲美，但代码复杂度远低于快速排序。

## 四种排序算法的性能对比

为了更好地理解这四种排序算法的性能差异，我们编写一个完整的性能对比测试程序。该程序将生成相同的数据集，分别使用四种排序算法进行排序，并统计它们的执行时间。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

/* ========== 辅助函数 ========== */

/**
 * 复制数组，用于确保每个算法使用相同的数据
 */
void copy_array(int dest[], int src[], int n) {
    for (int i = 0; i < n; i++) {
        dest[i] = src[i];
    }
}

/**
 * 验证数组是否有序
 */
int is_sorted(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return 0;  // 数组未排序
        }
    }
    return 1;  // 数组已排序
}

/* ========== 四种排序算法实现 ========== */

void bubble_sort_optimized(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int flag = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                flag = 1;
            }
        }
        if (flag == 0) break;
    }
}

void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }
        }
        if (min_index != i) {
            int temp = arr[i];
            arr[i] = arr[min_index];
            arr[min_index] = temp;
        }
    }
}

void insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

void shell_sort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}

/* ========== 性能测试 ========== */

/**
 * 测试排序算法的性能
 * 
 * @param sort_func 排序函数指针
 * @param arr       待排序数组
 * @param n         数组长度
 * @param name      算法名称
 * @return          执行时间（毫秒）
 */
double test_sort(void (*sort_func)(int[], int), int arr[], int n, const char* name) {
    clock_t start = clock();
    sort_func(arr, n);
    clock_t end = clock();
    
    double time_ms = (double)(end - start) * 1000.0 / CLOCKS_PER_SEC;
    
    // 验证排序正确性
    if (!is_sorted(arr, n)) {
        printf("错误：%s排序失败！\n", name);
    }
    
    printf("%-20s: %10.3f ms\n", name, time_ms);
    return time_ms;
}

/**
 * 性能对比主函数
 */
int main() {
    printf("================================================\n");
    printf("        四种排序算法性能对比测试\n");
    printf("================================================\n\n");
    
    // 测试不同规模的数组
    int sizes[] = {100, 500, 1000, 2000, 5000};
    int num_sizes = sizeof(sizes) / sizeof(sizes[0]);
    
    srand((unsigned int)time(NULL));
    
    for (int s = 0; s < num_sizes; s++) {
        int n = sizes[s];
        printf("--- 数组规模: n = %d ---\n", n);
        
        // 生成随机数组
        int* original = (int*)malloc(n * sizeof(int));
        int* test_arr = (int*)malloc(n * sizeof(int));
        
        for (int i = 0; i < n; i++) {
            original[i] = rand() % 10000;
        }
        
        // 测试冒泡排序
        copy_array(test_arr, original, n);
        test_sort(bubble_sort_optimized, test_arr, n, "冒泡排序（优化版）");
        
        // 测试选择排序
        copy_array(test_arr, original, n);
        test_sort(selection_sort, test_arr, n, "选择排序");
        
        // 测试插入排序
        copy_array(test_arr, original, n);
        test_sort(insertion_sort, test_arr, n, "插入排序");
        
        // 测试希尔排序
        copy_array(test_arr, original, n);
        test_sort(shell_sort, test_arr, n, "希尔排序");
        
        printf("\n");
        
        free(original);
        free(test_arr);
    }
    
    // 测试接近有序的数据
    printf("--- 接近有序数据测试 (n=1000) ---\n");
    int n = 1000;
    int* original = (int*)malloc(n * sizeof(int));
    int* test_arr = (int*)malloc(n * sizeof(int));
    
    for (int i = 0; i < n; i++) {
        original[i] = i;
    }
    // 随机交换少量元素，模拟接近有序的情况
    for (int i = 0; i < 20; i++) {
        int idx1 = rand() % n;
        int idx2 = rand() % n;
        int temp = original[idx1];
        original[idx1] = original[idx2];
        original[idx2] = temp;
    }
    
    copy_array(test_arr, original, n);
    test_sort(bubble_sort_optimized, test_arr, n, "冒泡排序（优化版）");
    
    copy_array(test_arr, original, n);
    test_sort(selection_sort, test_arr, n, "选择排序");
    
    copy_array(test_arr, original, n);
    test_sort(insertion_sort, test_arr, n, "插入排序");
    
    copy_array(test_arr, original, n);
    test_sort(shell_sort, test_arr, n, "希尔排序");
    
    printf("\n（注意：插入排序在接近有序数据上表现最优）\n");
    
    free(original);
    free(test_arr);
    
    return 0;
}
```

## 总结与对比

本文详细介绍了四种基础排序算法：冒泡排序、选择排序、插入排序和希尔排序。每种算法都有其独特的思路和适用场景。下面通过一个综合对比表格来总结它们的特性：

### 算法特性对比表

| 特性 | 冒泡排序 | 选择排序 | 插入排序 | 希尔排序 |
|------|----------|----------|----------|----------|
| 最优时间复杂度 | O(n) | O(n²) | O(n) | O(n log n) ~ O(n log² n) |
| 最坏时间复杂度 | O(n²) | O(n²) | O(n²) | O(n²) ~ O(n log² n) |
| 平均时间复杂度 | O(n²) | O(n²) | O(n²) | 取决于步长序列 |
| 空间复杂度 | O(1) | O(1) | O(1) | O(1) |
| 稳定性 | 稳定 | 不稳定 | 稳定 | 不稳定 |
| 比较次数 | n(n-1)/2 | n(n-1)/2 | 平均n(n-1)/4 | 少于O(n²) |
| 交换/移动次数 | 最多n(n-1)/2 | 最多n-1 | 平均n(n-1)/4 | 多于插入排序 |
| 在线排序 | 否 | 否 | 是 | 否 |
| 对近似有序数据 | 好（优化后） | 差 | 优秀 | 好 |

### 算法选择建议

1. **数据量很小（n < 50）**：插入排序是首选，因为它的常数因子最小，且代码简单。
2. **数据基本有序**：插入排序或冒泡排序（优化版）表现最优。
3. **数据移动成本高**：选择排序可以减少交换次数。
4. **中等规模数据（100 < n < 10000）**：希尔排序是一个很好的折中选择。
5. **需要稳定排序**：冒泡排序和插入排序是稳定排序，选择排序和希尔排序不是。
6. **在线排序场景**：插入排序是唯一支持在线排序的算法。

### 核心思想总结

- **冒泡排序**：通过相邻元素的比较和交换，逐步将最大值"冒泡"到末尾。核心思想是"比较-交换"。
- **选择排序**：每次选择未排序区域的最小值，放到已排序区域末尾。核心思想是"贪心选择"。
- **插入排序**：将元素逐个插入到已排序区域的正确位置。核心思想是"增量构建"。
- **希尔排序**：通过逐步缩小步长，使数组快速变得部分有序，最后使用插入排序完成。核心思想是"分步有序"。

这四种算法虽然简单，但它们蕴含的算法思想——比较、交换、选择、插入、分步——是理解更复杂算法的基础。在下一篇文章中，我们将继续探索更高级的排序算法：快速排序、归并排序、堆排序、计数排序和基数排序。这些算法将引入分治、递归、堆等更高级的算法范式，使我们能够高效地处理大规模数据的排序问题。

通过本文的学习，你应该已经掌握了排序算法的基本分析方法和实现技巧。建议读者在阅读过程中，亲手运行每一个代码示例，观察不同算法在不同数据规模下的表现，这将帮助你建立对算法性能的直观感受。
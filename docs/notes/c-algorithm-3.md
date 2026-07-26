---
title: C语言算法基础Ⅲ——查找算法与线性结构
date: 2026-07-26
tags:
  - C语言
  - 算法
  - 查找
  - 链表
categories:
  - C语言
---

## 前言

在前两篇文章中，我们系统地学习了排序算法，从O(n²)的基础排序到O(n log n)的高级排序，再到O(n)的非比较排序。本文将继续算法之旅，聚焦于两个重要的主题：查找算法和线性结构（链表）。

查找算法是计算机科学中最基础的操作之一。无论是数据库查询、字典检索还是搜索引擎，其核心都是查找算法。查找算法的效率直接影响着整个系统的性能。本文将从最简单的线性查找开始，逐步深入到二分查找及其变体（插值查找、斐波那契查找），帮助你建立完整的查找算法知识体系。

线性结构（链表）是数据结构的基础。虽然数组更常用，但链表在动态内存管理、插入和删除操作方面具有独特的优势。本文将全面介绍单链表、双向链表和环形链表，包括它们的创建、遍历、插入、删除和反转等操作。特别是链表反转，这是面试中经常出现的经典问题，我们会详细讲解三指针法和递归法两种实现方式。

本文特别强调边界条件的处理，因为这是C语言编程中容易出错的地方。在C语言中，没有自动的边界检查，程序员必须自己确保指针操作的安全性。对于NULL指针的处理、边界条件的判断，本文将逐一详细说明。

## 线性查找

### 线性查找的基本原理

线性查找（Linear Search），也称为顺序查找（Sequential Search），是最简单、最直观的查找算法。它的基本思想是：从数组的第一个元素开始，逐个与目标值进行比较，直到找到目标值或遍历完整个数组。

线性查找不要求数组有序，它对任何数组都能正常工作。虽然效率不高，但在某些场景下（如数据量小、数据无序、频繁插入删除）仍然是一个实用的选择。

线性查找的过程可以用以下伪码描述：

```
函数 linear_search(arr, n, target):
    for i = 0 to n-1:
        if arr[i] == target:
            return i      // 找到目标值，返回索引
    return -1              // 未找到目标值
```

线性查找的复杂度分析：
- 最优时间复杂度：O(1) —— 目标值在数组的第一个位置
- 最坏时间复杂度：O(n) —— 目标值在数组的最后一个位置或不存在
- 平均时间复杂度：O(n) —— 平均需要检查n/2个元素
- 空间复杂度：O(1) —— 只需要常数个变量

### 线性查找的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 线性查找
 * 
 * 从数组的第一个元素开始，逐个与目标值比较
 * 如果找到目标值，返回其索引
 * 如果遍历完整个数组仍未找到，返回-1
 * 
 * 时间复杂度：
 * - 最优：O(1)（目标在第一个位置）
 * - 最坏：O(n)（目标在最后一个位置或不存在）
 * - 平均：O(n/2) ≈ O(n)
 * 
 * 空间复杂度：O(1)
 * 
 * 适用场景：
 * 1. 数组无序
 * 2. 数据量较小
 * 3. 只需查找一次
 * 4. 数组频繁插入和删除（维护有序性代价大）
 * 
 * @param arr    待查找的数组
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值的索引，未找到返回-1
 */
int linear_search(int arr[], int n, int target) {
    // 遍历数组中的每个元素
    for (int i = 0; i < n; i++) {
        // 如果当前元素等于目标值，返回索引
        if (arr[i] == target) {
            return i;
        }
    }
    // 遍历完整个数组，未找到目标值
    return -1;
}

/**
 * 线性查找 - 带哨兵优化版本
 * 
 * 将目标值放在数组末尾作为哨兵
 * 这样可以省略循环中的边界检查 i < n
 * 每次循环只需要检查 arr[i] != target
 * 
 * 注意：这个版本需要数组有n+1个位置
 * 最后一个位置用于存放哨兵
 * 
 * 优点：减少了一次比较操作（不再需要检查i < n）
 * 缺点：需要修改数组，且数组需要有额外空间
 * 
 * @param arr    待查找的数组（必须有n+1个位置）
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值的索引，未找到返回-1
 */
int linear_search_sentinel(int arr[], int n, int target) {
    // 将目标值放在数组末尾作为哨兵
    arr[n] = target;
    
    int i = 0;
    // 循环条件只需要检查是否等于目标值
    // 不需要检查是否越界，因为哨兵保证了循环一定会终止
    while (arr[i] != target) {
        i++;
    }
    
    // 如果i == n，说明在哨兵位置才找到，即原数组中不存在目标值
    if (i == n) {
        return -1;
    }
    return i;
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
 * 线性查找测试主函数
 */
int main() {
    printf("=== 线性查找测试 ===\n\n");
    
    // 测试用例1：在数组中查找存在的元素
    int arr1[] = {15, 23, 8, 42, 4, 16, 31, 9, 55, 12};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    int target1 = 31;
    
    printf("数组: ");
    print_array(arr1, n1);
    printf("查找目标: %d\n", target1);
    
    int result1 = linear_search(arr1, n1, target1);
    if (result1 != -1) {
        printf("找到目标值 %d，位于索引 %d\n", target1, result1);
    } else {
        printf("未找到目标值 %d\n", target1);
    }
    printf("\n");
    
    // 测试用例2：查找不存在的元素
    int target2 = 100;
    printf("查找目标: %d\n", target2);
    int result2 = linear_search(arr1, n1, target2);
    if (result2 != -1) {
        printf("找到目标值 %d，位于索引 %d\n", target2, result2);
    } else {
        printf("未找到目标值 %d\n", target2);
    }
    printf("\n");
    
    // 测试用例3：查找重复元素（返回第一个匹配的索引）
    printf("=== 重复元素查找测试 ===\n");
    int arr3[] = {5, 2, 8, 2, 9, 2, 1, 2};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("数组: ");
    print_array(arr3, n3);
    printf("查找第一个2: 索引=%d\n", linear_search(arr3, n3, 2));
    printf("（线性查找返回第一个匹配项）\n\n");
    
    // 测试用例4：带哨兵的线性查找
    printf("=== 带哨兵的线性查找测试 ===\n");
    int arr4[11] = {15, 23, 8, 42, 4, 16, 31, 9, 55, 12};  // 预留哨兵位置
    int n4 = 10;
    printf("数组: ");
    print_array(arr4, n4);
    printf("查找目标: 31\n");
    int result4 = linear_search_sentinel(arr4, n4, 31);
    printf("哨兵版查找结果: 索引=%d\n", result4);
    printf("\n");
    
    // 测试用例5：查找所有匹配项
    printf("=== 查找所有匹配项 ===\n");
    int arr5[] = {3, 7, 2, 7, 9, 7, 1, 5, 7, 4};
    int n5 = sizeof(arr5) / sizeof(arr5[0]);
    int target5 = 7;
    printf("数组: ");
    print_array(arr5, n5);
    printf("查找所有值为%d的位置: ", target5);
    int found_count = 0;
    for (int i = 0; i < n5; i++) {
        if (arr5[i] == target5) {
            printf("%d ", i);
            found_count++;
        }
    }
    if (found_count == 0) {
        printf("未找到");
    }
    printf("\n共找到%d个匹配项\n", found_count);
    
    return 0;
}
```

### 线性查找的深入分析

线性查找虽然简单，但在某些场景下仍然是最佳选择：

1. **数据无序**：如果数据没有排序，线性查找是唯一的选择（除非使用哈希表等数据结构）。
2. **数据量小**：当n很小时，线性查找的常数因子最小，实际运行速度可能超过复杂度更低的算法。
3. **频繁更新**：如果数据频繁插入和删除，维护有序性的代价可能超过查找的收益。
4. **链表查找**：在链表中，只能使用线性查找，因为链表不支持随机访问。

线性查找的变体：
- **哨兵查找**：通过设置哨兵消除边界检查，在某些架构上能提升性能。
- **自组织查找**：将频繁访问的元素移到前面，减少后续查找的时间。
- **无序查找的并行化**：线性查找天然适合并行化，可以同时检查多个元素。

## 二分查找

### 二分查找的基本原理

二分查找（Binary Search），也称为折半查找，是一种在有序数组中查找目标值的高效算法。它的基本思想是：每次将查找范围缩小一半，直到找到目标值或查找范围为空。

二分查找的前提是数组必须有序。如果数组不是有序的，需要先排序（O(n log n)）再进行二分查找（O(log n)），总时间复杂度为O(n log n)。如果只需要查找一次，线性查找（O(n)）可能更优；但如果需要多次查找，先排序再二分查找会更高效。

二分查找的过程如下：

```
在有序数组[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]中查找23

步骤1：left=0, right=9, mid=4
arr[4]=16 < 23, 目标在右半部分
left = mid + 1 = 5

步骤2：left=5, right=9, mid=7
arr[7]=56 > 23, 目标在左半部分
right = mid - 1 = 6

步骤3：left=5, right=6, mid=5
arr[5]=23 == 23, 找到目标！
返回索引5
```

二分查找的关键在于边界条件的处理。每次迭代中，我们根据arr[mid]与target的比较结果，将查找范围缩小到左半部分（right = mid - 1）或右半部分（left = mid + 1）。循环终止条件是left > right，此时查找范围为空，表示未找到目标值。

### 二分查找的迭代实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 二分查找 - 迭代版本
 * 
 * 算法原理：
 * 在有序数组中，每次将查找范围缩小一半
 * 比较中间元素与目标值，决定在哪一半继续查找
 * 
 * 边界条件分析：
 * - left <= right：当left == right时，查找范围还有一个元素，需要检查
 * - left = mid + 1：目标值大于中间值，排除中间值和左半部分
 * - right = mid - 1：目标值小于中间值，排除中间值和右半部分
 * 
 * 时间复杂度：O(log n) - 每次将查找范围减半
 * 空间复杂度：O(1) - 只使用常数个变量
 * 
 * 注意：二分查找要求数组已经有序
 * 
 * @param arr    有序数组（升序排列）
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值的索引，未找到返回-1
 */
int binary_search_iterative(int arr[], int n, int target) {
    // 定义查找范围的左右边界
    int left = 0;
    int right = n - 1;
    
    // 当左边界不大于右边界时，查找范围非空，继续查找
    while (left <= right) {
        // 计算中间位置
        // 使用 left + (right - left) / 2 而不是 (left + right) / 2
        // 是为了避免 left + right 可能溢出
        int mid = left + (right - left) / 2;
        
        // 情况1：中间元素等于目标值
        if (arr[mid] == target) {
            return mid;  // 找到目标值，返回索引
        }
        // 情况2：中间元素小于目标值
        // 目标值在右半部分，缩小左边界
        else if (arr[mid] < target) {
            left = mid + 1;
        }
        // 情况3：中间元素大于目标值
        // 目标值在左半部分，缩小右边界
        else {
            right = mid - 1;
        }
    }
    
    // 查找范围为空（left > right），未找到目标值
    return -1;
}

/**
 * 二分查找 - 查找第一次出现的位置
 * 
 * 在包含重复元素的有序数组中，查找目标值第一次出现的位置
 * 
 * 关键区别：当arr[mid] == target时，不立即返回
 * 而是继续在左半部分查找，直到找到最左边的匹配项
 * 
 * @param arr    有序数组（升序排列）
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值第一次出现的索引，未找到返回-1
 */
int binary_search_first(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    int result = -1;  // 记录找到的位置
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            result = mid;        // 记录当前位置
            right = mid - 1;     // 继续在左半部分查找
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

/**
 * 二分查找 - 查找最后一次出现的位置
 * 
 * 在包含重复元素的有序数组中，查找目标值最后一次出现的位置
 * 当arr[mid] == target时，继续在右半部分查找
 * 
 * @param arr    有序数组（升序排列）
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值最后一次出现的索引，未找到返回-1
 */
int binary_search_last(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            result = mid;        // 记录当前位置
            left = mid + 1;      // 继续在右半部分查找
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
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
 * 二分查找测试主函数
 */
int main() {
    printf("=== 二分查找（迭代版）测试 ===\n\n");
    
    // 测试用例1：基本查找
    int arr1[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("有序数组: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试查找存在的元素
    int tests[] = {23, 2, 91, 8, 56};
    int num_tests = sizeof(tests) / sizeof(tests[0]);
    for (int i = 0; i < num_tests; i++) {
        int target = tests[i];
        int result = binary_search_iterative(arr1, n1, target);
        printf("查找 %d: ", target);
        if (result != -1) {
            printf("找到，位于索引 %d\n", result);
        } else {
            printf("未找到\n");
        }
    }
    printf("\n");
    
    // 测试用例2：查找不存在的元素
    printf("=== 查找不存在的元素 ===\n");
    int targets2[] = {1, 15, 50, 100};
    for (int i = 0; i < 4; i++) {
        int result = binary_search_iterative(arr1, n1, targets2[i]);
        printf("查找 %d: %s\n", targets2[i], 
               result == -1 ? "未找到" : "找到");
    }
    printf("\n");
    
    // 测试用例3：在包含重复元素的数组中查找
    printf("=== 重复元素查找测试 ===\n");
    int arr3[] = {1, 2, 2, 2, 3, 4, 5, 5, 5, 5, 6, 7, 8};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("有序数组（含重复元素）: ");
    print_array(arr3, n3);
    printf("\n");
    
    int target3 = 5;
    printf("查找 %d:\n", target3);
    printf("  任意位置: %d\n", binary_search_iterative(arr3, n3, target3));
    printf("  第一次出现: %d\n", binary_search_first(arr3, n3, target3));
    printf("  最后一次出现: %d\n", binary_search_last(arr3, n3, target3));
    printf("\n");
    
    // 测试用例4：边界条件测试
    printf("=== 边界条件测试 ===\n");
    int arr4[] = {10};
    int n4 = 1;
    printf("单元素数组 [10]:\n");
    printf("  查找10: %d\n", binary_search_iterative(arr4, n4, 10));
    printf("  查找5: %d\n", binary_search_iterative(arr4, n4, 5));
    printf("  查找15: %d\n", binary_search_iterative(arr4, n4, 15));
    printf("\n");
    
    int arr5[] = {10, 20};
    int n5 = 2;
    printf("两元素数组 [10, 20]:\n");
    printf("  查找10: %d\n", binary_search_iterative(arr5, n5, 10));
    printf("  查找20: %d\n", binary_search_iterative(arr5, n5, 20));
    printf("  查找15: %d\n", binary_search_iterative(arr5, n5, 15));
    
    return 0;
}
```

### 二分查找的递归实现

二分查找也可以用递归方式实现。递归版本更加简洁，但需要注意递归调用的栈空间开销。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 二分查找 - 递归版本
 * 
 * 算法原理：
 * 递归地将查找范围缩小一半
 * 每次递归调用处理一个子问题
 * 
 * 递归终止条件：
 * 1. left > right：查找范围为空，未找到
 * 2. arr[mid] == target：找到目标值
 * 
 * 递归关系：
 * 如果 arr[mid] < target，在右半部分递归查找
 * 如果 arr[mid] > target，在左半部分递归查找
 * 
 * 时间复杂度：O(log n)
 * 空间复杂度：O(log n) - 递归调用栈的深度
 * 
 * 递归版本 vs 迭代版本：
 * - 递归版本更简洁，更接近数学定义
 * - 迭代版本空间效率更高，没有递归开销
 * - 在实际项目中，迭代版本更常用
 * 
 * @param arr    有序数组（升序排列）
 * @param left   查找范围的左边界
 * @param right  查找范围的右边界
 * @param target 要查找的目标值
 * @return       目标值的索引，未找到返回-1
 */
int binary_search_recursive(int arr[], int left, int right, int target) {
    // 递归终止条件：查找范围为空
    if (left > right) {
        return -1;
    }
    
    // 计算中间位置
    int mid = left + (right - left) / 2;
    
    // 找到目标值
    if (arr[mid] == target) {
        return mid;
    }
    // 目标值在右半部分，递归查找右半部分
    else if (arr[mid] < target) {
        return binary_search_recursive(arr, mid + 1, right, target);
    }
    // 目标值在左半部分，递归查找左半部分
    else {
        return binary_search_recursive(arr, left, mid - 1, target);
    }
}

/**
 * 二分查找递归版的包装函数
 */
int binary_search(int arr[], int n, int target) {
    return binary_search_recursive(arr, 0, n - 1, target);
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
 * 二分查找递归版测试主函数
 */
int main() {
    printf("=== 二分查找（递归版）测试 ===\n\n");
    
    // 测试数组
    int arr[] = {3, 7, 12, 18, 25, 31, 42, 56, 67, 89};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("有序数组: ");
    print_array(arr, n);
    printf("\n");
    
    // 测试所有可能的情况
    printf("=== 查找测试 ===\n");
    for (int i = 0; i < n; i++) {
        int result = binary_search_recursive(arr, 0, n - 1, arr[i]);
        printf("查找 %d: 索引=%d, 验证=%s\n", 
               arr[i], result, (result == i) ? "正确" : "错误");
    }
    printf("\n");
    
    // 测试查找不存在的元素
    printf("=== 查找不存在的元素 ===\n");
    int missing[] = {0, 10, 35, 50, 100};
    for (int i = 0; i < 5; i++) {
        int result = binary_search_recursive(arr, 0, n - 1, missing[i]);
        printf("查找 %d: %s\n", missing[i], 
               result == -1 ? "未找到（正确）" : "找到（错误！）");
    }
    printf("\n");
    
    // 测试查找第一个元素
    printf("=== 特殊位置测试 ===\n");
    printf("第一个元素(3): %d\n", binary_search_recursive(arr, 0, n - 1, 3));
    printf("最后一个元素(89): %d\n", binary_search_recursive(arr, 0, n - 1, 89));
    printf("中间元素(25): %d\n", binary_search_recursive(arr, 0, n - 1, 25));
    printf("\n");
    
    // 演示递归调用过程
    printf("=== 递归调用过程演示 ===\n");
    printf("查找目标值: 42\n");
    printf("调用1: left=0, right=9, mid=4, arr[4]=25 < 42 → 查找右半\n");
    printf("调用2: left=5, right=9, mid=7, arr[7]=56 > 42 → 查找左半\n");
    printf("调用3: left=5, right=6, mid=5, arr[5]=31 < 42 → 查找右半\n");
    printf("调用4: left=6, right=6, mid=6, arr[6]=42 == 42 → 找到！\n");
    printf("结果: 索引=6\n");
    
    return 0;
}
```

### 二分查找的边界条件深入分析

二分查找的边界条件是初学者最容易出错的地方。下面我们详细分析几个关键的边界条件。

**1. while循环条件：left <= right 还是 left < right？**

使用`left <= right`：当left == right时，查找范围还有一个元素，需要检查。这是最常用的写法。

使用`left < right`：当left == right时，循环退出。需要在循环结束后额外检查arr[left]是否等于target。

**2. 中间位置计算：mid = (left + right) / 2 还是 mid = left + (right - left) / 2？**

使用`mid = left + (right - left) / 2`：安全，不会溢出。推荐使用。

使用`mid = (left + right) / 2`：当left和right都很大时，left + right可能溢出int范围。

**3. 边界更新：left = mid + 1 还是 left = mid？**

使用`left = mid + 1`：正确，mid已经检查过了，不在查找范围内。

使用`left = mid`：可能导致死循环。例如left=0, right=1, mid=0，如果arr[0] < target，left = mid = 0，不会缩小范围。

**4. 查找插入位置：lower_bound的实现**

lower_bound查找第一个大于等于target的位置，这是C++ STL中常用的操作。实现如下：

```c
/**
 * 查找第一个大于等于target的位置
 * 即target的插入位置（保持数组有序）
 * 
 * 这实际上就是C++ STL中的std::lower_bound
 * 
 * @param arr    有序数组（升序排列）
 * @param n      数组长度
 * @param target 目标值
 * @return       第一个 >= target 的位置
 */
int lower_bound(int arr[], int n, int target) {
    int left = 0;
    int right = n;  // 注意：right = n，不是 n-1
                     // 因为插入位置可能在数组末尾
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;  // 返回第一个 >= target 的位置
}
```

## 插值查找

### 插值查找的基本原理

插值查找（Interpolation Search）是二分查找的一种改进版本。二分查找每次都取中间位置，而插值查找根据目标值在数组中的大致位置来估算查找位置。它类似于在字典中查找单词——如果目标单词以'a'开头，我们会从字典的前面开始翻；如果以'z'开头，则从后面开始翻。

插值查找假设数据是均匀分布的，根据线性插值公式计算要查找的位置：

```
pos = low + (target - arr[low]) * (high - low) / (arr[high] - arr[low])
```

其中：
- `(target - arr[low])` 表示目标值到低端值的距离
- `(arr[high] - arr[low])` 表示整个范围的长度
- 这个比值反映了目标值在数组中的大致位置比例

插值查找在数据均匀分布时，时间复杂度可以达到O(log log n)，优于二分查找的O(log n)。但当数据分布不均匀时，最坏情况下可能退化为O(n)。

### 插值查找的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 插值查找
 * 
 * 算法原理：
 * 根据目标值在数组中的大致位置来估算查找位置
 * 使用线性插值公式计算下一个要检查的位置
 * 
 * 插值公式：
 * pos = low + (target - arr[low]) * (high - low) / (arr[high] - arr[low])
 * 
 * 时间复杂度：
 * - 最优：O(log log n)（数据均匀分布）
 * - 最坏：O(n)（数据分布极不均匀）
 * - 平均：O(log log n)（数据均匀分布）
 * 
 * 空间复杂度：O(1)
 * 
 * 适用条件：
 * 1. 数组有序
 * 2. 数据均匀分布（这是关键前提）
 * 3. 数据量大（数据量小时，二分查找也足够快）
 * 
 * 注意事项：
 * 1. 需要确保 arr[high] != arr[low]，否则会除以零
 * 2. 需要检查target是否在数组范围内
 * 3. 对于非均匀分布的数据，性能可能不如二分查找
 * 
 * @param arr    有序数组（升序排列，数据均匀分布）
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值的索引，未找到返回-1
 */
int interpolation_search(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;
    
    // 当查找范围有效且目标值在范围内时，继续查找
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        // 如果low == high，说明只有一个元素
        if (low == high) {
            if (arr[low] == target) return low;
            return -1;
        }
        
        // 使用插值公式计算估算位置
        // 注意：需要将乘法转换为更安全的写法
        // pos = low + (target - arr[low]) * (high - low) / (arr[high] - arr[low])
        int pos = low + (int)(((long long)(target - arr[low]) * (high - low)) 
                   / (arr[high] - arr[low]));
        
        // 确保pos在有效范围内
        if (pos < low || pos > high) {
            break;
        }
        
        // 情况1：找到目标值
        if (arr[pos] == target) {
            return pos;
        }
        // 情况2：目标值大于估算位置的值，在右半部分查找
        else if (arr[pos] < target) {
            low = pos + 1;
        }
        // 情况3：目标值小于估算位置的值，在左半部分查找
        else {
            high = pos - 1;
        }
    }
    
    return -1;
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
 * 插值查找测试主函数
 */
int main() {
    printf("=== 插值查找测试 ===\n\n");
    
    // 测试用例1：均匀分布的数据
    int arr1[] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("均匀分布数组: ");
    print_array(arr1, n1);
    printf("\n");
    
    printf("查找测试:\n");
    int targets[] = {10, 50, 90, 30, 70, 100};
    for (int i = 0; i < 6; i++) {
        int result = interpolation_search(arr1, n1, targets[i]);
        printf("  查找 %d: %s", targets[i],
               result != -1 ? "找到" : "未找到");
        if (result != -1) printf(" (索引=%d)", result);
        printf("\n");
    }
    printf("\n");
    
    // 测试用例2：非均匀分布的数据
    printf("=== 非均匀分布数据测试 ===\n");
    int arr2[] = {1, 2, 3, 4, 5, 100, 200, 300, 400, 500};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("非均匀分布数组: ");
    print_array(arr2, n2);
    printf("查找 5: 索引=%d\n", interpolation_search(arr2, n2, 5));
    printf("查找 100: 索引=%d\n", interpolation_search(arr2, n2, 100));
    printf("（非均匀分布时，插值查找可能不如二分查找高效）\n\n");
    
    // 测试用例3：插值查找与二分查找的效率对比
    printf("=== 效率对比测试 ===\n");
    int n3 = 1000000;
    int* arr3 = (int*)malloc(n3 * sizeof(int));
    
    // 生成均匀分布的数据
    for (int i = 0; i < n3; i++) {
        arr3[i] = i * 2;  // 0, 2, 4, 6, ..., 1999998
    }
    
    srand((unsigned int)time(NULL));
    int test_targets[100];
    for (int i = 0; i < 100; i++) {
        test_targets[i] = rand() % n3 * 2;
    }
    
    // 测试插值查找
    clock_t start = clock();
    for (int i = 0; i < 100; i++) {
        interpolation_search(arr3, n3, test_targets[i]);
    }
    clock_t end = clock();
    printf("插值查找（100次）: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    
    // 测试二分查找（迭代版）
    start = clock();
    for (int i = 0; i < 100; i++) {
        int left = 0, right = n3 - 1;
        int target = test_targets[i];
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr3[mid] == target) break;
            else if (arr3[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
    }
    end = clock();
    printf("二分查找（100次）: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    
    printf("（在均匀分布的大数据量下，插值查找明显更快）\n");
    
    free(arr3);
    return 0;
}
```

## 斐波那契查找

### 斐波那契查找的基本原理

斐波那契查找（Fibonacci Search）是二分查找的另一种变体，它使用斐波那契数列来分割查找范围。与二分查找每次将数组分成两半不同，斐波那契查找将数组分成两个长度近似黄金比例（0.618:0.382）的部分。

斐波那契数列定义为：F(0)=0, F(1)=1, F(k)=F(k-1)+F(k-2)。

斐波那契查找的核心思想是：找到一个最小的斐波那契数F(k)，使得F(k) >= n+1，然后将数组的前F(k-1)-1个元素和后F(k-2)-1个元素作为两个子数组。这样，分割点就是mid = low + F(k-1) - 1。

斐波那契查找的优点是：在查找过程中，分割点只需要加法和减法运算，不需要除法。这在某些硬件上可以提高效率。

### 斐波那契查找的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 生成斐波那契数列
 * 
 * @param fib 用于存储斐波那契数列的数组
 * @param n   数组大小
 */
void generate_fibonacci(int fib[], int n) {
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
}

/**
 * 斐波那契查找
 * 
 * 算法原理：
 * 使用斐波那契数列来分割查找范围
 * 分割点不是中间位置，而是黄金分割点
 * 
 * 查找过程：
 * 1. 找到最小的斐波那契数F(k) >= n+1
 * 2. 将数组扩展到F(k)-1的长度（多出的位置用arr[n-1]填充）
 * 3. 分割点mid = low + F(k-1) - 1
 * 4. 比较arr[mid]和target，决定下一步
 * 
 * 时间复杂度：O(log n)
 * 空间复杂度：O(1)（不包括斐波那契数列的预计算）
 * 
 * 优点：
 * 1. 只需要加法和减法，不需要除法
 * 2. 在查找过程中，每次的偏移量都是斐波那契数
 * 3. 在某些不支持除法运算的硬件上效率更高
 * 
 * 缺点：
 * 1. 需要额外的空间来存储斐波那契数列
 * 2. 实现复杂度高于二分查找
 * 3. 实际性能提升有限
 * 
 * @param arr    有序数组（升序排列）
 * @param n      数组长度
 * @param target 要查找的目标值
 * @return       目标值的索引，未找到返回-1
 */
int fibonacci_search(int arr[], int n, int target) {
    if (n == 0) return -1;
    
    // 准备斐波那契数列
    int fib[50];  // 足够大，F(46)已经超过2^31
    generate_fibonacci(fib, 50);
    
    // 找到最小的斐波那契数F(k) >= n+1
    int k = 0;
    while (fib[k] < n + 1) {
        k++;
    }
    
    // 创建临时数组，大小为F(k)
    // 将原数组的元素复制到临时数组中
    // 多出的位置用arr[n-1]填充
    int* temp = (int*)malloc(fib[k] * sizeof(int));
    for (int i = 0; i < n; i++) {
        temp[i] = arr[i];
    }
    for (int i = n; i < fib[k]; i++) {
        temp[i] = arr[n - 1];  // 用最后一个元素填充
    }
    
    // 斐波那契查找
    int low = 0;
    int high = n - 1;  // 注意：high指向原数组的最后一个元素
    
    while (low <= high) {
        // 计算分割点
        int mid = low + fib[k - 1] - 1;
        
        // 确保mid不超过原数组的范围
        if (mid >= n) {
            mid = n - 1;
        }
        
        // 情况1：找到目标值
        if (temp[mid] == target) {
            // 如果mid在原数组范围内，返回mid
            // 否则返回n-1（因为填充的元素都等于arr[n-1]）
            int result = (mid < n) ? mid : n - 1;
            free(temp);
            return result;
        }
        // 情况2：目标值大于当前位置的值，在右半部分查找
        else if (temp[mid] < target) {
            low = mid + 1;
            k = k - 2;  // 右半部分的长度是F(k-2)
        }
        // 情况3：目标值小于当前位置的值，在左半部分查找
        else {
            high = mid - 1;
            k = k - 1;  // 左半部分的长度是F(k-1)
        }
    }
    
    free(temp);
    return -1;
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
 * 斐波那契查找测试主函数
 */
int main() {
    printf("=== 斐波那契查找测试 ===\n\n");
    
    // 测试用例1：基本查找
    int arr1[] = {10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("有序数组: ");
    print_array(arr1, n1);
    printf("\n");
    
    printf("查找测试:\n");
    int targets[] = {10, 45, 85, 100, 35, 50, 15, 95};
    for (int i = 0; i < 8; i++) {
        int result = fibonacci_search(arr1, n1, targets[i]);
        printf("  查找 %d: ", targets[i]);
        if (result != -1) {
            printf("找到 (索引=%d, 值=%d)\n", result, arr1[result]);
        } else {
            printf("未找到\n");
        }
    }
    printf("\n");
    
    // 测试用例2：三种查找算法对比
    printf("=== 三种查找算法对比 ===\n");
    int arr2[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91, 105, 138, 167, 199, 234};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("测试数组: ");
    print_array(arr2, n2);
    printf("\n");
    
    int target = 72;
    printf("查找目标: %d\n", target);
    printf("  二分查找: 分割点为中间位置\n");
    printf("  插值查找: 分割点根据值的分布估算\n");
    printf("  斐波那契查找: 分割点根据黄金比例计算\n");
    printf("  结果: 索引=%d (值=%d)\n", fibonacci_search(arr2, n2, target), target);
    printf("\n");
    
    // 测试用例3：大规模数据测试
    printf("=== 大规模数据测试 ===\n");
    int n3 = 1000000;
    int* arr3 = (int*)malloc(n3 * sizeof(int));
    for (int i = 0; i < n3; i++) {
        arr3[i] = i * 2;
    }
    
    srand((unsigned int)time(NULL));
    int test_targets[100];
    for (int i = 0; i < 100; i++) {
        test_targets[i] = rand() % n3 * 2;
    }
    
    clock_t start = clock();
    for (int i = 0; i < 100; i++) {
        fibonacci_search(arr3, n3, test_targets[i]);
    }
    clock_t end = clock();
    printf("斐波那契查找（100次）: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    
    free(arr3);
    return 0;
}
```

## 单链表及其反转

### 单链表的基本概念

单链表（Singly Linked List）是一种线性数据结构，它由一系列节点组成，每个节点包含数据域和指向下一个节点的指针。与数组不同，链表中的节点在内存中不一定是连续存储的，它们通过指针连接在一起。

单链表的结构如下：

```
[head] → [data|next] → [data|next] → [data|next] → NULL
```

单链表的核心操作包括：创建节点、插入节点、删除节点、遍历链表和反转链表。其中，链表反转是一个经典问题，在面试中经常出现，我们将重点讲解。

### 单链表的完整实现

```c
#include <stdio.h>
#include <stdlib.h>

/**
 * 单链表节点结构体
 */
typedef struct Node {
    int data;               // 数据域，存储整型数据
    struct Node* next;      // 指针域，指向下一个节点
} Node;

/**
 * 创建新节点
 * 
 * @param data 节点的数据值
 * @return     指向新创建的节点的指针
 */
Node* create_node(int data) {
    // 使用malloc在堆上分配内存
    Node* new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}

/**
 * 在链表头部插入节点
 * 
 * @param head 指向链表头指针的指针（需要修改头指针）
 * @param data 要插入的数据值
 */
void insert_at_head(Node** head, int data) {
    Node* new_node = create_node(data);
    new_node->next = *head;  // 新节点的next指向原来的头节点
    *head = new_node;         // 更新头指针指向新节点
}

/**
 * 在链表尾部插入节点
 * 
 * @param head 指向链表头指针的指针
 * @param data 要插入的数据值
 */
void insert_at_tail(Node** head, int data) {
    Node* new_node = create_node(data);
    
    // 如果链表为空，新节点就是头节点
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    
    // 遍历到链表末尾
    Node* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
}

/**
 * 删除指定值的节点
 * 
 * @param head 指向链表头指针的指针
 * @param data 要删除的数据值
 * @return     1表示删除成功，0表示未找到
 */
int delete_node(Node** head, int data) {
    if (*head == NULL) return 0;  // 空链表
    
    Node* temp = *head;
    Node* prev = NULL;
    
    // 如果要删除的是头节点
    if (temp != NULL && temp->data == data) {
        *head = temp->next;  // 更新头指针
        free(temp);           // 释放内存
        return 1;
    }
    
    // 遍历查找要删除的节点
    while (temp != NULL && temp->data != data) {
        prev = temp;
        temp = temp->next;
    }
    
    // 如果未找到
    if (temp == NULL) return 0;
    
    // 将前一个节点的next指向要删除节点的下一个节点
    prev->next = temp->next;
    free(temp);
    return 1;
}

/**
 * 打印链表
 */
void print_list(Node* head) {
    Node* current = head;
    printf("链表: ");
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) {
            printf(" -> ");
        }
        current = current->next;
    }
    printf(" -> NULL\n");
}

/**
 * 释放链表内存
 */
void free_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
}

/**
 * 单链表基本操作测试主函数
 */
int main() {
    printf("=== 单链表基本操作测试 ===\n\n");
    
    Node* head = NULL;
    
    // 测试尾部插入
    printf("1. 尾部插入元素:\n");
    insert_at_tail(&head, 10);
    insert_at_tail(&head, 20);
    insert_at_tail(&head, 30);
    insert_at_tail(&head, 40);
    insert_at_tail(&head, 50);
    print_list(head);
    printf("\n");
    
    // 测试头部插入
    printf("2. 头部插入元素:\n");
    insert_at_head(&head, 5);
    insert_at_head(&head, 1);
    print_list(head);
    printf("\n");
    
    // 测试删除
    printf("3. 删除元素:\n");
    printf("  删除20: ");
    delete_node(&head, 20);
    print_list(head);
    printf("  删除1（头节点）: ");
    delete_node(&head, 1);
    print_list(head);
    printf("  删除50（尾节点）: ");
    delete_node(&head, 50);
    print_list(head);
    printf("  删除100（不存在）: %s\n", 
           delete_node(&head, 100) ? "成功" : "未找到");
    print_list(head);
    
    free_list(head);
    return 0;
}
```

### 单链表反转 —— 三指针法

链表反转是一个经典问题。三指针法是最直观、最常用的反转方法，它使用三个指针（prev、current、next）来逐个反转节点的指向。

三指针反转法的过程如下：

```
原始链表: 1 -> 2 -> 3 -> 4 -> NULL

初始状态:
prev = NULL, current = 1, next = NULL

步骤1: next = current->next = 2
       current->next = prev = NULL
       prev = current = 1
       current = next = 2
       链表: NULL <- 1    2 -> 3 -> 4 -> NULL

步骤2: next = current->next = 3
       current->next = prev = 1
       prev = current = 2
       current = next = 3
       链表: NULL <- 1 <- 2    3 -> 4 -> NULL

步骤3: next = current->next = 4
       current->next = prev = 2
       prev = current = 3
       current = next = 4
       链表: NULL <- 1 <- 2 <- 3    4 -> NULL

步骤4: next = current->next = NULL
       current->next = prev = 3
       prev = current = 4
       current = next = NULL
       链表: NULL <- 1 <- 2 <- 3 <- 4

current == NULL，循环结束
prev指向新的头节点4
```

```c
#include <stdio.h>
#include <stdlib.h>

/**
 * 单链表节点结构体
 */
typedef struct Node {
    int data;
    struct Node* next;
} Node;

/**
 * 创建新节点
 */
Node* create_node(int data) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}

/**
 * 在链表尾部插入节点
 */
void insert_at_tail(Node** head, int data) {
    Node* new_node = create_node(data);
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    Node* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
}

/**
 * 单链表反转 - 三指针法
 * 
 * 算法原理：
 * 使用三个指针prev、current、next
 * 逐个反转每个节点的next指针方向
 * 
 * 步骤：
 * 1. 初始化：prev = NULL, current = head
 * 2. 在循环中：
 *    a. 保存current->next到next
 *    b. 将current->next指向prev
 *    c. 移动prev和current向前一步
 * 3. 循环结束后，prev指向新的头节点
 * 
 * 时间复杂度：O(n) - 需要遍历每个节点一次
 * 空间复杂度：O(1) - 只使用三个指针变量
 * 
 * 关键点：
 * 1. 必须先保存current->next，否则会丢失后续节点
 * 2. 反转后原来的头节点成为尾节点，其next为NULL
 * 3. 反转后原来的尾节点成为头节点
 * 
 * @param head 链表的头节点
 * @return     反转后的链表头节点
 */
Node* reverse_list_iterative(Node* head) {
    Node* prev = NULL;     // 前一个节点，初始为NULL
    Node* current = head;  // 当前节点，从head开始
    Node* next = NULL;     // 下一个节点，用于保存后续节点
    
    // 遍历链表，逐个反转
    while (current != NULL) {
        // 步骤1：保存当前节点的下一个节点
        // 必须在修改current->next之前保存，否则会丢失后续节点
        next = current->next;
        
        // 步骤2：反转当前节点的指针
        // 将当前节点的next指向前一个节点
        current->next = prev;
        
        // 步骤3：移动prev和current指针
        // prev移动到当前位置
        prev = current;
        // current移动到下一个位置
        current = next;
    }
    
    // 循环结束时，current为NULL，prev指向原链表的最后一个节点
    // 即新链表的头节点
    return prev;
}

/**
 * 打印链表
 */
void print_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) {
            printf(" -> ");
        }
        current = current->next;
    }
    printf(" -> NULL\n");
}

/**
 * 释放链表
 */
void free_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
}

/**
 * 三指针反转法测试主函数
 */
int main() {
    printf("=== 单链表反转（三指针法）测试 ===\n\n");
    
    // 测试用例1：多节点链表
    Node* head1 = NULL;
    for (int i = 1; i <= 5; i++) {
        insert_at_tail(&head1, i);
    }
    printf("原始链表:    ");
    print_list(head1);
    head1 = reverse_list_iterative(head1);
    printf("反转后链表:  ");
    print_list(head1);
    printf("\n");
    
    // 测试用例2：单节点链表
    printf("=== 单节点链表测试 ===\n");
    Node* head2 = create_node(42);
    printf("原始链表:    ");
    print_list(head2);
    head2 = reverse_list_iterative(head2);
    printf("反转后链表:  ");
    print_list(head2);
    printf("\n");
    
    // 测试用例3：空链表
    printf("=== 空链表测试 ===\n");
    Node* head3 = NULL;
    printf("原始链表:    NULL\n");
    head3 = reverse_list_iterative(head3);
    printf("反转后链表:  %s\n", head3 == NULL ? "NULL" : "非空");
    printf("\n");
    
    // 测试用例4：再反转一次验证
    printf("=== 再次反转验证 ===\n");
    head1 = reverse_list_iterative(head1);
    printf("再次反转:    ");
    print_list(head1);
    printf("（应该恢复为原始顺序 1 -> 2 -> 3 -> 4 -> 5）\n");
    
    free_list(head1);
    free_list(head2);
    return 0;
}
```

### 单链表反转 —— 递归法

递归法是另一种反转链表的方法。递归法的思路是：先递归反转子链表，然后将当前节点添加到反转后的子链表的末尾。

递归反转法的过程：

```
递归反转链表 1 -> 2 -> 3 -> 4 -> NULL

递归调用链：
reverse(1) → reverse(2) → reverse(3) → reverse(4)

reverse(4): head=4, head->next=NULL
           返回 4 (新的头节点)

reverse(3): head=3, head->next=4
           调用 reverse(4) 返回 4
           head->next->next = head  →  4->next = 3
           head->next = NULL        →  3->next = NULL
           返回 4

reverse(2): head=2, head->next=3
           调用 reverse(3) 返回 4
           head->next->next = head  →  3->next = 2
           head->next = NULL        →  2->next = NULL
           返回 4

reverse(1): head=1, head->next=2
           调用 reverse(2) 返回 4
           head->next->next = head  →  2->next = 1
           head->next = NULL        →  1->next = NULL
           返回 4

最终结果：4 -> 3 -> 2 -> 1 -> NULL
```

```c
#include <stdio.h>
#include <stdlib.h>

/**
 * 单链表节点结构体
 */
typedef struct Node {
    int data;
    struct Node* next;
} Node;

/**
 * 创建新节点
 */
Node* create_node(int data) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}

/**
 * 在链表尾部插入节点
 */
void insert_at_tail(Node** head, int data) {
    Node* new_node = create_node(data);
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    Node* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
}

/**
 * 单链表反转 - 递归法
 * 
 * 算法原理：
 * 递归地反转子链表，然后调整当前节点的指针
 * 
 * 递归过程：
 * 1. 递归终止条件：head为NULL或head->next为NULL
 *    （空链表或单节点链表，直接返回head）
 * 2. 递归调用reverse_recursive(head->next)
 *    得到反转后的子链表的头节点
 * 3. 将当前节点添加到反转后子链表的末尾：
 *    head->next->next = head  （原来的后继节点现在指向当前节点）
 *    head->next = NULL          （当前节点现在是尾节点）
 * 
 * 时间复杂度：O(n) - 每个节点访问一次
 * 空间复杂度：O(n) - 递归调用栈深度为n
 * 
 * 递归法 vs 迭代法：
 * - 递归法代码更简洁，但需要O(n)的栈空间
 * - 迭代法空间效率更高，但代码稍复杂
 * - 递归法更容易理解递归思想
 * - 在实际项目中，迭代法更常用（避免栈溢出）
 * 
 * @param head 链表的头节点
 * @return     反转后的链表头节点
 */
Node* reverse_list_recursive(Node* head) {
    // 递归终止条件：
    // 1. head == NULL：空链表
    // 2. head->next == NULL：只有一个节点
    // 这两种情况下，直接返回head
    if (head == NULL || head->next == NULL) {
        return head;
    }
    
    // 递归反转子链表（从head->next开始）
    // new_head是反转后子链表的头节点
    Node* new_head = reverse_list_recursive(head->next);
    
    // 关键步骤：将当前节点添加到反转后子链表的末尾
    // head->next现在指向反转后子链表的最后一个节点
    // 将那个节点的next指向head（即反转head和head->next的关系）
    head->next->next = head;
    
    // 将head的next设为NULL
    // 因为head现在是反转后链表的最后一个节点
    head->next = NULL;
    
    // 返回新的头节点
    return new_head;
}

/**
 * 打印链表
 */
void print_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) {
            printf(" -> ");
        }
        current = current->next;
    }
    printf(" -> NULL\n");
}

/**
 * 释放链表
 */
void free_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
}

/**
 * 递归反转法测试主函数
 */
int main() {
    printf("=== 单链表反转（递归法）测试 ===\n\n");
    
    // 测试用例1：多节点链表
    Node* head1 = NULL;
    for (int i = 1; i <= 6; i++) {
        insert_at_tail(&head1, i * 10);
    }
    printf("原始链表:    ");
    print_list(head1);
    head1 = reverse_list_recursive(head1);
    printf("递归反转后:  ");
    print_list(head1);
    printf("\n");
    
    // 测试用例2：两种方法对比
    printf("=== 迭代法与递归法对比 ===\n");
    Node* head2 = NULL;
    for (int i = 1; i <= 5; i++) {
        insert_at_tail(&head2, i);
    }
    
    printf("原始链表: ");
    print_list(head2);
    
    // 迭代反转
    Node* iter_head = reverse_list_iterative(head2);
    printf("迭代反转: ");
    print_list(iter_head);
    
    // 递归反转（再反转回来）
    Node* recur_head = reverse_list_recursive(iter_head);
    printf("递归反转回来: ");
    print_list(recur_head);
    printf("（应该恢复为原始顺序）\n\n");
    
    // 测试用例3：演示递归过程
    printf("=== 递归过程演示 ===\n");
    printf("对于链表 A -> B -> C -> NULL\n");
    printf("reverse(A) 调用 reverse(B)\n");
    printf("  reverse(B) 调用 reverse(C)\n");
    printf("    reverse(C): C->next == NULL, 返回 C\n");
    printf("  B->next->next = B  →  C->next = B\n");
    printf("  B->next = NULL\n");
    printf("  返回 C\n");
    printf("A->next->next = A  →  B->next = A\n");
    printf("A->next = NULL\n");
    printf("返回 C\n");
    printf("最终: C -> B -> A -> NULL\n");
    
    free_list(recur_head);
    return 0;
}
```

## 双向链表

### 双向链表的基本概念

双向链表（Doubly Linked List）是单链表的扩展，每个节点除了包含指向下一个节点的指针（next）外，还包含指向前一个节点的指针（prev）。双向链表支持从两个方向遍历，插入和删除操作也更加灵活。

双向链表的结构如下：

```
NULL <- [prev|data|next] <-> [prev|data|next] <-> [prev|data|next] -> NULL
```

### 双向链表的完整实现

```c
#include <stdio.h>
#include <stdlib.h>

/**
 * 双向链表节点结构体
 */
typedef struct DNode {
    int data;               // 数据域
    struct DNode* prev;     // 指向前一个节点的指针
    struct DNode* next;     // 指向后一个节点的指针
} DNode;

/**
 * 创建新节点
 */
DNode* create_dnode(int data) {
    DNode* new_node = (DNode*)malloc(sizeof(DNode));
    if (new_node == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    new_node->data = data;
    new_node->prev = NULL;
    new_node->next = NULL;
    return new_node;
}

/**
 * 在链表头部插入节点
 */
void dlist_insert_head(DNode** head, int data) {
    DNode* new_node = create_dnode(data);
    new_node->next = *head;
    if (*head != NULL) {
        (*head)->prev = new_node;
    }
    *head = new_node;
}

/**
 * 在链表尾部插入节点
 */
void dlist_insert_tail(DNode** head, int data) {
    DNode* new_node = create_dnode(data);
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    DNode* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
    new_node->prev = current;
}

/**
 * 删除指定值的节点
 */
int dlist_delete(DNode** head, int data) {
    if (*head == NULL) return 0;
    
    DNode* current = *head;
    while (current != NULL && current->data != data) {
        current = current->next;
    }
    
    if (current == NULL) return 0;
    
    // 调整前一个节点的指针
    if (current->prev != NULL) {
        current->prev->next = current->next;
    } else {
        *head = current->next;  // 删除的是头节点
    }
    
    // 调整后一个节点的指针
    if (current->next != NULL) {
        current->next->prev = current->prev;
    }
    
    free(current);
    return 1;
}

/**
 * 正向打印链表
 */
void dlist_print_forward(DNode* head) {
    printf("正向: ");
    DNode* current = head;
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) printf(" <-> ");
        current = current->next;
    }
    printf(" -> NULL\n");
}

/**
 * 反向打印链表
 */
void dlist_print_backward(DNode* head) {
    if (head == NULL) {
        printf("反向: NULL\n");
        return;
    }
    // 先找到尾节点
    DNode* tail = head;
    while (tail->next != NULL) {
        tail = tail->next;
    }
    // 从尾节点开始反向遍历
    printf("反向: NULL <- ");
    DNode* current = tail;
    while (current != NULL) {
        printf("%d", current->data);
        if (current->prev != NULL) printf(" <-> ");
        current = current->prev;
    }
    printf("\n");
}

/**
 * 释放链表
 */
void dlist_free(DNode* head) {
    DNode* current = head;
    while (current != NULL) {
        DNode* temp = current;
        current = current->next;
        free(temp);
    }
}

/**
 * 双向链表测试主函数
 */
int main() {
    printf("=== 双向链表测试 ===\n\n");
    
    DNode* head = NULL;
    
    // 测试尾部插入
    printf("1. 尾部插入元素:\n");
    dlist_insert_tail(&head, 10);
    dlist_insert_tail(&head, 20);
    dlist_insert_tail(&head, 30);
    dlist_insert_tail(&head, 40);
    dlist_insert_tail(&head, 50);
    dlist_print_forward(head);
    dlist_print_backward(head);
    printf("\n");
    
    // 测试头部插入
    printf("2. 头部插入元素:\n");
    dlist_insert_head(&head, 5);
    dlist_insert_head(&head, 1);
    dlist_print_forward(head);
    dlist_print_backward(head);
    printf("\n");
    
    // 测试删除
    printf("3. 删除元素:\n");
    printf("  删除30: ");
    dlist_delete(&head, 30);
    dlist_print_forward(head);
    printf("  删除1（头节点）: ");
    dlist_delete(&head, 1);
    dlist_print_forward(head);
    printf("  删除50（尾节点）: ");
    dlist_delete(&head, 50);
    dlist_print_forward(head);
    printf("\n");
    
    // 测试双向遍历
    printf("4. 双向遍历验证:\n");
    dlist_print_forward(head);
    dlist_print_backward(head);
    
    dlist_free(head);
    return 0;
}
```

## 环形链表与约瑟夫环问题

### 环形链表的基本概念

环形链表（Circular Linked List）是一种特殊的链表，它的最后一个节点的next指针不是指向NULL，而是指向头节点（或某个节点），形成一个环。环形链表在约瑟夫环问题、循环队列、轮询调度等场景中非常有用。

### 约瑟夫环问题

约瑟夫环问题（Josephus Problem）是一个经典的数学问题：n个人围成一圈，从第1个人开始报数，每数到第m个人就将其淘汰，下一个人从1开始继续报数，直到只剩下一个人。求最后剩下的人的位置。

这个问题可以用环形链表来优雅地解决。我们创建一个包含n个节点的环形链表，然后模拟报数过程，每次删除第m个节点。

```c
#include <stdio.h>
#include <stdlib.h>

/**
 * 环形链表节点结构体
 */
typedef struct CNode {
    int data;               // 数据域（存储人的编号）
    struct CNode* next;     // 指针域，指向下一个节点
} CNode;

/**
 * 创建带有n个节点的环形链表
 * 节点编号从1到n
 * 
 * @param n 节点数量（人的数量）
 * @return  环形链表的头节点（编号为1的节点）
 */
CNode* create_circular_list(int n) {
    if (n <= 0) return NULL;
    
    // 创建第一个节点
    CNode* head = (CNode*)malloc(sizeof(CNode));
    head->data = 1;
    head->next = NULL;
    
    CNode* current = head;
    
    // 创建剩余的节点
    for (int i = 2; i <= n; i++) {
        CNode* new_node = (CNode*)malloc(sizeof(CNode));
        new_node->data = i;
        new_node->next = NULL;
        
        current->next = new_node;
        current = new_node;
    }
    
    // 将最后一个节点的next指向头节点，形成环
    current->next = head;
    
    return head;
}

/**
 * 打印环形链表（打印一圈）
 */
void print_circular_list(CNode* head, int n) {
    if (head == NULL) return;
    CNode* current = head;
    printf("环形链表: ");
    for (int i = 0; i < n; i++) {
        printf("%d", current->data);
        current = current->next;
        if (i < n - 1) printf(" -> ");
    }
    printf(" -> (回到起点)\n");
}

/**
 * 约瑟夫环问题的解
 * 
 * 问题描述：
 * n个人围成一圈，从第1个人开始报数
 * 每数到第m个人就将其淘汰
 * 下一个人从1开始继续报数
 * 直到只剩下一个人
 * 
 * 算法原理：
 * 1. 创建包含n个节点的环形链表
 * 2. 使用双指针遍历链表
 * 3. 每次移动m-1步，删除第m个节点
 * 4. 重复直到只剩下一个节点
 * 
 * 时间复杂度：O(n * m) - 每轮移动m步，共n-1轮
 * 空间复杂度：O(n) - 存储n个节点
 * 
 * 优化：
 * 使用数学递推公式可以在O(n)时间内解决：
 * f(1) = 0
 * f(i) = (f(i-1) + m) % i
 * 最后幸存者的编号为 f(n) + 1
 * 
 * @param n 总人数
 * @param m 报数到m的人被淘汰
 * @return  最后幸存者的编号
 */
int josephus_problem(int n, int m) {
    if (n <= 0) return -1;
    if (n == 1) return 1;
    
    // 创建环形链表
    CNode* head = create_circular_list(n);
    CNode* current = head;
    CNode* prev = NULL;
    
    printf("淘汰顺序: ");
    
    // 模拟淘汰过程，直到只剩下一个节点
    while (current->next != current) {  // 虽然条件检查的是next，但实际是检查是否只剩一个节点
        // 移动m-1步，找到要淘汰的节点的前一个节点
        for (int i = 1; i < m; i++) {
            prev = current;
            current = current->next;
        }
        
        // 此时current指向要淘汰的节点
        // prev指向它的前一个节点
        printf("%d ", current->data);
        
        // 将prev的next指向current的下一个节点
        prev->next = current->next;
        
        // 释放要淘汰的节点
        free(current);
        
        // current指向下一个节点（从淘汰节点的下一个开始继续报数）
        current = prev->next;
    }
    
    printf("\n");
    int survivor = current->data;
    free(current);
    
    return survivor;
}

/**
 * 约瑟夫环问题的数学解法
 * 使用递推公式，时间复杂度O(n)，空间复杂度O(1)
 */
int josephus_math(int n, int m) {
    if (n <= 0) return -1;
    
    int result = 0;  // f(1) = 0（0-based索引）
    // f(i) = (f(i-1) + m) % i
    for (int i = 2; i <= n; i++) {
        result = (result + m) % i;
    }
    return result + 1;  // 转换为1-based索引
}

/**
 * 约瑟夫环问题测试主函数
 */
int main() {
    printf("=== 约瑟夫环问题测试 ===\n\n");
    
    // 测试用例1：经典约瑟夫环
    int n1 = 41, m1 = 3;
    printf("约瑟夫环问题：n=%d, m=%d\n", n1, m1);
    printf("（传说中约瑟夫和40个士兵，每数到3的人自杀）\n");
    int survivor1 = josephus_problem(n1, m1);
    printf("幸存者编号: %d\n", survivor1);
    printf("数学解法验证: %d\n", josephus_math(n1, m1));
    printf("\n");
    
    // 测试用例2：小规模测试
    printf("=== 小规模测试 ===\n");
    int n2 = 7, m2 = 3;
    printf("n=%d, m=%d\n", n2, m2);
    printf("环形链表: ");
    CNode* head = create_circular_list(n2);
    print_circular_list(head, n2);
    int survivor2 = josephus_problem(n2, m2);
    printf("幸存者编号: %d\n", survivor2);
    printf("数学解法验证: %d\n", josephus_math(n2, m2));
    printf("\n");
    
    // 测试用例3：不同参数测试
    printf("=== 不同参数测试 ===\n");
    int test_cases[][2] = {{5, 2}, {10, 4}, {8, 5}, {6, 1}};
    for (int i = 0; i < 4; i++) {
        int n = test_cases[i][0];
        int m = test_cases[i][1];
        int result = josephus_math(n, m);
        printf("n=%d, m=%d → 幸存者编号: %d\n", n, m, result);
    }
    printf("\n");
    
    // 测试用例4：m=2的特殊情况
    printf("=== m=2 特殊情况 ===\n");
    printf("当m=2时，幸存者遵循特殊规律：\n");
    for (int n = 1; n <= 10; n++) {
        printf("  n=%d → 幸存者: %d\n", n, josephus_math(n, 2));
    }
    printf("规律：幸存者编号 = 2*(n - 2^floor(log2(n))) + 1\n");
    
    // 释放环形链表（在josephus_problem中已经释放了）
    
    return 0;
}
```

## 总结与对比

### 查找算法对比

| 算法 | 时间复杂度 | 空间复杂度 | 前提条件 | 适用场景 |
|------|------------|------------|----------|----------|
| 线性查找 | O(n) | O(1) | 无 | 小数组/无序数据/链表 |
| 二分查找 | O(log n) | O(1) | 有序数组 | 有序数组的通用查找 |
| 插值查找 | O(log log n) | O(1) | 有序+均匀分布 | 大规模均匀分布数据 |
| 斐波那契查找 | O(log n) | O(1) | 有序数组 | 无除法运算的硬件 |

### 链表操作复杂度对比

| 操作 | 单链表 | 双向链表 | 数组 |
|------|--------|----------|------|
| 随机访问 | O(n) | O(n) | O(1) |
| 头部插入 | O(1) | O(1) | O(n) |
| 尾部插入 | O(n) 或 O(1)* | O(1) | O(1)** |
| 中间插入 | O(n) | O(n) | O(n) |
| 删除 | O(n) | O(1)*** | O(n) |
| 反转 | O(n) | O(n) | O(n) |

*单链表尾部插入O(1)需要维护尾指针
**数组尾部插入O(1)是均摊复杂度
***双向链表删除给定节点是O(1)，但需要先找到节点

### 链表反转方法对比

| 方法 | 时间复杂度 | 空间复杂度 | 优点 | 缺点 |
|------|------------|------------|------|------|
| 三指针法 | O(n) | O(1) | 空间效率高，不依赖栈 | 代码稍复杂 |
| 递归法 | O(n) | O(n) | 代码简洁，思路清晰 | 栈空间开销大 |

### 核心要点总结

1. **查找算法选择**：如果数据有序，优先使用二分查找；如果数据均匀分布且规模大，插值查找更优；如果数据无序，只能使用线性查找。

2. **链表适用场景**：频繁插入删除的场景适合链表；需要随机访问的场景适合数组。

3. **链表反转**：三指针法是面试和实际开发中的首选，递归法适合理解递归思想。

4. **约瑟夫环问题**：环形链表提供了直观的模拟方案，数学递推公式提供了高效的数值解法。

5. **边界条件**：在C语言中操作链表时，NULL指针检查、边界条件判断是避免错误的关键。
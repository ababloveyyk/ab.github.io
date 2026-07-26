---
title: C语言算法基础Ⅱ——排序算法（下）
date: 2026-07-26
tags:
  - C语言
  - 算法
  - 排序
categories:
  - C语言
---

## 前言

在上一篇文章中，我们学习了冒泡排序、选择排序、插入排序和希尔排序这四种基础排序算法。这些算法虽然简单易懂，但时间复杂度都是O(n²)级别，在面对大规模数据时效率较低。在本文中，我们将学习更高级的排序算法，它们的时间复杂度达到O(n log n)级别，能够高效处理大规模数据。

本文将要介绍的排序算法包括：快速排序、归并排序、堆排序、计数排序和基数排序。其中，快速排序、归并排序和堆排序是基于比较的排序算法，时间复杂度为O(n log n)；而计数排序和基数排序是非比较排序算法，可以在特定条件下达到线性时间O(n)的复杂度。

快速排序和归并排序是"分治法"思想的经典应用，它们将大问题分解为小问题来解决。堆排序则利用了堆这种数据结构的特殊性质。计数排序和基数排序另辟蹊径，不通过比较来确定元素的顺序，而是利用元素本身的特性来进行排序。这些算法的思想都非常精妙，学习它们不仅能够提升你的编程能力，更能够拓宽你的算法思维。

在本文的最后，我们还会编写一个综合的性能对比测试程序，将本文的算法与上一篇文章的基础算法放在一起进行对比，让你直观地看到不同算法在不同场景下的性能差异。这将帮助你理解为什么在实际工程中，我们更倾向于使用O(n log n)级别的排序算法。

## 快速排序

### 快速排序的基本原理

快速排序（Quick Sort）是由英国计算机科学家Tony Hoare于1960年提出的。它是目前应用最广泛的排序算法之一，也是许多编程语言标准库中排序函数的默认实现。快速排序的核心思想是"分治法"：选择一个基准元素（pivot），将数组划分为两个子数组，使得左子数组的所有元素都小于等于基准元素，右子数组的所有元素都大于等于基准元素，然后递归地对两个子数组进行排序。

快速排序之所以被称为"快速"，是因为它在平均情况下具有O(n log n)的优秀时间复杂度和非常小的常数因子。在实际应用中，快速排序通常比归并排序和堆排序更快。

快速排序的核心操作是"分区"（partition）。分区操作将数组重新排列，使得：
- 选择一个元素作为基准（pivot）
- 所有小于基准的元素移到基准的左边
- 所有大于基准的元素移到基准的右边
- 基准元素位于最终排序位置

分区操作完成后，基准元素就位于它最终应该处于的位置，这个位置将数组分为左右两部分，然后递归地对左右两部分进行排序。

快速排序的过程可以用以下图示来说明：

```
初始数组：[6, 1, 8, 3, 5, 2, 7, 4]
选择基准：4（通常选择最后一个元素）

分区过程：
[6, 1, 8, 3, 5, 2, 7, 4]
 ↑                    ↑
 i                    pivot

扫描数组，将小于pivot的元素与i位置交换：
i=0, arr[0]=6 > 4, 不交换
i=0, arr[1]=1 < 4, 交换arr[0]和arr[1] → [1, 6, 8, 3, 5, 2, 7, 4], i=1
i=1, arr[2]=8 > 4, 不交换
i=1, arr[3]=3 < 4, 交换arr[1]和arr[3] → [1, 3, 8, 6, 5, 2, 7, 4], i=2
i=2, arr[4]=5 > 4, 不交换
i=2, arr[5]=2 < 4, 交换arr[2]和arr[5] → [1, 3, 2, 6, 5, 8, 7, 4], i=3
i=3, arr[6]=7 > 4, 不交换

最后将pivot与arr[i]交换：
[1, 3, 2, 4, 5, 8, 7, 6]

分区结果：4在最终位置，左边都小于4，右边都大于4

递归排序左半部分[1, 3, 2]和右半部分[5, 8, 7, 6]
```

### 快速排序的递归实现

下面给出快速排序的递归版本实现。这是最经典的快速排序实现，清晰地展示了分治法的思想。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 快速排序的分区函数
 * 
 * 使用Lomuto分区方案：
 * 选择最后一个元素作为基准（pivot）
 * 将所有小于pivot的元素移到左边，大于pivot的移到右边
 * 最后将pivot放到正确的位置
 * 
 * @param arr  待排序的数组
 * @param low  分区起始索引
 * @param high 分区结束索引
 * @return     基准元素的最终位置
 */
int partition(int arr[], int low, int high) {
    // 选择最后一个元素作为基准
    int pivot = arr[high];
    // i指向小于pivot区域的最后一个元素
    // 初始时，小于pivot区域为空，i = low - 1
    int i = low - 1;
    
    // 遍历数组，将小于pivot的元素移到前面
    for (int j = low; j < high; j++) {
        // 如果当前元素小于等于pivot
        if (arr[j] <= pivot) {
            i++;  // 扩展小于pivot区域
            // 交换arr[i]和arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // 将pivot放到正确的位置（i+1）
    // 此时arr[low..i]都小于等于pivot，arr[i+1..high-1]都大于pivot
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    // 返回pivot的最终位置
    return i + 1;
}

/**
 * 快速排序 - 递归版本
 * 
 * 算法原理：
 * 1. 选择基准元素（pivot）
 * 2. 分区：将数组分为左右两部分
 * 3. 递归地对左右两部分进行排序
 * 
 * 时间复杂度：
 * - 最优情况 O(n log n)：每次分区都均匀分割
 * - 最坏情况 O(n²)：每次分区都极不均匀（如已排序数组）
 * - 平均情况 O(n log n)
 * 
 * 空间复杂度：O(log n) - 递归调用栈的深度
 * 稳定性：不稳定 - 分区过程中的交换可能破坏相对顺序
 * 
 * @param arr  待排序的数组
 * @param low  排序范围的起始索引
 * @param high 排序范围的结束索引
 */
void quick_sort_recursive(int arr[], int low, int high) {
    // 递归终止条件：low >= high时，子数组长度为0或1，已经有序
    if (low < high) {
        // 分区操作，获得基准元素的最终位置
        int pivot_index = partition(arr, low, high);
        
        // 递归排序左半部分（基准元素左边的所有元素）
        quick_sort_recursive(arr, low, pivot_index - 1);
        
        // 递归排序右半部分（基准元素右边的所有元素）
        quick_sort_recursive(arr, pivot_index + 1, high);
    }
}

/**
 * 快速排序的包装函数，方便调用
 */
void quick_sort(int arr[], int n) {
    quick_sort_recursive(arr, 0, n - 1);
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
 * 快速排序递归版测试主函数
 */
int main() {
    printf("=== 快速排序（递归版）测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {10, 7, 8, 9, 1, 5, 3, 6, 2, 4};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    quick_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：已排序数组（快速排序的最坏情况）
    int arr2[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("已排序数组排序前: ");
    print_array(arr2, n2);
    quick_sort(arr2, n2);
    printf("已排序数组排序后: ");
    print_array(arr2, n2);
    printf("（注意：对已排序数组使用Lomuto分区会使快速排序退化为O(n²)）\n\n");
    
    // 测试用例3：包含大量重复元素的数组
    int arr3[] = {4, 2, 4, 2, 4, 2, 4, 2, 4, 2};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("重复元素数组排序前: ");
    print_array(arr3, n3);
    quick_sort(arr3, n3);
    printf("重复元素数组排序后: ");
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
    quick_sort(arr4, 15);
    printf("随机数组排序后: ");
    print_array(arr4, 15);
    
    return 0;
}
```

### 快速排序的优化 —— 三数取中法

快速排序在最坏情况下（例如对已排序数组进行排序）会退化为O(n²)，这是因为基准元素的选择不当导致分区极不均匀。为了解决这个问题，我们可以使用"三数取中法"（Median of Three）来选择基准元素。

三数取中法的思想是：取数组的第一个元素、中间元素和最后一个元素，选择这三个元素的中位数作为基准元素。这样可以有效避免在已排序或接近排序的数组上出现最坏情况。

三数取中法的直观理解：假设我们有数组[1, 2, 3, 4, 5, 6, 7, 8]，如果总是选择最后一个元素作为基准，那么每次分区都只能减少一个元素，导致递归深度为n，时间复杂度退化为O(n²)。而使用三数取中法，会选择arr[0]=1, arr[3]=4, arr[7]=8的中位数4作为基准，分区会更加均匀。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 交换两个整数的值
 */
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/**
 * 三数取中法选择基准元素
 * 
 * 取arr[low], arr[mid], arr[high]三个元素的中位数
 * 将其放到arr[high]位置（作为基准）
 * 
 * 这种策略可以有效避免最坏情况：
 * 1. 已排序数组 → 选择中间值，分区均匀
 * 2. 逆序数组 → 选择中间值，分区均匀
 * 3. 随机数组 → 接近最优选择
 * 
 * @param arr  待排序的数组
 * @param low  起始索引
 * @param high 结束索引
 */
void median_of_three(int arr[], int low, int high) {
    int mid = low + (high - low) / 2;
    
    // 将三个值按大小排列，确保arr[mid] <= arr[low] <= arr[high]
    // 这样arr[low]就是中位数
    if (arr[mid] > arr[high]) {
        swap(&arr[mid], &arr[high]);
    }
    if (arr[low] > arr[high]) {
        swap(&arr[low], &arr[high]);
    }
    if (arr[low] < arr[mid]) {
        swap(&arr[low], &arr[mid]);
    }
    
    // 将中位数（现在在arr[low]）与arr[high]交换
    // 这样基准元素就在arr[high]位置，与标准分区函数兼容
    swap(&arr[low], &arr[high]);
}

/**
 * 优化版分区函数（使用三数取中法）
 */
int partition_optimized(int arr[], int low, int high) {
    // 使用三数取中法选择基准
    median_of_three(arr, low, high);
    
    // 基准元素现在在arr[high]位置
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

/**
 * 优化版快速排序（递归）
 */
void quick_sort_optimized_recursive(int arr[], int low, int high) {
    if (low < high) {
        int pivot_index = partition_optimized(arr, low, high);
        quick_sort_optimized_recursive(arr, low, pivot_index - 1);
        quick_sort_optimized_recursive(arr, pivot_index + 1, high);
    }
}

/**
 * 优化版快速排序的包装函数
 */
void quick_sort_optimized(int arr[], int n) {
    quick_sort_optimized_recursive(arr, 0, n - 1);
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
 * 优化版快速排序测试主函数
 */
int main() {
    printf("=== 快速排序（三数取中优化版）测试 ===\n\n");
    
    // 测试用例1：已排序数组
    // 使用三数取中法后，此情况不再是O(n²)
    int arr1[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("已排序数组排序前: ");
    print_array(arr1, n1);
    quick_sort_optimized(arr1, n1);
    printf("已排序数组排序后: ");
    print_array(arr1, n1);
    printf("（三数取中法避免了最坏情况）\n\n");
    
    // 测试用例2：逆序数组
    int arr2[] = {15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("逆序数组排序前: ");
    print_array(arr2, n2);
    quick_sort_optimized(arr2, n2);
    printf("逆序数组排序后: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：随机数组
    int arr3[15];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 15; i++) {
        arr3[i] = rand() % 100;
        printf("%d ", arr3[i]);
    }
    printf("\n");
    quick_sort_optimized(arr3, 15);
    printf("随机数组排序后: ");
    print_array(arr3, 15);
    printf("\n");
    
    // 测试用例4：性能对比
    printf("=== 性能对比：基本版 vs 优化版（已排序数组，n=5000） ===\n");
    int n = 5000;
    int* arr_basic = (int*)malloc(n * sizeof(int));
    int* arr_opt = (int*)malloc(n * sizeof(int));
    
    for (int i = 0; i < n; i++) {
        arr_basic[i] = i;
        arr_opt[i] = i;
    }
    
    clock_t start, end;
    
    // 基本版快速排序
    start = clock();
    quick_sort(arr_basic, n);
    end = clock();
    printf("基本版快速排序: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    
    // 优化版快速排序
    start = clock();
    quick_sort_optimized(arr_opt, n);
    end = clock();
    printf("优化版快速排序: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    
    free(arr_basic);
    free(arr_opt);
    
    return 0;
}
```

### 快速排序的非递归实现

递归版本的快速排序虽然简洁，但递归调用会消耗栈空间。当递归深度很大时，可能导致栈溢出。非递归版本使用显式的栈（通常用数组模拟）来替代递归调用，可以更好地控制空间使用。

非递归快速排序的核心思想是：使用一个栈来保存待排序的子数组的边界。每次从栈中取出一对边界值，对该范围内的数组进行分区，然后将分区后的左右子数组的边界压入栈中。循环执行直到栈为空。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 交换两个整数
 */
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/**
 * 分区函数
 */
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

/**
 * 快速排序 - 非递归版本
 * 
 * 使用显式栈来模拟递归调用
 * 避免了递归调用栈的开销和栈溢出风险
 * 
 * 算法原理：
 * 1. 创建一个栈，将初始的low和high压入栈中
 * 2. 循环从栈中取出low和high
 * 3. 对当前范围进行分区
 * 4. 将左右子数组的边界压入栈中（先压右再压左，保证先处理左子数组）
 * 5. 重复直到栈为空
 * 
 * 时间复杂度：O(n log n) 平均，O(n²) 最坏
 * 空间复杂度：O(log n) - 显式栈的大小
 * 稳定性：不稳定
 * 
 * 优点：
 * 1. 避免递归调用栈溢出
 * 2. 可以更好地控制内存使用
 * 3. 在某些嵌入式系统中更适用
 * 
 * @param arr 待排序的数组
 * @param n   数组长度
 */
void quick_sort_iterative(int arr[], int n) {
    // 创建栈，用于存储待排序的子数组边界
    // 栈的大小为n，每个元素存储一对(low, high)边界
    int* stack = (int*)malloc(n * sizeof(int));
    int top = -1;  // 栈顶指针
    
    // 将初始的low和high压入栈中
    // 先压low，再压high
    top++;
    stack[top] = 0;      // low
    top++;
    stack[top] = n - 1;  // high
    
    // 循环处理栈中的子数组
    while (top >= 0) {
        // 弹出high和low
        int high = stack[top];
        top--;
        int low = stack[top];
        top--;
        
        // 对当前范围进行分区
        int pivot_index = partition(arr, low, high);
        
        // 如果左子数组有至少两个元素，将其边界压入栈中
        if (pivot_index - 1 > low) {
            top++;
            stack[top] = low;
            top++;
            stack[top] = pivot_index - 1;
        }
        
        // 如果右子数组有至少两个元素，将其边界压入栈中
        if (pivot_index + 1 < high) {
            top++;
            stack[top] = pivot_index + 1;
            top++;
            stack[top] = high;
        }
    }
    
    free(stack);
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
 * 非递归快速排序测试主函数
 */
int main() {
    printf("=== 快速排序（非递归版）测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {4, 6, 2, 5, 7, 9, 1, 3, 8, 0};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    quick_sort_iterative(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：大规模数组测试
    printf("=== 大规模排序测试 ===\n");
    int n = 10000;
    int* arr2 = (int*)malloc(n * sizeof(int));
    srand((unsigned int)time(NULL));
    
    for (int i = 0; i < n; i++) {
        arr2[i] = rand() % 100000;
    }
    
    printf("对%d个随机元素进行排序...\n", n);
    clock_t start = clock();
    quick_sort_iterative(arr2, n);
    clock_t end = clock();
    
    // 验证排序结果
    int is_sorted = 1;
    for (int i = 0; i < n - 1; i++) {
        if (arr2[i] > arr2[i + 1]) {
            is_sorted = 0;
            break;
        }
    }
    
    printf("排序完成，耗时: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    printf("排序验证: %s\n", is_sorted ? "通过" : "失败");
    
    // 打印前10个和后10个元素
    printf("前10个元素: ");
    print_array(arr2, 10);
    printf("后10个元素: ");
    print_array(arr2 + n - 10, 10);
    
    free(arr2);
    return 0;
}
```

### 快速排序的深入分析

快速排序之所以在实际应用中表现优异，有以下几个原因：

1. **缓存友好性**：快速排序的分区操作是顺序扫描数组，对CPU缓存非常友好。相比之下，归并排序需要合并两个数组，堆排序需要跳跃访问数组。

2. **常数因子小**：快速排序的每次比较和交换操作都非常简单，常数因子很小。在O(n log n)的排序算法中，快速排序的常数因子最小。

3. **原地排序**：快速排序是原地排序，不需要额外的数组空间。归并排序需要O(n)的额外空间。

4. **尾递归优化**：编译器可以对快速排序的尾递归进行优化，进一步减少栈空间的使用。

快速排序的局限性：
- 最坏情况时间复杂度为O(n²)，但可以通过三数取中法、随机化选择基准等策略来避免
- 不是稳定排序，如果需要保持相等元素的相对顺序，应该使用归并排序
- 递归实现在小规模数据上可能不如插入排序高效

## 归并排序

### 归并排序的基本原理

归并排序（Merge Sort）是分治法思想的又一经典应用。它的基本思想是：将数组递归地分成两半，分别对每一半进行排序，然后将两个有序的子数组合并为一个有序的数组。

归并排序的核心操作是"合并"——将两个有序的子数组合并为一个有序的数组。这个操作需要O(n)的时间，其中n是两个子数组的总长度。

归并排序的过程可以描述如下：

```
初始数组：[38, 27, 43, 3, 9, 82, 10]

递归分解：
[38, 27, 43, 3, 9, 82, 10]
        ↙            ↘
[38, 27, 43, 3]    [9, 82, 10]
    ↙      ↘          ↙      ↘
[38, 27]  [43, 3]  [9, 82]  [10]
  ↙  ↘     ↙  ↘     ↙  ↘
[38] [27] [43] [3] [9] [82]

合并过程：
[38]和[27]合并 → [27, 38]
[43]和[3]合并 → [3, 43]
[27, 38]和[3, 43]合并 → [3, 27, 38, 43]

[9]和[82]合并 → [9, 82]
[9, 82]和[10]合并 → [9, 10, 82]

[3, 27, 38, 43]和[9, 10, 82]合并 → [3, 9, 10, 27, 38, 43, 82]
```

归并排序的一个重要特性是：无论输入数据如何，它的时间复杂度始终为O(n log n)。这使得归并排序在对性能要求严格、且对最坏情况敏感的场景中特别有价值。

### 归并排序的递归实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

/**
 * 合并两个有序子数组
 * 
 * 将arr[left..mid]和arr[mid+1..right]两个有序子数组合并
 * 合并后的结果存放在arr[left..right]中
 * 
 * 合并过程：
 * 1. 创建两个临时数组，分别存放左右子数组
 * 2. 使用双指针i和j分别遍历两个子数组
 * 3. 比较arr[i]和arr[j]，将较小的放入结果数组
 * 4. 处理剩余元素
 * 
 * @param arr   原始数组
 * @param left  左子数组起始索引
 * @param mid   左子数组结束索引（也是右子数组起始索引-1）
 * @param right 右子数组结束索引
 */
void merge(int arr[], int left, int mid, int right) {
    // 计算两个子数组的大小
    int n1 = mid - left + 1;  // 左子数组大小
    int n2 = right - mid;      // 右子数组大小
    
    // 创建临时数组
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    
    // 将数据复制到临时数组
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    // 合并两个有序数组
    int i = 0;  // L的索引
    int j = 0;  // R的索引
    int k = left;  // arr的索引
    
    // 比较L[i]和R[j]，将较小的放入arr[k]
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // 将L中剩余的元素复制到arr
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // 将R中剩余的元素复制到arr
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    // 释放临时数组
    free(L);
    free(R);
}

/**
 * 归并排序 - 递归版本
 * 
 * 算法原理：
 * 1. 递归地将数组分成两半
 * 2. 对每一半进行排序
 * 3. 合并两个有序的子数组
 * 
 * 时间复杂度：O(n log n) - 任何情况下都是
 * 空间复杂度：O(n) - 合并时需要临时数组
 * 稳定性：稳定 - 合并时保持相等元素的相对顺序
 * 
 * 特点：
 * 1. 时间复杂度稳定，不受输入数据影响
 * 2. 稳定排序
 * 3. 需要O(n)的额外空间
 * 4. 适合链表排序
 * 
 * @param arr   待排序的数组
 * @param left  排序范围的起始索引
 * @param right 排序范围的结束索引
 */
void merge_sort_recursive(int arr[], int left, int right) {
    // 递归终止条件：left >= right时，子数组长度为0或1
    if (left < right) {
        // 计算中间位置，避免溢出
        int mid = left + (right - left) / 2;
        
        // 递归排序左半部分
        merge_sort_recursive(arr, left, mid);
        
        // 递归排序右半部分
        merge_sort_recursive(arr, mid + 1, right);
        
        // 合并两个有序子数组
        merge(arr, left, mid, right);
    }
}

/**
 * 归并排序的包装函数
 */
void merge_sort(int arr[], int n) {
    merge_sort_recursive(arr, 0, n - 1);
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
 * 归并排序递归版测试主函数
 */
int main() {
    printf("=== 归并排序（递归版）测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {12, 11, 13, 5, 6, 7, 3, 8, 1, 9};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    merge_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：逆序数组
    int arr2[] = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("逆序数组排序前: ");
    print_array(arr2, n2);
    merge_sort(arr2, n2);
    printf("逆序数组排序后: ");
    print_array(arr2, n2);
    printf("（归并排序在任何情况下都是O(n log n)）\n\n");
    
    // 测试用例3：演示归并排序的稳定性
    printf("=== 稳定性演示 ===\n");
    printf("归并排序是稳定排序\n");
    int arr3[] = {5, 2, 5, 3, 5, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("原始数组: ");
    print_array(arr3, n3);
    merge_sort(arr3, n3);
    printf("排序结果: ");
    print_array(arr3, n3);
    printf("（相同值的元素保持原始相对顺序）\n\n");
    
    // 测试用例4：随机数组
    int arr4[20];
    srand((unsigned int)time(NULL));
    printf("随机数组排序前: ");
    for (int i = 0; i < 20; i++) {
        arr4[i] = rand() % 100;
        printf("%d ", arr4[i]);
    }
    printf("\n");
    merge_sort(arr4, 20);
    printf("随机数组排序后: ");
    print_array(arr4, 20);
    
    return 0;
}
```

### 归并排序的迭代实现

归并排序的递归实现虽然简洁，但递归调用会消耗栈空间。迭代版本的归并排序使用自底向上的方法，从长度为1的子数组开始，逐步合并为更大的有序子数组，直到整个数组有序。

迭代归并排序的过程如下（以数组[38, 27, 43, 3, 9, 82, 10]为例）：

```
初始数组：[38, 27, 43, 3, 9, 82, 10]

子数组大小=1：
合并[38]和[27] → [27, 38]
合并[43]和[3]  → [3, 43]
合并[9]和[82]  → [9, 82]
[10]单独（无配对）
数组变为：[27, 38, 3, 43, 9, 82, 10]

子数组大小=2：
合并[27, 38]和[3, 43] → [3, 27, 38, 43]
合并[9, 82]和[10]     → [9, 10, 82]
数组变为：[3, 27, 38, 43, 9, 10, 82]

子数组大小=4：
合并[3, 27, 38, 43]和[9, 10, 82] → [3, 9, 10, 27, 38, 43, 82]
排序完成！
```

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

/**
 * 求两个整数的最小值
 */
int min(int a, int b) {
    return (a < b) ? a : b;
}

/**
 * 合并两个有序子数组
 * 参数与递归版的merge函数相同
 */
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    free(L);
    free(R);
}

/**
 * 归并排序 - 迭代版本（自底向上）
 * 
 * 算法原理：
 * 1. 从子数组大小size=1开始
 * 2. 每次将相邻的两个大小为size的有序子数组合并
 * 3. 将size翻倍，重复步骤2
 * 4. 直到size >= n
 * 
 * 优点：
 * 1. 不需要递归调用，避免栈溢出
 * 2. 空间复杂度仍然是O(n)
 * 3. 代码更易于理解数据流动
 * 
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 * 稳定性：稳定
 * 
 * @param arr 待排序的数组
 * @param n   数组长度
 */
void merge_sort_iterative(int arr[], int n) {
    // size表示当前要合并的子数组的大小
    // 从1开始，每次翻倍
    for (int size = 1; size < n; size *= 2) {
        // 遍历数组，每次合并两个相邻的大小为size的子数组
        // left是左子数组的起始索引
        for (int left = 0; left < n - 1; left += 2 * size) {
            // mid是左子数组的结束索引
            int mid = min(left + size - 1, n - 1);
            // right是右子数组的结束索引
            int right = min(left + 2 * size - 1, n - 1);
            
            // 合并两个子数组
            merge(arr, left, mid, right);
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
 * 迭代归并排序测试主函数
 */
int main() {
    printf("=== 归并排序（迭代版）测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {38, 27, 43, 3, 9, 82, 10, 15, 7, 21};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    merge_sort_iterative(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：大规模数组性能测试
    printf("=== 大规模排序性能测试 ===\n");
    int n = 10000;
    int* arr2 = (int*)malloc(n * sizeof(int));
    int* arr3 = (int*)malloc(n * sizeof(int));
    srand((unsigned int)time(NULL));
    
    for (int i = 0; i < n; i++) {
        arr2[i] = rand() % 100000;
        arr3[i] = arr2[i];
    }
    
    clock_t start, end;
    
    start = clock();
    merge_sort_iterative(arr2, n);
    end = clock();
    printf("迭代归并排序: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    
    // 验证排序正确性
    int is_sorted = 1;
    for (int i = 0; i < n - 1; i++) {
        if (arr2[i] > arr2[i + 1]) {
            is_sorted = 0;
            break;
        }
    }
    printf("排序验证: %s\n", is_sorted ? "通过" : "失败");
    
    printf("前10个元素: ");
    print_array(arr2, 10);
    printf("后10个元素: ");
    print_array(arr2 + n - 10, 10);
    
    free(arr2);
    free(arr3);
    
    return 0;
}
```

### 归并排序的深入分析

归并排序是稳定排序算法中效率最高的之一。它在以下场景中特别有优势：

1. **需要稳定排序**：归并排序是O(n log n)级别中少数稳定的排序算法，当需要保持相等元素的相对顺序时，归并排序是首选。

2. **链表排序**：归并排序非常适合链表排序，因为链表不需要额外的空间来合并，而且链表的切分也不需要移动元素。

3. **外部排序**：归并排序是外部排序（对磁盘上的大文件进行排序）的基础。外部排序的基本思想是：将大文件分成多个小文件，分别排序，然后使用归并的方式合并这些有序文件。

4. **并行计算**：归并排序的分治结构天然适合并行化。左右子数组的排序可以并行执行，合并操作也可以通过并行归并来加速。

归并排序的缺点主要是需要O(n)的额外空间。在内存受限的环境中，这可能是一个问题。但可以通过在原地合并的优化技术来减少空间使用，尽管这会增加代码复杂度。

## 堆排序

### 堆排序的基本原理

堆排序（Heap Sort）是利用堆这种数据结构设计的一种排序算法。堆是一种特殊的完全二叉树，分为最大堆和最小堆。在最大堆中，每个节点的值都大于或等于其子节点的值；在最小堆中，每个节点的值都小于或等于其子节点的值。

堆排序的基本思想是：
1. 将待排序的数组构建成一个最大堆
2. 将堆顶元素（最大值）与堆的最后一个元素交换，然后将堆的大小减1
3. 对新的堆顶元素进行"下沉"操作，恢复堆的性质
4. 重复步骤2和3，直到堆的大小为1

堆排序的关键操作是"堆化"（heapify），即调整一个节点使其满足堆的性质。堆化操作的时间复杂度为O(log n)。

堆的数组表示：在堆排序中，我们使用数组来表示二叉堆。对于索引为i的节点：
- 父节点索引：(i - 1) / 2
- 左子节点索引：2 * i + 1
- 右子节点索引：2 * i + 2

堆排序的图示过程：

```
初始数组：[4, 10, 3, 5, 1]

构建最大堆：
       4
     /   \
    10    3
   /  \
  5    1

堆化过程（从最后一个非叶子节点开始）：
索引1（值为10）：10 > 5, 10 > 1, 不需要调整
索引0（值为4）：4 < 10, 交换4和10
       10
     /    \
    4      3
   /  \
  5    1

继续堆化索引1：4 < 5, 交换4和5
       10
     /    \
    5      3
   /  \
  4    1

最大堆构建完成！

排序过程：
1. 交换堆顶10和末尾1 → [1, 5, 3, 4, 10]，堆大小减1
2. 堆化堆顶1 → [5, 4, 3, 1, 10]
3. 交换堆顶5和末尾1 → [1, 4, 3, 5, 10]
4. 堆化堆顶1 → [4, 1, 3, 5, 10]
5. 交换堆顶4和末尾3 → [3, 1, 4, 5, 10]
6. 堆化堆顶3 → [3, 1, 4, 5, 10]
7. 交换堆顶3和末尾1 → [1, 3, 4, 5, 10]
排序完成！
```

### 堆排序的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/**
 * 交换两个整数的值
 */
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/**
 * 堆化操作（下沉）
 * 
 * 维护以节点i为根的子树的堆性质
 * 假设节点i的左右子树都已经满足堆性质
 * 
 * 下沉过程：
 * 1. 找到节点i和它的左右子节点中的最大值
 * 2. 如果最大值不是节点i本身，交换节点i和最大值
 * 3. 递归地对被交换的子节点进行堆化
 * 
 * @param arr 数组表示的堆
 * @param n   堆的大小（数组中有效元素的数量）
 * @param i   需要堆化的节点索引
 */
void heapify(int arr[], int n, int i) {
    int largest = i;       // 假设当前节点i是最大的
    int left = 2 * i + 1;  // 左子节点索引
    int right = 2 * i + 2; // 右子节点索引
    
    // 如果左子节点存在且大于当前最大值
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // 如果右子节点存在且大于当前最大值
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // 如果最大值不是当前节点i，需要交换并继续堆化
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        
        // 递归堆化被交换的子节点
        // 因为交换可能破坏了子树的堆性质
        heapify(arr, n, largest);
    }
}

/**
 * 堆排序
 * 
 * 算法原理：
 * 1. 构建最大堆：从最后一个非叶子节点开始，自底向上堆化
 * 2. 排序：反复将堆顶（最大值）与堆末尾交换，然后堆化新的堆顶
 * 
 * 时间复杂度：O(n log n) - 任何情况下都是
 * 空间复杂度：O(1) - 原地排序
 * 稳定性：不稳定 - 堆化操作可能破坏相等元素的相对顺序
 * 
 * 优点：
 * 1. O(n log n)时间复杂度，且对任何输入都稳定
 * 2. O(1)空间复杂度，原地排序
 * 3. 不需要递归（堆化可以用循环实现）
 * 
 * 缺点：
 * 1. 不稳定
 * 2. 实际运行速度通常慢于快速排序（缓存不友好）
 * 
 * @param arr 待排序的数组
 * @param n   数组长度
 */
void heap_sort(int arr[], int n) {
    // 步骤1：构建最大堆
    // 从最后一个非叶子节点开始，自底向上堆化
    // 最后一个非叶子节点的索引是 n/2 - 1
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // 步骤2：排序
    // 逐一将堆顶（最大值）移到数组末尾
    for (int i = n - 1; i > 0; i--) {
        // 将堆顶（arr[0]）与当前堆的最后一个元素（arr[i]）交换
        swap(&arr[0], &arr[i]);
        
        // 堆的大小减1，对新的堆顶进行堆化
        // 注意：此时堆的大小为i（不包括已排序的元素）
        heapify(arr, i, 0);
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
 * 堆排序测试主函数
 */
int main() {
    printf("=== 堆排序测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {12, 11, 13, 5, 6, 7, 3, 8, 1, 9, 4, 2, 10};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    heap_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：演示堆的构建过程
    printf("=== 堆构建过程演示 ===\n");
    int arr2[] = {4, 10, 3, 5, 1};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("原始数组: ");
    print_array(arr2, n2);
    
    printf("构建最大堆...\n");
    for (int i = n2 / 2 - 1; i >= 0; i--) {
        heapify(arr2, n2, i);
        printf("堆化索引%d后: ", i);
        print_array(arr2, n2);
    }
    printf("最大堆构建完成！\n\n");
    
    // 测试用例3：完全逆序数组
    int arr3[] = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    printf("逆序数组排序前: ");
    print_array(arr3, n3);
    heap_sort(arr3, n3);
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
    heap_sort(arr4, 20);
    printf("随机数组排序后: ");
    print_array(arr4, 20);
    
    return 0;
}
```

### 堆排序的深入分析

堆排序是一种非常独特的排序算法，它结合了二叉树和数组的优点。相比快速排序，堆排序具有以下特点：

优势：
1. 保证O(n log n)时间，没有最坏情况退化
2. O(1)额外空间，真正的原地排序
3. 在实时系统中，可预测的性能比快速排序更可靠

劣势：
1. 缓存不友好：堆排序访问数组的模式是跳跃式的，不像快速排序那样顺序访问，导致缓存命中率低
2. 不稳定：堆化操作中的交换会破坏相等元素的相对顺序
3. 常数因子较大：实际运行速度通常慢于快速排序

堆排序在优先队列等需要频繁获取最大/最小值的场景中非常有用。此外，堆数据结构也广泛应用于图算法（如Dijkstra最短路径算法）、操作系统调度等领域。

## 计数排序

### 计数排序的基本原理

计数排序（Counting Sort）是一种非比较排序算法。它不是通过比较元素的大小来确定顺序，而是通过统计每个元素出现的次数来确定每个元素的位置。计数排序的核心思想是：确定数组中的最大值和最小值，创建一个计数数组，统计每个元素出现的次数，然后根据计数结果重建排序后的数组。

计数排序的前提是：待排序的元素必须是整数（或可以映射为整数），且取值范围不能太大。

计数排序的过程如下：

```
初始数组：[4, 2, 2, 8, 3, 3, 1, 4]

步骤1：统计每个元素出现的次数
最小值=1，最大值=8，范围=8
计数数组count[1..8]：
值:  1  2  3  4  5  6  7  8
次数: 1  2  2  2  0  0  0  1

步骤2：计算累积计数
累积计数表示每个元素在排序后数组中的最后一个位置
值:  1  2  3  4  5  6  7  8
累积: 1  3  5  7  7  7  7  8

步骤3：从后往前遍历原始数组，放置元素
arr[7]=4, 累积计数[4]=7, 放入output[6], 累积计数[4]变为6
arr[6]=1, 累积计数[1]=1, 放入output[0], 累积计数[1]变为0
arr[5]=3, 累积计数[3]=5, 放入output[4], 累积计数[3]变为4
...
最终结果：[1, 2, 2, 3, 3, 4, 4, 8]
```

从后往前遍历是为了保证排序的稳定性。

### 计数排序的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

/**
 * 计数排序
 * 
 * 算法原理：
 * 1. 找出数组中的最大值和最小值
 * 2. 创建一个计数数组，大小为(max - min + 1)
 * 3. 统计每个元素出现的次数
 * 4. 计算累积计数，确定每个元素的位置
 * 5. 从后往前遍历原数组，放置元素
 * 
 * 时间复杂度：O(n + k)，其中k是元素取值范围的大小
 * 空间复杂度：O(n + k)
 * 稳定性：稳定
 * 
 * 适用条件：
 * 1. 元素是整数（或可映射为整数）
 * 2. 元素取值范围不能太大（k不能远大于n）
 * 
 * 优点：
 * 1. 当k较小时，时间复杂度接近O(n)
 * 2. 稳定排序
 * 
 * 缺点：
 * 1. 当k很大时，空间和时间开销都很大
 * 2. 只能对整数排序
 * 
 * @param arr 待排序的整型数组
 * @param n   数组长度
 */
void counting_sort(int arr[], int n) {
    if (n <= 1) return;  // 数组为空或只有一个元素，直接返回
    
    // 步骤1：找出最大值和最小值
    int max = arr[0];
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    
    // 步骤2：创建计数数组
    int range = max - min + 1;
    int* count = (int*)calloc(range, sizeof(int));  // calloc会将内存初始化为0
    
    // 步骤3：统计每个元素出现的次数
    for (int i = 0; i < n; i++) {
        count[arr[i] - min]++;  // 将元素值映射到计数数组的索引
    }
    
    // 步骤4：计算累积计数
    // 累积计数表示每个元素在排序后数组中的最后一个位置+1
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // 步骤5：构建输出数组
    // 从后往前遍历原始数组，保证稳定性
    int* output = (int*)malloc(n * sizeof(int));
    for (int i = n - 1; i >= 0; i--) {
        // 计算当前元素在输出数组中的位置
        int pos = count[arr[i] - min] - 1;
        output[pos] = arr[i];
        // 更新计数，为下一个相同元素预留位置
        count[arr[i] - min]--;
    }
    
    // 步骤6：将排序结果复制回原数组
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
    
    // 释放临时数组
    free(count);
    free(output);
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
 * 计数排序测试主函数
 */
int main() {
    printf("=== 计数排序测试 ===\n\n");
    
    // 测试用例1：小范围正整数
    int arr1[] = {4, 2, 2, 8, 3, 3, 1, 4, 5, 2};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("小范围正整数排序前: ");
    print_array(arr1, n1);
    counting_sort(arr1, n1);
    printf("小范围正整数排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：包含负数的数组
    int arr2[] = {-5, -10, 0, -3, 8, 5, -1, 10, -8, 3};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("含负数数组排序前: ");
    print_array(arr2, n2);
    counting_sort(arr2, n2);
    printf("含负数数组排序后: ");
    print_array(arr2, n2);
    printf("\n");
    
    // 测试用例3：成绩排序（实际应用场景）
    printf("=== 应用场景：学生成绩排序 ===\n");
    int scores[] = {85, 92, 78, 90, 85, 88, 92, 76, 95, 88, 82, 90, 85, 78, 92};
    int n3 = sizeof(scores) / sizeof(scores[0]);
    printf("原始成绩: ");
    print_array(scores, n3);
    counting_sort(scores, n3);
    printf("排序成绩: ");
    print_array(scores, n3);
    printf("（成绩范围0-100，非常适合计数排序）\n\n");
    
    // 测试用例4：大规模数据性能测试
    printf("=== 大规模数据性能测试 ===\n");
    int n = 100000;
    int* arr4 = (int*)malloc(n * sizeof(int));
    srand((unsigned int)time(NULL));
    
    // 生成范围在0-999之间的随机数
    for (int i = 0; i < n; i++) {
        arr4[i] = rand() % 1000;
    }
    
    printf("对%d个元素（范围0-999）进行计数排序...\n", n);
    clock_t start = clock();
    counting_sort(arr4, n);
    clock_t end = clock();
    
    // 验证排序
    int is_sorted = 1;
    for (int i = 0; i < n - 1; i++) {
        if (arr4[i] > arr4[i + 1]) {
            is_sorted = 0;
            break;
        }
    }
    printf("排序完成，耗时: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    printf("排序验证: %s\n", is_sorted ? "通过" : "失败");
    printf("前10个元素: ");
    print_array(arr4, 10);
    
    free(arr4);
    return 0;
}
```

## 基数排序

### 基数排序的基本原理

基数排序（Radix Sort）是另一种非比较排序算法。它按照数字的每一位（从最低位到最高位，或从最高位到最低位）依次进行排序。基数排序通常使用计数排序作为子过程（因为每一位的取值范围只有0-9）。

基数排序的核心思想是：如果两个数字的最高位不同，那么最高位决定了它们的大小关系；如果最高位相同，则比较次高位，以此类推。基数排序利用了"按位排序"加上"稳定排序"的特性，逐位确定数字的顺序。

基数排序分为两种变体：
- LSD（Least Significant Digit）：从最低位开始排序，适用于整数排序
- MSD（Most Significant Digit）：从最高位开始排序，适用于字符串排序

LSD基数排序的过程如下：

```
初始数组：[170, 45, 75, 90, 802, 24, 2, 66]

按个位排序（使用稳定排序）：
170(0), 90(0), 802(2), 2(2), 24(4), 45(5), 75(5), 66(6)
结果：[170, 90, 802, 2, 24, 45, 75, 66]

按十位排序：
170(7), 90(9), 802(0), 2(0), 24(2), 45(4), 75(7), 66(6)
结果：[802, 2, 170, 24, 45, 66, 75, 90]

按百位排序：
802(8), 2(0), 170(1), 24(0), 45(0), 66(0), 75(0), 90(0)
结果：[2, 24, 45, 66, 75, 90, 170, 802]

排序完成！
```

### 基数排序的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

/**
 * 获取数组中最大的元素
 */
int get_max(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

/**
 * 使用计数排序按指定位数对数组进行排序
 * 
 * @param arr 待排序的数组
 * @param n   数组长度
 * @param exp 当前处理的位数（1, 10, 100, ...）
 *            表示按第几位数字排序
 */
void counting_sort_by_digit(int arr[], int n, int exp) {
    // 输出数组
    int* output = (int*)malloc(n * sizeof(int));
    // 计数数组，每位数字范围是0-9
    int count[10] = {0};
    
    // 统计当前位上每个数字出现的次数
    for (int i = 0; i < n; i++) {
        int digit = (arr[i] / exp) % 10;
        count[digit]++;
    }
    
    // 计算累积计数
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // 从后往前遍历，构建输出数组（保证稳定性）
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    
    // 将排序结果复制回原数组
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
    
    free(output);
}

/**
 * 基数排序（LSD，从最低位开始）
 * 
 * 算法原理：
 * 1. 找到数组中的最大值，确定需要处理的位数
 * 2. 从最低位（个位）开始，逐位使用稳定的计数排序
 * 3. 经过所有位的排序后，数组完全有序
 * 
 * 时间复杂度：O(d * (n + k))，其中d是最大位数，k是基数（十进制为10）
 * 空间复杂度：O(n + k)
 * 稳定性：稳定
 * 
 * 适用条件：
 * 1. 元素是整数（或可转换为整数的序列）
 * 2. 元素位数不是特别大
 * 
 * 优点：
 * 1. 当d较小且k较小时，接近O(n)时间复杂度
 * 2. 稳定排序
 * 3. 可以处理大范围的整数
 * 
 * 缺点：
 * 1. 需要额外空间
 * 2. 只能处理整数或可拆分为"位"的数据
 * 
 * @param arr 待排序的整型数组
 * @param n   数组长度
 */
void radix_sort(int arr[], int n) {
    if (n <= 1) return;
    
    // 找到最大值，确定需要处理的位数
    int max = get_max(arr, n);
    
    // 按每个位进行计数排序
    // exp从1开始，每次乘以10，表示个位、十位、百位...
    for (int exp = 1; max / exp > 0; exp *= 10) {
        counting_sort_by_digit(arr, n, exp);
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
 * 基数排序测试主函数
 */
int main() {
    printf("=== 基数排序测试 ===\n\n");
    
    // 测试用例1：普通数组
    int arr1[] = {170, 45, 75, 90, 802, 24, 2, 66, 329, 457, 123, 999};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    printf("普通数组排序前: ");
    print_array(arr1, n1);
    radix_sort(arr1, n1);
    printf("普通数组排序后: ");
    print_array(arr1, n1);
    printf("\n");
    
    // 测试用例2：展示逐位排序过程
    printf("=== 逐位排序过程展示 ===\n");
    int arr2[] = {170, 45, 75, 90, 802, 24, 2, 66};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    printf("原始数组: ");
    print_array(arr2, n2);
    
    int max = get_max(arr2, n2);
    for (int exp = 1; max / exp > 0; exp *= 10) {
        counting_sort_by_digit(arr2, n2, exp);
        printf("按第%d位排序后: ", exp);
        print_array(arr2, n2);
    }
    printf("\n");
    
    // 测试用例3：大规模数据性能测试
    printf("=== 大规模数据性能测试 ===\n");
    int n = 100000;
    int* arr3 = (int*)malloc(n * sizeof(int));
    srand((unsigned int)time(NULL));
    
    for (int i = 0; i < n; i++) {
        arr3[i] = rand() % 1000000;  // 0到999999的随机数
    }
    
    printf("对%d个元素进行基数排序...\n", n);
    clock_t start = clock();
    radix_sort(arr3, n);
    clock_t end = clock();
    
    int is_sorted = 1;
    for (int i = 0; i < n - 1; i++) {
        if (arr3[i] > arr3[i + 1]) {
            is_sorted = 0;
            break;
        }
    }
    printf("排序完成，耗时: %.3f ms\n", 
           (double)(end - start) * 1000.0 / CLOCKS_PER_SEC);
    printf("排序验证: %s\n", is_sorted ? "通过" : "失败");
    printf("前10个元素: ");
    print_array(arr3, 10);
    printf("后10个元素: ");
    print_array(arr3 + n - 10, 10);
    
    free(arr3);
    return 0;
}
```

## 综合性能对比测试

为了全面比较各种排序算法的性能，我们编写一个综合测试程序，将所有排序算法放在一起进行对比。测试将涵盖不同规模、不同分布的数据，帮助读者直观地理解各种算法的适用场景。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

/* ========== 所有排序算法的实现 ========== */

// 交换函数
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// 冒泡排序（优化版）
void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int flag = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                flag = 1;
            }
        }
        if (flag == 0) break;
    }
}

// 选择排序
void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) min_idx = j;
        }
        if (min_idx != i) swap(&arr[i], &arr[min_idx]);
    }
}

// 插入排序
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

// 希尔排序
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

// 快速排序分区
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

// 快速排序（递归）
void quick_sort_recursive(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort_recursive(arr, low, pi - 1);
        quick_sort_recursive(arr, pi + 1, high);
    }
}

void quick_sort(int arr[], int n) {
    quick_sort_recursive(arr, 0, n - 1);
}

// 归并排序合并
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
    free(L); free(R);
}

// 归并排序（递归）
void merge_sort_recursive(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort_recursive(arr, left, mid);
        merge_sort_recursive(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge_sort(int arr[], int n) {
    merge_sort_recursive(arr, 0, n - 1);
}

// 堆排序
void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heap_sort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}

/* ========== 性能测试函数 ========== */

/**
 * 复制数组
 */
void copy_array(int dest[], int src[], int n) {
    memcpy(dest, src, n * sizeof(int));
}

/**
 * 验证数组是否有序
 */
int is_sorted(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) return 0;
    }
    return 1;
}

/**
 * 测试单个排序算法
 */
double test_sort(void (*sort_func)(int[], int), int arr[], int n, 
                 const char* name, int print_result) {
    clock_t start = clock();
    sort_func(arr, n);
    clock_t end = clock();
    double time_ms = (double)(end - start) * 1000.0 / CLOCKS_PER_SEC;
    
    if (!is_sorted(arr, n)) {
        printf("  %-25s: 排序失败！\n", name);
    } else if (print_result) {
        printf("  %-25s: %10.3f ms\n", name, time_ms);
    }
    return time_ms;
}

/**
 * 综合性能对比主函数
 */
int main() {
    printf("╔══════════════════════════════════════════════════════╗\n");
    printf("║           排序算法综合性能对比测试                      ║\n");
    printf("╚══════════════════════════════════════════════════════╝\n\n");
    
    srand((unsigned int)time(NULL));
    
    // 测试不同规模
    int test_sizes[] = {100, 1000, 5000, 10000};
    int num_sizes = sizeof(test_sizes) / sizeof(test_sizes[0]);
    
    // 定义排序算法数组
    typedef struct {
        void (*func)(int[], int);
        const char* name;
    } SortAlgorithm;
    
    SortAlgorithm algorithms[] = {
        {bubble_sort,    "冒泡排序"},
        {selection_sort, "选择排序"},
        {insertion_sort, "插入排序"},
        {shell_sort,     "希尔排序"},
        {quick_sort,     "快速排序"},
        {merge_sort,     "归并排序"},
        {heap_sort,      "堆排序"},
    };
    int num_algorithms = sizeof(algorithms) / sizeof(algorithms[0]);
    
    for (int s = 0; s < num_sizes; s++) {
        int n = test_sizes[s];
        printf("━━━ 数组规模: n = %d ━━━\n", n);
        
        // 生成随机数据
        int* original = (int*)malloc(n * sizeof(int));
        int* test_arr = (int*)malloc(n * sizeof(int));
        for (int i = 0; i < n; i++) {
            original[i] = rand() % 100000;
        }
        
        for (int a = 0; a < num_algorithms; a++) {
            copy_array(test_arr, original, n);
            test_sort(algorithms[a].func, test_arr, n, algorithms[a].name, 1);
        }
        
        free(original);
        free(test_arr);
        printf("\n");
    }
    
    // 测试接近有序的数据
    printf("━━━ 接近有序数据测试 (n=5000) ━━━\n");
    int n_ordered = 5000;
    int* original = (int*)malloc(n_ordered * sizeof(int));
    int* test_arr = (int*)malloc(n_ordered * sizeof(int));
    
    for (int i = 0; i < n_ordered; i++) {
        original[i] = i;
    }
    // 随机交换少量元素
    for (int i = 0; i < 50; i++) {
        int idx1 = rand() % n_ordered;
        int idx2 = rand() % n_ordered;
        swap(&original[idx1], &original[idx2]);
    }
    
    for (int a = 0; a < num_algorithms; a++) {
        copy_array(test_arr, original, n_ordered);
        printf("  %-25s: ", algorithms[a].name);
        test_sort(algorithms[a].func, test_arr, n_ordered, algorithms[a].name, 1);
    }
    
    free(original);
    free(test_arr);
    printf("\n");
    
    // 总结
    printf("══════════════════════════════════════════════════════\n");
    printf("测试总结：\n");
    printf("1. O(n²)算法（冒泡、选择、插入）仅适合小规模数据\n");
    printf("2. 希尔排序在中等规模数据上表现良好\n");
    printf("3. O(n log n)算法（快速、归并、堆）在大规模数据上优势明显\n");
    printf("4. 快速排序在随机数据上通常最快\n");
    printf("5. 插入排序在接近有序数据上表现最优\n");
    printf("══════════════════════════════════════════════════════\n");
    
    return 0;
}
```

## 总结与对比

### 排序算法综合对比

| 算法 | 最优时间 | 最坏时间 | 平均时间 | 空间 | 稳定 | 适用场景 |
|------|----------|----------|----------|------|------|----------|
| 冒泡排序 | O(n) | O(n²) | O(n²) | O(1) | 是 | 教学演示 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 否 | 数据移动成本高 |
| 插入排序 | O(n) | O(n²) | O(n²) | O(1) | 是 | 小规模/接近有序 |
| 希尔排序 | O(n log n) | O(n²) | 取决于序列 | O(1) | 否 | 中等规模 |
| 快速排序 | O(n log n) | O(n²) | O(n log n) | O(log n) | 否 | 通用首选 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | 是 | 需稳定/链表 |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | 否 | 内存受限 |
| 计数排序 | O(n+k) | O(n+k) | O(n+k) | O(n+k) | 是 | 整数/范围小 |
| 基数排序 | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | 是 | 整数/位数少 |

### 算法选择策略

1. **通用场景**：快速排序是最常用的选择，平均性能最优。
2. **需要稳定排序**：归并排序是O(n log n)级别的稳定排序首选。
3. **内存非常有限**：堆排序是原地O(n log n)排序的唯一选择。
4. **数据量很小（n < 50）**：插入排序由于常数因子小，实际最快。
5. **数据接近有序**：插入排序或冒泡排序（优化版）表现最好。
6. **整数且范围小**：计数排序可以达到O(n)时间。
7. **整数且位数少**：基数排序可以高效处理大范围整数。

通过本文的学习，你应该已经掌握了从O(n²)到O(n log n)再到O(n)的各种排序算法。理解这些算法的原理和适用场景，能够帮助你在实际开发中做出正确的选择。建议读者动手运行所有代码示例，并尝试修改参数观察性能变化，以加深对排序算法的理解。
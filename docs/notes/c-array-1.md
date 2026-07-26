---
title: C语言数组与函数Ⅰ
date: 2026-07-26
tags:
  - C语言
  - 数组
  - 一维数组
  - 排序
  - 查找
categories:
  - C语言
---

# C语言数组与函数Ⅰ——一维数组完全指南

## 一、引言

数组是C语言中最基本的数据结构，它将相同类型的多个元素连续存储在内存中。理解数组的存储方式、访问模式和边界控制，是写出正确、高效C程序的基础。本章从一维数组开始，深入探讨数组的定义、初始化、遍历、内存布局，以及排序和查找等经典算法。

---

## 二、数组定义与初始化

### 2.1 数组的定义

```c
#include <stdio.h>

int main() {
    printf("========== 数组定义 ==========\n\n");

    // 方式1：声明时指定大小
    int arr1[5];  // 未初始化，元素值为垃圾值
    printf("未初始化的数组arr1: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr1[i]);
    }
    printf("(垃圾值)\n");

    // 方式2：声明时指定大小并初始化
    int arr2[5] = {10, 20, 30, 40, 50};
    printf("完全初始化arr2: ");
    for (int i = 0; i < 5; i++) printf("%d ", arr2[i]);
    printf("\n");

    // 方式3：部分初始化（其余元素自动初始化为0）
    int arr3[5] = {1, 2, 3};
    printf("部分初始化arr3: ");
    for (int i = 0; i < 5; i++) printf("%d ", arr3[i]);
    printf("(后两个自动为0)\n");

    // 方式4：不指定大小（编译器自动推导）
    int arr4[] = {100, 200, 300, 400};
    printf("自动推导大小arr4: 大小=%zu, 元素: ", sizeof(arr4)/sizeof(arr4[0]));
    for (int i = 0; i < 4; i++) printf("%d ", arr4[i]);
    printf("\n");

    // 方式5：C99指定初始化器
    int arr5[10] = {[0]=10, [5]=50, [9]=90};
    printf("指定初始化arr5: ");
    for (int i = 0; i < 10; i++) printf("%d ", arr5[i]);
    printf("\n");

    // 方式6：全零初始化
    int arr6[100] = {0};
    printf("全零初始化: arr6[0]=%d, arr6[50]=%d, arr6[99]=%d\n",
           arr6[0], arr6[50], arr6[99]);

    return 0;
}
```

### 2.2 数组的内存布局

```c
#include <stdio.h>

int main() {
    printf("========== 数组内存布局 ==========\n\n");

    int arr[5] = {10, 20, 30, 40, 50};

    printf("数组名arr = %p\n", (void*)arr);
    printf("&arr[0]  = %p\n\n", (void*)&arr[0]);

    printf("【各元素地址与值】\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d, 地址: %p, 偏移: %td字节\n",
               i, arr[i], (void*)&arr[i],
               (char*)&arr[i] - (char*)arr);
    }

    printf("\n【验证连续存储】\n");
    printf("sizeof(arr[0]) = %zu字节\n", sizeof(arr[0]));
    printf("相邻元素地址差 = %td字节\n",
           (char*)&arr[1] - (char*)&arr[0]);

    printf("\n【数组总大小】\n");
    printf("sizeof(arr) = %zu字节\n", sizeof(arr));

    printf("\n【数组与指针的区别】\n");
    printf("arr 的值: %p\n", (void*)arr);
    printf("&arr 的值: %p (相同!)\n", (void*)&arr);
    printf("arr + 1: %p (跳过1个元素)\n", (void*)(arr + 1));
    printf("&arr + 1: %p (跳过整个数组!)\n", (void*)(&arr + 1));

    return 0;
}
```

### 2.3 数组的遍历方式

```c
#include <stdio.h>

int main() {
    printf("========== 数组遍历方式 ==========\n\n");

    int arr[] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    int len = sizeof(arr) / sizeof(arr[0]);

    // 方式1：下标遍历
    printf("1. 下标遍历: ");
    for (int i = 0; i < len; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    // 方式2：指针遍历
    printf("2. 指针遍历: ");
    for (int* p = arr; p < arr + len; p++) {
        printf("%d ", *p);
    }
    printf("\n");

    // 方式3：反向遍历
    printf("3. 反向遍历: ");
    for (int i = len - 1; i >= 0; i--) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    // 方式4：隔一个遍历（步长2）
    printf("4. 隔一个遍历: ");
    for (int i = 0; i < len; i += 2) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    // 方式5：while循环遍历
    printf("5. while遍历: ");
    int i = 0;
    while (i < len) {
        printf("%d ", arr[i]);
        i++;
    }
    printf("\n");

    return 0;
}
```

---

## 三、数组的经典算法

### 3.1 查找算法

```c
#include <stdio.h>

// 线性查找
int linear_search(int arr[], int len, int target) {
    for (int i = 0; i < len; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// 二分查找（数组必须有序）
int binary_search(int arr[], int len, int target) {
    int left = 0, right = len - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    printf("========== 查找算法 ==========\n\n");

    int arr[] = {12, 25, 33, 47, 58, 62, 79, 84, 91, 100};
    int len = sizeof(arr) / sizeof(arr[0]);

    printf("数组: ");
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n\n");

    int targets[] = {33, 62, 100, 50, 12};
    for (int i = 0; i < 5; i++) {
        int t = targets[i];
        int idx = binary_search(arr, len, t);
        if (idx != -1) {
            printf("找到 %d 在索引 %d 处\n", t, idx);
        } else {
            printf("未找到 %d\n", t);
        }
    }

    return 0;
}
```

### 3.2 排序算法

```c
#include <stdio.h>
#include <stdbool.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void print_array(int arr[], int len, const char* msg) {
    printf("%s: ", msg);
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n");
}

// 冒泡排序
void bubble_sort(int arr[], int len) {
    for (int i = 0; i < len - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// 选择排序
void selection_sort(int arr[], int len) {
    for (int i = 0; i < len - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < len; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(&arr[i], &arr[min_idx]);
        }
    }
}

// 插入排序
void insertion_sort(int arr[], int len) {
    for (int i = 1; i < len; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    printf("========== 排序算法 ==========\n\n");

    int original[] = {64, 34, 25, 12, 22, 11, 90, 45, 33, 78};
    int len = sizeof(original) / sizeof(original[0]);

    print_array(original, len, "原始数组");

    int arr1[10], arr2[10], arr3[10];
    for (int i = 0; i < len; i++) {
        arr1[i] = arr2[i] = arr3[i] = original[i];
    }

    bubble_sort(arr1, len);
    print_array(arr1, len, "冒泡排序");

    selection_sort(arr2, len);
    print_array(arr2, len, "选择排序");

    insertion_sort(arr3, len);
    print_array(arr3, len, "插入排序");

    return 0;
}
```

### 3.3 数组去重

```c
#include <stdio.h>

int remove_duplicates(int arr[], int len) {
    if (len <= 1) return len;

    int new_len = 0;
    for (int i = 0; i < len; i++) {
        int is_dup = 0;
        for (int j = 0; j < new_len; j++) {
            if (arr[i] == arr[j]) {
                is_dup = 1;
                break;
            }
        }
        if (!is_dup) {
            arr[new_len] = arr[i];
            new_len++;
        }
    }
    return new_len;
}

int main() {
    printf("========== 数组去重 ==========\n\n");

    int arr[] = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9};
    int len = sizeof(arr) / sizeof(arr[0]);

    printf("原始数组(%d个元素): ", len);
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n");

    int new_len = remove_duplicates(arr, len);
    printf("去重后(%d个元素): ", new_len);
    for (int i = 0; i < new_len; i++) printf("%d ", arr[i]);
    printf("\n");

    return 0;
}
```

---

## 四、数组的边界与安全

### 4.1 数组越界

```c
#include <stdio.h>

int main() {
    printf("========== 数组越界 ==========\n\n");

    int arr[5] = {10, 20, 30, 40, 50};
    int before = 999;
    int after = 888;

    printf("arr[5] = {10, 20, 30, 40, 50}\n\n");

    printf("【合法访问】\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }

    printf("\n【越界访问（未定义行为！）】\n");
    printf("arr[-1] = %d (可能访问到before变量)\n", arr[-1]);
    printf("arr[5]  = %d (可能访问到after变量)\n", arr[5]);
    printf("arr[100] = %d (可能崩溃或读到随机值)\n", arr[100]);

    printf("\n【越界写入的后果】\n");
    printf("before = %d (可能被修改)\n", before);
    arr[-1] = 555;
    printf("arr[-1] = 555 后, before = %d\n", before);

    printf("\n结论：C语言不检查数组越界，程序员必须自己保证！\n");
    return 0;
}
```

### 4.2 变长数组VLA

```c
#include <stdio.h>

int main() {
    printf("========== 变长数组 VLA (C99) ==========\n\n");

    int n;
    printf("请输入数组大小: ");
    scanf("%d", &n);

    // VLA：数组大小在运行时确定
    int vla[n];

    printf("VLA大小: %zu字节\n", sizeof(vla));

    for (int i = 0; i < n; i++) {
        vla[i] = i * i;
    }

    printf("VLA内容: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", vla[i]);
    }
    printf("\n");

    printf("\n注意：\n");
    printf("1. VLA分配在栈上，大小过大会导致栈溢出\n");
    printf("2. C11中VLA变为可选特性\n");
    printf("3. 生产代码建议使用malloc代替VLA\n");

    return 0;
}
```

---

## 五、综合实战：数组工具箱

```c
#include <stdio.h>
#include <limits.h>

void print_array(int arr[], int len) {
    for (int i = 0; i < len; i++) printf("%d ", arr[i]);
    printf("\n");
}

// 统计
int sum_array(int arr[], int len) {
    int sum = 0;
    for (int i = 0; i < len; i++) sum += arr[i];
    return sum;
}

double avg_array(int arr[], int len) {
    return (double)sum_array(arr, len) / len;
}

int max_array(int arr[], int len) {
    int max = INT_MIN;
    for (int i = 0; i < len; i++)
        if (arr[i] > max) max = arr[i];
    return max;
}

int min_array(int arr[], int len) {
    int min = INT_MAX;
    for (int i = 0; i < len; i++)
        if (arr[i] < min) min = arr[i];
    return min;
}

// 反转
void reverse_array(int arr[], int len) {
    for (int i = 0; i < len / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[len - 1 - i];
        arr[len - 1 - i] = temp;
    }
}

// 左移
void rotate_left(int arr[], int len, int k) {
    k %= len;
    for (int step = 0; step < k; step++) {
        int first = arr[0];
        for (int i = 0; i < len - 1; i++) arr[i] = arr[i + 1];
        arr[len - 1] = first;
    }
}

int main() {
    printf("========== 数组工具箱 ==========\n\n");

    int arr[] = {45, 12, 78, 34, 23, 89, 56, 91, 67, 10};
    int len = sizeof(arr) / sizeof(arr[0]);

    printf("数组: "); print_array(arr, len);

    printf("\n统计信息:\n");
    printf("  总和: %d\n", sum_array(arr, len));
    printf("  平均: %.2f\n", avg_array(arr, len));
    printf("  最大: %d\n", max_array(arr, len));
    printf("  最小: %d\n", min_array(arr, len));

    reverse_array(arr, len);
    printf("\n反转后: "); print_array(arr, len);

    rotate_left(arr, len, 3);
    printf("左移3位: "); print_array(arr, len);

    return 0;
}
```

---

## 本章小结

本章从一维数组开始，深入讲解了：

1. **定义与初始化**：六种初始化方式、指定初始化器(C99)
2. **内存布局**：连续存储、地址计算、arr与&arr的区别
3. **遍历方式**：下标、指针、反向、步长、while
4. **经典算法**：线性查找、二分查找、冒泡/选择/插入排序、去重
5. **边界安全**：越界访问的危害、VLA的注意事项
6. **综合实战**：数组工具箱（统计、反转、旋转）

数组是C语言程序设计的基石，掌握一维数组是学习多维数组和指针的前提。
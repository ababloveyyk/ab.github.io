---
title: C语言指针与内存Ⅲ
date: 2026-07-26
tags:
  - C语言
  - 动态内存
  - malloc
  - 内存泄漏
  - 调试
categories:
  - C语言
---

# C语言指针与内存Ⅲ——动态内存管理

## 一、引言

动态内存管理是C语言最强大也最危险的特性和。malloc、calloc、realloc、free这四个函数赋予了程序员直接控制堆内存的能力，但也带来了内存泄漏、悬垂指针、双重释放等经典Bug。本章将深入剖析动态内存的每个细节，并通过实际案例展示正确的内存管理方式。

---

## 二、malloc/calloc/realloc/free

### 2.1 malloc 基础

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    printf("========== malloc 基础 ==========\n\n");

    // 分配单个整数
    int* p1 = (int*)malloc(sizeof(int));
    if (p1 == NULL) {
        printf("内存分配失败!\n");
        return 1;
    }
    *p1 = 42;
    printf("单个int: *p1 = %d, 地址=%p\n", *p1, (void*)p1);
    free(p1);

    // 分配数组
    int n = 5;
    int* arr = (int*)malloc(n * sizeof(int));
    if (arr == NULL) { printf("分配失败\n"); return 1; }

    for (int i = 0; i < n; i++) arr[i] = i * 10;
    printf("\n动态数组: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    free(arr);

    // 分配字符串
    char* str = (char*)malloc(50);
    strcpy(str, "Hello, Dynamic Memory!");
    printf("\n动态字符串: %s\n", str);
    free(str);

    return 0;
}
```

### 2.2 calloc 与 realloc

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("========== calloc 与 realloc ==========\n\n");

    // calloc: 分配并初始化为0
    int n = 5;
    int* arr1 = (int*)calloc(n, sizeof(int));
    printf("calloc 自动初始化为0: ");
    for (int i = 0; i < n; i++) printf("%d ", arr1[i]);
    printf("\n\n");

    // realloc: 调整已分配内存的大小
    int* arr2 = (int*)malloc(3 * sizeof(int));
    arr2[0] = 10; arr2[1] = 20; arr2[2] = 30;
    printf("原始(malloc 3): ");
    for (int i = 0; i < 3; i++) printf("%d ", arr2[i]);
    printf("\n");

    // 扩大
    arr2 = (int*)realloc(arr2, 5 * sizeof(int));
    arr2[3] = 40; arr2[4] = 50;
    printf("扩大后(realloc 5): ");
    for (int i = 0; i < 5; i++) printf("%d ", arr2[i]);
    printf("\n");

    // 缩小
    arr2 = (int*)realloc(arr2, 2 * sizeof(int));
    printf("缩小后(realloc 2): ");
    for (int i = 0; i < 2; i++) printf("%d ", arr2[i]);
    printf("\n");

    free(arr2);
    free(arr1);

    printf("\ncalloc vs malloc:\n");
    printf("malloc: 不初始化，内容为垃圾值\n");
    printf("calloc: 初始化为0，适合数组\n");
    printf("calloc(n, size) 等价于 malloc(n*size) + memset(0)\n");

    return 0;
}
```

### 2.3 动态数组实现

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int* data;
    int size;
    int capacity;
} DynamicArray;

DynamicArray* da_create(int initial_capacity) {
    DynamicArray* da = (DynamicArray*)malloc(sizeof(DynamicArray));
    da->data = (int*)malloc(initial_capacity * sizeof(int));
    da->size = 0;
    da->capacity = initial_capacity;
    return da;
}

void da_push_back(DynamicArray* da, int value) {
    if (da->size >= da->capacity) {
        da->capacity *= 2;
        da->data = (int*)realloc(da->data, da->capacity * sizeof(int));
        printf("(扩容到 %d)\n", da->capacity);
    }
    da->data[da->size++] = value;
}

int da_get(DynamicArray* da, int index) {
    if (index < 0 || index >= da->size) {
        printf("索引越界!\n");
        return -1;
    }
    return da->data[index];
}

void da_destroy(DynamicArray* da) {
    free(da->data);
    free(da);
}

int main() {
    printf("========== 动态数组实现 ==========\n\n");

    DynamicArray* da = da_create(4);
    printf("初始容量: %d\n\n", da->capacity);

    for (int i = 1; i <= 10; i++) {
        da_push_back(da, i * 10);
        printf("添加 %d, size=%d, capacity=%d\n",
               i * 10, da->size, da->capacity);
    }

    printf("\n最终内容: ");
    for (int i = 0; i < da->size; i++) {
        printf("%d ", da_get(da, i));
    }
    printf("\n");

    da_destroy(da);
    return 0;
}
```

---

## 三、常见内存Bug

### 3.1 内存泄漏

```c
#include <stdio.h>
#include <stdlib.h>

void leak_example() {
    int* p = (int*)malloc(sizeof(int));
    *p = 42;
    // 忘记 free(p);  ← 内存泄漏！
    printf("leak_example: 分配了内存但未释放\n");
}

int main() {
    printf("========== 内存泄漏 ==========\n\n");

    leak_example();
    printf("函数返回后，分配的4字节永远无法释放\n\n");

    printf("常见泄漏场景:\n");
    printf("1. 忘记调用free\n");
    printf("2. 提前return，跳过了free\n");
    printf("3. 异常路径没有释放资源\n");
    printf("4. 循环中重复分配而不释放\n");
    printf("5. 修改了指针后free(原指针)\n\n");

    printf("检测工具:\n");
    printf("  Valgrind: valgrind --leak-check=full ./program\n");
    printf("  AddressSanitizer: gcc -fsanitize=address\n");

    return 0;
}
```

### 3.2 悬垂指针与双重释放

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("========== 悬垂指针与双重释放 ==========\n\n");

    printf("【悬垂指针】\n");
    int* p = (int*)malloc(sizeof(int));
    *p = 100;
    printf("free前: *p = %d\n", *p);
    free(p);
    // p现在是悬垂指针，指向已释放的内存
    printf("free后: p仍指向 %p (悬垂指针!)\n", (void*)p);
    printf("访问*p = %d (未定义行为!)\n", *p);

    printf("\n【正确做法】\n");
    int* q = (int*)malloc(sizeof(int));
    *q = 200;
    printf("free前: *q = %d\n", *q);
    free(q);
    q = NULL;  // 将指针置为NULL
    printf("free后: q = %p (NULL，安全)\n", (void*)q);

    printf("\n【双重释放】\n");
    int* r = (int*)malloc(sizeof(int));
    free(r);
    printf("第一次free(r) OK\n");
    // free(r);  // 双重释放！未定义行为
    printf("第二次free(r) 是双重释放，会导致崩溃\n");

    printf("\n【释放后使用】\n");
    int* arr = (int*)malloc(5 * sizeof(int));
    for (int i = 0; i < 5; i++) arr[i] = i;
    free(arr);
    printf("arr[2] = %d (未定义行为，可能读到垃圾值)\n", arr[2]);

    return 0;
}
```

### 3.3 缓冲区溢出

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    printf("========== 缓冲区溢出 ==========\n\n");

    // 堆缓冲区溢出
    printf("【堆缓冲区溢出】\n");
    int* arr = (int*)malloc(3 * sizeof(int));
    arr[0] = 1; arr[1] = 2; arr[2] = 3;
    printf("arr[0]=%d arr[1]=%d arr[2]=%d\n", arr[0], arr[1], arr[2]);
    printf("arr[3] = %d (越界读取)\n", arr[3]);
    // arr[3] = 4;  // 越界写入，破坏堆元数据
    printf("越界写入可能破坏malloc的内部数据结构\n");
    free(arr);

    // 字符串溢出
    printf("\n【字符串溢出】\n");
    char* buf = (char*)malloc(5);
    // strcpy(buf, "Hello World!");  // 溢出！需要12字节
    strcpy(buf, "Hi");
    printf("安全: buf = \"%s\"\n", buf);
    free(buf);

    printf("\n防护措施:\n");
    printf("1. 使用snprintf代替sprintf\n");
    printf("2. 使用strncpy代替strcpy\n");
    printf("3. 使用-fstack-protector编译选项\n");
    printf("4. 使用AddressSanitizer检测\n");

    return 0;
}
```

---

## 四、内存调试工具

### 4.1 自定义内存追踪器

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ALLOCS 1000

typedef struct {
    void* ptr;
    size_t size;
    char file[64];
    int line;
} AllocRecord;

AllocRecord records[MAX_ALLOCS];
int record_count = 0;
size_t total_allocated = 0;

void* tracked_malloc(size_t size, const char* file, int line) {
    void* ptr = malloc(size);
    if (ptr && record_count < MAX_ALLOCS) {
        records[record_count].ptr = ptr;
        records[record_count].size = size;
        strncpy(records[record_count].file, file, 63);
        records[record_count].line = line;
        record_count++;
        total_allocated += size;
    }
    return ptr;
}

void tracked_free(void* ptr, const char* file, int line) {
    for (int i = 0; i < record_count; i++) {
        if (records[i].ptr == ptr) {
            total_allocated -= records[i].size;
            records[i] = records[record_count - 1];
            record_count--;
            break;
        }
    }
    free(ptr);
}

void print_memory_stats() {
    printf("\n【内存统计】\n");
    printf("当前分配数: %d\n", record_count);
    printf("当前分配大小: %zu字节\n", total_allocated);

    if (record_count > 0) {
        printf("\n未释放的内存:\n");
        for (int i = 0; i < record_count; i++) {
            printf("  %p: %zu字节 @ %s:%d\n",
                   records[i].ptr, records[i].size,
                   records[i].file, records[i].line);
        }
    }
}

#define MALLOC(size) tracked_malloc(size, __FILE__, __LINE__)
#define FREE(ptr) tracked_free(ptr, __FILE__, __LINE__)

int main() {
    printf("========== 自定义内存追踪器 ==========\n\n");

    int* a = (int*)MALLOC(sizeof(int) * 10);
    char* b = (char*)MALLOC(100);
    double* c = (double*)MALLOC(sizeof(double) * 5);

    printf("分配了3块内存\n");
    print_memory_stats();

    FREE(a);
    printf("\n释放a后:\n");
    print_memory_stats();

    FREE(b);
    FREE(c);
    printf("\n全部释放后:\n");
    print_memory_stats();

    return 0;
}
```

---

## 五、综合实战：内存池

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define POOL_SIZE 1024
#define BLOCK_SIZE 32

typedef struct MemoryPool {
    char pool[POOL_SIZE];
    int free_list[POOL_SIZE / BLOCK_SIZE];
    int free_count;
    int total_blocks;
    int used_blocks;
} MemoryPool;

void mp_init(MemoryPool* mp) {
    mp->total_blocks = POOL_SIZE / BLOCK_SIZE;
    mp->free_count = mp->total_blocks;
    mp->used_blocks = 0;
    for (int i = 0; i < mp->total_blocks; i++) {
        mp->free_list[i] = i;
    }
    memset(mp->pool, 0, POOL_SIZE);
}

void* mp_alloc(MemoryPool* mp) {
    if (mp->free_count == 0) {
        printf("内存池已满!\n");
        return NULL;
    }
    int block = mp->free_list[--mp->free_count];
    mp->used_blocks++;
    return mp->pool + block * BLOCK_SIZE;
}

void mp_free(MemoryPool* mp, void* ptr) {
    if (ptr == NULL) return;
    int block = ((char*)ptr - mp->pool) / BLOCK_SIZE;
    if (block < 0 || block >= mp->total_blocks) {
        printf("无效的指针!\n");
        return;
    }
    mp->free_list[mp->free_count++] = block;
    mp->used_blocks--;
}

void mp_stats(MemoryPool* mp) {
    printf("总块数: %d, 已用: %d, 空闲: %d (%.1f%%)\n",
           mp->total_blocks, mp->used_blocks, mp->free_count,
           (float)mp->used_blocks / mp->total_blocks * 100);
}

int main() {
    printf("========== 内存池实现 ==========\n\n");

    MemoryPool mp;
    mp_init(&mp);
    mp_stats(&mp);

    printf("\n分配5个块:\n");
    void* ptrs[5];
    for (int i = 0; i < 5; i++) {
        ptrs[i] = mp_alloc(&mp);
        printf("分配块%d: %p\n", i, ptrs[i]);
    }
    mp_stats(&mp);

    printf("\n释放2个块:\n");
    mp_free(&mp, ptrs[1]);
    mp_free(&mp, ptrs[3]);
    mp_stats(&mp);

    printf("\n再分配2个块:\n");
    void* p1 = mp_alloc(&mp);
    void* p2 = mp_alloc(&mp);
    printf("新分配: %p, %p\n", p1, p2);
    mp_stats(&mp);

    printf("\n内存池优点:\n");
    printf("1. 无内存碎片\n");
    printf("2. 分配/释放 O(1)\n");
    printf("3. 适合固定大小对象的频繁分配\n");

    return 0;
}
```

---

## 本章小结

本章深入剖析了动态内存管理：

1. **malloc/calloc/realloc/free**：基本用法、区别、动态数组实现
2. **常见内存Bug**：内存泄漏、悬垂指针、双重释放、缓冲区溢出
3. **调试工具**：自定义内存追踪器
4. **综合实战**：内存池实现

掌握动态内存管理是成为C语言高手的关键。建议使用Valgrind或AddressSanitizer检测内存问题。
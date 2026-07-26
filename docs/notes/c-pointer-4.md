---
title: C语言指针与内存Ⅳ
date: 2026-07-26
tags:
  - C语言
  - 指针
  - 链表
  - 函数指针
  - void指针
categories:
  - C语言
---

# C语言指针与内存Ⅳ——指针实战应用

## 一、引言

指针不仅是理论概念，更是解决实际问题的利器。本章将指针应用于链表操作、通用算法、回调函数等实际场景。每个例子都配有完整可运行代码，帮助将指针知识转化为实际编程能力。

---

## 二、单链表操作

### 2.1 链表基础操作

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* create_node(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->next = NULL;
    return node;
}

void insert_head(Node** head, int data) {
    Node* node = create_node(data);
    node->next = *head;
    *head = node;
}

void insert_tail(Node** head, int data) {
    Node* node = create_node(data);
    if (*head == NULL) {
        *head = node;
        return;
    }
    Node* cur = *head;
    while (cur->next) cur = cur->next;
    cur->next = node;
}

void delete_node(Node** head, int data) {
    Node* cur = *head, *prev = NULL;
    while (cur && cur->data != data) {
        prev = cur;
        cur = cur->next;
    }
    if (!cur) return;
    if (!prev) *head = cur->next;
    else prev->next = cur->next;
    free(cur);
}

void print_list(Node* head) {
    while (head) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\n");
}

void free_list(Node* head) {
    while (head) {
        Node* temp = head;
        head = head->next;
        free(temp);
    }
}

int main() {
    printf("========== 单链表操作 ==========\n\n");

    Node* head = NULL;
    insert_tail(&head, 10);
    insert_tail(&head, 20);
    insert_tail(&head, 30);
    printf("尾插: "); print_list(head);

    insert_head(&head, 5);
    printf("头插: "); print_list(head);

    delete_node(&head, 20);
    printf("删除20: "); print_list(head);

    free_list(head);
    return 0;
}
```

### 2.2 链表反转

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node* next; } Node;

Node* create(int d) { Node* n=malloc(sizeof(Node)); n->data=d; n->next=NULL; return n; }
void append(Node** h, int d) {
    Node* n=create(d); if(!*h){*h=n;return;}
    Node* c=*h; while(c->next)c=c->next; c->next=n;
}
void print(Node* h) { while(h){printf("%d ",h->data);h=h->next;} printf("\n"); }

// 迭代反转
Node* reverse_iterative(Node* head) {
    Node *prev = NULL, *cur = head, *next;
    while (cur) {
        next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}

// 递归反转
Node* reverse_recursive(Node* head) {
    if (!head || !head->next) return head;
    Node* new_head = reverse_recursive(head->next);
    head->next->next = head;
    head->next = NULL;
    return new_head;
}

int main() {
    printf("========== 链表反转 ==========\n\n");
    Node* h1=NULL;
    for(int i=1;i<=5;i++) append(&h1,i);
    printf("原始: "); print(h1);
    h1=reverse_iterative(h1);
    printf("反转: "); print(h1);

    Node* h2=NULL;
    for(int i=1;i<=5;i++) append(&h2,i);
    h2=reverse_recursive(h2);
    printf("递归: "); print(h2);

    while(h1){Node*t=h1;h1=h1->next;free(t);}
    while(h2){Node*t=h2;h2=h2->next;free(t);}
    return 0;
}
```

---

## 三、通用算法与void指针

### 3.1 通用交换与查找

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void generic_swap(void* a, void* b, size_t size) {
    void* temp = malloc(size);
    memcpy(temp, a, size);
    memcpy(a, b, size);
    memcpy(b, temp, size);
    free(temp);
}

void* generic_find(void* arr, int n, size_t size, void* target,
                   int (*cmp)(const void*, const void*)) {
    char* base = (char*)arr;
    for (int i = 0; i < n; i++) {
        if (cmp(base + i * size, target) == 0) {
            return base + i * size;
        }
    }
    return NULL;
}

int cmp_int(const void* a, const void* b) {
    return *(int*)a - *(int*)b;
}

int cmp_double(const void* a, const void* b) {
    double diff = *(double*)a - *(double*)b;
    return (diff > 0) - (diff < 0);
}

int main() {
    printf("========== 通用算法 ==========\n\n");

    int a = 10, b = 20;
    printf("交换前: a=%d, b=%d\n", a, b);
    generic_swap(&a, &b, sizeof(int));
    printf("交换后: a=%d, b=%d\n\n", a, b);

    int arr[] = {1, 3, 5, 7, 9, 11};
    int target = 7;
    int* found = (int*)generic_find(arr, 6, sizeof(int), &target, cmp_int);
    printf("查找%d: %s\n", target, found ? "找到" : "未找到");

    double darr[] = {1.1, 2.2, 3.3, 4.4};
    double dt = 3.3;
    double* df = (double*)generic_find(darr, 4, sizeof(double), &dt, cmp_double);
    printf("查找%.1f: %s\n", dt, df ? "找到" : "未找到");

    return 0;
}
```

### 3.2 通用排序

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef int (*CompareFunc)(const void*, const void*);

void generic_bubble_sort(void* arr, int n, size_t size, CompareFunc cmp) {
    char* base = (char*)arr;
    void* temp = malloc(size);

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            void* a = base + j * size;
            void* b = base + (j + 1) * size;
            if (cmp(a, b) > 0) {
                memcpy(temp, a, size);
                memcpy(a, b, size);
                memcpy(b, temp, size);
            }
        }
    }
    free(temp);
}

int cmp_int_asc(const void* a, const void* b) { return *(int*)a - *(int*)b; }
int cmp_int_desc(const void* a, const void* b) { return *(int*)b - *(int*)a; }
int cmp_str(const void* a, const void* b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

int main() {
    printf("========== 通用排序 ==========\n\n");

    int nums[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(nums)/sizeof(nums[0]);

    generic_bubble_sort(nums, n, sizeof(int), cmp_int_asc);
    printf("整数升序: "); for(int i=0;i<n;i++) printf("%d ", nums[i]); printf("\n");

    generic_bubble_sort(nums, n, sizeof(int), cmp_int_desc);
    printf("整数降序: "); for(int i=0;i<n;i++) printf("%d ", nums[i]); printf("\n");

    char* words[] = {"banana","apple","grape","orange"};
    int w = sizeof(words)/sizeof(words[0]);
    generic_bubble_sort(words, w, sizeof(char*), cmp_str);
    printf("字符串: "); for(int i=0;i<w;i++) printf("%s ", words[i]); printf("\n");

    return 0;
}
```

---

## 四、函数指针实战

### 4.1 回调函数

```c
#include <stdio.h>

// 对数组每个元素执行操作
void for_each(int* arr, int len, void (*func)(int*)) {
    for (int i = 0; i < len; i++) func(&arr[i]);
}

void double_it(int* x) { *x *= 2; }
void square_it(int* x) { *x = *x * *x; }
void add_ten(int* x) { *x += 10; }
void print_element(int* x) { printf("%d ", *x); }

int main() {
    printf("========== 回调函数 ==========\n\n");

    int arr1[] = {1, 2, 3, 4, 5};
    printf("原始: "); for_each(arr1,5,print_element); printf("\n");

    for_each(arr1, 5, double_it);
    printf("乘2: "); for_each(arr1,5,print_element); printf("\n");

    int arr2[] = {1, 2, 3, 4, 5};
    for_each(arr2, 5, square_it);
    printf("平方: "); for_each(arr2,5,print_element); printf("\n");

    return 0;
}
```

### 4.2 策略模式

```c
#include <stdio.h>

typedef double (*TaxStrategy)(double income);

double tax_china(double income) {
    if (income <= 5000) return 0;
    if (income <= 8000) return (income - 5000) * 0.03;
    if (income <= 17000) return (income - 5000) * 0.10 - 210;
    return (income - 5000) * 0.20 - 1410;
}

double tax_simple(double income) {
    return income * 0.15;
}

double tax_flat(double income) {
    return income > 10000 ? (income - 10000) * 0.2 : 0;
}

double calculate_tax(double income, TaxStrategy strategy) {
    return strategy(income);
}

int main() {
    printf("========== 策略模式 ==========\n\n");

    double incomes[] = {3000, 6000, 10000, 15000, 30000};
    const char* countries[] = {"中国", "简化", "均一"};

    TaxStrategy strategies[] = {tax_china, tax_simple, tax_flat};

    printf("%-8s ", "收入");
    for(int i=0;i<3;i++) printf("%-10s ", countries[i]);
    printf("\n");

    for(int i=0;i<5;i++) {
        printf("%-8.0f ", incomes[i]);
        for(int j=0;j<3;j++)
            printf("%-10.2f ", calculate_tax(incomes[i], strategies[j]));
        printf("\n");
    }

    return 0;
}
```

---

## 五、综合实战：链表实现栈和队列

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Node { int data; struct Node* next; } Node;

// 栈
typedef struct { Node* top; int size; } Stack;

Stack* stack_create() { Stack* s=malloc(sizeof(Stack)); s->top=NULL; s->size=0; return s; }
void stack_push(Stack* s, int v) {
    Node* n=malloc(sizeof(Node)); n->data=v; n->next=s->top; s->top=n; s->size++;
}
int stack_pop(Stack* s) {
    if(!s->top) return -1;
    Node* t=s->top; int v=t->data; s->top=t->next; free(t); s->size--; return v;
}
bool stack_empty(Stack* s) { return s->top==NULL; }

// 队列
typedef struct { Node* front; Node* rear; int size; } Queue;

Queue* queue_create() { Queue* q=malloc(sizeof(Queue)); q->front=q->rear=NULL; q->size=0; return q; }
void queue_enqueue(Queue* q, int v) {
    Node* n=malloc(sizeof(Node)); n->data=v; n->next=NULL;
    if(!q->rear) q->front=q->rear=n;
    else { q->rear->next=n; q->rear=n; }
    q->size++;
}
int queue_dequeue(Queue* q) {
    if(!q->front) return -1;
    Node* t=q->front; int v=t->data;
    q->front=t->next; if(!q->front) q->rear=NULL;
    free(t); q->size--; return v;
}

int main() {
    printf("========== 栈和队列 ==========\n\n");

    Stack* s = stack_create();
    printf("入栈: ");
    for(int i=1;i<=5;i++) { stack_push(s,i*10); printf("%d ",i*10); }
    printf("\n出栈: ");
    while(!stack_empty(s)) printf("%d ", stack_pop(s));
    printf("\n\n");

    Queue* q = queue_create();
    printf("入队: ");
    for(int i=1;i<=5;i++) { queue_enqueue(q,i*10); printf("%d ",i*10); }
    printf("\n出队: ");
    for(int i=0;i<5;i++) printf("%d ", queue_dequeue(q));
    printf("\n");

    free(s); free(q);
    return 0;
}
```

---

## 本章小结

本章将指针应用于实战场景：

1. **链表操作**：创建、插入、删除、反转（迭代+递归）
2. **通用算法**：void指针实现通用swap、find、sort
3. **函数指针**：回调函数、策略模式
4. **综合实战**：链表实现栈和队列

指针是C语言的灵魂，掌握这些实战技巧是成为C语言高手的关键。
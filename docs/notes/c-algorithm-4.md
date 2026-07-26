---
title: C语言算法基础Ⅳ——栈与队列
date: 2026-07-26
tags:
  - C语言
  - 算法
  - 数据结构
  - 栈
  - 队列
categories:
  - C语言
---

## 前言

栈（Stack）和队列（Queue）是计算机科学中最基础也是最重要的两种线性数据结构。它们广泛应用于函数调用、表达式求值、括号匹配、缓冲区管理、广度优先搜索等众多场景。理解栈和队列的原理与实现，是掌握更复杂数据结构和算法的基础。

栈是一种后进先出（LIFO, Last In First Out）的数据结构，就像一叠盘子，最后放上去的盘子最先被取下来。栈的操作主要集中在顶部，包括入栈（push）、出栈（pop）和查看栈顶元素（peek）。栈的典型应用包括函数调用栈、括号匹配、表达式求值、深度优先搜索等。

队列是一种先进先出（FIFO, First In First Out）的数据结构，就像排队买票，先来的人先被服务。队列的操作包括入队（enqueue）和出队（dequeue）。队列的典型应用包括任务调度、缓冲区管理、广度优先搜索、消息队列等。

本文将全面介绍栈和队列的多种实现方式（数组实现、链表实现），以及它们在实际问题中的应用（括号匹配、表达式求值、环形队列、用两个栈实现队列等）。每种实现都会给出完整的C语言代码，并附带详细的注释和解释。

在学习过程中，你不仅要理解栈和队列的基本操作，更要理解它们的设计思想和适用场景。栈体现了"后进先出"的顺序约束，队列体现了"先进先出"的顺序约束，这些约束看似限制了操作，实际上却为解决特定问题提供了优雅的思路。

## 顺序栈

### 顺序栈的基本原理

顺序栈（Sequential Stack）是使用数组实现的栈。数组的连续内存特性使得顺序栈的实现非常简单高效。顺序栈的核心要素包括：
- 一个数组用于存储栈元素
- 一个栈顶指针（top）用于指示栈顶元素的位置
- 一个最大容量（capacity）用于限制栈的大小

顺序栈的入栈（push）操作：将元素放在top+1的位置，然后top自增1。出栈（pop）操作：返回top位置的元素，然后top自减1。当top == -1时栈为空，当top == capacity - 1时栈为满。

顺序栈的图示如下：

```
栈的操作过程（最大容量为5）：

初始状态：top = -1
[ ][ ][ ][ ][ ]
 ↑
top=-1

push(10): top = 0
[10][ ][ ][ ][ ]
    ↑
   top=0

push(20): top = 1
[10][20][ ][ ][ ]
        ↑
       top=1

push(30): top = 2
[10][20][30][ ][ ]
            ↑
           top=2

pop() → 返回30, top = 1
[10][20][ ][ ][ ]
        ↑
       top=1

push(40): top = 2
[10][20][40][ ][ ]
            ↑
           top=2
```

### 顺序栈的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 顺序栈结构体
 * 使用数组实现栈
 */
typedef struct {
    int* data;      // 指向栈数组的指针
    int top;        // 栈顶指针，-1表示空栈
    int capacity;   // 栈的最大容量
} SeqStack;

/**
 * 初始化顺序栈
 * 
 * @param capacity 栈的最大容量
 * @return         返回初始化的栈指针
 */
SeqStack* stack_create(int capacity) {
    // 分配栈结构体内存
    SeqStack* stack = (SeqStack*)malloc(sizeof(SeqStack));
    if (stack == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    
    // 分配栈数组内存
    stack->data = (int*)malloc(capacity * sizeof(int));
    if (stack->data == NULL) {
        printf("内存分配失败！\n");
        free(stack);
        exit(1);
    }
    
    stack->top = -1;          // 初始时栈为空
    stack->capacity = capacity;
    return stack;
}

/**
 * 判断栈是否为空
 * 
 * @param stack 栈指针
 * @return      true表示空栈，false表示非空
 */
bool stack_is_empty(SeqStack* stack) {
    return stack->top == -1;
}

/**
 * 判断栈是否已满
 * 
 * @param stack 栈指针
 * @return      true表示满栈，false表示未满
 */
bool stack_is_full(SeqStack* stack) {
    return stack->top == stack->capacity - 1;
}

/**
 * 获取栈中元素个数
 * 
 * @param stack 栈指针
 * @return      栈中元素个数
 */
int stack_size(SeqStack* stack) {
    return stack->top + 1;
}

/**
 * 入栈操作（push）
 * 
 * 将元素压入栈顶
 * 如果栈已满，则拒绝入栈
 * 
 * 时间复杂度：O(1)
 * 
 * @param stack 栈指针
 * @param value 要入栈的值
 * @return      true表示入栈成功，false表示栈已满
 */
bool stack_push(SeqStack* stack, int value) {
    // 检查栈是否已满
    if (stack_is_full(stack)) {
        printf("栈已满，无法入栈！\n");
        return false;
    }
    
    // 将栈顶指针上移一位，然后将值放入栈顶
    stack->top++;
    stack->data[stack->top] = value;
    return true;
}

/**
 * 出栈操作（pop）
 * 
 * 返回栈顶元素并将其从栈中移除
 * 如果栈为空，则返回错误
 * 
 * 时间复杂度：O(1)
 * 
 * @param stack  栈指针
 * @param value  用于接收出栈值的指针
 * @return       true表示出栈成功，false表示栈为空
 */
bool stack_pop(SeqStack* stack, int* value) {
    // 检查栈是否为空
    if (stack_is_empty(stack)) {
        printf("栈为空，无法出栈！\n");
        return false;
    }
    
    // 获取栈顶元素的值
    *value = stack->data[stack->top];
    // 栈顶指针下移一位
    stack->top--;
    return true;
}

/**
 * 查看栈顶元素（peek）
 * 
 * 返回栈顶元素但不将其从栈中移除
 * 
 * 时间复杂度：O(1)
 * 
 * @param stack  栈指针
 * @param value  用于接收栈顶值的指针
 * @return       true表示成功，false表示栈为空
 */
bool stack_peek(SeqStack* stack, int* value) {
    if (stack_is_empty(stack)) {
        printf("栈为空！\n");
        return false;
    }
    *value = stack->data[stack->top];
    return true;
}

/**
 * 打印栈的内容
 * 从栈底到栈顶打印
 */
void stack_print(SeqStack* stack) {
    if (stack_is_empty(stack)) {
        printf("栈为空\n");
        return;
    }
    printf("栈内容（栈底 → 栈顶）: ");
    for (int i = 0; i <= stack->top; i++) {
        printf("%d ", stack->data[i]);
    }
    printf("\n");
}

/**
 * 销毁栈，释放内存
 */
void stack_destroy(SeqStack* stack) {
    free(stack->data);
    free(stack);
}

/**
 * 顺序栈测试主函数
 */
int main() {
    printf("=== 顺序栈测试 ===\n\n");
    
    // 创建容量为5的栈
    SeqStack* stack = stack_create(5);
    printf("创建容量为5的顺序栈\n");
    printf("栈是否为空: %s\n", stack_is_empty(stack) ? "是" : "否");
    printf("\n");
    
    // 测试入栈操作
    printf("=== 入栈操作 ===\n");
    int values[] = {10, 20, 30, 40, 50};
    for (int i = 0; i < 5; i++) {
        printf("push(%d): ", values[i]);
        if (stack_push(stack, values[i])) {
            printf("成功, 栈大小=%d\n", stack_size(stack));
        }
    }
    stack_print(stack);
    printf("\n");
    
    // 测试栈满
    printf("=== 栈满测试 ===\n");
    printf("push(60): ");
    stack_push(stack, 60);  // 应该失败，因为栈已满
    printf("栈是否已满: %s\n", stack_is_full(stack) ? "是" : "否");
    printf("\n");
    
    // 测试查看栈顶
    printf("=== 查看栈顶 ===\n");
    int top_value;
    if (stack_peek(stack, &top_value)) {
        printf("栈顶元素: %d\n", top_value);
    }
    printf("\n");
    
    // 测试出栈操作
    printf("=== 出栈操作 ===\n");
    int popped_value;
    while (!stack_is_empty(stack)) {
        if (stack_pop(stack, &popped_value)) {
            printf("pop() = %d, 剩余大小=%d\n", popped_value, stack_size(stack));
        }
    }
    printf("\n");
    
    // 测试栈空
    printf("=== 栈空测试 ===\n");
    printf("栈是否为空: %s\n", stack_is_empty(stack) ? "是" : "否");
    printf("pop(): ");
    stack_pop(stack, &popped_value);  // 应该失败，因为栈为空
    
    stack_destroy(stack);
    return 0;
}
```

## 链栈

### 链栈的基本原理

链栈（Linked Stack）是使用链表实现的栈。与顺序栈不同，链栈不需要预先分配固定大小的内存，它可以根据需要动态增长和收缩。链栈的节点结构包含数据域和指向下一个节点的指针，栈顶指针指向链表的头节点。

链栈的入栈操作：在链表的头部插入新节点。出栈操作：删除链表的头节点。由于所有操作都在链表头部进行，链栈的所有操作都是O(1)时间复杂度。

链栈的优势在于不受固定容量的限制，可以动态扩展。但每个节点都需要额外的指针空间，且节点分配和释放的开销比数组操作大。

### 链栈的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 链栈节点结构体
 */
typedef struct StackNode {
    int data;                // 数据域
    struct StackNode* next;  // 指向下一个节点的指针
} StackNode;

/**
 * 链栈结构体
 * 使用头指针表示栈顶
 */
typedef struct {
    StackNode* top;  // 栈顶指针，指向链表的头节点
    int size;        // 栈中元素个数
} LinkedStack;

/**
 * 初始化链栈
 */
LinkedStack* lstack_create() {
    LinkedStack* stack = (LinkedStack*)malloc(sizeof(LinkedStack));
    if (stack == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    stack->top = NULL;  // 初始时栈为空
    stack->size = 0;
    return stack;
}

/**
 * 判断链栈是否为空
 */
bool lstack_is_empty(LinkedStack* stack) {
    return stack->top == NULL;
}

/**
 * 获取链栈大小
 */
int lstack_size(LinkedStack* stack) {
    return stack->size;
}

/**
 * 创建新节点
 */
StackNode* create_stack_node(int value) {
    StackNode* node = (StackNode*)malloc(sizeof(StackNode));
    if (node == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    node->data = value;
    node->next = NULL;
    return node;
}

/**
 * 入栈操作
 * 
 * 在链表头部插入新节点
 * 新节点成为新的栈顶
 * 
 * 时间复杂度：O(1)
 * 
 * @param stack 链栈指针
 * @param value 要入栈的值
 */
void lstack_push(LinkedStack* stack, int value) {
    // 创建新节点
    StackNode* new_node = create_stack_node(value);
    
    // 新节点的next指向原来的栈顶节点
    new_node->next = stack->top;
    
    // 更新栈顶指针
    stack->top = new_node;
    
    // 更新大小
    stack->size++;
}

/**
 * 出栈操作
 * 
 * 删除头节点，返回其值
 * 
 * 时间复杂度：O(1)
 * 
 * @param stack 链栈指针
 * @param value 用于接收出栈值的指针
 * @return      true表示成功，false表示栈为空
 */
bool lstack_pop(LinkedStack* stack, int* value) {
    if (lstack_is_empty(stack)) {
        printf("栈为空，无法出栈！\n");
        return false;
    }
    
    // 获取栈顶节点的值
    StackNode* temp = stack->top;
    *value = temp->data;
    
    // 更新栈顶指针
    stack->top = temp->next;
    
    // 释放旧栈顶节点
    free(temp);
    
    // 更新大小
    stack->size--;
    return true;
}

/**
 * 查看栈顶元素
 * 
 * 时间复杂度：O(1)
 */
bool lstack_peek(LinkedStack* stack, int* value) {
    if (lstack_is_empty(stack)) {
        printf("栈为空！\n");
        return false;
    }
    *value = stack->top->data;
    return true;
}

/**
 * 打印链栈
 */
void lstack_print(LinkedStack* stack) {
    if (lstack_is_empty(stack)) {
        printf("栈为空\n");
        return;
    }
    printf("栈内容（栈顶 → 栈底）: ");
    StackNode* current = stack->top;
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) {
            printf(" -> ");
        }
        current = current->next;
    }
    printf("\n");
}

/**
 * 销毁链栈
 */
void lstack_destroy(LinkedStack* stack) {
    StackNode* current = stack->top;
    while (current != NULL) {
        StackNode* temp = current;
        current = current->next;
        free(temp);
    }
    free(stack);
}

/**
 * 链栈测试主函数
 */
int main() {
    printf("=== 链栈测试 ===\n\n");
    
    // 创建链栈
    LinkedStack* stack = lstack_create();
    printf("创建链栈\n");
    printf("栈是否为空: %s\n", lstack_is_empty(stack) ? "是" : "否");
    printf("\n");
    
    // 测试入栈
    printf("=== 入栈操作 ===\n");
    for (int i = 10; i <= 60; i += 10) {
        lstack_push(stack, i);
        printf("push(%d): 栈大小=%d\n", i, lstack_size(stack));
    }
    lstack_print(stack);
    printf("\n");
    
    // 测试查看栈顶
    printf("=== 查看栈顶 ===\n");
    int top_value;
    if (lstack_peek(stack, &top_value)) {
        printf("栈顶元素: %d\n", top_value);
    }
    printf("\n");
    
    // 测试出栈
    printf("=== 出栈操作 ===\n");
    int popped;
    while (!lstack_is_empty(stack)) {
        lstack_pop(stack, &popped);
        printf("pop() = %d, 剩余大小=%d\n", popped, lstack_size(stack));
    }
    printf("\n");
    
    // 测试栈空
    printf("=== 栈空测试 ===\n");
    printf("栈是否为空: %s\n", lstack_is_empty(stack) ? "是" : "否");
    lstack_push(stack, 100);
    lstack_push(stack, 200);
    lstack_push(stack, 300);
    lstack_print(stack);
    printf("栈大小: %d\n", lstack_size(stack));
    
    lstack_destroy(stack);
    return 0;
}
```

## 括号匹配问题

### 括号匹配的基本原理

括号匹配（Bracket Matching）是栈的经典应用之一。问题描述：给定一个包含括号的字符串，判断其中的括号是否匹配。括号包括小括号()、中括号[]和大括号{}。

括号匹配的规则：
1. 每种左括号必须有对应的右括号
2. 括号必须正确嵌套，不能交叉
3. 不同类型的括号不能混用

栈是解决括号匹配问题的理想工具，因为括号的匹配遵循"后进先出"的原则——最后出现的左括号必须最先被匹配。算法步骤如下：

1. 遍历字符串中的每个字符
2. 如果遇到左括号（(、[、{），将其压入栈中
3. 如果遇到右括号（)、]、}），检查栈顶元素：
   - 如果栈为空，说明没有匹配的左括号，匹配失败
   - 如果栈顶的左括号与当前右括号匹配，则弹出栈顶
   - 如果不匹配，匹配失败
4. 遍历结束后，如果栈为空，说明所有括号都匹配成功；否则匹配失败

### 括号匹配的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

/**
 * 字符栈结构体
 */
typedef struct {
    char* data;
    int top;
    int capacity;
} CharStack;

/**
 * 创建字符栈
 */
CharStack* char_stack_create(int capacity) {
    CharStack* stack = (CharStack*)malloc(sizeof(CharStack));
    stack->data = (char*)malloc(capacity * sizeof(char));
    stack->top = -1;
    stack->capacity = capacity;
    return stack;
}

/**
 * 判断字符栈是否为空
 */
bool char_stack_is_empty(CharStack* stack) {
    return stack->top == -1;
}

/**
 * 字符入栈
 */
void char_stack_push(CharStack* stack, char ch) {
    if (stack->top < stack->capacity - 1) {
        stack->top++;
        stack->data[stack->top] = ch;
    }
}

/**
 * 字符出栈
 */
char char_stack_pop(CharStack* stack) {
    if (char_stack_is_empty(stack)) {
        return '\0';
    }
    char ch = stack->data[stack->top];
    stack->top--;
    return ch;
}

/**
 * 查看栈顶字符
 */
char char_stack_peek(CharStack* stack) {
    if (char_stack_is_empty(stack)) {
        return '\0';
    }
    return stack->data[stack->top];
}

/**
 * 销毁字符栈
 */
void char_stack_destroy(CharStack* stack) {
    free(stack->data);
    free(stack);
}

/**
 * 判断括号是否匹配
 * 
 * 算法原理：
 * 使用栈来跟踪左括号
 * 遇到右括号时，检查栈顶的左括号是否匹配
 * 
 * 时间复杂度：O(n) - 遍历字符串一次
 * 空间复杂度：O(n) - 最坏情况下所有字符都是左括号
 * 
 * @param expr 包含括号的字符串
 * @return     true表示括号匹配，false表示不匹配
 */
bool is_bracket_matched(const char* expr) {
    int len = strlen(expr);
    CharStack* stack = char_stack_create(len);
    
    for (int i = 0; i < len; i++) {
        char ch = expr[i];
        
        // 遇到左括号，压入栈中
        if (ch == '(' || ch == '[' || ch == '{') {
            char_stack_push(stack, ch);
        }
        // 遇到右括号，检查是否匹配
        else if (ch == ')' || ch == ']' || ch == '}') {
            // 如果栈为空，说明没有匹配的左括号
            if (char_stack_is_empty(stack)) {
                char_stack_destroy(stack);
                return false;
            }
            
            // 取出栈顶的左括号
            char top = char_stack_pop(stack);
            
            // 检查是否匹配
            if ((ch == ')' && top != '(') ||
                (ch == ']' && top != '[') ||
                (ch == '}' && top != '{')) {
                char_stack_destroy(stack);
                return false;
            }
        }
    }
    
    // 遍历结束后，栈应该为空
    bool result = char_stack_is_empty(stack);
    char_stack_destroy(stack);
    return result;
}

/**
 * 括号匹配并返回错误位置
 * 
 * 不仅判断是否匹配，还返回不匹配的具体位置
 * 
 * @param expr      包含括号的字符串
 * @param error_pos 用于接收错误位置
 * @return          true表示匹配，false表示不匹配
 */
bool is_bracket_matched_detailed(const char* expr, int* error_pos) {
    int len = strlen(expr);
    CharStack* stack = char_stack_create(len);
    int* positions = (int*)malloc(len * sizeof(int));  // 存储左括号的位置
    
    for (int i = 0; i < len; i++) {
        char ch = expr[i];
        
        if (ch == '(' || ch == '[' || ch == '{') {
            char_stack_push(stack, ch);
            positions[stack->top] = i;  // 记录左括号的位置
        }
        else if (ch == ')' || ch == ']' || ch == '}') {
            if (char_stack_is_empty(stack)) {
                *error_pos = i;
                char_stack_destroy(stack);
                free(positions);
                return false;
            }
            
            char top = char_stack_pop(stack);
            int left_pos = positions[stack->top + 1];
            
            if ((ch == ')' && top != '(') ||
                (ch == ']' && top != '[') ||
                (ch == '}' && top != '{')) {
                *error_pos = i;  // 不匹配的右括号位置
                char_stack_destroy(stack);
                free(positions);
                return false;
            }
        }
    }
    
    if (!char_stack_is_empty(stack)) {
        *error_pos = positions[0];  // 第一个未匹配的左括号
        char_stack_destroy(stack);
        free(positions);
        return false;
    }
    
    char_stack_destroy(stack);
    free(positions);
    return true;
}

/**
 * 括号匹配测试主函数
 */
int main() {
    printf("=== 括号匹配问题测试 ===\n\n");
    
    // 测试用例
    const char* test_cases[] = {
        "()",           // 简单匹配
        "()[]{}",       // 多种括号匹配
        "([{}])",       // 嵌套匹配
        "({[}])",       // 交叉不匹配
        "((())",        // 缺少右括号
        "())",          // 缺少左括号
        "({[]})",       // 正确嵌套
        "a*(b+c)-d",    // 包含其他字符
        "if (x > 0) { return a[i]; }",  // 代码中的括号
        "(([]{}))",     // 多层嵌套
    };
    
    int num_tests = sizeof(test_cases) / sizeof(test_cases[0]);
    
    for (int i = 0; i < num_tests; i++) {
        printf("测试 %d: \"%s\"\n", i + 1, test_cases[i]);
        
        int error_pos = -1;
        if (is_bracket_matched(test_cases[i])) {
            printf("  结果: 匹配成功！\n");
        } else {
            is_bracket_matched_detailed(test_cases[i], &error_pos);
            printf("  结果: 匹配失败！");
            if (error_pos >= 0) {
                printf(" 错误位置: %d (字符 '%c')", error_pos, test_cases[i][error_pos]);
            }
            printf("\n");
        }
        printf("\n");
    }
    
    // 演示括号匹配过程
    printf("=== 括号匹配过程演示 ===\n");
    printf("表达式: ([{}])\n");
    printf("步骤1: 遇到 '('  → 入栈 → 栈: (\n");
    printf("步骤2: 遇到 '['  → 入栈 → 栈: ([\n");
    printf("步骤3: 遇到 '{'  → 入栈 → 栈: ([{\n");
    printf("步骤4: 遇到 '}'  → 检查栈顶 '{' → 匹配, 出栈 → 栈: ([\n");
    printf("步骤5: 遇到 ']'  → 检查栈顶 '[' → 匹配, 出栈 → 栈: (\n");
    printf("步骤6: 遇到 ')'  → 检查栈顶 '(' → 匹配, 出栈 → 栈: 空\n");
    printf("结果: 栈为空，匹配成功！\n");
    
    return 0;
}
```

## 中缀表达式转后缀表达式

### 表达式转换的基本原理

表达式有三种表示形式：
- **中缀表达式**：运算符在两个操作数之间，如 `a + b`。这是人类最常用的表示法。
- **前缀表达式**（波兰记法）：运算符在两个操作数之前，如 `+ a b`。
- **后缀表达式**（逆波兰记法）：运算符在两个操作数之后，如 `a b +`。

后缀表达式的一个关键优势是：不需要括号来表示优先级，且求值只需一个栈，从左到右扫描即可。计算机更容易处理后缀表达式。

中缀表达式转后缀表达式的算法（使用栈）：

1. 初始化一个空栈用于存储运算符，一个空字符串用于输出
2. 从左到右扫描中缀表达式的每个字符
3. 如果是操作数（数字），直接输出
4. 如果是左括号 '('，压入栈中
5. 如果是右括号 ')'，不断弹出栈顶运算符并输出，直到遇到左括号为止（左括号只弹出不输出）
6. 如果是运算符：
   - 如果栈为空或栈顶是左括号，直接压入栈中
   - 否则，比较当前运算符与栈顶运算符的优先级：
     - 如果当前运算符优先级更高，压入栈中
     - 否则，弹出栈顶运算符并输出，重复此步骤
7. 扫描结束后，将栈中所有运算符弹出并输出

运算符优先级：乘除（*、/）> 加减（+、-），括号具有最高优先级。

### 中缀转后缀的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>

/**
 * 字符栈（用于存储运算符）
 */
typedef struct {
    char* data;
    int top;
    int capacity;
} CharStack;

CharStack* char_stack_create(int capacity) {
    CharStack* stack = (CharStack*)malloc(sizeof(CharStack));
    stack->data = (char*)malloc(capacity * sizeof(char));
    stack->top = -1;
    stack->capacity = capacity;
    return stack;
}

bool char_stack_is_empty(CharStack* stack) {
    return stack->top == -1;
}

void char_stack_push(CharStack* stack, char ch) {
    if (stack->top < stack->capacity - 1) {
        stack->top++;
        stack->data[stack->top] = ch;
    }
}

char char_stack_pop(CharStack* stack) {
    if (char_stack_is_empty(stack)) return '\0';
    return stack->data[stack->top--];
}

char char_stack_peek(CharStack* stack) {
    if (char_stack_is_empty(stack)) return '\0';
    return stack->data[stack->top];
}

void char_stack_destroy(CharStack* stack) {
    free(stack->data);
    free(stack);
}

/**
 * 获取运算符的优先级
 * 
 * 优先级定义：
 * 3: * / (乘除)
 * 2: + - (加减)
 * 1: (   (左括号，在栈中优先级最低)
 * 0: 其他
 * 
 * @param op 运算符字符
 * @return   优先级数值
 */
int get_precedence(char op) {
    switch (op) {
        case '*':
        case '/':
            return 3;  // 乘除优先级最高
        case '+':
        case '-':
            return 2;  // 加减优先级次之
        case '(':
            return 1;  // 左括号在栈中优先级最低
        default:
            return 0;
    }
}

/**
 * 判断字符是否为运算符
 */
bool is_operator(char ch) {
    return ch == '+' || ch == '-' || ch == '*' || ch == '/';
}

/**
 * 中缀表达式转后缀表达式
 * 
 * 算法原理：
 * 1. 操作数直接输出
 * 2. 左括号入栈
 * 3. 右括号弹出栈中运算符直到遇到左括号
 * 4. 运算符与栈顶比较优先级，决定入栈还是弹出
 * 
 * 时间复杂度：O(n) - 每个字符最多入栈和出栈一次
 * 空间复杂度：O(n) - 栈的大小
 * 
 * @param infix  中缀表达式字符串
 * @param postfix 用于存储后缀表达式结果的字符串
 */
void infix_to_postfix(const char* infix, char* postfix) {
    int len = strlen(infix);
    CharStack* stack = char_stack_create(len);
    int j = 0;  // postfix的索引
    
    for (int i = 0; i < len; i++) {
        char ch = infix[i];
        
        // 跳过空格
        if (ch == ' ') {
            continue;
        }
        
        // 如果是数字或字母，直接输出
        if (isdigit(ch) || isalpha(ch)) {
            postfix[j++] = ch;
        }
        // 如果是左括号，压入栈中
        else if (ch == '(') {
            char_stack_push(stack, ch);
        }
        // 如果是右括号，弹出栈中运算符直到遇到左括号
        else if (ch == ')') {
            while (!char_stack_is_empty(stack) && char_stack_peek(stack) != '(') {
                postfix[j++] = char_stack_pop(stack);
            }
            // 弹出左括号（不输出）
            if (!char_stack_is_empty(stack)) {
                char_stack_pop(stack);
            }
        }
        // 如果是运算符
        else if (is_operator(ch)) {
            // 栈顶运算符优先级 >= 当前运算符优先级时，弹出栈顶
            while (!char_stack_is_empty(stack) && 
                   get_precedence(char_stack_peek(stack)) >= get_precedence(ch)) {
                postfix[j++] = char_stack_pop(stack);
            }
            // 当前运算符入栈
            char_stack_push(stack, ch);
        }
    }
    
    // 将栈中剩余的运算符全部弹出
    while (!char_stack_is_empty(stack)) {
        postfix[j++] = char_stack_pop(stack);
    }
    
    postfix[j] = '\0';  // 添加字符串结束符
    char_stack_destroy(stack);
}

/**
 * 中缀转后缀测试主函数
 */
int main() {
    printf("=== 中缀表达式转后缀表达式测试 ===\n\n");
    
    // 测试用例
    typedef struct {
        const char* infix;
        const char* expected;
    } TestCase;
    
    TestCase tests[] = {
        {"a+b",     "ab+"},
        {"a+b*c",   "abc*+"},
        {"(a+b)*c", "ab+c*"},
        {"a+b*c+d", "abc*+d+"},
        {"(a+b)*(c+d)", "ab+cd+*"},
        {"a*b+c*d", "ab*cd*+"},
        {"a*(b+c)", "abc+*"},
        {"a+b-c",   "ab+c-"},
        {"a*b/c",   "ab*c/"},
        {"((a+b)*c)", "ab+c*"},
    };
    
    int num_tests = sizeof(tests) / sizeof(tests[0]);
    
    for (int i = 0; i < num_tests; i++) {
        char postfix[100];
        infix_to_postfix(tests[i].infix, postfix);
        printf("测试 %d: 中缀 \"%s\" → 后缀 \"%s\"", 
               i + 1, tests[i].infix, postfix);
        if (strcmp(postfix, tests[i].expected) == 0) {
            printf(" ✓\n");
        } else {
            printf(" ✗ (期望: \"%s\")\n", tests[i].expected);
        }
    }
    printf("\n");
    
    // 演示转换过程
    printf("=== 转换过程演示 ===\n");
    printf("中缀表达式: a+b*c\n");
    printf("步骤1: a → 输出: a\n");
    printf("步骤2: + → 入栈: 栈[+]\n");
    printf("步骤3: b → 输出: ab\n");
    printf("步骤4: * → *优先级(3) > +优先级(2), 入栈: 栈[+,*]\n");
    printf("步骤5: c → 输出: abc\n");
    printf("步骤6: 结束, 弹出栈中剩余: 弹出* → abc*, 弹出+ → abc*+\n");
    printf("结果: abc*+\n\n");
    
    printf("中缀表达式: (a+b)*c\n");
    printf("步骤1: ( → 入栈: 栈[(]\n");
    printf("步骤2: a → 输出: a\n");
    printf("步骤3: + → 入栈: 栈[(,+]\n");
    printf("步骤4: b → 输出: ab\n");
    printf("步骤5: ) → 弹出栈中直到(: 弹出+ → ab+, 弹出(不输出: 栈[]\n");
    printf("步骤6: * → 入栈: 栈[*]\n");
    printf("步骤7: c → 输出: ab+c\n");
    printf("步骤8: 结束, 弹出栈中剩余: 弹出* → ab+c*\n");
    printf("结果: ab+c*\n");
    
    return 0;
}
```

## 后缀表达式求值

### 后缀表达式求值的基本原理

后缀表达式求值是栈的另一个经典应用。后缀表达式求值只需要一个栈，从左到右扫描表达式：

1. 遇到操作数时，将其压入栈中
2. 遇到运算符时，从栈中弹出两个操作数，进行计算，然后将结果压入栈中
3. 扫描结束时，栈中只剩下一个元素，即表达式的值

后缀表达式求值的优势在于：不需要考虑运算符优先级，不需要括号，计算过程简单高效。许多编译器在生成中间代码时，会先将表达式转换为后缀形式。

### 后缀表达式求值的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

/**
 * 整数栈结构体
 */
typedef struct {
    int* data;
    int top;
    int capacity;
} IntStack;

IntStack* int_stack_create(int capacity) {
    IntStack* stack = (IntStack*)malloc(sizeof(IntStack));
    stack->data = (int*)malloc(capacity * sizeof(int));
    stack->top = -1;
    stack->capacity = capacity;
    return stack;
}

bool int_stack_is_empty(IntStack* stack) {
    return stack->top == -1;
}

void int_stack_push(IntStack* stack, int value) {
    if (stack->top < stack->capacity - 1) {
        stack->top++;
        stack->data[stack->top] = value;
    }
}

int int_stack_pop(IntStack* stack) {
    if (int_stack_is_empty(stack)) return 0;
    return stack->data[stack->top--];
}

void int_stack_destroy(IntStack* stack) {
    free(stack->data);
    free(stack);
}

/* ========== 中缀转后缀（复用前文逻辑） ========== */

typedef struct {
    char* data;
    int top;
    int capacity;
} CharStack;

CharStack* char_stack_create(int capacity) {
    CharStack* stack = (CharStack*)malloc(sizeof(CharStack));
    stack->data = (char*)malloc(capacity * sizeof(char));
    stack->top = -1;
    stack->capacity = capacity;
    return stack;
}

bool char_stack_is_empty(CharStack* stack) { return stack->top == -1; }
void char_stack_push(CharStack* stack, char ch) {
    if (stack->top < stack->capacity - 1) {
        stack->top++;
        stack->data[stack->top] = ch;
    }
}
char char_stack_pop(CharStack* stack) {
    if (char_stack_is_empty(stack)) return '\0';
    return stack->data[stack->top--];
}
char char_stack_peek(CharStack* stack) {
    if (char_stack_is_empty(stack)) return '\0';
    return stack->data[stack->top];
}
void char_stack_destroy(CharStack* stack) { free(stack->data); free(stack); }

int get_precedence(char op) {
    switch (op) {
        case '*': case '/': return 3;
        case '+': case '-': return 2;
        case '(': return 1;
        default: return 0;
    }
}

bool is_operator(char ch) {
    return ch == '+' || ch == '-' || ch == '*' || ch == '/';
}

void infix_to_postfix_num(const char* infix, char* postfix) {
    int len = strlen(infix);
    CharStack* stack = char_stack_create(len);
    int j = 0;
    
    for (int i = 0; i < len; i++) {
        char ch = infix[i];
        if (ch == ' ') continue;
        
        if (isdigit(ch)) {
            // 处理多位数
            while (i < len && isdigit(infix[i])) {
                postfix[j++] = infix[i++];
            }
            postfix[j++] = ' ';  // 用空格分隔数字
            i--;  // 回退一位，因为外层循环会i++
        }
        else if (ch == '(') {
            char_stack_push(stack, ch);
        }
        else if (ch == ')') {
            while (!char_stack_is_empty(stack) && char_stack_peek(stack) != '(') {
                postfix[j++] = char_stack_pop(stack);
                postfix[j++] = ' ';
            }
            if (!char_stack_is_empty(stack)) char_stack_pop(stack);
        }
        else if (is_operator(ch)) {
            while (!char_stack_is_empty(stack) && 
                   get_precedence(char_stack_peek(stack)) >= get_precedence(ch)) {
                postfix[j++] = char_stack_pop(stack);
                postfix[j++] = ' ';
            }
            char_stack_push(stack, ch);
        }
    }
    
    while (!char_stack_is_empty(stack)) {
        postfix[j++] = char_stack_pop(stack);
        postfix[j++] = ' ';
    }
    
    postfix[j] = '\0';
    char_stack_destroy(stack);
}

/**
 * 后缀表达式求值
 * 
 * 算法原理：
 * 1. 从左到右扫描后缀表达式
 * 2. 遇到操作数，压入栈中
 * 3. 遇到运算符，弹出两个操作数，计算，结果压入栈中
 * 4. 扫描结束后，栈顶元素即为表达式的值
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * 
 * 注意事项：
 * 1. 后缀表达式中的数字用空格分隔
 * 2. 减法和除法操作要注意操作数的顺序
 * 3. 注意除零错误
 * 
 * @param postfix 后缀表达式字符串
 * @return        表达式的计算结果
 */
int evaluate_postfix(const char* postfix) {
    int len = strlen(postfix);
    IntStack* stack = int_stack_create(len);
    int i = 0;
    
    while (i < len) {
        char ch = postfix[i];
        
        // 跳过空格
        if (ch == ' ') {
            i++;
            continue;
        }
        
        // 如果是数字，读取完整的数字并压入栈中
        if (isdigit(ch)) {
            int num = 0;
            while (i < len && isdigit(postfix[i])) {
                num = num * 10 + (postfix[i] - '0');
                i++;
            }
            int_stack_push(stack, num);
            continue;
        }
        
        // 如果是运算符，弹出两个操作数进行计算
        if (is_operator(ch)) {
            // 注意弹出顺序：先弹出的是右操作数，后弹出的是左操作数
            int right = int_stack_pop(stack);
            int left = int_stack_pop(stack);
            int result = 0;
            
            switch (ch) {
                case '+':
                    result = left + right;
                    break;
                case '-':
                    result = left - right;
                    break;
                case '*':
                    result = left * right;
                    break;
                case '/':
                    if (right == 0) {
                        printf("错误：除零！\n");
                        int_stack_destroy(stack);
                        return 0;
                    }
                    result = left / right;
                    break;
            }
            
            int_stack_push(stack, result);
        }
        
        i++;
    }
    
    int result = int_stack_pop(stack);
    int_stack_destroy(stack);
    return result;
}

/**
 * 计算中缀表达式的值
 * 先转换为后缀表达式，再求值
 */
int evaluate_infix(const char* infix) {
    char postfix[256];
    infix_to_postfix_num(infix, postfix);
    printf("后缀表达式: %s\n", postfix);
    return evaluate_postfix(postfix);
}

/**
 * 后缀表达式求值测试主函数
 */
int main() {
    printf("=== 后缀表达式求值测试 ===\n\n");
    
    // 测试用例
    typedef struct {
        const char* infix;
        int expected;
    } TestCase;
    
    TestCase tests[] = {
        {"3+5",       8},
        {"10-4",      6},
        {"2*3",       6},
        {"8/2",       4},
        {"3+5*2",    13},
        {"(3+5)*2",  16},
        {"10-6/2",    7},
        {"(10-6)/2",  2},
        {"2*3+4*5",  26},
        {"100/5+3*4", 32},
    };
    
    int num_tests = sizeof(tests) / sizeof(tests[0]);
    
    for (int i = 0; i < num_tests; i++) {
        printf("测试 %d: 中缀 \"%s\"\n", i + 1, tests[i].infix);
        int result = evaluate_infix(tests[i].infix);
        printf("  计算结果: %d", result);
        if (result == tests[i].expected) {
            printf(" ✓\n");
        } else {
            printf(" ✗ (期望: %d)\n", tests[i].expected);
        }
        printf("\n");
    }
    
    // 演示求值过程
    printf("=== 后缀表达式求值过程演示 ===\n");
    printf("后缀表达式: 3 5 2 * +\n");
    printf("步骤1: 遇到3 → 入栈 → 栈: [3]\n");
    printf("步骤2: 遇到5 → 入栈 → 栈: [3,5]\n");
    printf("步骤3: 遇到2 → 入栈 → 栈: [3,5,2]\n");
    printf("步骤4: 遇到* → 弹出2和5, 5*2=10 → 入栈 → 栈: [3,10]\n");
    printf("步骤5: 遇到+ → 弹出10和3, 3+10=13 → 入栈 → 栈: [13]\n");
    printf("结果: 13\n");
    
    return 0;
}
```

## 顺序队列（环形队列）

### 环形队列的基本原理

普通队列使用数组实现时，随着元素的入队和出队，front指针不断后移，导致数组前面的空间被浪费。环形队列（Circular Queue）通过将数组的首尾相连来解决这个问题。

环形队列使用两个指针front和rear：
- front指向队首元素
- rear指向队尾元素的下一个位置
- 入队时，rear后移；出队时，front后移
- 当rear或front到达数组末尾时，通过取模运算回到数组开头

环形队列的关键是判断队列空和满的状态。常见的方法是牺牲一个位置来区分：
- 队列空：front == rear
- 队列满：(rear + 1) % capacity == front

环形队列的图示：

```
初始状态（容量为5，可用4个位置）：
[ ][ ][ ][ ][ ]
 ↑
front, rear = 0

入队10: rear = 1
[10][ ][ ][ ][ ]
 ↑   ↑
 front rear

入队20, 30, 40:
[10][20][30][40][ ]
 ↑               ↑
front           rear

出队一次: front = 1
[ ][20][30][40][ ]
    ↑           ↑
   front       rear

入队50: rear = 0（环形回到开头）
[50][20][30][40][ ]
 ↑   ↑           ↑
rear front

入队60: 队列满，(rear+1)%5 == front
```

### 环形队列的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 环形队列结构体
 */
typedef struct {
    int* data;      // 存储队列元素的数组
    int front;      // 队首指针，指向第一个元素
    int rear;       // 队尾指针，指向最后一个元素的下一个位置
    int capacity;   // 队列的最大容量（实际可用容量为capacity-1）
    int size;       // 当前队列中的元素个数
} CircularQueue;

/**
 * 创建环形队列
 * 
 * 注意：为了区分队空和队满，我们牺牲一个位置
 * 所以实际可用容量为capacity-1
 * 
 * @param capacity 队列的最大容量
 * @return         返回初始化的队列指针
 */
CircularQueue* queue_create(int capacity) {
    CircularQueue* queue = (CircularQueue*)malloc(sizeof(CircularQueue));
    if (queue == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    
    queue->data = (int*)malloc(capacity * sizeof(int));
    if (queue->data == NULL) {
        printf("内存分配失败！\n");
        free(queue);
        exit(1);
    }
    
    queue->front = 0;
    queue->rear = 0;
    queue->capacity = capacity;
    queue->size = 0;
    return queue;
}

/**
 * 判断队列是否为空
 */
bool queue_is_empty(CircularQueue* queue) {
    return queue->size == 0;
}

/**
 * 判断队列是否已满
 */
bool queue_is_full(CircularQueue* queue) {
    return queue->size == queue->capacity - 1;
}

/**
 * 获取队列大小
 */
int queue_size(CircularQueue* queue) {
    return queue->size;
}

/**
 * 入队操作
 * 
 * 将元素添加到队尾
 * 
 * 时间复杂度：O(1)
 * 
 * @param queue 队列指针
 * @param value 要入队的值
 * @return      true表示成功，false表示队列已满
 */
bool queue_enqueue(CircularQueue* queue, int value) {
    // 检查队列是否已满
    if (queue_is_full(queue)) {
        printf("队列已满，无法入队！\n");
        return false;
    }
    
    // 将元素放入rear位置
    queue->data[queue->rear] = value;
    // rear后移一位（环形移动）
    queue->rear = (queue->rear + 1) % queue->capacity;
    // 更新大小
    queue->size++;
    return true;
}

/**
 * 出队操作
 * 
 * 移除并返回队首元素
 * 
 * 时间复杂度：O(1)
 * 
 * @param queue 队列指针
 * @param value 用于接收出队值的指针
 * @return      true表示成功，false表示队列为空
 */
bool queue_dequeue(CircularQueue* queue, int* value) {
    // 检查队列是否为空
    if (queue_is_empty(queue)) {
        printf("队列为空，无法出队！\n");
        return false;
    }
    
    // 获取队首元素
    *value = queue->data[queue->front];
    // front后移一位（环形移动）
    queue->front = (queue->front + 1) % queue->capacity;
    // 更新大小
    queue->size--;
    return true;
}

/**
 * 查看队首元素
 */
bool queue_peek(CircularQueue* queue, int* value) {
    if (queue_is_empty(queue)) {
        printf("队列为空！\n");
        return false;
    }
    *value = queue->data[queue->front];
    return true;
}

/**
 * 打印队列
 */
void queue_print(CircularQueue* queue) {
    if (queue_is_empty(queue)) {
        printf("队列为空\n");
        return;
    }
    printf("队列内容（队首 → 队尾）: ");
    int i = queue->front;
    for (int count = 0; count < queue->size; count++) {
        printf("%d ", queue->data[i]);
        i = (i + 1) % queue->capacity;
    }
    printf("\n");
}

/**
 * 销毁队列
 */
void queue_destroy(CircularQueue* queue) {
    free(queue->data);
    free(queue);
}

/**
 * 环形队列测试主函数
 */
int main() {
    printf("=== 环形队列测试 ===\n\n");
    
    // 创建容量为5的环形队列（实际可用4个位置）
    CircularQueue* queue = queue_create(5);
    printf("创建容量为5的环形队列（可用4个位置）\n");
    printf("队列是否为空: %s\n", queue_is_empty(queue) ? "是" : "否");
    printf("\n");
    
    // 测试入队
    printf("=== 入队操作 ===\n");
    int values[] = {10, 20, 30, 40};
    for (int i = 0; i < 4; i++) {
        printf("enqueue(%d): ", values[i]);
        if (queue_enqueue(queue, values[i])) {
            printf("成功, 队列大小=%d\n", queue_size(queue));
        }
    }
    queue_print(queue);
    printf("\n");
    
    // 测试队列满
    printf("=== 队列满测试 ===\n");
    printf("enqueue(50): ");
    queue_enqueue(queue, 50);  // 应该失败
    printf("队列是否已满: %s\n", queue_is_full(queue) ? "是" : "否");
    printf("\n");
    
    // 测试出队
    printf("=== 出队操作 ===\n");
    int dequeued;
    queue_dequeue(queue, &dequeued);
    printf("dequeue() = %d, 剩余大小=%d\n", dequeued, queue_size(queue));
    queue_dequeue(queue, &dequeued);
    printf("dequeue() = %d, 剩余大小=%d\n", dequeued, queue_size(queue));
    queue_print(queue);
    printf("\n");
    
    // 测试环形特性
    printf("=== 环形特性测试 ===\n");
    printf("enqueue(50): ");
    queue_enqueue(queue, 50);
    queue_print(queue);
    printf("enqueue(60): ");
    queue_enqueue(queue, 60);
    queue_print(queue);
    printf("（注意：50和60被放到了数组的前面位置）\n\n");
    
    // 出队所有元素
    printf("=== 出队所有元素 ===\n");
    while (!queue_is_empty(queue)) {
        queue_dequeue(queue, &dequeued);
        printf("dequeue() = %d\n", dequeued);
    }
    printf("队列是否为空: %s\n", queue_is_empty(queue) ? "是" : "否");
    
    queue_destroy(queue);
    return 0;
}
```

## 链队列

### 链队列的完整实现

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 链队列节点结构体
 */
typedef struct QNode {
    int data;
    struct QNode* next;
} QNode;

/**
 * 链队列结构体
 * 使用front指针指向队首，rear指针指向队尾
 */
typedef struct {
    QNode* front;  // 队首指针
    QNode* rear;   // 队尾指针
    int size;      // 队列大小
} LinkedQueue;

/**
 * 创建链队列
 */
LinkedQueue* lqueue_create() {
    LinkedQueue* queue = (LinkedQueue*)malloc(sizeof(LinkedQueue));
    if (queue == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    queue->front = NULL;
    queue->rear = NULL;
    queue->size = 0;
    return queue;
}

/**
 * 判断队列是否为空
 */
bool lqueue_is_empty(LinkedQueue* queue) {
    return queue->front == NULL;
}

/**
 * 获取队列大小
 */
int lqueue_size(LinkedQueue* queue) {
    return queue->size;
}

/**
 * 创建新节点
 */
QNode* create_qnode(int value) {
    QNode* node = (QNode*)malloc(sizeof(QNode));
    if (node == NULL) {
        printf("内存分配失败！\n");
        exit(1);
    }
    node->data = value;
    node->next = NULL;
    return node;
}

/**
 * 入队操作
 * 
 * 在队尾添加新节点
 * 
 * 时间复杂度：O(1)
 */
void lqueue_enqueue(LinkedQueue* queue, int value) {
    QNode* new_node = create_qnode(value);
    
    // 如果队列为空，新节点既是队首也是队尾
    if (lqueue_is_empty(queue)) {
        queue->front = new_node;
        queue->rear = new_node;
    } else {
        // 将新节点添加到队尾
        queue->rear->next = new_node;
        queue->rear = new_node;
    }
    
    queue->size++;
}

/**
 * 出队操作
 * 
 * 移除队首节点
 * 
 * 时间复杂度：O(1)
 */
bool lqueue_dequeue(LinkedQueue* queue, int* value) {
    if (lqueue_is_empty(queue)) {
        printf("队列为空，无法出队！\n");
        return false;
    }
    
    QNode* temp = queue->front;
    *value = temp->data;
    
    // 更新队首指针
    queue->front = temp->next;
    
    // 如果出队后队列为空，队尾指针也要置空
    if (queue->front == NULL) {
        queue->rear = NULL;
    }
    
    free(temp);
    queue->size--;
    return true;
}

/**
 * 查看队首元素
 */
bool lqueue_peek(LinkedQueue* queue, int* value) {
    if (lqueue_is_empty(queue)) {
        printf("队列为空！\n");
        return false;
    }
    *value = queue->front->data;
    return true;
}

/**
 * 打印队列
 */
void lqueue_print(LinkedQueue* queue) {
    if (lqueue_is_empty(queue)) {
        printf("队列为空\n");
        return;
    }
    printf("队列内容（队首 → 队尾）: ");
    QNode* current = queue->front;
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) {
            printf(" -> ");
        }
        current = current->next;
    }
    printf("\n");
}

/**
 * 销毁队列
 */
void lqueue_destroy(LinkedQueue* queue) {
    QNode* current = queue->front;
    while (current != NULL) {
        QNode* temp = current;
        current = current->next;
        free(temp);
    }
    free(queue);
}

/**
 * 链队列测试主函数
 */
int main() {
    printf("=== 链队列测试 ===\n\n");
    
    LinkedQueue* queue = lqueue_create();
    printf("创建链队列\n");
    printf("队列是否为空: %s\n", lqueue_is_empty(queue) ? "是" : "否");
    printf("\n");
    
    // 测试入队
    printf("=== 入队操作 ===\n");
    for (int i = 10; i <= 50; i += 10) {
        lqueue_enqueue(queue, i);
        printf("enqueue(%d): 队列大小=%d\n", i, lqueue_size(queue));
    }
    lqueue_print(queue);
    printf("\n");
    
    // 测试出队
    printf("=== 出队操作 ===\n");
    int value;
    for (int i = 0; i < 3; i++) {
        lqueue_dequeue(queue, &value);
        printf("dequeue() = %d, 剩余大小=%d\n", value, lqueue_size(queue));
    }
    lqueue_print(queue);
    printf("\n");
    
    // 测试交替入队出队
    printf("=== 交替入队出队 ===\n");
    lqueue_enqueue(queue, 60);
    printf("enqueue(60): ");
    lqueue_print(queue);
    lqueue_dequeue(queue, &value);
    printf("dequeue() = %d: ", value);
    lqueue_print(queue);
    lqueue_enqueue(queue, 70);
    printf("enqueue(70): ");
    lqueue_print(queue);
    printf("\n");
    
    // 查看队首
    printf("=== 查看队首 ===\n");
    if (lqueue_peek(queue, &value)) {
        printf("队首元素: %d\n", value);
    }
    
    lqueue_destroy(queue);
    return 0;
}
```

## 用两个栈实现队列

### 双栈实现队列的基本原理

这是一个经典的面试题：用两个栈实现一个队列。栈是后进先出（LIFO），队列是先进先出（FIFO），如何用两个LIFO来实现FIFO呢？

核心思想：使用两个栈——stack_in和stack_out。
- stack_in：用于入队操作，所有新元素都压入stack_in
- stack_out：用于出队操作，当需要出队时，如果stack_out为空，将stack_in中的所有元素弹出并压入stack_out，这样最早进入stack_in的元素就会出现在stack_out的栈顶

这个设计的关键在于：将stack_in中的元素倒入stack_out时，元素的顺序会被反转，从而实现FIFO的效果。

```
入队操作（enqueue）：直接压入stack_in
出队操作（dequeue）：
  如果stack_out不为空，直接从stack_out弹出
  如果stack_out为空：
    将stack_in中的所有元素弹出并压入stack_out
    然后从stack_out弹出

图示：
入队1, 2, 3:
stack_in: [1, 2, 3] (栈顶在右)
stack_out: []

出队操作：
stack_out为空，将stack_in倒入stack_out:
stack_in: []
stack_out: [3, 2, 1] (栈顶在右)

从stack_out弹出: 得到1 (FIFO!)
stack_out: [3, 2]
```

### 双栈实现队列的完整代码

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/**
 * 栈结构体
 */
typedef struct {
    int* data;
    int top;
    int capacity;
} Stack;

Stack* stack_create(int capacity) {
    Stack* stack = (Stack*)malloc(sizeof(Stack));
    stack->data = (int*)malloc(capacity * sizeof(int));
    stack->top = -1;
    stack->capacity = capacity;
    return stack;
}

bool stack_is_empty(Stack* stack) { return stack->top == -1; }
bool stack_is_full(Stack* stack) { return stack->top == stack->capacity - 1; }

void stack_push(Stack* stack, int value) {
    if (!stack_is_full(stack)) {
        stack->top++;
        stack->data[stack->top] = value;
    }
}

int stack_pop(Stack* stack) {
    if (stack_is_empty(stack)) return -1;
    return stack->data[stack->top--];
}

int stack_peek(Stack* stack) {
    if (stack_is_empty(stack)) return -1;
    return stack->data[stack->top];
}

int stack_size(Stack* stack) { return stack->top + 1; }
void stack_destroy(Stack* stack) { free(stack->data); free(stack); }

/**
 * 用两个栈实现的队列
 */
typedef struct {
    Stack* stack_in;   // 用于入队的栈
    Stack* stack_out;  // 用于出队的栈
    int capacity;
} TwoStackQueue;

/**
 * 创建双栈队列
 */
TwoStackQueue* tsqueue_create(int capacity) {
    TwoStackQueue* queue = (TwoStackQueue*)malloc(sizeof(TwoStackQueue));
    queue->stack_in = stack_create(capacity);
    queue->stack_out = stack_create(capacity);
    queue->capacity = capacity;
    return queue;
}

/**
 * 判断队列是否为空
 */
bool tsqueue_is_empty(TwoStackQueue* queue) {
    return stack_is_empty(queue->stack_in) && stack_is_empty(queue->stack_out);
}

/**
 * 获取队列大小
 */
int tsqueue_size(TwoStackQueue* queue) {
    return stack_size(queue->stack_in) + stack_size(queue->stack_out);
}

/**
 * 入队操作
 * 
 * 直接将元素压入stack_in
 * 
 * 时间复杂度：O(1)
 */
bool tsqueue_enqueue(TwoStackQueue* queue, int value) {
    if (tsqueue_size(queue) >= queue->capacity) {
        printf("队列已满！\n");
        return false;
    }
    stack_push(queue->stack_in, value);
    return true;
}

/**
 * 将stack_in中的所有元素转移到stack_out
 * 
 * 这个操作是O(n)的，但每个元素在整个生命周期中
 * 最多被转移一次，所以均摊时间复杂度是O(1)
 */
void transfer_if_needed(TwoStackQueue* queue) {
    // 只有当stack_out为空时才需要转移
    if (stack_is_empty(queue->stack_out)) {
        while (!stack_is_empty(queue->stack_in)) {
            int value = stack_pop(queue->stack_in);
            stack_push(queue->stack_out, value);
        }
    }
}

/**
 * 出队操作
 * 
 * 如果stack_out为空，先将stack_in中的元素转移到stack_out
 * 然后从stack_out弹出栈顶元素
 * 
 * 均摊时间复杂度：O(1)
 * 最坏时间复杂度：O(n)（当stack_out为空时）
 * 
 * @param queue 队列指针
 * @param value 用于接收出队值的指针
 * @return      true表示成功，false表示队列为空
 */
bool tsqueue_dequeue(TwoStackQueue* queue, int* value) {
    if (tsqueue_is_empty(queue)) {
        printf("队列为空，无法出队！\n");
        return false;
    }
    
    // 如果stack_out为空，转移stack_in的元素
    transfer_if_needed(queue);
    
    *value = stack_pop(queue->stack_out);
    return true;
}

/**
 * 查看队首元素
 */
bool tsqueue_peek(TwoStackQueue* queue, int* value) {
    if (tsqueue_is_empty(queue)) {
        printf("队列为空！\n");
        return false;
    }
    transfer_if_needed(queue);
    *value = stack_peek(queue->stack_out);
    return true;
}

/**
 * 打印队列状态
 */
void tsqueue_print(TwoStackQueue* queue) {
    printf("stack_in (栈顶→栈底): [");
    for (int i = queue->stack_in->top; i >= 0; i--) {
        printf("%d", queue->stack_in->data[i]);
        if (i > 0) printf(", ");
    }
    printf("]\n");
    
    printf("stack_out (栈顶→栈底): [");
    for (int i = queue->stack_out->top; i >= 0; i--) {
        printf("%d", queue->stack_out->data[i]);
        if (i > 0) printf(", ");
    }
    printf("]\n");
}

/**
 * 销毁双栈队列
 */
void tsqueue_destroy(TwoStackQueue* queue) {
    stack_destroy(queue->stack_in);
    stack_destroy(queue->stack_out);
    free(queue);
}

/**
 * 双栈队列测试主函数
 */
int main() {
    printf("=== 用两个栈实现队列测试 ===\n\n");
    
    TwoStackQueue* queue = tsqueue_create(10);
    printf("创建双栈队列（容量10）\n\n");
    
    // 测试入队
    printf("=== 入队操作 ===\n");
    for (int i = 1; i <= 5; i++) {
        tsqueue_enqueue(queue, i * 10);
        printf("enqueue(%d): ", i * 10);
        tsqueue_print(queue);
    }
    printf("\n");
    
    // 测试出队
    printf("=== 出队操作 ===\n");
    int value;
    for (int i = 0; i < 3; i++) {
        tsqueue_dequeue(queue, &value);
        printf("dequeue() = %d: ", value);
        tsqueue_print(queue);
    }
    printf("（注意：前几次出队时，stack_in被转移到了stack_out）\n\n");
    
    // 测试交替入队出队
    printf("=== 交替入队出队 ===\n");
    tsqueue_enqueue(queue, 60);
    printf("enqueue(60): ");
    tsqueue_print(queue);
    
    tsqueue_enqueue(queue, 70);
    printf("enqueue(70): ");
    tsqueue_print(queue);
    
    tsqueue_dequeue(queue, &value);
    printf("dequeue() = %d: ", value);
    tsqueue_print(queue);
    printf("\n");
    
    // 查看队首
    printf("=== 查看队首 ===\n");
    if (tsqueue_peek(queue, &value)) {
        printf("队首元素: %d\n", value);
    }
    printf("\n");
    
    // 出队所有剩余元素
    printf("=== 出队所有剩余元素 ===\n");
    while (!tsqueue_is_empty(queue)) {
        tsqueue_dequeue(queue, &value);
        printf("dequeue() = %d: ", value);
        tsqueue_print(queue);
    }
    printf("队列是否为空: %s\n", tsqueue_is_empty(queue) ? "是" : "否");
    
    tsqueue_destroy(queue);
    return 0;
}
```

## 总结与对比

### 栈的实现方式对比

| 特性 | 顺序栈（数组） | 链栈（链表） |
|------|----------------|--------------|
| 存储方式 | 连续内存 | 非连续内存 |
| 容量限制 | 固定容量 | 动态增长 |
| 内存利用 | 可能浪费 | 额外指针开销 |
| 入栈/出栈 | O(1) | O(1) |
| 缓存友好 | 是 | 否 |
| 适用场景 | 已知最大容量 | 容量不确定 |

### 队列的实现方式对比

| 特性 | 环形队列（数组） | 链队列（链表） | 双栈队列 |
|------|------------------|----------------|----------|
| 存储方式 | 连续内存 | 非连续内存 | 连续内存 |
| 容量限制 | 固定容量 | 动态增长 | 固定容量 |
| 入队 | O(1) | O(1) | O(1) |
| 出队 | O(1) | O(1) | 均摊O(1) |
| 适用场景 | 已知最大容量 | 容量不确定 | 面试/理解原理 |

### 栈和队列的典型应用

| 应用场景 | 使用的数据结构 | 说明 |
|----------|----------------|------|
| 函数调用 | 栈 | 函数调用栈保存返回地址和局部变量 |
| 括号匹配 | 栈 | 后进先出匹配括号 |
| 表达式求值 | 栈 | 中缀转后缀，后缀求值 |
| 撤销操作 | 栈 | 撤销（Undo）操作 |
| 深度优先搜索 | 栈 | 递归或显式栈实现 |
| 任务调度 | 队列 | FIFO的公平调度 |
| 缓冲区 | 队列 | 生产者-消费者模式 |
| 广度优先搜索 | 队列 | 逐层遍历 |
| 消息队列 | 队列 | 异步消息传递 |

### 核心要点总结

1. **栈的核心是LIFO**：后进先出的特性使得栈在括号匹配、表达式求值等场景中不可替代。

2. **队列的核心是FIFO**：先进先出的特性使得队列在任务调度、缓冲区管理等场景中广泛应用。

3. **环形队列的巧妙设计**：通过模运算实现数组的循环使用，解决了数组队列的空间浪费问题。

4. **双栈实现队列**：体现了数据结构组合的灵活性，是理解栈和队列关系的好例子。

5. **表达式求值**：中缀转后缀再求值的流程是编译器设计的基础，理解它有助于理解计算机如何处理表达式。

6. **选择合适的数据结构**：顺序实现适合已知容量且需要快速访问的场景，链式实现适合容量不确定且频繁插入删除的场景。
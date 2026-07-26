---
title: C语言流程控制Ⅱ
date: 2026-07-26
tags:
  - C语言
  - switch
  - 分支
  - 跳转表
categories:
  - C语言
---

# C语言流程控制Ⅱ——switch-case与多路分支

## 一、引言

switch-case是C语言中处理多路分支的核心语句。当需要根据一个变量的不同取值执行不同代码时，switch比多层if-else更清晰、更高效。编译器通常会将switch编译为跳转表（jump table），实现O(1)的分支选择。本章将深入剖析switch的语法、语义、底层实现，以及常见的陷阱和最佳实践。

---

## 二、switch 基本语法

### 2.1 标准用法

```c
#include <stdio.h>

int main() {
    printf("========== switch 基本语法 ==========\n\n");

    int choice = 2;

    switch (choice) {
        case 1:
            printf("你选择了选项1\n");
            break;
        case 2:
            printf("你选择了选项2\n");
            break;
        case 3:
            printf("你选择了选项3\n");
            break;
        default:
            printf("无效选择\n");
            break;
    }

    printf("switch语句结束\n");
    return 0;
}
```

### 2.2 switch 的限制与特性

```c
#include <stdio.h>

int main() {
    printf("========== switch 限制与特性 ==========\n\n");

    printf("【switch 表达式类型】\n");
    printf("switch(表达式) 中表达式必须是整数类型:\n");
    printf("  - char, short, int, long, long long\n");
    printf("  - enum 类型\n");
    printf("  - 不能是浮点数、字符串、指针\n\n");

    // case 标签必须是常量表达式
    int x = 5;
    const int C = 5;

    switch (x) {
        case 1:   printf("x = 1\n"); break;
        case 2+3: printf("x = 5 (2+3是常量表达式)\n"); break;
        case C:   printf("x = C (const常量)\n"); break;
        // case x: 编译错误！x不是常量
        default:  printf("其他值\n"); break;
    }

    // enum 在 switch 中的使用
    printf("\n【enum 与 switch】\n");
    enum Color { RED, GREEN, BLUE, YELLOW };
    enum Color myColor = BLUE;

    switch (myColor) {
        case RED:    printf("红色\n"); break;
        case GREEN:  printf("绿色\n"); break;
        case BLUE:   printf("蓝色\n"); break;
        case YELLOW: printf("黄色\n"); break;
        default:     printf("未知颜色\n"); break;
    }

    return 0;
}
```

### 2.3 字符型 switch

```c
#include <stdio.h>
#include <ctype.h>

int main() {
    printf("========== 字符型 switch ==========\n\n");

    char ch;
    printf("请输入一个字符: ");
    scanf("%c", &ch);

    // 字符本质上就是整数(ASCII码)
    switch (ch) {
        case 'a': case 'A':
            printf("你输入了字母 A\n");
            break;
        case 'b': case 'B':
            printf("你输入了字母 B\n");
            break;
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
            printf("你输入了数字 %c\n", ch);
            break;
        case ' ': case '\t': case '\n':
            printf("你输入了空白字符\n");
            break;
        default:
            printf("你输入了其他字符: '%c' (ASCII: %d)\n", ch, ch);
            break;
    }

    return 0;
}
```

---

## 三、break 与 fall-through（穿透）

### 3.1 fall-through 行为

```c
#include <stdio.h>

int main() {
    printf("========== fall-through 行为 ==========\n\n");

    int value = 2;

    printf("【无break的fall-through】\n");
    switch (value) {
        case 1:
            printf("执行 case 1\n");
        case 2:
            printf("执行 case 2\n");
        case 3:
            printf("执行 case 3\n");
        default:
            printf("执行 default\n");
    }
    printf("(注意：从case 2开始，一直执行到结束)\n\n");

    // 有意使用fall-through的场景
    printf("【有意使用fall-through】\n");
    int month = 3;
    int days;

    switch (month) {
        case 1: case 3: case 5: case 7:
        case 8: case 10: case 12:
            days = 31;
            break;
        case 4: case 6: case 9: case 11:
            days = 30;
            break;
        case 2:
            days = 28;  // 简化处理，不考虑闰年
            break;
        default:
            days = -1;
            break;
    }

    printf("%d月有%d天\n", month, days);

    return 0;
}
```

### 3.2 范围型 switch 技巧

```c
#include <stdio.h>

int main() {
    printf("========== 范围型 switch 技巧 ==========\n\n");

    int score;
    printf("请输入分数(0-100): ");
    scanf("%d", &score);

    // 使用除法将连续范围映射到离散值
    switch (score / 10) {
        case 10:  // 100分
        case 9:   // 90-99
            printf("等级: A (优秀)\n");
            break;
        case 8:   // 80-89
            printf("等级: B (良好)\n");
            break;
        case 7:   // 70-79
            printf("等级: C (中等)\n");
            break;
        case 6:   // 60-69
            printf("等级: D (及格)\n");
            break;
        case 5: case 4: case 3: case 2: case 1: case 0:
            printf("等级: F (不及格)\n");
            break;
        default:
            printf("无效分数\n");
            break;
    }

    // 使用多个case标签映射范围
    printf("\n【年龄段判断】\n");
    int age;
    printf("请输入年龄: ");
    scanf("%d", &age);

    switch (age) {
        case 0: case 1: case 2:
            printf("婴儿\n");
            break;
        case 3: case 4: case 5:
            printf("幼儿\n");
            break;
        case 6: case 7: case 8: case 9: case 10: case 11: case 12:
            printf("儿童\n");
            break;
        case 13: case 14: case 15: case 16: case 17:
            printf("青少年\n");
            break;
        default:
            printf("成人\n");
            break;
    }

    return 0;
}
```

---

## 四、switch 底层实现

### 4.1 跳转表原理

```c
#include <stdio.h>

// 模拟 switch 的跳转表实现
void jump_table_demo(int choice) {
    // 函数指针数组模拟跳转表
    static void (*table[])(void) = {
        [0] = NULL,  // 不使用0
        /* 1 */ NULL,  // 后面填充
        /* 2 */ NULL,
        /* 3 */ NULL,
    };

    printf("【跳转表模拟】\n");
    printf("如果编译器生成跳转表，switch(choice)会直接跳转到\n");
    printf("table[choice]处执行，时间复杂度O(1)\n");
    printf("这比多层if-else的O(n)高效得多\n");

    // 但跳转表只适用于case值密集的情况
    printf("\n对于稀疏的case值(如case 1: case 1000: case 100000:)\n");
    printf("编译器会生成二分查找或决策树，而非跳转表\n");
}

int main() {
    printf("========== switch 底层实现 ==========\n\n");

    // 密集case：编译器通常生成跳转表
    printf("【密集case示例】\n");
    int x = 3;
    switch (x) {
        case 1: printf("一\n"); break;
        case 2: printf("二\n"); break;
        case 3: printf("三\n"); break;
        case 4: printf("四\n"); break;
        case 5: printf("五\n"); break;
        default: printf("其他\n"); break;
    }

    printf("\n预期汇编: jmp [table + rax*8]\n\n");

    jump_table_demo(3);

    // 查看实际生成的汇编
    printf("【查看汇编】\n");
    printf("使用 gcc -S source.c 生成汇编文件\n");
    printf("在汇编中查找 'jmp' 指令来验证跳转表\n");

    return 0;
}
```

### 4.2 switch vs if-else 性能对比

```c
#include <stdio.h>
#include <time.h>

// 使用 switch 的分支
int switch_version(int x) {
    switch (x) {
        case 1: return 1;
        case 2: return 2;
        case 3: return 3;
        case 4: return 4;
        case 5: return 5;
        case 6: return 6;
        case 7: return 7;
        case 8: return 8;
        case 9: return 9;
        case 10: return 10;
        default: return 20;
    }
}

// 使用 if-else 的分支
int ifelse_version(int x) {
    if (x == 1) return 1;
    else if (x == 2) return 2;
    else if (x == 3) return 3;
    else if (x == 4) return 4;
    else if (x == 5) return 5;
    else if (x == 6) return 6;
    else if (x == 7) return 7;
    else if (x == 8) return 8;
    else if (x == 9) return 9;
    else if (x == 10) return 10;
    else return 20;
}

int main() {
    printf("========== switch vs if-else 性能对比 ==========\n\n");

    const int ITERATIONS = 100000000;
    clock_t start, end;
    volatile int result;

    // 测试 switch
    start = clock();
    for (int i = 0; i < ITERATIONS; i++) {
        result = switch_version((i % 10) + 1);
    }
    end = clock();
    double switch_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("switch 耗时: %.3f 秒\n", switch_time);

    // 测试 if-else
    start = clock();
    for (int i = 0; i < ITERATIONS; i++) {
        result = ifelse_version((i % 10) + 1);
    }
    end = clock();
    double ifelse_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("if-else 耗时: %.3f 秒\n", ifelse_time);

    printf("\n速度比: switch 比 if-else %.1f%%\n",
           (1 - switch_time / ifelse_time) * 100);

    return 0;
}
```

---

## 五、switch 经典应用

### 5.1 命令行菜单系统

```c
#include <stdio.h>
#include <stdlib.h>

void add_record() { printf("  → 执行添加记录\n"); }
void delete_record() { printf("  → 执行删除记录\n"); }
void modify_record() { printf("  → 执行修改记录\n"); }
void search_record() { printf("  → 执行查询记录\n"); }
void display_all() { printf("  → 执行显示全部\n"); }

int main() {
    printf("========== 命令行菜单系统 ==========\n\n");

    int choice;
    int running = 1;

    while (running) {
        printf("\n╔════════════════════════╗\n");
        printf("║   学生管理系统主菜单  ║\n");
        printf("╠════════════════════════╣\n");
        printf("║  1. 添加学生          ║\n");
        printf("║  2. 删除学生          ║\n");
        printf("║  3. 修改学生          ║\n");
        printf("║  4. 查询学生          ║\n");
        printf("║  5. 显示全部          ║\n");
        printf("║  6. 保存到文件        ║\n");
        printf("║  7. 从文件读取        ║\n");
        printf("║  0. 退出系统          ║\n");
        printf("╚════════════════════════╝\n");
        printf("请输入选项(0-7): ");

        scanf("%d", &choice);
        while (getchar() != '\n');

        switch (choice) {
            case 1: add_record(); break;
            case 2: delete_record(); break;
            case 3: modify_record(); break;
            case 4: search_record(); break;
            case 5: display_all(); break;
            case 6: printf("  → 执行保存\n"); break;
            case 7: printf("  → 执行读取\n"); break;
            case 0:
                printf("确认退出? (y/n): ");
                char confirm;
                scanf("%c", &confirm);
                if (confirm == 'y' || confirm == 'Y') {
                    running = 0;
                    printf("系统已退出\n");
                }
                break;
            default:
                printf("无效选项，请重新输入\n");
                break;
        }
    }

    return 0;
}
```

### 5.2 简易计算器（switch版）

```c
#include <stdio.h>
#include <math.h>

int main() {
    printf("========== 简易计算器 ==========\n\n");
    printf("支持运算: +  -  *  /  %%  ^  s(开方)\n");
    printf("输入格式: 操作数 运算符 操作数 (如 2+3)\n\n");

    double a, b, result;
    char op;

    while (1) {
        printf(">> ");
        if (scanf("%lf", &a) != 1) {
            char ch;
            scanf("%c", &ch);
            if (ch == 'q' || ch == 'Q') {
                printf("再见！\n");
                break;
            }
            printf("输入格式错误\n");
            while (getchar() != '\n');
            continue;
        }

        scanf(" %c", &op);

        if (op == 's' || op == 'S') {
            printf("sqrt(%.2f) = %.2f\n", a, sqrt(a));
            continue;
        }

        if (scanf("%lf", &b) != 1) {
            printf("操作数错误\n");
            while (getchar() != '\n');
            continue;
        }

        switch (op) {
            case '+':
                result = a + b;
                printf("%.2f + %.2f = %.2f\n", a, b, result);
                break;
            case '-':
                result = a - b;
                printf("%.2f - %.2f = %.2f\n", a, b, result);
                break;
            case '*':
                result = a * b;
                printf("%.2f * %.2f = %.2f\n", a, b, result);
                break;
            case '/':
                if (b == 0) {
                    printf("错误: 除数不能为零\n");
                } else {
                    result = a / b;
                    printf("%.2f / %.2f = %.2f\n", a, b, result);
                }
                break;
            case '%':
                printf("%.0f %% %.0f = %.0f\n", a, b, fmod(a, b));
                break;
            case '^':
                result = pow(a, b);
                printf("%.2f ^ %.2f = %.2f\n", a, b, result);
                break;
            default:
                printf("不支持的运算符: %c\n", op);
                break;
        }
    }

    return 0;
}
```

### 5.3 状态机实现

```c
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

// 状态定义
typedef enum {
    STATE_IDLE,
    STATE_RUNNING,
    STATE_PAUSED,
    STATE_STOPPED,
    STATE_ERROR
} State;

// 事件定义
typedef enum {
    EVENT_START,
    EVENT_PAUSE,
    EVENT_RESUME,
    EVENT_STOP,
    EVENT_ERROR
} Event;

// 状态转换函数
State state_machine(State current, Event event) {
    switch (current) {
        case STATE_IDLE:
            switch (event) {
                case EVENT_START: return STATE_RUNNING;
                default: return STATE_ERROR;
            }
        case STATE_RUNNING:
            switch (event) {
                case EVENT_PAUSE: return STATE_PAUSED;
                case EVENT_STOP:  return STATE_STOPPED;
                case EVENT_ERROR: return STATE_ERROR;
                default: return STATE_ERROR;
            }
        case STATE_PAUSED:
            switch (event) {
                case EVENT_RESUME: return STATE_RUNNING;
                case EVENT_STOP:   return STATE_STOPPED;
                default: return STATE_ERROR;
            }
        case STATE_STOPPED:
            switch (event) {
                case EVENT_START: return STATE_RUNNING;
                default: return STATE_ERROR;
            }
        default:
            return STATE_ERROR;
    }
}

const char* state_name(State s) {
    switch (s) {
        case STATE_IDLE:    return "空闲";
        case STATE_RUNNING: return "运行中";
        case STATE_PAUSED:  return "已暂停";
        case STATE_STOPPED: return "已停止";
        case STATE_ERROR:   return "错误";
        default: return "未知";
    }
}

int main() {
    printf("========== 状态机实现 ==========\n\n");

    State current = STATE_IDLE;
    printf("初始状态: %s\n\n", state_name(current));

    // 模拟状态转换
    Event events[] = {
        EVENT_START, EVENT_PAUSE, EVENT_RESUME,
        EVENT_STOP, EVENT_START, EVENT_STOP
    };
    const char* event_names[] = {
        "启动", "暂停", "恢复", "停止", "启动", "停止"
    };

    for (int i = 0; i < 6; i++) {
        printf("事件: %s → ", event_names[i]);
        State next = state_machine(current, events[i]);
        printf("状态: %s → %s\n",
               state_name(current), state_name(next));
        current = next;
    }

    return 0;
}
```

---

## 六、switch 常见陷阱

### 6.1 变量声明问题

```c
#include <stdio.h>

int main() {
    printf("========== switch 常见陷阱 ==========\n\n");

    int choice = 2;

    printf("【陷阱1：case中声明变量】\n");
    switch (choice) {
        case 1: {
            // 使用大括号创建独立作用域
            int x = 10;
            printf("case 1: x = %d\n", x);
            break;
        }
        case 2: {
            int y = 20;  // 每个case有自己的作用域
            printf("case 2: y = %d\n", y);
            break;
        }
        default:
            break;
    }

    printf("\n【陷阱2：忘记break】\n");
    int day = 3;
    printf("今天是星期%d\n", day);
    switch (day) {
        case 1: printf("星期一\n");
        case 2: printf("星期二\n");
        case 3: printf("星期三\n");
        case 4: printf("星期四\n");
        case 5: printf("星期五\n");
        default: printf("周末\n");
    }
    printf("(注意：从星期三开始一直输出到周末)\n");

    printf("\n【陷阱3：default位置】\n");
    printf("default可以放在任何位置，但建议放在最后\n");
    printf("如果default不在最后，不要忘记break\n");

    printf("\n【陷阱4：空switch】\n");
    switch (choice) {
        // 没有case，但语法合法
    }
    printf("空switch语句合法，但什么都不做\n");

    return 0;
}
```

---

## 本章小结

本章深入剖析了switch-case语句：

1. **基本语法**：表达式类型限制、case常量要求、default子句
2. **fall-through行为**：故意穿透的场景（多case共享代码）、忘记break的后果
3. **底层实现**：跳转表原理、密集case vs 稀疏case的编译策略
4. **性能对比**：switch vs if-else的实际性能测试
5. **经典应用**：菜单系统、计算器、状态机
6. **常见陷阱**：变量声明作用域、default位置、空switch

switch-case是C语言中处理多路分支的首选方案，在case值密集时性能优于if-else。理解其底层实现有助于写出更高效的代码。
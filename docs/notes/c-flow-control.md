---
title: C语言流程控制Ⅱ
date: 2026-07-26
tags:
  - C语言
  - 流程控制
  - if-else
  - switch
  - for
  - while
categories:
  - C语言
---

# C语言流程控制Ⅱ

## 前言

在编程的世界里，程序默认是按照从上到下、逐行执行的顺序运行的。这种线性的执行方式称为"顺序执行"。然而，现实世界中的问题往往不是线性的——我们需要根据不同的条件做出不同的决策，需要重复执行某些操作，需要在特定条件下跳出循环。这些"非顺序"的执行逻辑，就是**流程控制**（Flow Control）的核心内容。

C语言的流程控制可以大致分为三大类：

1. **条件判断**：根据条件是否成立，决定执行哪一段代码，包括 `if-else` 和 `switch-case`。
2. **循环结构**：重复执行某段代码，直到满足特定条件为止，包括 `for`、`while` 和 `do-while`。
3. **跳转语句**：改变程序执行的正常流向，包括 `break`、`continue` 和 `goto`。

这篇文章将深入剖析C语言中每一种流程控制结构，从基本语法到高级用法，再到实际应用场景，力求让读者对C语言的流程控制有全面且透彻的理解。每一个知识点都将搭配完整的、可运行的代码示例，并加上详尽的注释，帮助你真正掌握这些内容。

---

## 一、if/else 条件判断语句

`if/else` 是编程中最基础也是最重要的条件判断结构。它允许程序根据某个条件表达式的真假来决定执行哪一部分代码。在C语言中，条件表达式的结果是一个整数值：**0 表示假（false），非0 表示真（true）**。这与许多其他语言使用专门的布尔类型不同，理解这一点对于掌握C语言的条件判断非常重要。

### 1.1 单分支 if 语句

单分支 `if` 语句是最简单的条件判断形式。它的语法如下：

```c
if (条件表达式) {
    // 条件为真时执行的代码块
}
```

当条件表达式的结果为非0（即真）时，花括号内的代码块会被执行；如果条件表达式的结果为0（即假），则跳过整个代码块，继续执行后面的语句。

下面是一个完整的示例，演示单分支 `if` 语句的基本用法：

```c
#include <stdio.h>

int main() {
    int score = 85;

    // 单分支 if 语句：如果分数大于等于60，打印"及格"
    if (score >= 60) {
        printf("恭喜！你的分数是 %d，你及格了！\n", score);
    }

    // 当条件不成立时，这行代码不会执行
    int temperature = 35;
    if (temperature > 40) {
        printf("今天非常炎热，请注意防暑。\n");
    }
    // 由于 temperature 是 35，不大于 40，上面的 printf 不会执行

    printf("程序结束。\n");
    return 0;
}
```

在这个例子中，第一个 `if` 语句的条件 `score >= 60` 为真，因此会执行对应的 `printf` 语句。第二个 `if` 语句的条件 `temperature > 40` 为假，因此其中的 `printf` 不会被执行。

**关于花括号的注意事项**：如果 `if` 语句后面只有一条语句，花括号可以省略。但为了代码的清晰性和可维护性，强烈建议始终使用花括号。省略花括号可能导致微妙的逻辑错误，特别是在后期修改代码时。例如：

```c
#include <stdio.h>

int main() {
    int a = 10;

    // 省略花括号的写法（不推荐）
    if (a > 5)
        printf("a 大于 5\n");
        printf("这行代码总是会执行，不属于 if 语句！\n");

    // 推荐使用花括号的写法
    if (a > 5) {
        printf("a 大于 5\n");
        printf("这行代码也只会在条件成立时执行。\n");
    }

    return 0;
}
```

在第一个 `if` 语句中，由于没有花括号，只有第一行 `printf("a 大于 5\n")` 属于 `if` 语句的一部分。第二行 `printf` 总是会执行，无论条件是否成立。这种细微的差别很容易被忽略，因此养成始终使用花括号的习惯非常重要。

### 1.2 双分支 if-else 语句

当我们需要在条件成立和不成立时分别执行不同的代码时，可以使用 `if-else` 双分支结构：

```c
if (条件表达式) {
    // 条件为真时执行的代码块
} else {
    // 条件为假时执行的代码块
}
```

下面是一个判断数字奇偶性的完整示例：

```c
#include <stdio.h>

int main() {
    int num;

    printf("请输入一个整数：");
    scanf("%d", &num);

    // 双分支 if-else 语句：判断奇偶性
    if (num % 2 == 0) {
        printf("%d 是偶数。\n", num);
    } else {
        printf("%d 是奇数。\n", num);
    }

    return 0;
}
```

再来看一个判断年份是否为闰年的例子。闰年的判断规则是：能被4整除但不能被100整除，或者能被400整除。

```c
#include <stdio.h>

int main() {
    int year;

    printf("请输入一个年份：");
    scanf("%d", &year);

    // 判断闰年
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        printf("%d 年是闰年。\n", year);
    } else {
        printf("%d 年不是闰年。\n", year);
    }

    return 0;
}
```

在这个例子中，条件表达式使用了逻辑运算符 `&&`（与）和 `||`（或），以及关系运算符 `==`（等于）和 `!=`（不等于）。这是实际编程中非常常见的写法。

### 1.3 多分支 if-else if-else 语句

当需要判断多个互斥的条件时，可以使用 `if-else if-else` 多分支结构。它的语法是：

```c
if (条件1) {
    // 条件1为真时执行
} else if (条件2) {
    // 条件1为假但条件2为真时执行
} else if (条件3) {
    // 条件1和条件2都为假但条件3为真时执行
} else {
    // 所有条件都为假时执行
}
```

`else if` 可以出现任意多次，而 `else` 是可选的，最多只能出现一次，且必须放在最后。

下面是一个根据分数评定等级的例子：

```c
#include <stdio.h>

int main() {
    int score;

    printf("请输入你的分数（0-100）：");
    scanf("%d", &score);

    // 多分支 if-else if-else 评分
    if (score >= 90) {
        printf("你的分数是 %d，等级为：A（优秀）\n", score);
    } else if (score >= 80) {
        printf("你的分数是 %d，等级为：B（良好）\n", score);
    } else if (score >= 70) {
        printf("你的分数是 %d，等级为：C（中等）\n", score);
    } else if (score >= 60) {
        printf("你的分数是 %d，等级为：D（及格）\n", score);
    } else {
        printf("你的分数是 %d，等级为：F（不及格）\n", score);
    }

    return 0;
}
```

这里有一个非常重要的细节值得注意：**条件的顺序很重要**。因为 `else if` 会按照顺序依次检查条件，一旦某个条件成立，后续的条件就不会再被检查。在上面的例子中，如果先检查 `score >= 60`，那么所有及格的学生（包括90分以上的）都会被判定为D等级。因此，正确的做法是从最高分到最低分依次判断。

让我们再来看一个更复杂的例子——判断三角形的类型：

```c
#include <stdio.h>

int main() {
    int a, b, c;

    printf("请输入三角形的三条边长：");
    scanf("%d %d %d", &a, &b, &c);

    // 首先判断是否能构成三角形
    // 三角形任意两边之和必须大于第三边
    if (a + b > c && a + c > b && b + c > a) {
        printf("三条边 %d、%d、%d 可以构成三角形。\n", a, b, c);

        // 进一步判断三角形类型
        if (a == b && b == c) {
            printf("这是一个等边三角形（三条边都相等）。\n");
        } else if (a == b || b == c || a == c) {
            printf("这是一个等腰三角形（有两条边相等）。\n");
        } else if (a * a + b * b == c * c ||
                   a * a + c * c == b * b ||
                   b * b + c * c == a * a) {
            printf("这是一个直角三角形（满足勾股定理）。\n");
        } else {
            printf("这是一个普通三角形。\n");
        }
    } else {
        printf("三条边 %d、%d、%d 不能构成三角形。\n", a, b, c);
    }

    return 0;
}
```

这个例子展示了多分支判断在实际问题中的应用。程序首先判断三条边是否能构成三角形，然后进一步判断是等边三角形、等腰三角形、直角三角形还是普通三角形。

### 1.4 嵌套 if 语句

当 `if` 或 `else` 的代码块中又包含另一个 `if` 语句时，就形成了**嵌套 if 语句**。嵌套结构可以处理更复杂的逻辑判断。

下面是一个经典的用户登录验证示例：

```c
#include <stdio.h>
#include <string.h>

int main() {
    char username[50];
    char password[50];

    // 预设的用户名和密码
    char correct_username[] = "admin";
    char correct_password[] = "123456";

    printf("========== 用户登录系统 ==========\n");
    printf("请输入用户名：");
    scanf("%s", username);
    printf("请输入密码：");
    scanf("%s", password);

    // 嵌套 if 语句进行登录验证
    if (strcmp(username, correct_username) == 0) {
        // 用户名正确，继续检查密码
        if (strcmp(password, correct_password) == 0) {
            printf("登录成功！欢迎回来，%s！\n", username);
        } else {
            printf("密码错误，请重试。\n");
        }
    } else {
        printf("用户名不存在，请检查后重试。\n");
    }

    return 0;
}
```

在这个例子中，外层的 `if` 检查用户名是否正确，内层的 `if` 检查密码是否正确。这种嵌套结构使得程序能够分层次地处理不同的验证结果。

**悬空 else 问题**：在嵌套 `if` 语句中，有一个经典的陷阱叫做"悬空 else"（dangling else）。C语言规定，`else` 总是与最近的一个未配对的 `if` 配对。看下面的代码：

```c
#include <stdio.h>

int main() {
    int a = 5, b = 10;

    // 注意：这个缩进具有误导性！
    if (a > 0)
        if (b > 5)
            printf("a > 0 且 b > 5\n");
    else
        printf("a <= 0\n");  // 这个 else 实际上与 if (b > 5) 配对！

    // 正确的写法应该是使用花括号明确意图：
    if (a > 0) {
        if (b > 5) {
            printf("a > 0 且 b > 5\n");
        }
    } else {
        printf("a <= 0\n");  // 现在才与外层 if 配对
    }

    return 0;
}
```

在第一个代码块中，由于缩进具有误导性，看起来 `else` 似乎与外层的 `if (a > 0)` 配对，但实际上它是与内层的 `if (b > 5)` 配对的。这就是为什么始终使用花括号来明确代码结构至关重要的原因。

### 1.5 条件运算符（三元运算符）

C语言还提供了一个简洁的条件判断方式——条件运算符 `?:`，它是唯一一个需要三个操作数的运算符，因此也称为三元运算符。其语法为：

```c
条件表达式 ? 表达式1 : 表达式2
```

如果条件表达式为真，整个表达式的值为 `表达式1` 的值；否则为 `表达式2` 的值。

```c
#include <stdio.h>

int main() {
    int a = 10, b = 20;
    int max, min;

    // 使用条件运算符求最大值
    max = (a > b) ? a : b;
    printf("a = %d, b = %d, 最大值是 %d\n", a, b, max);

    // 使用条件运算符求最小值
    min = (a < b) ? a : b;
    printf("a = %d, b = %d, 最小值是 %d\n", a, b, min);

    // 条件运算符也可以嵌套使用
    int x = 15, y = 30, z = 25;
    int max_of_three;

    max_of_three = (x > y) ? ((x > z) ? x : z) : ((y > z) ? y : z);
    printf("x = %d, y = %d, z = %d, 最大值是 %d\n", x, y, z, max_of_three);

    // 更简洁的写法：使用条件运算符直接在 printf 中
    int num = 7;
    printf("%d 是%s。\n", num, (num % 2 == 0) ? "偶数" : "奇数");

    return 0;
}
```

条件运算符的优势在于简洁，适合简单的二选一判断。但嵌套使用时要注意可读性，不宜嵌套过深。

---

## 二、switch-case 语句

当需要对一个变量的多个可能取值进行判断时，使用 `if-else if-else` 链虽然可以实现，但代码会显得冗长且不够清晰。C语言提供了 `switch-case` 语句来专门处理这种"多路分支"的场景。

### 2.1 基本语法

`switch-case` 语句的基本语法如下：

```c
switch (表达式) {
    case 常量1:
        // 语句序列
        break;
    case 常量2:
        // 语句序列
        break;
    case 常量3:
        // 语句序列
        break;
    default:
        // 默认语句序列
        break;
}
```

执行流程是：首先计算 `switch` 后面括号中的表达式，然后将结果与每个 `case` 后面的常量值进行比较。当找到匹配的常量值时，程序从该 `case` 标签处开始执行，直到遇到 `break` 语句或 `switch` 语句的结束花括号。

**重要限制**：
- `switch` 的表达式必须是**整型**（包括 `char`、`int`、`short`、`long`、`long long` 以及枚举类型）。浮点数（`float`、`double`）和字符串不能用于 `switch`。
- 每个 `case` 后面的值必须是**常量表达式**，不能在运行时改变。
- 同一个 `switch` 中不能出现两个相同的 `case` 常量值。

下面是一个简单的星期判断示例：

```c
#include <stdio.h>

int main() {
    int day;

    printf("请输入星期几的数字（1-7）：");
    scanf("%d", &day);

    switch (day) {
        case 1:
            printf("星期一：Monday\n");
            break;
        case 2:
            printf("星期二：Tuesday\n");
            break;
        case 3:
            printf("星期三：Wednesday\n");
            break;
        case 4:
            printf("星期四：Thursday\n");
            break;
        case 5:
            printf("星期五：Friday\n");
            break;
        case 6:
            printf("星期六：Saturday\n");
            break;
        case 7:
            printf("星期日：Sunday\n");
            break;
        default:
            printf("输入错误！请输入1到7之间的数字。\n");
            break;
    }

    return 0;
}
```

### 2.2 break 语句的作用

在 `switch-case` 中，`break` 语句的作用是**跳出 switch 语句**，防止程序继续执行下一个 `case` 的代码。如果省略 `break`，程序会从匹配的 `case` 开始，**一直执行完后面所有 case 的代码**，直到遇到 `break` 或 `switch` 结束。这种行为称为"**fall-through**"（穿透）。

让我们通过一个例子来观察有 `break` 和没有 `break` 的区别：

```c
#include <stdio.h>

int main() {
    int choice = 2;

    printf("=== 有 break 的 switch ===\n");
    switch (choice) {
        case 1:
            printf("执行 case 1\n");
            break;
        case 2:
            printf("执行 case 2\n");
            break;
        case 3:
            printf("执行 case 3\n");
            break;
        default:
            printf("默认情况\n");
            break;
    }

    printf("\n=== 没有 break 的 switch ===\n");
    switch (choice) {
        case 1:
            printf("执行 case 1\n");
        case 2:
            printf("执行 case 2\n");
        case 3:
            printf("执行 case 3\n");
        default:
            printf("默认情况\n");
    }

    return 0;
}
```

输出结果将显示：有 `break` 时只执行了 `case 2`；没有 `break` 时，从 `case 2` 开始，一直执行到了 `default`。

### 2.3 合理利用 fall-through

虽然 fall-through 通常被认为是容易出错的，但在某些场景下，合理利用它可以写出更简洁的代码。例如，当多个 `case` 需要执行相同的操作时：

```c
#include <stdio.h>

int main() {
    int month;

    printf("请输入月份（1-12）：");
    scanf("%d", &month);

    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            printf("%d 月有 31 天。\n", month);
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            printf("%d 月有 30 天。\n", month);
            break;
        case 2:
            printf("%d 月有 28 天或 29 天（闰年）。\n", month);
            break;
        default:
            printf("输入错误！请输入1到12之间的数字。\n");
            break;
    }

    return 0;
}
```

在这个例子中，大月（1、3、5、7、8、10、12月）共享相同的代码，小月（4、6、9、11月）也共享相同的代码。这种利用 fall-through 的写法比使用多个 `if-else if` 要清晰得多。

### 2.4 简单计算器示例

下面是一个使用 `switch-case` 实现的简单四则运算计算器：

```c
#include <stdio.h>

int main() {
    char operator;
    double num1, num2, result;

    printf("========== 简单计算器 ==========\n");
    printf("支持的运算：+（加）、-（减）、*（乘）、/（除）\n");
    printf("请输入表达式（例如：5 + 3）：");
    scanf("%lf %c %lf", &num1, &operator, &num2);

    switch (operator) {
        case '+':
            result = num1 + num2;
            printf("%.2f + %.2f = %.2f\n", num1, num2, result);
            break;
        case '-':
            result = num1 - num2;
            printf("%.2f - %.2f = %.2f\n", num1, num2, result);
            break;
        case '*':
            result = num1 * num2;
            printf("%.2f * %.2f = %.2f\n", num1, num2, result);
            break;
        case '/':
            // 检查除数是否为0
            if (num2 != 0) {
                result = num1 / num2;
                printf("%.2f / %.2f = %.2f\n", num1, num2, result);
            } else {
                printf("错误：除数不能为零！\n");
            }
            break;
        default:
            printf("错误：不支持的运算符 '%c'。\n", operator);
            break;
    }

    return 0;
}
```

### 2.5 switch-case 与 if-else 的选择

一般来说，在以下情况下优先使用 `switch-case`：

- 判断条件是**同一个变量的多个离散值**。
- 分支较多（通常3个以上）。
- 条件值是整型或字符型。

在以下情况下使用 `if-else`：

- 判断条件涉及**范围比较**（如 `score >= 90`）。
- 判断条件涉及多个不同的变量。
- 条件表达式是复杂的布尔表达式。
- 需要比较浮点数或字符串。

---

## 三、for 循环

循环是编程中最重要的结构之一，它允许程序重复执行一段代码。C语言提供了三种循环结构：`for`、`while` 和 `do-while`。首先来看最常用也最灵活的 `for` 循环。

### 3.1 基本语法

`for` 循环的基本语法如下：

```c
for (初始化表达式; 条件表达式; 更新表达式) {
    // 循环体
}
```

`for` 循环的执行流程可以分解为以下几个步骤：

1. **初始化表达式**：在循环开始前执行一次，通常用于初始化循环变量。
2. **条件表达式**：在每次循环开始前进行判断。如果为真（非0），则执行循环体；如果为假（0），则退出循环。
3. **循环体**：如果条件表达式为真，则执行循环体中的代码。
4. **更新表达式**：循环体执行完毕后，执行更新表达式，通常用于更新循环变量。
5. 回到第2步，再次判断条件表达式。

用流程图表示就是：初始化 -> 判断条件 -> 执行循环体 -> 更新变量 -> 判断条件 -> ... 直到条件不成立。

下面是一个最简单的 `for` 循环示例，打印数字 1 到 10：

```c
#include <stdio.h>

int main() {
    printf("使用 for 循环打印 1 到 10：\n");

    // i 从 1 开始，每次循环 i 增加 1，当 i > 10 时停止
    for (int i = 1; i <= 10; i++) {
        printf("%d ", i);
    }
    printf("\n");

    return 0;
}
```

### 3.2 for 循环的灵活变化

`for` 循环的三个表达式都可以省略或变化，这使得它非常灵活。

**省略初始化表达式**：如果循环变量在循环之前已经初始化，可以省略初始化表达式。

```c
#include <stdio.h>

int main() {
    int i = 0;  // 在循环外部初始化

    printf("省略初始化表达式：\n");
    for (; i < 5; i++) {
        printf("%d ", i);
    }
    printf("\n");

    return 0;
}
```

**省略条件表达式**：如果省略条件表达式，默认为"永远为真"，形成一个无限循环。通常需要配合 `break` 语句来退出循环。

```c
#include <stdio.h>

int main() {
    int i = 0;

    printf("省略条件表达式（无限循环 + break）：\n");
    for (;;) {  // 无限循环
        printf("%d ", i);
        i++;
        if (i >= 5) {
            break;  // 退出循环
        }
    }
    printf("\n");

    return 0;
}
```

**省略更新表达式**：如果省略更新表达式，需要在循环体内部手动更新循环变量。

```c
#include <stdio.h>

int main() {
    printf("省略更新表达式：\n");
    for (int i = 0; i < 5;) {
        printf("%d ", i);
        i++;  // 在循环体内更新
    }
    printf("\n");

    return 0;
}
```

**使用逗号运算符**：可以在初始化表达式和更新表达式中使用逗号运算符来操作多个变量。

```c
#include <stdio.h>

int main() {
    printf("使用逗号运算符操作多个变量：\n");

    // 同时使用 i 和 j 两个循环变量
    for (int i = 0, j = 10; i < j; i++, j--) {
        printf("i = %d, j = %d, i + j = %d\n", i, j, i + j);
    }

    return 0;
}
```

### 3.3 递减的 for 循环

`for` 循环不一定只能递增，也可以递减：

```c
#include <stdio.h>

int main() {
    printf("递减的 for 循环（倒计时）：\n");

    // 从 10 递减到 1
    for (int i = 10; i >= 1; i--) {
        printf("%d ", i);
    }
    printf("\n发射！\n");

    return 0;
}
```

### 3.4 使用不同步长的 for 循环

更新表达式不一定每次只加1或减1，可以设置任意步长：

```c
#include <stdio.h>

int main() {
    printf("打印 1 到 20 之间的所有偶数：\n");
    for (int i = 2; i <= 20; i += 2) {
        printf("%d ", i);
    }
    printf("\n");

    printf("打印 1 到 20 之间的所有奇数：\n");
    for (int i = 1; i <= 20; i += 2) {
        printf("%d ", i);
    }
    printf("\n");

    return 0;
}
```

### 3.5 嵌套 for 循环

当一个 `for` 循环的循环体内部包含另一个 `for` 循环时，就形成了嵌套循环。外层循环每执行一次，内层循环会完整地执行一遍。

```c
#include <stdio.h>

int main() {
    printf("嵌套 for 循环示例：打印 3x3 的矩阵\n");

    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("(%d, %d) ", i, j);
        }
        printf("\n");  // 每一行结束后换行
    }

    return 0;
}
```

输出结果解释了嵌套循环的执行顺序：外层 `i` 循环控制行，内层 `j` 循环控制列。`i=1` 时，`j` 从 1 到 3 完整执行一遍；然后 `i=2`，`j` 再次从 1 到 3 完整执行一遍；以此类推。

嵌套循环的时间复杂度通常是 O(n * m)，其中 n 和 m 分别是外层和内层循环的迭代次数。在使用嵌套循环时，需要特别注意性能问题。

---

## 四、while 循环

`while` 循环是C语言中最基本的循环结构。与 `for` 循环不同，`while` 循环在执行前只检查一个条件，没有内置的初始化部分和更新部分。

### 4.1 基本语法

```c
while (条件表达式) {
    // 循环体
}
```

执行流程是：先判断条件表达式，如果为真（非0），则执行循环体；执行完毕后再次判断条件表达式，如果仍然为真，则继续执行循环体；如此反复，直到条件表达式为假时退出循环。

**关键点**：如果条件表达式一开始就为假，循环体一次都不会执行。

```c
#include <stdio.h>

int main() {
    int count = 1;

    printf("while 循环打印 1 到 5：\n");
    while (count <= 5) {
        printf("%d ", count);
        count++;  // 必须更新循环变量，否则会导致无限循环！
    }
    printf("\n");

    return 0;
}
```

**无限循环**：如果条件表达式永远为真，就会形成无限循环。这在某些场景下是有意为之的（如服务器程序），但通常需要配合 `break` 来退出。

```c
#include <stdio.h>

int main() {
    int count = 1;

    printf("使用 while 无限循环 + break 打印 1 到 5：\n");
    while (1) {  // 永远为真
        printf("%d ", count);
        count++;
        if (count > 5) {
            break;  // 条件满足时退出循环
        }
    }
    printf("\n");

    return 0;
}
```

### 4.2 while 循环的典型应用场景

`while` 循环特别适合那些**不确定循环次数**的场景，比如等待用户输入特定值、读取文件直到末尾等。

**场景一：反复询问用户直到输入有效值**

```c
#include <stdio.h>

int main() {
    int number;

    printf("请输入一个 1 到 100 之间的整数：");
    scanf("%d", &number);

    // 如果输入不合法，反复提示用户重新输入
    while (number < 1 || number > 100) {
        printf("输入无效！请重新输入一个 1 到 100 之间的整数：");
        scanf("%d", &number);
    }

    printf("你输入的有效数字是：%d\n", number);
    return 0;
}
```

**场景二：数字反转**

```c
#include <stdio.h>

int main() {
    int num, reversed = 0, remainder;

    printf("请输入一个正整数：");
    scanf("%d", &num);

    int original = num;  // 保存原始值

    // 使用 while 循环反转数字
    while (num != 0) {
        remainder = num % 10;       // 取出最后一位
        reversed = reversed * 10 + remainder;  // 构建反转后的数字
        num /= 10;                  // 去掉最后一位
    }

    printf("原始数字：%d，反转后：%d\n", original, reversed);
    return 0;
}
```

**场景三：计算数字的位数**

```c
#include <stdio.h>

int main() {
    int num, count = 0;

    printf("请输入一个整数：");
    scanf("%d", &num);

    int temp = (num < 0) ? -num : num;  // 处理负数

    // 使用 while 循环计算位数
    if (temp == 0) {
        count = 1;  // 特殊情况：0 有一位
    } else {
        while (temp != 0) {
            temp /= 10;
            count++;
        }
    }

    printf("%d 有 %d 位数字。\n", num, count);
    return 0;
}
```

---

## 五、do-while 循环

`do-while` 循环与 `while` 循环非常相似，但有一个关键的区别：**`do-while` 循环先执行循环体，再判断条件**。这意味着无论条件是否成立，循环体至少会被执行一次。

### 5.1 基本语法

```c
do {
    // 循环体
} while (条件表达式);
```

注意：`do-while` 语句的末尾有一个分号 `;`，这是与 `while` 循环在语法上的一个重要区别。

```c
#include <stdio.h>

int main() {
    int count = 1;

    printf("do-while 循环打印 1 到 5：\n");
    do {
        printf("%d ", count);
        count++;
    } while (count <= 5);
    printf("\n");

    return 0;
}
```

### 5.2 while 与 do-while 的关键区别

让我们通过一个例子来直观地展示两者的区别：

```c
#include <stdio.h>

int main() {
    int num = 10;

    printf("当 num = %d 时：\n\n", num);

    // while 循环：条件一开始就不成立，循环体不会执行
    printf("while 循环：");
    while (num < 5) {
        printf("执行了循环体。");
    }
    printf("（循环体未执行）\n");

    // do-while 循环：先执行一次循环体，再判断条件
    printf("do-while 循环：");
    do {
        printf("执行了循环体。");
    } while (num < 5);
    printf("\n");

    return 0;
}
```

输出结果清楚地表明：`while` 循环因为条件一开始就不成立，循环体完全没有执行；而 `do-while` 循环先执行了一次循环体，然后才判断条件，发现条件不成立后退出。

### 5.3 do-while 的典型应用场景

**场景一：菜单驱动程序**

```c
#include <stdio.h>

int main() {
    int choice;

    do {
        printf("\n========== 主菜单 ==========\n");
        printf("1. 查看信息\n");
        printf("2. 修改设置\n");
        printf("3. 帮助\n");
        printf("0. 退出\n");
        printf("请选择操作：");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("你选择了：查看信息\n");
                break;
            case 2:
                printf("你选择了：修改设置\n");
                break;
            case 3:
                printf("你选择了：帮助\n");
                break;
            case 0:
                printf("感谢使用，再见！\n");
                break;
            default:
                printf("无效选择，请重试。\n");
                break;
        }
    } while (choice != 0);

    return 0;
}
```

`do-while` 在这里非常合适，因为菜单至少需要显示一次，而且用户可能多次进行操作。

**场景二：验证用户输入**

```c
#include <stdio.h>

int main() {
    int password;
    int correct_password = 8888;

    // 使用 do-while 至少给用户一次输入机会
    do {
        printf("请输入密码（四位数字）：");
        scanf("%d", &password);

        if (password != correct_password) {
            printf("密码错误，请重试。\n");
        }
    } while (password != correct_password);

    printf("密码正确，欢迎！\n");
    return 0;
}
```

### 5.4 三种循环的比较

| 特性 | for | while | do-while |
|------|-----|-------|----------|
| 最少执行次数 | 0次 | 0次 | 1次 |
| 初始化 | 内置 | 循环前手动 | 循环前手动 |
| 更新 | 内置 | 循环体内手动 | 循环体内手动 |
| 适用场景 | 已知循环次数 | 条件控制，可能0次 | 至少执行1次 |

选择哪种循环结构取决于具体场景：

- 如果**循环次数已知或可确定**，优先使用 `for` 循环。
- 如果循环由**条件控制且可能一次都不执行**，使用 `while` 循环。
- 如果循环**至少需要执行一次**，使用 `do-while` 循环。

---

## 六、break 和 continue 语句

`break` 和 `continue` 是C语言中用于控制循环执行流程的两个关键语句。它们可以改变循环的正常执行顺序，使程序更加灵活。

### 6.1 break 语句

`break` 语句有两个主要用途：

1. 在 `switch` 语句中，跳出 `switch` 结构。
2. 在循环（`for`、`while`、`do-while`）中，**立即终止整个循环**，程序继续执行循环后面的语句。

当 `break` 出现在嵌套循环中时，它只跳出**最内层**的循环。

```c
#include <stdio.h>

int main() {
    printf("break 语句示例：找到第一个能被 7 和 11 同时整除的数\n");

    for (int i = 1; i <= 200; i++) {
        if (i % 7 == 0 && i % 11 == 0) {
            printf("找到！第一个能被 7 和 11 同时整除的数是：%d\n", i);
            break;  // 找到后立即退出循环，不再继续查找
        }
    }

    return 0;
}
```

**break 在嵌套循环中的作用范围**：

```c
#include <stdio.h>

int main() {
    printf("break 在嵌套循环中的作用范围：\n");

    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            if (i == 2 && j == 2) {
                printf("在 i=%d, j=%d 处 break\n", i, j);
                break;  // 只跳出内层 j 循环，外层 i 循环继续
            }
            printf("i=%d, j=%d\n", i, j);
        }
        printf("--- 内层循环结束（i=%d）---\n", i);
    }

    return 0;
}
```

输出结果会显示，当 `i=2, j=2` 时，内层循环被 `break` 终止，但外层循环继续执行 `i=3` 的情况。

### 6.2 continue 语句

`continue` 语句与 `break` 不同，它不是终止整个循环，而是**跳过当前这次迭代的剩余部分，直接进入下一次迭代**。

在 `for` 循环中，`continue` 会跳转到更新表达式，然后进行条件判断。
在 `while` 和 `do-while` 循环中，`continue` 会跳转到条件判断部分。

```c
#include <stdio.h>

int main() {
    printf("continue 语句示例：只打印奇数，跳过偶数\n");

    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            continue;  // 跳过偶数，不打印
        }
        printf("%d ", i);
    }
    printf("\n");

    return 0;
}
```

**continue 与 while 循环的陷阱**：

在 `while` 循环中使用 `continue` 时需要格外小心，因为 `continue` 会跳过循环变量更新的代码，可能导致无限循环。

```c
#include <stdio.h>

int main() {
    int i = 1;

    printf("while 循环中 continue 的陷阱：\n");
    while (i <= 5) {
        if (i == 3) {
            i++;  // 必须在 continue 之前更新变量！
            continue;
        }
        printf("%d ", i);
        i++;
    }
    printf("\n");

    return 0;
}
```

如果不在 `continue` 之前更新 `i`，当 `i == 3` 时，`continue` 会跳过 `i++`，导致 `i` 永远是 3，形成无限循环。这是初学者经常犯的错误。

### 6.3 break 和 continue 的对比

```c
#include <stdio.h>

int main() {
    printf("break 的效果：\n");
    for (int i = 1; i <= 5; i++) {
        if (i == 3) {
            break;  // 遇到 3 就完全退出循环
        }
        printf("%d ", i);
    }
    printf("\n循环结束\n");

    printf("\ncontinue 的效果：\n");
    for (int i = 1; i <= 5; i++) {
        if (i == 3) {
            continue;  // 遇到 3 跳过，继续下一次迭代
        }
        printf("%d ", i);
    }
    printf("\n循环结束\n");

    return 0;
}
```

输出：
- `break` 版本：打印 1 2，然后退出循环。
- `continue` 版本：打印 1 2 4 5，只跳过了 3。

---

## 七、goto 语句

`goto` 语句是C语言中最具争议的流程控制语句。它允许程序**无条件跳转**到同一函数内带有标签（label）的语句处。

### 7.1 基本语法

```c
goto 标签名;

// ... 其他代码 ...

标签名:
    // 跳转目标处的代码
```

标签名遵循标识符的命名规则，后面跟一个冒号 `:`。

```c
#include <stdio.h>

int main() {
    int num;

    printf("请输入一个正数（输入负数则退出）：");
    scanf("%d", &num);

    if (num < 0) {
        goto exit_program;  // 跳转到退出标签
    }

    printf("你输入的正数是：%d\n", num);
    printf("它的平方是：%d\n", num * num);

exit_program:
    printf("程序结束。\n");
    return 0;
}
```

### 7.2 goto 的一种合理用法：跳出深层嵌套

虽然 `goto` 通常被强烈反对使用，但在某些特定场景下，使用 `goto` 反而能使代码更清晰。最常见的场景是**从深层嵌套循环中一次性跳出**。

```c
#include <stdio.h>

int main() {
    int found = 0;
    int target_i = -1, target_j = -1, target_k = -1;

    printf("在三维空间中搜索目标值 50：\n");

    for (int i = 0; i < 10; i++) {
        for (int j = 0; j < 10; j++) {
            for (int k = 0; k < 10; k++) {
                int value = i * i + j * j + k * k;
                if (value == 50) {
                    target_i = i;
                    target_j = j;
                    target_k = k;
                    goto found_target;  // 一次性跳出三层循环
                }
            }
        }
    }

found_target:
    if (target_i != -1) {
        printf("找到目标值！i=%d, j=%d, k=%d\n", target_i, target_j, target_k);
        printf("验证：%d^2 + %d^2 + %d^2 = %d\n",
               target_i, target_j, target_k,
               target_i * target_i + target_j * target_j + target_k * target_k);
    } else {
        printf("未找到目标值。\n");
    }

    return 0;
}
```

在这个例子中，使用 `goto` 从三层嵌套循环中一次性跳出，比使用多个 `break` 配合标志变量要清晰得多。如果不用 `goto`，需要设置一个标志变量，并在每一层循环中检查这个标志，代码会变得冗长且难以阅读。

### 7.3 为什么 goto 被广泛反对

`goto` 被反对的主要原因可以追溯到1968年 Edsger Dijkstra 发表的著名论文《Go To Statement Considered Harmful》（Go To 语句被认为有害）。主要原因包括：

1. **破坏代码结构**：`goto` 可以任意跳转，使得程序的执行流程不再是结构化的，难以理解和追踪。
2. **增加调试难度**：当代码中出现多个 `goto` 跳转时，追踪程序的执行路径变得极其困难。
3. **降低可维护性**：后续修改代码时，`goto` 的跳转关系可能导致意外的副作用。
4. **有更好的替代方案**：绝大多数情况下，`if-else`、循环、`break`、`continue` 以及函数调用可以更清晰地表达程序逻辑。

**建议**：在现代编程实践中，应该尽量避免使用 `goto`。如果必须使用，请确保：
- 跳转目标在 `goto` 语句的下方（向前跳转），不要向后跳转。
- 不要跳转到另一个代码块或作用域中。
- 只用于跳出深层嵌套或错误处理这类明确场景。

---

## 八、综合实战练习

理论讲完了，接下来通过几个经典的编程练习来巩固对流程控制的理解。每个示例都配有完整的代码和详细的注释。

### 8.1 打印金字塔图案

金字塔图案是练习嵌套循环的经典题目。通过控制空格和星号的数量，可以打印出各种形状。

**正金字塔**：

```c
#include <stdio.h>

/*
 * 打印正金字塔图案
 *
 * 思路分析（以 n=5 为例）：
 * 第1行：4个空格 + 1个星号
 * 第2行：3个空格 + 3个星号
 * 第3行：2个空格 + 5个星号
 * 第4行：1个空格 + 7个星号
 * 第5行：0个空格 + 9个星号
 *
 * 规律：第 i 行有 (n-i) 个空格，有 (2*i-1) 个星号
 */

int main() {
    int n;

    printf("请输入金字塔的高度：");
    scanf("%d", &n);

    printf("\n=== 正金字塔（高度：%d）===\n\n", n);

    for (int i = 1; i <= n; i++) {
        // 打印空格：每行有 (n - i) 个空格
        for (int j = 1; j <= n - i; j++) {
            printf(" ");
        }
        // 打印星号：每行有 (2 * i - 1) 个星号
        for (int k = 1; k <= 2 * i - 1; k++) {
            printf("*");
        }
        // 每行结束后换行
        printf("\n");
    }

    return 0;
}
```

**倒金字塔**：

```c
#include <stdio.h>

/*
 * 打印倒金字塔图案
 *
 * 思路分析（以 n=5 为例）：
 * 第1行：0个空格 + 9个星号
 * 第2行：1个空格 + 7个星号
 * 第3行：2个空格 + 5个星号
 * 第4行：3个空格 + 3个星号
 * 第5行：4个空格 + 1个星号
 *
 * 规律：第 i 行有 (i-1) 个空格，有 (2*(n-i+1)-1) 个星号
 */

int main() {
    int n;

    printf("请输入倒金字塔的高度：");
    scanf("%d", &n);

    printf("\n=== 倒金字塔（高度：%d）===\n\n", n);

    for (int i = 1; i <= n; i++) {
        // 打印空格：每行有 (i - 1) 个空格
        for (int j = 1; j <= i - 1; j++) {
            printf(" ");
        }
        // 打印星号：每行有 (2 * (n - i + 1) - 1) 个星号
        for (int k = 1; k <= 2 * (n - i + 1) - 1; k++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
```

**菱形图案**（将正金字塔和倒金字塔组合）：

```c
#include <stdio.h>

/*
 * 打印菱形图案
 *
 * 思路：将菱形分为上半部分（正金字塔）和下半部分（倒金字塔）
 * 上半部分：n 行正金字塔
 * 下半部分：n-1 行倒金字塔
 */

int main() {
    int n;

    printf("请输入菱形的一半高度（上半部分的行数）：");
    scanf("%d", &n);

    printf("\n=== 菱形图案 ===\n\n");

    // 上半部分：正金字塔（n 行）
    for (int i = 1; i <= n; i++) {
        // 打印空格
        for (int j = 1; j <= n - i; j++) {
            printf(" ");
        }
        // 打印星号
        for (int k = 1; k <= 2 * i - 1; k++) {
            printf("*");
        }
        printf("\n");
    }

    // 下半部分：倒金字塔（n-1 行）
    for (int i = n - 1; i >= 1; i--) {
        // 打印空格
        for (int j = 1; j <= n - i; j++) {
            printf(" ");
        }
        // 打印星号
        for (int k = 1; k <= 2 * i - 1; k++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
```

**空心菱形**：

```c
#include <stdio.h>

/*
 * 打印空心菱形图案
 *
 * 思路：在菱形的基础上，只打印每行的第一个和最后一个星号
 * 其余位置打印空格
 */

int main() {
    int n;

    printf("请输入空心菱形的一半高度：");
    scanf("%d", &n);

    printf("\n=== 空心菱形 ===\n\n");

    // 上半部分
    for (int i = 1; i <= n; i++) {
        // 打印左边的空格
        for (int j = 1; j <= n - i; j++) {
            printf(" ");
        }
        // 打印星号和内部空格
        for (int k = 1; k <= 2 * i - 1; k++) {
            if (k == 1 || k == 2 * i - 1) {
                printf("*");  // 第一个和最后一个位置打印星号
            } else {
                printf(" ");  // 中间位置打印空格
            }
        }
        printf("\n");
    }

    // 下半部分
    for (int i = n - 1; i >= 1; i--) {
        for (int j = 1; j <= n - i; j++) {
            printf(" ");
        }
        for (int k = 1; k <= 2 * i - 1; k++) {
            if (k == 1 || k == 2 * i - 1) {
                printf("*");
            } else {
                printf(" ");
            }
        }
        printf("\n");
    }

    return 0;
}
```

### 8.2 水仙花数（Narcissistic Numbers）

水仙花数是指一个 n 位正整数，它的每个位上的数字的 n 次幂之和等于它本身。对于三位数来说，水仙花数满足：百位的立方 + 十位的立方 + 个位的立方 = 该数本身。

例如：153 = 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153

下面使用穷举法找出所有的三位水仙花数：

```c
#include <stdio.h>

/*
 * 找出所有三位水仙花数
 *
 * 水仙花数定义：一个三位数，其各位数字的立方和等于该数本身
 * 例如：153 = 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153
 *
 * 算法：穷举法（暴力枚举）
 * 遍历 100 到 999 之间的所有数字，逐一检查是否满足条件
 *
 * 时间复杂度：O(n)，其中 n = 900（三位数的个数）
 * 空间复杂度：O(1)
 */

int main() {
    int count = 0;

    printf("========== 三位水仙花数 ==========\n\n");
    printf("水仙花数定义：一个三位数等于其各位数字的立方和\n\n");

    // 穷举法：遍历所有三位数（100-999）
    for (int num = 100; num <= 999; num++) {
        // 提取各位数字
        int hundreds = num / 100;        // 百位：整除 100
        int tens = (num / 10) % 10;      // 十位：先整除 10，再取余 10
        int ones = num % 10;             // 个位：取余 10

        // 计算各位数字的立方和
        int sum_of_cubes = hundreds * hundreds * hundreds +
                           tens * tens * tens +
                           ones * ones * ones;

        // 判断是否为水仙花数
        if (sum_of_cubes == num) {
            printf("水仙花数：%d = %d^3 + %d^3 + %d^3 = %d + %d + %d\n",
                   num, hundreds, tens, ones,
                   hundreds * hundreds * hundreds,
                   tens * tens * tens,
                   ones * ones * ones);
            count++;
        }
    }

    printf("\n共有 %d 个三位水仙花数。\n", count);

    // 扩展：列出所有三位水仙花数
    // 结果为：153, 370, 371, 407
    printf("它们分别是：153, 370, 371, 407\n");

    return 0;
}
```

**扩展：找出所有四位水仙花数（四叶玫瑰数）**：

```c
#include <stdio.h>

/*
 * 找出所有四位水仙花数（也称为四叶玫瑰数）
 *
 * 四位水仙花数定义：一个四位数，其各位数字的四次方之和等于该数本身
 * 例如：1634 = 1^4 + 6^4 + 3^4 + 4^4 = 1 + 1296 + 81 + 256 = 1634
 */

int main() {
    int count = 0;

    printf("========== 四位水仙花数（四叶玫瑰数）==========\n\n");

    // 穷举法：遍历所有四位数（1000-9999）
    for (int num = 1000; num <= 9999; num++) {
        int thousands = num / 1000;          // 千位
        int hundreds = (num / 100) % 10;     // 百位
        int tens = (num / 10) % 10;          // 十位
        int ones = num % 10;                 // 个位

        // 计算四次方和
        int sum = thousands * thousands * thousands * thousands +
                  hundreds * hundreds * hundreds * hundreds +
                  tens * tens * tens * tens +
                  ones * ones * ones * ones;

        if (sum == num) {
            printf("水仙花数：%d\n", num);
            printf("  验证：%d^4 + %d^4 + %d^4 + %d^4 = %d + %d + %d + %d = %d\n",
                   thousands, hundreds, tens, ones,
                   thousands * thousands * thousands * thousands,
                   hundreds * hundreds * hundreds * hundreds,
                   tens * tens * tens * tens,
                   ones * ones * ones * ones,
                   sum);
            count++;
        }
    }

    printf("\n共有 %d 个四位水仙花数。\n", count);

    // 结果为：1634, 8208, 9474
    printf("它们分别是：1634, 8208, 9474\n");

    return 0;
}
```

### 8.3 最大公约数——辗转相除法（欧几里得算法）

辗转相除法（Euclidean Algorithm）是求两个正整数最大公约数（Greatest Common Divisor，GCD）的经典算法。其原理基于以下定理：

**两个正整数 a 和 b（a > b），它们的最大公约数等于 b 和 a % b 的最大公约数。** 即 `gcd(a, b) = gcd(b, a % b)`。

当余数为 0 时，当前的除数就是最大公约数。

```c
#include <stdio.h>

/*
 * 使用辗转相除法（欧几里得算法）求最大公约数
 *
 * 算法原理：
 * gcd(a, b) = gcd(b, a % b)，当 b = 0 时，gcd(a, 0) = a
 *
 * 示例：求 gcd(48, 18)
 * 步骤1：48 % 18 = 12  -> gcd(48, 18) = gcd(18, 12)
 * 步骤2：18 % 12 = 6   -> gcd(18, 12) = gcd(12, 6)
 * 步骤3：12 % 6 = 0    -> gcd(12, 6) = 6
 * 结果：gcd(48, 18) = 6
 *
 * 时间复杂度：O(log(min(a, b)))
 * 空间复杂度：O(1)
 */

int main() {
    int a, b, temp;
    int original_a, original_b;

    printf("========== 辗转相除法求最大公约数 ==========\n\n");
    printf("请输入两个正整数：");
    scanf("%d %d", &a, &b);

    // 保存原始值
    original_a = a;
    original_b = b;

    // 确保 a >= b（如果不是，则交换）
    if (a < b) {
        temp = a;
        a = b;
        b = temp;
    }

    printf("\n计算过程：\n");
    printf("gcd(%d, %d)\n", original_a, original_b);

    int step = 1;
    int current_a = a, current_b = b;

    // 辗转相除法主循环
    while (current_b != 0) {
        int remainder = current_a % current_b;
        printf("  步骤%d：%d %% %d = %d", step, current_a, current_b, remainder);

        if (remainder == 0) {
            printf("  -> 余数为0，最大公约数为 %d\n", current_b);
        } else {
            printf("  -> gcd(%d, %d) = gcd(%d, %d)\n",
                   current_a, current_b, current_b, remainder);
        }

        current_a = current_b;
        current_b = remainder;
        step++;
    }

    int gcd = current_a;

    printf("\n结果：%d 和 %d 的最大公约数是 %d\n", original_a, original_b, gcd);

    // 利用最大公约数求最小公倍数
    // LCM(a, b) = |a * b| / GCD(a, b)
    // 注意：先除后乘可以避免溢出
    int lcm = original_a / gcd * original_b;
    printf("%d 和 %d 的最小公倍数是 %d\n", original_a, original_b, lcm);
    printf("验证：%d / %d = %d, %d / %d = %d\n",
           lcm, original_a, lcm / original_a, lcm, original_b, lcm / original_b);

    return 0;
}
```

**使用 for 循环实现 GCD 的递归思想（迭代版本）**：

```c
#include <stdio.h>

/*
 * 使用 for 循环实现的 GCD 函数
 * 同样基于辗转相除法
 */

int main() {
    int a, b;

    printf("请输入两个正整数：");
    scanf("%d %d", &a, &b);

    int original_a = a, original_b = b;

    // 确保 a >= b
    if (a < b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // 使用 for 循环实现辗转相除
    int remainder;
    for (remainder = a % b; remainder != 0; remainder = a % b) {
        a = b;
        b = remainder;
    }

    printf("%d 和 %d 的最大公约数是 %d\n", original_a, original_b, b);

    return 0;
}
```

### 8.4 埃拉托斯特尼筛法（Sieve of Eratosthenes）

埃拉托斯特尼筛法（简称埃氏筛）是一种用于找出小于等于某个给定数 N 的所有质数的古老而高效的算法。

**算法原理**：

1. 创建一个大小为 N+1 的布尔数组，初始时将所有元素标记为 true（假设所有数都是质数）。
2. 将索引 0 和 1 标记为 false（0 和 1 不是质数）。
3. 从 2 开始，遍历到 sqrt(N)：
   - 如果当前数 p 被标记为质数，则将 p 的所有倍数（p*p, p*p+p, ...）标记为非质数。
4. 遍历结束后，所有仍标记为 true 的索引就是质数。

**时间复杂度**：O(N log log N)
**空间复杂度**：O(N)

```c
#include <stdio.h>
#include <stdbool.h>
#include <math.h>

#define MAX_N 1000  // 定义最大查找范围

/*
 * 埃拉托斯特尼筛法（Sieve of Eratosthenes）
 * 找出小于等于 N 的所有质数
 *
 * 算法核心思想：
 * 从小到大遍历，如果当前数是质数，就把它所有的倍数标记为合数
 * 因为合数必定有质因子，所以这样可以筛掉所有合数
 */

int main() {
    int N;

    printf("========== 埃拉托斯特尼筛法：找出所有质数 ==========\n\n");
    printf("请输入一个正整数 N（查找范围 2 ~ N，N <= %d）：", MAX_N);
    scanf("%d", &N);

    if (N < 2) {
        printf("N 必须大于等于 2。\n");
        return 0;
    }
    if (N > MAX_N) {
        printf("N 不能超过 %d。\n", MAX_N);
        return 0;
    }

    // 创建布尔数组，is_prime[i] 表示 i 是否为质数
    bool is_prime[N + 1];

    // 初始化：先假设所有数都是质数
    for (int i = 2; i <= N; i++) {
        is_prime[i] = true;
    }

    // 0 和 1 不是质数
    is_prime[0] = false;
    is_prime[1] = false;

    // 核心筛法：从 2 开始，到 sqrt(N) 为止
    int limit = (int)sqrt(N);
    for (int p = 2; p <= limit; p++) {
        // 如果 p 是质数，则筛掉 p 的所有倍数
        if (is_prime[p]) {
            // 从 p*p 开始筛，因为 p*2, p*3, ..., p*(p-1) 已经被更小的质数筛过了
            for (int multiple = p * p; multiple <= N; multiple += p) {
                is_prime[multiple] = false;
            }
        }
    }

    // 统计并输出结果
    int count = 0;
    printf("\n2 到 %d 之间的所有质数：\n\n", N);

    for (int i = 2; i <= N; i++) {
        if (is_prime[i]) {
            printf("%4d ", i);
            count++;
            // 每行打印 10 个质数
            if (count % 10 == 0) {
                printf("\n");
            }
        }
    }

    printf("\n\n在 2 到 %d 之间共有 %d 个质数。\n", N, count);
    printf("质数密度：%.2f%%\n", (double)count / (N - 1) * 100);

    return 0;
}
```

**优化版埃氏筛——只筛奇数**：

```c
#include <stdio.h>
#include <stdbool.h>
#include <math.h>

#define MAX_N 10000

/*
 * 优化版埃氏筛：只筛奇数，减少一半的内存和计算量
 *
 * 优化思路：
 * 1. 除了 2 以外，所有偶数都不是质数
 * 2. 因此可以只处理奇数，将内存和计算量减半
 */

int main() {
    int N;

    printf("========== 优化版埃氏筛（只筛奇数）==========\n\n");
    printf("请输入 N（N <= %d）：", MAX_N);
    scanf("%d", &N);

    if (N < 2 || N > MAX_N) {
        printf("N 的范围是 2 到 %d。\n", MAX_N);
        return 0;
    }

    // 分配数组，只存储奇数（索引 i 对应数值 2*i+1）
    int size = (N + 1) / 2;  // 只需要存储 N/2 个奇数
    bool is_prime[size];

    // 初始化：所有奇数先假设为质数
    // 索引 i 对应数值 2*i+1（即 1, 3, 5, 7, ...）
    for (int i = 0; i < size; i++) {
        is_prime[i] = true;
    }

    // 数值 1 不是质数（对应索引 0）
    is_prime[0] = false;

    int limit = (int)sqrt(N);
    // 从 3 开始筛（对应索引 1），只处理奇数
    for (int p = 3; p <= limit; p += 2) {
        int idx = p / 2;  // 计算 p 在数组中的索引
        if (is_prime[idx]) {
            // 从 p*p 开始筛，步长为 2*p（跳过偶数倍数）
            for (int multiple = p * p; multiple <= N; multiple += 2 * p) {
                is_prime[multiple / 2] = false;
            }
        }
    }

    // 输出结果
    int count = 1;  // 2 是质数
    printf("\n2 ");  // 先打印 2

    for (int i = 1; i < size; i++) {
        if (is_prime[i]) {
            int num = 2 * i + 1;
            printf("%d ", num);
            count++;
            if (count % 10 == 0) {
                printf("\n");
            }
        }
    }

    printf("\n\n在 2 到 %d 之间共有 %d 个质数。\n", N, count);

    return 0;
}
```

### 8.5 九九乘法表

九九乘法表是编程入门的经典练习，它完美地演示了嵌套循环的使用。

```c
#include <stdio.h>

/*
 * 打印九九乘法表
 *
 * 九九乘法表是一个 9x9 的下三角矩阵
 * 第 i 行有 i 个表达式，每个表达式格式为 "j x i = i*j"
 */

int main() {
    printf("==================== 九九乘法表 ====================\n\n");

    // 外层循环控制行（乘数 i，从 1 到 9）
    for (int i = 1; i <= 9; i++) {
        // 内层循环控制列（被乘数 j，从 1 到 i）
        for (int j = 1; j <= i; j++) {
            // 打印乘法表达式，%2d 保证两位数对齐
            printf("%d x %d = %2d  ", j, i, i * j);
        }
        printf("\n");  // 每行结束后换行
    }

    return 0;
}
```

**扩展：完整的 9x9 矩阵乘法表**：

```c
#include <stdio.h>

/*
 * 打印完整的 9x9 矩阵乘法表（不仅是下三角）
 */

int main() {
    printf("============== 完整 9x9 乘法表 ==============\n\n");

    // 打印表头
    printf("     ");  // 5个空格用于对齐
    for (int i = 1; i <= 9; i++) {
        printf("%4d ", i);
    }
    printf("\n");

    // 打印分隔线
    printf("    +");
    for (int i = 1; i <= 9; i++) {
        printf("-----");
    }
    printf("\n");

    // 打印表格主体
    for (int i = 1; i <= 9; i++) {
        printf("%3d |", i);  // 行标签
        for (int j = 1; j <= 9; j++) {
            printf("%4d ", i * j);
        }
        printf("\n");
    }

    return 0;
}
```

**使用 while 循环实现九九乘法表**：

```c
#include <stdio.h>

/*
 * 使用 while 循环（而非 for 循环）实现九九乘法表
 * 展示用不同循环结构实现相同功能
 */

int main() {
    printf("======= 九九乘法表（while 循环实现）=======\n\n");

    int i = 1;
    while (i <= 9) {
        int j = 1;
        while (j <= i) {
            printf("%d x %d = %2d  ", j, i, i * j);
            j++;
        }
        printf("\n");
        i++;
    }

    return 0;
}
```

**使用 do-while 循环实现九九乘法表**：

```c
#include <stdio.h>

/*
 * 使用 do-while 循环实现九九乘法表
 * 展示三种循环结构都可以实现相同的功能
 */

int main() {
    printf("======= 九九乘法表（do-while 循环实现）=======\n\n");

    int i = 1;
    do {
        int j = 1;
        do {
            printf("%d x %d = %2d  ", j, i, i * j);
            j++;
        } while (j <= i);
        printf("\n");
        i++;
    } while (i <= 9);

    return 0;
}
```

---

## 九、总结

本文详细介绍了C语言中流程控制的各个方面，涵盖了以下核心内容：

### 条件判断

- **if/else**：最基本的条件判断结构，支持单分支（if）、双分支（if-else）和多分支（if-else if-else）形式。注意"悬空 else"问题，始终使用花括号来明确代码结构。
- **switch-case**：适用于对同一个整型变量的多个离散值进行判断的场景。注意 `break` 的作用和 fall-through 行为，合理利用 fall-through 可以简化代码。
- **条件运算符 `?:`**：简洁的三元运算符，适合简单的二选一场景。

### 循环结构

- **for 循环**：最灵活、最常用的循环结构，内置初始化、条件判断和更新三个部分。特别适合循环次数已知的场景。
- **while 循环**：先判断后执行，适合循环次数不确定但由条件控制的场景。
- **do-while 循环**：先执行后判断，保证循环体至少执行一次，适合菜单驱动和输入验证等场景。

### 跳转语句

- **break**：终止当前循环（或 switch 语句），在嵌套循环中只跳出最内层循环。
- **continue**：跳过当前迭代的剩余部分，进入下一次迭代。在 while 循环中使用时需注意更新循环变量，避免无限循环。
- **goto**：无条件跳转语句，虽然现代编程实践中不推荐使用，但在跳出深层嵌套等特定场景下可以提高代码可读性。

### 关键要点

1. **始终使用花括号**：即使只有一条语句，也建议使用花括号包裹代码块，避免因缩进误导导致的逻辑错误。
2. **注意条件的顺序**：在多分支判断中，条件的排列顺序会影响程序的行为，务必从最严格的条件开始排列。
3. **避免无限循环**：确保循环有明确的退出条件，并在循环体内更新相关的变量。
4. **选择合适的循环结构**：根据具体场景选择 `for`、`while` 或 `do-while`，使代码意图清晰。
5. **谨慎使用 goto**：绝大多数情况下有更好的结构化替代方案，只在确实能提高可读性的场景下使用。
6. **理解嵌套循环的执行顺序**：外层循环每执行一次，内层循环完整执行一遍，这在分析时间复杂度和编写图案打印程序时非常重要。

### 实践建议

掌握了流控制的基础知识后，建议通过以下方式深化理解：

- 多写多练，尝试用不同的循环结构实现相同的功能，体会它们的差异。
- 分析经典算法（如排序、查找）中的流程控制，理解它们是如何组合使用的。
- 在调试器中单步执行代码，观察条件判断和循环跳转的实际执行过程。
- 阅读开源项目中的代码，学习有经验的开发者如何组织流程控制逻辑。

流程控制是编程的基石，理解了它，你就掌握了让程序"思考"和"决策"的能力。希望本文能帮助你建立扎实的C语言流程控制基础，为后续的学习和实践打下坚实的根基。
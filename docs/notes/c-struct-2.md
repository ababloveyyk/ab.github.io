---
title: C语言结构体与文件IOⅡ
date: 2026-07-26
tags:
  - C语言
  - 联合体
  - 枚举
  - 位域
categories:
  - C语言
---

# C语言结构体与文件IOⅡ——联合体与枚举

## 一、引言

在上一篇文章中，我们深入学习了C语言结构体的基础知识，包括定义声明、成员访问、结构体数组、嵌套结构体、typedef以及内存布局。结构体让我们能够将不同类型的数据组合在一起，但C语言还提供了另外两种强大的用户自定义类型：联合体（union）和枚举（enum）。

联合体允许多个成员共享同一块内存空间，在需要节省内存或实现类型转换的场景中非常有用。枚举为整型常量赋予有意义的名字，让代码更易读、更易维护。此外，位域（bit-field）允许我们精确控制结构体成员占用的位数，在嵌入式编程和网络协议解析中不可或缺。

本章将逐一讲解这些概念，每个知识点都配有完整可运行的代码示例，帮助你全面掌握这些C语言的高级特性。

---

## 二、联合体（union）的基础

### 2.1 联合体的定义与基本使用

联合体（union）是一种特殊的用户自定义类型，它的所有成员共享同一块内存空间。联合体的大小等于其最大成员的大小。在任意时刻，只有一个成员的值是有效的。联合体非常适合用于节省内存、类型转换、以及实现变体数据。

```c
#include <stdio.h>
#include <string.h>

/*
 * 联合体（union）基础
 * 所有成员共享同一块内存
 * 大小等于最大成员的大小
 */

// 定义一个联合体：同一块内存可以按不同方式解释
union Data {
    int    i;     // 4字节
    float  f;     // 4字节
    char   str[20]; // 20字节
};

// 联合体用于节省内存：一个变量可以表示多种类型
union Value {
    int    int_val;
    float  float_val;
    double double_val;
    char   char_val;
};

// 结构体+联合体：实现变体类型
typedef struct {
    int type;         // 0=int, 1=float, 2=string
    union {
        int    i;
        float  f;
        char   s[50];
    } data;
} Variant;

int main() {
    printf("========== 联合体基础 ==========\n\n");

    // 1. 联合体的大小
    printf("1. 联合体大小:\n");
    printf("  sizeof(union Data)  = %zu 字节\n", sizeof(union Data));
    printf("  sizeof(int)         = %zu 字节\n", sizeof(int));
    printf("  sizeof(float)       = %zu 字节\n", sizeof(float));
    printf("  sizeof(char[20])    = 20 字节\n");
    printf("  联合体大小 = 最大成员大小 = 20字节\n\n");

    // 2. 联合体的基本使用
    printf("2. 联合体基本使用:\n");
    union Data d;

    // 存储整数
    d.i = 42;
    printf("  d.i = %d (存储整数)\n", d.i);
    printf("  d.f = %f (此时读取浮点数是未定义行为)\n", d.f);

    // 存储浮点数（覆盖了之前的整数）
    d.f = 3.14159;
    printf("  d.f = %f (存储浮点数，覆盖了整数)\n", d.f);
    printf("  d.i = %d (此时读取整数是未定义行为)\n", d.i);

    // 存储字符串（覆盖了之前的浮点数）
    strcpy(d.str, "Hello Union!");
    printf("  d.str = \"%s\" (存储字符串，覆盖了浮点数)\n", d.str);
    printf("\n");

    // 3. 联合体成员的地址相同
    printf("3. 联合体成员地址:\n");
    printf("  &d.i   = %p\n", (void*)&d.i);
    printf("  &d.f   = %p\n", (void*)&d.f);
    printf("  &d.str = %p\n", (void*)&d.str);
    printf("  所有成员地址相同，因为它们共享同一块内存\n\n");

    // 4. 变体类型使用
    printf("4. 变体类型（Variant）:\n");

    Variant v1 = {0, .data.i = 100};
    Variant v2 = {1, .data.f = 3.14f};
    Variant v3 = {2, .data.s = "Hello"};

    Variant variants[] = {v1, v2, v3};
    for (int i = 0; i < 3; i++) {
        printf("  variants[%d]: type=%d, value=", i, variants[i].type);
        switch (variants[i].type) {
            case 0: printf("%d\n", variants[i].data.i); break;
            case 1: printf("%.2f\n", variants[i].data.f); break;
            case 2: printf("\"%s\"\n", variants[i].data.s); break;
            default: printf("unknown\n");
        }
    }

    return 0;
}
```

### 2.2 联合体的实际应用场景

联合体在实际编程中有多种经典应用场景。下面通过几个实用示例来展示联合体的威力。

```c
#include <stdio.h>
#include <stdint.h>
#include <string.h>

/*
 * 联合体实际应用场景
 */

// 场景1：类型转换（如浮点数与字节表示）
union FloatBytes {
    float    f;
    uint8_t  bytes[4];  // 查看浮点数的二进制表示
};

// 场景2：IP地址表示（IPv4）
union IPAddress {
    uint32_t addr;       // 32位整数表示
    uint8_t  octets[4];  // 4个字节表示
};

// 场景3：RGB颜色表示
union Color {
    uint32_t value;       // 32位颜色值
    struct {
        uint8_t b;        // 蓝色分量
        uint8_t g;        // 绿色分量
        uint8_t r;        // 红色分量
        uint8_t a;        // 透明度
    } components;
};

// 场景4：寄存器位访问（嵌入式常用）
union StatusRegister {
    uint8_t value;
    struct {
        uint8_t ready    : 1;  // bit 0
        uint8_t error    : 1;  // bit 1
        uint8_t busy     : 1;  // bit 2
        uint8_t reserved : 5;  // bit 3-7
    } bits;
};

// 场景5：数据包解析
union PacketHeader {
    uint32_t raw;
    struct {
        uint16_t length;   // 低16位：长度
        uint8_t  version;  // 位16-23：版本
        uint8_t  type;     // 位24-31：类型
    } fields;
};

int main() {
    printf("========== 联合体实际应用场景 ==========\n\n");

    // 场景1：查看浮点数的字节表示
    printf("场景1：浮点数字节表示\n");
    union FloatBytes fb;
    fb.f = 3.14159f;
    printf("  float: %.5f\n", fb.f);
    printf("  bytes: ");
    for (int i = 0; i < 4; i++) {
        printf("0x%02X ", fb.bytes[i]);
    }
    printf("\n\n");

    // 场景2：IP地址
    printf("场景2：IP地址表示\n");
    union IPAddress ip;
    ip.octets[0] = 192;
    ip.octets[1] = 168;
    ip.octets[2] = 1;
    ip.octets[3] = 100;
    printf("  IP: %d.%d.%d.%d\n",
           ip.octets[0], ip.octets[1], ip.octets[2], ip.octets[3]);
    printf("  整数表示: 0x%08X\n\n", ip.addr);

    // 场景3：RGB颜色
    printf("场景3：RGB颜色\n");
    union Color c;
    c.components.r = 0xFF;
    c.components.g = 0x80;
    c.components.b = 0x40;
    c.components.a = 0xFF;
    printf("  RGB(%d, %d, %d, %d)\n",
           c.components.r, c.components.g,
           c.components.b, c.components.a);
    printf("  32位值: 0x%08X\n\n", c.value);

    // 场景4：状态寄存器
    printf("场景4：状态寄存器\n");
    union StatusRegister sr;
    sr.value = 0;
    sr.bits.ready = 1;
    sr.bits.busy = 1;
    printf("  寄存器值: 0x%02X\n", sr.value);
    printf("  ready=%d, error=%d, busy=%d\n",
           sr.bits.ready, sr.bits.error, sr.bits.busy);
    printf("\n");

    // 场景5：数据包解析
    printf("场景5：数据包头部解析\n");
    union PacketHeader hdr;
    hdr.fields.length = 1024;
    hdr.fields.version = 2;
    hdr.fields.type = 0x80;
    printf("  原始值: 0x%08X\n", hdr.raw);
    printf("  length=%d, version=%d, type=0x%02X\n",
           hdr.fields.length, hdr.fields.version, hdr.fields.type);

    return 0;
}
```

### 2.3 大端小端判断

联合体是判断CPU字节序（大端/小端）的经典方法。理解字节序对于跨平台编程和网络通信至关重要。

```c
#include <stdio.h>
#include <stdint.h>

/*
 * 大端小端判断
 * 大端（Big-Endian）：高位字节存储在低地址
 * 小端（Little-Endian）：低位字节存储在低地址
 *
 * 例如：0x12345678
 *   大端：[12][34][56][78] (低地址 -> 高地址)
 *   小端：[78][56][34][12] (低地址 -> 高地址)
 */

// 方法1：使用联合体判断
union EndianChecker {
    uint32_t value;
    uint8_t  bytes[4];
};

// 方法2：使用指针强制转换
int is_little_endian_v2() {
    uint16_t value = 0x0001;
    return *(uint8_t*)&value == 1;
}

// 打印内存布局
void print_memory_bytes(const void* ptr, size_t size) {
    const uint8_t* bytes = (const uint8_t*)ptr;
    printf("  内存布局 (低地址->高地址): ");
    for (size_t i = 0; i < size; i++) {
        printf("0x%02X ", bytes[i]);
    }
    printf("\n");
}

// 大小端转换函数
uint16_t swap_uint16(uint16_t value) {
    return (value >> 8) | (value << 8);
}

uint32_t swap_uint32(uint32_t value) {
    return ((value >> 24) & 0xFF) |
           ((value >> 8)  & 0xFF00) |
           ((value << 8)  & 0xFF0000) |
           ((value << 24) & 0xFF000000);
}

// 网络字节序转换（网络字节序是大端）
uint32_t htonl_custom(uint32_t hostlong) {
    union EndianChecker ec;
    ec.value = 0x01020304;
    if (ec.bytes[0] == 0x01) {
        // 已经是小端，不需要转换
        // 等等，这里逻辑需要调整
        return hostlong;  // 大端，网络序也是大端，不转换
    } else {
        return swap_uint32(hostlong);  // 小端，转换为大端
    }
}

int main() {
    printf("========== 大端小端判断 ==========\n\n");

    // 方法1：联合体判断
    union EndianChecker ec;
    ec.value = 0x12345678;

    printf("值: 0x%08X\n", ec.value);
    print_memory_bytes(&ec.value, sizeof(ec.value));

    if (ec.bytes[0] == 0x78) {
        printf("结论: 小端模式 (Little-Endian)\n");
        printf("  低位字节0x78存储在低地址\n");
    } else if (ec.bytes[0] == 0x12) {
        printf("结论: 大端模式 (Big-Endian)\n");
        printf("  高位字节0x12存储在低地址\n");
    }
    printf("\n");

    // 方法2：指针判断
    printf("方法2（指针判断）:\n");
    printf("  is_little_endian = %s\n\n",
           is_little_endian_v2() ? "true (小端)" : "false (大端)");

    // 演示不同数据类型的字节序
    printf("不同数据类型的字节序:\n");

    printf("uint16_t 0xABCD:\n");
    uint16_t v16 = 0xABCD;
    print_memory_bytes(&v16, sizeof(v16));

    printf("uint32_t 0x12345678:\n");
    uint32_t v32 = 0x12345678;
    print_memory_bytes(&v32, sizeof(v32));

    printf("uint64_t 0x1122334455667788:\n");
    uint64_t v64 = 0x1122334455667788ULL;
    print_memory_bytes(&v64, sizeof(v64));

    // 字节序转换
    printf("\n字节序转换:\n");
    printf("  uint16_t 0xABCD -> swap: 0x%04X\n", swap_uint16(0xABCD));
    printf("  uint32_t 0x12345678 -> swap: 0x%08X\n", swap_uint32(0x12345678));

    // 网络字节序相关
    printf("\n网络字节序:\n");
    printf("  网络字节序 = 大端 (Big-Endian)\n");
    printf("  htonl(): 主机序 -> 网络序\n");
    printf("  ntohl(): 网络序 -> 主机序\n");
    printf("  在x86（小端）上，htonl会执行字节交换\n");
    printf("  在大端平台上，htonl是空操作\n");

    // 实际应用：结构体在网络传输中的字节序
    printf("\n实际应用：网络传输中的字节序\n");
    printf("  发送端：将数据转换为网络字节序（大端）\n");
    printf("    uint32_t net_value = htonl(host_value);\n");
    printf("  接收端：将网络字节序转换为主机字节序\n");
    printf("    uint32_t host_value = ntohl(net_value);\n");

    return 0;
}
```

---

## 三、枚举（enum）

### 3.1 枚举的定义与基本使用

枚举（enum）是一种为整型常量赋予有意义名字的方式。它使代码更加可读、可维护。枚举在C语言中被广泛用于表示状态、选项、错误码等。

```c
#include <stdio.h>

/*
 * 枚举（enum）基础
 * 枚举为整型常量赋予有意义的名字
 * 默认从0开始递增，也可以手动指定值
 */

// 基本枚举：星期
enum Weekday {
    MONDAY,     // 0
    TUESDAY,    // 1
    WEDNESDAY,  // 2
    THURSDAY,   // 3
    FRIDAY,     // 4
    SATURDAY,   // 5
    SUNDAY      // 6
};

// 手动指定值的枚举
enum ErrorCode {
    SUCCESS       = 0,
    ERR_FILE_NOT_FOUND = 1,
    ERR_PERMISSION = 2,
    ERR_MEMORY     = 100,
    ERR_NETWORK    = 200,
    ERR_UNKNOWN    = 999
};

// 使用typedef简化
typedef enum {
    COLOR_RED,
    COLOR_GREEN,
    COLOR_BLUE,
    COLOR_YELLOW,
    COLOR_PURPLE,
    COLOR_COUNT  // 利用枚举自动递增特性获取颜色数量
} Color;

// 枚举用于状态机
typedef enum {
    STATE_IDLE,        // 0
    STATE_RUNNING,     // 1
    STATE_PAUSED,      // 2
    STATE_STOPPED,     // 3
    STATE_ERROR        // 4
} State;

// 枚举用于位掩码标志
typedef enum {
    FLAG_NONE    = 0,
    FLAG_READ    = 1 << 0,  // 0x01
    FLAG_WRITE   = 1 << 1,  // 0x02
    FLAG_EXECUTE = 1 << 2,  // 0x04
    FLAG_DELETE  = 1 << 3,  // 0x08
    FLAG_ALL     = 0x0F     // 所有标志
} Permission;

int main() {
    printf("========== 枚举基础 ==========\n\n");

    // 1. 枚举值的输出
    printf("1. 枚举值:\n");
    printf("  MONDAY    = %d\n", MONDAY);
    printf("  TUESDAY   = %d\n", TUESDAY);
    printf("  WEDNESDAY = %d\n", WEDNESDAY);
    printf("  SUNDAY    = %d\n\n", SUNDAY);

    // 2. 手动指定值
    printf("2. 手动指定值:\n");
    printf("  SUCCESS          = %d\n", SUCCESS);
    printf("  ERR_FILE_NOT_FOUND = %d\n", ERR_FILE_NOT_FOUND);
    printf("  ERR_MEMORY       = %d\n", ERR_MEMORY);
    printf("  ERR_NETWORK      = %d\n", ERR_NETWORK);
    printf("  ERR_UNKNOWN      = %d\n\n", ERR_UNKNOWN);

    // 3. 使用枚举作为类型
    printf("3. 枚举变量:\n");
    Color my_color = COLOR_BLUE;
    printf("  my_color = %d (COLOR_BLUE)\n", my_color);

    // 使用COLOR_COUNT获取颜色数量
    printf("  COLOR_COUNT = %d\n", COLOR_COUNT);
    printf("  共有%d种颜色\n\n", COLOR_COUNT);

    // 4. 枚举与字符串映射
    printf("4. 枚举与字符串映射:\n");
    const char* color_names[] = {
        "红色", "绿色", "蓝色", "黄色", "紫色"
    };

    for (Color c = COLOR_RED; c < COLOR_COUNT; c++) {
        printf("  %d: %s\n", c, color_names[c]);
    }
    printf("\n");

    // 5. 位掩码标志
    printf("5. 位掩码标志:\n");
    Permission perm = FLAG_READ | FLAG_WRITE;
    printf("  perm = 0x%02X\n", perm);
    printf("  FLAG_READ    = 0x%02X\n", FLAG_READ);
    printf("  FLAG_WRITE   = 0x%02X\n", FLAG_WRITE);
    printf("  FLAG_EXECUTE = 0x%02X\n", FLAG_EXECUTE);

    // 检查权限
    printf("  检查权限:\n");
    printf("    has READ:    %s\n", (perm & FLAG_READ) ? "是" : "否");
    printf("    has WRITE:   %s\n", (perm & FLAG_WRITE) ? "是" : "否");
    printf("    has EXECUTE: %s\n", (perm & FLAG_EXECUTE) ? "是" : "否");

    // 添加权限
    perm |= FLAG_EXECUTE;
    printf("  添加EXECUTE后: 0x%02X\n", perm);

    // 移除权限
    perm &= ~FLAG_WRITE;
    printf("  移除WRITE后: 0x%02X\n", perm);

    return 0;
}
```

### 3.2 枚举与switch-case

枚举与switch-case是天作之合。使用枚举值作为switch的条件，结合编译器的-Wswitch警告，可以确保覆盖所有枚举值，避免遗漏。

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/*
 * 枚举与switch-case配合
 * 枚举使switch-case更加可读和安全
 */

// 定义操作类型
typedef enum {
    OP_ADD,
    OP_SUBTRACT,
    OP_MULTIPLY,
    OP_DIVIDE,
    OP_MODULO,
    OP_POWER,
    OP_COUNT  // 操作总数
} Operation;

// 定义菜单选项
typedef enum {
    MENU_NEW_GAME    = 1,
    MENU_CONTINUE    = 2,
    MENU_SETTINGS    = 3,
    MENU_HIGH_SCORES = 4,
    MENU_EXIT        = 5
} MenuOption;

// 定义HTTP状态码
typedef enum {
    HTTP_OK           = 200,
    HTTP_CREATED      = 201,
    HTTP_NO_CONTENT   = 204,
    HTTP_BAD_REQUEST  = 400,
    HTTP_UNAUTHORIZED = 401,
    HTTP_FORBIDDEN    = 403,
    HTTP_NOT_FOUND    = 404,
    HTTP_SERVER_ERROR = 500,
    HTTP_BAD_GATEWAY  = 502
} HttpStatus;

// 计算器函数
double calculate(Operation op, double a, double b) {
    switch (op) {
        case OP_ADD:
            return a + b;
        case OP_SUBTRACT:
            return a - b;
        case OP_MULTIPLY:
            return a * b;
        case OP_DIVIDE:
            if (b == 0) {
                printf("错误：除数不能为0\n");
                return 0;
            }
            return a / b;
        case OP_MODULO:
            return (int)a % (int)b;
        case OP_POWER: {
            double result = 1;
            for (int i = 0; i < (int)b; i++) {
                result *= a;
            }
            return result;
        }
        default:
            printf("未知操作\n");
            return 0;
    }
}

// 获取操作名称
const char* operation_name(Operation op) {
    switch (op) {
        case OP_ADD:      return "加法";
        case OP_SUBTRACT: return "减法";
        case OP_MULTIPLY: return "乘法";
        case OP_DIVIDE:   return "除法";
        case OP_MODULO:   return "取模";
        case OP_POWER:    return "乘方";
        default:          return "未知";
    }
}

// 获取HTTP状态描述
const char* http_status_description(HttpStatus status) {
    switch (status) {
        case HTTP_OK:           return "OK";
        case HTTP_CREATED:      return "Created";
        case HTTP_NO_CONTENT:   return "No Content";
        case HTTP_BAD_REQUEST:  return "Bad Request";
        case HTTP_UNAUTHORIZED: return "Unauthorized";
        case HTTP_FORBIDDEN:    return "Forbidden";
        case HTTP_NOT_FOUND:    return "Not Found";
        case HTTP_SERVER_ERROR: return "Internal Server Error";
        case HTTP_BAD_GATEWAY:  return "Bad Gateway";
        default:                return "Unknown Status";
    }
}

// 判断HTTP状态码类别
const char* http_status_category(HttpStatus status) {
    switch (status / 100) {
        case 2: return "成功";
        case 4: return "客户端错误";
        case 5: return "服务器错误";
        default: return "其他";
    }
}

int main() {
    printf("========== 枚举与switch-case ==========\n\n");

    // 1. 计算器演示
    printf("1. 枚举驱动的计算器:\n");
    double a = 10, b = 3;
    for (Operation op = OP_ADD; op < OP_COUNT; op++) {
        double result = calculate(op, a, b);
        printf("  %s: %.2f %s %.2f = %.2f\n",
               operation_name(op), a,
               op == OP_ADD ? "+" :
               op == OP_SUBTRACT ? "-" :
               op == OP_MULTIPLY ? "x" :
               op == OP_DIVIDE ? "/" :
               op == OP_MODULO ? "%" : "^",
               b, result);
    }
    printf("\n");

    // 2. HTTP状态码演示
    printf("2. HTTP状态码:\n");
    HttpStatus test_codes[] = {
        HTTP_OK, HTTP_NOT_FOUND, HTTP_SERVER_ERROR,
        HTTP_CREATED, HTTP_FORBIDDEN
    };
    int num_codes = sizeof(test_codes) / sizeof(test_codes[0]);

    for (int i = 0; i < num_codes; i++) {
        printf("  %d %s (%s)\n",
               test_codes[i],
               http_status_description(test_codes[i]),
               http_status_category(test_codes[i]));
    }
    printf("\n");

    // 3. 菜单系统演示
    printf("3. 菜单系统:\n");
    printf("  主菜单:\n");
    printf("    1. 新游戏\n");
    printf("    2. 继续\n");
    printf("    3. 设置\n");
    printf("    4. 排行榜\n");
    printf("    5. 退出\n");

    // 模拟菜单选择
    srand((unsigned int)time(NULL));
    MenuOption choice = (MenuOption)((rand() % 5) + 1);

    printf("\n  模拟选择: %d\n", choice);
    switch (choice) {
        case MENU_NEW_GAME:
            printf("  -> 开始新游戏!\n");
            break;
        case MENU_CONTINUE:
            printf("  -> 继续上次游戏\n");
            break;
        case MENU_SETTINGS:
            printf("  -> 打开设置界面\n");
            break;
        case MENU_HIGH_SCORES:
            printf("  -> 显示排行榜\n");
            break;
        case MENU_EXIT:
            printf("  -> 退出游戏\n");
            break;
        default:
            printf("  -> 无效选项\n");
    }

    printf("\n使用枚举的好处:\n");
    printf("  1. 编译器可以检查switch是否覆盖所有枚举值\n");
    printf("  2. 代码可读性大幅提升\n");
    printf("  3. 修改枚举值时，编译器会提示所有使用位置\n");
    printf("  4. 避免魔法数字（magic numbers）\n");

    return 0;
}
```

### 3.3 枚举的高级用法

枚举不仅可以表示简单的常量集合，还可以用于实现状态机、策略模式、错误处理等高级编程模式。

```c
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/*
 * 枚举高级用法
 * 状态机、策略模式、错误处理
 */

// 状态机：TCP连接状态
typedef enum {
    TCP_CLOSED,
    TCP_LISTEN,
    TCP_SYN_SENT,
    TCP_SYN_RECEIVED,
    TCP_ESTABLISHED,
    TCP_FIN_WAIT_1,
    TCP_FIN_WAIT_2,
    TCP_CLOSE_WAIT,
    TCP_CLOSING,
    TCP_LAST_ACK,
    TCP_TIME_WAIT
} TcpState;

// 状态机事件
typedef enum {
    EVENT_PASSIVE_OPEN,
    EVENT_ACTIVE_OPEN,
    EVENT_SYN,
    EVENT_SYN_ACK,
    EVENT_ACK,
    EVENT_FIN,
    EVENT_CLOSE,
    EVENT_TIMEOUT
} TcpEvent;

// 策略模式：排序算法
typedef enum {
    SORT_QUICK,
    SORT_MERGE,
    SORT_BUBBLE,
    SORT_INSERTION,
    SORT_SELECTION
} SortAlgorithm;

// 错误处理：日志级别
typedef enum {
    LOG_DEBUG   = 0,
    LOG_INFO    = 1,
    LOG_WARNING = 2,
    LOG_ERROR   = 3,
    LOG_FATAL   = 4
} LogLevel;

// 日志系统
typedef struct {
    LogLevel min_level;
    int      message_count;
} Logger;

void logger_init(Logger* logger, LogLevel min_level) {
    logger->min_level = min_level;
    logger->message_count = 0;
}

void logger_log(Logger* logger, LogLevel level, const char* message) {
    if (level < logger->min_level) return;

    const char* level_str[] = {
        "DEBUG", "INFO", "WARNING", "ERROR", "FATAL"
    };

    printf("[%s] %s\n", level_str[level], message);
    logger->message_count++;
}

// TCP状态机处理
const char* tcp_state_name(TcpState state) {
    switch (state) {
        case TCP_CLOSED:       return "CLOSED";
        case TCP_LISTEN:       return "LISTEN";
        case TCP_SYN_SENT:     return "SYN_SENT";
        case TCP_SYN_RECEIVED: return "SYN_RECEIVED";
        case TCP_ESTABLISHED:  return "ESTABLISHED";
        case TCP_FIN_WAIT_1:   return "FIN_WAIT_1";
        case TCP_FIN_WAIT_2:   return "FIN_WAIT_2";
        case TCP_CLOSE_WAIT:   return "CLOSE_WAIT";
        case TCP_CLOSING:      return "CLOSING";
        case TCP_LAST_ACK:     return "LAST_ACK";
        case TCP_TIME_WAIT:    return "TIME_WAIT";
        default:               return "UNKNOWN";
    }
}

// 简化的状态转换
TcpState tcp_state_machine(TcpState current, TcpEvent event) {
    switch (current) {
        case TCP_CLOSED:
            if (event == EVENT_PASSIVE_OPEN) return TCP_LISTEN;
            if (event == EVENT_ACTIVE_OPEN)  return TCP_SYN_SENT;
            break;

        case TCP_LISTEN:
            if (event == EVENT_SYN) return TCP_SYN_RECEIVED;
            if (event == EVENT_CLOSE) return TCP_CLOSED;
            break;

        case TCP_SYN_SENT:
            if (event == EVENT_SYN_ACK) return TCP_ESTABLISHED;
            if (event == EVENT_CLOSE) return TCP_CLOSED;
            break;

        case TCP_SYN_RECEIVED:
            if (event == EVENT_ACK) return TCP_ESTABLISHED;
            break;

        case TCP_ESTABLISHED:
            if (event == EVENT_FIN) return TCP_FIN_WAIT_1;
            if (event == EVENT_CLOSE) return TCP_FIN_WAIT_1;
            break;

        case TCP_FIN_WAIT_1:
            if (event == EVENT_ACK) return TCP_FIN_WAIT_2;
            if (event == EVENT_FIN) return TCP_CLOSING;
            break;

        case TCP_FIN_WAIT_2:
            if (event == EVENT_FIN) return TCP_TIME_WAIT;
            break;

        case TCP_TIME_WAIT:
            if (event == EVENT_TIMEOUT) return TCP_CLOSED;
            break;

        default:
            break;
    }
    return current;  // 状态不变
}

int main() {
    printf("========== 枚举高级用法 ==========\n\n");

    // 1. 日志系统演示
    printf("1. 日志系统:\n");
    Logger logger;
    logger_init(&logger, LOG_INFO);  // 过滤掉DEBUG消息

    logger_log(&logger, LOG_DEBUG, "这是一条调试消息（不会显示）");
    logger_log(&logger, LOG_INFO, "系统启动完成");
    logger_log(&logger, LOG_WARNING, "磁盘空间不足");
    logger_log(&logger, LOG_ERROR, "连接数据库失败");
    logger_log(&logger, LOG_FATAL, "系统崩溃！");

    printf("  总消息数: %d (DEBUG被过滤)\n\n", logger.message_count);

    // 2. TCP状态机演示
    printf("2. TCP状态机:\n");
    printf("  模拟TCP连接建立过程:\n");

    TcpState state = TCP_CLOSED;
    printf("  初始状态: %s\n", tcp_state_name(state));

    state = tcp_state_machine(state, EVENT_ACTIVE_OPEN);
    printf("  -> 主动打开: %s\n", tcp_state_name(state));

    state = tcp_state_machine(state, EVENT_SYN_ACK);
    printf("  -> 收到SYN-ACK: %s\n", tcp_state_name(state));

    printf("  TCP连接已建立!\n\n");

    // 3. 排序算法策略演示
    printf("3. 排序算法策略:\n");
    printf("  可用算法:\n");
    printf("    SORT_QUICK     = %d (快速排序)\n", SORT_QUICK);
    printf("    SORT_MERGE     = %d (归并排序)\n", SORT_MERGE);
    printf("    SORT_BUBBLE    = %d (冒泡排序)\n", SORT_BUBBLE);
    printf("    SORT_INSERTION = %d (插入排序)\n", SORT_INSERTION);
    printf("    SORT_SELECTION = %d (选择排序)\n", SORT_SELECTION);

    printf("\n  策略模式思路:\n");
    printf("    1. 定义排序算法枚举\n");
    printf("    2. 每种算法实现为独立函数\n");
    printf("    3. 统一的排序接口根据枚举值调度\n");
    printf("    4. 运行时可以切换算法\n");

    return 0;
}
```

---

## 四、位域（bit-field）

### 4.1 位域的基本使用

位域（bit-field）允许我们精确指定结构体成员占用的位数。这在嵌入式编程、网络协议解析、硬件寄存器访问、以及需要节省内存的场景中非常有用。

```c
#include <stdio.h>
#include <stdint.h>

/*
 * 位域（bit-field）基础
 * 允许精确控制每个成员占用的位数
 * 成员必须是整数类型（int, unsigned int, signed int）
 */

// 基本位域：日期表示
struct DatePacked {
    unsigned int day   : 5;   // 1-31，需要5位（2^5=32）
    unsigned int month : 4;   // 1-12，需要4位（2^4=16）
    unsigned int year  : 11;  // 0-2047，需要11位（2^11=2048）
    // 总共: 5+4+11 = 20位
};

// 位域用于状态标志
struct Flags {
    unsigned int ready    : 1;
    unsigned int enabled  : 1;
    unsigned int error    : 1;
    unsigned int overflow : 1;
    unsigned int reserved : 4;  // 保留4位
    // 总共: 8位 = 1字节
};

// 位域用于IP头
struct IPHeader {
    unsigned int version   : 4;   // IP版本
    unsigned int ihl       : 4;   // 头部长度
    unsigned int dscp      : 6;   // 服务类型
    unsigned int ecn       : 2;   // 拥塞通知
    unsigned int total_len : 16;  // 总长度
    // 总共: 4+4+6+2+16 = 32位 = 4字节
};

// 位域用于颜色表示（RGB565）
struct RGB565 {
    unsigned int blue  : 5;   // 蓝色分量 (0-31)
    unsigned int green : 6;   // 绿色分量 (0-63)
    unsigned int red   : 5;   // 红色分量 (0-31)
    // 总共: 16位
};

// 联合体+位域：寄存器访问
union Register {
    uint32_t value;
    struct {
        uint32_t enable     : 1;   // bit 0
        uint32_t mode       : 2;   // bit 1-2
        uint32_t prescaler  : 3;   // bit 3-5
        uint32_t interrupt  : 1;   // bit 6
        uint32_t reserved   : 25;  // bit 7-31
    } bits;
};

int main() {
    printf("========== 位域基础 ==========\n\n");

    // 1. 日期位域
    printf("1. 日期位域:\n");
    struct DatePacked date;
    date.day = 26;
    date.month = 7;
    date.year = 2026;
    printf("  日期: %d-%d-%d\n", date.year, date.month, date.day);
    printf("  sizeof(struct DatePacked) = %zu 字节\n",
           sizeof(struct DatePacked));
    printf("  (对比: 3个int需要12字节，位域只需4字节)\n\n");

    // 2. 状态标志
    printf("2. 状态标志:\n");
    struct Flags f;
    f.ready = 1;
    f.enabled = 0;
    f.error = 1;
    f.overflow = 0;
    f.reserved = 0;

    printf("  位域值:\n");
    printf("    ready    = %u\n", f.ready);
    printf("    enabled  = %u\n", f.enabled);
    printf("    error    = %u\n", f.error);
    printf("    overflow = %u\n", f.overflow);
    printf("  sizeof(struct Flags) = %zu 字节\n", sizeof(struct Flags));
    printf("  (8个标志位只需1字节)\n\n");

    // 3. IP头解析
    printf("3. IP头位域:\n");
    struct IPHeader ip;
    ip.version = 4;     // IPv4
    ip.ihl = 5;         // 20字节头部
    ip.dscp = 0;        // 默认服务
    ip.ecn = 0;         // 无拥塞
    ip.total_len = 1500;

    printf("  Version: %u\n", ip.version);
    printf("  IHL: %u (%u字节)\n", ip.ihl, ip.ihl * 4);
    printf("  DSCP: %u\n", ip.dscp);
    printf("  ECN: %u\n", ip.ecn);
    printf("  Total Length: %u\n", ip.total_len);
    printf("  sizeof(struct IPHeader) = %zu 字节\n\n", sizeof(struct IPHeader));

    // 4. RGB565颜色
    printf("4. RGB565颜色:\n");
    struct RGB565 color;
    color.red = 31;    // 最大值 (0-31)
    color.green = 0;   // 最小值
    color.blue = 31;   // 最大值

    printf("  R=%u, G=%u, B=%u (紫色)\n", color.red, color.green, color.blue);
    printf("  sizeof(struct RGB565) = %zu 字节\n\n", sizeof(struct RGB565));

    // 5. 寄存器访问
    printf("5. 寄存器位域:\n");
    union Register reg;
    reg.value = 0;  // 清零

    reg.bits.enable = 1;
    reg.bits.mode = 2;        // 二进制10
    reg.bits.prescaler = 4;   // 二进制100
    reg.bits.interrupt = 1;

    printf("  寄存器值: 0x%08X\n", reg.value);
    printf("  位域解析:\n");
    printf("    enable    = %u\n", reg.bits.enable);
    printf("    mode      = %u\n", reg.bits.mode);
    printf("    prescaler = %u\n", reg.bits.prescaler);
    printf("    interrupt = %u\n", reg.bits.interrupt);

    // 位域的限制
    printf("\n位域注意事项:\n");
    printf("  1. 不能取位域成员的地址（&f.ready 非法）\n");
    printf("  2. 位域不能跨越类型边界\n");
    printf("  3. 不同编译器的位域布局可能不同\n");
    printf("  4. 位域的可移植性需要注意\n");
    printf("  5. 使用unsigned int确保最高位不被解释为符号位\n");

    return 0;
}
```

### 4.2 位域的实际应用

位域在嵌入式系统、网络协议、文件格式解析等领域有广泛应用。下面通过几个实际案例来展示位域的实战价值。

```c
#include <stdio.h>
#include <stdint.h>
#include <string.h>

/*
 * 位域实际应用
 * 嵌入式系统、网络协议、文件格式
 */

// 应用1：TCP标志位
union TCPFlags {
    uint8_t value;
    struct {
        uint8_t fin : 1;
        uint8_t syn : 1;
        uint8_t rst : 1;
        uint8_t psh : 1;
        uint8_t ack : 1;
        uint8_t urg : 1;
        uint8_t ece : 1;
        uint8_t cwr : 1;
    } bits;
};

// 应用2：CAN总线帧格式
struct CANFrame {
    unsigned int id       : 11;  // 标准标识符
    unsigned int rtr      : 1;   // 远程传输请求
    unsigned int ide      : 1;   // 标识符扩展
    unsigned int reserved : 1;   // 保留
    unsigned int dlc      : 4;   // 数据长度码
    uint8_t      data[8];        // 数据
};

// 应用3：文件权限（Linux风格）
struct FilePermissions {
    unsigned int other_exec  : 1;
    unsigned int other_write : 1;
    unsigned int other_read  : 1;
    unsigned int group_exec  : 1;
    unsigned int group_write : 1;
    unsigned int group_read  : 1;
    unsigned int owner_exec  : 1;
    unsigned int owner_write : 1;
    unsigned int owner_read  : 1;
    unsigned int setuid      : 1;
    unsigned int setgid      : 1;
    unsigned int sticky      : 1;
};

// 应用4：UTF-8编码头解析
union UTF8Header {
    uint8_t byte;
    struct {
        uint8_t payload : 5;  // 数据位
        uint8_t header  : 3;  // 头部标识位
    } fields;
};

// 应用5：浮点数IEEE 754格式解析
union FloatIEEE754 {
    float f;
    struct {
        uint32_t mantissa : 23;  // 尾数
        uint32_t exponent : 8;   // 指数
        uint32_t sign     : 1;   // 符号位
    } parts;
    uint32_t raw;
};

// 打印TCP标志
void print_tcp_flags(union TCPFlags flags) {
    printf("  TCP标志: 0x%02X\n", flags.value);
    if (flags.bits.fin) printf("  - FIN\n");
    if (flags.bits.syn) printf("  - SYN\n");
    if (flags.bits.rst) printf("  - RST\n");
    if (flags.bits.psh) printf("  - PSH\n");
    if (flags.bits.ack) printf("  - ACK\n");
    if (flags.bits.urg) printf("  - URG\n");
    if (flags.bits.ece) printf("  - ECE\n");
    if (flags.bits.cwr) printf("  - CWR\n");
}

// 打印文件权限
void print_permissions(struct FilePermissions p) {
    printf("  Owner:  ");
    printf("%c", p.owner_read ? 'r' : '-');
    printf("%c", p.owner_write ? 'w' : '-');
    printf("%c", p.owner_exec ? 'x' : '-');
    printf("\n");

    printf("  Group:  ");
    printf("%c", p.group_read ? 'r' : '-');
    printf("%c", p.group_write ? 'w' : '-');
    printf("%c", p.group_exec ? 'x' : '-');
    printf("\n");

    printf("  Other:  ");
    printf("%c", p.other_read ? 'r' : '-');
    printf("%c", p.other_write ? 'w' : '-');
    printf("%c", p.other_exec ? 'x' : '-');
    printf("\n");

    printf("  Special: setuid=%d setgid=%d sticky=%d\n",
           p.setuid, p.setgid, p.sticky);
}

int main() {
    printf("========== 位域实际应用 ==========\n\n");

    // 1. TCP标志
    printf("1. TCP标志位:\n");
    union TCPFlags tcp;
    tcp.value = 0;
    tcp.bits.syn = 1;
    tcp.bits.ack = 0;
    printf("  SYN包:\n");
    print_tcp_flags(tcp);

    printf("\n  SYN-ACK包:\n");
    tcp.bits.ack = 1;
    print_tcp_flags(tcp);

    printf("\n  FIN-ACK包:\n");
    tcp.bits.syn = 0;
    tcp.bits.fin = 1;
    print_tcp_flags(tcp);
    printf("\n");

    // 2. CAN帧
    printf("2. CAN总线帧:\n");
    struct CANFrame can;
    memset(&can, 0, sizeof(can));
    can.id = 0x123;
    can.dlc = 8;
    for (int i = 0; i < 8; i++) can.data[i] = i * 10;

    printf("  ID: 0x%03X\n", can.id);
    printf("  RTR: %u\n", can.rtr);
    printf("  DLC: %u\n", can.dlc);
    printf("  Data: ");
    for (int i = 0; i < can.dlc; i++) printf("0x%02X ", can.data[i]);
    printf("\n");
    printf("  sizeof(CANFrame) = %zu 字节\n\n", sizeof(struct CANFrame));

    // 3. 文件权限
    printf("3. 文件权限（Linux风格）:\n");
    struct FilePermissions perm;
    memset(&perm, 0, sizeof(perm));
    perm.owner_read = 1;
    perm.owner_write = 1;
    perm.owner_exec = 1;
    perm.group_read = 1;
    perm.group_exec = 1;
    perm.other_read = 1;

    printf("  权限: rwxr-xr-- (755)\n");
    print_permissions(perm);
    printf("\n");

    // 4. IEEE 754浮点数解析
    printf("4. IEEE 754浮点数解析:\n");
    union FloatIEEE754 num;
    num.f = -3.14f;

    printf("  浮点数: %.4f\n", num.f);
    printf("  原始值: 0x%08X\n", num.raw);
    printf("  符号位: %u (%s)\n",
           num.parts.sign, num.parts.sign ? "负数" : "正数");
    printf("  指数: %u (实际指数 = %d)\n",
           num.parts.exponent, (int)num.parts.exponent - 127);
    printf("  尾数: 0x%06X\n", num.parts.mantissa);

    // 手动构造浮点数: 1.0
    union FloatIEEE754 one;
    one.parts.sign = 0;
    one.parts.exponent = 127;  // 偏移127
    one.parts.mantissa = 0;    // 尾数为0
    printf("\n  构造的1.0: %.1f\n", one.f);

    return 0;
}
```

---

## 五、结构体字节对齐详解

### 5.1 #pragma pack 详解

`#pragma pack` 是控制结构体对齐方式的编译器指令。在默认情况下，结构体成员按照其自然对齐边界对齐。使用 `#pragma pack(n)` 可以设置对齐边界为n字节（n通常为1、2、4、8、16），从而控制结构体的内存布局。

```c
#include <stdio.h>
#include <stddef.h>

/*
 * #pragma pack 详解
 * 控制结构体的对齐方式
 * 用于精确控制内存布局
 */

// 默认对齐（通常是8字节或4字节）
struct DefaultAligned {
    char   c;   // 1字节
    int    i;   // 4字节
    double d;   // 8字节
    short  s;   // 2字节
};

// 1字节对齐（紧凑排列）
#pragma pack(push, 1)
struct Packed1 {
    char   c;   // 1字节
    int    i;   // 4字节
    double d;   // 8字节
    short  s;   // 2字节
};
#pragma pack(pop)

// 2字节对齐
#pragma pack(push, 2)
struct Packed2 {
    char   c;
    int    i;
    double d;
    short  s;
};
#pragma pack(pop)

// 4字节对齐
#pragma pack(push, 4)
struct Packed4 {
    char   c;
    int    i;
    double d;
    short  s;
};
#pragma pack(pop)

// 8字节对齐（等同于默认对齐）
#pragma pack(push, 8)
struct Packed8 {
    char   c;
    int    i;
    double d;
    short  s;
};
#pragma pack(pop)

// 不同对齐方式对嵌套结构体的影响
#pragma pack(push, 1)
struct Inner {
    char  a;
    int   b;
};
#pragma pack(pop)

struct Outer {
    char        x;
    struct Inner inner;
    int         y;
};

// 函数：打印结构体布局信息
void print_struct_layout(const char* name, size_t size,
                         const char* member_names[],
                         size_t offsets[], int count) {
    printf("%s (sizeof=%zu):\n", name, size);
    for (int i = 0; i < count; i++) {
        printf("  %s: offset=%zu\n", member_names[i], offsets[i]);
    }
    printf("\n");
}

int main() {
    printf("========== #pragma pack 详解 ==========\n\n");

    // 打印各对齐方式的大小
    printf("1. 不同对齐方式的结构体大小:\n\n");

    printf("  默认对齐:\n");
    printf("    sizeof(DefaultAligned) = %zu 字节\n", sizeof(struct DefaultAligned));
    printf("    offsetof(c) = %zu\n", offsetof(struct DefaultAligned, c));
    printf("    offsetof(i) = %zu\n", offsetof(struct DefaultAligned, i));
    printf("    offsetof(d) = %zu\n", offsetof(struct DefaultAligned, d));
    printf("    offsetof(s) = %zu\n\n", offsetof(struct DefaultAligned, s));

    printf("  #pragma pack(1):\n");
    printf("    sizeof(Packed1) = %zu 字节\n", sizeof(struct Packed1));
    printf("    offsetof(c) = %zu\n", offsetof(struct Packed1, c));
    printf("    offsetof(i) = %zu\n", offsetof(struct Packed1, i));
    printf("    offsetof(d) = %zu\n", offsetof(struct Packed1, d));
    printf("    offsetof(s) = %zu\n\n", offsetof(struct Packed1, s));

    printf("  #pragma pack(2):\n");
    printf("    sizeof(Packed2) = %zu 字节\n", sizeof(struct Packed2));
    printf("    offsetof(c) = %zu\n", offsetof(struct Packed2, c));
    printf("    offsetof(i) = %zu\n", offsetof(struct Packed2, i));
    printf("    offsetof(d) = %zu\n", offsetof(struct Packed2, d));
    printf("    offsetof(s) = %zu\n\n", offsetof(struct Packed2, s));

    printf("  #pragma pack(4):\n");
    printf("    sizeof(Packed4) = %zu 字节\n", sizeof(struct Packed4));
    printf("    offsetof(c) = %zu\n", offsetof(struct Packed4, c));
    printf("    offsetof(i) = %zu\n", offsetof(struct Packed4, i));
    printf("    offsetof(d) = %zu\n", offsetof(struct Packed4, d));
    printf("    offsetof(s) = %zu\n\n", offsetof(struct Packed4, s));

    printf("  #pragma pack(8):\n");
    printf("    sizeof(Packed8) = %zu 字节\n", sizeof(struct Packed8));
    printf("    offsetof(c) = %zu\n", offsetof(struct Packed8, c));
    printf("    offsetof(i) = %zu\n", offsetof(struct Packed8, i));
    printf("    offsetof(d) = %zu\n", offsetof(struct Packed8, d));
    printf("    offsetof(s) = %zu\n\n", offsetof(struct Packed8, s));

    // 总结对比
    printf("2. 对齐方式对比:\n");
    printf("  %-12s %-8s\n", "对齐方式", "sizeof");
    printf("  ------------------------\n");
    printf("  %-12s %-8zu\n", "默认", sizeof(struct DefaultAligned));
    printf("  %-12s %-8zu\n", "pack(1)", sizeof(struct Packed1));
    printf("  %-12s %-8zu\n", "pack(2)", sizeof(struct Packed2));
    printf("  %-12s %-8zu\n", "pack(4)", sizeof(struct Packed4));
    printf("  %-12s %-8zu\n", "pack(8)", sizeof(struct Packed8));

    printf("\n3. #pragma pack 使用场景:\n");
    printf("  - 网络协议数据包解析\n");
    printf("  - 二进制文件格式读写\n");
    printf("  - 与硬件寄存器映射\n");
    printf("  - 跨平台数据交换\n");
    printf("  - 嵌入式系统内存优化\n\n");

    printf("4. 注意事项:\n");
    printf("  - 使用#pragma pack(push, n)保存当前设置\n");
    printf("  - 使用#pragma pack(pop)恢复之前的设置\n");
    printf("  - 紧凑排列可能导致非对齐访问，影响性能\n");
    printf("  - 某些平台不支持非对齐访问\n");
    printf("  - 不同编译器对#pragma pack的支持可能不同\n");

    return 0;
}
```

### 5.2 对齐策略与最佳实践

理解内存对齐规则后，我们应该在代码中应用这些知识。本节总结了对齐相关的策略和最佳实践，帮助你在实际开发中做出正确的选择。

```c
#include <stdio.h>
#include <stddef.h>
#include <stdalign.h>

/*
 * 对齐策略与最佳实践
 */

// 最佳实践1：按对齐要求降序排列成员
struct GoodLayout {
    double d;    // 8字节 (对齐8)
    void*  p;    // 8字节 (对齐8)
    long   l;    // 8字节 (对齐8)
    int    i;    // 4字节 (对齐4)
    short  s;    // 2字节 (对齐2)
    char   c1;   // 1字节
    char   c2;   // 1字节
    // 末尾填充到8的倍数
};

// 不好的布局：成员交错排列
struct BadLayout {
    char   c1;   // 1字节
    double d;    // 8字节 -> 需要填充7字节
    char   c2;   // 1字节
    int    i;    // 4字节 -> 需要填充3字节
    short  s;    // 2字节
    void*  p;    // 8字节 -> 需要填充6字节
    long   l;    // 8字节
};

// 最佳实践2：使用alignas指定对齐
struct AlignedStruct {
    char c;
    alignas(16) int i;  // 强制16字节对齐
    double d;
};

// 最佳实践3：使用alignof查询对齐要求
// 最佳实践4：使用C11的_Alignas和_Alignof

// 最佳实践5：使用静态断言验证对齐
_Static_assert(sizeof(struct GoodLayout) <= 48,
               "GoodLayout size is too large");

int main() {
    printf("========== 对齐策略与最佳实践 ==========\n\n");

    // 1. 对比好的布局和坏的布局
    printf("1. 布局对比:\n\n");

    printf("GoodLayout (降序排列):\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct GoodLayout));
    printf("  offsetof(d)  = %zu\n", offsetof(struct GoodLayout, d));
    printf("  offsetof(p)  = %zu\n", offsetof(struct GoodLayout, p));
    printf("  offsetof(l)  = %zu\n", offsetof(struct GoodLayout, l));
    printf("  offsetof(i)  = %zu\n", offsetof(struct GoodLayout, i));
    printf("  offsetof(s)  = %zu\n", offsetof(struct GoodLayout, s));
    printf("  offsetof(c1) = %zu\n", offsetof(struct GoodLayout, c1));
    printf("  offsetof(c2) = %zu\n\n", offsetof(struct GoodLayout, c2));

    printf("BadLayout (交错排列):\n");
    printf("  sizeof = %zu 字节\n", sizeof(struct BadLayout));
    printf("  offsetof(c1) = %zu\n", offsetof(struct BadLayout, c1));
    printf("  offsetof(d)  = %zu\n", offsetof(struct BadLayout, d));
    printf("  offsetof(c2) = %zu\n", offsetof(struct BadLayout, c2));
    printf("  offsetof(i)  = %zu\n", offsetof(struct BadLayout, i));
    printf("  offsetof(s)  = %zu\n", offsetof(struct BadLayout, s));
    printf("  offsetof(p)  = %zu\n", offsetof(struct BadLayout, p));
    printf("  offsetof(l)  = %zu\n\n", offsetof(struct BadLayout, l));

    printf("  节省内存: %zu 字节\n",
           sizeof(struct BadLayout) - sizeof(struct GoodLayout));

    // 2. alignas和alignof
    printf("\n2. alignas和alignof:\n");
    printf("  alignof(char)   = %zu\n", alignof(char));
    printf("  alignof(short)  = %zu\n", alignof(short));
    printf("  alignof(int)    = %zu\n", alignof(int));
    printf("  alignof(long)   = %zu\n", alignof(long));
    printf("  alignof(double) = %zu\n", alignof(double));
    printf("  alignof(void*)  = %zu\n", alignof(void*));

    printf("\n  struct AlignedStruct:\n");
    printf("  sizeof  = %zu\n", sizeof(struct AlignedStruct));
    printf("  alignof = %zu\n", alignof(struct AlignedStruct));
    printf("  offsetof(c) = %zu\n", offsetof(struct AlignedStruct, c));
    printf("  offsetof(i) = %zu (16字节对齐)\n",
           offsetof(struct AlignedStruct, i));
    printf("  offsetof(d) = %zu\n", offsetof(struct AlignedStruct, d));

    // 3. 最佳实践总结
    printf("\n3. 对齐最佳实践总结:\n");
    printf("  a) 按对齐要求从大到小排列成员\n");
    printf("  b) 将相同类型的成员放在一起\n");
    printf("  c) 使用offsetof验证关键成员的偏移量\n");
    printf("  d) 使用sizeof而非手动计算\n");
    printf("  e) 使用_Static_assert验证结构体大小\n");
    printf("  f) 使用alignas指定特殊对齐需求\n");
    printf("  g) 使用alignof获取对齐信息\n");
    printf("  h) 考虑填充成员（char pad[3]）来显式标注填充\n");
    printf("  i) 结构体数组的对齐和单个结构体一致\n");
    printf("  j) 动态分配的内存（malloc）保证适合任何类型\n");

    return 0;
}
```

---

## 六、综合实战：协议解析器

### 6.1 二进制协议解析器

结合联合体、枚举、位域和#pragma pack，我们可以实现一个完整的二进制协议解析器。这个解析器能够处理网络通信中常见的二进制协议格式。

```c
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

/*
 * 综合实战：二进制协议解析器
 * 综合运用联合体、枚举、位域、结构体对齐
 */

// 协议定义
typedef enum {
    PKT_TYPE_DATA      = 0x01,
    PKT_TYPE_ACK       = 0x02,
    PKT_TYPE_HEARTBEAT = 0x03,
    PKT_TYPE_ERROR     = 0xFF
} PacketType;

// 协议标志位
typedef enum {
    PKT_FLAG_NONE     = 0x00,
    PKT_FLAG_ENCRYPTED = 0x01,
    PKT_FLAG_COMPRESSED = 0x02,
    PKT_FLAG_URGENT   = 0x04,
    PKT_FLAG_FRAGMENTED = 0x08
} PacketFlags;

// 协议头部（使用位域和紧凑排列）
#pragma pack(push, 1)
typedef struct {
    uint8_t  sync_byte;     // 同步字节: 0xAA
    uint8_t  version : 4;   // 协议版本
    uint8_t  type    : 4;   // 包类型
    uint8_t  flags;         // 标志位
    uint16_t payload_len;   // 有效载荷长度
    uint16_t sequence;      // 序列号
    uint32_t timestamp;     // 时间戳
    uint16_t checksum;      // 校验和
} PacketHeader;

// 数据包
typedef struct {
    PacketHeader header;
    uint8_t*     payload;  // 动态分配的有效载荷
} Packet;

// ACK包体
typedef struct {
    uint16_t ack_sequence;  // 确认的序列号
    uint8_t  status;        // 状态码
} AckBody;

// 错误包体
typedef struct {
    uint16_t error_code;
    char     error_msg[32];
} ErrorBody;
#pragma pack(pop)

// 计算校验和（简单异或）
uint16_t calculate_checksum(const uint8_t* data, size_t len) {
    uint16_t checksum = 0;
    for (size_t i = 0; i < len; i++) {
        checksum ^= data[i];
    }
    return checksum;
}

// 创建数据包
Packet* packet_create_data(uint16_t seq, const uint8_t* payload,
                           size_t payload_len, PacketFlags flags) {
    Packet* pkt = (Packet*)malloc(sizeof(Packet));
    if (!pkt) return NULL;

    // 初始化头部
    memset(&pkt->header, 0, sizeof(PacketHeader));
    pkt->header.sync_byte = 0xAA;
    pkt->header.version = 1;
    pkt->header.type = PKT_TYPE_DATA;
    pkt->header.flags = flags;
    pkt->header.payload_len = payload_len;
    pkt->header.sequence = seq;
    pkt->header.timestamp = (uint32_t)time(NULL);

    // 分配并复制有效载荷
    pkt->payload = (uint8_t*)malloc(payload_len);
    if (!pkt->payload) {
        free(pkt);
        return NULL;
    }
    memcpy(pkt->payload, payload, payload_len);

    // 计算校验和
    pkt->header.checksum = calculate_checksum(
        (const uint8_t*)&pkt->header,
        sizeof(PacketHeader) - sizeof(uint16_t));

    return pkt;
}

// 创建ACK包
Packet* packet_create_ack(uint16_t seq, uint16_t ack_seq, uint8_t status) {
    AckBody ack_body = {ack_seq, status};
    return packet_create_data(seq, (const uint8_t*)&ack_body,
                              sizeof(AckBody), PKT_FLAG_NONE);
}

// 解析数据包
void packet_parse(const Packet* pkt) {
    printf("========== 数据包解析 ==========\n");

    printf("同步字节: 0x%02X %s\n",
           pkt->header.sync_byte,
           pkt->header.sync_byte == 0xAA ? "(有效)" : "(无效!)");

    printf("版本: %u\n", pkt->header.version);

    printf("类型: ");
    switch (pkt->header.type) {
        case PKT_TYPE_DATA:      printf("DATA\n"); break;
        case PKT_TYPE_ACK:       printf("ACK\n"); break;
        case PKT_TYPE_HEARTBEAT: printf("HEARTBEAT\n"); break;
        case PKT_TYPE_ERROR:     printf("ERROR\n"); break;
        default:                 printf("UNKNOWN\n");
    }

    printf("标志: 0x%02X\n", pkt->header.flags);
    if (pkt->header.flags & PKT_FLAG_ENCRYPTED)  printf("  - 加密\n");
    if (pkt->header.flags & PKT_FLAG_COMPRESSED) printf("  - 压缩\n");
    if (pkt->header.flags & PKT_FLAG_URGENT)     printf("  - 紧急\n");
    if (pkt->header.flags & PKT_FLAG_FRAGMENTED) printf("  - 分片\n");

    printf("有效载荷长度: %u 字节\n", pkt->header.payload_len);
    printf("序列号: %u\n", pkt->header.sequence);
    printf("时间戳: %u\n", pkt->header.timestamp);
    printf("校验和: 0x%04X\n", pkt->header.checksum);

    // 验证校验和
    uint16_t computed = calculate_checksum(
        (const uint8_t*)&pkt->header,
        sizeof(PacketHeader) - sizeof(uint16_t));
    printf("校验和验证: %s\n",
           computed == pkt->header.checksum ? "通过" : "失败!");

    // 解析有效载荷
    if (pkt->header.type == PKT_TYPE_DATA && pkt->payload) {
        printf("数据内容: ");
        for (size_t i = 0; i < pkt->header.payload_len && i < 16; i++) {
            printf("0x%02X ", pkt->payload[i]);
        }
        if (pkt->header.payload_len > 16) printf("...");
        printf("\n");
    }

    printf("==============================\n\n");
}

// 释放数据包
void packet_destroy(Packet* pkt) {
    if (pkt) {
        free(pkt->payload);
        free(pkt);
    }
}

int main() {
    printf("========== 综合实战：二进制协议解析器 ==========\n\n");

    // 1. 创建并解析数据包
    printf("1. 数据包:\n");
    const char* message = "Hello, Protocol!";
    Packet* data_pkt = packet_create_data(
        100,
        (const uint8_t*)message,
        strlen(message),
        PKT_FLAG_ENCRYPTED | PKT_FLAG_COMPRESSED
    );
    if (data_pkt) {
        packet_parse(data_pkt);
        packet_destroy(data_pkt);
    }

    // 2. 创建并解析ACK包
    printf("2. ACK包:\n");
    Packet* ack_pkt = packet_create_ack(101, 100, 0x00);
    if (ack_pkt) {
        packet_parse(ack_pkt);

        // 解析ACK体
        if (ack_pkt->payload) {
            const AckBody* ack = (const AckBody*)ack_pkt->payload;
            printf("ACK解析: 确认序列号=%u, 状态=0x%02X\n\n",
                   ack->ack_sequence, ack->status);
        }
        packet_destroy(ack_pkt);
    }

    // 3. 协议头部大小验证
    printf("3. 协议头部大小:\n");
    printf("  sizeof(PacketHeader) = %zu 字节\n", sizeof(PacketHeader));
    printf("  理论大小: 1+1+1+2+2+4+2 = 13 字节\n");
    printf("  (使用#pragma pack(1)确保紧凑排列)\n\n");

    printf("4. 设计要点总结:\n");
    printf("  - 使用#pragma pack(1)确保协议头部紧凑排列\n");
    printf("  - 使用位域精确控制版本和类型字段\n");
    printf("  - 使用枚举定义包类型和标志位\n");
    printf("  - 使用联合体进行类型转换（如需要）\n");
    printf("  - 校验和保证数据完整性\n");

    return 0;
}
```

---

## 七、本章小结

本章深入讲解了C语言中联合体、枚举和位域三大核心特性，这些特性与结构体共同构成了C语言强大的类型系统。

**核心知识点回顾：**

1. **联合体（union）**：所有成员共享同一块内存，大小等于最大成员。经典应用包括类型转换（浮点数与字节表示）、大端小端判断、IP地址表示、寄存器访问和变体类型实现。联合体与结构体结合可以构建灵活的变体数据类型。

2. **大端小端**：内存中多字节数据的存储顺序。大端将高位字节存储于低地址，小端则相反。联合体是判断字节序的经典方法。网络字节序采用大端，跨平台编程时需要注意字节序转换。

3. **枚举（enum）**：为整型常量赋予有意义的名字。默认从0递增，也可手动指定。枚举与switch-case是天作之合，编译器可以检查是否覆盖所有枚举值。枚举广泛应用于状态机、策略模式、错误码、日志级别等场景。

4. **位域（bit-field）**：精确控制结构体成员占用的位数。在嵌入式寄存器访问、网络协议解析、文件格式解析中不可或缺。位域成员不能取地址，且不同编译器的布局可能不同，需要注意可移植性。

5. **#pragma pack**：控制结构体对齐方式的编译器指令。`#pragma pack(1)`实现紧凑排列，适用于网络协议和二进制格式。使用`push/pop`保存和恢复对齐设置。紧凑排列可能导致性能下降。

6. **对齐策略**：按对齐要求降序排列成员可减少填充字节。使用`alignas`指定特殊对齐需求，使用`alignof`查询对齐信息，使用`offsetof`验证成员偏移量，使用`_Static_assert`验证结构体大小。

掌握这些特性后，你将能够编写更加高效、可读的C语言代码，并在嵌入式系统、网络编程、系统编程等领域游刃有余。
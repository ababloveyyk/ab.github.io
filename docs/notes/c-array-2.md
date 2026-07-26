---
title: C语言数组与函数Ⅱ
date: 2026-07-26
tags:
  - C语言
  - 二维数组
  - 矩阵
  - 多维数组
categories:
  - C语言
---

# C语言数组与函数Ⅱ——二维数组与矩阵运算

## 一、引言

二维数组是C语言中表示表格、矩阵、棋盘等二维结构的核心工具。理解二维数组的内存布局（行优先存储）对于编写高效的矩阵运算代码至关重要。本章将深入探讨二维数组的定义、初始化、内存布局、以及矩阵运算的经典算法。

---

## 二、二维数组定义与初始化

### 2.1 定义方式

```c
#include <stdio.h>

int main() {
    printf("========== 二维数组定义 ==========\n\n");

    // 方式1：完全初始化
    int mat1[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    printf("完全初始化 mat1[3][4]:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", mat1[i][j]);
        }
        printf("\n");
    }

    // 方式2：部分初始化
    int mat2[3][4] = {
        {1, 2},
        {5},
        {9, 10, 11}
    };
    printf("\n部分初始化 mat2[3][4]:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", mat2[i][j]);
        }
        printf("\n");
    }

    // 方式3：省略第一维
    int mat3[][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    printf("\n省略第一维 size=%d行\n",
           sizeof(mat3) / sizeof(mat3[0]));

    // 方式4：线性初始化
    int mat4[3][4] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
    printf("\n线性初始化 mat4[3][4]:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", mat4[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

### 2.2 内存布局：行优先存储

```c
#include <stdio.h>

int main() {
    printf("========== 行优先存储 ==========\n\n");

    int mat[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    printf("mat[3][4] 内存布局:\n\n");
    printf("逻辑视图:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", mat[i][j]);
        }
        printf("\n");
    }

    printf("\n物理存储（连续内存）:\n");
    int* p = &mat[0][0];
    for (int k = 0; k < 12; k++) {
        printf("地址%p: %d\n", (void*)(p + k), p[k]);
    }

    printf("\n验证: mat[i][j] == *(*(mat + i) + j)\n");
    printf("mat[1][2] = %d\n", mat[1][2]);
    printf("*(*(mat + 1) + 2) = %d\n", *(*(mat + 1) + 2));

    printf("\n一维数组方式访问:\n");
    printf("&mat[0][0] + i*4 + j = p[i*4 + j]\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", p[i * 4 + j]);
        }
        printf("\n");
    }

    return 0;
}
```

### 2.3 二维数组与指针

```c
#include <stdio.h>

int main() {
    printf("========== 二维数组与指针 ==========\n\n");

    int mat[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    printf("mat     = %p (指向第0行的指针)\n", (void*)mat);
    printf("mat[0]  = %p (指向第0行第0个元素的指针)\n", (void*)mat[0]);
    printf("&mat[0][0] = %p\n\n", (void*)&mat[0][0]);

    printf("mat + 1 = %p (跳过第0行，指向第1行)\n", (void*)(mat + 1));
    printf("mat[0] + 1 = %p (跳过1个元素)\n", (void*)(mat[0] + 1));

    printf("\n【各行首地址】\n");
    for (int i = 0; i < 3; i++) {
        printf("第%d行: mat[%d] = %p, &mat[%d][0] = %p\n",
               i, i, (void*)mat[i], i, (void*)&mat[i][0]);
    }

    printf("\n【sizeof验证】\n");
    printf("sizeof(mat)    = %zu (整个数组)\n", sizeof(mat));
    printf("sizeof(mat[0]) = %zu (一行的大小)\n", sizeof(mat[0]));
    printf("sizeof(mat[0][0]) = %zu (一个元素)\n", sizeof(mat[0][0]));

    return 0;
}
```

---

## 三、矩阵运算

### 3.1 矩阵加法与减法

```c
#include <stdio.h>

#define ROWS 3
#define COLS 3

void print_matrix(int mat[][COLS], int rows, const char* name) {
    printf("%s:\n", name);
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < COLS; j++) {
            printf("%4d ", mat[i][j]);
        }
        printf("\n");
    }
}

void matrix_add(int a[][COLS], int b[][COLS], int result[][COLS], int rows) {
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < COLS; j++)
            result[i][j] = a[i][j] + b[i][j];
}

void matrix_sub(int a[][COLS], int b[][COLS], int result[][COLS], int rows) {
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < COLS; j++)
            result[i][j] = a[i][j] - b[i][j];
}

int main() {
    printf("========== 矩阵加法与减法 ==========\n\n");

    int a[ROWS][COLS] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    int b[ROWS][COLS] = {
        {9, 8, 7},
        {6, 5, 4},
        {3, 2, 1}
    };
    int result[ROWS][COLS];

    print_matrix(a, ROWS, "矩阵A");
    print_matrix(b, ROWS, "矩阵B");

    matrix_add(a, b, result, ROWS);
    print_matrix(result, ROWS, "A + B");

    matrix_sub(a, b, result, ROWS);
    print_matrix(result, ROWS, "A - B");

    return 0;
}
```

### 3.2 矩阵乘法

```c
#include <stdio.h>

#define M 2
#define N 3
#define P 2

void matrix_multiply(int a[][N], int b[][P], int result[][P]) {
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < P; j++) {
            result[i][j] = 0;
            for (int k = 0; k < N; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}

void print_mat(int mat[][N], int rows, int cols, const char* name) {
    printf("%s (%dx%d):\n", name, rows, cols);
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) printf("%4d ", mat[i][j]);
        printf("\n");
    }
}

int main() {
    printf("========== 矩阵乘法 ==========\n\n");

    int a[M][N] = {{1, 2, 3}, {4, 5, 6}};
    int b[N][P] = {{7, 8}, {9, 10}, {11, 12}};
    int result[M][P];

    print_mat(a, M, N, "矩阵A");
    print_mat(b, N, P, "矩阵B");

    matrix_multiply(a, b, result);
    print_mat(result, M, P, "A × B");

    return 0;
}
```

### 3.3 矩阵转置

```c
#include <stdio.h>

#define ROWS 3
#define COLS 4

void transpose(int src[][COLS], int dst[][ROWS]) {
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            dst[j][i] = src[i][j];
}

void print_matrix_int(int mat[][COLS], int rows, const char* name) {
    printf("%s:\n", name);
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < COLS; j++) printf("%3d ", mat[i][j]);
        printf("\n");
    }
}

void print_matrix_transposed(int mat[][ROWS], int rows, const char* name) {
    printf("%s:\n", name);
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < ROWS; j++) printf("%3d ", mat[i][j]);
        printf("\n");
    }
}

int main() {
    printf("========== 矩阵转置 ==========\n\n");

    int src[ROWS][COLS] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    int dst[COLS][ROWS];

    print_matrix_int(src, ROWS, "原矩阵");
    transpose(src, dst);
    print_matrix_transposed(dst, COLS, "转置矩阵");

    return 0;
}
```

---

## 四、二维数组应用

### 4.1 杨辉三角

```c
#include <stdio.h>

#define N 10

int main() {
    printf("========== 杨辉三角 ==========\n\n");

    int triangle[N][N] = {0};

    for (int i = 0; i < N; i++) {
        triangle[i][0] = 1;
        triangle[i][i] = 1;
        for (int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }

    for (int i = 0; i < N; i++) {
        for (int s = 0; s < N - i; s++) printf("   ");
        for (int j = 0; j <= i; j++) {
            printf("%6d", triangle[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

### 4.2 蛇形填数

```c
#include <stdio.h>

#define N 5

int main() {
    printf("========== 蛇形填数 ==========\n\n");

    int arr[N][N] = {0};
    int num = 1;
    int top = 0, bottom = N - 1, left = 0, right = N - 1;

    while (num <= N * N) {
        for (int j = left; j <= right; j++) arr[top][j] = num++;
        top++;
        for (int i = top; i <= bottom; i++) arr[i][right] = num++;
        right--;
        for (int j = right; j >= left; j--) arr[bottom][j] = num++;
        bottom--;
        for (int i = bottom; i >= top; i--) arr[i][left] = num++;
        left++;
    }

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%3d ", arr[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

### 4.3 迷宫问题

```c
#include <stdio.h>
#include <stdbool.h>

#define ROWS 5
#define COLS 5

int maze[ROWS][COLS] = {
    {1, 0, 1, 1, 1},
    {1, 0, 1, 0, 1},
    {1, 1, 1, 0, 1},
    {0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1}
};

int visited[ROWS][COLS] = {0};

bool solve_maze(int x, int y) {
    if (x < 0 || x >= ROWS || y < 0 || y >= COLS) return false;
    if (maze[x][y] == 0 || visited[x][y]) return false;
    if (x == ROWS - 1 && y == COLS - 1) {
        visited[x][y] = 1;
        return true;
    }

    visited[x][y] = 1;

    if (solve_maze(x + 1, y)) return true;
    if (solve_maze(x, y + 1)) return true;
    if (solve_maze(x - 1, y)) return true;
    if (solve_maze(x, y - 1)) return true;

    visited[x][y] = 0;
    return false;
}

int main() {
    printf("========== 迷宫求解 ==========\n\n");

    printf("迷宫 (1=通路, 0=墙壁):\n");
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            printf("%d ", maze[i][j]);
        }
        printf("\n");
    }

    if (solve_maze(0, 0)) {
        printf("\n找到路径! (* 标记路径):\n");
        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS; j++) {
                if (visited[i][j]) printf("* ");
                else if (maze[i][j] == 0) printf("# ");
                else printf(". ");
            }
            printf("\n");
        }
    } else {
        printf("\n没有找到路径\n");
    }

    return 0;
}
```

---

## 五、综合实战：图像处理基础

```c
#include <stdio.h>

#define ROWS 4
#define COLS 5

void print_image(int img[][COLS], const char* name) {
    printf("%s:\n", name);
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            printf("%3d ", img[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

// 平移
void translate(int src[][COLS], int dst[][COLS], int dx, int dy) {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            int ni = i - dy, nj = j - dx;
            if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS)
                dst[i][j] = src[ni][nj];
            else
                dst[i][j] = 0;
        }
    }
}

// 水平翻转
void flip_horizontal(int src[][COLS], int dst[][COLS]) {
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            dst[i][ROWS - 1 - i][j] = src[i][j];
}

// 90度旋转
void rotate_90(int src[][COLS], int dst[][ROWS]) {
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
            dst[j][ROWS - 1 - i] = src[i][j];
}

int main() {
    printf("========== 图像处理基础 ==========\n\n");

    int img[ROWS][COLS] = {
        {1, 2, 3, 4, 5},
        {6, 7, 8, 9, 10},
        {11, 12, 13, 14, 15},
        {16, 17, 18, 19, 20}
    };
    int result[ROWS][COLS] = {0};
    int rotated[COLS][ROWS] = {0};

    print_image(img, "原始图像");

    translate(img, result, 1, 1);
    print_image(result, "平移(1,1)");

    rotate_90(img, rotated);
    for (int i = 0; i < COLS; i++) {
        for (int j = 0; j < ROWS; j++) printf("%3d ", rotated[i][j]);
        printf("\n");
    }
    printf("(90度旋转)\n");

    return 0;
}
```

---

## 本章小结

本章深入讲解了二维数组：

1. **定义与初始化**：四种方式、省略第一维、线性初始化
2. **内存布局**：行优先存储、一维访问二维、指针关系
3. **矩阵运算**：加法、减法、乘法、转置
4. **经典应用**：杨辉三角、蛇形填数、迷宫求解
5. **综合实战**：图像处理（平移、翻转、旋转）

二维数组是C语言中处理表格数据的基础，理解其行优先存储特性对于写出高效代码至关重要。
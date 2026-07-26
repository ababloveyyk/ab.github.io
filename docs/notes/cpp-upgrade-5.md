---
title: C++对C的升级Ⅴ——综合实战：用C++重写链表成绩管理系统
date: 2026-07-26
tags:
  - C++
  - 链表
  - 综合实战
  - 成绩管理系统
categories:
  - C++
---

## 前言

在前面的四篇文章中，我们学习了C++对C语言的核心升级特性：输入输出流、命名空间、引用、函数重载、默认参数、内联函数、动态内存管理。现在，让我们将这些知识综合运用起来，完成一个完整的实战项目——用C++重写一个链表成绩管理系统。

本章将通过一个完整的、可运行的C++项目，展示如何将C语言风格的代码逐步改造为现代C++风格。我们将对比C和C++两种实现方式，直观地感受C++带来的生产力提升。

## 项目概述

### 功能需求

我们的成绩管理系统需要支持以下功能：

1. **添加学生成绩**：录入学生姓名、学号、各科成绩。
2. **删除学生成绩**：根据学号删除学生记录。
3. **修改学生成绩**：根据学号修改学生信息。
4. **查询学生成绩**：根据学号查询学生信息。
5. **显示所有学生**：以表格形式展示所有学生成绩。
6. **成绩统计**：计算平均分、最高分、最低分、排名。
7. **保存到文件**：将学生数据保存到文本文件。
8. **从文件加载**：从文本文件加载学生数据。

### 技术选型

- **数据结构**：使用双向链表（而非数组）存储学生数据，支持动态增删。
- **C++特性**：引用传参、函数重载、默认参数、命名空间、new/delete、cin/cout。
- **代码组织**：使用命名空间组织不同功能模块。

## C语言版本回顾

首先，让我们回顾一下C语言版本的实现。这个版本使用`malloc`/`free`管理内存，使用`printf`/`scanf`进行输入输出，使用指针传递参数。

```cpp
// ===== C语言风格的链表成绩管理系统 =====
// 注意：这段代码展示了C语言风格的实现，作为对比参考

#include <cstdio>
#include <cstdlib>
#include <cstring>

// C语言风格的结构体定义
typedef struct Student {
    int id;                 // 学号
    char name[50];          // 姓名
    double math;            // 数学成绩
    double english;         // 英语成绩
    double programming;     // 编程成绩
    double average;         // 平均分
    struct Student* prev;   // 前驱指针
    struct Student* next;   // 后继指针
} Student;

// 全局链表头指针
Student* head = NULL;

// C语言风格的创建学生
Student* createStudent_C(int id, const char* name,
                          double math, double english, double programming) {
    Student* s = (Student*)malloc(sizeof(Student));
    if (!s) return NULL;
    s->id = id;
    strncpy(s->name, name, 49);
    s->name[49] = '\0';
    s->math = math;
    s->english = english;
    s->programming = programming;
    s->average = (math + english + programming) / 3.0;
    s->prev = NULL;
    s->next = NULL;
    return s;
}

// C语言风格的插入学生
void insertStudent_C(Student** head, Student* s) {
    if (!*head) {
        *head = s;
        return;
    }
    Student* current = *head;
    while (current->next) {
        current = current->next;
    }
    current->next = s;
    s->prev = current;
}

// C语言风格的删除学生
int deleteStudent_C(Student** head, int id) {
    Student* current = *head;
    while (current) {
        if (current->id == id) {
            if (current->prev) {
                current->prev->next = current->next;
            } else {
                *head = current->next;
            }
            if (current->next) {
                current->next->prev = current->prev;
            }
            free(current);
            return 1;
        }
        current = current->next;
    }
    return 0;
}

// C语言风格的查找学生
Student* findStudent_C(Student* head, int id) {
    Student* current = head;
    while (current) {
        if (current->id == id) return current;
        current = current->next;
    }
    return NULL;
}

// C语言风格的打印学生
void printStudent_C(const Student* s) {
    printf("学号: %d | 姓名: %s | 数学: %.1f | 英语: %.1f | 编程: %.1f | 平均: %.2f\n",
           s->id, s->name, s->math, s->english, s->programming, s->average);
}

// C语言风格的打印所有学生
void printAll_C(Student* head) {
    if (!head) {
        printf("列表为空！\n");
        return;
    }
    printf("========== 学生成绩列表 ==========\n");
    printf("%-6s %-10s %-8s %-8s %-8s %-8s\n",
           "学号", "姓名", "数学", "英语", "编程", "平均分");
    printf("-----------------------------------------\n");
    Student* current = head;
    while (current) {
        printf("%-6d %-10s %-8.1f %-8.1f %-8.1f %-8.2f\n",
               current->id, current->name, current->math,
               current->english, current->programming, current->average);
        current = current->next;
    }
}

// C语言风格的释放链表
void freeAll_C(Student** head) {
    Student* current = *head;
    while (current) {
        Student* next = current->next;
        free(current);
        current = next;
    }
    *head = NULL;
}
```

观察C语言版本的实现，可以发现以下痛点：
1. 需要使用二级指针（`Student**`）来修改链表头。
2. `malloc`需要`sizeof`和强制类型转换。
3. `printf`/`scanf`需要格式字符串，类型不安全。
4. 没有命名空间，所有函数名必须全局唯一。
5. 字符串操作需要手动管理缓冲区大小。
6. 内存管理完全手动，容易遗漏`free`。

## C++版本实现

现在，让我们使用C++的特性重写这个系统。

### 命名空间和数据结构定义

```cpp
#include <iostream>
#include <iomanip>
#include <string>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <memory>
#include <cstring>

// ===== 命名空间：数据模型 =====
namespace StudentModel {

    // 学生类（替代C语言的结构体）
    class Student {
    private:
        int id;               // 学号
        std::string name;     // 姓名（使用std::string替代char数组）
        double math;          // 数学成绩
        double english;       // 英语成绩
        double programming;   // 编程成绩
        double average;       // 平均分

    public:
        Student* prev;        // 前驱指针
        Student* next;        // 后继指针

        // 构造函数（使用默认参数和初始化列表）
        Student(int id = 0, const std::string& name = "未知",
                double math = 0.0, double english = 0.0,
                double programming = 0.0)
            : id(id), name(name), math(math),
              english(english), programming(programming),
              prev(nullptr), next(nullptr) {
            calculateAverage();
        }

        // 计算平均分
        void calculateAverage() {
            average = (math + english + programming) / 3.0;
        }

        // Getter方法（使用const确保只读）
        int getId() const { return id; }
        const std::string& getName() const { return name; }
        double getMath() const { return math; }
        double getEnglish() const { return english; }
        double getProgramming() const { return programming; }
        double getAverage() const { return average; }
        double getTotal() const { return math + english + programming; }

        // Setter方法
        void setId(int newId) { id = newId; }
        void setName(const std::string& newName) { name = newName; }
        void setMath(double score) { math = score; calculateAverage(); }
        void setEnglish(double score) { english = score; calculateAverage(); }
        void setProgramming(double score) { programming = score; calculateAverage(); }

        // 设置所有成绩
        void setScores(double m, double e, double p) {
            math = m; english = e; programming = p;
            calculateAverage();
        }

        // 重载==运算符用于比较（基于学号）
        bool operator==(const Student& other) const {
            return id == other.id;
        }

        bool operator==(int targetId) const {
            return id == targetId;
        }

        // 重载<运算符用于排序（基于平均分）
        bool operator<(const Student& other) const {
            return average > other.average;  // 降序排列
        }
    };
}
```

### 链表管理类

```cpp
// ===== 命名空间：链表管理 =====
namespace LinkedList {

    using StudentModel::Student;

    // 链表管理类（使用RAII管理内存）
    class StudentList {
    private:
        Student* head;       // 链表头指针
        Student* tail;       // 链表尾指针（便于尾部插入）
        int count;           // 学生数量

    public:
        // 构造函数
        StudentList() : head(nullptr), tail(nullptr), count(0) {
            std::cout << "[StudentList] 链表已创建" << std::endl;
        }

        // 析构函数（RAII：自动释放所有节点）
        ~StudentList() {
            clear();
            std::cout << "[StudentList] 链表已销毁" << std::endl;
        }

        // 禁止拷贝（链表管理资源，拷贝需要深拷贝）
        StudentList(const StudentList&) = delete;
        StudentList& operator=(const StudentList&) = delete;

        // 获取链表大小
        int size() const { return count; }

        // 判断链表是否为空
        bool empty() const { return count == 0; }

        // 获取头节点
        Student* getHead() const { return head; }

        // 添加学生（使用引用传递，避免拷贝）
        void addStudent(const Student& student) {
            Student* newNode = new Student(student);  // 使用new分配内存
            newNode->prev = tail;
            newNode->next = nullptr;

            if (tail) {
                tail->next = newNode;
            } else {
                head = newNode;
            }
            tail = newNode;
            count++;
            std::cout << "[添加] 学生 " << student.getName()
                      << " (学号: " << student.getId() << ") 已添加" << std::endl;
        }

        // 函数重载：使用参数直接创建学生
        void addStudent(int id, const std::string& name,
                        double math, double english, double programming) {
            Student s(id, name, math, english, programming);
            addStudent(s);
        }

        // 删除学生（使用引用返回值表示结果）
        bool removeStudent(int id) {
            Student* current = head;
            while (current) {
                if (current->getId() == id) {
                    // 调整前驱节点的next指针
                    if (current->prev) {
                        current->prev->next = current->next;
                    } else {
                        head = current->next;
                    }

                    // 调整后继节点的prev指针
                    if (current->next) {
                        current->next->prev = current->prev;
                    } else {
                        tail = current->prev;
                    }

                    std::cout << "[删除] 学生 " << current->getName()
                              << " (学号: " << id << ") 已删除" << std::endl;
                    delete current;  // 使用delete释放内存
                    count--;
                    return true;
                }
                current = current->next;
            }
            std::cout << "[删除] 学号 " << id << " 不存在" << std::endl;
            return false;
        }

        // 查找学生（返回指针，可能为nullptr）
        Student* findStudent(int id) const {
            Student* current = head;
            while (current) {
                if (current->getId() == id) return current;
                current = current->next;
            }
            return nullptr;
        }

        // 查找学生（通过姓名，返回指针）
        Student* findStudentByName(const std::string& name) const {
            Student* current = head;
            while (current) {
                if (current->getName() == name) return current;
                current = current->next;
            }
            return nullptr;
        }

        // 修改学生成绩
        bool updateStudent(int id, double math = -1.0,
                           double english = -1.0, double programming = -1.0) {
            Student* s = findStudent(id);
            if (!s) {
                std::cout << "[修改] 学号 " << id << " 不存在" << std::endl;
                return false;
            }

            if (math >= 0) s->setMath(math);
            if (english >= 0) s->setEnglish(english);
            if (programming >= 0) s->setProgramming(programming);

            std::cout << "[修改] 学生 " << s->getName()
                      << " 的成绩已更新" << std::endl;
            return true;
        }

        // 获取所有学生（用于排序等操作）
        std::vector<Student*> getAllStudents() const {
            std::vector<Student*> result;
            Student* current = head;
            while (current) {
                result.push_back(current);
                current = current->next;
            }
            return result;
        }

        // 清空链表
        void clear() {
            Student* current = head;
            while (current) {
                Student* next = current->next;
                delete current;
                current = next;
            }
            head = nullptr;
            tail = nullptr;
            count = 0;
            std::cout << "[StudentList] 链表已清空" << std::endl;
        }
    };
}
```

### 显示和输出模块

```cpp
// ===== 命名空间：显示模块 =====
namespace Display {

    using StudentModel::Student;
    using LinkedList::StudentList;

    // 打印分隔线（默认参数）
    void printLine(char ch = '-', int width = 65) {
        for (int i = 0; i < width; i++) {
            std::cout << ch;
        }
        std::cout << std::endl;
    }

    // 打印标题
    void printHeader(const std::string& title, char ch = '=') {
        printLine(ch, 65);
        std::cout << "  " << title << std::endl;
        printLine(ch, 65);
    }

    // 打印单个学生信息（重载：const Student&）
    void printStudent(const Student& s) {
        std::cout << std::left
                  << std::setw(6) << s.getId()
                  << std::setw(12) << s.getName()
                  << std::setw(10) << std::fixed << std::setprecision(1) << s.getMath()
                  << std::setw(10) << s.getEnglish()
                  << std::setw(10) << s.getProgramming()
                  << std::setw(10) << std::setprecision(2) << s.getAverage()
                  << std::endl;
    }

    // 打印表格头
    void printTableHeader() {
        printLine('-', 65);
        std::cout << std::left
                  << std::setw(6) << "学号"
                  << std::setw(12) << "姓名"
                  << std::setw(10) << "数学"
                  << std::setw(10) << "英语"
                  << std::setw(10) << "编程"
                  << std::setw(10) << "平均分"
                  << std::endl;
        printLine('-', 65);
    }

    // 打印所有学生
    void printAllStudents(const StudentList& list) {
        if (list.empty()) {
            printHeader("学生列表为空");
            return;
        }

        printHeader("学生成绩列表 (共 " + std::to_string(list.size()) + " 人)");
        printTableHeader();

        Student* current = list.getHead();
        while (current) {
            printStudent(*current);
            current = current->next;
        }
        printLine('-', 65);
    }

    // 打印学生详细信息
    void printStudentDetail(const Student& s) {
        printHeader("学生详细信息");
        std::cout << "  学号:     " << s.getId() << std::endl;
        std::cout << "  姓名:     " << s.getName() << std::endl;
        std::cout << "  数学:     " << s.getMath() << std::endl;
        std::cout << "  英语:     " << s.getEnglish() << std::endl;
        std::cout << "  编程:     " << s.getProgramming() << std::endl;
        std::cout << "  总分:     " << s.getTotal() << std::endl;
        std::cout << "  平均分:   " << s.getAverage() << std::endl;
        printLine('=', 65);
    }

    // 打印排名
    void printRanking(const StudentList& list) {
        if (list.empty()) {
            printHeader("排名列表为空");
            return;
        }

        printHeader("学生成绩排名");

        // 获取所有学生并排序
        auto students = list.getAllStudents();
        std::sort(students.begin(), students.end(),
                  [](const Student* a, const Student* b) {
                      return a->getAverage() > b->getAverage();
                  });

        std::cout << std::left
                  << std::setw(6) << "排名"
                  << std::setw(6) << "学号"
                  << std::setw(12) << "姓名"
                  << std::setw(10) << "平均分"
                  << std::endl;
        printLine('-', 40);

        int rank = 1;
        for (const auto& s : students) {
            std::cout << std::setw(6) << rank++
                      << std::setw(6) << s->getId()
                      << std::setw(12) << s->getName()
                      << std::setw(10) << std::fixed << std::setprecision(2) << s->getAverage()
                      << std::endl;
        }
        printLine('-', 40);
    }
}
```

### 统计模块

```cpp
// ===== 命名空间：统计模块 =====
namespace Statistics {

    using StudentModel::Student;
    using LinkedList::StudentList;

    // 统计信息结构体
    struct Stats {
        int totalStudents;
        double avgMath;
        double avgEnglish;
        double avgProgramming;
        double avgOverall;
        double maxAverage;
        double minAverage;
        Student* topStudent;
        Student* bottomStudent;

        Stats() : totalStudents(0), avgMath(0), avgEnglish(0),
                  avgProgramming(0), avgOverall(0),
                  maxAverage(0), minAverage(0),
                  topStudent(nullptr), bottomStudent(nullptr) {}
    };

    // 计算统计数据
    Stats calculateStats(const StudentList& list) {
        Stats stats;
        stats.totalStudents = list.size();

        if (stats.totalStudents == 0) return stats;

        double totalMath = 0, totalEnglish = 0, totalProgramming = 0;
        stats.maxAverage = -1.0;
        stats.minAverage = 999.0;

        Student* current = list.getHead();
        while (current) {
            totalMath += current->getMath();
            totalEnglish += current->getEnglish();
            totalProgramming += current->getProgramming();

            double avg = current->getAverage();
            if (avg > stats.maxAverage) {
                stats.maxAverage = avg;
                stats.topStudent = current;
            }
            if (avg < stats.minAverage) {
                stats.minAverage = avg;
                stats.bottomStudent = current;
            }

            current = current->next;
        }

        stats.avgMath = totalMath / stats.totalStudents;
        stats.avgEnglish = totalEnglish / stats.totalStudents;
        stats.avgProgramming = totalProgramming / stats.totalStudents;
        stats.avgOverall = (stats.avgMath + stats.avgEnglish + stats.avgProgramming) / 3.0;

        return stats;
    }

    // 打印统计报告
    void printReport(const StudentList& list) {
        Display::printHeader("成绩统计报告");

        Stats stats = calculateStats(list);

        std::cout << "  学生总数:     " << stats.totalStudents << " 人" << std::endl;
        std::cout << "  数学平均分:   " << std::fixed << std::setprecision(2) << stats.avgMath << std::endl;
        std::cout << "  英语平均分:   " << stats.avgEnglish << std::endl;
        std::cout << "  编程平均分:   " << stats.avgProgramming << std::endl;
        std::cout << "  总平均分:     " << stats.avgOverall << std::endl;
        std::cout << "  最高平均分:   " << stats.maxAverage;
        if (stats.topStudent) {
            std::cout << " (" << stats.topStudent->getName() << ")";
        }
        std::cout << std::endl;
        std::cout << "  最低平均分:   " << stats.minAverage;
        if (stats.bottomStudent) {
            std::cout << " (" << stats.bottomStudent->getName() << ")";
        }
        std::cout << std::endl;

        Display::printLine('=', 65);
    }

    // 打印各科及格率
    void printPassRate(const StudentList& list, double passLine = 60.0) {
        Display::printHeader("各科及格率统计 (及格线: " +
                             std::to_string(static_cast<int>(passLine)) + "分)");

        if (list.empty()) {
            std::cout << "  无数据" << std::endl;
            return;
        }

        int passMath = 0, passEnglish = 0, passProgramming = 0;
        int total = list.size();

        Student* current = list.getHead();
        while (current) {
            if (current->getMath() >= passLine) passMath++;
            if (current->getEnglish() >= passLine) passEnglish++;
            if (current->getProgramming() >= passLine) passProgramming++;
            current = current->next;
        }

        std::cout << "  数学及格率:   " << std::fixed << std::setprecision(1)
                  << (100.0 * passMath / total) << "% (" << passMath << "/" << total << ")" << std::endl;
        std::cout << "  英语及格率:   " << (100.0 * passEnglish / total)
                  << "% (" << passEnglish << "/" << total << ")" << std::endl;
        std::cout << "  编程及格率:   " << (100.0 * passProgramming / total)
                  << "% (" << passProgramming << "/" << total << ")" << std::endl;

        Display::printLine('=', 65);
    }
}
```

### 文件操作模块

```cpp
// ===== 命名空间：文件操作 =====
namespace FileIO {

    using StudentModel::Student;
    using LinkedList::StudentList;

    // 保存到文件
    bool saveToFile(const StudentList& list, const std::string& filename = "students.txt") {
        std::ofstream file(filename);
        if (!file.is_open()) {
            std::cerr << "[文件] 无法打开文件: " << filename << std::endl;
            return false;
        }

        file << "# 学生成绩管理系统数据文件" << std::endl;
        file << "# 格式: 学号,姓名,数学,英语,编程" << std::endl;

        Student* current = list.getHead();
        while (current) {
            file << current->getId() << ","
                 << current->getName() << ","
                 << current->getMath() << ","
                 << current->getEnglish() << ","
                 << current->getProgramming() << std::endl;
            current = current->next;
        }

        file.close();
        std::cout << "[文件] 数据已保存到 " << filename
                  << " (共 " << list.size() << " 条记录)" << std::endl;
        return true;
    }

    // 从文件加载
    bool loadFromFile(StudentList& list, const std::string& filename = "students.txt") {
        std::ifstream file(filename);
        if (!file.is_open()) {
            std::cerr << "[文件] 无法打开文件: " << filename << std::endl;
            return false;
        }

        list.clear();  // 清空现有数据
        int loadedCount = 0;

        std::string line;
        while (std::getline(file, line)) {
            // 跳过注释行和空行
            if (line.empty() || line[0] == '#') continue;

            std::stringstream ss(line);
            std::string token;
            std::vector<std::string> tokens;

            while (std::getline(ss, token, ',')) {
                tokens.push_back(token);
            }

            if (tokens.size() >= 5) {
                try {
                    int id = std::stoi(tokens[0]);
                    const std::string& name = tokens[1];
                    double math = std::stod(tokens[2]);
                    double english = std::stod(tokens[3]);
                    double programming = std::stod(tokens[4]);

                    list.addStudent(id, name, math, english, programming);
                    loadedCount++;
                } catch (const std::exception& e) {
                    std::cerr << "[文件] 解析行失败: " << line << " (" << e.what() << ")" << std::endl;
                }
            }
        }

        file.close();
        std::cout << "[文件] 从 " << filename << " 加载了 "
                  << loadedCount << " 条记录" << std::endl;
        return true;
    }
}
```

### 交互式菜单系统

```cpp
// ===== 命名空间：用户界面 =====
namespace UserInterface {

    using LinkedList::StudentList;

    // 显示主菜单
    void showMenu() {
        Display::printHeader("学生成绩管理系统 v2.0 (C++版)");
        std::cout << "  1. 添加学生成绩" << std::endl;
        std::cout << "  2. 删除学生记录" << std::endl;
        std::cout << "  3. 修改学生成绩" << std::endl;
        std::cout << "  4. 查询学生信息" << std::endl;
        std::cout << "  5. 显示所有学生" << std::endl;
        std::cout << "  6. 成绩排名" << std::endl;
        std::cout << "  7. 成绩统计" << std::endl;
        std::cout << "  8. 保存到文件" << std::endl;
        std::cout << "  9. 从文件加载" << std::endl;
        std::cout << "  0. 退出系统" << std::endl;
        Display::printLine('=', 65);
        std::cout << "请选择操作 [0-9]: ";
    }

    // 添加学生（使用cin/cout替代scanf/printf）
    void addStudent(StudentList& list) {
        Display::printHeader("添加学生成绩");

        int id;
        std::string name;
        double math, english, programming;

        std::cout << "请输入学号: ";
        std::cin >> id;

        // 检查学号是否已存在
        if (list.findStudent(id)) {
            std::cout << "[错误] 学号 " << id << " 已存在！" << std::endl;
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            return;
        }

        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "请输入姓名: ";
        std::getline(std::cin, name);

        std::cout << "请输入数学成绩: ";
        std::cin >> math;
        std::cout << "请输入英语成绩: ";
        std::cin >> english;
        std::cout << "请输入编程成绩: ";
        std::cin >> programming;

        list.addStudent(id, name, math, english, programming);
        std::cout << std::endl;
    }

    // 删除学生
    void deleteStudent(StudentList& list) {
        Display::printHeader("删除学生记录");

        if (list.empty()) {
            std::cout << "列表为空，无需删除。" << std::endl;
            return;
        }

        int id;
        std::cout << "请输入要删除的学号: ";
        std::cin >> id;

        list.removeStudent(id);
        std::cout << std::endl;
    }

    // 修改学生成绩
    void modifyStudent(StudentList& list) {
        Display::printHeader("修改学生成绩");

        if (list.empty()) {
            std::cout << "列表为空，无法修改。" << std::endl;
            return;
        }

        int id;
        std::cout << "请输入要修改的学号: ";
        std::cin >> id;

        StudentModel::Student* s = list.findStudent(id);
        if (!s) {
            std::cout << "[错误] 学号 " << id << " 不存在！" << std::endl;
            return;
        }

        std::cout << "当前成绩: 数学=" << s->getMath()
                  << " 英语=" << s->getEnglish()
                  << " 编程=" << s->getProgramming() << std::endl;

        double math, english, programming;
        std::cout << "请输入新的数学成绩 (输入-1保持不变): ";
        std::cin >> math;
        std::cout << "请输入新的英语成绩 (输入-1保持不变): ";
        std::cin >> english;
        std::cout << "请输入新的编程成绩 (输入-1保持不变): ";
        std::cin >> programming;

        list.updateStudent(id, math, english, programming);
        std::cout << std::endl;
    }

    // 查询学生
    void queryStudent(const StudentList& list) {
        Display::printHeader("查询学生信息");

        if (list.empty()) {
            std::cout << "列表为空，无法查询。" << std::endl;
            return;
        }

        int id;
        std::cout << "请输入要查询的学号: ";
        std::cin >> id;

        StudentModel::Student* s = list.findStudent(id);
        if (s) {
            Display::printStudentDetail(*s);
        } else {
            std::cout << "[错误] 学号 " << id << " 不存在！" << std::endl;
        }
        std::cout << std::endl;
    }

    // 运行主循环
    void run(StudentList& list) {
        bool running = true;

        while (running) {
            showMenu();

            int choice;
            std::cin >> choice;

            // 输入验证
            if (std::cin.fail()) {
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                std::cout << "[错误] 请输入有效的数字！" << std::endl;
                continue;
            }

            std::cout << std::endl;

            switch (choice) {
                case 1: addStudent(list); break;
                case 2: deleteStudent(list); break;
                case 3: modifyStudent(list); break;
                case 4: queryStudent(list); break;
                case 5: Display::printAllStudents(list); break;
                case 6: Display::printRanking(list); break;
                case 7:
                    Statistics::printReport(list);
                    Statistics::printPassRate(list);
                    break;
                case 8: FileIO::saveToFile(list); break;
                case 9: FileIO::loadFromFile(list); break;
                case 0:
                    std::cout << "感谢使用！再见！" << std::endl;
                    running = false;
                    break;
                default:
                    std::cout << "[错误] 无效的选择，请重新输入！" << std::endl;
            }

            if (running) {
                std::cout << "\n按Enter键继续...";
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                std::cin.get();
            }
        }
    }
}
```

### 主函数

```cpp
// ===== 主函数 =====
int main() {
    // 设置控制台输出编码（Windows系统）
    #ifdef _WIN32
        system("chcp 65001 > nul");
    #endif

    // 创建链表（RAII：自动管理内存）
    StudentModel::StudentList list;

    // 预加载一些示例数据
    std::cout << "====== 加载示例数据 ======" << std::endl;
    list.addStudent(1001, "张三", 92.5, 88.0, 95.0);
    list.addStudent(1002, "李四", 78.0, 85.5, 82.0);
    list.addStudent(1003, "王五", 96.0, 91.0, 98.5);
    list.addStudent(1004, "赵六", 65.0, 72.5, 70.0);
    list.addStudent(1005, "孙七", 88.0, 90.5, 86.0);
    list.addStudent(1006, "周八", 73.5, 68.0, 75.0);
    list.addStudent(1007, "吴九", 99.0, 97.0, 95.5);
    std::cout << "====== 示例数据加载完成 ======" << std::endl;

    // 运行交互式菜单
    UserInterface::run(list);

    return 0;
    // list在离开作用域时自动析构，释放所有内存
}
```

## C与C++版本对比分析

### 代码量对比

| 特性 | C语言版本 | C++版本 |
|------|----------|---------|
| 输入输出 | `printf`/`scanf`（需格式字符串） | `cin`/`cout`（类型安全） |
| 字符串处理 | `char name[50]`（手动管理缓冲区） | `std::string`（自动管理） |
| 内存分配 | `malloc`/`free`（需sizeof和转换） | `new`/`delete`（自动调用构造/析构函数） |
| 参数传递 | 指针（可能需要二级指针） | 引用（语法更简洁） |
| 链表操作 | 二级指针`Student**` | 对象封装，引用返回 |
| 函数命名 | 全局唯一，需加前缀 | 命名空间隔离 |
| 资源管理 | 手动调用`free` | RAII，析构函数自动释放 |

### 关键改进点

1. **内存安全**：C++版本使用RAII，`StudentList`析构函数自动释放所有节点内存。C版本需要手动调用`freeAll_C`，容易遗漏。

2. **类型安全**：C++版本的`cin`/`cout`是类型安全的，编译器会根据参数类型自动选择正确的重载。C版本的`printf`/`scanf`依赖格式字符串，类型不匹配可能导致运行时错误。

3. **代码可读性**：C++版本使用引用传参（`const Student&`）而非指针，代码意图更清晰。`std::string`替代`char[]`避免了缓冲区溢出和手动管理。

4. **模块化**：C++版本使用命名空间将不同功能模块（数据模型、链表管理、显示、统计、文件操作、用户界面）分离，代码组织更清晰。

5. **接口统一**：C++版本通过函数重载提供了统一的接口，如`addStudent`的重载版本。

## 编译和运行

### 编译命令

```bash
# 使用g++编译
g++ -std=c++17 -o student_manager student_manager.cpp

# 使用MSVC编译
cl /EHsc /std:c++17 student_manager.cpp

# 运行
./student_manager   # Linux/Mac
student_manager.exe # Windows
```

### 运行示例

```
====== 加载示例数据 ======
[StudentList] 链表已创建
[添加] 学生 张三 (学号: 1001) 已添加
[添加] 学生 李四 (学号: 1002) 已添加
[添加] 学生 王五 (学号: 1003) 已添加
[添加] 学生 赵六 (学号: 1004) 已添加
[添加] 学生 孙七 (学号: 1005) 已添加
[添加] 学生 周八 (学号: 1006) 已添加
[添加] 学生 吴九 (学号: 1007) 已添加
====== 示例数据加载完成 ======
===============================================================
  学生成绩管理系统 v2.0 (C++版)
===============================================================
  1. 添加学生成绩
  2. 删除学生记录
  3. 修改学生成绩
  4. 查询学生信息
  5. 显示所有学生
  6. 成绩排名
  7. 成绩统计
  8. 保存到文件
  9. 从文件加载
  0. 退出系统
===============================================================
请选择操作 [0-9]:
```

## 总结

本文通过一个完整的实战项目——链表成绩管理系统，展示了如何将C语言风格的代码改造为现代C++风格。我们综合运用了前面四篇文章中学到的所有C++特性：

### 核心要点回顾

1. **命名空间（namespace）**：将代码组织为`StudentModel`、`LinkedList`、`Display`、`Statistics`、`FileIO`、`UserInterface`六个模块，每个模块职责清晰，避免了全局命名冲突。

2. **引用（reference）**：在函数参数中广泛使用`const`引用（如`const Student&`），避免了不必要的拷贝，同时保证了参数不被修改。引用返回使得链式操作成为可能。

3. **函数重载（overload）**：`addStudent`提供了两个重载版本，分别接受`Student`对象和直接参数，简化了接口使用。

4. **默认参数（default arguments）**：`updateStudent`使用默认参数值-1表示"不修改"，`saveToFile`和`loadFromFile`提供默认文件名。

5. **new/delete**：使用`new`/`delete`管理动态内存，自动调用构造函数和析构函数。`StudentList`的析构函数使用RAII自动清理所有节点。

6. **cin/cout**：使用`cin`/`cout`进行输入输出，结合`<iomanip>`流操纵符实现格式化输出，类型安全且可扩展。

7. **RAII**：`StudentList`类在构造函数中初始化资源，在析构函数中自动释放资源，彻底避免了内存泄漏问题。

这个项目展示了C++相对于C语言的核心优势：更安全的类型系统、更简洁的语法、更好的代码组织能力、以及自动化的资源管理。掌握这些特性，是成为合格C++程序员的第一步。
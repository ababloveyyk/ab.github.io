---
title: C++类与对象Ⅴ——综合实战：Student管理系统
date: 2026-07-26
tags:
  - C++
  - 类与对象
  - 综合实战
  - 学生管理系统
categories:
  - C++
---

## 前言

本文是C++类与对象系列的最后一篇，我们将综合运用前面四篇文章中学到的所有知识，构建一个完整的Student管理系统。这个项目将涵盖封装、构造函数与析构函数、运算符重载、静态成员、友元、const成员函数等所有核心概念，展示面向对象程序设计在实际项目中的应用。

## 项目概述

### 功能需求

1. **学生信息管理**：添加、删除、修改、查询学生信息。
2. **成绩管理**：录入、修改各科成绩，自动计算平均分和总分。
3. **成绩统计**：平均分、最高分、最低分、及格率、排名。
4. **数据持久化**：保存到文件、从文件加载。
5. **交互式界面**：命令行菜单驱动的用户界面。

### 技术要点

- 私有成员变量 + 公有访问接口（封装）
- 多种构造函数（默认、带参、拷贝）
- 运算符重载（`<<`、`==`、`<`、`>`）
- 静态成员统计学生总数
- `std::vector`管理学生对象
- 命名空间组织代码模块

## 完整的Student类设计

```cpp
#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
#include <algorithm>
#include <fstream>
#include <sstream>
#include <limits>
#include <stdexcept>
#include <cmath>

// ===== 数据模型命名空间 =====
namespace Model {

    // 成绩结构体
    struct Scores {
        double math;
        double english;
        double programming;
        double physics;
        double chemistry;

        Scores(double m = 0, double e = 0, double p = 0,
               double ph = 0, double c = 0)
            : math(m), english(e), programming(p), physics(ph), chemistry(c) {}

        double total() const {
            return math + english + programming + physics + chemistry;
        }

        double average() const {
            return total() / 5.0;
        }

        bool hasPassedAll(double passLine = 60.0) const {
            return math >= passLine && english >= passLine &&
                   programming >= passLine && physics >= passLine &&
                   chemistry >= passLine;
        }
    };

    // 学生类
    class Student {
    private:
        int id;                 // 学号
        std::string name;       // 姓名
        int age;                // 年龄
        std::string className;  // 班级
        Scores scores;          // 成绩
        std::string remark;     // 备注

        // 静态成员变量
        static int totalStudents;  // 学生总数
        static int nextId;         // 下一个可用学号

    public:
        // ===== 构造函数 =====

        // 默认构造函数
        Student()
            : id(nextId++), name("未命名"), age(0),
              className("未分配"), scores(), remark("") {
            totalStudents++;
        }

        // 带参构造函数（姓名+年龄+班级）
        Student(const std::string& n, int a, const std::string& cls)
            : id(nextId++), name(n), age(a),
              className(cls), scores(), remark("") {
            totalStudents++;
        }

        // 完整构造函数
        Student(const std::string& n, int a, const std::string& cls,
                const Scores& s, const std::string& r = "")
            : id(nextId++), name(n), age(a),
              className(cls), scores(s), remark(r) {
            totalStudents++;
        }

        // 拷贝构造函数
        Student(const Student& other)
            : id(other.id), name(other.name), age(other.age),
              className(other.className), scores(other.scores),
              remark(other.remark) {
            totalStudents++;
        }

        // 析构函数
        ~Student() {
            totalStudents--;
        }

        // ===== Getter方法（const） =====

        int getId() const { return id; }
        const std::string& getName() const { return name; }
        int getAge() const { return age; }
        const std::string& getClassName() const { return className; }
        const Scores& getScores() const { return scores; }
        const std::string& getRemark() const { return remark; }

        double getTotalScore() const { return scores.total(); }
        double getAverageScore() const { return scores.average(); }

        double getMath() const { return scores.math; }
        double getEnglish() const { return scores.english; }
        double getProgramming() const { return scores.programming; }
        double getPhysics() const { return scores.physics; }
        double getChemistry() const { return scores.chemistry; }

        // ===== Setter方法 =====

        void setName(const std::string& n) { name = n; }
        void setAge(int a) { age = a > 0 ? a : 0; }
        void setClassName(const std::string& cls) { className = cls; }
        void setRemark(const std::string& r) { remark = r; }

        void setMath(double score) { scores.math = validateScore(score); }
        void setEnglish(double score) { scores.english = validateScore(score); }
        void setProgramming(double score) { scores.programming = validateScore(score); }
        void setPhysics(double score) { scores.physics = validateScore(score); }
        void setChemistry(double score) { scores.chemistry = validateScore(score); }

        void setScores(const Scores& s) {
            scores.math = validateScore(s.math);
            scores.english = validateScore(s.english);
            scores.programming = validateScore(s.programming);
            scores.physics = validateScore(s.physics);
            scores.chemistry = validateScore(s.chemistry);
        }

        void setId(int newId) { id = newId; }

        // ===== 运算符重载 =====

        // 相等比较（基于学号）
        bool operator==(const Student& other) const {
            return id == other.id;
        }

        bool operator==(int targetId) const {
            return id == targetId;
        }

        // 小于比较（基于平均分，用于排序）
        bool operator<(const Student& other) const {
            return getAverageScore() > other.getAverageScore();  // 降序
        }

        // 大于比较
        bool operator>(const Student& other) const {
            return getAverageScore() < other.getAverageScore();
        }

        // 流输出运算符
        friend std::ostream& operator<<(std::ostream& os, const Student& s);

        // 流输入运算符
        friend std::istream& operator>>(std::istream& is, Student& s);

        // ===== 静态成员函数 =====

        static int getTotalStudents() { return totalStudents; }
        static void setNextId(int id) { nextId = id; }
        static int getNextId() { return nextId; }

        // ===== 其他方法 =====

        // 判断是否所有科目都及格
        bool hasPassedAll(double passLine = 60.0) const {
            return scores.hasPassedAll(passLine);
        }

        // 获取成绩等级
        std::string getGrade() const {
            double avg = getAverageScore();
            if (avg >= 90) return "优秀";
            if (avg >= 80) return "良好";
            if (avg >= 70) return "中等";
            if (avg >= 60) return "及格";
            return "不及格";
        }

    private:
        // 验证成绩（0-100之间）
        static double validateScore(double score) {
            if (score < 0) return 0;
            if (score > 100) return 100;
            return score;
        }
    };

    // 静态成员变量初始化
    int Student::totalStudents = 0;
    int Student::nextId = 1001;

    // 流输出运算符实现
    std::ostream& operator<<(std::ostream& os, const Student& s) {
        os << std::left
           << std::setw(6) << s.id
           << std::setw(10) << s.name
           << std::setw(4) << s.age
           << std::setw(10) << s.className
           << std::setw(8) << std::fixed << std::setprecision(1) << s.scores.math
           << std::setw(8) << s.scores.english
           << std::setw(8) << s.scores.programming
           << std::setw(8) << s.scores.physics
           << std::setw(8) << s.scores.chemistry
           << std::setw(8) << std::setprecision(2) << s.getAverageScore()
           << std::setw(8) << s.getGrade();
        return os;
    }

    // 流输入运算符实现
    std::istream& operator>>(std::istream& is, Student& s) {
        std::cout << "请输入姓名: ";
        std::getline(is, s.name);
        std::cout << "请输入年龄: ";
        is >> s.age;
        is.ignore();
        std::cout << "请输入班级: ";
        std::getline(is, s.className);
        std::cout << "请输入数学成绩: ";
        is >> s.scores.math;
        std::cout << "请输入英语成绩: ";
        is >> s.scores.english;
        std::cout << "请输入编程成绩: ";
        is >> s.scores.programming;
        std::cout << "请输入物理成绩: ";
        is >> s.scores.physics;
        std::cout << "请输入化学成绩: ";
        is >> s.scores.chemistry;
        is.ignore();
        std::cout << "请输入备注: ";
        std::getline(is, s.remark);
        return is;
    }
}
```

## 学生管理器类

```cpp
// ===== 管理命名空间 =====
namespace Management {

    using Model::Student;
    using Model::Scores;

    // 学生管理器
    class StudentManager {
    private:
        std::vector<Student> students;  // 使用vector管理学生对象

    public:
        // ===== 增删改查 =====

        // 添加学生
        bool addStudent(const Student& student) {
            // 检查学号是否重复
            if (findById(student.getId())) {
                std::cerr << "错误：学号 " << student.getId() << " 已存在！" << std::endl;
                return false;
            }
            students.push_back(student);
            std::cout << "添加学生: " << student.getName()
                      << " (学号: " << student.getId() << ") 成功" << std::endl;
            return true;
        }

        // 添加学生（便捷方法）
        bool addStudent(const std::string& name, int age,
                        const std::string& className,
                        const Scores& scores) {
            Student s(name, age, className, scores);
            return addStudent(s);
        }

        // 删除学生
        bool removeStudent(int id) {
            auto it = findIteratorById(id);
            if (it != students.end()) {
                std::cout << "删除学生: " << it->getName()
                          << " (学号: " << id << ") 成功" << std::endl;
                students.erase(it);
                return true;
            }
            std::cerr << "错误：学号 " << id << " 不存在！" << std::endl;
            return false;
        }

        // 修改学生信息
        bool updateStudent(int id, const Student& updated) {
            Student* s = findById(id);
            if (s) {
                s->setName(updated.getName());
                s->setAge(updated.getAge());
                s->setClassName(updated.getClassName());
                s->setScores(updated.getScores());
                s->setRemark(updated.getRemark());
                std::cout << "修改学生: " << s->getName() << " 成功" << std::endl;
                return true;
            }
            return false;
        }

        // 修改学生成绩
        bool updateScores(int id, const Scores& scores) {
            Student* s = findById(id);
            if (s) {
                s->setScores(scores);
                std::cout << "修改成绩: " << s->getName() << " 成功" << std::endl;
                return true;
            }
            return false;
        }

        // 查找学生（通过学号）
        Student* findById(int id) {
            for (auto& s : students) {
                if (s.getId() == id) return &s;
            }
            return nullptr;
        }

        const Student* findById(int id) const {
            for (const auto& s : students) {
                if (s.getId() == id) return &s;
            }
            return nullptr;
        }

        // 查找学生（通过姓名）
        std::vector<Student*> findByName(const std::string& name) {
            std::vector<Student*> result;
            for (auto& s : students) {
                if (s.getName() == name) {
                    result.push_back(&s);
                }
            }
            return result;
        }

        // 查找学生（通过班级）
        std::vector<Student*> findByClass(const std::string& className) {
            std::vector<Student*> result;
            for (auto& s : students) {
                if (s.getClassName() == className) {
                    result.push_back(&s);
                }
            }
            return result;
        }

        // 获取所有学生
        const std::vector<Student>& getAllStudents() const {
            return students;
        }

        // 获取学生数量
        size_t getCount() const { return students.size(); }

        // 判断是否为空
        bool isEmpty() const { return students.empty(); }

        // 清空所有学生
        void clear() {
            students.clear();
            std::cout << "所有学生数据已清空" << std::endl;
        }

        // ===== 排序 =====

        // 按平均分排序（降序）
        void sortByAverage() {
            std::sort(students.begin(), students.end());
        }

        // 按学号排序
        void sortById() {
            std::sort(students.begin(), students.end(),
                      [](const Student& a, const Student& b) {
                          return a.getId() < b.getId();
                      });
        }

        // 按姓名排序
        void sortByName() {
            std::sort(students.begin(), students.end(),
                      [](const Student& a, const Student& b) {
                          return a.getName() < b.getName();
                      });
        }

        // ===== 统计 =====

        // 计算班级平均分
        double getClassAverage() const {
            if (students.empty()) return 0.0;
            double total = 0.0;
            for (const auto& s : students) {
                total += s.getAverageScore();
            }
            return total / students.size();
        }

        // 获取最高分学生
        const Student* getTopStudent() const {
            if (students.empty()) return nullptr;
            const Student* top = &students[0];
            for (const auto& s : students) {
                if (s.getAverageScore() > top->getAverageScore()) {
                    top = &s;
                }
            }
            return top;
        }

        // 获取最低分学生
        const Student* getBottomStudent() const {
            if (students.empty()) return nullptr;
            const Student* bottom = &students[0];
            for (const auto& s : students) {
                if (s.getAverageScore() < bottom->getAverageScore()) {
                    bottom = &s;
                }
            }
            return bottom;
        }

        // 计算各科平均分
        Scores getSubjectAverages() const {
            if (students.empty()) return Scores();
            Scores totals;
            for (const auto& s : students) {
                totals.math += s.getMath();
                totals.english += s.getEnglish();
                totals.programming += s.getProgramming();
                totals.physics += s.getPhysics();
                totals.chemistry += s.getChemistry();
            }
            size_t n = students.size();
            return Scores(totals.math / n, totals.english / n,
                          totals.programming / n, totals.physics / n,
                          totals.chemistry / n);
        }

        // 计算及格率
        double getPassRate(double passLine = 60.0) const {
            if (students.empty()) return 0.0;
            int passed = 0;
            for (const auto& s : students) {
                if (s.hasPassedAll(passLine)) passed++;
            }
            return 100.0 * passed / students.size();
        }

        // 获取成绩分布
        std::vector<int> getGradeDistribution() const {
            std::vector<int> dist(5, 0);  // 优秀, 良好, 中等, 及格, 不及格
            for (const auto& s : students) {
                std::string grade = s.getGrade();
                if (grade == "优秀") dist[0]++;
                else if (grade == "良好") dist[1]++;
                else if (grade == "中等") dist[2]++;
                else if (grade == "及格") dist[3]++;
                else dist[4]++;
            }
            return dist;
        }

    private:
        // 查找迭代器
        std::vector<Student>::iterator findIteratorById(int id) {
            return std::find_if(students.begin(), students.end(),
                                [id](const Student& s) { return s.getId() == id; });
        }
    };
}
```

## 显示模块

```cpp
// ===== 显示命名空间 =====
namespace Display {

    using Model::Student;
    using Management::StudentManager;

    void printLine(char ch = '-', int width = 100) {
        for (int i = 0; i < width; i++) std::cout << ch;
        std::cout << std::endl;
    }

    void printHeader(const std::string& title) {
        printLine('=', 100);
        std::cout << "  " << title << std::endl;
        printLine('=', 100);
    }

    void printTableHeader() {
        printLine('-', 100);
        std::cout << std::left
                  << std::setw(6) << "学号"
                  << std::setw(10) << "姓名"
                  << std::setw(4) << "年龄"
                  << std::setw(10) << "班级"
                  << std::setw(8) << "数学"
                  << std::setw(8) << "英语"
                  << std::setw(8) << "编程"
                  << std::setw(8) << "物理"
                  << std::setw(8) << "化学"
                  << std::setw(8) << "平均分"
                  << std::setw(8) << "等级"
                  << std::endl;
        printLine('-', 100);
    }

    void printStudent(const Student& s) {
        std::cout << s << std::endl;
    }

    void printStudentDetail(const Student& s) {
        printHeader("学生详细信息");
        std::cout << "  学号:     " << s.getId() << std::endl;
        std::cout << "  姓名:     " << s.getName() << std::endl;
        std::cout << "  年龄:     " << s.getAge() << " 岁" << std::endl;
        std::cout << "  班级:     " << s.getClassName() << std::endl;
        std::cout << "  数学:     " << s.getMath() << std::endl;
        std::cout << "  英语:     " << s.getEnglish() << std::endl;
        std::cout << "  编程:     " << s.getProgramming() << std::endl;
        std::cout << "  物理:     " << s.getPhysics() << std::endl;
        std::cout << "  化学:     " << s.getChemistry() << std::endl;
        std::cout << "  总分:     " << s.getTotalScore() << std::endl;
        std::cout << "  平均分:   " << std::fixed << std::setprecision(2) << s.getAverageScore() << std::endl;
        std::cout << "  等级:     " << s.getGrade() << std::endl;
        std::cout << "  备注:     " << s.getRemark() << std::endl;
        printLine('=', 100);
    }

    void printAllStudents(const StudentManager& manager) {
        if (manager.isEmpty()) {
            printHeader("学生列表为空");
            return;
        }

        printHeader("学生列表 (共 " + std::to_string(manager.getCount()) + " 人)");
        printTableHeader();

        for (const auto& s : manager.getAllStudents()) {
            printStudent(s);
        }
        printLine('-', 100);
    }

    void printRanking(const StudentManager& manager) {
        if (manager.isEmpty()) {
            printHeader("排名列表为空");
            return;
        }

        printHeader("学生成绩排名");

        // 复制并按平均分排序
        std::vector<Student> sorted = manager.getAllStudents();
        std::sort(sorted.begin(), sorted.end());

        std::cout << std::left
                  << std::setw(6) << "排名"
                  << std::setw(6) << "学号"
                  << std::setw(10) << "姓名"
                  << std::setw(8) << "平均分"
                  << std::setw(8) << "等级"
                  << std::endl;
        printLine('-', 40);

        int rank = 1;
        for (const auto& s : sorted) {
            std::cout << std::setw(6) << rank++
                      << std::setw(6) << s.getId()
                      << std::setw(10) << s.getName()
                      << std::setw(8) << std::fixed << std::setprecision(2) << s.getAverageScore()
                      << std::setw(8) << s.getGrade()
                      << std::endl;
        }
        printLine('-', 40);
    }

    void printStatistics(const StudentManager& manager) {
        printHeader("成绩统计报告");

        if (manager.isEmpty()) {
            std::cout << "  无数据" << std::endl;
            return;
        }

        std::cout << "  学生总数:     " << manager.getCount() << " 人" << std::endl;
        std::cout << "  班级平均分:   " << std::fixed << std::setprecision(2) << manager.getClassAverage() << std::endl;
        std::cout << "  全科及格率:   " << std::setprecision(1) << manager.getPassRate() << "%" << std::endl;

        const Student* top = manager.getTopStudent();
        if (top) {
            std::cout << "  最高分:       " << top->getName() << " (" << top->getAverageScore() << ")" << std::endl;
        }

        const Student* bottom = manager.getBottomStudent();
        if (bottom) {
            std::cout << "  最低分:       " << bottom->getName() << " (" << bottom->getAverageScore() << ")" << std::endl;
        }

        // 各科平均分
        Model::Scores avgScores = manager.getSubjectAverages();
        std::cout << "\n  各科平均分:" << std::endl;
        std::cout << "    数学: " << avgScores.math << std::endl;
        std::cout << "    英语: " << avgScores.english << std::endl;
        std::cout << "    编程: " << avgScores.programming << std::endl;
        std::cout << "    物理: " << avgScores.physics << std::endl;
        std::cout << "    化学: " << avgScores.chemistry << std::endl;

        // 成绩分布
        auto dist = manager.getGradeDistribution();
        std::cout << "\n  成绩分布:" << std::endl;
        std::cout << "    优秀(>=90): " << dist[0] << " 人" << std::endl;
        std::cout << "    良好(>=80): " << dist[1] << " 人" << std::endl;
        std::cout << "    中等(>=70): " << dist[2] << " 人" << std::endl;
        std::cout << "    及格(>=60): " << dist[3] << " 人" << std::endl;
        std::cout << "    不及格(<60): " << dist[4] << " 人" << std::endl;

        printLine('=', 100);
    }
}
```

## 文件操作模块

```cpp
namespace FileIO {

    using Management::StudentManager;
    using Model::Student;
    using Model::Scores;

    bool saveToFile(const StudentManager& manager, const std::string& filename) {
        std::ofstream file(filename);
        if (!file.is_open()) {
            std::cerr << "无法打开文件: " << filename << std::endl;
            return false;
        }

        file << "# Student Management System Data File" << std::endl;
        file << "# Format: id,name,age,class,math,english,programming,physics,chemistry,remark" << std::endl;

        for (const auto& s : manager.getAllStudents()) {
            file << s.getId() << ","
                 << s.getName() << ","
                 << s.getAge() << ","
                 << s.getClassName() << ","
                 << s.getMath() << ","
                 << s.getEnglish() << ","
                 << s.getProgramming() << ","
                 << s.getPhysics() << ","
                 << s.getChemistry() << ","
                 << s.getRemark() << std::endl;
        }

        file.close();
        std::cout << "数据已保存到 " << filename << " (共 " << manager.getCount() << " 条记录)" << std::endl;
        return true;
    }

    bool loadFromFile(StudentManager& manager, const std::string& filename) {
        std::ifstream file(filename);
        if (!file.is_open()) {
            std::cerr << "无法打开文件: " << filename << std::endl;
            return false;
        }

        manager.clear();
        int maxId = 0;
        int loadedCount = 0;

        std::string line;
        while (std::getline(file, line)) {
            if (line.empty() || line[0] == '#') continue;

            std::stringstream ss(line);
            std::vector<std::string> tokens;
            std::string token;

            while (std::getline(ss, token, ',')) {
                tokens.push_back(token);
            }

            if (tokens.size() >= 9) {
                try {
                    int id = std::stoi(tokens[0]);
                    const std::string& name = tokens[1];
                    int age = std::stoi(tokens[2]);
                    const std::string& className = tokens[3];
                    Scores scores(
                        std::stod(tokens[4]),
                        std::stod(tokens[5]),
                        std::stod(tokens[6]),
                        std::stod(tokens[7]),
                        std::stod(tokens[8])
                    );
                    std::string remark = tokens.size() > 9 ? tokens[9] : "";

                    Student s(name, age, className, scores, remark);
                    s.setId(id);
                    manager.addStudent(s);

                    if (id > maxId) maxId = id;
                    loadedCount++;
                } catch (const std::exception& e) {
                    std::cerr << "解析行失败: " << line << " (" << e.what() << ")" << std::endl;
                }
            }
        }

        if (maxId > 0) {
            Student::setNextId(maxId + 1);
        }

        file.close();
        std::cout << "从 " << filename << " 加载了 " << loadedCount << " 条记录" << std::endl;
        return true;
    }
}
```

## 交互式菜单

```cpp
namespace UserInterface {

    using Management::StudentManager;
    using Model::Student;
    using Model::Scores;

    void showMenu() {
        Display::printHeader("学生成绩管理系统 v3.0");
        std::cout << "  1. 添加学生" << std::endl;
        std::cout << "  2. 删除学生" << std::endl;
        std::cout << "  3. 修改学生信息" << std::endl;
        std::cout << "  4. 修改学生成绩" << std::endl;
        std::cout << "  5. 查询学生" << std::endl;
        std::cout << "  6. 显示所有学生" << std::endl;
        std::cout << "  7. 成绩排名" << std::endl;
        std::cout << "  8. 成绩统计" << std::endl;
        std::cout << "  9. 保存到文件" << std::endl;
        std::cout << " 10. 从文件加载" << std::endl;
        std::cout << "  0. 退出系统" << std::endl;
        Display::printLine('=', 100);
        std::cout << "请选择操作 [0-10]: ";
    }

    void addStudent(StudentManager& manager) {
        Display::printHeader("添加学生");

        std::string name, className;
        int age;
        Scores scores;

        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        std::cout << "请输入姓名: ";
        std::getline(std::cin, name);

        std::cout << "请输入年龄: ";
        std::cin >> age;
        std::cin.ignore();

        std::cout << "请输入班级: ";
        std::getline(std::cin, className);

        std::cout << "请输入数学成绩: "; std::cin >> scores.math;
        std::cout << "请输入英语成绩: "; std::cin >> scores.english;
        std::cout << "请输入编程成绩: "; std::cin >> scores.programming;
        std::cout << "请输入物理成绩: "; std::cin >> scores.physics;
        std::cout << "请输入化学成绩: "; std::cin >> scores.chemistry;

        manager.addStudent(name, age, className, scores);
    }

    void deleteStudent(StudentManager& manager) {
        Display::printHeader("删除学生");
        if (manager.isEmpty()) {
            std::cout << "列表为空。" << std::endl;
            return;
        }
        int id;
        std::cout << "请输入要删除的学号: ";
        std::cin >> id;
        manager.removeStudent(id);
    }

    void modifyStudent(StudentManager& manager) {
        Display::printHeader("修改学生信息");
        if (manager.isEmpty()) {
            std::cout << "列表为空。" << std::endl;
            return;
        }
        int id;
        std::cout << "请输入要修改的学号: ";
        std::cin >> id;

        Student* s = manager.findById(id);
        if (!s) {
            std::cout << "学号 " << id << " 不存在！" << std::endl;
            return;
        }

        std::cout << "当前信息: " << s->getName() << " | " << s->getAge() << "岁 | " << s->getClassName() << std::endl;

        std::string name, className;
        int age;
        std::cin.ignore();
        std::cout << "请输入新姓名 (直接回车保持不变): ";
        std::getline(std::cin, name);
        if (!name.empty()) s->setName(name);

        std::cout << "请输入新年龄 (输入0保持不变): ";
        std::cin >> age;
        if (age > 0) s->setAge(age);

        std::cin.ignore();
        std::cout << "请输入新班级 (直接回车保持不变): ";
        std::getline(std::cin, className);
        if (!className.empty()) s->setClassName(className);

        std::cout << "修改成功！" << std::endl;
    }

    void modifyScores(StudentManager& manager) {
        Display::printHeader("修改学生成绩");
        if (manager.isEmpty()) {
            std::cout << "列表为空。" << std::endl;
            return;
        }
        int id;
        std::cout << "请输入要修改的学号: ";
        std::cin >> id;

        Student* s = manager.findById(id);
        if (!s) {
            std::cout << "学号 " << id << " 不存在！" << std::endl;
            return;
        }

        Scores scores;
        std::cout << "当前成绩: 数学=" << s->getMath() << " 英语=" << s->getEnglish()
                  << " 编程=" << s->getProgramming() << " 物理=" << s->getPhysics()
                  << " 化学=" << s->getChemistry() << std::endl;

        std::cout << "请输入新成绩 (输入-1保持不变):" << std::endl;
        std::cout << "数学: "; std::cin >> scores.math;
        std::cout << "英语: "; std::cin >> scores.english;
        std::cout << "编程: "; std::cin >> scores.programming;
        std::cout << "物理: "; std::cin >> scores.physics;
        std::cout << "化学: "; std::cin >> scores.chemistry;

        if (scores.math >= 0) s->setMath(scores.math);
        if (scores.english >= 0) s->setEnglish(scores.english);
        if (scores.programming >= 0) s->setProgramming(scores.programming);
        if (scores.physics >= 0) s->setPhysics(scores.physics);
        if (scores.chemistry >= 0) s->setChemistry(scores.chemistry);

        std::cout << "成绩修改成功！" << std::endl;
    }

    void queryStudent(const StudentManager& manager) {
        Display::printHeader("查询学生");
        if (manager.isEmpty()) {
            std::cout << "列表为空。" << std::endl;
            return;
        }
        int id;
        std::cout << "请输入学号: ";
        std::cin >> id;

        const Student* s = manager.findById(id);
        if (s) {
            Display::printStudentDetail(*s);
        } else {
            std::cout << "学号 " << id << " 不存在！" << std::endl;
        }
    }

    void run(StudentManager& manager) {
        bool running = true;
        while (running) {
            showMenu();
            int choice;
            std::cin >> choice;

            if (std::cin.fail()) {
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                std::cout << "请输入有效数字！" << std::endl;
                continue;
            }

            std::cout << std::endl;
            switch (choice) {
                case 1: addStudent(manager); break;
                case 2: deleteStudent(manager); break;
                case 3: modifyStudent(manager); break;
                case 4: modifyScores(manager); break;
                case 5: queryStudent(manager); break;
                case 6: Display::printAllStudents(manager); break;
                case 7: Display::printRanking(manager); break;
                case 8: Display::printStatistics(manager); break;
                case 9: FileIO::saveToFile(manager, "students.txt"); break;
                case 10: FileIO::loadFromFile(manager, "students.txt"); break;
                case 0:
                    std::cout << "感谢使用！再见！" << std::endl;
                    running = false;
                    break;
                default:
                    std::cout << "无效选择！" << std::endl;
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

## 主函数

```cpp
int main() {
    #ifdef _WIN32
        system("chcp 65001 > nul");
    #endif

    Management::StudentManager manager;

    // 预加载示例数据
    std::cout << "====== 加载示例数据 ======" << std::endl;
    manager.addStudent("张三", 20, "计算机科学1班", Model::Scores(92.5, 88.0, 95.0, 85.0, 90.0));
    manager.addStudent("李四", 21, "计算机科学1班", Model::Scores(78.0, 85.5, 82.0, 76.0, 80.0));
    manager.addStudent("王五", 19, "计算机科学2班", Model::Scores(96.0, 91.0, 98.5, 93.0, 95.0));
    manager.addStudent("赵六", 22, "软件工程1班", Model::Scores(65.0, 72.5, 70.0, 68.0, 71.0));
    manager.addStudent("孙七", 20, "软件工程2班", Model::Scores(88.0, 90.5, 86.0, 84.0, 89.0));
    manager.addStudent("周八", 21, "计算机科学1班", Model::Scores(73.5, 68.0, 75.0, 70.0, 72.0));
    manager.addStudent("吴九", 20, "计算机科学2班", Model::Scores(99.0, 97.0, 95.5, 98.0, 96.0));
    manager.addStudent("郑十", 23, "软件工程1班", Model::Scores(55.0, 60.0, 58.0, 52.0, 56.0));
    std::cout << "====== 示例数据加载完成 ======" << std::endl;

    UserInterface::run(manager);
    return 0;
}
```

## 编译运行

将上述所有代码放在一个文件中，使用以下命令编译：

```bash
g++ -std=c++17 -o student_manager student_system.cpp
./student_manager
```

## 总结

本文通过一个完整的Student管理系统，综合运用了C++类与对象系列的所有知识点，展示了面向对象程序设计在实际项目中的应用。

### 核心要点回顾

1. **封装**：使用`private`成员变量存储学生数据，通过`public`的getter/setter方法提供访问接口，确保数据的完整性和安全性。

2. **构造函数和析构函数**：提供了默认构造函数、带参构造函数和拷贝构造函数，使用初始化列表高效初始化成员，在析构函数中更新静态统计信息。

3. **运算符重载**：重载了`<<`流输出运算符、`==`相等比较运算符、`<`和`>`比较运算符，使得Student对象可以像内置类型一样自然地使用。

4. **静态成员**：使用`static`成员变量统计学生总数和自动生成学号，使用`static`成员函数提供全局访问接口。

5. **友元**：使用`friend`声明流输出和输入运算符为友元函数，使其能够访问私有成员。

6. **const成员函数**：Getter方法全部声明为const，确保不会意外修改对象状态，同时允许在const上下文中使用。

7. **命名空间**：使用`Model`、`Management`、`Display`、`FileIO`、`UserInterface`五个命名空间组织代码，每个模块职责清晰，互不干扰。

8. **std::vector**：使用`std::vector<Student>`管理学生对象，利用标准库的排序、查找等算法简化代码。

这个项目展示了C++面向对象编程的核心价值：通过封装、继承和多态（虽然本项目主要使用封装），我们可以构建出结构清晰、易于维护、可扩展的大型软件系统。
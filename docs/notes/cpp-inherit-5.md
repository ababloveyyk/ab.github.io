---
title: C++继承与多态Ⅴ——综合实战：图形系统
date: 2026-07-26
tags:
  - C++
  - 继承
  - 多态
  - 图形系统
  - 工厂模式
categories:
  - C++
---

## 一、项目概述

本篇文章将构建一个完整的图形系统，综合运用前四篇文章所学的所有知识：继承、多继承、虚继承、虚函数、纯虚函数、抽象类、虚析构函数、override和final关键字。我们将从零开始设计一个可扩展的图形系统，支持多种图形类型、面积计算、排序、工厂模式创建等功能。

### 1.1 项目结构

```
图形系统架构：
├── Shape（抽象基类）
│   ├── Circle（圆形）
│   ├── Rectangle（矩形）
│   ├── Triangle（三角形）
│   ├── Square（正方形，继承Rectangle）
│   └── Ellipse（椭圆）
├── ShapeFactory（简单工厂）
├── ShapeManager（图形管理器）
└── 辅助功能：面积计算、排序、统计
```

### 1.2 设计原则

- **开闭原则**：对扩展开放，对修改封闭。新增图形类型只需添加新的派生类。
- **里氏替换原则**：所有派生类都能替换基类Shape使用。
- **接口隔离原则**：Shape只定义必要的接口。
- **依赖倒置原则**：高层模块依赖抽象（Shape），不依赖具体实现。

## 二、Shape抽象基类设计

### 2.1 Shape基类定义

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <sstream>
#include <stdexcept>
using namespace std;

// 颜色枚举
enum class Color {
    RED, GREEN, BLUE, YELLOW, BLACK, WHITE, 
    ORANGE, PURPLE, CYAN, GRAY
};

// 颜色辅助函数
string colorToString(Color c) {
    switch (c) {
        case Color::RED:    return "红色";
        case Color::GREEN:  return "绿色";
        case Color::BLUE:   return "蓝色";
        case Color::YELLOW: return "黄色";
        case Color::BLACK:  return "黑色";
        case Color::WHITE:  return "白色";
        case Color::ORANGE: return "橙色";
        case Color::PURPLE: return "紫色";
        case Color::CYAN:   return "青色";
        case Color::GRAY:   return "灰色";
        default: return "未知";
    }
}

// 抽象基类：Shape
class Shape {
protected:
    string name;
    Color color;
    static int shapeCount;  // 静态成员：统计创建的图形总数
    
public:
    Shape(const string& n, Color c) : name(n), color(c) {
        shapeCount++;
    }
    
    virtual ~Shape() {
        shapeCount--;
    }
    
    // 纯虚函数：计算面积
    virtual double calcArea() const = 0;
    
    // 纯虚函数：计算周长
    virtual double calcPerimeter() const = 0;
    
    // 虚函数：获取详细信息
    virtual string getInfo() const {
        ostringstream oss;
        oss << name << " [颜色: " << colorToString(color) 
            << ", 面积: " << fixed << setprecision(2) << calcArea()
            << ", 周长: " << calcPerimeter() << "]";
        return oss.str();
    }
    
    // 虚函数：缩放
    virtual void scale(double factor) = 0;
    
    // 获取名称
    string getName() const { return name; }
    Color getColor() const { return color; }
    
    // 静态方法：获取图形总数
    static int getShapeCount() { return shapeCount; }
    
    // 比较运算符（用于排序）
    bool operator<(const Shape& other) const {
        return calcArea() < other.calcArea();
    }
};

int Shape::shapeCount = 0;
```

## 三、派生类实现

### 3.1 Circle（圆形）

```cpp
class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r, Color c = Color::BLUE) 
        : Shape("圆形", c), radius(r) {
        if (r <= 0) {
            throw invalid_argument("圆的半径必须大于0");
        }
    }
    
    double calcArea() const override {
        return M_PI * radius * radius;
    }
    
    double calcPerimeter() const override {
        return 2 * M_PI * radius;
    }
    
    void scale(double factor) override {
        if (factor <= 0) {
            throw invalid_argument("缩放因子必须大于0");
        }
        radius *= factor;
    }
    
    double getRadius() const { return radius; }
    
    string getInfo() const override {
        ostringstream oss;
        oss << name << " [颜色: " << colorToString(color)
            << ", 半径: " << radius
            << ", 面积: " << fixed << setprecision(2) << calcArea()
            << ", 周长: " << calcPerimeter() << "]";
        return oss.str();
    }
};
```

### 3.2 Rectangle（矩形）

```cpp
class Rectangle : public Shape {
protected:  // 注意：protected以便Square继承
    double width;
    double height;
    
public:
    Rectangle(double w, double h, Color c = Color::GREEN)
        : Shape("矩形", c), width(w), height(h) {
        if (w <= 0 || h <= 0) {
            throw invalid_argument("矩形的宽和高必须大于0");
        }
    }
    
    double calcArea() const override {
        return width * height;
    }
    
    double calcPerimeter() const override {
        return 2 * (width + height);
    }
    
    void scale(double factor) override {
        if (factor <= 0) {
            throw invalid_argument("缩放因子必须大于0");
        }
        width *= factor;
        height *= factor;
    }
    
    double getWidth() const { return width; }
    double getHeight() const { return height; }
    
    string getInfo() const override {
        ostringstream oss;
        oss << name << " [颜色: " << colorToString(color)
            << ", 宽: " << width << ", 高: " << height
            << ", 面积: " << fixed << setprecision(2) << calcArea()
            << ", 周长: " << calcPerimeter() << "]";
        return oss.str();
    }
};
```

### 3.3 Square（正方形，继承Rectangle）

```cpp
class Square : public Rectangle {
public:
    Square(double side, Color c = Color::RED)
        : Rectangle(side, side, c) {
        name = "正方形";  // 修改从Rectangle继承的name
    }
    
    // 正方形有特殊的setSide方法
    void setSide(double side) {
        if (side <= 0) {
            throw invalid_argument("正方形的边长必须大于0");
        }
        width = height = side;
    }
    
    double getSide() const { return width; }
    
    string getInfo() const override {
        ostringstream oss;
        oss << name << " [颜色: " << colorToString(color)
            << ", 边长: " << width
            << ", 面积: " << fixed << setprecision(2) << calcArea()
            << ", 周长: " << calcPerimeter() << "]";
        return oss.str();
    }
};
```

### 3.4 Triangle（三角形）

```cpp
class Triangle : public Shape {
private:
    double sideA, sideB, sideC;
    
    // 验证三边是否能构成三角形
    static bool isValidTriangle(double a, double b, double c) {
        return (a + b > c) && (a + c > b) && (b + c > a);
    }
    
public:
    Triangle(double a, double b, double c, Color col = Color::YELLOW)
        : Shape("三角形", col), sideA(a), sideB(b), sideC(c) {
        if (a <= 0 || b <= 0 || c <= 0) {
            throw invalid_argument("三角形的边长必须大于0");
        }
        if (!isValidTriangle(a, b, c)) {
            throw invalid_argument("无法构成三角形：任意两边之和必须大于第三边");
        }
    }
    
    double calcArea() const override {
        // 海伦公式
        double s = (sideA + sideB + sideC) / 2.0;
        return sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
    }
    
    double calcPerimeter() const override {
        return sideA + sideB + sideC;
    }
    
    void scale(double factor) override {
        if (factor <= 0) {
            throw invalid_argument("缩放因子必须大于0");
        }
        sideA *= factor;
        sideB *= factor;
        sideC *= factor;
    }
    
    string getInfo() const override {
        ostringstream oss;
        oss << name << " [颜色: " << colorToString(color)
            << ", 边长: (" << sideA << ", " << sideB << ", " << sideC << ")"
            << ", 面积: " << fixed << setprecision(2) << calcArea()
            << ", 周长: " << calcPerimeter() << "]";
        return oss.str();
    }
    
    // 判断三角形类型
    string getTriangleType() const {
        if (fabs(sideA - sideB) < 1e-9 && fabs(sideB - sideC) < 1e-9) {
            return "等边三角形";
        } else if (fabs(sideA - sideB) < 1e-9 || fabs(sideB - sideC) < 1e-9 
                   || fabs(sideA - sideC) < 1e-9) {
            return "等腰三角形";
        } else {
            // 检查是否为直角三角形
            double a2 = sideA * sideA;
            double b2 = sideB * sideB;
            double c2 = sideC * sideC;
            if (fabs(a2 + b2 - c2) < 1e-9 || fabs(a2 + c2 - b2) < 1e-9 
                || fabs(b2 + c2 - a2) < 1e-9) {
                return "直角三角形";
            }
            return "普通三角形";
        }
    }
};
```

### 3.5 Ellipse（椭圆）

```cpp
class Ellipse : public Shape {
private:
    double semiMajorAxis;  // 半长轴
    double semiMinorAxis;  // 半短轴
    
public:
    Ellipse(double a, double b, Color c = Color::PURPLE)
        : Shape("椭圆", c), semiMajorAxis(max(a, b)), semiMinorAxis(min(a, b)) {
        if (a <= 0 || b <= 0) {
            throw invalid_argument("椭圆的半轴必须大于0");
        }
    }
    
    double calcArea() const override {
        return M_PI * semiMajorAxis * semiMinorAxis;
    }
    
    double calcPerimeter() const override {
        // 椭圆周长的近似公式（Ramanujan公式）
        double h = pow(semiMajorAxis - semiMinorAxis, 2) 
                   / pow(semiMajorAxis + semiMinorAxis, 2);
        return M_PI * (semiMajorAxis + semiMinorAxis) 
               * (1 + 3 * h / (10 + sqrt(4 - 3 * h)));
    }
    
    void scale(double factor) override {
        if (factor <= 0) {
            throw invalid_argument("缩放因子必须大于0");
        }
        semiMajorAxis *= factor;
        semiMinorAxis *= factor;
    }
    
    string getInfo() const override {
        ostringstream oss;
        oss << name << " [颜色: " << colorToString(color)
            << ", 半长轴: " << semiMajorAxis 
            << ", 半短轴: " << semiMinorAxis
            << ", 面积: " << fixed << setprecision(2) << calcArea()
            << ", 周长: " << calcPerimeter() << "]";
        return oss.str();
    }
    
    double getEccentricity() const {
        // 离心率
        return sqrt(1 - pow(semiMinorAxis / semiMajorAxis, 2));
    }
};
```

## 四、简单工厂模式

### 4.1 ShapeFactory设计

```cpp
class ShapeFactory {
public:
    enum class ShapeType {
        CIRCLE,
        RECTANGLE,
        SQUARE,
        TRIANGLE,
        ELLIPSE
    };
    
    // 创建圆形
    static unique_ptr<Shape> createCircle(double radius, Color c = Color::BLUE) {
        return make_unique<Circle>(radius, c);
    }
    
    // 创建矩形
    static unique_ptr<Shape> createRectangle(double width, double height, 
                                              Color c = Color::GREEN) {
        return make_unique<Rectangle>(width, height, c);
    }
    
    // 创建正方形
    static unique_ptr<Shape> createSquare(double side, Color c = Color::RED) {
        return make_unique<Square>(side, c);
    }
    
    // 创建三角形
    static unique_ptr<Shape> createTriangle(double a, double b, double c,
                                             Color col = Color::YELLOW) {
        return make_unique<Triangle>(a, b, c, col);
    }
    
    // 创建椭圆
    static unique_ptr<Shape> createEllipse(double a, double b, 
                                            Color c = Color::PURPLE) {
        return make_unique<Ellipse>(a, b, c);
    }
    
    // 统一创建方法
    static unique_ptr<Shape> createShape(ShapeType type, 
                                          const vector<double>& params,
                                          Color c = Color::BLUE) {
        switch (type) {
            case ShapeType::CIRCLE:
                if (params.size() < 1) throw invalid_argument("圆形需要1个参数（半径）");
                return make_unique<Circle>(params[0], c);
                
            case ShapeType::RECTANGLE:
                if (params.size() < 2) throw invalid_argument("矩形需要2个参数（宽、高）");
                return make_unique<Rectangle>(params[0], params[1], c);
                
            case ShapeType::SQUARE:
                if (params.size() < 1) throw invalid_argument("正方形需要1个参数（边长）");
                return make_unique<Square>(params[0], c);
                
            case ShapeType::TRIANGLE:
                if (params.size() < 3) throw invalid_argument("三角形需要3个参数（三边）");
                return make_unique<Triangle>(params[0], params[1], params[2], c);
                
            case ShapeType::ELLIPSE:
                if (params.size() < 2) throw invalid_argument("椭圆需要2个参数（半轴）");
                return make_unique<Ellipse>(params[0], params[1], c);
                
            default:
                throw invalid_argument("未知的图形类型");
        }
    }
};
```

## 五、ShapeManager图形管理器

### 5.1 ShapeManager设计

```cpp
class ShapeManager {
private:
    vector<unique_ptr<Shape>> shapes;
    
public:
    // 添加图形
    void addShape(unique_ptr<Shape> shape) {
        shapes.push_back(move(shape));
    }
    
    // 获取图形数量
    size_t size() const {
        return shapes.size();
    }
    
    // 计算总面积
    double getTotalArea() const {
        double total = 0;
        for (const auto& shape : shapes) {
            total += shape->calcArea();
        }
        return total;
    }
    
    // 计算总周长
    double getTotalPerimeter() const {
        double total = 0;
        for (const auto& shape : shapes) {
            total += shape->calcPerimeter();
        }
        return total;
    }
    
    // 按面积排序（升序）
    void sortByArea() {
        sort(shapes.begin(), shapes.end(),
             [](const unique_ptr<Shape>& a, const unique_ptr<Shape>& b) {
                 return a->calcArea() < b->calcArea();
             });
    }
    
    // 按面积排序（降序）
    void sortByAreaDesc() {
        sort(shapes.begin(), shapes.end(),
             [](const unique_ptr<Shape>& a, const unique_ptr<Shape>& b) {
                 return a->calcArea() > b->calcArea();
             });
    }
    
    // 按周长排序
    void sortByPerimeter() {
        sort(shapes.begin(), shapes.end(),
             [](const unique_ptr<Shape>& a, const unique_ptr<Shape>& b) {
                 return a->calcPerimeter() < b->calcPerimeter();
             });
    }
    
    // 按名称排序
    void sortByName() {
        sort(shapes.begin(), shapes.end(),
             [](const unique_ptr<Shape>& a, const unique_ptr<Shape>& b) {
                 return a->getName() < b->getName();
             });
    }
    
    // 查找面积最大的图形
    const Shape* getMaxAreaShape() const {
        if (shapes.empty()) return nullptr;
        return max_element(shapes.begin(), shapes.end(),
            [](const unique_ptr<Shape>& a, const unique_ptr<Shape>& b) {
                return a->calcArea() < b->calcArea();
            })->get();
    }
    
    // 查找面积最小的图形
    const Shape* getMinAreaShape() const {
        if (shapes.empty()) return nullptr;
        return min_element(shapes.begin(), shapes.end(),
            [](const unique_ptr<Shape>& a, const unique_ptr<Shape>& b) {
                return a->calcArea() < b->calcArea();
            })->get();
    }
    
    // 按颜色筛选
    vector<const Shape*> getShapesByColor(Color c) const {
        vector<const Shape*> result;
        for (const auto& shape : shapes) {
            if (shape->getColor() == c) {
                result.push_back(shape.get());
            }
        }
        return result;
    }
    
    // 显示所有图形信息
    void displayAll() const {
        cout << "========== 图形列表（共" << shapes.size() << "个） ==========" << endl;
        for (size_t i = 0; i < shapes.size(); i++) {
            cout << "  [" << (i + 1) << "] " << shapes[i]->getInfo() << endl;
        }
        cout << "========================================" << endl;
    }
    
    // 统一缩放所有图形
    void scaleAll(double factor) {
        for (auto& shape : shapes) {
            shape->scale(factor);
        }
    }
    
    // 统计信息
    void displayStatistics() const {
        cout << "========== 图形统计信息 ==========" << endl;
        cout << "图形总数：" << shapes.size() << endl;
        cout << "总有图形数（静态）：" << Shape::getShapeCount() << endl;
        cout << "总面积：" << fixed << setprecision(2) << getTotalArea() << endl;
        cout << "总周长：" << getTotalPerimeter() << endl;
        if (!shapes.empty()) {
            cout << "平均面积：" << (getTotalArea() / shapes.size()) << endl;
            cout << "最大面积图形：" << getMaxAreaShape()->getInfo() << endl;
            cout << "最小面积图形：" << getMinAreaShape()->getInfo() << endl;
        }
        cout << "===================================" << endl;
    }
    
    // 清除所有图形
    void clear() {
        shapes.clear();
    }
};
```

## 六、综合演示

### 6.1 完整主程序

```cpp
int main() {
    cout << "╔══════════════════════════════════════╗" << endl;
    cout << "║      C++ 图形系统 - 综合演示        ║" << endl;
    cout << "╚══════════════════════════════════════╝" << endl;
    cout << endl;
    
    ShapeManager manager;
    
    // ========== 第一部分：创建图形 ==========
    cout << "========== 第一部分：创建图形 ==========\n" << endl;
    
    // 使用工厂创建各种图形
    manager.addShape(ShapeFactory::createCircle(5.0, Color::BLUE));
    manager.addShape(ShapeFactory::createCircle(3.0, Color::CYAN));
    manager.addShape(ShapeFactory::createRectangle(4.0, 6.0, Color::GREEN));
    manager.addShape(ShapeFactory::createRectangle(10.0, 2.0, Color::ORANGE));
    manager.addShape(ShapeFactory::createSquare(4.0, Color::RED));
    manager.addShape(ShapeFactory::createSquare(7.0, Color::PURPLE));
    manager.addShape(ShapeFactory::createTriangle(3.0, 4.0, 5.0, Color::YELLOW));
    manager.addShape(ShapeFactory::createTriangle(6.0, 6.0, 6.0, Color::GRAY));
    manager.addShape(ShapeFactory::createEllipse(5.0, 3.0, Color::PURPLE));
    manager.addShape(ShapeFactory::createEllipse(4.0, 4.0, Color::WHITE));
    
    manager.displayAll();
    
    // ========== 第二部分：统计信息 ==========
    cout << "\n========== 第二部分：统计信息 ==========\n" << endl;
    manager.displayStatistics();
    
    // ========== 第三部分：按面积排序 ==========
    cout << "\n========== 第三部分：按面积排序（升序） ==========\n" << endl;
    manager.sortByArea();
    manager.displayAll();
    
    // ========== 第四部分：按面积排序（降序） ==========
    cout << "\n========== 第四部分：按面积排序（降序） ==========\n" << endl;
    manager.sortByAreaDesc();
    manager.displayAll();
    
    // ========== 第五部分：按周长排序 ==========
    cout << "\n========== 第五部分：按周长排序 ==========\n" << endl;
    manager.sortByPerimeter();
    manager.displayAll();
    
    // ========== 第六部分：缩放演示 ==========
    cout << "\n========== 第六部分：缩放演示（全部放大2倍） ==========\n" << endl;
    manager.scaleAll(2.0);
    manager.displayAll();
    manager.displayStatistics();
    
    // ========== 第七部分：颜色筛选 ==========
    cout << "\n========== 第七部分：颜色筛选（蓝色图形） ==========\n" << endl;
    auto blueShapes = manager.getShapesByColor(Color::BLUE);
    cout << "蓝色图形共" << blueShapes.size() << "个：" << endl;
    for (const auto* shape : blueShapes) {
        cout << "  " << shape->getInfo() << endl;
    }
    
    // ========== 第八部分：特殊图形信息 ==========
    cout << "\n========== 第八部分：特殊图形信息 ==========\n" << endl;
    
    // 三角形类型判断
    Triangle tri1(3, 4, 5);
    cout << "三角形(3,4,5)类型：" << tri1.getTriangleType() << endl;
    
    Triangle tri2(6, 6, 6);
    cout << "三角形(6,6,6)类型：" << tri2.getTriangleType() << endl;
    
    Triangle tri3(5, 5, 8);
    cout << "三角形(5,5,8)类型：" << tri3.getTriangleType() << endl;
    
    // 椭圆离心率
    Ellipse ell(5, 3);
    cout << "椭圆(5,3)离心率：" << ell.getEccentricity() << endl;
    
    cout << "\n========== 演示结束 ==========" << endl;
    
    return 0;
}
```

### 6.2 图形克隆与比较功能扩展

```cpp
// 扩展：为Shape添加克隆接口
class ICloneable {
public:
    virtual unique_ptr<ICloneable> clone() const = 0;
    virtual ~ICloneable() = default;
};

// 扩展Shape支持克隆
class CloneableShape : public Shape, public ICloneable {
public:
    CloneableShape(const string& n, Color c) : Shape(n, c) {}
    virtual unique_ptr<CloneableShape> cloneShape() const = 0;
    unique_ptr<ICloneable> clone() const override {
        return cloneShape();
    }
};

// 可克隆的圆形
class CloneableCircle : public CloneableShape {
private:
    double radius;
    
public:
    CloneableCircle(double r, Color c = Color::BLUE)
        : CloneableShape("圆形", c), radius(r) {}
    
    double calcArea() const override {
        return M_PI * radius * radius;
    }
    
    double calcPerimeter() const override {
        return 2 * M_PI * radius;
    }
    
    void scale(double factor) override {
        radius *= factor;
    }
    
    unique_ptr<CloneableShape> cloneShape() const override {
        return make_unique<CloneableCircle>(radius, color);
    }
};

// 演示克隆功能
void demonstrateCloning() {
    cout << "\n========== 克隆功能演示 ==========\n" << endl;
    
    CloneableCircle original(5.0, Color::RED);
    cout << "原始图形：" << original.getInfo() << endl;
    
    auto cloned = original.cloneShape();
    cout << "克隆图形：" << cloned->getInfo() << endl;
    
    // 修改克隆体，验证独立性
    cloned->scale(2.0);
    cout << "\n缩放克隆体后：" << endl;
    cout << "原始图形：" << original.getInfo() << endl;
    cout << "克隆图形：" << cloned->getInfo() << endl;
    cout << "（两者独立，互不影响）" << endl;
}
```

### 6.3 图形序列化

```cpp
// 图形序列化功能
class ShapeSerializer {
public:
    // 将单个图形序列化为字符串
    static string serialize(const Shape& shape) {
        ostringstream oss;
        oss << shape.getName() << "|" 
            << colorToString(shape.getColor()) << "|"
            << fixed << setprecision(4) << shape.calcArea() << "|"
            << shape.calcPerimeter();
        return oss.str();
    }
    
    // 将图形管理器中的所有图形序列化
    static string serializeAll(const ShapeManager& manager) {
        ostringstream oss;
        oss << "图形系统数据报告\n";
        oss << "================\n";
        oss << "图形总数：" << manager.size() << "\n";
        oss << "总面积：" << manager.getTotalArea() << "\n";
        oss << "总周长：" << manager.getTotalPerimeter() << "\n";
        return oss.str();
    }
};

// 演示序列化
void demonstrateSerialization() {
    cout << "\n========== 序列化演示 ==========\n" << endl;
    
    Circle circle(5.0, Color::BLUE);
    Rectangle rect(4.0, 6.0, Color::GREEN);
    Triangle tri(3.0, 4.0, 5.0);
    
    cout << "序列化圆形：" << ShapeSerializer::serialize(circle) << endl;
    cout << "序列化矩形：" << ShapeSerializer::serialize(rect) << endl;
    cout << "序列化三角形：" << ShapeSerializer::serialize(tri) << endl;
}
```

## 七、多态遍历与批量操作

### 7.1 使用vector<Shape*>实现多态遍历

```cpp
void demonstratePolymorphicTraversal() {
    cout << "\n========== 多态遍历演示 ==========\n" << endl;
    
    // 创建各种图形
    vector<unique_ptr<Shape>> shapes;
    shapes.push_back(make_unique<Circle>(5.0, Color::BLUE));
    shapes.push_back(make_unique<Rectangle>(4.0, 6.0, Color::GREEN));
    shapes.push_back(make_unique<Square>(3.0, Color::RED));
    shapes.push_back(make_unique<Triangle>(3.0, 4.0, 5.0, Color::YELLOW));
    shapes.push_back(make_unique<Ellipse>(4.0, 2.0, Color::PURPLE));
    
    // 多态遍历：每个图形调用自己的calcArea版本
    cout << "遍历所有图形并计算面积：" << endl;
    double totalArea = 0;
    for (const auto& shape : shapes) {
        double area = shape->calcArea();
        cout << "  " << shape->getName() << " 面积 = " << area << endl;
        totalArea += area;
    }
    cout << "总面积 = " << totalArea << endl;
    
    // 批量操作：只缩放圆形
    cout << "\n批量缩放所有圆形（放大2倍）：" << endl;
    for (auto& shape : shapes) {
        if (shape->getName() == "圆形") {
            shape->scale(2.0);
            cout << "  " << shape->getInfo() << endl;
        }
    }
    
    // 使用标准算法：查找面积大于一定值的图形
    cout << "\n面积大于50的图形：" << endl;
    auto it = find_if(shapes.begin(), shapes.end(),
                      [](const unique_ptr<Shape>& s) {
                          return s->calcArea() > 50;
                      });
    if (it != shapes.end()) {
        cout << "  找到：" << (*it)->getInfo() << endl;
    }
}
```

### 7.2 面积统计与分组

```cpp
void demonstrateAreaStatistics() {
    cout << "\n========== 面积统计与分组 ==========\n" << endl;
    
    vector<unique_ptr<Shape>> shapes;
    shapes.push_back(make_unique<Circle>(1.0));     // 面积 ~3.14
    shapes.push_back(make_unique<Circle>(3.0));     // 面积 ~28.27
    shapes.push_back(make_unique<Circle>(5.0));     // 面积 ~78.54
    shapes.push_back(make_unique<Rectangle>(2.0, 3.0)); // 面积 6
    shapes.push_back(make_unique<Rectangle>(5.0, 5.0)); // 面积 25
    shapes.push_back(make_unique<Rectangle>(10.0, 2.0)); // 面积 20
    shapes.push_back(make_unique<Triangle>(3.0, 4.0, 5.0)); // 面积 6
    shapes.push_back(make_unique<Square>(4.0));  // 面积 16
    shapes.push_back(make_unique<Ellipse>(3.0, 2.0)); // 面积 ~18.85
    
    // 按面积分组
    vector<const Shape*> smallShapes;   // 面积 < 10
    vector<const Shape*> mediumShapes;  // 10 <= 面积 < 50
    vector<const Shape*> largeShapes;   // 面积 >= 50
    
    for (const auto& shape : shapes) {
        double area = shape->calcArea();
        if (area < 10) {
            smallShapes.push_back(shape.get());
        } else if (area < 50) {
            mediumShapes.push_back(shape.get());
        } else {
            largeShapes.push_back(shape.get());
        }
    }
    
    cout << "小型图形（面积<10）：" << smallShapes.size() << "个" << endl;
    for (const auto* s : smallShapes) {
        cout << "  " << s->getInfo() << endl;
    }
    
    cout << "\n中型图形（10<=面积<50）：" << mediumShapes.size() << "个" << endl;
    for (const auto* s : mediumShapes) {
        cout << "  " << s->getInfo() << endl;
    }
    
    cout << "\n大型图形（面积>=50）：" << largeShapes.size() << "个" << endl;
    for (const auto* s : largeShapes) {
        cout << "  " << s->getInfo() << endl;
    }
    
    // 统计各类型图形的数量
    cout << "\n各类型图形统计：" << endl;
    cout << "  圆形：" << count_if(shapes.begin(), shapes.end(),
        [](const unique_ptr<Shape>& s) { return s->getName() == "圆形"; }) << "个" << endl;
    cout << "  矩形：" << count_if(shapes.begin(), shapes.end(),
        [](const unique_ptr<Shape>& s) { return s->getName() == "矩形"; }) << "个" << endl;
    cout << "  正方形：" << count_if(shapes.begin(), shapes.end(),
        [](const unique_ptr<Shape>& s) { return s->getName() == "正方形"; }) << "个" << endl;
    cout << "  三角形：" << count_if(shapes.begin(), shapes.end(),
        [](const unique_ptr<Shape>& s) { return s->getName() == "三角形"; }) << "个" << endl;
    cout << "  椭圆：" << count_if(shapes.begin(), shapes.end(),
        [](const unique_ptr<Shape>& s) { return s->getName() == "椭圆"; }) << "个" << endl;
}
```

## 八、完整的运行演示

```cpp
// 完整的演示程序
int runFullDemo() {
    cout << "\n╔══════════════════════════════════════╗" << endl;
    cout << "║      完整图形系统运行演示           ║" << endl;
    cout << "╚══════════════════════════════════════╝" << endl;
    
    // 1. 创建图形管理器
    ShapeManager manager;
    
    // 2. 使用工厂创建图形
    cout << "\n>>> 创建图形..." << endl;
    manager.addShape(ShapeFactory::createCircle(5.0, Color::BLUE));
    manager.addShape(ShapeFactory::createCircle(3.0, Color::CYAN));
    manager.addShape(ShapeFactory::createRectangle(4.0, 6.0, Color::GREEN));
    manager.addShape(ShapeFactory::createRectangle(10.0, 2.0, Color::ORANGE));
    manager.addShape(ShapeFactory::createSquare(4.0, Color::RED));
    manager.addShape(ShapeFactory::createSquare(7.0, Color::PURPLE));
    manager.addShape(ShapeFactory::createTriangle(3.0, 4.0, 5.0, Color::YELLOW));
    manager.addShape(ShapeFactory::createTriangle(6.0, 6.0, 6.0, Color::GRAY));
    manager.addShape(ShapeFactory::createEllipse(5.0, 3.0, Color::PURPLE));
    manager.addShape(ShapeFactory::createEllipse(4.0, 4.0, Color::WHITE));
    
    // 3. 显示所有图形
    manager.displayAll();
    
    // 4. 统计信息
    manager.displayStatistics();
    
    // 5. 排序并显示
    cout << "\n>>> 按面积升序排序：" << endl;
    manager.sortByArea();
    manager.displayAll();
    
    // 6. 缩放
    cout << "\n>>> 所有图形放大1.5倍：" << endl;
    manager.scaleAll(1.5);
    manager.displayAll();
    
    // 7. 最终统计
    manager.displayStatistics();
    
    // 8. 额外演示
    demonstrateCloning();
    demonstrateSerialization();
    demonstratePolymorphicTraversal();
    demonstrateAreaStatistics();
    
    cout << "\n========== 演示完成 ==========" << endl;
    
    return 0;
}

int main() {
    return runFullDemo();
}
```

## 九、总结

通过这个完整的图形系统项目，我们综合运用了C++继承与多态的各个方面：

### 技术要点回顾

1. **抽象基类设计**：`Shape`使用纯虚函数定义接口，强制所有派生类实现`calcArea()`、`calcPerimeter()`和`scale()`方法。

2. **继承层次**：
   - `Circle`、`Rectangle`、`Triangle`、`Ellipse`直接继承`Shape`
   - `Square`继承`Rectangle`，展示了继承层次的扩展

3. **多态遍历**：使用`vector<unique_ptr<Shape>>`实现了多态遍历，通过基类指针调用虚函数。

4. **简单工厂模式**：`ShapeFactory`封装了对象创建逻辑，支持多种创建方式。

5. **管理器模式**：`ShapeManager`统一管理图形集合，提供排序、统计、筛选等功能。

6. **虚析构函数**：所有派生类都能通过基类指针正确析构。

7. **override关键字**：所有重写的虚函数都使用了`override`关键字。

8. **排序与算法**：使用lambda表达式和STL算法进行排序、查找、统计等操作。

### 架构优势

- **可扩展性**：添加新图形类型只需创建新的派生类，无需修改现有代码。
- **类型安全**：使用`unique_ptr`管理资源，避免内存泄漏。
- **接口清晰**：通过纯虚函数定义明确的接口契约。
- **职责分离**：工厂负责创建，管理器负责组织，图形类负责计算。

这个图形系统是一个完整的、可运行的C++项目，展示了面向对象设计在实践中的应用。它不仅是继承与多态知识的综合运用，也是良好软件工程实践的体现。
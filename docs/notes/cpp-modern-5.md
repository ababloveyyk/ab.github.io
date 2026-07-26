---
title: C++现代特性Ⅴ——综合实战
date: 2026-07-26
tags:
  - C++
  - 现代C++
  - 综合实战
  - 图书管理系统
categories:
  - C++
---

## 一、项目概述

本篇文章将通过一个完整的图书管理系统项目，综合运用前面所学的现代C++特性：智能指针、移动语义、lambda表达式、auto类型推导、范围for循环、constexpr等。我们将从设计到实现，展示如何用现代C++构建一个健壮、可维护的应用程序。

### 1.1 项目结构

```
图书管理系统：
├── 核心类
│   ├── Book（图书信息）
│   ├── Member（会员信息）
│   ├── BorrowRecord（借阅记录）
│   └── Library（图书馆管理核心）
├── 辅助类
│   ├── Date（日期处理）
│   └── Logger（日志系统）
└── 现代C++特性应用
    ├── 智能指针管理资源
    ├── lambda表达式自定义操作
    ├── auto简化类型声明
    └── 范围for遍历容器
```

### 1.2 现代C++特性总览

在本文中，我们将综合运用以下特性：

| 特性 | 用途 |
|------|------|
| unique_ptr | 独占所有权管理 |
| shared_ptr | 共享资源管理 |
| weak_ptr | 弱引用，打破循环引用 |
| lambda表达式 | 自定义排序、查找、过滤 |
| auto | 简化类型声明 |
| 范围for | 简化容器遍历 |
| 移动语义 | 避免不必要的拷贝 |
| constexpr | 编译期常量 |

## 二、核心类设计

### 2.1 Date类

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <algorithm>
#include <map>
#include <set>
#include <iomanip>
#include <sstream>
#include <chrono>
#include <stdexcept>
using namespace std;

// 日期类
class Date {
private:
    int year;
    int month;
    int day;
    
    static constexpr int daysInMonth(int y, int m) {
        constexpr int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (m == 2 && ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)) {
            return 29;
        }
        return days[m];
    }
    
public:
    Date(int y = 2026, int m = 1, int d = 1) : year(y), month(m), day(d) {
        if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) {
            throw invalid_argument("无效的日期");
        }
    }
    
    string toString() const {
        ostringstream oss;
        oss << year << "-" << setw(2) << setfill('0') << month 
            << "-" << setw(2) << setfill('0') << day;
        return oss.str();
    }
    
    bool operator<(const Date& other) const {
        if (year != other.year) return year < other.year;
        if (month != other.month) return month < other.month;
        return day < other.day;
    }
    
    bool operator==(const Date& other) const {
        return year == other.year && month == other.month && day == other.day;
    }
    
    // 计算两个日期之间的天数差（简化版）
    int daysUntil(const Date& other) const {
        int d1 = year * 365 + month * 30 + day;
        int d2 = other.year * 365 + other.month * 30 + other.day;
        return d2 - d1;
    }
};
```

### 2.2 Book类

```cpp
// 图书状态枚举
enum class BookStatus {
    AVAILABLE,    // 可借阅
    BORROWED,     // 已借出
    RESERVED,     // 已预约
    DAMAGED,      // 损坏
    LOST          // 丢失
};

// 图书类
class Book {
private:
    string isbn;           // ISBN编号
    string title;          // 书名
    string author;         // 作者
    string publisher;      // 出版社
    int year;              // 出版年份
    double price;          // 价格
    BookStatus status;     // 状态
    int totalCopies;       // 总副本数
    int availableCopies;   // 可用副本数
    
public:
    Book(const string& i, const string& t, const string& a,
         const string& p, int y, double pr, int copies = 1)
        : isbn(i), title(t), author(a), publisher(p),
          year(y), price(pr), status(BookStatus::AVAILABLE),
          totalCopies(copies), availableCopies(copies) {}
    
    // 移动构造函数
    Book(Book&& other) noexcept
        : isbn(move(other.isbn)), title(move(other.title)),
          author(move(other.author)), publisher(move(other.publisher)),
          year(other.year), price(other.price), status(other.status),
          totalCopies(other.totalCopies), availableCopies(other.availableCopies) {}
    
    // 移动赋值运算符
    Book& operator=(Book&& other) noexcept {
        if (this != &other) {
            isbn = move(other.isbn);
            title = move(other.title);
            author = move(other.author);
            publisher = move(other.publisher);
            year = other.year;
            price = other.price;
            status = other.status;
            totalCopies = other.totalCopies;
            availableCopies = other.availableCopies;
        }
        return *this;
    }
    
    // 禁止拷贝（每本书应唯一）
    Book(const Book&) = delete;
    Book& operator=(const Book&) = delete;
    
    // 获取方法
    const string& getIsbn() const { return isbn; }
    const string& getTitle() const { return title; }
    const string& getAuthor() const { return author; }
    BookStatus getStatus() const { return status; }
    double getPrice() const { return price; }
    int getAvailableCopies() const { return availableCopies; }
    
    // 借阅操作
    bool borrow() {
        if (availableCopies > 0) {
            availableCopies--;
            if (availableCopies == 0) {
                status = BookStatus::BORROWED;
            }
            return true;
        }
        return false;
    }
    
    // 归还操作
    void returnBook() {
        if (availableCopies < totalCopies) {
            availableCopies++;
            if (status == BookStatus::BORROWED) {
                status = BookStatus::AVAILABLE;
            }
        }
    }
    
    // 显示信息
    void display() const {
        cout << "《" << title << "》" << endl;
        cout << "  ISBN: " << isbn << endl;
        cout << "  作者: " << author << endl;
        cout << "  出版社: " << publisher << " (" << year << ")" << endl;
        cout << "  价格: " << fixed << setprecision(2) << price << " 元" << endl;
        cout << "  状态: " << statusToString() << endl;
        cout << "  可用副本: " << availableCopies << "/" << totalCopies << endl;
    }
    
private:
    string statusToString() const {
        switch (status) {
            case BookStatus::AVAILABLE: return "可借阅";
            case BookStatus::BORROWED:  return "已借出";
            case BookStatus::RESERVED:  return "已预约";
            case BookStatus::DAMAGED:   return "损坏";
            case BookStatus::LOST:      return "丢失";
            default: return "未知";
        }
    }
};
```

### 2.3 Member类

```cpp
// 会员类
class Member {
private:
    string memberId;
    string name;
    string phone;
    string email;
    Date joinDate;
    int maxBorrowLimit;  // 最大借阅数量
    int currentBorrowed; // 当前已借数量
    
public:
    Member(const string& id, const string& n, const string& p,
           const string& e, const Date& join, int limit = 5)
        : memberId(id), name(n), phone(p), email(e),
          joinDate(join), maxBorrowLimit(limit), currentBorrowed(0) {}
    
    // 移动构造函数
    Member(Member&& other) noexcept
        : memberId(move(other.memberId)), name(move(other.name)),
          phone(move(other.phone)), email(move(other.email)),
          joinDate(other.joinDate), maxBorrowLimit(other.maxBorrowLimit),
          currentBorrowed(other.currentBorrowed) {}
    
    Member(const Member&) = delete;
    Member& operator=(const Member&) = delete;
    
    const string& getId() const { return memberId; }
    const string& getName() const { return name; }
    int getCurrentBorrowed() const { return currentBorrowed; }
    int getMaxBorrowLimit() const { return maxBorrowLimit; }
    
    bool canBorrow() const {
        return currentBorrowed < maxBorrowLimit;
    }
    
    void incrementBorrowed() { currentBorrowed++; }
    void decrementBorrowed() { currentBorrowed--; }
    
    void display() const {
        cout << "会员ID: " << memberId << endl;
        cout << "姓名: " << name << endl;
        cout << "电话: " << phone << endl;
        cout << "邮箱: " << email << endl;
        cout << "加入日期: " << joinDate.toString() << endl;
        cout << "借阅: " << currentBorrowed << "/" << maxBorrowLimit << endl;
    }
};
```

### 2.4 BorrowRecord类

```cpp
// 借阅记录
class BorrowRecord {
private:
    string recordId;
    string memberId;
    string isbn;
    Date borrowDate;
    Date dueDate;
    Date returnDate;
    bool returned;
    
public:
    BorrowRecord(const string& rid, const string& mid, const string& bid,
                 const Date& bDate, const Date& dDate)
        : recordId(rid), memberId(mid), isbn(bid),
          borrowDate(bDate), dueDate(dDate), returned(false) {}
    
    void markReturned(const Date& rDate) {
        returned = true;
        returnDate = rDate;
    }
    
    const string& getMemberId() const { return memberId; }
    const string& getIsbn() const { return isbn; }
    bool isReturned() const { return returned; }
    int getOverdueDays() const {
        if (returned) {
            return max(0, returnDate.daysUntil(dueDate));
        }
        return max(0, borrowDate.daysUntil(dueDate));
    }
    
    void display() const {
        cout << "记录ID: " << recordId << endl;
        cout << "会员ID: " << memberId << endl;
        cout << "ISBN: " << isbn << endl;
        cout << "借阅日期: " << borrowDate.toString() << endl;
        cout << "到期日期: " << dueDate.toString() << endl;
        if (returned) {
            cout << "归还日期: " << returnDate.toString() << endl;
        } else {
            cout << "状态: 未归还" << endl;
        }
    }
};
```

## 三、Library核心管理类

### 3.1 Library类

```cpp
class Library {
private:
    string name;
    string address;
    
    // 使用智能指针管理资源
    vector<unique_ptr<Book>> books;
    vector<unique_ptr<Member>> members;
    vector<unique_ptr<BorrowRecord>> records;
    
    int nextRecordId = 1;
    
    // 辅助方法：查找图书
    auto findBook(const string& isbn) {
        return find_if(books.begin(), books.end(),
            [&isbn](const auto& book) { return book->getIsbn() == isbn; });
    }
    
    // 辅助方法：查找会员
    auto findMember(const string& memberId) {
        return find_if(members.begin(), members.end(),
            [&memberId](const auto& m) { return m->getId() == memberId; });
    }
    
public:
    Library(const string& n, const string& addr)
        : name(n), address(addr) {
        cout << "图书馆创建：" << name << endl;
    }
    
    // ========== 图书管理 ==========
    
    void addBook(unique_ptr<Book> book) {
        cout << "添加图书：《" << book->getTitle() << "》" << endl;
        books.push_back(move(book));
    }
    
    void addBook(const string& isbn, const string& title, const string& author,
                 const string& publisher, int year, double price, int copies = 1) {
        addBook(make_unique<Book>(isbn, title, author, publisher, year, price, copies));
    }
    
    bool removeBook(const string& isbn) {
        auto it = findBook(isbn);
        if (it != books.end()) {
            cout << "删除图书：《" << (*it)->getTitle() << "》" << endl;
            books.erase(it);
            return true;
        }
        return false;
    }
    
    // 使用auto和范围for遍历
    void displayAllBooks() const {
        cout << "\n========== 所有图书（共" << books.size() << "本） ==========" << endl;
        for (const auto& book : books) {
            book->display();
            cout << endl;
        }
    }
    
    // 使用lambda进行搜索
    vector<const Book*> searchBooks(const string& keyword) const {
        vector<const Book*> results;
        for (const auto& book : books) {
            // 使用lambda检查是否匹配
            auto matches = [&keyword](const string& field) {
                return field.find(keyword) != string::npos;
            };
            if (matches(book->getTitle()) || matches(book->getAuthor()) ||
                matches(book->getIsbn())) {
                results.push_back(book.get());
            }
        }
        return results;
    }
    
    // 使用lambda排序
    void sortBooksByTitle() {
        sort(books.begin(), books.end(),
             [](const auto& a, const auto& b) {
                 return a->getTitle() < b->getTitle();
             });
    }
    
    void sortBooksByAuthor() {
        sort(books.begin(), books.end(),
             [](const auto& a, const auto& b) {
                 return a->getAuthor() < b->getAuthor();
             });
    }
    
    void sortBooksByPrice() {
        sort(books.begin(), books.end(),
             [](const auto& a, const auto& b) {
                 return a->getPrice() < b->getPrice();
             });
    }
    
    // 使用count_if统计
    int countAvailableBooks() const {
        return count_if(books.begin(), books.end(),
            [](const auto& book) {
                return book->getAvailableCopies() > 0;
            });
    }
    
    // ========== 会员管理 ==========
    
    void addMember(unique_ptr<Member> member) {
        cout << "添加会员：" << member->getName() << endl;
        members.push_back(move(member));
    }
    
    void addMember(const string& id, const string& name, const string& phone,
                   const string& email, const Date& joinDate, int limit = 5) {
        addMember(make_unique<Member>(id, name, phone, email, joinDate, limit));
    }
    
    void displayAllMembers() const {
        cout << "\n========== 所有会员（共" << members.size() << "人） ==========" << endl;
        for (const auto& member : members) {
            member->display();
            cout << endl;
        }
    }
    
    // ========== 借阅管理 ==========
    
    bool borrowBook(const string& memberId, const string& isbn) {
        // 查找会员
        auto memberIt = findMember(memberId);
        if (memberIt == members.end()) {
            cout << "错误：会员不存在" << endl;
            return false;
        }
        
        auto& member = *memberIt;
        if (!member->canBorrow()) {
            cout << "错误：会员" << member->getName() << "已达到借阅上限" << endl;
            return false;
        }
        
        // 查找图书
        auto bookIt = findBook(isbn);
        if (bookIt == books.end()) {
            cout << "错误：图书不存在" << endl;
            return false;
        }
        
        auto& book = *bookIt;
        if (!book->borrow()) {
            cout << "错误：图书《" << book->getTitle() << "》无可用副本" << endl;
            return false;
        }
        
        // 创建借阅记录
        Date today(2026, 7, 26);
        Date dueDate(2026, 8, 25);  // 30天借期
        
        auto record = make_unique<BorrowRecord>(
            "R" + to_string(nextRecordId++),
            memberId, isbn, today, dueDate
        );
        
        member->incrementBorrowed();
        records.push_back(move(record));
        
        cout << "借阅成功：《" << book->getTitle() << "》借给" 
             << member->getName() << "，到期日：" << dueDate.toString() << endl;
        return true;
    }
    
    bool returnBook(const string& memberId, const string& isbn) {
        // 查找会员
        auto memberIt = findMember(memberId);
        if (memberIt == members.end()) {
            cout << "错误：会员不存在" << endl;
            return false;
        }
        
        // 查找图书
        auto bookIt = findBook(isbn);
        if (bookIt == books.end()) {
            cout << "错误：图书不存在" << endl;
            return false;
        }
        
        // 查找未归还的借阅记录
        auto recordIt = find_if(records.begin(), records.end(),
            [&memberId, &isbn](const auto& r) {
                return r->getMemberId() == memberId && 
                       r->getIsbn() == isbn && 
                       !r->isReturned();
            });
        
        if (recordIt == records.end()) {
            cout << "错误：未找到对应的借阅记录" << endl;
            return false;
        }
        
        Date today(2026, 7, 26);
        (*recordIt)->markReturned(today);
        (*bookIt)->returnBook();
        (*memberIt)->decrementBorrowed();
        
        cout << "归还成功：《" << (*bookIt)->getTitle() << "》由" 
             << (*memberIt)->getName() << "归还" << endl;
        return true;
    }
    
    void displayAllRecords() const {
        cout << "\n========== 所有借阅记录（共" << records.size() << "条） ==========" << endl;
        for (const auto& record : records) {
            record->display();
            cout << endl;
        }
    }
    
    // 使用lambda和copy_if统计逾期记录
    void displayOverdueRecords() const {
        cout << "\n========== 逾期记录 ==========" << endl;
        auto overdue = count_if(records.begin(), records.end(),
            [](const auto& r) {
                return !r->isReturned() && r->getOverdueDays() > 0;
            });
        cout << "逾期记录数：" << overdue << endl;
        
        for (const auto& record : records) {
            if (!record->isReturned() && record->getOverdueDays() > 0) {
                record->display();
                cout << "逾期天数：" << record->getOverdueDays() << "天" << endl;
                cout << endl;
            }
        }
    }
    
    // ========== 统计功能 ==========
    
    void displayStatistics() const {
        cout << "\n========== 图书馆统计 ==========" << endl;
        cout << "图书馆名称：" << name << endl;
        cout << "地址：" << address << endl;
        cout << "图书总数：" << books.size() << endl;
        cout << "可用图书数：" << countAvailableBooks() << endl;
        cout << "会员总数：" << members.size() << endl;
        cout << "借阅记录总数：" << records.size() << endl;
        
        // 使用accumulate计算总价
        double totalValue = 0;
        for (const auto& book : books) {
            totalValue += book->getPrice();
        }
        cout << "图书总价值：" << fixed << setprecision(2) << totalValue << " 元" << endl;
        
        cout << "==============================" << endl;
    }
};
```

## 四、将Shape多态系统改为使用unique_ptr

```cpp
// 将之前的多态Shape系统现代化
class Shape {
public:
    virtual double calcArea() const = 0;
    virtual string getName() const = 0;
    virtual ~Shape() = default;
};

class CircleShape : public Shape {
private:
    double radius;
public:
    CircleShape(double r) : radius(r) {}
    double calcArea() const override { return 3.14159 * radius * radius; }
    string getName() const override { return "圆形"; }
};

class RectShape : public Shape {
private:
    double w, h;
public:
    RectShape(double width, double height) : w(width), h(height) {}
    double calcArea() const override { return w * h; }
    string getName() const override { return "矩形"; }
};

// 使用unique_ptr管理的Shape管理器
class ModernShapeManager {
private:
    vector<unique_ptr<Shape>> shapes;
    
public:
    void addShape(unique_ptr<Shape> shape) {
        shapes.push_back(move(shape));
    }
    
    // 使用auto和范围for
    void displayAll() const {
        for (const auto& shape : shapes) {
            cout << shape->getName() << " 面积: " << shape->calcArea() << endl;
        }
    }
    
    // 使用lambda排序
    void sortByArea() {
        sort(shapes.begin(), shapes.end(),
             [](const auto& a, const auto& b) {
                 return a->calcArea() < b->calcArea();
             });
    }
    
    // 使用lambda查找
    const Shape* findLargest() const {
        if (shapes.empty()) return nullptr;
        auto it = max_element(shapes.begin(), shapes.end(),
            [](const auto& a, const auto& b) {
                return a->calcArea() < b->calcArea();
            });
        return it->get();
    }
    
    double totalArea() const {
        double total = 0;
        for (const auto& shape : shapes) {
            total += shape->calcArea();
        }
        return total;
    }
};

void demonstrateModernShapeSystem() {
    cout << "\n========== 现代化Shape系统 ==========" << endl;
    
    ModernShapeManager mgr;
    mgr.addShape(make_unique<CircleShape>(5.0));
    mgr.addShape(make_unique<CircleShape>(3.0));
    mgr.addShape(make_unique<RectShape>(4.0, 6.0));
    mgr.addShape(make_unique<RectShape>(10.0, 2.0));
    
    cout << "所有图形：" << endl;
    mgr.displayAll();
    
    cout << "\n按面积排序：" << endl;
    mgr.sortByArea();
    mgr.displayAll();
    
    cout << "\n总面积：" << mgr.totalArea() << endl;
    
    auto* largest = mgr.findLargest();
    if (largest) {
        cout << "最大图形：" << largest->getName() 
             << " 面积=" << largest->calcArea() << endl;
    }
}
```

## 五、综合演示

### 5.1 主程序

```cpp
int main() {
    cout << "╔══════════════════════════════════════╗" << endl;
    cout << "║   现代C++图书管理系统 - 综合演示    ║" << endl;
    cout << "╚══════════════════════════════════════╝" << endl;
    
    // 创建图书馆
    Library library("现代C++图书馆", "北京市海淀区");
    
    // ========== 添加图书 ==========
    cout << "\n========== 添加图书 ==========" << endl;
    library.addBook("978-7-111-11111-1", "C++ Primer", "Stanley Lippman",
                    "机械工业出版社", 2012, 128.0, 3);
    library.addBook("978-7-111-22222-2", "Effective Modern C++", "Scott Meyers",
                    "电子工业出版社", 2015, 65.0, 2);
    library.addBook("978-7-111-33333-3", "The C++ Programming Language", 
                    "Bjarne Stroustrup", "机械工业出版社", 2013, 99.0, 2);
    library.addBook("978-7-111-44444-4", "STL源码剖析", "侯捷",
                    "华中科技大学出版社", 2002, 55.0, 1);
    library.addBook("978-7-111-55555-5", "深度探索C++对象模型", "Stanley Lippman",
                    "电子工业出版社", 2012, 68.0, 2);
    
    // ========== 添加会员 ==========
    cout << "\n========== 添加会员 ==========" << endl;
    library.addMember("M001", "张三", "13800001111", "zhangsan@email.com", 
                      Date(2026, 1, 15), 5);
    library.addMember("M002", "李四", "13900002222", "lisi@email.com", 
                      Date(2026, 3, 20), 3);
    library.addMember("M003", "王五", "13700003333", "wangwu@email.com", 
                      Date(2026, 5, 10), 5);
    
    // ========== 借阅操作 ==========
    cout << "\n========== 借阅操作 ==========" << endl;
    library.borrowBook("M001", "978-7-111-11111-1");
    library.borrowBook("M001", "978-7-111-22222-2");
    library.borrowBook("M002", "978-7-111-33333-3");
    library.borrowBook("M002", "978-7-111-44444-4");
    library.borrowBook("M003", "978-7-111-11111-1");
    
    // ========== 归还操作 ==========
    cout << "\n========== 归还操作 ==========" << endl;
    library.returnBook("M001", "978-7-111-11111-1");
    
    // ========== 显示所有图书 ==========
    library.displayAllBooks();
    
    // ========== 搜索图书 ==========
    cout << "\n========== 搜索图书 ==========" << endl;
    auto results = library.searchBooks("C++");
    cout << "搜索\"C++\"结果（共" << results.size() << "条）：" << endl;
    for (const auto* book : results) {
        cout << "  《" << book->getTitle() << "》" << endl;
    }
    
    // ========== 排序演示 ==========
    cout << "\n========== 按价格排序 ==========" << endl;
    library.sortBooksByPrice();
    library.displayAllBooks();
    
    // ========== 显示所有会员 ==========
    library.displayAllMembers();
    
    // ========== 显示借阅记录 ==========
    library.displayAllRecords();
    
    // ========== 统计信息 ==========
    library.displayStatistics();
    
    // ========== 现代化Shape系统演示 ==========
    demonstrateModernShapeSystem();
    
    // ========== 使用auto和lambda的高级示例 ==========
    cout << "\n========== 高级示例 ==========" << endl;
    
    // 使用auto推导复杂类型
    auto getBookCount = [&library]() {
        return library.countAvailableBooks();
    };
    cout << "可用图书数：" << getBookCount() << endl;
    
    // 使用lambda链式操作
    vector<int> data = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    
    auto filtered = [&data]() {
        vector<int> result;
        // 使用copy_if过滤
        copy_if(data.begin(), data.end(), back_inserter(result),
                [](int x) { return x > 3; });
        // 使用sort排序
        sort(result.begin(), result.end(), [](int a, int b) { return a > b; });
        // 使用unique去重
        result.erase(unique(result.begin(), result.end()), result.end());
        return result;
    };
    
    auto result = filtered();
    cout << "过滤(>3)、排序(降序)、去重：";
    for (int x : result) cout << x << " ";
    cout << endl;
    
    cout << "\n========== 演示结束 ==========" << endl;
    
    return 0;
}
```

## 六、总结

本综合实战项目全面展示了现代C++特性的实际应用。通过图书管理系统和Shape系统的实现，我们看到了现代C++如何让代码更加简洁、安全和高效。

### 现代C++特性应用清单

| 特性 | 应用位置 | 效果 |
|------|---------|------|
| unique_ptr | 管理Book、Member、BorrowRecord | 自动释放资源，零内存泄漏 |
| lambda表达式 | 排序、查找、过滤、统计 | 代码简洁，逻辑内联 |
| auto | 迭代器、复杂类型、返回值 | 减少冗长类型声明 |
| 范围for | 遍历容器 | 代码更清晰 |
| 移动语义 | Book、Member的移动构造 | 避免不必要的拷贝 |
| constexpr | Date类中的常量 | 编译期优化 |
| make_unique | 创建对象 | 异常安全，一次分配 |

### 架构优势

- **资源安全**：使用unique_ptr，无需手动delete
- **代码简洁**：lambda和auto大幅减少样板代码
- **性能优化**：移动语义避免不必要的深拷贝
- **类型安全**：nullptr和智能指针消除悬垂指针
- **可维护性**：清晰的接口设计和单一职责原则

现代C++不仅仅是语法糖的集合，它代表了一种新的编程范式——更安全、更简洁、更高效。通过合理运用这些特性，我们可以编写出既现代化又实用的C++应用程序。
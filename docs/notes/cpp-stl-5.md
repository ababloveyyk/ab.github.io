---
title: C++STL标准模板库Ⅴ——算法与综合实战
date: 2026-07-26
tags:
  - C++
  - STL
  - 算法
  - LeetCode
categories:
  - C++
---

## 一、STL算法概述

STL提供了超过100种算法，涵盖查找、排序、计数、修改、数值运算等各个方面。这些算法通过迭代器操作容器，与具体的容器类型解耦，体现了泛型编程的核心思想。

### 1.1 算法分类

STL算法主要分为以下几类：

- **非修改性算法**：不改变容器内容，如find、count、search
- **修改性算法**：改变容器内容，如copy、transform、fill
- **排序算法**：如sort、stable_sort、partial_sort
- **二分查找算法**：如binary_search、lower_bound、upper_bound
- **集合算法**：如set_union、set_intersection
- **堆算法**：如make_heap、push_heap、pop_heap
- **数值算法**：如accumulate、inner_product

## 二、常用遍历算法

### 2.1 for_each

for_each对范围内的每个元素应用指定的函数：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

// 普通函数
void printElement(int x) {
    cout << x << " ";
}

// 带状态的函数对象
class Accumulator {
private:
    int sum;
    int count;
    
public:
    Accumulator() : sum(0), count(0) {}
    
    void operator()(int x) {
        sum += x;
        count++;
    }
    
    double average() const {
        return count > 0 ? static_cast<double>(sum) / count : 0;
    }
    
    int getSum() const { return sum; }
    int getCount() const { return count; }
};

int main() {
    cout << "========== for_each ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 使用普通函数
    cout << "元素：";
    for_each(vec.begin(), vec.end(), printElement);
    cout << endl;
    
    // 使用lambda
    cout << "元素（lambda）：";
    for_each(vec.begin(), vec.end(), [](int x) { cout << x << " "; });
    cout << endl;
    
    // 使用带状态的函数对象
    Accumulator acc = for_each(vec.begin(), vec.end(), Accumulator());
    cout << "总和：" << acc.getSum() << endl;
    cout << "个数：" << acc.getCount() << endl;
    cout << "平均值：" << acc.average() << endl;
    
    return 0;
}
```

### 2.2 transform

transform将函数应用于范围内的每个元素，并将结果存储到另一个范围：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cctype>
using namespace std;

template<typename T>
void print(const vector<T>& v, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    for (const auto& x : v) cout << x << " ";
    cout << endl;
}

int main() {
    cout << "========== transform ==========\n" << endl;
    
    vector<int> src = {1, 2, 3, 4, 5};
    vector<int> result(src.size());
    
    // 一元transform：每个元素乘以2
    transform(src.begin(), src.end(), result.begin(),
              [](int x) { return x * 2; });
    print(src, "原始");
    print(result, "乘以2");
    
    // 一元transform：平方
    transform(src.begin(), src.end(), result.begin(),
              [](int x) { return x * x; });
    print(result, "平方");
    
    // 二元transform：两个容器对应元素相加
    vector<int> vec1 = {1, 2, 3, 4, 5};
    vector<int> vec2 = {10, 20, 30, 40, 50};
    vector<int> sum(vec1.size());
    
    transform(vec1.begin(), vec1.end(), vec2.begin(), sum.begin(),
              [](int a, int b) { return a + b; });
    print(vec1, "vec1");
    print(vec2, "vec2");
    print(sum, "vec1 + vec2");
    
    // transform修改字符串
    string str = "Hello, World!";
    cout << "\n原始字符串：" << str << endl;
    transform(str.begin(), str.end(), str.begin(), ::toupper);
    cout << "转大写：" << str << endl;
    transform(str.begin(), str.end(), str.begin(), ::tolower);
    cout << "转小写：" << str << endl;
    
    return 0;
}
```

## 三、常用查找算法

### 3.1 find与find_if

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    cout << "========== find与find_if ==========\n" << endl;
    
    vector<int> vec = {10, 20, 30, 40, 50, 30, 60};
    
    // find：查找指定值
    auto it = find(vec.begin(), vec.end(), 30);
    if (it != vec.end()) {
        cout << "找到30，位置：" << distance(vec.begin(), it) << endl;
    }
    
    // find_if：查找满足条件的第一个元素
    it = find_if(vec.begin(), vec.end(), [](int x) { return x > 40; });
    if (it != vec.end()) {
        cout << "第一个大于40的数：" << *it << endl;
    }
    
    // find_if_not：查找不满足条件的第一个元素
    it = find_if_not(vec.begin(), vec.end(), [](int x) { return x % 2 == 0; });
    if (it != vec.end()) {
        cout << "第一个奇数：" << *it << endl;
    } else {
        cout << "没有奇数" << endl;
    }
    
    // 查找字符串中的字符
    string str = "Hello, World!";
    auto charIt = find(str.begin(), str.end(), 'W');
    if (charIt != str.end()) {
        cout << "找到'W'，位置：" << distance(str.begin(), charIt) << endl;
    }
    
    // 查找子串
    string pattern = "World";
    auto subIt = search(str.begin(), str.end(), pattern.begin(), pattern.end());
    if (subIt != str.end()) {
        cout << "找到子串\"World\"，位置：" << distance(str.begin(), subIt) << endl;
    }
    
    // find_first_of：查找第一个匹配任意字符的位置
    string vowels = "aeiou";
    auto vowelIt = find_first_of(str.begin(), str.end(), vowels.begin(), vowels.end());
    if (vowelIt != str.end()) {
        cout << "第一个元音字母：" << *vowelIt << endl;
    }
    
    return 0;
}
```

### 3.2 binary_search与有序查找

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 二分查找 ==========\n" << endl;
    
    vector<int> vec = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    // 注意：二分查找要求容器已排序
    
    // binary_search：检查元素是否存在
    cout << "是否存在7：" << (binary_search(vec.begin(), vec.end(), 7) ? "是" : "否") << endl;
    cout << "是否存在8：" << (binary_search(vec.begin(), vec.end(), 8) ? "是" : "否") << endl;
    
    // lower_bound：第一个>=指定值的元素
    auto low = lower_bound(vec.begin(), vec.end(), 8);
    cout << "lower_bound(8) = " << *low << " (位置: " << distance(vec.begin(), low) << ")" << endl;
    
    low = lower_bound(vec.begin(), vec.end(), 7);
    cout << "lower_bound(7) = " << *low << " (位置: " << distance(vec.begin(), low) << ")" << endl;
    
    // upper_bound：第一个>指定值的元素
    auto up = upper_bound(vec.begin(), vec.end(), 7);
    cout << "upper_bound(7) = " << *up << " (位置: " << distance(vec.begin(), up) << ")" << endl;
    
    // equal_range：返回等于指定值的范围
    auto range = equal_range(vec.begin(), vec.end(), 7);
    cout << "equal_range(7): [" << *range.first << ", " << *range.second << ")" << endl;
    
    // 使用二分查找插入元素
    int newValue = 8;
    auto insertPos = lower_bound(vec.begin(), vec.end(), newValue);
    vec.insert(insertPos, newValue);
    cout << "\n插入8后：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

## 四、常用排序算法

### 4.1 sort与stable_sort

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
    int age;
    
    void display() const {
        cout << name << " (成绩:" << score << ", 年龄:" << age << ")";
    }
};

int main() {
    cout << "========== sort与stable_sort ==========\n" << endl;
    
    vector<int> vec = {5, 2, 8, 1, 9, 3, 7, 4, 6, 0};
    
    // sort：默认升序
    sort(vec.begin(), vec.end());
    cout << "升序：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // sort：降序
    sort(vec.begin(), vec.end(), greater<int>());
    cout << "降序：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // sort：自定义排序
    sort(vec.begin(), vec.end(), [](int a, int b) {
        return abs(a - 5) < abs(b - 5);  // 按离5的距离排序
    });
    cout << "按离5的距离：";
    for (int x : vec) cout << x << " ";
    cout << endl;
    
    // stable_sort：保持相等元素的相对顺序
    cout << "\n=== stable_sort ===" << endl;
    vector<Student> students = {
        {"张三", 85, 20},
        {"李四", 92, 21},
        {"王五", 85, 19},
        {"赵六", 78, 22},
        {"孙七", 92, 20}
    };
    
    // 按成绩降序排序（使用stable_sort保持同分学生的原始顺序）
    stable_sort(students.begin(), students.end(),
                [](const Student& a, const Student& b) {
                    return a.score > b.score;
                });
    
    cout << "按成绩降序（stable_sort）：" << endl;
    for (const auto& s : students) {
        cout << "  ";
        s.display();
        cout << endl;
    }
    
    // partial_sort：部分排序
    cout << "\n=== partial_sort ===" << endl;
    vector<int> vec2 = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    partial_sort(vec2.begin(), vec2.begin() + 3, vec2.end());
    cout << "最小的3个元素排在最前面：";
    for (int x : vec2) cout << x << " ";
    cout << endl;
    
    // nth_element：第n个元素
    cout << "\n=== nth_element ===" << endl;
    vector<int> vec3 = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    nth_element(vec3.begin(), vec3.begin() + 4, vec3.end());
    cout << "第5小的元素在位置4：";
    for (int x : vec3) cout << x << " ";
    cout << "（第5小=" << vec3[4] << "）" << endl;
    
    return 0;
}
```

### 4.2 拷贝和替换算法

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>
using namespace std;

template<typename T>
void print(const vector<T>& v, const string& msg = "") {
    if (!msg.empty()) cout << msg << ": ";
    for (const auto& x : v) cout << x << " ";
    cout << endl;
}

int main() {
    cout << "========== 拷贝与替换算法 ==========\n" << endl;
    
    vector<int> src = {1, 2, 3, 4, 5};
    vector<int> dest(5);
    
    // copy：拷贝
    copy(src.begin(), src.end(), dest.begin());
    print(dest, "copy");
    
    // copy_if：条件拷贝
    vector<int> evens;
    copy_if(src.begin(), src.end(), back_inserter(evens),
            [](int x) { return x % 2 == 0; });
    print(evens, "copy_if(偶数)");
    
    // copy_n：拷贝前n个元素
    vector<int> dest2(3);
    copy_n(src.begin(), 3, dest2.begin());
    print(dest2, "copy_n(3)");
    
    // fill：填充
    vector<int> vec(5);
    fill(vec.begin(), vec.end(), 42);
    print(vec, "fill(42)");
    
    // fill_n：填充n个元素
    fill_n(vec.begin(), 3, 99);
    print(vec, "fill_n(3, 99)");
    
    // replace：替换
    vector<int> vec2 = {1, 2, 3, 2, 4, 2, 5};
    replace(vec2.begin(), vec2.end(), 2, 200);
    print(vec2, "replace(2->200)");
    
    // replace_if：条件替换
    replace_if(vec2.begin(), vec2.end(), [](int x) { return x > 50; }, 999);
    print(vec2, "replace_if(>50 -> 999)");
    
    // swap：交换两个容器的内容
    vector<int> a = {1, 2, 3};
    vector<int> b = {4, 5, 6};
    cout << "\n交换前：a=";
    for (int x : a) cout << x << " ";
    cout << " b=";
    for (int x : b) cout << x << " ";
    cout << endl;
    swap(a, b);
    cout << "交换后：a=";
    for (int x : a) cout << x << " ";
    cout << " b=";
    for (int x : b) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 4.3 算术生成算法

```cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

int main() {
    cout << "========== 算术生成算法 ==========\n" << endl;
    
    vector<int> vec = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // accumulate：累加
    int sum = accumulate(vec.begin(), vec.end(), 0);
    cout << "累加和：" << sum << endl;
    
    // accumulate：累乘
    int product = accumulate(vec.begin(), vec.end(), 1, multiplies<int>());
    cout << "累乘积：" << product << endl;
    
    // accumulate：自定义操作
    string concat = accumulate(vec.begin(), vec.end(), string(""),
                               [](const string& s, int x) {
                                   return s + (s.empty() ? "" : "-") + to_string(x);
                               });
    cout << "字符串拼接：" << concat << endl;
    
    // inner_product：内积
    vector<int> vec2 = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    int dotProduct = inner_product(vec.begin(), vec.end(), vec2.begin(), 0);
    cout << "内积：" << dotProduct << endl;
    
    // partial_sum：前缀和
    vector<int> prefixSum(vec.size());
    partial_sum(vec.begin(), vec.end(), prefixSum.begin());
    cout << "前缀和：";
    for (int x : prefixSum) cout << x << " ";
    cout << endl;
    
    // adjacent_difference：相邻差
    vector<int> diff(vec.size());
    adjacent_difference(vec.begin(), vec.end(), diff.begin());
    cout << "相邻差：";
    for (int x : diff) cout << x << " ";
    cout << endl;
    
    // iota：生成递增序列
    vector<int> seq(10);
    iota(seq.begin(), seq.end(), 1);
    cout << "iota：";
    for (int x : seq) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

## 五、综合实战：LeetCode风格题目

### 5.1 两数之和

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// 题目：给定一个整数数组和一个目标值，找出数组中和为目标值的两个数的索引
vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> numMap;  // 值 -> 索引
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    auto result = twoSum(nums, target);
    cout << "两数之和：" << nums[result[0]] << " + " << nums[result[1]] 
         << " = " << target << endl;
    cout << "索引：[" << result[0] << ", " << result[1] << "]" << endl;
    
    return 0;
}
```

### 5.2 数组中的第K个最大元素

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

// 方法1：使用sort
int findKthLargest_sort(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
}

// 方法2：使用nth_element
int findKthLargest_nth(vector<int>& nums, int k) {
    nth_element(nums.begin(), nums.begin() + k - 1, nums.end(), greater<int>());
    return nums[k - 1];
}

// 方法3：使用优先队列
int findKthLargest_heap(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    return minHeap.top();
}

int main() {
    vector<int> nums = {3, 2, 1, 5, 6, 4};
    int k = 2;
    
    vector<int> nums1 = nums;
    cout << "第" << k << "大元素（sort）：" << findKthLargest_sort(nums1, k) << endl;
    
    vector<int> nums2 = nums;
    cout << "第" << k << "大元素（nth_element）：" << findKthLargest_nth(nums2, k) << endl;
    
    vector<int> nums3 = nums;
    cout << "第" << k << "大元素（堆）：" << findKthLargest_heap(nums3, k) << endl;
    
    return 0;
}
```

### 5.3 合并两个有序数组

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 合并两个有序数组（nums1有足够空间）
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1;      // nums1的最后一个有效元素
    int j = n - 1;      // nums2的最后一个有效元素
    int k = m + n - 1;  // 合并后的最后一个位置
    
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }
}

int main() {
    vector<int> nums1 = {1, 3, 5, 0, 0, 0};  // 后3个位置预留
    vector<int> nums2 = {2, 4, 6};
    
    cout << "合并前：" << endl;
    cout << "nums1: ";
    for (int x : nums1) cout << x << " ";
    cout << endl;
    cout << "nums2: ";
    for (int x : nums2) cout << x << " ";
    cout << endl;
    
    merge(nums1, 3, nums2, 3);
    
    cout << "合并后：";
    for (int x : nums1) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 5.4 有效的括号

```cpp
#include <iostream>
#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

bool isValid(const string& s) {
    stack<char> st;
    unordered_map<char, char> pairs = {
        {')', '('},
        {']', '['},
        {'}', '{'}
    };
    
    for (char c : s) {
        if (pairs.count(c)) {
            // 是右括号
            if (st.empty() || st.top() != pairs[c]) {
                return false;
            }
            st.pop();
        } else {
            // 是左括号
            st.push(c);
        }
    }
    
    return st.empty();
}

int main() {
    vector<string> tests = {"()", "()[]{}", "(]", "([)]", "{[]}", "((()))"};
    
    cout << "有效的括号测试：" << endl;
    for (const auto& s : tests) {
        cout << "  \"" << s << "\" -> " << (isValid(s) ? "有效" : "无效") << endl;
    }
    
    return 0;
}
```

### 5.5 字母异位词分组

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    
    for (const string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());  // 排序后的字符串作为键
        groups[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for (auto& [key, group] : groups) {
        result.push_back(move(group));
    }
    return result;
}

int main() {
    vector<string> strs = {"eat", "tea", "tan", "ate", "nat", "bat"};
    
    auto groups = groupAnagrams(strs);
    cout << "字母异位词分组：" << endl;
    for (size_t i = 0; i < groups.size(); i++) {
        cout << "  组" << (i + 1) << ": ";
        for (const auto& s : groups[i]) {
            cout << s << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

### 5.6 前K个高频元素

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

vector<int> topKFrequent(vector<int>& nums, int k) {
    // 1. 统计频率
    unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }
    
    // 2. 使用优先队列（最小堆）找出前K个高频元素
    auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) {
        return a.second > b.second;  // 按频率排序（最小堆）
    };
    priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> minHeap(cmp);
    
    for (const auto& [num, count] : freq) {
        minHeap.push({num, count});
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    // 3. 提取结果
    vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().first);
        minHeap.pop();
    }
    reverse(result.begin(), result.end());
    return result;
}

int main() {
    vector<int> nums = {1, 1, 1, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5};
    int k = 3;
    
    auto result = topKFrequent(nums, k);
    cout << "前" << k << "个高频元素：";
    for (int x : result) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

### 5.7 最长连续序列

```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int num : numSet) {
        // 只从序列的起点开始计数
        if (numSet.find(num - 1) == numSet.end()) {
            int currentNum = num;
            int currentStreak = 1;
            
            while (numSet.find(currentNum + 1) != numSet.end()) {
                currentNum++;
                currentStreak++;
            }
            
            longest = max(longest, currentStreak);
        }
    }
    
    return longest;
}

int main() {
    vector<int> nums = {100, 4, 200, 1, 3, 2};
    
    cout << "数组：";
    for (int x : nums) cout << x << " ";
    cout << endl;
    cout << "最长连续序列长度：" << longestConsecutive(nums) << endl;
    // 最长连续序列是[1, 2, 3, 4]，长度为4
    
    return 0;
}
```

### 5.8 滑动窗口最大值

```cpp
#include <iostream>
#include <vector>
#include <deque>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq;  // 存储索引，保持递减
    
    for (int i = 0; i < nums.size(); i++) {
        // 移除窗口外的元素
        if (!dq.empty() && dq.front() == i - k) {
            dq.pop_front();
        }
        
        // 保持递减：移除所有小于当前元素的元素
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        // 窗口形成后，添加最大值
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}

int main() {
    vector<int> nums = {1, 3, -1, -3, 5, 3, 6, 7};
    int k = 3;
    
    cout << "数组：";
    for (int x : nums) cout << x << " ";
    cout << endl;
    
    auto result = maxSlidingWindow(nums, k);
    cout << "滑动窗口最大值（k=" << k << "）：";
    for (int x : result) cout << x << " ";
    cout << endl;
    // 输出：3, 3, 5, 5, 6, 7
    
    return 0;
}
```

### 5.9 三数之和

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> result;
    int n = nums.size();
    
    sort(nums.begin(), nums.end());
    
    for (int i = 0; i < n - 2; i++) {
        // 跳过重复元素
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int left = i + 1;
        int right = n - 1;
        int target = -nums[i];
        
        while (left < right) {
            int sum = nums[left] + nums[right];
            
            if (sum == target) {
                result.push_back({nums[i], nums[left], nums[right]});
                
                // 跳过重复元素
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}

int main() {
    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    
    auto result = threeSum(nums);
    cout << "三数之和为0的组合：" << endl;
    for (const auto& triplet : result) {
        cout << "  [" << triplet[0] << ", " << triplet[1] << ", " << triplet[2] << "]" << endl;
    }
    
    return 0;
}
```

### 5.10 合并区间

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    
    // 按区间起点排序
    sort(intervals.begin(), intervals.end());
    
    vector<vector<int>> result;
    result.push_back(intervals[0]);
    
    for (int i = 1; i < intervals.size(); i++) {
        auto& last = result.back();
        
        if (intervals[i][0] <= last[1]) {
            // 有重叠，合并
            last[1] = max(last[1], intervals[i][1]);
        } else {
            // 无重叠，添加新区间
            result.push_back(intervals[i]);
        }
    }
    
    return result;
}

int main() {
    vector<vector<int>> intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    
    cout << "原始区间：";
    for (const auto& interval : intervals) {
        cout << "[" << interval[0] << "," << interval[1] << "] ";
    }
    cout << endl;
    
    auto merged = mergeIntervals(intervals);
    cout << "合并后：";
    for (const auto& interval : merged) {
        cout << "[" << interval[0] << "," << interval[1] << "] ";
    }
    cout << endl;
    // 输出：[[1,6],[8,10],[15,18]]
    
    return 0;
}
```

## 六、总结

STL算法是C++标准库中最强大的组件之一，它们提供了丰富的、经过优化的通用操作。

### 核心知识点

1. **遍历算法**：for_each、transform，用于对元素执行操作
2. **查找算法**：find、find_if、binary_search、lower_bound、upper_bound
3. **排序算法**：sort、stable_sort、partial_sort、nth_element
4. **拷贝替换算法**：copy、copy_if、fill、replace、replace_if
5. **算术算法**：accumulate、inner_product、partial_sum、iota
6. **集合算法**：set_union、set_intersection、set_difference

### LeetCode实战总结

通过10道LeetCode风格的题目，我们展示了STL在算法问题中的应用：

- **unordered_map**用于快速查找和频率统计
- **sort**用于排序和预处理
- **priority_queue**用于维护Top-K元素
- **deque**用于滑动窗口
- **stack**用于括号匹配
- **unordered_set**用于去重和快速查找

### 使用建议

- 优先使用STL算法而不是手写循环
- 利用lambda表达式自定义算法行为
- 选择合适的容器来配合算法
- 注意算法的复杂度要求（如二分查找需要有序容器）
- 理解算法的返回值类型（迭代器、bool、函数对象）

掌握STL算法是提升C++编程效率的关键。通过合理使用STL算法，我们可以编写出更简洁、更高效、更不易出错的代码。
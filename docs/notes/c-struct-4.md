---
title: C语言结构体与文件IOⅣ
date: 2026-07-26
tags:
  - C语言
  - 文件IO
  - 项目实战
  - 加密
categories:
  - C语言
---

# C语言结构体与文件IOⅣ——文件操作进阶

## 一、引言

在前一篇文章中，我们学习了C语言文件操作的基础知识：FILE指针、文件打开模式、文本和二进制读写、文件定位以及错误处理。现在，我们将这些知识应用到实际项目中，通过几个完整的实战项目来巩固和深化对文件操作的理解。

本章将涵盖以下内容：格式化文件读写实战、学生成绩管理系统（文件版）、二进制文件随机访问、大文件分块读写、文件加密与解密、以及配置文件解析。每个项目都是完整可运行的，你可以直接编译运行并根据需要扩展。

---

## 二、格式化文件读写实战

### 2.1 CSV文件处理

CSV（Comma-Separated Values）是最常用的数据交换格式之一。下面我们实现一个完整的CSV文件读写器，支持带引号的字段、标题行等特性。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

/*
 * CSV文件读写实战
 * 支持标题行、带引号字段、数据验证
 */

#define MAX_FIELDS 20
#define MAX_FIELD_LEN 100
#define MAX_ROWS 1000

typedef struct {
    char fields[MAX_FIELDS][MAX_FIELD_LEN];
    int field_count;
} CSVRow;

typedef struct {
    CSVRow header;
    CSVRow rows[MAX_ROWS];
    int row_count;
} CSVData;

// 解析CSV行
CSVRow csv_parse_row(const char* line) {
    CSVRow row;
    row.field_count = 0;
    memset(row.fields, 0, sizeof(row.fields));

    const char* p = line;
    int field_idx = 0;

    while (*p && field_idx < MAX_FIELDS) {
        // 跳过前导空白
        while (*p == ' ' || *p == '\t') p++;

        char* dest = row.fields[field_idx];
        int dest_idx = 0;

        if (*p == '"') {
            // 带引号的字段
            p++;  // 跳过开始的引号
            while (*p && *p != '"' && dest_idx < MAX_FIELD_LEN - 1) {
                if (*p == '\\' && *(p + 1) == '"') {
                    // 转义的引号
                    dest[dest_idx++] = '"';
                    p += 2;
                } else {
                    dest[dest_idx++] = *p++;
                }
            }
            if (*p == '"') p++;  // 跳过结束的引号
        } else {
            // 不带引号的字段
            while (*p && *p != ',' && *p != '\n' && *p != '\r'
                   && dest_idx < MAX_FIELD_LEN - 1) {
                dest[dest_idx++] = *p++;
            }
        }

        dest[dest_idx] = '\0';
        field_idx++;

        // 跳过逗号
        if (*p == ',') p++;
    }

    row.field_count = field_idx;
    return row;
}

// 读取CSV文件
CSVData csv_read(const char* filename) {
    CSVData data;
    memset(&data, 0, sizeof(data));

    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开CSV文件: %s\n", filename);
        return data;
    }

    char line[4096];
    bool first_line = true;

    while (fgets(line, sizeof(line), fp) && data.row_count < MAX_ROWS) {
        // 去除行尾换行符
        line[strcspn(line, "\r\n")] = '\0';

        if (strlen(line) == 0) continue;

        if (first_line) {
            data.header = csv_parse_row(line);
            first_line = false;
        } else {
            data.rows[data.row_count++] = csv_parse_row(line);
        }
    }

    fclose(fp);
    printf("读取CSV: %s (%d行数据)\n", filename, data.row_count);
    return data;
}

// 写入CSV文件
void csv_write(const char* filename, const CSVData* data) {
    FILE* fp = fopen(filename, "w");
    if (!fp) {
        printf("无法创建CSV文件: %s\n", filename);
        return;
    }

    // 写入标题行
    for (int i = 0; i < data->header.field_count; i++) {
        if (i > 0) fprintf(fp, ",");
        fprintf(fp, "%s", data->header.fields[i]);
    }
    fprintf(fp, "\n");

    // 写入数据行
    for (int r = 0; r < data->row_count; r++) {
        for (int f = 0; f < data->rows[r].field_count; f++) {
            if (f > 0) fprintf(fp, ",");
            // 如果字段包含逗号或引号，用引号括起来
            const char* field = data->rows[r].fields[f];
            if (strchr(field, ',') || strchr(field, '"')) {
                fprintf(fp, "\"%s\"", field);
            } else {
                fprintf(fp, "%s", field);
            }
        }
        fprintf(fp, "\n");
    }

    fclose(fp);
    printf("写入CSV: %s (%d行)\n", filename, data->row_count);
}

// 获取列索引
int csv_get_column_index(const CSVData* data, const char* column_name) {
    for (int i = 0; i < data->header.field_count; i++) {
        if (strcmp(data->header.fields[i], column_name) == 0) {
            return i;
        }
    }
    return -1;
}

// 按列筛选数据
CSVData csv_filter(const CSVData* data, const char* column,
                   const char* value) {
    CSVData result;
    memset(&result, 0, sizeof(result));
    result.header = data->header;

    int col_idx = csv_get_column_index(data, column);
    if (col_idx < 0) {
        printf("列不存在: %s\n", column);
        return result;
    }

    for (int r = 0; r < data->row_count; r++) {
        if (strcmp(data->rows[r].fields[col_idx], value) == 0) {
            result.rows[result.row_count++] = data->rows[r];
        }
    }

    return result;
}

// 打印CSV数据
void csv_print(const CSVData* data) {
    // 打印标题
    for (int i = 0; i < data->header.field_count; i++) {
        printf("%-15s", data->header.fields[i]);
    }
    printf("\n");

    // 打印分隔线
    for (int i = 0; i < data->header.field_count; i++) {
        printf("---------------");
    }
    printf("\n");

    // 打印数据
    for (int r = 0; r < data->row_count; r++) {
        for (int f = 0; f < data->rows[r].field_count; f++) {
            printf("%-15s", data->rows[r].fields[f]);
        }
        printf("\n");
    }
}

int main() {
    printf("========== CSV文件读写实战 ==========\n\n");

    // 1. 创建CSV文件
    printf("1. 创建CSV数据并写入文件:\n");
    CSVData data;
    memset(&data, 0, sizeof(data));

    // 设置标题
    strcpy(data.header.fields[0], "学号");
    strcpy(data.header.fields[1], "姓名");
    strcpy(data.header.fields[2], "年龄");
    strcpy(data.header.fields[3], "班级");
    strcpy(data.header.fields[4], "成绩");
    data.header.field_count = 5;

    // 添加数据行
    const char* sample_data[][5] = {
        {"1001", "张三", "20", "计算机1班", "92.5"},
        {"1002", "李四", "21", "计算机1班", "88.0"},
        {"1003", "王五", "19", "计算机2班", "95.5"},
        {"1004", "赵六", "22", "计算机2班", "76.5"},
        {"1005", "孙七", "20", "计算机1班", "85.0"},
        {"1006", "周八", "21", "计算机2班", "91.0"},
        {"1007", "吴九", "19", "计算机1班", "78.5"},
        {"1008", "郑十", "22", "计算机2班", "88.5"},
    };

    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 5; j++) {
            strcpy(data.rows[data.row_count].fields[j], sample_data[i][j]);
        }
        data.rows[data.row_count].field_count = 5;
        data.row_count++;
    }

    csv_write("students.csv", &data);
    printf("\n");

    // 2. 读取CSV文件
    printf("2. 读取CSV文件:\n");
    CSVData read_data = csv_read("students.csv");
    printf("\n");
    csv_print(&read_data);
    printf("\n");

    // 3. 按列筛选
    printf("3. 筛选计算机1班的学生:\n");
    CSVData filtered = csv_filter(&read_data, "班级", "计算机1班");
    csv_print(&filtered);
    printf("\n");

    // 4. 数据统计
    printf("4. 数据统计:\n");
    int score_col = csv_get_column_index(&read_data, "成绩");
    if (score_col >= 0) {
        double total = 0, max = 0, min = 999;
        for (int i = 0; i < read_data.row_count; i++) {
            double score = atof(read_data.rows[i].fields[score_col]);
            total += score;
            if (score > max) max = score;
            if (score < min) min = score;
        }
        printf("  总人数: %d\n", read_data.row_count);
        printf("  平均分: %.2f\n", total / read_data.row_count);
        printf("  最高分: %.2f\n", max);
        printf("  最低分: %.2f\n", min);
    }

    return 0;
}
```

### 2.2 日志文件生成与分析

日志文件是软件开发中不可或缺的部分。下面实现一个完整的日志系统，支持不同级别、时间戳、文件轮转等功能。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdarg.h>

/*
 * 日志文件系统
 * 支持多级别、时间戳、文件输出
 */

// 日志级别
typedef enum {
    LOG_LEVEL_DEBUG,
    LOG_LEVEL_INFO,
    LOG_LEVEL_WARNING,
    LOG_LEVEL_ERROR,
    LOG_LEVEL_FATAL
} LogLevel;

// 日志配置
typedef struct {
    LogLevel min_level;
    char     filename[256];
    FILE*    file_handle;
    int      max_file_size;  // 字节
    int      current_size;
    bool     console_output;
    bool     include_timestamp;
    bool     include_level;
    int      entry_count;
} Logger;

// 全局日志实例
static Logger g_logger;

// 初始化日志系统
bool logger_init(const char* filename, LogLevel min_level,
                 bool console_output) {
    memset(&g_logger, 0, sizeof(g_logger));

    strncpy(g_logger.filename, filename, sizeof(g_logger.filename) - 1);
    g_logger.min_level = min_level;
    g_logger.console_output = console_output;
    g_logger.include_timestamp = true;
    g_logger.include_level = true;
    g_logger.max_file_size = 10 * 1024 * 1024;  // 10MB

    g_logger.file_handle = fopen(filename, "a");
    if (!g_logger.file_handle) {
        printf("无法打开日志文件: %s\n", filename);
        return false;
    }

    // 获取当前文件大小
    fseek(g_logger.file_handle, 0, SEEK_END);
    g_logger.current_size = ftell(g_logger.file_handle);

    return true;
}

// 获取级别字符串
const char* log_level_str(LogLevel level) {
    switch (level) {
        case LOG_LEVEL_DEBUG:   return "DEBUG";
        case LOG_LEVEL_INFO:    return "INFO";
        case LOG_LEVEL_WARNING: return "WARN";
        case LOG_LEVEL_ERROR:   return "ERROR";
        case LOG_LEVEL_FATAL:   return "FATAL";
        default:                return "UNKNOWN";
    }
}

// 写入日志
void logger_write(LogLevel level, const char* format, ...) {
    if (level < g_logger.min_level) return;
    if (!g_logger.file_handle) return;

    char buffer[2048];
    int pos = 0;

    // 时间戳
    if (g_logger.include_timestamp) {
        time_t now = time(NULL);
        struct tm* tm_info = localtime(&now);
        char time_str[64];
        strftime(time_str, sizeof(time_str), "%Y-%m-%d %H:%M:%S", tm_info);
        pos += snprintf(buffer + pos, sizeof(buffer) - pos, "[%s]", time_str);
    }

    // 级别
    if (g_logger.include_level) {
        pos += snprintf(buffer + pos, sizeof(buffer) - pos,
                        " [%s]", log_level_str(level));
    }

    // 消息内容
    pos += snprintf(buffer + pos, sizeof(buffer) - pos, " ");

    va_list args;
    va_start(args, format);
    pos += vsnprintf(buffer + pos, sizeof(buffer) - pos, format, args);
    va_end(args);

    // 添加换行
    if (pos < (int)sizeof(buffer) - 1) {
        buffer[pos++] = '\n';
        buffer[pos] = '\0';
    }

    // 输出到控制台
    if (g_logger.console_output) {
        printf("%s", buffer);
    }

    // 写入文件
    int len = strlen(buffer);
    fputs(buffer, g_logger.file_handle);
    fflush(g_logger.file_handle);

    g_logger.current_size += len;
    g_logger.entry_count++;

    // 检查是否需要轮转
    if (g_logger.current_size >= g_logger.max_file_size) {
        // 简单轮转：重命名当前文件，创建新文件
        fclose(g_logger.file_handle);

        char backup[300];
        snprintf(backup, sizeof(backup), "%s.old", g_logger.filename);
        remove(backup);
        rename(g_logger.filename, backup);

        g_logger.file_handle = fopen(g_logger.filename, "a");
        g_logger.current_size = 0;

        if (g_logger.file_handle) {
            fprintf(g_logger.file_handle, "[%s] [INFO] 日志文件轮转\n",
                    "2026-07-26 00:00:00");
        }
    }
}

// 关闭日志系统
void logger_close() {
    if (g_logger.file_handle) {
        logger_write(LOG_LEVEL_INFO, "日志系统关闭 (共%d条记录)",
                     g_logger.entry_count);
        fclose(g_logger.file_handle);
        g_logger.file_handle = NULL;
    }
}

// 分析日志文件
void analyze_log(const char* filename) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开日志文件: %s\n", filename);
        return;
    }

    char line[2048];
    int level_counts[5] = {0};
    int total_lines = 0;
    int error_lines = 0;

    printf("===== 日志分析: %s =====\n\n", filename);

    while (fgets(line, sizeof(line), fp)) {
        total_lines++;

        if (strstr(line, "[DEBUG]")) level_counts[LOG_LEVEL_DEBUG]++;
        else if (strstr(line, "[INFO]")) level_counts[LOG_LEVEL_INFO]++;
        else if (strstr(line, "[WARN]")) level_counts[LOG_LEVEL_WARNING]++;
        else if (strstr(line, "[ERROR]")) level_counts[LOG_LEVEL_ERROR]++;
        else if (strstr(line, "[FATAL]")) level_counts[LOG_LEVEL_FATAL]++;

        // 记录错误和警告行
        if (strstr(line, "[ERROR]") || strstr(line, "[FATAL]")) {
            line[strcspn(line, "\n")] = '\0';
            printf("  %s\n", line);
            error_lines++;
        }
    }

    fclose(fp);

    printf("\n日志统计:\n");
    printf("  总行数: %d\n", total_lines);
    printf("  DEBUG: %d\n", level_counts[LOG_LEVEL_DEBUG]);
    printf("  INFO: %d\n", level_counts[LOG_LEVEL_INFO]);
    printf("  WARNING: %d\n", level_counts[LOG_LEVEL_WARNING]);
    printf("  ERROR: %d\n", level_counts[LOG_LEVEL_ERROR]);
    printf("  FATAL: %d\n", level_counts[LOG_LEVEL_FATAL]);
    printf("========================\n");
}

int main() {
    printf("========== 日志系统 ==========\n\n");

    // 初始化日志系统
    if (!logger_init("application.log", LOG_LEVEL_DEBUG, true)) {
        return 1;
    }

    printf("日志系统初始化完成\n\n");

    // 模拟应用程序运行
    logger_write(LOG_LEVEL_INFO, "应用程序启动");
    logger_write(LOG_LEVEL_DEBUG, "初始化配置模块");
    logger_write(LOG_LEVEL_DEBUG, "加载配置文件: config.ini");
    logger_write(LOG_LEVEL_INFO, "连接数据库: 192.168.1.100:3306");
    logger_write(LOG_LEVEL_DEBUG, "数据库连接池大小: 10");

    // 模拟一些操作
    for (int i = 1; i <= 5; i++) {
        logger_write(LOG_LEVEL_INFO, "处理第%d批数据", i);
        if (i == 3) {
            logger_write(LOG_LEVEL_WARNING, "第%d批数据处理超时(>5秒)", i);
        }
        if (i == 4) {
            logger_write(LOG_LEVEL_ERROR, "第%d批数据中发现损坏记录", i);
        }
    }

    logger_write(LOG_LEVEL_ERROR, "磁盘空间不足，无法写入缓存");
    logger_write(LOG_LEVEL_WARNING, "尝试清理临时文件");
    logger_write(LOG_LEVEL_INFO, "清理完成，释放了2.5GB空间");
    logger_write(LOG_LEVEL_INFO, "应用程序正常退出");

    // 关闭日志系统
    logger_close();

    // 分析日志
    printf("\n");
    analyze_log("application.log");

    return 0;
}
```

---

## 三、学生成绩管理系统（文件版）

### 3.1 系统设计

这是一个完整的文件版学生成绩管理系统，支持添加、删除、修改、查询学生信息，以及成绩统计和排名。所有数据持久化存储在二进制文件中。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

/*
 * 学生成绩管理系统（文件版）
 * 功能：增删改查、成绩统计、排名、持久化存储
 */

#define MAX_NAME_LEN 50
#define MAX_SUBJECTS 5
#define MAX_STUDENTS 1000

// 科目名称
const char* SUBJECT_NAMES[] = {"C语言", "数据结构", "操作系统", "计算机网络", "数据库"};

// 学生记录
typedef struct {
    int    id;                              // 学号（唯一标识）
    char   name[MAX_NAME_LEN];              // 姓名
    int    age;                             // 年龄
    float  scores[MAX_SUBJECTS];            // 各科成绩
    float  total;                           // 总分
    float  average;                         // 平均分
    int    rank;                            // 排名
    bool   deleted;                         // 删除标记（软删除）
} StudentRecord;

// 数据库文件头
typedef struct {
    int    magic;          // 魔数: 0x53544D47
    int    version;        // 版本号
    int    total_records;  // 总记录数
    int    active_records; // 活跃记录数
    int    next_id;        // 下一个可用学号
} DBHeader;

// 数据库结构
typedef struct {
    DBHeader header;
    char     filename[256];
} StudentDB;

// 初始化数据库
StudentDB* db_init(const char* filename) {
    StudentDB* db = (StudentDB*)malloc(sizeof(StudentDB));
    if (!db) return NULL;

    strncpy(db->filename, filename, sizeof(db->filename) - 1);

    // 尝试打开已有数据库
    FILE* fp = fopen(filename, "rb");
    if (fp) {
        // 读取文件头
        fread(&db->header, sizeof(DBHeader), 1, fp);
        if (db->header.magic != 0x53544D47) {
            // 文件损坏或不是有效数据库
            printf("数据库文件损坏，重新创建\n");
            fclose(fp);
            fp = NULL;
        } else {
            fclose(fp);
            printf("数据库已加载: %s (%d条记录)\n",
                   filename, db->header.active_records);
            return db;
        }
    }

    // 创建新数据库
    memset(&db->header, 0, sizeof(DBHeader));
    db->header.magic = 0x53544D47;
    db->header.version = 1;
    db->header.next_id = 1001;

    // 写入文件头
    fp = fopen(filename, "wb");
    if (fp) {
        fwrite(&db->header, sizeof(DBHeader), 1, fp);
        fclose(fp);
    }

    printf("新数据库已创建: %s\n", filename);
    return db;
}

// 保存数据库头
void db_save_header(StudentDB* db) {
    FILE* fp = fopen(db->filename, "rb+");
    if (!fp) return;
    fwrite(&db->header, sizeof(DBHeader), 1, fp);
    fclose(fp);
}

// 计算文件中的记录偏移
long db_record_offset(int index) {
    return (long)sizeof(DBHeader) + (long)index * sizeof(StudentRecord);
}

// 添加学生
int db_add_student(StudentDB* db, const char* name, int age,
                   float scores[MAX_SUBJECTS]) {
    StudentRecord record;
    memset(&record, 0, sizeof(record));

    record.id = db->header.next_id++;
    strncpy(record.name, name, MAX_NAME_LEN - 1);
    record.age = age;
    record.deleted = false;

    // 复制成绩并计算总分和平均分
    record.total = 0;
    for (int i = 0; i < MAX_SUBJECTS; i++) {
        record.scores[i] = scores[i];
        record.total += scores[i];
    }
    record.average = record.total / MAX_SUBJECTS;

    // 追加到文件末尾
    FILE* fp = fopen(db->filename, "ab");
    if (!fp) return -1;

    fwrite(&record, sizeof(StudentRecord), 1, fp);
    fclose(fp);

    db->header.total_records++;
    db->header.active_records++;
    db_save_header(db);

    printf("添加学生: %s (学号:%d)\n", record.name, record.id);
    return record.id;
}

// 读取指定索引的学生记录
StudentRecord db_read_student(StudentDB* db, int index) {
    StudentRecord record;
    memset(&record, 0, sizeof(record));

    if (index < 0 || index >= db->header.total_records) {
        return record;
    }

    FILE* fp = fopen(db->filename, "rb");
    if (!fp) return record;

    fseek(fp, db_record_offset(index), SEEK_SET);
    fread(&record, sizeof(StudentRecord), 1, fp);
    fclose(fp);

    return record;
}

// 写入指定索引的学生记录
void db_write_student(StudentDB* db, int index, StudentRecord* record) {
    if (index < 0 || index >= db->header.total_records) return;

    FILE* fp = fopen(db->filename, "rb+");
    if (!fp) return;

    fseek(fp, db_record_offset(index), SEEK_SET);
    fwrite(record, sizeof(StudentRecord), 1, fp);
    fclose(fp);
}

// 按学号查找学生
int db_find_by_id(StudentDB* db, int id) {
    for (int i = 0; i < db->header.total_records; i++) {
        StudentRecord r = db_read_student(db, i);
        if (!r.deleted && r.id == id) {
            return i;
        }
    }
    return -1;
}

// 按姓名查找学生
int db_find_by_name(StudentDB* db, const char* name, int* results, int max) {
    int count = 0;
    for (int i = 0; i < db->header.total_records && count < max; i++) {
        StudentRecord r = db_read_student(db, i);
        if (!r.deleted && strcmp(r.name, name) == 0) {
            results[count++] = i;
        }
    }
    return count;
}

// 删除学生（软删除）
bool db_delete_student(StudentDB* db, int id) {
    int index = db_find_by_id(db, id);
    if (index < 0) {
        printf("未找到学号%d的学生\n", id);
        return false;
    }

    StudentRecord r = db_read_student(db, index);
    r.deleted = true;
    db_write_student(db, index, &r);

    db->header.active_records--;
    db_save_header(db);

    printf("删除学生: %s (学号:%d)\n", r.name, r.id);
    return true;
}

// 更新学生成绩
bool db_update_scores(StudentDB* db, int id, float scores[MAX_SUBJECTS]) {
    int index = db_find_by_id(db, id);
    if (index < 0) {
        printf("未找到学号%d的学生\n", id);
        return false;
    }

    StudentRecord r = db_read_student(db, index);
    r.total = 0;
    for (int i = 0; i < MAX_SUBJECTS; i++) {
        r.scores[i] = scores[i];
        r.total += scores[i];
    }
    r.average = r.total / MAX_SUBJECTS;
    db_write_student(db, index, &r);

    printf("更新成绩: %s (学号:%d)\n", r.name, r.id);
    return true;
}

// 计算排名
void db_calculate_ranks(StudentDB* db) {
    // 收集所有活跃学生
    StudentRecord students[MAX_STUDENTS];
    int count = 0;

    for (int i = 0; i < db->header.total_records && count < MAX_STUDENTS; i++) {
        StudentRecord r = db_read_student(db, i);
        if (!r.deleted) {
            students[count++] = r;
        }
    }

    // 按总分降序排序
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - 1 - i; j++) {
            if (students[j].total < students[j + 1].total) {
                StudentRecord temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
            }
        }
    }

    // 分配排名
    for (int i = 0; i < count; i++) {
        students[i].rank = i + 1;
    }

    // 写回文件
    for (int i = 0; i < count; i++) {
        int index = db_find_by_id(db, students[i].id);
        if (index >= 0) {
            db_write_student(db, index, &students[i]);
        }
    }

    printf("排名计算完成 (%d名学生)\n", count);
}

// 列出所有学生
void db_list_all(StudentDB* db) {
    printf("\n===== 学生成绩表 =====\n");
    printf("%-6s %-6s %-12s %-4s",
           "排名", "学号", "姓名", "年龄");
    for (int i = 0; i < MAX_SUBJECTS; i++) {
        printf(" %-6s", SUBJECT_NAMES[i]);
    }
    printf(" %-8s %-8s\n", "总分", "平均分");
    printf("------------------------------------------------------------"
           "------------------------------\n");

    int active_count = 0;
    for (int i = 0; i < db->header.total_records; i++) {
        StudentRecord r = db_read_student(db, i);
        if (!r.deleted) {
            active_count++;
            printf("%-6d %-6d %-12s %-4d",
                   r.rank, r.id, r.name, r.age);
            for (int j = 0; j < MAX_SUBJECTS; j++) {
                printf(" %-6.1f", r.scores[j]);
            }
            printf(" %-8.1f %-8.2f\n", r.total, r.average);
        }
    }
    printf("共 %d 名学生\n", active_count);
}

// 统计信息
void db_statistics(StudentDB* db) {
    printf("\n===== 成绩统计 =====\n");

    for (int s = 0; s < MAX_SUBJECTS; s++) {
        float total = 0, max = 0, min = 100;
        int pass_count = 0, count = 0;

        for (int i = 0; i < db->header.total_records; i++) {
            StudentRecord r = db_read_student(db, i);
            if (!r.deleted) {
                total += r.scores[s];
                if (r.scores[s] > max) max = r.scores[s];
                if (r.scores[s] < min) min = r.scores[s];
                if (r.scores[s] >= 60) pass_count++;
                count++;
            }
        }

        if (count > 0) {
            printf("%-12s: 平均=%.1f 最高=%.1f 最低=%.1f 及格率=%.1f%%\n",
                   SUBJECT_NAMES[s], total / count, max, min,
                   100.0 * pass_count / count);
        }
    }
}

// 关闭数据库
void db_close(StudentDB* db) {
    db_save_header(db);
    free(db);
    printf("数据库已关闭\n");
}

int main() {
    printf("========== 学生成绩管理系统 ==========\n\n");

    // 初始化数据库
    StudentDB* db = db_init("students.db");
    if (!db) return 1;
    printf("\n");

    // 添加学生
    printf("1. 添加学生:\n");
    float scores1[] = {85, 92, 78, 88, 90};
    float scores2[] = {90, 88, 95, 82, 87};
    float scores3[] = {78, 85, 82, 90, 86};
    float scores4[] = {95, 91, 89, 93, 94};
    float scores5[] = {70, 75, 72, 68, 80};
    float scores6[] = {88, 85, 92, 86, 89};
    float scores7[] = {82, 79, 86, 84, 80};
    float scores8[] = {93, 96, 90, 91, 95};

    db_add_student(db, "张三", 20, scores1);
    db_add_student(db, "李四", 21, scores2);
    db_add_student(db, "王五", 19, scores3);
    db_add_student(db, "赵六", 22, scores4);
    db_add_student(db, "孙七", 20, scores5);
    db_add_student(db, "周八", 21, scores6);
    db_add_student(db, "吴九", 19, scores7);
    db_add_student(db, "郑十", 22, scores8);
    printf("\n");

    // 计算排名并列出
    printf("2. 计算排名并列出:\n");
    db_calculate_ranks(db);
    db_list_all(db);

    // 统计信息
    db_statistics(db);

    // 更新成绩
    printf("\n3. 更新成绩:\n");
    float new_scores[] = {92, 95, 88, 90, 93};
    db_update_scores(db, 1003, new_scores);

    // 删除学生
    printf("\n4. 删除学生:\n");
    db_delete_student(db, 1005);

    // 重新计算排名
    printf("\n5. 重新计算排名:\n");
    db_calculate_ranks(db);
    db_list_all(db);

    // 查找学生
    printf("\n6. 查找学生:\n");
    int idx = db_find_by_id(db, 1002);
    if (idx >= 0) {
        StudentRecord r = db_read_student(db, idx);
        printf("  找到: %s (学号:%d), 总分:%.1f\n", r.name, r.id, r.total);
    }

    int results[10];
    int found = db_find_by_name(db, "赵六", results, 10);
    printf("  按姓名查找 \"赵六\": 找到%d个\n", found);

    // 关闭数据库
    db_close(db);

    return 0;
}
```

---

## 四、大文件分块读写

### 4.1 分块读写策略

处理大文件时，不能将整个文件一次性加载到内存。分块读写是处理大文件的标准方法。下面实现一个通用的分块文件处理器。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

/*
 * 大文件分块读写
 * 处理超大文件的标准方法
 */

#define CHUNK_SIZE (1024 * 1024)  // 1MB块大小

// 分块复制文件
int copy_file_chunked(const char* src, const char* dst,
                      void (*progress_callback)(size_t, size_t)) {
    FILE* fp_src = fopen(src, "rb");
    if (!fp_src) {
        printf("无法打开源文件: %s\n", src);
        return -1;
    }

    FILE* fp_dst = fopen(dst, "wb");
    if (!fp_dst) {
        printf("无法创建目标文件: %s\n", dst);
        fclose(fp_src);
        return -1;
    }

    // 获取源文件大小
    fseek(fp_src, 0, SEEK_END);
    size_t total_size = ftell(fp_src);
    rewind(fp_src);

    // 分配缓冲区
    unsigned char* buffer = (unsigned char*)malloc(CHUNK_SIZE);
    if (!buffer) {
        printf("无法分配缓冲区\n");
        fclose(fp_src);
        fclose(fp_dst);
        return -1;
    }

    // 分块读取和写入
    size_t total_read = 0;
    size_t bytes_read;

    while ((bytes_read = fread(buffer, 1, CHUNK_SIZE, fp_src)) > 0) {
        size_t bytes_written = fwrite(buffer, 1, bytes_read, fp_dst);
        if (bytes_written != bytes_read) {
            printf("写入错误\n");
            free(buffer);
            fclose(fp_src);
            fclose(fp_dst);
            return -1;
        }

        total_read += bytes_read;

        if (progress_callback) {
            progress_callback(total_read, total_size);
        }
    }

    free(buffer);
    fclose(fp_src);
    fclose(fp_dst);

    printf("\n复制完成: %zu 字节\n", total_read);
    return 0;
}

// 进度回调
void print_progress(size_t current, size_t total) {
    if (total == 0) return;
    int percent = (int)(100.0 * current / total);
    printf("\r  进度: %d%% (%zu / %zu 字节)", percent, current, total);
    fflush(stdout);
}

// 分块查找
void search_in_large_file(const char* filename, const char* pattern) {
    FILE* fp = fopen(filename, "rb");
    if (!fp) {
        printf("无法打开文件: %s\n", filename);
        return;
    }

    fseek(fp, 0, SEEK_END);
    size_t file_size = ftell(fp);
    rewind(fp);

    unsigned char* buffer = (unsigned char*)malloc(CHUNK_SIZE + strlen(pattern));
    if (!buffer) {
        fclose(fp);
        return;
    }

    size_t pattern_len = strlen(pattern);
    size_t overlap = pattern_len - 1;  // 重叠区域，处理跨块边界匹配
    size_t offset = 0;
    int match_count = 0;

    printf("在文件中搜索 \"%s\":\n", pattern);

    while (1) {
        size_t bytes_read = fread(buffer, 1, CHUNK_SIZE + overlap, fp);
        if (bytes_read == 0) break;

        // 在缓冲区中搜索
        for (size_t i = 0; i <= bytes_read - pattern_len; i++) {
            if (memcmp(buffer + i, pattern, pattern_len) == 0) {
                printf("  找到匹配: 偏移 %zu (0x%zX)\n",
                       offset + i, offset + i);
                match_count++;
            }
        }

        offset += bytes_read - overlap;

        // 如果读取的数据少于块大小，说明到文件末尾了
        if (bytes_read < CHUNK_SIZE + overlap) break;

        // 回退文件指针，处理重叠区域
        fseek(fp, -(long)overlap, SEEK_CUR);
    }

    printf("  共找到 %d 处匹配\n", match_count);

    free(buffer);
    fclose(fp);
}

// 创建大文件用于测试
void create_large_test_file(const char* filename, size_t size_mb) {
    printf("创建测试文件 %s (%zu MB)...\n", filename, size_mb);

    FILE* fp = fopen(filename, "wb");
    if (!fp) return;

    char buffer[1024];
    memset(buffer, 'A', sizeof(buffer));

    size_t remaining = size_mb * 1024 * 1024;
    while (remaining > 0) {
        size_t to_write = remaining > sizeof(buffer) ? sizeof(buffer) : remaining;
        fwrite(buffer, 1, to_write, fp);
        remaining -= to_write;
    }

    // 在特定位置写入标记
    const char* marker = "==HELLO_WORLD_MARKER==";
    fseek(fp, 5000000, SEEK_SET);  // 在5MB位置
    fwrite(marker, 1, strlen(marker), fp);

    fseek(fp, 20000000, SEEK_SET);  // 在20MB位置
    fwrite(marker, 1, strlen(marker), fp);

    fclose(fp);
    printf("测试文件创建完成\n");
}

// 计算文件MD5简化版（使用XOR校验）
unsigned int file_checksum(const char* filename) {
    FILE* fp = fopen(filename, "rb");
    if (!fp) return 0;

    unsigned char buffer[CHUNK_SIZE];
    unsigned int checksum = 0;
    size_t bytes_read;

    while ((bytes_read = fread(buffer, 1, sizeof(buffer), fp)) > 0) {
        for (size_t i = 0; i < bytes_read; i++) {
            checksum = (checksum << 1) | (checksum >> 31);
            checksum ^= buffer[i];
        }
    }

    fclose(fp);
    return checksum;
}

int main() {
    printf("========== 大文件分块读写 ==========\n\n");

    // 1. 创建测试文件
    printf("1. 创建测试文件:\n");
    create_large_test_file("large_test.bin", 25);  // 25MB
    printf("\n");

    // 2. 分块复制
    printf("2. 分块复制文件:\n");
    copy_file_chunked("large_test.bin", "large_test_copy.bin",
                      print_progress);
    printf("\n\n");

    // 3. 验证文件完整性
    printf("3. 验证文件完整性:\n");
    unsigned int cs1 = file_checksum("large_test.bin");
    unsigned int cs2 = file_checksum("large_test_copy.bin");
    printf("  源文件校验和: 0x%08X\n", cs1);
    printf("  副本校验和: 0x%08X\n", cs2);
    printf("  完整性: %s\n\n", cs1 == cs2 ? "通过" : "失败!");

    // 4. 在大文件中搜索
    printf("4. 在大文件中搜索:\n");
    search_in_large_file("large_test.bin", "==HELLO_WORLD_MARKER==");

    printf("\n分块读写要点:\n");
    printf("  - 选择合适的块大小（通常1MB-8MB）\n");
    printf("  - 处理跨块边界的匹配问题\n");
    printf("  - 使用校验和验证文件完整性\n");
    printf("  - 提供进度反馈提升用户体验\n");

    return 0;
}
```

---

## 五、文件加密与解密

### 5.1 XOR加密算法

XOR加密是最简单也最经典的对称加密算法。它使用一个密钥对文件进行逐字节异或操作，加密和解密使用相同的算法。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

/*
 * 文件加密与解密
 * XOR加密、密码保护、文件完整性校验
 */

// 简单XOR加密
void xor_encrypt_file(const char* src, const char* dst,
                      const char* password) {
    FILE* fp_src = fopen(src, "rb");
    if (!fp_src) {
        printf("无法打开源文件: %s\n", src);
        return;
    }

    FILE* fp_dst = fopen(dst, "wb");
    if (!fp_dst) {
        printf("无法创建目标文件: %s\n", dst);
        fclose(fp_src);
        return;
    }

    size_t pass_len = strlen(password);
    int byte;

    while ((byte = fgetc(fp_src)) != EOF) {
        // 循环使用密码字节进行异或
        static size_t pass_idx = 0;
        byte ^= password[pass_idx];
        pass_idx = (pass_idx + 1) % pass_len;

        fputc(byte, fp_dst);
    }

    // 重置密码索引（静态变量）
    fseek(fp_src, 0, SEEK_SET);

    fclose(fp_src);
    fclose(fp_dst);

    printf("XOR加密完成: %s -> %s\n", src, dst);
}

// 带文件头的加密（包含密码验证）
typedef struct {
    uint32_t magic;          // 魔数: 0x454E4352 ("ENCR")
    uint32_t version;        // 版本
    uint32_t checksum;       // 原始文件校验和
    uint32_t reserved;       // 保留
    char     password_hash[32]; // 密码的简单哈希
} EncryptedHeader;

// 简单哈希函数
void simple_hash(const char* password, char* hash_out) {
    uint32_t hash = 5381;
    while (*password) {
        hash = ((hash << 5) + hash) + (unsigned char)*password;
        password++;
    }
    snprintf(hash_out, 32, "%08X", hash);
}

// 安全加密（带文件头）
int secure_encrypt_file(const char* src, const char* dst,
                        const char* password) {
    FILE* fp_src = fopen(src, "rb");
    if (!fp_src) return -1;

    FILE* fp_dst = fopen(dst, "wb");
    if (!fp_dst) {
        fclose(fp_src);
        return -1;
    }

    // 计算源文件校验和
    fseek(fp_src, 0, SEEK_END);
    size_t src_size = ftell(fp_src);
    rewind(fp_src);

    unsigned char* src_data = (unsigned char*)malloc(src_size);
    if (!src_data) {
        fclose(fp_src);
        fclose(fp_dst);
        return -1;
    }
    fread(src_data, 1, src_size, fp_src);
    rewind(fp_src);

    uint32_t checksum = 0;
    for (size_t i = 0; i < src_size; i++) {
        checksum = (checksum * 31) + src_data[i];
    }

    // 创建并写入文件头
    EncryptedHeader header;
    memset(&header, 0, sizeof(header));
    header.magic = 0x454E4352;  // "ENCR"
    header.version = 1;
    header.checksum = checksum;
    simple_hash(password, header.password_hash);

    fwrite(&header, sizeof(EncryptedHeader), 1, fp_dst);

    // 加密并写入数据
    size_t pass_len = strlen(password);
    size_t pass_idx = 0;

    for (size_t i = 0; i < src_size; i++) {
        unsigned char byte = src_data[i];
        byte ^= password[pass_idx];
        pass_idx = (pass_idx + 1) % pass_len;
        fputc(byte, fp_dst);
    }

    free(src_data);
    fclose(fp_src);
    fclose(fp_dst);

    printf("安全加密完成: %s -> %s (密码验证已启用)\n", src, dst);
    return 0;
}

// 安全解密
int secure_decrypt_file(const char* src, const char* dst,
                        const char* password) {
    FILE* fp_src = fopen(src, "rb");
    if (!fp_src) return -1;

    // 读取文件头
    EncryptedHeader header;
    fread(&header, sizeof(EncryptedHeader), 1, fp_src);

    // 验证魔数
    if (header.magic != 0x454E4352) {
        printf("错误：不是有效的加密文件\n");
        fclose(fp_src);
        return -1;
    }

    // 验证密码
    char hash[32];
    simple_hash(password, hash);
    if (strcmp(hash, header.password_hash) != 0) {
        printf("错误：密码不正确\n");
        fclose(fp_src);
        return -1;
    }

    // 获取加密数据大小
    fseek(fp_src, 0, SEEK_END);
    size_t encrypted_size = ftell(fp_src) - sizeof(EncryptedHeader);
    fseek(fp_src, sizeof(EncryptedHeader), SEEK_SET);

    unsigned char* encrypted_data = (unsigned char*)malloc(encrypted_size);
    if (!encrypted_data) {
        fclose(fp_src);
        return -1;
    }
    fread(encrypted_data, 1, encrypted_size, fp_src);
    fclose(fp_src);

    // 解密数据
    size_t pass_len = strlen(password);
    size_t pass_idx = 0;

    for (size_t i = 0; i < encrypted_size; i++) {
        encrypted_data[i] ^= password[pass_idx];
        pass_idx = (pass_idx + 1) % pass_len;
    }

    // 验证校验和
    uint32_t checksum = 0;
    for (size_t i = 0; i < encrypted_size; i++) {
        checksum = (checksum * 31) + encrypted_data[i];
    }

    if (checksum != header.checksum) {
        printf("警告：校验和不匹配，文件可能已损坏\n");
        // 仍然写入解密后的数据
    }

    // 写入解密后的数据
    FILE* fp_dst = fopen(dst, "wb");
    if (!fp_dst) {
        free(encrypted_data);
        return -1;
    }

    fwrite(encrypted_data, 1, encrypted_size, fp_dst);
    fclose(fp_dst);
    free(encrypted_data);

    printf("解密完成: %s -> %s (校验和: %s)\n",
           src, dst,
           checksum == header.checksum ? "匹配" : "不匹配!");
    return 0;
}

// 创建测试文件
void create_test_file(const char* filename) {
    FILE* fp = fopen(filename, "w");
    if (!fp) return;

    fprintf(fp, "这是机密文件内容。\n");
    fprintf(fp, "包含敏感信息，需要加密保护。\n");
    fprintf(fp, "用户密码: admin123\n");
    fprintf(fp, "API密钥: sk-abcdefghijklmnop\n");
    fprintf(fp, "数据库连接: mysql://user:pass@localhost/db\n");
    fprintf(fp, "\n");
    fprintf(fp, "项目计划:\n");
    fprintf(fp, "  Phase 1: 2026 Q1 - 基础架构\n");
    fprintf(fp, "  Phase 2: 2026 Q2 - 核心功能\n");
    fprintf(fp, "  Phase 3: 2026 Q3 - 测试与优化\n");
    fprintf(fp, "  Phase 4: 2026 Q4 - 正式发布\n");

    fclose(fp);
    printf("测试文件已创建: %s\n", filename);
}

// 显示文件内容
void show_file_content(const char* filename) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开文件: %s\n", filename);
        return;
    }

    printf("===== %s =====\n", filename);
    char line[256];
    while (fgets(line, sizeof(line), fp)) {
        printf("  %s", line);
    }
    printf("================\n");
    fclose(fp);
}

int main() {
    printf("========== 文件加密与解密 ==========\n\n");

    const char* password = "MySecretKey123!";

    // 1. 创建测试文件
    printf("1. 创建测试文件:\n");
    create_test_file("secret.txt");
    printf("\n原始文件内容:\n");
    show_file_content("secret.txt");
    printf("\n");

    // 2. 简单XOR加密
    printf("2. 简单XOR加密:\n");
    xor_encrypt_file("secret.txt", "secret_xor.enc", password);
    printf("\n加密后的文件（二进制）:\n");
    show_file_content("secret_xor.enc");
    printf("\n");

    // 3. XOR解密
    printf("3. XOR解密:\n");
    xor_encrypt_file("secret_xor.enc", "secret_xor_dec.txt", password);
    printf("\n解密后的文件:\n");
    show_file_content("secret_xor_dec.txt");
    printf("\n");

    // 4. 安全加密（带密码验证）
    printf("4. 安全加密（带密码验证和校验和）:\n");
    secure_encrypt_file("secret.txt", "secret_secure.enc", password);
    printf("\n");

    // 5. 安全解密（正确密码）
    printf("5. 安全解密（正确密码）:\n");
    secure_decrypt_file("secret_secure.enc", "secret_secure_dec.txt", password);
    printf("\n解密后的文件:\n");
    show_file_content("secret_secure_dec.txt");
    printf("\n");

    // 6. 安全解密（错误密码）
    printf("6. 安全解密（错误密码）:\n");
    secure_decrypt_file("secret_secure.enc", "secret_wrong.txt", "WrongPassword");

    printf("\n加密方案对比:\n");
    printf("  简单XOR:\n");
    printf("    优点: 实现简单，加密解密速度快\n");
    printf("    缺点: 无密码验证，无完整性校验\n");
    printf("    适用: 低安全需求场景\n\n");
    printf("  安全加密:\n");
    printf("    优点: 密码验证，校验和完整性检查\n");
    printf("    缺点: 实现稍复杂\n");
    printf("    适用: 需要密码验证和完整性保护的场景\n");

    return 0;
}
```

---

## 六、配置文件解析

### 6.1 INI格式配置文件解析器

INI文件是最常见的配置文件格式之一。下面实现一个完整的INI文件解析器，支持节（section）、键值对、注释、多行值等特性。

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

/*
 * 配置文件解析器
 * 支持INI格式：节、键值对、注释
 */

#define MAX_SECTIONS 50
#define MAX_KEYS_PER_SECTION 100
#define MAX_KEY_LEN 64
#define MAX_VALUE_LEN 256
#define MAX_SECTION_LEN 64

// 键值对
typedef struct {
    char key[MAX_KEY_LEN];
    char value[MAX_VALUE_LEN];
} ConfigEntry;

// 配置节
typedef struct {
    char name[MAX_SECTION_LEN];
    ConfigEntry entries[MAX_KEYS_PER_SECTION];
    int entry_count;
} ConfigSection;

// 配置对象
typedef struct {
    ConfigSection sections[MAX_SECTIONS];
    int section_count;
    ConfigSection* global_section;  // 全局节（文件开头的无节键值对）
} Config;

// 去除字符串首尾空白
char* trim(char* str) {
    while (isspace((unsigned char)*str)) str++;
    if (*str == '\0') return str;

    char* end = str + strlen(str) - 1;
    while (end > str && isspace((unsigned char)*end)) end--;
    *(end + 1) = '\0';
    return str;
}

// 解析INI文件
Config* config_load(const char* filename) {
    Config* cfg = (Config*)malloc(sizeof(Config));
    if (!cfg) return NULL;

    memset(cfg, 0, sizeof(Config));

    // 创建全局节
    cfg->global_section = &cfg->sections[0];
    strcpy(cfg->global_section->name, "__global__");
    cfg->section_count = 1;

    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("无法打开配置文件: %s\n", filename);
        free(cfg);
        return NULL;
    }

    char line[MAX_VALUE_LEN + MAX_KEY_LEN + 10];
    ConfigSection* current_section = cfg->global_section;

    while (fgets(line, sizeof(line), fp)) {
        char* trimmed = trim(line);

        // 跳过空行和注释行
        if (*trimmed == '\0' || *trimmed == '#' || *trimmed == ';') {
            continue;
        }

        // 检查是否是节标题 [SectionName]
        if (*trimmed == '[') {
            char* end = strchr(trimmed, ']');
            if (end) {
                *end = '\0';
                char* section_name = trim(trimmed + 1);

                // 检查节是否已存在
                bool found = false;
                for (int i = 0; i < cfg->section_count; i++) {
                    if (strcmp(cfg->sections[i].name, section_name) == 0) {
                        current_section = &cfg->sections[i];
                        found = true;
                        break;
                    }
                }

                if (!found && cfg->section_count < MAX_SECTIONS) {
                    current_section = &cfg->sections[cfg->section_count++];
                    strncpy(current_section->name, section_name,
                            MAX_SECTION_LEN - 1);
                    current_section->entry_count = 0;
                }
            }
            continue;
        }

        // 解析键值对
        char* eq = strchr(trimmed, '=');
        if (!eq) continue;

        *eq = '\0';
        char* key = trim(trimmed);
        char* value = trim(eq + 1);

        // 去除值两端的引号
        if ((*value == '"' && value[strlen(value) - 1] == '"') ||
            (*value == '\'' && value[strlen(value) - 1] == '\'')) {
            value[strlen(value) - 1] = '\0';
            value++;
        }

        // 添加到当前节
        if (current_section->entry_count < MAX_KEYS_PER_SECTION) {
            ConfigEntry* entry =
                &current_section->entries[current_section->entry_count++];
            strncpy(entry->key, key, MAX_KEY_LEN - 1);
            strncpy(entry->value, value, MAX_VALUE_LEN - 1);
        }
    }

    fclose(fp);
    printf("配置文件加载完成: %s (%d个节)\n", filename, cfg->section_count);
    return cfg;
}

// 获取字符串值
const char* config_get_string(Config* cfg, const char* section,
                              const char* key, const char* default_value) {
    for (int i = 0; i < cfg->section_count; i++) {
        if (strcmp(cfg->sections[i].name, section) == 0) {
            for (int j = 0; j < cfg->sections[i].entry_count; j++) {
                if (strcmp(cfg->sections[i].entries[j].key, key) == 0) {
                    return cfg->sections[i].entries[j].value;
                }
            }
        }
    }
    return default_value;
}

// 获取整数值
int config_get_int(Config* cfg, const char* section,
                   const char* key, int default_value) {
    const char* val = config_get_string(cfg, section, key, NULL);
    if (!val) return default_value;

    char* end;
    long result = strtol(val, &end, 10);
    if (*end != '\0') return default_value;  // 不是有效整数

    return (int)result;
}

// 获取浮点值
double config_get_double(Config* cfg, const char* section,
                         const char* key, double default_value) {
    const char* val = config_get_string(cfg, section, key, NULL);
    if (!val) return default_value;

    char* end;
    double result = strtod(val, &end);
    if (*end != '\0') return default_value;

    return result;
}

// 获取布尔值
bool config_get_bool(Config* cfg, const char* section,
                     const char* key, bool default_value) {
    const char* val = config_get_string(cfg, section, key, NULL);
    if (!val) return default_value;

    if (strcmp(val, "true") == 0 || strcmp(val, "yes") == 0 ||
        strcmp(val, "1") == 0 || strcmp(val, "on") == 0) {
        return true;
    }
    if (strcmp(val, "false") == 0 || strcmp(val, "no") == 0 ||
        strcmp(val, "0") == 0 || strcmp(val, "off") == 0) {
        return false;
    }
    return default_value;
}

// 打印配置
void config_print(Config* cfg) {
    printf("===== 配置内容 =====\n");
    for (int i = 0; i < cfg->section_count; i++) {
        ConfigSection* sec = &cfg->sections[i];
        if (strcmp(sec->name, "__global__") != 0) {
            printf("[%s]\n", sec->name);
        }
        for (int j = 0; j < sec->entry_count; j++) {
            printf("  %s = %s\n", sec->entries[j].key, sec->entries[j].value);
        }
        if (strcmp(sec->name, "__global__") != 0 && sec->entry_count > 0) {
            printf("\n");
        }
    }
    printf("====================\n");
}

// 释放配置
void config_free(Config* cfg) {
    free(cfg);
}

int main() {
    printf("========== 配置文件解析器 ==========\n\n");

    // 1. 创建示例配置文件
    printf("1. 创建示例配置文件:\n");
    FILE* fp = fopen("app_config.ini", "w");
    if (fp) {
        fputs("# 应用程序配置文件\n", fp);
        fputs("app_name = \"My Application\"\n", fp);
        fputs("version = 2.1.0\n", fp);
        fputs("\n", fp);
        fputs("[server]\n", fp);
        fputs("host = 192.168.1.100\n", fp);
        fputs("port = 8080\n", fp);
        fputs("max_connections = 100\n", fp);
        fputs("enable_ssl = true\n", fp);
        fputs("timeout = 30\n", fp);
        fputs("\n", fp);
        fputs("[database]\n", fp);
        fputs("host = db.example.com\n", fp);
        fputs("port = 3306\n", fp);
        fputs("name = myapp_db\n", fp);
        fputs("user = admin\n", fp);
        fputs("password = secret123\n", fp);
        fputs("pool_size = 20\n", fp);
        fputs("\n", fp);
        fputs("[logging]\n", fp);
        fputs("level = INFO\n", fp);
        fputs("file = /var/log/myapp.log\n", fp);
        fputs("max_size = 10485760\n", fp);
        fputs("backup_count = 5\n", fp);
        fputs("console_output = true\n", fp);
        fputs("\n", fp);
        fputs("[features]\n", fp);
        fputs("enable_cache = true\n", fp);
        fputs("enable_compression = false\n", fp);
        fputs("cache_ttl = 3600\n", fp);
        fputs("max_upload_size = 10485760\n", fp);
        fclose(fp);
        printf("  配置文件创建成功: app_config.ini\n\n");
    }

    // 2. 加载配置文件
    printf("2. 加载配置文件:\n");
    Config* cfg = config_load("app_config.ini");
    if (!cfg) return 1;

    config_print(cfg);
    printf("\n");

    // 3. 读取配置值
    printf("3. 读取配置值:\n");

    printf("  [server] 配置:\n");
    printf("    host = %s\n", config_get_string(cfg, "server", "host", ""));
    printf("    port = %d\n", config_get_int(cfg, "server", "port", 0));
    printf("    max_connections = %d\n",
           config_get_int(cfg, "server", "max_connections", 0));
    printf("    enable_ssl = %s\n",
           config_get_bool(cfg, "server", "enable_ssl", false) ? "true" : "false");
    printf("    timeout = %d\n", config_get_int(cfg, "server", "timeout", 0));

    printf("\n  [database] 配置:\n");
    printf("    host = %s\n", config_get_string(cfg, "database", "host", ""));
    printf("    port = %d\n", config_get_int(cfg, "database", "port", 0));
    printf("    name = %s\n", config_get_string(cfg, "database", "name", ""));
    printf("    pool_size = %d\n",
           config_get_int(cfg, "database", "pool_size", 0));

    printf("\n  [logging] 配置:\n");
    printf("    level = %s\n", config_get_string(cfg, "logging", "level", ""));
    printf("    file = %s\n", config_get_string(cfg, "logging", "file", ""));
    printf("    max_size = %d\n",
           config_get_int(cfg, "logging", "max_size", 0));

    printf("\n  [features] 配置:\n");
    printf("    enable_cache = %s\n",
           config_get_bool(cfg, "features", "enable_cache", false) ? "true" : "false");
    printf("    cache_ttl = %d\n",
           config_get_int(cfg, "features", "cache_ttl", 0));

    printf("\n  不存在的配置项（使用默认值）:\n");
    printf("    nonexistent = %s\n",
           config_get_string(cfg, "server", "nonexistent", "默认值"));
    printf("    missing_int = %d\n",
           config_get_int(cfg, "server", "missing", 999));

    // 释放配置
    config_free(cfg);

    printf("\n配置文件解析器特性:\n");
    printf("  - 支持节（section）分组\n");
    printf("  - 支持注释（#和;开头）\n");
    printf("  - 支持带引号的值\n");
    printf("  - 类型安全的值获取（string/int/double/bool）\n");
    printf("  - 默认值支持\n");

    return 0;
}
```

---

## 七、本章小结

本章通过五个完整的实战项目，将C语言文件操作的知识应用到实际场景中，展示了文件IO编程的强大能力。

**核心知识点回顾：**

1. **格式化文件读写实战**：实现了完整的CSV文件读写器，支持标题行、带引号字段、数据筛选和统计。同时构建了日志系统，支持多级别、时间戳、文件轮转和日志分析。

2. **学生成绩管理系统**：实现了一个完整的文件版成绩管理系统，包括增删改查、成绩统计、排名计算等功能。使用二进制文件存储，支持随机访问和软删除。展示了文件头+数据记录的标准数据库设计模式。

3. **大文件分块读写**：实现了分块文件复制、大文件搜索、文件校验和计算等功能。分块读写是处理超大文件的标准方法，关键要点包括选择合适的块大小、处理跨块边界问题、提供进度反馈。

4. **文件加密与解密**：实现了两种加密方案。简单XOR加密适合低安全需求，实现简单高效。安全加密方案添加了文件头、密码验证和校验和，提供了更高的安全性。

5. **配置文件解析**：实现了完整的INI格式配置文件解析器，支持节、键值对、注释、类型安全的值获取（字符串、整数、浮点数、布尔值）和默认值。

通过这些实战项目，你已经掌握了将文件操作应用于实际开发的完整技能。文件IO是C语言编程中不可或缺的基础能力，熟练运用这些技术将使你能够开发出功能完善、数据可持久化的应用程序。
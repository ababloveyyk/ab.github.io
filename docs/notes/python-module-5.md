---
title: Python模块包与异常Ⅴ——综合实战：工程化项目
date: 2026-07-26
tags:
  - Python
  - 工程化
  - 项目实战
  - 模块
  - 异常处理
categories:
  - Python
---

## 一、项目概述与设计

### 1.1 项目背景

本章我们将综合运用前面学到的所有知识——模块、包、异常处理、日志记录、标准库等——构建一个完整的工程化项目。我们将创建一个名为"任务管理器"（Task Manager）的命令行工具，这个工具支持任务的创建、查询、更新和删除操作，具有完整的日志系统、配置文件管理和异常处理体系。

通过这个项目，你将学习到：

- 如何设计合理的项目目录结构
- 如何将代码拆分为多个模块和包
- 如何搭建日志系统
- 如何管理配置文件
- 如何构建完整的异常处理体系
- 如何编写命令行工具
- 如何编写可测试的代码

### 1.2 项目目录结构

一个良好的项目结构是工程化开发的基础。以下是我们的项目结构：

```
task_manager/
├── main.py                  # 程序入口
├── settings.py              # 配置管理
├── tools.py                 # 工具函数
├── README.md                # 项目说明
├── requirements.txt         # 依赖清单
├── config/                  # 配置文件目录
│   ├── __init__.py
│   └── app_config.json      # 应用配置文件
├── core/                    # 核心业务逻辑
│   ├── __init__.py
│   ├── task_manager.py      # 任务管理器
│   └── task_storage.py      # 任务存储
├── models/                  # 数据模型
│   ├── __init__.py
│   └── task.py              # 任务模型
├── exceptions/              # 自定义异常
│   ├── __init__.py
│   └── errors.py            # 异常定义
├── utils/                   # 工具模块
│   ├── __init__.py
│   ├── logger.py            # 日志配置
│   └── validators.py        # 数据验证
└── tests/                   # 测试目录
    ├── __init__.py
    └── test_task_manager.py # 测试文件
```

### 1.3 项目功能需求

我们的任务管理器需要支持以下功能：

1. **任务创建**：创建新任务，包含标题、描述、优先级、截止日期等信息
2. **任务查询**：按ID查询、按状态查询、按优先级查询、列出所有任务
3. **任务更新**：修改任务状态、更新任务信息
4. **任务删除**：删除指定任务
5. **数据持久化**：将任务数据保存到JSON文件
6. **日志记录**：记录所有操作和错误信息
7. **命令行界面**：通过命令行参数与用户交互

## 二、核心代码实现

### 2.1 异常定义模块（exceptions/errors.py）

首先，我们定义项目所需的自定义异常类。这些异常形成了项目的异常处理体系，使得错误处理更加语义化和精确。

```python
# 文件：exceptions/errors.py
"""
任务管理器异常定义模块

此模块定义了任务管理器项目中使用的所有自定义异常类。
通过层次化的异常体系，实现了精细化的错误处理。
"""

class TaskManagerError(Exception):
    """任务管理器基础异常类
    
    所有自定义异常的基类，用于统一捕获任务管理器相关的异常。
    可以通过捕获此异常来捕获所有自定义异常。
    
    属性:
        message: 错误消息
        error_code: 错误代码（可选）
    """
    def __init__(self, message, error_code=None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
    
    def __str__(self):
        if self.error_code:
            return f"[{self.error_code}] {self.message}"
        return self.message
    
    def to_dict(self):
        """将异常信息转换为字典格式"""
        return {
            'error': self.__class__.__name__,
            'message': self.message,
            'error_code': self.error_code
        }


class TaskNotFoundError(TaskManagerError):
    """任务未找到异常
    
    当尝试访问不存在的任务时抛出。
    
    属性:
        task_id: 未找到的任务ID
    """
    def __init__(self, task_id, message=None):
        self.task_id = task_id
        if message is None:
            message = f"任务不存在: ID={task_id}"
        super().__init__(message, error_code="TASK_NOT_FOUND")
    
    def to_dict(self):
        result = super().to_dict()
        result['task_id'] = self.task_id
        return result


class TaskValidationError(TaskManagerError):
    """任务验证异常
    
    当任务数据不符合验证规则时抛出。
    
    属性:
        field: 验证失败的字段名
        value: 导致验证失败的值
    """
    def __init__(self, message, field=None, value=None):
        self.field = field
        self.value = value
        super().__init__(message, error_code="VALIDATION_ERROR")
    
    def to_dict(self):
        result = super().to_dict()
        if self.field:
            result['field'] = self.field
        if self.value:
            result['value'] = str(self.value)
        return result


class TaskDuplicateError(TaskManagerError):
    """任务重复异常
    
    当尝试创建已存在的任务时抛出。
    
    属性:
        task_id: 重复的任务ID
    """
    def __init__(self, task_id, message=None):
        self.task_id = task_id
        if message is None:
            message = f"任务已存在: ID={task_id}"
        super().__init__(message, error_code="DUPLICATE_TASK")


class StorageError(TaskManagerError):
    """存储异常
    
    当数据存储操作失败时抛出（如文件读写错误）。
    
    属性:
        file_path: 相关的文件路径
        operation: 失败的操作类型
    """
    def __init__(self, message, file_path=None, operation=None):
        self.file_path = file_path
        self.operation = operation
        super().__init__(message, error_code="STORAGE_ERROR")
    
    def to_dict(self):
        result = super().to_dict()
        if self.file_path:
            result['file_path'] = self.file_path
        if self.operation:
            result['operation'] = self.operation
        return result


class ConfigError(TaskManagerError):
    """配置异常
    
    当配置加载或解析失败时抛出。
    """
    def __init__(self, message):
        super().__init__(message, error_code="CONFIG_ERROR")
```

### 2.2 任务模型（models/task.py）

任务模型定义了任务的数据结构，包括任务的属性和基本验证逻辑。

```python
# 文件：models/task.py
"""
任务模型模块

此模块定义了Task类，表示任务管理器中的单个任务。
包含了任务的属性定义、验证逻辑和序列化方法。
"""

from datetime import datetime
from enum import Enum
import uuid

# 导入异常（在实际项目中，这是相对导入）
# from ..exceptions.errors import TaskValidationError


class TaskPriority(Enum):
    """任务优先级枚举"""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4
    
    @classmethod
    def from_string(cls, value):
        """从字符串创建优先级"""
        mapping = {
            'low': cls.LOW,
            'medium': cls.MEDIUM,
            'high': cls.HIGH,
            'urgent': cls.URGENT,
            '1': cls.LOW,
            '2': cls.MEDIUM,
            '3': cls.HIGH,
            '4': cls.URGENT,
        }
        if isinstance(value, cls):
            return value
        if isinstance(value, int):
            for p in cls:
                if p.value == value:
                    return p
        if value.lower() in mapping:
            return mapping[value.lower()]
        raise ValueError(f"无效的优先级: {value}")
    
    def label(self):
        """获取优先级的中文标签"""
        labels = {
            TaskPriority.LOW: "低",
            TaskPriority.MEDIUM: "中",
            TaskPriority.HIGH: "高",
            TaskPriority.URGENT: "紧急",
        }
        return labels.get(self, "未知")


class TaskStatus(Enum):
    """任务状态枚举"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    CANCELLED = "cancelled"
    
    @classmethod
    def from_string(cls, value):
        """从字符串创建状态"""
        mapping = {
            'todo': cls.TODO,
            'in_progress': cls.IN_PROGRESS,
            'in-progress': cls.IN_PROGRESS,
            'done': cls.DONE,
            'cancelled': cls.CANCELLED,
        }
        if isinstance(value, cls):
            return value
        if value.lower() in mapping:
            return mapping[value.lower()]
        raise ValueError(f"无效的状态: {value}")
    
    def label(self):
        """获取状态的中文标签"""
        labels = {
            TaskStatus.TODO: "待办",
            TaskStatus.IN_PROGRESS: "进行中",
            TaskStatus.DONE: "已完成",
            TaskStatus.CANCELLED: "已取消",
        }
        return labels.get(self, "未知")


class Task:
    """任务模型类
    
    表示一个任务，包含以下属性:
    - id: 任务唯一标识（UUID）
    - title: 任务标题
    - description: 任务描述
    - priority: 任务优先级
    - status: 任务状态
    - created_at: 创建时间
    - updated_at: 更新时间
    - due_date: 截止日期
    - tags: 任务标签
    """
    
    MAX_TITLE_LENGTH = 200
    MAX_DESCRIPTION_LENGTH = 5000
    
    def __init__(self, title, description="", priority=TaskPriority.MEDIUM,
                 status=TaskStatus.TODO, due_date=None, tags=None):
        """初始化任务
        
        参数:
            title: 任务标题（必填）
            description: 任务描述
            priority: 任务优先级
            status: 任务状态
            due_date: 截止日期（datetime对象）
            tags: 任务标签列表
        """
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.priority = TaskPriority.from_string(priority) if not isinstance(priority, TaskPriority) else priority
        self.status = TaskStatus.from_string(status) if not isinstance(status, TaskStatus) else status
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.due_date = due_date
        self.tags = tags or []
    
    def validate(self):
        """验证任务数据的有效性
        
        返回:
            (bool, str): 验证结果和错误消息
        """
        if not self.title or not self.title.strip():
            return False, "任务标题不能为空"
        
        if len(self.title) > self.MAX_TITLE_LENGTH:
            return False, f"任务标题长度不能超过{self.MAX_TITLE_LENGTH}个字符"
        
        if self.description and len(self.description) > self.MAX_DESCRIPTION_LENGTH:
            return False, f"任务描述长度不能超过{self.MAX_DESCRIPTION_LENGTH}个字符"
        
        if self.due_date and isinstance(self.due_date, datetime):
            if self.due_date < datetime.now():
                return False, "截止日期不能是过去的时间"
        
        return True, ""
    
    def update(self, title=None, description=None, priority=None,
               status=None, due_date=None, tags=None):
        """更新任务信息
        
        只更新提供的字段，未提供的字段保持不变。
        """
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        if priority is not None:
            self.priority = TaskPriority.from_string(priority) if not isinstance(priority, TaskPriority) else priority
        if status is not None:
            self.status = TaskStatus.from_string(status) if not isinstance(status, TaskStatus) else status
        if due_date is not None:
            self.due_date = due_date
        if tags is not None:
            self.tags = tags
        
        self.updated_at = datetime.now()
    
    def mark_done(self):
        """将任务标记为已完成"""
        self.status = TaskStatus.DONE
        self.updated_at = datetime.now()
    
    def mark_in_progress(self):
        """将任务标记为进行中"""
        self.status = TaskStatus.IN_PROGRESS
        self.updated_at = datetime.now()
    
    def cancel(self):
        """取消任务"""
        self.status = TaskStatus.CANCELLED
        self.updated_at = datetime.now()
    
    def is_overdue(self):
        """检查任务是否已过期"""
        if self.due_date and self.status not in (TaskStatus.DONE, TaskStatus.CANCELLED):
            return datetime.now() > self.due_date
        return False
    
    def to_dict(self):
        """将任务转换为字典格式"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority.value,
            'priority_label': self.priority.label(),
            'status': self.status.value,
            'status_label': self.status.label(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'tags': self.tags,
            'is_overdue': self.is_overdue()
        }
    
    @classmethod
    def from_dict(cls, data):
        """从字典创建任务对象
        
        参数:
            data: 包含任务数据的字典
            
        返回:
            Task: 创建的任务对象
        """
        task = cls(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', TaskPriority.MEDIUM),
            status=data.get('status', TaskStatus.TODO),
            tags=data.get('tags', [])
        )
        
        # 恢复ID
        if 'id' in data:
            task.id = data['id']
        
        # 恢复时间戳
        if 'created_at' in data:
            task.created_at = datetime.fromisoformat(data['created_at'])
        if 'updated_at' in data:
            task.updated_at = datetime.fromisoformat(data['updated_at'])
        if 'due_date' in data and data['due_date']:
            task.due_date = datetime.fromisoformat(data['due_date'])
        
        return task
    
    def __str__(self):
        status_icon = {
            TaskStatus.TODO: "[ ]",
            TaskStatus.IN_PROGRESS: "[>]",
            TaskStatus.DONE: "[X]",
            TaskStatus.CANCELLED: "[-]",
        }
        icon = status_icon.get(self.status, "[?]")
        return f"{icon} {self.title} ({self.priority.label()})"
    
    def __repr__(self):
        return f"Task(id='{self.id[:8]}...', title='{self.title}', status={self.status.value})"
    
    def __lt__(self, other):
        """比较任务（用于排序），按优先级降序"""
        if not isinstance(other, Task):
            return NotImplemented
        return self.priority.value > other.priority.value
    
    def __eq__(self, other):
        if not isinstance(other, Task):
            return NotImplemented
        return self.id == other.id
```

### 2.3 任务存储模块（core/task_storage.py）

任务存储模块负责数据的持久化，将任务数据保存到JSON文件中，并支持从文件中读取。

```python
# 文件：core/task_storage.py
"""
任务存储模块

此模块负责任务数据的持久化存储。
使用JSON格式保存任务数据，支持基本的CRUD操作。
"""

import json
import os
import threading
from datetime import datetime

# 在实际项目中，使用相对导入
# from ..exceptions.errors import StorageError


class TaskStorage:
    """任务存储类
    
    负责将任务数据持久化到JSON文件，并提供读取功能。
    使用线程锁确保多线程环境下的数据安全。
    
    属性:
        file_path: 存储文件路径
        _lock: 线程锁
    """
    
    def __init__(self, file_path):
        """初始化存储
        
        参数:
            file_path: 数据存储文件的路径
        """
        self.file_path = file_path
        self._lock = threading.Lock()
        self._ensure_file_exists()
    
    def _ensure_file_exists(self):
        """确保存储文件存在"""
        directory = os.path.dirname(self.file_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
        
        if not os.path.exists(self.file_path):
            self._save_data({})
    
    def _save_data(self, data):
        """保存数据到文件
        
        参数:
            data: 要保存的数据字典
            
        异常:
            StorageError: 当保存失败时抛出
        """
        try:
            # 添加元数据
            save_data = {
                'metadata': {
                    'version': '1.0',
                    'updated_at': datetime.now().isoformat(),
                    'task_count': len(data)
                },
                'tasks': data
            }
            
            # 先写入临时文件，再原子性地替换
            temp_file = self.file_path + '.tmp'
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(save_data, f, ensure_ascii=False, indent=2)
            
            # 原子性替换
            os.replace(temp_file, self.file_path)
            
        except json.JSONEncodeError as e:
            raise StorageError(
                f"数据序列化失败: {e}",
                file_path=self.file_path,
                operation="save"
            )
        except IOError as e:
            raise StorageError(
                f"文件写入失败: {e}",
                file_path=self.file_path,
                operation="save"
            )
    
    def save_tasks(self, tasks_dict):
        """保存所有任务
        
        参数:
            tasks_dict: 任务字典，键为任务ID，值为任务字典数据
        """
        with self._lock:
            self._save_data(tasks_dict)
    
    def load_tasks(self):
        """加载所有任务
        
        返回:
            dict: 任务字典，键为任务ID，值为任务字典数据
            
        异常:
            StorageError: 当加载失败时抛出
        """
        with self._lock:
            try:
                if not os.path.exists(self.file_path):
                    return {}
                
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    save_data = json.load(f)
                
                tasks = save_data.get('tasks', {})
                
                # 兼容旧格式（没有metadata的格式）
                if not tasks and 'metadata' not in save_data:
                    # 可能是旧格式，直接返回所有数据
                    tasks = {k: v for k, v in save_data.items() if k != 'metadata'}
                
                return tasks
                
            except json.JSONDecodeError as e:
                raise StorageError(
                    f"数据文件格式错误: {e}",
                    file_path=self.file_path,
                    operation="load"
                )
            except IOError as e:
                raise StorageError(
                    f"文件读取失败: {e}",
                    file_path=self.file_path,
                    operation="load"
                )
    
    def get_metadata(self):
        """获取存储元数据
        
        返回:
            dict: 元数据字典
        """
        try:
            if not os.path.exists(self.file_path):
                return {}
            
            with open(self.file_path, 'r', encoding='utf-8') as f:
                save_data = json.load(f)
            
            return save_data.get('metadata', {})
            
        except Exception:
            return {}
    
    def backup(self, backup_path=None):
        """创建数据备份
        
        参数:
            backup_path: 备份文件路径，默认为原文件路径加时间戳
        """
        if backup_path is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            base, ext = os.path.splitext(self.file_path)
            backup_path = f"{base}_backup_{timestamp}{ext}"
        
        try:
            import shutil
            shutil.copy2(self.file_path, backup_path)
            return backup_path
        except IOError as e:
            raise StorageError(
                f"备份失败: {e}",
                file_path=self.file_path,
                operation="backup"
            )
```

### 2.4 任务管理器（core/task_manager.py）

任务管理器是核心业务逻辑，封装了所有任务操作。

```python
# 文件：core/task_manager.py
"""
任务管理器模块

此模块是任务管理器的核心业务逻辑，封装了所有任务操作。
包括任务的创建、查询、更新、删除等功能。
"""

from datetime import datetime
from enum import Enum

# 在实际项目中，使用相对导入
# from ..models.task import Task, TaskPriority, TaskStatus
# from ..exceptions.errors import (
#     TaskNotFoundError, TaskValidationError, TaskDuplicateError
# )


class TaskSortBy(Enum):
    """任务排序方式"""
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    PRIORITY = "priority"
    DUE_DATE = "due_date"
    TITLE = "title"


class TaskManager:
    """任务管理器类
    
    提供任务管理的高级接口，封装了所有业务逻辑。
    包括任务创建、查询、更新、删除和统计功能。
    
    属性:
        storage: TaskStorage实例，用于数据持久化
        tasks: 内存中的任务字典
        logger: 日志记录器
    """
    
    def __init__(self, storage, logger=None):
        """初始化任务管理器
        
        参数:
            storage: TaskStorage实例
            logger: 日志记录器（可选）
        """
        self.storage = storage
        self.logger = logger
        self.tasks = {}  # task_id -> Task对象
        self._load_from_storage()
    
    def _load_from_storage(self):
        """从存储加载任务数据"""
        try:
            tasks_data = self.storage.load_tasks()
            for task_id, task_data in tasks_data.items():
                try:
                    # 这里需要Task类的from_dict方法
                    # 在整合的代码中，需要正确导入Task类
                    self.tasks[task_id] = task_data
                except Exception as e:
                    if self.logger:
                        self.logger.warning(f"加载任务 {task_id} 失败: {e}")
            
            if self.logger:
                self.logger.info(f"已加载 {len(self.tasks)} 个任务")
        except Exception as e:
            if self.logger:
                self.logger.error(f"加载任务数据失败: {e}")
    
    def _save_to_storage(self):
        """保存任务数据到存储"""
        try:
            tasks_data = {}
            for task_id, task in self.tasks.items():
                tasks_data[task_id] = task.to_dict() if hasattr(task, 'to_dict') else task
            
            self.storage.save_tasks(tasks_data)
            
            if self.logger:
                self.logger.debug(f"已保存 {len(tasks_data)} 个任务")
        except Exception as e:
            if self.logger:
                self.logger.error(f"保存任务数据失败: {e}")
            raise
    
    def create_task(self, title, description="", priority=None,
                    due_date=None, tags=None):
        """创建新任务
        
        参数:
            title: 任务标题
            description: 任务描述
            priority: 优先级
            due_date: 截止日期
            tags: 标签列表
            
        返回:
            Task: 创建的任务对象
            
        异常:
            TaskValidationError: 验证失败
        """
        # 参数验证
        if not title or not title.strip():
            raise TaskValidationError("任务标题不能为空", field="title")
        
        # 创建任务（需要导入Task类）
        task = Task(
            title=title.strip(),
            description=description.strip() if description else "",
            priority=priority or TaskPriority.MEDIUM,
            due_date=due_date,
            tags=tags or []
        )
        
        # 验证任务数据
        valid, error_msg = task.validate()
        if not valid:
            raise TaskValidationError(error_msg)
        
        # 保存任务
        self.tasks[task.id] = task
        self._save_to_storage()
        
        if self.logger:
            self.logger.info(f"创建任务: {task}")
        
        return task
    
    def get_task(self, task_id):
        """获取指定任务
        
        参数:
            task_id: 任务ID
            
        返回:
            Task: 任务对象
            
        异常:
            TaskNotFoundError: 任务不存在
        """
        if task_id not in self.tasks:
            raise TaskNotFoundError(task_id)
        return self.tasks[task_id]
    
    def get_all_tasks(self, sort_by=None, reverse=False):
        """获取所有任务
        
        参数:
            sort_by: 排序方式
            reverse: 是否反向排序
            
        返回:
            list: 任务列表
        """
        tasks = list(self.tasks.values())
        
        if sort_by == TaskSortBy.PRIORITY:
            tasks.sort(key=lambda t: t.priority.value, reverse=not reverse)
        elif sort_by == TaskSortBy.DUE_DATE:
            tasks.sort(key=lambda t: t.due_date or datetime.max, reverse=reverse)
        elif sort_by == TaskSortBy.TITLE:
            tasks.sort(key=lambda t: t.title, reverse=reverse)
        elif sort_by == TaskSortBy.UPDATED_AT:
            tasks.sort(key=lambda t: t.updated_at, reverse=reverse)
        else:
            # 默认按创建时间排序
            tasks.sort(key=lambda t: t.created_at, reverse=reverse)
        
        return tasks
    
    def get_tasks_by_status(self, status):
        """按状态查询任务
        
        参数:
            status: 任务状态
            
        返回:
            list: 匹配的任务列表
        """
        status = TaskStatus.from_string(status) if not isinstance(status, TaskStatus) else status
        return [t for t in self.tasks.values() if t.status == status]
    
    def get_tasks_by_priority(self, priority):
        """按优先级查询任务
        
        参数:
            priority: 优先级
            
        返回:
            list: 匹配的任务列表
        """
        priority = TaskPriority.from_string(priority) if not isinstance(priority, TaskPriority) else priority
        return [t for t in self.tasks.values() if t.priority == priority]
    
    def search_tasks(self, keyword):
        """搜索任务
        
        参数:
            keyword: 搜索关键词
            
        返回:
            list: 匹配的任务列表
        """
        keyword = keyword.lower()
        results = []
        for task in self.tasks.values():
            if (keyword in task.title.lower() or
                keyword in task.description.lower() or
                any(keyword in tag.lower() for tag in task.tags)):
                results.append(task)
        return results
    
    def update_task(self, task_id, **kwargs):
        """更新任务
        
        参数:
            task_id: 任务ID
            **kwargs: 要更新的字段
            
        返回:
            Task: 更新后的任务对象
            
        异常:
            TaskNotFoundError: 任务不存在
            TaskValidationError: 验证失败
        """
        task = self.get_task(task_id)
        
        # 更新任务
        task.update(**kwargs)
        
        # 验证更新后的数据
        valid, error_msg = task.validate()
        if not valid:
            raise TaskValidationError(error_msg)
        
        self._save_to_storage()
        
        if self.logger:
            self.logger.info(f"更新任务: {task}")
        
        return task
    
    def delete_task(self, task_id):
        """删除任务
        
        参数:
            task_id: 任务ID
            
        异常:
            TaskNotFoundError: 任务不存在
        """
        task = self.get_task(task_id)
        
        del self.tasks[task_id]
        self._save_to_storage()
        
        if self.logger:
            self.logger.info(f"删除任务: {task}")
    
    def mark_task_done(self, task_id):
        """将任务标记为已完成"""
        task = self.get_task(task_id)
        task.mark_done()
        self._save_to_storage()
        
        if self.logger:
            self.logger.info(f"任务完成: {task}")
        
        return task
    
    def get_statistics(self):
        """获取任务统计信息
        
        返回:
            dict: 统计信息字典
        """
        total = len(self.tasks)
        if total == 0:
            return {
                'total': 0,
                'todo': 0, 'in_progress': 0, 'done': 0, 'cancelled': 0,
                'overdue': 0,
                'by_priority': {'low': 0, 'medium': 0, 'high': 0, 'urgent': 0}
            }
        
        # 按状态统计
        status_counts = {}
        for status in TaskStatus:
            status_counts[status.value] = len(self.get_tasks_by_status(status))
        
        # 按优先级统计
        priority_counts = {}
        for priority in TaskPriority:
            priority_counts[priority.name.lower()] = len(self.get_tasks_by_priority(priority))
        
        # 过期任务
        overdue_count = len([t for t in self.tasks.values() if t.is_overdue()])
        
        return {
            'total': total,
            'todo': status_counts.get('todo', 0),
            'in_progress': status_counts.get('in_progress', 0),
            'done': status_counts.get('done', 0),
            'cancelled': status_counts.get('cancelled', 0),
            'overdue': overdue_count,
            'by_priority': priority_counts
        }
    
    def cleanup_completed(self, days_old=30):
        """清理已完成的任务
        
        参数:
            days_old: 清理多少天前完成的任务
            
        返回:
            int: 清理的任务数量
        """
        threshold = datetime.now().timestamp() - (days_old * 86400)
        to_delete = []
        
        for task_id, task in self.tasks.items():
            if (task.status == TaskStatus.DONE and
                task.updated_at.timestamp() < threshold):
                to_delete.append(task_id)
        
        for task_id in to_delete:
            del self.tasks[task_id]
        
        if to_delete:
            self._save_to_storage()
        
        if self.logger:
            self.logger.info(f"清理了 {len(to_delete)} 个已完成任务")
        
        return len(to_delete)
```

### 2.5 日志配置模块（utils/logger.py）

```python
# 文件：utils/logger.py
"""
日志配置模块

此模块负责项目的日志系统配置，提供统一的日志记录接口。
支持控制台输出和文件输出，支持日志轮转。
"""

import logging
import logging.handlers
import os
import sys
from datetime import datetime


def setup_logger(name, log_dir="logs", level=logging.INFO, 
                 console_output=True, file_output=True):
    """设置日志记录器
    
    参数:
        name: 日志记录器名称
        log_dir: 日志文件目录
        level: 日志级别
        console_output: 是否输出到控制台
        file_output: 是否输出到文件
        
    返回:
        logging.Logger: 配置好的日志记录器
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # 避免重复添加处理器
    if logger.handlers:
        return logger
    
    # 日志格式
    console_format = logging.Formatter(
        '%(asctime)s [%(levelname)-7s] %(message)s',
        datefmt='%H:%M:%S'
    )
    
    file_format = logging.Formatter(
        '%(asctime)s [%(levelname)-7s] %(name)s - '
        '%(filename)s:%(lineno)d - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # 控制台处理器
    if console_output:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.setFormatter(console_format)
        logger.addHandler(console_handler)
    
    # 文件处理器
    if file_output:
        os.makedirs(log_dir, exist_ok=True)
        
        # 主日志文件
        log_file = os.path.join(log_dir, f"{name}.log")
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(file_format)
        logger.addHandler(file_handler)
        
        # 错误日志文件
        error_log_file = os.path.join(log_dir, f"{name}_error.log")
        error_handler = logging.FileHandler(error_log_file, encoding='utf-8')
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(file_format)
        logger.addHandler(error_handler)
    
    return logger


def get_logger(name):
    """获取日志记录器
    
    参数:
        name: 日志记录器名称
        
    返回:
        logging.Logger: 日志记录器
    """
    return logging.getLogger(name)
```

### 2.6 配置管理模块（settings.py）

```python
# 文件：settings.py
"""
配置管理模块

此模块负责项目的配置管理，支持从JSON文件加载配置，
并提供默认配置值。使用单例模式确保配置一致性。
"""

import json
import os
from datetime import datetime


class Settings:
    """配置管理类（单例模式）
    
    负责加载和管理应用配置，支持默认值和配置文件覆盖。
    
    属性:
        _instance: 单例实例
        _config: 配置字典
        _config_file: 配置文件路径
    """
    
    _instance = None
    
    # 默认配置
    DEFAULT_CONFIG = {
        'app': {
            'name': 'Task Manager',
            'version': '1.0.0',
            'debug': False
        },
        'storage': {
            'data_dir': 'data',
            'data_file': 'tasks.json',
            'backup_enabled': True,
            'backup_max_count': 5
        },
        'logging': {
            'log_dir': 'logs',
            'level': 'INFO',
            'console_output': True,
            'file_output': True
        },
        'display': {
            'date_format': '%Y-%m-%d',
            'time_format': '%H:%M:%S',
            'datetime_format': '%Y-%m-%d %H:%M:%S',
            'max_items_per_page': 20
        }
    }
    
    def __new__(cls, config_file=None):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, config_file=None):
        if self._initialized:
            return
        
        self._config = self.DEFAULT_CONFIG.copy()
        self._config_file = config_file or 'config/app_config.json'
        self._load_config()
        self._initialized = True
    
    def _load_config(self):
        """从文件加载配置"""
        if os.path.exists(self._config_file):
            try:
                with open(self._config_file, 'r', encoding='utf-8') as f:
                    file_config = json.load(f)
                self._merge_config(self._config, file_config)
            except json.JSONDecodeError as e:
                print(f"警告: 配置文件格式错误: {e}")
            except IOError as e:
                print(f"警告: 无法读取配置文件: {e}")
    
    def _merge_config(self, base, override):
        """递归合并配置"""
        for key, value in override.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._merge_config(base[key], value)
            else:
                base[key] = value
    
    def get(self, key, default=None):
        """获取配置值
        
        支持点号分隔的键，如 'app.name'
        
        参数:
            key: 配置键
            default: 默认值
            
        返回:
            Any: 配置值
        """
        keys = key.split('.')
        value = self._config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
                if value is None:
                    return default
            else:
                return default
        return value
    
    def set(self, key, value):
        """设置配置值
        
        参数:
            key: 配置键（支持点号分隔）
            value: 配置值
        """
        keys = key.split('.')
        config = self._config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value
    
    def save(self, file_path=None):
        """保存配置到文件"""
        file_path = file_path or self._config_file
        directory = os.path.dirname(file_path)
        if directory:
            os.makedirs(directory, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(self._config, f, ensure_ascii=False, indent=2)
    
    def get_all(self):
        """获取所有配置"""
        return self._config.copy()
    
    @property
    def data_dir(self):
        return self.get('storage.data_dir', 'data')
    
    @property
    def data_file(self):
        return os.path.join(self.data_dir, self.get('storage.data_file', 'tasks.json'))
    
    @property
    def log_dir(self):
        return self.get('logging.log_dir', 'logs')
    
    @property
    def log_level(self):
        return self.get('logging.level', 'INFO')
```

### 2.7 工具函数模块（tools.py）

```python
# 文件：tools.py
"""
工具函数模块

此模块提供了任务管理器使用的各种工具函数，
包括日期格式化、表格显示、输入验证等功能。
"""

from datetime import datetime
import os
import sys


def format_datetime(dt, fmt='%Y-%m-%d %H:%M:%S'):
    """格式化日期时间
    
    参数:
        dt: datetime对象
        fmt: 格式字符串
        
    返回:
        str: 格式化后的字符串
    """
    if dt is None:
        return "未设置"
    if isinstance(dt, str):
        try:
            dt = datetime.fromisoformat(dt)
        except ValueError:
            return dt
    return dt.strftime(fmt)


def format_date(dt):
    """格式化日期（只显示日期部分）"""
    return format_datetime(dt, '%Y-%m-%d')


def print_table(headers, rows, col_widths=None):
    """打印格式化表格
    
    参数:
        headers: 表头列表
        rows: 数据行列表（每行是一个列表）
        col_widths: 列宽列表（可选）
    """
    if not rows:
        print("  (无数据)")
        return
    
    # 计算列宽
    if col_widths is None:
        col_widths = []
        for i, header in enumerate(headers):
            max_width = len(header)
            for row in rows:
                if i < len(row):
                    max_width = max(max_width, len(str(row[i])))
            col_widths.append(max_width + 2)
    
    # 打印分隔线
    separator = '+' + '+'.join('-' * w for w in col_widths) + '+'
    
    # 打印表头
    print(separator)
    header_row = '|'
    for i, header in enumerate(headers):
        header_row += f" {header:<{col_widths[i]-1}}|"
    print(header_row)
    print(separator)
    
    # 打印数据行
    for row in rows:
        data_row = '|'
        for i, cell in enumerate(row):
            cell_str = str(cell) if cell is not None else ""
            data_row += f" {cell_str:<{col_widths[i]-1}}|"
        print(data_row)
    
    print(separator)


def print_task_table(tasks):
    """打印任务表格
    
    参数:
        tasks: 任务对象列表
    """
    if not tasks:
        print("  没有任务")
        return
    
    headers = ['ID', '标题', '状态', '优先级', '截止日期', '标签']
    col_widths = [10, 30, 10, 8, 12, 15]
    
    rows = []
    for task in tasks:
        task_id = task.id[:8] if hasattr(task, 'id') else str(task.get('id', ''))[:8]
        title = task.title if hasattr(task, 'title') else task.get('title', '')
        status = task.status.label() if hasattr(task, 'status') else task.get('status_label', '')
        priority = task.priority.label() if hasattr(task, 'priority') else task.get('priority_label', '')
        due_date = format_date(task.due_date) if hasattr(task, 'due_date') else format_date(task.get('due_date'))
        tags = ', '.join(task.tags[:3]) if hasattr(task, 'tags') else ', '.join((task.get('tags') or [])[:3])
        
        rows.append([task_id, title, status, priority, due_date, tags])
    
    print_table(headers, rows, col_widths)


def clear_screen():
    """清屏"""
    os.system('cls' if sys.platform == 'win32' else 'clear')


def confirm_action(prompt="确认执行此操作? (y/n): "):
    """确认操作
    
    参数:
        prompt: 提示信息
        
    返回:
        bool: 用户是否确认
    """
    response = input(prompt).strip().lower()
    return response in ('y', 'yes', '是')


def parse_date(date_str):
    """解析日期字符串
    
    支持多种日期格式:
    - YYYY-MM-DD
    - YYYY/MM/DD
    - YYYY年MM月DD日
    
    参数:
        date_str: 日期字符串
        
    返回:
        datetime: 解析后的日期对象，失败返回None
    """
    if not date_str:
        return None
    
    formats = [
        '%Y-%m-%d',
        '%Y/%m/%d',
        '%Y年%m月%d日',
        '%Y-%m-%d %H:%M:%S',
        '%Y/%m/%d %H:%M:%S',
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    return None


def truncate_text(text, max_length=50):
    """截断文本
    
    参数:
        text: 原始文本
        max_length: 最大长度
        
    返回:
        str: 截断后的文本
    """
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + '...'
```

### 2.8 主程序入口（main.py）

```python
# 文件：main.py
"""
任务管理器 - 主程序入口

这是一个命令行任务管理工具，支持任务的创建、查询、更新和删除。
可以作为模块导入，也可以作为命令行工具直接运行。

使用方式:
    python main.py [命令] [参数]

命令:
    list        列出所有任务
    add         创建新任务
    show        显示任务详情
    update      更新任务
    delete      删除任务
    done        标记任务完成
    search      搜索任务
    stats       显示统计信息
    help        显示帮助信息
"""

import sys
import os
import argparse
from datetime import datetime

# 确保项目根目录在路径中
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 导入项目模块
from models.task import Task, TaskPriority, TaskStatus, TaskSortBy
from core.task_storage import TaskStorage
from core.task_manager import TaskManager
from exceptions.errors import (
    TaskManagerError, TaskNotFoundError, TaskValidationError,
    TaskDuplicateError, StorageError
)
from utils.logger import setup_logger
from utils.validators import TaskValidator
from settings import Settings
from tools import (
    print_task_table, format_datetime, format_date,
    confirm_action, parse_date, clear_screen
)


class TaskManagerCLI:
    """任务管理器命令行界面"""
    
    def __init__(self):
        """初始化CLI"""
        # 加载配置
        self.settings = Settings()
        
        # 设置日志
        self.logger = setup_logger(
            'task_manager',
            log_dir=self.settings.log_dir,
            level=getattr(__import__('logging'), self.settings.log_level)
        )
        
        # 初始化存储和管理器
        self.storage = TaskStorage(self.settings.data_file)
        self.manager = TaskManager(self.storage, self.logger)
        
        self.logger.info("任务管理器启动")
    
    def run(self):
        """运行命令行界面"""
        parser = self._create_parser()
        
        if len(sys.argv) == 1:
            # 没有参数，进入交互模式
            self._interactive_mode()
        else:
            # 解析命令行参数
            args = parser.parse_args()
            self._handle_command(args)
    
    def _create_parser(self):
        """创建命令行参数解析器"""
        parser = argparse.ArgumentParser(
            description='任务管理器 - 命令行任务管理工具',
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
使用示例:
  python main.py list                    列出所有任务
  python main.py add "完成报告" -d "编写季度报告" -p high
  python main.py show <task_id>          查看任务详情
  python main.py update <task_id> -s done 更新任务状态
  python main.py delete <task_id>        删除任务
  python main.py search "报告"           搜索任务
  python main.py stats                   显示统计信息
            """
        )
        
        subparsers = parser.add_subparsers(dest='command', help='可用命令')
        
        # list 命令
        list_parser = subparsers.add_parser('list', help='列出所有任务')
        list_parser.add_argument('-s', '--status', help='按状态筛选')
        list_parser.add_argument('-p', '--priority', help='按优先级筛选')
        list_parser.add_argument('--sort', choices=['created', 'priority', 'due', 'title'],
                                default='created', help='排序方式')
        
        # add 命令
        add_parser = subparsers.add_parser('add', help='创建新任务')
        add_parser.add_argument('title', help='任务标题')
        add_parser.add_argument('-d', '--description', default='', help='任务描述')
        add_parser.add_argument('-p', '--priority', choices=['low', 'medium', 'high', 'urgent'],
                               default='medium', help='优先级')
        add_parser.add_argument('--due', help='截止日期 (YYYY-MM-DD)')
        add_parser.add_argument('-t', '--tags', nargs='*', help='标签')
        
        # show 命令
        show_parser = subparsers.add_parser('show', help='显示任务详情')
        show_parser.add_argument('task_id', help='任务ID')
        
        # update 命令
        update_parser = subparsers.add_parser('update', help='更新任务')
        update_parser.add_argument('task_id', help='任务ID')
        update_parser.add_argument('-t', '--title', help='新标题')
        update_parser.add_argument('-d', '--description', help='新描述')
        update_parser.add_argument('-p', '--priority', 
                                   choices=['low', 'medium', 'high', 'urgent'],
                                   help='新优先级')
        update_parser.add_argument('-s', '--status',
                                   choices=['todo', 'in_progress', 'done', 'cancelled'],
                                   help='新状态')
        update_parser.add_argument('--due', help='新截止日期')
        
        # delete 命令
        delete_parser = subparsers.add_parser('delete', help='删除任务')
        delete_parser.add_argument('task_id', help='任务ID')
        delete_parser.add_argument('-f', '--force', action='store_true', help='强制删除')
        
        # done 命令
        done_parser = subparsers.add_parser('done', help='标记任务完成')
        done_parser.add_argument('task_id', help='任务ID')
        
        # search 命令
        search_parser = subparsers.add_parser('search', help='搜索任务')
        search_parser.add_argument('keyword', help='搜索关键词')
        
        # stats 命令
        subparsers.add_parser('stats', help='显示统计信息')
        
        return parser
    
    def _handle_command(self, args):
        """处理命令行命令"""
        command_handlers = {
            'list': self._cmd_list,
            'add': self._cmd_add,
            'show': self._cmd_show,
            'update': self._cmd_update,
            'delete': self._cmd_delete,
            'done': self._cmd_done,
            'search': self._cmd_search,
            'stats': self._cmd_stats,
        }
        
        handler = command_handlers.get(args.command)
        if handler:
            try:
                handler(args)
            except TaskManagerError as e:
                print(f"错误: {e}")
                self.logger.error(f"命令执行失败: {e}")
            except Exception as e:
                print(f"未知错误: {e}")
                self.logger.exception("未知错误")
        else:
            print("请使用有效的命令，使用 --help 查看帮助")
    
    def _cmd_list(self, args):
        """列出任务"""
        tasks = self.manager.get_all_tasks()
        
        # 按状态筛选
        if args.status:
            tasks = self.manager.get_tasks_by_status(args.status)
        
        # 按优先级筛选
        if args.priority:
            tasks = [t for t in tasks if t.priority == TaskPriority.from_string(args.priority)]
        
        # 排序
        if args.sort == 'priority':
            tasks.sort(key=lambda t: t.priority.value, reverse=True)
        elif args.sort == 'due':
            tasks.sort(key=lambda t: t.due_date or datetime.max)
        elif args.sort == 'title':
            tasks.sort(key=lambda t: t.title)
        else:
            tasks.sort(key=lambda t: t.created_at, reverse=True)
        
        print(f"\n任务列表 (共 {len(tasks)} 个):")
        print_task_table(tasks)
    
    def _cmd_add(self, args):
        """创建任务"""
        due_date = parse_date(args.due) if args.due else None
        
        task = self.manager.create_task(
            title=args.title,
            description=args.description,
            priority=args.priority,
            due_date=due_date,
            tags=args.tags
        )
        
        print(f"任务创建成功!")
        self._display_task(task)
    
    def _cmd_show(self, args):
        """显示任务详情"""
        task = self.manager.get_task(args.task_id)
        self._display_task(task)
    
    def _cmd_update(self, args):
        """更新任务"""
        kwargs = {}
        if args.title:
            kwargs['title'] = args.title
        if args.description:
            kwargs['description'] = args.description
        if args.priority:
            kwargs['priority'] = args.priority
        if args.status:
            kwargs['status'] = args.status
        if args.due:
            kwargs['due_date'] = parse_date(args.due)
        
        if not kwargs:
            print("请指定要更新的字段")
            return
        
        task = self.manager.update_task(args.task_id, **kwargs)
        print(f"任务更新成功!")
        self._display_task(task)
    
    def _cmd_delete(self, args):
        """删除任务"""
        if not args.force:
            if not confirm_action(f"确认删除任务 {args.task_id}? (y/n): "):
                print("操作已取消")
                return
        
        self.manager.delete_task(args.task_id)
        print(f"任务 {args.task_id} 已删除")
    
    def _cmd_done(self, args):
        """标记任务完成"""
        task = self.manager.mark_task_done(args.task_id)
        print(f"任务已完成!")
        self._display_task(task)
    
    def _cmd_search(self, args):
        """搜索任务"""
        results = self.manager.search_tasks(args.keyword)
        print(f"\n搜索 '{args.keyword}' 的结果 (共 {len(results)} 个):")
        print_task_table(results)
    
    def _cmd_stats(self, args):
        """显示统计信息"""
        stats = self.manager.get_statistics()
        
        print("\n" + "=" * 40)
        print("任务统计")
        print("=" * 40)
        print(f"总任务数:     {stats['total']}")
        print(f"待办:         {stats['todo']}")
        print(f"进行中:       {stats['in_progress']}")
        print(f"已完成:       {stats['done']}")
        print(f"已取消:       {stats['cancelled']}")
        print(f"已过期:       {stats['overdue']}")
        print("-" * 40)
        print("按优先级分布:")
        for priority, count in stats['by_priority'].items():
            bar = '█' * count
            print(f"  {priority:8s}: {count:3d} {bar}")
        print("=" * 40)
    
    def _display_task(self, task):
        """显示任务详情"""
        print("\n" + "=" * 50)
        print(f"任务详情")
        print("=" * 50)
        print(f"ID:       {task.id}")
        print(f"标题:     {task.title}")
        print(f"描述:     {task.description or '(无)'}")
        print(f"状态:     {task.status.label()}")
        print(f"优先级:   {task.priority.label()}")
        print(f"创建时间: {format_datetime(task.created_at)}")
        print(f"更新时间: {format_datetime(task.updated_at)}")
        print(f"截止日期: {format_date(task.due_date)}")
        print(f"标签:     {', '.join(task.tags) if task.tags else '(无)'}")
        if task.is_overdue():
            print("  [警告] 此任务已过期!")
        print("=" * 50)
    
    def _interactive_mode(self):
        """交互模式"""
        clear_screen()
        print("=" * 50)
        print("欢迎使用任务管理器")
        print("=" * 50)
        
        while True:
            print("\n可用命令: list, add, show, update, delete, done, search, stats, help, exit")
            cmd = input("\n> ").strip()
            
            if not cmd:
                continue
            
            parts = cmd.split()
            action = parts[0].lower()
            
            if action == 'exit':
                print("再见!")
                break
            elif action == 'help':
                self._show_help()
            elif action == 'list':
                tasks = self.manager.get_all_tasks()
                print_task_table(tasks)
            elif action == 'add':
                self._interactive_add()
            elif action == 'show':
                if len(parts) > 1:
                    try:
                        task = self.manager.get_task(parts[1])
                        self._display_task(task)
                    except TaskNotFoundError as e:
                        print(f"错误: {e}")
                else:
                    print("用法: show <task_id>")
            elif action == 'stats':
                self._cmd_stats(None)
            else:
                print(f"未知命令: {action}，输入 'help' 查看帮助")
        
        self.logger.info("任务管理器退出")
    
    def _interactive_add(self):
        """交互式创建任务"""
        print("\n创建新任务:")
        title = input("标题: ").strip()
        if not title:
            print("标题不能为空，操作取消")
            return
        
        description = input("描述 (可选): ").strip()
        
        print("优先级: 1=低, 2=中, 3=高, 4=紧急")
        priority_map = {'1': 'low', '2': 'medium', '3': 'high', '4': 'urgent'}
        priority_input = input("优先级 (默认2): ").strip()
        priority = priority_map.get(priority_input, 'medium')
        
        due_input = input("截止日期 YYYY-MM-DD (可选): ").strip()
        due_date = parse_date(due_input) if due_input else None
        
        tags_input = input("标签，用逗号分隔 (可选): ").strip()
        tags = [t.strip() for t in tags_input.split(',')] if tags_input else []
        
        try:
            task = self.manager.create_task(
                title=title,
                description=description,
                priority=priority,
                due_date=due_date,
                tags=tags
            )
            print(f"\n任务创建成功! ID: {task.id[:8]}...")
        except TaskManagerError as e:
            print(f"创建失败: {e}")
    
    def _show_help(self):
        """显示帮助信息"""
        print("""
任务管理器 - 帮助信息
========================

可用命令:
  list           列出所有任务
  add            创建新任务（交互式）
  show <id>      查看任务详情
  update <id>    更新任务
  delete <id>    删除任务
  done <id>      标记任务完成
  search <kw>    搜索任务
  stats          显示统计信息
  help           显示此帮助
  exit           退出程序

命令行模式:
  python main.py list
  python main.py add "标题" -d "描述" -p high
  python main.py show <id>
  python main.py update <id> -s done
  python main.py delete <id>
  python main.py search "关键词"
  python main.py stats
        """)


def main():
    """主函数"""
    try:
        cli = TaskManagerCLI()
        cli.run()
    except KeyboardInterrupt:
        print("\n\n程序被用户中断")
    except Exception as e:
        print(f"程序启动失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
```

## 三、项目配置文件

### 3.1 应用配置文件（config/app_config.json）

```json
{
    "app": {
        "name": "Task Manager",
        "version": "1.0.0",
        "debug": false
    },
    "storage": {
        "data_dir": "data",
        "data_file": "tasks.json",
        "backup_enabled": true,
        "backup_max_count": 5
    },
    "logging": {
        "log_dir": "logs",
        "level": "INFO",
        "console_output": true,
        "file_output": true
    },
    "display": {
        "date_format": "%Y-%m-%d",
        "time_format": "%H:%M:%S",
        "datetime_format": "%Y-%m-%d %H:%M:%S",
        "max_items_per_page": 20
    }
}
```

### 3.2 依赖清单（requirements.txt）

```
# 任务管理器依赖
# 本项目主要使用Python标准库，无额外依赖

# 如需运行测试
# pytest>=7.0.0
```

## 四、完整项目整合演示

下面我们在一段代码中演示整个项目的完整工作流程，展示模块之间的协作关系。

```python
# 综合演示：项目完整工作流程
print("=" * 60)
print("任务管理器 - 完整工作流程演示")
print("=" * 60)

import os
import sys
import tempfile
import json
from datetime import datetime, timedelta

# 创建临时工作目录
tmp_dir = tempfile.mkdtemp()
os.chdir(tmp_dir)

# 创建必要的目录
os.makedirs('data', exist_ok=True)
os.makedirs('logs', exist_ok=True)

# 由于我们是在单个脚本中演示，需要调整导入路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 创建模拟的模块文件以演示完整流程
# 在实际项目中，这些代码分布在不同的文件中

# 1. 创建任务模型（简化版，用于演示）
class TaskPriority:
    LOW, MEDIUM, HIGH, URGENT = 1, 2, 3, 4
    @classmethod
    def label(cls, value):
        return {1: '低', 2: '中', 3: '高', 4: '紧急'}.get(value, '未知')

class TaskStatus:
    TODO, IN_PROGRESS, DONE, CANCELLED = 'todo', 'in_progress', 'done', 'cancelled'
    @classmethod
    def label(cls, value):
        return {'todo': '待办', 'in_progress': '进行中', 'done': '已完成', 'cancelled': '已取消'}.get(value, '未知')

class Task:
    def __init__(self, title, description="", priority=TaskPriority.MEDIUM):
        import uuid
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.priority = priority
        self.status = TaskStatus.TODO
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.due_date = None
        self.tags = []
    
    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'description': self.description,
            'priority': self.priority, 'status': self.status,
            'created_at': self.created_at.isoformat(), 'updated_at': self.updated_at.isoformat(),
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'tags': self.tags
        }

# 2. 演示完整流程
print("\n步骤1: 创建任务管理器")
print("-" * 40)

# 创建存储
storage = TaskStorage(os.path.join(tmp_dir, 'data', 'tasks.json'))

# 创建任务管理器
manager = TaskManager(storage)

print("任务管理器已初始化")

# 创建任务
print("\n步骤2: 创建任务")
print("-" * 40)

tasks_data = [
    {
        'title': '完成Python模块学习',
        'description': '学习模块、包和异常处理的所有章节',
        'priority': TaskPriority.HIGH,
        'due_date': datetime.now() + timedelta(days=7),
        'tags': ['学习', 'Python']
    },
    {
        'title': '编写项目文档',
        'description': '为任务管理器项目编写完整的README文档',
        'priority': TaskPriority.MEDIUM,
        'due_date': datetime.now() + timedelta(days=14),
        'tags': ['文档', '项目']
    },
    {
        'title': '代码审查',
        'description': '对项目代码进行全面的审查和优化',
        'priority': TaskPriority.HIGH,
        'due_date': datetime.now() + timedelta(days=3),
        'tags': ['代码', '审查']
    },
    {
        'title': '准备演示材料',
        'description': '准备项目演示的PPT和示例代码',
        'priority': TaskPriority.LOW,
        'due_date': datetime.now() + timedelta(days=21),
        'tags': ['演示', 'PPT']
    },
    {
        'title': '修复紧急Bug',
        'description': '修复用户反馈的登录页面崩溃问题',
        'priority': TaskPriority.URGENT,
        'due_date': datetime.now() + timedelta(days=1),
        'tags': ['Bug', '紧急']
    }
]

created_tasks = []
for data in tasks_data:
    try:
        task = manager.create_task(**data)
        created_tasks.append(task)
        print(f"  创建任务: {task.title} (ID: {task.id[:8]}...)")
    except Exception as e:
        print(f"  创建失败: {e}")

# 任务操作
print("\n步骤3: 任务操作")
print("-" * 40)

# 更新任务状态
if created_tasks:
    task = created_tasks[0]
    manager.mark_task_done(task.id)
    print(f"  完成任务: {task.title}")

if len(created_tasks) > 2:
    task = created_tasks[2]
    manager.update_task(task.id, status=TaskStatus.IN_PROGRESS)
    print(f"  更新任务状态: {task.title} -> 进行中")

# 查询任务
print("\n步骤4: 查询任务")
print("-" * 40)

# 按优先级查询
high_priority = manager.get_tasks_by_priority(TaskPriority.HIGH)
print(f"  高优先级任务: {len(high_priority)} 个")
for t in high_priority:
    print(f"    - {t.title}")

# 搜索任务
results = manager.search_tasks("Python")
print(f"\n  搜索 'Python' 的结果: {len(results)} 个")
for t in results:
    print(f"    - {t.title}")

# 统计信息
print("\n步骤5: 统计信息")
print("-" * 40)

stats = manager.get_statistics()
print(f"  总任务数: {stats['total']}")
print(f"  待办: {stats['todo']}")
print(f"  进行中: {stats['in_progress']}")
print(f"  已完成: {stats['done']}")
print(f"  已取消: {stats['cancelled']}")
print(f"  已过期: {stats['overdue']}")

# 任务列表
print("\n步骤6: 完整任务列表")
print("-" * 40)

all_tasks = manager.get_all_tasks()
for i, task in enumerate(all_tasks, 1):
    status_icon = {
        'todo': '[ ]', 'in_progress': '[>]', 'done': '[X]', 'cancelled': '[-]'
    }.get(task.status, '[?]')
    priority_label = {1: '低', 2: '中', 3: '高', 4: '紧急'}.get(task.priority, '?')
    print(f"  {i}. {status_icon} {task.title} ({priority_label}) - {TaskStatus.label(task.status)}")

# 验证数据持久化
print("\n步骤7: 验证数据持久化")
print("-" * 40)

data_file = os.path.join(tmp_dir, 'data', 'tasks.json')
if os.path.exists(data_file):
    with open(data_file, 'r', encoding='utf-8') as f:
        saved_data = json.load(f)
    print(f"  数据文件: {data_file}")
    print(f"  文件大小: {os.path.getsize(data_file)} 字节")
    print(f"  保存的任务数: {saved_data.get('metadata', {}).get('task_count', len(saved_data.get('tasks', {})))}")
    print(f"  数据已成功持久化到JSON文件!")

# 清理
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import shutil
shutil.rmtree(tmp_dir)

print("\n" + "=" * 60)
print("项目演示完成!")
print("=" * 60)
print("""
项目特点总结:
1. 模块化设计: 代码按功能拆分为多个模块
2. 异常处理体系: 层次化的自定义异常类
3. 日志系统: 完整的日志记录和轮转
4. 配置管理: 灵活的配置文件管理
5. 数据持久化: JSON文件存储
6. 命令行界面: 支持交互式和命令行两种模式
7. 可扩展性: 易于添加新功能和模块
""")
```

## 五、项目总结与最佳实践

### 5.1 项目架构回顾

通过这个综合实战项目，我们展示了如何将Python模块化编程、异常处理、日志记录等知识应用到实际开发中。以下是项目的主要架构特点：

**分层架构**：项目采用了清晰的分层设计，将数据模型、业务逻辑、存储层和用户界面分离，各层之间通过明确的接口通信。

**模块化设计**：代码按功能拆分为多个模块，每个模块职责单一，便于维护和扩展。

**异常处理体系**：通过自定义异常类建立了层次化的异常处理体系，使得错误处理更加精确和语义化。

**日志系统**：使用`logging`模块搭建了完整的日志系统，支持多级别日志、控制台和文件输出、日志轮转。

**配置管理**：通过`Settings`类实现了灵活的配置管理，支持默认值和配置文件覆盖。

### 5.2 工程化开发最佳实践

从这个项目中，我们可以总结出以下工程化开发的最佳实践：

**项目结构规范**：遵循标准的项目目录结构，将代码、配置、测试、文档等分离。一个清晰的项目结构是团队协作的基础。

**单一职责原则**：每个模块、每个类、每个函数都应该只有一个明确的职责。例如，`Task`类只负责任务数据模型，`TaskManager`类只负责业务逻辑，`TaskStorage`类只负责数据持久化。

**依赖注入**：通过构造函数注入依赖（如`TaskManager`接受`TaskStorage`作为参数），而不是在类内部创建依赖，提高了代码的可测试性和灵活性。

**异常处理**：不要忽略异常，在适当的层级捕获和处理异常。使用自定义异常类来表达业务逻辑中的错误情况。使用`finally`确保资源被正确释放。

**日志记录**：在关键操作点记录日志，包括正常操作和异常情况。使用不同的日志级别来区分信息的重要程度。

**配置外部化**：将配置从代码中分离出来，使用配置文件管理。这样可以在不修改代码的情况下改变应用的行为。

**防御性编程**：在函数入口处验证参数，在关键操作前检查前置条件。使用`assert`进行内部不变量检查，使用`raise`处理外部输入错误。

**可测试性**：编写可测试的代码，使每个模块都可以独立测试。使用依赖注入和接口抽象来方便测试。

通过本章的学习，你应该已经掌握了如何将Python模块化编程和异常处理的知识应用到实际项目中。这些技能将帮助你构建更加健壮、可维护和可扩展的Python应用程序。
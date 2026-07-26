---
title: Web 基础知识
date: 2026-06-30
tags:
  - HTTP协议基础
  - webshell
  - 蚁剑
  - 冰蝎
  - 哥斯拉
  - BurpSuite
  - HackBar
  - Sqlmap
categories:
  - Web安全
---

# HTTP协议基础

## HTTP请求（Request）—— 你发给服务器的"指令"

### 一个标准的HTTP请求由三部分组成：请求行、请求头、请求体。在Burp Suite中抓包，你看到的就是它们
\```
POST /login.php HTTP/1.1          <-- 请求行
Host: www.example.com             <-- 请求头（Headers）开始
User-Agent: Mozilla/5.0 ...
Cookie: PHPSESSID=abc123
Content-Type: application/x-www-form-urlencoded
Content-Length: 20                <-- 请求头结束（空行）

username=admin&password=123456    <-- 请求体（Body）
\```
## CTF中必须掌握的三大要素

### 请求方法（Method）：最常见的是 GET（获取数据，参数暴露在URL中）和 POST（提交数据，参数在Body里）。CTF常考：

#### HEAD：只获取响应头，有时用于绕过只允许GET的限制。

#### PUT/DELETE：如果服务器配置不当开启这些方法，可能造成任意文件上传或删除。

#### 伪造方法：有些题目用 GET 校验权限，但代码逻辑里却处理了 POST 的数据，这时需要灵活切换。


## 请求头（Headers）——兵家必争之地：

### Referer：告诉服务器“我从哪个页面点过来的”。题目要求从特定网站访问时，需要改成目标域名。

### X-Forwarded-For / Client-IP：伪造客户端真实IP。后端如果通过这个取IP做白名单，直接改成 127.0.0.1 就能绕过。

### User-Agent：标识客户端浏览器。常用于绕过手机端或特定浏览器（如“请使用IE浏览器”）的限制。

## 请求体（Body）：POST请求携带的参数。CTF中注意 Content-Type：

### application/x-www-form-urlencoded（普通键值对）。

### multipart/form-data（文件上传时必用，边界Boundary不能写错）。

### application/json（JSON格式，如果后端用 $_POST 取不到值，可能需要改用 php://input 取，这常是考点）。

## HTTP响应（Response）—— 服务器给你的“回信”

### 服务器处理完后，会返回状态行、响应头和响应体
\```
HTTP/1.1 200 OK                 <-- 状态行
Server: nginx
Set-Cookie: session=xyz         <-- 响应头
Content-Type: text/html

<html>... 页面内容 ...</html>   <-- 响应体

\```

### 必背状态码（Status Codes）
\```
状态码	含义	CTF应用场景
200 OK	请求成功	正常返回页面或数据。
302 Found	临时重定向	访问某页面被跳转，一定要看Location头，有时Flag就藏在跳转前的响应包里（重定向前抓包）。
403 Forbidden	无权限访问	目录扫描时常见，说明目录存在但禁止访问。
404 Not Found	未找到	资源不存在。
500 Internal Error	服务器内部错误	注入或代码执行报错时出现，可利用报错信息进行报错注入。
### XSS（跨站脚本攻击）

跨站脚本攻击允许攻击者在网页中注入恶意脚本，当用户访问该页面时，脚本会在用户浏览器中执行。

**类型：**
- 存储型 XSS：恶意代码存储在服务器端数据库中
- 反射型 XSS：恶意代码通过 URL 参数传递
- DOM 型 XSS：恶意代码在客户端 DOM 中执行

### SQL 注入

SQL 注入攻击利用应用程序对用户输入的不当处理，将恶意 SQL 语句注入到数据库查询中。

**危害：**
- 数据泄露
- 数据篡改
- 数据库被删除

### CSRF（跨站请求伪造）

CSRF 攻击诱导用户在已登录的情况下执行非预期的操作。

### 文件上传漏洞

攻击者通过上传恶意文件（如 WebShell）来获取服务器控制权。

## 学习路径

1. **基础阶段**：HTML、CSS、JavaScript、HTTP 协议
2. **中级阶段**：常见漏洞原理、工具使用（Burp Suite、SQLMap）
3. **高级阶段**：代码审计、漏洞挖掘、安全开发

## 常用工具

- **Burp Suite**：Web 应用安全测试工具
- **SQLMap**：自动化 SQL 注入工具
- **OWASP ZAP**：开源 Web 安全扫描器
- **Chrome DevTools**：浏览器调试工具

## 实战建议

- 多做 CTF 题目，积累实战经验
- 关注安全社区，了解最新漏洞动态
- 学习安全编码规范，从源头预防漏洞

---

> Web 安全是一场持久战，保持好奇心，持续学习。
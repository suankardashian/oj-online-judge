# OJ在线判题平台

一个基于Node.js和MySQL的在线判题平台，支持题目浏览、代码提交和评测功能。

## 技术栈

### 前端
- HTML5/CSS3
- JavaScript (ES6+)
- MDB UI Kit
- Font Awesome
- Axios

### 后端
- Node.js
- Express.js
- Sequelize
- MySQL

## 功能特点

- 题目列表展示与筛选
- 题目详情查看
- 代码提交与评测
- 用户认证系统
- 答题记录统计

## 本地运行

### 环境要求
- Node.js 14+
- MySQL 5.7+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/suankardashian/oj-online-judge.git
cd oj-online-judge
```

2. 安装依赖
```bash
npm install
```

3. 配置数据库
- 创建MySQL数据库
- 修改`config/db.js`中的数据库连接参数

4. 初始化数据库
```bash
node config/init-db.js
```

5. 启动服务器
```bash
npm start
```

6. 访问项目
```
前端页面：http://localhost:3000/html/ProblemList.html
后端API：http://localhost:3000/api/problems
```

## 部署到GitHub Pages（仅前端）

GitHub Pages只能托管静态前端文件，后端需要部署到其他服务器。

### 1. 配置GitHub Pages

1. 登录GitHub，进入仓库页面
2. 点击"Settings" -> "Pages"
3. 在"Source"下选择分支（如`master`）和目录（如`html/`）
4. 点击"Save"，GitHub Pages会自动构建

### 2. 修改前端API地址

在前端JavaScript文件中（如`js/Problems.js`），将API地址从本地地址改为部署后的后端地址：

```javascript
// 原来的本地API地址
fetch(`http://localhost:3000/api/problems?${params.toString()}`)

// 改为部署后的后端地址
fetch(`https://your-backend-api.com/api/problems?${params.toString()}`)
```

### 3. 后端部署建议

后端可以部署到以下平台：
- Heroku
- Vercel
- AWS EC2
- 腾讯云
- 阿里云

## 项目结构

```
oj-online-judge/
├── config/           # 配置文件
├── css/              # 样式文件
├── html/             # 前端页面
├── img/              # 图片资源
├── js/               # JavaScript脚本
├── models/           # 数据库模型
├── routes/           # API路由
├── server.js         # 后端入口文件
├── package.json      # 项目依赖配置
└── .gitignore        # Git忽略文件
```

## 许可证

MIT
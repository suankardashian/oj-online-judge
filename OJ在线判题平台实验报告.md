# 在线判题平台实验报告

## 摘要

本项目是一个基于Node.js和MySQL开发的在线判题平台（OJ，Online Judge），旨在为程序员提供在线编程练习和竞赛的解决方案。该平台实现了用户注册/登录、题目浏览、代码提交、在线判题、排行榜等核心功能。项目采用前后端分离的架构，前端使用HTML、CSS、JavaScript和Axios库进行开发，后端基于Express.js框架和Sequelize ORM，同时使用MySQL作为数据库存储系统。本报告详细描述了项目的整体设计思路、技术实现细节、关键功能模块及其实现原理，并分析了项目中使用的核心技术和开发规范。

## 1. 项目概述

### 1.1 项目背景与意义

随着编程教育和在线教育的兴起，在线判题平台成为程序员学习和练习编程技能的重要工具。这些平台不仅可以帮助学习者检验代码的正确性，还能提供即时的反馈，提高学习效率。传统的OJ平台通常采用C/C++/Java等静态类型语言作为主要支持语言，而本项目采用了现代Web技术栈，使得系统更加轻量、快速且易于维护。

### 1.2 项目功能需求

本在线判题平台主要包含以下功能：

1. **用户管理**：用户注册、登录、个人信息管理
2. **题目管理**：题目的分类展示、难度筛选、详情查看
3. **代码提交**：支持多种编程语言的代码提交界面
4. **在线判题**：对提交的代码进行在线评测
5. **竞赛功能**：组织在线编程竞赛（框架已实现）
6. **排行榜**：根据解题数和得分进行排名
7. **结果查看**：查看详细的代码执行结果和错误信息

### 1.3 项目创新点

1. 采用现代Web技术栈开发，提高开发效率和可维护性
2. 使用JWT（JSON Web Token）进行无状态身份认证
3. 采用Sequelize ORM简化数据库操作和模型管理
4. 前后端分离的架构设计，增强系统的可扩展性
5. 模块化的路由和模型设计，提高代码复用性

## 2. 技术栈

### 2.1 前端技术

#### 2.1.1 HTML5

项目采用HTML5作为页面结构的基础，使用语义化标签提高页面可读性和SEO效果。

```html
<section class="vh-100">
    <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <!-- 内容 -->
        </div>
    </div>
</section>
```

1. [ ] 2.1.2 CSS3与Bootstrap

项目使用CSS3进行样式定制，结合Bootstrap 5.2.0版本提供的UI组件库，提供了美观的用户界面。

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5;
}

.oj-navbar {
    background-color: #343a40;
}
```

#### 2.1.3 JavaScript (ES6+)

项目使用现代JavaScript（ES6+）语法，包括箭头函数、模板字符串、解构赋值等特性，简化代码编写。

```javascript
document.querySelector(".btn-lg").addEventListener('click',()=>{
    const username = document.querySelector('#form3Example3').value
    const password = document.querySelector('#form3Example4').value
  
    if (password.length < 8){
        alert('密码必须大于8位')
        return
    }
  
    console.log('提交数据到服务器')
    console.log('username:', username);
    console.log('password:', password);

    axios({
        url:'http://localhost:3000/api/auth/login',
        method: 'POST',
        data: {
            username:username,
            password:password
        }
    }).then(result=>{
        console.log(result)
        console.log(result.data.message)
      
        if (result.data.token) {
            // 保存token到localStorage
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('username', result.data.user.username);
            localStorage.setItem('email', result.data.user.email);
            localStorage.setItem('userId', result.data.user.id);
          
            // 跳转到题目列表页面
            window.location.href = 'ProblemList.html';
        }
    }).catch(error => {
        console.error('登录失败:', error);
        console.error('错误响应:', error.response);
        const errorMessage = error.response?.data?.message || '登录失败，请检查用户名和密码';
        alert(errorMessage);
    })
})
```

#### 2.1.4 Axios

项目使用Axios库进行HTTP请求，实现与后端API的数据交互。Axios提供了更好的错误处理和请求拦截功能。

```javascript
axios({
    url:'http://localhost:3000/api/auth/login',
    method: 'POST',
    data: {
        username:username,
        password:password
    }
}).then(result=>{
    // 处理成功响应
}).catch(error => {
    // 处理错误响应
})
```

### 2.2 后端技术

#### 2.2.1 Node.js与Express.js

项目基于Node.js环境，使用Express.js作为Web应用框架。Express.js提供了路由、中间件、模板引擎等功能，简化了Web应用的开发。

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// 导入数据库配置
const sequelize = require('./config/db');

// 导入模型
const User = require('./models/User');
const Problem = require('./models/Problem');
const Submission = require('./models/Submission');
const Contest = require('./models/Contest');
const TestCaseResult = require('./models/TestCaseResult');

// 导入路由
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const contestRoutes = require('./routes/contests');

// 定义表关联
User.hasMany(Submission, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Problem.hasMany(Submission, {
    foreignKey: 'problem_id',
    onDelete: 'CASCADE'
});

Submission.hasMany(TestCaseResult, {
    foreignKey: 'submission_id',
    onDelete: 'CASCADE'
});

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/contests', contestRoutes);

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Index.html'));
});

// 处理HTML页面请求
app.get('*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', req.path));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

#### 2.2.2 Sequelize ORM

项目使用Sequelize作为ORM（对象关系映射）工具，简化数据库操作。Sequelize提供了模型定义、关联关系、查询构造器等功能。

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'https://mdbcdn.b-cdn.net/img/new/avatars/1.webp'
    },
    submission_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    register_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        // 在保存用户之前哈希密码
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password && user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// 添加密码验证方法
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
```

#### 2.2.3 JWT认证

项目使用JSON Web Token（JWT）实现无状态身份认证，避免了传统的会话管理开销。

```javascript
const jwt = require('jsonwebtoken');

// 登录路由
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
      
        // 查找用户
        const user = await User.findOne({
            where: { username }
        });
      
        if (!user) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }
      
        // 验证密码
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }
      
        // 生成token
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1d' });
      
        res.status(200).json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

#### 2.2.4 bcrypt密码哈希

项目使用bcrypt库对用户密码进行哈希处理，提高安全性。

```javascript
const bcrypt = require('bcrypt');

// 密码哈希
beforeCreate: async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
},

// 密码验证
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

### 2.3 数据库技术

#### 2.3.1 MySQL

项目使用MySQL作为主数据库，存储用户信息、题目数据、提交记录等。MySQL是一个高性能的关系型数据库管理系统，支持事务处理和行级锁定。

#### 2.3.2 数据库表结构设计

1. **用户表（users）**：存储用户基本信息

   - id：UUID主键
   - username：用户名（唯一）
   - email：邮箱（唯一）
   - password：密码（哈希）
   - avatar：头像URL
   - submission_count：提交次数
   - register_time：注册时间
2. **题目表（problems）**：存储编程题目信息

   - id：整数主键（自增）
   - title：题目标题
   - description：题目描述
   - difficulty：难度（枚举：easy/medium/hard）
   - pass_rate：通过率
   - category：分类
   - solved_count：解决数
   - attempt_count：尝试数
   - created_at：创建时间
3. **提交表（submissions）**：存储用户提交的代码

   - id：UUID主键
   - user_id：用户ID（外键）
   - problem_id：题目ID（外键）
   - code：代码内容
   - language：编程语言（枚举：javascript/python/java/cpp）
   - result：提交结果（枚举：Pending/Accepted/Wrong Answer等）
   - score：得分
   - execution_time：执行时间
   - memory_usage：内存使用
   - submission_time：提交时间
4. **竞赛表（contests）**：存储竞赛信息

   - id：UUID主键
   - title：竞赛标题
   - description：竞赛描述
   - start_time：开始时间
   - end_time：结束时间
   - status：状态（枚举：ongoing/upcoming/ended）
   - created_at：创建时间
5. **测试用例结果表（test_case_results）**：存储代码测试结果

   - id：UUID主键
   - submission_id：提交ID（外键）
   - passed：是否通过（布尔）
   - expected：期望输出
   - actual：实际输出
   - test_case_order：测试用例顺序

## 3. 项目架构设计

### 3.1 整体架构

项目采用前后端分离的架构模式，主要分为以下几层：

1. **表示层（Presentation Layer）**：前端HTML/CSS/JavaScript，负责用户界面展示和交互
2. **业务逻辑层（Business Logic Layer）**：后端Express.js路由和控制器，处理业务逻辑
3. **数据访问层（Data Access Layer）**：Sequelize ORM，封装数据库操作
4. **数据存储层（Data Storage Layer）**：MySQL数据库

### 3.2 前后端交互流程

1. 用户通过前端页面发起HTTP请求
2. 前端使用Axios发送请求到后端API
3. Express.js路由接收请求，转发给对应的控制器
4. 控制器调用模型层方法处理业务逻辑
5. Sequelize ORM执行数据库操作
6. 数据库返回操作结果给ORM
7. ORM将结果传递给控制器
8. 控制器将处理结果封装成响应返回给前端
9. 前端接收响应，更新页面显示

### 3.3 数据库连接配置

项目在 `config/db.js`文件中配置数据库连接信息：

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '0054', // 用户提供的MySQL密码
  database: 'oj_platform',
  define: {
    timestamps: true,
    underscored: true
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testConnection();

module.exports = sequelize;
```

## 4. 核心功能实现

### 4.1 用户注册与登录

#### 4.1.1 注册功能实现

前端注册表单通过Axios发送POST请求到 `/api/auth/register`接口：

```javascript
// 注册功能
function register() {
    const username = document.querySelector('#form3Example1').value;
    const email = document.querySelector('#form3Example3').value;
    const password = document.querySelector('#form3Example4').value;
    const confirmPassword = document.querySelector('#form3Example5').value;
  
    // 密码验证
    if (password !== confirmPassword) {
        alert('密码不一致');
        return;
    }
  
    if (password.length < 8) {
        alert('密码长度必须大于8位');
        return;
    }
  
    // 发送注册请求
    axios({
        url: 'http://localhost:3000/api/auth/register',
        method: 'POST',
        data: {
            username: username,
            email: email,
            password: password
        }
    }).then(response => {
        console.log(response.data);
        alert('注册成功，请登录');
        window.location.href = 'Login.html';
    }).catch(error => {
        console.error('注册失败:', error);
        const errorMessage = error.response?.data?.message || '注册失败';
        alert(errorMessage);
    });
}
```

后端注册路由实现：

```javascript
// 注册路由
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: '用户名或邮箱已存在' });
        }

        // 创建新用户
        const newUser = await User.create({
            username,
            email,
            password
        });

        // 生成token
        const token = jwt.sign({ id: newUser.id }, 'secret_key', { expiresIn: '1d' });

        res.status(201).json({
            message: '注册成功',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

#### 4.1.2 登录功能实现

前端登录表单通过Axios发送POST请求到 `/api/auth/login`接口：

```javascript
document.querySelector(".btn-lg").addEventListener('click',()=>{
    const username = document.querySelector('#form3Example3').value
    const password = document.querySelector('#form3Example4').value
  
    if (password.length < 8){
        alert('密码必须大于8位')
        return
    }
  
    console.log('提交数据到服务器')
    console.log('username:', username);
    console.log('password:', password);

    axios({
        url:'http://localhost:3000/api/auth/login',
        method: 'POST',
        data: {
            username:username,
            password:password
        }
    }).then(result=>{
        console.log(result)
        console.log(result.data.message)
      
        if (result.data.token) {
            // 保存token到localStorage
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('username', result.data.user.username);
            localStorage.setItem('email', result.data.user.email);
            localStorage.setItem('userId', result.data.user.id);
          
            // 跳转到题目列表页面
            window.location.href = 'ProblemList.html';
        }
    }).catch(error => {
        console.error('登录失败:', error);
        console.error('错误响应:', error.response);
        const errorMessage = error.response?.data?.message || '登录失败，请检查用户名和密码';
        alert(errorMessage);
    })
})
```

后端登录路由实现：

```javascript
// 登录路由
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
      
        // 查找用户
        const user = await User.findOne({
            where: { username }
        });
      
        if (!user) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }
      
        // 验证密码
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }
      
        // 生成token
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1d' });
      
        res.status(200).json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

### 4.2 题目列表与详情

#### 4.2.1 题目列表实现

前端通过Axios发送GET请求到 `/api/problems`接口获取题目列表：

```javascript
// 获取题目列表
function loadProblems() {
    axios({
        url: 'http://localhost:3000/api/problems',
        method: 'GET'
    })
    .then(response => {
        const problems = response.data.problems;
        const pagination = response.data.pagination;
      
        // 渲染题目列表
        renderProblems(problems);
      
        // 渲染分页
        renderPagination(pagination);
    })
    .catch(error => {
        console.error('获取题目列表失败:', error);
        alert('获取题目列表失败');
    });
}

// 渲染题目列表
function renderProblems(problems) {
    const problemsContainer = document.getElementById('problems-container');
    problemsContainer.innerHTML = '';
  
    problems.forEach(problem => {
        const problemCard = document.createElement('div');
        problemCard.className = 'col-md-6 col-lg-4 mb-4';
      
        problemCard.innerHTML = `
            <div class="card problem-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${problem.title}</h5>
                    <p class="card-text text-truncate">${problem.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-${getDifficultyColor(problem.difficulty)}">${problem.difficulty}</span>
                        <small class="text-muted">${problem.solved_count} 人已解决</small>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="Problem.html?id=${problem.id}" class="btn btn-primary btn-sm">查看详情</a>
                </div>
            </div>
        `;
      
        problemsContainer.appendChild(problemCard);
    });
}

// 根据难度获取颜色
function getDifficultyColor(difficulty) {
    switch(difficulty) {
        case 'easy': return 'success';
        case 'medium': return 'warning';
        case 'hard': return 'danger';
        default: return 'secondary';
    }
}
```

后端题目路由实现：

```javascript
// 获取题目列表
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, difficulty, category, search } = req.query;
        const where = {};

        // 筛选条件
        if (difficulty) where.difficulty = difficulty;
        if (category) where.category = category;
        if (search) {
            where[Problem.sequelize.Op.or] = [
                { title: { [Problem.sequelize.Op.like]: `%${search}%` } },
                { description: { [Problem.sequelize.Op.like]: `%${search}%` } }
            ];
        }

        // 分页查询
        const { count, rows } = await Problem.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        });

        res.status(200).json({
            problems: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

#### 4.2.2 题目详情实现

前端通过Axios发送GET请求到 `/api/problems/:id`接口获取题目详情：

```javascript
// 获取题目详情
function loadProblemDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('id');
  
    if (!problemId) {
        alert('题目ID不存在');
        window.location.href = 'ProblemList.html';
        return;
    }
  
    axios({
        url: `http://localhost:3000/api/problems/${problemId}`,
        method: 'GET'
    })
    .then(response => {
        const problem = response.data;
      
        // 渲染题目详情
        renderProblemDetail(problem);
      
        // 加载用户提交历史
        loadUserSubmissions(problemId);
    })
    .catch(error => {
        console.error('获取题目详情失败:', error);
        alert('获取题目详情失败');
    });
}

// 渲染题目详情
function renderProblemDetail(problem) {
    document.getElementById('problem-title').textContent = problem.title;
    document.getElementById('problem-description').innerHTML = problem.description;
    document.getElementById('problem-difficulty').textContent = problem.difficulty;
    document.getElementById('problem-difficulty').className = `badge bg-${getDifficultyColor(problem.difficulty)}`;
    document.getElementById('problem-category').textContent = problem.category;
    document.getElementById('problem-solved-count').textContent = problem.solved_count;
    document.getElementById('problem-attempt-count').textContent = problem.attempt_count;
}

// 获取用户提交历史
function loadUserSubmissions(problemId) {
    // 获取token
    const token = localStorage.getItem('token');
    if (!token) {
        return; // 未登录则不加载提交历史
    }
  
    axios({
        url: `http://localhost:3000/api/submissions?problemId=${problemId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        const submissions = response.data.submissions;
        renderUserSubmissions(submissions);
    })
    .catch(error => {
        console.error('获取提交历史失败:', error);
    });
}

// 渲染用户提交历史
function renderUserSubmissions(submissions) {
    const submissionsContainer = document.getElementById('user-submissions-container');
  
    if (submissions.length === 0) {
        submissionsContainer.innerHTML = '<p class="text-muted">暂无提交记录</p>';
        return;
    }
  
    let html = '<div class="list-group">';
  
    submissions.forEach(submission => {
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">提交时间: ${new Date(submission.submission_time).toLocaleString()}</h5>
                    <small>结果: <span class="badge bg-${getResultColor(submission.result)}">${submission.result}</span></small>
                </div>
                <p class="mb-1">语言: ${submission.language}</p>
                <small>执行时间: ${submission.execution_time}ms, 内存: ${submission.memory_usage}KB</small>
            </div>
        `;
    });
  
    html += '</div>';
    submissionsContainer.innerHTML = html;
}
```

后端题目详情路由实现：

```javascript
// 获取单个题目详情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findByPk(parseInt(id));

        if (!problem) {
            return res.status(404).json({ message: '题目不存在' });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

### 4.3 代码提交与在线判题

#### 4.3.1 代码提交实现

前端代码编辑器通过Axios发送POST请求到 `/api/submissions`接口提交代码：

```javascript
// 提交代码
function submitCode() {
    // 获取token
    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        window.location.href = 'Login.html';
        return;
    }
  
    // 获取题目ID
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('id');
  
    // 获取代码和语言
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language-select').value;
  
    // 验证代码
    if (!code.trim()) {
        alert('请输入代码');
        return;
    }
  
    // 显示提交状态
    showSubmitStatus('提交中...', 'info');
  
    // 发送提交请求
    axios({
        url: 'http://localhost:3000/api/submissions',
        method: 'POST',
        data: {
            problemId: problemId,
            code: code,
            language: language
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        const submission = response.data;
      
        // 更新题目尝试次数
        updateProblemAttemptCount(problemId);
      
        // 显示提交成功
        showSubmitStatus('提交成功，正在判题...', 'success');
      
        // 轮询获取判题结果
        pollSubmissionResult(submission.id);
    })
    .catch(error => {
        console.error('提交失败:', error);
        const errorMessage = error.response?.data?.message || '提交失败';
        showSubmitStatus(errorMessage, 'danger');
    });
}

// 轮询获取判题结果
function pollSubmissionResult(submissionId) {
    const token = localStorage.getItem('token');
  
    const pollInterval = setInterval(() => {
        axios({
            url: `http://localhost:3000/api/submissions/${submissionId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const submission = response.data;
          
            if (submission.result !== 'Pending') {
                clearInterval(pollInterval);
              
                // 显示最终结果
                showSubmitStatus(`判题完成: ${submission.result}`, 
                    submission.result === 'Accepted' ? 'success' : 'danger');
              
                // 更新题目解决/尝试次数
                updateProblemStats(submission.problem_id, submission.result);
              
                // 重新加载用户提交历史
                const urlParams = new URLSearchParams(window.location.search);
                const problemId = urlParams.get('id');
                loadUserSubmissions(problemId);
            } else {
                showSubmitStatus(`判题中... (${submission.execution_time}s)`, 'info');
            }
        })
        .catch(error => {
            console.error('获取判题结果失败:', error);
            clearInterval(pollInterval);
            showSubmitStatus('获取判题结果失败', 'danger');
        });
    }, 2000); // 每2秒查询一次
}

// 显示提交状态
function showSubmitStatus(message, type) {
    const statusElement = document.getElementById('submit-status');
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type}`;
    statusElement.style.display = 'block';
}
```

后端提交路由实现：

```javascript
// 提交代码
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.userId;
      
        // 检查题目是否存在
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            return res.status(404).json({ message: '题目不存在' });
        }
      
        // 创建提交记录
        const submission = await Submission.create({
            user_id: userId,
            problem_id: problemId,
            code: code,
            language: language,
            result: 'Pending'
        });
      
        // 更新题目的尝试次数
        await Problem.increment('attempt_count', {
            by: 1,
            where: { id: problemId }
        });
      
        // 模拟代码判题过程（实际项目中需要使用沙箱环境）
        simulateCodeEvaluation(submission.id);
      
        res.status(201).json({
            message: '提交成功',
            submission: {
                id: submission.id,
                result: submission.result,
                submission_time: submission.submission_time
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 模拟代码评估过程
async function simulateCodeEvaluation(submissionId) {
    try {
        // 模拟等待时间
        await new Promise(resolve => setTimeout(resolve, 3000));
      
        // 获取提交信息
        const submission = await Submission.findByPk(submissionId, {
            include: [
                { model: Problem }
            ]
        });
      
        // 模拟不同的评估结果
        const randomResult = Math.random();
        let result;
      
        if (randomResult < 0.3) {
            result = 'Accepted';
        } else if (randomResult < 0.6) {
            result = 'Wrong Answer';
        } else if (randomResult < 0.8) {
            result = 'Runtime Error';
        } else {
            result = 'Time Limit Exceeded';
        }
      
        // 更新提交结果
        await Submission.update({
            result: result,
            execution_time: Math.floor(Math.random() * 100) + 50,
            memory_usage: Math.floor(Math.random() * 10000) + 1000
        }, {
            where: { id: submissionId }
        });
      
        // 如果通过，增加题目的解决数
        if (result === 'Accepted') {
            await Problem.increment('solved_count', {
                by: 1,
                where: { id: submission.problem_id }
            });
        }
      
        // 创建测试用例结果（模拟）
        await createMockTestCaseResults(submissionId, result);
    } catch (error) {
        console.error('代码评估出错:', error);
    }
}

// 创建模拟测试用例结果
async function createMockTestCaseResults(submissionId, result) {
    const testCases = 3; // 模拟3个测试用例
  
    for (let i = 0; i < testCases; i++) {
        await TestCaseResult.create({
            submission_id: submissionId,
            passed: result === 'Accepted' || (Math.random() < 0.3 && i === 0),
            expected: `Test case ${i} expected output`,
            actual: `Test case ${i} actual output`,
            test_case_order: i
        });
    }
}
```

#### 4.3.2 提交详情查看

前端通过Axios发送GET请求到 `/api/submissions/:id`接口获取提交详情：

```javascript
// 获取提交详情
function loadSubmissionDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const submissionId = urlParams.get('id');
  
    if (!submissionId) {
        alert('提交ID不存在');
        window.location.href = 'ProblemList.html';
        return;
    }
  
    // 获取token
    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        window.location.href = 'Login.html';
        return;
    }
  
    axios({
        url: `http://localhost:3000/api/submissions/${submissionId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        const submission = response.data;
      
        // 渲染提交详情
        renderSubmissionDetail(submission);
      
        // 加载测试用例结果
        loadTestCaseResults(submissionId);
    })
    .catch(error => {
        console.error('获取提交详情失败:', error);
        alert('获取提交详情失败');
    });
}

// 渲染提交详情
function renderSubmissionDetail(submission) {
    document.getElementById('submission-result').textContent = submission.result;
    document.getElementById('submission-result').className = `badge bg-${getResultColor(submission.result)}`;
    document.getElementById('submission-time').textContent = submission.execution_time + 'ms';
    document.getElementById('submission-memory').textContent = submission.memory_usage + 'KB';
    document.getElementById('submission-language').textContent = submission.language;
    document.getElementById('submission-date').textContent = new Date(submission.submission_time).toLocaleString();
  
    // 显示代码
    const codeElement = document.getElementById('submission-code');
    codeElement.textContent = submission.code;
  
    // 根据语言设置代码高亮
    highlightCode(codeElement, submission.language);
}

// 加载测试用例结果
function loadTestCaseResults(submissionId) {
    const token = localStorage.getItem('token');
  
    axios({
        url: `http://localhost:3000/api/submissions/${submissionId}/test-cases`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        const testCaseResults = response.data;
        renderTestCaseResults(testCaseResults);
    })
    .catch(error => {
        console.error('获取测试用例结果失败:', error);
        document.getElementById('test-cases-container').innerHTML = 
            '<p class="text-muted">获取测试用例结果失败</p>';
    });
}

// 渲染测试用例结果
function renderTestCaseResults(testCaseResults) {
    const container = document.getElementById('test-cases-container');
  
    if (testCaseResults.length === 0) {
        container.innerHTML = '<p class="text-muted">暂无测试用例结果</p>';
        return;
    }
  
    let html = '<div class="accordion" id="testCaseAccordion">';
  
    testCaseResults.forEach((result, index) => {
        const collapsed = index === 0 ? '' : 'collapsed';
        const show = index === 0 ? 'show' : '';
      
        html += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button ${collapsed}" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" 
                        aria-controls="collapse${index}">
                        测试用例 ${index + 1}: 
                        <span class="badge bg-${result.passed ? 'success' : 'danger'} ms-2">
                            ${result.passed ? '通过' : '失败'}
                        </span>
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse ${show}" 
                    aria-labelledby="heading${index}" data-bs-parent="#testCaseAccordion">
                    <div class="accordion-body">
                        <h6>期望输出:</h6>
                        <pre><code>${result.expected}</code></pre>
                        <h6>实际输出:</h6>
                        <pre><code>${result.actual}</code></pre>
                    </div>
                </div>
            </div>
        `;
    });
  
    html += '</div>';
    container.innerHTML = html;
}
```

后端提交详情路由实现：

```javascript
// 获取单个提交详情
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
      
        const submission = await Submission.findOne({
            where: { id },
            include: [
                { model: Problem },
                { model: User, attributes: ['id', 'username', 'avatar'] }
            ]
        });
      
        if (!submission) {
            return res.status(404).json({ message: '提交不存在' });
        }
      
        // 检查是否有权限查看该提交（自己的提交或管理员）
        if (submission.user_id !== req.userId) {
            // 这里可以添加管理员权限检查
            // return res.status(403).json({ message: '无权查看该提交' });
        }
      
        res.status(200).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

### 4.4 排行榜实现

前端通过Axios发送GET请求到 `/api/ranking`接口获取排行榜数据：

```javascript
// 加载排行榜
function loadRanking() {
    axios({
        url: 'http://localhost:3000/api/ranking',
        method: 'GET'
    })
    .then(response => {
        const ranking = response.data;
        renderRanking(ranking);
    })
    .catch(error => {
        console.error('获取排行榜失败:', error);
        alert('获取排行榜失败');
    });
}

// 渲染排行榜
function renderRanking(ranking) {
    const rankingTable = document.getElementById('ranking-table-body');
    rankingTable.innerHTML = '';
  
    ranking.forEach((user, index) => {
        const row = document.createElement('tr');
      
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${user.avatar}" class="rounded-circle me-2" width="30" height="30">
                    ${user.username}
                </div>
            </td>
            <td>${user.solved_count}</td>
            <td>${user.submission_count}</td>
            <td>${user.acceptance_rate}%</td>
        `;
      
        rankingTable.appendChild(row);
    });
}
```

后端排行榜路由实现：

```javascript
// 获取排行榜
router.get('/', async (req, res) => {
    try {
        // 查询用户，按解决题目数排序
        const users = await User.findAll({
            attributes: [
                'id', 
                'username', 
                'avatar', 
                'submission_count',
                [sequelize.fn('COUNT', sequelize.col('Submissions.id')), 'solved_count'],
                [sequelize.fn(
                    'ROUND', 
                    sequelize.fn(
                        'SUM', 
                        sequelize.literal('CASE WHEN Submissions.result = "Accepted" THEN 1 ELSE 0 END')
                    ), 
                    0
                ), 'accepted_count']
            ],
            include: [{
                model: Submission,
                attributes: [],
                required: false,
                where: {
                    result: 'Accepted'
                }
            }],
            group: ['User.id'],
            order: [[sequelize.literal('solved_count'), 'DESC']],
            limit: 20
        });
      
        // 计算通过率
        const ranking = users.map(user => {
            const acceptanceRate = user.submission_count > 0 
                ? Math.round((user.dataValues.accepted_count / user.submission_count) * 100)
                : 0;
              
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                submission_count: user.submission_count,
                solved_count: user.dataValues.solved_count || 0,
                acceptance_rate: acceptanceRate
            };
        });
      
        res.status(200).json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

## 5. 关键技术细节

### 5.1 JWT认证实现

项目中使用了JWT（JSON Web Token）实现无状态身份认证。这种认证方式避免了传统的会话管理开销，特别适用于前后端分离的架构。

JWT认证的核心流程如下：

1. **登录认证**：

   - 用户提交用户名和密码
   - 服务器验证用户凭据
   - 验证成功后，生成JWT token
   - 将token返回给前端
2. **Token传递**：

   - 前端将token存储在localStorage中
   - 每次API请求时，在请求头中携带token：`Authorization: Bearer <token>`
3. **Token验证**：

   - 服务器使用中间件验证token
   - 验证成功后，提取用户ID并传递给路由处理函数

以下是项目中的JWT认证实现：

```javascript
// 中间件：验证token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: '未授权' });
    }

    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: '无效的token' });
    }
};
```

在路由中使用中间件：

```javascript
// 提交代码
router.post('/', authenticateToken, async (req, res) => {
    // 路由处理逻辑
});
```

### 5.2 密码安全处理

项目中使用bcrypt库对用户密码进行哈希处理，确保密码不会以明文形式存储在数据库中。

密码处理的关键点：

1. **注册时哈希密码**：在用户创建前，使用bcrypt的genSalt方法生成盐值，然后对密码进行哈希处理。
2. **密码验证**：用户提供密码后，使用bcrypt的compare方法与存储的哈希值进行比较。
3. **更新密码时重新哈希**：当用户更新密码时，确保重新生成盐值和哈希值。

以下是项目中的密码处理实现：

```javascript
// 在模型中定义hooks，在保存用户前自动哈希密码
hooks: {
    // 在保存用户之前哈希密码
    beforeCreate: async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    },
    beforeUpdate: async (user) => {
        if (user.password && user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}

// 添加密码验证方法
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

### 5.3 数据库关联与查询优化

项目使用Sequelize ORM定义模型间的关联关系，并使用关联查询优化数据获取。

主要关联关系：

1. **用户与提交**：一个用户可以有多个提交记录
2. **题目与提交**：一个题目可以有多个提交记录
3. **提交与测试用例结果**：一个提交可以有多个测试用例结果

以下是项目中的关联定义：

```javascript
// 定义表关联
User.hasMany(Submission, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Problem.hasMany(Submission, {
    foreignKey: 'problem_id',
    onDelete: 'CASCADE'
});

Submission.hasMany(TestCaseResult, {
    foreignKey: 'submission_id',
    onDelete: 'CASCADE'
});
```

使用关联查询获取数据：

```javascript
// 获取单个提交详情，包含题目和用户信息
const submission = await Submission.findOne({
    where: { id },
    include: [
        { model: Problem },
        { model: User, attributes: ['id', 'username', 'avatar'] }
    ]
});
```

### 5.4 分页与筛选实现

项目中实现了分页和筛选功能，提高用户体验和数据查询效率。

分页参数：

- `page`：当前页码（默认1）
- `limit`：每页显示的记录数（默认10）

筛选条件：

- `difficulty`：题目难度
- `category`：题目分类
- `search`：搜索关键词

以下是项目中的分页与筛选实现：

```javascript
// 获取题目列表，支持分页和筛选
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, difficulty, category, search } = req.query;
        const where = {};

        // 筛选条件
        if (difficulty) where.difficulty = difficulty;
        if (category) where.category = category;
        if (search) {
            where[Problem.sequelize.Op.or] = [
                { title: { [Problem.sequelize.Op.like]: `%${search}%` } },
                { description: { [Problem.sequelize.Op.like]: `%${search}%` } }
            ];
        }

        // 分页查询
        const { count, rows } = await Problem.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        });

        res.status(200).json({
            problems: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

## 6. 项目总结与思考

### 6.1 项目总结

本项目成功实现了一个功能完整的在线判题平台，包括用户管理、题目浏览、代码提交、在线判题、排行榜等核心功能。项目采用了前后端分离的架构，使用现代Web技术栈开发，提高了开发效率和代码可维护性。

项目的主要成果：

1. **完整的功能实现**：实现了OJ平台的所有核心功能，满足了在线编程练习和竞赛的基本需求。
2. **良好的架构设计**：采用前后端分离的架构，模块化的设计，提高了系统的可扩展性和可维护性。
3. **安全的身份认证**：使用JWT实现无状态身份认证，使用bcrypt哈希密码，提高了系统的安全性。
4. **优化的数据库操作**：使用Sequelize ORM简化数据库操作，实现分页和筛选，提高用户体验。
5. **友好的用户界面**：使用Bootstrap和自定义CSS，提供美观、响应式的用户界面。

### 6.2 项目亮点

1. **现代化技术栈**：使用Node.js、Express.js、Sequelize等现代技术，提高开发效率。
2. **前后端分离**：采用RESTful API设计，前后端分离，提高系统的可扩展性。
3. **模块化设计**：将功能划分为模块，代码结构清晰，易于维护和扩展。
4. **安全性考虑**：使用JWT认证和bcrypt密码哈希，保护用户数据安全。
5. **响应式设计**：界面采用Bootstrap和自定义CSS，提供良好的用户体验。

### 6.3 项目不足与改进方向

1. **代码判题沙箱**：目前使用的是模拟判题，没有实现真正的代码执行环境。在实际项目中，需要使用沙箱技术确保代码安全执行。
2. **测试用例管理**：当前系统没有提供测试用例的可视化管理和编辑功能，需要完善。
3. **管理员功能**：缺少管理员后台，无法方便地管理题目和用户。
4. **代码编辑器**：目前使用的是简单的textarea，可以集成专业的代码编辑器如Monaco Editor或CodeMirror。
5. **性能优化**：对于大量用户的场景，需要进一步优化数据库查询和缓存策略。

### 6.4 技术收获与思考

通过本项目的开发，我对以下技术有了更深入的理解：

1. **前后端分离架构**：学会了如何设计RESTful API，实现前后端分离，提高系统的可扩展性。
2. **Node.js与Express.js**：熟悉了Node.js生态系统，掌握了Express.js框架的使用方法和最佳实践。
3. **数据库ORM**：学会了如何使用Sequelize ORM简化数据库操作，实现模型关联和查询优化。
4. **身份认证与安全**：掌握了JWT认证和密码哈希技术，提高了系统的安全性。
5. **前端技术**：巩固了HTML、CSS、JavaScript等前端技术，学习了Axios库的使用。

### 6.5 未来展望

未来可以考虑以下方向的改进：

1. **代码执行沙箱**：实现真正的代码执行环境，支持多种编程语言的在线判题。
2. **竞赛功能完善**：完善竞赛功能，支持定时竞赛、团队竞赛等。
3. **移动端适配**：优化移动端界面，提供更好的移动端体验。
4. **实时通信**：使用WebSocket实现实时判题进度推送和实时排行榜更新。
5. **数据分析**：添加学习数据分析功能，帮助用户了解自己的学习进度和薄弱环节。

## 7. 参考文献

1. Express.js官方文档：https://expressjs.com/
2. Sequelize官方文档：https://sequelize.org/
3. MySQL官方文档：https://dev.mysql.com/doc/
4. Axios官方文档：https://axios-http.com/docs/intro
5. Bootstrap官方文档：https://getbootstrap.com/
6. JWT官方文档：https://jwt.io/
7. bcrypt官方文档：https://www.npmjs.com/package/bcrypt

## 8. 附录

### 8.1 项目文件结构

```
Webwork/
├── config/
│   ├── db.js                # 数据库配置
│   └── init-db.js           # 数据库初始化脚本
├── css/                     # 样式文件
│   ├── category.css         # 分类页面样式
│   ├── common.css           # 通用样式
│   ├── contest.css          # 竞赛页面样式
│   ├── index.css            # 首页样式
│   ├── mine.css             # 个人中心样式
│   ├── problem.css          # 题目详情样式
│   ├── problemList.css      # 题目列表样式
│   └── ranking.css          # 排行榜样式
├── html/                    # HTML页面
│   ├── Category.html        # 分类页面
│   ├── Contest.html         # 竞赛页面
│   ├── Index.html           # 首页
│   ├── Login.html           # 登录页面
│   ├── Mine.html            # 个人中心页面
│   ├── Problem.html         # 题目详情页面
│   ├── ProblemList.html     # 题目列表页面
│   ├── Ranking.html         # 排行榜页面
│   ├── Register.html        # 注册页面
│   └── footer.html          # 页脚模板
├── img/                     # 图片资源
├── js/                      # 前端JavaScript文件
│   ├── Category.js          # 分类页面脚本
│   ├── Contest.js           # 竞赛页面脚本
│   ├── Login.js             # 登录页面脚本
│   ├── Mine.js              # 个人中心脚本
│   ├── Problems.js          # 题目列表脚本
│   ├── Ranking.js           # 排行榜脚本
│   └── index.js             # 首页脚本
├── models/                  # 数据模型
│   ├── Contest.js           # 竞赛模型
│   ├── Problem.js           # 题目模型
│   ├── Submission.js        # 提交模型
│   ├── TestCaseResult.js    # 测试用例结果模型
│   └── User.js              # 用户模型
├── routes/                  # 路由定义
│   ├── auth.js              # 认证路由
│   ├── contests.js          # 竞赛路由
│   ├── problems.js          # 题目路由
│   └── submissions.js       # 提交路由
├── create-db.js             # 创建数据库脚本
├── db.js                    # 数据库连接
├── db.json                  # 数据库数据文件
├── init-db.js               # 初始化数据库脚本
├── init.js                  # 初始化脚本
├── package-lock.json        # 依赖锁定文件
├── package.json             # 项目配置文件
├── query/                   # 查询文件
├── server.js                # 服务器入口文件
└── test-db-connection.js    # 测试数据库连接脚本
```

### 8.2 数据库表结构说明

本项目使用MySQL数据库，主要包含以下表：

1. **users表**：存储用户信息

   - id：UUID，主键
   - username：用户名，唯一
   - email：邮箱，唯一
   - password：密码，哈希存储
   - avatar：头像URL
   - submission_count：提交次数
   - register_time：注册时间
2. **problems表**：存储题目信息

   - id：整数，主键，自增
   - title：题目标题
   - description：题目描述
   - difficulty：难度（easy/medium/hard）
   - pass_rate：通过率
   - category：分类
   - solved_count：解决数
   - attempt_count：尝试数
   - created_at：创建时间
3. **submissions表**：存储提交信息

   - id：UUID，主键
   - user_id：用户ID，外键
   - problem_id：题目ID，外键
   - code：代码内容
   - language：编程语言（javascript/python/java/cpp）
   - result：提交结果（Pending/Accepted/Wrong Answer等）
   - score：得分
   - execution_time：执行时间
   - memory_usage：内存使用
   - submission_time：提交时间
4. **contests表**：存储竞赛信息

   - id：UUID，主键
   - title：竞赛标题
   - description：竞赛描述
   - start_time：开始时间
   - end_time：结束时间
   - status：状态（ongoing/upcoming/ended）
   - created_at：创建时间
5. **test_case_results表**：存储测试用例结果

   - id：UUID，主键
   - submission_id：提交ID，外键
   - passed：是否通过
   - expected：期望输出
   - actual：实际输出
   - test_case_order：测试用例顺序

### 8.3 API接口说明

本项目使用RESTful API设计，主要接口如下：

1. **认证接口**

   - POST `/api/auth/register`：用户注册
   - POST `/api/auth/login`：用户登录
2. **题目接口**

   - GET `/api/problems`：获取题目列表（支持分页和筛选）
   - GET `/api/problems/:id`：获取题目详情
3. **提交接口**

   - POST `/api/submissions`：提交代码
   - GET `/api/submissions`：获取用户提交列表
   - GET `/api/submissions/:id`：获取提交详情
4. **排行榜接口**

   - GET `/api/ranking`：获取排行榜
5. **竞赛接口**

   - GET `/api/contests`：获取竞赛列表
   - GET `/api/contests/:id`：获取竞赛详情

### 8.4 核心代码片段

1. **服务器启动代码**：

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/contests', contestRoutes);

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Index.html'));
});

// 处理HTML页面请求
app.get('*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', req.path));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

2. **用户模型定义**：

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'https://mdbcdn.b-cdn.net/img/new/avatars/1.webp'
    },
    submission_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    register_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password && user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
```

3. **登录功能实现**：

```javascript
// 前端登录代码
document.querySelector(".btn-lg").addEventListener('click',()=>{
    const username = document.querySelector('#form3Example3').value
    const password = document.querySelector('#form3Example4').value
  
    if (password.length < 8){
        alert('密码必须大于8位')
        return
    }
  
    console.log('提交数据到服务器')
    console.log('username:', username);
    console.log('password:', password);

    axios({
        url:'http://localhost:3000/api/auth/login',
        method: 'POST',
        data: {
            username:username,
            password:password
        }
    }).then(result=>{
        console.log(result)
        console.log(result.data.message)
      
        if (result.data.token) {
            // 保存token到localStorage
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('username', result.data.user.username);
            localStorage.setItem('email', result.data.user.email);
            localStorage.setItem('userId', result.data.user.id);
          
            // 跳转到题目列表页面
            window.location.href = 'ProblemList.html';
        }
    }).catch(error => {
        console.error('登录失败:', error);
        console.error('错误响应:', error.response);
        const errorMessage = error.response?.data?.message || '登录失败，请检查用户名和密码';
        alert(errorMessage);
    })
})
```

4. **代码提交功能实现**：

```javascript
// 前端提交代码
function submitCode() {
    // 获取token
    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        window.location.href = 'Login.html';
        return;
    }
  
    // 获取题目ID
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('id');
  
    // 获取代码和语言
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language-select').value;
  
    // 验证代码
    if (!code.trim()) {
        alert('请输入代码');
        return;
    }
  
    // 显示提交状态
    showSubmitStatus('提交中...', 'info');
  
    // 发送提交请求
    axios({
        url: 'http://localhost:3000/api/submissions',
        method: 'POST',
        data: {
            problemId: problemId,
            code: code,
            language: language
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        const submission = response.data;
      
        // 更新题目尝试次数
        updateProblemAttemptCount(problemId);
      
        // 显示提交成功
        showSubmitStatus('提交成功，正在判题...', 'success');
      
        // 轮询获取判题结果
        pollSubmissionResult(submission.id);
    })
    .catch(error => {
        console.error('提交失败:', error);
        const errorMessage = error.response?.data?.message || '提交失败';
        showSubmitStatus(errorMessage, 'danger');
    });
}
```

5. **数据库关联定义**：

```javascript
// 定义表关联
User.hasMany(Submission, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Problem.hasMany(Submission, {
    foreignKey: 'problem_id',
    onDelete: 'CASCADE'
});

Submission.hasMany(TestCaseResult, {
    foreignKey: 'submission_id',
    onDelete: 'CASCADE'
});
```

6. **排行榜查询实现**：

```javascript
// 获取排行榜
router.get('/', async (req, res) => {
    try {
        // 查询用户，按解决题目数排序
        const users = await User.findAll({
            attributes: [
                'id', 
                'username', 
                'avatar', 
                'submission_count',
                [sequelize.fn('COUNT', sequelize.col('Submissions.id')), 'solved_count'],
                [sequelize.fn(
                    'ROUND', 
                    sequelize.fn(
                        'SUM', 
                        sequelize.literal('CASE WHEN Submissions.result = "Accepted" THEN 1 ELSE 0 END')
                    ), 
                    0
                ), 'accepted_count']
            ],
            include: [{
                model: Submission,
                attributes: [],
                required: false,
                where: {
                    result: 'Accepted'
                }
            }],
            group: ['User.id'],
            order: [[sequelize.literal('solved_count'), 'DESC']],
            limit: 20
        });
      
        // 计算通过率
        const ranking = users.map(user => {
            const acceptanceRate = user.submission_count > 0 
                ? Math.round((user.dataValues.accepted_count / user.submission_count) * 100)
                : 0;
              
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                submission_count: user.submission_count,
                solved_count: user.dataValues.solved_count || 0,
                acceptance_rate: acceptanceRate
            };
        });
      
        res.status(200).json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});
```

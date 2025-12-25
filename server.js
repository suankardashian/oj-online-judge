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
app.use(express.static(path.join(__dirname, 'html')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/contests', contestRoutes);

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

const sequelize = require('./config/db');
const User = require('./models/User');
const Problem = require('./models/Problem');
const Submission = require('./models/Submission');
const Contest = require('./models/Contest');
const TestCaseResult = require('./models/TestCaseResult');

async function initDatabase() {
    try {
        console.log('正在同步数据库表结构...');
        // 同步所有模型到数据库
        await sequelize.sync({ force: false }); // force: false 表示不删除现有表
        console.log('数据库表结构同步完成');
        
        // 创建一些示例数据
        console.log('正在创建示例题目...');
        const sampleProblems = [
            {
                title: '两数之和',
                description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。',
                difficulty: 'easy',
                category: '数组',
                solved_count: 0,
                attempt_count: 0,
                created_at: new Date()
            },
            {
                title: '回文数',
                description: '给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。',
                difficulty: 'easy',
                category: '数学',
                solved_count: 0,
                attempt_count: 0,
                created_at: new Date()
            }
        ];
        
        await Problem.bulkCreate(sampleProblems);
        console.log('示例题目创建完成');
        
        console.log('数据库初始化成功');
    } catch (error) {
        console.error('数据库初始化失败:', error);
    } finally {
        await sequelize.close();
    }
}

initDatabase();

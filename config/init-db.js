const sequelize = require('./db');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const Contest = require('../models/Contest');
const TestCaseResult = require('../models/TestCaseResult');

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

async function initDB() {
    try {
        // 自动创建表
        await sequelize.sync({
            alter: true // 使用alter: true而不是force: true以保留现有数据
        });
        console.log('数据库表创建/更新成功');

        // 检查是否需要创建初始数据
        const problemCount = await Problem.count();
        if (problemCount === 0) {
            // 创建一些示例题目
            const problems = [
                {
                    title: '两数之和',
                    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。',
                    difficulty: 'easy',
                    category: '数组',
                    pass_rate: 0,
                    solved_count: 0,
                    attempt_count: 0
                },
                {
                    title: '反转链表',
                    description: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
                    difficulty: 'medium',
                    category: '链表',
                    pass_rate: 0,
                    solved_count: 0,
                    attempt_count: 0
                },
                {
                    title: '最大子数组和',
                    description: '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
                    difficulty: 'easy',
                    category: '动态规划',
                    pass_rate: 0,
                    solved_count: 0,
                    attempt_count: 0
                }
            ];
            
            await Problem.bulkCreate(problems);
            console.log('初始题目数据创建成功');
        }

    } catch (error) {
        console.error('数据库初始化失败:', error);
    } finally {
        await sequelize.close();
    }
}

initDB();
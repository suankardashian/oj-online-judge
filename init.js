const mongoose = require('mongoose');
const User = require('./models/User');
const Problem = require('./models/Problem');
const Contest = require('./models/Contest');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/oj_platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
    initData();
}).catch(err => {
    console.log('数据库连接失败:', err);
});

// 初始化数据
async function initData() {
    try {
        // 创建示例用户
        await createSampleUsers();

        // 创建示例题目
        await createSampleProblems();

        // 创建示例竞赛
        await createSampleContests();

        console.log('数据初始化完成');
        mongoose.connection.close();
    } catch (error) {
        console.error('数据初始化失败:', error);
        mongoose.connection.close();
    }
}

// 创建示例用户
async function createSampleUsers() {
    const users = [
        {
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            solvedProblems: [1001, 1002],
            submissionCount: 10
        },
        {
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
            solvedProblems: [1001],
            submissionCount: 5
        }
    ];

    for (const userData of users) {
        const existingUser = await User.findOne({ username: userData.username });
        if (!existingUser) {
            await User.create(userData);
            console.log(`创建用户 ${userData.username} 成功`);
        } else {
            console.log(`用户 ${userData.username} 已存在`);
        }
    }
}

// 创建示例题目
async function createSampleProblems() {
    const problems = [
        {
            id: 1001,
            title: '两数之和',
            description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
            difficulty: 'easy',
            passRate: 45.2,
            category: 'array',
            solvedCount: 12845,
            attemptCount: 28413,
            testCases: [
                {
                    input: '[2,7,11,15],9',
                    output: '[0,1]'
                },
                {
                    input: '[3,2,4],6',
                    output: '[1,2]'
                },
                {
                    input: '[3,3],6',
                    output: '[0,1]'
                }
            ]
        },
        {
            id: 1002,
            title: '整数反转',
            description: '给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。',
            difficulty: 'easy',
            passRate: 34.5,
            category: 'math',
            solvedCount: 16789,
            attemptCount: 48632,
            testCases: [
                {
                    input: '123',
                    output: '321'
                },
                {
                    input: '-123',
                    output: '-321'
                },
                {
                    input: '120',
                    output: '21'
                }
            ]
        }
    ];

    for (const problemData of problems) {
        const existingProblem = await Problem.findOne({ id: problemData.id });
        if (!existingProblem) {
            await Problem.create(problemData);
            console.log(`创建题目 ${problemData.title} 成功`);
        } else {
            console.log(`题目 ${problemData.title} 已存在`);
        }
    }
}

// 创建示例竞赛
async function createSampleContests() {
    const contests = [
        {
            title: '周赛 #1',
            description: '每周举行的算法竞赛，包含两道简单题和一道中等题。',
            startTime: new Date(Date.now() - 3600000), // 1小时前开始
            endTime: new Date(Date.now() + 7200000), // 2小时后结束
            status: 'ongoing',
            problems: [
                { id: 1001, title: '两数之和', order: 1 },
                { id: 1002, title: '整数反转', order: 2 }
            ]
        },
        {
            title: '周赛 #2',
            description: '每周举行的算法竞赛，包含三道题。',
            startTime: new Date(Date.now() + 86400000), // 1天后开始
            endTime: new Date(Date.now() + 86400000 + 10800000), // 1天后开始，3小时后结束
            status: 'upcoming',
            problems: [
                { id: 1001, title: '两数之和', order: 1 }
            ]
        }
    ];

    for (const contestData of contests) {
        const existingContest = await Contest.findOne({ title: contestData.title });
        if (!existingContest) {
            await Contest.create(contestData);
            console.log(`创建竞赛 ${contestData.title} 成功`);
        } else {
            console.log(`竞赛 ${contestData.title} 已存在`);
        }
    }
}

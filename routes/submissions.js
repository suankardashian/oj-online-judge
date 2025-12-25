const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const TestCaseResult = require('../models/TestCaseResult');
const jwt = require('jsonwebtoken');

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

// 提交代码
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.userId;

        // 查找题目
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            return res.status(404).json({ message: '题目不存在' });
        }

        // 初始化提交结果
        let result = 'Pending';
        let score = 0;
        let executionTime = 0;
        const testCaseResults = [];

        // 简单的JavaScript代码判题
        if (language === 'javascript') {
            // 这里应该从数据库或其他地方获取测试用例
            // 目前使用模拟测试用例
            const testCases = [
                { input: '1,2', output: '3' },
                { input: '5,7', output: '12' },
                { input: '0,0', output: '0' }
            ];

            for (let i = 0; i < testCases.length; i++) {
                const { input, output } = testCases[i];
                let passed = false;
                let actual = '';

                try {
                    // 创建函数环境并执行代码
                    const func = new Function('input', code);
                    const startTime = Date.now();
                    actual = func(input).toString().trim();
                    const endTime = Date.now();
                    executionTime += (endTime - startTime);

                    // 比较结果
                    if (actual === output.trim()) {
                        passed = true;
                        score += 100 / testCases.length;
                    }
                } catch (err) {
                    actual = `运行错误: ${err.message}`;
                    passed = false;
                }

                testCaseResults.push({
                        passed,
                        expected: output.trim(),
                        actual,
                        test_case_order: i,
                        input: input // 添加输入字段，与前端期望一致
                    });
            }

            // 更新结果
            if (score === 100) {
                result = 'Accepted';
            } else if (score > 0) {
                result = 'Partial Accepted';
            } else {
                result = 'Wrong Answer';
            }
        } else {
            // 其他语言暂不支持
            result = 'Language Not Supported';
        }

        // 创建提交记录
        const submission = await Submission.create({
            user_id: userId,
            problem_id: problemId,
            code,
            language,
            result,
            score,
            execution_time: executionTime
        });

        // 创建测试用例结果记录
        for (const testCaseResult of testCaseResults) {
            await TestCaseResult.create({
                ...testCaseResult,
                submission_id: submission.id
            });
        }

        // 更新用户提交次数
        await User.increment('submission_count', {
            where: { id: userId }
        });

        // 更新题目统计
        await Problem.increment({
            attempt_count: 1,
            solved_count: result === 'Accepted' ? 1 : 0
        }, {
            where: { id: problemId }
        });

        // 计算新的通过率
        const updatedProblem = await Problem.findByPk(problemId);
        const newPassRate = updatedProblem.solved_count > 0 
            ? Math.round((updatedProblem.solved_count / updatedProblem.attempt_count) * 100) / 10 
            : 0;
        await Problem.update(
            { pass_rate: newPassRate },
            { where: { id: problemId } }
        );

        res.status(201).json({
            message: '提交成功',
            submission: {
                ...submission.toJSON(),
                testCases: testCaseResults
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 获取提交历史
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, problemId } = req.query;
        const where = { user_id: req.userId };

        if (problemId) where.problem_id = parseInt(problemId);

        const { count, rows } = await Submission.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [['submission_time', 'DESC']]
        });

        res.status(200).json({
            submissions: rows,
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

// 获取单个提交详情
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findByPk(id, {
            include: [TestCaseResult]
        });

        if (!submission) {
            return res.status(404).json({ message: '提交记录不存在' });
        }

        // 检查权限
        if (submission.user_id !== req.userId) {
            return res.status(403).json({ message: '无权访问' });
        }

        // 转换为前端期望的格式
        const submissionData = submission.toJSON();
        submissionData.testCases = submissionData.TestCaseResults;
        delete submissionData.TestCaseResults;

        res.status(200).json(submissionData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;

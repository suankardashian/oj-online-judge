const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission.js');
const Problem = require('../models/Problem.js');
const User = require('../models/User.js');
const TestCaseResult = require('../models/TestCaseResult.js');
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

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.userId;

        // 查找题目
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            return res.status(404).json({ message: '题目不存在' });
        }

        // 检查题目是否有测试用例
        if (!problem.test_cases || !Array.isArray(problem.test_cases) || problem.test_cases.length === 0) {
            return res.status(400).json({ message: '题目没有配置测试用例，无法进行评测' });
        }

        // 初始化提交结果
        let result = 'Pending';
        let score = 0;
        let executionTime = 0;
        const testCaseResults = [];
        const testCases = problem.test_cases;

        if (language === 'javascript') {

            for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i];
                const { input, output } = testCase;
                let passed = false;
                let actual = '';
                let errorMsg = '';

                try {
                    // 检查代码是否定义了一个函数
                    if (!code.includes('function') && !code.includes('=>')) {
                        throw new Error('代码中需要定义一个函数');
                    }
                    
                    // 创建函数环境并执行代码
                    const startTime = Date.now();
                    
                    // 处理不同的函数格式
                    let func;
                    try {
                        if (code.includes('=>')) {
                            // 箭头函数
                            func = new Function('input', `return (${code})(input)`);
                        } else if (code.trim().startsWith('function')) {
                            // 函数声明 - 需要包装成函数表达式
                            const match = code.match(/^function\s*\(([^)]*)\)\s*\{([\s\S]*)\}$/);
                            if (match) {
                                const params = match[1].trim();
                                const body = match[2];
                                func = new Function('input', `return (function(${params}) { ${body} })(input)`);
                            } else {
                                // 尝试其他方式
                                func = new Function('input', `return (${code})(input)`);
                            }
                        } else {
                            // 其他情况，假设是直接返回语句
                            func = new Function('input', `return (${code})`);
                        }
                        
                        actual = func(input);
                    } catch (err) {
                        throw new Error('代码执行错误: ' + err.message);
                    }
                    
                    const endTime = Date.now();
                    executionTime += (endTime - startTime);

                    // 确保结果是字符串并去除空格
                    if (actual !== null && actual !== undefined) {
                        actual = actual.toString().trim();
                    } else {
                        actual = '';
                    }

                    // 比较结果
                    if (actual === output.toString().trim()) {
                        passed = true;
                        score += 100 / testCases.length;
                    }
                } catch (err) {
                    errorMsg = err.message;
                    actual = `运行错误: ${err.message}`;
                    passed = false;
                    console.error(`测试用例 ${i + 1} 执行错误:`, err);
                }

                testCaseResults.push({
                        passed,
                        expected: output.toString().trim(),
                        actual,
                        test_case_order: i,
                        input: input.toString(),
                        error: errorMsg || null
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

        for (const testCaseResult of testCaseResults) {
            await TestCaseResult.create({
                ...testCaseResult,
                submission_id: submission.id
            });
        }
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

        if (submission.user_id !== req.userId) {
            return res.status(403).json({ message: '无权访问' });
        }

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

const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

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

// 创建新题目
router.post('/', async (req, res) => {
    try {
        // 这里应该添加管理员验证
        const { title, description, difficulty, category } = req.body;

        const newProblem = await Problem.create({
            title,
            description,
            difficulty,
            category
        });

        res.status(201).json({
            message: '题目创建成功',
            problem: newProblem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;

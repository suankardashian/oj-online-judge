const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');

// 获取竞赛列表
router.get('/', async (req, res) => {
    try {
        const { status = 'ongoing' } = req.query;
        const filter = { status };

        const contests = await Contest.find(filter)
            .sort({ startTime: -1 });

        res.status(200).json(contests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 获取单个竞赛详情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findById(id);

        if (!contest) {
            return res.status(404).json({ message: '竞赛不存在' });
        }

        res.status(200).json(contest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 创建竞赛
router.post('/', async (req, res) => {
    try {
        // 这里应该添加管理员验证
        const { title, description, startTime, endTime, problems } = req.body;

        // 计算竞赛状态
        const now = new Date();
        let status = 'upcoming';
        if (now >= startTime && now <= endTime) {
            status = 'ongoing';
        } else if (now > endTime) {
            status = 'ended';
        }

        const newContest = new Contest({
            title,
            description,
            startTime,
            endTime,
            status,
            problems
        });

        await newContest.save();

        res.status(201).json({
            message: '竞赛创建成功',
            contest: newContest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 更新竞赛状态（用于定时任务）
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findById(id);

        if (!contest) {
            return res.status(404).json({ message: '竞赛不存在' });
        }

        const now = new Date();
        let status = contest.status;

        if (now >= contest.startTime && now <= contest.endTime && status === 'upcoming') {
            status = 'ongoing';
        } else if (now > contest.endTime && status !== 'ended') {
            status = 'ended';
        }

        contest.status = status;
        await contest.save();

        res.status(200).json({
            message: '竞赛状态已更新',
            status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;

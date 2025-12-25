const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'db.json');
        this.data = this.loadData();
    }

    // 加载数据
    loadData() {
        try {
            const data = fs.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('读取数据库文件失败:', error);
            return { users: [], problems: [], submissions: [], contests: [] };
        }
    }

    // 保存数据
    saveData() {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('写入数据库文件失败:', error);
            return false;
        }
    }

    // 用户相关操作
    users = {
        // 创建用户
        create: (user) => {
            this.data.users.push(user);
            return this.saveData();
        },

        // 查找用户
        find: (filter) => {
            return this.data.users.find(user => {
                for (const key in filter) {
                    if (filter[key] !== user[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 查找所有用户
        findAll: (filter = {}) => {
            return this.data.users.filter(user => {
                for (const key in filter) {
                    if (filter[key] !== user[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 更新用户
        update: (id, updateData) => {
            const index = this.data.users.findIndex(user => user.id === id);
            if (index !== -1) {
                this.data.users[index] = { ...this.data.users[index], ...updateData };
                return this.saveData();
            }
            return false;
        },

        // 删除用户
        delete: (id) => {
            const index = this.data.users.findIndex(user => user.id === id);
            if (index !== -1) {
                this.data.users.splice(index, 1);
                return this.saveData();
            }
            return false;
        }
    };

    // 题目相关操作
    problems = {
        // 创建题目
        create: (problem) => {
            this.data.problems.push(problem);
            return this.saveData();
        },

        // 查找题目
        find: (filter) => {
            return this.data.problems.find(problem => {
                for (const key in filter) {
                    if (filter[key] !== problem[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 查找所有题目
        findAll: (filter = {}) => {
            return this.data.problems.filter(problem => {
                for (const key in filter) {
                    if (key === 'difficulty' && filter[key] && problem[key] !== filter[key]) {
                        return false;
                    }
                    if (key === 'category' && filter[key] && problem[key] !== filter[key]) {
                        return false;
                    }
                    if (key === 'search' && filter[key]) {
                        const search = filter[key].toLowerCase();
                        if (!problem.title.toLowerCase().includes(search) && 
                            !problem.description.toLowerCase().includes(search)) {
                            return false;
                        }
                    }
                }
                return true;
            });
        },

        // 更新题目
        update: (id, updateData) => {
            const index = this.data.problems.findIndex(problem => problem.id === id);
            if (index !== -1) {
                this.data.problems[index] = { ...this.data.problems[index], ...updateData };
                return this.saveData();
            }
            return false;
        },

        // 删除题目
        delete: (id) => {
            const index = this.data.problems.findIndex(problem => problem.id === id);
            if (index !== -1) {
                this.data.problems.splice(index, 1);
                return this.saveData();
            }
            return false;
        }
    };

    // 提交相关操作
    submissions = {
        // 创建提交
        create: (submission) => {
            this.data.submissions.push(submission);
            return this.saveData();
        },

        // 查找提交
        find: (filter) => {
            return this.data.submissions.find(submission => {
                for (const key in filter) {
                    if (filter[key] !== submission[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 查找所有提交
        findAll: (filter = {}) => {
            return this.data.submissions.filter(submission => {
                for (const key in filter) {
                    if (filter[key] !== submission[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 更新提交
        update: (id, updateData) => {
            const index = this.data.submissions.findIndex(submission => submission.id === id);
            if (index !== -1) {
                this.data.submissions[index] = { ...this.data.submissions[index], ...updateData };
                return this.saveData();
            }
            return false;
        },

        // 删除提交
        delete: (id) => {
            const index = this.data.submissions.findIndex(submission => submission.id === id);
            if (index !== -1) {
                this.data.submissions.splice(index, 1);
                return this.saveData();
            }
            return false;
        }
    };

    // 竞赛相关操作
    contests = {
        // 创建竞赛
        create: (contest) => {
            this.data.contests.push(contest);
            return this.saveData();
        },

        // 查找竞赛
        find: (filter) => {
            return this.data.contests.find(contest => {
                for (const key in filter) {
                    if (filter[key] !== contest[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 查找所有竞赛
        findAll: (filter = {}) => {
            return this.data.contests.filter(contest => {
                for (const key in filter) {
                    if (filter[key] !== contest[key]) {
                        return false;
                    }
                }
                return true;
            });
        },

        // 更新竞赛
        update: (id, updateData) => {
            const index = this.data.contests.findIndex(contest => contest.id === id);
            if (index !== -1) {
                this.data.contests[index] = { ...this.data.contests[index], ...updateData };
                return this.saveData();
            }
            return false;
        },

        // 删除竞赛
        delete: (id) => {
            const index = this.data.contests.findIndex(contest => contest.id === id);
            if (index !== -1) {
                this.data.contests.splice(index, 1);
                return this.saveData();
            }
            return false;
        }
    };
}

module.exports = new Database();

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Problem = sequelize.define('Problem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false
    },
    pass_rate: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    solved_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    attempt_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    test_cases: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '存储测试用例的JSON数组'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'problems',
    timestamps: false
});

module.exports = Problem;

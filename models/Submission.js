const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    problem_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'problems',
            key: 'id'
        }
    },
    code: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    language: {
        type: DataTypes.ENUM('javascript', 'python', 'java', 'cpp'),
        allowNull: false
    },
    result: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error'),
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    execution_time: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    memory_usage: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    submission_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'submissions'
});

module.exports = Submission;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TestCaseResult = sequelize.define('TestCaseResult', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    submission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'submissions',
            key: 'id'
        }
    },
    passed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    expected: {
        type: DataTypes.TEXT
    },
    actual: {
        type: DataTypes.TEXT
    },
    test_case_order: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'test_case_results'
});

module.exports = TestCaseResult;
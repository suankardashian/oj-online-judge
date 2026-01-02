const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '0054', 
  database: 'oj_platform',
  define: {
    //时间戳工具：创建时间和更新时间
    timestamps: true,
    //数据库中下划线命名的方式
    underscored: true
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testConnection();

module.exports = sequelize;
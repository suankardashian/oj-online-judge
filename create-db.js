const mysql = require('mysql2');

// 创建数据库连接（不指定数据库）
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0054'
});

connection.connect((err) => {
  if (err) {
    console.error('连接失败:', err);
    return;
  }
  console.log('连接成功！');
  
  // 创建数据库
  connection.query('CREATE DATABASE IF NOT EXISTS oj_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', (err, results) => {
    if (err) {
      console.error('创建数据库失败:', err);
    } else {
      console.log('数据库创建成功！');
      
      // 显示所有数据库
      connection.query('SHOW DATABASES;', (err, results) => {
        if (err) {
          console.error('查询数据库失败:', err);
        } else {
          console.log('可用数据库:', results.map(db => db.Database));
        }
        connection.end();
      });
    }
  });
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'oj_platform'
});

connection.connect((err) => {
  if (err) {
    console.error('连接失败:', err);
    console.error('错误代码:', err.code);
    console.error('错误号:', err.errno);
    console.error('SQL状态:', err.sqlState);
    console.error('SQL消息:', err.sqlMessage);
    return;
  }
  console.log('连接成功！');
  connection.end();
});

// 尝试不指定数据库连接
const connectionWithoutDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456'
});

connectionWithoutDb.connect((err) => {
  if (err) {
    console.error('无数据库连接失败:', err);
    return;
  }
  console.log('无数据库连接成功！');
  connectionWithoutDb.query('SHOW DATABASES;', (err, results) => {
    if (err) {
      console.error('查询数据库失败:', err);
    } else {
      console.log('可用数据库:', results.map(db => db.Database));
    }
    connectionWithoutDb.end();
  });
});

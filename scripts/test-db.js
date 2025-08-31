const mysql = require("mysql2/promise");

async function testDatabaseConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "", // 请填入你的MySQL密码
    database: "ai_chat_db",
  });

  try {
    console.log("✅ 数据库连接成功！");

    // 测试查询
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    console.log(`📊 用户表中共有 ${rows[0].count} 条记录`);

    // 查看用户数据
    const [users] = await connection.execute(
      "SELECT id, email, name, is_verified FROM users"
    );
    console.log("👥 用户列表:", users);
  } catch (error) {
    console.error("❌ 数据库操作失败:", error.message);
  } finally {
    await connection.end();
  }
}

testDatabaseConnection();

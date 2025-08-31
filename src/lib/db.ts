import mysql from "mysql2/promise";

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ai_chat",
  charset: "utf8mb4",
  timezone: "+08:00",
  // 连接池优化配置
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  // 连接重试配置
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 执行查询（返回多行）
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error("数据库查询错误:", { sql, params, error });
    throw new Error(
      `数据库查询失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

// 执行单行查询
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  try {
    const [rows] = await pool.execute(sql, params);
    const result = rows as T[];
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("数据库单行查询错误:", { sql, params, error });
    throw new Error(
      `数据库单行查询失败: ${
        error instanceof Error ? error.message : "未知错误"
      }`
    );
  }
}

// 执行插入/更新/删除操作
export async function execute(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  try {
    const [result] = await pool.execute(sql, params);
    return result as mysql.ResultSetHeader;
  } catch (error) {
    console.error("数据库执行错误:", { sql, params, error });
    throw new Error(
      `数据库执行失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

// 事务
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;

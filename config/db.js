const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  idleTimeout: 60000,
};

// Cache pool on globalThis to prevent creating new pools on every HMR reload
function getPool() {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool(dbConfig);
  }
  return global._mysqlPool;
}

const execQuery = async (query, arr) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(query, arr);
    return rows;
  } catch (err) {
    console.error("Error when executing query:", err.message);
    throw err;
  }
};

module.exports = { execQuery };

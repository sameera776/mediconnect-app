const mysql = require("mysql2");

console.log("🚀 Attempting to connect to MySQL...");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,         // ✅ from environment variables (Render)
  user: process.env.DB_USER,         // ✅ secure, not hardcoded
  password: process.env.DB_PASSWORD, // ✅ secure
  database: process.env.DB_NAME,     // ✅ selected DB
  port: process.env.DB_PORT || 3306, // ✅ fallback to default MySQL port
});

connection.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    return;
  }
  console.log("✅ MySQL connected");
});

module.exports = connection;

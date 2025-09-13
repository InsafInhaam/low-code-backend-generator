import pool from "./db.js";

const testConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ Database Connected! Test Query Result:", rows[0].result);
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
  }
};

testConnection();

import pool from "../config/db.js";

export const seedDatabase = async () => {
  try {
    // ✅ Create 'users' table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255),
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
    `);

    // ✅ Create 'roles' table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS roles(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) UNIQUE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ✅ Insert Default Roles
    await pool.query(`
      INSERT IGNORE INTO roles (name, description) VALUES
      ('admin', 'Administrator with full access'),
      ('user', 'Regular user with limited access')
    `);

    // ✅ Insert Default Admin User
    await pool.query(`
        INSERT IGNORE INTO users (name, email, password, role) VALUES ('Admin', 'admin@admin.com', 'admin123', 'admin')
    `);

    // ✅ Ensure `generated_models` table exists
    await pool.query(`
        CREATE TABLE IF NOT EXISTS generated_models (
            id INT AUTO_INCREMENT PRIMARY KEY,
            model_name VARCHAR(255) UNIQUE NOT NULL,
            icon_url VARCHAR(500),
            fields JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("✅ System tables initialized!");
  } catch (error) {
    console.error("❌ Error initializing system tables:", error);
  }
};

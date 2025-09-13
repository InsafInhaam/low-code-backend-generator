// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";

// dotenv.config();
// const prisma = new PrismaClient();

// export default prisma;

import "./dotenv.js";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "mycms",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

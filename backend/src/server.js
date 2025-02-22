import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
  }
};

startServer();

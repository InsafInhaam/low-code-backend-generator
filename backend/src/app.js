import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import modelRoutes from "./routes/model.routes.js";
import { errorhandler } from "./middleware/error.middleware.js";
import dynamicRoutes from "./routes/dynamic.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", modelRoutes);
app.use("/api", dynamicRoutes);

// Error Handler
app.use(errorhandler);

export default app;

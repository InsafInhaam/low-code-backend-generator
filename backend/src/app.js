import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import modelRoutes from "./routes/model.routes.js";
import { errorhandler } from "./middleware/error.middleware.js";
import dynamicRoutes from "./routes/dynamic.routes.js";
const app = express();
app.use(express.json());
app.use(cors());

/** ✅ Helper Function to Convert Prisma Types to SQL Types */
function getSQLType(prismaType) {
  const typeMapping = {
    String: "VARCHAR(255)",
    Int: "INT",
    Float: "FLOAT",
    Boolean: "BOOLEAN",
    DateTime: "DATETIME",
  };

  return typeMapping[prismaType] || "TEXT";
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", modelRoutes);
// app.use("/api", dynamicRoutes);

app.use(dynamicRoutes);

app.use(errorhandler);

export default app;

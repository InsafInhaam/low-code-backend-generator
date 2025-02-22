import express from "express";
import cors from "cors";
import dynamicRoutes from "./dynamicRoutes.js";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

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

/** ✅ Create a Model with Fields */
// app.post("/api/create-model", async (req, res) => {
//   const { name, fields } = req.body;
//   try {
//     const model = await prisma.model.create({
//       data: {
//         name,
//         fields: {
//           create: fields.map((field) => ({
//             name: field.name,
//             type: field.type,
//           })),
//         },
//       },
//     });
//     res.json({ success: true, model });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

/** ✅ Create a Model and Dynamically Generate Table */
app.post("/api/create-model", async (req, res) => {
  const { name, fields } = req.body;
  try {
    // Create the model entry in Prisma
    const model = await prisma.model.create({
      data: {
        name,
        fields: {
          create: fields.map((field) => ({
            name: field.name,
            type: field.type,
          })),
        },
      },
    });

    // ✅ Generate SQL Query to Create Table
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${name} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ${fields
            .map((field) => `${field.name} ${getSQLType(field.type)}`)
            .join(",\n")}
        )
      `;

    // Execute the query
    await prisma.$executeRawUnsafe(createTableSQL);

    res.json({ success: true, model });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating model", details: error.message });
  }
});

/** ✅ Fetch All Models */
app.get("/api/models", async (req, res) => {
  try {
    const models = await prisma.model.findMany({ include: { fields: true } });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ✅ Fetch Single Model */
app.get("/api/models/:id", async (req, res) => {
  try {
    const models = await prisma.model.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { fields: true },
    });

    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ✅ Delete Model */
app.delete("/api/models/:id", async (req, res) => {
  try {
    await prisma.field.deleteMany({
      where: { modelId: parseInt(req.params.id) },
    });
    await prisma.model.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(dynamicRoutes); // Load all dynamic routes

app.listen(5001, () => console.log("🚀 Server running on port 5001"));

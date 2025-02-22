import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/** ✅ Generate CRUD Routes for All Models */
async function generateCRUDRoutes() {
  const models = await prisma.model.findMany({ include: { fields: true } });

  models.forEach((model) => {
    const { name, fields } = model;
    const routeName = name.toLowerCase(); // Example: "product" -> "/api/product"

    /** 🔹 Create */
    router.post(`/api/${routeName}`, async (req, res) => {
      const data = req.body;
      try {
        const newRecord = await prisma.$executeRawUnsafe(
          `INSERT INTO ${routeName} (${fields.map((f) => f.name).join(", ")}) VALUES (${fields
            .map((f) => `'${data[f.name]}'`)
            .join(", ")})`
        );
        res.json({ success: true, newRecord });
      } catch (error) {
        res.status(500).json({ error: "Error creating record", details: error.message });
      }
    });

    /** 🔹 Read All */
    router.get(`/api/${routeName}`, async (req, res) => {
      try {
        const records = await prisma.$queryRawUnsafe(`SELECT * FROM ${routeName}`);
        res.json({ success: true, records });
      } catch (error) {
        res.status(500).json({ error: "Error fetching records", details: error.message });
      }
    });

    /** 🔹 Read One */
    router.get(`/api/${routeName}/:id`, async (req, res) => {
      try {
        const record = await prisma.$queryRawUnsafe(
          `SELECT * FROM ${routeName} WHERE id = ${Number(req.params.id)}`
        );
        res.json({ success: true, record });
      } catch (error) {
        res.status(500).json({ error: "Error fetching record", details: error.message });
      }
    });

    /** 🔹 Update */
    router.put(`/api/${routeName}/:id`, async (req, res) => {
      const data = req.body;
      try {
        const updateQuery = `UPDATE ${routeName} SET ${Object.keys(data)
          .map((key) => `${key} = '${data[key]}'`)
          .join(", ")} WHERE id = ${Number(req.params.id)}`;
        await prisma.$executeRawUnsafe(updateQuery);
        res.json({ success: true, message: "Record updated" });
      } catch (error) {
        res.status(500).json({ error: "Error updating record", details: error.message });
      }
    });

    /** 🔹 Delete */
    router.delete(`/api/${routeName}/:id`, async (req, res) => {
      try {
        await prisma.$executeRawUnsafe(`DELETE FROM ${routeName} WHERE id = ${Number(req.params.id)}`);
        res.json({ success: true, message: "Record deleted" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting record", details: error.message });
      }
    });
  });
}

generateCRUDRoutes();

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  createDymanicRoute,
  deleteDynamicRoute,
  readdAllDynamicRoute,
  readOneDynamicRoute,
  updateDynamicRoute,
} from "../controllers/dynamic.controller.js";

const router = express.Router();
const prisma = new PrismaClient();

/** ✅ Generate CRUD Routes for All Models */
async function generateCRUDRoutes() {
  const models = await prisma.model.findMany({ include: { fields: true } });

  models.forEach((model) => {
    const { name, fields } = model;
    const routeName = name.toLowerCase(); // Example: "product" -> "/api/product"

    /** 🔹 Create */
    router.post(`/api/${routeName}`, createDymanicRoute);

    /** 🔹 Read All */
    router.get(`/api/${routeName}`, readdAllDynamicRoute);

    /** 🔹 Read One */
    router.get(`/api/${routeName}/:id`, readOneDynamicRoute);

    /** 🔹 Update */
    router.put(`/api/${routeName}/:id`, updateDynamicRoute);

    /** 🔹 Delete */
    router.delete(`/api/${routeName}/:id`, deleteDynamicRoute);
  });
}

generateCRUDRoutes();

export default router;

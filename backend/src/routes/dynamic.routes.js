// const router = express.Router();
// const prisma = new PrismaClient();

// async function generateCRUDRoutes() {
//   const models = await prisma.model.findMany();

//   models.forEach((model) => {
//     const routeName = model.name.toLowerCase();

//     router.post(`/api/${routeName}`, (req, res) =>
//       createDymanicRoute(req, res, routeName)
//     );
//     router.get(`/api/${routeName}`, (req, res) =>
//       readdAllDynamicRoute(req, res, routeName)
//     );
//     router.get(`/api/${routeName}/:id`, (req, res) =>
//       readOneDynamicRoute(req, res, routeName)
//     );
//     router.put(`/api/${routeName}/:id`, (req, res) =>
//       updateDynamicRoute(req, res, routeName)
//     );
//     router.delete(`/api/${routeName}/:id`, (req, res) =>
//       deleteDynamicRoute(req, res, routeName)
//     );
//   });
// }

// generateCRUDRoutes();

// export default router;

import express from "express";
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getSingleRecord,
  updateRecord,
} from "../controllers/dynamic.controller.js";

const router = express.Router();

/** ✅ Generate Dynamic CRUD Routes */
router.post("/:model", createRecord);
router.get("/:model", getAllRecords);
router.get("/:model/:id", getSingleRecord);
router.put("/:model/:id", updateRecord);
router.delete("/:model/:id", deleteRecord);

export default router;

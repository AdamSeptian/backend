import express from "express";
import {
  getCatatan,
  getCatatanById,
  createCatatan,
  updateCatatan,
  deleteCatatan,
} from "../controllers/Catatan.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/catatan",verifyUser, getCatatan);
router.get("/catatan/:id",verifyUser, getCatatanById);
router.post("/catatan",verifyUser, createCatatan);
router.patch("/catatan/:id",verifyUser, updateCatatan);
router.delete("/catatan/:id",verifyUser, deleteCatatan);

export default router;

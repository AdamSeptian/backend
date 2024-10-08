import express from "express";
import { getFaq, getFaqById, createFaq, updateFaq, deleteFaq } from "../controllers/Faq.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/faq", getFaq);
router.get("/faq/:id",verifyUser, adminOnly, getFaqById);
router.post("/faq",verifyUser, adminOnly, createFaq);
router.patch("/faq/:id",verifyUser, adminOnly, updateFaq);
router.delete("/faq/:id",verifyUser, adminOnly, deleteFaq);

export default router;

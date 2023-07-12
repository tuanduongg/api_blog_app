import express from "express";
import { commentController } from "../controllers/index.js";
import { verifyToken,canDistroyPost } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", commentController.getByIdPost);
router.post("/create", verifyToken, commentController.create);
router.post("/update", verifyToken, commentController.update);
router.post("/delete", verifyToken, commentController.distroy);
// router.put("/update", verifyToken, commentController.update);
// router.delete("/delete", [verifyToken,canDistroyPost], commentController.distroy);

export default router;

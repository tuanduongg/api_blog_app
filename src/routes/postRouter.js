import express from "express";
import { postController } from "../controllers/index.js";
import { verifyToken,canDistroyPost } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", postController.getAll);
router.post("/create", verifyToken, postController.create);
router.put("/update", verifyToken, postController.update);
router.delete("/delete", [verifyToken,canDistroyPost], postController.distroy);

export default router;

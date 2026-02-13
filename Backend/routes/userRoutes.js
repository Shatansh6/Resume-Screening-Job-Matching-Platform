import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadResume } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;

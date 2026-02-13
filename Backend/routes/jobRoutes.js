import express from "express";
import { createJob } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getAllJobs } from "../controllers/jobController.js";
import { getRecommendedJobs } from "../controllers/jobController.js";
// import { getMyPostedJobs } from "../controllers/jobController.js";
const router = express.Router();

router.post("/create", protect, adminOnly, createJob);
router.get("/", getAllJobs);
router.get("/recommended", protect, getRecommendedJobs);
// router.get("/my-jobs", protect, adminOnly, getMyPostedJobs);

export default router;

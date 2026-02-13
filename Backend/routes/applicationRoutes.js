import express from "express";
import {
  applyForJob,
  getMyApplications,
  getAllApplications,
  getApplicationsByJob,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";
const router = express.Router();

router.post("/apply", protect, applyForJob);
router.get("/my-applications", protect, getMyApplications);
router.get("/all", protect, getAllApplications);
router.patch(
  "/status/:applicationId",
  protect,
  adminOnly,
  updateApplicationStatus,
);
router.get("/job/:jobId", protect, adminOnly, getApplicationsByJob);

export default router;

import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateMatch } from "../utils/matchingLogic.js";
import { screenResume } from "../services/screeningEngine.js";

/* =========================================================
   APPLY FOR JOB (MATCHING + SCREENING)
   ========================================================= */
export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const alreadyApplied = await Application.findOne({
    user: req.user._id,
    job: jobId,
  });

  if (alreadyApplied) {
    throw new ApiError(400, "You already applied for this job");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  /* ---------------- MATCHING ---------------- */
  const matchResult = calculateMatch(
    user.skills,
    job.skillsRequired
  );

  /* ---------------- SCREENING ---------------- */
  const screening = screenResume({
    resume: {
      skills: user.skills,
      experience: user.experience || 0,
    },
    job,
    matchResult,
  });

  /* ---------------- CREATE APPLICATION ---------------- */
  const application = await Application.create({
    user: req.user._id,
    job: jobId,

    status: "Applied",

    matchPercentage: matchResult.matchPercentage,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,

    screeningStatus: screening.status,
    screeningReasons: screening.reasons,
  });

  const populatedApplication = await Application.findById(application._id)
    .populate("job", "title company")
    .populate("user", "name email");

  res.status(201).json({
    success: true,
    message:
      screening.status === "REJECTED"
        ? "Application submitted but did not pass screening"
        : "Application submitted successfully",
    application: populatedApplication,
  });
});

/* =========================================================
   USER APPLICATIONS
   ========================================================= */
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    user: req.user._id,
  }).populate("job");

  res.status(200).json({
    success: true,
    data: applications,
  });
});

/* =========================================================
   ADMIN: ALL APPLICATIONS (SORTED BY MATCH)
   ========================================================= */
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("user", "name email")
    .populate("job", "title company")
    .sort({ matchPercentage: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

/* =========================================================
   ADMIN: UPDATE APPLICATION STATUS (MANUAL REVIEW)
   ========================================================= */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!["Reviewed", "Rejected", "Selected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  application.status = status;
  await application.save();

  res.status(200).json({
    success: true,
    message: `Application ${status} successfully`,
    application,
  });
});

/* =========================================================
   ADMIN: APPLICATIONS BY JOB (WITH SCREENING DATA)
   ========================================================= */
export const getApplicationsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const applications = await Application.find({ job: jobId })
    .populate("user", "name email skills experience")
    .populate("job", "title company")
    .sort({ matchPercentage: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

/* =========================================================
   USER: JOBS POSTED BY ME
   ========================================================= */
export const getMyPostedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    createdBy: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    jobs,
  });
});

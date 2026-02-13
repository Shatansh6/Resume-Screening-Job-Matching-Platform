import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";
import { calculateMatch } from "../utils/matchingLogic.js";

// APPLY FOR JOB
export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // ✅ Correct duplicate check
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

  // ✅ Correct match calculation
  const {
    matchPercentage,
    matchedSkills,
    missingSkills,
  } = calculateMatch(user.skills, job.skillsRequired);

  // ✅ Correct application creation
  const application = await Application.create({
    job: jobId,
    user: req.user._id,
    status: "Applied",
    matchPercentage,
    matchedSkills,
    missingSkills,
  });

  const populatedApplication = await Application.findById(application._id)
    .populate("job", "title company")
    .populate("user", "name email");

  res.status(201).json({
    success: true,
    message: "Job applied successfully",
    application: populatedApplication,
  });
});


// USER APPLICATIONS
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    user: req.user._id,
  }).populate("job");

  res.status(200).json({
    success: true,
    data: applications,
  });
});

// ADMIN APPLICATIONS
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("user", "name email")
    .populate("job", "title company")

    // ⭐ AI Sorting
    .sort({ matchPercentage: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

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
    message: `Application ${status} successfull`,
    application,
  });
});

export const getApplicationsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const applications = await Application.find({ job: jobId })
    .populate("user", "name email skills")
    .populate("job", "title company")

    // ⭐ AI sorting
    .sort({ matchPercentage: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});
export const getMyPostedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    jobs,
  });
});

export const applyJob = async (req, res) => {
  const user = await User.findById(req.user._id);
  const job = await Job.findById(req.params.jobId);

  const match = calculateMatch(user.skills, job.skillsRequired);

  const application = await Application.create({
    user: user._id,
    job: job._id,
    matchPercentage: match.matchPercentage,
  });

  res.json({
    success: true,
    matchPercentage: match.matchPercentage,
  });
};

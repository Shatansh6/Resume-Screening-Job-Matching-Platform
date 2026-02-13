import Job from "../models/Job.js";
import {ApiError }from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { calculateMatch } from "../utils/matchingLogic.js";


export const createJob = asyncHandler(async (req, res) => {
  const { title, company, description, skillsRequired, experience } = req.body;

  if (!title || !company || !description || !skillsRequired || !experience) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.create({
    title,
    company,
    description,
    skillsRequired,
    experience,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    job,
  });
});
export const getAllJobs = asyncHandler(async (req, res) => {
    console.log("🔥 GET /api/jobs HIT");

  const jobs = await Job.find().lean(); 

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});


export const getRecommendedJobs = async (req, res) => {
  const user = await User.findById(req.user._id);
console.log("User skills:", user.skills);

  if (!user || !user.skills.length) {
    return res.status(400).json({
      message: "Upload resume first",
    });
  }

const jobs = await Job.find({});

 const recommendations = jobs
  .map(job => {
    const match = calculateMatch(
      user.skills,
      job.skillsRequired
    );

    return {
      _id: job._id,
      title: job.title,
      company: job.company,
      skillsRequired: job.skillsRequired,
      description: job.description,
      matchPercentage: match.matchPercentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
    };
  })
  .sort((a, b) => b.matchPercentage - a.matchPercentage);


  res.json({
    success: true,
    jobs: recommendations,
  });
};

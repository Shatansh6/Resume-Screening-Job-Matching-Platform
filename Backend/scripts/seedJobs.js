import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";

dotenv.config();

const jobs = [
  {
    title: "Backend Developer",
    company: "Google",
    description: "Build scalable Node.js APIs and backend services.",
    skillsRequired: ["Node", "MongoDB", "JavaScript"],
    experience: 2,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "Frontend Developer",
    company: "Meta",
    description: "Develop modern React-based user interfaces.",
    skillsRequired: ["React", "JavaScript", "CSS"],
    experience: 1,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "Full Stack Developer",
    company: "Amazon",
    description: "Work on end-to-end web applications using MERN stack.",
    skillsRequired: ["Node", "React", "MongoDB"],
    experience: 3,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "Software Engineer",
    company: "Microsoft",
    description: "Design scalable software solutions.",
    skillsRequired: ["Java", "DSA"],
    experience: 2,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "Data Analyst",
    company: "Netflix",
    description: "Analyze datasets and generate insights.",
    skillsRequired: ["SQL", "Python", "Excel"],
    experience: 1,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "DevOps Engineer",
    company: "Amazon",
    description: "Manage CI/CD and cloud infra.",
    skillsRequired: ["AWS", "Docker", "Linux"],
    experience: 3,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "Mobile App Developer",
    company: "Uber",
    description: "Build Android applications.",
    skillsRequired: ["Java", "Android"],
    experience: 2,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "ML Engineer",
    company: "OpenAI",
    description: "Develop ML pipelines.",
    skillsRequired: ["Python", "Machine Learning"],
    experience: 2,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "Cybersecurity Analyst",
    company: "Cisco",
    description: "Secure enterprise systems.",
    skillsRequired: ["Networking", "Security", "Linux"],
    experience: 2,
    createdBy: process.env.ADMIN_ID
  },
  {
    title: "QA Engineer",
    company: "Infosys",
    description: "Test and validate applications.",
    skillsRequired: ["Testing", "Selenium"],
    experience: 1,
    createdBy: process.env.ADMIN_ID
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Job.deleteMany();
  await Job.insertMany(jobs);
  console.log("10 jobs inserted");
  process.exit();
}

seed();
 
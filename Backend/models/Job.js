import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Internship", "Contract"],
    },
    location: {
      type: String,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Job", jobSchema);

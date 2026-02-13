import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Rejected", "Selected"],
      default: "Applied",
    },

    // ⭐ Optional for old records
    matchPercentage: {
      type: Number,
      default: null,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* ⭐ Prevent duplicate applications */
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);

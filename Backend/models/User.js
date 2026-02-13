import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    jobRole: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      min: 0,
      max: 50,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

   role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

    resume: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
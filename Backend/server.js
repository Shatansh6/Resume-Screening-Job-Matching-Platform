import "./config/env.js";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express(); // ✅ CREATE APP FIRST

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman / curl / server-side
    if (!origin) return callback(null, true);

    // Allow localhost (dev)
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // Allow ALL Vercel deployments (prod + preview)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // ❗ DO NOT throw error — just deny
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // REQUIRED for preflight

// ✅ Body parser
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { applyToJob } from "../services/application.service";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import Toast from "./ui/Toast";

export default function JobDetailsPanel({ job, onClose }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  if (!job) return null;

  const handleApply = async () => {
    if (!user) {
      setToast({ message: "Please login to apply", type: "error" });
      return;
    }

    if (!user.hasResume) {
      setToast({ message: "Upload resume to apply", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await applyToJob(job._id);
      setToast({ message: "Applied successfully", type: "success" });
    } catch {
      setToast({
        message: "You already applied for this job",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg h-full bg-white flex flex-col animate-slideIn">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xl text-gray-500"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <p className="text-gray-500">
            {job.company} • {job.location || "Remote"}
          </p>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="font-medium mb-2">Job Description</h4>
            <p className="text-sm text-gray-600">{job.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Experience required:{" "}
            <span className="font-medium">{job.experience}+ years</span>
          </p>
        </div>

        {/* STICKY FOOTER */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <button
            onClick={handleApply}
            disabled={loading}
            className="w-full py-3 rounded-full bg-black text-white disabled:opacity-50"
          >
            {loading ? "Applying…" : "Apply for this job"}
          </button>
        </div>
      </div>
    </div>
  );
}

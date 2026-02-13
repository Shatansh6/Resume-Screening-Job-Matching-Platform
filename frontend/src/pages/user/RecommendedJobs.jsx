import { useEffect, useState } from "react";
import { getRecommendedJobs } from "../../services/job.service";
import { applyToJob } from "../../services/application.service";
import Toast from "../../components/ui/Toast";
import { Link } from "react-router-dom";

function MatchTooltip() {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 text-xs bg-white border border-gray-200 rounded-lg p-3 shadow-sm z-10">
      <p className="font-medium mb-1">How skill match is calculated</p>
      <p className="text-gray-600">
        Based on how many required job skills are found in your resume.
      </p>
      <p className="mt-2 text-gray-500">
        Formula: (Matched Skills ÷ Required Skills) × 100
      </p>
    </div>
  );
}

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getRecommendedJobs();
        setJobs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);
      await applyToJob(jobId);

      setJobs((prev) =>
        prev.map((item) =>
          (item.job?._id || item._id) === jobId
            ? { ...item, applicationStatus: "Applied" }
            : item
        )
      );

      setToast({ message: "Applied successfully", type: "success" });
    } catch {
      setToast({ message: "You already applied to this job", type: "error" });
    } finally {
      setApplyingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-700";
      case "Selected":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Finding the best matches for your resume…
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="p-10 text-center">
        <p className="text-lg font-medium mb-2">
          No matching jobs found
        </p>
        <p className="text-sm text-gray-500">
          Try updating your resume or skills.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Jobs Matched to Your Skills
        </h2>

        <Link
          to="/user/applications"
          className="text-sm text-blue-600 hover:underline"
        >
          View My Applications →
        </Link>
      </div>

      {jobs.map((item) => {
        const job = item.job || item;

        return (
          <div
            key={job._id}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>

              {item.applicationStatus ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    item.applicationStatus
                  )}`}
                >
                  {item.applicationStatus}
                </span>
              ) : (
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={applyingId === job._id}
                  className="px-4 py-2 rounded-full bg-black text-white text-sm disabled:opacity-50"
                >
                  {applyingId === job._id ? "Applying…" : "Apply"}
                </button>
              )}
            </div>

            {/* Match */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <div className="relative group">
                  <span className="text-sm text-gray-500 cursor-help">
                    Skill Match ⓘ
                  </span>
                  <div className="hidden group-hover:block">
                    <MatchTooltip />
                  </div>
                </div>
                <span className="font-semibold">
                  {item.matchPercentage}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${item.matchPercentage}%` }}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {item.matchedSkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800"
                >
                  {skill}
                </span>
              ))}

              {item.missingSkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            {item.applicationStatus && (
              <p className="text-xs text-gray-400 mt-3">
                You’ll be notified when the application status changes.
              </p>
            )}
          </div>
        );
      })}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}

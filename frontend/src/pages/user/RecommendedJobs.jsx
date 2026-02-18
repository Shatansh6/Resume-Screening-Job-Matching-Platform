import { useEffect, useState } from "react";
import { getRecommendedJobs } from "../../services/job.service";
import { applyToJob } from "../../services/application.service";
import Toast from "../../components/ui/Toast";
import { Link } from "react-router-dom";
import AnimatedCircularProgress from "../../components/ui/AnimatedCircularProgress";

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecommendedJobs();
        setJobs(data || []);
      } finally {
        setLoading(false);
      }
    })();
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
      setToast({ message: "You already applied", type: "error" });
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Finding best matches…
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="p-10 text-center">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm text-gray-500">
          Improve your resume or skills
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Recommended Jobs
        </h2>
        <Link
          to="/user/applications"
          className="text-sm text-blue-600 hover:underline"
        >
          View Applications →
        </Link>
      </div>

      {jobs.map((item, idx) => {
        const job = item.job || item;

        return (
          <div
            key={job._id}
            className="bg-white border border-gray-200
                       rounded-2xl p-4 sm:p-6 animate-fade-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="grid grid-cols-12 gap-6">
              {/* LEFT */}
              <div className="col-span-12 md:col-span-8 space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {job.company}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    📍 {job.location || "Remote"} · 💼{" "}
                    {job.experience || "0–2"} yrs
                  </p>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {job.description || "No description available"}
                </p>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex flex-wrap gap-3 pt-2">
                  {item.applicationStatus ? (
                    <span
                      className="px-4 py-2 rounded-full
                                 bg-green-100 text-green-700 text-sm"
                    >
                      {item.applicationStatus}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={applyingId === job._id}
                        className="px-5 py-2 rounded-full
                                   bg-blue-600 text-white text-sm
                                   disabled:opacity-50"
                      >
                        {applyingId === job._id
                          ? "Applying…"
                          : "Apply"}
                      </button>

                      <button
                        className="px-5 py-2 rounded-full
                                   border border-gray-300 text-sm"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT – MATCH PANEL */}
              <div
                className="col-span-12 md:col-span-4
                           md:border-l border-gray-200 md:pl-6"
              >
                <div className="flex md:block gap-4 md:gap-0 md:space-y-4">
                  <AnimatedCircularProgress
                    percentage={item.matchPercentage}
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      {item.matchPercentage >= 80
                        ? "Strong Match"
                        : item.matchPercentage >= 60
                        ? "Moderate Match"
                        : "Low Match"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Based on your resume
                    </p>

                    <div className="text-xs mt-3 space-y-1">
                      <p className="font-medium mb-1">
                        Why this job?
                      </p>

                      {item.matchedSkills?.map((s) => (
                        <p key={s} className="text-green-600">
                          ✓ {s}
                        </p>
                      ))}

                      {item.missingSkills?.map((s) => (
                        <p key={s} className="text-gray-400">
                          ✗ {s}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="mt-4 flex gap-3 md:hidden">
                  {item.applicationStatus ? (
                    <span
                      className="px-4 py-2 rounded-full
                                 bg-green-100 text-green-700 text-sm"
                    >
                      {item.applicationStatus}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={applyingId === job._id}
                        className="flex-1 px-4 py-2 rounded-full
                                   bg-blue-600 text-white text-sm
                                   disabled:opacity-50"
                      >
                        {applyingId === job._id
                          ? "Applying…"
                          : "Apply"}
                      </button>

                      <button
                        className="flex-1 px-4 py-2 rounded-full
                                   border border-gray-300 text-sm"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
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

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
      <div className="p-8 sm:p-10 text-center text-[rgb(var(--text-muted))]">
        Finding best matches…
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="p-8 sm:p-10 text-center">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Improve your resume or skills
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Recommended Jobs
        </h2>
        <Link
          to="/user/applications"
          className="text-sm text-[rgb(var(--primary))] hover:underline"
        >
          View Applications →
        </Link>
      </div>

      {jobs.map((item, idx) => {
        const job = item.job || item;

        return (
          <div
            key={job._id}
            className="bg-white
                       border border-[rgb(var(--border))]
                       rounded-2xl p-4 sm:p-6
                       animate-fade-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              {/* LEFT */}
              <div className="col-span-12 md:col-span-8 space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {job.title}
                  </h3>

                  <p className="text-sm text-[rgb(var(--text-muted))]">
                    {job.company}
                  </p>

                  <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                    📍 {job.location || "Remote"} · 💼{" "}
                    {job.experience || "0–2"} yrs · 🕒 Full-time
                  </p>
                </div>

                {job.salary && (
                  <p className="text-sm font-medium">
                    💰 {job.salary}
                  </p>
                )}

                <p className="text-sm text-[rgb(var(--text-muted))] line-clamp-3">
                  {job.description || "No description available"}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {item.applicationStatus ? (
                    <span
                      className="px-4 py-2 rounded-full
                                 bg-[rgb(var(--primary-soft))]
                                 text-[rgb(var(--primary))]
                                 text-sm"
                    >
                      {item.applicationStatus}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={applyingId === job._id}
                        className="px-5 py-2 rounded-full
                                   bg-[rgb(var(--primary))]
                                   text-white text-sm
                                   hover:bg-blue-700
                                   disabled:opacity-50
                                   transition"
                      >
                        {applyingId === job._id ? "Applying…" : "Apply"}
                      </button>

                      <button
                        className="px-5 py-2 rounded-full
                                   border border-[rgb(var(--border))]
                                   hover:bg-[rgb(var(--bg-soft))]
                                   text-sm transition"
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
                           md:border-l border-[rgb(var(--border))]
                           md:pl-6"
              >
                <div className="flex md:block items-center md:items-start gap-4 md:gap-0 md:space-y-4">
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
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      Based on your resume
                    </p>

                    <div className="text-xs mt-3 space-y-1">
                      <p className="font-medium mb-1">
                        Why this job?
                      </p>

                      {item.matchedSkills?.map((s) => (
                        <p
                          key={s}
                          className="text-[rgb(var(--accent))]"
                        >
                          ✓ {s}
                        </p>
                      ))}

                      {item.missingSkills?.map((s) => (
                        <p
                          key={s}
                          className="text-[rgb(var(--text-muted))]"
                        >
                          ✗ {s}
                        </p>
                      ))}
                    </div>
                  </div>
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

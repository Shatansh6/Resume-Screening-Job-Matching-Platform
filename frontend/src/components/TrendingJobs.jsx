import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicJobs } from "../services/job.service";
import { applyToJob } from "../services/application.service";
import { useAuth } from "../auth/AuthContext";

export default function TrendingJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getPublicJobs();
        setJobs(data.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.hasResume) {
      navigate("/");
      return;
    }

    try {
      setApplyingId(jobId);
      await applyToJob(jobId);
      alert("Applied successfully");
    } catch {
      alert("Already applied or error occurred");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-[rgb(var(--text-muted))]">
        Loading trending jobs...
      </p>
    );
  }
  const getCardBg = (index) => {
    if (index === 0) return "bg-[rgb(234,248,200)]"; // soft green
    if (index === 1) return "bg-[rgb(232,240,255)]"; // soft blue
    if (index === 2) return "bg-[rgb(243,244,246)]"; // soft gray
    return "bg-white";
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-semibold text-[rgb(var(--text-dark))]">
          Trending Jobs
        </h3>

        <button
          onClick={() => navigate("/jobs")}
          className="text-sm text-[rgb(var(--text-dark))] hover:underline"
        >
          See All Jobs
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
  <div
    key={job._id}
    className={`rounded-2xl p-6 flex flex-col justify-between transition
      ${getCardBg(index)} border border-transparent`}
  >
    <div>
      <h4 className="font-semibold text-lg mb-1 text-[rgb(var(--text-dark))]">
        {job.title}
      </h4>

      <p className="text-sm text-[rgb(var(--text-muted))] mb-3">
        {job.company}
      </p>

      <p className="text-sm text-[rgb(var(--text-muted))] line-clamp-3">
        {job.description}
      </p>
    </div>

    <button
      onClick={() => handleApply(job._id)}
      disabled={applyingId === job._id}
      className="mt-6 py-2 rounded-full border border-gray-300 text-black
                 hover:bg-[rgb(var(--primary))] hover:border-transparent
                 transition disabled:opacity-50"
    >
      {!user
        ? "Login to Apply"
        : !user.hasResume
        ? "Upload Resume"
        : applyingId === job._id
        ? "Applying..."
        : "Apply Now"}
    </button>
  </div>
))}

      </div>
    </section>
  );
}

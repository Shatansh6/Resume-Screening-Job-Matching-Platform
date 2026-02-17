import { useEffect, useRef, useState } from "react";
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
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Fetch jobs
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

  // Reveal animation on scroll (ONCE)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
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

  const getCardBg = (index) => {
    if (index === 0) return "bg-[rgb(234,248,200)]";
    if (index === 1) return "bg-[rgb(232,240,255)]";
    if (index === 2) return "bg-[rgb(243,244,246)]";
    return "bg-white";
  };

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-6 pt-8"
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center mb-8 transition-all
          ${visible ? "animate-fade-up" : "opacity-0"}`}
      >
        <h3 className="text-xl font-semibold text-[rgb(var(--text-dark))]">
          Trending Jobs
        </h3>

        <button
          onClick={() => navigate("/jobs")}
          className="text-sm hover:underline"
        >
          See All Jobs
        </button>
      </div>

      {/* Skeleton Loader */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 h-56 bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Job Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div
              key={job._id}
              className={`rounded-2xl p-6 flex flex-col justify-between
                transition-all duration-300 border border-transparent
                hover:-translate-y-1 hover:shadow-lg
                ${getCardBg(index)}
                ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div>
                <h4 className="font-semibold text-lg mb-1">
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
                className="mt-6 py-2 rounded-full border border-gray-300
                           hover:bg-[rgb(var(--primary))]
                           hover:border-transparent transition
                           disabled:opacity-50"
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
      )}
    </section>
  );
}
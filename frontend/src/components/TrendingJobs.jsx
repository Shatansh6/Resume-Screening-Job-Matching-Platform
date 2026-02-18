import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicJobs } from "../services/job.service";
import { applyToJob } from "../services/application.service";
import { useAuth } from "../auth/AuthContext";
import AuthModal from "../auth/AuthModel";

export default function TrendingJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* ---------------- FETCH ---------------- */

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

  /* ---------------- ANIMATION ---------------- */

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

  /* ---------------- APPLY ---------------- */

  const handleApply = async (jobId) => {
    if (!user) {
      setShowAuth(true);
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

  return (
    <>
      <section
        ref={sectionRef}
        className="max-w-7xl mx-auto
                   px-4 sm:px-6
                   pt-10 sm:pt-12"
      >
        {/* HEADER */}
        <div
          className={`flex flex-col sm:flex-row
            justify-between items-start sm:items-center
            gap-2 sm:gap-0
            mb-6 sm:mb-8 transition-all
            ${visible ? "animate-fade-up" : "opacity-0"}`}
        >
          <h3 className="text-lg sm:text-xl font-semibold">
            Trending Jobs
          </h3>

          <button
            onClick={() => navigate("/jobs")}
            className="text-sm
                       text-[rgb(var(--primary))]
                       hover:underline"
          >
            See All Jobs
          </button>
        </div>

        {/* LOADER */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 h-52 sm:h-56
                           bg-[rgb(var(--bg-soft))]
                           animate-pulse"
              />
            ))}
          </div>
        )}

        {/* JOB CARDS */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map((job, index) => (
              <div
                key={job._id}
                className={`rounded-2xl p-5 sm:p-6
                  flex flex-col justify-between
                  bg-white border border-[rgb(var(--border))]
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                  ${visible ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div>
                  <h4 className="font-semibold text-base sm:text-lg mb-1">
                    {job.title}
                  </h4>

                  <p className="text-sm text-[rgb(var(--text-muted))] mb-2">
                    {job.company}
                  </p>

                  <p className="text-sm text-[rgb(var(--text-muted))] line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={applyingId === job._id}
                  className="mt-4 py-2.5 rounded-full
                             border border-[rgb(var(--border))]
                             hover:bg-[rgb(var(--primary))]
                             hover:text-white
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
        )}
      </section>

      {/* AUTH POPUP */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </>
  );
}

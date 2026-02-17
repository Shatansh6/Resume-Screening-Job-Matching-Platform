import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicJobs } from "../services/job.service";
import { applyToJob } from "../services/application.service";
import { useAuth } from "../auth/AuthContext";
import Toast from "../components/ui/Toast";

const JOBS_PER_PAGE = 4;

export default function AllJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [toast, setToast] = useState({ message: "", type: "" });

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getPublicJobs();
        setJobs(data || []);
      } catch {
        setToast({ message: "Failed to load jobs", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const loc = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const skills =
        job.skillsRequired?.map((s) => s.toLowerCase()) || [];
      const jobLocation = job.location?.toLowerCase() || "";

      const matchesSearch =
        !q ||
        title.includes(q) ||
        company.includes(q) ||
        skills.some((s) => s.includes(q));

      const matchesLocation =
        !loc || jobLocation.includes(loc);

      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  /* ---------------- PAGINATION ---------------- */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  /* ---------------- APPLY ---------------- */

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
      setAppliedJobs((prev) => new Set(prev).add(jobId));
      setToast({ message: "Applied successfully", type: "success" });
    } catch {
      setToast({
        message: "You have already applied to this job",
        type: "error",
      });
    } finally {
      setApplyingId(null);
    }
  };

  /* ---------------- LOADING (SKELETON) ---------------- */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-60 rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-6 animate-fade-up">
      {/* SEARCH */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title, company, skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full sm:w-60 px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* EMPTY STATE */}
      {filteredJobs.length === 0 && (
        <div className="py-16 text-center animate-fade-up">
          <h2 className="text-xl font-semibold">No jobs found</h2>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your search or location filters.
          </p>
        </div>
      )}

      {/* JOB CARDS */}
      {filteredJobs.length > 0 && (
        <>
          <div
            key={currentPage}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {currentJobs.map((job, index) => (
              <div
                key={job._id}
                style={{ animationDelay: `${index * 0.08}s` }}
                className="bg-white border border-gray-200 rounded-2xl p-6
                           flex flex-col hover:shadow-lg hover:-translate-y-0.5
                           transition-all animate-fade-up"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {job.company} • {job.location || "Remote"}
                  </p>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skillsRequired?.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs rounded-full
                                   bg-gray-100 text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    Experience:{" "}
                    <span className="font-medium">
                      {job.experience}+ years
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={
                    applyingId === job._id ||
                    appliedJobs.has(job._id)
                  }
                  className="mt-6 w-full py-2 rounded-lg text-sm font-medium
                             bg-black text-white disabled:opacity-50"
                >
                  {!user
                    ? "Login to Apply"
                    : !user.hasResume
                    ? "Upload Resume to Apply"
                    : appliedJobs.has(job._id)
                    ? "Applied"
                    : applyingId === job._id
                    ? "Applying…"
                    : "Apply"}
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}
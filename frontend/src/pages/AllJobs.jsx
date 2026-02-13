import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicJobs } from "../services/job.service";
import { applyToJob } from "../services/application.service";
import { useAuth } from "../auth/AuthContext";
import Toast from "../components/ui/Toast";

const JOBS_PER_PAGE = 6;

export default function AllJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getPublicJobs();
        setJobs(data);
      } catch {
        setToast({ message: "Failed to load jobs", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

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

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading available jobs…
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No jobs available at the moment.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">
      {/* SEARCH BAR */}
{/* SEARCH BAR */}
<div className="sticky top-[69px] z-40 bg-white border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-6">
    {/* Height-locked container */}
    <div className="h-[72px] flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-3 w-full max-w-4xl">
        {/* Job search */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Job title or keyword"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Location */}
        <div className="flex items-center gap-2 w-48">
          <span className="text-gray-400">📍</span>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

        {/* Search button */}
        <button
          className="ml-3 px-6 py-2 rounded-full bg-lime-400 text-black text-sm font-medium hover:bg-lime-500 transition"
        >
          Search
        </button>
      </div>
    </div>
  </div>
</div>



      {/* JOB LIST */}
<div className="mt-6 space-y-6">
        {currentJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500 mb-1">
                {job.company} • {job.location || "Remote"}
              </p>

              <p className="text-sm text-gray-600 mt-3 mb-4">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Experience Required:{" "}
                <span className="font-medium">{job.experience}+ years</span>
              </p>
            </div>

            <button
              onClick={() => handleApply(job._id)}
              disabled={applyingId === job._id}
              className="mt-6 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              {!user
                ? "Login to Apply"
                : !user.hasResume
                  ? "Upload Resume to Apply"
                  : applyingId === job._id
                    ? "Applying…"
                    : "Apply"}
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-black text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}

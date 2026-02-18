import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ITEMS_PER_PAGE = 5;

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs");
        setJobs(res.data.jobs || res.data.data || []);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      return title.includes(q) || company.includes(q);
    });
  }, [jobs, search]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ---------------- LOADING (SKELETON) ---------------- */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 space-y-4 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-6 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Openings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Admin overview of all posted jobs
          </p>
        </div>

        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="Search by title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50
                       px-4 py-2 text-sm focus:bg-white
                       focus:border-indigo-500 focus:ring-1
                       focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {!jobs.length && (
        <div className="py-20 text-center text-gray-400">
          No jobs created yet
        </div>
      )}

      {/* SEARCH EMPTY */}
      {jobs.length > 0 && !filteredJobs.length && (
        <div className="py-20 text-center text-gray-400">
          No jobs match your search
        </div>
      )}

      {/* JOB LIST */}
      {!!paginatedJobs.length && (
        <div className="space-y-3">
          {paginatedJobs.map((job, index) => {
            const applicationCount =
              job.applicationCount ??
              job.applicationsCount ??
              job.applications?.length ??
              0;

            return (
              <div
                key={job._id}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="group flex items-center justify-between
                           rounded-2xl border border-gray-200 bg-white
                           px-6 py-5 transition-all
                           hover:shadow-md hover:-translate-y-[2px]
                           animate-fade-up"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.company}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <span className="rounded-full bg-gray-100
                                   px-3 py-1 text-xs font-semibold
                                   text-gray-700">
                    {applicationCount} Applications
                  </span>

                  <Link
                    to={`/admin/jobs/${job._id}/applications`}
                    className="flex items-center gap-2 text-sm
                               font-medium text-indigo-600
                               transition-all group-hover:gap-3"
                  >
                    View <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pt-6 flex justify-center items-center gap-4">
          <button
            onClick={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
            disabled={currentPage === 1}
            className="rounded-lg border px-3 py-1
                       text-sm disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="rounded-lg border px-3 py-1
                       text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
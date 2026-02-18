import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ITEMS_PER_PAGE = 4;

const STATUS_FILTERS = [
  "All",
  "Applied",
  "Reviewed",
  "Selected",
  "Rejected",
];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        setApplications(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  /* ---------------- RESET PAGE ---------------- */

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  /* ---------------- STATUS STYLE ---------------- */

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-[rgb(var(--primary-soft))] text-[rgb(var(--primary))]";
      case "reviewed":
        return "bg-yellow-100 text-yellow-700";
      case "selected":
        return "bg-[rgba(34,197,94,0.12)] text-[rgb(var(--success))]";
      case "rejected":
        return "bg-[rgba(239,68,68,0.12)] text-[rgb(var(--error))]";
      default:
        return "bg-[rgb(var(--bg-soft))] text-[rgb(var(--text-muted))]";
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();
    const status = statusFilter.toLowerCase();

    return applications.filter((app) => {
      const title = app.job?.title?.toLowerCase() || "";
      const company = app.job?.company?.toLowerCase() || "";
      const appStatus = app.status?.toLowerCase() || "";

      const matchesSearch =
        !q || title.includes(q) || company.includes(q);

      const matchesStatus =
        status === "all" || appStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(
    filteredApplications.length / ITEMS_PER_PAGE
  );

  const paginatedApplications = filteredApplications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl
                       bg-[rgb(var(--bg-soft))]
                       animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */

  if (!applications.length) {
    return (
      <div className="p-8 sm:p-10 text-center animate-fade-up">
        <p className="text-lg font-medium mb-2">
          You haven’t applied to any jobs yet
        </p>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Apply to jobs and track your progress here.
        </p>
        <Link
          to="/user/recommended"
          className="inline-block mt-4 text-sm
                     text-[rgb(var(--primary))] hover:underline"
        >
          View Recommended Jobs →
        </Link>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 space-y-5 animate-fade-up">
      {/* STICKY CONTROLS */}
      <div
        className="sticky top-0 z-10 bg-white
                   pt-4 pb-3 border-b
                   border-[rgb(var(--border))]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search job title or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5
                         border border-[rgb(var(--border))]
                         rounded-lg text-sm
                         focus:outline-none
                         focus:ring-2
                         focus:ring-[rgb(var(--primary-soft))]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]">
              🔍
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className="w-full sm:w-auto
                         flex items-center justify-between sm:justify-start
                         gap-2 px-4 py-2.5 border
                         border-[rgb(var(--border))]
                         rounded-lg bg-white text-sm
                         hover:bg-[rgb(var(--bg-soft))]"
            >
              <span>
                Status: <span className="font-medium">{statusFilter}</span>
              </span>
              <span
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isFilterOpen && (
              <div
                className="absolute right-0 mt-2 w-full sm:w-44
                           rounded-lg border
                           border-[rgb(var(--border))]
                           bg-white shadow-lg overflow-hidden"
              >
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm
                      ${
                        statusFilter === status
                          ? "bg-[rgb(var(--primary-soft))] text-[rgb(var(--primary))] font-medium"
                          : "hover:bg-[rgb(var(--bg-soft))]"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESULT COUNT */}
      <p className="text-sm text-[rgb(var(--text-muted))]">
        Showing {filteredApplications.length} result
        {filteredApplications.length !== 1 && "s"}
      </p>

      {/* APPLICATION CARDS */}
      <div className="space-y-4">
        {paginatedApplications.map((app, index) => (
          <Link
            key={app._id}
            to={`/jobs/${app.job?._id}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            className="block bg-white
                       border border-[rgb(var(--border))]
                       rounded-xl p-4 sm:p-5
                       hover:shadow-lg
                       hover:-translate-y-[2px]
                       transition-all animate-fade-up"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">
                  {app.job?.title || "Untitled Job"}
                </h3>
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  {app.job?.company || "Unknown Company"}
                </p>
                <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    Match
                  </p>
                  <p
                    className="font-semibold text-lg
                               text-[rgb(var(--accent))]"
                  >
                    {app.matchPercentage ?? 0}%
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full
                              text-xs font-medium
                              ${getStatusStyle(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm
                       border border-[rgb(var(--border))]
                       rounded disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-sm rounded border
                ${
                  page === i + 1
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-soft))]"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={page === totalPages}
            className="px-3 py-1 text-sm
                       border border-[rgb(var(--border))]
                       rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

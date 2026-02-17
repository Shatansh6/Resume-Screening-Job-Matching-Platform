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
      } catch {
        // silent fail handled by empty state
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
        return "bg-blue-100 text-blue-700";
      case "reviewed":
        return "bg-yellow-100 text-yellow-700";
      case "selected":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
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
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */

  if (!applications.length) {
    return (
      <div className="p-10 text-center animate-fade-up">
        <p className="text-lg font-medium mb-2">
          You haven’t applied to any jobs yet
        </p>
        <p className="text-sm text-gray-500">
          Apply to jobs and track your progress here.
        </p>
        <Link
          to="/user/recommended"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          View Recommended Jobs →
        </Link>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-6 pt-5 space-y-5 animate-fade-up">
      {/* STICKY CONTROLS */}
      <div className="sticky top-0 z-10 bg-white pt-4 pb-3 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search job title or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300
                         rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 border
                         rounded-lg bg-white text-sm hover:bg-gray-50"
            >
              Status:
              <span className="font-medium">{statusFilter}</span>
              <span
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border
                              bg-white shadow-lg overflow-hidden">
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
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
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
      <p className="text-sm text-gray-500">
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
            className="block bg-white border border-gray-200 rounded-xl p-5
                       hover:shadow-lg hover:-translate-y-[2px]
                       transition-all animate-fade-up"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {app.job?.title || "Untitled Job"}
                </h3>
                <p className="text-sm text-gray-500">
                  {app.job?.company || "Unknown Company"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Match</p>
                  <p className="font-semibold text-lg">
                    {app.matchPercentage ?? 0}%
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                    app.status
                  )}`}
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
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40"
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
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
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
            className="px-3 py-1 text-sm border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
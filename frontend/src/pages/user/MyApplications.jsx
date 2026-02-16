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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        setApplications(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Reset pagination on search/filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

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

  // 🔍 Robust Search + Status Filter (CASE-SAFE)
  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedStatus = statusFilter.toLowerCase();

    return applications.filter((app) => {
      const title = app.job?.title?.toLowerCase() || "";
      const company = app.job?.company?.toLowerCase() || "";
      const status = app.status?.toLowerCase() || "";

      const matchesSearch =
        title.includes(normalizedSearch) ||
        company.includes(normalizedSearch);

      const matchesStatus =
        normalizedStatus === "all" || status === normalizedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // 📄 Pagination
  const totalPages = Math.ceil(
    filteredApplications.length / ITEMS_PER_PAGE
  );

  const paginatedApplications = filteredApplications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your applications…
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="p-10 text-center">
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search job title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                       bg-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300
                       rounded-lg bg-white text-sm hover:bg-gray-50 transition"
          >
            <span>Status:</span>
            <span className="font-medium">{statusFilter}</span>
            <span
              className={`transition-transform duration-200 ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`absolute right-0 mt-2 w-44 rounded-lg border border-gray-200
                        bg-white shadow-lg overflow-hidden
                        transform transition-all duration-200 origin-top
              ${
                isFilterOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
          >
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setIsFilterOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                  ${
                    statusFilter === status
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredApplications.length} result
        {filteredApplications.length !== 1 && "s"}
      </p>

      {/* Application Cards */}
      <div className="space-y-4">
        {paginatedApplications.map((app) => (
          <Link
            key={app._id}
            to={`/jobs/${app.job?._id}`}
            className="block bg-white border border-gray-200 rounded-xl p-5
                       hover:shadow-lg hover:-translate-y-[2px]
                       transition-all duration-200"
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

              <div className="flex items-center gap-8">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
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
                    : "bg-white text-gray-700 hover:bg-gray-100"
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
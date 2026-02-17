import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ITEMS_PER_PAGE = 5;

export default function AdminApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/applications/job/${jobId}`);
        setApplications(res.data.applications || []);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  /* ---------------- UPDATE STATUS ---------------- */

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/applications/status/${id}`, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();

    return applications.filter((a) => {
      const name = a.user?.name?.toLowerCase() || "";
      const email = a.user?.email?.toLowerCase() || "";
      return name.includes(q) || email.includes(q);
    });
  }, [applications, search]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(
    filteredApplications.length / ITEMS_PER_PAGE
  );

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredApplications, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ---------------- STATUS BADGE ---------------- */

  const statusBadge = (status) => {
    switch (status) {
      case "selected":
        return "bg-green-100 text-green-700";
      case "reviewed":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-gray-100 animate-pulse"
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
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-5 animate-fade-up">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Applications
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage candidates for this job
        </p>
      </div>

      {/* SEARCH */}
      <div className="sticky top-0 z-10 bg-white pt-4 pb-3 border-b">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-lg border border-gray-300
                     px-4 py-2 text-sm focus:ring-2
                     focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Candidate</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Match</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedApplications.map((app, index) => (
              <tr
                key={app._id}
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => setSelectedApp(app)}
                className="cursor-pointer border-t hover:bg-gray-50
                           transition animate-fade-up"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {app.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {app.user?.email}
                  </p>
                </td>

                <td className="px-6 py-4">
                  {app.user?.experience ?? 0} yrs
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-indigo-100
                                   px-3 py-1 text-xs font-semibold
                                   text-indigo-700">
                    {app.matchPercentage}%
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      app.status
                    )}`}
                  >
                    {app.status || "pending"}
                  </span>
                </td>

                <td
                  className="px-6 py-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={app.status || ""}
                    onChange={(e) =>
                      updateStatus(app._id, e.target.value)
                    }
                    disabled={updatingId === app._id}
                    className="rounded-md border border-gray-300
                               px-2 py-1 text-xs
                               focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Set</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filteredApplications.length && (
          <div className="py-10 text-center text-gray-400">
            No applications found
          </div>
        )}
      </div>

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

      {/* MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center
                        justify-center bg-black/40">
          <div className="w-full max-w-3xl rounded-xl
                          bg-white shadow-xl animate-scale-in">
            <div className="flex items-center justify-between
                            border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                Candidate Details
              </h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
              <Info label="Name" value={selectedApp.user?.name} />
              <Info label="Email" value={selectedApp.user?.email} />
              <Info
                label="Experience"
                value={`${selectedApp.user?.experience} years`}
              />
              <Info
                label="Match"
                value={`${selectedApp.matchPercentage}%`}
              />
            </div>

            <div className="flex justify-end border-t px-6 py-4">
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🔹 Helper */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
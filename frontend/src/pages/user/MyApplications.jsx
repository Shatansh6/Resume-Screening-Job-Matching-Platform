import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await api.get("/applications/my-applications");
      setApplications(res.data.data || []);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-700";
      case "Selected":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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
          Apply to recommended jobs and track your progress here.
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
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
      <h2 className="text-2xl font-semibold">My Applications</h2>

      {applications.map((app) => (
        <div
          key={app._id}
          className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{app.job.title}</h3>
            <p className="text-sm text-gray-500">{app.job.company}</p>
            <p className="text-xs text-gray-400 mt-1">
              Applied on {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500">Match</p>
              <p className="font-semibold">{app.matchPercentage}%</p>
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
      ))}
    </div>
  );
}

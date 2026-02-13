import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function AdminApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data.applications || []);
    };
    fetchApplications();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    await api.patch(`/applications/status/${applicationId}`, { status });

    setApplications((prev) =>
      prev.map((app) => (app._id === applicationId ? { ...app, status } : app)),
    );
  };

  if (!applications.length) {
    return <p className="text-gray-500">No applications for this job</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Applications</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white border rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{app.user.name}</h3>
                <p className="text-sm text-gray-500">{app.user.email}</p>
              </div>

              <span className="font-semibold">{app.matchPercentage}%</span>
            </div>

            <div className="flex gap-3 mt-4">
              {["reviewed", "selected", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(app._id, status)}
                  className="px-4 py-1.5 text-xs rounded-full border hover:bg-gray-100"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

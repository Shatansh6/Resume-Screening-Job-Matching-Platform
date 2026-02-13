import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs || res.data.data || []);
    };
    fetchJobs();
  }, []);

  if (!jobs.length) {
    return <p className="text-gray-500">No jobs created yet</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">All Jobs</h1>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>

            <Link
              to={`/admin/jobs/${job._id}/applications`}
              className="text-sm text-blue-600 hover:underline"
            >
              View Applications →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

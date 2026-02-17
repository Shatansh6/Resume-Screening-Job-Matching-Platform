import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobDetailsModal from "./JobDetailsModel";
export default function JobDetailsCard({
  job,
  user,
  onApply,
  applying,
  applied,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.hasResume) {
      navigate("/");
      return;
    }

    onApply(job._id);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6
                      hover:shadow-md transition-shadow flex flex-col">

        {/* INFO */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
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

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 py-2 rounded-lg text-sm font-medium
                       border border-gray-300 text-gray-700
                       hover:bg-gray-100 transition"
          >
            View Details
          </button>

          <button
            onClick={handleApplyClick}
            disabled={applying || applied}
            className="flex-1 py-2 rounded-lg text-sm font-medium
                       bg-black text-white disabled:opacity-50"
          >
            {!user
              ? "Login"
              : !user.hasResume
              ? "Upload Resume"
              : applied
              ? "Applied"
              : applying
              ? "Applying…"
              : "Apply"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <JobDetailsModal
          job={job}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
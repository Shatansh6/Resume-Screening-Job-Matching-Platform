import { X } from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/50 px-4">

      <div className="bg-white max-w-xl w-full rounded-2xl p-6 relative
                      animate-fade-in">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-gray-900">
          {job.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {job.company} • {job.location || "Remote"}
        </p>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700 mt-4 leading-relaxed">
          {job.description}
        </p>

        {/* SKILLS */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Required Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {job.skillsRequired?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs rounded-full
                           bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <p className="text-sm text-gray-600 mt-4">
          Experience Required:{" "}
          <span className="font-medium">
            {job.experience}+ years
          </span>
        </p>
      </div>
    </div>
  );
}
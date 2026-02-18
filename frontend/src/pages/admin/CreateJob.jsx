import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    experience: "",
    skillsRequired: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const experience = Number(form.experience);
    const skills = form.skillsRequired
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (experience < 0) {
      setError("Experience must be a positive number");
      return;
    }

    if (!skills.length) {
      setError("Please enter at least one skill");
      return;
    }

    try {
      setLoading(true);

      await api.post("/jobs/create", {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        experience,
        skillsRequired: skills,
        description: form.description.trim(),
      });

      navigate("/admin/jobs", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 flex-col">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Job
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a new job opening
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white px-8 py-4 shadow-md space-y-6"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* JOB TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Frontend Developer"
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* COMPANY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Acme Corp"
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* LOCATION + EXPERIENCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Remote / Bengaluru"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SKILLS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills
          </label>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="React, JavaScript, Tailwind"
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate skills with commas
          </p>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3">
          <button
          type="button"
          onClick={() => navigate("/admin/jobs")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating…" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
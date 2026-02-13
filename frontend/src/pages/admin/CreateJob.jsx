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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/jobs/create", {
        title: form.title,
        company: form.company,
        location: form.location,
        experience: Number(form.experience),
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        description: form.description,
      });

      navigate("/admin/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Create Job</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl p-6 space-y-5"
      >
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <input
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <input
          name="location"
          placeholder="Location (Remote / City)"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <input
          type="number"
          name="experience"
          placeholder="Experience Required (years)"
          value={form.experience}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <input
          name="skillsRequired"
          placeholder="Skills (comma separated)"
          value={form.skillsRequired}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 h-32"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-full bg-black text-white disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create Job"}
        </button>
      </form>
    </div>
  );
}

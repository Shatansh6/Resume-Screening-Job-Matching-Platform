import { useState } from "react";
import { X } from "lucide-react";
import { loginUser, registerUser } from "../services/auth.service";
import { useAuth } from "../auth/AuthContext";

export default function AuthModal({ onClose }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    jobRole: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginUser({
          email: form.email,
          password: form.password,
        });
        login(data.user, data.token);
        onClose();
      } else {
        await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          jobRole: form.jobRole,
          experience: Number(form.experience),
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        });
        setMode("login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/50 px-4"
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl p-6 relative
                   animate-fade-in"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4
                     text-[rgb(var(--text-muted))]
                     hover:text-[rgb(var(--text-dark))]"
        >
          <X size={20} />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-4">
          {mode === "login" ? "Log in" : "Create account"}
        </h2>

        {error && (
          <p className="text-sm text-[rgb(var(--error))] mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full border
                           border-[rgb(var(--border))]
                           rounded-lg px-4 py-2
                           focus:outline-none
                           focus:ring-2
                           focus:ring-[rgb(var(--primary-soft))]"
                required
              />

              <input
                name="jobRole"
                placeholder="Your Role (e.g. Backend Developer)"
                onChange={handleChange}
                className="w-full border
                           border-[rgb(var(--border))]
                           rounded-lg px-4 py-2
                           focus:outline-none
                           focus:ring-2
                           focus:ring-[rgb(var(--primary-soft))]"
                required
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                onChange={handleChange}
                className="w-full border
                           border-[rgb(var(--border))]
                           rounded-lg px-4 py-2
                           focus:outline-none
                           focus:ring-2
                           focus:ring-[rgb(var(--primary-soft))]"
                required
              />

              <input
                name="skills"
                placeholder="Skills (comma separated)"
                onChange={handleChange}
                className="w-full border
                           border-[rgb(var(--border))]
                           rounded-lg px-4 py-2
                           focus:outline-none
                           focus:ring-2
                           focus:ring-[rgb(var(--primary-soft))]"
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border
                       border-[rgb(var(--border))]
                       rounded-lg px-4 py-2
                       focus:outline-none
                       focus:ring-2
                       focus:ring-[rgb(var(--primary-soft))]"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border
                       border-[rgb(var(--border))]
                       rounded-lg px-4 py-2
                       focus:outline-none
                       focus:ring-2
                       focus:ring-[rgb(var(--primary-soft))]"
            required
          />

          <button
            disabled={loading}
            className="w-full py-2 rounded-full
                       bg-[rgb(var(--primary))]
                       text-white
                       hover:bg-blue-700
                       transition
                       disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        {/* SWITCH */}
        <p
          className="text-sm text-[rgb(var(--text-muted))]
                     mt-4 text-center"
        >
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setMode("register")}
                className="text-[rgb(var(--primary))]
                           cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setMode("login")}
                className="text-[rgb(var(--primary))]
                           cursor-pointer hover:underline"
              >
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

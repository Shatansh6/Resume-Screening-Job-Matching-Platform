import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resume.service";
import { useAuth } from "../auth/AuthContext";
import TrendingJobs from "../components/TrendingJobs";

export default function Landing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a PDF resume");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await uploadResume(file);
      updateUser({ hasResume: true });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Resume parsing failed. Please upload a text-based PDF.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleReuploadClick = () => {
    setFile(null);
    setError("");
    setSuccess(false);
    updateUser({ hasResume: false });
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Get The Right Job <br />
            <span className="text-[rgb(var(--primary))]">You Deserve</span>
          </h1>

          <p className="text-[rgb(var(--text-muted))] mb-8 max-w-md">
            Upload your resume and instantly discover jobs that match your
            skills. No spam. No guessing. Just real matches.
          </p>

          <div className="flex gap-4">
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-full bg-[rgb(var(--primary))] text-black font-medium hover:opacity-90"
              >
                Login to Get Started
              </button>
            )}

            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              Browse Jobs
            </button>
          </div>
        </div>

        {/* RIGHT SIDE – BEAUTIFIED RESUME UPLOAD */}
        <div className="w-full max-w-md rounded-3xl ml-35 p-6 bg-[rgb(234,248,200)]">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[rgb(var(--text-dark))] mb-1">
              Upload Your Resume
            </h3>

            <p className="text-sm text-[rgb(var(--text-muted))] mb-5">
              We’ll analyze your skills and match you with the best jobs.
            </p>

            {/* GUEST */}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-full bg-[rgb(var(--primary))] text-black font-medium hover:opacity-90"
              >
                Login to Upload Resume
              </button>
            )}

            {/* LOGGED IN — NO RESUME */}
            {user && !user.hasResume && (
              <>
                {/* Upload box */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[rgb(var(--primary))] transition mb-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  <p className="text-sm font-medium text-[rgb(var(--text-dark))]">
                    Click to upload PDF
                  </p>
                  <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                    Text-based resume only (Word / Google Docs export)
                  </p>
                </label>

                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                {success && (
                  <p className="text-sm text-green-700 mb-2">
                    Resume uploaded & analyzed successfully
                  </p>
                )}

                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-black text-white disabled:opacity-50"
                >
                  {loading ? "Analyzing Resume..." : "Upload & Analyze"}
                </button>
              </>
            )}

            {/* LOGGED IN — RESUME UPLOADED */}
            {user && user.hasResume && (
              <div className="text-center">
                <p className="text-sm text-green-700 mb-4">
                  Resume uploaded successfully 🎉
                </p>

                <div className="flex flex-col gap-3">
                  {/* Primary action */}
                  <button
                    onClick={() => navigate("/user/recommended")}
                    className="w-full py-3 rounded-full bg-[rgb(var(--primary))] text-black font-medium hover:opacity-90"
                  >
                    View Recommended Jobs
                  </button>

                  {/* Secondary action */}
                  <button
                    onClick={handleReuploadClick}
                    className="w-full py-3 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Re-upload Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRENDING JOBS */}
      <TrendingJobs />
    </div>
  );
}

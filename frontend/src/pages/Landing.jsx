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
          "Resume parsing failed. Please upload a text-based PDF."
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
      <section className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* LEFT */}
        <div className="animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Get The Right Job <br />
            <span className="text-[rgb(var(--primary))]">
              You Deserve
            </span>
          </h1>

          <p className="text-[rgb(var(--text-muted))] mb-8 max-w-md animate-fade-up animate-delay-1">
            Upload your resume and instantly discover jobs that match your
            skills. No spam. No guessing. Just real matches.
          </p>

          <div className="flex gap-4 animate-fade-up animate-delay-2">
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-full bg-[rgb(var(--primary))] text-black
                           font-medium hover:scale-[1.03] transition-transform"
              >
                Login to Get Started
              </button>
            )}

            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 rounded-full border border-gray-300
                         hover:bg-gray-100 hover:scale-[1.03]
                         transition-all"
            >
              Browse Jobs
            </button>
          </div>
        </div>

        {/* RIGHT – RESUME CARD */}
        <div className="w-full max-w-md ml-35 p-6 bg-[rgb(234,248,200)]
                        rounded-3xl animate-fade-up animate-delay-3">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-1">
              Upload Your Resume
            </h3>

            <p className="text-sm text-[rgb(var(--text-muted))] mb-5">
              We’ll analyze your skills and match you with the best jobs.
            </p>

            {/* GUEST */}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-full bg-[rgb(var(--primary))]
                           text-black font-medium hover:scale-[1.02]
                           transition-transform"
              >
                Login to Upload Resume
              </button>
            )}

            {/* USER – NO RESUME */}
            {user && !user.hasResume && (
              <>
                <label className="flex flex-col items-center justify-center
                                  border-2 border-dashed border-gray-300
                                  rounded-xl p-6 cursor-pointer
                                  hover:border-[rgb(var(--primary))]
                                  hover:bg-gray-50
                                  transition-all mb-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <p className="text-sm font-medium">
                    Click to upload PDF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Text-based resume only
                  </p>
                </label>

                {error && (
                  <p className="text-sm text-red-600 mb-2 animate-fade-up">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="text-sm text-green-700 mb-2 animate-fade-up">
                    Resume uploaded successfully
                  </p>
                )}

                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-black text-white
                             disabled:opacity-50 hover:scale-[1.02]
                             transition-transform"
                >
                  {loading ? "Analyzing Resume..." : "Upload & Analyze"}
                </button>
              </>
            )}

            {/* USER – RESUME UPLOADED */}
            {user && user.hasResume && (
              <div className="text-center animate-fade-up">
                <p className="text-sm text-green-700 mb-4">
                  Resume uploaded successfully 🎉
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/user/recommended")}
                    className="w-full py-3 rounded-full bg-[rgb(var(--primary))]
                               text-black font-medium hover:scale-[1.02]
                               transition-transform"
                  >
                    View Recommended Jobs
                  </button>

                  <button
                    onClick={handleReuploadClick}
                    className="w-full py-3 rounded-full border border-gray-300
                               text-sm hover:bg-gray-100 transition"
                  >
                    Re-upload Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* JOB LIST (no animation needed here) */}
      <TrendingJobs />
    </div>
  );
}
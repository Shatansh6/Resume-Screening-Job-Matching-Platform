import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resume.service";
import TrendingJobs from "../components/TrendingJobs";
import ResumeAnalysisProgress from "../components/ui/ResumeAnalysisProgress";
import { useAuth } from "../auth/AuthContext";
import AuthModal from "../auth/AuthModel";

export default function Landing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a PDF resume");
      return;
    }

    setError("");
    setAnalyzing(true);

    try {
      await uploadResume(file);
    } catch (err) {
      setAnalyzing(false);
      setError(
        err.response?.data?.message ||
          "Resume parsing failed. Please upload a text-based PDF."
      );
    }
  };

  const handleReuploadClick = () => {
    setFile(null);
    setError("");
    updateUser({ hasResume: false });
  };

  return (
    <>
      <div>
        {/* HERO SECTION */}
        <section
          className="max-w-7xl mx-auto
                     px-4 sm:px-6
                     pt-10 sm:pt-14
                     grid grid-cols-1 md:grid-cols-2
                     gap-10 md:gap-14
                     items-center"
        >
          {/* LEFT */}
          <div className="animate-fade-up text-center md:text-left">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl
                         font-bold leading-tight mb-5"
            >
              Jobs That Actually <br />
              <span className="text-[rgb(var(--primary))]">
                Match Your Resume
              </span>
            </h1>

            <p
              className="text-[rgb(var(--text-muted))]
                         mb-7 max-w-md mx-auto md:mx-0"
            >
              Upload your resume and instantly discover jobs aligned with
              your skills. No spam. No guessing. Just real matches.
            </p>

            <div
              className="flex flex-col sm:flex-row
                         gap-3 sm:gap-4
                         justify-center md:justify-start"
            >
              {!user && (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-3 rounded-full
                             bg-[rgb(var(--primary))]
                             text-white font-medium
                             hover:bg-blue-700
                             transition-all"
                >
                  Login to Get Started
                </button>
              )}

              <button
                onClick={() =>
                  user?.hasResume
                    ? navigate("/user/recommended")
                    : navigate("/jobs")
                }
                className="px-6 py-3 rounded-full
                           border border-[rgb(var(--border))]
                           hover:bg-[rgb(var(--bg-soft))]
                           transition-all"
              >
                {user?.hasResume
                  ? "View Recommended Jobs"
                  : "Browse Jobs"}
              </button>
            </div>
          </div>

          {/* RIGHT – RESUME CARD */}
          <div
            className="w-full max-w-md
                       mx-auto md:ml-auto
                       p-5 sm:p-6
                       bg-[rgb(var(--primary-soft))]
                       rounded-3xl"
          >
            <div className="bg-white rounded-2xl p-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-1">
                Upload Your Resume
              </h3>

              <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
                We analyze your resume to find jobs that truly fit you.
              </p>

              {/* GUEST */}
              {!user && (
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-full py-3 rounded-full
                             bg-[rgb(var(--primary))]
                             text-white font-medium
                             hover:bg-blue-700 transition"
                >
                  Login to Upload Resume
                </button>
              )}

              {/* USER – NO RESUME */}
              {user && !user.hasResume && (
                <>
                  <label
                    className="flex flex-col items-center justify-center
                               border-2 border-dashed
                               border-[rgb(var(--border))]
                               rounded-xl p-5 sm:p-6
                               cursor-pointer mb-3"
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        setFile(e.target.files[0])
                      }
                    />
                    <p className="text-sm font-medium text-center">
                      Tap to upload PDF resume
                    </p>
                  </label>

                  {file && (
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-2 text-center">
                      Selected: {file.name}
                    </p>
                  )}

                  {error && (
                    <p className="text-sm text-red-600 mb-2 text-center">
                      {error}
                    </p>
                  )}

                  {analyzing ? (
                    <ResumeAnalysisProgress
                      onComplete={() => {
                        updateUser({ hasResume: true });
                        setAnalyzing(false);
                      }}
                    />
                  ) : (
                    <button
                      onClick={handleUpload}
                      className="w-full py-3 rounded-full
                                 bg-gray-900 text-white
                                 hover:bg-black transition"
                    >
                      Find Matching Jobs
                    </button>
                  )}
                </>
              )}

              {/* USER – RESUME UPLOADED */}
              {user && user.hasResume && (
                <div className="text-center">
                  <p
                    className="text-sm mb-4
                               text-[rgb(var(--accent))]"
                  >
                    Resume analyzed. Your job matches are ready 🎯
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() =>
                        navigate("/user/recommended")
                      }
                      className="w-full py-3 rounded-full
                                 bg-[rgb(var(--primary))]
                                 text-white font-medium
                                 hover:bg-blue-700 transition"
                    >
                      View Recommended Jobs
                    </button>

                    <button
                      onClick={handleReuploadClick}
                      className="w-full py-3 rounded-full
                                 border border-[rgb(var(--border))]
                                 hover:bg-[rgb(var(--bg-soft))]
                                 text-sm transition"
                    >
                      Re-upload Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <TrendingJobs />
      </div>

      {/* AUTH MODAL */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </>
  );
}

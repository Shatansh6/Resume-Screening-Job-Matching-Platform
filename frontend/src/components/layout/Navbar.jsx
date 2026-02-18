import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthModal from "../../auth/AuthModel";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[rgb(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            className="text-xl font-bold text-[rgb(var(--primary))]"
          >
            ResumeMatch
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-[rgb(var(--primary))]">Home</Link>
            <Link to="/jobs" className="hover:text-[rgb(var(--primary))]">Jobs</Link>

            {user && user.role === "user" && (
              <>
                <Link to="/user/applications" className="hover:text-[rgb(var(--primary))]">
                  Applications
                </Link>
                {user.hasResume && (
                  <Link to="/user/recommended" className="hover:text-[rgb(var(--primary))]">
                    Recommended
                  </Link>
                )}
              </>
            )}

            {user && user.role === "admin" && (
              <Link to="/admin" className="hover:text-[rgb(var(--primary))]">
                Admin
              </Link>
            )}

            {!user ? (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4 py-2 rounded-full bg-[rgb(var(--primary))] text-white hover:bg-blue-700 transition"
              >
                Login / Sign Up
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-black transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-[rgb(var(--text-dark))]"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 animate-slideIn">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>

              {user && user.role === "user" && (
                <>
                  <Link to="/user/applications" onClick={() => setOpen(false)}>
                    Applications
                  </Link>
                  {user.hasResume && (
                    <Link to="/user/recommended" onClick={() => setOpen(false)}>
                      Recommended
                    </Link>
                  )}
                </>
              )}

              {user && user.role === "admin" && (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}

              <div className="pt-4 border-t border-[rgb(var(--border))]">
                {!user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowAuth(true);
                    }}
                    className="w-full py-2 rounded-full bg-[rgb(var(--primary))] text-white"
                  >
                    Login / Sign Up
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-full bg-gray-900 text-white"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

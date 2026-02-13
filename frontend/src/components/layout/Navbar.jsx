import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          ResumeMatch
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          <Link to="/jobs" className="hover:underline">
            Jobs
          </Link>

          {/* USER NAV */}
          {user && user.role === "user" && (
            <>
              <Link to="/user/applications" className="hover:underline">
                Applications
              </Link>

              {user.hasResume && (
                <Link to="/user/recommended" className="hover:underline">
                  Recommended
                </Link>
              )}
            </>
          )}

          {/* ADMIN NAV */}
          {user && user.role === "admin" && (
            <Link to="/admin" className="hover:underline">
              Admin
            </Link>
          )}

          {/* AUTH */}
          {!user ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-[rgb(var(--primary))] text-black"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-black text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

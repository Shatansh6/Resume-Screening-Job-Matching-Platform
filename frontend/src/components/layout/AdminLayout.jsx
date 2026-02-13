// src/components/layout/AdminLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-lg font-semibold mb-6">Admin Dashboard</h2>

        <nav className="space-y-3 text-sm">
          <Link to="/admin/jobs" className="block hover:underline">
            Jobs
          </Link>

          <Link to="/admin/jobs/create" className="block hover:underline">
            Create Job
          </Link>

          <button
            onClick={handleLogout}
            className="mt-6 text-left text-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Briefcase, Plus, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const SIDEBAR_EXPANDED = 256; // px
const SIDEBAR_COLLAPSED = 80;

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed
    ? SIDEBAR_COLLAPSED
    : SIDEBAR_EXPANDED;

  const handleLogout = async () => {
    try {
      await logout(); // safe even if logout is sync
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const navItem = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className="fixed left-0 top-0 h-screen bg-white border-r z-30 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        {/* BRAND */}
        <div className="flex items-center justify-between h-14 px-4 border-b">
          {!collapsed && (
            <span className="font-semibold text-gray-900">
              Admin Console
            </span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* NAV */}
        <nav className="px-3 py-4 space-y-1">
          <NavLink to="/admin/jobs" className={navItem}>
            <Briefcase size={18} />
            {!collapsed && "Jobs"}
          </NavLink>

          <NavLink to="/admin/jobs/create" className={navItem}>
            <Plus size={18} />
            {!collapsed && "Create Job"}
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarWidth }}
      >
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-sm font-medium text-gray-800">
            Admin Dashboard
          </h1>

          {/* USER AVATAR */}
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            A
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
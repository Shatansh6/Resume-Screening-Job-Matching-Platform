import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProctectedRoute";
import ResumeGuard from "../auth/ResumeGuard";
import RoleGuard from "../auth/RoleGuard";
import { ROLES } from "../constants/roles";
import Register from "../auth/Register";

import Layout from "../components/layout/Layout";
import AdminLayout from "../components/layout/AdminLayout";

import Landing from "../pages/Landing";
import Login from "../auth/Login";
import AllJobs from "../pages/AllJobs";

import RecommendedJobs from "../pages/user/RecommendedJobs";
import MyApplications from "../pages/user/MyApplications";

import AdminJobs from "../pages/admin/AdminJobs";
import CreateJob from "../pages/admin/CreateJob";
import AdminApplications from "../pages/admin/AdminApplications";


export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== PUBLIC / USER ===== */}
      <Route
        path="/"
        element={
          <Layout>
            <Landing />
          </Layout>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/jobs"
        element={
          <Layout>
            <AllJobs />
          </Layout>
        }
      />

      <Route
        path="/user/recommended"
        element={
          <ProtectedRoute>
            <ResumeGuard>
              <Layout>
                <RecommendedJobs />
              </Layout>
            </ResumeGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/applications"
        element={
          <ProtectedRoute>
            <Layout>
              <MyApplications />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ===== ADMIN (SEPARATE WORLD) ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRole={ROLES.ADMIN}>
              <AdminLayout />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminJobs />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route
          path="jobs/:jobId/applications"
          element={<AdminApplications />}
        />
      </Route>
    </Routes>
  );
}

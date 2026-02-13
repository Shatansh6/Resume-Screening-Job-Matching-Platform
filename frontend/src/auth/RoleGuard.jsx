import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleGuard({ allowedRole, children }) {
  const { user } = useAuth();
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

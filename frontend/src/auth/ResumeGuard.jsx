import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ResumeGuard({ children }) {
  const { user } = useAuth();

  // backend stores resume status on user
  if (!user?.hasResume) {
    return <Navigate to="/" replace />;
  }

  return children;
}

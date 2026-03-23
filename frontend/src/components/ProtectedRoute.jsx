import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="empty-state">
        <span className="spinner spinner-dark" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
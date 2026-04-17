import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, roleId } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(roleId)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return children;
}

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles.length > 0) {
    const userRole = (user.role || user.userType || '').toLowerCase();
    
    if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      // User doesn't have required role, redirect based on their actual role
      if (userRole === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (userRole === 'staff') {
        return <Navigate to="/staff-dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
}
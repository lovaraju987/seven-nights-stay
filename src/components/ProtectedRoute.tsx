import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: string;
}

const roleLoginMap: Record<string, string> = {
  owner: "/owner/login",
  admin: "/admin/login",
  agent: "/agent/login",
  hosteller: "/login",
};

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { session, role: userRole, loading } = useAuth();

  if (loading) return null;

  if (!session) {
    const redirect = role ? roleLoginMap[role] || "/login" : "/login";
    return <Navigate to={redirect} replace />;
  }

  if (role && userRole !== role) {
    const redirect = roleLoginMap[role] || "/login";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

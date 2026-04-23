import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, user, isLoading } = useAuth();

  console.log('ProtectedRoute - token:', !!token, 'user:', !!user, 'loading:', isLoading);

  // Wait for authentication check to complete
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Initializing...</p>
      </div>
    );
  }

  // Redirect to login if no token
  if (!token) {
    console.log('No token found, redirecting to login');
  ;
  }

  return <>{children}</>;
}

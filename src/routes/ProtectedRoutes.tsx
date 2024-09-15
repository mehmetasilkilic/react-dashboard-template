import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function ProtectedRoute() {
  const { isSignedIn } = useAuthStore();

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Outlet />;
}

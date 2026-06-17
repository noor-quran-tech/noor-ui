import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import type { RootState } from "@store/store";

export const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  // Renders the nested child component matches
  return <Outlet />;
};

export const GuestRoute = () => {
  const user = useSelector((state: RootState) => state.auth);

  if (user) return <Navigate to="/dashboard" replace />;

  // Renders the nested child component matches
  return <Outlet />;
};

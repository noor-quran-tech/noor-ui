import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import type { RootState } from "@store/store";

export const ProtectedRoute = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth);

  if (
    !loggedInUser ||
    !loggedInUser.token ||
    !loggedInUser.profile ||
    !loggedInUser.user
  )
    return <Navigate to="/login" replace />;

  // Renders the nested child component matches
  return <Outlet />;
};

export const GuestRoute = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth);

  if (
    loggedInUser &&
    loggedInUser.token &&
    loggedInUser.profile &&
    loggedInUser.user
  )
    return <Navigate to="/dashboard" replace />;

  // Renders the nested child component matches
  return <Outlet />;
};

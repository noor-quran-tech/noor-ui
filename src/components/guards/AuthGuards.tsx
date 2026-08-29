import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import type { RootState } from "@store/store";
import { type Role } from "@utils/types/user";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute = () => {
  const location = useLocation();
  const loggedInUser = useSelector((state: RootState) => state.auth);

  if (
    !loggedInUser ||
    !loggedInUser.token ||
    !loggedInUser.profile ||
    !loggedInUser.user
  )
    return (
      <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
    );

  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const location = useLocation();
  const loggedInUser = useSelector((state: RootState) => state.auth);
  const userRole = loggedInUser?.user?.role;

  if (!userRole) {
    return (
      <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
    );
  }

  if (!allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ redirectTo: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const location = useLocation();
  const loggedInUser = useSelector((state: RootState) => state.auth);
  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ??
    "/dashboard";

  if (
    loggedInUser &&
    loggedInUser.token &&
    loggedInUser.profile &&
    loggedInUser.user
  )
    return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};

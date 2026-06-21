import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import type { RootState } from "@store/store";

import { Role } from "@utils/types/user";
import axiosAPI from "@lib/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import SideNav from "@components/dashboard/SideNav";
import DashboardMainContent from "@components/dashboard/DashboardMainContent";

export interface NavItem {
  label: string;
  path: string;
  roles: Role[];
}

const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    path: "/dashboard",
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  { label: "User Management", path: "/dashboard/users", roles: [Role.ADMIN] },
  { label: "Inquiries", path: "/dashboard/inquiries", roles: [Role.ADMIN] },
  { label: "Statistics", path: "/dashboard/statistics", roles: [Role.ADMIN] },
  {
    label: "Sessions",
    path: "/dashboard/sessions",
    roles: [Role.TEACHER, Role.STUDENT, Role.ADMIN],
  },
  {
    label: "Requests",
    path: "/dashboard/requests",
    roles: [Role.TEACHER, Role.STUDENT, Role.ADMIN],
  },
];

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentRole = user?.role || Role.STUDENT;

  const filteredNavItems = DASHBOARD_NAV_ITEMS.filter((item) =>
    item.roles.includes(currentRole),
  );

  const [isUserActive, setIsUserActive] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    async function checkUserActivity() {
      if (!user?.id) return;

      try {
        // Calling your endpoint to verify token integrity and status
        await axiosAPI.get(`/users/${user.id}`);
        setIsUserActive(true);
      } catch (err) {
        if (isAxiosError(err)) {
          // If the status is 401 Unauthorized or 403 Forbidden, flag account as inactive
          if (err.response?.status === 401 || err.response?.status === 403) {
            setIsUserActive(false);
          }
        } else if (err instanceof Error) {
          toast.error("Dashboard error.", {
            description: err.message,
          });
        }
      } finally {
        setCheckingStatus(false);
      }
    }

    checkUserActivity();
  }, [user?.id]);

  if (checkingStatus) {
    return (
      <div className="h-screen w-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="animate-pulse space-y-2 text-center">
          <div className="h-4 w-24 bg-neutral-200 rounded mx-auto" />
          <div className="h-3 w-40 bg-neutral-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-100 font-sans text-neutral-800 pt-3">
      {/* ====================================================
          SIDEBAR NAVIGATION SHELL
          ==================================================== */}
      <SideNav
        currentRole={currentRole}
        filteredNavItems={filteredNavItems}
        isUserActive={isUserActive}
        user={user}
      />

      {/* ====================================================
          MAIN ROUTE CONTENT WINDOW HOLDER
          ==================================================== */}
      <DashboardMainContent isUserActive={isUserActive} user={user} />
    </div>
  );
};

export default Dashboard;

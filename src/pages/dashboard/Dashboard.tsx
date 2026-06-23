import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import type { RootState } from "@store/store";

import { Role } from "@utils/types/user";
import axiosAPI from "@lib/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import DashboardMainContent from "@components/dashboard/DashboardMainContent";
import { logout } from "@store/slices/authSlice";

interface NavItem {
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      {/* <SideNav
        currentRole={currentRole}
        filteredNavItems={filteredNavItems}
        isUserActive={isUserActive}
        user={user}
      /> */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black">
              Ω
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-900 tracking-tight">
                EduPortal
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md">
                {currentRole} Panel
              </span>
            </div>
          </div>

          {/* Sidebar Links - Block interactions if deactivated */}
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={isUserActive ? item.path : "#"} // ✅ Block navigate paths if deactivated
                end={item.path === "/dashboard"}
                onClick={(e) => {
                  if (!isUserActive) {
                    e.preventDefault();
                    toast.error("Access Denied", {
                      description: "Reactivate account to open tabs.",
                    });
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 ${
                    isActive && isUserActive
                      ? "bg-teal-50 text-teal-600"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  } ${!isUserActive ? "opacity-50 cursor-not-allowed" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Area with clear Logout action access */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden w-full justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="h-8 w-8 rounded-full bg-neutral-200 shrink-0 flex items-center justify-center font-bold text-xs uppercase text-neutral-600">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-neutral-900 truncate">
                  {user?.firstName}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Added an escape sign-out hook right here for security compliance */}
            <button
              onClick={() => {
                dispatch(logout());
                // Trigger your custom red-dispatch auth logout slice handler here
                toast.success("Logged out successfully");
                navigate("/login");
              }}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md cursor-pointer transition"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>
      {/* ====================================================
          MAIN ROUTE CONTENT WINDOW HOLDER
          ==================================================== */}
      <DashboardMainContent isUserActive={isUserActive} user={user} />
    </div>
  );
};

export default Dashboard;

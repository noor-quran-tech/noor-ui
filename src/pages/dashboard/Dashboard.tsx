import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import type { RootState } from "@store/store";

import DashboardMainContent from "@components/dashboard/DashboardMainContent";
import axiosAPI from "@lib/axios";
import { logout } from "@store/slices/authSlice";
import { Role } from "@utils/types/user";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";

interface NavItem {
  key: string;
  path: string;
  roles: Role[];
}

const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    key: "overview",
    path: "/dashboard",
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  { key: "userManagement", path: "/dashboard/users", roles: [Role.ADMIN] },
  { key: "inquiries", path: "/dashboard/inquiries", roles: [Role.ADMIN] },
  { key: "statistics", path: "/dashboard/statistics", roles: [Role.ADMIN] },
  {
    key: "sessions",
    path: "/dashboard/sessions",
    roles: [Role.TEACHER, Role.STUDENT, Role.ADMIN],
  },
  {
    key: "requests",
    path: "/dashboard/requests",
    roles: [Role.TEACHER, Role.STUDENT, Role.ADMIN],
  },
  {
    key: "subscriptions",
    path: "/dashboard/subscriptions",
    roles: [Role.STUDENT, Role.ADMIN],
  },
  {
    key: "subscriptionPlans",
    path: "/dashboard/subscription-plans",
    roles: [Role.ADMIN],
  },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const currentRole = user?.role || Role.STUDENT;

  const filteredNavItems = DASHBOARD_NAV_ITEMS.filter((item) =>
    item.roles.includes(currentRole),
  );

  const [isUserActive, setIsUserActive] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isArabic = i18n.language === "ar";

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
          toast.error(t("dashboard.errorToastTitle"), {
            description: err.message,
          });
        }
      } finally {
        setCheckingStatus(false);
      }
    }

    checkUserActivity();
  }, [user?.id, t]);

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
    <div className="flex min-h-screen bg-neutral-100 font-sans text-neutral-800 lg:pt-3">
      {/* Mobile/tablet overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label={t("dashboard.ariaCloseNav")}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ====================================================
          SIDEBAR NAVIGATION SHELL
          ==================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 flex flex-col justify-between shadow-xl transition-transform duration-300 lg:static lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black">
              Ω
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-900 tracking-tight">
                {t("dashboard.eduPortal")}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md">
                {isArabic ? (
                  <>
                    {t("dashboard.panelSuffix")} {t(`roles.${currentRole}`)}
                  </>
                ) : (
                  <>
                    {t(`roles.${currentRole}`)} {t("dashboard.panelSuffix")}
                  </>
                )}
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
                    toast.error(t("dashboard.accessDeniedTitle"), {
                      description: t("dashboard.accessDeniedDesc"),
                    });
                  } else {
                    setIsSidebarOpen(false);
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
                {t(`dashboard.nav.${item.key}`)}
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
                toast.success(t("dashboard.logoutSuccess"));
                setIsSidebarOpen(false);
                navigate("/login");
              }}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md cursor-pointer transition"
            >
              {t("dashboard.logout")}
            </button>
          </div>
        </div>
      </aside>
      {/* ====================================================
          MAIN ROUTE CONTENT WINDOW HOLDER
          ==================================================== */}
      <DashboardMainContent
        isUserActive={isUserActive}
        user={user}
        onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
    </div>
  );
};

export default Dashboard;

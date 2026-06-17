import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@store/store";

import { Role } from "@utils/types/user";

interface NavItem {
  label: string;
  path: string;
  roles: Role[];
}

const DASHBOARD_NAV_ITEMS: NavItem[] = [
  // Admin Only Routes
  { label: "User Management", path: "/dashboard/users", roles: [Role.ADMIN] },
  { label: "Inquiries", path: "/dashboard/inquiries", roles: [Role.ADMIN] },
  { label: "Statistics", path: "/dashboard/statistics", roles: [Role.ADMIN] },

  // Shared Student & Teacher Routes
  {
    label: "Sessions",
    path: "/dashboard/sessions",
    roles: [Role.TEACHER, Role.STUDENT],
  },
  {
    label: "Requests",
    path: "/dashboard/requests",
    roles: [Role.TEACHER, Role.STUDENT],
  },
];

const Dashboard = () => {
  const location = useLocation();

  // 1. Fetch user data from your global authentication state
  const { user } = useSelector((state: RootState) => state.auth);
  const currentRole = user?.role || Role.STUDENT;

  // 2. Filter navigation links based on current logged-in role matrix
  const filteredNavItems = DASHBOARD_NAV_ITEMS.filter((item) =>
    item.roles.includes(currentRole),
  );

  return (
    <div className="flex h-screen bg-neutral-100 font-sans text-neutral-800 pt-3">
      {/* ====================================================
          SIDEBAR NAVIGATION SHELL
         ==================================================== */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between md:flex">
        <div className="p-6">
          {/* Dashboard Header Brand Identity */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black text-l">
              Ω
            </div>
            <div>
              <h1 className="text-m font-bold text-neutral-900 tracking-tight">
                EduPortal
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md">
                {currentRole} Panel
              </span>
            </div>
          </div>

          {/* Dynamic Rendered Links */}
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 group ${
                    isActive
                      ? "bg-teal-50 text-teal-600"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Quick Info & Footer Escape Action */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-neutral-200 shrink-0 flex items-center justify-center font-bold text-xs uppercase text-neutral-600">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-neutral-400 truncate">
                {user?.email || "user@email.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ====================================================
          MAIN ROUTE CONTENT HOLDER
         ==================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar Header Section */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              {location.pathname === "/dashboard"
                ? "Overview"
                : DASHBOARD_NAV_ITEMS.find(
                    (item) => item.path === location.pathname,
                  )?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Context action tags or notifications can live here */}
            <span className="text-xs font-medium text-neutral-400">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Nested Sub-Page View Window Injection */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-50">
          {location.pathname === "/dashboard" ? (
            /* Root dashboard overview route markup when no specific nested path suffix is requested */
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm max-w-md">
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                Welcome Back, {user?.firstName || "User"}!
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Select an application resource action pane from the dashboard
                navigation panel menu options to review data modules.
              </p>
            </div>
          ) : (
            /* Injects the child dashboard component match dynamically */
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

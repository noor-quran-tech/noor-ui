import { Link, Outlet, useLocation } from "react-router-dom";

interface MainContentProps {
  isUserActive: boolean;
  user: {
    firstName: string;
  };
  onMenuToggle: () => void;
}

const DashboardMainContent = ({
  isUserActive,
  user,
  onMenuToggle,
}: MainContentProps) => {
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open dashboard navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 lg:hidden"
            onClick={onMenuToggle}
          >
            ☰
          </button>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {!isUserActive
              ? "Account Suspended"
              : location.pathname === "/dashboard"
                ? "Overview"
                : "Workspace"}
          </h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-50 flex flex-col justify-start">
        {/* ✅ CONDITION A: ACCOUNT SUSPENDED BANNER MODULE */}
        {!isUserActive ? (
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-xs max-w-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-sm font-black">
                ✕
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Your Account is Currently Deactivated
                </h3>
                <p className="text-xs text-neutral-400">
                  Access privileges have been restricted by systems
                  administration.
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
              Your account has been restricted by an administrator. Please reach
              out to our{" "}
              <Link
                to="/contact"
                className="text-teal-600 hover:text-teal-700 font-bold underline decoration-teal-500/30 hover:decoration-teal-700 transition-all duration-150"
              >
                Support Team
              </Link>{" "}
              or contact your manager directly to request reactivation.
            </p>
          </div>
        ) : location.pathname === "/dashboard" ? (
          /* CONDITION B: ACTIVE OVERVIEW DEFAULT ROOT */
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm max-w-md">
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              Welcome Back, {user?.firstName || "User"}!
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Select an application resource action pane from the dashboard
              navigation panel menu options to review data modules.
            </p>
          </div>
        ) : (
          /* CONDITION C: STANDARD ACTIVE NESTED ROUTE VIEW */
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default DashboardMainContent;

import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

interface MainContentProps {
  isUserActive: boolean;
  user?: {
    firstName: string;
  };
  onMenuToggle: () => void;
}

const DashboardMainContent = ({
  isUserActive,
  user,
  onMenuToggle,
}: MainContentProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const getHeaderTitle = () => {
    if (!isUserActive) {
      return t("dashboard.mainContent.headerTitle.suspended");
    }
    if (location.pathname === "/dashboard") {
      return t("dashboard.mainContent.headerTitle.overview");
    }
    return t("dashboard.mainContent.headerTitle.workspace");
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={t("dashboard.mainContent.openNavAria")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 lg:hidden"
            onClick={onMenuToggle}
          >
            ☰
          </button>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {getHeaderTitle()}
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
                  {t("dashboard.mainContent.suspended.title")}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t("dashboard.mainContent.suspended.subtitle")}
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-3">
              {t("dashboard.mainContent.suspended.messagePart1")}{" "}
              <Link
                to="/contact"
                className="text-teal-600 hover:text-teal-700 font-bold underline decoration-teal-500/30 hover:decoration-teal-700 transition-all duration-150"
              >
                {t("dashboard.mainContent.suspended.supportLink")}
              </Link>{" "}
              {t("dashboard.mainContent.suspended.messagePart2")}
            </p>
          </div>
        ) : location.pathname === "/dashboard" ? (
          /* CONDITION B: ACTIVE OVERVIEW DEFAULT ROOT */
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm max-w-md">
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              {t("dashboard.mainContent.welcome.greeting", {
                name:
                  user?.firstName ||
                  t("dashboard.mainContent.welcome.defaultName"),
              })}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {t("dashboard.mainContent.welcome.message")}
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

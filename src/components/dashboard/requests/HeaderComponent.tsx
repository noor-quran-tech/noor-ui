import type { RootState } from "@store/store";
import type { TabPagination } from "@utils/types/public";
import { Role } from "@utils/types/user";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderComponentProps {
  activeTab: string;
  setActiveTab: (tab: "student" | "teacher") => void;
  studentPagination: TabPagination;
  teacherPagination: TabPagination;
}

const HeaderComponent = ({
  setActiveTab,
  activeTab,
  studentPagination,
  teacherPagination,
}: HeaderComponentProps) => {
  const { t } = useTranslation();

  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const loggedInUserRole = loggedInUser?.role;

  return (
    <div>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("dashboard.requests.header.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("dashboard.requests.header.subtitle")}{" "}
            {loggedInUserRole === Role.ADMIN
              ? t("dashboard.requests.header.subtitleAdminSuffix")
              : ""}
          </p>
        </div>
        <div>
          {loggedInUserRole !== Role.ADMIN && (
            <Link
              to="/request-subject"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm transition cursor-pointer"
            >
              {t("dashboard.requests.header.requestButton")}
            </Link>
          )}
        </div>
      </div>

      {/* Modern Horizontal Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        {loggedInUserRole === Role.ADMIN ||
        loggedInUserRole === Role.STUDENT ? (
          <button
            onClick={() => setActiveTab("student")}
            className={`py-3 px-5 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "student"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("dashboard.requests.header.tabs.student", {
              count: studentPagination.totalData,
            })}
          </button>
        ) : null}

        {loggedInUserRole === Role.ADMIN ||
        loggedInUserRole === Role.TEACHER ? (
          <button
            onClick={() => setActiveTab("teacher")}
            className={`py-3 px-5 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "teacher"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("dashboard.requests.header.tabs.teacher", {
              count: teacherPagination.totalData,
            })}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderComponent;

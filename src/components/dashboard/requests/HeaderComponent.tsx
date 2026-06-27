import type { RootState } from "@store/store";
import type { TabPagination } from "@utils/types/public";
import { Role } from "@utils/types/user";
import { useSelector } from "react-redux";

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
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const loggedInUserRole = loggedInUser.role;
  return (
    <div>
      {" "}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Subject Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review and manage subject requests{" "}
          {loggedInUserRole === Role.ADMIN
            ? `from students
          and teachers.`
            : ""}
        </p>
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
            Student ({studentPagination.totalData})
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
            Teacher ({teacherPagination.totalData})
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderComponent;

import { useTranslation } from "react-i18next";

interface HeaderTabsProbs {
  handleTabChange: (tab: string) => void;
  activeTab: string;
}

const HeaderTabs = ({ handleTabChange, activeTab }: HeaderTabsProbs) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
          {t("dashboard.userManagement.headerTabs.title")}
        </h1>
        <p className="text-xs text-neutral-400">
          {t("dashboard.userManagement.headerTabs.subtitle")}
        </p>
      </div>

      {/* Modern Segmented Tab Bar Switch */}
      <div className="flex bg-neutral-100 p-1 rounded-xl w-fit self-start sm:self-auto">
        <button
          onClick={() => handleTabChange("teachers")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer ${
            activeTab === "teachers"
              ? "bg-white text-teal-600 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {t("dashboard.userManagement.headerTabs.teachers")}
        </button>

        <button
          onClick={() => handleTabChange("students")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer ${
            activeTab === "students"
              ? "bg-white text-teal-600 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {t("dashboard.userManagement.headerTabs.students")}
        </button>
      </div>
    </div>
  );
};

export default HeaderTabs;

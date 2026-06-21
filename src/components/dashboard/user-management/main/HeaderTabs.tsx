interface HeaderTabsProbs {
  handleTabChange: (tab: string) => void;
  activeTab: string;
}

const HeaderTabs = ({ handleTabChange, activeTab }: HeaderTabsProbs) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
          System Users
        </h1>
        <p className="text-xs text-neutral-400">View and update users</p>
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
          Teachers
        </button>

        <button
          onClick={() => handleTabChange("students")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer ${
            activeTab === "students"
              ? "bg-white text-teal-600 shadow-xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Students
        </button>
      </div>
    </div>
  );
};

export default HeaderTabs;

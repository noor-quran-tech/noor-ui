import type { RootState } from "@store/store";
import type { TabPagination } from "@utils/types/public";
import type {
  ReviewStatus,
  StudentSubjectRequest,
  TeacherSubjectRequest,
} from "@utils/types/subject";
import { Role } from "@utils/types/user";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

interface TableComponentProps {
  loading: boolean;
  activeTab: "student" | "teacher";
  studentRequests: StudentSubjectRequest[];
  teacherRequests: TeacherSubjectRequest[];
  getStatusBadge: (status: ReviewStatus) => string;
  openAuditModal: (
    req: StudentSubjectRequest | TeacherSubjectRequest,
    type: "student" | "teacher",
  ) => void;
  currentPagination: TabPagination;
  handlePageChange: (newPage: number, type: "student" | "teacher") => void;
}

const TableComponent = ({
  loading,
  activeTab,
  studentRequests,
  getStatusBadge,
  openAuditModal,
  teacherRequests,
  currentPagination,
  handlePageChange,
}: TableComponentProps) => {
  const { t, i18n } = useTranslation();

  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const loggedInUserRole = loggedInUser?.role;
  const isArabic = i18n.language === "ar";

  const formatStatus = (status: ReviewStatus) => {
    return t(`statuses.${status}` as const, status.replace("_", " "));
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center min-h-75">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">
                    {t("dashboard.requests.table.headers.profile")}
                  </th>
                  <th className="p-4">
                    {t("dashboard.requests.table.headers.subject")}
                  </th>
                  <th className="p-4">
                    {t("dashboard.requests.table.headers.status")}
                  </th>
                  <th className="p-4">
                    {t("dashboard.requests.table.headers.date")}
                  </th>
                  <th className="p-4">
                    {t("dashboard.requests.table.headers.reviewedBy")}
                  </th>
                  <th className="p-4">
                    {t("dashboard.requests.table.headers.reviewNotes")}
                  </th>
                  {loggedInUserRole === Role.ADMIN ? (
                    <th className="p-4 text-center">
                      {t("dashboard.requests.table.headers.actions")}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {activeTab === "student" ? (
                  studentRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-slate-400 italic"
                      >
                        {t("dashboard.requests.table.empty.student")}
                      </td>
                    </tr>
                  ) : (
                    studentRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">
                            {req.student.user.firstName}{" "}
                            {req.student.user.lastName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {req.student.user.email}
                          </div>
                          <span className="inline-block mt-1.5 text-[10px] bg-slate-100 text-slate-600 font-mono font-medium px-1.5 py-0.5 rounded">
                            {t("dashboard.requests.table.labels.level", {
                              level: t(
                                `levels.${req.student.level.toLowerCase()}`,
                              ),
                            })}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-teal-600">
                          {req.subject.name}
                        </td>
                        <td className="p-4">
                          <span className={getStatusBadge(req.status)}>
                            {formatStatus(req.status)}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                          {new Date(req.createdAt).toLocaleDateString(
                            isArabic ? "ar-EG" : "en-US",
                            { dateStyle: "medium" },
                          )}
                        </td>
                        <td className="p-4">
                          {req.reviewedBy ? (
                            <div>
                              <div className="font-medium text-slate-800">
                                {req.reviewedBy.firstName}{" "}
                                {req.reviewedBy.lastName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {req.reviewedBy.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-400">
                              {t("dashboard.requests.table.labels.notReviewed")}
                            </span>
                          )}
                        </td>
                        <td
                          className="p-4 max-w-[220px] text-xs text-slate-500 break-words overflow-wrap-anywhere"
                          title={req.reviewNotes || ""}
                        >
                          {req.reviewNotes ? (
                            req.reviewNotes
                          ) : (
                            <span className="italic text-slate-400/70">
                              {t("dashboard.requests.table.labels.noNotes")}
                            </span>
                          )}
                        </td>
                        {loggedInUserRole === Role.ADMIN ? (
                          <td className="p-4 text-center">
                            <button
                              onClick={() => openAuditModal(req, "student")}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-teal-200 text-teal-600 bg-teal-50/50 hover:bg-teal-600 hover:text-white transition-all duration-150 cursor-pointer"
                            >
                              {t("dashboard.requests.table.buttons.review")}
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  )
                ) : teacherRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-slate-400 italic"
                    >
                      {t("dashboard.requests.table.empty.teacher")}
                    </td>
                  </tr>
                ) : (
                  teacherRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">
                          {req.teacher.user.firstName}{" "}
                          {req.teacher.user.lastName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {req.teacher.user.email}
                        </div>
                        <span className="inline-block mt-1.5 text-[10px] bg-slate-100 text-slate-600 font-mono font-medium px-1.5 py-0.5 rounded">
                          {t("dashboard.requests.table.labels.experience", {
                            years: req.teacher.yearsOfExperience ?? 0,
                          })}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-teal-600">
                        {req.subject.name}
                      </td>
                      <td className="p-4">
                        <span className={getStatusBadge(req.status)}>
                          {formatStatus(req.status)}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString(
                          i18n.language,
                          { dateStyle: "medium" },
                        )}
                      </td>
                      <td className="p-4">
                        {req.reviewedBy ? (
                          <div>
                            <div className="font-medium text-slate-800">
                              {req.reviewedBy.firstName}{" "}
                              {req.reviewedBy.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {req.reviewedBy.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs italic text-slate-400">
                            {t("dashboard.requests.table.labels.notReviewed")}
                          </span>
                        )}
                      </td>
                      <td
                        className="p-4 max-w-[220px] text-xs text-slate-500 break-words overflow-wrap-anywhere"
                        title={req.reviewNotes || ""}
                      >
                        {req.reviewNotes ? (
                          req.reviewNotes
                        ) : (
                          <span className="italic text-slate-400/70">
                            {t("dashboard.requests.table.labels.noNotes")}
                          </span>
                        )}
                      </td>
                      {loggedInUserRole === Role.ADMIN ? (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => openAuditModal(req, "teacher")}
                            className="px-3 py-1 text-xs font-semibold rounded-lg border border-teal-200 text-teal-600 bg-teal-50/50 hover:bg-teal-600 hover:text-white transition-all duration-150 cursor-pointer"
                          >
                            {t("dashboard.requests.table.buttons.review")}
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Type-Safe Pagination Interface Toolbar */}
          {currentPagination.totalPages > 1 && (
            <div className="p-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs font-medium text-slate-500">
                {t("dashboard.requests.table.pagination.info", {
                  current: currentPagination.currentPage,
                  total: currentPagination.totalPages,
                })}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPagination.currentPage === 1}
                  onClick={() =>
                    handlePageChange(
                      currentPagination.currentPage - 1,
                      activeTab,
                    )
                  }
                  className="cursor-pointer px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg shadow-sm bg-white text-slate-700 disabled:opacity-40 transition-opacity hover:bg-slate-50"
                >
                  {t("dashboard.requests.table.buttons.previous")}
                </button>
                <button
                  disabled={
                    currentPagination.currentPage ===
                    currentPagination.totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPagination.currentPage + 1,
                      activeTab,
                    )
                  }
                  className="cursor-pointer px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg shadow-sm bg-white text-slate-700 disabled:opacity-40 transition-opacity hover:bg-slate-50"
                >
                  {t("dashboard.requests.table.buttons.next")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableComponent;

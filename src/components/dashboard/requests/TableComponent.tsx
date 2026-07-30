import type { RootState } from "@store/store";
import type { TabPagination } from "@utils/types/public";
import type {
  ReviewStatus,
  StudentSubjectRequest,
  TeacherSubjectRequest,
} from "@utils/types/subject";
import { Role } from "@utils/types/user";
import { useSelector } from "react-redux";

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
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const loggedInUserRole = loggedInUser.role;
  console.log("loggedInUserRole", loggedInUserRole);
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center min-h-75">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Profile</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Reviewed By</th>
                  <th className="p-4">Review Notes</th>
                  {loggedInUserRole === Role.ADMIN ? (
                    <th className="p-4 text-center">Actions</th>
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
                        No student requests found.
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
                            Lvl: {req.student.level}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-teal-600">
                          {req.subject.name}
                        </td>
                        <td className="p-4">
                          <span className={getStatusBadge(req.status)}>
                            {req.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                          {new Date(req.createdAt).toLocaleDateString(
                            undefined,
                            { dateStyle: "medium" },
                          )}
                        </td>
                        <td className="p-4">
                          {req.reviewedBy ? (
                            <div>
                              <div className="font-medium text-slate-800">
                                {req.reviewedBy.firstName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {req.reviewedBy.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-400">
                              Not reviewed
                            </span>
                          )}
                        </td>
                        <td
                          className="p-4 max-w-[250] wrap-break-word text-xs text-slate-500"
                          title={req.reviewNotes || ""}
                        >
                          {req.reviewNotes || (
                            <span className="italic text-slate-400/70">
                              No notes
                            </span>
                          )}
                        </td>
                        {loggedInUserRole === Role.ADMIN ? (
                          <td className="p-4 text-center">
                            <button
                              onClick={() => openAuditModal(req, "student")}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-teal-200 text-teal-600 bg-teal-50/50 hover:bg-teal-600 hover:text-white transition-all duration-150 cursor-pointer"
                            >
                              Review
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
                      No teacher requests found.
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
                          Exp: {req.teacher.yearsOfExperience ?? 0} yrs
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-teal-600">
                        {req.subject.name}
                      </td>
                      <td className="p-4">
                        <span className={getStatusBadge(req.status)}>
                          {req.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </td>
                      <td className="p-4">
                        {req.reviewedBy ? (
                          <div>
                            <div className="font-medium text-slate-800">
                              {req.reviewedBy.firstName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {req.reviewedBy.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs italic text-slate-400">
                            Not reviewed
                          </span>
                        )}
                      </td>
                      <td
                        className="p-4 max-w-xs truncate text-xs text-slate-500"
                        title={req.reviewNotes || ""}
                      >
                        {req.reviewNotes || (
                          <span className="italic text-slate-400/70">
                            No notes
                          </span>
                        )}
                      </td>
                      {loggedInUserRole === Role.ADMIN ? (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => openAuditModal(req, "teacher")}
                            className="px-3 py-1 text-xs font-semibold rounded-lg border border-teal-200 text-teal-600 bg-teal-50/50 hover:bg-teal-600 hover:text-white transition-all duration-150 cursor-pointer"
                          >
                            Review
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
                Page {currentPagination.currentPage} of{" "}
                {currentPagination.totalPages}
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
                  Previous
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
                  Next
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

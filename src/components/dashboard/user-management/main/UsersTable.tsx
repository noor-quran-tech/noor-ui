import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { UserRecord } from "@pages/dashboard/UserManagement";
import type { PaginationParams } from "@utils/types/public";

interface UserTableProps {
  loading: boolean;
  users: UserRecord[];
  activeTab: string;
  handleUserDelete: (account: UserRecord) => void;
  handleActivateUser: (account: UserRecord) => void;
  pagination: PaginationParams;
  handlePageChange: (page: number) => void;
}

const UsersTable = ({
  loading,
  users,
  activeTab,
  handleUserDelete,
  handleActivateUser,
  pagination,
  handlePageChange,
}: UserTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      {loading ? (
        /* Animated Skeleton Loading State UI UX */
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-full bg-neutral-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        /* Empty Search Array Fallback Indicator */
        <div className="p-12 text-center">
          <p className="text-sm font-semibold text-neutral-500">
            {t("dashboard.userManagement.usersTable.emptyTitle", {
              tab: t(`dashboard.userManagement.${activeTab}`),
            })}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {t("dashboard.userManagement.usersTable.emptyDescription", {
              tab: t(`dashboard.userManagement.${activeTab}`),
            })}
          </p>
        </div>
      ) : (
        /* Standard Normalized Clean Master Table Output */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-6">
                  {t("dashboard.userManagement.usersTable.headers.image")}
                </th>
                <th className="py-3 px-6">
                  {t("dashboard.userManagement.usersTable.headers.name")}
                </th>
                <th className="py-3 px-6">
                  {t("dashboard.userManagement.usersTable.headers.email")}
                </th>
                <th className="py-3 px-6">
                  {t("dashboard.userManagement.usersTable.headers.phone")}
                </th>
                <th className="py-3 px-6">
                  {t("dashboard.userManagement.usersTable.headers.country")}
                </th>
                <th className="py-3 px-6">
                  {t(
                    "dashboard.userManagement.usersTable.headers.registrationDate",
                  )}
                </th>
                <th className="py-3 px-6">
                  {t("dashboard.userManagement.usersTable.headers.isActive")}
                </th>
                <th className="py-3 px-6 text-center">
                  {t("dashboard.userManagement.usersTable.headers.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 text-xs">
              {users.map((account) => (
                <tr
                  key={account.id}
                  className="hover:bg-neutral-50/70 transition duration-100"
                >
                  {/* User Initials and Compound Name */}
                  {/* TODO: Give the real image if no image fallback to this */}
                  <td className="py-3.5 px-6 font-bold text-neutral-900 flex items-center gap-3">
                    <div className="h-7 w-7 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-[11px] text-neutral-600 border border-neutral-200 uppercase">
                      {account.user.firstName?.charAt(0)}
                      {account.user.lastName?.charAt(0)}
                    </div>
                  </td>

                  {/* Name Details */}
                  <td className="py-3.5 px-6 text-neutral-500 font-medium">
                    {account.user.firstName} {account.user.lastName}
                  </td>

                  {/* Email Details */}
                  <td className="py-3.5 px-6 text-neutral-500 font-medium">
                    {account.user.email}
                  </td>

                  {/* Phone Number Details */}
                  <td className="py-3.5 px-6 text-neutral-500 font-medium">
                    {account.phoneNumber}
                  </td>

                  {/* Country Details */}
                  <td className="py-3.5 px-6 text-neutral-500 font-medium">
                    {account.country}
                  </td>

                  {/* Date Formatting */}
                  <td className="py-3.5 px-6 text-neutral-400 font-medium">
                    {account.createdAt
                      ? new Date(account.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )
                      : t("dashboard.userManagement.usersTable.na")}
                  </td>

                  {/* Is Active */}
                  <td
                    className={`py-3.5 px-6 text-neutral-400 font-medium ${
                      !account.user.isActive ? "text-red-500" : "text-teal-500"
                    }`}
                  >
                    {account.user.isActive
                      ? t("dashboard.userManagement.usersTable.status.active")
                      : t(
                          "dashboard.userManagement.usersTable.status.inactive",
                        )}
                  </td>

                  {/* Control Buttons */}
                  <td className="py-3.5 px-6 text-center">
                    <Link
                      to={`${account.user.role.toLowerCase()}s/${account.id}`}
                      className="text-[11px] font-bold text-neutral-600 hover:text-neutral-800 bg-neutral-50 hover:bg-neutral-100/80 px-2.5 py-1 rounded-md transition duration-150 cursor-pointer"
                    >
                      {t("dashboard.userManagement.usersTable.actions.view")}
                    </Link>
                    <button
                      onClick={() => {
                        if (account.user.isActive) {
                          handleUserDelete(account);
                        } else {
                          handleActivateUser(account);
                        }
                      }}
                      className={`mx-3 text-[11px] font-bold ${
                        account.user.isActive
                          ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100/80"
                          : "text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80"
                      } px-2.5 py-1 rounded-md transition duration-150 cursor-pointer`}
                    >
                      {account.user.isActive
                        ? t(
                            "dashboard.userManagement.usersTable.actions.delete",
                          )
                        : t(
                            "dashboard.userManagement.usersTable.actions.activate",
                          )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================================================
            PAGINATION BUTTON CONTROLLER SHELL
            ==================================================== */}
      {users.length > 0 && (
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-neutral-400">
            {t("dashboard.userManagement.usersTable.pagination.page")}{" "}
            <strong>{pagination.currentPage}</strong>{" "}
            {t("dashboard.userManagement.usersTable.pagination.of")}{" "}
            {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
              className="px-3 py-1.5 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {t("dashboard.userManagement.usersTable.pagination.prev")}
            </button>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage === pagination.totalPages || loading
              }
              className="px-3 py-1.5 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {t("dashboard.userManagement.usersTable.pagination.next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;

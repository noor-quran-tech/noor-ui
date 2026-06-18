import { useEffect, useState } from "react";
import axiosAPI from "@lib/axios";
import { toast } from "sonner";
import type { VerificationStatus } from "@utils/types/user";
import { Link } from "react-router-dom";

// Define strict TypeScript shapes for your data representation
interface UserRecord {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  country: string;
  phoneNumber: string;
  createdAt: string;
  verificationStatus: VerificationStatus;
}

interface MetaPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  // 1. Core Component States
  const [activeTab, setActiveTab] = useState<"teachers" | "students">(
    "teachers",
  );
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<MetaPagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: ITEMS_PER_PAGE,
  });

  // 2. Fetch Data Based on Active Tab and Page State
  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const endpoint = activeTab === "teachers" ? "/teachers" : "/students";

        const response = await axiosAPI.get(endpoint, {
          params: {
            page: pagination.currentPage,
            limit: ITEMS_PER_PAGE,
          },
        });

        setUsers(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
          totalUsers: response.data.total || response.data.data?.length || 0,
        }));
      } catch {
        toast.error(`Failed to load ${activeTab}. Please try again.`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [activeTab, pagination.currentPage]);

  // Reset page counter back to 1 if user flips tabs mid-stream
  const handleTabChange = (tab: "teachers" | "students") => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleUserDelete = (account: UserRecord) => {
    toast.dismiss();
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-md flex flex-col gap-3 max-w-xs">
          <p className="text-xs text-neutral-800">
            Are you sure you want to delete{" "}
            <strong>
              {account.user.firstName} {account.user.lastName}
            </strong>
            ?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-2.5 py-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t); // 1. Dismiss the confirmation box instantly

                try {
                  // 2. Make the API call
                  const endpoint = `/users/${account.user.id}`;
                  await axiosAPI.delete(endpoint);
                  setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                      u.id === account.id
                        ? { ...u, user: { ...u.user, isActive: false } }
                        : u,
                    ),
                  );
                  toast.success("Deleted successfully");
                } catch {
                  toast.error("Failed to delete user");
                } finally {
                  toast.dismiss(t);
                }
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-red-500 text-white rounded-lg cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const handleActivateUser = (account: UserRecord) => {
    toast.dismiss();
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-md flex flex-col gap-3 max-w-xs">
          <p className="text-xs text-neutral-800">
            Are you sure you want to activate{" "}
            <strong>
              {account.user.firstName} {account.user.lastName}
            </strong>
            ?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-2.5 py-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t); // 1. Dismiss the confirmation box instantly

                try {
                  // 2. Make the API call
                  const endpoint = `/users/${account.user.id}/reactivate`;
                  await axiosAPI.post(endpoint);

                  setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                      u.id === account.id
                        ? { ...u, user: { ...u.user, isActive: true } }
                        : u,
                    ),
                  );

                  toast.success(
                    `${account.user.firstName} reactivated successfully`,
                  );
                } catch {
                  toast.error("Failed to activate user");
                } finally {
                  toast.dismiss(t);
                }
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-red-500 text-white rounded-lg cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ====================================================
          PANEL HEADER & TABS CONTROL ROW
         ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
            System Records
          </h1>
          <p className="text-xs text-neutral-400">
            View and update directory registrations
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

      <div className="flex items-center justify-between px-2">
        <div className="bg-neutral-200/60 border border-neutral-300/40 px-2.5 py-1 rounded-full text-xs font-bold text-neutral-600 shadow-2xs">
          Total Accounts:{" "}
          <span className="text-neutral-900 font-black">
            {pagination.totalUsers}
          </span>
        </div>
      </div>

      {/* ====================================================
          DATA TABLE / GRID VIEW CONTAINER
         ==================================================== */}
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
              No {activeTab} found
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              There are currently no {activeTab} logged under this database
              filter category.
            </p>
          </div>
        ) : (
          /* Standard Normalized Clean Master Table Output */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-6">Image</th>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Phone Number</th>
                  <th className="py-3 px-6">Country</th>
                  <th className="py-3 px-6">Registration Date</th>
                  <th className="py-3 px-6">Is Active</th>
                  <th className="py-3 px-6 text-center">Actions</th>
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
                        ? new Date(account.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* Is Active */}
                    <td
                      className={`py-3.5 px-6 text-neutral-400 font-medium ${!account.user.isActive ? "text-red-500" : "text-teal-500"}`}
                    >
                      {account.user.isActive ? "Active" : "Inactive"}
                    </td>

                    {/* Control Buttons */}
                    <td className="py-3.5 px-6 text-center">
                      <Link
                        to={`${account.user.role.toLowerCase()}s/${account.id}`}
                        className="text-[11px] font-bold text-neutral-600 hover:text-neutral-800 bg-neutral-50 hover:bg-neutral-100/80 px-2.5 py-1 rounded-md transition duration-150 cursor-pointer"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          if (account.user.isActive) {
                            handleUserDelete(account);
                          } else {
                            handleActivateUser(account);
                          }
                        }}
                        className={`mx-3 text-[11px] font-bold ${account.user.isActive ? "text-red-600 hover:text-red-800  bg-red-50 hover:bg-red-100/80" : "text-teal-600 hover:text-teal-800  bg-teal-50 hover:bg-teal-100/80"}  px-2.5 py-1 rounded-md transition duration-150 cursor-pointer`}
                      >
                        {account.user.isActive ? "Delete" : "Activate"}
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
              Page <strong>{pagination.currentPage}</strong> of{" "}
              {pagination.totalPages}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="px-3 py-1.5 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ◀ Prev
              </button>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
                className="px-3 py-1.5 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

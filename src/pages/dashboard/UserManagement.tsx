import { useEffect, useState } from "react";
import axiosAPI from "@lib/axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { VerificationStatus } from "@utils/types/user";
import HeaderTabs from "@components/dashboard/user-management/main/HeaderTabs";
import UsersTable from "@components/dashboard/user-management/main/UsersTable";
import type { PaginationParams } from "@utils/types/public";

// Define strict TypeScript shapes for your data representation
export interface UserRecord {
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

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const { t } = useTranslation();

  // 1. Core Component States
  const [activeTab, setActiveTab] = useState<"teachers" | "students">(
    "teachers",
  );
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationParams>({
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
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
          totalData: response.data.total || response.data.data?.length || 0,
        }));
      } catch {
        toast.error(
          t("dashboard.userManagement.loadError", {
            tab: t(`dashboard.userManagement.${activeTab}`),
          }),
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [activeTab, pagination.currentPage, t]);

  // Reset page counter back to 1 if user flips tabs mid-stream
  const handleTabChange = (tab: string) => {
    if (tab === "teachers" || tab === "students") {
      setActiveTab(tab);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleUserDelete = (account: UserRecord) => {
    toast.dismiss();
    toast.custom(
      (tId) => (
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-md flex flex-col gap-3 max-w-xs">
          <p className="text-xs text-neutral-800">
            {t("dashboard.userManagement.deleteConfirmation")}{" "}
            <strong>
              {account.user.firstName} {account.user.lastName}
            </strong>
            ?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(tId)}
              className="px-2.5 py-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
            >
              {t("dashboard.userManagement.cancel")}
            </button>

            <button
              onClick={async () => {
                toast.dismiss(tId); // 1. Dismiss the confirmation box instantly

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
                  toast.success(t("dashboard.userManagement.deleteSuccess"));
                } catch {
                  toast.error(t("dashboard.userManagement.deleteError"));
                } finally {
                  toast.dismiss(tId);
                }
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-red-500 text-white rounded-lg cursor-pointer"
            >
              {t("dashboard.userManagement.confirm")}
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
      (tId) => (
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-md flex flex-col gap-3 max-w-xs">
          <p className="text-xs text-neutral-800">
            {t("dashboard.userManagement.activateConfirmation")}{" "}
            <strong>
              {account.user.firstName} {account.user.lastName}
            </strong>
            ?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(tId)}
              className="px-2.5 py-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
            >
              {t("dashboard.userManagement.cancel")}
            </button>

            <button
              onClick={async () => {
                toast.dismiss(tId); // 1. Dismiss the confirmation box instantly

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
                    t("dashboard.userManagement.activateSuccess", {
                      name: account.user.firstName,
                    }),
                  );
                } catch {
                  toast.error(t("dashboard.userManagement.activateError"));
                } finally {
                  toast.dismiss(tId);
                }
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-red-500 text-white rounded-lg cursor-pointer"
            >
              {t("dashboard.userManagement.confirm")}
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
      <HeaderTabs handleTabChange={handleTabChange} activeTab={activeTab} />

      <div className="flex items-center justify-between px-2">
        <div className="bg-neutral-200/60 border border-neutral-300/40 px-2.5 py-1 rounded-full text-xs font-bold text-neutral-600 shadow-2xs">
          {t("dashboard.userManagement.totalAccounts")}{" "}
          <span className="text-neutral-900 font-black">
            {pagination.totalData}
          </span>
        </div>
      </div>

      {/* ====================================================
          DATA TABLE / GRID VIEW CONTAINER
         ==================================================== */}
      <UsersTable
        loading={loading}
        users={users}
        activeTab={activeTab}
        handleUserDelete={handleUserDelete}
        handleActivateUser={handleActivateUser}
        pagination={pagination}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default UserManagement;

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import axiosAPI from "@lib/axios";
import { resolveApiErrorMessage } from "@lib/errorMessage";

interface CreateSubscriptionModalProps {
  fetchSubscriptions?: () => void;
}

interface StudentOption {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface PlanOption {
  id: string;
  name: string;
  price: string;
}

const CreateSubscriptionModal = ({
  fetchSubscriptions,
}: CreateSubscriptionModalProps) => {
  const { t } = useTranslation();

  // Admin Create Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [formData, setFormData] = useState({ userId: "", planId: "" });

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchOptions = async () => {
      setOptionsLoading(true);
      try {
        const [studentsResponse, plansResponse] = await Promise.all([
          axiosAPI.get("/students"),
          axiosAPI.get("/subscription-plans"),
        ]);

        setStudents(studentsResponse.data.data || []);
        setPlans(plansResponse.data.data || []);
      } catch (err: unknown) {
        const message = resolveApiErrorMessage(
          err,
          t,
          t("subscriptionDashboard.modal.toasts.loadOptionsError"),
        );
        toast.error(message);
        setStudents([]);
        setPlans([]);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [isModalOpen, t]);

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.planId) {
      toast.error(t("subscriptionDashboard.modal.toasts.requiredFields"));
      return;
    }

    setCreateLoading(true);
    try {
      await axiosAPI.post("/subscriptions", {
        userId: formData.userId,
        planId: formData.planId,
      });
      toast.success(t("subscriptionDashboard.modal.toasts.createSuccess"));
      setIsModalOpen(false);
      setFormData({ userId: "", planId: "" });
      fetchSubscriptions?.();
    } catch (err: unknown) {
      const message = resolveApiErrorMessage(
        err,
        t,
        t("subscriptionDashboard.modal.toasts.createError"),
      );
      toast.error(message);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-700 cursor-pointer"
      >
        {t("subscriptionDashboard.createButton")}
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {t("subscriptionDashboard.modal.title")}
            </h3>
            <form onSubmit={handleCreateSubscription} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {t("subscriptionDashboard.modal.fields.student")}
                </label>
                <select
                  required
                  value={formData.userId}
                  disabled={optionsLoading}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none disabled:bg-neutral-100"
                >
                  <option value="">
                    {optionsLoading
                      ? t("subscriptionDashboard.modal.loadingStudents")
                      : t("subscriptionDashboard.modal.selectStudent")}
                  </option>
                  {students.map((student) => (
                    <option key={student.user.id} value={student.user.id}>
                      {student.user.firstName} {student.user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {t("subscriptionDashboard.modal.fields.plan")}
                </label>
                <select
                  required
                  value={formData.planId}
                  disabled={optionsLoading}
                  onChange={(e) =>
                    setFormData({ ...formData, planId: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none disabled:bg-neutral-100"
                >
                  <option value="">
                    {optionsLoading
                      ? t("subscriptionDashboard.modal.loadingPlans")
                      : t("subscriptionDashboard.modal.selectPlan")}
                  </option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {t(`subscriptionPlans.plans.${plan.name.toLowerCase()}`, {
                        defaultValue: plan.name,
                      })}{" "}
                      - ${plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  {t("subscriptionDashboard.modal.buttons.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={createLoading || optionsLoading}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
                >
                  {createLoading
                    ? t("subscriptionDashboard.modal.buttons.creating")
                    : t("subscriptionDashboard.modal.buttons.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSubscriptionModal;

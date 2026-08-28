import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { SubscriptionPlan } from "@utils/types/subscription";

import axiosAPI from "@lib/axios";
import { resolveApiErrorMessage } from "@lib/errorMessage";

interface PlanFormData {
  name: string;
  description: string;
  price: string;
}

const EMPTY_FORM: PlanFormData = { name: "", description: "", price: "" };

const SubscriptionPlans = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(EMPTY_FORM);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosAPI.get("/subscription-plans");
      setPlans(response.data?.data || []);
    } catch (err: unknown) {
      toast.error(
        resolveApiErrorMessage(
          err,
          t,
          t("subscriptionPlanManagement.messages.fetchError"),
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    (() => {
      fetchPlans();
    })();
  }, [fetchPlans]);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: String(plan.price),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(formData.price);
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error(t("subscriptionPlanManagement.messages.requiredFields"));
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error(t("subscriptionPlanManagement.messages.invalidPrice"));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
      };
      if (editingPlan) {
        await axiosAPI.patch(`/subscription-plans/${editingPlan.id}`, payload);
        toast.success(t("subscriptionPlanManagement.messages.updateSuccess"));
      } else {
        await axiosAPI.post("/subscription-plans", payload);
        toast.success(t("subscriptionPlanManagement.messages.createSuccess"));
      }
      setIsModalOpen(false);
      await fetchPlans();
    } catch (err: unknown) {
      toast.error(
        resolveApiErrorMessage(
          err,
          t,
          t("subscriptionPlanManagement.messages.saveError"),
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    if (!window.confirm(t("subscriptionPlanManagement.messages.deleteConfirm")))
      return;
    setDeletingId(plan.id);
    try {
      await axiosAPI.delete(`/subscription-plans/${plan.id}`);
      toast.success(t("subscriptionPlanManagement.messages.deleteSuccess"));
      await fetchPlans();
    } catch (err: unknown) {
      toast.error(
        resolveApiErrorMessage(
          err,
          t,
          t("subscriptionPlanManagement.messages.deleteError"),
        ),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-full border border-gold-300 bg-gold-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
            {t("subscriptionPlanManagement.badge")}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-neutral-900">
            {t("subscriptionPlanManagement.title")}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {t("subscriptionPlanManagement.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 cursor-pointer"
        >
          <Plus size={17} aria-hidden="true" />
          {t("subscriptionPlanManagement.createButton")}
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">
          {t("subscriptionPlanManagement.loading")}
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          {t("subscriptionPlanManagement.empty")}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {t(`subscriptionPlans.plans.${plan.name.toLowerCase()}`)}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {plan.description}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${plan.isActive === false ? "border-neutral-200 bg-neutral-100 text-neutral-500" : "border-teal-200 bg-teal-50 text-teal-700"}`}
                >
                  {plan.isActive === false
                    ? t("subscriptionPlanManagement.inactive")
                    : t("subscriptionPlanManagement.active")}
                </span>
              </div>
              <div className="mt-auto flex items-end justify-between border-t border-neutral-100 pt-6">
                <p className="text-2xl font-extrabold text-neutral-900">
                  {plan.currency || "$"} {plan.price}
                  <span className="ml-1 text-xs font-medium text-neutral-500">
                    {t("subscriptionPlanManagement.perMonth")}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(plan)}
                    aria-label={t("subscriptionPlanManagement.editButton")}
                    title={t("subscriptionPlanManagement.editButton")}
                    className="inline-flex h-9 w-9 items-center cursor-pointer justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(plan)}
                    disabled={deletingId === plan.id}
                    aria-label={t("subscriptionPlanManagement.deleteButton")}
                    title={t("subscriptionPlanManagement.deleteButton")}
                    className="inline-flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg border border-neutral-200 text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-neutral-100 p-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  {editingPlan
                    ? t("subscriptionPlanManagement.modal.editTitle")
                    : t("subscriptionPlanManagement.modal.createTitle")}
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  {t("subscriptionPlanManagement.modal.subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label={t("subscriptionPlanManagement.modal.close")}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("subscriptionPlanManagement.modal.name")}
                </span>
                <input
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("subscriptionPlanManagement.modal.description")}
                </span>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("subscriptionPlanManagement.modal.price")}
                </span>
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  value={formData.price}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  {t("subscriptionPlanManagement.modal.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
                >
                  {saving
                    ? t("subscriptionPlanManagement.modal.saving")
                    : t("subscriptionPlanManagement.modal.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default SubscriptionPlans;

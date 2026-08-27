import { useCallback, useEffect, useState } from "react";
import {
  SubscriptionStatus,
  type Subscription,
} from "@utils/types/subscription";
import axiosAPI from "@lib/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { Role } from "@utils/types/user";
import { Link } from "react-router-dom";

const ALL_STATUSES: SubscriptionStatus[] = Object.values(SubscriptionStatus);

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = loggedInUser.role === Role.ADMIN;

  const fetchSubscriptions = useCallback(async () => {
    try {
      const subscriptionsRes = await axiosAPI.get("/subscriptions");
      const subscriptionData = subscriptionsRes?.data?.data || [];
      setSubscriptions(subscriptionData);
    } catch (err) {
      toast.error("Error fetching subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (() => {
      fetchSubscriptions();
    })();
  }, [fetchSubscriptions]);

  // Handle Student Cancellation
  const handleCancelSubscription = async (id: string) => {
    toast.dismiss();
    toast.custom((tId) => (
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-md flex flex-col gap-3 max-w-xs">
        <p className="text-xs text-neutral-800">
          Are you sure Delete this subscription{" "}
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(tId)}
            className="px-2.5 py-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-700 cursor-pointer"
          >
            Dismiss
          </button>

          <button
            onClick={async () => {
              toast.dismiss(tId);
              setActionLoadingId(id);
              try {
                await axiosAPI.patch(`/subscriptions/${id}/cancel`);
                toast.success("Subscription cancelled successfully");
                fetchSubscriptions();
              } catch (err: any) {
                toast.error(
                  err?.response?.data?.message ||
                    "Failed to cancel subscription",
                );
              } finally {
                setActionLoadingId(null);
                toast.dismiss(tId);
              }
            }}
            className="px-2.5 py-1 text-[11px] font-bold bg-red-500 text-white rounded-lg cursor-pointer"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    ));
  };

  // Handle Admin Status Update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      await axiosAPI.patch(`/subscriptions/${id}/status`, {
        status: newStatus,
      });
      toast.success("Subscription status updated successfully");
      fetchSubscriptions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "TRIAL":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "CANCELLED":
        return "bg-error-bg text-error border-error/20";
      case "EXPIRED":
        return "bg-warning-bg text-warning border-warning/20";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  return (
    <section className=" py-12 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="inline-block rounded-full border border-gold-300 bg-gold-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
            Membership
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            {isAdmin ? "Subscriptions" : "My Subscriptions"}
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-neutral-500">
            Loading subscriptions...
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-600">
            No subscription records found.
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const studentProfilePath = `/dashboard/users/students/${sub.student?.id}`;
              const isCancelled = sub.status === SubscriptionStatus.CANCELLED;
              const canCancel =
                !isCancelled &&
                (sub.status === SubscriptionStatus.ACTIVE ||
                  sub.status === SubscriptionStatus.TRIAL);
              const isProcessing = actionLoadingId === sub.id;
              const subscriptionUser = sub.student?.user;
              const userName = [
                subscriptionUser?.firstName,
                subscriptionUser?.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={sub.id}
                  className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-teal-200 lg:flex-row lg:items-center lg:justify-between"
                >
                  {isAdmin && (
                    <div className="flex min-w-56 items-center gap-3 border-b border-neutral-100 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 rtl:lg:border-r-0 rtl:lg:border-l rtl:lg:pr-0 rtl:lg:pl-6">
                      {subscriptionUser?.profileImage ? (
                        <Link to={studentProfilePath}>
                          <img
                            src={subscriptionUser.profileImage}
                            alt={userName || "Student"}
                            className="h-12 w-12 rounded-full border-2 border-teal-100 object-cover cursor-pointer"
                          />
                        </Link>
                      ) : (
                        <Link to={studentProfilePath}>
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                            {userName
                              ? userName
                                  .split(" ")
                                  .map((name) => name[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()
                              : "?"}
                          </div>
                        </Link>
                      )}
                      <div className="min-w-0">
                        <Link to={studentProfilePath}>
                          <p className="truncate text-sm font-bold text-neutral-900">
                            {userName || "Student"}
                          </p>
                        </Link>
                        <p className="truncate text-xs text-neutral-500">
                          {subscriptionUser?.email || "No email"}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {sub.student?.phoneNumber || `ID: ${sub.studentId}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Subscription Info */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-3">
                      <h3 className="text-xl font-bold text-neutral-900">
                        {sub.plan?.name || "Subscription Plan"}
                      </h3>
                      <span
                        className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold uppercase ${getStatusBadgeClass(
                          sub.status,
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-600">
                      {sub.plan?.description}
                    </p>

                    <div className="mt-2 flex items-baseline gap-1 text-neutral-900">
                      <span className="text-2xl font-extrabold">
                        ${sub.priceAtPurchase || sub.plan?.price}
                      </span>
                      <span className="text-xs text-neutral-500">
                        / {sub.plan?.currency || "USD"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-3">
                    {/* Admin Action: Update Status for all cases */}
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-neutral-600">
                          Status:
                        </label>
                        <select
                          disabled={isProcessing}
                          value={sub.status}
                          onChange={(e) =>
                            handleUpdateStatus(sub.id, e.target.value)
                          }
                          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-teal-500 focus:outline-none disabled:opacity-50"
                        >
                          {ALL_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      /* Student Action: Cancel if NOT cancelled */
                      canCancel && (
                        <button
                          onClick={() => handleCancelSubscription(sub.id)}
                          disabled={isProcessing}
                          className="rounded-full bg-error-bg border border-error/20 px-5 py-2.5 text-xs font-bold text-error transition-all hover:bg-error hover:text-white disabled:opacity-50 cursor-pointer"
                        >
                          {isProcessing
                            ? "Cancelling..."
                            : "Cancel Subscription"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Subscriptions;

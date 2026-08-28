import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import type { SubscriptionPlan } from "@utils/types/subscription";
import type { RootState } from "@store/store";

import axiosAPI from "@lib/axios";
import { resolveApiErrorMessage } from "@lib/errorMessage";

const PLAN_FEATURES: Record<string, string[]> = {
  Basic: [
    "Access to basic courses",
    "Standard community support",
    "Weekly progress updates",
    "Course completion certificates",
  ],
  Pro: [
    "Access to all premium courses",
    "Priority 1-on-1 teacher support",
    "Interactive live Q&A sessions",
    "Custom learning milestones",
    "Downloadable offline resources",
  ],
  Premium: [
    "All Pro feature benefits",
    "Dedicated personal mentor",
    "Unlimited teacher bookings",
    "Career guidance sessions",
  ],
};

const SubscriptionPlansHome = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!loggedInUser) {
      navigate("/login", {
        state: { redirectTo: "/payment", planId: plan.id },
      });
      return;
    }
    navigate("/payment", {
      state: {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        description: plan.description,
      },
    });
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const plansResponse = await axiosAPI.get("/subscription-plans");
      const plansData = plansResponse?.data?.data;
      setPlans(plansData);
    } catch (err) {
      const errorMessage = resolveApiErrorMessage(
        err,
        t,
        t("subscriptionPlans.messages.fetchError"),
      );

      toast.error(t("subscriptionPlans.messages.fetchError"), {
        description: errorMessage,
      });
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (() => {
      fetchPlans();
    })();
  }, []);
  return (
    <section
      id="subscription-plans"
      className="scroll-mt-24 bg-neutral-50 px-4 py-20 sm:px-6 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-gold-300 bg-gold-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
            {t("subscriptionPlans.badge")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            {t("subscriptionPlans.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t("subscriptionPlans.description")}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-6">
          {loading ? (
            <p>{t("subscriptionPlans.loading")}</p>
          ) : (
            plans.map((plan) => {
              const isPopular = plan.name === "Pro";
              const features = PLAN_FEATURES[plan.name] ?? [];
              const translatedPlanName = t(
                `subscriptionPlans.plans.${plan.name.toLowerCase()}`,
                { defaultValue: plan.name },
              );

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                    isPopular
                      ? "z-10 bg-white text-neutral-900 shadow-2xl lg:-translate-y-2 lg:scale-105 border-2 border-teal-500 ring-4 ring-teal-500/10"
                      : "bg-white text-neutral-900 shadow-lg border border-neutral-200 hover:border-teal-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-teal-500 to-teal-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      {t("subscriptionPlans.mostPopular")}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {translatedPlanName}
                      </h3>
                      {isPopular && (
                        <span className="rounded-full bg-gold-500/20 px-3 py-1 text-sm font-semibold text-gold-300">
                          {t("subscriptionPlans.bestValue")}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        ${plan.price}
                      </span>
                      <span className="text-sm font-medium text-neutral-500">
                        {t("subscriptionPlans.month")}
                      </span>
                    </div>

                    <div className="my-8 h-px bg-neutral-100" />

                    <ul className="space-y-4 text-sm">
                      {features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3">
                          <svg
                            className="h-5 w-5 shrink-0 text-teal-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full cursor-pointer rounded-full py-3.5 px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 bg-neutral-900 text-white hover:bg-teal-600"
                    >
                      {t("subscriptionPlans.getStarted")}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlansHome;

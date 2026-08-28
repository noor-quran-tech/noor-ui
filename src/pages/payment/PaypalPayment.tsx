import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axiosAPI from "@lib/axios";
import { toast } from "sonner";
import { ArrowLeft, Check, CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { SubscriptionPlan } from "@utils/types/subscription";

type PaymentLocationState = {
  planId?: string;
  planName?: string;
  price?: string;
  description?: string;
};

const PaypalPayment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedState = (location.state as PaymentLocationState | null) ?? {};
  const [plan, setPlan] = useState<SubscriptionPlan | null>(
    selectedState.planId && selectedState.planName && selectedState.price
      ? {
          id: selectedState.planId,
          name: selectedState.planName,
          price: selectedState.price,
          description: selectedState.description ?? "",
          currency: "USD",
          isActive: true,
        }
      : null,
  );
  const [loadingPlan, setLoadingPlan] = useState(
    Boolean(selectedState.planId && !plan),
  );
  const [paymentError, setPaymentError] = useState(false);

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
  } as const;

  useEffect(() => {
    if (!selectedState.planId || plan) return;

    const loadPlan = async () => {
      try {
        const response = await axiosAPI.get("/subscription-plans");
        const plans = response.data?.data as SubscriptionPlan[];
        const selectedPlan = plans.find(
          ({ id }) => id === selectedState.planId,
        );
        if (!selectedPlan) throw new Error("Selected plan was not found");
        setPlan(selectedPlan);
      } catch {
        setPaymentError(true);
        toast.error(t("payment.messages.loadPlanError"));
      } finally {
        setLoadingPlan(false);
      }
    };

    void loadPlan();
  }, [plan, selectedState.planId, t]);

  const onCreateOrder = async () => {
    try {
      if (!plan?.id) throw new Error("A subscription plan is required");
      const response = await axiosAPI.post("/paypal/order", {
        planId: plan.id,
      });
      return response?.data?.orderId;
    } catch (err) {
      toast.error(t("payment.messages.createOrderError"));
      throw err;
    }
  };

  const onApprove = async (data: { orderID?: string }) => {
    try {
      if (!data?.orderID) {
        throw new Error("Invalid order Id");
      }

      await axiosAPI.get(`/paypal/capture-payment/${data.orderID}`);

      navigate("/complete-payment");
    } catch (err) {
      toast.error(t("payment.messages.captureError"));
      navigate("/cancel-payment");
      throw err;
    }
  };

  const onError = (err: unknown) => {
    let errorMessage = "An error occurred. Please try again.";
    const errorMessageDetails =
      err instanceof Error ? err.message : String(err);
    // Handle specific error codes
    if (errorMessageDetails.includes("INSUFFICIENT_FUNDS")) {
      errorMessage = t("payment.messages.insufficientFunds");
    } else if (errorMessageDetails.includes("INSTRUMENT_DECLINED")) {
      errorMessage = t("payment.messages.instrumentDeclined");
    } else if (errorMessageDetails.includes("TRANSACTION_REFUSED")) {
      errorMessage = t("payment.messages.transactionRefused");
    } else if (errorMessageDetails.includes("DUPLICATE_INVOICE")) {
      errorMessage = t("payment.messages.duplicateInvoice");
    }

    toast.error(errorMessage);
    navigate("/cancel-payment");
  };

  if (loadingPlan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-neutral-600">
        {t("payment.loading")}
      </div>
    );
  }

  if (paymentError || !plan) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          {t("payment.unavailableTitle")}
        </h1>
        <p className="text-neutral-600">
          {t("payment.unavailableDescription")}
        </p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700"
        >
          {t("payment.backToPlans")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-neutral-50 px-4 py-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 cursor-pointer hover:text-teal-900"
        >
          <ArrowLeft size={17} /> {t("payment.back")}
        </button>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="mb-8 flex items-start gap-4">
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gold-600">
                  {t("payment.badge")}
                </p>
                <h1 className="mt-1 text-3xl font-extrabold text-neutral-900">
                  {t("payment.title")}
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
                  {t("payment.subtitle")}
                </p>
              </div>
            </div>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={styles}
                createOrder={onCreateOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </PayPalScriptProvider>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <ShieldCheck size={16} className="text-teal-600" />{" "}
              {t("payment.secureCheckout")}
            </div>
          </section>
          <aside className="h-fit rounded-2xl border border-teal-100 bg-teal-900 p-7 text-white shadow-lg sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">
              {t("payment.orderSummary")}
            </p>
            <h2 className="mt-3 text-2xl font-bold">
              {t(`subscriptionPlans.plans.${plan.name.toLowerCase()}`, {
                defaultValue: plan.name,
              })}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-teal-100">
              {plan.description}
            </p>
            <div className="my-7 border-t border-teal-700" />
            <div className="flex items-end justify-between">
              <span className="text-sm text-teal-100">
                {t("payment.monthlyPlan")}
              </span>
              <span className="text-3xl font-extrabold">${plan.price}</span>
            </div>
            <ul className="mt-7 space-y-3 text-sm text-teal-50">
              <li className="flex gap-2">
                <Check size={17} className="shrink-0 text-gold-300" />{" "}
                {t("payment.instantAccess")}
              </li>
              <li className="flex gap-2">
                <Check size={17} className="shrink-0 text-gold-300" />{" "}
                {t("payment.cancelAnytime")}
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaypalPayment;

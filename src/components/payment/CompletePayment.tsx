import {
  CheckCircle2,
  ArrowRight,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CompletePayment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-70px)] bg-neutral-50 px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 text-teal-600 ring-8 ring-teal-50/70">
          <CheckCircle2 size={56} strokeWidth={1.7} />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          {t("payment.success.badge")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          {t("payment.success.title")}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          {t("payment.success.description")}
        </p>

        <div className="mt-10 grid w-full gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <ReceiptText className="text-teal-600" size={22} />
            <h2 className="mt-4 font-bold text-neutral-900">
              {t("payment.success.nextTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {t("payment.success.nextDescription")}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="text-gold-600" size={22} />
            <h2 className="mt-4 font-bold text-neutral-900">
              {t("payment.success.secureTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {t("payment.success.secureDescription")}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/subscriptions")}
          className="mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
        >
          {t("payment.success.viewSubscription")} <ArrowRight size={17} />
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-4 cursor-pointer text-sm font-semibold text-neutral-500 hover:text-teal-700"
        >
          {t("payment.success.backHome")}
        </button>
      </div>
    </div>
  );
};

export default CompletePayment;

import { ArrowLeft, CreditCard, RefreshCw, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CancelPayment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-70px)] bg-neutral-50 px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-50 text-gold-600 ring-8 ring-gold-50/70">
          <XCircle size={56} strokeWidth={1.7} />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          {t("payment.cancelled.badge")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          {t("payment.cancelled.title")}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          {t("payment.cancelled.description")}
        </p>

        <div className="mt-10 w-full rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm sm:p-8">
          <div className="flex gap-4">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
              <CreditCard size={22} />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">
                {t("payment.cancelled.helpTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {t("payment.cancelled.helpDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-teal-500 hover:text-teal-700"
          >
            <ArrowLeft size={17} /> {t("payment.cancelled.back")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
          >
            <RefreshCw size={17} /> {t("payment.cancelled.chooseAnother")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPayment;

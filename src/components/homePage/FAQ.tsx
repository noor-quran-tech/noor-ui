import i18n from "@/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const { t } = useTranslation();
  const faqItems = t("faq.items", { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];
  const isArabic = i18n.language === "ar";
  const handleOpenQuestion = (idx: number) => {
    if (openQuestion === idx + 1) setOpenQuestion(null);
    else setOpenQuestion(idx + 1);
  };

  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-neutral-900">
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-neutral-600">{t("faq.subtitle")}</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openQuestion === idx + 1;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
                ${
                  isOpen
                    ? "border-teal-500 bg-white shadow-md shadow-teal-100"
                    : "border-neutral-200 bg-white hover:border-teal-300 hover:shadow-md"
                }`}
                onClick={() => handleOpenQuestion(idx)}
              >
                <div
                  className={`flex items-center justify-between px-6 py-5 ${
                    isArabic ? "flex-row-reverse" : ""
                  }`}
                >
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {item.question}
                  </h3>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300
                    ${
                      isOpen
                        ? "rotate-180 bg-teal-500 text-white"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    ▼
                  </div>
                </div>

                {isOpen && (
                  <div
                    className={`animate-fade-in border-t border-neutral-100 px-6 py-5 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    <p className="leading-8 text-neutral-600">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-neutral-900">
              {t("faq.notFound")}
            </p>

            <Link
              to="/contact"
              className="mt-2 inline-block font-medium text-teal-600 transition-colors hover:text-teal-700"
            >
              {t("faq.contact")}→
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

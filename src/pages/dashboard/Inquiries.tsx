import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosAPI from "@lib/axios";
import type { PaginationParams } from "@utils/types/public";
import { toast } from "sonner";
import { InqueryTopic } from "@utils/types/inquery";

const ITEMS_PER_PAGE = 10;

interface Inquiry {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

const Inquiries = () => {
  const { t, i18n } = useTranslation();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationParams>({
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
    limit: ITEMS_PER_PAGE,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Selected inquiry for detail modal/drawer
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async (page: number) => {
    setLoading(true);
    try {
      const inquiriesRes = await axiosAPI.get("/inquiries", {
        params: { page, limit: ITEMS_PER_PAGE },
      });

      const data = inquiriesRes.data.data || [];
      const total = inquiriesRes.data.total || data.length || 0;
      const totalPages = inquiriesRes.data.totalPages || 1;

      setInquiries(data);
      setPagination({
        currentPage: page,
        totalPages: totalPages,
        totalData: total,
        limit: ITEMS_PER_PAGE,
      });
    } catch (err) {
      console.error(err);
      toast.error(t("dashboard.inquiries.toast.fetchError"));
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (() => {
      fetchInquiries(currentPage);
    })();
  }, [currentPage]);

  // Updated Topic Badge Styling
  const getTopicStyle = (topic: string) => {
    switch (topic) {
      case InqueryTopic.ACCOUNT_DEACTIVATED:
        return "bg-error-bg text-error border border-error/20";
      case InqueryTopic.TECHNICAL_SUPPORT:
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case InqueryTopic.BILLING_AND_ACCOUNTS:
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case InqueryTopic.FEEDBACK:
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case InqueryTopic.GENERAL_INQUIRY:
        return "bg-teal-50 text-teal-700 border border-teal-200";
      case InqueryTopic.OTHER:
      default:
        return "bg-neutral-100 text-neutral-700 border border-neutral-300";
    }
  };

  // Clean topic formatter pointing directly to i18n keys
  const formatTopicText = (topic: string) => {
    return t(`dashboard.inquiries.topics.${topic}`, {
      defaultValue: topic.replace(/_/g, " "),
    });
  };

  return (
    <div className="main-content min-h-screen bg-neutral-50 px-6 py-8 text-neutral-900 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
            {t("dashboard.inquiries.title")}
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {t("dashboard.inquiries.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto bg-white px-4 py-2 rounded-lg border border-neutral-200 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-sm font-semibold text-neutral-700">
            {t("dashboard.inquiries.totalMessages", {
              count: pagination.totalData,
            })}
          </span>
        </div>
      </div>

      {/* Main Table Interface */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            <p className="text-neutral-500 text-sm font-medium">
              {t("dashboard.inquiries.loading")}
            </p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 font-medium">
              {t("dashboard.inquiries.noMessages")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rtl:text-right">
              <thead>
                <tr className="bg-neutral-100/70 border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-600 font-bold">
                  <th className="py-4 px-6">
                    {t("dashboard.inquiries.table.sender")}
                  </th>
                  <th className="py-4 px-6">
                    {t("dashboard.inquiries.table.topic")}
                  </th>
                  <th className="py-4 px-6">
                    {t("dashboard.inquiries.table.message")}
                  </th>
                  <th className="py-4 px-6">
                    {t("dashboard.inquiries.table.date")}
                  </th>
                  <th className="py-4 px-6 text-right rtl:text-left">
                    {t("dashboard.inquiries.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-neutral-50/50 transition-colors duration-150 group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-neutral-800">
                        {inquiry.name}
                      </div>
                      <div className="text-neutral-500 text-xs">
                        {inquiry.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${getTopicStyle(inquiry.topic)}`}
                      >
                        {formatTopicText(inquiry.topic)}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-neutral-600">
                      {inquiry.message}
                    </td>
                    <td className="py-4 px-6 text-neutral-500 text-xs">
                      {new Date(inquiry.createdAt).toLocaleDateString(
                        i18n.language === "ar" ? "ar-EG" : "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </td>
                    <td className="py-4 px-6 text-right rtl:text-left">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 px-3 py-1.5 rounded-md transition-all border border-teal-200/40 cursor-pointer"
                      >
                        {t("dashboard.inquiries.table.viewDetails")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Custom Pagination Footer */}
        {!loading && inquiries.length > 0 && (
          <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between border-t border-neutral-200 text-sm">
            <span className="text-neutral-500 font-medium">
              {t("dashboard.inquiries.pagination.showingPage")}{" "}
              <strong className="text-neutral-800">{currentPage}</strong>{" "}
              {t("dashboard.inquiries.pagination.of")}{" "}
              <strong className="text-neutral-800">
                {pagination.totalPages}
              </strong>
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {t("dashboard.inquiries.pagination.previous")}
              </button>
              <button
                disabled={currentPage === pagination.totalPages || loading}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))
                }
                className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {t("dashboard.inquiries.pagination.next")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Detail Modal / Drawer overlay */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto animate-fade-in">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-5 mb-6">
                <div>
                  <span
                    className={`inline-block mb-2 px-2.5 py-0.5 rounded-md text-xs font-bold ${getTopicStyle(selectedInquiry.topic)}`}
                  >
                    {formatTopicText(selectedInquiry.topic)}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {t("dashboard.inquiries.drawer.title")}
                  </h3>
                </div>
                <button
                  aria-label={t("dashboard.inquiries.drawer.closeAria")}
                  onClick={() => setSelectedInquiry(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 font-bold transition-all text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                      {t("dashboard.inquiries.drawer.name")}
                    </label>
                    <p className="text-sm font-semibold text-neutral-800">
                      {selectedInquiry.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                      {t("dashboard.inquiries.drawer.email")}
                    </label>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-sm font-semibold text-teal-600 hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    {t("dashboard.inquiries.drawer.message")}
                  </label>
                  <div className="bg-white border border-neutral-200 p-5 rounded-xl text-neutral-700 whitespace-pre-wrap leading-relaxed shadow-xs text-sm">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    {t("dashboard.inquiries.drawer.details")}
                  </label>
                  <p className="text-xs text-neutral-500 mt-1">
                    {t("dashboard.inquiries.drawer.received")}{" "}
                    {new Date(selectedInquiry.createdAt).toLocaleString(
                      i18n.language === "ar" ? "ar-EG" : "en-US",
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons at drawer base */}
            <div className="border-t border-neutral-200 pt-6 mt-8 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 cursor-pointer"
              >
                {t("dashboard.inquiries.drawer.close")}
              </button>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${formatTopicText(selectedInquiry.topic)}`}
                className="px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs text-center transition-colors shadow-xs cursor-pointer"
              >
                {t("dashboard.inquiries.drawer.replyViaEmail")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;

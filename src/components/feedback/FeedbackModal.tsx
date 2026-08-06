import StarRating from "@components/helpers/StarRating";
import type { SessionFeedback } from "@utils/types/session";
import { Role } from "@utils/types/user";
import { LoaderCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FeedbackModalProps {
  setShowFeedbackForm: (value: boolean) => void;
  setIsFeedbackModalOpen: (value: boolean) => void;
  isFeedbackModalOpen: boolean;
  isFeedbackLoading: boolean;
  loggedInUserRole: string;
  feedbackSent: SessionFeedback | null;
  feedbackReceived: SessionFeedback | null;
}

const FeedbackModal = ({
  setShowFeedbackForm,
  setIsFeedbackModalOpen,
  isFeedbackModalOpen,
  isFeedbackLoading,
  feedbackSent,
  loggedInUserRole,
  feedbackReceived,
}: FeedbackModalProps) => {
  const { t } = useTranslation();

  const handleAddFeedback = () => {
    setShowFeedbackForm(true);
    setIsFeedbackModalOpen(false);
  };
  return (
    <div>
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {t("dashboard.sessions.feedbackModal.title")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 transition text-lg leading-none cursor-pointer"
                aria-label={t("dashboard.sessions.feedbackModal.close")}
              >
                ✕
              </button>
            </div>

            {!isFeedbackLoading ? (
              <div className="space-y-5">
                {/* Sent */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {t("dashboard.sessions.feedbackModal.sentHeader")}
                  </span>

                  {feedbackSent ? (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800">
                          {t(
                            "dashboard.sessions.feedbackModal.recipientLabel",
                            {
                              name: `${feedbackSent.receiver.firstName} ${feedbackSent.receiver.lastName}`,
                            },
                          )}
                        </span>
                        <StarRating value={feedbackSent.rating} />
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {feedbackSent.comment}
                      </p>
                    </div>
                  ) : loggedInUserRole !== Role.ADMIN ? (
                    <button
                      type="button"
                      onClick={handleAddFeedback}
                      className="w-full text-center py-2 text-xs font-bold bg-teal-800 hover:bg-teal-900 text-white rounded-xl transition tracking-wide cursor-pointer"
                    >
                      {t("dashboard.sessions.feedbackModal.addFeedbackBtn")}
                    </button>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      {t(
                        "dashboard.sessions.feedbackModal.noSentFeedbackAdmin",
                      )}
                    </p>
                  )}
                </div>

                <hr className="border-neutral-100" />

                {/* Received */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {t("dashboard.sessions.feedbackModal.receivedHeader")}
                  </span>

                  {feedbackReceived ? (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800">
                          {t(
                            "dashboard.sessions.feedbackModal.recipientLabel",
                            {
                              name: `${feedbackReceived.receiver.firstName} ${feedbackReceived.receiver.lastName}`,
                            },
                          )}
                        </span>
                        <StarRating value={feedbackReceived.rating} />
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {feedbackReceived.comment}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      {t("dashboard.sessions.feedbackModal.noReceivedFeedback")}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center flex">
                <LoaderCircleIcon />
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(false)}
              className="w-full mt-6 py-2 text-xs font-semibold border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 transition cursor-pointer"
            >
              {t("dashboard.sessions.feedbackModal.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackModal;

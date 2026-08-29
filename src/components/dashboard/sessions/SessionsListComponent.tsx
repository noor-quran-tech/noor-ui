import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { RootState } from "@store/store";
import {
  SessionStatus,
  type SessionData,
  type SessionFeedback,
} from "@utils/types/session";

import axiosAPI from "@lib/axios";
import { Role } from "@utils/types/user";
import FeedbackModal from "@components/feedback/FeedbackModal";
import FeedbackFormModal from "@components/feedback/FeedbackFormModal";
import i18n from "@/i18n";

interface SessionsListComponentProps {
  loading: boolean;
  sessions: SessionData[];
  handleOpenEditModal: (session: SessionData) => void;
  getStatusStyles: (status: string) => void;
}

const SessionsListComponent = ({
  loading,
  sessions,
  handleOpenEditModal,
  getStatusStyles,
}: SessionsListComponentProps) => {
  const { t } = useTranslation();

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] =
    useState<boolean>(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const loggedInUserRole = loggedInUser.role;
  const [feedbackReceived, setFeedbackReceived] =
    useState<SessionFeedback | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<SessionFeedback | null>(
    null,
  );
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);

  const isArabic = i18n.language === "ar";

  const handleSessionFeedback = async (session: SessionData) => {
    setFeedbackReceived(null);
    setFeedbackSent(null);
    setIsFeedbackModalOpen(true);
    setIsFeedbackLoading(true);
    setSessionId(session.id);

    const isStudentSender = loggedInUserRole === Role.STUDENT;
    const receiverId = isStudentSender
      ? session.teacher.user.id
      : session.student.user.id;
    setReceiverId(receiverId);
    try {
      const sessionFeedbackResponse = await axiosAPI.get(
        `/sessions/${session.id}/feedback`,
      );
      const sessionFeedback = sessionFeedbackResponse.data.data;
      setFeedbackSent(sessionFeedback.sent);
      setFeedbackReceived(sessionFeedback.received);
    } catch {
      toast.error(t("dashboard.sessions.list.errors.feedbackFetchTitle"), {
        description: t(
          "dashboard.sessions.list.errors.feedbackFetchDescription",
        ),
      });
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  return (
    <div>
      {/* Loading / Empty / List */}
      {loading ? (
        <div className="text-center py-20 text-sm font-medium text-neutral-400 animate-pulse">
          {t("dashboard.sessions.list.loading")}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-300 bg-white rounded-2xl text-neutral-400 text-sm font-medium">
          {t("dashboard.sessions.list.empty")}{" "}
          {loggedInUserRole === Role.ADMIN
            ? t("dashboard.sessions.list.adminEmptyHint")
            : ""}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700">
                    {session.subject?.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {loggedInUserRole !== Role.STUDENT ? (
                      <button
                        onClick={() => handleOpenEditModal(session)}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 transition mr-2 cursor-pointer"
                      >
                        {t("dashboard.sessions.list.actions.edit")}
                      </button>
                    ) : null}
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusStyles(
                        session.status,
                      )} ${isArabic ? "text-[12px]" : "text-[10px]"} `}
                    >
                      {t(
                        `dashboard.sessions.list.status.${session.status.toLowerCase()}`,
                        { defaultValue: session.status },
                      )}
                    </span>
                  </div>
                </div>
                <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  {session.title}
                </h2>
                <p className="text-xs text-neutral-500 leading-relaxed wrap-break-word overflow-wrap-anywhere whitespace-pre-wrap">
                  {session.description ||
                    t("dashboard.sessions.list.labels.noDescription")}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {t("dashboard.sessions.list.labels.teacher")}
                  </span>
                  <span className="font-bold text-neutral-800">
                    {session.teacher?.user
                      ? `${session.teacher.user.firstName} ${session.teacher.user.lastName}`
                      : t("dashboard.sessions.list.labels.notAvailable")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {t("dashboard.sessions.list.labels.student")}
                  </span>
                  <span className="font-bold text-neutral-800">
                    {session.student?.user
                      ? `${session.student.user.firstName} ${session.student.user.lastName}`
                      : t("dashboard.sessions.list.labels.notAvailable")}
                  </span>
                </div>
                <div className="col-span-2 pt-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {t("dashboard.sessions.list.labels.time")}
                  </span>
                  <span
                    className={`${isArabic ? "font-bold" : "font-medium"} font-mono  text-neutral-600`}
                  >
                    {new Date(session.startTime).toLocaleString(
                      isArabic ? "ar-EG" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}{" "}
                    -{" "}
                    {new Date(session.endTime).toLocaleTimeString(
                      isArabic ? "ar-EG" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={session.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-teal-300 rounded-xl transition tracking-wide shadow-inner block"
                >
                  {t("dashboard.sessions.list.actions.joinClass")}
                </a>
                {session.status === SessionStatus.COMPLETED && (
                  <button
                    className="w-full text-center py-2 text-xs font-bold text-neutral-900 hover:bg-teal-500 cursor-pointer bg-teal-300 rounded-xl transition tracking-wide shadow-inner block"
                    onClick={() => handleSessionFeedback(session)}
                  >
                    {t("dashboard.sessions.list.actions.sessionFeedback")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <FeedbackModal
        setShowFeedbackForm={setShowFeedbackForm}
        setIsFeedbackModalOpen={setIsFeedbackModalOpen}
        isFeedbackModalOpen={isFeedbackModalOpen}
        isFeedbackLoading={isFeedbackLoading}
        feedbackSent={feedbackSent}
        loggedInUserRole={loggedInUserRole}
        feedbackReceived={feedbackReceived}
      />

      <FeedbackFormModal
        receiverId={receiverId}
        sessionId={sessionId}
        setShowFeedbackForm={setShowFeedbackForm}
        showFeedbackForm={showFeedbackForm}
      />
    </div>
  );
};

export default SessionsListComponent;

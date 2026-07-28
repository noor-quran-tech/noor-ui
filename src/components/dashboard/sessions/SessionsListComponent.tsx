import { useState, type ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { isAxiosError } from "axios";

import type { RootState } from "@store/store";
import {
  SessionStatus,
  type SessionData,
  type SessionFeedback,
} from "@utils/types/session";

import axiosAPI from "@lib/axios";
import StarRating from "@components/helpers/StarRating";
import { Role } from "@utils/types/user";

interface SessionsListComponentProps {
  loading: boolean;
  sessions: SessionData[];
  handleOpenEditModal: (session: SessionData) => void;
  getStatusStyles: (status: string) => void;
}

interface FeedbackFormData {
  rating: number;
  comment: string;
}
const initalFeedbackFormState: FeedbackFormData = {
  rating: 0,
  comment: "",
};

const SessionsListComponent = ({
  loading,
  sessions,
  handleOpenEditModal,
  getStatusStyles,
}: SessionsListComponentProps) => {
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
  const [feedbackFormData, setFeedbackFormData] = useState<FeedbackFormData>(
    initalFeedbackFormState,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Error retreiving session feedback", {
        description: "Please try refreshing the page",
      });
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleFeedbackCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackFormData((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsSubmitting(true);

      const body = {
        receiverId,
        sessionId,
        ...feedbackFormData,
      };
      await axiosAPI.post("/feedbacks", body);
      toast.success("Feedback Sent Successfully");
      setShowFeedbackForm(false);
      setFeedbackFormData(initalFeedbackFormState);
    } catch (err) {
      let errMessage = "Error sending feedback";
      if (isAxiosError(err)) {
        console.warn("err.response", err.response);
        errMessage =
          err?.response?.data?.errors?.[0].message ||
          err?.response?.data?.message ||
          errMessage;
      } else if (err instanceof Error) {
        errMessage = err.message;
      }
      toast.error("Feedback Form Error", { description: errMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFeedback = () => {
    setShowFeedbackForm(true);
    setIsFeedbackModalOpen(false);
  };

  return (
    <div>
      {/* Loading / Empty / List */}
      {loading ? (
        <div className="text-center py-20 text-sm font-medium text-neutral-400 animate-pulse">
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-300 bg-white rounded-2xl text-neutral-400 text-sm font-medium">
          No sessions found.
          {loggedInUserRole === Role.ADMIN
            ? "Click the button above to add one."
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
                        Edit
                      </button>
                    ) : null}
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusStyles(session.status)}`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
                <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  {session.title}
                </h2>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {session.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Teacher
                  </span>
                  <span className="font-bold text-neutral-800">
                    {session.teacher?.user
                      ? `${session.teacher.user.firstName} ${session.teacher.user.lastName}`
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Student
                  </span>
                  <span className="font-bold text-neutral-800">
                    {session.student?.user
                      ? `${session.student.user.firstName} ${session.student.user.lastName}`
                      : "N/A"}
                  </span>
                </div>
                <div className="col-span-2 pt-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Time
                  </span>
                  <span className="font-mono font-medium text-neutral-600">
                    {new Date(session.startTime).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(session.endTime).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  Join Class
                </a>
                {session.status === SessionStatus.COMPLETED && (
                  <button
                    className="w-full text-center py-2 text-xs font-bold text-neutral-900 hover:bg-teal-500 cursor-pointer bg-teal-300 rounded-xl transition tracking-wide shadow-inner block"
                    onClick={() => handleSessionFeedback(session)}
                  >
                    Session Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Feedback
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 transition text-lg leading-none cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {!isFeedbackLoading ? (
              <div className="space-y-5">
                {/* Sent */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Feedback Sent
                  </span>

                  {feedbackSent ? (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800">
                          To {feedbackSent.receiver.firstName}{" "}
                          {feedbackSent.receiver.lastName}
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
                      Add Feedback
                    </button>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      No feedback received yet.
                    </p>
                  )}
                </div>

                <hr className="border-neutral-100" />

                {/* Received */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Feedback Received
                  </span>

                  {feedbackReceived ? (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800">
                          To {feedbackReceived.receiver.firstName}{" "}
                          {feedbackReceived.receiver.lastName}
                        </span>
                        <StarRating value={feedbackReceived.rating} />
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {feedbackReceived.comment}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      No feedback received yet.
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
              Close
            </button>
          </div>
        </div>
      )}

      {showFeedbackForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Submit Feedback
              </h3>
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="text-neutral-400 hover:text-neutral-700 transition text-lg leading-none cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {/* Rating */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Rating
                </span>
                <StarRating
                  value={feedbackFormData.rating}
                  onChange={(value) =>
                    setFeedbackFormData((prev) => ({ ...prev, rating: value }))
                  }
                  interactive
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label
                  htmlFor="comment"
                  className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  placeholder="Share your experience with this session..."
                  value={feedbackFormData.comment}
                  onChange={handleFeedbackCommentChange}
                  className="w-full text-xs text-neutral-700 border border-neutral-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="w-full py-2 text-xs font-semibold border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || feedbackFormData.rating === 0}
                className="w-full py-2 text-xs font-bold bg-teal-800 hover:bg-teal-900 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white rounded-xl transition tracking-wide cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <LoaderCircleIcon className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsListComponent;

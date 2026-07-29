import StarRating from "@components/helpers/StarRating";
import { LoaderCircleIcon } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import axiosAPI from "@lib/axios";
import { isAxiosError } from "axios";

interface FeedbackFormData {
  rating: number;
  comment: string;
}
const initalFeedbackFormState: FeedbackFormData = {
  rating: 0,
  comment: "",
};

interface FeedbackFormModalProps {
  receiverId: string | null;
  sessionId: string | null;
  setShowFeedbackForm: (value: boolean) => void;
  showFeedbackForm: boolean;
}

const FeedbackFormModal = ({
  receiverId,
  sessionId,
  setShowFeedbackForm,
  showFeedbackForm,
}: FeedbackFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackFormData, setFeedbackFormData] = useState<FeedbackFormData>(
    initalFeedbackFormState,
  );

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

  return (
    <div>
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

export default FeedbackFormModal;

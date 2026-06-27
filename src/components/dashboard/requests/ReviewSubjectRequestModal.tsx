import type { ReviewStatus } from "@utils/types/subject";

export interface AuditingTarget {
  id: string;
  type: "student" | "teacher";
  currentStatus: ReviewStatus;
  currentNotes: string;
}

interface ReviewSubjectRequestModalProps {
  auditTarget: AuditingTarget | null;
  setAuditTarget: (target: AuditingTarget | null) => void;
  handleUpdateStatusSubmit: (e: React.ChangeEvent) => Promise<void>;
  formStatus: string;
  setFormStatus: (status: ReviewStatus) => void;
  formNotes: string;
  setFormNotes: (notes: string) => void;
  submittingAudit: boolean;
}

const ReviewSubjectRequestModal = ({
  auditTarget,
  setAuditTarget,
  handleUpdateStatusSubmit,
  formStatus,
  setFormStatus,
  formNotes,
  setFormNotes,
  submittingAudit,
}: ReviewSubjectRequestModalProps) => {
  return (
    <div>
      {auditTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-base font-bold text-slate-900">
                Review {auditTarget.type === "student" ? "Student" : "Teacher"}{" "}
                Request
              </h3>
              <button
                onClick={() => setAuditTarget(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="p-5 space-y-4">
              {/* Select Option State Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as ReviewStatus)
                  }
                  className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Text Input Feedback Notes Textarea Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Review Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Write a note"
                  rows={4}
                  className="w-full text-sm rounded-lg border border-slate-200 p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Action Toolbar Control Area */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={submittingAudit}
                  onClick={() => setAuditTarget(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAudit}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {submittingAudit ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubjectRequestModal;

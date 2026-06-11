import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";

import type { RootState } from "@store/store";
import {
  ReviewStatus,
  type CreateSubjectRequest,
  type SubjectData,
  type SubjectRequest,
} from "@utils/types/subject";

import UnauthorizedPage from "@pages/static/Unauthorized";
import axiosAPI from "@lib/axios";
import { Role } from "@utils/types/user";

const RequestSubjectPage: React.FC = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);

  // Core Functional States
  const [requests, setRequests] = useState<SubjectRequest[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // UI UX States
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch initial collections
  useEffect(() => {
    if (
      !loggedInUser ||
      (loggedInUser.role !== Role.STUDENT && loggedInUser.role !== Role.TEACHER)
    )
      return;

    async function fetchPageData() {
      try {
        setLoading(true);

        let url = `/student-subject-requests?search=${profile.id}`;
        if (loggedInUser.role === Role.TEACHER) {
          url = `/teacher-subject-requests?search=${profile.id}`;
        }

        const requestsRes = await axiosAPI.get(url);
        setRequests(requestsRes.data.data || []);

        const subjectsRes = await axiosAPI.get("/subjects");
        setAvailableSubjects(subjectsRes.data.data || []);
      } catch (err) {
        console.error("Error loading request dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPageData();
  }, [loggedInUser, profile]);

  // Auth Guard Gatekeeper Component
  if (
    !loggedInUser ||
    (loggedInUser.role !== Role.STUDENT && loggedInUser.role !== Role.TEACHER)
  ) {
    return <UnauthorizedPage />;
  }

  // Submit Handler executing your explicit Controller Create rules
  const handleCreateSubjectRequest = async (e: React.ChangeEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    const targetedSubject = availableSubjects.find(
      (sub) => sub.id === selectedSubjectId,
    );

    try {
      setSubmitting(true);
      setActionError(null);

      // Uses your exact request body parsing structure: { studentId, subjectId }
      let url = "/student-subject-requests";
      let body: CreateSubjectRequest = {
        studentId: profile?.id,
        subjectId: selectedSubjectId,
      };

      if (loggedInUser.role === Role.TEACHER) {
        url = "/teacher-subject-requests";
        body = {
          teacherId: profile?.id,
          subjectId: selectedSubjectId,
        };
      }
      const response = await axiosAPI.post(url, body);

      const newCreatedRequest: SubjectRequest = {
        ...response.data.data,
        subject: targetedSubject || {
          id: selectedSubjectId,
          name: "Requested Subject",
        },
      };

      // Append raw created instance data back safely into the active tracker loop array
      setRequests((prev) => [newCreatedRequest, ...prev]);
      setIsModalOpen(false);
      setSelectedSubjectId("");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to create subject request.";
        setActionError(errorMessage);
      } else {
        setActionError(
          "An error occured while creating subject request, please try again",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Filter partitions splitting active/under-review cycles from absolute outcomes
  const pendingRequests = [ReviewStatus.PENDING, ReviewStatus.UNDER_REVIEW];
  const activeRequests = requests.filter((req) =>
    pendingRequests.includes(req.status),
  );
  const historicRequests = requests.filter(
    (req) => !pendingRequests.includes(req.status),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900 pb-16">
      {/* Header Profile Title Band */}
      <header className="bg-white border-b border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Subject Requests
            </h1>
            <p className="text-sm text-slate-500">
              {loggedInUser.role === Role.STUDENT
                ? "Submit a subject request and track its status."
                : "View and manage subject requests."}
            </p>
          </div>

          {loggedInUser.role !== Role.ADMIN && (
            <button
              onClick={() => {
                setActionError(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm transition cursor-pointer"
            >
              Request New Subject
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-sm font-medium text-slate-400 animate-pulse">
          Loading...
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="space-y-6">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-900">
                Active Requests ({activeRequests.length})
              </h2>
              <p className="text-xs text-slate-500">
                Requests that are still being reviewed.
              </p>
            </div>

            {activeRequests.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400">
                No currently pending subject found.
              </div>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-md">
                          {req.subject?.name || "Subject"}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Submitted:{" "}
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
                          req.status === "UNDER_REVIEW"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: Results History Logs */}
          <section className="space-y-6">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-900">
                Request History ({historicRequests.length})
              </h2>
              <p className="text-xs text-slate-500">
                Requests that have already been reviewed.
              </p>
            </div>

            {historicRequests.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400">
                No verified execution histories are stored for this account
                profile.
              </div>
            ) : (
              <div className="space-y-4">
                {historicRequests.map((req) => (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    {/* Top Section: Header Title & Status Badge */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-md">
                          {req.subject?.name || "Subject"}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Reviewed:{" "}
                          {new Date(req.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider shrink-0 ${
                          req.status === "ACCEPTED"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Bottom Section: Review Notes - Conditional Layout */}
                    {req.reviewNotes && (
                      <div className="pt-3 border-t border-slate-100 space-y-1 bg-slate-50/50 p-3 rounded-lg border">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Review Notes
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {req.reviewNotes}
                        </p>
                      </div>
                    )}
                    {req.reviewedBy && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                        <span>
                          Reviewed By:{" "}
                          <strong className="text-slate-700">
                            {req.reviewedBy.firstName} {req.reviewedBy.lastName}
                          </strong>
                        </span>
                        <span className="text-[11px] font-medium italic">
                          {req.reviewedBy.email}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* COMPONENT MODAL: Create New Track Form Interface */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Request a Subject
              </h3>
              <p className="text-xs text-slate-500">
                Choose a subject and submit your request.
              </p>
            </div>

            {actionError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateSubjectRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Available Subjects
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  required
                  className="w-full text-sm font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="">Select a subject...</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSubjectId}
                  className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestSubjectPage;

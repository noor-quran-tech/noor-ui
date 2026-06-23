import type { RelationOption } from "@pages/dashboard/SessionsPage";
import type React from "react";

interface FormDataProps {
  title: string;
  description: string;
  studentId: string;
  teacherId: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  externalLink: string;
  status: string;
  googleEventId: string;
}

interface CreateAndUpdateSessionModalProps {
  isModalOpen: boolean;
  editingSessionId: string | null;
  setIsModalOpen: (value: boolean) => void;
  handleFormSubmit: (e: React.ChangeEvent) => void;
  formData: FormDataProps;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  subjects: RelationOption[];
  teachers: RelationOption[];
  students: RelationOption[];
  isSubmitting: boolean;
}

const CreateAndUpdateSessionModal = ({
  isModalOpen,
  editingSessionId,
  setIsModalOpen,
  handleFormSubmit,
  formData,
  handleInputChange,
  subjects,
  teachers,
  students,
  isSubmitting,
}: CreateAndUpdateSessionModalProps) => {
  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-linear-to-r from-neutral-50 to-white">
              <div>
                <h3 className="text-base font-black text-neutral-900 tracking-tight">
                  {editingSessionId
                    ? "Edit Session Details"
                    : "Schedule New Session"}
                </h3>
                <p className="text-xs text-neutral-400">
                  Fill in the details below to save the session changes
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter session title"
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-medium text-neutral-900 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter short description"
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-neutral-800 outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Subject
                  </label>
                  <select
                    name="subjectId"
                    required
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="">Select subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Teacher
                  </label>
                  <select
                    name="teacherId"
                    required
                    value={formData.teacherId}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Student
                  </label>
                  <select
                    name="studentId"
                    required
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold text-neutral-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold text-neutral-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="RUNNING">Running</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="MISSED">Missed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Save Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAndUpdateSessionModal;

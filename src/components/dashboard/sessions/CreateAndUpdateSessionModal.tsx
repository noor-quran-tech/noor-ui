import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { RelationOption } from "@pages/dashboard/SessionsPage";
import type { RootState } from "@store/store";
import type React from "react";

import { Role } from "@utils/types/user";

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
  const { t } = useTranslation();

  const loggedInUserRole = useSelector(
    (state: RootState) => state.auth.profile,
  ).type;

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-linear-to-r from-neutral-50 to-white">
              <div>
                <h3 className="text-base font-black text-neutral-900 tracking-tight">
                  {editingSessionId
                    ? t("dashboard.sessions.modal.titleEdit")
                    : t("dashboard.sessions.modal.titleCreate")}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t("dashboard.sessions.modal.subtitle")}
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
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  {t("dashboard.sessions.modal.fields.title")}
                </label>
                <input
                  disabled={loggedInUserRole !== Role.ADMIN}
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t(
                    "dashboard.sessions.modal.fields.titlePlaceholder",
                  )}
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-medium text-neutral-900 outline-none transition 
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  {t("dashboard.sessions.modal.fields.description")}
                </label>
                <textarea
                  name="description"
                  disabled={loggedInUserRole !== Role.ADMIN}
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t(
                    "dashboard.sessions.modal.fields.descriptionPlaceholder",
                  )}
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-neutral-800 outline-none transition resize-none 
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                />
              </div>

              {/* Subject, Teacher, Student Selects */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t("dashboard.sessions.modal.fields.subject")}
                  </label>
                  <select
                    name="subjectId"
                    disabled={loggedInUserRole !== Role.ADMIN}
                    required
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    <option value="">
                      {t("dashboard.sessions.modal.fields.selectSubject")}
                    </option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t("dashboard.sessions.modal.fields.teacher")}
                  </label>
                  <select
                    name="teacherId"
                    disabled={loggedInUserRole !== Role.ADMIN}
                    required
                    value={formData.teacherId}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    <option value="">
                      {t("dashboard.sessions.modal.fields.selectTeacher")}
                    </option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t("dashboard.sessions.modal.fields.student")}
                  </label>
                  <select
                    name="studentId"
                    disabled={loggedInUserRole !== Role.ADMIN}
                    required
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    <option value="">
                      {t("dashboard.sessions.modal.fields.selectStudent")}
                    </option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t("dashboard.sessions.modal.fields.startTime")}
                  </label>
                  <input
                    type="datetime-local"
                    disabled={loggedInUserRole !== Role.ADMIN}
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold text-neutral-800
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t("dashboard.sessions.modal.fields.endTime")}
                  </label>
                  <input
                    type="datetime-local"
                    disabled={loggedInUserRole !== Role.ADMIN}
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold text-neutral-800
                      disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-100"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  {t("dashboard.sessions.modal.fields.status")}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="SCHEDULED">
                    {t("dashboard.sessions.modal.statusOptions.scheduled")}
                  </option>
                  <option value="RUNNING">
                    {t("dashboard.sessions.modal.statusOptions.running")}
                  </option>
                  <option value="COMPLETED">
                    {t("dashboard.sessions.modal.statusOptions.completed")}
                  </option>
                  <option value="CANCELLED">
                    {t("dashboard.sessions.modal.statusOptions.cancelled")}
                  </option>
                  <option value="MISSED">
                    {t("dashboard.sessions.modal.statusOptions.missed")}
                  </option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition cursor-pointer"
                >
                  {t("dashboard.sessions.modal.buttons.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting
                    ? t("dashboard.sessions.modal.buttons.saving")
                    : t("dashboard.sessions.modal.buttons.save")}
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

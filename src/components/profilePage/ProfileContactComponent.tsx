import i18n from "@/i18n";
import type { StudentDetails, TeacherDetails } from "@utils/types/user";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

interface ProfileContactComponentProps {
  isEditing: boolean;
  formData: {
    phoneNumber: string;
    dateOfBirth: string;
    addressLine1: string;
    addressLine2: string;
  };
  handleInputChange: (_: ChangeEvent<HTMLInputElement>) => void;
  profileDetails: StudentDetails | TeacherDetails | null;
}

const ProfileContactComponent = ({
  isEditing,
  formData,
  handleInputChange,
  profileDetails,
}: ProfileContactComponentProps) => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 pb-2 border-b border-neutral-100">
        {t("profile.contactTitle")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            {t("profile.phoneNumber")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder={t("profile.phoneNumber")}
              className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-bold text-neutral-900 outline-none transition"
            />
          ) : (
            <p className="text-sm font-bold text-neutral-900 py-1.5">
              {profileDetails?.phoneNumber || t("profile.notAvailable")}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            {t("profile.dateOfBirth")}
          </label>
          {isEditing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-teal-500 font-bold"
            />
          ) : (
            <p className="text-sm font-bold text-neutral-900">
              {profileDetails?.dateOfBirth
                ? new Date(profileDetails.dateOfBirth).toLocaleDateString(
                    isArabic ? "ar-EG" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )
                : t("profile.notAvailable")}
            </p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2 pt-2 border-t border-neutral-50">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            {t("profile.addressLine1")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-medium text-neutral-800 outline-none transition"
            />
          ) : (
            <p className="text-sm font-medium text-neutral-800 py-1">
              {profileDetails?.addressLine1 || t("profile.notAvailable")}
            </p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            {t("profile.addressLine2")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-medium text-neutral-800 outline-none transition"
            />
          ) : (
            <p className="text-sm font-medium text-neutral-800 py-1">
              {profileDetails?.addressLine2 || t("profile.notAvailable")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContactComponent;

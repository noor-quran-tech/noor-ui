import type { StudentDetails, TeacherDetails } from "@utils/types/user";
import type { ChangeEvent } from "react";

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
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 pb-2 border-b border-neutral-100">
        Contact Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-bold text-neutral-900 outline-none transition"
            />
          ) : (
            <p className="text-sm font-bold text-neutral-900 py-1.5">
              {profileDetails?.phoneNumber || "N/A"}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            Date of Birth
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
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )
                : "N/A"}
            </p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2 pt-2 border-t border-neutral-50">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            Primary Address Line 1
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
              {profileDetails?.addressLine1 || "N/A"}
            </p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase">
            Secondary Address Line 2
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
              {profileDetails?.addressLine2 || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContactComponent;

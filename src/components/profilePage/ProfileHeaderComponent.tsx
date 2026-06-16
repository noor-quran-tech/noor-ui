import type { ChangeEvent } from "react";
import {
  Role,
  type StudentDetails,
  type TeacherDetails,
} from "@utils/types/user";

interface ProfileHeaderComponentProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  isEditing: boolean;
  formData: {
    firstName: string;
    lastName: string;
  };
  handleInputChange: (_: ChangeEvent<HTMLInputElement>) => void;
  profileDetails: TeacherDetails | StudentDetails | null;
  handleEnableEdit: () => void;
  loggedInUser: {
    role: Role;
  };
}

const ProfileHeaderComponent = ({
  user,
  isEditing,
  formData,
  handleInputChange,
  profileDetails,
  handleEnableEdit,
  loggedInUser,
}: ProfileHeaderComponentProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
      <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
        {/* Avatar block displaying user initials */}
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-neutral-800 to-teal-900 text-teal-300 font-mono text-2xl font-bold flex items-center justify-center shadow-inner">
          {user.firstName[0].toUpperCase()}
          {user.lastName[0].toUpperCase()}
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {!isEditing ? (
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
            ) : (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-fit text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-bold text-neutral-900 outline-none transition"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-fit text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-bold text-neutral-900 outline-none transition"
                />
              </>
            )}
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 uppercase tracking-wider border border-neutral-200">
              {user.role.toLowerCase()}
            </span>
          </div>
          <p className="text-sm text-neutral-500 font-medium">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-end gap-3 pt-2 md:pt-0 w-full md:w-auto">
        <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
          <span
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
              profileDetails?.isApproved
                ? "bg-success-bg text-success border-success/20"
                : "bg-warning-bg text-warning border-warning/20"
            }`}
          >
            {profileDetails?.isApproved ? "Approved" : "Pending Approval"}
          </span>
          {loggedInUser.role !== Role.ADMIN ? (
            <span className="text-xs font-semibold text-neutral-400">
              Status: {profileDetails?.verificationStatus.replace("_", " ")}
            </span>
          ) : null}
        </div>

        {!isEditing && loggedInUser.role !== Role.ADMIN && (
          <button
            onClick={handleEnableEdit}
            className="w-full md:w-auto px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl transition duration-150 cursor-pointer shadow-sm"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeaderComponent;

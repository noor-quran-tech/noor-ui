import type { StudentDetails, TeacherDetails } from "@utils/types/user";
import type { ChangeEvent } from "react";

interface ProfileBioComponentProps {
  isEditing: boolean;
  formData: {
    bio: string;
  };
  handleInputChange: (_: ChangeEvent<HTMLTextAreaElement>) => void;
  profileDetails: StudentDetails | TeacherDetails | null;
}

const ProfileBioComponent = ({
  isEditing,
  formData,
  handleInputChange,
  profileDetails,
}: ProfileBioComponentProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
        Bio
      </h3>
      {isEditing ? (
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-neutral-700 outline-none leading-relaxed transition resize-none"
          placeholder="Tell us about yourself..."
        />
      ) : (
        <p className="text-sm text-neutral-600 leading-relaxed min-h-12">
          {profileDetails?.bio || "No bio added yet."}
        </p>
      )}
    </div>
  );
};

export default ProfileBioComponent;

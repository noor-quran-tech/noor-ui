import type { StudentDetails, TeacherDetails } from "@utils/types/user";
import type { ChangeEvent } from "react";

interface ProfileLocationComponentProps {
  isEditing: boolean;
  handleCountryChange: (_: ChangeEvent<HTMLSelectElement>) => void;
  selectedCountryIso: string;
  formData: {
    country: string;
    city: string;
  };
  countriesList: { isoCode: string; name: string }[];
  profileDetails: StudentDetails | TeacherDetails | null;
  handleInputChange: (
    _: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  citiesList: string[];
}

const ProfileLocationComponent = ({
  isEditing,
  handleCountryChange,
  selectedCountryIso,
  formData,
  countriesList,
  profileDetails,
  handleInputChange,
  citiesList,
}: ProfileLocationComponentProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 pb-1 border-b border-neutral-100">
        Location Details
      </h3>

      <div className="flex flex-col gap-1.5 text-xs">
        <span className="font-semibold text-neutral-400 uppercase">
          Country
        </span>
        {isEditing ? (
          <select
            name="countryIso"
            onChange={handleCountryChange}
            value={selectedCountryIso}
            className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/10 cursor-pointer"
          >
            <option value="">
              {formData.country ? formData.country : "Select Country"}
            </option>
            {countriesList.map((c: { isoCode: string; name: string }) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-bold text-neutral-900 text-sm">
            {profileDetails?.country || "N/A"}
          </span>
        )}
      </div>

      {/* City Display / Selection Dropdown */}
      <div className="flex flex-col gap-1.5 text-xs">
        <span className="font-semibold text-neutral-400 uppercase">City</span>
        {isEditing ? (
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            disabled={!selectedCountryIso}
            className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs font-bold focus:outline-none disabled:opacity-50 disabled:bg-neutral-100 focus:ring-2 focus:ring-teal-500/10 cursor-pointer"
          >
            <option value="">Select City</option>
            {citiesList.map((city: string) => (
              <option key={crypto.randomUUID()} value={city}>
                {city}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-bold text-neutral-900 text-sm">
            {profileDetails?.city || "N/A"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileLocationComponent;

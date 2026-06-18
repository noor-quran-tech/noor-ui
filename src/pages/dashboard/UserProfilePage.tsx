import { Role } from "@utils/types/user";
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axiosAPI from "@lib/axios";
import { toast } from "sonner";

interface UserProfileData {
  id: string;
  country: string;
  city: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  bio?: string | null;
  phoneNumber: string;
  dateOfBirth?: string;
  yearsOfExperience?: number;
  languages?: string[];
  teachingLevels?: string[];
  level?: string; // For Students (e.g., BEGINNER)
  verificationStatus: string;
  isApproved: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    role: string;
    isActive: boolean;
  };
  parent?: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
  } | null;
}

const UserProfilePage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const role = pathname.includes("/students") ? Role.STUDENT : Role.TEACHER;
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const endpoint =
          role === Role.STUDENT ? `students/${id}` : `teachers/${id}`;
        const response = await axiosAPI.get(endpoint);
        setProfile(response.data.data);
      } catch {
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) getUser();
  }, [id, role]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-5 w-32 bg-neutral-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-125 bg-white border border-neutral-100 rounded-2xl" />
          <div className="md:col-span-2 h-125 bg-white border border-neutral-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
        >
          <span className="text-neutral-400 text-[10px]">◀</span> Back to
          Directory
        </button>
        <div className="p-16 text-center text-sm font-medium text-neutral-500 bg-white border border-neutral-100 rounded-2xl max-w-2xl mx-auto shadow-xs mt-12">
          <p className="text-base font-semibold text-neutral-800 mb-1">
            No profile record located
          </p>
          <p className="text-neutral-400 text-xs">
            Verify the workspace link or user parameters identifier.
          </p>
        </div>
      </div>
    );
  }

  const isStudent = profile.user.role === Role.STUDENT;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 animate-fade-in">
      {/* ====================================================
          TOP BAR ACTION NAVIGATION
          ==================================================== */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
        >
          <span className="text-neutral-400 text-[10px]">◀</span> Back to
          Directory
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
              profile.user.isActive
                ? "bg-success-bg text-success border-success/10"
                : "bg-error-bg text-error border-error/10"
            }`}
          >
            {profile.user.isActive ? "Active" : "Inactive"}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-600 border border-neutral-200">
            {profile.user.role}
          </span>
        </div>
      </div>

      {/* ====================================================
          MAIN SUMMARY PANEL GRID
          ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 space-y-6">
          {/* Avatar Area */}
          <div className="text-center space-y-3">
            <div className="h-20 w-20 bg-linear-to-tr from-teal-600 to-teal-400 text-white mx-auto rounded-2xl flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-teal-600/10 tracking-wider">
              {profile.user.firstName.charAt(0)}
              {profile.user.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight capitalize">
                {profile.user.firstName} {profile.user.lastName}
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                {profile.user.email}
              </p>
            </div>
          </div>

          {/* Primary Details Block */}
          <div className="border-t border-neutral-100 pt-5 space-y-4 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Phone Number
              </span>
              <span className="font-semibold text-neutral-800 text-sm">
                {profile.phoneNumber || "—"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Location
              </span>
              <span className="font-semibold text-neutral-800 text-sm">
                {profile.city || "Unknown City"}, {profile.country}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Biography
              </span>
              <p className="text-neutral-600 font-medium leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100/50">
                {profile.bio || "No profile biography written yet."}
              </p>
            </div>
          </div>

          {/* TEACHER METADATA */}
          {!isStudent && (
            <div className="border-t border-neutral-100 pt-5 space-y-4 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Experience
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-gold-50 text-gold-700 border border-gold-200/40 rounded-md font-bold text-sm">
                  {profile.yearsOfExperience || 0} Year(s)
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Teaching Levels
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.teachingLevels?.map((lvl) => (
                    <span
                      key={lvl}
                      className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-[10px] font-bold uppercase tracking-wide border border-teal-100"
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDENT METADATA */}
          {isStudent && (
            <div className="border-t border-neutral-100 pt-5 space-y-4 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Current Knowledge Level
                </span>
                <span className="inline-block px-2.5 py-1 bg-gold-50 text-gold-700 rounded-md text-xs font-bold uppercase border border-gold-200/40">
                  {profile.level || "UNASSIGNED"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: WORKSPACE DATA CARDS */}
        <div className="md:col-span-2 space-y-6">
          {/* CONDITION: STUDENT PARENT INFORMATION METRICS */}
          {isStudent && profile.parent && (
            <div className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6">
              <div className="mb-4">
                <span className="inline-block bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                  Emergency Contacts
                </span>
                <h3 className="text-sm font-bold text-neutral-800 mt-2">
                  Primary Parent / Guardian Contact
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-neutral-50/60 p-3.5 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wide">
                    Guardian Name
                  </span>
                  <span className="font-bold text-neutral-800 block mt-1 text-sm capitalize">
                    {profile.parent.name}
                  </span>
                </div>
                <div className="bg-neutral-50/60 p-3.5 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wide">
                    Contact Phone
                  </span>
                  <span className="font-semibold text-neutral-700 block mt-1 text-sm">
                    {profile.parent.phoneNumber}
                  </span>
                </div>
                <div className="bg-neutral-50/60 p-3.5 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wide">
                    Email Address
                  </span>
                  <span
                    className="font-semibold text-neutral-700 block mt-1 text-sm truncate"
                    title={profile.parent.email}
                  >
                    {profile.parent.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM MANAGEMENT CARD */}
          <div className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6">
            <div className="mb-4">
              <span className="inline-block bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                Diagnostics
              </span>
              <h3 className="text-sm font-bold text-neutral-800 mt-2">
                Account Registration Diagnostics
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-50/60 p-3.5 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wide">
                  System Verification Status
                </span>
                <span className="inline-block font-bold text-warning bg-warning-bg border border-warning/10 text-[11px] px-2 py-0.5 rounded-md mt-1.5 tracking-wide uppercase">
                  {profile.verificationStatus}
                </span>
              </div>
              <div className="bg-neutral-50/60 p-3.5 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wide">
                  Communication Languages
                </span>
                <span className="font-semibold text-neutral-700 block mt-1 text-sm">
                  {profile.languages && profile.languages.length > 0
                    ? profile.languages.join(", ")
                    : "English (Default)"}
                </span>
              </div>
            </div>
          </div>

          {/* LIVE USER SESSIONS STUB */}
          <div className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-block bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                  Telemetry
                </span>
                <h3 className="text-sm font-bold text-neutral-800 mt-2">
                  Active Authenticated Sessions
                </h3>
              </div>
              <span className="bg-teal-50 text-teal-600 border border-teal-100/60 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                ● Live
              </span>
            </div>

            <div className="py-10 text-center space-y-2 bg-neutral-50 rounded-xl border border-neutral-100/50 px-4">
              <p className="text-xs font-bold text-neutral-700">
                Session metrics pipeline pending compilation
              </p>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Map browser context arrays, active user hardware definitions,
                and IP connection telemetry arrays in this dashboard card module
                container.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

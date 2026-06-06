import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { RootState } from "@store/store";
import type { UserProfileData } from "@utils/types/user";

import axiosAPI from "@lib/axios";

const ProfilePage: React.FC = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loggedInUser?.id) return;

    async function getUserProfile() {
      try {
        setLoading(true);
        const response = await axiosAPI.get(`/users/${loggedInUser.id}`);
        setUser(response.data.data);
      } catch (err) {
        console.error("Failed to fetch profile details", err);
        setError("Could not load profile information.");
      } finally {
        setLoading(false);
      }
    }

    getUserProfile();
  }, [loggedInUser]);

  // Route protection wrapper guard
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-sm font-medium text-slate-500 animate-pulse">
          Loading profile data...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-sm font-medium text-red-500">
          {error || "Profile unavailable."}
        </div>
      </div>
    );
  }

  // Extract contextual operational child metadata profile cleanly
  const profileDetails = user.role === "TEACHER" ? user.teacher : user.student;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900 pb-12">
      <div className="max-w-5xl mx-auto px-4 pt-10 space-y-8">
        {/* Header Hero Profile Summary Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* Avatar block displaying user initials */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-teal-950 text-teal-400 font-mono text-2xl font-bold flex items-center justify-center shadow-inner">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider border border-slate-200">
                  {user.role.toLowerCase()}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Operational Verification Status Stack */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 pt-2 md:pt-0">
            <span
              className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                profileDetails?.isApproved
                  ? "bg-teal-50 text-teal-700 border-teal-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {profileDetails?.isApproved
                ? "Approved Account"
                : "Pending Approval"}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Status: {profileDetails?.verificationStatus.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Dynamic Inner Two-Column Grid Mapping Specific Meta Attributes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Column A: Primary Meta & Core Academic Qualifications */}
          <div className="space-y-6 lg:col-span-1">
            {/* Contextual Academic Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Academic Scope
              </h3>

              {user.role === "STUDENT" && user.student && (
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    Level
                  </div>
                  <div className="text-base font-bold text-slate-900 capitalize">
                    {user.student.level.toLowerCase()}
                  </div>
                </div>
              )}

              {user.role === "TEACHER" && user.teacher && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-400 font-semibold uppercase">
                      Teaching Level
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {user.teacher.teachingLevels.map((lvl) => (
                        <span
                          key={lvl}
                          className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-400 font-semibold uppercase">
                      Languages
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {user.teacher.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* General Metadata Quick Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3.5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 pb-1 border-b border-slate-100">
                System Context
              </h3>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400 uppercase">
                  Country
                </span>
                <span className="font-bold text-slate-900">
                  {profileDetails?.country || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400 uppercase">
                  City
                </span>
                <span className="font-bold text-slate-900">
                  {profileDetails?.city || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400 uppercase">
                  Time Zone
                </span>
                <span className="font-bold text-slate-900">
                  {profileDetails?.timeZone || "UTC / Localized"}
                </span>
              </div>
            </div>
          </div>

          {/* Column B: Full Address Mechanics, Bio Summary and Timeline Records */}
          <div className="space-y-6 lg:col-span-2">
            {/* Account Profile Bio */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Bio
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {profileDetails?.bio}
              </p>
            </div>

            {/* Expanded Detailed Contact Information Fields */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 pb-2 border-b border-slate-100">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Phone Number
                  </label>
                  <p className="text-sm font-bold text-slate-900">
                    {profileDetails?.phoneNumber || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Date of Birth
                  </label>
                  <p className="text-sm font-bold text-slate-900">
                    {profileDetails
                      ? new Date(profileDetails.dateOfBirth).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" },
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-50">
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Primary Address Line 1
                  </label>
                  <p className="text-sm font-medium text-slate-800">
                    {profileDetails?.addressLine1 || "N/A"}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    Secondary Address Line 2
                  </label>
                  <p className="text-sm font-medium text-slate-800">
                    {profileDetails?.addressLine2 || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

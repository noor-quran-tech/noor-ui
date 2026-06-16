import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import type { RootState } from "@store/store";

import { Level, Role, type UserProfileData } from "@utils/types/user";
import axiosAPI from "@lib/axios";

const ProfilePage: React.FC = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, _] = useState<string | null>(null);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State initialized to match expected payload shapes
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    timeZone: "",
    dateOfBirth: "",
    languages: [] as string[],
    teachingLevels: [] as string[],
    level: "",
    yearsOfExperience: 0,
  });

  const [countriesList, setCountriesList] = useState<
    { isoCode: string; name: string }[]
  >([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [selectedCountryIso, setSelectedCountryIso] = useState<string>("");

  const handleEnableEdit = () => {
    const STATIC_COUNTRIES_LIST = Country.getAllCountries().map((c) => ({
      isoCode: c.isoCode,
      name: c.name,
    }));

    setCountriesList(STATIC_COUNTRIES_LIST);
    // Lazily find the matching ISO code and resolve cities ONLY when entering edit mode
    const currentCountryName = formData.country || "";
    const match = STATIC_COUNTRIES_LIST.find(
      (c) => c.name.toLowerCase() === currentCountryName.toLowerCase(),
    );

    if (match) {
      setSelectedCountryIso(match.isoCode);
      const cities = City.getCitiesOfCountry(match.isoCode) || [];
      setCitiesList(cities.map((city) => city.name));
    } else {
      setSelectedCountryIso("");
      setCitiesList([]);
    }

    setIsEditing(true);
  };

  useEffect(() => {
    if (!loggedInUser?.id) return;

    async function getUserProfile() {
      try {
        setLoading(true);
        const response = await axiosAPI.get(`/users/${loggedInUser.id}`);
        const profileData = response.data.data;
        setUser(profileData);

        const details =
          profileData.role === Role.TEACHER
            ? profileData.teacher
            : profileData.student;

        if (details) {
          setFormData({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            bio: details.bio || "",
            phoneNumber: details.phoneNumber || "",
            addressLine1: details.addressLine1 || "",
            addressLine2: details.addressLine2 || "",
            country: details.country || "",
            city: details.city || "",
            timeZone: details.timeZone || "UTC / Localized",
            languages: profileData.teacher?.languages || [],
            teachingLevels: profileData.teacher?.teachingLevels || [],
            dateOfBirth: details?.dateOfBirth
              ? new Date(details.dateOfBirth).toISOString().split("T")[0]
              : "",
            level: profileData.student?.level,
            yearsOfExperience: isNaN(
              parseInt(profileData.teacher?.yearsOfExperience),
            )
              ? 0
              : parseInt(profileData.teacher?.yearsOfExperience),
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile details", err);
        toast.error("Failed to load profile.");
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-sm font-medium text-neutral-500 animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-sm font-medium text-error bg-error-bg px-4 py-2 rounded-xl border border-error/20">
          {error || "Profile not available."}
        </div>
      </div>
    );
  }

  const profileDetails =
    user.role === Role.TEACHER ? user.teacher : user.student;

  // Form input changes handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleProfileSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const endpoint =
        user.role === Role.TEACHER
          ? `/teachers/${profileDetails?.id}`
          : `/students/${profileDetails?.id}`;
      const response = await axiosAPI.patch(endpoint, formData);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          firstName: formData.firstName,
          lastName: formData.lastName,
          [user.role === Role.TEACHER ? "teacher" : "student"]:
            response.data.data,
        };
      });
      setIsEditing(false);
      toast.success("Updated profile successfully!");
    } catch (err: unknown) {
      let description = "Please check your information.";
      if (isAxiosError(err)) {
        description =
          err.response?.data.errors[0].message ||
          "Please check your information.";
      }

      toast.error("Failed to update profile", {
        description,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryIso = e.target.value;
    const countryName: string =
      countriesList.find((c) => c.isoCode === selectedCountryIso)?.name || "";
    setSelectedCountryIso(selectedCountryIso);
    setFormData((prev) => ({ ...prev, country: countryName, city: "" }));
    const cities = City.getCitiesOfCountry(selectedCountryIso) || [];
    setCitiesList(cities.map((city) => city.name));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-teal-100 selection:text-teal-900 pb-12 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 pt-10 space-y-8">
        {/* Header Hero Profile Summary Card */}
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
              <p className="text-sm text-neutral-500 font-medium">
                {user.email}
              </p>
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

        {/* Primary View / Edit Form Context Switcher Wrapper */}
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Column A: Primary Meta & Core Academic Qualifications */}
            <div className="space-y-6 lg:col-span-1">
              {/* Contextual Academic Box */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600">
                  Education
                </h3>

                {user.role === Role.STUDENT && user.student && (
                  <div className="space-y-1.5">
                    <div className="text-xs text-neutral-400 font-semibold uppercase">
                      Level
                    </div>
                    {isEditing ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(Object.values(Level) as string[]).map((lvl) => {
                          const checked = formData.level.includes(lvl);
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  level: lvl,
                                }))
                              }
                              className={`text-xs font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                checked
                                  ? "bg-teal-600 text-white border-teal-600"
                                  : "bg-teal-50 text-teal-700 border-teal-100 hover:border-teal-400"
                              }`}
                            >
                              {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
                          {user.student.level}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {user.role === Role.TEACHER && user.teacher && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-xs text-neutral-400 font-semibold uppercase">
                        Teaching Levels
                      </div>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(Object.values(Level) as string[]).map((lvl) => {
                            const checked =
                              formData.teachingLevels.includes(lvl);
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    teachingLevels: checked
                                      ? prev.teachingLevels.filter(
                                          (l) => l !== lvl,
                                        )
                                      : [...prev.teachingLevels, lvl],
                                  }))
                                }
                                className={`text-xs font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                  checked
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-teal-50 text-teal-700 border-teal-100 hover:border-teal-400"
                                }`}
                              >
                                {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
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
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                      <div className="text-xs text-neutral-400 font-semibold uppercase">
                        Languages
                      </div>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            "English",
                            "Arabic",
                            "French",
                            "Spanish",
                            "German",
                            "Italian",
                            "Portuguese",
                            "Chinese",
                            "Japanese",
                            "Turkish",
                          ].map((lang) => {
                            const checked = formData.languages.includes(lang);
                            return (
                              <button
                                key={lang}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    languages: checked
                                      ? prev.languages.filter((l) => l !== lang)
                                      : [...prev.languages, lang],
                                  }))
                                }
                                className={`text-xs font-medium px-2 py-0.5 rounded-md border transition cursor-pointer ${
                                  checked
                                    ? "bg-neutral-700 text-white border-neutral-700"
                                    : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                                }`}
                              >
                                {lang}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {user.teacher.languages.map((lang) => (
                            <span
                              key={lang}
                              className="text-xs font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs text-neutral-400 font-semibold uppercase">
                        Years of Experience
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          name="yearsOfExperience"
                          min="0"
                          value={formData.yearsOfExperience}
                          onChange={handleInputChange}
                          className="w-full text-sm bg-neutral-50 border border-neutral-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3 py-2 font-bold text-neutral-900 outline-none transition"
                        />
                      ) : (
                        <div className="text-base font-bold text-neutral-900">
                          {user.teacher.yearsOfExperience ?? 0}{" "}
                          {user.teacher.yearsOfExperience === 1
                            ? "Year"
                            : "Years"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* General Metadata Quick Breakdown */}
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
                      {countriesList.map((c) => (
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
                  <span className="font-semibold text-neutral-400 uppercase">
                    City
                  </span>
                  {isEditing ? (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!selectedCountryIso}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-xs font-bold focus:outline-none disabled:opacity-50 disabled:bg-neutral-100 focus:ring-2 focus:ring-teal-500/10 cursor-pointer"
                    >
                      <option value="">Select City</option>
                      {citiesList.map((city) => (
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
            </div>

            {/* Column B: Full Address Mechanics, Bio Summary and Timeline Records */}
            <div className="space-y-6 lg:col-span-2">
              {/* Account Profile Bio */}
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
                          ? new Date(
                              profileDetails.dateOfBirth,
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
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

              {/* Action Toolbar buttons display when structural parameters undergo edit processing */}
              {isEditing && (
                <div className="flex justify-end items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600 bg-neutral-200 hover:bg-neutral-300 disabled:opacity-50 rounded-xl transition duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-teal-500 hover:bg-teal-600 active:bg-teal-700 disabled:opacity-50 rounded-xl transition duration-150 cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    {isSaving ? "Saving ..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

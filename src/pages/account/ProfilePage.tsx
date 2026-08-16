import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import type { RootState } from "@store/store";

import { Role, type UserProfileData } from "@utils/types/user";
import axiosAPI from "@lib/axios";
import { resolveApiErrorMessage } from "@lib/errorMessage";
import ProfileHeaderComponent from "@components/profilePage/ProfileHeaderComponent";
import ProfileEducationComponent from "@components/profilePage/ProfileEducationComponent";
import ProfileLocationComponent from "@components/profilePage/ProfileLocationComponent";
import ProfileBioComponent from "@components/profilePage/ProfileBioComponent";
import ProfileContactComponent from "@components/profilePage/ProfileContactComponent";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
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
        toast.error(t("profile.toast.loadError"));
      } finally {
        setLoading(false);
      }
    }

    getUserProfile();
  }, [loggedInUser, t]);

  // Route protection wrapper guard
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-sm font-medium text-neutral-500 animate-pulse">
          {t("profile.loading")}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-sm font-medium text-error bg-error-bg px-4 py-2 rounded-xl border border-error/20">
          {error || t("profile.defaultError")}
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
      toast.success(t("profile.toast.updateSuccess"));
    } catch (err: unknown) {
      const description = resolveApiErrorMessage(
        err,
        t,
        t("profile.toast.updateErrorDefault"),
      );

      toast.error(t("profile.toast.updateErrorTitle"), {
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
        {/* Header */}
        <ProfileHeaderComponent
          user={user}
          isEditing={isEditing}
          formData={formData}
          handleInputChange={handleInputChange}
          profileDetails={profileDetails}
          handleEnableEdit={handleEnableEdit}
          loggedInUser={loggedInUser}
        />

        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-6 lg:col-span-1">
              {/* Education */}
              <ProfileEducationComponent
                user={user}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
              />

              {/* Location */}
              <ProfileLocationComponent
                isEditing={isEditing}
                handleCountryChange={handleCountryChange}
                selectedCountryIso={selectedCountryIso}
                formData={formData}
                countriesList={countriesList}
                profileDetails={profileDetails}
                handleInputChange={handleInputChange}
                citiesList={citiesList}
              />
            </div>

            <div className="space-y-6 lg:col-span-2">
              {/* Bio */}
              <ProfileBioComponent
                isEditing={isEditing}
                formData={formData}
                handleInputChange={handleInputChange}
                profileDetails={profileDetails}
              />

              {/* Contact */}
              <ProfileContactComponent
                isEditing={isEditing}
                formData={formData}
                handleInputChange={handleInputChange}
                profileDetails={profileDetails}
              />

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
                    {t("profile.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-teal-500 hover:bg-teal-600 active:bg-teal-700 disabled:opacity-50 rounded-xl transition duration-150 cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    {isSaving ? t("profile.saving") : t("profile.saveChanges")}
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

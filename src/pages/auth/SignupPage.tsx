import React, { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import axios from "axios";

import { Role, Level, type SignupFormData } from "@utils/types/user";
import type { RootState } from "@store/store";

import { Country, City } from "country-state-city";
import axiosAPI from "@lib/axios";
import { Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const STATIC_COUNTRIES_LIST = Country.getAllCountries().map((c) => ({
  isoCode: c.isoCode,
  name: c.name,
}));

const DETECTED_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const initialFormState: SignupFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",

  role: Role.STUDENT,
  country: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
  bio: "",
  phoneNumber: "",
  dateOfBirth: "",

  yearsOfExperience: 0,
  languages: [],
  teachingLevels: [],

  level: Level.BEGINNER,
  timeZone: DETECTED_TIME_ZONE,

  parentName: "",
  parentPhone: "",
  parentEmail: "",
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [countriesList] = useState<{ isoCode: string; name: string }[]>(
    STATIC_COUNTRIES_LIST,
  );

  const [citiesList, setCitiesList] = useState<string[]>([]);

  const { t } = useTranslation();
  const backendErrorMap: Record<string, string> = {
    "Duplicate value for email. Please use another value.":
      "errors.EMAIL_ALREADY_EXISTS",
  };

  if (loggedInUser) {
    setTimeout(() => {
      navigate("/");
    }, 500);
    return;
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryIso = e.target.value;
    const countryName: string =
      countriesList.find((c) => c.isoCode === selectedCountryIso)?.name || "";

    setFormData((prev) => ({ ...prev, country: countryName, city: "" }));
    setErrors((prev) => ({ ...prev, country: undefined }));
    const cities = City.getCitiesOfCountry(selectedCountryIso) || [];
    setCitiesList(cities.map((city) => city.name));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleToggleLevel = (targetLevel: Level) => {
    setFormData((prev) => {
      const alreadySelected = prev.teachingLevels.includes(targetLevel);
      const updatedLevels = alreadySelected
        ? prev.teachingLevels.filter((l) => l !== targetLevel)
        : [...prev.teachingLevels, targetLevel];

      if (updatedLevels.length > 0) {
        setErrors((prev) => ({ ...prev, ["teachingLevels"]: undefined }));
      }

      return { ...prev, teachingLevels: updatedLevels };
    });
  };

  const validateStep1 = (
    newErrors: Partial<Record<keyof SignupFormData, string>>,
  ) => {
    const { firstName, lastName, email, password } = formData;

    if (!firstName.trim())
      newErrors.firstName = t("signup.step1.validation.firstNameRequired");
    else if (firstName.length < 2)
      newErrors.firstName = t("signup.step1.validation.firstNameMin");
    else if (firstName.length > 30)
      newErrors.firstName = t("signup.step1.validation.firstNameMax");

    if (!lastName.trim())
      newErrors.lastName = t("signup.step1.validation.lastNameRequired");
    else if (lastName.length < 2)
      newErrors.lastName = t("signup.step1.validation.lastNameMin");
    else if (lastName.length > 30)
      newErrors.lastName = t("signup.step1.validation.lastNameMax");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = t("signup.step1.validation.invalidEmail");
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8)
      newErrors.password = t("signup.step1.validation.passwordMin");
    else if (password.length > 32)
      newErrors.password = t("signup.step1.validation.passwordMax");
    else if (!hasLowerCase || !hasUpperCase || !hasNumber) {
      newErrors.password = t("signup.step1.validation.passwordWeak");
    }
  };

  const validateStep2 = (
    newErrors: Partial<Record<keyof SignupFormData, string>>,
  ) => {
    const {
      country,
      city,
      phoneNumber,
      dateOfBirth,
      addressLine1,
      addressLine2,
    } = formData;

    if (!country.trim())
      newErrors.country = t("signup.step2.validation.countryRequired");
    else if (country.length < 2)
      newErrors.country = t("signup.step2.validation.countryMin");
    else if (country.length > 50)
      newErrors.country = t("signup.step2.validation.countryMax");

    if (!city.trim())
      newErrors.city = t("signup.step2.validation.cityRequired");
    else if (city.length < 2)
      newErrors.city = t("signup.step2.validation.cityMin");
    else if (city.length > 50)
      newErrors.city = t("signup.step2.validation.cityMax");

    if (!phoneNumber.trim())
      newErrors.phoneNumber = t("signup.step2.validation.phoneRequired");
    else if (phoneNumber.length < 10)
      newErrors.phoneNumber = t("signup.step2.validation.phoneMin");
    else if (phoneNumber.length > 30)
      newErrors.phoneNumber = t("signup.step2.validation.phoneMax");

    if (!dateOfBirth) {
      newErrors.dateOfBirth = t("signup.step2.validation.dobRequired");
    } else {
      const dobDate = new Date(dateOfBirth);
      const minAgeMs = 5 * 365.25 * 24 * 60 * 60 * 1000;

      if (Date.now() - dobDate.getTime() < minAgeMs) {
        newErrors.dateOfBirth = t("signup.step2.validation.dobMinAge");
      }
    }

    if (
      addressLine1 &&
      (addressLine1.trim().length < 3 || addressLine1.length > 100)
    ) {
      newErrors.addressLine1 = t("signup.step2.validation.addressLength");
    }

    if (
      addressLine2 &&
      (addressLine2.trim().length < 3 || addressLine2.length > 100)
    ) {
      newErrors.addressLine2 = t("signup.step2.validation.addressLength");
    }
  };

  const validateStep3 = (
    newErrors: Partial<Record<keyof SignupFormData, string>>,
  ) => {
    const {
      role,
      yearsOfExperience,
      teachingLevels,
      // languages,
      bio,
      parentName,
      parentPhone,
      parentEmail,
    } = formData;

    // Optional bio validation across both roles
    if (bio && bio.trim().length < 10) {
      newErrors.bio = t("signup.step3.validation.bioMin");
    }

    if (role === "TEACHER") {
      if (
        yearsOfExperience &&
        (yearsOfExperience < 0 || yearsOfExperience > 60)
      ) {
        newErrors.yearsOfExperience = t(
          "signup.step3.validation.experienceRange",
        );
      }

      if (teachingLevels.length === 0) {
        newErrors.teachingLevels = t(
          "signup.step3.validation.teachingLevelsRequired",
        );
      }
    }

    if (role === "STUDENT") {
      const hasParentInfo =
        parentName.trim() || parentPhone.trim() || parentEmail.trim();

      if (hasParentInfo) {
        if (!parentName.trim())
          newErrors.parentName = t(
            "signup.step3.validation.parentNameRequired",
          );
        else if (parentName.length < 2)
          newErrors.parentName = t("signup.step3.validation.parentNameShort");

        if (!parentPhone.trim())
          newErrors.parentPhone = t(
            "signup.step3.validation.parentPhoneRequired",
          );
        else if (parentPhone.length < 10)
          newErrors.parentPhone = t("signup.step3.validation.parentPhoneShort");

        if (!/^\S+@\S+\.\S+$/.test(parentEmail)) {
          newErrors.parentEmail = t(
            "signup.step3.validation.parentEmailInvalid",
          );
        }
      }
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (step === 1) validateStep1(newErrors);
    else if (step === 2) validateStep2(newErrors);
    else if (step === 3) validateStep3(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setSubmitLoading(true);
      const role: string = formData.role;
      if (role === Role.STUDENT) {
        await axiosAPI.post("/auth/register-student", formData);
      } else {
        const payload = {
          ...formData,
          yearsOfExperience: Number(formData.yearsOfExperience),
        };
        await axiosAPI.post("/auth/register-teacher", payload);
      }
      toast.success(t("signup.messages.success"));

      navigate("/login");
    } catch (err) {
      let errorKey = "errors.UNKNOWN_ERROR";
      if (axios.isAxiosError(err)) {
        const backendMessage =
          err.response?.data?.errors?.[0]?.message ??
          err.response?.data?.message;

        if (backendMessage) {
          errorKey = backendErrorMap[backendMessage] ?? "errors.UNKNOWN_ERROR";
        }
      }

      toast.error(t("signup.messages.registrationFailed"), {
        description: t(errorKey),
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800 font-sans">
      {/* Visual Identity Side-Pane */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-linear-to-br` from-teal-50 to-teal-100 p-12 relative overflow-hidden border-r border-neutral-200">
        <div className="max-w-md z-10">
          <div className="text-4xl font-extrabold text-gold-600 mb-8 tracking-tight drop-shadow-[0_2px_10px_rgba(0,183,181,0.05)]">
            نور{" "}
            <span className="text-3xl font-extrabold text-gold-600 mb-8 tracking-tight drop-shadow-[0_2px_10px_rgba(0,183,181,0.05)]">
              Noor
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-900 leading-tight mb-4">
            {t("signup.brandTitle")}
          </h1>
          <p className="text-neutral-600 leading-relaxed">
            {t("signup.brandSubtitle")}
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-teal-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-87.5 h-87.5 bg-gold-300/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Form Interaction Side-Pane */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto bg-neutral-50 p-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Progress Tracking Bar */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {t("signup.step", { current: step, total: 3 })}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="animate-fade-in space-y-6"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {t("signup.step1.title")}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {t("signup.step1.subtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: Role.STUDENT }))
                    }
                    className={`relative flex cursor-pointer flex-col justify-between rounded-xl border bg-white p-4 transition ${
                      formData.role === Role.STUDENT
                        ? "border-teal-500 ring-2 ring-teal-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className={`block font-bold ${
                        formData.role === Role.STUDENT
                          ? "text-teal-600"
                          : "text-neutral-800"
                      }`}
                    >
                      {t("signup.step1.studentTitle")}
                    </span>

                    <span className="mt-1 block text-xs text-neutral-500">
                      {t("signup.step1.studentDescription")}
                    </span>
                  </div>

                  <div
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: Role.TEACHER }))
                    }
                    className={`relative flex cursor-pointer flex-col justify-between rounded-xl border bg-white p-4 transition ${
                      formData.role === Role.TEACHER
                        ? "border-teal-500 ring-2 ring-teal-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className={`block font-bold ${
                        formData.role === Role.TEACHER
                          ? "text-teal-600"
                          : "text-neutral-800"
                      }`}
                    >
                      {t("signup.step1.teacherTitle")}
                    </span>

                    <span className="mt-1 block text-xs text-neutral-500">
                      {t("signup.step1.teacherDescription")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      {t("signup.labels.firstName")}
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 ${
                        errors.firstName
                          ? "border-error bg-error-bg"
                          : "border-neutral-200"
                      }`}
                      placeholder={t("signup.placeholders.firstName")}
                    />

                    {errors.firstName && (
                      <span className="text-xs text-error">
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      {t("signup.labels.lastName")}
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 ${
                        errors.lastName
                          ? "border-error bg-error-bg"
                          : "border-neutral-200"
                      }`}
                      placeholder={t("signup.placeholders.lastName")}
                    />

                    {errors.lastName && (
                      <span className="text-xs text-error">
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    {t("signup.labels.email")}
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 ${
                      errors.email
                        ? "border-error bg-error-bg"
                        : "border-neutral-200"
                    }`}
                    placeholder={t("signup.placeholders.email")}
                  />

                  {errors.email && (
                    <span className="text-xs text-error">{errors.email}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    {t("signup.labels.password")}
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10 ${
                      errors.password
                        ? "border-error bg-error-bg"
                        : "border-neutral-200"
                    }`}
                    placeholder={t("signup.placeholders.password")}
                  />

                  {errors.password && (
                    <span className="text-xs text-error">
                      {errors.password}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full cursor-pointer rounded-lg bg-teal-600 py-3 font-semibold text-white shadow-lg shadow-teal-600/10 transition duration-200 hover:bg-teal-500"
                >
                  {t("signup.buttons.continue")}
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Profile Basics
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Help us map your timezone and localized records correctly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      Country
                    </label>
                    <select
                      name="countryIso"
                      onChange={handleCountryChange}
                      value={formData.country}
                      className={`w-full px-4 py-2.5 rounded-lg bg-white border ${errors.country ? "border-error bg-error-bg" : "border-neutral-200"} text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10`}
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
                    {errors.country && (
                      <span className="text-xs text-error">
                        {errors.country}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      City
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!formData.country}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none disabled:opacity-50 disabled:bg-neutral-100"
                    >
                      <option value="">Select City</option>
                      {citiesList.map((city) => (
                        <option key={crypto.randomUUID()} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <span className="text-xs text-error">{errors.city}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Street Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none"
                  />
                  {errors.addressLine1 && (
                    <span className="text-xs text-error">
                      {errors.addressLine1}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none"
                  />
                  {errors.addressLine2 && (
                    <span className="text-xs text-error">
                      {errors.addressLine2}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none"
                      placeholder="+20 1..."
                    />
                    {errors.phoneNumber && (
                      <span className="text-xs text-error">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 focus:outline-none"
                    />
                    {errors.dateOfBirth && (
                      <span className="text-xs text-error">
                        {errors.dateOfBirth}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition duration-200 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition duration-200 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-5">
                {formData.role === Role.TEACHER ? (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        {t("signup.step3.teacherTitle")}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">
                        {t("signup.step3.teacherSubtitle")}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-600">
                        {t("signup.labels.yearsOfExperience")}
                      </label>

                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:outline-none"
                      />

                      {errors.yearsOfExperience && (
                        <span className="text-xs text-error">
                          {errors.yearsOfExperience}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-neutral-600">
                        {t("signup.labels.teachingLevels")}
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {Object.values(Level).map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => handleToggleLevel(lvl)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition duration-150 ${
                              formData.teachingLevels.includes(lvl)
                                ? "bg-gold-500 font-bold text-white"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {t(`levels.${lvl.toLowerCase()}`)}
                          </button>
                        ))}

                        {errors.teachingLevels && (
                          <span className="text-xs text-error">
                            {errors.teachingLevels}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        {t("signup.step3.studentTitle")}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {t("signup.step3.studentSubtitle")}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-600">
                        {t("signup.labels.level")}
                      </label>

                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:outline-none"
                      >
                        <option value={Level.BEGINNER}>
                          {t("levels.beginner")}
                        </option>

                        <option value={Level.INTERMEDIATE}>
                          {t("levels.intermediate")}
                        </option>

                        <option value={Level.ADVANCED}>
                          {t("levels.advanced")}
                        </option>
                      </select>

                      {errors.level && (
                        <span className="text-xs text-error">
                          {errors.level}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <h4 className="text-sm font-bold text-gold-600">
                        {t("signup.parent.title")}
                      </h4>

                      <p className="text-xs text-neutral-500">
                        {t("signup.parent.description")}
                      </p>

                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder={t("signup.placeholders.parentName")}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-900 focus:outline-none"
                      />

                      {errors.parentName && (
                        <span className="text-xs text-error">
                          {errors.parentName}
                        </span>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="tel"
                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            placeholder={t("signup.placeholders.parentPhone")}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-900 focus:outline-none"
                          />

                          {errors.parentPhone && (
                            <span className="text-xs text-error">
                              {errors.parentPhone}
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            placeholder={t("signup.placeholders.parentEmail")}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-900 focus:outline-none"
                          />

                          {errors.parentEmail && (
                            <span className="text-xs text-error">
                              {errors.parentEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    {t("signup.labels.bio")}
                  </label>

                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder={t("signup.placeholders.bio")}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:outline-none"
                  />

                  {errors.bio && (
                    <span className="text-xs text-error">{errors.bio}</span>
                  )}
                </div>

                <div className="flex justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 cursor-pointer rounded-lg bg-neutral-100 py-3 font-semibold text-neutral-700 transition duration-200 hover:bg-neutral-200"
                  >
                    {t("signup.buttons.back")}
                  </button>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-teal-600 py-3 font-semibold text-white transition duration-200 hover:bg-teal-500"
                  >
                    {submitLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        {t("signup.buttons.submitting")}
                      </>
                    ) : (
                      t("signup.buttons.submit")
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
          <div className="text-center text-sm text-neutral-500">
            {t("signup.footer.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="text-teal-600 hover:text-teal-500 font-medium text-decoration-none"
            >
              {t("signup.footer.login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

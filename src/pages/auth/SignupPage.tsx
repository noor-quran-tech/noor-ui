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

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    else if (firstName.length < 2)
      newErrors.firstName = "First name must be at least 2 characters";
    else if (firstName.length > 30)
      newErrors.firstName = "First name must not exceed 30 characters";

    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    else if (lastName.length < 2)
      newErrors.lastName = "Last name must be at least 2 characters";
    else if (lastName.length > 30)
      newErrors.lastName = "Last name must not exceed 30 characters";

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (password.length > 32) newErrors.password = "Password is too long";
    else if (!hasLowerCase || !hasUpperCase || !hasNumber) {
      newErrors.password =
        "Password must contain uppercase, lowercase and number";
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

    if (!country.trim()) newErrors.country = "Country is required";
    else if (country.length < 2)
      newErrors.country = "Country must be at least 2 characters";
    else if (country.length > 50)
      newErrors.country = "Country must not exceed 50 characters";

    if (!city.trim()) newErrors.city = "City is required";
    else if (city.length < 2)
      newErrors.city = "City must be at least 2 characters";
    else if (city.length > 50)
      newErrors.city = "City must not exceed 50 characters";

    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (phoneNumber.length < 10)
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
    else if (phoneNumber.length > 30)
      newErrors.phoneNumber = "Phone number must not exceed 30 digits";

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dobDate = new Date(dateOfBirth);
      const minAgeMs = 5 * 365.25 * 24 * 60 * 60 * 1000;
      if (Date.now() - dobDate.getTime() < minAgeMs) {
        newErrors.dateOfBirth = "User must be at least 5 years old";
      }
    }

    // Optional address fields validation (only if filled)
    if (
      addressLine1 &&
      (addressLine1.trim().length < 3 || addressLine1.length > 100)
    ) {
      newErrors.addressLine1 = "Address must be between 3 and 100 characters";
    }
    if (
      addressLine2 &&
      (addressLine2.trim().length < 3 || addressLine2.length > 100)
    ) {
      newErrors.addressLine2 = "Address must be between 3 and 100 characters";
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
      newErrors.bio = "Bio must be at least 10 characters";
    }

    if (role === "TEACHER") {
      if (
        yearsOfExperience &&
        (yearsOfExperience < 0 || yearsOfExperience > 60)
      ) {
        newErrors.yearsOfExperience =
          "Years of experience must be between 0 and 60";
      }
      if (teachingLevels.length === 0) {
        newErrors.teachingLevels = "At least one teaching level is required";
      }
    }

    if (role === "STUDENT") {
      // If any parent field is touched, validate the whole parent sub-form block
      const hasParentInfo =
        parentName.trim() || parentPhone.trim() || parentEmail.trim();
      if (hasParentInfo) {
        if (!parentName.trim())
          newErrors.parentName = "Parent name is required";
        else if (parentName.length < 2)
          newErrors.parentName = "Parent name is too short";

        if (!parentPhone.trim())
          newErrors.parentPhone = "Parent phone number is required";
        else if (parentPhone.length < 10)
          newErrors.parentPhone = "Parent phone is too short";

        if (!/^\S+@\S+\.\S+$/.test(parentEmail)) {
          newErrors.parentEmail = "Enter a valid parent email address";
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
      toast.success("Signed up successfully");

      navigate("/login");
    } catch (err) {
      let errorMessage = "Error submitting form";
      if (axios.isAxiosError(err)) {
        console.warn("err.response", err.response);
        errorMessage =
          err?.response?.data?.errors?.[0].message ||
          err.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Registration Failed", {
        description: errorMessage,
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
            Learn the Quran from the best teachers in the world.
          </h1>
          <p className="text-neutral-600 leading-relaxed">
            Connecting specialized educators with eager students worldwide
            through an authentic, high-quality, and interactive environment.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-teal-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-87.5 h-87.5 bg-gold-300/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Form Interaction Side-Pane */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-neutral-50">
        <div className="w-full max-w-lg space-y-6">
          {/* Progress Tracking Bar */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Step {step} of 3
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 animate-fade-in"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Create Your Account
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Select your identity space and fill in your core
                    credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: Role.STUDENT }))
                    }
                    className={`p-4 rounded-xl border bg-white cursor-pointer transition relative flex flex-col justify-between ${
                      formData.role === Role.STUDENT
                        ? "border-teal-500 ring-2 ring-teal-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className={`font-bold block ${formData.role === Role.STUDENT ? "text-teal-600" : "text-neutral-800"}`}
                    >
                      Student Portal
                    </span>
                    <span className="text-xs text-neutral-500 mt-1 block">
                      Learn Tajweed, Quran recitation, and Arabic from scratch.
                    </span>
                  </div>

                  <div
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: Role.TEACHER }))
                    }
                    className={`p-4 rounded-xl border bg-white cursor-pointer transition relative flex flex-col justify-between ${
                      formData.role === Role.TEACHER
                        ? "border-teal-500 ring-2 ring-teal-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className={`font-bold block ${formData.role === Role.TEACHER ? "text-teal-600" : "text-neutral-800"}`}
                    >
                      Educator Portal
                    </span>
                    <span className="text-xs text-neutral-500 mt-1 block">
                      For qualified scholars and certified educators.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg bg-white border ${errors.firstName ? "border-error bg-error-bg" : "border-neutral-200"} text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <span className="text-xs text-error">
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-600">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg bg-white border ${errors.lastName ? "border-error bg-error-bg" : "border-neutral-200"} text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10`}
                      placeholder="Doe"
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg bg-white border ${errors.email ? "border-error bg-error-bg" : "border-neutral-200"} text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span className="text-xs text-error">{errors.email}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Secure Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg bg-white border ${errors.password ? "border-error bg-error-bg" : "border-neutral-200"} text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-500/10`}
                    placeholder="••••••••"
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
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg shadow-lg shadow-teal-600/10 transition duration-200 cursor-pointer"
                >
                  Continue
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
            {step === 3 && (
              <div className="space-y-5">
                {formData.role === Role.TEACHER ? (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        Professional Profile
                      </h2>
                      <p className="text-sm text-neutral-500 mt-1">
                        Highlight your teaching tiers for platform vetting.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-600">
                        Total Years of Experience
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none"
                      />
                      {errors.yearsOfExperience && (
                        <span className="text-xs text-error">
                          {errors.yearsOfExperience}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-600 block">
                        Target Teaching Tiers (Select Multiples)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(Level).map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => handleToggleLevel(lvl)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition duration-150 ${
                              formData.teachingLevels.includes(lvl)
                                ? "bg-gold-500 text-white font-bold"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {lvl}
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
                        Current Capabilities
                      </h2>
                      <p className="text-sm text-neutral-500 mt-1">
                        Pick your entry experience tier down below.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-600">
                        Your Starting Tier
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none"
                      >
                        <option value={Level.BEGINNER}>Beginner Level</option>
                        <option value={Level.INTERMEDIATE}>
                          Intermediate Level
                        </option>
                        <option value={Level.ADVANCED}>Advanced Track</option>
                      </select>
                      {errors.level && (
                        <span className="text-xs text-error">
                          {errors.level}
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-gold-600">
                        Parent / Guardian Access (Optional)
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Enables progress monitoring dashboards and session
                        overview features.
                      </p>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="Guardian Full Name"
                        className="w-full px-4 py-2 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                      />
                      {errors.parentName && (
                        <span className="text-xs text-error">
                          {errors.parentName}
                        </span>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleInputChange}
                          placeholder="Guardian Phone"
                          className="w-full px-4 py-2 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                        />
                        {errors.parentPhone && (
                          <span className="text-xs text-error">
                            {errors.parentPhone}
                          </span>
                        )}
                        <input
                          type="email"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          placeholder="Guardian Email"
                          className="w-full px-4 py-2 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none"
                        />
                        {errors.parentEmail && (
                          <span className="text-xs text-error">
                            {errors.parentEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">
                    Introduce Yourself (Bio)
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a little about yourself..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-900 focus:outline-none text-sm"
                  />
                  {errors.bio && (
                    <span className="text-xs text-error">{errors.bio}</span>
                  )}
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
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center cursor-pointer"
                  >
                    {submitLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
          <div className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 hover:text-teal-500 font-medium text-decoration-none"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

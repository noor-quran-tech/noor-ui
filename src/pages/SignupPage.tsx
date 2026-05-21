import React, { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Role, Level, type SignupFormData } from "@utils/types/user";
import { Country, City } from "country-state-city";
import "@styles/signupPage.css";
import axios from "@lib/axios";
import { Spinner } from "react-bootstrap";

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
  timeZone: "",

  parentName: "",
  parentPhone: "",
  parentEmail: "",
};

const SignupPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [countriesList, setCountriesList] = useState<
    { isoCode: string; name: string }[]
  >([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((c) => ({
      isoCode: c.isoCode,
      name: c.name,
    }));

    setCountriesList(allCountries);

    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFormData((prev) => ({ ...prev, timeZone: detectedTimeZone }));
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryIso = e.target.value;
    const countryName: string =
      countriesList.find((c) => c.isoCode === selectedCountryIso)?.name || "";

    setFormData((prev) => ({ ...prev, country: countryName, city: "" }));

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
      languages,
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
        yearsOfExperience === "" ||
        yearsOfExperience < 0 ||
        yearsOfExperience > 60
      ) {
        newErrors.yearsOfExperience =
          "Years of experience must be between 0 and 60";
      }
      if (teachingLevels.length === 0) {
        newErrors.teachingLevels = "At least one teaching level is required";
      }
      // if (languages.length === 0) {
      //   newErrors.languages = "At least one language is required";
      // }
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
        await axios.post("/auth/register-student", formData);
      } else if (role === Role.TEACHER) {
        const finalPayload = setFormData((prev) => ({
          ...prev,
          yearsOfExperience: Number(formData.yearsOfExperience),
        }));

        await axios.post("/auth/register-teacher", finalPayload);
      }
      toast.success("Signed up successfully");
    } catch (err: any) {
      const errorMessage: string =
        err?.response?.data?.message || "Error submitting form";
      toast.error("Registration Failed", { description: errorMessage });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="main-content signup-wrapper">
      {/* Visual Identity Side-Pane */}
      <div className="branding-pane">
        <div className="branding-content">
          <div className="logo-placeholder">Noor</div>
          <h1>Learn the Quran from the best teachers in the world.</h1>{" "}
          <p>
            Connecting specialized educators with eager students worldwide
            through an authentic, high-quality, and interactive
            environment.{" "}
          </p>
        </div>
        <div className="decorative-glow" />
      </div>

      {/* Form Interaction Side-Pane */}
      <div className="form-pane">
        <div className="form-container-box">
          {/* Subtle Progress Bar */}
          <div className="modern-progress">
            <div className="progress-text">Step {step} of 3</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* STEP 1: Account Basics & Modern Choice Cards */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2>Create Your Account</h2>
                <p className="step-desc">
                  Select your identity space and fill in your core credentials.
                </p>

                <div className="card-selector-group">
                  <div
                    className={`identity-card ${formData.role === Role.STUDENT ? "selected" : ""}`}
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: Role.STUDENT }))
                    }
                  >
                    <div className="selection-indicator" />
                    <div className="card-txt">
                      <span className="title">Student Portal</span>
                      <span className="desc">
                        Learn Tajweed, Quran recitation/memorization, and Arabic
                        from scratch.{" "}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`identity-card ${formData.role === Role.TEACHER ? "selected" : ""}`}
                    onClick={() =>
                      setFormData((p) => ({ ...p, role: Role.TEACHER }))
                    }
                  >
                    <div className="selection-indicator" />
                    <div className="card-txt">
                      <span className="title">Educator Portal</span>
                      <span className="desc">
                        For qualified scholars, Arabic specialists, and holders
                        of certified Ijazaat.{" "}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="input-block">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "error" : ""}
                      placeholder="Mohamed"
                    />
                    {errors.firstName && (
                      <span className="err-msg">{errors.firstName}</span>
                    )}
                  </div>
                  <div className="input-block">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "error" : ""}
                      placeholder="Ahmed"
                    />
                    {errors.lastName && (
                      <span className="err-msg">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="input-block">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "error" : ""}
                    placeholder="ahmed@example.com"
                  />
                  {errors.email && (
                    <span className="err-msg">{errors.email}</span>
                  )}
                </div>

                <div className="input-block">
                  <label>Secure Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "error" : ""}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <span className="err-msg">{errors.password}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-action primary"
                  onClick={handleNext}
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 2: Unified Location & Demographics Profile */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2>Profile Basics</h2>
                <p className="step-desc">
                  Help us map your timezone and localized records correctly.
                </p>

                <div className="form-grid">
                  <div className="input-block">
                    <label>Country</label>
                    <select
                      name="countryIso"
                      onChange={handleCountryChange}
                      className={errors.country ? "error" : ""}
                    >
                      <option value="">Select Country</option>
                      {countriesList.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="err-msg">{errors.country}</span>
                    )}
                  </div>

                  <div className="input-block">
                    <label>City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!formData.country}
                      className={errors.city ? "error" : ""}
                    >
                      <option value="">Select City</option>
                      {citiesList.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <span className="err-msg">{errors.city}</span>
                    )}
                  </div>
                </div>

                <div className="input-block">
                  <label>Street Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="123 El Horreya St."
                  />
                  {errors.addressLine1 && (
                    <span className="err-msg">{errors.addressLine1}</span>
                  )}
                </div>
                <div className="input-block">
                  <label>Street Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="123 El Horreya St."
                  />
                  {errors.addressLine2 && (
                    <span className="err-msg">{errors.addressLine2}</span>
                  )}
                </div>

                <div className="form-grid">
                  <div className="input-block">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={errors.phoneNumber ? "error" : ""}
                      placeholder="+20 1..."
                    />
                    {errors.phoneNumber && (
                      <span className="err-msg">{errors.phoneNumber}</span>
                    )}
                  </div>
                  <div className="input-block">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={errors.dateOfBirth ? "error" : ""}
                    />
                    {errors.dateOfBirth && (
                      <span className="err-msg">{errors.dateOfBirth}</span>
                    )}
                  </div>
                </div>

                <div className="footer-actions">
                  <button
                    type="button"
                    className="btn-action secondary"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn-action primary"
                    onClick={handleNext}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Role-Isolated Complex Custom Profiles */}
            {step === 3 && (
              <div className="animate-fade-in">
                {formData.role === Role.TEACHER ? (
                  <>
                    <h2>Professional Profile</h2>
                    <p className="step-desc">
                      Highlight your domain capabilities for student vetting.
                    </p>

                    <div className="input-block">
                      <label>Total Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        placeholder="5"
                      />
                      {errors.yearsOfExperience && (
                        <span className="err-msg">
                          {errors.yearsOfExperience}
                        </span>
                      )}
                    </div>

                    <div className="input-block">
                      <label>Target Teaching Tiers (Select Multiples)</label>
                      <div className="chips-row">
                        {Object.values(Level).map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            className={`chip ${formData.teachingLevels.includes(lvl) ? "active" : ""}`}
                            onClick={() => handleToggleLevel(lvl)}
                          >
                            {lvl}
                          </button>
                        ))}
                        {errors.teachingLevels && (
                          <span className="err-msg">
                            {errors.teachingLevels}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Current Capabilities</h2>
                    <p className="step-desc">
                      Pick your entry experience level down below.
                    </p>

                    <div className="input-block">
                      <label>Your Starting Tier</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                      >
                        <option value={Level.BEGINNER}>Beginner Level</option>
                        <option value={Level.INTERMEDIATE}>
                          Intermediate Level
                        </option>
                        <option value={Level.ADVANCED}>Advanced Track</option>
                      </select>
                    </div>

                    <div className="sub-relation-card">
                      <h4>Parent / Guardian Access (For Minor Accounts)</h4>{" "}
                      <p>
                        Enables progress reporting, session scheduling
                        oversight, and dedicated parental monitoring dashboards.
                      </p>
                      <div className="input-block">
                        <label>Parent Full Name</label>
                        <input
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          placeholder="Guardian Name"
                        />
                        {errors.parentName && (
                          <span className="err-msg">{errors.parentName}</span>
                        )}
                      </div>
                      <div className="form-grid">
                        <div className="input-block">
                          <label>Parent Phone</label>
                          <input
                            type="tel"
                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            placeholder="Guardian Phone"
                          />
                          {errors.parentPhone && (
                            <span className="err-msg">
                              {errors.parentPhone}
                            </span>
                          )}
                        </div>
                        <div className="input-block">
                          <label>Parent Email</label>
                          <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            placeholder="guardian@mail.com"
                          />
                          {errors.parentEmail && (
                            <span className="err-msg">
                              {errors.parentEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="input-block">
                  <label>Introduce Yourself (Bio)</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a little about yourself..."
                  />
                  {errors.bio && <span className="err-msg">{errors.bio}</span>}
                </div>

                <div className="footer-actions">
                  <button
                    type="button"
                    className="btn-action secondary"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-action submit-button">
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
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

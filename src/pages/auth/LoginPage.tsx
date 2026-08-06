import React, { useState, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@store/store";

import axiosAPI from "@lib/axios";
import { setCredentials } from "@store/slices/authSlice";
import { Role } from "@utils/types/user";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  if (loggedInUser) {
    setTimeout(() => {
      navigate("/");
    }, 500);
    return;
  }

  const validateForm = (): boolean => {
    const tempErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      tempErrors.email = t("login.validation.emailRequired");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      tempErrors.email = t("login.validation.invalidEmail");
    }

    if (!password) {
      tempErrors.password = t("login.validation.passwordRequired");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else {
      setPassword(value);
      if (errors.password) {
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    }
  };

  const backendErrorMap: Record<string, string> = {
    "Incorrect email or password": "login.messages.incorrectCredentials",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await axiosAPI.post("/auth/login", {
        email,
        password,
      });

      toast.success(t("login.messages.welcome"), {
        description: t("login.messages.signedIn", {
          name: response.data?.data?.user?.firstName || "User",
        }),
      });

      const token = response?.data?.token;
      const user = response?.data?.data?.user;
      const teacherId = response?.data?.data?.teacherId;
      const studentId = response?.data?.data?.studentId;

      if (user) {
        delete user.password;
        delete user.createdAt;
        delete user.deletedAt;
        delete user.lastLogin;
        delete user.updatedAt;
      }

      dispatch(
        setCredentials({
          token,
          user,
          profile: {
            id: teacherId || studentId,
            type: teacherId
              ? Role.TEACHER
              : studentId
                ? Role.STUDENT
                : Role.ADMIN,
          },
        }),
      );

      navigate("/");
    } catch (err) {
      let errorKey = "login.messages.unknownError";

      if (axios.isAxiosError(err)) {
        const backendMessage =
          err.response?.data?.message ??
          err.response?.data?.errors?.[0]?.message;

        if (backendMessage) {
          errorKey =
            backendErrorMap[backendMessage] ?? "login.messages.unknownError";
        }
      }

      toast.error(t("login.messages.authenticationFailed"), {
        description: t(errorKey),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans text-neutral-800">
      {/* Branding Side-Pane (Light-Mode Luxury Design) */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden border-r border-neutral-200 bg-linear-to-br from-teal-50 to-teal-100 p-12 md:flex">
        <div className="z-10 max-w-md">
          <div className="mb-8 text-4xl font-extrabold tracking-tight text-gold-600 drop-shadow-[0_2px_10px_rgba(0,183,181,0.05)]">
            {t("navbar.brand")}{" "}
            <span className="mb-8 text-3xl font-extrabold tracking-tight text-gold-600 drop-shadow-[0_2px_10px_rgba(0,183,181,0.05)]">
              Noor
            </span>
          </div>

          <h1 className="mb-4 text-4xl leading-tight font-extrabold text-neutral-900">
            {t("login.branding.title")}
          </h1>

          <p className="leading-relaxed text-neutral-600">
            {t("login.branding.description")}
          </p>
        </div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-87.5 w-87.5 rounded-full bg-gold-300/10 blur-[100px]" />
      </div>

      {/* Login Interaction Pane */}
      <div className="flex flex-1 items-center justify-center bg-neutral-50 p-8">
        <div className="animate-fade-in w-full max-w-sm space-y-8">
          <div>
            {/* Mobile Branding Header */}
            <div className="mb-6 text-3xl font-bold tracking-tight text-teal-600 md:hidden">
              {t("navbar.brand")}{" "}
              <span className="text-2xl font-normal text-neutral-400">
                Noor
              </span>
            </div>

            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-neutral-900">
              {t("login.title")}
            </h2>

            <p className="text-sm text-neutral-500">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700"
              >
                {t("login.labels.email")}
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className={`w-full rounded-xl border bg-white px-4 py-3 ${
                  errors.email
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-neutral-200 focus:border-teal-500 focus:ring-teal-500/20"
                } text-neutral-900 placeholder-neutral-400 shadow-xs transition duration-200 focus:ring-4 focus:outline-none`}
                placeholder={t("login.placeholders.email")}
                disabled={loading}
              />

              {errors.email && (
                <span className="mt-1.5 block px-1 text-xs font-medium text-error">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-neutral-700"
                >
                  {t("login.labels.password")}
                </label>

                <Link
                  to="#forgot"
                  className="text-decoration-none text-xs font-semibold text-teal-600 transition duration-150 hover:text-teal-500 hover:underline"
                >
                  {t("login.actions.forgotPassword")}
                </Link>
              </div>

              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className={`w-full rounded-xl border bg-white px-4 py-3 ${
                  errors.password
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-neutral-200 focus:border-teal-500 focus:ring-teal-500/20"
                } text-neutral-900 placeholder-neutral-400 shadow-xs transition duration-200 focus:ring-4 focus:outline-none`}
                placeholder={t("login.placeholders.password")}
                disabled={loading}
              />

              {errors.password && (
                <span className="mt-1.5 block px-1 text-xs font-medium text-error">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-teal-500 py-3.5 font-bold text-white shadow-md shadow-teal-500/10 transition-all duration-200 hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {t("login.actions.authenticating")}
                </>
              ) : (
                t("login.actions.signIn")
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-sm text-neutral-500">
            {t("login.footer.noAccount")}{" "}
            <Link
              to="/signup"
              className="text-decoration-none font-medium text-teal-400 hover:text-teal-300 hover:underline"
            >
              {t("login.actions.createAccount")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

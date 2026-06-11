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

  if (loggedInUser) {
    setTimeout(() => {
      navigate("/");
    }, 500);
    return;
  }

  const validateForm = (): boolean => {
    const tempErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      tempErrors.email = "Enter a valid email address";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    } else {
      setPassword(value);
      if (errors.password)
        setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axiosAPI.post("/auth/login", { email, password });

      toast.success("Welcome back!", {
        description: `Successfully signed in as ${response.data?.data?.user?.firstName || "User"}.`,
      });
      const token = response?.data?.token;
      const user = response?.data?.data?.user;
      const teacherId = response?.data?.data?.teacherId;
      const studentId = response?.data?.data?.studentId;
      if (user) {
        delete user.password;
        delete user.createdAt;
        delete user.deletedAt;
        delete user.isActive;
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
      let errorMessage = "Incorrect email or password";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err?.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error("Authentication Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800 font-sans">
      {/* Branding Side-Pane (Light-Mode Luxury Design) */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-12 relative overflow-hidden border-r border-neutral-200">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gold-300/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Login Interaction Pane (Clean, Modern Light Frame) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div>
            {/* Mobile Branding Header Only */}
            <div className="md:hidden text-3xl font-bold text-teal-600 mb-6 tracking-tight">
              نور{" "}
              <span className="text-2xl font-normal text-neutral-400">
                Noor
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-500 text-sm">
              Provide your account credentials to access your portal space.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-white border ${
                  errors.email
                    ? "border-error focus:ring-error/20 focus:border-error"
                    : "border-neutral-200 focus:border-teal-500 focus:ring-teal-500/20"
                } text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 transition duration-200 shadow-xs`}
                placeholder="john@example.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="text-xs font-medium text-error mt-1.5 block px-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-neutral-700"
                >
                  Password
                </label>
                <Link
                  to="#forgot"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-500 hover:underline transition duration-150 text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-white border ${
                  errors.password
                    ? "border-error focus:ring-error/20 focus:border-error"
                    : "border-neutral-200 focus:border-teal-500 focus:ring-teal-500/20"
                } text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 transition duration-200 shadow-xs`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && (
                <span className="text-xs font-medium text-error mt-1.5 block px-1">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md shadow-teal-500/10 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-sm text-neutral-500 pt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-400 text-decoration-none hover:text-teal-300 hover:underline font-medium "
            >
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

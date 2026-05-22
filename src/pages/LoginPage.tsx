import React, { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";
import axios from "@lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@store/slices/authSlice";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);

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
      const response = await axios.post("/auth/login", { email, password });

      toast.success("Welcome back!", {
        description: `Successfully signed in as ${response.data?.data?.user?.firstName || "User"}.`,
      });

      const token = response?.data?.token;
      const user = response?.data?.data?.user;
      user.password = null;
      dispatch(
        setCredentials({
          token,
          user,
        }),
      );

      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Incorrect email or password";
      toast.error("Authentication Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      {/* Branding Side-Pane */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-neutral-900 to-teal-900 p-12 relative overflow-hidden border-r border-neutral-800">
        <div className="max-w-md z-10">
          <div className="text-4xl font-extrabold text-gold-400 mb-8 tracking-tight drop-shadow-[0_2px_10px_rgba(0,183,181,0.15)]">
            نور{" "}
            <span className="text-3xl font-extrabold text-gold-400 mb-8 tracking-tight drop-shadow-[0_2px_10px_rgba(0,183,181,0.15)]">
              Noor
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-50 leading-tight mb-4">
            Learn the Quran from the best teachers in the world.
          </h1>
          <p className="text-neutral-300 leading-relaxed">
            Welcome back to your authentic space for learning Tajweed, Quran
            recitation, and Arabic pedagogical tracks.
          </p>
        </div>
        {/* Decorative Theme Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-2/3 w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Login Interaction Pane */}
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-900">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-neutral-50 mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-400 text-sm">
              Provide your account credentials to access your portal space.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                  errors.email
                    ? "border-error focus:ring-error"
                    : "border-neutral-700 focus:border-teal-400 focus:ring-teal-400/20"
                } text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 transition duration-200`}
                placeholder="john@example.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="text-sm text-error mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-300"
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs text-teal-400 hover:text-teal-300 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                  errors.password
                    ? "border-error focus:ring-error"
                    : "border-neutral-700 focus:border-teal-400 focus:ring-teal-400/20"
                } text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 transition duration-200`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && (
                <span className="text-sm text-error mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-neutral-50 font-semibold rounded-lg shadow-lg shadow-teal-900/30 active:scale-[0.98] transition duration-200 flex items-center justify-center disabled:opacity-50 cursor-pointer"
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

          <div className="text-center text-sm text-neutral-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-400 hover:text-teal-300 hover:underline font-medium"
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

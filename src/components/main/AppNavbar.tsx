import { toast } from "sonner";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@store/store";

import { logout } from "@store/slices/authSlice";
import "@styles/appNavbar.css";
import i18n from "@/i18n";

function AppNavbar() {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-teal-800 via-teal-700 to-teal-600 py-4 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-white">
            {t("navbar.brand")}
          </span>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {t("navbar.edu")}
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-semibold text-white/90 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* LOGIN / USER */}
          {!loggedInUser ? (
            <Link
              to="/login"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              🔑 {t("navbar.login")}
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-bold ">
                  {loggedInUser.firstName?.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-semibold">
                  {loggedInUser.firstName}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white p-2 shadow-xl border border-neutral-200 z-50">
                  <Link
                    to="/profile"
                    className="block text-black rounded-lg px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    👤 Profile
                  </Link>

                  <Link
                    to="dashboard"
                    className="block text-black rounded-lg px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    📊 Dashboard
                  </Link>

                  <hr className="my-1 text-black" />

                  <button
                    onClick={() => {
                      dispatch(logout());
                      toast.success(t("navbar.logoutSuccess"));
                      setIsDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1">
            <Button
              onClick={() => changeLanguage("en")}
              size="sm"
              className={`border-0 px-3 py-1 text-xs font-bold cursor-pointer ${
                i18n.language === "en"
                  ? "rounded-full bg-white text-teal-700"
                  : "text-white/70"
              }`}
            >
              {t("language.en")}
            </Button>

            <Button
              onClick={() => changeLanguage("ar")}
              size="sm"
              className={`border-0 px-3 py-1 text-xs font-bold cursor-pointer ${
                i18n.language === "ar"
                  ? "rounded-full bg-white text-teal-700"
                  : "text-white/70"
              }`}
            >
              {t("language.ar")}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success(t("navbar.logoutSuccess"));
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-linear-to-r from-teal-800 via-teal-700 to-teal-600 py-4 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-white">
            {t("navbar.brand")}
          </span>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {t("navbar.edu")}
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          {/* DESKTOP NAV LINKS */}
          <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
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

          {/* DESKTOP RIGHT SIDE */}
          <div className="hidden items-center gap-4 md:flex">
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
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-bold">
                    {loggedInUser.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <span className="text-sm font-semibold">
                    {loggedInUser.firstName}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-48 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                    <Link
                      to="/profile"
                      className="block rounded-lg px-3 py-2 text-sm text-black hover:bg-neutral-100"
                    >
                      👤 Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      className="block rounded-lg px-3 py-2 text-sm text-black hover:bg-neutral-100"
                    >
                      📊 Dashboard
                    </Link>

                    <hr className="my-1 text-black" />

                    <button
                      onClick={handleLogout}
                      className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1">
              <Button
                onClick={() => changeLanguage("en")}
                size="sm"
                className={`cursor-pointer border-0 px-3 py-1 text-xs font-bold ${
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
                className={`cursor-pointer border-0 px-3 py-1 text-xs font-bold ${
                  i18n.language === "ar"
                    ? "rounded-full bg-white text-teal-700"
                    : "text-white/70"
                }`}
              >
                {t("language.ar")}
              </Button>
            </div>
          </div>

          {/* MOBILE BURGER MENU */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white md:hidden"
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 rounded-full bg-white transition-all ${
                  isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-white transition-all ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-white transition-all ${
                  isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mx-4 mt-3 rounded-2xl border border-white/20 bg-white/95 px-4 py-4 text-slate-800 shadow-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}

            {!loggedInUser ? (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                🔑 {t("navbar.login")}
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  👤 Profile
                </Link>

                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  📊 Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </>
            )}

            <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
              <span className="text-sm font-semibold text-slate-700">
                Language
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    changeLanguage("en");
                    closeMobileMenu();
                  }}
                  size="sm"
                  className="border-0 px-3 py-1 text-xs font-bold"
                >
                  EN
                </Button>
                <Button
                  onClick={() => {
                    changeLanguage("ar");
                    closeMobileMenu();
                  }}
                  size="sm"
                  className="border-0 px-3 py-1 text-xs font-bold"
                >
                  AR
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default AppNavbar;

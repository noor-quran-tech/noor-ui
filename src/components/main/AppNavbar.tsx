import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
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
    <Navbar
      expand="lg"
      fixed="top"
      className="py-3 navbar-bg bg-gradient-primary transition"
      style={{ fontWeight: "600" }}
    >
      <Container>
        {/* Brand Logo Identity */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <span className="fs-3 logo-icon">🕌</span>
          <span className="fw-bold fs-4 text-gold-400">
            {t("navbar.brand")}
          </span>
          <span className="edu badge bg-light text-dark mb-3">
            {t("navbar.edu")}
          </span>
        </Navbar.Brand>

        {/* The Native Hamburger Toggle Button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Everything inside Collapse hides behind the hamburger menu on small screens */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Middle Section: Navigation Links */}
          <Nav className="mx-auto gap-2 text-center text-lg-start my-3 my-lg-0">
            {navLinks.map((link) => (
              <Nav.Item key={link.path}>
                <Nav.Link as={Link} to={link.path}>
                  {link.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* Right Section: Profile State & Language Changer Stack */}
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-3 ms-lg-auto">
            {!loggedInUser ? (
              <Link
                to="/login"
                className="btn btn-outline-dark w-100 w-lg-auto px-4"
                style={{ fontWeight: "600" }}
              >
                <span className="key-icon me-1">🔑</span>
                {t("navbar.login")}
              </Link>
            ) : (
              <div className="user-dropdown-simple">
                <Dropdown
                  show={isDropdownOpen}
                  onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                  align="end"
                >
                  <Dropdown.Toggle
                    as="button"
                    className="user-toggle d-flex align-items-center gap-2 btn btn-transparent p-2 rounded mx-auto"
                  >
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        background:
                          "linear-gradient(135deg,var(--dark2-color),var(--dark1-color))",
                        color: "white",
                        fontWeight: "600",
                      }}
                    ></div>
                    <span style={{ fontWeight: "600" }}>
                      {loggedInUser.firstName.substring(0, 20)}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm rounded border-0 position-absolute text-center text-lg-start">
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 {t("navbar.profile")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to={
                        loggedInUser?.role === "student"
                          ? "/student-portal"
                          : "/teacher-dashboard"
                      }
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {loggedInUser?.role === "student"
                        ? `🪪 ${t("navbar.studentPortal")}`
                        : `📊 ${t("navbar.teacherDashboard")}`}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        dispatch(logout());
                        setIsDropdownOpen(false);
                        toast.success(t("navbar.logoutSuccess"));
                        navigate("/login");
                      }}
                      className="text-danger"
                    >
                      🚪 {t("navbar.logout")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}

            {/* Language Switcher Button Group */}
            <div className="d-flex align-items-center gap-1 p-1 rounded-pill bg-light border shadow-sm language-container">
              <Button
                variant={i18n.language === "en" ? "dark" : "transparent"}
                size="sm"
                className={`rounded-pill px-3 py-1 border-0 transition-all ${i18n.language === "en" ? "text-white" : "text-muted"}`}
                style={{ fontSize: "12px", fontWeight: "700" }}
                onClick={() => changeLanguage("en")}
              >
                {t("language.en")}
              </Button>
              <Button
                variant={i18n.language === "ar" ? "dark" : "transparent"}
                size="sm"
                className={`rounded-pill px-3 py-1 border-0 transition-all ${i18n.language === "ar" ? "text-white" : "text-muted"}`}
                style={{ fontSize: "12px", fontWeight: "700" }}
                onClick={() => changeLanguage("ar")}
              >
                {t("language.ar")}
              </Button>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import "@styles/app-navbar.css";
// import { logout } from "@store/slices/authSlice";
// import { toast } from "sonner";
import { Button } from "react-bootstrap";
// import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

function AppNavbar() {
  // const loggedInUser = useSelector((state) => state.auth.user);
  // const user = loggedInUser?.user;
  const user: boolean = false;
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`py-3 navbar-bg bg-gradient-primary transition`}
      style={{
        fontWeight: "600",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <span className="fs-3 logo-icon">🕌</span>
          <span className="fw-bold fs-4 text-gradient">noor</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-2">
            {navLinks.map((link) => (
              <Nav.Item key={link.path}>
                <Nav.Link as={Link} to={link.path}>
                  {link.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {!user ? (
            <div className="d-flex gap-2">
              <Link
                to="/login"
                className="btn btn-outline-dark mx-3"
                style={{
                  fontWeight: "600",
                }}
              >
                <span className="key-icon">🔑</span>
                Login
              </Link>
            </div>
          ) : (
            <div className="user-dropdown-simple ms-3">
              <Dropdown
                show={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Dropdown.Toggle
                  as="button"
                  className="user-toggle d-flex align-items-center gap-2 btn btn-transparent p-2 rounded"
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
                  >
                    username
                  </div>
                  <span
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    username
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm rounded">
                  <Dropdown.Item
                    as={Link}
                    to="/profile"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    👤 Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to={
                      user === "student"
                        ? "/student-portal"
                        : "/teacher-dashboard"
                    }
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    {user === "student"
                      ? `🪪 studentPortal`
                      : `📊 teacherDashboard`}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      //   dispatch(logout());
                      setIsDropdownOpen(false);
                      //   toast.success(t("navbar.logoutSuccess"));
                      //   navigate("/login");
                    }}
                    className="text-danger"
                  >
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          {/* Language Switcher */}
          <div className="d-flex align-items-center ms-lg-3 gap-1 p-1 rounded-pill bg-light border shadow-sm language-container">
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

import { Route, Routes } from "react-router-dom";

import HomePage from "@pages/static/HomePage";
import SignupPage from "@pages/auth/SignupPage";
import LoginPage from "@pages/auth/LoginPage";
import ContactPage from "@pages/static/ContactPage";
import AboutPage from "@pages/static/AboutPage";
import NotFoundPage from "@pages/static/NotFoundPage";
import ProfilePage from "@pages/account/ProfilePage";
import RequestSubjectPage from "@pages/dashboard/RequestSubject";
import Dashboard from "@pages/dashboard/Dashboard";
import { GuestRoute, ProtectedRoute } from "@components/guards/AuthGuards";

const AppRoutes = () => {
  return (
    <main className="main-content">
      <Routes>
        {/* ====================================================
            PUBLIC ROUTES (Anyone can access)
           ==================================================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* ====================================================
            GUEST-ONLY ROUTES (Logged-in users get redirected)
           ==================================================== */}
        <Route element={<GuestRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ====================================================
            PROTECTED ROUTES (Requires authentication)
           ==================================================== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/request-subject" element={<RequestSubjectPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            {" "}
          </Route>
        </Route>

        {/* FALLBACK 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;

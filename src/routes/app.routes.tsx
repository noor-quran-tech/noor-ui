import { Route, Routes } from "react-router-dom";

import HomePage from "@pages/static/HomePage";
import SignupPage from "@pages/auth/SignupPage";
import LoginPage from "@pages/auth/LoginPage";
import ContactPage from "@pages/static/ContactPage";
import AboutPage from "@pages/static/AboutPage";
import NotFoundPage from "@pages/static/NotFoundPage";
import ProfilePage from "@pages/account/ProfilePage";
import RequestSubjectPage from "@pages/dashboard/request-subject";

const AppRoutes = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/request-subject" element={<RequestSubjectPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;

import { Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage";
import SignupPage from "@pages/SignupPage";
import LoginPage from "@pages/LoginPage";
import ContactPage from "@pages/ContactPage";
import AboutPage from "@pages/AboutPage";

const AppRoutes = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;

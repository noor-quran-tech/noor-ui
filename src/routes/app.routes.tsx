import { Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage";
import SignupPage from "@pages/SignupPage";
import LoginPage from "@pages/LoginPage";

const AppRoutes = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;

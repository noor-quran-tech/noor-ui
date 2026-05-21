import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
const AppRoutes = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;

import { Route, Routes } from "react-router-dom";

import { GuestRoute, ProtectedRoute } from "@components/guards/AuthGuards";

import HomePage from "@pages/static/HomePage";
import SignupPage from "@pages/auth/SignupPage";
import LoginPage from "@pages/auth/LoginPage";
import ContactPage from "@pages/static/ContactPage";
import AboutPage from "@pages/static/AboutPage";
import NotFoundPage from "@pages/static/NotFoundPage";
import ProfilePage from "@pages/account/ProfilePage";
import RequestSubjectPage from "@pages/dashboard/RequestSubject";
import Dashboard from "@pages/dashboard/Dashboard";
import UserManagement from "@pages/dashboard/UserManagement";
import UserProfilePage from "@pages/dashboard/UserProfilePage";
import SessionsPage from "@pages/dashboard/SessionsPage";
import Requests from "@pages/dashboard/Requests";
import Inquiries from "@pages/dashboard/Inquiries";
import Subscriptions from "@pages/dashboard/Subscriptions";
import SubscriptionPlans from "@pages/dashboard/SubscriptionPlans";
import PaypalPayment from "@pages/payment/PaypalPayment";
import CompletePayment from "@components/payment/CompletePayment";
import CancelPayment from "@components/payment/CancelPayment";

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
            <Route path="users" element={<UserManagement />} />
            <Route path="users/students/:id" element={<UserProfilePage />} />
            <Route path="users/teachers/:id" element={<UserProfilePage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="requests" element={<Requests />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
          </Route>

          <Route path="/payment" element={<PaypalPayment />}></Route>
          <Route path="complete-payment" element={<CompletePayment />} />
          <Route path="cancel-payment" element={<CancelPayment />} />
        </Route>

        {/* FALLBACK 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export default AppRoutes;

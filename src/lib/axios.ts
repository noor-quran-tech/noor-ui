import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";

import { logout } from "@store/slices/authSlice";
import { store } from "@store/store";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${serverUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message;
    const errorName = error.response?.data.error.name;

    const isTokenExpired =
      errorMessage === "jwt expired" && errorName === "TokenExpiredError";

    if (isTokenExpired) {
      store.dispatch(logout());
      toast.success(t("navbar.logoutSuccess"));
    }

    return Promise.reject(error);
  },
);

export default api;

import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";

import { logout } from "@store/slices/authSlice";
import { store } from "@store/store";
import { hasValidCredentials, PUBLIC_ENDPOINTS } from "@utils/helpers/auth";

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
    const isPublicRoute = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (!isPublicRoute) {
      const isCredentialsValid = hasValidCredentials();
      if (!isCredentialsValid) {
        store.dispatch(logout());
        toast.info(t("validation.AUTH_CREDENTIALS_CORRUPTED"));
        return Promise.reject(
          new axios.Cancel(t("validation.AUTH_CREDENTIALS_CORRUPTED")),
        );
      }
    }

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
    const errorName = error.response?.data?.error?.name;
    const errorCode = error.response?.data?.error?.errorCode;

    const isTokenExpired =
      errorName === "TokenExpiredError" || errorCode === "AUTH_TOKEN_EXPIRED";

    if (isTokenExpired) {
      store.dispatch(logout());
      toast.info(t("validation.AUTH_TOKEN_EXPIRED"));
    }

    return Promise.reject(error);
  },
);

export default api;

import { isAxiosError } from "axios";
import type { TFunction } from "i18next";

interface ApiErrorPayload {
  message?: string;
  errorCode?: string; // Top-Level AppError code
  errors?: Array<{
    code?: string; // Zod validation error code
    message?: string;
    field?: string;
  }>;
}

export const resolveApiErrorMessage = (
  err: unknown,
  t: TFunction,
  fallback: string,
): string => {
  if (!isAxiosError<ApiErrorPayload>(err)) {
    if (err instanceof Error) return err.message;
    return fallback;
  }

  const serverData = err.response?.data;
  const validationCode = serverData?.errors?.[0]?.code;
  console.log("serverData", serverData);
  console.log("validationCode", validationCode);
  const x = `validation.${validationCode}`;
  console.log("1- t(x)", t(x), " x = ", x);

  if (validationCode) {
    const key = `validation.${validationCode}`;
    console.log("1- t(key)", t(key), " key = ", key);
    if (t(key) !== key) return t(key);
  }

  const appErrorCode = serverData?.errorCode;
  console.log("appErrorCode", appErrorCode);
  const key = `APIErrors.${appErrorCode}`;

  console.log("2- t(key)", t(key), " key = ", key);
  if (appErrorCode) {
    const key = `APIErrors.${appErrorCode}`;
    console.log("2- t(key)", t(key), " key = ", key);
    if (t(key) !== key) return t(key);
  }

  return serverData?.errors?.[0]?.message ?? serverData?.message ?? fallback;
};

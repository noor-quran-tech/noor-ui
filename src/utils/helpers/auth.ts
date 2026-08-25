export const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/subscription-plans",
];

export const hasValidCredentials = (): boolean => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  const rawProfile = localStorage.getItem("profile");

  if (
    !token ||
    !rawUser ||
    !rawProfile ||
    rawUser === "undefined" ||
    rawProfile === "undefined"
  ) {
    return false;
  }

  try {
    const user = JSON.parse(rawUser);
    const profile = JSON.parse(rawProfile);
    return Boolean(user && profile);
  } catch {
    return false;
  }
};

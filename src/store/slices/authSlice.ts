import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const getTokenFromLocalStorage = token ? localStorage.getItem("token") : null;

const rawUser = localStorage.getItem("user");
const getUserFromLocalStorage = rawUser ? JSON.parse(rawUser) : null;

const rawProfile = localStorage.getItem("profile");
const getProfile = rawProfile ? JSON.parse(rawProfile) : null;

const authSlice = createSlice({
  initialState: {
    token: getTokenFromLocalStorage,
    user: getUserFromLocalStorage,
    profile: getProfile,
  },
  name: "authSlice",
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.profile = action.payload.profile;

      localStorage.setItem("token", state.token || "");
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("profile", JSON.stringify(state.profile));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.profile = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

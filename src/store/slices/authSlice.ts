import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocalStorage = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const getUserFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const authSlice = createSlice({
  initialState: {
    token: getTokenFromLocalStorage,
    user: getUserFromLocalStorage,
  },
  name: "authSlice",
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", state.token || "");
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
  isPremiumUser: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.isPremiumUser = action.payload.isPremiumUser; // store premium flag
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("isPremiumUser", action.payload.isPremiumUser);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.isPremiumUser = false;
      localStorage.removeItem("token");
      localStorage.removeItem("isPremiumUser");
    },
    setPremium: (state, action) => {
      state.isPremiumUser = action.payload;
      localStorage.setItem("isPremiumUser", action.payload);
    },
    hydrateAuth: (state) => {
      const token = localStorage.getItem("token");
      const isPremiumUser = localStorage.getItem("isPremiumUser") === "true";
      if (token) {
        state.isLoggedIn = true;
        state.token = token;
        state.isPremiumUser = isPremiumUser;
      }
    }
  },
});

export const { login, logout, setPremium, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  sidebarView: false,
  menuOpen: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    toggleSidebar: (state, action) => {
      state.sidebarView = action.payload;
    },
    toggleMenu: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.menuOpen = action.payload;
      } else {
        state.menuOpen = !state.menuOpen;
      }
    },
  },
});

export const { toggleLogin, toggleSidebar, toggleMenu } = navbarSlice.actions;
export default navbarSlice.reducer;
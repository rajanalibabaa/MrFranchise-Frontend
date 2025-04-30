import { configureStore } from "@reduxjs/toolkit";
import navbarReduces from "../slices/navbarSlices";

 const store = configureStore({
  reducer: {
    navbar: navbarReduces,
  },
});
export default store;
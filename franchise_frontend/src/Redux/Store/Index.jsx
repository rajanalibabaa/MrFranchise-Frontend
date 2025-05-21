import { configureStore } from "@reduxjs/toolkit";
import navbarReduces from "../Slices/navbarSlice";
import authSlice from "../Slices/AuthSlice/authSlice";
import brandRegister from "../Slices/brandRegisterSlice";
 const store = configureStore({
  reducer: {
    navbar: navbarReduces,
    brandRegister: brandRegister,
    auth:authSlice,
  },
});
export default store;
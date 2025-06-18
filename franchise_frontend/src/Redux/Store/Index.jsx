import { configureStore } from "@reduxjs/toolkit";
import navbarReduces from "../Slices/navbarSlice";
import authSlice from "../Slices/AuthSlice/authSlice";
import brandRegister from "../Slices/BrandRegisterSlice"
 const store = configureStore({
  reducer: {
    navbar: navbarReduces,
    brandRegister: brandRegister,
    loginUser:authSlice
  },
});
export default store;
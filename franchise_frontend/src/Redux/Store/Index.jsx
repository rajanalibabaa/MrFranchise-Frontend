import { configureStore } from "@reduxjs/toolkit";
import navbarReduces from "../Slices/navbarSlice";
import brandRegisterReducer from "../Slices/BrandRegisterSlice";
 const store = configureStore({
  reducer: {
    navbar: navbarReduces,
    brandRegister: brandRegisterReducer,
  },
});
export default store;
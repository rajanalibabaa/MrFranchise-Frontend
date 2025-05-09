import { configureStore } from "@reduxjs/toolkit";
import navbarReduces from "../slices/navbarSlices";
import brandRegisterReducer from "../slices/brandRegisterSlice";
 const store = configureStore({
  reducer: {
    navbar: navbarReduces,
    brandRegister: brandRegisterReducer,
  },
});
export default store;
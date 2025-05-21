import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Slices/AuthSlice/authSlice";
import navReducer from "../Slices/navbarSlice";
 const store = configureStore({
  reducer: {
    navbar:navReducer,
    auth: authReducer,
  },
});
export default store;







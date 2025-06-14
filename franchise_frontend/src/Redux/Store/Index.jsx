import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Slices/AuthSlice/authSlice";
import navReducer from "../Slices/navbarSlice";
import likedBrandsSlice from "../Slices/LikedBrandSlices/LikedBrandSlice";
import brandReducer from '../Slices/brandSlice.jsx';
import loadingReducer  from "../Slices/loadingSlice.jsx";

 const store = configureStore({
  reducer: {
    navbar:navReducer,
    auth: authReducer,
    likedBrands : likedBrandsSlice,
    brands : brandReducer,
    loading :loadingReducer
  },
});
export default store;
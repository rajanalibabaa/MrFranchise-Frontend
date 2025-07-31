import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Slices/AuthSlice/authSlice";
import navReducer from "../Slices/navbarSlice";
// import likedBrandsSlice from "../Slices/LikedBrandSlices/LikedBrandSlice";
// import brandReducer from '../Slices/brandSlice.jsx';
import loadingReducer  from "../Slices/loadingSlice.jsx";

import getAllBrands  from "../Slices/GetAllBrandsDataUpdationFile.jsx";
import topFoodsfranchise from "../Slices/TopCardFetchingSlice.jsx";
 const store = configureStore({
  reducer: {
    navbar:navReducer,
    auth: authReducer,
    // likedBrands : likedBrandsSlice,
    // brands : brandReducer,
    loading :loadingReducer,
    brands:getAllBrands,
    foodfranchise:topFoodsfranchise
  },
});
export default store;
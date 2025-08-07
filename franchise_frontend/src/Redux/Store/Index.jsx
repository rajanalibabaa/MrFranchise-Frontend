// import { configureStore } from "@reduxjs/toolkit";

// import authReducer from "../Slices/AuthSlice/authSlice";
// import navReducer from "../Slices/navbarSlice";
// // import likedBrandsSlice from "../Slices/LikedBrandSlices/LikedBrandSlice";
// // import brandReducer from '../Slices/brandSlice.jsx';
// import loadingReducer  from "../Slices/loadingSlice.jsx";

// import getAllBrands  from "../Slices/GetAllBrandsDataUpdationFile.jsx";
// import openBrandViewPage  from "../Slices/OpenBrandNewPageSlice.jsx";
// import topFoodsfranchise from "../Slices/TopCardFetchingSlice.jsx";
// import filterDropdown from "../../Redux/Slices/filterDropdownData.jsx"
// import filterBrandReducer from "../../Redux/Slices/FilterBrandSlice.jsx"
// import brandCategoryReducer from "../../Redux/Slices/SideMenuHoverBrandSlices.jsx"
// import ShortListBrands from "../../Redux/Slices/shortlistslice.jsx";
//  const store = configureStore({
//   reducer: {
//     navbar:navReducer,
//     auth: authReducer,
//     // likedBrands : likedBrandsSlice,
//     // brands : brandReducer,
//     filterBrands: filterBrandReducer,
//     filterDropdown:filterDropdown,
//     loading :loadingReducer,
//     brands:getAllBrands,
//     foodfranchise:topFoodsfranchise,
//     openBrandDialog: openBrandViewPage,
//     brandCategory: brandCategoryReducer,
//     shortlist: ShortListBrands
//   },
// });
// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all your reducers
import authReducer from "../Slices/AuthSlice/authSlice";
import navReducer from "../Slices/navbarSlice";
import loadingReducer from "../Slices/loadingSlice";
import getAllBrands from "../Slices/GetAllBrandsDataUpdationFile";
import openBrandViewPage from "../Slices/OpenBrandNewPageSlice";
import topFoodsfranchise from "../Slices/TopCardFetchingSlice";
import filterDropdown from "../../Redux/Slices/filterDropdownData";
import filterBrandReducer from "../../Redux/Slices/FilterBrandSlice";
import brandCategoryReducer from "../../Redux/Slices/SideMenuHoverBrandSlices";
import ShortListBrands from "../../Redux/Slices/shortlistslice";

// Combine reducers first
const rootReducer = combineReducers({
  navbar: navReducer,
  auth: authReducer,
  filterBrands: filterBrandReducer,
  filterDropdown: filterDropdown,
  loading: loadingReducer,
  brands: getAllBrands,
  foodfranchise: topFoodsfranchise,
  openBrandDialog: openBrandViewPage,
  brandCategory: brandCategoryReducer,
  shortList: ShortListBrands
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'shortlist'] // Only persist these slices
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
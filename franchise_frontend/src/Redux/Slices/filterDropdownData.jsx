import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
 
const API_BASE_URL = 'http://localhost:5000/api/v1/';
 
// Async thunk for fetching all filter options
export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { sub, state, district,main } = params;
      const queryParams = new URLSearchParams();
     
      if (sub) queryParams.append('sub', sub);
      if (state) queryParams.append('state', state);
      if (district) queryParams.append('district', district);
      if (main){
        queryParams.append('main', main);
      }else {
        queryParams.append('main', "Food & Beverages");
      }
 
      const response = await axios.post(`${API_BASE_URL}filter/getAllBrandFiltersdata?${queryParams}`);
      console.log("queryParams =====:", response.data.data)
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
 
const initialState = {
  // Main filter options
  mainCategories: [],
  subCategories: [],
  childCategories: [],
  investmentRanges: [],
  franchiseModels: [],
  states: [],
  districts: [],
  cities: [],
 
  // Loading states
  loading: false,
  loadingChildCategories: false,
  loadingDistricts: false,
  loadingCities: false,
 
  // Error states
  error: null,
  childCategoriesError: null,
  districtsError: null,
  citiesError: null,
};
 
const filterDropdownSlice = createSlice({
  name: 'filterDropdown',
  initialState,
  reducers: {
    resetChildCategories: (state) => {
      state.childCategories = [];
    },
    resetDistricts: (state) => {
      state.districts = [];
    },
    resetCities: (state) => {
      state.cities = [];
    },
    clearErrors: (state) => {
      state.error = null;
      state.childCategoriesError = null;
      state.districtsError = null;
      state.citiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial load of all filters
      .addCase(fetchFilterOptions.pending, (state, action) => {
        if (!action.meta.arg) {
          // Only set main loading if fetching all filters
          state.loading = true;
        }
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const params = action.meta.arg || {};
       
        if (params.sub) {
          // Child categories response
          state.childCategories = action.payload;
          state.loadingChildCategories = false;
        }
        else if (params.state) {
          // Districts response
          state.districts = action.payload;
          state.loadingDistricts = false;
        }
        else if (params.district) {
          // Cities response
          state.cities = action.payload;
          state.loadingCities = false;
        }
        else {
          // Initial full filters response
          state.mainCategories = action.payload.maincat || [];
          state.subCategories = action.payload.subcat || [];
          state.investmentRanges = action.payload.investmentRange || [];
          state.franchiseModels = action.payload.franchiseModel || [];
          state.states = action.payload.states || [];
          state.loading = false;
        }
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const params = action.meta.arg || {};
       
        if (params.sub) {
          state.childCategoriesError = action.payload;
          state.loadingChildCategories = false;
        }
        else if (params.state) {
          state.districtsError = action.payload;
          state.loadingDistricts = false;
        }
        else if (params.district) {
          state.citiesError = action.payload;
          state.loadingCities = false;
        }
        else {
          state.error = action.payload;
          state.loading = false;
        }
      });
  }
});
 
export const {
  resetChildCategories,
  resetDistricts,
  resetCities,
  clearErrors
} = filterDropdownSlice.actions;
 
export default filterDropdownSlice.reducer;
 
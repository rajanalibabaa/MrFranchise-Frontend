// src/features/brandSlice.js
import { createSlice, createAsyncThunk, combineSlices } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';
import { userId } from '../../Utils/autherId';
 
 
export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
 
      console.log("userId :",userId)
      // Send the page directly in query params
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getAllBrandListing`, {
        params: {
          page,
          id:userId, // directly use page
        }
      });
 
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination,
        page,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  }
);
 
const initialState = {
  brands: [],
  fetchedPages: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isLoading: false,
  error: null,
  viewedBrandsCount: 0 // Track how many times brands have been viewed
 
};
 
const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    resetBrands: (state) => {
      return {
        ...initialState,
        fetchedPages: [],
      };  
    },
    incrementViewedCount: (state) => {
      state.viewedBrandsCount += 1;
    },
    resetViewedCount: (state) => {
      state.viewedBrandsCount = 0;
    },
 toggleBrandLike: (state, action) => {
  const brandId = action.payload;
  state.brands = state.brands.map(brand => 
    brand.uuid === brandId 
      ? { ...brand, isLiked: !brand.isLiked }
      : brand
  );
},
   toggleBrandShortList: (state, action) => {
  const brandId = action.payload;
  state.brands = state.brands.map(brand => 
    brand.uuid === brandId 
      ? { ...brand, isShortListed: !brand.isShortListed }
      : brand
  );
}

 
 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
     .addCase(fetchBrands.fulfilled, (state, action) => {
  const { brands, pagination, page } = action.payload;
  state.isLoading = false;
  state.pagination = pagination;
 
  // Prevent duplicate page fetches
  if (!state.fetchedPages.includes(page)) {
    state.fetchedPages.push(page);
  }
 
  const existingUUIDs = new Set(state.brands.map((b) => b.uuid));
  const uniqueNewBrands = brands.filter((b) => !existingUUIDs.has(b.uuid));
 
  if (page === 1) {
    // Replace all
    state.brands = uniqueNewBrands;
  } else {
    // Append only new brands
    state.brands = [...state.brands, ...uniqueNewBrands];
  }
 
  state.viewedBrandsCount = action.payload.viewedCount || 0;
})
 
 
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});
 
export const { resetBrands, incrementViewedCount, resetViewedCount, toggleBrandLike, toggleBrandShortList } = brandSlice.actions;
export default brandSlice.reducer;
 
 
// src/features/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';

export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      // Send the page directly in query params
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getAllBrandListing`, {
        params: {
          page, // directly use page
        }
      });

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);


const initialState = {
  brands: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
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
      return initialState;
    },
    incrementViewedCount: (state) => {
      state.viewedBrandsCount += 1;
    },
    resetViewedCount: (state) => {
      state.viewedBrandsCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If it's the first page, replace brands, otherwise append
        if (action.payload.pagination.currentPage === 1) {
          state.brands = action.payload.brands;
        } else {
          state.brands = [...state.brands, ...action.payload.brands];
        }
        
        state.pagination = action.payload.pagination;
        state.viewedBrandsCount = action.payload.viewedCount || 0;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  }
});

export const { resetBrands, incrementViewedCount, resetViewedCount } = brandSlice.actions;
export default brandSlice.reducer;
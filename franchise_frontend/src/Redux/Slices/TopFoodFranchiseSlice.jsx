// src/features/topFoodFranchiseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';

export const fetchTopFoodFranchises = createAsyncThunk(
  'topFoodFranchises/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopFoodFranchise`, {
        params: {
          page,
        }
      });

      // Log the incoming response data for debugging
      console.log('API Response:', response.data);

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        },
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
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
  viewedBrandsCount: 0
};

const topFoodFranchiseSlice = createSlice({
  name: 'topFoodFranchises',
  initialState,
  reducers: {
    resetTopFoodFranchises: (state) => {
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
      .addCase(fetchTopFoodFranchises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopFoodFranchises.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Processed brands data:', action.payload.brands);
        console.log('Processed pagination data:', action.payload.pagination);
        
        state.brands = action.payload.brands;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTopFoodFranchises.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Redux error state:', action.payload);
        state.error = action.payload?.message || action.error.message;
      });
  }
});

export const { 
  resetTopFoodFranchises, 
  incrementViewedCount, 
  resetViewedCount 
} = topFoodFranchiseSlice.actions;

export default topFoodFranchiseSlice.reducer;
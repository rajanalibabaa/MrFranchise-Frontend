// src/features/topFoodFranchiseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';

export const fetchTopFoodFranchises = createAsyncThunk(
  'topFoodFranchises/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopFoodFranchise`, {
        params: { page }
      });

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
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTopCafes = createAsyncThunk(
  'topCafes/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopCafes`, {
        params: { page }
      });

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
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  foodFranchises: {
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
  },
  cafes: {
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
  }
};

const topFoodFranchiseSlice = createSlice({
  name: 'topBrands',
  initialState,
  reducers: {
    resetTopFoodFranchises: (state) => {
      state.foodFranchises = initialState.foodFranchises;
    },
    resetTopCafes: (state) => {
      state.cafes = initialState.cafes;
    },
    incrementFoodFranchiseViewedCount: (state) => {
      state.foodFranchises.viewedBrandsCount += 1;
    },
    incrementCafesViewedCount: (state) => {
      state.cafes.viewedBrandsCount += 1;
    },
    resetFoodFranchiseViewedCount: (state) => {
      state.foodFranchises.viewedBrandsCount = 0;
    },
    resetCafesViewedCount: (state) => {
      state.cafes.viewedBrandsCount = 0;
    }
  },
  extraReducers: (builder) => {
    // Food Franchises cases
    builder.addCase(fetchTopFoodFranchises.pending, (state) => {
      state.foodFranchises.isLoading = true;
      state.foodFranchises.error = null;
    });
    builder.addCase(fetchTopFoodFranchises.fulfilled, (state, action) => {
      state.foodFranchises.isLoading = false;
      state.foodFranchises.brands = action.payload.brands;
      state.foodFranchises.pagination = action.payload.pagination;
    });
    builder.addCase(fetchTopFoodFranchises.rejected, (state, action) => {
      state.foodFranchises.isLoading = false;
      state.foodFranchises.error = action.payload?.message || action.error.message;
    });

    // Cafes cases
    builder.addCase(fetchTopCafes.pending, (state) => {
      state.cafes.isLoading = true;
      state.cafes.error = null;
    });
    builder.addCase(fetchTopCafes.fulfilled, (state, action) => {
      state.cafes.isLoading = false;
      state.cafes.brands = action.payload.brands;
      state.cafes.pagination = action.payload.pagination;
    });
    builder.addCase(fetchTopCafes.rejected, (state, action) => {
      state.cafes.isLoading = false;
      state.cafes.error = action.payload?.message || action.error.message;
    });
  }
});

export const { 
  resetTopFoodFranchises,
  resetTopCafes,
  incrementFoodFranchiseViewedCount,
  incrementCafesViewedCount,
  resetFoodFranchiseViewedCount,
  resetCafesViewedCount
} = topFoodFranchiseSlice.actions;

export default topFoodFranchiseSlice.reducer;
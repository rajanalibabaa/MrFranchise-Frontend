// src/features/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';

export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getAllBrandListing`, {
        params: { page },
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
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isLoading: false,
  error: null,
  viewedBrandsCount: 0,
 fetchedPages: [],
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

       if (!state.fetchedPages.includes(page)) {
  state.fetchedPages.push(page);

  if (page === 1) {
    state.brands = brands;
  } else {
    state.brands = [...state.brands, ...brands];
  }
}

      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { resetBrands, incrementViewedCount, resetViewedCount } = brandSlice.actions;
export default brandSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';

// Cache object to store prefetched data
const prefetchCache = {};

// Thunk for fetching brands by child category with caching
export const fetchBrandsByChildCategory = createAsyncThunk(
  'brandCategory/fetchBrandsByChildCategory',
  async ({ subCategory, childCategory, page = 1, limit = 30, isPrefetch = false }, { rejectWithValue, getState }) => {
    try {
      // Check cache first for prefetched data
      const cacheKey = `${subCategory}_${childCategory}_${page}`;
      
      if (isPrefetch && prefetchCache[cacheKey]) {
        return { data: prefetchCache[cacheKey], page, isPrefetch };
      }

      const response = await axios.get(`${API_BASE_URL}/brandlisting/getBrandsByChildCategory`, {
        params: { subCategory, childCategory, page, limit }
      });

      // Store in cache if this is a prefetch
      if (isPrefetch) {
        prefetchCache[cacheKey] = response.data.data;
      }

      return { data: response.data.data, page, isPrefetch };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// Thunk for prefetching brands
export const prefetchBrands = createAsyncThunk(
  'brandCategory/prefetchBrands',
  async ({ subCategory, childCategory }, { dispatch }) => {
    // Only prefetch if we don't already have this data
    const cacheKey = `${subCategory}_${childCategory}_1`;
    if (!prefetchCache[cacheKey]) {
      dispatch(fetchBrandsByChildCategory({ 
        subCategory, 
        childCategory, 
        page: 1, 
        limit: 30, 
        isPrefetch: true 
      }));
    }
  }
);

// Initial State
const initialState = {
  brands: [],
  mainCategory: '',
  childCategories: [],
  currentCategory: '',
  loading: false,
  error: null,
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 30,
    hasNext: false,
    hasPrevious: false
  },
  // Track prefetched categories
  prefetched: []
};

const brandCategorySlice = createSlice({
  name: 'brandCategory',
  initialState,
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.mainCategory = '';
      state.childCategories = [];
      state.currentCategory = '';
      state.pagination = initialState.pagination;
      state.prefetched = [];
    },
    // Optional: Clear cache when needed
    clearPrefetchCache: () => {
      Object.keys(prefetchCache).forEach(key => delete prefetchCache[key]);
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle both regular fetch and prefetch
      .addCase(fetchBrandsByChildCategory.pending, (state, action) => {
        // Only set loading for non-prefetch requests
        if (!action.meta.arg.isPrefetch) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchBrandsByChildCategory.fulfilled, (state, action) => {
        const { data, page, isPrefetch } = action.payload;
        
        // Skip state update for prefetch requests
        if (isPrefetch) {
          // Just track that we've prefetched this category
          const { subCategory, childCategory } = action.meta.arg;
          if (!state.prefetched.includes(`${subCategory}_${childCategory}`)) {
            state.prefetched.push(`${subCategory}_${childCategory}`);
          }
          return;
        }

        state.loading = false;
        
        // Append brands if page > 1 (for Load More)
        if (page > 1) {
          state.brands = [...state.brands, ...data.brands];
        } else {
          state.brands = data.brands;
        }

        state.mainCategory = data.mainCategory;
        state.childCategories = data.childCategories;
        state.currentCategory = data.currentCategory;
        state.pagination = data.pagination;
      })
      .addCase(fetchBrandsByChildCategory.rejected, (state, action) => {
        // Only handle errors for non-prefetch requests
        if (!action.meta.arg?.isPrefetch) {
          state.loading = false;
          state.error = action.payload?.message || action.error.message;
        }
      });
  }
});

export const { clearBrands, clearPrefetchCache } = brandCategorySlice.actions;
export default brandCategorySlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';
import { userId } from '../../Utils/autherId';

export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getAllBrandListing`, {
        params: {
          page,
          id: userId,
        }
      });

      // Normalize the brand data to ensure consistent structure
      const normalizedBrands = response.data.data.brands.map(brand => ({
        ...brand,
        brandDetails: {
          brandName: '',
          companyName: '',
          ...brand.brandDetails
        },
        brandfranchisedetails: {
          franchiseDetails: {
            fico: [],
            trainingSupport: [],
            ...brand.brandfranchisedetails?.franchiseDetails
          },
          ...brand.brandfranchisedetails
        },
        uploads: {
          logo: '',
          ...brand.uploads
        },
        isLiked: brand.isLiked || false,
        isCompared: brand.isCompared || false
      }));

      return {
        brands: normalizedBrands,
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
  comparisonBrands: [], // Dedicated array for brands being compared
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
  viewedBrandsCount: 0
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
      state.brands = state.brands.map((brand) => ({
        ...brand,
        isLiked: brand.uuid === brandId ? !brand.isLiked : brand.isLiked
      }));
    },
    // Comparison-related reducers
    addToComparison: (state, action) => {
      const brandId = action.payload;
      const brandToAdd = state.brands.find(brand => brand.uuid === brandId);
      
      if (brandToAdd && !state.comparisonBrands.some(b => b.uuid === brandId)) {
        state.comparisonBrands.push(brandToAdd);
        // Mark as compared in main brands array
        state.brands = state.brands.map(brand => 
          brand.uuid === brandId ? { ...brand, isCompared: true } : brand
        );
      }
    },
    removeFromComparison: (state, action) => {
      const brandId = action.payload;
      state.comparisonBrands = state.comparisonBrands.filter(
        brand => brand.uuid !== brandId
      );
      // Remove compared mark from main brands array
      state.brands = state.brands.map(brand => 
        brand.uuid === brandId ? { ...brand, isCompared: false } : brand
      );
    },
    clearComparison: (state) => {
      // Clear all comparison flags
      const comparedIds = state.comparisonBrands.map(b => b.uuid);
      state.brands = state.brands.map(brand => 
        comparedIds.includes(brand.uuid) ? { ...brand, isCompared: false } : brand
      );
      state.comparisonBrands = [];
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

        if (!state.fetchedPages.includes(page)) {
          state.fetchedPages.push(page);
        }

        const existingUUIDs = new Set(state.brands.map(b => b.uuid));
        const uniqueNewBrands = brands.filter(b => !existingUUIDs.has(b.uuid));

        if (page === 1) {
          state.brands = uniqueNewBrands;
        } else {
          state.brands = [...state.brands, ...uniqueNewBrands];
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

// Action creators
export const { 
  resetBrands, 
  incrementViewedCount, 
  resetViewedCount, 
  toggleBrandLike,
  addToComparison,
  removeFromComparison,
  clearComparison
} = brandSlice.actions;

// Selectors
export const selectAllBrands = (state) => state.brands.brands;
export const selectComparisonBrands = (state) => state.brands.comparisonBrands;
export const selectBrandById = (id) => (state) => 
  state.brands.brands.find(brand => brand.uuid === id);
export const selectIsBrandCompared = (id) => (state) =>
  state.brands.comparisonBrands.some(brand => brand.uuid === id);

export default brandSlice.reducer;
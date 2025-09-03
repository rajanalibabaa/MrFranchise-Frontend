import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { userId } from '../../Utils/autherId';

const API_BASE_URL = 'http://localhost:5000/api/v1/';

const id = userId

export const fetchFilteredBrands = createAsyncThunk(
  'filterBrands/fetchFilteredBrands',
  async (filters, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        maincat,
        subcat,
        childcat,
        serchterm,
        country,
        state,
        district,
        city,
        investmentRange,
        modelType,
      } = filters;

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (id) params.append('id', id);
      if (maincat){
        params.append('maincat', maincat);
      }else {
        params.append('maincat', "Food & Beverages");
      }
      if (subcat) params.append('subcat', subcat);
      if (childcat) params.append('childcat', childcat);
      if (serchterm) params.append('serchterm', serchterm);
      if (country) params.append('country', country);
      if (state) params.append('state', state);
      if (district) params.append('district', district);
      if (city) params.append('city', city);
      if (investmentRange) params.append('investmentRange', investmentRange);
      if (modelType) params.append('modelType', modelType);

      console.log("=============",`${API_BASE_URL}filter/getAllBrandsAndFilter?${params}`)
      const response = await axios.get(`${API_BASE_URL}filter/getAllBrandsAndFilter?${params}`);

       console.log("=============",response.data.data?.brands)

      // Normalize the brand data to ensure consistent structure
      const normalizedBrands = response.data.data?.brands?.map(brand => ({
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
        isLiked: brand?.isLiked || false,
        isShortListed: brand?.isShortListed || false
      })) || [];

      return {
        brands: normalizedBrands,
        pagination: response?.data?.data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          limit: parseInt(limit),
          total: 0,
          hasNext: false,
          hasPrevious: false,
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  brands: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    total: 0,
    hasNext: false,
    hasPrevious: false,
  },
  filters: {
    id: null,
    maincat: null,
    subcat: null,
    childcat: null,
    serchterm: '',
    country: null,
    state: null,
    district: null,
    city: null,
    investmentRange: null,
    modelType: null,
    page: 1,
    limit: 20,
  },
  // Add a cache key to track when filters change
  cacheKey: Date.now()
};

const filterBrandSlice = createSlice({
  name: 'filterBrands',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
     
      // Reset dependent filters when parent changes
      if (filterName === 'maincat') {
        state.filters.subcat = null;
        state.filters.childcat = null;
      } else if (filterName === 'subcat') {
        state.filters.childcat = null;
      } else if (filterName === 'state') {
        state.filters.district = null;
        state.filters.city = null;
      } else if (filterName === 'district') {
        state.filters.city = null;
      }
     
      // Reset to first page when filters change
      state.filters.page = 1;
      state.pagination.currentPage = 1;
      
      // Update cache key when filters change
      state.cacheKey = Date.now();
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
      state.cacheKey = Date.now();
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add the toggle actions similar to brandSlice
    toggleBrandLikefilter: (state, action) => {
      const brandId = action.payload;
      state.brands = state.brands.map(brand => 
        brand?.uuid === brandId 
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },
    toggleBrandShortListfilter: (state, action) => {
      const brandId = action.payload;
      // console.log("Toggling shortlist for brand:", brandId);
      state.brands = state.brands.map(brand => 
        brand.uuid === brandId 
          ? { ...brand, isShortListed: !brand.isShortListed }
          : brand
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredBrands.fulfilled, (state, action) => {
        state.loading = false;
        
        // Stable sorting: brands with videos first, then by a consistent criteria
        const sortedBrands = [...action.payload.brands].sort((a, b) => {
          // First priority: brands with videos
          const aHasVideo = a.uploads?.video ? 1 : 0;
          const bHasVideo = b.uploads?.video ? 1 : 0;
          
          if (bHasVideo !== aHasVideo) {
            return bHasVideo - aHasVideo; // Brands with videos first
          }
          
          // Second priority: use brand UUID for consistent ordering
          // This ensures the same order on every refresh with the same filters
          return a.uuid.localeCompare(b.uuid);
        });
        
        state.brands = sortedBrands;
       
        // Update pagination info
        if (action.payload.pagination) {
          state.pagination = {
            ...action.payload.pagination,
            currentPage: action.payload.pagination.currentPage || state.pagination.currentPage,
          };
        }
      })
      .addCase(fetchFilteredBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch brands';
      });
  }
});

export const { 
  setFilter, 
  resetFilters, 
  setPage, 
  clearError,
  toggleBrandLikefilter,
  toggleBrandShortListfilter
} = filterBrandSlice.actions;

export default filterBrandSlice.reducer;
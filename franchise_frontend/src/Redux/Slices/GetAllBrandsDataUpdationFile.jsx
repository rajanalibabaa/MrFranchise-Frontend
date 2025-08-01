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

  console.log("Toggling like for brandId:", brandId);
  console.log("Current brands state:", state.brands);

  state.brands = state.brands.map((brand) => {
    if (brand.uuid === brandId) {
      console.log(`Toggling isLiked for brand: ${brand.uuid}`);
      return {
        ...brand,
        isLiked: !brand.isLiked,
      };
    }
    return brand; // Don't forget to return the unchanged brand
  });

  console.log("Updated brands list:", state.brands);
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
        // Always replace brands with new ones rather than appending
  state.brands = action.payload.brands;
  state.pagination = action.payload.pagination;
        
        // If it's the first page, replace brands, otherwise append
        if (action.payload.pagination.currentPage === 1) {
          state.brands = action.payload.brands;
          console.log("action.payload.brands :",action.payload.brands)
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
  },
});

export const { resetBrands, incrementViewedCount, resetViewedCount, toggleBrandLike } = brandSlice.actions;
export default brandSlice.reducer;

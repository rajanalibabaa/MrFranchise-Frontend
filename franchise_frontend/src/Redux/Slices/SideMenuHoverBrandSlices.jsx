import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../Api/api";

// Cache object to store prefetched data
const prefetchCache = {};

// Thunk for fetching brands by child category with caching
export const fetchBrandsByChildCategory = createAsyncThunk(
  "brandCategory/fetchBrandsByChildCategory",
  async (
    { subCategory, childCategory, page = 1, limit = 30, isPrefetch = false },
    { rejectWithValue, getState }
  ) => {
    try {
      // Check cache first for prefetched data
      const cacheKey = `${subCategory}_${childCategory}_${page}`;

      if (isPrefetch && prefetchCache[cacheKey]) {
        return { data: prefetchCache[cacheKey], page, isPrefetch };
      }

      const response = await axios.get(
        `${API_BASE_URL}/brandlisting/getBrandsByChildCategory`,
        {
          params: { subCategory, childCategory, page, limit },
        }
      );

      // Ensure response has the expected structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure");
      }

      // Store in cache if this is a prefetch
      if (isPrefetch) {
        prefetchCache[cacheKey] = {
          brands: response.data.data.brands || [],
          mainCategory: response.data.data.mainCategory || "",
          childCategories: response.data.data.childCategories || [],
          currentCategory: response.data.data.currentCategory || "",
          pagination: response.data.data.pagination || {
            total: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 30,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }

      return {
        data: {
          brands: response.data.data.brands || [],
          mainCategory: response.data.data.mainCategory || "",
          childCategories: response.data.data.childCategories || [],
          currentCategory: response.data.data.currentCategory || "",
          pagination: response.data.data.pagination || {
            total: 0,
            totalPages: 0,
            currentPage: 1,
            limit: 30,
            hasNext: false,
            hasPrevious: false,
          },
        },
        page,
        isPrefetch,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Brands Are Under Updateing"
      );
    }
  }
);

// Thunk for prefetching brands
export const prefetchBrands = createAsyncThunk(
  "brandCategory/prefetchBrands",
  async ({ subCategory, childCategory }, { dispatch }) => {
    // Only prefetch if we don't already have this data
    const cacheKey = `${subCategory}_${childCategory}_1`;
    if (!prefetchCache[cacheKey]) {
      await dispatch(
        fetchBrandsByChildCategory({
          subCategory,
          childCategory,
          page: 1,
          limit: 30,
          isPrefetch: true,
        })
      );
    }
  }
);

// Initial State
const initialState = {
  brands: [],
  mainCategory: "",
  childCategories: [],
  currentCategory: "",
  loading: false,
  error: null,
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 30,
    hasNext: false,
    hasPrevious: false,
  },
  prefetched: [],
};

const brandCategorySlice = createSlice({
  name: "brandCategory",
  initialState,
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.mainCategory = "";
      state.childCategories = [];
      state.currentCategory = "";
      state.pagination = initialState.pagination;
      state.prefetched = [];
    },
    clearPrefetchCache: () => {
      Object.keys(prefetchCache).forEach((key) => delete prefetchCache[key]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandsByChildCategory.pending, (state, action) => {
        if (!action.meta.arg.isPrefetch) {
          state.loading = true;
          state.error = null;
          // Reset brands when fetching a new category (page 1)
          if (action.meta.arg.page === 1) {
            state.brands = [];
          }
        }
      })
      .addCase(fetchBrandsByChildCategory.fulfilled, (state, action) => {
        const { data, page, isPrefetch } = action.payload;

        if (isPrefetch) {
          const { subCategory, childCategory } = action.meta.arg;
          if (!state.prefetched.includes(`${subCategory}_${childCategory}`)) {
            state.prefetched.push(`${subCategory}_${childCategory}`);
          }
          return;
        }

        state.loading = false;

        if (page > 1) {
          // For subsequent pages, append to existing brands
          state.brands = [...state.brands, ...(data.brands || [])];
        } else {
          // For first page, replace brands
          state.brands = data.brands || [];
        }

        state.mainCategory = data.mainCategory || "";
        state.childCategories = data.childCategories || [];
        state.currentCategory = data.currentCategory || "";
        state.pagination = data.pagination || initialState.pagination;
      })
      .addCase(fetchBrandsByChildCategory.rejected, (state, action) => {
        if (!action.meta.arg?.isPrefetch) {
          state.loading = false;
          state.error =
            action.payload || action.error.message || "Failed to fetch brands";
          // Reset brands on error for new fetches (page 1)
          if (action.meta.arg.page === 1) {
            state.brands = [];
          }
        }
      });
  },
});

export const { clearBrands, clearPrefetchCache } = brandCategorySlice.actions;
export default brandCategorySlice.reducer;

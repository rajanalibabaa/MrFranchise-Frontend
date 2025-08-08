import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { token, userId } from "../../Utils/autherId";
import { api } from "../../Api/api";
import { getApi } from "../../Api/DefaultApi";

// Utility for handling API errors
const handleApiError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  return (
    error.response?.data?.message ||
    error.message ||
    "An unknown error occurred"
  );
};

export const removeFromLikedBrands = createAsyncThunk(
  "likedBrands/remove",
  async (brandId, { rejectWithValue }) => {
    try {
      if (!userId || !brandId) throw new Error("Missing user ID or brand ID");

      const baseUrl = api.likeApi.get || "https://localhost:5000/api/v1/like";
      const url = `${baseUrl}/delete-favbrand/${userId}/${brandId}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return brandId;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

  console.log("userId",userId)
export const fetchLikedBrandsById = createAsyncThunk(
  "likedBrands/fetchById",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required");

      const query = { page, limit };
      const baseUrl =  "http://localhost:5000/api/v1/like";
      const url = `${baseUrl}/get-favbrands/${userId}`;

      const response = await getApi(url, query, token);

      console.log("...", response.data?.data)

      const responseData = response.data?.data;
      if (!responseData) throw new Error("No data received");

      return {
        brands: responseData.brands || [],
        pagination: responseData.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          limit,
          hasNext: false,
        },
      };
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

// ✅ Initial state
const initialState = {
  brands: [],
  pagination: {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNext: false,
  },
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ✅ Redux slice
const likedBrandsSlice = createSlice({
  name: "likedBrands",
  initialState,
  reducers: {
    clearLikedBrands: () => initialState,

    removeLikedBrand: (state, action) => {
      state.brands = state.brands.filter(
        (brand) => brand.uuid !== action.payload
      );
      state.pagination.totalItems = state.brands.length;
    },

    addLikedBrand: (state, action) => {
      const brand = { ...action.payload, isLiked: true };
      state.brands.unshift(brand);
      state.pagination.totalItems = state.brands.length;
    },

    toggleLikedBrand: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },
     toggleLikedSliceShortList: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isShortListed: !brand.isShortListed }
          : brand
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedBrandsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchLikedBrandsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetched = new Date().toISOString();

        state.brands = action.payload.brands;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          totalItems: action.payload.brands.length,
        };
      })

      .addCase(fetchLikedBrandsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(removeFromLikedBrands.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.uuid !== action.payload
        );
        state.pagination.totalItems = state.brands.length;
      })

      .addCase(removeFromLikedBrands.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ✅ Export Actions
export const {
  clearLikedBrands,
  removeLikedBrand,
  addLikedBrand,
  toggleLikedBrand,
  toggleLikedSliceShortList
} = likedBrandsSlice.actions;

// ✅ Export Reducer
export default likedBrandsSlice.reducer;
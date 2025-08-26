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
 
// ✅ REMOVE from shortlist thunk
export const removeFromShortlist = createAsyncThunk(
  "shortList/remove",
  async (brandId, { rejectWithValue }) => {
    try {
      if (!userId || !brandId) throw new Error("Missing user ID or brand ID");
 
      const baseUrl =
        api.shortListApi.base || "http://localhost:5000/api/v1/shortList";
      const url = `${baseUrl}/removeFromShortlist/${userId}/${brandId}`;
 
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      return brandId;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
 
// ✅ FETCH shortlist by ID thunk
export const fetchShortListedById = createAsyncThunk(
  "shortList/fetchById",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required");
 
      const query = { page, limit };
      const baseUrl =
        api.shortListApi.base || "http://localhost:5000/api/v1/shortList";
      const url = `${baseUrl}/getShortListedById/${userId}`;
 
      const response = await getApi(url, query, token); // ✅ Correct usage
 
      const responseData = response.data?.data;
      if (!responseData) throw new Error("No data received");
 
// console.log("Total Shortlisted Brands:", responseData?.pagination?.totalItems || 0);
      // console.log("All Shortlisted Data:", responseData);
      
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
const shortListSlice = createSlice({
  name: "shortList",
  initialState,
  reducers: {
    clearShortList: () => initialState,
 
    removeSortList: (state, action) => {
      state.brands = state.brands.filter(
        (brand) => brand.uuid !== action.payload
      );
      state.pagination.totalItems = state.brands.length;
    },
 
    addSortlist: (state, action) => {
      const brand = { ...action.payload, isShortListed: true };
      state.brands.unshift(brand);
      state.pagination.totalItems = state.brands.length;
    },
 
    toggleSortlistBrandLike: (state, action) => {
      state.brands = state.brands.map((brand) =>
        brand.uuid === action.payload
          ? { ...brand, isLiked: !brand.isLiked }
          : brand
      );
    },
  },
 
  extraReducers: (builder) => {
    builder
      .addCase(fetchShortListedById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
 
      .addCase(fetchShortListedById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetched = new Date().toISOString();
 
        state.brands = action.payload.brands;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          totalItems: action.payload.brands.length,
        };
      })
 
      .addCase(fetchShortListedById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
 
      .addCase(removeFromShortlist.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.uuid !== action.payload
        );
        state.pagination.totalItems = state.brands.length;
      })
 
      .addCase(removeFromShortlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
 
// ✅ Export Actions
export const {
  clearShortList,
  removeSortList,
  addSortlist,
  toggleSortlistBrandLike,
} = shortListSlice.actions;
 
// ✅ Export Reducer
export default shortListSlice.reducer;

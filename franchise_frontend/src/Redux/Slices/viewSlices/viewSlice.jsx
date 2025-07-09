import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for posting view brands
export const postViewBrands = createAsyncThunk(
  'view/postViewBrands',
  async ({ id, brandID, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/view/postViewBrands/${id}`,
        { brandID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for getting all viewed brands by ID
export const getAllViewBrandByID = createAsyncThunk(
  'view/getAllViewBrandByID',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/view/getAllViewBrandByID/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const viewSlice = createSlice({
  name: "view",
  initialState: {
    data: null,
    loading: false,
    error: null,
    viewedBrands: [],
    allViewedBrands: [], // For storing the result of getAllViewBrandByID
    lastViewed: null,
    count: 0
  },
  reducers: {
    // Synchronous reducers
    addViewedBrand: (state, action) => {
      state.viewedBrands.push(action.payload);
    },
    clearViewedBrands: (state) => {
      state.viewedBrands = [];
    },
    incrementViewCount: (state) => {
      state.count += 1;
    },
    setLastViewed: (state, action) => {
      state.lastViewed = action.payload;
    },
    resetViewState: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.viewedBrands = [];
      state.allViewedBrands = [];
      state.lastViewed = null;
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Post View Brands reducers
      .addCase(postViewBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postViewBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.count += 1;
        if (action.payload.brand) {
          state.viewedBrands.push(action.payload.brand);
          state.lastViewed = new Date().toISOString();
        }
      })
      .addCase(postViewBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get All View Brands By ID reducers
      .addCase(getAllViewBrandByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllViewBrandByID.fulfilled, (state, action) => {
        state.loading = false;
        state.allViewedBrands = action.payload.data || action.payload; // Handle different response formats
      })
      .addCase(getAllViewBrandByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export the actions
export const { 
  addViewedBrand, 
  clearViewedBrands, 
  incrementViewCount, 
  setLastViewed,
  resetViewState 
} = viewSlice.actions;

export default viewSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { token, userId } from '../../Utils/autherId';
import { api } from '../../Api/api';
import { getApi } from '../../Api/DefaultApi';

export const fetchShortListedById = createAsyncThunk(
  'shortList/fetchById',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const query = {
        page
      };
      const url = `${api.shortListApi.get}/${userId}`;
      const response = await getApi(url, query);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch short list');
    }
  }
);

export const removeFromShortlist = createAsyncThunk(
  'shortList/remove',
  async (brandId, { rejectWithValue }) => {
    try {
      const url = `${api.shortListApi.remove}/${userId}/${brandId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return brandId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from shortlist');
    }
  }
);

const shortListSlice = createSlice({
  name: 'shortList',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    clearShortList: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
    removeSortList : (state,action) => {
        const brandId = action.payload

        console.log("brandId sclice :",brandId)
        state.data.brands = state.data.brands.filter(brand => brand.uuid !== brandId)
    },
    addSortlist : (state,action) => {
        const brand = { ...action.payload, isShortListed: true };

         console.log("addSortlist :",brand)
         state.data.brands.unshift(brand)
    },
     toggleSortlistBrandLike: (state, action) => {
        const brandId = action.payload;
        state.data.brands = state.data.brands.map(brand => 
            brand.uuid === brandId 
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
        state.data = action.payload.data || action.payload;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchShortListedById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeFromShortlist.fulfilled, (state, action) => {
        if (state.data && state.data.brands) {
          state.data.brands = state.data.brands.filter(
            brand => brand.uuid !== action.payload
          );
        } else if (Array.isArray(state.data)) {
          state.data = state.data.filter(
            brand => brand.uuid !== action.payload
          );
        } 
      });
  },
});

export const { clearShortList,removeSortList, addSortlist,toggleSortlistBrandLike } = shortListSlice.actions;
export default shortListSlice.reducer;
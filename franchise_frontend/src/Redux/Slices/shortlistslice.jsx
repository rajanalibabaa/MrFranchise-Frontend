import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';
import { userId, token } from '../../Utils/autherId';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

// Async thunk for fetching shortlist
export const fetchShortlist = createAsyncThunk(
  'shortlist/fetchShortlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shortList/getShortListedById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;

      console.log("Shortlist fetched successfully:", response.data);
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch shortlist');
      }
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState,
  reducers: {
    clearShortlist: () => initialState,
    removeFromShortlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    resetShortlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShortlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchShortlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.status = 'succeeded';
      })
      .addCase(fetchShortlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch shortlist';
        state.status = 'failed';
        state.items = [];
      });
  },
});

export const { clearShortlist, removeFromShortlist, resetShortlistError } = shortlistSlice.actions;

export default shortlistSlice.reducer;
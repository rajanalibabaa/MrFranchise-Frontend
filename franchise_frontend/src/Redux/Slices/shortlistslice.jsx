import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isInitialized: false
};

const shortlistedBrandsSlice = createSlice({
  name: "shortlistedBrands",
  initialState,
  reducers: {
    initializeShortlist: (state, action) => {
      if (!state.isInitialized) {
        state.items = action.payload;
        state.isInitialized = true;
      }

      console.log(action.payload)
    },
    addToShortlist: (state, action) => {
      if (!state.items.some(item => item.uuid === action.payload.uuid)) {
        state.items.push(action.payload);
      }
    },
    removeFromShortlist: (state, action) => {
      state.items = state.items.filter(item => item.uuid !== action.payload);
    },
    updateShortlistItem: (state, action) => {
      const index = state.items.findIndex(item => item.uuid === action.payload.uuid);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    }
  }
});

export const { 
  initializeShortlist,
  addToShortlist,
  removeFromShortlist,
  updateShortlistItem
} = shortlistedBrandsSlice.actions;

export default shortlistedBrandsSlice.reducer;
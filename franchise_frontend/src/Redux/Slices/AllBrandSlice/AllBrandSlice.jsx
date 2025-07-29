import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
    name: "allbrands",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        
        fetchAllBrands(state, action) {
            state.data = action.payload;
            console.log("action.payload :",action.payload)
            
        },
    }
});

export const { 
    fetchAllBrands
} = brandSlice.actions;

export default brandSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  investorUUID: null,
  brandUUID: null,
  token: null,
  user_data: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUUIDandTOKEN: (state, action) => {
      state.investorUUID = action.payload.investorUUID || null;
      state.brandUUID = action.payload.brandUUID || null;
      state.token = action.payload.token || null;
      state.user_data = action.payload.user_data || null;
    },
    logout: (state) => {
      state.investorUUID = null;
      state.brandUUID = null;
      state.token = null;
      state.user_data = null;
    },
  },
});

export const { setUUIDandTOKEN, logout } = authSlice.actions;
export default authSlice.reducer;
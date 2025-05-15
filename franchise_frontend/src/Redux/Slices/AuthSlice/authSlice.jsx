import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  investorUUID: null,
  brandUUID: null,
  AccessToken: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUUIDandTOKEN: (state, action) => {
      const { investorUUID, brandUUID, token, user_data } = action.payload;
      state.investorUUID = investorUUID;
      state.brandUUID = brandUUID;
      state.AccessToken = token;
      state.userData = user_data || null;

      // Save token to localStorage for persistence
      if (token) {
        localStorage.setItem('accessToken', token);
      }
    },
    logout: (state) => {
      state.investorUUID = null;
      state.brandUUID = null;
      state.AccessToken = null;
      state.userData = null;

      localStorage.removeItem('accessToken');
    },
  },
});

export const { setUUIDandTOKEN, logout } = authSlice.actions;

export default authSlice.reducer;

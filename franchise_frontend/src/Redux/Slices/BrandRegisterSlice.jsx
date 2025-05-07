import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brandName: "",
    companyName: "",
    category: "",
    franchiseType: "",
    agreeToTerms: false,
  },
  errors: {},
};

const brandRegisterSlice = createSlice({
  name: "brandRegister",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
      state.errors[name] = ""; 
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    resetForm: () => initialState
  },
});

export const { setField, setErrors, resetForm } = brandRegisterSlice.actions;
export default brandRegisterSlice.reducer;
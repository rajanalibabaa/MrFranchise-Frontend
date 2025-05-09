import { createSlice } from "@reduxjs/toolkit";

// Helper function to load initial state from localStorage
const loadInitialState = () => {
  const savedFormData = localStorage.getItem("brandFormData");
  if (savedFormData) {
    try {
      const parsedData = JSON.parse(savedFormData);
      return {
        formData: {
          firstName: parsedData.firstName || "",
          // lastName: parsedData.lastName || "",
          phone: parsedData.phone || "",
          email: parsedData.email || "",
          brandName: parsedData.brandName || "",
          companyName: parsedData.companyName || "",
          category: parsedData.category || "",
          franchiseType: parsedData.franchiseType || "",
          agreeToTerms: parsedData.agreeToTerms || false,
        },
        errors: {}
      };
    } catch (error) {
      console.error("Failed to parse saved form data:", error);
    }
  }
  return {
    formData: {
      firstName: "",
      // lastName: "",
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
};

const brandRegisterSlice = createSlice({
  name: "brandRegister",
  initialState: loadInitialState(),
  reducers: {
    setField: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
      
      // Clear error for this field when it's modified
      if (state.errors[name]) {
        state.errors[name] = "";
      }
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    resetForm: (state) => {
      // Clear both form data and errors
      state.formData = {
        firstName: "",
        // lastName: "",
        phone: "",
        email: "",
        brandName: "",
        companyName: "",
        category: "",
        franchiseType: "",
        agreeToTerms: false,
      };
      state.errors = {};
      
      // Also remove from localStorage
      localStorage.removeItem("brandFormData");
    },
    initializeForm: (state, action) => {
      // Initialize form with provided data
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (state.formData.hasOwnProperty(key)) {
            state.formData[key] = value;
          }
        });
      }
    }
  },
});

export const { setField, setErrors, resetForm, initializeForm } = brandRegisterSlice.actions;
export default brandRegisterSlice.reducer;
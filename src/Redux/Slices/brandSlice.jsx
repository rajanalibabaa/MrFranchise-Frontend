import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getAllBrandListing",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch brands");
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    data: [],
    filteredData: [],
    loading: false,
    error: null,
    categories: [],
    modelTypes: [],
    states: [],
    cities: [],
    filters: {
      searchTerm: "",
      selectedCategory: "",
      selectedModelType: "",
      selectedState: "",
      selectedCity: "",
      selectedInvestmentRange: "",
    },
     openDialog: false,
  selectedBrand: null
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredData = applyFiltersToBrands(state.data, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: "",
        selectedCategory: "",
        selectedModelType: "",
        selectedState: "",
        selectedCity: "",
        selectedInvestmentRange: "",
      };
      state.filteredData = state.data;
    },
      openBrandDialog: (state, action) => {
    state.openDialog = true;
    state.selectedBrand = action.payload;
  },
  closeBrandDialog: (state) => {
    state.openDialog = false;
    state.selectedBrand = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.filteredData = action.payload;
        
        // Extract unique values for filters
        state.categories = [
          ...new Set(
            action.payload.flatMap(
              (brand) =>
                brand.personalDetails?.brandCategories?.map(
                  (category) => category.main
                ) || []
            )
          ),
        ];

        state.modelTypes = [
          ...new Set(
            action.payload.flatMap(
              (brand) =>
                brand.franchiseDetails?.modelsOfFranchise?.map(
                  (model) => model.franchiseType
                ) || []
            )
          ),
        ];

        state.states = [
          ...new Set(
            action.payload
              .map((brand) => brand.personalDetails?.state)
              .filter(Boolean)
          ),
        ];

        state.cities = [
          ...new Set(
            action.payload.map((brand) => brand.personalDetails?.city).filter(Boolean)
          ),
        ];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function to apply filters
const applyFiltersToBrands = (brands, filters) => {
  let result = [...brands];

  // Apply search filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter((brand) => {
      const brandName = brand.personalDetails?.brandName || "";
      const description = brand.personalDetails?.description || "";
      const companyName = brand.personalDetails?.companyName || "";
      return (
        brandName.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term) ||
        companyName.toLowerCase().includes(term)
      );
    });
  }

  // Apply category filter
  if (filters.selectedCategory) {
    result = result.filter((brand) =>
      brand.personalDetails?.brandCategories?.some(
        (cat) => cat.main === filters.selectedCategory
      )
    );
  }

  // Apply model type filter
  if (filters.selectedModelType) {
    result = result.filter((brand) =>
      brand.franchiseDetails?.modelsOfFranchise?.some(
        (model) => model.franchiseType === filters.selectedModelType
      )
    );
  }

  // Apply state filter
  if (filters.selectedState) {
    result = result.filter(
      (brand) =>
        brand.personalDetails?.state === filters.selectedState ||
        brand.personalDetails?.expansionLocation?.some(
          (loc) => loc.state === filters.selectedState
        )
    );
  }

  // Apply city filter
  if (filters.selectedCity) {
    result = result.filter(
      (brand) =>
        brand.personalDetails?.city === filters.selectedCity ||
        brand.personalDetails?.expansionLocation?.some(
          (loc) => loc.city === filters.selectedCity
        )
    );
  }

  // Apply investment range filter
  if (filters.selectedInvestmentRange) {
    const [min, max] = filters.selectedInvestmentRange.split("-").map(Number);
    result = result.filter((brand) => {
      const franchiseFee =
        parseFloat(brand.franchiseDetails?.franchiseFee) || 0;
      return franchiseFee >= min && franchiseFee <= max;
    });
  }

  return result;
};

export const { setFilters, clearFilters ,openBrandDialog,closeBrandDialog} = brandSlice.actions;
export default brandSlice.reducer;
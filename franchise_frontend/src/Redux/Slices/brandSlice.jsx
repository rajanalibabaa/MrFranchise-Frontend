import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("accessToken");

export const toggleLikeBrand = createAsyncThunk(
  "brands/toggleLike",
  async ({ brandId, isLiked }, { rejectWithValue }) => {
    console.log(brandId, isLiked);

    try {
      if (!token) {
        return rejectWithValue("You need to log in to continue.");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (!isLiked && token) {
        await axios.post(
          "https://franchise-backend-wgp6.onrender.com/api/v1/like/post-favbrands",
          { branduuid: brandId },
          config
        );
      }
      if (isLiked && token) {
        await axios.delete(
          `https://franchise-backend-wgp6.onrender.com/api/v1/like/delete-favbrand/${brandId}`,
          config
        );
      }

      return {
        brandId,
        isLiked: !isLiked,
        responseData: response.data, // Include the response data if needed
      };
    } catch (err) {
      console.error("API Error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle like"
      );
    }
  }
);

export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      let response;

      if (!token) {
        response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getAllBrandListing",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        const userId = localStorage.getItem("brandUUID");

        response = await axios.get(
          `https://franchise-backend-wgp6.onrender.com/api/v1/like/favbrands/getAllLikedAndUnlikedBrand/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch brands");
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState: {
    data: [],
    filteredData: [],
    loading: false,
    error: null,
    categories: [],
    investmentRanges: [],
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
    selectedBrand: null,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLikeBrand.fulfilled, (state, action) => {
        const { brandId, isLiked } = action.payload;
        // Update both data and filteredData
        state.data = state.data.map((brand) =>
          brand.uuid === brandId ? { ...brand, isLiked } : brand
        );

        // // Update likedBrands array
        // if (isLiked) {
        //   state.likedBrands.push(brandId);
        // } else {
        //   state.likedBrands = state.likedBrands.filter((id) => id !== brandId);
        // }
      })

      // .addCase(fetchLikedBrands.fulfilled, (state, action) => {
      //   state.likedBrands = action.payload;
      //   console.log("v1", action.payload)

      //   // Update isLiked status in all brands
      //   state.data = state.data.map((brand) => ({
      //     ...brand,

      //     isLiked: action.payload.includes(brand.uuid),
      //   }));

      //   state.filteredData = state.filteredData.map((brand) => ({
      //     ...brand,
      //     isLiked: action.payload.includes(brand.uuid),
      //   }));
      // })
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log("fetched", action.payload);
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
            action.payload
              .map((brand) => brand.personalDetails?.city)
              .filter(Boolean)
          ),
        ];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Helper function to apply filters
const applyFiltersToBrands = (brands, filters) => {
  let result = [...brands];

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

  if (filters.selectedCategory) {
    result = result.filter((brand) =>
      brand.personalDetails?.brandCategories?.some(
        (cat) => cat.main === filters.selectedCategory
      )
    );
  }

  if (filters.selectedModelType) {
    result = result.filter((brand) =>
      brand.franchiseDetails?.modelsOfFranchise?.some(
        (model) => model.franchiseType === filters.selectedModelType
      )
    );
  }

  if (filters.selectedState) {
    result = result.filter(
      (brand) =>
        brand.personalDetails?.state === filters.selectedState ||
        brand.personalDetails?.expansionLocation?.some(
          (loc) => loc.state === filters.selectedState
        )
    );
  }

  if (filters.selectedCity) {
    result = result.filter(
      (brand) =>
        brand.personalDetails?.city === filters.selectedCity ||
        brand.personalDetails?.expansionLocation?.some(
          (loc) => loc.city === filters.selectedCity
        )
    );
  }

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

export const { setFilters, clearFilters, openBrandDialog, closeBrandDialog } =
  brandSlice.actions;
export default brandSlice.reducer;

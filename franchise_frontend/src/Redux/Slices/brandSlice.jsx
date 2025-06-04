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

           
        const userId = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID")


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
    subCategories: [],
    childCategories: [],
    investmentRanges: [],
    modelTypes: [],
    states: [],
    cities: [],
    filters: {
      searchTerm: "",
      selectedCategory: "",
      selectedSubCategory: "",
      selectedChildCategory: [],
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
        selectedSubCategory: "",
        selectedChildCategory: [],
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
        state.filteredData = state.filteredData.map((brand) =>
          brand.uuid === brandId ? { ...brand, isLiked } : brand
        );
      })

      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
            state.filteredData = applyFiltersToBrands(action.payload, state.filters);

        // Extract unique values for filters
   // Extract unique categories with their hierarchy
        const categoryMap = {};
        const subCategoryMap = {};
        const childCategoryMap = {};

       action.payload.forEach((brand) => {
          brand.personalDetails?.brandCategories?.forEach((category) => {
            // Main categories
            if (category.main && !categoryMap[category.main]) {
              categoryMap[category.main] = {
                id: category.main,
                name: category.main
              };
            }

            // Sub categories
            if (category.sub && !subCategoryMap[category.sub]) {
              subCategoryMap[category.sub] = {
                id: category.sub,
                name: category.sub,
                parentCategory: category.main
              };
            }

            // Child categories
            if (category.child && !childCategoryMap[category.child]) {
              childCategoryMap[category.child] = {
                id: category.child,
                name: category.child,
                parentSubCategory: category.sub
              };
            }
          });
        });

        state.categories = Object.values(categoryMap);
        state.subCategories = Object.values(subCategoryMap);
        state.childCategories = Object.values(childCategoryMap);


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
  // Sub category filter
  if (filters.selectedSubCategory) {
    result = result.filter((brand) =>
      brand.personalDetails?.brandCategories?.some(
        (cat) => cat.sub === filters.selectedSubCategory
      )
    );
  }
     // Child categories filter
  if (filters.selectedChildCategories?.length > 0) {
    result = result.filter((brand) =>
      brand.personalDetails?.brandCategories?.some((cat) =>
        filters.selectedChildCategories.includes(cat.child)
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

 // Investment range filter
  if (filters.selectedInvestmentRange) {
    result = result.filter((brand) => {
      const investmentRange = brand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange || "";
      return investmentRange === filters.selectedInvestmentRange;
    });
  }

  return result;
};

export const { setFilters, clearFilters, openBrandDialog, closeBrandDialog } =
  brandSlice.actions;
export default brandSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("accessToken");
const id = localStorage?.getItem("investorUUID") || localStorage?.getItem("brandUUID");

export const toggleLikeBrand = createAsyncThunk(
  "brands/toggleLike",
  async ({ brandId, isLiked }, { rejectWithValue }) => {
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

      const brandID = brandId;
      if (!isLiked) {
        await axios.post(
          "http://localhost:5000/api/v1/like/post-favbrands",
          { branduuid: brandId },
          config
        );
      } else if (isLiked) {
        await axios.delete(
          `http://localhost:5000/api/v1/like/delete-favbrand/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            data: { brandID },
          }
        );
      }

      return { brandId, isLiked: !isLiked };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle like"
      );
    }
  }
);

export const Likeshow = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/like/favbrands/getAllLikedAndUnlikedBrand/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching liked brands:", error);
    throw error;
  }
};

export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      let response;

      if (!token) {
        response = await axios.get(
          "http://localhost:5000/api/v1/brandlisting/getAllBrandListing",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await Likeshow();
      }

      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch brands");
    }
  }
);

export const fetchBrandById = createAsyncThunk(
  "brands/fetchBrandById",
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/brandlisting/getBrandListingById/${brandId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch brand");
    }
  }
);

export const viewApi = createAsyncThunk(
  "brands/viewApi",
  async (brandID, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/view/postViewBrands/${id}`,
        { brandID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to track view");
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
    likeLoading: {},
    categories: [],
    subCategories: [],
    childCategories: [],
    investmentRanges: [],
    modelTypes: [],
    states: [],
    districts: [],
    cities: [],
    filters: {
      searchTerm: "",
      selectedCategory: "",
      selectedSubCategory: "",
      selectedChildCategory: [],
      selectedModelType: "",
      selectedState: "",
      selectedDistrict: "",
      selectedCity: "",
      selectedInvestmentRange: "",
    },
    openDialog: false,
    selectedBrand: null,
    brandID: "",
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
        selectedDistrict: "",
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
    setLikeLoading: (state, action) => {
      const { brandId, isLoading } = action.payload;
      state.likeLoading = {
        ...state.likeLoading,
        [brandId]: isLoading,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
        state.filteredData = applyFiltersToBrands(action.payload, state.filters);

        // Extract filter options
        const categoryMap = {};
        const subCategoryMap = {};
        const childCategoryMap = {};
        const stateSet = new Set();
        const districtSet = new Set();
        const citySet = new Set();
        const modelTypeSet = new Set();
        const investmentRangeSet = new Set();

        const districtsWithState = [];
        const citiesWithDistrict = [];

        action.payload.forEach((brand) => {
          // Categories
          const brandCategories = brand.franchiseDetails?.brandCategories;
          if (brandCategories) {
            if (brandCategories.main && !categoryMap[brandCategories.main]) {
              categoryMap[brandCategories.main] = {
                id: brandCategories.main,
                name: brandCategories.main,
              };
            }
            if (brandCategories.sub && !subCategoryMap[brandCategories.sub]) {
              subCategoryMap[brandCategories.sub] = {
                id: brandCategories.sub,
                name: brandCategories.sub,
                parentCategory: brandCategories.main,
              };
            }
            if (brandCategories.child && !childCategoryMap[brandCategories.child]) {
              childCategoryMap[brandCategories.child] = {
                id: brandCategories.child,
                name: brandCategories.child,
                parentSubCategory: brandCategories.sub,
              };
            }
          }

          // Locations
          const domesticLocations = brand.expansionLocationData?.expansionLocations.domestic?.locations || [];
          domesticLocations.forEach(location => {
            if (location.state) {
              stateSet.add(location.state);
              
              if (location.districts) {
                location.districts.forEach(districtObj => {
                  if (districtObj.district) {
                    districtSet.add(districtObj.district);
                    districtsWithState.push({
                      district: districtObj.district,
                      state: location.state
                    });
                    
                    if (districtObj.cities) {
                      districtObj.cities.forEach(city => {
                        if (city) {
                          citySet.add(city);
                          citiesWithDistrict.push({
                            city: city,
                            district: districtObj.district
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });

          // Model types and investment ranges
          const fico = brand.franchiseDetails?.fico || [];
          fico.forEach(item => {
            if (item.franchiseType) modelTypeSet.add(item.franchiseType);
            if (item.investmentRange) investmentRangeSet.add(item.investmentRange);
          });
        });

        state.categories = Object.values(categoryMap);
        state.subCategories = Object.values(subCategoryMap);
        state.childCategories = Object.values(childCategoryMap);
        
        state.states = Array.from(stateSet).sort();
        state.districts = districtsWithState;
        state.cities = citiesWithDistrict;
        
        state.modelTypes = Array.from(modelTypeSet).sort();
        state.investmentRanges = Array.from(investmentRangeSet).sort((a, b) => {
          const order = [
            "Below - Rs.50 ",
            "Rs.2L-5L",
            "Rs.5L-10L",
            "Rs.10L-20L",
            "Rs.20L-30L",
            "Rs.30L-50L",
            "Rs.50L-1Cr",
            "Rs.1Cr-2Cr",
            "Rs.2Cr-5Cr",
            "Rs.5Cr-above"
          ];
          return order.indexOf(a) - order.indexOf(b);
        });
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLikeBrand.pending, (state, action) => {
        const { brandId } = action.meta.arg;
        state.likeLoading = {
          ...state.likeLoading,
          [brandId]: true,
        };
      })
      .addCase(toggleLikeBrand.fulfilled, (state, action) => {
        const { brandId, isLiked } = action.payload;
        state.data = state.data.map((brand) =>
          brand.uuid === brandId ? { ...brand, isLiked } : brand
        );
        state.filteredData = state.filteredData.map((brand) =>
          brand.uuid === brandId ? { ...brand, isLiked } : brand
        );
        state.likeLoading = {
          ...state.likeLoading,
          [brandId]: false,
        };
      })
      .addCase(toggleLikeBrand.rejected, (state, action) => {
        const { brandId } = action.meta.arg;
        state.likeLoading = {
          ...state.likeLoading,
          [brandId]: false,
        };
        state.error = action.payload;
      })
      .addCase(viewApi.fulfilled, (state, action) => {
        const { brandID } = action.payload || {};
        state.brandID = brandID;
      });
  },
});

// Filter function remains the same as in your original code
const applyFiltersToBrands = (brands, filters) => {
  if (!brands) return [];
  
  return brands.filter(brand => {
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const brandName = brand.brandDetails?.brandName?.toLowerCase() || "";
      const description = brand.brandDetails?.description?.toLowerCase() || "";
      const companyName = brand.brandDetails?.companyName?.toLowerCase() || "";
      
      if (!brandName.includes(term) && 
          !description.includes(term) && 
          !companyName.includes(term)) {
        return false;
      }
    }
    
    // Category filters
    if (filters.selectedCategory && 
        brand.franchiseDetails?.brandCategories?.main !== filters.selectedCategory) {
      return false;
    }
    
    if (filters.selectedSubCategory && 
        brand.franchiseDetails?.brandCategories?.sub !== filters.selectedSubCategory) {
      return false;
    }
    
    if (filters.selectedChildCategory?.length > 0 && 
        !filters.selectedChildCategory.includes(brand.franchiseDetails?.brandCategories?.child)) {
      return false;
    }
    
    // Model type filter
    if (filters.selectedModelType) {
      const fico = brand.franchiseDetails?.fico || [];
      if (!fico.some(item => item.franchiseType === filters.selectedModelType)) {
        return false;
      }
    }
    
    // Location filters
    if (filters.selectedState || filters.selectedDistrict || filters.selectedCity) {
      const domesticLocations = brand.expansionLocationData?.expansionLocations.domestic?.locations || [];
      let hasMatchingLocation = false;
      
      for (const location of domesticLocations) {
        if (filters.selectedState && location.state !== filters.selectedState) {
          continue;
        }
        
        if (!filters.selectedDistrict && !filters.selectedCity) {
          hasMatchingLocation = true;
          break;
        }
        
        const districts = location.districts || [];
        for (const districtObj of districts) {
          if (filters.selectedDistrict && districtObj.district !== filters.selectedDistrict) {
            continue;
          }
          
          if (!filters.selectedCity) {
            hasMatchingLocation = true;
            break;
          }
          
          const cities = districtObj.cities || [];
          if (cities.includes(filters.selectedCity)) {
            hasMatchingLocation = true;
            break;
          }
        }
        
        if (hasMatchingLocation) break;
      }
      
      if (!hasMatchingLocation) return false;
    }
    
    // Investment range filter
    if (filters.selectedInvestmentRange) {
      const fico = brand.franchiseDetails?.fico || [];
      if (!fico.some(item => item.investmentRange === filters.selectedInvestmentRange)) {
        return false;
      }
    }
    
    return true;
  });
};

export const {
  setFilters,
  clearFilters,
  openBrandDialog,
  closeBrandDialog,
  setLikeLoading,
} = brandSlice.actions;

export default brandSlice.reducer;
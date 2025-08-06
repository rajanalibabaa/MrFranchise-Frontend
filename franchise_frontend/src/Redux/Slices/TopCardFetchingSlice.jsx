// src/features/topFoodFranchiseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';
import { userId } from '../../Utils/autherId';

export const fetchTopFoodFranchises = createAsyncThunk(
  'topFoodFranchises/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopFoodFranchise`, {
        params: { page,id:userId }
      });

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1, 
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTopCafes = createAsyncThunk(
  'topCafes/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopCafes`, {
        params: { page,id:userId }
      });

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTopBeverageFranchises = createAsyncThunk(
  'topBeverageFranchises/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopBeverageFranchise`, {
        params: { page,id:userId }
      });

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);
export const fetchTopTruckAndKiosksFranchises = createAsyncThunk(
  'topTruckAndKiosksFranchises/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopTrucksAndKiosks`, {
        params: { page,id:userId }
      });

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }

      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchDesertAndBakery = createAsyncThunk(
  'topdesertAndBakeryFranchises/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopDesertAndBakery`, {
        params: { page,id:userId }
      });

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);
export const fetchTopRestarunt = createAsyncThunk(
  'toprestaurant/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandlisting/getTopRestaurants`, {
        params: { page,id:userId }
      });

      if (!response.data.data || !response.data.data.brands) {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }
      return {
        brands: response.data.data.brands,
        pagination: response.data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  foodFranchises: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0
  },
  cafes: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0
  },
  topbeveragefranchises: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0
  },
  desertAndBakery: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0
  },
  trucksAndKiosks: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0
  },
  restaurant: {
    brands: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: false,
    error: null,
    viewedBrandsCount: 0
  },
};

const topFoodFranchiseSlice = createSlice({
  name: 'topBrands',
  initialState,
  reducers: {
    resetTopFoodFranchises: (state) => {
      state.foodFranchises = initialState.foodFranchises;
    },
    resetTopCafes: (state) => {
      state.cafes = initialState.cafes;
    },
    resetTopBeverageFranchises: (state) => {
      state.topbeveragefranchises = initialState.topbeveragefranchises;
    },
     resetDesertAndBakery: (state) => {
      state.desertAndBakery = initialState.desertAndBakery;
     },

     resetTrucksAndKiosks: (state) => {
      state.trucksAndKiosks = initialState.trucksAndKiosks;
     },

     resetRestaurant: (state) => {
      state.restaurant = initialState.restaurant;
     },


    incrementFoodFranchiseViewedCount: (state) => {
      state.foodFranchises.viewedBrandsCount += 1;
    },
    incrementCafesViewedCount: (state) => {
      state.cafes.viewedBrandsCount += 1;
    },
    incrementBeverageViewedCount: (state) => {
      state.topbeveragefranchises.viewedBrandsCount += 1;
    },
    incrementDesertAndBakeryViewedCount: (state) => {
      state.desertAndBakery.viewedBrandsCount += 1;
    },
    incrementTrucksAndKiosksViewedCount: (state) => {
      state.trucksAndKiosks.viewedBrandsCount += 1;
    },
    resetFoodFranchiseViewedCount: (state) => {
      state.foodFranchises.viewedBrandsCount = 0;
    },
    resetCafesViewedCount: (state) => {
      state.cafes.viewedBrandsCount = 0;
    },
    resetBeverageViewedCount: (state) => {
      state.topbeveragefranchises.viewedBrandsCount = 0;
    },
    resetDesertAndBakeryViewedCount: (state) => {
      state.desertAndBakery.viewedBrandsCount = 0;
    },
    resetTrucksAndKiosksViewedCount: (state) => {
      state.trucksAndKiosks.viewedBrandsCount = 0;
    },
     resetRestaurantViewedCount: (state) => {
      state.restaurant.viewedBrandsCount = 0;
     },

    
    toggleHomeCardLike : (state,action) => {
      const brandId = action.payload
      state.cafes.brands = state.cafes.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isLiked: !brand.isLiked,
      };
        }
        return brand;
      })
      state.desertAndBakery.brands = state.desertAndBakery.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isLiked: !brand.isLiked,
      };
        }
        return brand;
      })
      state.foodFranchises.brands = state.foodFranchises.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isLiked: !brand.isLiked,
      };
        }
        return brand;
      })
      state.topbeveragefranchises.brands = state.topbeveragefranchises.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isLiked: !brand.isLiked,
      };
        }
        return brand;
      })
      state.trucksAndKiosks.brands = state.trucksAndKiosks.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isLiked: !brand.isLiked,
      };
        }
        return brand;
      })
      state.restaurant.brands = state.restaurant.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isLiked: !brand.isLiked,
      };
        }
        return brand;
      });
    },


    toggleHomeCardShortlist : (state,action) => {
      const brandId = action.payload
      state.cafes.brands = state.cafes.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isShortListed: !brand.isShortListed,
      };
        }
        return brand;
      })
      state.desertAndBakery.brands = state.desertAndBakery.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isShortListed: !brand.isShortListed,
      };
        }
        return brand;
      })
      state.foodFranchises.brands = state.foodFranchises.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isShortListed: !brand.isShortListed,
      };
        }
        return brand;
      })
      state.topbeveragefranchises.brands = state.topbeveragefranchises.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isShortListed: !brand.isShortListed,
      };
        }
        return brand;
      })
      state.trucksAndKiosks.brands = state.trucksAndKiosks.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isShortListed: !brand.isShortListed,
      };
        }
        return brand;
      })
      state.restaurant.brands = state.restaurant.brands.map((brand) => {
        if (brand.uuid === brandId) {
          return {
        ...brand,
        isShortListed: !brand.isShortListed,
      };
        }
        return brand;
      })

    },

  },
  extraReducers: (builder) => {
    builder
      // Food Franchises
      .addCase(fetchTopFoodFranchises.pending, (state) => {
        state.foodFranchises.isLoading = true;
        state.foodFranchises.error = null;
      })
      .addCase(fetchTopFoodFranchises.fulfilled, (state, action) => {
        state.foodFranchises.isLoading = false;
        state.foodFranchises.brands = action.payload.brands;
        state.foodFranchises.pagination = action.payload.pagination;
      })
      .addCase(fetchTopFoodFranchises.rejected, (state, action) => {
        state.foodFranchises.isLoading = false;
        state.foodFranchises.error = action.payload?.message || action.error.message;
      })

      // Cafes
      .addCase(fetchTopCafes.pending, (state) => {
        state.cafes.isLoading = true;
        state.cafes.error = null;
      })
      .addCase(fetchTopCafes.fulfilled, (state, action) => {
        state.cafes.isLoading = false;
        state.cafes.brands = action.payload.brands;
        state.cafes.pagination = action.payload.pagination;
      })
      .addCase(fetchTopCafes.rejected, (state, action) => {
        state.cafes.isLoading = false;
        state.cafes.error = action.payload?.message || action.error.message;
      })

      // Beverages
      .addCase(fetchTopBeverageFranchises.pending, (state) => {
        state.topbeveragefranchises.isLoading = true;
        state.topbeveragefranchises.error = null;
      })
      .addCase(fetchTopBeverageFranchises.fulfilled, (state, action) => {
        state.topbeveragefranchises.isLoading = false;
        state.topbeveragefranchises.brands = action.payload.brands;
        state.topbeveragefranchises.pagination = action.payload.pagination;
      })
      .addCase(fetchTopBeverageFranchises.rejected, (state, action) => {
        state.topbeveragefranchises.isLoading = false;
        state.topbeveragefranchises.error = action.payload?.message || action.error.message;
      })

      // desert&Bakerys
      .addCase(fetchDesertAndBakery.pending, (state) => {
        state.desertAndBakery.isLoading = true;
        state.desertAndBakery.error = null;
      })
      .addCase(fetchDesertAndBakery.fulfilled, (state, action) => {
        state.desertAndBakery.isLoading = false;
        state.desertAndBakery.brands = action.payload.brands;
        state.desertAndBakery.pagination = action.payload.pagination;
      })
      .addCase(fetchDesertAndBakery.rejected, (state, action) => {
        state.desertAndBakery.isLoading = false;
        state.desertAndBakery.error = action.payload?.message || action.error.message;
      })

      //trucks and Kiosks

      .addCase(fetchTopTruckAndKiosksFranchises.pending, (state) => {
        state.trucksAndKiosks.isLoading = true;
        state.trucksAndKiosks.error = null;
      })
      .addCase(fetchTopTruckAndKiosksFranchises.fulfilled, (state, action) => {
        state.trucksAndKiosks.isLoading = false;
        state.trucksAndKiosks.brands = action.payload.brands;
        state.trucksAndKiosks.pagination = action.payload.pagination;
      })
      .addCase(fetchTopTruckAndKiosksFranchises.rejected, (state, action) => {
        state.trucksAndKiosks.isLoading = false;
        state.trucksAndKiosks.error = action.payload?.message || action.error.message;
      })

      //restarunt

      .addCase(fetchTopRestarunt.pending, (state) => {
        state.restaurant.isLoading = true;
        state.restaurant.error = null;
      })
      .addCase(fetchTopRestarunt.fulfilled, (state, action) => {
        state.restaurant.isLoading = false;
        state.restaurant.brands = action.payload.brands;
        state.restaurant.pagination = action.payload.pagination;
      })
      .addCase(fetchTopRestarunt.rejected, (state, action) => {
        state.restaurant.isLoading = false;
        state.restaurant.error = action.payload?.message || action.error.message;
      });
  }
});

export const {
  resetTopFoodFranchises,
  resetTopCafes,
  resetTopBeverageFranchises,
   resetDesertAndBakery,
  resetTrucksAndKiosks,
   resetRestarunt,

  incrementFoodFranchiseViewedCount,
  incrementCafesViewedCount,
  incrementBeverageViewedCount,
  incrementDesertAndBakeryViewedCount,
  incrementTrucksAndKiosksViewedCount,
  incrementRestaruntViewedCount,

  resetFoodFranchiseViewedCount,
  resetCafesViewedCount,
  resetBeverageViewedCount,
  resetDesertAndBakeryViewedCount,
  resetTrucksAndKiosksViewedCount,
  resetRestaruntViewedCount,

  toggleHomeCardLike,
  toggleHomeCardShortlist
} = topFoodFranchiseSlice.actions;

export default topFoodFranchiseSlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { API_BASE_URL } from '../../Api/api';
// import { userId } from '../../Utils/autherId';

// export const fetchBrands = createAsyncThunk(
//   'brands/fetchAll',
//   async ({ page = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/brandlisting/getAllBrandListing`, {
//         params: {
//           page,
//           id: userId,
//         }
//       });

//       // Normalize the brand data to ensure consistent structure
//       // const normalizedBrands = response.data.data.brands.map(brand => ({
//       //   ...brand,
//       //   brandDetails: {
//       //     brandName: '',
//       //     companyName: '',
//       //     ...brand.brandDetails
//       //   },
//       //   brandfranchisedetails: {
//       //     franchiseDetails: {
//       //       fico: [],
//       //       trainingSupport: [],
//       //       ...brand.brandfranchisedetails?.franchiseDetails
//       //     },
//       //     ...brand.brandfranchisedetails
//       //   },
//       //   uploads: {
//       //     logo: '',
//       //     ...brand.uploads
//       //   },
//       //   isLiked: brand.isLiked || false,
//       //   isCompared: brand.isCompared || false
//       // }));

//        const normalizedBrands = response.data.data.brands
// console.log("Normalized Brands:", normalizedBrands);
//       return {
//         brands: normalizedBrands,
//         pagination: response.data.data.pagination,
//         page,
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: 'Unknown error' });
//     }
//   }
// );

// const initialState = {
//   brands: [],
//   comparisonBrands: [], // Dedicated array for brands being compared
//   fetchedPages: [],
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     hasNextPage: false,
//     hasPreviousPage: false,
//   },
//   isLoading: false,
//   error: null,
//   viewedBrandsCount: 0
// };

// const brandSlice = createSlice({
//   name: 'brands',
//   initialState,
//   reducers: {
//     resetBrands: (state) => {
//       return {
//         ...initialState,
//         fetchedPages: [],
//       };
//     },
//     incrementViewedCount: (state) => {
//       state.viewedBrandsCount += 1;
//     },
//     resetViewedCount: (state) => {
//       state.viewedBrandsCount = 0;
//     },
//  toggleBrandLike: (state, action) => {
//   const brandId = action.payload;
//   state.brands = state.brands.map(brand => 
//     brand.uuid === brandId 
//       ? { ...brand, isLiked: !brand.isLiked }
//       : brand
//   );
// },
//    toggleBrandShortList: (state, action) => {
//   const brandId = action.payload;
//   state.brands = state.brands.map(brand => 
//     brand.uuid === brandId 
//       ? { ...brand, isShortListed: !brand.isShortListed }
//       : brand
//   );
// }


 
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBrands.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchBrands.fulfilled, (state, action) => {
//         const { brands, pagination, page } = action.payload;
//         state.isLoading = false;
//         state.pagination = pagination;

//         if (!state.fetchedPages.includes(page)) {
//           state.fetchedPages.push(page);
//         }

//         const existingUUIDs = new Set(state.brands.map(b => b.uuid));
//         const uniqueNewBrands = brands.filter(b => !existingUUIDs.has(b.uuid));

//         if (page === 1) {
//           state.brands = uniqueNewBrands;
//         } else {
//           state.brands = [...state.brands, ...uniqueNewBrands];
//         }
//       })
//       .addCase(fetchBrands.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || action.error.message;
//       });
//   },
// });
 
// export const { resetBrands, incrementViewedCount, resetViewedCount, toggleBrandLike, toggleBrandShortList } = brandSlice.actions;
// export default brandSlice.reducer;
 
 
// src/Redux/Slices/brandsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../Api/api';
import { userId } from '../../Utils/autherId';

export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/brandlisting/getAllBrandListing`,
        { params: { page, id: userId } }
      );
      // API returns { data: { brands: [...], pagination: { … } } }
      return { brands: data.data.brands, pagination: data.data.pagination, page };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: 'Unknown error' }
      );
    }
  }
);

const initialState = {
  brands: [],
  fetchedPages: [],      // track which pages we’ve loaded
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,      // renamed to match your UI
    hasPrevious: false,
  },
  isLoading: false,
  error: null,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    resetBrands(state) {
      // clear everything so we can re‐fetch page 1 from scratch
      Object.assign(state, initialState);
    },
    toggleBrandLike(state, action) {
      const id = action.payload;
      state.brands = state.brands.map(b =>
        b.uuid === id ? { ...b, isLiked: !b.isLiked } : b
      );
    },
    toggleBrandShortList(state, action) {
      const id = action.payload;
      state.brands = state.brands.map(b =>
        b.uuid === id
          ? { ...b, isShortListed: !b.isShortListed }
          : b
      );
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // if we’re reloading page 1, drop the old data:
        if (action.meta.arg.page === 1) {
          state.brands = [];
          state.fetchedPages = [];
        }
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        const { brands, pagination, page } = action.payload;
        state.isLoading = false;

        // massage the API’s pagination into your UI shape:
        state.pagination = {
          currentPage: page,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          hasNext: pagination.hasNextPage,       // <— renamed here
          hasPrevious: pagination.hasPreviousPage
        };

        // avoid dupes if someone asks for the same page twice:
        if (!state.fetchedPages.includes(page)) {
          state.fetchedPages.push(page);
          if (page === 1) {
            state.brands = brands;
          } else {
            state.brands = state.brands.concat(brands);
          }
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  }
});

export const {
  resetBrands,
  toggleBrandLike,
  toggleBrandShortList
} = brandsSlice.actions;
export default brandsSlice.reducer;

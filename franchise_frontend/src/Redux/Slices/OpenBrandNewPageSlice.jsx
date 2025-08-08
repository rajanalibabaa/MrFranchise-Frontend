import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
  name: "brand",
  initialState: {
    openDialog: false,
  },
  reducers: {
    openBrandDialog: (state, action) => {
      const brand = action.payload;

      if (!brand?.uuid) {
        console.error("❌ No UUID in brand payload");
        return;
      }

      const brandId = brand.uuid;
      const brandName = encodeURIComponent(brand.brandname || brand.brandName); // Encode for safe URL usage

      // 1. Store brand data in localStorage
      localStorage.setItem(`brand-${brandId}`, JSON.stringify(brand));

      // 2. Open new window with brandId and brandName in URL
      const newWindow = window.open(`${window.location.origin}/brands/${brandId}?name=${brandName}`, "_blank");


      // 3. Clean up localStorage when window closes
      if (newWindow) {
        newWindow.onbeforeunload = () => {
          localStorage.removeItem(`brand-${brandId}`);
        };
      }
    },
  },
});

export const { openBrandDialog } = brandSlice.actions;
export default brandSlice.reducer;

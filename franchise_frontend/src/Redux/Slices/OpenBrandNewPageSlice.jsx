// src/redux/slices/brandSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { userId } from "../../Utils/autherId";
import { postApi } from "../../Api/DefaultApi";
import { api } from "../../Api/api";
import { addviewBrand } from "./viewSlice.jsx";

const initialState = {
  openDialog: false,
  lastOpenedBrandId: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setOpenDialog(state, action) {
      state.openDialog = Boolean(action.payload);
    },
    setLastOpenedBrandId(state, action) {
      state.lastOpenedBrandId = action.payload ?? null;
    },
  },
});

export const { setOpenDialog, setLastOpenedBrandId } = brandSlice.actions;
export default brandSlice.reducer;

// Thunk for side effects
export const openBrandDialog = (brand) => async (dispatch) => {
  if (!brand || !brand.uuid) {
    console.error("❌ No UUID in brand payload");
    return;
  }

  const brandId = brand.uuid;

  // Record "view" in another slice + backend (fire-and-forget)
  if (userId) {
    dispatch(addviewBrand(brand));
    postApi(`${api.shortListApi.post}/${userId}`, { viewedID: brandId }).catch(
      (err) => console.error("Failed to record view:", err)
    );
  }

  const brandNameRaw = brand.brandName ?? brand.brandname ?? "";
  const brandName = encodeURIComponent(brandNameRaw);

  // Open new window and manage localStorage (browser environment only)
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(`brand-${brandId}`, JSON.stringify(brand));
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }

    const url = `${window.location.origin}/brands/${brandId}?name=${brandName}`;
    const newWindow = window.open(url, "_blank");

    if (newWindow) {
      newWindow.onbeforeunload = () => {
        try {
          localStorage.removeItem(`brand-${brandId}`);
        } catch {}
      };
    }
  }

  // Optional: track in state which brand was just opened
  dispatch(setLastOpenedBrandId(brandId));
};

import React, { lazy, Suspense, useEffect } from "react";
import Navbar from "../../Components/Navbar/NavBar";
import { Box, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { hideLoading } from "../../Redux/Slices/loadingSlice.jsx";

// Lazy load the BrandList component
const BrandListNew = lazy(() => import("./BrandList.jsx"));


function BrandCategoryViewPage() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideLoading());
  }, [dispatch]);

  return (
    <>
      {/* Navbar with memoization to prevent unnecessary re-renders */}
      <Navbar />

      {/* Scrollable Content with optimized loading */}
      <Box
        component="main"
        sx={{
          mt: "12px",
          ml: "12px",
          minHeight: "calc(100vh - 64px)", // Adjust based on your navbar height
          position: "relative"
        }}
      >
        <Suspense fallback={
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}
          >
            <CircularProgress />
          </Box>
        }>
          <BrandListNew />
        </Suspense>
      </Box>
    </>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(BrandCategoryViewPage);
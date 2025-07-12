import React, { lazy, Suspense } from "react";
import Navbar from "../../Components/Navbar/NavBar";
import { Box, CircularProgress } from "@mui/material";

// Lazy load the BrandList component
const BrandListNew = lazy(() => import("./BrandList.jsx"));

function BrandCategoryViewPage() {
  return (
    <>
      {/* Navbar with memoization to prevent unnecessary re-renders */}
      <Navbar />

      {/* Scrollable Content with optimized loading */}
      <Box
        component="main"
        sx={{
          mt: "12px",
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
import React, { lazy, Suspense, useEffect } from "react";
import Navbar from "../../Components/Navbar/NavBar";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { hideLoading } from "../../Redux/Slices/loadingSlice.jsx";
import { useMediaQuery } from "@mui/system";

// Lazy load the BrandList component
const BrandListNew = lazy(() => import("./BrandListAllbrands.jsx"));

function BrandCategoryViewPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(hideLoading());
  }, [dispatch]);

  return (
    <>
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000, // Keeps it on top of everything
            backgroundColor: "#fff", // Or match your theme
          }}
        >
          <Navbar />
        </Box>
      )}

      {/* Navbar with memoization to prevent unnecessary re-renders */}
      {!isMobile && <Navbar />}
      {/* Scrollable Content with optimized loading */}
      <Box
        component="main"
        sx={{
          mt: "12px",
          ml: "12px",
          minHeight: "calc(100vh - 64px)", // Adjust based on your navbar height
          position: "relative",
        }}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <BrandListNew />
        </Suspense>
      </Box>
    </>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(BrandCategoryViewPage);

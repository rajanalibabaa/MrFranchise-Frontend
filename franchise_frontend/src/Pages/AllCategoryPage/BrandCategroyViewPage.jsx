
import React, { lazy, Suspense, useEffect, useCallback } from "react";

import Navbar from "../../Components/Navbar/NavBar";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/system";

// Lazy load the BrandList component
const BrandListNew = lazy(() => import("./BrandListAllbrands.jsx"));
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../Redux/Slices/FilterBrandSlice';
function BrandCategoryViewPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filters = {};
    
    if (params.has('subcat')) filters.subcat = params.get('subcat');
    if (params.has('state')) filters.state = params.get('state');
    if (params.has('investmentRange')) {
      filters.investmentRange = params.get('investmentRange');
    }

    if (Object.keys(filters).length > 0) {
      dispatch(setFilter(filters));
    }
  }, [location.search, dispatch]);


  return (
    <>
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
          }}
        >
          <Navbar />
        </Box>
      )}

      {!isMobile && <Navbar />}
      
      <Box
        component="main"
        sx={{
          mt: "12px",
          ml: "12px",
          minHeight: "calc(100vh - 64px)",
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
          <BrandListNew  />
        </Suspense>
      </Box>
    </>
  );
}

export default React.memo(BrandCategoryViewPage);

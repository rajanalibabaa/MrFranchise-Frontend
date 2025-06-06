import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  CircularProgress,
  Badge,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  Close,
  FilterAlt,
  Search as SearchIcon,
  Clear as ClearIcon,
  Home,
  Store,
  AttachMoney,
  Business as BusinessIcon,
} from "@mui/icons-material";
import {
  fetchBrands,
  setFilters,
  clearFilters,
  openBrandDialog,
  closeBrandDialog,
  toggleLikeBrand,
} from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "./BrandDetailsDialog";
import { useLocation } from "react-router-dom";
import { Compare } from "@mui/icons-material";
import BrandComparison from "./BrandComparison";
import FilterPanel from "./FillterPannel.jsx";
import BrandCard from "./BrandCard.jsx";

function BrandList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const initialFilters = location.state?.filters || {};
  const {
    data: brands = [],
    filteredData: filteredBrands = [],
    loading = false,
    error = null,
    categories: availableCategories = [],
    subCategories: availableSubCategories = [],
    childCategories: availableChildCategories = [],
    modelTypes: availableModelTypes = [],
    states: availableStates = [],
    cities: availableCities = [],
    filters = initialFilters,
    openDialog,
    selectedBrand,
  } = useSelector((state) => state.brands);

  console.log("filteredData :", filteredBrands);

  // Add these for back to top button
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Add these state variables to the BrandList component
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  // Add these functions to the BrandList component
  const toggleBrandComparison = (brand) => {
    setSelectedForComparison((prev) => {
      const exists = prev.some((b) => b.uuid === brand.uuid);
      if (exists) {
        return prev.filter((b) => b.uuid !== brand.uuid);
      } else if (prev.length < 3) {
        return [...prev, brand];
      }
      return prev;
    });
  };
  console.log("compare", selectedForComparison);

  const removeFromComparison = (brandId) => {
    setSelectedForComparison((prev) => prev.filter((b) => b.uuid !== brandId));
  };

  const clearComparison = () => {
    setSelectedForComparison([]);
  };

  useEffect(() => {
    try {
      if (filteredBrands.length === 0) {
        dispatch(setFilters(initialFilters)); // Initialize filters from navigation state
        dispatch(fetchBrands());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const handleOpenBrand = (brand) => {
    dispatch(openBrandDialog(brand));
  };

  const handleCloseDialog = () => {
    dispatch(closeBrandDialog());
  };

  const handleFilterChange = useCallback(
    (name, value) => {
      dispatch(setFilters({ [name]: value }));
    },
    [dispatch]
  );

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const toggleLike = async (brandId, isLiked) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      await dispatch(toggleLikeBrand({ brandId, isLiked })).unwrap();
      // Optionally show success message
    } catch (error) {
      console.error("Like operation failed:", error);
      // Show error to user
      alert(error.message || "Failed to update like status");
    }
  };
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
      <Box sx={{ position: "fixed", right: 20, zIndex: 1000 }}>
        <Badge badgeContent={selectedForComparison.length} color="primary">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Compare />}
            onClick={() => setComparisonOpen(true)}
            sx={{
              borderRadius: 4,
              boxShadow: 3,
              bgcolor: "#ff9800",
              "&:hover": {
                bgcolor: "#fb8c00",
                boxShadow: 6,
              },
            }}
          >
            Compare
          </Button>
        </Badge>
      </Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/"
          sx={{ display: "flex", alignItems: "center", color: "#4caf50" }}
        >
          <Home sx={{ mr: 0.5, color: "#ff9800" }} /> Home
        </Link>
        <Typography
          sx={{ display: "flex", alignItems: "center", color: "#4caf50" }}
        >
          <Store sx={{ mr: 0.5, color: "#ff9800" }} /> Franchise Brands
        </Typography>
      </Breadcrumbs>
      {/* Back to Top Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
          "&.visible": {
            opacity: 1,
            visibility: "visible",
          },
        }}
        className={scrollPosition > 300 ? "visible" : ""}
      >
        <IconButton
          onClick={scrollToTop}
          sx={{
            bgcolor: "#ff9800",
            color: "white",
            "&:hover": {
              bgcolor: "#fb8c00",
            },
            boxShadow: 3,
            width: 48,
            height: 48,
          }}
          aria-label="back to top"
        >
          <KeyboardArrowUp fontSize="medium" />
        </IconButton>
      </Box>{" "}
      {/* Back to Top Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
          "&.visible": {
            opacity: 1,
            visibility: "visible",
          },
        }}
        className={scrollPosition > 300 ? "visible" : ""}
      >
        <IconButton
          onClick={scrollToTop}
          sx={{
            bgcolor: "#ff9800",
            color: "white",
            "&:hover": {
              bgcolor: "#fb8c00",
            },
            boxShadow: 3,
            width: 48,
            height: 48,
          }}
          aria-label="back to top"
        >
          <KeyboardArrowUp fontSize="medium" />
        </IconButton>
      </Box>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Desktop Filters */}
        <Box
          sx={{
            mt: 3,
            mr: 5,
            width: { md: 280 },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <FilterPanel
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
            availableCategories={availableCategories}
            availableSubCategories={availableSubCategories}
            availableChildCategories={availableChildCategories}
            availableModelTypes={availableModelTypes}
            availableStates={availableStates}
            availableCities={availableCities}
            filteredBrands={filteredBrands}
            brands={brands}
          />
        </Box>

        {/* Mobile Filters Button */}
        <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
            endIcon={
              <Badge
                badgeContent={activeFilterCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#4caf50",
                    color: "white",
                  },
                }}
              />
            }
            onClick={() => setMobileFiltersOpen(true)}
            fullWidth
            sx={{
              py: 1.5,
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": {
                borderColor: "#fb8c00",
              },
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, ml: { md: 3 } }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{ color: "#ff9800" }}
              />
            </Box>
          ) : error ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Box>
          ) : filteredBrands.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography
                variant="h5"
                component={"span"}
                sx={{ color: "#4caf50" }}
              >
                No brands match your filters
              </Typography>
              <Typography variant="body1" sx={{ color: "#ff9800", mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                size="large"
                sx={{
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  "&:hover": {
                    borderColor: "#fb8c00",
                  },
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: "#4caf50" }}
              >
                Available Franchise Brands
              </Typography>
              <Typography variant="body1" sx={{ color: "black", mb: 3 }}>
                Showing {filteredBrands.length} of {brands.length} brands
              </Typography>

              <Grid container spacing={3}>
                {filteredBrands.map((brand) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={brand.uuid}>
                    <BrandCard
                      brand={brand}
                      handleOpenBrand={handleOpenBrand}
                      toggleLike={toggleLike}
                      showLogin={showLogin}
                      setShowLogin={setShowLogin}
                      isSelectedForComparison={selectedForComparison.some(
                        (b) => b.uuid === brand.uuid
                      )}
                      toggleBrandComparison={toggleBrandComparison}
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Comparison dialog */}
              <BrandComparison
                open={comparisonOpen}
                onClose={() => setComparisonOpen(false)}
                selectedBrands={selectedForComparison}
                removeFromComparison={removeFromComparison}
              />
            </>
          )}
        </Box>
      </Box>
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 300 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            ml={30}
            sx={{ overflow: "hidden" }}
          >
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <Close sx={{ color: "#ff9800" }} />
            </IconButton>
          </Box>
          <Divider />
          <FilterPanel
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
            availableCategories={availableCategories}
            availableSubCategories={availableSubCategories}
            availableChildCategories={availableChildCategories}
            availableModelTypes={availableModelTypes}
            availableStates={availableStates}
            availableCities={availableCities}
            filteredBrands={filteredBrands}
            brands={brands}
          />
          <Box p={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setMobileFiltersOpen(false)}
              size="large"
              sx={{
                bgcolor: "#4caf50",
                "&:hover": {
                  bgcolor: "#388e3c",
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
      <BrandDetailsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        brand={selectedBrand}
      />
    </Container>
  );
}

export default BrandList;

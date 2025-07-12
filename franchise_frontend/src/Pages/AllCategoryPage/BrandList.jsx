import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Badge,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close,
  FilterAlt,
  Clear as ClearIcon,
  Compare,
} from "@mui/icons-material";
import { useBrands, useToggleLike, openBrandDialog, filterBrands, useRecordView } from "../../Hooks/Fetchbrands";
import { useLocation } from "react-router-dom";

// Lazy load heavy components
const BrandComparison = lazy(() => import("./BrandComparison"));
const FilterPanel = lazy(() => import("./FillterPannel.jsx"));
const BrandDetail = lazy(() => import("./BrandDetail.jsx"));
const BrandCard = lazy(() => import("./BrandCard.jsx"));

// Memoized BrandCard to prevent unnecessary re-renders
const MemoizedBrandCard = React.memo(BrandCard);

// Skeleton components for loading states
const BrandCardSkeleton = () => (
  <Box sx={{ height: 350, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 2 }} />
);

const FilterPanelSkeleton = () => (
  <Box sx={{ p: 2 }}>
    {[...Array(6)].map((_, i) => (
      <Box key={`skeleton-${i}`} sx={{ mb: 2 }}>
        <Box sx={{ height: 20, width: '60%', bgcolor: 'rgba(0, 0, 0, 0.04)', mb: 1 }} />
        <Box sx={{ height: 40, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 1 }} />
      </Box>
    ))}
  </Box>
);

function BrandList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const initialFilters = location.state?.filters || {};
  
  // React Query hooks
  const { data: brands = [], isLoading, error } = useBrands();
  const toggleLikeMutation = useToggleLike();
  const recordViewMutation = useRecordView();
  
  // State for filters and UI
  const [filters, setFilters] = useState(initialFilters);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);

  // Memoize filtered brands to prevent recalculation on every render
  const filteredBrands = useMemo(() => filterBrands(brands, filters), [brands, filters]);

  // Memoize filter options to prevent recalculation on every render
 // Updated filterOptions memoization
// const filterOptions = useMemo(() => {
//   if (!brands.length) return {};

//   // Add unique keys to all array operations
//   const availableCategories = [...new Set(
//     brands.map(brand => brand.franchiseDetails?.brandCategories?.main)
//   )].filter(Boolean);

//   const availableSubCategories = [...new Set(
//     brands.map(brand => brand.franchiseDetails?.brandCategories?.sub)
//   )].filter(Boolean);

//   const availableChildCategories = [...new Set(
//     brands.map(brand => brand.franchiseDetails?.brandCategories?.child)
//   )].filter(Boolean);

//   const availableModelTypes = [...new Set(
//     brands.flatMap(brand => 
//       brand.franchiseDetails?.fico?.map(item => item.franchiseType) || []
//     )
//   )].filter(Boolean);

//   const availableInvestmentRanges = [...new Set(
//     brands.flatMap(brand => 
//       brand.franchiseDetails?.fico?.map(item => item.investmentRange) || []
//     )
//   )].filter(Boolean);

//   const locationData = brands.flatMap(brand => 
//     brand.expansionLocationData?.expansionLocations.domestic?.locations || []
//   );

//   const availableStates = [...new Set(
//     locationData.map(loc => loc.state)
//   )].filter(Boolean);

//   const availableDistricts = locationData.flatMap(loc => 
//     loc.districts?.map(district => ({
//       key: `${loc.state}-${district.district}`,
//       district: district.district,
//       state: loc.state
//     })) || []
//   ).filter(item => item.district);

//   const availableCities = locationData.flatMap(loc => 
//     loc.districts?.flatMap(district => 
//       district.cities?.map(city => ({
//         key: `${loc.state}-${district.district}-${city}`,
//         city,
//         district: district.district,
//         state: loc.state
//       })) || []
//     ) || []
//   ).filter(item => item.city);

//   return {
//     availableCategories,
//     availableSubCategories,
//     availableChildCategories,
//     availableModelTypes,
//     availableInvestmentRanges,
//     availableStates,
//     availableDistricts,
//     availableCities
//   };
// }, [brands]);
// Memoize filter options more efficiently
const filterOptions = useMemo(() => {
  if (!brands.length) return {};

  // Extract all unique values in a single pass through brands array
  const categories = new Set();
  const subCategories = new Set();
  const childCategories = new Set();
  const modelTypes = new Set();
  const investmentRanges = new Set();
  const states = new Set();
  const districts = [];
  const cities = [];

  brands.forEach(brand => {
    // Categories
    if (brand.franchiseDetails?.brandCategories?.main) {
      categories.add(brand.franchiseDetails.brandCategories.main);
    }
    if (brand.franchiseDetails?.brandCategories?.sub) {
      subCategories.add(brand.franchiseDetails.brandCategories.sub);
    }
    if (brand.franchiseDetails?.brandCategories?.child) {
      childCategories.add(brand.franchiseDetails.brandCategories.child);
    }

    // FICO details
    brand.franchiseDetails?.fico?.forEach(item => {
      if (item.franchiseType) modelTypes.add(item.franchiseType);
      if (item.investmentRange) investmentRanges.add(item.investmentRange);
    });

    // Location data
    brand.expansionLocationData?.expansionLocations.domestic?.locations?.forEach(loc => {
      if (loc.state) states.add(loc.state);
      
      loc.districts?.forEach(district => {
        if (district.district) {
          districts.push({
            state: loc.state,
            district: district.district
          });
        }
        
        district.cities?.forEach(city => {
          cities.push({
            state: loc.state,
            district: district.district,
            city
          });
        });
      });
    });
  });

  return {
    availableCategories: Array.from(categories),
    availableSubCategories: Array.from(subCategories),
    availableChildCategories: Array.from(childCategories),
    availableModelTypes: Array.from(modelTypes),
    availableInvestmentRanges: Array.from(investmentRanges),
    availableStates: Array.from(states),
    availableDistricts: districts,
    availableCities: cities
  };
}, [brands]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    const position = window.pageYOffset;
    setScrollPosition(position);
    
    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const toggleBrandComparison = useCallback((brand) => {
    setSelectedForComparison((prev) => {
      const exists = prev.some((b) => b.uuid === brand.uuid);
      if (exists) {
        return prev.filter((b) => b.uuid !== brand.uuid);
      } else if (prev.length < 3) {
        return [...prev, brand];
      }
      return prev;
    });
  }, []);

  const removeFromComparison = useCallback((brandId) => {
    setSelectedForComparison((prev) => prev.filter((b) => b.uuid !== brandId));
  }, []);

  const handleOpenBrand = useCallback(async (brand) => {
    try {
      await recordViewMutation.mutateAsync(brand.uuid);
      openBrandDialog(brand);
    } catch (error) {
      console.error("Failed to record view:", error);
    }
  }, [recordViewMutation]);

  // const handleFilterChange = useCallback((name, value) => {
  //   setFilters(prev => ({ ...prev, [name]: value }));
  // }, []);

  // Optimized filter change handler
const handleFilterChange = useCallback((name, value) => {
  setFilters(prev => {
    // Special handling for location filters to reset dependent filters
    if (name === 'selectedState') {
      return { 
        ...prev, 
        [name]: value,
        selectedDistrict: '',
        selectedCity: '' 
      };
    }
    if (name === 'selectedDistrict') {
      return { 
        ...prev, 
        [name]: value,
        selectedCity: '' 
      };
    }
    return { ...prev, [name]: value };
  });
}, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedCategory: "",
      selectedSubCategory: "",
      selectedChildCategory: [],
      selectedModelType: "",
      selectedState: "",
      selectedDistrict: "",
      selectedCity: "",
      selectedInvestmentRange: "",
    });
  }, []);

  const toggleLike = useCallback(async (brandId, isLiked) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      await toggleLikeMutation.mutateAsync({ brandId, isLiked });
    } catch (error) {
      console.error("Like operation failed:", error);
    }
  }, [toggleLikeMutation]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Loading state with centered spinner
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ color: "#ff9800" }} 
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 0, mb: 6 }}>
      {/* Comparison Button */}
      <Box sx={{ 
        position: "fixed", 
        right: 20,
        zIndex: 1000,
      }}>
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

      {/* Scroll to Top Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          opacity: scrollPosition > 300 ? 1 : 0,
          visibility: scrollPosition > 300 ? "visible" : "hidden",
          transition: 'opacity 0.3s, visibility 0.3s',
        }}
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
        {/* Desktop Filters - Only show on larger screens */}
        {!isMobile && (
          <Box
            sx={{
              mr: 5,
              width: 280,
              flexShrink: 0,
              position: 'sticky',
              top: 16,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ff9800',
                borderRadius: '3px',
              },
            }}
          >
<Suspense fallback={<FilterPanelSkeleton />}>
  <FilterPanel
    key="filter-panel" // Add key to force remount when brands change
    filters={filters}
    onFilterChange={handleFilterChange}
    onClearFilters={handleClearFilters}
    activeFilterCount={activeFilterCount}
    // Only pass necessary data
    categories={filterOptions.availableCategories}
    subCategories={filterOptions.availableSubCategories}
    childCategories={filterOptions.availableChildCategories}
    modelTypes={filterOptions.availableModelTypes}
    investmentRanges={filterOptions.availableInvestmentRanges}
    locationData={{
      states: filterOptions.availableStates,
      districts: filterOptions.availableDistricts,
      cities: filterOptions.availableCities
    }}
    resultStats={{
      showing: filteredBrands.length,
      total: brands.length
    }}
  />
</Suspense>
          </Box>
        )}

        {/* Mobile Filters Button */}
        {isMobile && (
          <Box sx={{ display: 'block', mb: 2 }}>
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
        )}

        {/* Main Content */}
        <Box flexGrow={1}>
          {error ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <Typography color="error" variant="h6">
                {error.message}
              </Typography>
            </Box>
          ) : filteredBrands.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h5" sx={{ color: "#4caf50" }}>
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
              <Typography variant="h4"  sx={{ color: "#4caf50", mb: 2 }}>
                Available Franchise Brands
              </Typography>
              <Typography variant="body1" sx={{ color: "black", mb: 3 }}>
                Showing {filteredBrands.length} of {brands.length} brands
              </Typography>

              <Grid container spacing={3}>
                {filteredBrands.map((brand) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`brand-${brand.uuid}`}>
                    <Suspense fallback={<BrandCardSkeleton />}>
                      <MemoizedBrandCard
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
                    </Suspense>
                  </Grid>
                ))}
              </Grid>
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
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <Close sx={{ color: "#ff9800" }} />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                {...filterOptions}
                filteredBrands={filteredBrands}
                brands={brands}
              />
            </Suspense>
          </Box>
          <Box mt={2}>
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

         
              
      <Suspense fallback={null}>
        <BrandDetail />
      </Suspense>
      
      <Suspense fallback={null}>
        <BrandComparison
          open={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
          selectedBrands={selectedForComparison}
          removeFromComparison={removeFromComparison}
        />
      </Suspense>
    </Container>
  );
}

export default React.memo(BrandList);
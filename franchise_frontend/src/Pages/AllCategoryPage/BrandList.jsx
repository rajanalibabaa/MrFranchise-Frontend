import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
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
import {
  useBrands,
  useToggleLike,
  openBrandDialog,
  filterBrands,
  useRecordView,
} from "../../Hooks/Fetchbrands";
import { useLocation } from "react-router-dom";

// Lazy load heavy components

// Memoized components
const BrandCardSkeleton = React.memo(() => (
  <Box sx={{ height: 350, bgcolor: "rgba(0, 0, 0, 0.04)", borderRadius: 2 }} />
));

const FilterPanelSkeleton = React.memo(() => (
  <Box sx={{ p: 2 }}>
    {[...Array(6)].map((_, i) => (
      <Box key={`skeleton-${i}`} sx={{ mb: 2 }}>
        <Box
          sx={{
            height: 20,
            width: "60%",
            bgcolor: "rgba(0, 0, 0, 0.04)",
            mb: 1,
          }}
        />
        <Box
          sx={{ height: 40, bgcolor: "rgba(0, 0, 0, 0.04)", borderRadius: 1 }}
        />
      </Box>
    ))}
  </Box>
));

// Lazy load heavy components
const BrandComparison = lazy(() => import("./BrandComparison"));
const FilterPanel = lazy(() => import("./FillterPannel.jsx"));
const BrandDetail = lazy(() => import("./BrandDetail.jsx"));
const BrandCard = lazy(() => import("./BrandCard.jsx"));

// Memoized BrandCard with proper props comparison
const MemoizedBrandCard = React.memo(BrandCard, (prevProps, nextProps) => {
  return (
    prevProps.brand.uuid === nextProps.brand.uuid &&
    prevProps.isSelectedForComparison === nextProps.isSelectedForComparison
  );
});

function BrandList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (isScrolling) return;

    setIsScrolling(true);
    setScrollPosition(window.pageYOffset);

    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isScrolling]);

  // Memoize filtered brands
  const filteredBrands = useMemo(() => {
    return filterBrands(brands, filters);
  }, [brands, filters]);

  // Optimized filter options extraction
  const filterOptions = useMemo(() => {
    if (!brands.length)
      return {
        availableCategories: [],
        availableSubCategories: [],
        availableChildCategories: [],
        availableModelTypes: [],
        availableInvestmentRanges: [],
        availableStates: [],
        availableDistricts: [],
        availableCities: [],
      };

    const categories = new Set();
    const subCategories = new Set();
    const childCategories = new Set();
    const modelTypes = new Set();
    const investmentRanges = new Set();
    const states = new Set();
    const districts = new Map();
    const cities = new Map();

    brands.forEach((brand) => {
      // Categories
      const mainCat = brand.franchiseDetails?.brandCategories?.main;
      if (mainCat) categories.add(mainCat);

      const subCat = brand.franchiseDetails?.brandCategories?.sub;
      if (subCat) subCategories.add(subCat);

      const childCat = brand.franchiseDetails?.brandCategories?.child;
      if (childCat) childCategories.add(childCat);

      // FICO details
      brand.franchiseDetails?.fico?.forEach((item) => {
        if (item.franchiseType) modelTypes.add(item.franchiseType);
        if (item.investmentRange) investmentRanges.add(item.investmentRange);
      });

      // Location data
      brand.expansionLocationData?.expansionLocations.domestic?.locations?.forEach(
        (loc) => {
          if (loc.state) {
            states.add(loc.state);

            loc.districts?.forEach((district) => {
              if (district.district) {
                const key = `${loc.state}-${district.district}`;
                if (!districts.has(key)) {
                  districts.set(key, {
                    state: loc.state,
                    district: district.district,
                  });
                }

                district.cities?.forEach((city) => {
                  const cityKey = `${loc.state}-${district.district}-${city}`;
                  if (!cities.has(cityKey)) {
                    cities.set(cityKey, {
                      state: loc.state,
                      district: district.district,
                      city,
                    });
                  }
                });
              }
            });
          }
        }
      );
    });

    return {
      availableCategories: Array.from(categories),
      availableSubCategories: Array.from(subCategories),
      availableChildCategories: Array.from(childCategories),
      availableModelTypes: Array.from(modelTypes),
      availableInvestmentRanges: Array.from(investmentRanges),
      availableStates: Array.from(states),
      availableDistricts: Array.from(districts.values()),
      availableCities: Array.from(cities.values()),
    };
  }, [brands]);

  // Stable callback handlers
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const toggleBrandComparison = useCallback((brand) => {
    setSelectedForComparison((prev) => {
      const exists = prev.some((b) => b.uuid === brand.uuid);
      return exists
        ? prev.filter((b) => b.uuid !== brand.uuid)
        : prev.length < 3
        ? [...prev, brand]
        : prev;
    });
  }, []);

  const removeFromComparison = useCallback((brandId) => {
    setSelectedForComparison((prev) => prev.filter((b) => b.uuid !== brandId));
  }, []);

  const handleOpenBrand = useCallback(
    async (brand) => {
      try {
        await recordViewMutation.mutateAsync(brand.uuid);
        openBrandDialog(brand);
      } catch (error) {
        console.error("Failed to record view:", error);
      }
    },
    [recordViewMutation]
  );

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => {
      // Reset dependent filters when parent changes
      if (name === "selectedState") {
        return {
          ...prev,
          [name]: value,
          selectedDistrict: "",
          selectedCity: "",
        };
      }
      if (name === "selectedDistrict") {
        return {
          ...prev,
          [name]: value,
          selectedCity: "",
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

  const toggleLike = useCallback(
    async (brandId, isLiked) => {
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
    },
    [toggleLikeMutation]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (!Array.isArray(value) || value.length > 0)
    ).length;
  }, [filters]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#ff9800" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 0, mb: 6 }}>
      {/* Comparison Button */}
      <Box
        sx={{
          position: "fixed",
          top: 200,
          right: 25,
          // bottom: 80,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={selectedForComparison.length} color="primary">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Compare />}
            onClick={() => setComparisonOpen(true)}
            disabled={selectedForComparison.length === 0}
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
      {scrollPosition > 300 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
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
      )}

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              position: "sticky",
              top: 16,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ff9800",
                borderRadius: "3px",
              },
            }}
          >
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                categories={filterOptions.availableCategories}
                subCategories={filterOptions.availableSubCategories}
                childCategories={filterOptions.availableChildCategories}
                modelTypes={filterOptions.availableModelTypes}
                investmentRanges={filterOptions.availableInvestmentRanges}
                locationData={{
                  states: filterOptions.availableStates,
                  districts: filterOptions.availableDistricts,
                  cities: filterOptions.availableCities,
                }}
                resultStats={{
                  showing: filteredBrands.length,
                  total: brands.length,
                }}
              />
            </Suspense>
          </Box>
        )}

        {/* Mobile Filters Button */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
              endIcon={
                <Badge badgeContent={activeFilterCount} color="primary" />
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
              <Typography variant="h5" color="primary">
                No brands match your filters
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                size="large"
                sx={{
                  mt: 2,
                  borderColor: "#ff9800",
                  color: "#ff9800",
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h4" gutterBottom color="#ff9800">
                Available Franchise Brands
              </Typography>
              <Typography variant="body1" gutterBottom>
                Showing {filteredBrands.length} of {brands.length} brands
              </Typography>

              <Grid container spacing={3}>
                {filteredBrands.map((brand) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={brand.uuid}>
                    <Suspense fallback={<BrandCardSkeleton />}>
                      <MemoizedBrandCard
                        brand={brand}
                        onOpenBrand={handleOpenBrand}
                        onToggleLike={toggleLike}
                        showLogin={showLogin}
                        onShowLogin={setShowLogin}
                        isSelectedForComparison={selectedForComparison.some(
                          (b) => b.uuid === brand.uuid
                        )}
                        onToggleBrandComparison={toggleBrandComparison}
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
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                categories={filterOptions.availableCategories}
                subCategories={filterOptions.availableSubCategories}
                // resultStats={{ showing: filteredBrands.length, total: brands.length }}
                childCategories={filterOptions.availableChildCategories}
                modelTypes={filterOptions.availableModelTypes}
                investmentRanges={filterOptions.availableInvestmentRanges}
                locationData={{
                  states: filterOptions.availableStates,
                  districts: filterOptions.availableDistricts,
                  cities: filterOptions.availableCities,
                }}
                resultStats={{
                  showing: filteredBrands.length,
                  total: brands.length,
                }}
              />
            </Suspense>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setMobileFiltersOpen(false)}
            sx={{ mt: 2 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Brand Comparison Dialog */}
      <Suspense fallback={null}>
        <BrandComparison
          open={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
          selectedBrands={selectedForComparison}
          onRemoveFromComparison={removeFromComparison}
        />
      </Suspense>
    </Container>
  );
}

export default React.memo(BrandList);

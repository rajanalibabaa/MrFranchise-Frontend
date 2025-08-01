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
  Tooltip,
  Pagination,
} from "@mui/material";
import {
  Close,
  FilterAlt,
  Clear as ClearIcon,
  Compare,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage.jsx";
import { useToggleLike } from "../../Hooks/Fetchbrands.jsx";
import { useDispatch, useSelector } from "react-redux";
import { 
  setFilter, 
  resetFilters, 
  fetchFilteredBrands,
  setPage 
} from "../../Redux/Slices/FilterBrandSlice.jsx";
import { fetchFilterOptions } from "../../Redux/Slices/filterDropdownData.jsx";

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
const BrandComparison = lazy(() => import("./BrandComparison.jsx"));
const FilterPanel = lazy(() => import("./FillterPannel.jsx"));
const BrandCard = lazy(() => import("./BrandCard.jsx"));

function BrandList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const toggleLike = useToggleLike();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const dispatch = useDispatch();

  // Redux state selectors
  const filterBrandsState = useSelector((state) => state.filterBrands);
  const filterDropdownState = useSelector((state) => state.filterDropdown);
  const authState = useSelector((state) => state.auth);
  
  const { 
    brands = [], 
    loading, 
    error,
    filters,
    pagination 
  } = filterBrandsState;

  const {
    mainCategories = [],
    subCategories = [],
    childCategories = [],
    investmentRanges = [],
    franchiseModels = [],
    states = [],
    districts = [],
    cities = [],
    loading: dropdownLoading
  } = filterDropdownState;

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchFilteredBrands(filters));
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setIsScrolling(true);
      const timer = setTimeout(() => setIsScrolling(false), 100);
      return () => clearTimeout(timer);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((name, value) => {
    dispatch(setFilter({ filterName: name, value }));
    dispatch(fetchFilteredBrands({ ...filters, [name]: value }));
    
    // Fetch dependent data when parent filter changes
    if (name === 'maincat') {
      dispatch(fetchFilterOptions({ main: value }));
    } else if (name === 'subcat') {
      dispatch(fetchFilterOptions({ sub: value }));
    } else if (name === 'state') {
      dispatch(fetchFilterOptions({ state: value }));
    } else if (name === 'district') {
      dispatch(fetchFilterOptions({ district: value }));
    }
  }, [dispatch, filters]);

  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(fetchFilteredBrands(initialFilters));
  }, [dispatch]);

  const handlePageChange = useCallback((event, page) => {
    dispatch(setPage(page));
    dispatch(fetchFilteredBrands({ ...filters, page }));
  }, [dispatch, filters]);

  const handleLikeClick = useCallback(
    async (brandId, isLiked) => {
      if (likeProcessing[brandId]) return;
      
      if (!authState.isAuthenticated) {
        setShowLogin(true);
        return;
      }

      setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));

      try {
        await toggleLike.mutateAsync({ brandId, isLiked });
        // Refresh brands after like to update the like status
        dispatch(fetchFilteredBrands(filters));
      } catch (error) {
        console.error("Like operation failed:", error);
      } finally {
        setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
      }
    },
    [likeProcessing, toggleLike, authState, dispatch, filters]
  );

  const toggleBrandComparison = useCallback((brand) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(b => b.uuid === brand.uuid);
      if (isSelected) {
        return prev.filter(b => b.uuid !== brand.uuid);
      } else {
        return prev.length < 3 ? [...prev, brand] : prev;
      }
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (!Array.isArray(value) || value.length > 0)
    ).length;
  }, [filters]);

  // Extract available filter options from brands data
  const availableFilterOptions = useMemo(() => {
    const options = {
      mainCategories,
      subCategories,
      childCategories,
      investmentRanges,
      franchiseModels,
      states,
      districts,
      cities
    };

    // If dropdown data is still loading, extract from current brands
    if (dropdownLoading && brands.length > 0) {
      const unique = (items) => [...new Set(items.filter(Boolean))];
      
      return {
        mainCategories: unique(brands.map(b => b.brandCategories?.main)),
        subCategories: unique(brands.map(b => b.brandCategories?.sub)),
        childCategories: unique(brands.map(b => b.brandCategories?.child)),
        investmentRanges: unique(brands.flatMap(b => 
          b.fico?.map(f => f.investmentRange)
        )),
        franchiseModels: unique(brands.flatMap(b => 
          b.fico?.map(f => f.franchiseModel)
        )),
        states: unique(brands.flatMap(b => 
          b.expansionLocationData?.expansionLocations.domestic?.locations?.map(l => l.state)
        )),
        districts: unique(brands.flatMap(b => 
          b.expansionLocationData?.expansionLocations.domestic?.locations?.flatMap(l => 
            l.districts?.map(d => d.district)
          )
        )),
        cities: unique(brands.flatMap(b => 
          b.expansionLocationData?.expansionLocations.domestic?.locations?.flatMap(l => 
            l.districts?.flatMap(d => d.cities)
          )
        ))
      };
    }

    return options;
  }, [brands, dropdownLoading, mainCategories, subCategories, childCategories, 
      investmentRanges, franchiseModels, states, districts, cities]);

  return (
    <Container maxWidth="xl" sx={{ mt: 0, mb: 6 }}>
      {/* Comparison Button */}
      {selectedForComparison.length > 0 && (
        <Box sx={{ position: "fixed", top: 290, right: 25, zIndex: 1000 }}>
          <Badge badgeContent={selectedForComparison.length} color="primary">
            <Tooltip title="Click to compare selected brands" placement="left" arrow>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Compare />}
                onClick={() => setComparisonOpen(true)}
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  bgcolor: "#ff9800",
                  "&:hover": { bgcolor: "#fb8c00", boxShadow: 6 },
                }}
              >
                Compare
              </Button>
            </Tooltip>
          </Badge>
        </Box>
      )}

      {/* Scroll to Top Button */}
      {scrollPosition > 300 && !isScrolling && (
        <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
          <IconButton
            onClick={scrollToTop}
            sx={{
              bgcolor: "#ff9800",
              color: "white",
              "&:hover": { bgcolor: "#fb8c00" },
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
          <Box sx={{
            width: 280,
            flexShrink: 0,
            position: "sticky",
            top: 16,
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 32px)",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ff9800",
              borderRadius: "3px",
            },
          }}>
            <Suspense fallback={<FilterPanelSkeleton />}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilterCount={activeFilterCount}
                categories={availableFilterOptions.mainCategories}
                subCategories={availableFilterOptions.subCategories}
                childCategories={availableFilterOptions.childCategories}
                modelTypes={availableFilterOptions.franchiseModels}
                investmentRanges={availableFilterOptions.investmentRanges}
                locationData={{
                  states: availableFilterOptions.states,
                  districts: availableFilterOptions.districts,
                  cities: availableFilterOptions.cities,
                }}
                resultStats={{
                  showing: brands.length,
                  total: pagination.total,
                }}
                isLoading={loading || dropdownLoading}
              />
            </Suspense>
          </Box>
        )}

        {/* Mobile Filters Button */}
        {isMobile && (
          <Box sx={{ mb: 2, mt: 8 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
              endIcon={<Badge badgeContent={activeFilterCount} color="primary" />}
              onClick={() => setMobileFiltersOpen(true)}
              fullWidth
              sx={{
                py: 1.5,
                borderColor: "#ff9800",
                color: "#ff9800",
                "&:hover": { borderColor: "#fb8c00" },
              }}
            >
              Filters
            </Button>
          </Box>
        )}

        {/* Main Content */}
        <Box flexGrow={1} ml={{ md: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress size={60} thickness={4} sx={{ color: "#ff9800" }} />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Box>
          ) : brands.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h5" color="primary">
                No brands match your filters
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                size="large"
                sx={{ mt: 2, borderColor: "#ff9800", color: "#ff9800" }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Typography sx={{ ml: 2 }} variant={isMobile ? "h5" : "h4"} gutterBottom color="#ff9800">
                Food & Beverage Brands
              </Typography>
              <Typography sx={{ ml: 2, mb: 2 }} variant="body2" gutterBottom>
                Showing {brands.length} of {pagination.total} brands
              </Typography>

              <Grid container spacing={3}>
                {brands.map((brand) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={brand.uuid}>
                    <Suspense fallback={<BrandCardSkeleton />}>
                      <BrandCard
                        brand={brand}
                        handleLikeClick={handleLikeClick}
                        likeProcessing={likeProcessing}
                        showLogin={showLogin}
                        onShowLogin={setShowLogin}
                        isSelectedForComparison={selectedForComparison.some(b => b.uuid === brand.uuid)}
                        onToggleBrandComparison={toggleBrandComparison}
                        maxComparisonReached={selectedForComparison.length >= 3}
                      />
                    </Suspense>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#ff9800',
                        borderColor: '#ff9800',
                      },
                      '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: '#ff9800',
                        color: 'white',
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 280 } }}
      >
        <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                categories={availableFilterOptions.mainCategories}
                subCategories={availableFilterOptions.subCategories}
                childCategories={availableFilterOptions.childCategories}
                modelTypes={availableFilterOptions.franchiseModels}
                investmentRanges={availableFilterOptions.investmentRanges}
                locationData={{
                  states: availableFilterOptions.states,
                  districts: availableFilterOptions.districts,
                  cities: availableFilterOptions.cities,
                }}
                resultStats={{
                  showing: brands.length,
                  total: pagination.total,
                }}
                isLoading={loading || dropdownLoading}
              />
            </Suspense>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setMobileFiltersOpen(false)}
            sx={{ mt: 2, backgroundColor: "#ff9800" }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      <Suspense fallback={null}>
        <BrandComparison
          open={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
          selectedBrands={selectedForComparison}
        />
      </Suspense>

      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Container>
  );
}

export default React.memo(BrandList);

const initialFilters = {
  id: null,
  maincat: null,
  subcat: null,
  childcat: null,
  serchterm: '',
  country: null,
  state: null,
  district: null,
  city: null,
  investmentRange: null,
  modelType: null,
};
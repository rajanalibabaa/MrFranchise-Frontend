import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Badge,
  Drawer,
  IconButton,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Rating,
  Chip,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  LocationOn,
  Close,
  Description,
  FilterAlt,
  Search as SearchIcon,
  Clear as ClearIcon,
  Home,
  Store,
  AttachMoney,
  Star,
  StarBorder,
  Share,
  Business as BusinessIcon,
  AreaChart,
  Favorite,
  Repeat,
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
import LoginPage from "../LoginPage/LoginPage";
import { useLocation } from "react-router-dom";
import { Compare } from "@mui/icons-material";
import BrandComparison from "./BrandComparison";

const investmentRangeOptions = [
  { label: "All Ranges", value: "" },
  { label: "Rs.10,000-50,000", value: "Below - Rs.50 " },
  { label: "Rs.2L-5L", value: "Rs.2L-5L" },
  { label: "Rs.5L-10L", value: "Rs.5 L - 10 L" },
  { label: "Rs.10L-20L", value: "Rs.10 L - 20 L" },
  { label: "Rs.20L-30L", value: "Rs.20 L - 30 L" },
  { label: "Rs.30L-50L", value: "Rs.30 L - 50 L" },
  { label: "Rs.50L-1Cr", value: "Rs.50 L - 1 Cr" },
  { label: "Rs.1Cr-2Cr", value: "Rs.1 Cr - 2 Cr" },
  { label: "Rs.2Cr-5Cr", value: "Rs.2 Cr - 5 Cr" },
  { label: "Rs.5Cr-above", value: "Rs.5 Cr - Above" },
];
// Updated FilterPanel component
const FilterPanel = ({
  filters,
  handleFilterChange,
  handleClearFilters,
  activeFilterCount,
  availableCategories = [],
  availableSubCategories = [],
  availableChildCategories = [],
  availableModelTypes = [],
  availableStates = [],
  availableCities = [],
  filteredBrands = [],
  brands = [],
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState(
    filters.selectedCategory || ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    filters.selectedSubCategory || ""
  );
  const [selectedChildCategories, setSelectedChildCategories] = useState(
    filters.selectedChildCategories || []
  );

  // Sync local state with Redux filters
  useEffect(() => {
    setSelectedMainCategory(filters.selectedCategory || "");
    setSelectedSubCategory(filters.selectedSubCategory || "");
    setSelectedChildCategories(filters.selectedChildCategories || []);
  }, [
    filters.selectedCategory,
    filters.selectedSubCategory,
    filters.selectedChildCategories,
  ]);

  // Reset sub and child categories when main category changes
  useEffect(() => {
    if (!selectedMainCategory) {
      if (selectedSubCategory || selectedChildCategories.length > 0) {
        setSelectedSubCategory("");
        setSelectedChildCategories([]);
        handleFilterChange("selectedSubCategory", "");
        handleFilterChange("selectedChildCategories", []);
      }
    }
  }, [selectedMainCategory]);

  // Reset child categories when sub category changes
  // Reset child categories when sub category changes
  useEffect(() => {
    if (!selectedSubCategory && selectedChildCategories.length > 0) {
      setSelectedChildCategories([]);
      handleFilterChange("selectedChildCategories", []);
    }
  }, [selectedSubCategory]);

  const handleMainCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedMainCategory(value);
    handleFilterChange("selectedCategory", value);
  };

  const handleSubCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedSubCategory(value);
    handleFilterChange("selectedSubCategory", value);
  };

  const handleChildCategoryChange = (event) => {
    const { value, checked } = event.target;
    let newChildCategories = [...selectedChildCategories];

    if (checked) {
      if (!newChildCategories.includes(value)) {
        newChildCategories.push(value);
      }
    } else {
      newChildCategories = newChildCategories.filter((item) => item !== value);
    }

    setSelectedChildCategories(newChildCategories);
    handleFilterChange("selectedChildCategories", newChildCategories);
  };

  // Get filtered subcategories based on selected main category
  const getFilteredSubCategories = () => {
    if (!selectedMainCategory || !availableSubCategories) return [];
    return availableSubCategories.filter(
      (sub) => sub?.parentCategory === selectedMainCategory
    );
  };

  // Get filtered child categories based on selected sub category
  const getFilteredChildCategories = () => {
    if (!selectedSubCategory || !availableChildCategories) return [];
    return availableChildCategories.filter(
      (child) => child?.parentSubCategory === selectedSubCategory
    );
  };

  return (
    <Box sx={{ width: 280, p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Filters</Typography>
        <Button
          size="small"
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
          startIcon={<ClearIcon />}
          sx={{ color: "#ff9800" }}
        >
          Clear
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search brands..."
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
        }}
        sx={{ mb: 3 }}
      />
      {/* Main Category Radio Buttons */}
      <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
        Main Category
      </Typography>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <RadioGroup
          value={selectedMainCategory}
          onChange={handleMainCategoryChange}
        >
          <FormControlLabel
            value=""
            control={<Radio color="primary" />}
            label="All Categories"
          />
          {availableCategories.map((category) => (
            <FormControlLabel
              key={category.id}
              value={category.id}
              control={<Radio color="primary" />}
              label={category.name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Sub Category Radio Buttons (only shown when main category is selected) */}
      {selectedMainCategory && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            gutterBottom
            sx={{ color: "#4caf50", fontWeight: "bold" }}
          >
            Sub Category
          </Typography>
          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <RadioGroup
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
            >
              <FormControlLabel
                value=""
                control={<Radio color="primary" />}
                label="All Sub Categories"
              />
              {getFilteredSubCategories().map((subCategory) => (
                <FormControlLabel
                  key={subCategory.id}
                  value={subCategory.id}
                  control={<Radio color="primary" />}
                  label={subCategory.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </>
      )}

      {selectedSubCategory && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            gutterBottom
            sx={{ color: "#4caf50", fontWeight: "bold" }}
          >
            Child Categories
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: "auto" }}>
            {getFilteredChildCategories().map((childCategory) => (
              <FormControlLabel
                key={childCategory.id}
                control={
                  <Checkbox
                    checked={selectedChildCategories.includes(childCategory.id)}
                    onChange={handleChildCategoryChange}
                    value={childCategory.id}
                    color="primary"
                  />
                }
                label={childCategory.name}
                sx={{ display: "block", ml: 1 }}
              />
            ))}
          </Box>
        </>
      )}
      {/* Rest of the filters remain unchanged */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={filters.selectedModelType}
          onChange={(e) =>
            handleFilterChange("selectedModelType", e.target.value)
          }
          label="Model Type"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All Model Types</em>
          </MenuItem>
          {availableModelTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>State</InputLabel>
        <Select
          value={filters.selectedState}
          onChange={(e) => handleFilterChange("selectedState", e.target.value)}
          label="State"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All States</em>
          </MenuItem>
          {availableStates.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>City</InputLabel>
        <Select
          value={filters.selectedCity}
          onChange={(e) => handleFilterChange("selectedCity", e.target.value)}
          label="City"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All Cities</em>
          </MenuItem>
          {availableCities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom sx={{ color: "#4caf50" }}>
        Investment Range
      </Typography>
      <Select
        value={filters.selectedInvestmentRange}
        onChange={(e) =>
          handleFilterChange("selectedInvestmentRange", e.target.value)
        }
        label="Investment Range"
        sx={{
          "& .MuiSelect-icon": {
            color: "#ff9800",
          },
          width: "100%",
        }}
      >
        {investmentRangeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="body2" sx={{ color: "#4caf50", mt: 2 }}>
        Showing {filteredBrands.length} of {brands.length} brands
      </Typography>
    </Box>
  );
};

const BrandCard = ({
  brand,
  handleOpenBrand,
  toggleLike,
  showLogin,
  setShowLogin,
  isSelectedForComparison,
  toggleBrandComparison,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

const handleLikeClick = async () => {
  if (isProcessing) return;

  setIsProcessing(true);
  try {
    await toggleLike(brand.uuid, brand.isLiked);
  } catch (error) {
    console.error("Error toggling like:", error);
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <Card
      sx={{
        width: 320, // Fixed width
        height: 520, // Fixed height
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Comparison toggle button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: isSelectedForComparison
            ? "rgba(76, 175, 80, 0.9)"
            : "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            backgroundColor: isSelectedForComparison
              ? "rgba(56, 142, 60, 0.9)"
              : "rgba(0,0,0,0.7)",
          },
          width: 32,
          height: 32,
        }}
        onClick={() => toggleBrandComparison(brand)}
      >
        <Compare fontSize="small" />
      </IconButton>

      {/* Brand Logo Image */}
      <Box
        component="img"
        src={brand.brandDetails?.brandLogo}
        alt={brand.personalDetails?.brandName || "Brand logo"}
        sx={{
          objectFit: "contain",
          backgroundColor: "#f9f9f9",
          py:2,
          height: 180,
          width: "100%",
          borderBottom: "1px solid #eee",
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand Name and Like Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              pr: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {brand.personalDetails?.brandName}
          </Typography>
          <IconButton
            onClick={handleLikeClick}
            disabled={isProcessing}
            sx={{
              ml: 1,
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.1)",
              },
            }}
          >
            {isProcessing ? (
              <CircularProgress size={24} />
            ) : (
              <Favorite
                sx={{
                  color: brand.isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                  transition: "color 0.3s",
                }}
              />
            )}
          </IconButton>
        </Box>

        {/* Rating
        <Box display="flex" alignItems="center" mb={1.5}>
          <Rating
            value={4.5}
            precision={0.5}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" sx={{ color: "#ff9800" }} />}
            emptyIcon={<StarBorder fontSize="inherit" />}
          />
          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
            (24 reviews)
          </Typography>
        </Box> */}

        {/* Categories */}
        <Box sx={{ mb: 2, minHeight: 32 }}>
          {brand.personalDetails?.brandCategories
            ?.slice(0, 2)
            .map((category, index) => (
              <Chip
                key={index}
                label={category.main}
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  color: "orange.dark",
                  fontWeight: 500,
                }}
              />
            ))}
        </Box>

        {/* Details List */}
        <Box
          sx={{
            mb: 2,
            flexGrow: 1,
            "& > *:not(:last-child)": {
              mb: 1.5,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <LocationOn
              sx={{
                mr: 1.5,
                fontSize: "1rem",
                color: "text.secondary",
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap>
              <span style={{ fontWeight: 600 }}>Expansion Location:</span>
              <br/>
              {brand.personalDetails.expansionLocation?.length > 0 ? (
                <>
                  {brand.personalDetails.expansionLocation
                    .slice(0, 2) // Always show first 2 states
                    .map((loc) => loc.state)
                    .join(", ")}

                  {/* Always show "more" if there are locations (even if ≤2) */}
                  <Button
                    size="small"
                    sx={{ ml: 0.5, minWidth: 0, padding: 0 }}
                    onClick={() =>handleOpenBrand(brand)}
                  >
                    ...more
                  </Button>
                </>
              ) : (
                "Multiple locations"
              )}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AttachMoney
              sx={{
                mr: 1.5,
                fontSize: "1rem",
                color: "text.secondary",
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap>
              <span style={{ fontWeight: 600 }}>Investment Range:</span>{" "}
              {brand.franchiseDetails?.modelsOfFranchise?.[0]
                ?.investmentRange || "Not specified"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AreaChart
              sx={{
                mr: 1.5,
                color: "text.secondary",
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap>
              <span style={{ fontWeight: 600 }}>Area Required:</span>{" "}
              {brand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired
                ? `${brand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft`
                : "Not specified"}
            </Typography>
          </Box>
        </Box>

        {/* View Details Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleOpenBrand(brand)}
          startIcon={<Description />}
          sx={{
            py: 1.25,
            bgcolor: "#4caf50",
            borderRadius: 1,
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#7BC718",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            },
          }}
        >
          View Details
        </Button>
      </Box>

      {/* Login Modal */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Card>
  );
};

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
  } catch (error) {
    console.error("Like operation failed:", error);
    // You might want to show an error message to the user here
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
        <Box sx={{ width: 280 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="h6">Filters</Typography>
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
        // brand={selectedBrand}
        brand={brands}
        
      />
    </Container>
  );
}

export default BrandList;

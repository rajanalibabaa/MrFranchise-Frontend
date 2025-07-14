import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useBrands } from "../../Hooks/Fetchbrands";

// Constants moved outside component to prevent recreation
const INVESTMENT_RANGE_OPTIONS = [
  { label: "All Ranges", value: "" },
  { label: "Rs.10,000-50,000", value: "Below - Rs.50 " },
  { label: "Rs.2L-5L", value: "Rs.2L-5L" },
  { label: "Rs.5L-10L", value: "Rs.5L-10L" },
  { label: "Rs.10L-20L", value: "Rs.10L-20L" },
  { label: "Rs.20L-30L", value: "Rs.20L-30L" },
  { label: "Rs.30L-50L", value: "Rs.30L-50L" },
  { label: "Rs.50L-1Cr", value: "Rs.50L-1Cr" },
  { label: "Rs.1Cr-2Cr", value: "Rs.1Cr-2Cr" },
  { label: "Rs.2Cr-5Cr", value: "Rs.2Cr-5Cr" },
  { label: "Rs.5Cr-above", value: "Rs.5Cr-above" },
];

const FilterDropdowns = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    selectedSubCategory: "",
    selectedState: "",
    selectedInvestmentRange: ""
  });
  
  const { 
    data: brands = [], 
    isLoading, 
    error 
  } = useBrands();

  // Extract unique subcategories and states from brands data
  const { subCategories, states } = useMemo(() => {
    if (!brands || brands.length === 0) return { subCategories: [], states: [] };

    const subCategoriesSet = new Set();
    const statesSet = new Set();

    brands.forEach(brand => {
      // Process subcategories
      const subCategory = brand.franchiseDetails?.brandCategories?.sub;
      if (subCategory) subCategoriesSet.add(subCategory);
      
      // Process states
      const locations = brand.expansionLocationData?.expansionLocations?.domestic?.locations || [];
      locations.forEach(loc => {
        if (loc.state) statesSet.add(loc.state);
      });
    });

    return {
      subCategories: Array.from(subCategoriesSet).map(sub => ({ id: sub, name: sub })),
      states: Array.from(statesSet)
    };
  }, [brands]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFindBrands = useCallback(() => {
    // Only navigate when the button is clicked
    navigate("/brandviewpage", {
      state: { 
        filters,
        // Don't pre-filter here - let the destination page handle filtering
        // to avoid processing large datasets during navigation
        brands 
      },
    });
  }, [navigate, filters, brands]);

  // Show loading or error states
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error loading brands. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 4,
          p: 2,
          borderRadius: 2,
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {/* Category Filter */}
        <FormControl fullWidth sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.selectedSubCategory}
            onChange={(e) => handleFilterChange("selectedSubCategory", e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {subCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* State Filter */}
        <FormControl fullWidth sx={{ minWidth: 180 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={filters.selectedState}
            onChange={(e) => handleFilterChange("selectedState", e.target.value)}
            label="Location"
          >
            <MenuItem value="">All Locations</MenuItem>
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Investment Range Filter */}
        <FormControl fullWidth sx={{ minWidth: 180 }}>
          <InputLabel>Investment Range</InputLabel>
          <Select
            value={filters.selectedInvestmentRange}
            onChange={(e) => handleFilterChange("selectedInvestmentRange", e.target.value)}
            label="Investment Range"
          >
            {INVESTMENT_RANGE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleFindBrands}
          startIcon={<SearchIcon />}
          sx={{
            height: "56px",
            minWidth: "180px",
            backgroundColor: "#689f38",
            color: "#fafafa",
            "&:hover": {
              backgroundColor: "#558b2f",
            },
          }}
        >
          Find Brands
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(FilterDropdowns);
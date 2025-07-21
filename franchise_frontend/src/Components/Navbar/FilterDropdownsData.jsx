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

  // Memoize the extraction of unique subcategories, states, and investment ranges
  const { subCategories, states, investmentRanges } = useMemo(() => {
    if (!brands || brands.length === 0) return { subCategories: [], states: [], investmentRanges: [] };

    const subCategoriesMap = new Map();
    const statesSet = new Set();
    const investmentRangesSet = new Set();

    for (let i = 0; i < brands.length; i++) {
      const brand = brands[i];
      
      // Process subcategories
      const subCategory = brand.franchiseDetails?.brandCategories?.sub;
      if (subCategory && !subCategoriesMap.has(subCategory)) {
        subCategoriesMap.set(subCategory, { id: subCategory, name: subCategory });
      }
      
      // Process states
      const locations = brand.expansionLocationData?.expansionLocations?.domestic?.locations || [];
      for (let j = 0; j < locations.length; j++) {
        const loc = locations[j];
        if (loc.state) statesSet.add(loc.state);
      }

      // Process investment ranges
      const investmentRange = brand.franchiseDetails?.fico?.[0]?.investmentRange;
      if (investmentRange) investmentRangesSet.add(investmentRange);
    }

    return {
      subCategories: Array.from(subCategoriesMap.values()),
      states: Array.from(statesSet).sort(),
      investmentRanges: Array.from(investmentRangesSet).sort()
    };
  }, [brands]);

  // Format investment ranges for dropdown with "All Ranges" option
  const formattedInvestmentRanges = useMemo(() => {
    const ranges = [{ label: "All Ranges", value: "" }];
    
    investmentRanges.forEach(range => {
      ranges.push({
        label: range,
        value: range
      });
    });

    return ranges;
  }, [investmentRanges]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

 const handleFindBrands = useCallback(() => {
  const url = `/brandviewpage?filters=${encodeURIComponent(
    JSON.stringify(filters)
  )}`;
  window.open(url, "_blank"); // Opens in a new tab
}, [filters]);


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
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300
                }
              }
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {subCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
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
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300
                }
              }
            }}
          >
            {formattedInvestmentRanges.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300
                }
              }
            }}
          >
            <MenuItem value="">All Locations</MenuItem>
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
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
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Find Brands"}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(FilterDropdowns);
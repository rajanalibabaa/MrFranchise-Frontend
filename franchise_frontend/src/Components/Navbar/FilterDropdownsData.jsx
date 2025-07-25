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

  const { subCategories, states } = useMemo(() => {
    if (!brands || brands.length === 0) return { subCategories: [], states: [] };

    const subCategoriesMap = new Map();
    const statesSet = new Set();

    brands.forEach((brand) => {
      const subCategory = brand.franchiseDetails?.brandCategories?.sub;
      if (subCategory && !subCategoriesMap.has(subCategory)) {
        subCategoriesMap.set(subCategory, { id: subCategory, name: subCategory });
      }

      const locations = brand.expansionLocationData?.expansionLocations?.domestic?.locations || [];
      locations.forEach((loc) => {
        if (loc.state) statesSet.add(loc.state);
      });
    });

    return {
      subCategories: Array.from(subCategoriesMap.values()),
      states: Array.from(statesSet).sort(),
    };
  }, [brands]);

  const formattedInvestmentRanges = useMemo(() => {
    if (!brands || brands.length === 0) return [{ label: "All Ranges", value: "" }];

    const investmentRangesSet = new Set();

    brands.forEach((brand) => {
      const range = brand.franchiseDetails?.fico?.[0]?.investmentRange;
      if (range) investmentRangesSet.add(range);
    });

    const convertToRupees = (val) => {
      val = val.trim().replace(/Rs\.?\s*/i, "");
      if (val.includes(",")) val = val.replace(/,/g, "");

      if (val.toLowerCase().includes("cr")) {
        return parseFloat(val) * 1_00_00_000;
      } else if (val.toLowerCase().includes("l")) {
        return parseFloat(val) * 1_00_000;
      } else {
        return parseFloat(val);
      }
    };

    const getMinValue = (range) => {
      const matches = range.match(/Rs\.?\s*([\d,\.]+\s*(L|Cr|Crs)?)/gi);
      if (!matches) return Number.MAX_SAFE_INTEGER;

      const values = matches.map((m) => convertToRupees(m));
      return Math.min(...values);
    };

    const sortedFormattedRanges = Array.from(investmentRangesSet)
      .map((range) => ({
        label: range,
        value: range,
        sortValue: getMinValue(range),
      }))
      .sort((a, b) => a.sortValue - b.sortValue);

    return [{ label: "All Ranges", value: "" }, ...sortedFormattedRanges.map(({ label, value }) => ({ label, value }))];
  }, [brands]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFindBrands = useCallback(() => {
    const { selectedInvestmentRange, selectedSubCategory, selectedState } = filters;

    const filteredBrands = brands.filter((brand) => {
      const brandRange = brand.franchiseDetails?.fico?.[0]?.investmentRange || "";
      const brandSub = brand.franchiseDetails?.brandCategories?.sub || "";
      const brandStates = brand.expansionLocationData?.expansionLocations?.domestic?.locations?.map(loc => loc.state) || [];

      const matchesRange = !selectedInvestmentRange || brandRange === selectedInvestmentRange;
      const matchesSubCategory = !selectedSubCategory || brandSub === selectedSubCategory;
      const matchesState = !selectedState || brandStates.includes(selectedState);

      return matchesRange && matchesSubCategory && matchesState;
    });

    console.log("Filtered Brands:", filteredBrands); // ✅ Debug check

  
    navigate("/brandviewpage", {
      state: {
        filteredBrands,
        filters
      }
    });
  }, [brands, filters, navigate]);

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
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
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
            onChange={(e) => {
              console.log("Selected Investment Range:", e.target.value);
              handleFilterChange("selectedInvestmentRange", e.target.value);
            }}
            label="Investment Range"
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
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
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
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
            backgroundColor: "#6fff00fa",
            color: "black",
            "&:hover": {
              backgroundColor: "#7ad03a",
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

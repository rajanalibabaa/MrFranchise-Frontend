

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFilterOptions,
  resetChildCategories,
  resetDistricts,
  resetCities,
  clearErrors,
} from "../../Redux/Slices/filterDropdownData";

const FilterDropdowns = ({ onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    selectedSubCategory: "",
    selectedState: "",
    selectedInvestmentRange: "",
  });

  // Get filter data from Redux store
  const {
    subCategories,
    states,
    investmentRanges,
    loading,
    error,
  } = useSelector((state) => state.filterDropdown);

  // Fetch initial filter options when component mounts
  useEffect(() => {
    dispatch(fetchFilterOptions());
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (name, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };

        // Reset dependent filters when parent changes
        if (name === "selectedSubCategory") {
          newFilters.selectedState = "";
          newFilters.selectedDistrict = "";
          newFilters.selectedCity = "";
        } else if (name === "selectedState") {
          newFilters.selectedDistrict = "";
          newFilters.selectedCity = "";
        }

        return newFilters;
      });

      // Fetch dependent data if needed
      if (name === "selectedSubCategory" && value) {
        dispatch(fetchFilterOptions({ sub: value }));
      } else if (name === "selectedState" && value) {
        dispatch(fetchFilterOptions({ state: value }));
      }

      // Call the parent component's filter change handler if provided
      if (onFilterChange) {
        if (name === "selectedSubCategory") {
          onFilterChange("subcat", value);
        } else if (name === "selectedState") {
          onFilterChange("state", value);
        } else if (name === "selectedInvestmentRange") {
          onFilterChange("investmentRange", value);
        }
      }
    },
    [dispatch, onFilterChange]
  );

  // Format investment ranges for display
  const formattedInvestmentRanges = useMemo(() => {
    if (!investmentRanges || investmentRanges.length === 0) {
      return [{ label: "All Ranges", value: "" }];
    }

    const convertToRupees = (val) => {
      if (!val) return 0;
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

    const sortedRanges = [...investmentRanges]
      .map((range) => ({
        label: range,
        value: range,
        sortValue: getMinValue(range),
      }))
      .sort((a, b) => a.sortValue - b.sortValue);

    return [
      { label: "All Ranges", value: "" },
      ...sortedRanges.map(({ label, value }) => ({ label, value })),
    ];
  }, [investmentRanges]);

  // Handle search button click
// In your FilterDropdowns component
const handleFindBrands = useCallback(() => {
  const queryParams = new URLSearchParams();
  
  if (filters.selectedSubCategory) {
    queryParams.append("subcat", filters.selectedSubCategory);
  }
  if (filters.selectedInvestmentRange) {
    queryParams.append("investmentRange", filters.selectedInvestmentRange);
  }
  if (filters.selectedState) {
    queryParams.append("state", filters.selectedState);
  }

  navigate(`/brands?${queryParams.toString()}`);
}, [filters, navigate]);


  if (loading && !subCategories.length && !states.length) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error loading filter options: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
        mb: 4,
        p: 3,
        borderRadius: 2,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        boxShadow: 1,
      }}
    >
      {/* Category Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.selectedSubCategory}
          onChange={(e) =>
            handleFilterChange("selectedSubCategory", e.target.value)
          }
          label="Category"
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {subCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Investment Range Filter */}
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Investment Range</InputLabel>
        <Select
          value={filters.selectedInvestmentRange}
          onChange={(e) =>
            handleFilterChange("selectedInvestmentRange", e.target.value)
          }
          label="Investment Range"
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
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
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
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
          minWidth: isMobile ? "100%" : "180px",
          backgroundColor: "#ff9800",
          color: "white",
          "&:hover": {
            backgroundColor: "#fb8c00",
          },
          borderRadius: 1,
          boxShadow: "none",
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Find Brands"}
      </Button>
    </Box>
  );
};

export default React.memo(FilterDropdowns);

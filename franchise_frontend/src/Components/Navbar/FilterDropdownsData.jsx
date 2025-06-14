import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters,fetchBrands } from "../../Redux/Slices/brandSlice";
import { hideLoading, showLoading } from "../../Redux/Slices/loadingSlice";

const investmentRangeOptions = [
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
  const dispatch = useDispatch();
  const {
    categories = [],
    states = [],
    filters,
    loading,
  } = useSelector((state) => state.brands);

  useEffect(()=>{
dispatch(fetchBrands());
  },[])

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };

  const handleFindBrands = () => {
    dispatch(showLoading());
    navigate("/brandviewpage", {
      state: { filters }, // Pass current filters to the next page
    });
setTimeout(() => {
  dispatch(hideLoading());
}, 2000);
  };

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
        {/* Category Filter - Updated to match your data structure */}
        <FormControl fullWidth sx={{ minWidth: 180, }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.selectedCategory || ""}
            onChange={(e) =>
              handleFilterChange("selectedCategory", e.target.value)
            }
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
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
            value={filters.selectedState || ""}
            onChange={(e) =>
              handleFilterChange("selectedState", e.target.value)
            }
            label="Location"
          >
            <MenuItem value="">All Locations</MenuItem>
            {states.map((state, idx) => (
              <MenuItem key={idx} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Investment Range Filter */}
        <FormControl fullWidth sx={{ minWidth: 180 }}>
          <InputLabel>Investment Range</InputLabel>
          <Select
            value={filters.selectedInvestmentRange || ""}
            onChange={(e) =>
              handleFilterChange("selectedInvestmentRange", e.target.value)
            }
            label="Investment Range"
          >
            {investmentRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled={loading}
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
          {loading ? <CircularProgress size={24} /> : "Find Brands"}
        </Button>
      </Box>
    </Box>
  );
};

export default FilterDropdowns;
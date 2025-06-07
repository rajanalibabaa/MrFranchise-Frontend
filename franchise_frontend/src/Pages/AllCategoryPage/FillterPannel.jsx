import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";

// Investment range options (should be defined or imported)
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
    <Box
      sx={{
        width: 280,
        pr: 2,
        position: { md: "fixed" },
        height: { md: "calc(90vh - 32px)" },
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#ff9800",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#fb8c00",
        },
      }}
    >
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
          <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
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
          <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
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

      {/* Model Type Select */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={filters.selectedModelType}
          onChange={(e) => handleFilterChange("selectedModelType", e.target.value)}
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

      {/* State Select */}
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

      {/* City Select */}
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

      {/* Investment Range */}
      <Typography gutterBottom sx={{ color: "#4caf50"  }}>
        Investment Range
      </Typography>
      <Select
        value={filters.selectedInvestmentRange}
        onChange={(e) => handleFilterChange("selectedInvestmentRange", e.target.value)}
        label="Investment Range"
        sx={{
          "& .MuiSelect-icon": {
            color: "#ff9800",
          },
          width: "100%",
          mb: 3
        }}
      >
        {investmentRangeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="body2" sx={{ color: "#4caf50" }}>
        Showing {filteredBrands.length} of {brands.length} brands
      </Typography>
    </Box>
  );
};

export default FilterPanel;
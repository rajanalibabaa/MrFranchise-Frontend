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

const FilterPanel = ({
  filters,
  handleFilterChange,
  handleClearFilters,
  activeFilterCount,
  availableSubCategories = [],
  availableChildCategories = [],
  availableModelTypes = [],
  availableStates = [],
  availableDistricts = [],
  availableCities = [],
  availableInvestmentRanges = [],
  filteredBrands = [],
  brands = [],
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    filters.selectedSubCategory || ""
  );
  const [selectedChildCategories, setSelectedChildCategories] = useState(
    filters.selectedChildCategory || []
  );
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredChildCategories, setFilteredChildCategories] = useState([]);

  // Sync local state with Redux filters
  useEffect(() => {
    setSelectedSubCategory(filters.selectedSubCategory || "");
    setSelectedChildCategories(filters.selectedChildCategory || []);
  }, [
    filters.selectedSubCategory,
    filters.selectedChildCategory,
  ]);

  // Filter child categories based on selected sub category
  useEffect(() => {
    if (selectedSubCategory) {
      const children = availableChildCategories.filter(
        (child) => child?.parentSubCategory === selectedSubCategory
      );
      setFilteredChildCategories(children);
    } else {
      setFilteredChildCategories([]);
    }
  }, [selectedSubCategory, availableChildCategories]);

  // Filter districts based on selected state
  useEffect(() => {
    if (filters.selectedState) {
      const districtsForState = availableDistricts.filter(
        (district) => district.state === filters.selectedState
      );
      setFilteredDistricts(districtsForState);
    } else {
      setFilteredDistricts(availableDistricts);
    }
  }, [filters.selectedState, availableDistricts]);

  // Filter cities based on selected district
  useEffect(() => {
    if (filters.selectedDistrict) {
      const citiesForDistrict = availableCities.filter(
        (city) => city.district === filters.selectedDistrict
      );
      setFilteredCities(citiesForDistrict);
    } else {
      setFilteredCities(availableCities);
    }
  }, [filters.selectedDistrict, availableCities]);

  const handleSubCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedSubCategory(value);
    setSelectedChildCategories([]);
    handleFilterChange("selectedSubCategory", value);
    handleFilterChange("selectedChildCategory", []);
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
    handleFilterChange("selectedChildCategory", newChildCategories);
  };

  return (
    <Box
      sx={{
        pr: 2,
        height: "calc(100vh - 120px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "lightgrey",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#fb8c00",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
      
      {/* Sub Category Radio Buttons */}
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
          {availableSubCategories.map((subCategory) => (
            <FormControlLabel
              key={subCategory.id}
              value={subCategory.id}
              control={<Radio color="primary" />}
              label={subCategory.name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Child Categories Checkboxes */}
      {selectedSubCategory && filteredChildCategories.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
            Child Categories
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: "auto" }}>
            {filteredChildCategories.map((childCategory) => (
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
      <Divider sx={{ my: 2 }} />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={filters.selectedModelType || ""}
          onChange={(e) => handleFilterChange("selectedModelType", e.target.value)}
          label="Model Type"
        >
          <MenuItem value="">All Model Types</MenuItem>
          {availableModelTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Location Filters */}
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
        Location
      </Typography>
      
      {/* State Select */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>State</InputLabel>
        <Select
          value={filters.selectedState || ""}
          onChange={(e) => {
            handleFilterChange("selectedState", e.target.value);
            handleFilterChange("selectedDistrict", "");
            handleFilterChange("selectedCity", "");
          }}
          label="State"
        >
          <MenuItem value="">All States</MenuItem>
          {availableStates.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* District Select */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>District</InputLabel>
        <Select
          value={filters.selectedDistrict || ""}
          onChange={(e) => {
            handleFilterChange("selectedDistrict", e.target.value);
            handleFilterChange("selectedCity", "");
          }}
          label="District"
          disabled={!filters.selectedState}
        >
          <MenuItem value="">All Districts</MenuItem>
          {filteredDistricts.map((district) => (
            <MenuItem key={district.district} value={district.district}>
              {district.district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* City Select */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>City</InputLabel>
        <Select
          value={filters.selectedCity || ""}
          onChange={(e) => handleFilterChange("selectedCity", e.target.value)}
          label="City"
          disabled={!filters.selectedDistrict}
        >
          <MenuItem value="">All Cities</MenuItem>
          {filteredCities.map((city) => (
            <MenuItem key={city.city} value={city.city}>
              {city.city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Investment Range */}
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
        Investment Range
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Investment Range</InputLabel>
        <Select
          value={filters.selectedInvestmentRange || ""}
          onChange={(e) => handleFilterChange("selectedInvestmentRange", e.target.value)}
          label="Investment Range"
        >
          <MenuItem value="">All Ranges</MenuItem>
          {availableInvestmentRanges.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Results Count */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ color: "#4caf50", textAlign: "center" }}>
        Showing {filteredBrands.length} of {brands.length} brands
      </Typography>
    </Box>
  );
};

export default FilterPanel;
import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
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
  InputAdornment,
  CircularProgress,
  Skeleton
} from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";

// Lazy load heavy components
// const LazySelect = React.lazy(() => import('LazySelect'));
// <Suspense fallback={<div>Loading...</div>}>
//   <LazySelect {...props} />
// </Suspense>

const FilterPanel = React.memo(({
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
  isLoading = false
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(filters.selectedSubCategory || "");
  const [selectedChildCategories, setSelectedChildCategories] = useState(filters.selectedChildCategory || []);
  const [searchTermState, setSearchTermState] = useState("");
  const [searchTermDistrict, setSearchTermDistrict] = useState("");
  const [searchTermCity, setSearchTermCity] = useState("");
  const [searchTermSubCategory, setSearchTermSubCategory] = useState("");
  const [searchTermModelType, setSearchTermModelType] = useState("");
  const [searchTermInvestmentRange, setSearchTermInvestmentRange] = useState("");

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredChildCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    return availableChildCategories.filter(
      (child) => child?.parentSubCategory === selectedSubCategory
    );
  }, [selectedSubCategory, availableChildCategories]);

  const filteredDistricts = useMemo(() => {
    if (!filters.selectedState) return availableDistricts;
    return availableDistricts.filter(
      (district) => district.state === filters.selectedState
    );
  }, [filters.selectedState, availableDistricts]);

  const filteredCities = useMemo(() => {
    if (!filters.selectedDistrict) return availableCities;
    return availableCities.filter(
      (city) => city.district === filters.selectedDistrict
    );
  }, [filters.selectedDistrict, availableCities]);

  const filteredStates = useMemo(() => {
    if (!searchTermState) return availableStates;
    const term = searchTermState.toLowerCase();
    return availableStates.filter(state => 
      state.toLowerCase().includes(term)
    );
  }, [searchTermState, availableStates]);

  const filteredDistrictsForSearch = useMemo(() => {
    if (!searchTermDistrict) return filteredDistricts;
    const term = searchTermDistrict.toLowerCase();
    return filteredDistricts.filter(district => 
      district.district.toLowerCase().includes(term)
    );
  }, [searchTermDistrict, filteredDistricts]);

  const filteredCitiesForSearch = useMemo(() => {
    if (!searchTermCity) return filteredCities;
    const term = searchTermCity.toLowerCase();
    return filteredCities.filter(city => 
      city.city.toLowerCase().includes(term)
    );
  }, [searchTermCity, filteredCities]);

  const filteredSubCategories = useMemo(() => {
    if (!searchTermSubCategory) return availableSubCategories;
    const term = searchTermSubCategory.toLowerCase();
    return availableSubCategories.filter(sub => 
      sub.name.toLowerCase().includes(term)
    );
  }, [searchTermSubCategory, availableSubCategories]);

  const filteredModelTypes = useMemo(() => {
    if (!searchTermModelType) return availableModelTypes;
    const term = searchTermModelType.toLowerCase();
    return availableModelTypes.filter(type => 
      type.toLowerCase().includes(term)
    );
  }, [searchTermModelType, availableModelTypes]);

  const filteredInvestmentRanges = useMemo(() => {
    if (!searchTermInvestmentRange) return availableInvestmentRanges;
    const term = searchTermInvestmentRange.toLowerCase();
    return availableInvestmentRanges.filter(range => 
      range.toLowerCase().includes(term)
    );
  }, [searchTermInvestmentRange, availableInvestmentRanges]);

  // Event handlers with useCallback to prevent unnecessary recreations
  const handleSubCategoryChange = useCallback((event) => {
    const value = event.target.value;
    setSelectedSubCategory(value);
    setSelectedChildCategories([]);
    handleFilterChange("selectedSubCategory", value);
    handleFilterChange("selectedChildCategory", []);
  }, [handleFilterChange]);

  const handleChildCategoryChange = useCallback((event) => {
    const { value, checked } = event.target;
    setSelectedChildCategories(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  }, []);

  // Sync child categories with filter change
  useEffect(() => {
    handleFilterChange("selectedChildCategory", selectedChildCategories);
  }, [selectedChildCategories, handleFilterChange]);

  // Sync local state with Redux filters
  useEffect(() => {
    setSelectedSubCategory(filters.selectedSubCategory || "");
    setSelectedChildCategories(filters.selectedChildCategory || []);
  }, [filters.selectedSubCategory, filters.selectedChildCategory]);

  // Loading skeleton for better UX
  if (isLoading) {
    return (
      <Box sx={{ pr: 2 }}>
        {Array(6).fill().map((_, i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="rectangular" height={56} />
          </Box>
        ))}
      </Box>
    );
  }

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
      
      {/* Sub Category Radio Buttons with Search */}
      <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
        Sub Category
      </Typography>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search sub categories..."
          value={searchTermSubCategory}
          onChange={(e) => setSearchTermSubCategory(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        <RadioGroup
          value={selectedSubCategory}
          onChange={handleSubCategoryChange}
        >
          <FormControlLabel
            value=""
            control={<Radio color="primary" />}
            label="All Sub Categories"
            key="all-sub-categories"
          />
          <Suspense fallback={<CircularProgress size={20} />}>
            {filteredSubCategories.map((subCategory) => (
              <FormControlLabel
                key={`subcat-${subCategory.id} || ${subCategory.name}`}
                value={subCategory.id}
                control={<Radio color="primary" />}
                label={subCategory.name}
              />
            ))}
          </Suspense>
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
            <Suspense fallback={<CircularProgress size={20} />}>
              {filteredChildCategories.map((childCategory) => (
                <FormControlLabel
                  key={`childcat-${childCategory.id}`}
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
            </Suspense>
          </Box>
        </>
      )}

      {/* Model Type Select with Search */}
      <Divider sx={{ my: 2 }} />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={filters.selectedModelType || ""}
          onChange={(e) => handleFilterChange("selectedModelType", e.target.value)}
          label="Model Type"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">All Model Types</MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search model types..."
              value={searchTermModelType}
              onChange={(e) => setSearchTermModelType(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Suspense fallback={<CircularProgress size={20} />}>
            {filteredModelTypes.map((type) => (
              <MenuItem key={`modeltype-${type}`} value={type}>
    {type}
  </MenuItem>
            ))}
          </Suspense>
        </Select>
      </FormControl>

      {/* Location Filters */}
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom sx={{ color: "#4caf50", fontWeight: "bold" }}>
        Location
      </Typography>
      
      {/* State Select with Search */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>State</InputLabel>
        <Select
          value={filters.selectedState || ""}
          onChange={(e) => {
            handleFilterChange("selectedState", e.target.value);
            handleFilterChange("selectedDistrict", "");
            handleFilterChange("selectedCity", "");
            setSearchTermDistrict("");
            setSearchTermCity("");
          }}
          label="State"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">
            {/* <em>All States</em> */}
          </MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search states..."
              value={searchTermState}
              onChange={(e) => setSearchTermState(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Suspense fallback={<CircularProgress size={20} />}>
            {filteredStates.map((state) => (
               <MenuItem key={`state-${state}`} value={state}>
    {state}
  </MenuItem>
            ))}
          </Suspense>
        </Select>
      </FormControl>

      {/* District Select with Search */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>District</InputLabel>
        <Select
          value={filters.selectedDistrict || ""}
          onChange={(e) => {
            handleFilterChange("selectedDistrict", e.target.value);
            handleFilterChange("selectedCity", "");
            setSearchTermCity("");
          }}
          label="District"
          disabled={!filters.selectedState}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">
            {/* <em>All Districts</em> */}
          </MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search districts..."
              value={searchTermDistrict}
              onChange={(e) => setSearchTermDistrict(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Suspense fallback={<CircularProgress size={20} />}>
            {filteredDistrictsForSearch.map((district) => (
           <MenuItem 
    key={`district-${district.state}-${district.district}`}
    value={district.district}
  >
    {district.district}
  </MenuItem>
            ))}
          </Suspense>
        </Select>
      </FormControl>

      {/* City Select with Search */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>City</InputLabel>
        <Select
          value={filters.selectedCity || ""}
          onChange={(e) => handleFilterChange("selectedCity", e.target.value)}
          label="City"
          disabled={!filters.selectedDistrict}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">
            {/* <em>All Cities</em> */}
          </MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search cities..."
              value={searchTermCity}
              onChange={(e) => setSearchTermCity(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Suspense fallback={<CircularProgress size={20} />}>
            {filteredCitiesForSearch.map((city) => (
              <MenuItem 
    key={`city-${city.district}-${city.city}`}
    value={city.city}
  >
    {city.city}
  </MenuItem>
            ))}
          </Suspense>
        </Select>
      </FormControl>

      {/* Investment Range with Search */}
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
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">All Ranges</MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search investment ranges..."
              value={searchTermInvestmentRange}
              onChange={(e) => setSearchTermInvestmentRange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Suspense fallback={<CircularProgress size={20} />}>
            {filteredInvestmentRanges.map((range) => (
              <MenuItem key={`range-${range}`} value={range}>
    {range}
  </MenuItem>
            ))}
          </Suspense>
        </Select>
      </FormControl>

      {/* Results Count */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ color: "#4caf50", textAlign: "center" }}>
        Showing {filteredBrands.length} of {brands.length} brands
      </Typography>
    </Box>
  );
});

export default FilterPanel;
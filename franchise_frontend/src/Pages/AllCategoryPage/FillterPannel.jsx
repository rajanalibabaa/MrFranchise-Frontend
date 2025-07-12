import React, { useState, useMemo, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

const FilterPanel = React.memo(({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
  categories = [],
  subCategories = [],
  childCategories = [],
  modelTypes = [],
  investmentRanges = [],
  locationData = {},
  resultStats = {},
  isLoading = false
}) => {
  const [searchTerms, setSearchTerms] = useState({
    subCategory: '',
    modelType: '',
    investmentRange: '',
    state: '',
    district: '',
    city: ''
  });

  // Memoized filtered options
  const filteredSubCategories = useMemo(() => {
    const term = searchTerms.subCategory.toLowerCase();
    return subCategories.filter(sub => 
      sub.toLowerCase().includes(term)
    );
  }, [subCategories, searchTerms.subCategory]);

  const filteredModelTypes = useMemo(() => {
    const term = searchTerms.modelType.toLowerCase();
    return modelTypes.filter(type => 
      type.toLowerCase().includes(term)
    );
  }, [modelTypes, searchTerms.modelType]);

  const filteredInvestmentRanges = useMemo(() => {
    const term = searchTerms.investmentRange.toLowerCase();
    return investmentRanges.filter(range => 
      range.toLowerCase().includes(term)
    );
  }, [investmentRanges, searchTerms.investmentRange]);

  const filteredStates = useMemo(() => {
    const term = searchTerms.state.toLowerCase();
    return locationData.states?.filter(state => 
      state.toLowerCase().includes(term)
    ) || [];
  }, [locationData.states, searchTerms.state]);

  const filteredDistricts = useMemo(() => {
    if (!filters.selectedState) return locationData.districts || [];
    const term = searchTerms.district.toLowerCase();
    return locationData.districts.filter(d => 
      d.state === filters.selectedState && 
      d.district.toLowerCase().includes(term)
    );
  }, [filters.selectedState, locationData.districts, searchTerms.district]);

  const filteredCities = useMemo(() => {
    if (!filters.selectedDistrict) return locationData.cities || [];
    const term = searchTerms.city.toLowerCase();
    return locationData.cities.filter(c => 
      c.district === filters.selectedDistrict && 
      c.city.toLowerCase().includes(term)
    );
  }, [filters.selectedDistrict, locationData.cities, searchTerms.city]);

  const handleSearchChange = (field, value) => {
    setSearchTerms(prev => ({ ...prev, [field]: value }));
  };

  const handleSubCategoryChange = (value) => {
    onFilterChange('selectedSubCategory', value);
    onFilterChange('selectedChildCategory', []);
  };

  const handleChildCategoryToggle = (value, checked) => {
    const newSelection = checked
      ? [...(filters.selectedChildCategory || []), value]
      : (filters.selectedChildCategory || []).filter(item => item !== value);
    onFilterChange('selectedChildCategory', newSelection);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(6)].map((_, i) => (
          <Box key={`skeleton-${i}`} sx={{ mb: 3 }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="rectangular" height={56} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ pr: 2, height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <Button
          size="small"
          onClick={onClearFilters}
          disabled={activeFilterCount === 0}
          startIcon={<ClearIcon />}
          sx={{ color: '#ff9800' }}
        >
          Clear
        </Button>
      </Box>

      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search brands..."
        value={filters.searchTerm || ''}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: '#ff9800' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Sub Category Filter */}
      <Typography gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
        Sub Category
      </Typography>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Search sub categories..."
        value={searchTerms.subCategory}
        onChange={(e) => handleSearchChange('subCategory', e.target.value)}
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
        value={filters.selectedSubCategory || ''}
        onChange={(e) => handleSubCategoryChange(e.target.value)}
      >
        <FormControlLabel
          value=""
          control={<Radio color="primary" />}
          label="All Sub Categories"
        />
        {filteredSubCategories.map((subCategory) => (
          <FormControlLabel
            key={`subcat-${subCategory}`}
            value={subCategory}
            control={<Radio color="primary" />}
            label={subCategory}
          />
        ))}
      </RadioGroup>

      {/* Child Categories (only shown when a subcategory is selected) */}
      {filters.selectedSubCategory && childCategories.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Child Categories
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {childCategories
              .filter(child => child.parentSubCategory === filters.selectedSubCategory)
              .map((childCategory) => (
                <FormControlLabel
                  key={`childcat-${childCategory.id}`}
                  control={
                    <Checkbox
                      checked={(filters.selectedChildCategory || []).includes(childCategory.id)}
                      onChange={(e) => handleChildCategoryToggle(childCategory.id, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={childCategory.name}
                  sx={{ display: 'block', ml: 1 }}
                />
              ))}
          </Box>
        </>
      )}

      {/* Model Type Filter */}
      <Divider sx={{ my: 2 }} />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={filters.selectedModelType || ''}
          onChange={(e) => onFilterChange('selectedModelType', e.target.value)}
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
              value={searchTerms.modelType}
              onChange={(e) => handleSearchChange('modelType', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {filteredModelTypes.map((type) => (
            <MenuItem key={`modeltype-${type}`} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Location Filters */}
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
        Location
      </Typography>
      
      {/* State Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>State</InputLabel>
        <Select
          value={filters.selectedState || ''}
          onChange={(e) => onFilterChange('selectedState', e.target.value)}
          label="State"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="">All States</MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search states..."
              value={searchTerms.state}
              onChange={(e) => handleSearchChange('state', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {filteredStates.map((state) => (
            <MenuItem key={`state-${state}`} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* District Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>District</InputLabel>
        <Select
          value={filters.selectedDistrict || ''}
          onChange={(e) => onFilterChange('selectedDistrict', e.target.value)}
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
          <MenuItem value="">All Districts</MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search districts..."
              value={searchTerms.district}
              onChange={(e) => handleSearchChange('district', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {filteredDistricts.map((district) => (
            <MenuItem 
              key={`district-${district.state}-${district.district}`}
              value={district.district}
            >
              {district.district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* City Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>City</InputLabel>
        <Select
          value={filters.selectedCity || ''}
          onChange={(e) => onFilterChange('selectedCity', e.target.value)}
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
          <MenuItem value="">All Cities</MenuItem>
          <Box px={2} pb={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search cities..."
              value={searchTerms.city}
              onChange={(e) => handleSearchChange('city', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {filteredCities.map((city) => (
            <MenuItem 
              key={`city-${city.district}-${city.city}`}
              value={city.city}
            >
              {city.city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Investment Range Filter */}
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
        Investment Range
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Investment Range</InputLabel>
        <Select
          value={filters.selectedInvestmentRange || ''}
          onChange={(e) => onFilterChange('selectedInvestmentRange', e.target.value)}
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
              value={searchTerms.investmentRange}
              onChange={(e) => handleSearchChange('investmentRange', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {filteredInvestmentRanges.map((range) => (
            <MenuItem key={`range-${range}`} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Results Count */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ color: '#4caf50', textAlign: 'center' }}>
        Showing {resultStats.showing} of {resultStats.total} brands
      </Typography>
    </Box>
  );
});

export default FilterPanel;
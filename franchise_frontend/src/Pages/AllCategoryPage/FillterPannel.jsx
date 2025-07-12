import React, { useState, useMemo, useCallback } from 'react';
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
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// Memoized MenuItem to prevent unnecessary re-renders
const MemoizedMenuItem = React.memo(({ value, children }) => (
  <MenuItem value={value}>{children}</MenuItem>
));

// Memoized FormControlLabel for checkboxes
const MemoizedCheckboxLabel = React.memo(({ id, label, checked, onChange }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={checked}
        onChange={onChange}
        color="primary"
      />
    }
    label={label}
    sx={{ display: 'block', ml: 1 }}
  />
));

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
  locationData = { states: [], districts: [], cities: [] },
  resultStats = { showing: 0, total: 0 },
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

  const [expandedSections, setExpandedSections] = useState({
    subCategory: true,
    childCategory: true,
    modelType: true,
    location: true,
    investment: true
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Debounce search terms with useMemo to prevent unnecessary state updates
  const debouncedSearchTerms = useMemo(() => {
    const debounced = {};
    Object.keys(searchTerms).forEach(key => {
      debounced[key] = searchTerms[key];
    });
    return debounced;
  }, [searchTerms]);

  // Memoized filtered options with proper null checks
  const filteredSubCategories = useMemo(() => {
    const term = debouncedSearchTerms.subCategory.toLowerCase();
    return subCategories
      .filter(sub => sub.toLowerCase().includes(term))
      .slice(0, 100);
  }, [subCategories, debouncedSearchTerms.subCategory]);

  const filteredModelTypes = useMemo(() => {
    const term = debouncedSearchTerms.modelType.toLowerCase();
    return modelTypes
      .filter(type => type.toLowerCase().includes(term))
      .slice(0, 100);
  }, [modelTypes, debouncedSearchTerms.modelType]);

  const filteredInvestmentRanges = useMemo(() => {
    const term = debouncedSearchTerms.investmentRange.toLowerCase();
    return investmentRanges.filter(range => 
      range.toLowerCase().includes(term))
      .slice(0, 50);
  }, [investmentRanges, debouncedSearchTerms.investmentRange]);

  const filteredStates = useMemo(() => {
    const term = debouncedSearchTerms.state.toLowerCase();
    return (locationData.states || []).filter(state => 
      state.toLowerCase().includes(term))
      .slice(0, 100);
  }, [locationData.states, debouncedSearchTerms.state]);

  const filteredDistricts = useMemo(() => {
    if (!filters.selectedState) return [];
    const term = debouncedSearchTerms.district.toLowerCase();
    return (locationData.districts || [])
      .filter(d => d.state === filters.selectedState)
      .filter(d => d.district.toLowerCase().includes(term))
      .slice(0, 100);
  }, [filters.selectedState, locationData.districts, debouncedSearchTerms.district]);

  const filteredCities = useMemo(() => {
    if (!filters.selectedDistrict) return [];
    const term = debouncedSearchTerms.city.toLowerCase();
    return (locationData.cities || [])
      .filter(c => c.district === filters.selectedDistrict)
      .filter(c => c.city.toLowerCase().includes(term))
      .slice(0, 100);
  }, [filters.selectedDistrict, locationData.cities, debouncedSearchTerms.city]);

  // Memoized child categories for the selected subcategory
  const filteredChildCategories = useMemo(() => {
    if (!filters.selectedSubCategory) return [];
    return (childCategories || []).filter(
      child => child.parentSubCategory === filters.selectedSubCategory
    ).slice(0, 50);
  }, [childCategories, filters.selectedSubCategory]);

  // Stable callback handlers
  const handleSearchChange = useCallback((field, value) => {
    setSearchTerms(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubCategoryChange = useCallback((value) => {
    onFilterChange('selectedSubCategory', value);
    onFilterChange('selectedChildCategory', []);
  }, [onFilterChange]);

  const handleChildCategoryToggle = useCallback((value) => (e) => {
    const checked = e.target.checked;
    const newSelection = checked
      ? [...(filters.selectedChildCategory || []), value]
      : (filters.selectedChildCategory || []).filter(item => item !== value);
    onFilterChange('selectedChildCategory', newSelection);
  }, [filters.selectedChildCategory, onFilterChange]);

  // Generic select change handler
  const handleSelectChange = useCallback((field) => (e) => {
    // For location hierarchy, clear dependent fields when parent changes
    if (field === 'selectedState') {
      onFilterChange('selectedDistrict', '');
      onFilterChange('selectedCity', '');
    } else if (field === 'selectedDistrict') {
      onFilterChange('selectedCity', '');
    }
    onFilterChange(field, e.target.value);
  }, [onFilterChange]);

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
      <Accordion 
        expanded={expandedSections.subCategory}
        onChange={() => toggleSection('subCategory')}
        disableGutters
        elevation={0}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Sub Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

      {/* Child Categories (only shown when a subcategory is selected) */}
      {filters.selectedSubCategory && filteredChildCategories.length > 0 && (
        <Accordion 
          expanded={expandedSections.childCategory}
          onChange={() => toggleSection('childCategory')}
          disableGutters
          elevation={0}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              Child Categories
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {filteredChildCategories.map((childCategory) => (
                <MemoizedCheckboxLabel
                  key={`childcat-${childCategory.id}`}
                  id={childCategory.id}
                  label={childCategory.name}
                  checked={(filters.selectedChildCategory || []).includes(childCategory.id)}
                  onChange={handleChildCategoryToggle(childCategory.id)}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Model Type Filter */}
      <Accordion 
        expanded={expandedSections.modelType}
        onChange={() => toggleSection('modelType')}
        disableGutters
        elevation={0}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Model Type
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Model Type</InputLabel>
            <Select
              value={filters.selectedModelType || ''}
              onChange={handleSelectChange('selectedModelType')}
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
                <MemoizedMenuItem key={`modeltype-${type}`} value={type}>
                  {type}
                </MemoizedMenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Location Filters */}
      <Accordion 
        expanded={expandedSections.location}
        onChange={() => toggleSection('location')}
        disableGutters
        elevation={0}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Location
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* State Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>State</InputLabel>
            <Select
              value={filters.selectedState || ''}
              onChange={handleSelectChange('selectedState')}
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
                <MemoizedMenuItem key={`state-${state}`} value={state}>
                  {state}
                </MemoizedMenuItem>
              ))}
            </Select>
          </FormControl>

          {/* District Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>District</InputLabel>
            <Select
              value={filters.selectedDistrict || ''}
              onChange={handleSelectChange('selectedDistrict')}
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
              {filteredDistricts.map((district, index) => (
                <MemoizedMenuItem 
                  key={`district-${index}`}
                  value={district.district}
                >
                  {district.district}
                </MemoizedMenuItem>
              ))}
            </Select>
          </FormControl>

          {/* City Filter */}
          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select
              value={filters.selectedCity || ''}
              onChange={handleSelectChange('selectedCity')}
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
              {filteredCities.map((city, index) => (
                <MemoizedMenuItem 
                  key={`city-${index}`}
                  value={city.city}
                >
                  {city.city}
                </MemoizedMenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Investment Range Filter */}
      <Accordion 
        expanded={expandedSections.investment}
        onChange={() => toggleSection('investment')}
        disableGutters
        elevation={0}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Investment Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={filters.selectedInvestmentRange || ''}
              onChange={handleSelectChange('selectedInvestmentRange')}
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
                <MemoizedMenuItem key={`range-${range}`} value={range}>
                  {range}
                </MemoizedMenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Results Count */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ color: '#4caf50', textAlign: 'center' }}>
        Showing {resultStats.showing || 0} of {resultStats.total || 0} brands
      </Typography>
    </Box>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.filters === nextProps.filters &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.activeFilterCount === nextProps.activeFilterCount &&
    prevProps.resultStats.showing === nextProps.resultStats.showing &&
    prevProps.resultStats.total === nextProps.resultStats.total &&
    prevProps.subCategories === nextProps.subCategories &&
    prevProps.childCategories === nextProps.childCategories &&
    prevProps.modelTypes === nextProps.modelTypes &&
    prevProps.investmentRanges === nextProps.investmentRanges &&
    prevProps.locationData.states === nextProps.locationData.states &&
    prevProps.locationData.districts === nextProps.locationData.districts &&
    prevProps.locationData.cities === nextProps.locationData.cities
  );
});

export default FilterPanel;
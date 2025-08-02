
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  FormControl,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { fetchFilterOptions } from '../../Redux/Slices/filterDropdownData';
import { setFilter, resetFilters } from '../../Redux/Slices/FilterBrandSlice';

const highlightMatch = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    part.toLowerCase() === searchTerm.toLowerCase() ? 
    <span key={index} style={{ fontWeight: 'bold', backgroundColor: 'yellow' }}>{part}</span> : 
    part
  );
};

const NavbarSearch = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter options from Redux
  const filterOptions = useSelector(state => state.filterDropdown);
  const {
    mainCategories = [],
    subCategories = [],
    childCategories = [],
    investmentRanges = [],
    states = [],
    districts = [],
    cities = [],
    loading: dropdownLoading
  } = filterOptions;

  // Selected filters
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedChildCategory, setSelectedChildCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState('');

  // Search terms for filter dropdowns
  const [searchTerms, setSearchTerms] = useState({
    state: '',
    district: '',
    city: '',
    investment: ''
  });

  // Fetch initial filter options when component mounts
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Fetch sub-categories when main category is selected
  useEffect(() => {
    if (selectedMainCategory) {
      dispatch(fetchFilterOptions({ main: selectedMainCategory }));
    }
  }, [selectedMainCategory, dispatch]);

  // Fetch child-categories when sub-category is selected
  useEffect(() => {
    if (selectedSubCategory) {
      dispatch(fetchFilterOptions({ sub: selectedSubCategory }));
    }
  }, [selectedSubCategory, dispatch]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      dispatch(fetchFilterOptions({ state: selectedState }));
    }
  }, [selectedState, dispatch]);

  // Fetch cities when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchFilterOptions({ district: selectedDistrict }));
    }
  }, [selectedDistrict, dispatch]);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    const suggestions = [];

    // Add category suggestions
    mainCategories.forEach(category => {
      if (category.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Category',
          value: category,
          icon: '🏭',
          searchTerm: term,
          filterType: 'maincat',
          filterValue: category
        });
      }
    });

    subCategories.forEach(sub => {
      if (sub.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Sub-Category',
          value: sub,
          icon: '🏷️',
          searchTerm: term,
          filterType: 'subcat',
          filterValue: sub
        });
      }
    });

    childCategories.forEach(child => {
      if (child.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Child-Category',
          value: child,
          icon: '🏷️',
          searchTerm: term,
          filterType: 'childcat',
          filterValue: child
        });
      }
    });

    // Add location suggestions
    states.forEach(state => {
      if (state.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Location',
          value: state,
          icon: '📍',
          searchTerm: term,
          filterType: 'state',
          filterValue: state
        });
      }
    });

    districts.forEach(district => {
      if (district.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Location',
          value: district,
          icon: '📍',
          searchTerm: term,
          filterType: 'district',
          filterValue: district
        });
      }
    });

    cities.forEach(city => {
      if (city.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Location',
          value: city,
          icon: '📍',
          searchTerm: term,
          filterType: 'city',
          filterValue: city
        });
      }
    });

    // Add investment range suggestions
    investmentRanges.forEach(range => {
      if (range.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Investment',
          value: range,
          icon: '💰',
          searchTerm: term,
          filterType: 'investmentRange',
          filterValue: range
        });
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }, [
    searchTerm,
    mainCategories,
    subCategories,
    childCategories,
    states,
    districts,
    cities,
    investmentRanges
  ]);

  // Handle keyboard navigation for suggestions
  useEffect(() => {
    if (!openSuggestions || searchSuggestions.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchSuggestions[activeSuggestion]) {
          handleSuggestionSelect(searchSuggestions[activeSuggestion]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSuggestions, searchSuggestions, activeSuggestion]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleSearchChange = (key, value) => {
    setSearchTerms(prev => ({ ...prev, [key]: value }));
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.value);
    setOpenSuggestions(false);
    
    // Set the appropriate filter based on suggestion type
    switch (suggestion.filterType) {
      case 'maincat':
        setSelectedMainCategory(suggestion.filterValue);
        setSelectedSubCategory('');
        setSelectedChildCategory('');
        setTab(0);
        break;
      case 'subcat':
        setSelectedSubCategory(suggestion.filterValue);
        setSelectedChildCategory('');
        setTab(0);
        break;
      case 'childcat':
        setSelectedChildCategory(suggestion.filterValue);
        setTab(0);
        break;
      case 'state':
        setSelectedState(suggestion.filterValue);
        setSelectedDistrict('');
        setSelectedCity('');
        setTab(1);
        break;
      case 'district':
        setSelectedDistrict(suggestion.filterValue);
        setSelectedCity('');
        setTab(1);
        break;
      case 'city':
        setSelectedCity(suggestion.filterValue);
        setTab(1);
        break;
      case 'investmentRange':
        setSelectedInvestmentRange(suggestion.filterValue);
        setTab(2);
        break;
      default:
        break;
    }
  };

  const handleExplore = async () => {
    setLoading(true);
    
    // Reset all filters first
    dispatch(resetFilters());
    
    // Apply selected filters
    if (searchTerm) {
      dispatch(setFilter({ filterName: 'serchterm', value: searchTerm }));
    }
    
    if (selectedMainCategory) {
      dispatch(setFilter({ filterName: 'maincat', value: selectedMainCategory }));
    }
    
    if (selectedSubCategory) {
      dispatch(setFilter({ filterName: 'subcat', value: selectedSubCategory }));
    }
    
    if (selectedChildCategory) {
      dispatch(setFilter({ filterName: 'childcat', value: selectedChildCategory }));
    }
    
    if (selectedState) {
      dispatch(setFilter({ filterName: 'state', value: selectedState }));
    }
    
    if (selectedDistrict) {
      dispatch(setFilter({ filterName: 'district', value: selectedDistrict }));
    }
    
    if (selectedCity) {
      dispatch(setFilter({ filterName: 'city', value: selectedCity }));
    }
    
    if (selectedInvestmentRange) {
      dispatch(setFilter({ filterName: 'investmentRange', value: selectedInvestmentRange }));
    }
    
    // Navigate to brand view page
    navigate('/brandViewPage');
    handleClose();
    setLoading(false);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    setSelectedChildCategory('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCity('');
    setSelectedInvestmentRange('');
    setSearchTerms({
      state: '',
      district: '',
      city: '',
      investment: ''
    });
  };

  // Filtered states for dropdown
  const filteredStates = useMemo(() => {
    const term = searchTerms.state.toLowerCase();
    return states.filter(state => 
      state.toLowerCase().includes(term)
    );
  }, [states, searchTerms.state]);

  // Filtered districts for dropdown - filtered by selected state
  const filteredDistricts = useMemo(() => {
    const term = searchTerms.district.toLowerCase();
    return districts.filter(district => 
      district.toLowerCase().includes(term)
    );
  }, [districts, searchTerms.district]);

  // Filtered cities for dropdown - filtered by selected district
  const filteredCities = useMemo(() => {
    const term = searchTerms.city.toLowerCase();
    return cities.filter(city => 
      city.toLowerCase().includes(term)
    );
  }, [cities, searchTerms.city]);

  // Filtered investment ranges for dropdown
  const filteredInvestmentRanges = useMemo(() => {
    const term = searchTerms.investment.toLowerCase();
    return investmentRanges.filter(range => 
      range.toLowerCase().includes(term)
    );
  }, [investmentRanges, searchTerms.investment]);

  // Get sub categories for selected main category
  const currentSubCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    return subCategories.filter(sub => sub.maincat === selectedMainCategory);
  }, [selectedMainCategory, subCategories]);

  // Get child categories for selected sub category
  const currentChildCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    return childCategories.filter(child => child.subcat === selectedSubCategory);
  }, [selectedSubCategory, childCategories]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedMainCategory) count++;
    if (selectedSubCategory) count++;
    if (selectedChildCategory) count++;
    if (selectedState) count++;
    if (selectedDistrict) count++;
    if (selectedCity) count++;
    if (selectedInvestmentRange) count++;
    return count;
  }, [
    searchTerm,
    selectedMainCategory,
    selectedSubCategory,
    selectedChildCategory,
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedInvestmentRange
  ]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent sx={{ position: 'relative', p: 3 }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Search Input with Suggestions */}
        <Box display="flex" justifyContent="center" mb={2} position="relative">
          <TextField
            placeholder="Search for brands by name, category, or location"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOpenSuggestions(e.target.value.length > 1);
            }}
            onFocus={() => searchTerm.length > 1 && setOpenSuggestions(true)}
            onBlur={() => setTimeout(() => setOpenSuggestions(false), 200)}
            sx={{ maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {activeFiltersCount > 0 && (
                    <Chip 
                      label={`${activeFiltersCount} filters`} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                  )}
                  <IconButton 
                    sx={{ bgcolor: 'rgb(104, 159, 56)', color: 'white', "&:hover": { backgroundColor: "#7ad03a" } }}
                    onClick={handleExplore}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          {/* Search Suggestions Dropdown */}
          {openSuggestions && searchSuggestions.length > 0 && (
            <Paper 
              elevation={3} 
              sx={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 32px)',
                maxWidth: 500,
                maxHeight: 300,
                overflow: 'auto',
                zIndex: 1300,
                mt: 1
              }}
            >
              <List>
                {searchSuggestions.map((suggestion, index) => (
                  <React.Fragment key={`${suggestion.type}-${suggestion.value}-${index}`}>
                    <ListItem 
                      button
                      selected={index === activeSuggestion}
                      onMouseEnter={() => setActiveSuggestion(index)}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&.Mui-selected': { backgroundColor: 'action.selected' }
                      }}
                    >
                      <Box sx={{ mr: 1, fontSize: '1.2rem' }}>{suggestion.icon}</Box>
                      <ListItemText
                        primary={highlightMatch(suggestion.value, suggestion.searchTerm)}
                        secondary={
                          <span>{suggestion.type}</span>
                        }
                        secondaryTypographyProps={{ color: 'text.secondary' }}
                      />
                    </ListItem>
                    {index < searchSuggestions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Active Filters */}
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mb={2}>
          {selectedMainCategory && (
            <Chip 
              label={`Industry: ${selectedMainCategory}`} 
              onDelete={() => {
                setSelectedMainCategory('');
                setSelectedSubCategory('');
                setSelectedChildCategory('');
              }}
            />
          )}
          {selectedSubCategory && (
            <Chip 
              label={`Category: ${selectedSubCategory}`} 
              onDelete={() => {
                setSelectedSubCategory('');
                setSelectedChildCategory('');
              }}
            />
          )}
          {selectedChildCategory && (
            <Chip 
              label={`Sub-Category: ${selectedChildCategory}`} 
              onDelete={() => setSelectedChildCategory('')}
            />
          )}
          {selectedState && (
            <Chip 
              label={`State: ${selectedState}`} 
              onDelete={() => {
                setSelectedState('');
                setSelectedDistrict('');
                setSelectedCity('');
              }}
            />
          )}
          {selectedDistrict && (
            <Chip 
              label={`District: ${selectedDistrict}`} 
              onDelete={() => {
                setSelectedDistrict('');
                setSelectedCity('');
              }}
            />
          )}
          {selectedCity && (
            <Chip 
              label={`City: ${selectedCity}`} 
              onDelete={() => setSelectedCity('')}
            />
          )}
          {selectedInvestmentRange && (
            <Chip 
              label={`Investment: ${selectedInvestmentRange}`} 
              onDelete={() => setSelectedInvestmentRange('')}
            />
          )}
        </Box>

        {/* Explore Text */}
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Or Explore By
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          textColor="error"
          indicatorColor="error"
          sx={{ mb: 2 }}
        >
          <Tab label="Categories" />
          <Tab label="Location" />
          <Tab label="Investment" />
        </Tabs>

        {/* Tab Content */}
        {tab === 0 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Industry</InputLabel>
              <Select
                value={selectedMainCategory}
                onChange={(e) => {
                  setSelectedMainCategory(e.target.value);
                  setSelectedSubCategory('');
                  setSelectedChildCategory('');
                }}
                label="Industry"
                disabled={dropdownLoading}
              >
                <MenuItem value="">Select Industry</MenuItem>
                {mainCategories.map((category, index) => (
                  <MenuItem key={`cat-${index}`} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} disabled={!selectedMainCategory || dropdownLoading}>
              <InputLabel>Main Category</InputLabel>
              <Select
                value={selectedSubCategory}
                onChange={(e) => {
                  setSelectedSubCategory(e.target.value);
                  setSelectedChildCategory('');
                }}
                label="Main Category"
              >
                <MenuItem value="">Select Main Category</MenuItem>
                {currentSubCategories.map((sub, index) => (
                  <MenuItem key={`sub-cat-${index}`} value={sub.subcat}>
                    {sub.subcat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} disabled={!selectedSubCategory || dropdownLoading}>
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={selectedChildCategory}
                onChange={(e) => setSelectedChildCategory(e.target.value)}
                label="Sub Category"
              >
                <MenuItem value="">Select Sub Category</MenuItem>
                {currentChildCategories.map((child, index) => (
                  <MenuItem key={`child-cat-${index}`} value={child.childcat}>
                    {child.childcat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {tab === 1 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
            {/* State Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('');
                  setSelectedCity('');
                }}
                label="State"
                disabled={dropdownLoading}
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
                {filteredStates.map((state, index) => (
                  <MenuItem key={`state-${index}`} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* District Filter - dependent on selected state */}
            <FormControl sx={{ minWidth: 200 }} disabled={!selectedState || dropdownLoading}>
              <InputLabel>District</InputLabel>
              <Select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedCity('');
                }}
                label="District"
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
                  <MenuItem key={`district-${index}`} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* City Filter - dependent on selected district */}
            <FormControl sx={{ minWidth: 200 }} disabled={!selectedDistrict || dropdownLoading}>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="City"
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
                  <MenuItem key={`city-${index}`} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {tab === 2 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Investment Range</InputLabel>
              <Select
                value={selectedInvestmentRange}
                onChange={(e) => setSelectedInvestmentRange(e.target.value)}
                label="Investment Range"
                disabled={dropdownLoading}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                <MenuItem value="">Select Investment Range</MenuItem>
                <Box px={2} pb={1}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Search investment ranges..."
                    value={searchTerms.investment}
                    onChange={(e) => handleSearchChange('investment', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                {filteredInvestmentRanges.map((range, index) => (
                  <MenuItem key={`range-${index}`} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            onClick={handleExplore}
            disabled={loading}
            sx={{
              backgroundColor: 'rgb(104, 159, 56)',
              '&:hover': { backgroundColor: "#7ad03a" },
              textTransform: 'none'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Explore'}
          </Button>
          <Button
            variant="text"
            onClick={handleClearAll}
            disabled={loading}
            sx={{ textTransform: 'none', color: "black" }}
          >
            Clear All
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarSearch;
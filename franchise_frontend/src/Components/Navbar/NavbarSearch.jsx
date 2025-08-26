
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
  
  Button,
  Typography,
  FormControl,
  Paper,
  List,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Autocomplete,
  ListItemButton
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

  // Get filter options from Redux store
  const {
    mainCategories = [],
    subCategories = [],
    childCategories = [],
    investmentRanges = [],
    states = [],
    districts = [],
    cities = [],
    loading: dropdownLoading
  } = useSelector(state => state.filterDropdown);

  // Selected filters state
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedChildCategory, setSelectedChildCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState('');

  // Search terms for filter dropdowns
  const [searchTerms, setSearchTerms] = useState({
    mainCategory: '',
    subCategory: '',
    childCategory: '',
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
      setSelectedSubCategory('');
      setSelectedChildCategory('');
    }
  }, [selectedMainCategory, dispatch]);

  // Fetch child-categories when sub-category is selected
  useEffect(() => {
    if (selectedSubCategory) {
      dispatch(fetchFilterOptions({ sub: selectedSubCategory }));
      setSelectedChildCategory('');
    }
  }, [selectedSubCategory, dispatch]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      dispatch(fetchFilterOptions({ state: selectedState }));
      setSelectedDistrict('');
      setSelectedCity('');
    }
  }, [selectedState, dispatch]);

  // Fetch cities when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchFilterOptions({ district: selectedDistrict }));
      setSelectedCity('');
    }
  }, [selectedDistrict, dispatch]);

  // Filter main categories based on search term
  const filteredMainCategories = useMemo(() => {
    const term = searchTerms.mainCategory.toLowerCase();
    return mainCategories.filter(cat => 
      cat.toLowerCase().includes(term)
    ).slice(0, 100);
  }, [mainCategories, searchTerms.mainCategory]);

  // Filter sub categories based on selected main category and search term
  const filteredSubCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    const term = searchTerms.subCategory.toLowerCase();
    return subCategories.filter(sub => 
      sub.toLowerCase().includes(term)
    ).slice(0, 100);
  }, [selectedMainCategory, subCategories, searchTerms.subCategory]);

  // Filter child categories based on selected sub category and search term
  const filteredChildCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    const term = searchTerms.childCategory.toLowerCase();
    return childCategories.filter(child => 
      child.toLowerCase().includes(term)
    ).slice(0, 100);
  }, [selectedSubCategory, childCategories, searchTerms.childCategory]);

  // Filter states based on search term
  const filteredStates = useMemo(() => {
    const term = searchTerms.state.toLowerCase();
    return states.filter(state => 
      state.toLowerCase().includes(term)
    ).slice(0, 100);
  }, [states, searchTerms.state]);

  // Filter districts based on selected state and search term
  const filteredDistricts = useMemo(() => {
    if (!selectedState) return [];
    const term = searchTerms.district.toLowerCase();
    return districts.filter(district => 
      district.toLowerCase().includes(term)
    ).slice(0, 100);
  }, [selectedState, districts, searchTerms.district]);

  // Filter cities based on selected district and search term
  const filteredCities = useMemo(() => {
    if (!selectedDistrict) return [];
    const term = searchTerms.city.toLowerCase();
    return cities.filter(city => 
      city.toLowerCase().includes(term)
    ).slice(0, 100);
  }, [selectedDistrict, cities, searchTerms.city]);

  // Filter investment ranges based on search term
  const filteredInvestmentRanges = useMemo(() => {
    const term = searchTerms.investment.toLowerCase();
    return investmentRanges.filter(range => 
      range.toLowerCase().includes(term)
    ).slice(0, 50);
  }, [investmentRanges, searchTerms.investment]);

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
        setTab(0);
        break;
      case 'subcat':
        setSelectedSubCategory(suggestion.filterValue);
        setTab(0);
        break;
      case 'childcat':
        setSelectedChildCategory(suggestion.filterValue);
        setTab(0);
        break;
      case 'state':
        setSelectedState(suggestion.filterValue);
        setTab(1);
        break;
      case 'district':
        setSelectedDistrict(suggestion.filterValue);
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

  // Reset filters in Redux (for current tab if needed)
  dispatch(resetFilters());

  // Collect filters into query params
  const queryParams = new URLSearchParams();

  if (searchTerm) queryParams.append("searchTerm", searchTerm);
  if (selectedMainCategory) queryParams.append("maincat", selectedMainCategory);
  if (selectedSubCategory) queryParams.append("subcat", selectedSubCategory);
  if (selectedChildCategory) queryParams.append("childcat", selectedChildCategory);
  if (selectedState) queryParams.append("state", selectedState);
  if (selectedDistrict) queryParams.append("district", selectedDistrict);
  if (selectedCity) queryParams.append("city", selectedCity);
  if (selectedInvestmentRange) queryParams.append("investmentRange", selectedInvestmentRange);

  // ✅ open new tab with filters in URL
  window.open(`/brandViewPage?${queryParams.toString()}`, "_blank", "noopener,noreferrer");

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
      mainCategory: '',
      subCategory: '',
      childCategory: '',
      state: '',
      district: '',
      city: '',
      investment: ''
    });
  };

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
      <DialogContent sx={{  p: 3 ,background:'#d5e7ddac'}}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon color="error" />
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
                    sx={{ bgcolor: '#7ad03a', color: 'white', "&:hover": { backgroundColor: "rgb(104, 159, 56)" } }}
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
                    <ListItemButton
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
                    </ListItemButton>
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
            {/* Main Category Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <Autocomplete
                options={filteredMainCategories}
                value={selectedMainCategory}
                onChange={(_, newValue) => {
                  setSelectedMainCategory(newValue);
                  setSelectedSubCategory('');
                  setSelectedChildCategory('');
                }}
                inputValue={searchTerms.mainCategory}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('mainCategory', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Industry" 
                    variant="outlined" 
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedMainCategory && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={dropdownLoading}
              />
            </FormControl>

            {/* Sub Category Filter - dependent on selected main category */}
            <FormControl sx={{ minWidth: 200 }}>
              <Autocomplete
                options={filteredSubCategories}
                value={selectedSubCategory}
                onChange={(_, newValue) => {
                  setSelectedSubCategory(newValue);
                  setSelectedChildCategory('');
                }}
                inputValue={searchTerms.subCategory}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('subCategory', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Main Category" 
                    variant="outlined"
                    disabled={!selectedMainCategory || dropdownLoading}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedSubCategory && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={!selectedMainCategory || dropdownLoading}
              />
            </FormControl>

            {/* Child Category Filter - dependent on selected sub category */}
            <FormControl sx={{ minWidth: 200 }}>
              <Autocomplete
                options={filteredChildCategories}
                value={selectedChildCategory}
                onChange={(_, newValue) => {
                  setSelectedChildCategory(newValue);
                }}
                inputValue={searchTerms.childCategory}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('childCategory', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Sub Category" 
                    variant="outlined"
                    disabled={!selectedSubCategory || dropdownLoading}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedChildCategory && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={!selectedSubCategory || dropdownLoading}
              />
            </FormControl>
          </Box>
        )}

        {tab === 1 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
            {/* State Filter */}
            <FormControl sx={{ minWidth: 300 }}>
              <Autocomplete
                options={filteredStates}
                value={selectedState}
                onChange={(_, newValue) => {
                  setSelectedState(newValue);
                  setSelectedDistrict('');
                  setSelectedCity('');
                }}
                inputValue={searchTerms.state}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('state', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="State" 
                    variant="outlined" 
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedState && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={dropdownLoading}
              />
            </FormControl>

            {/* District Filter - dependent on selected state */}
            <FormControl sx={{ minWidth: 300 }}>
              <Autocomplete
                options={filteredDistricts}
                value={selectedDistrict}
                onChange={(_, newValue) => {
                  setSelectedDistrict(newValue);
                  setSelectedCity('');
                }}
                inputValue={searchTerms.district}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('district', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Cities" 
                    variant="outlined"
                    disabled={!selectedState || dropdownLoading}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedDistrict && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={!selectedState || dropdownLoading}
              />
            </FormControl>

            {/* City Filter - dependent on selected district */}
            {/* <FormControl sx={{ minWidth: 200 }}>
              <Autocomplete
                options={filteredCities}
                value={selectedCity}
                onChange={(_, newValue) => {
                  setSelectedCity(newValue);
                }}
                inputValue={searchTerms.city}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('city', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="City" 
                    variant="outlined"
                    disabled={!selectedDistrict || dropdownLoading}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedCity && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={!selectedDistrict || dropdownLoading}
              />
            </FormControl> */}
          </Box>
        )}

        {tab === 2 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
            <FormControl sx={{ minWidth: 300 }}>
              <Autocomplete
                options={filteredInvestmentRanges}
                value={selectedInvestmentRange}
                onChange={(_, newValue) => {
                  setSelectedInvestmentRange(newValue);
                }}
                inputValue={searchTerms.investment}
                onInputChange={(_, newInputValue) => {
                  handleSearchChange('investment', newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Investment Range" 
                    variant="outlined" 
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading && selectedInvestmentRange && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                loading={dropdownLoading}
                disabled={dropdownLoading}
              />
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
              backgroundColor: '#7ad03a',
              '&:hover': { backgroundColor: "rgb(104, 159, 56)" },
              textTransform: 'none'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Explore'}
          </Button>
          <Button
            variant="contained"
            color='error'
            onClick={handleClearAll}
            disabled={loading}
            sx={{ textTransform: 'none', color: "white" }}
          >
            Clear All
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarSearch;
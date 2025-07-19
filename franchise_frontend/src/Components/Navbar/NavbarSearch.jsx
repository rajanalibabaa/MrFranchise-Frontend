import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useBrandsForFiltering, useBrandsForListing } from '../..//Hooks/Fetchbrands';

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
  const location = useLocation();

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  // Get all filter options using React Query
  const { data: brands = [] } = useBrandsForFiltering();
  const { data: listingBrands = [] } = useBrandsForListing();

  // Initialize state from location state if available (when coming from brand view page)
  useEffect(() => {
    if (location.state?.filters) {
      const { filters } = location.state;
      setSearchTerm(filters.searchTerm || '');
      setSelectedMainCategory(filters.selectedMainCategory || '');
      setSelectedSubCategory(filters.selectedSubCategory || '');
      setSelectedChildCategory(filters.selectedChildCategory || '');
      setSelectedState(filters.selectedState || '');
      setSelectedDistrict(filters.selectedDistrict || '');
      setSelectedCity(filters.selectedCity || '');
      setSelectedInvestmentRange(filters.selectedInvestmentRange || '');
    }
  }, [location.state]);

  // Generate search suggestions including categories and locations
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    const suggestions = [];

    // Add brand suggestions that match the search term
    listingBrands.forEach(brand => {
      // Check brand name
      if (brand.brandName?.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'Brand',
          value: brand.brandName,
          brandId: brand.uuid,
          icon: '🏢',
          searchTerm: term
        });
      }

      // Check categories (main, sub, child)
      if (brand.categories) {
        if (brand.categories.main?.toLowerCase().includes(term)) {
          suggestions.push({
            type: 'Brand',
            value: brand.brandName,
            brandId: brand.uuid,
            icon: '🏢',
            matchText: `Category: ${brand.categories.main}`,
            searchTerm: term
          });
        }
        if (brand.categories.sub?.toLowerCase().includes(term)) {
          suggestions.push({
            type: 'Brand',
            value: brand.brandName,
            brandId: brand.uuid,
            icon: '🏢',
            matchText: `Category: ${brand.categories.main} > ${brand.categories.sub}`,
            searchTerm: term
          });
        }
        if (brand.categories.child?.toLowerCase().includes(term)) {
          suggestions.push({
            type: 'Brand',
            value: brand.brandName,
            brandId: brand.uuid,
            icon: '🏢',
            matchText: `Category: ${brand.categories.main} > ${brand.categories.sub} > ${brand.categories.child}`,
            searchTerm: term
          });
        }
      }

      // Check locations
      brand.locations?.forEach(location => {
        if (location.state?.toLowerCase().includes(term)) {
          suggestions.push({
            type: 'Brand',
            value: brand.brandName,
            brandId: brand.uuid,
            icon: '🏢',
            matchText: `Location: ${location.state}`,
            searchTerm: term
          });
        }

        location.districts?.forEach(district => {
          if (district.district?.toLowerCase().includes(term)) {
            suggestions.push({
              type: 'Brand',
              value: brand.brandName,
              brandId: brand.uuid,
              icon: '🏢',
              matchText: `Location: ${location.state} > ${district.district}`,
              searchTerm: term
            });
          }

          district.cities?.forEach(city => {
            if (city.toLowerCase().includes(term)) {
              suggestions.push({
                type: 'Brand',
                value: brand.brandName,
                brandId: brand.uuid,
                icon: '🏢',
                matchText: `Location: ${location.state} > ${district.district} > ${city}`,
                searchTerm: term
              });
            }
          });
        });
      });
    });

    // Add standalone category suggestions (not tied to specific brands)
    const allCategories = new Set();
    const allLocations = new Set();

    brands.forEach(brand => {
      if (brand.categories) {
        if (brand.categories.main) {
          allCategories.add(`${brand.categories.main}`);
        }
        if (brand.categories.main && brand.categories.sub) {
          allCategories.add(`${brand.categories.main} > ${brand.categories.sub}`);
        }
        if (brand.categories.main && brand.categories.sub && brand.categories.child) {
          allCategories.add(`${brand.categories.main} > ${brand.categories.sub} > ${brand.categories.child}`);
        }
      }

      brand.locations?.forEach(location => {
        if (location.state) {
          allLocations.add(`${location.state}`);
          location.districts?.forEach(district => {
            if (district.district) {
              allLocations.add(`${location.state} > ${district.district}`);
              district.cities?.forEach(city => {
                allLocations.add(`${location.state} > ${district.district} > ${city}`);
              });
            }
          });
        }
      });
    });

    // Add standalone category matches
    Array.from(allCategories).forEach(category => {
      if (category.toLowerCase().includes(term)) {
        const parts = category.split(' > ');
        // Find brands that have this category
        const matchingBrands = listingBrands.filter(brand => {
          if (parts.length === 1) return brand.categories?.main === parts[0];
          if (parts.length === 2) return brand.categories?.main === parts[0] && brand.categories?.sub === parts[1];
          if (parts.length === 3) return brand.categories?.main === parts[0] && brand.categories?.sub === parts[1] && brand.categories?.child === parts[2];
          return false;
        });

        matchingBrands.forEach(brand => {
          suggestions.push({
            type: 'Brand',
            value: brand.brandName,
            brandId: brand.uuid,
            icon: '🏢',
            matchText: `Category: ${category}`,
            searchTerm: term
          });
        });
      }
    });

    // Add standalone location matches
    Array.from(allLocations).forEach(location => {
      if (location.toLowerCase().includes(term)) {
        const parts = location.split(' > ');
        // Find brands that have this location
        const matchingBrands = listingBrands.filter(brand => {
          return brand.locations?.some(loc => {
            if (parts.length === 1) return loc.state === parts[0];
            if (parts.length === 2) {
              return loc.state === parts[0] && 
                loc.districts?.some(dist => dist.district === parts[1]);
            }
            if (parts.length === 3) {
              return loc.state === parts[0] && 
                loc.districts?.some(dist => 
                  dist.district === parts[1] && 
                  dist.cities?.includes(parts[2])
                )
            }
            return false;
          });
        });

        matchingBrands.forEach(brand => {
          suggestions.push({
            type: 'Brand',
            value: brand.brandName,
            brandId: brand.uuid,
            icon: '🏢',
            matchText: `Location: ${location}`,
            searchTerm: term
          });
        });
      }
    });

    // Remove duplicates (same brand with same match text)
    const uniqueSuggestions = suggestions.filter(
      (suggestion, index, self) =>
        index === self.findIndex(s => 
          s.brandId === suggestion.brandId && 
          s.matchText === suggestion.matchText
        )
    );

    return uniqueSuggestions.slice(0, 10); // Limit to 10 suggestions
  }, [searchTerm, listingBrands, brands]);

  // Handle keyboard navigation for suggestions
  useEffect(() => {
    if (!openSuggestions || searchSuggestions.length === 0) return;

    const handleKeyDown = (e) => {
      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
      }
      // Arrow up
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
      }
      // Enter
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchSuggestions[activeSuggestion]) {
          handleSuggestionSelect(searchSuggestions[activeSuggestion]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSuggestions, searchSuggestions, activeSuggestion]);

  // Extract filter options from brands data
  const filterOptions = useMemo(() => {
    const mainCategories = new Set();
    const subCategories = new Map();
    const childCategories = new Map();
    const states = new Set();
    const districts = new Map(); // { state: [districts] }
    const cities = new Map(); // { district: [cities] }
    const investmentRanges = new Set();

    brands.forEach(brand => {
      // Categories
      const mainCat = brand.categories?.main;
      const subCat = brand.categories?.sub;
      const childCat = brand.categories?.child;
     
      if (mainCat){
         mainCategories.add(mainCat);

        // Initialize subcategories map for this main category if it doesn't exist
        if (!subCategories.has(mainCat)){
          subCategories.set(mainCat, new Set());
        }

        if (subCat){
          subCategories.get(mainCat).add(subCat);

          // Initialize child categories map for this subcategory if it doesn't exist
          if (!childCategories.has(subCat)) {
              childCategories.set(subCat, new Set());
            }

          if (childCat) {
              childCategories.get(subCat).add(childCat);
            }
        }
      }

      // Locations
      brand.locations?.forEach(location => {
        if (location.state) {
          states.add(location.state);
          
          location.districts?.forEach(district => {
            if (district.district) {
              const stateDistricts = districts.get(location.state) || new Set();
              stateDistricts.add(district.district);
              districts.set(location.state, stateDistricts);
              
              district.cities?.forEach(city => {
                const districtCities = cities.get(district.district) || new Set();
                districtCities.add(city);
                cities.set(district.district, districtCities);
              });
            }
          });
        }
      });

      // Investment ranges
      brand.investmentRanges?.forEach(range => {
        if (range) investmentRanges.add(range);
      });
    });

    return {
      mainCategories: Array.from(mainCategories),
      subCategories: Object.fromEntries(
        Array.from(subCategories.entries()).map(([mainCat, subs]) => 
          [mainCat, Array.from(subs)]
        )
      ),
      childCategories: Object.fromEntries(
        Array.from(childCategories.entries()).map(([subCat, children]) => 
          [subCat, Array.from(children)]
        )
      ),
      states: Array.from(states),
      districts: Object.fromEntries(
        Array.from(districts.entries()).map(([state, distSet]) => [state, Array.from(distSet)])
      ),
      cities: Object.fromEntries(
        Array.from(cities.entries()).map(([district, citySet]) => [district, Array.from(citySet)])
      ),
      investmentRanges: Array.from(investmentRanges)
    };
  }, [brands]);

  const [searchTerms, setSearchTerms] = useState({
    state: '',
    district: '',
    city: '',
    investment: ''
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedChildCategory, setSelectedChildCategory] = useState('');

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState('');

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleSearchChange = (key, value) => {
    setSearchTerms(prev => ({ ...prev, [key]: value }));
  };

  const handleSuggestionSelect = (suggestion) => {
    // Set the brand name in the search bar
    setSearchTerm(suggestion.value);
    setOpenSuggestions(false);
    
    // Navigate directly to the brand
    if (suggestion.brandId) {
      navigate(`/brands/${suggestion.brandId}`);
      handleClose();
    }
    
    // Parse the category or location from the match text to set filters
    if (suggestion.matchText) {
      if (suggestion.matchText.startsWith('Category:')) {
        const categoryPath = suggestion.matchText.replace('Category: ', '');
        const parts = categoryPath.split(' > ');
        if (parts.length === 1) {
          setSelectedMainCategory(parts[0]);
          setSelectedSubCategory('');
          setSelectedChildCategory('');
          setTab(0);
        } else if (parts.length === 2) {
          setSelectedMainCategory(parts[0]);
          setSelectedSubCategory(parts[1]);
          setSelectedChildCategory('');
          setTab(0);
        } else if (parts.length === 3) {
          setSelectedMainCategory(parts[0]);
          setSelectedSubCategory(parts[1]);
          setSelectedChildCategory(parts[2]);
          setTab(0);
        }
      } else if (suggestion.matchText.startsWith('Location:')) {
        const locationPath = suggestion.matchText.replace('Location: ', '');
        const parts = locationPath.split(' > ');
        if (parts.length === 1) {
          setSelectedState(parts[0]);
          setSelectedDistrict('');
          setSelectedCity('');
          setTab(1);
        } else if (parts.length === 2) {
          setSelectedState(parts[0]);
          setSelectedDistrict(parts[1]);
          setSelectedCity('');
          setTab(1);
        } else if (parts.length === 3) {
          setSelectedState(parts[0]);
          setSelectedDistrict(parts[1]);
          setSelectedCity(parts[2]);
          setTab(1);
        }
      }
    }
  };

  // Filter brands based on selected filters
  const filteredBrands = useMemo(() => {
    return brands.filter(brand => {
      // Filter by search term if it exists (only brand name)
      if (searchTerm && 
          !brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(brand.categories?.main?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !(brand.categories?.sub?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !(brand.categories?.child?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !brand.locations?.some(location => 
            location.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.districts?.some(district => 
              district.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              district.cities?.some(city => 
                city.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )
          )
      ) {
        return false;
      }

      // Filter by category if any category is selected
      if (tab === 0) {
        if (selectedMainCategory && brand.categories?.main !== selectedMainCategory) {
          return false;
        }
        if (selectedSubCategory && brand.categories?.sub !== selectedSubCategory) {
          return false;
        }
        if (selectedChildCategory && brand.categories?.child !== selectedChildCategory) {
          return false;
        }
      }

      // Filter by location if any location is selected
      if (tab === 1) {
        if (selectedState) {
          const hasState = brand.locations?.some(location => 
            location.state === selectedState && 
            (!selectedDistrict || location.districts?.some(district => 
              district.district === selectedDistrict && 
              (!selectedCity || district.cities?.includes(selectedCity))
            ))
          );
          if (!hasState) return false;
        }
      }

      // Filter by investment range if selected
      if (tab === 2 && selectedInvestmentRange) {
        if (!brand.investmentRanges?.includes(selectedInvestmentRange)) {
          return false;
        }
      }

      return true;
    });
  }, [
    brands,
    searchTerm,
    tab,
    selectedMainCategory,
    selectedSubCategory,
    selectedChildCategory,
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedInvestmentRange
  ]);

  const handleExplore = () => {
    const filters = {
      searchTerm,
      ...(tab === 0 && {
        selectedMainCategory,
        selectedSubCategory,
        selectedChildCategory
      }),
      ...(tab === 1 && {
        selectedState,
        selectedDistrict,
        selectedCity
      }),
      ...(tab === 2 && {
        selectedInvestmentRange
      })
    };

    // Store filters in localStorage to persist them across page refreshes
    localStorage.setItem('brandFilters', JSON.stringify(filters));
    localStorage.setItem('filteredBrands', JSON.stringify(filteredBrands));

    // Check if we're already on the brand view page
    if (location.pathname === '/brandViewPage') {
      // If already on brand view page, update the state directl
      navigate('/brandViewPage', {
        state: {
          filteredBrands,
          filters,
          fromSearch: true
        },
        replace: true
      });
        window.location.reload();

    } else {
      // Otherwise navigate normally

      navigate('/brandViewPage', {
        state: {
          filteredBrands,
          filters,
          fromSearch: true
        }
      });
    }
    
    handleClose();
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

  // Filtered states
  const filteredStates = useMemo(() => {
    const term = searchTerms.state.toLowerCase();
    return filterOptions.states.filter(state => 
      state.toLowerCase().includes(term)
    );
  }, [filterOptions.states, searchTerms.state]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    if (!selectedState) return [];
    const term = searchTerms.district.toLowerCase();
    const stateDistricts = filterOptions.districts[selectedState] || [];
    return stateDistricts.filter(district => 
      district.toLowerCase().includes(term)
    );
  }, [selectedState, filterOptions.districts, searchTerms.district]);

  // Filtered cities
  const filteredCities = useMemo(() => {
    if (!selectedDistrict) return [];
    const term = searchTerms.city.toLowerCase();
    const districtCities = filterOptions.cities[selectedDistrict] || [];
    return districtCities.filter(city => 
      city.toLowerCase().includes(term)
    );
  }, [selectedDistrict, filterOptions.cities, searchTerms.city]);

  // Filtered investment ranges
  const filteredInvestmentRanges = useMemo(() => {
    const term = searchTerms.investment.toLowerCase();
    return filterOptions.investmentRanges.filter(range => 
      range.toLowerCase().includes(term)
    );
  }, [filterOptions.investmentRanges, searchTerms.investment]);

  // Get MAIN categories (level 1)
  const mainCategories = useMemo(() => {
    return filterOptions.mainCategories;
  }, [filterOptions.mainCategories]);

  // Get SUB categories based on selected main category (level 2)
  const subCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    return filterOptions.subCategories[selectedMainCategory] || [];
  }, [selectedMainCategory, filterOptions.subCategories]);

  // Get CHILD categories based on selected sub category (level 3)
  const childCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    return filterOptions.childCategories[selectedSubCategory] || [];
  }, [selectedSubCategory, filterOptions.childCategories]);

  // Get active filters count for display
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{ top: { xs: "-20%", sm: "-50%", lg: "-300px" } }}>
      <DialogContent sx={{ position: 'relative', p: 3 }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: { xs: -5, sm: 2 }, right: { xs: -7, sm: 4 } }}
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
                  >
                    <SearchIcon />
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
                          suggestion.matchText ? (
                            <span>{highlightMatch(suggestion.matchText, suggestion.searchTerm)}</span>
                          ) : (
                            <span>Brand</span>
                          )
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
          sx={{ mb: { xs: 0.5, sm: 2 }, p: { xs: "12px 0px" } }}
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
              >
                <MenuItem value="">Select Industry</MenuItem>
                {mainCategories.map((category, index) => (
                  <MenuItem key={`cat-${index}`} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} disabled={!selectedMainCategory}>
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
                {subCategories.map((sub, index) => (
                  <MenuItem key={`sub-cat-${index}`} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} disabled={!selectedSubCategory}>
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={selectedChildCategory}
                onChange={(e) => setSelectedChildCategory(e.target.value)}
                label="Sub Category"
              >
                <MenuItem value="">Select Sub Category</MenuItem>
                {childCategories.map((child, index) => (
                  <MenuItem key={`child-cat-${index}`} value={child}>
                    {child}
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

            {/* District Filter */}
            <FormControl sx={{ minWidth: 200 }} disabled={!selectedState}>
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

            {/* City Filter */}
            <FormControl sx={{ minWidth: 200 }} disabled={!selectedDistrict}>
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
            sx={{
              backgroundColor: 'rgb(104, 159, 56)',
              '&:hover': { backgroundColor: "#7ad03a" },
              textTransform: 'none'
            }}
          >
            Explore
          </Button>
          <Button
            variant="text"
            onClick={handleClearAll}
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
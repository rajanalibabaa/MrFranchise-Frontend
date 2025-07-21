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
    
    // Navigate directly to the brand in a new tab
if (suggestion.brandId) {
  const url = `/brands/${suggestion.brandId}`;
  window.open(url, "_blank"); // Opens in a new tab
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
    <Dialog 
  open={open} 
  onClose={handleClose} 
  fullWidth 
  maxWidth="md" 
  sx={{ 
    '& .MuiDialog-paper': {
      borderRadius: 3,
      background: 'linear-gradient(to bottom, #f9f9f9, #ed2222ff)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      overflow: 'visible'
    },
    top: { xs: "5%", sm: "10%", md: "15%" }
  }}
>
  <DialogContent sx={{ 
    position: 'relative', 
    p: { xs: 2, sm: 3 },
    '&:first-of-type': {
      pt: { xs: 3, sm: 4 }
    }
  }}>
    {/* Close Button - Improved positioning and styling */}
    <IconButton
      onClick={handleClose}
      sx={{
        position: 'absolute',
        top: { xs: 8, sm: 12 },
        right: { xs: 8, sm: 12 },
        bgcolor: 'rgba(0,0,0,0.05)',
        '&:hover': {
          bgcolor: 'rgba(0,0,0,0.1)'
        },
        transition: 'all 0.2s ease'
      }}
    >
      <CloseIcon fontSize="small" sx={{ color: 'rgba(251, 4, 4, 0.97)' }} />
    </IconButton>

    {/* Main Search Container */}
    <Box display="flex" justifyContent="center" mb={2} position="relative">
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        {/* Search Input with Suggestions */}
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.1)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0,0,0,0.2)'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(104, 159, 56)',
                boxShadow: '0 0 0 2px rgba(104, 159, 56, 0.2)'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" sx={{ color: 'rgba(0,0,0,0.5)' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {activeFiltersCount > 0 && (
                  <Chip 
                    label={`${activeFiltersCount} filters`} 
                    size="small" 
                    sx={{ 
                      mr: 1,
                      bgcolor: 'rgba(104, 159, 56, 0.1)',
                      color: 'rgb(104, 159, 56)'
                    }}
                  />
                )}
                <IconButton 
                  sx={{ 
                    bgcolor: 'rgb(104, 159, 56)', 
                    color: 'white', 
                    "&:hover": { 
                      backgroundColor: "#7ad03a",
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease',
                    ml: 1
                  }}
                  onClick={handleExplore}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        {/* Search Suggestions Dropdown - Improved styling */}
        {openSuggestions && searchSuggestions.length > 0 && (
          <Paper 
            elevation={4} 
            sx={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              width: '100%',
              maxWidth: 600,
              maxHeight: { xs: 250, sm: 300 },
              overflow: 'auto',
              zIndex: 1300,
              mt: 0.5,
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.1)',
              mx: 'auto'
            }}
          >
            <List dense sx={{ py: 0 }}>
              {searchSuggestions.map((suggestion, index) => (
                <React.Fragment key={`${suggestion.type}-${suggestion.value}-${index}`}>
                  <ListItem 
                    button
                    selected={index === activeSuggestion}
                    onMouseEnter={() => setActiveSuggestion(index)}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    sx={{
                      '&:hover': { 
                        backgroundColor: 'rgba(104, 159, 56, 0.05)' 
                      },
                      '&.Mui-selected': { 
                        backgroundColor: 'rgba(104, 159, 56, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(104, 159, 56, 0.1)'
                        }
                      },
                      py: 1.5,
                      px: 2
                    }}
                  >
                    <Box sx={{ 
                      mr: 1.5, 
                      color: 'rgb(104, 159, 56)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {suggestion.icon}
                    </Box>
                    <ListItemText
                      primary={highlightMatch(suggestion.value, suggestion.searchTerm)}
                      secondary={
                        suggestion.matchText ? (
                          <span>{highlightMatch(suggestion.matchText, suggestion.searchTerm)}</span>
                        ) : (
                          <span>Brand</span>
                        )
                      }
                      primaryTypographyProps={{ 
                        fontWeight: 500,
                        color: 'text.primary'
                      }}
                      secondaryTypographyProps={{ 
                        color: 'text.secondary',
                        fontSize: '0.8rem'
                      }}
                    />
                  </ListItem>
                  {index < searchSuggestions.length - 1 && (
                    <Divider sx={{ my: 0, mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>

    {/* Active Filters - Improved styling */}
    {activeFiltersCount > 0 && (
      <Box 
        display="flex" 
        justifyContent="center" 
        flexWrap="wrap" 
        gap={1} 
        mb={3}
        sx={{
          px: { xs: 1, sm: 0 },
          py: 1,
          bgcolor: 'rgba(104, 159, 56, 0.03)',
          borderRadius: 2,
          border: '1px dashed rgba(104, 159, 56, 0.2)',
          mx: { xs: -2, sm: 0 }
        }}
      >
        {selectedMainCategory && (
          <Chip 
            label={`Industry: ${selectedMainCategory}`} 
            onDelete={() => {
              setSelectedMainCategory('');
              setSelectedSubCategory('');
              setSelectedChildCategory('');
            }}
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
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
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
            }}
          />
        )}
        {selectedChildCategory && (
          <Chip 
            label={`Sub-Category: ${selectedChildCategory}`} 
            onDelete={() => setSelectedChildCategory('')}
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
            }}
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
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
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
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
            }}
          />
        )}
        {selectedCity && (
          <Chip 
            label={`City: ${selectedCity}`} 
            onDelete={() => setSelectedCity('')}
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
            }}
          />
        )}
        {selectedInvestmentRange && (
          <Chip 
            label={`Investment: ${selectedInvestmentRange}`} 
            onDelete={() => setSelectedInvestmentRange('')}
            size="small"
            sx={{
              bgcolor: 'rgba(104, 159, 56, 0.1)',
              color: 'rgb(104, 159, 56)'
            }}
          />
        )}
      </Box>
    )}

    {/* Explore Text - Improved styling */}
    <Typography
      variant="body1"
      align="center"
      color="text.secondary"
      sx={{ 
        mb: 2,
        position: 'relative',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          width: '30%',
          height: '1px',
          bgcolor: 'divider'
        },
        '&::before': {
          left: 0
        },
        '&::after': {
          right: 0
        }
      }}
    >
      Or Explore By
    </Typography>

    {/* Tabs - Improved styling */}
    <Tabs
      value={tab}
      onChange={handleTabChange}
      centered
      textColor="primary"
      indicatorColor="primary"
      sx={{ 
        mb: { xs: 1, sm: 3 },
        '& .MuiTabs-flexContainer': {
          gap: { xs: 1, sm: 2 }
        },
        '& .MuiTab-root': {
          minWidth: 'auto',
          px: { xs: 1, sm: 2 },
          fontSize: { xs: '0.8rem', sm: '0.9rem' },
          textTransform: 'none',
          fontWeight: 500,
          color: 'text.secondary',
          '&.Mui-selected': {
            color: 'rgb(104, 159, 56)'
          }
        },
        '& .MuiTabs-indicator': {
          bgcolor: 'rgb(104, 159, 56)',
          height: 3,
          borderRadius: '3px 3px 0 0'
        }
      }}
    >
      <Tab label="Categories" />
      <Tab label="Location" />
      <Tab label="Investment" />
    </Tabs>

    {/* Tab Content - Improved responsive layout */}
    {tab === 0 && (
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center" mb={3}>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 1 }}>
          <InputLabel>Industry</InputLabel>
          <Select
            value={selectedMainCategory}
            onChange={(e) => {
              setSelectedMainCategory(e.target.value);
              setSelectedSubCategory('');
              setSelectedChildCategory('');
            }}
            label="Industry"
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            <MenuItem value="">Select Industry</MenuItem>
            {mainCategories.map((category, index) => (
              <MenuItem key={`cat-${index}`} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 1 }} disabled={!selectedMainCategory}>
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

        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 1 }} disabled={!selectedSubCategory}>
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
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center" mb={3}>
        {/* State Filter */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 1 }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
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
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 1 }} disabled={!selectedState}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
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
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 1 }} disabled={!selectedDistrict}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
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
      <Box display="flex" justifyContent="center" mb={3}>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 300 } }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
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

    {/* Action Buttons - Improved styling */}
    <Box display="flex" justifyContent="center" gap={2} mt={2}>
      <Button
        variant="contained"
        onClick={handleExplore}
        sx={{
          backgroundColor: 'rgb(104, 159, 56)',
          '&:hover': { 
            backgroundColor: "#7ad03a",
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(104, 159, 56, 0.3)'
          },
          textTransform: 'none',
          px: 4,
          py: 1,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(104, 159, 56, 0.2)'
        }}
      >
        Explore Brands
      </Button>
      <Button
        variant="outlined"
        onClick={handleClearAll}
        sx={{ 
          textTransform: 'none', 
          color: "text.secondary",
          borderColor: 'rgba(0,0,0,0.1)',
          '&:hover': {
            borderColor: 'rgba(0,0,0,0.2)',
            bgcolor: 'rgba(0,0,0,0.02)'
          },
          px: 4,
          py: 1,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 500
        }}
      >
        Clear All
      </Button>
    </Box>
  </DialogContent>
</Dialog>
  );
};

export default NavbarSearch;
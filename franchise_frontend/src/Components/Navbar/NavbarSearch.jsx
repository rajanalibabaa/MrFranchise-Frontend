import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { setFilters, fetchBrands } from '../../Redux/Slices/brandSlice';

const NavbarSearch = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  // Get all filter options from Redux store
  const brandState = useSelector((state) => state.brands) || {};
  const {
    categories = [],
    states = [],
    districts = [],
    cities = [],
    investmentRanges = []
  } = brandState;

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

  const handleExplore = () => {
    let filters = {};
    if (tab === 0) {
      filters = {
        searchTerm,
        selectedCategory: selectedMainCategory,
        selectedSubCategory,
        selectedChildCategory: selectedChildCategory ? [selectedChildCategory] : [],
        selectedModelType: "",
        selectedState: "",
        selectedDistrict: "",
        selectedCity: "",
        selectedInvestmentRange: ""
      };
    } else if (tab === 1) {
      filters = {
        searchTerm,
        selectedCategory: "",
        selectedSubCategory: "",
        selectedChildCategory: [],
        selectedModelType: "",
        selectedState: selectedState,
        selectedDistrict: selectedDistrict,
        selectedCity: selectedCity,
        selectedInvestmentRange: ""
      };
    } else if (tab === 2) {
      filters = {
        searchTerm,
        selectedCategory: "",
        selectedSubCategory: "",
        selectedChildCategory: [],
        selectedModelType: "",
        selectedState: "",
        selectedDistrict: "",
        selectedCity: "",
        selectedInvestmentRange: selectedInvestmentRange
      };
    }

    dispatch(setFilters(filters));
    navigate('/brandViewPage');
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
    if (!states || states.length === 0) return [];
    const term = searchTerms.state.toLowerCase();
    return states.filter(state => 
      state.toLowerCase().includes(term)
    );
  }, [states, searchTerms.state]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    if (!districts || districts.length === 0) return [];
    if (!selectedState) return districts.map(d => d.district);

    const term = searchTerms.district.toLowerCase();
    return districts
      .filter(d => d.state === selectedState)
      .map(d => d.district)
      .filter(district => 
        district.toLowerCase().includes(term)
      );
  }, [selectedState, districts, searchTerms.district]);

  // Filtered cities
  const filteredCities = useMemo(() => {
    if (!cities || cities.length === 0) return [];
    if (!selectedDistrict) return cities.map(c => c.city);

    const term = searchTerms.city.toLowerCase();
    return cities
      .filter(c => c.district === selectedDistrict)
      .map(c => c.city)
      .filter(city => 
        city.toLowerCase().includes(term)
      );
  }, [selectedDistrict, cities, searchTerms.city]);

  // Filtered investment ranges
  const filteredInvestmentRanges = useMemo(() => {
    if (!investmentRanges || investmentRanges.length === 0) return [];
    const term = searchTerms.investment.toLowerCase();
    return investmentRanges.filter(range => 
      range.toLowerCase().includes(term)
    );
  }, [investmentRanges, searchTerms.investment]);

  // Get MAIN categories (level 1)
  const mainCategories = useMemo(() => {
    return categories.filter(cat => cat.level === 1);
  }, [categories]);

  // Get SUB categories based on selected main category (level 2)
  const subCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    return categories.filter(cat => 
      cat.level === 2 && 
      cat.parent === selectedMainCategory
    );
  }, [selectedMainCategory, categories]);

  // Get CHILD categories based on selected sub category (level 3)
  const childCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    return categories.filter(cat => 
      cat.level === 3 && 
      cat.parent === selectedSubCategory
    );
  }, [selectedSubCategory, categories]);

  useEffect(() => {
    console.log("✅ Main categories:", mainCategories);
    console.log("✅ Sub categories:", subCategories);
    console.log("✅ Child categories:", childCategories);
  }, [mainCategories, subCategories, childCategories]);

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

        {/* Search Input */}
        <Box display="flex" justifyContent="center" mb={2}>
          <TextField
            placeholder="Search for business opportunities"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 500 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    sx={{ bgcolor: 'rgb(104, 159, 56)', color: 'white', "&:hover": { backgroundColor: "#7ad03a" } }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
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
                {mainCategories.map((category) => (
                  <MenuItem key={`cat-${category.id}`} value={category.name}>
                    {category.name}
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
                {subCategories.map((sub) => (
                  <MenuItem key={`sub-${sub.id}`} value={sub.name}>
                    {sub.name}
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
                {childCategories.map((child) => (
                  <MenuItem key={`child-${child.id}`} value={child.name}>
                    {child.name}
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
import React, { useState } from 'react';
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
import { setFilters } from '../../Redux/Slices/brandSlice'; // Adjust the import path as needed

const NavbarSearch = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get filter options from Redux store with default empty arrays
  const {
    categories = [],
    subCategories = [],
    childCategories = [],
    states = [],
    districts = [],
    cities = [],
    investmentRanges = []
  } = useSelector((state) => state.brands) || {};

  // Category filters
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedChildCategory, setSelectedChildCategory] = useState('');
  
  // Location filters
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Investment filters
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState('');

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleExplore = () => {
    let filters = {};
    
    if (tab === 0) {
      // Category tab filters
      filters = {
        searchTerm,
        selectedCategory: selectedMainCategory,
        selectedSubCategory: selectedSubCategory,
        selectedChildCategory: selectedChildCategory ? [selectedChildCategory] : [],
        selectedModelType: "",
        selectedState: "",
        selectedDistrict: "",
        selectedCity: "",
        selectedInvestmentRange: ""
      };
    } else if (tab === 1) {
      // Location tab filters
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
      // Investment tab filters
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

    // Apply filters to Redux store
    dispatch(setFilters(filters));
    
    // Navigate to brand view page
    navigate('/brandViewPage');
    
    // Close the dialog
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
  };

  // Get filtered districts based on selected state
  const filteredDistricts = selectedState 
    ? (districts || []).filter(d => d.state === selectedState).map(d => d.district)
    : [];

  // Get filtered cities based on selected district
  const filteredCities = selectedDistrict 
    ? (cities || []).filter(c => c.district === selectedDistrict).map(c => c.city)
    : [];

  // Get filtered subcategories based on selected main category
  const filteredSubCategories = selectedMainCategory
    ? (subCategories || []).filter(sub => sub.parentCategory === selectedMainCategory)
    : [];

  // Get filtered child categories based on selected subcategory
  const filteredChildCategories = selectedSubCategory
    ? (childCategories || []).filter(child => child.parentSubCategory === selectedSubCategory)
    : [];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{ top: { xs: "-20%", sm: "-50%", lg: "-100px" } }}>
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
                  <IconButton sx={{ bgcolor: 'rgb(104, 159, 56)', color: 'white', "&:hover": { backgroundColor: "#7ad03a" } }}>
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
                {(categories || []).map((category) => (
                  <MenuItem key={category.id} value={category.name}>
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
                {filteredSubCategories.map((sub) => (
                  <MenuItem key={sub.id} value={sub.name}>
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
                {filteredChildCategories.map((child) => (
                  <MenuItem key={child.id} value={child.name}>
                    {child.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {tab === 1 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
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
              >
                <MenuItem value="">Select State</MenuItem>
                {(states || []).map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} disabled={!selectedState}>
              <InputLabel>District</InputLabel>
              <Select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedCity('');
                }}
                label="District"
              >
                <MenuItem value="">Select District</MenuItem>
                {filteredDistricts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} disabled={!selectedDistrict}>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="City"
              >
                <MenuItem value="">Select City</MenuItem>
                {filteredCities.map((city) => (
                  <MenuItem key={city} value={city}>
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
              >
                <MenuItem value="">Select Investment Amount</MenuItem>
                {(investmentRanges || []).map((range) => (
                  <MenuItem key={range} value={range}>
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
              '&:hover': { backgroundColor: '#7ad03a' },
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
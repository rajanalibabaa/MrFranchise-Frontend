import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Box,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import categories from '../../Pages/Registration/BrandLIstingRegister/BrandCategories';
const NavbarSearch = ({ open, handleClose }) => {
  const [tab, setTab] = useState(0);
//category search
  const [industry, setIndustry] = useState('');
  const [sector, setSector] = useState('');
  const [service, setService] = useState('');
//location search
const [locationIndustry, setLocationIndustry] = useState('');
const [locationState, setLocationState] = useState('');
const [locationCity, setLocationCity] = useState('');
//investment search
const [investmentIndustry, setInvestmentIndustry]= useState('');
const [investmentAmount, setInvestmentAmount]= useState('');
//category
const [selectedMainCategory, setSelectedMainCategory] = useState('');
const [selectedSubCategory, setSelectedSubCategory] = useState('');
const [selectedChild, setSelectedChild] = useState('');


  const handleTabChange = (_, newValue) => setTab(newValue);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{top:{xs:"-20%",sm:"-50%",xl:"-40%" }}}>
      <DialogContent sx={{ position: 'relative', p: 3 }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: {xs:-5,sm:2,}, right: {xs:-7,sm:4} }}
        >
          <CloseIcon />
        </IconButton>

        {/* Search Input */}
        <Box display="flex" justifyContent="center" mb={2}>
          <TextField
            placeholder="Search for business opportunities"
            fullWidth
            variant="outlined"
            sx={{ maxWidth: 500 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ bgcolor: 'rgb(104, 159, 56)', color: 'white', "&:hover": {backgroundColor: "#7ad03a"}}}>
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
sx={{ mb: { xs: 0.5, sm: 2 },p:{xs:"12px 0px"}}}
        >
          <Tab label="Categories" />
          <Tab label="Location" />
          <Tab label="Investment" />
        </Tabs>

        {/* Tab Content */}
        {tab === 0 && (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
          <FormControl ><InputLabel>Industry</InputLabel>
            <Select
                value={selectedMainCategory || ''}
                onChange={(e) => {
                  setSelectedMainCategory(e.target.value);
                  setSelectedSubCategory('');
                  setSelectedChild('');
                }}
                label="Industry"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Select Industry</MenuItem>
                             {categories.map((category, index) => (
                               <MenuItem key={index} value={category.name}>
                                 {category.name}
                               </MenuItem>
                             ))}
            </Select></FormControl>
<FormControl disabled={!selectedMainCategory}><InputLabel>Main Category</InputLabel>
           <Select
                value={selectedSubCategory || ''}
                onChange={(e) => {
                  setSelectedSubCategory(e.target.value);
                  setSelectedChild('');
                }}
                label="Main Category"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Select Main Category</MenuItem>
                {selectedMainCategory &&
                  categories.find(c => c.name === selectedMainCategory)?.children?.map((sub, index) => (
                    <MenuItem key={index} value={sub.name}>
                      {sub.name}
                    </MenuItem>
                               ))
                             }
                           </Select></FormControl>
                           <FormControl disabled={!selectedSubCategory}>
                             <InputLabel>Sub Category</InputLabel>
            <Select
                value={selectedChild || ''}
                onChange={(e) => setSelectedChild(e.target.value)}
                label="Sub Category"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Select Sub Category</MenuItem>
                {selectedMainCategory && selectedSubCategory &&
                  categories.find(c => c.name === selectedMainCategory)?.children
                    ?.find(sub => sub.name === selectedSubCategory)?.children?.map((child, index) => (
                      <MenuItem key={index} value={child}>
                        {child}
                      </MenuItem>
                    ))}
              </Select></FormControl>
          </Box>
        )}
        {tab === 1 &&(
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
             <FormControl><InputLabel>Industry</InputLabel>
                <Select
      value={locationIndustry}
      onChange={(e) => setLocationIndustry(e.target.value)}
      label="Industry"
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="">Select Industry</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select></FormControl>
                <Select
      value={locationState}
      onChange={(e) => setLocationState(e.target.value)}
      displayEmpty
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="">Select State</MenuItem>
      <MenuItem value="tn">Tamil Nadu</MenuItem>
      <MenuItem value="mh">Maharashtra</MenuItem>
    </Select>

    <Select
      value={locationCity}
      onChange={(e) => setLocationCity(e.target.value)}
      displayEmpty
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="">Select City</MenuItem>
      <MenuItem value="chennai">Chennai</MenuItem>
      <MenuItem value="mumbai">Mumbai</MenuItem>
    </Select>
  </Box>
        )}
        {tab === 2 &&(
<Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>  
 <FormControl><InputLabel>Industry</InputLabel>
<Select
      value={investmentIndustry}
      onChange={(e) => setInvestmentIndustry(e.target.value)}
      label="Industry"
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="">Select Industry</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select></FormControl>

<Select 
value ={investmentAmount}
onChange={(e)=> setInvestmentAmount(e.target.value)}
displayEmpty
sx={{minWidth:200}}>
    <MenuItem value="">
                          Select Investment Amount
                        </MenuItem>
                        <MenuItem value="Below-50,000">Below - Rs.50 K</MenuItem>
                        <MenuItem value="Rs.50,000-2L">Rs.50 K - 2 L</MenuItem>
                        <MenuItem value="Rs.2L-5L">Rs.2 L - 5 L</MenuItem>
                        <MenuItem value="Rs.5L-10L">Rs.5 L - 10 L</MenuItem>
                        <MenuItem value="Rs.10L-20L">Rs.10 L - 20 L</MenuItem>
                        <MenuItem value="Rs.20L-30L">Rs.20 L - 30 L</MenuItem>
                        <MenuItem value="Rs.30L-50L">Rs.30 L - 50 L</MenuItem>
                        <MenuItem value="Rs.50L-1Cr">Rs.50 L - 1 Cr</MenuItem>
                        <MenuItem value="Rs.1Cr-2Cr">Rs.1 Cr - 2 Cr</MenuItem>
                        <MenuItem value="Rs.2Cr-5Cr">Rs.2 Cr - 5 Cr</MenuItem>
                        <MenuItem value="Rs.5Cr-above">Rs.5 Cr - Above</MenuItem>
</Select>

</Box>
         )
        }

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
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
            onClick={() => {
              setIndustry('');
              setSector('');
              setService('');
              setLocationIndustry('');
              setLocationState('');
              setLocationCity('');
              setInvestmentIndustry('');
              setInvestmentAmount('');
            }}
            sx={{ textTransform: 'none' ,color:"black"}}
          >
            Clear All
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarSearch;

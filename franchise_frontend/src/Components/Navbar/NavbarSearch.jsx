// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Dialog,
//   DialogContent,
//   TextField,
//   IconButton,
//   InputAdornment,
//   Tabs,
//   Tab,
//   Box,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Typography,
//   FormControl
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import { useBrandsForFiltering } from '../..//Hooks/Fetchbrands';
// import { useBrandsForListing } from '../..//Hooks/Fetchbrands'

// const NavbarSearch = ({ open, handleClose }) => {
//   const navigate = useNavigate();

//   const [tab, setTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Get all filter options using React Query
//   const { data: brands = [] } = useBrandsForFiltering();

//   // Extract filter options from brands data
//   const filterOptions = useMemo(() => {
//     const mainCategories = new Set();
//     const subCategories = new Map();
//     const childCategories = new Map();
//     const states = new Set();
//     const districts = new Map(); // { state: [districts] }
//     const cities = new Map(); // { district: [cities] }
//     const investmentRanges = new Set();

//     brands.forEach(brand => {
//       // Categories
//       const mainCat = brand.categories?.main;
//       const subCat = brand.categories?.sub;
//       const childCat = brand.categories?.child;
     
//       if (mainCat){
//          mainCategories.add(mainCat);

//       // Initialize subcategories map for this main category if it doesn't exist
//       if (!subCategories.has(mainCat)){
//         subCategories.set(mainCat, new Set());
//       }

//       if (subCat){
//         subCategories.get(mainCat).add(subCat);

//         // Initialize child categories map for this subcategory if it doesn't exist
//         if (!childCategories.has(subCat)) {
//             childCategories.set(subCat, new Set());
//           }

//         if (childCat) {
//             childCategories.get(subCat).add(childCat);
//           }
//       }
//     }

//       // Locations
//       brand.locations?.forEach(location => {
//         if (location.state) {
//           states.add(location.state);
          
//           location.districts?.forEach(district => {
//             if (district.district) {
//               const stateDistricts = districts.get(location.state) || new Set();
//               stateDistricts.add(district.district);
//               districts.set(location.state, stateDistricts);
              
//               district.cities?.forEach(city => {
//                 const districtCities = cities.get(district.district) || new Set();
//                 districtCities.add(city);
//                 cities.set(district.district, districtCities);
//               });
//             }
//           });
//         }
//       });

//       // Investment ranges
//       brand.investmentRanges?.forEach(range => {
//         if (range) investmentRanges.add(range);
//       });
//     });

//     return {
//       mainCategories: Array.from(mainCategories),
//       subCategories: Object.fromEntries(
//         Array.from(subCategories.entries()).map(([mainCat, subs]) => 
//           [mainCat, Array.from(subs)]
//         )
//       ),
//       childCategories: Object.fromEntries(
//         Array.from(childCategories.entries()).map(([subCat, children]) => 
//           [subCat, Array.from(children)]
//         )
//       ),
//       states: Array.from(states),
//       districts: Object.fromEntries(
//         Array.from(districts.entries()).map(([state, distSet]) => [state, Array.from(distSet)])
//       ),
//       cities: Object.fromEntries(
//         Array.from(cities.entries()).map(([district, citySet]) => [district, Array.from(citySet)])
//       ),
//       investmentRanges: Array.from(investmentRanges)
//     };
//   }, [brands]);

//   const [searchTerms, setSearchTerms] = useState({
//     state: '',
//     district: '',
//     city: '',
//     investment: ''
//   });

//   const [selectedMainCategory, setSelectedMainCategory] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');
//   const [selectedChildCategory, setSelectedChildCategory] = useState('');

//   const [selectedState, setSelectedState] = useState('');
//   const [selectedDistrict, setSelectedDistrict] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');

//   const [selectedInvestmentRange, setSelectedInvestmentRange] = useState('');

//   const handleTabChange = (_, newValue) => setTab(newValue);

//   const handleSearchChange = (key, value) => {
//     setSearchTerms(prev => ({ ...prev, [key]: value }));
//   };

//   const handleExplore = () => {
//     const filters = {
//       searchTerm,
//       ...(tab === 0 && {
//         selectedMainCategory,
//         selectedSubCategory,
//         selectedChildCategory
//       }),
//       ...(tab === 1 && {
//         selectedState,
//         selectedDistrict,
//         selectedCity
//       }),
//       ...(tab === 2 && {
//         selectedInvestmentRange
//       })

//     };

//     // Filter brands based on selected filters
//     const filteredBrands = brands.filter(brand => {
//       // Filter by search term if it exists
//       if (searchTerm && !brand.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }

//       // Filter by category if any category is selected
//       if (tab === 0) {
//         if (selectedMainCategory && brand.categories?.main !== selectedMainCategory) {
//           return false;
//         }
//         if (selectedSubCategory && brand.categories?.sub !== selectedSubCategory) {
//           return false;
//         }
//         if (selectedChildCategory && brand.categories?.child !== selectedChildCategory) {
//           return false;
//         }
//       }

//       // Filter by location if any location is selected
//       if (tab === 1) {
//         if (selectedState) {
//           const hasState = brand.locations?.some(location => 
//             location.state === selectedState && 
//             (!selectedDistrict || location.districts?.some(district => 
//               district.district === selectedDistrict && 
//               (!selectedCity || district.cities?.includes(selectedCity))
//             )
//           )
//           );
//           if (!hasState) return false;
//         }
//       }

//       // Filter by investment range if selected
//       if (tab === 2 && selectedInvestmentRange) {
//         if (!brand.investmentRanges?.includes(selectedInvestmentRange)) {
//           return false;
//         }
//       }

//       return true;
//     });

//     // Pass filtered brands to the brand view page
//     navigate('/brandViewPage', {
//       state: {
//         filteredBrands,
//         filters
//       }
//     });
//     handleClose();
//   };

//   const handleClearAll = () => {
//     setSearchTerm('');
//     setSelectedMainCategory('');
//     setSelectedSubCategory('');
//     setSelectedChildCategory('');
//     setSelectedState('');
//     setSelectedDistrict('');
//     setSelectedCity('');
//     setSelectedInvestmentRange('');
//     setSearchTerms({
//       state: '',
//       district: '',
//       city: '',
//       investment: ''
//     });
//   };

//   // Filtered states
//   const filteredStates = useMemo(() => {
//     const term = searchTerms.state.toLowerCase();
//     return filterOptions.states.filter(state => 
//       state.toLowerCase().includes(term)
//     );
//   }, [filterOptions.states, searchTerms.state]);

//   // Filtered districts
//   const filteredDistricts = useMemo(() => {
//     if (!selectedState) return [];
//     const term = searchTerms.district.toLowerCase();
//     const stateDistricts = filterOptions.districts[selectedState] || [];
//     return stateDistricts.filter(district => 
//       district.toLowerCase().includes(term)
//     );
//   }, [selectedState, filterOptions.districts, searchTerms.district]);

//   // Filtered cities
//   const filteredCities = useMemo(() => {
//     if (!selectedDistrict) return [];
//     const term = searchTerms.city.toLowerCase();
//     const districtCities = filterOptions.cities[selectedDistrict] || [];
//     return districtCities.filter(city => 
//       city.toLowerCase().includes(term)
//     );
//   }, [selectedDistrict, filterOptions.cities, searchTerms.city]);

//   // Filtered investment ranges
//   const filteredInvestmentRanges = useMemo(() => {
//     const term = searchTerms.investment.toLowerCase();
//     return filterOptions.investmentRanges.filter(range => 
//       range.toLowerCase().includes(term)
//     );
//   }, [filterOptions.investmentRanges, searchTerms.investment]);

//   // Get MAIN categories (level 1)
//   const mainCategories = useMemo(() => {
//     return filterOptions.mainCategories;
//   }, [filterOptions.mainCategories]);

//   // Get SUB categories based on selected main category (level 2)
//   const subCategories = useMemo(() => {
//     if (!selectedMainCategory) return [];
//     return filterOptions.subCategories[selectedMainCategory] || [];
//   }, [selectedMainCategory, filterOptions.subCategories]);

//   // Get CHILD categories based on selected sub category (level 3)
//   const childCategories = useMemo(() => {
//     if (!selectedSubCategory) return [];
//     return filterOptions.childCategories[selectedSubCategory] || [];
//   }, [selectedSubCategory, filterOptions.childCategories]);

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{ top: { xs: "-20%", sm: "-50%", lg: "-300px" } }}>
//       <DialogContent sx={{ position: 'relative', p: 3 }}>
//         {/* Close Button */}
//         <IconButton
//           onClick={handleClose}
//           sx={{ position: 'absolute', top: { xs: -5, sm: 2 }, right: { xs: -7, sm: 4 } }}
//         >
//           <CloseIcon />
//         </IconButton>

//         {/* Search Input */}
//         <Box display="flex" justifyContent="center" mb={2}>
//           <TextField
//             placeholder="Search for business opportunities"
//             fullWidth
//             variant="outlined"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             sx={{ maxWidth: 500 }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton 
//                     sx={{ bgcolor: 'rgb(104, 159, 56)', color: 'white', "&:hover": { backgroundColor: "#7ad03a" } }}
//                     onClick={handleExplore}
//                   >
//                     <SearchIcon />
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />
//         </Box>

//         {/* Explore Text */}
//         <Typography
//           variant="body1"
//           align="center"
//           color="text.secondary"
//           sx={{ mb: 2 }}
//         >
//           Or Explore By
//         </Typography>

//         {/* Tabs */}
//         <Tabs
//           value={tab}
//           onChange={handleTabChange}
//           centered
//           textColor="error"
//           indicatorColor="error"
//           sx={{ mb: { xs: 0.5, sm: 2 }, p: { xs: "12px 0px" } }}
//         >
//           <Tab label="Categories" />
//           <Tab label="Location" />
//           <Tab label="Investment" />
//         </Tabs>

//         {/* Tab Content */}
//         {tab === 0 && (
//           <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Industry</InputLabel>
//               <Select
//                 value={selectedMainCategory}
//                 onChange={(e) => {
//                   setSelectedMainCategory(e.target.value);
//                   setSelectedSubCategory('');
//                   setSelectedChildCategory('');
//                 }}
//                 label="Industry"
//               >
//                 <MenuItem value="">Select Industry</MenuItem>
//                 {mainCategories.map((category, index) => (
//                   <MenuItem key={`cat-${index}`} value={category}>
//                     {category}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: 200 }} disabled={!selectedMainCategory}>
//               <InputLabel>Main Category</InputLabel>
//               <Select
//                 value={selectedSubCategory}
//                 onChange={(e) => {
//                   setSelectedSubCategory(e.target.value);
//                   setSelectedChildCategory('');
//                 }}
//                 label="Main Category"
//               >
//                 <MenuItem value="">Select Main Category</MenuItem>
//                 {subCategories.map((sub, index) => (
//                   <MenuItem key={`sub-cat-${index}`} value={sub}>
//                     {sub}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: 200 }} disabled={!selectedSubCategory}>
//               <InputLabel>Sub Category</InputLabel>
//               <Select
//                 value={selectedChildCategory}
//                 onChange={(e) => setSelectedChildCategory(e.target.value)}
//                 label="Sub Category"
//               >
//                 <MenuItem value="">Select Sub Category</MenuItem>
//                 {childCategories.map((child, index) => (
//                   <MenuItem key={`child-cat-${index}`} value={child}>
//                     {child}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         )}

//         {tab === 1 && (
//           <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
//             {/* State Filter */}
//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>State</InputLabel>
//               <Select
//                 value={selectedState}
//                 onChange={(e) => {
//                   setSelectedState(e.target.value);
//                   setSelectedDistrict('');
//                   setSelectedCity('');
//                 }}
//                 label="State"
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       maxHeight: 300,
//                     },
//                   },
//                 }}
//               >
//                 <MenuItem value="">All States</MenuItem>
//                 <Box px={2} pb={1}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     variant="outlined"
//                     placeholder="Search states..."
//                     value={searchTerms.state}
//                     onChange={(e) => handleSearchChange('state', e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon fontSize="small" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//                 {filteredStates.map((state, index) => (
//                   <MenuItem key={`state-${index}`} value={state}>
//                     {state}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* District Filter */}
//             <FormControl sx={{ minWidth: 200 }} disabled={!selectedState}>
//               <InputLabel>District</InputLabel>
//               <Select
//                 value={selectedDistrict}
//                 onChange={(e) => {
//                   setSelectedDistrict(e.target.value);
//                   setSelectedCity('');
//                 }}
//                 label="District"
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       maxHeight: 300,
//                     },
//                   },
//                 }}
//               >
//                 <MenuItem value="">All Districts</MenuItem>
//                 <Box px={2} pb={1}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     variant="outlined"
//                     placeholder="Search districts..."
//                     value={searchTerms.district}
//                     onChange={(e) => handleSearchChange('district', e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon fontSize="small" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//                 {filteredDistricts.map((district, index) => (
//                   <MenuItem key={`district-${index}`} value={district}>
//                     {district}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* City Filter */}
//             <FormControl sx={{ minWidth: 200 }} disabled={!selectedDistrict}>
//               <InputLabel>City</InputLabel>
//               <Select
//                 value={selectedCity}
//                 onChange={(e) => setSelectedCity(e.target.value)}
//                 label="City"
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       maxHeight: 300,
//                     },
//                   },
//                 }}
//               >
//                 <MenuItem value="">All Cities</MenuItem>
//                 <Box px={2} pb={1}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     variant="outlined"
//                     placeholder="Search cities..."
//                     value={searchTerms.city}
//                     onChange={(e) => handleSearchChange('city', e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon fontSize="small" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//                 {filteredCities.map((city, index) => (
//                   <MenuItem key={`city-${index}`} value={city}>
//                     {city}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         )}

//         {tab === 2 && (
//           <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Investment Range</InputLabel>
//               <Select
//                 value={selectedInvestmentRange}
//                 onChange={(e) => setSelectedInvestmentRange(e.target.value)}
//                 label="Investment Range"
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       maxHeight: 300,
//                     },
//                   },
//                 }}
//               >
//                 <MenuItem value="">Select Investment Range</MenuItem>
//                 <Box px={2} pb={1}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     variant="outlined"
//                     placeholder="Search investment ranges..."
//                     value={searchTerms.investment}
//                     onChange={(e) => handleSearchChange('investment', e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon fontSize="small" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//                 {filteredInvestmentRanges.map((range, index) => (
//                   <MenuItem key={`range-${index}`} value={range}>
//                     {range}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         )}

//         {/* Action Buttons */}
//         <Box display="flex" justifyContent="center" gap={2}>
//           <Button
//             variant="contained"
//             onClick={handleExplore}
//             sx={{
//               backgroundColor: 'rgb(104, 159, 56)',
//               '&:hover': { backgroundColor: "#7ad03a" },
//               textTransform: 'none'
//             }}
//           >
//             Explore
//           </Button>
//           <Button
//             variant="text"
//             onClick={handleClearAll}
//             sx={{ textTransform: 'none', color: "black" }}
//           >
//             Clear All
//           </Button>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default NavbarSearch;

// ------->

import React, { useState, useMemo } from 'react';
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
  FormControl,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useBrandsForFiltering } from '../../Hooks/Fetchbrands';
import { useBrandsForListing } from '../../Hooks/Fetchbrands';

const NavbarSearch = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get all brands data
  const { data: brandsForFiltering = [] } = useBrandsForFiltering();
  const { data: brandsForListing = [] } = useBrandsForListing();

  // Combine both data sources and remove duplicates
  const allBrands = useMemo(() => {
    const combined = [...brandsForFiltering, ...brandsForListing];
    const uniqueBrands = new Map();
    
    combined.forEach(brand => {
      if (!uniqueBrands.has(brand.uuid)) {
        uniqueBrands.set(brand.uuid, {
          ...brand,
          brandName: brand.brandName || brand.brandDetails?.brandName,
          companyName: brand.companyName || brand.brandDetails?.companyName,
          description: brand.description || brand.brandDetails?.description,
          categories: brand.categories || brand.franchiseDetails?.brandCategories
        });
      }
    });
    
    return Array.from(uniqueBrands.values());
  }, [brandsForFiltering, brandsForListing]);

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    
    return allBrands.filter(brand => {
      // Check brand name
      if (brand.brandName?.toLowerCase().includes(term)) return true;
      
      // Check company name
      if (brand.companyName?.toLowerCase().includes(term)) return true;
      
      // Check description
      if (brand.description?.toLowerCase().includes(term)) return true;
      
      // Check categories
      if (
        brand.categories?.main?.toLowerCase().includes(term) ||
        brand.categories?.sub?.toLowerCase().includes(term) ||
        brand.categories?.child?.toLowerCase().includes(term)
      ) {
        return true;
      }
      
      return false;
    });
  }, [allBrands, searchTerm]);

  // Extract filter options from brands data
  const filterOptions = useMemo(() => {
    const mainCategories = new Set();
    const subCategories = new Map();
    const childCategories = new Map();
    const states = new Set();
    const districts = new Map();
    const cities = new Map();
    const investmentRanges = new Set();

    allBrands.forEach(brand => {
      // Categories
      const mainCat = brand.categories?.main;
      const subCat = brand.categories?.sub;
      const childCat = brand.categories?.child;
     
      if (mainCat) {
        mainCategories.add(mainCat);

        if (!subCategories.has(mainCat)) {
          subCategories.set(mainCat, new Set());
        }

        if (subCat) {
          subCategories.get(mainCat).add(subCat);

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
  }, [allBrands]);

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

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleBrandSelect = (brand) => {
    navigate(`/brandViewPage/${brand.uuid}`, {
      state: {
        brand
      }
    });
    handleClose();
  };

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

    // Filter brands based on selected filters
    const filteredBrands = allBrands.filter(brand => {
      // Filter by search term if it exists
      if (searchTerm && 
          !brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !brand.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !brand.categories?.main?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !brand.categories?.sub?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !brand.categories?.child?.toLowerCase().includes(searchTerm.toLowerCase())
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
          const hasState = brand.locations?.some(location => {
            if (location.state !== selectedState) return false;
            
            if (selectedDistrict) {
              const hasDistrict = location.districts?.some(district => {
                if (district.district !== selectedDistrict) return false;
                
                if (selectedCity) {
                  return district.cities?.includes(selectedCity);
                }
                return true;
              });
              if (!hasDistrict) return false;
            }
            return true;
          });
          
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

    // Pass filtered brands to the brand view page
    navigate('/brandViewPage', {
      state: {
        filteredBrands,
        filters
      }
    });
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
    setShowSuggestions(false);
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
            placeholder="Search for business opportunities"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            sx={{ maxWidth: 500 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
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
          
          {/* Search Suggestions */}
          {showSuggestions && filteredBrands.length > 0 && (
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
                zIndex: 1,
                mt: 1
              }}
            >
              <List>
                {filteredBrands.map((brand) => (
                  <ListItem 
                    key={brand.uuid} 
                    button 
                    onClick={() => handleBrandSelect(brand)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(104, 159, 56, 0.1)'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={brand.brandName}
                      secondary={
                        <>
                          {brand.companyName && <span>{brand.companyName} • </span>}
                          {brand.categories?.main && <span>{brand.categories.main}</span>}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
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
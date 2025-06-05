import { 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent,
  CardMedia, 
  CircularProgress, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Avatar,
  Chip,
  Divider,
  Grid,
  Stack,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import BusinessIcon from "@mui/icons-material/Business";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CategoryIcon from "@mui/icons-material/Category";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openBrandDialog } from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function TopInvestVdo2() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPaused = useRef(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [allLocations, setAllLocations] = useState([]);

const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fixed card dimensions based on screen size
  const CARD_DIMENSIONS = {
    width: isMobile ? 300 : isTablet ? 320 : 320,
    height: 420, // Fixed height for uniformity
    videoHeight: 200, // Set a consistent video height
    avatarSize: isMobile ? 40 : 50,
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
  };
  
  const handleMouseLeave = () => {
    isPaused.current = false;
  };

 const handleApply = (brand) => {
dispatch(openBrandDialog(brand));
    console.log("Apply",brand);
    // Replace with actual apply logic
  };


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://franchise-backend-wgp6.onrender.com/api/v1/homepage/getAllnewRegisterBrands",
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.data?.length) {
        const locationsSet = new Set();
        const processedBrands = response.data.data.map((brand) => {
          // Extract expansion locations - handle different possible structures
          let expansionLocations = [];
          
          // Check different possible locations for the expansion data
          if (brand?.personalDetails?.expansionLocation?.length > 0) {
            // If expansionLocation is an array of objects with city property
            expansionLocations = brand.personalDetails.expansionLocation
              .map(loc => loc.city)
              .filter(city => city); // filter out any undefined/null cities
          } else if (brand?.brandDetails?.expansionLocations?.length > 0) {
            // If expansionLocations is directly an array of strings
            expansionLocations = brand.brandDetails.expansionLocations;
          }

          // Add these locations to our set
          expansionLocations.forEach(loc => locationsSet.add(loc));
          
          // Return brand with its locations (use first location for display if available)
          return {
            ...brand,
            locations: expansionLocations.length ? expansionLocations : ['Multiple Locations'],
            displayLocation: expansionLocations[0] || 'Multiple Locations'
          };
        });

        setBrands(processedBrands);
        setAllLocations(['All Locations', ...Array.from(locationsSet).sort()]);
        setError(null);
      } else {
        setBrands([]);
        setError("No brands found.");
      }
    } catch (err) {
      setError("Failed to fetch brands.");
      setBrands([]);
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  useEffect(() => {
    if (brands.length <= 2) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setBrands((prev) => [...prev.slice(1), prev[0]]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [brands]);

  const filteredBrands = selectedValue && selectedValue !== "All Locations"
    ? brands.filter((brand) => brand.locations.includes(selectedValue))
    : brands;

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  
  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      maxWidth: 1400, 
      mx: "auto",
      overflow: 'hidden',
    }}>
      {/* Header with Filter */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="bold" 
          sx={{ 
            color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
            mb: 3, 
            textAlign: "left",
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
              mt: 1,
              borderRadius: 2
            }
          }}
        >
          Find Franchise At Your Locations
        </Typography>
       
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <FormControl sx={{ minWidth: isMobile ? '100%' : 200 }} size={isMobile ? 'small' : 'medium'}>
            <InputLabel id="location-label">Filter by Location</InputLabel>
            <Select
              labelId="location-label"
              id="location-select"
              value={selectedValue}
              label="Filter by Location"
              onChange={handleChange}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                }
              }}
            >
              {allLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body1" color="text.secondary">
            {filteredBrands.length} {filteredBrands.length === 1 ? 'Opportunity' : 'Opportunities'} Available
          </Typography>
        </Box>
      </Box>

      {/* Brand Cards */}
      <Box
        component={motion.div}
        initial="initial"
        animate="animate"
        sx={{
          display: "flex",
          gap: isMobile ? 2 : 3,
          borderRadius: 3,
          p: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {filteredBrands.map((brand, index) => {
          const brandId = brand.uuid;
          const franchiseModels = brand.franchiseDetails?.modelsOfFranchise || [];
          const firstModel = franchiseModels[0] || {};
          const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
                         brand?.brandDetails?.franchisePromotionVideo?.[0];
          const category = brand?.personalDetails?.brandCategories?.[0]?.child || "No category";
          const franchiseType = firstModel.franchiseType || "N/A";
          const primaryLocation = brand.locations[0] || "Multiple Locations";

          return (
            <motion.div
              key={brandId}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              style={{ 
                minWidth: CARD_DIMENSIONS.width, 
                flexShrink: 0,
                marginRight: index === filteredBrands.length - 1 ? (isMobile ? 2 : 3) : 0
              }}
            >
              <Card
                sx={{
                  width: CARD_DIMENSIONS.width,
                  height: CARD_DIMENSIONS.height,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: CARD_DIMENSIONS.height,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {/* Media Section */}
                <Box sx={{ 
                  position: 'relative', 
                  height: CARD_DIMENSIONS.videoHeight,
                  backgroundColor: '#000'
                }}>
                  {videoUrl ? (
                    <CardMedia
                      component="video"
                      src={videoUrl}
                      alt={brand.personalDetails?.brandName || "Brand"}
                      sx={{ 
                        width: '100%',
                        height: `${CARD_DIMENSIONS.videoHeight}px`,
                        objectFit: 'cover'
                      }}
                      controls
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Box sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.primary.light
                    }}>
                      <Typography variant="body2" color="text.primary">
                        Video not available
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Location Chip */}
                  <Chip
                    label={primaryLocation}
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                  
                  {/* Favorite Button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    <FavoriteBorderIcon color="error" fontSize="small" />
                  </IconButton>
                </Box>

                {/* Content Section */}
                <CardContent sx={{ 
                  flex: 1,
                  p: isMobile ? 1.5 : 1,
                  '&:last-child': { pb: isMobile ? 1.5 : 1},
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar 
                      src={brand?.brandDetails?.brandLogo?.[0]} 
                      sx={{ 
                        width: CARD_DIMENSIONS.avatarSize, 
                        height: CARD_DIMENSIONS.avatarSize,
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        fontWeight={700}
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {brand.personalDetails?.brandName}
                      </Typography>
                      <Chip label={category} size="small"
                              sx={{
                                bgcolor: 'rgba(255, 152, 0, 0.1)',
                                color: 'orange.dark',
                                fontWeight: 500,
                                // mb: 1
                              }} fontWeight={500}  >
                            </Chip>
                    </Box>
                  </Stack>

                  {/* Key Metrics */}
                  <Paper 
                    variant="outlined"
                    display="flex"
                    justifyContent="space-between" 
                    sx={{ 
                      p: isMobile ? 1 : 1,
                      mb: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Grid container spacing={2} display={'isMobile' ? 'block' : 'flex'} >
                     
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={'flex-start'}>
                          <StorefrontIcon sx={{ fontSize: isMobile ? 16 : 18, color: 'orange' }} />
                          <Box display={'flex'}gap={6} >
                            <Typography variant="subtitle2 " color="text.secondary" fontWeight={700}>Type:</Typography>
                            <Typography variant={isMobile ? "caption" : "body2"} >
                              {franchiseType}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={'flex-start'}>
                          <BusinessIcon sx={{ fontSize: isMobile ? 16 : 18, color: 'orange' }} />
                          <Box display={'flex'}gap={7} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>Area:</Typography>
                            <Typography variant={isMobile ? "caption" : "body2"} >
                              {firstModel.areaRequired || 'N/A'} sq.ft
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} >
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={'flex-start'}>
                          <MonetizationOnIcon sx={{ fontSize: isMobile ? 16 : 18, color: 'orange' }} />
                          <Box display={'flex'}gap={2}  sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>Investment:</Typography>
                            <Typography variant={isMobile ? "caption" : "body2"} >
                              {firstModel.investmentRange || 'N/A'} - INR
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      
                    </Grid>
                  </Paper>
                  <Grid item xs={6}>
                        <Button
                          variant="contained"
                          onClick={() => handleApply(brand)}
                          fullWidth
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            backgroundColor: "orange",
                            "&:hover": { 
                              backgroundColor: "#ff9800",
                              boxShadow: 2
                            },
                            py: isMobile ? 1 : 1,
                            px: isMobile ? 2 : 4,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: isMobile ? '0.875rem' : '1rem'
                          }}
                        >
                          Apply Now
                        </Button>
                      </Grid>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Box>

    </Box>
  );
}

export default TopInvestVdo2;
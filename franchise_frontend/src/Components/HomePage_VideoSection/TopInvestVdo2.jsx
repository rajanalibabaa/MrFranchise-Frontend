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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  // const [expandedCards, setExpandedCards] = useState({});

  // Fixed card dimensions based on screen size
  const CARD_DIMENSIONS = {
  width: isMobile ? 300 : isTablet ? 320 : 320,
  height: 470, // Fixed height for uniformity
  videoHeight: 200, // Set a consistent video height
  avatarSize: isMobile ? 40 : 50,
  descriptionLength: isMobile ? 80 : 100,
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

  const toggleDescription = (brandId) => {
    setExpandedCards(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };

  // Format investment range
  const formatInvestmentRange = (range) => {
    if (!range) return "N/A";
    
    const ranges = {
      '5_10_lakhs': '₹5-10 L',
      '10_25_lakhs': '₹10-25 L',
      '25_50_lakhs': '₹25-50 L',
      '50_75_lakhs': '₹50-75 L',
      '75_1_crore': '₹75L-1Cr',
      '1_2_crore': '₹1-2 Cr',
      '2_5_crore': '₹2-5 Cr',
      '5_10_crore': '₹5-10 Cr',
      '2_5_crores': '₹2-5 Cr'
    };
    
    return ranges[range] || range.split('_').join('-') + ' L';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/homepage/getAllnewRegisterBrands",
          { headers: { "Content-Type": "application/json" } }
        );

        if(response.data?.data?.length){
          const brandsWithLocation = response.data.data.map((brand, index) => ({
            ...brand,
            location: index % 3 === 0 ? "Chennai" : index % 3 === 1 ? "Bangalore" : "Coimbatore"
          }));

          setBrands(brandsWithLocation);
          setError(null);
        } else {
          setBrands([]);
          setError("No brands found.");
        }
      } catch(err) {
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

  const handleOpenDialog = (brand) => {
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedBrand(null);
    setDialogOpen(false);
  };

  const filteredBrands = selectedValue
    ? brands.filter((brand) => brand.location === selectedValue)
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
              <MenuItem value="">All Locations</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
              <MenuItem value="Bangalore">Bangalore</MenuItem>
              <MenuItem value="Coimbatore">Coimbatore</MenuItem>
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
          const isOpen = dialogOpen && selectedBrand?.uuid === brandId;
          const franchiseModels = brand.franchiseDetails?.modelsOfFranchise || [];
          const firstModel = franchiseModels[0] || {};
          const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
                         brand?.brandDetails?.franchisePromotionVideo?.[0];



          // const description = brand?.personalDetails?.brandDescription || "No description available";
          // const shortDescription = description.substring(0, CARD_DIMENSIONS.descriptionLength);
          // const isExpanded = expandedCards[brandId] || false;

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
                    label={brand.location}
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
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <LocationOnIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {brand.location}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* <Typography variant="body2" paragraph sx={{ 
                    flexGrow: 1,
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    mb: 1
                  }}>
                    {isExpanded ? description : `${shortDescription}...`}
                    {description.length > CARD_DIMENSIONS.descriptionLength && (
                      <Button
                        size="small"
                        color="primary"
                        sx={{ 
                          textTransform: 'none',
                          p: 0,
                          ml: 0.5,
                          minWidth: 'auto',
                          fontSize: '0.75rem'
                        }}
                        onClick={() => toggleDescription(brandId)}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </Button>
                    )}
                  </Typography> */}

                  {/* Key Metrics */}
                  <Paper 
                    variant="outlined"
                    display="flex"
                    justifyContent="space-between" 
                    sx={{ 
                      p: isMobile ? 1 : 1.5,
                      mb: 2,
                      borderRadius: 2,
                      // backgroundColor: theme.palette.primary.light,
                      // backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.7))'
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={'flex-start'}>
                          <MonetizationOnIcon  sx={{ fontSize: isMobile ? 16 : 18 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Investment</Typography>
                            <Typography variant={isMobile ? "caption" : "body2"} fontWeight={500}>
                              {firstModel.investmentRange ? 
                                formatInvestmentRange(firstModel.investmentRange) : 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={'flex-start'}>
                          <BusinessIcon  sx={{ fontSize: isMobile ? 16 : 18 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Area</Typography>
                            <Typography variant={isMobile ? "caption" : "body2"} fontWeight={500}>
                              {firstModel.areaRequired || 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Divider sx={{ my: 1 }} />

                  {/* Footer Actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // mt: 'auto'
                  }}>
                    <Button
                      variant="text"
                      size={isMobile ? "small" : "medium"}
                      startIcon={<VisibilityIcon fontSize={isMobile ? "small" : "medium"} />}
                      onClick={() => (isOpen ? handleCloseDialog() : handleOpenDialog(brand))}
                      sx={{ 
                        textTransform: 'none',
                        color: 'primary.main',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}
                    >
                      View Details
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                      {franchiseModels.length} Models
                    </Typography>
                  </Box>
                </CardContent>

                {/* Apply Button */}
                <Box sx={{ 
                  px: isMobile ? 1.5 : 2, 
                  pb: isMobile ? 1.5 : 2,
                  pt: 0
                }}>
                  <Button
                    variant="contained"
                    fullWidth
                    
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: "orange",
                      "&:hover": { 
                        backgroundColor: "#ff9800",
                        boxShadow: 2
                      },
                      py: isMobile ? 1 : .5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Franchise Models Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "orange.main",
            color: 'white',
            py: 2,
 backgroundImage: 'linear-gradient(to right, #ff9800, #e65100)',          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
            {selectedBrand?.personalDetails?.brandName} - Franchise Models
          </Typography>
          <IconButton 
            onClick={handleCloseDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, overflowY: 'auto' }}>
          {selectedBrand?.franchiseDetails?.modelsOfFranchise?.map((model, idx) => (
            <Box
              key={idx}
              sx={{
                p: isMobile ? 2 : 3,
                bgcolor: idx % 2 === 0 ? '#fff' : '#fdf5ee',
                borderBottom: '1px solid #eee',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
          gap: 1
              }}>
                <Typography variant={isMobile ? "body1" : "subtitle1"} fontWeight={600} color="orange">
                  {model.franchiseModel || "Franchise Model"}
                </Typography>
                <Button 
                  variant="contained" 
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
backgroundImage: 'linear-gradient(to right,rgb(53, 211, 0),rgb(95, 237, 30))',
              color: 'white',
              px: 3                  }}
                >
                  Request Info
                </Button>
              </Box>
              
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MonetizationOnIcon color="warning" sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Investment</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {formatInvestmentRange(model.investmentRange)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessIcon color="warning" sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Area Required</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {model.areaRequired ? `${model.areaRequired} sq.ft` : "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MonetizationOnIcon color="warning" sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Franchise Fee</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {model.franchiseFee ? `₹${model.franchiseFee}` : "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessIcon color="warning" sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Royalty Fee</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {model.royaltyFee || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon color="warning" sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Type</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {model.franchiseType || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MonetizationOnIcon color="warning" sx={{ fontSize: isMobile ? 18 : 20 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">ROI</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {model.roi || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default TopInvestVdo2;
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Avatar,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import axios from "axios";
import {  Favorite,ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const NewlyRegisteredBrandsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPaused = useRef(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(0);
  
  const navigate = useNavigate();
  
  const categories = [
    "Newly Registered Brands",
    "Trending Franchises",
    "Hot Investment Opportunities",
    "Recently Added Ventures"
  ];

  // Strict fixed dimensions for all cards
  const CARD_DIMENSIONS = {
    mobile: { width: 280, height: 520 },
    tablet: { width: 320, height: 560 },
    desktop: { width: 320, height: 500 }
  };

  const getCardDimensions = () => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  };

  // Format investment range
  const formatInvestmentRange = (range) => {
    if (!range) return "N/A";
    
    const ranges = {
      '5_10_lakhs': '₹5-10 Lakhs',
      '10_25_lakhs': '₹10-25 Lakhs',
      '25_50_lakhs': '₹25-50 Lakhs',
      '50_75_lakhs': '₹50-75 Lakhs',
      '75_1_crore': '₹75 Lakhs - 1 Crore',
      '1_2_crore': '₹1-2 Crore',
      '2_5_crore': '₹2-5 Crore',
      '5_10_crore': '₹5-10 Crore',
      '2_5_crores': '₹2-5 Crore'
    };
    
    return ranges[range] || range.split('_').join('-') + ' Lakhs';
  };

  const handleApply = (brand) => {
    console.log("Applying for:", brand.personalDetails?.brandName);
    // Replace with actual apply logic
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/homepage/getAllnewRegisterBrands",
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.data?.length) {
          setBrands(response.data.data);
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

  // Auto-rotate brands
  useEffect(() => {
    if (brands.length <= 2) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setBrands((prev) => [...prev.slice(1), prev[0]]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [brands]);

  // Auto-rotate categories
  useEffect(() => {
    const categoryInterval = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 3000);

    return () => clearInterval(categoryInterval);
  }, []);

  const handleOpenDialog = (brand) => {
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBrand(null);
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const { width: cardWidth, height: cardHeight } = getCardDimensions();
  const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;

  return (
    <Box sx={{ 
      p: isMobile ? 0 : 4, 
      maxWidth: isMobile ? '100%' : 1400, 
      mx: 'auto',
      mb: isMobile ? 0 : 6,
    }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 3
      }}>
        <Typography 
        variant={isMobile ? "body1" : "h5"} 
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
      {categories[currentCategory]}
      </Typography>
        
        <Button 
          variant="link" 
          size="small"
          sx={{ 
            textTransform: 'none',
            fontSize: isMobile ? 14 : 16,
            '&:hover': {
              color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
            }
          }}
          onClick={() => navigate("/brandviewpage")}
        >
          View More <ArrowRight/>
        </Button>
      </Box>

      <Box
        component={motion.div}
        initial="initial"
        animate="animate"
        sx={{
          display: "flex",
          gap: isMobile ? 2 : 3,
          borderRadius: 3,
          p: 2,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {brands.map((brand) => {
          const brandId = brand.uuid;
          const isOpen = dialogOpen && selectedBrand?.uuid === brandId;
          const franchiseModels = brand.franchiseDetails?.modelsOfFranchise || [];
          const firstModel = franchiseModels[0] || {};
          
          // Get the first available video URL
          const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
                         brand?.brandDetails?.franchisePromotionVideo?.[0];

          return (
            <motion.div
              key={brandId}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              style={{ 
                width: cardWidth,
                height: cardHeight,
                flexShrink: 0
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  width: '100%',
                  height: '100%',
                  border: "1px solid #eee",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
                  }
                }}
              >
                {/* Media Container with Strict Dimensions */}
                <Box sx={{
                  height: mediaHeight,
                  width: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: theme.palette.grey[200]
                }}>
                  {videoUrl ? (
                    <CardMedia
                      component="video"
                      src={videoUrl}
                      alt={brand.personalDetails?.brandName || "Brand"}
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      controls
                      muted
                      loop
                    />
                  ) : (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Video not available
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Card Content with Fixed Height */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: `calc(${cardHeight}px - ${mediaHeight}px)`,
                  justifyContent: 'space-between'
                }}>
                  <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 2,
                      mb: 1.5
                    }}>
                      <Avatar 
                        src={brand?.brandDetails?.brandLogo?.[0]} 
                        sx={{ 
                          width: 50, 
                          height: 50,
                          border: '1px solid #eee',
                          flexShrink: 0
                        }} 
                      />
                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {brand.personalDetails?.brandName}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      flexWrap: 'wrap',
                      mb: 2,
                      minHeight: 32
                    }}>
                      {firstModel.investmentRange && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                        >
                          Investment: {firstModel.investmentRange}
                        </Typography>
                      )}
                      {firstModel.areaRequired && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                        >
                          Area: {firstModel.areaRequired}
                        </Typography>
                      )}
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 2,
                        minHeight: 40
                      }}
                    >
                      {brand.personalDetails?.brandDescription || "No description available"}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Typography variant="body2" fontWeight={600}>
                        Models: {franchiseModels.length}
                      </Typography>

                      <Button
                        variant="text"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => (isOpen ? handleCloseDialog() : handleOpenDialog(brand))}
                        sx={{ textTransform: 'none' }}
                      >
                        {isOpen ? "Hide" : "View Details"}
                      </Button>
                    </Box>
                  </CardContent>

                  <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleApply(brand)}
                      sx={{
                        backgroundColor: "#f29724",
                        "&:hover": { 
                          backgroundColor: "#e68a1e",
                          boxShadow: 2
                        },
                        py: 1,
                        borderRadius: 1,
                        textTransform: 'none'
                      }}
                    >
                      Apply Now
                    </Button>
                  </Box>
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
  maxWidth="sm" 
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden'
    }
  }}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)'
    }
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      bgcolor: "#f29724",
      background: 'linear-gradient(135deg, #f29724 0%, #e67e22 100%)',
      color: 'white',
      py: 2,
      px: 3,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {selectedBrand?.personalDetails?.brandName} - Franchise Models
    </Typography>
    <IconButton 
      onClick={handleCloseDialog}
      sx={{ 
        color: 'white',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.2)'
        }
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={{ 
    p: 0,
    bgcolor: '#f5f7fa',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      bgcolor: '#e0e0e0',
      borderRadius: '3px'
    }
  }}>
    {selectedBrand?.franchiseDetails?.modelsOfFranchise?.map((model, idx) => (
      <Box
        key={idx}
        sx={{
          p: 3,
          bgcolor: idx % 2 === 0 ? '#fff' : '#f9f9f9',
          borderBottom: '1px solid #eaeaea',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
            bgcolor: '#fff'
          },
          '&:last-child': {
            borderBottom: 'none'
          }
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            '&:before': {
              content: '""',
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              bgcolor: '#f29724',
              mr: 1.5
            }
          }}
        >
          {model.franchiseModel || "Franchise Model"}
        </Typography>
        
        <Grid container spacing={2}>
          {[
            { label: "Type", value: model.franchiseType || "N/A" },
            { label: "Investment", value: formatInvestmentRange(model.investmentRange) },
            { label: "Area Required", value: model.areaRequired ? `${model.areaRequired} sq.ft` : "N/A" },
            { label: "ROI", value: model.roi || "N/A" },
            { label: "Franchise Fee", value: model.franchiseFee ? `₹${model.franchiseFee}` : "N/A" },
            { label: "Royalty Fee", value: model.royaltyFee || "N/A" }
          ].map((item, i) => (
            <Grid item xs={6} key={i}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}>
                <Box sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: '4px',
                  p: 1,
                  width: '100%'
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 500,
                    color: '#666',
                    mb: 0.5,
                    fontSize: '0.75rem'
                  }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: '#333'
                  }}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    ))}
  </DialogContent>
</Dialog>
    </Box>
  );
};

export default NewlyRegisteredBrandsSection;
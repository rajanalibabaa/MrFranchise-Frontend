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
  Avatar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import axios from "axios";

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
  
  const categories = [
    "Newly Registered Brands",
    "Trending Franchises",
    "Hot Investment Opportunities",
    "Recently Added Ventures"
  ];

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

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      maxWidth: 1800, 
      mx: 'auto',
      mb: 6
    }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 3
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
          {categories[currentCategory]}
        </Typography>
        <Button 
          variant="text" 
          sx={{ 
            color: theme.palette.primary.main,
            textTransform: 'none',
            fontSize: isMobile ? 14 : 16
          }}
        >
          View All Brands
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
                minWidth: isMobile ? 280 : isTablet ? 320 : 370,
                flexShrink: 0
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: "100%",
                  border: "1px solid #eee",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
                  }
                }}
              >
                {videoUrl ? (
                  <CardMedia
                    component="video"
                    src={videoUrl}
                    alt={brand.personalDetails?.brandName || "Brand"}
                    sx={{ 
                      height: isMobile ? 200 : 250,
                      width: '100%',
                      objectFit: 'cover'
                    }}
                    controls
                    muted
                    loop
                  />
                ) : (
                  <Box sx={{ 
                    height: isMobile ? 200 : 250,
                    width: '100%',
                    bgcolor: theme.palette.grey[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography>Video not available</Typography>
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
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
                        border: '1px solid #eee'
                      }} 
                    />
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {brand.personalDetails?.brandName}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    mb: 2
                  }}>
                    {firstModel.investmentRange && (
                      <Chip 
                        label={`Investment: ${formatInvestmentRange(firstModel.investmentRange)}`} 
                        size="small" 
                        color="primary"
                      />
                    )}
                    {firstModel.areaRequired && (
                      <Chip 
                        label={`Area: ${firstModel.areaRequired} sq.ft`} 
                        size="small"
                      />
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
            borderRadius: 3
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: theme.palette.primary.main,
            color: 'white'
          }}
        >
          <Typography variant="h6">
            {selectedBrand?.personalDetails?.brandName} - Franchise Models
          </Typography>
          <IconButton 
            onClick={handleCloseDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {selectedBrand?.franchiseDetails?.modelsOfFranchise?.map((model, idx) => (
            <Box
              key={idx}
              sx={{
                p: 3,
                bgcolor: idx % 2 === 0 ? '#fff' : '#f9f9f9',
                borderBottom: '1px solid #eee',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {model.franchiseModel || "Franchise Model"}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {model.franchiseType || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Investment:</strong> {formatInvestmentRange(model.investmentRange)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Area Required:</strong> {model.areaRequired ? `${model.areaRequired} sq.ft` : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>ROI:</strong> {model.roi || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Franchise Fee:</strong> {model.franchiseFee ? `₹${model.franchiseFee}` : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Royalty Fee:</strong> {model.royaltyFee || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NewlyRegisteredBrandsSection;
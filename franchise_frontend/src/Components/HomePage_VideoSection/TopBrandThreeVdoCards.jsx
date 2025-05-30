import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Slide,
  Avatar,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { motion, AnimatePresence, color } from "framer-motion";
import axios from "axios";

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [likedBrands, setLikedBrands] = useState({});
  const timeoutRef = useRef(null);
  const [brandData, setBrandData] = useState([]);
  const mainVideoRef = useRef(null);
  const sideVideoRefs = useRef([]);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleNext = useCallback(() => {
    if (!isHovered && !isVideoPlaying) {
      setCurrentIndex((prev) => (prev + 1) % brandData.length);
    }
  }, [isHovered, isVideoPlaying, brandData]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && !isVideoPlaying && brandData.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 5000);
    }
  }, [isHovered, isVideoPlaying, handleNext, brandData]);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopTwo"
        );
        const fetchedData = response.data?.data;

        if (fetchedData) {
          const data = Array.isArray(fetchedData) ? fetchedData : [fetchedData];
          setBrandData(data);
          
          // Initialize liked status
          const initialLikedState = {};
          data.forEach(brand => {
            initialLikedState[brand.uuid || brand.title] = false;
          });
          setLikedBrands(initialLikedState);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, startAutoSlide]);

  const handleVideoPlay = (videoRef) => {
    setIsVideoPlaying(true);
    clearTimeout(timeoutRef.current);
    
    // Pause other videos
    if (videoRef !== mainVideoRef.current) {
      mainVideoRef.current?.pause();
    }
    sideVideoRefs.current.forEach(ref => {
      if (ref && ref !== videoRef) ref.pause();
    });
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    startAutoSlide();
  };

  const handleLike = (brandId) => {
    setLikedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
    // API call to update like status would go here
  };

  if (!brandData || brandData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300 
      }}>
        <Typography>Loading brands...</Typography>
      </Box>
    );
  }

  // Get current and next brands
  const mainBrand = brandData[currentIndex];
  const nextBrand1 = brandData[(currentIndex + 1) % brandData.length];
  const nextBrand2 = brandData[(currentIndex + 2) % brandData.length];

  return (
    <Box 
      sx={{ 
        px: isMobile ? 2 : 4, 
        py: 6, 
        maxWidth: 1800, 
        mx: "auto",
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ color: "#ff9800" }} mb={3} textAlign="left" backgroundColor="#689f38">
        Featured Franchise Brands
      </Typography>
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
          gap: 2,
        }}
      >
        {/* Main Video Card (Left) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mainBrand.uuid || mainBrand.title}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 6,
                width:isMobile ? '100%' : 800,
                height: isMobile ? 'auto' : 520,
              }}
            >
              <Box sx={{ 
                height: isMobile ? 250 : 400, 
                overflow: "hidden",
                position: 'relative'
              }}>
                <video
                  ref={mainVideoRef}
                  src={mainBrand.brandDetails?.brandPromotionVideo?.[0] || 
                       mainBrand.brandDetails?.franchisePromotionVideo?.[0]}
                  controls
                  onPlay={() => handleVideoPlay(mainVideoRef.current)}
                  onPause={handleVideoPause}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <CardContent
                sx={{
                  bgcolor: "#ffff",
                  display: "flex",
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  px: 2,
                  py: 2,
                  height: isMobile ? 'auto' : 80,
                }}
              >
                <Box sx={{ flex: 7 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={mainBrand.brandDetails?.brandLogo?.[0]} 
                      sx={{ width: 32, height: 32 }} 
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {mainBrand.personalDetails?.brandName || mainBrand.title}
                    </Typography>
                  </Box>
                  
                  {/* <Typography variant="body2" color="text.secondary" mt={1}>
                    {mainBrand.personalDetails?.brandDescription || "Brand description"}
                  </Typography> */}
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {mainBrand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange && (
                      <Typography variant="body2">
                        💰 {formatInvestmentRange(mainBrand.franchiseDetails.modelsOfFranchise[0].investmentRange)}
                      </Typography>
                    )}
                    {mainBrand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired && (
                      <Typography variant="body2">
                        📏 {mainBrand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                {!isMobile && (
                  <>
                    <Box sx={{ width: "1px", height: "100%", backgroundColor: "#ccc", mx: 2 }} />
                    <Box sx={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        sx={{
                          background: "#f29724",
                          textTransform: "none",
                          px: 3,
                          "&:hover": { background: "#e68a1e" },
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </>
                )}
                
                {isMobile && (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      background: "#f29724",
                      textTransform: "none",
                      "&:hover": { background: "#e68a1e" },
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Right Side Cards */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 5,
          width: isMobile ? '100%' : 500
        }}>
          {[nextBrand1, nextBrand2].map((brand, i) => (
            <Slide
              direction="up"
              in
              timeout={600 + i * 200}
              key={brand.uuid || brand.title}
            >
              <Card
                sx={{
                  display: "flex",
                  height: isMobile ? 180 : 240,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 4,
                  transition: "transform 0.3s ease",
                  '&:hover': { transform: "scale(1.02)" },
                }}
              >
                <Box sx={{ 
                  width: isMobile ? 150 : 300, 
                  height: "100%",
                  position: 'relative'
      
                }}>
                  <video
                    ref={el => sideVideoRefs.current[i] = el}
                    controls
                    src={brand.brandDetails?.brandPromotionVideo?.[0] || 
                         brand.brandDetails?.franchisePromotionVideo?.[0]}
                    onPlay={() => handleVideoPlay(sideVideoRefs.current[i])}
                    onPause={handleVideoPause}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    bgcolor: "#ffff",
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {brand.personalDetails?.brandName || brand.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleLike(brand.uuid || brand.title)}
                      >
                        {likedBrands[brand.uuid || brand.title] ? (
                          <Favorite sx={{ color: "red", fontSize: 20 }} />
                        ) : (
                          <FavoriteBorder sx={{ color: "gray", fontSize: 20 }} />
                        )}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {brand.personalDetails?.brandDescription?.substring(0, 30) + '...' || "Brand description"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      {brand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange && (
                        <Typography variant="body2" fontSize="0.8rem">
                          💰 {formatInvestmentRange(brand.franchiseDetails.modelsOfFranchise[0].investmentRange)}
                        </Typography>
                      )}
                      {brand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired && (
                        <Typography variant="body2" fontSize="0.8rem">
                          📏 {brand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft
                        </Typography>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: "#f29724",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        px: 1.5,
                        "&:hover": { background: "#e68a1e" },
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function formatInvestmentRange(range) {
  if (!range) return "N/A";
  
  const ranges = {
    '5_10_lakhs': '₹5-10 Lakhs',
    '10_25_lakhs': '₹10-25 Lakhs',
    '25_50_lakhs': '₹25-50 Lakhs',
    '50_75_lakhs': '₹50-75 Lakhs',
    '75_1_crore': '₹75 Lakhs - 1 Cr',
    '1_2_crore': '₹1-2 Crore',
    '2_5_crore': '₹2-5 Crore',
    '5_10_crore': '₹5-10 Crore'
  };
  
  return ranges[range] || range.split('_').join('-') + ' Lakhs';
}

export default TopBrandVdoCards;
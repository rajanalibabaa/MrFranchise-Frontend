import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
  Stack,
  Avatar
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, PlayArrow, Pause, VolumeOff, VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const BestBrandSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const videoRefs = useRef([]);
  const scrollRef = useRef(null);
  const [brandList, setBrandList] = useState([]);
  const [muteState, setMuteState] = useState([]);
  const [playState, setPlayState] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  // Calculate how many slides we have (cards per slide based on screen size)
  const cardsPerSlide = isMobile ? 1 : isTablet ? 2 : 3;
  const totalSlides = Math.ceil(brandList.length / cardsPerSlide);

  const toggleMute = (index) => {
    const newMuteState = [...muteState];
    newMuteState[index] = !newMuteState[index];
    setMuteState(newMuteState);
    if (videoRefs.current[index]) videoRefs.current[index].muted = newMuteState[index];
  };

  const togglePlay = (index) => {
    const newPlayState = [...playState];
    newPlayState[index] = !newPlayState[index];
    setPlayState(newPlayState);
    if (videoRefs.current[index]) {
      if (newPlayState[index]) {
        videoRefs.current[index].play();
      } else {
        videoRefs.current[index].pause();
      }
    }
  };

  const scrollToSlide = useCallback((slideIndex) => {
    if (scrollRef.current) {
      const cardWidth = isMobile ? 300 : isTablet ? 320 : 350;
      const gap = 16;
      const scrollPosition = slideIndex * cardsPerSlide * (cardWidth + gap);
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentSlide(slideIndex);
    }
  }, [isMobile, isTablet, cardsPerSlide]);

  const handleApply = (brand) => {
    console.log("Applying for:", brand.personalDetails?.brandName);
    // You can replace this with your actual apply logic
  };

  const handleNext = useCallback(() => {
    const nextSlide = (currentSlide + 1) % totalSlides;
    scrollToSlide(nextSlide);
  }, [currentSlide, totalSlides, scrollToSlide]);

  const handlePrev = useCallback(() => {
    const prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    scrollToSlide(prevSlide);
  }, [currentSlide, totalSlides, scrollToSlide]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && brandList.length > 0) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }
  }, [isHovered, handleNext, brandList.length]);

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
      '2_5_crores': '₹2-5 Crore' // Added this based on your data
    };
    
    return ranges[range] || range.split('_').join('-') + ' Lakhs';
  };

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopThree"
        );
        let fetchedData = response.data?.data;
        
        // Ensure it's always an array
        if (fetchedData) {
          const dataArray = Array.isArray(fetchedData) ? fetchedData : [fetchedData];
          setBrandList(dataArray);
          setMuteState(Array(dataArray.length).fill(true));
          setPlayState(Array(dataArray.length).fill(false));
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
  }, [currentSlide, startAutoSlide]);

  return (
    <Box 
      sx={{ 
        px: isMobile ? 2 : 4, 
        py: 6, 
        maxWidth: '1800px', 
        mx: 'auto',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
        ,backgroundColor: '#689f38' 
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffba00'}}>
          Today's Marketing Leading Brands
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton 
              onClick={handlePrev} 
              sx={{ 
                bgcolor: '#f0f0f0',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={handleNext} 
              sx={{ 
                bgcolor: '#f0f0f0',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: 2,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {brandList.map((brand, i) => {
          // Get the first available video URL
          const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
                         brand?.brandDetails?.franchisePromotionVideo?.[0];
          const logo = brand?.brandDetails?.brandLogo?.[0] || brand?.brandDetails?.franchiseLogo?.[0];
          // Get investment range from the first franchise model
          const investmentRange = brand?.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange;
          const areaRequired = brand?.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired;
          const roi = brand?.franchiseDetails?.modelsOfFranchise?.[0]?.roi;

          return (
            <Card
              key={brand.uuid || i}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              sx={{
                minWidth: isMobile ? 280 : isTablet ? 320 : 350,
                height: isMobile ? 420 : 370,
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                flexShrink: 0,
              }}
            >
              <Box sx={{ position: 'relative', height: isMobile ? 180 : 200 }}>
                {videoUrl ? (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    src={videoUrl}
                    controls={false}
                    muted={muteState[i]}
                    autoPlay={false}
                    loop
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.grey[300]
                  }}>
                    <Typography>Video not available</Typography>
                  </Box>
                )}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  left: 8, 
                  display: 'flex', 
                  gap: 1 
                }}>
                  <IconButton
                    onClick={() => toggleMute(i)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.8)', 
                      p: 0.5,
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                    size="small"
                  >
                    {muteState[i] ? (
                      <VolumeOff fontSize="small" />
                    ) : (
                      <VolumeUp fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => togglePlay(i)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.8)', 
                      p: 0.5,
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                    size="small"
                  >
                    {playState[i] ? (
                      <Pause fontSize="small" />
                    ) : (
                      <PlayArrow fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <CardContent sx={{ bgcolor: '#ffff', px: 2, pb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
  <Avatar src={logo} alt="brand" sx={{ width: 40, height: 40 }} />
  <Typography variant="subtitle1" fontWeight="bold" noWrap>
    {brand.personalDetails?.brandName || "Unknown Brand"}
  </Typography>
</Stack>
                <Typography variant="body2" fontWeight="bold">
                  Investment: {formatInvestmentRange(investmentRange)}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 1,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 0.5 : 0
                }}>
                  <Typography variant="body2" fontWeight="bold">
                    Area: {areaRequired ? `${areaRequired} sq.ft` : "N/A"}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ROI: {roi || "N/A"}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained" 
                  onClick={() => handleApply(brand)}
                  sx={{
                    mt: 2,
                    backgroundColor: '#f29724',
                    borderRadius: 1,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#e68a1e',
                    },
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Mobile navigation dots */}
      {isMobile && brandList.length > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1, 
          mt: 2 
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <Box
              key={i}
              onClick={() => scrollToSlide(i)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: currentSlide === i ? 'primary.main' : 'grey.400',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BestBrandSlider;
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
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  PlayCircle,
  PauseCircle,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [likedBrands, setLikedBrands] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const timeoutRef = useRef(null);
  const [brandData, setBrandData] = useState([]);
  const videoRefs = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Fixed card sizes with better aspect ratios
  const CARD_SIZES = {
    main: {
      width: isMobile ? '100%' : isTablet ? '100%' : '68%',
      height: isMobile ? 420 : isTablet ? 480 : 550,
      videoHeight: isMobile ? 250 : isTablet ? 300 : 450
    },
    side: {
      width: isMobile ? '100%' : isTablet ? '100%' : '30%',
      height: isMobile ? 200 : isTablet ? 220 : 260,
      videoWidth: isMobile ? '40%' : isTablet ? '45%' : '58%'
    }
  };

  const handleNext = useCallback(() => {
    if (!isHovered && brandData.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % brandData.length);
    }
  }, [isHovered, brandData]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && brandData.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 8000);
    }
  }, [isHovered, handleNext, brandData]);

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
          
          const initialLikedState = {};
          const initialProgressState = {};
          data.forEach((brand, index) => {
            initialLikedState[brand.uuid || brand.title] = false;
            initialProgressState[index] = 0;
          });
          setLikedBrands(initialLikedState);
          setVideoProgress(initialProgressState);
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

  useEffect(() => {
    // Initialize all videos to autoplay and loop
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        
        
        // Set up progress tracking
        video.ontimeupdate = () => {
          const progress = (video.currentTime / video.duration) * 100;
          setVideoProgress(prev => ({...prev, [index]: progress}));
        };
      }
    });
  }, [brandData]);

  const handleVideoPlay = (index) => {
    setActiveVideo(index);
    // Pause other videos
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
      }
    });
  };

  const handleVideoPause = (index) => {
    if (activeVideo === index) {
      setActiveVideo(null);
    }
  };

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        handleVideoPlay(index);
      } else {
        video.pause();
        handleVideoPause(index);
      }
    }
  };

  const handleLike = (brandId) => {
    setLikedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };

  if (!brandData || brandData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300,
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" color="text.secondary">
          Loading featured brands...
        </Typography>
      </Box>
    );
  }

  const mainBrand = brandData[currentIndex];
  const nextBrands = [
    brandData[(currentIndex + 1) % brandData.length],
    brandData[(currentIndex + 2) % brandData.length]
  ].filter(brand => brand); // Filter out undefined brands

  return (
    <Box 
      sx={{ 
        // px: isMobile ? 2 : isTablet ? 3 : 4, 
        py: isMobile ? 1 : 2,
        mx: "auto",
        position: 'relative',
        maxWidth: 1400,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
            mt: 0,
            borderRadius: 2
          }
        }}
      >
        Premium Franchise Brands
      </Typography>
      
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 3 : isTablet ? 3 : 3,
          alignItems: 'stretch'
        }}
      >
        {/* Main Video Card (Left) */}
        <Box sx={{ 
          flex: isMobile ? '1 1 auto' : '0 0 68%', 
          maxWidth: CARD_SIZES.main.width,
          minWidth: isMobile ? '100%' : '68%'
        }}>
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
                  height: CARD_SIZES.main.height,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 6,
                  background: theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[12],
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: CARD_SIZES.main.videoHeight,
                    position: 'relative',
                    cursor: 'pointer',
                    backgroundColor: '#000',
                    overflow: 'hidden'
                  }}
                  onClick={() => togglePlayPause(0)}
                >
                  <video
                    ref={el => videoRefs.current[0] = el}
                    src={mainBrand.brandDetails?.brandPromotionVideo?.[0] || 
                         mainBrand.brandDetails?.franchisePromotionVideo?.[0]}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    autoPlay
                    muted
                    loop
                    controls
                    playsInline
                    onPlay={() => handleVideoPlay(0)}
                    onPause={() => handleVideoPause(0)}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                  </Box>
                </Box>
                
                <CardContent
                  sx={{
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1,
                    height: `calc(${CARD_SIZES.main.height}px - ${CARD_SIZES.main.videoHeight}px)`,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flex: 1,
                    minWidth: 0
                  }}>
                    <Avatar 
                      src={mainBrand.brandDetails?.brandLogo?.[0]} 
                      sx={{ 
                        width: 50, 
                        height:50,
                        border: `2px solid ${theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00'}`,
                        boxShadow: theme.shadows[2]
                      }} 
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        noWrap
                        sx={{
                          background: theme.palette.mode === 'dark' 
                            ? 'linear-gradient(45deg, #ffb74d, #ff9800)' 
                            : 'linear-gradient(45deg, #f57c00, #ff9800)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 700
                        }}
                      >
                        {mainBrand.personalDetails?.brandName || mainBrand.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {(mainBrand.personalDetails?.brandCategories).map((cat) => cat.child).join(', ') || "Franchise Brand"}
                        </Typography>
                        <Chip 
                          label={formatInvestmentRange(mainBrand.franchiseDetails?.modelsOfFranchise[0]?.investmentRange)}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 184, 77, 0.2)' : 'rgba(245, 124, 0, 0.2)',
                            color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    ml: 2
                  }}>
                    <Button
                      variant="contained"
                      sx={{
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(45deg, #ffb74d, #ff9800)' 
                          : 'linear-gradient(45deg, #f57c00, #ff9800)',
                        textTransform: "none",
                        px: 3,
                        color: '#fff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        minWidth: 120,
                        "&:hover": { 
                          background: theme.palette.mode === 'dark' 
                            ? 'linear-gradient(45deg, #ff9800, #ffb74d)' 
                            : 'linear-gradient(45deg, #ff9800, #f57c00)',
                          boxShadow: theme.shadows[4]
                        },
                      }}
                    >
                      Apply Now
                    </Button>
                    <Tooltip title={likedBrands[mainBrand.uuid || mainBrand.title] ? "Remove from favorites" : "Add to favorites"}>
                      <IconButton
                        onClick={() => handleLike(mainBrand.uuid || mainBrand.title)}
                        sx={{
                          color: likedBrands[mainBrand.uuid || mainBrand.title] 
                            ? theme.palette.error.main 
                            : 'text.secondary',
                          '&:hover': {
                            color: theme.palette.error.main,
                            backgroundColor: 'rgba(244, 67, 54, 0.08)'
                          }
                        }}
                      >
                        {likedBrands[mainBrand.uuid || mainBrand.title] ? (
                          <Favorite />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Right Side Cards */}
        <Box sx={{ 
          flex: isMobile ? '1 1 auto' : '0 0 30%',
          display: "flex", 
          flexDirection: "column", 
          gap: isMobile ? 3 : isTablet ? 3 : 4,
          minWidth: isMobile ? '100%' : '30%'
        }}>
          {nextBrands.map((brand, i) => (
            <Slide
              direction="up"
              in
              timeout={600 + i * 200}
              key={brand.uuid || brand.title}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: CARD_SIZES.side.height,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    background: theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
                    display: 'flex',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: CARD_SIZES.side.videoWidth,
                      height: "100%",
                      position: 'relative',
                      cursor: 'pointer',
                      backgroundColor: '#000',
                      flexShrink: 0
                    }}
                    onClick={() => togglePlayPause(i + 1)}
                  >
                    <video
                      ref={el => videoRefs.current[i + 1] = el}
                      src={brand.brandDetails?.brandPromotionVideo?.[0] || 
                           brand.brandDetails?.franchisePromotionVideo?.[0]}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      onPlay={() => handleVideoPlay(i + 1)}
                      onPause={() => handleVideoPause(i + 1)}
                    />
                    <Chip
                      label={i === 0 ? "Trending" : "Popular"}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(45deg, #ffb74d, #ff9800)' 
                          : 'linear-gradient(45deg, #f57c00, #ff9800)',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.65rem'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)',
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause(i + 1);
                      }}
                    >
                      {activeVideo === i + 1 ? <PauseCircle /> : <PlayCircle />}
                    </IconButton>
                  </Box>
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ overflow: 'hidden' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1
                      }}>
                        <Tooltip title={brand.personalDetails?.brandName || brand.title}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="bold" 
                            noWrap
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              color: theme.palette.mode === 'dark' ? '#fff' : 'text.primary'
                            }}
                          >
                            {brand.personalDetails?.brandName || brand.title}
                          </Typography>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={() => handleLike(brand.uuid || brand.title)}
                          sx={{
                            color: likedBrands[brand.uuid || brand.title] 
                              ? theme.palette.error.main 
                              : 'text.secondary',
                            '&:hover': {
                              color: theme.palette.error.main,
                              backgroundColor: 'rgba(244, 67, 54, 0.08)'
                            }
                          }}
                        >
                          {likedBrands[brand.uuid || brand.title] ? (
                            <Favorite fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
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
                          mt: 1,
                          fontSize: '0.8rem',
                          lineHeight: 1.4
                        }}
                      >
                        {brand.personalDetails?.brandDescription || "Brand description not available"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mt: 1
                    }}>
                      <Chip 
                        label={formatInvestmentRange(brand.investmentDetails?.investmentRange)}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 184, 77, 0.2)' : 'rgba(245, 124, 0, 0.2)',
                          color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00'
                        }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' 
                            ? 'linear-gradient(45deg, #ffb74d, #ff9800)' 
                            : 'linear-gradient(45deg, #f57c00, #ff9800)',
                          textTransform: "none",
                          fontSize: "0.75rem",
                          px: 2,
                          color: '#fff',
                          fontWeight: 600,
                          minWidth: 100,
                          "&:hover": { 
                            background: theme.palette.mode === 'dark' 
                              ? 'linear-gradient(45deg, #ff9800, #ffb74d)' 
                              : 'linear-gradient(45deg, #ff9800, #f57c00)',
                            boxShadow: theme.shadows[2]
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
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
    '5_10_lakhs': '₹5-10 L',
    '10_25_lakhs': '₹10-25 L',
    '25_50_lakhs': '₹25-50 L',
    '50_75_lakhs': '₹50-75 L',
    '75_1_crore': '₹75L-1Cr',
    '1_2_crore': '₹1-2 Cr',
    '2_5_crore': '₹2-5 Cr',
    '5_10_crore': '₹5-10 Cr'
  };
  
  return ranges[range] || range.split('_').join('-') + ' L';
}

export default TopBrandVdoCards;
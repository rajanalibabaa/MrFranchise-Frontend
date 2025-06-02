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
  Share,
  Info,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [likedBrands, setLikedBrands] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const timeoutRef = useRef(null);
  const [brandData, setBrandData] = useState([]);
  const mainVideoRef = useRef(null);
  const sideVideoRefs = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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

  const handleVideoPlay = (videoRef, index) => {
    setIsVideoPlaying(true);
    setActiveVideo(index);
    clearTimeout(timeoutRef.current);
    
    if (videoRef !== mainVideoRef.current) {
      mainVideoRef.current?.pause();
    }
    sideVideoRefs.current.forEach(ref => {
      if (ref && ref !== videoRef) ref.pause();
    });
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    setActiveVideo(null);
    startAutoSlide();
  };

  const togglePlayPause = (videoRef, index) => {
    if (videoRef.paused) {
      videoRef.play();
      handleVideoPlay(videoRef, index);
    } else {
      videoRef.pause();
      handleVideoPause();
    }
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
        height: 300,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
  const nextBrand1 = brandData[(currentIndex + 1) % brandData.length];
  const nextBrand2 = brandData[(currentIndex + 2) % brandData.length];

  // Responsive layout values
  const cardHeight = isMobile ? 400 : isTablet ? 450 : 500;
  const sideCardHeight = isMobile ? 180 : isTablet ? 200 : 240;
  const mainCardWidth = isMobile ? '100%' : isTablet ? '100%' : 800;
  const sideCardsWidth = isMobile ? '100%' : isTablet ? '100%' : 500;

  return (
    <Box 
      sx={{ 
        px: isMobile ? 2 : isTablet ? 3 : 4, 
        py: isMobile ? 4 : 6,
        mx: "auto",
        position: 'relative',
        maxWidth: 1800,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
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
        Featured Franchise Brands
      </Typography>
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "2fr 1fr",
          gap: isMobile ? 3 : isTablet ? 3 : 4,
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
                width: mainCardWidth,
                height: cardHeight,
                background: theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
                position: 'relative',
                '&:hover': {
                  boxShadow: theme.shadows[10],
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Box sx={{ 
                height: isMobile ? 200 : isTablet ? 300 : 400, 
                overflow: "hidden",
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => togglePlayPause(mainVideoRef.current, 'main')}
              >
                <video
                  ref={mainVideoRef}
                  src={mainBrand.brandDetails?.brandPromotionVideo?.[0] || 
                       mainBrand.brandDetails?.franchisePromotionVideo?.[0]}
                  controls={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {activeVideo !== 'main' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <PlayCircle sx={{ 
                      fontSize: 60, 
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        color: '#fff',
                        transform: 'scale(1.1)'
                      }
                    }} />
                  </Box>
                )}
                <Box sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.8rem'
                }}>
                  Featured Brand
                </Box>
              </Box>
              
              <CardContent
                sx={{
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  px: 3,
                  py: 2,
                  flex: 1,
                }}
              >
                <Box sx={{ flex: 7 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={mainBrand.brandDetails?.brandLogo?.[0]} 
                      sx={{ 
                        width: isMobile ? 28 : 36, 
                        height: isMobile ? 28 : 36,
                        border: `2px solid ${theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00'}`
                      }} 
                    />
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      fontWeight="bold"
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
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 1,
                    flexWrap: 'wrap'
                  }}>
                    {mainBrand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange && (
                      <Chip
                        label={`💰 ${formatInvestmentRange(mainBrand.franchiseDetails.modelsOfFranchise[0].investmentRange)}`}
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.2)' : 'rgba(245, 124, 0, 0.1)',
                          color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00'
                        }}
                      />
                    )}
                    {mainBrand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired && (
                      <Chip
                        label={`📏 ${mainBrand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft`}
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.2)' : 'rgba(245, 124, 0, 0.1)',
                          color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00'
                        }}
                      />
                    )}
                  </Box>
                </Box>
                
                {!isMobile && (
                  <>
                    <Box sx={{ 
                      width: "1px", 
                      height: "40px", 
                      backgroundColor: "divider", 
                      mx: 2,
                      opacity: 0.6
                    }} />
                    <Box sx={{ 
                      flex: 3, 
                      display: 'flex', 
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 1
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
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Add to favorites">
                          <IconButton
                            size="small"
                            onClick={() => handleLike(mainBrand.uuid || mainBrand.title)}
                            sx={{
                              color: likedBrands[mainBrand.uuid || mainBrand.title] 
                                ? theme.palette.error.main 
                                : 'text.secondary'
                            }}
                          >
                            {likedBrands[mainBrand.uuid || mainBrand.title] ? (
                              <Favorite fontSize="small" />
                            ) : (
                              <FavoriteBorder fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton size="small">
                            <Share fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More info">
                          <IconButton size="small">
                            <Info fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </>
                )}
                
                {isMobile && (
                  <Box sx={{ 
                    width: '100%', 
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(45deg, #ffb74d, #ff9800)' 
                          : 'linear-gradient(45deg, #f57c00, #ff9800)',
                        textTransform: "none",
                        color: '#fff',
                        fontWeight: 600,
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
                    <Box sx={{ ml: 2, display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleLike(mainBrand.uuid || mainBrand.title)}
                        sx={{
                          color: likedBrands[mainBrand.uuid || mainBrand.title] 
                            ? theme.palette.error.main 
                            : 'text.secondary'
                        }}
                      >
                        {likedBrands[mainBrand.uuid || mainBrand.title] ? (
                          <Favorite fontSize="small" />
                        ) : (
                          <FavoriteBorder fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Right Side Cards */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: isMobile ? 3 : isTablet ? 3 : 4,
          width: sideCardsWidth
        }}>
          {[nextBrand1, nextBrand2].map((brand, i) => (
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
                    display: "flex",
                    height: sideCardHeight,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    transition: "all 0.3s ease",
                    background: theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
                    '&:hover': { 
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Box sx={{ 
                    width: isMobile ? 120 : isTablet ? 180 : 220, 
                    height: "100%",
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={() => togglePlayPause(sideVideoRefs.current[i], i)}
                  >
                    <video
                      ref={el => sideVideoRefs.current[i] = el}
                      controls={false}
                      src={brand.brandDetails?.brandPromotionVideo?.[0] || 
                           brand.brandDetails?.franchisePromotionVideo?.[0]}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {activeVideo !== i && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                        }}
                      >
                        <PlayCircle sx={{ 
                          fontSize: 40, 
                          color: 'rgba(255,255,255,0.8)',
                          '&:hover': {
                            color: '#fff',
                            transform: 'scale(1.1)'
                          }
                        }} />
                      </Box>
                    )}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      px: 0.8,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: '0.7rem'
                    }}>
                      {i === 0 ? "Trending" : "Popular"}
                    </Box>
                  </Box>
                  <CardContent
                    sx={{
                      bgcolor: "background.paper",
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: isMobile ? 1.5 : 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <Typography 
                          variant={isMobile ? "body1" : "subtitle1"} 
                          fontWeight="bold" 
                          noWrap
                          sx={{
                            maxWidth: 'calc(100% - 40px)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {brand.personalDetails?.brandName || brand.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleLike(brand.uuid || brand.title)}
                          sx={{
                            color: likedBrands[brand.uuid || brand.title] 
                              ? theme.palette.error.main 
                              : 'text.secondary',
                            '&:hover': {
                              transform: 'scale(1.2)'
                            }
                          }}
                        >
                          {likedBrands[brand.uuid || brand.title] ? (
                            <Favorite sx={{ fontSize: 20 }} />
                          ) : (
                            <FavoriteBorder sx={{ fontSize: 20 }} />
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
                          mt: 0.5,
                          fontSize: isMobile ? '0.8rem' : '0.9rem'
                        }}
                      >
                        {brand.personalDetails?.brandDescription || "Brand description"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mt: 1
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 0.5
                      }}>
                        {brand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange && (
                          <Chip
                            label={`${formatInvestmentRange(brand.franchiseDetails.modelsOfFranchise[0].investmentRange)}`}
                            size="small"
                            sx={{
                              background: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.2)' : 'rgba(245, 124, 0, 0.1)',
                              color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
                              fontSize: '0.7rem',
                              height: '24px'
                            }}
                          />
                        )}
                        {brand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired && (
                          <Chip
                            label={`${brand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft`}
                            size="small"
                            sx={{
                              background: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.2)' : 'rgba(245, 124, 0, 0.1)',
                              color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
                              fontSize: '0.7rem',
                              height: '24px'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Button
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          background: theme.palette.mode === 'dark' 
                            ? 'linear-gradient(45deg, #ffb74d, #ff9800)' 
                            : 'linear-gradient(45deg, #f57c00, #ff9800)',
                          textTransform: "none",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          px: isMobile ? 1 : 1.5,
                          py: 0.5,
                          color: '#fff',
                          fontWeight: 600,
                          minWidth: '80px',
                          "&:hover": { 
                            background: theme.palette.mode === 'dark' 
                              ? 'linear-gradient(45deg, #ff9800, #ffb74d)' 
                              : 'linear-gradient(45deg, #ff9800, #f57c00)',
                            boxShadow: theme.shadows[2]
                          },
                        }}
                      >
                        Apply
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
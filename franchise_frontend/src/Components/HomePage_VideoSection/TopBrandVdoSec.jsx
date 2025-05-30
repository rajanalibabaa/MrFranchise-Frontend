import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { Favorite, FavoriteBorder, PlayCircleOutline } from "@mui/icons-material";
import axios from "axios";

const BrandVideoCard = ({ 
  brand, 
  isPlaying, 
  onPlay, 
  onPause, 
  videoRef,
  liked,
  onLike,
  onApply,
  autoPlay
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Auto-play prevented:", error);
        });
      }
    }
  }, [autoPlay, videoRef]);

  // Get the first available video URL
  const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
                  brand?.brandDetails?.franchisePromotionVideo?.[0];

  return (
    <Card sx={{ 
      width: '100%',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-5px)'
      }
    }}>
      {/* Video Section */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000'
      }}>
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              controls={isPlaying}
              onPlay={onPlay}
              onPause={onPause}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              muted
              playsInline
            />
            
            {!isPlaying && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }} onClick={onPlay}>
                <PlayCircleOutline sx={{ 
                  fontSize: 64, 
                  color: 'rgba(255,255,255,0.8)' 
                }} />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            backgroundColor: theme.palette.grey[700]
          }}>
            <Typography>Video not available</Typography>
          </Box>
        )}
      </Box>
      
      {/* Content Section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={brand?.brandDetails?.brandLogo?.[0]} 
              sx={{ 
                width: 42, 
                height: 42,
                border: '1px solid #eee'
              }} 
            />
            <Typography variant="h6" fontWeight="bold" noWrap>
              {brand?.personalDetails?.brandName || "Unknown Brand"}
            </Typography>
          </Box>
          
          <IconButton
            onClick={onLike}
            size="small"
            sx={{ 
              p: 0.5,
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            {liked ? (
              <Favorite sx={{ 
                color: "red", 
                fontSize: 25,
                animation: 'pulse 0.5s ease',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.3)' },
                  '100%': { transform: 'scale(1)' }
                }
              }} />
            ) : (
              <FavoriteBorder sx={{ 
                color: "gray", 
                fontSize: 25 
              }} />
            )}
          </IconButton>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          mb: 1.5
        }}>
          {brand?.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange && (
            <Chip 
              label={`Investment: ${formatInvestmentRange(brand.franchiseDetails.modelsOfFranchise[0].investmentRange)}`} 
              size="small" 
              color="success"
            />
          )}
          {brand?.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired && (
            <Chip 
              label={`Area: ${brand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft`} 
              size="small"
              color="success" 
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
          {brand?.personalDetails?.brandDescription || "No description available"}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          mb: 2
        }}>
         {brand?.personalDetails?.brandCategories?.map((category, i) => (
  <Chip
    key={i}
    label={`${category.main} > ${category.sub} > ${category.child}`}
    size="small"
    sx={{
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.primary
    }}
  />
))}

        </Box>
        
        <Button
          fullWidth
          variant="contained" 
          onClick={() => onApply(brand)}
          sx={{
            backgroundColor: "#f29724",
            textTransform: "none",
            borderRadius: 1,
            py: 1,
            "&:hover": {
              backgroundColor: "#e68a1e",
              boxShadow: 2,
            },
          }}
        >
          Apply Now
        </Button>
      </Box>
    </Card>
  );
};

function formatInvestmentRange(range) {
  if (!range) return "N/A";
  
  const ranges = {
    '5_10_lakhs': '₹5-10 Lakhs',
    '10_25_lakhs': '₹10-25 Lakhs',
    '25_50_lakhs': '₹25-50 Lakhs',
    '50_75_lakhs': '₹50-75 Lakhs',
    '75_1_crore': '₹75 Lakhs - 1 Crore',
    '1_2_crore': '₹1-2 Crore',
    '2_5_crore': '₹2-5 Crore',
    '5_10_crore': '₹5-10 Crore'
  };
  
  return ranges[range] || range.split('_').join('-') + ' Lakhs';
}

function TopBrandVdoSec() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [brandData, setBrandData] = useState([]);
  const [displayBrands, setDisplayBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [likedBrands, setLikedBrands] = useState({});
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const videoRefs = useRef([]);
  const autoPlayTimer = useRef(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopOne"
        );
        
        // Handle both array and single object responses
        let fetchedData = response.data?.data;
        if (!Array.isArray(fetchedData)) {
          fetchedData = fetchedData ? [fetchedData] : [];
        }
        
        setBrandData(fetchedData);
        console.log('fetchedData',fetchedData);
        
        
        // Initialize liked status
        const initialLikedState = {};
        fetchedData.forEach(brand => {
          const brandId = brand.uuid || brand.personalDetails?.brandName;
          if (brandId) {
            initialLikedState[brandId] = false;
          }
        });
        setLikedBrands(initialLikedState);
        
        // Set first two brands to display initially (or all if less than 2)
        setDisplayBrands(fetchedData.slice(0, 2));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brand data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBrandData();

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (brandData.length <= 2) return;
    
    // Set up auto-rotation every 3 minutes (180000 ms)
    autoPlayTimer.current = setInterval(() => {
      rotateBrands();
    }, 180000);

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [brandData]);

  const rotateBrands = () => {
    if (brandData.length <= 2) return;
    
    setCurrentIndex(prev => {
      const nextIndex = (prev + 2) % brandData.length;
      // Get next two brands (or wrap around to start)
      let nextBrands;
      if (nextIndex + 1 >= brandData.length) {
        nextBrands = [
          brandData[nextIndex],
          brandData[0] // Wrap around
        ];
      } else {
        nextBrands = brandData.slice(nextIndex, nextIndex + 2);
      }
      
      setDisplayBrands(nextBrands);
      
      // Auto-play the first video in the new set
      setAutoPlayIndex(0);
      setPlayingIndex(0);
      
      return nextIndex;
    });
  };

  const handlePlay = (index) => {
    setPlayingIndex(index);
    // Pause other videos
    videoRefs.current.forEach((ref, i) => {
      if (i !== index && ref) {
        ref.pause();
        ref.currentTime = 0;
      }
    });
  };

  const handlePause = () => {
    setPlayingIndex(null);
  };

  const handleLike = (brandId) => {
    setLikedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
    // API call to update like status would go here
  };

  const handleApply = (brand) => {
    // Handle apply logic
    console.log("Applying for:", brand.personalDetails?.brandName);
    // You might want to open a modal or navigate to application page
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300 
      }}>
        <Typography color="error">Error loading brands: {error}</Typography>
      </Box>
    );
  }

  if (!brandData || brandData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300 
      }}>
        <Typography>No brands available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      px: isMobile ? 2 : 4,
      py: 4,
      maxWidth: '1800px',
      mx: 'auto'
    }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        gutterBottom
        sx={{ 
          textAlign: 'center',
          mb: 4
        }}
      >
        Featured Franchise Opportunities
      </Typography>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 3 : 4,
        alignItems: 'stretch'
      }}>
        {displayBrands.map((brand, index) => {
          const brandId = brand.uuid || brand.personalDetails?.brandName;
          return (
            <BrandVideoCard
              key={brandId || index}
              brand={brand}
              isPlaying={playingIndex === index}
              onPlay={() => handlePlay(index)}
              onPause={handlePause}
              videoRef={el => videoRefs.current[index] = el}
              liked={brandId ? likedBrands[brandId] : false}
              onLike={() => brandId && handleLike(brandId)}
              onApply={handleApply}
              autoPlay={autoPlayIndex === index}
            />
          );
        })}
      </Box>

      {/* Navigation dots for mobile */}
      {isMobile && brandData.length > 2 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1, 
          mt: 3 
        }}>
          {Array.from({ length: Math.ceil(brandData.length / 2) }).map((_, i) => (
            <Box
              key={i}
              onClick={() => {
                const startIndex = i * 2;
                setDisplayBrands(brandData.slice(startIndex, startIndex + 2));
                setCurrentIndex(startIndex);
              }}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: currentIndex === i * 2 ? 'primary.main' : 'grey.400',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TopBrandVdoSec;
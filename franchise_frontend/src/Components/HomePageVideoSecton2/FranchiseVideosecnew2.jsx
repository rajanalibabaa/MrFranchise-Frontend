import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  Paper,
  Dialog,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Badge,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Favorite,
  Share,
  Comment,
  Close,
  CheckCircle,
  ArrowRightAlt,
  AdsClick,
  VolumeUp,
  VolumeOff,
  MoreVert,
  Bookmark,
  BookmarkBorder,
  ArrowUpward,
  ArrowDownward,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Link,
  Email
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import BrandDetailsModal from './BrandDetailShowDilogBox';

const FranchiseReels = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [touchStartY, setTouchStartY] = useState(null);
  const [previewPlayingIndex, setPreviewPlayingIndex] = useState(null);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [scrollDirection, setScrollDirection] = useState(null);
  const scrollContainerRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
const [expandedDescription, setExpandedDescription] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandDetailsOpen, setBrandDetailsOpen] = useState(false);
const [isModalLoading, setIsModalLoading] = useState(false);
  // Fetch brands data
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

  // Transform the API data into the format expected by the component
  const franchiseData = brands.map((brand, index) => ({
    id: brand.uuid || index,
    title: brand.personalDetails?.brandName || 'Unknown Brand',
    investment: brand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange || 'Not specified',
    area: brand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired || 'Not specified',
    description: brand.personalDetails?.brandDescription || 'No description available',
    videoUrl: brand.brandDetails?.franchisePromotionVideo?.[0] || 
             brand.brandDetails?.brandPromotionVideo?.[0] || 
             'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    brandLogo: brand.brandDetails?.brandLogo?.[0] || '/default-logo.jpg',
    franchiseDetails: brand.franchiseDetails,
    personalDetails: brand.personalDetails,
    franchiseModels: brand.franchiseDetails?.modelsOfFranchise || [],
category: brand.personalDetails?.brandCategories?.length > 0?   `${brand.personalDetails.brandCategories[0]?.child || ''}`

//  `${brand.personalDetails.brandCategories[0]?.main || ''} → 
  // ${brand.personalDetails.brandCategories[0]?.sub || ''} →
  : 'Business',
    established: brand.personalDetails?.establishedYear || 'N/A'
  }));

  // Sample ad data
  const adData = {
    id: 'ad1',
    title: "Sponsored",
    brand: "FranchiseHub Pro",
    description: "Upgrade to premium for exclusive franchise opportunities and detailed analytics",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-the-beach-3280-large.mp4",
    cta: "Learn More",
    ctaLink: "#",
    duration: 5,
    logo: "https://via.placeholder.com/150"
  };

  // Handle touch events for vertical scrolling
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

 // Function to handle brand logo/name click
  const handleBrandLogoClick = async (brand) => {
  try {
    setIsModalLoading(true);
    setSelectedBrand(brand);
    setBrandDetailsOpen(true);
  } catch (error) {
    console.error("Error loading brand details:", error);
  } finally {
    setIsModalLoading(false);
  }
};
  
  const handleTouchMove = (e) => {
    if (!touchStartY) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;
    
    
    // Determine scroll direction
    if (Math.abs(diff) > 10) {
      setScrollDirection(diff > 0 ? 'up' : 'down');
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartY || !scrollDirection) return;
    
    if (scrollDirection === 'up' && currentIndex < franchiseData.length - 1) {
      // Scroll up to next video
      setCurrentIndex(prev => prev + 1);
    } else if (scrollDirection === 'down' && currentIndex > 0) {
      // Scroll down to previous video
      setCurrentIndex(prev => prev - 1);
    }
    
    setTouchStartY(null);
    setScrollDirection(null);
    setIsPlaying(true);
    setShowDetails(true);
  };

  // Handle scroll events for desktop
  const handleWheel = (e) => {
    if (isFullscreen) {
      // e.preventDefault();
    
      if (e.deltaY > 0 && currentIndex < franchiseData.length - 1) {
        // Scroll down
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up
        setCurrentIndex(prev => prev - 1);
      }
      setIsPlaying(true);
      setShowDetails(true);
    }
  };

  useEffect(() => {
  const container = fullscreenContainerRef.current;
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }
}, [isFullscreen, currentIndex, franchiseData.length]);
  const checkForAd = (index) => {
    // Show ad every 3 videos
    if (index > 0 && index % 3 === 0) {
      setShowAd(true);
      setAdTimer(5);
      setIsPlaying(false);
    } else {
      setShowAd(false);
      setIsPlaying(true);
    }
  };

  const handleApplyClick = (brand) => {
  setSelectedBrand(brand);
  setBrandDetailsOpen(true);
};


  // const toggleFullscreen = () => {
  //   setIsFullscreen(!isFullscreen);
  //   setIsPlaying(!isFullscreen);
  // };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    setSnackbarMessage(isSaved ? 'Removed from saved items' : 'Added to saved items');
    setSnackbarOpen(true);
  };

  const skipAd = () => {
    setShowAd(false);
    setIsPlaying(true);
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Share functionality
  const handleShareOpen = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarMessage('Link copied to clipboard!');
    setSnackbarOpen(true);
    handleShareClose();
  };

  const shareOnPlatform = (platform) => {
    let url = '';
    const shareText = `Check out ${franchiseData[currentIndex].title} franchise opportunity!`;
    const shareUrl = window.location.href;

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        break;
      default:
        break;
    }

    window.open(url, '_blank');
    handleShareClose();
  };

  // Handle ad timer
  useEffect(() => {
    if (showAd) {
      const timer = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowAd(false);
            setIsPlaying(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showAd]);

  // Handle video play/pause
  useEffect(() => {
    if (isFullscreen) {
      // Fullscreen mode
      if (videoRefs.current[currentIndex]) {
        if (isPlaying) {
          videoRefs.current[currentIndex].play().catch(e => console.log("Auto-play prevented:", e));
        } else {
          videoRefs.current[currentIndex].pause();
        }
      }
    } else {
      // Preview mode
      if (previewPlayingIndex !== null && scrollContainerRef.current) {
        const video = scrollContainerRef.current.querySelector(`.preview-video[data-index="${previewPlayingIndex}"]`);
        if (video) {
          video.play().catch(e => console.log("Preview auto-play prevented:", e));
        }
      }
    }
  }, [isPlaying, currentIndex, isFullscreen, previewPlayingIndex]);

  // Auto-hide details after 5 seconds in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const timer = setTimeout(() => {
        setShowDetails(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isFullscreen]);

  // Handle preview video play/pause when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          if (entry.isIntersecting) {
            setPreviewPlayingIndex(index);
          } else {
            setPreviewPlayingIndex(null);
          }
        });
      },
      { threshold: 0.7 }
    );

    if (scrollContainerRef.current) {
      const videos = scrollContainerRef.current.querySelectorAll('.preview-video');
      videos.forEach(video => observer.observe(video));
    }

    return () => observer.disconnect();
  }, [franchiseData]);

  const showDetailsTemporarily = () => {
    if (isFullscreen) {
      setShowDetails(true);
      const timer = setTimeout(() => {
        setShowDetails(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Small Preview Grid */}
      {!isFullscreen && (
        <Box sx={{ position: 'relative', p: 2 }}>
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              gap: 2,
              scrollSnapType: 'x mandatory',
              '& > *': {
                scrollSnapAlign: 'start',
                flexShrink: 0
              }
            }}
          >
            {franchiseData.map((franchise, index) => (
              <Paper 
                key={franchise.id}
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  aspectRatio: '9/16',
                  width: isMobile ? '280px' : '320px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFullscreen(true);
                  checkForAd(index);
                }}
              >
                {/* Auto-playing video in preview */}
                <Box
                  component="video"
                  className="preview-video"
                  data-index={index}
                  src={franchise.videoUrl}
                  muted
                  loop
                  playsInline
                  autoPlay={false}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Overlay Content */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                }}>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {franchise.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PlayArrow sx={{ color: 'white', mr: 1 }} />
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                      Watch Promotion
                    </Typography>
                  </Box>
                </Box>

                {/* Ad indicator */}
                {index % 3 === 0 && index !== 0 && (
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5
                  }}>
                    <Typography variant="caption" color="white" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AdsClick fontSize="small" sx={{ mr: 0.5 }} /> Ad
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>

          {/* Scroll buttons for desktop */}
          {!isMobile && (
            <>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                onClick={handleScrollLeft}
              >
                <ArrowRightAlt sx={{ transform: 'rotate(180deg)' }} />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                onClick={handleScrollRight}
              >
                <ArrowRightAlt />
              </IconButton>
            </>
          )}
        </Box>
      )}

      {/* Fullscreen Reels View */}
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'black',
            overflow: 'hidden'
          }
        }}
      >
        <Box
          ref={fullscreenContainerRef}
          sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            touchAction: 'none',
            overflow: 'hidden'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          onClick={showDetailsTemporarily}
        >
          {/* Close Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showDetails ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
            }}
          >
            <IconButton
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
              onClick={() => setIsFullscreen(false)}
            >
              <Close />
            </IconButton>
          </motion.div>

          {/* Video Container */}
          <Box
            sx={{
              height: '100%',
              width: '100%',
              position: 'relative',
              transform: `translateY(-${currentIndex * 100}vh)`,
              transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform'
            }}
          >
            {franchiseData.map((franchise, index) => (
              <Box
                key={franchise.id}
                sx={{
                  height: '100vh',
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* Video Element */}
                <Box
                  component="video"
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={franchise.videoUrl}
                  muted={isMuted}
                  loop
                  playsInline
                  autoPlay={index === currentIndex}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />

                {/* Video Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, transparent 50%)'
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Ad Overlay */}
          {showAd && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.9)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                textAlign: 'center'
              }}
            >
              <Box
                component="video"
                src={adData.videoUrl}
                autoPlay
                muted
                loop
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: 2,
                  mb: 3
                }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={adData.logo} sx={{ mr: 2 }} />
                <Box>
                  <Chip 
                    label={`Sponsored`} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 0.5 }} 
                  />
                  <Typography variant="h6" color="white">
                    {adData.brand}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mb: 3, maxWidth: '400px' }}>
                {adData.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  onClick={() => {
                    window.open(adData.ctaLink, '_blank');
                  }}
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    fontWeight: 'bold'
                  }}
                >
                  {adData.cta}
                </Button>
                
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.7)'
                    }
                  }}
                  onClick={skipAd}
                >
                  Skip in {adTimer}s
                </Button>
              </Box>
            </Box>
          )}

          {/* Top Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {/* Bottom Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {/* Franchise Info Overlay */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ 
              opacity: showDetails ? 1 : 0,
              y: showDetails ? 0 : 20
            }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 3,
              padding: theme.spacing(3)
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 2 ,cursor: 'pointer' }}
              onClick={() => handleBrandLogoClick(franchiseData[currentIndex])}
            >
              <Box
      component="img"
      src={franchiseData[currentIndex]?.brandLogo || '/default-logo.jpg'}
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        objectFit: 'contain',
        border: '2px solid white'
      }}
      alt="Brand logo"
      onError={(e) => {
        e.target.src = '/default-logo.jpg'; // Fallback image
      }}
    />
              <Box>
                <Typography variant="h5" color="white" fontWeight="bolder">
                  {franchiseData[currentIndex]?.title}
                </Typography>
                <Typography variant="body2" color="white" sx={{ mb: 1 }}>
                  Established: {franchiseData[currentIndex]?.established}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex',
              gap: 1,
              mb: 2,
              flexWrap: 'wrap'
            }}>
             <Chip 
  label={`${franchiseData[currentIndex]?.category}`} 
  color="success" 
  size="small" 
  sx={{ fontWeight: 'bold' }} 
/>

              <Chip 
  label={Number.isNaN(franchiseData[currentIndex]?.investment) 
    ? 'Investment not specified' 
    : `₹${franchiseData[currentIndex]?.investment}`} 
  size="small"
  color="success"
/>
              <Chip 
                label={franchiseData[currentIndex]?.area} 
                size="small" 
                color="success"
                sx={{ 
                  fontWeight: 'bold'
                }} 
              />
            </Box>

           <Typography 
  variant="body1" 
  color="rgba(255,255,255,0.9)" 
  sx={{ 
    mb: 2,
    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
  }}
>
  {expandedDescription 
    ? franchiseData[currentIndex]?.description
    : `${franchiseData[currentIndex]?.description.substring(0, 150)}...`}
  <Button 
    onClick={() => setExpandedDescription(!expandedDescription)}
    sx={{
      color: 'white',
      textTransform: 'none',
      ml: 1,
      minWidth: 0,
      padding: 0,
      fontWeight: 'bold'
    }}
  >
    {expandedDescription ? 'Show less' : 'Read more'}
  </Button>
</Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                backgroundColor: 'success.main',
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': { 
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onClick={() => {
                handleApplyClick(franchiseData[currentIndex]);
              }}
            >
              Apply for Franchise
            </Button>
          </motion.div>

{selectedBrand && (
        <BrandDetailsModal 
          brand={selectedBrand} 
          open={brandDetailsOpen} 
          onClose={() => setBrandDetailsOpen(false)} 
          loading={isModalLoading}
        />
      )}

          {/* Right Side Actions */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ 
              opacity: showDetails ? 1 : 0.8,
              y: showDetails ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3,
              gap: '24px'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton 
                onClick={handleLike} 
                sx={{ 
                  color: isLiked ? theme.palette.error.main : 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Favorite fontSize="large" />
              </IconButton>
<Typography variant="caption" color="white" sx={{ mt: 0.5 }}>
  {Number.isNaN(franchiseData[currentIndex]?.likes) ? 0 : franchiseData[currentIndex]?.likes + (isLiked ? 1 : 0)}
</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton 
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Comment fontSize="large" />
              </IconButton>
              <Typography variant="caption" color="white" sx={{ mt: 0.5 }}>
                {franchiseData[currentIndex]?.comments}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton 
                onClick={handleShareOpen}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Share fontSize="large" />
              </IconButton>
              <Typography variant="caption" color="white" sx={{ mt: 0.5 }}>
                {franchiseData[currentIndex]?.shares}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton 
                onClick={toggleSave}
                sx={{ 
                  color: isSaved ? theme.palette.warning.main : 'white',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isSaved ? <Bookmark fontSize="large" /> : <BookmarkBorder fontSize="large" />}
              </IconButton>
              <Typography variant="caption" color="white" sx={{ mt: 0.5 }}>
                Save
              </Typography>
            </Box>
          </motion.div>

          {/* Share Menu */}
          <Menu
            anchorEl={shareAnchorEl}
            open={Boolean(shareAnchorEl)}
            onClose={handleShareClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }
            }}
          >
            <MenuItem onClick={() => shareOnPlatform('facebook')} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Facebook fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Share on Facebook</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => shareOnPlatform('twitter')} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Twitter fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Share on Twitter</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => shareOnPlatform('linkedin')} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <LinkedIn fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Share on LinkedIn</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => shareOnPlatform('whatsapp')} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <WhatsApp fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Share on WhatsApp</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => shareOnPlatform('email')} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Email fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Share via Email</ListItemText>
            </MenuItem>
            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
            <MenuItem onClick={copyToClipboard} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Link fontSize="medium" />
              </ListItemIcon>
              <ListItemText>Copy Link</ListItemText>
            </MenuItem>
          </Menu>

          {/* Play/Pause and Mute Controls */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <IconButton
              sx={{
                color: 'white',
                fontSize: '4rem',
                opacity: isPlaying ? 0 : 1,
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 1
                },
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(5px)'
              }}
              onClick={togglePlay}
            >
              {isPlaying ? <Pause fontSize="inherit" /> : <PlayArrow fontSize="inherit" />}
            </IconButton>

            <IconButton
              sx={{
                color: 'white',
                fontSize: '2rem',
                opacity: isMuted ? 0.7 : 1,
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 1
                },
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(5px)'
              }}
              onClick={toggleMute}
            >
              {isMuted ? <VolumeOff fontSize="inherit" /> : <VolumeUp fontSize="inherit" />}
            </IconButton>
          </Box>

          {/* Scroll Indicator (Dots at bottom) */}
          {/* <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 3
            }}
          >
            {franchiseData.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box> */}

          {/* Swipe Indicator */}
          {!showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                position: 'absolute',
                bottom: 60,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ mb: 1 }}>
                Swipe up for next
              </Typography>
              <ArrowUpward fontSize="small" />
            </motion.div>
          )}
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FranchiseReels;
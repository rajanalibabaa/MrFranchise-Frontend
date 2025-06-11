import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  PlayArrow,
  Pause,
  VolumeOff,
  VolumeUp,
  Favorite,
  Storefront,
  Business,
  MonetizationOn,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  openBrandDialog,
  toggleLikeBrand,
} from "../../Redux/Slices/brandSlice.jsx";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";

const BestBrandSlider = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const videoRefs = useRef([]);
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const [muteState, setMuteState] = useState({});
  const [playState, setPlayState] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likeProcessing, setLikeProcessing] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get brands and loading state from Redux
  const { data: brands = [], loading: brandsLoading } = useSelector(
    (state) => state.brands
  );

  // Memoized calculations
  const cardsPerSlide = useMemo(() => isMobile ? 1 : isTablet ? 2 : 3, [isMobile, isTablet]);
  const totalSlides = useMemo(() => Math.ceil(brands.length / cardsPerSlide), [brands.length, cardsPerSlide]);
  const cardWidth = useMemo(() => isMobile ? 280 : isTablet ? 320 : 340, [isMobile, isTablet]);

  const handleLikeClick = useCallback(async (brandId, isLiked) => {
    if (likeProcessing[brandId]) return;

    setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));
    try {
      await toggleLike(brandId, isLiked);
    } finally {
      setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
    }
  }, [likeProcessing]);

  const toggleLike = useCallback(async (brandId, isLiked) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      await dispatch(toggleLikeBrand({ brandId, isLiked })).unwrap();
    } catch (error) {
      console.error("Like operation failed:", error);
    }
  }, [dispatch]);

  const toggleMute = useCallback((index) => {
    setMuteState(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  const togglePlay = useCallback((index) => {
    setPlayState(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  const scrollToSlide = useCallback(
    (slideIndex) => {
      if (scrollRef.current) {
        const gap = 16;
        const scrollPosition = slideIndex * cardsPerSlide * (cardWidth + gap);
        scrollRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        setCurrentSlide(slideIndex);
      }
    },
    [cardWidth, cardsPerSlide]
  );

  const handleApply = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);

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
    if (!isHovered && brands.length > 0) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }
  }, [isHovered, handleNext, brands.length]);

  // Initialize video states when brands change
  useEffect(() => {
    if (brands.length > 0) {
      const initialMuteState = {};
      const initialPlayState = {};
      brands.forEach((_, index) => {
        initialMuteState[index] = true;
        initialPlayState[index] = false;
      });
      setMuteState(initialMuteState);
      setPlayState(initialPlayState);
    }
  }, [brands]);

  // Sync video play/pause with state
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (playState[index]) {
        video.play().catch(e => console.log("Auto-play prevented:", e));
      } else {
        video.pause();
      }
      video.muted = muteState[index];
    });
  }, [playState, muteState]);

  // Auto slide effect
  useEffect(() => {
    startAutoSlide();
    return () => clearTimeout(timeoutRef.current);
  }, [currentSlide, startAutoSlide]);

  if (brandsLoading && brands.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: isMobile ? 2 : 2,
        py: 1,
        maxWidth: "1400px",
        mx: "auto",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header and navigation buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{
            color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
            mb: 1,
            textAlign: "left",
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          Top Leading Franchise Brands
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              onClick={handlePrev}
              sx={{
                bgcolor: "#f0f0f0",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: "#f0f0f0",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Brands slider */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          pb: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {brands.map((brand, i) => {
          const videoUrl =
            brand?.brandDetails?.brandPromotionVideo?.[0] ||
            brand?.brandDetails?.franchisePromotionVideo?.[0];
          const logo =
            brand?.brandDetails?.brandLogo?.[0] ||
            brand?.brandDetails?.franchiseLogo?.[0];
          const franchiseModel = brand?.franchiseDetails?.modelsOfFranchise?.[0] || {};
          const categories = (brand?.personalDetails?.brandCategories || []).map(
            (cat) => cat.child
          );

          return (
            <Card
              key={brand.uuid || i}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              sx={{
                width: cardWidth,
                height: isMobile ? 420 : 450,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
                flexShrink: 0,
              }}
            >
              {/* Video section */}
              <Box sx={{ position: "relative", height: isMobile ? 180 : 200 }}>
                {videoUrl ? (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    src={videoUrl}
                    controls={false}
                    muted={muteState[i]}
                    autoPlay={false}
                    loop
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.palette.grey[300],
                    }}
                  >
                    <Typography>Video not available</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => toggleMute(i)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.8)",
                      p: 0.5,
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
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
                      bgcolor: "rgba(255,255,255,0.8)",
                      p: 0.5,
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
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

              <CardContent
                sx={{
                  flex: 1,
                  p: isMobile ? 1.5 : 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Brand Header */}
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar
                    src={logo}
                    sx={{
                      width: 50,
                      height: 50,
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ overflow: "hidden", flex: 1 }}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      fontWeight={700}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {brand.personalDetails?.brandName || "Unknown Brand"}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">
                        {categories.join(", ") || "N/A"}
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton
                    onClick={() => handleLikeClick(brand.uuid, brand.isLiked)}
                    disabled={likeProcessing[brand.uuid]}
                  >
                    {likeProcessing[brand.uuid] ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Favorite
                        sx={{
                          color: brand.isLiked
                            ? "#f44336"
                            : "rgba(0, 0, 0, 0.23)",
                        }}
                      />
                    )}
                  </IconButton>
                </Stack>

                {/* Key Metrics */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: isMobile ? 1 : 1,
                    mb: 1,
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Storefront sx={{ fontSize: 18, color: "orange" }} />
                      <Typography variant="body2">
                        <Box component="span" fontWeight="bold">
                          Type:{" "}
                        </Box>
                        {franchiseModel.franchiseType || "N/A"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Business sx={{ fontSize: 18, color: "orange" }} />
                      <Typography variant="body2">
                        <Box component="span" fontWeight="bold">
                          Area:{" "}
                        </Box>
                        {franchiseModel.areaRequired ? `${franchiseModel.areaRequired} sq.ft` : "N/A"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MonetizationOn sx={{ fontSize: 18, color: "orange" }} />
                      <Typography variant="body2">
                        <Box component="span" fontWeight="bold">
                          Investment:{" "}
                        </Box>
                        {franchiseModel.investmentRange || "N/A"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>

                {/* Apply Button */}
                <Button
                  variant="contained"
                  onClick={() => handleApply(brand)}
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    backgroundColor: "#f29724",
                    "&:hover": {
                      backgroundColor: "#e68a1e",
                      boxShadow: 2,
                    },
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    mt: "auto",
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Mobile navigation dots */}
      {isMobile && brands.length > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 2,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, i) => (
            <Box
              key={i}
              onClick={() => scrollToSlide(i)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: currentSlide === i ? "primary.main" : "grey.400",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      )}

      {/* Brand Details Dialog */}
      <BrandDetailsDialog />
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
});

export default BestBrandSlider;
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Avatar,
  Stack,
  Tooltip
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import PlaylistAddCheckCircleOutlined from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import ArrowRight from "@mui/icons-material/ArrowRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import Business from "@mui/icons-material/Business";
import AreaChart from "@mui/icons-material/AreaChart";
import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import LoginPage from "../../Pages/LoginPage/LoginPage";

import { postView } from "../../Utils/function/view";
import {useBrands, useToggleLike,openBrandDialog} from "../../Hooks/Fetchbrands"
import { showLoading } from "../../Redux/Slices/loadingSlice";
import { useDispatch } from "react-redux";


const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  desktop: { width: 327, height: 500 },
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const BrandCard = React.memo(
  ({
    brand,
    handleApply,
    handleLikeClick,
    likeProcessing,
    dimensions,
    theme,
    isMobile,
    isTablet,
  }) => {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef();

    const brandId = brand?.uuid || "";
    const franchiseModel = brand?.franchiseDetails?.fico?.[0] || {};
    const category = brand?.franchiseDetails?.brandCategories || {};
    const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
    const brandLogo = brand?.uploads?.brandLogo?.[0] || "";
    const brandName = brand?.brandDetails?.brandName || "Brand";
    const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;

    useEffect(() => {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (videoRef.current) {
        observerRef.current.observe(videoRef.current);
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);

    return (
      <motion.div
        key={brandId}
        variants={cardVariants}
        whileHover={{ scale: 1.03 }}
        style={{
          width: dimensions.width,
          flexShrink: 0,
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
            border: "1px solid #eee",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Box
            ref={videoRef}
            sx={{
              height: mediaHeight,
              width: "100%",
              overflow: "hidden",
              position: "relative",
              backgroundColor: theme.palette.grey[200],
            }}
          >
            {isVisible && videoUrl ? (
              <CardMedia
                component="video"
                loading="lazy"
                poster={brandLogo}
                src={videoUrl}
                alt={brandName}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                controls
                muted
                loop
                preload="none"
              />
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No video available
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1.5,
                  justifyContent: "space-between",
                }}
              >
                <Avatar
                  src={brandLogo}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "1px solid #eee",
                    flexShrink: 0,
                  }}
                />
                <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  flex: 1,
                                }}
                              >
                  {brandName}
                </Typography>
                <IconButton
                  onClick={() => handleLikeClick(brandId, brand?.isLiked)}
                  disabled={likeProcessing[brandId]}
                >
                  {likeProcessing[brandId] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Favorite
                      sx={{
                        color: brand?.isLiked
                          ? "#f44336"
                          : "rgba(0, 0, 0, 0.23)",
                      }}
                    />
                  )}
                </IconButton>
              </Box>

              {category?.child && (
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="space-between" 
                    alignItems="center" 
                  >
                    <Chip
                      label={category.child}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        color: "orange.dark",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />

                    <IconButton>
                      <Tooltip title={'ShortList'}><PlaylistAddCheckCircleOutlined /></Tooltip>
                    </IconButton>
                  </Stack>
                </Box>
              )}

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center">
                  <Business
                    sx={{
                      mr: 1.5,
                      fontSize: "1rem",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">
                    Franchise Type : {franchiseModel?.franchiseType || "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <MonetizationOn
                    sx={{
                      mr: 1.5,
                      fontSize: "1rem",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">
                    Investment :{" "}
                    {franchiseModel?.investmentRange || "Not specified"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AreaChart
                    sx={{
                      mr: 1.5,
                      fontSize: "1rem",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2">
                    Area : {franchiseModel?.areaRequired || "Not specified"}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 1 }} />
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
                    boxShadow: 2,
                  },
                  py: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Card>
      </motion.div>
    );
  }
);

const TopCafeFranchises = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isPaused = useRef(false);
  const scrollIntervalRef = useRef(null);
  const scrollRequestRef = useRef(null);

  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(false);

  const navigate = useNavigate();
const dispatch = useDispatch()
  // REACT-QUERY HOOKS
  const { data: brands = [], isLoading: brandsLoading, error } = useBrands();
  const toggleLike = useToggleLike();

  // Filter brands that belong to Coffee & Tea Cafes category
  const coffeeTeaBrands = useMemo(() => {
    const filtered = brands.filter((brand) => {
      const category = brand?.franchiseDetails?.brandCategories || {};
      const categoryName = category?.child?.toLowerCase() || "";
      const subCategory = category?.sub?.toLowerCase() || "";

      return (
        categoryName.includes("coffee") ||
        categoryName.includes("tea") ||
        categoryName.includes("cafe") ||
        subCategory.includes("beverage") ||
        subCategory === "beverage franchises"
      );
    });

    // Add the first few brands at the end to create infinite loop effect
    return [...filtered, ...filtered.slice(0, 4)];
  }, [brands]);

  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);

  const handleLikeClick = useCallback(
    (brandId, isLiked) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setShowLogin(true);
        return;
      }

      setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));
      toggleLike.mutate(
        { brandId, isLiked },
        {
          onSettled: () => {
            setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
          },
        }
      );
    },
    [toggleLike]
  );

  const handleApply = useCallback(
    (brand) => {
      postView(brand.uuid);
      openBrandDialog(brand);
    },
    [openBrandDialog]
  );

  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
    if (!scrollIntervalRef.current) {
      startAutoScroll();
    }
  }, []);

  // Calculate the scroll distance for 4 cards (including gap)
  const getScrollDistance = useCallback(() => {
    const cardWidthWithGap = dimensions.width + (isMobile ? 16 : 24);
    return cardWidthWithGap * 4;
  }, [dimensions.width, isMobile]);

  // Smooth scroll function
  const smoothScrollTo = useCallback((target) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    if (scrollRequestRef.current) {
      cancelAnimationFrame(scrollRequestRef.current);
    }

    const start = container.scrollLeft;
    const change = target - start;
    const startTime = performance.now();
    const duration = 5000; // 0.5 second scroll duration

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      container.scrollLeft = start + change * ease;

      if (progress < 1) {
        scrollRequestRef.current = requestAnimationFrame(animateScroll);
      } else {
        handleScroll(); // Update shadow states after scroll completes
        checkForLoop(); // Check if we need to loop back to start
      }
    };

    scrollRequestRef.current = requestAnimationFrame(animateScroll);
  }, []);

  // Check if we've scrolled to the duplicated items and need to loop back
  const checkForLoop = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    // If we're within 100px of the end, jump back to the equivalent position at the start
    if (container.scrollLeft >= maxScrollLeft - 100) {
      const originalBrandsCount = coffeeTeaBrands.length - 4; // Subtract the duplicated items
      const originalScrollWidth =
        originalBrandsCount * (dimensions.width + (isMobile ? 16 : 24));

      // Calculate equivalent position at the start
      const newScrollLeft = container.scrollLeft - originalScrollWidth;
      container.scrollLeft = newScrollLeft;
    }
  }, [coffeeTeaBrands.length, dimensions.width, isMobile]);

  // Handle next button click - scroll forward 4 cards
  const handleNextClick = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollDistance = getScrollDistance();
    const newScrollLeft = container.scrollLeft + scrollDistance;

    smoothScrollTo(newScrollLeft);
  }, [getScrollDistance, smoothScrollTo]);

  // Handle previous button click - scroll backward 4 cards
  const handlePrevClick = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollDistance = getScrollDistance();
    const newScrollLeft = container.scrollLeft - scrollDistance;

    // If we're at the start, jump to near the end (before the duplicated items)
    if (newScrollLeft <= 0) {
      const originalBrandsCount = coffeeTeaBrands.length - 4; // Subtract the duplicated items
      const originalScrollWidth =
        originalBrandsCount * (dimensions.width + (isMobile ? 16 : 24));
      const clientWidth = container.clientWidth;
      smoothScrollTo(originalScrollWidth - clientWidth);
    } else {
      smoothScrollTo(newScrollLeft);
    }
  }, [
    coffeeTeaBrands.length,
    dimensions.width,
    getScrollDistance,
    isMobile,
    smoothScrollTo,
  ]);

  // Enhanced auto-scroll with 2-card movement
  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    scrollIntervalRef.current = setInterval(() => {
      if (isPaused.current || !scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollDistance = getScrollDistance() / 2; // Scroll 2 cards at a time (half of 4)
      const newScrollLeft = container.scrollLeft + scrollDistance;

      smoothScrollTo(newScrollLeft);
    }, 5000); // Scroll every 5 seconds
  }, [getScrollDistance, smoothScrollTo]);

  // Easing function for smooth scrolling
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Track scroll position for shadow effects
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowStartShadow(scrollLeft > 10);
    setShowEndShadow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Initialize and clean up
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();

      if (coffeeTeaBrands.length > 0) {
        startAutoScroll();
      }
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      if (scrollRequestRef.current) {
        cancelAnimationFrame(scrollRequestRef.current);
      }
    };
  }, [coffeeTeaBrands.length, handleScroll, startAutoScroll]);

  if (brandsLoading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">
          {error.message || "Failed to load brands."}
        </Typography>
      </Box>
    );
  }

  // Only show if we have at least one brand (excluding duplicates)
  const shouldShow = coffeeTeaBrands.length > 4;

  return (
    <>
      {shouldShow && (
        <Box
          sx={{
            py: isMobile ? 1 : 2,
            px: isMobile ? 0 : 2,
            maxWidth: isMobile ? "100%" : 1400,
            mx: "auto",
            mb: isMobile ? 0 : 2,
            position: "relative",
          }}
          ref={containerRef}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              px: isMobile ? 2 : 0,
            }}
          >
            <Typography
              variant={isMobile ? "body1" : "h5"}
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
                  background:
                    theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                  mt: 1,
                  borderRadius: 2,
                },
              }}
            >
              Top Coffee & Tea Cafes Brands
            </Typography>

            <Button
              variant="text"
              size="small"
              endIcon={<ArrowRight />}
              sx={{
                textTransform: "none",
                fontSize: isMobile ? 14 : 16,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                  backgroundColor: "transparent",
                },
              }}
              onClick={async () => {
                dispatch(showLoading());
                navigate("/brandviewpage");
              }}
            >
              View More
            </Button>
          </Box>

          <Box sx={{ position: "relative", px: isMobile ? 2 : 0 }}>
            {/* Previous button */}
            {showStartShadow && (
              <Button
                variant="contained"
                onClick={handlePrevClick}
                sx={{
                  position: "absolute",
                  left: isMobile ? 4 : -12,
                  top: `calc(50% + ${isMobile ? 20 : 40}px)`,
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  minWidth: "36px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  padding: 0,
                  backgroundColor: "background.paper",
                  color: "text.primary",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    backgroundColor: "background.default",
                  },
                }}
              >
                &lt;
              </Button>
            )}

            {/* Next button */}
            {showEndShadow && (
              <Button
                variant="contained"
                onClick={handleNextClick}
                sx={{
                  position: "absolute",
                  right: isMobile ? 4 : -12,
                  top: `calc(50% + ${isMobile ? 20 : 40}px)`,
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  minWidth: "36px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  padding: 0,
                  backgroundColor: "background.paper",
                  color: "text.primary",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    backgroundColor: "background.default",
                  },
                }}
              >
                &gt;
              </Button>
            )}

            <Box
              component={motion.div}
              initial="initial"
              animate="animate"
              ref={scrollContainerRef}
              sx={{
                display: "flex",
                gap: isMobile ? 2 : 3,
                borderRadius: 3,
                p: 2,
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                perspective: "1000px",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {coffeeTeaBrands.map((brand, index) => (
                <motion.div
                  key={`${brand?.uuid}-${index}`} // Add index to key to handle duplicates
                  whileHover={{
                    scale: 1.03,
                    zIndex: 10,
                    boxShadow: theme.shadows[6],
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BrandCard
                    brand={brand}
                    handleApply={handleApply}
                    handleLikeClick={handleLikeClick}
                    likeProcessing={likeProcessing}
                    dimensions={dimensions}
                    theme={theme}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>

          {showLogin && (
            <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
          )}
        </Box>
      )}
    </>
  );
};

export default React.memo(TopCafeFranchises);

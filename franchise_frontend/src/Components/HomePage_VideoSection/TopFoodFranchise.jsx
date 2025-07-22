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
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import ArrowRight from "@mui/icons-material/ArrowRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import PlaylistAddCheckCircleOutlined from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import Business from "@mui/icons-material/Business";
import AreaChart from "@mui/icons-material/AreaChart";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { postView } from "../../Utils/function/view";
import { useBrands, useToggleLike, openBrandDialog } from "../../Hooks/Fetchbrands";

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

    const brandId = brand.uuid;
    const franchiseModel = brand.franchiseDetails?.fico?.[0] || {};
    const category = brand.franchiseDetails?.brandCategories || {};
    const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
    const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;

    // Extract brand details with fallbacks
    const brandDetails = brand.brandDetails || {};
    const {
      brandName = "N/A",
      tagLine = "",
      companyName = "N/A",
    } = brandDetails;

    // Extract franchise details with fallbacks
    const {
      investmentRange = "Not specified",
      areaRequired = "Not specified",
      franchiseType = "N/A",
      franchiseModel: modelType = "N/A",
      franchiseFee = "N/A",
      royaltyFee = "N/A",
      roi = "N/A",
      payBackPeriod = "N/A",
    } = franchiseModel;

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
          {/* Video/Image Section */}
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
                poster={brand?.uploads?.brandLogo?.[0] || ""}
                loading="lazy"
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
                  backgroundColor: theme.palette.grey[300],
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No media available
                </Typography>
              </Box>
            )}
          </Box>

          {/* Content Section */}
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <CardContent sx={{ pb: 1 }}>
              {/* Brand Header */}
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
                  src={brand?.uploads?.brandLogo?.[0]}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "1px solid #eee",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Tooltip title={brandName} placement="top">
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
                  </Tooltip>
                </Box>
                <IconButton
                  onClick={() => handleLikeClick(brand.uuid, brand.isLiked)}
                  disabled={likeProcessing[brand.uuid]}
                  sx={{ ml: 1 }}
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
              </Box>

              {/* Categories */}
              {(category.main || category.child) && (
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ flexWrap: "wrap" }}
                  >
                    {category.child && (
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
                    )}
                    <IconButton>
                      <Tooltip title={'ShortList'}><PlaylistAddCheckCircleOutlined /></Tooltip>
                    </IconButton>
                  </Stack>
                </Box>
              )}

              {/* Franchise Details */}
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
                    <strong>Investment:</strong> {investmentRange}
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
                    <strong>Area:</strong> {areaRequired}
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
                    <strong>Type:</strong> {modelType}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 1 }} />
            </CardContent>

            {/* Action Button */}
            <Box sx={{ px: 2, pb: 2, mt: "auto" }}>
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
                View Full Details
              </Button>
            </Box>
          </Box>
        </Card>
      </motion.div>
    );
  }
);

const TopFoodFranchises = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);

  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: brands = [], isLoading: brandsLoading, error } = useBrands();
  const toggleLike = useToggleLike();

  // Filter food franchises
  const foodBrands = useMemo(() => {
    return brands.filter((brand) => {
      const category = brand.franchiseDetails?.brandCategories || {};
      return category.sub === "Food Franchises";
    });
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
    const duration = 500; // 0.5 second scroll duration

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      container.scrollLeft = start + change * ease;

      if (progress < 1) {
        scrollRequestRef.current = requestAnimationFrame(animateScroll);
      } else {
        handleScroll(); // Update shadow states after scroll completes
      }
    };

    scrollRequestRef.current = requestAnimationFrame(animateScroll);
  }, []);

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

    smoothScrollTo(newScrollLeft);
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
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (scrollRequestRef.current) {
        cancelAnimationFrame(scrollRequestRef.current);
      }
    };
  }, [handleScroll]);

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

  // Only show if we have brands
  const shouldShow = foodBrands.length > 0;

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
              Top Food Brands
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
                window.open('/brandviewpage', '_blank');            
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
                  backgroundColor: "#98dd2e",
                  color: "white",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    backgroundColor: "#b7f92b",
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
                  backgroundColor: "#98dd2e",
                  color: "white",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    backgroundColor: "#b7f92b",
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
            >
              {foodBrands.map((brand) => (
                <motion.div
                  key={brand.uuid}
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

export default React.memo(TopFoodFranchises);
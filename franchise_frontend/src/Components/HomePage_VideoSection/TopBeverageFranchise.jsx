import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import ArrowRight from "@mui/icons-material/ArrowRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import Business from "@mui/icons-material/Business";
import AreaChart from "@mui/icons-material/AreaChart";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import {
  fetchBrands,
  openBrandDialog,
  toggleLikeBrand,
} from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";

const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  desktop: { width: 327, height: 500 },
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const BrandCard = React.memo(({ 
  brand, 
  handleApply, 
  handleLikeClick, 
  likeProcessing, 
  dimensions,
  theme,
  isMobile,
  isTablet
}) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef();

  const brandId = brand.uuid;
  const franchiseModels = brand.franchiseDetails?.modelsOfFranchise || [];
  const firstModel = franchiseModels[0] || {};
  const categories = brand.personalDetails?.brandCategories || [];
  const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
                  brand?.brandDetails?.franchisePromotionVideo?.[0];
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
              src={videoUrl}
              alt={brand.personalDetails?.brandName || "Brand"}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
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
                src={brand?.brandDetails?.brandLogo?.[0]}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid #eee",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {brand.personalDetails?.brandName}
              </Typography>
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
            </Box>

            {categories.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {categories.slice(0, 3).map((category, index) => (
                    <Chip
                      key={index}
                      label={category.child}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        color: "orange.dark",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                  ))}
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
                  Franchise Type : {firstModel.franchiseType || "N/A"}
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
                  Investment : {firstModel.investmentRange || "Not specified"}
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
                  Area : {firstModel.investmentRange || "Not specified"}
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
});

const TopBeverageFranchises = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const isPaused = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: brands = [] } = useSelector((state) => state.brands);

  // Filter brands that belong to Beverage Franchise subcategory
// Filter brands that belong to Beverage Franchise subcategory and all its child categories
const beverageBrands = useMemo(() => {
  return brands.filter(brand => {
    const categories = brand.personalDetails?.brandCategories || [];
    return categories.some(cat => {
      // Check if the subcategory is "Beverage Franchises" 
      // OR if the parent category is "Food & Beverages" and subcategory is related to beverages
      return (
        // cat.sub === "Beverage Franchises" 
        cat.sub=== "Beverage Franchises"
       
      );
    });
  });
}, [brands]);

  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);

  const initializeData = useCallback(() => {
    try {
      if (!beverageBrands || beverageBrands.length === 0) {
        setError("No beverage franchises found.");
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Failed to process brands data.");
      console.error("Error processing brands:", err);
    } finally {
      setLoading(false);
    }
  }, [beverageBrands]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleLikeClick = useCallback(async (brandId, isLiked) => {
    if (likeProcessing[brandId]) return;

    setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
    try {
      await toggleLike(brandId, isLiked);
    } finally {
      setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
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

  const handleApply = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);

  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: isMobile ? 1 : 2,
        px: isMobile ? 0 : 2,
        maxWidth: isMobile ? "100%" : 1400,
        mx: "auto",
        mb: isMobile ? 0 : 2,
      }}
      ref={containerRef}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
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
              background: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
        Top Beverage Franchises
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
          onClick={() => navigate("/brandviewpage")}
        >
          View More
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
          p: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {beverageBrands.map((brand) => (
          <BrandCard 
            key={brand.uuid}
            brand={brand}
            handleApply={handleApply}
            handleLikeClick={handleLikeClick}
            likeProcessing={likeProcessing}
            dimensions={dimensions}
            theme={theme}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        ))}
      </Box>
      <BrandDetailsDialog />
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default React.memo(TopBeverageFranchises);
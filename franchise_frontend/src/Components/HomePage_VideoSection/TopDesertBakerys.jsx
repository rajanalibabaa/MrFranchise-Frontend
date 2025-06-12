import React, { useEffect, useRef, useState } from "react";
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
import {
  ArrowRight,
  MonetizationOn,
  Business,
  AreaChart,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import {
  fetchBrands,
  openBrandDialog,
  toggleLikeBrand,
} from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const NewlyRegisteredBrandsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPaused = useRef(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: brands = [] } = useSelector((state) => state.brands);

  const CARD_DIMENSIONS = {
    mobile: { width: 280, height: 520 },
    tablet: { width: 320, height: 560 },
    desktop: { width: 327, height: 500 },
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!brands || brands.length === 0) {
          setError("No brands found.");
        } else {
          setError(null);
        }
      } catch (err) {
        setError("Failed to process brands data.");
        console.error("Error processing brands:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [brands]);

  const handleLikeClick = async (brandId, isLiked) => {
    if (likeProcessing[brandId]) return;

    setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));
    try {
      await toggleLike(brandId, isLiked);
    } finally {
      setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
    }
  };

  const toggleLike = async (brandId, isLiked) => {
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
  };

  const getCardDimensions = () => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  };

  const handleApply = (brand) => {
    dispatch(openBrandDialog(brand));
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  // Auto-rotate brands
  useEffect(() => {
    if (brands.length <= 2) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        // This was causing unnecessary re-renders
        // Consider alternative approaches if you need carousel functionality
        // setBrands((prev) => [...prev.slice(1), prev[0]]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [brands]);

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

  const { width: cardWidth, height: cardHeight } = getCardDimensions();
  const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;

  return (
    <Box
      sx={{
        py: isMobile ? 1 : 2,
        px: isMobile ? 0 : 2,
        maxWidth: isMobile ? "100%" : 1400,
        mx: "auto",
        mb: isMobile ? 0 : 2,
      }}
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
          Top Desert And Bakeries
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
        {brands.map((brand) => {
          const brandId = brand.uuid;
          const franchiseModels =
            brand.franchiseDetails?.modelsOfFranchise || [];
          const firstModel = franchiseModels[0] || {};
          const categories = brand.personalDetails?.brandCategories || [];
          const videoUrl =
            brand?.brandDetails?.brandPromotionVideo?.[0] ||
            brand?.brandDetails?.franchisePromotionVideo?.[0];

          return (
            <motion.div
              key={brandId}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              style={{
                width: cardWidth,
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
                  sx={{
                    height: mediaHeight,
                    width: "100%",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  {videoUrl ? (
                    <CardMedia
                      component="video"
                      loading="lazy"
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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
                        onClick={() =>
                          handleLikeClick(brand.uuid, brand.isLiked)
                        }
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
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ flexWrap: "wrap" }}
                        >
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
                          Investment :{" "}
                          {firstModel.investmentRange || "Not specified"}
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
        })}
      </Box>
      <BrandDetailsDialog />
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default NewlyRegisteredBrandsSection;
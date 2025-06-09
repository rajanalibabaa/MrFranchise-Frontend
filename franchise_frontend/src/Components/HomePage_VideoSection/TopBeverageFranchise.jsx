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
  Grid,
  Collapse,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowRight,
  MonetizationOn,
  Business,
  AreaChart,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { openBrandDialog, viewApi,toggleLikeBrand,fetchBrands } from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const NewlyRegisteredBrandsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPaused = useRef(false);
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});

  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: brand = [] } = useSelector((state) => state.brands);

  const CARD_DIMENSIONS = {
    mobile: { width: 280, height: 520 },
    tablet: { width: 320, height: 560 },
    desktop: { width: 327, height: 500 },
  };


const handleLikeClick = async (brandId, isLiked) => {
    if (likeProcessing[brandId]) return;

    setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));
    try {
      await toggleLike(brandId,isLiked);
    } finally {
      setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
    }

    console.log("isLiked :", isLiked);
    console.log("brandId :", brandId);
  };
  const toggleLike = async (brandId, isLiked) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowLogin(true);
      return;
    }
    console.log("isliked === :", isLiked);
    console.log("brandId :", brandId);
    try {
      await dispatch(toggleLikeBrand({ brandId, isLiked })).unwrap();
      // Optionally show success message
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
        dispatch(viewApi(brand.uuid))
    console.log("Apply", brand);
    // Replace with actual apply logic
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  const toggleExpandBrand = (brandId) => {
    setExpandedBrand(expandedBrand === brandId ? null : brandId);
  };

  const toggleExpandLocations = (brandId) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  };
  //like toggle



  //   try {
  //     const uuid = brand.map(async (value, id) => {
  //       if (value.uuid === brandId) {
  //         await dispatch(toggleLikeBrand({ brandId, isLiked })).unwrap();
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Like operation failed:", error);
  //   }
  // };

  // Function to format location states
  // const formatLocations = (brand) => {
  //   const states = brand.personalDetails?.states || [];
  //   const brandId = brand.uuid;
  //   const isExpanded = expandedLocations[brandId];

  //   if (states.length === 0) return "Multiple locations";

  //   if (states.length <= 2) {
  //     return states.join(", ");
  //   }

  //   if (isExpanded) {
  //     return (
  //       <>
  //         {states.join(", ")}
  //         <Typography
  //           component="span"
  //           sx={{
  //             color: 'primary.main',
  //             cursor: 'pointer',
  //             fontWeight: 500,
  //             ml: 1
  //           }}
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             toggleExpandLocations(brandId);
  //           }}
  //         >
  //           Less
  //         </Typography>
  //       </>
  //     );
  //   }

  //   return (
  //     <>
  //       {states.slice(0, 2).join(", ")}
  //       <Typography
  //         component="span"
  //         sx={{
  //           color: 'primary.main',
  //           cursor: 'pointer',
  //           fontWeight: 500,
  //           ml: 1
  //         }}
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           toggleExpandLocations(brandId);
  //         }}
  //       >
  //         +{states.length - 2} more
  //       </Typography>
  //     </>
  //   );
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = dispatch(fetchBrands());

        if (response) {
          setBrands(brand);
          setError(null);

          // Initialize expanded locations state
          const initialExpandedState = {};
          brand.forEach((brand) => {
            if (brand.uuid) {
              initialExpandedState[brand.uuid] = false;
            }
          });
          setExpandedLocations(initialExpandedState);
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

  // Auto-rotate brands
  useEffect(() => {
    if (brands.length <= 2) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setBrands((prev) => [...prev.slice(1), prev[0]]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [brands]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

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
          Top Beverage Franchise
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
        {brand.map((brand) => {
          const brandId = brand.uuid;
          const isExpanded = expandedBrand === brandId;
          const franchiseModels =
            brand.franchiseDetails?.modelsOfFranchise || [];
          const firstModel = franchiseModels[0] || {};
          const categories = brand.personalDetails?.brandCategories || [];

          // Get the first available video URL
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
                {/* Media Container with Strict Dimensions */}
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

                {/* Card Content */}
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
                        onClick={() => handleLikeClick(brand)}
                        disabled={likeProcessing[brand.uuid]}
                        sx={{ ml: 1, p: 0.5 }}
                      >
                        {likeProcessing[brand.uuid] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Favorite
                            sx={{
                              color: brand.isLiked
                                ? "#f44336"
                                : "rgba(0,0,0,0.23)",
                              transition: "color 0.3s",
                            }}
                          />
                        )}
                      </IconButton>
                    </Box>

                    {/* Categories */}
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

                    {/* Basic Info */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {/* <Box display="flex" alignItems="center">
                        <LocationOn sx={{ 
                          mr: 1.5, 
                          fontSize: "1rem", 
                          color: "text.secondary",
                          flexShrink: 0
                        }} />
                        <Typography variant="body2">
                          {formatLocations(brand)}
                        </Typography>
                      </Box> */}

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

                  {/* Apply Button */}
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
}

export default NewlyRegisteredBrandsSection;

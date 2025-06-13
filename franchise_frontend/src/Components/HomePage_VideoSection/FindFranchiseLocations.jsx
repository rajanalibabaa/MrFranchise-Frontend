import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Grid,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrands,
  openBrandDialog,
  toggleLikeBrand,
} from "../../Redux/Slices/brandSlice";
import LoginPage from "../../Pages/LoginPage/LoginPage";

// Animation variants for cards
const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const TopInvestVdo2 = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [selectedLocation, setSelectedLocation] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const isPaused = useRef(false);

  // Redux state
  const { data: brands = [], loading, error } = useSelector((state) => state.brands);

  // Memoized values
  const CARD_DIMENSIONS = useMemo(() => ({
    width: isMobile ? 300 : isTablet ? 320 : 320,
    height: 460,
    videoHeight: 200,
    avatarSize: isMobile ? 40 : 50,
  }), [isMobile, isTablet]);

  // Handle like/unlike action
  const handleLikeClick = useCallback(async (brandId, isLiked) => {
    if (likeProcessing[brandId]) return;

    setLikeProcessing((prev) => ({ ...prev, [brandId]: true }));
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setShowLogin(true);
        return;
      }
      await dispatch(toggleLikeBrand({ brandId, isLiked })).unwrap();
    } finally {
      setLikeProcessing((prev) => ({ ...prev, [brandId]: false }));
    }
  }, [dispatch, likeProcessing]);

  // Filter brands by location
  const filteredBrands = useMemo(() => {
    return selectedLocation && selectedLocation !== "All Locations"
      ? brands.filter((brand) => brand.locations?.includes(selectedLocation))
      : brands;
  }, [brands, selectedLocation]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (brands) {
          const locationsSet = new Set();
          brands.forEach((brand) => {
            const expansionLocations = brand?.personalDetails?.expansionLocation?.map(loc => loc.city) || 
                                     brand?.brandDetails?.expansionLocations || [];
            expansionLocations.forEach(loc => locationsSet.add(loc));
          });

          setAllLocations(["All Locations", ...Array.from(locationsSet).sort()]);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    initializeData();
  }, [brands]);

  // Auto-rotate brands effect (removed as it was causing unnecessary re-renders)
  // Consider implementing this differently if needed

  // Brand card component
  const BrandCard = React.memo(({ brand }) => {
    const {
      uuid: brandId,
      isLiked,
      personalDetails,
      brandDetails,
      franchiseDetails,
      displayLocation,
    } = brand;

    const franchiseModel = franchiseDetails?.modelsOfFranchise?.[0] || {};
    const videoUrl = brandDetails?.brandPromotionVideo?.[0] || 
                    brandDetails?.franchisePromotionVideo?.[0];
    const category = personalDetails?.brandCategories?.[0]?.child || "No category";

    return (
      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.03 }}
        style={{
          minWidth: CARD_DIMENSIONS.width,
          flexShrink: 0,
        }}
      >
        <Card sx={{
          width: CARD_DIMENSIONS.width,
          height: CARD_DIMENSIONS.height,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
            transform: "translateY(-4px)",
          },
        }}>
          {/* Media Section */}
          <Box sx={{
            position: "relative",
            height: CARD_DIMENSIONS.videoHeight,
            backgroundColor: "#000",
          }}>
            {videoUrl ? (
              <CardMedia
                component="video"
                loading="lazy"
                src={videoUrl}
                alt={personalDetails?.brandName || "Brand"}
                sx={{
                  width: "100%",
                  height: `${CARD_DIMENSIONS.videoHeight}px`,
                  objectFit: "cover",
                }}
                controls
                muted
                loop
                playsInline
              />
            ) : (
              <Box sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.primary.light,
              }}>
                <Typography variant="body2" color="text.primary">
                  Video not available
                </Typography>
              </Box>
            )}

            <Chip
              label={displayLocation}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />

            <IconButton
              onClick={() => handleLikeClick(brandId, isLiked)}
              disabled={likeProcessing[brandId]}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              }}
            >
              {likeProcessing[brandId] ? (
                <CircularProgress size={24} />
              ) : (
                <FavoriteBorderIcon
                  sx={{
                    color: isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                  }}
                />
              )}
            </IconButton>
          </Box>

          {/* Content Section */}
          <CardContent sx={{
            flex: 1,
            p: isMobile ? 1.5 : 1,
            "&:last-child": { pb: isMobile ? 1.5 : 1 },
            display: "flex",
            flexDirection: "column",
            mb: 2
          }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar
                src={brandDetails?.brandLogo?.[0]}
                sx={{
                  width: CARD_DIMENSIONS.avatarSize,
                  height: CARD_DIMENSIONS.avatarSize,
                  border: "2px solid white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  fontWeight={700}
                  noWrap
                >
                  {personalDetails?.brandName}
                </Typography>
                <Chip
                  label={category}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.1)",
                    color: "orange.dark",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Stack>

            {/* Key Metrics */}
            <Paper
              variant="outlined"
              sx={{
                p: isMobile ? 1 : 1,
                mb: 1,
                borderRadius: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <StorefrontIcon sx={{ fontSize: 18, color: "orange" }} />
                    <Box display="flex" gap={6}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                        Type:
                      </Typography>
                      <Typography variant={isMobile ? "caption" : "body2"}>
                        {franchiseModel.franchiseType || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessIcon sx={{ fontSize: 18, color: "orange" }} />
                    <Box display="flex" gap={7}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                        Area:
                      </Typography>
                      <Typography variant={isMobile ? "caption" : "body2"}>
                        {franchiseModel.areaRequired || "N/A"} sq.ft
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MonetizationOnIcon sx={{ fontSize: 18, color: "orange" }} />
                    <Box display="flex" gap={2}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                        Investment:
                      </Typography>
                      <Typography variant={isMobile ? "caption" : "body2"}>
                        {franchiseModel.investmentRange || "N/A"} - INR
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            <Button
              variant="contained"
              onClick={() => dispatch(openBrandDialog(brand))}
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{
                backgroundColor: "orange",
                "&:hover": {
                  backgroundColor: "#ff9800",
                  boxShadow: 2,
                },
                py: isMobile ? 1 : 1,
                px: isMobile ? 2 : 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: isMobile ? "0.875rem" : "1rem",
                mt: "auto",
              }}
            >
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  });

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: isMobile ? 2 : 4,
      maxWidth: 1400,
      mx: "auto",
      overflow: "hidden",
    }}>
      {/* Header with Filter */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        flexWrap: "wrap",
        gap: 2,
      }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{
            color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
            mb: 3,
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
          Find Franchise At Your Locations
        </Typography>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "100%" : "auto",
        }}>
          <FormControl sx={{ minWidth: isMobile ? "100%" : 200 }} size="small">
            <InputLabel id="location-label">Filter by Location</InputLabel>
            <Select
              labelId="location-label"
              value={selectedLocation}
              label="Filter by Location"
              onChange={(e) => setSelectedLocation(e.target.value)}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              {allLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" color="text.secondary">
            {filteredBrands.length} {filteredBrands.length === 1 ? "Opportunity" : "Opportunities"} Available
          </Typography>
        </Box>
      </Box>

      {/* Brand Cards */}
      <Box
        component={motion.div}
        initial="initial"
        animate="animate"
        sx={{
          display: "flex",
          gap: isMobile ? 2 : 3,
          p: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        onMouseEnter={() => isPaused.current = true}
        onMouseLeave={() => isPaused.current = false}
      >
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.uuid} brand={brand} />
        ))}
      </Box>

      <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
    </Box>
  );
});

export default TopInvestVdo2; 
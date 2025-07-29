import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import Close from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { postView } from "../../Utils/function/view";
import { openBrandDialog } from "../../Hooks/Fetchbrands";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "../../Api/api";
import img from "../../assets/images/brandLogo.jpg";
import { useBrands } from "../../Hooks/Fetchbrands";
import { shuffleArray } from "./ShuffleData";
 
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
  const franchiseModel = brand.franchiseDetails?.fico?.[0] || {};
  const category = brand.franchiseDetails?.brandCategories || {};
  const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
  const brandLogo = brand?.uploads?.brandLogo?.[0] || img;
  const brandName = brand.brandDetails?.brandName || "Unnamed Brand";
  const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;
 
     const {
      investmentRange = "Not specified",
      areaRequired = "Not specified",
      // franchiseType = "N/A",
      franchiseModel: modelType = "N/A",
      // franchiseFee = "N/A",
      // royaltyFee = "N/A",
      // roi = "N/A",
      // payBackPeriod = "N/A",
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
            <CardMedia
              component="img"
              image={brandLogo}
              alt={brandName}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
         
          {/* Like button */}
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2
          }}>
            <IconButton
              onClick={() => handleLikeClick(brandId)}
              disabled={likeProcessing[brandId]}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                p: 0.5,
                '&:hover': {
                  backgroundColor: '#fff',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {likeProcessing[brandId] ? (
                <CircularProgress size={24} />
              ) : (
                <Favorite
                  sx={{
                    color: brand.isLiked ? '#f44336' : 'rgba(0, 0, 0, 0.54)',
                    transition: 'all 0.3s ease'
                  }}
                />
              )}
            </IconButton>
          </Box>
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
                src={brandLogo}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid #eee",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {brandName}
                </Typography>
              </Box>
            </Box>
 
            {/* Categories */}
            {(category.main || category.child) && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
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
          <Box sx={{ px: 2, pb: 2, mt: 'auto' }}>
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
});
 
const LikedBrands = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
 
  const [likeProcessing, setLikeProcessing] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const [localLikedBrands, setLocalLikedBrands] = useState([]);
  const [shuffledBrands, setShuffledBrands] = useState([]);
 
  const navigate = useNavigate();
  const id = localStorage.getItem ("id") || localStorage.getItem ("brandUUID") || useSelector((state) => state.auth?.investorUUID) || useSelector((state) => state.auth?.brandUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
 
  const { data: brands = [], isLoading, error, refetch } = useBrands();
 
  // Initialize local liked brands when brands data changes
useEffect(() => {
  if (brands.length > 0) {
    const liked = brands.filter(brand => brand.isLiked === true);
    setLocalLikedBrands(liked);
    setShuffledBrands(shuffleArray(liked));
    // console.log("Local Liked Brands:", liked); // Moved inside
  }
}, [brands]);
 
  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);
 
  const handleLikeClick = useCallback(async (brandId) => {
    if (likeProcessing[brandId] || !id || !AccessToken) return;
   
    setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
 
    try {
      await axios.delete(
        `${api.likeApi.delete}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          data: { brandID: brandId },
          
        }
      );
     
      // Update local state immediately for better UX
      setLocalLikedBrands(prev => prev.filter(brand => brand.uuid !== brandId));
      setShuffledBrands(prev => prev.filter(brand => brand.uuid !== brandId));
      // setRemoveMsg("Brand removed successfully");
     
      // Refetch data to ensure consistency with server
      await refetch();
     
      setTimeout(() => setRemoveMsg(""), 3000);
    } catch (error) {
      console.error("Remove error:", error);
      setRemoveMsg("Failed to remove brand");
    } finally {
      setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
    }
  }, [likeProcessing, id, AccessToken, refetch]);
 
  const handleApply = useCallback((brand) => {
    postView(brand.uuid);
    openBrandDialog(brand);
  }, []);
 
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
 
  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 10,
        textAlign: 'center'
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Error loading brands
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }
 
 

 
  return (
    <>
    {id && localLikedBrands.length > 4 && (
      <Box sx={{
      py: isMobile ? 1 : 2,
      px: isMobile ? 0 : 2,
      maxWidth: isMobile ? "100%" : 1400,
      mx: "auto",
      mb: isMobile ? 0 : 2,
    }}>
      {removeMsg && (
        <Box sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: '#4caf50',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography>{removeMsg}</Typography>
          <IconButton size="small" onClick={() => setRemoveMsg("")}>
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      )}
     
      
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
          Liked Brands
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
        >
          {shuffledBrands.map((brand) => (
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
     
    </Box>
    )}
    </>
  );
};
 
export default LikedBrands;
 
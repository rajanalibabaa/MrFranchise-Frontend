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
import { useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../Api/api";
import { openBrandDialog } from "../../Hooks/Fetchbrands";
 
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
  handleViewDetails,
  // handleToggleLike,
  // likeProcessing,
  dimensions,
  theme,
  isMobile,
  isTablet,
  // likedStates
}) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef();
 
  const brandId = brand?.uuid || '';
  const franchiseModel = brand?.franchiseDetails?.fico?.[0] || {};
  const category = brand?.franchiseDetails?.brandCategories || {};
  const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
  const brandLogo = brand?.uploads?.brandLogo?.[0] || '';
  const brandName = brand?.brandDetails?.brandName || 'Brand';
  const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;
  // const isLiked = likedStates[brandId] || false;
 
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
                variant="h6"
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
              {/* <IconButton
                onClick={() => handleToggleLike(brandId)}
                disabled={likeProcessing[brandId]}
              >
                {likeProcessing[brandId] ? (
                  <CircularProgress size={24} />
                ) : (
                  <Favorite
                    sx={{
                      color: isLiked
                        ? "#f44336"
                        : "rgba(0, 0, 0, 0.23)",
                    }}
                  />
                )}
              </IconButton> */}
            </Box>
 
            {category?.child && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1}>
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
                  Investment : {franchiseModel?.investmentRange || "Not specified"}
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
              onClick={() => handleViewDetails(brand)}
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
 
const ViewBrands = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const isPaused = useRef(false);
 
  // const [likeProcessing, setLikeProcessing] = useState({});
  // const [likedStates, setLikedStates] = useState({});
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const navigate = useNavigate();
 
  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);
 
  const fetchData = useCallback(async () => {
    if (!investorUUID || !AccessToken) {
   
      setLoading(false);
      return;
    }
 
    try {
      setLoading(true);
      setError(null);
     
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        },
        timeout: 10000
      };
 
      // Only fetch viewed brands since like functionality is commented out
      const viewedRes = await axios.get(
        `${api.viewApi.get.getAllViewBrandByID}/${investorUUID}`,
        config
      ).then(res => res.data?.data || [])
       .catch(() => []);
 
      setBrands(viewedRes);
 
      // Initialize liked states - commented out
      // const initialLiked = {};
      // likedRes.forEach(item => {
      //   if (item?.uuid) {
      //     initialLiked[item.uuid] = true;
      //   }
      // });
      // setLikedStates(initialLiked);
 
    } catch (error) {
      console.error("Error in fetchData:", error);
      setError("Failed to load brands data");
    } finally {
      setLoading(false);
    }
  }, [investorUUID, AccessToken]);
 
  useEffect(() => {
    fetchData();
  }, [fetchData]);
 
  // const toggleLike = useCallback(async (brandId) => {
  //   if (!investorUUID || !AccessToken || !brandId) return;
 
  //   // Optimistic update
  //   setLikedStates(prev => ({
  //     ...prev,
  //     [brandId]: !prev[brandId]
  //   }));
  //   setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
 
  //   try {
  //     if (likedStates[brandId]) {
  //       // Unlike the brand
  //       await axios.delete(
  //         `${api.likeApi.delete}/${investorUUID}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${AccessToken}`,
  //           },
  //           data: { brandID: brandId },
  //         }
  //       );
  //     } else {
  //       // Like the brand
  //       await axios.post(
  //         `${api.likeApi.post}/${investorUUID}`,
  //         { brandID: brandId },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${AccessToken}`,
  //           }
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Like error:", error);
  //     // Revert optimistic update
  //     setLikedStates(prev => ({
  //       ...prev,
  //       [brandId]: !prev[brandId]
  //     }));
  //   } finally {
  //     setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
  //   }
  // }, [investorUUID, AccessToken, likedStates]);
 
  const handleViewDetails = useCallback((brand) => {
    openBrandDialog(brand);
  }, []);
 
  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);
 
  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
  }, []);
 
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200
      }}>
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
    const id = localStorage.getItem ("investorUUID") || localStorage.getItem ("brandUUID") ;
  return (
    <>
    {id && (
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
        Viewed Brands
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
 
      {brands.length > 0 ? (
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
          {brands.map((brand) => (
            <BrandCard
              key={brand?.uuid}
              brand={brand}
              handleViewDetails={handleViewDetails}
              // handleToggleLike={toggleLike}
              // likeProcessing={likeProcessing}
              dimensions={dimensions}
              theme={theme}
              isMobile={isMobile}
              isTablet={isTablet}
              // likedStates={likedStates}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Please Login To View Brands.
          </Typography>
        </Box>
      )}
    </Box>
    )}
    </>
  );
};
 
export default React.memo(ViewBrands);
 
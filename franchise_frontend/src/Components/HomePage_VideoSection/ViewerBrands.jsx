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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBrands, fetchBrandById, recordBrandView, toggleBrandLike } from "../../Api/Brands";

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

  const brandId = brand?.uuid || '';
  const franchiseModel = brand?.franchiseDetails?.fico?.[0] || {};
  const category = brand?.franchiseDetails?.brandCategories || {};
  const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
  const brandLogo = brand?.uploads?.brandLogo?.[0] || '';
  const brandName = brand?.brandDetails?.brandName || 'Brand';
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

export const ViewerBrands = ({ title = "Recently Viewed Brands", maxItems = 6 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  const navigate = useNavigate();

  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [ViewerBrands, setViewerBrands] = useState([]);
  
  // Fetch all brands with like status
  const { data: brands = [], isLoading: brandsLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for toggling likes
  const queryClient = useQueryClient();
  const toggleLikeMutation = useMutation({
    mutationFn: toggleBrandLike,
    onMutate: async ({ brandId, isLiked }) => {
      await queryClient.cancelQueries(["brands"]);
      
      const previousBrands = queryClient.getQueryData(["brands"]);
      
      // Optimistically update the brand like status
      queryClient.setQueryData(["brands"], (old) => 
        old?.map(brand => 
          brand.uuid === brandId ? { ...brand, isLiked: !isLiked } : brand
        )
      );
      
      return { previousBrands };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBrands) {
        queryClient.setQueryData(["brands"], context.previousBrands);
      }
    },
    onSettled: () => {
      // Invalidate to ensure we have fresh data
      queryClient.invalidateQueries(["brands"]);
    }
  });

  // Mutation for recording views
  const recordViewMutation = useMutation({
    mutationFn: recordBrandView,
  });

  // Get recently viewed brand IDs from sessionStorage
  const getViewerBrands= useCallback(() => {
    const ViewerBrandsWithTime = [];
    
    // Get all viewed brand IDs with their timestamps
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith("viewing-brand-id-")) {
        const brandId = sessionStorage.getItem(key);
        const timestampKey = `viewing-time-${brandId}`;
        const timestamp = sessionStorage.getItem(timestampKey) || Date.now();
        ViewerBrandsWithTime.push({
          brandId,
          timestamp: parseInt(timestamp, 10)
        });
      }
    }
    
    // Sort by timestamp (newest first)
    ViewerBrandsWithTime.sort((a, b) => b.timestamp - a.timestamp);
    
    // Get unique brand IDs in order (newest first)
    const uniqueBrandIds = [];
    const seenIds = new Set();
    for (const item of ViewerBrandsWithTime) {
      if (!seenIds.has(item.brandId)) {
        seenIds.add(item.brandId);
        uniqueBrandIds.push(item.brandId);
      }
    }
    
    // Map to full brand objects
    const brandMap = new Map(brands.map(brand => [brand.uuid, brand]));
    return uniqueBrandIds
      .map(id => brandMap.get(id))
      .filter(brand => brand !== undefined)
      .slice(0, maxItems);
  }, [brands, maxItems]);

  // Update viewed brands state
  const updateViewerBrands = useCallback(() => {
    const newViewerBrands = getViewerBrands();
    setViewerBrands(newViewerBrands);
  }, [getViewerBrands]);

  // Initialize and watch for storage changes
  useEffect(() => {
    // Initial load
    updateViewerBrands();
    
    const handleStorageChange = (e) => {
      if (e.key?.startsWith("viewing-brand-id-") || e.key?.startsWith("viewing-time-")) {
        updateViewerBrands();
      }
    };
    
    // Listen to both storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sessionStorageUpdate', updateViewerBrands);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionStorageUpdate', updateViewerBrands);
    };
  }, [updateViewerBrands]);

  const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);

  const handleLikeClick = useCallback(async (brandId, isLiked) => {
    if (likeProcessing[brandId]) return;
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowLogin(true);
      return;
    }
    
    setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
    try {
      await toggleLikeMutation.mutateAsync({ brandId, isLiked });
    } catch (error) {
      console.error("Like operation failed:", error);
    } finally {
      setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
    }
  }, [likeProcessing, toggleLikeMutation]);

  const handleApply = useCallback((brand) => {
    const brandId = brand.uuid;
    const now = Date.now();
    
    // Record view when clicking on brand
    recordViewMutation.mutate(brandId);
    
    // Store both the brand ID and the view timestamp
    const brandKey = `viewing-brand-id-${brandId}`;
    const timeKey = `viewing-time-${brandId}`;
    sessionStorage.setItem(brandKey, brandId);
    sessionStorage.setItem(timeKey, now.toString());
    
    // Trigger update immediately
    window.dispatchEvent(new Event('sessionStorageUpdate'));

    // Open brand details
    const brandSlug = brand.brandDetails?.brandName
      ?.toLowerCase()
      ?.replace(/\s+/g, '-')
      ?.replace(/[^a-z0-9\-]/g, '')
      ?.substring(0, 50);

    const newWindow = window.open(`/brands/${brandId}?--${brandSlug}`, '_blank');

    if (newWindow) {
      const interval = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(interval);
        }
      }, 1000);
    }
  }, [recordViewMutation]);

  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
  }, []);

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
        <Typography color="error">{error.message || "Failed to load brands."}</Typography>
      </Box>
    );
  }

  if (ViewerBrands.length === 0) {
    return null; // Don't render if no viewed brands
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
          {title}
        </Typography>

        {ViewerBrands.length > 3 && (
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
        )}
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
        {ViewerBrands.map((brand) => (
          <BrandCard 
            key={brand?.uuid}
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
  );
};

export default React.memo(ViewerBrands);
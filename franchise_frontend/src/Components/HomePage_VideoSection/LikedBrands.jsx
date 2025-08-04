import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowRight, ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import HomePageBrandCard from './HomePageBrandCard';
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";

const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  desktop: { width: 327, height: 500 },
};

const LikedBrands = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
   const scrollRequestRef = useRef(null);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeMsg, setRemoveMsg] = useState("");
 const dispatch = useDispatch();
 
  const userId = useSelector((state) => state.auth?.investorUUID) || localStorage.getItem("id");
  const accessToken = useSelector((state) => state.auth?.AccessToken);
  const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID")
  if (!id) {
    return null;
  }

   const dimensions = useMemo(() => {
    if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    return CARD_DIMENSIONS.desktop;
  }, [isMobile, isTablet]);

    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const smoothScrollTo = useCallback((target, immediate = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);

    const start = container.scrollLeft;
    const change = target - start;
    const duration = immediate ? 0 : 500;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      container.scrollLeft = start + change * ease;

      if (progress < 1) {
        scrollRequestRef.current = requestAnimationFrame(animateScroll);
      } else {
        handleScroll();  // update shadows
      }
    };

    scrollRequestRef.current = requestAnimationFrame(animateScroll);
  }, []);

  // ✏️ Added: calculate scroll distance based on card width
  const getScrollDistance = useCallback(() => {
    return dimensions.width + (isMobile ? 16 : 24);
  }, [dimensions.width, isMobile]);

  // ✏️ Changed: handlePrevClick to use smoothScrollTo
  const handlePrevClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const newScroll = Math.max(container.scrollLeft - distance, 0);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  // ✏️ Changed: handleNextClick to use smoothScrollTo
  const handleNextClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScroll = Math.min(container.scrollLeft + distance, maxScroll);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  // ✏️ Changed: handleScroll to update shadows
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowStartShadow(container.scrollLeft > 10);
    setShowEndShadow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  }, []);

  // ✏️ Changed: useEffect to attach/detach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      container?.removeEventListener("scroll", handleScroll);
      if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);
    };
  }, [handleScroll]);
 
  // Fetch liked brands data
  const fetchLikedBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/brandlisting/getAllBrandListing',
        {
          headers: { Authorization: `Bearer ${accessToken}` }  
      });
      console.log("=== :",response.data)
 
       let brandsData =  response.data.data;

      setBrands(brandsData);
 
      console.log("xxxxx : ",brandsData.brands.length)
      setError(null);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
 
  useEffect(() => {
    if (accessToken) {
      fetchLikedBrands();
    }
  }, [accessToken, fetchLikedBrands]);
 
  const handleLikeClick = useCallback(async (brandId) => {
    if (likeProcessing[brandId] || !userId || !accessToken) return;
   
    setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
 
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/likes/delete/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          data: { brandID: brandId },
        }
      );
     
      // Update local state
      setBrands(prev => prev.filter(brand => brand.uuid !== brandId));
      setRemoveMsg("Brand removed successfully");
     
      setTimeout(() => setRemoveMsg(""), 3000);
    } catch (error) {
      console.error("Remove error:", error);
      setRemoveMsg("Failed to remove brand");
    } finally {
      setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
    }
  }, [likeProcessing, userId, accessToken]);
 
  const handleApply = useCallback((brand) => {
    // Your apply logic here
    console.log("Apply for brand:", brand);
    dispatch(openBrandDialog(brand));
  }, [dispatch]);
 
  if (loading) {
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
          {error}
        </Typography>
      </Box>
    );
  }
 
  return (

    <>
    
      <Box
      ref={containerRef}
      sx={{
        py: isMobile ? 1 : 2,
        px: isMobile ? 0 : 2,
        maxWidth: isMobile ? "100%" : 1400,
        mx: "auto",
        position: "relative",
      }}
    >
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
          px: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h5"}
          fontWeight="bold"
          sx={{
            color: "black",
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
          Your Liked Brands
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
          onClick={() => {
            window.open("/brandviewpage", "_blank");
          }}
        >
          View More
        </Button>
      </Box>
 
      <Box sx={{ position: "relative" }}>
        <Button
          onClick={handlePrevClick}
          disabled={!showStartShadow}
          sx={{
            position: "absolute",
            left: isMobile ? 2 : 8,
            top: "55%",
            transform: "translateY(-50%)",
            zIndex: 1,
            minWidth: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "&:disabled": {
              opacity: 0,
              pointerEvents: "none",
            },
          }}
        >
          <ArrowBack fontSize="small" />
        </Button>
 
        <Button
          onClick={handleNextClick}
          disabled={!showEndShadow}
          sx={{
            position: "absolute",
            right: isMobile ? 4 : 8,
            top: "55%",
            transform: "translateY(-50%)",
            zIndex: 1,
            minWidth: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "&:disabled": {
              opacity: 0,
              pointerEvents: "none",
            },
          }}
        >
          <ArrowForward fontSize="small" />
        </Button>
 
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: isMobile ? 2 : 3,
            p: 2,
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {brands?.brands?.length > 4 && brands.brands.map((brand) => (
            <motion.div key={brand.uuid || brand.id}>
              <HomePageBrandCard
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
   
    </>
  );
};
 
export default LikedBrands;
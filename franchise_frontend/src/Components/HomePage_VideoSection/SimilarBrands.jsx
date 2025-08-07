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
import { useSelector, useDispatch } from 'react-redux';
import HomePageBrandCard from './HomePageBrandCard';
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";
import { fetchBrandsByChildCategory } from "../../Redux/Slices/SideMenuHoverBrandSlices.jsx";
import LoginPage from '../../Pages/LoginPage/LoginPage.jsx';
import { toggleHomeCardLike } from '../../Redux/Slices/TopCardFetchingSlice.jsx';
import { toggleBrandLike } from "../../Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { likeApiFunction } from "../../Api/likeApi.jsx";
import { token } from "../../Utils/autherId.jsx";

const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  desktop: { width: 327, height: 500 },
};

const SimilarBrands = ({ brandData }) => {

  
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
  const [removeMsg, setRemoveMsg] = useState("");
  const dispatch = useDispatch();

  // Get brands from Redux
  const { brands, loading, error } = useSelector((state) => state.brandCategory);

  // Get current brand's subCategory and childCategory
  const currentSubCategory = brandData[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.main;
  const currentChildCategory = brandData[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.child;
  const currentBrandUUID = brandData[0]?.uuid;

  // Fetch brands from Redux when brandData changes
  useEffect(() => {
    if (currentSubCategory && currentChildCategory) {
      dispatch(fetchBrandsByChildCategory({
        subCategory: currentSubCategory,
        childCategory: currentChildCategory,
        page: 1,
        limit: 30,
        isPrefetch: false
      }));
    }
  }, [dispatch, currentSubCategory, currentChildCategory]);

  // Filter brands: same subCategory, not current brand
  const filteredBrands = useMemo(() => {
    if (!brands || !currentSubCategory) return [];
    return brands.filter(
      (brand) =>
        brand.brandCategories?.main === currentSubCategory &&
        brand.uuid !== currentBrandUUID
    );
  }, [brands, currentSubCategory, currentBrandUUID]);

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
        handleScroll();
      }
    };

    scrollRequestRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const getScrollDistance = useCallback(() => {
    return dimensions.width + (isMobile ? 16 : 24);
  }, [dimensions.width, isMobile]);

  const handlePrevClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const newScroll = Math.max(container.scrollLeft - distance, 0);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  const handleNextClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScroll = Math.min(container.scrollLeft + distance, maxScroll);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowStartShadow(container.scrollLeft > 10);
    setShowEndShadow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  }, []);

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

 const handleLikeClick = async(brandId) => {
    if (!token) {
            setShowLogin(true);
            return;
          }
          
          dispatch(toggleHomeCardLike(brandId))
          dispatch(toggleBrandLike(brandId))
          await likeApiFunction(brandId)
  };

  const handleApply = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);

  if (!brandData) return null;

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
          Error loading similar brands
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  if (filteredBrands.length === 0) return null;

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          py: isMobile ? 1 : 3,
          px: isMobile ? 0 : 2,
          maxWidth: isMobile ? "100%" : 1400,
          mx: "auto",
          position: "relative",
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 4
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
            Similar Category Brands
          </Typography>

          <Button
            variant="text"
            size="small"
            aria-label="view more brands"
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
              window.open(`/brandviewpage?category=${currentSubCategory}&subCategory=${currentChildCategory}`, "_blank");
            }}
          >
            View More
          </Button>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handlePrevClick}
            disabled={!showStartShadow}
            aria-label="previous"
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
            aria-label="next"
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
            {filteredBrands.map((brand) => (
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

export default SimilarBrands;
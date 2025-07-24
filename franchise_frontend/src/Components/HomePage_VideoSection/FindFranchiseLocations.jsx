import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  Divider,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import PlaylistAddCheckCircleOutlined from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import ArrowRight from "@mui/icons-material/ArrowRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import Business from "@mui/icons-material/Business";
import AreaChart from "@mui/icons-material/AreaChart";
import { useNavigate } from "react-router-dom";
import {
  useBrands,
  useToggleLike,
  openBrandDialog,
} from "../../Hooks/Fetchbrands";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { postView } from "../../Utils/function/view";
// import { handleShortList } from "../../Api/shortListApi";
import HomePageBrandCard from "./HomePageBrandCard";

const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
 smallDesktop: { width: 280, height: 500 },
  desktop: { width: 267, height: 480 },
  largeDesktop: { width: 327, height: 500 },
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};


const TopInvestVdo2 = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm","md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("xl"));
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);

  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [allStates, setAllStates] = useState([]);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(false);

  const navigate = useNavigate();
  const { data: brands = [], isLoading: brandsLoading, error } = useBrands();
  const toggleLike = useToggleLike();

  // Collect all unique states from domestic expansion locations
  useEffect(() => {
    if (brands.length > 0) {
      const statesSet = new Set();
      brands.forEach((brand) => {
        const domesticLocations =
          brand?.expansionLocationData?.expansionLocations?.domestic
            ?.locations || [];
        domesticLocations.forEach(
          (loc) => loc.state && statesSet.add(loc.state)
        );
      });
      setAllStates(Array.from(statesSet).sort());
    }
  }, [brands]);

  // Filter brands by selected state
  const filteredBrands = useMemo(() => {
    if (!selectedState) return brands;
    return brands.filter((brand) => {
      const domesticLocations =
        brand?.expansionLocationData?.expansionLocations?.domestic?.locations ||
        [];
      return domesticLocations.some((loc) => loc.state === selectedState);
    });
  }, [brands, selectedState]);

 const dimensions = useMemo(() => {
     if (isMobile) return CARD_DIMENSIONS.mobile;
    if (isTablet) return CARD_DIMENSIONS.tablet;
    if (isSmallDesktop) return CARD_DIMENSIONS.smallDesktop;
    if (isDesktop) return CARD_DIMENSIONS.desktop;
    return CARD_DIMENSIONS.largeDesktop;
  }, [isMobile, isTablet, isSmallDesktop, isDesktop, isLargeDesktop]);

  useEffect(() => {
    const updateVisibleCards = () => {
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [dimensions.width, isMobile]);

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

  const handleApply = useCallback((brand) => {
    postView(brand.uuid);
    openBrandDialog(brand);
  }, []);

  // Calculate the scroll distance for 1 card (including gap)
  const getScrollDistance = useCallback(() => {
    return dimensions.width + (isMobile ? 16 : 24);
  }, [dimensions.width, isMobile]);

  // Smooth scroll function
  const smoothScrollTo = useCallback((target, immediate = false) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    if (scrollRequestRef.current) {
      cancelAnimationFrame(scrollRequestRef.current);
    }

    const start = container.scrollLeft;
    let change = target - start;
    const startTime = performance.now();
    const duration = immediate ? 0 : 1000; // 1 second scroll duration

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

  // Easing function for smooth scrolling
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Track scroll position for shadow effects
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || filteredBrands.length === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowStartShadow(scrollLeft > 10);
    setShowEndShadow(scrollLeft < scrollWidth - clientWidth - 10);
  }, [filteredBrands.length]);

  // Handle next button click - scroll forward 1 card
  const handleNextClick = useCallback(() => {
    if (!scrollContainerRef.current || filteredBrands.length === 0) return;

    const container = scrollContainerRef.current;
    const scrollDistance = getScrollDistance();
    const newScrollLeft = container.scrollLeft + scrollDistance;

    smoothScrollTo(newScrollLeft);
  }, [filteredBrands.length, getScrollDistance, smoothScrollTo]);

  // Handle previous button click - scroll backward 1 card
  const handlePrevClick = useCallback(() => {
    if (!scrollContainerRef.current || filteredBrands.length === 0) return;

    const container = scrollContainerRef.current;
    const scrollDistance = getScrollDistance();
    const newScrollLeft = container.scrollLeft - scrollDistance;

    smoothScrollTo(newScrollLeft);
  }, [filteredBrands.length, getScrollDistance, smoothScrollTo]);

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

  return (
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
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
          px: isMobile ? 2 : 0,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{
            color: "black",
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: "#f57c00",
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          Franchise Opportunities in {selectedState}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: isMobile ? "100%" : 200 }} size="small">
            <InputLabel id="state-filter-label">Filter by State</InputLabel>
            <Select
              labelId="state-filter-label"
              value={selectedState}
              label="Filter by State"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {allStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="text"
            size="small"
            endIcon={<ArrowRight />}
            sx={{
              textTransform: "none",
              fontSize: isMobile ? 14 : 16,
              color: theme.palette.text.secondary,
              "&:hover": {
                color: "#f57c00",
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
              backgroundColor: "rgba(111, 255, 0, 0.98)",
              color: "white",
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: "#7ad03a",
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
              backgroundColor: "rgba(111, 255, 0, 0.98)",
              color: "white",
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: "#7ad03a",
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
            perspective: "1000px",
            // Custom attractive scrollbar design
            "&::-webkit-scrollbar": {
              height: isMobile ? "10px" : "8px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-track": {
              background:
                "linear-gradient(90deg, transparent, rgba(242, 151, 36, 0.1), transparent)",
              borderRadius: "10px",
              marginX: isMobile ? 0 : "10%",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "linear-gradient(90deg, #f29724, #98dd2e)",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              border: "2px solid white",
              backgroundSize: "200%",
              transition: "background-position 0.3s ease",
              "&:hover": {
                backgroundPosition: "right center",
              },
            },
            // Firefox scrollbar
            scrollbarColor: `transparent`,
            scrollbarWidth: "thin",
            // Extra bottom padding for mobile
            paddingBottom: isMobile ? "24px" : "16px",
          }}
        >
          {filteredBrands.map((brand) => (
            <motion.div
              key={brand.uuid}
              whileHover={{
                scale: 1.03,
                zIndex: 10,
                // boxShadow: theme.shadows[6],
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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

      {filteredBrands.length === 0 && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography>
            No franchise opportunities found in {selectedState}.
          </Typography>
        </Box>
      )}

      <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
    </Box>
  );
});

export default React.memo(TopInvestVdo2);

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Slide,
  Avatar,
  IconButton,
  useMediaQuery,
  Chip,
  Tooltip,
  Stack,
  CircularProgress,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import PlayCircle from "@mui/icons-material/PlayCircle";
import PauseCircle from "@mui/icons-material/PauseCircle";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  openBrandDialog,
  toggleLikeBrand,
} from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";
import LoginPage from "../../Pages/LoginPage/LoginPage";

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const timeoutRef = useRef(null);
  const videoRefs = useRef([]);
  const [showLogin, setShowLogin] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get brands and loading state from Redux
  const { data: brands = [], loading: brandsLoading } = useSelector(
    (state) => state.brands
  );

  // Fixed card sizes with better aspect ratios
  const CARD_SIZES = {
    main: {
      width: isMobile ? "100%" : isTablet ? "100%" : "68%",
      height: isMobile ? 420 : isTablet ? 480 : 550,
      videoHeight: isMobile ? 250 : isTablet ? 300 : 450,
    },
    side: {
      width: isMobile ? "100%" : isTablet ? "100%" : "30%",
      height: isMobile ? 200 : isTablet ? 220 : 260,
      videoWidth: isMobile ? "40%" : isTablet ? "45%" : "58%",
    },
  };

  const handleLikeClick = async (brandId, isLiked) => {
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

  const handleNext = useCallback(() => {
    if (brands.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }
  }, [brands]);

  const handlePrev = useCallback(() => {
    if (brands.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
    }
  }, [brands]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && brands.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 8000);
    }
  }, [isHovered, handleNext, brands]);

  useEffect(() => {
    // Initialize all videos to autoplay and loop
    videoRefs.current.forEach((video) => {
      if (video) {
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
      }
    });
  }, [brands]);


  useEffect(() => {
    startAutoSlide();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, startAutoSlide]);

  const handleVideoPlay = (index) => {
    setActiveVideo(index);
    // Pause other videos
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
      }
    });
  };

  const handleVideoPause = (index) => {
    if (activeVideo === index) {
      setActiveVideo(null);
    }
  };

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        handleVideoPlay(index);
      } else {
        video.pause();
        handleVideoPause(index);
      }
    }
  };

  const handleApply = (brand) => {
    dispatch(openBrandDialog(brand));
  };

  if (brandsLoading && brands.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No featured brands available
        </Typography>
      </Box>
    );
  }

  const mainBrand = brands[currentIndex];
  const nextBrands = [
    brands[(currentIndex + 1) % brands.length],
    brands[(currentIndex + 2) % brands.length],
  ].filter((brand) => brand); // Filter out undefined brands

  const Fact = ({ label, value }) => (
    <Typography variant="body2" color="text.secondary" noWrap>
      <strong>{label}:</strong>&nbsp;{value || "Not Specified"}
    </Typography>
  );

  return (
    <Box
      sx={{
        py: isMobile ? 1 : 2,
        mx: "auto",
        position: "relative",
        maxWidth: 1400,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header and navigation buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{
            color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
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
          Premium Franchise Brands
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handlePrev}
              startIcon={<ChevronLeft />}
              sx={{
                textTransform: "none",
                color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                borderColor:
                  theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                "&:hover": {
                  borderColor:
                    theme.palette.mode === "dark" ? "#ff9800" : "#e65100",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 167, 38, 0.08)"
                      : "rgba(245, 124, 0, 0.08)",
                },
              }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ChevronRight />}
              sx={{
                textTransform: "none",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                    : "linear-gradient(45deg, #f57c00, #ff9800)",
                "&:hover": {
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #ff9800, #ffb74d)"
                      : "linear-gradient(45deg, #ff9800, #f57c00)",
                },
              }}
            >
              Next Brand
            </Button>
          </Box>
        )}
      </Box>

      {/* Brands slider */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 3 : isTablet ? 3 : 3,
          alignItems: "stretch",
        }}
      >
        {/* Main Video Card (Left) */}
        <Box
          sx={{
            flex: isMobile ? "1 1 auto" : "0 0 68%",
            maxWidth: CARD_SIZES.main.width,
            minWidth: isMobile ? "100%" : "68%",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mainBrand.uuid || mainBrand.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  height: CARD_SIZES.main.height,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 6,
                  background:
                    theme.palette.mode === "dark" ? "#424242" : "#ffffff",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                {/* Video section */}
                <Box
                  sx={{
                    height: CARD_SIZES.main.videoHeight,
                    position: "relative",
                    cursor: "pointer",
                    backgroundColor: "#000",
                    overflow: "hidden",
                  }}
                  onClick={() => togglePlayPause(0)}
                >
                  <video
                    ref={(el) => (videoRefs.current[0] = el)}
                    loading="lazy"
                    src={
                      mainBrand.brandDetails?.brandPromotionVideo?.[0] ||
                      mainBrand.brandDetails?.franchisePromotionVideo?.[0]
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    autoPlay
                    muted
                    loop
                    controls
                    playsInline
                    onPlay={() => handleVideoPlay(0)}
                    onPause={() => handleVideoPause(0)}
                  />
                </Box>

                <CardContent
                  sx={{
                    bgcolor: "background.paper",
                    px: { xs: 0, sm: 3 },
                    py: 0,
                    height: `calc(${CARD_SIZES.main.height}px - ${CARD_SIZES.main.videoHeight}px)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Brand header with like button */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    {/* Avatar and brand name */}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <Avatar
                        src={mainBrand.brandDetails?.brandLogo?.[0]}
                        alt={mainBrand.personalDetails?.brandName}
                        sx={{
                          width: 50,
                          height: 50,
                          border: `2px solid ${
                            theme.palette.mode === "dark"
                              ? "#ffb74d"
                              : "#f57c00"
                          }`,
                          boxShadow: theme.shadows[2],
                        }}
                      />

                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          noWrap
                          sx={{
                            backgroundColor: "#7ad03a",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {mainBrand.personalDetails?.brandName ||
                            mainBrand.title}
                        </Typography>

                        {/* Categories */}
                        <Typography
                          variant="body2"
                          noWrap
                          overflow={"hidden"}
                          textOverflow="ellipsis"
                          color="text.secondary"
                        >
                          {(
                            mainBrand.personalDetails?.brandCategories ?? []
                          ).map((c) => c.child)}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Key facts */}
                    <Stack
                      marginTop={0}
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      justifyContent={{ xs: "flex-start", sm: "center" }}
                    >
                      <Fact
                        label="Investment"
                        value={
                          mainBrand.franchiseDetails?.modelsOfFranchise?.[0]
                            ?.investmentRange
                        }
                      />
                      <Fact
                        label="Area"
                        value={
                          mainBrand.franchiseDetails?.modelsOfFranchise?.[0]
                            ?.areaRequired
                        }
                      />
                      <Fact
                        label="Model Type"
                        value={
                          mainBrand.franchiseDetails?.modelsOfFranchise?.[0]
                            ?.franchiseType
                        }
                      />
                    </Stack>

                    {/* Action buttons */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        variant="contained"
                        onClick={() => handleApply(mainBrand)}
                        sx={{
                          px: 3,
                          fontWeight: 600,
                          textTransform: "none",
                          color: "#fff",
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                              : "linear-gradient(45deg, #f57c00, #ff9800)",
                          "&:hover": {
                            background:
                              theme.palette.mode === "dark"
                                ? "linear-gradient(45deg, #ff9800, #ffb74d)"
                                : "linear-gradient(45deg, #ff9800, #f57c00)",
                            boxShadow: theme.shadows[4],
                          },
                        }}
                      >
                        View Details
                      </Button>

                      <Tooltip
                        title={
                          mainBrand.isLiked
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <IconButton
                          onClick={() =>
                            handleLikeClick(mainBrand.uuid, mainBrand.isLiked)
                          }
                          disabled={brandsLoading}
                        >
                          {mainBrand.isLiked ? (
                            <Favorite color="error" />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Mobile navigation buttons */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 2,
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrev}
                startIcon={<ChevronLeft />}
                fullWidth
                sx={{
                  textTransform: "none",
                  color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                  borderColor:
                    theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ChevronRight />}
                fullWidth
                sx={{
                  textTransform: "none",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                      : "linear-gradient(45deg, #f57c00, #ff9800)",
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Side Cards */}
        <Box
          sx={{
            flex: isMobile ? "1 1 auto" : "0 0 30%",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 3 : isTablet ? 3 : 4,
            minWidth: isMobile ? "100%" : "30%",
          }}
        >
          {nextBrands.map((brand, i) => (
            <Slide
              direction="up"
              in
              timeout={600 + i * 200}
              key={brand.uuid || brand.title}
            >
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card
                  sx={{
                    height: CARD_SIZES.side.height,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    background:
                      theme.palette.mode === "dark" ? "#424242" : "#ffffff",
                    display: "flex",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: CARD_SIZES.side.videoWidth,
                      height: "100%",
                      position: "relative",
                      cursor: "pointer",
                      backgroundColor: "#000",
                      flexShrink: 0,
                    }}
                    onClick={() => togglePlayPause(i + 1)}
                  >
                    <video
                      ref={(el) => (videoRefs.current[i + 1] = el)}
                      loading="lazy"
                      src={
                        brand.brandDetails?.brandPromotionVideo?.[0] ||
                        brand.brandDetails?.franchisePromotionVideo?.[0]
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onPlay={() => handleVideoPlay(i + 1)}
                      onPause={() => handleVideoPause(i + 1)}
                    />
                    <Chip
                      label={i === 0 ? "Trending" : "Popular"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                            : "linear-gradient(45deg, #f57c00, #ff9800)",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.65rem",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause(i + 1);
                      }}
                    >
                      {activeVideo === i + 1 ? <PauseCircle /> : <PlayCircle />}
                    </IconButton>
                  </Box>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      p: 1.5,
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ overflow: "hidden" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip
                          title={
                            brand.personalDetails?.brandName || brand.title
                          }
                        >
                          <Typography
                            variant="h6"
                            color="#7ad03a"
                            fontWeight="bold"
                            noWrap
                            sx={{
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {brand.personalDetails?.brandName || brand.title}
                          </Typography>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleLikeClick(brand.uuid, brand.isLiked)
                          }
                          disabled={brandsLoading}
                          sx={{
                            color: brand.isLiked
                              ? theme.palette.error.main
                              : "text.secondary",
                            "&:hover": {
                              color: theme.palette.error.main,
                              backgroundColor: "rgba(244, 67, 54, 0.08)",
                            },
                          }}
                        >
                          {brand.isLiked ? (
                            <Favorite fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Box>

                      <Typography
                        variant="body2"
                        color="Black"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mt: 1,
                          fontSize: "0.8rem",
                          lineHeight: 1,
                        }}
                      >
                        Categories:{" "}
                        {(brand.personalDetails?.brandCategories || []).map(
                          (cat) => cat.child
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="Black"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mt: 1.2,
                          fontSize: "0.8rem",
                          lineHeight: 1.4,
                        }}
                      >
                        Investment:{" "}
                        {
                          brand.franchiseDetails?.modelsOfFranchise?.[0]
                            ?.investmentRange
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        color="Black"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mt: 1.2,
                          fontSize: "0.8rem",
                          lineHeight: 1.4,
                        }}
                      >
                        Area:{" "}
                        {
                          brand.franchiseDetails?.modelsOfFranchise?.[0]
                            ?.areaRequired
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        color="Black"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mt: 1.2,
                          fontSize: "0.8rem",
                          lineHeight: 1.5,
                        }}
                      >
                        Type:{" "}
                        {
                          brand.franchiseDetails?.modelsOfFranchise?.[0]
                            ?.franchiseType
                        }
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleApply(brand)}
                        fullWidth
                        size="small"
                        sx={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                              : "linear-gradient(45deg, #f57c00, #ff9800)",
                          textTransform: "none",
                          fontSize: "0.75rem",
                          px: 4,
                          color: "#fff",
                          fontWeight: 600,
                          minWidth: 100,
                          "&:hover": {
                            background:
                              theme.palette.mode === "dark"
                                ? "linear-gradient(45deg, #ff9800, #ffb74d)"
                                : "linear-gradient(45deg, #ff9800, #f57c00)",
                            boxShadow: theme.shadows[2],
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Slide>
          ))}
        </Box>
      </Box>
      
      {/* Brand Details Dialog */}
      <BrandDetailsDialog />
      
      {/* Login Dialog */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
}

export default TopBrandVdoCards;
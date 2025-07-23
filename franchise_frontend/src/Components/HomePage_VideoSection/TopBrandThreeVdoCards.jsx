import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
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
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { postView } from "../../Utils/function/view";
import { useBrands, useToggleLike, openBrandDialog } from "../../Hooks/Fetchbrands";

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const timeoutRef = useRef(null);
  const videoRefs = useRef([]);
  const [showLogin, setShowLogin] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const { data: brands = [], loading: brandsLoading } = useBrands();
  const toggleLike = useToggleLike();

  const CARD_SIZES = {
    main: {
      width: isMobile ? "100%" : isTablet ? "100%" : "68%",
      height: isMobile ? 470 : isTablet ? 480 : 550,
      videoHeight: isMobile ? 240 : isTablet ? 300 : 450,
    },
    side: {
      width: isMobile ? "100%" : isTablet ? "100%" : "30%",
      height: isMobile ? 200 : isTablet ? 220 : 260,
      videoWidth: isMobile ? "40%" : isTablet ? "45%" : "58%",
    },
  };

 const handleLikeClick = useCallback((brandId, isLiked) => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    setShowLogin(true);
    return;
  }

  // Optimistic UI update with loading state
  setLikeProcessing(prev => ({ ...prev, [brandId]: true }));

  toggleLike.mutate(
    { brandId, isLiked },
    {
      onError: (error) => {
        console.error("Like operation failed:", error);
        // Show error feedback to user
        // toast.error("Failed to update like status. Please try again.");
      },
      onSettled: () => {
        // Clean up loading state
        setLikeProcessing(prev => {
          const newState = { ...prev };
          delete newState[brandId];
          return newState;
        });
      }
    }
  );
}, [toggleLike]);




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
      timeoutRef.current = setTimeout(() => handleNext(), 5000);
    }
  }, [isHovered, handleNext, brands]);

  useEffect(() => {
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
        video.play().then(() => handleVideoPlay(index));
      } else {
        video.pause();
        handleVideoPause(index);
      }
    }
  };

  const handleApply = (brand) => {
    postView(brand.uuid);
    openBrandDialog(brand);
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
        <CircularProgress color="warning" />
      </Box>
    );
  }

  const mainBrand = brands[currentIndex];
  const nextBrands = [
    brands[(currentIndex + 1) % brands.length],
    brands[(currentIndex + 2) % brands.length],
  ].filter(Boolean);

  const Fact = ({ label, value }) => (
    <Typography variant="body2" color="text.secondary" noWrap>
      <strong>{label}:</strong>&nbsp;{value || "Not Specified"}
    </Typography>
  );

  return (
    <Box
      sx={{
        py: isMobile ? 0 : 2,
        mx: "auto",
        position: "relative",
        maxWidth:isMobile ? "100%" : 1400,
        width: '100%',
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
          px: isMobile ? 2 : 0,
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
      </Box>

      {/* Brands slider */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 3 : isTablet ? 3 : 3,
          alignItems: "stretch",
          px: isMobile ? 2 : 0,
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
              key={mainBrand.uuid}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card
                sx={{
                  height: CARD_SIZES.main.height,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 6,
                  background: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
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
                  {!isMobile && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        zIndex: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        startIcon={<ChevronLeft />}
                        sx={{
                          textTransform: "none",
                          color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                          borderColor: theme.palette.mode === "dark" ? "#43ea5e" : "#43ea5e",
                          "&:hover": {
                            borderColor: theme.palette.mode === "dark" ? "#ff9800" : "#e65100",
                            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 167, 38, 0.08)" : "rgba(245, 124, 0, 0.08)",
                          },
                        }}
                      >
                        Previous
                      </Button>
                    </Box>
                  )}

                  {!isMobile && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        endIcon={<ChevronRight />}
                        sx={{
                          textTransform: "none",
                          color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                          borderColor: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                          "&:hover": {
                            borderColor: theme.palette.mode === "dark" ? "#43ea5e" : "#43ea5e",
                            backgroundColor: theme.palette.mode === "dark" ? "rgba(67, 234, 94, 0.15)" : "rgba(67, 234, 94, 0.10)",
                          },
                        }}
                      >
                        Next Brand
                      </Button>
                    </Box>
                  )}

                  <video
                    ref={(el) => (videoRefs.current[0] = el)}
                    loading="lazy"
                    src={mainBrand.uploads?.franchisePromotionVideo?.[0]}
                    alt={mainBrand.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
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
                    px: { xs: 0, sm: 2 },
                    py: 0,
                    height: `calc(${CARD_SIZES.main.height}px - ${CARD_SIZES.main.videoHeight}px)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    ml={{ xs: 2 }}
                    spacing={1}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <Avatar
                                                  onClick={() => handleApply(mainBrand)}
                        src={mainBrand.uploads?.brandLogo?.[0]}
                        alt={mainBrand.brandDetails?.brandName}
                        sx={{
                          width: 50,
                          height: 50,
                          border: `2px solid ${theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00"}`,
                          boxShadow: theme.shadows[2],
                          cursor: "pointer",
                        }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                       <Box display="flex" alignItems="center"> 
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          noWrap
                          sx={{
                            backgroundColor: "black",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                             whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {mainBrand.brandDetails?.brandName || mainBrand.title}
                        </Typography>
                        <Box>
                           {isMobile && (
                        <Tooltip
                          title={mainBrand.isLiked ? "Remove from favorites" : "Add to favorites"}
                        >
                          <IconButton
                            onClick={() => handleLikeClick(mainBrand.uuid, mainBrand.isLiked)}
                            disabled={brandsLoading || likeProcessing[mainBrand.uuid]}
                          >
                            {mainBrand.isLiked ? (
                              <Favorite color="error" />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                        </Box>
                        </Box>
                        

                        <Typography
                          variant="body2"
                          noWrap
                          overflow="hidden"
                          textOverflow="ellipsis"
                          color="text.secondary"

                        >
                          {mainBrand.franchiseDetails?.brandCategories
                            ? `${mainBrand.franchiseDetails.brandCategories.child}`
                            : "N/A"}
                        </Typography>
                      </Box>
                     
                    </Stack>

                    <Stack
                      direction={{ xs: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={5}
                      sx={{ flex: 1, minWidth: 0,mt:0 }}
                    >
                      <Stack direction="column" spacing={1}>
                        <Fact
                          label="Investment"
                          value={mainBrand.franchiseDetails?.fico?.[0]?.investmentRange}
                        />
                        <Fact
                          label="Area Required"
                          value={mainBrand.franchiseDetails?.fico?.[0]?.areaRequired}
                        />
                        <Fact
                          label="Franchise Model"
                          value={mainBrand.franchiseDetails?.fico?.[0]?.franchiseModel}
                        />
                        {isMobile && (
                          <Button
                            variant="contained"
                            onClick={() => handleApply(mainBrand)}
                            sx={{
                              mx:"auto",
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
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        {!isMobile && (
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
                        )}

                        {!isMobile && (
                          <Tooltip
                            title={mainBrand.isLiked ? "Remove from favorites" : "Add to favorites"}
                          >
                            <IconButton
                              onClick={() => handleLikeClick(mainBrand.uuid, mainBrand.isLiked)}
                              disabled={brandsLoading || likeProcessing[mainBrand.uuid]}
                            >
                              {mainBrand.isLiked ? (
                                <Favorite color="error" />
                              ) : (
                                <FavoriteBorder />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

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
                  borderColor: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
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
            minWidth: isMobile ? "100%" : "32%",
          }}
        >
          {nextBrands.map((brand, i) => (
            <motion.div
              key={brand.uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card
                sx={{
                  height: CARD_SIZES.side.height,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 4,
                  background: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
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
                    src={brand.uploads?.franchisePromotionVideo?.[0]}
                    alt={brand.personalDetails?.brandName || "Brand"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
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
                      <Tooltip title={brand.brandDetails?.brandName || brand.title}>
                        <Typography
                          variant={isMobile ? "caption" : "body1"}
                          color="black"
                          noWrap={false}
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {brand.brandDetails?.brandName || brand.title}
                        </Typography>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={() => handleLikeClick(brand.uuid, brand.isLiked)}
                        disabled={brandsLoading || likeProcessing[brand.uuid]}
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
                      variant="caption"
                      color="Black"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mt: 1,
                        fontSize: "0.7rem",
                        lineHeight: 1.1,
                      }}
                    >
                      Categories: {brand?.franchiseDetails?.brandCategories?.child}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="Black"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mt: 1.2,
                        fontSize: "0.7rem",
                        lineHeight: 1.4,
                      }}
                    >
                      Investment: {brand.franchiseDetails?.fico?.[0]?.investmentRange}
                    </Typography>
                    {!isMobile && (
                      <Typography
                      variant="caption"
                      color="Black"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mt: 1.2,
                        fontSize: "0.7rem",
                        lineHeight: 1.4,
                      }}
                    >
                      Area: {brand.franchiseDetails?.fico?.[0]?.areaRequired}
                    </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="Black"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mt: 1.2,
                        fontSize: "0.7rem",
                        lineHeight: 1.5,
                      }}
                    >
                     Franchising Model: {brand.franchiseDetails?.fico?.[0]?.franchiseModel}
                    </Typography>
                  </Box>

                  {/* <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      mt: isMobile?0:2,
                    }}
                  > */}
                    <Button
                      variant="contained"
                      onClick={() => handleApply(brand)}
                      fullWidth
                      size="small"
                      sx={{
                        mt: isMobile?2:2,
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
                  {/* </Box> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Login Dialog */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
}

export default TopBrandVdoCards;
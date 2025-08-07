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
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { postView } from "../../Utils/function/view";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrands,
  resetBrands,
  toggleBrandLike,
  toggleBrandShortList,
} from "../../Redux/Slices/GetAllBrandsDataUpdationFile";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";
import { likeApiFunction } from "../../Api/likeApi";
import {
  toggleHomeCardLike,
  toggleHomeCardShortlist,
} from "../../Redux/Slices/TopCardFetchingSlice";
import { token } from "../../Utils/autherId";
import { RiBookmark3Fill, RiBookMarkedFill } from "react-icons/ri";
import { VideoPlayer } from "../../services/VideoControllerMedia/VideoPlayercomponents.jsx";
import { handleShortList } from "../../Api/shortListApi.jsx";
import { addSortlist, removeSortList, toggleSortlistBrandLike } from "../../Redux/Slices/shortlistslice.jsx";

function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const timeoutRef = useRef(null);
  const videoRefs = useRef([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [viewedBrandsCount, setViewedBrandsCount] = useState(0);

  const CARD_SIZES = {
    main: {
      width: isMobile ? "100%" : isTablet ? "100%" : "68%",
      height: isMobile ? 500 : isTablet ? 480 : 550,
      videoHeight: isMobile ? 275 : isTablet ? 300 : 450,
    },
    side: {
      width: isMobile ? "100%" : isTablet ? "100%" : "30%",
      height: isMobile ? 200 : isTablet ? 220 : 260,
      videoWidth: isMobile ? "40%" : isTablet ? "45%" : "58%",
    },
  };

  const dispatch = useDispatch();
  const { brands, isLoading, pagination, error } = useSelector(
    (state) => state.brands
  );

  // Initial load - runs only once
  useEffect(() => {
    if (!initialLoadComplete) {
      dispatch(resetBrands());
      dispatch(fetchBrands({ page: 1 })).then(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [dispatch, initialLoadComplete]);

  // Update hasMore when pagination changes
  useEffect(() => {
    if (pagination) {
      setHasMore(pagination.hasNext);
    }
  }, [pagination]);

  // Fetch more brands when page changes
  useEffect(() => {
    if (page > 1 && hasMore) {
      dispatch(fetchBrands({ page, limit: 10 }));
    }
  }, [page, dispatch, hasMore]);

  // Auto-slide functionality
  const handleNext = useCallback(() => {
    if (brands.length === 0) return;

    setViewedBrandsCount((prev) => prev + 1);

    // If we've viewed all brands from current page and more exist
    if (viewedBrandsCount >= brands.length - 1 && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchBrands({ page: nextPage })).then(() => {
        setCurrentIndex(0);
        setViewedBrandsCount(0); // Reset counter after loading new brands
      });
    } else {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }
  }, [brands.length, viewedBrandsCount, hasMore, isLoading, page, dispatch]);

  const handlePrev = useCallback(() => {
    if (brands.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
    }
  }, [brands.length]);

  const startAutoSlide = () => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && brands.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 15000);
    }
  };
  // Video controls
  // Update your useEffect for video initialization
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.autoplay = false; // Disable default autoplay
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        // Add event listeners
        video.addEventListener("play", () => handleVideoPlay(index));
        video.addEventListener("pause", () => handleVideoPause(index));
      }
    });

    return () => {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          video.removeEventListener("play", () => handleVideoPlay(index));
          video.removeEventListener("pause", () => handleVideoPause(index));
        }
      });
    };
  }, [brands]);

  useEffect(() => {
    startAutoSlide();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, startAutoSlide]);

  const handleVideoPlay = (index) => {
    // Pause all other videos
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
      }
    });
    setActiveVideo(index);
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

  const handleLikeClick = async (brandId) => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    dispatch(toggleBrandLike(brandId));
    dispatch(toggleSortlistBrandLike(brandId));
    dispatch(toggleHomeCardLike(brandId));
    await likeApiFunction(brandId);
  };

  const handleToggleShortList = async (mainBrand) => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    
      dispatch(toggleBrandShortList(mainBrand.uuid));
      dispatch(toggleHomeCardShortlist(mainBrand.uuid))
      if (!mainBrand.isShortListed) {
        dispatch(addSortlist(mainBrand))
      }else{
        dispatch(removeSortList(mainBrand.uuid))
      }
      await handleShortList(mainBrand.uuid);
      
    
  };

  const handleApply = (brand) => {
    postView(brand.uuid);
    dispatch(openBrandDialog(brand));
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchBrands({ page: nextPage })).then(() => {
        setCurrentIndex(0); // Always start at first brand of new set
      });
    }
  };

  // Loading and error states
  if (!initialLoadComplete || (isLoading && brands.length === 0)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
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
        <Typography color="error">Error loading brands: {error}</Typography>
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
        maxWidth: isMobile ? "100%" : 1400,
        width: "100%",
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
                        aria-label="previous brand"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        startIcon={<ChevronLeft />}
                        sx={{
                          textTransform: "none",
                          color:
                            theme.palette.mode === "dark" ? "black" : "black",
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "#43ea5e"
                              : "#43ea5e",
                          "&:hover": {
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "#ff9800"
                                : "#e65100",
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 167, 38, 0.08)"
                                : "rgba(245, 124, 0, 0.08)",
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
                      {/* Show Load More only after all brands viewed */}
                      {viewedBrandsCount >= brands.length - 1 && hasMore ? (
                        <Button
                          variant="outlined"
                          aria-label="next brand"
                          onClick={() => {
                            const nextPage = page + 1;
                            setPage(nextPage);
                            dispatch(fetchBrands({ page: nextPage })).then(
                              () => {
                                setCurrentIndex(0);
                                setViewedBrandsCount(0);
                              }
                            );
                          }}
                          disabled={isLoading}
                          sx={{
                            textTransform: "none",
                            color:
                              theme.palette.mode === "dark" ? "black" : "black",
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "#ffb74d"
                                : "#f57c00",
                            "&:hover": {
                              borderColor:
                                theme.palette.mode === "dark"
                                  ? "#43ea5e"
                                  : "#43ea5e",
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(67, 234, 94, 0.15)"
                                  : "rgba(67, 234, 94, 0.10)",
                            },
                          }}
                        >
                          {isLoading ? (
                            <>
                              <CircularProgress
                                size={20}
                                sx={{ color: "white", mr: 1 }}
                              />
                              Loading...
                            </>
                          ) : (
                            "Load More Brands"
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          aria-label="next brand"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          endIcon={<ChevronRight />}
                          sx={{
                            textTransform: "none",
                            color:
                              theme.palette.mode === "dark" ? "black" : "black",
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "#ffb74d"
                                : "#f57c00",
                            "&:hover": {
                              borderColor:
                                theme.palette.mode === "dark"
                                  ? "#43ea5e"
                                  : "#43ea5e",
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(67, 234, 94, 0.15)"
                                  : "rgba(67, 234, 94, 0.10)",
                            },
                          }}
                        >
                          Next Brand
                        </Button>
                      )}
                    </Box>
                  )}
                  {/* <video
                    ref={(el) => (videoRefs.current[0] = el)}
                    loading="lazy"
                    src={mainBrand?.franchiseVideos}
                    alt={mainBrand?.brandname}
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
                  /> */}
                  <VideoPlayer
                    id={mainBrand.uuid}
                    videoUrl={mainBrand.franchiseVideos}
                    poster={mainBrand.logo}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    onPlay={() => handleVideoPlay(0)}
                    onPause={() => handleVideoPause(0)}
                    autoPlay={false}
                    loop={true}
                    muted={true}
                    ref={(el) => (videoRefs.current[0] = el?.videoRef || null)}
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
                    mt={1}
                    spacing={1}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ minWidth: 0, flex: 1, paddingBottom: "10px" }}
                    >
                      {isMobile && (
                        <Avatar
                          onClick={() => handleApply(mainBrand)}
                          src={mainBrand.logo}
                          alt={mainBrand.brandname}
                          sx={{
                            width: 50,
                            height: 50,
                            border: `2px solid ${
                              theme.palette.mode === "dark"
                                ? "#ffb74d"
                                : "#f57c00"
                            }`,
                            boxShadow: theme.shadows[2],
                            cursor: "pointer",
                          }}
                        />
                      )}
                      {!isMobile && (
                        <Box
                          component="img"
                          onClick={() => handleApply(mainBrand)}
                          src={mainBrand.logo}
                          alt={mainBrand.brandname}
                          sx={{
                            width: 100,
                            height: 50,
                            border: `2px solid ${
                              theme.palette.mode === "dark"
                                ? "#ffb74d"
                                : "#f57c00"
                            }`,
                            boxShadow: theme.shadows[2],
                            cursor: "pointer",
                            borderRadius: 0,
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      )}

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
                            {mainBrand.brandname}
                          </Typography>
                          <Box>
                            {isMobile && (
                              <Tooltip
                                title={
                                  mainBrand.isLiked
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                              >
                                <IconButton
                                  onClick={() =>
                                    handleLikeClick(
                                      mainBrand.uuid,
                                      mainBrand.isLiked
                                    )
                                  }
                                  disabled={
                                    isLoading || likeProcessing[mainBrand.uuid]
                                  }
                                  sx={{
                                    color: mainBrand.isLiked ? "red" : "gray",
                                  }}
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
                          {mainBrand.brandCategories?.child || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction={{ xs: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={6}
                    >
                      <Stack direction="column" spacing={1}>
                        <Fact
                          label="Investment"
                          value={mainBrand.fico?.investmentRange}
                        />
                        <Fact
                          label="Area Required"
                          value={mainBrand.fico?.areaRequired}
                        />
                        <Fact
                          label="Franchise Model"
                          value={mainBrand.fico?.franchiseModel}
                        />
                        {isMobile && (
                          <Button
                            variant="contained"
                            aria-label="view details"
                            onClick={() => handleApply(mainBrand)}
                            sx={{
                              width: "35vh",
                              fontWeight: 800,
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
                            aria-label="view details"
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
                          <>
                            <Tooltip
                              title={
                                mainBrand.isLiked
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                            >
                              <IconButton
                                onClick={() =>
                                  handleLikeClick(
                                    mainBrand.uuid,
                                    mainBrand.isLiked
                                  )
                                }
                                disabled={
                                  isLoading || likeProcessing[mainBrand.uuid]
                                }
                              >
                                {mainBrand.isLiked ? (
                                  <Favorite color="error" />
                                ) : (
                                  <FavoriteBorder />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={
                                mainBrand.isShortListed
                                  ? "Remove from shortlist"
                                  : "Add to shortlist"
                              }
                            >
                              <IconButton
                                onClick={() => handleToggleShortList(mainBrand)}
                                sx={{
                                  color: mainBrand.isShortListed
                                    ? "#7ef400ff"
                                    : "rgba(0, 0, 0, 0.23)",
                                }}
                              >
                                <RiBookmark3Fill size={21} />
                              </IconButton>
                            </Tooltip>
                          </>
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
                  borderColor:
                    theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={
                  viewedBrandsCount >= brands.length - 1
                    ? handleLoadMore
                    : handleNext
                }
                endIcon={
                  isLoading ? (
                    <CircularProgress size={20} sx={{ color: "inherit" }} />
                  ) : (
                    <ChevronRight />
                  )
                }
                disabled={!hasMore && currentIndex === brands.length - 1}
                fullWidth
                sx={{
                  textTransform: "none",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #ffb74d, #ff9800)"
                      : "linear-gradient(45deg, #f57c00, #ff9800)",
                }}
              >
                {isLoading
                  ? "Loading..."
                  : viewedBrandsCount >= brands.length - 1 && hasMore
                  ? "Load More"
                  : "Next"}
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
                  {/* <video
                    ref={(el) => (videoRefs.current[i + 1] = el)}
                    loading="lazy"
                    src={brand.franchiseVideos}
                    alt={brand.brandname}
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
                  /> */}
                  <VideoPlayer
                    key={brand.uuid}
                    id={brand.uuid}
                    videoUrl={brand.franchiseVideos}
                    poster={brand.logo}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    onPlay={() => handleVideoPlay(i + 1)}
                    onPause={() => handleVideoPause(i + 1)}
                    autoPlay={false} // Controlled manually
                    loop={true}
                    muted={true}
                    ref={(el) =>
                      (videoRefs.current[i + 1] = el?.videoRef || null)
                    }
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
                      {!isMobile && (
                        <Box
                          component="img"
                          onClick={() => handleApply(brand)}
                          src={brand.logo}
                          alt={brand.brandname}
                          sx={{
                            width: 100,
                            height: 50,
                            border: `2px solid ${
                              theme.palette.mode === "dark"
                                ? "#ffb74d"
                                : "#f57c00"
                            }`,
                            boxShadow: theme.shadows[2],
                            cursor: "pointer",
                            borderRadius: 0,
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      )}
                      {isMobile && (
                        <Box
                          component="img"
                          onClick={() => handleApply(brand)}
                          src={brand.logo}
                          alt={brand.brandname}
                          sx={{
                            width: 80,
                            height: 50,
                            border: `2px solid ${
                              theme.palette.mode === "dark"
                                ? "#ffb74d"
                                : "#f57c00"
                            }`,
                            boxShadow: theme.shadows[2],
                            cursor: "pointer",
                            borderRadius: 0,
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip
                          title={
                            brand.isLiked
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleLikeClick(brand.uuid, brand.isLiked)
                            }
                            disabled={isLoading || likeProcessing[brand.uuid]}
                            sx={{
                              color: brand.isLiked ? "red" : "gray",
                            }}
                          >
                            {brand.isLiked ? (
                              <Favorite fontSize="small" />
                            ) : (
                              <FavoriteBorder fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            brand.isShortListed
                              ? "Remove from shortlist"
                              : "Add to shortlist"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleToggleShortList(brand)}
                            sx={{
                              color: brand.isShortListed
                                ? "#7ef400ff"
                                : "rgba(0, 0, 0, 0.23)",
                            }}
                          >
                            <RiBookmark3Fill size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        maxHeight: 80,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.8,
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#ccc",
                          borderRadius: "2px",
                        },
                      }}
                    >
                      <Tooltip title={brand.brandname}>
                        <Typography
                          variant={isMobile ? "caption" : "body1"}
                          color="black"
                          mt={1}
                          noWrap={false}
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {brand.brandname}
                        </Typography>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        color="Black"
                        sx={{ fontSize: "0.7rem", lineHeight: 1.1 }}
                      >
                        Categories: {brand.brandCategories?.child}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="Black"
                        sx={{ fontSize: "0.7rem", lineHeight: 1.4 }}
                      >
                        Investment: {brand.fico?.investmentRange}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="Black"
                        sx={{ fontSize: "0.7rem", lineHeight: 1.4 }}
                      >
                        Area: {brand.fico?.areaRequired}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="Black"
                        sx={{ fontSize: "0.7rem", lineHeight: 1.5 }}
                      >
                        Model: {brand.fico?.franchiseModel}
                      </Typography>
                    </Box>
                  </Box>

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

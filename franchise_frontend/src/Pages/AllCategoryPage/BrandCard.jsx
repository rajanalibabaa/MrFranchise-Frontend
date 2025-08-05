import React, {
  useState,
  useCallback,
  memo,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
  Tooltip,
  CardMedia,
  Divider,
} from "@mui/material";
import {
  Favorite,
  AttachMoney,
  AreaChart,
  Description,
  Business,
  CheckBox,
  CheckBoxOutlineBlank,
  PlaylistAddCheckCircleOutlined,
} from "@mui/icons-material";
import LoginPage from "../LoginPage/LoginPage";
// import { openBrandDialog, useToggleLike } from "../../Hooks/Fetchbrands";
import { postView } from "../../Utils/function/view";
import { handleShortList } from "../../Api/shortListApi";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import { VideoPlayer } from "../../services/VideoControllerMedia/VideoPlayercomponents.jsx";

const cardStyles = {
  width: { xs: "40vh", sm: "calc(50% - 10px)", md: 260 },
  height: { xs: "55vh", sm: "calc(50% - 10px)", md: 400 },
  ml: 1.5,
  mt: 4,
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  position: "relative",
  overflow: "hidden",
  borderRadius: 2,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
  },
};

const titleStyles = {
  fontWeight: 600,
  color: "text.primary",
  pr: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  lineHeight: "1em",
  maxHeight: "2.8em",
  wordBreak: "break-word",
};

const viewButtonStyles = {
  py: 0.5,
  bgcolor: "#4caf50",
  borderRadius: 1,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    bgcolor: "#7BC718",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};

const BrandCard = memo(
  ({
    brand,
    handleLikeClick,
    likeProcessing,
    showLogin,
    onShowLogin,
    isSelectedForComparison,
    onToggleBrandComparison,
    maxComparisonReached,
  }) => {
    const { uuid, isLiked, isShortListed } = brand;

    const [brandLike, setBrandLike] = useState(isLiked);
    const [shortListed, setShortListed] = useState(isShortListed);
    const videoRef = useRef(null);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

    const dispatch = useDispatch();
    const handleOpenBrand = useCallback(() => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => postView(uuid));
      } else {
        setTimeout(() => postView(uuid), 0);
      }
      dispatch(openBrandDialog(brand));
    }, [uuid, brand]);

    const handleLike = useCallback(() => {
      if (likeProcessing[uuid]) return;
      const token = localStorage.getItem("accessToken");

      if (!token) {
        onShowLogin(true);
        return;
      }

      handleLikeClick(uuid, brandLike);
      setBrandLike(!brandLike);
    }, [uuid, brandLike, handleLikeClick, likeProcessing, onShowLogin]);

    const handlePlay = useCallback(() => {
      // Pause all other videos
      allVideosRef.current.forEach((video) => {
        if (video !== videoRef.current && !video.paused) {
          video.pause();
        }
      });
      setIsPlaying(true);
    }, []);

    const handlePause = useCallback(() => {
      setIsPlaying(false);
    }, []);

    // useEffect(() => {
    //   const allVideos = document.querySelectorAll('video');
    //   allVideos.forEach(video => {
    //     if (video !== videoRef.current && currentlyPlayingId === brand.uuid) {
    //       video.pause();
    //     }
    //   });
    // }, [currentlyPlayingId, brand.uuid]);

    const handleToggleShortList = useCallback(async () => {
      try {
        const response = await handleShortList(brand);
        if (response.success) {
          setShortListed(!shortListed);
        }
      } catch (error) {
        console.error("Error toggling shortlist:", error);
      }
    }, [brand, shortListed]);

    useEffect(() => {
      if (videoRef.current) {
        allVideosRef.current.add(videoRef.current);
        return () => {
          allVideosRef.current.delete(videoRef.current);
        };
      }
    }, []);

    return (
      <Card sx={cardStyles}>
        <Tooltip
          title={
            maxComparisonReached && !isSelectedForComparison
              ? "Maximum 3 brands can be compared"
              : "Click to add from comparison"
          }
          placement="right"
          arrow
        >
          <span>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 2,
                zIndex: 2,
                backgroundColor: isSelectedForComparison
                  ? "rgba(76, 175, 80, 0.9)"
                  : maxComparisonReached
                  ? "rgba(244, 67, 54, 0.7)"
                  : "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": {
                  backgroundColor: isSelectedForComparison
                    ? "rgba(56, 142, 60, 0.9)"
                    : maxComparisonReached
                    ? "rgba(244, 67, 54, 0.9)"
                    : "rgba(0,0,0,0.7)",
                },
                width: 32,
                height: 32,
              }}
              onClick={() => onToggleBrandComparison(brand)}
              disabled={maxComparisonReached && !isSelectedForComparison}
            >
              {isSelectedForComparison ? (
                <CheckBox fontSize="small" />
              ) : (
                <CheckBoxOutlineBlank fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>

        <Box
          sx={{ p: 1, flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              aspectRatio: "16 / 9",
              margin: "0 auto",
              backgroundColor: "#000",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <VideoPlayer
              ref={videoRef}
              id={brand.uuid} // or any unique identifier
              videoUrl={brand.franchiseVideos}
              poster={brand.logo}
              width="100%"
              height="100%"
              objectFit="cover"
              showControls={true} // equivalent to 'controls' in CardMedia
              autoPlay={false} // set to true if you want autoplay
              loop={false} // set to true if you want looping
              muted={true} // videos are often muted by default for autoplay
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" component="div" sx={titleStyles}>
              {brand.brandname}
            </Typography>
            <Box>
              <IconButton
                onClick={handleLike}
                disabled={likeProcessing[uuid]}
                size="small"
              >
                {likeProcessing[uuid] ? (
                  <CircularProgress size={24} />
                ) : (
                  <Favorite
                    sx={{
                      color: brandLike ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                    }}
                  />
                )}
              </IconButton>
              <IconButton
                onClick={handleToggleShortList}
                size="small"
                sx={{
                  color: shortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                }}
              >
                <Tooltip title="ShortList">
                  <PlaylistAddCheckCircleOutlined />
                </Tooltip>
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              mb: 1,
              minHeight: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {brand.brandCategories?.child ? (
              <Chip
                label={brand.brandCategories.child}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  color: "orange.dark",
                  fontWeight: 200,
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 2, flexGrow: 1, "& > *:not(:last-child)": { mb: 1 } }}>
            <DetailItem
              icon={<AttachMoney />}
              label="Investment"
              value={brand.fico?.investmentRange}
            />
            <DetailItem
              icon={<AreaChart />}
              label="Area"
              value={brand.fico?.areaRequired}
            />
            <DetailItem
              icon={<Business />}
              label="Franchise Model"
              value={brand.fico?.franchiseModel}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleOpenBrand}
            startIcon={<Description />}
            sx={viewButtonStyles}
          >
            View Details
          </Button>
        </Box>

        {showLogin && (
          <LoginPage open={showLogin} onClose={() => onShowLogin(false)} />
        )}
      </Card>
    );
  },
  (prevProps, nextProps) =>
    prevProps.brand.uuid === nextProps.brand.uuid &&
    prevProps.brand.isLiked === nextProps.brand.isLiked &&
    prevProps.brand.isShortListed === nextProps.brand.isShortListed &&
    prevProps.isSelectedForComparison === nextProps.isSelectedForComparison &&
    prevProps.showLogin === nextProps.showLogin &&
    prevProps.maxComparisonReached === nextProps.maxComparisonReached &&
    prevProps.likeProcessing === nextProps.likeProcessing
);

const DetailItem = memo(({ icon, label, value }) => {
  const clonedIcon = useMemo(
    () =>
      React.cloneElement(icon, {
        sx: {
          mr: 1.5,
          fontSize: "1rem",
          color: "text.secondary",
          flexShrink: 0,
        },
      }),
    [icon]
  );

  return (
    <Box display="flex" alignItems="center">
      {clonedIcon}
      <Typography variant="caption" noWrap>
        <span style={{ fontWeight: 400 }}>{label}:</span> {value}
      </Typography>
    </Box>
  );
});

export default BrandCard;

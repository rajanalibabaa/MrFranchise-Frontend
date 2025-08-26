import React, { useState, useCallback, memo, useMemo, useRef } from "react";
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
  RadioButtonUnchecked,Block ,CheckCircle
} from "@mui/icons-material";
import LoginPage from "../LoginPage/LoginPage";
import { postView } from "../../Utils/function/view";
import { useDispatch, useSelector } from "react-redux";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";
import {
  toggleBrandLikefilter,
  toggleBrandShortListfilter,
} from "../../Redux/Slices/FilterBrandSlice.jsx";
import { likeApiFunction } from "../../Api/likeApi";
import { handleShortList } from "../../Api/shortListApi";
import { toggleBrandLike, toggleBrandShortList } from "../../Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { toggleHomeCardLike, toggleHomeCardShortlist } from "../../Redux/Slices/TopCardFetchingSlice.jsx";
import { addSortlist, removeSortList, toggleSortlistBrandLike } from "../../Redux/Slices/shortlistslice.jsx";
import { RiBookmark3Fill } from "react-icons/ri";
import { VideoPlayer } from "../../services/VideoControllerMedia/VideoPlayercomponents.jsx";
import confetti from "canvas-confetti";

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
  border: '1px solid rgba(105, 253, 25, 1)',
  borderRadius: '2px',
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
    showLogin,
    onShowLogin,
    isSelectedForComparison,
    onToggleBrandComparison,
    maxComparisonReached,
  }) => {
    const {
      uuid,
      isLiked,
      isShortListed,
      brandname,
      logo,
      franchiseVideos,
      brandCategories,
      fico,
    } = brand;

    const dispatch = useDispatch();
    const [likeProcessing, setLikeProcessing] = useState(false);
    const [shortlistProcessing, setShortlistProcessing] = useState(false);
    const videoRef = useRef(null);
    const likeButtonRef = useRef(null);
    const shortlistButtonRef = useRef(null);

    // 🎉 Updated confetti effect to use element position
    const triggerCelebration = (color, buttonRef) => {
      if (buttonRef && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { x, y },
          colors: [color, "#ffffff", "#fdc81cff", "#76ec1cff", "#ff1dd6ffff", "#00eaffff", "#0400ffff", "#000000", "#f10808ffff", "#f5f50aff"],
        });
      } else {
        // Fallback to center if element not found
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: [color, "#ffffff"],
        });
      }
    };

    const handleOpenBrand = useCallback(() => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => postView(uuid));
      } else {
        setTimeout(() => postView(uuid), 0);
      }
      dispatch(openBrandDialog(brand));
    }, [uuid, brand, dispatch]);

    const handleLike = useCallback(async () => {
      if (likeProcessing) return;
      const token = localStorage.getItem("accessToken");

      if (!token) {
        onShowLogin(true);
        return;
      }

      setLikeProcessing(true);
      dispatch(toggleSortlistBrandLike(uuid));
      try {
        // Dispatch the Redux action to update UI immediately
        dispatch(toggleBrandLikefilter(uuid));
        dispatch(toggleBrandLike(uuid));
        dispatch(toggleHomeCardLike(uuid));

        // Call the API to update the server
        await likeApiFunction(uuid);

        // Trigger confetti if it's a new like
        if (!isLiked) {
          triggerCelebration("#f44336", likeButtonRef);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert the change if API call fails
        dispatch(toggleBrandLikefilter(uuid));
        dispatch(toggleBrandLike(uuid));
        dispatch(toggleHomeCardLike(uuid));
      } finally {
        setLikeProcessing(false);
      }
    }, [uuid, likeProcessing, onShowLogin, dispatch, isLiked]);

    const handleToggleShortList = useCallback(async () => {
      if (shortlistProcessing) return;
      const token = localStorage.getItem("accessToken");

      if (!token) {
        onShowLogin(true);
        return;
      }

      setShortlistProcessing(true);
      try {
        if (!brand.isShortListed) {
          dispatch(addSortlist(brand));
        } else dispatch(removeSortList(brand.uuid));
        // Dispatch the Redux action to update UI immediately
        dispatch(toggleBrandShortListfilter(uuid));
        dispatch(toggleBrandShortList(uuid));
        dispatch(toggleHomeCardShortlist(uuid));

        // Call the API to update the server
        await handleShortList(uuid);

        // Trigger confetti if it's a new shortlist
        if (!isShortListed) {
          triggerCelebration("#7ef400ff", shortlistButtonRef);
        }
      } catch (error) {
        console.error("Error toggling shortlist:", error);
        // Revert the change if API call fails
        dispatch(toggleBrandShortListfilter(uuid));
        dispatch(toggleBrandShortList(uuid));
        dispatch(toggleHomeCardShortlist(uuid));
      } finally {
        setShortlistProcessing(false);
      }
    }, [brand, uuid, shortlistProcessing, onShowLogin, dispatch, isShortListed]);

    const handlePlay = useCallback(() => {
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((vid) => {
        if (vid !== videoRef.current) {
          vid.pause();
        }
      });
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
          <span><IconButton
  sx={{
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: isSelectedForComparison
      ? "#ff9800" // ✅ Green if selected
      : maxComparisonReached
      ? "rgba(244, 67, 54, 0.85)" // ✅ Red if max reached
      : "rgba(255, 255, 255, 0.85)", // ✅ Neutral white when idle
    color: isSelectedForComparison
      ? "white"
      : maxComparisonReached
      ? "white"
      : "rgba(0,0,0,0.7)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: isSelectedForComparison
        ? "rgba(56, 142, 60, 0.9)"
        : maxComparisonReached
        ? "rgba(211, 47, 47, 0.9)"
        : "rgba(240,240,240,0.95)",
      transform: "scale(1.15)",
      transition: "all 0.2s ease-in-out",
    },
    width: 36,
    height: 36,
    borderRadius: "50%", // ✅ rounded for modern look
  }}
  onClick={() => onToggleBrandComparison(brand)}
  disabled={maxComparisonReached && !isSelectedForComparison}
>
  {isSelectedForComparison ? (
    <CheckCircle fontSize="small" />
  ) : maxComparisonReached ? (
    <Block fontSize="small" /> // ❌ blocked icon when max limit hit
  ) : (
    <RadioButtonUnchecked fontSize="small" />
  )}
</IconButton>  
          </span>
        </Tooltip>

        <Box
          sx={{ p: 0.5, flexGrow: 1, display: "flex", flexDirection: "column" }}
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
              id={brand.uuid}
              videoUrl={brand.franchiseVideos || brand.logo}
              poster={brand.logo}
              preload="auto"
              width="100%"
              height="100%"
              ref={videoRef}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" component="div" sx={titleStyles}>
              {brandname}
            </Typography>
            <Box>
              <IconButton
                ref={likeButtonRef}
                onClick={handleLike}
                disabled={likeProcessing}
                size="small"
              >
                {likeProcessing ? (
                  <CircularProgress size={24} />
                ) : (
                  <Favorite
                    sx={{
                      color: isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                    }}
                  />
                )}
              </IconButton>
              <IconButton
                ref={shortlistButtonRef}
                onClick={handleToggleShortList}
                size="small"
                disabled={shortlistProcessing}
                sx={{
                  color: isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                }}
              >
                {shortlistProcessing ? (
                  <CircularProgress size={24} />
                ) : (
                  <RiBookmark3Fill size={21} />
                )}
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
            {brandCategories?.child ? (
              <Chip
                label={brandCategories.child}
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

          <Box sx={{ mb: 2,ml:1, flexGrow: 1, "& > *:not(:last-child)": { mb: 1 ,} }}>
            <DetailItem
              icon={<AttachMoney />}
              label="Investment"
              value={fico?.investmentRange}
            />
            <DetailItem
              icon={<AreaChart />}
              label="Area"
              value={fico?.areaRequired}
            />
            <DetailItem
              icon={<Business />}
              label="Franchise Model"
              value={fico?.franchiseModel}
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
    prevProps.maxComparisonReached === nextProps.maxComparisonReached
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
        <span style={{ fontWeight: 400 }}>{label}:</span> {value || "N/A"}
      </Typography>
    </Box>
  );
});

export default BrandCard;
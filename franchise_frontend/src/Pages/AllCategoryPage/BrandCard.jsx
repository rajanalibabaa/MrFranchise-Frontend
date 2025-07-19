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
  Compare,
  Favorite,
  LocationOn,
  AttachMoney,
  AreaChart,
  Description,
  Business,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import LoginPage from "../LoginPage/LoginPage";
import { openBrandDialog, useToggleLike } from "../../Hooks/Fetchbrands";
import { postView } from "../../Utils/function/view";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const cardStyles = {

  width:  { xs: "40vh", sm: "calc(50% - 10px)", md: 260 },
  height: { xs: "55vh", sm: "calc(50% - 10px)", md: 380 },
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


const logoStyles = {
  objectFit: "contain",
  backgroundColor: "#f9f9f9",
  py: 2,
  height: "200px",
  width: "100%",
  borderBottom: "1px solid #eee",
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
  py: .5,
  bgcolor: "#4caf50",
  borderRadius: 1,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    bgcolor: "#7BC718",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};

const BrandCard = memo(({
  brand,
  showLogin,
  onShowLogin,
  isSelectedForComparison,
  onToggleBrandComparison,
  maxComparisonReached
}) => {
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const { mutate: toggleLike } = useToggleLike();

  const {
    uuid,
    uploads = {},
    brandDetails = {},
    franchiseDetails = {},
    isLiked,
  } = brand;

  const investmentRange = useMemo(
    () => franchiseDetails.fico?.[0]?.investmentRange || "Not specified",
    [franchiseDetails.fico]
  );

  const areaRequired = useMemo(
    () => franchiseDetails.fico?.[0]?.areaRequired || "Not specified",
    [franchiseDetails.fico]
  );
  const franchiseModel = useMemo(
    () => franchiseDetails.fico?.[0]?.franchiseModel || "Not specified",
    [franchiseDetails.fico]
  );

  const handleOpenBrand = useCallback(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => postView(uuid));
    } else {
      setTimeout(() => postView(uuid), 0);
    }
    openBrandDialog(brand);
  }, [uuid, brand]);

  const handleLikeClick = useCallback(() => {
    if (isProcessingLike) return;
    setIsProcessingLike(true);
    toggleLike(
      { brandId: uuid, isLiked },
      { onSettled: () => setIsProcessingLike(false) }
    );
  }, [uuid, isLiked, toggleLike, isProcessingLike]);

  const handleComparisonToggle = useCallback(() => {
    if (maxComparisonReached && !isSelectedForComparison) return;
    onToggleBrandComparison(brand);
  }, [brand, onToggleBrandComparison, isSelectedForComparison, maxComparisonReached]);


  const videoRef = useRef(null);
 const handlePlay = () => {
    const allVideos = document.querySelectorAll("video");
    allVideos.forEach((vid) => {
      if (vid !== videoRef.current) {
        vid.pause();
      }
    });
  };
  return (
    <Card sx={cardStyles}>

<Tooltip
  title={
    maxComparisonReached && !isSelectedForComparison
      ? "Maximum 3 brands can be compared"
      : ""
  }
  placement="top"
>
  <span>
    <IconButton
      sx={{
        position: "absolute",
        top: 8,
        right: 2,
        zIndex: 2,
        backgroundColor: isSelectedForComparison
          ? "rgba(76, 175, 80, 0.9)" // Green when selected
          : maxComparisonReached
          ? "rgba(244, 67, 54, 0.7)" // Red when disabled
          : "rgba(0,0,0,0.5)", // Default
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
      onClick={handleComparisonToggle}
      disabled={maxComparisonReached && !isSelectedForComparison}
    >
      {isSelectedForComparison ? (
        <CheckBox fontSize="small" /> // Checked state
      ) : (
        <CheckBoxOutlineBlank fontSize="small" /> // Unchecked state
      )}
    </IconButton>
  </span>
</Tooltip>


      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>

        <Box
  sx={{
    position: "relative",
    width: "100%",          // Take full width
    maxWidth: "640px",      // Optional max size
    margin: "0 auto",       // Center horizontally
    aspectRatio: "16/9",    // Keeps 16:9 ratio
  }}
>
<Box
  sx={{
    position: "relative",
    width: "100%",
    maxWidth: "50vh",    // Controls overall size
    aspectRatio: "16/9", // Keeps the video ratio locked
    margin: "0 auto",    // Center horizontally
  }}
>
  <CardMedia
    component="video"
    ref={videoRef}
    loading="lazy"
    poster={uploads.brandLogo} // Poster will also match same box size
    src={uploads.franchisePromotionVideo}
    alt={brandDetails.brandName}
    sx={{
      width: "100%",
      height: "100%",
      objectFit: "contain", // Keeps video/poster proportional
      backgroundColor: "#000", // Optional: black background for empty space
    }}
    onPlay={handlePlay}
    controls
    
    preload="none"
  />
</Box>

</Box>

<Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-evenly" alignItems="flex-start" >
          <Typography variant="body1" component="div" sx={titleStyles}>
            {brandDetails.brandName}
          </Typography>
          <IconButton
            onClick={handleLikeClick}
            disabled={isProcessingLike}
            // sx={{ ml: 1 }}
          >
            {isProcessingLike ? (
              <CircularProgress size={24} />
            ) : (
              <Favorite sx={{ color: isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)" }} />
            )}
          </IconButton>
           <IconButton size="small" sx={{ color: "rgba(0,0,0,0.23)",mt:0.4 }}>
            <PlaylistAddCheckIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 1, minHeight: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {franchiseDetails.brandCategories?.child ? (
            <Chip
              label={franchiseDetails.brandCategories.child}
              size="small"
              sx={{ bgcolor: "rgba(255, 152, 0, 0.1)", color: "orange.dark", fontWeight: 200 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">N/A</Typography>
          )}

         
        </Box>

        <Box sx={{ mb: 2, flexGrow: 1, "& > *:not(:last-child)": { mb: 1 } }}>
          <DetailItem icon={<AttachMoney />} label="Investment Range" value={investmentRange} />
          <DetailItem icon={<AreaChart />} label="Area Required" value={areaRequired} />
          <DetailItem icon={<Business />} label="Franchise Model" value={franchiseModel} />
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

      {showLogin && <LoginPage open={showLogin} onClose={() => onShowLogin(false)} />}
    </Card>
  );
}, (prevProps, nextProps) => (
  prevProps.brand.uuid === nextProps.brand.uuid &&
  prevProps.brand.isLiked === nextProps.brand.isLiked &&
  prevProps.isSelectedForComparison === nextProps.isSelectedForComparison &&
  prevProps.showLogin === nextProps.showLogin &&
  prevProps.maxComparisonReached === nextProps.maxComparisonReached
));


const DetailItem = memo(({ icon, label, value }) => {
  const clonedIcon = useMemo(
    () => React.cloneElement(icon, { sx: { mr: 1.5, fontSize: "1rem", color: "text.secondary", flexShrink: 0 } }),
    [icon]
  );

  return (
    <Box display="flex" alignItems="center">
      {clonedIcon}
      <Typography variant="caption" noWrap>
        <span style={{ fontWeight: 600 }}>{label}:</span> {value}
      </Typography>
    </Box>
  );
});

export default BrandCard;
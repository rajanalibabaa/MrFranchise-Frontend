import React, { useState, useCallback, memo, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Compare,
  Favorite,
  LocationOn,
  AttachMoney,
  AreaChart,
  Description,
} from "@mui/icons-material";
import LoginPage from "../LoginPage/LoginPage";
import { openBrandDialog } from "../../Hooks/Fetchbrands.jsx";
import { postView } from "../../Utils/function/view.jsx";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const cardStyles = {
  width: 320,
  height: 520,
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
  py: 1.25,
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
    const [localIsLiked, setLocalIsLiked] = useState(brand.isLiked);
    const [isProcessingLike, setIsProcessingLike] = useState(false);

    const {
      uuid,
      uploads = {},
      brandDetails = {},
      franchiseDetails = {},
      expansionLocationData = {},
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

    const handleOpenBrand = useCallback(() => {
      console.log("Open brand dialog ============", brand);
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          postView(uuid);
        });
      } else {
        setTimeout(() => postView(uuid), 0);
      }
      openBrandDialog(brand);
    }, [uuid, brand]);

    // const handleLikeClick = useCallback(async () => {
    //   if (isProcessingLike[uuid]) return;

    //   setIsProcessingLike(prev => ({ ...prev, [uuid]: true }));
    //   try {
    //     await Promise.resolve();
    //     await onToggleLike(uuid, isLiked);
    //   } finally {
    //     setIsProcessingLike(prev => ({ ...prev, [uuid]: false }));
    //   }
    // }, [uuid, isLiked, onToggleLike, isProcessingLike]);

    const handleComparisonToggle = useCallback(() => {
      if (maxComparisonReached && !isSelectedForComparison) {
        return;
      }
      requestAnimationFrame(() => {
        onToggleBrandComparison(brand);
      });
    }, [brand, onToggleBrandComparison, isSelectedForComparison, maxComparisonReached]);

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
                right: 8,
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
              onClick={handleComparisonToggle}
              disabled={maxComparisonReached && !isSelectedForComparison}
            >
              <Compare fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Box
          sx={{
            p: 2,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="img"
            src={uploads.brandLogo}
            alt={brandDetails.brandName || "Brand logo"}
            loading="lazy"
            sx={logoStyles}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mt={1}
          >
            <Typography variant="h6" component="div" sx={titleStyles}>
              {brandDetails.brandName}
            </Typography>
            <IconButton sx={{
              color:'rgba(0,0,0,0.23)',
            }}
            onClick={()=>{
              console.log("shortlist is clicked")
            }}
            >
            <PlaylistAddCheckIcon/>
            </IconButton>
            <IconButton
              onClick={() =>
                handleLikeClick(uuid, isLiked)
              }
              disabled={likeProcessing[brandDetails.uuid]}
              sx={{ ml: 1 }}
            >
              {likeProcessing[brandDetails.uuid] ? (
                <CircularProgress size={24} />
              ) : (
                <Favorite
                  sx={{
                    color: brandDetails.isLiked
                      ? "#f44336"
                      : "rgba(0, 0, 0, 0.23)",
                  }}
                />
              )}
            </IconButton>
          </Box>

          <Box sx={{ mb: 1, minHeight: 32 }}>
            {franchiseDetails.brandCategories?.child ? (
              <Chip
                label={franchiseDetails.brandCategories.child}
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  color: "orange.dark",
                  fontWeight: 500,
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                N/A
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              mb: 2,
              flexGrow: 1,
              "& > *:not(:last-child)": {
                mb: 1,
              },
            }}
          >
            <LocationDetail
              locations={expansionLocationData.expansionLocations}
              onViewMore={handleOpenBrand}
            />

            <DetailItem
              icon={<AttachMoney />}
              label="Investment Range"
              value={investmentRange}
            />

            <DetailItem
              icon={<AreaChart />}
              label="Area Required"
              value={areaRequired}
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
  (prevProps, nextProps) => {
    return (
      prevProps.brand.uuid === nextProps.brand.uuid &&
      prevProps.brand.isLiked === nextProps.brand.isLiked &&
      prevProps.isSelectedForComparison === nextProps.isSelectedForComparison &&
      prevProps.showLogin === nextProps.showLogin &&
      prevProps.maxComparisonReached === nextProps.maxComparisonReached
    );
  }
);

const LocationDetail = memo(({ locations, onViewMore }) => {
  const { displayText, hasMore } = useMemo(() => {
    const domestic = locations?.domestic?.locations || [];
    const international = locations?.international?.locations || [];
    const all = [...domestic, ...international];

    const names = all.map((loc) => loc.state || loc.country).filter(Boolean);
    const display = names.slice(0, 2).join(", ");
    const hasMore = names.length > 2;

    return { displayText: display || "Multiple locations", hasMore };
  }, [locations]);

  return (
    <Box display="flex" alignItems="center">
      <LocationOn
        sx={{
          mr: 1.5,
          fontSize: "1rem",
          color: "text.secondary",
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" noWrap>
        <span style={{ fontWeight: 600 }}>Expansion Location:</span>
        <br />
        {displayText}
        {hasMore && (
          <Button
            size="small"
            sx={{ ml: 0.5, minWidth: 0, padding: 0 }}
            onClick={onViewMore}
          >
            ...more
          </Button>
        )}
      </Typography>
    </Box>
  );
});


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
      <Typography variant="body2" noWrap>
        <span style={{ fontWeight: 600 }}>{label}:</span> {value}
      </Typography>
    </Box>
  );
});

export default BrandCard;

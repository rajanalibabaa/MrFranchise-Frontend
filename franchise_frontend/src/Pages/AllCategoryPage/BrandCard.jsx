import React, { useState, useCallback, memo, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Compare,
  Favorite,
  LocationOn,
  AttachMoney,
  AreaChart,
  Description,
} from '@mui/icons-material';
import LoginPage from '../LoginPage/LoginPage';
import { openBrandDialog } from "../../Hooks/Fetchbrands.jsx";
import { postView } from '../../Utils/function/view.jsx';

// Pre-define styles to avoid recreating them on every render
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

const BrandCard = memo(({
  brand,
  toggleLike,
  showLogin,
  setShowLogin,
  isSelectedForComparison,
  toggleBrandComparison,
}) => {
  const [isProcessingLike, setIsProcessingLike] = useState({});
  
  // Destructure brand data once and memoize complex computations
  const {
    uuid,
    uploads = {},
    brandDetails = {},
    franchiseDetails = {},
    expansionLocationData = {},
    isLiked,
  } = brand;

  // Memoize expensive computations
  const investmentRange = useMemo(() => 
    franchiseDetails.fico?.[0]?.investmentRange || "Not specified",
  [franchiseDetails.fico]);

  const areaRequired = useMemo(() => 
    franchiseDetails.fico?.[0]?.areaRequired || "Not specified",
  [franchiseDetails.fico]);

  // Memoized handlers with optimized dependencies
  const handleOpenBrand = useCallback(() => {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        postView(uuid);
      });
    } else {
      setTimeout(() => postView(uuid), 0);
    }
    
    // Open dialog immediately as it's user-facing
    openBrandDialog(brand);
  }, [uuid, brand]);

  const handleLikeClick = useCallback(async () => {
    if (isProcessingLike[uuid]) return;
    
    setIsProcessingLike(prev => ({ ...prev, [uuid]: true }));
    try {
      // Use microtask to ensure UI updates first
      await Promise.resolve();
      await toggleLike(uuid, isLiked);
    } finally {
      setIsProcessingLike(prev => ({ ...prev, [uuid]: false }));
    }
  }, [uuid, isLiked, toggleLike, isProcessingLike]);

  const handleComparisonToggle = useCallback(() => {
    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      toggleBrandComparison(brand);
    });
  }, [brand, toggleBrandComparison]);

  return (
    <Card sx={cardStyles}>
      {/* Comparison toggle button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: isSelectedForComparison
            ? "rgba(76, 175, 80, 0.9)"
            : "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            backgroundColor: isSelectedForComparison
              ? "rgba(56, 142, 60, 0.9)"
              : "rgba(0,0,0,0.7)",
          },
          width: 32,
          height: 32,
        }}
        onClick={handleComparisonToggle}
      >
        <Compare fontSize="small" />
      </IconButton>

      {/* Content Container */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand Logo Image - Lazy loading with eager loading for above-the-fold images */}
        <Box
          component="img"
          src={uploads.brandLogo}
          alt={brandDetails.brandName || "Brand logo"}
          loading="lazy"
          sx={logoStyles}
        />     

        {/* Brand Name and Like Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mt={1}
        >
          <Typography variant="h6" component="div" sx={titleStyles}>
            {brandDetails.brandName}
          </Typography>
          <IconButton
            onClick={handleLikeClick}
            disabled={isProcessingLike[uuid]}
            aria-label={isLiked ? "Unlike brand" : "Like brand"}
          >
            {isProcessingLike[uuid] ? (
              <CircularProgress size={24} />
            ) : (
              <Favorite
                sx={{
                  color: isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                }}
              />
            )}
          </IconButton>
        </Box>

        {/* Categories - Optimized rendering */}
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

        {/* Details List */}
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

        {/* View Details Button */}
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

      {/* Login Modal - Lazy load if possible */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.brand.uuid === nextProps.brand.uuid &&
    prevProps.brand.isLiked === nextProps.brand.isLiked &&
    prevProps.isSelectedForComparison === nextProps.isSelectedForComparison &&
    prevProps.showLogin === nextProps.showLogin
  );
});

// Optimized LocationDetail component
const LocationDetail = memo(({ locations, onViewMore }) => {
  const locationText = useMemo(() => {
    if (!locations) return "Multiple locations";
    
    const domestic = locations.domestic?.locations || [];
    const international = locations.international?.locations || [];
    const allLocations = [...domestic, ...international];
    
    return allLocations.length > 0 
      ? allLocations.map(loc => loc.state || loc.country).filter(Boolean).join(", ")
      : "Multiple locations";
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
        {locationText}
        {locations && (
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

// Optimized DetailItem component
const DetailItem = memo(({ icon, label, value }) => {
  const clonedIcon = useMemo(() => React.cloneElement(icon, {
    sx: {
      mr: 1.5,
      fontSize: "1rem",
      color: "text.secondary",
      flexShrink: 0,
    }
  }), [icon]);

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
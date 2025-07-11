import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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

const BrandCard = memo(({
  brand,
  toggleLike,
  showLogin,
  setShowLogin,
  isSelectedForComparison,
  toggleBrandComparison,
}) => {
  const [isProcessingLike, setIsProcessingLike] = useState({});
  

  // Memoize the brand data to prevent unnecessary re-renders
  const {
    uuid,
    uploads = {},
    brandDetails = {},
    franchiseDetails = {},
    expansionLocationData = {},
    isLiked,
  } = brand;

  // Memoized handler for opening brand details
  const handleOpenBrand = useCallback(() => {
    postView(uuid);
    openBrandDialog(brand);
  }, [uuid, brand]);

  // Memoized handler for like click
  const handleLikeClick = useCallback(async () => {
    if (isProcessingLike[uuid]) return;
    
    setIsProcessingLike(prev => ({ ...prev, [uuid]: true }));
    try {
      await toggleLike(uuid, isLiked);
    } finally {
      setIsProcessingLike(prev => ({ ...prev, [uuid]: false }));
    }
  }, [uuid, isLiked, toggleLike, isProcessingLike]);

  // Memoized handler for comparison toggle
  const handleComparisonToggle = useCallback(() => {
    toggleBrandComparison(brand);
  }, [brand, toggleBrandComparison]);

  return (
    <Card
      sx={{
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
      }}
    >
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
        {/* Brand Logo Image - Lazy loading */}
        <Box
          component="img"
          src={uploads.brandLogo}
          alt={brandDetails.brandName || "Brand logo"}
          loading="lazy"
          sx={{
            objectFit: "contain",
            backgroundColor: "#f9f9f9",
            py: 2,
            height: "200px",
            width: "100%",
            borderBottom: "1px solid #eee",
          }}
        />     

        {/* Brand Name and Like Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mt={1}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
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
            }}
          >
            {brandDetails.brandName}
          </Typography>
          <IconButton
            onClick={handleLikeClick}
            disabled={isProcessingLike[uuid]}
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

        {/* Details List - Memoized components */}
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
            value={franchiseDetails.fico?.[0]?.investmentRange || "Not specified"}
          />
          
          <DetailItem
            icon={<AreaChart />}
            label="Area Required"
            value={franchiseDetails.fico?.[0]?.areaRequired || "Not specified"}
          />
        </Box>

        {/* View Details Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleOpenBrand}
          startIcon={<Description />}
          sx={{
            py: 1.25,
            bgcolor: "#4caf50",
            borderRadius: 1,
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#7BC718",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            },
          }}
        >
          View Details
        </Button>
      </Box>

      {/* Login Modal - Only render when needed */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Card>
  );
});

// Memoized sub-components for better performance
const LocationDetail = memo(({ locations, onViewMore }) => {
  const locationText = React.useMemo(() => {
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

const DetailItem = memo(({ icon, label, value }) => (
  <Box display="flex" alignItems="center">
    {React.cloneElement(icon, {
      sx: {
        mr: 1.5,
        fontSize: "1rem",
        color: "text.secondary",
        flexShrink: 0,
      }
    })}
    <Typography variant="body2" noWrap>
      <span style={{ fontWeight: 600 }}>{label}:</span> {value}
    </Typography>
  </Box>
));

export default BrandCard;
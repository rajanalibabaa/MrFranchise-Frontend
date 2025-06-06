import React, { useState } from 'react';
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
  Star,
  StarBorder,
} from '@mui/icons-material';
import LoginPage from '../LoginPage/LoginPage';


const BrandCard = ({
  brand,
  handleOpenBrand,
  toggleLike,
  showLogin,
  setShowLogin,
  isSelectedForComparison,
  toggleBrandComparison,
}) => {
const [isProcessingLike, setIsProcessingLike] = useState({});

const handleLikeClick = async (brandId, isLiked) => {
  if (isProcessingLike[brandId]) return;
  
  setIsProcessingLike(prev => ({ ...prev, [brandId]: true }));
  try {
    await toggleLike(brandId, isLiked);
  } finally {
    setIsProcessingLike(prev => ({ ...prev, [brandId]: false }));
  }
};

  return (
    <Card
      sx={{
        width: 320, // Fixed width
        height: 520, // Fixed height
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
        onClick={() => toggleBrandComparison(brand)}
      >
        <Compare fontSize="small" />
      </IconButton>

      {/* Brand Logo Image */}
      <Box
        component="img"
        src={brand.brandDetails?.brandLogo}
        alt={brand.personalDetails?.brandName || "Brand logo"}
        sx={{
          objectFit: "contain",
          backgroundColor: "#f9f9f9",
          py: 2,
          height: 180,
          width: "100%",
          borderBottom: "1px solid #eee",
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand Name and Like Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
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
            }}
          >
            {brand.personalDetails?.brandName}
          </Typography>
          <IconButton
            onClick={() => handleLikeClick(brand.uuid, brand.isLiked)}
            disabled={isProcessingLike[brand.uuid]}
          >
            {isProcessingLike[brand.uuid] ? (
              <CircularProgress size={24} />
            ) : (
              <Favorite
                sx={{
                  color: brand.isLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                }}
              />
            )}
          </IconButton>
        </Box>

        {/* Rating
        <Box display="flex" alignItems="center" mb={1.5}>
          <Rating
            value={4.5}
            precision={0.5}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" sx={{ color: "#ff9800" }} />}
            emptyIcon={<StarBorder fontSize="inherit" />}
          />
          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
            (24 reviews)
          </Typography>
        </Box> */}

        {/* Categories */}
        <Box sx={{ mb: 2, minHeight: 32 }}>
          {brand.personalDetails?.brandCategories
            ?.slice(0, 2)
            .map((category, index) => (
              <Chip
                key={index}
                label={category.main}
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  color: "orange.dark",
                  fontWeight: 500,
                }}
              />
            ))}
        </Box>

        {/* Details List */}
        <Box
          sx={{
            mb: 2,
            flexGrow: 1,
            "& > *:not(:last-child)": {
              mb: 1.5,
            },
          }}
        >
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
              {brand.personalDetails.expansionLocation?.length > 0 ? (
                <>
                  {brand.personalDetails.expansionLocation
                    .slice(0, 2) // Always show first 2 states
                    .map((loc) => loc.state)
                    .join(", ")}

                  {/* Always show "more" if there are locations (even if ≤2) */}
                  <Button
                    size="small"
                    sx={{ ml: 0.5, minWidth: 0, padding: 0 }}
                    onClick={() => handleOpenBrand(brand)}
                  >
                    ...more
                  </Button>
                </>
              ) : (
                "Multiple locations"
              )}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AttachMoney
              sx={{
                mr: 1.5,
                fontSize: "1rem",
                color: "text.secondary",
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap>
              <span style={{ fontWeight: 600 }}>Investment Range:</span>{" "}
              {brand.franchiseDetails?.modelsOfFranchise?.[0]
                ?.investmentRange || "Not specified"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AreaChart
              sx={{
                mr: 1.5,
                color: "text.secondary",
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap>
              <span style={{ fontWeight: 600 }}>Area Required:</span>{" "}
              {brand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired
                ? `${brand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft`
                : "Not specified"}
            </Typography>
          </Box>
        </Box>

        {/* View Details Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleOpenBrand(brand)}
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

      {/* Login Modal */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Card>
  );
};

export default BrandCard
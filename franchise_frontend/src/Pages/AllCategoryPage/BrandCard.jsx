import React, { useState ,} from 'react';
import { useNavigate, } from 'react-router-dom';
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
import { openBrandDialog } from '../../Redux/Slices/brandSlice.jsx';
import brandData from './BrandDetailsPage.jsx';



const BrandCard = ({
  brand,
 
  toggleLike,
  showLogin,
  setShowLogin,
  isSelectedForComparison,
  toggleBrandComparison,
}) => {
const [isProcessingLike, setIsProcessingLike] = useState({});


const navigate = useNavigate();
const dispatch = useDispatch()

const handleOpenBrand = (brand) => {
  

  const newWindow = window.open(`/brands/${brand.uuid}?`, '_blank');
  localStorage.setItem(`brand-${brand.uuid}`, JSON.stringify(brand));

  if (newWindow) {
    newWindow.onbeforeunload = () => {
      localStorage.removeItem(`brand-${brand.uuid}`);
    };
  }

};

const handleLikeClick = async (brandId, isLiked) => {
  if (isProcessingLike[brandId]) return;
  
  setIsProcessingLike(prev => ({ ...prev, [brandId]: true }));
  try {
    await toggleLike(brandId, isLiked);
  } finally {
    setIsProcessingLike(prev => ({ ...prev, [brandId]: false }));
  }

  console.log("isLiked :", isLiked)
  console.log("brandId :", brandId)

  
};

  return (
    <Card
      sx={{
        // overflow:"scroll",
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
   
      

      {/* Content Container */}
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
        src={brand.uploads?.brandLogo}
        alt={brand.brandDetails?.brandName || "Brand logo"}
        sx={{
          objectFit: "contain",
          backgroundColor: "#f9f9f9",
          py: 2,
          height: "200px" ,
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
  {brand.brandDetails?.brandName}
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

        {/* Categories */}
       <Box sx={{ mb: 1, minHeight: 32 }}>
  {brand.franchiseDetails?.brandCategories ? (
    [  "child"].map((key, index) => (
      brand.franchiseDetails.brandCategories[key] && (
        <Chip
          key={index}
          label={brand.franchiseDetails.brandCategories[key]}
          size="small"
          sx={{
            mr: 1,
            mb: 1,
            bgcolor: "rgba(255, 152, 0, 0.1)",
            color: "orange.dark",
            fontWeight: 500,
          }}
        />
      )
    ))
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
    {brand?.expansionLocationData?.expansionLocations ? (
      <>
        {[
          ...(brand.expansionLocationData.expansionLocations.domestic?.locations || []),
          ...(brand.expansionLocationData.expansionLocations.international?.locations || []),
        ]
          .map((loc) => loc.state || loc.country) // Use 'state' for domestic, 'country' fallback for international
          .filter(Boolean)
          .slice(0, 1) // Show first 2 only
          .join(", ")}

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
              {brand.franchiseDetails?.fico?.[0]?.investmentRange || "Not specified"}
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
            { brand.franchiseDetails?.fico?.[0]?.areaRequired || "Not specified"}
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
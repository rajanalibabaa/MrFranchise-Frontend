import { Typography, Box, Button, Card, Avatar, IconButton, Stack, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from "react-router-dom";
import { postView } from '../../Utils/function/view';
import LoginPage from "../../Pages/LoginPage/LoginPage";
import {useBrands, useToggleLike,openBrandDialog} from "../../Hooks/Fetchbrands"
const TopInvestVdocardround = () => {
  const navigate = useNavigate();
  
  const { data: brands = [], isLoading: brandsLoading, error } = useBrands();
  const toggleLike = useToggleLike();
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);


const handleLikeClick = useCallback((brandId, isLiked) => {
  // Immediate UI update - no waiting for API response
  const token = localStorage.getItem("accessToken");
  if (!token) {
    setShowLogin(true);
    return;
  }

  // Optimistically update the UI first
  toggleLike.mutate(
    { brandId, isLiked },
    {
      onMutate: () => {
        // Local state to prevent double clicks
        setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
      },
      onError: (error) => {
        console.error("Like operation failed:", error);
        // Optionally show error feedback to user
        toast.error("Failed to update like status");
      },
      onSettled: () => {
        // Reset processing state when done
        setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
      }
    }
  );
}, [toggleLike]);

 

    const handleApply = useCallback((brand) => {
    postView(brand.uuid);
    openBrandDialog(brand);
  }, []);

  if (brandsLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress size={60} thickness={4} sx={{ color: '#f29724' }} />
    </Box>
  );

  if (error) return (
    <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">{error.message || "Failed to load brands."}</Typography>
      </Box>
  );

  return (
    <Box component="section" sx={{ maxWidth: 1300, mx: "auto" }}>
      <Typography variant="h5" sx={{ 
        mb: 2, 
        fontWeight: 800,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #f29724 30%, #ffcc80 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Franchise Opportunities
      </Typography>

      {/* Compact Cards Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { 
          xs: 'repeat(2, 1fr)', 
          sm: 'repeat(3, 1fr)', 
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)'
        },
        gap: 5,
        mb: 6
      }}>
        {brands.map((brand) => (
          <motion.div
            key={brand.uuid}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card sx={{
              p: 1.5,
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(242, 151, 36, 0.2)'
              }
            }}>
              {/* Like Button */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  zIndex: 2,
                  color: brand?.isLiked ? '#ff5252' : 'rgba(0,0,0,0.2)',
                  '&:hover': {
                    color: '#ff5252'
                  }
                }}
                onClick={() => handleLikeClick(brand.uuid, brand?.isLiked)}
                disabled={likeProcessing[brand.uuid]}
              >
                {likeProcessing[brand.uuid] ? (
                  <CircularProgress size={24} />
                ) : brand?.isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>

              {/* Brand Logo */}
              <Avatar
                src={brand.uploads?.brandLogo}
                alt={brand.uploads?.brandName}
                variant="square"
                
                loading="lazy"
                sx={{
                  width: 70,
                  height: 70,
                  border: '1px solid #f29724',
                  mb: 1
                }}
              />

              {/* Brand Name */}
              <Typography 
                variant="caption" 
                fontWeight={600}
                textAlign="center"
                sx={{
                  mb: 0.5,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {brand.brandDetails?.brandName}
              </Typography>
              
              {/* Category Chips */}
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 0.5,
                mt: 0.5,
                mb: 1
              }}>
                {brand?.franchiseDetails?.brandCategories?.child}
              </Box>
              
              {/* Investment */}
              <Stack direction="column" spacing={0.5} sx={{ mb: 0.5 }}>
                <Typography variant="caption" fontWeight={500}>
                  Investment: {brand.franchiseDetails?.fico?.[0]?.investmentRange || 'N/A'}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  Area: {brand.franchiseDetails?.fico?.[0]?.areaRequired || 'N/A'} sq.ft
                </Typography>
              </Stack>

              {/* View Button */}
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => handleApply(brand)}
                sx={{
                  mt: 'auto',
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  py: 0.5,
                  borderColor: '#f29724',
                  color: 'green',
                  '&:hover': {
                    backgroundColor: 'rgba(250, 141, 8, 0.7)'
                  }
                }}
              >
                View Details
              </Button>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* {brands.length > visibleBrands && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(45deg, #f29724 30%, #ffcc80 90%)',
              fontWeight: 600,
              fontSize: '0.875rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(242, 151, 36, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={handleShowMore}
          >
            Show More Brands
          </Button>
        </Box>
      )} */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default React.memo(TopInvestVdocardround);
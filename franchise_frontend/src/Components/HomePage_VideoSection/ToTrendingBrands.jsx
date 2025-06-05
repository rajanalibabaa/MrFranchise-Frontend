import { Typography, Box, Button, Card, Avatar, IconButton, Stack, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openBrandDialog } from "../../Redux/Slices/brandSlice";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";


const TopInvestVdocardround = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedBrands, setLikedBrands] = useState({});
  const [visibleBrands, setVisibleBrands] = useState(15);

  
    const navigate = useNavigate();
    const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/homepage/getAllnewRegisterBrands",
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.data?.length) {
          setBrands(response.data.data);
          setError(null);
        } else {
          setBrands([]);
          setError("No brands found.");
        }
      } catch (err) {
        setError("Failed to fetch brands.");
        setBrands([]);
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = (brandId) => {
    setLikedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };

  const handleShowMore = () => {
    setVisibleBrands(prev => prev + 10);
  };


  const handleApply = (brand) => {
      dispatch(openBrandDialog(brand));
      console.log("Apply", brand);
    };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress size={60} thickness={4} sx={{ color: '#f29724' }} />
    </Box>
  );

  if (error) return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box component="section" sx={{  maxWidth: 1400, mx: "auto" }}>
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
        {brands.slice(0, visibleBrands).map((brand) => (
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
                  color: likedBrands[brand.uuid] ? '#ff5252' : 'rgba(0,0,0,0.2)',
                  '&:hover': {
                    color: '#ff5252'
                  }
                }}
                onClick={() => handleLike(brand.uuid)}
              >
                {likedBrands[brand.uuid] ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>

              {/* Brand Logo */}
              <Avatar
                src={brand.brandDetails?.brandLogo}
                alt={brand.personalDetails?.brandName}
                sx={{
                  width: 70,
                  height: 70,
                  border: '1px solid #f29724',
                  mb: 1
                }}
              />

              {/* Brand Name */}
              <Typography 
                variant="body1" 
                fontWeight={700}
                textAlign="center"
                sx={{
                  mb: 0.5,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {brand.personalDetails?.brandName}
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
                {brand.personalDetails?.brandCategories?.slice(0, 2).map((category, idx) => (
                  <Typography key={idx} variant="subtitle2" fontWeight={500}>{category.child}</Typography>
                ))}
              </Box>
              {/* Investment */}
              <Stack direction="column"  spacing={0.5} sx={{ mb: 0.5 }}>
                {/* <MonetizationOnIcon sx={{ color: '#f29724', fontSize: 16 }} /> */}
                <Typography variant="body2" fontWeight={500}>
                 Investment: {brand.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange || 'N/A'}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                Area:  {brand.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired || 'N/A'} sq.ft
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

      {brands.length > visibleBrands && (
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
      )}
      <BrandDetailsDialog />
    </Box>
  );
};

export default TopInvestVdocardround;
import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Favorite,
  Visibility,
  AssignmentTurnedIn,
  Close,
  Business,
  Bookmark 
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from '@mui/material';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import img from "../../assets/images/brandLogo.jpg";
import { api } from "../../Api/api";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice";
import { fetchShortListedById } from "../../Redux/Slices/shortlistslice";
import { fetchLikedBrandsById, removeFromLikedBrands } from "../../Redux/Slices/likeSlice";
// Memoized StatCard component to prevent unnecessary re-renders
const StatCard = memo(({ icon, title, value, color, isSelected, onClick }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 240, md: 260 },
        minHeight: { xs: 40, sm: 72 },
        borderRadius: 2,
        px: { xs: 1, sm: 1.5 },
        py: 0,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        bgcolor: isSelected ? `rgba(${color}, 0.25)` : `rgba(${color}, 0.05)`,
        border: '1px solid',
        borderColor: isSelected ? `rgba(${color}, 0.5)` : `rgba(${color}, 0.1)`,
        transition: 'all 0.2s ease-out',
        boxShadow: isSelected ? `0 4px 16px -2px rgba(${color}, 0.4)` : 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-2px)' },
          boxShadow: isSelected 
            ? `0 4px 16px -2px rgba(${color}, 0.4)`
            : { xs: 'none', sm: `0 4px 12px -2px rgba(${color}, 0.15)` },
          bgcolor: isSelected 
            ? `rgba(${color}, 0.25)`
            : { xs: `rgba(${color}, 0.05)`, sm: `rgba(${color}, 0.08)` },
          '& .stat-icon': {
            transform: { xs: 'none', sm: 'scale(1.05)' }
          }
        },
        '@media (hover: none)': {
          '&:active': {
            bgcolor: `rgba(${color}, 0.1)`
          }
        }
      }}
    >
      <Box
        className="stat-icon"
        sx={{
          flexShrink: 0,
          p: { sm: 1 },
          borderRadius: '50%',
          bgcolor: isSelected ? `rgba(${color}, 0.3)` : `rgba(${color}, 0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease-out',
          boxShadow: `inset 0 0 0 1px rgba(${color}, ${isSelected ? '0.4' : '0.15'})`,
          '& > svg': {
            fontSize: { xs: '13px', sm: '15px', md: '22px' }
          },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            color: isSelected ? `rgba(${color}, 1)` : `rgb(${color})`,
            fontSize: { xs: '16px', sm: '10px', md: '22px' },
            transition: 'color 0.2s ease-out'
          }
        })}
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
          justifyContent: 'end',
          gap: { xs: 0.5, sm: 1 }
        }}
      >
        {isSm && (
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              color: isSelected ? `rgba(${color}, 0.9)` : 'text.secondary',
              lineHeight: 1.3,
              transition: 'all 0.2s ease-out'
            }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: isSelected ? 700 : 600,
            fontSize: { xs: '0.6rem', sm: '1rem', md: '1.125rem' },
            lineHeight: 1.2,
            background: isSelected 
              ? `linear-gradient(75deg, rgba(${color}, 1) 0%, rgba(${color}, 0.8) 100%)`
              : `linear-gradient(75deg, rgb(${color}) 0%, rgba(${color}, 0.9) 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            '@media (hover: hover)': {
              textShadow: isSelected 
                ? `0 0 8px rgba(${color}, 0.4)`
                : `0 0 6px rgba(${color}, 0.2)`
            },
            transition: 'all 0.2s ease-out'
          }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  );
});

// Memoized BrandCard component
const BrandCard = memo(({ item, type, likedStates, onViewDetails, onToggleLike, onToggleViewClose }) => {
  if (!item || typeof item !== 'object') return null;
console.log('Full brand item:', item); 
  const brandId = item.uuid || item.brandID?.uuid || item.brandID;
  const isLiked = brandId ? likedStates[brandId] : false;
  
  // Enhanced brand name extraction
  const brandName = item.brandName || 
                   item.brandDetails?.brandName || 
                   item.brandID?.brandName || 
                   item.name || 
                   "Unnamed Brand";
  
  // Enhanced logo extraction
  const brandLogo = item.logo || 
                   item.brandLogo || 
                   item.brandDetails?.brandLogo || 
                   item.uploads?.brandLogo?.[0] || 
                   item.brandID?.brandLogo || 
                   item.image || 
                   img;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      <Card sx={{
        width: '200px',
        height: '100%',
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        border: '1px solid rgba(0,0,0,0.05)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px rgba(255,107,0,0.15)',
          borderColor: 'rgba(255,107,0,0.2)'
        }
      }}>
        <Box sx={{ 
          position: 'relative',
          height: 140,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            zIndex: 1
          }
        }}>
          <CardMedia
            component="img"
            loading="lazy"
            height="140"
            image={brandLogo}
            alt={brandName}
            sx={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
            zIndex: 2
          }}>
            {type === 'viewed' && (
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  p: 0.5,
                  '&:hover': { 
                    backgroundColor: '#fff',
                    transform: 'scale(1.1)',
                    color: '#ff6d00'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => onToggleViewClose(brandId)}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
            
            {type === 'liked' && (
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  p: 0.5,
                  '&:hover': { 
                    backgroundColor: '#fff',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => onToggleLike(brandId)}
              >
                <Favorite 
                  fontSize="small" 
                  sx={{ 
                    fontSize: '1rem',
                    color: isLiked ? '#ff3d00' : 'rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                  }} 
                />
              </IconButton>
            )}
          </Box>
        </Box>

        <CardContent sx={{ 
          flex: '1 1 auto',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1.5
          }}>
            <Typography variant="caption" color="text.secondary">
              {brandName}
            </Typography>
          </Box>
        </CardContent>

        <Box sx={{ 
          p: 2,
          pt: 0,
          textAlign: 'center'
        }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onViewDetails(item)}
            sx={{
              borderRadius: 2,
              py: 1,
              fontSize: '0.8rem',
              textTransform: 'none',
              fontWeight: 600,
              letterSpacing: 0.5,
              background: 'linear-gradient(135deg, #ff6d00 0%, #ff9100 100%)',
              boxShadow: '0 2px 10px rgba(255,109,0,0.3)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff8500 0%, #ffa000 100%)',
                boxShadow: '0 4px 14px rgba(255,109,0,0.4)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Explore Brand
          </Button>
        </Box>
      </Card>
    </Box>
  );
});

const Dashboard = () => {
 const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [viewedBrands, setViewedBrands] = useState([]);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const [userData, setUserData] = useState(null);
  
  // Redux state selectors
const investorUUID = useSelector((state) => state.auth?.investorUUID);  
const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const shortListState = useSelector(state => state.shortList);
  const likedBrandsState = useSelector(state => state.likedBrands);

  const shortlistedBrands = shortListState.brands || [];
  const likedBrands = likedBrandsState.brands || [];

  // Combined loading and error states
  const isLoading = likedBrandsState.isLoading || shortListState.isLoading;
  const errorMessage = likedBrandsState.error || shortListState.error;

  // Memoized stats calculation
  const stats = useMemo(() => ({
    totalViews: viewedBrands.length,
    totalLikes: likedBrands.length,
    totalApplications: appliedBrands.length,
    totalShortlisted: shortListState.pagination?.totalItems || shortlistedBrands.length,
  }), [viewedBrands, likedBrands, appliedBrands, shortListState, shortlistedBrands]);
  
  // Initialize liked states
  useEffect(() => {
    const initialLiked = {};
    likedBrands.forEach(item => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) {
        initialLiked[brandId] = true;
      }
    });
    setLikedStates(initialLiked);
  }, [likedBrands]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        }
      };

      // Dispatch Redux actions
      dispatch(fetchLikedBrandsById({ userId: investorUUID }));
      dispatch(fetchShortListedById({ investorUUID }));

      // Fetch additional data
      const [viewedRes, appliedRes, userRes] = await Promise.all([
        axios.get(`${api.viewApi.get.getAllViewBrandByID}/${investorUUID}`, config)
          .then(res => res.data?.data || [])
          .catch(() => []),
        axios.get(`${api.instantApplyApi.get.getInstaApplyById}/${investorUUID}`, config)
          .then(res => res.data?.data || [])
          .catch(() => []),
        axios.get(`${api.user.get.investor}/${investorUUID}`, config)
          .then(res => res.data?.data || null)
          .catch(() => null)
      ]);

      setViewedBrands(viewedRes);
      setAppliedBrands(appliedRes);
      setUserData(userRes);

    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  }, [investorUUID, AccessToken, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized toggleLike with useCallback
const toggleLike = useCallback(async (brandId) => {
  if (!brandId) {
    console.error("Missing brand ID:", brandId);
    return;
  }

  // Find the exact brand to ensure correct ID structure
  const brandToRemove = likedBrands.find(brand => 
    brand.uuid === brandId || 
    brand.brandID?.uuid === brandId || 
    brand.brandID === brandId
  );

  if (!brandToRemove) {
    console.error("Brand not found in liked brands:", brandId);
    return;
  }

  // Get the correct ID for API call
  const apiBrandId = brandToRemove.uuid || brandToRemove.brandID?.uuid || brandToRemove.brandID;

  // Optimistic update
  setLikedStates(prev => {
    const newState = {...prev};
    delete newState[brandId];
    return newState;
  });

  try {
    await dispatch(removeFromLikedBrands(apiBrandId)).unwrap();
    
    setRemoveMsg("Brand removed successfully");
    setTimeout(() => setRemoveMsg(""), 3000);
    
    // Refresh liked brands
    dispatch(fetchLikedBrandsById({ userId: investorUUID }));
  } catch (error) {
    console.error("Remove error:", error);
    setRemoveMsg(error.message || "Failed to remove brand");
    // Revert optimistic update
    setLikedStates(prev => ({...prev, [brandId]: true}));
  }
}, [investorUUID, dispatch, likedBrands]);

  // Optimized toggleViewClose with useCallback
  const toggleViewClose = useCallback(async (brandId) => {
    if (!investorUUID || !AccessToken || !brandId) return;

    // Optimistic update
    setViewedBrands(prev => prev.filter(item => item?.uuid !== brandId));

    try {
      await axios.delete(
        `${api.viewApi.delete}/${investorUUID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          data: { brandID: brandId },
        }
      );
    } catch (error) {
      console.error("Error removing viewed brand:", error);
      fetchData(); // Refetch to ensure consistency
    }
  }, [investorUUID, AccessToken, fetchData]);

  // Memoized handleViewDetails
  const handleViewDetails = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);


   const renderTabContent = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (errorMessage) {
      return (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      );
    }

 let brands = [];
    let emptyState = {
      icon: <Business color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
      title: "No data available",
      description: "There are no items to display"
    };

    switch(tabValue) {
      case 0: brands = viewedBrands;
        emptyState = {
          icon: <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No viewed brands",
          description: "Brands you view will appear here"
        };
        break;
      case 1: brands = likedBrands;
        emptyState = {
          icon: <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No liked brands yet",
          description: "Like brands to save them for later"
        };
        break;
      case 2: brands = appliedBrands;
        emptyState = {
          icon: <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No applications yet",
          description: "Your applications will appear here"
        };
        break;
      case 3: brands = shortlistedBrands;
        emptyState = {
          icon: <Bookmark color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No shortlisted brands",
          description: "Brands you shortlist will appear here"
        };
        break;
      default: brands = [];
    }

   return brands.length > 0 ? (
      <Grid container spacing={3}>
       {brands.map((item) => {
  console.log('Brand item:', item); 
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={item?.uuid || Math.random()}>
      <BrandCard 
        item={item} 
        type={['viewed', 'liked', 'applied', 'shortlisted'][tabValue]}
        likedStates={likedStates}
        onViewDetails={handleViewDetails}
        onToggleLike={toggleLike}
        onToggleViewClose={toggleViewClose}
      />
    </Grid>
  );
})}
      </Grid>
    ) : (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        {emptyState.icon}
        <Typography variant="h6">{emptyState.title}</Typography>
        <Typography>{emptyState.description}</Typography>
      </Box>
    );
  }, [isLoading, errorMessage, tabValue, viewedBrands, likedBrands, appliedBrands, shortlistedBrands, likedStates, handleViewDetails, toggleLike, toggleViewClose]);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      p: { xs: 2, md: 4 }
    }}>
      {/* Profile Section */}
      <Box sx={{ 
        mb: 1,
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          gap: 1
        }}>
          <Avatar
            src={userData?.profileImage || img}
            loading="lazy"
            alt="Profile"
            sx={{
              width: 60,
              height: 60,
              mr: { md: 3 },
              border: '3px solid #689f38'
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              {userData?.firstName || 'Investor'} {userData?.lastName || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData?.inveterID || ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
  display: 'flex', 
  gap: 2,  // Reduced gap for tighter spacing
  justifyContent: { xs: 'center', md: 'flex-start' },  // Changed from 'space-between' to 'flex-start'
  mt: 3,
  flexWrap: 'nowrap',  // Prevent wrapping to new line
  overflowX: 'auto',  // Allow horizontal scrolling if needed
  pb: 1,  // Add some padding for scrollbar
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '3px',
  }
}}>
        <StatCard 
          icon={<Business />} 
          title="Viewed" 
          value={stats.totalViews} 
          color="76, 175, 80"
          isSelected={tabValue === 0}
          onClick={() => setTabValue(0)}
        />
       <StatCard 
          icon={<Favorite />} 
          title="Liked" 
          value={stats.totalLikes} 
          color="244, 67, 54"
          isSelected={tabValue === 1}
          onClick={() => setTabValue(1)}
        />
        <StatCard 
          icon={<AssignmentTurnedIn />} 
          title="Applied" 
          value={stats.totalApplications} 
          color="33, 150, 243"
          isSelected={tabValue === 2}
          onClick={() => setTabValue(2)}
        />
        <StatCard 
  icon={<Bookmark />}  
  title="Shortlisted" 
  value={stats.totalShortlisted} 
  color="156, 39, 176"  
  isSelected={tabValue === 3} 
  onClick={() => setTabValue(3)}
/>
      </Box>

      {/* Main Content */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        background: 'white',
        mt: 3
      }}>
        <Box sx={{ p: 3 }}>
          {removeMsg && (
            <Box sx={{ 
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#4caf50',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography>{removeMsg}</Typography>
              <IconButton size="small" onClick={() => setRemoveMsg("")}>
                <Close sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          )}
          
          {renderTabContent}
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;
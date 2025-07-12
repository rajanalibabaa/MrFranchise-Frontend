import React, { useState, useEffect } from "react";
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
  Chip,
  CircularProgress
} from "@mui/material";
import {
  Favorite,
  Visibility,
  AssignmentTurnedIn,
  Close,
  MonetizationOn,
  LocationOn,
  Business
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from '@mui/material';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import img from "../../assets/images/brandLogo.jpg";
import { api } from "../../Api/api";
import { openBrandDialog } from "../../Redux/Slices/brandSlice";

const Dashboard = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [viewedBrands, setViewedBrands] = useState([]);
  const [likedBrands, setLikedBrands] = useState([]);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalApplications: 0
  });

  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  useEffect(() => {
    if (!investorUUID || !AccessToken) {
      setError("Go to home page ...");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          timeout: 10000
        };

        const endpoints = [
          `${api.likeApi.get}/${investorUUID}`,
          `${api.viewApi.get.getAllViewBrandByID}/${investorUUID}`,
          `${api.instantApplyApi.get.getInstaApplyById}/${investorUUID}`,
          `${api.user.get.investor}/${investorUUID}`
        ];

        const [likedRes, viewedRes, appliedRes, userRes] = await Promise.all(
          endpoints.map(endpoint => 
            axios.get(endpoint, config)
              .then(res => res.data?.data || null)
              .catch(err => {
                console.error(`Error fetching ${endpoint}:`, err);
                return null;
              })
          )
        );

        // Process responses with proper null checks
        const likedData = Array.isArray(likedRes) ? likedRes : [];
        const viewedData = Array.isArray(viewedRes) ? viewedRes : [];
        const appliedData = Array.isArray(appliedRes) ? appliedRes : [];
        const userData = userRes && typeof userRes === 'object' ? userRes : null;

        setLikedBrands(likedData);
        setViewedBrands(viewedData);
        setAppliedBrands(appliedData);
        setUserData(userData);

        // Initialize liked states
        const initialLiked = {};
        likedData.forEach(item => {
          if (item?.uuid) {
            initialLiked[item.uuid] = true;
          }
        });
        setLikedStates(initialLiked);

        setStats({
          totalViews: viewedData.length,
          totalLikes: likedData.length,
          totalApplications: appliedData.length
        });

      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("Failed to load data");
        setLikedBrands([]);
        setViewedBrands([]);
        setAppliedBrands([]);
        setUserData(null);
        setStats({
          totalViews: 0,
          totalLikes: 0,
          totalApplications: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investorUUID, AccessToken, dispatch]);

  const toggleLike = async (brandId) => {
    if (!investorUUID || !AccessToken || !brandId) return;

    // Save the current state for potential rollback
    const prevLikedStates = {...likedStates};
    const prevLikedBrands = [...likedBrands];
    const prevStats = {...stats};

    try {
      // Optimistic update
      const newLikedStates = {...likedStates};
      delete newLikedStates[brandId];
      setLikedStates(newLikedStates);
      setLikedBrands(prev => prev.filter(item => item?.uuid !== brandId));
      setStats(prev => ({ ...prev, totalLikes: prev.totalLikes - 1 }));

      await axios.delete(
        `${api.likeApi.delete}/${investorUUID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          data: { brandID: brandId },
        }
      );

      setRemoveMsg("Brand removed successfully");
      setTimeout(() => setRemoveMsg(""), 3000);
    } catch (error) {
      console.error("Remove error:", error);
      setRemoveMsg("Failed to remove brand");
      // Revert optimistic update
      setLikedStates(prevLikedStates);
      setLikedBrands(prevLikedBrands);
      setStats(prevStats);
    }
  };

  const toggleViewClose = async (brandId) => {
    if (!investorUUID || !AccessToken || !brandId) return;

    try {
      setViewedBrands(prev => prev.filter(item => item?.uuid !== brandId));
      setStats(prev => ({ ...prev, totalViews: prev.totalViews - 1 }));

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
    }
  };

  const handleViewDetails = (brand) => {
    console.log("View details for brand:", brand);
    // Implement your dialog opening logic here
    dispatch(openBrandDialog(brand));
  };

  const renderStatCard = (icon, title, value, color) => {
    const isSelected = 
      (icon.type === Business && tabValue === 0) ||
      (icon.type === Favorite && tabValue === 1) ||
      (icon.type === AssignmentTurnedIn && tabValue === 2);

    return (
      <Card
        onClick={() => setTabValue(icon.type === Business ? 0 : icon.type === Favorite ? 1 : 2)}
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
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: isSelected ? '3px' : '0px',
            transition: 'height 0.2s ease-out'
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
  };

const renderBrandCard = (item, type) => {
  if (!item || typeof item !== 'object') return null;
  
  const brandId = item.uuid;
  const isLiked = likedStates[brandId];
  const brandName = item.brandDetails?.brandName || "Unnamed Brand";
  const brandLogo = item.uploads?.brandLogo?.[0] || img;
  const franchiseModels = item.franchiseDetails?.fico || [];
  const investmentRange = item.franchiseDetails?.fico || null;
  
  return (
    <Box sx={{
      display: "flex",
      justifyContent:"center",
      alignContent:"center"
    }}>
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
      {/* Image with orange gradient overlay */}
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
        
        
        {/* Action buttons */}
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
              onClick={() => toggleViewClose(brandId)}
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
              onClick={() => toggleLike(brandId)}
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

      {/* Content area */}
      <CardContent sx={{ 
        flex: '1 1 auto',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}>
        {/* Details section with orange icons */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 1.5
        }}>
          <MonetizationOn sx={{ 
            fontSize: 20,
            color: '#ff6d00' 
          }} />
          <Typography variant="body2" color="text.secondary">
            {investmentRange[0]?.investmentRange || 'N/A'}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2
        }}>
          <LocationOn sx={{ 
            fontSize: 20,
            color: '#ff6d00' 
          }} />
          <Typography variant="body2" color="text.secondary">
            {item.brandDetails?.locations?.join(', ') || 'Multiple locations'}
          </Typography>
        </Box>
        
        {/* Franchise models chips with orange theme */}
        <Box sx={{ 
          mt: 'auto',
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          '& .MuiChip-root': {
            borderRadius: 1,
            height: 24,
            fontSize: '0.65rem',
            borderColor: '#ffb74d',
            color: '#e65100',
            '&:hover': {
              backgroundColor: '#ffe0b2'
            }
          }
        }}>
          {franchiseModels.slice(0, 3).map((model, idx) => (
            <Chip
              key={`${model.franchiseModel}-${idx}`}
              label={model.franchiseModel}
              size="small"
              variant="outlined"
            />
          ))}
          {franchiseModels.length > 3 && (
            <Chip
              label={`+${franchiseModels.length - 3}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      {/* Orange gradient button */}
      <Box sx={{ 
        p: 2,
        pt: 0,
        textAlign: 'center'
      }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleViewDetails(item)}
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
          Explore Opportunity
        </Button>
      </Box>
    </Card>

    </Box>
  );
};

  const renderTabContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 10,
          textAlign: 'center'
        }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Please Login ...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      );
    }

    const brands = tabValue === 0 ? viewedBrands : tabValue === 1 ? likedBrands : appliedBrands;
    const emptyState = {
      icon: tabValue === 0 ? <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} /> : 
            tabValue === 1 ? <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} /> : 
            <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
      title: tabValue === 0 ? "No viewed brands" : 
             tabValue === 1 ? "No liked brands yet" : 
             "No applications yet",
      description: tabValue === 0 ? "Brands you view will appear here" : 
                  tabValue === 1 ? "Like brands to save them for later" : 
                  "Your applications will appear here"
    };

    return brands.length > 0 ? (
      <Grid container spacing={3}>
        {brands.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item?.uuid || Math.random()}>
            {renderBrandCard(item, tabValue === 0 ? 'viewed' : tabValue === 1 ? 'liked' : 'applied')}
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        py: 10,
        textAlign: 'center'
      }}>
        {emptyState.icon}
        <Typography variant="h6" color="text.secondary">
          {emptyState.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {emptyState.description}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
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
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'space-between' }, mt: 3 }}>
        {renderStatCard(<Business />, 'Viewed', stats.totalViews, '76, 175, 80')}
        {renderStatCard(<Favorite />, 'Liked', stats.totalLikes, '244, 67, 54')}
        {renderStatCard(<AssignmentTurnedIn />, 'Applied', stats.totalApplications, '33, 150, 243')}
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
          
          {renderTabContent()}
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;
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
// import { openBrandDialog } from "../../Redux/Slices/brandSlice.jsx";
// import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog.jsx";
import img from "../../assets/images/brandLogo.jpg";

const Dashboard = ({ selectedSection, sectionContent }) => {
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
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalApplications: 0
  });

  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  useEffect(() => {
    if (!investorUUID || !AccessToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const endpoints = [
          `http://localhost:5000/api/v1/like/get-favbrands/${investorUUID}`,
          `http://localhost:5000/api/v1/view/getAllViewBrandByID/${investorUUID}`,
          `http://localhost:5000/api/v1/instantapply/getInstaApplyById/${investorUUID}`,
          `http://localhost:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`
        ];

        const requests = endpoints.map(endpoint => 
          axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            }
          })
        );

        const [likedRes, viewedRes, appliedRes, userRes] = await Promise.all(requests);

        // Process responses
        const likedData = likedRes.data?.data || [];
        const viewedData = viewedRes.data?.data || [];
        const appliedData = appliedRes.data?.data || [];
        
        setLikedBrands(likedData);
        setViewedBrands(viewedData);
        setAppliedBrands(appliedData);
        setUserData(userRes.data?.data || null);

        // Initialize liked states
        const initialLiked = {};
        likedData.forEach(item => {
          initialLiked[item.uuid] = true;
        });
        setLikedStates(initialLiked);

        // Update stats
        setStats({
          totalViews: viewedData.length,
          totalLikes: likedData.length,
          totalApplications: appliedData.length
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investorUUID, AccessToken]);

  const toggleLike = async (brandId) => {
    try {
      // Optimistic update
      const newLikedStates = {...likedStates};
      delete newLikedStates[brandId];
      setLikedStates(newLikedStates);
      setLikedBrands(prev => prev.filter(item => item.uuid !== brandId));
      setStats(prev => ({ ...prev, totalLikes: prev.totalLikes - 1 }));

      await axios.delete(
        `http://localhost:5000/api/v1/like/delete-favbrand/${investorUUID}`,
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
      setLikedStates(prev => ({ ...prev, [brandId]: true }));
    }
  };

  const toggleViewClose = async (brandId) => {
    try {
      setViewedBrands(prev => prev.filter(item => item.uuid !== brandId));
      setStats(prev => ({ ...prev, totalViews: prev.totalViews - 1 }));

      await axios.delete(
        `http://localhost:5000/api/v1/view/deleteViewBrandByID/${investorUUID}`,
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
          // background: `rgb(${color})`,
          transition: 'height 0.2s ease-out'
        }
      }}
    >
      {/* Icon */}
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

      {/* Text Block */}
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
    const brandId = item.uuid;
    const isLiked = likedStates[brandId];
    
    return (
      <Card sx={{
        width: '100%',
        maxWidth: 300,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={item.brandDetails?.brandLogo?.[0] || img}
            alt={item.personalDetails?.brandName || "Brand Image"}
            sx={{ objectFit: 'cover' }}
          />
          
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1
          }}>
            {type === 'viewed' && (
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: '#fff' }
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
                  '&:hover': { backgroundColor: '#fff' }
                }}
                onClick={() => toggleLike(brandId)}
              >
                <Favorite fontSize="small" color={isLiked ? "error" : "disabled"} />
              </IconButton>
            )}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography gutterBottom variant="h6" component="div" fontWeight={600} noWrap>
            {item.personalDetails?.brandName || "Unnamed Brand"}
          </Typography>
          
          {item.franchiseDetails?.modelsOfFranchise?.length > 0 && (
            <Box sx={{ mt: 1, mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {item.franchiseDetails.modelsOfFranchise.map((model, idx) => (
                <Chip
                  key={idx}
                  label={model.franchiseModel}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          )}
          
          {item.franchiseDetails?.investmentRange && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MonetizationOn color="primary" fontSize="small" />
              <Typography variant="body2">
                {item.franchiseDetails.investmentRange}
              </Typography>
            </Box>
          )}
          
          {item.personalDetails?.headOfficeAddress && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <LocationOn color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {item.personalDetails.headOfficeAddress.split(',')[0]}
              </Typography>
            </Box>
          )}
        </CardContent>

        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleViewDetails(item)}
            sx={{
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
            }}
          >
            View Details
          </Button>
        </Box>
      </Card>
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

    const brands = tabValue === 0 ? viewedBrands : tabValue === 1 ? likedBrands : appliedBrands;
    const emptyState = {
      icon: tabValue === 0 ? <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} /> : 
            tabValue === 1 ? <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} /> : 
            <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
      title: tabValue === 0 ? "No viewed brands " : 
             tabValue === 1 ? "No liked brands yet" : 
             "No applications yet",
 
    };

    return brands.length > 0 ? (
      <Grid container spacing={3}>
        {brands.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.uuid}>
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
          // flexDirection: { xs: 'row', md: 'row' },
          alignItems: 'center',
          
          p: 2,
          // background: 'linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%)',
          gap:1
        }}>
          <Avatar
            src={userData?.profileImage || img}
            alt="Profile"
            sx={{
              width: 60,
              height: 60,
              mr: { md: 3 },
              // mb: { xs: 2, md: 0 },
              border: '3px solid #689f38'
            }}
          />
          {/* <Box sx={{ flex: 1, textAlign: { xs: 'left', md: 'left' } }}> */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={600} >
              {userData?.firstName || 'Investor'} {userData?.lastName || ''}
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              {/* {userData?.occupation || 'No email provided'} */}
            </Typography>
           
          </Box>

           
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'space-between' } ,mt:3}}>
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
        mt:1
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

      {/* <BrandDetailsDialog /> */}
    </Box>
  );
};

export default Dashboard;
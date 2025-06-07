import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  Chip,
  Divider,
  LinearProgress,
  Badge,
  CircularProgress
} from "@mui/material";
import {
  Favorite,
  Visibility,
  AssignmentTurnedIn,
  Close,
  Person,
  ExpandMore,
  ExpandLess,
  Star,
  Business,
  MonetizationOn,
  LocationOn
} from "@mui/icons-material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { openBrandDialog } from "../../Redux/Slices/brandSlice.jsx";
import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog.jsx";
import img from "../../assets/images/brandLogo.jpg";

const Dashboard = ({ selectedSection, sectionContent }) => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [investorInfo, setInvestorInfo] = useState(null);
  const [viewedBrands, setViewedBrands] = useState([]);
  const [likedBrands, setLikedBrands] = useState([]);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [showMore, setShowMore] = useState({});
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
        
        // Parallel API calls
        const [likedRes, viewedRes, appliedRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/like/get-favbrands/${investorUUID}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }),
          axios.get(`http://localhost:5000/api/v1/view/getAllViewBrandByID/${investorUUID}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }),
          axios.get(`http://localhost:5000/api/v1/instantapply/getInstaApplyById/${investorUUID}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }),
          axios.get(`http://localhost:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          })
        ]);

        // Process responses
        setLikedBrands(likedRes.data?.data || []);
        setViewedBrands(viewedRes.data?.data || []);
        setAppliedBrands(appliedRes.data?.data || []);
        setUserData(userRes.data?.data || null);

        // Initialize liked states
        const initialLiked = {};
        likedRes.data?.data?.forEach(item => {
          initialLiked[item.uuid] = true;
        });
        setLikedStates(initialLiked);

        // Update stats
        setStats({
          totalViews: viewedRes.data?.data?.length || 0,
          totalLikes: likedRes.data?.data?.length || 0,
          totalApplications: appliedRes.data?.data?.length || 0
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investorUUID, AccessToken]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleLike = async (brandId) => {
    try {
      // Optimistic update
      setLikedStates(prev => ({ ...prev, [brandId]: !prev[brandId] }));
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

  const renderStatCard = (icon, title, value, color) => (
    <Card sx={{ 
      minWidth: 120, 
      borderRadius: 3,
      boxShadow: `0 4px 20px -5px rgba(${color},0.2)`,
      background: `linear-gradient(135deg, rgba(${color},0.1) 0%, rgba(${color},0.05) 100%)`
    }}>
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Box sx={{ 
          display: 'inline-flex',
          p: 1.5,
          borderRadius: '50%',
          bgcolor: `rgba(${color},0.1)`,
          mb: 1
        }}>
          {React.cloneElement(icon, { 
            fontSize: "medium",
            sx: { color: `rgb(${color})` }
          })}
        </Box>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderBrandCard = (item, type) => {
    const brandId = item.uuid;
    const isLiked = likedStates[brandId];
    const shouldShowMore = showMore[brandId];
    const brandDesc = item.personalDetails?.brandDescription || "";
    
    return (
      <Card sx={{
        maxWidth: 200,
        maxHeight: 400,
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
        {/* Card Header with Image */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="150"
            image={item.brandDetails?.brandLogo?.[0] || img}
            alt={item.personalDetails?.brandName || "Brand Image"}
            sx={{ objectFit: 'cover' }}
          />
          
          {/* Action Buttons */}
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

        {/* Card Content */}
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography variant="h6" fontWeight={600} noWrap>
            {item.personalDetails?.brandName || "Unnamed Brand"}
          </Typography>
          
          {/* Franchise Models */}
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
          
          {/* Investment Info */}
          {item.franchiseDetails?.investmentRange && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MonetizationOn color="primary" fontSize="small" />
              <Typography variant="body2">
                {item.franchiseDetails.investmentRange}
              </Typography>
            </Box>
          )}
          
          {/* Location */}
          {item.personalDetails?.headOfficeAddress && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <LocationOn color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {item.personalDetails.headOfficeAddress.split(',')[0]}
              </Typography>
            </Box>
          )}
          
          {/* Description with expand/collapse */}
          {/* {brandDesc && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{
                display: '-webkit-box',
                WebkitLineClamp: shouldShowMore ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1
              }}>
                {brandDesc}
              </Typography>
              <Button
                size="small"
                onClick={() => setShowMore(prev => ({ ...prev, [brandId]: !prev[brandId] }))}
                endIcon={shouldShowMore ? <ExpandLess /> : <ExpandMore />}
                sx={{ p: 0, minWidth: 0 }}
              >
                {shouldShowMore ? 'Show Less' : 'Show More'}
              </Button>
            </>
          )} */}
        </CardContent>

        {/* View Details Button */}
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

    switch (tabValue) {
      case 0: // Viewed Brands
        return viewedBrands.length > 0 ? (
          <Grid container spacing={3}>
            {viewedBrands.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.uuid}>
                {renderBrandCard(item, 'viewed')}
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
            <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No viewed brands yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Brands you view will appear here
            </Typography>
          </Box>
        );

      case 1: // Liked Brands
        return likedBrands.length > 0 ? (
          <Grid container spacing={3}>
            {likedBrands.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.uuid}>
                {renderBrandCard(item, 'liked')}
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
            <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No liked brands yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Brands you like will appear here
            </Typography>
          </Box>
        );

      case 2: // Applied Brands
        return appliedBrands.length > 0 ? (
          <Grid container spacing={3}>
            {appliedBrands.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.uuid}>
                {renderBrandCard(item, 'applied')}
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
            <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No applications yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Brands you apply to will appear here
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      p: { xs: 2, md: 4 }
      
    }}>

      {/* Profile Section */}
      <Card sx={{ 
        mb: 1,
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          p: 1,
          background: 'linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%)'
        }}>
          <Avatar
            src={userData?.Avatar || img}
            alt="Profile"
            sx={{
              width: 120,
              height: 120,
              mr: { md: 3 },
              mb: { xs: 2, md: 0 },
              border: '3px solid #689f38'
            }}
          />
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
              {userData?.firstName || 'Investor'} {userData?.lastName || ''}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userData?.email || 'No email provided'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'space-evenly' } }}>
              {renderStatCard(<Business />, 'Viewed', stats.totalViews, '76, 175, 80')}
              {renderStatCard(<Favorite />, 'Liked', stats.totalLikes, '244, 67, 54')}
              {renderStatCard(<AssignmentTurnedIn />, 'Applied', stats.totalApplications, '33, 150, 243')}
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Main Content */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden'
      }}>
        {/* Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          background: '#f9f9f9'
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 4,
                backgroundColor: '#689f38'
              }
            }}
          >
            <Tab 
              label={
                <Badge badgeContent={stats.totalViews} color="primary" sx={{ mr: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Visibility sx={{ mr: 1 }} />
                    <Typography>Viewed</Typography>
                  </Box>
                </Badge>
              }
              sx={{ py: 2, textTransform: 'none' }}
            />
            <Tab 
              label={
                <Badge badgeContent={stats.totalLikes} color="error" sx={{ mr: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Favorite sx={{ mr: 1 }} />
                    <Typography>Interested</Typography>
                  </Box>
                </Badge>
              }
              sx={{ py: 2, textTransform: 'none' }}
            />
            <Tab 
              label={
                <Badge badgeContent={stats.totalApplications} color="info" sx={{ mr: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentTurnedIn sx={{ mr: 1 }} />
                    <Typography>Applied</Typography>
                  </Box>
                </Badge>
              }
              sx={{ py: 2, textTransform: 'none' }}
            />
          </Tabs>
        </Box>

        {/* Content */}
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

      <BrandDetailsDialog />
    </Box>
  );
};

export default Dashboard;
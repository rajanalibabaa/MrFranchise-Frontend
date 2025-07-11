// Same imports...
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  CardMedia,
  CardActions,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import img from '../../assets/images/brandLogo.jpg';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const FallbackImage = "https://via.placeholder.com/300x160?text=No+Image";

const BrandDashBoard = ({ selectedSection, sectionContent }) => {
  const [tabValue, setTabValue] = useState(0);
  const [viewTab, setViewTab] = useState(0);
  const [brandData, setBrandData] = useState({});
  const [viewsData, setViewsData] = useState([]);
  const [likedData, setLikedData] = useState([]);
  const [applyData, setApplyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const brandUUID = useSelector((state) => state.auth.brandUUID);
  const token = useSelector((state) => state.auth.AccessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandRes, viewsRes, likedRes, applyRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` }, withCredentials: true
          }),
          axios.get(`http://localhost:5000/api/v1/view/getAllViewBrands/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` }, withCredentials: true
          }),
          axios.get(`http://localhost:5000/api/v1/like/getBrandLikedByAll/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` }, withCredentials: true
          }),
          axios.get(`http://localhost:5000/api/v1/instantapply/getAllInstaApply/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` }, withCredentials: true
          }),
        ]);

        if (brandRes.data.success) setBrandData(brandRes.data.data);
        if (viewsRes.data.success) setViewsData(viewsRes.data.data);
        if (likedRes.data.success) setLikedData(likedRes.data.data);
        if (applyRes.data.success) setApplyData(applyRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (brandUUID && token) fetchData();
  }, [brandUUID, token]);
  console.log('Brand Data:', applyData);

  const updatedbrandsviews = viewsData?.updatedbrandsviews?.length || 0;
  const updatedinvestorsviews = viewsData?.updatedinvestorsviews?.length || 0;
  const totalViews = updatedbrandsviews + updatedinvestorsviews;

  const handleTabChange = (_, newValue) => setTabValue(newValue);

const renderUserCard = (view, name, imageSrc, type = 'user') => (
  <Grid
    item
    xs={12}
    sm={6}
    md={4}
    lg={3}
    key={view._id || name}
    sx={{ mb: 2 }} // Adds vertical gap between rows
  >
    <Card
      elevation={3}
      sx={{
        width: '100%',
        textAlign: 'center',
        py: 2,
        px: 1,
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(6px)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardMedia
        component="img"
        image={imageSrc || img || FallbackImage}
        alt={name || 'Image'}
        sx={{
          height: 64,
          width: 64,
          objectFit: 'cover',
          borderRadius: '50%',
          mx: 'auto',
          mt: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #e0e0e0',
        }}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ width: '100px', mx: 'auto' }}
        >
          {name || 'Unnamed'}
        </Typography>
        <Button
          variant="contained"
          size="small"
          fullWidth
          sx={{
            mt: 1,
            fontSize: '0.65rem',
            textTransform: 'none',
            borderRadius: 2,
            py: 0.5,
          }}
          onClick={() => console.log(`${type} Details`, view)}
        >
          View
        </Button>
      </CardContent>
    </Card>
  </Grid>
);


const renderTabContent = () => {
  switch (tabValue) {
    case 0:
      return <Typography mt={1} variant="body2">You have X Enquiries</Typography>;

    case 1:
      return (
        <Box mt={2}>
          <Tabs value={viewTab} onChange={(_, val) => setViewTab(val)} centered>
            <Tab label={`Brand Views (${updatedbrandsviews})`} />
            <Tab label={`Investor Views (${updatedinvestorsviews})`} />
          </Tabs>
          <Grid container spacing={3} mt={1}>
            {(viewTab === 0 ? viewsData.updatedbrandsviews : viewsData.updatedinvestorsviews || []).map(view =>
              renderUserCard(
                view,
                view?.personalDetails?.brandName || view?.firstName,
                view?.brandDetails?.brandLogo?.[0] || view?.avatar?.[0],
                viewTab === 0 ? 'Brand View' : 'Investor View'
              )
            )}
          </Grid>
        </Box>
      );

    case 2:
      return (
        <Box mt={2}>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Total Likes: {likedData.length}
          </Typography>
          <Grid container spacing={3}>
            {likedData.map((like) =>
              renderUserCard(
                like,
                like?.personalDetails?.fullName || like?.firstName,
                like?.avatar?.[0] || like?.brandDetails?.brandLogo?.[0],
                'Like'
              )
            )}
          </Grid>
        </Box>
      );

    case 3:
      return (
        <Box mt={4}>
          <Grid container spacing={3}>
            {applyData.map((apply, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {apply.fullName}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      <strong>Investment Range:</strong> {apply.investmentRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      <strong>Location:</strong> {apply.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Applied By:</strong> {apply.apply.applyBy}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Button size="small" variant="outlined" color="primary">
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );

    default:
      return null;
  }
};

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={40} /></Box>;
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        mb={1}
        sx={{ textAlign: 'center', color: '#fff', bgcolor: '#689f38', py: 1, borderRadius: '4px' }}
      >
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '80vh' }}>
        <Box sx={{ flex: 1, p: 2 }}>
          {!selectedSection ? (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 115,
                    height: 105,
                    mx: 'auto',
                    bgcolor: 'transparent',
                  }}
                >
                  <img
                    src={brandData?.brandDetails?.brandLogo?.[0] || img}
                    alt="Brand Logo"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Brand
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#2e7d32' }}>
                    Welcome, {brandData?.personalDetails?.fullName || 'Brand Owner'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
               <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                  mb: 4,
                  '.MuiTab-root': {
                    minWidth: 130,
                    px: 2,
                    py: 2,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: '#f9f9f9',
                    },
                  },
                }}
              >
                {[0, 1, 2, 3].map((index) => {
                  const labels = ['Your Enquiries', 'Total Views', 'Total Likes', 'Brand Enquiries'];
                  const icons = [<PersonIcon />, <VisibilityIcon />, <ThumbUpIcon />, <MailOutlineIcon />];
                  const counts = [23, totalViews, likedData.length, applyData.length];
                  const colors = ['#1976d2', '#ef6c00', '#d81b60', '#388e3c'];

                  const isSelected = tabValue === index;

                  return (
                    <Tab
                      key={index}
                      disableRipple
                      label={
                        <Box
                          sx={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${colors[index]}aa, ${colors[index]})`
                              : 'rgba(255,255,255,0.9)',
                            color: isSelected ? '#fff' : '#333',
                            borderRadius: 3,
                            px: 2,
                            py: 2,
                            textAlign: 'center',
                            boxShadow: isSelected
                              ? `0px 4px 12px ${colors[index]}55`
                              : '0px 2px 6px rgba(0,0,0,0.05)',
                            backdropFilter: 'blur(6px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.75,
                            transition: 'all 0.3s ease-in-out',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            
                          }}
                        >
                          {React.cloneElement(icons[index], {
                            fontSize: 'medium',
                            sx: {
                              color: isSelected ? '#fff' : colors[index],
                              transition: 'color 0.3s ease-in-out',
                            },
                          })}
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.8rem',
                            }}
                          >
                            {labels[index]}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                            }}
                          >
                            {counts[index]}
                          </Typography>
                        </Box>
                      }
                    />
                  );
                })}
              </Tabs>

                <Box mt={2}>{renderTabContent()}</Box>
              </Box>
            </>
          ) : (
            sectionContent[selectedSection]
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BrandDashBoard;

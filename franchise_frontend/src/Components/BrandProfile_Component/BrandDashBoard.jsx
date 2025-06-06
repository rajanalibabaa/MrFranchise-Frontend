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
  CardMedia
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import img from '../../assets/images/brandLogo.jpg';

const BrandDashBoard = ({ selectedSection, sectionContent }) => {
  const [tabValue, setTabValue] = useState(0);
  const [viewTab, setViewTab] = useState(0); // NEW: sub-tab for views
  const [brandData, setBrandData] = useState({});
  const [viewsData, setViewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const brandUUID = useSelector((state) => state.auth.brandUUID);
  const token = useSelector((state) => state.auth.AccessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [brandRes, viewsRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandUUID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          ),
          axios.get(
            `http://localhost:5000/api/v1/view/getAllViewBrands/${brandUUID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          )
        ]);

        if (brandRes.data.success) {
          setBrandData(brandRes.data.data);
        }

        if (viewsRes.data.success) {
            console.log(viewsRes.data.data)
          setViewsData(viewsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (brandUUID && token) {
      fetchData();
    }
  }, [brandUUID, token]);

  const updatedbrandsviews = (viewsData?.updatedbrandsviews?.length || 0)
  const updatedinvestorsviews = (viewsData?.updatedinvestorsviews?.length || 0)

  const totalViews =updatedinvestorsviews  +updatedbrandsviews ;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <Typography mt={2}>You have X Enquiries (placeholder)</Typography>;

      case 1:
        return (
        <Box mt={4}>
        <Tabs value={viewTab} onChange={(e, newVal) => setViewTab(newVal)} centered>
            <Tab label=
                {
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Brand Views
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ({updatedbrandsviews})
                        </Typography>
                      </Box>
                }
            />
            <Tab label=
                {
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Investor Views
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ({updatedinvestorsviews})
                        </Typography>
                      </Box>
                }
            />
        </Tabs>

        <Grid container spacing={3} mt={2}>
            {viewTab === 0 ? (
            viewsData?.updatedbrandsviews?.length > 0 ? (
                viewsData.updatedbrandsviews.map((view, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card elevation={3}>
                    <CardContent>
                     <CardMedia
                        component="img"
                        height="160"
                        image={
                        view.brandDetails?.brandLogo?.[0] ||
                        "https://via.placeholder.com/300x160?text=No+Image"
                        }
                        alt={view.personalDetails?.brandName || "Brand Image"}
                    />   
                        <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        title={view.personalDetails?.brandName || "Unnamed Brand"}
                        >
                        {view.personalDetails?.brandName || "Unnamed Brand"}
                        </Typography>                   
                        
                        <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => console.log('Brand View Details', view)}
                        >
                        View Details
                        </Button>
                    </CardContent>
                    </Card>
                </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                <Typography align="center" color="text.secondary">
                    No Brand Views Available
                </Typography>
                </Grid>
            )
            ) : viewsData?.updatedinvestorsviews?.length > 0 ? (
            viewsData.updatedinvestorsviews.map((view, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3}>
                    <CardContent>
                     <CardMedia
                        component="img"
                        width="150"
                        height="160"
                        image={
                        view?.avatar?.[0] ||img
                        }
                        alt={view?.avatar?.[0] || "Brand Image"}
                    /> 
                        <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        title={view.firstName || "Unnamed Brand"}
                        >
                        {view?.firstName || "Unnamed Brand"}
                        </Typography>                   
                   
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => console.log('Investor View Details', view)}
                    >
                        View Details
                    </Button>
                    </CardContent>
                </Card>
                </Grid>
            ))
            ) : (
            <Grid item xs={12}>
                <Typography align="center" color="text.secondary">
                No Investor Views Available
                </Typography>
            </Grid>
            )}
        </Grid>
        </Box>


        );

      case 2:
        return <Typography mt={2}>Total Likes: X (placeholder)</Typography>;

      case 3:
        return <Typography mt={2}>Brand Enquiries: X (placeholder)</Typography>;

      default:
        return <Typography mt={2}>No data available.</Typography>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{
          textAlign: 'center',
          color: '#fff',
          backgroundColor: '#689f38',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', minHeight: '85vh', bgcolor: '#f4f6f8' }}>
        <Box sx={{ flex: 1, p: 3 }}>
          {!selectedSection ? (
            <>
              {/* Header */}
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Avatar
                    sx={{
                      width: 230,
                      height: 210,
                      mx: 'auto',
                      mb: 2,
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
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mt: 6 }}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                      sx={{ letterSpacing: 1 }}
                    >
                      Brand
                    </Typography>
                    <Typography variant="h4" fontWeight={600} sx={{ color: '#2e7d32' }}>
                      Welcome Back, {brandData?.personalDetails?.fullName || 'Brand Owner'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Main Tabs */}
              <Box sx={{ mt: 6 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                  <Tab label="Your Enquiries" />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Total Views
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ({totalViews})
                        </Typography>
                      </Box>
                    }
                  />
                  <Tab label="Total Likes" />
                  <Tab label="Brand Enquiries" />
                </Tabs>

                <Box>{renderTabContent()}</Box>
              </Box>
            </>
          ) : (
            sectionContent[selectedSection]
          )}
        </Box>
      </Box>
    </div>
  );
};

export default BrandDashBoard;

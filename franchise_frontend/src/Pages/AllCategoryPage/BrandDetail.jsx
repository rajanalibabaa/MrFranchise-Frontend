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
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  MailOutline as MailOutlineIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

const API_BASE_URL = 'https://mrfranchisebackend.mrfranchise.in/api/v1';

const BrandDashBoard = ({ selectedSection, sectionContent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [viewType, setViewType] = useState('brands'); // 'brands' or 'investors'
  const [brandData, setBrandData] = useState({});
  const [viewsData, setViewsData] = useState({ brands: [], investors: [] });
  const [likedData, setLikedData] = useState([]);
  const [applyData, setApplyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [investmentFilter, setInvestmentFilter] = useState('all');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  // Detail view state
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const brandUUID = useSelector((state) => state.auth.brandUUID);
  const token = useSelector((state) => state.auth.AccessToken);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!brandUUID || !token) return;

      try {
        setLoading(true);

        const endpoints = [
          axios.get(`${API_BASE_URL}/brandlisting/getBrandListingByUUID/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }),
          axios.get(`${API_BASE_URL}/view/getAllViewBrands/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }),
          axios.get(`${API_BASE_URL}/like/getBrandLikedByAll/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }),
          axios.get(`${API_BASE_URL}/instantapply/getAllInstaApply/${brandUUID}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }),
        ];

        const responses = await Promise.all(
          endpoints.map(p => p.catch(error => ({ error })))
        );

        const [brandRes, viewsRes, likedRes, applyRes] = responses;

        if (brandRes.error) throw brandRes.error;
        setBrandData(brandRes.data?.success ? brandRes.data.data : {});

        if (viewsRes.error) throw viewsRes.error;
        setViewsData(viewsRes.data?.success ? viewsRes.data.data : { brands: [], investors: [] });

        if (likedRes.error) throw likedRes.error;
        setLikedData(likedRes.data?.success ? likedRes.data.data : []);

        if (applyRes.error) throw applyRes.error;
        setApplyData(applyRes.data?.success ? applyRes.data.data : []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandUUID, token]);

  // View counts
  const brandViewsCount = viewsData?.brands?.length || 0;
  const investorViewsCount = viewsData?.investors?.length || 0;
  const totalViews = brandViewsCount + investorViewsCount;

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setSearchTerm('');
    setInvestmentFilter('all');
  };

  // Handle view type toggle
  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  // Filter applications for Enquiries tab
  const filteredApplyData = applyData.filter(apply => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (apply.fullName?.toLowerCase().includes(searchLower)) ||
      (apply.mobileNumber?.includes(searchTerm)) ||
      (apply.district?.toLowerCase().includes(searchLower)) ||
      (apply.state?.toLowerCase().includes(searchLower));
    
    const matchesInvestment = investmentFilter === 'all' || 
      apply.investmentRange === investmentFilter;
    
    return matchesSearch && matchesInvestment;
  });

  // Filter views data based on search term
  const filteredViewsData = viewType === 'brands' 
    ? viewsData.brands.filter(view => {
        const searchLower = searchTerm.toLowerCase();
        return !searchTerm || 
          (view.brandDetails?.fullName?.toLowerCase().includes(searchLower)) ||
          (view.brandDetails?.businessType?.toLowerCase().includes(searchLower)) ||
          (view.brandDetails?.state?.toLowerCase().includes(searchLower));
      })
    : viewsData.investors.filter(view => {
        const searchLower = searchTerm.toLowerCase();
        return !searchTerm || 
          (view.fullName?.toLowerCase().includes(searchLower)) ||
          (view.businessType?.toLowerCase().includes(searchLower)) ||
          (view.state?.toLowerCase().includes(searchLower));
      });

  // Render user card component
  const renderUserCard = (item, name, imageSrc, type = 'user') => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={item?.uuid}>
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardMedia
          component="img"
          image={imageSrc || '/default-avatar.png'}
          alt={name}
          sx={{
            height: isMobile ? 140 : 180,
            objectFit: 'cover'
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant={isMobile ? 'body1' : 'h6'} component="div" noWrap>
            {name || 'Unnamed'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type === 'Brand View' ? 'Brand' : type === 'Investor View' ? 'Investor' : 'User'}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <Button 
            size="small" 
            variant="contained" 
            fullWidth
            onClick={() => handleViewDetails(item)}
            sx={{ borderRadius: 1 }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  // Render tab content based on selected tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '300px'
        }}>
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '200px',
          flexDirection: 'column',
          textAlign: 'center'
        }}>
          <Typography color="error" variant="h6" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography color="text.secondary">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      );
    }

    switch (tabValue) {
      case 0: // Enquiries tab
        return (
          <Box mt={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: 2, 
              mb: 3,
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size={isMobile ? 'small' : 'medium'}
              />
              
              {isMobile ? (
                <>
                  <IconButton 
                    onClick={() => setFilterDialogOpen(true)}
                    sx={{ alignSelf: 'flex-end' }}
                  >
                    <FilterIcon />
                  </IconButton>
                  <Dialog 
                    open={filterDialogOpen} 
                    onClose={() => setFilterDialogOpen(false)}
                    fullWidth
                    maxWidth="xs"
                  >
                    <DialogTitle>Filter Applications</DialogTitle>
                    <IconButton
                      aria-label="close"
                      onClick={() => setFilterDialogOpen(false)}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent>
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Investment Range</InputLabel>
                        <Select
                          label="Investment Range"
                          value={investmentFilter}
                          onChange={(e) => setInvestmentFilter(e.target.value)}
                        >
                          <MenuItem value="all">All Ranges</MenuItem>
                          <MenuItem value="1L-5L">1L - 5L</MenuItem>
                          <MenuItem value="5L-10L">5L - 10L</MenuItem>
                          <MenuItem value="10L-25L">10L - 25L</MenuItem>
                          <MenuItem value="25L-50L">25L - 50L</MenuItem>
                          <MenuItem value="50L+">50L+</MenuItem>
                        </Select>
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      <Button 
                        onClick={() => {
                          setInvestmentFilter('all');
                          setFilterDialogOpen(false);
                        }}
                      >
                        Reset
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={() => setFilterDialogOpen(false)}
                      >
                        Apply
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <FormControl sx={{ minWidth: 200 }} size={isMobile ? 'small' : 'medium'}>
                  <InputLabel>Investment Range</InputLabel>
                  <Select
                    label="Investment Range"
                    value={investmentFilter}
                    onChange={(e) => setInvestmentFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Ranges</MenuItem>
                    <MenuItem value="1L-5L">1L - 5L</MenuItem>
                    <MenuItem value="5L-10L">5L - 10L</MenuItem>
                    <MenuItem value="10L-25L">10L - 25L</MenuItem>
                    <MenuItem value="25L-50L">25L - 50L</MenuItem>
                    <MenuItem value="50L+">50L+</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            {filteredApplyData.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Full Name</strong></TableCell>
                      {!isMobile && <TableCell><strong>Mobile</strong></TableCell>}
                      <TableCell><strong>Location</strong></TableCell>
                      {!isTablet && <TableCell><strong>Investment</strong></TableCell>}
                      <TableCell align="right"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplyData.map((apply, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{apply.fullName || 'Unknown'}</TableCell>
                        {!isMobile && <TableCell>{apply.mobileNumber || 'N/A'}</TableCell>}
                        <TableCell>{apply?.district || apply?.state || 'N/A'}</TableCell>
                        {!isTablet && <TableCell>{apply.investmentRange || 'N/A'}</TableCell>}
                        <TableCell align="right">
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleViewDetails(apply)}
                            sx={{ minWidth: isMobile ? 80 : 120 }}
                          >
                            {isMobile ? 'View' : 'Details'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No applications found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || investmentFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No applications have been submitted yet'}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 1: // Views tab
        return (
          <Box mt={4}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <Box sx={{ width: isMobile ? '100%' : '60%' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={`Search ${viewType === 'brands' ? 'brands' : 'investors'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
              
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={handleViewTypeChange}
                aria-label="view type"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="brands" aria-label="brand views">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body1">Brands</Typography>
                    <Box sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      ml: 0.5
                    }}>
                      {brandViewsCount}
                    </Box>
                  </Box>
                </ToggleButton>
                <ToggleButton value="investors" aria-label="investor views">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceIcon fontSize="small" />
                    <Typography variant="body1">Investors</Typography>
                    <Box sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      ml: 0.5
                    }}>
                      {investorViewsCount}
                    </Box>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {filteredViewsData.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Profile</strong></TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      {!isMobile && <TableCell><strong>Type</strong></TableCell>}
                      {!isTablet && <TableCell><strong>Location</strong></TableCell>}
                      <TableCell><strong>Viewed On</strong></TableCell>
                      <TableCell align="right"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredViewsData.map((view, index) => {
                      const viewDate = new Date(view.createdAt).toLocaleDateString();
                      const name = viewType === 'brands' 
                        ? view.brandDetails?.fullName || 'Unknown Brand'
                        : view.fullName || 'Unknown Investor';
                      const location = viewType === 'brands'
                        ? view.brandDetails?.state || 'N/A'
                        : view.state || 'N/A';
                      const type = viewType === 'brands'
                        ? view.brandDetails?.businessType || 'N/A'
                        : view.businessType || 'N/A';
                      const imageSrc = viewType === 'brands'
                        ? view.brandDetails?.uploads?.brandLogo?.[0] || '/default-brand.png'
                        : view.profileImage || '/default-avatar.png';

                      return (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Avatar 
                              src={imageSrc} 
                              sx={{ width: 40, height: 40 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography noWrap>
                              {name}
                            </Typography>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Typography noWrap>
                                {type}
                              </Typography>
                            </TableCell>
                          )}
                          {!isTablet && (
                            <TableCell>
                              <Typography noWrap>
                                {location}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell>
                            <Typography noWrap>
                              {viewDate}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleViewDetails(view)}
                              sx={{ minWidth: isMobile ? 80 : 120 }}
                            >
                              {isMobile ? 'View' : 'Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No views found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm 
                    ? 'Try adjusting your search' 
                    : `No ${viewType} have viewed your profile yet`}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2: // Likes tab
        return (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Total Likes: {likedData.length}
            </Typography>
            <Grid container spacing={2}>
              {likedData.length > 0 ? (
                likedData.map((like) =>
                  renderUserCard(
                    like,
                    like?.brandDetails?.fullName || like?.firstName || 'Unknown',
                    like?.profileImage || like?.uploads?.brandLogo?.[0],
                    'Like'
                  )
                )
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '200px',
                    flexDirection: 'column',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No likes yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your brand hasn't received any likes yet
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 3: // Leads tab
        return (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Total Leads: {applyData.length}
            </Typography>
            <Grid container spacing={2}>
              {applyData.length > 0 ? (
                applyData.map((apply, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {apply.fullName || 'Unknown'}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Investment:</strong> {apply.investmentRange || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Location:</strong> {apply?.district || apply?.state || 'N/A'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Applied By:</strong> {apply.apply?.applyBy || 'Unknown'}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          variant="contained" 
                          fullWidth
                          onClick={() => handleViewDetails(apply)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '200px',
                    flexDirection: 'column',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No leads found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No one has applied to your brand yet
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  // Detail dialog component
  const renderDetailDialog = () => (
    <Dialog
      open={detailDialogOpen}
      onClose={() => setDetailDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {tabValue === 0 ? 'Application Details' : 
         tabValue === 1 ? 'View Details' : 
         tabValue === 2 ? 'Like Details' : 'Lead Details'}
        <IconButton
          aria-label="close"
          onClick={() => setDetailDialogOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {selectedItem && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={
                  selectedItem?.profileImage || 
                  selectedItem?.uploads?.brandLogo?.[0] || 
                  '/default-avatar.png'
                }
                sx={{ width: 60, height: 60 }}
              />
              <Typography variant="h6">
                {selectedItem.fullName || 
                 selectedItem.brandDetails?.brandName || 
                 selectedItem.firstName || 
                 'Unknown'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              {tabValue === 0 && ( // Enquiry details
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact Information</Typography>
                    <Typography>Mobile: {selectedItem.mobileNumber || 'N/A'}</Typography>
                    <Typography>Email: {selectedItem.email || 'N/A'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography>
                      {[
                        selectedItem.district,
                        selectedItem.state,
                        selectedItem.country
                      ].filter(Boolean).join(', ') || 'N/A'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Investment Details</Typography>
                    <Typography>Range: {selectedItem.investmentRange || 'N/A'}</Typography>
                    <Typography>Plan: {selectedItem.planToInvest || 'N/A'}</Typography>
                    <Typography>Type: {selectedItem.readyToInvest || 'N/A'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Application Info</Typography>
                    <Typography>Applied By: {selectedItem.apply?.applyBy || 'Unknown'}</Typography>
                    <Typography>
                      Applied On: {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {tabValue === 1 && ( // View details
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">View Information</Typography>
                    <Typography>
                      Viewed On: {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Type: {viewType === 'brands' ? 'Brand' : 'Investor'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact</Typography>
                    {selectedItem.email && (
                      <Typography>Email: {selectedItem.email}</Typography>
                    )}
                    {selectedItem.mobileNumber && (
                      <Typography>Mobile: {selectedItem.mobileNumber}</Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">About</Typography>
                    <Typography>
                      {selectedItem.brandDetails?.description || 
                       selectedItem.about || 
                       'No description available'}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {tabValue === 2 && ( // Like details
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Like Information</Typography>
                    <Typography>
                      Liked On: {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Type: {selectedItem.brandDetails ? 'Brand' : 'Investor'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact</Typography>
                    {selectedItem.email && (
                      <Typography>Email: {selectedItem.email}</Typography>
                    )}
                    {selectedItem.mobileNumber && (
                      <Typography>Mobile: {selectedItem.mobileNumber}</Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">About</Typography>
                    <Typography>
                      {selectedItem.brandDetails?.description || 
                       selectedItem.about || 
                       'No description available'}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {tabValue === 3 && ( // Lead details
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact Information</Typography>
                    <Typography>Mobile: {selectedItem.mobileNumber || 'N/A'}</Typography>
                    <Typography>Email: {selectedItem.email || 'N/A'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography>
                      {[
                        selectedItem.district,
                        selectedItem.state,
                        selectedItem.country
                      ].filter(Boolean).join(', ') || 'N/A'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Investment Details</Typography>
                    <Typography>Range: {selectedItem.investmentRange || 'N/A'}</Typography>
                    <Typography>Plan: {selectedItem.planToInvest || 'N/A'}</Typography>
                    <Typography>Type: {selectedItem.readyToInvest || 'N/A'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Application Info</Typography>
                    <Typography>Applied By: {selectedItem.apply?.applyBy || 'Unknown'}</Typography>
                    <Typography>
                      Applied On: {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {selectedItem.message && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Message</Typography>
                  <Typography sx={{ fontStyle: 'italic' }}>
                    {selectedItem.message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        {selectedItem?.email && (
          <Button 
            variant="contained" 
            startIcon={<MailOutlineIcon />}
            onClick={() => window.location.href = `mailto:${selectedItem.email}`}
          >
            Contact
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      pb: 4
    }}>
    

      {/* Main Content */}
      <Box sx={{ 
        px: isMobile ? 1 : 3,
        maxWidth: 1400,
        mx: 'auto',
         p: 3
      }}>
        {!selectedSection ? (
          <>
            {/* Brand Profile */}
            <Card sx={{ 
              mb: 3, 
              p: 3,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: 3
            }}>
              <Avatar
                src={brandData?.uploads?.brandLogo?.[0] || '/default-brand.png'}
                sx={{ 
                  width: isMobile ? 80 : 120, 
                  height: isMobile ? 80 : 120,
                  border: `3px solid ${theme.palette.primary.main}`
                }}
              />
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {brandData?.brandDetails?.fullName || 'Your Brand'}
                </Typography>
              </Box>
            </Card>

            {/* Dashboard Tabs */}
            <Card sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                    height: 3
                  }
                }}
              >
                {['Enquiries', 'Views', 'Likes', 'Leads'].map((label, index) => (
                  <Tab 
                    key={index}
                    label={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        px: 1,
                        py: 0.5
                      }}>
                        {index === 0 && <PersonIcon fontSize="small" />}
                        {index === 1 && <VisibilityIcon fontSize="small" />}
                        {index === 2 && <ThumbUpIcon fontSize="small" />}
                        {index === 3 && <MailOutlineIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ 
                          textTransform: 'none',
                          fontWeight: tabValue === index ? 600 : 400
                        }}>
                          {label}
                        </Typography>
                        <Box sx={{ 
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          ml: 0.5
                        }}>
                          {index === 0 && applyData.length}
                          {index === 1 && totalViews}
                          {index === 2 && likedData.length}
                          {index === 3 && applyData.length}
                        </Box>
                      </Box>
                    }
                    sx={{ 
                      minWidth: 'unset',
                      py: 1.5
                    }}
                  />
                ))}
              </Tabs>
            </Card>

            {/* Tab Content */}
            <Card sx={{ p: isMobile ? 1 : 3 }}>
              {renderTabContent()}
            </Card>

            {/* Detail Dialog */}
            {renderDetailDialog()}
          </>
        ) : (
          sectionContent[selectedSection]
        )}
      </Box>
    </Box>
  );
};

export default BrandDashBoard;
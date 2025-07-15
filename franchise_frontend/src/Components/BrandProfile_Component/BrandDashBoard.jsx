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
  DialogActions
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
  FilterList as FilterIcon
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Professional color palette
const professionalColors = {
  primary: '#2c3e50',      // Dark blue-gray
  secondary: '#34495e',    // Slightly lighter blue-gray
  accent: '#3498db',       // Bright blue for accents
  background: '#f8f9fa',   // Very light gray for background
  cardBackground: '#ffffff', // White for cards
  textPrimary: '#2c3e50',  // Dark text
  textSecondary: '#7f8c8d', // Gray text
  success: '#27ae60',      // Green
  warning: '#f39c12',      // Orange
  error: '#e74c3c',        // Red
  divider: '#ecf0f1'       // Light gray for dividers
};

const BrandDashBoard = ({ selectedSection, sectionContent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [viewType, setViewType] = useState('investors');
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

  // Get unique investment ranges from applyData
  const uniqueInvestmentRanges = [...new Set(applyData.map(item => item.investmentRange))].filter(Boolean);

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

        const responses = await Promise.all(endpoints.map(p => p.catch(e => ({ error: e }))));
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

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setSearchTerm('');
    setInvestmentFilter('all');
  };

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

  // Render table row
  const renderTableRow = (item, type) => {
    const isInvestor = type === 'investor';
    const name = isInvestor 
      ? item?.firstName 
      : item?.brandDetails?.brandName || item?.fullName || 'Unknown';
    const email = isInvestor 
      ? item?.email 
      : item?.brandDetails?.email || item?.email;
    const phone = isInvestor 
      ? item?.mobileNumber || item?.whatsappNumber 
      : item?.brandDetails?.mobileNumber || item?.brandDetails?.whatsappNumber || item?.mobileNumber;
    const image = isInvestor 
      ? item?.profileImage 
      : item?.uploads?.brandLogo?.[0];

    return (
      <TableRow key={item?.uuid} hover sx={{ '&:hover': { backgroundColor: professionalColors.divider } }}>
        <TableCell>
          <Avatar src={image || '/default-avatar.png'} sx={{ bgcolor: professionalColors.secondary }} />
        </TableCell>
        <TableCell sx={{ color: professionalColors.textPrimary }}>{name}</TableCell>
        <TableCell sx={{ color: professionalColors.textPrimary }}>{email || 'N/A'}</TableCell>
        <TableCell sx={{ color: professionalColors.textPrimary }}>{phone || 'N/A'}</TableCell>
        <TableCell>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleViewDetails(item)}
            sx={{
              color: professionalColors.accent,
              borderColor: professionalColors.accent,
              '&:hover': {
                backgroundColor: `${professionalColors.accent}15`,
                borderColor: professionalColors.accent
              }
            }}
          >
            Details
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  // Render tab content based on selected tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress size={60} sx={{ color: professionalColors.accent }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
          <Typography color="error" variant="h6" gutterBottom>Error Loading Data</Typography>
          <Typography color={professionalColors.textSecondary}>{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 2,
              backgroundColor: professionalColors.accent,
              '&:hover': { backgroundColor: professionalColors.secondary }
            }} 
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
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3, alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: professionalColors.textSecondary }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: professionalColors.divider
                      },
                      '&:hover fieldset': {
                        borderColor: professionalColors.accent
                      }
                    }
                  }
                }}
                size={isMobile ? 'small' : 'medium'}
              />
             
              {isMobile ? (
                <>
                  <IconButton 
                    onClick={() => setFilterDialogOpen(true)} 
                    sx={{ alignSelf: 'flex-end', color: professionalColors.accent }}
                  >
                    <FilterIcon />
                  </IconButton>
                  <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle sx={{ color: professionalColors.textPrimary, backgroundColor: professionalColors.cardBackground }}>
                      Filter Applications
                    </DialogTitle>
                    <IconButton
                      aria-label="close"
                      onClick={() => setFilterDialogOpen(false)}
                      sx={{ 
                        position: 'absolute', 
                        right: 8, 
                        top: 8,
                        color: professionalColors.textSecondary
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ backgroundColor: professionalColors.cardBackground }}>
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel sx={{ color: professionalColors.textSecondary }}>Investment Range</InputLabel>
                        <Select
                          label="Investment Range"
                          value={investmentFilter}
                          onChange={(e) => setInvestmentFilter(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: professionalColors.divider
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: professionalColors.accent
                            }
                          }}
                        >
                          <MenuItem value="all">All Ranges</MenuItem>
                          {uniqueInvestmentRanges.map(range => (
                            <MenuItem key={range} value={range}>{range}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: professionalColors.cardBackground }}>
                      <Button 
                        onClick={() => { setInvestmentFilter('all'); setFilterDialogOpen(false); }}
                        sx={{ color: professionalColors.textSecondary }}
                      >
                        Reset
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={() => setFilterDialogOpen(false)}
                        sx={{
                          backgroundColor: professionalColors.accent,
                          '&:hover': { backgroundColor: professionalColors.secondary }
                        }}
                      >
                        Apply
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <FormControl sx={{ minWidth: 200 }} size={isMobile ? 'small' : 'medium'}>
                  <InputLabel sx={{ color: professionalColors.textSecondary }}>Investment Range</InputLabel>
                  <Select
                    label="Investment Range"
                    value={investmentFilter}
                    onChange={(e) => setInvestmentFilter(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: professionalColors.divider
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: professionalColors.accent
                      }
                    }}
                  >
                    <MenuItem value="all">All Ranges</MenuItem>
                    {uniqueInvestmentRanges.map(range => (
                      <MenuItem key={range} value={range}>{range}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>

            {filteredApplyData.length > 0 ? (
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 2,
                  border: `1px solid ${professionalColors.divider}`,
                  boxShadow: 'none'
                }}
              >
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: professionalColors.primary }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Full Name</TableCell>
                      {!isMobile && <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Mobile</TableCell>}
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Location</TableCell>
                      {!isTablet && <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Investment</TableCell>}
                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplyData.map((apply, index) => (
                      <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: professionalColors.divider } }}>
                        <TableCell sx={{ color: professionalColors.textPrimary }}>{apply.fullName || 'Unknown'}</TableCell>
                        {!isMobile && <TableCell sx={{ color: professionalColors.textPrimary }}>{apply.mobileNumber || 'N/A'}</TableCell>}
                        <TableCell sx={{ color: professionalColors.textPrimary }}>{apply?.district || apply?.state || 'N/A'}</TableCell>
                        {!isTablet && <TableCell sx={{ color: professionalColors.textPrimary }}>{apply.investmentRange || 'N/A'}</TableCell>}
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(apply)}
                            sx={{ 
                              minWidth: isMobile ? 80 : 120,
                              color: professionalColors.accent,
                              borderColor: professionalColors.accent,
                              '&:hover': {
                                backgroundColor: `${professionalColors.accent}15`,
                                borderColor: professionalColors.accent
                              }
                            }}
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
                border: `1px dashed ${professionalColors.divider}`,
                borderRadius: 2,
                backgroundColor: professionalColors.cardBackground
              }}>
                <Typography variant="h6" color={professionalColors.textSecondary} gutterBottom>
                  No applications found
                </Typography>
                <Typography variant="body2" color={professionalColors.textSecondary}>
                  {searchTerm || investmentFilter !== 'all' ? 'Try adjusting your search or filters' : 'No applications have been submitted yet'}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 1: // Views tab
        return (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant={viewType === 'investors' ? 'contained' : 'outlined'}
                onClick={() => setViewType('investors')}
                sx={{
                  ...(viewType === 'investors' ? {
                    backgroundColor: professionalColors.accent,
                    '&:hover': { backgroundColor: professionalColors.secondary }
                  } : {
                    color: professionalColors.accent,
                    borderColor: professionalColors.accent,
                    '&:hover': {
                      backgroundColor: `${professionalColors.accent}15`,
                      borderColor: professionalColors.accent
                    }
                  })
                }}
              >
                Investor View ({investorViewsCount})
              </Button>
              <Button
                variant={viewType === 'brands' ? 'contained' : 'outlined'}
                onClick={() => setViewType('brands')}
                sx={{
                  ...(viewType === 'brands' ? {
                    backgroundColor: professionalColors.accent,
                    '&:hover': { backgroundColor: professionalColors.secondary }
                  } : {
                    color: professionalColors.accent,
                    borderColor: professionalColors.accent,
                    '&:hover': {
                      backgroundColor: `${professionalColors.accent}15`,
                      borderColor: professionalColors.accent
                    }
                  })
                }}
              >
                Brand View ({brandViewsCount})
              </Button>
            </Box>

            <TableContainer 
              component={Paper}
              sx={{ 
                border: `1px solid ${professionalColors.divider}`,
                boxShadow: 'none'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: professionalColors.primary }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Avatar</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Phone</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewType === 'investors' && viewsData?.investors?.map(view => renderTableRow(view, 'investor'))}
                  {viewType === 'brands' && viewsData?.brands?.map(view => renderTableRow(view, 'brand'))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 2: // Likes tab
        return (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom sx={{ color: professionalColors.textPrimary }}>
              Total Likes: {likedData.length}
            </Typography>
            <TableContainer 
              component={Paper}
              sx={{ 
                border: `1px solid ${professionalColors.divider}`,
                boxShadow: 'none'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: professionalColors.primary }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Avatar</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {likedData.length > 0 ? (
                    likedData.map(like => (
                      <TableRow key={like?.uuid} hover sx={{ '&:hover': { backgroundColor: professionalColors.divider } }}>
                        <TableCell>
                          <Avatar 
                            src={like?.profileImage || like?.uploads?.brandLogo?.[0] || '/default-avatar.png'} 
                            sx={{ bgcolor: professionalColors.secondary }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: professionalColors.textPrimary }}>
                          {like?.brandDetails?.fullName || like?.firstName || 'Unknown'}
                        </TableCell>
                        <TableCell sx={{ color: professionalColors.textPrimary }}>
                          {like?.brandDetails ? 'Brand' : 'Investor'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => handleViewDetails(like)}
                            sx={{
                              color: professionalColors.accent,
                              borderColor: professionalColors.accent,
                              '&:hover': {
                                backgroundColor: `${professionalColors.accent}15`,
                                borderColor: professionalColors.accent
                              }
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color={professionalColors.textSecondary}>
                          Your brand hasn't received any likes yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 3: // Leads tab
        return (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom sx={{ color: professionalColors.textPrimary }}>
              Total Leads: {applyData.length}
            </Typography>
            <TableContainer 
              component={Paper}
              sx={{ 
                border: `1px solid ${professionalColors.divider}`,
                boxShadow: 'none'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: professionalColors.primary }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Full Name</TableCell>
                    {!isMobile && <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Mobile</TableCell>}
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Location</TableCell>
                    {!isTablet && <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Investment</TableCell>}
                    <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyData.length > 0 ? (
                    applyData.map((apply, index) => (
                      <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: professionalColors.divider } }}>
                        <TableCell sx={{ color: professionalColors.textPrimary }}>{apply.fullName || 'Unknown'}</TableCell>
                        {!isMobile && <TableCell sx={{ color: professionalColors.textPrimary }}>{apply.mobileNumber || 'N/A'}</TableCell>}
                        <TableCell sx={{ color: professionalColors.textPrimary }}>{apply?.district || apply?.state || 'N/A'}</TableCell>
                        {!isTablet && <TableCell sx={{ color: professionalColors.textPrimary }}>{apply.investmentRange || 'N/A'}</TableCell>}
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(apply)}
                            sx={{
                              color: professionalColors.accent,
                              borderColor: professionalColors.accent,
                              '&:hover': {
                                backgroundColor: `${professionalColors.accent}15`,
                                borderColor: professionalColors.accent
                              }
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 3 : isTablet ? 4 : 5} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color={professionalColors.textSecondary}>
                          No one has applied to your brand yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
      PaperProps={{
        sx: {
          backgroundColor: professionalColors.cardBackground,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        color: professionalColors.textPrimary,
        backgroundColor: professionalColors.primary,
        borderBottom: `1px solid ${professionalColors.divider}`
      }}>
        {['Application', 'View', 'Like', 'Lead'][tabValue]} Details
        <IconButton
          aria-label="close"
          onClick={() => setDetailDialogOpen(false)}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: '#fff'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: professionalColors.cardBackground }}>
        {selectedItem && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={
                  selectedItem?.profileImage ||
                  selectedItem?.uploads?.brandLogo?.[0] ||
                  '/default-avatar.png'
                }
                sx={{ 
                  width: 60, 
                  height: 60,
                  bgcolor: professionalColors.secondary
                }}
              />
              <Typography variant="h6" sx={{ color: professionalColors.textPrimary }}>
                {selectedItem.fullName ||
                 selectedItem.brandDetails?.brandName ||
                 selectedItem.firstName ||
                 'Unknown'}
              </Typography>
            </Box>
           
            <Divider sx={{ 
              my: 2,
              borderColor: professionalColors.divider
            }} />
           
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: professionalColors.textPrimary }}>
                  Contact Information
                </Typography>
                <Typography sx={{ color: professionalColors.textSecondary }}>
                  Mobile: {selectedItem.mobileNumber || selectedItem?.brandDetails?.mobileNumber || 'N/A'}
                </Typography>
                <Typography sx={{ color: professionalColors.textSecondary }}>
                  Email: {selectedItem.email || selectedItem?.brandDetails?.email || 'N/A'}
                </Typography>
              </Grid>
             
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: professionalColors.textPrimary }}>
                  Location
                </Typography>
                <Typography sx={{ color: professionalColors.textSecondary }}>
                  {[
                    selectedItem.district,
                    selectedItem.state,
                    selectedItem.country
                  ].filter(Boolean).join(', ') || 'N/A'}
                </Typography>
              </Grid>
             
              {selectedItem.investmentRange && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: professionalColors.textPrimary }}>
                    Investment Details
                  </Typography>
                  <Typography sx={{ color: professionalColors.textSecondary }}>
                    Range: {selectedItem.investmentRange}
                  </Typography>
                  <Typography sx={{ color: professionalColors.textSecondary }}>
                    Plan: {selectedItem.planToInvest || 'N/A'}
                  </Typography>
                </Grid>
              )}
             
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: professionalColors.textPrimary }}>
                  Additional Info
                </Typography>
                <Typography sx={{ color: professionalColors.textSecondary }}>
                  {tabValue === 0 && `Applied By: ${selectedItem.apply?.applyBy || 'Unknown'}`}
                  {tabValue === 1 && `Viewed On: ${new Date(selectedItem.createdAt).toLocaleDateString()}`}
                  {tabValue === 2 && `Liked On: ${new Date(selectedItem.createdAt).toLocaleDateString()}`}
                </Typography>
              </Grid>
             
              {selectedItem.message && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: professionalColors.textPrimary }}>
                    Message
                  </Typography>
                  <Typography sx={{ 
                    fontStyle: 'italic',
                    color: professionalColors.textSecondary
                  }}>
                    {selectedItem.message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ 
        backgroundColor: professionalColors.cardBackground,
        borderTop: `1px solid ${professionalColors.divider}`
      }}>
        <Button 
          onClick={() => setDetailDialogOpen(false)}
          sx={{ color: professionalColors.textSecondary }}
        >
          Close
        </Button>
        {selectedItem?.email && (
          <Button
            variant="contained"
            startIcon={<MailOutlineIcon />}
            onClick={() => window.location.href = `mailto:${selectedItem.email}`}
            sx={{
              backgroundColor: professionalColors.accent,
              '&:hover': { backgroundColor: professionalColors.secondary }
            }}
          >
            Contact
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ 
      backgroundColor: professionalColors.background, 
      minHeight: '100vh', 
      pb: 4 
    }}>
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
              gap: 3,
              backgroundColor: professionalColors.cardBackground,
              border: `1px solid ${professionalColors.divider}`,
              boxShadow: 'none'
            }}>
              <Avatar
                src={brandData?.uploads?.brandLogo?.[0] || '/default-brand.png'}
                sx={{ 
                  width: isMobile ? 80 : 120, 
                  height: isMobile ? 80 : 120, 
                  border: `3px solid ${professionalColors.accent}`,
                  bgcolor: professionalColors.secondary
                }}
              />
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: professionalColors.textPrimary }}>
                  {brandData?.brandDetails?.fullName || 'Your Brand'}
                </Typography>
                <Typography variant="body1" sx={{ color: professionalColors.textSecondary }} gutterBottom>
                  {brandData?.brandID || 'Business type not specified'}
                </Typography>
              </Box>
            </Card>

            {/* Dashboard Tabs */}
            <Card sx={{ 
              mb: 3,
              backgroundColor: professionalColors.cardBackground,
              border: `1px solid ${professionalColors.divider}`,
              boxShadow: 'none'
            }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="auto"
                sx={{ 
                  '& .MuiTabs-indicator': { 
                    backgroundColor: professionalColors.accent, 
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
                        {[<PersonIcon />, <VisibilityIcon />, <ThumbUpIcon />, <MailOutlineIcon />][index]}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textTransform: 'none', 
                            fontWeight: tabValue === index ? 600 : 400,
                            color: tabValue === index ? professionalColors.textPrimary : professionalColors.textSecondary
                          }}
                        >
                          {label}
                        </Typography>
                        <Box sx={{
                          backgroundColor: tabValue === index ? professionalColors.accent : professionalColors.divider,
                          color: tabValue === index ? '#fff' : professionalColors.textSecondary,
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          ml: 0.5
                        }}>
                          {[applyData.length, totalViews, likedData.length, applyData.length][index]}
                        </Box>
                      </Box>
                    }
                    sx={{ 
                      minWidth: 'unset', 
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: `${professionalColors.accent}10`
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Card>

            {/* Tab Content */}
            <Card sx={{ 
              p: isMobile ? 1 : 3,
              backgroundColor: professionalColors.cardBackground,
              border: `1px solid ${professionalColors.divider}`,
              boxShadow: 'none'
            }}>
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
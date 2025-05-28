import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  IconButton,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Avatar,
  TextField,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Rating,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Divider,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  Share,
  Description as DescriptionIcon,
  AccountTree,
  Business,
  Star,
  StarBorder,
  AttachMoney,
  Support,
  CheckCircleOutline,
  Image as ImageIcon,
  VideoLibrary,
  LocationOn,
  Phone,
  Email,
  Language,
  Facebook,
  Instagram,
  LinkedIn
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// 1. Brand Overview Component with animations
const BrandOverviewSection = ({ brand }) => (
  <motion.div variants={itemVariants}>
    <Box sx={{ 
      mb: 4, 
      p: 3, 
      backgroundColor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 1,
      borderLeft: '4px solid #ff9800'
    }}>
      <Typography variant="h6" sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1, 
        mb: 2, 
        color: '#ff9800',
        pb: 1,
        borderBottom: '2px solid #ff9800'
      }}>
        <DescriptionIcon sx={{ color: '#ff9800' }} />
        Brand Overview
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Brand Name</TableCell>
                  <TableCell>{brand.personalDetails?.brandName || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell>{brand.personalDetails?.brandDescription || "Not specified"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Categories</TableCell>
                  <TableCell>
                    {brand.personalDetails?.brandCategories?.map((category, index) => (
                      <Chip 
                        key={index} 
                        label={`${category.main || ""} > ${category.child || ""} > ${category.sub || ""}`} 
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          mb: 1,
                          backgroundColor: '#fff3e0',
                          color: '#e65100'
                        }} 
                      />
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Expansion Locations</TableCell>
                  <TableCell>
                    {brand.personalDetails?.expansionLocation?.map((loc, i) => (
                      <Chip 
                        key={i} 
                        label={`${loc.city}, ${loc.state}`} 
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          mb: 1,
                          backgroundColor: '#fff3e0',
                          color: '#e65100'
                        }} 
                        icon={<LocationOn fontSize="small" sx={{ color: '#ff9800' }} />}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  </motion.div>
);

// 2. Enhanced Franchise Models Component with all fields
const FranchiseModelsSection = ({ 
  franchiseModels, 
  selectedModel, 
  onModelSelect,
  onOpenForm
}) => (
  <motion.div variants={itemVariants}>
    <Box sx={{ 
      mb: 4, 
      p: 3, 
      backgroundColor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 1,
      borderLeft: '4px solid #ff9800'
    }}>
      <Typography variant="h6" sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1, 
        mb: 2, 
        color: '#ff9800',
        pb: 1,
        borderBottom: '2px solid #ff9800'
      }}>
        <AccountTree sx={{ color: '#ff9800' }} />
        Franchise Models
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#ff9800' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Model</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Investment</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Area</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Franchise Fee</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Royalty</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Interior</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Exterior</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>ROI</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>BreakEven</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {franchiseModels.map((model, index) => (
              <TableRow 
                key={index} 
                hover 
                selected={selectedModel?._id === model._id}
                sx={{ 
                  '&:last-child td': { borderBottom: 0 },
                  backgroundColor: selectedModel?._id === model._id ? '#fff3e0' : 'inherit'
                }}
              >
                <TableCell>{model.franchiseModel || "Not specified"}</TableCell>
                <TableCell>{model.franchiseType || "Not specified"}</TableCell>
                <TableCell>{model.investmentRange || "Not specified"}</TableCell>
                <TableCell>{model.areaRequired || "Not specified"}</TableCell>
                <TableCell>{model.franchiseFee || "Not specified"}</TableCell>
                <TableCell>{model.royaltyFee || "Not specified"}</TableCell>
                <TableCell>{model.interiorCost || "Not specified"}</TableCell>
                <TableCell>{model.exteriorCost || "Not specified"}</TableCell>
                <TableCell>{model.roi || "Not specified"}</TableCell>
                <TableCell>{model.breakEven || "Not specified"}</TableCell>
                <TableCell>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant={selectedModel?._id === model._id ? "contained" : "outlined"}
                      size="small"
                      onClick={() => onModelSelect(model)}
                      sx={{
                        color: selectedModel?._id === model._id ? 'white' : '#ff9800',
                        backgroundColor: selectedModel?._id === model._id ? '#ff9800' : 'transparent',
                        borderColor: '#ff9800',
                        '&:hover': {
                          backgroundColor: '#ff9800',
                          color: 'white'
                        }
                      }}
                    >
                      {selectedModel?._id === model._id ? "Select" : "Selected"}
                    </Button>
                  </motion.div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="contained" 
            onClick={onOpenForm}
            disabled={!selectedModel}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
              backgroundColor: '#ff9800',
              '&:hover': {
                backgroundColor: '#fb8c00'
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            Apply for Franchise
          </Button>
        </motion.div>
      </Box>
    </Box>
  </motion.div>
);

// 3. Enhanced Company Details Component
const CompanyDetailsSection = ({ brand }) => (
  <motion.div variants={itemVariants}>
    <Box sx={{ 
      mb: 4, 
      p: 3, 
      backgroundColor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 1,
      borderLeft: '4px solid #ff9800'
    }}>
      <Typography variant="h6" sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1, 
        mb: 2, 
        color: '#ff9800',
        pb: 1,
        borderBottom: '2px solid #ff9800'
      }}>
        <Business sx={{ color: '#ff9800' }} />
        Company Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Company Name</TableCell>
                  <TableCell>{brand.personalDetails?.companyName || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Established Year</TableCell>
                  <TableCell>{brand.personalDetails?.establishedYear || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Franchising Since</TableCell>
                  <TableCell>{brand.personalDetails?.franchiseSinceYear || "Not specified"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
          
      </Grid>
    </Box>
  </motion.div>
);

// 4. Enhanced Franchise Details Component
const FranchiseDetailsSection = ({ brand }) => (
  <motion.div variants={itemVariants}>
    <Box sx={{ 
      mb: 4, 
      p: 3, 
      backgroundColor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 1,
      borderLeft: '4px solid #ff9800'
    }}>
      <Typography variant="h6" sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1, 
        mb: 2, 
        color: '#ff9800',
        pb: 1,
        borderBottom: '2px solid #ff9800'
      }}>
        <AttachMoney sx={{ color: '#ff9800' }} />
        Franchise Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Agreement Period</TableCell>
                  <TableCell>{brand.franchiseDetails?.agreementPeriod || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Company Outlets</TableCell>
                  <TableCell>{brand.franchiseDetails?.companyOwnedOutlets || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Franchise Outlets</TableCell>
                  <TableCell>{brand.franchiseDetails?.franchiseOutlets || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Break Even Period</TableCell>
                  <TableCell>
                    {brand.franchiseDetails?.modelsOfFranchise?.[0]?.breakEven || "Not specified"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Training Provided</TableCell>
                  <TableCell>{brand.franchiseDetails?.trainingProvidedBy || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Support</TableCell>
                  <TableCell>{brand.franchiseDetails?.requirementSupport || "Not specified"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Total Investment</TableCell>
                  <TableCell>
                    {brand.franchiseDetails?.modelsOfFranchise?.reduce((min, model) => {
                      const range = model.investmentRange?.match(/\d+/g);
                      if (range) {
                        const currentMin = Math.min(...range.map(Number));
                        return Math.min(min, currentMin);
                      }
                      return min;
                    }, Infinity) || "Not specified"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Interior Cost</TableCell>
                  <TableCell>
                    {brand.franchiseDetails?.modelsOfFranchise?.[0]?.interiorCost || "Not specified"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  </motion.div>
);


// 5. Enhanced Media Gallery Component
const MediaGallerySection = ({ brand }) => {
  const [activeTab, setActiveTab] = useState('images');
  
  const media = {
    images: [
      ...(brand.brandDetails?.companyImage ? [brand.brandDetails.companyImage] : []),
      ...(brand.brandDetails?.exteriorOutlet || []),
      ...(brand.brandDetails?.interiorOutlet || [])
    ],
    videos: brand.brandDetails?.videos || []
  };

  return (
    <motion.div variants={itemVariants}>
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: 1,
        borderLeft: '4px solid #ff9800'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Typography variant="h6" sx={{ 
            color: '#ff9800',
            pb: 1,
            borderBottom: '2px solid #ff9800'
          }}>
            Media Gallery
          </Typography>
          <Box>
            <Button 
              startIcon={<ImageIcon sx={{ color: activeTab === 'images' ? '#ff9800' : 'inherit' }} />} 
              onClick={() => setActiveTab('images')}
              sx={{ 
                color: activeTab === 'images' ? '#ff9800' : 'inherit',
                '&:hover': {
                  color: '#ff9800'
                }
              }}
            >
              Images
            </Button>
            <Button 
              startIcon={<VideoLibrary sx={{ color: activeTab === 'videos' ? '#ff9800' : 'inherit' }} />} 
              onClick={() => setActiveTab('videos')}
              sx={{ 
                ml: 1,
                color: activeTab === 'videos' ? '#ff9800' : 'inherit',
                '&:hover': {
                  color: '#ff9800'
                }
              }}
            >
              Videos
            </Button>
          </Box>
        </Box>
        
        {activeTab === 'images' ? (
          <Grid container spacing={2}>
            {media.images.length > 0 ? (
              media.images.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={img}
                        alt={`Brand image ${index + 1}`}
                      />
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ p: 2, color: '#ff9800' }}>
                No images available
              </Typography>
            )}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {media.videos.length > 0 ? (
              media.videos.map((video, index) => (
                <Grid item xs={12} key={index}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card>
                      <CardContent sx={{ p: 0 }}>
                        <iframe
                          width="100%"
                          height="400"
                          src={video}
                          title={`Brand video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ p: 2, color: '#ff9800' }}>
                No videos available
              </Typography>
            )}
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

// 6. Enhanced Application Form Component
const FranchiseApplicationForm = ({ 
  open, 
  onClose, 
  franchiseModels, 
  brandId, 
  brandName,
  selectedModel,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    franchiseModel:  "",
    franchiseType:  "",
    investmentRange: "",
    location: "",
    planToInvest: "",
    readyToInvest: "",
    
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.planToInvest) newErrors.planToInvest = 'Investment plan is required';
    if (!formData.readyToInvest) newErrors.readyToInvest = 'Investment readiness is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Update form data when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      setFormData(prev => ({
        ...prev,
        franchiseModel: selectedModel.franchiseModel || "",
        franchiseType: selectedModel.franchiseType || "",
        investmentRange: selectedModel.investmentRange || "",
      }));
    }
  }, [selectedModel]);



   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        brandId,
        brandName,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success:
      // 1. Reset form
      setFormData({
        fullName: "",
        franchiseModel: "",
        franchiseType: "",
        investmentRange: "",
        location: "",
        planToInvest: "",
        readyToInvest: "",
      });
      
      // 2. Close form
      onClose();
      
      // 3. Trigger success callback
      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const investmentTimings = [
    "Immediately",
    "1-3 months",
    "3-6 months",
    "6+ months",
  ];
  
  const readyToInvestOptions = [
    "Own Investment",
    "Going To Loan",
    "Need Loan Assistance",
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#ff9800' }}>
            <DescriptionIcon sx={{ color: '#ff9800', mr: 1 }} />
            Apply for {brandName} Franchise
          </Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* {submitSuccess ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleOutline sx={{ fontSize: 60, color: "#4caf50", mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Application Submitted Successfully!
            </Typography>
            <Typography variant="body1">
              We'll contact you soon regarding your franchise application.
            </Typography>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{ 
                  mt: 2, 
                  bgcolor: "#4caf50",
                  borderRadius: "8px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Close
              </Button>
            </motion.div>
          </Box>
        ) : ( */}
           <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Selected Model: {selectedModel?.franchiseModel || "Not selected"} ({selectedModel?.investmentRange || "N/A"})
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location *"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Plan to Invest *"
                name="planToInvest"
                value={formData.planToInvest}
                onChange={handleChange}
                error={!!errors.planToInvest}
                helperText={errors.planToInvest}
              >
                {investmentTimings.map((option, i) => (
                  <MenuItem key={i} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Ready to Invest *"
                name="readyToInvest"
                value={formData.readyToInvest}
                onChange={handleChange}
                error={!!errors.readyToInvest}
                helperText={errors.readyToInvest}
              >
                {readyToInvestOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ 
                    py: 1.5,
                    backgroundColor: '#ff9800',
                    '&:hover': {
                      backgroundColor: '#fb8c00'
                    }
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </form>
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
};

// Main Brand Details Modal Component
const BrandDetailsModal = ({ brand, open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const franchiseModelsData = brand?.franchiseDetails?.modelsOfFranchise || [];
  const brandId = brand?._id;
  const brandName = brand?.personalDetails?.brandName || "";
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleOpenForm = () => {
    if (!selectedModel) {
      setSnackbar({
        open: true,
        message: 'Please select a franchise model first',
        severity: 'warning'
      });
      return;
    }
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Your application has been submitted successfully!',
      severity: 'success'
    });
    setIsFormOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        fullScreen={isMobile}
        sx={{ 
          '& .MuiDialog-paper': { 
            borderRadius: isMobile ? 0 : 3,
            maxHeight: '100vh'
          } 
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#ff9800', 
          color: 'white',
          py: 2,
          position: 'relative'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                src={brand?.brandDetails?.brandLogo} 
                alt={brandName}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  border: "3px solid white",
                  boxShadow: 2
                }} 
              />
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {brandName}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                  <Rating
                    value={4.5}
                    precision={0.5}
                    readOnly
                    size="medium"
                    icon={<Star fontSize="inherit" sx={{ color: "gold" }} />}
                    emptyIcon={<StarBorder fontSize="inherit" sx={{ color: "gold" }} />}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    4.5 (100 reviews)
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose} 
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 0 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(e, newValue) => setTabIndex(newValue)}
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                fontWeight: 600
              }
            }}
          >
            <Tab 
              label="Overview" 
              icon={<DescriptionIcon sx={{ color: tabIndex === 0 ? '#ff9800' : 'inherit' }} />} 
              iconPosition="start" 
              sx={{ color: tabIndex === 0 ? '#ff9800' : 'inherit' }}
            />
            <Tab 
              label="Gallery" 
              icon={<ImageIcon sx={{ color: tabIndex === 1 ? '#ff9800' : 'inherit' }} />} 
              iconPosition="start" 
              sx={{ color: tabIndex === 1 ? '#ff9800' : 'inherit' }}
            />
          </Tabs>

          <Divider />

          {tabIndex === 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              sx={{ mt: 3 }}
            >
              <BrandOverviewSection brand={brand} />
              <FranchiseModelsSection 
                franchiseModels={franchiseModelsData} 
                selectedModel={selectedModel} 
                onModelSelect={handleModelSelect}
                onOpenForm={handleOpenForm}
              />
              <CompanyDetailsSection brand={brand} />
              <FranchiseDetailsSection brand={brand} />
            </motion.div>
          )}

          {tabIndex === 1 && (
            <Box sx={{ mt: 3 }}>
              <MediaGallerySection brand={brand} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          bgcolor: 'grey.100',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          {/* <motion.div whileHover={{ scale: 1.03 }}>
            <Button
              variant="outlined"
              startIcon={<Share sx={{ color: '#ff9800' }} />}
              sx={{ 
                borderRadius: '50px',
                px: 3,
                textTransform: 'none',
                color: '#ff9800',
                borderColor: '#ff9800',
                '&:hover': {
                  borderColor: '#ff9800',
                  backgroundColor: '#fff3e0'
                }
              }}
            >
              Share
            </Button>
          </motion.div> */}
          <Box sx={{ flex: 1 }} />
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="contained" 
              onClick={handleOpenForm}
              sx={{
                borderRadius: '50px',
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#ff9800',
                '&:hover': {
                  backgroundColor: '#fb8c00'
                }
              }}
            >
              Apply Now
            </Button>
          </motion.div>
        </DialogActions>
         <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Dialog>

      <FranchiseApplicationForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        franchiseModels={franchiseModelsData}
        brandId={brandId}
        brandName={brandName}
        selectedModel={selectedModel}
        onSuccess={handleFormSuccess}
      />

     
    </>
  );
};

export default BrandDetailsModal;
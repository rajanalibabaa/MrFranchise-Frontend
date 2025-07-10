import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Modal,
  IconButton,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  Description as DescriptionIcon,
  CheckCircleOutline,
  Business as BusinessIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { closeBrandDialog, fetchBrands } from "../../Redux/Slices/brandSlice.jsx";
import axios from "axios";
import ShareDialogActions from "./ShareDialogActions.jsx";
import OverviewTab from "./OverviewTab.jsx";
import { ShieldCloseIcon } from "lucide-react";
import Footer from "../../Components/Footers/Footer.jsx";
import Navbar from "../../Components/Navbar/NavBar.jsx";

const BrandDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const { selectedBrand } = useSelector((state) => state.brands);
  
  const investorUUID = localStorage.getItem("investorUUID");
  const AccessToken = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    location: "",
    planToInvest: "",
    readyToInvest: "",
  });

  // Memoize derived data
  const franchiseModels = React.useMemo(() => [
    ...new Set(selectedBrand?.franchiseDetails?.fico?.map(m => m.franchiseModel) || [])
  ], [selectedBrand]);

  const franchiseTypes = React.useMemo(() => [
    ...new Set(selectedBrand?.franchiseDetails?.fico?.map(m => m.franchiseType) || [])
  ], [selectedBrand]);

  const investmentRanges = React.useMemo(() => [
    ...new Set(selectedBrand?.franchiseDetails?.fico?.map(m => m.investmentRange) || [])
  ], [selectedBrand]);

  const investmentTimings = React.useMemo(() => [
    "Immediately", "1-3 months", "3-6 months", "6+ months"
  ], []);

  const readyToInvestOptions = React.useMemo(() => [
    "Own Investment", "Going To Loan", "Need Loan Assistance"
  ], []);

  const expansionLocations =
    selectedBrand?.expansionLocationData?.expansionLocations?.domestic?.cities || [];

  // Media data
  const allVideos = React.useMemo(() => 
    selectedBrand?.uploads?.franchisePromotionVideo || []
  , [selectedBrand]);

  const allImages = React.useMemo(() => [
    ...(selectedBrand?.uploads?.brandLogo ? [selectedBrand.uploads.brandLogo] : []),
    ...(selectedBrand?.uploads?.exteriorOutlet || []),
    ...(selectedBrand?.uploads?.interiorOutlet || []),
  ], [selectedBrand]);

  // Image box sizes based on screen size
  const getImageBoxSize = () => {
    if (isMobile) return 120;
    if (isTablet) return 150;
    return 200;
  };

  // Fetch brand data
  useEffect(() => {
    if (uuid) {
      dispatch(fetchBrands(uuid));
    }
  }, [uuid, dispatch]);

  // Fetch investor data
  useEffect(() => {
    const fetchInvestorDetails = async () => {
      if (!investorUUID || !AccessToken) return;
      try {
        const response = await axios.get(
          `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );
        setUserData(response.data.data);
        const investor = response.data?.data;
        if (investor) {
          setFormData(prev => ({
            ...prev,
            fullName: investor.firstName || "",
            investorEmail: investor.email || "",
            mobileNumber: investor.mobileNumber || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch investor details:", error);
      }
    };

    fetchInvestorDetails();
  }, [investorUUID, AccessToken]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        brandId: selectedBrand?.uuid,
        brandName: selectedBrand?.brandDetails?.brandName || "",
        brandEmail: selectedBrand.brandDetails?.email || "",
        brandLogo: selectedBrand.brandDetails?.brandLogo || "",
      };

      const token = localStorage.getItem("accessToken");
      const id = investorUUID || localStorage.getItem("brandUUID");

      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        return;
      }

      if (!payload.fullName || !payload.investorEmail || !payload.mobileNumber || 
          !payload.location || !payload.investmentRange || !payload.planToInvest || 
          !payload.readyToInvest) {
        alert("Please fill all required fields.");
        return;
      }

      const response = await axios.post(
        `https://franchise-backend-wgp6.onrender.com/api/v1/instantapply/postApplication/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.log("Submission error:", error?.response?.data || error.message);
      alert("❌Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedBrand, investorUUID]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSubmitSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    dispatch(closeBrandDialog());
    navigate(-1);
  }, [dispatch, navigate]);

  const handleShareClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleImageOpen = useCallback((index) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  }, []);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  if (!selectedBrand) return null;

  const getOutletRange = (value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue === null) return 'N/A';
    if (numericValue < 10) return 'Below 10';
    const lower = Math.floor(numericValue / 10) * 10;
    const upper = lower + 10;
    return `${lower} - ${upper}`;
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        my: 4,
        px: isMobile ? 2 : 4,
      }}>
        {/* Brand header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} justifyContent="space-between" mb={3} gap={2}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box position="relative">
                <Avatar
                  src={selectedBrand.uploads?.brandLogo}
                  alt={selectedBrand.brandDetails?.brandName}
                  sx={{
                    width: isMobile ? 50 : 70,
                    height: isMobile ? 50 : 70,
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 600,
                    background: "linear-gradient(45deg, #000 30%, #000 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {selectedBrand.brandDetails?.brandName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBrand.brandDetails?.tagLine}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Established Year: {selectedBrand.franchiseDetails?.establishedYear || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Franchise Since: {selectedBrand.franchiseDetails?.franchiseSinceYear || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Category: {[selectedBrand.franchiseDetails?.brandCategories?.child].filter(Boolean).join(" , ") || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Area: {selectedBrand.franchiseDetails?.fico[0]?.areaRequired || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Investment: {selectedBrand.franchiseDetails?.fico[0]?.investmentRange || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Outlets: {getOutletRange(selectedBrand.franchiseDetails?.totalOutlets)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ my: 3 }} />

        {/* Media section with animations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  width: isMobile ? '48vh' : '100vh',
                  height: isMobile ? 250 : 416,
                  borderRadius: 2,
                  overflow: 'hidden',
              
                }}
                component={motion.div}
                whileHover={{ scale: 1.01 }}
              >
                {allVideos.length > 0 ? (
                  <video
                    controls
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                  >
                    <source src={allVideos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No promotional video available
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1,
                }}
              >
                {allImages.slice(0, 3).map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Box
                      sx={{
                        width: isMobile ? '25vh' : '100%',
                        height: getImageBoxSize(),
                        overflow: 'hidden',
                        borderRadius: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5',
                      }}
                      onClick={() => handleImageOpen(index)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: getImageBoxSize(),
                      overflow: 'hidden',
                      borderRadius: 2,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.05)',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.1)',
                      },
                    }}
                    onClick={() => {
                      setCurrentImageIndex(3);
                      setImageModalOpen(true);
                    }}
                  >
                    <Typography variant={isMobile ? "body2" : "h6"} sx={{ fontWeight: 600, textAlign: 'center', zIndex: 1 }}>
                      View More ({Math.max(allImages.length - 3, 0)}+)
                    </Typography>
                    {allImages[3] && (
                      <img
                        src={allImages[3]}
                        alt="Preview"
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.25,
                          zIndex: 0,
                        }}
                      />
                    )}
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </motion.div>

        <Divider sx={{ my: 5 }} />

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4 }}>
          {/* Overview tab */}
          <Box sx={{maxWidth: isMobile ? '100%' : 800}}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <OverviewTab
                brand={selectedBrand}
                setIsModalOpen={setIsModalOpen}
              />
            </motion.div>
          </Box>

          {/* Application Form */}
          <Box sx={{ 
            width: isMobile ? '100%' : 400,
            height: isMobile ? '100%' : 900,
            // flexShrink: 0,
            p: 3,
            borderRadius: 2,
            background: "#fff",
            boxShadow: 2,
            border: "1px solid #eee",
          }}>
            <Typography variant="h6" fontWeight={700} sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              Instant Franchise Application
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid  spacing={2}  sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="investorEmail"
                    value={formData.investorEmail || userData?.email || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber || userData?.mobileNumber || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="State"
                    name="State"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {expansionLocations.map((loc, i) => (
                      <MenuItem key={i} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="District"
                    name="District"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {expansionLocations.map((loc, i) => (
                      <MenuItem key={i} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="City"
                    name="City"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {expansionLocations.map((loc, i) => (
                      <MenuItem key={i} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Investment Range"
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {investmentRanges.map((range, i) => (
                      <MenuItem key={i} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Plan to Invest"
                    name="planToInvest"
                    value={formData.planToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {investmentTimings.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Ready to Invest"
                    name="readyToInvest"
                    value={formData.readyToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {readyToInvestOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      backgroundColor:'#ff9800',
                      py: 1.5,
                      fontSize: '1rem',
                      '&:disabled': {
                        background: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                        Submitting...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
            
            <Box sx={{ 
              mt: 3,
              p: 2,
              borderRadius: '8px',
              bgcolor: 'rgba(102, 126, 234, 0.05)',
              borderLeft: `4px solid #667eea`
            }}>
              <Typography variant="body2">
                <strong>Note:</strong> Our team will contact you within 24 hours to discuss the franchise opportunity in detail.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Image Modal */}
        <Dialog
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          maxWidth="lg"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: 'rgba(0,0,0,0.9)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
          }}>
            <Typography>
              Image {currentImageIndex + 1} of {allImages.length}
            </Typography>
            <IconButton onClick={() => setImageModalOpen(false)} color="inherit">
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: isMobile ? '50vh' : '70vh'
          }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <IconButton
                sx={{ 
                  position: 'absolute', 
                  left: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                onClick={handlePrevImage}
              >
                <ArrowBack fontSize="large" />
              </IconButton>
              
              <img
                src={allImages[currentImageIndex]}
                alt={`Gallery ${currentImageIndex}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  margin: '0 auto'
                }}
              />
              
              <IconButton
                sx={{ 
                  position: 'absolute', 
                  right: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                onClick={handleNextImage}
              >
                <ArrowForward fontSize="large" />
              </IconButton>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{
            justifyContent: 'center',
            pb: 3
          }}>
            <Box sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '100%',
              overflowX: 'auto',
              px: 2,
              py: 1
            }}>
              {allImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: currentImageIndex === index ? '2px solid #1976d2' : '1px solid #555',
                    opacity: currentImageIndex === index ? 1 : 0.7,
                    flexShrink: 0
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DialogActions>
        </Dialog>

        <ShareDialogActions anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
         <Box  sx={{
            // position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? 0 : 100,
            mb: isMobile ? 4 : 0,
            p: 4,
            borderRadius: '16px',
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h5" fontWeight={700} sx={{ 
              mb: 3, 
              // color: colors.dark,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {/* <ContactMail sx={{ color: colors.primary }} /> */}
              Instant Franchise Application
            </Typography>
            
            <form onSubmit={handleSubmit}>
                         <Grid  spacing={2}  sx={{ display: 'Grid',gridTemplateColumns: 'repeat(3, 1fr)', gap: 2}}>
                           <Grid item xs={12}>
                             <TextField
                               fullWidth
                               label="Full Name"
                               name="fullName"
                               value={formData.fullName || userData?.firstName || ""}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             />
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               fullWidth
                               label="Email"
                               name="investorEmail"
                               value={formData.investorEmail || userData?.email || ""}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             />
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               fullWidth
                               label="Mobile Number"
                               name="mobileNumber"
                               value={formData.mobileNumber || userData?.mobileNumber || ""}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             />
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               select
                               fullWidth
                               label="State"
                               name="State"
                               value={formData.location}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             >
                               {expansionLocations.map((loc, i) => (
                                 <MenuItem key={i} value={loc}>
                                   {loc}
                                 </MenuItem>
                               ))}
                             </TextField>
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               select
                               fullWidth
                               label="District"
                               name="District"
                               value={formData.location}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             >
                               {expansionLocations.map((loc, i) => (
                                 <MenuItem key={i} value={loc}>
                                   {loc}
                                 </MenuItem>
                               ))}
                             </TextField>
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               select
                               fullWidth
                               label="City"
                               name="City"
                               value={formData.location}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             >
                               {expansionLocations.map((loc, i) => (
                                 <MenuItem key={i} value={loc}>
                                   {loc}
                                 </MenuItem>
                               ))}
                             </TextField>
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               select
                               fullWidth
                               label="Investment Range"
                               name="investmentRange"
                               value={formData.investmentRange}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             >
                               {investmentRanges.map((range, i) => (
                                 <MenuItem key={i} value={range}>
                                   {range}
                                 </MenuItem>
                               ))}
                             </TextField>
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               select
                               fullWidth
                               label="Plan to Invest"
                               name="planToInvest"
                               value={formData.planToInvest}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             >
                               {investmentTimings.map((option, i) => (
                                 <MenuItem key={i} value={option}>
                                   {option}
                                 </MenuItem>
                               ))}
                             </TextField>
                           </Grid>
                           <Grid item xs={12}>
                             <TextField
                               select
                               fullWidth
                               label="Ready to Invest"
                               name="readyToInvest"
                               value={formData.readyToInvest}
                               onChange={handleChange}
                               required
                               variant="outlined"
                               size="medium"
                             >
                               {readyToInvestOptions.map((option, i) => (
                                 <MenuItem key={i} value={option}>
                                   {option}
                                 </MenuItem>
                               ))}
                             </TextField>
                           </Grid>
                           <Grid item xs={12}>
                             <Button
                               type="submit"
                               fullWidth
                               size="large"
                               variant="contained"
                               disabled={isSubmitting}
                               sx={{
                                 mt: 2,
                                 backgroundColor: "#ff9800",
                                 py: 1.5,
                                 fontSize: '1rem',
                                 '&:disabled': {
                                   background: '#e0e0e0',
                                   color: '#9e9e9e'
                                 }
                               }}
                             >
                               {isSubmitting ? (
                                 <>
                                   <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                                   Submitting...
                                 </>
                               ) : (
                                 "Apply Now"
                               )}
                             </Button>
                           </Grid>
                         </Grid>
                       </form>
                       
                       <Box sx={{ 
                         mt: 3,
                         p: 2,
                         borderRadius: '8px',
                         bgcolor: 'rgba(102, 126, 234, 0.05)',
                         borderLeft: `4px solid #667eea`
                       }}>
                         <Typography variant="body2">
                           <strong>Note:</strong> Our team will contact you within 24 hours to discuss the franchise opportunity in detail.
                         </Typography>
                       </Box>
          </Box>
      </Box>
     
      <Footer />
    </>
  );
};

export default React.memo(BrandDetails);
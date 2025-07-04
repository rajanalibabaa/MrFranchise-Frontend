import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Rating,
  TextField,
  MenuItem,
  CircularProgress,
  Modal,
  IconButton,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
   DialogActions

} from "@mui/material";
import {
  Close,
  Share,
  Description as DescriptionIcon,
  CheckCircleOutline,
  Star,
  StarBorder,
  Business as BusinessIcon,
  ArrowBack,
} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OverviewTab from "./OverviewTab";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { closeBrandDialog } from "../../Redux/Slices/brandSlice.jsx";
import axios from "axios";
import ShareDialogActions from "./ShareDialogActions.jsx";

const BrandDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { selectedBrand } = useSelector((state) => state.brands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    location: "",
    planToInvest: "",
    readyToInvest: "",
  });
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const investorUUID = localStorage.getItem("investorUUID");
  const AccessToken = localStorage.getItem("accessToken");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
          setFormData((prev) => ({
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

  const franchiseModels = [
    ...new Set(
      selectedBrand?.franchiseDetails?.modelsOfFranchise?.map(
        (m) => m.franchiseModel
      ) || []
    ),
  ];

  const franchiseTypes = [
    ...new Set(
      selectedBrand?.franchiseDetails?.modelsOfFranchise?.map(
        (m) => m.franchiseType
      ) || []
    ),
  ];

  const investmentRanges = [
    ...new Set(
      selectedBrand?.franchiseDetails?.modelsOfFranchise?.map(
        (m) => m.investmentRange
      ) || []
    ),
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        brandId: selectedBrand?.uuid,
        brandName: selectedBrand?.personalDetails?.brandName || "",
        brandEmail: selectedBrand.personalDetails?.email || "",
        brandLogo: Array.isArray(selectedBrand.brandDetails?.brandLogo)
          ? selectedBrand.brandDetails.brandLogo[0] || ""
          : selectedBrand.brandDetails?.brandLogo || "",
      };

      const token = localStorage.getItem("accessToken");
      const investorUUID = localStorage.getItem("investorUUID");
      const brandUUID = localStorage.getItem("brandUUID");
      const id = investorUUID || brandUUID;

      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        setIsSubmitting(false);
        return;
      }

      if (
        !payload.fullName ||
        !payload.investorEmail ||
        !payload.mobileNumber ||
        !payload.location ||
        !payload.investmentRange ||
        !payload.planToInvest ||
        !payload.readyToInvest
      ) {
        alert("Please fill all required fields.");
        setIsSubmitting(false);
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
        setFormData({
          fullName: "",
          location: "",
          investmentRange: "",
          planToInvest: "",
          readyToInvest: "",
          investorEmail: "",
          mobileNumber: "",
        });
      }
    } catch (error) {
      console.log("Submission error:", error?.response?.data || error.message);
      alert("❌Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({
      fullName: "",
      location: "",
      investmentRange: "",
      planToInvest: "",
      readyToInvest: "",
      investorEmail: "",
      mobileNumber: "",
    });
    setSubmitSuccess(false);
  };

  const handleClose = () => {
    dispatch(closeBrandDialog());
    navigate(-1); // Go back to previous page
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };

  if (!selectedBrand) return null;

  const allVideos = [
    ...(selectedBrand.uploads?.brandPromotionVideo || []),
    ...(selectedBrand.uploads?.franchisePromotionVideo || []),
  ];

  const allImages = [
    ...(selectedBrand.uploads?.brandLogo
      ? [selectedBrand.uploads.brandLogo]
      : []),
    ...(selectedBrand.uploads?.exteriorOutlet || []),
    ...(selectedBrand.uploads?.interiorOutlet || []),
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleClose}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Back to Brands
      </Button>

      {/* Main content */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Brand header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <img
                src={selectedBrand.uploads?.brandLogo}
                alt={selectedBrand.brandDetails?.brandName}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: -10,
                  bgcolor: "#ff9800",
                  color: "white",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                }}
              >
                <BusinessIcon fontSize="small" />
              </Box>
            </Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #000 30%, #000 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedBrand.brandDetails?.brandName}
            </Typography>
          </Box>
          <IconButton onClick={handleShareClick} size="large">
            <Share sx={{ color: "#ff9800" }} />
          </IconButton>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Media section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              width: '100%',
              height: 430,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: '#f5f5f5'
            }}>
              {allVideos.length > 0 ? (
                allVideos.map((videoUrl, index) => (
                  <Box key={index} sx={{ width: '100%', height: '100%' }}>
                    <video
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%' 
                }}>
                  <Typography>No videos available</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              maxHeight: 430,
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2
            }}>
              {allImages.map((imageUrl, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setImageModalOpen(true);
                  }}
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
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Brand details */}
        <Box mt={4}>
          <Typography variant="subtitle1" mb={2}>
            {selectedBrand.personalDetails?.brandCategories &&
              selectedBrand.personalDetails.brandCategories.length > 0 && (
                <Box>
                  {selectedBrand.personalDetails.brandCategories.map(
                    (category, index) => (
                      <Box key={index}>
                        <Box display="flex" gap={3} flexWrap="wrap">
                          <Typography variant="body1">
                            <strong>Category:</strong> {category.child}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Investment:</strong>{" "}
                            {selectedBrand.franchiseDetails?.modelsOfFranchise?.map(
                              (model) => model.investmentRange
                            )}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Area:</strong>{" "}
                            {selectedBrand.franchiseDetails?.modelsOfFranchise?.map(
                              (model) => model.areaRequired
                            )}{" "}
                            sq.ft
                          </Typography>
                        </Box>

                        {selectedBrand.personalDetails?.expansionLocation?.length > 0 && (
                          <Typography variant="body1" mt={1}>
                            <strong>Expansions:</strong>
                            {selectedBrand.personalDetails.expansionLocation.map(
                              (location) => ` ${location.city},`
                            )}
                          </Typography>
                        )}
                      </Box>
                    )
                  )}
                </Box>
              )}
          </Typography>
        </Box>

        {/* Overview tab */}
        <Box mt={4}>
          <OverviewTab
            brand={selectedBrand}
            setIsModalOpen={setIsModalOpen}
          />
        </Box>

        {/* Apply button */}
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            disabled={!userData}
            sx={{
              bgcolor: "#ff9800",
              color: "white",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              fontSize: "1rem",
              minWidth: "240px",
              "&:hover": {
                bgcolor: "#fb8c00",
              }
            }}
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                fullName: userData?.firstName || "",
                investorEmail: userData?.email || "",
                mobileNumber: userData?.mobileNumber || "",
              }));
              setIsModalOpen(true);
            }}
          >
            Apply for Franchise
          </Button>
        </Box>
      </Paper>

      {/* Application Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{
          width: '80%',
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3,
          borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              <DescriptionIcon sx={{ color: "#ff9800", mr: 1 }} /> Franchise Application
            </Typography>
            <IconButton onClick={handleModalClose}>
              <Close />
            </IconButton>
          </Box>

          {submitSuccess ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleOutline
                sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Application Submitted Successfully!
              </Typography>
              <Typography variant="body1">
                We'll contact you soon regarding your franchise application.
              </Typography>
              <Button
                variant="contained"
                onClick={handleModalClose}
                sx={{
                  mt: 2,
                  bgcolor: "#4caf50",
                  borderRadius: "8px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="investorEmail"
                    value={formData.investorEmail || userData?.email || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber || userData?.mobileNumber || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {(selectedBrand.personalDetails?.expansionLocation || [])
                      .length > 0 ? (
                      selectedBrand.personalDetails.expansionLocation.map(
                        (loc, i) => (
                          <MenuItem key={i} value={loc.city}>
                            {loc.city}
                          </MenuItem>
                        )
                      )
                    ) : (
                      <MenuItem value="">Not specified</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Investment Range"
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
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
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {investmentTimings.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Ready to Invest"
                    name="readyToInvest"
                    value={formData.readyToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
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
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#ff9800",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#fb8c00" },
                      borderRadius: "8px",
                      py: 1.5,
                      fontSize: "1rem",
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Modal>

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
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh'
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
              onClick={() => setCurrentImageIndex(prev => 
                prev === 0 ? allImages.length - 1 : prev - 1
              )}
            >
              <ArrowBackIcon fontSize="large" />
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
              onClick={() => setCurrentImageIndex(prev => 
                prev === allImages.length - 1 ? 0 : prev + 1
              )}
            >
              <ArrowForwardIcon fontSize="large" />
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
    </Container>
  );
};

export default BrandDetails;
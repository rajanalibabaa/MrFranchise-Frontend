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

  // Media data
  const allVideos = React.useMemo(() => 
    selectedBrand?.uploads?.franchisePromotionVideo || []
  , [selectedBrand]);

  const allImages = React.useMemo(() => [
    ...(selectedBrand?.uploads?.brandLogo ? [selectedBrand.uploads.brandLogo] : []),
    ...(selectedBrand?.uploads?.exteriorOutlet || []),
    ...(selectedBrand?.uploads?.interiorOutlet || []),
  ], [selectedBrand]);

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
  const imageBoxSize = { xs: 150, sm: 180, md: 196 }; // Fixed sizes

const getOutletRange = (value) => {
  const numericValue = Number(value);  // Ensure value is a number

  if (isNaN(numericValue) || numericValue === null) {
    return 'N/A';
  }

  if (numericValue < 10) {
    return 'Below 10';
  } else {
    const lower = Math.floor(numericValue / 10) * 10;
    const upper = lower + 10;
    return `${lower} - ${upper}`;
  }
};

  return (
    <>
    <Navbar />
    <Box sx={{
      mx: "auto",
      my: 4,
      // position: "relative",
      maxWidth: 1200,
    }}>
      {/* Brand header with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar
                src={selectedBrand.uploads?.brandLogo}
                alt={selectedBrand.brandDetails?.brandName}
                sx={{
                  width: 70,
                  height: 70,
                  // border: "2px solid #ff9800",
                  objectFit: "fit",
                  
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h5"
                // component="h1"
                sx={{
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #000 30%, #000 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {selectedBrand.brandDetails?.brandName}
              </Typography>
              <Typography variant=" body2" color="text.secondary">
                {selectedBrand.brandDetails?.tagLine}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Established Year :  {selectedBrand.franchiseDetails?.establishedYear}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                   Franchise Since Year : {selectedBrand.franchiseDetails?.franchiseSinceYear}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Category : {[ selectedBrand.franchiseDetails?.brandCategories?.child].filter(Boolean).join(" , ") || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Area Required : {selectedBrand.franchiseDetails?.fico[0]?.areaRequired || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Investment Range : {selectedBrand.franchiseDetails?.fico[0]?.investmentRange || 'N/A'}
                </Typography>
                
               <Typography variant="body2" color="text.secondary">
  Total brand outlet: {getOutletRange(selectedBrand.franchiseDetails?.totalOutlets)}
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
        <Grid display={"flex"} justifyContent={"space-evenly"} spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                width: '100vh',
                height: 400,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                // display: 'flex',
                // alignItems: 'center',
                // justifyContent: 'center',
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
                    objectFit: 'contain',
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
  <Grid >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', // Always 4 blocks
          gap: 1,
          maxWidth: '100%',
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
                // width: '0vh',
                height: imageBoxSize,
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
                  width: '30vh',
                  height: '30vh',
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
              height: imageBoxSize,
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
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
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
                  zIndex: -1,
                }}
              />
            )}
          </Box>
        </motion.div>
      </Box>
    </Grid>
        </Grid>
      </motion.div>
 <Divider sx={{ my: 5, }} />
 
      {/* Overview tab */}
      <Box mt={4} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <OverviewTab
          brand={selectedBrand}
          setIsModalOpen={setIsModalOpen}
        />
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
            <ShieldCloseIcon />
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
              onClick={() => setCurrentImageIndex(prev => 
                prev === allImages.length - 1 ? 0 : prev + 1
              )}
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
    </Box>
    <Footer />
    </>
    
  );
};

export default React.memo(BrandDetails);
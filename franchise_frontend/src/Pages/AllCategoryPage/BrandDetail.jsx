import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Drawer,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  Close,
  Description,
  Business,
  ArrowBack,
  ArrowForward,
  Phone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useBrand } from "../../Hooks/Fetchbrands.jsx";
import axios from "axios";
import OverviewTab from "./OverviewTab.jsx";
import Footer from "../../Components/Footers/Footer.jsx";
import Navbar from "../../Components/Navbar/NavBar.jsx";
// import { useToggleLike } from '../../Hooks/Fetchbrands';
import Favorite from '@mui/icons-material/Favorite';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { useToggleLike } from '../../Hooks/Fetchbrands.jsx';


const BrandDetails = ({ brandData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
const navigate = useNavigate();
  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [locationData, setLocationData] = useState({
    states: [],
    districts: [],
    cities: [],
  });

const [localIsLiked, setLocalIsLiked] = useState(brandData.isLiked);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  
  const { mutate: toggleLike } = useToggleLike();

  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    state: "",
    district: "",
    city: "",
    planToInvest: "",
    readyToInvest: "",
  });


  
  
  const { uuid } = useParams();
  // const { selectedBrand } = useSelector((state) => state.brands);
  const selectedBrand = brandData || {};
 

  // Get investor data from localStorage with caching
  const investorUUID = useMemo(() => localStorage.getItem("investorUUID"), []);
  const AccessToken = useMemo(() => localStorage.getItem("accessToken"), []);


    const handleLikeClick = useCallback(() => {
      if (isProcessingLike) return;
      
      setIsProcessingLike(true);
      const newLikeStatus = !localIsLiked;
      
      // Optimistic update
      setLocalIsLiked(newLikeStatus);
      
      toggleLike(
        { brandId: uuid, isLiked: !newLikeStatus },
        {
          onError: () => {
            // Revert on error
            setLocalIsLiked(!newLikeStatus);
          },
          onSettled: () => {
            setIsProcessingLike(false);
          }
        }
      );
    }, [uuid, localIsLiked, isProcessingLike, toggleLike]);


  // Memoized API calls
  const fetchInvestorDetails = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;
    
    try {
      const response = await axios.get(
        `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${investorUUID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          signal: AbortSignal.timeout(5000) // Add timeout
        }
      );
      
      if (response.data?.data) {
        setUserData(response.data.data);
        setFormData(prev => ({
          ...prev,
          fullName: response.data.data.firstName || "",
          investorEmail: response.data.data.email || "",
          mobileNumber: response.data.data.mobileNumber || "",
        }));
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch investor details:", error);
      }
    }
  }, [investorUUID, AccessToken]);

  // Fetch brand data with error handling
  useEffect(() => {
    if (!uuid) return;

    const controller = new AbortController();
    
    const fetchBrand = async () => {
      try {
        await useBrand(uuid).unwrap();
        // If brand is not found, redirect to brands page

      } catch (error) {
        console.error("Failed to fetch brand details:", error);
      }
    };

    fetchBrand();
    
    return () => controller.abort();
  }, [uuid,]);

  // Fetch investor data on mount if logged in (with caching)
  useEffect(() => {
    if (investorUUID && AccessToken) {
      const controller = new AbortController();
      fetchInvestorDetails();
      return () => controller.abort();
    }
  }, [fetchInvestorDetails, investorUUID, AccessToken]);

  // Extract location data from brand
  useEffect(() => {
    if (selectedBrand?.expansionLocationData?.expansionLocations?.domestic?.locations) {
      const locations = selectedBrand.expansionLocationData.expansionLocations.domestic.locations;
      const states = [...new Set(locations.map((loc) => loc.state).filter(Boolean))];
      setLocationData(prev => ({
        ...prev,
        states,
        districts: [],
        cities: [],
      }));
    }
  }, [selectedBrand]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state && selectedBrand?.expansionLocationData?.expansionLocations?.domestic?.locations) {
      const locations = selectedBrand.expansionLocationData.expansionLocations.domestic.locations;
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districts = [...new Set(stateObj?.districts?.map((d) => d.district) || [])];
      setLocationData(prev => ({
        ...prev,
        districts,
        cities: [],
      }));
      setFormData(prev => ({
        ...prev,
        district: "",
        city: "",
      }));
    }
  }, [formData.state, selectedBrand]);

  // Update cities when district changes
  useEffect(() => {
    if (formData.state && formData.district && selectedBrand?.expansionLocationData?.expansionLocations?.domestic?.locations) {
      const locations = selectedBrand.expansionLocationData.expansionLocations.domestic.locations;
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districtObj = stateObj?.districts?.find((d) => d.district === formData.district);
      const cities = [...new Set(districtObj?.cities || [])];
      setLocationData(prev => ({
        ...prev,
        cities,
      }));
      setFormData(prev => ({
        ...prev,
        city: "",
      }));
    }
  }, [formData.district, formData.state, selectedBrand]);

  // Memoized derived data for better performance
  const investmentRanges = useMemo(() => [
    ...new Set(selectedBrand?.franchiseDetails?.fico?.map((m) => m.investmentRange) || [])
  ], [selectedBrand]);

  const investmentTimings = useMemo(() => 
    ["Immediately", "1 - 3 Months", "3 - 6 Months", "6 + Months"],
    []
  );

  const readyToInvestOptions = useMemo(() => 
    ["Own Investment", "Going To Loan", "Need Loan Assistance"],
    []
  );

  const allVideos = useMemo(
    () => selectedBrand?.uploads?.franchisePromotionVideo || [],
    [selectedBrand]
  );

  const allImages = useMemo(
    () => [
      ...(selectedBrand?.uploads?.brandLogo ? [selectedBrand.uploads.brandLogo] : []),
      ...(selectedBrand?.uploads?.exteriorOutlet || []),
      ...(selectedBrand?.uploads?.interiorOutlet || []),
    ],
    [selectedBrand]
  );

  const getImageBoxSize = useCallback(() => {
    if (isMobile) return 100;
    if (isTablet) return 150;
    return 204;
  }, [isMobile, isTablet]);

  const getOutletRange = useCallback((value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return "N/A";
    if (numericValue < 10) return "Below 10";
    const lower = Math.floor(numericValue / 10) * 10;
    const upper = lower + 10;
    return `${lower} - ${upper}`;
  }, []);

  // Optimized event handlers
  const handleOpenContact = useCallback(() => setOpenContactModal(true), []);
  const handleCloseContact = useCallback(() => setOpenContactModal(false), []);

  const toggleDrawer = useCallback((open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
 const id = investorUUID || localStorage.getItem("brandUUID");

      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        return;
      }

    try {
      const payload = {
        ...formData,
        state: formData.state || "",
        district: formData.district || "",
        city: formData.city || "",
        brandId: selectedBrand?.uuid,
        brandName: selectedBrand?.brandDetails?.brandName || "",
        applyId : id || ""
      };

      const id = investorUUID || localStorage.getItem("brandUUID");

      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        navigate("/registerhandleuser");
        return;
      }

      // Validate required fields
      const requiredFields = [
        'fullName', 'investorEmail', 'mobileNumber', 'state', 
        'district', 'city', 'investmentRange', 'planToInvest', 'readyToInvest'
      ];
      
      const missingFields = requiredFields.filter(field => !payload[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill all required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log("payload :",payload)

      const response = await axios.post(
       "https://franchise-backend-wgp6.onrender.com/api/v1/instantapply/postApplication",
        payload,
        { 
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000) // Add timeout
        }
      );

      if (response.data) {
        setSubmitSuccess(true);
        setDrawerOpen(false);
      }
    } catch (error) {
      console.error("Submission error:", error?.response?.data || error.message);
      alert("❌Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedBrand, investorUUID]);

  const handleImageOpen = useCallback((index) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  }, []);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!selectedBrand) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }


  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "90%",
          maxWidth: 1200,
          mx: "auto",
          my: 4,
          px: isMobile ? 2 : 4,
        }}
      >
        {/* Floating Apply Now Button (Always Visible) */}
        <Box
          sx={{
            position: "fixed",
            bottom: isMobile ? 35 : 310,
            right: isMobile ? 0 : 20,
            left: isMobile ? 0 : "auto",
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={toggleDrawer(true)}
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              borderRadius: 50,
              px: 4,
              py: 1.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#e65100",
              },
            }}
          >
            Apply Now
          </Button>
        </Box>

        {/* Mobile/Tablet Drawer (Bottom) */}
        <Drawer
          anchor={isMobile || isTablet ? "bottom" : "right"}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: isMobile || isTablet ? 16 : 16,
              borderTopRightRadius: isMobile || isTablet ? 16 : 16,
              borderTopBottomRadius: isMobile || isTablet ? 16 : 16,
              borderBottomLeftRadius: isMobile || isTablet ? 16 : 16,
              borderBottomRightRadius: isMobile || isTablet ? 16 : 16,
              maxHeight: isMobile || isTablet ? "80vh" : "93vh",
              width: isMobile || isTablet ? "100%" : 430,
              overflow: "auto",
              mt: isMobile || isTablet ? 0 : 3,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#ff9800">
                Apply for  Franchise
              </Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <Close />
              </IconButton>
            </Box>

            <form onSubmit={handleSubmit}>
            <Grid
                spacing={2}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(1, 1fr)",
                  gap: 2,
                }}
              >           
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
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
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={
                      formData.mobileNumber || userData?.mobileNumber || ""
                    }
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                {/* State Dropdown */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  >
                    {locationData.states.map((state, i) => (
                      <MenuItem key={i} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* District Dropdown */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    disabled={!formData.state}
                  >
                    {locationData.districts.map((district, i) => (
                      <MenuItem key={i} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* City Dropdown */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    disabled={!formData.district}
                  >
                    {locationData.cities.map((city, i) => (
                      <MenuItem key={i} value={city}>
                        {city}
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
                    size="small"
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
                    size="small"
                  >
                    {readyToInvestOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
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
                      fontSize: "1rem",
                      "&:disabled": {
                        background: "#e0e0e0",
                        color: "#9e9e9e",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={24}
                          color="inherit"
                          sx={{ mr: 2 }}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Drawer>

        {/* Contact Dialog */}
        <Dialog
          open={openContactModal}
          onClose={handleCloseContact}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #000 30%, #000 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Contact Details
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>
                <strong>Manager Name:</strong>{" "}
                {selectedBrand.brandDetails?.ceoName || "N/A"}
              </Typography>

              <Typography>
                <strong>Mobile Number:</strong>{" "}
                {selectedBrand.brandDetails?.ceoMobile || "N/A"}
              </Typography>

              <Typography>
                <strong>Website:</strong>{" "}
                {selectedBrand.brandDetails?.website ? (
                  <a
                    href={selectedBrand.brandDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedBrand.brandDetails.website}
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>

              <Typography>
                <strong>Instagram:</strong>{" "}
                {selectedBrand.brandDetails?.instagram ? (
                  <a
                    href={selectedBrand.brandDetails.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedBrand.brandDetails.instagram}
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleCloseContact}
              variant="contained"
              color="error"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Brand header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            mb={3}
            gap={2}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              flexDirection={isMobile ? "column" : "row"}
              width="100%"
            >
              <Box
                position="relative"
                sx={{ border: "3px solid orange", borderRadius: "10px" }}
              >
                <Avatar
                  src={selectedBrand.uploads?.brandLogo}
                  alt={selectedBrand.brandDetails?.brandName}
                  sx={{
                    width: isMobile ? 150 : 200,
                    height: isMobile ? 150 : 200,
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box width="100%">
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection={isMobile ? "column" : "row"}
                    gap={2}
                  >
                    <Box>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          background:
                            "linear-gradient(45deg, #000 30%, #000 90%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textAlign: isMobile ? "center" : "left",
                        }}
                      >
                        {selectedBrand.brandDetails?.brandName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {selectedBrand.brandDetails?.tagLine}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: isMobile ? 1 : 6,
                          mt: 1,
                        }}
                      >
                        <Typography>
                          Established Year:{" "}
                          <label variant="body1" color="text.secondary">
                            {selectedBrand.franchiseDetails?.establishedYear ||
                              "N/A"}
                          </label>
                        </Typography>
                        <Typography>
                          Franchise Since:{" "}
                          <label variant="body1" color="text.secondary">
                            {selectedBrand.franchiseDetails
                              ?.franchiseSinceYear || "N/A"}
                          </label>
                        </Typography>
                      </Box>
                    </Box>

                     <IconButton
                                onClick={handleLikeClick}
                                disabled={isProcessingLike}
                                aria-label={localIsLiked ? "Unlike brand" : "Like brand"}
                              >
                                {isProcessingLike ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <Favorite
                                    sx={{
                                      color: localIsLiked ? "#f44336" : "rgba(0, 0, 0, 0.23)",
                                    }}
                                  />
                                )}
                              </IconButton>
                       <IconButton
                                // onClick={handleShareButton}
                              >
                                  <ShareOutlinedIcon/>
                              </IconButton>
                    <Box>
                      <Button
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        startIcon={<Phone />}
                        onClick={handleOpenContact}
                        sx={{
                          px: isMobile ? 1 : 1.5,
                          py: isMobile ? 1 : 2,
                          bgcolor: "#ff9800",
                          "&:hover": {
                            bgcolor: "#e65100",
                          },
                        }}
                      >
                        VIEW CONTACT
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#7ad03a",
                          "& td, & th": {
                            padding: isMobile ? "4px 8px" : "8px 12px",
                          },
                        }}
                      >
                        <TableCell sx={{ width: "30%", textAlign: "center" }}>
                          <strong>Category</strong>
                        </TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          <strong>Area</strong>
                        </TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          <strong>Investment</strong>
                        </TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          <strong>Total Outlets</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ width: "30%", textAlign: "center" }}>
                          {selectedBrand.franchiseDetails?.brandCategories
                            ?.child || "N/A"}
                        </TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          {selectedBrand.franchiseDetails?.fico?.[0]
                            ?.areaRequired || "N/A"}
                        </TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          {selectedBrand.franchiseDetails?.fico?.[0]
                            ?.investmentRange || "N/A"}
                        </TableCell>
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          {getOutletRange(
                            selectedBrand.franchiseDetails?.totalOutlets
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={4}
          >
            <Box flex={isMobile ? "none" : 2}>
              <Box
                sx={{
                  width: "100%",
                  height: isMobile ? 200 : 416,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
                component={motion.div}
                whileHover={{ scale: 1.01 }}
              >
                {allVideos.length > 0 ? (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
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
            </Box>

            <Box flex={1}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(2, 1fr)",
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
                        width: "100%",
                        height: getImageBoxSize(),
                        overflow: "hidden",
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f5f5f5",
                      }}
                      onClick={() => handleImageOpen(index)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
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
                      width: "100%",
                      height: getImageBoxSize(),
                      overflow: "hidden",
                      borderRadius: 2,
                      cursor: "pointer",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0,0,0,0.05)",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => {
                      setCurrentImageIndex(3);
                      setImageModalOpen(true);
                    }}
                  >
                    <Typography
                      variant={isMobile ? "body2" : "h6"}
                      sx={{ fontWeight: 600, textAlign: "center", zIndex: 1 }}
                    >
                      View More ({Math.max(allImages.length - 3, 0)}+)
                    </Typography>
                    {allImages[3] && (
                      <img
                        src={allImages[3]}
                        alt="Preview"
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.25,
                          zIndex: 0,
                        }}
                      />
                    )}
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ my: 5 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 4,
          }}
        >
          {/* Overview tab */}
          <Box sx={{ width: "100%" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <OverviewTab
                brand={selectedBrand}
                // setIsModalOpen={setIsModalOpen}
              />
            </motion.div>
          </Box>
        </Box>

        {/* Image Modal */}
        <Dialog
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "rgba(0,0,0,0.9)",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            <Typography>
              Image {currentImageIndex + 1} of {allImages.length}
            </Typography>
            <IconButton
              onClick={() => setImageModalOpen(false)}
              color="inherit"
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: isMobile ? "50vh" : "70vh",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  left: 16,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={handlePrevImage}
              >
                <ArrowBack fontSize="large" />
              </IconButton>

              <img
                src={allImages[currentImageIndex]}
                alt={`Gallery ${currentImageIndex}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />

              <IconButton
                sx={{
                  position: "absolute",
                  right: 16,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={handleNextImage}
              >
                <ArrowForward fontSize="large" />
              </IconButton>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              pb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: "100%",
                overflowX: "auto",
                px: 2,
                py: 1,
              }}
            >
              {allImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      currentImageIndex === index
                        ? "2px solid #1976d2"
                        : "1px solid #555",
                    opacity: currentImageIndex === index ? 1 : 0.7,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DialogActions>
        </Dialog>

         {/* Desktop Application Form */}
        {!isMobile && !isTablet && (
          <Box
            sx={{
              mt: 4,
              p: 4,
              borderRadius: "16px",
              background: "white",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: "#ff9800",
              }}
            >
              Instant Franchise Application
            </Typography>
            <form onSubmit={handleSubmit}>
               <Grid
                spacing={2}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={
                      formData.mobileNumber || userData?.mobileNumber || ""
                    }
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                {/* State Dropdown */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                  >
                    {locationData.states.map((state, i) => (
                      <MenuItem key={i} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* District Dropdown */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    disabled={!formData.state}
                  >
                    {locationData.districts.map((district, i) => (
                      <MenuItem key={i} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* City Dropdown */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    disabled={!formData.district}
                  >
                    {locationData.cities.map((city, i) => (
                      <MenuItem key={i} value={city}>
                        {city}
                      </MenuItem>
                    ))}
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
                    size="medium"
                  >
                    {investmentRanges.map((range, i) => (
                      <MenuItem key={i} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
              </Grid>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#ff9800",
                    py: 1.5,
                    fontSize: "1rem",
                    px: 4,
                    "&:disabled": {
                      background: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 2 }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </Box>
            </form>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "8px",
                bgcolor: "rgba(102, 126, 234, 0.05)",
                borderLeft: `4px solid rgb(84, 241, 12)`,
              }}
            >
              <Typography variant="body2">
                <strong>Note:</strong> Our team will contact you within 24 hours
                to discuss the franchise opportunity in detail.
              </Typography>
            </Box>
          </Box>
        )}              
      </Box>

      <Footer />
    </>
  );
};

export default React.memo(BrandDetails);


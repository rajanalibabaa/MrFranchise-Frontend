import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Rating,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Share,
  Description as DescriptionIcon,
  CheckCircleOutline,
  Star,
  StarBorder,
  Business as BusinessIcon,
} from "@mui/icons-material";
import OverviewTab from "./OverviewTab";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { closeBrandDialog } from "../../Redux/Slices/brandSlice.jsx";
import axios from "axios";

const BrandDetailsDialog = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { openDialog, selectedBrand } = useSelector((state) => state.brands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    franchiseModel: "",
    franchiseType: "",
    investmentRange: "",
    location: "",
    planToInvest: "",
    readyToInvest: "",
  });

  const dispatch = useDispatch();

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
        brandLogo:selectedBrand.brandDetails?.brandLogo || ""
      };
      console.log("payload", payload);
      const token = localStorage.getItem("accessToken");
      const investorUUID = localStorage.getItem("investorUUID");
      const brandUUID = localStorage.getItem("brandUUID");
      

      const id = investorUUID || brandUUID;
      console.log(id, token);

      const response = await axios.post(
        `http://localhost:5000/api/v1/instantapply/postApplication/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("status code",response.data )

      if (response.data) {
        setSubmitSuccess(true);
        setFormData({
          fullName: "",
          location: "",
          franchiseModel: "",
          franchiseType: "",
          investmentRange: "",
          planToInvest: "",
          readyToInvest: "",
        });
   
      }
    } catch (error) {
      console.error("Submission error:", error);
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
      franchiseModel: "",
      franchiseType: "",
      investmentRange: "",
      planToInvest: "",
      readyToInvest: "",
    });
    setSubmitSuccess(false);
  };

  const handleClose = () => {
    dispatch(closeBrandDialog());
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setOpenGallery(true);
  };

  if (!selectedBrand) return null;

  const allVideos = [
    ...(selectedBrand.brandDetails?.brandPromotionVideo || []),
    ...(selectedBrand.brandDetails?.franchisePromotionVideo || []),
  ];

  const allImages = [
    ...(selectedBrand.brandDetails?.brandLogo
      ? [selectedBrand.brandDetails.brandLogo]
      : []),
    ...(selectedBrand.brandDetails?.companyImage || []),
    ...(selectedBrand.brandDetails?.exterioroutlet || []),
    ...(selectedBrand.brandDetails?.interiorOutlet || []),
  ];

  return (
    <Box>
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <DialogTitle>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  <DescriptionIcon sx={{ color: "#ff9800", mr: 1 }} /> Franchise
                  Application
                </Typography>
              </Box>

              <Box>
                <IconButton onClick={handleModalClose}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
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
                  <motion.div whileHover={{ scale: 1.03 }}>
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
                  </motion.div>
                </Box>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "grid",
                    pt: 2,
                    gridTemplateColumns: "repeat(5, 1fr)",
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
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
                      value={formData.investorEmail}
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
                      value={formData.mobileNumber}
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
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Franchise Model"
                      name="franchiseModel"
                      value={formData.franchiseModel}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    >
                      {franchiseModels.map((model, i) => (
                        <MenuItem key={i} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Franchise Type"
                      name="franchiseType"
                      value={formData.franchiseType}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    >
                      {franchiseTypes.map((type, i) => (
                        <MenuItem key={i} value={type}>
                          {type}
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
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          bgcolor: "#ff9800",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "#fb8c00",
                          },
                          ml: 0,
                          borderRadius: "8px",
                          py: 1.5,
                          fontSize: "1rem",
                        }}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </form>
            )}
          </DialogContent>
        </motion.div>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            overflow: "hidden",
            background: "linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            position: "sticky",
            padding: 1,
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }} gap={2}>
            <Box
              sx={{
                position: "relative",
                mr: { sm: 3 },
                mb: { xs: 2, sm: 0 },
              }}
            >
              <img
                src={selectedBrand.brandDetails?.brandLogo}
                alt={selectedBrand.personalDetails?.brandName}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  ml: 2,
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
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                background:
                  "linear-gradient(45deg,rgb(6, 6, 6) 30%,rgb(6, 6, 6) 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedBrand.personalDetails?.brandName}

              <Box display="flex" alignItems="center" mb={1}>
                <Rating
                  value={3.5}
                  precision={0.5}
                  readOnly
                  size="medium"
                  icon={<Star fontSize="inherit" sx={{ color: "#ff9800" }} />}
                  emptyIcon={
                    <StarBorder fontSize="inherit" sx={{ color: "#e0e0e0" }} />
                  }
                />
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    color: "black",
                  }}
                >
                  (24 reviews)
                </Typography>
              </Box>
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "black",
                "&:hover": {
                  bgcolor: "rgba(11, 11, 11, 0.1)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <Typography variant="subtitle1" m={2}>
          {selectedBrand.personalDetails?.brandCategories &&
            selectedBrand.personalDetails.brandCategories.length > 0 && (
              <Box>
                {selectedBrand.personalDetails.brandCategories.map(
                  (category, index) => (
                    <Box
                      key={index}
                      sx={{ mb: 1 }}
                      display={"flex"}
                      justifyContent={"flex-start"}
                      gap={20}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        Category:{" "}
                        <label style={{ color: "#ff9800" }}>
                          {category.child}
                        </label>
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Investment Range :
                        <label style={{ color: "#ff9800" }}>
                          {selectedBrand.franchiseDetails?.modelsOfFranchise?.map(
                            (model) => model.investmentRange
                          )}
                        </label>
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Area required :
                        <label style={{ color: "#ff9800" }}>
                          {selectedBrand.franchiseDetails?.modelsOfFranchise?.map(
                            (model) => model.areaRequired
                          )}
                        </label>
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            )}
          {selectedBrand.personalDetails?.expansionLocation?.length > 0 && (
            <Typography sx={{ fontWeight: "bold" }}>
              Expansion Locations :
              <label style={{ color: "#ff9800" }}>
                {selectedBrand.personalDetails.expansionLocation.map(
                  (location) => `${location.city}, ${location.state}`
                )}
              </label>
            </Typography>
          )}
        </Typography>

        <DialogContent
          dividers
          sx={{
            display: "flex",
            p: 1,
            position: "relative",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflowY: "auto",
              maxHeight: "70vh",
            }}
          >
            <Grid
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Grid display={"flex"} flexDirection={"column"}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                ></Box>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                    <Tabs
                      value={tabIndex}
                      onChange={(e, newValue) => setTabIndex(newValue)}
                      centered
                      sx={{ mb: 2 }}
                    >
                      <Tab label="Video" />
                      <Tab label="Images" />
                    </Tabs>

                    {tabIndex === 0 ? (
                      <Box display="flex" gap={2}>
                        {allVideos.map((videoUrl, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: { xs: "100%", sm: "48%", md: "48%" },
                              height: 300,
                              borderRadius: 2,
                              overflow: "hidden",
                              backgroundColor: "#f5f5f5",
                              cursor: "pointer",
                            }}
                            onClick={() => handleMediaClick(videoUrl)}
                          >
                            <video
                              controls
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            >
                              <source src={videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {allImages.map((imageUrl, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: { xs: "100%", sm: "30%", md: "23%" },
                              height: 200,
                              borderRadius: 2,
                              overflow: "hidden",
                              backgroundColor: "#f5f5f5",
                              cursor: "pointer",
                            }}
                            onClick={() => handleMediaClick(imageUrl)}
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
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ minHeight: "300px" }}>
              <OverviewTab
                brand={selectedBrand}
                setIsModalOpen={setIsModalOpen}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            borderTop: "2px solid #4caf50",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Share sx={{ color: "#ff9800" }} />}
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": {
                borderColor: "#fb8c00",
                bgcolor: "rgba(255,152,0,0.08)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#ff9800",
              borderColor: "#ff9800",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Apply for Franchise
          </Button>
        </DialogActions>

        <Dialog
          open={openGallery}
          onClose={() => setOpenGallery(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <IconButton onClick={() => setOpenGallery(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedMedia &&
              (selectedMedia.endsWith(".mp4") ||
              selectedMedia.endsWith(".webm") ? (
                <video
                  controls
                  autoPlay
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                >
                  <source src={selectedMedia} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedMedia}
                  alt="Full view"
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              ))}
          </DialogContent>
        </Dialog>
      </Dialog>
    </Box>
  );
};

export default BrandDetailsDialog;

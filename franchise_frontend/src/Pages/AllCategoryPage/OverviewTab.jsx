import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Business,
  AttachMoney,
  Support,
  AccountTree,
  Close,
  CheckCircleOutline,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

const OverviewTab = ({ brand }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState(null);
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

  const franchiseModels = [
    ...new Set(
      brand?.franchiseDetails?.modelsOfFranchise?.map(
        (m) => m.franchiseModel
      ) || []
    ),
  ];
  
  const franchiseTypes = [
    ...new Set(
      brand?.franchiseDetails?.modelsOfFranchise?.map(
        (m) => m.franchiseType
      ) || []
    ),
  ];
  
  const investmentRanges = [
    ...new Set(
      brand?.franchiseDetails?.modelsOfFranchise?.map(
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

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setFormData((prev) => ({
      ...prev,
      franchiseModel: model.franchiseModel || prev.franchiseModel,
      franchiseType: model.franchiseType || prev.franchiseType,
      investmentRange: model.investmentRange || prev.investmentRange,
    }));
  };

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
        brandId: brand?.uuid,
        brandName: brand?.personalDetails?.brandName || "",
        brandEmail: brand.personalDetails?.email || "",
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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatList = (items) => items?.join(", ") || "Not specified";
  const toArray = (val) => (Array.isArray(val) ? val : val ? [val] : []);

  const sections = [
    {
      title: "Brand Overview",
      icon: <DescriptionIcon sx={{ color: "#ff9800" }} />,
      items: [
        { label: "Brand Name", value: brand.personalDetails?.brandName },
        {
          label: "Description",
          value: brand.personalDetails?.brandDescription,
        },
        {
          label: "Categories",
          value: brand.personalDetails?.brandCategories?.map(
            (categories, index) => (
              <Box key={index} display={"flex"} flexDirection="row" gap={1}>
                <Typography variant="body2">
                  {categories.main || "Not specified"} & {categories.child || "Not specified"} & {categories.sub || "Not specified"}
                </Typography>
              </Box>
            )
          ),
        },
      ],
    },
    {
      title: "Franchise Models",
      icon: <AccountTree sx={{ color: "#ff9800" }} />,
      content: (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TableContainer 
              component={Paper} 
              sx={{ 
                mb: 3,
                overflow: "hidden",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.1)"
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    bgcolor: "#7ad03a",
                    "& th": {
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                    }
                  }}>
                    <TableCell sx={{ width: "8%" }}>Model</TableCell>
                    <TableCell sx={{ width: "8%" }}>Type</TableCell>
                    <TableCell sx={{ width: "8%" }}>Investment</TableCell>
                    <TableCell sx={{ width: "8%" }}>Area</TableCell>
                    <TableCell sx={{ width: "8%" }}>Franchise</TableCell>
                    <TableCell sx={{ width: "8%" }}>Royalty</TableCell>
                    <TableCell sx={{ width: "8%" }}>Interior</TableCell>
                    <TableCell sx={{ width: "8%" }}>Exterior</TableCell>
                    <TableCell sx={{ width: "8%" }}>ROI</TableCell>
                    <TableCell sx={{ width: "8%" }}>BreakEven</TableCell>
                    <TableCell sx={{ width: "8%" }}>Select</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brand.franchiseDetails?.modelsOfFranchise?.map(
                    (model, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        sx={{
                          "&:hover": { backgroundColor: "#fff8e1" },
                          backgroundColor:
                            selectedModel?._id === model._id
                              ? "#fff3e0"
                              : "inherit",
                        }}
                      >
                        <TableCell>
                          {model.franchiseModel || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.franchiseType || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.investmentRange || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.areaRequired || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.franchiseFee || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.royaltyFee || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.interiorCost || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {model.exteriorCost || "Not specified"}
                        </TableCell>
                        <TableCell>{model.roi || "Not specified"}</TableCell>
                        <TableCell>
                          {model.breakEven || "Not specified"}
                        </TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleModelSelect(model)}
                              sx={{
                                color: "#ff9800",
                                minWidth: 100,
                                borderColor: "#ff9800",
                                "&:hover": {
                                  backgroundColor: "#ff9800",
                                  color: "white",
                                  borderColor: "#ff9800",
                                },
                              }}
                            >
                              {selectedModel?._id === model._id
                                ? "Selected"
                                : "Select"}
                            </Button>
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
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
                fontSize: "1rem"
              }} 
              onClick={() => setIsModalOpen(true)}
            >
              Apply for Franchise
            </Button>
          </motion.div>

          <Dialog
            open={isModalOpen}
            onClose={handleModalClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "12px",
                overflow: "hidden"
              }
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
                      <DescriptionIcon sx={{ color: "#ff9800", mr: 1 }} />{" "}
                      Franchise Application
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
                        We'll contact you soon regarding your franchise
                        application.
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
                            fontWeight: 600
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
                              fontSize: "1rem"
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
        </>
      ),
    },
    {
      title: "Company Details",
      icon: <Business sx={{ color: "#ff9800" }} />,
      items: [
        { label: "Company Name", value: brand.personalDetails?.companyName },
        {
          label: "Established Year",
          value: brand.personalDetails?.establishedYear,
        },
        {
          label: "Franchising Since",
          value: brand.personalDetails?.franchiseSinceYear,
        },
      ],
    },
    {
      title: "Franchise Details",
      icon: <AttachMoney sx={{ color: "#ff9800" }} />,
      content: (
        <motion.div>
          <TableContainer 
            component={Paper}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.1)"
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>Agreement Period</TableCell>
                  <TableCell>
                    {brand?.franchiseDetails?.agreementPeriod ||
                      "Not specified"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>companyOwned Outlets</TableCell>
                  <TableCell>
                    {brand?.franchiseDetails?.franchiseOutlets ||
                      "Not specified"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>Franchise Outlets</TableCell>
                  <TableCell>
                    {brand?.franchiseDetails?.companyOwnedOutlets ||
                      "Not specified"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      ),
    },
    {
      title: "Support & Training",
      icon: <Support sx={{ color: "#ff9800" }} />,
      items: [
        {
          label: "Training Provided By",
          value: brand.franchiseDetails?.trainingProvidedBy,
        },
        {
          label: "Requirement Support",
          value: brand.franchiseDetails?.requirementSupport,
        },
        // {
        //   label: "Expansion Locations",
        //   value: brand.personalDetails?.expansionLocation?.map(
        //     (location, index) => (
        //       <Box key={index} sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        //         <Typography>{location.city}</Typography> ,
        //         <Typography>{location.state}</Typography> ,
        //         <Typography>{location.country}</Typography>
        //       </Box>
        //     )
        //   ),
        // },
      ],
    },
  ];

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={4}
        sx={{ mt: 2 }}
      >
        <Box flex={1}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Box
                  sx={{
                    mb: 4,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    p: 3,
                    borderLeft: "4px solid #ff9800",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      color: "text.primary",
                      pb: 1,
                      borderBottom: "2px solid #ff9800",
                    }}
                  >
                    {section.icon}
                    {section.title}
                  </Typography>

                  {section.content || (
                    <TableContainer 
                      component={Paper}
                      sx={{
                        borderRadius: "8px",
                        overflow: "hidden"
                      }}
                    >
                      <Table size="medium">
                        <TableBody>
                          {section.items.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  color: "text.secondary",
                                  width: "30%",
                                  fontSize: "0.875rem"
                                }}
                              >
                                {item.label}
                              </TableCell>
                              <TableCell
                                sx={{ 
                                  color: "text.primary", 
                                  wordBreak: "break-word",
                                  fontSize: "0.875rem"
                                }}
                              >
                                {item.value || "Not specified"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default OverviewTab;
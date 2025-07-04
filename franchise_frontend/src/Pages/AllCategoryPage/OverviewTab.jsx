import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  TableHead
  
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Business,
  AttachMoney,
  Support,
  AccountTree,
  Close,
  CheckCircleOutline,
  ExpandMore,
  Star,
  LocationCity,
  CalendarToday,
  Category,
  Store,
  People,
  EmojiEvents,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

const OverviewTab = ({ brand, setIsModalOpen }) => {
  const [isModalOpen, setIsLocalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    location: "",
    planToInvest: "",
    readyToInvest: "",
  });
  const [userData, setUserData] = useState(null);

  const investorUUID = localStorage.getItem("investorUUID");
  const AccessToken = localStorage.getItem("accessToken");

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
      brand?.franchiseDetails?.fico?.map((m) => m.franchiseModel) || []
    ),
  ];

  const franchiseTypes = [
    ...new Set(
      brand?.franchiseDetails?.fico?.map((m) => m.franchiseType) || []
    ),
  ];

  const investmentRanges = [
    ...new Set(
      brand?.franchiseDetails?.fico?.map((m) => m.investmentRange) || []
    ),
  ];

  const expansionLocations =
    brand.expansionLocationData?.expansionLocations?.domestic?.cities || [];

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
        brandName: brand.brandDetails?.brandName || "",
        brandEmail: brand.brandDetails?.email || "",
      };

      const token = localStorage.getItem("accessToken");
      const investorUUID = localStorage.getItem("investorUUID");
      const brandUUID = localStorage.getItem("brandUUID");

      const id = investorUUID || brandUUID;

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
      console.error("Submission error:", error);
      alert("❌Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsLocalModalOpen(false);
    setFormData({
      fullName: "",
      location: "",
      investmentRange: "",
      planToInvest: "",
      readyToInvest: "",
    });
    setSubmitSuccess(false);
  };

  const formatCurrency = (value) => {
    if (!value) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value.replace(/[^0-9]/g, "")));
  };

  const sections = [
    {
      title: "Franchise Models",
      icon: <AccountTree sx={{ color: "#ff9800" }} />,
      content: (
        <Box>
          <TableContainer
            component={Paper}
            sx={{
              mb: 3,
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Investment</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Area</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Agreement period</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Franchise Fee</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Interior Cost </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Stock Investment</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Additional Cost</TableCell>
                                  <TableCell sx={{ fontWeight: "bold" }}>Annual Working Capital</TableCell>
                                     <TableCell sx={{ fontWeight: "bold" }}>Royalty Fee</TableCell>
                                     <TableCell sx={{ fontWeight: "bold" }}>Break Even</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>ROI</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Pay Back period</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Margin On sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brand.franchiseDetails?.fico?.map((model, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#fff8e1" },
                      backgroundColor:
                        selectedModel?._id === model._id
                          ? "#fff3e0"
                          : "inherit",
                    }}
                    onClick={() => handleModelSelect(model)}
                  >
                    <TableCell>{model.franchiseModel || "N/A"}</TableCell>
                    <TableCell>{model.franchiseType || "N/A"}</TableCell>
                    <TableCell>{model.investmentRange || "N/A"}</TableCell>
                    <TableCell>{model.areaRequired || "N/A"}</TableCell>
                      <TableCell>{model.agreementPeriod || "N/A"}</TableCell>
                      <TableCell>{model.franchiseFee || "N/A"}</TableCell>
                      <TableCell>{model.interiorCost || "N/A"}</TableCell>
                      <TableCell>{model.stockInvestment || "N/A"}</TableCell>
                      <TableCell>{model.otherCost || "N/A"}</TableCell>
                      <TableCell>{model.requireWorkingCapital || "N/A"}</TableCell>
                      <TableCell>{model.royaltyFee || "N/A"}</TableCell>
                      <TableCell>{model.breakEven || "N/A"}</TableCell>
                      <TableCell>{model.roi || "N/A"}</TableCell>
                    <TableCell>{model.payBackPeriod || "N/A"}</TableCell>
                    <TableCell>{model.marginOnSales || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 600 }}>
                Detailed Financial Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Parameter
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {brand.franchiseDetails?.fico?.map((model, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>Franchise Fee</TableCell>
                          <TableCell>{model.franchiseFee || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Interior Cost</TableCell>
                          <TableCell>{model.interiorCost || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Stock Investment</TableCell>
                          <TableCell>
                            {model.stockInvestment || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Other Costs</TableCell>
                          <TableCell>{model.otherCost || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Working Capital</TableCell>
                          <TableCell>
                            {model.requireWorkingCapital || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Royalty Fee</TableCell>
                          <TableCell>{model.royaltyFee || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Payback Period</TableCell>
                          <TableCell>{model.payBackPeriod || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Margin on Sales</TableCell>
                          <TableCell>{model.marginOnSales || "N/A"}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion> */}

          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              onClick={() => {
                setIsLocalModalOpen(true);
                if (setIsModalOpen) setIsModalOpen(true);
              }}
              sx={{
                bgcolor: "#ff9800",
                color: "white",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#fb8c00",
                },
              }}
            >
              Apply for This Model
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      title: "Franchise Details",
      icon: <AttachMoney sx={{ color: "#ff9800" }} />,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <Store sx={{ color: "#ff9800", mr: 1 }} /> Outlet Information
              </Typography>
              <List sx={{display:"flex"}}>
                <ListItem>
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText
                    primary="Company Owned Outlets"
                    secondary={
                      brand.franchiseDetails?.companyOwnedOutlets || "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Store />
                  </ListItemIcon>
                  <ListItemText
                    primary="Franchise Outlets"
                    secondary={
                      brand.franchiseDetails?.franchiseOutlets || "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEvents />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Outlets"
                    secondary={brand.franchiseDetails?.totalOutlets || "N/A"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Franchising Since"
                    secondary={
                      brand.franchiseDetails?.franchiseSinceYear || "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <Business sx={{ color: "#ff9800", mr: 1 }} /> Business Details
              </Typography>
              <List sx={{display:"flex"}}>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Agreement Period"
                    secondary={
                      brand.franchiseDetails?.fico?.[0]?.agreementPeriod
                        ? `${brand.franchiseDetails.fico[0].agreementPeriod} years`
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountTree />
                  </ListItemIcon>
                  <ListItemText
                    primary="Franchise Development"
                    secondary={
                      brand.franchiseDetails?.franchiseDevelopment || "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney />
                  </ListItemIcon>
                  <ListItemText
                    primary="Aid Financing"
                    secondary={brand.franchiseDetails?.aidFinancing || "N/A"}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      ),
    },
    {
      title: "Support & Training",
      icon: <Support sx={{ color: "#ff9800" }} />,
      content: (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Training Provided
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {brand.franchiseDetails?.trainingSupport?.map((item, index) => (
              <Chip
                key={index}
                label={item}
                variant="outlined"
                sx={{ borderColor: "#ff9800", color: "#ff9800" }}
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Unique Selling Points
          </Typography>
          <List>
            {brand.franchiseDetails?.uniqueSellingPoints?.map(
              (point, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Star sx={{ color: "#ff9800" }} />
                  </ListItemIcon>
                  <ListItemText primary={point} />
                </ListItem>
              )
            )}
          </List>
        </Box>
      ),
    },
    {
      title: "Brand Overview",
      icon: <Business sx={{ color: "#ff9800" }} />,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <Category sx={{ color: "#ff9800", mr: 1 }} /> Categories
              </Typography>
              <List sx={{display:"flex"}}>
                <ListItem>
                  <ListItemText
                    primary="Main Category"
                    secondary={
                      brand.franchiseDetails?.brandCategories?.main || "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Sub Category"
                    secondary={
                      brand.franchiseDetails?.brandCategories?.sub || "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Child Category"
                    secondary={
                      brand.franchiseDetails?.brandCategories?.child || "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <LocationCity sx={{ color: "#ff9800", mr: 1 }} /> Expansion
                Locations
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                <List dense>
                  {brand.expansionLocationData?.expansionLocations?.domestic?.cities?.map(
                    (city, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <LocationOn sx={{ color: "#ff9800" }} />
                        </ListItemIcon>
                        <ListItemText primary={city} />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderLeft: "4px solid #ff9800",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                color: "text.primary",
              }}
            >
              {section.icon}
              {section.title}
            </Typography>
            {section.content}
          </Paper>
        </Box>
      ))}

      {/* Application Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <DescriptionIcon sx={{ color: "#ff9800", mr: 1 }} /> Franchise
              Application
            </Typography>
            <IconButton onClick={handleModalClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
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
              <Grid container spacing={2} sx={{ mt: 1 }}>
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
                    value={
                      formData.mobileNumber || userData?.mobileNumber || ""
                    }
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
                    {expansionLocations.map((loc, i) => (
                      <MenuItem key={i} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OverviewTab;

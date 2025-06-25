import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  RadioGroup,
  Radio,
  Chip,
  Checkbox,
  Autocomplete,
  FormControlLabel,
  IconButton,
  Divider,
  Avatar,
  Badge,
  Tooltip,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import categories from "./BrandCategories.jsx";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';


import LanguageIcon from '@mui/icons-material/Language';
import FlagIcon from '@mui/icons-material/Flag';
import { Editor } from "@tinymce/tinymce-react";
import { width } from "@mui/system";
import { fetchPincodeDetails } from "../../../Utils/PincodeFetch.jsx";

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

const BrandDetails = ({ data = {}, errors = {}, onChange }) => {
  const [showWhatsappSnackbar, setShowWhatsappSnackbar] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  // const [phoneVerifyStatus, setPhoneVerifyStatus] = useState({
  //   mobileNumber: {
  //     loading: false,
  //     verified: false,
  //   },
  // });
    const formData = {
    companyName: "",
    brandName: "",
    brandCategories: [],
    expansionLocation: [],
    ...data,
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);

  // Updated Expansion Location State
  const [openLocationModal, setOpenLocationModal] = useState(false);
 
 useEffect(() => {
    if (data.mobileNumber?.length === 10 && !whatsappEnabled && !data.whatsappNumber) {
      setShowWhatsappSnackbar(true);
    }
  }, [data.mobileNumber, whatsappEnabled, data.whatsappNumber]);

  useEffect(()=>{
    const fetchLocationDetails = async () => {
      if(data.pincode && data.pincode.length === 6  ) {
        setLoadingPincode(true);
        setPincodeError(null);
        try {
          const locationDetails =await fetchPincodeDetails(data.pincode);
          onChange({
            state: locationDetails.state,
            city: locationDetails.city,
            district: locationDetails.district
          })
          
        } catch (error) {
          setPincodeError('Invalid Pincode or no data found');
          
        }finally{
          setLoadingPincode(false);
        }

      }
      
    };
    const timer =setTimeout(() => {
      fetchLocationDetails();
    }, 1000);
    return () => clearTimeout(timer);
  },[data.pincode]);

const handleMainCategoryChange = (e) => {
  const mainCat = e.target.value;
  setSelectedCategory({
    main: mainCat,
    sub: "",
    child: "",
    groupId: ""
  });
};

const handleSubCategoryChange = (e) => {
  const subCat = e.target.value;
  const mainCatObj = categories.find(cat => cat.name === selectedCategory.main);
  const subCatObj = mainCatObj?.children?.find(sub => sub.name === subCat);
  
  setSelectedCategory(prev => ({
    ...prev,
    sub: subCat,
    groupId: subCatObj?.groupId || "",
    child: ""
  }));
};

const handleChildCategoryChange = (e) => {
  setSelectedCategory(prev => ({
    ...prev,
    child: e.target.value
  }));
};

const handleAddCategory = () => {
  if (selectedCategory.child) {
    const isDuplicate =
      Array.isArray(data.brandCategories) &&
      data.brandCategories.some(
        (cat) =>
          cat.main === selectedCategory.main &&
          cat.sub === selectedCategory.sub &&
          cat.child === selectedCategory.child
      );

    if (!isDuplicate) {
      const updatedCategories = [
        ...(Array.isArray(data.brandCategories) ? data.brandCategories : []),
        {
          main: selectedCategory.main,
          sub: selectedCategory.sub,
          child: selectedCategory.child,
          groupId: selectedCategory.groupId
        },
      ];
      onChange({ brandCategories: updatedCategories });
      // Reset the child category selection after adding
      setSelectedCategory(prev => ({ ...prev, child: "" }));
    }
  }
};

  // OTP Verification States
  const [verificationState, setVerificationState] = useState({
    email: {
      verified: false,
      otpSent: false,
      showDialog: false,
      loading: false,
      error: null,
    },
    mobileNumber: {
      verified: false,
      otpSent: false,
      showDialog: false,
      loading: false,
      error: null,
    },
  });

  const [otpInput, setOtpInput] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  

  // Handle OTP verification dialog open/close
  const handleVerificationDialog = (field, open) => {
    setVerificationState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        showDialog: open,
        error: null,
      },
    }));
    setOtpInput("");
  };

  // Send OTP for verification
  const handleSendOtp = async (field) => {
    setVerificationState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        loading: true,
        error: null,
      },
    }));

    try {
      // Call your OTP API endpoint
      const response = await axios.post("/api/send-otp", {
        [field === "email" ? "email" : "phone"]: data[field],
        type: field,
      });

      if (response.data.success) {
        setVerificationState((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            otpSent: true,
            loading: false,
          },
        }));
        setSnackbar({
          open: true,
          message: `OTP sent successfully to your ${field}`,
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(`Error sending OTP for ${field}:`, error);
      setVerificationState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: false,
          error: error.response?.data?.message || error.message,
        },
      }));
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to send OTP",
        severity: "error",
      });
    }
  };

  // Verify the entered OTP
  const handleVerifyOtp = async (field) => {
    if (!otpInput || otpInput.length !== 6) {
      setVerificationState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error: "Please enter a valid 6-digit OTP",
        },
      }));
      return;
    }

    setVerificationState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        loading: true,
        error: null,
      },
    }));

    try {
      // Call your OTP verification API endpoint
      const response = await axios.post("/api/verify-otp", {
        [field === "email" ? "email" : "phone"]: data[field],
        otp: otpInput,
        type: field,
      });

      if (response.data.success) {
        setVerificationState((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            verified: true,
            showDialog: false,
            loading: false,
          },
        }));
        setSnackbar({
          open: true,
          message: `${
            field === "email" ? "Email" : "Mobile number"
          } verified successfully!`,
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error(`Error verifying OTP for ${field}:`, error);
      setVerificationState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: false,
          error: error.response?.data?.message || error.message,
        },
      }));
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "OTP verification failed",
        severity: "error",
      });
    }
  };

  // Resend OTP
  const handleResendOtp = (field) => {
    handleSendOtp(field);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Location card component
  const LocationCard = ({ location, onRemove }) => {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative",
          borderLeft: `4px solid ${
            location.type === "domestic" ? "#4caf50" : "#2196f3"
          }`,
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: location.type === "domestic" ? "#4caf50" : "#2196f3",
            width: 40,
            height: 40,
          }}
        >
          {location.type === "domestic" ? <LocationOnIcon /> : <PublicIcon />}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {location.city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location.type === "domestic"
              ? `${location.district}, ${location.state}, ${location.country}`
              : `${location.state}, ${location.country}`}
          </Typography>
        </Box>

        <IconButton
          size="medium"
          onClick={onRemove}
          sx={{
            color: "#757575",
            "&:hover": {
              color: "#f44336",
              backgroundColor: "rgba(244, 67, 54, 0.08)",
            },
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Paper>
    );
  };

  return (
    <Box sx={{ overflowY: "auto", ml: 32, pr: 1, mt: 0 ,maxWidth:'100%'}}>
      {/* Brand Details Section */}
      <Typography variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>
       Login Credentials 
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 0.7fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
         {/* Full Name */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={data.fullName || ""}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>
        {/* Email with Verification */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={data.email || ""}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {verificationState.email.verified ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      color="success.main"
                    >
                      <CheckCircleIcon fontSize="medium" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        Verified
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => handleVerificationDialog("email", true)}
                      disabled={!data.email || verificationState.email.loading}
                      startIcon={
                        verificationState.email.loading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <SendIcon fontSize="medium" />
                        )
                      }
                    >
                      Verify
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Mobile Number with Verification */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={data.mobileNumber || ""}
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            variant="outlined"
            size="medium"
            inputProps={{ maxLength: 10 }}
            placeholder="Enter 10 digit number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {verificationState.mobileNumber.verified ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      color="success.main"
                    >
                      <CheckCircleIcon fontSize="medium" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        Verified
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() =>
                        handleVerificationDialog("mobileNumber", true)
                      }
                      disabled={
                        !data.mobileNumber ||
                        verificationState.mobileNumber.loading
                      }
                      startIcon={
                        verificationState.mobileNumber.loading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <SendIcon fontSize="medium" />
                        )
                      }
                    >
                      Verify
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* WhatsApp Number */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="WhatsApp Number"
            name="whatsappNumber"
            value={data.whatsappNumber || ""}
            onChange={handleChange}
            error={!!errors.whatsappNumber}
            helperText={errors.whatsappNumber}
            variant="outlined"
            size="medium"
            disabled = {!whatsappEnabled}
            inputProps={{ maxLength: 10 }}
            placeholder="Enter 10 digit number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
            sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  }}
          />
        </Grid>
      </Grid>

      {/* OTP Verification Dialogs */}
      {/* Email Verification Dialog */}
      <Dialog
        open={verificationState.email.showDialog}
        onClose={() => handleVerificationDialog("email", false)}
      >
        <DialogTitle>Verify Email</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We've sent a 6-digit OTP to {data.email}
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otpInput}
              onChange={(e) =>
                setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              variant="outlined"
              size="medium"
              inputProps={{ maxLength: 6 }}
              error={!!verificationState.email.error}
              helperText={verificationState.email.error}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                onClick={() => handleResendOtp("email")}
                disabled={verificationState.email.loading}
                sx={{ color: "#ff9800" }}
              >
                {verificationState.email.loading ? "Sending..." : "Resend OTP"}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleVerifyOtp("email")}
                disabled={
                  otpInput.length !== 6 || verificationState.email.loading
                }
                startIcon={
                  verificationState.email.loading ? (
                    <CircularProgress size={14} />
                  ) : null
                }
                sx={{ bgcolor: "green" }}
              >
                {verificationState.email.loading ? "Verifying..." : "Verify"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Mobile Verification Dialog */}
      <Dialog
        open={verificationState.mobileNumber.showDialog}
        onClose={() => handleVerificationDialog("mobileNumber", false)}
      >
        <DialogTitle>Verify Mobile Number</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We've sent a 6-digit OTP to +91 {data.mobileNumber}
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otpInput}
              onChange={(e) =>
                setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              variant="outlined"
              size="medium"
              inputProps={{ maxLength: 6 }}
              error={!!verificationState.mobileNumber.error}
              helperText={verificationState.mobileNumber.error}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                onClick={() => handleResendOtp("mobileNumber")}
                disabled={verificationState.mobileNumber.loading}
                sx={{ color: "#ff9800" }}
              >
                {verificationState.mobileNumber.loading
                  ? "Sending..."
                  : "Resend OTP"}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleVerifyOtp("mobileNumber")}
                disabled={
                  otpInput.length !== 6 ||
                  verificationState.mobileNumber.loading
                }
                startIcon={
                  verificationState.mobileNumber.loading ? (
                    <CircularProgress size={14} />
                  ) : null
                }
                sx={{ bgcolor: "green" }}
              >
                {verificationState.mobileNumber.loading
                  ? "Verifying..."
                  : "Verify"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>
        Brand Details
      </Typography>

     
    
       <Grid  container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 0.7fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}> {/* Company Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.companyName}
            helperText={errors.companyName}
            required
          />
        </Grid>
        {/* Brand Name */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Brand Name"
            name="brandName"
            value={formData.brandName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.brandName}
            helperText={errors.brandName}
            required
          />
        </Grid>
        <Grid >

          <TextField
            fullWidth
            label="Tagline"
            name="Tagline"
            value={formData.Tagline || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.Tagline}
            helperText={errors.Tagline}
            required
          />

        </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Name"
            name="ceoName"
            value={data.ceoName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.ceoName}
            helperText={errors.ceoName}
            required
          />
        </Grid>
        </Grid>
        <Grid container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 0.7fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}>
          
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Email"
            name="ceoEmail"
            type="email"
            value={data.ceoEmail || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.ceoEmail}
            helperText={errors.ceoEmail}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Mobile No"
            name="ceoMobile"
            value={data.ceoMobile || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            inputProps={{ maxLength: 10 }}
            placeholder="Enter 10 digit number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
            error={!!errors.ceoMobile}
            helperText={errors.ceoMobile}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label='Office Email (Optional)'
            name="officeEmail"
            value={data.officeEmail || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.officeEmail}
            helperText={errors.officeEmail}
            required
          />

        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
           <TextField 
           fullWidth
           label='Office Mobile Number (Optional)'
           name="officeMobile"
           value={data.officeMobile || ""}
           onChange={handleChange}
           variant="outlined"
           size="medium"
           inputProps={{ maxLength: 10 }}
           placeholder="Enter 10 digit number"
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">+91</InputAdornment>
             ),
           }}
           error={!!errors.officeMobile}
           helperText={errors.officeMobile}
           required
         />
        </Grid>
        </Grid>

        
              


      <Typography variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>
Head Office Location      </Typography> 
     <Grid container spacing={2}>

          <Grid size={7.2}>
      
        
        
{/* Head Office Address */}
          <TextField
            fullWidth
            label="Head Office Address"
            name="headOfficeAddress"
            value={data.headOfficeAddress || ""}
            onChange={handleChange}
            error={!!errors.headOfficeAddress}
            helperText={errors.headOfficeAddress}
            variant="outlined"
            size="medium"
            required
          />
       
         
</Grid>

     </Grid>
  

<Grid  container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 0.7fr)", xs: "1fr" },
          gap: 2,
        }}>
       

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={data.pincode || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange({ pincode: value });
            }}
            error={!!errors.pincode || !!pincodeError}
            helperText={errors.pincode || pincodeError}
            variant="outlined"
            size="medium"
            required
            InputProps={{
              endAdornment: loadingPincode ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={2.4}>
          {/* <FormControl fullWidth error={!!errors.state}>
            <InputLabel size="medium">State</InputLabel>
            <Select
              name="state"
              value={data.state || ""}
              label="State"
              onChange={handleChange}
              variant="outlined"
              size="medium"
              required
            >
              {states.map((state) => (
                <MenuItem key={state.iso2} value={state.name}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
            {errors.state && (
              <Typography variant="caption" color="error">
                {errors.state}
              </Typography>
            )}
          </FormControl> */}
          <TextField
            fullWidth
            label="State"
            name="state"
            value={data.state || ""}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>
        
        {/* District  */}

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="District"
            name="district"
            value={data.district || ""}
            onChange={handleChange}
            error={!!errors.district}
            helperText={errors.district}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={data.city || ""}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>

        

</Grid>

<Grid  container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 0.7fr)", xs: "1fr" },
          gap: 2,
        }}>
 {/* Email */}
        


        {/* Website */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={data.website || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.website}
            helperText={errors.website}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">https://</InputAdornment>
              ),
            }}
          />
        </Grid>

          {/* Facebook */}
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Facebook"
              name="facebook"
              value={data.facebook || ""}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              error={!!errors.facebook}
              helperText={errors.facebook}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                ),
              }}
            />
          </Grid>

        {/* Instagram */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Instagram"
            name="instagram"
            value={data.instagram || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.instagram}
            helperText={errors.instagram}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

      

        {/* LinkedIn */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="LinkedIn"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.linkedin}
            helperText={errors.linkedin}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>
   </Grid>  

        

  



  {/* Communication Information Section */}
     
   
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      ></Grid>

      <Snackbar
  open={showWhatsappSnackbar}
  autoHideDuration={null}
  onClose={() => setShowWhatsappSnackbar(false)}
  anchorOrigin={{ vertical: "center", horizontal: "center" }}
  sx={{
    width: '100%',
    maxWidth: '700px',
    mb: 12
  }}
>
  <Alert
    severity="info"
    // icon={<WhatsApp fontSize="inherit" />}
    sx={{
      width: '100%',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      alignItems: 'center'
    }}
    action={
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          color="success"
          variant="contained"
          size="medium"
          onClick={() => {
            onChange({ whatsappNumber: data.mobileNumber || "" });
                  setWhatsappEnabled(false);
                  setShowWhatsappSnackbar(false);
          }}
          sx={{ borderRadius: '8px' }}
        >
          Yes
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={() => {
            setWhatsappEnabled(true); 
            setShowWhatsappSnackbar(false);
          }}
          sx={{ borderRadius: '8px' }}
        >
          No
        </Button>
      </Box>
    }
  >
    Is your WhatsApp number same as your mobile number?
  </Alert>
</Snackbar>
    </Box>
  );
};

export default BrandDetails;

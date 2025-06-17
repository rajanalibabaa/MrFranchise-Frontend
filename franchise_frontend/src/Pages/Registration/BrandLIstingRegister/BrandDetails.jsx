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
  Tooltip
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import categories from "./BrandCategories.jsx";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import LanguageIcon from '@mui/icons-material/Language';
import FlagIcon from '@mui/icons-material/Flag';
import { Editor } from "@tinymce/tinymce-react";

const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />;
const checkedIcon = <CheckBoxIcon fontSize="medium" />;

const BrandDetails = ({ data = {}, errors = {}, onChange }) => {
  const formData = {
    companyName: "",
    brandName: "",
    brandCategories: [],
    expansionLocation: [],
    ...data,
  };

  const [selectedCategory, setSelectedCategory] = useState({
    groupId: "",
    main: "",
    sub: "",
    child: "",
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);

  // Updated Expansion Location State
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [locationType, setLocationType] = useState("domestic");
  
  // Domestic Location State
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: []
  });
  
  // International Location State
  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: [],
    selectedCities: []
  });

  // Location Data
  const [statesData, setStatesData] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [internationalStates, setInternationalStates] = useState([]);
  const [internationalCities, setInternationalCities] = useState([]);
  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    cities: false,
    countries: false,
    intStates: false,
    intCities: false
  });

  // Fetch domestic data (Indian states, districts, cities)
  useEffect(() => {
    const fetchDomesticData = async () => {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setStatesData(response.data);
        setStates(
          response.data
            .map(state => ({ id: state.iso2, name: state.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error fetching domestic data:", error);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };

    fetchDomesticData();
  }, []);

  // Fetch international countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const sortedCountries = response.data.data
          .map(country => ({
            id: country.iso2,
            name: country.country
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  // Handle location type change
  const handleLocationTypeChange = (e) => {
    const type = e.target.value;
    setLocationType(type);
    // Reset selections when switching types
    if (type === "domestic") {
      setDomesticSelections({
        selectedStates: [],
        selectedDistricts: [],
        selectedCities: []
      });
    } else {
      setInternationalSelections({
        selectedCountries: [],
        selectedStates: [],
        selectedCities: []
      });
    }
  };

  // Handle domestic state selection
  const handleDomesticStateChange = (event, values) => {
    setDomesticSelections(prev => ({
      ...prev,
      selectedStates: values,
      selectedDistricts: [],
      selectedCities: []
    }));
    
    // Reset districts and cities when states change
    setDistricts([]);
    setCities([]);
  };

  // Handle domestic district selection
  const handleDomesticDistrictChange = (event, values) => {
    setDomesticSelections(prev => ({
      ...prev,
      selectedDistricts: values,
      selectedCities: []
    }));
    
    // Reset cities when districts change
    setCities([]);
  };

  // Handle domestic city selection
  const handleDomesticCityChange = (event, values) => {
    setDomesticSelections(prev => ({
      ...prev,
      selectedCities: values
    }));
  };

  // Handle international country selection
  const handleInternationalCountryChange = async (event, values) => {
    setInternationalSelections(prev => ({
      ...prev,
      selectedCountries: values,
      selectedStates: [],
      selectedCities: []
    }));
    
    // Reset states and cities when countries change
    setInternationalStates([]);
    setInternationalCities([]);
  };

  // Handle international state selection
  const handleInternationalStateChange = (event, values) => {
    setInternationalSelections(prev => ({
      ...prev,
      selectedStates: values,
      selectedCities: []
    }));
    
    // Reset cities when states change
    setInternationalCities([]);
  };

  // Handle international city selection
  const handleInternationalCityChange = (event, values) => {
    setInternationalSelections(prev => ({
      ...prev,
      selectedCities: values
    }));
  };

  // Add locations to the list
  const handleAddLocations = () => {
    if (locationType === "domestic") {
      const newLocations = [];
      
      domesticSelections.selectedStates.forEach(state => {
        const stateObj = statesData.find(s => s.name === state);
        if (stateObj) {
          domesticSelections.selectedDistricts.forEach(district => {
            const filteredCities = stateObj.cities.filter(
              city => city.district === district && 
                     domesticSelections.selectedCities.includes(city.name)
            );
            
            filteredCities.forEach(cityObj => {
              newLocations.push({
                type: "domestic",
                country: "India",
                state: state,
                district: district,
                city: cityObj.name
              });
            });
          });
        }
      });
      
      const updatedLocations = Array.isArray(data.expansionLocation)
        ? [...data.expansionLocation, ...newLocations]
        : newLocations;
      
      onChange({ expansionLocation: updatedLocations });
      
    } else {
      const newLocations = [];
      
      internationalSelections.selectedCountries.forEach(country => {
        internationalSelections.selectedStates.forEach(state => {
          internationalSelections.selectedCities.forEach(city => {
            newLocations.push({
              type: "international",
              country: country,
              state: state,
              city: city
            });
          });
        });
      });
      
      const updatedLocations = Array.isArray(data.expansionLocation)
        ? [...data.expansionLocation, ...newLocations]
        : newLocations;
      
      onChange({ expansionLocation: updatedLocations });
    }
    
    // Reset selections
    if (locationType === "domestic") {
      setDomesticSelections({
        selectedStates: [],
        selectedDistricts: [],
        selectedCities: []
      });
    } else {
      setInternationalSelections({
        selectedCountries: [],
        selectedStates: [],
        selectedCities: []
      });
    }
    
    setOpenLocationModal(false);
  };

  // Remove location from list
  const handleRemoveLocation = (index) => {
    const updatedLocations = [...data.expansionLocation];
    updatedLocations.splice(index, 1);
    onChange({ expansionLocation: updatedLocations });
  };

  const handleCategoryHover = (level, value) => {
    if (level === "main") {
      setSelectedCategory({ main: value, sub: "", child: "", groupId: "" });
    } else if (level === "sub") {
      const mainCat = categories.find(
        (cat) => cat.name === selectedCategory.main
      );
      const subCat = mainCat?.children?.find((sub) => sub.name === value);
      setSelectedCategory((prev) => ({
        ...prev,
        sub: value,
        groupId: subCat?.groupId || "",
        child: "",
      }));
    } else if (level === "child") {
      setSelectedCategory((prev) => ({
        ...prev,
        child: value,
      }));
    }
  };

  const handleAddCategory = () => {
    if (selectedCategory.child) {
      const isDuplicate =
        Array.isArray(data.brandCategories) &&
        data.brandCategories.some(
          (cat) =>
            cat.main === selectedCategory.main &&
            cat.sub === selectedCategory.sub &&
            cat.child === selectedCategory.child &&
            cat.groupId === selectedCategory.groupId
        );

      if (!isDuplicate) {
        const updatedCategories = [
          ...(Array.isArray(data.brandCategories) ? data.brandCategories : []),
          {
            main: selectedCategory.main,
            sub: selectedCategory.sub,
            child: selectedCategory.child,
            groupId: selectedCategory.groupId,
          },
        ];
        onChange({ brandCategories: updatedCategories });
        setSelectedCategory((prev) => ({ ...prev, child: "" }));
      }
    }
  };

  useEffect(() => {
    if (selectedCategory.child) {
      handleAddCategory();
    }
  }, [selectedCategory.child]);

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


 // Add this to your existing state declarations
const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
const [description, setDescription] = useState(data.description || "");

// Add this handler function
const handleDescriptionChange = (content) => {
  setDescription(content);
  onChange({ description: content }); // Update the parent form data
};

  // Location card component
  const LocationCard = ({ location, onRemove }) => {
    return (
      <Paper 
        elevation={2} 
        sx={{
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'relative',
          borderLeft: `4px solid ${location.type === 'domestic' ? '#4caf50' : '#2196f3'}`,
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Avatar sx={{ 
          bgcolor: location.type === 'domestic' ? '#4caf50' : '#2196f3',
          width: 40, 
          height: 40 
        }}>
          {location.type === 'domestic' ? <LocationOnIcon /> : <PublicIcon />}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {location.city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location.type === 'domestic' 
              ? `${location.district}, ${location.state}, ${location.country}`
              : `${location.state}, ${location.country}`}
          </Typography>
        </Box>
        
        <IconButton 
          size="medium" 
          onClick={onRemove}
          sx={{
            color: '#757575',
            '&:hover': {
              color: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.08)'
            }
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Paper>
    );
  };

  

  return (
    <Box sx={{ overflowY: "auto", pr: 1, mt: 0 }}>
      {/* Brand Details Section */}
      <Typography variant="h6" sx={{ mb: 1, color: "#ff9800" }}>
        Personal Details
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
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

  {/* Communication Information Section */}
      <Typography variant="h6" sx={{ mb: 3, color: "#ff9800" }}>
        Communication Information
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
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

        {/* Email */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Secondary Email"
            name="secondaryEmail"
            type="secondaryEmail"
            value={data.secondaryEmail || ""}
            onChange={handleChange}
            error={!!errors.secondaryEmail}
            helperText={errors.secondaryEmail}
            variant="outlined"
            size="medium"
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
            inputProps={{ maxLength: 10 }}
            placeholder="Enter 10 digit number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
          />
        </Grid>

{/* Head Office Address */}
        <Grid item xs={12} sm={6} md={2.4}>
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

        {/* Pincode */}
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
          <FormControl fullWidth error={!!errors.state}>
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
          </FormControl>
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

      {/* Social Media Section */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4, color: "#ff9800" }}>
        Social Media & Web Presence
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      >
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

        {/* Brand Description Modal */}
<Dialog
  open={descriptionModalOpen}
  onClose={() => setDescriptionModalOpen(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden'
    }
  }}
>
  <DialogTitle sx={{ 
    bgcolor: '#f5f7fa',
    borderBottom: '1px solid #e0e3e7',
    py: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LanguageIcon color="primary" sx={{ mr: 1.5 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Brand Description
      </Typography>
    </Box>
    <IconButton 
      onClick={() => setDescriptionModalOpen(false)}
      sx={{ color: '#6b778c' }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  
  <DialogContent sx={{ py: 3, px: 3 }}>
    <Box sx={{ mt: 2 }}>
      <Editor
        apiKey="ax88nfnpet4akyi1bpe4gmsnhxabsp2ia0qoitvfd4qjki8v"
        value={description}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help | image",
          images_upload_url: '/api/upload-image', // Add your image upload endpoint
          automatic_uploads: true,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={handleDescriptionChange}
      />
    </Box>
  </DialogContent>
  
  <DialogActions sx={{ 
    px: 3, 
    py: 2,
    borderTop: '1px solid #e0e3e7',
    bgcolor: '#f5f7fa'
  }}>
    <Button 
      onClick={() => setDescriptionModalOpen(false)}
      variant="outlined"
      sx={{
        color: '#6b778c',
        borderColor: '#e0e3e7',
        '&:hover': {
          borderColor: '#b0bec5'
        },
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 1
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        onChange({ description });
        setDescriptionModalOpen(false);
      }}
      variant="contained"
      sx={{
        bgcolor: '#4caf50',
        '&:hover': {
          bgcolor: '#43a047'
        },
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 1
      }}
    >
      Save Description
    </Button>
  </DialogActions>
</Dialog>

    
      </Grid>
      <Typography variant="h6" sx={{ mb: 1, color: "#ff9800" }}>
        Brand Details
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      >
        {/* Company Name */}
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
            label="Manager Name"
            name="managerName"
            value={data.managerName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.managerName}
            helperText={errors.managerName}
          />
        </Grid>
        {/* Established Year */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.establishedYear}>
            <InputLabel size="medium">Established Year</InputLabel>
            <Select
              name="establishedYear"
              value={data.establishedYear || ""}
              label="Established Year"
              onChange={handleChange}
              variant="outlined"
              size="medium"
              required
            >
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.establishedYear && (
              <Typography variant="caption" color="error">
                {errors.establishedYear}
              </Typography>
            )}
          </FormControl>
        </Grid>
        {/* Franchise Since Year */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.franchiseSinceYear}>
            <InputLabel size="medium">Franchise Since Year</InputLabel>
            <Select
              name="franchiseSinceYear"
              value={data.franchiseSinceYear || ""}
              label="Franchise Since Year"
              onChange={handleChange}
              variant="outlined"
              size="medium"
              required
            >
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.franchiseSinceYear && (
              <Typography variant="caption" color="error">
                {errors.franchiseSinceYear}
              </Typography>
            )}
          </FormControl>
        </Grid>
{/* Enhanced Expansion Location Section */}
<Grid item xs={12}>
  <Box>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setOpenLocationModal(true)}
      sx={{
        bgcolor: '#ff9800',
        '&:hover': { bgcolor: '#fb8c00' },
        boxShadow: 'none',
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 1
      }}
    >
      Add Expansion Locations
    </Button>
    {errors.expansionLocation && (
      <Typography variant="caption" color="error" sx={{ ml: 1 }}>
        {errors.expansionLocation}
      </Typography>
    )}

    {/* Selected Locations Preview */}
    {data.expansionLocation?.length > 0 && (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Selected Expansion Locations ({data.expansionLocation.length})
        </Typography>
        
        {/* Location Chips */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 1,
          mb: 2,
          p: 1.5,
          border: '1px solid #e0e3e7',
          borderRadius: 1,
          minHeight: 60,
          bgcolor: '#f9fafc'
        }}>
          {data.expansionLocation.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No locations selected yet
            </Typography>
          ) : (
            data.expansionLocation.map((loc, index) => (
              <Chip
                key={index}
                label={
                  loc.type === 'domestic' 
                    ? `${loc.city}, ${loc.state}`
                    : `${loc.city}, ${loc.country}`
                }
                onDelete={() => handleRemoveLocation(index)}
                color={loc.type === 'domestic' ? 'primary' : 'secondary'}
                variant="outlined"
                size="medium"
                avatar={
                  <Avatar sx={{ 
                    bgcolor: loc.type === 'domestic' ? '#e3f2fd' : '#f3e5f5',
                    width: 24, 
                    height: 24 
                  }}>
                    {loc.type === 'domestic' ? 
                      <LocationOnIcon fontSize="medium" color="primary" /> : 
                      <PublicIcon fontSize="medium" color="secondary" />
                    }
                  </Avatar>
                }
                sx={{
                  '& .MuiChip-deleteIcon': {
                    color: loc.type === 'domestic' ? '#1976d2' : '#9c27b0'
                  }
                }}
              />
            ))
          )}
        </Box>
      </Box>
    )}
  </Box>

  {/* Expansion Location Modal */}
  <Dialog
    open={openLocationModal}
    onClose={() => setOpenLocationModal(false)}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden'
      }
    }}
  >
    <DialogTitle sx={{ 
      bgcolor: '#f5f7fa',
      borderBottom: '1px solid #e0e3e7',
      py: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LanguageIcon color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Expansion Locations
        </Typography>
      </Box>
      <IconButton 
        onClick={() => setOpenLocationModal(false)}
        sx={{ color: '#6b778c' }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    
    <DialogContent sx={{ py: 3, px: 3 }}>
      <Box>
        {/* Location Type Toggle */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: 3
        }}>
          <Paper 
            elevation={0}
            sx={{
              display: 'flex',
              borderRadius: 2,
              border: '1px solid #e0e3e7',
              overflow: 'hidden'
            }}
          >
            <Button
              variant={locationType === "domestic" ? "contained" : "text"}
              onClick={() => handleLocationTypeChange({ target: { value: "domestic" }})}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 500,
                bgcolor: locationType === "domestic" ? '#4caf50' : 'transparent',
                color: locationType === "domestic" ? '#fff' : '#6b778c',
                '&:hover': {
                  bgcolor: locationType === "domestic" ? '#43a047' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
              startIcon={<LocationOnIcon />}
            >
              Domestic (India)
            </Button>
            
            <Divider orientation="vertical" flexItem />
            
            <Button
              variant={locationType === "international" ? "contained" : "text"}
              onClick={() => handleLocationTypeChange({ target: { value: "international" }})}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: 500,
                bgcolor: locationType === "international" ? '#2196f3' : 'transparent',
                color: locationType === "international" ? '#fff' : '#6b778c',
                '&:hover': {
                  bgcolor: locationType === "international" ? '#1976d2' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
              startIcon={<PublicIcon />}
            >
              International
            </Button>
          </Paper>
        </Box>

        {/* Current Selections Preview */}
        {(locationType === "domestic" 
          ? domesticSelections.selectedStates.length > 0 
          : internationalSelections.selectedCountries.length > 0) && (
          <Box sx={{ 
            mb: 3,
            p: 2,
            border: '1px dashed #e0e3e7',
            borderRadius: 1,
            bgcolor: '#f9fafc'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Current Selection
            </Typography>
            
            {locationType === "domestic" ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {domesticSelections.selectedStates.length > 0 && (
                  <Chip 
                    label={`${domesticSelections.selectedStates.length} States`}
                    color="primary"
                    size="medium"
                    variant="outlined"
                  />
                )}
                {domesticSelections.selectedDistricts.length > 0 && (
                  <Chip 
                    label={`${domesticSelections.selectedDistricts.length} Districts`}
                    color="primary"
                    size="medium"
                    variant="outlined"
                  />
                )}
                {domesticSelections.selectedCities.length > 0 && (
                  <Chip 
                    label={`${domesticSelections.selectedCities.length} Cities`}
                    color="primary"
                    size="medium"
                    variant="outlined"
                  />
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {internationalSelections.selectedCountries.length > 0 && (
                  <Chip 
                    label={`${internationalSelections.selectedCountries.length} Countries`}
                    color="secondary"
                    size="medium"
                    variant="outlined"
                  />
                )}
                {internationalSelections.selectedStates.length > 0 && (
                  <Chip 
                    label={`${internationalSelections.selectedStates.length} States`}
                    color="secondary"
                    size="medium"
                    variant="outlined"
                  />
                )}
                {internationalSelections.selectedCities.length > 0 && (
                  <Chip 
                    label={`${internationalSelections.selectedCities.length} Cities`}
                    color="secondary"
                    size="medium"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Box>
        )}

        {/* Domestic Location Form */}
        {locationType === "domestic" ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { md: 'repeat(3, 1fr)', xs: '1fr' },
            gap: 3,
            p: 3,
            border: '1px solid #e0e3e7',
            borderRadius: 2,
            bgcolor: '#f9fafc'
          }}>
            {/* States Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                States ({states.length})
              </Typography>
              <Box sx={{ 
                height: 300,
                overflowY: 'auto',
                p: 1,
                border: '1px solid #e0e3e7',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}>
                <List dense>
                  {states.map((state) => (
                    <ListItem key={state.id} disablePadding>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={domesticSelections.selectedStates.includes(state.name)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setDomesticSelections(prev => ({
                                ...prev,
                                selectedStates: isChecked 
                                  ? [...prev.selectedStates, state.name]
                                  : prev.selectedStates.filter(s => s !== state.name),
                                selectedDistricts: [],
                                selectedCities: []
                              }));
                            }}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="medium" color="primary" sx={{ mr: 1 }} />
                            {state.name}
                          </Box>
                        }
                        sx={{
                          width: '100%',
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            flexGrow: 1
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            {/* Districts Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Districts (
                {domesticSelections.selectedStates.length > 0 
                  ? domesticSelections.selectedStates.flatMap(state => {
                      const stateObj = statesData.find(s => s.name === state);
                      return stateObj ? stateObj.districts : [];
                    }).length
                  : 0}
                )
              </Typography>
              {domesticSelections.selectedStates.length > 0 ? (
                <Box sx={{ 
                  height: 300,
                  overflowY: 'auto',
                  p: 1,
                  border: '1px solid #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <List dense>
                    {domesticSelections.selectedStates.flatMap(state => {
                      const stateObj = statesData.find(s => s.name === state);
                      return stateObj ? stateObj.districts : [];
                    }).map(district => (
                      <ListItem key={district} disablePadding>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={domesticSelections.selectedDistricts.includes(district)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setDomesticSelections(prev => ({
                                  ...prev,
                                  selectedDistricts: isChecked 
                                    ? [...prev.selectedDistricts, district]
                                    : prev.selectedDistricts.filter(d => d !== district),
                                  selectedCities: []
                                }));
                              }}
                              color="primary"
                            />
                          }
                          label={district}
                          sx={{
                            width: '100%',
                            m: 0
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ 
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Select states to see districts
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Cities Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Cities (
                {domesticSelections.selectedDistricts.length > 0 
                  ? domesticSelections.selectedStates.flatMap(state => {
                      const stateObj = statesData.find(s => s.name === state);
                      if (!stateObj) return [];
                      
                      return domesticSelections.selectedDistricts.flatMap(district => {
                        return stateObj.cities
                          .filter(city => city.district === district)
                          .map(city => city.name);
                      });
                    }).length
                  : 0}
                )
              </Typography>
              {domesticSelections.selectedDistricts.length > 0 ? (
                <Box sx={{ 
                  height: 300,
                  overflowY: 'auto',
                  p: 1,
                  border: '1px solid #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <List dense>
                    {domesticSelections.selectedStates.flatMap(state => {
                      const stateObj = statesData.find(s => s.name === state);
                      if (!stateObj) return [];
                      
                      return domesticSelections.selectedDistricts.flatMap(district => {
                        return stateObj.cities
                          .filter(city => city.district === district)
                          .map(city => city.name);
                      });
                    }).map(city => (
                      <ListItem key={city} disablePadding>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={domesticSelections.selectedCities.includes(city)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setDomesticSelections(prev => ({
                                  ...prev,
                                  selectedCities: isChecked 
                                    ? [...prev.selectedCities, city]
                                    : prev.selectedCities.filter(c => c !== city)
                                }));
                              }}
                              color="primary"
                            />
                          }
                          label={city}
                          sx={{
                            width: '100%',
                            m: 0
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ 
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {domesticSelections.selectedStates.length > 0
                      ? 'Select districts to see cities'
                      : 'Select states and districts first'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          /* International Location Form */
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { md: 'repeat(3, 1fr)', xs: '1fr' },
            gap: 3,
            p: 3,
            border: '1px solid #e0e3e7',
            borderRadius: 2,
            bgcolor: '#f9fafc'
          }}>
            {/* Countries Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Countries ({countries.length})
              </Typography>
              <Box sx={{ 
                height: 300,
                overflowY: 'auto',
                p: 1,
                border: '1px solid #e0e3e7',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}>
                <List dense>
                  {countries.map(country => (
                    <ListItem key={country.id} disablePadding>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={internationalSelections.selectedCountries.includes(country.name)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setInternationalSelections(prev => ({
                                ...prev,
                                selectedCountries: isChecked 
                                  ? [...prev.selectedCountries, country.name]
                                  : prev.selectedCountries.filter(c => c !== country.name),
                                selectedStates: [],
                                selectedCities: []
                              }));
                            }}
                            color="secondary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PublicIcon fontSize="medium" color="secondary" sx={{ mr: 1 }} />
                            {country.name}
                          </Box>
                        }
                        sx={{
                          width: '100%',
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            flexGrow: 1
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            {/* States Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                States/Provinces (
                {internationalSelections.selectedCountries.length > 0 
                  ? internationalStates.length
                  : 0}
                )
              </Typography>
              {internationalSelections.selectedCountries.length > 0 ? (
                <Box sx={{ 
                  height: 300,
                  overflowY: 'auto',
                  p: 1,
                  border: '1px solid #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <List dense>
                    {internationalStates.map(state => (
                      <ListItem key={state.id} disablePadding>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={internationalSelections.selectedStates.includes(state.name)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setInternationalSelections(prev => ({
                                  ...prev,
                                  selectedStates: isChecked 
                                    ? [...prev.selectedStates, state.name]
                                    : prev.selectedStates.filter(s => s !== state.name),
                                  selectedCities: []
                                }));
                              }}
                              color="secondary"
                            />
                          }
                          label={state.name}
                          sx={{
                            width: '100%',
                            m: 0
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ 
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Select countries to see states
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Cities Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Cities (
                {internationalSelections.selectedStates.length > 0 
                  ? internationalCities.length
                  : 0}
                )
              </Typography>
              {internationalSelections.selectedStates.length > 0 ? (
                <Box sx={{ 
                  height: 300,
                  overflowY: 'auto',
                  p: 1,
                  border: '1px solid #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <List dense>
                    {internationalCities.map(city => (
                      <ListItem key={city} disablePadding>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={internationalSelections.selectedCities.includes(city)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setInternationalSelections(prev => ({
                                  ...prev,
                                  selectedCities: isChecked 
                                    ? [...prev.selectedCities, city]
                                    : prev.selectedCities.filter(c => c !== city)
                                }));
                              }}
                              color="secondary"
                            />
                          }
                          label={city}
                          sx={{
                            width: '100%',
                            m: 0
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ 
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #e0e3e7',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {internationalSelections.selectedCountries.length > 0
                      ? 'Select states to see cities'
                      : 'Select countries and states first'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </DialogContent>
    
    <DialogActions sx={{ 
      px: 3, 
      py: 2,
      borderTop: '1px solid #e0e3e7',
      bgcolor: '#f5f7fa'
    }}>
      <Button 
        onClick={() => setOpenLocationModal(false)}
        variant="outlined"
        sx={{
          color: '#6b778c',
          borderColor: '#e0e3e7',
          '&:hover': {
            borderColor: '#b0bec5'
          },
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 1
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleAddLocations}
        disabled={
          locationType === "domestic"
            ? domesticSelections.selectedCities.length === 0
            : internationalSelections.selectedCities.length === 0
        }
        variant="contained"
        sx={{
          bgcolor: '#4caf50',
          '&:hover': {
            bgcolor: '#43a047'
          },
          '&:disabled': {
            bgcolor: '#e8f5e9',
            color: '#a5d6a7'
          },
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 1
        }}
      >
        Add Selected Locations
      </Button>
    </DialogActions>
  </Dialog>
</Grid>

<Grid item xs={12}>
  <Box>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setDescriptionModalOpen(true)}
      sx={{
        bgcolor: '#ff9800',
        '&:hover': { bgcolor: '#fb8c00' },
        boxShadow: 'none',
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 1
      }}
    >
      Add Brand Description
    </Button>
    {errors.description && (
      <Typography variant="caption" color="error" sx={{ ml: 1 }}>
        {errors.description}
      </Typography>
    )}
    
    {/* Preview of the description (first 100 characters) */}
    {description && (
      <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e3e7', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Description Preview
        </Typography>
        <div dangerouslySetInnerHTML={{ 
          __html: description.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description 
        }} />
      </Box>
    )}
  </Box>
</Grid>

        
      </Grid>

    
    </Box>
  );
};

export default BrandDetails;
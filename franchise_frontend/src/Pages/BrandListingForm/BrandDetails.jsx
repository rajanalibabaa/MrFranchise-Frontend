import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Grid,
  Button,
  InputAdornment,
  Chip,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import { categories } from "./BrandCategories";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BrandDetails = ({ data = {}, onChange, errors = {} }) => {
  const {
    brandName = '',
    companyName = '',
    phoneCode = '+91' // Default to India's code
  } = data;

  const [isVerifyingGST, setIsVerifyingGST] = useState(false);
  const [gstError, setGstError] = useState('');
  
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  
  const countries = [
    { name: "United States", code: "US", phoneCode: "+1" },
    { name: "India", code: "IN", phoneCode: "+91" },
    { name: "United Kingdom", code: "GB", phoneCode: "+44" },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);

  // OTP Verification State
  const [otpModal, setOtpModal] = useState({
    open: false, 
    type: null, 
    otp: "", 
    loading: false, 
    verified: false
  });
  
  const [otpStates, setOtpStates] = useState({ 
    email: {sent: false, token: "", verified: false, loading: false}, 
    mobile: { sent: false, token: "", verified: false, loading: false}, 
    whatsapp: { sent: false, token: "", verified: false, loading: false}
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  // Helper functions
  const openOtpModal = (type) => {
    setOtpModal({
      open: true,
      type,
      otp: "",
      loading: false,
      verified: otpStates[type]?.verified || false
    });
  };

  const closeOtpModal = () => {
    setOtpModal({
      open: false,
      type: null,
      otp: "",
      loading: false,
      verified: false
    });
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // OTP Functions
  const sendOtp = async (type) => {
    let endpoint = "";
    let payload = {};
    let fieldName = "";
    let fieldValue = "";

    if (type === "email") {
      fieldName = "email";
      fieldValue = data.email;
      endpoint = "http://localhost:5000/api/v1/otpverify/send-otp-email";
      payload = { email: data.email, type: "email" };
    } else if (type === "mobile") {
      fieldName = "mobileNumber";
      fieldValue = data.mobileNumber;
      endpoint = "http://localhost:5000/api/v1/otpverify/send-otp-mobile";
      payload = { mobile: `${phoneCode}${data.mobileNumber}`, type: "mobile" };
    } else if (type === "whatsapp") {
      fieldName = "whatsappNumber";
      fieldValue = data.whatsappNumber;
      endpoint = "http://localhost:5000/api/v1/otpverify/send-otp-whatsapp";
      payload = { mobile: `${phoneCode}${data.whatsappNumber}`, type: "whatsapp" };
    }

    // Basic validation
    if (!fieldValue) {
      showSnackbar(`Please enter a valid ${type}`, "error");
      return;
    }

    if ((type === "mobile" || type === "whatsapp") && fieldValue.length !== 10) {
      showSnackbar(`Please enter a valid 10-digit ${type} number`, "error");
      return;
    }

    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }

    setOtpStates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        loading: true,
        error: false
      }
    }));

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 && response.data.message) {
        showSnackbar(`OTP sent to your ${type} successfully!`, "success");
        setOtpStates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            sent: true,
            loading: false,
            token: response.data.token || ""
          }
        }));
        openOtpModal(type);
      } else {
        throw new Error(response.data.message || `Failed to send ${type} OTP`);
      }
    } catch (error) {
      console.error(`Error sending ${type} OTP:`, error);
      showSnackbar(
        error.response?.data?.message ||
        `Failed to send ${type} OTP. Please try again.`,
        "error"
      );
      setOtpStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          error: true
        }
      }));
    }
  };

  const verifyOtp = async () => {
    const { type, otp } = otpModal;

    if (!otp || otp.length !== 6) {
      showSnackbar("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setOtpModal(prev => ({ ...prev, loading: true }));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otpverify/verify-otp",
        {
          identifier: type === "email" 
            ? data.email 
            : `${phoneCode}${data[type === "mobile" ? "mobileNumber" : "whatsappNumber"]}`,
          otp,
          type
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${otpStates[type].token}`
          }
        }
      );

      if (response.status === 200 && response.data.message) {
        showSnackbar(`${type} verified successfully!`, "success");
        setOtpStates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            verified: true,
            loading: false
          }
        }));
        
        // Update the parent form state
        if (type === "email") {
          onChange("emailVerified", true);
          onChange("verifiedEmail", data.email);
        } else if (type === "mobile") {
          onChange("mobileVerified", true);
          onChange("verifiedMobileNumber", data.mobileNumber);
        } else if (type === "whatsapp") {
          onChange("whatsappVerified", true);
          onChange("verifiedWhatsappNumber", data.whatsappNumber);
        }
        
        setOtpModal(prev => ({ ...prev, open: false, loading: false, verified: true }));
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showSnackbar(
        error.response?.data?.message || 
        "Invalid OTP. Please try again.",
        "error"
      );
      setOtpModal(prev => ({ ...prev, loading: false }));
    }
  };

  // GST Validation function
  const validateGSTIN = (gstin) => {
    if (!gstin) {
      return "GSTIN is required";
    }
    if (gstin.length !== 15) {
      return "GSTIN must be 15 characters";
    }
    if (!/^[0-9A-Z]{15}$/.test(gstin)) {
      return "Invalid GSTIN format";
    }
    return null;
  };

  const handleVerifyGSTIN = async () => {
    const validationError = validateGSTIN(data.gstin);
    if (validationError) {
      setGstError(validationError);
      return;
    }

    setIsVerifyingGST(true);
    setGstError('');

    try {
      const response = await axios.get('https://api.bulkpe.in/gst-verification', {
        params: {
          gstin: data.gstin,
          api_key: process.env.REACT_APP_GST_API_KEY
        }
      });

      if (response.data.valid) {
        onChange("gstVerified", true);
        onChange("gstDetails", response.data.details);
        setGstError(''); // Clear any previous errors
      } else {
        setGstError('GSTIN verification failed - Invalid number');
      }
    } catch (error) {
      console.error('GST verification failed:', error);
      setGstError('Verification service unavailable. Please try again later.');
    } finally {
      setIsVerifyingGST(false);
    }
  };

  // Category selection functions
  const handleCategorySelection = (category, subCategory, childCategory) => {
    const fullPath = `${category} > ${subCategory} > ${childCategory}`;
    setSelectedCategory(fullPath);
    setDropdownOpen(false);
  };

  const handleAddCategory = () => {
    if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
      const updatedCategories = [...selectedCategories, selectedCategory];
      setSelectedCategories(updatedCategories);
      onChange("categories", updatedCategories);
      setSelectedCategory("");
    }
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = selectedCategories.filter((_, i) => i !== index);
    setSelectedCategories(updatedCategories);
    onChange("categories", updatedCategories);
  };

  const handleCountryChange = (event) => {
    const selectedCountry = countries.find(
      (country) => country.name === event.target.value
    );
    onChange("country", selectedCountry.name);
    onChange("countryCode", selectedCountry.code);
    onChange("phoneCode", selectedCountry.phoneCode);

    // Reset location-related fields when country changes
    onChange("state", "");
    onChange("city", "");
    onChange("location", "");
  };

  // Location auto-fill
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

 useEffect(() => {
  const fetchLocation = async (pincode) => {
    setIsFetchingLocation(true);
    setLocationError(null);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const locationData = await response.json();
      
      // Check if the API returned valid data
      if (locationData[0]?.Status !== "Success") {
        throw new Error(locationData[0]?.Message || "Invalid pincode");
      }

      // Get the first post office entry (you might want to handle multiple entries differently)
      const postOffice = locationData[0]?.PostOffice?.[0];
      
      if (postOffice) {
        onChange("state", postOffice.State || "");
        onChange("city", postOffice.District || postOffice.Name || "");
        onChange("address", 
          [postOffice.Name, postOffice.District, postOffice.State]
            .filter(Boolean)
            .join(", ")
        );
      } else {
        throw new Error("No location data found for this pincode");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationError(
        error.message || "Could not auto-fill location. Please enter manually."
      );
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Only fetch if pincode is valid length and in India
  if (data.pincode && data.pincode.length >= 4 && data.countryCode === "IN") {
    const debounceTimer = setTimeout(() => {
      fetchLocation(data.pincode);
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }
}, [data.pincode, data.countryCode]);

  return (
    <>
      <Grid container spacing={2} sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {/* Company Name */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Company Name"
            value={companyName}
            onChange={(e) => onChange("companyName", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.companyName}
            helperText={errors?.companyName || "Legal name of your company"}
          />
        </Grid>

        {/* Brand Name */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Brand Name"
            value={brandName}
            onChange={(e) => onChange("brandName", e.target.value)}
            fullWidth
            size="small"
            error={!!errors.brandName}
            helperText={errors.brandName}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            fullWidth
            size="small"
            error={!!errors.description}
            helperText={errors?.description}
          />
        </Grid>

        {/* GSTIN */}
        <Grid item xs={12} md={6}>
          <TextField
            label="GSTIN"
            value={data.gstin || ''}
            onChange={(e) => {
              const newValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
              onChange("gstin", newValue);
              
              // Clear verification if GSTIN changes
              if (data.gstVerified && newValue !== data.gstin) {
                onChange("gstVerified", false);
              }
              
              // Validate on change but don't show error until blurred
              if (errors.gstin) {
                const validationError = validateGSTIN(newValue);
                if (!validationError) {
                  delete errors.gstin;
                }
              }
            }}
            onBlur={() => {
              const validationError = validateGSTIN(data.gstin);
              if (validationError) {
                setGstError(validationError);
              }
            }}
            inputProps={{ maxLength: 15 }}
            error={!!errors.gstin || !!gstError}
            helperText={gstError || errors.gstin || "Enter 15-character GSTIN (e.g., 22AAAAA0000A1Z5)"}
            fullWidth
            disabled={data.gstVerified}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: data.gstVerified ? '#e8f5e9' : 'inherit',
                '&.Mui-focused fieldset': {
                  borderColor: data.gstVerified ? '#2e7d32' : '#3f51b5',
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {data.gstVerified ? (
                    <Chip
                      label="Verified"
                      color="success"
                      size="small"
                      sx={{ color: 'white' }}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleVerifyGSTIN}
                      disabled={isVerifyingGST || !!validateGSTIN(data.gstin)}
                      size="small"
                    >
                      {isVerifyingGST ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Country */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Select Country"
            value={data.country || ""}
            onChange={handleCountryChange}
            fullWidth
            size="small"
            error={!!errors?.country}
            helperText={errors?.country}
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.name}>
                {country.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Pincode */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Pincode/Postal Code"
            value={data.pincode || ""}
            onChange={(e) => {
      const newPincode = e.target.value.replace(/\D/g, "");
      onChange("pincode", newPincode);
      
      // Clear location fields when pincode is cleared
      if (!newPincode) {
        onChange("state", "");
        onChange("city", "");
        onChange("address", "");
      }
    }}
            inputProps={{ maxLength: 10 }}
            error={!!errors.pincode || !!locationError}
            helperText={
              locationError ||errors.pincode || (data.state ? `Auto-filled: ${data.city}, ${data.state}` : "Enter 6-digit Indian pincode to auto-fill location")}
            fullWidth
            size="small"
            disabled={isFetchingLocation}
            InputProps={{
              endAdornment: isFetchingLocation ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : <IconButton onClick={()=>fetchLocation(data.pincode)} 
              disabled={!data.pincode || data.pincode.length !== 6} size="small">
                <SearchIcon fontSize="small" />
              </IconButton>,
            }}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} md={6}>
          <TextField
            label="State/Province"
            value={data.state || ""}
            onChange={(e) => onChange("state", e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} md={6}>
          <TextField
            label="City"
            value={data.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Full Address */}
        <Grid item xs={12}>
          <TextField
            label="Full Address"
            value={data.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
            error={!!errors.address}
            helperText={
              errors.address || "Include street, building, and landmark details"
            }
          />
        </Grid>

        {/* Categories Section */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", mb: 2, gap: 1 }}>
            <Box sx={{ position: "relative", flexGrow: 1 }}>
              <TextField
                label="Select Category"
                value={selectedCategory}
                onFocus={() => setDropdownOpen(true)}
                onChange={() => {}}
                fullWidth
                size="small"
                error={!!errors.categories}
                helperText={errors.categories || "Select at least one category"}
              />
              {isDropdownOpen && (
                <Paper
                  sx={{
                    position: "absolute",
                    zIndex: 2,
                    mt: 1,
                    width: "100%",
                    display: "flex",
                    boxShadow: 3,
                    minHeight: 300,
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {/* Parent Categories */}
                  <Box sx={{ flex: 1, borderRight: "1px solid #eee" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Main Categories
                    </Typography>
                    <List sx={{ maxHeight: 300, overflow: "auto" }}>
                      {categories.map((category) => (
                        <ListItem
                          key={category.name}
                          button
                          selected={hoveredCategory === category.name}
                          onMouseEnter={() => {
                            setHoveredCategory(category.name);
                            setHoveredSubCategory(null);
                          }}
                          dense
                        >
                          <ListItemText
                            primary={category.name}
                            primaryTypographyProps={{
                              fontWeight:
                                hoveredCategory === category.name
                                  ? "bold"
                                  : "normal",
                              color:
                                hoveredCategory === category.name
                                  ? "primary.main"
                                  : "text.primary",
                            }}
                          />
                          {category.children && category.children.length > 0 && (
                            <ChevronRightIcon fontSize="small" color="action" />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Subcategories */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      bgcolor: hoveredCategory ? "background.paper" : "grey.50",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Subcategories
                    </Typography>
                    {hoveredCategory ? (
                      <List sx={{ maxHeight: 300, overflow: "auto" }}>
                        {categories
                          .find((cat) => cat.name === hoveredCategory)
                          ?.children?.map((subCategory) => (
                            <ListItem
                              key={subCategory.name}
                              button
                              selected={hoveredSubCategory === subCategory.name}
                              onMouseEnter={() =>
                                setHoveredSubCategory(subCategory.name)
                              }
                              dense
                            >
                              <ListItemText
                                primary={subCategory.name}
                                primaryTypographyProps={{
                                  fontWeight:
                                    hoveredSubCategory === subCategory.name
                                      ? "bold"
                                      : "normal",
                                  color:
                                    hoveredSubCategory === subCategory.name
                                      ? "primary.main"
                                      : "text.primary",
                                }}
                              />
                              {subCategory.children &&
                                subCategory.children.length > 0 && (
                                  <ChevronRightIcon
                                    fontSize="small"
                                    color="action"
                                  />
                                )}
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Select a main category
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Subchild Categories */}
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: hoveredSubCategory
                        ? "background.paper"
                        : "grey.50",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Items
                    </Typography>
                    {hoveredSubCategory ? (
                      <List sx={{ maxHeight: 300, overflow: "auto" }}>
                        {categories
                          .find((cat) => cat.name === hoveredCategory)
                          ?.children?.find(
                            (sub) => sub.name === hoveredSubCategory
                          )
                          ?.children?.map((child, index) => (
                            <ListItem
                              key={index}
                              button
                              onClick={() =>
                                handleCategorySelection(
                                  hoveredCategory,
                                  hoveredSubCategory,
                                  child
                                )
                              }
                              dense
                            >
                              <ListItemText
                                primary={child}
                                primaryTypographyProps={{ color: "text.primary" }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {hoveredCategory
                            ? "Select a subcategory"
                            : "Select a main category first"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{ height: "40px" }}
              size="small"
            >
              Add
            </Button>
          </Box>

          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                Selected Categories:
              </Typography>
              <List
                dense
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid #eee",
                  borderRadius: 1,
                }}
              >
                {selectedCategories.map((category, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveCategory(index)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    }
                    dense
                    sx={{ borderBottom: "1px solid #f5f5f5" }}
                  >
                    <ListItemText
                      primary={category}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Grid>

        {/* Mobile Number Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Mobile Number"
            value={data.mobileNumber || ""}
            onChange={(e) =>
              onChange("mobileNumber", e.target.value.replace(/\D/g, ""))
            }
            inputProps={{ maxLength: 10 }}
            fullWidth
            disabled={data.mobileVerified}
            size="small"
            error={!!errors?.mobileNumber}
            helperText={errors.mobileNumber || "Enter 10-digit mobile number"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {phoneCode}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {data.mobileVerified ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendOtp("mobile")}
                      disabled={
                        data.mobileVerified || 
                        !data.mobileNumber || 
                        data.mobileNumber.length !== 10 ||
                        otpStates.mobile.loading
                      }
                      size="small"
                    >
                      {otpStates.mobile.loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* WhatsApp Number Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="WhatsApp Number"
            value={data.whatsappNumber || ""}
            onChange={(e) =>
              onChange("whatsappNumber", e.target.value.replace(/\D/g, ""))
            }
            inputProps={{ maxLength: 10 }}
            fullWidth
            disabled={data.whatsappVerified}
            size="small"
            error={!!errors?.whatsappNumber}
            helperText={errors?.whatsappNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {phoneCode}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {data.whatsappVerified ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendOtp("whatsapp")}
                      disabled={
                        data.whatsappVerified || 
                        !data.whatsappNumber || 
                        data.whatsappNumber.length !== 10 ||
                        otpStates.whatsapp.loading
                      }
                      size="small"
                    >
                      {otpStates.whatsapp.loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Email Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            value={data.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            fullWidth
            disabled={data.emailVerified}
            size="small"
            error={!!errors?.email}
            helperText={
              errors.email || "We'll send verification OTP to this email"
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {data.emailVerified ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendOtp("email")}
                      disabled={
                        data.emailVerified || 
                        !data.email || 
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
                        otpStates.email.loading
                      }
                      size="small"
                    >
                      {otpStates.email.loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Website */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Website"
            value={data.website || ""}
            onChange={(e) => onChange("website", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.website}
            helperText={errors.website || "https://example.com"}
          />
        </Grid>

        {/* Facebook */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Facebook"
            value={data.facebook || ""}
            onChange={(e) => onChange("facebook", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.facebook}
            helperText={errors.facebook || "https://facebook.com/yourpage"}
          />
        </Grid>

        {/* Instagram */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Instagram"
            value={data.instagram || ""}
            onChange={(e) => onChange("instagram", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.instagram}
            helperText={errors?.instagram}
          />
        </Grid>

        {/* LinkedIn */}
        <Grid item xs={12} md={6}>
          <TextField
            label="LinkedIn"
            value={data.linkedin || ""}
            onChange={(e) => onChange("linkedin", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.linkedin}
            helperText={errors?.linkedin}
          />
        </Grid>

        {/* Established Year */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Established Year"
            select
            value={data.establishedYear || ""}
            onChange={(e) => onChange("establishedYear", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.establishedYear}
            helperText={errors?.establishedYear}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Franchise Since Year */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Franchise Since Year"
            select
            value={data.franchiseSinceYear || ""}
            onChange={(e) => onChange("franchiseSinceYear", e.target.value)}
            fullWidth
            size="small"
            error={!!errors?.franchiseSinceYear}
            helperText={errors?.franchiseSinceYear}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* OTP Verification Modal */}
      <Dialog open={otpModal.open} onClose={closeOtpModal}>
        <DialogTitle>
          Verify {otpModal.type === 'email' ? 'Email' : 
                 otpModal.type === 'mobile' ? 'Mobile' : 'WhatsApp'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              label={`Enter OTP sent to your ${otpModal.type}`}
              value={otpModal.otp}
              onChange={(e) => setOtpModal(prev => ({ 
                ...prev, 
                otp: e.target.value.replace(/\D/g, "") 
              }))}
              inputProps={{ maxLength: 6 }}
              fullWidth
              disabled={otpModal.loading}
              helperText="Enter the 6-digit verification code"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeOtpModal}
            disabled={otpModal.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => sendOtp(otpModal.type)}
            disabled={otpModal.loading}
            color="secondary"
          >
            Resend OTP
          </Button>
          <Button 
            onClick={verifyOtp}
            disabled={otpModal.loading || otpModal.otp.length !== 6}
            variant="contained"
          >
            {otpModal.loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Verify'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BrandDetails;
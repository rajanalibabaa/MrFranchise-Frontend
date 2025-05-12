import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  List,
  ListItemText,
  Box,
  ListItem,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { categories } from "../../Pages/BrandListingForm/BrandCategories";
import { Token } from "@mui/icons-material";

const countries = ["India", "USA", "UK", "Canada", "Australia"];
const phoneCodes = {
  India: "+91",
  USA: "+1",
  UK: "+44",
  Canada: "+1",
  Australia: "+61",
};

const InvestorRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    trigger
  } = useForm({
    defaultValues: {
      country: "India"
    }
  });

  const navigate = useNavigate();
  const [phonePrefix, setPhonePrefix] = useState("+91");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  // OTP related states
  const [otpModal, setOtpModal] = useState({
    open: false,
    type: null, // 'email', 'mobile', or 'whatsapp'
    otp: "",
    loading: false,
    verified: false
  });

  const selectedCountry = watch("country");
  const pincode = watch("pincode");

  // Helper functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
const [otpStates, setOtpStates] = useState({
  email: {
    sent: false,
    verified: false,
    loading: false,
    token: ""
  },
  mobile: {
    sent: false,
    verified: false,
    loading: false,
    token: ""
  },
  whatsapp: {
    sent: false,
    verified: false,
    loading: false,
    token: ""
  }
});
  const openOtpModal = (type,token) => {
    setOtpModal({
      open: true,
      type,
      otp: "",
      token
    });
  };

  const closeOtpModal = () => {
    setOtpModal({
      open: false,
      type: null,
      otp: "",
      token: ""
    });
  };

  // Verification functions
const sendOtp = async (type) => {
  let endpoint = "";
  let payload = {};
  let fieldName = "";

  if (type === "email") {
    fieldName = "email";
    endpoint = "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/send-otp-email";
    payload = { email: watch("email"), type: "email" };
  } else if (type === "mobile") {
    fieldName = "mobileNumber";
    endpoint = "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/send-otp-mobile";
    payload = { mobile: `${phonePrefix}${watch("mobileNumber")}`, type: "mobile" };
  } else if (type === "whatsapp") {
    fieldName = "whatsappNumber";
    endpoint = "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/send-whatsapp-otp";
    payload = { mobile: `${phonePrefix}${watch("whatsappNumber")}`, type: "whatsapp" };
  }

  const isValid = await trigger(fieldName);
  if (!isValid) return;

  if (!watch(fieldName)) {
    showSnackbar(`Please enter a valid ${type}`, "error");
    return;
  }

setOtpStates(prev => ({
    ...prev,
    [type]: {
      ...prev[type],
      loading: true
    }
  }));

  try {
    const response = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response:", response.data);
    

    if (response.status === 200 && response.data.sent) {
      showSnackbar(`${type} OTP sent successfully!`, "success");
      const token = response.data.token;

setOtpStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          sent: true,
          token , // Make sure to capture the token
          loading: false
        }
      }));
      openOtpModal(type, token);
 }else{
  showSnackbar(`Failed to send ${type} OTP.`, "error");
 } 
} catch (error) {
    console.error(`Error sending ${type} OTP:`, error);
    showSnackbar(
      error.response?.data?.message || `An error occurred while sending ${type} OTP.`,"error",
    );
  } finally {
setOtpStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false
        }
      }));  }
};

const verifyOtp = async () => {
  const { type, otp} = otpModal;

if (!otp ) {
    showSnackbar(" token is missing , pleaswe try again", "error");
    return;
  }
  const token = otpStates[type]?.token;
 const identifier = 
    type === "email" 
      ? watch("email") 
      : `${phonePrefix}${watch(type === "mobile" ? "mobileNumber" : "whatsappNumber")}`;

console.log("Type:", type);
  console.log("OTP:", otp);
  console.log("Token:", token);
  console.log("Identifier:", identifier);
  
if(!identifier || !otp || !token){
  showSnackbar("Please enter a valid identifier, otp and token", "error");
  return;
}

  const payload = {
    identifier,
    verifyOtp: otp,
    type,
    token
  };

  setOtpStates((prev) => ({
    ...prev,
    [type]: {
      ...prev[type],
      loading: true,
    },
  }));

  try {
    const response = await axios.post("https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/verify-otp",payload,{headers: { "Content-Type": "application/json" }},);
console.log("Response:", response.data);

    if (response.status === 200 && response.data.success) {
      showSnackbar(`${type} verified successfully!`, "success");

      setOtpStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          verified: true,
          loading: false,
        },
      }));
      closeOtpModal();
    } else {
 showSnackbar(response.data.message || `Failed to verify ${type}. Please try again.`, "error");    }
  } catch (error) {
    console.error(`Error verifying ${type}:`, error);
    showSnackbar(
      error.response?.data?.message || `An error occurred while verifying ${type}.`,
      "error"
    );
  } finally {
    setOtpStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        loading: false,
      },
    }));
  }
};

  // Other handlers
  const handleCategorySelection = (mainCategory, subCategory, item) => {
    const selectedPath = `${mainCategory} > ${subCategory} > ${item}`;
    setSelectedCategory(selectedPath);
    setValue("category", selectedPath); 
    setDropdownOpen(false); 
  };

  const onSubmit = async (data) => {
    // In a real app, you would check verification status here
    // For now, we'll just proceed with the form submission
    
    const formattedData = {
      firstName: data.firstName || "",
      email: data.email || "",
      mobileNumber: `${phonePrefix}${data.mobileNumber || ""}`.trim(),
      whatsappNumber: `${phonePrefix}${data.whatsappNumber || ""}`.trim(),
      address: data.address || "",
      country: data.country || "",
      pincode: data.pincode || "",
      state: data.state || "",
      district: data.district || "",
      city: data.city || "",
      category: data.category || "",
      investmentRange: data.investmentRange || "",
      occupation: data.occupation || "",
      propertytype: data.propertytype || "",
      lookingFor: data.lookingFor || "",
    };

    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/v1/investor/createInvestor",
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        showSnackbar("Registration successful! Redirecting to login...", "success");
        setTimeout(() => navigate("/loginpage"), 2000);
      } else {
        showSnackbar("An unexpected error occurred. Please try again.", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 409 || error.response?.data?.message === "User already registered") {
        showSnackbar("This user is already registered. Please log in.", "error");
      } else {
        showSnackbar(
          error.response?.data?.message || "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    }
  };

  // Effects
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (selectedCountry && phoneCodes[selectedCountry]) {
      setPhonePrefix(phoneCodes[selectedCountry]);
    } else {
      setPhonePrefix("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (selectedCountry === "India" && pincode && pincode.length === 6) {
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = response.data[0];
          if (data.Status === "Success") {
            const locationDetails = data.PostOffice[0];
            setValue("state", locationDetails.State || "");
            setValue("city", locationDetails.Block || locationDetails.Name || "");
            setValue("district", locationDetails.District || "");
          } else {
            setValue("state", "");
            setValue("city", "");
            setValue("district", "");
            showSnackbar("Invalid Pincode", "error");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          showSnackbar("Error fetching location details", "error");
        }
      }
    };
    fetchLocationDetails();
  }, [selectedCountry, pincode, setValue]);

  // Render functions
  const renderSelectField = (
    label,
    name,
    options,
    requiredMsg = "This field is required"
  ) => (
    <FormControl fullWidth error={!!errors[name]}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        defaultValue=""
        {...register(name, { required: requiredMsg })}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
      {errors[name] && (
        <Typography variant="body2" color="error">
          {errors[name]?.message}
        </Typography>
      )}
    </FormControl>
  );

  return (

    <Container
      sx={{
        maxWidth: "lg",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 2,
      }}
    >
      <Paper elevation={3} sx={{ pt: 1, pl: 5, pr: 3, maxHeight: "690px", height: "690px" }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Investor Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid sx={{ width: "46%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={!!errors.firstName}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.firstName?.message || " "}
                  </span>
                }
              />
            </Grid>

            {/* Country and Location Fields */}
            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              {renderSelectField(
                "Country",
                "country",
                countries,
                "Country is required"
              )}
            </Grid>
            
            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Pincode"
                {...register("pincode", { 
                  required: "Pincode is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Pincode must be 6 digits"
                  }
                })}
                error={!!errors.pincode}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.pincode?.message || " "}
                  </span>
                }
              />
            </Grid>
            
            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="State"
                value={watch("state") || ""}
                {...register("state")}
                InputProps={{ readOnly: true }}
                error={!!errors.state}
              />
            </Grid>
            
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={watch("city") || ""}
                {...register("city")}
                InputProps={{ readOnly: true }}
                error={!!errors.city}
              />
            </Grid>
            
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="District"
                value={watch("district") || ""}
                {...register("district")}
                InputProps={{ readOnly: true }}
                error={!!errors.district}
              />
            </Grid>
            
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address"
                {...register("address", { required: "Address is required" })}
                error={!!errors.address}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.address?.message}
                  </span>
                }
              />
            </Grid>

            {/* Email Field with OTP */}
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Email"
    type="email"
    {...register("email", {
      required: "Email is required",
      pattern: {
        value: /^\S+@\S+$/i,
        message: "Invalid email address",
      },
    })}
    error={!!errors.email}
    helperText={errors.email?.message || " "}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Button
            size="small"
            variant="outlined"
 onClick={() => {
              if (otpStates.email.verified) return;
              sendOtp("email").then(() => openOtpModal("email"));
            }}            disabled={otpStates.email.loading || otpStates.email.verified}
          >
            {otpStates.email.loading ? (
              <CircularProgress size={20} />
            ) : otpStates.email.verified ? (
              "Verified"
            ) : otpStates.email.sent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </Button>
        </InputAdornment>
      ),
    }}
  />
  {/* {otpModal.sent && otpModal.type === "email" && (
    <TextField
      fullWidth
      label="Enter OTP"
      value={otpModal.otp}
      onChange={(e) => setOtpModal((prev) => ({ ...prev, otp: e.target.value }))}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              size="small"
              variant="outlined"
              onClick={verifyOtp}
              disabled={otpModal.verified || otpModal.loading}
              color={otpModal.verified ? "success" : "primary"}
            >
              {otpModal.loading ? (
                <CircularProgress size={20} />
              ) : otpModal.verified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )} */}
</Grid>

            {/* Mobile Field with OTP */}
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Phone Number"
    {...register("mobileNumber", {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Invalid phone number (10 digits required)",
      },
    })}
    error={!!errors.mobileNumber}
    helperText={errors.mobileNumber?.message || " "}
    InputProps={{
      startAdornment: <InputAdornment position="start">{phonePrefix}</InputAdornment>,
      endAdornment: (
        <InputAdornment position="end">
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (otpStates.mobile.verified) return;
              sendOtp("mobile").then(() => openOtpModal("mobile"));
            }}
            disabled={otpStates.mobile.loading || otpStates.mobile.verified}
          >
            {otpStates.mobile.loading ? (
              <CircularProgress size={20} />
            ) : otpStates.mobile.verified ? (
              "Verified"
            ) : otpStates.mobile.sent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </Button>
        </InputAdornment>
      ),
    }}
  />
  {/* {otpModal.sent && otpModal.type === "mobile" && (
    <TextField
      fullWidth
      label="Enter OTP"
      value={otpModal.otp}
      onChange={(e) => setOtpModal((prev) => ({ ...prev, otp: e.target.value }))}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              size="small"
              variant="outlined"
              onClick={verifyOtp}
              disabled={otpModal.verified || otpModal.loading}
              color={otpModal.verified ? "success" : "primary"}
            >
              {otpModal.loading ? (
                <CircularProgress size={20} />
              ) : otpModal.verified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )} */}
</Grid>

            {/* WhatsApp Field with OTP */}
           <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="WhatsApp Number"
    {...register("whatsappNumber", {
      required: "WhatsApp number is required",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Invalid WhatsApp number (10 digits required)",
      },
    })}
    error={!!errors.whatsappNumber}
    helperText={errors.whatsappNumber?.message || " "}
    InputProps={{
      startAdornment: <InputAdornment position="start">{phonePrefix}</InputAdornment>,
      endAdornment: (
        <InputAdornment position="end">
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if(otpStates.whatsapp.verified) return;
              sendOtp("whatsapp").then(() => openOtpModal("whatsapp"));
            }}
            disabled={otpStates.whatsapp.loading || otpStates.whatsapp.verified}
          >
            {otpStates.whatsapp.loading ? (
              <CircularProgress size={20} />
            ) : otpStates.whatsapp.verified ? (
              "Verified"
            ) : otpStates.whatsapp.sent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </Button>
        </InputAdornment>
      ),
    }}
  />
  {/* {otpModal.sent && otpModal.type === "whatsapp" && (
    <TextField
      fullWidth
      label="Enter OTP"
      value={otpModal.otp}
      onChange={(e) => setOtpModal((prev) => ({ ...prev, otp: e.target.value }))}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              size="small"
              variant="outlined"
              onClick={verifyOtp}
              disabled={otpModal.verified || otpModal.loading}
              color={otpModal.verified ? "success" : "primary"}
            >
              {otpModal.loading ? (
                <CircularProgress size={20} />
              ) : otpModal.verified ? (
                "Verified"
              ) : (
                "Verify"
              )}
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )} */}
</Grid>

<Dialog open={otpModal.open} onClose={closeOtpModal}>
  <DialogTitle>
    Verify {otpModal.type === "email" ? "Email" : 
           otpModal.type === "mobile" ? "Mobile Number" : "WhatsApp Number"}
  </DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Enter OTP"
      type="text"
      fullWidth
      variant="standard"
      value={otpModal.otp}
      onChange={(e) => setOtpModal(prev => ({ ...prev, otp: e.target.value }))}
      disabled={otpStates.verified}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={closeOtpModal}>Cancel</Button>
    <Button 
      onClick={() => verifyOtp(otpModal.type)}
      disabled={otpStates[otpModal.type]?.verified || otpStates[otpModal.type]?.loading}
      color="primary"
    >
      {otpStates[otpModal.type]?.loading ? (
        <CircularProgress size={24} />
      ) : otpStates[otpModal.type]?.verified ? (
        "Verified"
      ) : (
        "Verify"
      )}
    </Button>
  </DialogActions>
</Dialog>

            {/* Occupation Field */}
            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("occupation", {
                  required: "Occupation is required",
                })}
                error={!!errors.occupation}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.occupation?.message}
                  </span>
                }
              >
                <option value="">Select Occupation</option>
                <option value="Student">Student</option>
                <option value="Business">Business</option>
                <option value="Salaried">Salaried</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>

            {/* Category Field */}
            <Grid sx={{ width: "22%", position: "relative" }}>
              <TextField
                fullWidth
                label="Category"
                value={selectedCategory}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                InputProps={{
                  readOnly: true,
                }}
                error={!!errors.category}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.category?.message}
                  </span>
                }
                {...register("category", {
                  required: "Category is required",
                })}
              />

              {isDropdownOpen && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 10,
                    mt: 1,
                    width: "200%",
                    display: "flex",
                    boxShadow: 3,
                    maxHeight: "260px",
                    overflowY: "auto",
                  }}
                >
                  {/* Main Categories */}
                  <Box sx={{ flex: 1, borderRight: "1px solid #eee" }}>
                    <Typography
                      sx={{
                        p: 1,
                        fontWeight: "bold",
                        bgcolor: "grey.100",
                        width: "100%",
                      }}
                    >
                      Main Categories
                    </Typography>
                    <List>
                      {categories.map((category, index) => (
                        <ListItem
                          key={index}
                          button="true"
                          onMouseEnter={() => setActiveCategory(index)}
                          selected={activeCategory === index}
                        >
                          <ListItemText
                            primary={category.name}
                            sx={{
                              fontWeight: activeCategory === index ? "bold" : "normal",
                              color: activeCategory === index ? "primary.main" : "inherit",
                            }}
                          />
                          <ChevronRightIcon
                            sx={{
                              color: activeCategory === index ? "primary.main" : "inherit",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Subcategories */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      width: "70%",
                    }}
                  >
                    <Typography
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Subcategories
                    </Typography>
                    {activeCategory !== null &&
                      categories[activeCategory]?.children && (
                        <List>
                          {categories[activeCategory].children.map(
                            (subCategory, subIndex) => (
                              <ListItem
                                key={subIndex}
                                button="true"
                                onMouseEnter={() =>
                                  setActiveSubCategory(subCategory)
                                }
                                selected={
                                  activeSubCategory?.name === subCategory.name
                                }
                              >
                                <ListItemText
                                  primary={subCategory.name}
                                  sx={{
                                    fontWeight:
                                      activeSubCategory?.name ===
                                      subCategory.name
                                        ? "bold"
                                        : "normal",
                                    color:
                                      activeSubCategory?.name ===
                                      subCategory.name
                                        ? "primary.main"
                                        : "inherit",
                                  }}
                                />
                                <ChevronRightIcon
                                  sx={{
                                    color:
                                      activeSubCategory?.name ===
                                      subCategory.name
                                        ? "primary.main"
                                        : "inherit",
                                  }}
                                />
                              </ListItem>
                            )
                          )}
                        </List>
                      )}
                  </Box>

                  {/* Sub-Child Categories */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      width: "70%",
                    }}
                  >
                    <Typography
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Items
                    </Typography>
                    {activeSubCategory?.children && (
                      <List>
                        {activeSubCategory.children.map((item, index) => (
                          <ListItem
                            key={index}
                            button="true"
                            onClick={() =>
                              handleCategorySelection(
                                categories[activeCategory]?.name,
                                activeSubCategory?.name,
                                item
                              )
                            }
                          >
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Investment Range Field */}
            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("investmentRange", {
                  required: "Investment range is required",
                })}
                error={!!errors.investmentRange}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.investmentRange?.message}
                  </span>
                }
              >
                <option value="">Select Investment Range</option>
                <option value="Rs.10,000-50,000">Rs.10,000-50,000</option>
                <option value="Rs.50,000-2L">Rs.50,000-2L</option>
                <option value="Rs.2L-5L">Rs.2L-5L</option>
                <option value="Rs.5L-10L">Rs.5L-10L</option>
                <option value="Rs.10L-20L">Rs.10L-20L</option>
                <option value="Rs.20L-30L">Rs.20L-30L</option>
                <option value="Rs.30L-50L">Rs.30L-50L</option>
                <option value="Rs.50L-1Cr">Rs.50L-1Cr</option>
                <option value="Rs.1Cr-2Cr">Rs.1Cr-2Cr</option>
                <option value="Rs.2Cr-5Cr">Rs.2Cr-5Cr</option>
                <option value="Rs.5Cr-above">Rs.5Cr-above</option>
              </TextField>
            </Grid>

            {/* Looking For Field */}
            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("lookingFor", {
                  required: "Looking For is required",
                })}
                error={!!errors.lookingFor}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.lookingFor?.message}
                  </span>
                }
              >
                <option value="">Select Looking For</option>
                <option value="Unit">Unit</option>
                <option value="Multicity">Multicity</option>
                <option value="Dealer/Distributor">Dealer/Distributor</option>
                <option value="Master Franchisee">Master Franchisee</option>
              </TextField>
            </Grid>

            {/* Property Type Field */}
            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("propertytype", { 
                  required: "Property Type is required" 
                })}
                error={!!errors.propertytype}
                helperText={
                  <span style={{ minHeight: "0.5rem", display: "block" }}>
                    {errors.propertytype?.message}
                  </span>
                }
              >
                <option value="">Select Property Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Agricultural">Agricultural</option>
              </TextField>
            </Grid>

            {/* Terms and Conditions */}
            <Grid sx={{ width: "100%", xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox {...register("terms", { required: true })} />
                }
                label="I agree to the terms and conditions"
              />
              {errors.terms && (
                <Typography color="error" variant="body2">
                  You must accept the terms
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid
              sx={{
                width: "70%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "15%",
                xs: 12,
              }}
            >
              <Button
                fullWidth
                type="submit"
                size="large"
                variant="contained"
              >
                REGISTER
              </Button>
            </Grid>

            <Grid sx={{ width: "100%", xs: 12 }}>
              <Typography textAlign="center">
                Already have an account?{" "}
                <Link href="/loginpage" color="primary">
                  Sign In
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* OTP Verification Modal */}
      <Dialog open={otpModal.open} onClose={closeOtpModal}>
        <DialogTitle>
          Verify {otpModal.type === "email" ? "Email" : 
                 otpModal.type === "mobile" ? "Mobile Number" : "WhatsApp Number"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter OTP"
            type="text"
            fullWidth
            variant="standard"
            value={otpModal.otp}
            onChange={(e) => setOtpModal(prev => ({ ...prev, otp: e.target.value }))}
            disabled={otpModal.verified}
            InputProps={{
              endAdornment: otpModal.verified && (
                <InputAdornment position="end">
                  <Typography color="success.main">Verified</Typography>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOtpModal}>Cancel</Button>
          <Button 
            onClick={verifyOtp}
            disabled={otpModal.verified || otpModal.loading}
            color="primary"
          >
            {otpModal.loading ? (
              <CircularProgress size={24} />
            ) : otpModal.verified ? (
              "Verified"
            ) : (
              "Verify"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InvestorRegister;
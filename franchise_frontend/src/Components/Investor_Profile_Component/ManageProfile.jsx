import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";

const ManageProfile = () => {
  // State management
  const [investorData, setInvestorData] = useState({
    firstName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    country: "",
    occupation: "",
    city: "",
    pincode: "",
    preferences: [],
    profileImage: "",
    investorID: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [requestOTP, setRequestOTP] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [indiaData, setIndiaData] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    mobileNumber: "",
    whatsappNumber: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    occupation: "",
  });

  // Navigation and Redux
  const navigate = useNavigate();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  // Helper functions
  const formatNumber = (num) => {
    if (!num) return "";
    return num.replace(/^(\+91)?/, "").trim();
  };

  // Location data handling
  const getDistrictsForState = (stateName) => {
    const stateObj = indiaData.find((s) => s.name === stateName);
    return stateObj?.districts || [];
  };

  const getCitiesForDistrict = (stateName, districtName) => {
    const stateObj = indiaData.find((s) => s.name === stateName);
    if (!stateObj) return [];
    return (stateObj.cities || [])
      .filter((city) => city.district === districtName)
      .map((city) => city.name);
  };

  // State change handler
  const handleStateChange = (prefIndex, stateName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredState: stateName,
      preferredDistrict: "",
      preferredCity: ""
    };
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  // District change handler
  const handleDistrictChange = (prefIndex, districtName) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex] = {
      ...newPrefs[prefIndex],
      preferredDistrict: districtName,
      preferredCity: ""
    };
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  // Data fetching
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setIndiaData(res.data);
      } catch (err) {
        console.error("Error fetching location data:", err);
        setIndiaData([]);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!investorUUID || !AccessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );
        console.log("Investor Data Response:", response.data);
        if (response.data?.data) {
          const data = response.data.data;
          const formattedData = {
            ...data,
            mobileNumber: formatNumber(data.mobileNumber),
            whatsappNumber: formatNumber(data.whatsappNumber),
            occupation: data.occupation || "",
            preferences:
              data.preferences?.map((pref) => ({
                ...pref,
                category: Array.isArray(pref.category) ? pref.category : [],
              })) || [],
          };
          setInvestorData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching investor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investorUUID, AccessToken]);

  // OTP handling
  const handleEditToggle = () => {
    setOtpDialogOpen(true);
    setOtpStep(1);
    setOtp("");
    setOtpError("");
    setErrorMSG("");
    setContactValue(investorData.email || investorData.mobileNumber || "");
  };

  const handleRequestOtp = async () => {
    if (!contactValue) return;
    setErrorMSG("");
    setRequestOTP(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/existingEmailOTP",
        { email: investorData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setOtpStep(2);
      } else {
        setErrorMSG(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("OTP request error:", error);
      setErrorMSG("An error occurred while requesting OTP.");
    } finally {
      setRequestOTP(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    setOtpError("");
    setErrorMSG("");
    setRequestOTP(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/verifyExistingEmailOTP",
        {
          email: investorData.email,
          verifyOTP: otp,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setEditMode(true);
        setOtpDialogOpen(false);
      } else {
        setOtpError("Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("An error occurred during OTP verification.");
    } finally {
      setRequestOTP(false);
    }
  };

  // Validate all fields
  const validateFields = () => {
    const errors = {
      firstName: "",
      mobileNumber: "",
      whatsappNumber: "",
      state:"",
      city: "",
      address: "",
      pincode: "",
      occupation: "",
    };
    let isValid = true;

    // Validate firstName
    if (!investorData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    // Validate mobileNumber
    const mobileNumber = formatNumber(investorData.mobileNumber);
    if (!mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits";
      isValid = false;
    }

    // Validate whatsappNumber
    const whatsappNumber = formatNumber(investorData.whatsappNumber);
    if (!whatsappNumber) {
      errors.whatsappNumber = "WhatsApp number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(whatsappNumber)) {
      errors.whatsappNumber = "WhatsApp number must be 10 digits";
      isValid = false;
    }

    // Validate city
    if (!investorData.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }
    // Validate city
    if (!investorData.city.trim()) {
      errors.city = "City is required";
      isValid = false;
    }
    // Validate address
    if (!investorData.address.trim()) {
      errors.address = "address is required";
      isValid = false;
    }

    // Validate pincode
    if (!investorData.pincode) {
      errors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(investorData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    // Validate occupation
    if (!investorData.occupation) {
      errors.occupation = "Occupation is required";
      isValid = false;
    }

    // Validate preferences
    if (investorData.preferences.length === 0) {
      setSnackbar({
        open: true,
        message: "At least one preference is required",
        severity: "error",
      });
      isValid = false;
    } else {
      for (const pref of investorData.preferences) {
        if (!pref.investmentRange) {
          setSnackbar({
            open: true,
            message: "Investment range is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (!pref.investmentAmount) {
          setSnackbar({
            open: true,
            message: "Investment amount is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (!pref.propertyType) {
          setSnackbar({
            open: true,
            message: "Property type is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (pref.propertyType === "Own Property" && !pref.propertySize) {
          setSnackbar({
            open: true,
            message: "Property size is required when property type is Own Property",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (!pref.preferredState) {
          setSnackbar({
            open: true,
            message: "Preferred state is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (!pref.preferredDistrict) {
          setSnackbar({
            open: true,
            message: "Preferred district is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (!pref.preferredCity) {
          setSnackbar({
            open: true,
            message: "Preferred city is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        if (pref.category.length === 0) {
          setSnackbar({
            open: true,
            message: "At least one category is required for each preference",
            severity: "error",
          });
          isValid = false;
          break;
        }
        for (const cat of pref.category) {
          if (!cat.main) {
            setSnackbar({
              open: true,
              message: "Main category is required for all categories",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Form handling
  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    const dataToUpdate = {
      ...investorData,
      mobileNumber: "+91" + formatNumber(investorData.mobileNumber),
      whatsappNumber: "+91" + formatNumber(investorData.whatsappNumber),
    };

    console.log("Data to update ;",dataToUpdate)

    try {
      await axios.patch(
        `http://localhost:5000/api/v1/investor/updateInvestor/${investorUUID}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profile successfully updated!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving investor data:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
    }
  };

  // Preference handling
  const handlePreferenceChange = (index, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[index] = { ...newPrefs[index], [key]: value };
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const handleCategoryChange = (prefIndex, catIndex, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newCategories = [...(newPrefs[prefIndex].category || [])];
    newCategories[catIndex] = { ...newCategories[catIndex], [key]: value };
    newPrefs[prefIndex].category = newCategories;
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const addCategory = (prefIndex) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[prefIndex].category = [
      ...(newPrefs[prefIndex].category || []),
      { main: "", sub: "", child: "" },
    ];
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const removeCategory = (prefIndex, catIndex) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newCategories = [...(newPrefs[prefIndex].category || [])];
    if (newCategories.length > 1) {
      newCategories.splice(catIndex, 1);
      newPrefs[prefIndex].category = newCategories;
      setInvestorData({ ...investorData, preferences: newPrefs });
    }
  };

  const addPreference = () => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs.push({
      investmentRange: "",
      investmentAmount: "",
      propertyType: "",
      propertySize: "",
      preferredState: "",
      preferredDistrict: "",
      preferredCity: "",
      category: [{ main: "", sub: "", child: "" }],
      _id: Date.now().toString(),
    });
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const removePreference = (index) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs.splice(index, 1);
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  // Render helpers
  const renderField = (label, key, isReadOnly = false) => {
    const value = investorData[key];
    const isPhoneField = key === "mobileNumber" || key === "whatsappNumber";
    const isReadOnlyField = isReadOnly || key === "country" || key === "email";
    const isOccupationField = key === "occupation";
    const isPincodeField = key === "pincode";

    let displayValue = "";
    if (Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (typeof value === "object" && value !== null) {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = value || "";
    }

    return (
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {label}
        </Typography>
        {editMode && !isReadOnlyField ? (
          <Box display="flex" alignItems="center">
            {isPhoneField && <Typography sx={{ mr: 1 }}>+91</Typography>}
            {isOccupationField ? (
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  setInvestorData({ ...investorData, [key]: e.target.value });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                required
              >
                <MenuItem value="Investor">Investor</MenuItem>
                <MenuItem value="Brand">Brand</MenuItem>
              </TextField>
            ) : isPincodeField ? (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setInvestorData({ ...investorData, [key]: input });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                inputProps={{ maxLength: 6 }}
                required
              />
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={value || ""}
                onChange={(e) => {
                  setInvestorData({ ...investorData, [key]: e.target.value });
                  setFieldErrors({ ...fieldErrors, [key]: "" });
                }}
                error={!!fieldErrors[key]}
                helperText={fieldErrors[key]}
                required={!isPhoneField} // Phone fields have their own validation
                inputProps={isPhoneField ? { maxLength: 10 } : {}}
              />
            )}
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}
          >
            {isPhoneField ? `+91 ${displayValue}` : displayValue || "-----"}
          </Typography>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!investorData || Object.keys(investorData).length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Unable to load profile. Please login again{" "}
        <Button onClick={() => navigate("/loginpage")}>Login</Button>
      </Typography>
    );
  }

  return (
    <Box px={2}>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
        sx={{
          textAlign: "center",
          color: "#ffffff",
          backgroundColor: "#689f38",
          padding: "10px",
          borderRadius: "6px",
        }}
      >
        Manage Profile
      </Typography>

      <Box display="flex" justifyContent="center">
        <Paper
          elevation={4}
          sx={{ padding: 4, borderRadius: 4, width: "100%", maxWidth: 700 }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight={500}>
              Investor Profile
            </Typography>
            <Button
              variant="outlined"
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              onClick={editMode ? handleSave : handleEditToggle}
              sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600, px: 2.5, py: 1 }}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </Box>

          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              alt="Investor Avatar"
              src={investorData.profileImage}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Typography variant="h6">{investorData.investorID}</Typography>
          </Box>

          {renderField("First Name", "firstName")}
          {renderField("Email", "email", true)}
          {renderField("Mobile Number", "mobileNumber")}
          {renderField("Whatsapp Number", "whatsappNumber")}
          {renderField("Country", "country", true)}
          {renderField("State", "state")}
          {renderField("City", "city")}
          {renderField("Address", "address")}
          {renderField("Pincode", "pincode")}
          {renderField("Occupation", "occupation")}

          <Box mt={4}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Preferences
            </Typography>

            {(investorData.preferences || []).map((pref, prefIndex) => (
              <Paper
                key={pref._id || prefIndex}
                elevation={2}
                sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Preference #{prefIndex + 1}
                  </Typography>
                  {editMode && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removePreference(prefIndex)}
                      disabled={investorData.preferences.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  {/* Investment Range */}
                  <TextField
                    size="small"
                    label="Investment Range"
                    value={pref.investmentRange || ""}
                    onChange={(e) =>
                      handlePreferenceChange(
                        prefIndex,
                        "investmentRange",
                        e.target.value
                      )
                    }
                    disabled={!editMode}
                    select
                    required
                    error={editMode && !pref.investmentRange}
                    helperText={editMode && !pref.investmentRange ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select Investment Range</MenuItem>
                    <MenuItem value="having amount">Having Investment Amount Ready</MenuItem>
                    <MenuItem value="take loan">Planning to take a Loan</MenuItem>
                    <MenuItem value="need loan">Need Loan Assistance</MenuItem>
                  </TextField>

                  {/* Investment Amount */}
                  <TextField
                    size="small"
                    label="Investment Amount"
                    value={pref.investmentAmount || ""}
                    onChange={(e) =>
                      handlePreferenceChange(
                        prefIndex,
                        "investmentAmount",
                        e.target.value
                      )
                    }
                    disabled={!editMode}
                    select
                    required
                    error={editMode && !pref.investmentAmount}
                    helperText={editMode && !pref.investmentAmount ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select Investment Amount</MenuItem>
                    <MenuItem value="Below-50,000">Below - Rs.50 K</MenuItem>
                    <MenuItem value="Rs.50,000-2L">Rs.50 K - 2 L</MenuItem>
                    <MenuItem value="Rs.2L-5L">Rs.2 L - 5 L</MenuItem>
                    <MenuItem value="Rs.5L-10L">Rs.5 L - 10 L</MenuItem>
                    <MenuItem value="Rs.10L-20L">Rs.10 L - 20 L</MenuItem>
                    <MenuItem value="Rs.20L-30L">Rs.20 L - 30 L</MenuItem>
                    <MenuItem value="Rs.30L-50L">Rs.30 L - 50 L</MenuItem>
                    <MenuItem value="Rs.50L-1Cr">Rs.50 L - 1 Cr</MenuItem>
                    <MenuItem value="Rs.1Cr-2Cr">Rs.1 Cr - 2 Cr</MenuItem>
                    <MenuItem value="Rs.2Cr-5Cr">Rs.2 Cr - 5 Cr</MenuItem>
                    <MenuItem value="Rs.5Cr-above">Rs.5 Cr - Above</MenuItem>
                  </TextField>

                  {/* Property Type */}
                  <TextField
                    size="small"
                    label="Property Type"
                    value={pref.propertyType || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const newPrefs = [...(investorData.preferences || [])];
                      newPrefs[prefIndex] = {
                        ...newPrefs[prefIndex],
                        propertyType: newValue,
                        propertySize: newValue === "Own Property" ? pref.propertySize : "",
                      };
                      setInvestorData({ ...investorData, preferences: newPrefs });
                    }}
                    disabled={!editMode}
                    select
                    fullWidth
                    required
                    error={editMode && !pref.propertyType}
                    helperText={editMode && !pref.propertyType ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select Property Type</MenuItem>
                    <MenuItem value="Own Property">Own Property</MenuItem>
                    <MenuItem value="Rental Property">Rental Property</MenuItem>
                  </TextField>

                  {/* Property Size */}
                  {pref.propertyType === "Own Property" && (
                    <TextField
                      size="small"
                      label="Property Size"
                      value={pref.propertySize || ""}
                      onChange={(e) =>
                        handlePreferenceChange(
                          prefIndex,
                          "propertySize",
                          e.target.value
                        )
                      }
                      disabled={!editMode}
                      select
                      fullWidth
                      required
                      error={editMode && !pref.propertySize}
                      helperText={editMode && !pref.propertySize ? "This field is required" : ""}
                    >
                      <MenuItem value="">Select Total Area</MenuItem>
                      <MenuItem value="Below - 100 sq ft">Below - 100 sq ft</MenuItem>
                      <MenuItem value="100 sq ft - 200 sq ft">100 sq ft - 200 sq ft</MenuItem>
                      <MenuItem value="200 sq ft - 500 sq ft">200 sq ft - 500 sq ft</MenuItem>
                      <MenuItem value="500 sq ft - 1000 sq ft">500 sq ft - 1000 sq ft</MenuItem>
                      <MenuItem value="1000 sq ft - 1500 sq ft">1000 sq ft - 1500 sq ft</MenuItem>
                      <MenuItem value="1500 sq ft - 2000 sq ft">1500 sq ft - 2000 sq ft</MenuItem>
                      <MenuItem value="2000 sq ft - 3000 sq ft">2000 sq ft - 3000 sq ft</MenuItem>
                      <MenuItem value="3000 sq ft - 5000 sq ft">3000 sq ft - 5000 sq ft</MenuItem>
                      <MenuItem value="5000 sq ft - 7000 sq ft">5000 sq ft - 7000 sq ft</MenuItem>
                      <MenuItem value="7000 sq ft - 10000 sq ft">7000 sq ft - 10000 sq ft</MenuItem>
                      <MenuItem value="Above 10000 sq ft">Above 10000 sq ft</MenuItem>
                    </TextField>
                  )}

                  {/* Location Selection */}
                  <TextField
                    size="small"
                    label="Preferred State"
                    value={pref.preferredState || ""}
                    onChange={(e) => handleStateChange(prefIndex, e.target.value)}
                    disabled={!editMode || indiaData.length === 0}
                    select
                    fullWidth
                    required
                    error={editMode && !pref.preferredState}
                    helperText={editMode && !pref.preferredState ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {indiaData.map((state) => (
                      <MenuItem key={state.name} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    size="small"
                    label="Preferred District"
                    value={pref.preferredDistrict || ""}
                    onChange={(e) => handleDistrictChange(prefIndex, e.target.value)}
                    disabled={!editMode || !pref.preferredState}
                    select
                    fullWidth
                    required
                    error={editMode && !pref.preferredDistrict}
                    helperText={editMode && !pref.preferredDistrict ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select District</MenuItem>
                    {pref.preferredState &&
                      getDistrictsForState(pref.preferredState).map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                  </TextField>

                  <TextField
                    size="small"
                    label="Preferred City"
                    value={pref.preferredCity || ""}
                    onChange={(e) =>
                      handlePreferenceChange(
                        prefIndex,
                        "preferredCity",
                        e.target.value
                      )
                    }
                    disabled={!editMode || !pref.preferredDistrict}
                    select
                    fullWidth
                    required
                    error={editMode && !pref.preferredCity}
                    helperText={editMode && !pref.preferredCity ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {pref.preferredState &&
                      pref.preferredDistrict &&
                      getCitiesForDistrict(
                        pref.preferredState,
                        pref.preferredDistrict
                      ).map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                  </TextField>

                  {/* Category Selection */}
                  <Box mt={1}>
                    <Typography fontWeight={600} mb={1}>
                      Category
                    </Typography>

                    {pref.category?.map((cat, catIndex) => {
                      const mainCategory = categories.find(
                        (c) => c.name === cat.main
                      );
                      const subCategory = mainCategory?.children?.find(
                        (sub) => sub.name === cat.sub
                      );

                      return (
                        <Box
                          key={catIndex}
                          display="flex"
                          gap={1}
                          alignItems="center"
                          mb={1}
                        >
                          {editMode ? (
                            <>
                              <TextField
                                size="small"
                                placeholder="Main"
                                value={cat.main || ""}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    prefIndex,
                                    catIndex,
                                    "main",
                                    e.target.value
                                  )
                                }
                                sx={{ flex: 1 }}
                                select
                                required
                                error={editMode && !cat.main}
                                helperText={editMode && !cat.main ? "Required" : ""}
                              >
                                <MenuItem value="">Select Main</MenuItem>
                                {categories.map((mainCat) => (
                                  <MenuItem key={mainCat.name} value={mainCat.name}>
                                    {mainCat.name}
                                  </MenuItem>
                                ))}
                              </TextField>

                              <TextField
                                size="small"
                                placeholder="Sub"
                                value={cat.sub || ""}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    prefIndex,
                                    catIndex,
                                    "sub",
                                    e.target.value
                                  )
                                }
                                sx={{ flex: 1 }}
                                select
                                disabled={!cat.main}
                              >
                                <MenuItem value="">Select Sub</MenuItem>
                                {mainCategory?.children?.map((subCat) => (
                                  <MenuItem key={subCat.name} value={subCat.name}>
                                    {subCat.name}
                                  </MenuItem>
                                ))}
                              </TextField>

                              <TextField
                                size="small"
                                placeholder="Child"
                                value={cat.child || ""}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    prefIndex,
                                    catIndex,
                                    "child",
                                    e.target.value
                                  )
                                }
                                sx={{ flex: 1 }}
                                select
                                disabled={!cat.sub}
                              >
                                <MenuItem value="">Select Child</MenuItem>
                                {subCategory?.children?.map((child, idx) => (
                                  <MenuItem key={idx} value={child}>
                                    {child}
                                  </MenuItem>
                                ))}
                              </TextField>

                              {pref.category.length > 1 && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    removeCategory(prefIndex, catIndex)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </>
                          ) : (
                            <>
                              <Typography
                                sx={{
                                  flex: 1,
                                  bgcolor: "#e0e0e0",
                                  p: 1,
                                  borderRadius: 1,
                                }}
                              >
                                {cat.main || "N/A"}
                              </Typography>
                              <Typography
                                sx={{
                                  flex: 1,
                                  bgcolor: "#e0e0e0",
                                  p: 1,
                                  borderRadius: 1,
                                }}
                              >
                                {cat.sub || "N/A"}
                              </Typography>
                              <Typography
                                sx={{
                                  flex: 1,
                                  bgcolor: "#e0e0e0",
                                  p: 1,
                                  borderRadius: 1,
                                }}
                              >
                                {cat.child || "N/A"}
                              </Typography>
                            </>
                          )}
                        </Box>
                      );
                    })}

                    {/* {editMode && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => addCategory(prefIndex)}
                        sx={{ mt: 1 }}
                      >
                        Add Category
                      </Button>
                    )} */}
                  </Box>
                </Box>
              </Paper>
            ))}

            {editMode && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addPreference}
                sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
              >
                Add Preference
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <DialogTitle>OTP Verification</DialogTitle>
        <DialogContent>
          {otpStep === 1 && (
            <>
              <Typography>
                Please request OTP to verify your email to enable editing.
              </Typography>
              {errorMSG && (
                <Typography color="error" mt={1}>
                  {errorMSG}
                </Typography>
              )}
            </>
          )}

          {otpStep === 2 && (
            <>
              <Typography>Enter the OTP sent to your email:</Typography>
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                label="OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                error={!!otpError}
                helperText={otpError}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {otpStep === 1 && (
            <Button
              onClick={handleRequestOtp}
              disabled={requestOTP}
              variant="contained"
            >
              {requestOTP ? "Requesting..." : "Request OTP"}
            </Button>
          )}
          {otpStep === 2 && (
            <>
              <Button
                onClick={() => setOtpStep(1)}
                disabled={requestOTP}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                onClick={handleOtpVerify}
                disabled={requestOTP}
                variant="contained"
              >
                {requestOTP ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ManageProfile;
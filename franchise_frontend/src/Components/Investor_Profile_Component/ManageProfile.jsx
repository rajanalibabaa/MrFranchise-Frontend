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
  MenuItem ,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { categories } from "./BrandLIstingRegister/BrandCategories";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";


const ManageProfile = () => {
  const [investorData, setInvestorData] = useState({});
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
  const [reguestOTP, setreguestOTP] = useState(false);
  const [ErrorMSG, setErrorMSG] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    mobileNumber: "",
    whatsappNumber: "",
  });
  const [statesWithCities, setStatesWithCities] = useState({});
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  const formatNumber = (num) => {
    if (!num) return "";
    return num.replace(/^(\+91)?/, "").trim();
  };

 useEffect(() => {
    // Fetch city data
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json"
        );
        const citiesData = await response.json();

        // Filter for Indian cities only
        const indianCities = citiesData.filter(
          (city) => city.country_code === "IN"
        );

        // Group by state
        const grouped = {};
        indianCities.forEach((city) => {
          const state = city.state_name;
          if (!grouped[state]) {
            grouped[state] = [];
          }
          grouped[state].push(city.name);
        });

        // Sort states alphabetically
        const sortedStates = Object.keys(grouped).sort();

        setStatesWithCities(grouped);
        setStates(sortedStates);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  // Update cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      setCities(statesWithCities[selectedState]);
    } else {
      setCities([]);
    }
  }, [selectedState, statesWithCities]);

  return (
    <div>
      <h2>Select Indian State and City</h2>

      <label>
        State:
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">-- Select State --</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>

      {cities.length > 0 && (
        <label>
          City:
          <select>
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
};
  useEffect(() => {
    const fetchData = async () => {
      if (!investorUUID || !AccessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );

        if (response.data?.data) {
          const data = response.data.data;
          const formattedData = {
            ...data,
            mobileNumber: formatNumber(data.mobileNumber),
            whatsappNumber: formatNumber(data.whatsappNumber),
            preferences:
              data.preferences?.map((pref) => ({
                ...pref,
                category: Array.isArray(pref.category)
                  ? pref.category
                  : [],
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
    setreguestOTP(true);

    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/v1/otp/existingEmailOTP",
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
      setreguestOTP(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    setOtpError("");
    setErrorMSG("");
    setreguestOTP(true);

    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/v1/otp/verifyExistingEmailOTP",
        {
          email: investorData.email,
          verifyOTP: otp,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setEditMode(true);
        setOtpDialogOpen(false);
        setOtpStep(2);
      } else {
        setOtpError("Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("An error occurred during OTP verification.");
    } finally {
      setreguestOTP(false);
    }
  };

  const handleSave = async () => {
    const dataToUpdate = {
      ...investorData,
      mobileNumber: "+91" + formatNumber(investorData.mobileNumber),
      whatsappNumber: "+91" + formatNumber(investorData.whatsappNumber),
    };

    const errors = { mobileNumber: "", whatsappNumber: "" };
    let hasError = false;

    const validatePhone = (field) => {
      const number = formatNumber(dataToUpdate[field]);
      if (!/^\d{10}$/.test(number)) {
        errors[field] = "Number must be exactly 10 digits.";
        hasError = true;
      }
    };

    validatePhone("mobileNumber");
    validatePhone("whatsappNumber");

    setFieldErrors(errors);
    if (hasError) return;

    try {
      await axios.patch(
        `https://franchise-backend-wgp6.onrender.com/api/v1/investor/updateInvestor/${investorUUID}`,
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
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    }
  };

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

  const renderField = (label, key, isReadOnly = false) => {
    const value = investorData[key];
    const isPhoneField = key === "mobileNumber" || key === "whatsappNumber";
    const isReadOnlyField = isReadOnly || key === "country" || key === "email";

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
            />
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
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <TextField
                    size="small"
                    label="Investment Range"
                    value={pref.investmentRange || ""}
                    onChange={(e) =>
                      handlePreferenceChange(prefIndex, "investmentRange", e.target.value)
                    }
                    disabled={!editMode}
                    select
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {/* <option value="">Select Preferred Investment Range</option> */}
                    <option value="having amount">Having Investment Amount Ready</option>
                    <option value="take loan">Planning to take a Loan</option>
                    <option value="need loan">Need Loan Assistance</option>
                  </TextField>
                  <TextField
                    size="small"
                    label="Investment Amount"
                    value={pref.investmentAmount || ""}
                    onChange={(e) =>
                      handlePreferenceChange(prefIndex, "investmentAmount", e.target.value)
                    }
                    disabled={!editMode}
                     select
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {/* <option value="">
                        Select preferred Investment Amount
                      </option> */}
                      <option value="Below-50,000">Below - Rs.50 K</option>
                      <option value="Rs.50,000-2L">Rs.50 K - 2 L</option>
                      <option value="Rs.2L-5L">Rs.2 L - 5 L</option>
                      <option value="Rs.5L-10L">Rs.5 L - 10 L</option>
                      <option value="Rs.10L-20L">Rs.10 L - 20 L</option>
                      <option value="Rs.20L-30L">Rs.20 L - 30 L</option>
                      <option value="Rs.30L-50L">Rs.30 L - 50 L</option>
                      <option value="Rs.50L-1Cr">Rs.50 L - 1 Cr</option>
                      <option value="Rs.1Cr-2Cr">Rs.1 Cr - 2 Cr</option>
                      <option value="Rs.2Cr-5Cr">Rs.2 Cr - 5 Cr</option>
                      <option value="Rs.5Cr-above">Rs.5 Cr - Above</option>
                  </TextField>

                  <TextField
                    size="small"
                    label="Property Type"
                    value={pref.propertyType || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const newPrefs = [...(investorData.preferences || [])];
                      
                      // Update propertyType
                      newPrefs[prefIndex] = {
                        ...newPrefs[prefIndex],
                        propertyType: newValue
                      };
                      
                      // Clear propertySize if not "Own Property"
                      if (newValue !== "Own Property") {
                        newPrefs[prefIndex] = {
                          ...newPrefs[prefIndex],
                          propertySize: ""
                        };
                      }
                      
                      setInvestorData({ ...investorData, preferences: newPrefs });
                    }}
                    disabled={!editMode}
                    select
                    fullWidth
                  >
                    {/* <MenuItem value="">Select Property Type</MenuItem> */}
                    <MenuItem value="Own Property">Own Property</MenuItem>
                    <MenuItem value="Rental Property">Rental Property</MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    label="Property Size"
                    value={pref.propertySize || ""}
                    onChange={(e) =>
                      handlePreferenceChange(prefIndex, "propertySize", e.target.value)
                    }
                    disabled={!editMode || pref.propertyType !== "Own Property"}
                    select
                    fullWidth
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
                  
                  <TextField
                    size="small"
                    label="Preferred State"
                    value={pref.preferredState || ""}
                    onChange={(e) =>
                      handlePreferenceChange(prefIndex, "preferredState", e.target.value)
                    }
                    disabled={!editMode}
                  />
                  <TextField
                    size="small"
                    label="Preferred District"
                    value={pref.preferredDistrict || ""}
                    onChange={(e) =>
                      handlePreferenceChange(prefIndex, "preferredDistrict", e.target.value)
                    }
                    disabled={!editMode}
                  />
                  <TextField
                    size="small"
                    label="Preferred City"
                    value={pref.preferredCity || ""}
                    onChange={(e) =>
                      handlePreferenceChange(prefIndex, "preferredCity", e.target.value)
                    }
                    disabled={!editMode}
                  />

                  <Box mt={1}>
                    <Typography fontWeight={600} mb={1}>
                      Category
                    </Typography>

{pref.category?.map((cat, catIndex) => {
  // Find the selected main category object
  const mainCategory = categories.find((c) => c.name === cat.main);

  // Find the selected sub category object inside mainCategory
  const subCategory = mainCategory?.children?.find((sub) => sub.name === cat.sub);

  return (
    <Box key={catIndex} display="flex" gap={1} alignItems="center" mb={1}>
      {editMode ? (
        <>
          {/* MAIN Category */}
          <TextField
            size="small"
            placeholder="Main"
            value={cat.main || ""}
            onChange={(e) =>
              handleCategoryChange(prefIndex, catIndex, "main", e.target.value)
            }
            sx={{ flex: 1 }}
            select
            SelectProps={{ native: true }}
          >
            <option value="">Select Main</option>
            {categories.map((mainCat) => (
              <option key={mainCat.name} value={mainCat.name}>
                {mainCat.name}
              </option>
            ))}
          </TextField>

          {/* SUB Category */}
          <TextField
            size="small"
            placeholder="Sub"
            value={cat.sub || ""}
            onChange={(e) =>
              handleCategoryChange(prefIndex, catIndex, "sub", e.target.value)
            }
            sx={{ flex: 1 }}
            select
            SelectProps={{ native: true }}
            disabled={!mainCategory}
          >
            <option value="">Select Sub</option>
            {mainCategory?.children?.map((subCat) => (
              <option key={subCat.name} value={subCat.name}>
                {subCat.name}
              </option>
            ))}
          </TextField>

          {/* CHILD Category */}
          <TextField
            size="small"
            placeholder="Child"
            value={cat.child || ""}
            onChange={(e) =>
              handleCategoryChange(prefIndex, catIndex, "child", e.target.value)
            }
            sx={{ flex: 1 }}
            select
            SelectProps={{ native: true }}
            disabled={!subCategory}
          >
            <option value="">Select Child</option>
            {subCategory?.children?.map((child, idx) => (
              <option key={idx} value={child}>
                {child}
              </option>
            ))}
          </TextField>

          {/* Remove Button */}
          {pref.category.length > 1 && (
            <IconButton
              size="small"
              color="error"
              onClick={() => removeCategory(prefIndex, catIndex)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </>
      ) : (
        <>
          <Typography sx={{ flex: 1, bgcolor: "#e0e0e0", p: 1, borderRadius: 1 }}>
            {cat.main || "N/A"}
          </Typography>
          <Typography sx={{ flex: 1, bgcolor: "#e0e0e0", p: 1, borderRadius: 1 }}>
            {cat.sub || "N/A"}
          </Typography>
          <Typography sx={{ flex: 1, bgcolor: "#e0e0e0", p: 1, borderRadius: 1 }}>
            {cat.child || "N/A"}
          </Typography>
        </>
      )}
    </Box>
  );
})}

{/* Add Category Button */}
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


                    {editMode && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => addCategory(prefIndex)}
                        sx={{ mt: 1 }}
                      >
                        Add Category
                      </Button>
                    )}
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

      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <DialogTitle>OTP Verification</DialogTitle>
        <DialogContent>
          {otpStep === 1 && (
            <>
              <Typography>
                Please request OTP to verify your email to enable editing.
              </Typography>
              {ErrorMSG && (
                <Typography color="error" mt={1}>
                  {ErrorMSG}
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
              disabled={reguestOTP}
              variant="contained"
            >
              {reguestOTP ? "Requesting..." : "Request OTP"}
            </Button>
          )}
          {otpStep === 2 && (
            <>
              <Button
                onClick={() => setOtpStep(1)}
                disabled={reguestOTP}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                onClick={handleOtpVerify}
                disabled={reguestOTP}
                variant="contained"
              >
                {reguestOTP ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

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
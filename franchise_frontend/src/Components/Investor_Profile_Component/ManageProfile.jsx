
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl, InputLabel,ListItem, ListItemIcon, ListItemText,List,Stack
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { categories } from '../../Pages/Registration/BrandLIstingRegister/BrandCategories.jsx';

const ManageProfile = () => {
  const [investorData, setInvestorData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // OTP dialog and verification state
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [reguestOTP, setreguestOTP] = useState(false);
  const [ErrorMSG, setErrorMSG] = useState('');

  // Error states for field validation
  const [fieldErrors, setFieldErrors] = useState({
    mobileNumber: '',
    whatsappNumber: ''
  });

  const navigate = useNavigate();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  // Initialize category state with empty values
  // const [categoryState, setCategoryState] = useState({
  //   main: '',
  //   sub: '',
  //   child: ''
  // });

  // Fetch investor data
  useEffect(() => {
    const fetchData = async () => {
      if (!investorUUID || !AccessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
         ` http://51.20.81.150:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:` Bearer ${AccessToken}`,
            },
          }
        );
        if (response.data?.data) {
          const data = response.data.data;
          data.mobileNumber = data.mobileNumber?.replace('+91', '') || '';
          data.whatsappNumber = data.whatsappNumber?.replace('+91', '') || '';
          setInvestorData(data);
        }
      } catch (error) {
        console.error("Error fetching investor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investorUUID, AccessToken]);
          // Update category state from fetched data
  //         if (data.category) {
  //           let cat = data.category;
  //           if (Array.isArray(cat)) cat = cat[0] || {};
  //           setCategoryState({
  //             main: cat.main || '',
  //             sub: cat.sub || '',
  //             child: cat.child || ''
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching investor data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [investorUUID, AccessToken]);

  const handleEditToggle = () => {
    setOtpDialogOpen(true);
    setOtpStep(1);
    setOtp('');
    setOtpError('');
    setErrorMSG('');
    setContactValue(investorData.email || investorData.mobileNumber || '');
  };

  // Request OTP to email
  const handleRequestOtp = async () => {
    if (!contactValue) return;

    setErrorMSG('');
    setreguestOTP(true);

    try {
      const response = await axios.post(
        "http://51.20.81.150:5000/api/v1/otp/existingEmailOTP",
        { email: investorData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setOtpStep(2);
      } else {
        setErrorMSG(response.data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP request error:", error);
      setErrorMSG("An error occurred while requesting OTP.");
    } finally {
      setreguestOTP(false);
    }
  };

  // OTP verification
  const handleOtpVerify = async () => {
    if (!otp || otp.length === 0) {
      setOtpError("Please enter the OTP");
      return;
    }

    setOtpError('');
    setErrorMSG('');
    setreguestOTP(true);

    try {
      const response = await axios.post(
        "http://51.20.81.150:5000/api/v1/otp/verifyExistingEmailOTP",
        {
          email: investorData.email,
          verifyOTP: otp
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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

  // Save investor data
  const handleSave = async () => {
    const dataToUpdate = { 
      ...investorData,
      mobileNumber: '+91' + (investorData.mobileNumber || ''),
      whatsappNumber: '+91' + (investorData.whatsappNumber || ''),
    };
    
    const errors = { mobileNumber: '', whatsappNumber: '' };
    let hasError = false;

    const validatePhone = (field) => {
      const number = dataToUpdate[field]?.replace('+91', '').trim();
      if (!/^\d{10}$/.test(number)) {
        errors[field] = 'Number must be exactly 10 digits.';
        hasError = true;
      } else {
        dataToUpdate[field] = '+91' + number;
      }
    };

    validatePhone('mobileNumber');
    validatePhone('whatsappNumber');

    setFieldErrors(errors);

    if (hasError) return;

    try {
      await axios.patch(
       ` http://51.20.81.150:5000/api/v1/investor/updateInvestor/${investorUUID}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      setEditMode(false);
      setSnackbar({ open: true, message: "Profile successfully updated!", severity: "success" });
    } catch (error) {
      console.error("Error saving investor data:", error);
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    }
  };

  // Render category field
  // const renderCategoryField = (label) => {
  //   const displayValue = [categoryState.main, categoryState.sub, categoryState.child].filter(Boolean).join(' > ');

  //   // Find options for dropdowns
  //   const mainOptions = categories.map(c => c.name);
  //   const subOptions = categories.find(c => c.name === categoryState.main)?.children || [];
  //   const childOptions = subOptions.find(s => s.name === categoryState.sub)?.children || [];

  //   const handleCategoryChange = (type, newValue) => {
  //     const updatedCategory = { 
  //       main: type === 'main' ? newValue : categoryState.main,
  //       sub: type === 'sub' ? newValue : (type === 'main' ? '' : categoryState.sub),
  //       child: type === 'child' ? newValue : (type !== 'child' ? '' : categoryState.child)
  //     };

  //     setCategoryState(updatedCategory);

  //     // Also update the investorData with the new category
  //     setInvestorData(prev => ({
  //       ...prev,
  //       category: updatedCategory
  //     }));
  //   };

  //   return (
  //     <Box mb={2}>
  //       <Typography variant="subtitle2" fontWeight={600} gutterBottom>
  //         {label}
  //       </Typography>
  //       {editMode ? (
  //         <>
  //           <FormControl fullWidth size="small" sx={{ mb: 1 }}>
  //             <InputLabel>Main Category</InputLabel>
  //             <Select
  //               value={categoryState.main}
  //               label="Main Category"
  //               onChange={(e) => handleCategoryChange('main', e.target.value)}
  //             >
  //               {mainOptions.map(option => (
  //                 <MenuItem key={option} value={option}>{option}</MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //           <FormControl fullWidth size="small" sx={{ mb: 1 }} disabled={!categoryState.main}>
  //             <InputLabel>Sub Category</InputLabel>
  //             <Select
  //               value={categoryState.sub}
  //               label="Sub Category"
  //               onChange={(e) => handleCategoryChange('sub', e.target.value)}
  //               disabled={!categoryState.main}
  //             >
  //               {subOptions.map(option => (
  //                 <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //           <FormControl fullWidth size="small" disabled={!categoryState.sub}>
  //             <InputLabel>Child Category</InputLabel>
  //             <Select
  //               value={categoryState.child}
  //               label="Child Category"
  //               onChange={(e) => handleCategoryChange('child', e.target.value)}
  //               disabled={!categoryState.sub}
  //             >
  //               {(childOptions || []).map(option => (
  //                 <MenuItem key={option} value={option}>{option}</MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //         </>
  //       ) : (
  //         <Typography variant="body1" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}>
  //           {displayValue || 'Not selected'}
  //         </Typography>
  //       )}
  //     </Box>
  //   );
  // };

  // Render regular field
  const renderField = (label, key) => {
    const value = investorData[key];
    const isPhoneField = key === 'mobileNumber' || key === 'whatsappNumber';
    const isReadOnly = key === 'country' || key === 'email';

    let displayValue = '';
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (typeof value === 'object' && value !== null && key !== 'category') {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = value || '';
    }

    return (
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {label}
        </Typography>
        {editMode && !isReadOnly ? (
          <Box display="flex" alignItems="center">
            {isPhoneField && <Typography sx={{ mr: 1 }}>+91</Typography>}
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={value || ''}
              onChange={(e) => {
                setInvestorData({ ...investorData, [key]: e.target.value });
                setFieldErrors({ ...fieldErrors, [key]: '' });
              }}
              error={!!fieldErrors[key]}
              helperText={fieldErrors[key]}
            />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}>
            {isPhoneField ? `+91 ${displayValue}` : displayValue || '-----'}
          </Typography>
        )}
      </Box>
    );
  };

  // Render regular field
  // const renderField = (label, key) => {
  //   const value = investorData[key];
  //   const isPhoneField = key === 'mobileNumber' || key === 'whatsappNumber';
  //   const isReadOnly = key === 'country' || key === 'email';

  //   let displayValue = '';
  //   if (Array.isArray(value)) {
  //     displayValue = value.join(', ');
  //   } else if (typeof value === 'object' && value !== null && key !== 'category') {
  //     displayValue = JSON.stringify(value);
  //   } else {
  //     displayValue = value || '';
  //   }

  //   return (
  //     <Box mb={2}>
  //       <Typography variant="subtitle2" fontWeight={600} gutterBottom>
  //         {label}
  //       </Typography>
  //       {editMode && !isReadOnly ? (
  //         <Box display="flex" alignItems="center">
  //           {isPhoneField && <Typography sx={{ mr: 1 }}>+91</Typography>}
  //           <TextField
  //             fullWidth
  //             variant="outlined"
  //             size="small"
  //             value={value || ''}
  //             onChange={(e) => {
  //               setInvestorData({ ...investorData, [key]: e.target.value });
  //               setFieldErrors({ ...fieldErrors, [key]: '' });
  //             }}
  //             error={!!fieldErrors[key]}
  //             helperText={fieldErrors[key]}
  //           />
  //         </Box>
  //       ) : (
  //         <Typography variant="body1" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}>
  //           {isPhoneField ? `+91 ${displayValue}` : displayValue || '-----'}
  //         </Typography>
  //       )}
  //     </Box>
  //   );
  // };

  // Render preferences
  const renderPreferences = () => (
    <Box mb={2}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Preferences
      </Typography>
      {Array.isArray(investorData.preferences) && investorData.preferences.length > 0 ? (
        <List>
          {investorData.preferences.map((pref, idx) => (
            <ListItem key={idx} divider>
              <ListItemText
                primary={
                  <Stack spacing={0.5}>
                    <Typography variant="body2"><b>Category:</b> {pref.category}</Typography>
                    <Typography variant="body2"><b>Investment:</b> {pref.investmentRange} - {pref.investmentAmount}</Typography>
                    <Typography variant="body2"><b>Location:</b> {pref.preferredState} / {pref.preferredDistrict} / {pref.preferredCity}</Typography>
                    <Typography variant="body2"><b>Property:</b> {pref.propertyType}{pref.propertyType === "Own Property" ? ` (${pref.propertySize})` : ""}</Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">No preferences added yet.</Typography>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!investorData || Object.keys(investorData).length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Unable to load profile. Please login again{' '}
        <button onClick={() => navigate("/loginpage")}>Login</button>
      </Typography>
    );
  }
  // Investment options
  // const Investments = [
  //   "having amount",
  //   "take loan",
  //   "need loan",
  // ];

  // const renderInvestmentField = (label, key) => {
  //   const existingValue = investorData[key];
  //   let displayValue = '';

  //   if (Array.isArray(existingValue)) {
  //     displayValue = existingValue[0] || '';
  //   } else if (existingValue) {
  //     displayValue = existingValue;
  //   }

  //   return (
  //     <Box mb={2}>
  //       <Typography variant="subtitle2" fontWeight={600} gutterBottom>
  //         {label}
  //       </Typography>
  //       {editMode ? (
  //         <FormControl fullWidth size="small">
  //           <Select
  //             value={displayValue}
  //             onChange={(e) => {
  //               setInvestorData({ ...investorData, [key]: e.target.value });
  //             }}
  //           >
  //             {Investments.map((option) => (
  //               <MenuItem key={option} value={option}>
  //                 {option}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>
  //       ) : (
  //         <Typography
  //           variant="body1"
  //           sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}
  //         >
  //           {displayValue || '-----'}
  //         </Typography>
  //       )}
  //     </Box>
  //   );
  // };

  // if (loading) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (!investorData || Object.keys(investorData).length === 0) {
  //   return (
  //     <Typography variant="h6" align="center" mt={4}>
  //       Unable to load profile. Please login again{' '}
  //       <button onClick={() => navigate("/loginpage")}>Login</button>
  //     </Typography>
  //   );
  // }

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
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 4, width: '100%', maxWidth: 700 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={500}>Investor Profile</Typography>
            <Button
              variant="outlined"
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              onClick={editMode ? handleSave : handleEditToggle}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                py: 1,
              }}
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
            <Typography variant="h6">{investorData.firstName}</Typography>
          </Box>

          {/* Fields to render */}
          {renderField("First Name", "firstName")}
          {renderField("Email", "email", true)}
          {renderField("Mobile Number", "mobileNumber")}
          {renderField("Whatsapp Number", "whatsappNumber")}
          {renderField("State", "state")}
          {renderField("City", "city")}
          {renderField("Country", "country")}
          {renderField("Address", "address")}
          {renderField("Occupation", "occupation")}
          {renderField("Pincode", "pincode")}
{investorData.occupation === "Other" && renderField("Specify Occupation", "specifyOccupation")}  
        {renderPreferences()}
        </Paper>
      </Box>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Verification Required</DialogTitle>
        <DialogContent
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (otpStep === 1) {
                handleRequestOtp();
              } else if (otpStep === 2) {
                handleOtpVerify();
              }
            }
          }}
        >
          {ErrorMSG && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {ErrorMSG}
            </Typography>
          )}

          {otpStep === 1 ? (
            <>
              <TextField
                fullWidth
                label="Email"
                value={contactValue}
                margin="normal"
                disabled
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleRequestOtp}
                sx={{ mt: 2 }}
                disabled={reguestOTP}
              >
                {reguestOTP ? "LOADING..." : "REQUEST OTP"}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" mb={1}>
                Enter the OTP sent to <strong>{contactValue}</strong>
              </Typography>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={!!otpError}
                helperText={otpError}
                margin="normal"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleOtpVerify}
                sx={{ mt: 2 }}
                disabled={reguestOTP}
              >
                {reguestOTP ? "VERIFYING..." : "VERIFY OTP"}
              </Button>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ManageProfile;


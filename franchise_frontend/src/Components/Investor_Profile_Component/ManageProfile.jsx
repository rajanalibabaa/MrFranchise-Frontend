import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl, InputLabel, ListItem, ListItemText, List, Stack
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

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

  // Format phone numbers by removing +91 if present
  const formatNumber = (num) => {
    if (!num) return '';
    return num.replace('+91', '').trim();
  };

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
            // Format preferences if they exist
            preferences: data.preferences?.map(pref => ({
              ...pref,
              // Handle category formatting
              category: Array.isArray(pref.category) 
                ? pref.category[0]?.main 
                  ? `${pref.category[0].main}${pref.category[0].sub ? ` > ${pref.category[0].sub}` : ''}${pref.category[0].child ? ` > ${pref.category[0].child}` : ''}`
                  : pref.category.join(', ')
                : pref.category || ''
            })) || []
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
        "https://franchise-backend-wgp6.onrender.com/api/v1/otp/existingEmailOTP",
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
        "https://franchise-backend-wgp6.onrender.com/api/v1/otp/verifyExistingEmailOTP",
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
      setSnackbar({ open: true, message: "Profile successfully updated!", severity: "success" });
    } catch (error) {
      console.error("Error saving investor data:", error);
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    }
  };

  // Render regular field
  const renderField = (label, key, isReadOnly = false) => {
    const value = investorData[key];
    const isPhoneField = key === 'mobileNumber' || key === 'whatsappNumber';
    const isReadOnlyField = isReadOnly || key === 'country' || key === 'email';

    let displayValue = '';
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = value || '';
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

  // Render preferences
  // const renderPreferences = () => (
  //   <Box mb={2}>
  //     <Typography variant="subtitle2" fontWeight={600} gutterBottom>
  //       Preferences
  //     </Typography>
  //     {investorData.preferences?.length > 0 ? (
  //       <List>
  //         {investorData.preferences.map((pref, idx) => (
  //           <ListItem key={idx} divider sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
  //             <Stack spacing={1} sx={{ width: "100%" }}>
  //               {/* Category */}
  //               <Typography variant="body2" fontWeight={600}>Category</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.category || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].category = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.category || '-----'}</Typography>
  //               )}

  //               {/* Investment Range */}
  //               <Typography variant="body2" fontWeight={600}>Investment Range</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.investmentRange || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].investmentRange = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.investmentRange || '-----'}</Typography>
  //               )}

  //               {/* Investment Amount */}
  //               <Typography variant="body2" fontWeight={600}>Investment Amount</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.investmentAmount || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].investmentAmount = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.investmentAmount || '-----'}</Typography>
  //               )}

  //               {/* Location */}
  //               <Typography variant="body2" fontWeight={600}>Preferred State</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.preferredState || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].preferredState = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.preferredState || '-----'}</Typography>
  //               )}

  //               <Typography variant="body2" fontWeight={600}>Preferred District</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.preferredDistrict || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].preferredDistrict = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.preferredDistrict || '-----'}</Typography>
  //               )}

  //               <Typography variant="body2" fontWeight={600}>Preferred City</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.preferredCity || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].preferredCity = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.preferredCity || '-----'}</Typography>
  //               )}

  //               {/* Property Type */}
  //               <Typography variant="body2" fontWeight={600}>Property Type</Typography>
  //               {editMode ? (
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   value={pref.propertyType || ''}
  //                   onChange={e => {
  //                     const updated = [...investorData.preferences];
  //                     updated[idx].propertyType = e.target.value;
  //                     setInvestorData({ ...investorData, preferences: updated });
  //                   }}
  //                 />
  //               ) : (
  //                 <Typography variant="body2">{pref.propertyType || '-----'}</Typography>
  //               )}

  //               {/* Property Size */}
  //               {pref.propertyType === "Own Property" && (
  //                 <>
  //                   <Typography variant="body2" fontWeight={600}>Property Size</Typography>
  //                   {editMode ? (
  //                     <TextField
  //                       fullWidth
  //                       size="small"
  //                       value={pref.propertySize || ''}
  //                       onChange={e => {
  //                         const updated = [...investorData.preferences];
  //                         updated[idx].propertySize = e.target.value;
  //                         setInvestorData({ ...investorData, preferences: updated });
  //                       }}
  //                     />
  //                   ) : (
  //                     <Typography variant="body2">{pref.propertySize || '-----'}</Typography>
  //                   )}
  //                 </>
  //               )}
  //             </Stack>
  //           </ListItem>
  //         ))}
  //       </List>
  //     ) : (
  //       <Typography variant="body2" color="text.secondary">No preferences added yet.</Typography>
  //     )}
  //   </Box>
  // );

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
            <Typography variant="h6">{investorData.inveterID}</Typography>

          </Box>

          {/* Fields to render */}
          {renderField("First Name", "firstName")}
          {renderField("Email", "email", true)}
          {renderField("Mobile Number", "mobileNumber")}
          {renderField("Whatsapp Number", "whatsappNumber")}
          {renderField("State", "state")}
          {renderField("City", "city")}
          {renderField("Country", "country", true)}
          {renderField("Address", "address")}
          {renderField("Occupation", "occupation")}
          {renderField("Pincode", "pincode")}
          {investorData.occupation === "Other" && renderField("Specify Occupation", "specifyOccupation")}
          {renderField('investmentRange','investmentRange')}
          {renderField('investmentAmount','investmentAmount')}
          {renderField('propertyType','propertyType')}
          {renderField('propertySize','propertySize')}
          {renderField('preferredState','preferredState')}
          {renderField('preferredCity','preferredCity')}


         
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

// import React, { useState, useEffect } from 'react';
// import {
//   Box, Typography, Paper, Avatar, CircularProgress,
//   Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
//   MenuItem, Select, FormControl, InputLabel, Divider,
//   Stack, Chip, Grid, IconButton, Tooltip
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Save as SaveIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationOnIcon,
//   Work as WorkIcon,
//   AttachMoney as AttachMoneyIcon,
//   Home as HomeIcon,
//   VerifiedUser as VerifiedIcon,
//   ArrowBack as ArrowBackIcon
// } from "@mui/icons-material";
// import axios from "axios";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import { useSelector } from "react-redux";
// import { useNavigate } from 'react-router-dom';

// const ManageProfile = () => {
//   const [investorData, setInvestorData] = useState({
//     firstName: '',
//     email: '',
//     mobileNumber: '',
//     whatsappNumber: '',
//     occupation: '',
//     specifyOccupation: '',
//     address: '',
//     city: '',
//     state: '',
//     country: 'India',
//     pincode: '',
//     investmentRange: '',
//     investmentAmount: '',
//     propertyType: '',
//     propertySize: '',
//     preferredState: '',
//     preferredCity: '',
//     preferredDistrict: '',
//     inveterID: ''
//   });
  
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [otpDialogOpen, setOtpDialogOpen] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     mobileNumber: '',
//     whatsappNumber: '',
//     pincode: ''
//   });

//   const navigate = useNavigate();
//   const investorUUID = useSelector((state) => state.auth?.investorUUID);
//   const AccessToken = useSelector((state) => state.auth?.AccessToken);

//   // Options for select fields
//   const investmentRanges = [
//     "Less than ₹50L",
//     "₹50L-1Cr",
//     "₹1Cr-2Cr",
//     "₹2Cr-5Cr",
//     "₹5Cr-10Cr",
//     "More than ₹10Cr"
//   ];

//   const propertySizes = [
//     "Less than 1000 sq ft",
//     "1000-3000 sq ft",
//     "3000-5000 sq ft",
//     "5000-10000 sq ft",
//     "More than 10000 sq ft"
//   ];

//   const propertyTypes = [
//     "Own Property",
//     "Rented Property",
//     "Looking for Property"
//   ];

//   const occupationOptions = [
//     "Business Owner", 
//     "Professional", 
//     "Investor", 
//     "Retired", 
//     "Other"
//   ];

//   // Fetch investor data
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!investorUUID || !AccessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${investorUUID}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${AccessToken}`,
//             },
//           }
//         );
//         if (response.data?.data) {
//           const data = response.data.data;
//           const formattedData = {
//             firstName: data.firstName || "",
//             email: data.email || "",
//             mobileNumber: data.mobileNumber?.replace('+91', '') || '',
//             whatsappNumber: data.whatsappNumber?.replace('+91', '') || '',
//             occupation: data.occupation || "",
//             specifyOccupation: data.occupation === "Other" ? data.specifyOccupation || "" : "",
//             address: data.address || "",
//             city: data.city || "",
//             state: data.state || "",
//             country: data.country || "India",
//             pincode: data.pincode || "",
//             category: data.category || "",
//             investmentRange: data.investmentRange || "",
//             investmentAmount: data.investmentAmount || "",
//             propertyType: data.propertyType || "",
//             propertySize: data.propertyType === "Own Property" ? data.propertySize || "" : "",
//             preferredState: data.preferredState || "",
//             preferredCity: data.preferredCity || "",
//             preferredDistrict: data.preferredDistrict || "",
//             inveterID: data.inveterID || ""
//           };
//           setInvestorData(formattedData);
//         }
//       } catch (error) {
//         console.error("Error fetching investor data:", error);
//         setSnackbar({ open: true, message: "Failed to load profile data", severity: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [investorUUID, AccessToken]);

//   const handleEditToggle = () => {
//     setOtpDialogOpen(true);
//     setOtp('');
//     setOtpError('');
//     setOtpSent(false);
//   };

//   const handleRequestOtp = async () => {
//     setIsSubmitting(true);
//     setOtpError('');
//     try {
//       const response = await axios.post(
//         "https://franchise-backend-wgp6.onrender.com/api/v1/otp/existingEmailOTP",
//         { email: investorData.email },
//         { 
//           headers: { 
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AccessToken}`
//           } 
//         }
//       );

//       if (response.data.success) {
//         setOtpSent(true);
//         setSnackbar({ open: true, message: "OTP sent to your registered email", severity: "success" });
//       } else {
//         setOtpError(response.data.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       console.error("OTP request error:", error);
//       setOtpError("An error occurred while requesting OTP");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleOtpVerify = async () => {
//     if (!otp || otp.length !== 6) {
//       setOtpError("Please enter a valid 6-digit OTP");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(
//         "https://franchise-backend-wgp6.onrender.com/api/v1/otp/verifyExistingEmailOTP",
//         {
//           email: investorData.email,
//           verifyOTP: otp
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AccessToken}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         setEditMode(true);
//         setOtpDialogOpen(false);
//         setSnackbar({ open: true, message: "Verified successfully. You can now edit your profile.", severity: "success" });
//       } else {
//         setOtpError(response.data.message || "Invalid OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       setOtpError("Verification failed. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const validateField = (name, value) => {
//     switch (name) {
//       case 'mobileNumber':
//       case 'whatsappNumber':
//         return /^\d{10}$/.test(value) ? '' : 'Must be 10 digits';
//       case 'pincode':
//         return /^\d{6}$/.test(value) ? '' : 'Must be 6 digits';
//       default:
//         return '';
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setInvestorData(prev => ({ ...prev, [name]: value }));
//     setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const handleSave = async () => {
//     // Validate all fields before submission
//     const errors = {
//       mobileNumber: validateField('mobileNumber', investorData.mobileNumber),
//       whatsappNumber: validateField('whatsappNumber', investorData.whatsappNumber),
//       pincode: validateField('pincode', investorData.pincode)
//     };

//     setFieldErrors(errors);

//     if (Object.values(errors).some(err => err)) {
//       setSnackbar({ open: true, message: "Please correct the errors before saving", severity: "error" });
//       return;
//     }

//     const dataToUpdate = {
//       ...investorData,
//       mobileNumber: '+91' + investorData.mobileNumber,
//       whatsappNumber: '+91' + investorData.whatsappNumber
//     };

//     setIsSubmitting(true);
//     try {
//       await axios.patch(
//         `https://franchise-backend-wgp6.onrender.com/api/v1/investor/updateInvestor/${investorUUID}`,
//         dataToUpdate,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AccessToken}`,
//           },
//         }
//       );
//       setEditMode(false);
//       setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
//     } catch (error) {
//       console.error("Error saving investor data:", error);
//       setSnackbar({ open: true, message: "Failed to update profile", severity: "error" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderField = (label, name, icon, options = null, isPhone = false, isTextArea = false) => {
//     const value = investorData[name] || '';
//     const error = fieldErrors[name] || '';

//     return (
//       <Grid item xs={12} sm={6}>
//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <InputLabel shrink sx={{ color: 'text.primary', fontWeight: 600 }}>
//             {label}
//           </InputLabel>
//           {editMode ? (
//             options ? (
//               <Select
//                 name={name}
//                 value={value}
//                 onChange={handleChange}
//                 sx={{
//                   borderRadius: '8px',
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: error ? 'error.main' : 'divider'
//                   }
//                 }}
//               >
//                 {options.map(option => (
//                   <MenuItem key={option} value={option}>{option}</MenuItem>
//                 ))}
//               </Select>
//             ) : (
//               <TextField
//                 name={name}
//                 value={value}
//                 onChange={handleChange}
//                 error={!!error}
//                 helperText={error}
//                 multiline={isTextArea}
//                 rows={isTextArea ? 3 : 1}
//                 InputProps={{
//                   startAdornment: isPhone && (
//                     <Typography sx={{ mr: 1 }}>+91</Typography>
//                   ),
//                   sx: {
//                     borderRadius: '8px',
//                     '& fieldset': {
//                       borderColor: error ? 'error.main' : 'divider'
//                     }
//                   }
//                 }}
//               />
//             )
//           ) : (
//             <Paper
//               variant="outlined"
//               sx={{
//                 p: 2,
//                 borderRadius: '8px',
//                 minHeight: '56px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 bgcolor: 'action.hover'
//               }}
//             >
//               {icon && React.cloneElement(icon, { sx: { mr: 2, color: 'text.secondary' } })}
//               <Typography>
//                 {isPhone && value ? `+91 ${value}` : value || 'Not specified'}
//               </Typography>
//             </Paper>
//           )}
//         </FormControl>
//       </Grid>
//     );
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   if (!investorData || !investorData.inveterID) {
//     return (
//       <Box textAlign="center" mt={8}>
//         <Typography variant="h5" gutterBottom>
//           Profile Not Found
//         </Typography>
//         <Typography variant="body1" color="text.secondary" mb={3}>
//           Please login again to access your investor profile
//         </Typography>
//         <Button
//           variant="contained"
//           onClick={() => navigate("/loginpage")}
//           startIcon={<ArrowBackIcon />}
//           sx={{ borderRadius: '8px', px: 4 }}
//         >
//           Go to Login
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 } }}>
//       {/* Header Section */}
//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h4" fontWeight={700} gutterBottom>
//           Investor Profile
//         </Typography>
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Chip
//             label={`ID: ${investorData.inveterID}`}
//             color="inherit"
//             size="medium"
//             sx={{ fontWeight: 900 }}
//           />
//           <Chip
//             label="Verified"
//             color="success"
//             size="small"
//             icon={<VerifiedIcon fontSize="small" />}
//             sx={{ fontWeight: 600 }}
//           />
//         </Stack>
//       </Box>

//       {/* Profile Header */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
//         <Avatar
//           sx={{
//             width: 80,
//             height: 80,
//             mr: 3,
//             fontSize: 32,
//             bgcolor: 'primary.main'
//           }}
//         >
//           {investorData.firstName.charAt(0)}
//         </Avatar>
//         <Box flexGrow={1}>
//           <Typography variant="h5" fontWeight={600}>
//             {investorData.firstName}
//           </Typography>
//           <Typography color="text.secondary">
//             {investorData.occupation === 'Other' 
//               ? investorData.specifyOccupation 
//               : investorData.occupation}
//           </Typography>
//         </Box>
//         <Button
//           variant={editMode ? "contained" : "outlined"}
//           startIcon={editMode ? <SaveIcon /> : <EditIcon />}
//           onClick={editMode ? handleSave : handleEditToggle}
//           disabled={isSubmitting}
//           sx={{
//             borderRadius: '8px',
//             px: 3,
//             textTransform: 'none',
//             fontWeight: 600
//           }}
//         >
//           {editMode ? "Save Changes" : "Edit Profile"}
//         </Button>
//       </Box>

//       <Divider sx={{ my: 3 }} />

//       {/* Personal Information */}
//       <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//         <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//         Personal Information
//       </Typography>
      
//       <Grid container spacing={3}>
//         {renderField("First Name", "firstName", null)}
//         {renderField("Email", "email", <EmailIcon />, null, false)}
//         {renderField("Mobile Number", "mobileNumber", <PhoneIcon />, null, true)}
//         {renderField("WhatsApp Number", "whatsappNumber", <PhoneIcon />, null, true)}
//         {renderField("Occupation", "occupation", <WorkIcon />, occupationOptions)}
//         {investorData.occupation === 'Other' && 
//           renderField("Specify Occupation", "specifyOccupation", null)}
//       </Grid>

//       <Divider sx={{ my: 4 }} />

//       {/* Address Information */}
//       <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//         <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//         Address Information
//       </Typography>
      
//       <Grid  spacing={3}>
//         {renderField("Address", "address", null, null, false, true)}
//         {renderField("City", "city", null)}
//         {renderField("State", "state", null)}
//         {renderField("Country", "country", null)}
//         {renderField("Pincode", "pincode", null)}
//       </Grid>

//       <Divider sx={{ my: 4 }} />

//       {/* Investment Preferences */}
//       <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//         <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//         Investment Preferences
//       </Typography>
      
//       <Grid  spacing={3}>
//         {renderField("Investment Range", "investmentRange", null, investmentRanges)}
//         {renderField("Investment Amount", "investmentAmount", null)}
//       </Grid>

//       <Divider sx={{ my: 4 }} />

//       {/* Property Information */}
//       <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
//         <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//         Property Information
//       </Typography>
      
//       <Grid container spacing={3}>
//         {renderField("Property Type", "propertyType", null, propertyTypes)}
//         {investorData.propertyType === 'Own Property' && 
//           renderField("Property Size", "propertySize", null, propertySizes)}
//         {renderField("Preferred State", "preferredState", null)}
//         {renderField("Preferred District", "preferredDistrict", null)}
//         {renderField("Preferred City", "preferredCity", null)}
//       </Grid>

//       {/* OTP Verification Dialog */}
//       <Dialog
//         open={otpDialogOpen}
//         onClose={() => setOtpDialogOpen(false)}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 3 }
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 600 }}>
//           {otpSent ? "Enter Verification Code" : "Verify Your Identity"}
//         </DialogTitle>
//         <DialogContent>
//           {otpSent ? (
//             <>
//               <Typography variant="body1" gutterBottom>
//                 We've sent a 6-digit verification code to:
//               </Typography>
//               <Typography fontWeight={600} gutterBottom>
//                 {investorData.email}
//               </Typography>
              
//               <TextField
//                 fullWidth
//                 label="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 error={!!otpError}
//                 helperText={otpError}
//                 margin="normal"
//                 sx={{ mt: 2 }}
//                 inputProps={{ maxLength: 6 }}
//               />
//             </>
//           ) : (
//             <>
//               <Typography variant="body1" gutterBottom>
//                 For security, we need to verify your identity before allowing edits.
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 An OTP will be sent to your registered email:
//               </Typography>
//               <Typography fontWeight={600} gutterBottom>
//                 {investorData.email}
//               </Typography>
//             </>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button
//             onClick={() => setOtpDialogOpen(false)}
//             sx={{ borderRadius: '8px' }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={otpSent ? handleOtpVerify : handleRequestOtp}
//             disabled={isSubmitting || (otpSent && (!otp || otp.length !== 6))}
//             sx={{ borderRadius: '8px' }}
//           >
//             {isSubmitting ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <MuiAlert
//           elevation={6}
//           variant="filled"
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ borderRadius: 2 }}
//         >
//           {snackbar.message}
//         </MuiAlert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ManageProfile;
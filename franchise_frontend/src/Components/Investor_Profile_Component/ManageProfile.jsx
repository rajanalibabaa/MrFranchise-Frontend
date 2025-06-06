import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem,Select,FormControl,InputLabel,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {categories} from '../../Pages/Registration/BrandLIstingRegister/BrandCategories.jsx'

const ManageProfile = () => {
  const [investorData, setInvestorData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

 // OTP dialog and verification state
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [reguestOTP, setreguestOTP] = useState(false);
  const [ErrorMSG, setErrorMSG] = useState('');


  // ✨ New: Error states for field validation
  const [fieldErrors, setFieldErrors] = useState({
    mobileNumber: '',
    whatsappNumber: ''
  });

  const navigate = useNavigate();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

    const [mainCategory, setMainCategory] = useState('');
const [subCategory, setSubCategory] = useState('');
const [childCategory, setChildCategory] = useState('');


// Sync dropdowns when investorData.category changes (e.g. after save)
useEffect(() => {
  const value = investorData.category || {};
  setMainCategory(value.main || '');
  setSubCategory(value.sub || '');
  setChildCategory(value.child || '');
}, [investorData.category]);

    // 🔄 Fetch investor data
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

  const handleEditToggle = () => {
    setOtpDialogOpen(true);
    setOtpStep(1);
    setOtp('');
    setOtpError('');
    setErrorMSG('');
    setContactValue(investorData.email || investorData.mobileNumber || '');
  };

    // 📩 Request OTP to email
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

    // ✅ OTP verification
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

  // ✨ Updated: Validate numbers and show inline field error
  const handleSave = async () => {
    const dataToUpdate = { ...investorData };
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
       ` https://franchise-backend-wgp6.onrender.com/api/v1/investor/updateInvestor/${investorUUID}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
      setEditMode(false);
    } catch (error) {
      console.error("Error saving investor data:", error);
    }
  };

    const renderCategoryField = (label, key) => {
  const value = investorData[key] || {};
  let displayValue = [value.main, value.sub, value.child].filter(Boolean).join(' > ');

  // Find options for dropdowns
  const mainOptions = categories.map(c => c.name);
  const subOptions = categories.find(c => c.name === mainCategory)?.children || [];
  const childOptions = subOptions.find(s => s.name === subCategory)?.children || [];

  const handleCategoryChange = (type, newValue) => {
    if (type === 'main') {
      setMainCategory(newValue);
      setSubCategory('');
      setChildCategory('');
      setInvestorData({
        ...investorData,
        [key]: { main: newValue, sub: '', child: '' }
      });
    } else if (type === 'sub') {
      setSubCategory(newValue);
      setChildCategory('');
      setInvestorData({
        ...investorData,
        [key]: { main: mainCategory, sub: newValue, child: '' }
      });
    } else if (type === 'child') {
      setChildCategory(newValue);
      setInvestorData({
        ...investorData,
        [key]: { main: mainCategory, sub: subCategory, child: newValue }
      });
    }
  };


//     return (
//       <Box mb={2}>
//         <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//           {label}
//         </Typography>
//         {editMode ? (
//           <FormControl fullWidth size="small">
//             <Select
//               value={displayValue || ''}
//               onChange={(e) => {
//                 // Split the selected value back into main/sub categories
//                 const [main, sub] = e.target.value.split(' > ');
//                 setInvestorData({ 
//                   ...investorData, 
//                   [key]: { main, sub } 
//                 });
//               }}
//             >
//               {categories.flatMap(mainCategory => 
//   (mainCategory.children || []).map(subCategory => ({
//     main: mainCategory.name,
//     sub: subCategory.name,
//     label: ${mainCategory.name} > ${subCategory.name}
//   }))
// ).map(category => (
//                 <MenuItem key={category.label} value={category.label}>
//                   {category.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         ) : (
//           <Typography variant="body1" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}>
//             {displayValue || '-----'}
//           </Typography>
//         )}
//       </Box>
//     );
//   };

  // ✨ Updated: Email field is read-only, and inline errors for phone fields
  
   return (
    <Box mb={2}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}
      </Typography>
      {editMode ? (
        <>
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel>Main Category</InputLabel>
            <Select
              value={mainCategory}
              label="Main Category"
              onChange={(e) => handleCategoryChange('main', e.target.value)}
            >
              {mainOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
             </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 1 }} disabled={!mainCategory}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={subCategory}
              label="Sub Category"
              onChange={(e) => handleCategoryChange('sub', e.target.value)}
              disabled={!mainCategory}
            >
              {subOptions.map(option => (
                <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" disabled={!subCategory}>
            <InputLabel>Subchild</InputLabel>
            <Select
              value={childCategory}
              label="Subchild"
              onChange={(e) => handleCategoryChange('child', e.target.value)}
              disabled={!subCategory}
            >
              {(childOptions || []).map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        <Typography variant="body1" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}>
          {displayValue}
        </Typography>
      )}
    </Box>
  );
};
  
  const renderField = (label, key) => {
    const value = investorData[key];
    const isPhoneField = key === 'mobileNumber' || key === 'whatsappNumber';
    const isReadOnly = key === 'country' || key === 'email';

    let displayValue = '';
    if (Array.isArray(value)) {
      if (key === 'category') {
        displayValue = value
          .map(item => [item.main, item.sub, item.child].filter(Boolean).join(' > '))
          .join(', ');
      } else {
        displayValue = value.join(', ');
      }
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
                setFieldErrors({ ...fieldErrors, [key]: '' }); // clear on change
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

    // 📊 Dropdown values
  const Investments =[
    "having amount",
    "take loan",
    "need loan",
  ];

  const renderInvestmentField = (label, key) => {
  const existingValue = investorData[key];
  let displayValue = '';

  if (Array.isArray(existingValue)) {
    displayValue = existingValue[0] || '';
  } else if (existingValue) {
    displayValue = existingValue;
  }

    return (
      <Box mb={2}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}
      </Typography>
      {editMode ? (
        <FormControl fullWidth size="small">
          <Select
            value={displayValue}
            onChange={(e) => {
              setInvestorData({ ...investorData, [key]: e.target.value })
            }}
          >
            {Investments.map((option) => (
              <MenuItem key={option} value={option}>
                
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography
          variant="body1"
          sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}
        >
          {displayValue || '-----'}
        </Typography>
      )}
    </Box>
  );
};

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
          {renderField("Email", "email")} {/* ✨ Email now read-only */}
          {renderField("Mobile Number", "mobileNumber")}
          {renderField("Whatsapp Number", "whatsappNumber")}
          {renderField("State", "state")}
          {renderField("Address", "address")}
          {renderCategoryField("Category", "categor")}
          {renderField("City", "city")}
          {renderField("Country", "country")}
          {/* {renderField("Preffered Investment ", "investmentRange")} */}
          {renderInvestmentField("Preferred Investment ", "investmentRange")}
          {/* {renderField("Looking For", "lookingFor")} */}
          {renderField("Occupation", "occupation")}
          {renderField("Pincode", "pincode")}
          {renderField("Property Type", "propertyType")}
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
    </Box>
  );
};

export default ManageProfile;
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl, InputLabel, Divider, Chip, IconButton,
  Badge, useMediaQuery, useTheme
} from "@mui/material";
import {
  Edit, Save, Email, Phone, WhatsApp, LocationOn,
  Home, Work, Public, Category, AttachMoney, Close
} from '@mui/icons-material';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { categories } from '../../Pages/Registration/BrandLIstingRegister/BrandCategories.jsx';
import { styled } from '@mui/system';

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  maxWidth: '900px',
  margin: '0 auto',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: '#4caf50',
  color: 'white'
}));

const FieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  minWidth: '180px',
  fontWeight: 600,
  color: '#555',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1)
  }
}));

const FieldValue = styled(Box)(({ theme, editMode }) => ({
  flex: 1,
  backgroundColor: editMode ? 'transparent' : '#f5f7fa',
  padding: editMode ? 0 : theme.spacing(1.5),
  borderRadius: '8px',
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center'
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: 'white',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3d8b40'
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: '#4caf50',
  color: '#4caf50',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(76, 175, 80, 0.08)'
  }
}));

const ManageProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [investorData, setInvestorData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [requestOTP, setRequestOTP] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    mobileNumber: '',
    whatsappNumber: ''
  });
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [childCategory, setChildCategory] = useState('');

  const navigate = useNavigate();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

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
          data.mobileNumber = data.mobileNumber?.replace('+91', '') || '';
          data.whatsappNumber = data.whatsappNumber?.replace('+91', '') || '';
          setInvestorData(data);
          
          // Set category values
          const category = data.category || {};
          setMainCategory(category.main || '');
          setSubCategory(category.sub || '');
          setChildCategory(category.child || '');
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
    if (editMode) {
      setEditMode(false);
    } else {
      setOtpDialogOpen(true);
      setOtpStep(1);
      setOtp('');
      setOtpError('');
      setErrorMSG('');
      setContactValue(investorData.email || '');
    }
  };

  const handleRequestOtp = async () => {
    if (!contactValue) return;

    setErrorMSG('');
    setRequestOTP(true);

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
      setRequestOTP(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length === 0) {
      setOtpError("Please enter the OTP");
      return;
    }

    setOtpError('');
    setErrorMSG('');
    setRequestOTP(true);

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
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("An error occurred during OTP verification.");
    } finally {
      setRequestOTP(false);
    }
  };

  const handleSave = async () => {
    const dataToUpdate = { ...investorData };
    const errors = { mobileNumber: '', whatsappNumber: '' };
    let hasError = false;

    const validatePhone = (field) => {
      const number = dataToUpdate[field]?.replace('+91', '').trim();
      if (!/^\d{10}$/.test(number)) {
        errors[field] = 'Must be 10 digits';
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
      
    } catch (error) {
      console.error("Error saving investor data:", error);
    }
  };

  const renderField = (label, key, icon, isPhone = false, isReadOnly = false) => {
    const value = investorData[key] || '';
    const error = fieldErrors[key];

    return (
      <FieldContainer>
        <FieldLabel>
          {icon} <Box component="span" ml={1}>{label}</Box>
        </FieldLabel>
        <FieldValue editMode={editMode && !isReadOnly}>
          {editMode && !isReadOnly ? (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={value}
              onChange={(e) => {
                setInvestorData({ ...investorData, [key]: e.target.value });
                setFieldErrors({ ...fieldErrors, [key]: '' });
              }}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: isPhone && <Typography sx={{ mr: 1 }}>+91</Typography>,
              }}
            />
          ) : (
            <Typography>
              {isPhone ? `+91 ${value}` : value || 'Not provided'}
            </Typography>
          )}
        </FieldValue>
      </FieldContainer>
    );
  };

  const renderCategoryField = () => {
    const mainOptions = categories.map(c => c.name);
    const subOptions = categories.find(c => c.name === mainCategory)?.children || [];
    const childOptions = subOptions.find(s => s.name === subCategory)?.children || [];
    const displayValue = [mainCategory, subCategory, childCategory].filter(Boolean).join(' > ');

    const handleCategoryChange = (type, newValue) => {
      if (type === 'main') {
        setMainCategory(newValue);
        setSubCategory('');
        setChildCategory('');
        setInvestorData({
          ...investorData,
          category: { main: newValue, sub: '', child: '' }
        });
      } else if (type === 'sub') {
        setSubCategory(newValue);
        setChildCategory('');
        setInvestorData({
          ...investorData,
          category: { main: mainCategory, sub: newValue, child: '' }
        });
      } else if (type === 'child') {
        setChildCategory(newValue);
        setInvestorData({
          ...investorData,
          category: { main: mainCategory, sub: subCategory, child: newValue }
        });
      }
    };

    return (
      <FieldContainer>
        <FieldLabel>
          <Category /> <Box component="span" ml={1}>Investment Category</Box>
        </FieldLabel>
        <FieldValue editMode={editMode}>
          {editMode ? (
            <Box width="100%" display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Main</InputLabel>
                <Select
                  value={mainCategory}
                  onChange={(e) => handleCategoryChange('main', e.target.value)}
                  label="Main"
                >
                  {mainOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" disabled={!mainCategory}>
                <InputLabel>Sub</InputLabel>
                <Select
                  value={subCategory}
                  onChange={(e) => handleCategoryChange('sub', e.target.value)}
                  label="Sub"
                  disabled={!mainCategory}
                >
                  {subOptions.map(option => (
                    <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" disabled={!subCategory}>
                <InputLabel>Child</InputLabel>
                <Select
                  value={childCategory}
                  onChange={(e) => handleCategoryChange('child', e.target.value)}
                  label="Child"
                  disabled={!subCategory}
                >
                  {childOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Typography>{displayValue || 'Not selected'}</Typography>
          )}
        </FieldValue>
      </FieldContainer>
    );
  };

  const renderInvestmentField = () => {
    const investmentOptions = ["having amount", "take loan", "need loan"];
    const value = investorData.investmentRange || '';

    return (
      <FieldContainer>
        <FieldLabel>
          <AttachMoney /> <Box component="span" ml={1}>Investment Type</Box>
        </FieldLabel>
        <FieldValue editMode={editMode}>
          {editMode ? (
            <FormControl fullWidth size="small">
              <Select
                value={value}
                onChange={(e) => setInvestorData({ ...investorData, investmentRange: e.target.value })}
              >
                {investmentOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>{value || 'Not specified'}</Typography>
          )}
        </FieldValue>
      </FieldContainer>
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
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          Unable to load profile
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/loginpage")}
          sx={{ mt: 2 }}
        >
          Please login again
        </Button>
      </Box>
    );
  }

  return (
    <DashboardContainer>
      <ProfileCard>
        <SectionHeader>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {investorData.firstName}
              </Typography>
              <Typography variant="body2">
                Investor Profile
              </Typography>
            </Box>
          </Box>
          {editMode ? (
            <PrimaryButton 
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Changes
            </PrimaryButton>
          ) : (
            <SecondaryButton 
              startIcon={<Edit />}
              onClick={handleEditToggle}
              variant="contained"
              color="primary"
              sx={{ backgroundColor: '#4caf50', color: 'white' } }
            >
              Edit Profile
            </SecondaryButton>
          )}
        </SectionHeader>

        <Box p={4}>
          {/* Personal Info Section */}
          <Typography variant="h6" fontWeight={600} mb={3} color="#4caf50">
            Personal Information
          </Typography>
          {renderField("First Name", "firstName", <Work />)}
          {renderField("Email", "email", <Email />, false, true)}
          {renderField("Mobile", "mobileNumber", <Phone />, true)}
          {renderField("WhatsApp", "whatsappNumber", <WhatsApp />, true)}
          {renderField("Occupation", "occupation", <Work />)}

          <Divider sx={{ my: 4 }} />

          {/* Location Info Section */}
          <Typography variant="h6" fontWeight={600} mb={3} color="#4caf50">
            Location Information
          </Typography>
          {renderField("Address", "address", <Home />)}
          {renderField("City", "city", <LocationOn />)}
          {renderField("State", "state", <LocationOn />)}
          {renderField("Pincode", "pincode", <LocationOn />)}
          {renderField("Country", "country", <Public />, false, true)}
          {renderField("Property Type", "propertyType", <Home />)}

          <Divider sx={{ my: 4 }} />

          {/* Investment Preferences */}
          <Typography variant="h6" fontWeight={600} mb={3} color="#4caf50">
            Investment Preferences
          </Typography>
          {renderCategoryField()}
          {renderInvestmentField()}
        </Box>
      </ProfileCard>

      {/* OTP Verification Dialog */}
      <Dialog 
        open={otpDialogOpen} 
        onClose={() => setOtpDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ backgroundColor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight={600}>Profile Edit Verification</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {errorMSG && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {errorMSG}
            </Typography>
          )}

          {otpStep === 1 ? (
            <>
              <Typography variant="body1" mb={3}>
                For security reasons, we need to verify your identity before allowing profile edits.
              </Typography>
              <TextField
                fullWidth
                label="Registered Email"
                value={contactValue}
                margin="normal"
                disabled
              />
              <PrimaryButton
                fullWidth
                onClick={handleRequestOtp}
                sx={{ mt: 2 }}
                disabled={requestOTP}
              >
                {requestOTP ? "Sending OTP..." : "Send Verification Code"}
              </PrimaryButton>
            </>
          ) : (
            <>
              <Typography variant="body1" mb={2}>
                We've sent a 6-digit verification code to:
              </Typography>
              <Typography variant="h6" fontWeight={600} mb={3} color="#4caf50">
                {contactValue}
              </Typography>
              <TextField
                fullWidth
                label="Enter Verification Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={!!otpError}
                helperText={otpError}
                margin="normal"
              />
              <PrimaryButton
                fullWidth
                onClick={handleOtpVerify}
                sx={{ mt: 2 }}
                disabled={requestOTP}
              >
                {requestOTP ? "Verifying..." : "Verify & Continue Editing"}
              </PrimaryButton>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setOtpDialogOpen(false)}
            sx={{ color: '#757575' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
};

export default ManageProfile;
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const ManageProfile = () => {
  const [investorData, setInvestorData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
 console.log('Investor UUID:', investorUUID);
 console.log('Access Token:', AccessToken);
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
        if (response.data && response.data.data) {
          const data = response.data.data;
          if (data.mobileNumber?.startsWith('+91')) {
            data.mobileNumber = data.mobileNumber.replace('+91', '');
          }
          if (data.whatsappNumber?.startsWith('+91')) {
            data.whatsappNumber = data.whatsappNumber.replace('+91', '');
          }
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

   console.log('Investor Data:', investorData);

  const handleEditToggle = () => {
    setOtpDialogOpen(true);
    setOtpStep(1);
    setOtp('');
    setOtpError('');
    setContactValue(investorData.email || investorData.mobileNumber || '');
  };

  const handleRequestOtp = () => {
    if (!contactValue) return;
    console.log("Sending OTP to:", contactValue);
    setOtpStep(2);
  };

  const handleOtpVerify = () => {
    if (otp === '123456') {
      setEditMode(true);
      setOtpDialogOpen(false);
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleSave = async () => {
    const dataToUpdate = { ...investorData };
    if (dataToUpdate.mobileNumber && !dataToUpdate.mobileNumber.startsWith('+91')) {
      dataToUpdate.mobileNumber = '+91' + dataToUpdate.mobileNumber.trim();
    }
    if (dataToUpdate.whatsappNumber && !dataToUpdate.whatsappNumber.startsWith('+91')) {
      dataToUpdate.whatsappNumber = '+91' + dataToUpdate.whatsappNumber.trim();
    }

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

  const renderField = (label, key) => {
    const isPhoneField = key === 'mobileNumber' || key === 'whatsappNumber';
    const isReadOnly = key === 'country';

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
              value={investorData[key] || ''}
              onChange={(e) =>
                setInvestorData({ ...investorData, [key]: e.target.value })
              }
            />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}>
            {isPhoneField ? `+91 ${investorData[key] || ''}` : investorData[key] || ''}
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

          {/* Render Fields */}
          {renderField("First Name", "firstName")}
          {renderField("Email", "email")}
          {renderField("Mobile Number", "mobileNumber")}
          {renderField("Whatsapp Number", "whatsappNumber")}
          {renderField("State", "state")}
          {renderField("Address", "address")}
          {renderField("Category", "category")}
          {renderField("City", "city")}
          {renderField("Country", "country")}
          {/* {renderField("District", "district")} */}
          {renderField("Investment Range", "investmentRange")}
          {renderField("Looking For", "lookingFor")}
          {renderField("Occupation", "occupation")}
          {renderField("Pincode", "pincode")}
          {renderField("Property Type", "propertytype")}
        </Paper>
      </Box>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Verification Required</DialogTitle>
        <DialogContent>
          {otpStep === 1 ? (
            <>
              <TextField
                fullWidth
                label="Email or Phone Number"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                margin="normal"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleRequestOtp}
                sx={{ mt: 2 }}
              >
                REQUEST OTP
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
              >
                VERIFY OTP
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
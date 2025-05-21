import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box, TextField, Typography, Paper, Button} from "@mui/material";

const BrandListingController = ({ brandData = {} }) => {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isOtpVerifyOpen, setIsOtpVerifyOpen] = useState(false);
  const [correctOtp] = useState('123456'); // Replace with backend check

  const isValidPhone = (value) => /^[0-9]{10,}$/.test(value);
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSendOtp = () => {
    if (!isValidPhone(contact) && !isValidEmail(contact)) {
      setError('Please enter a valid phone number or email address.');
      return;
    }
    setError('');
    setOtpSent(true);
    console.log(`OTP sent to ${contact}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === correctOtp) {
      setError('');
      setIsOtpVerifyOpen(false);
      navigate('/brandlistingform');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleOtpModal = () => {
    setIsOtpVerifyOpen(true);
    setOtp('');
    setOtpSent(false);
    setError('');
    setContact('');
  };

//   const renderField = (label, value) => (
//     <Typography><strong>{label}:</strong> {value || 'N/A'}</Typography>
//   );

  return (
    <div style={{ display: "flex", marginTop: -30 }}>
      <Box
        sx={{
          p: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: 4,
          boxShadow: 3,
          mx: "auto",
          mt: 4,
          padding: 10,
          height: "auto",
          width: "100%",
        }}
      >
        {isOtpVerifyOpen && (
          <div style={{
            backgroundColor: 'white',
            position: "fixed",
            top: "40%",
            right: "3%",
            zIndex: 5,
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
          }}>
            <Box sx={{ width: 300, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Phone or Email"
                variant="outlined"
                fullWidth
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {otpSent && (
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
              {error && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                  {error}
                </Typography>
              )}
              <Button
                onClick={otpSent ? handleSubmit : handleSendOtp}
                sx={{ backgroundColor: "#007bff", color: "#fff", fontWeight: 600 }}
              >
                {otpSent ? 'Verify OTP' : 'Request OTP'}
              </Button>
            </Box>
          </div>
        )}

        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#333" }}
        >
          Brand Listing
        </Typography>

        <Button
          sx={{
            backgroundColor: "#f29724",
            color: "#fafafa",
            ml: 120,
            ":hover": { backgroundColor: "#fb8c00" },
            width: "200px"
          }}
          onClick={handleOtpModal}
        >
          Edit Profile
        </Button>

        {/* Brand Details */}
        {/* <Box mt={3}>
          <Typography variant="h5" fontWeight={700}>Brand Details</Typography>
          <Paper sx={{ p: 2, mt: 2 }}>
            {Object.entries(brandData).slice(0, 20).map(([key, value]) => (
              renderField(key, value)
            ))}
          </Paper>
        </Box> */}

        
        <Box mt={3}>
          <Typography variant="h5" fontWeight={700}>Brand Details</Typography>
          <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd", marginTop: 2, marginLeft: -5 }}>
            <Typography><strong>companyname:</strong> {brandData.companyname}</Typography>
            <Typography><strong>brandname:</strong> {brandData.brandname}</Typography>
            <Typography><strong>gstin:</strong> {brandData.gstin}</Typography>
            <Typography><strong>categories:</strong> {brandData.categories}</Typography>
            <Typography><strong>ownername:</strong> {brandData.ownername}</Typography>
            <Typography><strong>description:</strong> {brandData.description}</Typography>
            <Typography><strong>address:</strong> {brandData.address}</Typography>
            <Typography><strong>country:</strong> {brandData.country}</Typography>
            <Typography><strong>pincode:</strong> {brandData.pincode}</Typography>
            <Typography><strong>location:</strong> {brandData.location}</Typography>
            <Typography><strong>mobilenumber:</strong> {brandData.mobilenumber}</Typography>
            <Typography><strong>whatsappnumber:</strong> {brandData.whatsappnumber}</Typography>
            <Typography><strong>website:</strong> {brandData.website}</Typography>
            <Typography><strong>facebook:</strong> {brandData.facebook}</Typography>
            <Typography><strong>instagram:</strong> {brandData.instagram}</Typography>
            <Typography><strong>linkedin:</strong> {brandData.linkedin}</Typography>
            <Typography><strong>establishedyear:</strong> {brandData.establishedyear}</Typography>
            <Typography><strong>franchisesinceyear:</strong> {brandData.franchisesinceyear}</Typography>
          </Paper>

          <Box>
            <Typography sx={{ fontWeight: 700, marginLeft: -4 }}>
              <h2>Expansion Plan</h2>
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd", marginTop: 2, marginLeft: -5 }}>
              <Typography><strong>expansiontype:</strong> {brandData.expansiontype}</Typography>
              <Typography><strong>selectedcounteries:</strong> {brandData.selectedcounteries}</Typography>
              <Typography><strong>selectedstates:</strong> {brandData.selectedstates}</Typography>
              <Typography><strong>selectedcities:</strong> {brandData.selectedcities}</Typography>
              <Typography><strong>selectedindianstates:</strong> {brandData.selectedindianstates}</Typography>
              <Typography><strong>selsectedindiandistricts:</strong> {brandData.selsectedindiandistricts}</Typography>
            </Paper>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, marginLeft: -4 }}>
              <h2>Franchise Model</h2>
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd", marginTop: 2, marginLeft: -5 }}>
              <Typography sx={{ textAlign: "center" }}><h2>Investment Details</h2></Typography>
              <Typography><strong>totalinvestment:</strong> {brandData.totalinvestment}</Typography>
              <Typography><strong>franchisefee:</strong> {brandData.franchisefee}</Typography>
              <Typography><strong>royaltyfee:</strong> {brandData.royaltyfee}</Typography>
              <Typography><strong>equipmentcost:</strong> {brandData.equipmentcost}</Typography>
              <Typography><strong>expectedrevenue:</strong> {brandData.expectedrevenue}</Typography>
              <Typography><strong>expectedprofit:</strong> {brandData.expectedprofit}</Typography>
              <Typography><strong>spacerequired:</strong> {brandData.spacerequired}</Typography>
              <Typography><strong>paybackperiod:</strong> {brandData.paybackperiod}</Typography>
              <Typography><strong>minimumcashrequired:</strong> {brandData.minimumcashrequired}</Typography>

              <Typography sx={{ textAlign: "center" }}><h2>Outlet Distribution</h2></Typography>
              <Typography><strong>companyownedoutlets:</strong> {brandData.companyownedoutlets}</Typography>
              <Typography><strong>franchiseoutlets:</strong> {brandData.franchiseoutlets}</Typography>
              <Typography><strong>totaloutlets:</strong> {brandData.totaloutlets}</Typography>

              <Typography sx={{ textAlign: "center" }}><h2>Expansion Plans</h2></Typography>
              <Typography><strong>targetcities:</strong> {brandData.targetcities}</Typography>
              <Typography><strong>targetstates:</strong> {brandData.targetstates}</Typography>
              <Typography><strong>expansionfranchisefee:</strong> {brandData.expansionfranchisefee}</Typography>
              <Typography><strong>expansionroyalty:</strong> {brandData.expansionroyalty}</Typography>
              <Typography><strong>paymentterms:</strong> {brandData.paymentterms}</Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default BrandListingController;

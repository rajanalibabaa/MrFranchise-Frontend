import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import illustration from "../../assets/Images/Login_illustration.jpg";
// import FacebookIcon from "../../assets/images/FacebookIcon.png";
// import LinkedInIcon from "../../assets/images/LinkedinIcon.png";
// import InstagramIcon from "../../assets/images/InstagramIcon.png";
// import TwitterIcon from "../../assets/images/TwitterIcon.png";
// import GoogleIcon from "../../assets/images/GoogleIcon.png";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.username) &&
      !/^\d{10}$/.test(formData.username)
    ) {
      newErrors.username = "Invalid email or phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOtpRequest = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const isEmail = formData.username.includes("@");
    const payload = isEmail
      ? { email: formData.username.trim() }
      : {mobileNumber: "+91" + formData.username.trim() };

      console.log(payload);

    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/v1/login/generateOTPforLogin",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSnackbar({ open: true, message: "OTP sent successfully!", severity: "success" });
        setIsOtpSent(true);
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }

    setIsLoading(true);
    const isEmail = formData.username.includes("@");
    const payload = {
      verifyOtp: formData.otp,
      [isEmail ? "email" : "phone"]: isEmail ? formData.username.trim() : "+91" + formData.username.trim(),
    };

    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/v1/login/",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("response :",response)
      if (response.data.success) {
        setSnackbar({ open: true, message: "Login successful! Redirecting...", severity: "success" });
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isOtpSent ? handleVerifyOtp() : handleOtpRequest();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid container sx={{ mt: 8, px: 3, py: 5 }}>
      <Grid item xs={12} md={6} sx={{ p: 6 }}>
        <Box component="img" src={illustration} alt="Login Illustration" sx={{ width: "100%", maxWidth: 500 }} />
      </Grid>

      <Grid item xs={12} md={6} sx={{ p: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/")} sx={{ position: "absolute", 
      top: 16,
      left: 16, 
      bgcolor: "#FFC107", 
      '&:hover': { bgcolor: "#FFA000" }, }}>
          <ArrowBack sx={{ color: "white" }} />
        </IconButton>

        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center">Welcome Back!</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>Please log in to your account to continue.</Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or Phone Number"
              id="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isOtpSent || isLoading}
              sx={{ mb: 2 }}
            />

            {isOtpSent && (
              <TextField
                fullWidth
                label="OTP"
                id="otp"
                value={formData.otp}
                onChange={handleChange}
                error={!!errors.otp}
                helperText={errors.otp}
                disabled={isLoading}
                sx={{ mb: 2 }}
              />
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2, height: "48px", bgcolor: "#007BFF", '&:hover': { bgcolor: "#0056b3" } }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : isOtpSent ? "Verify OTP" : "Request OTP"}
            </Button>
          </form>

          {isOtpSent && (
            <Typography variant="body2" textAlign="center" mb={2}>
              Didn't receive OTP?{' '}
              <Link component="button" onClick={handleOtpRequest} color="primary">Resend OTP</Link>
            </Typography>
          )}

          <Typography variant="body2" textAlign="center" my={2}>
            Don't have an account?{' '}
            <Link href="/registerhandleuser" color="primary">Register here</Link>
          </Typography>

          {/* <Box textAlign="center" my={4}>
            <Typography variant="subtitle1" gutterBottom>Sign In with</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              {[FacebookIcon, LinkedInIcon, InstagramIcon, TwitterIcon, GoogleIcon].map((icon, idx) => (
                <IconButton key={idx} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
                  <Avatar src={icon} sx={{ width: 32, height: 32 }} />
                </IconButton>
              ))}
            </Box>
          </Box> */}
        </Box>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Grid>
  );
}

export default LoginPage;

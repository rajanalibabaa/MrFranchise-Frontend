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
  Avatar,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import illustration from "../../assets/Images/Login_illustration.jpg";
import FacebookIcon from "../../assets/images/FacebookIcon.png";
import LinkedInIcon from "../../assets/images/LinkedinIcon.png";
import InstagramIcon from "../../assets/images/InstagramIcon.png";
import TwitterIcon from "../../assets/images/TwitterIcon.png";
import GoogleIcon from "../../assets/images/GoogleIcon.png";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", otp: "" });
  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // Clear errors for the field
  };

  const socialIcons = {
    facebook: FacebookIcon,
    linkedin: LinkedInIcon,
    instagram: InstagramIcon,
    twitter: TwitterIcon,
    google: GoogleIcon,
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.username) &&
      !/^\d{10}$/.test(formData.username)
    ) {
      newErrors.username = "Invalid email or phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return; // Stop execution if validation fails
    // }

    const isEmail = formData.username.includes("@");
    const email = isEmail ? formData.username : null;
    const mobileNumber = isEmail ? null : formData.username;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/investor/generateOTPforInvestor",
        {
          email,
          mobileNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("OTP response:", response.data.success);
      setIsOtpSent(response.data.success);
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
      setErrors((prev) => ({
        ...prev,
        username: "Failed to send OTP. Please try again.",
      }));
    }
  };
console.log("isOtpSent:", isOtpSent);
  const validateOtp = async () => {
    if (!formData.otp) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP is required",
      }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/investor/login",
        {
          verifyOtp: formData.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        console.log("OTP verified successfully");
        navigate("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: "Invalid OTP. Please try again.",
        }));
      }
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response?.data || error.message
      );
      setErrors((prev) => ({
        ...prev,
        otp: "Failed to verify OTP. Please try again.",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOtpSent) {
      await validateOtp(); // Validate OTP if it has been sent
    } else {
      handleOtpRequest(e); // Request OTP if it hasn't been sent
    }
  };

  return (
    <Grid
      container
      sx={{
        marginTop: "70px",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "20px",
      }}
    >
      {/* Left Side - Illustration */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          margin:"0 20px"
        }}
      >
        <Box
          component="img"
          src={illustration}
          alt="Login Illustration"
          sx={{
            width: "100%",
            maxWidth: 500,
            height: "auto",
          }}
        />
      </Grid>

      {/* Right Side - Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          borderRadius: 2,
          boxShadow: 3,
          margin:"0 100px"

        }}
      >
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            bgcolor: "#FFC107",
            "&:hover": { bgcolor: "#FFA000" },
          }}
        >
          <ArrowBack sx={{ color: "white" }} />
        </IconButton>

        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, textAlign: "center" }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Please log in to your account to continue.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email/Phone Number"
              id="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isOtpSent}
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
                sx={{ mb: 2 }}
              />
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mb: 2,
                bgcolor: "#007BFF",
                "&:hover": { bgcolor: "#0056b3" },
              }}
            >
              {isOtpSent ? "Login" : "Request OTP"}
            </Button>
          </form>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ my: 2, color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Link href="/registerhandleuser" color="primary" fontWeight={500}>
              Register here
            </Link>
          </Typography>

          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Sign In with
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {Object.entries(socialIcons).map(([platform, icon]) => (
                <IconButton
                  key={platform}
                  onClick={() =>
                    window.open(`https://${platform}.com/login`, "_blank")
                  }
                  sx={{
                    p: 1.5,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Avatar
                    src={icon}
                    sx={{
                      width: 32,
                      height: 32,
                      "& img": { objectFit: "contain" },
                    }}
                  />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;

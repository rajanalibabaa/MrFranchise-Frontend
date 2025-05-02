import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import businessLogo from "../../assets/images/Business_logo.png";
import FacebookIcon from "../../Assets/Images/FacebookIcon.png";
import LinkedInIcon from "../../Assets/Images/LinkedinIcon.png";
import InstagramIcon from "../../Assets/Images/InstagramIcon.png";
import TwitterIcon from "../../Assets/Images/TwitterIcon.png";
import GoogleIcon from "../../Assets/Images/GoogleIcon.png";

function RegisterHandleUser() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const openSocialMedia = (url) => {
    window.open(url, "_blank");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "#ffffff",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* Right Section - Logo */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          height: { xs: "30vh", sm: "40vh", md: "92vh" },
        }}
      >
        <Box
          component="img"
          src={businessLogo}
          alt="Business Logo"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 2,
            maxHeight: "100%",
          }}
        />
      </Grid>

      {/* Left Section - Buttons and Links */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            mt: { xs: 0, md: "-10%" },
            color: "#333333",
            textAlign: "center",
          }}
        >
          Register User
        </Typography>

        <Button
          variant="contained"
          onClick={() => handleNavigation("/investor-register")}
          sx={{
            mb: 2,
            bgcolor: "#e99830",
            "&:hover": {
              bgcolor: "#7ad03a",
            },
            width: "100%",
            maxWidth: 250,
          }}
        >
          Investor Register
        </Button>

        <Button
          variant="contained"
          onClick={() => handleNavigation("/brand-register")}
          sx={{
            mb: 2,
            bgcolor: "#e99830",
            "&:hover": {
              bgcolor: "#7ad03a",
            },
            width: "100%",
            maxWidth: 250,
          }}
        >
          Brand Register
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Box
            component="a"
            href="/loginpage"
            sx={{
              textDecoration: "none",
              color: "#007bff",
              "&:hover": {
                color: "#0056b3",
              },
            }}
          >
            Sign In
          </Box>
        </Typography>

        {/* Social Media Section */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1, fontSize: isMobile ? 14 : 16 }}>
            Follow us on:
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { icon: GoogleIcon, url: "https://accounts.google.com/" },
              { icon: FacebookIcon, url: "https://www.facebook.com/login" },
              { icon: InstagramIcon, url: "https://www.instagram.com/accounts/login/" },
              { icon: LinkedInIcon, url: "https://www.linkedin.com/login" },
              { icon: TwitterIcon, url: "https://twitter.com/login" },
            ].map((item, index) => (
              <Grid item key={index}>
                <Box
                  component="img"
                  src={item.icon}
                  alt="social icon"
                  onClick={() => openSocialMedia(item.url)}
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
}

export default RegisterHandleUser;
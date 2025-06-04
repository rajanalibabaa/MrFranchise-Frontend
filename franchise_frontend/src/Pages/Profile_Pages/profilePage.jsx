import React from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { Box, Button } from "@mui/material";
import img from "../../assets/Images/brandLogo.jpg";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: "#fff",
          boxShadow: 3,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Box>
          {/* Clickable Logo */}
          <Box sx={{ textAlign: "center", mb: 2, borderRadius: 2 }}>
            <RouterLink to="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 250,
                  mx: "1px",
                  my: 3,
                  ml: -1,
                  mt: 1,
                  p: 1,
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  border: "2px solid transparent",
                  // backgroundImage:
                  //   "linear-gradient(white, white), linear-gradient(90deg, #f29724, #e2faa7)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <img
                  src={img}
                  alt="Profile"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "12px",
                  }}
                />
              </Box>

            </RouterLink>
          </Box>

          {/* Upgrade and Nav Links */}
          {/* <Button
            variant="contained"
            color="secondary"
            sx={{ width: "100%", mb: 2, backgroundColor: "#f29724" }}
          >
            Upgrade Account
          </Button> */}

          <RouterLink to="/investordashboard" style={navLinkStyle}>Dashboard</RouterLink>
          <RouterLink to="/investordashboard/manageProfile" style={navLinkStyle}>Manage Profile</RouterLink>
          <RouterLink to="/investordashboard/respondemanager" style={navLinkStyle}>Reach Us</RouterLink>
          {/* <RouterLink to="/investordashboard/upgradeaccount" style={navLinkStyle}> Upgrade Account</RouterLink> */}
        </Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "100%", mb: 2, backgroundColor: "#f29724" }}
          onClick={() => navigate('/investordashboard/upgradeaccount')}
        >
          Upgrade Account
        </Button>
        {/* Footer Links */}
        {/* <Box sx={{ mt: "auto", textAlign: "center" }}>
          <RouterLink
            to="/investordashboard/feedBack"
            style={{ ...navLinkStyle, color: "#fafafa", backgroundColor: "#ffab00" }}
          >
            Feedback
          </RouterLink>
          <RouterLink
            to="/investordashboard/complaint"
            style={{ ...navLinkStyle, color: "#fafafa", backgroundColor: "#ffab00" }}
          >
            Complaint
          </RouterLink>
        </Box> */}
      </Box>

      {/* Right Content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

const navLinkStyle = {
  display: "block",
  textDecoration: "none",
  color: "#333",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
};

export default ProfilePage;

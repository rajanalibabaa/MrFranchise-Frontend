import React from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { Box, Button, Breadcrumbs, Typography, Link } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const IconBreadcrumbs = () => {
  const handleClick = (event) => {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  };

  return (
    <Box
      role="presentation"
      onClick={handleClick}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        pb: 1,
        mb: 2,
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: "#558b2f",
        padding: 2,
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" sx={{ px: 1, color: "#fff" }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          HOME
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Core
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          MUI
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Page
        </Link>
      </Breadcrumbs>
    </Box>
  );
};

const ProfilePage = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>

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
          height: "100vh", // Ensures full height
          boxSizing: "border-box",
        }}
      >
        {/* Top Section */}
        <Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "100%", mb: 2, backgroundColor: "#ffab00" }}
          >
            Upgrade Account
          </Button>

          <RouterLink to="/dashboard" style={navLinkStyle}>Dashboard</RouterLink>
          <RouterLink to="/dashboard/PostRequirement" style={navLinkStyle}>Post Requirement</RouterLink>
          <RouterLink to="/dashboard/manageProfile" style={navLinkStyle}>Manage Profile</RouterLink>
          <RouterLink to="/dashboard/respondemanager" style={navLinkStyle}>Response Manager</RouterLink>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ mt: "auto", textAlign: "center" }}>
          <RouterLink to="/dashboard/feedBack" style={{ ...navLinkStyle, color: "#fafafa", backgroundColor: "#ffab00" }}>
            Feedback
          </RouterLink>
          <RouterLink to="/dashboard/complaint" style={{ ...navLinkStyle, color: "#fafafa", backgroundColor: "#ffab00" }}>
            Complaint
          </RouterLink>

        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <IconBreadcrumbs />
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

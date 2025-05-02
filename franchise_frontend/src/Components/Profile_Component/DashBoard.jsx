import React from 'react'
import { Box, Button, TextField, Typography, Avatar, Tabs, Tab } from "@mui/material";
import { useState } from "react";

import PersonIcon from '@mui/icons-material/Person';
const DashBoard= ({ selectedSection, sectionContent }) => {
    const [tabValue, setTabValue] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
  
  return (
    <div>

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
        {/* Sidebar */}
        {/* <Box>
          <ProfilePage />
        </Box> */}

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {selectedSection ? (
            sectionContent[selectedSection]
          ) : (
            <Box sx={{ display: "flex", gap: 4 }}>
             
              <Box sx={{ width: 240,height:200 ,textAlign: "center", bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2 }}>
                <Avatar sx={{
                  width: 200,
                  height: 200,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "transparent",
                  objectFit: "cover",
                  img: {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                  }
                }}>
                  <img src={'img'} alt="Profile" style={{ width: "140%", height: "105%", borderRadius: "50%" }} />
                  <PersonIcon fontSize="large" />
                </Avatar>
                {/* <Button variant="outlined" fullWidth onClick={() => setSelectedSection("Manage profile")}>
                Edit
              </Button> */}
              </Box>

              {/* Profile Info */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 3, bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2, width: "90%", textAlign: "center",height: "30%" }}>
                  <Typography variant="h5" fontWeight={600}>
                    Welcome (Manikandan.M)
                  </Typography>
                  <Typography color="text.secondary">Investor</Typography>
                </Box>

                {/* <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 2,
                    bgcolor: "#fff",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    width: "195%",
                  }}
                >
                  <TextField label="Name" placeholder="Enter your name" size="small" />
                  <TextField label="Email" type="email" placeholder="Enter your Email" size="small" />
                  <TextField label="Mobile" placeholder="Enter your Mobile" size="small" />
                  <TextField label="State" placeholder="Enter your State" size="small" />
                </Box> */}
              </Box>
            </Box>
          )}

          {/* Dashboard metrics */}
          {selectedSection === "Dashboard" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Dashboard
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ flex: 1, bgcolor: "#fff", p: 2, borderRadius: 2, textAlign: "center", boxShadow: 1 }}>
                  <Typography variant="h6">0</Typography>
                  <Typography color="text.secondary">Expressed Interest</Typography>
                </Box>
                <Box sx={{ flex: 1, bgcolor: "#fff", p: 2, borderRadius: 2, textAlign: "center", boxShadow: 1 }}>
                  <Typography variant="h6">1/04/2025</Typography>
                  <Typography color="text.secondary">Member Since</Typography>
                </Box>
                <Box sx={{ flex: 1, bgcolor: "#fff", p: 2, borderRadius: 2, textAlign: "center", boxShadow: 1 }}>
                  <Typography variant="h6">Basic (Membership)</Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                    Upgrade Account
                  </Button>
                </Box>
              </Box>

              <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                  <Tab label="Expressed Interest" />
                  <Tab label="Viewed Brands" />
                  <Tab label="Liked Brands" />
                  <Tab label="Short Brands" />
                </Tabs>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default DashBoard

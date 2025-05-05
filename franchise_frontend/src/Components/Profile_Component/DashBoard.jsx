import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Tabs,
    Tab
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import img from "../../assets/images/brandLogo.jpg"; // Adjust the path as necessary

const DashBoard = ({ selectedSection, sectionContent }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div>
            <Typography variant="h6" fontWeight={600} mb={2}>
                Dashboard
            </Typography>
            <Box sx={{ display: "flex", minHeight: "85vh", bgcolor: "#f4f6f8" }}>
                {/* Main Content */}
                <Box sx={{ flex: 1, p: 3 }}>
                    {selectedSection ? (
                        sectionContent[selectedSection]
                    ) : (
                        <Box sx={{ display: "flex", gap: 4 }}>
                            {/* Profile Avatar */}
                            <Box sx={{
                                width: 240, height: 200, textAlign: "center",
                                bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2
                            }}>
                                <Avatar sx={{
                                    width: 200, height: 200, mx: "auto", mb: 2,
                                    bgcolor: "transparent", objectFit: "cover",
                                    img: {
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                    }
                                }}>
                                    <img
                                        src={img}
                                        alt="Profile"
                                        style={{ width: "140%", height: "105%", borderRadius: "50%" }}
                                    />
                                    <PersonIcon fontSize="large" />
                                </Avatar>
                            </Box>

                            {/* Profile Info */}
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{
                                    mb: 3, bgcolor: "#fff", p: 2, borderRadius: 2,
                                    boxShadow: 2, width: "90%", textAlign: "center",
                                    height: "40%", paddingTop: "65px", paddingBottom: "65px"
                                }}>
                                    <Typography variant="h4" fontWeight={600}>
                                        Welcome (Manikandan.M)
                                    </Typography>
                                    <Typography color="text.secondary" variant="h5">
                                        Investor
                                    </Typography>
                                    <Typography color="text.secondary" variant="h5" fontWeight={800}>
                                        ID(721720104305)
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}


                    {!selectedSection || selectedSection === "Dashboard" ? (
                        <>

                            <Box sx={{ display: "flex", gap: 4, mt: -6, padding: 2 }}>

                            </Box>


                            <Box sx={{ mt: 4 }}>
                                <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
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
                        </>
                    ) : (
                        sectionContent[selectedSection]
                    )}

                </Box>
            </Box>
        </div>
    );
};

export default DashBoard;

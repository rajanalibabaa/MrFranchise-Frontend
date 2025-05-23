import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, Tabs, Tab
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import img from "../../assets/images/brandLogo.jpg";
import axios from 'axios';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';


const DashBoard = ({ selectedSection, sectionContent }) => {
    const [tabValue, setTabValue] = useState(0);
    const [investorInfo, setInvestorInfo] = useState(null);
    const [brandList, setBrandList] = useState([]);
    const investorUUID = useSelector((state) => state.auth?.investorUUID);
    const AccessToken = useSelector((state) => state.auth?.AccessToken);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);


        if (investorInfo) {
            if (newValue === 0) {
                setBrandList(investorInfo.viewedBrands || []);
            } else if (newValue === 1) {
                setBrandList(investorInfo.interestedinvestor || []);
            } else if (newValue === 2) {
                setBrandList(investorInfo.appliedBrands || []);
            }
        }
    };

    useEffect(() => {
        const fetchInvestor = async () => {
            if (!investorUUID || !AccessToken) return;

            try {
                const response = await axios.get(
                    `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${investorUUID}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${AccessToken}`,
                        },
                    }
                );

                const data = response?.data?.data;
                if (data) {
                    setInvestorInfo(data);
                    setBrandList(data.interestedinvestor || []);
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchInvestor();
    }, [investorUUID, AccessToken]);

    const renderTabContent = () => {
        const label = ["Viewed Brands", "Interested Brands", "Applied List"][tabValue];

        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h6">{label}</Typography>
                {brandList.length > 0 ? (
                    <ul>
                        {brandList.map((item, idx) => (
                            <li key={idx}>{item.name || JSON.stringify(item)}</li>
                        ))}
                    </ul>
                ) : (
                    <Typography>No data available.</Typography>
                )}
            </Box>
        );
    };

    return (
        <div>
            <Typography variant="h6" fontWeight={600} mb={2} sx={{
                textAlign: "center", color: "#fafafa",
                backgroundColor: "#689f38", padding: "10px", borderRadius: "5px"
            }}>
                Dashboard
            </Typography>

            <Box sx={{ display: "flex", minHeight: "85vh", bgcolor: "#f4f6f8" }}>
                <Box sx={{ flex: 1, p: 3 }}>
                    {selectedSection ? (
                        sectionContent[selectedSection]
                    ) : (
                        <Box sx={{ display: "flex", gap: 4 }}>
                            <Box sx={{
                                width: 240, height: 200, textAlign: "center",
                                bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2
                            }}>
                                <Avatar sx={{
                                    width: 230, height: 210, mx: "auto", mb: 2,
                                    bgcolor: "transparent"
                                }}>
                                    <img
                                        src={img}
                                        alt="Profile"
                                        loading='lazy'
                                        style={{
                                            width: "90%", height: "110%",
                                            borderRadius: "40%", marginLeft: "30px", marginTop: "20px"
                                        }}
                                    />
                                    <PersonIcon fontSize="large" />
                                </Avatar>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Box sx={{
                                    mb: 3, bgcolor: "#fff", p: 2, borderRadius: 2,
                                    boxShadow: 2, width: "90%", textAlign: "center",
                                    height: "40%", paddingTop: "65px", paddingBottom: "65px"
                                }}>
                                    <Typography variant="h4" fontWeight={600}>
                                        Welcome {investorInfo?.firstName || "Investor"}
                                    </Typography>
                                    <Typography color="text.secondary" variant="h5">
                                        Investor
                                    </Typography>
                                    <Typography color="text.secondary" variant="h5" fontWeight={800}>
                                        ID ({investorUUID || "N/A"})
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Dashboard Tabs Section */}
                    {!selectedSection || selectedSection === "Dashboard" ? (
                        <>
                            <Box sx={{ mt: 4 }}>
                                <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                                        <Tab
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <VisibilityIcon fontSize="small" />
                                                    Viewed Brands
                                                </Box>
                                            }
                                        />
                                        <Tab label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FavoriteIcon fontSize="small" />
                                                Interested Brands
                                            </Box>
                                        } />
                                        <Tab
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AssignmentTurnedInIcon fontSize="small" />
                                                    Applied List
                                                </Box>
                                            }
                                        />
                                    </Tabs>
                                </Box>
                                <Box>
                                    {renderTabContent()}
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

export default DashBoard

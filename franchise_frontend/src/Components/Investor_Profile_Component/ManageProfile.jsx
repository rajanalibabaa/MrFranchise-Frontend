import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Avatar, CircularProgress
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const ManageProfile = () => {
    const [investorData, setInvestorData] = useState(null);
    const [loading, setLoading] = useState(true);
const navigate = useNavigate();
    const investorUUID = useSelector((state) => state.auth?.investorUUID) 
    const AccessToken = useSelector((state) => state.auth?.AccessToken) 
    console.log("Investor UUID:", investorUUID);
    console.log("Access Token:", AccessToken);

    useEffect(() => {
        const fetchData = async () => {
            if (!investorUUID || !AccessToken) {
                console.log("Missing investorUUID or token.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${AccessToken}`,
                        },
                    }
                );

                console.log("API response structure:", response.data);

                // Set correct data
                if (response.data && response.data.data) {
                    setInvestorData(response.data.data);
                } else {
                    setInvestorData(null);
                }
            } catch (error) {
                console.error("Error fetching investor data:", error);
                setInvestorData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [investorUUID, AccessToken]);

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
                Unable to load profile. Please login again <button onClick={() => navigate("/loginpage")}>Login</button>
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Investor Profile
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar alt="Investor Avatar" src={investorData.profileImage} sx={{ width: 56, height: 56, mr: 2 }} />
                    <Typography variant="h6">{investorData.firstName}</Typography>
                </Box>
                <Typography variant="body1"><strong>firstName:</strong> {investorData.firstName}</Typography>
                <Typography variant="body1"><strong>email:</strong> {investorData.email}</Typography>
                <Typography variant="body1"><strong>mobileNumber:</strong> {investorData.mobileNumber}</Typography>
                <Typography variant="body1"><strong>whatsappNumber:</strong> {investorData.whatsappNumber}</Typography>
                <Typography variant="body1"><strong>Location:</strong> {investorData.state}</Typography>
                <Typography variant="body1"><strong>address:</strong> {investorData.address}</Typography>
                <Typography variant="body1"><strong>category:</strong> {investorData.category}</Typography>
                <Typography variant="body1"><strong>city:</strong> {investorData.city}</Typography>
                <Typography variant="body1"><strong>country:</strong> {investorData.country}</Typography>
                <Typography variant="body1"><strong>district:</strong> {investorData.district}</Typography>
                <Typography variant="body1"><strong>investmentRange:</strong> {investorData.investmentRange}</Typography>
                <Typography variant="body1"><strong>lookingFor:</strong> {investorData.lookingFor}</Typography>
                <Typography variant="body1"><strong>occupation:</strong> {investorData.occupation}</Typography>
                <Typography variant="body1"><strong>pincode:</strong> {investorData.pincode}</Typography>
                <Typography variant="body1"><strong>propertytype:</strong> {investorData.propertytype}</Typography>
            </Paper>
        </Box>
    );
};

export default ManageProfile;

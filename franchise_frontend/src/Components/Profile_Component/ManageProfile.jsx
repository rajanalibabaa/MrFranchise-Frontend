import React from 'react'
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import img from "../../assets/images/brandLogo.jpg";
import PersonIcon from '@mui/icons-material/Person';


const ManageProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [investorData, setInvestorData] = useState({});
    const id = "6805dcbdfff4495f419cc07e";
    console.log("Investor Data:", investorData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/investor/getInvestor/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setInvestorData(response.data);
            } catch (error) {
                console.error("Error fetching investor data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleManageProfileChange = (event) => {
        const { name, value } = event.target;
        setInvestorData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // const getInvestorDataValue = (key) => investorData?.[key] || "No data available";   

    const renderTwoColumnForm = () => {
        const entries = Object.entries(investorData);
        const rows = [];

        for (let i = 0; i < entries.length; i += 2) {
            const [key1, value1] = entries[i];
            const [key2, value2] = entries[i + 1] || [null, null];

            rows.push(
                <Box key={i} sx={{ display: "flex", gap: 2 }}>
                    <TextField
                        fullWidth
                        label={key1.replace(/([A-Z])/g, " $1")}
                        name={key1}
                        value={value1}
                        onChange={handleManageProfileChange}
                        size="small"
                    />
                    {key2 ? (
                        <TextField
                            fullWidth
                            label={key2.replace(/([A-Z])/g, " $1")}
                            name={key2}
                            value={value2}
                            onChange={handleManageProfileChange}
                            size="small"
                        />
                    ) : (
                        <Box sx={{ flex: 1 }} /> // Filler box to keep layout consistent if odd
                    )}
                </Box>
            );
        }

        return rows;
    };

    return (
        <div style={{ display: "flex",marginTop: -30 }}>
            {/* <Box>
                <ProfilePage />
            </Box> */}
             
            <Box
            
                sx={{
                    p: 3,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 4,
                    boxShadow: 3,
                    // maxWidth: 1000,
                    mx: "auto",
                    mt: 4,
                    padding: 10,
                    height: "90vh",
                    width: "100%",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#333" }}
                >
                    Investor Profile
                </Typography>

                {isEditing ? (
                    
                    
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {renderTwoColumnForm()}

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                            <Button variant="contained" color="primary"  onClick={() => setIsEditing(false)}sx={{ backgroundColor: "#ffab00" }}>
                                Update
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}sx={{ backgroundColor: "#ffab00",color: "#fff" }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ backgroundColor: "#ffab00" }}>
                                Edit Profile
                            </Button>
                        </Box>
                        <Box sx={{
                                width: 200, height: 200,marginTop: -20, textAlign: "center",padding: 2,
                                bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2,marginLeft: -5
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

                        <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd",marginTop: 2,marginLeft: -5 }}>
                            {/* <Typography><strong>Name:</strong> {getInvestorDataValue("firstName")} {getInvestorDataValue("lastName")}</Typography>
                            <Typography><strong>Email:</strong> {getInvestorDataValue("email")}</Typography>
                            <Typography><strong>Phone:</strong> {getInvestorDataValue("mobileNumber")}</Typography>
                            <Typography><strong>WhatsApp:</strong> {getInvestorDataValue("whatsappNumber")}</Typography>
                            <Typography><strong>Address:</strong> {`${getInvestorDataValue("address")}, ${getInvestorDataValue("city")}, ${getInvestorDataValue("district")}, ${getInvestorDataValue("state")}, ${getInvestorDataValue("country")} - ${getInvestorDataValue("pincode")}`}</Typography>
                            <Typography><strong>Occupation:</strong> {getInvestorDataValue("occupation")}</Typography>
                            <Typography><strong>Category:</strong> {getInvestorDataValue("category")}</Typography>
                            <Typography><strong>Investment Range:</strong> {getInvestorDataValue("investmentRange")}</Typography>
                            <Typography><strong>Capital:</strong> {getInvestorDataValue("capital")}</Typography>
                            <Typography><strong>Looking For:</strong> {getInvestorDataValue("lookingFor")}</Typography>
                            <Typography><strong>Own Property:</strong> {getInvestorDataValue("ownProperty")}</Typography>
                            <Typography><strong>Property Type:</strong> {getInvestorDataValue("propertyType")}</Typography>
                            <Typography><strong>Min Area:</strong> {getInvestorDataValue("minArea")}</Typography>
                            <Typography><strong>Max Area:</strong> {getInvestorDataValue("maxArea")}</Typography>
                            <Typography><strong>Sqft:</strong> {getInvestorDataValue("sqft")}</Typography> */}
                            <Typography><strong>Name:</strong> {investorData.firstName} {investorData.lastName}</Typography>
                            <Typography><strong>Email:</strong> {investorData.email}</Typography>
                            <Typography><strong>Phone:</strong> {investorData.mobileNumber}</Typography>
                            <Typography><strong>WhatsApp:</strong> {investorData.whatsappNumber}</Typography>
                            <Typography><strong>Address:</strong> {investorData.address}</Typography>
                            <Typography><strong>City:</strong> {investorData.city}</Typography>
                            <Typography><strong>District:</strong> {investorData.district}</Typography>
                            <Typography><strong>state:</strong> {investorData.state}</Typography>
                            <Typography><strong>country:</strong> {investorData.country}</Typography>
                            <Typography><strong>pincode:</strong> {investorData.pincode}</Typography>
                            <Typography><strong>Occupation:</strong> {investorData.occupation}</Typography>
                            <Typography><strong>Category:</strong> {investorData.category}</Typography>
                            <Typography><strong>Investment Range:</strong> {investorData.investmentRange}</Typography>
                            <Typography><strong>Capital:</strong> {investorData.capital}</Typography>
                            <Typography><strong>Looking For:</strong> {investorData.lookingFor}</Typography>
                            <Typography><strong>Own Property:</strong> {investorData.ownProperty}</Typography>
                            <Typography><strong>Property Type:</strong> {investorData.propertyType}</Typography>
                            <Typography><strong>Min Area:</strong> {investorData.minArea}</Typography>
                            <Typography><strong>Max Area:</strong> {investorData.maxArea}</Typography>
                            <Typography><strong>Sqft:</strong> {investorData.sqft}</Typography>
                            

                            {Object.entries(investorData).map(([key, value]) => (
                                <Typography key={key}>
                                    <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}
                                </Typography>
                            ))}
                   
                        </Paper>
                    </>
                )}
            </Box>
        </div>
    )
}

export default ManageProfile

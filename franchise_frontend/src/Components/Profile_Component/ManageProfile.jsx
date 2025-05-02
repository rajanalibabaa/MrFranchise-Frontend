import React from 'react'
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

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
        <div style={{ display: "flex" }}>
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
                    variant="h5"
                    sx={{ mb: 3, fontWeight: 600, textAlign: "center", color: "#333" }}
                >
                    Investor Profile
                </Typography>

                {isEditing ? (
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {renderTwoColumnForm()}

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => setIsEditing(false)}>
                                Update
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button variant="contained" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        </Box>

                        <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd" }}>
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

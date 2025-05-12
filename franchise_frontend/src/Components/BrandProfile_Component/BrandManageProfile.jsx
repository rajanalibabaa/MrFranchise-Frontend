import React, { useState } from 'react';
import {Box, Button, TextField, Typography, Paper, Avatar
} from "@mui/material";
// import axios from "axios";
import img from "../../assets/images/brandLogo.jpg";
import PersonIcon from '@mui/icons-material/Person';

const BrandManageProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [BrandData] = useState({});
    // const id = "6805dcbdfff4495f419cc07e";

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `http://localhost:5000/api/Brandr/getBrand/${id}`,
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     },
    //                 }
    //             );
    //             setInvestorData(response.data);
    //         } catch (error) {
    //             console.error("Error fetching investor data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [id]);

    // const handleManageProfileChange = (e) => {
    //     const { name, value } = e.target;
    //     setInvestorData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    const fieldLabels = [
        { key: "FirstName", label: "FirstName" },
        { key: "LastName", label: "LastName" },
        { key: "email", label: "Email" },
        { key: "phoneNumber", label: "phoneNumber" },
        { key: "brandName", label: "Brandname" },
        { key: "companyname", label: "ComapanyName" },
        { key: "city", label: "City" },
        { key: "district", label: "District" },
        { key: "Category", label: "Category" },
        { key: "franchise", label: "Franchise" },
        
    ];

    const renderTwoColumnForm = () => {
        const rows = [];

        for (let i = 0; i < fieldLabels.length; i += 2) {
            const field1 = fieldLabels[i];
            const field2 = fieldLabels[i + 1];

            rows.push(
                
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 1,height: "100%" }}>
                    
                    <TextField
                        fullWidth
                        label={field1.label}
                        name={field1.key}
                        value={BrandData?.[field1.key] || ""}
                        // onChange={handleManageProfileChange}
                        size="small"
                    />
                    {field2 ? (
                        <TextField
                            fullWidth
                            label={field2.label}
                            name={field2.key}
                            value={BrandData?.[field2.key] || ""}
                            // onChange={handleManageProfileChange}
                            size="small"
                        />
                    ) : (
                        <Box sx={{ flex: 1 }} />
                    )}
                </Box>
            );
        }

        return rows;
    };

    return (
        <div style={{ display: "flex", marginTop: -30 }}>
            <Box
                sx={{
                    p: 3,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 4,
                    boxShadow: 3,
                    mx: "auto",
                    mt: 4,
                    padding: 10,
                    height: "60vh",
                    width: "100%",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#333" }}
                >
                    Brand Profile
                </Typography>

                {isEditing ? (
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {renderTwoColumnForm()}
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2,marginTop: -1 }}>
                            <Button  color="secondary" onClick={() => setIsEditing(false)} sx={{ backgroundColor: "#ffab00", color: "#fff" }}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} sx={{ backgroundColor: "#558b2f" }}>
                                Update
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
                            width: 200, height: 200, marginTop: -20, textAlign: "center", padding: 2,
                            bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2, marginLeft: -5
                        }}>
                            <Avatar sx={{ width: 200, height: 200, mx: "auto", mb: 2 }}>
                                <img
                                    src={img}
                                    alt="Profile"
                                    style={{ width: "140%", height: "105%", borderRadius: "50%" }}
                                />
                                <PersonIcon fontSize="large" />
                            </Avatar>
                        </Box>

                        <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd", marginTop: 2, marginLeft: -5 }}>
                            <Typography><strong>FirstName:</strong> {BrandData.firstName} {BrandData.LastName}</Typography>
                            <Typography><strong>Email:</strong> {BrandData.email}</Typography>
                            <Typography><strong>phoneNumber:</strong> {BrandData.phoneNumber}</Typography>
                            <Typography><strong>brandName:</strong> {BrandData.brandName}</Typography>
                            <Typography><strong>companyname:</strong> {BrandData.address}</Typography>
                            <Typography><strong>City:</strong> {BrandData.city}</Typography>
                            <Typography><strong>District:</strong> {BrandData.district}</Typography>
                            <Typography><strong>Category:</strong> {BrandData.state}</Typography>
                            <Typography><strong>franchise:</strong> {BrandData.country}</Typography>
                            {/* <Typography><strong>Pincode:</strong> {BrandData.pincode}</Typography> */}
                            {/* <Typography><strong>Occupation:</strong> {investorData.occupation}</Typography>
                            <Typography><strong>Category:</strong> {investorData.category}</Typography>
                            <Typography><strong>Investment Range:</strong> {investorData.investmentRange}</Typography>
                            <Typography><strong>Capital:</strong> {investorData.capital}</Typography>
                            <Typography><strong>Looking For:</strong> {investorData.lookingFor}</Typography>
                            <Typography><strong>Own Property:</strong> {investorData.ownProperty}</Typography>
                            <Typography><strong>Property Type:</strong> {investorData.propertyType}</Typography>
                            <Typography><strong>Min Area:</strong> {investorData.minArea}</Typography>
                            <Typography><strong>Max Area:</strong> {investorData.maxArea}</Typography>
                            <Typography><strong>Sqft:</strong> {investorData.sqft}</Typography> */}
                        </Paper>
                    </>
                )}
            </Box>
        </div>
    );
};

export default BrandManageProfile;

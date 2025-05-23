import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {Box, Button, TextField, Typography, Paper, Avatar} from "@mui/material";

const BrandManageProfile = () => {
  const [brandData, setBrandData] = useState({});
  const brandUUID = useSelector((state) => state.auth?.brandUUID);
  const token = useSelector((state) => state.auth?.AccessToken);
  const [isEditing, setIsEditing] = useState(false);

  console.log('Brand UUID:', brandUUID);
  console.log('Token:', token);
  useEffect(() => {
     
    const fetchBrandDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/v1/brand/register/getBrandByRegisterId/${brandUUID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );  
            console.log('Response:', response.data);
            if (response.data.success) {
                setBrandData( response.data.data);
            } else {
                console.error('Error fetching brand details:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching brand details:', error);
        }
    };

    if (brandUUID && token) {
        fetchBrandDetails();
    }
    
  }, [brandUUID, token]);

  return (
    <div>
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
                        {/* {renderTwoColumnForm()} */}
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
                                    src={"img"}
                                    alt=""
                                    loading='lazy'
                                    style={{ width: "140%", height: "105%", borderRadius: "50%" }}
                                />
                                {/* <PersonIcon fontSize="large" /> */}
                            </Avatar>
                        </Box>

                         <Paper sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, border: "1px solid #ddd", marginTop: 2, marginLeft: -5 }}>
                             <Typography><strong>FirstName:</strong> {brandData.firstName} {brandData.LastName}</Typography>
                             <Typography><strong>Email:</strong> {brandData.email}</Typography>
                             <Typography><strong>phoneNumber:</strong> {brandData.phone}</Typography>
                             <Typography><strong>brandName:</strong> {brandData.brandName}</Typography>
                             <Typography><strong>companyname:</strong> {brandData.companyName}</Typography>
                             <Typography><strong>City:</strong> {brandData.city}</Typography>
                             <Typography><strong>District:</strong> {brandData.city}</Typography>
                             <Typography><strong>Category:</strong> {brandData.state}</Typography>
                             <Typography><strong>franchise:</strong> {brandData.category}</Typography>
                         {/* <Typography><strong>Pincode:</strong> {BrandData.pincode}</Typography> */}
                             {/* <Typography><strong>Occupation:</strong> {investorData.occupation}</Typography>
//                             <Typography><strong>Category:</strong> {investorData.category}</Typography>
//                             <Typography><strong>Investment Range:</strong> {investorData.investmentRange}</Typography>
//                             <Typography><strong>Capital:</strong> {investorData.capital}</Typography>
//                             <Typography><strong>Looking For:</strong> {investorData.lookingFor}</Typography>
//                             <Typography><strong>Own Property:</strong> {investorData.ownProperty}</Typography>
//                             <Typography><strong>Property Type:</strong> {investorData.propertyType}</Typography>
//                             <Typography><strong>Min Area:</strong> {investorData.minArea}</Typography>
//                             <Typography><strong>Max Area:</strong> {investorData.maxArea}</Typography>
//                             <Typography><strong>Sqft:</strong> {investorData.sqft}</Typography> */}
                        </Paper>
                    </>
               )}
           </Box>
        </div>
    </div>
  )
}

export default BrandManageProfile




















































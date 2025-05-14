import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Avatar,
    CircularProgress, Alert, Snackbar
} from "@mui/material";
import axios from "axios";
import img from "../../assets/images/brandLogo.jpg";
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from '../../Redux/Slices/AuthSlice/authSlice';

const ManageProfile = () => {
    const dispatch = useDispatch();
const authState = useSelector((state) => state.auth);

    const { user_id = null, token = null, user_data = null } = authState || {};
    

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Initialize form data with user_data when component mounts or user_data changes
    useEffect(() => {
        if (user_data) {
            setFormData(user_data);
            console.log(user_data); 
            
        }else if(user_id && token){
            fetchData();
        }
    }, [user_data, user_id, token]);

     const fetchData = async () => {
            if (!user_id || !token) {
                setError("Authentication failed. Please log in.");
                return;
            }
            
            if (!user_data) {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${user_id}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setFormData(response.data);
                    dispatch(updateUserData(response.data));
                } catch (error) {
                    setError(error.response?.data?.message || "Failed to fetch profile data");
                } finally {
                    setLoading(false);
                }
            }
        };
        
    // Fetch user data if not available in Redux
   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const response = await axios.put(
                `https://franchise-backend-wgp6.onrender.com/api/v1/investor/updateInvestor/${user_id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            // Update Redux store and localStorage
            dispatch(updateUserData(response.data));
            setSuccess(true);
            setIsEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const fieldGroups = [
        [
            { key: "firstName", label: "First Name" },
            { key: "lastName", label: "Last Name" }
        ],
        [
            { key: "email", label: "Email" },
            { key: "mobileNumber", label: "Phone" }
        ],
        [
            { key: "whatsappNumber", label: "WhatsApp" },
            { key: "address", label: "Address" }
        ],
        [
            { key: "city", label: "City" },
            { key: "district", label: "District" }
        ],
        [
            { key: "state", label: "State" },
            { key: "country", label: "Country" }
        ],
        [
            { key: "pincode", label: "Pincode" },
            { key: "occupation", label: "Occupation" }
        ],
        [
            { key: "category", label: "Category" },
            { key: "investmentRange", label: "Investment Range" }
        ],
        [
            { key: "capital", label: "Capital" },
            { key: "lookingFor", label: "Looking For" }
        ],
        [
            { key: "ownProperty", label: "Own Property" }
        ]
    ];

    const renderFormFields = () => {
        return fieldGroups.map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {group.map(field => (
                    <TextField
                        key={field.key}
                        fullWidth
                        label={field.label}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleChange}
                        disabled={loading}
                        size="small"
                    />
                ))}
            </Box>
        ));
    };

    const renderProfileDetails = () => {
        return fieldGroups.flat().map(field => (
            <Typography key={field.key} paragraph sx={{ mb: 1 }}>
                <strong>{field.label}:</strong> {formData[field.key] || 'Not specified'}
            </Typography>
        ));
    };

    if (loading && !user_data) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!user_id) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="warning">Please log in to view your profile</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: 3,
            backgroundColor: "#f9f9f9",
            borderRadius: 4,
            boxShadow: 3,
            mx: "auto",
            mt: 4,
            padding: 4,
            minHeight: "80vh"
        }}>
            <Typography variant="h4" sx={{ 
                mb: 3, 
                fontWeight: 700, 
                textAlign: "center", 
                color: "#333" 
            }}>
                Investor Profile
            </Typography>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Profile updated successfully!
                </Alert>
            </Snackbar>

            {isEditing ? (
                <Box component="form" sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 2 
                }}>
                    {renderFormFields()}
                    <Box sx={{ 
                        display: "flex", 
                        gap: 2, 
                        justifyContent: "center", 
                        mt: 2 
                    }}>
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ 
                                backgroundColor: "#ffab00",
                                '&:hover': { backgroundColor: "#ff8f00" }
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : "Update"}
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                            sx={{ 
                                color: "#ffab00",
                                borderColor: "#ffab00",
                                '&:hover': { borderColor: "#ff8f00" }
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            ) : (
                <>
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "flex-end", 
                        mb: 2 
                    }}>
                        <Button 
                            variant="contained" 
                            onClick={() => setIsEditing(true)}
                            sx={{ 
                                backgroundColor: "#ffab00",
                                '&:hover': { backgroundColor: "#ff8f00" }
                            }}
                        >
                            Edit Profile
                        </Button>
                    </Box>

                    <Box sx={{
                        width: 200, 
                        height: 200, 
                        margin: '0 auto', 
                        textAlign: "center", 
                        padding: 2,
                        bgcolor: "#fff", 
                        borderRadius: 2, 
                        boxShadow: 2,
                        mb: 3
                    }}>
                        <Avatar sx={{ 
                            width: 200, 
                            height: 200, 
                            mx: "auto" 
                        }}>
                            <img
                                src={img}
                                alt="Profile"
                                loading="lazy"
                                style={{ 
                                    width: "100%", 
                                    height: "100%", 
                                    objectFit: "cover" 
                                }}
                            />
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </Box>

                    <Paper sx={{ 
                        p: 3, 
                        backgroundColor: "#fff", 
                        borderRadius: 2, 
                        boxShadow: 2 
                    }}>
                        {renderProfileDetails()}
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default ManageProfile;
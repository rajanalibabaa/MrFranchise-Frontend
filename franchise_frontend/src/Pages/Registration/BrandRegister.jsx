import React, { useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setField, setErrors, resetForm } from "../../Redux/slices/brandRegisterSlice";
import brandImage from "../../assets/Images/BrandRegister.jpg";
import { categories } from "../BrandListingForm/BrandCategories";

const BrandRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.brandRegister.formData);
  const errors = useSelector((state) => state.brandRegister.errors);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("brandFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.entries(parsedData).forEach(([name, value]) => {
        dispatch(setField({ name, value }));
      });
    }
  }, [dispatch]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("brandFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      setField({
        name,
        value: type === "checkbox" ? checked : value,
      })
    );
  };

  const validateForm = (data) => {
    const validationErrors = {};
    if (!data.firstName) validationErrors.firstName = "First name is required";
    if (!data.phone) validationErrors.phone = "Phone number is required";
    if (!data.email) validationErrors.email = "Email is required";
    if (!data.brandName) validationErrors.brandName = "Brand name is required";
    if (!data.companyName)
      validationErrors.companyName = "Company name is required";
    if (!data.category) validationErrors.category = "Category is required";
    if (!data.franchiseType)
      validationErrors.franchiseType = "Franchise type is required";
    if (!data.agreeToTerms)
      validationErrors.agreeToTerms = "You must agree to the terms";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm(formData);
    dispatch(setErrors(validationErrors));
  
    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        firstName: formData.firstName,
        // lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        brandName: formData.brandName,
        companyName: formData.companyName,
        category: formData.category,
        franchiseType: formData.franchiseType,
        agreeToTerms: formData.agreeToTerms,
      };
  
      try {
        const response = await axios.post(
          "https://franchise-backend-wgp6.onrender.com/api/v1/brand/register/creatBrandRegister",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.status === 200 || response.status === 201) {
          // Clear form and localStorage on successful submission
          dispatch(resetForm());
          navigate("/loginPage");
        } else {
          console.error("Unexpected response status:", response.status);
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("API Error:", error);
        
        if (error.response) {
          console.error("Error Response:", error.response.data);
          alert(`Error: ${error.response.data.message || "Registration failed"}`);
        } else if (error.request) {
          alert("No response from server. Please check your connection.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", overflow: "hidden" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          component="img"
          src={brandImage}
          alt="Brand Registration Illustration"
          sx={{ maxWidth: "80%", maxHeight: "550px", objectFit: "contain" }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
            Brand Registration
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                />
              </Grid> */}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  inputProps={{
                    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="brandName"
                  label="Brand Name"
                  value={formData.brandName || ""}
                  onChange={handleChange}
                  error={!!errors.brandName}
                  helperText={errors.brandName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="companyName"
                  label="Company Name"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category || ""}
                    label="Category"
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.franchiseType}>
                  <InputLabel>Franchise Type</InputLabel>
                  <Select
                    name="franchiseType"
                    value={formData.franchiseType || ""}
                    label="Franchise Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="Single Unit">Single Unit</MenuItem>
                    <MenuItem value="Multi Unit">Multi Unit</MenuItem>
                  </Select>
                  {errors.franchiseType && (
                    <FormHelperText>{errors.franchiseType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms || false}
                      onChange={handleChange}
                    />
                  }
                  label="I agree to the terms and conditions"
                />
                {errors.agreeToTerms && (
                  <FormHelperText error>{errors.agreeToTerms}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  Register
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography textAlign="center">
                  Already have an account?{" "}
                  <Link href="/loginPage" underline="hover">
                    Sign In
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BrandRegister;
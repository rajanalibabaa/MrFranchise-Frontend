import React, { useState } from "react";
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
import brandImage from "../../assets/Images/BrandRegister.jpg"; 

const BrandRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brandName: "",
    companyName: "",
    category: "",
    franchiseType: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.lastName) newErrors.lastName = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.email) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.brandName) newErrors.brandName = "Required";
    if (!formData.companyName) newErrors.companyName = "Required";
    if (!formData.category) newErrors.category = "Required";
    if (!formData.franchiseType) newErrors.franchiseType = "Required";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      navigate("/loginPage");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh",overflow: "hidden" }}>
      {/* Left side: image */}
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
          sx={{ maxWidth: "80%", 
            maxHeight: "550px", 
            objectFit: "contain",  }}
        />
      </Grid>

      {/* Right side: form */}
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
              {/* Row 1 */}
              <Grid item xs={12} sm={6} sx={{width:"48%"}}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                //   helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{width:"48%"}}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                //   helperText={errors.lastName}
                />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} sm={6} sx={{width:"48%"}}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                //   helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{width:"48%"}}>
                <TextField
                  fullWidth
                  name="email"
                  label="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                //   helperText={errors.email}
                />
              </Grid>

              {/* Row 3 */}
              <Grid item xs={12} sm={6} sx={{width:"48%"}}>
                <TextField
                  fullWidth
                  name="brandName"
                  label="Enter your brand name"
                  value={formData.brandName}
                  onChange={handleChange}
                  error={!!errors.brandName}
                //   helperText={errors.brandName}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{width:"48%"}}>
                <TextField
                  fullWidth
                  name="companyName"
                  label="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                //   helperText={errors.companyName}
                />
              </Grid>

             {/* Row 4 */}
<Grid item xs={12}sx={{width:"48%"}}>
  <FormControl fullWidth error={!!errors.category}>
    <InputLabel>Select Category</InputLabel>
    <Select
      name="category"
      value={formData.category}
      label="Select the Category"
      onChange={handleChange}
    >
      <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
      <MenuItem value="Retail">Retail</MenuItem>
      <MenuItem value="Education">Education</MenuItem>
      <MenuItem value="Health & Wellness">Health & Wellness</MenuItem>
      <MenuItem value="Technology">Technology</MenuItem>
    </Select>
    {/* {errors.category && (
      <FormHelperText>{errors.category}</FormHelperText>
    )} */}
  </FormControl>
</Grid>

<Grid item xs={12} sx={{width:"48%"}}>
  <FormControl fullWidth error={!!errors.franchiseType}>
    <InputLabel>Select Franchise Type</InputLabel>
    <Select
      name="franchiseType"
      value={formData.franchiseType}
      label="Select Franchise Type"
      onChange={handleChange}
    >
      <MenuItem value="Single Unit">Single Unit</MenuItem>
      <MenuItem value="Multi Unit">Multi Unit</MenuItem>
    </Select>
    {/* {errors.franchiseType && (
      <FormHelperText>{errors.franchiseType}</FormHelperText>
    )} */}
  </FormControl>
</Grid>

              {/* Terms Checkbox */}
              <Grid item xs={12} sx={{width:"100%"}} >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the <strong>terms and conditions</strong>
                    </Typography>
                  }
                />
                {errors.agreeToTerms && (
                  <FormHelperText error>{errors.agreeToTerms}</FormHelperText>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}sx={{width:"100%"}}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, py: 1.5, fontWeight: 600 }}
                >
                  Register
                </Button>
              </Grid>

              {/* Sign In Link */}
              <Grid item xs={12} sx={{width:"100%"}}>
                <Typography variant="body2" textAlign="center">
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
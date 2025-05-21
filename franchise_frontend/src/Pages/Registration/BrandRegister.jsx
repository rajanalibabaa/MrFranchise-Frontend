import React, { useEffect } from "react";
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
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setField, setErrors, resetForm } from "../../Redux/Slices/brandRegisterSlice";
import brandImage from "../../assets/Images/BrandRegister.jpg";
import { categories } from "../BrandListingForm/BrandCategories";
import axios from "axios";


const BrandRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.brandRegister.formData);
  const errors = useSelector((state) => state.brandRegister.errors);

  useEffect(() => {
    const savedFormData = localStorage.getItem("brandFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.entries(parsedData).forEach(([name, value]) => {
        dispatch(setField({ name, value }));
      });
    }
  }, [dispatch]);

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
  if (!data.phone || !/^\d{10}$/.test(data.phone))
    validationErrors.phone = "Valid phone number is required";
  if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
    validationErrors.email = "Valid email is required";
  if (!data.brandName) validationErrors.brandName = "Brand name is required";
  if (!data.companyName)
    validationErrors.companyName = "Company name is required";
  if (!data.category) validationErrors.category = "Category is required";
  if (!data.franchiseType)
    validationErrors.franchiseType = "Franchise type is required";
  return validationErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm(formData);
  dispatch(setErrors(validationErrors));

  if (Object.keys(validationErrors).length === 0) {
    const payload = {
      formData: {
        firstName: formData.firstName.trim(),
        phone: `${formData.countryCode}${formData.phone}`.trim(),
        email: formData.email.trim(),
        brandName: formData.brandName.trim(),
        companyName: formData.companyName.trim(),
        category: formData.category.trim(),
        franchiseType: formData.franchiseType.trim(),
      }
    };

    console.log("Payload being sent:", payload); 

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

      console.log("Response Data:", response.data);
      dispatch(resetForm());
      localStorage.removeItem("brandFormData");
      navigate("/loginPage");
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        alert(
          `Error: ${error.response.data.message || "You have already registered"}`
        );
      } else {
        console.error("Axios Error:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  }
};
  return (
    <Grid container sx={{ minHeight: "100vh", overflow: "hidden" }}>
      <Grid
        
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
          loading="lazy"
          src={brandImage}
          alt="Brand Registration Illustration"
          sx={{ maxWidth: "80%", maxHeight: "550px", objectFit: "contain" }}
        />
      </Grid>

      <Grid
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
              <Grid xs={12} sm={6} sx={{width: "48%"}}>
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

              <Grid xs={12} sm={6} sx={{width: "48%"}}>
                <TextField
    fullWidth
    name="phone"
    label="Phone Number"
    value={formData.phone || ""}
    onChange={handleChange}
    error={!!errors.phone}
    helperText={errors.phone}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FormControl variant="standard" sx={{ minWidth: 70 }}>
            <Select
              name="countryCode"
              value={formData.countryCode || "+91"}
              onChange={handleChange}
              disableUnderline
              sx={{ fontSize: '0.9rem' }}
            >
              <MenuItem value="+91">+91</MenuItem>
              <MenuItem value="+1">+1</MenuItem>
              <MenuItem value="+44">+44</MenuItem>
              <MenuItem value="+971">+971</MenuItem>
            </Select> 
          </FormControl>
        </InputAdornment>
      ),
    }}
    inputProps={{
      maxLength: 10,
      inputMode: "numeric",
    }}
    onInput={(e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    }}
  />
              </Grid>

              <Grid  xs={12} sm={6} sx={{width: "48%"}}>
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

              <Grid  xs={12} sm={6} sx={{width: "48%"}}>
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

              <Grid xs={12} sm={6} sx={{width: "48%"}}>
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

              <Grid xs={12} sm={6} sx={{width: "48%"}}>
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

              <Grid  xs={12} sm={6}sx={{width: "48%"}}>
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
<Grid>
  <Button  onClick={() => navigate("/brandListingForm")} variant="contained" > Add Brands to Listing</Button>
</Grid>
              <Grid xs={12}sx={{width: "60%", marginLeft: "20%"}}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  Register
                </Button>
              </Grid>

              <Grid  xs={12} sx={{ marginLeft: "30%" }}>
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
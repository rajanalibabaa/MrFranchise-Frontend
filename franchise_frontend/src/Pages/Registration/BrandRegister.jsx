import React, { useEffect, useState } from "react";
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
import { setField, setErrors } from "../../Redux/slices/brandRegisterSlice";
import brandImage from "../../assets/Images/BrandRegister.jpg";

const BrandRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.brandRegister.formData);
  const errors = useSelector((state) => state.brandRegister.errors);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      setField({
        name,
        value: type === "checkbox" ? checked : value,
      })
    );
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (data) => {
    const validationErrors = {};
    if (!data.firstName) validationErrors.firstName = "First name is required";
    if (!data.lastName) validationErrors.lastName = "Last name is required";
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
      console.log("✅ Posting this data to API:", formData);
  
      try {
        const response = await axios.post("https://reqres.in/api/users", formData);
        console.log("✅ API Response:", response.data);
        navigate("/loginPage");
      } catch (error) {
        console.error("❌ API Error:", error);
      }
    } else {
      console.warn("⚠️ Form has errors:", validationErrors);
    }
  };
  

  useEffect(() => {
    const postFormData = async () => {
      try {
        const response = await axios.post(
          "https://reqres.in/api/users",
          formData
        );
        console.log("Success:", response.data);
        navigate("/loginPage");
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    if (isSubmitted) {
      postFormData();
      setIsSubmitted(false);
    }
  }, [isSubmitted, formData, navigate]);

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
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  inputProps={{
                    pattern:"^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  fullWidth
                  name="brandName"
                  label="Enter your brand name"
                  value={formData.brandName}
                  onChange={handleChange}
                  error={!!errors.brandName}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  fullWidth
                  name="companyName"
                  label="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Select Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Select the Category"
                    onChange={handleChange}
                  >
                    {[
                      "Food & Beverage",
                      "Retail",
                      "Education",
                      "Health & Wellness",
                      "Technology",
                    ].map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>{errors.category}</FormHelperText> */}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <FormControl fullWidth error={!!errors.franchiseType}>
                  <InputLabel>Select Franchise Type</InputLabel>
                  <Select
                    name="franchiseType"
                    value={formData.franchiseType}
                    label="Select Franchise Type"
                    onChange={handleChange}
                  >
                    {["Single Unit", "Multi Unit"].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>{errors.franchiseType}</FormHelperText> */}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ width: "100%" }}>
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

              <Grid item xs={12} sx={{ width: "100%" }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, py: 1.5, fontWeight: 600 }}
                >
                  Register
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ width: "100%" }}>
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
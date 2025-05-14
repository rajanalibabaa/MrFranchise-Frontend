import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  List,
  ListItemText,
  Box,
  ListItem
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { categories } from "../../Pages/BrandListingForm/BrandCategories";

const countries = ["India", "USA", "UK", "Canada", "Australia"];
const phoneCodes = {
  India: "+91",
  USA: "+1",
  UK: "+44",
  Canada: "+1",
  Australia: "+61",
};

const InvestorRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [phonePrefix, setPhonePrefix] = useState("+91");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const selectedCountry = watch("country");
  const pincode = watch("pincode");
  useEffect(() => {
    // Disable scrolling on the page
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when the component is unmounted
      document.body.style.overflow = "auto";
    };
  }, []);
  useEffect(() => {
    if (selectedCountry && phoneCodes[selectedCountry]) {
      setPhonePrefix(phoneCodes[selectedCountry]);
    } else {
      setPhonePrefix("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (selectedCountry === "India" && pincode && pincode.length === 6) {
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`,
                      );
          const data = response.data[0];
          if (data.Status === "Success") {
            const locationDetails = data.PostOffice[0];
            setValue("state", locationDetails.State || "");
            setValue(
              "city",
              locationDetails.Block || locationDetails.Name || ""
            );
            setValue("district", locationDetails.District || "");
          } else {
            setValue("state", "");
            setValue("city", "");
            setValue("district", "");
            console.error("Invalid Pincode");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      }
    };

    fetchLocationDetails();
  }, [selectedCountry, pincode, setValue]);

  const handleVerifyEmail = () => {
    console.log("Verify Email clicked");
    setShowOtpField(true);
  };

  const handleVerifyPhone = () => {
    console.log("Verify Phone clicked");
  };
  const handleCategorySelection = (mainCategory, subCategory, item) => {
    const selectedPath = `${mainCategory} > ${subCategory} > ${item}`;
    setSelectedCategory(selectedPath);
    setValue("category", selectedPath); 
    setDropdownOpen(false); 
  };
  
  const onSubmit = async (data) => {
    console.log("Form Data:", data);
  
    // Format the data before sending
    const formattedData = {
      firstName: data.firstName || "",
      email: data.email || "",
      mobileNumber: `${phonePrefix}${data.mobileNumber || ""}`.trim(),
      whatsappNumber: `${phonePrefix}${data.whatsappNumber || ""}`.trim(),
      address: data.address || "",
      country: data.country || "",
      pincode: data.pincode || "",
      state: data.state || "",
      district: data.district || "",
      city: data.city || "",
      category: data.category || "", // Ensure this matches one of the allowed values
      investmentRange: data.investmentRange || "",
      occupation: data.occupation || "",
      propertytype: data.propertytype || "",
      lookingFor: data.lookingFor || "",
    };
  
    console.log("Formatted Data:", formattedData);
  
    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/investor/createInvestor",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",


          },
        }
      );
  
      if (response.status === 200) {
        navigate("/loginpage");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        console.error("Error Status:", error.response.status);
        alert(`Error: ${JSON.stringify(error.response.data.errors)}`);
      } else if (error.request) {
        console.error("Error Request:", error.request);
        alert("No response from the server. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  const renderSelectField = (
    label,
    name,
    options,
    requiredMsg = "This field is required"
  ) => (
    <FormControl fullWidth error={!!errors[name]}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        defaultValue=""
        {...register(name, { required: requiredMsg })}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
      {errors[name] && (
        <Typography variant="body2" color="error">
          {errors[name]?.message}
        </Typography>
      )}
    </FormControl>
  );

  return (
    <Container
      sx={{
        maxWidth: "lg",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 2,
      }}
    >
      <Paper elevation={3} sx={{ pt: 1, pl: 5, pr: 3, maxHeight: "690px", height:"690px" }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Investor Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid sx={{ width: "46%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            {/* <Grid sx={{ width: "46%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid> */}

            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              {renderSelectField(
                "Country",
                "country",
                countries,
                "Country is required"
              )}
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Pincode"
                {...register("pincode", { required: "Pincode is required" })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
              />
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="State"
                value={watch("state") || ""}
                {...register("state")}
                InputProps={{ readOnly: true }}
                error={!!errors.state}
              />
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={watch("city") || ""}
                {...register("city")}
                InputProps={{ readOnly: true }}
                error={!!errors.city}
              />
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="District"
                value={watch("district") || ""}
                {...register("district")}
                InputProps={{ readOnly: true }}
                error={!!errors.district}
              />
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address"
                {...register("address", { required: "Address is required" })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleVerifyEmail}
                      >
                        Verify
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid sx={{ width: "30%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register("mobileNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber?.message}
                inputProps={{ maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {phonePrefix}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleVerifyPhone}
                      >
                        Verify
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="WhatsApp Number"
                InputProps={{
                  startAdornment: (
                    <span style={{ marginRight: 8 }}>{phonePrefix}</span>
                  ),
                }}
                {...register("whatsappNumber", {
                  required: "WhatsApp number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid WhatsApp number",
                  },
                })}
                error={!!errors.whatsappNumber}
                helperText={errors.whatsappNumber?.message}
                inputProps={{ maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                }}
              />
            </Grid>

            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                // label="Occupation"
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("occupation", {
                  required: "Occupation is required",
                })}
                error={!!errors.occupation}
                helperText={errors.occupation?.message}
              >
                <option value="">Select Occupation</option>
                <option value="Student">Student</option>
                <option value="Business">Business</option>
                <option value="Salaried">Salaried</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>

            <Grid sx={{ width: "22%", position: "relative" }}>
              <TextField
                fullWidth
                label="Category"
                value={selectedCategory}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                InputProps={{
                  readOnly: true,
                }}
                error={!!errors.category}
                helperText={errors.category?.message}
                {...register("category", {
                  required: "Category is required",
                })}
              />

              {isDropdownOpen && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 10,
                    mt: 1,
                    width: "200%",
                    display: "flex",
                    boxShadow: 3,
                    maxHeight: "260px",
                    overflowY: "auto",
                  }}
                >
                  {/* Main Categories */}
                  <Box sx={{ flex: 1, borderRight: "1px solid #eee" }}>
                    <Typography
                      sx={{
                        p: 1,
                        fontWeight: "bold",
                        bgcolor: "grey.100",
                        width: "100%",
                      }}
                    >
                      Main Categories
                    </Typography>
                    <List>
                      {categories.map((category, index) => (
                        <ListItem
                        key={index}
                       button="true"
                        onMouseEnter={() => setActiveCategory(index)}
                        selected={activeCategory === index}
                      >
                        <ListItemText
                          primary={category.name}
                          sx={{
                            fontWeight: activeCategory === index ? "bold" : "normal",
                            color: activeCategory === index ? "primary.main" : "inherit",
                          }}
                        />
                        <ChevronRightIcon
                          sx={{
                            color: activeCategory === index ? "primary.main" : "inherit",
                          }}
                        />
                      </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Subcategories */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      width: "70%",
                    }}
                  >
                    <Typography
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Subcategories
                    </Typography>
                    {activeCategory !== null &&
                      categories[activeCategory]?.children && (
                        <List>
                          {categories[activeCategory].children.map(
                            (subCategory, subIndex) => (
                              <ListItem
                                key={subIndex}
                                button="true"
                                onMouseEnter={() =>
                                  setActiveSubCategory(subCategory)
                                }
                                selected={
                                  activeSubCategory?.name === subCategory.name
                                }
                              >
                                <ListItemText
                                  primary={subCategory.name}
                                  sx={{
                                    fontWeight:
                                      activeSubCategory?.name ===
                                      subCategory.name
                                        ? "bold"
                                        : "normal",
                                    color:
                                      activeSubCategory?.name ===
                                      subCategory.name
                                        ? "primary.main"
                                        : "inherit",
                                  }}
                                />
                                <ChevronRightIcon
                                  sx={{
                                    color:
                                      activeSubCategory?.name ===
                                      subCategory.name
                                        ? "primary.main"
                                        : "inherit",
                                  }}
                                />
                              </ListItem>
                            )
                          )}
                        </List>
                      )}
                  </Box>

                  {/* Sub-Child Categories */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      width: "70%",
                    }}
                  >
                    <Typography
                      sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                    >
                      Items
                    </Typography>
                    {activeSubCategory?.children && (
                      <List>
                        {activeSubCategory.children.map((item, index) => (
                          <ListItem
                            key={index}
                           button="true"
                            onClick={() =>
                              handleCategorySelection(
                                categories[activeCategory]?.name,
                                activeSubCategory?.name,
                                item
                              )
                            }
                          >
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              )}
            </Grid>

            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                // label="Investment Range"
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("investmentRange", {
                  required: "Investment range is required",
                })}
                error={!!errors.investmentRange}
                helperText={errors.investmentRange?.message}
              >
                <option value="">Select Investment Range</option>
                <option value="Rs.10,000-50,000">Rs.10,000-50,000</option>
                <option value="Rs.50,000-2L">Rs.50,000-2L</option>
                <option value="Rs.2L-5L">Rs.2L-5L</option>
                <option value="Rs.5L-10L">Rs.5L-10L</option>
                <option value="Rs.10L-20L">Rs.10L-20L</option>
                <option value="Rs.20L-30L">Rs.20L-30L</option>
                <option value="Rs.30L-50L">Rs.30L-50L</option>
                <option value="Rs.50L-1Cr">Rs.50L-1Cr</option>
                <option value="Rs.1Cr-2Cr">Rs.1Cr-2Cr</option>
                <option value="Rs.2Cr-5Cr">Rs.2Cr-5Cr</option>
                <option value="Rs.5Cr-above">Rs.5Cr-above</option>
              </TextField>
            </Grid>

            {/* <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                // label="Available Capital"
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("capital", { required: "Capital is required" })}
                error={!!errors.capital}
                helperText={errors.capital?.message}
              >
                <option value="">Select Capital</option>
                <option value="Rs.10,000-50,000">Rs.10,000-50,000</option>
                <option value="Rs.50,000-2L">Rs.50,000-2L</option>
                <option value="Rs.2L-5L">Rs.2L-5L</option>
                <option value="Rs.5L-10L">Rs.5L-10L</option>
                <option value="Rs.10L-20L">Rs.10L-20L</option>
                <option value="Rs.20L-30L">Rs.20L-30L</option>
                <option value="Rs.30L-50L">Rs.30L-50L</option>
                <option value="Rs.50L-1Cr">Rs.50L-1Cr</option>
                <option value="Rs.1Cr-2Cr">Rs.1Cr-2Cr</option>
                <option value="Rs.2Cr-5Cr">Rs.2Cr-5Cr</option>
                <option value="Rs.5Cr-above">Rs.5Cr-above</option>
              </TextField>
            </Grid> */}

            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                // label="Looking For"
                defaultValue=""
                SelectProps={{ native: true }}
                {...register("lookingFor", {
                  required: "Looking For is required",
                })}
                error={!!errors.lookingFor}
                helperText={errors.lookingFor?.message}
              >
                <option value="">Select Looking For</option>
                <option value="Unit">Unit</option>
                <option value="Multicity">Multicity</option>
                <option value="Dealer/Distributor">Dealer/Distributor</option>
                <option value="Master Franchisee">Master Franchisee</option>
              </TextField>
            </Grid>

            <Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
  <TextField
    select
    fullWidth
    // label="Property Type"
    defaultValue="" 
    SelectProps={{ native: true }}
    {...register("propertytype", { required: "Property Type is required" })} // Ensure the name matches
    error={!!errors.type}
    helperText={errors.type?.message}
  >
    <option value="">Select Property Type</option>
    <option value="Residential">Residential</option>
    <option value="Commercial">Commercial</option>
    <option value="Industrial">Industrial</option>
    <option value="Retail">Agricultural</option>
  </TextField>
</Grid>

            {/* <Grid xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Floor Area Requirements
              </Typography>
              <Grid container spacing={2}>
                <Grid sx={{ width: "28%", xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Min Area"
                    type="number"
                    {...register("minArea", {
                      required: "Min area is required",
                    })}
                    error={!!errors.minArea}
                    helperText={errors.minArea?.message}
                  />
                </Grid>
                <Grid sx={{ width: "28%", xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Max Area"
                    type="number"
                    {...register("maxArea", {
                      required: "Max area is required",
                    })}
                    error={!!errors.maxArea}
                    helperText={errors.maxArea?.message}
                  />
                </Grid>
                <Grid sx={{ width: "28%", xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <Select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <MenuItem value="Sq. ft">Sq. ft</MenuItem>
                      <MenuItem value="Sq. mt">Sq. mt</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid> */}

            <Grid sx={{ width: "100%", x: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox {...register("terms", { required: true })} />
                }
                label="I agree to the terms and conditions"
              />
              {errors.terms && (
                <Typography color="error" variant="body2">
                  You must accept the terms
                </Typography>
              )}
            </Grid>

            <Grid
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                xs: 12,
              }}
            >
              <Button fullWidth type="submit" size="large" variant="contained">
                REGISTER
              </Button>
            </Grid>

            <Grid sx={{ width: "100%", xs: 12 }}>
              <Typography textAlign="center">
                Already have an account?{" "}
                <Link href="/loginpage" color="primary">
                  Sign In
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
export default InvestorRegister;

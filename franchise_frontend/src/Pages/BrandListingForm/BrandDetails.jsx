import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Grid,
  Button,
  InputAdornment,
  Chip,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

import { categories } from "./BrandCategories"; // Assuming you have a categories.js file with the categories data
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const BrandDetails = ({ data={}, onChange, errors={} }) => {

  const {
    brandName = '',
    companyName = '',
  } = data;



  const [mobileOTP, setMobileOTP] = useState("");
  const [whatsappOTP, setWhatsappOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [isVerifyingGST, setIsVerifyingGST] = useState(false);
const [gstError, setGstError] = useState('');
  
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  const countries = [
    { name: "United States", code: "US", phoneCode: "+1" },
    { name: "India", code: "IN", phoneCode: "+91" },
    { name: "United Kingdom", code: "GB", phoneCode: "+44" },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);


  const handleCategorySelection = (category, subCategory, childCategory) => {
    const fullPath = `${category} > ${subCategory} > ${childCategory}`;
    setSelectedCategory(fullPath);
    setDropdownOpen(false);
  };

  const handleAddCategory = () => {
    if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
      const updatedCategories = [...selectedCategories, selectedCategory];
      setSelectedCategories(updatedCategories);
      onChange("categories", updatedCategories);
      setSelectedCategory("");
    }
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = selectedCategories.filter((_, i) => i !== index);
    setSelectedCategories(updatedCategories);
    onChange("categories", updatedCategories);
  };

  const handleCountryChange = (event) => {
    const selectedCountry = countries.find(
      (country) => country.name === event.target.value
    );
    onChange("country", selectedCountry.name);
    onChange("countryCode", selectedCountry.code);
    onChange("phoneCode", selectedCountry.phoneCode);

    // Reset location-related fields when country changes
    onChange("state", "");
    onChange("city", "");
    onChange("location", "");
  };

  const handleVerifyMobileOTP = () => {
    if (mobileOTP === "123456") {
      onChange("mobileVerified", true);
      onChange("verifiedMobileNumber", data.mobileNumber);
      alert("Mobile number verified successfully.");
   
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleSendMobileOTP = () => {
    if (data.mobileNumber.length === 10) {
      alert("OTP sent to your mobile number.");
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  const handleSendWhatsappOTP = () => {
    if (data.whatsappNumber.length === 10) {
      alert("OTP sent to your WhatsApp number.");
    } else {
      alert("Please enter a valid 10-digit WhatsApp number.");
    }
  };

// GST Validation function
const validateGSTIN = (gstin) => {
  if (!gstin) {
    return "GSTIN is required";
  }
  if (gstin.length !== 15) {
    return "GSTIN must be 15 characters";
  }
  if (!/^[0-9A-Z]{15}$/.test(gstin)) {
    return "Invalid GSTIN format";
  }
  return null;
};

const handleVerifyGSTIN = async () => {
  const validationError = validateGSTIN(data.gstin);
  if (validationError) {
    setGstError(validationError);
    return;
  }

  setIsVerifyingGST(true);
  setGstError('');

  try {
    const response = await axios.get('https://api.bulkpe.in/gst-verification', {
      params: {
        gstin: data.gstin,
        api_key: process.env.REACT_APP_GST_API_KEY
      }
    });

    if (response.data.valid) {
      onChange("gstVerified", true);
      onChange("gstDetails", response.data.details);
      setGstError(''); // Clear any previous errors
    } else {
      setGstError('GSTIN verification failed - Invalid number');
    }
  } catch (error) {
    console.error('GST verification failed:', error);
    setGstError('Verification service unavailable. Please try again later.');
  } finally {
    setIsVerifyingGST(false);
  }
};

  const handleVerifyWhatsappOTP = () => {
    if (whatsappOTP === "123456") {
      onChange("whatsappVerified", true);
      onChange("verifiedWhatsappNumber", data.whatsappNumber);
      alert("WhatsApp number verified successfully.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleSendEmailOTP = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(data.email)) {
      alert("OTP sent to your email.");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleVerifyEmailOTP = () => {
    if (emailOTP === "123456") {
      onChange("emailVerified", true);
      onChange("verifiedEmail", data.email);
      alert("Email verified successfully.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Add these new state variables
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Add this useEffect for location auto-fill
  useEffect(() => {
    if (data.pincode && data.pincode.length >= 4 && data.countryCode) {
      const fetchLocation = async () => {
        setIsFetchingLocation(true);
        setLocationError(null);

        try {
          const response = await fetch(
            `https://api.zippopotam.us/${data.countryCode.toLowerCase()}/${
              data.pincode
            }`
          );

          if (!response.ok) {
            throw new Error("Location not found");
          }

          const locationData = await response.json();
          const place = locationData.places?.[0];

          if (place) {
            onChange("state", place.state || place["state abbreviation"] || "");
            onChange("city", place["place name"] || "");
            onChange(
              "address",
              `${place["place name"]}, ${place.state}, ${data.country}` || ""
            );
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationError(
            "Could not auto-fill location. Please enter manually."
          );
        } finally {
          setIsFetchingLocation(false);
        }
      };

      const debounceTimer = setTimeout(() => {
        fetchLocation();
      }, 1000); // 1 second debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [data.pincode, data.countryCode]);

  // Add these address fields after your pincode field
  const AddressFields = (
    <>
      {/* State */}
      <Grid item xs={12} md={6}>
        <TextField
          label="State/Province"
          value={data.state || ""}
          onChange={(e) => onChange("state", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      {/* City */}
      <Grid item xs={12} md={6}>
        <TextField
          label="City"
          value={data.city || ""}
          onChange={(e) => onChange("city", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      {/* Location */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Location"
          value={data.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
          fullWidth
          size="small"
          helperText="Area or district"
        />
      </Grid>

      {/* Full Address */}
      <Grid item xs={12}>
        <TextField
          label="Full Address"
          value={data.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          fullWidth
          multiline
          rows={3}
          size="small"
        />
      </Grid>
    </>
  );

  return (
    <Grid container spacing={2} sx={{ display: "grid",gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
     
      {/* Company Name */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Company Name"
          value={companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.companyName}
          helperText={errors?.companyName || "Legal name of your company"}
        />
      </Grid>

      {/* Brand Name */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Brand Name"
          value={brandName}
          onChange={(e) => onChange("brandName", e.target.value)}
          fullWidth
          size="small"
          error={!!errors.brandName}
          helperText={errors.brandName}
        />
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <TextField
          label="Description"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          fullWidth
          size="small"
          error={!!errors.description}
          helperText={errors?.description}
        />
      </Grid>
      <Grid item xs={12} md={6}>
  <TextField
    label="GSTIN"
    value={data.gstin || ''}
    onChange={(e) => {
      const newValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      onChange("gstin", newValue);
      
      // Clear verification if GSTIN changes
      if (data.gstVerified && newValue !== data.gstin) {
        onChange("gstVerified", false);
      }
      
      // Validate on change but don't show error until blurred
      if (errors.gstin) {
        const validationError = validateGSTIN(newValue);
        if (!validationError) {
          delete errors.gstin;
        }
      }
    }}
    onBlur={() => {
      const validationError = validateGSTIN(data.gstin);
      if (validationError) {
        setGstError(validationError);
      }
    }}
    inputProps={{ maxLength: 15 }}
    error={!!errors.gstin || !!gstError}
    helperText={gstError || errors.gstin || "Enter 15-character GSTIN (e.g., 22AAAAA0000A1Z5)"}
    fullWidth
    disabled={data.gstVerified}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: data.gstVerified ? '#e8f5e9' : 'inherit',
        '&.Mui-focused fieldset': {
          borderColor: data.gstVerified ? '#2e7d32' : '#3f51b5',
        }
      }
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {data.gstVerified ? (
            <Chip
              label="Verified"
              color="success"
              size="small"
              sx={{ color: 'white' }}
            />
          ) : (
            <Button
              variant="contained"
              onClick={handleVerifyGSTIN}
              disabled={isVerifyingGST || !!validateGSTIN(data.gstin)}
              size="small"
            >
              {isVerifyingGST ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Verify'
              )}
            </Button>
          )}
        </InputAdornment>
      ),
    }}
  />
</Grid>
      {/* Country */}
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Select Country"
          value={data.country || ""}
          onChange={handleCountryChange}
          fullWidth
        
          size="small"
          error={!!errors?.country}
          helperText={errors?.country}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label="Pincode/Postal Code"
          value={data.pincode}
          onChange={(e) =>
            onChange("pincode", e.target.value.replace(/\D/g, ""))
          }
          inputProps={{ maxLength: 10 }}
          error={!!errors.pincode}
          helperText={
            errors.pincode || "Include street, building, and landmark details"
          }
          fullWidth
          size="small"
          // errors={!!errors?.pincode}
          // helperText={errors?.pincode}

          disabled={isFetchingLocation}
          InputProps={{
            endAdornment: isFetchingLocation ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
        />
      </Grid>
      {/* State */}
      <Grid item xs={12} md={6}>
        <TextField
          label="State/Province"
          value={data.state || ""}
          onChange={(e) => onChange("state", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      {/* City */}
      <Grid item xs={12} md={6}>
        <TextField
          label="City"
          value={data.city || ""}
          onChange={(e) => onChange("city", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>

      {/* Full Address */}
      <Grid item xs={12}>
        <TextField
          label="Full Address"
          value={data.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          fullWidth
          multiline
          rows={2}
          size="small"
          error={!!errors.address}
          helperText={
            errors.address || "Include street, building, and landmark details"
          }
        />
      </Grid>

      {/* Categories Section */}
      <Grid item xs={12}>
        <Box sx={{ display: "flex", mb: 2, gap: 1 }}>
          <Box sx={{ position: "relative", flexGrow: 1 }}>
            <TextField
              label="Select Category"
              value={selectedCategory}
              onFocus={() => setDropdownOpen(true)}
              onChange={() => {}}
              fullWidth
              size="small"
              error={!!errors.categories}
              helperText={errors.categories || "Select at least one category"}
            />
            {isDropdownOpen && (
              <Paper
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  mt: 1,
                  width: "100%",
                  display: "flex",
                  boxShadow: 3,
                  minHeight: 300,
                }}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {/* Parent Categories */}
                <Box sx={{ flex: 1, borderRight: "1px solid #eee" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                  >
                    Main Categories
                  </Typography>
                  <List sx={{ maxHeight: 300, overflow: "auto" }}>
                    {categories.map((category) => (
                      <ListItem
                        key={category.name}
                        button
                        selected={hoveredCategory === category.name}
                        onMouseEnter={() => {
                          setHoveredCategory(category.name);
                          setHoveredSubCategory(null);
                        }}
                        dense
                      >
                        <ListItemText
                          primary={category.name}
                          primaryTypographyProps={{
                            fontWeight:
                              hoveredCategory === category.name
                                ? "bold"
                                : "normal",
                            color:
                              hoveredCategory === category.name
                                ? "primary.main"
                                : "text.primary",
                          }}
                        />
                        {category.children && category.children.length > 0 && (
                          <ChevronRightIcon fontSize="small" color="action" />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Subcategories */}
                <Box
                  sx={{
                    flex: 1,
                    borderRight: "1px solid #eee",
                    bgcolor: hoveredCategory ? "background.paper" : "grey.50",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                  >
                    Subcategories
                  </Typography>
                  {hoveredCategory ? (
                    <List sx={{ maxHeight: 300, overflow: "auto" }}>
                      {categories
                        .find((cat) => cat.name === hoveredCategory)
                        ?.children?.map((subCategory) => (
                          <ListItem
                            key={subCategory.name}
                            button
                            selected={hoveredSubCategory === subCategory.name}
                            onMouseEnter={() =>
                              setHoveredSubCategory(subCategory.name)
                            }
                            dense
                          >
                            <ListItemText
                              primary={subCategory.name}
                              primaryTypographyProps={{
                                fontWeight:
                                  hoveredSubCategory === subCategory.name
                                    ? "bold"
                                    : "normal",
                                color:
                                  hoveredSubCategory === subCategory.name
                                    ? "primary.main"
                                    : "text.primary",
                              }}
                            />
                            {subCategory.children &&
                              subCategory.children.length > 0 && (
                                <ChevronRightIcon
                                  fontSize="small"
                                  color="action"
                                />
                              )}
                          </ListItem>
                        ))}
                    </List>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Select a main category
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Subchild Categories */}
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: hoveredSubCategory
                      ? "background.paper"
                      : "grey.50",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ p: 1, fontWeight: "bold", bgcolor: "grey.100" }}
                  >
                    Items
                  </Typography>
                  {hoveredSubCategory ? (
                    <List sx={{ maxHeight: 300, overflow: "auto" }}>
                      {categories
                        .find((cat) => cat.name === hoveredCategory)
                        ?.children?.find(
                          (sub) => sub.name === hoveredSubCategory
                        )
                        ?.children?.map((child, index) => (
                          <ListItem
                            key={index}
                            button
                            onClick={() =>
                              handleCategorySelection(
                                hoveredCategory,
                                hoveredSubCategory,
                                child
                              )
                            }
                            dense
                          >
                            <ListItemText
                              primary={child}
                              primaryTypographyProps={{ color: "text.primary" }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {hoveredCategory
                          ? "Select a subcategory"
                          : "Select a main category first"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            sx={{ height: "40px" }}
            size="small"
          >
            Add
          </Button>
        </Box>

        {/* Selected Categories */}
        {selectedCategories.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Selected Categories:
            </Typography>
            <List
              dense
              sx={{
                maxHeight: 200,
                overflow: "auto",
                border: "1px solid #eee",
                borderRadius: 1,
              }}
            >
              {selectedCategories.map((category, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveCategory(index)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  }
                  dense
                  sx={{ borderBottom: "1px solid #f5f5f5" }}
                >
                  <ListItemText
                    primary={category}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Grid>

      {/* Mobile Number Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Mobile Number"
          value={data.mobileNumber}
          onChange={(e) =>
            onChange("mobileNumber", e.target.value.replace(/\D/g, ""))
          }
          inputProps={{ maxLength: 10 }}
          fullWidth
          disabled={data.mobileVerified}
          size="small"
          error={!!errors?.mobileNumber }
          helperText={errors.mobileNumber || "Enter 10-digit mobile number"}
          
          // For each verified field, add a visual indicator
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {data.mobileVerified ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSendMobileOTP}
                    disabled={
                      data.mobileVerified || data.mobileNumber.length !== 10
                    }
                    size="small"
                  >
                    Verify
                  </Button>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      

      {data.mobileNumber && !data.mobileVerified && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter Mobile OTP"
            value={mobileOTP}
            onChange={(e) => setMobileOTP(e.target.value)}
            inputProps={{ maxLength: 6 }}
            helperText="Enter the 6-digit OTP"
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleVerifyMobileOTP}
                  disabled={mobileOTP.length !== 6}
                  size="small"
                >
                  Verify OTP
                </Button>
              ),
            }}
          />
        </Grid>
      )}

      {/* WhatsApp Number Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="WhatsApp Number"
          value={data.whatsappNumber}
          onChange={(e) =>
            onChange("whatsappNumber", e.target.value.replace(/\D/g, ""))
          }
          inputProps={{ maxLength: 10 }}
          fullWidth
          disabled={data.whatsappVerified}
          size="small"
          error={!!errors?.whatsappNumber}
          helperText={errors?.whatsappNumber}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {data.phoneCode || "+"}
              </InputAdornment>
            ),
            endAdornment: (
              <Button
                variant="contained"
                onClick={handleSendWhatsappOTP}
                disabled={
                  data.whatsappVerified || data.whatsappNumber.length !== 10
                }
                size="small"
              >
                {data.whatsappVerified ? "Verified ✓" : "Verify"}
              </Button>
            ),
          }}
        />
      </Grid>

      {data.whatsappNumber && !data.whatsappVerified && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter WhatsApp OTP"
            value={whatsappOTP}
            onChange={(e) => setWhatsappOTP(e.target.value)}
            inputProps={{ maxLength: 6 }}
            helperText="Enter the 6-digit OTP"
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleVerifyWhatsappOTP}
                  disabled={whatsappOTP.length !== 6}
                  size="small"
                >
                  Verify OTP
                </Button>
              ),
            }}
          />
        </Grid>
      )}

      {/* Email Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          fullWidth
          disabled={data.emailVerified}
          size="small"
          error={!!errors?.email}
          helperText={
            errors.email || "We'll send verification OTP to this email"
          }
          InputProps={{
            endAdornment: (
              <Button
                variant="contained"
                onClick={handleSendEmailOTP}
                disabled={data.emailVerified || !data.email}
                size="small"
              >
                {data.emailVerified ? "Verified ✓" : "Verify"}
              </Button>
            ),
          }}
        />
      </Grid>

      {data.email && !data.emailVerified && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter Email OTP"
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value)}
            inputProps={{ maxLength: 6 }}
            helperText="Enter the 6-digit OTP"
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleVerifyEmailOTP}
                  disabled={emailOTP.length !== 6}
                  size="small"
                >
                  Verify OTP
                </Button>
              ),
            }}
          />
        </Grid>
      )}

      {/* Website */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Website"
          value={data.website}
          onChange={(e) => onChange("website", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.website}
          helperText={errors.website || "https://example.com"}
        />
      </Grid>

      {/* Facebook */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Facebook"
          value={data.facebook}
          onChange={(e) => onChange("facebook", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.facebook}
          helperText={errors.facebook || "https://facebook.com/yourpage"}
        />
      </Grid>

      {/* Instagram */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Instagram"
          value={data.instagram}
          onChange={(e) => onChange("instagram", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.instagram}
          helperText={errors?.instagram}
        />
      </Grid>

      {/* LinkedIn */}
      <Grid item xs={12} md={6}>
        <TextField
          label="LinkedIn"
          value={data.linkedin}
          onChange={(e) => onChange("linkedin", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.linkedin}
          helperText={errors?.linkedin}
        />
      </Grid>

      {/* Established Year */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Established Year"
          select
          value={data.establishedYear}
          onChange={(e) => onChange("establishedYear", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.establishedYear}
          helperText={errors?.establishedYear}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Franchise Since Year */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Franchise Since Year"
          select
          value={data.franchiseSinceYear}
          onChange={(e) => onChange("franchiseSinceYear", e.target.value)}
          fullWidth
          size="small"
          error={!!errors?.franchiseSinceYear}
          helperText={errors?.franchiseSinceYear}
         
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default BrandDetails;
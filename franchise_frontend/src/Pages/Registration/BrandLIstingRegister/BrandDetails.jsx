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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import { categories } from "./BrandCategories";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BrandDetails = ({ data = {}, onChange, errors = {} }) => {
  const {
    brandName = '',
    companyName = '',
    phoneCode = '+91' // Default to India's code
  } = data;

  const [isVerifyingGST, setIsVerifyingGST] = useState(false);
  const [gstError, setGstError] = useState('');
  
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  
  const formData = {
    companyName: "",
    brandName: "",
    brandCategories: [],
    expansionLocation: [],
    ...data,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);

  // Inside your BrandDetails component, add these state variables
const [supportedCountries, setSupportedCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(''); 
const [countryInputValue, setCountryInputValue] = useState("");

useEffect(() => {
  fetch("https://countriesnow.space/api/v0.1/countries")
    .then(res => res.json())
    .then(data => {
      if (data.data) {
        setSupportedCountries(
          data.data.map(c => ({
            name: c.country,
            code: c.iso2,
            dial_code: c.phone_code ? `+${c.phone_code}` : "",
          }))
        );
      }
    });
}, []);
// const handleCountryChange = (event, newValue) => {
//   if (newValue) {
//     setSelectedCountry(newValue.code);
//     onChange({ country: newValue.name });
//   } else {
//     setSelectedCountry('');
//     onChange({ country: '' });
//   }
// };

  // const [supportedCountries] = useState(getSupportedCountries());
  // const [selectedCountry, setSelectedCountry] = useState("IN"); // Default to India
  // const [countryInputValue, setCountryInputValue] = useState("");

 

  // Add this function to handle country change
  const handleCountryChange = (event, newValue) => {
    if (newValue) {
      setSelectedCountry(newValue.code);
      onChange({ country: newValue.name });
    } else {
      setSelectedCountry("");
      onChange({ country: "" });
    }
  };

  useEffect(() => {
    if (
      data.mobileNumber?.length === 10 &&
      !whatsappEnabled &&
      !data.whatsappNumber
    ) {
      setShowWhatsappSnackbar(true);
    }
  }, [data.mobileNumber, whatsappEnabled, data.whatsappNumber]);

  // Inside your BrandDetails component

  const fetchLocationDetails = async () => {
    if (data.pincode && data.pincode.length >= 4 && selectedCountry) {
      setLoadingPincode(true);
      setPincodeError(null);

      try {
        const result = await fetchGlobalLocationByPostalCode(
          data.pincode,
          selectedCountry
        );

        if (result.status === "success") {
          onChange({
            country: result.country,
            state: result.state,
            city: result.city,
            district: result.district,
          });
        } else {
          throw new Error(result.message || "Failed to fetch location details");
        }
      } catch (error) {
        console.error("Location fetch error:", error);
        setPincodeError(error.message);
        // Clear the location fields if pincode is invalid
        onChange({
          state: "",
          city: "",
          district: "",
        });
      } finally {
        setLoadingPincode(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.pincode && data.pincode.length >= 4 && selectedCountry) {
        fetchLocationDetails();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data.pincode, selectedCountry]);

  const handleMainCategoryChange = (e) => {
    const mainCat = e.target.value;
    setSelectedCategory({
      main: mainCat,
      sub: "",
      child: "",
      groupId: "",
    });
  };

  const handleSubCategoryChange = (e) => {
    const subCat = e.target.value;
    const mainCatObj = categories.find(
      (cat) => cat.name === selectedCategory.main
    );
    const subCatObj = mainCatObj?.children?.find((sub) => sub.name === subCat);

    setSelectedCategory((prev) => ({
      ...prev,
      sub: subCat,
      groupId: subCatObj?.groupId || "",
      child: "",
    }));
  };

  const handleChildCategoryChange = (e) => {
    setSelectedCategory((prev) => ({
      ...prev,
      child: e.target.value,
    }));
  };

  const handleAddCategory = () => {
    if (selectedCategory.child) {
      const isDuplicate =
        Array.isArray(data.brandCategories) &&
        data.brandCategories.some(
          (cat) =>
            cat.main === selectedCategory.main &&
            cat.sub === selectedCategory.sub &&
            cat.child === selectedCategory.child
        );

      if (!isDuplicate) {
        const updatedCategories = [
          ...(Array.isArray(data.brandCategories) ? data.brandCategories : []),
          {
            main: selectedCategory.main,
            sub: selectedCategory.sub,
            child: selectedCategory.child,
            groupId: selectedCategory.groupId,
          },
        ];
        onChange({ brandCategories: updatedCategories });
        // Reset the child category selection after adding
        setSelectedCategory((prev) => ({ ...prev, child: "" }));
      }
    }
  };

  // State for country codes
  const [mobileCountryCode, setMobileCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });
  const [whatsappCountryCode, setWhatsappCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });
  const [ceoCountryCode, setCeoCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });
  const [officeCountryCode, setOfficeCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
  });

  // Filter country codes to remove duplicates and sort
  const uniqueCountryCodes = coutryCode
    .reduce((acc, current) => {
      const x = acc.find((item) => item.code === current.code);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));

  // Handle country code change
  const handleCountryCodeChange = (field, newValue) => {
    if (newValue) {
      switch (field) {
        case "mobile":
          setMobileCountryCode(newValue);
          // Update the full mobile number with new dial code
          if (data.mobileNumber) {
            const numberWithoutCode = data.mobileNumber.replace(/^\+?\d+/, "");
            onChange({
              mobileNumber: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        case "whatsapp":
          setWhatsappCountryCode(newValue);
          // Update the full whatsapp number with new dial code
          if (data.whatsappNumber) {
            const numberWithoutCode = data.whatsappNumber.replace(
              /^\+?\d+/,
              ""
            );
            onChange({
              whatsappNumber: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        case "ceo":
          setCeoCountryCode(newValue);
          // Update the full ceo mobile number with new dial code
          if (data.ceoMobile) {
            const numberWithoutCode = data.ceoMobile.replace(/^\+?\d+/, "");
            onChange({
              ceoMobile: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        case "office":
          setOfficeCountryCode(newValue);
          // Update the full office mobile number with new dial code
          if (data.officeMobile) {
            const numberWithoutCode = data.officeMobile.replace(/^\+?\d+/, "");
            onChange({
              officeMobile: newValue.dial_code + numberWithoutCode,
            });
          }
          break;
        default:
          break;
      }
    }
  };

  // Handle mobile number change - ensure it includes the country code
  const handleMobileNumberChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // For mobileNumber field, we'll prepend the country code
    if (name === "mobileNumber") {
      onChange({
        [name]: mobileCountryCode.dial_code + digitsOnly,
      });
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

  // Category selection functions
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

  // Location auto-fill
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

 useEffect(() => {
  const fetchLocation = async (pincode) => {
    setIsFetchingLocation(true);
    setLocationError(null);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const locationData = await response.json();
      
      // Check if the API returned valid data
      if (locationData[0]?.Status !== "Success") {
        throw new Error(locationData[0]?.Message || "Invalid pincode");
      }

      // Get the first post office entry (you might want to handle multiple entries differently)
      const postOffice = locationData[0]?.PostOffice?.[0];
      
      if (postOffice) {
        onChange("state", postOffice.State || "");
        onChange("city", postOffice.District || postOffice.Name || "");
        onChange("address", 
          [postOffice.Name, postOffice.District, postOffice.State]
            .filter(Boolean)
            .join(", ")
        );
      } else {
        throw new Error("No location data found for this pincode");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationError(
        error.message || "Could not auto-fill location. Please enter manually."
      );
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Only fetch if pincode is valid length and in India
  if (data.pincode && data.pincode.length >= 4 && data.countryCode === "IN") {
    const debounceTimer = setTimeout(() => {
      fetchLocation(data.pincode);
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }
}, [data.pincode, data.countryCode]);

  return (
    <>
      <Grid container spacing={2} sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
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

        {/* GSTIN */}
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

        {/* Pincode */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Pincode/Postal Code"
            value={data.pincode || ""}
            onChange={(e) => {
      const newPincode = e.target.value.replace(/\D/g, "");
      onChange("pincode", newPincode);
      
      // Clear location fields when pincode is cleared
      if (!newPincode) {
        onChange("state", "");
        onChange("city", "");
        onChange("address", "");
      }
    }}
            inputProps={{ maxLength: 10 }}
            error={!!errors.pincode || !!locationError}
            helperText={
              locationError ||errors.pincode || (data.state ? `Auto-filled: ${data.city}, ${data.state}` : "Enter 6-digit Indian pincode to auto-fill location")}
            fullWidth
            size="small"
            disabled={isFetchingLocation}
            InputProps={{
              endAdornment: isFetchingLocation ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : <IconButton onClick={()=>fetchLocation(data.pincode)} 
              disabled={!data.pincode || data.pincode.length !== 6} size="small">
                <SearchIcon fontSize="small" />
              </IconButton>,
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

        {/* CEO Email */}
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Email"
            name="ceoEmail"
            type="email"
            value={data.ceoEmail || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.ceoEmail}
            helperText={errors.ceoEmail}
            required
          />
        </Grid>

        {/* CEO Mobile */}
        <Grid item xs={12} md={2}>
          {renderCeoMobileField()}
        </Grid>
      </Grid>

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Head Office Location{" "}
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Office Email (Optional)"
            name="officeEmail"
            value={data.officeEmail || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.officeEmail}
            helperText={errors.officeEmail}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          {renderOfficeMobileField()}
        </Grid>
      </Grid>

   
  <Grid
  container
  spacing={2}
  sx={{
    mt: 2,
    display: "grid",
    gridTemplateColumns: { md: "3fr 1fr", xs: "1fr" }, // 3:1 ratio on desktop
    gap: 1.5,
    
  }}
>

        {/* Head Office Address - spans 3 columns */}
        <Grid item size={{ xs: 12, md: 12.05 }}>
          <TextField
            fullWidth
            label="Head Office Address"
            name="headOfficeAddress"
            value={data.headOfficeAddress || ""}
            onChange={handleChange}
            error={!!errors.headOfficeAddress}
            helperText={errors.headOfficeAddress}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Autocomplete
            options={supportedCountries}
            getOptionLabel={(option) => option.name}
            value={
              supportedCountries.find((c) => c.code === selectedCountry) || null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCountry(newValue.code);
                onChange({ country: newValue.name });
              } else {
                setSelectedCountry("");
                onChange({ country: "" });
              }
              // Clear pincode-related fields when country changes
              onChange({
                pincode: "",
                state: "",
                city: "",
                district: "",
              });
            }}
            inputValue={countryInputValue}
            onInputChange={(event, newInputValue) => {
              setCountryInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                variant="outlined"
                size="medium"
                required
                error={!!errors.country}
                helperText={errors.country || "Select your country first"}
              />
            )}
            renderOption={(props, option) => {
  const { key, ...rest } = props;
  return (
    <Box component="li" key={key} {...rest}>
      <FlagIcon sx={{ mr: 1 }} />
      {option.name}
    </Box>
  );
}}
          />
        </Grid>

        {/* Mobile Number Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Mobile Number"
            value={data.mobileNumber || ""}
            onChange={(e) =>
              onChange("mobileNumber", e.target.value.replace(/\D/g, ""))
            }
            inputProps={{ maxLength: 10 }}
            fullWidth
            disabled={data.mobileVerified}
            size="small"
            error={!!errors?.mobileNumber}
            helperText={errors.mobileNumber || "Enter 10-digit mobile number"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {phoneCode}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {data.mobileVerified ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendOtp("mobile")}
                      disabled={
                        data.mobileVerified || 
                        !data.mobileNumber || 
                        data.mobileNumber.length !== 10 ||
                        otpStates.mobile.loading
                      }
                      size="small"
                    >
                      {otpStates.mobile.loading ? (
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

        {/* WhatsApp Number Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="WhatsApp Number"
            value={data.whatsappNumber || ""}
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
                  {phoneCode}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {data.whatsappVerified ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendOtp("whatsapp")}
                      disabled={
                        data.whatsappVerified || 
                        !data.whatsappNumber || 
                        data.whatsappNumber.length !== 10 ||
                        otpStates.whatsapp.loading
                      }
                      size="small"
                    >
                      {otpStates.whatsapp.loading ? (
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

        {/* Email Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            value={data.email || ""}
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
                <InputAdornment position="end">
                  {data.emailVerified ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => sendOtp("email")}
                      disabled={
                        data.emailVerified || 
                        !data.email || 
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
                        otpStates.email.loading
                      }
                      size="small"
                    >
                      {otpStates.email.loading ? (
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

        {/* Website */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Website"
            value={data.website || ""}
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
            value={data.facebook || ""}
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
            value={data.instagram || ""}
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
            value={data.linkedin || ""}
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
            value={data.establishedYear || ""}
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
            value={data.franchiseSinceYear || ""}
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

      {/* OTP Verification Modal */}
      <Dialog open={otpModal.open} onClose={closeOtpModal}>
        <DialogTitle>
          Verify {otpModal.type === 'email' ? 'Email' : 
                 otpModal.type === 'mobile' ? 'Mobile' : 'WhatsApp'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              label={`Enter OTP sent to your ${otpModal.type}`}
              value={otpModal.otp}
              onChange={(e) => setOtpModal(prev => ({ 
                ...prev, 
                otp: e.target.value.replace(/\D/g, "") 
              }))}
              inputProps={{ maxLength: 6 }}
              fullWidth
              disabled={otpModal.loading}
              helperText="Enter the 6-digit verification code"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeOtpModal}
            disabled={otpModal.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => sendOtp(otpModal.type)}
            disabled={otpModal.loading}
            color="secondary"
          >
            Resend OTP
          </Button>
          <Button 
            onClick={verifyOtp}
            disabled={otpModal.loading || otpModal.otp.length !== 6}
            variant="contained"
          >
            {otpModal.loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Verify'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BrandDetails;
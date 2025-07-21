import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Box,
  CircularProgress,
  Alert,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { fetchGlobalLocationByPostalCode } from "../../../Utils/PincodeFetch.jsx";
import coutryCode from "../../../Utils/AllCountryCode.jsx";

const BrandDetailsControl = ({ 
  data = {}, 
  errors = {}, 
  onChange, 
  isEditing 
}) => {
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(data.country || '');
  const [countryInputValue, setCountryInputValue] = useState("");
  
  // Initialize country codes from the existing data
  const [mobileCountryCode, setMobileCountryCode] = useState(
    extractCountryCode(data.mobileNumber) || { code: "IN", dial_code: "+91" }
  );
  const [whatsappCountryCode, setWhatsappCountryCode] = useState(
    extractCountryCode(data.whatsappNumber) || { code: "IN", dial_code: "+91" }
  );
  const [ceoCountryCode, setCeoCountryCode] = useState(
    extractCountryCode(data.ceoMobile) || { code: "IN", dial_code: "+91" }
  );
  const [officeCountryCode, setOfficeCountryCode] = useState(
    extractCountryCode(data.officeMobile) || { code: "IN", dial_code: "+91" }
  );

  // Helper function to extract country code from phone number
  function extractCountryCode(phoneNumber) {
    if (!phoneNumber) return null;
    const matchedCode = coutryCode.find(code => 
      phoneNumber.startsWith(code.dial_code)
    );
    return matchedCode || null;
  }

  useEffect(() => {
    // Fetch supported countries on mount
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await response.json();
        if (data.data) {
          setSupportedCountries(
            data.data.map(c => ({
              name: c.country,
              code: c.iso2,
              dial_code: c.phone_code ? `+${c.phone_code}` : "",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Set selected country when data changes
    if (data.country && supportedCountries.length > 0) {
      const country = supportedCountries.find(c => c.name === data.country);
      if (country) {
        setSelectedCountry(country.code);
      }
    }
  }, [data.country, supportedCountries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleCountryChange = (event, newValue) => {
    if (newValue) {
      setSelectedCountry(newValue.code);
      onChange("country", newValue.name);
    } else {
      setSelectedCountry("");
      onChange("country", "");
    }
  };

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
          onChange("country", result.country);
          onChange("state", result.state);
          onChange("city", result.city);
          onChange("district", result.district);
        } else {
          throw new Error(result.message || "Failed to fetch location details");
        }
      } catch (error) {
        console.error("Location fetch error:", error);
        setPincodeError(error.message);
        onChange("state", "");
        onChange("city", "");
        onChange("district", "");
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

  const handleCountryCodeChange = (field, newValue) => {
    if (!newValue) return;

    const setterMap = {
      mobile: setMobileCountryCode,
      whatsapp: setWhatsappCountryCode,
      ceo: setCeoCountryCode,
      office: setOfficeCountryCode
    };

    const fieldMap = {
      mobile: "mobileNumber",
      whatsapp: "whatsappNumber",
      ceo: "ceoMobile",
      office: "officeMobile"
    };

    const setter = setterMap[field];
    if (setter) {
      setter(newValue);
      
      // Update the corresponding phone number field
      const fieldName = fieldMap[field];
      if (data[fieldName]) {
        const numberWithoutCode = data[fieldName].replace(/^\+?\d+/, "");
        onChange(fieldName, newValue.dial_code + numberWithoutCode);
      }
    }
  };

  const handleMobileNumberChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "");

    const codeMap = {
      mobileNumber: mobileCountryCode,
      whatsappNumber: whatsappCountryCode,
      ceoMobile: ceoCountryCode,
      officeMobile: officeCountryCode
    };

    const countryCode = codeMap[name];
    if (countryCode) {
      onChange(name, countryCode.dial_code + digitsOnly);
    }
  };

  const getDisplayNumber = (fullNumber, countryCode) => {
    if (!fullNumber || !countryCode?.dial_code) return "";
    return fullNumber.replace(new RegExp(`^\\${countryCode.dial_code}`), "");
  };

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

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Login Credentials Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Login Credentials
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Full Name */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={data.fullName || ""}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            variant="outlined"
            size="medium"
            required
            disabled={!isEditing}
          />
        </Grid>
        
        {/* Email */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={data.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            size="medium"
            required
          />
        </Grid>

        {/* Mobile Number */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={getDisplayNumber(data.mobileNumber, mobileCountryCode)}
            onChange={handleMobileNumberChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            variant="outlined"
            size="medium"
            inputProps={{ maxLength: 15 }}
            placeholder="Enter mobile number"
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Autocomplete
                    options={uniqueCountryCodes}
                    getOptionLabel={(option) => `${option.dial_code}`}
                    value={mobileCountryCode}
                    onChange={(event, newValue) =>
                      handleCountryCodeChange("mobile", newValue)
                    }
                    clearIcon={null}
                    disabled={!isEditing}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{ width: 70 }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} fontSize={12}>
                        {option.dial_code} <br />({option.code})
                      </Box>
                    )}
                  />
                </InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* WhatsApp Number */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="WhatsApp Number"
            name="whatsappNumber"
            value={getDisplayNumber(data.whatsappNumber, whatsappCountryCode)}
            onChange={handleMobileNumberChange}
            error={!!errors.whatsappNumber}
            helperText={errors.whatsappNumber}
            variant="outlined"
            size="medium"
            inputProps={{ maxLength: 15 }}
            placeholder="Enter WhatsApp number"
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Autocomplete
                    options={uniqueCountryCodes}
                    getOptionLabel={(option) => `${option.dial_code}`}
                    value={whatsappCountryCode}
                    onChange={(event, newValue) =>
                      handleCountryCodeChange("whatsapp", newValue)
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.dial_code === value.dial_code
                    }
                    clearIcon={null}
                    disabled={!isEditing}
                    sx={{ width: 100 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{ width: 70 }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.dial_code} ({option.code})
                      </Box>
                    )}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Brand Details Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Brand Details
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Company Name */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={data.companyName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.companyName}
            helperText={errors.companyName}
            disabled={!isEditing}
            required
          />
        </Grid>

        {/* Brand Name */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Brand Name"
            name="brandName"
            value={data.brandName || ""}
            onChange={handleChange}
            variant="outlined"
            disabled={!isEditing}
            size="medium"
            error={!!errors.brandName}
            helperText={errors.brandName}
            required
          />
        </Grid>

        {/* Tagline */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Tagline"
            name="tagLine"
            value={data.tagLine || ""}
            onChange={handleChange}
            disabled={!isEditing}
            variant="outlined"
            size="medium"
            error={!!errors.tagLine}
            helperText={errors.tagLine}
            required
          />
        </Grid>
      </Grid>
      
      {/* CEO Details Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* CEO Name */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Name"
            name="ceoName"
            value={data.ceoName || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.ceoName}
            disabled={!isEditing}
            helperText={errors.ceoName}
            required
          />
        </Grid>

        {/* CEO Email */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Email"
            name="ceoEmail"
            type="email"
            value={data.ceoEmail || ""}
            onChange={handleChange}
            disabled={!isEditing}
            variant="outlined"
            size="medium"
            error={!!errors.ceoEmail}
            helperText={errors.ceoEmail}
            required
          />
        </Grid>

        {/* CEO Mobile */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="CEO/MD/Owner Mobile No"
            name="ceoMobile"
            value={getDisplayNumber(data.ceoMobile, ceoCountryCode)}
            onChange={handleMobileNumberChange}
            variant="outlined"
            size="medium"
            inputProps={{ maxLength: 15 }}
            placeholder="Enter mobile number"
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Autocomplete
                    options={uniqueCountryCodes}
                    getOptionLabel={(option) => `${option.dial_code}`}
                    value={ceoCountryCode}
                    onChange={(event, newValue) =>
                      handleCountryCodeChange("ceo", newValue)
                    }
                    clearIcon={null}
                    disabled={!isEditing}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{ width: 70 }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} fontSize={12}>
                        {option.dial_code}
                        <br /> ({option.code})
                      </Box>
                    )}
                  />
                </InputAdornment>
              ),
            }}
            error={!!errors.ceoMobile}
            helperText={errors.ceoMobile}
            required
          />
        </Grid>
      </Grid>

      {/* Office Details Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Head Office Location
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Office Email */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Office Email (Optional)"
            name="officeEmail"
            value={data.officeEmail || ""}
            onChange={handleChange}
            disabled={!isEditing}
            variant="outlined"
            size="medium"
            error={!!errors.officeEmail}
            helperText={errors.officeEmail}
          />
        </Grid>

        {/* Office Mobile */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Office Mobile Number (Optional)"
            name="officeMobile"
            value={getDisplayNumber(data.officeMobile, officeCountryCode)}
            onChange={handleMobileNumberChange}
            variant="outlined"
            size="medium"
            inputProps={{ maxLength: 15 }}
            placeholder="Enter mobile number"
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Autocomplete
                    options={uniqueCountryCodes}
                    getOptionLabel={(option) => `${option.dial_code}`}
                    value={officeCountryCode}
                    onChange={(event, newValue) =>
                      handleCountryCodeChange("office", newValue)
                    }
                    clearIcon={null}
                    disabled={!isEditing}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{ width: 70 }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} fontSize={12}>
                        {option.dial_code}
                        <br /> ({option.code})
                      </Box>
                    )}
                  />
                </InputAdornment>
              ),
            }}
            error={!!errors.officeMobile}
            helperText={errors.officeMobile}
          />
        </Grid>

        {/* Head Office Address */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Head Office Address"
            name="headOfficeAddress"
            value={data.headOfficeAddress || ""}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.headOfficeAddress}
            helperText={errors.headOfficeAddress}
            variant="outlined"
            size="medium"
            required
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      {/* Location Details Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Country */}
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={supportedCountries}
            getOptionLabel={(option) => option.name}
            value={
              supportedCountries.find((c) => c.name === data.country) || null
            }
            onChange={handleCountryChange}
            inputValue={countryInputValue}
            onInputChange={(event, newInputValue) => {
              setCountryInputValue(newInputValue);
            }}
            disabled={!isEditing}
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

        {/* Pincode */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label={selectedCountry === "IN" ? "Pincode" : "Postal Code"}
            name="pincode"
            value={data.pincode || ""}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, selectedCountry === "IN" ? 6 : 10);
              onChange("pincode", value);
            }}
            error={!!errors.pincode || !!pincodeError}
            helperText={
              errors.pincode ||
              pincodeError ||
              (selectedCountry === "IN" ? "6-digit pincode" : "Postal code")
            }
            variant="outlined"
            size="medium"
            required
            disabled={!selectedCountry || !isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip
                    title={
                      supportedCountries.find((c) => c.code === selectedCountry)
                        ?.name || "Country"
                    }
                  >
                    <FlagIcon
                      color={selectedCountry ? "primary" : "disabled"}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: loadingPincode ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={data.state || ""}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
            variant="outlined"
            size="medium"
            required
            disabled={!isEditing}
            InputProps={{
              readOnly: !!data.state,
            }}
          />
        </Grid>

        {/* District */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="District"
            name="district"
            value={data.district || ""}
            onChange={handleChange}
            error={!!errors.district}
            helperText={errors.district}
            variant="outlined"
            size="medium"
            required
            disabled={!isEditing}
            InputProps={{
              readOnly: !!data.district,
            }}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={data.city || ""}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
            size="medium"
            required
            disabled={!isEditing}
            InputProps={{
              readOnly: !!data.city,
            }}
          />
        </Grid>
      </Grid>

      {/* Social Media Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Social Media Links
      </Typography>

      <Grid container spacing={2}>
        {/* Website */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={data.website || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.website}
            helperText={errors.website}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">https://</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Facebook */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Facebook (optional)"
            name="facebook"
            value={data.facebook || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.facebook}
            helperText={errors.facebook}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Instagram */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Instagram (optional)"
            name="instagram"
            value={data.instagram || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.instagram}
            helperText={errors.instagram}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* LinkedIn */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="LinkedIn (optional)"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            error={!!errors.linkedin}
            helperText={errors.linkedin}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrandDetailsControl;
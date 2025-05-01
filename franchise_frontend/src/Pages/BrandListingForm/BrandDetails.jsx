import React from "react";
import { useState,useEffect  } from "react";
import axios from "axios";
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
  CircularProgress
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { categories } from "./BrandCategories"; // Assuming you have a categories.js file with the categories data
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
const BrandDetails = ({ data, onChange }) => {
  const [mobileOTP, setMobileOTP] = useState("");
  const [whatsappOTP, setWhatsappOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const countries = [
    { name: "United States", code: "US", phoneCode: "+1" },
    { name: "India", code: "IN", phoneCode: "+91" },
    { name: "United Kingdom", code: "GB", phoneCode: "+44"},    
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
  const handleVerifyGSTIN = () => {
    if (data.gstin.length === 15) {
      onChange("gstVerified", true);
      alert("GSTIN verified successfully.");
    } else {
      alert("Please enter a valid 15-character GSTIN.");
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
          const response = await fetch(`https://api.zippopotam.us/${data.countryCode.toLowerCase()}/${data.pincode}`);
          
          if (!response.ok) {
            throw new Error("Location not found");
          }
          
          const locationData = await response.json();
          const place = locationData.places?.[0];
          
          if (place) {
            onChange("state", place.state || place["state abbreviation"] || "");
            onChange("city", place["place name"] || "");
            onChange("address", `${place["place name"]}, ${place.state}, ${data.country}` || "");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationError("Could not auto-fill location. Please enter manually.");
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
    <Grid container spacing={2}>
      {/* Company Name */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Company Name"
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      
      {/* Brand Name */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Brand Name"
          value={data.brandName}
          onChange={(e) => onChange("brandName", e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      
      {/* Description */}
      <Grid item xs={12}>
        <TextField
          label="Description"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          fullWidth
          sx={{ width: "300px" }}
          size="small"
        />
      </Grid>
      
      {/* GSTIN Field */}
      <Grid item xs={12} md={6}>
        <TextField
          label="GSTIN"
          value={data.gstin}
          onChange={(e) =>
            onChange("gstin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
          }
          inputProps={{ maxLength: 15 }}
          helperText="Enter a 15-character valid GSTIN"
          fullWidth
          disabled={data.gstVerified}
          size="small"
          InputProps={{
            endAdornment: (
              <Button
                variant="contained"
                onClick={handleVerifyGSTIN}
                disabled={data.gstVerified || data.gstin.length !== 15}
                size="small"
              >
                {data.gstVerified ? "Verified ✓" : "Verify"}
              </Button>
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
          sx={{ width: "200px" }}
          size="small"
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
        onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, ""))}
        inputProps={{ maxLength: 10 }}
        helperText={locationError || "Enter code to auto-fill location"}
        error={!!locationError}
        fullWidth
        size="small"
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
          rows={3}
          size="small"
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
            minHeight: 300
          }}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {/* Parent Categories */}
          <Box sx={{ flex: 1, borderRight: '1px solid #eee' }}>
            <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 'bold', bgcolor: 'grey.100' }}>
              Main Categories
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
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
                      fontWeight: hoveredCategory === category.name ? 'bold' : 'normal',
                      color: hoveredCategory === category.name ? 'primary.main' : 'text.primary'
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
          <Box sx={{ 
            flex: 1, 
            borderRight: '1px solid #eee',
            bgcolor: hoveredCategory ? 'background.paper' : 'grey.50'
          }}>
            <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 'bold', bgcolor: 'grey.100' }}>
              Subcategories
            </Typography>
            {hoveredCategory ? (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {categories
                  .find((cat) => cat.name === hoveredCategory)
                  ?.children?.map((subCategory) => (
                    <ListItem
                      key={subCategory.name}
                      button
                      selected={hoveredSubCategory === subCategory.name}
                      onMouseEnter={() => setHoveredSubCategory(subCategory.name)}
                      dense
                    >
                      <ListItemText 
                        primary={subCategory.name} 
                        primaryTypographyProps={{
                          fontWeight: hoveredSubCategory === subCategory.name ? 'bold' : 'normal',
                          color: hoveredSubCategory === subCategory.name ? 'primary.main' : 'text.primary'
                        }}
                      />
                      {subCategory.children && subCategory.children.length > 0 && (
                        <ChevronRightIcon fontSize="small" color="action" />
                      )}
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  Select a main category
                </Typography>
              </Box>
            )}
          </Box>

          {/* Subchild Categories */}
          <Box sx={{ flex: 1, bgcolor: hoveredSubCategory ? 'background.paper' : 'grey.50' }}>
            <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 'bold', bgcolor: 'grey.100' }}>
              Items
            </Typography>
            {hoveredSubCategory ? (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {categories
                  .find((cat) => cat.name === hoveredCategory)
                  ?.children?.find((sub) => sub.name === hoveredSubCategory)
                  ?.children?.map((child, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleCategorySelection(
                        hoveredCategory,
                        hoveredSubCategory,
                        child
                      )}
                      dense
                    >
                      <ListItemText 
                        primary={child} 
                        primaryTypographyProps={{ color: 'text.primary' }}
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  {hoveredCategory ? 'Select a subcategory' : 'Select a main category first'}
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
      sx={{ height: '40px' }}
      size="small"
    >
      Add
    </Button>
  </Box>

  {/* Selected Categories */}
  {selectedCategories.length > 0 && (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Selected Categories:</Typography>
      <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', borderRadius: 1 }}>
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
            sx={{ borderBottom: '1px solid #f5f5f5' }}
          >
            <ListItemText 
              primary={category} 
              primaryTypographyProps={{ 
                variant: 'body2',
                sx: { 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
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
          onChange={(e) => onChange("mobileNumber", e.target.value.replace(/\D/g, ""))}
          inputProps={{ maxLength: 10 }}
          helperText="Enter a 10-digit mobile number"
          fullWidth
          disabled={data.mobileVerified}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {data.phoneCode || "+"}
              </InputAdornment>
            ),
            endAdornment: (
              <Button
                variant="contained"
                onClick={handleSendMobileOTP}
                disabled={data.mobileVerified || data.mobileNumber.length !== 10}
                size="small"
              >
                {data.mobileVerified ? "Verified ✓" : "Verify"}
              </Button>
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
          onChange={(e) => onChange("whatsappNumber", e.target.value.replace(/\D/g, ""))}
          inputProps={{ maxLength: 10 }}
          helperText="Enter a 10-digit WhatsApp number"
          fullWidth
          disabled={data.whatsappVerified}
          size="small"
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
                disabled={data.whatsappVerified || data.whatsappNumber.length !== 10}
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
          helperText="Enter a valid email"
          fullWidth
          disabled={data.emailVerified}
          size="small"
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
        />
      </Grid>
      
      {/* Established Year */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Established Year"
          select
          value={data.establishedYear}
          onChange={(e) => onChange("establishedYear", e.target.value)}
          helperText="Select the year the business was established"
          fullWidth
          size="small"
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
          helperText="Select the year since it became a franchise"
          fullWidth
          size="small"
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
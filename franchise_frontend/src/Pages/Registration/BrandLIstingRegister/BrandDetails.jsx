import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,

  Paper,
  Box,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import categories from "./BrandCategories.jsx";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const BrandDetails = ({ data = {}, errors = {}, onChange,  }) => {
  const formData = {

    companyName: "",
    brandName: "",
    brandCategories: [],
    expansionLocation: [],
    ...data,
  };



  const [selectedCategory, setSelectedCategory] = useState({
    groupId:"",
    main: "",
    sub: "",
    child: "",
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    country: "India",
    state: "",
    district: "",
    city: "",
  });
  const [statesData, setStatesData] = useState([]); // full data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stateCities, setStateCities] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [pincodeError, setPincodeError] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);

  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    cities: false,
  });

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  // Fetch all Indian states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoading((prev) => ({ ...prev, states: true }));
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setStatesData(response.data);
        console.log("States Data:", response.data);

        setStates(
          response.data
            .map((state) => ({ id: state.iso2, name: state.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        // Set the first state as selected by default
      } catch (error) {
        setApiError("Failed to load states. Please try again later.");
        console.error("Error fetching states:", error);
      } finally {
        setLoading((prev) => ({ ...prev, states: false }));
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedDistrict("");
    setSelectedCity("");

    setNewLocation((prev) => ({
      ...prev,
      state: stateName,
      district: "",
      city: "",
    }));

    const stateObj = statesData.find((s) => s.name === stateName);
    if (stateObj) {
      setDistricts(stateObj.districts.sort());
      setStateCities(stateObj.cities);
      setCities([]);
    } else {
      setDistricts([]);
      setStateCities([]);
      setCities([]);
    }
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedCity("");

    setNewLocation((prev) => ({
      ...prev,
      district,
      city: "",
    }));

    const filteredCities = stateCities.filter(
      (city) => city.district === district
    );

    const sortedCities = filteredCities.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setCities(sortedCities);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setNewLocation((prev) => ({
      ...prev,
      city,
    }));
  };

  // Handle pincode change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.pincode && data.pincode.length === 6) {
        fetchAddressFromPincode(data.pincode);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data.pincode]);

  const fetchAddressFromPincode = async (pincode) => {
    setLoadingPincode(true);
    setPincodeError(null);

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (response.data && response.data[0].Status === "Success") {
        const postOffice = response.data[0].PostOffice[0];
        const updates = {
          state: postOffice.State,
          city: postOffice.District,
          headOfficeAddress: `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`,
        };
        onChange(updates);
      } else {
        setPincodeError("Could not find address for this pincode");
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setPincodeError(
        "Failed to fetch address details. Please enter manually."
      );
    } finally {
      setLoadingPincode(false);
    }
  };

  const handleAddLocation = () => {
    console.log("Attempting to add location:", newLocation);

    if (
      newLocation.state?.trim() &&
      newLocation.district?.trim() &&
      newLocation.city?.trim()
    ) {
      const updatedLocations = Array.isArray(data.expansionLocation)
        ? [...data.expansionLocation, { ...newLocation }]
        : [{ ...newLocation }];

      console.log("Updated locations:", updatedLocations);

      onChange({ expansionLocation: updatedLocations });

      setNewLocation({ country: "India", state: "", district: "", city: "" });
      setOpenLocationModal(false);
    } else {
      console.warn("Missing state/district/city:", newLocation);
    }
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = [...data.expansionLocation];
    updatedLocations.splice(index, 1);
    onChange({ expansionLocation: updatedLocations });
  };

const handleCategoryHover = (level, value) => {
  if (level === "main") {
    setSelectedCategory({ main: value, sub: "", child: "", groupId: "" });
  } else if (level === "sub") {
    // Find the selected main category and subcategory to get groupId
    const mainCat = categories.find((cat) => cat.name === selectedCategory.main);
    const subCat = mainCat?.children?.find((sub) => sub.name === value);
    setSelectedCategory((prev) => ({
      ...prev,
      sub: value,
      groupId: subCat?.groupId || "",
      child: "",
    }));
  } else if (level === "child") {
    setSelectedCategory((prev) => ({
      ...prev,
      child: value,
    }));
  }
};

const handleAddCategory = () => {
  if (selectedCategory.child) {
    const isDuplicate =
      Array.isArray(data.brandCategories) &&
      data.brandCategories.some(
        (cat) =>
          cat.main === selectedCategory.main &&
          cat.sub === selectedCategory.sub &&
          cat.child === selectedCategory.child &&
          cat.groupId === selectedCategory.groupId
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
      setSelectedCategory((prev) => ({ ...prev, child: "" }));
    }
  }
}; 
  useEffect(() => {
    if (selectedCategory.child) {
      handleAddCategory();
    }
  }, [selectedCategory.child]);

  return (
    <Box sx={{ overflowY: "auto", pr: 1, mt: 0 }}>
      {/* Brand Details Section - Now in 5 columns for desktop */}

      <Typography variant="h6" sx={{ mb: 1, color: "#ff9800" }}>
        Brand Details
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      >
        {/* Company Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.companyName}
            helperText={errors.companyName}
            required
          />
        </Grid>

        {/* Brand Name */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Brand Name"
            name="brandName"
            value={formData.brandName || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.brandName}
            helperText={errors.brandName}
            required
          />
        </Grid>

        {/* Established Year */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.establishedYear}>
            <InputLabel size="small">Established Year</InputLabel>
            <Select
              name="establishedYear"
              value={data.establishedYear || ""}
              label="Established Year"
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
            >
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.establishedYear && (
              <Typography variant="caption" color="error">
                {errors.establishedYear}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Franchise Since Year */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.franchiseSinceYear}>
            <InputLabel size="small">Franchise Since Year</InputLabel>
            <Select
              name="franchiseSinceYear"
              value={data.franchiseSinceYear || ""}
              label="Franchise Since Year"
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
            >
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.franchiseSinceYear && (
              <Typography variant="caption" color="error">
                {errors.franchiseSinceYear}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Expansion Location - Full width */}
        <Grid item xs={12}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenLocationModal(true)}
              sx={{
                color: errors.expansionLocation ? "error.main" : "primary.main",
                borderColor: errors.expansionLocation
                  ? "error.main"
                  : "primary.main",
                "&:hover": {
                  borderColor: errors.expansionLocation
                    ? "error.main"
                    : "primary.main",
                },
              }}
            >
              Add Expansion Location
            </Button>
            <Box sx={{ color: "error.main", fontSize: "0.875rem", mt: 1 }}>
              {errors.expansionLocation}
            </Box>
          </Box>

          {/* Expansion Location Modal */}
          <Dialog
            open={openLocationModal}
            onClose={() => setOpenLocationModal(false)}
          >
            <DialogTitle>Add Expansion Location</DialogTitle>
            <DialogContent>
              <Box sx={{ minWidth: 300, pt: 1 }}>
                {apiError && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {apiError}
                  </Typography>
                )}

                {/* Country is fixed to India */}
                <TextField
                  fullWidth
                  label="Country"
                  value="India"
                  disabled
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={selectedState}
                    onChange={handleStateChange}
                    label="State"
                    disabled={loading.states}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedState && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>District</InputLabel>
                    <Select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      label="District"
                      disabled={loading.districts}
                    >
                      {districts.map((district, index) => (
                        <MenuItem key={index} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {selectedDistrict && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>City</InputLabel>
                    <Select
                      value={selectedCity}
                      onChange={handleCityChange}
                      label="City"
                      disabled={loading.cities}
                    >
                      {stateCities.map((city, index) => (
                        <MenuItem key={index} value={city.name}>
                          {city.name} ({city.status})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLocationModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddLocation}
                disabled={!newLocation.city}
                variant="contained"
              >
                Add Location
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        {/* Categories Section - Full width */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", mb: 2, gap: 1 }}>
            <Box sx={{ position: "relative", flexGrow: 1 }}>
              <TextField
                label="Select Category"
                value={
                  selectedCategory.child
                    ? `${selectedCategory.main} > ${selectedCategory.sub} > ${selectedCategory.child}`
                    : ""
                }
                onFocus={() => setDropdownOpen(true)}
                onChange={() => {}}
                fullWidth
                size="small"
                error={!!errors.brandCategories}
                helperText={
                  errors.brandCategories || "Select at least one category"
                }
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
                          selected={selectedCategory.main === category.name}
                          onMouseEnter={() =>
                            handleCategoryHover("main", category.name)
                          }
                          dense
                        >
                          <ListItemText
                            primary={category.name}
                            primaryTypographyProps={{
                              fontWeight:
                                selectedCategory.main === category.name
                                  ? "bold"
                                  : "normal",
                              color:
                                selectedCategory.main === category.name
                                  ? "primary.main"
                                  : "text.primary",
                            }}
                          />
                          {category.children &&
                            category.children.length > 0 && (
                              <ChevronRightIcon
                                fontSize="small"
                                color="action"
                              />
                            )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Subcategories */}
                  {selectedCategory.main && (
                    <Box
                      sx={{
                        flex: 1,
                        borderRight: "1px solid #eee",
                        bgcolor: "background.paper",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          p: 1,
                          fontWeight: "bold",
                          bgcolor: "grey.100",
                        }}
                      >
                        Subcategories
                      </Typography>
                      <List sx={{ maxHeight: 300, overflow: "auto" }}>
                        {categories
                          .find((cat) => cat.name === selectedCategory.main)
                          ?.children?.map((subCategory) => (
                            <ListItem
                              key={subCategory.name}
                              button
                              selected={
                                selectedCategory.sub === subCategory.name
                              }
                              onMouseEnter={() =>
                                handleCategoryHover("sub", subCategory.name)
                              }
                              dense
                            >
                              <ListItemText
                                primary={subCategory.name}
                                primaryTypographyProps={{
                                  fontWeight:
                                    selectedCategory.sub === subCategory.name
                                      ? "bold"
                                      : "normal",
                                  color:
                                    selectedCategory.sub === subCategory.name
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
                    </Box>
                  )}

                  {/* Child Categories */}
                  {selectedCategory.sub && (
                    <Box sx={{ flex: 1, bgcolor: "background.paper" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          p: 1,
                          fontWeight: "bold",
                          bgcolor: "grey.100",
                        }}
                      >
                        Items
                      </Typography>
                      <List sx={{ maxHeight: 300, overflow: "auto" }}>
                        {categories
                          .find((cat) => cat.name === selectedCategory.main)
                          ?.children?.find(
                            (sub) => sub.name === selectedCategory.sub
                          )
                          ?.children?.map((child, index) => (
                            <ListItem
                              key={index}
                              button
                              selected={selectedCategory.child === child}
                              onClick={() =>
                                handleCategoryHover("child", child)
                              }
                              dense
                            >
                              <ListItemText
                                primary={child}
                                primaryTypographyProps={{
                                  color:
                                    selectedCategory.child === child
                                      ? "primary.main"
                                      : "text.primary",
                                  fontWeight:
                                    selectedCategory.child === child
                                      ? "bold"
                                      : "normal",
                                }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Communication Information Section - 5 columns */}

      <Typography variant="h6" sx={{ mb: 3, color: "#ff9800" }}>
        Communication Information
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      >
        {/* Full Name */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={data.fullName || ""}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            variant="outlined"
            size="small"
            required
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={data.email || ""}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            size="small"
            required
          />
        </Grid>

        {/* Mobile Number */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={data.mobileNumber || ""}
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            variant="outlined"
            size="small"
           inputProps={{ maxLength: 10 }}
                       placeholder="Enter 10 digit number"

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* WhatsApp Number */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="WhatsApp Number"
            name="whatsappNumber"
            value={data.whatsappNumber || ""}
            onChange={handleChange}
            error={!!errors.whatsappNumber}
            helperText={errors.whatsappNumber}
            variant="outlined"
            size="small"
            inputProps={{ maxLength: 10 }}
            placeholder="Enter 10 digit number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Pincode */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={data.pincode || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange({ pincode: value });
            }}
            error={!!errors.pincode || !!pincodeError}
            helperText={errors.pincode || pincodeError}
            variant="outlined"
            size="small"
            required
            InputProps={{
              endAdornment: loadingPincode ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        {/* Head Office Address - Full width on mobile, 5th column on desktop */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Head Office Address"
            name="headOfficeAddress"
            value={data.headOfficeAddress || ""}
            onChange={handleChange}
            error={!!errors.headOfficeAddress}
            helperText={errors.headOfficeAddress}
            variant="outlined"
            size="small"
            required
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel size="small">State</InputLabel>
            <Select
              name="state"
              value={data.state || ""}
              label="State"
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
            >
              {states.map((state) => (
                <MenuItem key={state.iso2} value={state.name}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
            {errors.state && (
              <Typography variant="caption" color="error">
                {errors.state}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={data.city || ""}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
            size="small"
            required
          />
        </Grid>
      </Grid>

      {/* Social Media Section - 5 columns */}

      <Typography variant="h6" sx={{ mb: 2, mt: 4, color: "#ff9800" }}>
        Social Media & Web Presence
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
          gap: 2,
        }}
      >
        {/* Website */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={data.website || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.website}
            helperText={errors.website}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">https://</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Facebook */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Facebook"
            name="facebook"
            value={data.facebook || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.facebook}
            helperText={errors.facebook}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Instagram */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Instagram"
            name="instagram"
            value={data.instagram || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.instagram}
            helperText={errors.instagram}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* LinkedIn */}
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="LinkedIn"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.linkedin}
            helperText={errors.linkedin}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Brand Description - Full width */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Brand Description"
            name="brandDescription"
            value={data.brandDescription || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            error={!!errors.brandDescription}
            helperText={errors.brandDescription}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrandDetails;

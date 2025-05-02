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
} from "@mui/material";

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
  const [unit, setUnit] = useState("Sq. ft");

  const selectedCountry = watch("country");
  const pincode = watch("pincode");

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
            `https://api.postalpincode.in/pincode/${pincode}`
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
  };

  const handleVerifyPhone = () => {
    console.log("Verify Phone clicked");
  };
  const [occupation, setOccupation] = useState('');
  const [category, setCategory] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [capital, setCapital] = useState('');
  const [lookingFor, setLookingFor] = useState(''); 
  const [propertyData, setPropertyData] = useState({ propertyType: '' });
    const onSubmit = async (data) => {
    const { terms, minArea, maxArea, ...restData } = data;

    const formattedData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      mobileNumber: `${phonePrefix}${data.mobileNumber || ""}`.trim(),
      whatsappNumber: `${phonePrefix}${data.whatsappNumber || ""}`.trim(),
      address: data.address || "",
      country: data.country || "",
      pincode: data.pincode || "",
      state: data.state || "",
      district: data.district || "",
      city: data.city || "",
      category: data.category || "",
      investmentRange: data.investmentRange || "",
      capital: data.capital || "",
      occupation: data.occupation || "",
      type: data.type || "",
      lookingFor: data.lookingFor || "",
      areaRequirements: {
        min: data.minArea || 0,
        max: data.maxArea || 0,
        unit: unit || "Sq. ft",
      },
    };
    console.log("Formatted Data:", formattedData); // Log the data being sent

    try {
      const response = await axios.post(
        "http://localhost:5000/api/investor/createInvestor",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log('Server Response:', response.data);
      
      
      navigate("/loginpage");
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        console.error("Error Status:", error.response.status);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error:", error.message);
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
      <Paper elevation={3} sx={{ pt: 1, pl: 5, pr: 3, maxHeight: "760px" }}>
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
                label="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={!!errors.firstName}
              />
            </Grid>
            <Grid sx={{ width: "46%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
              />
            </Grid>

            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              {renderSelectField("Country", "country", countries)}
            </Grid>
            <Grid sx={{ width: "30%", xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Pincode"
                {...register("pincode", { required: "Pincode is required" })}
                error={!!errors.pincode}
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
    required: "Occupation is required"
  })}
  error={!!errors.occupation}
>
  <option value="">Select Occupation</option>
  <option value="Student">Student</option>
  <option value="Business">Business</option>
  <option value="Salaried">Salaried</option>
  <option value="Retired">Retired</option>
  <option value="Other">Other</option>
</TextField>
</Grid>

<Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
  <TextField
    select
    fullWidth
    // label="Category"
    defaultValue=""
    SelectProps={{ native: true }} 
    {...register("category", { required: "Category is required" })}
    error={!!errors.category}
  >
    <option value="">Select Category</option>
    <option value="Category 1">Category 1</option>
    <option value="Category 2">Category 2</option>
  </TextField>
</Grid>

<Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
<TextField
  select
  fullWidth
  // label="Investment Range"
  defaultValue=""                  
  SelectProps={{ native: true }}    
  {...register("investmentRange", {
    required: "Investment range is required"
  })}
  error={!!errors.investmentRange}
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

<Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
<TextField
  select
  fullWidth
  // label="Available Capital"
  defaultValue=""
  SelectProps={{ native: true }}
  {...register("capital", { required: "Capital is required" })}
  error={!!errors.capital}
  // helperText={errors.capital?.message}
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
</Grid>

<Grid sx={{ width: "22%", xs: 12, sm: 4 }}>
  <TextField
    select
    fullWidth
    // label="Looking For"
    defaultValue=""
    SelectProps={{ native: true }}
    {...register("lookingFor", { required: "Looking For is required" })}
    error={!!errors.lookingFor}
    // helperText={errors.lookingFor?.message}
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
    {...register("type", { required: "Property Type is required" })}
    error={!!errors.type}
    // helperText={errors.propertyType?.message}
  >
    <option value="">Select Property Type</option>
    <option value="Residential">Residential</option>
    <option value="Commercial">Commercial</option>
    <option value="Industrial">Industrial</option>
  </TextField>
</Grid>

            <Grid xs={12}>
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
            </Grid>

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

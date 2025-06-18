import React, { useState, useEffect, useRef } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  TextField,
  Radio,
  RadioGroup,
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
  Box,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { FavoriteBorderOutlined, Person, PersonOutlined, WhatsApp,Email, Phone, Home, LocationCity, Work, HomeWork, MeetingRoom } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { categories } from "./BrandLIstingRegister/BrandCategories";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import Footer from "../../Components/Footers/Footer";
import { DeleteIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/Slices/loadingSlice";
import RegisterationMediaHandling from "./RegisterationMediaHandling";
const phoneCodes = {
  India: "+91",
  USA: "+1",
  UK: "+44",
  Canada: "+1",
  Australia: "+61",
};
const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "USA" },
  { code: "GB", name: "UK" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

const InvestorRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      category: [],
      country: "India",
      preferredState: "",
      preferredCity: "",
      preferredDistrict: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phonePrefix, setPhonePrefix] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("India");

  const dropdownRef = useRef(null);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [showWhatsappSnackbar, setShowWhatsappSnackbar] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [indiaData, setIndiaData] = useState([]);
  const [preferredStates, setPreferredStates] = useState([]);
  const [preferredCities, setPreferredCities] = useState([]);
  const [preferredDistricts, setPreferredDistricts] = useState([]);

 const preferredStateValue = watch("preferredState");
  const preferredDistrictValue = watch("preferredDistrict");

  const [loginOpen, setLoginOpen] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);
const [selectedMainCategory, setSelectedMainCategory] = useState('');
const [selectedSubCategory, setSelectedSubCategory] = useState('');
const [selectedChild, setSelectedChild] = useState('');

  const FORM_DATA_KEY = "investor_form_data";
  const initialFormData = {
    firstName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    address: "",
    pincode: "",
    country: "India",
    state: "",
    city: "",
    categories: [],
    investmentRange: "",
    investmentAmount: "",
    occupation: "",
    otherOccupation: "",
    propertyType: "",
    propertySize: "",
    preferredState: "",
    preferredDistrict: "",
    preferredCity: "",
    terms: false,
  };






  const openLoginPopup = () => {
    document.activeElement.blur();
    setLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setLoginOpen(false);
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setIndiaData(res.data);
        setPreferredStates(res.data.map((state) => state.name));
      } catch (err) {
        console.error("Error fetching location data:", err);
        setIndiaData([]);
        setPreferredStates([]);
      }
      //  finally {
      // }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (preferredStateValue && indiaData.length > 0) {
      const stateObj = indiaData.find((s) => s.name === preferredStateValue);
      if (stateObj) {
        setPreferredDistricts(stateObj.districts || []);
        setPreferredCities([]);
      } else {
        setPreferredDistricts([]);
        setPreferredCities([]);
      }
      setValue("preferredDistrict", "");
      setValue("preferredCity", "");
    } else {
      setPreferredDistricts([]);
      setPreferredCities([]);
    }
  }, [preferredStateValue, indiaData, setValue]);

  useEffect(() => {
    if (preferredStateValue && preferredDistrictValue && indiaData.length > 0) {
      const stateObj = indiaData.find((s) => s.name === preferredStateValue);
      if (stateObj) {
        const filteredCities = (stateObj.cities || [])
          .filter((city) => city.district === preferredDistrictValue)
          .map((city) => city.name);
        setPreferredCities(filteredCities);
      } else {
        setPreferredCities([]);
      }
    } else {
      setPreferredCities([]);
    }
  }, [preferredStateValue, preferredDistrictValue, indiaData]);

  // Add this useEffect hook to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCategoryDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
 const handleAddPreference = () => {
    const pref = {
      category: selectedCategories,
      investmentRange: watch("investmentRange"),
      investmentAmount: watch("investmentAmount"),
      preferredState: watch("preferredState"),
      preferredDistrict: watch("preferredDistrict"),
      preferredCity: watch("preferredCity"),
      propertyType: watch("propertyType"),
      propertySize: watch("propertyType") === "Own Property" ? watch("propertySize") : "",
    };
    if (
      !pref.category.length ||
      !pref.investmentRange ||
      !pref.investmentAmount ||
      !pref.preferredState ||
      !pref.preferredDistrict ||
      !pref.preferredCity ||
      !pref.propertyType ||
      (pref.propertyType === "Own Property" && !pref.propertySize)
    ) {
      showSnackbar("Please fill all preference fields before adding.", "error");
      return;
    }
    setPreferences([...preferences, pref]);
    setValue("investmentRange", "");
  setValue("investmentAmount", "");
  setValue("preferredState", "");
  setValue("preferredDistrict", "");
  setValue("preferredCity", "");
  setValue("propertyType", "");
  setValue("propertySize", "");
    setSelectedCategories([]);
    setValue("category", []);
    setSelectedCategories([]);
  setSelectedMainCategory('');
  setSelectedSubCategory('');
  setSelectedChild('');
    clearErrors([
      "preferredState",
      "preferredDistrict",
      "preferredCity",
      "propertyType",
      "propertySize",
      "investmentRange",  
      "investmentAmount",   
      "category",
    ])
    showSnackbar("Preference added!", "success");
    setTimeout(() => {
alert('Add Multiple preferences to get more offers from us!','info')  
  },2000)
  };

  // Remove preference h                andler
  const handleRemovePreference = (idx) => {
    setPreferences(preferences.filter((_, i) => i !== idx));
  };

  // Submit handler
 

  // OTP related states
  const [otpModal, setOtpModal] = useState({
    open: false, 
    type: null, // 'email', 'mobile', or 'whatsapp'
    otp: "",
    loading: false,
    verified: false,
  });

  const occupationValue = useWatch({
    control,
    name: "occupation",
    defaultValue: "",
  });
  const selectedRange = useWatch({ control, name: "investmentRange" });

  const [otpStates, setOtpStates] = useState({
    email: {
      sent: false,
      verified: false,
      loading: false,
      token: "",
    },
    mobile: {
      sent: false,
      verified: false,
      loading: false,
      token: "",
    },
    whatsapp: {
      sent: false,
      verified: false,
      loading: false,
      token: "",
    },
  });

  
  // Handler for the first category dropdown
  const handleCategorySelection = (main, sub, child) => {
    const newCategory = { main, sub, child };

    setSelectedCategories((prev) => {
      // Check for duplicates
      const exists = prev.some(
        (cat) => cat.main === main && cat.sub === sub && cat.child === child
      );

      if (!exists) {
        const updatedCategories = [...prev, newCategory];
        setValue("category", updatedCategories); // Update form value
        return updatedCategories;
      }
      return prev;
    });

    setCategoryDropdownOpen(false);
  };

  // const openOtpModal = (type) => {
    // document.activeElement.blur();
  //   setOtpModal({
  //     open: true,
  //     type,
  //     otp: "",F
  //     loading: false,
  //     verified: otpStates[type]?.verified || false,
  //   });
  // };

  const closeOtpModal = () => {
    setOtpModal({
      open: false,
      type: null,
      otp: "",
      loading: false,
      verified: false,
    });
  };

  const verifyOtp = async () => {
    const { type, otp } = otpModal;

    if (!otp || otp.length < 6) {
      // Assuming 4-6 digit OTP
      showSnackbar("Please enter a valid OTP", "error");
      return;
    }

    console.log("Verifying OTP for type:", type);
    console.log("OTP entered:", otp);
    setOtpModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await axios.post(
        "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/verify-otp",
        {
          identifier:
            type === "email"
              ? watch("email")
              : `${phonePrefix}${watch(
                  type === "mobile" ? "mobileNumber" : "whatsappNumber"
                )}`,
          otp,
          type,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${otpStates[type].token}`,
          },
        }
      );
      console.log("OTP verification response:", response.data);

      if (response.status === 200 || response.data.message) {
        showSnackbar(`${type} verified successfully!`, "success");
        setOtpStates((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            verified: true,
            loading: false,
          },
        }));
        setOtpModal((prev) => ({
          ...prev,
          open: false,
          loading: false,
          verified: true,
        }));
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showSnackbar(
        error.response?.data?.message || "Invalid OTP. Please try again.",
        "error"
      );
      setOtpModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    return savedData ? JSON.parse(savedData) : initialFormData;
  });

  // Initialize react-hook-form with the stored data


  // Save to localStorage whenever form data changes
useEffect(() => {
  const subscription = watch((value) => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(value));
  });
  return () => subscription.unsubscribe();
}, [watch]);

 const onSubmit = async (data) => {
  
  if (!preferences.length) {
    showSnackbar("Please add at least one preference before submitting.", "error");
    return;
  }
  const formatNumber = (num) => {
    if (!num) return "";
    const trimmed = num.trim();
    return trimmed.startsWith(phonePrefix) ? trimmed : `${phonePrefix}${trimmed}`;
  };

  const formattedData = {
    firstName: data.firstName || "",
    email: data.email || "",
    mobileNumber: formatNumber(data.mobileNumber),
    whatsappNumber: formatNumber(data.whatsappNumber),
    address: data.address || "",
    pincode: data.pincode || "",
    country: data.country || "",
    state: data.state || "",
    city: data.city || "",
    occupation: data.occupation || "",
    ...(data.occupation === "Other" && {
      specifyOccupation: data.otherOccupation || "",
    }),
  preferences: preferences.map(pref => ({
  category: Array.isArray(pref.category)
    ? pref.category.map(c => ({
        main: c.main || "",
        sub: c.sub || "",
        child: c.child || ""
      }))
    : typeof pref.category === "string"
      ? [(() => {
          const [main, sub, child] = pref.category.split(">").map(s => s.trim());
          return { main, sub, child };
        })()]
      : [],
  investmentRange: pref.investmentRange,
  investmentAmount: pref.investmentAmount,
  propertyType: pref.propertyType,
  propertySize: pref.propertyType === "Own Property" ? pref.propertySize : "",
  preferredState: pref.preferredState,
  preferredDistrict: pref.preferredDistrict,
  preferredCity: pref.preferredCity,
}))

      // category: selectedCategories,
      // investmentRange: data.investmentRange || "",
      // investmentAmount: data.investmentAmount || "",
      
      // propertyType: data.propertyType || "",
      // ...(data.propertyType === "Own Property" && {
      //   propertySize: data.propertySize || "",
      // }),
      // preferredState: data.preferredState || "",
      // preferredCity: data.preferredCity || "",
      // preferredDistrict: data.preferredDistrict || "",
    };
    console.log("Submitting data:", formattedData);

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/v1/investor/createInvestor",
        // "https://franchise-backend-wgp6.onrender.com/api/v1/investor/createInvestor",
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
console.log("Registration response:", response.data);

      if (response.status === 201) {
        if (formattedData.firstName) {
    localStorage.setItem("investorName", formattedData.firstName);
  }
  if (formattedData.email) {
    localStorage.setItem("investorEmail", formattedData.email);
  }
  if (data.mobileNumber) {
    localStorage.setItem("investorMobile", data.mobileNumber);
  }

        showSnackbar(
          "Registration successful! Redirecting to login...",
          "success"
        );
        setLoginOpen(true);
        // setTimeout(() => navigate("/"), 2000);
setTimeout(() => {
  dispatch(hideLoading());
}, 2000);

      } else {
dispatch(hideLoading());
        showSnackbar(
          "An unexpected error occurred. Please try again.",
          "error"
        );
      
      }
  localStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
  console.error("Registration error:", error);
  dispatch(hideLoading());
  if (error.response?.data?.errors) {
    console.error("Validation errors:", error.response.data.errors);
    showSnackbar(
      error.response.data.errors.join(", "),
      "error"
    );
  } else if (
    error.response?.status === 409 ||
    error.response?.data?.message === "User already registered"
  ) {
    showSnackbar(
      "This user is already registered. Please log in.",
      "error"
    );
  } else {
    showSnackbar(
      error.response?.data?.message ||
        "An unexpected error occurred. Please try again.",
      "error"
    );

  }
  
}
  };


  // Make sure to also save preferences to localStorage
useEffect(() => {
  const savedData = localStorage.getItem(FORM_DATA_KEY);
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    if (parsedData.preferences) {
      setPreferences(parsedData.preferences);
    }
  }
}, []);

// Update localStorage when preferences change
useEffect(() => {
  const currentData = JSON.parse(localStorage.getItem(FORM_DATA_KEY) || {});
  localStorage.setItem(FORM_DATA_KEY, JSON.stringify({
    ...currentData,
    preferences
  }));
}, [preferences]);


  useEffect(() => {
    if (selectedCountry && phoneCodes[selectedCountry]) {
      setPhonePrefix(phoneCodes[selectedCountry]);
    } else {
      setPhonePrefix("");
    }
  }, [selectedCountry]);

  const pincode = watch("pincode");

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
            showSnackbar("Invalid Pincode", "error");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          showSnackbar("Error fetching location details", "error");
        }
      }
    };
    fetchLocationDetails();
  }, [selectedCountry, pincode, setValue]);

  // Render functions
  // const renderSelectField = (
  //   label,
  //   name,
  //   options,
  //   requiredMsg = "This field is required"
  // ) => (
  //   <FormControl fullWidth error={!!errors[name]}>
  //     <InputLabel>{label}</InputLabel>
  //     <Select
  //       label={label}
  //       defaultValue=""
  //       {...register(name, { required: requiredMsg })}
  //     >
  //       {options.map((opt) => (
  //         <MenuItem key={opt} value={opt}>
  //           {opt}
  //         </MenuItem>
  //       ))}
  //     </Select>
  //     {errors[name] && (
  //       <Typography variant="body2" color="error">
  //         {errors[name]?.message}
  //       </Typography>
  //     )}
  //   </FormControl>
  // );

  return (
    <>
     <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        sx={{ 
          color: "#7ad03a", 
          // mb: 2,
          mt: 10,
          textAlign: 'center',
          textDecoration: 'underline',
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
        }}
      >
        Investor Registration
      </Typography>
        <Toolbar sx={{ 
      display: "flex", 
      justifyContent: "flex-end", 
      mt:9,
      mb: 1,
      position: 'absolute',
      top: 16,
      right: 16
    }}>
      <FormControl
        size="small"
        sx={{
          minWidth: 130,
          backgroundColor: "background.paper",
          borderRadius: "8px",
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Select
          value={watch("country") || "India"}
          onChange={(e) => {
            setValue("country", e.target.value);
            setSelectedCountry(e.target.value);
          }}
          displayEmpty
          inputProps={{ "aria-label": "Select country" }}
          sx={{
            borderRadius: '8px',
            '& .MuiSelect-select': {
              py: 1
            }
          }}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Toolbar>
    <Box
  sx={{
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
  }}
>
  
  <Box
    ref={dropdownRef}
    ml={13}
    sx={{
      p: 4,
      width: "100%",
      maxWidth: "900px",
      
      position: "relative",
 
      borderColor: "divider"
    }}
  >
    {/* <Box sx={{ textAlign: "center", mb: 4 }}>
     
      
    </Box> */}

  

    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Personal Details Section */}
    
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "text.primary",
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <PersonOutlined color="primary" /> Personal Details
        </Typography>

        <Grid  spacing={3}>
          {/* First Name */}
          <Grid item xs={12} md={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* Email */}
         <Grid
                       container
                       spacing={2}
                       sx={{
                         display: "grid",
                         gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                         gap: 5,
                       }}
                     >
          <Grid item xs={12} md={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* Mobile Number */}
          <Grid item xs={12} md={6}>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber?.message || " "}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setWhatsappEnabled(false);
                  }}
                  onBlur={(e) => {
                    if (e.target.value.length === 10) {
                      setShowWhatsappSnackbar(true);
                      setWhatsappEnabled(false);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {phonePrefix}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* WhatsApp Number */}
          <Grid item xs={12} md={6}>
            <Controller
              name="whatsappNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="WhatsApp Number"
                  fullWidth
                  variant="outlined"
                  disabled={!whatsappEnabled}
                  error={!!errors.whatsappNumber}
                  helperText={errors.whatsappNumber?.message || " "}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {phonePrefix}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Grid></Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Grid>


<Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                gap: 2,
              }}
            >
          {/* Pincode */}
          <Grid item xs={12} md={4}>
            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pincode"
                  fullWidth
                  variant="outlined"
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCity color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* State */}
          <Grid item xs={12} md={4}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  variant="outlined"
                  value={watch("state") || ""}
                  InputProps={{ readOnly: true }}
                  error={!!errors.state}
                  helperText={errors.state?.message || " "}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'action.hover'
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} md={4}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  variant="outlined"
                  value={watch("city") || ""}
                  InputProps={{ readOnly: true }}
                  error={!!errors.city}
                  helperText={errors.city?.message || " "}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'action.hover'
                    }
                  }}
                />
              )}
            />
          </Grid></Grid>

          {/* Occupation */}
          <Grid item xs={12}>
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Occupation"
                  fullWidth
                  variant="outlined"
                  error={!!errors.occupation}
                  helperText={errors.occupation?.message || " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                    textAlign: 'left'
                  }}
                >
                  <MenuItem value="">Select Occupation</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Salaried Professional">Salaried Professional</MenuItem>
                  <MenuItem value="Business Owner/ Self-Employed">Business Owner/ Self-Employed</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                  <MenuItem value="Freelancer/ Consultant">Freelancer/ Consultant</MenuItem>
                  <MenuItem value="Homemaker">Homemaker</MenuItem>
                  <MenuItem value="Investor">Investor</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* Other Occupation */}
          {occupationValue === "Other" && (
            <Grid item xs={12}>
              <Controller
                name="otherOccupation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Specify Occupation"
                    fullWidth
                    variant="outlined"
                    error={!!errors.otherOccupation}
                    helperText={errors.otherOccupation?.message || " "}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      }
                    }}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>

      {/* Preferences Section */}
   
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "text.primary",
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <FavoriteBorderOutlined color="primary" /> Preferences
        </Typography>

        {/* Category Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
            Investment Categories
          </Typography>
          
         <Grid
                       container
                       spacing={2}
                       sx={{
                         display: "grid",
                         gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                         gap: 2,
                       }}
                     >
            {/* Main Category Dropdown */}
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel>Industry</InputLabel>
              <Select
                value={selectedMainCategory || ''}
                onChange={(e) => {
                  setSelectedMainCategory(e.target.value);
                  setSelectedSubCategory('');
                  setSelectedChild('');
                }}
                label="Industry"
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="">Select Industry</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subcategory Dropdown */}
            <FormControl fullWidth sx={{ minWidth: 120 }} disabled={!selectedMainCategory}>
              <InputLabel>Main category</InputLabel>
              <Select
                value={selectedSubCategory || ''}
                onChange={(e) => {
                  setSelectedSubCategory(e.target.value);
                  setSelectedChild('');
                }}
                label="Main category"
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="">Select Main category</MenuItem>
                {selectedMainCategory && 
                  categories.find(c => c.name === selectedMainCategory)?.children?.map((sub, index) => (
                    <MenuItem key={index} value={sub.name}>
                      {sub.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            {/* Child Item Dropdown */}
            <FormControl fullWidth sx={{ minWidth: 120 }} disabled={!selectedSubCategory}>
              <InputLabel>Sub Category</InputLabel>
             <Select
        value={selectedChild || ''}
        onChange={(e) => {
          const selected = e.target.value;
          setSelectedChild(selected);

          if (selectedMainCategory && selectedSubCategory && selected) {
            const newCategory = {
              main: selectedMainCategory,
              sub: selectedSubCategory,
              child: selected
            };

            setSelectedCategories(prev => {
              const exists = prev.some(c =>
                c.main === newCategory.main &&
                c.sub === newCategory.sub &&
                c.child === newCategory.child
              );
              return exists ? prev : [...prev, newCategory];
            });

            // Reset selections
            // setSelectedMainCategory('');
            // setSelectedSubCategory('');
            // setSelectedChild('');
          }
        }}
        label="Sub Category"
        sx={{ borderRadius: '8px' }}
      >
                <MenuItem value="">Select Sub Category</MenuItem>
                {selectedMainCategory && selectedSubCategory && 
                  categories.find(c => c.name === selectedMainCategory)
                    ?.children?.find(s => s.name === selectedSubCategory)
                    ?.children?.map((child, index) => (
                      <MenuItem key={index} value={child}>
                        {child}
                      </MenuItem>
                    ))
                }
              </Select>
            </FormControl>

            {/* Add Category Button */}
            {/* <Button
              variant="contained"
              
              disabled={!selectedChild}
              onClick={() => {
                if (selectedMainCategory && selectedSubCategory && selectedChild) {
                  const newCategory = {
                    main: selectedMainCategory,
                    sub: selectedSubCategory,
                    child: selectedChild
                  };
                  
                  setSelectedCategories(prev => {
                    const exists = prev.some(c => 
                      c.main === newCategory.main && 
                      c.sub === newCategory.sub && 
                      c.child === newCategory.child
                    );
                    return exists ? prev : [...prev, newCategory];
                  });
                  
                  // Reset selections
                  setSelectedMainCategory('');
                  setSelectedSubCategory('');
                  setSelectedChild('');
                }
              }}
              sx={{ 
                height: '56px',
                borderRadius: '8px',
                minWidth: '170px',
                backgroundColor: '#7ad03a',
              }}
            >
              Add Category
            </Button> */}
          </Grid>

          {/* Display Selected Categories */}
          {/* {selectedCategories.length > 0 && (
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              p: 2,
              backgroundColor: 'background.paper',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              {selectedCategories.map((cat, index) => (
                <Chip
                  key={index}
                  label={`${cat.main} > ${cat.sub} > ${cat.child}`}
                  onDelete={() => {
                    setSelectedCategories(selectedCategories.filter((_, i) => i !== index));
                  }}
                  sx={{ 
                    backgroundColor: '#7ad03a',
                    color: 'primary.contrastText',
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.contrastText'
                    }
                  }}
                />
              ))}
            </Box>
          )} */}
        </Box>

       
        <Grid spacing={3}>
          

          {/* Investment Amount - Only shown if range is selected */}
          {/* {selectedRange && ( */}
         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
            Investment Range
          </Typography>
            <Grid item xs={12} md={6}>
              <Controller
                name="investmentAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Preferred Investment Amount"
                    variant="outlined"
                    error={!!errors.investmentAmount}
                    helperText={errors.investmentAmount?.message || " "}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      }
                    }}
                  >
                    <MenuItem value="">
                      Select preferred Investment Amount
                    </MenuItem>
                    <MenuItem value="Below-50,000">Below - Rs.50 K</MenuItem>
                    <MenuItem value="Rs.50,000-2L">Rs.50 K - 2 L</MenuItem>
                    <MenuItem value="Rs.2L-5L">Rs.2 L - 5 L</MenuItem>
                    <MenuItem value="Rs.5L-10L">Rs.5 L - 10 L</MenuItem>
                    <MenuItem value="Rs.10L-20L">Rs.10 L - 20 L</MenuItem>
                    <MenuItem value="Rs.20L-30L">Rs.20 L - 30 L</MenuItem>
                    <MenuItem value="Rs.30L-50L">Rs.30 L - 50 L</MenuItem>
                    <MenuItem value="Rs.50L-1Cr">Rs.50 L - 1 Cr</MenuItem>
                    <MenuItem value="Rs.1Cr-2Cr">Rs.1 Cr - 2 Cr</MenuItem>
                    <MenuItem value="Rs.2Cr-5Cr">Rs.2 Cr - 5 Cr</MenuItem>
                    <MenuItem value="Rs.5Cr-above">Rs.5 Cr - Above</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          {/* )} */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
            Preferred Location
          </Typography>
 <Grid
                       container
                       spacing={2}
                       sx={{
                         display: "grid",
                         gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                         gap: 2,
                       }}
                     >
          {/* Preferred Location */}
          <Grid item xs={12} md={4}>
            <Controller
              name="preferredState"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Preferred State"
                  variant="outlined"
                  error={!!errors.preferredState}
                  helperText={errors.preferredState?.message || " "}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("preferredDistrict", "");
                    setValue("preferredCity", "");
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {preferredStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="preferredDistrict"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Preferred District"
                  variant="outlined"
                  disabled={!watch("preferredState")}
                  error={!!errors.preferredDistrict}
                  helperText={errors.preferredDistrict?.message || " "}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("preferredCity", "");
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  <MenuItem value="">Select District</MenuItem>
                  {preferredDistricts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="preferredCity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Preferred City"
                  variant="outlined"
                  disabled={!watch("preferredDistrict")}
                  error={!!errors.preferredCity}
                  helperText={errors.preferredCity?.message || " "}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {preferredCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          </Grid>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
            Preferred Readiness
          </Typography>
<Grid item xs={12} md={6}>
            <Controller
              name="investmentRange"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Preferred Investment Readiness"
                  variant="outlined"
                  error={!!errors.investmentRange}
                  helperText={errors.investmentRange?.message || " "}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  <MenuItem value="">Select Preferred Readiness</MenuItem>
                  <MenuItem value="having amount">
                    Having Investment Amount Ready
                  </MenuItem>
                  <MenuItem value="take loan">Planning to take a Loan</MenuItem>
                  <MenuItem value="need loan">Need Loan Assistance</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {/* Property Type */}
          <Grid
                       container
                       spacing={2}
                       sx={{
                         display: "grid",
                         gridTemplateColumns: { md: "repeat(2, 1fr)", xs: "1fr" },
                         gap: 2,
                       }}
                     >
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Property Type
            </Typography>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value !== "Own Property") {
                      setValue("propertySize", "");
                    }
                  }}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel
                    value="Own Property"
                    control={<Radio color="primary" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeWork color="primary" />
                        <Typography>Own Property</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="Rental Property"
                    control={<Radio color="primary" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MeetingRoom color="primary" />
                        <Typography>Rental Property</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              )}
            />
          </Grid>

          {/* Property Size - Only show for Own Property */}
          {watch("propertyType") === "Own Property" && (
            <Grid item xs={12} md={6}>
              <Controller
                name="propertySize"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Property Size"
                    variant="outlined"
                    error={!!errors.propertySize}
                    helperText={errors.propertySize?.message || " "}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Total Area</MenuItem>
                    <MenuItem value="Below - 100 sq ft">
                      Below - 100 sq ft
                    </MenuItem>
                    <MenuItem value="100 sq ft - 200 sq ft">
                      100 sq ft - 200 sq ft
                    </MenuItem>
                    <MenuItem value="200 sq ft - 500 sq ft">
                      200 sq ft - 500 sq ft
                    </MenuItem>
                    <MenuItem value="500 sq ft - 1000 sq ft">
                      500 sq ft - 1000 sq ft
                    </MenuItem>
                    <MenuItem value="1000 sq ft - 1500 sq ft">
                      1000 sq ft - 1500 sq ft
                    </MenuItem>
                    <MenuItem value="1500 sq ft - 2000 sq ft">
                      1500 sq ft - 2000 sq ft
                    </MenuItem>
                    <MenuItem value="2000 sq ft - 3000 sq ft">
                      2000 sq ft - 3000 sq ft
                    </MenuItem>
                    <MenuItem value="3000 sq ft - 5000 sq ft">
                      3000 sq ft - 5000 sq ft
                    </MenuItem>
                    <MenuItem value="5000 sq ft - 7000 sq ft">
                      5000 sq ft - 7000 sq ft
                    </MenuItem>
                    <MenuItem value="7000 sq ft - 10000 sq ft">
                      7000 sq ft - 10000 sq ft
                    </MenuItem>
                    <MenuItem value="Above 10000 sq ft">
                      Above 10000 sq ft
                    </MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          )}
        </Grid></Grid>

        {/* Add Preference Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
        
            onClick={handleAddPreference}
            sx={{
              borderRadius: '8px',
              backgroundColor:'#7ad03a',
              color: '#fff',

              px: 4,
              py: 1.5,
              fontWeight: 'bold'
            }}
          >
            Add Preference
          </Button>
        </Box>

        {/* Preferences Table */}
        {preferences.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Your Investment Preferences
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Table size="small" aria-label="added preferences table">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#7ad03a' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Categories</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Investment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Property</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Cancel </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preferences.map((pref, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {Array.isArray(pref.category) ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {pref.category.map((cat, i) => (
                              <Typography key={i} variant="body2">
                                {`${cat.main} > ${cat.sub} > ${cat.child}`}
                              </Typography>
                            ))}
                          </Box>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">Range:</Box> {pref.investmentRange}
                        </Typography>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">Amount:</Box> {pref.investmentAmount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">State:</Box> {pref.preferredState}
                        </Typography>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">District:</Box> {pref.preferredDistrict}
                        </Typography>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">City:</Box> {pref.preferredCity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">Type:</Box> {pref.propertyType}
                        </Typography>
                        {pref.propertyType === "Own Property" && (
                          <Typography variant="body2">
                            <Box component="span" fontWeight="bold">Size:</Box> {pref.propertySize}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemovePreference(idx)}
                          aria-label="remove preference"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

      {/* Terms and Submit Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mt: 4,
        p: 3,
        
      }}>
        <FormControlLabel
          control={
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  {...field} 
                  color="primary" 
                  checked={field.value || false}
                />
              )}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{" "}
              <Link 
                component={RouterLink} 
                to="/termsandconditions" 
                color="primary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                terms and conditions
              </Link>
            </Typography>
          }
          sx={{ mb: 3 }}
        />
        {errors.terms && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            You must accept the terms
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: '200px',
            borderRadius: '8px',
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            backgroundColor: '#7ad03a',
          }}
        >
          REGISTER
        </Button>

        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account?{" "}
          <Box
            component="span"
            onClick={openLoginPopup}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Sign In
          </Box>
        </Typography>
      </Box>
    </form>

    {/* Login Popup Dialog */}
    <Dialog
      open={loginOpen}
      onClose={closeLoginPopup}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px'
        }
      }}
    >
      <LoginPage open={loginOpen} onClose={closeLoginPopup} />
    </Dialog>

    {/* OTP Verification Modal */}
    <Dialog 
      open={otpModal.open} 
      onClose={closeOtpModal}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 3
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Verify{" "}
        {otpModal.type === "email"
          ? "Email"
          : otpModal.type === "mobile"
          ? "Mobile Number"
          : "WhatsApp Number"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter OTP"
          type="text"
          fullWidth
          variant="outlined"
          value={otpModal.otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtpModal((prev) => ({ ...prev, otp: value }));
          }}
          disabled={otpModal.verified}
          InputProps={{
            endAdornment: otpModal.verified && (
              <InputAdornment position="end">
                <CheckCircleIcon color="success" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
            mt: 2
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, px: 3, pb: 3 }}>
        <Button 
          onClick={closeOtpModal}
          variant="outlined"
          sx={{ borderRadius: '8px', px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={verifyOtp}
          disabled={otpModal.verified || otpModal.loading}
          color="primary"
          variant="contained"
          sx={{ borderRadius: '8px', px: 3 }}
        >
          {otpModal.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : otpModal.verified ? (
            "Verified"
          ) : (
            "Verify"
          )}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Snackbar for notifications */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        sx={{ 
          width: "100%",
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

    {/* WhatsApp Snackbar */}
    <Snackbar
      open={showWhatsappSnackbar}
      autoHideDuration={6000}
      onClose={() => setShowWhatsappSnackbar(false)}
      anchorOrigin={{ vertical: "center", horizontal: "center" }}
      sx={{
        width: '100%',
        maxWidth: '700px',
        mb: 12
      }}
    >
      <Alert
        onClose={() => setShowWhatsappSnackbar(false)}
        severity="info"
        icon={<WhatsApp fontSize="inherit" />}
        sx={{ 
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          alignItems: 'center'
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="success"
              variant="contained"
              size="medium"
              onClick={() => {
                setValue("whatsappNumber", watch("mobileNumber"));
                setShowWhatsappSnackbar(false);
                setWhatsappEnabled(true);
                showSnackbar("WhatsApp number auto-filled.", "success");
              }}
              sx={{ borderRadius: '8px' }}
            >
              Yes
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              onClick={() => {
                setShowWhatsappSnackbar(false);
                setWhatsappEnabled(true);
              }}
              sx={{ borderRadius: '8px' }}
            >
              No
            </Button>
          </Box>
        }
      >
        Is your WhatsApp number same as your phone number?
      </Alert>
    </Snackbar>
  </Box>
  <Box> 
    <RegisterationMediaHandling />
  </Box>
</Box>
</>
  );
};

export default InvestorRegister;
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
  FormLabel,
  FormControlLabel,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  Stack,
  Tooltip,
  List,
  ListItemText,
  Box,
  Chip,
  ListItem,
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
  Divider,  
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { categories } from "./BrandLIstingRegister/BrandCategories";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import Footer from "../../Components/Footers/Footer";
import { DeleteIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/Slices/loadingSlice";
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
      } finally {
      }
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
    setValue("preferredState", "");
    setValue("preferredDistrict", "");
    setValue("preferredCity", "");
    setValue("propertyType", "");
    setValue("propertySize", "");
    setValue("investmentRange", "");
    setValue("investmentAmount", "");
    setSelectedCategories([]);
    setValue("category", []);
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
  };

  // Remove preference handler
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

  // const sendOtp = async (type) => {
  //   let endpoint = "";
  //   let payload = {};
  //   let fieldName = "";

  //   if (type === "email") {
  //     fieldName = "email";
  //     endpoint =
  //       "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/send-otp-email";
  //     payload = { email: watch("email"), type: "email" };
  //   } else if (type === "mobile") {
  //     fieldName = "mobileNumber";
  //     endpoint =
  //       "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/send-otp-mobile";
  //     payload = {
  //       mobile: `${phonePrefix}${watch("mobileNumber")}`,
  //       type: "mobile",
  //     };
  //   } else if (type === "whatsapp") {
  //     fieldName = "whatsappNumber";
  //     endpoint =
  //       "https://franchise-backend-wgp6.onrender.com/api/v1/otpverify/send-otp-whatsapp";
  //     payload = {
  //       mobile: `${phonePrefix}${watch("whatsappNumber")}`,
  //       type: "whatsapp",
  //     };
  //   }

  //   const selectedCountry=useWatch({
  //     control,
  //     name:"country",
  //     defaultValue:"IN"
  //   })

  //   // Validate the field first
  //   const isValid = await trigger(fieldName);
  //   if (!isValid) {
  //     showSnackbar(`Please enter a valid ${type} address`, "error");
  //     return;
  //   }

  //   setOtpStates((prev) => ({
  //     ...prev,
  //     [type]: {
  //       ...prev[type],
  //       loading: true,
  //       error: false,
  //     },
  //   }));

  //   try {
  //     const response = await axios.post(endpoint, payload, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (response.status === 200 && response.data.message) {
  //       showSnackbar(`OTP sent to your ${type} successfully!`, "success");
  //       setOtpStates((prev) => ({
  //         ...prev,
  //         [type]: {
  //           ...prev[type],
  //           sent: true,
  //           loading: false,
  //           token: response.data.token,
  //         },
  //       }));
  //       openOtpModal(type);
  //     } else {
  //       throw new Error(response.data.message || `Failed to send ${type} OTP`);
  //     }
  //   } catch (error) {
  //     console.error(`Error sending ${type} OTP:`, error);
  //     showSnackbar(
  //       error.response?.data?.message ||
  //         `Failed to send ${type} OTP. Please try again.`,
  //       "error"
  //     );
  //     setOtpStates((prev) => ({
  //       ...prev,
  //       [type]: {
  //         ...prev[type],
  //         loading: false,
  //         error: true,
  //       },
  //     }));
  //   }
  // };

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

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

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
        showSnackbar(
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    } catch (error) {
  console.error("Registration error:", error);
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
    <Box
    mt={5}
      sx={{
        // backgroundImage: `url(${backgroundImage})` ,
        // backgroundColor: "#f0f0f0",
        backgroundSize: "contain",
        backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
 
    
        <Box
          ref={dropdownRef}
          // elevation={3}
          
          sx={{
            p: 2,
            maxWidth:'500vh',
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          
          
          <Typography
            variant="h3"
            gutterBottom
            fontWeight="bold"
            sx={{ textAlign: "center", mb: 1, color: "#7ad03a", mt: 3 }}
          >
            Investor Registration
          </Typography>
<Toolbar
            sx={{ display: "flex", justifyContent: "flex-end", mb: -2, mt: -2 }}
          >
            <FormControl
              size="small"
              sx={{
                minWidth: 130,
                backgroundColor: "white",
                borderRadius: "4px",
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
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Toolbar>
          <form   onSubmit={handleSubmit(onSubmit)}  >
            <Typography
              variant="h4"
              sx={{
                marginBottom: "25px",
                marginTop: "5px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Personal Details
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                // gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
                gap: 2,
                
              }}
            >
              {" "}
              {/* Name Field */}
              <Grid display={"flex"} >
                <Typography>First Name</Typography>
                <TextField
                  label="Name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || " "}
                />
              </Grid>
              {/* {email field} */}
              <Grid display={"flex"} >
                <Typography>Email</Typography>
                <TextField
                  label="Email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message || " "}
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <Button
                  //         size="small"
                  //         variant="outlined"
                  //         onClick={() => {
                  //           if (otpStates.email.verified) return;
                  //           sendOtp("email");
                  //         }}
                  //         disabled={otpStates.email.loading || otpStates.email.verified}
                  //       >
                  //         {otpStates.email.loading ? (
                  //           <CircularProgress size={20} />
                  //         ) : otpStates.email.verified ? (
                  //           "Verified"
                  //         ) : otpStates.email.sent ? (
                  //           "Resend OTP"
                  //         ) : (
                  //           "Send OTP"
                  //         )}
                  //       </Button>
                  //     </InputAdornment>
                  //   ),
                  // }}
                />
              </Grid>
              {/* Mobile number field */}
              <Grid display={"flex"}>
                <Typography>Mobile Number</Typography>
                <TextField
                  label="Mobile Number"
                  {...register("mobileNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number (10 digits required)",
                    },
                  })}
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
                        {phonePrefix}
                      </InputAdornment>
                    ),
                    //   endAdornment: (
                    //     <InputAdornment position="end">
                    //       <Button
                    //         size="small"
                    //         variant="outlined"
                    //         onClick={() => {
                    //           if (otpStates.mobile.verified) return;
                    //           sendOtp("mobile");
                    //         }}
                    //         disabled={otpStates.mobile.loading || otpStates.mobile.verified}
                    //       >
                    //         {otpStates.mobile.loading ? (
                    //           <CircularProgress size={20} />
                    //         ) : otpStates.mobile.verified ? (
                    //           "Verified"
                    //         ) : otpStates.mobile.sent ? (
                    //           "Resend OTP"
                    //         ) : (
                    //           "Send OTP"
                    //         )}
                    //       </Button>
                    //     </InputAdornment>
                    //   ),
                  }}
                />
              </Grid>
              {/* WhatsApp Field */}
              <Grid display={"flex"}>
                <Typography>WhatsApp Number</Typography>
                <TextField
                  label="WhatsApp Number"
                  {...register("whatsappNumber", {
                    required: "WhatsApp number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid WhatsApp number (10 digits required)",
                    },
                  })}
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
                  disabled={!whatsappEnabled}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {phonePrefix}
                      </InputAdornment>
                    ),
                    //   endAdornment: (
                    //     <InputAdornment position="end">
                    //       <Button
                    //         size="small"
                    //         variant="outlined"
                    //         onClick={() => {
                    //           if(otpStates.whatsapp.verified) return;
                    //           sendOtp("whatsapp");
                    //         }}
                    //         disabled={otpStates.whatsapp.loading || otpStates.whatsapp.verified}
                    //       >
                    //         {otpStates.whatsapp.loading ? (
                    //           <CircularProgress size={20} />
                    //         ) : otpStates.whatsapp.verified ? (
                    //           "Verified"
                    //         ) : otpStates.whatsapp.sent ? (
                    //           "Resend OTP"
                    //         ) : (
                    //           "Send OTP"
                    //         )}
                    //       </Button>
                    //     </InputAdornment>
                    //   ),
                  }}
                />
              </Grid>
              {/* {country} */}
              {/* <Grid sx={{ width: "21%", xs: 12, sm: 3 }}>
              <TextField
                select
                fullWidth
                defaultValue="India"
                SelectProps={{ native: true }}
                label="Country"
                {...register("country", { required: "Country is required" })}
                error={!!errors.country}
                helperText={errors.country?.message || " "}
              >
                <option value="India">India</option>
              </TextField>
            </Grid> */}
              {/* {address} */}
              <Grid display={"flex"}>
                <Typography>Address</Typography>
                <TextField 
                label="Address" {...register("address",
                  {
                    required: "Address is required",
                  }
                 
                )} error={!!errors.address}
                helperText={errors.address?.message || " "}
                 />
              </Grid>
              {/* {pincode} */}
              <Grid display={"flex"}>
                <Typography>Pincode</Typography>
                <TextField
                  label="Pincode"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Pincode must be 6 digits",
                    },
                  })}
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message || " "}
                />
              </Grid>
              {/* {state} */}
              <Grid display={"flex"}>
                <Typography>State</Typography>
                <TextField
                  label="State"
                  value={watch("state") || ""}
                  {...register("state")}
                  InputProps={{ readOnly: true }}
                  error={!!errors.state}
                />
              </Grid>
              {/* {city} */}
              <Grid display={"flex"}>
                <Typography>City</Typography>
                <TextField
                  label="City"
                  value={watch("city") || ""}
                  {...register("city")}
                  InputProps={{ readOnly: true }}
                  error={!!errors.city}
                />
              </Grid>
              {/* {district} */}
              {/* <Grid sx={{ width: "21%", xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="District"
                value={watch("district") || ""}
                {...register("district")}
                InputProps={{ readOnly: true }}
                error={!!errors.district}
              />
            </Grid> */}
              {/* Occupation Field */}
              <Grid display={"flex"}>
                <Typography> Occupation</Typography>
                <TextField
                  select
                  defaultValue=""
                  SelectProps={{ native: true }}
                  {...register("occupation")}
                  error={!!errors.occupation}
                  helperText={errors.occupation?.message}
                >
                  <option value="">Select Occupation</option>
  <option value="Student">Student</option>
  <option value="Salaried Professional">Salaried Professional</option>
  <option value="Business Owner/ Self-Employed">Business Owner/ Self-Employed</option>
  <option value="Retired">Retired</option>
  <option value="Freelancer/ Consultant">Freelancer/ Consultant</option>
  <option value="Homemaker">Homemaker</option>
  <option value="Investor">Investor</option>
  <option value="Other">Other</option>
                </TextField>
              </Grid>
              {occupationValue === "Other" && (
                <Grid  sx={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Specify Occupation"
                    {...register("otherOccupation", {
                      required: "please Specify Occupation is required",
                    })}
                    error={!!errors.otherOccupation}
                    helperText={errors.otherOccupation?.message}
                  />
                </Grid>
              )}
            </Grid>
            {/* <Divider sx={{ borderColor: "#7ad03a", mt: 5 }} /> */}

            <Typography
              variant="h5"
              sx={{
                marginBottom: "25px",
                marginTop: "20px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Preferences
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                // gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
                gap: 2,
              }}
            >
              {/* Category Field */}
              {/* Category Selection - Multi-Level Dropdown */}
<Grid item xs={12}>
  <Stack direction="row"  spacing={2} alignItems="center"  >
    <Typography>Category</Typography>
    {/* Main Category Dropdown */}
    <FormControl sx={{ minWidth: 200 }} >
      <InputLabel>Industry</InputLabel>
      <Select
        value={selectedMainCategory || ''}
        onChange={(e) => {
          setSelectedMainCategory(e.target.value);
          setSelectedSubCategory('');
          setSelectedChild('');
        }}
        label="Main Category"
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
    <FormControl sx={{ minWidth: 200 }} disabled={!selectedMainCategory}>
      <InputLabel>Main category</InputLabel>
      <Select
        value={selectedSubCategory || ''}
        onChange={(e) => {
          setSelectedSubCategory(e.target.value);
          setSelectedChild('');
        }}
        label="Subcategory"
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
    <FormControl sx={{ minWidth: 200 }} disabled={!selectedSubCategory}>
      <InputLabel>Sub Category</InputLabel>
      <Select
        value={selectedChild || ''}
        onChange={(e) => setSelectedChild(e.target.value)}
        label="Item"
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
    <Button
      variant="contained"
      color="success"
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
      sx={{ height: '56px' }} // Match select height
    >
      Add Category
    </Button>
  </Stack>

  {/* Display Selected Categories */}
  {selectedCategories.length > 0 && (
    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {selectedCategories.map((cat, index) => (
        <Chip
          key={index}
          label={`${cat.main} > ${cat.sub} > ${cat.child}`}
          onDelete={() => {
            setSelectedCategories(selectedCategories.filter((_, i) => i !== index));
          }}
          sx={{ 
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            '& .MuiChip-deleteIcon': {
              color: '#1976d2'
            }
          }}
        />
      ))}
    </Box>
  )}
</Grid>

              {/* {preferred investment range field} */}
              <Grid display={'flex'}>
                <Typography>Preferred Investment Range</Typography>
                <TextField
                  select
                  defaultValue=""
                  SelectProps={{ native: true }}
                  {...register("investmentRange"
                  //   , {
                  //   required: "Preferred investment range is required",
                  // }
                )}
                  error={!!errors.investmentRange}
                  helperText={errors.investmentRange?.message}
                >
                  <option value="">Select Preferred Investment Range</option>
                  <option value="having amount">
                    Having Investment Amount Ready
                  </option>
                  <option value="take loan">Planning to take a Loan</option>
                  <option value="need loan">Need Loan Assistance</option>
                </TextField>
              </Grid>
              {selectedRange && (
                <Grid  display={'flex'}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Preferred Investment Amount</Typography>
                    <TextField
                      select
                      defaultValue=""
                      SelectProps={{ native: true }}
                      {...register("investmentAmount"
                      //   , {
                      //   required: "Please select an amount range",
                      // }
                    )}
                      error={!!errors.investmentAmount}
                      helperText={errors.investmentAmount?.message}
                    >
                      <option value="">
                        Select preferred Investment Amount
                      </option>
                      <option value="Below-50,000">Below - Rs.50 K</option>
                      <option value="Rs.50,000-2L">Rs.50 K - 2 L</option>
                      <option value="Rs.2L-5L">Rs.2 L - 5 L</option>
                      <option value="Rs.5L-10L">Rs.5 L - 10 L</option>
                      <option value="Rs.10L-20L">Rs.10 L - 20 L</option>
                      <option value="Rs.20L-30L">Rs.20 L - 30 L</option>
                      <option value="Rs.30L-50L">Rs.30 L - 50 L</option>
                      <option value="Rs.50L-1Cr">Rs.50 L - 1 Cr</option>
                      <option value="Rs.1Cr-2Cr">Rs.1 Cr - 2 Cr</option>
                      <option value="Rs.2Cr-5Cr">Rs.2 Cr - 5 Cr</option>
                      <option value="Rs.5Cr-above">Rs.5 Cr - Above</option>
                    </TextField>
                    <Tooltip title="Select your preferred investment range as per your budget.">
                      <InfoIcon
                        sx={{ color: "#ff9800", cursor: "pointer", mt: 1 }}
                      />
                    </Tooltip>
                  </Stack>
                </Grid>
              )}

              {/* Preferred State Field (changed to text input) */}
              <Grid  display={'flex'}>
                <Typography>Preferred State</Typography>
                <FormControl sx={{ minWidth: 200 }} error={!!errors.preferredState}>

                  <InputLabel>Preferred State *</InputLabel>
                  <Select
                    label="Preferred State"
                    value={watch("preferredState") || ""}
                    {...register("preferredState"
                    //   , {
                    //   required: "Preferred state is required",
                    // }
                  )}
                    onChange={(e) => {
                      setValue("preferredState", e.target.value);
                      setValue("preferredDistrict", "");
                      setValue("preferredCity", "");
                    }}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {preferredStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error" variant="caption">
                    {errors.preferredState?.message}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Preferred District Field  */}
              <Grid display={'flex'}>
                <Typography>Preferred District</Typography>
                <FormControl sx={{ minWidth: 200 }} error={!!errors.preferredDistrict}>
                  <InputLabel>Preferred District *</InputLabel>
                  <Select
                    label="Preferred District"
                    value={watch("preferredDistrict") || ""}
                    {...register("preferredDistrict"
                    //   , {
                    //   required: "Preferred district is required",
                    // }
                  )}
                    onChange={(e) => {
                      setValue("preferredDistrict", e.target.value);
                      setValue("preferredCity", "");
                    }}
                    disabled={!watch("preferredState")}
                  >
                    <MenuItem value="">Select District</MenuItem>
                    {preferredDistricts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error" variant="caption">
                    {errors.preferredDistrict?.message}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Preferred City Field (changed to text input) */}
              <Grid  display={'flex'}>
                <Typography>Preferred City</Typography>
                <FormControl sx={{ minWidth: 200 }} error={!!errors.preferredCity}>
                  <InputLabel>Preferred City *</InputLabel>
                  <Select
                    label="Preferred City"
                    value={watch("preferredCity") || ""}
                    {...register("preferredCity"
                    //   , {
                    //   required: "Preferred city is required",
                    // }
                  )}
                    disabled={!watch("preferredDistrict")}
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {preferredCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error" variant="caption">
                    {errors.preferredCity?.message}
                  </Typography>
                </FormControl>
              </Grid>
              {/* Property Type Field */}
              <Grid  display={'flex'}>
                <Typography>Property Type</Typography>
                <FormControl
                  component="fieldset"
                  sx={{ minWidth: 200 }}
                  // error={!!errors.propertyType}
                >
                  <Controller
                    name="propertyType"
                    control={control}
                    // rules={{ required: "Property type is required" }}
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
                        sx={{ flexWrap: "nowrap" }}
                      >
                        <FormControlLabel
                          value="Own Property"
                          control={<Radio />}
                          label="Own Property"
                        />
                        <FormControlLabel
                          value="Rental Property"
                          control={<Radio />}
                          label="Rental Property"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.propertyType && (
                    <Typography color="error" variant="caption">
                      {errors.propertyType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Property Size Field - Only show for Own Property */}
              {watch("propertyType") === "Own Property" && (
                <Grid  display={'flex'}>
                  <Typography>Property Size</Typography>
                  <TextField
                    select
                    sx={{ minWidth: 200 }}
                    label="Property Size *"
                    {...register("propertySize", {
                      required: "Property size is required for own property",
                    })}
                    error={!!errors.propertySize}
                    helperText={errors.propertySize?.message}
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
                </Grid>
              )}
              {/* Add Preference Button */}
              <Grid  xs={12} sm={6} md={4} mt={1} >
            <Button size="medium"  fullWidth  variant="contained" sx={{ bgcolor: '#7ad03a', '&:hover': { bgcolor: '#6fbf2a' } }}  onClick={handleAddPreference}>
              Add Preference
            </Button>
            
          </ Grid>
 

         

            </Grid>
                        <Grid item xs={12}>
  
  {preferences.length > 0 && (
    <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
      <Table size="small" aria-label="added preferences table">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Categories</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Investment</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preferences.map((pref, idx) => (
            <TableRow key={idx}>
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
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}
</Grid>
            <Divider sx={{ borderColor: "#7ad03a", mt: 5 }} />
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", flexDirection  : "column" }} mt={3}>
                {/* Terms and Conditions Checkbox */}
                <Grid
                  
                  xs={12}
                  sx={{ justifyContent: "center", display: "flex" }}
                >
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox {...register("terms", { required: true })} />
                      }
                      label={
                        <Typography variant="body2">
                          I agree to the{" "}
                          <Link component={RouterLink} to="/termsandconditions">
                            terms and conditions
                          </Link>
                        </Typography>
                      }
                    />
                    {errors.terms && (
                      <Typography color="error" variant="body2">
                        You must accept the terms
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid
                  
                  xs={12}
                  sx={{  display: "flex", justifyContent: "center" }}
                >
                  <Button
                    // fullWidth
                    type="submit"
                    size="small"
                    variant="contained"
                    sx={{
                      width: "30%",
                      bgcolor: "#7ad03a",
                      color: "white",
                      "&:hover": { bgcolor: "#7ad033" },
                    }}
                  >
                    REGISTER
                  </Button>
                </Grid>
                {/* Sign In Link */}
                <Grid  xs={12} sx={{ mt: 0, textAlign: "center" }}>
                  <Typography>
                    Already have an account?{" "}
                    <Box
                      component="span"
                      onClick={openLoginPopup}
                      sx={{
                        textDecoration: "none",
                        cursor: "pointer",
                        color: "primary.main",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      Sign In
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
          </form>
        </Box>
        {/* Login Popup Dialog */}
        <Dialog
          open={loginOpen}
          onClose={closeLoginPopup}
          maxWidth="sm"
          fullWidth
        >
          <LoginPage open={loginOpen} onClose={closeLoginPopup} />
        </Dialog>
        {/* OTP Verification Modal */}
        <Dialog open={otpModal.open} onClose={closeOtpModal}>
          <DialogTitle>
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
              variant="standard"
              value={otpModal.otp}
              onChange={(e) => {
                // Only allow numbers and limit length
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtpModal((prev) => ({ ...prev, otp: value }));
              }}
              disabled={otpModal.verified}
              InputProps={{
                endAdornment: otpModal.verified && (
                  <InputAdornment position="end">
                    <Typography color="success.main">Verified</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeOtpModal}>Cancel</Button>
            <Button
              onClick={verifyOtp}
              disabled={otpModal.verified || otpModal.loading}
              color="primary"
              variant="contained"
            >
              {otpModal.loading ? (
                <CircularProgress size={24} />
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
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

<Snackbar
  open={showWhatsappSnackbar}
  autoHideDuration={6000}
  onClose={() => setShowWhatsappSnackbar(false)}
  anchorOrigin={{ vertical: 'top',  horizontal: 'center', }}
  sx={{ width: '100%', maxWidth: '800px' }}
>
  <Alert
    onClose={() => setShowWhatsappSnackbar(false)}
    severity="info"
    sx={{ width: '100%', }}
    action={
      <>
        <Button
          color="success"
          size="medium"
          onClick={() => {
            setValue("whatsappNumber", watch("mobileNumber"));
            setShowWhatsappSnackbar(false);
            setWhatsappEnabled(true);
            showSnackbar("WhatsApp number auto-filled.", "success");
          }}
        >
          Yes
        </Button>
        <Button
          color="warning"
          size="medium"
          onClick={() => {
            setShowWhatsappSnackbar(false);
            setWhatsappEnabled(true);
          }}
        >
          No
        </Button>
      </>
    }
  >
    Is your WhatsApp number same as your phone number?
  </Alert>
</Snackbar>
     
      <Footer />
    </Box>
  );
};

export default InvestorRegister;



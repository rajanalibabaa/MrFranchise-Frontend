
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
  FormLabel,
  FormHelperText ,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
  Autocomplete,
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
   Tooltip,
   useMediaQuery,
   useTheme,
} from "@mui/material";
import { FavoriteBorderOutlined, Person, PersonOutlined, WhatsApp,Email, Phone, Home, LocationCity, Work, HomeWork, MeetingRoom } from "@mui/icons-material";
import { categories } from "./BrandLIstingRegister/BrandCategories";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { DeleteIcon } from "lucide-react";
import {EditIcon} from "lucide-react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/Slices/loadingSlice";
import RegisterationMediaHandling from "./RegisterationMediaHandling";
import { InfoOutlined } from "@mui/icons-material";
import FlagIcon from '@mui/icons-material/Flag';
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";
import { API_BASE_URL } from "../../Api/api";


const InvestorRegister = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      category: [],
      country: "",
      preferredState: "",
      preferredCity: "",
      preferredDistrict: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [phonePrefix, setPhonePrefix] = useState("");
const [countryCodes, setCountryCodes] = useState([]);
const [selectedCountry, setSelectedCountry] = useState("");
  const dropdownRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [showWhatsappSnackbar, setShowWhatsappSnackbar] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
// --- Property Location State ---
const [propertyCountries, setPropertyCountries] = useState(["India"]);
const [propertyStates, setPropertyStates] = useState([]);
const [propertyCities, setPropertyCities] = useState([]);
// const [propertyDistricts, setPropertyDistricts] = useState([]);
const propertyCountry = watch("propertyCountry");
const propertyState = watch("propertyState");
// const propertyDistrict = watch("propertyDistrict");

  //Domestic country
  const [indiaData, setIndiaData] = useState([]);
  const [preferredStates, setPreferredStates] = useState([]);
  const [preferredCities, setPreferredCities] = useState([]);
  const [preferredDistricts, setPreferredDistricts] = useState([]);

  // International country
const [intlCountries, setIntlCountries] = useState([]);
  const [intlStates, setIntlStates] = useState([]);
  const [intlCities, setIntlCities] = useState([]);
const [loadingPincode, setLoadingPincode] = useState(false);
const [pincodeError, setPincodeError] = useState('');
 const preferredStateValue = watch("preferredState");
  const preferredDistrictValue = watch("preferredDistrict");
const preferredLocationType = watch("preferredLocationType");
  const [loginOpen, setLoginOpen] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);
const [selectedMainCategory, setSelectedMainCategory] = useState('');
const [selectedSubCategory, setSelectedSubCategory] = useState('');
const [selectedChild, setSelectedChild] = useState('');
const propertyTypeValue = useWatch({ control, name: "propertyType" });

  const FORM_DATA_KEY = "investor_form_data";
  const initialFormData = {
    firstName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    categories: [],
    investmentRange: "",
    investmentAmount: "",
    occupation: "",
    otherOccupation: "",
    propertyType: "",
    propertySize: "",
    propertyCountry: "",
    propertyState: "",
    propertyCity: "",
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
  fetch("https://countriesnow.space/api/v0.1/countries/positions")
    .then(res => res.json())
    .then(data => {
      if (data.data) setPropertyCountries(data.data.map(c => c.name));
    });
  setValue("propertyCountry", "");
  setValue("propertyState", "");
  setValue("propertyCity", "");
  setPropertyStates([]);
  setPropertyCities([]);
}, [setValue]);

// --- Fetch Property States ---
useEffect(() => {
  if (!propertyCountry) {
    setPropertyStates([]);
    setValue("propertyState", "");
    // setValue("propertyDistrict", "");
    setValue("propertyCity", "");
    // setPropertyDistricts([]);
    setPropertyCities([]);
    return;
  }
  fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: propertyCountry.trim() }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.data && data.data.states) setPropertyStates(data.data.states.map(s => s.name));
      else setPropertyStates([]);
    });
  setValue("propertyState", "");
  // setValue("propertyDistrict", "");
  setValue("propertyCity", "");
  // setPropertyDistricts([]);
  setPropertyCities([]);
}, [propertyCountry, setValue]);

// --- Fetch Property Districts (if your API provides districts, otherwise skip this) ---
// useEffect(() => {
//   if (!propertyState) {
//     setPropertyDistricts([]);
//     setValue("propertyDistrict", "");
//     setValue("propertyCity", "");
//     setPropertyCities([]);
//     return;
//   }
//   // If you have a districts API, use it here. Otherwise, skip this effect.
//   // For most international countries, you may not have districts, so you can skip or use propertyState as propertyDistrict.
//   setPropertyDistricts([propertyState]);
//   setValue("propertyDistrict", propertyState);
//   setValue("propertyCity", "");
//   setPropertyCities([]);
// }, [propertyState, setValue]);

// --- Fetch Property Cities ---
useEffect(() => {
  if (!propertyCountry || !propertyState) {
    // setPropertyDistricts([]);
    // setValue("propertyDistrict", "");
    setValue("propertyCity", "");
    setPropertyCities([]);
    return;
  }

 if (propertyCountry === "India" && indiaData.length > 0) {
    const stateObj = indiaData.find((s) => s.name === propertyState);
    if (stateObj) {
  const uniqueCities = Array.from(
    new Set((stateObj.cities || []).map(city => city.name))
  );
  setPropertyCities(uniqueCities);
} else {
  setPropertyCities([]);
}
    setValue("propertyCity", "");
  } else {
    // International: use API
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: propertyCountry.trim(),
        state: propertyState.trim(),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setPropertyCities(data.data);
        } else {
          setPropertyCities([]);
        }
      })
      .catch(() => {
        setPropertyCities([]);
      });
    setValue("propertyCity", "");
  }
}, [propertyCountry, propertyState, setValue, indiaData]);

// --- RESTORE FORM DATA AND PREFERENCES ON MOUNT ---
  useEffect(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Restore preferences
      if (parsed.preferences) setPreferences(parsed.preferences);
      // Restore form fields
      reset({ ...initialFormData, ...parsed });
    }
  }, []);

  // --- SAVE FORM DATA AND PREFERENCES TO LOCALSTORAGE ON CHANGE ---
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(
        FORM_DATA_KEY,
        JSON.stringify({ ...value, preferences })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, preferences]);

  // --- SAVE PREFERENCES TO LOCALSTORAGE WHEN THEY CHANGE ---
  useEffect(() => {
    const currentData = JSON.parse(localStorage.getItem(FORM_DATA_KEY) || "{}");
    localStorage.setItem(
      FORM_DATA_KEY,
      JSON.stringify({ ...currentData, preferences })
    );
  }, [preferences]);

//  country codes
useEffect(() => {
  fetch("https://countriesnow.space/api/v0.1/countries/codes")
    .then(res => res.json())
    .then(data => {
      if (data.data) setCountryCodes(data.data);
    });
}, []);


useEffect(() => {
  const country = watch("country");
  if (!country) {
    setPhonePrefix("");
    return;
  }
  const found = countryCodes.find(
    c => c.name === country || c.iso2 === country || c.iso3 === country
  );
  setPhonePrefix(found ? found.dial_code : "");
}, [watch("country"), countryCodes]);


 useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setIndiaData(res.data);
        setPreferredStates(res.data.map((state) => state.name));
      } catch (err) {
        setIndiaData([]);
        setPreferredStates([]);
      }
    };
    fetchStates();
  }, []);

  // Domestic
  useEffect(() => {
    if (preferredLocationType === "domestic" && preferredStateValue && indiaData.length > 0) {
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
    } else if (preferredLocationType === "domestic") {
      setPreferredDistricts([]);
      setPreferredCities([]);
    }
  }, [preferredStateValue, indiaData, setValue, preferredLocationType]);

  useEffect(() => {
    if (
      preferredLocationType === "domestic" &&
      preferredStateValue &&
      preferredDistrictValue &&
      indiaData.length > 0
    ) {
      const stateObj = indiaData.find((s) => s.name === preferredStateValue);
      if (stateObj) {
        const filteredCities = (stateObj.cities || [])
          .filter((city) => city.district === preferredDistrictValue)
          .map((city) => city.name);
        setPreferredCities(filteredCities);
      } else {
        setPreferredCities([]);
      }
    } else if (preferredLocationType === "domestic") {
      setPreferredCities([]);
    }
  }, [preferredStateValue, preferredDistrictValue, indiaData, preferredLocationType]);

  // International
  useEffect(() => {
    if (preferredLocationType === "international") {
      fetch("https://countriesnow.space/api/v0.1/countries/positions")
        .then(res => res.json())
        .then(data => {
          if (data.data) setIntlCountries(data.data.map(c => c.name));
        });
      setValue("preferredState", "");
      setValue("preferredDistrict", "");
      setValue("preferredCity", "");
      setIntlStates([]);
      setIntlCities([]);
    }
  }, [preferredLocationType, setValue]);

  // International: fetch states
  useEffect(() => {
    if (preferredLocationType === "international" && preferredStateValue) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: preferredStateValue })
      })
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.states) setIntlStates(data.data.states.map(s => s.name));
        });
      setValue("preferredDistrict", "");
      setValue("preferredCity", "");
      setIntlCities([]);
    }
  }, [preferredStateValue, preferredLocationType, setValue]);

  // International: fetch cities
  useEffect(() => {
    if (
      preferredLocationType === "international" &&
      preferredStateValue &&
      preferredDistrictValue
    ) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: preferredStateValue,
          state: preferredDistrictValue,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.data) setIntlCities(data.data);
        });
      setValue("preferredCity", "");
    }
  }, [preferredDistrictValue, preferredStateValue, preferredLocationType, setValue]);


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
   const propertyType = watch("propertyType");
  const isOwnProperty = propertyType === "Own Property";

    const pref = {
      category: selectedCategories,
      investmentRange: watch("investmentRange"),
      investmentAmount: watch("investmentAmount"),
      preferredState: watch("preferredState"),
      preferredDistrict: watch("preferredDistrict"),
      preferredCity: watch("preferredCity"),
      propertyType,
    locationType: watch("preferredLocationType"),
    ...(isOwnProperty && {
      propertySize: watch("propertySize"),
      propertyCountry: watch("propertyCountry"),
      propertyState: watch("propertyState"),
      propertyCity: watch("propertyCity"),
    }),
    };
    if (
    !pref.category.length ||
    !pref.investmentRange ||
    !pref.investmentAmount ||
    !pref.preferredState ||
    !pref.preferredDistrict ||
    !pref.preferredCity ||
    !pref.propertyType ||
    !pref.propertyType ||
  (isOwnProperty && (
    !pref.propertySize ||
    !pref.propertyCountry ||
    !pref.propertyState ||
    !pref.propertyCity
    )))
     {
      showSnackbar("Please fill all preference fields before adding.", "error");
      return;
    }
    setPreferences([...preferences, pref]);
    setValue("investmentRange", "");
  setValue("investmentAmount", "");
  setValue("preferredState", "");
  setValue("preferredDistrict", "");
  setValue("preferredCity", "");
  setValue("preferredLocationType", "");
  setValue("propertyType", "");
  setValue("propertySize", "");
  setValue("propertyCountry", "");
  setValue("propertyState", "");
  setValue("propertyCity", "");
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
      "propertyCountry",
    "propertyState",
    "propertyCity",
    ])
    showSnackbar("Preference added!", "success");
    setTimeout(() => {
alert('Add Multiple preferences to get more offers from us!','info')  
  },2000)
  };

  // Remove preference handler
  const handleRemovePreference = (idx) => {
    setPreferences(preferences.filter((_, i) => i !== idx));
  };

  const handleEditPreference = (idx) => {
    const pref = preferences[idx];
   if (pref.category && pref.category.length > 0) {
    const selectedCat = pref.category[0];

    // Assuming you're using state for these dropdowns
    setSelectedMainCategory(selectedCat.main || '');
    setSelectedSubCategory(selectedCat.sub || '');
    setSelectedChild(selectedCat.child || '');

    // And setting form value for category array
    setSelectedCategories(pref.category);
    setValue("category", pref.category);
  }

  setValue("investmentRange", pref.investmentRange || "");
  setValue("investmentAmount", pref.investmentAmount || "");
  setValue("preferredState", pref.preferredState || "");
  setValue("preferredDistrict", pref.preferredDistrict || "");
  setValue("preferredCity", pref.preferredCity || "");
  setValue("propertyType", pref.propertyType || "");
  setValue("propertySize", pref.propertySize || "");
  setValue("propertyCountry", pref.propertyCountry || "");
  setValue("propertyState", pref.propertyState || "");
  setValue("propertyCity", pref.propertyCity || "");

    setPreferences(preferences.filter((_, i) => i !== idx));
  }
 
 

  // OTP related states
  const [otpModal, setOtpModal] = useState({
    open: false,
    type: null,
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
        setValue("category", updatedCategories);
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
  //     otp: "",
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
      showSnackbar("Please enter a valid OTP", "error");
      return;
    }

    console.log("Verifying OTP for type:", type);
    console.log("OTP entered:", otp);
    setOtpModal((prev) => ({ ...prev, loading: true }));

    try {
      const response = await axios.post(
        `${ API_BASE_URL}/otpverify/verify-otp`,
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
    country: data.country || "India",
    state: data.state || "",
    city: data.city || "",
    occupation: data.occupation || "",
    ...(data.occupation === "Other" && {
      specifyOccupation: data.otherOccupation || "",
    }),
  preferences: preferences.map(pref => {
    const isInternational = pref.locationType === "international";
    return {
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
      propertyPreferred: [{
  propertyType: pref.propertyType,
  ...(pref.propertyType === "Own Property" && {
    propertySize: pref.propertySize,
    propertyCountry: pref.propertyCountry || "",
    propertyState: pref.propertyState || "",
    propertyCity: pref.propertyCity || "",
  }),
}],
   ...(isInternational
        ? {
            preferredCountry: pref.preferredState,
            preferredState: pref.preferredDistrict,
            preferredCity: pref.preferredCity,
          }
        : {
            preferredState: pref.preferredState,
            preferredDistrict: pref.preferredDistrict,
            preferredCity: pref.preferredCity,
          }),
      locationType: pref.locationType,
    };
  }),

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
       
       // "https://franchise-backend-wgp6.onrender.com/api/v1/investor/createInvestor",
         `http://localhost:5000/api/v1/investor/createInvestor`,
        
        "https://franchise-backend-wgp6.onrender.com/api/v1/investor/createInvestor",
        // "http://localhost:5000/api/v1/investor/createInvestor",
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
console.log("Registration response:", response.data);

      if (response.status === 201) {
        localStorage.removeItem(FORM_DATA_KEY);
setFormData(initialFormData);

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
  const currentData = JSON.parse(localStorage.getItem(FORM_DATA_KEY) || '{}');
  localStorage.setItem(FORM_DATA_KEY, JSON.stringify({
    ...currentData,
    preferences
  }));
}, [preferences]);


 useEffect(() => {
  fetch("https://countriesnow.space/api/v0.1/countries")
    .then(res => res.json())
    .then(data => {
      if (data.data) setCountries(data.data.map(c => ({ name: c.country, code: c.iso2 })));
    });
}, []);

  const pincode = watch("pincode");

 useEffect(() => {
  const pincode = watch("pincode");
  const country = watch("country");
  if (!pincode || !country) return;

  const selectedCountryObj = countries.find(c => c.name === country);
  const countryCode = selectedCountryObj?.code || "IN";
  setPincodeError('');
  setLoadingPincode(false);

  if ((countryCode === "IN" && pincode.length === 6) || (countryCode !== "IN" && pincode.length >= 3)) {
    setLoadingPincode(true);

    const fetchLocation = async () => {
      try {
        if (countryCode === "IN") {
          // India Post API
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
            const po = data[0].PostOffice[0];
            setValue("state", po.State || "");
            setValue("city", po.District || po.Block || "");
            setPincodeError('');
          } else {
            setValue("state", "");
            setValue("city", "");
            setPincodeError("Invalid Indian pincode");
          }
        } else {
          // Zippopotam.us for international
          const code = countryCode.toLowerCase();
          const res = await fetch(`https://api.zippopotam.us/${code}/${pincode}`);
          if (!res.ok) throw new Error("Not found");
          const data = await res.json();
          setValue("state", data.places?.[0]?.state || "");
          setValue("city", data.places?.[0]?.["place name"] || "");
          setPincodeError('');
        }
      } catch (err) {
        setValue("state", "");
        setValue("city", "");
        setPincodeError("Postal code not found for selected country");
      } finally {
        setLoadingPincode(false);
      }
    };

    fetchLocation();
  } else {
    setValue("state", "");
    setValue("city", "");
    if (countryCode === "IN" && pincode.length > 0 && pincode.length < 6) {
      setPincodeError("Enter 6-digit pincode");
    }
  }
  // eslint-disable-next-line
}, [watch("pincode"), watch("country")]);

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
    <Box
    sx={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000
  }}>
      <Navbar />
    </Box>
     <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        sx={{
          color: "#7ad03a",
          mb: -3,
          mt: {xs:12, md: 15, lg: 15, sm: 20},
          textAlign: 'center',
          textDecoration: 'underline',
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
        }}
      >
        Investor Registration
      </Typography>
    <Box
  sx={{
    minHeight: "100vh",
flexDirection: isMobile ? "column" : "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
   marginLeft:{xs:"0"},
    width:{xs:"70%",lg:"100%", md:"100%", sm:"100%"},
  }}
>
  <Box
    ref={dropdownRef}
    sx={{
      p: 4,
      ml:"30px",
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
            mt: 1,
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
                  value={field.value || ""}
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
                         gap: 2,
                       }}
                     >
          <Grid item xs={12} md={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
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
                  value={field.value || ""}
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
                  value={field.value || ""}
                  label="WhatsApp Number"
                  fullWidth
                  variant="outlined"
                  // disabled={!whatsappEnabled}
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
<Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                // gridTemplateColumns: { md: "repeat(2, 1fr)", xs: "1fr" },
                gap: 2,
                alignItems:"flex-start"
              }}
            >
         

           <Grid size={4} mt={1}>
    <Controller
      name="country"
      defaultValue="India"
      control={control}
      render={({ field }) => (
     <Autocomplete
        options={countries}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.name === value}
        value={countries.find(c => c.name === field.value) || null}
        onChange={(_, newValue) => {
          field.onChange(newValue ? newValue.name : "");
          setSelectedCountry(newValue ? newValue.name : "");
          setValue("state", "");
          setValue("city", "");
          setValue("pincode", "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Country"
            variant="outlined"
            error={!!errors.country}
            helperText={errors.country?.message || " "}
            InputLabelProps={{ shrink: true }}
          />
        )}
        fullWidth
        sx={{
          borderRadius: '8px',
          backgroundColor: "background.paper"
        }}
      />
    )}
  />
  </Grid>

  {/* Address */}
          <Grid size={8} md={8}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  label="Address"
                  fullWidth
                  variant="outlined"
                  // multiline
                  // minRows={2}
                  // maxRows={3}
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
                      mt: 1
                    },
                 
                    // resize: 'vertical',
                  }}
                />
              )}
            />
          </Grid>
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
    render={({ field }) => {
      // Get country code from dropdown value
      const selectedCountryObj = countries.find(c => c.name === watch("country"));
      const selectedCountryCode = selectedCountryObj?.code || "IN";
      return (
        <TextField
          {...field}
          label={selectedCountryCode === 'IN' ? 'Pincode' : 'Postal Code'}
          fullWidth
          variant="outlined"
          required
          error={!!errors.pincode || !!pincodeError}
          helperText={
            errors.pincode?.message ||
            pincodeError ||
            (selectedCountryCode === 'IN' ? '' : '')
          }
          inputProps={{
            maxLength: selectedCountryCode === 'IN' ? 6 : 10,
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          onChange={e => {
            const value = e.target.value.replace(/\D/g, '').slice(0, selectedCountryCode === 'IN' ? 6 : 10);
            field.onChange(value);
            setPincodeError('');
          }}
          disabled={!selectedCountryCode}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title={selectedCountryObj?.name || 'Country'}>
                  <FlagIcon  />
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: loadingPincode ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
      );
    }}
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
                  value={field.value || ""}
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
          <Tooltip title={
                          <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                           You can add multiple preferences to get more offers from us!
                          </span>
                        }
                        placement="right-start"
                        arrow
                        enterTouchDelay={0} // makes it responsive on mobile too
                      >
                        <IconButton
                          size="small"
                          sx={{
                            // p: 0.8,
                            color: "warning.main",
                            // backgroundColor: 'info.light',
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                            marginLeft: "5px",
                            // borderRadius: '50%',
                          }}
                        >
                          <InfoOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>{" "}
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
                    value={field.value || ''}
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
          </Typography><Grid item xs={12}>
    <Controller
      name="preferredLocationType"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <FormControl component="fieldset" error={!!errors.preferredLocationType}>
          {/* <FormLabel component="legend">Location Type</FormLabel> */}
          <RadioGroup row {...field}>
            <FormControlLabel value="domestic" control={<Radio />} label="India" />
            <FormControlLabel value="international" control={<Radio />} label="International" />
          </RadioGroup>
          <FormHelperText>{errors.preferredLocationType?.message || " "}</FormHelperText>
        </FormControl>
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
          {/* Preferred Location */}
         <Grid item xs={12} md={4}>
          <Controller
            name="preferredState"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label={
                  preferredLocationType === "international"
                    ? "Country"
                    : "Preferred State"
                }
                variant="outlined"
                disabled={preferredLocationType === ""}
                error={!!errors.preferredState}
                helperText={errors.preferredState?.message || " "}
                onChange={e => {
                  field.onChange(e);
                  setValue("preferredDistrict", "");
                  setValue("preferredCity", "");
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="">
                  Select {preferredLocationType === "international" ? "Country" : "State"}
                </MenuItem>
                {(preferredLocationType === "international"
                  ? intlCountries
                  : preferredStates
                ).map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Preferred District/State */}
        <Grid item xs={12} md={4}>
          <Controller
            name="preferredDistrict"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label={
                  preferredLocationType === "international"
                    ? "State"
                    : "Preferred District"
                }
                variant="outlined"
                disabled={
                  preferredLocationType === "" ||
                  !watch("preferredState")
                }
                error={!!errors.preferredDistrict}
                helperText={errors.preferredDistrict?.message || " "}
                onChange={e => {
                  field.onChange(e);
                  setValue("preferredCity", "");
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="">
                  Select {preferredLocationType === "international" ? "State" : "District"}
                </MenuItem>
                {(preferredLocationType === "international"
                  ? intlStates
                  : preferredDistricts
                ).map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Preferred City */}
        <Grid item xs={12} md={4}>
          <Controller
            name="preferredCity"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Preferred City"
                variant="outlined"
                disabled={
                  preferredLocationType === "" ||
                  !watch("preferredDistrict")
                }
                error={!!errors.preferredCity}
                helperText={errors.preferredCity?.message || " "}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="">Select City</MenuItem>
                {(preferredLocationType === "international"
                  ? intlCities
                  : preferredCities
                ).map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
  {/* International Country */}
  {/* <Grid item xs={12} md={4}>
    <Controller
      name="preferredCountry"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          select
          fullWidth
          label="Preferred Country"
          variant="outlined"
          disabled={watch("preferredLocationType") !== "international"} // Enable only if International
          error={!!errors.preferredCountry}
          helperText={errors.preferredCountry?.message || " "}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        >
          <MenuItem value="">Select Country</MenuItem>
          {internationalCountries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  </Grid> */}
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
                  value={field.value || ""}
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
                    setValue("propertyCountry", "");
              setValue("propertyState", "");
              setValue("propertyCity", "");
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
       rules={{
         required: watch("propertyType") === "Own Property"
           ? "Property size is required"
          : false
      }}
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
        </Grid>
       
      {watch("propertyType") === "Own Property" && (
  <Grid container spacing={2} sx={{
    display: "grid",
    gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
    gap: 2,
    mt: 2,
  }}>
    <Grid item xs={12} md={4}>
      <Controller
        name="propertyCountry"
        control={control}
        rules={{ required: "Country is required" }}
        render={({ field }) => (
          <Autocomplete
            freeSolo
            options={propertyCountries}
            value={field.value || ""}
            onChange={(_, newValue) => {
              field.onChange(newValue || "");
              setValue("propertyState", "");
              setValue("propertyCity", "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Property Country"
                error={!!errors.propertyCountry}
                helperText={errors.propertyCountry?.message}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            )}
          />
        )}
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <Controller
        name="propertyState"
        control={control}
        rules={{ required: "State is required" }}
        render={({ field }) => (
          <Autocomplete
            freeSolo
            options={propertyStates}
            value={field.value || ""}
            onChange={(_, newValue) => {
              field.onChange(newValue || "");
              setValue("propertyCity", "");
            }}
            disabled={!watch("propertyCountry")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Property State"
                error={!!errors.propertyState}
                helperText={errors.propertyState?.message}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            )}
          />
        )}
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <Controller
        name="propertyCity"
        control={control}
        rules={{ required: "City is required" }}
        render={({ field }) => (
          <Autocomplete
            freeSolo
            options={propertyCities}
            value={field.value || ""}
            onChange={(_, newValue) => field.onChange(newValue || "")}
            disabled={!watch("propertyState")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Property City"
                error={!!errors.propertyCity}
                helperText={errors.propertyCity?.message}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            )}
          />
        )}
      />
    </Grid>
  </Grid>
)}

        </Grid>

        {/* Add Preference Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 ,mr:{xs:"40px", sm:"55px"}}}>
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
                <TableContainer
      component={Paper}
      sx={{
        borderRadius: '12px',
        overflowX: 'auto',
width: '100%',
WebkitOverflowScrolling: 'touch',
        // Custom horizontal scrollbar styles
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#555',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#333',
        },
      }}
    ></TableContainer>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'auto' }}>
              <Table size="small" aria-label="added preferences table">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#7ad03a' }}>
            <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>#</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Industry</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Main Category</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Sub Category</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Investment Range</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Preferred State</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Preferred District</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Preferred City</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Property Country</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Property State</TableCell>  
    <TableCell sx={{ color: 'primary.contrastText' }}>Property City</TableCell>    
    <TableCell sx={{ color: 'primary.contrastText' }}>Investment Amount</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Property Type</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Property Size</TableCell>
    <TableCell sx={{ color: 'primary.contrastText' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
                <TableBody>
          {preferences.map((pref, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                {pref.category.map((cat, i) => (
                  <Typography key={i}>{cat.main}</Typography>
                ))}
              </TableCell>
              <TableCell>
                {pref.category.map((cat, i) => (
                  <Typography key={i}>{cat.sub}</Typography>
                ))}
              </TableCell>
              <TableCell>
                {pref.category.map((cat, i) => (
                  <Typography key={i}>{cat.child}</Typography>
                ))}
              </TableCell>
                <TableCell>
        <Typography>{pref.investmentAmount}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.preferredState}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.preferredDistrict}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.preferredCity}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.propertyCountry}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.propertyState}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.propertyCity}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.investmentRange}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{pref.propertyType}</Typography>
      </TableCell>
             
              <TableCell>
                {/* <Typography variant="subtitle2" fontWeight="bold">Size:</Typography> */}
                <Typography>
                  {pref.propertyType === 'Own Property'
                    ? pref.propertySize
                    : 'N/A'}
                </Typography>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditPreference(idx)}
                    aria-label="edit preference"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreference(idx)}
                    aria-label="remove preference"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
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
{/* <CaptchaForm /> */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={preferences.length === 0}
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
  {!isMobile && (
  <Box sx={{marginTop:{sm:"35px"}}}>
    <RegisterationMediaHandling />
  </Box>
  )}
</Box>
<Box>
  <Footer/>
</Box>
</>
  );
};

export default InvestorRegister;
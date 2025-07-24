import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Divider,
  Drawer,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  Close,
  ArrowBack,
  ArrowForward,
  Phone,
  Favorite,
  ShareOutlined,
  PlaylistAddCheckCircleOutlined,
  ArrowUpward,
  Info,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useBrand } from "../../Hooks/Fetchbrands.jsx";
import axios from "axios";
import OverviewTab from "./OverviewTab.jsx";
import Footer from "../../Components/Footers/Footer.jsx";
import Navbar from "../../Components/Navbar/NavBar.jsx";
import { useToggleLike } from "../../Hooks/Fetchbrands.jsx";
import LikedBrands from "../../Components/HomePage_VideoSection/LikedBrands.jsx";
import SimilarBrands from "../../Components/HomePage_VideoSection/SimilarBrands.jsx";
import ShareDialogActions from "./ShareDialogActions.jsx";
import { handleShortList } from "../../Api/shortListApi.jsx";
import BillboardAd from "../../services/AdvertiseAds/BillBoardsAdsBrandViewPage.jsx";
import { InfoIcon } from "lucide-react";

// Component for expansion location tags to reduce main component size
const ExpansionLocationTags = ({ brand, isMobile, isTablet, isSmallDesktop, isLargeDesktop }) => {
  const locations = Array.isArray(
    brand.expansionLocationData?.expansionLocations?.domestic?.locations
  )
    ? brand.expansionLocationData.expansionLocations.domestic.locations.flatMap(
        (loc) =>
          Array.isArray(loc.districts)
            ? loc.districts.flatMap((dist) =>
                Array.isArray(dist.cities)
                  ? dist.cities.map((city) => ({
                      city,
                      district: dist.district,
                      state: loc.state,
                    }))
                  : []
              )
            : []
      )
    : [];

  const category = brand.franchiseDetails?.brandCategories || {};
  const formattedChipsState = locations.map((loc, index) => ({
    key: `${loc.state}-${index}`,
    label: ` ${category.child || ""} franchise in-${loc.state}`,
  }));
  const formattedChipsDistrict = locations.map((loc, index) => ({
    key: `${loc.district}-${index}`,
    label: ` ${category.child || ""} franchise in-${loc.district}`,
  }));
  const formattedChipsCity = locations.map((loc, index) => ({
    key: `${loc.city}-${index}`,
    label: ` ${category.child || ""} franchise in-${loc.city}`,
  }));

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        p: 2,
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : isTablet
          ? "repeat(2, 1fr)"
          : "repeat(3, 1fr)",
        gap: 2,
        height: isMobile ? "auto" : "90px",
        overflowY: "auto",
      }}
    >
      {/* State Column */}
      <Box>
        {formattedChipsState.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {formattedChipsState
              .slice(0, isMobile ? 3 : formattedChipsState.length)
              .map((chip) => (
                <Typography
                  key={chip.key}
                  variant="caption"
                  sx={{
                    borderRadius: "4px",
                    color: "black",
                    whiteSpace: "nowrap",
                    fontSize: isMobile ? "0.7rem" : "0.8rem",
                  }}
                >
                  {chip.label}
                </Typography>
              ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              mt: 2,
            }}
          >
            No locations available
          </Typography>
        )}
      </Box>

      {/* District Column - hidden on mobile if no space */}
      {!isMobile && (
        <Box>
          {formattedChipsDistrict.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {formattedChipsDistrict
                .slice(0, isMobile ? 3 : formattedChipsDistrict.length)
                .map((chip) => (
                  <Typography
                    key={chip.key}
                    variant="caption"
                    sx={{
                      borderRadius: "4px",
                      color: "black",
                      whiteSpace: "nowrap",
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                    }}
                  >
                    {chip.label}
                  </Typography>
                ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                mt: 2,
              }}
            >
              No locations available
            </Typography>
          )}
        </Box>
      )}

      {/* City Column - hidden on mobile and tablet if no space */}
      {(isLargeDesktop || isSmallDesktop) && (
        <Box>
          {formattedChipsCity.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {formattedChipsCity.map((chip) => (
                <Typography
                  key={chip.key}
                  variant="caption"
                  sx={{
                    borderRadius: "4px",
                    color: "black",
                    whiteSpace: "nowrap",
                    fontSize: isMobile ? "0.7rem" : "0.8rem",
                  }}
                >
                  {chip.label}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                mt: 2,
              }}
            >
              No locations available
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

const BrandDetails = ({ brandData }) => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { uuid } = useParams();
  
  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Refs for frequently accessed elements
  const mainContainerRef = useRef(null);
  const applyNowButtonRef = useRef(null);

  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationData, setLocationData] = useState({
    states: [],
    districts: [],
    cities: [],
  });
  const [localIsLiked, setLocalIsLiked] = useState(brandData.isLiked);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [shortListed, setShortListed] = useState(brandData);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Memoized data
  const selectedBrand = brandData || {};
  const investorUUID = useMemo(() => localStorage.getItem("investorUUID"), []);
  const AccessToken = useMemo(() => localStorage.getItem("accessToken"), []);
  const { mutate: toggleLike } = useToggleLike();

  // Memoized derived data
  const investmentRanges = useMemo(
    () => [
      ...new Set(
        selectedBrand?.franchiseDetails?.fico?.map((m) => m.investmentRange) || []
      ),
    ],
    [selectedBrand]
  );

  const investmentTimings = useMemo(
    () => ["Immediately", "1 - 3 Months", "3 - 6 Months", "6 + Months"],
    []
  );

  const readyToInvestOptions = useMemo(
    () => ["Own Investment", "Going To Loan", "Need Loan Assistance"],
    []
  );

  const allVideos = useMemo(
    () => selectedBrand?.uploads?.franchisePromotionVideo || [],
    [selectedBrand]
  );

  const allImages = useMemo(
    () => [
      ...(selectedBrand?.uploads?.brandLogo ? [selectedBrand.uploads.brandLogo] : []),
      ...(selectedBrand?.uploads?.exteriorOutlet || []),
      ...(selectedBrand?.uploads?.interiorOutlet || []),
    ],
    [selectedBrand]
  );

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    state: "",
    district: "",
    city: "",
    planToInvest: "",
    readyToInvest: "",
  });

  // Event handlers
  const handleOpenShareClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleLikeClick = useCallback(() => {
    if (isProcessingLike) return;

    setIsProcessingLike(true);
    const newLikeStatus = !localIsLiked;

    // Optimistic update
    setLocalIsLiked(newLikeStatus);

    toggleLike(
      { brandId: brandData.uuid, isLiked: brandData.isLiked },
      {
        onError: () => {
          // Revert on error
          setLocalIsLiked(!newLikeStatus);
        },
        onSettled: () => {
          setIsProcessingLike(false);
        },
      }
    );
  }, [brandData.uuid, brandData.isLiked, isProcessingLike, localIsLiked, toggleLike]);

  const handleToggleShortList = useCallback(async (brandData) => {
    try {
      const response = await handleShortList(brandData);
      if (response.success) {
        setShortListed(prev => !prev);
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  }, []);

  // const handleOpenContact = useCallback(() => setOpenContactModal(true), []);
  const handleCloseContact = useCallback(() => setOpenContactModal(false), []);

  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    },
    []
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const id = investorUUID || localStorage.getItem("brandUUID");

      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        navigate("/registerhandleuser");
        return;
      }

      try {
        const payload = {
          ...formData,
          state: formData.state || "",
          district: formData.district || "",
          city: formData.city || "",
          brandId: selectedBrand?.uuid,
          brandName: selectedBrand?.brandDetails?.brandName || "",
          applyId: id,
        };

        const requiredFields = [
          "fullName",
          "investorEmail",
          "mobileNumber",
          "state",
          "district",
          "city",
          "investmentRange",
          "planToInvest",
          "readyToInvest",
        ];

        const missingFields = requiredFields.filter((field) => !payload[field]);

        if (missingFields.length > 0) {
          alert(`Please fill all required fields: ${missingFields.join(", ")}`);
          return;
        }

        const response = await axios.post(
          "https://mrfranchisebackend.mrfranchise.in/api/v1/instantapply/postApplication",
          payload,
          {
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000),
          }
        );

        if (response.data) {
          setSubmitSuccess(true);
          alert("✅Success! Your application has been submitted.");
          setDrawerOpen(false);
          setFormData({
            fullName: "",
            investorEmail: "",
            mobileNumber: "",
            investmentRange: "",
            state: "",
            district: "",
            city: "",
            planToInvest: "",
            readyToInvest: "",
          });
        }
      } catch (error) {
        console.error(
          "Submission error:",
          error?.response?.data || error.message
        );
        alert("❌Failed to submit application. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedBrand, investorUUID, navigate]
  );

  const handleImageOpen = useCallback((index) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  }, []);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  // API calls
  const fetchInvestorDetails = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;

    try {
      const response = await axios.get(
        `https://mrfranchisebackend.mrfranchise.in/api/v1/investor/getInvestorByUUID/${investorUUID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.data?.data) {
        setUserData(response.data.data);
        setFormData((prev) => ({
          ...prev,
          fullName: response.data.data.firstName || "",
          investorEmail: response.data.data.email || "",
          mobileNumber: response.data.data.mobileNumber || "",
        }));
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch investor details:", error);
      }
    }
  }, [investorUUID, AccessToken]);

  // Effects
  useEffect(() => {
    if (!uuid) return;

    const controller = new AbortController();
    const fetchBrand = async () => {
      try {
        await useBrand(uuid).unwrap();
      } catch (error) {
        console.error("Failed to fetch brand details:", error);
      }
    };

    fetchBrand();
    return () => controller.abort();
  }, [uuid]);

  useEffect(() => {
    if (investorUUID && AccessToken) {
      const controller = new AbortController();
      fetchInvestorDetails();
      return () => controller.abort();
    }
  }, [fetchInvestorDetails, investorUUID, AccessToken]);

  useEffect(() => {
    if (
      selectedBrand?.expansionLocationData?.expansionLocations?.domestic
        ?.locations
    ) {
      const locations =
        selectedBrand.expansionLocationData.expansionLocations.domestic
          .locations;
      const states = [
        ...new Set(locations.map((loc) => loc.state).filter(Boolean)),
      ];
      setLocationData((prev) => ({
        ...prev,
        states,
        districts: [],
        cities: [],
      }));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (
      formData.state &&
      selectedBrand?.expansionLocationData?.expansionLocations?.domestic
        ?.locations
    ) {
      const locations =
        selectedBrand.expansionLocationData.expansionLocations.domestic
          .locations;
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districts = [
        ...new Set(stateObj?.districts?.map((d) => d.district) || []),
      ];
      setLocationData((prev) => ({
        ...prev,
        districts,
        cities: [],
      }));
      setFormData((prev) => ({
        ...prev,
        district: "",
        city: "",
      }));
    }
  }, [formData.state, selectedBrand]);

  useEffect(() => {
    if (
      formData.state &&
      formData.district &&
      selectedBrand?.expansionLocationData?.expansionLocations?.domestic
        ?.locations
    ) {
      const locations =
        selectedBrand.expansionLocationData.expansionLocations.domestic
          .locations;
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districtObj = stateObj?.districts?.find(
        (d) => d.district === formData.district
      );
      const cities = [...new Set(districtObj?.cities || [])];
      setLocationData((prev) => ({
        ...prev,
        cities,
      }));
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [formData.district, formData.state, selectedBrand]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Utility functions
  const getImageBoxSize = useCallback(() => {
    if (isMobile) return 120;
    if (isTablet) return 160;
    if (isSmallDesktop) return 180;
    return 204;
  }, [isMobile, isTablet, isSmallDesktop]);

  const getOutletRange = useCallback((value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return "N/A";
    if (numericValue < 10) return "Below 10";
    const lower = Math.floor(numericValue / 10) * 10;
    const upper = lower + 10;
    return `${lower} - ${upper}`;
  }, []);

  const maskEmail = useCallback((email) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const visiblePart = name.slice(0, 2);
    const maskedPart = "*".repeat(name.length - 2);
    return `${visiblePart}${maskedPart}@${domain}`;
  }, []);

  if (!selectedBrand) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        ref={mainContainerRef}
        sx={{
          width: "90%",
          maxWidth: 1200,
          mx: "auto",
          my: isMobile ? 2 : 4,
          px: isMobile ? 1 : isTablet ? 3 : 4,
        }}
      >
        {/* Floating Apply Now Button */}
        <Box
          sx={{
            position: "fixed",
            bottom: isMobile ? 35 : 300,
            right: isMobile ? 0 : 20,
            left: isMobile ? 0 : "auto",
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
         <Button
  ref={applyNowButtonRef}
  variant="contained"
  size={isMobile ? "medium" : "large"}
  onClick={toggleDrawer(true)}
  sx={{
    backgroundColor: "#ff9800",
    color: "white",
    borderRadius: 50,
    px: 4,
    py: 1.5,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "#e65100",
    },
    fontSize: isMobile ? "0.875rem" : "1rem",
  }}
>
  Apply Now&nbsp; for&nbsp; 
   <strong > {selectedBrand?.brandDetails?.brandName}</strong>
</Button>

        </Box>

        {/* Mobile/Tablet Drawer */}
        <Drawer
          anchor={isMobile || isTablet ? "bottom" : "right"}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: isMobile ? "80vh" : isTablet ? "70vh" : "93vh",
              width: isMobile ? "100%" : isTablet ? "80%" : 430,
              overflow: "auto",
              mx: "auto",
            },
          }}
        >
          <Box sx={{ p: isMobile ? 2 : 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#ff9800">
                Apply for Franchise  
                <Typography display={'flex'} flexDirection={'column'}>
                <Typography fontSize={'0.7rem'} color="black">
                  Brand Name: {selectedBrand?.brandDetails?.brandName}
                  </Typography>  
                <Typography fontSize={'0.7rem'} color="black">
                  Brand Category: {selectedBrand?.franchiseDetails?.brandCategories?.child}
                  </Typography>  
              </Typography>
              </Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <Close />
              </IconButton>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid
                spacing={2}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(1, 1fr)",
                  gap: 2,
                }}
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="investorEmail"
                    value={formData.investorEmail || userData?.email || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={
                      formData.mobileNumber || userData?.mobileNumber || ""
                    }
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>
  Select your Store Location

                {/* State Dropdown */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  >
                    {locationData.states.map((state, i) => (
                      <MenuItem key={i} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* District Dropdown */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    disabled={!formData.state}
                  >
                    {locationData.districts.map((district, i) => (
                      <MenuItem key={i} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* City Dropdown */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    disabled={!formData.district}
                  >
                    {locationData.cities.map((city, i) => (
                      <MenuItem key={i} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Investment Range"
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  >
                    {investmentRanges.map((range, i) => (
                      <MenuItem key={i} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Plan to Invest"
                    name="planToInvest"
                    value={formData.planToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  >
                    {investmentTimings.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Ready to Invest"
                    name="readyToInvest"
                    value={formData.readyToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                  >
                    {readyToInvestOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      backgroundColor: "#ff9800",
                      py: 1.5,
                      fontSize: "1rem",
                      "&:disabled": {
                        background: "#e0e0e0",
                        color: "#9e9e9e",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={24}
                          color="inherit"
                          sx={{ mr: 2 }}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Drawer>

        {/* Contact Dialog */}
        <Dialog
          open={openContactModal}
          onClose={handleCloseContact}
          fullWidth
          maxWidth={isMobile ? "xs" : "sm"}
          fullScreen={isMobile}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #000 30%, #000 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: isMobile ? "1.25rem" : "1.5rem",
            }}
          >
            Contact Details
            <IconButton
              aria-label="close"
              onClick={handleCloseContact}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "error.main",
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography fontSize={isMobile ? "0.9rem" : "1rem"}>
                <strong>Manager Name:</strong>{" "}
                {selectedBrand.brandDetails?.ceoName
                  ? `${selectedBrand.brandDetails.ceoName.slice(0, 2)}***`
                  : "N/A"}
              </Typography>

              <Typography fontSize={isMobile ? "0.9rem" : "1rem"}>
                <strong>Mobile Number:</strong>{" "}
                {selectedBrand.brandDetails?.ceoMobile
                  ? `${selectedBrand.brandDetails.ceoMobile.slice(0, 5)}*****`
                  : "N/A"}
              </Typography>

              <Typography fontSize={isMobile ? "0.9rem" : "1rem"}>
                <strong>Email:</strong>{" "}
                {selectedBrand.brandDetails?.email
                  ? maskEmail(selectedBrand.brandDetails.email)
                  : "N/A"}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Brand header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            mb={3}
            gap={2}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={isMobile ? 1 : 3}
              flexDirection={isMobile ? "column" : "row"}
              width="100%"
            >
              <Box
                position="relative"
                sx={{
                  border: "3px solid orange",
                  borderRadius: "10px",
                }}
              >
                <Avatar
                  src={selectedBrand.uploads?.brandLogo}
                  alt={selectedBrand.brandDetails?.brandName}
                  sx={{
                    width: isMobile ? 150 : 200,
                    height: isMobile ? 150 : 200,
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box width="100%">
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection={isMobile ? "column" : "row"}
                    gap={2}
                  >
                    <Box>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          background:
                            "linear-gradient(45deg, #000 30%, #000 90%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textAlign: isMobile ? "center" : "left",
                          fontSize: isMobile ? "center" : "left",
                        }}
                      >
                        {selectedBrand.brandDetails?.brandName}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign={isMobile ? "center" : "left"}
                        fontSize={isMobile ? "0.875rem" : "1rem"}
                      >
                        {selectedBrand.brandDetails?.tagLine}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: isMobile ? 1 : 10,
                          mt: 1,
                          justifyContent: isMobile ? "center" : "flex-start",
                        }}
                      >
                        <Typography fontSize={isMobile ? "0.8rem" : "0.9rem"}>
                          Established Year:{" "}
                          <label variant="body1" color="text.secondary">
                            {selectedBrand.franchiseDetails?.establishedYear ||
                              "N/A"}
                          </label>
                        </Typography>
                        <Typography fontSize={isMobile ? "0.8rem" : "0.9rem"}>
                          Franchise Since:{" "}
                          <label variant="body1" color="text.secondary">
                            {selectedBrand.franchiseDetails
                              ?.franchiseSinceYear || "N/A"}
                          </label>
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        mt: isMobile ? 1 : 0,
                        ml: isMobile ? 0 : 2,
                      }}
                    >
                      <Button
                       ref={applyNowButtonRef}
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        startIcon={<Phone />}
                        onClick={toggleDrawer(true)}
                        sx={{
                          px: isMobile ? 1 : 1.5,
                          py: isMobile ? 1 : 2,
                          bgcolor: "#ff9800",
                          "&:hover": {
                            bgcolor: "#e65100",
                          },
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        }}
                      >
                        VIEW CONTACT
                      </Button>
                      <IconButton
                        sx={{ marginLeft: "90px" }}
                        onClick={handleLikeClick}
                        disabled={isProcessingLike}
                        aria-label={
                          localIsLiked ? "Unlike brand" : "Like brand"
                        }
                      >
                        {isProcessingLike ? (
                          <CircularProgress size={isMobile ? 20 : 24} />
                        ) : (
                          <Favorite
                            sx={{
                              color: brandData?.isLiked
                                ? "#f44336"
                                : "rgba(0, 0, 0, 0.23)",
                            }}
                          />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleShortList(shortListed)}
                        sx={{
                          color: shortListed
                            ? "#7ef400ff"
                            : "rgba(0, 0, 0, 0.23)",
                        }}
                      >
                        <PlaylistAddCheckCircleOutlined />
                      </IconButton>
                      <IconButton
                        onClick={handleOpenShareClick}
                        size={isMobile ? "small" : "medium"}
                      >
                        <ShareOutlined
                          sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                        />
                      </IconButton>
                      <ShareDialogActions
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Responsive table */}
                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 2,
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <Table
                    size={isMobile ? "small" : "medium"}
                    sx={{ minWidth: isMobile ? 600 : "100%" }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#7ad03a",
                          "& td, & th": {
                            padding: isMobile ? "4px 8px" : "8px 12px",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                          },
                        }}
                      >
                        <TableCell sx={{ width: "25%", textAlign: "center" }}>
                          <strong>Category</strong>
                        </TableCell>
                        <TableCell sx={{ width: "18%", textAlign: "center" }}>
                          <strong>Area</strong>
                        </TableCell>
                        <TableCell sx={{ width: "15%", textAlign: "center" }}>
                          <strong>Investment</strong>
                        </TableCell>
                        <TableCell sx={{ width: "15%", textAlign: "center" }}>
                          <strong>Total Outlets</strong>
                        </TableCell>
                        <TableCell sx={{ width: "30%", textAlign: "center" }}>
                          <strong>Expansion Location</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "30%",
                            textAlign: "center",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {selectedBrand.franchiseDetails?.brandCategories
                            ?.child || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            textAlign: "center",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {selectedBrand.franchiseDetails?.fico?.[0]
                            ?.areaRequired || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            textAlign: "center",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {selectedBrand.franchiseDetails?.fico?.[0]
                            ?.investmentRange || "N/A"}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            textAlign: "center",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {getOutletRange(
                            selectedBrand.franchiseDetails?.totalOutlets
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "30%",
                            textAlign: "center",
                            fontSize: isMobile ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {(() => {
                            const locations =
                              selectedBrand.expansionLocationData
                                ?.expansionLocations?.domestic?.locations || [];
                            const states = locations
                              .map((loc) => loc.state)
                              .filter(Boolean);
                            const hasMore = states.length > 2;

                            if (states.length === 0) {
                              return "Multiple Locations";
                            }

                            const visibleStates = states.slice(0, 2).join(", ");

                            return (
                              <>
                                {visibleStates}
                                {hasMore && (
                                  <a
                                    href="#expansion-location"
                                    style={{
                                      marginLeft: 8,
                                      fontSize: "0.7rem",
                                      textDecoration: "none",
                                      color: "#1976d2",
                                      fontWeight: 500,
                                      cursor: "pointer",
                                    }}
                                  >
                                    More
                                  </a>
                                )}
                              </>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ my: 3 }} />

        {/* Media section with responsive layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={4}
          >
            {/* Main video - responsive sizing */}
            <Box flex={isMobile ? "none" : 2}>
              <Box
                sx={{
                  width: "100%",
                  height: isMobile ? 200 : isTablet ? 300 : 416,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
                component={motion.div}
                whileHover={{ scale: 1.01 }}
              >
                {allVideos.length > 0 ? (
                  <video
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  >
                    <source src={allVideos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No promotional video available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Gallery images - responsive grid */}
            <Box flex={1}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(2, 1fr)",
                  gap: 1,
                }}
              >
                {allImages.slice(0, 3).map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: getImageBoxSize(),
                        overflow: "hidden",
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f5f5f5",
                      }}
                      onClick={() => handleImageOpen(index)}
                    >
                      <img
                        src={imageUrl}
                        loading="lazy"
                        alt={`Gallery ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: getImageBoxSize(),
                      overflow: "hidden",
                      borderRadius: 2,
                      cursor: "pointer",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0,0,0,0.05)",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => {
                      setCurrentImageIndex(3);
                      setImageModalOpen(true);
                    }}
                  >
                    <Typography
                      variant={isMobile ? "body2" : "h6"}
                      sx={{
                        fontWeight: 600,
                        textAlign: "center",
                        zIndex: 1,
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      }}
                    >
                      View More ({Math.max(allImages.length - 3, 0)}+)
                    </Typography>
                    {allImages[3] && (
                      <img
                        src={allImages[3]}
                        loading="lazy"
                        alt="Preview"
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.25,
                          zIndex: 0,
                        }}
                      />
                    )}
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ my: 5 }} />

        {/* Overview tab section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <OverviewTab brand={selectedBrand} />
            </motion.div>
          </Box>
        </Box>
        <Dialog
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "rgba(0,0,0,0.9)",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            <Typography>
              Image {currentImageIndex + 1} of {allImages.length}
            </Typography>
            <IconButton
              onClick={() => setImageModalOpen(false)}
              color="inherit"
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: isMobile ? "50vh" : "70vh",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  left: 16,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={handlePrevImage}
              >
                <ArrowBack fontSize="large" />
              </IconButton>

              <img
                src={allImages[currentImageIndex]}
                loading="lazy"
                alt={`Gallery ${currentImageIndex}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />

              <IconButton
                sx={{
                  position: "absolute",
                  right: 16,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={handleNextImage}
              >
                <ArrowForward fontSize="large" />
              </IconButton>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              pb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: "100%",
                overflowX: "auto",
                px: 2,
                py: 1,
              }}
            >
              {allImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      currentImageIndex === index
                        ? "2px solid #1976d2"
                        : "1px solid #555",
                    opacity: currentImageIndex === index ? 1 : 0.7,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img}
                    loading="lazy"
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DialogActions>
        </Dialog>

        {/* Desktop Application Form - responsive layout */}
        {/* {!isMobile && (
          <Box
            sx={{
              mt: 4,
              p: isMobile ? 2 : isTablet ? 3 : 4,
              borderRadius: "16px",
              background: "white",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: "#ff9800",
                fontSize: isMobile
                  ? "1.25rem"
                  : isTablet
                  ? "1.5rem"
                  : "1.75rem",
              }}
            >
              Instant Franchise Application
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid
                spacing={2}
                sx={{
                  display: "grid",
                  gridTemplateColumns: isTablet
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="investorEmail"
                    value={formData.investorEmail || userData?.email || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={
                      formData.mobileNumber || userData?.mobileNumber || ""
                    }
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>

                {/* State Dropdown 
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  >
                    {locationData.states.map((state, i) => (
                      <MenuItem key={i} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* District Dropdown 
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    disabled={!formData.state}
                  >
                    {locationData.districts.map((district, i) => (
                      <MenuItem key={i} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* City Dropdown 
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    disabled={!formData.district}
                  >
                    {locationData.cities.map((city, i) => (
                      <MenuItem key={i} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Investment Range"
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  >
                    {investmentRanges.map((range, i) => (
                      <MenuItem key={i} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Plan to Invest"
                    name="planToInvest"
                    value={formData.planToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  >
                    {investmentTimings.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Ready to Invest"
                    name="readyToInvest"
                    value={formData.readyToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  >
                    {readyToInvestOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  size={isMobile ? "medium" : "large"}
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#ff9800",
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    px: isMobile ? 3 : 4,
                    "&:disabled": {
                      background: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 2 }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </Box>
            </form>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "8px",
                bgcolor: "rgba(102, 126, 234, 0.05)",
                borderLeft: `4px solid rgb(84, 241, 12)`,
              }}
            >
              <Typography
                variant="body2"
                fontSize={isMobile ? "0.8rem" : "0.9rem"}
              >
                <strong>Note:</strong> Our team will contact you within 24 hours
                to discuss the franchise opportunity in detail.
              </Typography>
            </Box>
          </Box>
        )} */}
      </Box>

      {/* Liked brands and tags section */}
      <LikedBrands />
      <SimilarBrands brandData={selectedBrand} />

      <Box
        sx={{
          width: "90%",
          maxWidth: 1200,
          mx: "auto",
          my: 4,
          px: isMobile ? 1 : isTablet ? 3 : 4,
        }}
        color={"#ff9800"}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontSize: isMobile ? "1.25rem" : "1.5rem" }}
        >
          Tags
        </Typography>
        <ExpansionLocationTags 
          brand={selectedBrand} 
          isMobile={isMobile}
          isTablet={isTablet}
          isSmallDesktop={isSmallDesktop}
          isLargeDesktop={isLargeDesktop}
        />
      </Box>

      {/* Back to top button - responsive positioning */}
      {showBackToTop && (
        <Box
          sx={{
            position: "fixed",
            bottom: isMobile ? 16 : 24,
            right: isMobile ? 16 : 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              "&:hover": {
                backgroundColor: "#e65100",
              },
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      )}

      <Footer />
    </>
  );
};

export default React.memo(BrandDetails);
import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  CardMedia,
  CardActionArea,
  Card,
  CardActions,
  IconButton,
  Grid,
  formControlClasses
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { InsertDriveFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BrandDetails from "./BrandDetails";
import ExpansionPlans from "./ExpansionsPlans";
import FranchiseModel from "./FranchiseModel";
import Documentation from "./Documentation";
import Gallery from "./Gallery";
import {
  validateBrandDetails,
  validateExpansionPlans,
  validateFranchiseModel,
  validateDocumentation,
  validateGallery,
} from "./BrandValidation.jsx";

const steps = [
  "Brand Details",
  "Expansion Plan",
  "Franchise Modal",
  "Documentation",
  "Gallery",
];

const initialFormData = {
  brandDetails: {
    companyName: "",
    brandName: "",
    gstin: "",
    categories: [],
    ownerName: "",
    description: "",
    address: "",
    country: "",
    pincode: "",
    location: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    establishedYear: "",
    franchiseSinceYear: "",
  },
  expansionPlans: {
    expansionType: "",
    selectedCountries: [],
    selectedStates: [],
    selectedCities: [],
    selectedIndianStates: [],
    selectedIndianDistricts: [],
  },
  franchiseModal: {
    totalInvestment: "",
    franchiseFee: "",
    royaltyFee: "",
    equipmentCost: "",
    expectedRevenue: "",
    expectedProfit: "",
    spaceRequired: "",
    paybackPeriod: "",
    minimumCashRequired: "",
    companyOwnedOutlets: "",
    franchiseOutlets: "",
    totalOutlets: "",
    targetCities: "",
    targetStates: "",
    expansionFranchiseFee: "",
    expansionRoyalty: "",
    paymentTerms: "",
  },
  documentation: {
    brandLogo: null,

    businessRegistration: null,
    gstCertificate: null,
    franchiseAgreement: null,
    menuCatalog: null,
    interiorPhotos: null,
    fssaiLicense: null,
    panCard: null,
    aadhaarCard: null,
  },
  gallery: {
    mediaFiles: [],
  },
};


// Key for localStorage
const FORM_DATA_KEY = "brandListingFormData";
const FORM_STEP_KEY = "brandListingFormStep";

const BrandListingFormPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    return savedData ? JSON.parse(savedData) : initialFormData;
  });
  const [validationErrors, setValidationErrors] = useState({
    brandDetails: {},
    expansionsErrors: {},
    franchiseModal: {},
    documentation: {},
    gallery: {},
  });
  console.log("Initial Form Data:", formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(() => {
    const savedStep = localStorage.getItem(FORM_STEP_KEY);
    return savedStep ? parseInt(savedStep) : 0;
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
    localStorage.setItem(FORM_STEP_KEY, activeStep.toString());
    setHasUnsavedChanges(true);
  }, [formData, activeStep]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleBrandDetailsChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      brandDetails: { ...prev.brandDetails, [field]: value },
    }));
  }, []);

  const handleExpansionPlansChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      expansionPlans: { ...prev.expansionPlans, [field]: value },
    }));
  }, []);

  const handleFranchiseModelChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      franchiseModal: { ...prev.franchiseModal, [field]: value },
    }));
  }, []);

  const handleDocumentationChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      documentation: { ...prev.documentation, [field]: value },
    }));
  }, []);

  const handleGalleryChange = useCallback((mediaFiles) => {
    setFormData((prev) => ({
      ...prev,
      gallery: { mediaFiles },
    }));
  }, []);

  const validateStep = useCallback(
    (step) => {
      const errors = {};
      let isValid = true;

      switch (step) {
        case 0:
          errors.brandDetails = validateBrandDetails(formData.brandDetails);
          isValid = Object.keys(errors.brandDetails).length === 0;
          break;
        case 1:
          errors.expansionsErrors = validateExpansionPlans(
            formData.expansionPlans
          );
          isValid = Object.keys(errors.expansionsErrors).length === 0;
          break;
        case 2:
          errors.franchiseModal = validateFranchiseModel(
            formData.franchiseModal
          );
          isValid = Object.keys(errors.franchiseModal).length === 0;
          break;
        case 3:
          errors.documentation = validateDocumentation(formData.documentation);
          isValid = Object.keys(errors.documentation).length === 0;
          break;
        case 4:
          errors.gallery = validateGallery(formData.gallery);
          if (Object.keys(errors.gallery).length > 0) {
            setSnackbar({
              open: true,
              message:
                errors.gallery.mediaFiles ||
                "Please upload at least one media file",
              severity: "error",
            });
          }
          isValid = Object.keys(errors.gallery).length === 0;
          break;
        default:
          break;
      }

      setValidationErrors(errors);
      return isValid;
    },
    [formData]
  );

  const handleNext = useCallback(() => {
    const isValid = validateStep(activeStep);

    if (isValid) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSnackbar({
        open: true,
        message: "Please complete all required fields before proceeding",
        severity: "error",
      });
    }
  }, [activeStep, validateStep]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);




  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const isValid = validateStep(activeStep);
    
    if (!isValid) {
      setSnackbar({
        open: true,
        message: "Please complete all required fields before submitting",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
       

      const submissionData = new FormData();
    
     

     // Append gallery media files
      // formData.gallery.mediaFiles.forEach((file, index) => {
      //   submissionData.append('Gallery', file); // Note: Matches backend field name
      // });

      
      // Append JSON data as strings
      submissionData.append("brandDetails", JSON.stringify(formData.brandDetails));
      submissionData.append("expansionPlans", JSON.stringify(formData.expansionPlans));
      submissionData.append("FranchiseModal", JSON.stringify(formData.franchiseModal));
      submissionData.append("brandLogo", formData.documentation.brandLogo );
      submissionData.append("businessRegistration", formData.documentation.businessRegistration );
      submissionData.append("gstCertificate", formData.documentation.gstCertificate );
      submissionData.append("franchiseAgreement", formData.documentation.franchiseAgreement );
      submissionData.append("menuCatalog", formData.documentation.menuCatalog );
      submissionData.append("interiorPhotos", formData.documentation.interiorPhotos );
      submissionData.append("fssaiLicense", formData.documentation.fssaiLicense );
      submissionData.append("panCard", formData.documentation.panCard );
      submissionData.append("aadhaarCard", formData.documentation.aadhaarCard );
      submissionData.append("panCard", formData.documentation.panCard );
      // submissionData.append("gallery", formData.gallery );

       console.log("formData.gallery.mediaFiles:",formData.gallery.mediaFiles)
    
if (Array.isArray(formData.gallery.mediaFiles)) {
  formData.gallery.mediaFiles.forEach((item) => {
    if (item?.file) {
      submissionData.append("gallery", item.file); 
    }
  });
}

// if (Array.isArray(formData.gallery.mediaFiles)) {
//   formData.gallery.mediaFiles.forEach((file) => {
//     submissionData.append("gallery", file); // ✅ No square brackets
//   });
// }

      
console.log("Gallery is array of Files:", formData.gallery.mediaFiles instanceof Array);
console.log("First gallery file type:", formData.gallery.mediaFiles?.[0]?.type);

      const response = await axios.post(
        'https://franchise-backend-wgp6.onrender.com/api/v1/brand/createBrandListing',
        
        submissionData,
        
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          timeout: 15000
        }
      );

      console.log(response.data)
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Form submitted successfully!",
          severity: "success",
        });
        localStorage.removeItem(FORM_DATA_KEY);
        localStorage.removeItem(FORM_STEP_KEY);
        setFormData(initialFormData);
        setActiveStep(0);
        setHasUnsavedChanges(false);
        navigate("/brand-register")
        // setTimeout(() => navigate("/success"), 1500);
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      let errorMessage = "Failed to submit form";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.message || 
                       `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "No response from server";
        } else {
          errorMessage = "Failed to setup request";
        }
      } else {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [activeStep, formData, navigate, validateStep]);
  const handleNavigationAttempt = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      navigate("/");
    }
  }, [hasUnsavedChanges, navigate]);

  const handleConfirmExit = useCallback(() => {
    localStorage.removeItem(FORM_DATA_KEY);
    localStorage.removeItem(FORM_STEP_KEY);
    setHasUnsavedChanges(false);
    setShowExitConfirm(false);
    navigate("/");
  }, [navigate]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  const handlePreview = useCallback(() => {
    const isValid = validateStep(activeStep);
    if (isValid) {
      setShowPreview(true);
    } else {
      setSnackbar({
        open: true,
        message: "Please complete all required fields before previewing",
        severity: "error",
      });
    }
  }, [activeStep, validateStep]);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const getStepContent = useCallback(
    (step) => {
      switch (step) {
        case 0:
          return (
            <BrandDetails
              data={formData.brandDetails}
              errors={validationErrors.brandDetails}
              onChange={handleBrandDetailsChange}
            />
          );
        case 1:
          return (
            <ExpansionPlans
              data={formData.expansionPlans}
              errors={validationErrors.expansionsErrors}
              onChange={handleExpansionPlansChange}
            />
          );
        case 2:
          return (
            <FranchiseModel
              data={formData.franchiseModal}
              errors={validationErrors.franchiseModal}
              onChange={handleFranchiseModelChange}
            />
          );
        case 3:
          return (
            <Documentation
              data={formData.documentation}
              errors={validationErrors.documentation}
              onChange={handleDocumentationChange}
            />
          );
        case 4:
          return (
            <Gallery
              data={formData.gallery.mediaFiles}
              errors={validationErrors.gallery}
              onChange={handleGalleryChange}
            />
          );
        default:
          return <Typography>Unknown step</Typography>;
      }
    },
    [
      formData,
      validationErrors,
      handleBrandDetailsChange,
      handleExpansionPlansChange,
      handleFranchiseModelChange,
      handleDocumentationChange,
      handleGalleryChange,
    ]
  );
  const formatLabel = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };

    
const renderPreviewContent = () => {
  const {
    brandDetails,
    expansionPlans,
    franchiseModal,
    documentation,
    gallery,
  } = formData;

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setMediaDialogOpen(true);
  };

  const handleCloseMediaDialog = () => {
    setMediaDialogOpen(false);
  };

  // Helper function to get preview URL for documentation files
  const getDocumentPreviewUrl = (file) => {
    if (!file) return null;
    if (file instanceof File) return URL.createObjectURL(file);
    if (file.url) return file.url;
    if (typeof file === 'string') return file;
    return null;
  };

    return (
      <Box sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Brand Listing Preview
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#FFBA00" }}>
          Brand Details
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Company Name</TableCell>
                <TableCell>{brandDetails.companyName  || "Not provided"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Brand Name</TableCell>
                <TableCell>{brandDetails.brandName  || "Not provided"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>gstin</TableCell>
                <TableCell>{brandDetails.gstin  || "Not provided"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Categories</TableCell>
                <TableCell>
                  {brandDetails.categories.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {brandDetails.categories.map((cat, index) => (
                        <Chip key={index} label={cat} size="small" />
                      ))}
                    </Box>
                  ) : (
                    "Not specified"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>OwnerName</TableCell>
                <TableCell>{brandDetails.ownerName }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell>
                  {brandDetails.description || "Not provided"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell>{brandDetails.address  || "Not provided"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
                <TableCell>{brandDetails.country  || "Not provided"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> Pincode</TableCell>
                <TableCell>{brandDetails.pincode  || "Not provided"}</TableCell>
              </TableRow>
                <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> Location</TableCell>
                <TableCell>{brandDetails.location  || "Not provided"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                <TableCell>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemText
                        primary={`Email: ${
                          brandDetails.email || "Not provided"
                        }`}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary={`Phone: ${
                          brandDetails.mobileNumber || "Not provided"
                        }`}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary={`WhatsApp: ${
                          brandDetails.whatsappNumber || "Not provided"
                        }`}
                      />
                    </ListItem>
                  </List>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> Website</TableCell>
                <TableCell>{brandDetails.website  || "Not provided"}</TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> Facebook</TableCell>
                <TableCell>{brandDetails.facebook  || "Not provided"}</TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> Website</TableCell>
                <TableCell>{brandDetails.instagram  || "Not provided"}</TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> linkedin</TableCell>
                <TableCell>{brandDetails.linkedin  || "Not provided"}</TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> EstablishedYear</TableCell>
                <TableCell>{brandDetails.establishedYear  || "Not provided"}</TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> FranchiseSinceYear</TableCell>
                <TableCell>{brandDetails.franchiseSinceYear  || "Not provided"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
<Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#FFBA00" }}>
  Expansion Plans
</Typography>
<TableContainer component={Paper} sx={{ mb: 3 }}>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold", width: '30%' }}>Expansion Type</TableCell>
        <TableCell>{expansionPlans.expansionType || "Not specified"}</TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}>Target Locations</TableCell>
        <TableCell>
          {/* International Locations */}
          {expansionPlans.selectedCountries.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Countries:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {expansionPlans.selectedCountries.map((country, index) => (
                  <Chip key={`country-${index}`} label={country} size="small" />
                ))}
              </Box>
            </Box>
          )}
          
          {/* US/Other States */}
          {expansionPlans.selectedStates.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">States/Provinces:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {expansionPlans.selectedStates.map((state, index) => (
                  <Chip key={`state-${index}`} label={state} size="small" />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Cities */}
          {expansionPlans.selectedCities.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Cities:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {expansionPlans.selectedCities.map((city, index) => (
                  <Chip key={`city-${index}`} label={city} size="small" />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Indian States */}
          {expansionPlans.selectedIndianStates.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Indian States:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {expansionPlans.selectedIndianStates.map((state, index) => (
                  <Chip key={`indian-state-${index}`} label={state} size="small" />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Indian Districts */}
          {expansionPlans.selectedIndianDistricts.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Indian Districts:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {expansionPlans.selectedIndianDistricts.map((district, index) => (
                  <Chip key={`indian-district-${index}`} label={district.district ||"unknown"} size="small" />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Show message if no locations are selected */}
          {!expansionPlans.selectedCountries.length && 
           !expansionPlans.selectedStates.length && 
           !expansionPlans.selectedCities.length && 
           !expansionPlans.selectedIndianStates.length && 
           !expansionPlans.selectedIndianDistricts.length && (
            <Typography variant="body2" color="text.secondary">
              No target locations specified
            </Typography>
          )}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#FFBA00" }}>
          Franchise Model
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Total Investment
                </TableCell>
                <TableCell>
                  {franchiseModal.totalInvestment || "Not specified"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Franchise Fee</TableCell>
                <TableCell>
                  {franchiseModal.franchiseFee || "Not specified"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Royalty Fee</TableCell>
                <TableCell>
                  {franchiseModal.royaltyFee || "Not specified"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>EquipmentCost</TableCell>
                <TableCell>
                  {franchiseModal.equipmentCost || "Not specified"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Expected Revenue
                </TableCell>
                <TableCell>
                  {franchiseModal.expectedRevenue || "Not specified"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Space Required
                </TableCell>
                <TableCell>
                  {franchiseModal.spaceRequired || "Not specified"}
                </TableCell>
              </TableRow>
                <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>PaybackPeriod</TableCell>
                <TableCell>
                  {franchiseModal.paybackPeriod || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>MinimumCashRequired</TableCell>
                <TableCell>
                  {franchiseModal.minimumCashRequired || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>CompanyOwnedOutlets</TableCell>
                <TableCell>
                  {franchiseModal.companyOwnedOutlets || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>FranchiseOutlets</TableCell>
                <TableCell>
                  {franchiseModal.franchiseOutlets || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>TotalOutlets</TableCell>
                <TableCell>
                  {franchiseModal.totalOutlets || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>TargetCities</TableCell>
                <TableCell>
                  {franchiseModal.targetCities || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>TargetStates</TableCell>
                <TableCell>
                  {franchiseModal.targetStates || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ExpansionFranchiseFee</TableCell>
                <TableCell>
                  {franchiseModal.expansionFranchiseFee || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ExpansionRoyalty</TableCell>
                <TableCell>
                  {franchiseModal.expansionRoyalty || "Not specified"}
                </TableCell>
              </TableRow>
                 <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>aymentTerms</TableCell>
                <TableCell>
                  {franchiseModal.paymentTerms || "Not specified"}
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#FFBA00" }}>
        Documentation
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            {Object.entries(documentation).map(([docType, file]) => {
              const previewUrl = getDocumentPreviewUrl(file);
              const isImage = file?.type?.includes('image') || 
                            (typeof file === 'string' && /\.(jpeg|jpg|png|gif)$/i.test(file)) || 
                            (file?.url && /\.(jpeg|jpg|png|gif)$/i.test(file.url));

              return (
                <TableRow key={docType}>
                  <TableCell sx={{ fontWeight: "bold", width: '30%' }}>
                    {formatLabel(docType)}
                  </TableCell>
                  <TableCell>
                    {file ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isImage ? (
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: 1,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1px solid #eee'
                            }}
                            onClick={() => handleMediaClick({
                              preview: previewUrl,
                              type: 'image',
                              name: file.name || docType
                            })}
                          >
                            <img
                              src={previewUrl}
                              alt={docType}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsertDriveFile sx={{ fontSize: 40, color: 'grey.500' }} />
                            <Typography variant="body2">
                              {file.name || docType}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not uploaded
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#FFBA00" }}>
        Gallery
      </Typography>
      
      {gallery.mediaFiles.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {gallery.mediaFiles.map((media, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ position: 'relative' }}>
                <CardActionArea onClick={() => handleMediaClick(media)}>
                  {media.type === 'video' ? (
                    <>
                      <CardMedia
                        component="video"
                        src={media.preview || media.url}
                        sx={{
                          height: 140,
                          width: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          px: 1,
                          borderRadius: 1
                        }}
                      >
                        <VideocamIcon fontSize="small" />
                      </Box>
                    </>
                  ) : (
                    <CardMedia
                      component="img"
                      image={media.preview || media.url}
                      alt={`Image ${index + 1}`}
                      sx={{
                        height: 140,
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </CardActionArea>
                <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {media.name || `Media ${index + 1}`}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ mb: 3 }}>
          No media files uploaded
        </Typography>
      )}

      {/* Media Preview Dialog */}
      <Dialog
        open={mediaDialogOpen}
        onClose={handleCloseMediaDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>
              {selectedMedia?.name || 'Media Preview'}
            </Typography>
            <IconButton onClick={handleCloseMediaDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMedia && (
            selectedMedia.type === 'video' ? (
              <Box sx={{ width: '100%', pt: '56.25%', position: 'relative' }}>
                <video
                  controls
                  autoPlay
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  src={selectedMedia.preview || selectedMedia.url}
                />
              </Box>
            ) : (
              <Box
                component="img"
                src={selectedMedia.preview || selectedMedia.url}
                alt="Preview"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            )
          )}
        </DialogContent>
      </Dialog>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, minHeight: "80vh" }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 5,
          p: isMobile ? 2 : 4,
          mt: 0,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: "#333",
            fontWeight: "bold",
            mt: 0,
          }}
        >
          Brand Listing Form
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: isMobile ? "0.7rem" : "0.875rem",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: "60vh", mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            margin: "20px",
            alignItems: "center",
            pt: 3,
            borderTop: "1px solid #eee",
            flexWrap: "wrap",
          }}
        >
          {activeStep === 0 ? (
            <Button
              variant="outlined"
              onClick={handleNavigationAttempt}
              sx={{
                backgroundColor: "#fff",
                color: "#FFBA00",
                borderColor: "#FFBA00",
                "&:hover": {
                  backgroundColor: "#FFF5E0",
                  borderColor: "#FFBA00",
                },
                minWidth: 120,
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                backgroundColor: "#fff",
                color: "#FFBA00",
                borderColor: "#FFBA00",
                "&:hover": {
                  backgroundColor: "#FFF5E0",
                  borderColor: "#FFBA00",
                },
                minWidth: 120,
              }}
            >
              Back
            </Button>
          )}

          {activeStep === steps.length - 1 && (
            <Button
              variant="outlined"
              onClick={handlePreview}
              sx={{
                backgroundColor: "#fff",
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1976d2",
                },
                minWidth: 120,
              }}
            >
              Preview
            </Button>
          )}

          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#7AD03A",
                "&:hover": {
                  backgroundColor: "#68B82E",
                },
                minWidth: 120,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: "#FFBA00",
                "&:hover": {
                  backgroundColor: "#E6A800",
                },
                minWidth: 120,
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

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

      <Dialog
        open={showExitConfirm}
        onClose={handleCancelExit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have unsaved changes. Are you sure you want to leave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelExit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmExit} color="primary" autoFocus>
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={showPreview}
        onClose={handleClosePreview}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: isMobile ? 1 : 3,
        }}
      >
        <Paper
          sx={{
            width: isMobile ? "100%" : "80%",
            maxWidth: 1000,
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          {renderPreviewContent()}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              borderTop: "1px solid #eee",
            }}
          >
            <Button
              onClick={handleClosePreview}
              variant="contained"
              sx={{
                backgroundColor: "#FFBA00",
                "&:hover": {
                  backgroundColor: "#E6A800",
                },
              }}
            >
              Close Preview
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default BrandListingFormPage;
import React, { useState } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BrandDetails from "./BrandDetails";
import ExpansionPlans from "./ExpansionsPlans";
import FranchiseModel from "./FranchiseModel";
import Documentation from "./Documentation";
import Gallery from "./Gallery";
import { Margin } from "@mui/icons-material";

const steps = [
  "Brand Details",
  "Expansion Plan",
  "Franchise Modal",
  "Documentation",
  "Gallery",
];

function BrandListingPage() {
  const [formData, setFormData] = useState({
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
      expansionType: "none",
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
  });
  console.log(formData.brandDetails);

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
    navigate("/success");
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BrandDetails
            data={formData.brandDetails}
            onChange={(field, value) =>
              handleChange("brandDetails", field, value)
            }
          />
        );
      case 1:
        return (
          <ExpansionPlans
            data={formData.expansionPlans}
            onChange={(field, value) =>
              handleChange("expansionPlans", field, value)
            }
          />
        );
      case 2:
        return (
          <FranchiseModel
            data={formData.franchiseModal}
            onChange={(field, value) =>
              handleChange("franchiseModal", field, value)
            }
          />
        );
      case 3:
        return (
          <Documentation
            data={formData.documentation}
            onChange={(field, value) =>
              handleChange("documentation", field, value)
            }
          />
        );
      case 4:
        return (
          <Gallery
            data={formData.gallery.mediaFiles}
            onChange={(mediaFiles) =>
              handleChange("gallery", "mediaFiles", mediaFiles)
            }
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Brand Listing Page
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", 
          width: "100%", // Takes full width
          mt: 2, // Add some top margin
          mb: 2, // Add some bottom margin
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2, // Adds consistent spacing between buttons
          }}
        >
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ my: 3 }}>{getStepContent(activeStep)}</Box>
    </Container>
  );
}

export default BrandListingPage;

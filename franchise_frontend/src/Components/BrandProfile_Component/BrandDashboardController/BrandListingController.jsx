import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BrandDetailsControl from './BrandDetailsControl';
import { Box, Button, Snackbar, Alert, CircularProgress, Card, CardContent, CardHeader } from '@mui/material';
import FranchiseDetailsControl from './FranchiseDetailsControl';
import ExpansionLocationControl from './ExpansionLocationControl';
import UploadsControl from './UploadsControl';

// Helper function to flatten API data to form structure
const flattenBrandData = (brandDoc) => {
  if (!brandDoc) return {};
  
  return {
    // Brand Details
    fullName: brandDoc.brandDetails?.fullName || "",
    email: brandDoc.brandDetails?.email || "",
    mobileNumber: brandDoc.brandDetails?.mobileNumber || "",
    whatsappNumber: brandDoc.brandDetails?.whatsappNumber || "",
    companyName: brandDoc.brandDetails?.companyName || "",
    brandName: brandDoc.brandDetails?.brandName || "",
    tagLine: brandDoc.brandDetails?.tagLine || "",
    ceoName: brandDoc.brandDetails?.ceoName || "",
    ceoEmail: brandDoc.brandDetails?.ceoEmail || "",
    ceoMobile: brandDoc.brandDetails?.ceoMobile || "",
    officeEmail: brandDoc.brandDetails?.officeEmail || "",
    officeMobile: brandDoc.brandDetails?.officeMobile || "",
    headOfficeAddress: brandDoc.brandDetails?.headOfficeAddress || "",
    country: brandDoc.brandDetails?.country || "",
    state: brandDoc.brandDetails?.state || "",
    district: brandDoc.brandDetails?.district || "",
    city: brandDoc.brandDetails?.city || "",
    pincode: brandDoc.brandDetails?.pincode || "",
    website: brandDoc.brandDetails?.website || "",
    facebook: brandDoc.brandDetails?.facebook || "",
    instagram: brandDoc.brandDetails?.instagram || "",
    linkedin: brandDoc.brandDetails?.linkedin || "",
    gstNumber: brandDoc.brandDetails?.gstNumber || "",
    pancardNumber: brandDoc.brandDetails?.pancardNumber || "",
    
    // Franchise Details
    brandCategories: brandDoc.franchiseDetails?.brandCategories || [],
    aidFinancing: brandDoc.franchiseDetails?.aidFinancing || "",
    brandDescription: brandDoc.franchiseDetails?.brandDescription || "",
    companyOwnedOutlets: brandDoc.franchiseDetails?.companyOwnedOutlets || "",
    consultationOrAssistance: brandDoc.franchiseDetails?.consultationOrAssistance || "",
    establishedYear: brandDoc.franchiseDetails?.establishedYear || "",
    franchiseDevelopment: brandDoc.franchiseDetails?.franchiseDevelopment || "",
    franchiseOutlets: brandDoc.franchiseDetails?.franchiseOutlets || "",
    franchiseSinceYear: brandDoc.franchiseDetails?.franchiseSinceYear || "",
    totalOutlets: brandDoc.franchiseDetails?.totalOutlets || "",
    fico: brandDoc.franchiseDetails?.fico || [],
    trainingSupport: brandDoc.franchiseDetails?.trainingSupport || [],
    uniqueSellingPoints: brandDoc.franchiseDetails?.uniqueSellingPoints || [],
    
    // Expansion Data
    currentOutletLocations: brandDoc.expansionLocationData?.currentOutletLocations || {},
    expansionLocations: brandDoc.expansionLocationData?.expansionLocations || {},
    isInternationalExpansion: brandDoc.expansionLocationData?.isInternationalExpansion || "No",
    
    // Uploads
    brandLogo: brandDoc.uploads?.brandLogo || [],
    exteriorOutlet: brandDoc.uploads?.exteriorOutlet || [],
    franchisePromotionVideo: brandDoc.uploads?.franchisePromotionVideo || [],
    gstCertificate: brandDoc.uploads?.gstCertificate || [],
    interiorOutlet: brandDoc.uploads?.interiorOutlet || [],
    pancard: brandDoc.uploads?.pancard || [],
    businessPlan: brandDoc.uploads?.businessPlan || [],
    awards: brandDoc.uploads?.awards || [],
    
  
  };
};

// Helper function to unflatten form data to API structure
const unflattenFormData = (formData) => {
  return {
    brandDetails: {
      fullName: formData.fullName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      whatsappNumber: formData.whatsappNumber,
      companyName: formData.companyName,
      brandName: formData.brandName,
      tagLine: formData.tagLine,
      ceoName: formData.ceoName,
      ceoEmail: formData.ceoEmail,
      ceoMobile: formData.ceoMobile,
      officeEmail: formData.officeEmail,
      officeMobile: formData.officeMobile,
      headOfficeAddress: formData.headOfficeAddress,
      country: formData.country,
      state: formData.state,
      district: formData.district,
      city: formData.city,
      pincode: formData.pincode,
      website: formData.website,
      facebook: formData.facebook,
      instagram: formData.instagram,
      linkedin: formData.linkedin,
      gstNumber: formData.gstNumber,
      pancardNumber: formData.pancardNumber
    },
    franchiseDetails: {
      brandCategories: formData.brandCategories,
      aidFinancing: formData.aidFinancing,
      brandDescription: formData.brandDescription,
      companyOwnedOutlets: formData.companyOwnedOutlets,
      consultationOrAssistance: formData.consultationOrAssistance,
      establishedYear: formData.establishedYear,
      franchiseDevelopment: formData.franchiseDevelopment,
      franchiseOutlets: formData.franchiseOutlets,
      franchiseSinceYear: formData.franchiseSinceYear,
      totalOutlets: formData.totalOutlets,
      fico: formData.fico,
      trainingSupport: formData.trainingSupport,
      uniqueSellingPoints: formData.uniqueSellingPoints
    },
    expansionLocationData: {
      currentOutletLocations: formData.currentOutletLocations,
      expansionLocations: formData.expansionLocations,
      isInternationalExpansion: formData.isInternationalExpansion
    },
    uploads: {
      brandLogo: formData.brandLogo,
      exteriorOutlet: formData.exteriorOutlet,
      franchisePromotionVideo: formData.franchisePromotionVideo,
      gstCertificate: formData.gstCertificate,
      interiorOutlet: formData.interiorOutlet,
      pancard: formData.pancard,
      businessPlan: formData.businessPlan,
      awards: formData.awards
    }
   
  };
};

const initialFormData = {
  fullName: "",
  email: "",
  mobileNumber: "",
  whatsappNumber: "",
  companyName: "",
  brandName: "",
  tagLine: "",
  ceoName: "",
  ceoEmail: "",
  ceoMobile: "",
  officeEmail: "",
  officeMobile: "",
  headOfficeAddress: "",
  country: "",
  state: "",
  district: "",
  city: "",
  pincode: "",
  website: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  gstNumber: "",
  pancardNumber: "",
  brandCategories: [],
  aidFinancing: "",
  brandDescription: "",
  companyOwnedOutlets: "",
  consultationOrAssistance: "",
  establishedYear: "",
  franchiseDevelopment: "",
  franchiseOutlets: "",
  franchiseSinceYear: "",
  totalOutlets: "",
  fico: [],
  trainingSupport: [],
  uniqueSellingPoints: [],
  currentOutletLocations: {},
  expansionLocations: {},
  isInternationalExpansion: "No",
  brandLogo: [],
  exteriorOutlet: [],
  franchisePromotionVideo: [],
  gstCertificate: [],
  interiorOutlet: [],
  pancard: [],
  businessPlan: [],
  awards: [],

};

const BrandListingController = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState({ 
    loading: false, 
    success: false, 
    error: '' 
  });

  // Fetch brand data on mount
  useEffect(() => {
    const fetchBrandData = async () => {
      const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
      // console.log("✅ UUID from localStorage:", uuid);

      if (!uuid) {
        setError("No UUID found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting/getBrandListingByUUID/${uuid}`
        );

        // console.log("✅ Full API Response:", response.data);

        const brand = response.data.brandListing || response.data.data;

        if (response.data.success && brand) {
          const flattenedData = flattenBrandData(brand);
          // console.log("✅ Flattened form data:", flattenedData);
          
          setOriginalData(brand);
          setFormData(flattenedData);
        } else {
          setError("No brand data found.");
        }
      } catch (err) {
        // console.error("❌ Error fetching brand:", err);
        setError(err.response?.data?.message || "Failed to load brand data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  // Handle form field changes
  const handleFormChange = (update) => {
    setFormData(prev => ({
      ...prev,
      ...update
    }));
  };

  // Save updated data to API
  const handleSave = async () => {
    const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
    if (!uuid) {
      setSaveStatus({ loading: false, success: false, error: "UUID not found." });
      return;
    }

    setSaveStatus({ loading: true, success: false, error: '' });

    try {
      // Convert flat form data back to API structure
      const apiData = unflattenFormData(formData);
      // console.log("📤 Saving data to API:", apiData);

      const response = await axios.put(
        `https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting/updateBrandListingByUUID/${uuid}`,
        apiData
      );

      // console.log("✅ Save response:", response.data);

      if (response.data.success) {
        // Update original data with new response
        setOriginalData(response.data.brandListing || response.data.data);
        setSaveStatus({ loading: false, success: true, error: '' });
      } else {
        throw new Error(response.data.message || "Failed to save changes");
      }
    } catch (err) {
      // console.error("❌ Save error:", err);
      setSaveStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Failed to save changes"
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
   <Box sx={{ p: 3 }}>
    {/* Brand Details */}
  <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
    <CardHeader
      title="Brand Details"
      sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd', mb: 2 }}
      titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
    />

    <CardContent>
      <BrandDetailsControl 
        data={formData} 
        onChange={handleFormChange} 
        errors={{}} 
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saveStatus.loading}
          startIcon={saveStatus.loading ? <CircularProgress size={20} /> : null}
          sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
        >
          {saveStatus.loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </CardContent>
  </Card>
{/* Franchise Details */}
   <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
    <CardHeader
      title="Franchise Details"
      sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd', mb: 2 }}
      titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
    />

    <CardContent>
      <FranchiseDetailsControl 
        data={formData} 
        onChange={handleFormChange} 
        errors={{}} 
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saveStatus.loading}
          startIcon={saveStatus.loading ? <CircularProgress size={20} /> : null}
          sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
        >
          {saveStatus.loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </CardContent>
  </Card>
{/* Expansion Location */}
 <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
    <CardHeader
      title="Expansion Location"
      sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd', mb: 2 }}
      titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
    />

    <CardContent>
      <ExpansionLocationControl
        data={formData} 
        onChange={handleFormChange} 
        errors={{}} 
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saveStatus.loading}
          startIcon={saveStatus.loading ? <CircularProgress size={20} /> : null}
          sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
        >
          {saveStatus.loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </CardContent>
  </Card>
  {/* Uploads */}
 <Card elevation={3} sx={{ p: 2, borderRadius: 3 }}>
    <CardHeader
      title="Uploads"
      sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd', mb: 2 }}
      titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
    />

    <CardContent>
      <UploadsControl
        data={formData} 
        onChange={handleFormChange} 
        errors={{}} 
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saveStatus.loading}
          startIcon={saveStatus.loading ? <CircularProgress size={20} /> : null}
          sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
        >
          {saveStatus.loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </CardContent>
  </Card>
  
  <Snackbar
    open={saveStatus.success || !!saveStatus.error}
    autoHideDuration={6000}
    onClose={() => setSaveStatus(prev => ({ ...prev, success: false, error: '' }))}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert 
      severity={saveStatus.success ? 'success' : 'error'} 
      sx={{ width: '100%' }}
    >
      {saveStatus.success ? 'Changes saved successfully!' : saveStatus.error}
    </Alert>
  </Snackbar>
</Box>

  );
};

export default BrandListingController;